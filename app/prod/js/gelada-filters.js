class Filterable {

    constructor(games, $scope) {
    }

    filter(games, $scope) {
    }
}

class GenerationFilter extends Filterable {

    filter(games, $scope) {
        const scopeVar = $scope.chosenGen;
        if (scopeVar && scopeVar.length > 0) {
            games.removeIf(g => {
                let hasGen = false;
                g.platforms.forEach(p => hasGen |= p.generation === parseInt(scopeVar));
                return !hasGen;
            });
        }
    }
}

class PlatformFilter extends Filterable {

    filter(games, $scope) {
        const scopeVar = $scope.chosenPlatform;
        if (scopeVar && scopeVar.length > 0) {
            games.removeIf(g => {
                let hasConsole = false;
                g.platforms.forEach(p => hasConsole |= p.name === scopeVar);
                return !hasConsole;
            });
        }
    }
}

class ExclusiveFilter extends Filterable {

    constructor($scope) {
        super();
        $scope.exclusives = [EMPTY_FILTER, "Yes", "No"];
    }

    filter(games, $scope) {
        const scopeVar = $scope.exclusive;
        if (scopeVar && scopeVar.length > 0) {
            games.removeIf(g => {
                return !((scopeVar === 'Yes' && g.exclusive === true) || (scopeVar === 'No' && g.exclusive === false));
            });
        }
    }
}

class GenreFilter extends Filterable {


    filter(games, $scope) {
        const scopeVar = $scope.chosenGenre;
        if (scopeVar && scopeVar.length > 0) {
            games.removeIf(g => {
                return g.genre.name !== scopeVar;
            });
        }
    }
}


Array.prototype.removeIf = function (callback) {
    let i = this.length;
    while (i--) {
        if (callback(this[i], i)) {
            this.splice(i, 1);
        }
    }
};