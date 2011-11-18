 /*!
 * @revision:
 */
/*
 * @author:
 * @version:1-0-6
 */
 
 YUI.add ('k2-cdselector-base',function(Y){
    var _D = Y.DOM,
        Cdselector_Base = function(){
        Cdselector_Base.superclass.constructor.apply(this, arguments);
    };
    Cdselector_Base.NAME="k2-cdselector-base";
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
         /*级数，默认2级*/
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
                   value:null
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
                    
             },
            "treeType":{
                value:[]
             
             },
            "selectAry":{
                value:[]
             },
             "inputId":{
                value:null
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
            if(cfg.select){
                this.set("selectAry",cfg.select.split("-"));
            }
            /*获得容器节点*/
            var containerDom = Y.one("#" + cfg.containerId), afterChangeFun;
            if(containerDom === undefined){
                return;
            }
             /*创建hidden input*/
            Y.one(containerDom).addClass(this.get("_config").cls.sClassContainer);
            this.set("jsonName",cfg.config.jsonName === undefined ? cfg.containerId + "-value" : cfg.config.jsonName);
            this.set("diyInputName",cfg.config.diyInputName === undefined ? cfg.containerId + "-region" : cfg.config.diyInputName);
            this.set("limitArray",cfg.config.diyInputName === undefined ? cfg.config.limitArray : cfg.config.diyInputName);
             this.set("treeType",cfg.config.treeType === undefined ? cfg.config.treeType : cfg.config.treeType);
             this.set("inputId",cfg.config.inputId === undefined ? null:cfg.config.inputId);
            this._addHiddenDom();
            /*处理afterChangeFun*/
            afterChangeFun = typeof cfg.config.afterChange == "function" ? cfg.config.afterChange : null;
            this.set("afterChangeFun",afterChangeFun);
            /*获得级数*/
            this.set("levelCount",cfg.config.levelNum === undefined ? 2:cfg.config.levelNum);
            Y.log("levelCount:"+this.get("levelCount"));
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
             var inputDom,
                 containerDom = Y.one("#"+this.get("containerId")),selectedAry;
             if(Y.one("#"+this.get("inputId"))){
                inputDom=Y.one("#"+this.get("inputId"));
                if(inputDom.get("value")&&inputDom.get("value")!==""){
                    selectedAry=inputDom.get("value").split("-");
                    this.set("selectKeyAry",selectedAry);
                    this.set("ifSelect",1);
                }
             }
             else{
                    if(this.get("inputId")){
                         inputDom = _D.create('<input type="hidden" name='+this.get("jsonName")+" id='"+this.get("inputId")+"'"+">");
                    }
                    else{
                        inputDom = _D.create('<input type="hidden" name='+this.get("jsonName")+">");
                    }
                    containerDom.append(inputDom);
             }
             this.set("jsonDom",inputDom);
             
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
                var origins=this.get("originDoms"),childOrigin=this.get("originDoms")[1];
                    this.set("selectKeyAry",selectAr);
                    /*设置第一级的value*/
                    Y.one(origins[0]).set("value",selectAr[0]);
                    /*情况之后几级的内容*/
                    if(childOrigin){
                    Y.one(childOrigin).setContent("");}
                    /*创建之后级的内容*/
                    this._createItem(1,selectAr[0]);
                    /*设置json值*/
                    this._setJsonValue(0);
         },
        /*添加不限选项*/
        _addNoLimit:function(lv,originDom){
            var nolimit_str;
            if(this.get("limitArray")&&!!this.get("limitArray")[lv]==true){
                if(!originDom){originDom=Y.one(_D.create('<select class="'+this.get("_config").cls.sClassLCPrefix+lv+'"></select>'));}
                if(this.get("dataSource").data[0]){
                    nolimit_str=this.get("dataSource").data[0];
                }
                else{
                    nolimit_str="不限";
                }
                originDom.appendChild(_D.create('<option value="0">'+nolimit_str+'</option>'));
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
            var liAry=[],j,tp;
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
                                tp=optAry[j];
                           }
                          

                       }
                      //if(!ifAddClass){ ;}
                      origin.appendChild(liDom);
                      //this._addEv(Y.one(liDom),nowlv,childOrigin,optAry[j]);
           }
            this._createItem(nowlv+1,tp);
           return liAry;
        }
});

Y.Cdselector_Base=Cdselector_Base;

},'1.0.0',{requires:['base-base','node-base','event-base']});





