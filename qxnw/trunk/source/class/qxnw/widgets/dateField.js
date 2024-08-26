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
qx.Class.define("qxnw.widgets.dateField", {
    extend: qx.ui.form.DateField,
    construct: function (df) {
        this.base(arguments);
        var self = this;
        var dateFormat = "yyyy-MM-dd";
        if (typeof df !== 'undefined') {
            dateFormat = df;
        }
        self.setPlaceholder(dateFormat);
        var format = new qx.util.format.DateFormat(dateFormat);
        self.setDateFormat(format);
        self.setServerDate = function () {
            var self = this;
            var func = function (r) {
                if (r != false) {
                    r = r.split("-");
                    var d = new Date();
                    d.setFullYear(r[0]);
                    d.setMonth(r[1] - 1);
                    d.setDate(r[2]);
                    self.setValue(d);
                }
            };
            qxnw.utils.fastAsyncRpcCall("master", "getServerDate", "date", func);
        };
        self.set({
            maxHeight: 25,
            minWidth: 155
        });
        var listenerFocus = self.addListener("focus", function (e) {
            //this.open();
        });
        self.setUserData("focus_id_listener", listenerFocus);
        self.getChildControl("button").addListener("click", function (e) {
            if (self.getUserData("enabled") != null) {
                if (!self.getUserData("enabled")) {
                    e.preventDefault();
                    e.stop();
                    return;
                }
            }
        });
//        self.getChildControl("textfield").addListener("mousedown", function (e) {
//            e.preventDefault();
//            e.stop();
//        });

        self.addListener("focusout", function (e) {
            var v = this.getChildControl("textfield").getValue();
            if (v == "") {
                return;
            }
            var splited;
            if (v != null) {
                splited = v.split("-");
                if (splited.length < 3 && !this.getUserData("flag_stopped")) {
                    this.setInvalidMessage(self.tr("La fecha es incorrecta"));
                    this.setValid(false);
                    if (qxnw.config.getShakeOnValidate()) {
                        qxnw.animation.startEffect("shake", self);
                    }
                    if (this.isFocusable()) {
                        this.focus();
                    }
                    this.setUserData("flag_stopped", true);
                    return;
                } else if (splited.length === 3) {
                    if (splited[0].length !== 4) {
                        if (qxnw.config.getShakeOnValidate()) {
                            qxnw.animation.startEffect("shake", self);
                        }
                        this.setValid(false);
                        this.setInvalidMessage(self.tr("El año debe tener 4 digitos"));
                        return;
                    }
                    if (parseInt(splited[1]) > 12) {
                        if (qxnw.config.getShakeOnValidate()) {
                            qxnw.animation.startEffect("shake", self);
                        }
                        this.setValid(false);
                        this.setInvalidMessage(self.tr("El mes no puede ser superior a 12"));
                        return;
                    }
                    if (parseInt(splited[2]) > 31) {
                        if (qxnw.config.getShakeOnValidate()) {
                            qxnw.animation.startEffect("shake", self);
                        }
                        this.setValid(false);
                        this.setInvalidMessage(self.tr("El día no puede ser superior a 31"));
                        return;
                    }
                    var dateChooser = this.getChildControl("list");
                    var dat;
                    try {
                        dat = this.getDateFormat().parse(v);
                    } catch (e) {
                        if (qxnw.config.getShakeOnValidate()) {
                            qxnw.animation.startEffect("shake", self);
                        }
                        this.setValid(false);
                        this.setInvalidMessage(self.tr("Por favor ingrese una fecha válida"));
                        return false;
                    }
                    dateChooser.setValue(dat);
                    var startDate = Date.parse(v);
                    if (isNaN(startDate)) {
                        if (qxnw.config.getShakeOnValidate()) {
                            qxnw.animation.startEffect("shake", self);
                        }
                        this.setValid(false);
                        this.setInvalidMessage(self.tr("Por favor ingrese una fecha válida"));
                        return false;
                    }
                    this.setValid(true);
                    this.setUserData("flag_stopped", false);
                }
            }
        });
        self.addListener("focusout", function (e) {
            self.close();
        });
        self.getChildControl("textfield").addListener("click", function (e) {
            if (self.getUserData("enabled") != null) {
                if (!self.getUserData("enabled")) {
                    return;
                }
            }
            var isListOpen = self.getChildControl("popup").isVisible();
            if (isListOpen) {
                self.close();
            } else {
                self.open();
            }
        });
        self.getChildControl("textfield").setFilter(/[0-9-]+/);

        self.addListener("keypress", function (e) {

            if (e.getKeyIdentifier() === "Space") {
                var d = new Date();
                self.setValue(d);
                self.fireDataEvent("setToday", d);
                return;
            }

            var textField = this.getChildControl("textfield");
            var sl = self.getChildControl("textfield").getTextSelectionLength();
            var ts = self.getChildControl("textfield").getTextSelectionStart();

            if (e.getKeyIdentifier() == "-") {
                if (this.getChildControl("textfield").getValue() != null) {
                    var len = this.getChildControl("textfield").getValue().length;
                    if (len == 1) {
                        e.preventDefault();
                    } else if (len < 4) {
                        e.preventDefault();
                    } else if (len > 4 && len < 7) {
                        e.preventDefault();
                    } else if (len > 7 && len < 9) {
                        e.preventDefault();
                    } else if (this.getChildControl("textfield").getValue().substring(len - 1, 1) === "-") {
                        e.preventDefault();
                    } else if (len > 8) {
                        e.preventDefault();
                    }
                }
                return;
            }
            if (!e.isPrintable()) {
                if (e.getKeyIdentifier() === "Backspace") {
                    if (this.getChildControl("textfield") == null) {
                        return;
                    }
                    var letter = this.getChildControl("textfield").getValue().charAt(ts - 1);
                    var letterNext = this.getChildControl("textfield").getValue().charAt(ts + 1);
                    if (letter == "-" && letterNext != "" && sl == 0) {
                        e.preventDefault();
                    }
                }
                if (e.getKeyIdentifier() === "Delete") {
                    var letter = this.getChildControl("textfield").getValue().charAt(ts);
                    var letterNext = this.getChildControl("textfield").getValue().charAt(ts + 1);
                    if (letter == "-" && letterNext != "" && sl == 0) {
                        e.preventDefault();
                    }
                }
                return;
            } else if (e.getKeyIdentifier() === "Escape") {
                this.close();
            } else {
                var val = textField.getValue();
                var arr = val == null ? {} : val.split("-");
                if (arr.length == 3) {
                    if (arr[0].length == 4 && ts <= 4) {
                        e.preventDefault();
                    } else if (arr[1].length == 2 && ts <= 7 && ts >= 4) {
                        e.preventDefault();
                    } else if (arr[2].length == 2 && ts > 9) {
                        e.preventDefault();
                    }
                    if (ts >= 5 && ts <= 6 && parseInt(arr[1]) > 12) {
                        textField.setValue(arr[0] + "-12-" + arr[2]);
                    }
                    if (ts >= 8 && ts <= 10 && parseInt(arr[2]) > 31) {
                        textField.setValue(arr[0] + "-" + arr[1] + "-31");
                        e.preventDefault();
                    } else if (ts >= 9 && arr[2].toString().length >= 2) {
                        textField.setValue(arr[0] + "-" + arr[1] + "-31");
                        e.preventDefault();
                    }
                    return;
                }
                if (val != null) {
                    var len = textField.getValue().length;
                    if (len == 4) {
                        textField.setValue(val + "-" + e.getKeyIdentifier());
                        e.preventDefault();
                    } else if (len == 7) {
                        textField.setValue(val + "-" + e.getKeyIdentifier());
                        e.preventDefault();
                    } else if (len > 9 && sl == 0) {
                        e.preventDefault();
                    }
                }
            }
        });
        self.setStringValue = function (value) {
            if (typeof value == "string") {
                this.getChildControl("textfield").setValue(format.parse(value));
                return;
            } else if (typeof value == "object") {
                this.setValue(value);
            }
        };
        self.getChildControl("textfield").addListener("changeEnabled", function (e) {
            var bool = e.getData();
            if (bool) {
                this.setReadOnly(false);
                this.setSelectable(true);
                this.setFocusable(true);
            } else {
                this.setReadOnly(true);
                this.setSelectable(false);
                this.setFocusable(true);
            }
            self.setUserData("enabled", bool);
        });
        self.setUserData("enabled", true);
        self.clean = function () {
            this.getChildControl('textfield').setValue('');
        };
        self._createChildControl("buttonToday");
        self._createChildControl("buttonClean");
        self.getChildControl("buttonClean").addListener("execute", function (e) {
            self.setValue("");
        });
        self.getChildControl("buttonToday").addListener("execute", function (e) {
            var d = new Date();
            self.setValue(d);
            self.fireDataEvent("setToday", d);
        });
    },
    events: {
        "setToday": "qx.event.type.Data"
    },
    members: {
        // overridden
        _onTap: function _onTap() {

        },
        // overridden
        _onBlur: function _onBlur() {

        },
        validate: function validate() {
            var self = this;
            var v = this.getChildControl("textfield").getValue();
            if (v == "" || v == null) {
                return true;
            }
            var splited;
            if (v != null) {
                splited = v.split("-");
                if (splited.length < 3 && !this.getUserData("flag_stopped")) {
                    this.setInvalidMessage(self.tr("La fecha es incorrecta"));
                    this.setValid(false);
                    if (qxnw.config.getShakeOnValidate()) {
                        qxnw.animation.startEffect("shake", self);
                    }
                    if (this.isFocusable()) {
                        this.focus();
                    }
                    this.setUserData("flag_stopped", true);
                    return false;
                } else if (splited.length == 3) {
                    if (splited[0].length != 4) {
                        if (qxnw.config.getShakeOnValidate()) {
                            qxnw.animation.startEffect("shake", self);
                        }
                        this.setValid(false);
                        this.setInvalidMessage(self.tr("El año debe tener 4 digitos"));
                        return false;
                    }
                    if (parseInt(splited[1]) > 12) {
                        if (qxnw.config.getShakeOnValidate()) {
                            qxnw.animation.startEffect("shake", self);
                        }
                        this.setValid(false);
                        this.setInvalidMessage(self.tr("El mes no puede ser superior a 12"));
                        return false;
                    }
                    if (parseInt(splited[2]) > 31) {
                        if (qxnw.config.getShakeOnValidate()) {
                            qxnw.animation.startEffect("shake", self);
                        }
                        this.setValid(false);
                        this.setInvalidMessage(self.tr("El día no puede ser superior a 31"));
                        return false;
                    }
                    var dateChooser = this.getChildControl("list");
                    var dat;
                    try {
                        dat = this.getDateFormat().parse(v);
                    } catch (e) {
                        if (qxnw.config.getShakeOnValidate()) {
                            qxnw.animation.startEffect("shake", self);
                        }
                        this.setValid(false);
                        this.setInvalidMessage(self.tr("Por favor ingrese una fecha válida"));
                        return false;
                    }
                    dateChooser.setValue(dat);
                    var startDate = Date.parse(v);
                    if (isNaN(startDate)) {
                        if (qxnw.config.getShakeOnValidate()) {
                            qxnw.animation.startEffect("shake", self);
                        }
                        this.setValid(false);
                        this.setInvalidMessage(self.tr("Por favor ingrese una fecha válida"));
                        return false;
                    }
                    this.setValid(true);
                    this.setUserData("flag_stopped", false);
                    return true;
                }
            }
        },
        setActualDate: function setActualDate() {
            var d = new Date();
            var textField = this.getChildControl("textfield");
            textField.setValue(this.getDateFormat().format(d));
            return d;
        },
        // overridden
        tabFocus: function () {
            this.base(arguments);
            this.getChildControl("textfield").getFocusElement().focus();
        },
        _handleKeypress: function _handleKeypress(e) {
            var key = e.getKeyIdentifier();
            if (!e.isPrintable()) {
                var isListOpen = this.getChildControl("popup").isVisible();
                if (key === "Enter") {
                    if (this.getChildControl('popup').isVisible()) {
                        this.close();
                        var textField = this.getChildControl("textfield");
                        var selectedDate = this.getChildControl("list").getValue();
                        textField.setValue(this.getDateFormat().format(selectedDate));
                    }
                } else if (key === "Escape") {
                    this.close();
                } else if (key == "Down") {
                    if (!isListOpen) {
                        this.open();
                    }
                    //this.getChildControl('list').handleKeyPress(e);
                } else if ((key == "Left" || key == 'Right') && isListOpen) {
                    //this.getChildControl('list').handleKeyPress(e);
                } else if (this.getChildControl('popup').isVisible()) {
                    //this.getChildControl('list').handleKeyPress(e);
                }
            }
        },
        // overridden
        _createChildControlImpl: function (id, hash) {
            var self = this;
            var control;

            switch (id) {
                case "textfield":
                    control = new qx.ui.form.TextField();
                    control.setFocusable(false);
                    control.addState("inner");
                    control.addListener("keypress", this._handleKeypress, this);
                    control.addListener("changeValue", this._onTextFieldChangeValue, this);
                    control.addListener("blur", this.close, this);
                    this._add(control, {flex: 1});
                    break;

                case "button":
                    control = new qx.ui.form.Button();
                    control.setFocusable(false);
                    control.setKeepActive(true);
                    control.addState("inner");
                    control.addListener("execute", this.toggle, this);
                    this._add(control);
                    break;

                case "buttonToday":
                    control = new qx.ui.form.Button(self.tr("Hoy"));
                    control.setPadding(2);
                    control.setShow("label");
                    control.setFocusable(false);
                    control.setKeepActive(true);
                    control.addState("inner");
                    //TODO: se quita para que no lo abra si no se necesita
                    //control.addListener("execute", this.toggle, this);
                    this._add(control);
                    break;

                case "buttonClean":
                    control = new qx.ui.form.Button(self.tr("Limpiar"));
                    control.setIcon(qxnw.config.execIcon("edit-clear"));
                    control.setPadding(0);
                    control.setMaxWidth(15);
                    control.setShow("icon");
                    control.setFocusable(false);
                    control.setKeepActive(true);
                    control.addState("inner");
                    this._add(control);
                    break;

                case "list":
                    control = new qx.ui.control.DateChooser();
                    control.setFocusable(false);
                    control.setKeepFocus(true);
                    control.addListener("execute", this._onChangeDate, this);
                    break;

                case "popup":
                    control = new qx.ui.popup.Popup(new qx.ui.layout.VBox);
                    control.setAutoHide(false);
                    control.add(this.getChildControl("list"));
                    control.addListener("pointerup", this._onChangeDate, this);
                    control.addListener("changeVisibility", this._onPopupChangeVisibility, this);
                    break;
            }

            return control || this.base(arguments, id);
        },
        //overrided TODO: pilas con el cambio de versión
        setValue: function setValue(value, sendedFormat) {
            // set the date to the textfield
            var textField = this.getChildControl("textfield");

            if (value == "") {
                textField.setValue("");
                return;
            }

            var newSendedFormat = "yyyy-MM-dd";

            if (typeof sendedFormat !== 'undefined') {
                newSendedFormat = sendedFormat;
            }

            if (typeof value == "string") {
                switch (newSendedFormat) {
                    case "yyyy-MM-dd":
                        var parts = value.split('-');
                        value = new Date(parts[0], parts[1] - 1, parts[2]);
                        break;
                    case "YYMMdd":
                        var year = value.substring(0, 2);
                        var month = value.substring(2, 4);
                        var day = value.substring(4, 6);
                        value = new Date(year, month - 1, day);
                        break;

                    default:

                        break;
                }
            }

            textField.setValue(this.getDateFormat().format(value));

            // set the date in the datechooser
            var dateChooser = this.getChildControl("list");
            dateChooser.setValue(value);
        }
    }
});