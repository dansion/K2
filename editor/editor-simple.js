/*
 * @revision:
 */
/*
 * @author:wulong@taobao.com
 * @version:1-0-4
 */
YUI.add('k2-editor-simple', function(Y) {
		var SimpleEditor ={
			render : function(id,config){
				editor = Y.EditorWrap.render(id);
				if(!Y.Object.isEmpty(editor)){
					config = config || {}
					editor.plug(Y.Plugin.EditorSource);
					editor.plug(Y.Plugin.EditorFont);
					editor.plug(Y.Plugin.EditorAlign);
					editor.plug(Y.Plugin.EditorCreateLink);
					editor.plug(Y.Plugin.EditorIndent);
					editor.plug(Y.Plugin.EditorInsertList);
					editor.plug(Y.Plugin.EditorForeColor);
					editor.plug(Y.Plugin.EditorBgColor);
					editor.plug(Y.Plugin.EditorImage);
					editor.plug(Y.Plugin.EditorResizer);
					//editor.plug(Y.Plugin.EditorStatus,config.editorStatus || {});
					return editor			 
				}else{
					return {}
				}
			},
			destroy : function(editor){
				Y.EditorWrap.destroy(editor);				
			}
		}
		Y.SimpleEditor = SimpleEditor;
}, '1.0.3' ,{skinnable:false, requires:['k2-editor-wrap','plugin','editor-bidi','k2-editor-font','k2-editor-source','k2-editor-align','k2-editor-indent','k2-editor-image','k2-editor-forecolor','k2-editor-bgcolor','k2-editor-createlink','k2-editor-resizer','k2-editor-insertlist']});
