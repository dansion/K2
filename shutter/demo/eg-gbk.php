<?php
define('CHARSET','gbk'); //Ĭ��utf-8���������ã�����������Ҫָ��
require_once("../../_assets/demo.php");
?>
<html>
<head>
  <?php echo_html_charset() ?>
  <title>k2-eg</title>
  <meta http-equiv="X-UA-Compatible" content="IE=Edge">
  <?php echo_default_css() ?>
	<style>
		#wrap {
			border:1px solid blue;
			height:250px;
			width:200px;
			overflow:hidden;
		}
		.ul-wrap{
			position:relative;
				
		}
		.ul-wrap li{
			position:absolute;
			overflow:hidden;
		}
		.ul-wrap li p{
			position:absolute;
			bottom:0;
			height:30px;
			background:#fff;
			width:200px;
			border-bottom:1px solid #ccc;
		}
  </style>
</head>
<body>
  <h1>k2-eg</h1>
  <h2>˵��</h2>
  <ol>
    <li>
    <pre class="brush:css">
      .demo{
        property : value;  
      }
    </pre> 
    </li>
    <li>description</li>
  </ol>
  <h2>Code</h2>
  <pre class="brush:javascript;">
YUI().use('k2-eg',function(Y){
  Y.K2eg.method();
});
  </pre>
  <h2>����</h2>
    <table>
      <tr><th>����</th><th>Ĭ��ֵ</th><th>����</th></tr>
      <tr><td>eg</td><td>eg</td><td>eg</td></tr>
    </table>
  <h2>����</h2>
	<div id='wrap'>
		<ul class='ul-wrap'>
			<li><img src='../asset/1.jpg' width='200'  data='{"num":"1","url":"#","text":"���ż�����·��"}'></li>
			<li><img src='../asset/2.jpg' width='200'  data='{"num":"2","url":"#","text":"���ż�����·��"}'></li>
			<li><img src='../asset/3.jpg' width='200'  data='{"num":"3","url":"#","text":"���ż�����·��"}'></li>
			<li><img src='../asset/4.jpg' width='200'  data='{"num":"4","url":"#","text":"���ż�����·��"}'></li>
			<li><img src='../asset/5.jpg' width='200'  data='{"num":"5","url":"#","text":"���ż�����·��"}'></li>
		</ul>
	</div>
<script>
//�����ڿ�������
if(typeof K2_config === 'undefined'){
  var K2_config = {
    noCombine : true,//�Ƿ�ʹ��combo���ܣ�����������֧��combo��Ҫ����minfy��Ĭ��ʹ��
    noCache : true,//�Ƿ���js��css�ļ�β�����������������ֹ��������棬Ĭ��ʹ��
    console : true,//�Ƿ�ʹ��ͨ�õ�console����̨�������Ϳ�����ҳ����ʾY.log���ݣ�Ĭ��ʹ��
                   //ʧЧʱ����鿴��Ӧ��YUIʵ����Ҫʹ��event-custom-baseģ��
    noVersion : true,//�Ƿ�ʹ�ò����汾�ŵ��ļ��������Ϳ���ֱ�ӵ��ñ��ؿ����ļ�����Ϊ��Щ�ļ����ǲ����汾�ŵģ�Ĭ��ʹ��
    syntaxHighlight : true,//�Ƿ��ʽ��������ʾ��Ĭ��ʹ��
    local : true //�Ƿ�ʹ�ñ���·����������/k2/seed/seed.js�����ľ���·����������������ʲô��������������ʹ�ã�
                 //����ʹ������http://k.kbcdn.com/k2/seed/seed.js�����ľ���·����Ĭ��ʹ��
  }  
}
</script>
<?php echo_default_js(); ?>
<script>
YUI({
  modules : {
    'shutter' : {
      fullpath : '/k2/shutter/shutter.js',
      requires : ['node','json','anim']    
    }
  }  
}).use('shutter',function(Y){
  Y.log('success','info','shutter');
	new Y.Shutter();
});
</script>
</body>
</html>
