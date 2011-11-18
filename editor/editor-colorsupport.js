/*
 * @revision:
 */
/*
 * @author:wulong@taobao.com
 * @version:1-0-1
 */
YUI.add("k2-editor-colorsupport", function(Y) {
    var Node = Y.Node,
        Event = Y.Event,
        Overlay = Y.Overlay,
        EditorButton = Y.EditorButton,
        DOM = Y.DOM;

    if (Y.ColorSupport) return;

    function padding2(str) {
        return ("0" + str).slice(str.length - 1, str.length + 1);
    }

    var rgbColorReg = /^rgb\((\d+),(\d+),(\d+)\)$/i;

    function normalColor(color) {
        color = Y.Lang.trim(color);
        if (color.charAt(0) == "#") color = color.substring(1);
        //console.log(color);
        color = color.replace(/\s+/g, "");
        var str = "",simpleColorReg = /^[0-9a-f]{3,3}$/i;

        if (simpleColorReg.test(color)) {
            str = color.replace(/[0-9a-f]/ig, function(m) {
                return m + m;
            });
        } else {
            var m = color.match(rgbColorReg);
            if (m && m[0]) {
                for (var i = 1; i < 4; i++) {
                    str += padding2(parseInt(m[i]).toString(16));
                }
            } else {
                str = color;
            }
        }
        return "#" + str.toLowerCase();
    }

    var colorButton_colors =
        ('000,800000,8B4513,2F4F4F,008080,000080,4B0082,696969,' +
            'B22222,A52A2A,DAA520,006400,40E0D0,0000CD,800080,808080,' +
            'F00,FF8C00,FFD700,008000,0FF,00F,EE82EE,A9A9A9,' +
            'FFA07A,FFA500,FFFF00,00FF00,AFEEEE,ADD8E6,DDA0DD,D3D3D3,' +
            'FFF0F5,FAEBD7,FFFFE0,F0FFF0,F0FFFF,F0F8FF,E6E6FA,FFF').split(/,/),
        VALID_COLORS = [],
        html = "<div>" +
            "<a class='k2-color-remove' " +
            "href=\"javascript:void('清除');\">" +
            "<span>清除</span>" +
            "</a>" +
            "<table>";
    for (var i = 0; i < 5; i++) {
        html += "<tr>";
        for (var j = 0; j < 8; j++) {
            var currentColor = normalColor(colorButton_colors[8 * i + j]);
            html += "<td>";
            html += "<a href='javascript:void(0);' " +
                "class='k2-color-a'" +
                "><span style='background-color:"
                + currentColor
                + "'></span></a>";
            html += "</td>";
            VALID_COLORS.push(currentColor);
        }
        html += "</tr>";
    }

    html += "</table></div>";


    function ColorSupport() {
        ColorSupport.superclass.constructor.apply(this, arguments);
    }


    Y.extend(ColorSupport, Y.Base, {
        initializer:function() {
            var self = this,
                editor = self.get("editor"),
                el = new EditorButton({
                    container:self.get('container'),
                    title:self.get("title"),
                    contentCls:self.get("contentCls")
                });

            el.on("offClick", self._showColors, self);
            self.el = el;
            this.lazyRun(self, "_prepare", "_real");
        },
				lazyRun:function(obj, before, after) {
            var b = obj[before],a = obj[after];
            obj[before] = function() {
                b.apply(this, arguments);
                obj[before] = obj[after];
                return a.apply(this, arguments);
            };
        },
        disable:function() {
            this.el.disable();
        },
        enable:function() {
            this.el.enable();
        },
        _hidePanel:function(ev) {
            var self = this,
                colorWin = self.colorWin;
            if (!colorWin.get("visible")) return;
            //多窗口管理
						/*
            if (DOM._4e_ascendant(ev.target, function(node) {
                return node._4e_equals(self.el.el);
            }, true))return;
						*/
            colorWin.hide();
        },
        _selectColor:function(ev) {
            ev.halt();
            var self = this,
                editor = self.get("editor"),
								cmd = self.get('cmd'),
                t = ev.target,
								colorValue;
            if (t.get('nodeName').toLowerCase() == "span" || t.get('nodeName').toLowerCase() == "a") {
                if (t.get('nodeName').toLowerCase()  == "a")
                    t = t.one("span");

                if (t.getStyle("backgroundColor") != 'transparent') {
										editor.execCommand(cmd,normalColor(t.getStyle("backgroundColor")))
                }
                else {
										/*
										var selection = new editor.getInstance().Selection();
										if(selection.anchorNode.test('p')){
											selection.anchorNode.getStyle('backgroundColor')
										}
										*/
										if(cmd == 'backcolor'){
											colorValue = '#ffffff';
										}else{
											colorValue = '#000000';
										}
										editor.execCommand(cmd,colorValue);
                }
                self.colorWin.hide();
            }
        },
        _prepare:function() {
            var self = this,
                doc = document,
                overlayWrap = Y.Node.create('<div class="k2-color-panel"></div>');
								editor = self.get("editor"),
                colorPanel = Y.Node.create(html),
								editorDoc=editor.getInstance().config.doc;
								
            self.colorWin = new Y.Overlay({
                srcNode:overlayWrap,
                width:"130px",
                zIndex:990,
								bodyContent:colorPanel
            });
            //colorPanel._4e_unselectable();
						self.colorWin.render();		
            colorPanel.on("click", self._selectColor, self);
            self.colorPanel = colorPanel;
            Y.on("click", function(ev){
							if(ev.target.ancestor('.k2-editor-button')==this.el.get('el')) return
							this._hidePanel();
						},[doc,editorDoc],self);

        },
        _real:function() {
            var self = this,
                el = self.el.el,
                colorPanel = self.colorPanel,
                xy = el.getXY();
            xy[1] += el.get("offsetHeight") + 5;
            if (xy[0] + colorPanel.getX() > DOM.winWidth() - 60) {
                //xy[0] =DOM.winWidth()  - colorPanel.getX() - 60;
            }
            self.colorWin.move(xy);
						self.colorWin.show();
        },
        _showColors:function(ev) {
            var self = this;
            self._prepare(ev);
        }
		},{
				NAME: 'colorSupport',
        NS: 'colorsupport',
        ATTRS: {
					editor:{},
					contentCls:{},
					container:{},
					title:{},
					cmd:{}
				}
    });
    
		
		Y.ColorSupport = ColorSupport;


}, '1.0.1' ,{skinnable:false, requires:['editor-base','k2-editor-button','overlay']});

