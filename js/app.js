
angular.module('project', ['ngRoute', 'firebase'])

.value('fbURL', 'https://fdn-freestore.firebaseio.com/Projects/')

.factory('Projects', function ($firebase, fbURL) {
    return $firebase(new Firebase(fbURL));
})

.config(function ($routeProvider) {
    $routeProvider.
    when('/', {
        controller: 'ListController',
        templateUrl: 'partials/list.html'
    }).
    when('/edit/:projectId', {
        controller: 'EditController',
        templateUrl: 'partials/detail.html'
    }).
    when('/new', {
        controller: 'CreateController',
        templateUrl: 'partials/detail.html'
    }).
    otherwise({
        redirectTo: '/'
    })
})

    //ListController
.controller('ListController', function ($scope, Projects) {
    $scope.projects = Projects;
})
    //CreateController
.controller('CreateController', function ($scope, $location, $timeout, Projects) {
    $scope.save = function () {
        Projects.$add($scope.project, function () {
            $timeout(function () { $location.path('/'); });
        })
    };
})
    //EditController
.controller('EditController', function ($scope, $location, $routeParams, $firebase, fbURL) {
    var _url = fbURL + $routeParams.projectId;

    $scope.project = $firebase(new Firebase(_url));

    $scope.destroy = function () {
        $scope.project.$remove();
        $location.path('/');
    };

    $scope.save = function () {
        $scope.project.$save();
        $location.path('/');
    };
});

