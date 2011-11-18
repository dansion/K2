/*
 * @revision:
 */
/*
 * @author:wulong@taobao.com
 * @version:1-0-2
 */
YUI.add('k2-editor-forecolor', function(Y) {

    var EditorForeColor = function() {
        EditorForeColor.superclass.constructor.apply(this, arguments);
    }, HOST = 'host';

    Y.extend(EditorForeColor, Y.Base, {
			initializer: function() {
				var editor = this.get(HOST);
				this.colorSupport = new Y.ColorSupport({
						editor:editor,
						cmd:'forecolor',
						title:"字体颜色",
						contentCls:"k2-editor-tools-color",
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
        NAME: 'editorForeColor',
        NS: 'forecolor',
        ATTRS: {
            host: {
                value: false
            }
        }
    });


    Y.namespace('Plugin');

    Y.Plugin.EditorForeColor = EditorForeColor;

		Y.mix(Y.Plugin.ExecCommand.COMMANDS, {
			forecolor : function(cmd,val) {
				var inst = this.getInstance(),
						sel = new inst.Selection(), n;

				this._command('styleWithCSS', 'true');
				if (sel.isCollapsed) {
						if (sel.anchorNode && (sel.anchorNode.get('innerHTML') === '&nbsp;')) {
								sel.anchorNode.setStyle('color', val);
								n = sel.anchorNode;
						} else {
								n = this.command('inserthtml', '<span style="color: ' + val + '">' + inst.Selection.CURSOR + '</span>');
								sel.focusCursor(true, true);
						}
						return n;
				} else {
						return this._command(cmd, val);
				}
				this._command('styleWithCSS', false);
			}
    },true);

}, '1.0.1' ,{skinnable:false, requires:['editor-base','k2-editor-colorsupport']});
