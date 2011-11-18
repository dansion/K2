<?php
require_once("../../_assets/demo.php");
?>
<html>
<head>
  <?php echo_html_charset() ?>
  <title>data-k2-lazyload</title>
  <meta http-equiv="X-UA-Compatible" content="IE=Edge">
	<?php echo_default_css() ?>
<style>
	.StreamView{
		height:700px;
	}
</style>
</head>
<body>
<h2>code</h2>
<pre class="brush:javascript;">
YUI({injected: true}).use('k2-data-lazyload',function(Y){
	Y.on('domready',function(){
		var lazy = new Y.DataLazyload(document,{offset:300,placeholder:'none'});
	});
});
</pre>
<h2>说明</h2>
<p>实例化YUI对象时,注意增加一个属性injected: true,因为YUI认为domready是在img中的src也完全加载之后.这并不是我们想要的.</p>

<h2>参数</h2>
<table>
<tr>
	<td>document</td>
	<td>作用的dom节点对象</td>
</tr>
<tr>
	<td>offset</td>
	<td>偏移量,当前屏幕以下需要预加载的偏移量</td>
</tr>
<tr>
	<td>placeholder(todo)</td>
	<td>加载时的loading</td>
</tr>
</table>


<h2>demo</h2>
<div id="page">
			<div class="StreamView Big5Photo" id="sv_body_4951666314">
					
					<span class="photo_container pc_z"><a href="/photos/warszawa/4951666314/" title="　 by nao'"><img height='640'  data-k2-lazyload="http://farm5.static.flickr.com/4093/4951666314_2469df7309_z.jpg"  /></a></span>			</div>


			<div class="StreamView Big5Photo" id="sv_body_4951663946">
					
					<span class="photo_container pc_z"><a href="/photos/warszawa/4951663946/" title="　 by nao'"><img height='640'  data-k2-lazyload="http://farm5.static.flickr.com/4099/4951663946_df3e03dc2e_z.jpg"  /></a></span>			</div>

    
			<div class="StreamView Big5Photo" id="sv_body_4951070639">
					
					<span class="photo_container pc_z"><a href="/photos/warszawa/4951070639/" title="　 by nao'"><img height='640'  data-k2-lazyload="http://farm5.static.flickr.com/4077/4951070639_15361e36cd_z.jpg"  /></a></span>			</div>

   

			<div class="StreamView Big5Photo" id="sv_body_4951659696">
					
					<span class="photo_container pc_z"><a href="/photos/warszawa/4951659696/" title="　 by nao'"><img height='640'  data-k2-lazyload="http://farm5.static.flickr.com/4092/4951659696_c62f9090fa_z.jpg"  /></a></span>			</div>

   

			<div class="StreamView Big5Photo LastPhoto" id="sv_body_4652923620">
					

					<span class="photo_container pc_z"><a href="/photos/warszawa/4652923620/" title="　 by nao'"><img height='640'  data-k2-lazyload="http://farm5.static.flickr.com/4017/4652923620_77594b9137_z.jpg"  /></a></span>			</div>

   


			<div class="StreamView" id="sv_body_3121102726">
					
					<span class="photo_container pc_m"><a href="/photos/warszawa/3121102726/" title="　 by nao'"><img height='640'  data-k2-lazyload="http://farm4.static.flickr.com/3122/3121102726_d857d41f37_z.jpg" ></a>	
		</div>

    

			<div class="StreamView" id="sv_body_3107260066">
					
					<span class="photo_container pc_m"><a href="/photos/warszawa/3107260066/" title="　 by nao'"><img height='640'  data-k2-lazyload="http://farm4.static.flickr.com/3212/3107260066_ca9eaa73b6_z.jpg" ></a>			</div>


			<div class="StreamView" id="sv_body_3070151821">
					
					<span class="photo_container pc_m"><a href="/photos/warszawa/3070151821/" title="　 by nao'"><img height='640'  data-k2-lazyload="http://farm4.static.flickr.com/3016/3070151821_6a08495dcd_z.jpg" ></a>			</div>

    

			<div class="StreamView" id="sv_body_3053026378">
					
					<span class="photo_container pc_m"><a href="/photos/warszawa/3053026378/" title="　 by nao'"><img height='640'  data-k2-lazyload="http://farm4.static.flickr.com/3185/3053026378_8a1afda0df_z.jpg" ></a>			</div>

    
			<div class="StreamView" id="sv_body_3052189591">
					
					<span class="photo_container pc_m"><a href="/photos/warszawa/3052189591/" title="　 by nao'"><img height='640'  data-k2-lazyload="http://farm4.static.flickr.com/3161/3052189591_e356d6a183_z.jpg" ></a>			</div>

    

			<div class="StreamView" id="sv_body_3053023624">
					
					<span class="photo_container pc_m"><a href="/photos/warszawa/3053023624/" title="　 by nao'"><img height='640'  data-k2-lazyload="http://farm4.static.flickr.com/3168/3053023624_1d16e23b63_z.jpg" ></a>			</div>

    

			<div class="StreamView" id="sv_body_3053022686">
					
					<span class="photo_container pc_m"><a href="/photos/warszawa/3053022686/" title="　 by nao'"><img height='640'  data-k2-lazyload="http://farm4.static.flickr.com/3039/3053022686_ed82ed3323_z.jpg" ></a>			</div>

    

			<div class="StreamView" id="sv_body_3053021766">
					
					<span class="photo_container pc_m"><a href="/photos/warszawa/3053021766/" title="　 by nao'"><img height='640'  data-k2-lazyload="http://farm4.static.flickr.com/3225/3053021766_af6dd83f9e_z.jpg" ></a>			</div>

    
			<div class="StreamView" id="sv_body_2928999319">
					
					<span class="photo_container pc_m"><a href="/photos/warszawa/2928999319/" title="　 by nao'"><img height='640'  data-k2-lazyload="http://farm4.static.flickr.com/3293/2928999319_abd0faf59c_z.jpg" ></a>			</div>

    

			<div class="StreamView" id="sv_body_2896748017">
					
					<span class="photo_container pc_m"><a href="/photos/warszawa/2896748017/" title="　 by nao'"><img height='640'  data-k2-lazyload="http://farm4.static.flickr.com/3100/2896748017_b83806503f_z.jpg" ></a>			</div>

    
			<div class="StreamView" id="sv_body_2841725947">
					
					<span class="photo_container pc_m"><a href="/photos/warszawa/2841725947/" title="　 by nao'"><img height='640'  data-k2-lazyload="http://farm4.static.flickr.com/3129/2841725947_87d4a2bd60_z.jpg" ></a>			</div>

    

			<div class="StreamView" id="sv_body_2841725943">
					
					<span class="photo_container pc_m"><a href="/photos/warszawa/2841725943/" title="　 by nao'"><img height='640'  data-k2-lazyload="http://farm4.static.flickr.com/3120/2841725943_fe824785da_z.jpg" ></a>			</div>

    

			<div class="StreamView" id="sv_body_2841725941">
					
					<span class="photo_container pc_m"><a href="/photos/warszawa/2841725941/" title="　 by nao'"><img height='640'  data-k2-lazyload="http://farm4.static.flickr.com/3011/2841725941_1c7769b80f_z.jpg" ></a>			</div>

    

			<div class="StreamView" id="sv_body_2813421501">
					
					<span class="photo_container pc_m"><a href="/photos/warszawa/2813421501/" title="　 by nao'"><img height='640'  data-k2-lazyload="http://farm4.static.flickr.com/3049/2813421501_bd61eb355a_z.jpg" ></a>			</div>

    

			<div class="StreamView" id="sv_body_2813421479">
					
					<span class="photo_container pc_m"><a href="/photos/warszawa/2813421479/" title="　 by nao'"><img height='640'  data-k2-lazyload="http://farm4.static.flickr.com/3056/2813421479_68ac4c6bcb_z.jpg" ></a>			</div>

    

			<div class="StreamView" id="sv_body_2813411979">
					
					<span class="photo_container pc_m"><a href="/photos/warszawa/2813411979/" title="　 by nao'"><img height='640'  data-k2-lazyload="http://farm4.static.flickr.com/3018/2813411979_18d16ab02c_z.jpg" ></a>			</div>

    
			<div class="StreamView" id="sv_body_2740995006">
					
					<span class="photo_container pc_m"><a href="/photos/warszawa/2740995006/" title="　 by nao'"><img height='640'  data-k2-lazyload="http://farm4.static.flickr.com/3086/2740995006_a188d7f5aa_z.jpg" ></a>			</div>

    

			<div class="StreamView" id="sv_body_2740995000">
					
					<span class="photo_container pc_m"><a href="/photos/warszawa/2740995000/" title="　 by nao'"><img height='640'  data-k2-lazyload="http://farm4.static.flickr.com/3164/2740995000_9d7e5a94f3_z.jpg" ></a>			</div>

    


			<div class="StreamView" id="sv_body_4652302985">
					
					<span class="photo_container pc_m"><a href="/photos/warszawa/4652302985/" title="　 by nao'"><img height='640'  data-k2-lazyload="http://farm5.static.flickr.com/4029/4652302985_d4bc3c5aac_z.jpg" ></a>			</div>

    

			<div class="StreamView" id="sv_body_4652918734">
					
					<span class="photo_container pc_m"><a href="/photos/warszawa/4652918734/" title="　 by nao'"><img height='640'  data-k2-lazyload="http://farm5.static.flickr.com/4070/4652918734_3891898770_z.jpg" ></a>			</div>

    

			<div class="StreamView" id="sv_body_4652915348">
					
					<span class="photo_container pc_m"><a href="/photos/warszawa/4652915348/" title="　 by nao'"><img height='640'  data-k2-lazyload="http://farm5.static.flickr.com/4065/4652915348_b48a9bd812_z.jpg" ></a>			</div>

    

			<div class="StreamView" id="sv_body_4652294249">
					
					<span class="photo_container pc_m"><a href="/photos/warszawa/4652294249/" title="　 by nao'"><img height='640'  data-k2-lazyload="http://farm5.static.flickr.com/4048/4652294249_c3752ff4c9_z.jpg" ></a>			</div>

    

			<div class="StreamView" id="sv_body_4652905748">
					
					<span class="photo_container pc_m"><a href="/photos/warszawa/4652905748/" title="　 by nao'"><img height='640'  data-k2-lazyload="http://farm5.static.flickr.com/4037/4652905748_48b63047ae_z.jpg" ></a>			</div>

    

			<div class="StreamView" id="sv_body_4652903858">
					
					<span class="photo_container pc_m"><a href="/photos/warszawa/4652903858/" title="　 by nao'"><img height='640'  data-k2-lazyload="http://farm5.static.flickr.com/4046/4652903858_b6374f17ec_z.jpg" ></a>			</div>

    

			<div class="StreamView" id="sv_body_4652900966">
					
					<span class="photo_container pc_m"><a href="/photos/warszawa/4652900966/" title="　 by nao'"><img height='640'  data-k2-lazyload="http://farm5.static.flickr.com/4056/4652900966_3e2418995f_z.jpg" ></a>			</div>

    

			<div class="StreamView" id="sv_body_4652279119">
					
					<span class="photo_container pc_m"><a href="/photos/warszawa/4652279119/" title="　 by nao'"><img height='640'  data-k2-lazyload="http://farm5.static.flickr.com/4059/4652279119_60e1ea3726_z.jpg" ></a>			</div>

    

			<div class="StreamView" id="sv_body_4652893320">
					
					<span class="photo_container pc_m"><a href="/photos/warszawa/4652893320/" title="　 by nao'"><img height='640'  data-k2-lazyload="http://farm5.static.flickr.com/4063/4652893320_8dfdf00c24_z.jpg" ></a>			</div>

    

			<div class="StreamView" id="sv_body_4652272013">
					
					<span class="photo_container pc_m"><a href="/photos/warszawa/4652272013/" title="　 by nao'"><img height='640'  data-k2-lazyload="http://farm5.static.flickr.com/4035/4652272013_cc153824c0_z.jpg" ></a>			</div>

    

			<div class="StreamView" id="sv_body_3607653199">
					
					<span class="photo_container pc_m"><a href="/photos/warszawa/3607653199/" title="　 by nao'"><img height='640'  data-k2-lazyload="http://farm4.static.flickr.com/3641/3607653199_0722b4d84b_z.jpg" ></a>			</div>

    

			<div class="StreamView" id="sv_body_3608467778">
					
					<span class="photo_container pc_m"><a href="/photos/warszawa/3608467778/" title="　 by nao'"><img height='640'  data-k2-lazyload="http://farm4.static.flickr.com/3305/3608467778_5209a56dba_z.jpg" ></a>			</div>

    

			<div class="StreamView" id="sv_body_3515142697">
					
					<span class="photo_container pc_m"><a href="/photos/warszawa/3515142697/" title="　 by nao'"><img height='640'  data-k2-lazyload="http://farm4.static.flickr.com/3629/3515142697_feb67492db_z.jpg" ></a>			</div>

    

			<div class="StreamView" id="sv_body_3402434620">
					
					<span class="photo_container pc_m"><a href="/photos/warszawa/3402434620/" title="　 by nao'"><img height='640'  data-k2-lazyload="http://farm4.static.flickr.com/3626/3402434620_74509906c3_z.jpg" ></a>			</div>

    

			<div class="StreamView" id="sv_body_3185641754">
					
					<span class="photo_container pc_m"><a href="/photos/warszawa/3185641754/" title="　 by nao'"><img height='640'  data-k2-lazyload="http://farm4.static.flickr.com/3481/3185641754_4fbf3fff41_z.jpg" ></a>			</div>

    

			<div class="StreamView" id="sv_body_3185641720">
					
					<span class="photo_container pc_m"><a href="/photos/warszawa/3185641720/" title="　 by nao'"><img height='640'  data-k2-lazyload="http://farm4.static.flickr.com/3304/3185641720_61c81768c1_z.jpg" ></a>			</div>

    

			<div class="StreamView" id="sv_body_3120289043">
					
					<span class="photo_container pc_m"><a href="/photos/warszawa/3120289043/" title="　 by nao'"><img height='640'  data-k2-lazyload="http://farm4.static.flickr.com/3210/3120289043_22463010c6_z.jpg" ></a>			</div>

    

			<div class="StreamView" id="sv_body_3121102748">
					
					<span class="photo_container pc_m"><a href="/photos/warszawa/3121102748/" title="　 by nao'"><img height='640'  data-k2-lazyload="http://farm4.static.flickr.com/3018/3121102748_679c6ee64e_z.jpg" ></a>			</div>

    







</div>
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
<?php echo_default_js(""); ?>
<script>
YUI({injected: true}).use('k2-data-lazyload',function(Y){
	Y.on('domready',function(){
		var lazy = new Y.DataLazyload(document,{offset:300,placeholder:'none'});
	});
});
</script>
</body>
</html>
