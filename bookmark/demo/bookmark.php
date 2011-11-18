<?php
require_once("../../_assets/demo.php");
?>
<html>
<head>
  <?php echo_html_charset() ?>
  <title>K2 Favourite</title>
  <?php echo_default_css() ?>
  <style type="text/css">
		#Wrap{text-align:left; width:950px;}
		.header{font-size:14px;font-weight:bold;}
		.embed{color:#FF5500;font-size:14px;}
		.con{padding:10px;}
		.bookMark{margin: 0 7px;}
  </style>
</head>
	<body>
		<div id="Wrap">
			<div class="header">
				<h3 class="embed">组件说明</h3>
				<p class="con">此组件功能已实现添加收藏夹的功能，目前兼容Firefox 1.x+, IE5+ and Opera7+。chrome暂不允许用户通过javascript打开浏览器书签页。需要k2-bookmark组件</p>
			</div>
			<div class="content">
				<fieldset>
					<legend class="embed">参数说明</legend>
						<div class="con">
							<p>参数：Selector、Title、URL。各解释如下所示。</p>
							<ol>
								<li>Selector:选择器,如.favorite、#id。没有则默认的值是.bookMark</li>
								<li>Title：收藏夹显示名,没有则默认是当前文档title的值</li>
								<li>URL：收藏夹保存的链接地址。没有则默认是当前页面的url地址</li>
							</ol>
						</div>
				</fieldset>
				<fieldset>
					<legend class="embed">示例</legend>
					<div>
						<div class="example con">
							<p><i>Opera7+浏览器只能在a标签下才能弹出浏览器的bookmark对话框,推荐在a标签下绑定此事件</i></p>
							<p><a class="bookMark" href="javascript:void(0);">添加到我的收藏夹</a></p>
						</div>
						<div>
							<p class="embed">js调用代码</p>
							<pre class="brush:javascript;">
YUI({
	modules : {
			'k2-bookmark' : {
					fullpath : '../bookmark.js',
					requires : ['base-base', 'node-base']
			}
	}
}).use("k2-bookmark", function(Y){
		var fav = new Y.BookMark();//var fav = new Y.BookMark({Selector:".bookMark",Title:"我的收藏夹",URL:"http://kxt.koubei.com"});
		fav.onAddBookMark();
});
							</pre>
						</div>
					</div>
				</fieldset>
			</div>
		</div>
<?php echo_default_js(''); ?>

<script>
	YUI({
			modules : {
					'k2-bookmark' : {
							fullpath : '../bookmark.js',
							requires : ['base-base', 'node-base']
					}
			}
	}).use("k2-bookmark", function(Y){
			var fav = new Y.BookMark();
			fav.onAddBookMark();
	});
</script>

	</body>
</html>