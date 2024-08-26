qx.Class.define("qxnw.widgets.NumericField", {
    extend: qx.ui.core.Widget,
    events: {
        "input": "qx.event.type.Data",
        "focusout": "qx.event.type.Focus",
        "changeValue": "qx.event.type.Data"
    },
    properties: {
        decimalPlaces: {
            init: 2,
            check: "Integer",
            nullable: false,
            apply: "_applyDecimalPlaces"
        },
        maxDecimals: {
            init: 2,
            check: "Integer",
            nullable: false,
            apply: "_applyMaxDecimals"
        },
        invalidMessage: {
            init: "",
            check: "String"
        }
    },
    construct: function () {
        this.base(arguments);
        var self = this;
        this._setLayout(new qx.ui.layout.HBox(0));
        this.setPadding(0);
        this.setAppearance("textfield");
        this._createChildControl("numeric-field");
        this._createChildControl("dec-separator");
        var decimal = this._createChildControl("decimal-field");
        decimal.setValue(self.computeCero());

        this.addListener("focusin", function () {
            self.getChildControl("numeric-field").focus();
        });
        this.addListener("focusout", function () {
            try {
                if (self.getValue() == ".") {
                    self.setValue("." + self.computeCero());
                }
            } catch (e) {

            }
        });

        this.addListener("changeEnabled", function (e) {
            var bool = e.getData();
            if (bool) {
                this.getChildControl("numeric-field").setReadOnly(false);
                this.getChildControl("decimal-field").setReadOnly(false);
                this.getChildControl("numeric-field").setSelectable(true);
                this.getChildControl("decimal-field").setSelectable(true);
                this.getChildControl("numeric-field").setFocusable(true);
            } else {
                this.getChildControl("numeric-field").setReadOnly(true);
                this.getChildControl("decimal-field").setReadOnly(true);
                this.getChildControl("numeric-field").setSelectable(false);
                this.getChildControl("decimal-field").setSelectable(false);
                this.getChildControl("numeric-field").setFocusable(true);
                this.getChildControl("decimal-field").setFocusable(true);
            }
        });
        self.setMaxHeight(21);

        this.getChildControl("numeric-field").addListener("focusin", function (e) {
            self.addState("focused");
        });
        this.getChildControl("numeric-field").addListener("focusout", function (e) {
            self.removeState("focused");
        });
        this.getChildControl("decimal-field").addListener("focusin", function (e) {
            self.addState("focused");
        });
        this.getChildControl("decimal-field").addListener("focusout", function (e) {
            self.removeState("focused");
        });
//        this.setFocusable(true);
    },
    members: {
        id_listener: null,
        popup: null,
        required: false,
        readOnly: null,
        __filter: null,
        _applyMaxDecimals: function _applyMaxDecimals() {
            var decimal = this.getChildControl("decimal-field");
            var val = decimal.getValue();
            if (val == "00" && val.length < this.getMaxDecimals()) {
                decimal.setValue(this.computeCero());
            }
        },
        computeCero: function computeCero() {
            var self = this;
            try {
                var maxDecimals = self.getMaxDecimals();
                return qxnw.utils.repeat("0", maxDecimals);
            } catch (e) {
                return "00";
            }
        },
        setAllowGrowY: function setAllowGrowY(bool) {
            this.getChildControl("numeric-field").setAllowGrowY(bool);
            this.getChildControl("decimal-field").setAllowGrowY(bool);
        },
        setAllTabIndex: function setAllTabIndex(index) {
            this.getChildControl("numeric-field").setTabIndex(index);
            this.getChildControl("decimal-field").setTabIndex(index);
        },
        tabFocus: function tabFocus() {
            this.getChildControl("numeric-field").focus();
        },
        focus: function focus() {
            this.getChildControl("numeric-field").focus();
            this.activate();
        },
        cleanValidate: function cleanValidate() {
            this.setAppearance("textfield");
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
        _onDecimalFieldFocused: function _onDecimalFieldFocused() {
            this.getChildControl("decimal-field").setTextSelection(0);
        },
        setMaxLength: function setMaxLength(len) {
            this.getChildControl("numeric-field").setMaxLength(len);
        },
        _createChildControlImpl: function (id, hash) {
            var self = this;
            var control;
            switch (id) {
                case "numeric-field":
                    control = new qx.ui.form.TextField();
                    control.setFocusable(true);
                    control.setFilter(/[0-9$.,]+/);
                    control.setValue("");
                    var decorator = new qx.ui.decoration.Decorator().set({width: 0});
                    control.setDecorator(decorator);
                    control.setTextAlign("right");
                    this._add(control, {
                        flex: 1
                    });
                    control.addListener("keypress", this._onNumericFieldKeyPress, this);
                    control.addListener("keyup", this._onNumericFieldInput, this);
                    control.addListener("focusout", function (e) {
                        self.fireNonBubblingEvent("focusout", qx.event.type.Focus);
                    }, this);
                    break;
                case "decimal-field":
                    control = new qx.ui.form.TextField();
                    control.setFocusable(true);
                    control.setFilter(/[0-9$.,]+/);
                    control.setValue("");
                    control.setWidth(30);
                    var decorator = new qx.ui.decoration.Decorator().set({width: 0});
                    control.setDecorator(decorator);
                    this._add(control);
                    control.addListener("keypress", this._onDecimalFieldKeyPress, this);
                    control.addListener("keyup", this._onDecimalFieldInput, this);
                    control.addListener("focus", this._onDecimalFieldFocused, this);
                    control.addListener("focusout", function (e) {
                        self.fireNonBubblingEvent("focusout", qx.event.type.Focus);
                    }, this);
                    break;
                case "dec-separator":
                    control = new qx.ui.basic.Label(".");
                    this._add(control);
                    break;
                default:
                    break;
            }

            return control || this.base(arguments, id);
        },
        setFilter: function setFilter(filter) {
            this.__filter = filter;
            this.getChildControl("numeric-field").setFilter(filter);
            this.getChildControl("decimal-field").setFilter(filter);
        },
        _onDecimalFieldInput: function (value) {

            var tmp = this.getChildControl("numeric-field").getValue().replace(/,/g, "");
            var dc = this.getChildControl("decimal-field").getValue().replace(/,/g, "");

            if (value.getKeyIdentifier() == "Unidentified") {
                dc = dc.replace(/[^0-9]+/g, "");
                this.getChildControl("decimal-field").setValue(dc);
                value.preventDefault();
                value.stop();
                return;
            }

            if (this.getDecimalPlaces() > 0) {
                tmp += "." + this.getChildControl("decimal-field").getValue();
            }
            this.fireDataEvent("input", tmp, value);
        },
        _applyDecimalPlaces: function () {
            this.getChildControl("decimal-field").setMaxLength(this.getDecimalPlaces());

            if (this.getDecimalPlaces() > 0) {
                this.getChildControl("dec-separator").show();
                this.getChildControl("decimal-field").show();
                return;
            }

            this.getChildControl("dec-separator").exclude();
            this.getChildControl("decimal-field").exclude();
        },
        __formatNumber: function (n, decPlaces, thouSeparator, decSeparator) {
            decPlaces = isNaN(decPlaces = Math.abs(decPlaces)) ? 2 : decPlaces,
                    decSeparator = decSeparator == undefined ? "." : decSeparator,
                    thouSeparator = thouSeparator == undefined ? "," : thouSeparator,
                    sign = n < 0 ? "-" : "",
                    i = parseInt(n = Math.abs(+n || 0).toFixed(decPlaces)) + "",
                    j = (j = i.length) > 3 ? j % 3 : 0;
            return sign + (j ? i.substr(0, j) + thouSeparator : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thouSeparator) + (decPlaces ? decSeparator + Math.abs(n - i).toFixed(decPlaces).slice(2) : "");
        },
        _onNumericFieldKeyPress: function (e) {

            var keyIdentifier = e.getKeyIdentifier();

            var numericField = this.getChildControl("numeric-field");

            var isCtrlPressed = e.isCtrlPressed();

            if (!isCtrlPressed && (keyIdentifier !== "v" || keyIdentifier !== "V")) {
                if (keyIdentifier === "´") {
                    e.preventDefault();
                    return;
                }
                if (keyIdentifier === ".") {
                    this.getChildControl("decimal-field").focus();
                    e.preventDefault();
                    return;
                }

                if (keyIdentifier !== "c" && keyIdentifier !== "C" && keyIdentifier !== "-" && isNaN(keyIdentifier) && e.isPrintable()) {
                    e.preventDefault();
                    return;
                }

                if (keyIdentifier === "Right" && numericField.getValue().length == numericField.getTextSelectionStart()) {
                    this.getChildControl("decimal-field").focus();
                    e.preventDefault();
                    return;
                }
            }

        },
        _onDecimalFieldKeyPress: function (e) {

            var keyIdentifier = e.getKeyIdentifier();

            if (keyIdentifier == "." || keyIdentifier == "," || keyIdentifier == "´") {
                e.preventDefault();
                return;
            }

            if (isNaN(keyIdentifier) && e.isPrintable()) {
                e.preventDefault();
                return;
            }

            if (isNaN(keyIdentifier) == true && e.isPrintable() == true) {
                e.preventDefault();
                return;
            }

            var decimalField = this.getChildControl("decimal-field");

            if (keyIdentifier == "Backspace" && decimalField.getValue() == "") {
                this.getChildControl("numeric-field").focus();
                e.preventDefault();
                return;
            }

            if (keyIdentifier == "Left" && decimalField.getTextSelectionStart() == 0) {
                this.getChildControl("numeric-field").focus();
                e.preventDefault();
                return;
            }
            if (!e.isPrintable() && keyIdentifier != "Backspace" && keyIdentifier != "Delete" && keyIdentifier != "Left" && keyIdentifier != "Right") {
                e.preventDefault();
                return;
            }

            //var numericDecimal = this.getChildControl("decimal-field");
            var value = decimalField.getValue().replace(/,/g, "");
            if (decimalField.getValue() != this.computeCero() && keyIdentifier != "Delete" && keyIdentifier != "Left" && keyIdentifier != "Right") {
                if (value.length >= this.getMaxDecimals() && e.getKeyIdentifier() != "Backspace") {
                    if (value.length == decimalField.getTextSelectionEnd()) {
                        if (!qxnw.utils.validateIsInteger(keyIdentifier)) {
                            e.preventDefault();
                            return;
                        }
                        //decimalField.setValue(e.getKeyIdentifier().toString());
                        if (decimalField.getTextSelectionStart() != 0) {
                            e.preventDefault();
                        }
                    } else {
                        e.stop();
                    }
                }
            }
        },
        _onNumericFieldInput: function (e) {

            var numericField = this.getChildControl("numeric-field");
            var pos = numericField.getTextSelectionStart();
            var value = numericField.getValue().split(".");
            if (typeof value[1] != 'undefined') {
                this.getChildControl("decimal-field").setValue(value[1]);
            }

            value = value[0].replace(/,/g, "");

            value = value.replace(/[^0-9-]+/g, "");

            if (!value) {
                return;
            }

            if (value == "-") {
                return;
            }

            var newValue = this.__formatNumber(value, 0);

            numericField.setValue(newValue);
            //var offset = (newValue.length - value.length);
            //numericField.setTextSelection(pos + offset, pos + offset);

            var tmp = this.getChildControl("numeric-field").getValue().replace(/,/g, "");
            if (this.getDecimalPlaces() > 0) {
                tmp += "." + this.getChildControl("decimal-field").getValue();
            }
            this.fireDataEvent("input", tmp, value);

            this.cleanValidate();
        },
        setValue: function (value) {
            var tmp = value.toString().split(".");
            if (typeof tmp[0] != 'undefined') {
                this.getChildControl("numeric-field").setValue(tmp[0]);
            }
            if (typeof tmp[1] != 'undefined') {
                this.getChildControl("decimal-field").setValue(tmp[1]);
            } else {
                this.getChildControl("decimal-field").setValue(this.computeCero());
            }
            this._onNumericFieldInput();
        },
        getValue: function () {
            var tmp = this.getChildControl("numeric-field").getValue().replace(/,/g, "");
            if (this.getDecimalPlaces() > 0) {
                tmp += "." + this.getChildControl("decimal-field").getValue();
            }
            return tmp;
        }
    }
});