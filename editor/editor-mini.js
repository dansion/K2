/*
 * @revision:
 */
/*
 * @author:wulong@taobao.com
 * @version:1-0-4
 */
YUI.add('k2-editor-mini', function(Y) {
		var MiniEditor ={
			render : function(id,config){
				editor = Y.EditorWrap.render(id);
				config = config || {}
				if(!Y.Object.isEmpty(editor)){
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
		Y.MiniEditor = MiniEditor;
}, '1.0.3' ,{skinnable:false, requires:['k2-editor-wrap','k2-editor-image','k2-editor-resizer','k2-editor-status']});
