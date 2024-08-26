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

qx.Class.define("qxnw.widgets.charts", {
    extend: qx.ui.container.Composite,
    construct: function () {
        this.base(arguments);
        var self = this;
    },
    destruct: function () {

    },
    members: {
        writeLines: function writeLines() {
            this.context.beginPath();
            this.context.moveTo(100, 150);
            this.context.lineTo(450, 50);
            this.context.stroke();
        }
    }
});
