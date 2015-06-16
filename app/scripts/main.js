angular.module('myapp', ['view.utils'])
	.controller('AppCtrl', function($scope){
		$scope.src = 'views/fruits.html';
		$scope.ctrl = 'FruitsCtrl';
	})
	.controller('FruitsCtrl', function($scope){
		$scope.fruits = ['grapes', 'banannas', 'oranges', 'water melon', 'guava', 'cherry'];
	})