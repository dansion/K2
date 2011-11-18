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
    <label>姓：</label><input name="o-lastname1" id="o-lastname">
  </span>

  <span class="k2-v-holder"></span>
</div>

<div class="k2-v-wrapper">
  <span class="k2-v-content">
    <label>手机号码：</label><input name="o-mobile1" id="o-mobile">
  </span>
  <span class="k2-v-holder"></span>
</div>

<div id="test-wrapper" class="k2-v-wrapper">

</div>

<div>
<button id="generate">生成内容</button>
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
            requires : ['base-base']
        }

    }
}).use('k2-validator', 'test', 'dump', 'node', function(Y){


    Y.one('#generate').on('click', function(event) {
        event.preventDefault();
        Y.one('#test-wrapper').setContent('  <span class="k2-v-content">    <label>测试：</label><input name="o-test" id="o-test">  </span>  <span class="k2-v-holder"></span>');
        
        yy.addRules({
              'o-test' : {
                    'required' : {
                        'value' : true,
                        'message' : '地不能为空'
                    },
                    'minlength' : {
                        'value' : 3,
                        'message' : '最少3个字符'
                    }
                }
        }, true);
    });
    // Y.Event.purgeElement("#test-form");
    
    // 

    var yy = new Y.Validator({
        'id' : 'test-form',
        'validateOnBlur' : true,
        'rules' : {
            'o-lastname' : {
                'required' : {
                    'value' : true,
                    'message' : '姓不能为空'
                },
                'minlength' : {
                    'value' : 3,
                    'message' : '最少3个字符'
                }
            }
            
        } // end of rules
    }); // end of new Y.Validator
    
        yy.addRules({
            'o-mobile' : {
                'required' : {
                    'value' : true,
                    'message' : '姓不能为空'
                },
                'cnmobile' : {
                    'value' : true,
                    'message' : '手机号码格式不正确'
                }
            }
        }, false);
    
   

});
</script>

</body>
</html>
