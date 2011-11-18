<!doctype html>
<html>
<head>
<meta charset="utf-8">
<title>k2-moniter（埋点）</title>
<meta http-equiv="X-UA-Compatible" content="IE=Edge">
<link rel="stylesheet" charset="utf-8" href="/k2/css/reset.css">
<link rel="stylesheet" charset="utf-8" href="/k2/_assets/demo.css">
</head>
<body>

<h1>k2-moniter（埋点）</h1>

<h2>例子</h2>

<a href="javascript:void(0)" id="k2-monitor">这是一个埋点链接</a>

<h2>Code</h2>
<p>调用如下方法：</p>
<pre class="brush:javascript;">
YUI().use('k2-monitor', function (Y) {

	var monitor = new Y.Monitor({
		trigger: '.k2-bubble-visible',
		kind: 'kb.moniter',
		event: 'mouseout'
	});

});
</pre>

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
		<td>#k2-monitor</td>
		<td>需要部署锚点的节点</td>
	</tr>
	<tr>
		<td>kind</td>
		<td>String</td>
		<td>kb.moniter</td>
		<td>由BI指定的埋点ID</td>
	</tr>
	<tr>
		<td>event</td>
		<td>String</td>
		<td>mousedown</td>
		<td>注册的事件类型</td>
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
    'k2-monitor':{
        fullpath:'/k2/monitor/monitor.js',
        requires:['base-base', 'node-base', 'event-base']
      }  
    }
}).use('k2-monitor', function (Y) {

	var monitor = new Y.Monitor({
		trigger: '#k2-monitor',
		kind: 'kb.monitor',
		event: 'mouseout'
	});

});
</script>
</body>
</html>