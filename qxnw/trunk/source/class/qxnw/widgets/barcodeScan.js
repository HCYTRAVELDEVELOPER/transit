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
 * Manage all the RPC calls
 */
qx.Class.define("qxnw.widgets.barcodeScan", {
    extend: qx.core.Object,
    /**
     * Loads the script to decode multi-format 1D/2D barcode image
     */
    construct: function () {
        var isLoaded = qxnw.config.getIsBarcodeScanLoaded();
    }
});