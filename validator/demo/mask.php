<?php require('functions.php');
/**
 * mask rule test demo
 *
 * @creator lingyou
 * @since k2-validator-1-3-6.js
 */

get_header('正则校验'); ?>

<h2>说明</h2>
<p>对于格式化的数据，如果现有的校验没有提供，可以使用mask规则来实现，我也定期会将大家的mask规则吸纳到k2 validator中。</p>

<h2>规则定义方式</h2>
<pre class="brush:javascript;">
'o-postcode' : {
    'mask' :  {
        'value' : /^\d{6}$/,
        'message' : '不要蒙我，邮政编码是6位数字'
    }
}
</pre>

<h2>已经提炼成独立规则的mask校验</h2>
<table>
  <tr><th>规则</th><th>正则表达式</th></tr>
  <tr><td>email</td><td>/^\s*([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+\s*$/</td></tr>
  <tr><td>cnphone</td><td>/^\s*(\d{3,4}-?)\d{7,8}(-\d{1,6})?\s*$/</td></tr>
  <tr><td>cnmobile</td><td>/^\s*1\d{10}\s*$/</td></tr>
  <tr><td>date</td><td>/^[0-9]{3,4}\-[0-9]{1,2}\-[0-9]{1,2}$/</td></tr>
</table>

<h2>注意事项</h2>
<ol>
  <li>之前有个bug，如果不添加require规则，custom会失效，已经修复。</li>
</ol>

<h2>演示</h2>
<?php get_fields('username', 'postcode'); ?>
<?php get_script(); ?>

<script>
YUI().use('k2-validator', 'k2-validator-default', function(Y){

new Y.Validator({
    'id' : 'test-form',
    'rules' : {
        'o-username' : {
            'required' : {
                'value' : true,
                'message' : '老师，这里有人不告诉我名字！'
            },
            'mask' :  {
                'value' : /^dasuan$/,
                'message' : '经过鉴定，你不是dausan'
            }
        },
        
        'o-postcode' : {
            'mask' :  {
                'value' : /^\d{6}$/,
                'message' : '不要蒙我，邮政编码是6位数字'
            }
        }
        
        
        
    } // end of rules
}); // end of new Y.Validator

});
</script>

<?php get_footer(); ?>
