<?php
define('CHARSET','gbk'); //默认utf-8，无需设置，其他编码需要指定
require_once("../../_assets/demo.php");
?>
<html>
<head>
  <?php echo_html_charset() ?>
  <title>旺旺</title>
  <?php echo_default_css() ?>
  <!--style>
  .k2-ww{
    display:-moz-inline-stack; 
    display:inline-block;  
    *display:inline;
    zoom:1;
    position:relative;//Firefox下不可被点击问题，回头确认一下Firefox3是否还存在
    *position:static;//上一句导致IE6下的bug
    height:20px;
    width:67px;
    background:url(http://a.tbcdn.cn/sys/wangwang/wangwang_v2.gif) no-repeat 0 -20px;
    vertical-align:middle;
    cursor:pointer;
    text-indent:-9999px;
    font-size:12px;
  }
  .k2-ww-small{
    width:20px;
    background-position:-82px -20px;  
  }
  .k2-ww-online{
    background-position:0 0; 
  }
  .k2-ww-mobile{
    background-position:0 -40px; 
  }
  .k2-ww-small.k2-ww-online{
    background-position:-82px 0px; 
  }
  .k2-ww-small.k2-ww-mobile{
    background-position:-82px -40px; 
  }
  </style-->
</head>
<body>
  <h1>旺旺</h1>
  <h2>说明</h2>
  <p>通过旺旺ICON来显示指定淘宝id的在线、离线和移动在线的状态，并且在IE下通过点击旺旺能激活本地已安装的旺旺进行交流，如果没有安装则会引导下载，在非IE下能引导到Web旺旺。</p><p>请看<a href="ww.php">UTF-8版本</a></p>
  <!--
<a href="http://webwwtb.im.alisoft.com/wangwang/ww1.htm?t=1271304897746&amp;uid=&amp;tid=%u7231%u6155%u5B98%u65B9%u65D7%u8230%u5E97" target="_blank" class="ww-online ww-large ww-inline" title="点此可以直接和卖家 交流选好的宝贝，或相互交流网购体验，还支持语音视频噢。">旺旺在线</a>
-->
  <ol>
    <li>小马：<span class="k2-ww" data-wwid="小马" title="通过淘宝旺旺和小马进行交流！"></span></li>
    <li>三七：<span class="k2-ww" data-wwid="三七" title="fdafsdafdsafsda"></span></li>
    <li>元天：<span class="k2-ww" data-wwid="元天" title="fdafsdafdsafsda"></span></li>
    <li>善朋：<span class="k2-ww k2-ww-small" data-wwid="善朋" title="fdafsdafdsafsda"></span></li>
    <li>展炎：<span class="k2-ww k2-ww-small" data-wwid="圆心" title="fdafsdafdsafsda"></span></li>
    <li>灵佑灵方：<span class="k2-ww" data-wwid="灵佑灵方" title="fdafdafasd"></span></li>
    <li>钨龙：<span class="k2-ww k2-ww-small" data-wwid="钨龙" title="fdafsdafdsafsda"></span></li>
  </ol>
  <h2>Code</h2>
  <ol>
  <li>
在需要使用旺旺点灯的地方加入下面的代码，并设置好旺旺id，<strong>请注意使用span标签而不是a标签，避免对href的处理和虚线框问题</strong>
<pre class="brush:xml;">
&lt;span class="k2-ww" data-wwid="三七"&gt;&lt;/span&gt;
</pre> 
</li>
<li>
在页尾用如下方法调用
<pre class="brush:javascript;">
YUI().use('k2-ww',function(Y){
  Y.Ww.light();
});
</pre>
</li>
</ol>
  <h2>参数</h2>
<pre class="brush:javascript;">
YUI().use('k2-ww',function(Y){
  Y.Ww.light(ancestor);
});
</pre>
    <table>
      <tr><th>参数</th><th>值</th><th>含义</th></tr>
      <tr><td>ancestor</td><td>String（选择符） | Y.Node | Y.NoeList | HTMLElement</td><td>用于指定位置的旺旺节点</td></tr>
    </table>
  <h2>例子</h2>
  <div id="k2-ww-eg"></div>
<script>
//仅用于开发环境
if(typeof K2_config === 'undefined'){
  var K2_config = {
    noCombine : true,//是否使用combo功能，开发环境下支持combo需要配置minfy，默认使用
    noCache : true,//是否在js或css文件尾部增加随机函数来防止浏览器缓存，默认使用
    console : true,//是否使用通用的console控制台，这样就可以在页面显示Y.log内容，默认使用
                   //失效时，请查看对应的YUI实例需要使用event-custom-base模块
    noVersion : true,//是否使用不带版本号的文件，这样就可以直接调用本地开发文件，因为这些文件都是不带版本号的，默认使用
    syntaxHighlight : false,//是否格式化代码显示，默认使用
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
  /*
  modules : {
    'ww' : {
      fullpath : '/k2/ww/ww.js',
      requires : ['node-base','node-event-delegate','stylesheet']    
    }
  }  
  */
}).use('k2-ww',function(Y){
  //默认使用
  Y.Ww.light();
  Y.log('Y.Ww.light() Success!','info','k2-ww');

  //使用指定选择符
  Y.one('#k2-ww-eg').append('<h3>使用选择符指定</h3><ol id="k2-ww-eg1">' + 
                            '<li>严书：<span class="k2-ww" data-wwid="严书"></span></li>' + 
                            '<li>冰浠：<span class="k2-ww" data-wwid="冰浠"></span></li>' + 
                            '<li>飞灵：<span class="k2-ww k2-ww-small" data-wwid="飞灵"></span></li>' + 
                            '<li>邦彦：<span class="k2-ww k2-ww-small" data-wwid="邦彦"></span></li>' + 
                            '</ol>');
  Y.Ww.light('#k2-ww-eg1');
  Y.log('Y.Ww.light("#k2-ww-eg1")执行成功，即可以通过指定选择符来进行筛选旺旺','info','k2-ww');

  //使用NodeList指定 
  Y.one('#k2-ww-eg').append('<h3>使用选择符指定</h3><ol>' + 
                            '<li class="k2-ww-eg-2">邦彦：<span class="k2-ww" data-wwid="邦彦"></span></li>' + 
                            '<li class="k2-ww-eg-2">冰浠：<span class="k2-ww" data-wwid="冰浠"></span></li>' + 
                            '<li class="k2-ww-eg-2">飞灵：<span class="k2-ww k2-ww-small" data-wwid="飞灵"></span></li>' + 
                            '<li class="k2-ww-eg-2">邦彦：<span class="k2-ww k2-ww-small" data-wwid="邦彦"></span></li>' + 
                            '</ol>');
  Y.Ww.light(Y.all('.k2-ww-eg-2'));
  Y.log('Y.Ww.light(Y.all(".k2-ww-eg-2"));执行成功，即可以通过NodeList来进行筛选旺旺','info','k2-ww');
});
</script>
</body>
</html>
