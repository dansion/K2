<?php require('functions.php');
/**
 * Custom rule test demo
 *
 * @creator lingyou
 * @since k2-validator-1-3-6.js
 */

get_header('上传'); ?>

<h2>说明</h2>
<ol>
  <li>有这样一个错误容器，不管什么错误都显示到这里面。</li>
</ol>

<h2>演示</h2>
<div id="k2-v-unified"></div>
<?php get_fields('username', 'image'); ?>
<?php get_script(); ?>

<script>
YUI().use('k2-validator', 'k2-validator-default', 'k2-uploader-ui', function(Y){

    new Y.UploaderUI({
      'container' : '#o-image'
    });

    new Y.Validator({
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
            }
           
            
            
        } // end of rules
    });

});
</script>

<?php get_footer(); ?>
