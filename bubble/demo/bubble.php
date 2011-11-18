<!doctype html>
<html>
<head>
<meta charset="utf-8">
<title>k2-bubble（气泡提示）</title>
<meta http-equiv="X-UA-Compatible" content="IE=Edge">
<link rel="stylesheet" charset="utf-8" href="/k2/css/reset.css">
<link rel="stylesheet" charset="utf-8" href="/k2/_assets/demo.css">
<link rel="stylesheet" charset="utf-8" href="/k2/bubble/assets/bubble.css">
<style>
.clearfix:after{content:'\20';display:block;height:0;clear:both;}
.clearfix{zoom:1;}
</style>
</head>
<body>

<h1>k2-bubble（气泡提示）</h1>

<h2>静态</h2>
<div class="clearfix" style="padding-top:50px;position:relative;z-index:2012;">
    <div style="float:left;text-align:left;">
        <a href="#" class="k2-bubble-visible" data-title="鼠标悬停显示气泡。">这是一个气泡提示</a>
        <a href="#" class="k2-bubble-visible" data-title="鼠标悬停显示气泡，鼠标移开隐藏气泡。">这是一个气泡提示</a>
        <a href="#" class="k2-bubble-visible" data-title="鼠标悬停显示气泡，鼠标移开隐藏气泡。鼠标悬停显示气泡，鼠标移开隐藏气泡。">这是一个气泡提示</a>
        <a href="#" class="k2-bubble-visible" data-title="鼠标悬停显示气泡，鼠标移开隐藏气泡。">这是一个气泡提示</a>

        <a href="#" class="k2-bubble-visible" data-title="鼠标悬停显示气泡。">这是一个气泡提示</a>
        <a href="#" class="k2-bubble-visible" data-title="鼠标悬停显示气泡，鼠标移开隐藏气泡。鼠标悬停显示气泡，鼠标移开隐藏气泡。">这是一个气泡提示</a>
    </div>
    <div style="float:right;text-align:right;">
        <a href="#" class="k2-bubble-visible" data-title="鼠标悬停显示气泡，鼠标移开隐藏气泡。">这是一个气泡提示</a>
        <a href="#" class="k2-bubble-visible" data-title="鼠标悬停显示气泡。鼠标悬停显示气泡。鼠标悬停显示气泡。鼠标悬停显示气泡。">这是一个气泡提示</a>
        <a href="#" class="k2-bubble-visible" data-title="鼠标悬停显示气泡，鼠标移开隐藏气泡。鼠标悬停显示气泡，鼠标移开隐藏气泡。">这是一个气泡提示</a>

        <a href="#" class="k2-bubble-visible" data-title="鼠标悬停显示气泡，鼠标移开隐藏气泡。">这是一个气泡提示</a>
        <a href="#" class="k2-bubble-visible" data-title="鼠标移开隐藏气泡鼠标移开隐藏气泡鼠标移开隐藏气泡鼠标悬停显示气泡。">这是一个气泡提示</a>
        <a href="#" class="k2-bubble-visible" data-title="鼠标移开隐藏气泡鼠标移开隐藏气泡鼠标移开隐藏气泡">这是一个气泡提示</a>
    </div>
</div>
<h2>悬停</h2>
<div class="clearfix" style="position:relative;z-index:2012;">
    <div style="float:left;text-align:left;">

        <a href="#" class="k2-bubble-hidden" data-title="鼠标悬停显示气泡。">这是一个气泡提示</a>
        <a href="#" class="k2-bubble-hidden" data-title="鼠标悬停显示气泡，鼠标移开隐藏气泡。">这是一个气泡提示</a>
        <a href="#" class="k2-bubble-hidden" data-title="鼠标悬停显示气泡，鼠标移开隐藏气泡。鼠标悬停显示气泡，鼠标移开隐藏气泡。">这是一个气泡提示</a>
        <a href="#" class="k2-bubble-hidden" data-title="鼠标悬停显示气泡，鼠标移开隐藏气泡。">这是一个气泡提示</a>
        <a href="#" class="k2-bubble-hidden" data-title="鼠标悬停显示气泡。">这是一个气泡提示</a>
        <a href="#" class="k2-bubble-hidden" data-title="鼠标悬停显示气泡，鼠标移开隐藏气泡。鼠标悬停显示气泡，鼠标移开隐藏气泡。">这是一个气泡提示</a>

    </div>
    <div style="float:right;text-align:right;">
        <a href="#" class="k2-bubble-hidden" data-title="鼠标悬停显示气泡，鼠标移开隐藏气泡。">这是一个气泡提示</a>
        <a href="#" class="k2-bubble-hidden" data-title="鼠标悬停显示气泡。鼠标悬停显示气泡。鼠标悬停显示气泡。鼠标悬停显示气泡。">这是一个气泡提示</a>
        <a href="#" class="k2-bubble-hidden" data-title="鼠标悬停显示气泡，鼠标移开隐藏气泡。鼠标悬停显示气泡，鼠标移开隐藏气泡。">这是一个气泡提示</a>
        <a href="#" class="k2-bubble-hidden" data-title="鼠标悬停显示气泡，鼠标移开隐藏气泡。">这是一个气泡提示</a>
        <a href="#" class="k2-bubble-hidden" data-title="鼠标移开隐藏气泡鼠标移开隐藏气泡鼠标移开隐藏气泡鼠标悬停显示气泡。">这是一个气泡提示</a>

        <a href="#" class="k2-bubble-hidden" data-title="鼠标移开隐藏气泡鼠标移开隐藏气泡鼠标移开隐藏气泡">这是一个气泡提示</a>
    </div>
</div>

<h2>Code</h2>
<ol>
	<li>在需要使用气泡提示的地方加入下面的代码，并设置好气泡提示内容。</li>
	<pre class="brush:html;">&lt;a href="#" class="k2-bubble-visible" data-title="鼠标悬停显示气泡。"&gt;这是一个气泡提示&lt;/a&gt;</pre>
	<li>调用如下方法：</li>
<pre class="brush:javascript;">
YUI().use('k2-bubble', function (Y) {

	//静态类型
	var bubble1 = new Y.Bubble({
		trigger: '.k2-bubble-visible',
		visible: true
	});

	//悬停触发类型
	var bubble2 = new Y.Bubble({
		trigger: '.k2-bubble-hidden',
		maxWidth: 150
	});

});
</pre>
</ol>

<h2>参数</h2>
<table>
	<tr>
		<th>参数</th>
		<th>值</th>
		<th>默认值</th>
		<th>含义</th>
	</tr>
	<tr>
		<td>trigger</td>
		<td>String</td>
		<td>#k2-bubble</td>
		<td>气泡触发节点</td>
	</tr>
	<tr>
		<td>title</td>
		<td>String</td>
		<td>data-title</td>
		<td>标题所位于的节点属性</td>
	</tr>
	<tr>
		<td>maxWidth</td>
		<td>Float</td>
		<td>200</td>
		<td>气泡最大宽度限制</td>
	</tr>
	<tr>
		<td>offsetX</td>
		<td>Float</td>
		<td>0</td>
		<td>气泡水平偏移量（像素）</td>
	</tr>
	<tr>
		<td>offsetY</td>
		<td>Float</td>
		<td>0</td>
		<td>气泡垂直偏移量（像素）</td>
	</tr>
	<tr>
		<td>visible</td>
		<td>Boolean</td>
		<td>false</td>
		<td>气泡类型，默认悬停触发</td>
	</tr>
	<tr>
		<td>delay</td>
		<td>Float</td>
		<td>500</td>
		<td>气泡隐藏的延迟时间</td>
	</tr>
	<tr>
		<td>arrow</td>
		<td>String</td>
		<td>bottom</td>
		<td>气泡箭头朝向，可选值 bottom | top</td>
	</tr>
</table>
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
<script charset="utf-8" src="/k2/seed/seed.js"></script>
<script charset="utf-8" src="/k2/_assets/config.js"></script>
<script>
YUI({modules:{
    'k2-bubble':{
        fullpath:'/k2/bubble/bubble.js',
        requires:['base-base', 'node-base', 'event-base', 'node-screen', 'node-style', 'event-mouseenter', 'event-resize']
      }  
    }
}).use('k2-bubble', function (Y) {

	var bubble1 = new Y.Bubble({
		trigger: '.k2-bubble-visible',
		visible: true
	});

	var bubble2 = new Y.Bubble({
		trigger: '.k2-bubble-hidden',
		maxWidth: 150
	});

});
</script>
</body>
</html>