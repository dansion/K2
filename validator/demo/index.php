<?php require('functions.php');
/**
 * Custom rule test demo
 *
 * @creator lingyou
 * @since K2 Validator 1.3.5
 */

get_header(); ?>

<h2>说明</h2>
<p>K2 Validator是一个基于配置的表单校验组件</p>

<h2>规则列表</h2>
<table>
  <tr><th>规则名称</th><th>value类型</th><th>说明</th></tr>
  <tr><td><a href="custom.php">custom</a></td><td>function</td><td>自定义校验</td></tr>
  <tr><td><a href="">required（待补充）</a></td><td>boolean</td><td>非空校验</td></tr>
  <tr><td><a href="">checked（待补充）</a></td><td>boolean</td><td>必选校验</td></tr>
  <tr><td><a href="">maxlength（待补充）</a></td><td>number</td><td>最大长度校验</td></tr>
  <tr><td><a href="">minlength（待补充）</a></td><td>number</td><td>最小长度校验</td></tr>
  <tr><td><a href="">price（待补充）</a></td><td>boolean</td><td>价格</td></tr>
  <tr><td><a href="">cnmobile（待补充）</a></td><td>boolean</td><td>中国大陆11位手机号码</td></tr>
  <tr><td><a href="">cnphone（待补充）</a></td><td>boolean</td><td>中国大陆固定电话</td></tr>
  <tr><td><a href="">date（待补充）</a></td><td>boolean</td><td>日期</td></tr>
  <tr><td><a href="">email（待补充）</a></td><td>boolean</td><td>电子邮箱</td></tr>
  <tr><td><a href="">brother（待补充）</a></td><td>string</td><td>二选一校验</td></tr>
  <tr><td><a href="mask.php">mask</a></td><td>object</td><td>正则表达式校验</td></tr>
  <tr><td><a href="">ajax（待补充）</a></td><td>function</td><td>异步校验</td></tr>
</table>

<h2>组件校验</h2>
<table>
  <tr><th>组件名称</th><th>说明</th></tr>
  <tr><td><a href="placeholder.php">placeholder</a></td><td>非空校验</td></tr>
  <tr><td><a href="select.php">select</a></td><td></td></tr>
  <tr><td><a href="blur.php">失焦校验</a></td><td></td></tr>
  <tr><td><a href="only.php">只显示一个错误信息</a></td><td></td></tr>
  <tr><td><a href="custom-event.php">自定义事件</a></td><td></td></tr>
  <tr><td><a href="imgupload.php">图像上传组件配合</a></td><td></td></tr>
  <tr><td><a href="calendar.php">日历组件上传配合</a></td><td></td></tr>
</table>

<h2>表单结构</h2>
<pre class="brush:xml;">
&lt;div class="k2-v-wrapper">
  &lt;span class="k2-v-content">
    &lt;label>姓名：&lt;/label>&lt;input name="o-username" id="o-username" class="k2-v-text">
  &lt;/span>
  &lt;span class="k2-v-holder">&lt;/span>
&lt;/div>
</pre>

<h2>关于表单结构的说明</h2>
<ol>
<li>wrapper和content是必须的，holder是可选的，如果没有holder，会自动生成一个。</li>
<li>content和holder要被包含在wrapper里面，但这两个元素不需要同级。</li>
</ol>

<h2>脚本调用</h2>
<pre class="brush:javascript;">
YUI().use('k2-validator', 'k2-validator-default', function(Y){
    new Y.Validator({
        'id' : 'test-form',
        'rules' : {
            // 具体的规则写法，参考规则列表中的演示
        }
    });
});
</pre> 

<h2>关于脚本调用的说明</h2>
<ol>
<li>必须引用k2-validator这个包，对应所有的脚本。可选引用k2-validator-default这个包，对应一套默认皮肤。</li>
</ol>

<h2>参数</h2>
<table>
  <tr><th>参数</th><th>类型</th><th>默认值</th><th>含义</th></tr>
  <tr><td>id</td><td>string</td><td>wrap</td><td>表单的id，必须输入，你不会想用默认值的</td></tr>
  <tr><td>rules</td><td>array</td><td>[ ]</td><td>规则列表，也可以事后通过addRules添加</td></tr>
  <tr><td>validateOnBlur</td><td>boolean</td><td>true</td><td>失焦的时候是否进行失焦校验，当为true的时候校验</td></tr>
  <tr><td>requiredOnBlur</td><td>boolean</td><td>false</td><td>当内容为空，是否进行失焦校验，当为true的时候校验</td></tr>
  <tr><td>scrollToTop</td><td>boolean</td><td>true</td><td>提交校验以后，是否跳到表单的开始，当为true的时候跳转</td></tr>
</table>

<h2>演示</h2>
<?php get_fields(); ?>
<?php get_script(); ?>

<script>
YUI().use('k2-validator', 'k2-validator-default', function(Y){

new Y.Validator({
    'id' : 'test-form',
    'rules' : {
        'o-username' : {
            'required' : {
                'value' : true,
                'message' : '你难道不是大蒜么？'
            }
        }
        
        
        
    } // end of rules
}); // end of new Y.Validator

});
</script>

<?php get_footer(); ?>
