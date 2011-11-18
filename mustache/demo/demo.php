<?php
require_once("../../_assets/demo.php");
?>
<html>
<head>
  <?php echo_html_charset() ?>
  <title>mustache</title>
  <meta http-equiv="X-UA-Compatible" content="IE=Edge">
  <?php echo_default_css() ?>
  <style>
  </style>
</head>
<body>
  <h1>mustache</h1>
  <h2>说明</h2>
  <p><a href="http://mustache.github.com/">Mustache</a>是一种多语言支持的少逻辑的模板。操作手册请看<a href="http://mustache.github.com/mustache.5.html">{mustache(5)}</a>。JavaScript语言本身还可以进行更复杂的操作，具体请看<a href="https://github.com/janl/mustache.js">mustache.js</a></p>
  <h2>Code</h2>
  <ol>
    <li>
	    <h3><strong>标签和空值</strong></h3>
	    <h4>Mustache模板：</h4>
	    <pre class="brush:html">
        {{name}}
        {{age}}
        {{company}}
        {{{company}}}
	    </pre> 
	    <h4>数据</h4>
	    <pre class="brush:javascript">
        {
          name: "mustache",
          company: "<b>koubei.com</b>",
          test:function(){}
        }
	    </pre> 
	    <h4>结果</h4>
	    <pre class="brush:html">
	    </pre> 
    </li>
    <li>
	    <h3><strong>条件语句</strong></h3>
	    <h4>Mustache模板：</h4>
	    <pre class="brush:html">
        {{#condition_a}}
          如果condition_a是true，这句话将显示
        {{/condition_a}}

        {{#condition_b}}
          如果condition_b是true，这句话将显示
        {{/condition_b}}

        {{#condition_c}}
          如果condition_c是true，这句话将显示
        {{/condition_c}}
	    </pre> 
	    <h4>数据</h4>
	    <pre class="brush:javascript">
				{
				  "condition_a": true,
				  "condition_b": false 
				}
	    </pre> 
	    <h4>结果</h4>
	    <pre class="brush:html">
	    </pre> 
    </li>
    <li>
	    <h3><strong>列表</strong></h3>
	    <h4>Mustache模板：</h4>
	    <pre class="brush:html">
        {{#repo}}
          <b>{{name}}</b>
        {{/repo}}
	    </pre> 
	    <h4>数据</h4>
	    <pre class="brush:javascript">
				{
				  "repo": [
				    { "name": "resque" },
				    { "name": "hub" },
				    { "name": "rip" },
				  ]
				}
	    </pre> 
	    <h4>结果</h4>
	    <pre class="brush:html">
	    </pre> 
    </li>
    <li>
	    <h3><strong>lambda</strong></h3>
	    <h4>Mustache模板：</h4>
	    <pre class="brush:html">
				{{#wrapped}}
          {{name}} is awesome.
        {{/wrapped}}
	    </pre> 
	    <h4>数据</h4>
	    <pre class="brush:javascript">
				{
				  "name": "Willy",
				  "wrapped": function() {
				    return function(text) {
				      return "<b>" + text + "</b>"
				    }
				  }
				}
	    </pre> 
	    <h4>结果</h4>
	    <pre class="brush:html">
	    </pre> 
    </li>
    <li>
	    <h3><strong>替换值</strong></h3>
	    <h4>Mustache模板：</h4>
	    <pre class="brush:html">
				{{#repo}}
				  <b>{{name}}</b>
				{{/repo}}
				{{^repo}}
				  No repos :(
				{{/repo}}
	    </pre> 
	    <h4>数据</h4>
	    <pre class="brush:javascript">
				{
				  "repo": []
				}
	    </pre> 
	    <h4>结果</h4>
	    <pre class="brush:html">
	    </pre> 
    </li>
    <li>
	    <h3><strong>注释</strong></h3>
	    <h4>Mustache模板：</h4>
	    <pre class="brush:html">
        <h1>Today{{! ignore me }}.</h1>
	    </pre> 
	    <h4>数据</h4>
	    <pre class="brush:javascript">
        { }
	    </pre> 
	    <h4>结果</h4>
	    <pre class="brush:html">
	    </pre> 
    </li>
  </ol>
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
    'mustache' : {
      //fullpath : '/k2/mustache/mustache.js'
      fullpath : 'mustache/mustache.js'
    }
  }  
}).use('node-base','mustache',function(Y){
  Y.log('success','info','mustache demo');
  Y.all('pre').each(function(v,i,a){
    if((i + 1) % 3 === 0){
      //Y.JSON.parse无法解析function(){}的值
      v.insert(Y.mustache(a.item(i-2).getContent(),eval( '(' + a.item(i-1).getContent() + ')')).replace(/&/g,'&amp;'));
    }
  });
});
</script>
</body>
</html>
