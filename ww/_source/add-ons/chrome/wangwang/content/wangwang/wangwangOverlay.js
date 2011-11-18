/**
 * @name			WangWang Protocol Handler
 * @module			Global
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
 * WangWang - Constructor
 *-------------------------------------------------------------------------- */
const WangWang = {};
var Cc = Components.classes,
Ci = Components.interfaces;


/*-----------------------------------------------------------------------------
 * Preference Module - Singleton
 *-------------------------------------------------------------------------- */
WangWang.Preference = function () {
	const IPS = Cc['@mozilla.org/preferences-service;1'].getService(Ci.nsIPrefService),
		pref = IPS.getBranch('extensions.wangwang-protocol.');
	return {
		get: function (branch) {
			if(pref.getPrefType(branch) === pref.PREF_STRING) {
				return decodeURI(pref.getCharPref(branch));
			}
			return '';
		},
		set: function (branch, value) {
			pref.setCharPref(branch, encodeURI(value));
		},
		isSet: function (branch) {
			return pref.prefHasUserValue(branch);
		}
	};
}();


/*-----------------------------------------------------------------------------
 * Registry Module - Constructor
 *-------------------------------------------------------------------------- */
WangWang.Registry = function () {
	const IWR = Cc['@mozilla.org/windows-registry-key;1'].createInstance(Ci.nsIWindowsRegKey);
	this.get = function (clientId) {
		IWR.open(IWR.ROOT_KEY_CLASSES_ROOT, '', IWR.ACCESS_READ);
		if (IWR.hasChild(clientId)) {
			var key = IWR.openChild(clientId + '\\Shell\\Open\\Command', IWR.ACCESS_READ);
			var cmd = key.readStringValue(key.getValueName(0));
			key.close();
			// get path from the CMD term
			/^\"?((([a-zA-Z]:)|(\\{2}\w+)\$?)(\\(\w[\w ]*.*))+\.exe)/.exec(cmd);
			return RegExp.$1;
		}
		return '';
	};
	this.end = function () {
		IWR.close();
	};
};


/*-----------------------------------------------------------------------------
 * I18N Module - Singleton
 *-------------------------------------------------------------------------- */
WangWang.I18N = function () {
	var	getBndl = function () {
			var ISB = Cc['@mozilla.org/intl/stringbundle;1'].getService(Ci.nsIStringBundleService);
			var bndl = ISB.createBundle('chrome://wangwang/locale/wangwang.properties');
			getBndl = function() {
				return bndl;
			};
			return getBndl();
		};
	return {
		get: function (key, arr) {
			if ('undefined' === typeof arr) {
				return getBndl().GetStringFromName(key);
			} else {
				return getBndl().formatStringFromName(key, arr, arr.length);
			}
		}
	};
}();


/*-----------------------------------------------------------------------------
 * Restart Module - Singleton
 *-------------------------------------------------------------------------- */
WangWang.Restart = function () {
	const IAS = Cc['@mozilla.org/toolkit/app-startup;1'].getService(Ci.nsIAppStartup),
		IWM = Cc['@mozilla.org/appshell/window-mediator;1'].getService(Ci.nsIWindowMediator).getEnumerator(null);
	return {
		fire: function () {
			while (IWM.hasMoreElements()) {
				var win = IWM.getNext();
				if (('tryToClose' in win) && !win.tryToClose()) {
					return;
				}
			}
			IAS.quit(IAS.eRestart | IAS.eAttemptQuit);
		}
	};
}();


/*-----------------------------------------------------------------------------
 * Stream Module - Singleton
 *-------------------------------------------------------------------------- */
WangWang.Stream = function () {
	const IEM = Cc['@mozilla.org/extensions/manager;1'].getService(Ci.nsIExtensionManager),
		IFO = Cc['@mozilla.org/network/file-output-stream;1'].createInstance(Ci.nsIFileOutputStream),
		CID = '{f91736d1-6083-4d22-af0e-38befb649cba}';
	this.write = function (data) {
		var IPF = IEM.getInstallLocation(CID).getItemFile(CID, 'install.rdf').parent;
		IPF.append('chrome');
		IPF.append('api');
		IPF.append('api.js');
		IFO.init(IPF, 0x02 | 0x08 | 0x20, 0664, 0);
		IFO.write(data, data.length);
		IFO.close();
	};
};


/*-----------------------------------------------------------------------------
 * Functions
 *-------------------------------------------------------------------------- */
function $(id) {
	return document.getElementById(id);
}

function debugLog(msg) {
    console = Cc['@mozilla.org/consoleservice;1'].getService(Ci.nsIConsoleService);
    console.logStringMessage(msg);
}