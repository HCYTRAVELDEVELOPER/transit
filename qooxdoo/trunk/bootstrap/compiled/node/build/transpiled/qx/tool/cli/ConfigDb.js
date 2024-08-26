(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.Class": {
        "usage": "dynamic",
        "require": true
      },
      "qx.core.Object": {
        "construct": true,
        "require": true
      },
      "qx.tool.utils.Json": {},
      "qx.tool.utils.Utils": {}
    }
  };
  qx.Bootstrap.executePendingDefers($$dbClassInfo);

  /* ************************************************************************
  
     qooxdoo - the new era of web development
  
     http://qooxdoo.org
  
     Copyright:
       2018 Zenesis Ltd
  
     License:
       MIT: https://opensource.org/licenses/MIT
       See the LICENSE file in the project's top-level directory for details.
  
     Authors:
       * John Spackman (john.spackman@zenesis.com, @johnspackman)
  
  ************************************************************************ */
  const path = require("path");
  /**
   * Controls access to the local configuration
   */


  qx.Class.define("qx.tool.cli.ConfigDb", {
    extend: qx.core.Object,

    construct() {
      qx.core.Object.constructor.call(this);
      this.__P_4_0 = {};
    },

    properties: {
      path: {
        nullable: false,
        check: "String",
        apply: "_applyPath"
      }
    },
    members: {
      __P_4_1: null,
      __P_4_0: null,

      /**
       * Apply for path property
       * @returns
       */
      async _applyPath(value, oldValue) {
        this.__P_4_1 = {};
      },

      /**
       * Loads the configuration
       */
      async load() {
        this.__P_4_1 = (await qx.tool.utils.Json.loadJsonAsync(this.getPath())) || {};
      },

      /**
       * Saves the configuration
       */
      async save() {
        await qx.tool.utils.Utils.makeParentDir(this.getPath());
        await qx.tool.utils.Json.saveJsonAsync(this.getPath(), this.__P_4_1);
      },

      /**
       * Sets a temporary override
       */
      setOverride(key, value) {
        if (value === undefined) {
          delete this.__P_4_0[key];
        } else {
          this.__P_4_0[key] = value;
        }
      },

      /**
       * Returns the database root.  If the `path` parameter is provided, this will try and locate it;
       * if `defaultValue` is provided then it will create the object and also any intermediate objects
       * along the way.  If `path` is not returned, then the root object is returned
       *
       * @param path {String?} optional path into the database; note array subscripts are not supported
       * @param defaultValue {Object?} optional value to assign if it does not exist.
       * @return {Object?} the value
       */
      db(path, defaultValue) {
        if (path) {
          let override = this.__P_4_0[path];

          if (override) {
            return override;
          }

          var result = this.__P_4_1;
          var segs = path.split(".");

          for (var i = 0; i < segs.length; i++) {
            let seg = segs[i];
            var tmp = result[seg];

            if (tmp === undefined) {
              if (defaultValue === undefined) {
                return undefined;
              }

              if (i == segs.length - 1) {
                tmp = result[seg] = defaultValue;
              } else {
                tmp = result[seg] = {};
              }
            }

            result = tmp;
          }

          return result;
        }

        return this.__P_4_1;
      }

    },

    defer(statics) {
      statics.__P_4_2 = path.join(require("os").homedir(), ".qooxdoo/");
    },

    statics: {
      /** Singleton default instance */
      __P_4_3: null,

      /** The directory where config files (any any other temporary/cached data) is kept */
      __P_4_2: null,

      /**
       * Gets the default instance of ConfigDb, loaded with the global config
       *
       * @returns {ConfigDb}
       */
      async getInstance() {
        let db = qx.tool.cli.ConfigDb.__P_4_3;

        if (!db) {
          db = qx.tool.cli.ConfigDb.__P_4_3 = new qx.tool.cli.ConfigDb();
          db.setPath(path.join(qx.tool.cli.ConfigDb.getDirectory(), "config.json"));
          await db.load();
        }

        return db;
      },

      /**
       * Returns the local directory, where cache and configuration are kept
       */
      getDirectory() {
        return this.__P_4_2;
      },

      /**
       * Wrapper for non-static version of db
       *
       * @see qx.tool.cli.ConfigDb.db
       */
      db(path, defaultValue) {
        return qx.tool.cli.ConfigDb.getInstance().db(path, defaultValue);
      }

    }
  });
  qx.tool.cli.ConfigDb.$$dbClassInfo = $$dbClassInfo;
})();

//# sourceMappingURL=ConfigDb.js.map