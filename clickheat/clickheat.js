/*!
 * @revision:
 */
/*
 * @author:sanqi
 * @version:1-0-1
 */
YUI.add('k2-clickheat',function(Y){
  Y.log('done','info','k2-clickheat');
  var clickheat = function(o){
    var clickheatTime = 0,
        clickTime,
        clickAble = true,
        KB_TRACK,
        kbTrack,
        YArray = Y.Array,
        selectors,
        group,
        site,
        getBrowse = function(){
          var UA = Y.UA,
              bs = ['ie','gecko','webkit','opera','ipad','iphone','ipod','android'],
              i=0,
              n=bs.length,
              b = 'unkown',
              num;
          for(i,n;i<n;++i){
            b = bs[i],num = UA[b];
            if(num > 0){
               //b += num; //暂时不记录版本号
               break;  
            }  
          }
          return b;    
        };
    o = o || {};    
    Y.mix(o,{
      group : '',
      site : '',     
      server : 'http://p.koubei.com/clickheat/click.php',
      gap : 100,
      permil : 1,
      selector :[], // tags
      KB_TRACK : '_kb_track',
      debug : false
    });

    Y.log(o.group,'info','k2-clickheat');
    Y.log(o.site,'info','k2-clickheat');
    group = o.group;
    site = o.site;
    

    if(group && site){
       clickTime = +new Date;
       Y.log(clickTime,'info','k2-clickheat');

      
         var kbTrack = Y.Cookie.get(o.KB_TRACK),
             nodeBody = Y.one('body'),
             record = Y.throttle(function(e){
	              selectors = o.selector;
	              Y.log(e.target.get('tagName'),'info','k2-clickheat');
	              Y.log('e.which = ' + e.which + ', e.button = ' + e.button,'info','k2-clickheat');
	              Y.log('Y.UA = ' + getBrowse() ,'info','k2-clickheat');
	              if(selectors.length === 0 || Y.Array.indexOf(selectors,e.target.get('tagName'))){
	                Y.log('click! x = ' + e.pageX + ', Y = ' + e.pageY + ', docWidth = ' + Y.DOM.docWidth(),'info','k2-clickheat'); 
	                (new Image()).src = o.server + '?s=' + site + '&g=' + group + '&x=' + e.pageX + '&y=' + e.pageY + '&w=' + Y.DOM.docWidth() + '&b=' + getBrowse() +'&c=' + e.which +'&random=' + +new Date; 
	              }
             },o.gap);

         if((kbTrack && kbTrack.slice(-3) * 1 < o.permil) || o.debug){
            nodeBody.on('mousedown',record); 
            //nodeBody.on('touchend',record); //YUI貌似有问题，暂不支持
           /*
           Y.one('body').on('mousedown',function(e){
              selectors = o.selector;
              Y.log(e.target.get('tagName'),'info','k2-clickheat');
              Y.log('e.which = ' + e.which + ', e.button = ' + e.button,'info','k2-clickheat');
              Y.log('Y.UA = ' + Y.UA ,'info','k2-clickheat');
              if(clickAble && (selectors.length === 0 || Y.Array.indexOf(selectors,e.target.get('tagName')))){
                Y.log('click! x = ' + e.pageX + ', Y = ' + e.pageY + ', docWidth = ' + Y.DOM.docWidth(),'info','k2-clickheat'); 
                (new Image()).src = o.server + '?s=' + site + '&g=' + group + '&x=' + e.pageX + '&y=' + e.pageY + '&w=' + Y.DOM.docWidth() + '&b=' + getBrowse() +'&c=' + e.which +'&random=' + +new Date; 
	              Y.later(o.gap,null,function(){
                  Y.log('clickAble = ' + clickAble,'info','k2-clickheat');
	                clickAble = true;  
	              });
              }
              clickAble = false;
           });               
           */
         }  
    }
  }
  Y.clickheat = clickheat;
},'1.0.0',{requires:['yui-throttle','cookie','node-base','dom-screen','event-touch']});
