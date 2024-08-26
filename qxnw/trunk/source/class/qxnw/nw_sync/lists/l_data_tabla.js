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

qx.Class.define("qxnw.nw_sync.lists.l_data_tabla", {
    extend: qxnw.lists,
    construct: function () {
        var self = this;
        self.base(arguments);
        self.setButtonsAutomatic(true);
        var columns = [
            {
                label: "Data",
                caption: "data"
            }
        ];
        self.setColumns(columns);
    },
    members: {
    }
});
