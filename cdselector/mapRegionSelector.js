 /*!
 * @revision:
 */
/*
 * @author:
 * @version:1-0-2
 */
/*MapRegionSelectorNew option*/
YUI.add('k2-mapRegionSelectorNew',function(Y){
    var _D = Y.DOM,
        _O=Y.Object,
        inputDOM,
        MapRegionSelectorNew = function(){
            MapRegionSelectorNew.superclass.constructor.apply(this,	arguments);
        };
    MapRegionSelectorNew.NAME="k2-mapRegionSelectorNew";
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
                origin,nextkey,childOrigin;
            if(nowlv>=levelNum){ 
                return;
            }
            origin=this.get("originDoms")[nowlv]; 
            childOrigin=this.get("originDoms")[nowlv+1];
            if(nowlv==0){
               optAry=(_O.values(nowData.level[nowlv]))[0];
           }else{
                optAry=nowData.level[nowlv][key];
           }
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
                var selectAr=str.split("-"),origins=this.get("originDoms");
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
},'1.0.0',{requires:['k2-cdselector']});
