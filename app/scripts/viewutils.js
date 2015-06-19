angular.module('view.utils',[])
	.directive('ngFrame', function($compile, $controller, $templateRequest, $sce, $parse){
		var postLinkFn = function(scope, elem, attrs) {
			var srcExp = attrs.src;		
			
			//locals
			var locals = {
				src: null,
				controller: null,
				srcExp: $parse(attrs.src),
				ctrlExp: $parse(attrs.controller)
			};

			//begin 1: frame: interface to manage frame
			var frame = {
				$$isDirty : function() {
					return !!this.$scope;
				},
				$$setDirty: function(scope) {
					this.$scope = scope;
				},
				$$cleanup: function(){
					if(this.$scope) {
						this.$scope.$destroy();
						this.$scope = null;
					}
				}

			}
			//end 1: frame element			

			//begin 2: pageChangeFn: loads new page in ngFrame
			var pageChangeFn = function pageChangeFn(src) {
				if(src) {

					if(frame.$$isDirty()) {
						frame.$$cleanup();
						elem.empty();
					}

					$templateRequest(src).then(function(tmpl) {
						var newScope = scope.$new();
						var ctrlExp = locals.controller;
						$controller(ctrlExp, {'$scope' : newScope });
						var el = $compile(tmpl)(newScope);
						elem.append(el);
						frame.$$setDirty(newScope);
					});
				}
				else {
					if(frame.$$isDirty()) {
						frame.$$cleanup();
						elem.empty();
					}					
				}
			};
			//end 2: pageChangeFn

			//srcWatchFn
			var srcWatchFn = function srcWatchFn(src) {
				locals.src = src;
				locals.controller = locals.ctrlExp(scope);
				pageChangeFn(src);
			};

			scope.$watch($sce.parseAsResourceUrl(srcExp), srcWatchFn);
		};

		//directive api
		return {
			link: postLinkFn
		};
	})