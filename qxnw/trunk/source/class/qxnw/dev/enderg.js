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

qx.Class.define("qxnw.dev.enderg", {
    extend: qx.core.Object,
    statics: {
        test: function test() {
            return;
            var f = new qxnw.examples.form_light();
//            f.setCanPrint(true);
            f.setModal(true);
            f.show();
            return;
        }
    }
});