/*!
 * Copyright koubei.com All rights reserved.
 * countdown js
 * @file countdown.js
 * @author <a href="mailto:zhengle.zl@taobao.com">zhengle</a>
 * @revision:
 * @version:1-0-1
 */
YUI.add("k2-countdown",function(Y){
    Y.k2countdown = function(){       
        function timeFormat(_seconds){
            var days = parseInt(_seconds / 86400),
                hours = parseInt((_seconds % 86400) / 3600),
                minutes =  parseInt((_seconds % 3600) / 60),
                seconds = parseInt(_seconds % 60);
            
            var strBuffer = [];
            var isMust = false;
            if(days != 0){            
                isMust = true;
                strBuffer.push(days + "天" );
            }
            
            if(isMust || hours != 0){          
                isMust = true;             
                strBuffer.push(hours + "小时" );
            }
            
            if(isMust || minutes != 0){                
                strBuffer.push(minutes + "分" );
            }
                          
            strBuffer.push(seconds + "秒" );
            
            return strBuffer.join("");
        }
        function _init(ele,_seconds,fnFinished){
            ele = Y.one(ele);
            if(!ele){return;}
            ele.set("innerHTML",timeFormat(_seconds));
            
            var intervalId = setInterval(function(){
                if(_seconds <= 0){       
                    clearInterval(intervalId);   
                    if(fnFinished){
                        fnFinished();
                    }
                } else {                    
                    _seconds--;
                    ele.set("innerHTML",timeFormat(_seconds));   
                }
            },1000);
        }
        
        return {
            start:function(ele,_seconds,fnFinished){
                if(ele instanceof Function){
                    fnFinished = ele;
                    ele = Y.one(".count-down");
                    _seconds = ele.get("innerHTML");
                }
                _init(ele,_seconds,fnFinished);
            }            
        };        
    }();
},'1.0.0',{requires:['node-base']});