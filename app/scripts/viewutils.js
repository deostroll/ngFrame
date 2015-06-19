'use strict';
(function(angular){
	angular.module('view.utils',[])
		.config(function($frameProvider){
			console.log('config');
			console.log($frameProvider);
			$frameProvider.$$setDebugging(true);
			//console.log($frameProvider);
		})
		.directive('ngFrame', function($compile, $controller, $templateRequest, $sce, $parse, $frame) {
			var postLinkFn = function(scope, elem, attrs) {			
				$frame.$logger.log('postLinkFn');
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
					$$setDirty: function(scope) {
						this.$scope = scope;
					},
					$$cleanup: function(){
						if(this.$scope) {
							this.$scope.$destroy();
							this.$scope = null;
						}
					}

				};
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
							
							$controller(locals.controller, {'$scope' : newScope });
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

				scope.$watch($sce.parseAsResourceUrl(srcLtrl), srcWatchFn);
			};

			//directive api
			return {
				link: postLinkFn
			};
		})
		.provider('$frame', function frameProvider() {
			var self = this;

			//begin 1: FrameLogger
			var FrameLogger = function(enabled) {
				this.enabled = enabled;
			};
			
			FrameLogger.prototype.log = function(msg) {
				if(this.enabled) { console.log(msg); }
			};

			FrameLogger.prototype.$setEnabled = function(value) { this.enabled = !!value; };
			//end 1: FrameLogger

			self.$$loggingEnabled = false;
			self.$$setDebugging = function(value) { self.$$loggingEnabled = !!value; };

			this.$get = function frameFactory() {
				var logger = new FrameLogger(self.$$loggingEnabled);
				var factory = {
					'$logger': logger
				};
				return factory;
			};
		});	
})(window.angular);
