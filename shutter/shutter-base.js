/*
 * @revision:
 */
/*
 * @author:wulong@taobao.com
 * @version:1-0-5
 */

YUI.add('k2-shutter-base',function(Y){
	function ShutterBase() {
		ShutterBase.superclass.constructor.apply(this, arguments);
	};

	ShutterBase.NAME = 'shutter-base';

	ShutterBase.ATTRS = {
		'time' :{
			value: 3,
			setter : function(val){
				return val * 1000 ;
			}
		},
		'speed' :{
			value : 1,
			setter : function(val){
				return val;
			}
		},
		'direction':{
			value : 'Top',
			setter :function(val){
				return val;
			}
		},

		'id' : {
			value : '#wrap',
			setter : function(val){
				return "#" + val; 				
			}
		},
		'lh' : {
			value : '15',
			seeter : function(val)	{
				return val;
			}			
		},
		'tempArray' :　{
			value : [],
			getter : function(val){
				return this.get('tempArray')[val];
			}
		}
	};	
	Y.extend(ShutterBase,Y.Base,{
		sliding : false,
		pause : false,
		timer : null,
		
		initializer : function(){
			this._addEvent();
		},
		_addEvent : function(){
			Y.on('mouseover',function(){
					this.clear();
				},this.get('id'),this);
			Y.on('mouseout',function(){
					this.autoPlay();
				},this.get('id'),this);
		},
		_changeState : function(node){
			Y.one(this.get('id') + ' .show').replaceClass('show','hidden');
			node.replaceClass('hidden','show');		
		},
		toggle : function(e){
			Y.log('frome base');
		},
		play : function(i){
				var that = this,
				w = Y.one(that.get('id')),
				d = that.get('direction'),
				t=[];
				w.set('scroll' + d , w.get('scroll'+d ) + that.get('speed'));
				if(that.runTime && w.get('scroll' + d ) % that.get('lh') < that.get('speed')){
						that.runTime.cancel();
						w.set('scroll' + d, 0);
						w.one('ul').append(w.one('li'));
				}
		},
		run : function(){
			this.runTime && this.runTime.cancel();
			this.runTime = Y.later(10,this,'play',{},true);
		},					 
		autoPlay : function(){
			this.clear();
			this.timer = Y.later(this.get('time'),this,'run',{},true);
		},
		clear : function(){
			this.timer && this.timer.cancel();
		}
	});
	Y.ShutterBase = ShutterBase; 
},'1.0.2',{requires:['base-base','node-base']});
