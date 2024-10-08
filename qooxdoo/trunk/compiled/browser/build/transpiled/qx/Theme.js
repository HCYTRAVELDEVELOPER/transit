function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.core.Environment": {
        "defer": "load",
        "usage": "dynamic",
        "require": true
      },
      "qx.Bootstrap": {
        "usage": "dynamic",
        "require": true
      }
    },
    "environment": {
      "provided": [],
      "required": {
        "qx.debug": {
          "load": true
        }
      }
    }
  };
  qx.Bootstrap.executePendingDefers($$dbClassInfo);

  /* ************************************************************************
  
     qooxdoo - the new era of web development
  
     http://qooxdoo.org
  
     Copyright:
       2004-2008 1&1 Internet AG, Germany, http://www.1und1.de
  
     License:
       MIT: https://opensource.org/licenses/MIT
       See the LICENSE file in the project's top-level directory for details.
  
     Authors:
       * Sebastian Werner (wpbasti)
       * Andreas Ecker (ecker)
  
  ************************************************************************ */

  /**
   * Theme classes contain styling information for certain aspects of the
   * graphical user interface.
   *
   * Supported themes are: colors, decorations, fonts, icons, appearances.
   * The additional meta theme allows for grouping of the individual
   * themes.
   *
   * For more details, take a look at the
   * <a href='http://qooxdoo.org/docs/#desktop/gui/theming.md' target='_blank'>
   * documentation of the theme system in the qooxdoo manual.</a>
   */
  qx.Bootstrap.define("qx.Theme", {
    statics: {
      /*
      ---------------------------------------------------------------------------
         PUBLIC API
      ---------------------------------------------------------------------------
      */

      /**
       * Theme config
       *
       * Example:
       * <pre class='javascript'>
       * qx.Theme.define("name",
       * {
       *   aliases : {
       *     "aliasKey" : "resourceFolderOrUri"
       *   },
       *   extend : otherTheme,
       *   include : [MMixinTheme],
       *   patch : [MMixinTheme],
       *   colors : {},
       *   decorations : {},
       *   fonts : {},
       *   widgets : {},
       *   appearances : {},
       *   meta : {},
       *   boot : function(){}
       * });
       * </pre>
       *
       * For more details, take a look at the
       * <a href='http://qooxdoo.org/docs/#desktop/gui/theming.md' target='_blank'>
       * documentation of the theme system in the qooxdoo manual.</a>
       *
       * @param name {String} name of the mixin
       * @param config {Map} config structure
       */
      define: function define(name, config) {
        if (!config) {
          var config = {};
        }

        config.include = this.__P_54_0(config.include);
        config.patch = this.__P_54_0(config.patch); // Validate incoming data

        // Create alias
        var theme = {
          $$type: "Theme",
          name: name,
          title: config.title,
          // Attach toString
          toString: this.genericToString
        }; // Remember extend

        if (config.extend) {
          theme.supertheme = config.extend;
        } // Assign to namespace


        theme.basename = qx.Bootstrap.createNamespace(name, theme); // Convert theme entry from Object to Function (for prototype inheritance)

        this.__P_54_1(theme, config);

        this.__P_54_2(theme, config); // Store class reference in global class registry


        this.$$registry[name] = theme; // Include mixin themes

        for (var i = 0, a = config.include, l = a.length; i < l; i++) {
          this.include(theme, a[i]);
        }

        for (var i = 0, a = config.patch, l = a.length; i < l; i++) {
          this.patch(theme, a[i]);
        } // Run boot code


        if (config.boot) {
          config.boot();
        }
      },

      /**
       * Normalize an object to an array
       *
       * @param objectOrArray {Object|Array} Either an object that is to be
       *   normalized to an array, or an array, which is just passed through
       *
       * @return {Array} Either an array that has the original object as its
       *   single item, or the original array itself
       */
      __P_54_0: function __P_54_0(objectOrArray) {
        if (!objectOrArray) {
          return [];
        }

        if (qx.Bootstrap.isArray(objectOrArray)) {
          return objectOrArray;
        } else {
          return [objectOrArray];
        }
      },

      /**
       * Initialize alias inheritance
       *
       * @param theme {Map} The theme
       * @param config {Map} config structure
       */
      __P_54_2: function __P_54_2(theme, config) {
        var aliases = config.aliases || {};

        if (config.extend && config.extend.aliases) {
          qx.Bootstrap.objectMergeWith(aliases, config.extend.aliases, false);
        }

        theme.aliases = aliases;
      },

      /**
       * Return a map of all known themes
       *
       * @return {Map} known themes
       */
      getAll: function getAll() {
        return this.$$registry;
      },

      /**
       * Returns a theme by name
       *
       * @param name {String} theme name to check
       * @return {Object ? void} theme object
       */
      getByName: function getByName(name) {
        return this.$$registry[name];
      },

      /**
       * Determine if theme exists
       *
       * @param name {String} theme name to check
       * @return {Boolean} true if theme exists
       */
      isDefined: function isDefined(name) {
        return this.getByName(name) !== undefined;
      },

      /**
       * Determine the number of themes which are defined
       *
       * @return {Number} the number of classes
       */
      getTotalNumber: function getTotalNumber() {
        return qx.Bootstrap.objectGetLength(this.$$registry);
      },

      /*
      ---------------------------------------------------------------------------
         PRIVATE/INTERNAL API
      ---------------------------------------------------------------------------
      */

      /**
       * This method will be attached to all themes to return
       * a nice identifier for them.
       *
       * @internal
       * @return {String} The interface identifier
       */
      genericToString: function genericToString() {
        return "[Theme " + this.name + "]";
      },

      /**
       * Extract the inheritable key (could be only one)
       *
       * @param config {Map} The map from where to extract the key
       * @return {String} the key which was found
       */
      __P_54_3: function __P_54_3(config) {
        for (var i = 0, keys = this.__P_54_4, l = keys.length; i < l; i++) {
          if (config[keys[i]]) {
            return keys[i];
          }
        }
      },

      /**
       * Convert existing entry to a prototype based inheritance function
       *
       * @param theme {Theme} newly created theme object
       * @param config {Map} incoming theme configuration
       */
      __P_54_1: function __P_54_1(theme, config) {
        var type = this.__P_54_3(config); // Use theme key from extended theme if own one is not available


        if (config.extend && !type) {
          type = config.extend.type;
        } // Save theme type


        theme.type = type || "other"; // Create pseudo class

        var clazz = function clazz() {}; // Process extend config


        if (config.extend) {
          clazz.prototype = new config.extend.$$clazz();
        }

        var target = clazz.prototype;
        var source = config[type]; // Copy entries to prototype

        for (var id in source) {
          target[id] = source[id]; // Appearance themes only:
          // Convert base flag to class reference (needed for mixin support)

          if (target[id].base) {
            target[id].base = config.extend;
          }
        } // store pseudo class


        theme.$$clazz = clazz; // and create instance under the old key

        theme[type] = new clazz();
      },

      /** @type {Map} Internal theme registry */
      $$registry: {},

      /** @type {Array} Keys which support inheritance */
      __P_54_4: ["colors", "borders", "decorations", "fonts", "icons", "widgets", "appearances", "meta"],

      /** @type {Map} allowed keys in theme definition */
      __P_54_5: qx.core.Environment.select("qx.debug", {
        "true": {
          title: "string",
          // String
          aliases: "object",
          // Map
          type: "string",
          // String
          extend: "object",
          // Theme
          colors: "object",
          // Map
          borders: "object",
          // Map
          decorations: "object",
          // Map
          fonts: "object",
          // Map
          icons: "object",
          // Map
          widgets: "object",
          // Map
          appearances: "object",
          // Map
          meta: "object",
          // Map
          include: "object",
          // Array
          patch: "object",
          // Array
          boot: "function" // Function

        },
        "default": null
      }),

      /** @type {Map} allowed keys inside a meta theme block */
      __P_54_6: qx.core.Environment.select("qx.debug", {
        "true": {
          color: "object",
          border: "object",
          decoration: "object",
          font: "object",
          icon: "object",
          appearance: "object",
          widget: "object"
        },
        "default": null
      }),

      /**
       * Validates incoming configuration and checks keys and values
       *
       * @signature function(name, config)
       * @param name {String} The name of the class
       * @param config {Map} Configuration map
       * @throws {Error} if the given config is not valid (e.g. wrong key or wrong key value)
       */
      __P_54_7: qx.core.Environment.select("qx.debug", {
        "true": function _true(name, config) {
          var allowed = this.__P_54_5;

          for (var key in config) {
            if (allowed[key] === undefined) {
              throw new Error('The configuration key "' + key + '" in theme "' + name + '" is not allowed!');
            }

            if (config[key] == null) {
              throw new Error('Invalid key "' + key + '" in theme "' + name + '"! The value is undefined/null!');
            }

            if (allowed[key] !== null && _typeof(config[key]) !== allowed[key]) {
              throw new Error('Invalid type of key "' + key + '" in theme "' + name + '"! The type of the key must be "' + allowed[key] + '"!');
            }
          } // Validate maps


          var maps = ["colors", "borders", "decorations", "fonts", "icons", "widgets", "appearances", "meta"];

          for (var i = 0, l = maps.length; i < l; i++) {
            var key = maps[i];

            if (config[key] !== undefined && (config[key] instanceof Array || config[key] instanceof RegExp || config[key] instanceof Date || config[key].classname !== undefined)) {
              throw new Error('Invalid key "' + key + '" in theme "' + name + '"! The value needs to be a map!');
            }
          } // Check conflicts (detect number ...)


          var counter = 0;

          for (var i = 0, l = maps.length; i < l; i++) {
            var key = maps[i];

            if (config[key]) {
              counter++;
            }

            if (counter > 1) {
              throw new Error("You can only define one theme category per file! Invalid theme: " + name);
            }
          } // Validate meta


          if (config.meta) {
            var value;

            for (var key in config.meta) {
              value = config.meta[key];

              if (this.__P_54_6[key] === undefined) {
                throw new Error('The key "' + key + '" is not allowed inside a meta theme block.');
              }

              if (_typeof(value) !== this.__P_54_6[key]) {
                throw new Error('The type of the key "' + key + '" inside the meta block is wrong.');
              }

              if (!(_typeof(value) === "object" && value !== null && value.$$type === "Theme")) {
                throw new Error('The content of a meta theme must reference to other themes. The value for "' + key + '" in theme "' + name + '" is invalid: ' + value);
              }
            }
          } // Validate extend


          if (config.extend && config.extend.$$type !== "Theme") {
            throw new Error('Invalid extend in theme "' + name + '": ' + config.extend);
          } // Validate include


          if (config.include) {
            for (var i = 0, l = config.include.length; i < l; i++) {
              if (typeof config.include[i] == "undefined" || config.include[i].$$type !== "Theme") {
                throw new Error('Invalid include in theme "' + name + '": ' + config.include[i]);
              }
            }
          } // Validate patch


          if (config.patch) {
            for (var i = 0, l = config.patch.length; i < l; i++) {
              if (typeof config.patch[i] === "undefined" || config.patch[i].$$type !== "Theme") {
                throw new Error('Invalid patch in theme "' + name + '": ' + config.patch[i]);
              }
            }
          }
        },
        "default": function _default() {}
      }),

      /**
       * Include all keys of the given mixin theme into the theme. The mixin may
       * include keys which are already defined in the target theme. Existing
       * features of equal name will be overwritten.
       *
       * @param theme {Theme} An existing theme which should be modified by including the mixin theme.
       * @param mixinTheme {Theme} The theme to be included.
       */
      patch: function patch(theme, mixinTheme) {
        this.__P_54_8(mixinTheme);

        var type = this.__P_54_3(mixinTheme);

        if (type !== this.__P_54_3(theme)) {
          throw new Error("The mixins '" + theme.name + "' are not compatible '" + mixinTheme.name + "'!");
        }

        var source = mixinTheme[type];
        var target = theme.$$clazz.prototype;

        for (var key in source) {
          target[key] = source[key];
        }
      },

      /**
       * Include all keys of the given mixin theme into the theme. If the
       * mixin includes any keys that are already available in the
       * class, they will be silently ignored. Use the {@link #patch} method
       * if you need to overwrite keys in the current class.
       *
       * @param theme {Theme} An existing theme which should be modified by including the mixin theme.
       * @param mixinTheme {Theme} The theme to be included.
       */
      include: function include(theme, mixinTheme) {
        this.__P_54_8(mixinTheme);

        var type = mixinTheme.type;

        if (type !== theme.type) {
          throw new Error("The mixins '" + theme.name + "' are not compatible '" + mixinTheme.name + "'!");
        }

        var source = mixinTheme[type];
        var target = theme.$$clazz.prototype;

        for (var key in source) {
          //Skip keys already present
          if (target[key] !== undefined) {
            continue;
          }

          target[key] = source[key];
        }
      },

      /**
       * Helper method to check for an invalid theme
       *
       * @param mixinTheme {qx.Theme?null} theme to check
       * @throws {Error} if the theme is not valid
       */
      __P_54_8: function __P_54_8(mixinTheme) {
        if (typeof mixinTheme === "undefined" || mixinTheme == null) {
          var errorObj = new Error("Mixin theme is not a valid theme!");
          throw errorObj;
        }
      }
    }
  });
  qx.Theme.$$dbClassInfo = $$dbClassInfo;
})();

//# sourceMappingURL=Theme.js.map?dt=1658886785608