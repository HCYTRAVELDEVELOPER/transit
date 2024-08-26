qx.Class.define("qxnw.widgets.dateTimeFieldOld", {
    extend: qx.ui.core.Widget,
    construct: function construct() {
        this.base(arguments);
        var self = this;
        var layout = new qx.ui.layout.HBox();
        this._setLayout(layout);
        layout.setAlignY("middle");
        self.set({
            maxHeight: 25
        });
        self.setMinWidth(140);
        var textField = this._createChildControl("textfield");
        textField.setDecorator(null);
        textField.setUserData("nw_name_focus_form", "dateTimeField");
        self.textField = textField;
        textField.setFilter(/[0-9:-\s]+/);
        textField.setLiveUpdate(true);

        self.setAppearance("textfield");

        this._createChildControl("button");

        self.addListener("deactivate", function (e) {
            var these = this;
            var text = self.getChildControl("textfield");
            var v = text.getValue();
            if (v == "") {
                return;
            }
            var splited;
            if (v != null) {
                var breaked = v.split(" ");
                splited = breaked[0].split("-");
                if (splited.length < 3 && !text.getUserData("flag_stopped")) {
                    text.setInvalidMessage(self.tr("La fecha es incorrecta"));
                    text.setValid(false);
                    if (qxnw.config.getShakeOnValidate()) {
                        qxnw.animation.startEffect("shake", self);
                    }
                    if (text.isFocusable()) {
                        text.focus();
                    }
                    text.setUserData("flag_stopped", true);
                    return;
                } else if (splited.length == 3) {
                    if (splited[0].length != 4) {
                        if (qxnw.config.getShakeOnValidate()) {
                            qxnw.animation.startEffect("shake", self);
                        }
                        text.setValid(false);
                        text.setInvalidMessage(self.tr("El año debe tener 4 digitos"));
                        if (text.isFocusable()) {
                            text.focus();
                        }
                        return;
                    }
                    if (parseInt(splited[1]) > 12) {
                        if (qxnw.config.getShakeOnValidate()) {
                            qxnw.animation.startEffect("shake", self);
                        }
                        text.setValid(false);
                        text.setInvalidMessage(self.tr("El mes no puede ser superior a 12"));
                        if (text.isFocusable()) {
                            text.focus();
                        }
                        return;
                    }
                    if (parseInt(splited[2]) > 31) {
                        if (qxnw.config.getShakeOnValidate()) {
                            qxnw.animation.startEffect("shake", self);
                        }
                        text.setValid(false);
                        text.setInvalidMessage(self.tr("El día no puede ser superior a 31"));
                        if (text.isFocusable()) {
                            text.focus();
                        }
                        return;
                    }
//                    var dateChooser = self.getChildControl("list");
//                    var dat;
//                    console.log(qx.locale.Date.getDateFormat("medium"));
//                    try {
//                        dat = qx.util.format.DateFormat.getDateInstance().parse(v);
//                        console.log(dat);
//                    } catch (e) {
//                        console.log(e);
//                        if (qxnw.config.getShakeOnValidate()) {
//                            qxnw.animation.startEffect("shake", self);
//                        }
//                        this.setValid(false);
//                        this.setInvalidMessage(self.tr("Por favor ingrese una fecha válida"));
//                        return false;
//                    }
//                    dateChooser.setValue(dat);
                    var startDate = Date.parse(v);
                    if (isNaN(startDate)) {
                        if (qxnw.config.getShakeOnValidate()) {
                            qxnw.animation.startEffect("shake", self);
                        }
                        text.setValid(false);
                        text.setInvalidMessage(self.tr("Por favor ingrese una fecha válida"));
                        if (these.isFocusable()) {
                            text.focus();
                        }
                        return false;
                    }
//                    text.setValid(true);
//                    text.setUserData("flag_stopped", false);
                }
                var breakedTime = v.split(" ");
                var splitedTime = breakedTime[1];
                if (typeof splitedTime == 'undefined') {
                    return;
                }
                //var re = /^\d{1,2}:\d{2}(:\d{2})([ap]m)?$/;
                var re = /^([0-1]?[0-9]|[2][0-3]):([0-5][0-9])(:[0-5][0-9])?$/;

                if (!splitedTime.match(re)) {
                    if (qxnw.config.getShakeOnValidate()) {
                        qxnw.animation.startEffect("shake", self);
                    }
                    text.setValid(false);
                    text.setInvalidMessage(self.tr("Por favor ingrese un horario válido"));
                    if (text.isFocusable()) {
                        text.focus();
                    }
                    return false;
                }
            }
        });
        textField.addListener("input", function (e) {
            self.fireEvent("input", e);
        });
//        textField.setFilter(/[^\'\\{}|?¿!¡=)(\/&%#.,]/g);
        textField.setPlaceholder("yyyy-mm-dd hh:mm:ss");
        textField.addListener("keypress", function (e) {
            self._onKeyPress(e);
        });

//        textField.addListener("changeEnabled", function(e) {
//            var bool = e.getData();
//            if (bool) {
//                this.setReadOnly(false);
//                this.setSelectable(true);
//                this.setFocusable(true);
//            } else {
//                this.setReadOnly(true);
//                this.setSelectable(false);
//                this.setFocusable(false);
//            }
//        });

        var label = this._createChildControl("label");
        this.getApplicationRoot().add(label, {
            top: -10,
            left: -1000
        });
        textField.bind("value", label, "value");

//        textField.addListener("appear", function(e) {
//            var bounds = self.getBounds();
//            if (bounds == null) {
//                bounds = {};
//                bounds.width = 50;
//            }
//            //textField.setWidth(bounds.width);
//        }, this);
        textField.addListener("click", function () {
            self.__onClick();
        });
        this.getChildControl("textfield").addListener("focusin", function (e) {
            self.addState("focused");
        });
        this.getChildControl("textfield").addListener("focusout", function (e) {
            self.removeState("focused");
        });
        this.addListener("focusin", function (e) {
            textField.fireNonBubblingEvent("focusin", qx.event.type.Focus);
        }, this);
        this.addListener("focusout", function (e) {
            textField.fireNonBubblingEvent("focusout", qx.event.type.Focus);
        }, this);

        //TODO: EN REVISIÓN
        self.setFocusable(true);
        if (!self.__isCreatedTime) {
            self.getChildControl('popup').add(self.createTime());
            self.__isCreatedTime = true;
        }
    },
    properties: {
        dateFormat: {
            init: null
        },
        hasSeconds: {
            init: true,
            check: "Boolean"
        }
    },
    events: {
        "input": "qx.event.type.Data"
    },
    members: {
        __isCreatedTime: false,
        __textHour: null,
        __hours: null,
        __minutes: null,
        __dateFormat: null,
        __formatter: null,
        __date: null,
        __editValue: null,
        __hour: null,
        __time: null,
        __chooser: null,
        __required: false,
        textField: null,
        __valid: true,
        __typeFocus: null,
        id_listenerValid: null,
        popupValid: null,
        __invalidMessage: "",
        changeFocusState: function changeFocusState(type) {
            this.__typeFocus = type;
        },
        evalueClose: function evalueClose(e) {
            //if (this.getChildControl("popup").isVisible() == true) {
            //this.close();
            //}
        },
        setInvalidMessage: function setInvalidMessage(message) {
            this.textField.setInvalidMessage(message);
            this.__invalidMessage = message;
        },
        getInvalidMessage: function getInvalidMessage(message) {
            this.textField.getInvalidMessage();
        },
        getValid: function getValid() {
            return this.textField.getValid();
        },
        setValid: function setValid(bool) {
            var self = this;
            this.textField.setValid(bool);
        },
        setRequired: function setRequired(required) {
            this.textField.setRequired(required);
            this.__required = required;
        },
        _onKeyPress: function _onKeyPress(e) {
            var key = e.getKeyIdentifier();
            if (e.isPrintable()) {
                if (!key.match(/[0-9:-]/g)) {
                    e.preventDefault();
                    return;
                }
                if (e.getKeyIdentifier() == "-") {
                    if (this.getValue() != null) {
                        var len = this.getValue().length;
                        if (len == 1) {
                            e.preventDefault();
                        } else if (this.getValue().substring(len - 1, 1) === "-") {
                            e.preventDefault();
                        } else if (len > 9) {
                            e.preventDefault();
                        }
                    }
                    return;
                } else if (e.getKeyIdentifier() == ":") {
                    e.preventDefault();
                }
                var textfield = this.getChildControl("textfield");
                var val = textfield.getValue();
                if (val != null) {
                    var len = textfield.getValue().length;
                    if (len == 4) {
                        textfield.setValue(val + "-" + e.getKeyIdentifier());
                        e.preventDefault();
                    } else if (len == 7) {
                        textfield.setValue(val + "-" + e.getKeyIdentifier());
                        e.preventDefault();
                    } else if (len == 10) {
                        textfield.setValue(val + " " + e.getKeyIdentifier());
                        e.preventDefault();
                    } else if (len == 13) {
                        textfield.setValue(val + ":" + e.getKeyIdentifier());
                        e.preventDefault();
                    } else if (len == 16) {
                        textfield.setValue(val + ":" + e.getKeyIdentifier());
                        e.preventDefault();
                    } else if (len > 18) {
                        e.preventDefault();
                    }
                }
            } else {
                if (e.getKeyIdentifier() == "Space") {
                    return;
                } else if (e.getKeyIdentifier() === "Escape") {
                    this.close();
                } else if (key == "Down") {
                    if (!this.getChildControl('popup').isVisible()) {
                        this.getChildControl('popup').show();
                    }
                } else if (key == "Left" || key == 'Right') {
                    //this.getChildControl("list").handleKeyPress(e);
                }
            }
        }
        ,
        setServerDate: function setServerDate() {
            var self = this;
            var func = function (r) {
                if (r != false) {
                    self.setValue(r);
                }
            };
            qxnw.utils.fastAsyncRpcCall("master", "getServerDate", 0, func);
        },
        setAllTabIndex: function setAllTabIndex(index) {
            this.getChildControl("textfield").setTabIndex(index);
            this.setTabIndex(index);
        },
        // overiden
        _applyTabIndex: function _applyTabIndex(value) {
            if (value == null) {
                value = 1;
            } else if (value < 1 || value > 32000) {
                throw new Error("TabIndex property must be between 1 and 32000");
            }
            if (this.getFocusable() && value != null) {
                this.getFocusElement().setAttribute("tabIndex", value);
            }
            this.getChildControl("textfield").setTabIndex(value);
        }
        ,
        setValue: function setValue(value) {
            var self = this;
            if (typeof value == 'object') {
                var rta = qxnw.utils.createTimestampStringFromDate(value);
                var data = rta.split(" ");
                self.putDateTime(data[0], data[1]);
                self.__editValue = rta;
            } else {
                self.getChildControl('textfield').setValue(value);
                if (value != "" && value != null) {
                    self.__editValue = value;
                }
            }
        },
        open: function open() {
            var popup = this.getChildControl("popup");
            popup.placeToWidget(this, true);
            popup.show();
        },
        close: function close() {
            this.getChildControl("popup").hide();
        },
        toggle: function toggle() {
            var isListOpen = this.getChildControl("popup").isVisible();
            if (isListOpen) {
                this.close();
            } else {
                this.open();
            }
        },
        __onClick: function __onClick() {
            var self = this;
            self.toggle();
            if (self.__editValue != null) {
                var data = self.__editValue.split(" ");
                if (data.length == 1) {
                    self.__editValue = null;
                    return;
                }
                self.putDateTime(data[0], data[1]);
                self.__editValue = null;
            }
            return true;
        },
        /**
         * The time in the format 'hh:mm:ss'
         * @param date {String} the date
         * @param time {String} the time
         * @returns {String}
         */
        putDateTime: function putDateTime(date, time) {
            var self = this;
            self.__chooser.setValue(qxnw.utils.createDateFromString(date));
            var timeArray = time.split(":");
            self.__hour.setValue(parseInt(timeArray[0]));
            self.__time.setValue(parseInt(timeArray[1]));
        },
        verifyAllLostFocus: function verifyAllLostFocus() {
            var lostFocus = false;
            if (this.hourIsActive == false) {
                return;
            }
        },
        createTime: function createTime() {
            var self = this;
            var layout = new qx.ui.layout.VBox();
            var composite = new qx.ui.container.Composite(layout);
            var nf = new qx.util.format.NumberFormat();
            nf.setMaximumFractionDigits(2);
            self.__hour = new qx.ui.form.Spinner();
            self.__hour.setFocusable(false);
            self.__hour.getChildControl("textfield").setFocusable(true);
            self.__hour.set({
                maximum: 23,
                minimum: 0
            });
            self.__hour.setPageStep(1);
            self.__hour.setNumberFormat(nf);
            self.__hour.addListener("changeValue", function (d) {
                var val = self.__hour.getValue();
                if (self.__date == null) {
                    self.__date = self.getDateFormat().format(new Date());
                }
                self.getChildControl("textfield").setValue(self.__date + " " + self.__modifyTime(val, null));
            });
            self.__hour.getChildControl("textfield").addListener("click", function (d) {
                this.selectAllText();
            });
            var label = new qx.ui.basic.Label(":");
            self.__time = new qx.ui.form.Spinner();
            self.__time.setFocusable(false);
            self.__time.set({
                maximum: 59,
                minimum: 0
            });
            self.__time.setSingleStep(1);
            self.__time.setNumberFormat(nf);
            var listenerId = self.__time.addListener("changeValue", function (d) {
                var val = self.__time.getValue();
                if (self.__date == null) {
                    self.__date = self.getDateFormat().format(new Date());
                }
                self.getChildControl("textfield").setValue(self.__date + " " + self.__modifyTime(null, val));
            });
            composite.setUserData("listener_id", listenerId);

            var timeComposite = new qx.ui.container.Composite(new qx.ui.layout.HBox());

            timeComposite.add(self.__hour);
            timeComposite.add(label);
            timeComposite.add(self.__time);

            composite.add(timeComposite);

            self.__chooser = new qx.ui.control.DateChooser();

            self.__chooser.addListener("changeValue", function (e) {
                var format = self.getDateFormat();
                if (format == null) {
                    format = self.getDefaultDateFormatter().format(e.getData());
                } else {
                    format = self.getDateFormat().format(e.getData());
                }
                self.__date = format;
                if (self.__textHour == null) {
                    self.__textHour = "00:00";
                }
                self.getChildControl("textfield").setValue(self.__date + " " + self.__textHour);
            });
            composite.add(self.__chooser);
            self.__chooser.show();
            return composite;
        },
        getDefaultDateFormatter: function () {
            var format = qx.locale.Date.getDateFormat("medium").toString();

            if (format == this.__dateFormat) {
                return this.__formatter;
            }

            if (this.__formatter) {
                this.__formatter.dispose();
            }

            this.__formatter = new qx.util.format.DateFormat(format, qx.locale.Manager.getInstance().getLocale());
            this.__dateFormat = format;

            return this.__formatter;
        },
        __modifyTime: function __modifyTime(hours, minutes) {
            var self = this;
            var hoursText = hours == null ? self.__hours == null ? "00" : self.__hours : hours;
            var intersection = ":";
            var minutesText = minutes == null ? self.__minutes == null ? "00" : self.__minutes : minutes;
            if (hoursText.toString().length == 1) {
                hoursText = "0" + hoursText;
            }
            if (minutesText.toString().length == 1) {
                minutesText = "0" + minutesText;
            }
            var data = null;
            if (self.__textHour == null) {
                self.__textHour = hoursText + intersection + minutesText;
            } else {
                data = self.__textHour.split(":");
                data[0] = hoursText;
                data[1] = minutesText;
                self.__textHour = data.join(intersection);
            }
            self.__hours = hoursText;
            self.__minutes = minutesText;
            return self.__textHour;
        },
        // overridden
        tabFocus: function tabFocus() {
            this.getChildControl("textfield").getFocusElement().focus();
        },
        // overridden
        focus: function () {
            this.base(arguments);
            this.getChildControl("textfield").getFocusElement().focus();
        },
        tabBlur: function () {
            var field = this.getChildControl("textfield");
            field.getFocusElement().blur();
        },
        _onListPointerDown: function () {
            return false;
        },
        _onListChangeSelection: function (e) {
            return null;
        },
        __textFieldPressed: function __textFieldPressed(e) {
            e.preventDefault();
        },
        _onPopupChangeVisibility: function (e) {
            e.getData() == "visible" ? this.addState("popupOpen") : this.removeState("popupOpen");
            //console.log(this.getState());
            var popup = this.getChildControl("popup");
            //if (popup.isVisible())
        },
        getValue: function getValue() {
            return this.getChildControl("textfield").getValue();
        },
        _createChildControlImpl: function (id) {
            var self = this;
            var control;
            switch (id) {
                case "label":
                    control = new qx.ui.basic.Label();
                    control.hide();
                    break;
                case "button":
                    control = new qx.ui.form.Button();
                    control.setIcon(qxnw.config.execIcon("document-open-recent"));
                    control.setFocusable(false);
                    control.setKeepActive(true);
                    control.addState("inner");
                    control.addListener("execute", this.toggle, this);
                    control.setAppearance("label");
                    control.setUserData("nw_name_focus_form", "dateTimeField");
                    this._add(control);
                    break;
                case "textfield":
                    control = new qx.ui.form.TextField();
                    //TODO: se remueve para que funcione mejor en as tabulaciones
                    //control.setFocusable(false);
                    control.addState("inner");
                    //control.addListener("blur", this.close, this);
                    this._add(control, {
                        flex: 1
                    });
                    break;
                case "list":
                    control = this.base(arguments, id);
                    control.setFocusable(true);
                    control.setKeepFocus(true);
                    control.setSelectionMode("single");
                    break;
                case "popup":
                    control = new qx.ui.popup.Popup(new qx.ui.layout.VBox);
                    control.setAutoHide(false);
                    control.setKeepActive(true);
                    control.addListener("changeVisibility", this._onPopupChangeVisibility, this);
                    //control.add(this.getChildControl("list"));
                    //control.addListener("changeVisibility", this._onPopupChangeVisibility, this);
                    break;
            }
            return control || this.base(arguments, id);
        }
    }
});