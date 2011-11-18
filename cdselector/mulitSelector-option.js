/*
 * @author:
 * @version:1-0-3
 */
/* ul类型的联动 */
YUI.add('k2-mulitSelector-option',function(Y){
    var _D = Y.DOM,_O=Y.Object,
        MulitSelector_Option = function(){
        MulitSelector_Option.superclass.constructor.apply(this, arguments);
    };
    MulitSelector_Option.NAME="k2-mulitSelector-option";
    Y.extend(MulitSelector_Option,Y.Cdselector_Base,{
        /*渲染UL的基础方法*/
        _renderBaseUl:function(containerDom,loopSize){
            var originDom,d;
            for(var i=0;i<loopSize;i++){
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
            var temp,nowItem=Y.one(e.currentTarget),selectClass=this.get("_config").cls.sClassLiSelected,
                fatherDom=nowItem.ancestor(),
                lastAllSelectValues=this.get("ckJsonValues"),nowIndex=-1;
             this.set("ifSelect",0);
            if(childOrigin!==undefined){
            Y.one(childOrigin).setContent("");}
            temp=Y.JSON.parse(e.currentTarget.getAttribute("data"));
            if(lv!==this.get("levelCount")-1){
               fatherDom.get("children").removeClass(selectClass);
            }
            Y.log("cks="+this.get("ckJsonValues"))
            nowItem.toggleClass(selectClass);
            if((nowItem.hasClass(selectClass))&&(lv==this.get("levelCount")-1))
            {
                 lastAllSelectValues.push(value);
            }else if(lv==this.get("levelCount")-1){if(Y.Array.indexOf(this.get("ckJsonValues"),value)!==-1||Y.Array.indexOf(this.get("ckJsonValues"),value+"")!==-1){
                    nowIndex=Y.Array.indexOf(this.get("ckJsonValues"),value)==-1?Y.Array.indexOf(this.get("ckJsonValues"),value+""):Y.Array.indexOf(this.get("ckJsonValues"),value);
                }else if(lastAllSelectValues.indexOf(Y.JSON.parse(nowItem.getAttribute("data")).key)!=-1){
                    nowIndex=lastAllSelectValues.indexOf(Y.JSON.parse(nowItem.getAttribute("data")).key)
                }
                lastAllSelectValues[nowIndex]="";
            }
            Y.log("last="+lastAllSelectValues)
            this._setJsonValue(lv,value);
            this._createItem(lv+1,temp.key);
           
        },
        /*设置json的value值*/
        _setJsonValue:function(lv,value){
            var j,tpAr,
                valueAr=this.get("jsonValueAr"),mulitValues,mulitValuesAr=this.get("ckJsonValues"),tpStr;
            for(j=lv+1;j<valueAr.length;j++){
                valueAr[j]="";
            }
            if(lv==this.get("levelCount")-1){
               // mulitValuesAr.push(value);
                //this.set("ckJsonValues",mulitValuesAr);

            }else{
                valueAr[lv]=value;Y.log("valueAr="+valueAr);
                mulitValuesAr=[];
                this.set("ckJsonValues",mulitValuesAr);
             }
            tpAr=valueAr.join("-").replace(/^-+|-+(?=-)|-+$/g,"");
            mulitValues=mulitValuesAr.join(",").replace(/^,+|,+(?=,)|,+$/g,"");
            tpStr=(mulitValuesAr+"").replace(/\s*/g,"").replace(/,*/g,"");Y.log((tpStr));
            Y.one(this.get("jsonDom")).set("value",tpAr+(tpStr!=""?"-"+mulitValues:""));
            this._dealChange(lv,(tpAr+(tpStr!=""?"-"+mulitValues:"")).split("-"));
        },
        /*select事件方法*/
        select:function(str){
            if(str!==""){
                   var selectAr=str.split("-"),temp;
                   
                   //this._selectBase(str,selectAr);
                   if(selectAr[this.get("levelCount")-1]){
                        temp=selectAr[this.get("levelCount")-1].split(",");
                        this.set("ckJsonValues",temp);
                        selectAr.pop();
                   }
                   this.set("selectKeyAry",selectAr.concat(this.get("ckJsonValues")));//Y.log("aa="+selectAr.concat(this.get("ckJsonValues")))
                   this.set("jsonValueAr",selectAr);Y.log("selectAr="+selectAr)
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
           }else{
                this._dealChange(0,this.get("selectKeyAry"));Y.log("bb="+this.get("selectKeyAry"))
           }
      }
    });

    Y.MulitSelector_Option=MulitSelector_Option;
    

},'1.0.0',{requires:['k2-cdselector-base','json-parse']});

