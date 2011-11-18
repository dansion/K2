/*
 * @revision:
 */
/*
 * @author:wulong@taobao.com
 * @version:1-0-2
 */
YUI.add('k2-editor-format', function(Y) {

    var EditorSingleFormat = function() {
        EditorSingleFormat.superclass.constructor.apply(this, arguments);
    }, HOST = 'host';

    Y.extend(EditorSingleFormat, Y.Base, {
			initializer: function() {
				var self = this,
						editor = self.get("editor"),
						text = self.get("text"),
						style = self.get("style"),
						cmd = self.get("cmd"),
						title = self.get("title"),
						contentCls = self.get("contentCls"),
						container = self.get('container');

				self.btn = new Y.EditorButton({
								text:text,
								contentCls : contentCls,	
								container:container,
								title:title
				});
				
				self.btn.on("offClick", self._on, self);
				self.btn.on("onClick", self._off, self);
				editor.on("nodeChange", self._selectionChange, self);
				Y.EditorWrap.disablePlugin(editor,this);
			},
			disable : function(){
				this.btn.set('state','disabled');
			},
			enable : function(){
				this.btn.set('state','off');
			},
			_selectionChange:function(ev) {
					var self = this,
							editor = self.get("editor"),
							text = self.get("text"),
							style = self.get("style"),
							title = self.get("title"),
							btn = self.btn,
							elementPath = ev.path;
					if (btn.get("state") == Y.EditorButton.DISABLED)
							return;
					//todo
					//判断当前是否有样式,在button上表示状态
					/*
					if () {
							btn.set("state", Y.EditorButton.ON);
					} else {
							btn.set("state", Y.EditorButton.OFF);
					}
					*/
			},

			_on:function() {
					var self = this,
							editor = self.get("editor"),
							cmd = self.get("cmd"),sel,inst;
							/* todo
							 * apply or remove style to editor content
							 */
							if(!editor.getInstance().UA.ie){
								editor.focus();
							}
							editor.execCommand(cmd);
							//editor.style.applyStyle(cmd);
			},
			_off:function() {
					var self = this,
							editor = self.get("editor"),
							cmd = self.get("cmd");
							/* todo
							 * apply or remove style to editor content
							 */
							Y.log('remove')
							//editor.execCommand(cmd)
			}
    }, {
        NAME: 'editorSingleFormat',
        NS: 'singleformat',
        ATTRS: {
                editor:{},
                text:{},
                contentCls:{},
                title:{},
                style:{},
								container:{},
								cmd:{}
        }
    });

    Y.EditorSingleFormat = EditorSingleFormat;


    var EditorMulitFormat = function() {
        EditorMulitFormat.superclass.constructor.apply(this, arguments);
    }, HOST = 'host';

    Y.extend(EditorMulitFormat, Y.Base, {
			initializer:function() {
					var self = this,
							editor = self.get("editor");

					self.el = new Y.EditorSelect({
							container:self.get('container'),
							width:self.get("width"),
							items:self.get('items'),
							showValue:self.get("showValue"),
							popupWidth:self.get("popupWidth"),
							title:self.get("title"),
							host:self.get('editor')
					});


					self.el.on("afterValueChange", self._vChange, self);
					editor.on("nodeChange", self._selectionChange, self);
					Y.EditorWrap.disablePlugin(editor,this);
			},
			disable:function() {
					this.el.set("state",'disabled');
			},
			enable:function() {
					this.el.set("state",'enabled');
			},

			_vChange:function(ev) {
					var self = this,
							editor = self.get("editor"),
							v = ev.newVal,
							pre = ev.prevVal;
					if (v == pre) {
							self.el.set("value", "");
							editor.execCommand(self.get('cmd'),v);
					} else {
							editor.execCommand(self.get('cmd'),v);
					}
					if(!editor.getInstance().UA.ie){
						editor.focus();
					}

			},

			_selectionChange:function(ev) {
					// todo change value	
			}
    }, {
        NAME: 'editorMulitFormat',
        NS: 'mulitformat',
        ATTRS: {
                editor:{},
                text:{},
                contentCls:{},
                title:{},
                style:{},
								container:{},
								cmd:{},
								items:[],
								width:{},
								popupWidth:{}
        }
    });

    Y.EditorMulitFormat = EditorMulitFormat;
	/*	todo by wulong
	Y.mix(Y.Plugin.ExecCommand.COMMANDS, {
		fontsize : function(cmd,value) {
				var inst = this.getInstance(),
						sel = new inst.Selection(), n, prev,wrapNode;

				if (sel.isCollapsed) {
						Y.log(sel.focusNode.test('span')&&sel.focusNode.get('innerHTML').match(/(\&nbsp\;)+/gi));
						n = this.command('inserthtml', '<span style="font-size:' + value + 'px">&nbsp;</span>');
						prev = n.get('previousSibling');
						if (prev && prev.get('nodeType') === 3) {
								if (prev.get('length') < 2) {
										prev.remove();
								}
						}
						sel.selectNode(n.get('firstChild'), true, false);
						return n;
				} else {
					//sel.text.replace('<span style="font-size:60px;">'+sel.text+'</span>');
					//Y.log(sel.text);
					//wrapNode = sel.wrapContent('span');
					//wrapNode.setStyle('fontSize',value+'px');
					//sel.remove();
				}
						
		}
    },true);
	*/

}, '1.0.1' ,{skinnable:false, requires:['editor-base','k2-editor-button','k2-editor-select']});
