/* ************************************************************************
 
 Copyright:
 2015 Grupo NW S.A.S, http://www.gruponw.com
 
 License:
 LGPL: http://www.gnu.org/licenses/lgpl.html
 EPL: http://www.eclipse.org/org/documents/epl-v10.php
 See the LICENSE file in the project's top-level directory for details.
 
 Authors:
 * Andrés Flórez (andresf)
 * 
 * Class to test on andresf projects
 
 ************************************************************************ */

qx.Class.define("qxnw.widgets.button", {
    extend: qx.ui.form.Button,
    construct: function (label, icon, command) {
        this.base(arguments, label, icon, command);
    },
    members: {
        setRequired: function setRequired(bool) {

        },
        setColor: function setColor(color) {
            var self = this;
            self.setAppearance("widget");
            self.setBackgroundColor(color);
            self.setAlignX("center");
            self.setAlignY("middle");
            self.setCursor("pointer");
            self.setCenter(true);
            self.addListener("pointerover", function () {
                qxnw.utils.addBorder(self, "black", 1);
            });
            self.addListener("pointerout", function () {
                qxnw.utils.addBorder(self, "gray", 0.5);
            });
            qxnw.utils.addBorder(self, "gray", 0.5);
        }
    }
});