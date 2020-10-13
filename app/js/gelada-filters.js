const EMPTY_FILTER = "";

class Filterable {

    constructor(games, $scope) {
    }

    filter(games, $scope) {
    }
}

class GenerationFilter extends Filterable {

    constructor(games, $scope) {
        super();
        $scope.generations = [EMPTY_FILTER];
        games.forEach(g => g.platforms.forEach(p => {
            if ($scope.generations.indexOf(p.generation) < 0) {
                $scope.generations.push(p.generation);
            }
        }));
    }

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

    constructor(games, $scope) {
        super();
        $scope.platforms = [EMPTY_FILTER];
        games.forEach(g => g.platforms.forEach(p => {
            if ($scope.platforms.indexOf(p.name) < 0) {
                $scope.platforms.push(p.name);
            }
        }));
    }

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

    constructor(games, $scope) {
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


Array.prototype.removeIf = function (callback) {
    let i = this.length;
    while (i--) {
        if (callback(this[i], i)) {
            this.splice(i, 1);
        }
    }
};