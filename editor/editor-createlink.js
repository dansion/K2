/*
 * @revision:
 */
/*
 * @author:wulong@taobao.com
 * @version:1-0-3
 */
YUI.add('k2-editor-createlink', function(Y) {
		var ID_LABEL_INSERT = '-insert-link-content',
				ID_LABEL_BLANK = '-is-blank';
    var EditorCreateLink = function() {
        EditorCreateLink.superclass.constructor.apply(this, arguments);
    }, HOST = 'host';

    Y.extend(EditorCreateLink, Y.Base, {	
        initializer: function() {
					var Editor = this.get(HOST),self=this;						 
					this.linkButton = new Y.EditorButton({
									text:'',
									title:'插入链接',
									contentCls : 'k2-editor-tools-link',	
									container:Editor.get('toolBarDiv')
					});

					this.linkButton.on('click',function(e){
						//Editor.focus();
						//Editor.execCommand('createlink');
      if(!self.popup){
        self._createPopup();
      }
      self.popup.show();
					},self);
					Y.EditorWrap.disablePlugin(Editor,this);
			 },
			_createPopup : function(){
					var self = this,
						Editor = self.get(HOST),
						notifierNodeStr = '<p class="k2-editor-insert-link-notice">只允许插入口碑站内链接,站外链接将被过滤</p>',
						formNodeStr = '<form class="k2-editor-insert-link" id="k2-editor-insert-link"><p><label for="'+Editor.get('editorId')+ID_LABEL_INSERT+'">请出入链接地址：<input id="'+Editor.get('editorId')+ID_LABEL_INSERT+'" type"text" class="k2-editor-insert-link-input" value="http://"></label></p><p></form>'//<label for="'+Editor.get('editorId')+ID_LABEL_BLANK+'"><input type="checkbox" id="'+Editor.get('editorId')+ID_LABEL_BLANK+'"/>是否新窗口打开</label></p></form>' 
					self.popup = Y.createPop({
						sTitle:'插入链接',
						iWidth:'350',
						iHeight:'240',
						vContent :  formNodeStr + notifierNodeStr ,
						share:false,
						bShowAfterInit:false,
						onOk:function(){
							self._insertLink(self._getVal());
						},
						sOk:'插入',
						onCancel:false,
						btnAlign:'center'

					});
					var inst= this.get(HOST).getInstance();
					sel = new inst.Selection();
     
     //support press enter
     Y.on('submit',function(e){
        e.preventDefault();
        self.popup.hide();
        self._insertLink(self._getVal());
     },'#k2-editor-insert-link');
			},
			_insertLink : function(val){
					this.get(HOST).execCommand('createlink',val);
			},
			_getVal : function(){
				var Editor = this.get(HOST),
        input = Y.one("#"+Editor.get('editorId')+ID_LABEL_INSERT),
        link = input.get('value');
    input.set('value','http://');
				return {					
								'link':link
								//'target':Y.one("#"+Editor.get('editorId')+ID_LABEL_BLANK).get('checked')
							}
			},
			 disable : function(){
					this.linkButton.set('state','disabled');
			 },
	 		 enable : function(){
					this.linkButton.set('state','off');
			 }
    },{
		/**
		  *@enum {string}
		  */
        NAME: 'editorCreateLink',
        NS: 'createlink',
        ATTRS: {
            host: {
                value: false
            }
        }
    });

    Y.namespace('Plugin');

    Y.Plugin.EditorCreateLink = EditorCreateLink;

    Y.mix(Y.Plugin.ExecCommand.COMMANDS, {
			 createlink: function(cmd,val){
						var inst = this.get('host').getInstance(), out, a, sel, holder,
                url= val.link;
								//url = prompt(CreateLinkBase.STRINGS.PROMPT, CreateLinkBase.STRINGS.DEFAULT);


            if (url) {
                holder = inst.config.doc.createElement('div');
                url = url.replace(/"/g, '').replace(/'/g, ''); //Remove single & double quotes
                url = inst.config.doc.createTextNode(url);
                holder.appendChild(url);
                url = holder.innerHTML;


                this.get('host')._execCommand(cmd, url);
                sel = new inst.Selection();
                out = sel.getSelected();
                if (!sel.isCollapsed && out.size()) {
                    //We have a selection
                    a = out.item(0).one('a');
                    if (a) {
                        out.item(0).replace(a);
                    }
                    if (Y.UA.gecko) {
                        if (a && a.get('parentNode').test('span')) {
                            if (a.get('parentNode').one('br.yui-cursor')) {
                                a.get('parentNode').insert(a, 'before');
                            }
                        }
                    }
                } else {
                    //No selection, insert a new node..
                    this.get('host').execCommand('inserthtml', '<a href="' + url + '">' + url + '</a>');
                }
            }
            return a;
        }
    },true);
}, '1.0.3' ,{skinnable:false, requires:['editor-base','k2-editor-button']});
