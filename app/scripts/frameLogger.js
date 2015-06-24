
(function(module){
	'use strict';
	module.factory('$ngfl' , ['$log', function($log) {

		var pad = function (num, size) {
			var s = num + '';
			var diff = s.length - size;
			var k = '';
			for(var i = 0; i < diff; i++) {
				k += '0';
			}

			return k + s;
		};

		
		//array like
		var instances = { length: 0 };
		
		var Logger = function(name) {
			this.name = name.toUpperCase();
		};

		Logger.prototype.log = function() {
			var args = Array.prototype.slice.call(arguments);
			args.unshift(this.name);
			$log.log.apply($log, args);
		};

		var getInstance = function(name) {
			var inst;
			if (name) {
				inst = instances[name];
				if(!inst) {
					instances[instances.length++] = instances[name] = inst = new Logger(name);					
				}				
			}
			else {
				var s = 'lib' + pad(instances.length + 1);
				instances[instances.length++] = instances[s] = inst = new Logger(s);					
			}
			return inst;
		};

		return getInstance;
	}]);
})(window.ngFrameModule);