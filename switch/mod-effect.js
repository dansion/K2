/*
 * @author:
 * @version:1-1-1
 */


YUI().add('k2-switch-effect', function(Y, undefined) {

    var DOM = Y.DOM, Anim = Y.Anim,
        DISPLAY = 'display', BLOCK = 'block', NONE = 'none',
        OPACITY = 'opacity', Z_INDEX = 'z-index',
        FORWARD = 'forward', 
        BACKWARD = 'backward',
        POSITION = 'position', RELATIVE = 'relative', ABSOLUTE = 'absolute',
        SCROLLX = 'scrollx', SCROLLY = 'scrolly', SCROLLCIRCULARX = 'scrollcircularx', SCROLLCIRCULARY = 'scrollcirculary',FADE = 'fade',
        LEFT = 'left', TOP = 'top', FLOAT = 'float', PX = 'px',Lang = Y.Lang,
        Switchable = Y.Switch, Effects;

    /**
     * 添加默认配置
     */
    //Y.mix(Switchable.Config, );

     function addStyle( An , att ,val){
      Y.each(An,function(v,i){
          DOM.setStyle(v, att, val);
      })
    }

    /**
     * 定义效果集
     */
    Switchable.Effects = {

        // 最朴素的显示/隐藏效果
        none: function(fromEls, toEls, callback) {

            addStyle(fromEls, DISPLAY, NONE);
            addStyle(toEls, DISPLAY, BLOCK);
           callback();
        },

        // 淡隐淡现效果
        fade: function(fromEls, toEls, callback,index) {

            var props = {};
            if (fromEls.length !== 1) {
               Y.error('fade effect only supports steps == 1.');
            }
            var self = this, cfg = self.get('_config'),
                fromEl = fromEls[0], toEl = toEls[0];

            if (self.anim) self.anim.stop(true);

            // 首先显示下一张

            
            DOM.setStyle(toEl, OPACITY, 1);

            props.node = fromEl;

           props.duration =  cfg.duration;

           props.to = { opacity: 0};

           props.easing = cfg.easing;

           // 动画切换
           //Y.log(123);
           //Y.log(fromEl);
           self.anim = new Y.Anim(props);// self._anim(fromEl,props,index);
           
          

          //避免start end反复注册

        
          
            self.anim.on('start',function(){
              // alert(13)
                 DOM.setStyle(fromEl, 'zIndex', 3);
            });
          
        


           

           self.anim.on('end',function(){
               DOM.setStyle(fromEl, 'zIndex', 1);
               DOM.setStyle(toEl, 'zIndex', 2);
           });

           self.anim.run();

           
        },

       

        // 水平/垂直滚动效果
        scroll: function(fromEls, toEls, callback, index) {
            var self = this, cfg = self.get('_config'),
                isX = cfg.effect === SCROLLX,
                diff = self.viewSize[isX ? 0 : 1] * index,
                props = { to : {} };
                
          
               

            props.to[isX ? LEFT : TOP] = -diff + PX;
            
         
            if (self.anim) self.anim.stop();
           //Y.log(cfg.duration,'cfg.duration');
           //Y.log(props,'props');

           //Y.log(self.content,'content');


           props.node = self.content;

           props.duration =  cfg.duration;


           props.easing = cfg.easing;

          self.anim = self._anim(props.node._yuid,props,index);

          self.anim.run();


        },
        
        // 子节点和父节点一起动，不用滚动到第一张
        scrollCircular: function(fromEls, toEls, callback, index, direction) {
            var self = this, cfg = self.get('_config'),
                isX = (cfg.effect === SCROLLCIRCULARX),
                diff = self.viewSize[isX ? 0 : 1], // * index,
                props = { to : {} },
                isForward = (FORWARD==direction),
                content =  self.content,
                children = content.get('children');


                props.to[isX ? LEFT : TOP] = isForward ? (-diff + PX): 0 ;
                
             
            
              
                if (self.anim) self.anim.pause();


                   props.node = self.content;
    
                   props.duration = cfg.duration;
    
    
                   props.easing = cfg.easing;
    
                   self.anim = new Y.Anim(props);//self._anim(props.node._yuid,props,index);
               
               //start
               
               if(!isForward){

                  content.prepend(children.pop());
                  //content.setStyle(isX ? LEFT : TOP, '-130px');

                  content.setStyle('left', -diff+PX);

               }else{
                
                 content.setStyle('left', 0);
               
               }
    
          
               /*self.anim.on('start',function(ev){
    
                   if(!isForward){
    
                      content.prepend(children.pop());
                      //content.setStyle(isX ? LEFT : TOP, '-130px');
    
                      content.setStyle('left', '-1000px');
                      
                     // alert(11)
    
                    }
    
                   // Y.log(isForward);
                });*/
          
                  // 暂停的时候 事件处理
    
                  self.anim.on('pause',function(ev){
    
                    delete self.anim;
    
                  });
          
          
                  self.anim.on('end',function(ev){
    
    
                    if(isForward){
                    
                      content.append(children.shift());
    
                      content.setStyle(isX ? LEFT : TOP,'0');
    
                    }
                    
                   
    
    
                  });
    
     

                  self.anim.run();


        }
    };
    Effects = Switchable.Effects;
    Effects[SCROLLX] = Effects[SCROLLY] = Effects.scroll;
    
     Effects[SCROLLCIRCULARX] = Effects[SCROLLCIRCULARY] = Effects.scrollCircular;
    

    /**
     * 添加插件
     * attached members:
     *   - this.viewSize
     */
   
    Switchable.Plugins.push({

        name: 'effect',

        /**
         * 根据 effect, 调整初始状态
         */
        init: function(host) {


              host.set('_config',Y.mix(host.get('_config'),{
                    effect: NONE, // 'scrollx', 'scrolly', 'fade' 或者直接传入 custom effect fn
                    duration: .5, // 动画的时长
                    easing: 'easeNone' // easing method
              }));

               

            var cfg = host.get('_config'), effect = cfg.effect,
                panels = host.panels, content = host.content,
                steps = cfg.steps,
                activeIndex = host.activeIndex,
                len = panels.length;

        

            // 1. 获取高宽

            //alert(panels[0].offsetWidth);
            host.viewSize = [
                cfg.viewSize[0] || panels[0].offsetWidth * steps,
                cfg.viewSize[1] || panels[0].offsetHeight * steps
            ];
            // 注：所有 panel 的尺寸应该相同
            //    最好指定第一个 panel 的 width 和 height, 因为 Safari 下，图片未加载时，读取的 offsetHeight 等值会不对

            // 2. 初始化 panels 样式
            if (effect !== NONE) { // effect = scrollx, scrolly, fade 

                // 这些特效需要将 panels 都显示出来
              
                
                
                
        

                switch (effect) {
                    // 如果是滚动效果
                    
                    
                    case SCROLLX:
                    case SCROLLY:
                    case SCROLLCIRCULARX:
                    case SCROLLCIRCULARY:
                        // 设置定位信息，为滚动效果做铺垫
                       content.get('parentNode').setStyle(POSITION, RELATIVE); // 注：content 的父级不一定是 container
                       content.setStyle(POSITION, ABSOLUTE);
                       

                        // 水平排列
                        if (effect === SCROLLX) {  //
                            addStyle(panels, FLOAT, LEFT);

                            // 设置最大宽度，以保证有空间让 panels 水平排布

                           // alert(host.viewSize[0]);
                            content.setStyle('width',host.viewSize[0] * (len / steps));

                        }
                        
                        if (effect === SCROLLCIRCULARX) {  //
                            //addStyle(panels, FLOAT, LEFT);

                            // 设置最大宽度，以保证有空间让 panels 水平排布

                           // alert(host.viewSize[0]);
                           
                            //alert(1)
                            content.setStyle('width',host.viewSize[0] * (len / steps));

                        }
                        
                        
                        break;

                    // 如果是透明效果，则初始化透明
                    case FADE:
                        var min = activeIndex * steps,
                            max = min + steps - 1,
                            isActivePanel;

                       Y.each(panels, function(panel, i) {
                            isActivePanel = i >= min && i <= max;
                            DOM.setStyles(panel, {
                                opacity: isActivePanel ? 1 : 0,
                                position: ABSOLUTE,
                                zIndex: isActivePanel ? 9 : 1
                            });
                        });
                        break;
                        
                    default:
                     addStyle(panels,DISPLAY, BLOCK);
                     
                            
                            
                }
            }

            // 3. 在 CSS 里，需要给 container 设定高宽和 overflow: hidden
        }
    });

    /**
     * 覆盖切换方法
     */

   var test = function(){};

   test.prototype = {


        _switchView: function(fromEls, toEls, index, direction) {
            var self = this, cfg = self.get('_config'),
                effect = cfg.effect,
                fn = Lang.isFunction(effect) ? effect : Effects[effect];
            
            fn.call(self, fromEls, toEls, function() {
                self._fireOnSwitch(index);
            }, index, direction);

            //Y.log('覆盖切换方法');
          
        },

        //
        _anim : Y.cached(function(_yuid,props){
        
          return new Y.Anim(props);
        })



    };
   
   Y.augment(Switchable,test,true);

    

},'1.1.0',{requires:['anim-easing','anim-curve','k2-switch']});
