/*!
 * @revision:
 */
/*
 * @author:
 * @version:1-0-2
 */

YUI.add('k2-MSlider',function(Y){

  Y.log('done','info','k2-MSlider');
  /**
   * 全站通用弹出层
   * @module:popup
   */
  var _N = Y.Node,_D = Y.DOM,_E=Y.Event,that,myAnim;

  /**
   * popup组件定义的构造类
   * @method Popup
   * @param Object config pop组件构造的配置项
   * @private
   */
  var MSlider = function(config){
		Y.log(arguments);
        MSlider.superclass.constructor.apply(this, arguments);
  }

  //继承自Base，所需要定义的NAME属性
  MSlider.NAME = 'mSlider';
  
  //继承自Base，所需要定义的ATTRS属性
  MSlider.ATTRS = {
    'containerId':{
      value:'slider'
    },
    'preBtnId':{
      value:null
    },
    'nextBtnId':{
      value:null
    },
    'startSpeed':{
      value:100
    },
    'time':{
       value:300
    },
    'distance':{
       value:300
    },
    '_acceleratedSpeed':{
      value:10
    },/*滚动的加速度*/
    /*现在的位置*/
    '_nowPos':{
        value:[]
    },
    /*开始的位置*/
    '_startPos':{
        value:[]
    },
     /*结束的位置*/
    '_endPos':{
        value:[]
    },
    'contentSize':{
        value:0
    },
    'type':{
        value:1    
    },
    'wrapId':{
        value:""
    }

    

  };
 
  Y.extend(MSlider, Y.Base,{
    initializer:function(cfg){
        var acceleratedSpeed,containerDom,vRegion,wrapDom;
            that=this;
            this.set("containerId",cfg.containerId||"");
            this.set("wrapId",cfg.wrapId||"");
            this.set("preBtnId",cfg.preBtnId||"");
            this.set("nextBtnId",cfg.nextBtnId||"");
            this.set("startSpeed",cfg.startSpeed||"");
            this.set("time",cfg.time||"");
            this.set("distance",cfg.distance||"");
            this.set("type",cfg.type||1);

            containerDom=Y.one("#"+cfg.containerId);
            wrapDom=Y.one("#"+cfg.wrapId);
            containerDom.setStyle("position","relative");
            vRegion=containerDom.get("viewportRegion");
            
            this.set("_nowPos",[vRegion.left,vRegion.top]);
            if(cfg.type==1){
                 containerDom.setStyle("left",0);
                 this.set("contentSize",parseInt(wrapDom.getStyle("width")));
            }else{
                 this.set("contentSize",parseInt(wrapDom.getStyle("height")));
            }
            Y.on("gesturemovestart",this._getStart,containerDom,{"minTime":1000});
            Y.on("gesturemove",this._getMove,containerDom,{"root":containerDom});
            //Y.on("gesturemoveend",this._getEnd,containerDom,{"root":containerDom});
            Y.on("click",this._preFun,Y.one("#"+cfg.preBtnId));
            Y.on("click",this._nextFun,Y.one("#"+cfg.nextBtnId));




    },
   _getAcceleratedSpeed:function(){},
   _preFun:function(){
        var width=parseInt(that.get("contentSize")),k,L,myAnima,contentDom=Y.one("#"+that.get("containerId")),wrapDom=Y.one("#"+that.get("wrapId"));
        myAnima=new Y.Anim({
                "node":contentDom,
                "to":{
                    left:function(){
                         L=contentDom.getStyle("left");
                        if(parseInt(L)<=0){return 0;}
                        return (parseInt(L)+width);
                    }
                }
        });
       myAnima.run();
            
    
    },
   _nextFun:function(){
         var width=that.get("contentSize"),myAnimb,contentDom=Y.one("#"+that.get("containerId")),wrapDom=Y.one("#"+that.get("wrapId")),L;
         myAnimb=new Y.Anim({
                "node":contentDom,
                "to":{
                    left:function(){
                        L=contentDom.getStyle("left");
                        if(parseInt(wrapDom.getStyle("width"))-parseInt(L)>=parseInt(contentDom.getStyle("width"))){return 0;}
                        return parseInt(L)-width;
                    }
                }
         });
         myAnimb.run();
    
    
    },
   _getStart:function(e){
        var startX,startY;
        startX=e.clientX;
        startY=e.clientY;
        that.set("_startPos",[startX,startY]);
        
    },
    _getMove:function(e){
        var endPos=[];
        endPos[0]=e.clientX;
        endPos[1]=e.clientY;
        that.set("_endPos",endPos);
        that._dealAnim();
    },
    _getEnd:function(){
         containerDom=Y.one("#"+cfg.containerId);
         vRegion=containerDom.get("viewportRegion");
         that.set("_nowPos",[vRegion.left,vRegion.top]);
    
    },
    _dealAnim:function(){
        var pos=[],startPos=that.get("_startPos"),itemNum=0,nextW=0,wrapW=parseInt(Y.one("#"+that.get("wrapId")).getStyle("width")),endPos=that.get("_endPos"),nowPos=that.get("_nowPos"),myAnim,L=parseInt(Y.one("#"+that.get("containerId")).getStyle("width"));
        if(this.get("type")==1){
             itemNum=parseInt((endPos[0]-startPos[0])/wrapW);
             if((endPos[0]-startPos[0])>0&&itemNum==0){itemNum=1}
             else if((endPos[0]-startPos[0])<0&&itemNum==0){itemNum=-1}
             pos[0]=itemNum*wrapW+nowPos[0];
             //nowPos[0]=pos[0];
             if(pos[0]>0){pos[0]=0}
             else if(0-pos[0]>=L){
                 pos[0]=0-(L-wrapW);
             }
             myAnim=new Y.Anim({
                "node":Y.one("#"+that.get("containerId")),
                "to":{
                    left:pos[0]
                }
            });
            myAnim.on("end",function(){nowPos[0]=pos[0];});

           
        }else{
             pos[1]=endPos[1]-startPos[1]+nowPos[1];
             nowPos[1]=pos[1];
             myAnim=new Y.Anim({
                "node":Y.one("#"+that.get("containerId")),
                "to":{
                    top:pos[1]
                }
            });
            myAnim.on("end",function(){nowPos[1]=pos[1];});
            
        
        }
       myAnim.set('duration',1);
       
       myAnim.run();
    }
    
    });
    Y.MSlider=MSlider;
},'1.0.0',{requires:['event-move','anim','node']});
