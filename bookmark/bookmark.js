/*
author:lingken
date:2011/4/2
version:1.0.0
*/
YUI.add('k2-bookmark', function(Y) {
	var BookMark = Y.BookMark = function() {
		BookMark.superclass.constructor.apply(this, arguments);
	};
	
	BookMark.NAME = 'bookmark';
	BookMark.ATTRS = {};
	
	Y.extend(BookMark, Y.Base, {
		initializer:function(config) {
				if(!config)
					config = {};
				this.Selector = config.Selector?config.Selector:".bookMark";
				this.Title = config.Title?config.title:document.title;
				this.URL = config.URL?config.Url:location.href;
		},
		
		onAddBookMark:function() {
			var self = this;
			Y.on("click", function(e){self._addBookMark(e);}, this.Selector);
		},
		
		_addBookMark:function(e) {
			var sURL = this.URL;
			var sTitle = this.Title;
			var w = window;
			
			if(this.checkMobileDevice()){//移动设备
				return;
			}
			
			try{
				if(w.sidebar){//firefox
					w.sidebar.addPanel(sTitle, sURL, "");
				}else if (window.opera && e.target.get('tagName').toLowerCase() == 'a') {//opera				
					e.target.setAttrs({title:sTitle,href:sURL,rel:'sidebar'});//Opera 7+
					return true;
				}else if(document.all && typeof window.external == "object"){//IE
					w.external.addFavorite(sURL, sTitle);//IE5+
				}else{
					alert("请使用 " + this._hotKey() + " 进行添加");
				}
		
				return false;
			}catch(e){
				alert(e);
			}
		},
		
		checkMobileDevice:function(){
			var r='iphone|ipod|android|palm|symbian|windows ce|windows phone|iemobile|'+
			'blackberry|smartphone|netfront|opera m|htc[-_].*opera';
			return (new RegExp(r)).test(navigator.userAgent.toLowerCase());
		},
		
		_hotKey:function() {
			var ua = navigator.userAgent.toLowerCase();
			var isMac = (ua.indexOf('mac') != - 1);
			var hotkey = '';
			
			if (ua.indexOf('konqueror') != - 1) {
				hotkey = 'CTRL + B';
			} else {
				hotkey = (isMac ? 'Command/Cmd' : 'CTRL') + ' + D';
			}
			
			return hotkey;
		}
	});
}, '1.0.0', {requires:['base-base','node-base']} );