/*
 * K2本地开发环境的设置
 * 需要注意的是，由于支持combo和为提升效率而产生的结构限制，以及demo的实现方式，使我们必须使用PHP虚拟环境，比如利用Apache + PHP 
 *	if(typeof K2_config === 'undefined'){
 *	  var K2_config = {
 *	    noCombine : false, //是否使用combo功能，开发环境下支持combo需要配置minfy，默认使用
 *	    noCache : true, //是否在js或css文件尾部增加随机函数来防止浏览器缓存，默认使用
 *	    console : true, //是否使用通用的console控制台，这样就可以在页面显示Y.log内容，默认使用,
 *                      //失效时，请查看对应的YUI实例需要使用event-custom-base模块
 *	    noVersion : true,//是否使用不带版本号的文件，这样就可以直接调用本地开发文件，因为这些文件都是不带版本号的，默认使用
 *      sytaxHighlight : true,//是否格式化代码显示，默认使用
 *      local : true //是否使用本地路径，即类似/k2/seed/seed.js这样的绝对路径，这样无论你是什么本地域名都可以使用，
 *                   //否则使用类似http://k.kbcdn.com/k2/seed/seed.js这样的绝对路径，默认使用
 *	  }  
 *	}
 * @author:sanqi
 */

if(typeof K2_config === 'undefined') {
    var K2_config = {
    
        // 是否使用combo功能，开发环境下支持combo需要配置minfy，默认使用
        noCombine : true,
        
        // 是否在js或css文件尾部增加随机函数来防止浏览器缓存，默认使用
        noCache : true,
        
        // 是否使用通用的console控制台，这样就可以在页面显示Y.log内容，默认使用
        // 失效时，请查看对应的YUI实例需要使用event-custom-base模块
        console : false,
        
        // 是否使用不带版本号的文件，这样就可以直接调用本地开发文件，因为这些文件都是不带版本号的，默认使用
        noVersion : true,
        
        // 是否格式化代码显示，默认使用
        syntaxHighlight : true,
        
        // 是否使用本地路径，即类似/k2/seed/seed.js这样的绝对路径，这样无论你是什么本地域名都可以使用，
        // 否则使用类似http://k.kbcdn.com/k2/seed/seed.js这样的绝对路径，默认使用
        local : true 
    };
}

if(K2_config){

//noCache{{{
//通过重载Y.Get实现
if(K2_config.noCache){
YUI.add("get",function(f){var b=f.UA,a=f.Lang,d="text/javascript",e="text/css",c="stylesheet";f.Get=function(){var m,n,j,l={},k=0,u,w=function(A,x,B){var y=B||f.config.win,C=y.document,D=C.createElement(A),z;for(z in x){if(x[z]&&x.hasOwnProperty(z)){D.setAttribute(z,x[z]);}}return D;},t=function(y,z,x){var A={id:f.guid(),type:e,rel:c,href:y};if(x){f.mix(A,x);}return w("link",A,z);},s=function(y,z,x){var A={id:f.guid(),type:d};if(x){f.mix(A,x);}A.src=y;return w("script",A,z);},p=function(y,z,x){return{tId:y.tId,win:y.win,data:y.data,nodes:y.nodes,msg:z,statusText:x,purge:function(){n(this.tId);}};},o=function(B,A,x){var y=l[B],z;if(y&&y.onEnd){z=y.context||y;y.onEnd.call(z,p(y,A,x));}},v=function(A,z){var x=l[A],y;if(x.timer){clearTimeout(x.timer);}if(x.onFailure){y=x.context||x;x.onFailure.call(y,p(x,z));}o(A,z,"failure");},i=function(A){var x=l[A],z,y;if(x.timer){clearTimeout(x.timer);}x.finished=true;if(x.aborted){z="transaction "+A+" was aborted";v(A,z);return;}if(x.onSuccess){y=x.context||x;x.onSuccess.call(y,p(x));}o(A,z,"OK");},q=function(z){var x=l[z],y;if(x.onTimeout){y=x.context||x;x.onTimeout.call(y,p(x));}o(z,"timeout","timeout");},h=function(z,C){var y=l[z],B,G,F,D,A,x,H,E;if(y.timer){clearTimeout(y.timer);}if(y.aborted){B="transaction "+z+" was aborted";v(z,B);return;}if(C){y.url.shift();if(y.varName){y.varName.shift();}}else{y.url=(a.isString(y.url))?[y.url]:y.url;if(y.varName){y.varName=(a.isString(y.varName))?[y.varName]:y.varName;}}G=y.win;F=G.document;D=F.getElementsByTagName("head")[0];if(y.url.length===0){i(z);return;}x=y.url[0];if(!x){y.url.shift();return h(z);}if(y.timeout){y.timer=setTimeout(function(){q(z);},y.timeout);}
//if(y.type==="script"){A=s(x,G,y.attributes);}else{A=t(x,G,y.attributes);}
//K2:增加时间戳，要考虑url本身可能存在?号的情况
var k2stamp = function(url,type){
  var stamp = 'k2stamp=' + +new Date() + '.' + type;
  if(url.indexOf('?') > -1){
    url += '&' + stamp;  
  }else{
    url += '?' + stamp; 
  }
  return url;
};
if(y.type==="script"){
  A=s(k2stamp(x,'js'),G,y.attributes);
}else{
  A=t(k2stamp(x,'css'),G,y.attributes);
}
j(y.type,A,z,x,G,y.url.length);y.nodes.push(A);E=y.insertBefore||F.getElementsByTagName("base")[0];if(E){H=m(E,z);if(H){H.parentNode.insertBefore(A,H);}}else{D.appendChild(A);}if((b.webkit||b.gecko)&&y.type==="css"){h(z,x);}},g=function(){if(u){return;}u=true;var x,y;for(x in l){if(l.hasOwnProperty(x)){y=l[x];if(y.autopurge&&y.finished){n(y.tId);delete l[x];}}
}u=false;},r=function(y,x,z){z=z||{};var C="q"+(k++),A,B=z.purgethreshold||f.Get.PURGE_THRESH;if(k%B===0){g();}l[C]=f.merge(z,{tId:C,type:y,url:x,finished:false,nodes:[]});A=l[C];A.win=A.win||f.config.win;A.context=A.context||A;A.autopurge=("autopurge" in A)?A.autopurge:(y==="script")?true:false;A.attributes=A.attributes||{};A.attributes.charset=z.charset||A.attributes.charset||"utf-8";h(C);return{tId:C};};j=function(z,E,D,y,C,B,x){var A=x||h;if(b.ie){E.onreadystatechange=function(){var F=this.readyState;if("loaded"===F||"complete"===F){E.onreadystatechange=null;A(D,y);}};}else{if(b.webkit){if(z==="script"){E.addEventListener("load",function(){A(D,y);});}}else{E.onload=function(){A(D,y);};E.onerror=function(F){v(D,F+": "+y);};}}
};m=function(x,A){var y=l[A],z=(a.isString(x))?y.win.document.getElementById(x):x;if(!z){v(A,"target node not found: "+x);}return z;};n=function(C){var y,A,G,D,H,B,z,F,E,x=l[C];if(x){y=x.nodes;A=y.length;G=x.win.document;D=G.getElementsByTagName("head")[0];E=x.insertBefore||G.getElementsByTagName("base")[0];if(E){H=m(E,C);if(H){D=H.parentNode;}}for(B=0;B<A;B=B+1){z=y[B];if(z.clearAttributes){z.clearAttributes();}else{for(F in z){if(z.hasOwnProperty(F)){delete z[F];}}
}D.removeChild(z);}}x.nodes=[];};return{PURGE_THRESH:20,_finalize:function(x){setTimeout(function(){i(x);},0);},abort:function(y){var z=(a.isString(y))?y:y.tId,x=l[z];if(x){x.aborted=true;}},script:function(x,y){return r("script",x,y);},css:function(x,y){return r("css",x,y);}};}();},"3.3.0",{requires:["yui-base"]});
}
//}}}

//local{{{
//去掉http://k.kbcdn.com，使其能在本地开发环境下浏览
//由于支持combo和特定的结构，所以K2必须位于根目录下
if(K2_config.local){
	(function(){
	  var groups = YUI_config.groups,
	      g,group,
	      del = function(s){
	        return s.replace(/^http:\/\/k.kbcdn.com/,"");  
	      };
	  YUI_config.base = del(YUI_config.base); 
	  YUI_config.comboBase = del(YUI_config.comboBase); 
		for(g in groups){
	    group = groups[g];
	    group.base = del(group.base);
		}
	})();
}
//}}}

//noVersion{{{
if(K2_config.noVersion){
	(function(){
    var groups = YUI_config.groups,
        ms,c,
        t = +new Date();
		for(g in groups){
      ms = groups[g].modules;
		  for(c in ms){
        //干掉js或css文件名中的版本号
        ms[c].path = ms[c].path.replace(/([-_][\d]+[-_][\d]+[-_][\d]+).(css|js)$/,".$2");
		  } 
		}
	})();
}
//}}}

//noCombine{{{
//默认使用combo合并，此处设置combo不生效
if(K2_config.noCombine){
	(function(){
    var groups = YUI_config.groups;
    YUI_config.combine = false;
    for(g in groups){
      groups[g].combine = false;
		}
	})();
}
//}}}

//console {{{
//yui-log
YUI.add("yui-log",function(a){(function(){var d=a,e="yui:log",b="undefined",c={debug:1,info:1,warn:1,error:1};d.log=function(j,s,g,q){var l,p,n,k,o,i=d,r=i.config,h=(i.fire)?i:YUI.Env.globalEvents;if(r.debug){if(g){p=r.logExclude;n=r.logInclude;if(n&&!(g in n)){l=1;}else{if(p&&(g in p)){l=1;}
}}if(!l){if(r.useBrowserConsole){k=(g)?g+": "+j:j;if(i.Lang.isFunction(r.logFn)){r.logFn.call(i,j,s,g);}else{if(typeof console!=b&&console.log){o=(s&&console[s]&&(s in c))?s:"log";console[o](k);}else{if(typeof opera!=b){opera.postError(k);}}
}}if(h&&!q){if(h==i&&(!h.getEvent(e))){h.publish(e,{broadcast:2});}h.fire(e,{msg:j,cat:s,src:g});}
}}return i;};d.message=function(){return d.log.apply(d,arguments);};})();},"3.2.0",{requires:["yui-base"]});
//启用通用信息控制台
if(K2_config.console){
  YUI_config.core.push('yui-log');
	YUI().use('console',function(Y){
	  (new Y.Console({
	    logSource : Y.Global , 
			strings : {
            'title' : 'log',
            'pause' : 'pause',
            'clear' : 'clear',
            'collapse' : 'collapse',
            'expand' : 'expand'
      }

	  })).render();  
	  Y.one('body').addClass('yui3-skin-sam');
	});
}
//}}}

//syntaxHighlight{{{
if(K2_config.syntaxHighlight){
YUI({
  groups : {
    sh : {
	    base : '/k2/_assets/syntaxhighlighter/',    
	    modules : {
	      'sh-core' : {
	        path : 'scripts/shCore.js'      
	      },
	      'sh-style' : {
	        path : 'styles/shCore.css',
	        type : 'css'  
	      },
	      'sh-theme-style' : {
	        path : 'styles/shThemeRDark.css',  
	        type : 'css'  
	      },
	      'sh-as3' : {
	        path : 'scripts/shBrushAS3.js'  
	      },
	      'sh-css' : {
	        path : 'scripts/shBrushCss.js'  
	      },
	      'sh-java' : {
	        path : 'scripts/shBrushJava.js'  
	      },
	      'sh-js' : {
	        path : 'scripts/shBrushJScript.js'  
	      },
		    'sh-xml' : {
		     fullpath : '/k2/_assets/syntaxhighlighter/scripts/shBrushXml.js'  
		    },
	      'sh-php' : {
	        path : 'scripts/shBrushPhp.js'  
	      }    
	    }
    }
  }
}).use('node-base',function(Y){
  Y.all('pre').each(function(el){
    Y.use('sh-style','sh-theme-style','sh-core','sh-as3','sh-css','sh-java','sh-js','sh-php','sh-xml',function(Y){
      //Y.log(SyntaxHighlighter,'info','config.js');
      //Y.log(SyntaxHighlighter.all,'info','config.js');
      //Y.log(SyntaxHighlighter.highlight,'info','config.js');
			SyntaxHighlighter.config.clipboardSwf = '/k2/_assets/syntaxhighlighter/scripts/clipboard.swf';
			//SyntaxHighlighter.all(); //事件绑定上和YUI加载方式有冲突
      SyntaxHighlighter.highlight(el._node);
    });    
  });
});
}
//}}}

//console.debug(YUI_config);
}
