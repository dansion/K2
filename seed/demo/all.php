<?php
//define('CHARSET','gbk'); //默认utf-8，无需设置，其他编码需要指定
require_once("../../_assets/demo.php");
?>
<html>
<head>
  <?php echo_html_charset() ?>
  <title>K2:seed modules test</title>
  <?php echo_default_css() ?>
  <style>
  </style>
</head>
<body>
  <h1>K2:seed modules test</h1>
  <h2>说明</h2>
  <p>这个页面用于获取所有的k2的模块，这样就可以查看模块文件是否上传到CDN。</p>
  <p>注意目前这个测试页面在IE9和Safari下不成功，推荐使用Firefox或Chrome。</p>
  <ol id="demo"></ol>
<script>
//仅用于开发环境
if(typeof K2_config === 'undefined'){
  var K2_config = {
    noCombine : true,//是否使用combo功能，开发环境下支持combo需要配置minfy，默认使用
    noCache : true,//是否在js或css文件尾部增加随机函数来防止浏览器缓存，默认使用
    console : true,//是否使用通用的console控制台，这样就可以在页面显示Y.log内容，默认使用
    noVersion : false,//是否使用不带版本号的文件，这样就可以直接调用本地开发文件，因为这些文件都是不带版本号的，默认使用
    syntaxHighlight : false,//是否格式化代码显示，默认使用
    local : false //是否使用本地路径，即类似/k2/seed/seed.js这样的绝对路径，这样无论你是什么本地域名都可以使用，
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
YUI().use('node-base',function(Y){
  var k2 = YUI_config.groups.k2,
      k2Base = 'http://k.kbcdn.com/' + k2.root,
      demo = Y.one('#demo'),
      k2Mods = k2.modules;
  Y.each(k2Mods,function(v,k){
    var url = k2Base + v.path,
        Get = Y.Get,
        hander = {
	        onSuccess:function(){
	          Y.log(k +' exists in CDN !','info','Seed Moduels Test');
            delete k2Mods[k];//在IE9下无论URL存在，都触发成功
	        },
	        onFailure:function(){//在IE9下和Chrome下不生效
	          Y.log(k +' doesn\'t exist in CDN, please check' + url + '.','warn','Seed Moduels Test');
            demo.append('<li><strong>'+ k + '</strong> doesn\'t exist in CDN, please check <a href="'+ url + '">' + url + '</a>.</li>')
	        }  
	      } ;
    if(v.type === 'css'){
      Get.css(url,hander);  
    }else{
      Get.script(url,hander);  
    }
  });
	Y.on('load',function(){//在IE9中onload在Get完成之前发生,Safari下也有问题
    if(Y.Object.isEmpty(k2Mods)){
	    demo.append('<li>all modules is downloaded successful!</li>');
    }else{
	    demo.append('<li>loading</li>');
	    demo.empty();
			Y.each(k2Mods,function(v,k){
			    var url = k2Base + v.path;
				  Y.log(k +' doesn\'t exist in CDN, please check' + url + '.','warn','Seed Moduels Test');
			    demo.append('<li><strong>'+ k + '</strong> doesn\'t exist in CDN, please check <a href="'+ url + '">' + url + '</a>.</li>')
			});
    }
	});
});
</script>
</body>
</html>
