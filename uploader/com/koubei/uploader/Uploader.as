package com.koubei.uploader
{
	import com.koubei.util.K2Bridge;

	import flash.display.Bitmap;
	import flash.display.BitmapData;
	import flash.display.Sprite;
	import flash.display.StageAlign;
	import flash.display.StageScaleMode;
	import flash.events.DataEvent;
	import flash.events.Event;
	import flash.events.FocusEvent;
	import flash.events.HTTPStatusEvent;
	import flash.events.IOErrorEvent;
	import flash.events.KeyboardEvent;
	import flash.events.MouseEvent;
	import flash.events.ProgressEvent;
	import flash.events.SecurityErrorEvent;
	import flash.external.ExternalInterface;
	import flash.net.FileFilter;
	import flash.net.FileReference;
	import flash.net.FileReferenceList;
	import flash.net.URLRequest;
	import flash.net.URLVariables;
	import flash.ui.Keyboard;
	import flash.utils.Dictionary; 
	import flash.utils.setTimeout;
	import flash.system.Security;
	

	[SWF(backgroundColor=0xFFFFFF)]

	/**
	 * The base Uploader class for YUI's Flash-based file uploader.
	 * 
	 * @author Allen Rabinovich
	 */

	public class Uploader extends Sprite {

	//--------------------------------------
	//  Constructor
	//--------------------------------------

		public function Uploader()
		{
			super();
			bridge = new K2Bridge(this.stage);
			logMessage("Initializing uploader...");
			initializeComponent();
		}

	    //--------------------------------------------------------------------------
	    //
	    //  Variables
	    //
	    //--------------------------------------------------------------------------

		private var allowMultiple:Boolean = false;
		private var allowLog:Boolean = false;
		private var filterArray:Array;

		private var fileDataList:Object;
		private var fileRefList:Object;
		private var fileIDList:Dictionary;
		private var fileIDCounter:Number;
		private var filesToUpload:Array;

		private var singleFile:FileReference;
		private var multipleFiles:FileReferenceList;

		public var bridge:K2Bridge;		

		/**
		 * Determines how many files will be uploaded simultaneously
		 *
		 * @see setSimUploadLimit
		 * @langversion 3.0
		 * @playerversion Flash 9.0.28.0
		 */
		public var simultaneousUploadLimit:Number = 2;

		// Track the number of current upload threads
		private var currentUploadThreads:Number = 0;


		// The Sprite containing the rendered UI.
		private var buttonSprite:Sprite = new Sprite();

		protected var buttonSkin:Bitmap;
		
		private var buttonHeight:Number;
		private var buttonWidth:Number;
		//--------------------------------------
		//  Public Methods
		//--------------------------------------

		/**
		 * Sets the number of simultaneous file uploads possible.
		 * The maximum is 5.
		 * @param numberOfUploads Number of simultaneous uploads, no fewer than 1
		 * and no larger than 5.
		 */
		 public function setSimUploadLimit (simUploadLimit:int) : void {
		 	if (simUploadLimit <= 1) {
		 		this.simultaneousUploadLimit = 1;
				logMessage("Simultaneous upload limit has been set to 1");
		 	}
		 	else if (simUploadLimit >= 5) {
		 		this.simultaneousUploadLimit = 5;
				logMessage("Simultaneous upload limit has been set to 5");
		 	}
		 	else {
		 		this.simultaneousUploadLimit = simUploadLimit;
				logMessage("Simultaneous upload limit has been set to " + simUploadLimit);
		 	}
		 }


	    /**
	     *  Sets a list of file type filters for the "Open File(s)" dialog.
		 *  
	     *  @param newFilterArray An array of sets of key-value pairs of the form
	     *  {extensions: extensionString, description: descriptionString, macType: macTypeString [optional]}
	     *  The extension string is a semicolon-delimited list of elements of the form "*.xxx", 
	     *  e.g. "*.jpg;*.gif;*.png".
	     */
		 public function setFileFilters(newFilterArray:Array) : void {
			
		 	filterArray = processFileFilterObjects(newFilterArray);

		 	if (allowLog) {
		 		var logString:String = "File filters have been set to the following: \n";
		 		for each (var ff:FileFilter in filterArray) {
		 			logString += ff.extension + ": " + ff.description + "\n";
		 		}
		 		logMessage(logString);
		 	}
		 }

	    /**
	     *  Sets a flag allowing logging in Flash trace and Yahoo logger.
		 *  
	     *  @param allowLogging Whether to allow log messages.
	     * 
	     */
		public function setAllowLogging(allowLogging:Boolean) : void {
			if (this.allowLog != allowLogging) {
				logMessage("Logging has been turned " + (allowLogging ? "on." : "off."));
				this.allowLog = allowLogging;
			}
		}

		/**
	     *  Sets a flag allowing multiple file selection in the "Browse" dialog.
		 *  
	     *  @param allowMultiple Whether to allow multiple file selection.
	     * 
	     */
		public function setAllowMultipleFiles(allowMultipleFiles:Boolean) : void {
			this.allowMultiple = allowMultipleFiles;
			logMessage("Multiple file upload has been turned " + (allowMultiple ? "on." : "off."));		
		}


	    /**
	     *  Triggers a prompt for the user to browse their file system to select
		 *  files to be uploaded.
		 *  
	     *  @param allowMultiple Whether to allow the user to select more than
	     *  one file
	     * 
	     *  @param filterArray An array of filter objects, each with <code>
	     *  description</code>, and <code>extensions</code> properties which
		 *  determine which files the user is allowed to select
	     */

		private function browse(allowMultiple:Boolean = false, filterArray:Array = null):void {
			
			if(!allowMultiple) {
				logMessage("Starting to browse for a single file...")
				singleFile = new FileReference();
				singleFile.addEventListener(Event.SELECT, singleFileSelected);
				if(filterArray) {
					singleFile.browse(filterArray);
				}
				else {
					singleFile.browse();
				}
			}

			else {

				logMessage("Starting to browse for multiple files...")
				multipleFiles = new FileReferenceList();
				multipleFiles.addEventListener(Event.SELECT, multipleFilesSelected);
				
				if(filterArray) {
					multipleFiles.browse(filterArray);
				} 

				else {
					multipleFiles.browse();
				}

			}

		}


	    /**
	     *  Removes the file from the set to be uploaded
		 *  
	     *  @param fileID The ID of the file to be removed
	     */

		public function removeFile(fileID:String):Object {

			logMessage("Removing file " + fileID);
			var fr:FileReference = FileReference[fileID];
			if (fr) {
				destroyFileReference(fr);
			}
			delete fileDataList[fileID];
			delete fileRefList[fileID];

			logMessage("Returning new file list: " + fileDataList);
			return fileDataList;
		}

		private function destroyFileReference(fr:FileReference):void {
			fr.removeEventListener(Event.OPEN, uploadStart);
			fr.removeEventListener(ProgressEvent.PROGRESS, uploadProgress);
			fr.removeEventListener(Event.COMPLETE, uploadComplete);
			fr.removeEventListener(DataEvent.UPLOAD_COMPLETE_DATA, uploadCompleteData);
			fr.removeEventListener(HTTPStatusEvent.HTTP_STATUS, uploadError);
			fr.removeEventListener(IOErrorEvent.IO_ERROR, uploadError);
			fr.removeEventListener(SecurityErrorEvent.SECURITY_ERROR, uploadError);
			fr.removeEventListener(Event.CANCEL,uploadCancel);
		}

		public function enable () : void {
	
			if(!this.hasEventListener(MouseEvent.CLICK)){
				this.addEventListener(MouseEvent.ROLL_OVER, buttonMouseOver);
				this.addEventListener(MouseEvent.ROLL_OUT, buttonMouseOut);
				this.addEventListener(MouseEvent.MOUSE_DOWN, buttonMouseDown);
				this.addEventListener(MouseEvent.MOUSE_UP, buttonMouseUp);
				this.addEventListener(MouseEvent.CLICK, handleMouseClick);
			}
			buttonSkin.y = 0;
			logMessage("Uploader UI has been enabled.");
		}

		public function disable () : void {
			if(this.hasEventListener(MouseEvent.CLICK)){
				this.removeEventListener(MouseEvent.ROLL_OVER, buttonMouseOver);
				this.removeEventListener(MouseEvent.ROLL_OUT, buttonMouseOut);
				this.removeEventListener(MouseEvent.MOUSE_DOWN, buttonMouseDown);
				this.removeEventListener(MouseEvent.MOUSE_UP, buttonMouseUp);
				this.removeEventListener(MouseEvent.CLICK, handleMouseClick);
			}
			buttonSkin.y = -3*buttonHeight;
			logMessage("Uploader UI has been disabled.");
		}

	    /**
	     *  Clears the set of files that had been selected for upload
	     */

		public function clearFileList():Boolean {
			
			for (var fileId:String in fileRefList) {
				var fr:FileReference = FileReference(fileRefList[fileId]);
				destroyFileReference(fr);
			}

			filesToUpload = [];
			fileDataList = new Object();
			fileRefList = new Object();
			fileIDList = new Dictionary();
			fileIDCounter = 0;

			logMessage("The file list has been cleared.");

			return true;
		}



	    /**
	     *  Uploads a file corresponding to a specified ID to a specified path where a script handles writing to the server.
		 *  
	     *  @param fileID The ID of the file to be uploaded
	     *  @param url The path to the serverside script
	     *  @param method The HTTP submission method. Possible values are "GET" and "POST"
	     *  @param vars An object containing variables to be sent along with the request
	     *  @param fieldName The field name that precedes the file data in the upload POST operation. 
	     *  The uploadDataFieldName value must be non-null and a non-empty String.
	     *  @param headers An object containing variables that should be set as headers in the POST request. The following header names
	     *  cannot be used: 
	     *  <code>
	     *  Accept-Charset, Accept-Encoding, Accept-Ranges, Age, Allow, Allowed, Authorization, Charge-To, Connect, Connection, 
	     *  Content-Length, Content-Location, Content-Range, Cookie, Date, Delete, ETag, Expect, Get, Head, Host, Keep-Alive, 
	     *  Last-Modified, Location, Max-Forwards, Options, Post, Proxy-Authenticate, Proxy-Authorization, Proxy-Connection, 
	     *  Public, Put, Range, Referer, Request-Range, Retry-After, Server, TE, Trace, Trailer, Transfer-Encoding, Upgrade, 
	     *  URI, User-Agent, Vary, Via, Warning, WWW-Authenticate, x-flash-version.
	     *  </code>
	     */

		public function upload(fileID:String, url:String, method:String = "GET", vars:Object = null, fieldName:String = "uploadFile"):void {

			// null checking in the params is not working correctly
			filesToUpload = [];
			
			if(isEmptyString(method)) {
				method = "GET";
			}

			if(isEmptyString(fieldName)) {
				fieldName = "uploadFile";
			}

			var request:URLRequest = formURLRequest(url, method, vars);
			var fr:FileReference = fileRefList[fileID];

			this.currentUploadThreads++;
			fr.upload(request,fieldName);

			logMessage("Starting the upload of file " + fileID);
		}

		/**
		 *  Uploads the specified files to a specified path where a script handles writing to the server.
		 *  
		 *  @param fileIDs The IDs of the files to be uploaded
		 *  @param url The path to the serverside script
		 *  @param method The HTTP submission method. Possible values are "GET" and "POST"
		 *  @param vars An object containing data to be sent along with the request
		 *  @param fieldName The field name that precedes the file data in the upload POST operation. The uploadDataFieldName value must be non-null and a non-empty String.
		 */

		public function uploadThese(fileIDs:Array, url:String, method:String = "GET", vars:Object = null, fieldName:String = "uploadFile"):void {
			if(isEmptyString(method)) {
				method = "GET";
			}

			if(isEmptyString(fieldName)) {
				fieldName = "uploadFile";
			}

			var request:URLRequest = formURLRequest(url, method, vars);

			for each(var fileID:String in fileIDs) {
				queueForUpload(fileRefList[fileID], request, fieldName);
			}

			processQueue();
		}

	    /**
	     *  Uploads all files to a specified path where a script handles writing to the server.
	     *  
	     *  @param fileID The ID of the file to be uploaded
	     *  @param url The path to the serverside script
	     *  @param method The HTTP submission method. Possible values are "GET" and "POST"
	     *  @param vars An object containing data to be sent along with the request
	     *  @param fieldName The field name that precedes the file data in the upload POST operation. The uploadDataFieldName value must be non-null and a non-empty String.
	     *  @param headers An object containing variables that should be set as headers in the POST request. The following header names
	     *  cannot be used: 
	     *  <code>
	     *  Accept-Charset, Accept-Encoding, Accept-Ranges, Age, Allow, Allowed, Authorization, Charge-To, Connect, Connection, 
	     *  Content-Length, Content-Location, Content-Range, Cookie, Date, Delete, ETag, Expect, Get, Head, Host, Keep-Alive, 
	     *  Last-Modified, Location, Max-Forwards, Options, Post, Proxy-Authenticate, Proxy-Authorization, Proxy-Connection, 
	     *  Public, Put, Range, Referer, Request-Range, Retry-After, Server, TE, Trace, Trailer, Transfer-Encoding, Upgrade, 
	     *  URI, User-Agent, Vary, Via, Warning, WWW-Authenticate, x-flash-version.
	     * </code>
	     */

		public function uploadAll(url:String, method:String = "GET", vars:Object = null, fieldName:String = "uploadFile", headers:Object = null):void {
			if(isEmptyString(method)) {
				method = "GET";
			}

			if(isEmptyString(fieldName)) {
				fieldName = "uploadFile";
			}

			var request:URLRequest = formURLRequest(url, method, vars);

			filesToUpload = [];

			// sort files in the order that they were given to us
			var fileIds:Array = [];
			for (var fileId:String in fileRefList) {
			  fileIds.push(parseInt(fileId.substr(4)));
			}
			fileIds.sort(Array.NUMERIC);
			for each(var fileId2:int in fileIds) {
			  queueForUpload(fileRefList["file"+fileId2], request, fieldName);
			}

			processQueue();
		}

	    /**
	     *  Cancels either an upload of the file corresponding to a given fileID, or in the absence of the specified fileID, all active files being uploaded.
		 *  
	     *  @param fileID The ID of the file to be uploaded
	     */

		public function cancel(fileID:String = null):void {

			logMessage("Canceling upload of " + fileID?fileID:"all files.");

			if (fileID == null) { // cancel all files
				for each (var item:FileReference in fileRefList) {
					item.cancel();
				}
				this.currentUploadThreads = 0;
				filesToUpload = [];
			} 

			else { // cancel specified file
				var fr:FileReference = fileRefList[fileID];
				if(fr == null){
					return;
				}
				if (this.currentUploadThreads > 0)
					this.currentUploadThreads--;
				fr.cancel();
			}

		}



		/*
			Events
			-------------------------------
			mouseDown - fires when the mouse button is pressed over uploader
			mouseUp - fires when the mouse button is released over uploader
			rollOver - fires when the mouse rolls over the uploader
			rollOut - fires when the mouse rolls out of the uploader
			click - fires when the uploader is clicked
			fileSelect - fires when the user selects one or more files (after browse is called). Passes the array of currently selected files (if prior browse calls were made and clearFileList hasn't been called, all files the user has ever selected will be returned), along with all information available about them (name, size, type, creationDate, modificationDate, creator). 
			uploadStart - fires when a file starts uploading. Passes a file id for identifying the file.
			uploadProgress - fires when a file upload reports progress. Passes the file id, as well as bytesUploaded and bytesTotal for the given file.
			uploadComplete - fires when a file upload is completed successfully and passes the corresponding file id.
			uploadCompleteData - fires when data is received from the server after upload and passes the corresponding file id and the said data.
			uploadError - fires when an error occurs during download. Passes the id of the file that was being uploaded and an error type.
		*/

		private function transparentDown (event:MouseEvent) : void {
			logMessage("Dispatching mousedown event.");
			var newEvent:Object = new Object();
			newEvent.type = "mousedown";
			bridge.sendEvent(newEvent);
		}

		private function transparentUp (event:MouseEvent) : void {
			logMessage("Dispatching mouseup event.");
			var newEvent:Object = new Object();
			newEvent.type = "mouseup";
			bridge.sendEvent(newEvent);
		}

		private function transparentRollOver (event:MouseEvent) : void {
			logMessage("Dispatching mouseenter event.");
			var newEvent:Object = new Object();
			newEvent.type = "mouseenter";
			bridge.sendEvent(newEvent);
		}

		private function transparentRollOut (event:MouseEvent) : void {
			logMessage("Dispatching mouseleave event.");
			var newEvent:Object = new Object();
			newEvent.type = "mouseleave";
			bridge.sendEvent(newEvent);
		}

		private function transparentClick (event:MouseEvent) : void {
			logMessage("Dispatching click event.");
			var newEvent:Object = new Object();
			newEvent.type = "click";
			bridge.sendEvent(newEvent);
		}


		private function uploadStart (event:Event) : void {
			logMessage("Dispatching uploadstart event for " + fileIDList[event.target]);
			var newEvent:Object = new Object();
			newEvent.id = fileIDList[event.target];
			newEvent.type = "uploadstart";
            bridge.sendEvent(newEvent);
		}



		private function uploadProgress (event:ProgressEvent) : void {
			logMessage("Dispatching uploadprogress event for " + fileIDList[event.target] + ": " + event.bytesLoaded.toString() + " / " + event.bytesTotal.toString());
			var newEvent:Object = new Object();
			newEvent.id = fileIDList[event.target];
			newEvent.bytesLoaded = event.bytesLoaded;
			newEvent.bytesTotal = event.bytesTotal;
			newEvent.type = "uploadprogress"
			bridge.sendEvent(newEvent);
		}



		private function uploadComplete (event:Event) : void {
			logMessage("Dispatching uploadcomplete event for " + fileIDList[event.target]);
			var newEvent:Object = new Object();
			newEvent.id = fileIDList[event.target];
			newEvent.type = "uploadcomplete"
			bridge.sendEvent(newEvent);

			this.currentUploadThreads--;
			// get next off of queue:
			processQueue();
		}



		private function uploadCompleteData (event:DataEvent) : void {
			logMessage("Dispatching uploadcompletedata event for " + fileIDList[event.target] + ": ");
			logMessage("Received the following data: " + event.data);
			var newEvent:Object = new Object();
			newEvent.id = fileIDList[event.target];
			newEvent.data = event.data;
			newEvent.type = "uploadcompletedata"
			bridge.sendEvent(newEvent);
		}

		private function uploadCancel (event:Event) : void {			
			logMessage("Dispatching uploadcancel event for " + fileIDList[event.target]);
			var newEvent:Object = new Object();
			newEvent.id = fileIDList[event.target];
			newEvent.type = "uploadcancel";
			bridge.sendEvent(newEvent);
		}



		private function uploadError (event:Event) : void {
	        var newEvent:Object = {};

			if (event is HTTPStatusEvent) {
				var myev:HTTPStatusEvent = event as HTTPStatusEvent;
				newEvent.status = myev.status;
				logMessage("HTTP status error for " + fileIDList[event.target] + ": " + myev.status);
			}

			else if (event is IOErrorEvent) {
				newEvent.status = event.toString();
				logMessage("IO error for " + fileIDList[event.target] + ". Likely causes are problems with Internet connection or server misconfiguration.");
			}

			else if (event is SecurityErrorEvent) {
				newEvent.status = event.toString();
				logMessage("Security error for " + fileIDList[event.target]);
			}
			logMessage ("Dispatching error event for " + fileIDList[event.target]);
			newEvent.type = "uploaderror";
			newEvent.id = fileIDList[event.target];

			bridge.sendEvent(newEvent);

			// get next off of queue:
			processQueue();
		}



		// Fired when the user selects a single file
		private function singleFileSelected(event:Event):void {
			this.clearFileList();
			addFile(event.target as FileReference);
			processSelection();
		}



		// Fired when the user selects multiple files
		private function multipleFilesSelected(event:Event):void {
			var currentFRL:FileReferenceList = multipleFiles;
			for each (var currentFR:FileReference in currentFRL.fileList) {
				addFile(currentFR);
			}
			processSelection();
		}

		private function renderAsButton () : void {

			logMessage("Rendering uploader as button...");
			buttonSkin = new Bitmap(new ButtonSkinData(110, 30));
			var _this:* = this;

			
			buttonSprite.addChild(buttonSkin);
			buttonSprite.useHandCursor = buttonSprite.buttonMode = true;
			buttonHeight = buttonSkin.height/4;
			buttonWidth = buttonSkin.width;
			var buttonMask:Sprite = new Sprite();
			buttonMask.graphics.beginFill(0x000000,1);
			buttonMask.graphics.drawRect(0,0,buttonWidth,buttonHeight);
			buttonMask.graphics.endFill();
			_this.addChild(buttonMask);
			buttonSprite.mask = buttonMask;

			var buttonStageResize:Function = function (evt:Event = null) : void {
		 		buttonSprite.width = _this.stage.stageWidth;
		 		buttonSprite.height = _this.stage.stageHeight*4;
		 		buttonMask.width = _this.stage.stageWidth;
		 		buttonMask.height = _this.stage.stageHeight;
		 	};

			buttonStageResize();

			_this.stage.scaleMode = StageScaleMode.NO_SCALE;
			_this.stage.align = StageAlign.TOP_LEFT;
			_this.stage.tabChildren = false;

			_this.stage.addEventListener(Event.RESIZE, buttonStageResize);

			_this.addEventListener(MouseEvent.ROLL_OVER, buttonMouseOver);
			_this.addEventListener(MouseEvent.ROLL_OUT, buttonMouseOut);
			_this.addEventListener(MouseEvent.MOUSE_DOWN, buttonMouseDown);
			_this.addEventListener(MouseEvent.MOUSE_UP, buttonMouseUp);
			_this.addEventListener(MouseEvent.CLICK, handleMouseClick);

			_this.stage.addEventListener(KeyboardEvent.KEY_DOWN, handleKeyDown);
			_this.stage.addEventListener(KeyboardEvent.KEY_UP, handleKeyUp);


			_this.addChild(buttonSprite);	
		

		}

		private function buttonMouseOver (event:MouseEvent) : void {
					buttonSkin.y = -1*buttonHeight;
		}

		private function buttonMouseOut  (event:MouseEvent) : void {
					buttonSkin.y = 0;
		}

		private function buttonMouseDown  (event:MouseEvent) : void {
					buttonSkin.y = -2*buttonHeight;
		}

		private function buttonMouseUp (event:MouseEvent) : void {
					buttonSkin.y = 0;
		}

		private function renderAsTransparent () : void {

		 	logMessage("Rendering uploader as transparent overlay.");

		 	function transparentStageResize (evt:Event) : void {
		 		buttonSprite.width = buttonSprite.stage.stageWidth;
		 		buttonSprite.height = buttonSprite.stage.stageHeight;
		 	}

			buttonSprite.graphics.beginFill(0xffffff, 0);
			buttonSprite.graphics.drawRect(0,0,5,5);
			buttonSprite.width = this.stage.stageWidth;
			buttonSprite.height = this.stage.stageHeight;
			buttonSprite.graphics.endFill();
			this.stage.scaleMode = StageScaleMode.NO_SCALE;
			this.stage.align = StageAlign.TOP_LEFT;
			this.stage.tabChildren = false;

			this.stage.addEventListener(Event.RESIZE, transparentStageResize);

			this.addEventListener(MouseEvent.CLICK, handleMouseClick);
			this.addEventListener(MouseEvent.CLICK, transparentClick);

			this.addEventListener(MouseEvent.MOUSE_DOWN, transparentDown);
			this.addEventListener(MouseEvent.MOUSE_UP, transparentUp);
			this.addEventListener(MouseEvent.ROLL_OVER, transparentRollOver);
			this.addEventListener(MouseEvent.ROLL_OUT, transparentRollOut);

			this.buttonMode = true;
			this.useHandCursor = true;
			this.addChild(buttonSprite);
		}

		private function handleKeyDown (evt:KeyboardEvent) : void {
			if (evt.keyCode == Keyboard.ENTER || evt.keyCode == Keyboard.SPACE) {
				logMessage("Keyboard 'Enter' or 'Space' down.");
				buttonSkin.y = -2*buttonHeight;
			}	
		}

		private function handleKeyUp (evt:KeyboardEvent) : void {
			if (evt.keyCode == Keyboard.ENTER || evt.keyCode == Keyboard.SPACE) {
				buttonSkin.y = 0;
				logMessage("Keyboard 'Enter' or 'Space' up.");
				logMessage("Keyboard 'Enter' or 'Space' detected, launching 'Open File' dialog.");
				this.browse(this.allowMultiple, this.filterArray);
			}
		}

		private function handleFocusIn (evt:FocusEvent) : void {
			logMessage("Focus is on the Uploader.");
		}

		private function handleFocusOut (evt:FocusEvent) : void {
			logMessage("Focus is out on the Uploader.");
		}


		private function handleMouseClick (evt:MouseEvent) : void {
			logMessage("Mouse click detected, launching 'Open File' dialog.");
			this.browse(this.allowMultiple, this.filterArray);
		}

		//--------------------------------------------------------------------------
		// 
		// Overridden Properties
		//
		//--------------------------------------------------------------------------

	    /**
		 *  @private
		 *  Initializes the component and enables communication with JavaScript
	     *
	     *  @param parent A container that the PopUpManager uses to place the Menu 
	     *  control in. The Menu control may not actually be parented by this object.
	     * 
	     *  @param xmlDataProvider The data provider for the Menu control. 
	     *  @see #dataProvider 
	     *  
	     *  @return An instance of the Menu class. 
	     *
	     *  @see #popUpMenu()
		 *  @see com.yahoo.astra.fl.data.XMLDataProvider
	     */

		protected function initializeComponent():void {

			// Initialize properties.
			fileDataList = new Object();
			fileRefList = new Object();
			fileIDList = new Dictionary();
			singleFile = new FileReference();
			multipleFiles = new FileReferenceList();

			fileIDCounter = 0;

			filesToUpload = [];

			//hack for IE shell browser
			var owner:* = this;
			setTimeout(function(){
				owner.initializeCallbacks();
			}, 50);
			renderAsButton();
			

		}

		protected function initializeCallbacks():void{
			bridge.addCallbacks ({
				removeFile:removeFile, 
				clearFileList:clearFileList, 
				upload:upload,
				uploadThese:uploadThese,
				uploadAll:uploadAll,
				cancel:cancel,
				setAllowLogging:setAllowLogging,
				setAllowMultipleFiles:setAllowMultipleFiles,
				setSimUploadLimit:setSimUploadLimit,
				setFileFilters:setFileFilters,
				disable:disable,
				enable:enable
				
			});
		}



		//--------------------------------------
		//  Private Methods
		//--------------------------------------

		/**
		 *  @private
		 *  Formats objects containing extensions of files to be filtered into formal FileFilter objects
		 */	

		private function processFileFilterObjects(filtersArray:Array) : Array {

			// TODO: Should we have an 'allowedExtensions' property that the JS user accesses directly? Potential here for typos ('extension' instead of 'extensions') as well as a misunderstanding of the nature of the expected array
			// TODO: Description not showing (testing on OS X PPC player)
			for (var i:int = 0; i < filtersArray.length; i++) {
				filtersArray[i] = new FileFilter(filtersArray[i].description, filtersArray[i].extensions, filtersArray[i].macType);
			}

			return filtersArray;
		}

		/**
		 *  @private
		 *  Outputs the files selected to an output panel and triggers a 'fileSelect' event.
		 */	

		private function processSelection():void {

			var dstring:String = "";
			dstring += "Files Selected: \n";

			for each (var item:Object in fileDataList) {
				dstring += item.name + "\n ";
			}

			logMessage(dstring);

			var newEvent:Object = new Object();
			newEvent.fileList = fileDataList;
			newEvent.type = "fileselect"

			bridge.sendEvent(newEvent);
		}



		/**
		 *  @private
		 *  Adds a file reference object to the internal queue and assigns listeners to its events
		 */	

		private function addFile(fr:FileReference):void {

			var fileID:String = "file" + fileIDCounter;
			var fileName:String = fr.name;
			var fileCDate:Date = fr.creationDate;
			var fileMDate:Date = fr.modificationDate;
			var fileSize:Number = fr.size;
			fileIDCounter++;

			fileDataList[fileID] = {id: fileID, name: fileName, cDate: fileCDate, mDate: fileMDate, size: fileSize};//, type: fileType, creator: fileCreator};

			fr.addEventListener(Event.OPEN, uploadStart);
            fr.addEventListener(ProgressEvent.PROGRESS, uploadProgress);
			fr.addEventListener(Event.COMPLETE, uploadComplete);
			fr.addEventListener(DataEvent.UPLOAD_COMPLETE_DATA, uploadCompleteData);
			fr.addEventListener(HTTPStatusEvent.HTTP_STATUS, uploadError);
	        fr.addEventListener(IOErrorEvent.IO_ERROR, uploadError);
            fr.addEventListener(SecurityErrorEvent.SECURITY_ERROR, uploadError);
			fr.addEventListener(Event.CANCEL,uploadCancel);

			fileRefList[fileID] = fr;
			fileIDList[fr] = fileID;
		}

		/**
		 *  @private
		 *  Queues a file for upload
		 */	
		private function queueForUpload(fr:FileReference, request:URLRequest, fieldName:String):void {
			filesToUpload.push( {fr:fr, request:request, fieldName:fieldName });
		}

		/**
		 *  @private
		 *  Uploads the next file in the upload queue.
		 */	

		private function processQueue():void {
			while (this.currentUploadThreads < this.simultaneousUploadLimit && filesToUpload.length > 0) {
				var objToUpload:Object = filesToUpload.shift();
				var fr:FileReference = objToUpload.fr;
				var request:URLRequest = objToUpload.request;
				var fieldName:String = objToUpload.fieldName;
				logMessage("Starting upload for " + objToUpload.id);
				fr.upload(request,fieldName);
				this.currentUploadThreads++;
			}
		}

		/**
		 *  @private
		 *  Creates a URLRequest object from a url, and optionally includes an HTTP request method and additional variables to be sent
		 */	

		private function formURLRequest(url:String, method:String = "GET", vars:Object = null):URLRequest {

			var request:URLRequest = new URLRequest();
			request.url = url;
			request.method = method;
			request.data = new URLVariables();


			for (var itemName:String in vars) {
				request.data[itemName] = vars[itemName];
			}


			return request;
		}

		/**
		 *  @private
		 *  Determines whether an object is equivalent to an empty string
		 */	

		private function isEmptyString(toCheck:*):Boolean {

			if(	toCheck == "null" ||
				toCheck == "" ||
				toCheck == null ) {

				return true;
			}

			else {
				return false;
			}
		}

		private function logMessage (message:String) : void {
			if (this.allowLog) {
				trace(message);
				
			}
			ExternalInterface.call('YAHOO.log', "k2:"+message);
		}

	}

}
