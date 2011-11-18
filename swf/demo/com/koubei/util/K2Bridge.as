/*
Copyright (c) 2010, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.com/yui/license.html
version: 3.2.0
build: 2676
*/

/*
 * @author: <a href="zhengxie@taobao.com">zhengxie</a>
 * @version:1-0-0
 */
package com.koubei.util
 {
	import flash.display.Stage;
	import flash.external.ExternalInterface;
	import flash.utils.getDefinitionByName;
	import flash.system.Security;
	
	public class K2Bridge extends Object
	{
		public var flashvars:Object;
		private var _jsHandler:String;
		private var _swfID:String;
		private var _yId:String;

		private var _stage:Stage;


		public function K2Bridge(stage:Stage)
		{
			_stage = stage;
			Security.allowDomain("*.kbcdn.com");
			Security.allowInsecureDomain("*.kbcdn.com");
			Security.allowDomain("*.koubei.com");
			Security.allowInsecureDomain("*.koubei.com");
			Security.allowDomain("*.taobao.com");
			Security.allowInsecureDomain("*.taobao.com");
											  
			flashvars = _stage.loaderInfo.parameters;

			if (flashvars["yId"] && flashvars["YUIBridgeCallback"] && flashvars["YUISwfId"] && ExternalInterface.available) {
				_jsHandler = flashvars["YUIBridgeCallback"];
				_swfID = flashvars["YUISwfId"];
				_yId = flashvars["yId"];
			}

		}


		public function addCallbacks (callbacks:Object, dispatchInitEvent:Boolean = true) : void {
			if (ExternalInterface.available) {
				for (var callback:String in callbacks) {
					trace("Added callback for " + callback + ", function " + callbacks[callback]);
					ExternalInterface.addCallback(callback, callbacks[callback]);
				}
				if(dispatchInitEvent){
					sendEvent({type:"swfReady"});
				}
			}
		}

		public function sendEvent (evt:Object) : void {
			if (ExternalInterface.available) {
				trace("Sending event -- " + evt);
				trace("Sending to " + _yId);
				trace("Calling " + _jsHandler);
				
				ExternalInterface.call("YUI.applyTo", _yId, _jsHandler, [_swfID, evt]);
			}

		}		
	}
}