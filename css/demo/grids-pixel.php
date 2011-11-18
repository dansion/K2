<!doctype html>
<html>
<head>
<meta charset="utf-8">
<title>K2 Grids - Pixel Mode</title>
<meta http-equiv="X-UA-Compatible" content="IE=Edge">
<link rel="stylesheet" charset="utf-8" href="/k2/css/reset.css"> 
<link rel="stylesheet" charset="utf-8" href="/k2/css/grids.css">
<link rel="stylesheet" charset="utf-8" href="/k2/_assets/demo.css">

<style>
.box {
  background : #eee;
  color : red;
  font-size : 14px;
  font-weight : bold;
  text-align : center;
  height : 50px;
  line-height : 50px;
  margin-bottom : 10px;
}
.bg {
  height : 120px;
  background : #820629;
}
</style>


</head>
<body>
<h1>K2 Grids - Pixel Mode</h1>

<h2>算法</h2>
<ul>
<li>宽度和class是对应的，150px宽度对应于两个class：k2-w8和k2-150px。</li>
<li>子模块的宽度累加起来和父模块的宽度应该一致，注意模块之间有10px的间距。</li>
<li>最后一项添加k2-last，清除右边距。</li>
</ul>

<h2>杭州首页，950px，两栏</h2>

<h3>演示</h3>
<div class="k2-single k2-950px bg">
  <div class="k2-670px">
    <div class="box">670px</div>
  </div>
  <div class="k2-270px k2-last">
    <div class="box">270px</div>
  </div>
</div>

<h3>源代码</h3>
<pre class="brush:html">
&lt;div class="k2-single k2-950px">
  &lt;div class="k2-670px">&lt;/div>
  &lt;div class="k2-270px k2-last">&lt;/div>
&lt;/div>
</pre>

<h2>我的口碑首页，950px，三栏</h2>

<h3>演示</h3>
<div class="k2-single k2-950px bg">
  <div class="k2-150px">
    <div class="box">150px</div>
  </div>
  <div class="k2-590px">
    <div class="box">590px</div>
  </div>
  <div class="k2-190px k2-last">
    <div class="box">190px</div>
  </div>
</div>

<h3>源代码</h3>
<pre class="brush:html">
&lt;div class="k2-single k2-950px">
  &lt;div class="k2-150px">&lt;/div>
  &lt;div class="k2-590px">&lt;/div>
  &lt;div class="k2-190px k2-last">&lt;/div>
&lt;/div>
</pre>

<h2>专题，100%背景，950px内容，一栏</h2>

<h3>演示</h3>
<div class="k2-grids bg">
  <div class="k2-single k2-950px">
    <div class="box">950px</div>
  </div>
  <div class="k2-single k2-950px">
    <div class="box">950px</div>
  </div>
</div>

<h3>源代码</h3>
<pre class="brush:html">
&lt;div class="k2-grids">
  &lt;div class="k2-single k2-950px">&lt;/div>
  &lt;div class="k2-single k2-950px">&lt;/div>
&lt;/div>
</pre>

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
<script charset="utf-8" src="/k2/seed/seed.js"></script> 
<script charset="utf-8" src="/k2/_assets/config.js"></script> 

</body>
</html>