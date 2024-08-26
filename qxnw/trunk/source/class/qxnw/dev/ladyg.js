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

qx.Class.define("qxnw.dev.ladyg", {
    extend: qx.core.Object,
    statics: {
        test: function test(parent) {
//            parent.slotAdminDB();
            return;
//            qxnw.utils.enableMouse();

//            var f = new historia_clinica.forms.f_grafica();
//            f.show();
//            return;
//
//            var f = new historia_clinica.forms.f_psicologia_antecedentes();
//            f.show();
//            return;
//
//            var f = new qxnw.examples.formNav();
//            f.show();
//            return;
//
//            var f = new qxnw.basics.lists.l_menu();
//            f.show();
//            return;

            var f = new historia_clinica.forms.f_visiometria();
            f.show();
            return;

        }
    }
});