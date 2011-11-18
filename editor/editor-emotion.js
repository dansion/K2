/*
 * @revision:
 */
/*
 * @author:zhengxie.lj@taobao.com
 * @version:1-0-0
 */ 
YUI.add('k2-editor-emotion', function(Y) {

	var Node = Y.Node,
		DOM = Y.DOM;

		
    var EditorEmotion = function(config) {
			EditorEmotion.superclass.constructor.apply(this, arguments);
			this.setAttrs(config);
		},
		HOST='host';
		
    Y.extend(EditorEmotion, Y.Base, {
			
			button: null,
			overlay: null,
			overlayNode: null,

			initializer: function() {
				this._createButton();
			},
			disable : function(){
				this.button.set('state','disabled');
			},
			enable : function(){
				this.button.set('state','off');
			},
			_createButton : function(){
				 var editor = this.get(HOST);
		
				 this.button = new Y.EditorButton({
								title:'插入表情',
								cmd : 'insertImage',
								contentCls: 'k2-editor-tools-emotion',
								container:editor.get('toolBarDiv')
				});
				this.button.on('click', function(e){
					
					
					if(Y.UA.ie){
						var inst = this.get(HOST).getInstance(),
							sel = new inst.Selection(),
							out = sel.getSelected();
						if(out&&out.size()){
							this.selectedRecord = out;
						}else{
							this.selectedRecord = null;
						}
					}

					if(!this.overlay){
						this._createOverlay();
					}
					var el = this.button.el,
						xy = el.getXY();

					xy[1] += el.get("offsetHeight") + 5;
					if (xy[0] + this.overlayNode.getX() > DOM.winWidth() - 60) {
					}
					this.overlay.move(xy);
					this.overlay.show();
				}, this);
			},
			_createOverlay: function(){
				var editor = this.get(HOST),
					 bodyNode = Node.create("<div class='k2-editor-emotion-canvas'></div>"),
					 doc = document,
					 numWidth = this.get('numWidth'),
					 numHeight = this.get('numHeight'),
					 i = 0,
					 j = 0,
					 anchorArray = [],
					 editorDoc=editor.getInstance().config.doc;

				for(;i<numWidth;i++){
					for(j = 0; j < numHeight; j++ ){
						var anchorNode = Node.create("<a></a>");
						anchorArray.push(anchorNode);
						bodyNode.appendChild(anchorNode);
					}
				}
				bodyNode.on('click', function(e){
					var index= Y.Array.indexOf(anchorArray, e.target);
					if(index<0){
						return;
					}
					this._onIconItemClicked(index);
					this.fire("itemClick", {index: index});
				}, this);
				this.overlayNode = Node.create('<div class="k2-editor-emotion-panel"></div>');
				this.overlay = new Y.Overlay({
					srcNode: this.overlayNode,
					zIndex: 999,
					bodyContent: bodyNode
				});
				this.overlay.render();
				Y.on("click", function(e){
					if(e.target.ancestor('.k2-editor-button')==this.button.get('el')) {
						return;
					}
					this.overlay.hide();
				}, [doc, editorDoc], this);
			},
			_onIconItemClicked: function(index){
				var inst = this.get(HOST).getInstance(),
					sel,
					out,
					range,
					iconHtml = '<img src="http://k.kbcdn.com/global/wangwang/emotions/' + index + '.gif">',
					editor = this.get(HOST);
			
				sel = new inst.Selection(); 
				out = sel.getSelected();
				if(this.selectedRecord && this.selectedRecord.size()){
					var firstItem = this.selectedRecord.item(0);
					this.selectedRecord.item(0).setContent(iconHtml);
					for(var i = 1, l = this.selectedRecord.size(); i<l; i++){
						this.selectedRecord.item(i).remove();
					}
					this.selectedRecord = null;
				}else if (!sel.isCollapsed && out.size()) {
					var img = Y.Node.create(iconHtml);
					out.item(0).replace(img);
					if(inst.UA.webkit){
						sel.selectNode(img);
					}
				}else{
					var self = this;
					if(inst.UA.ie || inst.UA.webkit){
						this.get(HOST).focus(function(){
							self.get(HOST).execCommand('inserthtml', iconHtml);
						});
					}else{
						this.get(HOST).execCommand('inserthtml', iconHtml);
					}
				}
				if(!inst.UA.ie){
					this.get(HOST).focus();
				}
			}
			
    }, {
        NAME: 'editorEmotion',
        NS: 'emotion',
        ATTRS: {
            host: {
                value: false
            },
			numWidth:{
				value:11
			},
			numHeight:{
				value:9
			}
        }
    });


    Y.namespace('Plugin');

    Y.Plugin.EditorEmotion = EditorEmotion;

}, '1.0.0' ,{skinnable:false, requires:['node-base', 'node-style', 'editor-base', 'k2-editor-button', 'overlay']});