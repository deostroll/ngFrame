
(function(module){
	'use strict';
	module	
	.provider('$frame', function NgFrameProvider() {
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
		
		//begin 11.1: InstanceManager
		var InstanceManager = function() { };
		InstanceManager.prototype = [];
		locals.names = new InstanceManager();
		locals.names.indexOf = function(obj) {			
			if(typeof obj === 'string') {
				return this.map(function(ngFrame) { return ngFrame.frame; }).indexOf(obj);
			}
			else if(typeof obj === 'object' && obj instanceof NgFrame) {
				var _indexOf_ = Array.prototype.indexOf;
				return _indexOf_.call(this, obj);
			}
			else {
				return -1;
			}
		};

		locals.names.exists = function(obj) {
			return this.indexOf(obj) > -1;
		};
		//end 11.1: instance manager
		

		//end 11: locals		

		//begin 12: for logging
		provider.$$loggingEnabled = false;
		provider.$$setDebugging = function(value) { provider.$$loggingEnabled = !!value; };
		provider.$$setLoggerInstance = function(inst) { locals.loggerInstance = inst; };

		
		// var log = function() {			
		// 	if(provider.$$loggingEnabled) {
		// 		var args = [].slice.call(arguments);
		// 		if (locals.loggerInstance) {
		// 			locals.loggerInstance.apply(locals.loggerInstance, args);
		// 		}
		// 		else {
		// 			console.log.apply(console, args);
		// 		}	
		// 	}			
		// };
		//end 12: for logging

		//begin 13: NgFrame constructor
		var NgFrame = function(name, pageChangeFn) {
			var _name_ = name;
			Object.defineProperty(this, 'name', {
				get: function() { return _name_; }
			});
			this.navigationCancel = false;
			this.$scope = null;
			this.src = null;
			this.controller = null;			
			this.$pageChangeFn = pageChangeFn;
			this.navigationInvokedByUser = false;
		};

		NgFrame.prototype.$$setDirty = function(info) {
			this.$scope = info.scope;
			this.src = info.src;	
			this.controller = info.controller;
		};

		NgFrame.prototype.$$isDirty = function() {
			return !!this.$scope;
		};

		NgFrame.prototype.$$cleanup = function() {
			if(this.$scope) {
				this.$scope.$destroy();
				this.$scope = null;
			}
		};

		NgFrame.prototype.$$raiseEvent = function(evt) {
			if(typeof locals.eventCache[evt] === 'undefined') {
				throw new Error(evt + ': not a valid ngFrame event');
			}
			provider.$fire(evt, this);
		};

		NgFrame.prototype.getLastError = function() {
			var err = this.$$error;
			this.$$error = null;
			return err;
		};

		NgFrame.prototype.setNavigationCancel = function(value) {
			this.navigationCancel = !!value;
		};

		NgFrame.prototype.navigate = function(src, controller) {
			if(arguments.length !== 2) {
				throw new Error('Invalid arguments passed');
			}

			if(typeof src === 'string' && (typeof controller === 'string' || typeof controller === 'function')) {
				this.navigationInvokedByUser = true;
				this.$pageChangeFn(src, controller);	
			}
			
		};
		//end 13: NgFrame constructor

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
			else {
				//case when name attribute is optional
				
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

		//begin 10.6: $createFrame - does name validation & creating the frame object.
		provider.$createFrame = function(name, pageChangeFn) {
			var frame;

			if(provider.config.forceNameAttrUsage) {
				if(!name || name.length === 0) {
					throw new Error('ngFrame requires attribute: name');
				}

				if(locals.names.exists(name)) {
					throw new Error('ngFrame with name \'' + name + '\' already exists');
				}
				else {					
					frame = new NgFrame(name, pageChangeFn);
					locals.names.push(frame);
				}

			}
			else {
				if(name && name.length) {
					if(locals.names.exists(name)) {
						throw new Error('ngFrame with name \'' + name + '\' already exists');
					}
					else if (!name || name.length === 0) {
						//assign new name
						name = '____frame____' + padZero(locals.names.length, 3);
						frame = new NgFrame(name, pageChangeFn);
						locals.names.push(frame);
					}
				}
			}
			provider.$fire('$frameInit', frame);
			return frame;
		};		
		//end 10.6: $createFrame

		//end 10: framework essentials

		//begin 21: factory
		this.$get = function NgFrameFactory($ngfl, $rootScope) {
			
			provider.$$setLoggerInstance($ngfl('provider'));
			provider.$$setRootScope($rootScope);

			var fn = function(name) {
				var log = $ngfl(name);
				var obj = {};
				obj.log = function() {					
					if(provider.$$loggingEnabled) {
						var args = [].slice.call(arguments);
						log.log.apply(log, args);
					}
				};
				return obj;
			};

			//var $logger = $ngfl('factory');
			
			//begin 2: factory instance
			var factory = { 				
				'$config' : provider.config
			};

			//begin 2.3: $logger
			factory.$logger = fn;
			//end 2.3

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

			//begin 2.8: $create - creates the frame
			factory.$create = function(name, pageChangeFn) {
				return provider.$createFrame(name, pageChangeFn);
			};
			//end 2.8: $create

			//end 2: factory instance
			return factory;
		};
		//end 21: factory

		//begin 22: utils
		function padZero(num, size) {
			var s = num + '';
			var zeros = '';
			for(var i = 0; i < size; i++) {
				zeros += '0';
			}
			var k = zeros + s;
			return k.substr(k.length - size);
		}
		//end 22: utils
	});
})(window.ngFrameModule);