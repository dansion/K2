<!doctype html>

<html>
<head>
<meta charset="utf-8">
<title>countdown</title>
<link rel="stylesheet" charset="utf-8" href="/k2/css/reset.css">
<link rel="stylesheet" charset="utf-8" href="/k2/_assets/demo.css">
<style type="text/css">
    body{line-height:200%;}
    .example{width:500px; border:solid 1px #ddd; background-color:#eee;padding:5px;margin:5px;}
    #cd5-hour-1,#cd5-hour-2,#cd5-hour-3,#cd5-minute-1,#cd5-minute-2,#cd5-second-1,#cd5-second-2{
    padding:2px 5px; margin:1px;background-color:#440;color:#fff}
    
</style>
</head>
<body>
调用1:<br />
    var config = {sourceElement:cd1,unit:"second",intervalTime:1000,strFormat:"(dd天)(hh小时)(m分)s秒",onInterval:null,finished:function(){cd1.innerHTML = "时间到!"}};
    <br />var cd = new Y.CountDown(config);
    <br />cd.run();
<br />
<p class="example">
    <span id="cd1">20</span>
    <input type="button" id="stop" value="停止" />
    <input type="button" id="start" value="继续" />    
    <input type="button" value="设为1000秒并开始" id="start1" />
    <input type="button" value="设为200000毫秒并开始" id="start2" />
</p>
调用2:<br />
    var config = {sourceElement:cd2,unit:"second",intervalTime:100,strFormat:"(dd天)(hh小时)(m分)(ss秒)(f毫秒)",onInterval:null,finished:function(){cd1.innerHTML = "时间到!"}};
<br />
<p class="example">
    <span id="cd2">6883</span>
</p>
调用3:<br />
    var cd3 = new Y.CountDown({sourceElement:"#cd3"});
<br />    cd3.run();
<br />
<p class="example">
    <span id="cd3">700</span>
</p>
    <p class="example">
      <span id="cd4-day"></span>天<span id="cd4-hour"></span>小时<span id="cd4-minute"></span>分钟<span id="cd4-second"></span>秒
    </p>
    <p class="example">
      <span id="cd5-hour-1"></span><span id="cd5-hour-2"></span><span id="cd5-hour-3"></span>:
      <span id="cd5-minute-1"></span><span id="cd5-minute-2"></span>:
      <span id="cd5-second-1"></span><span id="cd5-second-2"></span>
    </p>
    <h2>配置参数:</h2>
    <table>
    <tr>
        <th>参数名:</th><th>说明</th><th>其他</th>
    </tr>
    <tr>
        <td>sourceElement</td>
        <td>从该元素中读取需要需要倒计的时间</td>
        <td></td>
    </tr>
    <tr>
        <td>totalTime</td>
        <td>总共的需要倒计时的时间(如果设置了这个值,则不会从sourceElement中读取需倒计时的时间)</td>
        <td></td>
    </tr> 
    <tr>
        <td>unit</td>
        <td>输入倒计时间的单位</td>
        <td>可选的参数为秒(second)和毫秒(millisecond),默认为秒</td>
    </tr> 
    <tr>
        <td>intervalTime</td>
        <td>倒计时递减的间隔时间单位为毫秒</td>
        <td>默认为1000</td>
    </tr>
    <tr>
        <td>strFormat</td>
        <td>格式化字符串</td>
        <td>
            默认格式化的字符串"(dd天)(hh小时)(m分)(s秒)".<br />
            格式化规则:d:一位日期,超过一位则都显示.dd:两位日期,日期为1位的前面补0.h,m,s格式化方式类似<br />
            f:毫秒,毫秒最多可以显示三位,如果格式化字符串为fff(显示3位),但间隔倒计时时间为10毫秒,则f只有前两位有效,后面补0<br />
            括号规则为:如果括号中最后一个倒计时参数值为0,则括号中的内容不显示.<br />
            其他:如果要显示"("或者"d","h"等关键字的时候,前面加"\\",如:"\\(","\\d"
            
        </td>
    </tr> 
    <tr>
        <td>onInterval</td>
        <td>每隔intervalTime毫秒执行的函数</td>
        <td></td>
    </tr>
    <tr>
        <td>fnFinished</td>
        <td>倒计时间到以后执行的函数</td>
        <td></td>
    </tr>
    </table>
    
<script charset="utf-8">
//仅用于开发环境

if(typeof K2_config === 'undefined'){
  var K2_config = {
    noCombine : true,//是否使用combo功能，开发环境下支持combo需要配置minfy，默认使用
    noCache : false,//是否在js或css文件尾部增加随机函数来防止浏览器缓存，默认使用
    console : true,//是否使用通用的console控制台，这样就可以在页面显示Y.log内容，默认使用
                   //失效时，请查看对应的YUI实例需要使用event-custom-base模块
    noVersion : true,//是否使用不带版本号的文件，这样就可以直接调用本地开发文件，因为这些文件都是不带版本号的，默认使用
    syntaxHighlight : true,//是否格式化代码显示，默认使用
    local : true //是否使用本地路径，即类似/k2/seed/seed.js这样的绝对路径，这样无论你是什么本地域名都可以使用，
                 //否则使用类似http://k.kbcdn.com/k2/seed/seed.js这样的绝对路径，默认使用
  }  
}

</script>
<script charset="utf-8" src="/k2/seed/seed.js"></script>
<script charset="utf-8" src="/k2/_assets/config.js"></script>
<script charset="utf-8">
/*
  if(YUI_config.groups){
    YUI_config.groups.appCountDown= {
       combine:false,
       base :'../',
       root :'',
       modules:{
         'k2-countdown':{
           path:'countdown.js',
           requires:["base-base",'node-base']
         }
       }
    };
  }*/
</script>
<script type="text/javascript">
    YUI().use("k2-countdown",function(Y){        
        var cd1 = Y.one("#cd1");
        var cd2 = Y.one("#cd2");
        var cd3 = Y.one("#cd3");
        
        var config = {sourceElement:"#cd1",unit:"second",intervalTime:1000,strFormat:"(dd天)(hh小时)(m分)s秒",onInterval:null,finished:function(){cd1.innerHTML = "时间到!"}};
        var cd = new Y.CountDown(config);
        cd.run();
        
        /*
        setTimeout(function(){        
          cd.stop();
          alert("第一个停止!");
        },10000);
        */
        
        Y.one("#stop").on("click",function(){
          cd.stop();
        });
        
        Y.one("#start").on("click",function(){
          cd.run();
        });
        
        Y.one("#start1").on("click",function(){
          cd.setTotalTime(1000);
          cd.run();          
        });
        
        Y.one("#start2").on("click",function(){
          cd.setTotalTime(200000,"millisecond");
          cd.run();
        });
        
        config.sourceElement = cd2;
        config.intervalTime = 100;
        config.strFormat = "(dd天)(hh小时)(m分)(s秒)(f毫秒)";
        var cd2 = new Y.CountDown(config);
        cd2.run();
                
        var cd3 = new Y.CountDown({sourceElement:"#cd3"});
        cd3.run();
        
        
        config.sourceElement = null;
        config.strFormat = null;
        config.onInterval = function(cdObj){
          
        }
        
        var cd4 = new Y.CountDown({onInterval:function(cdObj){
          Y.one("#cd4-day").set("innerHTML",cdObj.d);
          Y.one("#cd4-hour").set("innerHTML",cdObj.h);
          Y.one("#cd4-minute").set("innerHTML",cdObj.m);
          Y.one("#cd4-second").set("innerHTML",cdObj.s);
        },totalTime:81400})
        cd4.run();
        
        var cd5 = new Y.CountDown({onInterval:function(cdObj){
          var hours = cdObj.d * 24 + cdObj.h;
          Y.one("#cd5-hour-1").set("innerHTML",parseInt(hours / 100));
          Y.one("#cd5-hour-2").set("innerHTML",parseInt((hours % 100) / 10));
          Y.one("#cd5-hour-3").set("innerHTML",parseInt(hours % 10));
          Y.one("#cd5-minute-1").set("innerHTML",parseInt(cdObj.m / 10));
          Y.one("#cd5-minute-2").set("innerHTML",parseInt(cdObj.m % 10));
          Y.one("#cd5-second-1").set("innerHTML",parseInt(cdObj.s / 10));
          Y.one("#cd5-second-2").set("innerHTML",parseInt(cdObj.s % 10));
        },totalTime:131352})
        cd5.run();
    });
</script>
</body>
</html>