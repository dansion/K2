<?php
define('CHARSET','gbk'); //默认utf-8，无需设置，其他编码需要指定
require_once("../../_assets/demo.php");
?>
<html>
<head>
  <?php echo_html_charset() ?>
  <title>k2-eg</title>
  <meta http-equiv="X-UA-Compatible" content="IE=Edge">
  <?php echo_default_css() ?>
	<style>
		#wrap {
			border:1px solid blue;
			height:250px;
			width:200px;
			overflow:hidden;
		}
		.ul-wrap{
			position:relative;
				
		}
		.ul-wrap li{
			position:absolute;
			overflow:hidden;
		}
		.ul-wrap li p{
			position:absolute;
			bottom:0;
			height:30px;
			background:#fff;
			width:200px;
			border-bottom:1px solid #ccc;
		}
  </style>
</head>
<body>
  <h1>k2-eg</h1>
  <h2>说明</h2>
  <ol>
    <li>
    <pre class="brush:css">
      .demo{
        property : value;  
      }
    </pre> 
    </li>
    <li>description</li>
  </ol>
  <h2>Code</h2>
  <pre class="brush:javascript;">
YUI().use('k2-eg',function(Y){
  Y.K2eg.method();
});
  </pre>
  <h2>参数</h2>
    <table>
      <tr><th>参数</th><th>默认值</th><th>含义</th></tr>
      <tr><td>eg</td><td>eg</td><td>eg</td></tr>
    </table>
  <h2>例子</h2>
	<div id='wrap'>
		<ul class='ul-wrap'>
			<li><img src='../asset/1.jpg' width='200'  data='{"num":"1","url":"#","text":"外婆家马腾路店"}'></li>
			<li><img src='../asset/2.jpg' width='200'  data='{"num":"2","url":"#","text":"外婆家马腾路店"}'></li>
			<li><img src='../asset/3.jpg' width='200'  data='{"num":"3","url":"#","text":"外婆家马腾路店"}'></li>
			<li><img src='../asset/4.jpg' width='200'  data='{"num":"4","url":"#","text":"外婆家马腾路店"}'></li>
			<li><img src='../asset/5.jpg' width='200'  data='{"num":"5","url":"#","text":"外婆家马腾路店"}'></li>
		</ul>
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
<?php echo_default_js(); ?>
<script>
YUI({
  modules : {
    'shutter' : {
      fullpath : '/k2/shutter/shutter.js',
      requires : ['node','json','anim']    
    }
  }  
}).use('shutter',function(Y){
  Y.log('success','info','shutter');
	new Y.Shutter();
});
</script>
</body>
</html>
