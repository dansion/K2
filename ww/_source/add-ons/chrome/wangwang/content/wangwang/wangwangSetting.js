/**
 * @name			WangWang Protocol Setting Module
 * @module			Setting
 * @namespace		WangWang.Setting
 * @author			Kong Wei (Qu Chao) <Chappell.Wat{at}Gmail{dot}com>
 * @version			1.3
 * @changelog
 *		Ver 1.0 @ 2008-08-21	Initialize release
 *		Ver 1.1 @ 2008-08-26	Compatibility improved for load-from-registry mode.
 *		Ver 1.2 @ 2008-09-02	Default content added into api.js.
 *		Ver 1.3 @ 2008-09-18	Some tiny improvements.
 */


/*-----------------------------------------------------------------------------
 * Setting Module - Singleton
 *-------------------------------------------------------------------------- */
WangWang.Setting = function () {
	const clientArr = {
			'WangWang':	'WangWang.exe',
			'AliIM':	'WWCmd.exe',
			'AliTalk':	'AliTalk.exe'
		},
		pref = WangWang.Preference,
		reg = new WangWang.Registry(),
		i18n = WangWang.I18N;
	var	clientPath = '',
		getDir = function (clientId) {
			var IFP = Ci.nsIFilePicker,
				fp = Cc['@mozilla.org/filepicker;1'].createInstance(IFP),
				winTitle = i18n.get('name.' + clientId) + ' - ' + i18n.get('label.directory');
			fp.init(window, winTitle, IFP.modeGetFolder);
			fp.displayDirectory = null;
			fp.appendFilters(IFP.filterAll);
			if (fp.show() === IFP.returnOK) {
				return fp.file.QueryInterface(Ci.nsILocalFile).path;
			}
			return '';
		},
		browse = function (clientId) {
			var clientDir = getDir(clientId);
			if ('' !== clientDir) {
				var clientPath = clientDir + '\\' + clientArr[clientId];
				var insLF = Cc['@mozilla.org/file/local;1'].createInstance(Ci.nsILocalFile);
				insLF.initWithPath(clientPath);
				if (insLF.exists()) {
					$('pth' + clientId).value = clientPath;
					$('reg' + clientId).disabled = false;
				} else {
					alert(i18n.get('error.notExist', [clientArr[clientId]]));
				}
			}
		};
	return {
		init: function () {
			for(clientId in clientArr) {
				clientPath = pref.get(clientId.toLowerCase() + '.path');
				if ('' !== clientPath) {
					$('pth' + clientId).value = clientPath;
					$('reg' + clientId).label = i18n.get('protocol.unregister');
					$('reg' + clientId).disabled = false;
					$('brs' + clientId).disabled = true;
				}
			}
		},
		quit: function () {
			reg.end();
			for(clientId in clientArr) {
				if ('' !== $('pth' + clientId).value && i18n.get('protocol.register') === $('reg' + clientId).label) {
					return confirm(i18n.get('comfirm.unsaved', [i18n.get('name.' + clientId)]));
				}
			}
			return true;
		},
		detect: function (clientId) {
			var clientPath = reg.get(clientId);
			if ('' !== clientPath && confirm(i18n.get('comfirm.autoRegister', [i18n.get('name.' + clientId)]))) {
				$('pth' + clientId).value = clientPath;
				this.toggleReg(clientId);
			} else {
				browse(clientId);
			}
		},
		toggleReg: function (clientId) {
			var branch = clientId.toLowerCase() + '.path';
			if ('' === pref.get(branch)) {
				pref.set(branch, $('pth' + clientId).value);
				$('reg' + clientId).label = i18n.get('protocol.unregister');
				$('reg' + clientId).disabled = false;
				$('brs' + clientId).disabled = true;
			} else {
				pref.set(branch, '');
				$('pth' + clientId).value = '';
				$('reg' + clientId).label = i18n.get('protocol.register');
				$('reg' + clientId).disabled = true;
				$('brs' + clientId).disabled = false;
			}

			// build api file
			var clientArr = [];
			['WangWang', 'AliIM', 'AliTalk'].forEach(function (clientId) {
				if (true === pref.isSet(clientId.toLowerCase() + '.path')) {
					clientArr.push('window.' + clientId + ' = {};');
				}
			});
			(new WangWang.Stream).write(clientArr.join('\n'));

			// restart confirm
			if (confirm(i18n.get('comfirm.restart'))) {
				WangWang.Restart.fire();
			}
		}
	};
}();