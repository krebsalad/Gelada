const EMPTY_FILTER = "";
const LIMITS = ["10", "25", "100", "UNLIMITED"];

function checkGeladaHeartbeat($http, $scope) {
    $http({
        method: "GET",
        url: "http://localhost:7200/repositories/gelada?query=" + encodeURI("SELECT * WHERE{}"),
        headers: {'Accept': 'application/sparql-results+json', 'Content-Type': 'application/sparql-results+json'},
    }).then(function () {
        $scope.geladaOnline = true;
        console.log("Gelada healthy!");
    }, function () {
        $scope.geladaOnline = false;
        console.error("Gelada not healthy!")
    });
}

function getPreviewedGames($http, $scope, filters) {
    let query = "PREFIX gla: <http://www.gelada.org/ontology/>" +
        "PREFIX owl: <http://www.w3.org/2002/07/owl#> \n" +
        "SELECT DISTINCT ?game (SAMPLE(?name1) as ?name) (SAMPLE(?screenshot1) as ?screenshot) (SAMPLE(?releaseDate1) as ?releaseDate) where{\n" +
        "    ?game a gla:Game .\n" +
        "    FILTER NOT EXISTS { \n" +
        "        ?game (owl:sameAs|^owl:sameAs)* ?_game .\n" +
        "        FILTER( str(?game) < str(?_game) ) } \n";

    let exclusive = false;
    filters.forEach(f => {
        if (f) {
            if (f === 'exclusive:yes') {
                exclusive = true;
            } else if (f === 'exclusive:no') {
                exclusive = false;
            } else if (f.length > 0) {
                if (f.startsWith("gla:")) {
                    query += ("    ?game " + f + " .\n");
                }else{
                    query += (f + " .\n");
                }
            }
        }
    });
    if (exclusive) {
        query += "?game gla:hasPlatform ?platform .\n" +
        "    FILTER NOT EXISTS { \n" +
        "        ?platform (owl:sameAs|^owl:sameAs)* ?_platform .\n" +
        "        FILTER( str(?platform) < str(?_platform) ) } \n";
    }
    query +=
        "    ?game gla:hasName ?name1 .\n" +
        "    OPTIONAL {?game gla:hasScreenshot ?screenshot1 .}\n" +
        "    OPTIONAL {?game gla:hasReleaseDate ?releaseDate1 .}\n" +
        "    OPTIONAL {?game gla:hasPlatform ?platform .}\n" +
        "}\n";
    query += "GROUP BY ?game\n";
    if (exclusive) {
        query += "HAVING (COUNT (?platform) = 1)\n"
    }
    if ($scope.chosenLimit) {
        if ($scope.chosenLimit !== 'UNLIMITED') {
            query += "LIMIT " + $scope.chosenLimit;
        }
    } else {
        query += "LIMIT 10";
    }

    queryLocalhost(query, $http, data => {
        const previewGames = [];
        angular.forEach(data.data.results.bindings, function (val) {
            const game = {};
            game.name = safeField(val.name);
            game.uri = safeField(val.game);
            game.releaseDate = safeField(val.releaseDate);
            game.imgUrl = safeImage(val.screenshot);
            previewGames.push(game);
        });
        if ($scope.filteredGames) {
            $scope.filteredGames.length = 0;
            $scope.originalGames.length = 0;
            previewGames.forEach(p => $scope.filteredGames.push(p));
        } else {
            $scope.originalGames = [];
            $scope.filteredGames = previewGames;
        }
        $scope.filteredGames.forEach(p => $scope.originalGames.push(p));
    });
}


function getGameDetails($http, $scope, uri) {
    $scope.clickedGame = {};
    uri = escapeOntologyUri(uri);
    const basicInfoQuery = "PREFIX gla: <http://www.gelada.org/ontology/>\n" + "PREFIX owl: <http://www.w3.org/2002/07/owl#> \n" +
        "SELECT * where{\n" +
        "    " + uri + " gla:hasName ?name .\n" +
        "    FILTER NOT EXISTS { \n" +
        "        " + uri + " (owl:sameAs|^owl:sameAs)* ?_node .\n" +
        "        FILTER( str(" + uri + ") < str(?_node) ) } \n" +
        "    OPTIONAL {" + uri + " gla:hasAlternativeName ?alternativeName .}\n" +
        "    OPTIONAL {" + uri + " gla:hasScreenshot ?screenshot .}\n" +
        "    OPTIONAL {" + uri + " gla:hasReleaseDate ?releaseDate .}\n" +
        "    OPTIONAL {" + uri + " gla:hasSingleplayer ?singleplayer .}\n" +
        "    OPTIONAL {" + uri + " gla:hasMultiplayer ?multiplayer .}\n" +
        "    OPTIONAL {" + uri + " gla:hasAbstract ?abstract .}\n" +
        "    OPTIONAL {" + uri + " gla:hasGenre ?genre . \n ?genre gla:hasName ?genreName .}\n" +
        "    OPTIONAL {" + uri + " gla:hasVideo ?video .}\n" +
        "}";


    queryLocalhost(basicInfoQuery, $http, data => {
        angular.forEach(data.data.results.bindings, function (val) {
            $scope.clickedGame.name = safeField(val.name);
            $scope.clickedGame.imgUrl = safeImage(val.screenshot);
            $scope.clickedGame.alternativeName = safeField(val.alternativeName);
            $scope.clickedGame.releaseDate = safeField(val.releaseDate);
            $scope.clickedGame.singleplayer = safeField(val.singleplayer);
            $scope.clickedGame.multiplayer = safeField(val.multiplayer);
            $scope.clickedGame.genre = safeField(val.genreName);
            $scope.clickedGame.abstract = safeField(val.abstract);
            $scope.clickedGame.videoUrl = safeField(val.video);
        });
    });


    const platformsQuery = "PREFIX gla: <http://www.gelada.org/ontology/>\n" + "PREFIX owl: <http://www.w3.org/2002/07/owl#> \n" +
        "SELECT DISTINCT ?platform (SAMPLE(?name1) as ?name) (SAMPLE(?imgUrl1) as ?imgUrl) (SAMPLE(?abstract1) as ?abstract) where{\n" +
        "    " + uri + " gla:hasPlatform ?platform .\n" +
        "    FILTER NOT EXISTS { \n" +
        "        ?platform (owl:sameAs|^owl:sameAs)* ?_platform .\n" +
        "        FILTER( str(?platform) < str(?_platform) ) } \n" +
        "    ?platform gla:hasName ?name1 .\n" +
        "    OPTIONAL {?platform gla:hasScreenshot ?imgUrl1} .\n" +
        "    OPTIONAL {?platform gla:hasAbstract ?abstract1} .\n" +
        "}GROUP BY ?platform ";

    queryLocalhost(platformsQuery, $http, data => {
        const platforms = [];
        angular.forEach(data.data.results.bindings, function (val) {
            const platform = {};
            platform.uri = safeField(val.platform);
            platform.name = safeField(val.name);
            platform.imgUrl = safeImage(val.imgUrl);
            platform.abstract = safeField(val.abstract);
            platforms.push(platform);
        });
        $scope.clickedGame.platforms = platforms;
    });

    const charactersQuery = "PREFIX gla: <http://www.gelada.org/ontology/>\n" +
        "SELECT ?character (SAMPLE(?name1) as ?name) where{\n" +
        "   " + uri + " gla:hasCharacter ?character .\n" +
        "    ?character gla:hasName ?name1 .\n" +
        "} GROUP BY ?character";

    queryLocalhost(charactersQuery, $http, data => {
        const characters = [];
        angular.forEach(data.data.results.bindings, function (val) {
            const character = {};
            character.uri = safeField(val.character);
            character.name = safeField(val.name);
            characters.push(character);
        });
        $scope.clickedGame.characters = characters;
    });

    const organizationQuery = "PREFIX gla: <http://www.gelada.org/ontology/>\n" +
        "SELECT ?org (SAMPLE(?name1) as ?name) (REPLACE(str(?role), \"^.*/\", \"\") as ?rolestring) where{\n" +
        "    ?org a gla:Organization .\n" +
        "    ?org gla:hasName ?name1 .\n" +
        "    " + uri + " ?role ?org .\n" +
        "} GROUP BY ?org ?role"

    queryLocalhost(organizationQuery, $http, data => {
        const organizations = [];
        angular.forEach(data.data.results.bindings, function (val) {
            const organization = {};
            organization.uri = safeField(val.org);
            organization.name = safeField(val.name);
            organization.role = safeField(val.rolestring);
            organizations.push(organization);
        });
        $scope.clickedGame.organizations = organizations;
    });

    const prequelsQuery = "PREFIX gla: <http://www.gelada.org/ontology/>\n" +
        "select distinct ?prequel (SAMPLE(?name1) as ?name) (SAMPLE(?img1) as ?img) where {\n" +
        "    " + uri + " a gla:Game .\n" +
        "    " + uri + " gla:hasPrequel ?prequel .\n" +
        "    ?prequel gla:hasName ?name1 .\n" +
        "    OPTIONAL {?prequel gla:hasScreenshot ?img1}\n" +
        "    OPTIONAL {?prequel gla:hasReleaseDate ?pRD .}\n" +
        "}\n" +
        "GROUP BY ?prequel \n order by ASC(?prD)\n";

    queryLocalhost(prequelsQuery, $http, data => {
        const prequels = [];
        angular.forEach(data.data.results.bindings, function (val) {
            const prequel = {};
            prequel.uri = safeField(val.prequel);
            prequel.name = safeField(val.name);
            prequel.imgUrl = safeImage(val.img);
            prequels.push(prequel);
        });
        $scope.clickedGame.prequels = prequels;
    });

    const sequelsQuery = "PREFIX gla: <http://www.gelada.org/ontology/>\n" +
        "select distinct ?sequel (SAMPLE(?name1) as ?name) (SAMPLE(?img1) as ?img) where {\n" +
        "    " + uri + " a gla:Game .\n" +
        "    " + uri + " gla:hasSequel ?sequel .\n" +
        "    ?sequel gla:hasName ?name1 .\n" +
        "    OPTIONAL {?sequel gla:hasScreenshot ?img1}\n" +
        "    OPTIONAL {?sequel gla:hasReleaseDate ?pRD .}\n" +
        "}\n" +
        "GROUP BY ?sequel \n order by ASC(?prD)\n";

    queryLocalhost(sequelsQuery, $http, data => {
        const sequels = [];
        angular.forEach(data.data.results.bindings, function (val) {
            const sequel = {};
            sequel.uri = safeField(val.sequel);
            sequel.name = safeField(val.name);
            sequel.imgUrl = safeImage(val.img);
            sequels.push(sequel);
        });
        $scope.clickedGame.sequels = sequels;
    });
}

function initializeFilters($http, $scope) {
    $scope.resultLimits = [];
    $scope.chosenLimit = "10";
    LIMITS.forEach(l => $scope.resultLimits.push(l));
    getGenerationFilterValues($http, $scope);
    getPlatformFilterValues($http, $scope);
    getGenreFilterValues($http, $scope);
}


function getGenerationFilterValues($http, $scope) {
    const query = "PREFIX gla: <http://www.gelada.org/ontology/>" +
        "\n" +
        "SELECT DISTINCT ?generation where{\n" +
        "    ?s gla:hasGeneration ?generation .\n" +
        "} ORDER BY ASC(?generation)";
    queryLocalhost(query, $http, data => {
        const generations = [EMPTY_FILTER];
        angular.forEach(data.data.results.bindings, function (val) {
            generations.push(safeField(val.generation));
        });
        $scope.generations = generations;
    })
}


function getPlatformFilterValues($http, $scope) {
    const query = "PREFIX gla: <http://www.gelada.org/ontology/>\n" + "PREFIX owl: <http://www.w3.org/2002/07/owl#> \n" +
        "SELECT DISTINCT ?platform (SAMPLE(?name1) as ?name) where{\n" +
        "         ?platform a gla:Platform .\n" +
        "         FILTER NOT EXISTS { \n" +
        "             ?platform (owl:sameAs|^owl:sameAs)* ?_platform .\n" +
        "             FILTER( str(?platform) < str(?_platform) ) } \n" +
        "         ?platform gla:hasName ?name1 .\n" +
        "} \n" +
        "GROUP BY ?platform\n" +
        "ORDER BY ASC(?name)\n";
    queryLocalhost(query, $http, data => {
        const platforms = [EMPTY_FILTER];
        angular.forEach(data.data.results.bindings, function (val) {
            const platform = {};
            platform.uri = safeField(val.platform);
            platform.name = safeField(val.name);
            platforms.push(platform);
        });
        $scope.platforms = platforms;
    })
}


function getGenreFilterValues($http, $scope) {
    const query = "PREFIX gla: <http://www.gelada.org/ontology/>\n" + "PREFIX owl: <http://www.w3.org/2002/07/owl#> \n" +
        "SELECT DISTINCT ?genre (SAMPLE(?name1) as ?name) where{\n" +
        "         ?genre a gla:Genre .\n" +
        "         FILTER NOT EXISTS { \n" +
        "             ?genre (owl:sameAs|^owl:sameAs)* ?_genre .\n" +
        "             FILTER( str(?genre) < str(?_genre) ) } \n" +
        "         ?genre gla:hasName ?name1 .\n" +
        "} \n" +
        "GROUP BY ?genre\n" +
        "ORDER BY ASC (?name)\n";
    queryLocalhost(query, $http, data => {
        const genres = [EMPTY_FILTER];
        angular.forEach(data.data.results.bindings, function (val) {
            const genre = {};
            genre.uri = safeField(val.genre);
            genre.name = safeField(val.name);
            genres.push(genre);
        });
        $scope.genres = genres;
    })
}


function queryLocalhost(query, $http, successCallback) {
    console.log(query);
    $http({
        method: "GET",
        url: "http://localhost:7200/repositories/gelada" + "?query=" + encodeURI(query).replace(/#/, '%23'),
        headers: {'Accept': 'application/sparql-results+json', 'Content-Type': 'application/sparql-results+json'}
    })
        .then(successCallback, function (error) {
            console.error('Error running the input query!: ' + JSON.stringify(error));
        });

}

function safeImage(img) {
    let s = safeField(img);
    if (s === 'unknown') {
        return "img/not-found.jpg"
    } else {
        return s;
    }
}

function safeField(field) {
    if (typeof (field) === 'undefined') {
        return "unknown";
    } else {
        return field.value;
    }
}
