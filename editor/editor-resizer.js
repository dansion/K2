/*
 * @revision:
 */
/*
 * @author:wulong@taobao.com
 * @version:1-0-2
 */
YUI.add('k2-editor-resizer', function(Y) {

    var EditorResizer = function() {
        EditorResizer.superclass.constructor.apply(this, arguments);
    }, HOST = 'host';

    Y.extend(EditorResizer, Y.Base, {
				
        initializer: function() {
					var Editor = this.get(HOST),
					sb = Editor.get('statusBar'),
					markup = "<div class='k2-resizer'></div>",resizer;
					resizer = Y.Node.create(markup),
					wrap = Editor.get('wrap');
					sb.append(resizer);
					
					var dd = new Y.DD.Drag({
								node: resizer,
								clickPixelThresh: 0,
								clickTimeThresh: 0,
								move: false
							}),
						 	oHeight,oWidth,
							editorWrap = Y.one('#k2-editor-'+Editor.get('editorId')),
							textArea = Editor.get('textArea');
					dd.plug(Y.Plugin.DDConstrained,{constrain:{top:editorWrap.getY()+21,left:wrap.getX()+wrap.get('offsetWidth')-12}})			

					dd.on('start',function(ev){
						oHeight = editorWrap.get('offsetHeight'); 
						oWidth = wrap.get('offsetWidth')-2; 
					})
					dd.on('drag',function(ev){
						var mY = this.startXY[1]-(this.deltaXY[1]>1?this.deltaXY[1]:0),
								mX = this.startXY[0]-(this.deltaXY[0]>1?this.deltaXY[0]:0),
								nY = this.actXY[1],
								nX = this.actXY[0],
								diffY = nY - mY ,
								diffX = nX - mX ;
						editorWrap.setStyle('height',oHeight+diffY+'px');
						wrap.setStyle('width',oWidth+diffX+'px');
						textArea.setStyles({
							"height":oHeight+diffY+'px',
							"width":oWidth+diffX+'px'
						});
					});
				}
    }, {
        NAME: 'editorResizer',
        NS: 'resizer',
        ATTRS: {
            host: {
                value: false
            }
        }
    });

    Y.namespace('Plugin');

    Y.Plugin.EditorResizer = EditorResizer;

}, '1.0.1' ,{skinnable:false, requires:['base-base','dd-ddm-base','dd-constrain']});
