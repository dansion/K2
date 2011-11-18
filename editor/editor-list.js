/*
 * @revision:
 */
/*
 * @author:wulong@taobao.com
 * @version:1-0-2
 */
YUI.add('k2-editor-insertlist', function(Y) {

    var EditorInsertList = function() {
        EditorInsertList.superclass.constructor.apply(this, arguments);
    }, HOST = 'host';

    Y.extend(EditorInsertList, Y.Base, {
        initializer: function() {
					var Editor = this.get(HOST);						 
					Editor.plug(Y.Plugin.EditorLists);
					this.orderListButton = new Y.EditorButton({
									text:'',
									title:'有序列表',
									contentCls : 'k2-editor-tools-ol',	
									container:Editor.get('toolBarDiv')
					});

					this.orderListButton.on('click',function(e){
						Editor.execCommand('insertorderedlist');
					},this);
					this.unorderListButton = new Y.EditorButton({
									text:'',
									title:'无序列表',
									contentCls : 'k2-editor-tools-ul',	
									container:Editor.get('toolBarDiv')
					});

					this.unorderListButton.on('click',function(e){
						Editor.execCommand('insertunorderedlist');
					});
					Y.EditorWrap.disablePlugin(Editor,this);
			 },
			disable : function(){
				this.orderListButton.set('state','disabled');
				this.unorderListButton.set('state','disabled');
			},
			enable : function(){
				this.orderListButton.set('state','off');
				this.unorderListButton.set('state','off');
			}
    }, {
        NAME: 'editorInsertList',
        NS: 'insertlist',
        ATTRS: {
            host: {
                value: false
            }
        }
    });

    Y.namespace('Plugin');

    Y.Plugin.EditorInsertList = EditorInsertList;

    Y.mix(Y.Plugin.ExecCommand.COMMANDS, {

    });
}, '1.0.1' ,{skinnable:false, requires:['editor-base','k2-editor-button','editor-lists']});
