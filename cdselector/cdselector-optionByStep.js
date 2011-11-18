 /*!
 * @revision:
 */
/*
 * @author:
 * @version:1-0-4
 */
/* ul类型的联动 有子类的时候才显示该ul*/
YUI.add('k2-cdselector-optionByStep',function(Y){
    var _O=Y.Object,Cdselector_OptionByStep = function(){
        Cdselector_OptionByStep.superclass.constructor.apply(this, arguments);
    };
    Cdselector_OptionByStep.NAME="k2-cdselector-optionByStep";
    Y.extend(Cdselector_OptionByStep,Y.Cdselector_Option,{
        /*创建顶级父节点 ul*/
        _renderDom:function(){
            var containerDom=Y.one("#"+this.get("containerId"));
                containerDom.addClass(this.get("_config").cls.sClassContainer);
                this._renderBaseUl(containerDom,this.get("selectKeyAry").length?this.get("selectKeyAry").length:1);
        },
        /*创建内容节点*/
        _createItem:function(nowlv,key){//this.get("levelCount")
            var nowData=this.get("dataSource"),
                levelNum=this.get("levelCount"),
                origin,tpnum;
            tpnum=nowlv;
            if(nowlv>=levelNum){ return; }
            origin=this.get("originDoms")[nowlv]; 
            if(nowData.level[nowlv]){
            if(nowlv==0){
               optAry=(_O.values(nowData.level[nowlv]))[0];
           }else{
                optAry=nowData.level[nowlv][key];
           }
            this._clearContent(nowlv,levelNum,this.get("originDoms"));
            if(origin!==undefined&&optAry!==undefined){ 
                   /*if(this.get("limitArray")&&!!this.get("limitArray")[nowlv]==true&&optAry[0]!==0){
                        optAry.unshift(0);
                   }*/
                   optxt=nowData.data;
                   this._createLi(optAry,optxt,nowData,nowlv,levelNum,origin,null,true);
            }
            }
        },
        /*联动事件*/
        _selectChange:function(e,lv,childOrigin,value){
            // e.stopPropagation();
            //alert(e.currentTarget)
            this.set("selectKeyAry",[]);
            var temp,i,k=this.get("originDoms").length,container=Y.one("#"+this.get("containerId")),originAry=this.get("originDoms"),optAry;
                
            if(this.get("dataSource").level[lv+1]){
                optAry=this.get("dataSource").level[lv+1][value];
            }
            this.set("ifSelect",0);
            for(i=k-1;i>lv;i--){
                container.removeChild(originAry[i]);
                 this.get("originDoms").pop();
            }
            Y.one(e.currentTarget).ancestor().get("children").removeClass(this.get("_config").cls.sClassLiSelected);
            oldSelector=Y.one(e.currentTarget);
            Y.one(e.currentTarget).addClass(this.get("_config").cls.sClassLiSelected);
            
            this._setJsonValue(lv,value);
            if(optAry&&lv+1<this.get("levelCount")){
                childOrigin=this._renderDom();
                temp=Y.JSON.parse(e.currentTarget.getAttribute("data"));
                this._createItem(lv+1,temp.key);
            }
        },
                    /*select事件方法*/
        select:function(str){
            if(str!==""){
                   var selectAr=str.split("-");
                   this.set("selectKeyAry",selectAr);
                   this.set("jsonValueAr",selectAr);
                   this._renderBaseUl(Y.one("#"+this.get("containerId")),selectAr.length-1);
                   this._selectOwnerFun(selectAr[0],0);
            }
         }

    });

    Y.Cdselector_OptionByStep=Cdselector_OptionByStep;
},'1.0.0',{requires:['k2-cdselector-option','json-parse']});
