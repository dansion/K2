<?php
require_once("../../_assets/demo.php");
?>
<html>
<head>
  <?php echo_html_charset() ?>
  <title>k2-countdown</title>
</head>
<body>
    <span id="countdown1" class="countdown">10</span>
    <span id="container">fff</span>
</body>
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
  }
</script>
<script type="text/javascript">
    YUI().use("k2-countdown",function(Y){
        var ele = Y.one("#countdown1");
        Y.k2countdown.start(ele,parseInt(ele.get("innerHTML")),function(){/*alert("时间到!");*/});
        //Y.k2countdown.start(function(){ele.set("innerHTML","时间到!");});
    });
</script>
</html>