class Filterable {

    constructor(games, $scope) {
    }

    filter(games, $scope) {
    }
}

class GenerationFilter extends Filterable {

    filter($scope) {
        const scopeVar = $scope.chosenGen;
        console.log(scopeVar);
        if (scopeVar && scopeVar.length > 0) {
            return "gla:hasGeneration " + scopeVar;
        } else {
            return "";
        }
    }
}

class PlatformFilter extends Filterable {

    filter($scope) {
        const scopeVar = $scope.chosenPlatform;
        if (scopeVar && scopeVar.length > 0) {
            return "gla:hasPlatform " + escapeOntologyUri(scopeVar);
        } else {
            return "";
        }
    }
}

class ExclusiveFilter extends Filterable {

    constructor($scope) {
        super();
        $scope.exclusives = [EMPTY_FILTER, "Yes", "No"];
    }

    filter($scope) {
        // const scopeVar = $scope.exclusive;
        // if (scopeVar && scopeVar.length > 0) {
        //     games.removeIf(g => {
        //         return !((scopeVar === 'Yes' && g.exclusive === true) || (scopeVar === 'No' && g.exclusive === false));
        //     });
        // }
    }
}

class GenreFilter extends Filterable {

    filter($scope) {
        const scopeVar = $scope.chosenGenre;
        if (scopeVar && scopeVar.length > 0) {
            return "gla:hasGenre " + escapeOntologyUri(scopeVar);
        } else {
            return "";
        }
    }
}

function escapeOntologyUri(uri) {
    return '<' + uri + '>';
}


Array.prototype.removeIf = function (callback) {
    let i = this.length;
    while (i--) {
        if (callback(this[i], i)) {
            this.splice(i, 1);
        }
    }
};