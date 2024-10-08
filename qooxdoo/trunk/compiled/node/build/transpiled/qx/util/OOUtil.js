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
       2004-2011 1&1 Internet AG, Germany, http://www.1und1.de
  
     License:
       MIT: https://opensource.org/licenses/MIT
       See the LICENSE file in the project's top-level directory for details.
  
     Authors:
       * Martin Wittemann (wittemann)
  
  ************************************************************************ */

  /**
   * This class is a base class for the OO system defined by Class, Mixin
   * and Interface. It contains helper which are basically needed to create the
   * Classes which define the OO system.
   */
  qx.Bootstrap.define("qx.util.OOUtil", {
    statics: {
      /**
       * Whether the given class exists
       *
       * @param name {String} class name to check
       * @return {Boolean} true if class exists
       */
      classIsDefined(name) {
        return qx.Bootstrap.getByName(name) !== undefined;
      },

      /**
       * Returns the definition of the given property, if not redefined.
       * Returns null if the property does not exist.
       *
       * @param clazz {Class} class to check
       * @param name {String} name of the class to check for
       * @return {Map|null} whether the object support the given event.
       */
      getPropertyDefinition(clazz, name) {
        while (clazz) {
          if (clazz.$$properties && clazz.$$properties[name]) {
            return clazz.$$properties[name];
          }

          clazz = clazz.superclass;
        }

        return null;
      },

      /**
       * Whether a class has the given property
       *
       * @param clazz {Class} class to check
       * @param name {String} name of the property to check for
       * @return {Boolean} whether the class includes the given property.
       */
      hasProperty(clazz, name) {
        return !!qx.util.OOUtil.getPropertyDefinition(clazz, name);
      },

      /**
       * Returns the event type of the given event. Returns null if
       * the event does not exist.
       *
       * @param clazz {Class} class to check
       * @param name {String} name of the event
       * @return {String|null} Event type of the given event.
       */
      getEventType(clazz, name) {
        var clazz = clazz.constructor;

        while (clazz.superclass) {
          if (clazz.$$events && clazz.$$events[name] !== undefined) {
            return clazz.$$events[name];
          }

          clazz = clazz.superclass;
        }

        return null;
      },

      /**
       * Whether a class supports the given event type
       *
       * @param clazz {Class} class to check
       * @param name {String} name of the event to check for
       * @return {Boolean} whether the class supports the given event.
       */
      supportsEvent(clazz, name) {
        return !!qx.util.OOUtil.getEventType(clazz, name);
      },

      /**
       * Returns the class or one of its super classes which contains the
       * declaration of the given interface. Returns null if the interface is not
       * specified anywhere.
       *
       * @param clazz {Class} class to look for the interface
       * @param iface {Interface} interface to look for
       * @return {Class | null} the class which directly implements the given interface
       */
      getByInterface(clazz, iface) {
        var list, i, l;

        while (clazz) {
          if (clazz.$$implements) {
            list = clazz.$$flatImplements;

            for (i = 0, l = list.length; i < l; i++) {
              if (list[i] === iface) {
                return clazz;
              }
            }
          }

          clazz = clazz.superclass;
        }

        return null;
      },

      /**
       * Whether a given class or any of its super classes includes a given interface.
       *
       * This function will return "true" if the interface was defined
       * in the class declaration ({@link qx.Class#define}) of the class
       * or any of its super classes using the "implement"
       * key.
       *
       * @param clazz {Class} class to check
       * @param iface {Interface} the interface to check for
       * @return {Boolean} whether the class includes the interface.
       */
      hasInterface(clazz, iface) {
        return !!qx.util.OOUtil.getByInterface(clazz, iface);
      },

      /**
       * Returns a list of all mixins available in a given class.
       *
       * @param clazz {Class} class which should be inspected
       * @return {Mixin[]} array of mixins this class uses
       */
      getMixins(clazz) {
        var list = [];

        while (clazz) {
          if (clazz.$$includes) {
            list.push.apply(list, clazz.$$flatIncludes);
          }

          clazz = clazz.superclass;
        }

        return list;
      }

    }
  });
  qx.util.OOUtil.$$dbClassInfo = $$dbClassInfo;
})();

//# sourceMappingURL=OOUtil.js.map