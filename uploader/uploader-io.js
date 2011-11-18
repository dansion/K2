/*!
 * @revision:
 */
/*
 * @author: <a href="zhengxie.lj@taobao.com">zhengxie</a>
 * @version:1-0-3
 */
YUI.add('k2-uploader-io', function(Y) {
	
	/**
	 * @description Upload file by iframe. Creating a iframe and set the form target to this iframe.
	 * use form to select file and using iframe to transport data. 
	 *
	 * @extend UploaderAbstract
	 */
	function UploaderIO(config) {
		UploaderIO.superclass.constructor.apply(this, arguments);
		this.ioHandler = [];
	};

	Y.extend(UploaderIO, Y.UploaderAbstract, {

		/**
		 * @description the input node for select file(s). 
		 * @access protect
		 */
		inputNode : null,
		
		/**
		 * @description used to create DOM element and add event listeners
		 * @access protected
		 */
		createChildren : function () {
			this.container = Y.one(this.get('container'));
			this.inputNode = this.container.one('input[name='+this.get('fileName')+']');
			if(this.inputNode){
				this.inputNode.on('change', Y.bind(this._onFileSelected, this));
				this.inputNode.set('value', '');
			}
			this.clearFileList();
			this.fire('ready');
		},
		
		/**
		 * @description while the file(s) selected, the fileselect event fired.
		 * @access private
		 */
		_onFileSelected: function(e){
			var files = [e], l = 1, selected=[];
			for(var i = 0; i < l; i++){
				var id = Y.guid();
				selected.push({id: id, file: files[i]});
				this._files[id] = files[i];
			}
			this.fire('fileselect', {files:selected});
		},
		/**
		 * Sends the file identified by id and additional query params to the server
		 * @access protect
		 *
		 * @param id {String} the file id used to upload
		 * @param params {Object}  name-value string pairs
		 */    
		$upload : function (fileID /*String*/, postVars /*Object*/) {
			var self = this,
				 timeout = this.get('timeout');

			if(timeout<=0){
				timeout = undefined;
			};
			var cfg = {
				data:postVars,
				form: {
					id: this.container.get('id'),
					upload: true
				},
				timeout: this.get('timeout'),
				on: {
					complete: function(i, o){
						self.removeTaskFromList(fileID);
						self.resetInputValue();
						if(o==null){
							self.fire('uploadtimeout',  {id: fileID});
							return;
						}
						self.fire('uploadcompletedata', {id:fileID, responseText:o.responseText});
					},

					failure: function(i, o){
						self.removeTaskFromList(fileID);
						self.resetInputValue();
						self.fire('uploaderror',  {id: fileID});
					},
					timeout: function(i, o){
						self.removeTaskFromList(fileID);
						self.resetInputValue();
						self.fire('uploadtimeout',  {id: fileID});
					}
				}
			}
			this.ioHandler[fileID] = Y.io(this.get('action'), cfg);
			this.fire('uploadstart', {id: fileID});
			if(this.inputNode){
				this.inputNode.setAttribute('disabled', 'disabled');
			}
		},
		removeTaskFromList: function(id){
			delete this._files[id];
			delete this.ioHandler[id];
		},
		/**
		 * @description reset the input value
		 * @access protect
		 */
		resetInputValue: function(){
			Y.log("uploader-io reset input element");
			if(this.inputNode){
				var p = this.inputNode.get('parentNode');
				try{
					var newNode = this.inputNode.cloneNode();
					 this.inputNode.remove(true);
					p.appendChild(newNode);
					this.inputNode = newNode;
					if(this.inputNode){
						this.inputNode.on('change', Y.bind(this._onFileSelected, this));
						this.inputNode.removeAttribute('disabled');
					}
				}catch(e){Y.log(e);}
				
			}
		},
		/**
		 * @description cancel a special upload task by file id
		 * @access protect
		 */
		$cancel: function(id){
			if(!this._files[id]){
				return;
			}
			this.resetInputValue();
			this.fire('uploadcancel', {id: id});
			this._files[id] = null;
			this.ioHandler[id].abort();
			delete this.ioHandler[id];
		},
		
		/**
		 * @description not support multiple files selected in this class.
		 * @access public
		 *
		 */
		setAllowMultipleFiles : function (value /*Boolean*/) {
			return false
		},
		/**
		 * @description there is no limitation in the same time always.
		 * @access public
		 * 
		 * @param value {int} the sim upload limitation.
		 */
		setSimUploadLimit : function (value /*int*/) {
			return 0;
		},
		/**
		 * @description not support setting file filters in this class.
		 * @access public
		 *
		 * @param fileFilters {Array}
		 */
		setFileFilters : function (fileFilters /*Array*/) {
			return false;
		},
		/**
		 * @description enable the upload feature
		 * @access public
		 */
		enable : function () {
			if(this.inputNode){
				this.inputNode.detach('click');
			}
		},
		/**
		 * @description disable the upload feature
		 * @access public
		 */
		disable : function () {
			if(this.inputNode){
				this.inputNode.on('click', this._onClick);
			}
		},
		/**
		 * @description execute while the input node clicked.
		 * @access private
		 */
		_onClick: function(e){
			e.halt();
			this.fire('click');
		},
		/**
		 * @description get the file name of a file by file id.
		 * @access public
		 */
		getName: function(id){        
			var file = this._files[id];
			if(file == null){
				return null;
			}
			// fix missing name in Safari 4
			var filename = file.fileName != null ? file.fileName : file.name;
			if(filename == null){
				return null;
			}
			return filename.replace(/.*(\/|\\)/, "");
		},
		/**
		 * @description get the file size of a file by file id.
		 * @access public
		 */
		getSize: function(id){
			var file = this._files[id];
			return file.fileSize != null ? file.fileSize : file.size;
		},

		/**
		 * @description format toString
		 * @access public
		 */
		toString: function(){
			return "UploaderIO " + this._id;
		}
	},
	{
		NAME: 'UploaderIO',
		
		/**
		 * @description the IO transfer feature is always available.
		 * @access public
		 */
		available: function(){
			return true;
		}
	});

	Y.UploaderIO = UploaderIO;


}, '1.0.3' ,{requires:['k2-uploader-abstract', 'node-base', 'io-upload-iframe', 'querystring-stringify']});