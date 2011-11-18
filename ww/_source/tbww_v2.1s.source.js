// vim: set et sw=4 ts=4 sts=4 fdm=marker ff=unix fenc=gbk ft=javascript:
/**
 * ������ƽű� v2.1s
 *
 *  ����ȡ���ݣ�ֱ����Ⱦ Dom ���¼�
 *
 *  Alisoft���ص�״ֵ̬����
 *	    Online��0;         ��ʾ�û�������
 *	    Online��1;         ��ʾ�û�����
 *	    Online��2;         ��ʾ����Ч�û�ID
 *	    Online��3;         ��ʾ����
 *	    Online��4;         ��ʾ�ֻ�����
 *	    Online= 5;         ��ʾ�ֻ����ߣ���������������Ϣת�ֻ�
 *	    Online= 6;         ��ʾ���ߣ���������������Ϣת�ֻ�
 * 
 * @author mingcheng
 * @since  2009-01-11
 * @change
 *     [+]new feature  [*]improvement  [!]change  [x]bug fix
 *
 *  [+] 2009-01-13
 *      ʹ��ԭ�� getScript ����
 *
 *  [+] 2009-01-11
 *      ��ʼ���汾������ YUI �� Core, Dom, Event, Get
 */

void function(scope) {
    var Y = YAHOO.util, Dom = Y.Dom, Event = Y.Event, Lang = Y.Lang, 
    getAttribute = Dom.getAttribute, setAttribute = Dom.setAttribute;

    /**
     * ��������ַ�������ӿڵȳ���
     */
    var ASSETS_HOST = 'http://a.tbcdn.cn',
        WEBWW_HOST  = 'http://webwwtb.im.alisoft.com',
        WEBIM_SPI   = ASSETS_HOST + '/sys/wangwang/website.js?t=20100111', 
        EXT_SPI     = 'chrome://wangwangapi/content/api.js';


    /**
     * Ĭ������
     */
    var defaultConfig = {
        justBind: true, // ֻ�ǰ��¼�
        statusFlag: 'data-status', // ����״̬�Զ�������
        wwFlagCls: 'J_WangWang'    // ����ռλ�����
    };


    /**
     * ��̬���� JS �ű�
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
     * �������������ű���������Ƿ��Ѱ�װ
     *
     * @private
     */
    var isInstalled = false;
    var checkInstalled = function() {
        if (YAHOO.env.ua.ie) {
            getScript(WEBIM_SPI, function() {
                try {
                    /**
                     * 6.0 �������ṩ�İ�װ�жϽӿ�
                     *     checkIMVersion(toSite) @tosite='cntaobao'
                     */
                    if(-1 != checkIMVersionNoMsg('cntaobao')){
                        isInstalled = true;
                    }
                } catch(e) {}
            }, 'gbk');
        } else if (YAHOO.env.ua.gecko) {
            /**
             * Firefox ʹ���������ű�
             *      NOTICE:  ���������Ҫ����
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
     * ���� iframe ���ű�����
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
            // ���ű����� head ��ʱ���ܻ�ʧЧ
            Dom.insertBefore(wwFrame, document.body.firstChild); 
        } catch (e) {
            Event.on(window, 'load', function() {
                // �� frameset ����±���ʹ�� onDOMReady
                document.body.appendChild(wwFrame); 
            });
        }
    }


    /**
     * ������ƽű�
     *
     * @public
     */
    window.TB = window.TB || {};
    TB.ww = {
        /**
         * ��ʼ��
         */
        init: function(container, config) {
            var self = this;

            // ������Ƿ�װ
            checkInstalled();

            // ���� Iframe �����ͨ��
            insertIframe();

            // ��ȡ����
            self.config = Lang.merge(defaultConfig, config || {});

            // ��Ҫ��Ⱦ������
            self.container = Dom.get(container) || document.body;

            /*if(!this.config.justBind) {
                self.getStatus();
            }*/

            // �����е��¼�
            self.bindAll();
        },

        /* TODO
        getStatus: function() {

        },*/

        /**
         * ��ҳ�������е��Ԫ��
         */
        bindAll: function(config) {
            this.bind(document.body, config);
        },

        /**
         * ��ָ�������е�Ԫ��
         */
        bind: function(container) {
            var self = this, 
                items = Dom.getElementsByClassName(self.config.wwFlagCls, '*', Dom.get(container) || self.container);

            for (var i = 0, len = items.length; i < len; i++) {
                // ������ͼ�����¼�
                void function(element) {
                    var props = {
                        nick:   getAttribute(element, 'data-nick')  || '', // �ǳ�
                        tnick:  getAttribute(element, 'data-tnick') || '', // ������ǳ�
                        item:   getAttribute(element, 'data-item')  || window._item || '',
                        oid:    getAttribute(element, 'data-oid')   || '',
                        status: getAttribute(element, self.config.statusFlag) || 1 // ��¼״̬
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
         * ֱ�ӵ������ڸ�ָ�� UID ���û�
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
                 * �����������Ѱ�װ
                 */
                if (isInstalled) {
                    /**
                     * �����ṩ�Ĺٷ��ӿ�
                     */
                    if (window.onlinewangWangSend) {

                        onlinewangWangSend('cntaobao', window.tracenick || '', 'cntaobao', nick, props.status||1, propsStr);			
                    } else if (YAHOO.env.ua.gecko) {

                        /**
                         * Firefox ��������ӿ�
                         */
                        var cmd;
                        if(isInstalled & 1) {
                            cmd = 'aliim:sendmsg?touid=cntaobao' + nick + '&' + propsStr;
                        } else if (isInstalled & 2) {
                            cmd = 'wangwang:SendIM?' + propsStr;
                        } else if (isInstalled & 4) {
                            cmd = 'alitalk:SendIM?' + propsStr;
                        }

//                        alert(cmd); // ���� firefox ��������
                        
                        window.open(cmd);
                    }
                } else {
                    /**
                     * ������δ��װ�������ҳ�������
                     */
                    var href = WEBWW_HOST + '/wangwang/ww1.htm?t=' + (+new Date) + '&uid=' + 
                        escape(window.tracenick)+'&tid='+escape(nick);

//                    alert(href); // ������ҳ�������

                    window.open(href, '', 
                            'width=0,height=0,left=0,top=0,' +
                            'location=yes,menubar=yes,toolbar=yes,' + 
                            'status=yes,resizable=yes,scrollbars=yes');
                }
            }
        },

        /**
         * ���������е������ؼ�
         */
        clearWW: function() {
            var wf = Dom.get('webWWFrame');
            if (wf) wf.parentNode.removeChild(wf);
        }
    };

    //Lang.augmentObject(WangWang, Y.EventProvider);
    scope.TB = TB; // �󶨵������ռ�
}(this);
