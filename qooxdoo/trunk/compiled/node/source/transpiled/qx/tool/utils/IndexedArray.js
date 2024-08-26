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
      }
    }
  };
  qx.Bootstrap.executePendingDefers($$dbClassInfo);

  /* ************************************************************************
   *
   *    qooxdoo-compiler - node.js based replacement for the Qooxdoo python
   *    toolchain
   *
   *    https://github.com/qooxdoo/qooxdoo
   *
   *    Copyright:
   *      2011-2017 Zenesis Limited, http://www.zenesis.com
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
   * *********************************************************************** */

  /**
   * Provides a simple, array like interface which uses a lookup to provide indexed
   * access.  Each element must be a string
   */
  qx.Class.define("qx.tool.utils.IndexedArray", {
    extend: qx.core.Object,

    construct() {
      qx.core.Object.constructor.call(this);
      this.__array__P_52_0 = [];
      this.__lookup__P_52_1 = {};
      this.__removed__P_52_2 = false;
    },

    properties: {
      keepSorted: {
        init: false,
        nullable: false,
        check: "Boolean"
      }
    },
    members: {
      __dirtySort__P_52_3: false,
      __array__P_52_0: null,
      __lookup__P_52_1: null,
      __removed__P_52_2: false,

      /**
       * Adds an entry
       *
       * @param name {String} the entry to add
       */
      push(name) {
        if (this.__lookup__P_52_1[name] === undefined) {
          this.__array__P_52_0.push(name);

          this.__lookup__P_52_1[name] = this.__array__P_52_0.length - 1;
          this.__dirtySort__P_52_3 = true;
        }
      },

      /**
       * Sort the array
       *
       * @param compareFn {Function} sort comparator, if null alphabetic is used
       */
      sort(compareFn) {
        this.__array__P_52_0.sort(compareFn); // Remove any undefined from the end of the array


        for (let arr = this.__array__P_52_0, len = arr.length, i = len - 1; i > -1; i--) {
          if (arr[i] !== undefined) {
            if (i < len - 1) {
              arr.splice(i + 1);
            }

            break;
          }
        } // Remove undefined from the start of the array


        for (let arr = this.__array__P_52_0, len = arr.length, i = 0; i < len; i++) {
          if (arr[i] !== undefined) {
            if (i > 0) {
              arr.splice(0, i);
            }

            break;
          }
        } // Rebuild the lookup


        this.__array__P_52_0.forEach((elem, index) => {
          this.__lookup__P_52_1[elem] = index;
        });

        this.__dirtySort__P_52_3 = false;
      },

      /**
       * Tests whether the entry exsts
       *
       * @param name {String} the entry to check for
       * @return {Boolean} true if found
       */
      contains(name) {
        return this.__lookup__P_52_1[name] !== undefined;
      },

      /**
       * Removes an entry
       *
       * @param name {String} the entry to remove
       */
      remove(name) {
        var index = this.__lookup__P_52_1[name];

        if (index !== undefined) {
          delete this.__array__P_52_0[index];
          delete this.__lookup__P_52_1[name];
          this.__removed__P_52_2 = true;
        }
      },

      /**
       * Removes the last entry from the array and returns it
       *
       * @returns {String}
       */
      pop() {
        if (this.__array__P_52_0.length == 0) {
          return undefined;
        }

        if (this.__dirtySort__P_52_3 && this.isKeepSorted()) {
          this.sort();
        }

        do {
          var elem = this.__array__P_52_0.pop();

          if (elem !== undefined) {
            delete this.__lookup__P_52_1[elem];
            return elem;
          }
        } while (this.__array__P_52_0.length > 0);

        return undefined;
      },

      /**
       * Removes the first entry from the array and returns it
       *
       * @returns {String}
       */
      shift() {
        if (this.__array__P_52_0.length == 0) {
          return undefined;
        }

        if (this.__dirtySort__P_52_3 && this.isKeepSorted()) {
          this.sort();
        }

        do {
          var elem = this.__array__P_52_0.shift();

          if (elem !== undefined) {
            delete this.__lookup__P_52_1[elem];
            return elem;
          }
        } while (this.__array__P_52_0.length > 0);

        return undefined;
      },

      /**
       * Returns the length of the array
       *
       * @returns {Integer}
       */
      getLength() {
        return this.__array__P_52_0.length;
      },

      /**
       * Returns the indexed item of the array
       *
       * @returns {String}
       */
      getItem(index) {
        if (this.__dirtySort__P_52_3 && this.isKeepSorted()) {
          this.sort();
        }

        return this.__array__P_52_0[index];
      },

      /**
       * Detects whether the array is empty
       *
       * @returns {Boolean}
       */
      isEmpty() {
        return this.__array__P_52_0.length > 0;
      },

      /**
       * Returns a native array (a copy)
       *
       * @returns {String[]}
       */
      toArray() {
        if (this.__dirtySort__P_52_3 && this.isKeepSorted()) {
          this.sort();
        }

        if (this.__removed__P_52_2) {
          var result = [];

          this.__array__P_52_0.forEach(function (value) {
            if (value) {
              result.push(value);
            }
          });

          return result;
        }

        return this.__array__P_52_0.slice();
      },

      /**
       * Returns a native object (a copy)
       *
       * @returns {Object}
       */
      toObject() {
        if (this.__dirtySort__P_52_3 && this.isKeepSorted()) {
          this.sort();
        }

        var result = {};

        this.__array__P_52_0.forEach(function (value) {
          result[value] = true;
        });

        return result;
      }

    }
  });
  qx.tool.utils.IndexedArray.$$dbClassInfo = $$dbClassInfo;
})();

//# sourceMappingURL=IndexedArray.js.map