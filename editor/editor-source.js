/*
 * @revision:
 */
/*
 * @author:wulong@taobao.com
 * @version:1-0-0
 */
YUI.add('k2-editor-source', function(Y) {

    var EditorSource = function() {
        EditorSource.superclass.constructor.apply(this, arguments);
    }, HOST = 'host';

    Y.extend(EditorSource, Y.Base, {	
        initializer: function() {
					var Editor = this.get(HOST);						 
					var sourceButton = new Y.EditorButton({
									text:'',
									title:'显示源码',
									contentCls : 'k2-editor-tools-source',	
									container:Editor.get('toolBarDiv')
					});
				
					sourceButton.on('click',function(e){
						Editor.execCommand('showSource',Editor);
					});
			 }
    }, {
        NAME: 'editorSource',
        NS: 'source',
        ATTRS: {
            host: {
                value: false
            }
        }
    });

    Y.namespace('Plugin');

    Y.Plugin.EditorSource = EditorSource;

    Y.mix(Y.Plugin.ExecCommand.COMMANDS, {
			showSource : function(cmd,val){
				var inst = this.getInstance(),
				Frame = this.get('host'),						 
				Editor = val;
				if((Frame.get('node').getStyle('position')).toLowerCase() == 'absolute'){
					Editor.fire('richmode');
					Editor.get('textArea').setStyle('display','none')
					Frame.show();
				}else{
					Editor.get('textArea').set('value',Editor.htmlparser.HTMLtoXML(Editor.getContent()))
					Editor.get('textArea').setStyle('display','')
					Frame.hide();
					Editor.fire('sourcemode');
				}
			}
    });
}, '1.0.1' ,{skinnable:false, requires:['k2-editor-wrap','k2-editor-button']});
