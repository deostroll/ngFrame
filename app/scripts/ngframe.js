'use strict';
(function(module){
	module
		.directive('ngFrame', function($compile, $controller, $templateRequest, $sce, $parse, $rootScope, $frame) {
			var postLinkFn = function(scope, elem, attrs) {			

				if(scope === $rootScope) {
					throw new Error('Error in directive usage: cannot work on $rootScope');
				}

				//var log = $frame.$logger.log.bind($frame.$logger);

				var srcLtrl = attrs.src;		
				
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
					$$setDirty: function(info) {
						this.$scope = info.scope;
						this.src = info.src;	
						this.controller = info.controller;
					},
					$$cleanup: function(){
						if(this.$scope) {
							this.$scope.$destroy();
							this.$scope = null;
						}
					},
					$$raiseEvent: function(evt) {
						$frame.$$raiseEvent(evt, this);
					},
					getLastError : function() {  
						var err = this.$$error; 
						this.$error = null; 
						return err; 
					},
					setNavigationCancel: function (value) { 
						this.navigateCancel = !!value; 
					}
				};

				var name = attrs.name;
				if($frame.$config.forceNameAttrUsage) {
					if(!name) {
						throw new Error('ngFrame has no name attribute');
					}
					frame.name = name;
				}
				frame.navigateCancel = false;
				frame.associatedScope = scope;

				//end 1: frame element

				//invoke init event
				$frame.$init(frame);
				

				//begin 2: pageChangeFn: loads new page in ngFrame
				var pageChangeFn = function pageChangeFn(src) {
					
					frame.nav = {src: src, controller: locals.controller };
					
					frame.$$raiseEvent('$frameContentChangeStart');

					if(frame.navigateCancel) {
						frame.navigateCancel = false;
						return;							
					}
					
					if(src) {

						if(frame.$$isDirty()) {
							frame.$$cleanup();
							elem.empty();
						}
						
						$templateRequest(src).then(function(tmpl) {
							var newScope = scope.$new();
							newScope.$$ngFrame = true;
							try {
								$controller(locals.controller, {'$scope' : newScope });	
							}
							catch(e) {
								frame.$$error = e;
								frame.$$raiseEvent('$frameContentChangeError');
								return;
							}
							
							var el = $compile(tmpl)(newScope);
							elem.append(el);
							frame.$$setDirty({ scope: newScope, src: src, controller: locals.controller });
							frame.$$raiseEvent('$frameContentChangeSuccess');
							
						}, function(err) {
							frame.$$error = err;
							frame.$$raiseEvent('$frameContentChangeError');
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

				scope.$watch($sce.parseAsResourceUrl(srcLtrl), srcWatchFn);
			};

			//directive api
			return {
				link: postLinkFn
			};
		});	
})(window.ngFrameModule, window.angular);
