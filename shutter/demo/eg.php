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
			border:1px solid black;
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
#wrap-3{
	margin:0 0 30px 0;	
}
	#wrap-3{
		height:36px;
		overflow:hidden;
		position:relative;
	}

  </style>
</head>
<body>
<!--
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
  </pre>nIndex
  <h2>参数</h2>
    <table>
      <tr><th>参数</th><th>默认值</th><th>含义</th></tr>
      <tr><td>eg</td><td>eg</td><td>eg</td></tr>
		</table>
-->
	<h2>例子</h2>
<!--
	<div id='wrap-3'>
		<ul class='ul-wrap'>
			<li><p><a href='#'>xxxx夜店1</a></p><p>特色:美女多</p></li>
			<li><p><a href='#'>xxxx夜店2</a></p><p>特色:美女多</p></li>
			<li><p><a href='#'>xxxx夜店3</a></p><p>特色:美女多</p></li>
			<li><p><a href='#'>xxxx夜店4</a></p><p>特色:美女多</p></li>
			<li><p><a href='#'>xxxx夜店5</a></p><p>特色:美女多</p></li>
			<li><p><a href='#'>xxxx夜店6</a></p><p>特色:美女多</p></li>
		</ul>
	</div>
-->
	<div id='wrap'>
		<ul class='ul-wrap'>
			<li><img src='../asset/1.jpg' width='200'  data='{"url":"#","text":"外婆家马腾路店"}'></li>
			<li><img src='../asset/4.jpg' width='200'  data='{"url":"#","text":"外婆家马腾路店"}'></li>
			<li><img src='../asset/5.jpg' width='200'  data='{"url":"#","text":"外婆家马腾路店"}'></li>
		</ul>
	</div>
	<div id='wrap-2'>
		<ul class='ul-wrap k2-fix-float'>
			<li><img src='../asset/11.jpg' width='165' height='240' data='{"url":"#","text":"外婆家马腾路店"}'></li>
			<li><img src='../asset/22.jpg' width='165' height='240' data='{"url":"#","text":"外婆家马腾路店"}'></li>
			<li><img src='../asset/33.jpg' width='165' height='240' data='{"url":"#","text":"外婆家马腾路店"}'></li>
			<li><img src='../asset/44.jpg' width='165' height='240' data='{"url":"#","text":"外婆家马腾路店"}'></li>
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
		'shutter-base' : {
      fullpath : '/k2/shutter/shutter-base.js',
      requires : ['node','json']    
    },
    'shutter-pucker' : {
      fullpath : '/k2/shutter/shutter-pucker.js',
      requires : ['node','json','anim','shutter-base']    
		},
    'shutter-gallery' : {
      fullpath : '/k2/shutter/shutter-gallery.js',
      requires : ['node','json','anim','shutter-base']    
    }
  }  
}).use('shutter-gallery','shutter-pucker',function(Y){
	var Pucker = new Y.ShutterPucker({'id':'wrap','time':5,'speed':0.4,'auto':false});
	//*
	var gallery = new Y.ShutterGallery({
		  'id' : 'wrap-2',
			'time' : 2,
			'speed' : 1,
			'auto' : true,
			'easing' : Y.Easing.easeOutStrong
	});
	// */
	//var scroll = new Y.ShutterBase({'id' : 'wrap-3','auto' : true,'lh':36});


});


</script>
</body>
</html>
