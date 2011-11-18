**
 * 旺旺点灯脚本 v1.2 
 *
 * 2009-11-26 mingcheng 从 tbra-wigets 中剥离
 * 2009-04-03 yubo		重构为新图标，全站替换
 * 2009-03-18 xiaoma	1. _item参数从js的query中获取。2. 部分代码重构
 * 2009-04-03 xiaoma	修改旺旺icon和接口
 **/

~function(){
	var Y = YAHOO.util, Dom = Y.Dom, Event = Y.Event, Lang = Y.Lang;

	var SCRIPT_ID = 'J_WangWangScript';
	var SCRIPT_NAME = /tbww_v2(\.source)?\.js(\??[^#]*)/;

	var TRIBE_HOST = 'http://web2.im.alisoft.com';
	var AMOS_HOST = 'http://amos.im.alisoft.com';
	var WEBWW_Host = 'http://webwwtb.im.alisoft.com';
	var ASSETS_HOST = 'http://a.tbcdn.cn';
	
	var STATUS_SPI = AMOS_HOST + '/muliuserstatus.aw?beginnum=0&site=cntaobao&charset=utf-8&uids=';
	var STATUS_ICON_SPI = AMOS_HOST + '/online.aw?v=2&site=cntaobao&charset=utf-8&uid=';
	
	/* format is ?site=cnalichn&v=1&keywords=$keywords&count=$count&name=$name */
	var TRIBE_KW_SPI = TRIBE_HOST + '/GetData/GetTribeInfoByKeywords?site=cntaobao&v=2';
	/* format is ?site=cnalichn&v=1&uid=$uid&type=$type&count=$count&name=$name */
	var TRIBE_UID_SPI = TRIBE_HOST + '/GetData/GetTribeInfoByUid?site=cntaobao&v=2';
	/* 单人旺旺在线图片URL */
	var WEBIM_SPI = ASSETS_HOST + '/sys/wangwang/website.js?t=20090319.js';

	/* Firefox WangWang Protocol Handler URL */
	var EXT_SPI = 'chrome://wangwangapi/content/api.js';
	
	/** 
	 * Global Variable
	 */
	// for STATUS_SPI 
	window.online = [];
	// for 全局登录用户名
	window.tracenick = window.tracenick || '';
	// for 页面中传递过来的宝贝ID用于获取旺旺焦点 从脚本参数中获取 
	// window._item = window._item || '';
	//清除浏览器中旺旺控件
	window.clearWW = function(){
		var wf = Dom.get('webWWFrame');
		if (wf)
			wf.parentNode.removeChild(wf);
	};


	var ONLINE_MSG = "点此可以直接和卖家\n交流选好的宝贝，或\n相互交流网购体验，\n还支持语音视频噢。";
	
	/**
	 * AliSoft API限制，一次最大传递100个uid
	 */
	var MAX_UID = 100;

	var handle = {};
	handle.installed = false;
	handle.version = '';
		
	/**
	 * IM在线状态加载完成事件
	 */ 
	handle._onStatusDataLoadEvent = new Y.CustomEvent("statusDataLoad", handle, false, Y.CustomEvent.FLAT);

	/**
	 * 点亮某个指定<span>
	 * @param token <span> element
 	 * @param status 状态
	 */	
	handle.light = function(token, status) {
        var params = handle.getParamsFromData(token);
		token.appendChild(handle._buildWWLink(params, status));
	};
	
	/**
	 * 点亮某个指定<span>，直接从IM Server返回状态图片
	 * @param token <span> element
	 */
	handle.lightByIcon = function(token, globalParams) {
		var params = handle.getParamsFromData(token);
		var iconUrl = STATUS_ICON_SPI + encodeURIComponent(params.nick);
		iconUrl += '&s=' + ((params.icon && params.icon.toLowerCase() == 'small')?2:1);
		if(params && params.nick) {
			var icon = '<img src="'+ iconUrl + '" border="0" />';
			var link = handle._buildWWLink(params);
			link.innerHTML = icon;
			token.innerHTML = '';
			token.appendChild(link);
		}
	};

    /**
     * 解析请求的字符串为对象
     * add by mingcheng 2009-11-26
     * @params str
     */
    var toQueryParams = function(str) {
        var hash = {}, params = str.split('&'), rd = /([^=]*)=(.*)/;
        for (var j = 0; j < params.length; j++) {
            var match = rd.exec(params[j]);
            if (!match) continue;
            var key = decodeURIComponent(match[1]), 
                value = match[2] ? decodeURIComponent(match[2]) : undefined;
            if (hash[key] !== undefined) {
                if (hash[key].constructor != Array)
                    hash[key] = [hash[key]];
                if (value) 
                    hash[key].push(value);
            } else {
                hash[key] = value;
            }
        }
        return hash;
    }

    /**
     * 从属性中获取参数对象
     * added by yubo 2008-12-23
     * @param token
     */
    handle.getParamsFromData = function(token) {
		var params = {};
        if (Dom.hasClass(token, 'J_WangWang')) {
            params['nick'] = token.getAttribute('data-nick');
            if (token.getAttribute('data-item')) {
				params['item'] = token.getAttribute('data-item');
			}
            params['display'] = token.getAttribute('data-display');
            params['icon'] = token.getAttribute('data-icon');

            // tnick为空时，直接取nick的值
            if(!params['tnick']) {
                params['tnick'] = params['nick'];
            }
        } else if(Dom.hasClass(token, 'ww:token')) {
            params = toQueryParams(token.getAttribute('ww:params'));
        }
		Lang.augmentObject(params, handle._scriptParams, false);
		return params;
    }

	/**
	 * 私有函数，构造ww链接，应用时如有必要可覆盖
	 * @param {Object} params
	 * @param number status 从online[]取出的nick对应的状态
	 * @return token.innerHTML
	 */
	handle._buildWWLink = function(params, status) {
		//准备数据
		//large or small icon
		var icon = params.icon ? params.icon.toLowerCase() : 'large';
		var display = params.display ? params.display.toLowerCase() : 'block';
		var nick = params.nick || '';
		var tnick = params.tnick || '';
		var item =  params.item || window._item || '';
		var oid = params.oid || '';

		/**
		 *  Alisoft返回的状态值含义
		Online＝0;         表示用户不在线
		Online＝1;         表示用户在线
		Online＝2;         表示非有效用户ID
		Online＝3;         表示隐身
		Online＝4;         表示手机在线
		Online= 5;         表示手机在线，且设置了离线消息转手机
		Online= 6;         表示离线，且设置了离线消息转手机
		*/		
		//显示旺旺在线图片

		var link = document.createElement('a');
		link.href = 'javascript: void(0);';
		link.setAttribute('target', '_blank');

		if (status == 1) { //旺旺在线
			Dom.addClass(link, 'ww-online');	
			link.title = ONLINE_MSG;
			link.innerHTML = '<span>旺旺在线</span>';
			//构造旺旺在线图片
		} else if (status == 4 || status == 5) { //手机在线
			//构造旺旺在线图片
			Dom.addClass(link, 'ww-mobile');
			link.innerHTML = '<span>手机在线</span>';
		} else if (status == 0 || status == 2 || status == 3 || status == 6) { //旺旺离线
			//构造旺旺在线图片
			Dom.addClass(link, 'ww-offline');
			link.innerHTML = '<span>旺旺离线</span>';
		}
		
		if (typeof status != 'undefined') {
			Dom.addClass(link, 'ww-' + icon);
			Dom.addClass(link, 'ww-' + display);
		}
		
		if(handle.installed) {
			//  AliSoft 提供的WebIM api 
			if (window.onlinewangWangSend) {
				link.onclick = function() {
					var props = 'nick='+nick+'&uid_t='+tnick+'&status='+status+'&gid='+item+'&suid='+window.tracenick;
					if (oid)
						props += '&oid='+oid;
					onlinewangWangSend('cntaobao', window.tracenick, 'cntaobao', nick, status, props);
					return false;
				}
			} else if (YAHOO.env.ua.gecko) {
				/** 
				 * Check if the protocols were registered
				 */	
				var cmd;
				if(handle.installed & 1) {
					cmd = 'aliim:sendmsg?touid=cntaobao' + nick + '&uid='+ window.tracenick + '&gid='+item;
				} else if (handle.installed & 2) {
					cmd = 'wangwang:SendIM?uid=' + nick + '&uid_t='+ tnick + '&suid='+ window.tracenick + '&gid='+item;
				} else if (handle.installed & 4) {
					cmd = 'alitalk:SendIM?uid=' + nick + '&AliLoginID='+ window.tracenick + '&gid='+item;
				}
				link.target = '_self';
				Event.on(link, 'click', function (evt) {
					window.location = cmd;
					Event.preventDefault(evt);
				});
			}
		} else {
	
			link.target = '_blank';
			link.href = WEBWW_Host + '/wangwang/ww1.htm?t=' + new Date().getTime() + '&uid='+escape(window.tracenick)+'&tid='+escape(nick);
			if(YAHOO.env.ua.gecko){
				link.onclick = function(ev) {
					ev.target.target = '_blank';
					return true;
				}
			} else {
				link.onclick = function(ev) {
					window.open(link.href, '', 'width=0,height=0,left=0,top=0,location=yes,menubar=yes,toolbar=yes,status=yes,resizable=yes,scrollbars=yes');
					return false;
				}
			}
		}
 		return link;
	}
	
	/**
	 * login
	 */
	handle.login = function(uid) {
		if(Lang.isString(uid) && uid.trim().length > 1 && handle.installed) {
			try{
				/**
				 * 网站登录启动本机旺旺程序命令格式是这样的(wangwang:Login?suid=***&auto=1/0) 其中suid为登录ID，auto=1为自动登录）
				 */
				//var lpav = (TB.bom.isIE && (handle.version.indexOf('R1.9') == 0 || parseFloat(handle.version) > 5.5)) ? 1 : 0;
				//var shellCmd = "wangwang:login?suid=" + uid + "&autologin=1&auto=" + lpav;
				var shellCmd = "wangwang:login?suid=" + uid + "&autologin=1&auto=1";
				var shellFrame = window.frames['aliwangwangSendmsgShowFrame'];
				if (!shellFrame) {
					shellFrame = document.createElement('iframe');
					document.body.appendChild(shellFrame);
					iframe.setAttribute('target', '_blank');
					iframe.setAttribute('src', shellCmd);
				} else {
					shellFrame.location = shellCmd;
				}
			}catch(e){
			}
		}
	}

	/**
	 * 发送消息给某人
	 */
	handle.talk = function(uid, props) {
		props = props || {};
		if(Lang.isString(uid) && uid.trim().length > 1 && handle.installed) {
			var propsStr = 'nick=' + uid + '&suid=' + window.tracenick;
			for (k in props) {
				propsStr += '&'+k+'='+props[k];
			}
			onlinewangWangSend('cntaobao', window.tracenick, 'cntaobao', uid, props.status||1, propsStr);			
		}
	}
	
	/**
	 * 获取群资料
	 * @param {Object} config
	 * config 格式
	 * {
	 * 	keywords: $keywords, 多个keywords用逗号隔开
	 *  uid: $uid,  会员昵称uid 不会与 keywords 共存
	 *  type: $type 1 查询ID创建的群；2 查询ID参与的群 3 查询ID创建的和参与的群
	 *  count: $count
	 *  callback: $callback
	 * }
	 */
	handle.loadTribes = function(config) {
		var src = '';
		if (config.keywords) {
			src = TRIBE_KW_SPI + '&keywords=' + config.keywords;
		} else if (config.uid) {
			src = TRIBE_UID_SPI + '&uid=' + config.uid + '&type=' + config.type; 
		} else {
			//无有效参数
			return ;
		}

		if (config.count)
			src += '&count=' + config.count;
		/* 根据AliSoft的API要求，在global环境中创建回调函数 
		 * Alisoft 定义JS变量xxxObj和回调JS方法display_xxx
		 */
		var tribeId = Dom.generateId(null,'tribe'); //tribe$0, tribe$1, .. etc.
		
		window['display_'+tribeId] = function() {
			config.callback(window[tribeId+'Obj']);
		}

		src += '&name=' + tribeId;

		var charset = (document.charset || document.characterSet).toLowerCase();
		Y.Get.script(src, {
			onSuccess: function() {/* 暂时未使用 */},
			varName: tribeId+'Obj',
			charset: charset
		});		
	}
	
	/**
	 * 构造tribe链接，为兼容原有系统
	 * @param {Object} tribeId
	 * @param {Object} tribeName
	 */
	handle.buildTribeLink = function(tribeId, tribeName) {
		var tn = tribeName;
		if (tribeName.length > 9) {
			tn = tribeName.substr(0,7) + '...';
		}
		var tribeUrl = 'http://www2.im.alisoft.com/webim/tribe/tribe_detail.htm?userId=cntaobao&tribeId=' + tribeId;
		var tribeAction = 'window.open(\'' + tribeUrl + '\', \'_blank\', \'height=400, width=500, top=60, left=150, toolbar=no, menubar=no, scrollbars=yes, resizable=no,location=no, status=no\'); return false;';
		return '<a href="#" onclick="' + tribeAction + '" target="_blank" title="' + tribeName + '">' + tn + '</a>';
	};
	
	handle._statusMap = {};

	/**
	 * WW点灯
	 */
	handle.lightAll = function(container, scriptParams) {
		
		if (scriptParams) {
			this._scriptParams = Lang.merge(this._scriptParams, scriptParams);
		}

		/*
		 * 取得页面中所有旺旺标识占位标记对象
		 */
		var tokens = Dom.getElementsByClassName('ww:token', 'span', Dom.get(container));
		// added by yubo 2008-12-23
        var newTokens = Dom.getElementsByClassName('J_WangWang', 'span', Dom.get(container));
		tokens = tokens.concat(newTokens);
		if(tokens.length == 0) return;
        // yubo END



		/*
		 * 获取参数
		 */
		//var charset = (document.charset || document.characterSet).toLowerCase();  //页面编码,繁体版本淘宝使用utf-8编码
		var nicks = [], nick, params;
		//var batchIdx;
		for (var i = 0; i < tokens.length; i++) {
            params = handle.getParamsFromData(tokens[i]);
            nick = params['nick'] || '';

			/* 创建临时属性 ww:nick */
			tokens[i].setAttribute('ww:nick', nick);

            /* 昵称在 nicks 数组中的索引，对应 online 返回值中的索引 */
            nicks.push(nick);

            // batchIdx的计算，统一放在后面，这里功能单纯点
			/*var idx = nicks.indexOf(nick);
			if (idx == -1) {
				idx = nicks.push(nick) - 1;
			}

			if (nicks.length > MAX_UID && !batchIdx) {
				batchIdx = i;
			}*/
		}

		
		var callback = function(o) {
			var nks = o.data.nicks, tks = o.data.tokens;

			for (var m = 0; m < nks.length; m++) {
				handle._statusMap[nks[m]]= window.online[m];
			}

			handle._onStatusDataLoadEvent.fire(tks);
			/*
			 * 执行应用方设置的 doAfterStatusDataLoad 回调
			 */
			if (handle.doAfterStatusDataLoad) {
				handle.doAfterStatusDataLoad(window.online||[]);
			}


			window.online.length = 0;
			//window.online = null;  在有批次时，此处设为null，会导致批次失败  yubo 2009-04-15


			//如果是批量发送，发现还有二次请求，则发送第二次请求
			/*if (batchIdx && o.data.next) {
				o.data.next();
			}*/
            if(o.data.next) o.data.next();
		};

		var query = function(nicks, tokens, next) {
			var url = STATUS_SPI;
			/*
			if (charset == 'utf-8') { //如果繁体版本，使用utf-8编码昵称，并附带charset=utf-8参数
				url += encodeURIComponent(nicks.join(';'));
				url += '&charset=utf-8';
			} else {
				url += nicks.join(';');
			}*/
			
			url += encodeURIComponent(nicks.join(';'));

			Y.Get.script(url, {
				onSuccess: callback,
				varName: 'online',
				data: {
					tokens: tokens,
					nicks: nicks,
					next: next
				},
				charset: 'utf-8'
			});
		};

		/**
         * 分批，一批100(Alisoft API限制)，最多发送两次
		 **/
		/*if (batchIdx) {
			var batchNicks = nicks.splice(0, MAX_UID);
			var batchTokens = tokens.splice(0, batchIdx);
			query(batchNicks, batchTokens, function() {
				query(nicks, tokens);
			});
		} else {
			query(nicks, tokens);
		}*/

        // 调整算法，同时考虑MAX_UID和URL的限制
        // modified by yubo 2009-04-15
        var MAX_URL = 1800; // 最大长度是2083，但考虑到还有其它参数，以及后面 join(";") 的字符，这里限定1800
        var batchNicks = [];
        var batchTokens = [];
        var strNick = '', startIdx = 0, batchIdx = 0;
        for(var idx = 0, len = nicks.length; idx < len; ++idx) {
            if(isExceedMaxUrl(strNick + nicks[idx]) || idx > MAX_UID - 1 || idx == len - 1) {
                var end = (idx == len - 1) ? len : idx;
                batchNicks[batchIdx] = nicks.slice(startIdx, end);
                batchTokens[batchIdx] = tokens.slice(startIdx, end);

                strNick = '';
                startIdx = idx;
                batchIdx++;
            }
            strNick += nicks[idx] + ';';
        }

        // 发送请求
        sendQuery(0);
        function sendQuery(idx) {
            query(batchNicks[idx], batchTokens[idx], function() {
                batchIdx--;
                if (batchIdx) {
                    sendQuery(idx + 1);
                }
            });
        }

        // ie下，url的最大长度是2083，分批次的时候，还得考虑这个因素
        function isExceedMaxUrl(str) {
            if(YAHOO.env.ua.ie) {
                return encodeURIComponent(str).length > MAX_URL;
            }
            return false;
        }
	};

	handle._autoLight = function() {
		//在onDOMReady 传递的参数是第三个参数
		handle.lightAll(document.body);
	}

	handle._init = function() {
		/**
		 * 加载tbww.css
		 */			  											 	
		(function(cssText, doc) {
			doc = doc || document;
			var styleEl = doc.createElement('style');
			styleEl.type = "text/css";
			doc.getElementsByTagName('head')[0].appendChild(styleEl); //先appendChild，否则hack失效
			if (styleEl.styleSheet) {
				styleEl.styleSheet.cssText = cssText;
			} else {
				styleEl.appendChild(doc.createTextNode(cssText));
			}
		})('.ww-online,.ww-offline,.ww-mobile{background-image:url(http://a.tbcdn.cn/sys/wangwang/wangwang_v2.gif)!important;background-repeat:no-repeat;text-decoration:none!important;zoom:1;}.ww-online span,.ww-offline span,.ww-mobile span{visibility:hidden!important;*text-indent:-9999em!important;white-space:nowrap!important;}.ww-online{background-position-y:0;}.ww-offline{background-position-y:-20px;}.ww-mobile{background-position-y:-40px;}html>body .ww-online.ww-large{background-position:0 0;}html>body .ww-online.ww-small{background-position:100% 0;}html>body .ww-offline.ww-large{background-position:0 -20px;}html>body .ww-offline.ww-small{background-position:100% -20px;}html>body .ww-mobile.ww-large{background-position:0 -40px;}html>body .ww-mobile.ww-small{background-position:100% -40px;}.ww-large{width:67px;height:20px;background-position-x:0;}.ww-small{width:20px;height:20px;background-position-x:100%;}.ww-block{display:block;overflow:hidden;margin-top:3px;}.ww-inline{display:inline-block;vertical-align:text-bottom;overflow:hidden;}');

		/**
		 * 加载AliSoft WangWang 公共脚本
		 */
		if (YAHOO.env.ua.ie) {
			/** 
			 * 检查IM安装状态及版本
			 */	
			Y.Get.script(WEBIM_SPI,{ 
				onSuccess: function(){
					try {		
						/*旺旺6.0升级后提供一个安装判断接口
						* checkIMVersion(toSite)
						* @tosite='cntaobao'
						*/
						if(-1!=checkIMVersionNoMsg('cntaobao')){
							handle.installed = true;
						}
					} catch(e) {
					}
				}
			});
		} else if (YAHOO.env.ua.gecko) {
			// for firefox
			Y.Get.script(EXT_SPI,{ 
				onSuccess: function(){
					try {		
						/** 
						 * Check if the protocols were registered
						 */
						handle.installed = 0;
						if ('undefined' !== typeof AliIM && Object === AliIM.constructor) {
							 handle.installed += 1;
						}
						if('undefined' !== typeof WangWang && Object === WangWang.constructor) {
							 handle.installed += 2;
						}
						if ('undefined' !== typeof AliTalk && Object === AliTalk.constructor) {
							 handle.installed += 4;
						}
					} catch(e) {
					}
				}
			});
		}
		
		var wwFrame;
		try {
			wwFrame = document.createElement('<iframe name="aliwangwangSendmsgShowFrame" frameborder="0" src="javascript:false">');
		} catch (e) {
			wwFrame = document.createElement('iframe');
			wwFrame.setAttribute('frameBorder', '0');
			wwFrame.name = 'aliwangwangSendmsgShowFrame';
			wwFrame.src = 'about:blank';
		}
		wwFrame.id="aliwangwangSendmsgShowFrame";
		wwFrame.className = 'hidden';
		wwFrame.style.width = wwFrame.style.height = 0;
		Dom.setStyle(wwFrame, 'display', 'none');
		try {
			Dom.insertBefore(wwFrame, document.body.firstChild); //tbww.js 放在<head>中时失效
		} catch (e) {
			Event.on(window, 'load', function() {
				document.body.appendChild(wwFrame);   //在 frameset 情况下避免使用onDOMReady
			});
		}
	
		/**
		 * 默认在DOM加载完成后自动点灯
		 */

		/* 取得脚本后带的参数 */
		var getScriptParams = function() {
			var matches, src, qs = '',sObj;
			try { //YUI 2.7.0 bug in Dom.get method
				sObj = Dom.get(SCRIPT_ID);
			} catch (e) {};
			var scripts = sObj ? [sObj] : document.getElementsByTagName("script");

			for (var i = 0, n = scripts.length; i < n; ++i) {
				src = scripts[i].getAttribute('src');
				if (src && (matches = src.match(SCRIPT_NAME))!=null) {
					qs = matches.length > 2 ? matches[2].slice(1) : '';
				}
			}

			var params = {}, seg = qs.split('&'), pair;
            for (var j = 0, k = seg.length; j<k; ++j) {
                if (!seg[j]) { continue; }
                pair = seg[j].split('=');
                params[pair[0]] = pair[1];
            }
			return params;
		}

		var scriptParams = getScriptParams();
		if (scriptParams.auto != 'false') {
			Event.onDOMReady(handle._autoLight);
		}
		handle._scriptParams = scriptParams;

		/**
		 * 注册 _onStatusDataLoadEvent 事件处理回调
		 * @param {Object} tokens
		 */
		handle._onStatusDataLoadEvent.subscribe(function(tokens) {
			for (var i = 0; i < tokens.length; i++) {
				handle.light(tokens[i], handle._statusMap[tokens[i].getAttribute('ww:nick')]);
				tokens[i].removeAttribute('ww:nick');
			}
		});
	}

	handle._init();
    if(typeof TB === 'undefined') {
        TB = {};
    }
	TB.ww = handle;	
}();
