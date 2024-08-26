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

qx.Class.define("qxnw.table.columnmodel.Default", {
    extend: qx.ui.table.columnmodel.Basic,
//    implement: [my.table.IColumnModel],
    members:
            {
                /**
                 * Initializes the column model.
                 *
                 * This is a ugly hack to prevent the TCM from resetting when the table is using it.
                 */
                init: function (colCount, table) {
                    if (!table) {
                        this.base(arguments, colCount);
                    }
                }
            }
});
