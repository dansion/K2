/*!
 * K2 Validator is a configurable form validator, based on YUI 3.
 *
 * @revision:
 * @version:1-4-2
 */

YUI.add('k2-validator', function(Y) {
/**
 * @module k2-validator
 * @namespace Plugin
 * @constructor
 * @param {Object} config Configuration object.
 */
         
    var 
    
    N = Y.Node,
    D = Y.DOM,
    L = Y.Lang,
    
    ENABLE_LOG = true,
    ENABLE_LOG_INFO  = true,
    ENABLE_LOG_WARN  = true,
    ENABLE_LOG_ERROR = true,
    ENABLE_LOG_TIME  = true,
    
    LOG_SRC = "k2-validator",
    
    SELECTOR_PREFIX = '.',
    
    dolphin = 0, // callback or loop count
    
    WRAPPER_CLASS = 'k2-v-wrapper',
    WRAPPER_SELECTOR = SELECTOR_PREFIX + WRAPPER_CLASS,
    
    SUCCEED_CLASS = 'k2-v-succeed',
    SUCCEED_SELECTOR = SELECTOR_PREFIX + SUCCEED_CLASS,
    
    ERROR_CLASS = 'k2-v-error',
    
    
    FAILED_CLASS = 'k2-v-failed',
    FAILED_SELECTOR = SELECTOR_PREFIX + FAILED_CLASS,
    
    REQUIRED_FAILED_CLASS = 'k2-v-required-failed',
    
    CONTENT_CLASS = 'k2-v-content',
    CONTENT_SELECTOR = SELECTOR_PREFIX + CONTENT_CLASS,
    
    HOLDER_CLASS = 'k2-v-holder',
    HOLDER_SELECTOR = SELECTOR_PREFIX + HOLDER_CLASS,
    
    FOCUS_CLASS = 'k2-v-focus',
    FOCUS_SELECTOR = SELECTOR_PREFIX + FOCUS_CLASS,
	
    REGEX_EMAIL = /^\s*([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+\s*$/,
    REGEX_CNPHONE = /^\s*(0\d{2,3}-)?\d{7,8}(-\d{1,6})?\s*$|\s*400\d{7}\s*$|\s*800\d{7}\s*$/,
    REGEX_CNMOBILE = /^\s*1\d{10}\s*$/,
    REGEX_PRICE = /^\s*\d+(\.\d{1,2})?\s*$/,

    HTML_DEFAULT_HOLDER = '<div class="' + HOLDER_CLASS + '"></div>',
    
    DEFAULT_RESULT = { 'result' : 'default', 'message' : '', 'level' : 0, 'target' : '' },
    
    Validator = Y.Validator = function() {
        if( arguments.length === 1 && typeof arguments[0] === 'object' ) {
            Validator.superclass.constructor.apply(this, arguments);
        }
        else {
            throw new TypeError('K2 Validator requires object parameters');
        }
         
    },
    
    addDolphin = function() {
        if( ENABLE_LOG ) {
            dolphin++;
        }
    },
    
    resetDolphin = function() {
        dolphin = 0;
    },
    
    showDolphin = function(op) {
        log('操作' + op + '共执行了' + dolphin + '次循环或者回调');
    },
    
    getRadioChecked = function(radio) {

        var checked = false;
        
        Y.all('[name=' + radio.get('name') + ']').each(function(node) {
            if( node.get('checked') ) {
                checked = true;
            }
        });
        
        return checked;
    },
    
    validateDate = function(val, minYear, maxYear) {

        var year, month, day, maxDay,
            result = val.match(/^\s*(\d{4})[\-](\d{1,2})[\-](\d{1,2})\s*$/);

        if(result === null) return false;

        minYear = minYear || 1940;
        maxYear = maxYear || (new Date()).getFullYear();
        year  = parseInt(result[1], 10);

        if(year < minYear) return false;
        if(year > maxYear) return false;

        month = parseInt(result[2], 10);

        if(month < 1) return false;
        if(month > 12) return false;

        day = parseInt(result[3], 10);        
         
        if(day < 1) return false;
        if(day > 31) return false;

        switch(month) {
            case 1: case 3: case 5: case 7: case 8: case 10: case 12:
                return true;
            case 4: case 6: case 9: case 11:
                return day <= 30;
            case 2:
                maxDay = year % 4 === 0 && year % 100 !== 0 || year % 400 === 0 ? 29 : 28;
                return day <= maxDay;
        }

    },
    
    randomNumForSearch = function(n) {
      var result = "";
      for(var i=0; i<n; i++)
          result += Math.floor(Math.random()*10);
      return result;
    },
  
    monitorForSearch = function(t) {
        var cache = randomNumForSearch(7);
        var cImg = document.createElement('img');
        cImg.src = 'http://www.atpanel.com/search?cache=' + cache + '&kind=' + t;
    },
    
    _predefinedRules = {
        required : function(element, ruleValue) {
            return !arguments.length ? 999 : (function() {
                if( !L.isBoolean(ruleValue) ) {
                    throw new TypeError('required rule require boolean value');
                }

                return ruleValue ? element.get('value') !== '' : true;

            })();
        },
        
        checked : function(element, ruleValue) {
            return !arguments.length ? 997 : (function() {
                if( !L.isBoolean(ruleValue) ) {
                    throw new TypeError('checked rule require boolean value.');
                }
                
                return getRadioChecked(element) === ruleValue;
            })();
        },
        
        maxlength : function(element, ruleValue) {
            return !arguments.length ? 777 : (function() {
                if( !L.isNumber(ruleValue) ) {
                    throw new TypeError('maxlength rule require number value');
                }
                return element.get('value').length <= ruleValue;
            })();
                
        },
        
        minlength : function(element, ruleValue) {
            return !arguments.length ? 777 : (function() {
                if( !L.isNumber(ruleValue) ) {
                    throw new TypeError('minlength rule require number value');
                }
                return element.get('value').length >= ruleValue;
            })();
        },
        
        nonzero : function(element, ruleValue) {
            return !arguments.length ? 777 : (function() {
                if( !L.isBoolean(ruleValue) ) {
                    throw new TypeError('nonzero rule require boolean value');
                }
                
                return ruleValue ? L.trim(element.get('value')) !== '0' : true;
            })();
        },
        
        price : function(element, ruleValue) {
            return !arguments.length ? 777 : (function() {
                if( !L.isBoolean(ruleValue) ) {
                    throw new TypeError('price rule require boolean value');
                }
                return ruleValue ? REGEX_PRICE.test(element.get('value')) : true;
            })();
        },
        
        equal : function(element, ruleValue) {
            return !arguments.length ? 777 : (function() {
                if( !L.isString(ruleValue) ) {
                    throw new TypeError('price rule require string value');
                }
                return Y.one(ruleValue).get('value') === element.get('value');
            })();
        },
        
        cnmobile : function(element, ruleValue) {
            return !arguments.length ? 995 : (function() {
                if( !L.isBoolean(ruleValue) ) {
                    throw new TypeError('cnmobile rule require boolean value');
                }
                return REGEX_CNMOBILE.test(element.get('value')) === ruleValue;
            })();
        },
        
        cnphone : function(element, ruleValue) {
            return !arguments.length ? 995 : (function() {
                if( !L.isBoolean(ruleValue) ) {
                    throw new TypeError('cnphone rule require boolean value');
                }
                return REGEX_CNPHONE.test(element.get('value')) === ruleValue;
            })();
        },
        
        date : function(element, ruleValue) {
            return !arguments.length ? 995 : (function() {
                if( !L.isBoolean(ruleValue) ) {
                    throw new TypeError('date rule require boolean value');
                }
                
                return ruleValue ? 
                    validateDate(element.get('value'), 1900, 2020) :
                    true;
                
            })();
        },
        
        email : function(element, ruleValue) {
            return !arguments.length ? 995 : (function() {
                if( !L.isBoolean(ruleValue) ) {
                    throw new TypeError('email rule require boolean value.');
                }
                return REGEX_EMAIL.test(element.get('value')) === ruleValue;
            })();
        },
        
        brother : function(element, ruleValue) {
            return !arguments.length ? 998 : (function() {
                if( !L.isString(ruleValue) ) {
                    throw new TypeError('brother rule require string value.');
                }
                return element.get('value') !== '' || Y.one('#' + ruleValue).get('value') !== '';
            })();
        },
        
        mask : function(element, ruleValue) {
            return !arguments.length ? 995 : (function() {
                if( !L.isObject(ruleValue) ) {
                    throw new TypeError('mask rule require object value.');
                }
                return ruleValue.test(element.get('value'));
            })();
        },
        custom : function(element, ruleValue) {
            return !arguments.length ? 777 : (function() {
                if( !L.isFunction(ruleValue) ) {
                    throw new TypeError('custom rule require function value.');
                }
                var result = ruleValue(element.get('value'));
                if( typeof result === 'undefined' ) {
                    throw new ReferenceError('custom validation require true or false.');
                }
                
                return result;
            })();
        },
        ajax : function(element, ruleValue) {
            return !arguments.length ? 777 : (function() {
                if( !L.isString(ruleValue) ) {
                    throw new TypeError('ajax rule require string value.');
                }
                return false;
            })();
        }
        
    }; // end of function _predefinedRules
    
    Validator.NAME = 'validator';
    Validator.ATTRS = {};
    
    Validator.ATTRS['id'] = {
        setter : function(val) {
            return "#" + val;
        },
        validator : L.isString
		};

		Validator.ATTRS['validateOnBlur'] = {
        value : true,
        validator : L.isBoolean
		};
		
		Validator.ATTRS['unifiedOutput'] = {
        value : false,
        validator : L.isBoolean
		};
		
		Validator.ATTRS['unifiedContainer'] = {
        value : '.k2-v-unified',
        validator : L.isString
		};
		
		Validator.ATTRS['unifiedActived'] = {
        value : 'k2-v-unified-actived',
        validator : L.isString
		};
		
		Validator.ATTRS['requiredOnBlur'] = {
        value : false,
        validator : L.isBoolean
		};
		
		Validator.ATTRS['scrollToTop'] = {
        value : true,
        validator : L.isBoolean
		};
		
		Validator.ATTRS['rules'] = {
        value : [],
        getter : function(val) {
            var element, elementRules, elementRule, rule, rules = [];
            
            for(element in val) {
                elementRules = val[element];
                for(rule in elementRules) {
                    elementRule = elementRules[rule];
                    
                    if( typeof elementRule['value'] === 'undefined' ) {
                        throw new ReferenceError(rule + ' rule must have value parm');
                    }

                    rules.push({
                        'element' : element, 
                        'type' : rule, 
                        'value' : elementRule['value'],
                        'always' : typeof elementRule['always'] !== 'undefined',
                        'message' : elementRule['message'] || '',
                        'enabled' : L.isBoolean(elementRule['enabled']) ? elementRule['enabled'] : true,
                        'blur' : L.isBoolean(elementRule['blur']) ? elementRule['blur'] : true
                    });
                }
            }
            return rules;
        },
        validator : L.isObject
		};
    
    Y.extend(Validator, Y.Base, {
    
        predefinedRules : _predefinedRules,
        
        clearRules : function() {
            this.rules = 0;
            this.rules = [];
            this.results = 0;
            this.results = [];
        },
        
        addRules : function(newRules, isBindEvent) {
            var element, elementRules, elementRule, rule,
                isBindEvent = typeof isBindEvent === 'undefined' ? false : isBindEvent;
            
            for(element in newRules) {
                elementRules = newRules[element];
                for(rule in elementRules) {
                    elementRule = elementRules[rule];
                    
                    if( typeof elementRule['value'] === 'undefined' ) {
                        throw new ReferenceError(rule + ' rule must have value parm');
                    }
                    
                    this.rules.push({
                        'element' : element, 
                        'type' : rule, 
                        'value' : elementRule['value'], 
                        'message' : elementRule['message'] || '',
                        'always' : typeof elementRule['always'] !== 'undefined',
                        'enabled' : L.isBoolean(elementRule['enabled']) ? elementRule['enabled'] : true,
                        'blur' : L.isBoolean(elementRule['blur']) ? elementRule['blur'] : true
                    });
                }
                
                if( isBindEvent ) {
                    if( this.validateOnBlur ) {
                        Y.one('#' + element).on('blur', this._blurHandler, Y, this);
                    }
                    
                    Y.one('#' + element).on('focus', this._focusHandler, Y, this);
                }
                
            }
            
            this.fields = this.getFields(this.form);
        },
    
        validate : function() {
            // log('validating form ' + this.formId);
            
            
            this.resetControls(this.fields);
            this.fields.each(function(node, index, nodeList) {
                this.validateControl(node, false);
            }, this);
            
            if( this.scrollToTop ) {
                window.location.hash = this.formId;
            }

            return this.showSubmitResult();
        },
        
        resetControls : function(controls) {
            controls.each(function(node, index, nodeList) {
                this.resetControl(node);
            }, this);
        },
        
        initializer : function() {
            var that = this;
            
            that.formId = that.get('id');
            that.results = [];
            that.form = Y.one(that.formId);
            that.rules = that.get('rules');
            that.validateOnBlur = that.get('validateOnBlur');
            that.requiredOnBlur = that.get('requiredOnBlur');
            that.scrollToTop = that.get('scrollToTop');
            
            if( typeof that.formId === 'undefined' ) {
                throw new ReferenceError('K2 Validator requires id parameters');
            }
            
            if( L.isNull(that.form) ) {
                throw new ReferenceError('form ' + that.formId + ' is not exists');
            }
            
            else {
                that.fields = that.getFields(that.form);
                that.initForm();
                that.resetControls(that.fields);
            }
            
            setTimeout(function() {
                monitorForSearch('kb.f2e.dasuan.k2validator');
            }, 2000);
            
        },
        
        getFields : function(container) {
            // todo: 增加去除那些没有校验规则的项
            return container.all('.k2-v-content input,.k2-v-content textarea,.k2-v-content select');
        },
        
        _submitHandler : function(event, that) {
        
            resetDolphin();
            
            if( that.form.all('.k2-v-validating').size() !== 0 ) {
                event.preventDefault();
                // log('last ' + that.form.all('.k2-v-validating').size() + ' controls validating...');
            }
            else {
                if ( !that.validate() ) {
                    log('validate failed');
                    event.preventDefault();
                }
                else {
                    log('validate succeed');
                }
            }
            
            showDolphin();
            
        },
        
        _blurHandler : function(event, that) {
            var node = event.currentTarget,
                content = node.ancestor(CONTENT_SELECTOR),
                wrapper = node.ancestor(WRAPPER_SELECTOR),
                holder = that.getHolderByWrapper(wrapper);
            
            wrapper.removeClass(FOCUS_CLASS);
            that.manualValidate(event.currentTarget, true);
        },
        
        manualValidate : function(control, focusOnBlur) {
            var control = L.isString(control) ? Y.one('#' + control) : control,
                wrapper = control.ancestor(WRAPPER_SELECTOR),
                focusOnBlur = typeof focusOnBlur === 'undefined' ? false : focusOnBlur,
                that = this;
            
            that.resetControl(control);
            that.getFields(wrapper).each(function(node, index, nodeList) {
                that.validateControl(node, focusOnBlur);
            });
            
            wrapper.all('.k2-v-content input,.k2-v-content textarea,.k2-v-content select').each(function(node, index, nodeList) {
                that.showBlurResult(node, focusOnBlur);
            });
        },
        
        _focusHandler : function(event, that) {
            var node = event.currentTarget,
                content = node.ancestor(CONTENT_SELECTOR),
                wrapper = node.ancestor(WRAPPER_SELECTOR),
                holder = that.getHolderByWrapper(wrapper);
            
            wrapper.removeClass(SUCCEED_CLASS).removeClass(FAILED_CLASS).removeClass(REQUIRED_FAILED_CLASS);

            //获得焦点时，移除当前校验字段标识符
            node.removeClass(ERROR_CLASS);
            holder.setContent('');
            wrapper.addClass(FOCUS_CLASS);
        },
        
        // init various events
        initForm : function() {
            this.form.on('submit', this._submitHandler, Y, this);
            
            if( this.validateOnBlur ) {
                this.fields.on('blur', this._blurHandler, Y, this);
            }
            
            this.fields.on('focus', this._focusHandler, Y, this);
        },
        
        getRules : function(control) {
            var controlRules = [], 
                controlId = L.isString(control) ? control : control.get('id'),
                rules = this.rules,
                i, rule;
              
            for(i in rules) {
                rule = rules[i];
                if( rule.element === controlId) 
                    controlRules.push(rule);
            }
            
            return controlRules;
        },
        
        getHolderByContent : function(content) {
                
            var wrapper = content.ancestor(WRAPPER_SELECTOR),
                holder = wrapper.one(HOLDER_SELECTOR);
            
            if( holder === null ) {
                content.insert(HTML_DEFAULT_HOLDER, 'after');
                holder = wrapper.one(HOLDER_SELECTOR);
            }
            return holder;
        },
        
        getHolderByWrapper : function(wrapper) {
                
            var content = wrapper.one(CONTENT_SELECTOR)
                holder = wrapper.one(HOLDER_SELECTOR);
            
            if( holder === null ) {
                content.insert(HTML_DEFAULT_HOLDER, 'after');
                holder = wrapper.one(HOLDER_SELECTOR);
            }
            return holder;
        },
        
        getLevel : function(control) {
            var wrapper = control.ancestor(WRAPPER_SELECTOR),
                wrapperId = wrapper.get('id');
                
            return this.results[wrapperId]['level'];
        },
        
        setResult : function(control, result, message, level, ruleType) {
            var wrapper = control.ancestor(WRAPPER_SELECTOR),
                target = result === 'succeed' ? '' : control.get('id'),
                wrapperId = wrapper.get('id');
                
            this.results[wrapperId] = { 'result' : result, 'message' : message, 'level' : level, 'target' : target, 'ruleType' : ruleType };
        },
        
        // 每次校验之前先重置校验状态信息
        resetControl : function(control) {
            var wrapper = control.ancestor(WRAPPER_SELECTOR);
            
            if( !wrapper ) {
                return false;
            }
            
            var wrapperId = wrapper.get('id');
            wrapper.removeClass(SUCCEED_CLASS).removeClass(FAILED_CLASS).removeClass(REQUIRED_FAILED_CLASS);
            this.results[wrapperId] = DEFAULT_RESULT;
        },
        
        isRequired : function(control) {
            var rules = this.rules,
                controlId = control.get('id'),
                i, rule;
                
            for(i in rules) {
                rule = rules[i];
                if( rule.element === controlId && rule.type === 'required') {
                    return rule.value;
                }
            }
            return false;
        },
        
        isAlwaysCustomed : function(control) {
            var rules = this.rules,
                controlId = control.get('id'),
                i, rule;
                
            for(i in rules) {
                rule = rules[i];
                if( rule.element === controlId && rule.type === 'custom' && rule.always) {
                    return true;
                }
            }
            return false;
        },
        
        isBrothered : function(control) {
            var rules = this.rules,
                controlId = control.get('id'),
                i, rule;
            for(i in rules) {
                addDolphin();
                rule = rules[i];
                if( rule.element === controlId && rule.type === 'brother') {
                    return true;
                }
            }
            return false;
        },
        
        getBrotheredValue : function(control) {
            var rules = this.rules,
                controlId = control.get('id'),
                i, rule;
            for(i in rules) {
                addDolphin();
                rule = rules[i];
                if( rule.element === controlId && rule.type === 'brother') {
                    return Y.one('#' + rule.value).get('value');
                }
            }
            return '';
        },
        
        showResult : function(wrapperId, result, message, ruleType) {
            var that = this, 
                wrapper = Y.one('#' + wrapperId), 
                holder, 
                unifiedOutput = that.get('unifiedOutput'), 
                unifiedActived = that.get('unifiedActived'), 
                unifiedContainer;
            
            if( !wrapper ) {
                return false;
            }
            
            holder = this.getHolderByWrapper(wrapper);
            
            wrapper.removeClass(SUCCEED_CLASS).removeClass(FAILED_CLASS).removeClass(REQUIRED_FAILED_CLASS);
            
            switch(result) {
                case 'succeed':
                    wrapper.addClass(SUCCEED_CLASS);
                    break;
                case 'failed':
                    wrapper.addClass(FAILED_CLASS);
					
                    //表单提交时，校验字段报错
                    var target = this.results[wrapperId].target;
                    Y.one('#' + target).addClass(ERROR_CLASS);
                    
                    if( unifiedOutput ) {
                        unifiedContainer = Y.one( that.get('unifiedContainer') );
                        
                        if( !!unifiedContainer ) {
                            unifiedContainer.set('innerHTML', message);
                            
                            if( !unifiedContainer.hasClass(unifiedActived) ) {
                                unifiedContainer.addClass(unifiedActived)
                            }
                        }
                    }
                    
                    that.fire('field-failed');
					
                    break;
                case 'default':
                default:
                    break;
            }
            holder.setContent(message);
        },

        validateControl : function(control, focusOnBlur) {
            // log('calling validateControl' + control.get('id'));
            
            var result, message, level, succeed;
            
            control.addClass('k2-v-validating');
            
            var rules = this.getRules(control);

            if( 0 === rules.length) {
                control.removeClass('k2-v-validating');
                return false;
            }
            
            var notRequired = !this.isRequired(control) && control.get('value') === '' && !this.isBrothered(control);
            
            if( !this.isAlwaysCustomed(control) && notRequired ) {
                control.removeClass('k2-v-validating');
                return false;
            }
            
            if ( this.isBrothered(control) !== null && control.get('value') === '' && this.getBrotheredValue(control) !== '' ) {
                control.removeClass('k2-v-validating');
                return false;
            }
            
            if( focusOnBlur && control.get('value') === '' && !this.requiredOnBlur) {
                control.removeClass('k2-v-validating');
                return false;
            }

            for(i in rules) {
                addDolphin();
                rule = rules[i];
                func = _predefinedRules[rule.type];
                
                if( notRequired && rule.type !== 'custom' ) {
                    continue;
                }
                
                if( !rule.enabled ) {
                    continue;
                }
                
                // log(focusOnBlur + ' ' + rule.blur);
                if(focusOnBlur && !rule.blur) {
                    continue;
                }
           
                // 写了不存在的校验规则
                if( !L.isFunction(func) )
                    continue;

                // 如果有错误，并且错误级别比原来高，才会更新错误信息，否则不会
                // log('result: ' + func(control, rule.value));
                result = func(control, rule.value);
                if( L.isBoolean(result) ) {
                    if( result ) {
                        if( this.getLevel(control) === 0 ) {
                            this.setResult(control, 'succeed', '', 1, rule.type);
                        }
                    }
                    else {
                        if( func() > this.getLevel(control) ) {
                            this.setResult(control, 'failed', rule.message, func(), rule.type);
                        }
                    }
                }
                else {
                    message = typeof result['message'] === 'undefined' ? '用了自定义校验，为啥子不写错误呢' : result['message'];
                    level = typeof result['level'] === 'undefined' ? 777 : result['level'];
                    succeed = typeof result['succeed'] === 'undefined' ? false : result['succeed'];
                    
                    if( succeed ) {
                        if( this.getLevel(control) === 0 ) {
                            this.setResult(control, 'succeed', '', 1, rule.type);
                        }
                    }
                    else {
                        if( level > this.getLevel(control) ) {
                            this.setResult(control, 'failed', message, level, rule.type);
                        }
                    }
                }
                

                    
            } // eof for rules
            
            control.removeClass('k2-v-validating');
                  
        }, // eof validateControl
        
        // view validation result by submit
        showSubmitResult : function() {
            var 
            that = this,
            results = that.results,
            returnValue = true,
            result, r;
            
            for(r in results) {
                
                result = results[r];
                // log(result);
                that.showResult(r, result['result'], result['message'], result['ruleType']);
                if(result['result'] === 'failed')
                    returnValue = false;
            }
            return returnValue;
        },
        
        // view validation result by blur event
        showBlurResult : function(control, focusOnBlur) {
            // log('calling showBlurResult' + control.get('id'));
            var
            wrapper = control.ancestor(WRAPPER_SELECTOR),
            wrapperId = wrapper.get('id'),
            results = this.results,
            result = this.results[wrapperId];
            target = result['target'],
            holder = this.getHolderByWrapper(wrapper);
                  
            wrapper.removeClass(SUCCEED_CLASS).removeClass(FAILED_CLASS).removeClass(REQUIRED_FAILED_CLASS);
            switch(result['result']) {
                case 'succeed':
                    wrapper.addClass(SUCCEED_CLASS);
                    break;
                case 'failed':
                    wrapper.addClass(FAILED_CLASS);
					
                    //失去焦点时，当前校验字段报错
                    Y.one('#' + target).addClass(ERROR_CLASS);
                    if( focusOnBlur && result['ruleType'] === 'required' ) {
                        wrapper.addClass(REQUIRED_FAILED_CLASS);
                    }
					
                    break;
                case 'default':
                default:
                    break;
            }

            holder.setContent(result['message']);
            
            return result['result'];
        },
        
        disable : function(controlId) {
            var rules = this.rules,
                i, rule;
            for(i in rules) {
                rule = rules[i];
                if( rule.element === controlId ) {
                    rule.enabled = false;
                }
            }
        },
        
        enable : function(controlId) {
            var rules = this.rules,
                i, rule;
            for(i in rules) {
                rule = rules[i];
                if( rule.element === controlId ) {
                    rule.enabled = true;
                }
            }
        },
                
        showErrors : function(errors) {
            var controlName;
            for( controlName in errors) {
                this.showError(controlName, errors[controlName]);
            }
        },
        
        showError : function(controlName, error) {
            var control = this.form.one('[name=\"' + controlName + '\"]'), 
                unifiedOutput = this.get('unifiedOutput'), 
                unifiedActived = this.get('unifiedActived'), 
                unifiedContainer;

            if( L.isNull(control) ) {
                throw new TypeError('Undefined name ' + controlName + ' for showError()');
            }
            
            var wrapper = control.ancestor(WRAPPER_SELECTOR),
                holder = this.getHolderByWrapper(wrapper);
            
            wrapper.addClass(FAILED_CLASS);
			
            //后端校验时，当前校验字段报错
            control.addClass(ERROR_CLASS);
			
            holder.setContent(error);
            
            if( unifiedOutput ) {
                unifiedContainer = Y.one( this.get('unifiedContainer') );
                
                if( !!unifiedContainer ) {
                    unifiedContainer.set('innerHTML', error);
                    
                    if( !unifiedContainer.hasClass(unifiedActived) ) {
                        unifiedContainer.addClass(unifiedActived)
                    }
                }
            }
        } // eof showError
     
    });
    
    // 最后一个参数用来控制是否输出
    function log(c, t) {
    
        if( L.isNull(t) ) {
            t = 'info';
        }
        
        if( 'info'  === t && !ENABLE_LOG_INFO  ) return;
        if( 'warn'  === t && !ENABLE_LOG_WARN  ) return;
        if( 'error' === t && !ENABLE_LOG_ERROR ) return;
        if( 'time'  === t && !ENABLE_LOG_TIME  ) return;
        
        Y.log(L.isString(c) ? c : (L.isFunction(L.dump) ? L.dump(c) : c), t, LOG_SRC, !ENABLE_LOG);
    }
        
}, '1.4.2', { requires : ['base-base', 'node-base'] } );
