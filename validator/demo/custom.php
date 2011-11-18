<?php require('functions.php');
/**
 * Custom rule test demo
 *
 * @creator lingyou
 * @since k2-validator-1-3-6.js
 */

get_header('自定义校验'); ?>

<h2>说明</h2>
<ol>
  <li>当K2 Valiadtor提供的校验功能无法满足业务需求时，可以使用自定义校验。自定义校验将规则定义为一个函数，具体的校验逻辑可以自己写，按照要求返回就可以。</li>
  <li>之前有个bug，如果不添加require规则，custom会失效，已经修复。</li>
</ol>

<h2>调用方式1：统一的错误信息</h2>
<pre class="brush:javascript;">
'o-username' : {
    'required' : {
        'value' : true,
        'message' : '必须告诉我你的名字'
    },

    'custom' : {
        'value' : function(a) {
            return a === '大蒜';
        },
        'message' : '你难道不是大蒜么？'
    }
}
</pre>

<h2>调用方式2：可以自定义错误信息和错误级别</h2>
<pre class="brush:javascript;">
'o-mobile' : {
    'custom' :  {
        'value' : function(v) {
            if(v === '18626890905') {
                return { 'message' : '貌似是大蒜的电话，但是欠费了，不能用！'};
            }
            
            if(v === '15888876925') {
                return { 'message' : '额，笋哥的电话不是掉厕所了么？'};
            }
            
            if(v === '13012345678') {
                return {};
            }
            
            if(v === '13588762624') {
                return { 'succeed' : true };
            }
            
            return { 'message' : '我知道这个世界只有四部手机：13012345678、18626890905、15888876925和13588762624' };
        }
    }
}
</pre>

<h2>调用方式2的返回值</h2>
<table>
  <tr><th>参数</th><th>默认值</th><th>含义</th></tr>
  <tr><td>succeed</td><td>false</td><td>校验是否通过</td></tr>
  <tr><td>level</td><td>777</td><td>错误级别，越大越优先显示</td></tr>
  <tr><td>message</td><td>用了自定义校验，为啥子不写错误呢</td><td>错误信息</td></tr>
</table>

<h2>演示</h2>
<?php get_fields('username', 'mobile', 'email'); ?>
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
            },

            'custom' : {
                'value' : function(a) {
                    return a === '大蒜';
                },
                'message' : '你难道不是大蒜么？'
            }
        },
        
        'o-mobile' : {
            'custom' :  {
                'value' : function(v) {
                    if(v === '18626890905') {
                        return { 'message' : '貌似是大蒜的电话，但是欠费了，不能用！'};
                    }
                    
                    if(v === '15888876925') {
                        return { 'message' : '额，笋哥的电话不是掉厕所了么？'};
                    }
                    
                    if(v === '13012345678') {
                        return {};
                    }
                    
                    if(v === '13588762624') {
                        return { 'succeed' : true };
                    }
                    
                    return { 'message' : '我知道这个世界只有四部手机：13012345678、18626890905、15888876925和13588762624' };
                  
                },
                'message' : '手机号码格式不正确'
            }
        },
        'o-email' : {
            'custom' : {
                'always' : true,
                'value' : function(a) {
                    return a === 'lingyou@taobao.com';
                },
                'message' : '为啥不是lingyou@taobao.com呢？'
            }
        }
        
        
        
    } // end of rules
}); // end of new Y.Validator

});
</script>

<?php get_footer(); ?>
