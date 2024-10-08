(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.Class": {
        "usage": "dynamic",
        "require": true
      },
      "qx.core.Object": {
        "require": true
      },
      "qx.event.IEventHandler": {
        "require": true
      },
      "qx.event.Registration": {
        "defer": "runtime",
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
       * Sebastian Werner (wpbasti)
  
  ************************************************************************ */

  /**
   * This class provides qooxdoo object event support.
   */
  qx.Class.define("qx.event.handler.Object", {
    extend: qx.core.Object,
    implement: qx.event.IEventHandler,

    /*
    *****************************************************************************
       STATICS
    *****************************************************************************
    */
    statics: {
      /** @type {Integer} Priority of this handler */
      PRIORITY: qx.event.Registration.PRIORITY_LAST,

      /** @type {Map} Supported event types */
      SUPPORTED_TYPES: null,

      /** @type {Integer} Which target check to use */
      TARGET_CHECK: qx.event.IEventHandler.TARGET_OBJECT,

      /** @type {Integer} Whether the method "canHandleEvent" must be called */
      IGNORE_CAN_HANDLE: false
    },

    /*
    *****************************************************************************
       MEMBERS
    *****************************************************************************
    */
    members: {
      /*
      ---------------------------------------------------------------------------
        EVENT HANDLER INTERFACE
      ---------------------------------------------------------------------------
      */
      // interface implementation
      canHandleEvent(target, type) {
        return qx.Class.supportsEvent(target.constructor, type);
      },

      // interface implementation
      registerEvent(target, type, capture) {// Nothing needs to be done here
      },

      // interface implementation
      unregisterEvent(target, type, capture) {// Nothing needs to be done here
      }

    },

    /*
    *****************************************************************************
       DEFER
    *****************************************************************************
    */
    defer(statics) {
      qx.event.Registration.addHandler(statics);
    }

  });
  qx.event.handler.Object.$$dbClassInfo = $$dbClassInfo;
})();

//# sourceMappingURL=Object.js.map?dt=1658886734482