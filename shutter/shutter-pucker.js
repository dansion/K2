/*!
 * @revision:
 */
/*
 * @author:wulong@taobao.com
 * @version:1-0-4
 */

YUI.add('k2-shutter-pucker',function(Y){

  Y.log('done','info','shutter-pucker');

	function ShutterPucker() {
		ShutterPucker.superclass.constructor.apply(this, arguments);
	};

	ShutterPucker.NAME = 'shutter-pucker';

	ShutterPucker.ATTRS = {
		'auto' : {
			value : true
		},
		'event' : {
			value : 'click'
		}
	};

	Y.extend(ShutterPucker,Y.ShutterBase,{
		cache : null,
		aNode : null,
		sliding : false,
		pause : false,
		timer : null,
		initializer : function(){
			this._createToggle();
			this.cache = Y.cached(this._anim);
			if(this.get('auto')){
				this.autoPlay();
			}
		},
		_createToggle : function(){
			var aLis = Y.all(this.get('id') + " li");
			var nCount = aLis.size();
			Y.all(this.get('id') + " li img").each(function(i){
				var oProperty = Y.JSON.parse(i.getAttribute('data')) ,
			    	oParent = i.ancestor("li"),
					 	nIndex = aLis.indexOf(oParent),
						toggleHeight;
				if(nIndex==0){
					oParent.addClass('show');
				}else{
					oParent.addClass('hidden');
				}
				
				oParent.insertBefore(i.create('<p><a href="' +oProperty.url +'">' +oProperty.text+'</a></p>'),i);
				oParent.insertBefore(i.create('<p class="bg"></p>'),i);
				toggleHeight = Y.one(this.get('id') + ' .bg').get('clientHeight');
				oParent.setStyles({
					'top':nIndex * toggleHeight+"px",
					'zIndex':nCount-nIndex,
					'height':Y.one(this.get('id')).get('clientHeight') - nCount * toggleHeight + toggleHeight + 'px'
				});


			},this);
			
		},							
		_findChild : function(n,flag){
			if(flag == -1){
				if(n.previous("li")&&n.previous("li").getAttribute('hiddened')!=1){
					aNode.push(n.previous("li"));
					this._findChild(n.previous("li"),-1);
				}
			}else if(flag == 1){
				aNode.push(n);
				if(n.get("className")=='show'){
					return this.aNode
				}
				if(n.next("li")&&n.next("li").getAttribute('hiddened')==1){
					aNode.push(n.next("li"));
					this._findChild(n.next("li"),1);
				}
			}else{
				Y.log('error')
			}
			return aNode;
		},						 
		_addEvent : function(){
			
			Y.on("mouseover",function(e){
			 this.timer =	Y.later(200,this,function(){this.toggle(e)},{},true);
			},this.get('id') + " ul li p",this);

			Y.on("mouseout",function(e){
				this.timer&&this.timer.cancel();
			},this.get('id') + " ul li p",this);

			Y.on("click",function(e){
				e.preventDefault();	
				window.open(e.target.ancestor('li').one('a').get("href"));
			},this.get('id') + " li")
		},
		toggle : function(e){
			var oLi = e.target.ancestor("li");
			if(!this.sliding && oLi.get('className')!='show'){
				aNode = [];
				var flag = oLi.getAttribute('hiddened')!='1'?-1:1;
				var aNodeList = this._findChild(oLi,flag);
				for(var i=0,j=aNodeList.length;i<j;i++){
					this.play(aNodeList[i],flag,true);
					aNodeList[i].setAttribute('hiddened',flag==-1?1:-1);
					aNodeList[i].set('className',flag==-1?'hiddened':'hidden');
				}
				aNodeList = null;
				this._changeState(oLi,flag);
				this.clear();
				if(this.get('auto')){
					//Y.later(this.get('time'),this,'autoPlay');
					this.autoPlay();
				}
			}
		},
		_changeState : function(node,flag){
			if(flag==-1){							 
				//Y.one(this.get('id') + ' .hidden').replaceClass('show','hidden');
				node.replaceClass('hidden','show');				
			}else{
				Y.one(this.get('id') + ' .show').replaceClass('show','hidden');
				node.replaceClass('hidden','show');				
			}
		},
		_anim : function(node,animCfg,duration){
			var anim = new Y.Anim({
						node : node,
						to : {top:animCfg},
						duration : duration
			});
			return anim
			/*	
			anim.on('end',function(){
					that.sliding = false;
			});
			*/
		},							 
		play : function(node,flag,isCache){
				var that = this;
				this.sliding = true;
				var	toggleHeight = Y.one(this.get('id') + ' .bg').get('clientHeight');
				var animCfg = flag==-1 ? {top : node.get("offsetTop") - node.get("offsetHeight") + toggleHeight}:{top : node.get("offsetTop") + node.get("offsetHeight") - toggleHeight};
				var animCfgTop = flag==-1 ?  node.get("offsetTop") - node.get("offsetHeight") + toggleHeight: node.get("offsetTop") + node.get("offsetHeight") - toggleHeight;
				/*
				var anim = new Y.Anim({
							node : node,
							to : animCfg,
							duration : this.get('speed')
				}).run();
				anim.on('end',function(){
						that.sliding = false;

				});
				*/
				var anim =  this.cache(node,animCfgTop,this.get('speed')) ;
				anim.run();
				anim.on('end',function(){
					that.sliding = false;
				});
		},
		run : function(){
			if(!this.pause&&!this.sliding){						 
				var currentNode = Y.one(this.get('id') + " .ul-wrap .show");
				var targetNode = currentNode.next('li');
			 	//ie 不支持 lastElementChild 
				//firefox,chrome等用lastChild不是text对象
				var lastNode = Y.one(this.get('id') + " .ul-wrap").get('lastElementChild') || Y.one(this.get('id') + " .ul-wrap").get('lastChild');
				if(lastNode != currentNode){
					this.play(Y.one(this.get('id') + " .ul-wrap .show"),-1);	 
					
					currentNode.setAttribute('hiddened',1)				
					currentNode.set('className','hiddened');
					this._changeState(currentNode.next('li'),-1);
				}else{
					var oAllPrevNode = Y.all(this.get('id')+' .hiddened');
					oAllPrevNode.each(function(o){
							this.play(o,1);
							o.setAttribute('hiddened',-1);
							o.set('className','hidden');
					},this);
					currentNode.set('className','hidden');
					this._changeState(oAllPrevNode.item(0),-1);
				}
				currentNode = null;
				targetNode = null;
			}
		},					 
		autoPlay : function(){
			this.clear();
			this.timer = Y.later(this.get('time'),this,'run',{},true);
		},
		clear : function(){
			this.timer&&this.timer.cancel();
		}
	});
	Y.ShutterPucker = ShutterPucker; 
},'1.0.4',{requires:['k2-shutter-base','json-parse','anim-base','anim-easing']});
