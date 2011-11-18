<?php
$path = "";
$data = $path."icons.data";
$file_handle = fopen($data,"r");
while(!feof($file_handle)){
  	$rule = explode(",",trim(fgets($file_handle)));
  	if($rule[0]){
		$icons[] = array($rule[0],$rule[1],$rule[2],$rule[3]);
	}
}
fclose($file_handle);
?>
<!doctype html>
<html>
<head>
<meta charset="utf-8">
<title>K2-Icon</title>
<meta http-equiv="X-UA-Compatible" content="IE=Edge">
<link href="../css/reset.css" rel="stylesheet">
<link href="../css/common.css" rel="stylesheet">
<link href="../button/button.css" rel="stylesheet">
<link href="icon.css" rel="stylesheet">
<link href="s-icon.css" rel="stylesheet">
<link href="bl-icon.css" rel="stylesheet">
<link href="../_assets/youxiao/demo/demo.css" rel="stylesheet">
<style>
table { width:100%;}
td,
th { padding:5px 10px;vertical-align:middle;}
th { background-color:#eee; }
section{ width:1000px; margin:0 auto;}
textarea{
  width:100%;
  height:100px;
}
#d_clip_button{
  border:1px solid #f70;
  text-align:center;
  height:24px;
  line-height:24px;
  width:100%;
  margin:0 auto 5px;
  background-color:#FF8C3F;
  color:#fff;
}
.k2-icon-node-m,
td span,
td p{
  border:1px solid #f00;
}
aside {
    margin: 10px auto;
    width: 1000px;
}
.k2-btn{
	float:right;
}
</style>
<!--[if IE]>
<script src="../_assets/youxiao/demo/demo.js" charset="utf-8"></script>
<![endif]-->
</head>
<body>
<header>
    <h1>K2-Icon</h1>
</header>
<aside class="k2-fix-float">当同时加载<code>k2/icon/icon.css</code>和其它icon样式表时，必须先引用前者！<a class="k2-btn k2-btn-style-a k2-btn-m" href="http://kxt.koubei.com/ik2/icon/creator.php"><i></i><s>增加新ICON</s><b></b></a></aside>
<section class="icon-list">
<table>
    <thead>
        <tr>
            <th colspan="10">p标签；模式：<code>k2-icon-bg-m</code> <em class="demo-important-info">( 依赖样式表：/k2/icon/icon.css )</em></th>
        </tr>
    </thead>
	<tbody>
<?php
foreach($icons as $key=>$icon){
  if($key % 10 == 0){
	echo "<tr>";
  }
  echo "<td><p class=\"k2-icon-bg-m ".$icon[0]."\">".$icon[3]."</p></td>";
  if(($key+1) % 10 == 0){
	echo "</tr>";
  }
}
?>
    </tbody>
</table>
</section>
<section class="icon-list">
<table>
    <thead>
        <tr>
            <th colspan="10">span标签；模式：<code>k2-icon-bg-m</code> <em class="demo-important-info">( 依赖样式表：/k2/icon/icon.css )</em></th>
        </tr>
    </thead>
	<tbody>
<?php
foreach($icons as $key=>$icon){
  if($key % 10 == 0){
	echo "<tr>";
  }
  echo "<td><span class=\"k2-icon-bg-m ".$icon[0]."\">".$icon[3]."</span></td>";
  if(($key+1) % 10 == 0){
	echo "</tr>";
  }
}
?>
    </tbody>
</table>
</section>
<section class="icon-list">
<table>
    <thead>
        <tr>
            <th colspan="10">span标签；模式：<code>k2-icon-node-m</code> <em class="demo-important-info">( 依赖样式表：/k2/icon/icon.css )</em></th>
        </tr>
    </thead>
	<tbody>
<?php
foreach($icons as $key=>$icon){
  if($key % 10 == 0){
	echo "<tr>";
  }
  echo "<td><span class=\"k2-icon-node-m ".$icon[0]."\">".$icon[3]."</span></td>";
  if(($key+1) % 10 == 0){
	echo "</tr>";
  }
}
?>
    </tbody>
</table>
</section>
<section class="icon-list">
<table>
    <thead>
        <tr>
            <th colspan="10">会员等级；模式：<code>k2-icon-node-m</code> <em class="demo-important-info">( 依赖样式表：/k2/icon/icon.css )</em></th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><a class="k2-icon-node-m k2-icon-vip-1" href="#" title="黄金会员">黄金会员</a></td>
            <td><a class="k2-icon-node-m k2-icon-vip-2" href="#" title="白金会员">白金会员</a></td>
            <td><a class="k2-icon-node-m k2-icon-vip-3" href="#" title="砖石会员">砖石会员</a></td>
            <td><a class="k2-icon-node-m k2-icon-vip-w1" href="#" title="黄金会员">黄金会员</a></td>
            <td><a class="k2-icon-node-m k2-icon-vip-w2" href="#" title="白金会员">白金会员</a></td>
            <td><a class="k2-icon-node-m k2-icon-vip-w3" href="#" title="砖石会员">砖石会员</a></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
        </tr>
    </tbody>
</table>
</section>
<section class="icon-list">
<table>
    <thead>
        <tr>
            <th colspan="5">分享到；模式：<code>k2-icon-node-m</code> <em class="demo-important-info">( 依赖样式表：/k2/icon/bl-icon.css )</em></th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><a class="k2-icon-node-m k2-icon-bl-10001" href="#" title="XXX个卖家信用积分，请点击查看详情">1心</a></td>
            <td><a class="k2-icon-node-m k2-icon-bl-10002" href="#" title="XXX个卖家信用积分，请点击查看详情">2心</a></td>
            <td><a class="k2-icon-node-m k2-icon-bl-10003" href="#" title="XXX个卖家信用积分，请点击查看详情">3心</a></td>
            <td><a class="k2-icon-node-m k2-icon-bl-10004" href="#" title="XXX个卖家信用积分，请点击查看详情">4心</a></td>
            <td><a class="k2-icon-node-m k2-icon-bl-10005" href="#" title="XXX个卖家信用积分，请点击查看详情">5心</a></td>
        </tr>
        <tr>
            <td><a class="k2-icon-node-m k2-icon-bl-20001" href="#" title="XXX个卖家信用积分，请点击查看详情">1钻石</a></td>
            <td><a class="k2-icon-node-m k2-icon-bl-20002" href="#" title="XXX个卖家信用积分，请点击查看详情">2钻石</a></td>
            <td><a class="k2-icon-node-m k2-icon-bl-20003" href="#" title="XXX个卖家信用积分，请点击查看详情">3钻石</a></td>
            <td><a class="k2-icon-node-m k2-icon-bl-20004" href="#" title="XXX个卖家信用积分，请点击查看详情">4钻石</a></td>
            <td><a class="k2-icon-node-m k2-icon-bl-20005" href="#" title="XXX个卖家信用积分，请点击查看详情">5钻石</a></td>
        </tr>
        <tr>
            <td><a class="k2-icon-node-m k2-icon-bl-30001" href="#" title="XXX个卖家信用积分，请点击查看详情">1皇冠</a></td>
            <td><a class="k2-icon-node-m k2-icon-bl-30002" href="#" title="XXX个卖家信用积分，请点击查看详情">2皇冠</a></td>
            <td><a class="k2-icon-node-m k2-icon-bl-30003" href="#" title="XXX个卖家信用积分，请点击查看详情">3皇冠</a></td>
            <td><a class="k2-icon-node-m k2-icon-bl-30004" href="#" title="XXX个卖家信用积分，请点击查看详情">4皇冠</a></td>
            <td><a class="k2-icon-node-m k2-icon-bl-30005" href="#" title="XXX个卖家信用积分，请点击查看详情">5皇冠</a></td>
        </tr>
        <tr>
            <td><a class="k2-icon-node-m k2-icon-bl-40001" href="#" title="XXX个卖家信用积分，请点击查看详情">1金皇冠</a></td>
            <td><a class="k2-icon-node-m k2-icon-bl-40002" href="#" title="XXX个卖家信用积分，请点击查看详情">2金皇冠</a></td>
            <td><a class="k2-icon-node-m k2-icon-bl-40003" href="#" title="XXX个卖家信用积分，请点击查看详情">3金皇冠</a></td>
            <td><a class="k2-icon-node-m k2-icon-bl-40004" href="#" title="XXX个卖家信用积分，请点击查看详情">4金皇冠</a></td>
            <td><a class="k2-icon-node-m k2-icon-bl-40005" href="#" title="XXX个卖家信用积分，请点击查看详情">5金皇冠</a></td>
        </tr>
    </tbody>
</table>
</section>
<section class="icon-list">
<table>
    <thead>
        <tr>
            <th colspan="9">分享到；模式：<code>k2-icon-node-m</code> <em class="demo-important-info">( 依赖样式表：/k2/icon/s-icon.css )</em></th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><a class="k2-icon-node-m k2-icon-s-db" href="#" title="分享到豆瓣">分享到豆瓣</a></td>
            <td><a class="k2-icon-node-m k2-icon-s-mail" href="#" title="通过邮件发送给好友">通过邮件发送给好友</a></td>
            <td><a class="k2-icon-node-m k2-icon-s-kx" href="#" title="分享到开心网">分享到开心网</a></td>
            <td><a class="k2-icon-node-m k2-icon-s-kb" href="#" title="分享到口碑">分享到口碑</a></td>
            <td><a class="k2-icon-node-m k2-icon-s-msn" href="#" title="分享到MSN">分享到MSN</a></td>
            <td><a class="k2-icon-node-m k2-icon-s-qq" href="#" title="分享到QQ">分享到QQ</a></td>
            <td><a class="k2-icon-node-m k2-icon-s-rr" href="#" title="分享到人人网">分享到人人网</a></td>
            <td><a class="k2-icon-node-m k2-icon-s-sina" href="#" title="分享到新浪微博">分享到新浪微博</a></td>
            <td><a class="k2-icon-node-m k2-icon-s-tb" href="#" title="分享到淘宝">分享到淘宝</a></td>
            <td><a class="k2-icon-node-m k2-icon-s-ww" href="#" title="分享到旺旺">分享到旺旺</a></td>
        </tr>
    </tbody>
</table>
<table>
    <thead>
        <tr>
            <th colspan="9">分享到；模式：<code>k2-icon-bg-m</code> <em class="demo-important-info">( 依赖样式表：/k2/icon/s-icon.css )</em></th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><a class="k2-icon-bg-m k2-icon-s-db" href="#">分享到豆瓣</a></td>
            <td><a class="k2-icon-bg-m k2-icon-s-mail" href="#">通过邮件发送给好友</a></td>
            <td><a class="k2-icon-bg-m k2-icon-s-kx" href="#">分享到开心网</a></td>
            <td><a class="k2-icon-bg-m k2-icon-s-kb" href="#">分享到口碑</a></td>
            <td><a class="k2-icon-bg-m k2-icon-s-msn" href="#">分享到MSN</a></td>
            <td><a class="k2-icon-bg-m k2-icon-s-qq" href="#">分享到QQ</a></td>
            <td><a class="k2-icon-bg-m k2-icon-s-rr" href="#">分享到人人网</a></td>
            <td><a class="k2-icon-bg-m k2-icon-s-sina" href="#">分享到新浪微博</a></td>
            <td><a class="k2-icon-bg-m k2-icon-s-tb" href="#">分享到淘宝</a></td>
        </tr>
    </tbody>
</table>
</section>
<section class="icon-list">
<table>
    <thead>
        <tr>
            <th colspan="10">关注；模式：<code>k2-icon-node-m</code></th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><a href="#" class="k2-icon-node-m k2-icon-follow-wide" data='{"userid":"111"}'>关注TA</a></td>
            <td><span class="k2-icon-node-m k2-icon-followed-wide">已关注</span></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
        </tr>
    </tbody>
</table>
</section>
<section class="icon-list">
<table>
    <thead>
        <tr>
            <th colspan="10">列表UL\OL；模式：<code>k2-icon-bg-m</code></th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>
                <ul class="k2-icon-bg-m k2-icon-dot">
                		<li>列表项1</li>
                    <li>列表项2</li>
                    <li>列表项3</li>
                    <li>...</li>
                </ul>
            </td>
            <td>
                <ul class="k2-icon-bg-m k2-icon-square">
                		<li>列表项1</li>
                    <li>列表项2</li>
                    <li>列表项3</li>
                    <li>...</li>
                </ul>
            </td>
            <td>
                <ul class="k2-icon-bg-m k2-icon-square-ccc">
                		<li>列表项1</li>
                    <li>列表项2</li>
                    <li>列表项3</li>
                    <li>...</li>
                </ul>
            </td>
        </tr>
    </tbody>
</table>
</section>
<section>
    <div id="d_clip_button" class="my_clip_button">复制到剪贴板</div>
		<div><textarea id='result'></textarea></div>
    <!--
    <div id="d_clip_button_position" class="my_clip_button"><a href="">粘帖到剪贴板</a></div>
		<div><textarea id='position-result'></textarea></div>
    -->
    <input id='copy-to-result' type="hidden" value="" />
</section>
<footer>
    <p>Copyright (c)2011 koubei.com All rights reserved.</p>
    <p>author: <a href="mailto:youxiao@taobao.com">youxiao</a></p>
</footer>
<script src="../seed/seed.js"></script>
<script src="ZeroClipboard.js"></script>
<script>
YUI().use('cookie','event',function(Y){
		var clip = null;
		Y.all(".icon-list").on('click',function(e){
			var target = e.target,
					name = target.get("nodeName").toLowerCase(),
					className = target.get("className");
			if(className.match(/k2-icon/)){
				if(className === "k2-icon-node-m k2-icon-follow-wide"){
						$('result').value='<a href="#" class="k2-icon-node-m k2-icon-follow-wide" data=\'{"userid":"111"}\'>关注TA</a>';
				}else if(/k2\-icon\-vip|k2\-icon\-s|k2\-icon\-bl/.test(className)){
						var title = target.get("title");
						if(title){
								title = " title=\""+target.get("title")+"\"";
						}
						$('result').value='<a href="#" class="'+className+'"'+title+'>'+target.get("text")+'</a>';
				}else{
						$('result').value='<'+name+' class="'+className+'"'+'>'+target.get("text")+'</'+name+'>';
				}
			}else if(target.get("parentNode").get("className").match(/k2-icon/)){
				$('result').value=target.get("parentNode").get("parentNode").get("innerHTML");
			}						   	
		});
		function $(id) { return document.getElementById(id); }
		function init() {
			clip = new ZeroClipboard.Client();
			clip.setHandCursor( true );
			clip.addEventListener('load', my_load);
			clip.addEventListener('mouseOver', my_mouse_over);
			clip.addEventListener('complete', my_complete);
			clip.glue( 'd_clip_button' );
		}
		function my_load(client) {
			debugstr("Flash movie loaded and ready.");
		}
		function my_mouse_over(client) {
			// we can cheat a little here -- update the text on mouse over
			clip.setText($('result').value);
		}
		function my_complete(client, text) {
			alert('复制成功');
		}
		function debugstr(msg) {
			//var p = document.createElement('p');
			//p.innerHTML = msg;
			//$('d_debug').appendChild(p);
		}

		Y.one(window).on('load',function(){
			 init();
		})
});
</script>
</body>
</html>
