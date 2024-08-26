(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.Class": {
        "usage": "dynamic",
        "require": true
      },
      "qx.tool.compiler.resources.ResourceLoader": {
        "construct": true,
        "require": true
      },
      "qx.tool.utils.Json": {}
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
  qx.Class.define("qx.tool.compiler.resources.MetaLoader", {
    extend: qx.tool.compiler.resources.ResourceLoader,

    construct() {
      qx.tool.compiler.resources.ResourceLoader.constructor.call(this, ".meta");
    },

    members: {
      async load(asset) {
        asset.getFileInfo().meta = await qx.tool.utils.Json.loadJsonAsync(asset.getSourceFilename());
      }

    }
  });
  qx.tool.compiler.resources.MetaLoader.$$dbClassInfo = $$dbClassInfo;
})();

//# sourceMappingURL=MetaLoader.js.map