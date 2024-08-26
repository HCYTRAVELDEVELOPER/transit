qx.Class.define("transmovapp.forms.f_conductor", {
    extend: qxnw.forms,
    construct: function (datos, datosConductor) {
        var self = this;
        self.base(arguments);
        self.editar = false;
        self.datosConductor = datosConductor;
        console.log("self.datosConductor", self.datosConductor);
        self.configCliente = main.getConfiguracion();
        self.perms = main.getPermiserv();
        if (!qxnw.utils.evalueData(self.perms)) {
            self.perms = {};
        }

        self.setTitle(self.tr("Agregar/Editar Conductor:: MovilMove"));
        self.createBase();
        var up = qxnw.userPolicies.getUserData();
        var fields = [
            {
                name: self.tr("Datos Basicos"),
                type: "startGroup",
                mode: "grid"
            },
            {
                name: "id",
                label: self.tr("Id"),
                type: "textField",
                visible: false
            },
            {
                name: "foto_perfil",
                label: self.tr("Foto Conductor"),
                type: "camera",
                mode: "rowSpan: 6",
                row: 0,
                column: 0
            },
            {
                name: "tipo_doc",
                label: self.tr("Tipo Documento"),
                type: "selectBox",

                row: 0,
                column: 1
            },
            {
                name: "nit",
                label: self.tr("N° Documento"),
                type: "textField",
//                mode: "integer.maxCharacteres:20",

                row: 0,
                column: 2
            },
            {
                name: "nombre",
                label: self.tr("Nombre"),
                type: "textField",

                row: 1,
                column: 1
            },
            {
                name: "apellido",
                label: self.tr("Apellidos"),
                type: "textField",

                row: 1,
                column: 2
            },
            {
                name: "email",
                label: self.tr("Email / Usuario"),
                type: "textField",

                mode: "email",
                row: 1,
                column: 3
            },
            {
                name: "genero",
                label: self.tr("Género"),
                type: "selectBox",

                row: 2,
                column: 1
            },
            {
                name: "celular",
                label: self.tr("Celular"),
                type: "textField",

//                mode: "integer.maxCharacteres:10",
                row: 2,
                column: 2
            },
            {
                name: "contrato",
                label: self.tr("Contrato"),
                type: "uploader",
//                
                row: 2,
                column: 3
            },
            {
                name: "no_licencia",
                label: self.tr("N° Licencia"),
                type: "textField",
//                
                row: 3,
                column: 1
            },
            {
                name: "fecha_vencimiento",
                label: self.tr("Fecha Vencimiento"),
                type: "dateField",
//                
                row: 3,
                column: 2
            },
            {
                name: "activar_servicios",
                label: self.tr("Servicios activos"),
                type: "selectListCheck",

                row: 3,
                column: 3

            },
            {
                name: "estado_activacion",
                label: self.tr("Estado Activación"),
                type: "selectBox",

                row: 4,
                column: 1
            },
            {
                name: "subservicio",
                label: self.tr("Subservicio"),
                type: "selectListCheck",
                row: 4,
                column: 2
            },
            {
                name: "perfil",
                label: self.tr("Perfil"),
                type: "selectBox",

                row: 4,
                column: 3
            },
            {
                name: "clave",
                label: self.tr("Contraseña"),
                type: "passwordField",

                row: 4,
                column: 4
            },
            {
                name: "bodega",
                label: self.tr("Flota (opcional)"),
                type: "selectBox",

                row: 5,
                column: 1
            },
            {
                name: "terminal",
                label: self.tr("Terminal"),
                type: "selectBox",

                row: 5,
                column: 2
            },
            {
                name: "pais",
                label: self.tr("País"),
                type: "selectBox",

                row: 5,
                column: 3
            },
            {
                name: "ciudad",
                label: self.tr("Ciudad"),
                type: "selectBox",

                row: 5,
                column: 4
            },
            {
                name: "capacitaciones",
                label: self.tr("Capacitaciones"),
                type: "checkBox",
                row: 6,
                column: 0
            },
            {
                name: "categoria",
                label: self.tr("Categoría licencia"),
                type: "selectBox",

                row: 6,
                column: 1
            },
            {
                name: "",
                type: "endGroup"
            }
        ];
        self.setFields(main.labels(fields));

        if (datos) {
            var conf = datos;
        } else {
            var t = main.getConfiguracion();
            var conf = t;
            self.t = t;
        }

        self.__conf = main.getConfiguracion();

        console.log("self.__conf.documentos_driver", self.__conf.documentos_driver);
        if (typeof self.__conf.documentos_driver !== "undefined") {
            for (var key in self.__conf.documentos_driver) {
                var value = self.__conf.documentos_driver[key];
                if (key != "id") {
                    var vis = "visible";
                    var red = true;
                    if (value === "NO") {
                        vis = "excluded";
                        red = false;
                    }
                    if (typeof self.ui[key] !== "undefined") {
                        if (value === "SI_REQUIRED_FALSE") {
                            self.setFieldVisibility(self.ui[key], "visible");
                            self.setRequired(key, false);
                        } else {
                            self.setFieldVisibility(self.ui[key], vis);
                            self.setRequired(key, red);
                        }
                    }
                }
            }
        }

        self.setFieldVisibility(self.ui.email, "visible");
        self.setRequired("email", true);

        self.setFieldVisibility(self.ui.clave, "visible");
        self.setRequired("clave", true);

        self.setFieldVisibility(self.ui.pais, "visible");
        self.setRequired("pais", true);

        self.setFieldVisibility(self.ui.ciudad, "visible");
        self.setRequired("ciudad", true);

        self.setFieldVisibility(self.ui.activar_servicios, "visible");
        self.setRequired("activar_servicios", true);

        self.setFieldVisibility(self.ui.estado_activacion, "visible");
        self.setRequired("estado_activacion", true);

        var t = {};
        t[0] = self.tr("Seleccione");
        t[1] = self.tr("Activo");
        t[2] = self.tr("Inactivo");
        t[3] = self.tr("Pre-Registrado");
        qxnw.utils.populateSelectFromArray(self.ui.estado_activacion, t);

        var data = {};
        data[""] = self.tr("Seleccione");
        data["CC"] = self.tr("Cédula de ciudadanía");
        data["CE"] = self.tr("Cédula de extranjería");
        data["NI"] = self.tr("Nit");
        data["PP"] = self.tr("Pasaporte");

        console.log("self.configCliente", self.configCliente);
        console.log("self.configCliente.tipo_documentos", self.configCliente.tipo_documentos);
        if (qxnw.utils.evalueData(self.configCliente.tipo_documentos)) {
            data = JSON.parse(self.configCliente.tipo_documentos);
        }
        console.log("tipo_do:::data", data);
        qxnw.utils.populateSelectFromArray(self.ui.tipo_doc, data);

        var data = {};
        data[""] = self.tr("Seleccione");
        qxnw.utils.populateSelectFromArray(self.ui.ciudad, data);
        qxnw.utils.populateSelectFromArray(self.ui.pais, data);
        qxnw.utils.populateSelectFromArray(self.ui.bodega, data);
        qxnw.utils.populateSelectFromArray(self.ui.terminal, data);
        qxnw.utils.populateSelectFromArray(self.ui.perfil, data);

        var t = {};
        t.table = "edo_empresas";
        t.where = " tipo_empresa='Flota'";
        qxnw.utils.populateSelect(self.ui.bodega, "master", "populate", t);



        var t = {};
        qxnw.utils.populateSelect(self.ui.pais, "servicios_admin", "consultaPaises", t);
//        if (qxnw.utils.evalueData(up.pais)) {
//            self.ui.pais.setValue(up.pais);
//        }

        self.ui.pais.addListener("changeSelection", function () {
            var data = self.getRecord();
            console.log("data", data);
            var pais = data.pais;
            if (qxnw.utils.evalueData(!pais)) {
                return false;
            }
            self.populateCiudad(pais);
        });
//        var t = {};
//        qxnw.utils.populateSelect(self.ui.ciudad, "servicios_admin", "consultaCiudades", t);


        var t = {};
        t.table = "terminales";
        t.where = " empresa=" + up.company;
        qxnw.utils.populateSelect(self.ui.terminal, "master", "populate", t);

        var t = {};
        t[""] = self.tr("Seleccione");
        t["A1"] = self.tr("A1");
        t["A2"] = self.tr("A2");
        t["B1"] = self.tr("B1");
        t["B2"] = self.tr("B2");
        t["B3"] = self.tr("B3");
        t["C1"] = self.tr("C1");
        t["C2"] = self.tr("C2");
        t["C3"] = self.tr("C3");
        qxnw.utils.populateSelectFromArray(self.ui.categoria, t);

        var t = {};
        t.table = "nwmaker_perfiles";
        qxnw.utils.populateSelect(self.ui.perfil, "master", "populate", t);
        self.ui.perfil.setValue(2);
        self.ui.perfil.setEnabled(false);

        var data = {};
        data[""] = self.tr("Seleccione");
        data["hombre"] = self.tr("Masculino");
        data["mujer"] = self.tr("Femenino");
        data["otro"] = self.tr("Otro");
        qxnw.utils.populateSelectFromArray(self.ui.genero, data);

        var data = {};
        data.table = "edo_subservice";
        self.ui.subservicio.populate("master", "populate", data);

        self.ui.perfil.addListener("changeSelection", function () {
            var data = self.getRecord();
            if (data.perfil == "") {
                self.ui.nit.setValue("");
                self.ui.nit.setEnabled(false);
            } else {
                self.ui.nit.setValue("");
                self.ui.nit.setEnabled(true);
            }
        });
        self.ui.email.addListener("focusout", function (e) {
            var dato = self.ui.email.getValue();
            if (!dato) {
                return;
            }
            var rpc = new qxnw.rpc(self.getRpcUrl(), "conductores", true);
            var func = function (r) {
                if (r) {
                    qxnw.utils.information(self.tr("El email ya se encuentra registrado, Valide por favor"));
                    self.ui.email.setValue("");
                }
            };
            rpc.exec("verificar", dato, func);
        });

        self.ui.nit.addListener("focusout", function (e) {
            self.slotFindID();
        });
        self.ui.nit.addListener("keypress", function (e) {
            if (e.getKeyIdentifier() == "Enter") {
                self.slotFindID();
            }
        });
        self.ui.activar_servicios.populate("servicios_admin", "populateTokenTipoServicio");
        self.ui.accept.addListener("execute", function () {
            if (!self.validate()) {
                return;
            }
            self.slotSave();
        });
        self.ui.cancel.addListener("execute", function () {
            self.reject();
        });
        self.configuracion(conf);
        self.slotArchivos(conf);
        self.slotComparendos(conf);

        console.log("self.perms", self.perms);
        console.log("up", up);
        console.log("up.bodega", up.bodega);
        if (self.perms.form_conductor_flota == "false" || self.perms.form_conductor_flota == false) {
            self.ui.bodega.setEnabled(false);
            if (qxnw.utils.evalueData(up.bodega)) {
                self.ui.bodega.setValue(up.bodega);
            }
        }

    },
    destruct: function () {
    },
    members: {
        __total: null,
        navTable: null,
        __addButon: null,
        __removeButton: null,
        populateCiudad: function populateCiudad(pais) {
            var self = this;
            self.ui.ciudad.removeAll();

            var ds = {};
            ds[""] = self.tr("Seleccione");
            qxnw.utils.populateSelectFromArray(self.ui.ciudad, ds);

            var t = {};
            if (qxnw.utils.evalueData(pais)) {
                t.pais = pais;
            }
            qxnw.utils.populateSelect(self.ui.ciudad, "servicios_admin", "consultaCiudades", t);
        },
        slotVerAdjunto: function slotVerAdjunto() {
            var self = this;
            var sl = self.navTableDoc.selectedRecord();
            var win = window.open(sl.adjunto, '_blank');
            win.focus();
        },
        slotComparendos: function slotComparendos(pr) {
            var self = this;
            var up = qxnw.userPolicies.getUserData();
            self.navTableComparendos = new qxnw.lists();
            self.navTableComparendos.createBase();
            var columns = [
                {
                    label: self.tr("ID"),
                    caption: "id"

                },
                {
                    label: self.tr("Evidencia"),
                    caption: "adjunto_img",
                    type: "html"
                },
                {
                    label: self.tr("Evidencia Adjunto"),
                    caption: "adjunto",
                    type: "image"
                },
                {
                    label: self.tr("Numero de comparendo"),
                    caption: "numero_comparendo"
                },
                {
                    label: self.tr("Vehículo id"),
                    caption: "vehiculo"
                },
                {
                    label: self.tr("Vehículo"),
                    caption: "vehiculo_text"
                },
                {
                    label: self.tr("Observación"),
                    caption: "observacion"
                },
                {
                    label: self.tr("Fecha comparendo"),
                    caption: "fecha_comparendo"
                },
                {
                    label: self.tr("Usuario"),
                    caption: "usuario"
                }
            ];
            self.navTableComparendos.setColumns(columns);
            self.navTableComparendos.hideColumn("id");
            self.navTableComparendos.hideColumn("adjunto");
            self.navTableComparendos.hideColumn("vehiculo");
            self.navTableComparendos.hideColumn("usuario");
            self.navTableComparendos.setMaxWidth(600);
            self.navTableComparendos.setMinWidth(600);
            self.navTableComparendos.hideFooterTools();
            self.navTableComparendos.ui.updateButton.setVisibility("excluded");
            self.navTableComparendos.ui.editButton.setVisibility("excluded");
            self.navTableComparendos.ui.part3.setVisibility("excluded");
            self.navTableComparendos.ui.part4.setVisibility("excluded");
            self.navTableComparendos.table.setRowHeight(50);

            self.navTableComparendos.ui.deleteButton.addListener("click", function () {
                var datas = self.navTableComparendos.selectedRecord();
                qxnw.utils.question("¿Esta seguro de eliminar este comparendo?", function (e) {
                    if (e) {
                        self.navTableComparendos.removeSelectedRow();
                    }
                })
            });
            self.navTableComparendos.ui.newButton.addListener("click", function () {
//                if (typeof up.bodega == "string") {
                var d = new qxnw.forms();
                var fields = [
                    {
                        name: self.tr("Datos documento"),
                        type: "startGroup",
                        icon: qxnw.config.execIcon("office-address-book", "apps"),
                        mode: "horizontal"
                    },
                    {
                        name: "id",
                        label: "ID",
                        type: "textField",
                        visible: false
                    },
                    {
                        name: "adjunto",
                        label: self.tr("Adjunto"),
                        type: "uploader",
                        mode: "rename"
                    },
                    {
                        name: "",
                        type: "endGroup"
                    },
                    {
                        name: self.tr(""),
                        type: "startGroup",
                        mode: "vertical"
                    },
                    {
                        name: "numero_comparendo",
                        label: self.tr("Numero comparendo"),
                        type: "textField",
                        required: true
                    },
                    {
                        name: "",
                        type: "endGroup"
                    },
                    {
                        name: self.tr(""),
                        type: "startGroup",
                        mode: "vertical"
                    },
                    {
                        name: "vehiculo",
                        label: self.tr("Vehículo"),
                        type: "selectBox",
                        required: true
                    },
                    {
                        name: "",
                        type: "endGroup"
                    },
                    {
                        name: self.tr(""),
                        type: "startGroup",
                        mode: "vertical"
                    },
                    {
                        name: "observacion",
                        label: self.tr("Observacion"),
                        type: "textField"
                    },
                    {
                        name: "fecha_comparendo",
                        label: self.tr("Fecha comparendo"),
                        type: "dateField"
                    },
                    {
                        name: "",
                        type: "endGroup"
                    }
                ];
                d.setFields(fields);

                var data = {};
                data[""] = self.tr("Seleccione");
                qxnw.utils.populateSelectFromArray(d.ui.vehiculo, data);
                var t = {};
                qxnw.utils.populateSelect(d.ui.vehiculo, "conductores", "populateVehiculos", t);

                d.ui.cancel.addListener("execute", function () {
                    d.reject();
                });
                d.ui.accept.addListener("execute", function () {
                    if (!d.validate()) {
                        return;
                    }
                    var data = d.getRecord();
                    data.adjunto_img = self.traerExten(data.adjunto);
                    self.navTableComparendos.addRows([data]);
                    d.reject();
                });
                d.setModal(true);
                d.show();
            });
            self.navTableComparendos.slotVerAdjunto = function () {
                var sl = self.navTableComparendos.selectedRecord();
                var win = window.open(sl.adjunto, '_blank');
                win.focus();
            }
            self.navTableComparendos.applyFilters = function () {
                var datos = self.getRecord();
                var data = {};
                data.conductor = datos.email;
                var rpc = new qxnw.rpc(self.getRpcUrl(), "conductores");
                rpc.setAsync(true);
                var func = function (r) {
                    console.log(r);
                    for (var i = 0; i < r.length; i++) {
                        var response = r[i].adjunto;
                        var adjunto_img = self.traerExten(response);
                        r[i].adjunto_img = adjunto_img;
                        r[i].eliminar = "icon/16/actions/dialog-close.png";

                    }
                    self.navTableComparendos.setModelData(r);
                };
                rpc.exec("consultaComparendos", data, func);
            };
            self.traerExten = function (response) {
                if (response) {
                    var ext = qxnw.utils.getExtension(response);
                } else {
                    var ext = "ninguno";
                }
                var adjunto_img = "";
                switch (ext) {
                    case "doc":
                        adjunto_img = "<div><img class='imgdoc' src='/nwlib6/icons/48/word.png'></div>";
                        break;
                    case "docx":
                        adjunto_img = "<div><img class='imgdoc' src='/nwlib6/icons/48/word.png'></div>";
                        break;
                    case "pdf":
                        adjunto_img = "<div><img class='imgdoc' src='/nwlib6/icons/48/pdf.png'></div>";
                        break;
                    case "XLSX":
                        adjunto_img = "<div><img class='imgdoc' src='/nwlib6/icons/48/excel.png'></div>";
                        break;
                    case "xlsx":
                        adjunto_img = "<div><img class='imgdoc' src='/nwlib6/icons/48/excel.png'></div>";
                        break;
                    case "pptx":
                        adjunto_img = "<div><img class='imgdoc' src='/nwlib6/icons/48/PowerPoint-icon.png'></div>";
                        break;
                    default:
                        adjunto_img = "<div><img class='imgdoc' src='/nwlib6/icons/48/image.png'></div>";
                        break;
                }
                return adjunto_img;
            }

            self.navTableComparendos.table.addListener("cellTap", function (e) {
                var col = e.getColumn();
                var data = self.navTableComparendos.selectedRecord();
                var up = qxnw.userPolicies.getUserData();
                if (col == 1) {
                    self.navTableComparendos.slotVerAdjunto();
                }
            });
            self.navTableComparendos.applyFilters();
            self.insertNavTable(self.navTableComparendos.getBase(), self.tr("Comparendos"));
        },
        slotArchivos: function slotArchivos(pr) {
            var self = this;
            var up = qxnw.userPolicies.getUserData();
            self.navTableAdjuntos = new qxnw.lists();
            self.navTableAdjuntos.createBase();
            var columns = [
                {
                    label: self.tr("ID"),
                    caption: "id"

                },
                {
                    label: self.tr("Documento"),
                    caption: "adjunto_img",
                    type: "html"
                },
                {
                    label: self.tr("Documento Adjunto"),
                    caption: "adjunto",
                    type: "image"
                },
                {
                    label: self.tr("Nombre Documento"),
                    caption: "nombre"
                },
                {
                    label: self.tr("Descripción"),
                    caption: "descripcion"
                },
                {
                    label: self.tr("Fecha"),
                    caption: "fecha"
                },
                {
                    label: self.tr("Usuario"),
                    caption: "usuario"
                }
            ];
            self.navTableAdjuntos.setColumns(columns);
            self.navTableAdjuntos.hideColumn("id");
            self.navTableAdjuntos.hideColumn("adjunto");
            self.navTableAdjuntos.setMaxWidth(600);
            self.navTableAdjuntos.setMinWidth(600);
            self.navTableAdjuntos.hideFooterTools();
            self.navTableAdjuntos.ui.updateButton.setVisibility("excluded");
            self.navTableAdjuntos.ui.editButton.setVisibility("excluded");
            self.navTableAdjuntos.ui.part3.setVisibility("excluded");
            self.navTableAdjuntos.ui.part4.setVisibility("excluded");
            self.navTableAdjuntos.table.setRowHeight(50);

            self.navTableAdjuntos.ui.deleteButton.addListener("click", function () {
                var datas = self.navTableAdjuntos.selectedRecord();
                if (!datas) {
                    qxnw.utils.information(self.tr("Seleccione Un registro por favor"));
                    return;
                }
                qxnw.utils.question("¿Esta seguro de eliminar este documento?", function (e) {
                    if (e) {
                        self.navTableAdjuntos.removeSelectedRow();
                    }
                })
            });
            self.navTableAdjuntos.ui.newButton.addListener("click", function () {
//                if (typeof up.bodega == "string") {
                var d = new qxnw.forms();
                var fields = [
                    {
                        name: self.tr("Datos documento"),
                        type: "startGroup",
                        icon: qxnw.config.execIcon("office-address-book", "apps"),
                        mode: "horizontal"
                    },
                    {
                        name: "id",
                        label: "ID",
                        type: "textField",
                        visible: false
                    },
                    {
                        name: "nombre",
                        label: self.tr("Nombre Documento"),
                        type: "textField",
                        required: true
                    },
                    {
                        name: "",
                        type: "endGroup"
                    },
                    {
                        name: self.tr(""),
                        type: "startGroup",
                        mode: "vertical"
                    },
                    {
                        name: "adjunto",
                        label: self.tr("Adjunto"),
                        type: "uploader",
                        mode: "rename",
                        required: true
                    },
                    {
                        name: "descripcion",
                        label: self.tr("Descripción Adjunto"),
                        type: "textArea"
                    },
                    {
                        name: "",
                        type: "endGroup"
                    }
                ];
                d.setFields(fields);

                d.ui.cancel.addListener("execute", function () {
                    d.reject();
                });
                d.ui.accept.addListener("execute", function () {
                    if (!d.validate()) {
                        return;
                    }
                    var data = d.getRecord();
                    data.adjunto_img = self.traerExten(data.adjunto);
                    self.navTableAdjuntos.addRows([data]);
                    d.reject();
                });
                d.setModal(true);
                d.show();
            });
            self.navTableAdjuntos.slotVerAdjunto = function () {
                var sl = self.navTableAdjuntos.selectedRecord();
                var win = window.open(sl.adjunto, '_blank');
                win.focus();
            };
            self.navTableAdjuntos.applyFilters = function () {
//                var datos = self.getRecord();
                var datos = self.datosConductor;
                console.log("f_conductor:::applyFilters:::datos", datos);
                console.log("self.datosConductor", self.datosConductor);
//                var data = {};
//                data.conductor = datos.email;
//                console.log("f_conductor:::applyFilters:::data", data);
                var rpc = new qxnw.rpc(self.getRpcUrl(), "conductores");
                rpc.setAsync(true);
                var func = function (r) {
                    console.log("f_conductor:::applyFilters:::responseServer", r);
                    for (var i = 0; i < r.length; i++) {
                        var response = r[i].adjunto;
                        var adjunto_img = self.traerExten(response);
                        r[i].adjunto_img = adjunto_img;
                        r[i].eliminar = "icon/16/actions/dialog-close.png";
                    }
                    self.navTableAdjuntos.setModelData(r);
                };
                rpc.exec("consultaDocumentosOtros", datos, func);
            };
            self.navTableAdjuntos.table.addListener("cellTap", function (e) {
                var col = e.getColumn();
                var data = self.navTableAdjuntos.selectedRecord();
                var up = qxnw.userPolicies.getUserData();
                if (col == 1) {
                    self.navTableAdjuntos.slotVerAdjunto();
                }
            });
            self.insertNavTable(self.navTableAdjuntos.getBase(), self.tr("Otros Documentos"));
            self.navTableAdjuntos.applyFilters();
//            self.navTableAdjuntos.show();
        },
        contextVerificacionDocumentos: function contextVerificacionDocumentos(pos) {
            var self = this;
            var r = self.navTableDoc.selectedRecord();
            var m = new qxnw.contextmenu(self);
            m.addAction("Verificar Documentos", qxnw.config.execIcon("document-properties"), function (e) {
                self.slotEditarDocumentos(r);
            });
            m.setParentWidget(self.navTableDoc);
            m.exec(pos);
        },
        slotEditarDocumentos: function slotEditarDocumentos(pr) {
            var self = this;
            if (!pr) {
                qxnw.utils.information(self.tr("Seleccione Un registro por favor"));
                return;
            }
            var d = new transmovapp.forms.f_documentos_conductor;
            d.setParamRecord(pr);
            d.settings.accept = function () {
                self.navTableDoc.removeSelectedRow();
                var data = d.getRecord();
                self.navTableDoc.addRows([data]);
            };
//            d.setRequired("estado_registro", true);
//            d.setRequired("fecha_ver_doc", true);
//            d.setRequired("observaciones", true);
            d.setModal(true);
            d.show();
        },
        slotSave: function slotSave() {
            var self = this;
            if (!self.validate()) {
                return;
            }
            var data = self.getRecord();
            data.subservicio = JSON.stringify(data.subservicio);
            data.domain_rpc = window.origin;
            data.activar_servicios = JSON.stringify(data.activar_servicios);
            data.documentos_conductor = self.navTableDoc.getAllData();
            data.comparendos = self.navTableComparendos.getAllData();
            data.otros_documentos = self.navTableAdjuntos.getAllData();
            console.log("f_conductor:::slotSave::sendData", data);
            var rpc = new qxnw.rpc(self.getRpcUrl(), "conductores", true);
            var func = function (r) {
                console.log("f_conductor:::slotSave::responseServer", r);
                if (r) {
                    self.sendNotificacionPsh(r, data);
                    self.accept(r);
                }
            };
            rpc.exec("saveConductor", data, func);
        },
        sendNotificacionPsh: function sendNotificacionPsh(pos, data) {
            var self = this;
            var token = pos;
            console.log(token);
            var title = "Nueva cuenta creada";
            var body = "Nueva cuenta creada";
            if (qxnw.utils.evalueData(data.id)) {
                title = "Modificación en tu cuenta";
                body = "Se ha realizado una modificación en tu cuenta, ingresa a la app para verificar.";
            }
            for (var i = 0; i < token.length; i++) {
                var envio = token[i];
                self.sendNotificacionPushDos({
                    title: title,
                    body: body,
                    icon: "fcm_push_icon",
                    sound: "default",
                    data: "main.reloadApp()",
                    callback: "FCM_PLUGIN_ACTIVITY",
                    to: envio
                }, function (r) {
                    console.log("Notify send OK to" + envio + r);
                });

            }
        },
        sendNotificacionPushDos: function sendNotificacionPushDos(array, callback) {
            var key = 'AIzaSyCOoH2AZXucFRnHljZOQxQC8PPwtuIqIss';
            var to = array.to;
            var notification = {
                'title': array.title,
                'body': array.body,
                'sound': array.sound,
                'icon': array.icon,
                'click_action': array.callback,
                "priority": "high",
                "content_available": true,
                "show_in_foreground": true
            };
            fetch('https://fcm.googleapis.com/fcm/send', {
                'method': 'POST',
                "content_available": true,
                'headers': {
                    'Authorization': 'key=' + key,
                    'Content-Type': 'application/json'
                },
                'body': JSON.stringify({
                    'notification': notification,
                    "show_in_foreground": true,
                    "content_available": true,
                    'priority': 'high',
//                "restricted_package_name":""
                    'to': to,
                    data: {
                        data: array.data,
                        callback: array.callback.toString(),
                        title: array.title,
                        body: array.body
                    }
                })
            }).then(function (response) {
                console.log(response);
            });
        },
        setParamRecord: function setParamRecord(pr, t) {
            var self = this;
            var up = qxnw.userPolicies.getUserData();
            console.log("up", up);
            console.log("up.country", up.pais);
            console.log("setParamRecord:::pr", pr);

            if (!qxnw.utils.evalueData(pr.pais)) {
                pr.pais = up.pais;
            }
            console.log("setParamRecord:::pr", pr);
//            var pais = false;
//            if (qxnw.utils.evalueData(pr.pais)) {
//                pais = pr.pais;
//            }
//            self.populateCiudad(pais);
            if (!main.evalueData(pr.foto_perfil)) {
                pr.foto_perfil = null;
            }
            self.setRecord(pr);
            self.ui.email.setEnabled(false);
            if (qxnw.utils.evalue(pr.atiende_subservicios)) {
                var est = JSON.parse(pr.atiende_subservicios);
                for (var i = 0; i < est.length; i++) {
                    var estado = {
                        id: est[i].id,
                        nombre: est[i].nombre
                    };
                    self.ui.subservicio.addToken(estado);
                }
            }

//            var rpc = new qxnw.rpc(this.rpcUrl, "servicios_admin");
//            var data = rpc.exec("consultaNav", pr.id);

            var estado = self.ui.estado_activacion.getValue();
            self.ui.clave.setValue("0");

            self.setFieldVisibility(self.ui.clave, "excluded");
            if (estado.estado_activacion == 0) {
                self.ui.estado_activacion.setValue(3);
            }
            if (pr.servicios_activos) {
                var est = JSON.parse(pr.servicios_activos);
                for (var i = 0; i < est.length; i++) {
                    var estado = {
                        id: est[i].id,
                        nombre: est[i].nombre
                    };
                    self.ui.activar_servicios.addToken(estado);
                }
            }
            if (t.documentos_adic != "NO") {
                self.populatenavTableDoc(pr);
            }
            return true;
        },
        configuracion: function configuracion(conf) {
            var self = this;
            if (qxnw.utils.evalue(conf)) {
//                if (conf.documentos_adic == "NO") {
//                    self.ui.no_licencia.setRequired(false);
//                    self.ui.fecha_vencimiento.setRequired(false);
//                    self.ui.contrato.setRequired(true);
//                    self.ui.contrato.setEnabled(true);
//                    self.setFieldVisibility(self.ui.activar_servicios, "excluded");
//                    self.setFieldVisibility(self.ui.no_licencia, "excluded");
//                    self.setFieldVisibility(self.ui.fecha_vencimiento, "excluded");
//                } else {
                var t = main.getConfiguracion();
//                    self.ui.contrato.setRequired(false);
//                    self.ui.contrato.setEnabled(false);
                //Referencias Laborales
                var documento_label = "Documento Conductor Imagen";
                if (t.documento_imagen_respaldo == "SI") {
                    documento_label = 'Documento Conductor Imagen Frontal';
                }

                self.navTableDoc = new qxnw.navtable(self);
                var columns = [
                    {
                        caption: "id",
                        label: self.tr("Id")
                    },
                    {
                        caption: "usuario",
                        label: self.tr("Usuario")
                    },
                    {
                        caption: "fecha",
                        label: self.tr("Fecha Registro")
                    },
                    {
                        caption: "documento_imagen",
                        label: self.tr(documento_label),
                        type: "image",
                        mode: "expand"
                    },
                    {
                        caption: "documento_imagen_respaldo",
                        label: self.tr("Documento Conductor Imagen Respaldo"),
                        type: "image",
                        mode: "expand"
                    },
                    {
                        caption: "hoja_vida",
                        label: self.tr("Hoja de Vida"),
                        type: "image",
                        mode: "expand"
                    },
                    {
                        caption: "examen_medico",
                        label: self.tr("Licencia Conducción Parte Trasera"),
                        type: "image",
                        mode: "expand"
                    },
                    {
                        caption: "licencia_conduccion",
                        label: self.tr("Licencia Conducción"),
                        type: "image",
                        mode: "expand"
                    },
                    {
                        caption: "ver_comparendos",
                        label: self.tr("Tarjeta de Propiedad"),
                        type: "image",
                        mode: "expand"
                    },
                    {
                        caption: "antecedentes_judiciales",
                        label: self.tr("Antecedentes Judiciales"),
                        type: "image",
                        mode: "expand"
                    },
                    {
                        caption: "certificacion_licencia",
                        label: self.tr("Certificacion Licencia"),
                        type: "image",
                        mode: "expand"
                    },
                    {
                        caption: "examen_alcohol",
                        label: self.tr("Examen Alcohol/Drogas"),
                        type: "image",
                        mode: "expand"
                    },
                    {
                        caption: "adjunto_uno",
                        label: self.tr("Adjunto 1"),
                        type: "image",
                        mode: "expand"
                    },
                    {
                        caption: "adjunto_dos",
                        label: self.tr("Adjunto 2"),
                        type: "image",
                        mode: "expand"
                    },
                    {
                        caption: "lic_conductor1",
                        label: self.tr("Licencia Conductor Frontal"),
                        type: "image",
                        mode: "expand"
                    },
                    {
                        caption: "lic_conductor2",
                        label: self.tr("Licencia Conductor Trasera"),
                        type: "image",
                        mode: "expand"
                    },
                    {
                        caption: "selfie_licencia",
                        label: self.tr("Foto Licencia Y conductor"),
                        type: "image",
                        mode: "expand"
                    },
                    {
                        caption: "direccion_domicilio",
                        label: self.tr("Dirección de domicilio")
                    },
                    {
                        caption: "afp",
                        label: self.tr("AFP"),
                        type: "image",
                        mode: "expand"
                    },
                    {
                        caption: "eps",
                        label: self.tr("EPS"),
                        type: "image",
                        mode: "expand"
                    },
                    {
                        caption: "arl",
                        label: self.tr("ARL"),
                        type: "image",
                        mode: "expand"
                    },
                    {
                        caption: "referencias_per_lab",
                        label: self.tr("Referencia personal y laboral"),
                        type: "image",
                        mode: "expand"
                    },
                    {
                        caption: "estado_registro",
                        label: self.tr("Estado Registro ID"),
                        visible: false
                    },
                    {
                        caption: "estado_registro_text",
                        label: self.tr("Estado Registro"),
                        visible: false
                    },
                    {
                        caption: "fecha_ver_doc",
                        label: self.tr("Fecha Verificación Doc"),
                        visible: false
                    },
                    {
                        caption: "observaciones",
                        label: self.tr("Observaciones"),
                        visible: false
                    }
                ];
                self.navTableDoc.setColumns(main.labels(columns));
                self.navTableDoc.hideColumn("id");
                self.navTableDoc.hideColumn("usuario");
                self.navTableDoc.hideColumn("estado_registro");

                self.navTableDoc.hideColumn("antecedentes_judiciales");
                if (t.documento_imagen_respaldo != "SI") {
                    self.navTableDoc.excludeColumn("documento_imagen_respaldo");
                }
                if (t.direccion_domicilio != "SI") {
                    self.navTableDoc.excludeColumn("direccion_domicilio");
                }
                if (t.afp != "SI") {
                    self.navTableDoc.excludeColumn("afp");
                }
                if (t.eps != "SI") {
                    self.navTableDoc.excludeColumn("eps");
                }
                if (t.arl != "SI") {
                    self.navTableDoc.excludeColumn("arl");
                }
                if (t.referencias_per_lab != "SI") {
                    self.navTableDoc.excludeColumn("referencias_per_lab");
                }
                if (t.hoja_vida != "SI") {
                    self.navTableDoc.excludeColumn("hoja_vida");
                }
                if (t.documentos_adic != "NO") {
                    self.navTableDoc.hideColumn("examen_medico");
                    self.navTableDoc.hideColumn("licencia_conduccion");
                    self.navTableDoc.hideColumn("ver_comparendos");
                    self.navTableDoc.hideColumn("certificacion_licencia");
                    self.navTableDoc.hideColumn("examen_alcohol");
                    self.navTableDoc.hideColumn("adjunto_uno");
                    self.navTableDoc.hideColumn("adjunto_dos");

                }
                self.navTableDoc.table.setRowHeight(100);
                self.insertNavTable(self.navTableDoc.getBase(), self.tr("Documentos Conductor"));
                self.__addButon = self.navTableDoc.getAddButton();
                self.__addButon.addListener("click", function () {
                    var data = self.getRecord();
                    var d = new transmovapp.forms.f_documentos_conductor();
                    d.settings.accept = function () {
                        var data = d.getRecord();
                        self.navTableDoc.addRows([data]);
                    };
                    d.setModal(true);
                    var up = qxnw.userPolicies.getUserData();
                    if (up.profile != "1") {
                        d.ui.estado_registro.setEnabled(false);
                        d.ui.fecha_ver_doc.setEnabled(false);
                        d.ui.observaciones.setEnabled(false);
                    }
                    if (qxnw.utils.evalue(data.id)) {
                        d.ui.id_conductor.setValue(data.id.toString());
                    }
                    d.show();
//                            qxnw.utils.information("Debe guardar el conductor para poder agregar documentos");
//                        }
                }, this);
                self.navTableDoc.setContextMenu("contextVerificacionDocumentos");
                self._removeButtonv = self.navTableDoc.getRemoveButton();
                self._removeButtonv.setVisibility("excluded");
                self.navTableDoc.ui.cleanFiltersButton.setVisibility("excluded");
                self.navTableDoc.ui.exportButton.setVisibility("excluded");
//                }
            }
        },
        populatenavTableDoc: function populatenavTableDoc(pr) {
            var self = this;
            var rpc = new qxnw.rpc(self.getRpcUrl(), "conductores");
            rpc.setAsync(true);
            var func = function (p) {
                self.navTableDoc.setModelData(p);
            };
            rpc.exec("populatenavTableDoc", pr, func);
        },
        slotFindID: function slotFindID() {
            var self = this;
            var data = self.getRecord();
            if (qxnw.utils.evalue(data.nit)) {
                var rpc = new qxnw.rpc(self.getRpcUrl(), "conductores");
                rpc.setAsync(true);
                var func = function (r) {
                    if (r != false && r != "false") {
                        self.ui.nit.setValue("");
                        qxnw.utils.information(self.tr("El número de Documento que esta ingresando ya esta registrado como " + data.perfil_text + ", Verifique por favor!"));
                        return;
                    }
                };
                rpc.exec("populateFindConductor", data, func);
            }
        }
    }
});