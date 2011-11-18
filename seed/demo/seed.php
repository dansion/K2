<?php
//define('CHARSET','gbk'); //默认utf-8，无需设置，其他编码需要指定
require_once("../../_assets/demo.php");
?>
<html>
<head>
  <?php echo_html_charset() ?>
  <title>K2:seed</title>
  <?php echo_default_css() ?>
  <style>
  </style>
</head>
<body>
  <h1>K2:seed</h1>
  <h2>说明</h2>
  <p>基于<a href="http://developer.yahoo.com/yui/3/">YUI3.3.0</a>，包含了<a href="http://developer.yahoo.com/yui/3/yui/#core">YUI Core(yui-min.js与loader-min.js)</a>和配置后的YUI_config。</p>
  <p>同时基于k.kbcdn.com上Minify的部署，修改了Combo的方式, 默认状态支持combo即<code>combine:true</code>。</p>
  <p><a href="all.php">查看所有组件文件是否上传到CDN</a></p>
  <h2>Loader & 使用方式</h2>
  <p>首页在页面尾部嵌入&lt;script src="http://k.kbcdn.com/k2/seed/seed-x-x-x.js"&gt;&lt;/script&gt;，然后3种使用场景：</p>
  <ol>
  <li>
<pre class="brush:javascript;">
YUI().use('event-custom-base',function(Y)){
  Y.log('success','info','seed');  
}
</pre>  
  </li>
  <li>
<pre class="brush:javascript;">
YUI({
  modules:{
    json : {
      fullpath :'http://www.json.org/json_parse.js'  
    }    
    'json-data' : {
      fullpath :'http://www.json.org/json_parse_data.js',
      require:['json']  
    }    
  },
  groups:{
    yui2:{
      root:'yui/2.8.2r1/',
      modules:{
        yui2_dom_event:{
          path:'yahoo-dom-event/yahoo-dom-event-2-3-1.js'  
        }  
      }  
    },
    k2:{
      //combine:false, //如果不支持combine且又没有fullpath，需要设置
      root:'k2/',
      modules:{
        'break-word':{
          path:'break-word/break-word-1-0-0.js',
          requires:['node-base','node-style']  
        }  
      }  
    }  
  }
}).use('break-word','json',function(Y)){
  Y.log('load break-word and josn modules successfully','info','seed');  
}
</pre>  
  </li>
  <li>
<pre class="brush:javascript;">
var K2HP = new YUI({
  groups:{
    yui2:{
      root:'yui/2.8.2r1/',
      modules:{
        yui2_dom_event:{
          path:'yahoo-dom-event/yahoo-dom-event-2-3-1.js'  
        }  
      }  
    },
    k2:{
      root:'k2/',
      modules:{
        'break-word':{
          path:'break-word/break-word-1-0-0.js',
          requires:['node-base','node-style']  
        }  
      }  
    }  
  }
});
K2HP.use('node','break-word','yui2_dom_event',function(K){
  K.log('K2HP is right','info','K2HP');    
});
</pre>  
  </li>
  </ol>
  <h2>禁止YUI加载默认样式的方法</h2>
  <p>通过设置{skinnable:false}来阻止YUI加载对应的样式，但支持直接使用YUI的默认样式，<a href="skin.html"更多请看。</a></p>
  <pre class="brush:javascript">
  YUI({
    skinnable:false
  }).use('autocomplete',function(Y){
    //coding  
  });
  </pre>
  <h2 id="YUI_config">YUI_config</h2>
  <pre class="brush:javascript;">
if (typeof YUI_config === 'undefined'){
  var YUI_config = {
    root : 'yui/3.3.0/',
    comboBase : 'http://k.kbcdn.com/min/f=',
    groups:{
      yui2:{
        root:'yui/2.8.2r1/',
        modules:{
          yui2_dom_event:{
            path:'yahoo-dom-event/yahoo-dom-event-2-3-1.js'  
          }  
        }  
      },
      K2:{
        root:'k2/',
        modules:{
          'break-word':{
            path:'break-word/break-word-1-0-0.js',
            requires:['node-base','node-style']  
          }  
        }  
      }  
    }
  };  
}
  </pre>
<h2>Y.UA.ie测试</h2>
<p id="Y-UA-ie"></p>
<script>
//仅用于开发环境
if(typeof K2_config === 'undefined'){
  var K2_config = {
    noCombine : true,//是否使用combo功能，开发环境下支持combo需要配置minfy，默认使用
    noCache : true,//是否在js或css文件尾部增加随机函数来防止浏览器缓存，默认使用
    console : true,//是否使用通用的console控制台，这样就可以在页面显示Y.log内容，默认使用
    noVersion : true,//是否使用不带版本号的文件，这样就可以直接调用本地开发文件，因为这些文件都是不带版本号的，默认使用
    syntaxHighlight : true,//是否格式化代码显示，默认使用
    local : false //是否使用本地路径，即类似/k2/seed/seed.js这样的绝对路径，这样无论你是什么本地域名都可以使用，
                 //否则使用类似http://k.kbcdn.com/k2/seed/seed.js这样的绝对路径，默认使用
  }  
}
</script>
<?php
//应用组建是指跨2个产品以上的和产品直接相关的组建，比如点评，留言板等
//应用组建的模块信息是通过特定的CMS来管理的，使用该模块时需要在页面上引入对应的jsp文件
//此处定义应用应用组建的模块信息，会直接注入到全局变量中
//命名方式请采用app + 模块名的方式，防止冲突和覆盖
$app_config = '';
/*
//如果在修改时报错，请确定KB_APP_Config后面是否有空格
$app_config = <<< KB_APP_Config
<script>
if(YUI_config.groups){
  YUI_config.groups.appDianPing = {
     root :'k2/',
     modules:{
       'app-dianping':{
         path : 'ww/ww-1-0-0.js',
         requires : ['node-base','node-event-delegate','stylesheet']  
       }  
     }  
  };  
}
</script>
KB_APP_Config;
*/
echo_default_js($app_config);
?>
<script>
YUI().use('node-base',function(Y){
  var ieInfo = 'Y.UA.ie = ' + Y.UA.ie;
  Y.log('seed init success','info','seed demo');
  Y.log(ieInfo,'info','seed demo');
  Y.one('#Y-UA-ie').append(ieInfo);
});
</script>
</body>
</html>
