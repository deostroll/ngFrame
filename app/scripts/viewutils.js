angular.module('view.utils',[])
	.directive('ngFrame', function($compile, $controller, $templateRequest, $sce, $parse){
		var postLinkFn = function(scope, elem, attrs) {
			var srcExp = attrs.src;			
			//begin 1: one and only frame element
			var frame = {
				$isDirty : function() {
					return !!this.$scope;
				},
				$setDirty: function(scope) {
					this.$scope = scope;
				},
				$cleanup: function(){
					if(this.$scope) {
						this.$scope.$destroy();
						this.$scope = null;
					}
				}

			}
			//end 1: frame element			

			scope.$watch($sce.parseAsResourceUrl(srcExp), function srcWatch(src) {
				
				if(src) {

					if(frame.$isDirty()) {
						frame.$cleanup();
						elem.empty();
					}

					$templateRequest(src).then(function(tmpl) {
						var newScope = scope.$new();
						var ctrlExp = $parse(attrs.controller)(scope);
						$controller(ctrlExp, {'$scope' : newScope });
						var el = $compile(tmpl)(newScope);
						elem.append(el);
						frame.$setDirty(newScope);
					});
				}
				else {
					if(frame.$isDirty()) {
						frame.$cleanup();
						elem.empty();
					}					
				}
			});
		};

		//directive api
		return {
			link: postLinkFn
		};
	})