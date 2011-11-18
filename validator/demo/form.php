<?php require('functions.php');
/**
 * Custom rule test demo
 *
 * @creator lingyou
 * @since k2-validator-1-3-6.js
 */

get_header('自定义校验'); ?>

<h2>说明</h2>
<p>表单样式测试</p>

<h2>演示</h2>
<form id="account-form" method="post" action="../demo/action.php">
  <div class="k2-v-wrapper">
    <div class="k2-v-content">
      <label>支付宝账户：</label><input name="o-account" id="o-account" class="k2-v-text k2-placeholder" placeholder="支付宝账户">
    </div>
    <div class="k2-v-holder"></div>
  </div>
    
  <div class="k2-v-op">
    <button id="popup-ok" class="k2-btn k2-btn-style-a k2-btn-m"><i></i><s>确定</s><b></b></button>
    <button id="popup-cancel" class="k2-btn k2-btn-style-c k2-btn-m"><i></i><s>取消</s><b></b></button>
  </div>
</form>

<?php get_script(); ?>

<script>
YUI().use('k2-validator', 'k2-validator-default', function(Y){

new Y.Validator({
    'id' : 'test-form',
    'rules' : {
        'o-username' : {
            'required' : {
                'value' : true,
                'message' : '必须告诉我你的名字'
            }
        },
        
        'o-mobile' : {
            'required' : {
                'value' : true,
                'message' : '必须告诉我你的手机'
            }
        },
        
        'o-email' : {
            'required' : {
                'value' : true,
                'message' : '必须告诉我你的电子邮箱'
            }
        }
        
        
        
    } // end of rules
}); // end of new Y.Validator

});
</script>

<?php get_footer(); ?>
