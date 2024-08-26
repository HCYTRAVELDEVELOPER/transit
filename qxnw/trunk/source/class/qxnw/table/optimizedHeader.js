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

qx.Class.define("qxnw.table.optimizedHeader", {
    extend: qx.ui.table.pane.Header,
    members: {
        // overridden
        _updateContent: function (completeUpdate) {

            var children = this._getChildren();
            var table = this.getTable();

            if (completeUpdate && children.length > 0 && table.getBlockHeaderUpdate && table.getBlockHeaderUpdate()) {
                // this.error("_updateContent: BLOCKED");
                return;
            }

            this.base(arguments, completeUpdate);
        }

    }
});