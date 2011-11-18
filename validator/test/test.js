/*!
 * @revision:
 */

YUI.add('k2-validator-test', function(Y) {

    var 

    testCases = [],
    
    Assert = Y.Assert,
    
    ValidatorTest = Y.ValidatorTest = function() {
        ValidatorTest.superclass.constructor.apply(this, arguments);
    },

    areSame = function(rule, target, ruleValue, value, expected) {
        target.set('value', value);
        Assert.areSame( rule(target, ruleValue), expected, value );
    },
    
    areSamePassed = function(rule, target, ruleValue, value) {
        areSame(rule, target, ruleValue, value, true);
    },
    
    areSameFailed = function(rule, target, ruleValue, value) {
        areSame(rule, target, ruleValue, value, false);
    },

    getErrorMessage = function(id) {
        return Y.one(id).ancestor('.k2-v-wrapper').one('.k2-v-holder').get('innerHTML');
    };
    
    ValidatorTest.NAME = 'k2 validator unit test';
    ValidatorTest.ATTRS = {};
    
    testCases.push(new Y.Test.Case({
        name : "初始化校验",
        
        _should : {
            error  : {
                testEmptyParmsError : new TypeError('K2 Validator requires object parameters'),
                testStringParmsError : new TypeError('K2 Validator requires object parameters'),
                testWithoutIdError : new ReferenceError('K2 Validator requires id parameters'),
                testUnexistsError : new ReferenceError('form #unexists-form is not exists'),
                testWithoutValueError : new ReferenceError('required rule must have value parm')
            }
        },
        
        // 检测k2-validator包加载进来没有
        testLoad : function () {
            Assert.isObject(Y.Validator, 'Y.Validator加载不成功');
        },
        
        // 正常的初始化
        testNew : function () {
            var validator = new Y.Validator({id : 'test-form'});
        },
        
        // 不带任何参数是不行的，应该抛出异常
        testEmptyParmsError : function () {
            var validator = new Y.Validator();
        },
        
        // 参数必须是对象，检测字符串的情况，应该抛出异常
        testStringParmsError : function () {
            var validator = new Y.Validator('string-parms');
        },
        
        // 传递的参数不包括id
        testWithoutIdError : function () {
            var validator = new Y.Validator({});
        },
        
        // 表单不存在的时候，应该抛出异常
        testUnexistsError : function () {
            var validator = new Y.Validator({id : 'unexists-form'});
        },
        
        // 当没有给规则设置value属性时，应该抛出异常
        testWithoutValueError : function () {
        
            var validator = new Y.Validator({
                id : 'test-form',
                rules : {
                    username : {
                        required : {
                            message : '没有value的message'
                        }
                    }
                }
            });
        }

    }));
    
    // 这个测试用例是基于界面模拟点击的
    // 操作上有出错的风险
    // 延后来搞，首先搞基于代码的
    testCases.push(new Y.Test.Case({
        name : "界面模拟测试",
        
        _should : {
            ignore : {
                test : true
            }
        },
        
        setUp : function() {
            this.validator = new Y.Validator({id : 'test-form'});
        },
        
        test : function () {
            
            this.validator.addRules({
                'o-username' : {
                    'required' : {
                        'value' : true,
                        'message' : '姓名是必须输入的啊，老湿！'
                    }
                }
            });
            Y.one('#submit-button').simulate('click');
            Assert.areSame(getErrorMessage('#o-username'), '姓名是必须输入的啊，老湿！');
            this.validator.clearRules();
            
            this.validator.addRules({
                'o-username' : {
                    'required' : {
                        'value' : true,
                        'message' : '姓名是必须输入的啊，老湿！'
                    },
                    'minlength' : {
                        'value' : 4,
                        'message' : '姓名最少要四个字！'
                    }
                }
            });
            Y.one('#o-username').set('value', 'tom');
            
            Y.one('#submit-button').simulate('click');
            Assert.areSame(getErrorMessage('#o-username'), '姓名最少要四个字！');
            this.validator.clearRules();
            
        }

    }));
    
    testCases.push(new Y.Test.Case({
        name : "规则校验",
        
        _should : {
            error : {
                testRequiredError : new TypeError('required rule require boolean value'),
                testMaxlengthError : new TypeError('maxlength rule require number value'),
                testMinlengthError : new TypeError('minlength rule require number value'),
                testNonzeroError : new TypeError('nonzero rule require boolean value'),
                testPriceError : new TypeError('price rule require boolean value'),
                testCnmobileError : new TypeError('cnmobile rule require boolean value'),
                testCnphoneError : new TypeError('cnphone rule require boolean value'),
                testDateError : new TypeError('date rule require boolean value')
            }
        },
        
        setUp : function() {
            this.validator = new Y.Validator({id : 'test-form'});
        },
        
        tearDown : function() {
            delete this.validator;
        },
        
        // 非空校验
        testRequired : function () {
            var rule = this.validator.predefinedRules['required'],
                target = Y.one('#o-username');
            
            areSameFailed(rule, target, true, '');
            
            areSamePassed(rule, target, true, 'jack');
            areSamePassed(rule, target, false, '');
            areSamePassed(rule, target, false, 'jack');
        },
        
        // should error
        testRequiredError : function () {
            var rule = this.validator.predefinedRules['required'],
                target = Y.one('#o-username');

            areSamePassed(rule, target, 'str', 'jack');
            areSamePassed(rule, target, 12345, 'jack');
        },
        
        // 单选框和复选框至少有一个被选中
        testChecked : function() {
            // TODO : functions.php 中还没有引入radio
        },
        
        // 最大长度
        testMaxlength : function() {
            var rule = this.validator.predefinedRules['maxlength'],
                target = Y.one('#o-username');

            areSamePassed(rule, target, 5, 'jack');
            areSamePassed(rule, target, 4, 'jack');
            
            areSameFailed(rule, target, 3, 'jack');
        },
        
        // should error
        testMaxlengthError : function() {
            var rule = this.validator.predefinedRules['maxlength'],
                target = Y.one('#o-username');

            areSamePassed(rule, target, 'str', 'jack');
            areSamePassed(rule, target, 12345, 'jack');
        },
        
        // 最小长度
        testMinlength : function() {
            var rule = this.validator.predefinedRules['minlength'],
                target = Y.one('#o-username');
            
            areSamePassed(rule, target, 3, 'jack');
            areSamePassed(rule, target, 4, 'jack');
            
            areSameFailed(rule, target, 5, 'jack');
        },
        
        // should error
        testMinlengthError : function() {
            var rule = this.validator.predefinedRules['minlength'],
                target = Y.one('#o-username');

            areSamePassed(rule, target, 'str', 'jack');
            areSamePassed(rule, target, 12345, 'jack');
        },
        
        // 非零校验
        // TODO : 既然是非零，当然是针对数值来说的，不是一个数值有问题的。。
        testNonzero : function() {
            var rule = this.validator.predefinedRules['nonzero'],
                target = Y.one('#o-floor');

            areSamePassed(rule, target, true, '');
            areSamePassed(rule, target, true, '           ');
            areSamePassed(rule, target, true, 'asdfasdfasdf asdf');
            areSamePassed(rule, target, true, '2134');
            areSamePassed(rule, target, false, '0');
            
            areSameFailed(rule, target, true, '0');
            areSameFailed(rule, target, true, ' 0 ');
        },
        
        // should error
        testNonzeroError : function() {
            var rule = this.validator.predefinedRules['nonzero'],
                target = Y.one('#o-floor');

            areSamePassed(rule, target, 'str', 'jack');
            areSamePassed(rule, target, 12345, 'jack');
        },
        
        // 价格校验，这里遵循的标准是要么没有小数，有小数就要补足2位
        testPrice : function() {
            var rule = this.validator.predefinedRules['price'],
                target = Y.one('#o-price');
            
            areSamePassed(rule, target, true, '0');
            areSamePassed(rule, target, true, '19.50');
            areSamePassed(rule, target, true, '0.50');
            areSamePassed(rule, target, true, '19');
            areSamePassed(rule, target, true, '9.7');
            areSamePassed(rule, target, false, 'jack joones');
                        
            areSameFailed(rule, target, true, '14.');
            areSameFailed(rule, target, true, '-3.14');
            areSameFailed(rule, target, true, '-100');
            areSameFailed(rule, target, true, '9.0.7');
            areSameFailed(rule, target, true, 'word');
            areSameFailed(rule, target, true, 'word 38');
            areSameFailed(rule, target, true, '38 word');
            areSameFailed(rule, target, true, '4 8 15 16 23 42');
            areSameFailed(rule, target, true, '.45');
        },
        
        // should error
        testPriceError : function() {
            var rule = this.validator.predefinedRules['price'],
                target = Y.one('#o-price');

            areSamePassed(rule, target, 'str', 'jack');
            areSamePassed(rule, target, 12345, 'jack');
        },
        
        testCnmobile : function() {
            var rule = this.validator.predefinedRules['cnmobile'],
                target = Y.one('#o-mobile');
                
            areSamePassed(rule, target, true, '13512341234');
            areSamePassed(rule, target, true, '18612341234');
            areSamePassed(rule, target, true, '15812341234');
            areSamePassed(rule, target, true, '   15812341234   ');
            areSamePassed(rule, target, false, 'abc');
            
            areSameFailed(rule, target, true, 'abc');
            areSameFailed(rule, target, true, '156123412343');
            areSameFailed(rule, target, true, 'a13512341234');
            areSameFailed(rule, target, true, '13512341234a');
            areSameFailed(rule, target, true, '88888888888');
            areSameFailed(rule, target, true, '');
        },
        
        // should error
        testCnmobileError : function() {
            var rule = this.validator.predefinedRules['cnmobile'],
                target = Y.one('#o-mobile');

            areSamePassed(rule, target, 'str', 'jack');
            areSamePassed(rule, target, 12345, 'jack');
        },
        
        testCnphone : function() {
            var rule = this.validator.predefinedRules['cnphone'],
                target = Y.one('#o-tel');
                
            areSamePassed(rule, target, true, '0571-26880088');
            areSamePassed(rule, target, true, '0571-26880088-32250');
            areSamePassed(rule, target, true, '   010-38383438   ');
            areSamePassed(rule, target, true, '4008205555');
            areSamePassed(rule, target, true, '8008205555');
            areSamePassed(rule, target, true, '26880088');
            areSamePassed(rule, target, true, '3838438-320');
            areSamePassed(rule, target, false, 'abc');
            
            areSameFailed(rule, target, true, '95555');
            areSameFailed(rule, target, true, '571-26880088');
            areSameFailed(rule, target, true, '123456789012');
            areSameFailed(rule, target, true, '12345678902');            
            areSameFailed(rule, target, true, '400-820-5555');
            areSameFailed(rule, target, true, '4006-333-444');
            areSameFailed(rule, target, true, '800-820-5555');
            areSameFailed(rule, target, true, '8006-333-444');
            areSameFailed(rule, target, true, '268800889');
            areSameFailed(rule, target, true, '1234');
            areSameFailed(rule, target, true, '');
        },
        
        // should error
        testCnphoneError : function() {
            var rule = this.validator.predefinedRules['cnphone'],
                target = Y.one('#o-tel');

            areSamePassed(rule, target, 'str', 'jack');
            areSamePassed(rule, target, 12345, 'jack');
        },
        
        testDate : function() {
            var rule = this.validator.predefinedRules['date'],
                target = Y.one('#o-date');
                
            areSamePassed(rule, target, true, '2020-12-13');
            areSamePassed(rule, target, true, '2012-4-5');
            areSamePassed(rule, target, true, '1949-10-1');
            areSamePassed(rule, target, true, '    1982-6-29    '); // 前后有空格
            areSamePassed(rule, target, true, '1982-06-29'); // 月份带前置0
            areSamePassed(rule, target, false, 'abc');
            
            areSameFailed(rule, target, true, '1982/06/29'); // 分隔符不是-
            areSameFailed(rule, target, true, '2021-4-5'); // 年份太大
            areSameFailed(rule, target, true, '1848-4-5'); // 年份太小
            areSameFailed(rule, target, true, '2012-44-5'); // 月份超过12
            areSameFailed(rule, target, true, '2012-4-55'); // 日份超过31
            areSameFailed(rule, target, true, '123456789012'); // 不是日期格式
        },
        
        // should error
        testDateError : function() {
            var rule = this.validator.predefinedRules['date'],
                target = Y.one('#o-date');

            areSamePassed(rule, target, 'str', 'jack');
            areSamePassed(rule, target, 12345, 'jack');
        },
        
        testEmail : function() {
        },
        
        testBrother : function() {
        },
        
        testMask : function() {
        },
        
        testCustom : function() {
        },
        
        testAjax : function() {
        }

    }));
    
    Y.extend(ValidatorTest, Y.Base, {

        execute : function() {
            var i, suite = new Y.Test.Suite("K2 Validator 单元测试");
            
            for(i in testCases) {
                suite.add(testCases[i]);
            }

            Y.Test.Runner.add(suite);
            Y.Test.Runner.run();
        }
    });
    
        
});
