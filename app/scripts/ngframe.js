
(function(module){
	'use strict';
	module
		.directive('ngFrame', function($compile, $controller, $templateRequest, $sce, $parse, $rootScope, $frame) {
			var postLinkFn = function(scope, elem, attrs) {			
				var lg = $frame.$logger('directive');
				lg.log('$create');
				if(scope === $rootScope) {
					throw new Error('Error in directive usage: cannot work on $rootScope');
				}				

				var srcLtrl = attrs.src;		
				
				//locals
				var locals = {
					src: null,
					controller: null,
					srcExp: $parse(attrs.src),
					ctrlExp: $parse(attrs.controller)
				};				

				//begin 2: pageChangeFn: loads new page in ngFrame
				var pageChangeFn = function pageChangeFn(src, controller) {
					
					frame.nav = {src: src, controller: controller };
					lg.log('navigation start');
					frame.$$raiseEvent('$frameContentChangeStart');

					if(frame.navigateCancel) {
						frame.navigateCancel = false;
						lg.log('navigation cancelled');
						return;							
					}

					if(src) {

						cleanup();
						
						$templateRequest(src).then(function(tmpl) {
							var newScope = scope.$new();
							newScope.$$ngFrame = true;
							try {
								$controller(controller, {'$scope' : newScope });	
							}
							catch(e) {
								frame.$$error = e;
								lg.log('Navigate Error', e);
								frame.$$raiseEvent('$frameContentChangeError');
								return;
							}
							
							var el = $compile(tmpl)(newScope);
							elem.append(el);
							frame.$$setDirty({ scope: newScope, src: src, controller: controller });
							if(frame.navigationInvokedByUser) {
								//update parent scope
								locals.srcExp.assign(scope, frame.src);
								locals.ctrlExp.assign(scope, frame.controller);
							}
							lg.log('Navigate Success');
							frame.$$raiseEvent('$frameContentChangeSuccess');
							
						}, function(err) {
							frame.$$error = err;
							frame.$$raiseEvent('$frameContentChangeError');
						});	
					}
					else {
						cleanup();					
					}

					function cleanup () {						
						if(frame.$$isDirty()) {
							frame.$$cleanup();
							elem.empty();
							lg.log('frame cleared');
						}						
					}
				};
				//end 2: pageChangeFn

				//srcWatchFn
				var srcWatchFn = function srcWatchFn(src) {
					lg.log('src change via watch');
					locals.src = src;
					locals.controller = locals.ctrlExp(scope);
					if(frame.navigationInvokedByUser) {
						frame.navigationInvokedByUser = false;
						lg.log('Cancelled. navigationInvokedByUser = true');
						return;
					}
					pageChangeFn(locals.src, locals.controller);
				};				

				scope.$on('$destroy', function(){
					lg.log('$destroy');
					$frame.$destroy(frame);
				});

				//creating the one & only frame reference
				var frame = $frame.$create(attrs.name, pageChangeFn);

				scope.$watch($sce.parseAsResourceUrl(srcLtrl), srcWatchFn);
			};

			//directive api
			return {
				link: postLinkFn
			};
		});	
})(window.ngFrameModule, window.angular);
