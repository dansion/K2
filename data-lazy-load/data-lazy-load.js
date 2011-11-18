/*!
 * @revision:
 */

/*
 * @author:wulong
 * @version:1-0-1
 */
YUI.add('k2-data-lazyload',function(Y){
  Y.log('done','info','k2-data-lazyload');

	var DATA_LAZYLOAD = 'data-k2-lazyload',
			defaultConfig = {
				mode : 'manual',
				offset : 'default',
				placeholder : 'http://k.kbcdn.com/k2/data-lazy-load/dot.gif'
	};

	function DataLazyload(containers,config){
		if (!Y.Lang.isArray(containers)) {
       this.containers = [Y.one(containers) || document];
    }else{
			this.containers = containers;
		}

		if (config === undefined) {
			config = {};
		}
		this.config = Y.merge(defaultConfig,config);
		this._init();
	
	}

	Y.mix(DataLazyload,{
		_init : function(){
			this.loader();
			this._initEvent();
		},

		_initEvent : function(){
			Y.on('scroll',function(){this.loader()},window,this);
			Y.on('resize',function(){this.loader()},window,this);
		},
		loader : function(){
			var i,j;
			for(i=0,j=this.containers.length;i<j;i++){
				Y.one(this.containers[i]).all('img').each(function(n){
					if(this._filterImg(n)){
						this._loadImg(n);
					}
				},this);
			}			 
		},
		_filterImg : function(img){
			var	dataSrc = img.getAttribute(DATA_LAZYLOAD),
					holder = this.config.placeholder;
			if(this.config.mode == 'manual'){
				if(dataSrc && dataSrc != img.get('src')){
					if(holder !== 'none'){
						img.setAttribute('src',holder);
					}
					return true
				}
			}else{
				if(img.get('offsetTop') > (this._getThreshold() + Y.one(document).get('scrollTop')) && !dataSrc){
					img.setAttribute(DATA_LAZYLOAD,img.get('src'));
					if (holder !== 'none') {
							img.setAttribute('src',holder);
					} else {
							img.removeAttribute('src');
					}
				}
				return true
			}
	  },

		_loadImgs : function(imgs){
				imgs.each(function(n){
					_loadImg(n);
				});
		},

		_loadImg : function(img){
				if(img.get('offsetTop') <= (this._getThreshold() + Y.one(document).get('scrollTop')) && this._filterImg(img)){
					this.loadImgSrc(img);
				}				
		},

		loadImgSrc : function(img){
				dataSrc = img.getAttribute(DATA_LAZYLOAD);
				if(dataSrc && img.src != dataSrc){
					img.setAttribute('src',dataSrc);
					img.removeAttribute(DATA_LAZYLOAD);
				}
		},

		_getThreshold : function(){
			var offset = this.config.offset;	
			if(offset === 'default'){
				return Y.one(document).get('winHeight')*2;
			}else{
				return Y.one(document).get('winHeight') + offset;
			}								
		}
	},true,null,4);


	Y.DataLazyload = DataLazyload;
	

},'1.0.0',{requires:['event-base','node-base','node-screen']});
