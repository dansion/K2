 /*!
 * @revision:
 */
/*
 * @author:
 * @version:1-0-5
 */
/*option*/
YUI.add('k2-cdselector',function(Y){
    var _D = Y.DOM,_O=Y.Object,
    Cdselector = function(){
        Cdselector.superclass.constructor.apply(this, arguments);
    };
    Cdselector.NAME="k2-cdselector";
    Y.extend(Cdselector,Y.Cdselector_Base,{
        /*渲染select的基础方法，以便之后其他方法的调用*/
        _renderBaseSelect:function(containerDom,loopSize){
                var originDom,i,d;
                /*创建select节点*/
                for(i=0;i<loopSize;i++){
                    originDom=_D.create('<select class="'+this.get("_config").cls.sClassLCPrefix+i+'"></select>');
                    containerDom.append(originDom);
                    /*是否添加不限选项*/
                    //this._addNoLimit(i,originDom);
                    d = this.get("originDoms");
                    d.push(originDom);
                    this.set("originDoms", d);
                     
                }
        
        },
        /*创建option，包括不限选项的添加*/
        _createOpt:function(nowlv,optAry,optxt,origin){
            var j;Y.log(origin+""+nowlv)
               this._addNoLimit(nowlv,origin);/*设置不限选项*/
                /*创建option*/
               for(j=0;j<optAry.length;j++){
                   optDom=_D.create("<option value="+optAry[j]+">"+optxt[optAry[j]]+"</option>");
                   origin.appendChild(optDom);
               }
        },
        /*创建顶级父节点 select*/
        _renderDom:function(){
                /*获得container节点*/
            var containerDom=Y.one("#"+this.get("containerId"));
            this._renderBaseSelect(containerDom,this.get("levelCount"));
        },
       /*初始化数据,节点*/
        _initData:function(){
            this._createItem(0,0);/*创建节点*/
            this._setJsonValue(0);/*设置json值*/
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
           /*获得该级的select节点*/
           origin=this.get("originDoms")[nowlv];
           /*获得下一级的select节点*/
           childOrigin=this.get("originDoms")[nowlv+1];
           /*通过级数，键值来获得该select下的option值*/
           if(nowlv==0){
               optAry=(_O.values(nowData.level[nowlv]))[0];
           }else{
                optAry=nowData.level[nowlv][key];
           }
           this._clearContent(nowlv,levelNum,this.get("originDoms"));
           /*当存在该级内容是进行option创建，否则清空该select下的option值*/
           
           if(optAry!==undefined){
               optxt=nowData.data;/*获得名次列表的对象*/
               this._createOpt(nowlv,optAry,optxt,origin);
               this._addEv(Y.one(origin),nowlv,childOrigin);
               /*调用select方法后处理*/
               if(this.get("ifSelect")==1){
                    Y.one(origin).set("value",this.get("selectKeyAry")[nowlv]);
               }
               /*获得下一级的键值,如果select，则nextkey=select初始化的值，否则为select的第一个值*/
               nextkey = this.get("ifSelect")==1?this.get("selectKeyAry")[nowlv]:Y.one(origin).get("children").item(0).get("value");
               nowlv++;
               if(nowlv>=levelNum){ return; }
               Y.one(childOrigin).setContent("");
               this._createItem(nowlv,nextkey);
            }else{
                this._addNoLimit(nowlv,origin);
                  nowlv++;
                  if(nowlv>=levelNum){ return; }
                this._createItem(nowlv,nextkey);
            }
        },
        
        /*注册联动事件*/
        _addEv:function(o,lv,childOrigin){
            Y.on("change",this._selectChange,o,this,lv,childOrigin);
        },
        select:function(str){
            if(str!==""){
                var selectAr=str.split("-");
                this._selectBase(str,selectAr);
            }
        },
        /*联动事件*/
        _selectChange:function(e,lv,childOrigin){
            this.set("ckJsonValues",[]);
            this.set("ifSelect",0);
            if(childOrigin!==undefined){
                Y.one(childOrigin).setContent("");
            }
            this._createItem(lv+1,e.currentTarget.get("value"));
            this._setJsonValue(lv);
         
        },
       
        /*设置json的value值*/
        _setJsonValue:function(lv){
            var levelNum=this.get("levelCount"),i,originAr,valueAr=this.get("jsonValueAr"),tp,k;
            originAr=this.get("originDoms");
            /*将valueAr的lv之后的值设为空*/
            for(k=lv+1;k<valueAr.length;k++){
                valueAr[k]=""
            }
            
            for(i=lv;i<levelNum;i++){
                valueAr[i]=""
                if(originAr[i].value===undefined||originAr[i].value===""){
                    continue;
                }
                valueAr[i]=originAr[i].value;
            }
           // console.log("json="+this.get("jsonValueAr").join("-"))
            //tp=this.get("jsonValueAr").join("-").replace(/(\d(-)\D)|\d-$/g,""); 
            tp=this.get("jsonValueAr").join("-").replace(/^(-)*|(-)*$/g,"").replace(/-+/,"-"); 
           // console.log("json=yp="+tp)
            Y.one(this.get("jsonDom")).set("value",tp);
            this._dealChange(lv,tp.split("-"));
        }
    });

    Y.Cdselector=Cdselector;
    

},'1.0.0',{requires:['k2-cdselector-base']});
