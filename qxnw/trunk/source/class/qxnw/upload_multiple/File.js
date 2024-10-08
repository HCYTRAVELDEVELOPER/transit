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
 * Represents a file that is to be or has been uploaded; this should be instantiated
 * by the _createFile method of AbstractHandler implementations and is not expected 
 * to be used separately
 */
qx.Class.define("qxnw.upload_multiple.File", {
	extend: qx.core.Object,
	
	/**
	 * Constructor
	 * @param browserObject {DOM} Anythign the AbstractHandler wants to store, typically an input[type=file] or a File
	 * @param filename {String} the name of the file
	 * @param id {String} the unique id of the file
	 */
	construct: function(browserObject, filename, id) {
		this.base(arguments);
		qx.core.Assert.assertNotNull(browserObject);
		qx.core.Assert.assertNotNull(filename);
		qx.core.Assert.assertNotNull(id);
		this.__browserObject = browserObject;
		this.setFilename(filename);
		this.setId(id);
	},
	
	properties: {
		/**
		 * The filename
		 */
		filename: {
			check: "String",
			nullable: false,
			event: "changeFilename"
		},
		
		/**
		 * A unique ID for the upload 
		 */
		id: {
			check: "String",
			nullable: false,
			event: "changeId"
		},
		
		/**
		 * Size of the file, if known (not available on older browsers)
		 */
		size: {
			check: "Integer",
			nullable: false,
			init: -1,
			event: "changeSize"
		},
		
		/**
		 * Progress of the upload, if known (not available on older browsers)
		 */
		progress: {
			check: "Integer",
			nullable: false,
			init: 0,
			event: "changeProgress"
		},
		
		/**
		 * State of the file, re: uploading
		 */
		state: {
			check: [ "not-started", "uploading", "cancelled", "uploaded" ],
			nullable: false,
			init: "not-started",
			event: "changeState",
			apply: "_applyState"
		},
		
		/**
		 * The response string received from the server
		 */
		response: {
			init: null,
			nullable: true,
			check: "String",
			event: "changeResponse"
		},
		
		/**
		 * The widget that triggered the upload
		 */
		uploadWidget: {
			init: null,
			nullable: true,
			event: "changeUploadWidget"
		}
	},
	
	members: {
		__browserObject: null,
		__params: null,
		
		/**
		 * Sets a parameter value to be sent with the file
		 * @param name {String} name of the parameter
		 * @param value {String} the value of the parameter, or null to delete a previous parameter
		 */
		setParam: function(name, value) {
			if (value !== null && typeof value != "string")
				value ="" + value;
			if (!this.__params)
				this.__params = {};
			this.__params[name] = value;
		},
		
		/**
		 * Returns a parameter value to be sent with the file
		 * @param name
		 * @returns {Boolean}
		 */
		getParam: function(name) {
			return this.__params && this.__params[name];
		},
		
		/**
		 * Returns a list of parameter names
		 * @returns {Array}
		 */
		getParamNames: function() {
			var result = [];
			if (this.__params)
				for (var name in this.__params)
					result.push(name);
			return result;
		},
		
		/**
		 * Returns the browser object
		 * @returns {DOM}
		 */
		getBrowserObject: function() {
			return this.__browserObject;
		},
		
		/**
		 * Called for changes to the state
		 * @param value
		 * @param oldValue
		 */
		_applyState: function(value, oldValue) {
			qx.core.Assert.assertTrue(
					(!oldValue && value == "not-started") ||
					(oldValue == "not-started" && (value == "cancelled" || value == "uploading")) ||
					(oldValue == "uploading" && (value == "cancelled" || value == "uploaded"))
					);
		}
	}
});