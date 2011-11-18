/*!
 * Copyright koubei.com All rights reserved.
 * number js
 * @file number.js
 * @author <a href="mailto:zhengle.zl@taobao.com">zhengle</a>
 * @revision:
 * @version:1-0-1
 */
 /* number(48-57,96-105),up(38),down(40),left(37),right(39),backspace(8),delete(46),home(36),end(35) */
 YUI.add("k2-number",function(Y){
    var keys = [8,35,36,37,38,39,40,46,48,49,50,51,52,53,54,55,56,57,96,97,98,99,100,101,102,103,104,105,116];
    Y.k2number = function(){
        function _init(elems,min,max,fnOnLess,fnOnOver){
            var min = (typeof min == "undefined")?1:min,
                max = (typeof max == "undefined")?99:max,
                timeLessId = null;
                
            elems.setStyle("imeMode","disabled");
            elems.on("keydown",function(evt){
               for(var i = 0,l = keys.length; i<l; i++){
                   if(keys[i] == evt.keyCode){
                        return;
                   }
               }
               evt.preventDefault();
            });
            
           elems.on("blur",function(evt){
                var ele = evt.target,
                    val = ele.get("value");
                if(val == "" || parseInt(val) < min){
                    ele.set("value",min);
                }
           }); 
           
           elems.on("keyup",function(evt){
                var ele = evt.target,
                    val = ele.get("value");
                val = parseInt(val);
                
                if(evt.keyCode == 38 || evt.keyCode == 40){
                    if(isNaN(val)){
                        val = (evt.keyCode == 38)?min:max;
                    } else {
                        if(evt.keyCode == 38){
                            val++;
                        } else {
                            val--;
                            if(val < min){
                                val = min;
                            }
                        }
                    }                    
                    ele.set("value",val);
                }
                
                if(timeLessId){
                    clearTimeout(timeLessId);
                }
                
                if(!isNaN(val) && val > max){
                    val = max;
                    ele.set("value",val);
                    if(fnOnOver){
                        fnOnOver(evt.target);
                    }
                }
                
                if(!isNaN(val) && val < min){
                    if(fnOnLess){
                        timeLessId = setTimeout(function(){
                            fnOnLess(evt.target);
                        },2000);
                    }
                }
           });
           
           elems.on("focus",function(evt){
                setTimeout(function(){evt.target.select();},10);
           });
        }
        
        return {
            init:function(min,max,fnOnLess,fnOnOver){
                _init(Y.all(".k2-number"),min,max,fnOnLess,fnOnOver);
            },
            initOne:function(elem,min,max,fnOnLess,fnOnOver){
                _init(Y.one(elem),min,max,fnOnLess,fnOnOver);
            },
            initAll:function(elem,min,max,fnOnLess,fnOnOver){
                _init(Y.all(elem),min,max,fnOnLess,fnOnOver);
            }
        }
    }()
 },'1.0.0',{requires:['node-base','node-style','event-base']});