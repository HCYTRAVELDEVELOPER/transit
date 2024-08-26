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

qx.Class.define("qxnw.record", {
    extend: qx.core.Object,
    construct: function() {
        return this.__nwarray;
    },
    members: {
        __nwarray: {}
    }
});