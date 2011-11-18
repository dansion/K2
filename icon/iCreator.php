<?php
	shell_exec("svn update");
?>
<!doctype html>
<html>
<head>
<meta charset="utf-8">
<title>k2 icon creator</title>
<meta http-equiv="X-UA-Compatible" content="IE=Edge">
<link href="../css/reset.css" rel="stylesheet">
<link href="../demo/demo.css" rel="stylesheet">
<style>
input{
	font-size:25px;
	vertical-align:middle;
}
form,
aside,
footer{
	width:950px;
	text-align:left;
	margin:0 auto;
}
label{
	display:inline-block;
	width:100px;
	font-size:25px;
	font-family:georgia;
	color:#ccc;
	vertical-align:middle;
}
form{
	margin:20px auto;
}
input[type="submit"]{
	margin-left:100px;
	padding:0 20px;
}
div{
	margin-bottom:10px;
}
aside:before{
	display:none;
}
section{
	margin:10px auto;
}
</style>
</head>
<body>
<header>
    <h1>K2-Icon Creator</h1>
</header>
<aside>
	<p>Image(图片)命名规则：<em>k2-icon-XXX.xxx</em>，例：k2-icon-mail.png、k2-icon-phone.png; Title(标题)命名，例：k2-icon-mail 电子邮件、k2-icon-mphone 手机。</p>
</aside>
<?php
$messgae = "";
function createIcon(){
	global $messgae;
	$path = "";
	$header = $path."data-header.data";
	$footer = $path."data-footer.data";
	$css = $path."icon.css";
	$data = $path."icons.data";
	$file = $_FILES['icon-file'];
	$title = $_POST['icon-title'];
	if(is_uploaded_file($file['tmp_name'])){
		$type = $file['type'];
		if($type != "image/png" && $type != "image/gif"){
			$messgae = "<aside class='demo-option-info'><p class='demo-error-info'>\"$type\" is not a valid image type！</p></aside>";
			return;
		}else if($file['size'] > 3072){
			$messgae = "<aside class='demo-option-info'><p class='demo-error-info'>Image size is out of 30KB！</p></aside>";
			return;
		}else{
			$fileName = $file['name'];
			$className = eregi_replace("\.png|\.gif","",$fileName);

			$size = getimagesize($file['tmp_name']);
			$width = $size[0];
			$height = $size[1];
			if(move_uploaded_file($file['tmp_name'],$path.$fileName)){
				$file_handle = fopen($data,"r");
				while(!feof($file_handle)){
					$rule = explode(",",fgets($file_handle));
					if($rule[0] == $className){
						$messgae = "<aside class='demo-option-info'><p class='demo-error-info'>This icon is exist！</p></aside>";
						return;
					}else if($rule[0]!=""){
						$rules[] = array($rule[0],$rule[1],$rule[2],$rule[3]);
					}
				}
				fclose($file_handle);
				$newData = $className.','.$width.','.$height.','.$title."\r\n";
				$rules[]=array($className,$width,$height,$title);

				$file_data = fopen($data,"at");
				fwrite($file_data,$newData);
				fclose($file_data);

				$file_css = fopen($css,"w");
				fwrite($file_css,file_get_contents($header));
				for($i=0,$j=sizeof($rules);$i<$j;$i++){
					$className = $rules[$i][0];
					$width = $rules[$i][1];
					$height = $rules[$i][2];
					$title = $rules[$i][3];
					if($width == 16){
						$widthRule = "";
					}else{
						$widthRule = "	width:".$width."px;\r\n	padding-left:".($width+5)."px;\r\n";
					}
					if($height <= 16){
						$heightRule = "";
					}else{
						$heightRule = "	height:".$height."px;\r\n";
					}
					$newRule = ".".$className."{\r\n".$widthRule.$heightRule."	background-image:url($className.png?du);\r\n}\r\n";
					fwrite($file_css,$newRule);
				}
				fwrite($file_css,file_get_contents($footer));
				fclose($file_css);
				//shell_exec("svn add {$path}{$fileName}");
				//shell_exec("svn ci {$path}{$fileName} -m \"add icon file {$path}{$fileName}\"");
				//shell_exec("svn ci icons.data -m \"add icon file {$path}{$fileName}\"");
				//shell_exec("svn ci icon.css -m \"add icon file {$path}{$fileName}\"");
				//shell_exec("wget \"http://kxt.koubei.com/update_rpc.php\" -O /dev/null");
				$messgae = "<aside class='demo-option-info'><p class='demo-success-info'>Create icon success！<a href='icon.php'>K2 icon demo</a></p></aside>";
				return;
			}else{
				$messgae = "<aside class='demo-option-info'><p class='demo-error-info'>Upload image failed！</p></aside>";
				return;
			}
		}
	}
}
createIcon();
if($messgae != "") {
	echo $messgae;
}
?>
<section>
<form action="" method="post" enctype="multipart/form-data">
	<div><label>Image：</label><input type="file" name="icon-file" id="file"></div>
	<div><label>Title：</label><input type="text" name="icon-title" id="title"></div>
	<div><input disabled="disabled" id="btn" type="submit" value="提交"></div>
</form>
</section>
<footer>
    <p>Copyright (c)2011 koubei.com All rights reserved. author: <a href="mailto:youxiao@taobao.com">youxiao</a></p>
</footer>
<script>
var file = document.getElementById("file"),
		title = document.getElementById("title"),
		btn = document.getElementById("btn");
file.onchange = function(){
	if(file.value && title.value){
		btn.disabled = false;
	}
}
title.onkeyup = function(){
	if(file.value && title.value){
		btn.disabled = false;
	}
}
</script>
</body>
</html>
