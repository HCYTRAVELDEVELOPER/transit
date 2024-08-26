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
      "qx.tool.compiler.targets.meta.PackageJavascript": {
        "construct": true
      },
      "qx.lang.Type": {},
      "qx.lang.Array": {}
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
  const path = require("upath");

  const fs = require("fs");
  /**
   * A Package is a collection of files and resources, used by either the boot process
   * or by one or more Parts
   */


  qx.Class.define("qx.tool.compiler.targets.meta.Package", {
    extend: qx.core.Object,

    /**
     * Constructor
     */
    construct(appMeta, packageIndex) {
      qx.core.Object.constructor.call(this);
      this.__appMeta__P_45_0 = appMeta;
      this.__packageIndex__P_45_1 = packageIndex;
      this.__assets__P_45_2 = [];
      this.__locales__P_45_3 = {};
      this.__translations__P_45_4 = {};
      this.__javascriptMetas__P_45_5 = [];
      this.__classnames__P_45_6 = [];
      this.__javascript__P_45_7 = new qx.tool.compiler.targets.meta.PackageJavascript(this.__appMeta__P_45_0, this);
    },

    properties: {
      /** Whether to embed all the javascript into the one, main package .js file */
      embedAllJavascript: {
        init: false,
        check: "Boolean"
      },

      /** If true, this is generated on the fly and needs to be output */
      needsWriteToDisk: {
        init: true,
        check: "Boolean",
        apply: "_applyNeedsWriteToDisk"
      }
    },
    members: {
      /** @type {AppMeta} the AppMeta instance */
      __appMeta__P_45_0: null,

      /** @type {Integer} the package index, 0 == boot package */
      __packageIndex__P_45_1: -1,

      /** @type {qx.tool.compiler.resources.Asset[]} assets to be included in this package */
      __assets__P_45_2: null,

      /** @type {Map} locale data, indexed by locale ID */
      __locales__P_45_3: null,

      /** @type {Map} translations, indexed by message ID */
      __translations__P_45_4: null,

      /** @type {String[]} array of class names loaded by this package */
      __classnames__P_45_6: null,

      /** @type {AbstractJavascriptMeta[]} array of Javascript sources loaded by this package */
      __javascriptMetas__P_45_5: null,

      /** @type {AbstractJavascriptMeta} the javascript generated by this package */
      __javascript__P_45_7: null,

      /**
       * Detects whether this package is empty; packages can be added for a number
       * of reasons, but sometimes they don't actually end up with anything in them.
       *
       * Note that this is used to suppress the generation of an additional `package-*.js`
       * file in the output, and just means that the content of the file should be embedded
       * (or ignored) instead of written into that package file; however, there can still
       * be script files which need to be loaded by this package (and that is handled by
       * the index.js file)
       *
       * @return {Boolean}
       */
      isEmpty() {
        if (this.__assets__P_45_2.length > 0) {
          return false;
        }

        for (let localeId in this.__locales__P_45_3) {
          if (this.__locales__P_45_3[localeId]) {
            return false;
          }
        }

        for (let localeId in this.__translations__P_45_4) {
          if (this.__translations__P_45_4[localeId]) {
            return false;
          }
        }

        if (this.isEmbedAllJavascript()) {
          if (this.__javascriptMetas__P_45_5.length > 0) {
            return false;
          }
        }

        return true;
      },

      /**
       * Returns the package index
       *
       * @return {Integer}
       */
      getPackageIndex() {
        return this.__packageIndex__P_45_1;
      },

      /**
       * Adds an asset, expected to be unique
       *
       * @param asset {qx.tool.compiler.resources.Asset}
       */
      addAsset(asset) {
        this.__assets__P_45_2.push(asset);
      },

      /**
       * Returns the array of assets
       *
       * @return {qx.tool.compiler.resources.Asset[]}
       */
      getAssets() {
        return this.__assets__P_45_2;
      },

      /**
       * Adds locale data
       *
       * @param localeId {String}
       * @param localeData {Object}
       */
      addLocale(localeId, localeData) {
        this.__locales__P_45_3[localeId] = localeData;
      },

      /**
       * Returns locale data, as a map where the key is the locale ID
       *
       * @return {Map}
       */
      getLocales() {
        return this.__locales__P_45_3;
      },

      /**
       * Adds a translation
       *
       * @param localeId {String} locale ID
       * @param entry {Object} translation
       */
      addTranslationEntry(localeId, entry) {
        let translations = this.__translations__P_45_4[localeId];

        if (!translations) {
          this.__translations__P_45_4[localeId] = translations = {};
        }

        var msgstr = entry.msgstr;

        if (!qx.lang.Type.isArray(msgstr)) {
          msgstr = [msgstr];
        }

        if (msgstr[0]) {
          translations[entry.msgid] = msgstr[0];
        }

        if (entry.msgid_plural && msgstr[1]) {
          translations[entry.msgid_plural] = msgstr[1];
        }
      },

      /**
       * Returns a map of all translations, indexed by Locale ID
       *
       * @return {Object}
       */
      getTranslations() {
        return this.__translations__P_45_4;
      },

      /**
       * Adds a Javascript to be loaded by this package.  You typically need to
       * call `addClassname` also.
       *
       * @param jsMeta {AbstractJavascriptMeta}
       */
      addJavascriptMeta(jsMeta) {
        this.__javascriptMetas__P_45_5.push(jsMeta);
      },

      /**
       * Returns a list of all Javascripts to be loaded by this package
       *
       * @return {AbstractJavascriptMeta[]}
       */
      getJavascriptMetas() {
        return this.__javascriptMetas__P_45_5;
      },

      /**
       * Removes a Javascript
       *
       * @param jsMeta {AbstractJavascriptMeta} the javascript to remove
       */
      removeJavascriptMeta(jsMeta) {
        qx.lang.Array.remove(this.__javascriptMetas__P_45_5, jsMeta);
      },

      /**
       * Adds a classname to the list which is loaded by this package; this does not
       * cause the code to be loaded, @see {addJavascriptMeta}.
       *
       * @param classname {String}
       */
      addClassname(classname) {
        this.__classnames__P_45_6.push(classname);
      },

      /**
       * Returns a list of all classnames
       *
       * @return {String[]}
       */
      getClassnames() {
        return this.__classnames__P_45_6;
      },

      /**
       * Returns the AbstractJavascriptMeta for this Package
       *
       * @return {AbstractJavascriptMeta}
       */
      getJavascript() {
        return this.__javascript__P_45_7;
      },

      /**
       * Writes the data into the configuration which is passed to the loader template
       *
       * @param packages {Object} the `qx.$$packages` object data
       */
      serializeInto(packages) {
        let data = packages[String(this.__packageIndex__P_45_1)] = {
          uris: []
        };

        let appRoot = this.__appMeta__P_45_0.getApplicationRoot();

        const toUri = filename => {
          if (this.__appMeta__P_45_0.isAddTimestampsToUrls()) {
            let stat = fs.statSync(filename, {
              throwIfNoEntry: false
            });
            let uri = path.relative(appRoot, filename);

            if (stat) {
              uri += "?" + stat.mtimeMs;
            }

            return uri;
          } else {
            return path.relative(appRoot, filename);
          }
        };

        if (!this.isEmbedAllJavascript()) {
          data.uris = this.__javascriptMetas__P_45_5.map(js => toUri(js.getFilename()));
        }

        if (this.isNeedsWriteToDisk()) {
          data.uris.unshift(toUri(this.__javascript__P_45_7.getFilename()));
        }
      },

      /**
       * Apply for needsWriteToDisk property
       */
      _applyNeedsWriteToDisk(value) {
        this.__javascript__P_45_7.setNeedsWriteToDisk(value);
      }

    }
  });
  qx.tool.compiler.targets.meta.Package.$$dbClassInfo = $$dbClassInfo;
})();

//# sourceMappingURL=Package.js.map