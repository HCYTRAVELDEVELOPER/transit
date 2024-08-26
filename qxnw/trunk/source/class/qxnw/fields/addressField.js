/* ************************************************************************
 
 Copyright:
 2013 Netwoods.net, http://www.netwoods.net
 
 License:
 LGPL: http://www.gnu.org/licenses/lgpl.html
 EPL: http://www.eclipse.org/org/documents/epl-v10.php
 See the LICENSE file in the project's top-level directory for details.
 
 Authors:
 * Andrés Flórez (andresf)
 
 ************************************************************************ */

/**
 * QXNW selectBox
 */
qx.Class.define("qxnw.fields.addressField", {
    extend: qx.ui.form.SelectBox,
    /**
     * Event fired on load asyncronous call
     */
    events: {
        loaded: "qx.event.type.Data"
    },
    construct: function construct() {
        this.base(arguments);
    },
    members: {
        __isLoader: false,
        __isLoaded: false,
        // overridden
        _createChildControlImpl: function _createChildControlImpl(id, hash) {
            var control;

            switch (id)
            {
                case "list":
                    control = new qx.ui.form.List().set({
                        focusable: false,
                        keepFocus: true,
                        height: null,
                        width: null,
                        maxHeight: this.getMaxListHeight(),
                        selectionMode: "one",
                        quickSelection: true
                    });
                    control.addListener("click", this.__handleClick, this);
                    control.addListener("changeSelection", this._onListChangeSelection, this);
                    //control.addListener("mousedown", this._onListMouseDown, this);
                    break;

                case "popup":
                    control = new qx.ui.popup.Popup(new qx.ui.layout.VBox);
                    control.setAutoHide(false);
                    control.setKeepActive(true);
                    control.add(this.getChildControl("list"));

                    control.addListener("changeVisibility", this._onPopupChangeVisibility, this);
                    break;
            }

            return control || this.base(arguments, id);
        },
        __handleClick: function __handleClick(e) {
            var target = e.getTarget();
            if (target instanceof qx.ui.form.RepeatButton) {
                return;
            } else {
                this.close();
            }
        },
        isLoaded: function isLoaded(bool) {
            this.__isLoaded = bool;
        },
        markAsLoader: function markAsLoader(bool) {
            this.__isLoader = bool;
        },
        isQxNwObject: function isQxNwObject() {
            return true;
        },
        setValue: function setValue(value) {
            if (this.__isLoader) {
                if (!this.__isLoaded) {
                    this.addListener("loaded", function() {
                        var items = this.getSelectables(true);
                        for (var i = 0; i < items.length; i++) {
                            if (items[i].getModel() == value) {
                                this.setSelection([items[i]]);
                            }
                        }
                    });
                } else {
                    var items = this.getSelectables(true);
                    for (var i = 0; i < items.length; i++) {
                        if (items[i].getModel() == value) {
                            this.setSelection([items[i]]);
                        }
                    }
                }
            } else {
                var items = this.getSelectables(true);
                for (var i = 0; i < items.length; i++) {
                    if (items[i].getModel() == value) {
                        this.setSelection([items[i]]);
                    }
                }
            }
            return true;
        },
        getValue: function getValue() {
            var data = {};
            if (!this.isSelectionEmpty()) {
                var selectModel = this.getSelection()[0].getModel();
                var selectText = this.getSelection()[0].getLabel();
                data[this.getUserData("name")] = selectModel;
                data[this.getUserData("name") + "_text"] = selectText;
            } else {
                return "";
            }
            return data;
        }
    }
});