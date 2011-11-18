/*
 * @author: bangyan@taobao.com
 * @version: 1-0-0
 */
YUI.add('k2-monitor', function (Y) {

	var monitor;

	monitor = function () {
		monitor.superclass.constructor.apply(this, arguments);
	};

	monitor.NAME = 'monitor';

	monitor.ATTRS = {
		trigger: {
			value: '#k2-monitor'
		},
		kind: {
			value: 'kb.moniter'
		},
		event: {
			value: 'mousedown'
		}
	};

	Y.extend(monitor, Y.Base, {

		initializer: function () {

			Y.on(this.get('event'), this.notify, this.get('trigger'), this);

		},

		noCache: function (n) {

			var i, rand = '';

			for (i = 0; i < n; i++) {
				rand += Math.floor(Math.random() * 10);
			}

			return rand;

		},

		notify: function () {

			var cache = this.noCache(7),
				cImg = document.createElement('img');

			cImg.src = 'http://www.atpanel.com/search?cache=' + cache + '&kind=' + this.get('kind');
			
			Y.log(cImg.src);

		}

	});

	Y.Monitor = monitor;

}, '1.0.0', {
	requires: ['base-base', 'node-base', 'event-base']
});