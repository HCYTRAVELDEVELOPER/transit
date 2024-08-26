qx.Class.define("transmovapp.forms.f_documentos_conductor", {
    extend: qxnw.forms,
    construct: function () {
        var self = this;
        this.base(arguments);
        this.setTitle(self.tr("Documentación Conductor/Motorizado"));
        this.createBase();
        var t = main.getConfiguracion();
        var visibleDocumen = true, visibleDireccio = true, visibleAfp = true, visibleEps = true, visibleArl = true, visibleReferenci = true, visibleHojaVid = true, visibleAntjudi = true;
        if (t.documento_imagen_respaldo != "SI") {
            visibleDocumen = false;
        }
        if (t.direccion_domicilio != "SI") {
            visibleDireccio = false;
        }
        if (t.afp != "SI") {
            visibleAfp = false;
        }
        if (t.eps != "SI") {
            visibleEps = false;
        }
        if (t.arl != "SI") {
            visibleArl = false;
        }
        if (t.referencias_per_lab != "SI") {
            visibleReferenci = false;
        }
        if (t.hoja_vida != "SI") {
            visibleHojaVid = false;
        }
        if (t.antecedentes != "SI") {
            visibleAntjudi = false;
        }
        var documento_label = "Imagen Documento Conductor";
        if (t.documento_imagen_respaldo == "SI") {
            documento_label = 'Imagen Documento Conductor Frontal';
        }
        var fields = [
            {
                name: "Fecha",
                type: "startGroup",
                icon: qxnw.config.execIcon("office-address-book", "apps"),
                mode: "horizontal"
            },
            {
                name: "id",
                label: self.tr("Id"),
                type: "textField",
                visible: false
            },
            {
                name: "id_conductor",
                label: self.tr("Id Conductor"),
                type: "textField",
                visible: false
            },
            {
                name: "fecha",
                label: self.tr("Fecha"),
                type: "dateField",
                visible: false,
                required: true
            },
            {
                name: "",
                type: "endGroup"
            },
            {
                name: "Documentos",
                type: "startGroup",
                icon: qxnw.config.execIcon("office-address-book", "apps"),
                mode: "grid"
            },
            {
                name: "documento_imagen",
                label: self.tr(documento_label),
                type: "uploader",
                required: true,
                row: 0,
                column: 0
            },
            {
                name: "lic_conductor1",
                label: self.tr("Licencia Conductor Frontal"),
                type: "uploader",
                required: true,
                row: 0,
                column: 1
            },
            {
                name: "lic_conductor2",
                label: self.tr("Licencia Conductor Trasera"),
                type: "uploader",
                required: true,
                row: 0,
                column: 2
            },
            {
                name: "selfie_licencia",
                label: self.tr("Foto conductor y Licencia"),
                type: "uploader",
                required: true,
                row: 1,
                column: 0
            },
            {
                name: "hoja_vida",
                label: self.tr("Hoja de Vida"),
                type: "uploader",
                visible: visibleHojaVid,
                row: 1,
                column: 1
            },
            {
                name: "documento_imagen_respaldo",
                label: self.tr("Imagen Documento Conductor Respaldo"),
                type: "uploader",
                visible: visibleDocumen,
                row: 1,
                column: 2
            },
            {
                name: "direccion_domicilio",
                label: self.tr("Dirección de domicilio"),
                type: "textField",
                visible: visibleDireccio,
                row: 2,
                column: 0
            },
            {
                name: "afp",
                label: self.tr("AFP"),
                type: "uploader",
                visible: visibleAfp,
                row: 2,
                column: 1
            },
            {
                name: "eps",
                label: self.tr("EPS"),
                type: "uploader",
                visible: visibleEps,
                row: 2,
                column: 2
            },
            {
                name: "arl",
                label: self.tr("ARL"),
                type: "uploader",
                visible: visibleArl,
                row: 3,
                column: 0
            },
            {
                name: "referencias_per_lab",
                label: self.tr("Referencia personal y laboral"),
                type: "uploader",
                visible: visibleReferenci,
                row: 3,
                column: 1
            },
            {
                name: "antecedentes_judiciales",
                label: self.tr("Antecedentes Judicial"),
                type: "uploader",
                visible: visibleAntjudi,
                row: 4,
                column: 0
            },
//            {
//                name: "ver_comparendos",
//                label: self.tr("Verificación Comparendos"),
//                type: "uploader",
//                row: 2,
//                column: 0
//            },
            {
                name: "",
                type: "endGroup"
            },
            {
                name: "Documentos Adicionales",
                type: "startGroup",
                icon: qxnw.config.execIcon("office-address-book", "apps"),
                mode: "horizontal"
            },
            {
                name: "examen_medico",
                label: self.tr("Examen Medico"),
                type: "uploader"
            },
            {
                name: "licencia_conduccion",
                label: self.tr("Licencia Conducción"),
                type: "uploader"
            },
            {
                name: "",
                type: "endGroup"
            },
            {
                name: "documentos2",
                type: "startGroup",
                icon: qxnw.config.execIcon("office-address-book", "apps"),
                mode: "horizontal"
            },
            {
                name: "certificacion_licencia",
                label: self.tr("Certificación Licencia"),
                type: "uploader"
            },
            {
                name: "examen_alcohol",
                label: self.tr("Examen Alcohol/Drogas"),
                type: "uploader"
            },
            {
                name: "adjunto_uno",
                label: self.tr("Adjunto 1"),
                type: "uploader"
            },
            {
                name: "",
                type: "endGroup"
            },
            {
                name: "Autorizacion de Ingreso",
                type: "startGroup",
                icon: qxnw.config.execIcon("office-address-book", "apps"),
                mode: "grid"
            },
            {
                name: "estado_registro",
                label: self.tr("Estado Registro"),
                type: "selectBox",
                row: 0,
                column: 0
            },
            {
                name: "fecha_ver_doc",
                label: self.tr("Fecha Verificación Doc"),
                type: "dateField",
                row: 0,
                column: 1
            },
            {
                name: "observaciones",
                label: self.tr("Observaciones"),
                type: "textArea",
                mode: "colSpan:2.upperCase",
                row: 1,
                column: 0
            },
            {
                name: "",
                type: "endGroup"
            }
        ];
        self.setFields(main.labels(fields));
        self.setGroupVisibility("autorizacion_de_ingreso", "excluded");
        self.setGroupVisibility("documentos_adicionales", "excluded");
        self.ui.fecha.setValue(new Date());

        if (t.documentos_adic != "NO") {
            self.setGroupVisibility("documentos2", "excluded");
//            self.setFieldVisibility(self.ui.examen_medico , "excluded");
        }
        var t = {};
        t[""] = self.tr("Seleccione");
        qxnw.utils.populateSelectFromArray(self.ui.estado_registro, t);

        t = {};
        t.table = "estados_registro";
        qxnw.utils.populateSelect(self.ui.estado_registro, "master", "populate", t);


        self.ui.accept.addListener("execute", function () {
            if (!self.validate()) {
                return;
            }
            self.accept();
        });

        self.ui.cancel.addListener("execute", function () {
            self.reject();
        });

    },
    destruct: function () {
    },
    members: {
        __total: null,
        navTable: null,
        __addButon: null,
        __removeButton: null,
        contextMenu: function contextMenu(pos) {
        },
//        slotSave: function slotSave() {
//            var self = this;
//            var data = self.getRecord();
//            if (func != false) {
//                var rpc = new qxnw.rpc(self.getRpcUrl(), "vehiculos", true);
//                var func = function (r) {
//                    if (qxnw.utils.evalue(r)) {
//                        self.ui.id.setValue(r.toString());
//                        qxnw.utils.information("Datos guardados correctamente!");
//                        self.accept();
//                    }
//                };
//                rpc.exec("saveAdjuntos", data, func);
//            }
//        },
        setParamRecord: function setParamRecord(pr) {
            var self = this;
//            console.log(pr);
            self.setRecord(pr);
            return true;
        }

    }
});
