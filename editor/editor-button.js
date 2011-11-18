/*
 * @revision:
 */
/*
 * @author:wulong@taobao.com
 * @version:1-0-3
 */
YUI.add('k2-editor-button', function(Y) {
		var UA = Y.UA,
				ON = "on",
				OFF = "off",
				DISABLED = "disabled",
				Node = Y.Node,
				BUTTON_CLASS = "k2-editor-button",
				ON_CLASS = "k2-editor-button-on",
				OFF_CLASS = "k2-editor-button-off",
				DISABLED_CLASS = "k2-editor-button-disabled",
				BUTTON_HTML = "<a unselectable='on' class='" +
						[BUTTON_CLASS,OFF_CLASS].join(" ")
						+ "' href='#'" +
						"" +
						' role="button"' +
						"></a>";
		if (Y.EditorButton) return;


    var EditorButton = function() {
        EditorButton.superclass.constructor.apply(this, arguments);
    }

    EditorButton.ON = ON;
    EditorButton.OFF = OFF;
    EditorButton.DISABLED = DISABLED;

    EditorButton.ON_CLASS = ON_CLASS;
    EditorButton.OFF_CLASS = OFF_CLASS;
    EditorButton.DISABLED_CLASS = DISABLED_CLASS;

    Y.extend(EditorButton, Y.Base, {
				
        initializer: function() {
						var self = this,
                container = self.get("container"),
                elHolder = self.get("el"),
                title = self.get("title"),
                text = self.get("text"),
                contentCls = self.get("contentCls");

            self.el = Node.create(BUTTON_HTML);
            var el = self.el;
            //self._attachCls();
            if (contentCls) {
								text = text ? "<span class='k2-editor-item-text'>" + text + "</span>":""
                el.insert("<span class='k2-editor-item " +
                    contentCls + "' unselectable='on'></span>" + text );
                //el.addHTML("span")._4e_unselectable();
            }
            if (title) el.setAttribute("title", title);
            //替换已有元素
            if (elHolder) {
                elHolder[0].parentNode.replaceChild(el[0], elHolder[0]);
            }
            //加入容器
            else if (container) {
                container.append(self.el);
            }
            el.on("click", self._action, self);
						self.after("stateChange", self._stateChange, self);
						self.set('el',el);
        },
				_action : function(ev){
						var self = this;
						ev.preventDefault();
						self.fire(self.get("state") + "Click", ev);
						self.fire("click",ev);
				},
        _attachCls:function() {
            var cls = this.get("cls");
            if (cls) this.el.addClass(cls);
        },
        _stateChange:function(ev) {
            var n = ev.newVal,self = this;
            self["_" + n]();
            self._attachCls();
        },
        disable:function() {
            var self = this;
            self.set("state", DISABLED);
        },
        enable:function() {
            var self = this;
            if (self.get("state") == DISABLED)
                self.set("state", 'off');
        },
				bon:function() {
            this.set("state", ON);
        },
        boff:function() {
            this.set("state", OFF);
        },
        _on:function() {
            this.el.set('className',[BUTTON_CLASS,ON_CLASS].join(" "));
        },
        _off:function() {
            this.el.set('className',[BUTTON_CLASS,OFF_CLASS].join(" "));
        },
        _disabled:function() {
            this.el.set('className',[BUTTON_CLASS,DISABLED_CLASS].join(" "));
        },
				normalElDom : function(el) {
            return   el[0] || el;
        },
				_unselectable :
                UA.gecko ?
                    function(el) {
                        el = this.normalElDom(el);
                        el.setStyle('MozUserSelect', 'none');
                    }
                    : UA.webkit ?
                    function(el) {
                        el = this.normalElDom(el);
                        el.setStyle('KhtmlUserSelect' , 'none');
                    }
                    :
                    function(el) {
                        el = this.normalElDom(el);
                        if (UA.ie || UA.opera) {
                            var
                                e,
                                i = 0;
                            el.setAttribute('unselectable','on');
														

                        }
                    }
    }, {
        NAME: 'editorButton',
				NS: 'button',
        ATTRS: {
					state: {value:OFF},
					container:{
						value:''
					},
					host : {
						value:false		 
					},
					text:{
						value:''
					},
					contentCls:{
						value:''
					},
					cls:{
						value:''
					},
					el:{
						value:''  
					},
					title:{}
        }
    });

    Y.EditorButton = EditorButton;


}, '1.0.2' ,{skinnable:false, requires:['node','editor-base','event-base']});
