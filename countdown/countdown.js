/*!
 * Copyright koubei.com All rights reserved.
 * countdown js
 * @file countdown.js
 * @author <a href="mailto:zhengle.zl@taobao.com">zhengle</a>
 * @revision:
 * @version:1-1-2
 */
YUI.add("k2-countdown",function(Y){
    var CountDown = function(){
        CountDown.superclass.constructor.apply(this, arguments);
    }
    Y.extend(CountDown, Y.Base,{
        _sourceElement:null,
        _totalMs:0,
        _leavingsMs:0,
        _startTime:null,
        _endTime:null,
        _intervalTime:1000,
        _unit:null,
        _strFormat:null, 
        _formatContainer:null,
        _fnOnInterval:null,
        _fnFinished:null,
        _intervalTimerId:null,
        initializer:function(options){
            this._sourceElement = Y.one(options.sourceElement);
            /*
            this._unit = options.unit || "second"; // unit: second/millisecond
            this._startTime = new Date();
            
            var t = (options.totalTime)?options.totalTime : (this._sourceElement.get("innerHTML") || this._sourceElement.get("value"));
            t = parseInt(t);
            if(isNaN(t)){
                throw "invilidate time!";
            }
            
            this._totalMs = (this._unit === "millisecond" )?t : ( t * 1000);
            this._endTime = new Date(this._startTime.getTime() + this._totalMs);
            */
            this.setTotalTime(options.totalTime,options.unit)
            this._intervalTime = options.intervalTime || 1000;
            this._strFormat = options.strFormat || "(dd天)(hh小时)(m分)(s秒)";
            this._formatContainer = options.formatContainer || this._sourceElement;
            this._fnOnInterval = options.onInterval;
            this._fnFinished = options.finished;
        },
        getDay:function(){
            return Math.floor(Math.floor(this._leavingsMs / 1000) / 86400);            
        },
        getHour:function(){           
            return Math.floor(Math.floor(this._leavingsMs / 1000) % 86400 / 3600); 
        },
        getMinute:function(){
            return parseInt((Math.floor(this._leavingsMs / 1000) % 3600) / 60);
        },
        getSecond:function(){ 
            return Math.floor(this._leavingsMs / 1000) % 60; 
        },
        getMillisecond:function(){
            var devide = 1;
            devide = (this._intervalTime / 100 >= 1) ? 100 : ((this._intervalTime / 10 >= 1) ? 10:1);
            this.getMillisecond = function(){
                if(parseInt(this._intervalTime / 1000) > 0){
                    return 0;
                }
                return Math.floor((this._leavingsMs %1000) / devide);
            }
            return this.getMillisecond();
        },
        _numberFill: function(number,length,isFillRight){
            var sRet = number + "";
            while(sRet.length < length){
                if(isFillRight){
                    sRet += "0";
                }else {
                    sRet = "0" + sRet;
                }
            }
            return sRet;
        },
        getFormat:function(cdObj){
            var strFormat = this._strFormat,
                reg = /\b([dhms])\1?|(f{1,3})\b/g,
                numberFill = this._numberFill,
                arrKeys = [],
                arrWords = [],
                keys = {"\\":true,"(":true,")":true,"d":true,"h":true,"m":true,"s":true,"f":true},
                getReplaceText = function(cdObj){
                    return {
                        d:  function(){ return numberFill(cdObj.d,1); },
                        dd: function(){ return numberFill(cdObj.d,2); },
                        h:  function(){ return numberFill(cdObj.h,1); },
                        hh: function(){ return numberFill(cdObj.h,2); },
                        m:  function(){ return numberFill(cdObj.m,1); },
                        mm: function(){ return numberFill(cdObj.m,2); },
                        s:  function(){ return numberFill(cdObj.s,1); },
                        ss: function(){ return numberFill(cdObj.s,2); },
                        f:  function(){ return numberFill(cdObj.ms,1,true); },
                        ff: function(){ return numberFill(cdObj.ms,2,true); },
                        fff: function(){ return numberFill(cdObj.ms,3,true); }
                    };
                },
                replaceText = getReplaceText(cdObj);
            for(var i=0; i<strFormat.length; i++){
                var ch = strFormat.charAt(i);
                if(ch == "\\" ){
                    //arrWords.push({key:ch,pos:i});
                    i++;
                    ch = strFormat.charAt(i);
                    if(ch){
                        arrWords.push({key:ch,pos:i});
                        continue;
                    }
                }
                if(keys[ch]){
                    var lastKey = arrKeys.pop();
                    if(lastKey && ( (lastKey.pos + lastKey.key.length) === i ) && replaceText[ch + lastKey.key]){
                        arrKeys.push({key:ch + lastKey.key,pos:lastKey.pos});
                    } else {
                        if(lastKey){
                            arrKeys.push(lastKey); 
                        }
                        arrKeys.push({key:ch,pos:i});
                    }                   
                } else {
                    arrWords.push({key:ch,pos:i});
                }
            }
            
            this.getFormat = function(cdObj){
                var theKeys = arrKeys.slice(0),
                    theWords = arrWords.slice(0),
                    k = theKeys.shift(),
                    w = theWords.shift(),
                    vals = [],
                    strBuf = [];
                replaceText = getReplaceText(cdObj);                
                while(k || w){
                    if((!w || (k && k.pos < w.pos))){
                        if(k.key == "("){
                            vals.push({key:"(",pos:strBuf.length});
                        } else if(k.key == ")"){
                            var v = vals.pop();
                            if(v == 0){
                                var leftBracket = vals.pop();
                                while(leftBracket && leftBracket.key && leftBracket.key != "("){
                                    leftBracket = vals.pop();
                                }
                                if(leftBracket && vals.length == 0){
                                    strBuf.length = leftBracket.pos;
                                }
                            }
                        } else {
                            if(replaceText[k.key]){
                                var val = replaceText[k.key]();    
                                strBuf.push(val);
                                vals.push(val);
                            }
                        }                    
                        k = theKeys.shift();
                    } else {
                        strBuf.push(w.key);
                        w = theWords.shift();
                    }
                }
                var strRet = strBuf.join("");
                return strRet;
            }
            
            return this.getFormat(cdObj);
        },
        show:function(cdObj){
            if(this._formatContainer){
                this._formatContainer.setContent(this.getFormat(cdObj));            
            }
        },
        _getLeavingsMs: function(){
            var retVal = this._endTime - new Date();
            this._leavingsMs = retVal > 0 ? retVal : 0;
                        
            var cdObj = {
                d:this.getDay(),
                h:this.getHour(),
                m:this.getMinute(),
                s:this.getSecond(),
                ms:this.getMillisecond()
            };                
            return cdObj;
        },
        run:function(){
            var owner = this;
            if(owner._intervalTimerId){
              return;
            }
            this.show(this._getLeavingsMs());
            
            function onInterval(){
                var cdObj = owner._getLeavingsMs();
                var retVal = true;
                if(owner._fnOnInterval){
                    retVal = owner._fnOnInterval(cdObj);
                }
                if(retVal !== false){
                    owner.show(cdObj);
                }
                if(owner._leavingsMs <= 0){                    
                    clearInterval(owner._intervalTimerId);                    
                    if(owner._fnFinished){
                        owner._fnFinished();
                    }
                    //时间到
                    owner._intervalTimerId = null;
                }
            }
            //var intervalId = setInterval(onInterval,this._intervalTime);
            owner._intervalTimerId = setInterval(onInterval,this._intervalTime);
            onInterval();
        },
        stop:function(){
          var owner = this;
          if(owner._intervalTimerId){
            clearInterval(owner._intervalTimerId);
          }
          owner._intervalTimerId = null;
        },
        setTotalTime:function(totalTime,unit){
            this.stop();
            this._unit = unit || this.unit || "second"; // unit: second/millisecond
            this._startTime = new Date();
            var t = (totalTime)?totalTime : (this._sourceElement.get("innerHTML") || this._sourceElement.get("value"));
            t = parseInt(t);
            if(isNaN(t)){
                throw "invilidate time!";
            }

            this._totalMs = (this._unit === "millisecond" )?t : ( t * 1000);
            this._endTime = new Date(this._startTime.getTime() + this._totalMs);
        }
    },
    {
        NAME: "CountDown",
        start:function(ele,_seconds,fnFinished){
            if(ele instanceof Function){            
                fnFinished = ele;
                ele = Y.one(".count-down");
                _seconds = ele.get("innerHTML");
            }
            var cd = new CountDown({sourceElement:ele,totalTime:_seconds,fnFinished:fnFinished,intervalTime:1000});
            cd.run();
            return cd;
        }
    });    
    Y.CountDown = Y.k2countdown = CountDown;    
},'1.0.0',{requires:['base-base','node-base']});