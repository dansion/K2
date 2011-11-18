/*!
 * @revision:
 */

/*
 * @author:sanqi
 * @version:1-0-0
 */
YUI.add('k2-ww',function(Y){
/**
 * 在Web上操作旺旺 
 * @module:ww
 */
	var WIN = Y.config.win,
      SITE = 'cntaobao',
      DOWNLOAD_URL = 'http://www.taobao.com/wangwang/',
      // IE对URL的最长限制是2048，Apache的最长限制是8192，为了给测试留下一些参数，所以URL最长值控制在2000。
      //@todo 可以依据服务端的URL最长限制在非IE浏览器下增长URL长度
      MAX_URL_LENGTH = 2000; 
	   //Y.log('ww','info','ww');
  // 旺旺全局状态
  if(!WIN.online){
    WIN.online = [];
  }
	//Y.log(WIN,'info','ww');

  /**
   * 获取Web旺旺的地址
   * @method _getStatUrl
   * @param {String} ids 用;连接的id字符串 
   * @param {Number} n 开始的id序号，比如n=100,那就表示该数组的第一个id的状态保存在变量online[100]中
   * @private
   */

  var _getStatUrl = function(ids,n){
    //Y.log('ids = ' + ids + '; n = ' + n + '; in _getStatUrl','info','ww');
    if(ids){
	    n = n || 0;
	    return  'http://amos.im.alisoft.com/muliuserstatus.aw?beginnum='+ n +'&site='+ SITE +'&charset=utf-8&uids=' + ids;
    }
  };

  /**
   * 获取Web旺旺的地址
   * @method _getWebWwUrl
   * @param {String} uid 发起人的id
   * @param {String} tid 联系人的id
   * @private
   */

  var _getWebWwUrl = function(tid,uid){
    if(tid){
	    uid = uid || '';
	    return 'http://webwwtb.im.alisoft.com/wangwang/ww1.htm?uid=' + escape(uid) + '&tid=' + escape(tid);   
    }
  };

  /**
   * 旺旺点灯，格式要求如下：
   * <dl>
   * <dt>普通旺旺：</dt><dd>&lt;span class="k2-ww" data="{'id':'三七'}"&gt;&lt;/span&gt;</dd>
   * <dt>小旺旺：</dt><dd>&lt;span class="k2-ww k2-ww-small" data="{'id':'三七'}"&gt;&lt;/span&gt;</dd>
   * @method light
   * @param {String | Y.Node | Y.NoeList | HTMLElement} ancestor  旺旺节点的祖先容器 
   */
	var light = function(ancestor){
    var BODY = 'body',
        Node = Y.Node,
        NodeList = Y.NodeList,
        All = Node.all,
        YArray = Y.Array,
        CN = 'k2-ww',
        CNS = '.' + CN,
        ID = 'data-wwid',
        nodes = [],
        ids = [],
        idNum = 0,
        urls = [],
        url,
        pushNodeInfo = function(node){
          //Y.log('pushNodeInfo() init','info','ww');
          var tmp = ids;

          nodes.push(node);
          ids.push(encodeURIComponent(node.getAttribute(ID)));
          //Y.log('ids = ' + ids + ' in pushNodeInfo()','info','ww'); 

          // @todo 有可能整个页面的wwid数量很少，这样一个URL就够了，可以考虑先判断整体长度再做一个一个的拆分，或者考虑wwid的最大长度，采取更科学的算法
          url = _getStatUrl(ids.join(';'),idNum);
          //Y.log('url = ' + url + ' in pushNodeInfo()','info','ww'); 

          if(url.length > MAX_URL_LENGTH){
            urls.push(_getStatUrl(tmp.join(';'),idNum));

            idNum += tmp.length;
            ids = ids.pop();
            url = '';
          }
        },
        pushNodes = function(node){
          if(node.hasClass(CN)){
            pushNodeInfo(node);
          }else{
            node.all(CNS).each(function(node){
              pushNodeInfo(node);
            });
          }  
        };
    //Y.log('light init','info','ww');

    if(ancestor){
      if(ancestor instanceof Node){
        pushNodes(ancestor);
      }else if(ancestor instanceof NodeList){
        ancestor.each(function(node){
          pushNodes(node);
        });
      }else{
        All(ancestor).each(function(node){
          pushNodes(node);  
        });
      }  
    }else{
      All(CNS).each(function(node){
         pushNodeInfo(node);
      }); 
    }
    
    //Y.log(nodes);
    //Y.log(ids);

    if(nodes.length > 0){
      if(url.length > 0){
        urls.push(url);  
      }  
    }else{
      return;  
    }

    //Y.log('urls = ' + urls + ' in ligth','info','ww');

    // @todo 如果页面中同一个wwid出现多次，可以考虑在代码中去重，需要重新设计对应关系 
   
    Y.Get.script(urls,{
      onSuccess : function(o){
        var nodes = o.data, handler, NodeBody, bFlag, 
            DOM = Y.DOM,
            UA = Y.UA,
            SMALL = '-small',
            MOBILE = '-mobile',
            ONLINE = '-online',
            styleId = 'k2-inline-style',
            //styleNode,
            //styleEl,
            //styleSheets,
            //styleSheet,
            ss,
            flag = 'data-ww-flag';
        //Y.log('nodes = ' + nodes + ' in Y.Get.Script.onSuccess','info','ww');    

        //创建一个全局的行内样式，所有的K2组件添加行内样式应该都利用同一个样式标签
        //@todo 为StyleSheet写一个K2的组件，便于共享通用的全局行内样式标签，否则在IE中有潜在风险
        //      利用自身标签进行判断重复加载、CSS HACH支持，以及共享方面不够

        NodeBody = Y.one('body');

        if(NodeBody.hasAttribute(flag)){
          bFlag = true;  
        }else{
          Y.StyleSheet('.k2-ww{' +
					    //'display:-moz-inline-stack;' + 
					    'display:inline-block;' +  
					    //'*display:inline;' +
					    //'zoom:1;' +
					    ((UA.ie < 8) ? '*display:inline;zoom:1;' : '') +  //StyleSheet中*display会被识别，导致其样式失效
					    //'position:relative;' +//Firefox下不可被点击问题，回头确认一下Firefox3是否还存在
					    //'*position:static;' +//上一句导致IE6下的bug
					    ((UA.gecko && UA.gecko < 1.91) ? 'display:-moz-inline-stack;position:relative;' : '') +  //减少HACK
					    'height:20px;' +
					    'width:67px;' +
					    'background:url(http://a.tbcdn.cn/sys/wangwang/wangwang_v2.gif) no-repeat 0 -20px;' +
					    'vertical-align:middle;' +
					    'cursor:pointer;' +
					    'text-indent:-9999px;' +
					    'font-size:12px;' +
					  '}' +
					  '.k2-ww-small{' +
					    'width:20px;' +
					    'background-position:-82px -20px;' +  
					  '}' +
					  '.k2-ww-online{' +
					    'background-position:0 0;' + 
					  '}' +
					  '.k2-ww-mobile{' +
					    'background-position:0 -40px;' + 
					  '}' +
					  '.k2-ww-small-online{' +
					    'background-position:-82px 0px;' + 
					  '}' +
					  '.k2-ww-small-mobile{' +
					    'background-position:-82px -40px;' + 
					  '}');
          //设置flag，标识旺旺样式和点击事情已添加
          NodeBody.setAttribute(flag,1);
        }
        /*
        ss = Y.StyleSheet(styleId);
        ss.set('.k2-ww',{
          display : '-moz-inline-stack',
          display : 'inline-block';
          '*display' : 'inline';  
        });
        alert(ss.getCssText('.k2-ww'));
        
        if(!DOM.inDoc(styleId)){
         //IE下报错
         //Y.one('head').append('<style title="'+ styleId + '" id="' + styleId + '"></style>');
         styleEl = document.createElement('style');
         styleEl.title = styleId; 
         styleEl.id = styleId; 
         Y.one('head').append(styleEl);
        }

        styleNode = Y.one('#' + styleId);
        //如果#k2-inline-style中已经存在data-ww-flag属性，
        //那么就说明已经在该页面中添加了旺旺的样式和点击的事件
        if(styleNode.hasAttribute(flag)){
          bFlag = true; 
        }else{
          //添加旺旺点灯的样式
          //http://www.quirksmode.org/dom/changess.html
          //http://msdn.microsoft.com/en-us/library/ms531200.aspx
          //styleSheets = WIN.document.styleSheets;
          
          //仅IE支持
          //styleSheets = WIN.document.styleSheets[styleId];

          //alert(styleSheets);
          //for(var n = styleSheets.length - 1; n > -1; --n){
            //Y.log(styleSheets[n].id); //Firefox下不支持id 
            //if(styleSheets[n].title === styleId){
              //styleSheet = styleSheets[n];    
              //break;
            //}
          //}
          //styleSheet.cssText += 'body{background:#000;}';

          //sheet  = Y.StyleSheet('#' + styleId,styleId);
          //sheet.set('body',{'backgroundColor':'#000'});
          //Y.StyleSheet(styleId).set('strong',{'font-weight':'normal'});
          //sheet = Y.StyleSheet('body{background:#ccc;}',styleId);
          //sheet = Y.StyleSheet(styleId);
          //sheet.set("body",{fontSize:"20px"});
          //sheet.set("body",{backgroundColor:"#000000"});
          //sheet.set("body",{color:"red"});

          //设置flag，标识旺旺样式和点击事情已添加
          styleNode.setAttribute(flag,1); 
        }
        */

        //对每个旺旺节点进行点灯处理
        // 0表示离线，1表示在线，4和5表示移动在线
        YArray.each(nodes,function(node,i){
          var wwSmall = CN + SMALL,
              wwOnline,wwMobile;
          if(node.hasClass(wwSmall)){
            wwOnline = wwSmall + ONLINE;
            wwMobile = wwSmall + MOBILE;    
          }else{
            wwOnline = CN + ONLINE;
            wwMobile = CN + MOBILE;  
          }
          //Y.log('wwOnline : ' + wwOnline + ' ; wwMobile = ' + wwMobile ,'info','k2-ww');
          switch(online[i]){
            case 1:
              //Y.log('node : ' + node + ' in switch wwOnline[i]','info','k2-ww');
              node.replaceClass(wwMobile,wwOnline);
              node.append('阿里旺旺在线');
              node.setAttribute('title',node.getAttribute(ID));
            break;
            case 4:
            case 5:
              node.replaceClass(wwOnline,wwMobile);
              node.append('阿里手机旺旺在线');
            break;   
            default:
              node.removeClass(wwOnline);
              node.removeClass(wwMobile);
              node.append('阿里旺旺离线');
            break;
          }
          node.setAttribute('title','通过阿里旺旺和“' + node.getAttribute(ID) + '”进行交流');
        });

        //采用代理模式在document.body上绑定点击事件
        handler = function(e){
          var node = e.currentTarget,
              showErrMsg = function(n){
                var s = ',请下载最新版阿里旺旺';
                switch(n){
                  case 1:
                    alert('版本过旧' + s);
                  break; 
                  case 2:
                    alert('您的阿里旺旺版本有问题' + s);
                  break;
                  default:
                    alert('您没有安装阿里旺旺' + s);
                  break; 
                }   
                WIN.target = "_blank";
                WIN.open(DOWNLOAD_URL);
              };
          //Y.log('e.currentTarget.getAttribute(ID) = ' + node.getAttribute(ID),'info','ww');

          //基于http://www.im.alisoft.com/webim/js/website.source.js，适当修改
          //相关说明也可以参考_source
          var sendClientMsg = function(id){
            //判断旺旺的安装状态 
            var checkWwStat = function(id){ //{{{
	            var stat = -1,
                  longId = SITE + id,
                  ver,
	                wwx,
                  wwo;
	            //判断旺旺6.0是否启动  
	            try{
	               wwx = new ActiveXObject('aliimx.wangwangx'); 
	               if(wwx !== null){
	                stat = 1;  
	               }
                 if(wwx.IsLogin(longid) === 'true'){
                  return 1;  
                 }
	            }catch(e){}

              try{
                 wwo = new ActiveXObject('WangWangX.WangWangObj');
                 if(wwo !== null){
                  ver = wwo.GetVersionStr();   
                  if(ver !== null){
                    return 0;  
                  }else if(stat === 1){
                    return 1;  
                  }else{
                    showErrMsg(1);
                  }
                 }else{
                   if(stat === 1){
                    return 1;  
                   }else{
                    showErrMsg();
                   } 
                 }

              }catch(e){
                if(stat === 1){
                  return 1;  
                }else{
                  showErrMsg(2);
                }
              }

              return stat;

            };
            //}}}
           if(UA.ie){ 
	           var stat = checkWwStat(id);
	           //Y.log('stat = ' + stat,'info','ww');
	           if(stat === 1){
	            location = "aliim:sendmsg?touid="+ SITE + id + "&siteid=" + SITE; 
	           }else if(stat === 0){
	            location.href = "wangwang:SendIM?uid="+ id +"&tositeid=" + SITE;
	           }
           }else{
              WIN.open(_getWebWwUrl(id));
           }
          };

          sendClientMsg(node.getAttribute(ID));
           
		    };

        //@todo 是否存在多次添加事件问题,采用标识符来判定，但这样很不优雅
        if(!bFlag){
          Y.delegate('click',handler,BODY,'.k2-ww');
        }
      },
      data : nodes  
    });
    
    
    //Y.log(ID);
    //ids = nodes.getAttribute(ID);      

	  //Y.log(ids,'info','ww');
	};

  /**
   * 打通Web页和旺旺客户端 
   * @Class Ww
   */
  Y.Ww = {
    light : light  
  };
},'1.0.0',{requires:['node-base','node-event-delegate','stylesheet']});
