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

		#wrap-2 {
			border:1px solid black;
			width:660px;
			background:color:#404040;
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
			z-index:5;
		}
		
		#wrap-2 .ul-wrap li .mark{
			position:absolute;
			top:0;
			height:240px;
			background:#000;
			width:165px;
			filter:alpha(opacity=40);
			*filter:alpha(opacity=0);
			opacity:0.4;
		}

		#wrap-2 .ul-wrap li a{
			position:absolute;
			top:0;
			left:0;
			height:240px;
			width:165px;
			z-index:3;
		}
		#wrap-2 .ul-wrap li p a{
			position:static;
			height:auto;
			width:auto;
		}
		#wrap-2 .ul-wrap li .mark{
			z-index:1;
		}
		#wrap-2 .ul-wrap li div.bg-wrap{
			top:210px;
			position:relative;
			text-align:center;
			z-index:1;
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
			z-index:3;
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

			margin:0 auto;
			z-index:0;
		}
		
		#wrap-2 .ul-wrap li.hidden img{
			/*filter:gray;*/
		}

		#wrap-2 .ul-wrap li p a,
		#wrap-2 .ul-wrap li p a:link,
		#wrap-2 .ul-wrap li p a:hover{
			color:#fff;
		}






		#wrap-3 {
			border:1px solid black;
			width:660px;
			background:#eee url(http://k.kbcdn.com/product/common/img/crm-load.gif) center center no-repeat;
		}

		#wrap-3 li{
			float:left;
			width:165px;
			height:240px;
			position:relative;
			cursor:pointer;
		}
		#wrap-3 .ul-wrap li p{
			position:absolute;
			bottom:0;
			line-height:27px;
			height:30px;
			width:165px;
			text-indent:10px;
			background:transparent;
			z-index:5;
		}
		
		#wrap-3 .ul-wrap li .mark{
			position:absolute;
			top:0;
			height:240px;
			background:#000;
			width:165px;
			filter:alpha(opacity=40);
			*filter:alpha(opacity=0);
			opacity:0.4;
		}

		#wrap-3 .ul-wrap li a{
			position:absolute;
			top:0;
			left:0;
			height:240px;
			width:165px;
			z-index:3;
		}
		#wrap-2 .ul-wrap li p a{
			position:static;
			height:auto;
			width:auto;
		}
		#wrap-3 .ul-wrap li .mark{
			z-index:1;
		}
		#wrap-3 .ul-wrap li div.bg-wrap{
			top:210px;
			position:relative;
			text-align:center;
			z-index:1;
		}
		#wrap-3 .ul-wrap li p.bg{
			position:relative;
			z-index:2;
			margin:0 auto;
			filter:alpha(opacity=40);
			-moz-opacity:0.4; 
			opacity:0.4;
			background:#000;
		}
		#wrap-3 .ul-wrap li p.bg-2{
			z-index:3;
			filter:alpha(opacity=20);
			-moz-opacity:0.2; 
			opacity:0.2;
			background:#000;
		}
		#wrap-3 .ul-wrap li.show p.bg{
			filter:alpha(opacity=90);
			-moz-opacity:0.9;	
			opacity:0.9;
			background:#0097f7;
		}
		
		#wrap-3 .ul-wrap li img{
			position:absolute;
			top:0;

			margin:0 auto;
			z-index:0;
		}
		
		#wrap-3 .ul-wrap li.hidden img{
			/*filter:gray;*/
		}

		#wrap-3 .ul-wrap li p a,
		#wrap-3 .ul-wrap li p a:link,
		#wrap-3 .ul-wrap li p a:hover{
			color:#fff;
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
	<div id='wrap-2'>
		<ul class='ul-wrap k2-fix-float'>
			<li><a href='http://bendi.koubei.com/hangzhou/searchstore--orderby-discount---sort-asc---key-%BF%BE%C8%E2---category-4'></a><img src='../asset/11.jpg' width='165' height='240' data='{"text":"外婆家马腾路店"}'></li>
			<li><a href='http://bendi.koubei.com/hangzhou/searchstore--orderby-discount---sort-asc---key-%BF%BE%C8%E2---category-4'></a><img src='../asset/22.jpg' width='165' height='240' data='{"text":"外婆家马腾路店"}'></li>
			<li><a href='http://bendi.koubei.com/hangzhou/searchstore--orderby-discount---sort-asc---key-%BF%BE%C8%E2---category-4'></a><img src='../asset/33.jpg' width='165' height='240' data='{"text":"外婆家马腾路店"}'></li>
			<li><a href='http://bendi.koubei.com/hangzhou/searchstore--orderby-discount---sort-asc---key-%BF%BE%C8%E2---category-4'></a><img src='../asset/44.jpg' width='165' height='240' data='{"text":"外婆家马腾路店"}'></li>
		</ul>
	</div>



	<div id='wrap-3'>
		<ul class='ul-wrap k2-fix-float'>
			<li class="k2-crm-ad" resourceid="115" data-height="240" data-width="165"></li>
			<li class="k2-crm-ad" resourceid="116" data-height="240" data-width="165"></li>
			<li class="k2-crm-ad" resourceid="117" data-height="240" data-width="165"></li>
			<li class="k2-crm-ad" resourceid="118" data-height="240" data-width="165"></li>
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
YUI().use('k2-shutter-gallery','get',function(Y){
	var gallery = new Y.ShutterGallery({
			'id' : 'wrap-2',
			'speed' : 0.7,
			'easing_in' : {
					from: { opacity: 0.2},
					to: { opacity: 0 }
			},
			'easing_out' : { 
					from: {opacity: 0},
					to: { opacity: 0.2 }
			}
	});

	var defalutAd=[{'id':115,'content':'http://y1.kbcdn.com/myp/images/cate/suling/165x240_hzbw_1202.jpg','link':'http://ju.atpanel.com/?url=http://miandan.koubei.com?ad_id=&am_id=&cm_id=&pm_id=15003709268ef6908894'},{'id':116,'content':'http://y1.kbcdn.com/myp/images/cate/suling/165-240-101201.jpg','link':'http://ju.atpanel.com/?url=http://promotion.koubei.com/s/hy/hzzt/11rqsh.html?ad_id=&am_id=&cm_id=&pm_id=150037092751784cc31c'},{'id':117,'content':'http://k.kbcdn.com/myp/images/fenlei/chuanbei/165x240_120201.jpg','link':'http://ju.atpanel.com/?url=http://promotion.koubei.com/s/hy/hzzt/shengdan.html?ad_id=&am_id=&cm_id=&pm_id=1500370928684feb459c'},{'id':118,'content':'http://y1.kbcdn.com/myp/images/fenlei/chuanbei/165x240_110301.jpg','link':'http://ju.atpanel.com/?url=http://promotion.koubei.com/s/hy/hzzt/sfc.html?ad_id=&am_id=&cm_id=&pm_id=150037092942ada5a334'}];
	var crmAd = Y.all('.k2-crm-ad'),resIds=[],sUrl;
	crmAd.each(function(i){
		resIds.push(i.getAttribute('resourceid'));
	});
	sUrl = "http://marketing.taobao.com/home/delivery/AllContentByPage.do?resourceIds="+resIds.join(',')+"&t=" + new Date().getTime();

	var createEl = function(data){
			var tObj={};
			Y.Array.each(data,function(i){
				tObj[i.id]=i;
			})
			Y.log(crmAd)	
			crmAd.each(function(i){
				i.insert("<a href='"+tObj[i.getAttribute('resourceid')].link+"'></a><img src='"+tObj[i.getAttribute('resourceid')].content+"' width='"+i.getAttribute('data-width')+"' height='"+i.getAttribute('data-height')+"'>");
			});
	}

	var successHandle = function(){
		if(__content_results&&__content_results.length>0&&__content_results<5){
			createEl(__content_results);
		}else{
			createEl(defalutAd);
		}
		var gallery2 = new Y.ShutterGallery({
			'id' : 'wrap-3',
			'speed' : 0.7,
			'text' : false,
			'easing_in' : {
					from: { opacity: 0.2},
					to: { opacity: 0 }
			},
			'easing_out' : { 
					from: {opacity: 0},
					to: { opacity: 0.2 }
			}
		});
	} 
	var failureHandle= function(){
	}

	var transactionObj = !crmAd.isEmpty() && Y.Get.script(sUrl, {
			 onSuccess: successHandle,
			 onFailure: failureHandle,   
			 timeout: 20000,
			 context: Y
	});

})
</script>
</body>
</html>
