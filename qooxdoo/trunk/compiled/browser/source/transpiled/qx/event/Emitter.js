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
       2004-2012 1&1 Internet AG, Germany, http://www.1und1.de
  
     License:
       MIT: https://opensource.org/licenses/MIT
       See the LICENSE file in the project's top-level directory for details.
  
     Authors:
       * Martin Wittemann (wittemann)
  
  ************************************************************************ */

  /**
   * Basic implementation for an event emitter. This supplies a basic and
   * minimalistic event mechanism.
   */
  qx.Bootstrap.define("qx.event.Emitter", {
    extend: Object,
    statics: {
      /** Static storage for all event listener */
      __storage__P_37_0: []
    },
    members: {
      __listener__P_37_1: null,
      __any__P_37_2: null,

      /**
       * Attach a listener to the event emitter. The given <code>name</code>
       * will define the type of event. Handing in a <code>'*'</code> will
       * listen to all events emitted by the event emitter.
       *
       * @param name {String} The name of the event to listen to.
       * @param listener {Function} The function execute on {@link #emit}.
       * @param ctx {var?Window} The context of the listener.
       * @return {Integer} An unique <code>id</code> for the attached listener.
       */
      on(name, listener, ctx) {
        var id = qx.event.Emitter.__storage__P_37_0.length;

        this.__getStorage__P_37_3(name).push({
          listener: listener,
          ctx: ctx,
          id: id,
          name: name
        });

        qx.event.Emitter.__storage__P_37_0.push({
          name: name,
          listener: listener,
          ctx: ctx
        });

        return id;
      },

      /**
       * Attach a listener to the event emitter which will be executed only once.
       * The given <code>name</code> will define the type of event. Handing in a
       * <code>'*'</code> will listen to all events emitted by the event emitter.
       *
       * @param name {String} The name of the event to listen to.
       * @param listener {Function} The function execute on {@link #emit}.
       * @param ctx {var?Window} The context of the listener.
       * @return {Integer} An unique <code>id</code> for the attached listener.
       */
      once(name, listener, ctx) {
        var id = qx.event.Emitter.__storage__P_37_0.length;

        this.__getStorage__P_37_3(name).push({
          listener: listener,
          ctx: ctx,
          once: true,
          id: id
        });

        qx.event.Emitter.__storage__P_37_0.push({
          name: name,
          listener: listener,
          ctx: ctx
        });

        return id;
      },

      /**
       * Remove a listener from the event emitter. The given <code>name</code>
       * will define the type of event.
       *
       * @param name {String} The name of the event to listen to.
       * @param listener {Function} The function execute on {@link #emit}.
       * @param ctx {var?Window} The context of the listener.
       * @return {Integer|null} The listener's id if it was removed or
       * <code>null</code> if it wasn't found
       */
      off(name, listener, ctx) {
        var storage = this.__getStorage__P_37_3(name);

        for (var i = storage.length - 1; i >= 0; i--) {
          var entry = storage[i];

          if (entry.listener == listener && entry.ctx == ctx) {
            storage.splice(i, 1);
            qx.event.Emitter.__storage__P_37_0[entry.id] = null;
            return entry.id;
          }
        }

        return null;
      },

      /**
       * Removes the listener identified by the given <code>id</code>. The id
       * will be return on attaching the listener and can be stored for removing.
       *
       * @param id {Integer} The id of the listener.
       * @return {Integer|null} The listener's id if it was removed or
       * <code>null</code> if it wasn't found
       */
      offById(id) {
        var entry = qx.event.Emitter.__storage__P_37_0[id];

        if (entry) {
          this.off(entry.name, entry.listener, entry.ctx);
        }

        return null;
      },

      /**
       * Alternative for {@link #on}.
       * @param name {String} The name of the event to listen to.
       * @param listener {Function} The function execute on {@link #emit}.
       * @param ctx {var?Window} The context of the listener.
       * @return {Integer} An unique <code>id</code> for the attached listener.
       */
      addListener(name, listener, ctx) {
        return this.on(name, listener, ctx);
      },

      /**
       * Alternative for {@link #once}.
       * @param name {String} The name of the event to listen to.
       * @param listener {Function} The function execute on {@link #emit}.
       * @param ctx {var?Window} The context of the listener.
       * @return {Integer} An unique <code>id</code> for the attached listener.
       */
      addListenerOnce(name, listener, ctx) {
        return this.once(name, listener, ctx);
      },

      /**
       * Alternative for {@link #off}.
       * @param name {String} The name of the event to listen to.
       * @param listener {Function} The function execute on {@link #emit}.
       * @param ctx {var?Window} The context of the listener.
       */
      removeListener(name, listener, ctx) {
        this.off(name, listener, ctx);
      },

      /**
       * Alternative for {@link #offById}.
       * @param id {Integer} The id of the listener.
       */
      removeListenerById(id) {
        this.offById(id);
      },

      /**
       * Emits an event with the given name. The data will be passed
       * to the listener.
       * @param name {String} The name of the event to emit.
       * @param data {var?undefined} The data which should be passed to the listener.
       */
      emit(name, data) {
        var storage = this.__getStorage__P_37_3(name).concat();

        var toDelete = [];

        for (var i = 0; i < storage.length; i++) {
          var entry = storage[i];
          entry.listener.call(entry.ctx, data);

          if (entry.once) {
            toDelete.push(entry);
          }
        } // listener callbacks could manipulate the storage
        // (e.g. module.Event.once)


        toDelete.forEach(function (entry) {
          var origStorage = this.__getStorage__P_37_3(name);

          var idx = origStorage.indexOf(entry);
          origStorage.splice(idx, 1);
        }.bind(this)); // call on any

        storage = this.__getStorage__P_37_3("*");

        for (var i = storage.length - 1; i >= 0; i--) {
          var entry = storage[i];
          entry.listener.call(entry.ctx, data);
        }
      },

      /**
       * Returns the internal attached listener.
       * @internal
       * @return {Map} A map which has the event name as key. The values are
       *   arrays containing a map with 'listener' and 'ctx'.
       */
      getListeners() {
        return this.__listener__P_37_1;
      },

      /**
       * Returns the data entry for a given event id. If the entry could
       * not be found, undefined will be returned.
       * @internal
       * @param id {Number} The listeners id
       * @return {Map|undefined} The data entry if found
       */
      getEntryById(id) {
        for (var name in this.__listener__P_37_1) {
          var store = this.__listener__P_37_1[name];

          for (var i = 0, j = store.length; i < j; i++) {
            if (store[i].id === id) {
              return store[i];
            }
          }
        }
      },

      /**
       * Internal helper which will return the storage for the given name.
       * @param name {String} The name of the event.
       * @return {Array} An array which is the storage for the listener and
       *   the given event name.
       */
      __getStorage__P_37_3(name) {
        if (this.__listener__P_37_1 == null) {
          this.__listener__P_37_1 = {};
        }

        if (this.__listener__P_37_1[name] == null) {
          this.__listener__P_37_1[name] = [];
        }

        return this.__listener__P_37_1[name];
      }

    }
  });
  qx.event.Emitter.$$dbClassInfo = $$dbClassInfo;
})();

//# sourceMappingURL=Emitter.js.map?dt=1658886716063