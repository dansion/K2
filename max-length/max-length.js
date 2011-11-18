/*!
 * Copyright koubei.com All rights reserved.
 * max-length js
 * @file max-length.js
 * @author <a href="mailto:zhengle.zl@taobao.com">zhengle</a>
 * @revision:
 * @version:1-0-0
 */
YUI.add("k2-max-length",function(Y){
    var MaxLength = function(){
        MaxLength.superclass.constructor.apply(this, arguments);
    }
    Y.extend(MaxLength, Y.Base,{
        _nodes:null,
        _maxLength:0,
        _fnLengthChanged:null,
        _fnOver:null,
        _chineseAsDouble:false,
        initializer:function(options){
            options = options||{};
            this._nodes = Y.all(options.node);       
            this._maxLength = options.maxLength || 0;
            this._fnLengthChanged = options.onLengthChanged;
            this._fnOver = options.onOver;
            this._chineseAsDouble = options.chineseAsDouble || false;
            this._listenChanged();
        },
        _listenChanged: function(){
            var owner = this;
            this._nodes.each(function(node){            
                var ele = node._node;                    
                node.setData("preValue",node.get("value"));                
                setInterval(function(){
                    owner.onLengthChange(node);
                },100);
            });
        },
        /*
        _listenChanged2: function(){
            var owner = this;
            this._nodes.each(function(node){
                var ele = node._node;
                owner.onLengthChange(node);
                node.setData("preValue",node.get("value"));
                if(ele.addEventListener){
                    ele.addEventListener("input",function(){
                        setTimeout(function(){
                            owner.onLengthChange(node);
                        },10);
                    },false);
                } else if(ele.attachEvent){
                    ele.attachEvent("onpropertychange",function(){
                        setTimeout(function(){
                            owner.onLengthChange(node);
                        },10);
                    });
                }
            });
        },
        */
        onLengthChange:function(node){
            var value = node.get("value"),
                length = MaxLength.getLength(value,this._chineseAsDouble),
                preValue = node.getData("preValue"),
                preLength = MaxLength.getLength(preValue,this._chineseAsDouble),
                params = {
                    node:node,
                    value:value,
                    length:length,
                    preValue: preValue,
                    preLength:preLength,
                    maxLength:this._maxLength
                },
                isRunNext = true;
                
            if(length > this._maxLength && this._fnOver){
                isRunNext = (this._fnOver(params) === true);
            }
            if(this._fnLengthChanged){
                this._fnLengthChanged(params);
            }
            if(isRunNext){
                node.setData("preValue",value);
            }
        }
    },{
        ATTRS:{},
        NAME: "MaxLength",
        regChina : /[^\x00-\x80]/g,
        getLength:function(txt,chineseAsDouble){
            if(txt && txt !== ""){
                txt += "";
                if(chineseAsDouble){
                    var match = txt.match(MaxLength.regChina);
                    return txt.length + (match?match.length : 0);
                } else {
                    return txt.length;
                }
            }
            return 0;
        },
        init:function(options){
            return new MaxLength(options);
        }
    });
    Y.k2maxlength = MaxLength;
},"1.0.0",{requires:['base-base','node-base','event-base']});