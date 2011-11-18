<?php require('../demo/functions.php');
/**
 * K2 Validator Unite Test
 *
 * @creator lingyou
 * @since k2-validator-1-3-6.js
 */

get_header('单元测试'); ?>

<h2>说明</h2>
<ol>
  <li>这个页面的单元测试用，如果是为了查用法，请看其他页面。</li>
</ol>

<h2>演示</h2>
<?php get_fields(); ?>
<?php get_script(); ?>

<script>
YUI({
    modules : {
        'k2-validator-test' : {
            fullpath : 'test.js',
            requires : ['k2-validator', 'test', 'node-event-simulate', 'k2-validator-default']
        }

    }
}).use('k2-validator-test', function(Y){

    var test = new Y.ValidatorTest();
    test.execute();
});



























/*
YUI({
    modules : {
        'k2-validator' : {
            fullpath : '../validator.js',
            requires : ['base']
        }

    }
}).use('k2-validator', 'test', 'console', function(Y){


 vtest = new Y.Test.Case({
    
        name : "K2 Validator Test",
        
        setUp : function () {
            this.textRules =  {
                'required' : {
                    'value' : true,
                    'message' : '姓名不能为空'
                },
                'maxlength' : {
                    'value' : 10,
                    'message' : '最多只能包含10个字符'
                },
                'minlength' : {
                    'value' : 3,
                    'message' : '最少3个个字符'
                }
            },
            this.mobileRules = {
                'required' : {
                    'value' : true,
                    'message' : '手机号码不能为空'
                },
                'cnmobile' :  {
                    'value' : true,
                    'message' : '手机号码格式不正确'
                }
            },
            this.validator1 = new Y.Validator({
                'id' : 'test-form',
                'rules' : {
                    'o-username' : this.textRules,
                    'o-mobile' : this.mobileRules
                }
            }); // end of new validator
        },
        
        tearDown : function () {
            delete this.textRules;
            delete this.mobileRules;
            delete this.validator1;
        },
        
        // 无参数初始化
        testNewValidator : function () {
            var Assert = Y.Assert;
            
            Assert.isObject(this.textRules);
            Assert.isObject(this.mobileRules);
            Assert.isObject(this.validator1);
        },
        
        testRuleRequired : function() {
            var Assert = Y.Assert,
                ruleFunction = this.validator1.predefinedRules['required'];
            
            var input1 = this.validator1.form.create('<input type="text" value="1324">');
            var input2 = this.validator1.form.create('<input type="text" value="">');
            var input3 = this.validator1.form.create('<input type="text">');
            var input4 = this.validator1.form.create('<input type="text" value="    ">');
            
            Assert.isFunction(ruleFunction);
            Assert.isTrue(ruleFunction(input1, true));
            Assert.isFalse(ruleFunction(input2, true));
            Assert.isFalse(ruleFunction(input3, true));
            Assert.isFalse(ruleFunction(input3, true));
        }
    
    });
    
    var ExampleSuite = new Y.Test.Suite("K2 Validator Test Suite");
    ExampleSuite.add(vtest);
    
    
    Y.Test.Runner.add(ExampleSuite);
    Y.Test.Runner.run();

    var r = new Y.Console({
        newestOnTop : false,
        width : '600px',
        height : '500px',
        useBrowserConsole : true,
        strings : {
            'title' : 'K2 Validator Test',
            'pause' : '暂停',
            'clear' : '清屏',
            'collapse' : '收起',
            'expand' : '展开'
        },
        style: 'block'
    });
    
    r.render('#testLogger');

});
*/
</script>

<?php get_footer(); ?>
