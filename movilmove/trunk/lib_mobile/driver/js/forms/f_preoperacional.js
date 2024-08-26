nw.Class.define("f_preoperacional", {
    extend: nw.forms,
    construct: function (parent, pr, callback, createInHome) {
        var self = this;
        if (createInHome) {
            self.canvas = "#foo";
            self.id_form = "f_preoperacional";
        } else {
            self.id = "f_preoperacional";
            self.setTitle = "<span style='color:#fff;'>" + nw.tr("Pre-operacional") + "</span>";
            self.html = "<div class='vehiculo'>" + nw.tr("Pre-operacional") + "</div>";
            self.showBack = true;
            self.closeBack = false;
            self.colorBtnBackIOS = "#ffffff;";
            self.styleCloseIOS = "color:#ffffff;color: rgb(255, 255, 255);background-color: transparent;border: 0;box-shadow:none;";
            self.createBase();
        }

        self.datos = pr;

        self.firma_fonductor_inspeccion = false;
        if (nw.evalueData(pr)) {
            if (nw.evalueData(pr.firma_fonductor_inspeccion)) {
                self.firma_fonductor_inspeccion = pr.firma_fonductor_inspeccion;
            }
        }
        self.parent = parent;
        self.callback = callback;
        self.configCliente = main.configCliente;
        self.datos_vehiculo = false;
        if (typeof main.vehiculo !== 'undefined') {
            self.datos_vehiculo = main.vehiculo;
        }

        var htmlsino = "<option value='NO'>NO</option><option value='SI'>SI</option>";
//        var type = "selectBox";
        var type = "switch";

        var fields = [
            {
                name: "marca",
                label: "Marca",
                type: 'textField',
                enabled: false
            },
            {
                name: "modelo",
                label: "Modelo",
                type: 'textField',
                enabled: false
            },
            {
                name: "tipo",
                label: "Tipo",
                type: 'textField',
                enabled: false
            },
            {
                name: "placa",
                label: "Placa",
                type: 'textField',
                enabled: false
            },
            {
                label: "LLantas",
                name: "contenedor_llantas",
                type: "startGroup"
            },
            {
                name: "id",
                label: "ID",
                placeholder: 'id',
                type: "textField",
                required: false,
                visible: false
            },
            {
                name: "presion",
                label: "Presión",
                type: type, options: htmlsino,
                required: true
            },
            {
                name: "labrado",
                label: "Labrado",
                type: type, options: htmlsino,
                required: true
            },
            {
                name: "tuercas_completas_aseguradas",
                label: "Tuercas completas y aseguradas",
                type: type, options: htmlsino,
                required: true
            },
            {
                label: "Frenos",
                name: "contenedor_frenos",
                type: "startGroup"
            },
            {
                name: "freno_parqueo_funciona",
                label: "Freno de parqueo funciona",
                type: type, options: htmlsino,
                required: true
            },
            {
                name: "frenos_funcionando",
                label: "Frenos funcionando",
                type: type, options: htmlsino,
                required: true
            },
            {
                name: "liquido_frenos_dentro_limites",
                label: "Líquido de frenos dentro de los límites",
                type: type, options: htmlsino,
                required: true
            },
            {
                type: "endGroup"
            },
            {
                label: "Luces",
                name: "contenedor_luces",
                type: "startGroup"
            },
            {
                name: "enciende_luz_reversa",
                label: "Enciende la luz de reversa",
                type: type, options: htmlsino,
                required: true
            },
            {
                name: "encienden_luces_bajas",
                label: "Encienden luces bajas",
                type: type, options: htmlsino,
                required: true
            },
            {
                name: "encienden_cocuyos",
                label: "Encienden cocuyos",
                type: type, options: htmlsino,
                required: true
            },
            {
                name: "encienden_luces_freno",
                label: "Encienden luces de freno",
                type: type, options: htmlsino,
                required: true
            },
            {
                name: "encienden_direccionales_atras_delante",
                label: "Encienden direccionales (adelante y atrás)",
                type: type, options: htmlsino,
                required: true
            },
            {
                type: "endGroup"
            },
            {
                label: "Indicadores del tablero",
                name: "contenedor_indicadores",
                type: "startGroup"
            },
            {
                name: "nivel_combustible",
                label: "Nivel de combustible",
                type: type, options: htmlsino,
                required: true
            },
            {
                name: "indicador_presion_aceite",
                label: "Indicador de presión de aceite",
                type: type, options: htmlsino,
                required: true
            },
            {
                name: "indicador_nivel_bateria",
                label: "Indicador nivel de batería",
                type: type, options: htmlsino,
                required: true
            },
            {
                type: "endGroup"
            },
            {
                label: "Condiciones de funcionamiento",
                name: "contenedor_indicadores",
                type: "startGroup"
            },
            {
                name: "espejos_retrovisores_funcionando",
                label: "Espejos retrovisores funcionando",
                type: type, options: htmlsino,
                required: true
            },
            {
                name: "todas_puertas_cierran_ajustan",
                label: "Todas las puertas cierran y ajustan",
                type: type, options: htmlsino,
                required: true
            },
            {
                name: "nivel_aceite_motor",
                label: "Nivel de aceite del motor",
                type: type, options: htmlsino,
                required: true
            },
            {
                name: "nivel_liquido_direccion",
                label: "Nivel del líquido de la dirección",
                type: type, options: htmlsino,
                required: true
            },
            {
                name: "nivel_liquido_refrigerante",
                label: "Nivel del líquido refrigerante",
                type: type, options: htmlsino,
                required: true
            },
            {
                name: "nivel_agua_limpiabrisas",
                label: "Nivel del agua del limpiabrisas",
                type: type, options: htmlsino,
                required: true
            },
            {
                name: "pito",
                label: "Pito",
                type: type, options: htmlsino,
                required: true
            },
            {
                name: "limpiabrisas_funcionando",
                label: "Limpiabrisas funcionando",
                type: type, options: htmlsino,
                required: true
            },
            {
                name: "radiador_tapa_ajustada",
                label: "Radiador con tapa ajustada",
                type: type, options: htmlsino,
                required: true
            },
            {
                name: "correa_ventilador_tensionada",
                label: "Correa del ventilador tensionada",
                type: type, options: htmlsino,
                required: true
            },
            {
                name: "bateria_sin_residuos",
                label: "Batería sin residuos",
                type: type, options: htmlsino,
                required: true
            },
            {
                type: "endGroup"
            },
            {
                label: "Silletería",
                name: "contenedor_silleteria",
                type: "startGroup"
            },
            {
                name: "ajuste_horizontal_sillas_delanteras",
                label: "Ajuste horizontal sillas delanteras",
                type: type, options: htmlsino,
                required: true
            },
            {
                name: "ajuste_vertical_sillas_delanteras",
                label: "Ajuste vertical sillas delanteras",
                type: type, options: htmlsino,
                required: true
            },
            {
                name: "tapizado_roturas_manchas",
                label: "Tapizado sin roturas o manchas",
                type: type, options: htmlsino,
                required: true
            },
            {
                name: "estado_salud_observaciones",
                label: "Indique su estado de salud. ¿Ha presentado en los últimos días fiebre, tos, gripe o alguna otra complicación?",
                type: 'textArea'
            },
            {
                name: "firma_fonductor_inspeccion",
                label: "Firma del Conductor que hace la Inspección",
//                type: "button",
//                mode: "camera_files",
                type: "signature",
                required: true,
                data: self.firma_fonductor_inspeccion
            },
            {
                name: "observaciones",
                label: "Observaciones",
                type: 'textArea'
            },
            {
                type: "endGroup"
            },
            {
                styleContainer: "margin:0;",
                label: "Documentos adicionales",
                name: "otros_documentos",
                type: "startGroup"
            },
            {
                style: "background: #ec7c7c; color: #fff;",
                name: "nuevo_documento",
                label: "Agregar documento en el preoperacional",
                type: "button"
            },
            {
                type: "endGroup"
            }
        ];
        self.setFields(fields);
        self.buttons = [
            {
                style: "border: 0;background-color:#1abbd7;color:#fff;margin:0px;",
                icon: "material-icons check_circle normal",
                colorBtnBackIOS: "#fff",
                position: "bottom",
                name: "aceptar btn_generic",
                label: "Guardar",
                callback: function () {
                    self.save();
                }
            }
        ];
        self.show();

        if (createInHome) {
            nw.utils.addClass(document.querySelector(self.canvas), "foo_preope");
        }

        if (self.datos_vehiculo) {
            self.ui.marca.setValue(self.datos_vehiculo.marca_text);
            self.ui.modelo.setValue(self.datos_vehiculo.modelo);
            self.ui.tipo.setValue(self.datos_vehiculo.tipo_vehiculo_text);
            self.ui.placa.setValue(self.datos_vehiculo.placa);
        }

        self.ui.nuevo_documento.addListener("click", function () {
            var d = new f_preoperacional_documento();
            d.construct(self);
        });

//        var data = {};
//        data[""] = "Seleccione";
//        data["SI"] = "SI";
//        data["NO"] = "NO";
//        self.ui.presion.populateSelectFromArray(data);
//        self.ui.labrado.populateSelectFromArray(data);
//        self.ui.tuercas_completas_aseguradas.populateSelectFromArray(data);
//        self.ui.freno_parqueo_funciona.populateSelectFromArray(data);
//        self.ui.frenos_funcionando.populateSelectFromArray(data);
//        self.ui.liquido_frenos_dentro_limites.populateSelectFromArray(data);
//        self.ui.enciende_luz_reversa.populateSelectFromArray(data);
//        self.ui.encienden_luces_bajas.populateSelectFromArray(data);
//        self.ui.encienden_cocuyos.populateSelectFromArray(data);
//        self.ui.encienden_luces_freno.populateSelectFromArray(data);
//        self.ui.encienden_direccionales_atras_delante.populateSelectFromArray(data);
//        self.ui.nivel_combustible.populateSelectFromArray(data);
//        self.ui.indicador_presion_aceite.populateSelectFromArray(data);
//        self.ui.indicador_nivel_bateria.populateSelectFromArray(data);
//        self.ui.espejos_retrovisores_funcionando.populateSelectFromArray(data);
//        self.ui.todas_puertas_cierran_ajustan.populateSelectFromArray(data);
//        self.ui.nivel_aceite_motor.populateSelectFromArray(data);
//        self.ui.nivel_liquido_direccion.populateSelectFromArray(data);
//        self.ui.nivel_liquido_refrigerante.populateSelectFromArray(data);
//        self.ui.nivel_agua_limpiabrisas.populateSelectFromArray(data);
//        self.ui.pito.populateSelectFromArray(data);
//        self.ui.limpiabrisas_funcionando.populateSelectFromArray(data);
//        self.ui.radiador_tapa_ajustada.populateSelectFromArray(data);
//        self.ui.correa_ventilador_tensionada.populateSelectFromArray(data);
//        self.ui.bateria_sin_residuos.populateSelectFromArray(data);
//        self.ui.ajuste_horizontal_sillas_delanteras.populateSelectFromArray(data);
//        self.ui.ajuste_vertical_sillas_delanteras.populateSelectFromArray(data);
//        self.ui.tapizado_roturas_manchas.populateSelectFromArray(data);

        self.createNavTableOtrosDocumentos();

    },
    destruct: function () {
    },
    members: {
        createNavTableOtrosDocumentos: function createNavTableOtrosDocumentos() {
            var self = this;
            var datos = self.datos;

            var canvas = self.canvas + " .otros_documentos";
            var nav = new l_navtable_preoperacional_otros_documentos();
            nav.construct(canvas, datos);
            self.navTable = nav;
        },
        save: function save() {
            var self = this;
            if (!self.validate()) {
                return false;
            }
//            nw.loading({text: "Guardando, por favor espere...", "container": self.canvas, css: "position: fixed;margin-left: -6.875em;margin-top: -2.6875em;top: 50%;left: 50%;"});
            var up = nw.userPolicies.getUserData();
            var data = self.getRecord(true);
            data.usuario = up.usuario;
            data.empresa = up.empresa;
            data.usuario_text = up.nombre;
            data.id_usuario = up.id_usuario;
            data.otros_documentos = self.navTable.getAllData();
            if (self.datos_vehiculo) {
                data.id_vehiculo = self.datos_vehiculo.id;
            } else {
                nw.dialog("sin datos del Vehículo");
                return;
            }
            if (typeof up.bodega === 'string') {
                if (up.bodega != "" && up.bodega != 'null') {
                    data.bodega = up.bodega;
                }
            }
            console.log("f_preoperacional:::sendData", data);
            var rpc = new nw.rpc(nw.getRpcUrl(), "preoperacional");
            rpc.setAsync(true);
            rpc.setLoading(true);
            var func = function (r) {
                console.log("f_preoperacional:::responseServer", r);
                nw.dialog("¡Guardado correctamente!", function () {
//                    nw.back();
                    if (nw.evalueData(self.callback)) {
                        self.callback(r);
                        return true;
                    }
                    if (nw.evalueData(self.parent)) {
                        self.parent.applyFilters();
                    }
                }, false, {original: true});

                if (nw.evalueData(self.callback)) {
                    setTimeout(function () {
                        nw.changePage("");
                        window.location.reload();
                    }, 2000);
                }
            };
            rpc.exec("savePreoperacional", data, func);
        },
        populate: function populate(pr) {
            var self = this;
            self.setRecord(pr);
        }
    }
});