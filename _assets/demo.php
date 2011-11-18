<?php
//demo页面的配置
//define('CHARSET','gbk'); //默认utf-8，即不定义常量CHARSET时，页面编码为utf-8
define('N',"\n"); //new line

function get_charset(){
  if(defined('CHARSET')){
    $charset = CHARSET;  
  }else{
    $charset = 'utf-8';  
  }
  return $charset;
}

function echo_html_charset(){
  echo '<meta charset="'.get_charset().'">'.N;  
}

function echo_default_css(){
  echo '<meta http-equiv="X-UA-Compatible" content="IE=Edge">'.N.
       '<link rel="stylesheet" charset="utf-8" href="../../css/reset.css">'.N.
       '<link rel="stylesheet" charset="utf-8" href="../../_assets/demo.css">'.N;
}

function echo_default_js($app_config){
  echo '<script charset="utf-8" src="../../seed/seed.js"></script>'.N.
       $app_config.N. 
       '<script charset="utf-8" src="../../_assets/config.js"></script>'.N;
  
}
//header
header("Expires: Thu, 01 Jan 1970 00:00:01 GMT");
header("Cache-Control: no-cache, must-revalidate");
header("Pragma: no-cache");
header("Content-Type:text/html;charset=".get_charset());
?>
<!doctype html>
