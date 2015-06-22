'use strict';
(function(module){
	module	
	.provider('$frame', function frameProviderFn() {
		//var pl = $frameLogger('provider');
		//pl.log('init');
		var provider = this;
		var $rootScope;
		//begin 11: locals
		var locals = {};

		locals.eventCache = {
			'$frameInit' : [],
			'$frameContentChangeSuccess': [],
			'$frameContentChangeStart' :[],
			'$frameContentChangeError': []
		};

		locals.loggerInstance = null;

		//caching frames with names
		locals.names = {};

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

		//force using name attribute
		provider.config.forceNameAttrUsage = true;

		//end 10.1 : framework configs
		
		//begin 10.2: $init - called when a ngFrame initializes
		provider.$init = function frameProviderInit(inst) {
			var frame = inst;
			var targetScope = frame.associatedScope;

			if(provider.config.maxNestingLevel) {
				//TODO: logic for nesting
			}
			else {
				if (targetScope.$$ngFrame) {
					throw new Error('Nested ngFrame disallowed');
				}
			}

			if(provider.config.forceNameAttrUsage) {
				if(locals.names[frame.name]) {
					throw new Error('ngFrame with name \'' + frame.name + '\' already exists');
				}
				else {
					locals.names[frame.name] = frame;
					
					//raist the init event
					provider.$fire('$frameInit', frame);
				}
			}
			

		};
		//end 10.2: $init

		//begin 10.3: $fire - fire event
		provider.$fire = function frameProviderFire(evt, frame) {
			$rootScope.$broadcast(evt, frame);
		};
		//end 10.3: $fire

		//begin 10.4: assign the rootscope variable
		provider.$$setRootScope = function(rs) {
			$rootScope = rs;
		};
		//end 10.4		

		//begin 10.5: $destroy - remove frame reference
		provider.$destroy = function(frame) {
			if(provider.config.forceNameAttrUsage) {
				locals.names[frame.name] = undefined;
			}
		};
		//end 10.5
		//end 10: framework essentials

		//begin 21: factory
		this.$get = function frameFactory($ngfl, $rootScope) {
			
			provider.$$setLoggerInstance($ngfl('provider'));
			provider.$$setRootScope($rootScope);

			var $logger = $ngfl('factory');
			
			//begin 2: factory instance
			var factory = { 
				'$logger' : $ngfl,
				'$config' : provider.config
			};

			//begin 2.4: $init - to initialize the frame on the framework
			factory.$init = function frameFactoryInit(frame) {
				provider.$init(frame);
			};
			//end 2.4: $init

			//begin 2.5: $destroy - to destroy frame
			factory.$destroy = function(frame) {
				provider.$destroy(frame);
			};				
			//end 2.5

			//begin 2.7: raise event
			factory.$$raiseEvent = function frameFactoryRaiseEvent(evt, frame) {
				if(locals.eventCache[evt]) {
					provider.$fire(evt, frame);
				}
			};
			//end 2.7: raise event

			//end 2: factory instance
			return factory;
		};
		//end 21: factory
	});
})(window.ngFrameModule);