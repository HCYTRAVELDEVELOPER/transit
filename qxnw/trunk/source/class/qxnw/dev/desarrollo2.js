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
 * Class to test on andresf projects
 
 ************************************************************************ */
qx.Class.define("qxnw.dev.desarrollo2", {
    extend: qx.core.Object,
    statics: {
        test: function test(parent) {

            return;

            var l = new pos.lists.l_productos();
            parent.addSubWindow("Encabezado Perfecto", l);
            return;

            parent.createMasterList("master", "pos_clientes", "TEST LIST", true);
            return;

            var f = new pos.forms.f_salidas();
            f.show();
            return;

            return;

            qxnw.utils.enableMouse();
            return;

            var f = new qxnw.examples.formNav();
            f.show();
            return;

            var f = new historia_clinica.forms.f_optometria();
            f.show();

            //parent.slotSitDespachos();
            return;
        }
    }
});