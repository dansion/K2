<?php
//define('CHARSET','gbk'); //默认utf-8，无需设置，其他编码需要指定
require_once("../../_assets/demo.php");
?>
<html>
<head>
  <?php echo_html_charset() ?>
  <title>breakWord：实现连续字符的自动换行</title>
  <meta http-equiv="X-UA-Compatible" content="IE=Edge">
  <?php echo_default_css() ?>
  <style>
  .k2-break-word{
    float:left;
    margin:10px;
    padding:10px;
    width:200px;
    border:1px solid #ddd;   
    background:#f2f2f2;
  }
  </style>
</head>
<body>
  <h1>breakWord：实现连续字符的自动换行</h1>
  <h2>说明</h2>
  <ol>
    <li>使用时，尽量先在head中加入对应的样式表break-word-1-0-0.css，或在对应CSS文件中加入如下样式：
    <pre class="brush:css">
      .k2-break-word{
        word-wrap : break-word;  
      }
    </pre> 
    </li>
    <li>默认探测.k2-break-word</li>
    <li>容器必须有生效的固定宽度，比如{display:block;width:200px;}</li>
    <li>如果有动态的插入内容需要，可以再次调用breakWord
    </li>
    <li>在IE6、IE7、IE8、FF3.0+、FF3.6+、Opera10.50+、Safari4.0+和Chrome4.0+下测试过</li>
  </ol>
  <h2>Code</h2>
  <pre class="brush:javascript;">
YUI().use('k2-break-word',function(Y){
  Y.breakWord();
});
  </pre>
  <h2>参数</h2>
  <pre class="brush:javascript;">
YUI().use('k2-break-word',function(Y){
  Y.breakWord({wordLength:15,re:'[\w]',className:'yk-break-word',redo:true});
});
  </pre>
    <table>
      <tr><th>参数</th><th>默认值</th><th>含义</th></tr>
      <tr>
        <th>wordLength</th>
        <td>正整数，默认是13</td>
        <td>在这个字数内的单词不会被插入<wbr>，印象中超过13个字母的单词不多，这可以保证绝大部分单词不会被打碎</td>
      </tr>
      <tr>
        <th>re</th>
        <td>正则表达式，默认[a-zA-Z0-9]</td>
        <td>单词的正则表达式，用以确定一个单词是哪些字符组成，注意\的转义</td>
      </tr>
      <tr>
        <th>className</th>
        <td>合法class名数组，比如设置['yk-break-word']，方法就会对类名有yk-break-word的容器进行处理</td>
        <td>执行函数的元素对应属性名</td>
      </tr>
      <tr>
        <th>redo</th>
        <td>布尔值，默认false</td>
        <td>是否要对已经执行函数的元素重新执行函数</td>
      </tr>
    </table>
  <h2>例子</h2>
  <div class="k2-break-word">
    &lt;div class="k2-break-word"&gt;&lt;/div&gt;
    <span>                                    ................................................................................................</span>
    <strong>aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa</strong>
    <p>welcome to koubei ued!welcome to koubei ued!welcome to koubei ued!welcome to koubei ued!welcome to koubei ued!welcome to koubei ued!welcome to koubei ued!welcome to koubei ued!welcome to koubei ued!welcome to koubei ued!welcome to koubei ued!welcome to koubei ued!welcome to koubei ued!welcome to koubei ued!welcome to koubei ued!welcome to koubei ued!welcome to koubei ued!welcome to koubei ued!welcome to koubei ued!welcome to koubei ued!welcome to koubei ued!welcome to koubei ued!welcome to koubei ued!welcome to koubei ued!</p>
  </div>
<script>
//仅用于开发环境
if(typeof K2_config === 'undefined'){
  var K2_config = {
    noCombine : true,
    noCache : true,
    console : true,
    noVersion : true,
    syntaxHighlight : true,
    local : true
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
YUI({modules:{
    'k2-break-word':{
      fullpath:'/k2/break-word/break-word.js',
      requires:['node-base','node-style'] 
    }  
  }
}).use('k2-break-word',function(Y){
  Y.breakWord();
  Y.log('Y.breakWord() success','info','k2-break-word');
});
</script>
</body>
</html>
