// vim: set et sw=4 ts=4 sts=4 fdm=marker ff=unix fenc=gbk ft=javascript:
/**
 * 旺旺点灯脚本 v2.1s
 *
 *  不获取数据，直接渲染 Dom 绑定事件
 *
 *  Alisoft返回的状态值含义
 *	    Online＝0;         表示用户不在线
 *	    Online＝1;         表示用户在线
 *	    Online＝2;         表示非有效用户ID
 *	    Online＝3;         表示隐身
 *	    Online＝4;         表示手机在线
 *	    Online= 5;         表示手机在线，且设置了离线消息转手机
 *	    Online= 6;         表示离线，且设置了离线消息转手机
 * 
 * @author mingcheng
 * @since  2009-01-11
 * @change
 *     [+]new feature  [*]improvement  [!]change  [x]bug fix
 *
 *  [+] 2009-01-13
 *      使用原生 getScript 方法
 *
 *  [+] 2009-01-11
 *      初始化版本，依赖 YUI 的 Core, Dom, Event, Get
 */

void function(scope) {
    var Y = YAHOO.util, Dom = Y.Dom, Event = Y.Event, Lang = Y.Lang, 
    getAttribute = Dom.getAttribute, setAttribute = Dom.setAttribute;

    /**
     * 服务器地址、旺旺接口等常量
     */
    var ASSETS_HOST = 'http://a.tbcdn.cn',
        WEBWW_HOST  = 'http://webwwtb.im.alisoft.com',
        WEBIM_SPI   = ASSETS_HOST + '/sys/wangwang/website.js?t=20100111', 
        EXT_SPI     = 'chrome://wangwangapi/content/api.js';


    /**
     * 默认配置
     */
    var defaultConfig = {
        justBind: true, // 只是绑定事件
        statusFlag: 'data-status', // 旺旺状态自定义属性
        wwFlagCls: 'J_WangWang'    // 旺旺占位符标记
    };


    /**
     * 动态载入 JS 脚本
     *
     * @see http://www.planabc.net/2008/10/31/javascript_ready_onload/
     */
    var getScript = function(url, callback, charset, scope) {
        var doc = document, node = doc.createElement("script");

        node.charset = charset || doc.charset || doc.characterSet;
        node.src = url;

        if (typeof callback === "function") {
            if (window.ActiveXObject) {
                node.onreadystatechange = function() {
                    var rs = node.readyState;
                    if (rs === "loaded" || rs === "complete") {
                        callback.call(scope || window);
                    }
                };
            } else {
                node.onload = callback;
            }
        }

        doc.getElementsByTagName("head")[0].appendChild(node);
    }
    

    /**
     * 插入旺旺基本脚本，检测插件是否已安装
     *
     * @private
     */
    var isInstalled = false;
    var checkInstalled = function() {
        if (YAHOO.env.ua.ie) {
            getScript(WEBIM_SPI, function() {
                try {
                    /**
                     * 6.0 升级后提供的安装判断接口
                     *     checkIMVersion(toSite) @tosite='cntaobao'
                     */
                    if(-1 != checkIMVersionNoMsg('cntaobao')){
                        isInstalled = true;
                    }
                } catch(e) {}
            }, 'gbk');
        } else if (YAHOO.env.ua.gecko) {
            /**
             * Firefox 使用自身插件脚本
             *      NOTICE:  插件可能需要更新
             */
            getScript(EXT_SPI, function() {
                try {		
                    isInstalled = 0;
                    //
                    if ('undefined' !== typeof AliIM && Lang.isObject(AliIM.constructor)) {
                         isInstalled += 1;
                    }
                    //
                    if('undefined' !== typeof WangWang && Lang.isObject(WangWang.constructor)) {
                         isInstalled += 2;
                    }
                    //
                    if ('undefined' !== typeof AliTalk && Lang.isObject(AliTalk.constructor)) {
                         isInstalled += 4;
                     }
                } catch(e) {}
            }, 'gbk');
        }
    }


    /**
     * 创建 iframe 供脚本调用
     *
     * @private
     */
    var insertIframe = function() { 
        var wwFrame;
        try {
            wwFrame = document.createElement('<iframe name="aliwangwangSendmsgShowFrame" frameborder="0" src="javascript:false">');
        } catch (e) {
            wwFrame = document.createElement('iframe');
            wwFrame.setAttribute('frameBorder', '0');
            wwFrame.name = 'aliwangwangSendmsgShowFrame';
            wwFrame.src  = 'about:blank';
        }
        wwFrame.id="aliwangwangSendmsgShowFrame";
        wwFrame.style.width = wwFrame.style.height = 0;
        Dom.setStyle(wwFrame, 'display', 'none');
        try {
            // 本脚本放在 head 中时可能会失效
            Dom.insertBefore(wwFrame, document.body.firstChild); 
        } catch (e) {
            Event.on(window, 'load', function() {
                // 在 frameset 情况下避免使用 onDOMReady
                document.body.appendChild(wwFrame); 
            });
        }
    }


    /**
     * 旺旺点灯脚本
     *
     * @public
     */
    window.TB = window.TB || {};
    TB.ww = {
        /**
         * 初始化
         */
        init: function(container, config) {
            var self = this;

            // 检查插件是否安装
            checkInstalled();

            // 插入 Iframe 供插件通信
            insertIframe();

            // 获取配置
            self.config = Lang.merge(defaultConfig, config || {});

            // 需要渲染的容器
            self.container = Dom.get(container) || document.body;

            /*if(!this.config.justBind) {
                self.getStatus();
            }*/

            // 绑定所有的事件
            self.bindAll();
        },

        /* TODO
        getStatus: function() {

        },*/

        /**
         * 绑定页面内所有点灯元素
         */
        bindAll: function(config) {
            this.bind(document.body, config);
        },

        /**
         * 绑定指定容器中的元素
         */
        bind: function(container) {
            var self = this, 
                items = Dom.getElementsByClassName(self.config.wwFlagCls, '*', Dom.get(container) || self.container);

            for (var i = 0, len = items.length; i < len; i++) {
                // 绑定旺旺图标点击事件
                void function(element) {
                    var props = {
                        nick:   getAttribute(element, 'data-nick')  || '', // 昵称
                        tnick:  getAttribute(element, 'data-tnick') || '', // 繁体版昵称
                        item:   getAttribute(element, 'data-item')  || window._item || '',
                        oid:    getAttribute(element, 'data-oid')   || '',
                        status: getAttribute(element, self.config.statusFlag) || 1 // 登录状态
                    };

                    Event.on(element, 'click', function(e) {
                        Event.stopEvent(e);
                        self.talk(props.nick, props);
                        return false;
                    });
                }(items[i]);
            }
        },


        /**
         * 直接弹出窗口给指定 UID 的用户
         *
         * @return void
         */
        talk: function(nick, props) {
            props = props || {};
            if(Lang.isString(nick) && nick.trim().length > 1/* && isInstalled*/) {
                var propsStr = 'nick=' + nick + '&suid=' + window.tracenick;
                for (k in props) {
                    propsStr += '&'+k+'='+props[k];
                }

                /**
                 * 如果旺旺插件已安装
                 */
                if (isInstalled) {
                    /**
                     * 旺旺提供的官方接口
                     */
                    if (window.onlinewangWangSend) {

                        onlinewangWangSend('cntaobao', window.tracenick || '', 'cntaobao', nick, props.status||1, propsStr);			
                    } else if (YAHOO.env.ua.gecko) {

                        /**
                         * Firefox 旺旺插件接口
                         */
                        var cmd;
                        if(isInstalled & 1) {
                            cmd = 'aliim:sendmsg?touid=cntaobao' + nick + '&' + propsStr;
                        } else if (isInstalled & 2) {
                            cmd = 'wangwang:SendIM?' + propsStr;
                        } else if (isInstalled & 4) {
                            cmd = 'alitalk:SendIM?' + propsStr;
                        }

//                        alert(cmd); // 测试 firefox 请求连接
                        
                        window.open(cmd);
                    }
                } else {
                    /**
                     * 如果插件未安装，则打开网页版的旺旺
                     */
                    var href = WEBWW_HOST + '/wangwang/ww1.htm?t=' + (+new Date) + '&uid=' + 
                        escape(window.tracenick)+'&tid='+escape(nick);

//                    alert(href); // 旺旺网页版的连接

                    window.open(href, '', 
                            'width=0,height=0,left=0,top=0,' +
                            'location=yes,menubar=yes,toolbar=yes,' + 
                            'status=yes,resizable=yes,scrollbars=yes');
                }
            }
        },

        /**
         * 清除浏览器中的旺旺控件
         */
        clearWW: function() {
            var wf = Dom.get('webWWFrame');
            if (wf) wf.parentNode.removeChild(wf);
        }
    };

    //Lang.augmentObject(WangWang, Y.EventProvider);
    scope.TB = TB; // 绑定到命名空间
}(this);
