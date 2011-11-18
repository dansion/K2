/*
 * @revision:
 */
/*
 * @author:wulong@taobao.com
 * @version:1-0-1
 */
YUI.add('k2-editor-font', function(Y) {

    var EditorFont = function() {
        EditorFont.superclass.constructor.apply(this, arguments);
    }, HOST = 'host';

    Y.extend(EditorFont, Y.Base, {
				
        initializer: function() {
					var editor = this.get(HOST);	
					new Y.EditorSingleFormat({
						text:'',
						cmd : 'bold',	
						contentCls : 'k2-editor-tools-bold',	
						container:editor.get('toolBarDiv'),
						editor:editor,
						title:'加粗'
					});
					
					new Y.EditorSingleFormat({
						text:'',
						cmd : 'italic',	
						contentCls : 'k2-editor-tools-italic',	
						container:editor.get('toolBarDiv'),
						editor:editor,
						title:'斜体'
					});
					

					new Y.EditorMulitFormat({
						title:'字体',
						width:110,
						popupWidth:110,	
						cmd : 'fontname',	
						container:editor.get('toolBarDiv'),
						editor:editor,
						items:[
								{name:"宋体",value:"SimSun"},
								{name:"黑体",value:"SimHei"},
								{name:"隶书",value:"LiSu"},
								{name:"楷体",value:"KaiTi_GB2312"},
								{name:"微软雅黑",value:"Microsoft YaHei"},
								{name:"Georgia",value:"Georgia"},
								{name:"Times New Roman",value:"Times New Roman"},
								{name:"Impact",value:"Impact"},
								{name:"Courier New",value:"Courier New"},
								{name:"Arial",value:"Arial"},
								{name:"Verdana",value:"Verdana"},
								{name:"Tahoma",value:"Tahoma"}
						]
					});

					new Y.EditorMulitFormat({
						title:'字号',
						width:40,
						popupWidth:56,
						cmd : 'fontsize',	
						container:editor.get('toolBarDiv'),
						editor:editor,
						items:[
								{name:"小",value:"1"},
								{name:"普通",value:"2"},
								{name:"大",value:"5"},
								{name:"极大",value:"7"}
						]
					});


        }
    }, {
        /**
        * The non element placeholder, used for positioning the cursor and filling empty items
        * @property REMOVE
        * @static
        */
        NON: '<span class="yui-non">&nbsp;</span>',
        /**
        * The selector query to get all non elements
        * @property NONSEL
        * @static
        */
        NON_SEL: 'span.yui-non',
        /**
        * The items to removed from a list when a list item is moved, currently removes BR nodes
        * @property REMOVE
        * @static
        */
        REMOVE: 'br',
        /**
        * editorLists
        * @property NAME
        * @static
        */
        NAME: 'editorFont',
        /**
        * lists
        * @property NS
        * @static
        */
        NS: 'font',
        ATTRS: {
            host: {
                value: false
            }
        }
    });


    Y.namespace('Plugin');

    Y.Plugin.EditorFont = EditorFont;

}, '1.0.1' ,{skinnable:false, requires:['editor-base','k2-editor-format']});
