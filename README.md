# ngFrame


This angular directive is an alernative to ngView. The difference is that, in ngView, the route params define what template and controller to load. ngFrame lets you have the flexibility of doing this via the associated controller

Usage
-

**code:**
```
(function(angular){
	angular.module('myapp', ['view.utils'])
		.controller('AppCtrl', function($scope) {

			//assume you have these views

			$scope.src = 'views/page1.html';
			$scope.controller = 'Page1Ctrl';

			$scope.change = function() {
				$scope.src = 'views/page2.html';
				$scope.controller = 'Page2Ctrl';
			};
		})
		.controller('Page2Ctrl', function($scope){
			console.log('Page2Ctrl scope', $scope);
		})
		.controller('Page1Ctrl', function($scope){
			console.log('Page1Ctrl scope', $scope);
		});
})(angular);

```

**markup:**
```
<div ng-controller="AppCtrl">

	<input type="button" value="Change" ng-click="change()"/>
	<br/>
	<br/>
	<ng-frame src="src" controller="controller"></ng-frame>
</div>
```

Important notes
-
- Its not an iframe or an ```ngView```
- A view in ```ngFrame``` (also known as a *frame* or a *page*) has two things associated with it: *a view* (or template), and, a *controller*. Hence, *page navigations*, are not what they traditionally are; its best you explicitly specify the view & controller prior to page navigation.

TODO
-
- Implement a pseudo service called ```$frame``` which controls the ngFrame through code.
