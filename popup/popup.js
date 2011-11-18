/*!
 * @revision:
 */
/*
 * @author:zhanyan@taobao.com
 * @version:1-0-5
 */
YUI.add('k2-popup',function(Y){

  Y.log('done','info','k2-popup');
  /**
   * 全站通用弹出层
   * @module:popup
   */
  var _N = Y.Node,_D = Y.DOM;

  /**
   * popup组件定义的构造类
   * @method Popup
   * @param Object config pop组件构造的配置项
   * @private
   */
  var Popup = function(config){
    //Y.log(arguments);
    Popup.superclass.constructor.apply(this, arguments);
  }

  //继承自Base，所需要定义的NAME属性
  Popup.NAME = 'popup';
  
  //继承自Base，所需要定义的ATTRS属性
  Popup.ATTRS = {
    //全局配置对象
    '_config':{
      value:{
        cls : {
          frame: 'k2-popup-container',
          content : 'k2-popup-content',
          hidden : 'k2-popup-hidden',
          close : 'k2-popup-close',
          closed : 'k2-popup-closed',
          cancel: 'k2-popup-cancel',
          border:'k2-pop-border',
          dd:'k2-pop-dd',
          ok : 'k2-popup-ok',
          hbf: 'k2-popup-hbf',
          hd : 'k2-popup-hd',
          bd : 'k2-popup-bd',
          ft : 'k2-popup-ft'
        },
        sGlobalPrefix : 'Popup',
        sOk: '确定',
        sCancel : '取消',
        sCssSpriteSrc : 'http://k.kbcdn.com/global/popup/bg.png',
        sCssSpriteIe6Src : 'http://k.kbcdn.com/global/popup/bg.gif',
        //init的配置参数格式
        defInstCfg : {
          bCenter : true,
          bModal : true,
          bAutoAdjust : true,
          iTop : 0,
          iLeft : 0,
          iWidth : null,
          iHeight : null,
          bShowAfterInit : true,
          //感觉无必要
          vContent : '',
          sTitle : '',
          btnAlign:'right'
        }
      }
    },
    'idPrefix':{
      value:'stFog'
    },
    'ivDiv':{
      value:null
    },
    'frame':{
      value:null
    },
    'isIe6':{
      value:(Y.UA.ie == 6)
    },
    '_events':{
      value:{}
    },
    'active':{
      value:false
    },
    'isShare':{
      value:false
    }
  };

  Y.extend(Popup, Y.Base,{
    /**
     * 初始化popup对象
     * @构造,一个config对象
     * @param {object} config配置对象，放在最后
     * @config {string|dom|object} vContent popup的内容，可以是HTML片段或dom引用或者addEl方法需要的对象
     * @config {string} sTitle popup头，可以忽略
     * @config {function} onOk handler when ok button is clicked, receive an param of the Popup object
     * @config {function} onCancel handler when ok button is clicked, receive an param of the Popup object
     * @config {function} onClose handler when ok button is clicked, receive an param of the Popup object
     * @config {boolean} bModal this is a modal dialog or not
     * @config {boolean} bShowAfterInit 
     * @config {Node} ivDiv already ivDiv
     * @config {Node} frame already Frame
     */
    initializer:function(cfg){
      if(this.get('isIe6')){
        this.get('_config').sCssSpriteSrc = this.get('_config').sCssSpriteIe6Src;
      }
      //传入的参数模式(content,title,config)
      var _config = this.get('_config');
      
      //保存init配置
      _config.defInstCfg['sTitle'] = (cfg['sTitle'] != undefined)?cfg['sTitle']:'';
      _config.defInstCfg['vContent'] = (cfg['vContent'] != undefined)?cfg['vContent']:'';

      _config.defInstCfg['iHeight'] = (cfg['iHeight'] != undefined)?cfg['iHeight']:NaN;
      _config.defInstCfg['iWidth'] = (cfg['iWidth'] != undefined)?cfg['iWidth']:NaN;
      _config.defInstCfg['onOk'] = (cfg['onOk'] != undefined)?cfg['onOk']:true;
      _config.defInstCfg['onCancel'] = (cfg['onCancel'] != undefined)?cfg['onCancel']:true;
      _config.defInstCfg['onClose'] = (cfg['onClose'] != undefined)?cfg['onClose']:true;
      _config.defInstCfg['bModal'] = (cfg['bModal'] != undefined)?cfg['bModal']:true;
      _config.defInstCfg['bAutoAdjust'] = (cfg['bAutoAdjust'] != undefined)?cfg['bAutoAdjust']:true;
      _config.defInstCfg['bShowAfterInit'] = (cfg['bShowAfterInit'] != undefined)?cfg['bShowAfterInit']:true;

      //控制底部按钮的水平位置
      _config.defInstCfg['btnAlign'] = (cfg['btnAlign'] != undefined)?cfg['btnAlign']:'right';
      _config['sOk'] = (cfg['sOk'] != undefined)?cfg['sOk']:'确定';
      _config['sCancel'] = (cfg['sCancel'] != undefined)?cfg['sCancel']:'取消';
      //可以传入已有的ivDiv
      if(cfg['ivDiv'] != undefined){
        this.set('ivDiv',cfg['ivDiv']);
      }else{
        this.set('ivDiv',this._addIvDiv());
      }

      //可以传入已有的Frame
      if(cfg['frame']){
        this.set('frame',cfg['frame']);
      }else{
        this.set('frame',this._creatFrame());
      }
      
      this._createHeadFoot();

      this.setTitle(_config.defInstCfg['sTitle']);
      this.setContent(_config.defInstCfg['vContent']);
      
      if(cfg['iWidth'] != undefined && cfg['iHeight'] != undefined){
        var fn = function(){this.setSize(Math.round(cfg['iWidth']),Math.round(cfg['iHeight']));};
        if (this.get('isIe6')) {
          Y.later(0,this,fn);
        } else {
          fn.apply(this);
        }
      }

      this._addDdEvent();
      this._addCustomEvent();

      //show
      if(_config.defInstCfg['bShowAfterInit']){
        this.show();
      }

      //this._remIvDiv();
    },
    /**
     * 创建遮挡层
     * @method _addIvDiv
     * @param
     * @private
     */
    _addIvDiv:(function() {
      var fn = function() {
        var id = this.get('idPrefix') + Y.guid();

        var newDiv = _N.create('<div><table border="0" style="background:transparent;left:0px;top:0px;"><tr><td><div>&nbsp;</div></td></tr></table></div>');
        newDiv.setAttribute('id',id);
        newDiv.setAttribute('className','ivDiv');
        newDiv.setStyles({'display':'none','position':'absolute','top':'0','left':'0','backgroundColor':'#fff','opacity':'0.8','filter':'alpha(opacity=80)'});

        var pageXY = [_D.docHeight(),_D.docWidth()];

        newDiv.oldBodyHeight = document.body.style.height;

        if (this.get('isIe6')) {
          newDiv.prepend('<iframe style="filter:alpha(opacity=0);position:absolute;top:0px;left:0;z-index:-1;" frameborder="0"></iframe>');
          newDiv.one('IFRAME').setStyle('height', pageXY[0] + 'px');
          newDiv.one('IFRAME').setStyle('width', pageXY[1] + 'px');
        }
        newDiv.setStyle('height', pageXY[0] + 'px');
        newDiv.setStyle('width', pageXY[1] + 'px');
        //z-index的控制
        //newDiv.setStyle('zIndex', ++k2.cfg.topLayer);
        newDiv.setStyle('zIndex',2100000000);
        Y.one('body').append(newDiv);
        //注册resize事件
        Y.on("resize",arguments.callee.ajSize, window,this,newDiv);
        return newDiv;
      };

      fn.ajSize = function (ev, div) {
        this._justivDiv();
        /*
        div.setStyle('height', 'auto');
        div.setStyle('width', 'auto');
        var fixfn = function(){
          var xy = [_D.docHeight(), _D.docWidth()];
          div.setStyle('height', xy[0] + 'px');
          div.setStyle('width', xy[1] + 'px');
          if(Y.UA.ie == 6){
            div.one('IFRAME').setStyle('width', 'auto');
            div.one('IFRAME').setStyle('height', 'auto');
            div.one('IFRAME').setStyle('width', xy[0] + 'px');
            div.one('IFRAME').setStyle('height', xy[1] + 'px');
          }
        }
        //修复IE6下auto无法马上恢复的问题
        Y.later(0.1,this,fixfn);
        */
      };
      return fn;
    })(),
    /**
     * 删除遮挡层
     * @method _remIvDiv
     * @param
     * @private
     */
    _remIvDiv:function(){
      var addfn = this._addIvDiv;
      //z-index的控制
      //k2.cfg.topLayer--;
      Y.detach("resize", addfn.ajSize, window);
      this.get('ivDiv').remove();
      this.get('ivDiv').destroy(true);
    },
    /**
     * 创建popup的frame
     * @method _creatFrame
     * @param
     * @private
     */
    _creatFrame:function(){
      var _config = this.get('_config');
      var w = _config.defInstCfg.iWidth,h = _config.defInstCfg.iHeight;
      var isIe6 = this.get('isIe6');
      var hd = _config.cls.hd,bd = _config.cls.bd;
      var yes = _config.defInstCfg.onOk !== false ? '' : 'display:none;',no = _config.defInstCfg.onCancel !== false ? '' : 'display:none;';
      var closeYN = _config.defInstCfg.onClose !== false ? 'display:block;' : 'display:none;';

      var ie6filter = isIe6 ? 'filter:alpha(opacity=65);' : '';
      //frame圆角部分
      var corner = _N.create('<div style="width:20px;height:20px;overflow:hidden;position:absolute;"><img class="' + _config.cls.dd + '" style="position:absolute;-moz-user-select:none;cursor:move;' + ie6filter + '" src="' + _config.sCssSpriteSrc +'" /></div>');
      var corners = [];
      //水平边框
      var xmid1 = _N.create('<div class="' + _config.cls.border + '" style="width:' + (w - 40) + 'px;height:20px;overflow:hidden;position:absolute;left:20px;"><img class="' + _config.cls.dd + '" style="position:absolute;left:-20px;-moz-user-select:none;cursor:move;' + ie6filter + '" src="' + _config.sCssSpriteSrc +'" /></div>');
      var xmid2;
      //垂直边框
      var ymid1 = _N.create('<div class="' + _config.cls.dd + ' ' +  _config.cls.border  + '" style="width:20px;height:' + (h - 40) + 'px;overflow:hidden;position:absolute;top:20px;background:transparent url(' + _config.sCssSpriteSrc + ') repeat-y -1220px 0px;-moz-user-select:none;cursor:move;' + ie6filter + '"></div>');
      var ymid2;
      
      var btn = _N.create('<div style="width:26px;height:26px;position:absolute;top:5px;right:5px;filter:alpha(opacity=100)"><a href="#" class="' + _config.cls.close + '" style="height:26px;width:26px;' + closeYN + '"></a></div>');

      for (var i=0, newobj;i<4;i++) {
        corners[corners.length] = corner.cloneNode(true);
      }
      corners[0].setStyle('top','0');
      corners[0].setStyle('left','0');
      corners[0].one('IMG').setStyle('top','0');
      corners[0].one('IMG').setStyle('left','0');

      corners[1].setStyle('top','0');
      corners[1].setStyle('right','0');
      corners[1].one('IMG').setStyle('top','0');
      corners[1].one('IMG').setStyle('left','-1184px');

      corners[2].setStyle('bottom','0');
      corners[2].setStyle('left','0');
      corners[2].one('IMG').setStyle('top','-20px');
      corners[2].one('IMG').setStyle('left','0');

      corners[3].setStyle('bottom','0');
      corners[3].setStyle('right','0');
      corners[3].one('IMG').setStyle('top','-20px');
      corners[3].one('IMG').setStyle('left','-1184px');

      xmid2 = xmid1.cloneNode(true);
      xmid1.setStyle('top','0');
      xmid1.one('IMG').setStyle('top','0');

      xmid2.setStyle('bottom','0');
      xmid2.one('IMG').setStyle('top','-20px');

      ymid2 = ymid1.cloneNode(true);
      ymid1.setStyle('left','0');
      ymid2.setStyle('right','0');
      ymid2.setStyle('backgroundPosition','-1260px 0');
      

      //测试需要
      var fr = _N.create('<div style="position:absolute;width:'+ w +'px;height:'+ h +'px;display:none;z-index:2140000000;"></div>');
      //var fr = _N.create('<div style="position:absolute;width:'+ w +'px;height:'+ h +'px;display:none;"></div>');
      fr.append(xmid1).append(xmid2).append(ymid1).append(ymid2).append(corners[0]).append(corners[1]).append(corners[2]).append(corners[3]).append(btn);

      //需要每个对象都重新设置的元素

      //Frame内容容器
      var content = _N.create('<div class="' + _config.cls.hbf + '" style="' + 'background:#F6F8FF;position:absolute;top:20px;left:20px;width:'+ (w - 52) +'px;height:'+ (h - 52) +'px;text-align:left;padding:6px;filter:alpha(opacity=100);' + '"></div>');
      
      //_config.defInstCfg['btnAlign']属性在共用时有问题
      var cotentFt = _N.create('<div class="' + _config.cls.ft +'" style="position:absolute;bottom:0px;right:0px;width:100%;text-align:' + _config.defInstCfg['btnAlign'] + '"></div>');
      cotentFt.append('<a href="#" class="k2-btn k2-btn-style-b k2-btn-m ' + _config.cls.ok + '" style="margin-right:10px;margin-bottom:1px;' + yes + '"><i></i><s>' + _config.sOk + '</s><b></b></a>');
      cotentFt.append('<a href="#" class="k2-btn k2-btn-style-c k2-btn-m ' + _config.cls.cancel + '" style="margin-right:10px;margin-bottom:1px;' + no + '"><i></i><s>' + _config.sCancel + '</s><b></b></a>');

      content.append('<div class="' + hd +' "></div>').append('<div class="' + bd +' "></div>').append(cotentFt);
      content = _N.create('<div class="' + _config.cls.content + '" style="' + 'position:relative;width:'+ w +'px;height:'+ h +'px;top:0px;left:0;' + '"></div>').append(content);
      
      fr.prepend(content);

      if(isIe6){
        fr.prepend('<iframe style="position:absolute;top:0;left:0;z-index:-1;filter:alpha(opacity=0);width:'+ w + 'px;height:'+ h +'px;background:#fff;" frameborder="0"></iframe>');
      }

      Y.one('body').append(fr);

      return fr;
    },
    /**
     * 创建popup的Head和Foot的frame，因为每个对象都不一样，仅仅复用外框即可
     * @method _createHeadFoot
     * @param
     * @private
     */
    _createHeadFoot:function(){
      
    },
    /**
     * 注册DD事件
     * @method _addDdEvent
     * @param
     * @private
     */
    _addDdEvent:function(obj) {
      var frame = this.get('frame');
      var _config = this.get('_config');
      //只支持边框的拖放
      frame.plug(Y.Plugin.Drag);
      var handle = frame.dd.addHandle('.' + _config.cls.dd);
      handle.addToGroup('pop');
      //拖放时的半透明效果
      frame.all('.' + _config.cls.dd).on('pop|mousedown',function(ev){
        frame.setStyle('opacity','0.4');
      });
      frame.all('.' + _config.cls.dd).on('pop|mouseup',function(ev){
        if(Y.UA.ie >= 6){
          var frameDom = _N.getDOMNode(frame);
          var temp = frameDom.style.cssText.replace(/FILTER:\s{0,}alpha\(.{0,}\);/i,'');
          frameDom.style.cssText = temp;
        }else{
          frame.setStyle('opacity','1');
        }
      });
      handle.on('pop|drag:end',function(ev){
        if(Y.UA.ie >= 6){
          var frameDom = _N.getDOMNode(frame);
          var temp = frameDom.style.cssText.replace(/FILTER:\s{0,}alpha\(.{0,}\);/i,'');
          frameDom.style.cssText = temp;
        }else{
          frame.setStyle('opacity','1');
        }
      });
      //不保存注册事件对象
    },
    /**
     * 注册自定义事件
     * @method _addCustomEvent
     * @param
     * @private
     */
    _addCustomEvent:function(){
      var frame = this.get('frame'),_config = this.get('_config');
      var ye = this.get('_events');
      var yy = ye.yui = [];
      //创建了3种自定义事件
      yy['onOk'] = this.publish('ok',{'defaultFn':function(){this.hide();},emitFacade:true});
      yy['onCancel'] = this.publish('cancel',{'defaultFn':function(){this.hide();},emitFacade:true});
      yy['onClose'] = this.publish('close',{'defaultFn':function(){this.hide();},emitFacade:true});
      yy['onShow'] = this.publish('show',{'defaultFn':function(){},emitFacade:true});
      //将自定义事件绑定到Dom节点上
      frame.one('a.' + _config.cls.ok).on('click',function(ev){
        //是否在active状态的判断
        if(this.get('active')){
          ev.preventDefault();
          if(typeof this.get('_config').defInstCfg.onOk == 'function'){
            this.get('_config').defInstCfg.onOk.call(window,this);
          }
          this.get('_events').yui['onOk'].fire();
        }
      },this);
      frame.one('a.' + _config.cls.cancel).on('click',function(ev){
        if(this.get('active')){
          ev.preventDefault();
          if(typeof this.get('_config').defInstCfg.onCancel == 'function'){
            this.get('_config').defInstCfg.onCancel.call(window,this);
          }
          this.get('_events').yui['onCancel'].fire();
        }
      },this);
      frame.one('a.' + _config.cls.close).on('click',function(ev){
        if(this.get('active')){
          ev.preventDefault();
          if(typeof this.get('_config').defInstCfg.onClose == 'function'){
            this.get('_config').defInstCfg.onClose.call(window,this);
          }
          this.get('_events').yui['onClose'].fire();
        }
      },this);
    },
    /**
     * 设置pop位置
     * @method _setPosition
     * @param
     * @private
     */
    _setPosition:function(position){
      var frame = this.get('frame');
      var _config = this.get('_config');
      //该方法原来定义在util中
      _setCenter = function(el) {
        var wXY = [_D.winWidth(), _D.winHeight()],
          sXY = [_D.docScrollX(), _D.docScrollY()],
          w = el.get('offsetWidth') || el.get('clientWidth') || parseInt(el.get('width'));
          h = el.get('offsetHeight') || el.get('clientHeight') || parseInt(el.get('height'));
        
        h = isNaN(h)?0:h;
        w = isNaN(w)?0:w;
        el.setStyle('position','absolute');
        el.setStyle('left',(wXY[0] - w) / 2 + sXY[0] + 'px');
        var top  = (wXY[1] - h) / 2 + sXY[1];
        el.setStyle('top',(top < 50 ? 50 : top) + 'px');
      }
      if (Y.Lang.isArray(position)) {
        frame.setXY(position);
      } else if (_config.defInstCfg.bCenter) {
        _setCenter(frame);
      } else {
        frame.setXY([_config.defInstCfg.iLeft,_config.defInstCfg.iTop]);
      }
    },
    /**
     * 调整遮挡层大小
     * @method setTitle
     * @param
     * @public
     */
    _justivDiv:function(){
      var div = this.get('ivDiv');
      div.setStyle('height', 'auto');
      div.setStyle('width', 'auto');
      var fixfn = function(){
        var xy = [_D.docHeight(), _D.docWidth()];
        div.setStyle('height', xy[0] + 'px');
        div.setStyle('width', xy[1] + 'px');
        if(Y.UA.ie == 6){
          div.one('IFRAME').setStyle('width', 'auto');
          div.one('IFRAME').setStyle('height', 'auto');
          div.one('IFRAME').setStyle('width', xy[0] + 'px');
          div.one('IFRAME').setStyle('height', xy[1] + 'px');
        }
      }
      //修复IE6下auto无法马上恢复的问题
      Y.later(0.1,this,fixfn);
    },
    /**
     * 设置pop标题
     * @method setTitle
     * @param
     * @public
     */
    setTitle:function(stitle){
      stitle = String(stitle);
      var frame = this.get('frame');
      var _config = this.get('_config');
      var hd = frame.one('.' + _config.cls.hd);
      hd.setContent('');
      if(stitle == ''){
        hd.setStyle('display','none');
      }else{
        hd.setStyle('display','block');
        hd.setStyle('borderBottom','2px solid #E1E8F2');
        hd.prepend('<h3 style="font-size:16px;padding:0 0 2px 10px;font-weight:bold;">' + stitle +'</h3>');
      }
      _config.defInstCfg['sTitle'] = stitle;
    },
    /**
     * 设置pop内容
     * @method setContent
     * @param
     * @public
     */
    setContent:function(ct, doadjust){
      doadjust = doadjust === false ? false : true;
      var _L = Y.Lang,frame = this.get('frame'),_config = this.get('_config');
      var body = frame.one('.' + _config.cls.bd);
      //这里是否需要对所有子节点调用destroy方法？？
      body.setContent('');

      //该方法原来定义在util中
      var _isNode = function(obj, strict) {
        return _L.isObject(obj) && ((!strict && (obj===window || obj===document)) ||
          obj.nodeType == 1);
      }

      var fn = function() {
        //HTML片段
        if (_L.isString(ct)) {
          body.prepend(ct);
        //Dom节点(暂不支持Node和css选择器)
        } else if (_isNode(ct)) {
          body.prepend(Y.one(ct));
        //addEL构造Dom对象（Error）
        } else if(ct instanceof Y.Node){
          body.prepend(ct);
        } else if (_L.isObject(ct)) {
          body.setContent('');
          //body.prepend();
          //_u.addEl(ct, that.body);
        }
        //只为外部调用服务
        if(doadjust && _config.defInstCfg.bAutoAdjust){
          this.setSize();
          _config.defInstCfg.iWidth = NaN;
          _config.defInstCfg.iHeight = NaN;
        }
      };

      // fix the "iframe did not show" bug in ie 6
      if (this.get('isIe6')) {
        Y.later(0,this,fn);
      } else {
        fn.apply(this);
      }
    },
    /**
     * 设置pop高度和宽度的方法
     * @method _addCustomEvent
     * @param {number} w 设置的宽度
     * @param {number} h 设置的高度
     * @public
     */
    setSize:function(w, h){
      var sw = function(el,w){el.setStyle('width',w + 'px');},
      sh = function(el, h){el.setStyle('height',h + 'px');},
      sl = function(el, l){el.setStyle('left',l + 'px');};
      
      var isNumber = Y.Lang.isNumber;
      var _config = this.get('_config');
      var fr = this.get('frame'),bd = fr.one('.' + _config.cls.bd),hd = fr.one('.' + _config.cls.hd);
      if(!isNumber(w)){
        w = bd.get('offsetWidth') || bd.get('clientWidth') || parseInt(bd.get('width'));
        if(isNumber(w)) {
          //52 = frame border and padding
          w += 52;
        }
      }

      if(!isNumber(h)) {
        var h1 = bd.get('offsetHeight') || bd.get('clientHeight') || parseInt(bd.get('height'));
        var h2 = hd.get('offsetHeight') || hd.get('clientHeight') || parseInt(hd.get('height'));
        if(isNumber(h2)){
          h = h1 + h2;
        }else{
          h = h1;
        }
        if (isNumber(h)) {
          //52 = frame border and padding
          h += 52;
          //25 = ft button height
          if (_config.defInstCfg.onOk !== false || _config.defInstCfg.onCancel !== false ) {
            h += 25;
          }
        }
      }

      _config.defInstCfg['iHeight'] = (h == undefined)?NaN:h;
      _config.defInstCfg['iWidth'] = (w == undefined)?NaN:w;

      if (isNumber(w) && isNumber(h)) {
        if (this.get('isIe6') == true) {
          sw(fr.one('IFRAME'), w);
          sh(fr.one('IFRAME'), h);
        }
        sw(fr, w);
        sh(fr, h);
        sw(fr.one('.' + _config.cls.content), w);
        sh(fr.one('.' + _config.cls.content), h);
        sw(fr.one('.' + _config.cls.hbf), w - 52);
        sh(fr.one('.' + _config.cls.hbf), h - 52);

        //40 = frame border width
        var borders = fr.all('.' + _config.cls.border);
        sw(borders.item(0), w - 40);
        sw(borders.item(1), w - 40);
        sh(borders.item(2), h - 40);
        sh(borders.item(3), h - 40);
      }else{
        return false;
      }
    },
    /**
     * 显示/隐藏 iv div
     * @method _toggleIvDiv
     * @param {boolean} show true to show the iv div
     * @private
     */
    _toggleIvDiv:function(show){
      var _config = this.get('_config');
      if(show){
        if(_config.defInstCfg.bModal) {
          this.get('ivDiv').setStyle('display','block');
        }else{
          this.get('ivDiv').setStyle('display','none');
        }
      }else{
        this.get('ivDiv').setStyle('display','none');
      }
    },
    /**
     * 设置pop内容
     * @method show
     * @param
     * @public
     */
    show:function(position){
      var _config = this.get('_config');
      this._toggleIvDiv(true);
      var frame = this.get('frame'),_config = this.get('_config');
      var z = parseInt(frame.getStyle('zIndex'));
      //if (isNaN(z) || z <= k2.cfg.topLayer) {
        //++k2.cfg.topLayer
        frame.setStyle('zIndex',z++);
      //}
      this.get('frame').setStyle('display','block');
      
      //只有共享对象有重置问题
      if(this.get('isShare')){
        /*对每个对象的关闭按钮做判断*/
        if(_config.defInstCfg.onClose != false){
          frame.one('.' + _config.cls.close).setStyle('display','block');
        }else{
          frame.one('.' + _config.cls.close).setStyle('display','none');
        }
        
        /*对每个对象的头的处理*/
        this.setTitle(_config.defInstCfg['sTitle']);
        

        /*对每个对象的底部按钮的处理*/
        frame.one('.' + _config.cls.ft).setStyle('textAlign',_config.defInstCfg['btnAlign']);
        var okBtn = frame.one('.' + _config.cls.ok);
        var cancelBtn = frame.one('.' + _config.cls.cancel);
        if(_config.defInstCfg.onOk != false){
          okBtn.setStyle('display','inline-block');
          okBtn.one('s').setContent(_config.sOk);
        }else{
          okBtn.setStyle('display','none');
        }

        if(_config.defInstCfg.onCancel != false){
          cancelBtn.setStyle('display','inline-block');
          cancelBtn.one('s').setContent(_config.sCancel);
        }else{
          cancelBtn.setStyle('display','none');
        }
      }

      //设置大小
      if(isNaN(_config.defInstCfg.iWidth) && isNaN(_config.defInstCfg.iHeight)){
        _config.defInstCfg.bAutoAdjust && this.setSize();
      }
      this._justivDiv();
      this._setPosition(position);
      this.set('active',true);
      this.get('_events').yui['onShow'].fire();
    },
    /**
     * 隐藏pop frame和ivDiv
     * @public
     */
    hide : function() {
      var frame = this.get('frame');
      var _config = this.get('_config');
      frame.setStyle('display','none');
      frame.addClass( _config.cls.closed);
      this._toggleIvDiv(false);
      this.set('active',false);
    },
    /**
     * 关闭popup，与hide的差异是会触发close事件
     * @public
     */
    close:function(){
      this.hide();
      this.get('_events').yui['onClose'].fire();
    },
    destructor:function(){}

  });

/**
 * description
 * @class demo class name 
 */

/**
 * @method demo method name
 * @param ... 
 */
  Y.Popup = Popup;
  //Y.namespace("Popup").Popup = Popup;
  
  /**
   * 工厂方法
   *
   */
  var createPop = function(config){
    var pro = arguments.callee.prototype;
    var styleDom;
    if(pro.isStyle == false){
      if(Y.UA.ie >= 6){
        Y.StyleSheet('.k2-popup-close{background:transparent url("http://k.kbcdn.com/global/popup/bg.gif") no-repeat 0px -50px;}.k2-popup-close:hover {  background-position : -40px -50px;}');
        pro.isStyle = true;
      }else{
        Y.StyleSheet('.k2-popup-close{background:transparent url("http://k.kbcdn.com/global/popup/bg.png") no-repeat 0px -50px;}.k2-popup-close:hover {  background-position : -40px -50px;}');
        pro.isStyle = true;
      }
    }

    if(config.share == true){
      if(pro.frame == null || pro.ivDiv == null){
        var obj = new Popup(config);
        pro.frame = obj.get('frame');
        pro.ivDiv = obj.get('ivDiv');
      }else{
        config.frame = pro.frame;
        config.ivDiv = pro.ivDiv;
        var obj = new Popup(config);
      }
      obj.set('isShare',true);
      return obj;
    }else{
      return new Popup(config);
    }
  };
  createPop.prototype.isStyle = false;
  createPop.prototype.frame = null;
  createPop.prototype.ivDiv = null;
  Y.createPop = createPop;
},'1.0.0',{});
