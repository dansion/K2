<?php

function get_header($title = '') {
    header("Expires: Thu, 01 Jan 1970 00:00:01 GMT");
    header("Last-Modified: " . gmdate("D, d M Y H:i:s") . " GMT");
    header("Cache-Control: no-store, no-cache, must-revalidate");
    header("Cache-Control: post-check=0, pre-check=0", false);
    header("Pragma: no-cache");
    header("Content-Type:text/html;charset=utf-8");
    
    $top = ('index.php' !== end(explode("/", $_SERVER['PHP_SELF']))) ? '<p class="top"><a href="index.php">返回&gt;&gt;</a></p>' : '';
    
    
    echo <<< EOT
<!doctype html>
<head>
<meta charset="utf-8">
<meta http-equiv="x-ua-compatible" content="ie=edge">
<title>K2 Validator {$title}</title>
<link rel="stylesheet" href="../../css/reset.css">
<style>
body {text-align:left;padding:1em 2em;}
h1 {font-size:24px;}
h2 {padding:1em 0 0 0;color:green;}
ol {margin:0 0 10px 2em;}
ol li {list-style:decimal;line-height:1.8;}
th, td {border:1px solid #ddd;padding:2px 5px;font-size:12px;}
th {font-weight:bold;background:#eee;}
</style>
</head>
<body>
{$top}
<h1>K2 Validator {$title}</h1>
EOT;
}

function get_script() {
    echo <<< EOT
<script>
var K2_config = {
    noCombine : true,
    noCache : true,
    console : true,
    noVersion : true,
    syntaxHighlight : true,
    local : true 
}
</script>
<script src="../../seed/seed.js"></script>
<script src="../../_assets/config.js"></script>
EOT;
}

function get_footer() {
    echo <<< EOT
</body>
</html>
EOT;
}

function get_fields() {
    $args = func_get_args();
    $num = func_num_args();
    $definedFunctions = get_defined_functions();
    
    echo '<form id="test-form" method="post" action="../demo/action.php">';
    
    if ( $num === 0 ) {
        get_field_username();
        get_field_mobile();
        get_field_tel();
        get_field_email();
        get_field_review();
        get_field_postcode();
        get_field_floor();
        get_field_price();
        get_field_date();
        get_field_unit();
    }
    else {
        foreach ( $args as $key => $value ) {
            $func = 'get_field_' . $value;
            if( in_array($func, $definedFunctions['user']) ) $func();
        }
    }
    
    get_field_submit();
    
    echo '</form>';
}

function get_field_username() {
    echo <<< EOT
<div class="k2-v-wrapper">
  <span class="k2-v-content">
    <label>姓名：</label><input name="o-username" id="o-username" class="k2-v-text k2-placeholder" placeholder="2-4个字符">
  </span>
  <span class="k2-v-holder"></span>
</div>
EOT;
}

function get_field_mobile() {
    echo <<< EOT
<div class="k2-v-wrapper">
  <span class="k2-v-content">
    <label>手机：</label><input name="o-mobile" id="o-mobile" class="k2-v-text k2-placeholder" placeholder="例如：13012345678">
  </span>
  <span class="k2-v-holder"></span>
</div>
EOT;
}

function get_field_email() {
    echo <<< EOT
<div class="k2-v-wrapper">
  <span class="k2-v-content">
    <label>电子邮箱：</label><input name="o-email" id="o-email" class="k2-v-text k2-placeholder" placeholder="例如：test@abc.com">
  </span>
  <span class="k2-v-holder"></span>
</div>
EOT;
}

function get_field_review() {
    echo <<< EOT
<div class="k2-v-wrapper">
  <span class="k2-v-content">
    <label>点评：</label><textarea name="o-review" id="o-review" class="k2-v-textarea k2-placeholder" placeholder="在这里输入点评内容"></textarea>
  </span>
  <span class="k2-v-holder"></span>
</div>
EOT;
}

function get_field_postcode() {
    echo <<< EOT
<div class="k2-v-wrapper">
  <span class="k2-v-content">
    <label>邮政编码：</label><input name="o-postcode" id="o-postcode" class="k2-v-text k2-placeholder" placeholder="例如：310000">
  </span>
  <span class="k2-v-holder"></span>
</div>
EOT;
}

function get_field_floor() {
    echo <<< EOT
<div class="k2-v-wrapper">
  <span class="k2-v-content">
    <label>楼层：</label><input name="o-floor" id="o-floor" class="k2-v-text k2-placeholder" placeholder="楼层必须为大于0的整数">
  </span>
  <span class="k2-v-holder"></span>
</div>
EOT;
}

function get_field_price() {
    echo <<< EOT
<div class="k2-v-wrapper">
  <span class="k2-v-content">
    <label>价格：</label><input name="o-price" id="o-price" class="k2-v-text k2-placeholder" placeholder="请输入价格">
  </span>
  <span class="k2-v-holder"></span>
</div>
EOT;
}

function get_field_tel() {
    echo <<< EOT
<div class="k2-v-wrapper">
  <span class="k2-v-content">
    <label>电话：</label><input name="o-tel" id="o-tel" class="k2-v-text k2-placeholder" placeholder="请输入电话">
  </span>
  <span class="k2-v-holder"></span>
</div>
EOT;
}

function get_field_password() {
    echo <<< EOT
<div class="k2-v-wrapper">
  <span class="k2-v-content">
    <label>输入密码：</label><input type="password" name="o-password" id="o-password" class="k2-v-text">
  </span>
  <span class="k2-v-holder"></span>
</div>
EOT;
}

function get_field_repeat() {
    echo <<< EOT
<div class="k2-v-wrapper">
  <span class="k2-v-content">
    <label>重复密码：</label><input type="password" name="o-repeat" id="o-repeat" class="k2-v-text">
  </span>
  <span class="k2-v-holder"></span>
</div>
EOT;
}

function get_field_date() {
    echo <<< EOT
<div class="k2-v-wrapper">
  <span class="k2-v-content">
    <label>日期：</label><input name="o-date" id="o-date" class="k2-v-text k2-placeholder" placeholder="请输入日期">
  </span>
  <span class="k2-v-holder"></span>
</div>
EOT;
}

function get_field_image() {
    echo <<< EOT
<div class="k2-v-wrapper">
  <span class="k2-v-content">
    <label>图片：</label><div id="o-image"></div>
  </span>
  <span class="k2-v-holder"></span>
</div>
EOT;
}

function get_field_birthday() {
    echo <<< EOT
<div class="k2-v-wrapper">
  <span class="k2-v-content">
    <label>生日：</label><input type="text" class="k2-v-text" id="o-birthday" value="">
  </span>
  <span class="k2-v-holder"></span>
</div>
EOT;
}

function get_field_unit() {
    echo <<< EOT
<div class="k2-v-wrapper">
  <span class="k2-v-content">
    <label>单位：</label>
    <select name="o-unit" id="o-unit" class="k2-v-select">
      <option value="101001">元/月</option>
      <option value="101002">元/平方*天</option>
      <option value="101003">元/天</option>
      <option value="101004">元/周</option>
      <option value="101005">元/季度</option>
      <option value="101006">元/半年</option>
      <option value="101007">元/年</option>
      <option value="101008">元/平方*月</option>
    </select>
  </span>
  <span class="k2-v-holder"></span>
</div>
EOT;
}

function get_field_submit() {
    echo <<< EOT
<div class="k2-v-op">
  <button id="submit-button" type="submit">提交</button>
</div>
EOT;
}

?>
