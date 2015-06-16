angular.module('view.utils',[])
	.directive('ngFrame', function($compile, $controller, $templateRequest, $sce, $parse){
		var postLinkFn = function(scope, elem, attrs) {
			var srcExp = attrs.src;
			var ctrlExp = $parse(attrs.controller)(scope);

			scope.$watch($sce.parseAsResourceUrl(srcExp), function srcWatch(src){
				elem.empty();

				if(src) {
					var newScope = scope.$new();
					$controller(ctrlExp, {'$scope' : newScope });
					$templateRequest(src).then(function(tmpl){
						var el = $compile(tmpl)(newScope);
						//console.log(el);
						elem.append(el);
					});
				}
			});
		};
		return {
			link: postLinkFn
		};
	})