angular.module('Gelada', []).controller('MainCtrl', ['$scope', '$http', '$sce', mainCtrl]);

function mainCtrl($scope, $http, $sce) {

    $scope.initialize = function () {
        checkGeladaHeartbeat($http, $scope);
        initializeFilters($http, $scope);
        getPreviewedGames($http, $scope, []);
        $scope.filters = [new GenerationFilter(), new PlatformFilter(), new ExclusiveFilter($scope), new GenreFilter()];
    }

    $scope.searchInGames = function () {
        const query = $scope.searchQuery.toLowerCase();
        $scope.filteredGames.length = 0;
        $scope.originalGames.forEach(o => $scope.filteredGames.push(o));
        if (query && query.length > 0) {
            $scope.filteredGames.removeIf(g => {
                return g.name.toLowerCase().indexOf(query) < 0 && (!g.alternativeName || g.alternativeName.toLowerCase().indexOf(query) < 0);
            });
        }
    };

    $scope.filter = function () {
        const filters = [];
        $scope.filters.forEach(f => filters.push(f.filter($scope)));
        getPreviewedGames($http, $scope, filters);
    };

    $scope.clickGame = function (gameUri) {
        getGameDetails($http, $scope, gameUri);
    };
}