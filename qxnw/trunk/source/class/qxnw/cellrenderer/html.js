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
/**
 * The image cell renderer renders image into table cells.
 */
qx.Class.define("qxnw.cellrenderer.html", {
    extend: qx.ui.table.cellrenderer.Conditional,
    /*
     *****************************************************************************
     MEMBERS
     *****************************************************************************
     */

    members: {
        // overridden
        _getContentHtml: function (cellInfo) {
            return (cellInfo.value || "<p><a class=\"qxnw_verimgButton\" >Subir</a></p><br />");
        },
        // overridden
        _getCellClass: function (cellInfo) {
            return "qooxdoo-table-cell";
        }
    }
});