<?php
define('CHARSET','gbk'); //Ĭ��utf-8���������ã�����������Ҫָ��
require_once("../../_assets/demo.php");
?>
<html>
<head>
  <?php echo_html_charset() ?>
  <title>����</title>
  <?php echo_default_css() ?>
  <!--style>
  .k2-ww{
    display:-moz-inline-stack; 
    display:inline-block;  
    *display:inline;
    zoom:1;
    position:relative;//Firefox�²��ɱ�������⣬��ͷȷ��һ��Firefox3�Ƿ񻹴���
    *position:static;//��һ�䵼��IE6�µ�bug
    height:20px;
    width:67px;
    background:url(http://a.tbcdn.cn/sys/wangwang/wangwang_v2.gif) no-repeat 0 -20px;
    vertical-align:middle;
    cursor:pointer;
    text-indent:-9999px;
    font-size:12px;
  }
  .k2-ww-small{
    width:20px;
    background-position:-82px -20px;  
  }
  .k2-ww-online{
    background-position:0 0; 
  }
  .k2-ww-mobile{
    background-position:0 -40px; 
  }
  .k2-ww-small.k2-ww-online{
    background-position:-82px 0px; 
  }
  .k2-ww-small.k2-ww-mobile{
    background-position:-82px -40px; 
  }
  </style-->
</head>
<body>
  <h1>����</h1>
  <h2>˵��</h2>
  <p>ͨ������ICON����ʾָ���Ա�id�����ߡ����ߺ��ƶ����ߵ�״̬��������IE��ͨ����������ܼ�����Ѱ�װ���������н��������û�а�װ����������أ��ڷ�IE����������Web������</p><p>�뿴<a href="ww.php">UTF-8�汾</a></p>
  <!--
<a href="http://webwwtb.im.alisoft.com/wangwang/ww1.htm?t=1271304897746&amp;uid=&amp;tid=%u7231%u6155%u5B98%u65B9%u65D7%u8230%u5E97" target="_blank" class="ww-online ww-large ww-inline" title="��˿���ֱ�Ӻ����� ����ѡ�õı��������໥�����������飬��֧��������Ƶ�ޡ�">��������</a>
-->
  <ol>
    <li>С��<span class="k2-ww" data-wwid="С��" title="ͨ���Ա�������С����н�����"></span></li>
    <li>���ߣ�<span class="k2-ww" data-wwid="����" title="fdafsdafdsafsda"></span></li>
    <li>Ԫ�죺<span class="k2-ww" data-wwid="Ԫ��" title="fdafsdafdsafsda"></span></li>
    <li>����<span class="k2-ww k2-ww-small" data-wwid="����" title="fdafsdafdsafsda"></span></li>
    <li>չ�ף�<span class="k2-ww k2-ww-small" data-wwid="Բ��" title="fdafsdafdsafsda"></span></li>
    <li>�����鷽��<span class="k2-ww" data-wwid="�����鷽" title="fdafdafasd"></span></li>
    <li>������<span class="k2-ww k2-ww-small" data-wwid="����" title="fdafsdafdsafsda"></span></li>
  </ol>
  <h2>Code</h2>
  <ol>
  <li>
����Ҫʹ��������Ƶĵط���������Ĵ��룬�����ú�����id��<strong>��ע��ʹ��span��ǩ������a��ǩ�������href�Ĵ�������߿�����</strong>
<pre class="brush:xml;">
&lt;span class="k2-ww" data-wwid="����"&gt;&lt;/span&gt;
</pre> 
</li>
<li>
��ҳβ�����·�������
<pre class="brush:javascript;">
YUI().use('k2-ww',function(Y){
  Y.Ww.light();
});
</pre>
</li>
</ol>
  <h2>����</h2>
<pre class="brush:javascript;">
YUI().use('k2-ww',function(Y){
  Y.Ww.light(ancestor);
});
</pre>
    <table>
      <tr><th>����</th><th>ֵ</th><th>����</th></tr>
      <tr><td>ancestor</td><td>String��ѡ����� | Y.Node | Y.NoeList | HTMLElement</td><td>����ָ��λ�õ������ڵ�</td></tr>
    </table>
  <h2>����</h2>
  <div id="k2-ww-eg"></div>
<script>
//�����ڿ�������
if(typeof K2_config === 'undefined'){
  var K2_config = {
    noCombine : true,//�Ƿ�ʹ��combo���ܣ�����������֧��combo��Ҫ����minfy��Ĭ��ʹ��
    noCache : true,//�Ƿ���js��css�ļ�β�����������������ֹ��������棬Ĭ��ʹ��
    console : true,//�Ƿ�ʹ��ͨ�õ�console����̨�������Ϳ�����ҳ����ʾY.log���ݣ�Ĭ��ʹ��
                   //ʧЧʱ����鿴��Ӧ��YUIʵ����Ҫʹ��event-custom-baseģ��
    noVersion : true,//�Ƿ�ʹ�ò����汾�ŵ��ļ��������Ϳ���ֱ�ӵ��ñ��ؿ����ļ�����Ϊ��Щ�ļ����ǲ����汾�ŵģ�Ĭ��ʹ��
    syntaxHighlight : false,//�Ƿ��ʽ��������ʾ��Ĭ��ʹ��
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
  /*
  modules : {
    'ww' : {
      fullpath : '/k2/ww/ww.js',
      requires : ['node-base','node-event-delegate','stylesheet']    
    }
  }  
  */
}).use('k2-ww',function(Y){
  //Ĭ��ʹ��
  Y.Ww.light();
  Y.log('Y.Ww.light() Success!','info','k2-ww');

  //ʹ��ָ��ѡ���
  Y.one('#k2-ww-eg').append('<h3>ʹ��ѡ���ָ��</h3><ol id="k2-ww-eg1">' + 
                            '<li>���飺<span class="k2-ww" data-wwid="����"></span></li>' + 
                            '<li>��代�<span class="k2-ww" data-wwid="���"></span></li>' + 
                            '<li>���飺<span class="k2-ww k2-ww-small" data-wwid="����"></span></li>' + 
                            '<li>���壺<span class="k2-ww k2-ww-small" data-wwid="����"></span></li>' + 
                            '</ol>');
  Y.Ww.light('#k2-ww-eg1');
  Y.log('Y.Ww.light("#k2-ww-eg1")ִ�гɹ���������ͨ��ָ��ѡ���������ɸѡ����','info','k2-ww');

  //ʹ��NodeListָ�� 
  Y.one('#k2-ww-eg').append('<h3>ʹ��ѡ���ָ��</h3><ol>' + 
                            '<li class="k2-ww-eg-2">���壺<span class="k2-ww" data-wwid="����"></span></li>' + 
                            '<li class="k2-ww-eg-2">��代�<span class="k2-ww" data-wwid="���"></span></li>' + 
                            '<li class="k2-ww-eg-2">���飺<span class="k2-ww k2-ww-small" data-wwid="����"></span></li>' + 
                            '<li class="k2-ww-eg-2">���壺<span class="k2-ww k2-ww-small" data-wwid="����"></span></li>' + 
                            '</ol>');
  Y.Ww.light(Y.all('.k2-ww-eg-2'));
  Y.log('Y.Ww.light(Y.all(".k2-ww-eg-2"));ִ�гɹ���������ͨ��NodeList������ɸѡ����','info','k2-ww');
});
</script>
</body>
</html>
