(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.Bootstrap": {
        "usage": "dynamic",
        "require": true
      },
      "qx.type.BaseError": {
        "construct": true,
        "require": true
      },
      "qx.dev.StackTrace": {
        "construct": true
      }
    }
  };
  qx.Bootstrap.executePendingDefers($$dbClassInfo);

  /* ************************************************************************
  
     qooxdoo - the new era of web development
  
     http://qooxdoo.org
  
     Copyright:
       2007-2008 1&1 Internet AG, Germany, http://www.1und1.de
  
     License:
       MIT: https://opensource.org/licenses/MIT
       See the LICENSE file in the project's top-level directory for details.
  
     Authors:
       * Fabian Jakobs (fjakobs)
  
  ************************************************************************ */

  /**
   * Assertion errors are thrown if an assertion in {@link qx.core.Assert}
   * fails.
   */
  qx.Bootstrap.define("qx.core.AssertionError", {
    extend: qx.type.BaseError,

    /*
    *****************************************************************************
       CONSTRUCTOR
    *****************************************************************************
    */

    /**
     * @param comment {String} Comment passed to the assertion call
     * @param failMessage {String} Fail message provided by the assertion
     */
    construct: function construct(comment, failMessage) {
      qx.type.BaseError.call(this, comment, failMessage);
      this.__P_101_0 = qx.dev.StackTrace.getStackTrace();
    },

    /*
    *****************************************************************************
       MEMBERS
    *****************************************************************************
    */
    members: {
      __P_101_0: null,

      /**
       * Stack trace of the error
       *
       * @return {String[]} The stack trace of the location the exception was thrown
       */
      getStackTrace: function getStackTrace() {
        return this.__P_101_0;
      }
    }
  });
  qx.core.AssertionError.$$dbClassInfo = $$dbClassInfo;
})();

//# sourceMappingURL=AssertionError.js.map?dt=1658886806125