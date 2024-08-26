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
qx.Class.define("qxnw.nw_printer.forms.f_printer_properties", {
    extend: qxnw.forms,
    construct: function (html) {
        var self = this;
        this.base(arguments);
        var func = function (id) {
            var maxRows = 20;
            qxnw.local.setData("nw_enc_max_rows", maxRows);
            var maxCols = 20;
            self.addFrame("/nwlib" + qxnw.userPolicies.getNwlibVersion() + "/modulos/nwexcel/file.php?id_qxnwlist=" + id);
//            self.addFrame("/nwlib" + qxnw.userPolicies.getNwlibVersion() +
//                    "/modulos/nwexcel/file.php?file=/nwlib" + qxnw.userPolicies.getNwlibVersion() +
//                    "/nw_calculate/nw_enc_user.inc.php&functionQXNW=receiveHTMLCalculateEnc&maxRows=" + maxRows + "&maxCols=" + maxCols);
        }
        qxnw.utils.fastAsyncCallRpc("excelReport", "saveHtmlToExportToExcel", html, func);
    }
});

