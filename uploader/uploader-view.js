/*!
 * @revision:
 */
/*
 * @author: zhengxie.lj@taobao.com
 * @version:1-0-3
 */
YUI.add('k2-uploader-view', function(Y) {
	
	/**
	 * UploaderView is a User Interface used to upload an image.
	 *
	 */
	function UploaderView(){
		UploaderView.superclass.constructor.apply(this, arguments);
	}

	Y.extend(UploaderView, Y.Base, {

		uploader: null,
		uploadButton: null,
		barContainer: null,
		barDiv: null,
		progDiv: null,
		cacelButton: null,
		previewDiv: null,
		imageDiv: null,
		deleteButton: null,
		uploadContainer:null,
		container: null,
		
		/**
		 * First of all, initialize the View. In the second, bind event listeners.
		 */
		initializer: function(options){
			options = options || {};
			this.container = Y.one(this.get("container"));
			this.createChildren(options);

			this.deleteButton.on('click', Y.bind(function(event){
				event.halt();
				this.removeImage();
			}, this));
			this.cancelButton.on('click', Y.bind(function(event){
				event.halt();
				this.onUploadCancel();
			}, this));
			var onReady = Y.bind(function(event){
				this.onUploaderReady(event);
				if(options.previewData){
					this.onUploadCompleteData({responseText:options.previewData});
				}
			}, this);
			
			this.uploader.addReadyCallback(onReady);
		},
		/**
		 * create the view DOM, and instantiate a Uploader instance.
		 */
		createChildren: function(options){
			var Node = Y.Node,
			 buttonID = Y.guid('k2-upload-'),
			 uploadButton = Node.create('<div id="' + buttonID + '" class="upload-button"></div>'),
			 barContainer = Node.create('<div class="upload-bar-container" style="display:none;"></div>'),
			 barDiv = Node.create('<div class="upload-bar"></div>'),
			 progDiv = Node.create('<div class="upload-progress"></div>'),
			 progLabel = Node.create('<span class="upload-prog-label"></span>'),
			 cancelButton = Node.create('<a class="upload-cancel" href="#">取消上传</a>'),
			 previewDiv = Node.create('<div class="upload-preview" style="display:none;"></div>'),
			 imageDiv = Node.create('<div class="upload-image"></div>'),
			 deleteButton = Node.create('<a class="upload-delete" href="#" title="重新上传">重新上传</a>'),
			 uploadContainer = Node.create('<div class="k2-upload-view k2-fix-float"></div>'),
			 noticeDiv = Node.create('<div class="upload-notice" style="display:none;"></div>'),
			 container = Y.one(this.get("container"));

			uploadContainer.appendChild(uploadButton);
			uploadContainer.appendChild(noticeDiv);
			barContainer.appendChild(barDiv);
			barContainer.appendChild(cancelButton);
			barDiv.appendChild(progDiv);
			barDiv.appendChild(progLabel);
			uploadContainer.appendChild(barContainer);
			previewDiv.appendChild(imageDiv);
			previewDiv.appendChild(deleteButton);
			uploadContainer.appendChild(previewDiv);
			
			this.container.appendChild(uploadContainer);

			
			this.noticeDiv = noticeDiv;
			this.progDiv = progDiv;
			this.progLabel = progLabel;
			this.imageDiv = imageDiv;
			this.uploadContainer = uploadContainer;
			this.barContainer = barContainer;
			this.barDiv = barDiv;
			this.previewDiv = previewDiv;
			this.uploadButton = uploadButton;
			this.cancelButton = cancelButton;
			this.deleteButton = deleteButton;
		
			var action = (options.action || UploaderView.ENDPOINT)
			
			if(options.adapterClass == Y.UploaderFlash){
				options.adapterClass = null;
			}
			this.uploader = options.uploader || new Y.Uploader({
				container: '#' + buttonID,
				adapterClass: options.adapterClass,
				action: action
			});
			
			var useFlashUpload = false;
			if (Y.UploaderFlash && (this.uploader instanceof Y.UploaderFlash)){
				useFlashUpload = true;
			}else if(Y.Uploader && Y.UploaderFlash && (this.uploader instanceof Y.Uploader)){
				if(this.uploader.adapter instanceof Y.UploaderFlash){
					useFlashUpload = true;
				}
			}

			if(!useFlashUpload){
				this.uploadContainer.addClass('k2-html-type');
			}
			this.useFlashUpload = useFlashUpload;
		},


		/**
		 * on the uploader SWF ready, set the file filters dialog to image type, 
		 * and add event listeners to the uploader, such as fileselect, uploadstart, etc...
		 */
		onUploaderReady: function(event){
		
			var ff = [{description:"Images", extensions:"*.jpg;*.png;*.gif"}],
				 uploader = this.uploader;

			uploader.setFileFilters(ff); 
			uploader.on('fileselect', Y.bind(this.onFileSelect, this));
			uploader.on('uploadstart', Y.bind(this.onUploadStart, this)); 
			uploader.on('uploadprogress', Y.bind(this.onUploadProgress, this));
			uploader.on('uploadcompletedata', Y.bind(this.onUploadCompleteData, this));
			uploader.on('uploaderror', Y.bind(this.onUploadError, this));

			
		},
		toggleUploadButton: function(b){
			if(b){
				this.uploader.enable();
			}else{
				this.uploader.disable();
			}
		},
		/**
		 * while the user select a file by the dialog window, the upload task start soon.
		 */
		onFileSelect: function(event){
		
			var fl = event.fileList || event.files, file;
			for(var i in fl){
				file = fl[i];
				break;
			}
		
			this.noticeDiv.setStyle('display', 'none');

			this.uploader.upload(file.id);
		},
		/**
		 * on the SWF listen the HTTP open event, then hide the select button and
		 * show the progress bar, also set the bar progress to 0%.
		 */
		onUploadStart: function(event){
			this.progDiv.setStyle('width', '0%');
			this.barContainer.setStyle('display', 'block');
			this.uploadButton.setStyle('display', 'none');
		},
		/**
		 * on the SWF listen the HTTP progress event, then update the progress bar.
		 */
		onUploadProgress: function(event){
			var prog = Math.round(100*(event["bytesLoaded"]/event["bytesTotal"])); 
			this.progDiv.setStyle('width', prog + '%');
			this.progLabel.set('innerHTML', prog + '%');
		},
		
		/**
		 * the the upload cancelled, show the file selection button and hide the progress bar.
		 */
		onUploadCancel: function(){
			this.barContainer.setStyle('display', 'none');
			this.toggleUploadButton(true);
		},
		/**
		 * on the upload task completed, if the server response is OK, show the image
		 * @event imageUploaded
		 */
		onUploadCompleteData: function(event){
			var data;
			if(Y.Lang.isString(event.responseText)){
				try{
					data = Y.JSON.parse(event.responseText);
				}catch(e){
					this.onUploadError(null, '图片上传失败，请重试！');
					return;
				}
			}
			
			data = data || {message: null}
			if(data.code == 200){
			
				var url = UploaderView.formatImageURI(data, this.get('width'), this.get('height'));
	
				this.setImage(url);
				this.fire("imageUploaded", {
					url: url,
					id: data.id,
					m: data.m,
					n: data.n,
					data: data,
					origin_data: event.responseText
				});
				this.barContainer.setStyle('display', 'none');
				this.previewDiv.setStyle('display', 'block');
				this.uploadButton.setStyle('display', 'none');
			}else{
				this.onUploadError(null, data.message);
			}
		},
		/**
		 * if the error ocurr, show the error message.
		 */
		onUploadError: function(event, msg){
			this.barContainer.setStyle('display', 'none');
			this.toggleUploadButton(true);
			this.uploadButton.setStyle('display', 'block');
			if(msg){
				this.noticeDiv.set('innerHTML', msg);
				this.noticeDiv.setStyle('display', 'block');
			}
		},
		/**
		 * add a image to the preview division by a url.
		 * @event imageUploaded.
		 */
		setImage: function(url){
			this.imageDiv.set('innerHTML', '<img src="' + url + '"/>');
		},
		/**
		 * remove the image form the preview division.
		 */
		removeImage: function(){
			this.previewDiv.setStyle('display', 'none');
			this.uploadButton.setStyle('display', 'block');
			this.toggleUploadButton(true);
			this.imageDiv.set('innerHTML', '');
		}
		
	},
	{
		NAME: 'UploaderView',
		ATTRS:{
			container: {
				value: null,
				writeOnce: 'initOnly'
			},
			width:{
				value: 100
			},
			height:{
				value: 100
			}
		},
		ENDPOINT: '/common/marlineup.html',
		IMAGE_DOMAIN: 'http://img1.kbcdn.com/?',


		/**
		 * format a image URI by options, the image width and image height.
		 * @access public static
		 *
		 * @param options:{Object} image options {id, n, m}
		 * @param w{Number} image width
		 * @param h{Number} image height
		 *
		 * @return {String} image URI
		 */
		formatImageURI: function(options, w, h){
			var aType=options.t.split('/'),
				 domain = this.IMAGE_DOMAIN;

			options.t = aType[1]=='jpeg'?'jpg':aType[1];
			options.t = aType[1]=='pjpeg'?'jpg':aType[1];
			w = w || 100;
			h = h || 100;
			return domain+'id='+options.id+'&n='+options.n+'&m='+options.m+'&w='+w+'&h='+h+'&t='+options.t;
		}
		
	});

	Y.UploaderView = UploaderView;

}, '1.0.2', {requires:['k2-uploader', 'json-parse', 'k2-uploader-style', 'node-style']});