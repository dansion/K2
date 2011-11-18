<?php require_once("../../_assets/demo.php"); ?>
<html>
<head>
<?php echo_html_charset() ?>
<title>K2 Validator</title>
<?php echo_default_css() ?>

<link rel="stylesheet" href="/k2/form/default.css">
</head>
<body>

<form id="test-form" method="post">

<div class="k2-v-wrapper">
  <span class="k2-v-content">
    <label>性别：</label><input name="o-sex" type="radio" id="o-sex1">男&nbsp;&nbsp;&nbsp;<input name="o-sex" type="radio" id="o-sex2">女&nbsp;&nbsp;&nbsp;<input name="o-sex" type="radio" id="o-sex3">未知
  </span>
  <span class="k2-v-holder"></span>
</div>

<div class="k2-v-wrapper">
  <span class="k2-v-content">
    <label>手机号码：</label><input name="o-mobile1" id="o-mobile">
  </span>
  <span class="k2-v-holder"></span>
</div>

<div>
<input type="submit" value="保存">
</div>

</form>


<script>
var K2_config = {
    noCombine : true,
    noCache : true,
    console : true,
    noVersion : true,
    syntaxHighlight : false,
    local : true 
}
</script>

<?php echo_default_js(''); ?>

<script>
YUI({
    modules : {
        'k2-validator' : {
            fullpath : '../validator.js',
            requires : ['base']
        }

    }
}).use('k2-validator', 'test', 'dump', 'node', function(Y){

    // Y.Event.purgeElement("#test-form");
    
    // 

    var yy = new Y.Validator({
        'id' : 'test-form',
        'validateOnBlur' : true,
        'rules' : {
            'o-sex1' : {
                'checked' : {
                    'value' : true,
                    'message' : '必须选择性别'
                }
            },
            
            'o-sex2' : {
                'checked' : {
                    'value' : true,
                    'message' : '必须选择性别'
                }
            },
            
            'o-sex3' : {
                'checked' : {
                    'value' : true,
                    'message' : '必须选择性别'
                }
            },
                  
            'o-mobile' : {
                'required' : {
                    'value' : true,
                    'message' : '手机号码不能为空'
                },
                'cnmobile' : {
                    'value' : true,
                    'message' : '手机号码格式不正确'
                }
            }
            
            
        } // end of rules
    }); // end of new Y.Validator


});
</script>

</body>
</html>
