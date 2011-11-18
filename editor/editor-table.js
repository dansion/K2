/*
 * @revision:
 */
/*
 * @author:wulong@taobao.com
 * @version:1-0-0
 */
YUI.add('editor-table', function(Y) {
    //行数
    var R_CLASS     = 'k2-e-t-rows';
    //宽度
    var W_CLASS     = 'k2-e-t-width';
    //宽度单位
    var W_U_CLASS   = 'k2-e-t-width-unit';
    //列数
    var C_CLASS     = 'k2-e-t-cols';
    //高度
    var H_CLASS     = 'k2-e-t-height';
    //对齐
    var A_CLASS     = 'k2-e-t-align';
    //标题
    var T_CLASS     = 'k2-e-t-title';
    //边框
    var B_CLASS     = 'k2-e-t-border';
    //标题格
    var CA_CLASS    = 'k2-e-t-caption';

    var EditorTable = function() {
        EditorTable.superclass.constructor.apply(this, arguments);
    }, HOST = 'host';

    Y.extend(EditorTable, Y.Base, {
      initializer: function() {
        var Editor = this.get(HOST);

        var tableButton = new Y.EditorButton({
                text:'',
                title:'插入表格',
                contentCls : 'k2-editor-tools-table',
                container:Editor.get('toolBarDiv')
        });
        
        var popup = Y.createPop({
          sTitle:'表格',
          vContent:'<div><table class="k2-editor-popup-table">' + 
            '<tr>' + 
                '<td>' + 
                  '<label>行数：</label><input size="6" value="2" class="txt" ' + 'data-verify="^(?!0$)\\d+$" ' + 'data-warning="行数请输入正整数"' + '/>' + 
                '</td>' + 
                '<td>' + 
                  '<label>宽&nbsp;&nbsp;&nbsp;度：</label><input size="6" value="2" class="txt" ' + 'data-verify="^(?!0$)\\d+$" ' + 'data-warning="宽度请输入正整数"' + ' />' + 
                  '<select style="vertical-align:middle;margin:0 0 0 3px;"><option value="px">像素</option><option value="%">百分比</option></select>' + 
                '</td>' + 
            '</tr>' + 
            '<tr>' + 
                '<td>' + 
                  '<label>列数：</label><input size="6" value="3" class="txt" ' + 'data-verify="^(?!0$)\\d+$" ' + 'data-warning="列数请输入正整数"' + '/>' + 
                '</td>' + 
                '<td>' + 
                  '<label>高&nbsp;&nbsp;&nbsp;度：</label><input size="6" value="2" class="txt" ' + 'data-verify="^(?!0$)\\d+$" ' + 'data-warning="高度请输入正整数"' + ' />&nbsp;&nbsp;像素' + 
                '</td>' + 
            '</tr>' + 
            '<tr>' + 
                '<td>' + 
                  '<label>对齐：</label><select style="vertical-align:middle;"><option value="">无</option><option value="left">左对齐</option><option value="right">右对齐</option><option value="center">中间对齐</option></select>' + 
                 '</td>' + 
                '<td><label>标题格：</label><select style="vertical-align:middle;"><option value="0">无</option><option value="1">有</option></select></td>' + 
            '</tr>' + 
            '<tr>' + 
                '<td colspan="2">' + 
                  '<label>边框：</label><input size="6" value="1" class="txt" ' + 'data-verify="^\\d+$" ' + 'data-warning="边框请输入非负整数"' + ' />&nbsp;&nbsp;像素' + 
                '</td>' + 
            '</tr>' + 
            '<tr>' + 
                '<td colspan="2"><label>标题：</label><input size="6" value="" class="txt" style="width:280px;"/></td>' + 
            '</tr>' + 
            '</table></div>',
          iWidth:'430',
          iHeight:'270',
          //不为共享模式
          share:false,
          bShowAfterInit:false,
          btnAlign:'left',
          sOk:'确定',
          sCancel:'取消'
        });
        this.popup = popup;

        popup.on('popup:ok',function(e){
          var popup = this.popup;

        },this);
        
        tableButton.on('click',function(e){
          this.popup.show();
          //Editor.execCommand('insertorderedlist');
        },this);
     },
     //创建table的过程
     _createTable:function(){
        var html = "<table ",
            cellpad = Y.UA.ie ? "" : "<br/>";
        
        
        html += "</tbody>";
        html += "</table>";
        var tableDom = Y.create('');
        return tableDom;
     }
    },{
        NAME: 'editorTable',
        NS: 'inserttable',
        ATTRS: {
            host: {
                value: false
            }
        }
    });

    Y.namespace('Plugin');

    Y.Plugin.EditorTable = EditorTable;

    Y.mix(Y.Plugin.ExecCommand.COMMANDS, {

    });
}, '1.0.0' ,{skinnable:false, requires:['editor-base','editor-button']});
