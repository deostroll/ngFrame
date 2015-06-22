'use strict';
(function(angular){
	angular.module('myapp2', ['ngFrame', 'ngMaterial', 'ngRoute'])
		.config(function($routeProvider){
			$routeProvider
				.when('/', {
					templateUrl: 'views/default.html',
					controller:'AppCtrl'
				})
				.otherwise({
					redirectTo:'/'
				});
		})
		.controller('MainCtrl', function($frame, $scope) {
			$scope.sel = null;
			$scope.menus = [
				{
					id: 1,
					name: 'Ctrl1',
					page: 'views/page1.html',
					ctrl: 'Ctrl1Ctrl'
				},
				{
					id: 2,
					name: 'Ctrl2',
					page: 'views/page2.html',
					ctrl: 'Ctrl2Ctrl'
				}
			];

			$scope.change = function(id) {
				var mnu = $scope.menus.filter(function(i){
					return i.id === id;
				})[0];
				$scope.sel = mnu;
			};
			
			$scope.$on('$frameContentChangeSuccess', function(e, frame) {
				console.log('MainCtrl', 
					'$frameContentChangeSuccess', 
					frame.name, frame.src);
			});

		})
		.controller('AppCtrl', function($scope, $http){
			
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
		})
		.controller('Ctrl1Ctrl', function($scope) {			
			$scope.$on('$frameContentChangeSuccess', function(frame) {
				console.log('Ctrl1Ctrl', '$frameContentChangeSuccess', arguments);
			});
		})
		.controller('Ctrl2Ctrl', function($scope){
			
			$scope.$on('$frameContentChangeSuccess', function(frame){
				console.log('Ctrl2Ctrl', '$frameContentChangeSuccess', arguments);
			});
		});
})(window.angular);
