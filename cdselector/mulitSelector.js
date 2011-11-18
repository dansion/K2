 /*!
 * @revision:
 */
/*
 * @author:
 * @version:1-0-3
 */
/*MultiSelector	option*/
YUI.add('k2-multiSelector',function(Y){
    var _D = Y.DOM,
        _O=Y.Object,ckDoms=[],ckValues=[];
        MultiSelector = function(){
        MultiSelector.superclass.constructor.apply(this, arguments);
    };
    MultiSelector.NAME="k2-multiSelector";
    Y.extend(MultiSelector,Y.Cdselector,{
        _renderDom:function(){
            var containerDom=Y.one("#"+this.get("containerId"));
                containerDom.addClass(this.get("_config").cls.sClassContainer);
                this._renderBaseSelect(containerDom,this.get("levelCount")-1);
                this._renderMod(containerDom);
        },
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
        _createItem:function(nowlv,key){
            var nowData=this.get("dataSource"),
                levelNum=this.get("levelCount"),
                origin,
                nextkey,
                childOrigin,
                tpId,
                liAry;
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
        _dealCkChange:function(e,v,lv){
            if(Y.one(e.currentTarget).get("checked")){
                this.get("ckJsonValues").push(v);
            }else{
                  indexNum=Y.Array.indexOf(this.get("ckJsonValues"),v);
                  this.get("ckJsonValues")[indexNum]="";
              }
             this._setJsonValue(lv);
        },
        _setJsonValue:function(lv){
            var levelNum=this.get("levelCount"),tempAar,i,k,tp,originAr,valueAr=this.get("jsonValueAr"),rega=/,+/g,regb=/^,/g,regc=/,$/g,tpStr;
            originAr=this.get("originDoms");
           
            for(k=lv+1;k<valueAr.length;k++){
                valueAr[k]="";
            }
            for(i=lv;i<levelNum;i++){
                if(originAr[i].value===undefined||originAr[i].value===""){
                    continue;
                }
                valueAr[i]=originAr[i].value;
            }
           tpStr=this.get("ckJsonValues").toString().replace(rega,",").replace(regb,"").replace(regc,"")||"0";

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
        select:function(str){
            if(str!==""){
                var selectAr=str.split("-");
                this._selectOwnerFun(str);
                this._selectBase(str,selectAr);
            }
         },
      _selectOwnerFun:function(str){
             var selectCk=str.replace(/\w+-/g,"").split(","),nowIndex,i;
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
},'1.0.0',{requires:['k2-cdselector']});