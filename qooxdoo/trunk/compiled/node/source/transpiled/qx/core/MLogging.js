(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.Mixin": {
        "usage": "dynamic",
        "require": true
      },
      "qx.log.Logger": {
        "require": true
      },
      "qx.lang.Array": {}
    }
  };
  qx.Bootstrap.executePendingDefers($$dbClassInfo);

  /* ************************************************************************
  
     qooxdoo - the new era of web development
  
     http://qooxdoo.org
  
     Copyright:
       2004-2011 1&1 Internet AG, Germany, http://www.1und1.de
  
     License:
       MIT: https://opensource.org/licenses/MIT
       See the LICENSE file in the project's top-level directory for details.
  
     Authors:
       * Martin Wittemann (martinwittemann)
  
  ************************************************************************ */

  /**
   * This mixin offers the basic logging features offered by {@link qx.log.Logger}.
   */
  qx.Mixin.define("qx.core.MLogging", {
    members: {
      /** @type {Class} Pointer to the regular logger class */
      __Logger__P_67_0: qx.log.Logger,

      /**
       * Logs a debug message.
       *
       * @param varargs {var} The item(s) to log. Any number of arguments is
       * supported. If an argument is not a string, the object dump will be
       * logged.
       */
      debug(varargs) {
        this.__logMessage__P_67_1("debug", arguments);
      },

      /**
       * Logs an info message.
       *
       * @param varargs {var} The item(s) to log. Any number of arguments is
       * supported. If an argument is not a string, the object dump will be
       * logged.
       */
      info(varargs) {
        this.__logMessage__P_67_1("info", arguments);
      },

      /**
       * Logs a warning message.
       *
       * @param varargs {var} The item(s) to log. Any number of arguments is
       * supported. If an argument is not a string, the object dump will be
       * logged.
       */
      warn(varargs) {
        this.__logMessage__P_67_1("warn", arguments);
      },

      /**
       * Logs an error message.
       *
       * @param varargs {var} The item(s) to log. Any number of arguments is
       * supported. If an argument is not a string, the object dump will be
       * logged.
       */
      error(varargs) {
        this.__logMessage__P_67_1("error", arguments);
      },

      /**
       * Logs an error message with the current stack trace
       *
       * @param varargs {var} The item(s) to log. Any number of arguments is
       * supported. If an argument is not a string, the object dump will be
       * logged.
       */
      trace(varargs) {
        this.__logMessage__P_67_1("trace", arguments);
      },

      /**
       * Helper that calls the appropriate logger function with the current object
       * and any number of items.
       *
       * @param level {String} The log level of the message
       * @param varargs {arguments} Arguments list to be logged
       */
      __logMessage__P_67_1(level, varargs) {
        var argumentsArray = qx.lang.Array.fromArguments(varargs);
        argumentsArray.unshift(this);

        this.__Logger__P_67_0[level].apply(this.__Logger__P_67_0, argumentsArray);
      }

    }
  });
  qx.core.MLogging.$$dbClassInfo = $$dbClassInfo;
})();

//# sourceMappingURL=MLogging.js.map