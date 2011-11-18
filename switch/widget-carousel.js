/*
 * @author:
 * @version:1-1-0
 */

YUI.add('k2-switch-carousel', function(Y, undefined) {

    var DOM = Y.DOM, Event = Y.Event,
        CLS_PREFIX = 'ks-switchable-', DOT = '.',
        PREV_BTN = 'prevBtn', NEXT_BTN = 'nextBtn',

        /**
         * 默认配置，和 Switchable 相同的部分此处未列出
         */
        defaultConfig = {
            circular: true,
            prevBtnCls: CLS_PREFIX + 'prev-btn',
            nextBtnCls: CLS_PREFIX + 'next-btn',
            disableBtnCls: CLS_PREFIX + 'disable-btn'
        };

    /**
     * Carousel Class
     * @constructor
     */
    function Carousel(container, config) {
        var self = this;

        // factory or constructor
        if (!(self instanceof Carousel)) {
            return new Carousel(container, config);
        }

        // 插入 carousel 的初始化逻辑

        //Y.log(self.addCustomEvent);
       
       

        // call super
        Carousel.superclass.constructor.call(self, container, Y.merge(defaultConfig, config));
       // self.addCustomEvent('init', function() { init_carousel(self); });
    }

    Y.extend(Carousel, Y.Switch,{
    
    /**
     * Carousel 的初始化逻辑
     * 增加了:
     *   self.prevBtn
     *   self.nextBtn
     */
      initializer:function(host){

           
       var self = this, cfg = self.get('_config'), disableCls = cfg.disableBtnCls;


       

 

        // 获取 prev/next 按钮，并添加事件
        Y.each(['prev', 'next'], function(d) {
            var btn = self[d + 'Btn'] = self.container.all(DOT + cfg[d + 'BtnCls']);

         /*   Event.on(btn, 'click', function(ev) {
                ev.preventDefault();
                if(!DOM.hasClass(btn, disableCls)) self[d]();
            });
            */
            btn.on('click',function(ev){
              ev.halt();
              if(!ev.currentTarget.hasClass(disableCls)) self[d]();
            });


        });

        //如果没有满一个试图，那么就disable



        // 注册 switch 事件，处理 prevBtn/nextBtn 的 disable 状态
        // circular = true 时，无需处理

       

        if(self.length <= 1){
          self[NEXT_BTN].addClass(disableCls);
          self[PREV_BTN].addClass(disableCls);
        }


        if (!cfg.circular) {


          

         
            self.addCustomEvent('switch', function(ev) {
               
                var i = ev.currentIndex,
                    disableBtn = (i === 0) ? self[PREV_BTN]
                        : (i === self.length - 1) ? self[NEXT_BTN]
                        : undefined;

                 //Y.log(i,'carousel','currentIndexs');

                 //Y.log(self[PREV_BTN],'disableBtn','currentIndexs');
               


                if(i === 0){
                  self[PREV_BTN].addClass(disableCls);
                  self[NEXT_BTN].removeClass(disableCls);
                }else if(i === self.length - 1){
                  self[NEXT_BTN].addClass(disableCls);
                  self[PREV_BTN].removeClass(disableCls);
                }else{
                  self[PREV_BTN].removeClass(disableCls);
                  self[NEXT_BTN].removeClass(disableCls);
                }
            });

        }

        // 触发 itemSelected 事件
       // alert(self.panels)

        Y.on('click', function(ev) {
      
  
           self.fireCustomEvent('itemSelected', {'item' : ev.currentTarget});

        },self.panels);
      
      
      
      }
    
    
    
    });
    Y.Carousel = Carousel;
    

    

},'1-1-0',{requires:['k2-switch']});


