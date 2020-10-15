const EMPTY_FILTER = "";
const LIMITS = ["10", "25", "100", "UNLIMITED"];

function getPreviewedGames($http, $scope, filters) {
    let query = "PREFIX gla: <http://www.gelada.org/ontology/>" +
        "\n" +
        "SELECT ?game ?name ?screenshot ?releaseDate where{\n" +
        "    ?game a gla:Game .\n";

    filters.forEach(f => {
        if (f && f.length > 0) {
            query += ("    ?game " + f + " .\n");
        }
    });

    query +=
        "    OPTIONAL {?game gla:hasName ?name .}\n" +
        "    OPTIONAL {?game gla:hasScreenshot ?screenshot .}\n" +
        "    OPTIONAL {?game gla:hasReleaseDate ?releaseDate .}\n" +
        "}\n";

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
            game.imgUrl = safeField(val.screenshot);
            previewGames.push(game);
        });
        if ($scope.filteredGames) {
            $scope.filteredGames.length = 0;
            previewGames.forEach(p => $scope.filteredGames.push(p));
        } else {
            $scope.filteredGames = previewGames;
        }
    });
}


function getGameDetails($http, $scope, uri) {
    $scope.clickedGame = {};
    uri = escapeOntologyUri(uri);
    const basicInfoQuery = "PREFIX gla: <http://www.gelada.org/ontology/>\n" +
        "SELECT * where{\n" +
        "    " + uri + " gla:hasName ?name .\n" +
        "    OPTIONAL {" + uri + " gla:hasAlternativeName ?alternativeName .}\n" +
        "    OPTIONAL {" + uri + " gla:hasScreenshot ?screenshot .}\n" +
        "    OPTIONAL {" + uri + " gla:hasReleaseDate ?releaseDate .}\n" +
        "    OPTIONAL {" + uri + " gla:hasSingleplayer ?singleplayer .}\n" +
        "    OPTIONAL {" + uri + " gla:hasMultiplayer ?multiplayer .}\n" +
        "    OPTIONAL {" + uri + " gla:hasAbstract ?abstract .}\n" +
        "    OPTIONAL {" + uri + " gla:hasGenre ?genre . \n ?genre gla:hasName ?genreName .}\n" +
        "}";


    queryLocalhost(basicInfoQuery, $http, data => {
        angular.forEach(data.data.results.bindings, function (val) {
            $scope.clickedGame.name = safeField(val.name);
            $scope.clickedGame.imgUrl = safeField(val.screenshot);
            $scope.clickedGame.alternativeName = safeField(val.alternativeName);
            $scope.clickedGame.releaseDate = safeField(val.releaseDate);
            $scope.clickedGame.singleplayer = safeField(val.singleplayer);
            $scope.clickedGame.multiplayer = safeField(val.multiplayer);
            $scope.clickedGame.genre = safeField(val.genreName);
            $scope.clickedGame.abstract = safeField(val.abstract);
        });
    });


    const platformsQuery = "PREFIX gla: <http://www.gelada.org/ontology/>\n" +
        "SELECT DISTINCT ?platform ?name ?imgUrl ?abstract where{\n" +
        "    " + uri + " gla:hasPlatform ?platform .\n" +
        "    ?platform gla:hasName ?name .\n" +
        "    OPTIONAL {?platform gla:hasScreenshot ?imgUrl} .\n" +
        "    OPTIONAL {?platform gla:hasAbstract ?abstract} .\n" +
        "}";

    queryLocalhost(platformsQuery, $http, data => {
        const platforms = [];
        angular.forEach(data.data.results.bindings, function (val) {
            const platform = {};
            platform.uri = safeField(val.platform);
            platform.name = safeField(val.name);
            platform.imgUrl = safeField(val.imgUrl);
            platform.abstract = safeField(val.abstract);
            platforms.push(platform);
        });
        $scope.clickedGame.platforms = platforms;
    });
}

function initializeFilters($http, $scope) {
    $scope.resultLimits = LIMITS;
    getGenerationFilterValues($http, $scope);
    getPlatformFilterValues($http, $scope);
    getGenreFilterValues($http, $scope);
}


function getGenerationFilterValues($http, $scope) {
    const query = "PREFIX gla: <http://www.gelada.org/ontology/>" +
        "\n" +
        "SELECT DISTINCT ?generation where{\n" +
        "    ?s gla:hasGeneration ?generation .\n" +
        "}";
    queryLocalhost(query, $http, data => {
        const generations = [EMPTY_FILTER];
        angular.forEach(data.data.results.bindings, function (val) {
            generations.push(safeField(val.generation));
        });
        $scope.generations = generations;
    })
}


function getPlatformFilterValues($http, $scope) {
    const query = "PREFIX gla: <http://www.gelada.org/ontology/>" +
        "\n" +
        "SELECT DISTINCT ?platform ?name where{\n" +
        "    ?platform a gla:Platform .\n" +
        "    ?platform gla:hasName ?name .\n" +
        "}";
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
    const query = "PREFIX gla: <http://www.gelada.org/ontology/>" +
        "\n" +
        "SELECT DISTINCT ?genre ?name where{\n" +
        "    ?platform a gla:Genre .\n" +
        "    ?genre gla:hasName ?name .\n" +
        "}";
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
        url: "http://localhost:7200/repositories/geladav1" + "?query=" + encodeURI(query).replace(/#/, '%23'),
        headers: {'Accept': 'application/sparql-results+json', 'Content-Type': 'application/sparql-results+json'}
    })
        .then(successCallback, function (error) {
            alert('Error running the input query!' + error);
        });

}

function safeField(field) {
    if (typeof (field) === 'undefined') {
        return "";
    } else {
        return field.value;
    }
}
