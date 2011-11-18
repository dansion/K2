/*!
 * @revision:
 */
/*
 * @author: <a href="zhengxie.lj@taobao.com">zhengxie</a>
 * @version:1-0-1
 */
YUI.add('k2-uploader-abstract', function(Y) {
	
	/**
	 * @constructor UploaderAbstract
	 * @extend Base
	 * @description UploaderAbstract is an abstract class for uploading file.
	 * 
	 * @events
	 *	    ready							- the instance is ready.
	 *		fileselect						- file(s) had beed selected.
	 *		uploadstart					- the upload task is open.
	 *		uploadcancel				- the upload cancelled by user or cancelled automatically if the error occured.
	 *		uploadcompletedata		- the upload task is complete.
	 *		uploaderror					- the upload task occur an error.
	 *		uploadprogress				- the upload task is in progress.
	 *		uploadtimeout				- the upload task is timeout.
	 *		click							- the upload button or input has beed clicked.
	 */
	function UploaderAbstract (config /*Object*/) {
		UploaderAbstract.superclass.constructor.apply(this, arguments);
	};

	Y.extend(UploaderAbstract, Y.Base, {

		/**
		 * @description the instance id
		 * @access protected
		 */
		_id:"",

		/**
		 * @description the file map used to record the files added by User Interface.
		 * @access protected
		 */
		_files: {},

		/**
		 * @description the timer map used to implements the timeout feature.
		 * @access protected
		 */
		_timers : {},

		/**
		 * @description the loaded map used to cache the response text which files had beed upload completely.
		 * @access protected
		 */
		_loaded : {},
		
		/**
		 * indicate the instance is ready to use, such as setFileFilters, setAllowMultipleFiles in SWF env.
		 */
		_isReady: true,
		/**
		 * @description indicator the YUI Node {Node} which is an user Interface for uploading
		 */
		container: null,
		/**
		 * @description used to initialize the instance property.
		 * @access protected
		 */
		initializer: function(options){
			this._id = Y.guid('k2-uploader-');
			this.on('uploadcompletedata', Y.bind(function(e){
				this._loaded[e.id] = {id: e.id, responseText: e.responseText}
			}, this));
			this.createChildren();
		},
		
		/**
		 * @description used to create DOM element and add event listeners
		 * @access protected
		 */
		createChildren: function(){

		},
		/**
		 * add ready callback
		 */
		addReadyCallback: function(callback){
			if(this._isReady){
				callback();
			}else{
				this.on('ready', function(){
					callback();
				});
			}
		},
		/**
		 * @description remove a file by file ID, if the file ID is null, then remove all the file in the waiting queue.
		 * @access public 
		 *
		 * @param fileID {String}
		 */
		removeFile : function (fileID /*String*/) {
			if(fileID==null){
				this.clearFileList();
			}else if(this.$files[fileID]){
				delete this.$files[fileID];
			}
		},
		/**
		 * @description remove all the file in the waiting queue.
		 * @access public
		 */
		clearFileList : function () {
			this.$files = {};
		},
		/**
		 * @description upload a file by the relatived fileID.
		 * @access public
		 *
		 * @param fileID {String} default is null, if the fileID is null, then the uploadAll method will be called.
		 * @param postVars {Object} extra parameters following the HTTP request.
		 */
		upload : function (fileID /*String*/, postVars /*Object*/) {
			if(!fileID){
				this.uploadAll(postVars);
			}else{
				this.$upload(fileID, postVars);
			}
		},
		/**
		 * @description upload a set of file by declaring a file id set
		 * @access public
		 *
		 * @param fileID {Array} the file id set
		 * @param postVars {Object} extra parameters following the HTTP request.
		 */
		uploadThese : function (fileIDs /*Array*/, postVars /*Object*/) {
			for(var i in fileIDs){
				this.$upload(i, postVars);
			}
		},
		/**
		 * @description upload all the files selected by the user.
		 * upload all the file added in the upload queue.
		 *
		 * @param postVars {Object} extra parameters following the HTTP request.
		 */
		uploadAll : function (postVars /*Object*/) {
			for(var i in this._files){
				this.$upload(i, postVars);
			}
		},
		/**
		 * @description abort the upload task by a relatived fileID
		 * @access public
		 *
		 * @param fileID {String} upload task id.
		 */
		cancel : function (fileID /*String*/) {
			if(fileID == null){
				for(var i in this._files){
					this.$cancel(fileID);
				}
			}else if(this._files[fileID]){
				this.$cancel(fileID);
			}
		},
		/**
		 * @description upload a file by file ID, different implements has different method to upload file.
		 * @access protect
		 */
		$upload: function(fileID, postVars){
			throw new Error("this is an abstract method");
		},
		/**
		 * @description cancel a upload request, different implements has different method to abort a http request.
		 * @access protect
		 *
		 * @param fileID {String} upload task id.
		 */
		$cancel: function(fileID){
			throw new Error("this is an abstract method");
		},
		/**
		 * @description clear the upload task history
		 * @access public
		 */
		clearLoaded: function(){
			this._loaded = {}
		},
		/**
		 * @description get the response which had been uploaded.
		 * @access public
		 */
		getLoaded: function(){
			return this._loaded;
		},
		/**
		 * @description get the response which had been uploaded.
		 * @access public
		 */
		setAllowMultipleFiles : function (value /*Boolean*/) {

		},
		/**
		 * @description get the response which had been uploaded.
		 * @access public
		 */
		setSimUploadLimit : function (value /*int*/) {

		},
		/**
		 * @description get the response which had been uploaded.
		 * @access public
		 */
		setFileFilters : function (fileFilters /*Array*/) {
			
		},
		/**
		 * @description check if a special file name is a allowed extension
		 * @access public
		 *
		 * @param fileName {String} file name need to check
		 * @pram allowed {Array} file allowed extensions ['jpg', 'png', 'gif']
		 */
		isAllowedExtension: function(fileName, allowed){
			var ext = (-1 !== fileName.indexOf('.')) ? fileName.replace(/.*[.]/, '').toLowerCase() : '';
			
			
			if (!allowed || allowed.length){return true;}        
			
			for (var i=0; i<allowed.length; i++){
				if (allowed[i].toLowerCase() == ext){ return true;}    
			}
			return false;
		}, 
		/**
		 * @description override the toString method
		 * @return {String}
		 */
		toString: function(){
			return "UploaderAbstract " + this._id;
		}

	},
	{
		ATTRS: {
			
			/**
			 * @description indicate if the user can select multiple files at one time.
			 */
			multiFiles : {
				value: false,
				setter : "setAllowMultipleFiles"
			},
			/**
			 * @description 
			 */
			simLimit : {
				value: 2,
				setter : "setSimUploadLimit"
			},
			
			/**
			 * @description the file filters used to filter the file select window
			 */
			fileFilters : {
				value: [],
				setter : "setFileFilters"
			},
			
			/**
			 * @description the DOM selector string, it's format could be #id, .css or composite selector
			 */
			container : {
				value: null,
				writeOnce: 'initOnly'
			},
			
			/**
			 * @description the HTTP request endpoint
			 */
			action: {
				value: null
			},
			
			/**
			 * @description the HTTP request method
			 */
			method: {
				value: 'POST'
			},
			
			/**
			 * @description the file name paramter in the HTTP request.
			 */
			fileName: {
				value: 'uploadFile'
			},
			
			/**
			 * @description timeout duration of the HTTP request
			 */
			timeout: {
				value: 20000
			}
		},
		
		/**
		 * @description abstract used in Uploader class.
		 * @see uploader.js
		 * @module-name k2-uploader
		 */
		available: function(){
			return false;
		}
	});

	Y.UploaderAbstract = UploaderAbstract;

}, '1.0.1' ,{requires:['base-base']});