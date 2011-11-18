/*
 * @author: bangyan@taobao.com
 * @version: 1-1-0
 */
YUI.add('k2-bubble', function (Y) {

	var bubble,
	    BUBBLE_TEMPLATE,
	    CURRENT_NODE;

	BUBBLE_TEMPLATE = '<div class="k2-bubble"><div class="bubble-content"></div><div class="bubble-arrow"></div></div>';

	bubble = function () {
		bubble.superclass.constructor.apply(this, arguments);
	};

	bubble.NAME = 'bubble';

	bubble.ATTRS = {
		trigger: {
			value: '#k2-bubble'
		},
		title: {
			value: 'data-title'
		},
		maxWidth: {
			value: 200
		},
		offsetX: {
			value: 0
		},
		offsetY: {
			value: 0
		},
		visible: {
			value: false
		},
		arrow: {
			value: 'bottom'
		},
		delay: {
			value: 500
		}
	};

	Y.extend(bubble, Y.Base, {

		initializer: function () {

			var that = this;

			Y.all(this.get('trigger')).each(function (v) {

				//创建气泡节点
				BUBBLE_NODE = Y.Node.create(BUBBLE_TEMPLATE);
				BUBBLE_NODE.one('.bubble-content').set('innerHTML', v.getAttribute(that.get('title')));

				//将气泡节点对应到相应触发节点
				BUBBLE_NODE.setAttribute('data-id', BUBBLE_NODE.get('id'));
				v.setAttribute('data-id', BUBBLE_NODE.get('id'));

				//将气泡节点塞入DOM中
				Y.one('body').append(BUBBLE_NODE);

				that.render(v);

			});

			//当窗口尺寸变化时，重绘所有静态气泡
			if (this.get('visible')) {

				Y.on('windowresize', this.resize, this);

			}
			//如果气泡被定义为悬停类型，则绑定鼠标移入和移出事件
			else {

				Y.on('mouseenter', this.mouseenter, this.get('trigger'), this);
				Y.on('mouseleave', this.mouseleave, this.get('trigger'), this);

			}

		},

		render: function (v) {

			if (this.get('visible')) {

				this.show(v);

			}

		},

		show: function (el) {

			//var el = e.currentTarget;
			CURRENT_NODE = Y.one('#' + el.getAttribute('data-id'));
			//CURRENT_NODE.setStyle('width', CURRENT_NODE.get('offsetWidth'));
			//如果气泡对象有最大宽度属性，则设置最大宽度
			if (CURRENT_NODE.get('offsetWidth') > this.get('maxWidth')) {

				CURRENT_NODE.setStyle('width', this.get('maxWidth') + 'px');

			}

			//气泡默认朝向时设置箭头朝向
			if (this.get('arrow') == 'bottom') {

				CURRENT_NODE.setXY([el.getX() - this.get('offsetX'), el.getY() - CURRENT_NODE.get('offsetHeight') - 6 - this.get('offsetY')]);

			}

			//如果气泡对象有箭头朝上属性，则设置箭头朝向
			if (this.get('arrow') == 'top') {

				CURRENT_NODE.setXY([el.getX() - this.get('offsetX'), el.getY() + 25 + this.get('offsetY')]);

				CURRENT_NODE.one('.bubble-arrow').addClass('arrow-top');

			}

			//控制气泡朝右侧翻转
			if (Y.DOM.winWidth() - CURRENT_NODE.get('offsetLeft') - CURRENT_NODE.get('offsetWidth') <= 0) {

				CURRENT_NODE.setX(el.getX() - CURRENT_NODE.get('offsetWidth') + el.get('offsetWidth'));

				CURRENT_NODE.one('.bubble-arrow').addClass('arrow-right');

			}

			CURRENT_NODE.setStyle('visibility', 'visible');

		},

		hide: function (el) {

			Y.later(this.get('delay'), this, function () {

				CURRENT_NODE = Y.one('#' + el.getAttribute('data-id'));

				CURRENT_NODE.setStyle('visibility', 'hidden');

			}, [], false);

		},

		mouseenter: function (e) {

			this.show(e.currentTarget);

		},

		mouseleave: function (e) {

			this.hide(e.currentTarget);

		},

		resize: function () {

			var that = this;

			Y.all(this.get('trigger')).each(function (v) {

				that.render(v);

			});

		}

	});

	Y.Bubble = bubble;

}, '1.1.0', {
	requires: ['base-base', 'node-base', 'node-screen', 'node-style', 'event-base', 'event-mouseenter', 'event-resize']
});