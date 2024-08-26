qx.Class.define("qxnw.widgets.uploaderAdmin", {
    extend: qx.ui.container.Composite,
    construct: function construct() {
        this.base(arguments);
        var self = this;
        var layout = new qx.ui.layout.HBox();
        this._setLayout(layout);
        layout.setAlignY("middle");
        var textField = new qx.ui.form.TextField();
        //this._createChildControl("button");
        textField.setLiveUpdate(true);
        textField.setPlaceholder(self.tr("Selecctio..."));
        textField.addListener("keypress", function(e) {
            self.__textFieldPressed(e);
        });
        textField.addListener("appear", function(e) {
            textField.setWidth(self.getBounds()["width"]);
        }, this);
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
    members: {
        __isCreatedTime: false,
        __textHour: null,
        __hours: null,
        __minutes: null,
        __onClick: function() {
            var self = this;
            self.toggle();
            if (!self.getChildControl('popup').isVisible()) {
                self.getChildControl('popup').show();
            }
            if (!self.__isCreatedTime) {
                self.getChildControl('list').add(self.createTime());
            }
            self.getChildControl('list').show();
            self.__isCreatedTime = true;
            return true;
        },
        createTime: function createTime() {
            var self = this;
            var layout = new qx.ui.layout.HBox();
            var composite = new qx.ui.container.Composite(layout);
            var nf = new qx.util.format.NumberFormat();
            nf.setMaximumFractionDigits(2);
            var hour = new qx.ui.form.Spinner();
            hour.set({
                maximum: 23,
                minimum: 0
            });
            hour.setPageStep(1);
            hour.setNumberFormat(nf);
            hour.addListener("changeValue", function(d) {
                var val = hour.getValue();
                self.getChildControl("textfield").setValue(self.__modifyTime(val, null));
            });
            var label = new qx.ui.basic.Label(":");
            var time = new qx.ui.form.Spinner();
            time.set({
                maximum: 59,
                minimum: 0
            });
            time.setSingleStep(5);
            time.setNumberFormat(nf);
            var listenerId = time.addListener("changeValue", function(d) {
                var val = time.getValue();
                self.getChildControl("textfield").setValue(self.__modifyTime(null, val));
            });
            composite.setUserData("listener_id", listenerId);
            composite.add(hour);
            composite.add(label);
            composite.add(time);
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
        _onListMouseDown: function() {
            return false;
        },
        _onListChangeSelection: function(e) {
            return null;
        },
        __textFieldPressed: function __textFieldPressed(e) {
            e.preventDefault();
        },
        _createChildControlImpl: function(id) {
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
                    this._add(control);
                    break;
                case "textfield":
                    control = new qx.ui.form.TextField();
                    control.addState("inner");
                    this._add(control);
                    break;
                case "list":
                    control = this.base(arguments, id);
                    control.setSelectionMode("single");
                    break;
                case "popup":
                    control = new qx.ui.popup.Popup(new qx.ui.layout.VBox);
                    control.setAutoHide(true);
                    control.setKeepActive(true);
                    control.addListener("mouseup", this.close, this);
                    control.add(this.getChildControl("list"));
                    control.addListener("changeVisibility", this._onPopupChangeVisibility, this);
                    break;
            }
            return control || this.base(arguments, id);
        }
    }
});