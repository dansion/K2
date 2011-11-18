<?php require('functions.php');
/**
 * validate select element
 *
 * @creator lingyou
 * @since k2-validator-1-3-6.js
 */

get_header('针对select的校验'); ?>

<h2>说明</h2>
<p>对于select，主要的需求是自定义校验，就是对内容进行校验。校验函数唯一的参数，对应于当前选中项的value。</p>

<h2>第一步、添加一个描述付款单位的下拉列表</h2>
<pre class="brush:xml;">
&lt;div class="k2-v-wrapper"&gt;
  &lt;span class="k2-v-content"&gt;
    &lt;label&gt;单位：&lt;/label&gt;
    &lt;select name="o-unit" id="o-unit" class="k2-v-select"&gt;
      &lt;option value="101001"&gt;元/月&lt;/option&gt;
      &lt;option value="101002"&gt;元/平方*天&lt;/option&gt;
      &lt;option value="101003"&gt;元/天&lt;/option&gt;
      &lt;option value="101004"&gt;元/周&lt;/option&gt;
      &lt;option value="101005"&gt;元/季度&lt;/option&gt;
      &lt;option value="101006"&gt;元/半年&lt;/option&gt;
      &lt;option value="101007"&gt;元/年&lt;/option&gt;
      &lt;option value="101008"&gt;元/平方*月&lt;/option&gt;
    &lt;/select&gt;
  &lt;/span&gt;
  &lt;span class="k2-v-holder"&gt;&lt;/span&gt;
&lt;/div&gt;
</pre>

<h2>第二步、增加校验逻辑，只允许选择“元/年”</h2>
<pre class="brush:javascript;">
'o-unit' : {
    'custom' : {
        'value' : function(current) {
            return '101007' === current;
        },
        'message' : '一年一付，否则不租'
    }
}
</pre>

<h2>注意事项</h2>
<ol>
<li>自定义校验有两种写法，具体参考<a href="custom.php">Custom Demo</a></li>
</ol>

<h2>演示</h2>
<?php get_fields('username', 'unit'); ?>
<?php get_script(); ?>

<script>
YUI().use('k2-validator', 'k2-validator-default', function(Y){

new Y.Validator({
    'id' : 'test-form',
    'rules' : {
        'o-username' : {
            'required' : {
                'value' : true,
                'message' : '想租我的房子，不留下名字是不行的'
            }
        },
        
        'o-unit' : {
            'custom' : {
                'value' : function(current) {
                    return '101007' === current;
                },
                'message' : '一年一付，否则不租'
            }
        }
 
    } // end of rules
}); // end of new Y.Validator

});
</script>

<?php get_footer(); ?>
