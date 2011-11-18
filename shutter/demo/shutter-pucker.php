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

		#wrap {
			border:1px solid #E4E4E4;
			height:250px;
			width:200px;
			margin-bottom:20px;
			overflow:hidden;
			position:relative;
			z-index:5;
		}

		#wrap .ul-wrap{
			position:relative;
			z-index:3;
			height:190px;
		}

		#wrap .ul-wrap li{
			position:absolute;
			overflow:hidden;
		}

		#wrap .ul-wrap li p{
			position:absolute;
			bottom:0;
			padding-left:10px;
			line-height:27px;
			height:30px;
			width:190px;
			background:transparent;
			border-bottom:1px solid #eee;
			z-index:2;
		}

		#wrap .ul-wrap li:last-child p{
			border:none;
		}

		#wrap .ul-wrap li p a,
		#wrap .ul-wrap li p a:link,
		#wrap .ul-wrap li p a:hover{
			color:#333;
		}

		#wrap .ul-wrap li.show p a,
		#wrap .ul-wrap li.show p a:link,
		#wrap .ul-wrap li.show p a:hover{
			color:#fff;
			font-weight:bold;
		}
		
		#wrap .ul-wrap li p.bg{
			z-index:1;
			background:#fff;
		}
		#wrap .ul-wrap li.show p.bg{
			filter:alpha(opacity=30);
			-moz-opacity:0.3; 
			opacity:0.3;
			background:#000;
		}
		#wrap-2 {
			border:1px solid black;
			width:660px;
		}

		#wrap-2 li{
			float:left;
			width:165px;
			height:240px;
			position:relative;
			cursor:pointer;
		}
		#wrap-2 .ul-wrap li p{
			position:absolute;
			bottom:0;
			line-height:27px;
			height:30px;
			width:165px;
			text-indent:10px;
			background:transparent;
			z-index:3;
		}

		#wrap-2 .ul-wrap li div.mark{
			position:absolute;
			top:0;
			height:240px;
			background:#000;
			width:165px;
		}
		#wrap-2 .ul-wrap li.hidden div.mark{
			z-index:1;
		}
		#wrap-2 .ul-wrap li.hidden div.init{
			filter:alpha(opacity=40);
			-moz-opacity:0.4; 
			opacity:0.4;
		}
		#wrap-2 .ul-wrap li div.bg-wrap{
			top:210px;
			position:relative;
			text-align:center;
		}
		#wrap-2 .ul-wrap li p.bg{
			position:relative;
			z-index:2;
			margin:0 auto;
			filter:alpha(opacity=40);
			-moz-opacity:0.4; 
			opacity:0.4;
			background:#000;
		}
		#wrap-2 .ul-wrap li p.bg-2{
			z-index:1;
			filter:alpha(opacity=20);
			-moz-opacity:0.2; 
			opacity:0.2;
			background:#000;
		}
		#wrap-2 .ul-wrap li.show p.bg{
			filter:alpha(opacity=90);
			-moz-opacity:0.9;	
			opacity:0.9;
			background:#0097f7;
		}
		
		#wrap-2 .ul-wrap li img{
			position:absolute;
			top:0;
			z-index:0;
		}
		
		#wrap-2 .ul-wrap li.hidden img{
			filter:gray;	
		}

		#wrap-2 .ul-wrap li p a,
		#wrap-2 .ul-wrap li p a:link,
		#wrap-2 .ul-wrap li p a:hover{
			color:#fff;
		}
  </style>
</head>
<body>
  <h1>shutter-pucker</h1>
  <h2>说明</h2>
	<p>幻灯片-百叶窗效果.</p>
	<p>每个触点都有相应的class标示.show,hidden,hiddend分别表示当前项,以折叠项,和未被折叠项,可以针对不同需求自定义触点效果.</p>
	<h2>例子</h2>
	<div id='wrap'>
		<ul class='ul-wrap'>
			<li><img src='../asset/1.jpg' width='200'  data='{"url":"shutter-gallery.php","text":"外婆家马腾路店"}'></li>
			<li><img src='../asset/2.jpg' width='200'  data='{"url":"shutter-gallery.php","text":"外婆家马腾路店"}'></li>
			<li><img src='../asset/3.jpg' width='200'  data='{"url":"shutter-gallery.php","text":"外婆家马腾路店"}'></li>
			<li><img src='../asset/4.jpg' width='200'  data='{"url":"shutter-gallery.php","text":"外婆家马腾路店"}'></li>
			<li><img src='../asset/5.jpg' width='200'  data='{"url":"shutter-gallery.php","text":"外婆家马腾路店"}'></li>
		</ul>
	</div>
	<h2>Code</h2>
	<p>Html</p>
	<pre class="brush:html">
<div id='test'>
	<ul class='ul-wrap'>
		<li><img src='../asset/1.jpg' width='200'  data='{"url":"shutter-gallery.php","text":"外婆家马腾路店"}'></li>
		<li><img src='../asset/2.jpg' width='200'  data='{"url":"shutter-gallery.php","text":"外婆家马腾路店"}'></li>
		<li><img src='../asset/3.jpg' width='200'  data='{"url":"shutter-gallery.php","text":"外婆家马腾路店"}'></li>
		<li><img src='../asset/4.jpg' width='200'  data='{"url":"shutter-gallery.php","text":"外婆家马腾路店"}'></li>
		<li><img src='../asset/5.jpg' width='200'  data='{"url":"shutter-gallery.php","text":"外婆家马腾路店"}'></li>
	</ul>
</div>	
	</pre>
	<p>Css</p>
	<pre id='css' class="brush:css">
#wrap {
	border:1px solid #E4E4E4;
	height:250px;
	width:200px;
	margin-bottom:20px;
	overflow:hidden;
	position:relative;
	z-index:5;
}

#wrap .ul-wrap{
	position:relative;
	z-index:3;
	height:190px;
}

#wrap .ul-wrap li{
	position:absolute;
	overflow:hidden;
}

#wrap .ul-wrap li p{
	position:absolute;
	bottom:0;
	padding-left:10px;
	line-height:27px;
	height:30px;
	width:190px;
	background:transparent;
	border-bottom:1px solid #eee;
	z-index:2;
}

#wrap .ul-wrap li:last-child p{
	border:none;
}

#wrap .ul-wrap li p a,
#wrap .ul-wrap li p a:link,
#wrap .ul-wrap li p a:hover{
	color:#333;
}

#wrap .ul-wrap li.show p a,
#wrap .ul-wrap li.show p a:link,
#wrap .ul-wrap li.show p a:hover{
	color:#fff;
	font-weight:bold;
}

#wrap .ul-wrap li p.bg{
	z-index:1;
	background:#fff;
}
#wrap .ul-wrap li.show p.bg{
	filter:alpha(opacity=30);
	-moz-opacity:0.3; 
	opacity:0.3;
	background:#000;
}
	</pre>
	<p>Javascript</p>
  <pre class="brush:javascript;">
YUI().use('shutter-gallery','shutter-pucker',function(Y){
	var Pucker = new Y.ShutterPucker({'id':'test','time':5,'speed':0.4,'auto':false});
});
	</pre>
	<h2>参数</h2>
    <table>
      <tr><th>参数</th><th>默认值</th><th>含义</th></tr>
      <tr><td>id</td><td>null</td><td>container的id</td></tr>
      <tr><td>time</td><td>3秒</td><td>轮播间隔</td></tr>
      <tr><td>speed</td><td>0.5秒</td><td>动画滚动速度</td></tr>
      <tr><td>auto</td><td>true</td><td>是否自动播放</td></tr>
		</table>



<script>
//仅用于开发环境
if(typeof K2_config === 'undefined'){
  var K2_config = {
    noCombine : true,//是否使用combo功能，开发环境下支持combo需要配置minfy，默认使用
    noCache : true,//是否在js或css文件尾部增加随机函数来防止浏览器缓存，默认使用
    console : false,//是否使用通用的console控制台，这样就可以在页面显示Y.log内容，默认使用
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
YUI().use('k2-shutter-pucker',function(Y){
	var Pucker = new Y.ShutterPucker({'id':'wrap','time':5,'speed':0.4,'auto':false});
});


</script>
</body>
</html>
