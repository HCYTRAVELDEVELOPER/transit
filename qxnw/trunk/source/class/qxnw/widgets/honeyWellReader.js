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
qx.Class.define("qxnw.widgets.honeyWellReader", {
    extend: qxnw.forms,
    construct: function () {
        var self = this;
        this.base(arguments);
        self.setTitle(self.tr("Lector de cédulas"));
        var fields = [
            {
                name: "Datos captura",
                type: "startGroup",
                icon: "icon/16/apps/utilities-text-editor.png",
                mode: "grid"
            },
            {
                name: "tipo_identificacion",
                label: self.tr("T/ Identificación"),
                type: "selectBox",
                required: true,
                row: 0,
                column: 1
            },
            {
                name: "identificacion",
                label: self.tr("Identificación"),
                type: "textField",
                required: true,
                mode: "integer",
                row: 0,
                column: 2
            },
            {
                name: "primer_apellido",
                label: "Primer Apellido",
                caption: "primer_apellido",
                type: "textField",
                mode: "upperCase.string",
                row: 0,
                column: 3
            },
            {
                name: "segundo_apellido",
                label: "Segundo Apellido",
                caption: "segundo_apellido",
                type: "textField",
                mode: "upperCase.string",
                row: 0,
                column: 4
            },
            {
                name: "primer_nombre",
                label: "Primer Nombre",
                caption: "primer_nombre",
                type: "textField",
                mode: "upperCase.string",
                row: 0,
                column: 5
            },
            {
                name: "segundo_nombre",
                label: "Segundo Nombre",
                caption: "segundo_nombre",
                type: "textField",
                mode: "upperCase.string",
                row: 1,
                column: 1
            },
            {
                name: "sexo",
                label: "Género",
                caption: "sexo",
                type: "textField",
                row: 1,
                column: 2
            },
            {
                name: "fecha_nacimiento",
                label: "Fecha Nacimiento",
                caption: "fecha_nacimiento",
                type: "dateField",
                row: 1,
                column: 3
            },
            {
                name: "rh",
                label: "RH",
                caption: "rh",
                type: "textField",
                row: 1,
                column: 4
            }
        ];
        self.setFields(fields);

        var data = {};
        data[""] = "Seleccione";
        data["CC"] = "CC";
        data["TI"] = "TI";
        data["PA"] = "Pasaporte CE";
        data["RC"] = "Carnet";
        qxnw.utils.populateSelectFromArray(self.ui.tipo_identificacion, data);

        data = {};
        data[""] = "Seleccione";
        data["M"] = "M";
        data["F"] = "F";
//        qxnw.utils.populateSelectFromArray(self.ui.sexo, data);

        data = {};
        data[""] = "Seleccione";
        data["A +"] = "A +";
        data["A-"] = "A-";
        data["B +"] = "B +";
        data["B-"] = "B-";
        data["AB+"] = "AB+";
        data["AB-"] = "AB-";
        data["O+"] = "O+";
        data["O-"] = "O-";
//        qxnw.utils.populateSelectFromArray(self.ui.rh, data);

        self.ui.cancel.addListener("execute", function () {
            self.reject();
        });
        self.ui.accept.addListener("execute", function () {
            if (!self.validate()) {
                return;
            }
            self.accept();
//            self.sendData();
        });

        qxnw.utils.addClassField(self.ui.identificacion, "identificacion_pilstol_foc", function () {
            document.querySelector(".identificacion_pilstol_foc").focus();
        });

        self.enterIdenti = false;

        self.ui.identificacion.addListener("keypress", function (e) {
            if (e.getKeyIdentifier() == "Enter") {
                console.log("honeyWellReader:::self.ui.identificacion:::keypress");
                self.enterIdenti = true;
                self.sendData();
                setTimeout(function () {
                    self.enterIdenti = false;
                }, 1000);
            }
        });

        self.lastDataIdentif = false;
        self.ui.identificacion.addListener("focusout", function (e) {
            if (self.enterIdenti) {
                return false;
            }
        });

        var buttons = [
            {
                label: self.tr("Leer de nuevo"),
                icon: qxnw.config.execIcon("edit-clear"),
                name: "limpiar"
            }
        ];
        self.addButtons(buttons, self.ui.accept);
        self.ui.limpiar.addListener("execute", function () {
            self.clean();
            self.ui.identificacion.focus();
        });

    },
    members: {
        sendData: function sendData() {
            var self = this;
            var data = self.getRecord();
            if (qxnw.utils.evalueData(data.identificacion)) {
                console.log("honeyWellReader:::self.ui.identificacion:::focusout");
                setTimeout(function () {
                    console.log("honeyWellReader:::self.ui.identificacion:::focusout:::data", data);
                    if (qxnw.utils.evalueData(data.identificacion) && self.lastDataIdentif != data.identificacion) {
                        self.lastDataIdentif = data.identificacion;
                        self.accept();
                    }
                }, 1000);
            }
        },
        validaInfo: function validaInfo() {
            var self = this;

            qxnw.utils.loading(self.tr("Procesando.."));
            var closeTimeOut = new qx.event.Timer(200);
            closeTimeOut.start();
            closeTimeOut.addListener("interval", function (a) {
                this.stop();
                qxnw.utils.stopLoading();
                var data = self.getRecord();
                console.log("data", data);
//                if (e.getKeyIdentifier() == "Enter") {
                if (qxnw.utils.evalueData(data.fecha_nacimiento)) {
                    var fecha = data.fecha_nacimiento;
                    console.log("fecha", fecha);
                    if (fecha !== "") {
                        fecha = fecha.split("-");
                        console.log("fecha", fecha);
                        if (fecha.length == "3") {
                            var fechas_det = fecha[0].split("");
                            var dia = fechas_det[0] + fechas_det[1];
                            var mes = fechas_det[2] + fechas_det[3];
                            var ano = fecha[1] + fecha[2];
                            var new_fecha = ano + "-" + mes + "-" + dia;
                            self.ui.fecha_nacimiento.setValue(new_fecha);
                        }
                    }
                }
                if (qxnw.utils.evalueData(data.primer_apellido)) {
                    var res = data.primer_apellido.split("");
                    console.log("res", res);
                    if (res[0] == "1" || res[0] == "2" || res[0] == "3" || res[0] == "4" || res[0] == "5" || res[0] == "6" || res[0] == "7" || res[0] == "8" || res[0] == "9" || res[0] == "0") {
                        var identi = data.identificacion + res[0];
                        self.ui.identificacion.setValue(identi.toString());
//                        var primero = res.shift();
                        res = res.join("");
                        self.ui.primer_apellido.setValue((res));
                    }
                }
//                }
                return;
            });
        }
    }
});