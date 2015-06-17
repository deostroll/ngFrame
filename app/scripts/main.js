angular.module('myapp', ['view.utils', 'ngMaterial'])
	.controller('AppCtrl', function($scope, $http){
		
		$scope.demo = null;
		$scope.demos = null;
		$http({url: 'scripts/pages.json'})
			.success(function(data){
				$scope.demos = data;
			});
	})
	.controller('FruitsCtrl', function($scope){
		$scope.fruits = ['grapes', 'banannas', 'oranges', 'water melon', 'guava', 'cherry'];
	})
	.controller('TwoWayCtrl', function($scope){

	});