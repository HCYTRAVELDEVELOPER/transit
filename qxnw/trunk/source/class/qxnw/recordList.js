/* ************************************************************************
 
 Copyright:
 2013 Netwoods.net, http://www.netwoods.net
 
 License:
 LGPL: http://www.gnu.org/licenses/lgpl.html
 EPL: http://www.eclipse.org/org/documents/epl-v10.php
 See the LICENSE file in the project's top-level directory for details.
 
 Authors:
 Andrés Flórez
 
 ************************************************************************ */
/**
 * Only in testing mode
 */
qx.Class.define("qxnw.recordList", {
    extend: qx.core.Object,
    /**
     * Try to create an simple object to manage the arrays
     */
    construct: function() {
        return this.__nwarray;
    },
    members: {
        /*
         * The main array 
         */
        __nwarray: new Array()
    }
});