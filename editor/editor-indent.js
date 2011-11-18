/*
 * @revision:
 */
/*
 * @author:wulong@taobao.com
 * @version:1-0-0
 */
YUI.add('k2-editor-indent', function(Y) {

    var EditorIndent = function() {
        EditorIndent.superclass.constructor.apply(this, arguments);
    }, HOST = 'host';

    Y.extend(EditorIndent, Y.Base, {	
        initializer: function() {
					var Editor = this.get(HOST);						 
					this.outdent = new Y.EditorButton({
									text:'',
									title:'',
									contentCls : 'k2-editor-tools-outdent',	
									container:Editor.get('toolBarDiv')
					});
					this.indent = new Y.EditorButton({
									text:'',
									title:'',
									contentCls : 'k2-editor-tools-indent',	
									container:Editor.get('toolBarDiv')
					});
					this.outdent.on('click',function(e){
						Editor.execCommand('outdent');
					});

					this.indent.on('click',function(e){
						Editor.execCommand('indent');
					});
					Y.EditorWrap.disablePlugin(Editor,this);

			 },
			 disable : function(){
					this.outdent.set('state','disabled');
					this.indent.set('state','disabled');
			 },
	 		 enable : function(){
					this.outdent.set('state','off');
					this.indent.set('state','off');
			 }	
    },{
		/**
		  *@enum {string}
		  */
        NAME: 'editorIndent',
        NS: 'indent',
        ATTRS: {
            host: {
                value: false
            }
        }
    });

    Y.namespace('Plugin');

    Y.Plugin.EditorIndent = EditorIndent;

    Y.mix(Y.Plugin.ExecCommand.COMMANDS, {
				
    });
}, '1.0.0' ,{skinnable:false, requires:['editor-base','k2-editor-button']});
