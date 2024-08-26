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
      "qx.tool.utils.Promisify": {},
      "qx.tool.compiler.targets.meta.Part": {},
      "qx.tool.compiler.targets.meta.Package": {}
    }
  };
  qx.Bootstrap.executePendingDefers($$dbClassInfo);

  /* ************************************************************************
   *
   *    qooxdoo-compiler - node.js based replacement for the Qooxdoo python
   *    toolchain
   *
   *    https://github.com/qooxdoo/qooxdoo-compiler
   *
   *    Copyright:
   *      2011-2021 Zenesis Limited, http://www.zenesis.com
   *
   *    License:
   *      MIT: https://opensource.org/licenses/MIT
   *
   *      This software is provided under the same licensing terms as Qooxdoo,
   *      please see the LICENSE file in the Qooxdoo project's top-level directory
   *      for details.
   *
   *    Authors:
   *      * John Spackman (john.spackman@zenesis.com, @johnspackman)
   *
   * ************************************************************************/

  /**
   * ApplicationMeta collects all the data about an application being compiled by a target,
   * in a form easily navigated and well documented.
   *
   * It provides an abstraction where the target can choose to restructure and reorganise the
   * output as it progresses - for example, a target may start by assembling a number of
   * javascript files, and then bundle them together, effectively replacing several files
   * with just one intermediate file; the target can then replace the intermediate file with
   * a minified file etc.
   */
  qx.Class.define("qx.tool.compiler.targets.meta.ApplicationMeta", {
    extend: qx.core.Object,

    construct(target, application) {
      qx.core.Object.constructor.call(this);
      this.__P_42_0 = target;
      this.__P_42_1 = application;
      this.__P_42_2 = [];
      this.__P_42_3 = {
        urisBefore: [],
        cssBefore: []
      };
      this.__P_42_4 = [];
      this.__P_42_5 = {};
      this.__P_42_6 = [];
      this.__P_42_7 = [];
      this.__P_42_8 = {};
    },

    properties: {
      /** The environment for the build */
      environment: {// Any object
      },

      /**
       * Whether to add timestamps to all URLs (cache busting)
       */
      addTimestampsToUrls: {
        init: true,
        check: "Boolean"
      },
      appLibrary: {
        check: "qx.tool.compiler.app.Library"
      },
      bootMetaJs: {
        check: "qx.tool.compiler.targets.meta.AbstractJavascriptMeta"
      },
      sourceUri: {
        check: "String"
      },
      resourceUri: {
        check: "String"
      }
    },
    members: {
      /** {qx.tool.compiler.targets.Target} the target */
      __P_42_0: null,

      /** {qx.tool.compiler.app.Application} the application */
      __P_42_1: null,

      /** {qx.tool.compiler.app.Libary[]} the libraries */
      __P_42_2: null,

      /** {Map} uris and CSS to load */
      __P_42_3: null,

      /** {String[]} code to run before boot */
      __P_42_4: null,

      /** {Map} list of resource paths, indexed by resource id */
      __P_42_5: null,

      /** {Package[]} list of packages */
      __P_42_6: null,

      /** {Part[]} list of parts */
      __P_42_7: null,

      /**
       * Sets an environment variable
       *
       * @param key {String} the name of the variable
       * @param value {Object} the value
       */
      setEnvironmentValue(key, value) {
        let env = this.getEnvironment();

        if (value === undefined) {
          delete env[key];
        } else {
          env[key] = value;
        }
      },

      /**
       * Returns an environment value
       *
       * @param key {String} the key to lookup
       * @param defaultValue {Object?} optional default value to use if the key is not found
       * @return {Object} the value, or undefined if not found
       */
      getEnvironmentValue(key, defaultValue) {
        let env = this.getEnvironment();
        let value = env[key];

        if (value === undefined) {
          if (defaultValue !== undefined) {
            env[key] = defaultValue;
          }

          value = defaultValue;
        }

        return value;
      },

      /**
       * Returns the application
       *
       * @return {qx.tool.compiler.app.Application}
       */
      getApplication() {
        return this.__P_42_1;
      },

      /**
       * Returns the target
       *
       * @return {qx.tool.compiler.targets.Target}
       */
      getTarget() {
        return this.__P_42_0;
      },

      /**
       * Returns the application root
       *
       * @return {String} the folder
       */
      getApplicationRoot() {
        return this.__P_42_0.getApplicationRoot(this.__P_42_1);
      },

      /**
       * Returns the Analyser
       *
       * @return {qx.tool.compiler.Analyser}
       */
      getAnalyser() {
        return this.__P_42_1.getAnalyser();
      },

      /**
       * Syncs all assets into the output directory
       */
      async syncAssets() {
        for (let i = 0; i < this.__P_42_6.length; i++) {
          let pkg = this.__P_42_6[i];
          await qx.tool.utils.Promisify.poolEachOf(pkg.getAssets(), 10, asset => asset.sync(this.__P_42_0));
        }
      },

      /**
       * Adds a library
       *
       * @param library {qx.tool.compiler.app.Library}
       */
      addLibrary(library) {
        this.__P_42_2.push(library);
      },

      /**
       * Returns the library that contains the application class
       *
       * @return {qx.tool.compiler.app.Library}
       */
      getAppLibrary() {
        let appLibrary = this.__P_42_1.getAnalyser().getLibraryFromClassname(this.__P_42_1.getClassName());

        return appLibrary;
      },

      /**
       * Returns the list of libraries
       *
       * @return {qx.tool.compiler.app.Library[]}
       */
      getLibraries() {
        return this.__P_42_2;
      },

      /**
       * Adds an external resource (JS or CSS) to be loaded which is a http[s] URL
       *
       * @param type {String} either "urisBefore" or "cssBefore"
       * @param uri {String} uri to load
       */
      addExternal(type, uri) {
        this.__P_42_3[type].push("__external__:" + uri);
      },

      /**
       * Adds an external resource (JS or CSS) to be loaded, which is a resource path
       *
       * @param type {String} either "urisBefore" or "cssBefore"
       * @param uri {String} uri to load
       */
      addPreload(type, uri) {
        this.__P_42_3[type].push(uri);
      },

      /**
       * Returns the list of preloads, which is a map by type
       *
       * @return {Map}
       */
      getPreloads() {
        return this.__P_42_3;
      },

      /**
       * Adds code to be run before the boot code is run
       *
       * @param code {String} the code to run
       */
      addPreBootCode(code) {
        this.__P_42_4.push(code);
      },

      /**
       * Returns the code to be run before the boot code
       *
       * @return {String} the code
       */
      getPreBootCode() {
        return this.__P_42_4.join("\n");
      },

      /**
       * Creates a new Part and adds it
       *
       * @param name {String} identifier
       * @return {Part}
       */
      createPart(name) {
        let part = new qx.tool.compiler.targets.meta.Part(this.getTarget(), name, this.__P_42_7.length);

        this.__P_42_7.push(part);

        this.__P_42_8[name] = part;
        return part;
      },

      /**
       * Returns a list of all parts
       *
       * @return {Part[]}
       */
      getParts() {
        return this.__P_42_7;
      },

      /**
       * Returns a part with a given name
       *
       * @param name {String} the name to look for
       */
      getPart(name) {
        return this.__P_42_8[name] || null;
      },

      /**
       * Returns a list of all packages
       *
       * @return {Package[]}
       */
      getPackages() {
        return this.__P_42_6;
      },

      /**
       * Creates a package and adds it
       *
       * @return {Package}
       */
      createPackage() {
        let pkg = new qx.tool.compiler.targets.meta.Package(this, this.__P_42_6.length);

        this.__P_42_6.push(pkg);

        return pkg;
      },

      /**
       * Gets a package for specific locale, creating a part with the name set to the localeId
       * if there isn't one already.  Used for when i18nAsParts == true
       *
       * @param localeId {String} the locale to look for
       * @return {Package}
       */
      getLocalePackage(localeId) {
        let part = this.getPart(localeId);

        if (!part) {
          part = this.createPart(localeId);
          part.addPackage(this.createPackage());
        }

        let pkg = part.getDefaultPackage();
        return pkg;
      },

      /**
       * Adds a resource
       *
       * @param key {String} the resource identifier
       * @param path {String} the path to the resource
       */
      addResource(key, path) {
        this.__P_42_5[key] = path;
      },

      /**
       * Returns all of the resources
       *
       * @return {Map}
       */
      getResources() {
        return this.__P_42_5;
      }

    }
  });
  qx.tool.compiler.targets.meta.ApplicationMeta.$$dbClassInfo = $$dbClassInfo;
})();

//# sourceMappingURL=ApplicationMeta.js.map