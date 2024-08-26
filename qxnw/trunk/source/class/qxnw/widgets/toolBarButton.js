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

qx.Class.define("qxnw.widgets.toolBarButton", {
    extend: qx.ui.form.Button,
    construct: function (label, icon) {
        this.base(arguments, label, icon);
        this.addListener("appear", function () {
            qxnw.utils.addClass(this, "BUTTON_CLASS");
        });
    }
});