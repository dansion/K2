/*!
 * @revision:
 */
/*
 * @author: zhengxie.lj@taobao.com
 * @version:1-0-3
 */
/*
Copyright (c) 2010, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.com/yui/license.html
version: 3.2.0
build: 2676
*/
YUI.add('k2-uploader-flash', function(Y) {
	
	var Event = Y.Event,
		Node = Y.Node;
	
	//the default swf file used for uploading file.
	var SWFURL = 'http://k.kbcdn.com/k2/uploader/uploader.swf',
		 S_SWFURL = 'http://k.kbcdn.com/k2/uploader/skinnable-uploader.swf';
	
	/**
	 * @description Upload file by SWF. Creating a swf node and using Flash API to transfer file data.
	 *
	 * @extend UploaderAbstract
	 */
	function UploaderFlash (config /*Object*/) {
		
		UploaderFlash.superclass.constructor.apply(this, arguments);

		if (config.hasOwnProperty("container")) {
			this.set("container", config.boundingBox);
		};

		if (config.hasOwnProperty("buttonSkin")) {
			this.set("buttonSkin", config.buttonSkin);
			this.set("swfURL", S_SWFURL);
		};

		if (config.hasOwnProperty("transparent")) {
			this.set("transparent", config.transparent);
		};
		if (config.hasOwnProperty("swfURL")) {
			this.set("swfURL", config.swfURL);
		};
		this.initSWF();
	};

Y.extend(UploaderFlash, Y.UploaderAbstract, {
		
		/**
		 * @description swf instance
		 * @access protect
		 */
		uploaderswf:null,

		/**
		 * indicate the instance is ready to use, such as setFileFilters, setAllowMultipleFiles in SWF env.
		 */
		_isReady: false,
		/**
		 * @description used to initialize the instance property.
		 * @access protect
		 */
		initSWF : function () {
			var oElement = this.container = Node.one(this.get("container"));
			var params = {version: "9.0.125",
							width: 101,
							height:30,
						  fixedAttributes: {
									allowScriptAccess:"always", 
									scale: "noscale",
									quality: "high",
									menu: "false",
									bgcolor: "#ffffff"
						  },
						  flashVars: {}};

			if (this.get("buttonSkin") != "") {
				params.flashVars["buttonSkin"] = this.get("buttonSkin");
			}
			if (this.get("transparent")) {
				params.fixedAttributes["wmode"] = "transparent";
			}
			
			this.uploaderswf = new Y.SWF(oElement, this.get("swfURL"), params);

			var upswf = this.uploaderswf;
			var relEvent = Y.bind(this._relayEvent, this);

			upswf.on ("uploadcompletedata", this._onUploaderCompleteData, this);
			upswf.on ("uploadcancel", this._onUploaderCompleteData, this);
			upswf.on ("uploaderror", this._onUploaderCompleteData, this);

			upswf.on ("swfReady", Y.bind(this._initializeUploader, this));
			upswf.on ("click", relEvent);
			upswf.on ("fileselect", relEvent);
			upswf.on ("mousedown", relEvent);
			upswf.on ("mouseup", relEvent);
			upswf.on ("mouseleave", relEvent);
			upswf.on ("mouseenter", relEvent);
			upswf.on ("uploadcancel", relEvent);
			upswf.on ("uploadcomplete", relEvent);
			upswf.on ("uploadcompletedata", relEvent);
			upswf.on ("uploaderror", relEvent);
			upswf.on ("uploadprogress", relEvent);
			upswf.on ("uploadstart", relEvent);
			upswf.on ("uploadstart", Y.bind(this._onUploaderStart, this));
			
		},

	   /**
		* Removes a specific file from the upload queue.
		*
		* @method removeFile
		* @param fileID {String} The ID of the file to be removed
		* @return {Object} The updated file list, which is an object of the format:
		* fileList[fileID] = {id: fileID, name: fileName, cDate: fileCDate, mDate: fileMDate, size: fileSize}
		*/
		removeFile : function (fileID /*String*/) {
			return this.uploaderswf.callSWF("removeFile", [fileID]);
		},
	
	   /**
		* Clears the upload queue.
		*
		* @method clearFileList
		* @return {Boolean} This method always returns true.
		*/
		clearFileList : function () {
			return this.uploaderswf.callSWF("clearFileList", []);
		},
		
	   /**
		* Starts the upload of a specific file.
		*
		* @method upload
		* @param fileID {String} The ID of the file to be uploaded.
		* @param url {String} The URL to upload the file to.
		* @param method {String} (optional) The HTTP method to use for sending additional variables, either 'GET' or 'POST' ('GET' by default)
		* @param postVars {Object} (optional) A set of key-value pairs to send as variables along with the file upload HTTP request.
		* @param postFileVarName {String} (optional) The name of the POST variable that should contain the uploaded file ('Filedata' by default)
		* @return {Boolean} This method always returns true.
		*/
		upload : function (fileID /*String*/,  postVars /*Object*/) {
			if (Y.Lang.isArray(fileID)) {
				return this.uploaderswf.callSWF("uploadThese", [fileID, this.get('action'), this.get('method'), postVars, this.get('fileName')]);
			}
			else if (Y.Lang.isString(fileID)) {
				return this.uploaderswf.callSWF("upload", [fileID, this.get('action'), this.get('method'), postVars, this.get('fileName')]);
			}
		},

	   /**
		* Starts the upload of a set of files, as specified in the first argument. 
		* The upload queue is managed automatically.
		*
		* @method uploadThese
		* @param fileIDs {Array} The array of IDs of the files to be uploaded.
		* @param url {String} The URL to upload the files to.
		* @param method {String} (optional) The HTTP method to use for sending additional variables, either 'GET' or 'POST' ('GET' by default)
		* @param postVars {Object} (optional) A set of key-value pairs to send as variables along with the file upload HTTP request.
		* @param postFileVarName {String} (optional) The name of the POST variable that should contain the uploaded file ('Filedata' by default)
		*/
		uploadThese : function (fileIDs /*Array*/, postVars /*Object*/) {
			return this.uploaderswf.callSWF("uploadThese", [fileIDs, this.get('action'), this.get('method'), postVars, this.get('fileName')]);
		},

	   /**
		* Starts the upload of the files in the upload queue. 
		* The upload queue is managed automatically.
		*
		* @method uploadAll
		* @param url {String} The URL to upload the files to.
		* @param method {String} (optional) The HTTP method to use for sending additional variables, either 'GET' or 'POST' ('GET' by default)
		* @param postVars {Object} (optional) A set of key-value pairs to send as variables along with the file upload HTTP request.
		* @param postFileVarName {String} (optional) The name of the POST variable that should contain the uploaded file ('Filedata' by default).
		*/	
		uploadAll : function (postVars /*Object*/) {
			return this.uploaderswf.callSWF("uploadAll", [this.get('action'), this.get('method'), postVars, this.get('fileName')]);
		},

	   /**
		* Cancels the upload of a specific file, if currently in progress.
		*
		* @method cancel
		* @param fileID {String} (optional) The ID of the file whose upload should be cancelled. If no ID is specified, all uploads are cancelled.
		*/	
		cancel : function (fileID /*String*/) {
			return this.uploaderswf.callSWF("cancel", [fileID]);
		},


		/**
		 * @private
		 * Setter for the 'multiFiles' property.
		 * @method setAllowMultipleFiles
		 * @param value {Boolean} The value for the 'multiFiles' property.
		 */
		setAllowMultipleFiles : function (value /*Boolean*/) {
			this.uploaderswf.callSWF("setAllowMultipleFiles", [value]);
		},

		/**
		 * @private
		 * Setter for the 'simLimit' property.
		 * @method setSimUploadLimit
		 * @param value {Boolean} The value for the 'simLimit' property.
		 */
		setSimUploadLimit : function (value /*int*/) {
			this.uploaderswf.callSWF("setSimUploadLimit", [value]);
		},

		/**
		 * @private
		 * Setter for the 'fileFilters' property.
		 * @method setFileFilters
		 * @param value {Boolean} The value for the 'fileFilters' property.
		 */	
		setFileFilters : function (fileFilters /*Array*/) {
			this.uploaderswf.callSWF("setFileFilters", [fileFilters]);
		},

	   /**
		* Enables the uploader user input (mouse clicks on the 'Browse' button). If the button skin 
		* is applied, the sprite is reset from the "disabled" state.
		*
		* @method enable
		*/	
		enable : function () {
			this.uploaderswf.callSWF("enable");
		},

	   /**
		* Disables the uploader user input (mouse clicks on the 'Browse' button). If the button skin 
		* is applied, the sprite is set to the 'disabled' state.
		*
		* @method enable
		*/	
		disable : function () {
			this.uploaderswf.callSWF("disable");
		},

		/**
		 * @private
		 * Called when the uploader SWF is initialized
		 * @method _initializeUploader
		 * @param event {Object} The event to be propagated from Flash.
		 */
		_initializeUploader: function (event) {
				this.publish("ready", {fireOnce:true});
				this.fire("ready", {});
		},

		/**
		 * @private
		 * Called when an event is dispatched from Uploader
		 * @method _relayEvent
		 * @param event {Object} The event to be propagated from Flash.
		 */	
		_relayEvent: function (event) {
			 if(event.data){
				 event.responseText = event.data;
			 }
			 if(event.fileList){
				event.files = event.fileList;
			 }
			 this.fire(event.type, event);
		},
		/**
		 * @description start run the timer for checking timeout
		 * @access private
		 */
		_onUploaderStart: function(event){
			var self = this, 
				eid = event.id, 
				waittime = this.get('timeout');
			
			if(waittime<=0){
				return;
			}
			if(this._timers[eid]){
				clearTimeout(this._timers[eid]);
			}
			this._timers[eid] = setTimeout(function(){
				clearTimeout(self._timers[eid]);
				delete self._timers[eid];
				self.cancel(eid);
				self.fire('uploadtimeout', {id: eid});
			}, waittime);
		},
		/**
		 * @description stop the timer for checking timeout
		 * @access private
		 */
		_onUploaderCompleteData: function(event){
			var eid = event.id;
			this.removeFile(eid);
			if(this._timers[eid]){
				clearTimeout(this._timers[eid]);
				delete this._timers[eid];
			}
		},
		/**
		 * @description format toString
		 * @access public
		 */
		toString: function(){
			return "UploaderFlashAdapter " + this._id;
		}

	},
	{
		ATTRS: {
		  
			
			/**
			 * The URL of the image sprite for skinning the uploader's 'Browse' button.
			 *
			 * @attribute buttonSkin
			 * @type {String}
			 * @default null
			 * @writeOnce
			 */
			buttonSkin : {
				value: null,
				writeOnce: 'initOnly'
			},
			
			/**
			 * The flag indicating whether the uploader is rendered 
			 * with a transparent background.
			 *
			 * @attribute transparent
			 * @type {Boolean}
			 * @default true
			 * @writeOnce
			 */
			transparent : {
				value: true,
				writeOnce: 'initOnly'
			},
			
			/**
			 * The URL of the uploader's SWF.
			 *
			 * @attribute swfURL
			 * @type {String}
			 * @default "assets/uploader.swf"
			 * @writeOnce
			 */
			swfURL : {
				value : SWFURL
			}
			
		},
		
		/**
		 * @description check if the flash plugin is available.
		 * @access public
		 */
		available: function(){
			return Y.SWFDetect.isFlashVersionAtLeast(9);
		}
			
	});

	Y.UploaderFlash = UploaderFlash;

}, '1.0.2' ,{requires:['k2-uploader-abstract', 'k2-swf']});