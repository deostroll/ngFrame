'use strict';
(function(angular){
	angular.module('myapp2', ['ngFrame', 'ngMaterial', 'ngRoute'])
		.config(function($routeProvider){
			$routeProvider
				.when('/', {
					templateUrl: 'views/default2.html',
					controller:'AppCtrl'
				})
				.when('/view1', {
					templateUrl:'views/default2.html',
					controller:'AppCtrl'
				})
				.when('/view2', {
					templateUrl: 'views/default2.html',
					controller:'AppCtrl'
				})
				.otherwise({
					redirectTo:'/'
				});
		})		
		.controller('AppCtrl', function($scope, $http){
			$scope.views = [
				{
					url: '#/',
					text : 'default'
				},
				{
					url:'#/view1',
					text:'view 1'
				},
				{
					url:'#/view2',
					text: 'view 2'
				}
			];
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
