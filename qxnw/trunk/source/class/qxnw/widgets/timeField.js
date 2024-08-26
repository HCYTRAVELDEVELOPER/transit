/* ************************************************************************
 
 Copyright:
 2021 Netwoods.net, http://www.netwoods.net
 
 License:
 LGPL: http://www.gnu.org/licenses/lgpl.html
 EPL: http://www.eclipse.org/org/documents/epl-v10.php
 See the LICENSE file in the project's top-level directory for details.
 
 Authors:
 * Andrés Flórez (andresf)
 
 ************************************************************************ */
qx.Class.define("qxnw.widgets.timeField", {
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

        self._add(self.createTime(), {
            flex: 1
        });

        self.ampm = self._createChildControlImpl("am-pm");
        self.ampm.setFocusable(false);

        self.hour.addListener("changeValue", function () {
            var hour = this.getValue();
            if (!self.time.isEnabled()) {
                if (hour != 12) {
                    self.time.setEnabled(true);
                }
            }
        });

        self.ampm.addListener("changeValue", function () {
            self.__isChangedValue = true;
            var ampm = self.ampm.getValue();
            var hour = self.hour.getValue();
            if (ampm == "AM") {
                if (hour == 12) {
                    //self.time.setValue(0);
                    //self.secs.setValue(0);
                    //self.time.setEnabled(false);
                    //self.secs.setEnabled(false);
                }
            } else {
                self.time.setEnabled(true);
                self.secs.setEnabled(true);
            }
        });

        this.hour.getChildControl("textfield").addListener("focusin", function (e) {
            self.addState("focused");
        });
        this.time.getChildControl("textfield").addListener("focusout", function (e) {
            self.removeState("focused");
        });

        self.setFocusable(false);
    },
    events: {
        input: "qx.event.type.Data"
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
        __internalTime: '00:00:00',
        ampm: null,
        __seconds: null,
        __isChangedValue: false,
        showSeconds: false,
        setShowSeconds: function setShowSeconds(bool) {
            this.showSeconds = bool;
        },
        tabBlur: function () {
            this.getFocusElement().blur();
        },
        // overridden
        /**
         * @lint ignoreReferenceField(_forwardStates)
         */
        _forwardStates: {
            focused: true,
            invalid: true
        },
        // overridden
        focusable: {
            refine: true,
            init: false
        },
        _createChildControlImpl: function (id, hash) {
            var control;
            switch (id) {
                case "am-pm":
                    control = new qxnw.widgets.ampm();
                    this._add(control);
                    break;
                default:
                    break;
            }

            return control || this.base(arguments, id);
        },
        validateTime: function validateTime(v) {
            var self = this;
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
        },
        setInvalidMessage: function setInvalidMessage(message) {
            this.hour.setInvalidMessage(message);
        },
        setValid: function setValid(valid) {
            this.hour.setValid(valid);
            this.time.setValid(valid);
            this.secs.setValid(valid);
        },
        setRequired: function setRequired(required) {
            this.__required = required;
        },
        setValue: function setValue(value) {
            var self = this;

            if (value == false) {
                return false;
            }
            if (value == null) {
                return false;
            }
            if (value == "") {
                return false;
            }

            self.__isChangedValue = true;
            self.__internalTime = value;
            self.__value = value;

            var v = value.split(":");

            if (typeof v[0] != 'undefined' && v[0] != "") {
                if (v[0] == 24) {
                    v[0] = v[0] - 12;
                    self.ampm.setValue("AM");
                    var timer = new qx.event.Timer(50);
                    timer.start();
                    timer.addListener("interval", function (e) {
                        this.stop();
                        self.time.setEnabled(true);
                        self.secs.setEnabled(true);
                    });
                } else if (v[0] > 12) {
                    v[0] = v[0] - 12;
                    self.ampm.setValue("PM");
                    if (v[0] == 12) {
                        //self.time.setEnabled(false);
                        //self.secs.setEnabled(false);
                    }
                } else if (v[0] == 12) {
                    self.ampm.setValue("PM");
                    var timer = new qx.event.Timer(50);
                    timer.start();
                    timer.addListener("interval", function (e) {
                        this.stop();
                        self.time.setEnabled(true);
                        self.secs.setEnabled(true);
                    });
                } else if (v[0] == 00) {
                    self.ampm.setValue("AM");
                    v[0] = 12;
                    var timer = new qx.event.Timer(50);
                    timer.start();
                    timer.addListener("interval", function (e) {
                        this.stop();
                        self.time.setEnabled(true);
                        self.secs.setEnabled(true);
                    });
                }
                self.hour.setValue(parseInt(v[0]));
            }
            if (typeof v[1] != 'undefined' && v[1] != "") {
                self.time.setValue(parseInt(v[1]));
            }
            if (typeof v[2] != 'undefined' && v[2] != "") {
                self.secs.setValue(parseInt(v[2]));
            }
            //self.validateTime(value);
        },
        getValue: function getValue() {
            var self = this;
            if (self.__isChangedValue === false) {
                return "";
            }
            var ampm = self.ampm.getValue();
            var hour = self.hour.getValue();
            var time = self.time.getValue();
            var seconds = self.secs.getValue();
            self.__internalTime = self.__modifyTime(hour, time, seconds);
            var v = this.__internalTime.split(":");
            if (ampm == "PM") {
                var rta = null;
                if (hour == 12) {
                    rta = v[0];
                } else {
                    rta = 12 + parseInt(v);
                }
                v[0] = rta;
                this.__internalTime = v.join(":");
            } else {
                var rta = null;
                if (hour == 12) {
                    rta = "00";
                } else {
                    rta = v[0];
                }
                v[0] = rta;
                this.__internalTime = v.join(":");
            }
            return this.__internalTime;
        },
        toggle: function toggle() {
            return false;
        },
        __onClick: function __onClick() {
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
        clean: function clean() {
            var self = this;
            var minHour = self.hour.getMinimum();
            self.hour.setValue(minHour);
            var minTime = self.time.getMinimum();
            self.time.setValue(minTime);
            var minSecs = self.secs.getMinimum();
            self.secs.setValue(minSecs);
        },
        createTime: function createTime() {
            var self = this;
            var layout = new qx.ui.layout.HBox();
            var composite = new qx.ui.container.Composite(layout);
            var nf = new qx.util.format.NumberFormat();
            nf.setMaximumFractionDigits(2);
            self.hour = new qx.ui.form.Spinner();

            var tT = new qx.ui.tooltip.ToolTip(self.tr("Horas"), qxnw.config.execIcon("document-open-recent"));
            self.hour.setToolTip(tT);

            self.hour.getChildControl("textfield").addListener("input", function (e) {
                self.fireEvent("input", e);
            });
            self.hour.addState("inner");

            self.hour.setFocusable(false);
            self.hour.getChildControl("textfield").setFocusable(true);
            self.hour.getChildControl("textfield").setMinWidth(25);
            self.hour.set({
                maximum: 12,
                minimum: 1,
                maxHeight: 25
            });
            self.hour.addListener("changeValue", function (e) {
                try {
                    self.fireEvent("input", e);
                } catch (e) {

                }
                self.__isChangedValue = true;
                var ampm = self.ampm.getValue();
                var hour = self.hour.getValue();
                if (hour != 12 && ampm == "PM") {
                    self.time.setEnabled(true);
                    self.secs.setEnabled(true);
                }
//                else if (hour == 12 && ampm == "PM") {
//                    self.time.setValue(0);
//                    self.secs.setValue(0);
//                    self.time.setEnabled(false);
//                    self.secs.setEnabled(false);
//                }
            });
            self.hour.setPageStep(1);
            self.hour.setNumberFormat(nf);
            self.hour.addListener("changeValue", function (d) {
                var val = self.hour.getValue();
                self.__internalTime = self.__modifyTime(val, null);
            });

            var label = new qx.ui.basic.Label(":");

            self.time = new qx.ui.form.Spinner();
            self.time.addState("inner");

            var tT1 = new qx.ui.tooltip.ToolTip(self.tr("Minutos"), qxnw.config.execIcon("document-open-recent"));
            self.time.setToolTip(tT1);

            self.time.addListener("changeValue", function (e) {
                self.__isChangedValue = true;
                self.fireEvent("input", e);
                if (this.getValue() == 54) {
                    this.setValue(55);
                }
            });
            self.time.getChildControl("textfield").setMinWidth(25);
            self.time.setFocusable(false);
            self.time.getChildControl("textfield").setFocusable(true);
            self.time.getChildControl("textfield").addListener("input", function (e) {
                self.__isChangedValue = true;
                self.fireEvent("input", e);
            });
            self.time.set({
                maximum: 59,
                minimum: 0,
                maxHeight: 25
            });
            self.time.setSingleStep(5);
            self.time.setNumberFormat(nf);
            self.time.addListener("changeValue", function (d) {
                var val = self.time.getValue();
                self.__internalTime = self.__modifyTime(null, val);
            });

            self.secs = new qx.ui.form.Spinner();
            self.secs.addState("inner");

            var tT2 = new qx.ui.tooltip.ToolTip(self.tr("Segundos"), qxnw.config.execIcon("document-open-recent"));
            self.secs.setToolTip(tT2);

            self.secs.addListener("changeValue", function (e) {
                self.fireEvent("input", e);
                if (this.getValue() == 54) {
                    this.setValue(55);
                }
            });
            self.secs.getChildControl("textfield").setMinWidth(25);
            self.secs.setFocusable(false);
            self.secs.getChildControl("textfield").setFocusable(true);
            self.secs.getChildControl("textfield").addListener("input", function (e) {
                self.fireEvent("input", e);
                self.__isChangedValue = true;
            });
            self.secs.set({
                maximum: 59,
                minimum: 0,
                maxHeight: 25
            });
            self.secs.setSingleStep(5);
            if (self.showSeconds == false) {
                self.secs.setVisibility("excluded");
            }
            self.secs.setNumberFormat(nf);
            self.secs.addListener("changeValue", function (d) {
                var val = self.secs.getValue();
                self.__internalTime = self.__modifyTime(null, val);
            });

            composite.add(self.hour, {
                flex: 1
            });
            composite.add(label);
            composite.add(self.time, {
                flex: 1
            });
            composite.add(label);
            composite.add(self.secs, {
                flex: 1
            });
            return composite;
        },
        __modifyTime: function __modifyTime(hours, minutes, seconds) {
            var self = this;
            var hoursText = hours == null ? self.__hours == null ? "00" : self.__hours : hours;
            var intersection = ":";
            var minutesText = minutes == null ? self.__minutes == null ? "00" : self.__minutes : minutes;
            var secondsText = seconds == null ? self.__seconds == null ? "00" : self.__seconds : seconds;
            if (hoursText.toString().length == 1) {
                hoursText = "0" + hoursText;
            }
            if (minutesText.toString().length == 1) {
                minutesText = "0" + minutesText;
            }
            if (secondsText.toString().length == 1) {
                secondsText = "0" + secondsText;
            }
            var data = null;
            if (self.__textHour == null) {
                if (self.showSeconds == true) {
                    self.__textHour = hoursText + intersection + minutesText + intersection + seconds;
                } else {
                    self.__textHour = hoursText + intersection + minutesText;
                }
            } else {
                data = self.__textHour.split(":");
                data[0] = hoursText;
                data[1] = minutesText;
                if (typeof data[2] != 'undefined') {
                    if (self.showSeconds == true) {
                        data[2] = secondsText;
                    }
                }
                self.__textHour = data.join(intersection);
            }
            if (hoursText == "24") {
                hoursText = "00";
            }
            self.__hours = hoursText;
            self.__minutes = minutesText;
            self.__seconds = seconds;
            return self.__textHour;

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
        // overridden
        tabFocus: function () {
            this.hour.focus();
        },
        focus: function focus() {
            try {
                this.hour.getChildControl("numeric-field").focus();
            } catch (e) {

            }
        },
        setAllTabIndex: function setAllTabIndex(index) {
            this.hour.getChildControl('textfield').setTabIndex(index);
            this.hour.setTabIndex(index);

            var indexInternal = qxnw.config.getActualTabIndex();
            this.time.getChildControl('textfield').setTabIndex(indexInternal);
            this.time.setTabIndex(indexInternal);

            indexInternal = qxnw.config.getActualTabIndex();
            this.secs.getChildControl('textfield').setTabIndex(indexInternal);
            this.secs.setTabIndex(indexInternal);

            indexInternal = qxnw.config.getActualTabIndex();
            this.ampm.getChildControl('upbutton').setTabIndex(indexInternal);
        }
    }
});