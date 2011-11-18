/*!
 * @revision:
 */
/*
 * @author: <a href="zhengxie.lj@taobao.com">zhengxie</a>
 * @version:1-0-2
 */
YUI.add('k2-uploader', function(Y) {
	
	/**
	 * @description Uploader is a facade class for uploading files
	 * @extend UploaderAbstract
	 * @ param configuration object
	 *		{
	 *			adapterClass: {Class}
	 *		}
	 * if the adapterClass declared, uploader use the adapterClass to upload file,
	 * else the Uploader find a suitable UploaderAbstract sub-class.
	 */
	function Uploader (config /*Object*/) {
		config = config || {};

		if(Y.UploaderFlash){
			Y.Uploader.addAdapterClass(Y.UploaderFlash, 1);
		}
		if(Y.UploaderHtml5){
			Y.Uploader.addAdapterClass(Y.UploaderHtml5, 2);
		}

		if(!config.adapterClass || !config.adapterClass.available()){
			config.adapterClass = Uploader.getAdapter();
		}
		Uploader.superclass.constructor.apply(this, arguments);
	};
	
	Y.extend(Uploader, Y.UploaderAbstract, {
		
		/**
		 * @description the adapter instance for uploading {UploaderAbstract}
		 */
		adapter: null,
		/**
		 * indicate the instance is ready to use, such as setFileFilters, setAllowMultipleFiles in SWF env.
		 */
		_isReady: false,
		/**
		 * @description pre-initialize the instance
		 * @access protect
		 *
		 * @param options {Object} used to configuration this instance
		 */
		init : function (options) {
			this.set('adapterClass', options.adapterClass);
			
			Uploader.superclass.init.apply(this, arguments);
			this._initAdapter(options);
		},
		/**
		 * @description
		 * @access private
		 * 
		 * @param options {Object} used to configuration this instance
		 */
		_initAdapter: function(options){
			var relEvent = Y.bind(this._relayEvent, this),
					aC = this.get('adapterClass'),
					node,
					adapter;
			
			if(aC == Y.UploaderHtml5 || aC  == Y.UploaderIO){
			
				var cid = Y.guid('k2-uploader-form-'),
					tag = options.tag || "form",
					inputFunction = options.inputFunction,
					inputNode;

				nodeStr = '<'+tag+' id="'+cid+'" class="k2-uploader-form"></'+tag+'>';
				node = Y.Node.create(nodeStr);
				inputNode =Y.Node.create('<input class="k2-uploader-input" type="file" name="'+this.get('fileName')+'"/>');
				if(Y.Lang.isFunction(inputFunction)){
					inputFunction(inputNode);
				}
				node.appendChild(inputNode);
			}else{
				node = Y.Node.create('<div class="k2-uploader-swf"></div>');
			}
			
			Y.one(options.container).appendChild(node);
			options.container = node;
			adapter = this.adapter = new aC(options);
			
			this.container = adapter.container;

			adapter.on ("ready", relEvent);
			adapter.on ("click", relEvent);
			adapter.on ("fileselect", relEvent);
			adapter.on ("uploadcancel", relEvent);
			adapter.on ("uploadcompletedata", relEvent);
			adapter.on ("uploaderror", relEvent);
			adapter.on ("uploadprogress", relEvent);
			adapter.on ("uploadstart", relEvent);
			adapter.on ("uploadtimeout", relEvent);
			this._isReady = adapter._isReady;
		},
		/**
		 * add ready callback
		 */
		addReadyCallback: function(callback){
			var self = this;
			if(this.adapter._isReady){
				self._isReady = true;
				callback();
			}else{
				this.adapter.on('ready', function(){
					self._isReady = true;
					callback();
				});
			}
		},
		/**
		 * @description re-dispatch the events come from the adapter instance.
		 * @access private
		 */
		_relayEvent: function (event) {
			var t = event.type;
			if(t.indexOf(':') !== -1){
				t= t.split(":")[1];
			}
			this.fire(t, event);
		},
		/**
		 * @description the following methods are the public method
		 * defined in the UploaderAbstract class
		 * @see UploaderAbstract
		 */
		//-------------------- implements start----------------// 
		removeFile : function (fileID /*String*/) {
			return  this.adapter.removeFile(fileID);
		},

		clearFileList : function () {
			return  this.adapter.clearFileList();
		},

		upload : function (fileID, postVars) {
			return  this.adapter.upload(fileID, postVars);
		},

		uploadThese : function (fileIDs /*Array*/, postVars /*Object*/) {
			return  this.adapter.uploadThese(fileIDs, postVars);
		},

		uploadAll : function (postVars /*Object*/) {
			return  this.adapter.uploadAll(postVars);
		},

		cancel : function (fileID /*String*/) {
			return  this.adapter.cancel(fileID);
		},

		setAllowMultipleFiles : function (value /*Boolean*/) {
			 this.adapter.setAllowMultipleFiles(value);
		},

		setSimUploadLimit : function (value /*int*/) {
			this.adapter.setSimUploadLimit(value);
		},

		setFileFilters : function (fileFilters /*Array*/) {
			 this.adapter.setFileFilters(fileFilters);
		},
		clearLoaded: function(){
			this.adapter.clearLoaded();
		},
		getLoaded: function(){
			return this.adapter.getLoaded();
		},
		enable : function () {
			 this.adapter.enable();
		},
		disable : function () {
			 this.adapter.disable();
		},
		//-------------------- implements end ----------------// 

		toString: function(){
			return 'Uploader - ' +  this.adapter.toString();
		}

	},
	{
		ATTRS: {
			
			/**
			 * @description this is an optional config option,
			 * indicate the adapter constructor(implement)
			 */
			adapterClass : {
				value: null
			}
			
		},
		
		NAME: 'Uploader',
		
		/**
		 * @description adapter check list. Uploader will find a suitebale implements from this list.
		 * @access protect
		 */
		adapterList: [Y.UploaderIO],
		
		/**
		 * @description add a adapter class to the check list.
		 * @access public
		 */
		addAdapterClass: function(adapterClass, priority){
			priority = priority || 0;
			if(this.adapterList[priority]){
				this.addAdapterClass(adapterClass, priority+1);
			}else{
				this.adapterList[priority] = adapterClass
			}
		},
		
		/**
		 * @description find a suitable adapter class.
		 * @access protect
		 */
		getAdapter: function(){
			var l = this.adapterList.length;
			while(l-- > 0){
				var adapter = this.adapterList[l];
				if(adapter && adapter.available()){
					return adapter;
				}
			}
			return Y.UploaderIO;
		}
	});

	Y.Uploader = Uploader;

}, '1.0.2' ,{requires:['k2-uploader-abstract', 'k2-uploader-io'], optional:['k2-uploader-flash', 'k2-uploader-html5']});