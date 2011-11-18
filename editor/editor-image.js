/*
 * @revision:
 */
/*
 * @author:wulong@taobao.com
 * @version:1-0-13
 */ 

YUI.add('k2-editor-image', function(Y) {

	var Node = Y.Node;
	 var DEFAULT_VALUE = '图片描述…';
	/**
	 * ImageTable is a internal class for multi images preview
	 */
	 var ImageTable = function(container, options){

		options = options || {};

		this.cells = [];
		this.cellsMap = {};
		this.usedCellMap = {};
		this.eventCellMap = {};
		
		this.size = options.size || 10;
		this.cellUsedCount = 0;
		this.loaderInfo = [];
		this.container = Y.one(container);
		this.init();
	 }
	 ImageTable.prototype = {

		constructor: ImageTable,

		init: function(){
			for(var i = 0; i<this.size; i++){
				this.addCell();
			}
		},
		getAllImagesHtml: function(w, h){
			var imageNodes = this.container.all('.upload-cell');
			var result = [];
			for(var i = 0, l = this.cells.length; i<l; i++){
				var cell = this.cells[i];
				if(this.usedCellMap[cell.id]){
					var img = cell.imageEl.get('innerHTML');
					var desc = cell.descEl.get('value');
					if(w && h){
						img = img.replace(/w=96&amp;h=70/g, 'w='+w+'&amp;h='+h);
					}
					result.push(img);
					if(desc != '' && desc != DEFAULT_VALUE){
						result.push(desc);
					}
				}
			}
			return result.join('<br><br>');
		},
		putCellByEventId: function(cell, id){
			this.eventCellMap[id] = cell;
		},
		getCellByEventId: function(id){
			return this.eventCellMap[id];
		},
		removeCellByEventId: function(id){
			delete this.eventCellMap[id];
		},
		getAllLoadedData: function(){
			var datas = [];
			for(var i in this.usedCellMap){
				if(this.usedCellMap.hasOwnProperty(i)){
					var cell = this.usedCellMap[i];
					if(cell && cell.getData()){
						datas.push(cell.getData());
					}
				}
			}
			return datas;
		},
		addCell: function(){
			var cell = new ImageCell(this);
			this.cellsMap[cell.id] = cell;
			this.cells.push(cell);
			this.container.appendChild(cell.getNode());
			return cell;
		},
		findNextCell: function(){
			for(var i=0, c = this.cells.length; i<c; i++){
				var cell = this.cells[i];
				if(this.usedCellMap[cell.id] !== true){
					this.usedCellMap[cell.id] = true
					return cell;
				}
			}
			return null;
		},
		removeCell: function(cell){
			var index = Y.Array.indexOf(this.cells, cell);
			var id = cell.id;
		
			if(index==-1){
				return;
			}
			
			delete this.cellsMap[id];
			delete this.usedCellMap[id];
			for(var i in this.eventCellMap){
				var item = this.eventCellMap[i];
				if(item == cell){
					delete this.eventCellMap[i];
					break;
				}
			}
			cell.destroy();
			this.cells.splice(index, 1);
			this.addCell();
			this.fire('cellRemoved');
		},
		retrieveCell: function(id){
			return this.cells[id]
		},
		removeAllUsedCell: function(){
			var cellMap = this.usedCellMap;
			for(var i in cellMap){
				
				if(cellMap.hasOwnProperty(i)){
					var hasCell = cellMap[i];
					if(hasCell){
						this.removeCell(this.cellsMap[i]);
					}
					delete cellMap[i];
				}
			}
			 this.cellUsedCount = 0;
			 this.fire('allCellRemoved');
		}
	 }

	 Y.augment(ImageTable, Y.EventTarget);

	 var ImageCell = function(table){
			this.table = table;
			this.id = Y.guid('k2-upload-cell-');
			this.el = Node.create("<div class='upload-cell'></div>");
			this.descEl =  Node.create("<input class='desc default' value='"+DEFAULT_VALUE+"'/>");

			this.imageEl = Node.create("<div class='upload-image'></div>");
			this.deleteEl = Node.create("<a class='delete-icon'></a>");
			this.loadedEl = Node.create("<div class='loaded'></div>");
			this.progressLabelEl = Node.create("<div class='progress-label'></div>");
			this.progressBarEl = Node.create("<div class='progress-bar'></div>");
			this.uploadContentEl = Node.create("<div class='upload-content'></div>");
			
			this.progressBarEl.appendChild(this.loadedEl);
			this.progressBarEl.appendChild(this.progressLabelEl);
			this.uploadContentEl.appendChild(this.progressBarEl);
			this.uploadContentEl.appendChild(this.deleteEl);
			this.uploadContentEl.appendChild(this.imageEl);
			this.el.appendChild(this.uploadContentEl);
			this.el.appendChild(this.descEl);
			this.addEvents();
	 }
	 ImageCell.prototype = {
		constructor: ImageCell,
		
		addEvents : function(){
			var owner = this;
		
			this.deleteEl.on("click", function(e) {
				e.halt();
				owner.table.removeCell(owner);
			});

			this.descEl.on("focus", function(e) {
				e.halt();
				var textNode = owner.descEl._node;
				if(textNode.value == DEFAULT_VALUE){
					textNode.value = '';
					e.currentTarget.removeClass('default');
				}
			});
			this.descEl.on("blur", function(e) {
				e.halt();
				var textNode =  owner.descEl._node;
				if(textNode.value == ''){
					textNode.value = DEFAULT_VALUE;
					e.currentTarget.addClass(textNode, 'default');
				}
			});
		},
		getNode: function(){
			return this.el;
		},
		/**
		 * 销毁展位，移除事件
		 */
		destroy : function(){
			if(this.el.get('parentNode')){
				this.el.remove();
				this.deleteEl.detach();
				this.descEl.detach();
				this.table = null;
			}
		}
	 }




	 /**
	  * ImageCell is a internal class for single image preview
	  */
    var EditorImage = function(config) {
			EditorImage.superclass.constructor.apply(this, arguments);
			this.setAttrs(config);
		},
		HOST='host';
		
    Y.extend(EditorImage, Y.Base, {

			
			 initializer: function() {
					var self=this;
					this.id = Y.guid('-');
					this.uploaderContainerId = 'uploader-container'+this.id;
					this.uploaderPreviewId = 'uploader-preview'+this.id;
					this.button = this._createButton(); 
					this.button.on('click',function(){

						if(Y.UA.ie){
							var inst = self.get(HOST).getInstance(),
								sel = new inst.Selection(),
								out = sel.getSelected();
							if(out&&out.size()){
								self.selectedRecord = out;
							}else{
								self.selectedRecord = null;
							}
						}

						if(!self.popup){
							self._createPopup();
							//popup show has a delay in IE6
							setTimeout(function(){
								self.afterInit();
							},1);
						}
						if(self.imageTable){
							self.imageTable.removeAllUsedCell();
						}
						self.popup.show();
						
					});
					//this.get(HOST).on('nodeChange', Y.bind(this._onNodeChange, this));
					Y.EditorWrap.disablePlugin(this.get(HOST),this);
			},
			disable : function(){
				this.button.set('state','disabled');
			},
			enable : function(){
				this.button.set('state','off');
			},
			/**
			 * after the popup created and added to DOM. init the uploader and the layout
			 */
			afterInit: function(){
				this._createLayout();
				if(!this.uploader){
					this._createUploader();
					if(this.imageTable){
						this.imageTable.uploader = this.uploader;
						this.imageTable.removeAllUsedCell();
					}
				}
			},
			_createButton : function(){
				 var editor = this.get(HOST);
				 return new Y.EditorButton({
								text:'插入图片',
								cmd : 'insertImage',	
								contentCls : 'k2-editor-tools-image',	
								container:editor.get('toolBarDiv')
				});
			},

			_createPopup : function(){
					var self = this,
						notifierNodeStr = '<p class="notifier"><span class="k2-icon-bg-m k2-icon-tip">提示：</span>一次可提交10张图片，支持jpg gif png 格式，单张图片大小不超过3M。</p>',
						uploadNodeStr = "<div id='" + this.uploaderContainerId + "' class='upload-button uploader-container'></div>",
						uploadTopStr = '<div class="upload-top">'+uploadNodeStr+notifierNodeStr+"</div>",
						previewNodeStr = "<div class='uploader-preview editor-preview'><div id='"+this.uploaderPreviewId+"' class='upload-list'></div></div>";

					self.popup = Y.createPop({
						sTitle:'插入图片',
						iWidth:'700',
						iHeight:'440',
						vContent : uploadTopStr + previewNodeStr,
						share:false,
						bShowAfterInit:false,
						onOk:function(){
							self._insertImg();
						},
						sOk:'提交',
						onCancel:false,
						btnAlign:'center'

					});
					var inst= this.get(HOST).getInstance();
					sel = new inst.Selection();
			},

			_createLayout: function(){
				this.imageTable = new ImageTable('#'+this.uploaderPreviewId);
				this.imageTable.on('cellRemoved', Y.bind(this.onCellRemoved, this));
				this.imageTable.on('allCellRemoved', Y.bind(this.onAllCellRemoved, this));
			},
			_createUploader : function(){
				if(this.uploader){
					this.uploader.detach();
					Y.one('#'+ this.uploaderContainerId).set('innerHTML', '');
				}
				/**
				 * @description forbiden the flash feature in uplading file.
				 * @date 2011-1-10
				 * TODO: fix the flash uploader bug
				 */
				 var adapterClass = this.get('adapterClass');
				 if(Y.UploaderHtml5 && Y.UploaderHtml5.available()){
					adapterClass = Y.UploaderHtml5;
				 }else{
					 adapterClass = Y.UploaderIO;
				 }
			
				var uploader = this.uploader = new Y.Uploader({
					container: '#'+ this.uploaderContainerId,
					adapterClass: adapterClass,
					action: (this.get('action') || "/common/marlineup.html")
				});
				
				var isIOType = (uploader.adapter instanceof Y.UploaderIO);
				var isHtml5Type = Y.UploaderHtml5 && (uploader.adapter instanceof Y.UploaderHtml5);
				var isFlashType = Y.UploaderFlash && (uploader.adapter instanceof Y.UploaderFlash);
				var prevNode = Node.one('#'+this.uploaderPreviewId);
				if(isIOType || isHtml5Type){
					prevNode.addClass('k2-html-type');
					this.uploader.container.addClass('k2-html-type');
					if(isHtml5Type){
						prevNode.addClass('k2-html5-type');
						this.uploader.container.addClass('k2-html5-type');
					}
					var inputNode = this.uploader.container.one('.k2-uploader-input');
					if(inputNode){
						inputNode.set('size', 10);
					}
				}else if(isFlashType){
					prevNode.addClass('k2-flash-type');
				}
				uploader.addReadyCallback(function(){
					var ff = [{description:"Images", extensions:"*.jpg;*.png;*.gif"}]; 
					uploader.setFileFilters(ff);
					uploader.setAllowMultipleFiles(true);
				});
				uploader.on('fileselect', Y.bind(this.onFileSelect, this));
				uploader.on('uploadstart', Y.bind(this.onUploadStart, this));
				uploader.on('uploadcancel', Y.bind(this.onUploadCancel, this));
				uploader.on('uploaderror', Y.bind(this.onUploadError, this));
				uploader.on('uploadcompletedata', Y.bind(this.onUploadCompleteData, this));
				uploader.on('uploadtimeout', Y.bind(this.onUploadTimeout, this));
				uploader.on('uploadprogress', Y.bind(this.onUploadProgress, this));
				this.currentFileCounts = 0;
				this.failedCount = 0;
				if(this.imageTable){
					this.imageTable.uploader = this.uploader;
				}
			},
			onCellRemoved: function(e){
				this.currentFileCounts--;
			},
			onAllCellRemoved: function(e){
				this.currentFileCounts==0;
			},
			//----------------------- uploader event handlers ------------//
			onFileSelect: function(e){
				
				var fileList = e.files,
					 arr=[],
					 MAX = this.imageTable.size;

				for(var i in fileList){
					if(this.currentFileCounts >= MAX){
						//this.uploader.disable();
						break;
					}else{
						var entry = fileList[i];
						arr.push(entry);
						this.currentFileCounts++;
					}
				}
				if(this.currentFileCounts >= MAX){
					//this.uploader.disable();
				}
				var count = arr.length;
				for(var j=0; j<count; j++){
					var id = arr[j].id;
					var cell = this.imageTable.getCellByEventId(id);
				
					if(cell == null){
						var newCell = this.imageTable.findNextCell();
						if(newCell !=null){
							this.imageTable.putCellByEventId(newCell, id);
							this.uploader.upload(id); 
						}
					}
				}
			},
			onUploadStart: function(event){
				var cell = this.imageTable.getCellByEventId(event.id); 
				cell.getNode().addClass('loading');
			},
			onUploadProgress: function(event){
				var cell = this.imageTable.getCellByEventId(event.id);
				var prog = Math.round(100*(event["bytesLoaded"]/event["bytesTotal"])); 
				cell.progressLabelEl.set('innerHTML', prog + '%');
				cell.loadedEl.setStyle('width', prog+'%');
			},

			onUploadCancel: function(event){
				var cell = this.imageTable.getCellByEventId(event.id);
				this.uploader.removeFile(event['id']);
				cell.getNode().removeClass('loading');
			},
			
			onUploadCompleteData: function(event){
				var cell = this.imageTable.getCellByEventId(event.id);
				cell.getNode().removeClass('loading');
				cell.getNode().addClass('complete');
				this.uploader.removeFile(event.id);
				var res = event.responseText;
				try{
					res = Y.JSON.parse(res);
				}catch(e){
					this.onUploadError(event);
					return;
				}
				if(res && res.code==200){
					cell.imageEl.set('innerHTML', this.formatImage(res, 96, 70));
				}else{
					this.onUploadError(event);
				}
			},
			onUploadError: function(event){
				var cell = this.imageTable.getCellByEventId(event.id);
				this.currentFileCounts--;
				this.uploader.removeFile(event.id);
				this.failedCount++;
				this.imageTable.removeCell(cell);
				this.showErrorNotification();
			},

			onUploadTimeout: function(event){
				this.onUploadError(event);
			},

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
					 domain = 'http://img1.kbcdn.com/';

				options.t = aType[1]=='jpeg'?'jpg':aType[1];
				options.t = aType[1]=='pjpeg'?'jpg':aType[1];
				w = w || 100;
				h = h || 100;
				//return domain + options.n +"_"+options.m+"/
				return domain+'?id='+options.id+'&n='+options.n+'&m='+options.m+'&w='+w+'&h='+h+'&t='+options.t;
			},
			formatImage: function(options, w, h){
				return '<p><img src="'+this.formatImageURI(options,w, h)+'"/></p>';
			},
			getAllImagesHtml: function(w, h){
				return this.imageTable.getAllImagesHtml(w, h);
			},
			showErrorNotification: function(){
			},
			//----------------------- uploader event handlers end------------//
			_insertImg : function(){
				var inst = this.get(HOST).getInstance(),
						sel,out,range,
						images = this.getAllImagesHtml(this.get('insertWidth'), this.get('insertHeight')),
						img,
						editor = this.get(HOST);
				
				//images = "<p><img src='http://img1.kbcdn.com/?id=ca11fb2a36096fc67bf3e6903a6331b8145f&n=n01&m=a&w=400&h=400&t=gif'/>";

				if(images==''){
					this.popup.hide();
					this.get(HOST).focus();
					return;
				}else if(this.selectedRecord && this.selectedRecord.size()){
					var firstItem = this.selectedRecord.item(0);
					firstItem.setContent(iconHtml);
					for(var i = 1, l = this.selectedRecord.size(); i<l; i++){
						this.selectedRecord.item(i).remove();
					}
					this.selectedRecord = null;
				}else{
					sel = new inst.Selection(); 
					out = sel.getSelected();
					if (!sel.isCollapsed && out.size()) {
						var img = Y.Node.create(images);
						out.item(0).replace(img);
						if(inst.UA.webkit){
							sel.selectNode(img);
						}
					}else{
						var self = this;
						if(inst.UA.ie || inst.UA.webkit){
							this.get(HOST).focus(function(){
								self.get(HOST).execCommand('inserthtml', images);
							});
						}else{
							this.get(HOST).execCommand('inserthtml', images);
						}
					}
					if(!inst.UA.ie){
						this.get(HOST).focus();
					}
				}
				//value = editor.htmlparser.HTMLtoXML(editor.getContent());
				//editor.get('textArea').set('value',value);
			}
			
    }, {
        NAME: 'editorImage',
        NS: 'image',
        ATTRS: {
            host: {
                value: false
            },
			insertWidth:{
				value: 400
			},
			insertHeight:{
				value: 400
			}
        }
    });


    Y.namespace('Plugin');

    Y.Plugin.EditorImage = EditorImage;

}, '1.0.5' ,{skinnable:false, requires:['node-base', 'node-style', 'json-parse', 'editor-base', 'k2-editor-button',
							'k2-uploader', 'k2-uploader-html5', 'k2-uploader-flash','k2-editor-uploader-style', 'k2-popup']});
