<?php
require_once("../../_assets/demo.php");
?>
<html>
<head>
  <?php echo_html_charset() ?>
  <title>k2-eg</title>
  <meta http-equiv="X-UA-Compatible" content="IE=Edge">
  <?php echo_default_css() ?>
  <style>
  </style>
</head>
<body>
  <h1>k2-eg</h1>
  
  <h2>测试</h2>
  
<div>
<textarea id="minify-url" cols="80" rows="4">http://k.kbcdn.com/min/f=k2/css/reset-1-0-0.css,k2/css/grids-1-0-0.css,/product/common/header/v20100816/header-1-0-35.css,/product/common/hp/v20100816/asset/hp_d-1-0-34.css</textarea>
<button id="check">检查</button>
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
$app_config = '';
echo_default_js($app_config);
?>
<script>
YUI({
    modules : {
        'k2-ping' : {
            fullpath : '../ping.js',
            requires : ['node-base']
        }

    }
}).use('k2-ping', function(Y) {
  Y.log('success','info','k2-eg');
  Y.get('#check').on('click', function(event) {
      event.preventDefault();
      alert(Y.get('#minify-url').get('value'));
  });
});

</script>
</body>
</html>
