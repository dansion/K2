<?php require('functions.php');
/**
 * validator for k2-placeholder
 *
 * @creator lingyou
 * @since k2-validator-1-3-6.js
 */

get_header('和k2-placeholder的搭配使用'); ?>

<h2>说明</h2>
<p>k2-placeholder是正乐写的一个组件，用于显示文本框为空时的提示文字，通过改写get('value')的方式实现。k2-validator和k2-placeholder可以和平共处。</p>

<h2>第一步、增加class和placeholder属性</h2>
<pre class="brush:xml;">
&lt;div class="k2-v-wrapper"&gt;
  &lt;span class="k2-v-content"&gt;
    &lt;label&gt;姓名：&lt;/label&gt;&lt;input name="o-username" id="o-username" class="k2-v-text k2-placeholder" placeholder="请输入姓名"&gt;
  &lt;/span&gt;

  &lt;span class="k2-v-holder"&gt;&lt;/span&gt;
&lt;/div&gt;
</pre>

<h2>第二步、直接引入k2-validator和k2-placeholder。</h2>
<pre class="brush:javascript;">
YUI().use('k2-validator', 'k2-validator-default', 'k2-placeholder', function(Y){

    Y.k2placeholder.init(); 

    new Y.Validator({
        'id' : 'test-form',
        'rules' : {}
    });

});
</pre>

<h2>演示</h2>
<?php get_fields('username', 'review'); ?>
<?php get_script(); ?>

<script>
YUI().use('k2-validator', 'k2-validator-default', 'k2-placeholder', function(Y){

Y.k2placeholder.init(); 

new Y.Validator({
    'id' : 'test-form',
    'rules' : {
        'o-username' : {

            'required' : {
                'value' : true,
                'message' : '还没有填写姓名呢'
            },
            'minlength' : {
                'value' : 2,
                'message' : '姓名最少两个字符'
            },
            'maxlength' : {
                'value' : 4,
                'message' : '姓名最大4个字符'
            }
        },
        
        'o-review' : {
            'required' : {
                'value' : true,
                'message' : '点评内容不能为空'
            },
            'minlength' : {
                'value' : 8,
                'message' : '点评最少要8个字'
            }
        }
        
    } // end of rules
}); // end of new Y.Validator

});
</script>

<?php get_footer(); ?>
