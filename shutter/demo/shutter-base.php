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
		.k2-fix-float:after{
			content:".";
			display:block;
			height:0;
			clear:both;
			visibility:hidden;
		}

		.k2-fix-float{
			zoom:1;
		}
		#wrap-3{
			margin:0 0 30px 0;	
		}
		#wrap-3{
			height:72px;
			overflow:hidden;
			position:relative;
		}
		#wrap-3 li{
			line-height:18px;
		}
  </style>
</head>
<body>
  <h1>shutter-base</h1>
  <h2>说明</h2>
  <ol>
    <li>幻灯片的base,完成了最基本的文字垂直滚动</li>
  </ol>
  <h2>Code</h2>
    <pre class="brush:css">
wrap-3{
	margin:0 0 30px 0;	
}
#wrap-3{
	height:36px;
	overflow:hidden;
	position:relative;
}
    </pre>
  <pre class="brush:javascript;">
YUI().use('shutter-base',function(Y){
	var scroll = new Y.ShutterBase({'id':'wrap-3','lh':36,'speed':2});
	scroll.autoPlay();
});
  </pre>
  <h2>参数</h2>
    <table>
      <tr><th>参数</th><th>默认值</th><th>含义</th></tr>
      <tr><td>id</td><td>null</td><td>container的id</td></tr>
      <tr><td>time</td><td>3秒</td><td>轮播间隔</td></tr>
      <tr><td>speed</td><td>1</td><td>滚动速度,数值越大.滚动时长越短</td></tr>
      <tr><td>lh</td><td>15</td><td>1次滚动的高度</td></tr>
		</table>
	<h2>例子</h2>
	<div id='wrap-3'>
		<ul class='ul-wrap'>
			<li><strong class='event'>xxx得到了iPad</strong><span class='datetime'>8月23日14：44</span></li>
			<li><strong class='event'>xxx得到了100元现金</strong><span class='datetime'>8月23日14：44</span></li>
			<li><strong class='event'>xxx得到了iPad</strong><span class='datetime'>8月23日14：44</span></li>
			<li><strong class='event'>xxx得到了100元现金</strong><span class='datetime'>8月23日14：44</span></li>
			<li><strong class='event'>xxx得到了iPad</strong><span class='datetime'>8月23日14：44</span></li>
			<li><strong class='event'>xxx得到了100元现金</strong><span class='datetime'>8月23日14：44</span></li>
			<li><strong class='event'>xxx得到了iPad</strong><span class='datetime'>8月23日14：44</span></li>
			<li><strong class='event'>xxx得到了100元现金</strong><span class='datetime'>8月23日14：44</span></li>
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
<?php echo_default_js(''); ?>
<script>
YUI({
	modules : {
		'k2-shutter-base' : {
      fullpath : '/k2/shutter/shutter-base.js',
      requires : ['base','node']    
    }
  }  
}).use('k2-shutter-base',function(Y){
	var scroll = new Y.ShutterBase({'id':'wrap-3','lh':18,'speed':2});
	scroll.autoPlay();
});
</script>
</body>
</html>
