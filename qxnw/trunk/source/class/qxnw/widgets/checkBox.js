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
qx.Class.define("qxnw.widgets.checkBox", {
    extend: qx.ui.form.CheckBox,
    construct: function (label) {
        this.base(arguments, label);
        var self = this;
        self.addListener("changeEnabled", function (e) {
            if (self.getLayoutParent() != null) {
                if (e.getData() === true) {
                    self.getLayoutParent().setEnabled(true);
                } else {
                    self.getLayoutParent().setEnabled(false);
                }
            }
        });
        self.setAllowGrowX(false);
        self.setAllowGrowY(false);
        self.setAlignY("middle");
        self.setAlignX("center");
        self.setPadding(10);
        self.setPaddingTop(7);
        self.setGap(2);
        self.setRich(true);
        var lbl = self.getChildControl("label");
        lbl.setAnonymous(false);
        self.addListener("focusin", function (d) {
            try {
                var labelUi = this.getUserData("labelUi");
                if (labelUi != null) {
                    var lbl = labelUi.getValue();
                    labelUi.setValue("<div style='text-decoration: underline;'>" + lbl + "</div>");
                }
            } catch (e) {

            }
        });
        self.addListener("focusout", function (d) {
            try {
                var labelUi = this.getUserData("labelUi");
                if (labelUi != null) {
                    var lbl = labelUi.getValue();
                    lbl = lbl.replace("<div style='text-decoration: underline;'>", "");
                    lbl = lbl.replace("</div>", "");
                    labelUi.setValue(lbl);
                }
            } catch (e) {

            }
        });
        self.addListener("changeValue", function (d) {
            try {
                var data = d.getData();
                var labelUi = this.getUserData("labelUi");
                if (labelUi != null) {
                    var lbl = labelUi.getValue();
                    if (data == true) {
                        labelUi.setValue("<b>" + lbl + "</b>");
                    } else {
                        lbl = lbl.replace("<b>", "");
                        lbl = lbl.replace("</b>", "");
                        labelUi.setValue(lbl);
                    }
                }
            } catch (e) {

            }
        });
        self.addListener("appear", function (d) {
            try {
                var labelUi = self.getUserData("labelUi");
                if (labelUi != null) {
                    labelUi.addListener("click", function (d) {
                        try {
                            self.fireEvent(
                                    "click",
                                    qx.event.type.Mouse,
                                    [{}, self, self, false, true]
                                    );
                        } catch (e) {
                            console.log(e);
                        }
                    });
                }
            } catch (z) {
                console.log(z);
//                qxnw.utils.nw_console(z);
            }
        });
    },
    members: {
        __id_listener_label: null,
        /**
         * overridden (from MExecutable to keep the icon out of the binding)
         * @lint ignoreReferenceField(_bindableProperties)
         */
        _bindableProperties: [
            "enabled",
            "click",
            "label",
            "toolTipText",
            "value",
            "menu"
        ],
        saveUserData: function saveUserData(key) {
            var self = this;
            var ud = qxnw.local.getData(key);
            if (ud != null) {
                if (typeof ud != 'undefined') {
                    try {
                        self.setValue(ud);
                    } catch (e) {
                        qxnw.utils.nw_console(e);
                    }
                }
            }
            self.setUserData("nw_default_user_data_value", key);
            self.addListener("changeValue", function () {
                var v = this.getValue();
                var key = self.getUserData("nw_default_user_data_value");
                qxnw.local.setData(key, v);
            });
        }
    }
});