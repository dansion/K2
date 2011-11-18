/*!
 * @revision:
 */

/**
 * @creator:zhanyan
 * @version:1-0-7
 */

YUI.add('k2-scrollfollow',function(Y){
  var _N = Y.Node,_D = Y.DOM;
  var k2Scrollfollow = function(config){
    k2Scrollfollow.superclass.constructor.apply(this, arguments);
  };

  //继承自Base，所需要定义的NAME属性
  k2Scrollfollow.NAME = 'scrollfollow';

  //继承自Base，所需要定义的ATTRS属性
  k2Scrollfollow.ATTRS = {
    'plhDom':{
      value:false
    },
    'WrapDom':{
      value:''
    },
    'anim':{
      value:"ie6"     //false:不使用动画;ie6:仅在ie6下显示动画 all:不管什么情况都使用动画
    },
    'switch':{
      value:false
    },
    'customPos':{
      value:null
    },
    'animObject':{
        value:null
    },
    'fixedCondition':{
        value:null
    },
    'refObj':{
        value:{x:"win",y:"win"}   //定位的参考位置,win:相对于窗口定位 doc:相对于文档定位
    },
    '_events':{
      value:{}
    }
  }

  Y.extend(k2Scrollfollow, Y.Base,{
    animTimer:null,    
    status:'normal',     //当前组件状态 normal:正常状态 fixed:固定
    ie:null,
    doc:null,
    bPos : null,
    rPos : null,
    isPositionResize : 0,
    defaultStyPos : {position:'static',top:0,left:0},   
    //初始化方法
    initializer:function(cfg){
      this.set('plhDom',cfg['placeholder']);
      this.set('WrapDom',cfg['wrap']);
      
      this.doc = _N.one('document');
      this.ie = Y.UA.ie;
      
      this.bPos = {x:0,y:0};
      this.rPos = {x:0,y:0};
      
      this._getDefaultStyPos();
      this._getPosition();
      this._addEvent();
      this._dealwithFn();
    },
    //自定义事件
    _addCustomEvent:function(){
    },
    //获取节点默认的定位信息
    _getDefaultStyPos: function(){
      var wrapDom = this.get('WrapDom'),
          position = wrapDom.getStyle("position"),
          left = wrapDom.getStyle("left"),
          top = wrapDom.getStyle("top");
      this.defaultStyPos = {position:position,left:left,top:top};
    },
    //获取元素初始时候相对于body的位置和相对于第一个非static的祖先节点的位置
    _getPosition:function(isSetTimeout){
      var that = this;
      if(that.ie && that.ie < 9){        
        that.isPositionResize = 2;
      } else {
        that.isPositionResize = 0;
      }
      if(that.status != "normal"){
        that._releaseFixed();
      }
            
      function getValues(){
        var n = that.get("WrapDom")._node,
            _doc = that.doc._node,
            pos = that._getXY(n),
            parent = n.parentNode,
            parentPos = {x:0,y:0};
        
        while(parent && parent.tagName.toLowerCase() !== "html"){
          //找到第一个相对定位或绝对定位的非body节点
          if(parent.style.position !== "" && parent.style.position != "static"){
              parentPos = that._getXY(parent);
              break;
          }
          parent = parent.parentNode;
        }
        
        that.bPos.x = pos.x;
        that.bPos.y = pos.y;
        
        that.rPos.x = pos.x - parentPos.x;
        that.rPos.y = pos.y - parentPos.y;
        
        if(that.status != "normal"){
          that._dealwithFn();
        }
      }
      
      //解决在ie6,7下设置了样式以后立即去获取样式取到的是设置前的样式的问题.
      if(isSetTimeout){
        setTimeout(getValues,0);
      } else {
        getValues();
      }
    },
    _getXY:function(n){
      var _doc = this.doc._node,
          scroll = {x:Y.DOM.docScrollX(),y:Y.DOM.docScrollY()};
      
      if(n.getBoundingClientRect){
          var box = n.getBoundingClientRect(); 
          return {
            x:box.left - (_doc.documentElement.clientLeft || _doc.body.clientLeft) + scroll.x,
            y:box.top - (_doc.documentElement.clientTop || _doc.body.clientTop) + scroll.y
          }
      } else {
        var pos = {x:n.offsetLeft,y:n.offsetTop};
          var oParent = n.offsetParent;
          while(oParent){
            pos.x += oParent.offsetLeft;
            pos.y += oParent.offsetTop;
            oParent = oParent.offsetParent;
          }
          return {x:pos.x,y:pos.y};
      }
    },
    //注册事件
    _addEvent:function(){
      var that = this;
      //滚动事件
      Y.on('scroll',function(ev){
        that._dealwithFn();
      });

      //调整窗口大小事件
      Y.on('resize',function(ev){
        //重新获取一次wrap的默认地址
        if(that.isPositionResize <= 0){
          //that._getPosition(true);
          //setTimeout 为了解决ie6,7下设置了样式以后立即获取的值为错误的问题
          setTimeout(function(){
            that._dealwithFn();
          },0);          
        } else {          
          that.isPositionResize--;
        }
      });
    },
    setSwitch:function(flag){
      this.set('switch',flag);
      this._dealwithFn();
    },
    _releaseFixed:function(){
      var wrapDom = this.get('WrapDom'),      
          anim = this.get("animObject");
      this.status = "normal";
      wrapDom.setStyles(this.defaultStyPos);
      if(anim != null){
          anim.stop();
      }
      this._removePlh();
    },
    _setPlhDom:function(){
      var plh = this.get('plhDom');
      if(!plh){
        return;
      }
      if(plh === true){
        //创建一个占位节点
          var wrapDom = this.get("WrapDom"),
              holder = Y.Node.create("<div />");
          
          holder.setStyles({width:wrapDom.getComputedStyle("width"),height:wrapDom.getComputedStyle("height"),visibility:"hidden"});
          holder.setStyles(this.defaultStyPos);
          wrapDom.insert(holder,"before");
          this.set("plhDom",holder);
          
          holder.setStyles({visibility:"visible"});
          
      } else if(typeof plh === "object"){
        //用户传入一个占位节点或占位节点已经存在
        plh.setStyle("display","block");
      }
      
    },
    _removePlh:function(){
      var plh = this.get('plhDom');
      if(plh  instanceof Y.Node){
        plh.setStyle("display","none");
      }
    },
    _anim:function(styles){
      var anim = this.get("animObject"),
          wrapDom = this.get("WrapDom"),
          that = this;
      if(!anim){
        anim = new Y.Anim({
            node : wrapDom,
            //easing : Y.Easing.easeOut,
            duration : 0.2,
            intervalTime : 33
        });
        this.set("animObject",anim);
      }
      anim.set("to",styles);
      
      if(this.animTimer !== null){
        clearTimeout(this.animTimer);
      }
      
      this.animTimer = setTimeout(function(){
        if(that.status != "normal"){
          anim.run();          
        }
        this.animTimer = null;
      },200);
    },
    _dealwithFn:function(){
      var that = this,
          doc = that.doc,
          plhDom = that.get('placeholder'),
          wrapDom = that.get('WrapDom'),
          bPos = that.bPos,
          rPos = that.rPos,
          custPos = that.get("customPos") || {},
          scrollX = Y.DOM.docScrollX(),
          scrollY = Y.DOM.docScrollY(),
          fnFixed = that.get('fixedCondition'),
          refObj = that.get('refObj');
      //如果开关是关闭状态则设置为正常状态,
      //或者fixedCondition返回false则设置为正常状态
      if( !that.get("switch") || (fnFixed && fnFixed(bPos.x,bPos.y,scrollX,scrollY) === false) ){
         if(that.status != "normal"){
            that._releaseFixed();
          }
      } else {
        var isAnim = (this.get("anim") == "all") || (that.ie == 6 && this.get("anim") == "ie6"),
            custTop = null,
            custLeft = null;
        for(var p in custPos){
          switch(p){
            case "top": custTop = custPos[p];
                break;
            case "right": custLeft = ( (refObj.x !== 'doc')?Y.DOM.winWidth():Y.DOM.docWidth() ) - custPos[p];
                break;
            case "bottom": custTop = ( (refObj.y !== 'doc')?Y.DOM.winHeight():Y.DOM.docHeight() ) - custPos[p];
                  break;
            case "left": custLeft = custPos[p];
                break;
          }
        }
        //设置占位元素    
        that._setPlhDom();
        if(!isAnim && that.ie != 6){
            var left = (custLeft === null? bPos.x:custLeft) - ((refObj.x === "doc")?scrollX:0),
                top = (custTop === null? bPos.y:custTop) - ((refObj.y === "doc")?scrollY:0);
            
            wrapDom.setStyles({'position':'fixed','left':left,'top':top});
        } else {
            left = rPos.x - ((custLeft !== null)?(bPos.x-custLeft):0) + ((refObj.x !== "doc")?scrollX:0);
            top = rPos.y - ((custTop !== null)?(bPos.y - custTop):0) + ((refObj.y !== "doc")?scrollY:0);
            
            wrapDom.setStyles({'position':'absolute'});
            //第一次执行的时候设置一下wrap的left和top
            if(that.status !== "fixed"){
              wrapDom.setStyles({'left':left,'top':top});
            }
            if(isAnim){
              this._anim({'left':left,'top':top});
            } else {
              wrapDom.setStyles({'left':left,'top':top});
            }
        }
        
        that.status = "fixed";
      }
    },
    //动态设置位置
    setPosition:function(obj){
      obj = obj || null;
      this.set('customPos',obj);
      this._dealwithFn();
    },
    destructor:function(){
    }
  });
  Y.k2Scrollfollow = k2Scrollfollow;
},'1.0.0',{requires:['node-base','node-style','dom-base',"dom-screen",'anim-base','event-base']});