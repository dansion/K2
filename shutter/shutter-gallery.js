/*
 * @revision:
 */
/*
 * @author:wulong@taobao.com
 * @version:1-0-10
 */

YUI.add('k2-shutter-gallery',function(Y){

  Y.log('done','info','shuttergallery');

	function ShutterGallery() {
		ShutterGallery.superclass.constructor.apply(this, arguments);
	};

	ShutterGallery.NAME = 'shutter-gallery';

	ShutterGallery.ATTRS = {
		'delay' : {
			value : 100
		},
		'speed' :{
			value: 0.5
		},
		'easing_in' : { 
			value: {
					from: { opacity: 0.4},
					to: { opacity: 0 }
			}
		},
		'easing_out' : { 
			value: {
					from: {opacity: 0},
					to: { opacity: 0.4 }
			}
		},
	 	'easing' : {
			value : Y.Easing.easeOut
		},
		'skip' : {
			value : false
		},
		'text' : {
			value : true
		}	
	};

	Y.extend(ShutterGallery,Y.ShutterBase,{
		currentNode : null,	
		pause : false,
		initializer : function(){
			var ie = Y.UA.ie;					
			this._createToggle();
			if(!ie || ie > 7){
				!this.get('skip') && this._playImg();
			}
		},
		_getAllLi : function(){
			return Y.all(this.get('id') + " li");
		},
		_getNum : function(){
			return Y.all(this.get('id') + " li").size();
		},
		_getLiWidth : function(){
			return Y.one(this.get('id') + " li").get('clientWidth');
		},
		_createToggle : function(){
			Y.all(this.get('id') + " li").each(function(i){
				var oProperty = i.one('img').getAttribute('data') ? Y.JSON.parse(i.one('img').getAttribute('data')) : "" ,
			    	oParent = i.ancestor("li"),html='';
				Y.log(oProperty);
				html+= oProperty && oProperty.text ? '<p><a>' + oProperty.text + '</a></p><div class="bg-wrap"><p class="bg"></p></div><p class="bg-2"></p>' : "";
				html+= '<div class="mark"></div>';
				i.insert(i.create(html),'int');
			},this);
		},		
/*		
		_createMark : function(){
			Y.all(this.get('id') + " li img").each(function(i){
				var oParent = i.ancestor("li"); 
				oMark = i.create('');
				oParent.insertBefore(oMark,i);
			},this);						
		},
*/		
		_findChild : function(){
			return Y.all(this.get('id') + " ul li");
		},
		_changeState : function(){
										 
		},						 
		_addEvent : function(){
			var timerUl,
					timerLi,
					oAnim
			/*			
			Y.on('mouseover',function(e){timer = setTimeout(function(){return function(){that.toggle(e);}()},100)},this.get("id") + " .ul-wrap li",this);
			Y.on('mouseout',function(e){timer&&clearTimeout(timer);},this.get("id") + " .ul-wrap li",this);
			*/
			Y.on('mouseover',function(e){
					//oAnim && oAnim.stop();
					var node = e.target.ancestor("li")||e.target;
					try{
						if(node.get('className')=='show'){
							return ;
						}
					}catch(err){
						Y.log(e.target);
					}
					e.stopPropagation();
					timerLi = Y.later(this.get('delay'),this,function(){
						this._findChild().each(function(n){
							//if(n.get('className')!='show'){
								n.set('className','hidden');
								this._playOut(n); 
							//}
					},this);

					node.set('className','show')
					this._playIn(node);


					},{},false);
			},this.get("id") + " ul li",this);

			Y.on('mouseout',function(e){
					timerUl && timerUl.cancel();
					timerLi && timerLi.cancel();
			},this.get("id")+ " ul li",this);
			
			Y.on('mouseout',function(e){
				timerUl = Y.later(this.get('delay'),this,function(){
					var retarget = e.relatedTarget && e.relatedTarget.ancestor("ul");
					if(retarget != e.target.ancestor("ul")){
							this._findChild().each(function(n){
								if(n.get('className')=='show'){
									n.set('className','');
									oAnim = this._playIn(n,function(){},true);
								}else{
									n.set('className','');
									this._playIn(n,function(){},true); 
								}
								//n.set('className','');
							},this);
					}
				},this);
			},this.get("id") + " ul",this);
			
			Y.on('mouseover',function(e){
				timerUl && timerUl.cancel();
				timerLi && timerLi.cancel();
			},this.get("id") + " ul",this);

			/*
			Y.on('click',function(e){
				  e.preventDefault();	
					window.open(e.target.ancestor('li').one('a').get("href"));
			},this.get('id')+ " li")
			*/
		},
		/*						
		toggle : function(e){
			var relatedTargetLi = Y.one(this.get("id") + " .show");				 
			var targetLi = e.target.ancestor("li");
			this.currentNode = targetLi;
			if(!this.sliding && targetLi.get('className')!='show'){
				this._changeState(targetLi);
				this._play(targetLi,'easing_in');
				relatedTargetLi.one('.bg').setStyle('background','#0097f7');
				this._play(relatedTargetLi,'easing_out');
			}
		},
		*/
		_playImg : function(){
			Y.all(this.get('id') + " .mark").each(function(n){
					//Y.later(500,this,function(){
						new Y.Anim({
							node : n,
							from : this.get('easing_in').from,
							to : this.get('easing_in').to,
							duration : this.get('speed')/2
						}).run();
					//},{},false);
			},this);					
		},				 
		_playIn : function(node,fn,isOutUl){
			var fn = fn || function(){},
          ie = Y.UA.ie,					
					nLiWidth = this._getLiWidth(),
					myAnim = new Y.Anim({
						node : node.one('.mark'),
						from : {opacity: node.one('.mark').getStyle('opacity')},
						to :  this.get('easing_in').to,
						duration : this.get('speed')
			});
			myAnim.run().on('end',fn);
			if(!isOutUl && this.get('text')){
				if(!ie || ie > 7){ 
					new Y.Anim({
									node : node.one('.bg'),
									from : {width :  0 },
									to : {width :   nLiWidth } ,
									duration :  this.get('speed') ,
									easing : Y.Easing.easeOutStrong
					}).run();
				}
			}
			return myAnim
		},				
		_playOut : function(node,e){
			var myAnim = new Y.Anim({
						node : node.one('.mark'),
						from : {opacity: node.one('.mark').getStyle('opacity')},
						to :  this.get('easing_out').to,
						duration : this.get('speed'),
						easing : this.get('easing')
			});
			myAnim.run();
			/*
			var retarget = e && e.relatedTarget.ancestor("ul");
			if(retarget == node.ancestor("ul")){
				var nLiWidth = this._getLiWidth();
				var titleAnim = new Y.Anim({
							node : node.one('.bg'),
							from : {width :  nLiWidth },
							to : {width :  0 },
							duration :  this.get('speed') / 2,
							easing : Y.Easing.easeOutStrong
				}).run();		
				titleAnim.on('end',function(){
					titleAnim.destroy();	
				});
				return titleAnim;		
			}
			//*/
			return myAnim
		},
		run : function(){
			
		}
	});
	Y.ShutterGallery = ShutterGallery; 
},'1.0.10',{requires:['k2-shutter-base','json-parse','anim-base','anim-easing']});
