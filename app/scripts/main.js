angular.module('myapp', ['view.utils', 'ngMaterial'])
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
			console.log("$scope destroy on TwoWayCtrl called");
		});
	});