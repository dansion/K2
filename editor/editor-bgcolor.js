/*
 * @revision:
 */
/*
 * @author:wulong@taobao.com
 * @version:1-0-2
 */
YUI.add('k2-editor-bgcolor', function(Y) {

    var EditorBgColor = function() {
        EditorBgColor.superclass.constructor.apply(this, arguments);
    }, HOST = 'host';

    Y.extend(EditorBgColor, Y.Base, {
			initializer: function() {
				var editor = this.get(HOST);
				this.colorSupport = new Y.ColorSupport({
						editor:editor,
						cmd:'backcolor',
						title:"背景颜色",
						contentCls:"k2-editor-tools-bgcolor",
						container:editor.get('toolBarDiv')
				});
				Y.EditorWrap.disablePlugin(editor,this);
			},
			disable : function(){
				this.colorSupport.disable();
			},
			enable : function(){
				this.colorSupport.enable();
			}
    }, {
        NAME: 'editorBgColor',
        NS: 'bgcolor',
        ATTRS: {
            host: {
                value: false
            }
        }
    });

    Y.namespace('Plugin');

    Y.Plugin.EditorBgColor = EditorBgColor;




}, '1.0.1' ,{skinnable:false, requires:['editor-base','k2-editor-colorsupport']});
