<?php
require_once("../../_assets/demo.php");
?>
<html>
<head>
  <?php echo_html_charset() ?>
  <title>k2-eg</title>
  <?php echo_default_css() ?>
	<style>
		#editor-demo .yui3-separate-console{
			position:fixed;
			*position:absolute;
		}
		.k2-editor-status-current-size {
			color:green;
		}
		.k2-editor-status-less-size{
			color:blue;
		}
		.k2-editor-status-above-size{
			color:red;
		}
		.k2-editor-status-min-size{
			color:orange;
		}
		.k2-editor-status-max-size{
			color:purple;
		}
	</style>
</head>
<body id="editor-demo" class='yui-skin-sam'>
<h2>Code</h2>

<pre class='brush:html'>
<textarea id='simple' style='width:600px;height:300px'>this is a simple editor</textarea>
</pre>
<pre class="brush:javascript;">
YUI().use('editor-simple',function(Y){
	var simple = Y.SimpleEditor.render('simple',{
			editorStatus:{
				minSize:1,//最少输入字数
				maxSize : 10,//最大输入字数			
				defaultTemplate : "请至少输入{minSize}字,最多不超过{maxSize}字", //默认显示模
				errorTemplate:"我哩个擦,出错了", //出错显示模板</br>
				lessTemplate:"请至少输入{minSize}字,当前{currentSize}字,还差{lessDifferVal}字", //比最少字数少的模板		 
				aboveTemplate:"最多输入{maxSize}字,当前{currentSize}字,多出{aboveDifferVal}字", //比最大字数多的模板
				noticeTemplate:"当前已经输入{currentSize}字", //提示信息模板,通常使用在正在输入时
				customTemplate:"自定义模板{customVal}" //自定义模板,通常用于显示自定义信息,可以配合自定义数据一起使用					 
			}
	});
	Y.on('click',function(){
		simple.status.showNotice('customTemplate',{customVal:"这里是自定义数据的值"});
	},'#show-custom');  
	//基于simple ediotr的扩展,通过插件方式插入
  simple.plug(Y.Plugin.EditorImage);
});
</pre>
<h2>Init</h2>
<table>
	<tr><th>类名</th><th>说明</th><th>方法</th><th>参数</th></tr>
	<tr><td>Y.EditorWrap</td><td>初始化editor,用于自定义editor</td><td>render</td><td>id,config</td></tr>
	<tr><td>Y.SimpleEditor</td><td>初始化简单版editor,包括文字格式化,插入图片,链接,列表</td><td>render</td><td>id,config</td></tr>
	<tr><td>Y.MiniEditors</td><td>初始化迷你editor,只包括插入图片</td><td>render</td><td>id,config</td></tr>
</table>
<h2>Plugins</h2>
<table>
	<tr><th>插件</th><th>说明</th><th>参数</th></tr>
	<tr><td>EditorHTMLParser</td>
	<td>标签闭合,过滤</td><td>eg</td></tr>
	<tr>
  <td>EditorButton</td>
  <td>按钮</td>
  <td><p>title:按钮标题<br>
    text:按钮文案<br>
  contentCls:按钮样式<br>
  cmd:执行命令名<br>
  </p></td></tr>
	<tr>
	  <td>EditorSelect</td>
	  <td>下拉菜单</td>
	  <td><p>width:宽度<br>
	  popupWidth:菜单宽度<br>
	  titile:标题<br>
	  items:内容
	  <br>
	  </p></td></tr>
	<tr>
  <td>EditorFormat</td>
  <td>button,select生产工厂</td>
  <td>&nbsp;</td></tr>
	<tr>
  <td>EditorFont</td>
  <td>加粗,斜体,字体,字号</td>
  <td>&nbsp;</td></tr>
	<tr>
	  <td>ColorSupport</td>
	  <td>生成颜色菜单</td>
	  <td>title:按钮标题<br>
contentCls:按钮样式<br>
cmd:执行命令名</td>
     </tr>
     <tr>
	  <td>EditorBgColor</td>
	  <td>背景颜色</td>
	  <td>&nbsp;</td>
     </tr>
     <tr>
	  <td>EditorForeColor;</td>
	  <td>字体颜色</td>
	  <td>&nbsp;</td>
     </tr>
     <tr>
	  <td>EditorInsertList</td>
	  <td>无序&amp;有序列表</td>
	  <td>&nbsp;</td>
     </tr>
     <tr>
	  <td>EditorCreateLink</td>
	  <td>插入链接</td>
	  <td>&nbsp;</td>
     </tr>
     <tr>
	  <td>EditorImage</td>
	  <td>插入图片</td>
	  <td>&nbsp;</td>
     </tr>
     <tr>
	  <td>ColorSupport</td>
	  <td>生成颜色菜单</td>
	  <td>&nbsp;</td>
		 </tr>     
		 <tr>
	  <td>EditorAlign</td>
	  <td>文字位置</td>
	  <td>&nbsp;</td>
		 </tr> 
     <tr>
	  <td>EditorIndent</td>
	  <td>文字缩进</td>
	  <td>&nbsp;</td>
		 </tr>
     <tr>
	  <td>EditorSource</td>
	  <td>显示源码</td>
	  <td>&nbsp;</td>
		 </tr>
     <tr>
	  <td>EditorStatus</td>
	  <td>富文本当前输入状态</td>
		<td>
				样式:</br>
				k2-editor-status-current-size : 当前输入字数</br>
				k2-editor-status-min-size : 		当前最小字数</br>
				k2-editor-status-max-size : 		当前最大字数</br>
				k2-editor-status-less-size : 		当前少于字数</br>
				k2-editor-status-above-size : 	当前超出字数</br>
				属性:</br>
				minSize:1,//最少输入字数</br>
				maxSize : 10,//最大输入字数	</br>			
				defaultTemplate : "请至少输入{minSize}字,最多不超过{maxSize}字" //默认显示模板</br>
				errorTemplate:"我哩个擦,出错了" //出错显示模板</br>
				lessTemplate:"请至少输入{minSize}字,当前{currentSize}字,还差{lessDifferVal}字" //比最少字数少的模板</br>		 
				aboveTemplate:"最多输入{maxSize}字,当前{currentSize}字,多出{aboveDifferVal}字" //比最大字数多的模板</br>
				noticeTemplate:"当前已经输入{currentSize}字" //提示信息模板,通常使用在正在输入时</br>
				customTemplate:"自定义模板" //自定义模板,通常用于显示自定义信息,可以配合自定义数据一起使用
				方法:</br>
				showNotice(type,valObj)</br>
				type : 模板名 </br>
				valObj : 模板中的数据</br>
		</td>
     </tr>
</table>
<h2>Flow diagram</h2>
<p><img src='yui3_editor.png' /></p>
	<h2>Example</h2>
	<p>simple editor</p>
	<textarea id='simple-editor' style='width:700px;height:300px'>example content</textarea>
	<button id='get-content'>getContent</button>
	<button id="setContent" type="button">设置内容</button>
	<button id="get-img-length">获取图片插入数量</button>
	<button id="get-text-length">获取文字数量(去空格后)</button>
	<button id="show-error">显示错误信息</button>
	<button id="show-notice">显示提示信息</button>
	<button id="show-above">超出默认字数</button>
	<button id="show-less">少于默认字数</button>
	<button id="show-default">默认信息</button>
	<div style='display:block'><textarea style='width:700px;height:100px' id='opt-wrap'></textarea></div>
	<h2>Test unit</h2>
	<textarea id='test' style='width:500px;height:300px' name='test-name'>test content</textarea>
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
$app_config = '';
echo_default_js($app_config);
?>
<script>
YUI().use('k2-editor-simple',"k2-editor-createlink",function(Y){
	var simple = Y.SimpleEditor.render('simple-editor');
	simple.plug(Y.Plugin.EditorStatus, {
			minSize:1,
			maxSize : 10,				
			defaultTemplate : "请至少输入{minSize}字,最多不超过{maxSize}字",
			errorTemplate:"我哩个擦,出错了",
			lessTemplate:"请至少输入{minSize}字,当前{currentSize}字,还差{lessDifferVal}字",				 
			aboveTemplate:"最多输入{maxSize}字,当前{currentSize}字,多出{aboveDifferVal}字",
			noticeTemplate:"当前已经输入{currentSize}字"						 
		});

	Y.one('#get-content').on('click',function(){
		var value;
		value = simple.htmlparser.HTMLtoXML(simple.getContent());
		simple.get('textArea').set('value',value);
		Y.one('#opt-wrap').set('value',simple.get('textArea').get('value'))	;

		//Y.one('#opt-wrap').set('value',simple.getContent())	;
	});
	Y.on('click',function(){
		Y.one('#opt-wrap').set('value',simple.htmlparser.getImageLength(simple.getContent()))	;
	},'#get-img-length');
	Y.on('click',function(){
		Y.one('#opt-wrap').set('value',simple.htmlparser.getContentTextLength(simple.getContent()))	;
	},'#get-text-length');
	Y.one('#setContent').on('click', function(){
		simple.set('content', '在这里设置内容后光标定位到文本后，按撤退键，文本全部被清空');
	})

	Y.on('click',function(){
		simple.status.showNotice('errorTemplate');
	},'#show-error');	
	Y.on('click',function(){
		simple.status.showNotice('noticeTemplate');
	},'#show-notice');
	Y.on('click',function(){
		simple.status.showNotice('lessTemplate');
	},'#show-less');
	Y.on('click',function(){
		simple.status.showNotice('aboveTemplate');
	},'#show-above');
	Y.on('click',function(){
		simple.status.showNotice('defaultTemplate');
	},'#show-default');
	//Y.log(simple.getInstance());
});
</script>
<!--
<script>
YUI().use('test','editor-simple','node-event-simulate',function(Y) { 
    var editor = null,
    template = {
        name: 'Editor Tests',
        setUp : function() {
        },
        tearDown : function() {
        },
        test_load: function() {
            Y.Assert.isObject(Y.Frame, 'EditorBase was not loaded');
            Y.Assert.isObject(Y.EditorBase, 'EditorBase was not loaded');
				},
				test_editor: function() {
						var editor = Y.SimpleEditor.render('test');
						var inst = editor.getInstance();
						Y.log(inst.Selection());
						Y.Assert.isInstanceOf(YUI, inst, 'Internal instance not created');
						Y.SimpleEditor.destroy(editor);
				}
				/*
				,
				test_font_bold :  function(){
					var editor = Y.SimpleEditor.render('test');
					Y.Assert.isObject(Y.EditorButton, 'EditorBase was not loaded');
					var inst = editor.getInstance();	
					var sel = new inst.Selection();
					sel.selectNode(inst.one('body *'));
					editor.get('toolBarDiv').one('.k2-editor-tools-bold').simulate('click');
					Y.Assert.areSame(editor.getInstance().one('body').get('firstChild').getComputedStyle('fontWeight'), '400', 'Set font-weight failed');	
					Y.SimpleEditor.destroy(editor);
				}
				,
				test_font_italic :  function(){
					var editor = Y.SimpleEditor.render('test');
					Y.Assert.isObject(Y.EditorButton, 'EditorBase was not loaded');
					var inst = editor.getInstance();	
					var sel = new inst.Selection();
					sel.selectNode(inst.one('body *'));
					editor.get('toolBarDiv').one('.k2-editor-tools-italic').simulate('click');
					Y.Assert.areSame(editor.getInstance().one('body').one('i').getComputedStyle('fontStyle'), 'italic', 'Set font-style failed');	
					Y.SimpleEditor.destroy(editor);
				},
				test_forecolor :  function(){
					var editor = Y.SimpleEditor.render('test');
					Y.Assert.isObject(Y.ColorSupport, 'ColorSupport was not loaded');
					var inst = editor.getInstance();	
					var sel = new inst.Selection();
					sel.selectNode(inst.one('body *'));
					editor.get('toolBarDiv').one('.k2-editor-tools-color').simulate('click');
					Y.Node.all('.k2-color-a').item(1).simulate('click');
					Y.Assert.areSame(Y.EditorBase.FILTER_RGB(editor.getInstance().one('body').get('firstChild').getComputedStyle('color')), '#800000', 'Set font-color failed');	
					Y.SimpleEditor.destroy(editor);
				},	
				test_bgcolor :  function(){
					var editor = Y.SimpleEditor.render('test');
					Y.Assert.isObject(Y.ColorSupport, 'ColorSupport was not loaded');
					var inst = editor.getInstance();	
					var sel = new inst.Selection();
					sel.selectNode(inst.one('body span'));
					editor.get('toolBarDiv').one('.k2-editor-tools-bgcolor').simulate('click');
					Y.Node.all('.k2-color-a').item(4).simulate('click');
					Y.Assert.areSame(Y.EditorBase.FILTER_RGB(editor.getInstance().one('body').one('span').getComputedStyle('backgroundColor')), '#008080', 'Set background-color failed');	
					Y.SimpleEditor.destroy(editor);
				}
			 */
    };
    
    var suite = new Y.Test.Suite("Editor");
    
		suite.add(new Y.Test.Case(template));
		Y.EditorBase.USE.push('node-event-simulate');
		
		//editor2 = new Y.EditorBase().render('#test2');
    Y.Test.Runner.add(suite);
    Y.Test.Runner.run();

})
</script>

-->
</body>
</html>
