 /*!
 * @revision:
 */
/*
 * @author:
 * @version:1-0-0
 */
/*option*/
YUI.add('k2-cdselector-step',function(Y){
    var _D = Y.DOM,_O=Y.Object,
    Cdselector_Step = function(){
        Cdselector_Step.superclass.constructor.apply(this, arguments);
    };
    Cdselector_Step.NAME="k2-cdselector-step";
    Y.extend(Cdselector_Step,Y.Cdselector_Base,{
        /*创建option，包括不限选项的添加*/
        _createOpt:function(nowlv,optAry,optxt,origin,ifstep){
            var j;Y.log(origin+"-"+nowlv);
               this._addNoLimit(nowlv,origin);/*设置不限选项*/
                /*创建option*/
               for(j=0;j<optAry.length;j++){
                   optDom=_D.create("<option value="+optAry[j]+">"+optxt[optAry[j]]+"</option>");
                   origin.appendChild(optDom);
               }
               if(ifstep){
                        this._addEv(Y.one(origin),nowlv,null);
                   }
        },
        /*创建顶级父节点 select*/
        _renderDom:function(){
                /*获得container节点*/
            var containerDom=Y.one("#"+this.get("containerId"));
        },
       /*初始化数据,节点*/
        _initData:function(){
            if(this.get("selectAry").length==0){
                this.set("ifSelect",0);
            }
            else{
                this.set("ifSelect",1);
            }
            this._createItem(0,0);/*创建节点*/
        },
        /*创建内容值*/
        _createItem:function(nowlv,key){
            var nowData=this.get("dataSource"),
                levelNum=this.get("levelCount"),
                origin,
                nextkey,
                childOrigin;
           /*当所创建的级数大于一共有的技术时返回，nowlv从0开始*/
           if(nowlv>=levelNum){return;}
           if(nowlv==0){
               optAry=(_O.values(nowData.level[nowlv]))[0];
           }else{
                optAry=nowData.level[nowlv][key];
           }
         //  this._clearContent(nowlv,levelNum,this.get("originDoms"));
           /*当存在该级内容是进行option创建，否则清空该select下的option值*/
           if(childOrigin){
                Y.one(childOrigin).setContent("");
           }
           if(optAry!==undefined){
               optxt=nowData.data;/*获得名次列表的对象*/
               var origin=Y.one(_D.create('<select class="'+this.get("_config").cls.sClassLCPrefix+nowlv+'"></select>'));
               this._createOpt(nowlv,optAry,optxt,origin);
               var containerDom=Y.one("#"+this.get("containerId"));
               containerDom.append(origin);
               this._addEv(Y.one(origin),nowlv,origin);
               /*调用select方法后处理*/
               if(this.get("ifSelect")==1){
                    Y.one(origin).set("value",this.get("selectAry")[nowlv]);
               }
               /*获得下一级的键值,如果select，则nextkey=select初始化的值，否则为select的第一个值*/
               nextkey = this.get("ifSelect")==1?this.get("selectAry")[nowlv]:Y.one(origin).get("children").item(0).get("value");
               nowlv++;
               if(nowlv>=levelNum){ return; }
               this._createItem(nowlv,nextkey);
            }else{
                this._addNoLimit(nowlv,origin);
                  nowlv++;
                  if(nowlv>=levelNum){ return; }
                this._createItem(nowlv,nextkey);
            }
            this._setJsonValue(nowlv);
        },
        
        
        /*注册联动事件*/
        _addEv:function(o,lv,origin){
            Y.on("change",this._selectChange,o,this,lv,origin);
        },
        /*联动事件*/
        _selectChange:function(e,lv,origin,ifselect,value){
            this.set("ifSelect",0);
            this.set("ckJsonValues",[]);
            var containerDom=Y.one("#"+this.get("containerId")),
            selectAry=containerDom.all("select"),i;
            for(i=lv+1;i<selectAry.size();i++){
                containerDom.removeChild(selectAry.item(i));
            }
            if(ifselect){
                 this.set("ifSelect",1);
                 this._createItem(lv+1,value);
            }else{
                this._createItem(lv+1,e.currentTarget.get("value"));
            }
            this._setJsonValue(lv);
         
        },
       
        /*设置json的value值*/
        _setJsonValue:function(lv){
            var containerDom=Y.one("#"+this.get("containerId")),
            selectAry=containerDom.all("select"),i,tpvalue=[];
            for(i=0;i<selectAry.size();i++){
                tpvalue[i]=selectAry.item(i).get("value");
            }
             Y.one(this.get("jsonDom")).set("value",tpvalue.join("-"));
             this._dealChange(lv,tpvalue);
        }
    });

    Y.Cdselector_Step=Cdselector_Step;
    

},'1.0.0',{requires:['k2-cdselector-base']});
