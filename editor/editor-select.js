/*
 * @revision:
 */
/*
 * @author:wulong@taobao.com
 * @version:1-0-3
 */
YUI.add('k2-editor-select', function(Y) {
    var UA = Y.UA,
        Node = Y.Node,
        Event = Y.Event,
        DOM = Y.DOM,
        Editor = Y.Editor,
        TITLE = "title",
        ke_select_active = "k2-select-active",
        ke_menu_selected = "k2-menu-selected",
        markup = "<span class='k2-select-wrap' unselectable='on'>" +
            "<a onclick='return false;' class='k2-select' unselectable='on'>" +
            "<span class='k2-select-text' unselectable='on'><span unselectable='on' class='k2-select-text-inner'></span></span>" +
            "<span class='k2-select-drop-wrap' unselectable='on'>" +
            "<span class='k2-select-drop' unselectable='on'></span>" +
            "</span>" +
            "</a></span>",
        menu_markup = "<div onmousedown='return false;'>" +
            "</div>";


    

		if (Y.EditorSelect) return;
    



    var EditorSelect = function() {
        EditorSelect.superclass.constructor.apply(this, arguments);
    }
	  var DISABLED_CLASS = "k2-select-disabled",
        ENABLED = 'enabled',
        DISABLED = 'disabled';
    EditorSelect.DISABLED = DISABLED;
    EditorSelect.ENABLED = ENABLED;
    //var dtd = KE.XHTML_DTD;
		
    EditorSelect.decorate = function(el) {
        var width = el.width() ,
            items = [],
            options = el.all("option");
        for (var i = 0; i < options.length; i++) {
            var opt = options[i];
            items.push({
                name:DOM.html(opt),
                value:DOM.attr(opt, "value")
            });
        }
        return new Select({
            width:width + "px",
            el:el,
            items:items,
            cls:"k2-combox",
            value:el.val()
        });

    };
		

    Y.extend(EditorSelect, Y.Base, {
				
        initializer: function() {
            var self = this,
                container = self.get("container"),
                fakeEl = self.get("el"),
                el = Y.Node.create(markup),
                title = self.get(TITLE) || "",
                cls = self.get("cls"),
                text = el.one(".k2-select-text"),
                innerText = el.one(".k2-select-text-inner"),
                drop = el.one(".k2-select-drop");

            if (self.get("value") !== undefined) {
                innerText.insert(self._findNameByV(self.get("value")),0);
            } else {
                innerText.insert(title,0);
            }

            text.setStyle("width", self.get("width"));
            //ie6,7 不失去焦点
            this._unselectable(el);
            if (title)el.setAttribute(TITLE, title);
            if (cls) {
                el.addClass(cls);
            }
            if (fakeEl) {
                fakeEl[0].parentNode.replaceChild(el[0], fakeEl[0]);
            } else if (container) {
                container.append(el);
            }
            el.on("click", self._click, self);
            self.el = el;
            self.title = innerText;
            self._focusA = el.one("a.k2-select");
            this.lazyRun(this, "_prepare", "_real");
						//Y.Do.after(this._prepare,this,_real);
            self.after("valueChange", self._valueChange, self);
						self.after('stateChange',self._stateChange,self);
        },
				lazyRun:function(obj, before, after) {
            var b = obj[before],a = obj[after];
            obj[before] = function() {
                b.apply(this, arguments);
                obj[before] = obj[after];
                return a.apply(this, arguments);
            };
        },
        _findNameByV:function(v) {
            var self = this,
                name = self.get(TITLE) || "",
                items = self.get("items");
            //显示值，防止下拉描述过多
            if (self.get("showValue")) {
                return v || name;
						}
            for (var i = 0; i < items.length; i++) {
                var item = items[i];
                if (item.value == v) {
                    name = item.name;
                    break;
                }
            }
            return name;
        },

        /**
         * 当逻辑值变化时，更新select的显示值
         * @param ev
         */
        _valueChange:function(ev) {
            var v = ev.newVal,
                self = this,
                name = self._findNameByV(v);
            self.title.set('innerHTML',name);
        },

        _itemsChange:function(ev) {
            var self = this,items = ev.newVal,
                _selectList = self._selectList;
            _selectList.insert("");
            if (items) {
                for (var i = 0; i < items.length; i++) {
                    var item = items[i],a =_selectList.append("<a " +
                        "class='k2-select-menu-item' " +
                        "href='#' data-value='" + item.value + "'>"
                        + item.name + "</a>", item.attrs)
                        this._unselectable(a);
                }
            }
            self.as = _selectList.all("a");
        },
        val:function(v) {unselectable
            var self = this;
            if (v !== undefined) {
                self.set("value", v);
                return self;
            }
            else return self.get("value");
        },
        _resize:function() {
            var self = this,
                menu = self.menu;
            if (menu.get("visible")) {
                self._real();
            }
        },
        _prepare:function() {
            var self = this,
                el = self.el,
                popUpWidth = self.get("popupWidth"),
                focusA = self._focusA,
                menuNode = Y.Node.create(menu_markup);
								menuNode.setAttribute('class','k2-menu'),
								editorDoc=this.get('host').getInstance().config.doc;
            //要在适当位置插入 !!!
						Y.one('body').insert(menuNode,0);
            var menu = new Y.Overlay({
                zIndex:990,
								srcNode : menuNode,
								visible:false,
								width:popUpWidth+'px'
            }),
						items = self.get("items");
						menu.render();
						menu.show();
            self.menu = menu;
            //缩放，下拉框跟随
            Y.on("resize", self._resize,window, self);

            self._selectList = menuNode.append("<div></div>");

            self._itemsChange({newVal:items});


            menu.on("show", function() {
                focusA.addClass(ke_select_active);
            });
            menu.on("hide", function() {
                focusA.removeClass(ke_select_active);
            });
            Y.on("click",function(ev){
							if(ev.target.ancestor('.k2-select')==this.el.one('.k2-select')) return 
							menu.hide()
						},[document,editorDoc],self);
            menuNode.on("click", self._select, self);
            self.as = self._selectList.all("a");

            Y.on('mouseenter', function() {
                self.as.removeClass(ke_menu_selected);
            },menuNode);

            self.on("afterItemsChange", self._itemsChange, self);
        },
        _stateChange:function(ev) {
						Y.log(ev)					 
            var v = ev.newVal,el = this.el;
            if (v == ENABLED) {
                el.removeClass(DISABLED_CLASS);
            } else {
                el.addClass(DISABLED_CLASS);
            }
        },
        enable:function() {
            this.set("state", ENABLED);
        },
        disable:function() {
            this.set("state", DISABLED);
        },
        _select:function(ev) {
            ev.preventDefault();
            var self = this,
                menu = self.menu,
                menuNode = menu.el,
                t = ev.target;

            var preVal = self.get("value"),newVal = t.getAttribute("data-value");
            //更新逻辑值
            self.set("value", newVal);

            //触发 click 事件，必要时可监听 afterValueChange
            self.fire("afterValueChange", {
                newVal:newVal,
                prevVal:preVal,
                name:t.get('innerHTML')
            });

            menu.hide();
        },
        _real:function() {
            var self = this,
                el = self.el,
                xy = el.getXY(),
                orixy = Y.clone(xy),
								menuEl = self.menu.get('srcNode');
                menuHeight = menuEl.get('offsetHeight'),
                menuWidth = menuEl.get('offsetWidth'),
                wt = DOM.docScrollY(),
                wl = DOM.docScrollX(),
                wh = DOM.winHeight() ,
                ww = DOM.winWidth(),
                //右边界坐标,60 is buffer
                wr = wl + ww - 60,
                //下边界坐标
                wb = wt + wh,
                //下拉框向下弹出的y坐标
                sb = xy[1] + (el.get('offsetHeight') - 2),
                //下拉框右对齐的最右边x坐标
                sr = xy[0] + el.get('offsetWidth') - 2,
                align = self.get("align"),
                xAlign = align[0],
                yAlign = align[1];

						
            if (yAlign == "b") {
                //向下弹出优先
                xy[1] = sb;
                if (
                    (
                        //不能显示完全
                        (xy[1] + menuHeight) > wb
                        )
                        &&
                        (   //向上弹能显示更多
                            (orixy[1] - wt) > (wb - sb)
                            )
                    ) {
                    xy[1] = orixy[1] - menuHeight;
                }
            } else {
                //向上弹出优先
                xy[1] = orixy[1] - menuHeight;

                if (
                //不能显示完全
                    xy[1] < wt
                        &&
                        //向下弹能显示更多
                        (orixy[1] - wt) < (wb - sb)
                    ) {
                    xy[1] = sb;
                }
            }

            if (xAlign == "l") {
                //左对其优先
                if (
                //左对齐不行
                    (xy[0] + menuWidth > wr)
                        &&
                        //右对齐可以弹出更多
                        (
                            (sr - wl) > (wr - orixy[0])
                            )

                    ) {
                    xy[0] = sr - menuWidth;
                }
            } else {
                //右对齐优先
                xy[0] = sr - menuWidth;
                if (
                //右对齐不行
                    xy[0] < wl
                        &&
                        //左对齐可以弹出更多
                        (sr - wl) < (wr - orixy[0])
                    ) {
                    xy[0] = orixy[0];
                }
            }
            self.menu.move(xy);
            self.menu.show();
        },
        _click:function(ev) {
            ev.preventDefault();

            var self = this,
                el = self.el,
                v = self.get("value");

            if (el.hasClass(DISABLED_CLASS)) {
                return;
            }

            if (self._focusA.hasClass(ke_select_active)) {
                self.menu.hide();
                return;
            }

            self._prepare();

            //可能的话当显示层时，高亮当前值对应option
            if (v && self.menu) {
                var as = self.as;
                as.each(function(a) {
                    if (a.getAttribute("data-value") == v) {
                        a.addClass(ke_menu_selected);
                    } else {
                        a.removeClass(ke_menu_selected);
                    }
                });
            }
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
        NAME: 'editorSelect',
        /**
        * lists
        * @property NS
        * @statiSelect',
				*/
        ATTRS: {
					//title标题栏显示值value还是name
					//默认false，显示name
					showValue:{
						value: false					
					},
					el:{},
					cls:{},
					container:{},
					doc:{},
					value:{},
					width:{},
					title:{},
					items:{},
					popupWidth:{},
					//下拉框优先和select左左对齐，上下对齐
					//可以改作右右对齐，下上对齐
					align:{value:["l","b"]},
					menuContainer:{
							valueFn:function() {
												/*
									//chrome 需要添加在能够真正包含div的地方
									Y.log(el);	
									var c = this.el.ancestor();
									while (c) {
											var n = c._4e_name();
											if (dtd[n] && dtd[n]["div"])
													return c;
											c = c.parent();
									}
									return new Node(document.body);
							*/
							}
					},
					state:{value:ENABLED},
					host:{}

        }
    });


    Y.EditorSelect = EditorSelect;




}, '1.0.2' ,{skinnable:false, requires:['editor-base','overlay']});
