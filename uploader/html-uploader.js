/*!
 * @revision:
 */
/*
 * @author: <a href="zhengxie.lj@taobao.com">zhengxie</a>
 * @version:1-0-0
 */
YUI.add('k2-html-uploader', function(Y) {

/**
 * Upload files to the server with support for file filtering, multiple file uploads
 * and progress monitoring.
 * @module uploader
 */
	
var Event = Y.Event,
    Node = Y.Node;



/**
 * The HtmlUploader widget is a tool for uploading files to the server.
 * @module html-uploader
 * @title HtmlUploader
 * @requires base, node, event
 */

/**
 * Creates the HtmlUploader instance and keeps the initialization data
 *
 * @class HtmlUploader
 * @extends Y.Base
 * @constructor
 * @param {Object} config (optional) Configuration parameters for the Uploader. The following parameters are available:
 *        <dl>
 *        </dl>
 */
				
function HtmlUploader (config) {
	HtmlUploader.superclass.constructor.apply(this, arguments);
};


Y.extend(HtmlUploader, Y.Base, {
	

	_inputs:{},
	inputNode: null,
	
   /**
    * Construction logic executed during Uploader instantiation.
    *
    * @method initializer
    * @protected
    */
	initializer : function (options) {
		this.container = Y.one(this.get('container'));
		this.inputNode = this._createInput();
	},
	upload: function(){
		var id = this.addFile(this.inputNode);
		this._upload(id);
	},
	addFile: function(inputNode){
		var id = Y.guid('k2-html-uploader');
		var fileInput = inputNode._node;
		this._inputs[id] = inputNode;
		fileInput.setAttribute('id', id);
		fileInput.setAttribute('name', 'uploadFile');
		return id;
	},

	getFileName: function(id){
		return this._inputs[id].get('value').replace(/.*(\/|\\)/, "");
	},

	_destoryNode: function(node){
		if(node == null){
			return;
		}
		if(node._node){
			node.detach();
			this._destoryNode(node._node);
		}
		if(node.parentNode){
			node.parentNode.removeChild(node);
		}
	},
	_createInput: function(){
		var wrapper = Node.create('<div class="html-uploader-wrapper"></div>');
		var input = Node.create('<input class="html-uploader-input" type="file" name="uploadFile"/>');
		wrapper.setStyles({
			'position':'absolute',
			'width': this.get('width'),
			'height': this.get('height'),
			'overflow': 'hidden',
			'opacity': 0,
			'cursor': 'pointer'
		});
		input.setStyles({
			'position': 'absolute',
			'right':0,
			'height': this.get('height'),
			'-moz-user-focus': 'ignore',
			'border': '0 none transparent',
			'filter': 'alpha(opacity=0)',
			'fontSize': '24px'
		});
		input.setAttribute('size', 1);
		wrapper.appendChild(input);
		this.container.appendChild(wrapper);
		var owner=this;
		input.on("change", function(){
			var v = input.get('value');
			if(v){
				owner.fire('fileSelect', {inputNode:input, fileName: v});
			}
		})
		return input;
	},
	_createIframe: function(id){
		var iframe = Node.create('<iframe src="javascript:false;" name="'+id+'"/>');
		iframe.setAttribute('id', id);
		iframe.setStyle('display', 'none');
		document.body.appendChild(iframe._node);
		return iframe;
	},

	_createForm: function(iframe, params){
		var method = params.method || this.get('method') || 'POST';
		var form = Node.create('<form method="'+method+'" enctype="multipart/form-data"></form>');
		var queryString = (this.get('action'));
		form.setAttribute('action', queryString);
		form.setAttribute('target', iframe._node.name);
		form.setStyle('display', 'none');
		document.body.appendChild(form._node);
		return form;
	},

	_upload: function(id, params){
		params = params || {};
		var inputNode = this._inputs[id],
			 input  = inputNode._node,
			 fileName = this.getFileName(id),
			 iframe = this._createIframe(id),
			 form = this._createForm(iframe, params),
			 timeoutFlag = false,
			 timer,
			 duration  = this.get('timeout'),
			 self = this;

		iframe.on('load', function(){
			if(timeoutFlag){
				return;
			}else{
				clearTimeout(timer);
			}
			var el = iframe._node;
			if(!el.parentNode){
				this.fire('uploaderror', {id:id});
				return;
			} 
			if (el.contentDocument &&
                el.contentDocument.body &&
                el.contentDocument.body.innerHTML == "false"){
				this.fire('uploaderror', {id:id});
                return;
            }
			
			var doc = el.contentDocument || el.contentWindow.document;
			var responseText = doc.body.innerHTML ;
			self._onUploadComplete(id, responseText);
			setTimeout(function(){
				self._destoryNode(inputNode);
                self._destoryNode(iframe);
            }, 1);
		});
		this._destoryNode(input.parentNode);
		form.appendChild(input);
		this.inputNode = this._createInput();
		form._node.submit();
		this._onUploadStart(id);
		this._destoryNode(form);

		//if the timeout config larger than 0, start run timer.
		if(duration>0){
			timer = setTimeout(function(){
				timeoutFlag = true;
				clearTimeout(timer);
				self.fire('timeout' , {id:id});
			},duration);
		}
		return id;
	},
	_onUploadStart: function(id){
		this.inputNode.setAttribute('disable', 'disable');
		this.fire('uploadstart', {id: id});
	},
	_onUploadComplete: function(id, responseText){
		this.inputNode.removeAttribute('disable');
		this.fire('uploadcompletedata', {id: id, data:responseText});
	},
	_cancel: function(id){
		this.fire('cancel', {id: id});
		if(id==null){
			var owner = this;
			Y.Array.each(this._inputs, function(item){
				owner._cancel(item);
			});
		}else{
			 delete this._inputs[id]; 
			var iframe = document.getElementById(id);
			 if (iframe){
				 iframe.setAttribute('src', 'javascript:false;');
				 this._destroyNode(iframe);
			 }
		}
	},
	toString: function(){
		return "HtmlUploader " + this._id;
	}

},
{
	ATTRS: {

		container: {
			value: null,
			setter: 'initOnce'
		},
		width:{
			value: 100
		},
		height:{
			value: 26
		},
		timeout: {
			value: 0
		},
		action: {
			value: null
		}
	}
});

Y.HtmlUploader = HtmlUploader;


}, '1.0.0' ,{requires:['base', 'node']});
