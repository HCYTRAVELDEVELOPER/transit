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
   * A Part collects together all of the javascript files required for a single
   * part (load on demand) and merges them together as required.
   */
  qx.Class.define("qx.tool.compiler.targets.meta.Part", {
    extend: qx.core.Object,

    /**
     * Constructor
     *
     * @param target {Target} the target doing the compilation
     * @param name {String} the name of the part
     * @param partIndex {Integer}
     */
    construct(target, name, partIndex) {
      qx.core.Object.constructor.call(this);
      this.__P_47_0 = target;
      this.__P_47_1 = name;
      this.__P_47_2 = partIndex;
      this.__P_47_3 = [];
      this.__P_47_4 = {};
    },

    members: {
      __P_47_0: null,
      __P_47_1: null,
      __P_47_2: -1,
      __P_47_3: null,
      __P_47_4: null,

      addPackage(pkg) {
        if (!this.__P_47_4[pkg.toHashCode()]) {
          this.__P_47_3.push(pkg);

          this.__P_47_4[pkg.toHashCode()] = pkg;
        }
      },

      hasPackage(pkg) {
        return Boolean(this.__P_47_4[pkg.toHashCode()]);
      },

      getDefaultPackage() {
        return this.__P_47_3[0] || null;
      },

      serializeInto(parts) {
        let arr = parts[this.__P_47_1] = [];

        this.__P_47_3.forEach(pkg => arr.push(String(pkg.getPackageIndex())));
      }

    }
  });
  qx.tool.compiler.targets.meta.Part.$$dbClassInfo = $$dbClassInfo;
})();

//# sourceMappingURL=Part.js.map