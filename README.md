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

ngFrame Events
-

Every frame event is available to the scope object and is supplied with a reference to a frame object. 

For e.g.
```
$scope.$on('$frameContentChangeSuccess', function(evt, frame){
	console.log('Current page loaded:', frame.src, 'Current controller:', frame.controller);
});
```
**Available Events:**

- **$frameInit** : raised when the ngFrame initializes
- **$frameContentChangeStart** : raised when the ngFrame prior to the page/controller the ngFrame is loading. The ```src``` and ```controller``` properties of the ```nav`` property of the frame object exposes details of the page/controller being navigated to. To cancel navigation for whatever reason call ```setNavigationCancel(true)``` on the frame.

Example:

```
$scope.$on('$frameContentChangeStart', function(evt, frame){
	console.log('target page:', frame.nav.src, 'target controller:', frame.nav.controller, 'current page:', frame.src, 'current controller:', frame.controller);

	//to cancel
	//frame.setNavigationCancel(true);
});
```
- **$frameContentChangeSuccess**: raised when ngFrame successfully loads page/controller
- **$frameContentChangeError**: raised when ngFrame cannot load page/controller

Important notes
-
- Its not an iframe or an ```ngView```
- A view in ```ngFrame``` (also known as a *frame* or a *page*) has two things associated with it: *a view* (or template), and, a *controller*. Hence, to navigate to a **page** always remember what *page* & *controller* to load.

TODO
-
- frame name validation
- manage history
- helper directives
- frame navigation via code
