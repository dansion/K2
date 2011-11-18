/*
 * @revision:
 */
/*
 * @author:wulong@taobao.com
 * @version:1-0-0
 */
YUI.add('k2-editor-align', function(Y) {
    var EditorAlign = function() {
        EditorAlign.superclass.constructor.apply(this, arguments);
    }, HOST = 'host';

    Y.extend(EditorAlign, Y.Base, {	
        initializer: function() {
					var Editor = this.get(HOST),
							leftButton,centerButton,rightButton,self = this;						 
					leftButton = new Y.EditorButton({
									text:'',
									title:'居左',
									contentCls : 'k2-editor-tools-alignleft',	
									container:Editor.get('toolBarDiv')
					});
					centerButton = new Y.EditorButton({
									text:'',
									title:'居中',
									contentCls : 'k2-editor-tools-aligncenter',	
									container:Editor.get('toolBarDiv')
					});
					rightButton = new Y.EditorButton({
									text:'',
									title:'居右',
									contentCls : 'k2-editor-tools-alignright',	
									container:Editor.get('toolBarDiv')
					});
					leftButton.on('click',function(e){
						Editor.execCommand('align','left');
					});
					centerButton.on('click',function(e){
						Editor.execCommand('align','center');
					});
					rightButton.on('click',function(e){
						Editor.execCommand('align','right');
					});
					self.leftButton = leftButton;
					self.centerButton = centerButton;
					self.rightButton = rightButton;
					Y.EditorWrap.disablePlugin(Editor,this);
			 },
			 disable : function(){
					this.leftButton.set('state','disabled');
					this.centerButton.set('state','disabled');
					this.rightButton.set('state','disabled');
			 },
	 		 enable : function(){
					this.leftButton.set('state','off');
					this.centerButton.set('state','off');
					this.rightButton.set('state','off');
			 }			 
    }, {
        NAME: 'editorAlign',
        NS: 'align',
        ATTRS: {
            host: {
                value: false
            }
        }
    });
    Y.namespace('Plugin');

    Y.Plugin.EditorAlign = EditorAlign;

    Y.mix(Y.Plugin.ExecCommand.COMMANDS, {
				align : function(cmd,value) {
					var inst = this.getInstance(),
							sel = new inst.Selection();
					var pNode =  sel.anchorNode.ancestor("p",true);
					pNode.setStyle('textAlign',value);
					if (sel.isCollapsed) {
						sel.selectNode(sel.anchorNode,true);
					}
					this.get('host').focus();
							
			}
    },true);
}, '1.0.1' ,{skinnable:false, requires:['editor-base','k2-editor-button']});
