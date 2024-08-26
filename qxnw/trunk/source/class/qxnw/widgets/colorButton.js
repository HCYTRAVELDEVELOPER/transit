qx.Class.define("qxnw.widgets.colorButton", {
    extend: qx.ui.core.Widget,
    events: {
        "changeValue": "qx.event.type.Data"
    },
    properties: {
        invalidMessage: {
            init: "",
            check: "String"
        },
        // overridden
        appearance: {
            refine: true,
            init: "colorpopup"
        }
    },
    construct: function () {
        this.base(arguments);
        this._setLayout(new qx.ui.layout.VBox(5));
        this.setPadding(0);
        //this.setAppearance("textfield");
        this._createChildControl("preview-selected");
        this._createChildControl("selector-button");
//        this.addListener("changeEnabled", function(e) {
//            var bool = e.getData();
//            if (bool) {
//                this.getChildControl("numeric-field").setReadOnly(false);
//                this.getChildControl("decimal-field").setReadOnly(false);
//                this.getChildControl("numeric-field").setSelectable(true);
//                this.getChildControl("decimal-field").setSelectable(true);
//                this.getChildControl("numeric-field").setFocusable(true);
//            } else {
//                this.getChildControl("numeric-field").setReadOnly(true);
//                this.getChildControl("decimal-field").setReadOnly(true);
//                this.getChildControl("numeric-field").setSelectable(false);
//                this.getChildControl("decimal-field").setSelectable(false);
//                this.getChildControl("numeric-field").setFocusable(true);
//                this.getChildControl("decimal-field").setFocusable(true);
//            }
//        });
    },
    members: {
        id_listener: null,
        popup: null,
        required: false,
        readOnly: null,
        __filter: null,
        __colorValue: null,
        setAllTabIndex: function setAlTabIndex(index) {
            this.getChildControl("selector-button").setTabIndex(index);
        },
        tabFocus: function tabFocus() {
            this.getChildControl("selector-button").focus();
        },
        focus: function focus() {
            this.getChildControl("selector-button").focus();
        },
        cleanValidate: function cleanValidate() {
            var border = new qx.ui.decoration.Decorator().set({
                backgroundColor: "white",
                width: 1,
                style: "solid",
                color: "black"
            });
            this.setDecorator(border);
        },
        setValid: function setValid(bool) {
            var self = this;
            if (bool == false) {
                var border = new qx.ui.decoration.Decorator().set({
                    backgroundColor: "white",
                    width: 3,
                    style: "solid",
                    color: "red"
                });
                this.setAppearance("textfield");
                this.setDecorator(border);
                self.id_listener = self.addListenerOnce("mouseover", function (e) {
                    self.popup = new qx.ui.popup.Popup(new qx.ui.layout.HBox()).set({
                        backgroundColor: "#FF0000"
                    });
                    if (self.getInvalidMessage() != "") {
                        self.popup.placeToPointer(e);
                        self.popup.add(new qx.ui.basic.Atom(self.getInvalidMessage()), {
                            flex: 1
                        });
                        self.popup.show();
                    }
                });
            } else {
                if (self.id_listener != null) {
                    self.removeListenerById(self.id_listener);
                }
            }
        },
        setRequired: function setRequired(bool) {
            this.required = bool;
        },
        setReadOnly: function setReadOnly(bool) {
            this.readOnly = bool;
        },
        _createChildControlImpl: function (id, hash) {
            var control;
            switch (id) {
                case "preview-selected":
                    control = new qx.ui.container.Composite(new qx.ui.layout.Basic);
                    control.setAllowStretchX(true);
                    control.set({
                        minHeight: 20
                    });
                    this._add(control, {
                        flex: 1
                    });
                    break;
                case "selector-button":
                    control = new qx.ui.form.Button(this.tr("Abrir colores"));
                    control.addListener("execute", this._onColorButtonOk, this);
                    this._add(control);
                    break;
                default:
                    break;
            }
            return control || this.base(arguments, id);
        },
        _onColorButtonOk: function _onColorButtonOk() {
            var self = this;
            var colores = new qx.ui.control.ColorPopup();
            colores.setAutoHide(false);
            colores.placeToWidget(this);
            colores.addListener("changeValue", function () {
                self.__colorValue = this.getValue();
                self.getChildControl("preview-selected").setBackgroundColor(self.__colorValue || null);
                colores.destroy();
            });
            colores.addListener("disappear", function () {
                self.__colorValue = colores.getValue();
                self.getChildControl("preview-selected").setBackgroundColor(self.__colorValue || null);
            });
            colores.show();
        },
        setFilter: function setFilter() {
            return true;
        },
        getValue: function () {
            return this.__colorValue;
        },
        setValue: function setValue(value) {
            this.__colorValue = value;
            if (typeof value == 'undefined' || value == 0 || value == "0" || value == null) {
                return;
            }
            this.getChildControl("preview-selected").setBackgroundColor(value || null);
        }
    }
});