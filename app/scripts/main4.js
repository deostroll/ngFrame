'use strict';
(function(angular){
	angular.module('myapp', ['ngFrame', 'ngMaterial'])		
		.config(function($frameProvider){
			$frameProvider.$$setDebugging(true);
		})
		.controller('AppCtrl', function($scope, $http){
			
			var frame;
			
			$scope.demo; 
			$scope.demos = null;
			$scope.example = {};

			$http({url: 'scripts/pages.json'})
				.success(function(data){
					$scope.demos = data;
					$scope.example = data[1];
				});

			$scope.$on('$frameInit', function(evt, f){
				frame = f;
			});

			$scope.change = function() {
				frame.navigate($scope.demo.page, $scope.demo.controller);
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
