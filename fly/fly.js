/*!
 * Copyright koubei.com All rights reserved.
 * fly js
 * @file fly.js
 * @author <a href="mailto:zhengle.zl@taobao.com">zhengle</a>
 * @revision:
 * @version:1-0-2
 */
/* ele:动画的元素,
 * target:移动到该元素所在的位置,
 * duration:执行时间
 * finished:结束后执行的函数
 * config {
 *   ele_offsetX : 起点的x偏移
 *   ele_offsetY : 起点的y偏移
 *   target_offsetX : 终点的x偏移
 *   target_offsetY : 终点的y偏移
 * } 
 */
 YUI.add("k2-fly",function(Y){
    Y.k2fly = function(ele,target,duration,fn,config){
        var pos_ele = ele.getXY(),
            pos_target = target.getXY(),
            config = config || {},
            ele_offX = config.ele_offsetX || 0,
            ele_offY = config.ele_offsetY || 0,
            target_offX = config.target_offsetX || 0,
            target_offY = config.target_offsetY || 0,
            c_ele = ele.cloneNode(true),    //deep clone
            $body = Y.one("body");
              
        c_ele.setStyles({
            position : 'absolute', 
            top : pos_ele[1] + ele_offY + "px", 
            left : pos_ele[0] + ele_offX+ "px", 
            width : ele.getStyle("width"), 
            height : ele.getStyle("height")
        });
         
        
        var anim = new Y.Anim({
            node : c_ele,
            to : { width:0, height:0, top : pos_target[1] + target_offY + "px", left : pos_target[0] + target_offX + "px"},
            easing : Y.Easing.easeBoth,
            duration : duration,
            intervalTime : 33
        });
        
        anim.on("end",function(){
            c_ele.remove();
            if(fn){ fn(); }
        }); 
        
        $body.append(c_ele);    
        anim.run();        
    }
 },'1.0.0',{requires:['node-base','dom-base','node-screen','anim-base','anim-easing']});