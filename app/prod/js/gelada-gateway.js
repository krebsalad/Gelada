const EMPTY_FILTER = "";
function getPreviewedGames($http, $scope) {
    //todo add filtering
    const query = "PREFIX gla: <http://www.gelada.org/ontology/>" +
        "\n" +
        "SELECT ?game ?name ?screenshot ?releaseDate where{\n" +
        "    ?game a gla:Game .\n" +
        "    OPTIONAL {?game gla:hasName ?name .}\n" +
        "    OPTIONAL {?game gla:hasScreenshot ?screenshot .}\n" +
        "    OPTIONAL {?game gla:hasReleaseDate ?releaseDate .}\n" +
        "}\n" +
        "LIMIT 21";
    queryLocalhost(query, $http, data=> {
        const previewGames = [];
        angular.forEach(data.data.results.bindings, function (val) {
            const game = {};
            game.name = safeField(val.name);
            game.uri = safeField(val.game);
            game.releaseDate = safeField(val.releaseDate);
            game.imgUrl = safeField(val.screenshot);
            previewGames.push(game);
        });
        $scope.filteredGames = previewGames;
    })
}

function initializeFilters($http, $scope) {
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
    queryLocalhost(query, $http, data=>{
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
        "    ?platform gla:hasName ?name .\n"+
        "}";
    queryLocalhost(query, $http, data=>{
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
        "    ?genre gla:hasName ?name .\n"+
        "}";
    queryLocalhost(query, $http, data=>{
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
    }else{
        return field.value;
    }
}
