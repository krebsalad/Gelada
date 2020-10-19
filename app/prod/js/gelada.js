angular.module('Gelada', []).controller('MainCtrl', ['$scope', '$http', '$sce', mainCtrl]);

function mainCtrl($scope, $http, $sce) {

    $scope.initialize = function () {
        checkGeladaHeartbeat($http, $scope);
        initializeFilters($http, $scope);
        getPreviewedGames($http, $scope, []);
        $scope.filters = [new GenerationFilter(), new PlatformFilter(), new ExclusiveFilter($scope), new GenreFilter(), new NameFilter()];
    }

    $scope.filter = function () {
        const filters = [];
        $scope.filters.forEach(f => filters.push(f.filter($scope)));
        getPreviewedGames($http, $scope, filters);
    };

    $scope.clickGame = function (gameUri) {
        getGameDetails($http, $scope, gameUri);
    };
}