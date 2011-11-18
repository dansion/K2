/*!
 * @revision:
 */
/*
 * @author:
 * @version:1-0-0
 */
 
 YUI.add ('cdselector_base',function(Y){
    var _N = Y.Node,_D = Y.DOM,_L =	Y.Lang,
        Cdselector_Base	= function(){
        Cdselector_Base.superclass.constructor.apply(this, arguments);
    };
    Cdselector_Base.NAME="cdselector_base";
    Cdselector_Base.ATTRS={
        "_config":{
            value:{
                cls:{
                  sClassLiSelected : 'k2-validate-category-selected',
                  sClassLiHasChild : 'k2-validate-category-parent',
                  sClassLCPrefix : 'k2-validate-category-level',
                  sIdPrefix	: 'k2-validate-item-',
                  sClassContainer :	'k2-validate-category',
                  sLvl5Instruct	: '小区、建筑物、地段等',
                  sLvl5Ctn : 'k2-cdselector-lv5-ctn',
                  sLvl6Ctn : 'k2-cdselector-lv6-ctn',
                  sClassSpanBts	: 'k2-validate-bts',
                  sClassMultiCtn : 'k2-cds-multi-ctn'
                }
            }
        },
        /*容器的Id*/
        "containerId":{
            value:null
         },
        /*要回填的jsonName*/
         "jsonName":{
            value:null
         },
         /*级数，默认2级 不要了*/
         "levelNum":{
            value:2
           },
          /*数据源，如玄武，老编码等*/
          "dataSource":{
            value:null
          },
          /**/
          "originDoms":{
               value:[]
          },
          /*级数，默认为2*/
          "levelCount":{
                   value:2
               },
          "diyInputName":{
                   value:"mapRegionSelectorNew-region"
              },
          /*是否 允许属性不限，true表示允许*/
           "limitArray":{
                       value:[false,false]
              },
          /*创建出来的json对象的dom节点*/
          "jsonDom":{
                      value:null
              },
          /*获得的json value 数组*/
          "jsonValueAr":{
                      value:[]
              },
           /*checkbox 多选时，checkbox value数组*/
          "ckJsonValues":{
                    value:[]
              },
           /*自定义的afterchange方法*/
           "afterChangeFun":{
                    value:null
            },
            /*调用select方法初始化的key数组*/
            "selectKeyAry":{
                    value:[]
           },
            /*表示是否调用了select方法，0表示未调用*/
            "ifSelect":{
                    value:0
           },
           "mapUrl":{
                    value:"http://www.koubei.com/map/emark/emark.jsp?city="
                    
             }
    };
    Y.extend ( Cdselector_Base , Y.Base , {
        initializer:function(cfg){
            /*当containId没有定义时直接返回*/
                if(cfg.containerId === undefined){
                    return;
            }
            /*否则设置containerId*/
            this.set("containerId",cfg.containerId);
            /*获得容器节点*/
            var containerDom = Y.get("#" + cfg.containerId);
            if(containerDom === undefined){
                return;
            }
             /*创建hidden input*/
            Y.one(containerDom).addClass(this.get("_config").cls.sClassContainer);
            this.set("jsonName",cfg.config.jsonName === undefined ? cfg.containerId + "-value" : cfg.config.jsonName);
            this.set("diyInputName",cfg.config.diyInputName === undefined ? cfg.containerId + "-region" : cfg.config.diyInputName);
            this.set("limitArray",cfg.config.diyInputName === undefined ? cfg.config.limitArray : cfg.config.diyInputName);
            this._addHiddenDom();
            /*处理afterChangeFun*/
            var afterChangeFun = typeof cfg.config.afterChange == "function" ? cfg.config.afterChange : null;
            this.set("afterChangeFun",afterChangeFun);
            /*获得级数*/
            this.set("levelCount",cfg.config.levelNum === undefined ? 2:cfg.config.levelNum);
            this._renderDom();
            if(cfg.config.dataSource === undefined){
                return;
            }
            this.set("dataSource",cfg.config.dataSource);
            /*初始化数据*/
            this._initData();
            if(cfg.config.levelNum === undefined){
                 this.set("levelCount",2);
            }else{
                this.set("levelCount",cfg.config.levelNum - 0);
            }
             if(cfg.config.mapMarkUrl !== undefined){
                this.set("mapUrl",cfg.config.mapMarkUrl);
             }
        },
         /*跟进jsonName创建隐藏域*/
         _addHiddenDom:function(){
             var inputDom = _D.create('<input type="hidden" name='+this.get("jsonName")+" >"),
                 containerDom = Y.one("#"+this.get("containerId"));
             this.set("jsonDom",inputDom);
             containerDom.append(inputDom);
         },
         /*select change 后出发的事件*/
         _dealChange:function(lv,ar){
             var that = this;
             if(that.get("afterChangeFun")){
                setTimeout(function(){
                    that.get("afterChangeFun")(lv,ar);
                },100);
             }
         },
        /*select事件*/
         _selectBase:function(str,selectAr){
                this.set("ifSelect",1);
                var datas=this.get("dataSource"),i,origins=this.get("originDoms");
                    this.set("selectKeyAry",selectAr);
                    /*设置第一级的value*/
                    Y.one(origins[0]).set("value",selectAr[0]);
                    /*情况之后几级的内容*/
                    Y.one(this.get("originDoms")[1]).setContent("");
                    /*创建之后级的内容*/
                    this._createItem(1,selectAr[0]);
                    /*设置json值*/
                    this._setJsonValue(0);
         },
        /*添加不限选项*/
        _addNoLimit:function(lv,originDom){
            if(this.get("limitArray")&&!!this.get("limitArray")[lv]==true){
                originDom.appendChild(_D.create('<option value="0">不限</option>'));
            }
        
        },
        /*清除内容*/
        _clearContent:function(lv,levelNum,origin){
            var tpnum=lv;
            while(tpnum<levelNum){
                tpnum++;
                temp=origin[tpnum];
                if(Y.one(temp)){
                    Y.one(temp).setContent("");
                }
            }
        
        },
        /*创建li节点，当ifaddClass=true时创建的是有红色边框的那种类型，当ifAddClass=false时创建的是LI空节点*/
         _createLi:function(optAry,optxt,nowData,nowlv,levelNum,origin,childOrigin,ifAddClass){
            var optDom,liAry=[];
            for(j=0;j<optAry.length;j++){
                    if(ifAddClass){
                       liDom=_D.create('<li data={"key":'+optAry[j]+'}>'+optxt[optAry[j]]+'</li>');
                       this._addEv(Y.one(liDom),nowlv,childOrigin,optAry[j]);
                    }else {
                        liDom=_D.create('<li data={"key":'+optAry[j]+'}></li>');
                    }
                       liAry.push(liDom);
                       if(nowData.level[nowlv+1]!==undefined&&nowData.level[nowlv+1][optAry[j]]!==undefined&&nowlv!==levelNum-1){
                            _D.addClass(liDom,this.get("_config").cls.sClassLiHasChild);
                        
                       }
                       if(this.get("ifSelect")==1&&Y.Array.indexOf(this.get("selectKeyAry"),""+optAry[j])!=-1){
                           if(ifAddClass){
                                Y.one(liDom).addClass(this.get("_config").cls.sClassLiSelected);
                           }
                           this._createItem(nowlv+1,optAry[j]);
                       }
                      //if(!ifAddClass){ ;}
                      origin.appendChild(liDom);
                      //this._addEv(Y.one(liDom),nowlv,childOrigin,optAry[j]);
           }
           return liAry;
        }
});

Y.Cdselector_Base=Cdselector_Base;

},'1.0.0',{requires:['base','node','event']});







/*option*/
YUI.add('cdselector',function(Y){
    var _N = Y.Node,_D = Y.DOM,_L = Y.Lang;
    var Cdselector = function(){
        Cdselector.superclass.constructor.apply(this, arguments);
    };
    Cdselector.NAME="cdselector";
    Y.extend(Cdselector,Y.Cdselector_Base,{
        /*渲染select的基础方法，以便之后其他方法的调用*/
        _renderBaseSelect:function(containerDom,loopSize){
                var originDom,i,d;
                /*创建select节点*/
                for(i=0;i<loopSize;i++){
                    originDom=_D.create('<select class="'+this.get("_config").cls.sClassLCPrefix+i+'"></select>');
                    containerDom.append(originDom);
                    /*是否添加不限选项*/
                    this._addNoLimit(i,originDom);
                    d = this.get("originDoms");
                    d.push(originDom);
                    this.set("originDoms", d);
                }
        
        },
        /*创建option，包括不限选项的添加*/
        _createOpt:function(nowlv,optAry,optxt,origin){
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
                optDom,
                i,
                k,
                j,
                nextkey,
                childOrigin,tpnum;
           /*当所创建的级数大于一共有的技术时返回，nowlv从0开始*/
           if(nowlv>=levelNum){return;}
           /*获得该级的select节点*/
           origin=this.get("originDoms")[nowlv];
           /*获得下一级的select节点*/
           childOrigin=this.get("originDoms")[nowlv+1];
           /*通过级数，键值来获得该select下的option值*/
           optAry=nowData.level[nowlv][key];
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
               nextkey = this.get("ifSelect")==1?this.get("selectKeyAry")[nowlv]:optAry[0];
               nowlv++;
               if(nowlv>=levelNum){ return; }
               Y.one(childOrigin).setContent("");
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
            this._createItem(lv+1,e.target.get("value"));
            this._setJsonValue(lv);
         
        },
       
        /*设置json的value值*/
        _setJsonValue:function(lv){
            var levelNum=this.get("levelCount"),i,originAr,valueAr=this.get("jsonValueAr"),tp;
            originAr=this.get("originDoms");
            /*将valueAr的lv之后的值设为空*/
            for(var k=lv+1;k<valueAr.length;k++){
                valueAr[k]=""
            }
            //console.log("valueAr.length="+valueAr.length)
            for(i=lv;i<levelNum;i++){
                valueAr[i]=""
                if(originAr[i].value===undefined||originAr[i].value===""){
                    continue;
                }
                valueAr[i]=originAr[i].value;
            }
            tp=this.get("jsonValueAr").join("-").replace(/(\d(-)\D)|\d-$/g,"");
            Y.one(this.get("jsonDom")).set("value",tp);
            this._dealChange(lv,tp.split("-"));
        }
    });

    Y.Cdselector=Cdselector;
    

},'1.0.0',{requires:['cdselector_base']});

/* ul类型的联动 */
YUI.add('cdselector_option',function(Y){
    var _N = Y.Node,_D = Y.DOM,_L = Y.Lang,oldSelector,
        Cdselector_Option = function(){
        Cdselector_Option.superclass.constructor.apply(this, arguments);
    };
    Cdselector_Option.NAME="cdselector_option";
    Y.extend(Cdselector_Option,Y.Cdselector_Base,{
        /*渲染UL的基础方法*/
        _renderBaseUl:function(containerDom,loopSize){
            for(i=0;i<loopSize;i++){
                    originDom=_D.create("<ul></ul>");
                    _D.addClass(originDom,""+this.get("_config").cls.sClassLCPrefix+i);
                    containerDom.append(originDom);
                    d= (this.get("originDoms"));
                    d.push(originDom);
                    this.set("originDoms", d);
                }
            return originDom;
        },
        /*创建顶级父节点 ul*/
        _renderDom:function(){
            var containerDom=Y.one("#"+this.get("containerId")),
                originDom,i,d;
                containerDom.addClass(this.get("_config").cls.sClassContainer);
               this. _renderBaseUl(containerDom,this.get("levelCount"));
        },
        /*初始化数据*/
        _initData:function(){
            var nowData = this.get("dataSource");
            this._createItem(0,0);
        },
        /*创建内容节点*/
        _createItem:function(nowlv,key){
            var nowData=this.get("dataSource"),
                levelNum=this.get("levelCount"),
                origin,optDom,i,k,j,nextkey,childOrigin,tpnum,temp;
            tpnum=nowlv;
            if(nowlv>=levelNum){ return; }
            origin=this.get("originDoms")[nowlv]; 
            childOrigin=this.get("originDoms")[nowlv+1];
            optAry=nowData.level[nowlv][key];
            this._clearContent(nowlv,levelNum,this.get("originDoms"))
           if(origin!==undefined&&optAry!==undefined){
                   optxt=nowData.data;
                   this._createLi(optAry,optxt,nowData,nowlv,levelNum,origin,childOrigin,true);
            }
        },
        /*注册联动事件*/
        _addEv:function(o,lv,childOrigin,value){
            Y.on("click",this._selectChange,o,this,lv,childOrigin,value);
        },
        /*联动事件*/
        _selectChange:function(e,lv,childOrigin,value){
            var	temp;
            this.set("ifSelect",0);
            if(childOrigin!==undefined){
            Y.one(childOrigin).setContent("");}
            temp=Y.JSON.parse(e.target.getAttribute("data"));
            Y.one(e.target).ancestor().get("children").removeClass(this.get("_config").cls.sClassLiSelected);
            oldSelector=Y.one(e.target);
            Y.one(e.target).addClass(this.get("_config").cls.sClassLiSelected);
            this._setJsonValue(lv,value);
            var that=this;
            this._createItem(lv+1,temp.key);
        },
        /*设置json的value值*/
        _setJsonValue:function(lv,value){
           
            var j,tpAr,
                originAr,valueAr=this.get("jsonValueAr");

            for(j=lv+1;j<valueAr.length;j++){
                valueAr[j]="";
            }
            valueAr[lv]=value;
            tpAr=valueAr.join("-").replace(/^-+|-+(?=-)|-+$/g,"");
            Y.one(this.get("jsonDom")).set("value",tpAr);
             this._dealChange(lv,tpAr.split("-"));
        },
        /*select事件方法*/
        select:function(str){
            if(str!==""){
                   var selectAr=str.split("-");
                   this._selectBase(str,selectAr);
                   this._selectOwnerFun(str);
            }
         },
       _selectOwnerFun:function(str){
            var firstUlChildren=Y.one(this.get("originDoms")[0]).get("children"),i,tempKey,tempChild,selectAr=str.split("-")
            for(i=0;i<firstUlChildren.size();i++){
                        tempChild=firstUlChildren.item(i);
                        tempKey=Y.JSON.parse(tempChild.getAttribute("data")).key;
                        if(tempKey+""!=selectAr[0]){continue;}
                        tempChild.addClass(this.get("_config").cls.sClassLiSelected);

                    }
             this._dealChange(0,selectAr);
         
         }

    });

    Y.Cdselector_Option=Cdselector_Option;
    

},'1.0.0',{requires:['cdselector-base','json-parse']});




/*MultiSelector	option*/
YUI.add('multiSelector',function(Y){
    var _N = Y.Node,
        _D = Y.DOM,
        _L = Y.Lang,ckDoms=[],ckValues=[];
        MultiSelector = function(){
        MultiSelector.superclass.constructor.apply(this, arguments);
    };
    MultiSelector.NAME="multiSelector";
    Y.extend(MultiSelector,Y.Cdselector,{
        /*创建顶级父节点 select	or ul*/
        _renderDom:function(){
            var containerDom=Y.one("#"+this.get("containerId"))
                containerDom.addClass(this.get("_config").cls.sClassContainer);
                this._renderBaseSelect(containerDom,this.get("levelCount")-1);
                this._renderMod(containerDom);
        },
        /*创建多选的ckbox模块*/
       _renderMod:function(containerDom){
            var originDom,originUlDom,d;
                originDom=_D.create('<div class="'+this.get("_config").cls.sClassMultiCtn+'"></div>');
                containerDom.append(originDom);
                originUlDom=_D.create('<ul class="'+this.get("_config").cls.sClassLCPrefix+'"></ul>');
                Y.one(originDom).append(originUlDom);
                d= (this.get("originDoms"));
                d.push(originUlDom);
                this.set("originDoms", d);
        
        },
        /*创建checkbox的内容*/
        _createCkItem:function(tpId,nowlv,liAry,optxt,optAry){
             var j,
                 optDomOther;
             for(j=0;j<liAry.length;j++){
                  optDomOther=_D.create('<input	type="checkbox"	id="'+tpId+'-'+nowlv+'-'+optAry[j]+'">');
                  liAry[j].appendChild(optDomOther);
                  ckDoms.push(optDomOther);
                  ckValues.push(optAry[j]+"");
                   Y.one(optDomOther).on("change",this._dealCkChange,this,optAry[j]+"",nowlv);
                  optDomOther=_D.create('<label for="'
                                       +tpId+'-'+nowlv+'-'+optAry[j]+'">'
                                       +optxt[optAry[j]]
                                       +'</label>');
                  liAry[j].appendChild(optDomOther);
             }
        
        },
        /*创建数据内容*/
        _createItem:function(nowlv,key){
            var nowData=this.get("dataSource"),
                levelNum=this.get("levelCount"),
                origin,
                optDom,
                i,
                k,
                j,
                nextkey,
                childOrigin,
                tpId,
                indexNum,liAry;
            if(nowlv>=levelNum){ 
                return;
             }
            origin=this.get("originDoms")[nowlv]; 
            childOrigin=this.get("originDoms")[nowlv+1];
            optAry=nowData.level[nowlv][key];
            this._clearContent(nowlv,levelNum,this.get("originDoms"));
            if(optAry!==undefined){
               optxt=nowData.data;
               if(nowlv===levelNum-1){
                   tpId=this.get("containerId");
                   liAry=this._createLi(optAry,optxt,nowData,nowlv,levelNum,origin,childOrigin);
                   this._createCkItem(tpId,nowlv,liAry,optxt,optAry)

               }else{
                   this._createOpt(nowlv,optAry,optxt,origin);
                   this._addEv(Y.one(origin),nowlv,childOrigin);
              }
               nextkey=optAry[0];
               nowlv++;
               if(nowlv>=levelNum){return;}
               this._createItem(nowlv,nextkey);
            }
        },
        /*当checkbox的状态改变的事件处理*/
        _dealCkChange:function(e,v,lv){
            if(Y.one(e.target).get("checked")){
                this.get("ckJsonValues").push(v);
            }else{
                  indexNum=this.get("ckJsonValues").indexOf(v);
                  this.get("ckJsonValues")[indexNum]="";
              }
             this._setJsonValue(lv);
        },
        /*设置json的值*/
        _setJsonValue:function(lv){
            var levelNum=this.get("levelCount"),i,j,tp,originAr,valueAr=this.get("jsonValueAr"),rega=/,+/g,regb=/^,/g,regc=/,$/g,tpStr;
            originAr=this.get("originDoms");
           
            for(var k=lv+1;k<valueAr.length;k++){
                valueAr[k]=""
            }
            for(i=lv;i<levelNum;i++){
                if(originAr[i].value===undefined||originAr[i].value===""){
                    continue;
                }
                valueAr[i]=originAr[i].value;
            }
           tpStr=this.get("ckJsonValues").toString().replace(rega,",").replace(regb,"").replace(regc,"")||"0";
           var tempAar;
           tp=this.get("jsonValueAr").join("-").replace(/\d-$/g,"");
            if(tpStr!==""){
                Y.one(this.get("jsonDom")).set("value",(tp+"-"+tpStr));
               tempAar=tp.split("-").concat(tpStr);
            }
            else{
                Y.one(this.get("jsonDom")).set("value",tp);
                 tempAar=tp.split("-");
            }
            
             this._dealChange(lv,tempAar);
        },
        /*select事件处理*/
        select:function(str){
            if(str!==""){
                var selectAr=str.split("-");
                this._selectOwnerFun(str);
                this._selectBase(str,selectAr);
            }
         },
      _selectOwnerFun:function(str){
             var selectCk=str.replace(/\w+-/g,"").split(","),nowIndex;
             for(i=0;i<selectCk.length;i++){
                        nowIndex=Y.Array.indexOf(ckValues,selectCk[i]);
                        if(nowIndex!==-1){
                                Y.one(ckDoms[nowIndex]).set("checked","true");
                                this.get("ckJsonValues").push(selectCk[i]);
                       }
             }
         }
    });
    Y.MultiSelector=MultiSelector;
},'1.0.0',{requires:['cdselector']});



/*MapRegionSelectorNew option*/
YUI.add('mapRegionSelectorNew',function(Y){
    var _N = Y.Node,
        _D = Y.DOM,
        _L = Y.Lang,
        inputDOM,
        MapRegionSelectorNew = function(){
            MapRegionSelectorNew.superclass.constructor.apply(this,	arguments);
        };
    MapRegionSelectorNew.NAME="mapRegionSelectorNew";
    Y.extend(MapRegionSelectorNew,Y.Cdselector,{
        /*创建顶级父节点 select	or ul*/
        _renderDom:function(){
            var	containerDom=Y.one("#"+this.get("containerId"));
                containerDom.addClass(this.get("_config").cls.sClassContainer);
                this._renderBaseSelect(containerDom,this.get("levelCount"));
                this._renderMapMod(containerDom);
               
        },
        /*渲染map地址模块*/
        _renderMapMod:function(containerDom){
             var originDom=_D.create('<div class="'+this.get("_config").cls.sLvl5Ctn+'"></div>');
             inputDOM=_D.create('<input type="text" name='+this.get("diyInputName")+'>');
             originDom.appendChild(inputDOM);
             Y.one(originDom).append('<span>'+this.get("_config").cls.sLvl5Instruct+'</span>');
             containerDom.append(originDom);
        },
        /*创建内容*/
        _createItem:function(nowlv,key){
            var nowData=this.get("dataSource"),
                levelNum=this.get("levelCount"),
                origin,optDom,i,k,j,nextkey,childOrigin,tpId;
            if(nowlv>=levelNum){ 
                return;
            }
            origin=this.get("originDoms")[nowlv]; 
            childOrigin=this.get("originDoms")[nowlv+1];
            optAry=nowData.level[nowlv][key];
            this._clearContent(nowlv,levelNum,this.get("originDoms"));
            if(optAry!==undefined){
                optxt=nowData.data;
                this._createOpt(nowlv,optAry,optxt,origin);
                this._addEv(Y.one(origin),nowlv,childOrigin);
               nextkey=optAry[0];
               nowlv++;
               if(nowlv>=levelNum){return;}
               this._createItem(nowlv,nextkey);
           }
        },
        /*select事件处理*/
         select:function(str){
            if(str!==""){
                this.set("ifSelect",1);
                var selectAr=str.split("-"),datas=this.get("dataSource"),i,origins=this.get("originDoms");
                    this.set("selectKeyAry",selectAr);
                    Y.one(origins[0]).set("value",selectAr[0]);
                    Y.one(this.get("originDoms")[1]).setContent("");
                    this._createItem(1,selectAr[0]);
                    this._setJsonValue(0);
                    Y.one(inputDOM).set("value",selectAr[3])
                //this.set("selectKeyAry",str.split("-"));
                //this.set("ifSelect",1);
            }
         }
    });
    Y.MapRegionSelectorNew=MapRegionSelectorNew;
},'1.0.0',{requires:['cdselector']});



/* ul类型的联动 有子类的时候才显示该ul*/
YUI.add('cdselector_optionByStep',function(Y){
    var _N = Y.Node,_D = Y.DOM,_L = Y.Lang,oldSelector,
        Cdselector_OptionByStep = function(){
        Cdselector_OptionByStep.superclass.constructor.apply(this, arguments);
    };
    Cdselector_OptionByStep.NAME="cdselector_optionByStep";
    Y.extend(Cdselector_OptionByStep,Y.Cdselector_Option,{
        /*创建顶级父节点 ul*/
        _renderDom:function(){
            var containerDom=Y.one("#"+this.get("containerId")),
                originDom,i,d;
                containerDom.addClass(this.get("_config").cls.sClassContainer);
                this._renderBaseUl(containerDom,1);
        },
        /*创建内容节点*/
        _createItem:function(nowlv,key){//this.get("levelCount")
            var nowData=this.get("dataSource"),
                levelNum=this.get("levelCount"),
                origin,optDom,i,k,j,nextkey,tpnum,temp;
            tpnum=nowlv;
            if(nowlv>=levelNum){ return; }
            origin=this.get("originDoms")[nowlv]; 
            optAry=nowData.level[nowlv][key];
            this._clearContent(nowlv,levelNum,this.get("originDoms"))
            if(origin!==undefined&&optAry!==undefined){
                   optxt=nowData.data;
                   this._createLi(optAry,optxt,nowData,nowlv,levelNum,origin,null,true);
            }
        },
        /*联动事件*/
        _selectChange:function(e,lv,childOrigin,value){
            var temp,k=this.get("originDoms").length,container=Y.one("#"+this.get("containerId")),originAry=this.get("originDoms"), optAry=this.get("dataSource").level[lv+1][value];;
            this.set("ifSelect",0);
            for(var i=k-1;i>lv;i--){
                container.removeChild(originAry[i]);
                 this.get("originDoms").pop();
            }
            Y.one(e.target).ancestor().get("children").removeClass(this.get("_config").cls.sClassLiSelected);
            oldSelector=Y.one(e.target);
            Y.one(e.target).addClass(this.get("_config").cls.sClassLiSelected);
            this._setJsonValue(lv,value);
            if(optAry&&lv+1<this.get("levelCount")){
                childOrigin=this._renderDom();
                temp=Y.JSON.parse(e.target.getAttribute("data"));
                this._createItem(lv+1,temp.key);
            }
        }

    });

    Y.Cdselector_OptionByStep=Cdselector_OptionByStep;
},'1.0.0',{requires:['cdselector_option','json-parse']});

