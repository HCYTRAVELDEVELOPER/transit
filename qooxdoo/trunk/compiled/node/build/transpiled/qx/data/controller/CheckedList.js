(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.Class": {
        "usage": "dynamic",
        "require": true
      },
      "qx.data.controller.List": {
        "construct": true,
        "require": true
      },
      "qx.data.Array": {
        "construct": true
      },
      "qx.ui.form.CheckBox": {},
      "qx.ui.core.queue.Widget": {}
    }
  };
  qx.Bootstrap.executePendingDefers($$dbClassInfo);

  /* ************************************************************************
  
     qooxdoo - the new era of web development
  
     http://qooxdoo.org
  
     Copyright:
       2021-2021 Zenesis Limited https://www.zenesis.com
  
     License:
       MIT: https://opensource.org/licenses/MIT
       See the LICENSE file in the project's top-level directory for details.
  
     Authors:
       * John Spackman (github.com/johnspackman)
  
  ************************************************************************ */

  /**
   * Extension of `qx.data.controller.List` which adds support for `qx.ui.form.CheckedList`
   * and `qx.ui.form.CheckedSelectBox`.
   *
   * The principal is that the underlying `List` controller implementation has a model which
   * is the complete array of items that can be selected, and that array is used to populate
   * the UI widget (ie as normal).
   *
   * The `checked` psuedo property in this `CheckedList` controller relates to the checked
   * property of the UI widget.
   */
  qx.Class.define("qx.data.controller.CheckedList", {
    extend: qx.data.controller.List,

    /**
     * Constructor
     *
     * @param model {qx.data.Array?null} the model array
     * @param widget {qx.ui.core.Widget?null} the widget target
     * @param path {String} the path in the model for the caption
     */
    construct(model, widget, path) {
      qx.data.controller.List.constructor.call(this, null, widget, path);
      this.setChecked(new qx.data.Array());

      if (model) {
        this.setModel(model);
      }
    },

    properties: {
      checked: {
        init: null,
        nullable: true,
        check: "qx.data.Array",
        event: "changeChecked",
        apply: "_applyChecked"
      },

      /**
       * The path to the property which holds the information that should be
       * shown as a label for a tag for a checked item. This is only needed if
       * used with a CheckedSelectBox, and only if live updates of the label
       * are required.
       */
      checkedLabelPath: {
        check: "String",
        apply: "__P_75_0",
        nullable: true
      },

      /**
       * The path to the property which holds the information that should be
       * shown as an icon for a tag for a checked item. This is only needed if
       * used with a CheckedSelectBox, and only if live updates of the label
       * are required.
       */
      checkedIconPath: {
        check: "String",
        apply: "__P_75_0",
        nullable: true
      },

      /**
       * A map containing the options for the checkedLabel binding. The possible keys
       * can be found in the {@link qx.data.SingleValueBinding} documentation.
       */
      checkedLabelOptions: {
        apply: "__P_75_0",
        nullable: true
      },

      /**
       * A map containing the options for the checked icon binding. The possible keys
       * can be found in the {@link qx.data.SingleValueBinding} documentation.
       */
      checkedIconOptions: {
        apply: "__P_75_0",
        nullable: true
      }
    },
    members: {
      _applyChecked(value, oldValue) {
        if (oldValue) {
          oldValue.removeListener("change", this.__P_75_1, this);
        }

        if (value) {
          value.addListener("change", this.__P_75_1, this);
        }

        this._updateChecked();
      },

      /**
       * @Override
       */
      _createItem() {
        var delegate = this.getDelegate();
        var item; // check if a delegate and a create method is set

        if (delegate != null && delegate.createItem != null) {
          item = delegate.createItem();
        } else {
          item = new qx.ui.form.CheckBox();
        } // if there is a configure method, invoke it


        if (delegate != null && delegate.configureItem != null) {
          delegate.configureItem(item);
        }

        return item;
      },

      /**
       * Event handler for changes to the checked array
       *
       * @param evt {qx.event.type.Data} the event
       */
      __P_75_1(evt) {
        let data = evt.getData();

        if (data.type == "order") {
          return;
        }

        this._updateChecked();
      },

      /**
       * @Override
       */
      update() {
        qx.data.controller.CheckedList.superclass.prototype.update.call(this);

        this._updateChecked();
      },

      /**
       * @Override
       */
      _setFilter(value, old) {
        qx.data.controller.CheckedList.superclass.prototype._setFilter.call(this, value, old);

        this.__P_75_2 = true;
        qx.ui.core.queue.Widget.add(this);
      },

      /**
       * @Override
       */
      syncWidget() {
        qx.data.controller.CheckedList.superclass.prototype.syncWidget.call(this);

        if (this.__P_75_2) {
          this._updateChecked();
        }

        this.__P_75_2 = null;
      },

      /**
       * @Override
       */
      _applyModel(value, oldValue) {
        if (!value || !value.getLength()) {
          let checked = this.getChecked();

          if (checked) {
            checked.removeAll();
          }
        }

        qx.data.controller.CheckedList.superclass.prototype._applyModel.call(this, value, oldValue);

        this._updateChecked();
      },

      /**
       * @Override
       */
      _applyTarget(value, oldValue) {
        qx.data.controller.CheckedList.superclass.prototype._applyTarget.call(this, value, oldValue);

        if (oldValue) {
          oldValue.removeListener("changeChecked", this.__P_75_3, this);

          if (qx.Class.supportsEvent(oldValue.constructor, "attachResultsTag")) {
            oldValue.removeListener("attachResultsTag", this.__P_75_4, this);
            oldValue.removeListener("detachResultsTag", this.__P_75_5, this);
          }
        }

        if (value) {
          value.addListener("changeChecked", this.__P_75_3, this);

          if (qx.Class.supportsEvent(value.constructor, "attachResultsTag")) {
            value.addListener("attachResultsTag", this.__P_75_4, this);
            value.addListener("detachResultsTag", this.__P_75_5, this);
          }
        }
      },

      /**
       * Event handler for changes in the target widget's `checked` property
       */
      __P_75_3(evt) {
        if (this.__P_75_6) {
          return;
        }

        let target = this.getTarget();
        let replacement = [];
        target.getChecked().forEach(item => {
          let itemModel = item.getModel();

          if (itemModel) {
            replacement.push(itemModel);
          }
        });
        let checked = this.getChecked();

        if (checked) {
          checked.replace(replacement);
        }
      },

      /**
       * Event handler for changes in the target widget's `attachResults` property
       */
      __P_75_4(evt) {
        let {
          tagWidget,
          item
        } = evt.getData();
        item.setUserData(this.classname + ".tagWidget", tagWidget);

        this.__P_75_7(tagWidget, item);
      },

      /**
       * Event handler for changes in the target widget's `detachResults` property
       */
      __P_75_5(evt) {
        let {
          tagWidget,
          item
        } = evt.getData();

        this.__P_75_8(tagWidget, item);

        item.setUserData(this.classname + ".tagWidget", null);
      },

      /**
       * Updates all tags in the target widget
       */
      __P_75_0() {
        let target = this.getTarget();

        if (!target) {
          return;
        }

        target.getChecked().forEach(item => {
          let tagWidget = item.getUserData(this.classname + ".tagWidget");

          this.__P_75_8(tagWidget, item);

          this.__P_75_7(tagWidget, item);
        });
      },

      /**
       * Attaches a single tag; used to bind to the tag so that live updates to the underlying model are reflected in tag names
       *
       * @param tagWidget {qx.ui.core.Widget} the widget which is the tag
       * @param item {qx.ui.core.Widget} the list item that lists the model item that this tag is for
       */
      __P_75_7(tagWidget, item) {
        let itemModel = item.getModel();
        let bindData = {};

        if (this.getCheckedLabelPath()) {
          bindData.checkedLabelId = itemModel.bind(this.getCheckedLabelPath(), tagWidget, "label", this.getCheckedLabelOptions());
        }

        if (this.getCheckedIconPath()) {
          bindData.checkedIconId = itemModel.bind(this.getCheckedIconPath(), tagWidget, "label", this.getCheckedIconOptions());
        }

        itemModel.setUserData(this.classname + ".bindData", bindData);
      },

      /**
       * Detaches a single tag, inverse of `__attachTag`
       *
       * @param tagWidget {qx.ui.core.Widget} the widget which is the tag
       * @param item {qx.ui.core.Widget} the list item that lists the model item that this tag is for
       */
      __P_75_8(tagWidget, item) {
        let itemModel = item.getModel();
        let bindData = itemModel.getUserData(this.classname + ".bindData");

        if (bindData) {
          if (bindData.checkedLabelId) {
            itemModel.removeBinding(bindData.checkedLabelId);
          }

          if (bindData.checkedIconId) {
            itemModel.removeBinding(bindData.checkedIconId);
          }

          itemModel.setUserData(this.classname + ".bindData", null);
        }
      },

      /**
       * Updates the checked widget items to match the array of checked model items
       */
      _updateChecked() {
        let target = this.getTarget();

        if (!target) {
          return;
        }

        if (this.__P_75_6) {
          return;
        }

        this.__P_75_6 = true;

        try {
          // Maps of the widget item, indexed by the hashcode of the model item
          let children = {};
          let toUncheck = {};
          target.getChildren().forEach(item => {
            let itemModel = item.getModel();

            if (itemModel) {
              let hash = itemModel.toHashCode();
              children[hash] = item;

              if (item.getValue()) {
                toUncheck[hash] = item;
              }
            }
          });
          let toRemove = [];
          let checked = this.getChecked();

          if (checked) {
            checked.forEach(itemModel => {
              let hash = itemModel.toHashCode();

              if (itemModel) {
                delete toUncheck[hash];

                if (children[hash]) {
                  children[hash].setValue(true);
                } else {
                  toRemove.push(itemModel);
                }
              }
            });
            Object.values(toUncheck).forEach(item => item.setValue(false));
            toRemove.forEach(item => checked.remove(item));
          }
        } finally {
          this.__P_75_6 = false;
        }
      }

    }
  });
  qx.data.controller.CheckedList.$$dbClassInfo = $$dbClassInfo;
})();

//# sourceMappingURL=CheckedList.js.map