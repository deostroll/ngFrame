(function(angular){
	angular.module('view.utils',[])
	.provider('$frame', function frameProvider() {
			var self = this;

			//begin 11: locals
			var locals = {
				cache: {}
			};

			//onInitFn - the one & only callback for init
			locals.onInitFn = function() {};
			//end 11: locals

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

			//begin 10: framework essentials

			//private function - when a ngFrame instance inits
			self.$init = function frameProviderInit(inst) {
				var targetScope = inst.scope;	
			};
			//end 10: framework essentials

			this.$get = function frameFactory() {

				//self documenting events
				var events = {
					'$frameInit' : 'when the frame instance is needed',
					'$frameDestroy': 'frame destroyed',
					'$frameContentLoaded' : 'when frame conent finishes loading',
					'$frameContentError' : 'Triggered when there is an error in loading content',
					'$frameContentChanging': 'Triggered when content is about to change'
				};

				var logger = new FrameLogger(self.$$loggingEnabled);
				//begin 2: factory instance
				var factory = {
					'$logger': logger
				};

				//begin 2.1: $register - registers scope & frame
				factory.$register = function(scope, frame) {
					var id = scope.$$id;
					locals.cache[id] = frame;
				};
				//end 2.1: $register

				//begin 2.2: $deregister - deregister scope
				factory.$deregister = function(scope) {
					var id = scope.$$id;
					locals.cache[id] == undefined;
				};
				//end 2.2: $deregister

				//begin 2.3: get - the frame associated with scope
				factory.get = function (scope) {
					return locals.cache[scope.$$id];
				};
				//end 2.3: get

				//begin 2.4: $init - to initialize the frame on the framework
				factory.$init = function frameFactoryInit(inst) {
					self.$init(inst);
				};
				//end 2.4: $init

				//begin 2.5: $destroy - to destroy frame
				factory.$destroy = function(inst) {

				};				
				//end 2.5

				//begin 2.6 - $on event register
				factory.$on = function frameFactoryOn(evt, fn) {
					if(events[evt])	{

					}
				};
				//end 2.6 $on

				//end 2: factory instance
				return factory;
			};


			//raise the init callback
			function localInit(inst) {
				locals.onInitFn(inst);
			}


		})
})(window.angular);