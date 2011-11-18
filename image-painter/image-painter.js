/*
 * @author:zhengxie.lj@taobao.com
 * @version:1-0-0
 */
YUI.add('k2-image-painter', function(Y){
	
	var win = window,
		 doc = document,
		 create,
		 Element,
		 theImage,
		 isnan = {"NaN": 1, "Infinity": 1, "-Infinity": 1},

		/**
		 * check if an object is a specific data type
		 */
		is = function (o, type) {
			type = String.prototype.toString.call(type);
			if (type == "finite") {
				return !isnan.hasOwnProperty(+o);
			}
			return  (type == "null" && o === null) ||
					(type == typeof o) ||
					(type == "object" && o === Object(o)) ||
					(type == "array" && Array.isArray && Array.isArray(o)) ||
					Object.prototype.toString.call(o).slice(8, -1).toLowerCase() == type;
		},

		Paper = function(){},
		/**
		 * return a container has x,y,w,h or w,h
		 */
		getContainer = function (x, y, w, h) {
            var container;
            if (is(x, 'string') || is(x, "object")) {
                container = is(x, 'string') ? doc.getElementById(x) : x;
                if (container.tagName) {
                    if (y == null) {
                        return {
                            container: container,
                            width: container.style.pixelWidth || container.offsetWidth,
                            height: container.style.pixelHeight || container.offsetHeight
                        };
                    } else {
                        return {container: container, width: y, height: w};
                    }
                }
            } else {
                return {container: 1, x: x, y: y, width: w, height: h};
            }
         },
		 /**
		  * merge a object's functions & properties to another object
		  */
		 merge = function (con, add) {
            var that = this;
            for (var prop in add) {
                if (add.hasOwnProperty(prop) && !(prop in con)) {
                    switch (typeof add[prop]) {
                        case "function":
                            (function (f) {
                                con[prop] = con === that ? f : function () { return f.apply(that, arguments); };
                            })(add[prop]);
                        break;
                        case "object":
                            con[prop] = con[prop] || {};
                            merge.call(this, con[prop], add[prop]);
                        break;
                        default:
                            con[prop] = add[prop];
                        break;
                    }
                }
            }
        },
		 ImagePainter = function(){
			return create.apply(ImagePainter, arguments);
		 },
		 IP = ImagePainter,
	     IPP = IP.prototype;
		
	IP.type = (window.SVGAngle || document.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#BasicStructure", "1.1") ? "SVG" : "VML");
	
	 if (IP.type == "VML") {
        var d = doc.createElement("div"),
            b;
        d.innerHTML = '<v:shape adj="1"/>';
        b = d.firstChild;
        b.style.behavior = "url(#default#VML)";
        if (!(b && typeof b.adj == "object")) {
            return IP.type = null;
        }
        d = null;
    }
     IP.svg = !(IP.vml = IP.type == "VML");
	 IP._oid = 0;

	if (IP.svg) {
        IPP.svgns = "http://www.w3.org/2000/svg";
        IPP.xlink = "http://www.w3.org/1999/xlink";
		var $  = function (el, attr) {
            if (attr) {
                for (var key in attr) {
                    if (attr.hasOwnProperty(key)) {
                        el.setAttribute(key, String(attr[key]));
                    }
                }
            } else {
                el = doc.createElementNS(IPP.svgns, el);
                el.style.webkitTapHighlightColor = "rgba(0,0,0,0)";
                return el;
            }
        };

		create = function () {
            var con = getContainer.apply(0, arguments),
                container = con && con.container,
                x = con.x,
                y = con.y,
                width = con.width,
                height = con.height,
				F = function(){};
			
            if (!container) {
                throw new Error("SVG container not found.");
            }
            var cnvs = $("svg");
            x = x || 0;
            y = y || 0;
            width = width || 512;
            height = height || 342;
            $(cnvs, {
                xmlns: "http://www.w3.org/2000/svg",
                version: 1.1,
                width: width,
                height: height
            });

            if (container == 1) {
                cnvs.style.cssText = "position:absolute;left:" + x + "px;top:" + y + "px";
                doc.body.appendChild(cnvs);
            } else {
                if (container.firstChild) {
                    container.insertBefore(cnvs, container.firstChild);
                } else {
                    container.appendChild(cnvs);
                }
            }
            container = new Paper;
            container.width = width;
            container.height = height;
            container.canvas = cnvs;
            merge.call(container, container, IPP);
            return container;
        };
		

		Element = function (node, svg) {
            var X = 0, Y = 0;
            this[0] = node;
            this.id = IP._oid++;
            this.node = node;
            node.painter = this;
            this.paper = svg;
            this.attrs = this.attrs || {};
            this.transformations = []; 
            this._ = {
                tx: 0,
                ty: 0,
                rt: {deg: 0, cx: 0, cy: 0},
                sx: 1,
                sy: 1
            };
            !svg.bottom && (svg.bottom = this);
            this.prev = svg.top;
            svg.top && (svg.top.next = this);
            svg.top = this;
            this.next = null;
        };

		theImage = function (svg, src, x, y, w, h) {
            var el = $("image");
            $(el, {x: x, y: y, width: w, height: h, preserveAspectRatio: "none"});
            el.setAttributeNS(svg.xlink, "href", src);
            svg.canvas && svg.canvas.appendChild(el);
            var res = new Element(el, svg);
            res.attrs = {x: x, y: y, width: w, height: h, src: src};
            res.type = "image";
            return res;
        }
	}else if(IP.vml){
		var createNode,
			 format = function (token, params) {
				var args = is(params, 'array') ? [0].concat(params) : arguments,
					 formatrg = /\{(\d+)\}/g;

				token && is(token, 'string') && args.length - 1 && (token = token.replace(formatrg, function (str, i) {
					return args[++i] == null ? "" : args[i];
				}));
				return token || "";
		};

        doc.createStyleSheet().addRule(".rvml", "behavior:url(#default#VML)");
        try {
            !doc.namespaces.rvml && doc.namespaces.add("rvml", "urn:schemas-microsoft-com:vml");
            createNode = function (tagName) {
                return doc.createElement('<rvml:' + tagName + ' class="rvml">');
            };
        } catch (e) {
            createNode = function (tagName) {
                return doc.createElement('<' + tagName + ' xmlns="urn:schemas-microsoft.com:vml" class="rvml">');
            };
        };
		create = function () {
            var con = getContainer.apply(0, arguments),
                container = con.container,
                height = con.height,
                s,
				zoom = 10,
                width = con.width,
                x = con.x,
                y = con.y;
            if (!container) {
                throw new Error("VML container not found.");
            }
            var res = new Paper,
                c = res.canvas = doc.createElement("div"),
                cs = c.style;
            x = x || 0;
            y = y || 0;
            width = width || 512;
            height = height || 342;
            width == +width && (width += "px");
            height == +height && (height += "px");
            res.width = 1e3;
            res.height = 1e3;
            res.coordsize = zoom * 1e3 + " " + zoom * 1e3;
            res.coordorigin = "0 0";
            res.span = doc.createElement("span");
            res.span.style.cssText = "position:absolute;left:-9999em;top:-9999em;padding:0;margin:0;line-height:1;display:inline;";
            c.appendChild(res.span);
            cs.cssText = format("top:0;left:0;width:{0};height:{1};display:inline-block;position:relative;clip:rect(0 {0} {1} 0);overflow:hidden", width, height);
            if (container == 1) {
                doc.body.appendChild(c);
                cs.left = x + "px";
                cs.top = y + "px";
                cs.position = "absolute";
            } else {
                if (container.firstChild) {
                    container.insertBefore(c, container.firstChild);
                } else {
                    container.appendChild(c);
                }
            }
            merge.call(res, res, IPP);
            return res;
        };

		Element = function (node, group, vml) {
            var Rotation = 0, RotX = 0, RotY = 0, Scale = 1;
            this[0] = node;
            this.id = IP._oid++;
            this.node = node;
            node.painter = this;
            this.X = 0;
            this.Y = 0;
            this.attrs = {};
            this.Group = group;
            this.paper = vml;
            this._ = {
                tx: 0,
                ty: 0,
                rt: {deg:0},
                sx: 1,
                sy: 1
            };
            !vml.bottom && (vml.bottom = this);
            this.prev = vml.top;
            vml.top && (vml.top.next = this);
            vml.top = this;
            this.next = null;
        };
		Element.prototype.setBox = function (params, cx, cy) {
            if (this.removed) {
                return this;
            }
            var gs = this.Group.style,
                os = (this.shape && this.shape.style) || this.node.style;
            params = params || {};
            for (var i in params) if (params.hasOwnProperty(i)) {
                this.attrs[i] = params[i];
            }
            cx = cx || this._.rt.cx;
            cy = cy || this._.rt.cy;

            var attr = this.attrs, x,y, w, h;
			x = +attr.x;
			y = +attr.y;
			w = attr.width || 0;
			h = attr.height || 0;
            
            cx = (cx == null) ? x + w / 2 : cx;
            cy = (cy == null) ? y + h / 2 : cy;
            var left = cx - this.paper.width / 2,
                top = cy - this.paper.height / 2, t;
            gs.left != (t = left + "px") && (gs.left = t);
            gs.top != (t = top + "px") && (gs.top = t);
           
       
			gs.width != (t = this.paper.width + "px") && (gs.width = t);
			gs.height != (t = this.paper.height + "px") && (gs.height = t);
			os.left != (t = x - left + "px") && (os.left = t);
			os.top != (t = y - top + "px") && (os.top = t);
			os.width != (t = w + "px") && (os.width = t);
			os.height != (t = h + "px") && (os.height = t);
            
        };
		theImage = function (vml, src, x, y, w, h) {
            var g = createNode("group"),
                o = createNode("image");
            g.style.cssText = "position:absolute;left:0;top:0;width:" + vml.width + "px;height:" + vml.height + "px";
            g.coordsize = 1e3 + " " + 1e3;
            g.coordorigin = vml.coordorigin;
            o.src = src;
            g.appendChild(o);
            var res = new Element(o, g, vml);
            res.type = "image";
            res.attrs.src = src;
            res.attrs.x = x;
            res.attrs.y = y;
            res.attrs.w = w;
            res.attrs.h = h;
            res.setBox({x: x, y: y, width: w, height: h});
            vml.canvas.appendChild(g);
            return res;
        };
	}
	IPP.image = function (src, x, y, w, h) {
		return theImage(this, src || "about:blank", x || 0, y || 0, w || 0, h || 0);
	};

	Y.ImagePainter = ImagePainter;
	
}, '1.0.0', {requires:[]});
