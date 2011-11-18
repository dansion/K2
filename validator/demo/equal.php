<?php require('functions.php');
/**
 * Custom rule test demo
 *
 * @creator lingyou
 * @since k2-validator-1-3-6.js
 */

get_header('两个密码值一样的校验'); ?>

<h2>说明</h2>
<ol>
  <li>两个密码值一样的校验</li>
</ol>

<h2>演示</h2>
<?php get_fields('username', 'password', 'repeat'); ?>
<?php get_script(); ?>

<script>
YUI().use('k2-validator', 'k2-validator-default', function(Y){

    var validator = new Y.Validator({
        'id' : 'test-form',
        'validateOnBlur' : false,
        'rules' : {
            'o-username' : {
                'required' : {
                    'value' : true,
                    'message' : '必须告诉我你的名字'
                },
                'minlength' : {
                    'value' : 5,
                    'message' : '名字最少5个字'
                }
            },
            
            'o-password' : {
                'required' : {
                    'value' : true,
                    'message' : '请输入密码'
                },
                'equal' : {
                    'value' : '#o-repeat',
                    'message' : '两次输入的密码不一致'
                }
            },
            
            'o-repeat' : {
                'required' : {
                    'value' : true,
                    'message' : '请再次输入密码'
                },
                'equal' : {
                    'value' : '#o-password',
                    'message' : '两次输入的密码不一致'
                }
            }
           
            
            
        } // end of rules
    });


});
</script>

<?php get_footer(); ?>
