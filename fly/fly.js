/*!
 * Copyright koubei.com All rights reserved.
 * fly js
 * @file fly.js
 * @author <a href="mailto:zhengle.zl@taobao.com">zhengle</a>
 * @revision:
 * @version:1-0-2
 */
/* ele:������Ԫ��,
 * target:�ƶ�����Ԫ�����ڵ�λ��,
 * duration:ִ��ʱ��
 * finished:������ִ�еĺ���
 * config {
 *   ele_offsetX : ����xƫ��
 *   ele_offsetY : ����yƫ��
 *   target_offsetX : �յ��xƫ��
 *   target_offsetY : �յ��yƫ��
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