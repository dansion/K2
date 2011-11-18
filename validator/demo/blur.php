<?php require('functions.php');
/**
 * validate when blur
 *
 * @creator lingyou
 * @since k2-validator-1-3-6.js
 */

get_header('失焦校验'); ?>

<h2>说明</h2>
<p>为了提高校验效率，可以在表单项失焦的时候就进行校验，并给出结果，此为失焦校验。</p>
<p>失焦时执行非空校验，如果校验失败，会在wrapper级别添加k2-v-required-failed这个class，这样就可以在失焦时和提交时，对非空校验给出不同方式的提示。</p>

<h2>调用方法</h2>
<pre class="brush:javascript;">
YUI().use('k2-validator', 'k2-validator-default', function(Y){
    new Y.Validator({
        'id' : 'test-form',
        'validateOnBlur' : true, // 是否执行失焦校验，默认为true
        'requiredOnBlur' : true, // 失焦时是否进行非空校验，默认为false
        'rules' : {}
    });
});
</pre>

<h2>示例：失焦时非空校验失败，不显示错误信息，表单项加红框</h2>
<pre class="brush:css;">
.k2-v-required-failed .k2-v-holder {
  display : none;
}
.k2-v-required-failed input,
.k2-v-required-failed textarea {
  border : 1px solid red;
}
</pre>

<h2>演示</h2>
<?php get_fields('username', 'email', 'mobile', 'review'); ?>
<?php get_script(); ?>

<script>
YUI().use('k2-validator', 'k2-validator-default', function(Y){

new Y.Validator({
    'id' : 'test-form',
    'requiredOnBlur' : true,
    'rules' : {
        'o-username' : {
            'required' : {
                'value' : true,
                'message' : '想租我的房子，不留下名字是不行的'
            },
            'minlength' : {
                'value' : 2,
                'message' : '名字最少也要2个字吧'
            }
        },
        'o-email' : {
            'required' : {
                'value' : true,
                'message' : '留个电子邮箱，我给你邮支票'
            },
            'email' : {
                'value' : true,
                'message' : '不要蒙我，你填写的不是电子邮箱'
            }
        },
        'o-mobile' : {
            'required' : {
                'value' : true,
                'message' : '不留电话，我怎么找你啊？'
            },
            'cnmobile' : {
                'value' : true,
                'message' : '哥哥你不会没用过手机吧？格式错了！'
            }
        },
        'o-review' : {
            'required' : {
                'value' : true,
                'message' : '留个言点评一下吧'
            },
            'maxlength' : {
                'value' : 5,
                'message' : '话太多了。。太多了。。太多了。。'
            }
        }
 
    } // end of rules
}); // end of new Y.Validator

});
</script>

<?php get_footer(); ?>
