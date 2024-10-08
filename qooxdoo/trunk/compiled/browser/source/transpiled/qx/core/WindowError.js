(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.Bootstrap": {
        "usage": "dynamic",
        "require": true
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
   * This exception is thrown by the {@link qx.event.GlobalError} handler if a
   * <code>window.onerror</code> event occurs in the browser.
   */
  qx.Bootstrap.define("qx.core.WindowError", {
    extend: Error,

    /*
    *****************************************************************************
       CONSTRUCTOR
    *****************************************************************************
    */

    /**
     * @param failMessage {String} The error message
     * @param uri {String} URI where error was raised
     * @param lineNumber {Integer} The line number where the error was raised
     * @param columnNumber {Integer} The column number where the error was raised
     * @param sourceException {Error} orginal error
     */
    construct(failMessage, uri, lineNumber, columnNumber, sourceException) {
      var inst = sourceException || Error.call(this, failMessage); // map stack trace properties since they're not added by Error's constructor

      if (inst.stack) {
        this.stack = inst.stack;
      }

      if (inst.stacktrace) {
        this.stacktrace = inst.stacktrace;
      }

      this.__failMessage__P_89_0 = failMessage;
      this.__uri__P_89_1 = uri || "";
      this.__lineNumber__P_89_2 = lineNumber === undefined ? -1 : lineNumber;
      this.__columnNumber__P_89_3 = columnNumber === undefined ? -1 : columnNumber;
      this.__sourceException__P_89_4 = sourceException;
    },

    /*
    *****************************************************************************
       MEMBERS
    *****************************************************************************
    */
    members: {
      __failMessage__P_89_0: null,
      __uri__P_89_1: null,
      __lineNumber__P_89_2: null,
      __columnNumber__P_89_3: null,
      __sourceException__P_89_4: null,

      /**
       * Returns the error message.
       *
       * @return {String} error message
       */
      toString() {
        return this.__failMessage__P_89_0;
      },

      /**
       * Get the URI where error was raised
       *
       * @return {String} URI where error was raised
       */
      getUri() {
        return this.__uri__P_89_1;
      },

      /**
       * Get the line number where the error was raised
       *
       * @return {Integer} The line number where the error was raised
       */
      getLineNumber() {
        return this.__lineNumber__P_89_2;
      },

      /**
       * Get the column number where the error was raised
       *
       * @return {Integer} The line number where the error was raised
       */
      getColumnNumber() {
        return this.__columnNumber__P_89_3;
      },

      /**
       * Get the source exception
       *
       * @return {Error} The source error
       */
      getSourceException() {
        return this.__sourceException__P_89_4;
      }

    }
  });
  qx.core.WindowError.$$dbClassInfo = $$dbClassInfo;
})();

//# sourceMappingURL=WindowError.js.map?dt=1658886731565