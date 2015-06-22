'use strict';
(function(angular){
	angular.module('myapp', ['ngFrame', 'ngMaterial', 'ngRoute'])
		.config(function($routeProvider){
			$routeProvider
				.when('/', {
					templateUrl: 'views/default.html'
				})
				.otherwise({
					redirectTo:'/'
				});
		})
		.controller('AppCtrl', function($scope, $http){
			console.log('AppCtrl');
			$scope.demo = null;
			$scope.demos = null;
			$scope.example = {};

			$http({url: 'scripts/pages.json'})
				.success(function(data){
					$scope.demos = data;
				});

			$scope.$watch('demo', function(demo) {
				$scope.example = angular.extend({}, demo);
			});

			$scope.onload = function() {
				console.log(arguments);
			};
		})
		.controller('FruitsCtrl', function($scope){
			$scope.fruits = ['grapes', 'banannas', 'oranges', 'water melon', 'guava', 'cherry'];
		})
		.controller('TwoWayCtrl', function($scope){
			$scope.$on('$destroy', function() {
				console.log('$scope destroy on TwoWayCtrl called');
			});
			$scope.$on('$destroy', function(){
				console.log('2nd destroy called')
			})
		})
		.controller('NestedCtrl', function($scope){
			console.log('NestedCtrl');
		});
})(window.angular);
