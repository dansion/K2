<?php
require_once("../../_assets/demo.php");
?>
<html>
<head>
  <?php echo_html_charset() ?>
  <title>k2-clickheat</title>
  <meta http-equiv="X-UA-Compatible" content="IE=Edge">
  <?php echo_default_css() ?>
  <style>
  </style>
</head>
<body>
  <h1>k2-clickheat</h1>
  <h2>说明</h2>
  <p>记录页面上用户的点击，生成用户的点击云。</p>
  <h2>Code</h2>
  <pre class="brush:javascript;">
YUI().use('k2-clickheat',function(Y){
  //group和site是必填的参数，site是具体站点，group是站点中的某一组，便于找到具体结果
  Y.clickheat({site:'homepage',group:'hangzhou'});
});
  </pre>
  <h2>参数</h2>
    <table>
      <tr><th>参数</th><th>默认值</th><th>含义</th></tr>
      <tr><td>group</td><td>必填</td><td>站点分组名</td></tr>
      <tr><td>site</td><td>必填</td><td>具体站点名</td></tr>
      <tr><td>server</td><td>http://p.koubei.com/clickheat/click.php</td><td>记录数据的接口路径</td></tr>
      <tr><td>gap</td><td>100</td><td>两次有效点击的最短时间间隔，默认100ms</td></tr>
      <tr><td>permil</td><td>1</td><td>获取数据的千分率，默认是千分之一</td></tr>
      <tr><td>selector</td><td>[]</td><td>对指定标签进行监控，默认是对所有标签,如果想对只想对a标签，则设置为['a']</td></tr>
      <tr><td>debug</td><td>false</td><td>在开发环境中设置为true时，则千分率的设置失效，便于测试</td></tr>
    </table>
  <h2>数据查看</h2>
  <p>查看入口：<a href="http://p.koubei.com/clickheat/index.php" target="_blank">clickheat管理</a>，用户名：admin，密码：hello1234。</p>
  <h2>例子</h2>
  <pre class="brush:javascript;">
YUI().use('k2-clickheat',function(Y){
  //group和site是必填的参数，site是具体站点，group是站点中的某一组，便于找到具体结果
  Y.clickheat({site:'hangzhou',group:'homepage',permil:3,selector:['a','button'],gap:200});
});
  </pre>
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
    'k2-clickheat' : {
      fullpath : '/k2/clickheat/clickheat.js',
      requires : ['yui-throttle','cookie','node-base','dom-screen','event-touch']    
    }
  }  
}).use('k2-clickheat',function(Y){
  Y.clickheat({site:'demo',group:'clickheat',debug:true});
  Y.log('success','info','k2-eg');
});
</script>
</body>
</html>
