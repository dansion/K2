/*
 * @revision:
 */
/*
 * @author:wulong@taobao.com
 * @version:1-0-0
 */

YUI.add('editor-styles', function(Y) {

    var EditorStyle = function() {
        EditorStyle.superclass.constructor.apply(this, arguments);
    }, HOST = 'host';

    Y.extend(EditorStyle, Y.Base, {
				_swap: function(n, tag) {
            var tmp = Y.Node.create('<' + tag + '></' + tag + '>');
            tmp.set('innerHTML', n.get('innerHTML'));
            n.replace(tmp, n);
            return Y.Node.getDOMNode(tmp);
        },
				
				applyStyle : function(){

					Y.log('apply styles to element','info','editor-style');

					inst = this.get(HOST).getInstance();
					selection = new inst.Selection(); 	
					var selNodes = selection.getSelected();
					selNodes.each(function(i){
						Y.log(i);
						i.setStyle('font-size','16px');
						this._swap(i,'span');
					},this)
					//var selWrap = selection.wrapContent('b');
					/*
					Y.log(selNodes);
					selNodes.each(function(i){
						/Y.log(i);
					})
					Y.log(selNodes);
					selWrap.each(function(i){
						if(i.get('parentNode').get('nodeName').toLowerCase() =='b'){
							Y.log(i);
						}
					
					})
					*/
				},	
        initializer: function() {
					Y.log('initializer','info','editor-style')						 
				}
    }, {
        NAME: 'editorStyle',
        NS: 'style',
        ATTRS: {
            host: {
                value: false
            }
        }
    });

    Y.namespace('Plugin');

    Y.Plugin.EditorStyle = EditorStyle;

}, '1.0.0' ,{skinnable:false, requires:['editor-base','editor-button','createlink-base']});
