<?php
require_once("../../_assets/demo.php");
?>
<html>
<head>
  <?php echo_html_charset() ?>
  <title>k2-resize</title>
  <meta http-equiv="X-UA-Compatible" content="IE=Edge">
  <?php echo_default_css() ?>
  <!--<link rel="stylesheet" href="../resize.css" />-->
  <!--<link rel="stylesheet" href="http://k.kbcdn.com/k2/resize/resize-1-0-0.css" />-->
  <style>
   #demo {
    /*background: red;*/
    padding: 5px;
   }
  </style>
</head>
<body>
  <h1>k2-resize</h1>
  <h2>基于k2框架下的resize组件。以plugin的形式进行，不对需要resize的对象外面建一个wrap元素进行包装，而是直接对元素进行resize。如果需要对image或者textarea进行resize，可自己在外面套一层div的wrap。</h2>
  <!--<ol>-->
  <!--  <li>需要引用css与js文件-->
  <!--  <pre class="brush:css">-->
  <!--    <link rel="stylesheet" href="http://k.kbcdn.com/k2/resize/resize-1-0-0.css" />-->
  <!--  </pre> -->
  <!--  </li>-->
  <!--  <li>description</li>-->
  <!--</ol>-->
  
  <h2>Code</h2>
  <pre class="brush:javascript;">
YUI({

  modules : {
    'k2-resize-css' : {
      fullpath : '/k2/resize/resize.css',
      type: 'css'
    },
    'k2-resize' : {
      fullpath : '/k2/resize/resize.js',
      requires : ['attribute','node','plugin','dd-plugin','dd-proxy','anim','event-mouseenter', 'k2-resize-css']
    }
  }

}).use('k2-resize', function(Y){
    

    Y.one('#demo').plug(Y.Plugin.Resize, {
      handles: "all",
      proxy: false,
      //knobHandles: true,
      status: true,
      ghost: true,
      //ratio: true,
      useShim: true,
      hugWrappedEl: true,
      width: 180,
      height: 100,
      draggable: true
      //hiddenHandles: false,
      //hover: true
    });
    
});
  </pre>
  <h2>参数</h2>
    <table>
      <tr><th>参数</th><th>默认值</th><th>含义</th></tr>
      <tr><td rowspan="3">handles</td><td>[ "r", "br", "b"]</td><td>显示拖动标识，默认在右边底部和右下角</td></tr>
      <tr><td>"all"</td><td>显示拖动标识, 所有的方位显示</td></tr>
      <tr><td>['t', 'b', 'r', 'l', 'bl', 'br', 'tl', 'tr']</td><td>以数组的形式表示，显示想要出现拖动标识的位置</td></tr>
      <tr><td>proxy</td><td>false</td><td>是否设置代理模式, 若为true则调用dd-plugin的方法</td></tr>
      <tr><td>status</td><td>false</td><td>是否显示改变的位置的状态，大小</td></tr>
      <tr><td>height</td><td>整数值</td><td>被resize元素的高度</td></tr>
      <tr><td>width</td><td>整数值</td><td>被resize元素的宽度</td></tr>
      <tr><td>draggable</td><td>false</td><td>被resize元素是否可拖动</td></tr>
      <tr><td>ghost</td><td>false</td><td>被resize元素拖动时是否有半透明效果</td></tr>
      <tr><td>knobHandles</td><td>false</td><td>被resize元素是否显示正方形的handle</td></tr>
    </table>
  <h2>例子</h2>
    <div id="demo">
      这是一个可移动的模块<br/>
      这是一个可改变大小的模块。 resize模块
    </div>
<script>
//仅用于开发环境
if(typeof K2_config === 'undefined'){
  var K2_config = {
    noCombine : true,//是否使用combo功能，开发环境下支持combo需要配置minfy，默认使用
    noCache : true,//是否在js或css文件尾部增加随机函数来防止浏览器缓存，默认使用
    console : true,//是否使用通用的console控制台，这样就可以在页面显示Y.log内容，默认使用
                   //失效时，请查看对应的YUI实例需要使用event-custom-base模块
    noVersion : true,//是否使用不带版本号的文件，这样就可以直接调用本地开发文件，因为这些文件都是不带版本号的，默认使用
    syntaxHighlight : true,//是否格式化代码显示，默认使用
    local : true //是否使用本地路径，即类似/k2/seed/seed.js这样的绝对路径，这样无论你是什么本地域名都可以使用，
                 //否则使用类似http://k.kbcdn.com/k2/seed/seed.js这样的绝对路径，默认使用
  }  
}
</script>
<?php
//应用组建是指跨2个产品以上的和产品直接相关的组建，比如点评，留言板等
//应用组建的模块信息是通过特定的CMS来管理的，使用该模块时需要在页面上引入对应的jsp文件
//此处定义应用应用组建的模块信息，会直接注入到全局变量中
//命名方式请采用app + 模块名的方式，防止冲突和覆盖
$app_config = '';
/*
//如果在修改时报错，请确定KB_APP_Config后面是否有空格
$app_config = <<< KB_APP_Config
<script>
if(YUI_config.groups){
  YUI_config.groups.appDianPing = {
     combine: true,
     base :'http://k.kbcdn.com/k2',
     root :'k2/',
     modules:{
       'app-dianping':{
         path : 'ww/ww-1-0-0.js',
         requires : ['node-base','node-event-delegate','stylesheet']  
       }  
     }  
  };  
}
</script>
KB_APP_Config;
*/
echo_default_js($app_config);
?>
<script>



YUI({

  modules : {
    'k2-resize-css' : {
      fullpath : '/k2/resize/resize.css',
      type: 'css'
    },
    'k2-resize' : {
      fullpath : '/k2/resize/resize.js',
      requires : ['attribute','node','plugin','dd-plugin','dd-proxy','anim','event-mouseenter', 'k2-resize-css']
    }
  }

}).use('k2-resize', function(Y){
    

    Y.one('#demo').plug(Y.Plugin.Resize, {
      handles: "all",
      proxy: false,
      //animate: true,
      //knobHandles: true,
      //status: true,
      ghost: true,
      ratio: true,
      useShim: true,
      hugWrappedEl: true,
      width: 180,
      height: 100,
      draggable: true
      //hiddenHandles: false,
      //hover: true
    });
    
});
</script>
</body>
</html>
