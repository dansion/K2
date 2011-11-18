<?php
//define('CHARSET','gbk'); //默认utf-8，无需设置，其他编码需要指定
require_once("../../_assets/demo.php");
?>
<html>
<head>
  <?php echo_html_charset() ?>
  <title>K2:seed skinnable</title>
  <?php echo_default_css() ?>
  <style>
  </style>
</head>
<body>
  <h1>K2:seed skinnable</h1>
  <h2>说明</h2>
  <p>通过设置{skinnable:false}来阻止YUI加载对应的样式，但支持直接使用YUI的默认样式。</p>
  <pre class="brush:javascript">
  YUI({
    skinnable:false
  }).use('autocomplete',function(Y){
    //coding  
  });
  </pre>
  <p>由于YUI 3.3.0及以前版本只支持切换样式路径，但不支持通过配置的方式来决定是否加载样式，所以目前的方案是通过打patch的方式实现的，具体实现请在seed.js中搜索k2-patch。</p>
  <h2>测试</h2>
  <p>使用autocomplete来测试{skinnable:false}是否生效。<br /><img src="skinnable.png" height="276" width="366"></p>
  <p> 请输入任意字母：<input id="ac-input" type="text"></p>
<script>
//仅用于开发环境
if(typeof K2_config === 'undefined'){
  var K2_config = {
    noCombine : false,//是否使用combo功能，开发环境下支持combo需要配置minfy，默认使用
    noCache : true,//是否在js或css文件尾部增加随机函数来防止浏览器缓存，默认使用
    console : false,//是否使用通用的console控制台，这样就可以在页面显示Y.log内容，默认使用
    noVersion : false,//是否使用不带版本号的文件，这样就可以直接调用本地开发文件，因为这些文件都是不带版本号的，默认使用
    syntaxHighlight : true,//是否格式化代码显示，默认使用
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
YUI({
  skinnable:false
}).use("autocomplete", "autocomplete-filters", "autocomplete-highlighters","node-pluginhost", function (Y) {
  var states = [
    'Alabama',
    'Alaska',
    'Arizona',
    'Arkansas',
    'California',
    'Colorado',
    'Connecticut',
    'Delaware',
    'Florida',
    'Georgia',
    'Hawaii',
    'Idaho',
    'Illinois',
    'Indiana',
    'Iowa',
    'Kansas',
    'Kentucky',
    'Louisiana',
    'Maine',
    'Maryland',
    'Massachusetts',
    'Michigan',
    'Minnesota',
    'Mississippi',
    'Missouri',
    'Montana',
    'Nebraska',
    'Nevada',
    'New Hampshire',
    'New Jersey',
    'New Mexico',
    'New York',
    'North Dakota',
    'North Carolina',
    'Ohio',
    'Oklahoma',
    'Oregon',
    'Pennsylvania',
    'Rhode Island',
    'South Carolina',
    'South Dakota',
    'Tennessee',
    'Texas',
    'Utah',
    'Vermont',
    'Virginia',
    'Washington',
    'West Virginia',
    'Wisconsin',
    'Wyoming'
  ];
  
  Y.one('body').addClass('yui3-skin-sam');

  Y.one('#ac-input').plug(Y.Plugin.AutoComplete, {
    resultFilters    : 'phraseMatch',
    resultHighlighter: 'phraseMatch',
    source           : states
  });
});

</script>
</body>
</html>
