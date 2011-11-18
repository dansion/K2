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
  <p>...</p> 
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
<?php
//Ӧ���齨��ָ��2����Ʒ���ϵĺͲ�Ʒֱ����ص��齨��������������԰��
//Ӧ���齨��ģ����Ϣ��ͨ���ض���CMS������ģ�ʹ�ø�ģ��ʱ��Ҫ��ҳ���������Ӧ��jsp�ļ�
//�˴�����Ӧ��Ӧ���齨��ģ����Ϣ����ֱ��ע�뵽ȫ�ֱ�����
//������ʽ�����app + ģ�����ķ�ʽ����ֹ��ͻ�͸���
$app_config = '';
/*
//������޸�ʱ������ȷ��KB_APP_Config�����Ƿ��пո�
$app_config = <<< KB_APP_Config
<script>
if(YUI_config.groups){
  YUI_config.groups.appDianPing = {
     combine: true,
     base :'http://k.kbcdn.com/k2',
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
YUI({
  modules : {
    'k2-eg' : {
      fullpath : '/k2/_example/eg.js',
      requires : ['k2-eg-css','event-custom-base']    
    },
    'k2-eg-css' : {
      fullpath : '/k2/_example/assets/eg.css',
      type : 'css'
    }   
  }  
}).use('k2-eg',function(Y){
  Y.log('success','info','k2-eg');
});
</script>
</body>
</html>
