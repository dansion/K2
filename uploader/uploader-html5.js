/*!
 * @revision:
 */
/*
 * @author: <a href="zhengxie.lj@taobao.com">zhengxie</a>
 * @version:1-0-2
 */
YUI.add('k2-uploader-html5', function(Y) {


	/**
	 * @description Upload file by file control, which is the input element with the type is 'file', in HTML5.
	 * If the browser is an advanced agent, then the upload progress is available, and we can
	 * use XMLHTTPRequest or FormData to send a HTTP request for uploading instead of using iframe.
	 *
	 * @extend UploaderAbstract
	 */
	function UploaderHtml5 (config) {
		this._xhrs = {};
		
		UploaderHtml5.superclass.constructor.apply(this, arguments);
		if(config.dropzone){
			this.set('dropzone', config.dropzone);
		}

		//if the 'dropzone' declared, the using drag & drop feature to upload files.
		var dz = this.get('dropzone');
		if(dz){
			dz.on('drop', Y.bind(function(event){
				event.halt();
				var allTheFiles = event._event.dataTransfer.files;
				this.fire('drop', {files: allTheFiles});
				this._onFileSelected(allTheFiles, true);
				
			}, this));
		}
	};
	
	Y.extend(UploaderHtml5, Y.UploaderAbstract, {
		
		/**
		 * @description the input node for select file(s). 
		 * @access protect
		 */
		inputNode : null,
	
		/**
		 * @description used to create DOM element and add event listeners
		 * @access protect
		 */
		createChildren : function () {
			this.container = Y.one(this.get('container'));
			this.inputNode = this.container.one('input[name='+this.get('fileName')+']');
			if(this.inputNode){
				this.inputNode.on('change', Y.bind(this._onFileSelected, this));
				this.inputNode.set('value', '');
			}
			this.clearFileList();
		},
		/**
		 * while the file(s) selected, the fileselect event fired.
		 * @event fileselect
		 */
		_onFileSelected: function(e, dropAction){
			var files, l , selected=[];
			if(dropAction){
				files = e;
			}else{
				files = this.inputNode._node.files
			}
			l = files.length;

			for(var i = 0; i < l; i++){
				var id =  Y.guid();
				selected.push({id:id, file: files[i]});
				this._files[id] = files[i];
			}
			this.fire('fileselect', {files:selected});
		},
		
		/**
		 * @description set if the user can select multi files for uploading in one time.
		 * @access public
		 *
		 * @param value {Boolean} if the multiple file can be selected at one time.
		 */
		setAllowMultipleFiles : function (value /*Boolean*/) {
			if(this.inputNode){
				if(value){
					this.inputNode.setAttribute("multiple", "multiple");
				}else{
					this.inputNode.removeAttribute("multiple");
				}
			}
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
		 * Sends the file identified by id and additional query params to the server
		 * @access protect
		 *
		 * @param id {String} the file id used to upload
		 * @param params {Object}  name-value string pairs
		 */    
		$upload: function(id, params){
			 
			var file = this._files[id],
				name = this.getName(id),
				size = this.getSize(id),
				xhr = this._xhrs[id] = new XMLHttpRequest(),
				self = this, 
				fileParamName = this.get('fileName');
			
								
			xhr.upload.onprogress = function(e){
				if (e.lengthComputable){
					self._onProgress(id, name, e.loaded, e.total);
				}
			};

			xhr.onreadystatechange = function(){            
				if (xhr.readyState == 4){
					self._onComplete(id, xhr);                    
				}
			};

			// build query string
			params = params || {};
			params[fileParamName] = name;
			var queryString = this.get('action') ;
			
			xhr.open(this.get('method'), queryString, true);
			xhr.setRequestHeader("Cache-Control", "no-cache");
			xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
			xhr.setRequestHeader("X-File-Name", encodeURIComponent(name));
			xhr.setRequestHeader("X-File-Size", size);


				
			if (window.FormData) {
				
					//Many thanks to scottt.tw
					var f = new FormData();
					f.append(fileParamName, file);
					if(params && Y.Lang.isObject(params)){
						for(var i in params){
							f.append(i, params[i]);
						}
					}
					xhr.send(f);
			}else if (file.getAsBinary) {
					//Thanks to jm.schelcher
					var boundary = '------multipartformboundary' + (new Date).getTime();
					var dashdash = '--';
					var crlf     = '\r\n';

					/* Build RFC2388 string. */
					var builder = '';

					builder += dashdash;
					builder += boundary;
					builder += crlf;

					builder += 'Content-Disposition: form-data; name="'+ fileParamName +'"';
					//支持中文
					builder += '; filename="' + encodeURIComponent(name) + '"';
					builder += crlf;

					builder += 'Content-Type: application/octet-stream';
					builder += crlf;
					builder += crlf;

					/* Append binary data. */
					builder += file.getAsBinary();
					builder += crlf;

					

					/* Write parameters. */
					if(params && Y.Lang.isObject(params)){
						for(var i in params){
							if(params.hasOwnProperty(i)){
								builder += dashdash;
								builder += boundary;
								builder += crlf;

								builder += 'Content-Disposition: form-data; name="'+ i +'"';
								builder += crlf;
								builder += crlf;
								//支持中文
								builder += encodeURIComponent(params[i]);
								builder += crlf;
							}
						}
					}

					/* Write boundary. */
					builder += dashdash;
					builder += boundary;
					builder += dashdash;
					builder += crlf;
					xhr.setRequestHeader('content-type', 'multipart/form-data; boundary=' + boundary);
					xhr.sendAsBinary(builder);
			}


			//support timeout event
			var waittime = this.get('timeout');
			
			if(waittime>0){
				this._timers[id] = setTimeout(function(){
					clearTimeout(self._timers[id]);
					xhr.abort();
					self._xhrs[id] = self._files[id] = null;   
					self.resetInputValue();
					self.fire('uploadtimeout', {id: id});
					
				},waittime);
			}

		    this.fire('uploadstart', {id: id});
		},
		
		/**
		 * @description execute after the upload task complete, the request is closed.
		 * Then fire the complete event if the file uploaded successfully; otherwise, the error event dispatched
		 * @access private
		 */
		_onComplete: function(id, xhr){
			this.resetInputValue();
			// the request was aborted/cancelled
			if(this._timers[id]){
				clearTimeout(this._timers[id]);
			}

			if (!this._files[id]) return;
		

			var name = this.getName(id);
			var size = this.getSize(id);
			
			this._onProgress(id, name, size, size);
			if (xhr.status == 200){
				var response = xhr.responseText;
				this.fire('uploadcompletedata', {id: id, name: name, responseText: response});
			} else {                   
				this.fire('uploaderror', {id: id, name: name});
			}
					
			delete this._files[id];
			delete this._xhrs[id];        
		},
		/**
		 * @description fie the uploadprogress event
		 * @access private
		 */
		_onProgress: function(id, name, loaded, total){
			this.fire('uploadprogress', {id: id, bytesLoaded: loaded, bytesTotal: total});
		},
		/**
		 * @description reset the input value
		 * @access protect
		 */
		resetInputValue: function(){
			if(this.inputNode){
				this.inputNode.set('value', '');
			}
		},
		/**
		 * @description cancel a special upload task by id
		 * @access protect
		 */
		$cancel: function(id){
			this.resetInputValue();
			this.fire('uploadcancel', {id: id});
			delete this._files[id];
			
			if (this._xhrs[id]){
				this._xhrs[id].abort();
				delete this._xhrs[id];                                   
			}
		},

		toString: function(){
			return "UploaderHtml5 " + this._id;
		}

	},
	{
		NAME: 'UploaderHtml5',

		/**
		 * @description used to cache the available value,
		 *	then the value just need detect only one time.
		 * @access private
		 */
		_available: null,
		/**
		 * @description if the multiple attribute is available and the upload progress
		 *	is supported by browser, then this strategy is suitable
		 * @access public
		 */
		available: function(){
			if(this._available == null){
				//hack for sougo browser, forbidden the html5 in sougo
				var ua = navigator.userAgent.toLowerCase();
				if(ua.indexOf(" se ") >=0 && ua.indexOf("chrome")>=0){
					this._available = false;
					return false;
				}

				var input = document.createElement('input');
				input.type = 'file';        
				this._available = (
					'multiple' in input &&
					typeof File != "undefined" &&
					typeof (new XMLHttpRequest()).upload != "undefined" );
				this._available = (window.FormData || window.File) && this._available;
			}
			return this._available;
		}
	});

	Y.UploaderHtml5 = UploaderHtml5;

}, '1.0.2' ,{requires:['k2-uploader-abstract', 'node-base']});