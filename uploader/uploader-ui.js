/*!
 * @revision:
 */
/*
 * @author: zhengxie.lj@taobao.com
 * @version:1-0-4
 */
YUI.add('k2-uploader-ui', function(Y) {
	
	//forbidden Flash adapter
	Y.UploaderFlash = null;

	var $Event = {
		'FILE_UPLOADED' : 'imageUploaded'
	},
	$Text = {
		'FAILURE_ERROR': '上传失败！' ,
		'UNKNOW_ERROR': '网络传输出错',
		'FILE_SIZE_LIMIT': '图片大小限3M',
		'FILE_FORMAT_LIMIT': '图片文件格式限jpg/gif/png'
	};
	 /////////////////////////////////////////////////////////////////////////////////////////////////////////////
	 //Y.ImageCell
	 /////////////////////////////////////////////////////////////////////////////////////////////////////////////
	/**
	 * @access internal
	 * @description ImageCell是内部类，用来做图片的橱窗展示
	 *   untility class for UploaderUI
	 */
	function ImageCell(options){
		 if(!options || !options.container){
			throw new Error("The uploader container should not be undefined.");
			return;
		 }
		 var defaultOptions = {
			 label: {
				 "cancel": "取消",
				 "delete": "",
				 "reupload": "重新上传"
			 },
			 supportDesc: false,
			 supportProgress: false
		 };
		 this.options = Y.mix(options, defaultOptions, false, null, 0, true);
		 this.container = Y.one(options.container);
		 this.createChildren();
		 this.addEvents();
		 if(options.url){
			this.setImage(options.url);
		 }
	 };
		
	 ImageCell.prototype = {

		constructor: ImageCell,
		/**
		 * @access protected
		 * @description create node structure
		 * @param null
		 * @return void
		 */
		createChildren: function(){
			var Node = Y.Node,
				Label = this.options.label,
			 boundingBox = Node.create("<div class='k2-uploader-box'></div>"),
			 barContainer = Node.create('<div class="upload-bar-container" style="display:none;"></div>'),
			 barDiv = Node.create('<div class="uploader-bar"></div>'),
			 barInnerDiv = Node.create('<div class="uploader-bar-inner"></div>'),
			 progDiv = Node.create('<div class="uploader-progress"></div>'),
			 progLabel = Node.create('<span class="progress-label">100%</span>'),
			 previewDiv = Node.create('<div class="upload-preview" style="display:none;"></div>'),
			 imageDiv = Node.create('<div class="upload-image"></div>'),
			 deleteButton = Node.create('<a class="upload-delete" href="#" title="'+Label["delete"]+'">'+Label["delete"]+'</a>'),
			 fileNameNode = Node.create("<p class='file-name'></p>");
			 noticeDiv = Node.create('<div class="upload-notice" style="display:none;"></div>');
			
			if(this.options.supportProgress){
				barContainer.addClass("with-progress");
			}
			
			barDiv.appendChild(barInnerDiv)
			barInnerDiv.appendChild(progDiv);
			barDiv.appendChild(progLabel);
			barContainer.appendChild(barDiv);
			previewDiv.appendChild(imageDiv);
			this.container.setContent("");
			
			boundingBox.appendChild(barContainer);
			boundingBox.appendChild(previewDiv);
			boundingBox.appendChild(deleteButton);
			boundingBox.appendChild(fileNameNode);

			this.noticeDiv = noticeDiv;
			this.progDiv = progDiv;
			this.progLabel = progLabel;
			this.imageDiv = imageDiv;
			this.barContainer = barContainer;
			this.barDiv = barDiv;
			this.previewDiv = previewDiv;
			this.deleteButton = deleteButton;
			this.boundingBox = boundingBox;
			this.fileNameNode = fileNameNode;

			this.container.appendChild(boundingBox);
			if(this.options.supportDesc){
				var userInputNode = Node.create("<input type='text' class='user-input'/>");
				this.container.appendChild(userInputNode);
			}
		},
		/**
		 * @private
		 * @description add event listener for the view & controller
		 * @param null
		 * @return void
		 */
		addEvents: function(){
			this.deleteButton.on('click', this.onDeleteButtonClicked, this);
		},
		/**
		 * @private
		 * @description trigger while the delete button clicked
		 * @param event{Event}
		 * @return void
		 */
		onDeleteButtonClicked: function(e){
			e.halt();
			var type;
			if(this.inUploading){
				type  = "cancel"
			}else{
				type = "delete"
			}
			this.fire(type, {target:this, uploadTaskId: this.options.uploadTaskId});
		},
		/**
		 * @access public
		 * @description set the preview data
		 * @param value{Object}
		 * @return void
		 */
		setData: function(value){
			this.data = value;
		},
		/**
		 * @access public
		 * @description retrieve the preview data
		 * @param null
		 * @return Object
		 */
		getData: function(){
			return this.data;
		},
		/**
		 * @access public 
		 * @description set the preview responseTest
		 * @param value{String}
		 * @return void
		 */
		setResponseText: function(value){
			this.responseText = value;
		},
		/**
		 * @access public
		 * @description retrieve the preview responseTest
		 * @param null
		 * @return String
		 */
		getResponseText: function(){
			return this.responseText;
		},
		/**
		 * @access public
		 * @description set the preview image URL
		 * @param url{String}
		 * @return void
		 */
		setImage: function(url){
			this.previewDiv.setStyle("display", "block");
			this.barContainer.setStyle("display", "none");
			if(!url){
				this.imageDiv.setContent("");
			}else{
				this.imageDiv.setContent("<img src='"+url+"'/>");
			}
		},
		/**
		 * @access public
		 * @description toggle to the progress state
		 * @param filename{String}{optional}
		 * @return void
		 */
		startUpload: function(filename){
			this.inUploading = true;
			this.showProgress(0);
			if(filename){
				this.fileNameNode.setContent(filename).setStyle("display", "block");
			}
		},
		/**
		 * @access public
		 * @description toggle to the normal state from the progress state.
		 * @param null
		 * @return void
		 */
		stopUpload: function(){
			this.inUploading = false;
			this.fileNameNode.setContent("").setStyle("display", "none");
		},
		/**
		 * @access public
		 * @description show the progress node.
		 * @param null
		 * @return void
		 */
		showProgress: function(){
			this.barContainer.setStyle("display", "block");
		},
		/**
		 * @access public
		 * @description hide the progress node.
		 * @param null
		 * @return void
		 */
		hideProgress: function(){
			this.barContainer.setStyle("display", "none");
		},
		/**
		 * @access public
		 * @description set the progress bar value.
		 * @param n{Number}
		 * @return void
		 */
		setProgress: function(n){
			if(n < 0){ 
				n = 0
			}else if(n>1){
				n = 1
			};
			n = Math.floor(n*100) + "%";
			this.progDiv.setStyle('width', n);
			this.progLabel.setContent(n);
		},
		/**
		 * @access public
		 * @description  toogle to error display state
		 * @param msg{String} the error title
		 * @pararm details{String} the error details
		 * @return void
		 */
	    setErrorMsg: function(msg, details){
			this.hideProgress();
			this.container.addClass('error');
			if(!this.errorNode){
				this.errorNode = Y.Node.create("<p class='error-title'>"+msg+"</p>");
				this.boundingBox.appendChild(this.errorNode);
			}else{
				this.errorNode.setContent(msg);
			}
			if(details){
				if(!this.errorDetailsNode){
					this.errorDetailsNode = Y.Node.create("<p class='error-details'>"+details+"</p>");
					this.boundingBox.appendChild(this.errorDetailsNode);
				}else{
					this.errorDetailsNode.setContent(details);
				}
			}
		},
		/**
		 * @access public 
		 * @description destroy the ImageCell, remove from DOM, detach event listeners.
		 * @param null
		 * @return void
		 */
		destroy: function(){
			this.deleteButton.detach();
			this.detach();
			this.container.setContent("");
		}
	};
	Y.augment(ImageCell, Y.EventTarget);
	Y.ImageCell = ImageCell;	
     /////////////////////////////////////////////////////////////////////////////////////////////////////////////
	 //Y.UploaderUIButton
	 /////////////////////////////////////////////////////////////////////////////////////////////////////////////
	/**
	 * @description default UI Button for UploaderUI components
	 * UploaderUI组件默认显示的按钮
	 */
	 function UploaderUIButton(options){
		this.options = options;
	 }
	 Y.mix(UploaderUIButton.prototype, {
		
		/**
		 * @access public
		 * @description init the button.
		 * @param uploader{UploaderUI} 
		 * @param label {String}
		 * @return void
		 */
		init: function(uploader, label){
			this.uploader = uploader;
			this.label = label; 
		},
		/**
		 * @access protected
		 * @description create button node container and node structure
		 * @param null
		 * @return void
		 */
		createChildren: function(){
			this.container = Y.Node.create("<div class='file-button'></div>");
			this.node = Y.Node.create("<a class='default'>"+this.label + "</a>");
			this.container.appendChild(this.node);
		},
		/**
		 * @access public
		 * @description call while the uploaderUI button mouseover
		 * @param null
		 * @return void
		 */
		onMouseOver: function(){
			this.container.addClass('mouseover');
		},
		/**
		 * @access public
		 * @description call while the uploaderUI button mouseout
		 * @param null
		 * @return void
		 */
		onMouseOut: function(){
			this.container.removeClass('mouseover');
		},
		/**
		 * @access public
		 * @description call while the uploaderUI enabled
		 * @param null
		 * @return void
		 */
		onEnable: function(){
			this.container.removeClass('disabled');
		},
		/**
		 * @access public
		 * @description call while the uploaderUI disabled
		 * @param null
		 * @return void
		 */
		onDisable: function(){
			this.container.addClass('disabled');
		},
		/**
		 * @access public
		 * @description return the button container node
		 * @param null
		 * @return Node
		 */
		getContainer: function(){
			return this.container;
		},
		/**
		 * @access public
		 * @description return the button node
		 * @param null
		 * @return Node
		 */
		getNode: function(){
			return this.node;
		},
		/**
		 * @access public
		 * @description update button label
		 * @param label text need to update
		 * @return void
		 */
		changeLabel: function(label){
			this.label = label;
			this.node.setContent(label);
		},
		/**
		 * @access public
		 * @description trigger after the button render to DOM tree.
		 * @param parentNode parent DOM Node
		 * @return void
		 */
		afterRender: function(parentNode){
		}
	 });
	 Y.UploaderUIButton = UploaderUIButton;
	 /////////////////////////////////////////////////////////////////////////////////////////////////////////////
	 //Y.UploaderK2Button
	 /////////////////////////////////////////////////////////////////////////////////////////////////////////////
	 /**
	  * @access public
	  * @description K2 button for UploaderUI component
	  *  集成K2 button组件到UploaderUI中来。
	  */
	 function UploaderK2Button(options){
		var defTem = '<a href="#" class="k2-button k2-button-style-c k2-button-m"><i></i><s><span class="k2-icon-bg-m k2-icon-tuan">{label}</span></s><b></b></a>';
		options = options || {};
		options.template = options.template || defTem;
		UploaderK2Button.superclass.constructor.call(this, options);
	 }
	 Y.extend(UploaderK2Button, UploaderUIButton, {
			/**
			 * @access protected
			 * @override  recreate button node for K2Button
			 * @see UploaderUIButton
			 */
			createChildren: function(){
				this.container = Y.Node.create("<div class='uploader-k2-button'></div>");
				this.node = Y.Node.create(Y.substitute(this.options.template, {label: this.label}));
				this.container.appendChild(this.node);
			},
			/**
			 * @access public
			 * @override  update button label for K2Button
			 * @see UploaderUIButton
			 */
			changeLabel: function(label){
				var lNode = this.node.one('s'),
					spanNode = lNode.one('span');
				if(spanNode){
					spanNode.setContent(label);
				}else{
					lNode.setContent(label);
				}
			},
			/**
			 * @access public
			 * @override  update button width for K2Button
			 * @see UploaderUIButton
			 */
			afterRender: function(parentNode){
				this.parentNode = parentNode;
				this.updateParentWidth();
			},
			/**
			 * @access private
			 * @description  update button width for K2Button
			 * @param null
			 * @return void
			 */
			updateParentWidth: function(){
				if(this.options.buttonWidth){
					parentNode.setStyle('width', this.options.buttonWidth);
				}else if(this.parentNode){
					var node = this.node,
					pl = parseInt(node.getStyle('padding-left')),
					w = parseInt(node.getStyle('width')),
					pr = parseInt(node.getStyle('padding-right'));
					this.parentNode.setStyle('width', pl+w+pr+4);
				}
			}
	 });
	 Y.UploaderK2Button = UploaderK2Button;
     /////////////////////////////////////////////////////////////////////////////////////////////////////////////
	 //Y.UploaderUI
	 /////////////////////////////////////////////////////////////////////////////////////////////////////////////
	/**
	 * @access public
	 * @description UploaderUI is a common User Interface used to upload an image or images. 
	 */
	function UploaderUI(){
		this._previewCells = {};
		UploaderUI.superclass.constructor.apply(this, arguments);
	}

	Y.extend(UploaderUI, Y.Base, {

		uploader: null,
		container: null,
		_previewCells: null,
		previewContainer: null,

		/**
		 * @access protected
		 * @description First of all, initialize the UI. 
		 *    In the second, bind event listeners.
		 * @param options{Object}
		 * @return void
		 */
		initializer: function(options){
			options = options || {};
			var defaultOptions = {
				 label: {
					 "select": "上传图片",
					 "selectContinue": "继续上传",
					 "reselect": "重新上传",
					 "multiFilesTip": "可选中多张图片一起上传"
				 },
				// buttonSkin: 'http://k.kbcdn.com/k2/uploader/asset/skin/uploader-ui-swf-sprites.png',
				swfURL: 'http://k.kbcdn.com/k2/uploader/skinnable-uploader.swf'
			 };
			this.options = Y.mix(options, defaultOptions, false, null, 0, true);
			this.container = Y.one(this.get("container"));
			this.createChildren();
		},
		/**
		 * @access protected
		 * @description create the view DOM, and instantiate a Uploader instance.
		 * @param null
		 * @return void
		 */
		createChildren: function(){
			var options = this.options,
				Label = options.label,
				uploaderUINode = Y.Node.create("<div class='k2-uploader-ui k2-fix-float'></div>"),
				uploaderNode = Y.Node.create("<div class='k2-uploader-button'></div>"),
				uploaderPrevNode = Y.Node.create("<div class='k2-uploader-preview'></div>");
			
			if(this.get('hidePreview')){
				uploaderPrevNode.setStyle('display', 'none');
			}
			if(!this.get('relativedInput')){
				this.set('relativedInput', Y.Node.create("<input type='hidden' name='"+this.get("hiddenInputName")+"'/>"));
				this.container.appendChild(this.get('relativedInput'));
			}

			uploaderUINode.appendChild(uploaderNode);
			if(this.get("forceDisplayTip") || (this.get("multiFiles") && this.get("maxPreview") > 1)){
				var tipNode = this.tipNode = Y.Node.create("<span class='tip'>"+Label.multiFilesTip+"</span>");
				uploaderUINode.appendChild(tipNode);
			}
			uploaderUINode.appendChild(uploaderPrevNode);
			this.container.appendChild(uploaderUINode);
			
			this.previewContainer = uploaderPrevNode;
			this.uploader  = new Y.Uploader({
				container: uploaderNode,
				action: this.get('action'),
				method: options.method,
				swfURL: options.swfURL,
				buttonSkin: options.buttonSkin,
				adapterClass: options.adapterClass,
				timeout: options.timeout,
				fileName: options.fileName
			});
			var adapterClass = this.uploader.get('adapterClass');

			
			var uploaderUIButton = this.uploaderUIButton = options.uploaderUIButton ||  new UploaderUIButton();
			uploaderUIButton.init(this, Label.select);
			uploaderUIButton.createChildren();
			var buttonContainer = uploaderUIButton.getContainer();

			var c = this.uploader.container, self = this;
			c.on('mouseover', function(e){
				if(!self.disabled){
					uploaderUIButton.onMouseOver();
				}
			});
			c.on('mouseout', function(e){
				uploaderUIButton.onMouseOut();
			});
		
			if(adapterClass === Y.UploaderIO){
				this._isUploaderIO = true;
			}
			
			uploaderNode.appendChild(buttonContainer);
			uploaderUIButton.afterRender(uploaderNode);
		

			this.uploader.addReadyCallback(Y.bind(this.onUploaderReady, this));
			if(options.previewData){
				this.set("previewData", options.previewData);
			}else if(this.get('relativedInput')){
				this.set("previewData", this.get('relativedInput').get('value'));
			}
		},

		/**
		 * @access private
		 * @description on the uploader SWF ready, set the file filters dialog to image type, 
		 *	  and add event listeners to the uploader, such as fileselect, uploadstart, etc...
		 * @param event{Event}
		 * @return void
		 */
		onUploaderReady: function(event){
			var ff = this.get("allowedExtension"),
				 uploader = this.uploader;

			if(this.disabled){
				uploader.disable();
			}
			if(Y.Lang.isArray(ff)){
				uploader.setFileFilters(ff);
			}
			if(this.get("multiFiles") && this.get("maxPreview") > 1){
				this.setAllowMultipleFiles(true);
			}
			
			uploader.on('fileselect', this.onFileSelect, this);
			uploader.on('uploadstart', this.onUploadStart, this); 
			uploader.on('uploadprogress', this.onUploadProgress, this);
			uploader.on('uploadcompletedata', this.onUploadCompleteData, this);
			uploader.on('uploadcancel', this.onUploadCancel, this);
			uploader.on('uploaderror', this.onUploadError, this);
			uploader.on('uploadtimeout', this.onUploadError, this);
			this.fire("ready", {});
		},
		
		/**
		 * @access private
		 * @description while the user select a file by the dialog window, the upload task start soon.
		 * @param event{Event}
		 * @return void
		 */
		onFileSelect: function(event){
			var fl = event.fileList || event.files, 
				file,
				id,
				cell;
	
			if(this.get("maxPreview")<=1){
				this.destroyPreviewCell();
			}
			for(var i in fl){
				file = fl[i];
				id = file.id;
				if(this.getPreviewCount() >= this.get("maxPreview")){
					this.uploader.removeFile(id);
				}else{
					cell = this.createPreviewCell(id);
					var validateFileResult = this.validateFile(file);
					if(validateFileResult === true){
						this.uploader.upload(id);
						var filename = file.name || this.uploader.adapter.getName(id);
						cell.startUpload(filename);
					}else{
						this.uploader.removeFile(id);
						this._onError(id, $Text.FAILURE_ERROR, validateFileResult);
					}
				}
			}
			if(this.getPreviewCount() >= this.get("maxPreview")){
				this.disable();
			}
			this._updateButtonLabel();
		},
		/**
		 * @access private
		 * @description 对文件做客户端验证，比如文件后缀名称，文件的size
		 * @param file{File}
		 * @return Boolean, String
		 */
		validateFile: function(file){
			var id = file.id,
				fileName = file.name || this.uploader.adapter.getName(id),
				size = file.size || this.uploader.adapter.getSize(id),
				maxSize = this.get("maxSize"),
				allowedExtension = this.get("allowedExtension");

			if(isNaN(size) || size < 0){
				size = 0;
			}
			if(size > maxSize){
				return $Text.FILE_SIZE_LIMIT;
			}
			if(!fileName){
				return true;
			}
			var fileNameExt = (-1 !== fileName.indexOf('.')) ? fileName.replace(/.*[.]/, '').toLowerCase() : '';
			if(fileName == ""){
				return true;
			}
			for(var i = 0, l = allowedExtension.length; i < l; i++){
				var ext = allowedExtension[i];

				if(ext.extensions){
					ext = ext.extensions;
				}
				if(Y.Lang.isString(ext)){
					ext = ext.split(";");
				}
				for(var j = 0, jl = ext.length; j < jl; j++){
					var extItem = ext[j].replace(/.*\./, '').toLowerCase();
					
					if(extItem == fileNameExt){
						return true;
					}
				}
			}
			return  $Text.FILE_FORMAT_LIMIT;
		},
		/**
		 * @acess private
		 * @description on the SWF listen the HTTP open event, then hide the select button and
		 *   show the progress bar, also set the bar progress to 0%.
		 * @param event{Event}
		 * @return void
		 */
		onUploadStart: function(event){
			if(this._isUploaderIO){
				this.disable();
			}
			this.uploader.removeFile(event.id);
		},
		/**
		 * @access private
		 * @description on the SWF listen the HTTP progress event, then update the progress bar.
		 * @param event{Event}
		 * @return void
		 */
		onUploadProgress: function(event){
			var prog = event["bytesLoaded"]/event["bytesTotal"]; 
			var cell = this.findCellById(event.id);
			if(cell){
				cell.setProgress(prog);
			}
		},
		/**
		 * @access private
		 * @description ImageCell抛出了cancel事件，表示上传任务被终止
		 * @param event{Event}
		 * @event "cancel"
		 * @return void
		 */
		onCellCancelClicked: function(event){
			var id = event.uploadTaskId;
			this.destroyPreviewCell(id);
			this.uploader.cancel(id);
			this.fire("cancel", {id: id});
			this.uploader.removeFile(id);
		},
		/**
		 * @access private
		 * @description ImageCell抛出了delete事件，表示上传图片被删除
		 * @param event{Event}
		 * @event "delete"
		 * @return void
		 */
		onCellDeleteClicked: function(event){
			var id = event.uploadTaskId;
			this.fire("delete", {id: id});
			this.destroyPreviewCell(id);
			this._onChange();
			
		},
		/**
		 * @access private
		 * @description trigger while the the upload cancelled, show the file selection button and hide the progress bar.
		 * @param event{Event}
		 * @return void
		 */
		onUploadCancel: function(event){
			this.destroyPreviewCell(event.id);
			if(this._isUploaderIO){
				this.enable();
			}
		},
		/**
		 * @access private
		 * @description trigger while the upload task error.
		 * @param event{Event}
		 * @return void
		 */
		onUploadError: function(event){
			var cell = this.findCellById(event.id);
			this.uploader.removeFile(event.id);
			if(cell){
				cell.stopUpload();
				this._onError(event.id, $Text.FAILURE_ERROR, $Text.UNKNOW_ERROR)
			}
			if(this._isUploaderIO){
				this.enable();
				this._checkUploaderIOResetState();
			}
		},
		/**
		 * @access private
		 * @descriptionon the upload task completed, if the server response is OK, show the image
		 * @param event{Event}
		 * @event imageUploaded
         * @return void
		 */
		onUploadCompleteData: function(event){
			var data, 
				id = event.id, 
				cell = this.findCellById(id);
			
			if(!cell){
				return;
			}
			cell.stopUpload();
			if(this._isUploaderIO){
				this.enable();
			}
			if(Y.Lang.isString(event.responseText)){
				try{
					data = Y.JSON.parse(event.responseText);
				}catch(e){
					this._onError(id, $Text.FAILURE_ERROR, $Text.UNKNOW_ERROR);
					this._checkUploaderIOResetState();
					return;
				}
			}
			
			data = data || {message: null}
			if(data.code == 200){
			
				var url = this.formatImageURI(data, this.get('width'), this.get('height'));
				cell.setData(data);
				cell.setResponseText(event.responseText);
				cell.setImage(url);
				this._onChange();
				this.fire($Event.FILE_UPLOADED, {
					url: url,
					id: event.id,
					data: data,
					responseText: event.responseText
				});
			}else{
				this._onError(id, $Text.FAILURE_ERROR, data.message);
			}
			this._checkUploaderIOResetState();
		},

		/**
		 * @access private
		 * @description fix button reactive bug in IE browsers.
		 * @param null
		 * @return void
		 */
		_checkUploaderIOResetState: function(){
			if(this._isUploaderIO){
				if(this.getPreviewCount() >= this.get("maxPreview")){
					this.disable();
				}
			}
		},
		/**
		 * @access private
		 * @desciption create a preview zone for the uploaded image
		 * @param id{String}
		 * @return void
		 */
		createPreviewCell: function(id){
			var node = Y.Node.create("<div class='k2-uploader-cell'></div>"),
				supportProgress = this.getMultiFilesAvailable();

			this.previewContainer.appendChild(node);
			var cell = new ImageCell({container:node, uploadTaskId: id, supportProgress:supportProgress});
			cell.on("delete", this.onCellDeleteClicked, this);
			cell.on("cancel", this.onCellCancelClicked, this);
			this._previewCells[id] = cell;
			return cell;
		},
		/**
		 * @access private
		 * @desciption find a preview zone by the upload task id
		 * @param id{String}
		 * @return ImageCell
		 */
		findCellById: function(id){
			return this._previewCells[id];
		},
		/**
		 * @access private
		 * @desciption destroy a preview zone by the upload task id. 
		 *    If the task id missing, destroy all the preview zone.
		 * @param id{String}[optional]
		 * @return void
		 */
		destroyPreviewCell: function(id){
			if(id === undefined){
				for(var i in this._previewCells){
					this._destroyPreviewCell(i);
				}
			}else{
				this._destroyPreviewCell(id);
			}
			if(this.getPreviewCount() < this.get("maxPreview")){
				this.enable();
			}
			this._updateButtonLabel();
		},
		/**
		 * @access private
		 * @desciption destroy a preview zone by the upload task id
		 * @param id{String}
		 * @return void
		 */
		_destroyPreviewCell: function(id){
			var cell = this._previewCells[id];
			if(cell){
				cell.destroy();
				cell.container.remove();
				delete this._previewCells[id];
				this.fire("remove", {id:id});
			}
		},
		/**
		 * @access private
		 * @desciption trigger while an/several image(s) uploaded or deleted.
		 * @param noEvent{Boolean}{default: false}
		 * @event "change" fired while the noEvent parameter is set to false.
		 * @return void
		 */
		_onChange: function(noEvent){
			var v = this.getValue(),
				jsonValue =  '[' + v.toString() +']';
			this.get('relativedInput').set('value', jsonValue);
			if(!noEvent){
				this.fire('change', {value:jsonValue});
			}
		},
		/**
		 * @access private
		 * @description trigger while the uploaded image is not a valid image.
		 * @param 
		 *	   id{String} upload task id.
		 *    error{String} error
		 *    message{String} error message
		 * @return void
		 */
		_onError: function(id, error, message){
			var cell = this.findCellById(id);
			this.fire("error", {id: id, error:error, message:message});
			if(!this.get("multiFiles") && !this.get('noAlert')){
				alert(error + message);
				this.destroyPreviewCell(id);
			}else{
				if(cell){
					cell.setErrorMsg(error, message);
				}
			}
		},
		/**
		 * @access private
		 * @description update uploader button label
		 * @param null
		 * @return void
		 */
		_updateButtonLabel: function(){
			var c = this.getPreviewCount(),
				Label = this.options.label,
				buttonLabel;

			if(c==0){
				buttonLabel = Label.select;
			}else if(!this.get('multiFiles') && (this.get("maxPreview") == null || this.get("maxPreview") <= 1)){
				buttonLabel = Label.reselect || Label.select;
			}else{
				buttonLabel = Label.selectContinue || Label.select;
			}
			if(this.uploaderUIButton){
				this.uploaderUIButton.changeLabel(buttonLabel);
			}
		},
		/**
		 * @access private
		 * @description compute the preview image count.
		 * @return int
		 */
		getPreviewCount: function(){
			var count = 0;
			for(var i in this._previewCells){
				if(this._previewCells.hasOwnProperty(i)){
					count++;
				}
			}
			return count;
		},
		/**
		 * @access private
		 * @description if any preview data initialized by constructor options or relevant input value,
		 *	  then create preview zone for these data.
		 * @param value{String|Function|Object|Array}
		 * @return void
		 */
		initPreviewData: function(value){
			if(!value || this.previedDataInited){
				return;
			}
			if(Y.Lang.isString(value)){
				value = Y.JSON.parse(value);
			}
			if(Y.Lang.isFunction(value)){
				value = value();
			}
			if(!Y.Lang.isArray(value)){
				value = [value];
			}
			if(value.length == 0){
				return;
			}
			this.previedDataInited = true;
			var max = this.get("maxPreview") || 1;
			for(var i = 0, l = value.length; i<l; i++){

				if(i== max){
					this.disable();
					break;
				}
				var sPitem = value[i],
					 pitem,
					id= Y.guid();
				if(Y.Lang.isString(sPitem)){
					try{
						pitem = Y.JSON.parse(sPitem);
					}catch(err){
						throw new Error("The previewData of UploaderUI is not valid JSON: "+sPitem);			
					}
				}else{
					pitem = sPitem;
					sPitem = Y.JSON.stringify(pitem);
				}
				cell = this.createPreviewCell(id);
				var url = this.formatImageURI(pitem, this.get('width'), this.get('height'));
				cell.setImage(url);
				cell.setResponseText(sPitem);
				cell.setData(pitem);
			}
			this._onChange();
			this._updateButtonLabel();
		},
		/**
		 * @access public
		 * @description get all the preview images.
		 * @param null
		 * @return NodeList
		 */
		getPreviewNodeList: function(){
			return this.previewContainer.all(".k2-uploader-cell");
		},
		/**
		 * @access public
		 * @description 禁用上传按钮
		 * @param null
		 * @event "disable"
		 * @return void
		 */
		disable: function(){
			this.uploaderUIButton.onDisable();
			this.disabled = true;
			try{
				this.uploader.disable();
			}catch(e){
			}
			this.fire("disable");
		},
		/**
		 * @access public 
		 * @description 启用上传按钮
		 * @param null
		 * @event enable
		 * @return void
		 */
		enable: function(){
			this.uploaderUIButton.onEnable();
			this.disabled = false;
			this.uploader.enable();
			this.fire("enable");
		},
		/**
		 * @acess public
		 * @description set the uploader can select multi files at one time
		 * @param b{Boolean}
		 * @return Boolean
		 */
		setAllowMultipleFiles: function(b){
			if(this.getMultiFilesAvailable()){
				try{
					this.uploader.setAllowMultipleFiles(b);
				}catch(error){}
				return b;
			}
			return false;
		},
		/**
		 * @access public
		 * @description return if the uploader supporting multi selection at one time.
		 * @param null
		 * @return Boolean
		 */
		getMultiFilesAvailable: function(){
			return !(this.uploader.get('adapter') instanceof Y.UploaderIO);
		},
		
		/**
		 * @access public
		 * @description return an Array represent the current uploaded images, 
		 *   contains responseTest, and the relatived JSON object.
		 * @param null
		 * @return Array
		 */
		getFullValue: function(){
			var res = [];
			for(var i in this._previewCells){
				var cell  = this._previewCells[i],
					responseText = cell.getResponseText();
				if(responseText){
					res.push({
						responseText: responseText,
						data: cell.getData()
					});
				}
			}
			return res;
		},
		/**
		 * @access public
		 * @description return an Array represent the current uploaded images,
		 *	 contains the JSON string which has 'code' and 'message' deleted.
		 * @param null
		 * @return Array
		 */
		getValue: function(){
			var res = [];
			for(var i in this._previewCells){
				var cell  = this._previewCells[i],
					json,
					responseText = cell.getResponseText();
				if(responseText){
					json = Y.JSON.parse(responseText);
					delete json.code;
					delete json.message;
					res.push(Y.JSON.stringify(json));
				}
			}
			return res;
		},
		/**
		 * @access public
		 * @descrition set the relatived input name attribute
		 * @param name{String}
		 * @return void
		 */
		setHiddenInputName: function(name){
			if(this.hiddenInput){
				this.hiddenInput.set('name', name);
			}
		},
		/**
		 * @access public
		 * @description return the relatived input node
		 * @param null
		 * @return Node
		 */
		getRelativedInput: function(){
			return this.hiddenInput;
		},
		/**
		 * @access public
		 * @description set a relatived input node for uploader. If not setted, uploader will create it automatically.
		 * @param node{DOM selector|Node}
		 * @return void
		 */
		setRelativedInput: function(node){
			this.hiddenInput = Y.one(node);
		},
		/**
		 * @access public
		 * @description format a image URI by options, the image width and image height.
		 * @param options:{Object} image options {id, n, m}
		 * @param w{Number} image width
		 * @param h{Number} image height
		 *
		 * @return {String} image URI
		 */
		formatImageURI: function(options, w, h){
			var aType=options.t.split('/'),
				 domain = this.get("imageDomain");

			options.t = aType[1]=='jpeg'?'jpg':aType[1];
			options.t = aType[1]=='pjpeg'?'jpg':aType[1];
			w = w || 96;
			h = h || 70;
			return domain+'id='+options.id+'&n='+options.n+'&m='+options.m+'&w='+w+'&h='+h+'&t='+options.t;
		}
		
	},
	{
		NAME: 'UploaderUI',

		ATTRS:{
			container: {
				value: null,
				writeOnce: 'initOnly'
			},
			width:{
				value: 96
			},
			height:{
				value: 70
			},
			action:{
				value: '/common/marlineup.html'
			},
			imageDomain:{
				value: 'http://img1.kbcdn.com/?'
			},
			multiFiles: {
				value: false,
				writeOnce: 'initOnly'
			},
			multiFilesAvailable: {
				getter: "getMultiFilesAvailable"
			},
			maxPreview:{
				value: 1,
				writeOnce: 'initOnly'
			},
			maxSize: {
				value: 1024 * 1024 * 3
			},
			allowedExtension: {
				value: [{description:"Images", extensions:"*.jpg;*.png;*.gif"}]
			},
			previewData:{
				value:null,
				setter:"initPreviewData"
			},
			hiddenInputName:{
				value: Y.guid(),
				setter: "setHiddenInputName"
			},
			relativedInput: {
				setter: "setRelativedInput",
				getter: "getRelativedInput"
			},
			noAlert:{
				value: false
			},
			forceDisplayTip: {
				value: false
			},
			hidePreview:{
				value: false
			}
		}
		
	});

	Y.UploaderUI= UploaderUI;

}, '1.0.3', {requires:['k2-uploader', 'k2-uploader-html5', 'k2-uploader-flash',
'json-parse', 'json-stringify', 'k2-uploader-style', 'node-style', 'substitute']});