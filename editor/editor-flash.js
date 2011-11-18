/*
 * @revision:
 */
/*
 * @author:zhengxie.lj@taobao.com
 * @version:1-0-2
 */ 
YUI.add('k2-editor-flash', function(Y) {

	var Node = Y.Node,
		DOM = Y.DOM,
		FLASH_CID = "clsid:d27cdb6e-ae6d-11cf-96b8-444553540000",
		FLASH_TYPE = "application/x-shockwave-flash",
		INSERT_FLASH = "插入Flash",
		EDIT_FLASH = "编辑Flash";

    var createSWF = function(flashURL, w, h, p){
			var objstring = '<object style="margin:'+p+'px;" ';
			if (Y.UA.ie) {
				objstring += 'classid="' + FLASH_CID + '" ';
			}else {
				objstring += 'type="' + FLASH_TYPE + '" data="' + flashURL + '" ';
			}
			objstring += 'width="' + w + '" height="' + h + '">';

			if (Y.UA.ie) {
				objstring += '<param name="movie" value="' + flashURL + '"/>';
			}
			objstring += "</object>"; 
			return objstring
		},
		EditorFlash = function(config) {
			EditorFlash.superclass.constructor.apply(this, arguments);
			this.setAttrs(config);
		},
		HOST='host';
		
    Y.extend(EditorFlash, Y.Base, {
			
			button: null,
			popup: null,
			popupNode: null,
			_eventAdded: false,

			initializer: function() {
				this._createButton();
			},
			disable : function(){
				this.button.set('state','disabled');
			},
			enable : function(){
				this.button.set('state','off');
			},
			_createButton : function(){
				 var editor = this.get(HOST);
				 this.button = new Y.EditorButton({
								title:'插入Flash',
								cmd : 'insertImage',
								contentCls: 'k2-editor-tools-flash',
								container:editor.get('toolBarDiv')
				});
				this.button.on('click', function(e){
					 if(!this._eventAdded){
						this._eventAdded = true;
						this._addEvents();
					 }
					if(Y.UA.ie){
						var inst = this.get(HOST).getInstance(),
							sel = new inst.Selection(),
							out = sel.getSelected();
						if(out&&out.size()){
							this.selectedRecord = out;
						}else{
							this.selectedRecord = null;
						}
					}

					if(!this.popup){
						this._createPopup();
						//popup show has a delay in IE6
						var self = this;
						setTimeout(function(){
							self.popup.show();
							self._initDefaultUserData();
						},1);
					}else{
						this.popup.show();
						this._initDefaultUserData();
					}
				}, this);
			},
			_createPopup: function(){
				var editor = this.get(HOST),
					 popupNode = Node.create("<div class='k2-editor-flash-popup'></div>"),
					 self = this;
				
				this.popup = Y.createPop({
					sTitle:INSERT_FLASH,
					iWidth:'420',
					iHeight:'220',
					vContent : popupNode,
					share:false,
					bShowAfterInit:false,
					onOk:function(e){
						self._onSubmitClicked(e);
					},
					sOk:'提交',
					onCancel:false,
					btnAlign:'center'
				});
				this.popupNode = popupNode;
				this._initPopupNode();
				
			},
			_initPopupNode: function(){
				var tpl = '<div style="padding:10px 10px 0 10px">'
							+ '<ul class="k2-editor-flash-userselect k2-fix-float">'
							+ '<li><label>网址：<input class="k2-editor-flash-website"/></label></li>'
							+ '<li><label>宽度：<input class="k2-editor-flash-width"/></label></li>'
							+ '<li><label>高度：<input class="k2-editor-flash-height"/></label></li>'
							+ '<li><label>边距：<input class="k2-editor-flash-padding"/></label></li>'
							+ '</ul><p class="info" style="display:none">请填写合法的Flash地址，尺寸（至少大于8像素）。</p></div>';
				this.popupNode.setContent(tpl);
			},
			_getUserData: function(){
				var pn = this.popupNode,
					website = pn.one('.k2-editor-flash-website').get('value'),
					width = pn.one('.k2-editor-flash-width').get('value'),
					height = pn.one('.k2-editor-flash-height').get('value'),
					padding = pn.one('.k2-editor-flash-padding').get('value');

				return {website: website, width: width, height: height, padding: padding};
			},
			_setUserData: function(options){
				var pn = this.popupNode,
					website = options.website,
					width = options.width,
					height = options.height,
					padding = options.padding || this.get('defaultPadding');

				pn.one('.k2-editor-flash-website').set('value', website);
				pn.one('.k2-editor-flash-width').set('value', width);
				pn.one('.k2-editor-flash-height').set('value', height);
				pn.one('.k2-editor-flash-padding').set('value', padding);
				if(options.editMode){
					this.popup.setTitle(EDIT_FLASH);
				}else{
					this.popup.setTitle(INSERT_FLASH);
				}
			},
			_initDefaultUserData: function(){
				this._setUserData({
					website: this.get('defaultWebsite'),
					width: this.get('defaultWidth'),
					height: this.get('defaultHeight'),
					padding: this.get('defaultPadding')
				});

			},
			_addEvents: function (){
				var editor = this.get(HOST),
					editorDoc=editor.getInstance().config.doc;
				Y.on("dblclick", function(e){
					if(e.target.hasClass('k2-editor-flash-holder')) {
						var self = this,
							target = e.target,
							_onPopupReady = function(){
								self._setUserData({
									website: target.getAttribute('_data_website'),
									width: target.getAttribute('width'),
									height: target.getAttribute('height'),
									padding: target.getAttribute('_data_padding'),
									editMode: true
								});
								self.popup.show();
							};
						this.selectedRecord = target;

						if(!this.popup){
							this._createPopup();
							setTimeout(function(){
								_onPopupReady();
							}, 1);
						}else{
							_onPopupReady();
						}
					}
				}, editorDoc, this);
			},
			_formatImage: function(options){
				options = options || {};
				var spacerUrl = "http://k.kbcdn.com/k2/editor/assets/skins/spacer.gif",
					website = options.website,
					w = parseFloat(options.width),
					h = parseFloat(options.height),
					p = parseFloat(options.padding) || 5,
					style = 'background: url(http://k.kbcdn.com/k2/editor/assets/skins/swf-icon.png) no-repeat scroll center center #f2f2f2;border: 1px solid #A9A9A9;';
				
				if( p > 0){
					style += "margin:"+p+"px;";
				}
				
				var swf = createSWF(website, w, h, p);
				var img =  '<img style="'+style+'" class="k2-editor-flash-holder" src="'+spacerUrl+'" ';
				img += '_data_realelement="'+encodeURI(swf)+'" ';
				img += '_data_website="'+website+'" _data_padding="'+p+'" ';
				img += 'width="'+w+'" height="'+h+'">';
				return img;
			},
			isValidParams: function(userData){
				var v1 = userData.website.match(new RegExp('(http|https)://')),
					v2 = parseFloat(userData.width) > 8,
					v3 = parseFloat(userData.height) > 8;
				return v1 && v2 && v3;
			},
			_onSubmitClicked: function(e){
				var inst = this.get(HOST).getInstance(),
					sel,
					out,
					range,
					userData = this._getUserData(),
					pHtml,
					editor = this.get(HOST);
				

				if(!this.isValidParams(userData)){
					this.popupNode.one('.info').setStyle('display', 'block');
					e.halt();
					return;
				}else{
					this.popupNode.one('.info').setStyle('display', 'none');
				}
				
				pHtml = this._formatImage(userData);
				sel = new inst.Selection(); 
				out = sel.getSelected();
				if(this.selectedRecord){
					if(!this.selectedRecord.size){
						try{
							this.selectedRecord.replace(Y.Node.create(pHtml));
						}catch(error){
							//fix bug for IE6/IE7
							var sr = this.selectedRecord,
								website = userData.website,
								w = parseFloat(userData.width),
								h = parseFloat(userData.height),
								p = parseFloat(userData.padding) || 5,
								swf = createSWF(website, w, h, p);

							sr.setAttribute('_data_realelement', encodeURI(swf));
							sr.setAttribute('width', w);
							sr.setAttribute('height', h);
							sr.setAttribute('_data_website', website);
							sr.setAttribute('_data_padding', p);
						}
					}else{
						this.selectedRecord.item(0).replace(Y.Node.create(pHtml));
						for(var i = 1, l = this.selectedRecord.size(); i<l; i++){
							this.selectedRecord.item(i).remove();
						}
					}
					this.selectedRecord = null;
				}else if (!sel.isCollapsed && out.size()) {
					var img = Y.Node.create(pHtml);
					out.item(0).replace(img);
					if(inst.UA.webkit){
						sel.selectNode(img);
					}
				}else{
					var self = this;
					if(inst.UA.ie || inst.UA.webkit){
						this.get(HOST).focus(function(){
							self.get(HOST).execCommand('inserthtml', pHtml);
						});
					}else{
						this.get(HOST).execCommand('inserthtml', pHtml);
					}
				}
				if(!inst.UA.ie){
					this.get(HOST).focus();
				}
			}
			
    }, {
        NAME: 'editorFlash',
        NS: 'flash',
        ATTRS: {
            host: {
                value: false
            },
			defaultWebsite:{
				value: 'http://'
			},
			defaultWidth:{
				value:320
			},
			defaultHeight:{
				value:240
			},
			defaultPadding:{
				value: 5
			}
        }
    });


    Y.namespace('Plugin');

    Y.Plugin.EditorFlash = EditorFlash;

}, '1.0.0' ,{skinnable:false, requires:['node-base', 'editor-base', 'k2-editor-button', 'k2-popup']});