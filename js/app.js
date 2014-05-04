//angular.module('app', ['ngAnimate', 'cgBusy', 'firebase']);

//angular.module('app').controller('DemoCtrl', function ($scope, $http, $firebase) {

//    var peopleRef = new Firebase("https://fdn-phuongnm4.firebaseio.com/");
//    $scope.messages = $firebase(peopleRef);

//    $scope.promise = $http.get('https://fdn-phuongnm4.firebaseio.com/');

//    $scope.demo = function () {
//        $scope.promise = $http.get('https://fdn-phuongnm4.firebaseio.com/');
//    };
//});




angular.module('project', ['ngRoute', 'firebase', 'cgBusy', 'ngAnimate'])

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
    .filter('spitTags', function () {
        return function (input) {
            var arrStr = input.split(',');
            var returnStr = "";
            for (var i = 0; i < arrStr.length; i++) {
                returnStr = returnStr + '<code>' + arrStr[i] + '</code>';
            }
            return returnStr;
        };
    })
    .directive('bindHtmlUnsafe', function ($compile) {
        return function ($scope, $element, $attrs) {
            var compile = function (newHTML) { // Create re-useable compile function
                newHTML = $compile(newHTML)($scope); // Compile html
                $element.html('').append(newHTML); // Clear and append it
            };

            var htmlName = $attrs.bindHtmlUnsafe; // Get the name of the variable 
            // Where the HTML is stored

            $scope.$watch(htmlName, function (newHTML) { // Watch for changes to 
                // the HTML
                if (!newHTML) return;
                compile(newHTML);   // Compile it
            });
        };
    })
        //ListController
        .controller('ListController', function ($scope, Projects, $http) {
            angular.element(document).ready(function () {
                var offset = 200;
                var duration = 300;

                $(window).scroll(function () {
                    if ($(this).scrollTop() > offset) {
                        $('.back-to-top').fadeIn(duration);
                    } else {
                        $('.back-to-top').fadeOut(duration);
                    }
                });

                jQuery('.back-to-top').click(function (event) {
                    event.preventDefault();
                    jQuery('html, body').animate({ scrollTop: 0 }, duration);
                    return false;
                })
            });
            $scope.promise = $http.get('https://fdn-freestore.firebaseio.com/Projects/');
            $scope.projects = Projects;
        })
        //CreateController
        .controller('CreateController', function ($scope, $location, $timeout, Projects) {
            $scope.loading = false;
            $scope.save = function () {
                $scope.loading = true;
                Projects.$add($scope.project, function () {
                    $timeout(function () {
                        $location.path('/');
                    });
                });
            };
        })
        //EditController
        .controller('EditController', function ($scope, $location, $timeout, $routeParams, $firebase, fbURL, $http) {
            $scope.loading = false;

            var _url = fbURL + $routeParams.projectId;
            $scope.promise = $http.get(_url);
            $scope.project = $firebase(new Firebase(_url));

            $scope.destroy = function () {
                $scope.loading = true;
                $scope.project.$remove();
                $location.path('/');
            };

            $scope.save = function () {
                $scope.loading = true;
                $scope.project.$save();
                $location.path('/');
            };
        });

