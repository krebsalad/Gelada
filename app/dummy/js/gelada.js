angular.module('Gelada', []).controller('MainCtrl', ['$scope', '$http', '$sce', mainCtrl]);

function mainCtrl($scope, $http, $sce) {

    $scope.initialize = function () {
        $scope.originalGames = createDummyOntology($sce);
        $scope.filteredGames = $scope.originalGames.slice();
        $scope.filters = [new GenerationFilter($scope.filteredGames, $scope),
            new PlatformFilter($scope.filteredGames, $scope),
            new ExclusiveFilter($scope.filteredGames, $scope),
            new GenreFilter($scope.filteredGames, $scope)];
    }

    $scope.searchInGames = function () {
        const query = $scope.searchQuery.toLowerCase();
        //reset state to current filtered games
        $scope.filter();
        if (query && query.length > 0) {
            $scope.filteredGames.removeIf(g => {
                return g.name.toLowerCase().indexOf(query) < 0 && g.alternativeName.toLowerCase().indexOf(query) < 0;
            });
        }
    };

    $scope.filter = function () {
        $scope.filteredGames.length = 0;
        $scope.originalGames.forEach(g => $scope.filteredGames.push(g));
        $scope.filters.forEach(f => f.filter($scope.filteredGames, $scope));
    };

    $scope.clickGame = function (gameId) {
        $scope.clickedGame = $scope.originalGames.filter(g => {
            return g.id === gameId;
        })[0];
    };
}