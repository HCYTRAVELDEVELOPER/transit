/* ***********************************************************************

   UploadMgr - provides an API for uploading one or multiple files
   with progress feedback (on modern browsers), does not block the user 
   interface during uploads, supports cancelling uploads.

   http://qooxdoo.org

   Copyright:
     2011 Zenesis Limited, http://www.zenesis.com

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     
     This software is provided under the same licensing terms as Qooxdoo,
     please see the LICENSE file in the Qooxdoo project's top-level directory 
     for details.

   Authors:
     * John Spackman (john.spackman@zenesis.com)

************************************************************************/

/**
 * Base class for upload implementations; operates a queue of pending and
 * current uploads, and restricts the number of simultaneous uploads.
 */
qx.Class.define("qxnw.upload_multiple.AbstractHandler", {
	extend: qx.core.Object,
	
	/**
	 * Constructor
	 * @param uploader {qxnw.upload_multiple.UploadMgr} controller for uploading
	 */
	construct: function(uploader) {
		this.base(arguments);
		qx.core.Assert.assertNotNull(uploader);
		this.__queue = [];
		this.__current = [];
		this.__params = {};
		this.__uploader = uploader;
	},
	
	properties: {
		/**
		 * Maximum number of simultaneous uploads
		 */
		maxConnections: {
			check: "Integer",
			init: 5,
			nullable: false,
			event: "changeMaxConnections"
		}
	},
	
	members: {
		// Last unique ID used
		__lastId: 0,
		
		// Uploader instance
		__uploader: null,
		
		// Queue of qxnw.upload_multiple.File's to send
		__queue: null,
		
		// List of qxnw.upload_multiple.File's currently being sent
		__current: null,
		
		// Parameters to post with the file
		__params: null,
		
		/**
		 * Adds a file to the upload queue; this does not start uploading until
		 * beginUploads is called.
		 * @param input {DOM} either one input[type=file] or an array of input[type=file]
		 * @param widget {Widget} the widget that trigger the upload
		 */
		addFile: function(input, widget) {
			var files = this._createFile(input);
			if (!qx.lang.Type.isArray(files)) {
				files.setUploadWidget(widget);
				this._addFile(files);
			} else
				for (var i = 0; i < files.length; i++) {
					files[i].setUploadWidget(widget);
					this._addFile(files[i]);
				}
		},
		
		/**
		 * Adds a file to the outbound queue
		 * @param file {qxnw.upload_multiple.File} the file to add
		 */
		_addFile: function(file) {
			this.__queue.push(file);
			this.__uploader.fireDataEvent("addFile", file);
		},
		
		/**
		 * Begins spooling uploads to the server, up to the maxConnections 
		 */
		beginUploads: function() {
			while (this.__queue.length > 0 && this.__current.length < this.getMaxConnections()) {
				var file = this.__queue.shift();
				this.__current.push(file);
				this.__uploader.fireDataEvent("beginUpload", file);
				file.setState("uploading");
				this._doUpload(file);
			}
		},
		
		/**
		 * Cancels a file
		 * @param file {qxnw.upload_multiple.File} the file to cancel
		 */
		cancel: function(file) {
			var wasUploading = this.__current.length > 0;
			//this.debug("cancelled: id=" + file.getId() + ", fileName=" + file.getFilename());
			this._cancel(file);
			if (wasUploading && this.__uploader.getAutoUpload())
				this.beginUploads();
		},
		
		/**
		 * Cancels all uploads
		 */
		cancelAll: function() {
			for (var current = this.__current, i = 0; i < current.length; i++)
				this._cancel(current[i]);
			this.__current.splice(0, this.__current.length);
			this.__queue.splice(0, this.__queue.length);
		},
		
		/**
		 * Cancels a file
		 * @param file {qxnw.upload_multiple.File} the file to cancel
		 */
		_cancel: function(file) {
			var inCurrent = false;
			for (var current = this.__current, i = 0; i < current.length; i++)
				if (current[i] == file) {
					current.splice(i, 1);
					inCurrent = true;
					break;
				}
			for (var queue = this.__queue, i = 0; i < queue.length; i++)
				if (queue[i] == file) {
					queue.splice(i, 1);
					break;
				}
			file.setState("cancelled");
			if (inCurrent)
				this._doCancel(file);
			this.__uploader.fireDataEvent("cancelUpload", file);
		},
		
		/**
		 * Called by derived classes when a file has completed
		 * @param file {qxnw.upload_multiple.File} the file which has finsihed uploading
		 * @param response {String} text received
		 */
		_onCompleted: function(file, response) {
			//this.debug("completed: id=" + file.getId() + ", fileName=" + file.getFilename() + ", response=" + response);
			var current = this.__current;
			for (var i = 0; i < current.length; i++)
				if (current[i] == file) {
					current.splice(i, 1);
					break;
				}
			
			file.setResponse(response);
			
			// File state should be uploading or cancelled
			if (file.getState() == "uploading") {
				file.setState("uploaded");
				this.__uploader.fireDataEvent("completeUpload", file);
			}
			
			// Start the next one
			this.beginUploads();
		},
		
		/**
		 * Returns the uploader
		 * @returns {qxnw.upload_multiple.UploadMgr}
		 */
		_getUploader: function() {
			return this.__uploader;
		},
		
		/**
		 * Allocates a unique ID
		 * @returns {Number}
		 */
		_getUniqueFileId: function() {
			return ++this.__lastId;
		},
		
		/**
		 * Adds a parameter to send to the client
		 * @param key {String} the name of the parameter
		 * @param value {String} the value of the parameter
		 * @deprecated see qxnw.upload_multiple.UploadMgr.setParam or qxnw.upload_multiple.File.setParam
		 */
		addParam: function(key, value) {
			qx.log.Logger.deprecatedMethodWarning(arguments.callee, "see qxnw.upload_multiple.UploadMgr.setParam or qxnw.upload_multiple.File.setParam");
			this.__params[key] = value;
		},
		
		/**
		 * Returns the paramaters map
		 * @returns {Map}
		 * @deprecated see qxnw.upload_multiple.File.getParam
		 */
		getParams: function() {
			qx.log.Logger.deprecatedMethodWarning(arguments.callee, "see qxnw.upload_multiple.UploadMgr.getParam or qxnw.upload_multiple.File.getParam");
			return this.__params;
		},
		
		/**
		 * Helper method that produces a final list of parameter values, by merging those
		 * set in this with those in the file.
		 * @param file {File} the file object
		 * @returns {Map} map of parameters to sent to the server
		 */
		_getMergedParams: function(file) {
			var result = {};
			for (var name in this.__params) {
				var value = this.__params[name];
				if (value !== null)
					result[name] = value;
			}
			function merge(obj) {
				var names = obj.getParamNames();
				for (var i = 0; i < names.length; i++) {
					var name = names[i],
						value = obj.getParam(name);
					if (value !== null)
						result[name] = value;
					else
						delete result[name];
				}
			}
			merge(this.__uploader);
			if (typeof file.getParamNames == "function")
				merge(file.getUploadWidget());
			merge(file);
			return result;
		},
		
		/**
		 * Implementation must create a qxnw.upload_multiple.File or array of qxnw.upload_multiple.File 
		 * @param input {DOM} the DOM input[type=file]
		 * @return {qxnw.upload_multiple.File|qxnw.upload_multiple.File[]}
		 */
		_createFile: function(input) {
			/* abstract */
		},
		
		/**
		 * Called to do the real work of uploading the file
		 * @param file {qxnw.upload_multiple.File}
		 */
		_doUpload: function(file) {
			/* abstract */
		},
		
		/**
		 * Called to cancel the upload
		 * @param file {qxnw.upload_multiple.File} file to cancel uploading
		 */
		_doCancel: function(file) {
			/* abstract */
		}
		
	}
});