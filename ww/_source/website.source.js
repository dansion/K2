/************************/
/*****������վʹ��*******/
/*****fromSite	  *******/
/*****toSite	  *******/
/*****fromUid	  *******/
/*****ToUid		  *******/
/************************/
var DEFAULT_VERSION = "unknown";

/********  �����ϵ��    ********/
//  addContact()
//gid:����  verify:�Ƿ�Ҫ��֤
function addContact(fromSite,fromUid,toSite,toUid,gid,verify,moreProperties){
	if(fromSite==""){
		fromSite = toSite;
	}
	var command = "";
	var result = checkIMVersion(fromSite+fromUid,toSite,moreProperties);
	if(result=="-1"){
		//alert("\u6ca1\u6709\u5b89\u88c5\u65fa\u65fa!");
	}
	else if(result=="0"){
		if(toSite=="wangwang" || toSite=="cnalimam"){
			if(fromSite="cnalichn"){
				showAlitalkErrMsg(1);
			}else if(fromSite="cntaobao"){
				showWangwangErrMsg(1);
			}
			return;
		}

		if(fromSite=="cntaobao"){
			command = "WangWang:AddContact?uid="+toUid+"&CntSiteId="+toSite+"&SiteLogonedUserId="+fromUid+"&SelfSiteId="+fromSite+"&gid="+gid+"&verify="+verify+getMoreProperties(moreProperties);
			execTaobaoShell(command);
		}else if(fromSite="cnalichn"){
			command = "Alitalk:AddContact?uid="+toUid+"&CntSiteId="+toSite+"&AliLoginID="+fromUid+"&AliLoginsiteid="+fromSite+"&gid="+gid+"&checkcrm="+getMoreProperties(moreProperties);
			location=command;
		}
	}
	else if(result=="1"){
			 command = "aliim:addcontact?uid="+fromSite+fromUid+"&touid="+toSite+toUid+"&gid="+gid+"&verify="+verify+getMoreProperties(moreProperties);
			 execAliimShell(command);
	}
}



/********  ������Ϣ     ********/
/********  sendMsg()     ********/
/***/
function sendClientMsg(fromSite,fromUid,toSite,toUid,imstatus,moreProperties){
	if(fromSite==""){
		fromSite = toSite;
	}
	var result = checkIMVersion(fromSite+fromUid,toSite,moreProperties);
	if(result=="-1"){
		//alert("\u6ca1\u6709\u5b89\u88c5\u65fa\u65fa!");
	}
	else if(result=="0"){
		if(toSite=="wangwang" || toSite=="cnalimam"){
			if(fromSite=="cnalichn"){
				sendMsg("cnalichn",fromUid,toSite,toUid,imstatus,moreProperties);
			}else if(fromSite=="cntaobao"){
				sendMsg("cntaobao",fromUid,toSite,toUid,imstatus,moreProperties);
			}else{
				sendMsg("cnalichn",fromUid,toSite,toUid,imstatus,moreProperties);
			}
			//TODO\u589e\u52a0\u5176\u4ed6\u7ad9\u70b9
			return;
		}
		if(fromSite=="cnkoubei"){
			var koubei = isSupportKouBei();
			if(koubei==1){
				sendMsg("cnalichn",fromUid,toSite,toUid,imstatus,moreProperties);
			}else if(koubei==2){
				sendMsg("cntaobao",fromUid,toSite,toUid,imstatus,moreProperties);
			}else{
				downloadWangWang(fromSite);
			}
		}else{
			if(fromSite!=DEFAULT_VERSION){
				sendMsg(fromSite,fromUid,toSite,toUid,imstatus,moreProperties);
			}else{
				downloadWangWang(fromSite);
			}
		}
	}
	else if(result=="1"){
			sendMsgV6Web(fromSite,fromUid,toSite,toUid,imstatus,moreProperties);
	}
	
}


/****
** 6.0������Ϣ�ӿ�
****/
function sendMsgV6Web(fromSite,fromUid,toSite,toUid,imstatus,moreProperties){
    var command = "";
    if(imstatus == 4){
 		command ="aliim:smssendmsg?uid="+fromSite+fromUid+"&touid="+toSite+toUid+"&suid="+fromUid;
 	}else{
 	    command = "aliim:sendmsg?uid="+fromSite+fromUid+"&touid="+toSite+toUid+"&siteid="+toSite+"&status="+imstatus+getMoreProperties(moreProperties);
 	}
 	execAliimShell(command);
}


/****
**ͨ�÷���Ϣ�ӿ�
**/
function sendMsg(fromSite,fromUid,toSite,toUid,imstatus,moreProperties){//send message
	if(fromSite == "chnyahoo")
	{
		newYahooSendMsg(fromSite,fromUid,toSite,toUid,imstatus,moreProperties);
	}
	else if (fromSite == "cntaobao")
	{
		newWangWangSendMsg(fromSite,fromUid,toSite,toUid,imstatus,moreProperties);
	}
	else if (fromSite == "cnalichn")
	{
		newAlitalkSendMsg(fromSite,fromUid,toSite,toUid,imstatus,moreProperties);
	}
}

/****  for taobao  *****/
function newWangWangSendMsg(fromSite,fromUid,toSite,toUid,imstatus,moreProperties){//wangwang send message
	var bsupport=WangWangVerSupportedSMS("cntaobao"); 
	if(bsupport && imstatus == 4){
 		location.href="wangwang:SendSms?"+toUid+"&tositeid="+toSite+"&suid="+fromUid+"&status="+imstatus+getMoreProperties(moreProperties);
 	}
 	else{	
 		location.href="wangwang:SendIM?uid="+toUid+"&tositeid="+toSite+"&suid="+fromUid+"&status="+imstatus+getMoreProperties(moreProperties);
 	}
}
function newAlitalkSendMsg(fromSite,fromUid,toSite,toUid,imstatus,moreProperties){//alitalk send message
	var bsupport=alitalkVerSupportedSMS("cnalichn");  
	if(bsupport && imstatus == 4){  
		location.href="Alitalk:SendSms?"+toUid+"&siteid="+toSite+"&tositeid="+toSite+"&status="+imstatus+"&SendLoginedAlitalk=1"+getMoreProperties(moreProperties);
	}
	else{	
		location.href="Alitalk:SendIM?"+toUid+"&siteid="+toSite+"&AliLoginID="+fromUid+"&status="+imstatus+"&SendLoginedAlitalk=1"+getMoreProperties(moreProperties);
	}
}
function newYahooSendMsg(fromSite,fromUid,toSite,toUid,imstatus,moreProperties) {//yahoo send message
	var bsupport=yahooVerSupportedSMS("chnyahoo");  
	if(bsupport && imstatus == 4){  
		location.href="YahooWW:SendSms?"+toUid+"&tositeid="+toSite+"&status="+imstatus+getMoreProperties(moreProperties);
	}
	else{
		location.href="YahooWW:SendIM?"+toUid+"&tositeid="+toSite+"&status="+imstatus+getMoreProperties(moreProperties);
	}
}


/**
*  ���ж��Ƿ�װ�ͻ���
*��δ��װ�ͻ��ˡ����ж�fromsite��ֵ���������������Ա�����
****/
function onlinewangWangSendMsg(fromSite,fromUid,toSite,toUid,imstatus,moreProperties)
{	
	var checkSite = fromSite;
	if(fromSite=="" || fromSite =="cnanonym"){
		checkSite = toSite;
	}

	var result = checkIMVersionNoMsg(checkSite);
	if(result!="-1"){
		if(fromSite=="cnanonym"){
			fromUid="";
		}
		onlinesendMsg(fromSite,fromUid,toSite,toUid,imstatus,moreProperties);
	}else if(fromSite=="cnanonym"){//start web wangwang
		var webwangwangURL  = "http://onlineww.im.alisoft.com/wangwang/webim.jsp?memberid="+encodeURI(fromUid)+"&targetid="+encodeURI(toSite+toUid)+getMoreProperties(moreProperties);
		window.open(webwangwangURL);
	}else{
		downloadWangWang(fromSite);
	}
}


/** **/
function startWebwwTaobao(){
	window.open('http://webww.taobao.com/wangwang/webww1.htm');
}


/**
**  ֱ�ӷ�����Ϣ ûװ�ͻ��˻�����webww
**/
function onlinesendMsg(fromSite,fromUid,toSite,toUid,imstatus,moreProperties){
	if(fromSite=="" || fromSite =="cnanonym"){
		fromSite = toSite;
	}
	var result = checkIMVersionNoMsg(fromSite);
	if(result=="-1"){
		//alert("\u6ca1\u6709\u5b89\u88c5\u65fa\u65fa!");
	}
	else if(result=="0"){
		if(toSite=="wangwang" || toSite=="cnalimam"){
			if(fromSite="cnalichn"){
				showAlitalkErrMsg(1);
			}else if(fromSite="cntaobao"){
				showWangwangErrMsg(1);
			}
			return;
		}
		if(fromSite == "chnyahoo") 
		{
			onlinenewYahooSendMsg(fromSite,fromUid,toSite,toUid,imstatus,moreProperties);
		}
		else if (fromSite == "cntaobao")
		{
			onlinenewWangWangSendMsg(fromSite,fromUid,toSite,toUid,imstatus,moreProperties);
		}
		else if (fromSite == "cnalichn")
		{	
			onlinenewAlitalkSendMsg(fromSite,fromUid,toSite,toUid,imstatus,moreProperties);
		}
	}
	else if(result=="1"){
			//"aliim:sendmsg?uid="+uid+"&touid="+touid+"&gid="+gid+"&siteid="+siteid+"&status="+status;
			 command = "aliim:sendmsg?uid="+fromSite+fromUid+"&touid="+toSite+toUid+"&siteid="+toSite+"&status="+imstatus+getMoreProperties(moreProperties);
			 execAliimShell(command);
	}
}
function onlinenewAlitalkSendMsg(fromSite,fromUid,toSite,toUid,imstatus,moreProperties)
{	
	var bsupport=alitalkVerSupportedSMS("cnalichn");  
	if(bsupport && imstatus == 4) {  
		location.href="Alitalk:SendSms?"+toUid+"&siteid="+toSite+"&status="+imstatus+"&AliLoginID="+fromUid+"&AliLoginsiteid="+fromSite+"&SendLoginedAlitalk=1"+getMoreProperties(moreProperties);
	}
	else{
		location.href="Alitalk:SendIM?"+toUid+"&siteid="+toSite+"&status="+imstatus+"&AliLoginID="+fromUid+"&AliLoginsiteid="+fromSite+"&SendLoginedAlitalk=1"+getMoreProperties(moreProperties);
	}
}

function onlinenewWangWangSendMsg(fromSite,fromUid,toSite,toUid,imstatus,moreProperties)
{
	
	var bsupport=WangWangVerSupportedSMS("cntaobao"); 
	if(bsupport && imstatus == 4) {
 		location.href="wangwang:SendSms?"+toUid+"&tositeid="+toSite+"&status="+imstatus+"&suid="+fromUid+getMoreProperties(moreProperties);
 	}
 	else{	
		location.href="wangwang:SendIM?uid="+toUid+"&tositeid="+toSite+"&status="+imstatus+"&suid="+fromUid+getMoreProperties(moreProperties);
 	}
}
function onlinenewYahooSendMsg(fromSite,fromUid,toSite,toUid,imstatus,moreProperties)
{
	var bsupport=yahooVerSupportedSMS("chnyahoo");  
	if(bsupport && imstatus == 4) {  
		location.href="YahooWW:SendSms?"+toUid+"&tositeid="+toSite+"&status="+imstatus+"&suid="+fromUid+getMoreProperties(moreProperties);
	}
	else{
		location.href="YahooWW:SendIM?uid="+toUid+"&tositeid="+toSite+"&status="+imstatus+"&suid="+fromUid+getMoreProperties(moreProperties);
	}
}

/**
 * �߷�������Ϣ
 *send dispatch message
 *@param fromSite   send site
 *@param fromUid		send user id
 *@param toSite   accept site
 *@param toUid		accept user id
 *@param imstatus	accept user status
 *@param moreProperties more properties
 */
function onlinewangWangSend(fromSite,fromUid,toSite,toUid,imstatus,moreProperties)
{	
	if(toUid !="" || toUid != null || toUid !="undefined" ){
		var isDOM = (document.getElementById ? true : false);
		if (window.aliwangwangSendmsgShowFrame ) {
			if(isDOM){
				document.getElementById('aliwangwangSendmsgShowFrame').src = "http://www.im.alisoft.com/webim/common/online_dispatch_v6.html?fromsite="+fromSite+"&fromid="+fromUid+"&sendsite=" + toSite+"&sendid=" + toUid+ "&imstatus=" + imstatus + "&moreProperties=" + escape(moreProperties);
			}else{
				window.aliwangwangSendmsgShowFrame.location="http://www.im.alisoft.com/webim/common/online_dispatch_v6.html?fromsite="+fromSite+"&fromid="+fromUid+"&sendsite=" + toSite+"&sendid=" + toUid+ "&imstatus=" + imstatus + "&moreProperties=" + escape(moreProperties);
			}
		} else {
			 onlinesendMsg(fromSite,fromUid,toSite,toUid,imstatus,moreProperties+"&fenliu=0");
		}
	}
}



/********      ��¼     ********/
/**
**	����ww
**/
function startWW(siteid,uid,moreProperties){
	var fromSite = siteid;
	var result = checkIMVersionNoMsg(fromSite);
	if(result=="-1"){
		return;
	}else if(result=="0"){
		if(siteid=="cntaobao"){
			if(uid==""){
				location.href="WangWang:";
			}else{
				location.href="WangWang:Login?suid="+uid+"&autologin=0";
			}
		}
		if(siteid=="chnyahoo"){
			location.href="yahooWW:";
		}
		if(siteid=="cnalichn"){
			location.href="Alitalk:";
		}
	}else if(result=="1"){
		var command="aliim:login?uid="+siteid+uid+"&autologin=0&weblogin=1";
		execAliimShell(command);
	}
}


function CloseWinWithoutParent(){
	var ua=navigator.userAgent;
	var ie=navigator.appName=="Microsoft Internet Explorer"?true:false;
	if(ie){
		var IEversion=parseFloat(ua.substring(ua.indexOf("MSIE ")+5,ua.indexOf(";",ua.indexOf("MSIE "))));
		if(IEversion< 5.5){
			window.opener =null;
			window.close();
		} else if (IEversion < 7.0) {
			window.opener =null;
			window.close();
		} else {
			window.opener =null;
			window.close();
		}
	} else {
		window.close()
	}
}


/***
* return 0 -->��δ��װ
*/
function isInstalledClient(longid){
	try{
		/**  �ж��Ƿ��Ѿ���6.0���������� */
		var wwx = new ActiveXObject("aliimx.wangwangx");
		if(wwx!=null){
			return 1;
		}
	}catch(e){
	}

	var site = getSite(longid);
	if(site=='cntaobao'){
		if(newCheckWangWangInstalled()!=DEFAULT_VERSION){
			return 1;
		}
	}else if(site=='cnalichn'){
		if(newCheckAlitalkInstalled()!=DEFAULT_VERSION){
			return 1;
		}
	}else if(site=='chnyahoo'){
		if(newCheckYahooInstalled()!=DEFAULT_VERSION){
			return 1;
		}
	}else{
		return 0;
	}
	return 0;
}

/***
* return 0 -->��δ��װ
*/
function checkIMVersionNoMsg(fromSite){
	var tempInstall = -1;
	try{
		/**  �ж��Ƿ��Ѿ���6.0���������� */
		var wwx = new ActiveXObject("aliimx.wangwangx");
		if(wwx!=null){
			tempInstall = 1 ;
		}
	}catch(e){
	}
	var site = fromSite;
	if(site=='cntaobao'){
		if(newCheckWangWangInstalled()!=DEFAULT_VERSION){
			return 0;
		}
	}else if(site=='cnalichn'){
		if(newCheckAlitalkInstalled()!=DEFAULT_VERSION){
			return 0;
		}
	}else if(site=='chnyahoo'){
		if(newCheckYahooInstalled()!=DEFAULT_VERSION){
			return 0;
		}
	}else{
		return tempInstall;
	}
	return tempInstall;
}

function newCheckAlitalkInstalled(){//check alitalk install
    var version = DEFAULT_VERSION;
    try{ 
        var obj = new ActiveXObject("AlitalkSetup.Install"); 
        if(obj!=null){version="cnalichn";}
    }catch(e){} 
    return version; 
} 

function newCheckWangWangInstalled(){//check wangwang install
    var version = DEFAULT_VERSION;
	try{ 
		var obj=new ActiveXObject("WangWangX.WangWangObj");
		if(obj!=null && "1.6.06.0525" != obj.GetVersionStr()){
			version="cntaobao";
		}
	}catch(e){} finally{
		obj =null;
	}
	return version; 
} 

function newCheckYahooInstalled(){//check yahoo install
	var version = DEFAULT_VERSION;
    try{ 
        var obj = new ActiveXObject("YahooWangWangX.WangWangObj");
        if(obj!=null){version="chnyahoo";}
    }catch(e){} 
    return version;
}

/********  �ж��߼�
**   ���� �ж�id�Ƿ��Ѿ������Ѿ���¼�ļ���������
**   ����Ѿ�����,ֱ��ʹ�ø�����
**	 ���������������ķ�ʽ�ж�
**   method: checkIMVersion()
**   longid   ��ID
**   return:  if(0)5.x  else if(1) 6.x  //else if(2) taobao else if(3)//  alitalk else not install
*****/
function checkIMVersion(longid,toSite,moreProperties){
	var isInstallIm = "-1"; 
	try{
		var wwx = new ActiveXObject("aliimx.wangwangx");
		if(wwx!=null){
			isInstallIm = 1;
		}
		var isOnline = wwx.IsLogin(longid);
		if(isOnline=='true'){
			return "1";
		}
	}catch(e){
	}
	var site = getSite(longid);
	if(site==""){
		site = toSite;
	}
	if(site=='cntaobao'){
		isInstallIm = checkTaobaoVer(isInstallIm);
	}else if(site=='chnyahoo'){
		isInstallIm = checkYahooVer(isInstallIm)
	}else if(site=='wangwang' || site=="cnalimam"){
		if(isInstallIm==1){
			return "1";
		}else{
			 showWanghaoErrMsg(2);
		}
	}else if(site=='enaliint'){
		if(isInstallIm==1){
			return "1";
		}else{
			 showWanghaoErrMsg(2);
		}
	}else{   //\u6240\u6709\u5269\u4e0b\u7684\u7248\u672c
		isInstallIm = checkAlitalkVer(isInstallIm);
	}
	return isInstallIm;
}


/** �ж��Ա��汾 **/
function checkTaobaoVer(isInstallIm){
	try{
		  var obj = new ActiveXObject("WangWangX.WangWangObj");
		  if(obj != null){
			  var version = obj.GetVersionStr();
			  var fstChar = version.charAt(0);
			  if( version != null) {
					 return "0";
			  }else if(isInstallIm==1){
				 return "1";
			  }else {
					 if(isInstallIm==1){
						return "1";
					}else{
						 showWangwangErrMsg(0);
					}
			  }			
		  }else{
			  if(isInstallIm==1){
					return "1";
				}else{
					 showWangwangErrMsg(1);
				}
		  }
	}catch(e){
		if(isInstallIm==1){
			return "1";
		}else{
			 showWangwangErrMsg(2);
		}
	}
}
/** �ж��й�վ�汾 **/
function checkAlitalkVer(isInstallIm){
	try{
		var obj=new ActiveXObject("Ali_Check.InfoCheck");
		if(obj != null){
			var mver=obj.GetValueBykey("AliTalkVersion");
			if(mver != null){
				 return "0";
			}else {
				if(isInstallIm==1){
					return "1";
				}else{
					 showAlitalkErrMsg(0);
				}
			}
		 }else{
			 if(isInstallIm==1){
				return "1";
			}else{
				 showAlitalkErrMsg(1);
			}
		 }
	}catch(e){
		if(isInstallIm==1){
			return "1";
		}else{
			 showAlitalkErrMsg(2);
		}
	}
}

/****
* �ж�yahoo�汾
*/
function checkYahooVer(isInstallIm){
	try{
		var obj = new ActiveXObject("YahooWangWangX.WangWangObj");
		if(obj != null){
			return 0;
		 }else{
			 if(isInstallIm==1){
				return "1";
			}else{
				 showYahooErrMsg(1);
			}
		 }
	}catch(e){
		if(isInstallIm==1){
			return "1";
		}else{
			 showYahooErrMsg(2);
		}
	}
}


/**
  * �����Լ������汾������Ϣ������ת����������ҳ��
  *
  * WangWang:ModifyCntInfo?CntId=&GroupId=&Nick=
  * @param flag   0 --> �汾����
  *               1 --> û�а�װ��������
  *               2 --> ��İ��������汾������,���������°氢��������
  */
 function showWanghaoErrMsg( flag ) {
	if ( flag == 0 ) {
		 alert("\u4f60\u7684\u7248\u672c\u8fc7\u65e7\uff0c\u6ca1\u6709\u8be5\u529f\u80fd\uff0c\u8bf7\u4e0b\u8f7d\u6700\u65b0\u7248\u672c!");
		 window.target = "_blank";
		 window.open("http://im.alisoft.com/download/index.html");
	} else if( flag == 2 ) {
		alert("\u4f60\u6ca1\u6709\u5b89\u88c5\u963f\u91cc\u65fa\u65fa,\u8bf7\u4e0b\u8f7d\u963f\u91cc\u65fa\u65fa!")
		window.target = "_blank";
		window.open("http://im.alisoft.com/download/index.html");
	} else if( flag == 1 ) {
		alert("\u4f60\u7684\u963f\u91cc\u65fa\u65fa\u7248\u672c\u6709\u95ee\u9898,\u8bf7\u4e0b\u8f7d\u6700\u65b0\u7248\u963f\u91cc\u65fa\u65fa\uff01")
		window.target = "_blank";
		window.open("http://im.alisoft.com/download/index.html");
	}
 }


/**
  * �Ա�����������Ϣ������ת���Ա�������ҳ��
  *
  * WangWang:ModifyCntInfo?CntId=&GroupId=&Nick=
  * @param flag   0 --> �汾����
  *               1 --> û�а�װ��������
  *               2 --> ��İ��������汾������,���������°氢��������
  */
 function showWangwangErrMsg( flag ) {
	if ( flag == 0 ) {
		 alert("\u4f60\u7684\u7248\u672c\u8fc7\u65e7\uff0c\u6ca1\u6709\u8be5\u529f\u80fd\uff0c\u8bf7\u4e0b\u8f7d\u6700\u65b0\u7248\u672c!");
		 window.target = "_blank";
		 window.open("http://im.alisoft.com/download/taobao.html");
	} else if( flag == 2 ) {
		alert("\u4f60\u6ca1\u6709\u5b89\u88c5\u963f\u91cc\u65fa\u65fa,\u8bf7\u4e0b\u8f7d\u963f\u91cc\u65fa\u65fa!")
		window.target = "_blank";
		window.open("http://im.alisoft.com/download/taobao.html");
	} else if( flag == 1 ) {
		alert("\u4f60\u7684\u963f\u91cc\u65fa\u65fa\u7248\u672c\u6709\u95ee\u9898,\u8bf7\u4e0b\u8f7d\u6700\u65b0\u7248\u963f\u91cc\u65fa\u65fa\uff01")
		window.target = "_blank";
		window.open("http://im.alisoft.com/download/taobao.html");
	}
 }

 /**
  * ó��ͨ������Ϣ������ת��ó��ͨ������ҳ��
  *
  * @param flag   0 --> �汾����
  *               1 --> û�а�װ��������
  *               2 --> ��İ��������汾������,���������°氢��������
  */
 function showAlitalkErrMsg( flag ) {
	if ( flag == 0 ) {
		 alert("\u4f60\u7684\u7248\u672c\u8fc7\u65e7\uff0c\u6ca1\u6709\u8be5\u529f\u80fd\uff0c\u8bf7\u4e0b\u8f7d\u6700\u65b0\u7248\u672c!");
		 window.target = "_blank";
		 window.open("http://im.alisoft.com/download/alibaba.html");
	} else if( flag == 2 ) {
		alert("\u4f60\u6ca1\u6709\u5b89\u88c5\u963f\u91cc\u65fa\u65fa,\u8bf7\u4e0b\u8f7d\u963f\u91cc\u65fa\u65fa!")
		window.target = "_blank";
		window.open("http://im.alisoft.com/download/alibaba.html");
	} else if( flag == 1 ) {
		alert("\u4f60\u7684\u963f\u91cc\u65fa\u65fa\u7248\u672c\u6709\u95ee\u9898,\u8bf7\u4e0b\u8f7d\u6700\u65b0\u7248\u963f\u91cc\u65fa\u65fa\uff01")
		window.target = "_blank";
		window.open("http://im.alisoft.com/download/alibaba.html");
	}
 }

 /**
  * ó��ͨ������Ϣ������ת��ó��ͨ������ҳ��
  *
  */
 function showYahooErrMsg( flag ) {
	if ( flag == 0 ) {
		 alert("\u4f60\u7684\u7248\u672c\u8fc7\u65e7\uff0c\u6ca1\u6709\u8be5\u529f\u80fd\uff0c\u8bf7\u4e0b\u8f7d\u6700\u65b0\u7248\u672c!");
		 window.target = "_blank";
		 window.open("http://im.alisoft.com/download/index.html");
	} else if( flag == 2 ) {
		alert("\u4f60\u6ca1\u6709\u5b89\u88c5\u963f\u91cc\u65fa\u65fa,\u8bf7\u4e0b\u8f7d\u963f\u91cc\u65fa\u65fa!")
		window.target = "_blank";
		window.open("http://im.alisoft.com/download/index.html");
	} else if( flag == 1 ) {
		alert("\u4f60\u7684\u963f\u91cc\u65fa\u65fa\u7248\u672c\u6709\u95ee\u9898,\u8bf7\u4e0b\u8f7d\u6700\u65b0\u7248\u963f\u91cc\u65fa\u65fa\uff01")
		window.target = "_blank";
		window.open("http://im.alisoft.com/download/index.html");
	}
 }

/**
 * �����ص�ҳ��
 * @param siteid վ��id
 **/
function openDownloadPage( siteid ) {
	var downloadUrl = "";
	if(siteid=="cntaobao") {
		downloadUrl="http://im.alisoft.com/download/taobao.html";
	} else if(siteid=="cnalichn") {
		downloadUrl="http://im.alisoft.com/download/alibaba.html";
	} else {
		downloadUrl="http://im.alisoft.com/download/index.html";
	}
	window.target = "_blank";
	window.open(downloadUrl);
}

/**
* ���� ID ȡ��վ��
*/
function getSite(masterId){
	var site ="";
	masterId = masterId.replace(/^\s+|\s+$/g,"");
	if(masterId.indexOf("cnalichn")>=0){
		site =  masterId.substr(0,8);
	}else if(masterId.indexOf("cntaobao")>=0){
		site =  masterId.substr(0,8);
	}else if(masterId.indexOf("chnyahoo")>=0){
		site =  masterId.substr(0,8);
	}else if(masterId.indexOf("cnkoubei")>=0){
		site =  masterId.substr(0,8);
	}else if(masterId.indexOf("cnwujing")>=0){
		site =  masterId.substr(0,8);
	}else if(masterId.indexOf("chnaigou")>=0){
		site =  masterId.substr(0,8);
	}else if(masterId.indexOf("cntbbtoc")>=0){
		site =  masterId.substr(0,8);
	}else if(masterId.indexOf("wangwang")>=0){
		site =  masterId.substr(0,8);
	}else if(masterId.indexOf("cnalimam")>=0){
		site =  masterId.substr(0,8);
	}else if(masterId.indexOf("enaliint")>=0){
		site =  masterId.substr(0,8);
	}
	return site;
}

/**
 * ���� ID ȡ���û��Ķ�ID
 * @param masterId �û���ID
 * @return �û���ID
 */
function getSiteLoginId( userId ){
	if ( userId == null || userId == "" ) { 
		return "";
	}

	if ( (getSite(userId) != "") &&  ( userId.length >= 9 ) ) {
		return userId.substr(8);
	}

	return "";
}

/*******  ִ��5.7�Ա�shell  ****/
 function execTaobaoShell(command){
	location = command;
 }

/*******  ִ��5.7����վshell  ****/
 function execAlitalkShell(command){
 	location = command;
 }

/*******  ִ��6.0shell  ****/
 function execAliimShell(command){
	location = command;
 }




function isSupportKouBei(){//0:no support 1:cnlichn  2:cntaobao 3:has setup alitalk or wangwang
	var flag = 0;
	try{
		var obj=new ActiveXObject("Ali_Check.InfoCheck");
		var mver=obj.GetValueBykey("AliTalkVersion");
		if(mver >="5.50.00"){return 1;}else{flag = 3;}
	}catch(e){
		try{
			var obj = new ActiveXObject("WangWangX.WangWangObj");
			var mver=obj.GetVersionStr();
			var fstChar = mver.charAt(0);
			if (fstChar != "R" && mver >= "5.50.00W"){return 2;}else{flag = 3;}
		}catch(e){
			return flag;
		}
	}	
	return flag;
}



 function getMoreProperties(moreProperties){//get more properties
	var p="";
	if(moreProperties!=""){
		if(moreProperties.substring(0,1)!="&"){
			p="&"+moreProperties;
		}else{
			p=moreProperties;
		}
	}
	return p;
 }



 function taobaoVerSupportedSMS(siteid) {//check SMS  is supported by wangwang
	var is = false;
	try{
		var obj = new ActiveXObject("WangWangX.WangWangObj");
		var mver=obj.GetVersionStr();
		var fstChar = mver.charAt(0);
		if (fstChar != "R" && mver >= "5.50.00W"){is = true;}
	}catch(e){}
	return is;
}
function alitalkVerSupportedSMS(siteid) {//check SMS  is supported by alitalk
	var is = false;
	try{
		var obj=new ActiveXObject("Ali_Check.InfoCheck");
		var mver=obj.GetValueBykey("AliTalkVersion");
		if(mver >="5.50.00"){is = true;}
	}catch(e){}
	return is;	
}
function yahooVerSupportedSMS(siteid) {//check SMS  is supported by yahoo
	return true;
}

function WangWangVerSupportedSMS(siteid) {//check SMS is supported by site
	var is=false;
 	if (siteid =="cntaobao"){is=taobaoVerSupportedSMS(siteid);}
 	else if(siteid=="cnalichn"){is=alitalkVerSupportedSMS(siteid);}
 	else if(siteid=="chnyahoo"){is=yahooVerSupportedSMS(siteid);}
 	return is;
}

function downloadWangWang(siteid){
	if(siteid == "chnyahoo" ){
		location.href='http://www.alisoft.com/portal/yahooww/site/index.html'; 
	}else if (siteid == "cntaobao" ){
		window.open('http://webwwtb.im.alisoft.com/wangwang/webww1.htm');
	}
	else if (siteid == "cnkoubei" ){
		location.href='http://download.im.alisoft.com/cnkoubei.php'; 
	}
	else if(confirm(unescape("%u662F%u5426%u4E0B%u8F7D%u963F%u91CC%u65FA%u65FA%3F"))){//"%u662F%u5426%u4E0B%u8F7D%u963F%u91CC%u65FA%u65FA%3F" has been used by javascript:escape()
		location.href='http://download.im.alisoft.com/download.php';
	} 
}

/****
** space app����
****/
function spaceAppInviteV6(uid,cmdid,appid,param,param2,param3){
    var command = "aliim:sendappcmd?uid="+uid+"&cmdid="+cmdid+"&appid="+appid+"&param="+param;
	if(param2!=null){
		command += "&param2="+param2;
	}
	if(param3!=null){
		command += "&param3="+param3;
	}
 	execAliimShell(command);
}