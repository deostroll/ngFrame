
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

				var frame = $frame.$create(attrs.name);

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

				scope.$on('$destroy', function(){
					lg.log('$destroy');
					$frame.$destroy(frame);
				});
			};

			//directive api
			return {
				link: postLinkFn
			};
		});	
})(window.ngFrameModule, window.angular);
