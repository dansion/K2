
/*
 * @author: 
 * @version:1-1-1
 */




YUI.add('k2-switch', function(Y) {

    var DOM = Y.DOM, 
        Event = Y.Event,
        Node = Y.Node,
        DISPLAY = 'display',
        BLOCK = 'block', 
        NONE = 'none',
        FORWARD = 'forward', 
        BACKWARD = 'backward',
        DOT = '.',
        EVENT_INIT = 'init',
        EVENT_BEFORE_SWITCH = 'beforeSwitch', EVENT_SWITCH = 'switch',
        CLS_PREFIX = 'ks-switchable-';

    function addStyle( An , att ,val){
      Y.each(An,function(v,i){
          DOM.setStyle(v, att, val);
      })
    }

    
    function Switchable(container, config) {

      this.container = Y.one(container);

      Switchable.superclass.constructor.call(this,config,container);
      
    }

   

    // 插件
    Switchable.Plugins = [];

  //继承自Base，所需要定义的NAME属性
  Switchable.NAME = 'switchable';
  /**
     * Switchable Widget
     * attached members：
     *   - this.container
     *   - this.config
     *   - this.triggers  可以为空值 []
     *   - this.panels    可以为空值 []
     *   - this.content
     *   - this.length
     *   - this.activeIndex
     *   - this.switchTimer
     */
  
  //继承自Base，所需要定义的ATTRS属性
  Switchable.ATTRS = {
    //全局配置对象
    '_config' : {

      'value':{

        markupType: 0, // markup 的类型，取值如下：

        // 0 - 默认结构：通过 nav 和 content 来获取 triggers 和 panels
        navCls: CLS_PREFIX + 'nav',
        contentCls: CLS_PREFIX + 'content',

        // 1 - 适度灵活：通过 cls 来获取 triggers 和 panels
        triggerCls: CLS_PREFIX + 'trigger',
        panelCls: CLS_PREFIX + 'panel',

        // 2 - 完全自由：直接传入 triggers 和 panels
        triggers: [],
        panels: [],

        // 是否有触点
        hasTriggers: true,

        // 触发类型
        triggerType: 'mouse', // or 'click'
        // 触发延迟
        delay: 0.1, // 100ms

        activeIndex: 0, // markup 的默认激活项应与 activeIndex 保持一致
        activeTriggerCls: 'ks-active',
        //switchTo: 0,

        // 可见视图内有多少个 panels
        steps: 1,

        // 可见视图区域的大小。一般不需要设定此值，仅当获取值不正确时，用于手工指定大小
        viewSize: []
         
      }
    },
    '_events':{
      value:{}
    }

  };

   
  // Y.augment(Switchable, Y.EventTarget);

    Y.extend(Switchable, Y.Base,{
   
        /**
         * init switchable
         */
        initializer: function(cfg) {

           
            var self = this, _config = self.get('_config');
            Y.log('init');


            self.activeIndex = _config['activeIndex'];
  
           if(cfg){
              self.set('_config',Y.merge(_config,cfg));
              //Y.merge(self.get('_config'),cfg)
            }

              Y.log(self.get('_config'))

            

           // self.addAttrs(_config, cfg);


          


    
            // parse markup
            self._parseMarkup();

            //

            // 切换到指定项
            if(_config.switchTo) {
                self.switchTo(cfg.switchTo);
            }



           



            // bind triggers
            if (_config.hasTriggers) {
                //Y.log('do','bind triggers start')
                self._bindTriggers();
                //Y.log('do','bind triggers end')
            }


        
           


           
            

            // init plugins
           
            Y.each(Switchable.Plugins, function(plugin) {
                if(plugin.init) {
                    plugin.init(self);
                }
            });


           Y.log('init-end');

  

         




        },

       

   
         

        /**
         * 解析 markup, 获取 triggers, panels, content
         */
        _parseMarkup: function() {
            var self = this, container = self.container,
                cfg = self.get('_config'),
                nav, content, triggers = [], panels = [], i, n, m;

            switch (cfg.markupType) {
                case 0: // 默认结构
                    nav = container.one(DOT + cfg.navCls);
                    if (nav) triggers = nav.get('children');
                    //Y.log(nav);
                    content = container.one(DOT + cfg.contentCls);
                    panels = content.get('children');// Node.children(content);
                     //Y.log(panels);
                    break;
                case 1: // 适度灵活
                    triggers = Y.one(DOT + cfg.triggerCls, container);
                    panels = Y.one(DOT + cfg.panelCls, container);
                    break;
                case 2: // 完全自由
                    triggers = cfg.triggers;
                    panels = cfg.panels;
                    break;
            }


            // get length
            n = panels.size();
              //Y.log(n);
            self.length = n / cfg.steps;

            // 自动生成 triggers
            if (cfg.hasTriggers && n > 0 && triggers.length === 0) {
                
                triggers = self._generateTriggersMarkup(self.length);
                //Y.log('自动生成 triggers');
                //Y.log(self,'this');
            }

            // 将 triggers 和 panels 转换为普通数组 修改了
           
            self.triggers = triggers;//Array.prototype.slice.call(triggers);//Y.makeArray(triggers); //
            self.panels = Y.NodeList.getDOMNodes(panels);//Array.prototype.slice.call(panels);//Y.makeArray(panels);

            // get content
            self.content = content || panels[0].parentNode;
            //Y.log(self.content);
        },

        /**
         * 自动生成 triggers 的 markup
         */
        _generateTriggersMarkup: function(len) {
            var self = this, cfg = self.get('_config'),
                ul = Node.create('<ul></ul>'), li, i;

            ul.addClass(cfg.navCls);
            for (i = 0; i < len; i++) {
                li = Node.create('<li></li>');
                if (i === self.activeIndex) {
                    li.addClass(cfg.activeTriggerCls);
                }
                li.set('innerHTML',i + 1);
                ul.appendChild(li);
            }

            self.container.appendChild(ul);
            return ul.get('children');
        },
        

        /**
         * 给 triggers 添加事件
         */
        _bindTriggers: function() {
          //Y.log('给 triggers 添加事件');
           
            var self = this, cfg = this.get('_config'),
                triggers = self.triggers, trigger,
                // todo  需要修改
                i, len = triggers.size?triggers.size():0;
                //Y.log(len,'len');
            for (i = 0; i < len; i++) {
                (function(index) {
                    trigger = triggers.item(index);
                     //Y.log(index,'index');
                    trigger.on('click', function() {
                        self._onFocusTrigger(index);
                    });

                   if (cfg.triggerType === 'mouse') {

                       
                        trigger.on('mouseenter', function() {
                     
                            self._onMouseEnterTrigger(index);
                        });
                        trigger.on('mouseleave', function() {
                            self._onMouseLeaveTrigger(index);
                        });
                    }
                })(i);
            }
        },

        /**
         * click or tab 键激活 trigger 时触发的事件
         */
        _onFocusTrigger: function(index) {
            var self = this;
            
            if (!self._triggerIsValid(index)) return; // 重复点击

            this._cancelSwitchTimer(); // 比如：先悬浮，再立刻点击，这时悬浮触发的切换可以取消掉。
         
            self.switchTo(index);
            
        },

        /**
         * 鼠标悬浮在 trigger 上时触发的事件
         */
        _onMouseEnterTrigger: function(index) {
            var self = this,cfg = this.get('_config');
            if (!self._triggerIsValid(index)) return; // 重复悬浮。比如：已显示内容时，将鼠标快速滑出再滑进来，不必再次触发。

            Y.log(index)

            self.switchTimer = Y.later(cfg.delay * 1000,self,function() {
                self.switchTo(index);
            });
        },

        /**
         * 鼠标移出 trigger 时触发的事件
         */
        _onMouseLeaveTrigger: function() {
            this._cancelSwitchTimer();
        },

        /**
         * 重复触发时的有效判断
         */
        _triggerIsValid: function(index) {
            return this.activeIndex !== index;
        },

        /**
         * 取消切换定时器
         */
        _cancelSwitchTimer: function() {
            var self = this;
            if(self.switchTimer) {
                self.switchTimer.cancel();
                self.switchTimer = undefined;
            }
        },

        /**
         * 切换操作
         */
        switchTo: function(index, direction) {
            var self = this, cfg = this.get('_config'),
                triggers = self.triggers, panels = self.panels,
                activeIndex = self.activeIndex,
                steps = cfg.steps,
                fromIndex = activeIndex * steps, toIndex = index * steps;

            

            if (!self._triggerIsValid(index)) return self; // 再次避免重复触发
            if (self.fireCustomEvent(EVENT_BEFORE_SWITCH, { fromIndex:fromIndex,toIndex: index}) === false) return self;

            // switch active trigger
            if (cfg.hasTriggers) {
                self._switchTrigger(activeIndex > -1 ? triggers.item(activeIndex) : null, triggers.item(index));
            }

            // switch active panels
            if (direction === undefined) {
                direction = index > activeIndex ? FORWARD : BACKWARD;
            }

            // switch view
            self._switchView(
                panels.slice(fromIndex, fromIndex + steps),
                panels.slice(toIndex, toIndex + steps),
                index,
                direction);


             self._fireOnSwitch(index);

            // update activeIndex
            self.activeIndex = index;

            return self; // chain
        },

        /**
         * 切换当前触点
         */
        _switchTrigger: function(fromTrigger, toTrigger/*, index*/) {
            
            var cfg = this.get('_config');
            
            var activeTriggerCls = cfg.activeTriggerCls;
            //Y.log(fromTrigger,'切换当前触点')
            //Y.log(fromTrigger,'fromTrigger');

            if (fromTrigger) fromTrigger.removeClass(activeTriggerCls);
            if (toTrigger)
            {
              toTrigger.addClass(activeTriggerCls);
            }
            
        },

        /**
         * 切换视图
         */
        _switchView: function(fromPanels, toPanels, index/*, direction*/) {
            // 最简单的切换效果：直接隐藏/显示
        
           //Y.log(123);

           addStyle(fromPanels,DISPLAY,NONE);

           addStyle(toPanels,DISPLAY,BLOCK);
            

            // fire onSwitch events
          
        },

        /**
         * 触发 switch 相关事件
         */
        _fireOnSwitch: function(index) {

          //Y.log(EVENT_SWITCH,'触发 switch 相关事件');

          var self = this;

         
           this.fireCustomEvent(EVENT_SWITCH, { currentIndex: index });
        },

          /**
         * 触发 switch 相关事件
         */
        fireCustomEvent: function(eType,conf) {

         var self = this;
        

            this.fire(eType,conf);
       
           
        },

         //addCustomEvent
        

        addCustomEvent : function(eType,func){

           var self = this;

           if(!eType && !func){
             return;
           }
           if(!self._events){
             self._events = {};
           }

           self._events[eType] = eType;
//
           self.on(eType,func);
         //  Y.on(self._events[eType],func);
          
           
         },


        /**
         * 切换到上一视图
         */
        prev: function() {
            var self = this, activeIndex = self.activeIndex;

            self.switchTo(activeIndex > 0 ? activeIndex - 1 : Math.floor(self.length), BACKWARD);
        },

        /**
         * 切换到下一视图
         */
        next: function() {
            var self = this, activeIndex = self.activeIndex;
            self.switchTo(activeIndex < self.length - 1 ? activeIndex + 1 : 0, FORWARD);
        }
    });


    Y.Switch = Switchable;


},'1-1-0',{requires:['node-base','event-mouseenter','base-base']});

