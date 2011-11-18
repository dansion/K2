/**
 * @name			WangWang Protocol Handler
 * @module			WangWang.Handler
 * @namespace		WangWang
 * @author			Kong Wei (Qu Chao) <Chappell.Wat{at}Gmail{dot}com>
 * @version			1.3
 * @changelog
 *		Ver 1.0 @ 2008-08-21	Initialize release
 *		Ver 1.1 @ 2008-08-26	Compatibility improved for load-from-registry mode.
 *		Ver 1.2 @ 2008-09-02	Default content added into api.js.
 *		Ver 1.3 @ 2008-09-18	Some tiny improvements.
 */


/*-----------------------------------------------------------------------------
 * Defines
 *-------------------------------------------------------------------------- */
const PROTOCOLS = [
	{
		'scheme':		'wangwang',
		'name':			'WangWang Protocol Handler',
		'componentid':	Components.ID("{8d976493-1fd7-4604-92fd-ddc6ccc73b5f}")
	},
	{
		'scheme':		'aliim',
		'name':			'AliIM Protocol Handler',
		'componentid':	Components.ID("{b667d087-55f7-4a5c-ac7a-d70b824fed64}")
	},
	{
		'scheme':		'alitalk',
		'name':			'AliTalk Protocol Handler',
		'componentid':	Components.ID("{0e511c04-eade-4e31-ad17-101cd7d8d32a}")
	}
],
Cc = Components.classes,
Ci = Components.interfaces,
Cr = Components.results,
IPH = Ci.nsIProtocolHandler;


/*-----------------------------------------------------------------------------
 * WangWang
 *-------------------------------------------------------------------------- */
var WangWang = WangWang || {};


/*-----------------------------------------------------------------------------
 * Protocol Handler
 *-------------------------------------------------------------------------- */
WangWang.Handler = function (scheme) {
    this.scheme = scheme;
    this.client = this.getClient(scheme);
}

WangWang.Handler.prototype = {
	defaultPort: -1,
	protocolFlags: IPH.URI_NORELATIVE | IPH.URI_NOAUTH,
	allowPort: function (aPort, aScheme) {
		return false;
	},
	newURI: function(aSpec, aCharset, aBaseURI) {
		var IURI = Cc['@mozilla.org/network/simple-uri;1'].createInstance(Ci.nsIURI);
		IURI.spec = aSpec;
		return IURI;
	},
	newChannel: function(aURI) {
		// get cmd
		var arg = aURI.spec;

		if (null !== this.client && '' !== arg) {
			// launch it
			var IP = Cc['@mozilla.org/process/util;1'].createInstance(Ci.nsIProcess);
			IP.init(this.client);
			IP.run(false, [arg], 1,{});
		} else {
			var IWW = Cc['@mozilla.org/embedcomp/window-watcher;1'].getService(Ci.nsIWindowWatcher),
				uri = '';
			switch (this.scheme) {
			case 'wangwang':
				/\?(uid=)?([^&]*)/i.exec(arg);
				uri = 'http://webwwtb.im.alisoft.com/wangwang/ww1.htm?t=' + (new Date()).getTime() + '&uid=&tid=' + this.a2u(decodeURI(RegExp.$2));
				break;
			case 'aliim':
				if (-1 !== arg.indexOf('cntaobao')) {
					/=cntaobao([^&]*)/i.exec(arg);
					uri = 'http://webwwtb.im.alisoft.com/wangwang/ww1.htm?t=' + (new Date()).getTime() + '&uid=&tid=' + this.a2u(decodeURI(RegExp.$1));
				} else {
					uri = 'http://www.taobao.com/wangwang/index.php';
				}
				break;
			case 'alitalk':
				uri = 'http://alitalk.alibaba.com.cn/index.html';
				break;
			}
            Cc['@mozilla.org/embedcomp/window-watcher;1'].getService(Ci.nsIWindowWatcher).openWindow(IWW.activeWindow, uri, this.scheme, 'centerscreen', null);
		}
		return Cc['@mozilla.org/network/io-service;1'].getService(Ci.nsIIOService).newChannel('javascript:void();', null, null);
	},
	getClient: function () {
		// get client path from pref
		var pref = Cc['@mozilla.org/preferences-service;1'].getService(Ci.nsIPrefService).getBranch('extensions.wangwang-protocol.');
		var clientPath = '',
			branch = this.scheme + '.path';
		if(pref.getPrefType(branch) === pref.PREF_STRING) {
			clientPath = decodeURI(pref.getCharPref(branch));
			if (/^((([a-zA-Z]:)|(\\{2}\w+)\$?)(\\(\w[\w ]*.*))+\.exe)$/.test(clientPath)) {
				// check existance
				var ILF = Cc['@mozilla.org/file/local;1'].createInstance(Ci.nsILocalFile);
				try {
					ILF.initWithPath(clientPath);
				} catch(e) {
					return null;
				}
				if (ILF.exists()) {
					return ILF;
				}
			}
		}
		return null;
	},
	a2u: function (str) {
		var a = [],
			i = 0;
		for (; i < str.length ;) {
			a[i] = ('00' + str.charCodeAt(i ++).toString(16)).slice(-4);
		}
		return ('%u' + a.join('%u'));
	}
}


/*-----------------------------------------------------------------------------
 * Handler Factory
 *-------------------------------------------------------------------------- */
WangWang.Handler.Factory = function (scheme) {
    this.scheme = scheme;
}

WangWang.Handler.Factory.prototype = {
	createInstance: function (outer, iid) {
		if (null != outer) {
			throw Cr.NS_ERROR_NO_AGGREGATION;
		}

		if (!iid.equals(IPH) && !iid.equals(Ci.nsISupports)) {
			throw Cr.NS_ERROR_INVALID_ARG;
		}

		return new WangWang.Handler(this.scheme);
	}
}

// Handlers
var factoryArr = [];
for (var i = PROTOCOLS.length - 1; i >= 0; i --) {
	var theProtocol = PROTOCOLS[i];
	factoryArr[i] = new WangWang.Handler.Factory(PROTOCOLS[i]['scheme']);
}


/*-----------------------------------------------------------------------------
 * Module
 *-------------------------------------------------------------------------- */
WangWang.Module = function () {
	const ICR = Ci.nsIComponentRegistrar;
	return {
		registerSelf: function (compMgr, fileSpec, location, type) {
			compMgr = compMgr.QueryInterface(ICR);
			// register protocols handler
			for (var i = PROTOCOLS.length - 1; i >= 0; i --) {
				var theProtocol = PROTOCOLS[i];
				compMgr.registerFactoryLocation(
					theProtocol['componentid'],
					theProtocol['name'],
					'@mozilla.org/network/protocol;1?name=' + theProtocol['scheme'],
					fileSpec,
					location,
					type
				);
			}
		},
		unregisterSelf: function (compMgr, fileSpec, location) {
			compMgr = compMgr.QueryInterface(ICR);
			// unregister protocols handler
			for (var i = PROTOCOLS.length - 1; i >= 0; i --) {
				var theProtocol = PROTOCOLS[i];
				compMgr.unregisterFactoryLocation(
					theProtocol['componentid'],
					fileSpec
				);
			}
		},
		getClassObject: function (compMgr, cid, iid) {
			if (!iid.equals(Ci.nsIFactory)) {
				throw Cr.NS_ERROR_NOT_IMPLEMENTED;
			}

			// return protocol handler factories
			for (var i = PROTOCOLS.length - 1; i >= 0; i --) {
				if (cid.equals(PROTOCOLS[i]['componentid'])) {
					return factoryArr[i];
				}
			}

			throw Cr.NS_ERROR_NO_INTERFACE;
		},
		canUnload: function (compMgr) {
			// it can be always unloaded
			return true;
		}
	};
}();


/*-----------------------------------------------------------------------------
 * Entrypoint
 *-------------------------------------------------------------------------- */
function NSGetModule(compMgr, fileSpec) {
	return WangWang.Module;
}