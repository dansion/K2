 /*!
 * @revision:
 */
/*
 * @author:
 * @version:1-0-0
 */
/*MultiSelector	option*/
YUI.add('k2-mulitSelector-moreChild',function(Y){
    var _D = Y.DOM,
        _O=Y.Object,ckDoms=[],ckValues=[];
        MulitSelector_MoreChild = function(){
        MulitSelector_MoreChild.superclass.constructor.apply(this, arguments);
    };
    MulitSelector_MoreChild.NAME="k2-mulitSelector-moreChild";
    Y.extend(MulitSelector_MoreChild,Y.Cdselector_Base,{
        /*创建顶级父节点 select	or ul*/
        _renderDom:function(){
            var containerDom=Y.get("#"+this.get("containerId")),i;
                containerDom.addClass(this.get("_config").cls.sClassContainer);
                for(i=0;i<this.get("levelCount").length;i++){
                    this._renderBaseSelect(containerDom,this.get("levelCount")[i]-1,i);
                    this._renderMod(containerDom,i);
                }
               
        },
        _renderBaseSelect:function(containerDom,loopSize,branchNum){
                var originDom,i,d,tpAr=[];
                /*创建select节点*/
                for(i=0;i<loopSize;i++){
                    originDom=_D.create('<select class="'+this.get("_config").cls.sClassLCPrefix+i+'"></select>');
                    containerDom.append(originDom);
                    /*是否添加不限选项*/
                    this._addNoLimit(i,originDom);
                    d = this.get("originDoms");
                    tpAr.push(originDom);
                }
                 d.push(tpAr);
                 this.set("originDoms", d);
        
        },
        _createOpt:function(nowlv,optAry,optxt,origin){
            var j;
               this._addNoLimit(nowlv,origin);/*设置不限选项*/
                /*创建option*/
               for(j=0;j<optAry.length;j++){
                   optDom=_D.create("<option value="+optAry[j]+">"+optxt[optAry[j]]+"</option>");
                   origin.appendChild(optDom);
               }
        },
        /*创建多选的ckbox模块*/
       _renderMod:function(containerDom,branchNum){
            var originDom,originUlDom,d;
                originDom=_D.create('<div class="'+this.get("_config").cls.sClassMultiCtn+'"></div>');
                containerDom.append(originDom);
                originUlDom=_D.create('<ul class="'+this.get("_config").cls.sClassLCPrefix+'"></ul>');
                Y.one(originDom).append(originUlDom);
                d= (this.get("originDoms"));
                d[branchNum].push(originUlDom);
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
        /*初始化数据,节点*/
        _initData:function(){
            this._createItem(0,0,0);/*创建节点*/
            this._setJsonValue(0);/*设置json值*/
        },
        /*创建数据内容*/
        _createItem:function(nowlv,key,branchNum,countNum){
            var nowData=this.get("dataSource"),
                levelNum=this.get("levelCount")||countNum,
                origin,
                nextkey,
                childOrigin,
                tpId,
                liAry,tp,k,branchAr;
            if(nowlv>=levelNum[branchNum]-1){
                if(branchNum+1<levelNum.length){
                    branchNum++;
                    nowlv=0;
                }
                else{
                    return;
                }
                //this._createItem(0,0,branchNum);/*创建节点*/
                //return;
             }
            this.set("levelCount",levelNum)
            branchAr=this.get("originDoms")[branchNum];
            origin=branchAr[nowlv];
            childOrigin=branchAr[nowlv+1];
            this._clearContent(nowlv,levelNum[branchNum],branchAr,branchNum);
            if(nowlv==0){
               optAry=(_O.values(nowData.level[nowlv][branchNum]))[0];
               while(!optAry){
                   nowlv++;
                   if(nowlv>=levelNum){break;}
                   optAry=(_O.values(nowData.level[nowlv][branchNum]))[0];
               }
            }else{
                tp=nowData.level[nowlv];
                if(tp&&tp[branchNum]){
                    optAry=tp[branchNum][key];
                }
             }
           
            if(optAry!==undefined&&origin!==undefined){
                   optxt=nowData.data;
                   if(nowlv===levelNum-1){
                       tpId=this.get("containerId");
                       liAry=this._createLi(optAry,optxt,nowData,nowlv,levelNum,origin,childOrigin);
                       this._createCkItem(tpId,nowlv,liAry,optxt,optAry,branchNum)
                   }else{
                       this._createOpt(nowlv,optAry,optxt,origin);
                       this._addEv(Y.one(origin),nowlv,childOrigin,levelNum);
                  }
                   nextkey=optAry[0];
                   nowlv++;
                   if(nowlv>=levelNum){return;}
                   this._createItem(nowlv,nextkey,branchNum);
            }
            
        },
          /*清除内容*/
        _clearContent:function(lv,levelNum,origin,branchNum){
            var tpnum=lv;
            while(tpnum<levelNum&&branchNum==0){
                tpnum++;
                temp=origin[tpnum];
                if(Y.get(temp)){
                    Y.get(temp).setContent("");
                }
            }
           
           if(branchNum!==0){Y.log("aa="+levelNum)
                var tp=this.get("dataSource").level,j,i,startLva;
                   for(j=0;j<tp.length;j++){
                       if(tp[j].length==2){
                            startLva=j;
                            break;
                       }
                   }
                while(tpnum<levelNum){
                    tpnum++;
                    temp=origin[Math.abs(tpnum-startLva)];Y.log(Math.abs(tpnum-startLva))
                    if(temp){
                        Y.get(temp).setContent("");
                    }
                }
           }
        },
         /*注册联动事件*/
        _addEv:function(o,lv,childOrigin,levelNum){
            Y.on("change",this._selectChange,o,this,lv,childOrigin,levelNum);
        },
        /*联动事件*/
        _selectChange:function(e,lv,childOrigin,levelNum){
            var i,tp,j,startLva;
            this.set("ckJsonValues",[]);
            this.set("ifSelect",0);
            if(childOrigin!==undefined){
                Y.get(childOrigin).setContent("");
            }
           tp=this.get("dataSource").level;
           for(j=0;j<tp.length;j++){
               if(tp[j].length==2){
                    startLva=j;
                    break;
               }
           }
           this._createItem(lv+1,e.target.get("value"),0,levelNum);
           //this._setJsonValue(lv);
           this._createItem(Math.abs(lv+1-startLva),e.target.get("value"),1,levelNum);
           //this._setJsonValue(lv);
         
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
            var levelNum=this.get("levelCount"),tempAar,i,k,tp,originAr,valueAr=this.get("jsonValueAr"),rega=/,+/g,regb=/^,/g,regc=/,$/g,tpStr;
            originAr=this.get("originDoms");
           
            for(k=lv+1;k<valueAr.length;k++){
                valueAr[k]=""
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
        /*select事件处理*/
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
    Y.MulitSelector_MoreChild=MulitSelector_MoreChild;
},'1.0.0',{requires:['k2-cdselector-base']});