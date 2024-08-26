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
qx.Class.define("qxnw.dev.desarrollo1", {
    extend: qx.core.Object,
    statics: {
        test: function test(parent) {
//            qxnw.utils.enableMouse();
            var f = new qxnw.forms();
            var fields = [
                {
                    name: "formulario",
                    type: "textField",
                    label: "Formulario",
                    required: true
                }
            ];
            f.setFields(fields);
            f.show();

            f.ui.accept.addListener("execute", function () {
                var data = f.ui.formulario.getValue();
                console.log(data);
                if (data == 1) {
                    main.slotVistaTicketsNew();
                    f.reject();
//                    var a = new informes.forms.f_informes();
//                    a.show();
                    return;
                }
                if (data == 2) {
                    var a = new ord_prod.forms.f_ingreso_contenedor();
                    a.show();
                    return;
                }
                if (data == 3) {
                    var a = new portal.tree.vista_solicitudes();
                    a.show();
                    return;
                }
               
               
            });
            f.ui.cancel.addListener("execute", function () {
                f.reject();
            });

            return;

//            f.ui.formulario.addListener("imput", function (e) {
//                var data = f.getRecord();
//                console.log(data);
//            }, this);
//            var f = new historia_clinica.forms.f_vacunacion();

            //parent.slotSitDespachos();

        }
    }
});