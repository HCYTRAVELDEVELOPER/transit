qx.Class.define("qxnw.widgets.timeFieldOld", {
    extend: qx.ui.core.Widget,
    construct: function construct() {
        this.base(arguments);
        var self = this;
        var layout = new qx.ui.layout.HBox();
        this._setLayout(layout);
        layout.setAlignY("middle");
        var textField = this._createChildControl("textfield");
        textField.setFilter(/[0-9:]+/);
        self.textField = textField;
        textField.addListener("input", function(e) {
            self.fireEvent("input", e);
        });

        textField.addListener("deactivate", function(e) {
            var v = this.getValue();
            var val = v;
            if (v != null && v != "") {
                v = v.split(":");
                if (v.length < 2 && !this.getUserData("flag_stopped")) {
                    this.setInvalidMessage(self.tr("La hora es incorrecta. Verifique por favor."));
                    this.setValid(false);
                    if (qxnw.config.getShakeOnValidate()) {
                        qxnw.animation.startEffect("shake", self);
                    }
                    if (this.isFocusable()) {
                        this.focus();
                    }
                    this.setUserData("flag_stopped", true);
                    return;
                } else if (v.length == 3 || v.length == 2) {
                    if (v[0].length != 2) {
                        if (qxnw.config.getShakeOnValidate()) {
                            qxnw.animation.startEffect("shake", self);
                        }
                        this.setInvalidMessage(self.tr("La hora debe tener 2 digitos"));
                        this.setValid(false);
                        return;
                    }
                    if (parseInt(v[0]) > 24) {
                        if (qxnw.config.getShakeOnValidate()) {
                            qxnw.animation.startEffect("shake", self);
                        }
                        this.setInvalidMessage(self.tr("La hora no puede ser superior a 24"));
                        this.setValid(false);
                        return;
                    }
                    self.hour.setValue(parseInt(v[0]));
                    if (parseInt(v[1]) > 60) {
                        if (qxnw.config.getShakeOnValidate()) {
                            qxnw.animation.startEffect("shake", self);
                        }
                        this.setInvalidMessage(self.tr("Los minutos no pueden ser superiores a 60"));
                        this.setValid(false);
                        return;
                    }
                    self.time.setValue(parseInt(v[1]));
                    if (typeof v[2] != 'undefined') {
                        if (parseInt(v[2]) > 60) {
                            if (qxnw.config.getShakeOnValidate()) {
                                qxnw.animation.startEffect("shake", self);
                            }
                            this.setInvalidMessage(self.tr("Los segundos no pueden ser superiores a 60"));
                            this.setValid(false);
                            return;
                        }
                    } else {
                        this.setValue(val + ":00");
                    }
                    self.__modifyTime(v[0], v[1]);
                    this.setValid(true);
                    this.setUserData("flag_stopped", false);
                    if (self.getChildControl('popup').isVisible()) {
                        self.getChildControl('popup').hide();
                    }
                }
            }
        });

        textField.setLiveUpdate(true);

        textField.setPlaceholder("hh:mm:ss");

        textField.addListener("keypress", function(e) {
            if (e.getKeyIdentifier() == ":") {
                if (this.getValue() != null) {
                    var len = this.getValue().length;
                    if (len == 1) {
                        e.preventDefault();
                    } else if (this.getValue().substring(len - 1, 1) === ":") {
                        e.preventDefault();
                    } else if (len > 9) {
                        e.preventDefault();
                    }
                }
                return;
            } else if (e.getKeyIdentifier() == "-") {
                e.preventDefault();
            }
            if (!e.isPrintable() || e.getKeyIdentifier() == "Space") {
                return;
            } else if (e.getKeyIdentifier() == "Escape") {
                this.close();
            } else {
                var val = this.getValue();
                if (val != null) {
                    var len = textField.getValue().length;
                    if (len == 2) {
                        this.setValue(val + ":" + e.getKeyIdentifier());
                        e.preventDefault();
                    } else if (len == 5) {
                        this.setValue(val + ":" + e.getKeyIdentifier());
                        e.preventDefault();
                    } else if (len > 7) {
                        e.preventDefault();
                    }
                }
            }
        });
        textField.addListener("click", function() {
            self.__onClick();
        });
        this.addListener("focusin", function(e) {
            textField.fireNonBubblingEvent("focusin", qx.event.type.Focus);
        }, this);
        this.addListener("focusout", function(e) {
            textField.fireNonBubblingEvent("focusout", qx.event.type.Focus);
        }, this);
    },
    events: {
        "input": "qx.event.type.Data"
    },
    members: {
        __isCreatedTime: false,
        __textHour: null,
        __hours: null,
        __minutes: null,
        __value: null,
        hour: null,
        time: null,
        textField: null,
        __required: false,
        setInvalidMessage: function setInvalidMessage(message) {
            this.textField.setInvalidMessage(message);
        },
        setValid: function setValid(valid) {
            this.textField.setValid(valid);
        },
        setRequired: function setRequired(required) {
            this.textField.setRequired(required);
            this.__required = required;
        },
        setValue: function setValue(value) {
            var self = this;
            self.getChildControl('textfield').setValue(value);
            self.__value = value;
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
        __onClick: function() {
            var self = this;
            self.toggle();
            if (!self.__isCreatedTime) {
                self.getChildControl('popup').add(self.createTime(), {
                    flex: 0
                });
            }
            self.__isCreatedTime = true;
            return true;
        },
        createTime: function createTime() {
            var self = this;
            var layout = new qx.ui.layout.HBox();
            var composite = new qx.ui.container.Composite(layout);
            var nf = new qx.util.format.NumberFormat();
            nf.setMaximumFractionDigits(2);
            self.hour = new qx.ui.form.Spinner();
            self.hour.setFocusable(false);
            self.hour.getChildControl("textfield").setFocusable(true);
            self.hour.addListener("changeValue", function(e) {
                self.fireEvent("input", e);
            });
            self.hour.set({
                maximum: 23,
                minimum: 0
            });
            self.hour.setPageStep(1);
            self.hour.setNumberFormat(nf);
            self.hour.addListener("changeValue", function(d) {
                var val = self.hour.getValue();
                self.getChildControl("textfield").setValue(self.__modifyTime(val, null));
            });
            var label = new qx.ui.basic.Label(":");
            self.time = new qx.ui.form.Spinner();
            self.time.addListener("changeValue", function(e) {
                self.fireEvent("input", e);
            });
            self.time.set({
                maximum: 59,
                minimum: 0
            });
            self.time.setSingleStep(5);
            self.time.setNumberFormat(nf);
            var listenerId = self.time.addListener("changeValue", function(d) {
                var val = self.time.getValue();
                self.getChildControl("textfield").setValue(self.__modifyTime(null, val));
            });
            composite.setUserData("listener_id", listenerId);
            composite.add(self.hour);
            composite.add(label);
            composite.add(self.time);
            return composite;
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
        _onListPointerDown: function() {
            return false;
        },
        _onListChangeSelection: function(e) {
            return null;
        },
        __textFieldPressed: function __textFieldPressed(e) {
            e.preventDefault();
        },
        focus: function focus() {
            this.getChildControl('textfield').focus();
        },
        setAllTabIndex: function setAllTabIndex(index) {
            this.getChildControl('textfield').setTabIndex(index);
        },
        _createChildControlImpl: function(id) {
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
                    this._add(control);
                    break;
                case "textfield":
                    control = new qx.ui.form.TextField();
                    control.addState("inner");
                    control.setFocusable(false);
                    control.addListener("blur", this.close, this);
                    this._add(control, {
                        flex: 1
                    });
                    break;
                case "list":
                    control = this.base(arguments, id);
                    control.setSelectionMode("single");
                    break;
                case "popup":
                    control = new qx.ui.popup.Popup(new qx.ui.layout.VBox);
                    control.setAutoHide(false);
                    control.setKeepActive(true);
                    //control.addListener("mouseup", this.close, this);
                    //control.add(this.getChildControl("list"));
                    //control.addListener("changeVisibility", this._onPopupChangeVisibility, this);
                    break;
            }
            return control || this.base(arguments, id);
        }
    }
});