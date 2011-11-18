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
    <label>姓：</label><input name="o-lastname1" id="o-lastname"><label>名：</label><input name="o-firstname1" id="o-firstname" value="asdfsdf">
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
            'o-lastname' : {
                'required' : {
                    'value' : true,
                    'message' : '姓不能为空'
                },
                'minlength' : {
                    'value' : 3,
                    'message' : '最少3个字符'
                }
            },
            
            'o-firstname' : {
                'required' : {
                    'value' : true,
                    'message' : '名不能为空'
                },
                'minlength' : {
                    'value' : 5,
                    'message' : '最少5个个字符'
                }
            },
                  
            'o-mobile' : {

                'cnmobile' : {
                    'value' : true,
                    'message' : '手机号码格式不正确'
                }
            }
            
            
        } // end of rules
    }); // end of new Y.Validator
    /*
    yy.showErrors({
      'o-mobile' : 'ffffffffffff'
    });
    */
    /*
    yy.disable('o-address');
    
    Y.get('#link-submit').on('click', function(event) {
        event.preventDefault();
        if(yy.validate()) {
            alert('succeed');
        }
        else {
            alert('failed');
        }
    });
    */

});
</script>

</body>
</html>
