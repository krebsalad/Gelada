angular.module('Gelada', []).controller('MainCtrl', ['$scope', '$http', '$sce', mainCtrl]);

function mainCtrl($scope, $http, $sce) {

    $scope.initialize = function () {
        $scope.filters = [new GenerationFilter()];
        $scope.originalGames = createDummyOntology($sce);
        $scope.filteredGames = $scope.originalGames.slice();
        $scope.generations = [3]
        $scope.originalGames.forEach(g => g.platforms.forEach(p => {
            console.log(JSON.stringify(p))
            if ($scope.generations.indexOf(p.generation) < 0) {
                $scope.generations.push(p.generation);
            }
        }));
        console.log(JSON.stringify($scope.generations));
    }

    $scope.searchInGames = function () {
        const query = $scope.searchQuery.toLowerCase();
        if (query.length === 0) {
            $scope.filteredGames.length = 0;
            $scope.originalGames.forEach(g => $scope.filteredGames.push(g));
        } else {
            $scope.filteredGames.length = 0;
            $scope.originalGames.forEach(g => {
                if (g.name.toLowerCase().indexOf(query) > -1 || g.alternativeName.toLowerCase().indexOf(query) > -1) {
                    $scope.filteredGames.push(g);
                }
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