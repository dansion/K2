/*
 * @revision:
 */
/*
 * @author:zhengxie.lj@taobao.com
 * @version:1-0-0
 */ 
YUI.add('k2-editor-preview', function(Y) {

    var EditorPreview = function(config) {
			EditorPreview.superclass.constructor.apply(this, arguments);
			this.setAttrs(config);
		},
		HOST='host';
		
    Y.extend(EditorPreview, Y.Base, {
			
			button: null,

			initializer: function() {
				this._createButton();
				var editor = this.get(HOST);
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
								title:'预览',
								contentCls: 'k2-editor-tools-preview',
								container:editor.get('toolBarDiv')
				});
				this.button.on('click', function(e){
					var html = editor.htmlparser.HTMLtoXML(editor.getContent());
					var win=window.open("", "newwin");
					win.document.write(html);
				}, this);
			}
    }, {
        NAME: 'editorPreview',
        NS: 'preview',
        ATTRS: {
            host: {
                value: false
            }
        }
    });


    Y.namespace('Plugin').EditorPreview = EditorPreview;

}, '1.0.0' ,{skinnable:false, requires:['node-base', 'editor-base', 'k2-editor-button']});