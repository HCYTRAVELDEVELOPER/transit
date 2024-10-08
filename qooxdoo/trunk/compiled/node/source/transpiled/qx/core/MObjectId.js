(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.Mixin": {
        "usage": "dynamic",
        "require": true
      },
      "qx.core.Object": {}
    }
  };
  qx.Bootstrap.executePendingDefers($$dbClassInfo);

  /* ************************************************************************
  
     qooxdoo - the new era of web development
  
     http://qooxdoo.org
  
     Copyright:
       2017 Zenesis Limited, http://www.zenesis.com
  
     License:
       MIT: https://opensource.org/licenses/MIT
       See the LICENSE file in the project's top-level directory for details.
  
     Authors:
       * John Spackman (john.spackman@zenesis.com, @johnspackman)
  
  ************************************************************************ */

  /**
   * A mixin providing objects by ID and owners.
   *
   * The typical use of IDs is to override the `_createQxObjectImpl` method and create
   * new instances on demand; all code should access these instances by calling
   * `getQxObject`.
   */
  qx.Mixin.define("qx.core.MObjectId", {
    /*
     * ****************************************************************************
     * PROPERTIES
     * ****************************************************************************
     */
    properties: {
      /** The owning object */
      qxOwner: {
        init: null,
        check: "qx.core.Object",
        nullable: true,
        apply: "_applyQxOwner"
      },

      /** {String} The ID of the object.  */
      qxObjectId: {
        init: null,

        check(value) {
          return value === null || typeof value == "string" && value.indexOf("/") < 0;
        },

        nullable: true,
        apply: "_applyQxObjectId"
      }
    },

    /*
     * ****************************************************************************
     * MEMBERS
     * ****************************************************************************
     */
    members: {
      __ownedQxObjects__P_68_0: null,
      __changingQxOwner__P_68_1: false,

      /**
       * Apply owner
       */
      _applyQxOwner(value, oldValue) {
        if (!this.__changingQxOwner__P_68_1) {
          throw new Error("Please use API methods to change owner, not the property");
        }
      },

      /**
       * Apply objectId
       */
      _applyQxObjectId(value, oldValue) {
        if (!this.__changingQxOwner__P_68_1) {
          var owner = this.getQxOwner();

          if (owner) {
            owner.__onOwnedObjectIdChange__P_68_2(this, value, oldValue);
          }

          this._cascadeQxObjectIdChanges();
        }
      },

      /**
       * Called when a child's objectId changes
       */
      __onOwnedObjectIdChange__P_68_2(obj, newId, oldId) {
        delete this.__ownedQxObjects__P_68_0[oldId];
        this.__ownedQxObjects__P_68_0[newId] = obj;
      },

      /**
       * Reflect changes to IDs or owners
       */
      _cascadeQxObjectIdChanges() {
        if (typeof this.getContentElement == "function") {
          var contentElement = this.getContentElement();

          if (contentElement) {
            contentElement.updateObjectId();
          }
        }

        if (this.__ownedQxObjects__P_68_0) {
          for (var name in this.__ownedQxObjects__P_68_0) {
            var obj = this.__ownedQxObjects__P_68_0[name];

            if (obj instanceof qx.core.Object) {
              obj._cascadeQxObjectIdChanges();
            }
          }
        }
      },

      /**
       * Returns the object with the specified ID
       *
       * @param id
       *          {String} ID of the object
       * @return {qx.core.Object?} the found object
       */
      getQxObject(id) {
        if (this.__ownedQxObjects__P_68_0) {
          var obj = this.__ownedQxObjects__P_68_0[id];

          if (obj !== undefined) {
            return obj;
          }
        } // Separate out the child control ID


        var controlId = null;
        var pos = id.indexOf("#");

        if (pos > -1) {
          controlId = id.substring(pos + 1);
          id = id.substring(0, pos);
        }

        var result = undefined; // Handle paths

        if (id.indexOf("/") > -1) {
          var segs = id.split("/");
          var target = this;
          var found = segs.every(function (seg) {
            if (!seg.length) {
              return true;
            }

            if (!target) {
              return false;
            }

            var tmp = target.getQxObject(seg);

            if (tmp !== undefined) {
              target = tmp;
              return true;
            }
          });

          if (found) {
            result = target;
          }
        } else {
          // No object, creating the object
          result = this._createQxObject(id);
        }

        if (result && controlId) {
          var childControl = result.getChildControl(controlId);
          return childControl;
        }

        return result;
      },

      /**
       * Creates the object and adds it to a list; most classes are expected to
       * override `_createQxObjectImpl` NOT this method.
       *
       * @param id {String} ID of the object
       * @return {qx.core.Object?} the created object
       */
      _createQxObject(id) {
        var result = this._createQxObjectImpl(id);

        if (result !== undefined) {
          this.addOwnedQxObject(result, id);
        }

        return result;
      },

      /**
       * Creates the object, intended to be overridden. Null is a valid return
       * value and will be cached by `getQxObject`, however `undefined` is NOT a
       * valid value and so will not be cached meaning that `_createQxObjectImpl`
       * will be called multiple times until a valid value is returned.
       *
       * @param id {String} ID of the object
       * @return {qx.core.Object?} the created object
       */
      _createQxObjectImpl(id) {
        return undefined;
      },

      /**
       * Adds an object as owned by this object
       *
       * @param obj {qx.core.Object} the object to register
       * @param id {String?} the id to set when registering the object
       */
      addOwnedQxObject(obj, id) {
        if (!this.__ownedQxObjects__P_68_0) {
          this.__ownedQxObjects__P_68_0 = {};
        }

        if (!(obj instanceof qx.core.Object)) {
          if (!id) {
            throw new Error("Cannot register an object that has no ID, obj=" + obj);
          }

          if (this.__ownedQxObjects__P_68_0[id]) {
            throw new Error("Cannot register an object with ID '" + id + "' because that ID is already in use, this=" + this + ", obj=" + obj);
          }

          this.__ownedQxObjects__P_68_0[id] = obj;
          return;
        }

        var thatOwner = obj.getQxOwner();

        if (thatOwner === this) {
          return;
        }

        obj.__changingQxOwner__P_68_1 = true;

        try {
          if (thatOwner) {
            thatOwner.__removeOwnedQxObjectImpl__P_68_3(obj);
          }

          if (id === undefined) {
            id = obj.getQxObjectId();
          }

          if (!id) {
            throw new Error("Cannot register an object that has no ID, obj=" + obj);
          }

          if (this.__ownedQxObjects__P_68_0[id]) {
            throw new Error("Cannot register an object with ID '" + id + "' because that ID is already in use, this=" + this + ", obj=" + obj);
          }

          if (obj.getQxOwner() != null) {
            throw new Error("Cannot register an object with ID '" + id + "' because it is already owned by another object this=" + this + ", obj=" + obj);
          }

          obj.setQxOwner(this);
          obj.setQxObjectId(id);

          obj._cascadeQxObjectIdChanges();
        } finally {
          obj.__changingQxOwner__P_68_1 = false;
        }

        this.__ownedQxObjects__P_68_0[id] = obj;
      },

      /**
       * Discards an object from the list of owned objects; note that this does
       * not dispose of the object, simply forgets it if it exists.
       *
       * @param args {String|Object} the ID of the object to discard, or the object itself
       */
      removeOwnedQxObject(args) {
        if (!this.__ownedQxObjects__P_68_0) {
          throw new Error("Cannot discard object because it is not owned by this, this=" + this + ", object=" + obj);
        }

        var id;
        var obj;

        if (typeof args === "string") {
          if (args.indexOf("/") > -1) {
            throw new Error("Cannot discard owned objects based on a path");
          }

          id = args;
          obj = this.__ownedQxObjects__P_68_0[id];

          if (obj === undefined) {
            return;
          }
        } else {
          obj = args;

          if (!(obj instanceof qx.core.Object)) {
            throw new Error("Cannot discard object by reference because it is not a Qooxdoo object, please remove it using the original ID; object=" + obj);
          }

          id = obj.getQxObjectId();

          if (this.__ownedQxObjects__P_68_0[id] !== obj) {
            throw new Error("Cannot discard object because it is not owned by this, this=" + this + ", object=" + obj);
          }
        }

        if (obj !== null) {
          if (!(obj instanceof qx.core.Object)) {
            this.__removeOwnedQxObjectImpl__P_68_3(obj);

            delete this.__ownedQxObjects__P_68_0[id];
          } else {
            obj.__changingQxOwner__P_68_1 = true;

            try {
              this.__removeOwnedQxObjectImpl__P_68_3(obj);

              obj._cascadeQxObjectIdChanges();
            } finally {
              obj.__changingQxOwner__P_68_1 = false;
            }
          }
        }
      },

      /**
       * Removes an owned object
       *
       * @param obj {qx.core.Object} the object
       */
      __removeOwnedQxObjectImpl__P_68_3(obj) {
        if (obj !== null) {
          var id = obj.getQxObjectId();
          obj.setQxOwner(null);
          delete this.__ownedQxObjects__P_68_0[id];
        }
      },

      /**
       * Returns an array of objects that are owned by this object, or an empty
       * array if none exists.
       *
       * @return {Array}
       */
      getOwnedQxObjects() {
        return this.__ownedQxObjects__P_68_0 ? Object.values(this.__ownedQxObjects__P_68_0) : [];
      }

    }
  });
  qx.core.MObjectId.$$dbClassInfo = $$dbClassInfo;
})();

//# sourceMappingURL=MObjectId.js.map