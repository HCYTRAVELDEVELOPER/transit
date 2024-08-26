/* ************************************************************************
 
 Copyright:
 2013 Netwoods.net, http://www.netwoods.net
 
 License:
 LGPL: http://www.gnu.org/licenses/lgpl.html
 EPL: http://www.eclipse.org/org/documents/epl-v10.php
 See the LICENSE file in the project's top-level directory for details.
 
 Authors:
 * Andrés Flórez (andresf)
 * 
 * Class to test on alexf projects
 
 ************************************************************************ */

qx.Class.define("qxnw.dev.alexf", {
    extend: qx.core.Object,
    statics: {
        test: function test() {

            setTimeout(function () {
                var d = new tiquets.trees.vista_tickets_new();
                d.show();
            }, 2500);

//            var up = qxnw.userPolicies.getUserData();
//            if (up.user == "alexf") {
//                this.slotNwPlayMillonario();
//            }
        }
    }
});