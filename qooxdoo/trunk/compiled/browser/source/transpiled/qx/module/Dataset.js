(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.Bootstrap": {
        "usage": "dynamic",
        "require": true
      },
      "qx.bom.element.Dataset": {},
      "qxWeb": {
        "defer": "runtime"
      }
    }
  };
  qx.Bootstrap.executePendingDefers($$dbClassInfo);

  /* ************************************************************************
  
     qooxdoo - the new era of web development
  
     http://qooxdoo.org
  
     Copyright:
       2007-2013 1&1 Internet AG, Germany, http://www.1und1.de
  
     License:
       MIT: https://opensource.org/licenses/MIT
       See the LICENSE file in the project's top-level directory for details.
  
     Authors:
       * Romeo Kenfack (rkenfack)
  
  ************************************************************************ */

  /**
   * Module for handling of HTML5 data-* attributes
   */
  qx.Bootstrap.define("qx.module.Dataset", {
    members: {
      /**
       * Sets an HTML "data-*" attribute on each item in the collection
       *
       * @attach {qxWeb}
       * @param name {String} Name of the attribute [CamelCase variant]
       * @param value {var} New value of the attribute
       * @return {qxWeb} The collection for chaining
       */
      setData(name, value) {
        this._forEachElement(function (item) {
          qx.bom.element.Dataset.set(item, name, value);
        });

        return this;
      },

      /**
       *
       * Returns the value of the given HTML "data-*" attribute for the first item in the collection
       *
       * @attach {qxWeb}
       * @param name {String} Name of the attribute [CamelCase variant]
       * @return {var} The value of the attribute
       *
       */
      getData(name) {
        if (this[0] && this[0].nodeType === 1) {
          return qx.bom.element.Dataset.get(this[0], name);
        }
      },

      /**
       * Returns a map containing all the HTML "data-*" attributes of the specified element
       *
       * @attach {qxWeb}
       * @return {Map} The map containing the "data-*" attributes
       *
       */
      getAllData() {
        if (this[0] && this[0].nodeType === 1) {
          return qx.bom.element.Dataset.getAll(this[0]);
        }

        return {};
      },

      /**
       * Checks if any element in the collection has a "data-*" attribute
       * @return {Boolean} True if any element in the collection has a "data-*" attribute
       */
      hasData() {
        return qx.bom.element.Dataset.hasData(this[0]);
      },

      /**
       * Remove an HTML "data-*" attribute on each item in the collection
       *
       * @attach {qxWeb}
       * @param name {String} Name of the attribute
       * @return {qxWeb} The collection for chaining
       */
      removeData(name) {
        this._forEachElement(function (item) {
          qx.bom.element.Dataset.remove(item, name);
        });

        return this;
      }

    },

    defer(statics) {
      qxWeb.$attachAll(this);
    }

  });
  qx.module.Dataset.$$dbClassInfo = $$dbClassInfo;
})();

//# sourceMappingURL=Dataset.js.map?dt=1658886708714