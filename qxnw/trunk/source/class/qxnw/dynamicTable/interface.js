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
/**
 * TextField with list check
 */
qx.Class.define("qxnw.dynamicTable.interface", {
    extend: qx.ui.container.Composite,
    construct: function (parent) {
        this.base(arguments);
        this._setLayout(new qx.ui.layout.HBox());
        var container = this;
    }
});

