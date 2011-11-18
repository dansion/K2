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
</div>

<div class="k2-v-wrapper">
  <span class="k2-v-content">
    <label>手机号码：</label><input name="o-mobile" id="o-mobile">
  </span>
  <span class="k2-v-holder"></span>
</div>

<div class="k2-v-wrapper">
  <span class="k2-v-content">
    <label>性别：</label>
    <label for="o-sex1">男1</label><input id="o-sex1" type="radio" value="1" name="sex">
   
    <label for="o-sex2">女2</label><input id="o-sex2" type="radio" value="2" name="sex">
     <!--
     
    <label for="o-sex3">女3</label><input id="o-sex3" name="o-sex1" type="radio" value="2">
    <label for="o-sex4">女4</label><input id="o-sex4" name="o-sex" type="radio" value="2">
    -->
  </span>
  <span class="k2-v-holder"></span>
</div>

<div class="k2-v-wrapper">
  <span class="k2-v-content">
    <label>电子邮箱：</label><input name="o-email" id="o-email">
  </span>
  <span class="k2-v-holder"></span>
</div>

<div class="k2-v-wrapper">
  <span class="k2-v-content">
    <label>地址：</label><input id="o-address" type="text" name="input2">
  </span>
  <span class="k2-v-holder"></span>
</div>

<div class="k2-v-wrapper">
  <span class="k2-v-content">
    <label>备注：</label><textarea id="o-remark" name="beizhu"></textarea>
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
            requires : ['base-base', 'node-base']
        }

    }
}).use('k2-validator', function(Y){

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
            
            'o-sex1' : {
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
                'cnmobile' :  {
                    'value' : true,
                    'message' : '手机号码格式不正确'
                }
            },
            'o-email' : {
                'required' : {
                    'value' : true,
                    'message' : '电子邮箱不能为空',
                    'enabled' : false
                },
                'email' :  {
                    'value' : true,
                    'message' : '电子邮箱格式不正确'
                }
            },
            /*
            'o-address' : {
                'required' : {
                    'value' : true,
                    'message' : '地不能为空'
                },
                'maxlength' : {
                    'value' : 20,
                    'message' : '地址最多只能包含20个字符'
                }
            },
            */
            'o-remark' : {

                'maxlength' : {
                    'value' : 20,
                    'message' : 'remark只能包含20个字符'
                }
            }
        } // end of rules
    }); // end of new Y.Validator
    
    yy.showErrors({
      'o-email' : 'ffffffffffff'
    });
    
    yy.addRules({
          'o-address' : {
                'required' : {
                    'value' : true,
                    'message' : '地不能为空'
                },
                'maxlength' : {
                    'value' : 20,
                    'message' : '地址最多只能包含20个字符'
                }
            }
    });
    
    yy.addRules({
          'o-address' : {
                'required' : {
                    'value' : true,
                    'message' : '地不能为空'
                },
                'maxlength' : {
                    'value' : 20,
                    'message' : '地址最多只能包含20个字符'
                }
            }
    });
    
    yy.disable('o-address');
    
    Y.one('#link-submit').on('click', function(event) {
        event.preventDefault();
        if(yy.validate()) {
            alert('succeed');
        }
        else {
            alert('failed');
        }
    });

});
</script>

</body>
</html>
