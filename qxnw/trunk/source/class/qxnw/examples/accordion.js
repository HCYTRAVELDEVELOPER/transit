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

qx.Class.define("qxnw.examples.accordion", {
    extend: qxnw.forms,
    construct: function () {
        this.base(arguments);
        var self = this;
        var accordion = new qxnw.widgets.accordion();
        accordion.setOpenOlyOne(true);
        accordion.populate("usuarios", "nombre");
        accordion.setCallback(function (rta, widget) {
            var f = new qxnw.forms();
            var html = "";
            for (var v in rta) {
                html += "<b>" + qxnw.utils.ucFirst(v) + ": </b>";
                html += rta[v];
                html += "<br />";
            }
            f.addHtml(html);
            widget.add(f.getChildrenContainer());
        });
        self.masterContainer.add(accordion.getMainContainer());
    }
});
