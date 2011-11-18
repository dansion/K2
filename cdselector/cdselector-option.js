 /*!
 * @revision:
 */
/*
 * @author:
 * @version:1-0-4
 */
/* ul类型的联动 */
YUI.add('k2-cdselector-option',function(Y){
    var _D = Y.DOM,_O=Y.Object,
        Cdselector_Option = function(){
        Cdselector_Option.superclass.constructor.apply(this, arguments);
    };
    Cdselector_Option.NAME="k2-cdselector-option";
    Y.extend(Cdselector_Option,Y.Cdselector_Base,{
        /*渲染UL的基础方法*/
        _renderBaseUl:function(containerDom,loopSize){
            var originDom,d,i;
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
        _renderDom:function(num){
            var containerDom=Y.one("#"+this.get("containerId")),
                loopSize=num||this.get("levelCount");
                containerDom.addClass(this.get("_config").cls.sClassContainer);
               this. _renderBaseUl(containerDom,loopSize);

        },
        /*初始化数据*/
        _initData:function(nextkey){
            this._createItem(0,0);
            this._dealChange(-1,this.get("selectKeyAry"));
            this.set("jsonValueAr",this.get("selectKeyAry"));
        },
        /*创建内容节点*/
        _createItem:function(nowlv,key){
            var nowData=this.get("dataSource"),
                levelNum=this.get("levelCount"),
                origin,childOrigin,tpnum;
            tpnum=nowlv;
            if(nowlv>=levelNum){ return; }
            origin=this.get("originDoms")[nowlv]; 
            childOrigin=this.get("originDoms")[nowlv+1];
            if(nowlv==0){
               optAry=(_O.values(nowData.level[nowlv]))[0];
           }else{
                optAry=nowData.level[nowlv][key];
           }
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
            //e.stopPropagation();
           // alert(e.currentTarget)
            var	temp;
            this.set("ifSelect",0);
            if(childOrigin!==undefined){
            Y.one(childOrigin).setContent("");}
            temp=Y.JSON.parse(e.currentTarget.getAttribute("data"));
            Y.one(e.currentTarget).ancestor().get("children").removeClass(this.get("_config").cls.sClassLiSelected);
            oldSelector=Y.one(e.currentTarget);
            Y.one(e.currentTarget).addClass(this.get("_config").cls.sClassLiSelected);
            this._setJsonValue(lv,value);
            this._createItem(lv+1,temp.key);
        },
        /*设置json的value值*/
        _setJsonValue:function(lv,value){
           
            var j,tpAr,
                valueAr=this.get("jsonValueAr");

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
                   this.set("selectKeyAry",selectAr);
                   this.set("jsonValueAr",selectAr);
                   //this._selectBase(str,selectAr);
                   this._selectOwnerFun(selectAr[0],0);
            }
         },
       _selectOwnerFun:function(str,index){
             if(this.get("originDoms")[index]){
            var firstUlChildren=Y.one(this.get("originDoms")[index]).get("children"),i,tempKey,tempChild;
            for(i=0;i<firstUlChildren.size();i++){
                        tempChild=firstUlChildren.item(i);
                        tempKey=Y.JSON.parse(tempChild.getAttribute("data")).key;
                        if(tempKey+""!=str){continue;}
                        tempChild.addClass(this.get("_config").cls.sClassLiSelected);
                        this._createItem(index+1,tempKey);
                    }
                
                this._selectOwnerFun(this.get("selectKeyAry")[index+1],index+1)
             }
            else{this._dealChange(0,this.get("selectKeyAry"));}
         }

    });

    Y.Cdselector_Option=Cdselector_Option;
    

},'1.0.0',{requires:['k2-cdselector-base','json-parse']});
