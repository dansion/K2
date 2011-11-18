/*
 * @author:
 * @version:1-1-0
 */

YUI().add('k2-switch-autoplay', function(Y, undefined) {

    var Event = Y.Event,
        Switchable = Y.Switch;
    /**
     * 添加默认配置
     */
     
    Y.mix(Switchable.Config, {
        autoplay: false,
        interval: 5, // 自动播放间隔时间
        pauseOnHover: true  // triggerType 为 mouse 时，鼠标悬停在 slide 上是否暂停自动播放
    });

    /**
     * 添加插件
     * attached members:
     *   - this.paused
     */
    Switchable.Plugins.push({

        name: 'autoplay',

        init: function(host) {

          

 
              /*host.set('_config',Y.merge(host.get('_config'),{
                  autoplay: true,
                  interval: 5, // 自动播放间隔时间
                  pauseOnHover: true  // triggerType 为 mouse 时，鼠标悬停在 slide 上是否暂停自动播放
              }));*/

              Y.mix(host.get('_config'),{
                  autoplay: false,
                  interval: 5, // 自动播放间隔时间
                  pauseOnHover: true  // triggerType 为 mouse 时，鼠标悬停在 slide 上是否暂停自动播放
              })

         


       

         
            var cfg = host.get('_config'), interval = cfg.interval * 1000, timer;
           
            if (!cfg.autoplay) return;

            // 鼠标悬停，停止自动播放
            if (cfg.pauseOnHover){
                host.container.on('mouseenter', function() {
              
                    if(timer && timer.cancel) {
                        timer.cancel();
                        timer = undefined;
                    }
                    host.paused = true; // paused 可以让外部知道 autoplay 的当前状态
                });
                host.container.on('mouseleave', function() {
                    host.paused = false;
                 
                    startAutoplay();
                });
            }

            function startAutoplay() {
                // 设置自动播放
  
                timer = Y.later(interval,null,function() {
                    if (host.paused) return;

                    // 自动播放默认 forward（不提供配置），这样可以保证 circular 在临界点正确切换
                    host.switchTo(host.activeIndex < host.length - 1 ? host.activeIndex + 1 : 0, 'forward');
                }, null,true);
            }

            // go
            startAutoplay();
        }
    });

},'1-1-0',{requires:['k2-switch']});
