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
    <label>姓名：</label><input name="input1" id="o-username">
  </span>
  <span class="k2-v-holder"></span>
</div>

<div class="k2-v-wrapper">
  <span class="k2-v-content">
    <label>手机号码：</label><input name="o-mobile" id="o-mobile">
  </span>
  <span class="k2-v-holder"></span>
</div>

<div class="k2-v-wrapper">
  <span class="k2-v-content">
    <label>电话号码：</label><input name="o-phone" id="o-phone">
  </span>
  <span class="k2-v-holder"></span>
</div>

<div>
<input type="submit" value="保存">
<a href="#" id="link-submit">链接提交</a>
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
        'scrollToTop' : false,
        'rules' : {
            'o-username' : {
                'required' : {
                    'value' : true,
                    'message' : '姓名不能为空'
                },
                'maxlength' : {
                    'value' : 10,
                    'message' : '最多只能包含10个字符'
                },
                'minlength' : {
                    'value' : 3,
                    'message' : '最少3个个字符'
                },
                'custom' : {
                    'value' : function(a) {
                        return a === '33333';
                    },
                    'message' : '自定义校验失败'
                }
            },
            'o-mobile' : {
                'cnmobile' :  {
                    'value' : true,
                    'message' : '手机号码格式不正确'
                },
                'brother' :  {
                    'value' : 'o-phone',
                    'message' : '至少'
                }
            },
            
            'o-phone' : {
                'cnphone' :  {
                    'value' : true,
                    'message' : '电话号码格式不正确'
                },
                'brother' :  {
                    'value' : 'o-mobile',
                    'message' : '至少'
                }
            }
            
            
            
            
        } // end of rules
    }); // end of new Y.Validator




});
</script>

</body>
</html>
