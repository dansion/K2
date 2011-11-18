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
  <h1>k2-image-cropper</h1>
  <h2>基于k2框架下的Image Cropper组件。</h2>
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
      requires : ['attribute','node','plugin','dd-plugin', 'dd-constrain','dd-proxy','anim','event-mouseenter', 'k2-resize-css']
    },
    
    'k2-image-cropper-css' : {
      fullpath : '/k2/image-cropper/image-cropper.css',
      type: 'css'
    },
    
    'k2-image-cropper' : {
      fullpath : '/k2/image-cropper/image-cropper.js',
      requires : ['base', 'node', 'k2-resize', 'k2-image-cropper-css']
    }
  }

}).use('k2-image-cropper', 'node',function(Y){

    
    var crop = new Y.k2ImageCropper({
        id: "#crop1",
        initialXY: [20, 20],
        initHeight: 100,
        initWidth: 100,
        useKeys: true,
        status: true
    });
    
    // 重置裁剪框位置
    Y.on('click', function(e) {
        
        e.preventDefault();
        crop.reset();
    }, '#reset-btn');
    
    // 获取裁剪框位置信息
    Y.on('click', function(e) {
        
        e.preventDefault();
        var coords = crop.getCropCoords();
        alert("the coords obj: {\n " 
              + "\t top: " + coords.top + ",\n"
              + "\t left: " + coords.left + ",\n"
              + "\t width: " + coords.width + ",\n"
              + "\t height: " + coords.height + ",\n"
              + "\t image: " + coords.image + "\n"
              + "}"
              );
        
    }, '#get-btn');
});
  </pre>
  <h2>参数</h2>
    <table>
      <tr><th>参数</th><th>默认值</th><th>含义</th></tr>
      <tr><td>id</td><td></td><td>选择要进行裁剪的图片，选择器采用css3</td></tr>
      <tr><td>initialXY</td><td>[10, 10]</td><td>裁剪框初始位置，相对于左上角的 [x, y]</td></tr>
      <tr><td>initHeight</td><td>50</td><td>裁剪框初始高度</td></tr>
      <tr><td>initWidth</td><td>50</td><td>裁剪框初始宽度</td></tr>
      <tr><td>useKeys</td><td>false</td><td>是否可以使用键盘控制</td></tr>
      <tr><td>status</td><td>false</td><td>是否显示移动时的状态</td></tr>
    </table>
  <h2>例子</h2>
      <!--<div style="width: 500px; margin: 20px auto;">-->
      <div>
        <img src="../demo/yui.jpg"  id="crop1" alt="">
            <!--<div id="abc"></div>-->
  </div>
  
  <button id="reset-btn">reset</button>
  <button id="get-btn">get coors</button>
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
      requires : ['attribute','node','plugin','dd-plugin', 'dd-constrain','dd-proxy','anim','event-mouseenter', 'k2-resize-css']
    },
    
    'k2-image-cropper-css' : {
      fullpath : '/k2/image-cropper/image-cropper.css',
      type: 'css'
    },
    
    'k2-image-cropper' : {
      fullpath : '/k2/image-cropper/image-cropper.js',
      requires : ['base', 'node', 'k2-resize', 'k2-image-cropper-css']
    }
  }

}).use('k2-image-cropper', 'node',function(Y){

    
    var crop = new Y.k2ImageCropper({
        id: "#crop1",
        config: "bb",
        initialXY: [20, 20],
        initHeight: 100,
        initWidth: 100,
        useKeys: true,
        status: true
    });
    
    // 重置裁剪框位置
    Y.on('click', function(e) {
        
        e.preventDefault();
        crop.reset();
    }, '#reset-btn');
    
    // 获取裁剪框位置信息
    Y.on('click', function(e) {
        
        e.preventDefault();
        var coords = crop.getCropCoords();
        alert("the coords obj: {\n " 
              + "\t top: " + coords.top + ",\n"
              + "\t left: " + coords.left + ",\n"
              + "\t width: " + coords.width + ",\n"
              + "\t height: " + coords.height + ",\n"
              + "\t image: " + coords.image + "\n"
              + "}"
              );
        
    }, '#get-btn');
});
</script>
</body>
</html>
