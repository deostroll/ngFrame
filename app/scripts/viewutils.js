angular.module('view.utils',[])
	.directive('ngFrame', function($compile, $controller, $templateRequest, $sce, $parse, $frame){
		var postLinkFn = function(scope, elem, attrs) {
			var srcLiteral = attrs.src;

			var locals = {
				controller: null,
				src: null,
				navigateCall: false
			};

			var ctrlExp = $parse(attrs.controller);
			var srcExp = $parse(attrs.src);

			//begin 1: frame object: frame management object
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
				},
				$$navigate : function() {
					locals.navigateCall = true;
					pageChangeFn(locals.src);
				},
				navigate : function(nav) {
					if(typeof nav === 'string') {
						locals.src = nav;
					}
					else if (typeof nav === 'object' && nav.src && nav.controller) {
						angular.extend(locals, nav);
					}
					else if (typeof nav === 'object' && nav.src) {
						angular.extend(locals, nav);
					}
					else {
						throw new Error('invalid object passed to navigate');
					}

					this.$$navigate();
				}
			}
			//end 1: frame object

			//begin 2: pageChangeFn: change the page viewed in ngFrame
			var pageChangeFn = function pageChangeFn(src)	 {
				if(src) {

					if(frame.$$isDirty()) {
						frame.$$cleanup();
						elem.empty();
					}

					$templateRequest(src).then(function(tmpl) {
						var newScope = scope.$new();						
						$controller(locals.controller, {'$scope' : newScope });
						var el = $compile(tmpl)(newScope);
						elem.append(el);
						frame.$$setDirty(newScope);
						$frame.$register(newScope, frame);
						newScope.$on('$destroy', function() {
							$frame.$deregister(newScope);
						});
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
			
			var srcWatch = function srcWatch(src) {
				if(!locals.navigateCall) {
					locals.src = src;
					locals.controller = ctrlExp(scope);
					pageChangeFn(src);	
				}
				else {
					locals.navigateCall = false;
				}
				
			};

			scope.$watch($sce.parseAsResourceUrl(srcLiteral), srcWatch);
		};

		//directive api
		return {
			link: postLinkFn
		};
	})
	.provider('$frame', function $frameProvider(){
		var cache = {};

		this.$get = function $frameFactory() {
			//begin 1: frameHostApi: helper methods essential to the ngFrame framework
			var frameHostApi = {
				$register: function frameRegisterScope(){

				},
				$deregister : function frameDeregisterScope() {

				},
				get : function frameGetInstance(scope) {
					return cache[scope.$id];
				}
			}
		};
	});
