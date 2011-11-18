<?php require('functions.php');
/**
 * Custom rule test demo
 *
 * @creator lingyou
 * @since k2-validator-1-3-6.js
 */

get_header('自定义事件'); ?>

<h2>说明</h2>
<ol>
  <li>自定义事件测试</li>
</ol>

<h2>演示</h2>
<div id="only-error"></div>
<?php get_fields('username', 'mobile', 'email'); ?>
<?php get_script(); ?>

<script>
YUI().use('k2-validator', 'k2-validator-default', 'event-custom', function(Y){

    var validator = new Y.Validator({
        'id' : 'test-form',
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
            
            'o-mobile' : {
                'required' : {
                    'value' : true,
                    'message' : '必须告诉我你的手机'
                },
                'cnmobile' : {
                    'value' : true,
                    'message' : '手机格式不正确'
                }
            },
            
            'o-email' : {
                'required' : {
                    'value' : true,
                    'message' : '必须告诉我你的电子邮箱'
                },
                
                'email' : {
                    'value' : true,
                    'message' : '电子邮箱格式不正确'
                }
            }
           
            
            
        } // end of rules
    });
    
    validator.on('field-failed', function(d){
        alert('d');
    });

});
</script>

<?php get_footer(); ?>
