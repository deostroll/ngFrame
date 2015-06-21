'use strict';
(function(module){
	module	
	.provider('$frame', function frameProviderFn() {
		//var pl = $frameLogger('provider');
		//pl.log('init');
		var provider = this;

		//begin 11: locals
		var locals = {};

		locals.eventCache = {
			'$frameInit' : [],
			'$frameContentChangeSuccess': [],
			'$frameContentChangeStart' :[],
			'$frameContentChangeError': []
		};

		locals.loggerInstance = null;

		//end 11: locals		

		//begin 12: log helper
		var log = function() {
			var args = [].slice.call(arguments);
			if (locals.loggerInstance) {
				locals.loggerInstance.apply(locals.loggerInstance, args);
			}
			else {
				console.log.apply(console, args);
			}
		}
		//end 12: log helper

		provider.$$loggingEnabled = false;
		provider.$$setDebugging = function(value) { provider.$$loggingEnabled = !!value; };
		provider.$$setLoggerInstance = function(inst) { locals.loggerInstance = inst; };
		//begin 10: framework essentials

		//begin 10.1: framework configs
		provider.config = {};

		//config: max nesting level
		provider.config.maxNestingLevel = 0; //no nesting by default
		provider.setMaxNestingLevel = function(level) {
			if(typeof level === 'number') { provider.config.maxNestingLevel = level; }
		};

		//end 10.1 : framework configs
		
		//begin 10.2: $init - called when a ngFrame initializes
		provider.$init = function frameProviderInit(inst) {
			var targetScope = inst.scope;	
			if(provider.config.maxNestingLevel) {
				//TODO: logic for nesting
			}
			else {
				if (targetScope.$$ngFrame) {
					throw new Error('Nested ngFrame disallowed');
				}
			}

			//raist the init
			//if(locals.onInitFn) { locals.onInitFn(inst); }
			var evtQueue = locals.eventCache.$frameInit;
			if(evtQueue.length) {
				evtQueue.forEach(function evtQueueFn(cb){
					cb(inst);
				});
			}

		};
		//end 10.2: $init

		//end 10: framework essentials

		//begin 21: factory
		this.$get = function frameFactory($ngfl) {
			
			provider.$$setLoggerInstance($ngfl('provider'));
			var $logger = $ngfl('factory');
			
			//begin 2: factory instance
			var factory = { '$logger' : $ngfl };

			//begin 2.1: $register - registers scope & frame
			factory.$register = function(scope, frame) {
				var id = scope.$$id;
				locals.cache[id] = frame;
			};
			//end 2.1: $register

			//begin 2.2: $deregister - deregister scope
			factory.$deregister = function(scope) {
				var id = scope.$$id;
				locals.cache[id] = undefined;
			};
			//end 2.2: $deregister

			//begin 2.3: get - the frame associated with scope
			factory.get = function frameFactoryGet(scope) {
				return locals.cache[scope.$$id];
			};
			//end 2.3: get

			//begin 2.4: $init - to initialize the frame on the framework
			factory.$init = function frameFactoryInit(inst) {
				provider.$init(inst);
			};
			//end 2.4: $init

			//begin 2.5: $destroy - to destroy frame
			factory.$destroy = function(inst) {
				//TODO: implement this inst
				console.log(inst);
			};				
			//end 2.5

			//begin 2.6 - $on event register
			factory.$on = function frameFactoryOn(evt, fn) {
				var evtQueue = locals.eventCache[evt];
				if(evtQueue) {
					evtQueue.push(fn);
				}
			};
			//end 2.6 $on

			//end 2: factory instance
			return factory;
		};
		//end 21: factory
	});
})(window.ngFrameModule);