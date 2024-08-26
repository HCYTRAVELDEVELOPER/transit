nw.Class.define("f_documentos_conductor", {
    extend: nw.forms,
    construct: function (pr, createInHomeSend) {
        var self = this;
        var createInHome = true;
        if (typeof createInHomeSend !== "undefined") {
            createInHome = createInHomeSend;
        }
        var f_documentos_conductor = false;
        if (createInHome === true) {
            f_documentos_conductor = "f_documentos_conductor_foo";
            self.canvas = "#foo";
            self.id_form = "f_documentos_conductor";
        } else {
            self.id = "f_documentos_conductor";
            self.setTitle = "";
            self.html = "<div class='vehiculo'>" + nw.tr("Documentos") + "</div>";
            self.showBack = true;
            self.closeBack = false;
            self.textClose = "Volver";
            self.colorBtnBackIOS = "#ffffff;";
            self.styleCloseIOS = "color:#ffffff;color: rgb(255, 255, 255);background-color: transparent;border: 0;box-shadow:none;";
            self.createBase();
        }
        self.actualizar = false;
        self.event = new Event('cancelservice');
        var up = nw.userPolicies.getUserData();
        var foto_perfil = false;
        var lic_conductor1 = false;
        var lic_conductor2 = false;
        var selfie_licencia = false;
        var hoja_vida = false;
        var documento_imagen = false;
        var antecedentes_judiciales = false;
        var documento_imagen_respaldo = false;
        var referencias_per_lab = false;
        var arl = false;
        var eps = false;
        var afp = false;
        var adjunto_rut_dat = false;
        if (nw.evalueData(pr)) {
            if (nw.evalueData(pr.foto_perfil)) {
                foto_perfil = pr.foto_perfil;
            }
            if (nw.evalueData(pr.lic_conductor1)) {
                lic_conductor1 = pr.lic_conductor1;
            }
            if (nw.evalueData(pr.lic_conductor2)) {
                lic_conductor2 = pr.lic_conductor2;
            }
            if (nw.evalueData(pr.selfie_licencia)) {
                selfie_licencia = pr.selfie_licencia;
            }
            if (nw.evalueData(pr.hoja_vida)) {
                hoja_vida = pr.hoja_vida;
            }
            if (nw.evalueData(pr.antecedentes_judiciales)) {
                antecedentes_judiciales = pr.antecedentes_judiciales;
            }
            if (nw.evalueData(pr.documento_imagen)) {
                documento_imagen = pr.documento_imagen;
            }
            if (nw.evalueData(pr.documento_imagen_respaldo)) {
                documento_imagen_respaldo = pr.documento_imagen_respaldo;
            }
            if (nw.evalueData(pr.referencias_per_lab)) {
                referencias_per_lab = pr.referencias_per_lab;
            }
            if (nw.evalueData(pr.arl)) {
                arl = pr.arl;
            }
            if (nw.evalueData(pr.eps)) {
                eps = pr.eps;
            }
            if (nw.evalueData(pr.afp)) {
                afp = pr.afp;
            }
            if (nw.evalueData(pr.adjunto_rut)) {
                adjunto_rut_dat = pr.adjunto_rut;
            }
        } else {
            if (!nw.evalueData(pr.foto_perfil)) {
                foto_perfil = up.foto_perfil;
            }
        }

        var fields = [
            {
                name: "title_enc",
                label: "<h5 class='titleencdocs'>" + nw.tr("Documentos de conducción") + "</h5>",
                        type: "html"
            },
            {
                name: "foto_perfil",
                label: "Foto de conductor",
                placeholder: 'Foto de conductor',
                type: "button",
                mode: "camera_files",
//                mode: "camera",
                quality: 25,
//                cameraWidth: "40", // en pixeles
//                cameraHeight: "40", // en pixeles
                allowEdit: false,
                data: foto_perfil,
                required: true,
                visible: true
            },
            {
                name: "tipo_doc",
                label: "Tipo de documento",
                placeholder: 'Tipo de documento',
                type: "selectBox",
//                required: true,
                visible: true
            },
            {
                name: "nit",
                label: "Número de documento",
                placeholder: 'Número de documento',
                type: "textField",
//                type: "numeric",
                car_min: "5",
                car_max: "25",
                required: true,
                visible: true
            },
            {
                name: "documento_imagen",
                label: "Imagen de documento",
                placeholder: "Imagen de documento",
                type: "button",
                mode: "camera_files",
                data: documento_imagen,
                required: true,
                visible: true
            },
            {
                name: "documento_imagen_respaldo",
                label: "Imagen de documento respaldo",
                placeholder: 'Imagen de documento respaldo',
                type: "button",
                mode: "camera_files",
                data: documento_imagen_respaldo
            },
            {
                name: "direccion_domicilio",
                label: "Dirección de domicilio",
                placeholder: 'Dirección de domicilio',
                type: "textField"
            },
            {
                name: "celular",
                label: "Número móvil celular",
                placeholder: 'Celular',
                type: "numeric"
            },
            {
                name: "afp",
                label: "Pensión",
                placeholder: 'Pensión',
                type: "button",
                mode: "camera_files",
                data: afp
            },
            {
                name: "eps",
                label: "EPS",
                placeholder: 'EPS',
                type: "button",
                mode: "camera_files",
                data: eps
            },
            {
                name: "arl",
                label: "ARL",
                placeholder: 'ARL',
                type: "button",
                mode: "camera_files",
                data: arl
            },
            {
                name: "referencias_per_lab",
                label: "Referencia personal y laboral",
                placeholder: 'Referencia personal y laboral',
                type: "button",
                mode: "camera_files",
                data: referencias_per_lab
            },
            {
                name: "no_licencia",
                label: "Licencia de conducción",
                placeholder: 'Licencia de conducción',
                type: "textField"
//                ,
//                type: "numeric",
//                car_min: "5",
//                car_max: "16"
            },
            {
                name: "categoria",
                label: "Categoría licencia",
                placeholder: 'Categoría licencia',
                type: "selectBox"
            },
            {
                name: "fecha_vencimiento",
                label: "Licencia fecha vencimiento",
                placeholder: 'Licencia fecha vencimiento',
                type: "dateField"
            },
            {
                name: "lic_conductor1",
                label: "Imagen de licencia frontal",
                placeholder: 'Imagen de licencia frontal',
                type: "button",
                mode: "camera_files",
                data: lic_conductor1
            },
            {
                name: "lic_conductor2",
                label: "Imagen de licencia trasera",
                placeholder: 'Imagen de licencia trasera',
                type: "button",
                mode: "camera_files",
                data: lic_conductor2
            },
            {
                name: "selfie_licencia",
                label: "Foto de conductor y licencia",
                placeholder: 'Foto de conductor y licencia',
                type: "button",
                mode: "camera_files",
                data: selfie_licencia
            },
            {
                name: "hoja_vida",
                label: "Hoja de vida",
                placeholder: 'Hoja de vida',
                type: "button",
                mode: "camera_files",
                data: hoja_vida
            },
            {
                name: "antecedentes_judiciales",
                label: "Antecedentes judiciales",
                placeholder: 'Antecedentes judiciales',
                type: "button",
                mode: "camera_files",
                data: antecedentes_judiciales
            },
            {
                name: "codigo_rut",
                label: "Código Rut",
                placeholder: 'Código Rut',
                type: "textField"
            },
            {
                name: "adjunto_rut",
                label: "Imagen Rut",
                placeholder: 'Imagen Rut',
                type: "button",
                mode: "camera_files",
                data: adjunto_rut_dat
            },
            {
                name: "capacitaciones",
                label: "Capacitaciones",
                type: 'switch',
                options: "<option value='false'>NO</option><option value='true'>SI</option>"
            },
            {
                styleContainer: "margin:0;",
                label: "Otros documentos",
                name: "adjuntos_html",
                type: "startGroup"
            },
            {
                style: "background: #ec7c7c; color: #fff;",
                name: "nuevo_documento",
                label: "Nuevo Documento",
                type: "button"
            },
            {
                type: "endGroup"
            }
        ];
        fields.push(
                {
                    name: "datos_contacto_emergencia",
                    label: "Nombre y número de contacto en caso de emergencia",
                    placeholder: '',
                    type: "textArea"
                }
        );
        self.setFields(main.labels(fields));
        self.buttons = [
            {
                style: "border: 0;background-color:#1abbd7;color:#fff;margin:0px;",
                icon: "material-icons check_circle normal",
                colorBtnBackIOS: "#fff",
                position: "top",
                name: "aceptar btn_generic btn_generic_aceptar_vehiculo",
                label: "Guardar",
                callback: function () {
                    if (!self.actualizar) {
                        self.save();
                    } else {
                        self.actualizarDocu();
                    }
                }
            }
        ];
        self.show();
        nw.addClass(document.querySelector(self.canvas), "f_documentos_conductor");
        if (nw.evalueData(f_documentos_conductor)) {
            nw.addClass(document.querySelector(self.canvas), f_documentos_conductor);
        }
//        if (main.configCliente.documento_imagen_respaldo != "SI") {
//            self.ui.documento_imagen_respaldo.setVisibility(false);
//        }
//        if (main.configCliente.direccion_domicilio != "SI") {
//            self.ui.direccion_domicilio.setVisibility(false);
//        }
//        if (main.configCliente.telefono != "SI") {
//            self.ui.celular.setVisibility(false);
//        }
//        if (main.configCliente.afp != "SI") {
//            self.ui.afp.setVisibility(false);
//        }
//        if (main.configCliente.eps != "SI") {
//            self.ui.eps.setVisibility(false);
//        }
//        if (main.configCliente.arl != "SI") {
//            self.ui.arl.setVisibility(false);
//        }
//        if (main.configCliente.referencias_per_lab != "SI") {
//            self.ui.referencias_per_lab.setVisibility(false);
//        }

        if (typeof main.configCliente.documentos_driver !== "undefined") {
            $.each(main.configCliente.documentos_driver, function (key, value) {
                if (key != "id") {
                    var vis = true;
                    if (value === "NO") {
                        vis = false;
                    }
                    if (typeof self.ui[key] !== "undefined") {
                        if (value === "SI_REQUIRED_FALSE") {
                            self.ui[key].setVisibility(true);
                            self.ui[key].setRequired(false);
                        } else {
                            self.ui[key].setVisibility(vis);
                            self.ui[key].setRequired(vis);
                        }
                    }
                }
            });
        }

        self.ui.nuevo_documento.addListener("click", function () {
            self.nuevoDocumento();
        });
//        self.onAppear(function () {
//            setTimeout(function () {
        self.ui.tipo_doc.populateSelectFromArray(main.tipoDoc());
        if (pr == false) {
            self.consultaDocu();
        } else {
            if (pr.estado_activacion == "1") {
                nw.utils.validateElementIfExist("#f_documentos_conductor .contentCenter", function (e) {
                    if (e) {
                        e.style.pointerEvents = "none";
                    }
                });
                nw.utils.validateElementIfExist("#f_documentos_conductor .btn_generic_aceptar_vehiculo", function (e) {
                    if (e) {
                        e.style.display = "none";
                    }
                });

            }
        }

        var t = {};
        t[""] = "Seleccione";
        t["A1"] = "A1";
        t["A2"] = "A2";
        t["B1"] = "B1";
        t["B2"] = "B2";
        t["B3"] = "B3";
        t["C1"] = "C1";
        t["C2"] = "C2";
        t["C3"] = "C3";
        self.ui.categoria.populateSelectFromArray(t);

        self.createNavTableOtrosDocumentos();
//            }, 100);
//        });
    },
    destruct: function () {
    },
    members: {
        nuevoDocumento: function nuevoDocumento() {
            var self = this;
            var fa = new nw.forms();
            fa.id = "generarFirma";
            fa.html = "<h1 style='text-align:center;'>Nuevo documento</h1><br />";
            fa.showBack = true;
            fa.createBase();
            var fields = [
                {
                    name: "nombre",
                    label: "Nombre",
                    type: "textField",
                    required: true
                },
                {
                    name: "adjunto",
                    label: "Adjunto",
                    type: "button",
                    mode: "camera_files",
                    required: true
                },
                {
                    name: "descripcion",
                    label: "Descripción Adjunto",
                    type: "textField"
                }
            ];
            fa.setFields(fields);
            fa.buttons = [
                {
                    style: "text-shadow: none;font-weight: lighter;border: 0;",
                    className: "btn_maxwidth",
                    name: "aceptar",
                    label: "Guardar",
                    callback: function () {
                        if (!fa.validate()) {
                            return false;
                        }
                        var up = nw.userPolicies.getUserData();
                        var data = fa.getRecord();
                        data.usuario = up.usuario;
                        data.conductor = up.usuario;
                        data.empresa = up.empresa;
                        data.usuario_text = up.nombre;
                        data.id_usuario = up.id_usuario;
                        var rpc = new nw.rpc(nw.getRpcUrl(), "vehiculo");
                        rpc.setAsync(true);
                        var func = function (r) {
                            nw.setUserInfo(r, function () {
                                self.navTable.applyFilters();
                                nw.back();
                            });
                        };
                        rpc.exec("saveOtrosDocumentosConductor", data, func);
                    }
                }
            ];
            fa.show();
        },
        createNavTableOtrosDocumentos: function createNavTableOtrosDocumentos() {
            var self = this;
            var datos = self.datos;
            console.log(datos);
            var canvas = "#f_documentos_conductor #adjuntos_html";
            var nav = new l_navtable_otros_documentos();
            nav.construct(canvas, datos);
            self.navTable = nav;
        },
        consultaDocu: function consultaDocu() {
            var self = this;
            var up = nw.userPolicies.getUserData();
            var data = self.getRecord(true);
            data.usuario = up.usuario;
            data.empresa = up.empresa;
            data.usuario_text = up.nombre;
            data.id_usuario = up.id_usuario;
            var rpc = new nw.rpc(nw.getRpcUrl(), "vehiculo");
            rpc.setAsync(true);
            var func = function (r) {
                console.log(r);
                self.populate(r);
            };
            rpc.exec("consultaDatosConductor", data, func);
        },
        actualizarDocu: function actualizarDocu() {
            var self = this;
            if (!self.validate()) {
                return false;
            }
            var up = nw.userPolicies.getUserData();
            var data = self.getRecord(true);
            data.usuario = up.usuario;
            data.empresa = up.empresa;
            data.usuario_text = up.nombre;
            data.id_usuario = up.id_usuario;
            var rpc = new nw.rpc(nw.getRpcUrl(), "vehiculo");
            rpc.setAsync(true);
            rpc.setLoading(true);
            var func = function (r) {
                nw.setUserInfo(r, function () {
                    window.location.reload();
                });
            };
            rpc.exec("actualizarDatosConductor", data, func);
        },
        save: function save() {
            var self = this;
            if (!self.validate()) {
                return false;
            }
            var up = nw.userPolicies.getUserData();
            var data = self.getRecord(true);
            data.usuario = up.usuario;
            data.empresa = up.empresa;
            data.usuario_text = up.nombre;
            data.id_usuario = up.id_usuario;
            var rpc = new nw.rpc(nw.getRpcUrl(), "vehiculo");
            rpc.setAsync(true);
            rpc.setLoading(true);
            var func = function (r) {
                nw.setUserInfo(r, function () {
                    window.location.reload();
                });
            };
            rpc.exec("saveDatosConductor", data, func);
        },
        populate: function populate(pr) {
            var self = this;
            var up = nw.userPolicies.getUserData();
            console.log("populatepopulatepopulate::::::::::::", up);
            if (!nw.evalueData(pr)) {
                pr = {};
            }
            if (!nw.evalueData(pr.nit)) {
                pr.nit = up.nit;
            }
            if (!nw.evalueData(pr.tipo_doc)) {
                pr.tipo_doc_tab = up.tipo_doc;
            }
            if (!nw.evalueData(pr.celular)) {
                pr.celular = up.celular;
            }
            console.log("populate::::::::::::::::::::::::::::::::::", pr);
            self.setRecord(pr);
            if (nw.evalueData(pr.tipo_doc_tab)) {
                self.ui.tipo_doc.setValue(pr.tipo_doc_tab);
            }
        }
    }
});