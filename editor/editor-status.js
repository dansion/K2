/*
 * @revision:
 */
/*
 * @author:wulong@taobao.com
 * @version:1-0-1
 */
YUI.add('k2-editor-status', function(Y) {

		var CLASS_LESS = "k2-editor-status-less-size",
				CLASS_ABOVE = "k2-editor-status-above-size",
				CLASS_CURRENT = "k2-editor-status-current-size",
				CLASS_MIN = "k2-editor-status-min-size",
				CLASS_MAX = "k2-editor-status-max-size"
    var EditorStatus = function() {
        EditorStatus.superclass.constructor.apply(this, arguments);
    }, HOST = 'host';

    Y.extend(EditorStatus, Y.Base, {	
        initializer: function() {
					var Editor = this.get(HOST);
					Editor.get('statusBar').insert('<div class="editor-content-status"></div>',1);
					this.statusNode = Editor.get('statusBar').one('.editor-content-status');
					this.statusNode.set("innerHTML",
						Y.Lang.sub(
							this.get('defaultTemplate'),
							{
								minSize:"<span class='"+CLASS_MIN+"'>" + this.get('minSize') + "</span>",
								maxSize:"<span class='"+CLASS_MAX+"'>" + this.get('maxSize') + "</span>",
								currentSize:"<span class='"+CLASS_CURRENT+"'>" + Editor.htmlparser.getContentTextLength(Editor.getContent()) + "</span>"
							}
						)
					);
					if(Y.UA.ie>7||Y.UA.ie==0){
						Editor.on('nodeChange',function(ev){
							if(ev.changedType == "keyup"){
								var cs = Editor.htmlparser.getContentTextLength(Editor.getContent()),
										mins = this.get('minSize'),
										maxs = this.get('maxSize'),
										ls = mins - cs,
										as = cs - maxs, 
										valObj = {
											minSize:"<span class='"+CLASS_MIN+"'>" + mins + "</span>",
											maxSize:"<span class='"+CLASS_MAX+"'>" + maxs + "</span>",
											currentSize:"<span class='"+CLASS_CURRENT+"'>" + cs + "</span>",
											lessDifferVal :"<span class='"+CLASS_LESS+"'>" + ls + "</span>",
											aboveDifferVal :"<span class='"+CLASS_ABOVE+"'>" + as + "</span>"
										};
								if(ls>0){
									this.showNotice('lessTemplate',valObj);
								}else if(as>0){
									this.showNotice('aboveTemplate',valObj);
								}else{
									this.showNotice('noticeTemplate',valObj);
								}
							}
						},this);
					}
				},
				showNotice : function(type,valObj){
					var Editor = this.get(HOST);
					var cs = Editor.htmlparser.getContentTextLength(Editor.getContent()),
							mins = this.get('minSize'),
							maxs = this.get('maxSize'),
							ls = mins - cs,
							as = cs - maxs;
					var obj = valObj || {
							minSize:"<span class='"+CLASS_MIN+"'>" + mins + "</span>",
							maxSize:"<span class='"+CLASS_MAX+"'>" + maxs + "</span>",
							currentSize:"<span class='"+CLASS_CURRENT+"'>" + cs + "</span>",
							lessDifferVal :"<span class='"+CLASS_LESS+"'>" + ls + "</span>",
							aboveDifferVal :"<span class='"+CLASS_ABOVE+"'>" + as + "</span>"
					}
					this.statusNode.set("innerHTML",
						Y.Lang.sub(
							this.get(type),obj
						)
					);
				}
    },{
        NAME: 'editorStatus',
        NS: 'status',
        ATTRS: {
            host: {
                value: false
            },
						minSize : {
								value : 20			
						},
						maxSize : {
								value: 50000				
						},
						defaultTemplate : {
							  value:"请至少输入{minSize}字,最多不超过{maxSize}字"
						},
						errorTemplate:{
							 value : "出错了"						
						},
						lessTemplate:{
							 value:"请至少输入{minSize}字,当前{currentSize}字,还差{lessDifferVal}字"				 
						},
						aboveTemplate :{
							value : "最多输入{maxSize}字,当前{currentSize}字,多出{aboveDifferVal}字"						
						},
						noticeTemplate:{
							 value: "当前已经输入{currentSize}字"						 
						},
						customTemplate:{
							 value:"自定义模板{customVal}"						 
						}
						
        }
    });

    Y.namespace('Plugin');

    Y.Plugin.EditorStatus = EditorStatus;

}, '1.0.1' ,{skinnable:false, requires:['editor-base']});
