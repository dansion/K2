/*
 * @author: yanshu@taobao.com
 * @version:1-0-0
 */

YUI.add('k2-image-cropper',function(Y){

	Y.log('done','info','k2-image-cropper');
	/**
	 * image cropper module for k2
	 * @module:k2-image-cropper
	 */
	var Node = Y.Node,
			  DOM = Y.DOM,
			  Event = Y.Event,
			  Lang = Y.Lang;
	
	/**
	  * @constructor
	  * @class ImageCropper
	  * @description <p>Creates a Image Cropper control.</p>
	  * @extends YAHOO.util.Element
	  * @param {String/HTMLElement} el The image element to make croppable.
	  * @param {Object} attrs Object liternal containing configuration parameters.
	*/
	//var Crop = function(el, config){
	//	  var oConfig = {
	//		  element: el,
	//		  attributes: config || {}
	//	  };
	//	  Crop.superclass.constructor.call(this, oConfig.element, oConfig.attributes);
	//};
	
	var Crop = function() {
		Crop.superclass.constructor.apply(this, arguments);
	};
	
	
	/**
	* @private
	* @static
	* @property _instances
	* @description Internal hash table for all ImageCropper instances
	* @type Object
	*/ 
	Crop._instances = {};
	
	/**
    * @static
    * @method getCropperById 
    * @description Get's an ImageCropper object by the HTML id of the image associated with the ImageCropper object.
    * @return {Object} The ImageCropper Object
    */ 
    Crop.getCropperById = function(id) {
        if (Crop._instances[id]) {
            return Crop._instances[id];
        }
        return false;
    };
	
	//继承自Base，所需要定义的NAME属性
	Crop.NAME = 'k2-image-cropper';
	
	//继承自Base，所需要定义的ATTRS属性
	Crop.ATTRS = {
		//全局配置对象
		'id': {
			value: {},
			setter: function(val) {
				return Y.Lang.trim(val);
			},
			validator: function(val) {
				return Y.Lang.isString(val);
			}
		},
		'id-name' : {
			getter: function() {
				return this.get('id').substring(1);
			}
		},
		'useKeys': {
			validator: Y.Lang.isBoolean,
			getter: function(val) {
				return ((val === false) ? false : true);
			}
		},
		
		/**
		* @attribute keyTick
		* @description The pixel tick for the arrow keys, defaults to 1
		* @type Number
		*/
		'keyTick': {
			value: 1,
			validator: Y.Lang.isNumber
		},
		
		/**
		* @attribute shiftKeyTick
		* @description The pixel tick for shift + the arrow keys, defaults to 10
		* @type Number
		*/
		'shiftKeyTick': {
			value: 10,
			validator: Y.Lang.isNumber
		},
		
		 /**
		* @attribute status
		* @description Show the Resize Utility status, defaults to true
		* @type Boolean
		*/
		'status': {
			value: false,        
            validator: function(val) {
              return Y.Lang.isBoolean(val);
            }
		},
		
		/**
		* @attribute initialXY
		* @description Array of the XY position that we need to set the crop element to when we build it. Defaults to [10, 10]
		* @type Array
		*/
		'initialXY': {
			writeOnce: true,
			value: [10, 10],
			validator: Y.Lang.isArray
		},
		
		/**
		* @attribute initHeight
		* @description Set the initlal height of the crop area, defaults to 1/4 of the image height
		* @type Number
		*/
		'initHeight': {
			writeOnce: true,
			value: 50,
			validator: Y.Lang.isNumber
		},
		
		/**
		* @attribute initWidth
		* @description Set the initlal width of the crop area, defaults to 1/4 of the image width
		* @type Number
		*/
		'initWidth': {
			writeOnce: true,
			value: 50,
			validator: Y.Lang.isNumber
		},
		
		
		'config':{
			value: {},
			setter: function(val) {
				return val;
			}
		}
	};
	
	Y.extend(Crop, Y.Base,{
		/**
        * @private
        * @property CSS_MAIN
        * @description The CSS class used to wrap the element 
        * @type String
        */
        CSS_MAIN: 'yui-crop',
        /**
        * @private
        * @property CSS_MASK
        * @description The CSS class for the mask element
        * @type String
        */
        CSS_MASK: 'yui-crop-mask',
        /**
        * @private
        * @property CSS_RESIZE_MASK
        * @description The CSS class for the mask inside the resize element
        * @type String
        */
        CSS_RESIZE_MASK: 'yui-crop-resize-mask',
		
		/**
        * @private
        * @property CSS_RESIZE
        * @description The CSS class for indicating the resize element
        * @type String
        */
		CSS_RESIZE: 'yui3-resize',
		
		/**
        * @private
        * @property _image
        * @description The url of the image we are cropping
        * @type String
        */
        _image: null,
        /**
        * @private
        * @property _active
        * @description Flag to determine if the crop region is active
        * @type Boolean
        */
        _active: null,
        /**
        * @private
        * @property _resize
        * @description A reference to the Resize Utility used in this Cropper Instance
        * @type Object
        */
        _resize: null,
        /**
        * @private
        * @property _resizeEl
        * @description The HTML Element used to create the Resize Oject
        * @type HTMLElement
        */
        _resizeEl: null,
        /**
        * @private
        * @property _resizeMaskEl
        * @description The HTML Element used to create the Resize mask
        * @type HTMLElement
        */
        _resizeMaskEl: null,
        /**
        * @private
        * @property _wrap
        * @description The HTML Element created to wrap the image
        * @type HTMLElement
        */
        _wrap: null,
        /**
        * @private
        * @property _mask
        * @description The HTML Element created to "mask" the image being cropped
        * @type HTMLElement
        */
        _mask: null,
        /**
        * @private
        * @method _createWrap
        * @description Creates the wrapper element used to wrap the image
        */
		

		
		/**
        * @private
        * @method _createWrap
        * @description Creates the wrapper element used to wrap the image
        */
        _createWrap: function() {
			var id = this.get('id-name'),
				el = Y.one(this.get('id')),
				par = el.ancestor();
            this._wrap = document.createElement('div');
            this._wrap.id = id + '_wrap';
            this._wrap.className = this.CSS_MAIN;
            this._wrap.style.width = el.width ? el.width + 'px' : el.getStyle('width');
            this._wrap.style.height = el.height ? el.height + 'px' : el.getStyle('height');
			//Y.log(this._wrap.style.width);
			//Y.log(this._wrap.style.height);
            //Y.log(par);
            par.replaceChild(this._wrap, el);
			//Y.log(this._wrap, '_wrap')
			//Y.log(el);
			//Y.log(this);
            Y.one(this._wrap).appendChild(el);
            
			Y.on('mouseover', this._handleMouseOver, this._wrap, this, true);
			Y.on('mouseover', this._handleMouseOut, this._wrap, this, true);
			
			Y.on('click', function(ev) { ev.halt(); }, this._wrap);
			
        },
		
		/**
        * @private
        * @method _createMask
        * @description Creates the mask element used to mask the image
        */
        _createMask: function() {
            this._mask = document.createElement('div');
            this._mask.className = this.CSS_MASK;
            this._wrap.appendChild(this._mask);
        },
		
		/**
        * @private
        * @method _createResize
        * @description Creates the resize element and the instance of the Resize Utility
        */
        _createResize: function() {
            this._resizeEl = document.createElement('div');
            this._resizeEl.className = this.CSS_RESIZE;
			
			
            this._resizeEl.style.position = 'absolute';
            
            this._resizeEl.innerHTML = '<div class="' + this.CSS_RESIZE_MASK + '"></div>';
			
			//Y.log(this._resizeEl, 'resize-plugin')
            this._resizeMaskEl = this._resizeEl.firstChild;
            this._wrap.appendChild(this._resizeEl);
			
			//Y.log(this._resizeMaskEl, 'resize-plugin')
			
            this._resizeEl.style.top = this.get('initialXY')[1] + 'px';
            this._resizeEl.style.left = this.get('initialXY')[0] + 'px';
			
			Y.log(this._resizeMaskEl, '_resizeMaskEl')
			
            this._resizeMaskEl.style.height = Math.floor(this.get('initHeight')) + 'px';
            this._resizeMaskEl.style.width = Math.floor(this.get('initWidth')) + 'px';
			
			//Y.log(this.get('initWidth'), 'resize-initWidth')
			
			this._resize = Y.one(this._resizeEl);
			
			this._resize.plug(Y.Plugin.Resize, {
				knobHandles: true,
                handles: 'all',
                draggable: true,
                status: this.get('status'),
                minWidth: this.get('minWidth'),
                minHeight: this.get('minHeight'),
                ratio: this.get('ratio'),
                autoRatio: this.get('autoRatio'),
                height: this.get('initHeight'),
                width: this.get('initWidth')
			});
			
			
			
            
            this._setBackgroundImage(Y.one(this.get('id')).getAttribute('src', 2));
            this._setBackgroundPosition(-(this.get('initialXY')[0]),  -(this.get('initialXY')[1]));
            
            //this._resize.on('startResize', this._handleStartResizeEvent, this, true);
            //this._resize.on('endResize', this._handleEndResizeEvent, this, true);
            //this._resize.on('dragEvent', this._handleDragEvent, this, true);
            //this._resize.on('beforeResize', this._handleBeforeResizeEvent, this, true);
            //this._resize.on('resize', this._handleResizeEvent, this, true);
            //this._resize.dd.on('b4StartDragEvent', this._handleB4DragEvent, this, true);
			//Y.log(this._resize, 'this._resize')
			this._resize.resize.on('k2-resize:start', this._handleStartResizeEvent, this, true);
			this._resize.resize.on('k2-resize:end', this._handleEndResizeEvent, this, true);
			this._resize.resize.on('k2-resize:drag', this._handleDragEvent, this, true);
			this._resize.resize.on('k2-resize:resize', this._handleResizeEvent, this, true);
			this._resize.resize.on('k2-resize:beforeResize', this._handleBeforeResizeEvent, this, true);
			
			
			//Y.log(this._resizeEl, '_resizeEl')
			//Y.log(this._resize.resize, '_resize')
			//Y.log('start')
        },
		
		/**
        * @private
        * @method _handleResizeEvent
        * @param Event ev The Resize Utilitys resize event.
        * @description Handles the Resize Utilitys Resize event
        */
        _handleResizeEvent: function(ev) {
			//Y.log('_handleResizeEvent')
			
			
            this._setConstraints(true);
			
			
            this._syncBackgroundPosition();
            this.fire('resizeEvent', arguments);
            this.fire('moveEvent', { target: 'resizeevent' });
        },
		
		/**
        * @private
        * @method _handleDragEvent
        * @description Handles the DragDrop DragEvent event
        */
        _handleDragEvent: function() {
			//Y.log('dragEvent')
			
			
            this._syncBackgroundPosition();
            this.fire('dragEvent', arguments);
            this.fire('moveEvent', { target: 'dragevent' });
        },

		
		/**
        * @private
        * @method _handleBeforeResizeEvent
        * @description Handles the Resize Utilitys beforeResize event
        */
        _handleBeforeResizeEvent: function(args) {
        },
		
		/**
        * @private
        * @method _handleEndResizeEvent
        * @description Handles the Resize Utilitys endResize event
        */
        _handleEndResizeEvent: function() {
			//Y.log('endEvent')
			
			
            this._setConstraints(true);
        },
		
		/**
        * @private
        * @method _handleStartResizeEvent
        * @description Handles the Resize Utilitys startResize event
        */
        _handleStartResizeEvent: function() {
			//Y.log('resize:start', 'resize:start');
            this._setConstraints(true);
			
			var resize = this._resize.resize;
            
            var  h = parseInt(resize.get('height'), 10),
                 w = parseInt(resize.get('weight'), 10),
                 t = parseInt(resize.get('top'), 10),
                 l = parseInt(resize.get('left'), 10),
                 maxH = 0, maxW = 0;
				 
			
            this.fire('startResizeEvent', arguments);
        },
		
		/**
        * @private
        * @method _setBackgroundPosition
        * @param Number l The left position
        * @param Number t The top position
        * @description Sets the background image position to the top and left position
        */
        _setBackgroundPosition: function(l, t) {
            var bl = parseInt(Y.one(this.get('id')).get('borderLeftWidth'), 10);
            var bt = parseInt(Y.one(this.get('id')).get('borderTopWidth'), 10);
            if (isNaN(bl)) {
                bl = 0;
            }
            if (isNaN(bt)) {
                bt = 0;
            }
            var mask = this._resize.get('firstChild');
            var pos = (l - bl) + 'px ' + (t - bt) + 'px';
            this._resizeMaskEl.style.backgroundPosition = pos;
			//Y.log(mask, '_setBackgroundPosition')
        },
		
		/**
        * @private
        * @method _setBackgroundImage
        * @param String url The url of the image
        * @description Sets the background image of the resize element
        */
        _setBackgroundImage: function(url) {
            var mask = this._resize.get('firstChild');
            this._image = url;
            mask.setStyle('backgroundImage', 'url(' + url + '#)');
			
			//Y.log(mask, '_setBackgroundImage')
        },
		
		/**
        * @private
        * @method _syncBackgroundPosition
        * @description Syncs the packground position of the resize element with the resize elements top and left style position
        */
        _syncBackgroundPosition: function() {
			//Y.log('_syncBackgroundPosition')
			
			
            this._handleResizeMaskEl();
            this._setBackgroundPosition(-(parseInt(this._resizeEl.style.left, 10)), -(parseInt(this._resizeEl.style.top, 10)));
        },
		
		/**
        * @private
        * @method _handleResizeMaskEl
        * @description Resizes the inner mask element
        */
        _handleResizeMaskEl: function() {
			//Y.log('_handleResizeMaskEl')
			
            var a = this._resize;
			//Y.log(a)
			//Y.log(this._resizeMaskEl, '_resizeMaskEl')
			//Y.log(a.getStyle('height'), 'a')
			//Y.log(Y.one(this._resizeMaskEl), 'Y.one(this._resizeMaskEl)')
			//

			//Y.log(Y.one(this._resizeMaskEl).getStyle('left'))
			//Y.one(this._resizeMaskEl).setStyle('top', a.getStyle('top'));
			//Y.one(this._resizeMaskEl).setStyle('left', a.getStyle('left'));
            Y.one(this._resizeMaskEl).setStyle('height', a.getStyle('height'));
			Y.one(this._resizeMaskEl).setStyle('width', a.getStyle('width'));
			
			//Y.log(this._resize.getStyle('left'), 'this._resize')

			
			//Y.log(Y.one(this._resizeMaskEl).getStyle('height'))
        },
		
		/**
        * @method getCropCoords
        * @description Returns the coordinates needed to crop the image
        * @return {Object} The top, left, height, width and image url of the image being cropped
        */
        getCropCoords: function() {
            var coords = {
                top: parseInt(this._resize.getStyle('top'), 10),
                left: parseInt(this._resize.getStyle('left'), 10),
                height: this._resize.getStyle('height'),
                width: this._resize.getStyle('width'),
                image: this._image
            };
			//Y.log(coords, 'coords')
            return coords;
        },
		
		/**
        * @method reset
        * @description Resets the crop element back to it's original position
        * @return {<a href="YAHOO.widget.ImageCropper.html">YAHOO.widget.ImageCropper</a>} The ImageCropper instance
        */
        reset: function() {
			//Y.log('reset')
            //this._resize.resize(null, this.get('initHeight'), this.get('initWidth'), 0, 0, true);
			//Y.log(this.get('initWidth'))
			//Y.log(Y.one(this._resizeMaskEl).getStyle('width'));
			this._resize.setStyle('width', this.get('initWidth') + 'px');
			this._resize.setStyle('height', this.get('initHeight') + 'px');
			//this._resize.resize.height = this.get('initHeight'),
			this._resize.setStyle('top', this.get('initialXY')[1] + 'px');
			this._resize.setStyle('left', this.get('initialXY')[0] + 'px');
            //this._resizeEl.style.top = this.get('initialXY')[1] + 'px';
            //this._resizeEl.style.left = this.get('initialXY')[0] + 'px';
            this._syncBackgroundPosition();
            return this;
        },
		
		/**
        * @method getEl
        * @description Get the HTML reference for the image element.
        * @return {HTMLElement} The image element
        */      
        getEl: function() {
            return Y.one(this.get('id'));
        },
        /**
        * @method getResizeEl
        * @description Get the HTML reference for the resize element.
        * @return {HTMLElement} The resize element
        */      
        getResizeEl: function() {
            return this._resizeEl;
        },
        /**
        * @method getWrapEl
        * @description Get the HTML reference for the wrap element.
        * @return {HTMLElement} The wrap element
        */      
        getWrapEl: function() {
            return this._wrap;
        },

        /**
        * @method getMaskEl
        * @description Get the HTML reference for the mask element.
        * @return {HTMLElement} The mask element
        */      
        getMaskEl: function() {
            return this._mask;
        },

        /**
        * @method getResizeMaskEl
        * @description Get the HTML reference for the resizable object's mask element.
        * @return {HTMLElement} The resize objects mask element.
        */      
        getResizeMaskEl: function() {
            return this._resizeMaskEl;
        },

        /**
        * @method getResizeObject
        * @description Get the Resize Utility object.
        * @return {<a href="YAHOO.util.Resize.html">YAHOO.util.Resize</a>} The Resize instance
        */      
        getResizeObject: function() {
            return this._resize;
        },
		
		/**
        * @private
        * @method _handleMouseOver
        * @description Handles the mouseover event
        */
        _handleMouseOver: function(ev) {
            var evType = 'keydown';
            //if (Y.UA.gecko || Y.UA.opera) {
            //    evType = 'keypress';
            //}
			
			// just hack opera
			if (Y.UA.opera) {
                evType = 'keypress';
            }
			//Y.log(this)
			//Y.log(this.get('useKeys'), 'useKeys');
            if (!this._active) {
                this._active = true;
				
                if (this.get('useKeys')) {
					//Y.log(evType, 'evType')
					Y.on(evType, this._handleKeyPress, document, this, true);
                }
            }
        },
        /**
        * @private
        * @method _handleMouseOut
        * @description Handles the mouseout event
        */
        _handleMouseOut: function(ev) {
            var evType = 'keydown';
            if (Y.UA.gecko || Y.UA.opera) {
                evType = 'keypress';
            }
            this._active = false;
            if (this.get('useKeys')) {
				Y.detach(evType, this._handleKeyPress, document);
            }
        },
		
		
		/**
        * @private
        * @method _moveEl
        * @description Moves the resize element based on the arrow keys
        */
        _moveEl: function(dir, inc) {
			//Y.log('El move')
            var t = 0, l = 0,
                region = this._setConstraints(),
                resize = true;
        
            switch (dir) {
                case 'down':
                    t = -(inc);
					//Y.log(this._resizeEl)
                    if ((region.bottom - inc) < 0) {
                        resize = false;
                        this._resizeEl.style.top = (region.top + region.bottom) + 'px';
                    }
                    break;
                case 'up':
                    t = (inc);
                    if ((region.top - inc) < 0) {
                        resize = false;
                        this._resizeEl.style.top = '0px';
                    }
                    break;
                case 'right':
                    l = -(inc);
                    if ((region.right - inc) < 0) {
                        resize = false;
                        this._resizeEl.style.left = (region.left + region.right) + 'px';
                    }
                    break;
                case 'left':
                    l = inc;
                    if ((region.left - inc) < 0) {
                        resize = false;
                        this._resizeEl.style.left = '0px';
                    }
                    break;
            }
        
            if (resize) {
                this._resizeEl.style.left = (parseInt(this._resizeEl.style.left, 10) - l) + 'px';
                this._resizeEl.style.top = (parseInt(this._resizeEl.style.top, 10) - t) + 'px';
                this.fire('moveEvent', { target: 'keypress' });
            } else {
                this._setConstraints();
            }
            this._syncBackgroundPosition();
        },

        /**
        * @private
        * @method _handleKeyPress
        * @description Handles the keypress event
        */
        _handleKeyPress: function(ev) { 
			//Y.log('KeyPress fire');
            var kc = ev.charCode,
                stopEvent = false,
                inc = ((ev.shiftKey) ? this.get('shiftKeyTick') : this.get('keyTick'));
				
			//Y.log(kc, 'keypress charcode')
			//Y.log(ev.shiftKey, 'ev.shiftKey')
            
            switch (kc) {
                case 0x25: // left
                    this._moveEl('left', inc);
                    stopEvent = true;
                    break;
                case 0x26: // up
                    this._moveEl('up', inc);
                    stopEvent = true;
                    break;
                case 0x27: // right
                    this._moveEl('right', inc);
                    stopEvent = true;
                    break;
                case 0x28: // down
                    this._moveEl('down', inc);
                    stopEvent = true;
                    break;
                default:
            }
            if (stopEvent) {
                ev.preventDefault();
            }
        },
		
		/**
        * @private
        * @method _setConstraints
        * @param Boolean inside Used when called from inside a resize event, false by default (dragging)
        * @description Set the DragDrop constraints to keep the element inside the crop area.
        * @return {Object} Object containing Top, Right, Bottom and Left constraints
        */
        _setConstraints: function(inside) {
			//Y.log('_setConstraints')
            var resize = this._resize.resize;
			//Y.log(resize, 'this resize')
			//Y.log(resize.get('host'), 'the host')
			//Y.log(this._resize, 'this node')
			
            //resize.dd.resetConstraints();
            var height = parseInt(resize.get('height'), 10),
                width = parseInt(resize.get('width'), 10);
				//Y.log(height)
            //if (inside) {
            //    //Called from inside the resize callback
            //    height = resize._cache.height;
            //    width = resize._cache.width;
            //}
            //
            //Get the top, right, bottom and left positions
            var region = Y.one(this.get('id')).get('region');
			//Y.log(region)
			
            //Get the element we are working on
            var el = resize.getWrapEl();
			//Y.log(el)
            
            //Get the xy position of it
            var xy = el.getXY();
			//Y.log(xy)
            
            //Set left to x minus left
            var left = xy[0] - region.left;
            
            //Set right to right minus x minus width
            var right = region.right - xy[0] - width;
            
            //Set top to y minus top
            var top = xy[1] - region.top;
            
            //Set bottom to bottom minus y minus height
            var bottom = region.bottom - xy[1] - height;
            
            if (top < 0) {
                top = 0;
            }
            
            //resize.dd.setXConstraint(left, right); 
            //resize.dd.setYConstraint(top, bottom);
            //
			
			//resize._constrainResize({
			//	w: right - left,
			//	h: bottom - top,
			//	l: region.left,
			//	t: region.top
			//});
			
			//Y.log(this._resize, '_jdjdjdj');
			//this._resize.dd.set('constrain', {top, right, bottom, left});
			this._resize.dd.plug(Y.Plugin.DDConstrained, {
				constrain2node: this.get('id')+'_wrap'
			});
			
			//Y.log(resize)
			
			
			
            return {
                top: top,
                right: right,
                bottom: bottom,
                left: left
            };

            
            
        },
		
		
		
		 /** 
        * @private
        * @method init
        * @description The ImageCropper class's initialization method
        */  
		initializer:function(){
			Crop._instances[this.get('id-name')] = this;
			//Y.log(Crop._instances[this.get('id-name')])
			this._createWrap();
			this._createMask();
			this._createResize();
			this._setConstraints();
		},
		
		
	  /**
	   * some method
	   * @method method name
	   * @param
	   * @private
	   */
	  _addIvDiv:(function() {
			
	  })(),
	  
	  destructor:function(){}
	
	});
	
	/**
	* description
	* @class demo class name 
	*/
	
	/**
	* @method demo method name
	* @param ... 
	*/
	Y.k2ImageCropper = Crop;

},'1.0.0',{requires:['base','node', 'k2-resize']});
