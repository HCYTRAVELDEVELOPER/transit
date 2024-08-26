qx.Class.define("transmovapp.forms.f_clientes", {
    extend: qxnw.forms,
    construct: function (portal) {
        var self = this;
        this.base(arguments);
        this.createBase();
        self.setGroupHeader("Empresas");
        self.__conf = main.getConfiguracion();
        self.portal = portal;
        var visib = false;
//        if (self.__conf.usa_flotas_clientes == "SI") {
        if (self.portal) {
            visib = true;
        }
//        }
        console.log("self.__conf.pide_fuec", self.__conf);
        console.log("self.__conf.pide_fuec", self.__conf.pide_fuec);
        var visibleContrato = true;
        if (self.__conf.pide_fuec === "NO") {
            visibleContrato = false;
        }
        var fields = [
            {
                name: "",
                type: "startGroup",
                mode: "horizontal"
            },
            {
                name: "id",
                label: self.tr("ID"),
                caption: "id",
                type: "textField",
                visible: false
            },
            {
                name: "nombre",
                label: self.tr("Nombre"),
                type: "textField",
                required: true
            },
            {
                name: "nit",
                label: self.tr("NIT"),
                type: "textField",
//                mode: "integer.maxCharacteres:20",
                required: true
            },
            {
                name: "razon_social",
                label: self.tr("Razón social"),
                caption: "razon_social",
                type: "textField",
                required: true
            },
            {
                name: "direccion",
                label: self.tr("Dirección"),
                caption: "direccion",
                type: "textField",
                required: true
            },
            {
                name: "telefono",
                label: self.tr("Teléfono"),
                caption: "telefono",
                type: "textField",
                required: true
            },
            {
                type: "endGroup"
            },
            {
                name: "",
                type: "startGroup",
                mode: "horizontal"
            },
            {
                name: "ciudad",
                label: self.tr("Ciudad"),
                caption: "ciudad",
                type: "selectBox",
                required: true
            },
            {
                name: "correo",
                label: self.tr("Correo"),
                type: "textField",
                mode: "email",
                required: true
            },
            {
                name: "logo",
                label: self.tr("Logo"),
                caption: "logo",
                type: "uploader"
//                required: true
            },
            {
                name: "encargado",
                label: self.tr("Nombre responsable"),
                caption: "encargado",
                type: "textField",
                required: true
            },
            {
                name: "contrato",
                label: self.tr("Contrato FUEC (4 digitos)"),
                caption: "contrato",
                type: "textField",
//                mode: "integer.maxCharacteres:4.minCharacteres:4",
                required: visibleContrato,
                visible: visibleContrato
            },
            {
                name: "objeto_contrato",
                label: self.tr("Objeto contrato"),
                caption: "objeto_contrato",
                type: "textField",
                visible: true
            },
            {
                name: "numero_contacto_reponsable",
                label: self.tr("Numero contacto reponsable"),
                caption: "encargado",
                type: "textField",
                visible: visib
            },
            {
                name: "identificacion_reponsable",
                label: self.tr("Numero de identificación reponsable"),
                caption: "identificacion_reponsable",
                type: "textField",
                mode: "numeric",
                visible: visib
            },
            {
                name: "direccion_reponsable",
                label: self.tr("Dirección reponsable"),
                caption: "direccion_reponsable",
                type: "textField",
                visible: visib
            },
            {
                name: "firma_representante_legal",
                label: self.tr("Firma representante legal"),
                type: "uploader",
                visible: visib
            },
            {
                name: "latitud",
                label: self.tr("Latitud"),
                caption: "latitud",
                type: "textField",
                visible: visib
            },
            {
                name: "longitud",
                label: self.tr("Longitud"),
                caption: "longitud",
                type: "textField",
                visible: visib
            },
            {
                type: "endGroup"
            }
        ];
        this.setFields(main.labels(fields, "empresas"));
        this.setTitle(self.tr("Clientes, contratos"));

        var data = {};
        data[""] = self.tr("Seleccione");
        qxnw.utils.populateSelectFromArray(self.ui.ciudad, data);
//        data.table = "ciudades";
        qxnw.utils.populateSelect(self.ui.ciudad, "empresas", "populateCiudad", data);

        self.ui.accept.addListener("execute", function () {
            self.slotSave();
        });
        self.ui.cancel.addListener("execute", function () {
            self.reject();
        });

//        if (self.__conf.app_para == "CARGA") {
        self.createNavTableTarifas();
        self.createNavTableTarifasFijas();
        self.createNavTableCentros();
//        }


//        if (self.__conf.usa_flotas_clientes == "SI") {
//        if (self.portal) {
//            self.createNavTableFuec();
//        }
//        }

//        if (self.portal && self.__conf.app_para != "CARGA") {
//            self.createNavTableTarifas();
//            self.createNavTableTarifasFijas();
//        }
//        if (qxnw.utils.evalue(self.__conf.usa_centros_de_costo)) {
//            if (self.__conf.usa_centros_de_costo == "SI") {
//        self.createNavTableCentros();
//            }
//        }

        var up = qxnw.userPolicies.getUserData();
        self.__up = up;
    },
    destruct: function () {
    },
    members: {
        navTable: null,
        slotSave: function slotSave() {
            var self = this;
            if (!self.validate()) {
                return;
            }
            var data = this.getRecord();
            if (self.__conf.pide_fuec !== "NO") {
                if (data.contrato.length < 4) {
                    qxnw.utils.information("El número FUEC de contrato debe contener 4 digitos. En caso de contener menos, debe rellenar con ceros a la izquierda.");
                    return false;
                }
                data.contrato = data.contrato.toString();
            }
            data.tarifas = self.navTable.getAllData();
            data.tarifas_fijas = self.navTableTF.getAllData();
            data.centro_costos = self.navTableCC.getAllData();
            data.centro_costos = self.navTableCC.getAllData();
            if (self.portal) {
                data.tarifas = self.navTable.getAllData();
                data.tarifas_fijas = self.navTableTF.getAllData();
            }

            data.tipo_empresa = "Flota";
            if (self.portal) {
                data.tipo_empresa = "Cliente";
            }
            var rpc = new qxnw.rpc(this.rpcUrl, "empresas");
            rpc.setAsync(true);
            var func = function (r) {
                console.log("r", r);
                if (self.__conf.pide_fuec === "SI") {
                    if (r == "consecutivo_usado") {
                        qxnw.utils.information("El número consecutivo para el FUEC ya está siendo usado");
                        return false;
                    }
                }
                self.accept(r);
            };
            rpc.exec("save", data, func);
        },
        setParamRecord: function setParamRecord(pr) {
            var self = this;
            console.log("setParamRecord:::pr", pr);
            self.setRecord(pr);
//            if (self.__conf.app_para == "CARGA") {
            self.populateTarifas(pr);
            self.populateTarifasFijas(pr);
            self.populateCentros(pr);
//            }
//            if (self.__conf.usa_flotas_clientes == "SI") {
            if (self.portal) {
//                self.populateDetalleContratoFuec(pr);
                self.populateTarifas(pr);
                self.populateTarifasFijas(pr);
            }
            if (qxnw.utils.evalue(self.__conf.usa_centros_de_costo)) {
//                    if (self.__conf.usa_centros_de_costo == "SI") {
                self.populateCentros(pr);
//                    }
            }
//                self.populateTarifas(pr);
//                self.populateTarifasFijas(pr);
//            }
            return true;
        },
        populateTarifasFijas: function populateTarifasFijas(pr) {
            var self = this;
            var rpc = new qxnw.rpc(this.rpcUrl, "empresas");
            rpc.setAsync(true);
            var func = function (r) {
                console.log(r);
                self.navTableTF.setModelData(r);
            };
            rpc.exec("populateTarifasFijas", pr.id, func);
        },
        populateTarifas: function populateTarifas(pr) {
            var self = this;
            var rpc = new qxnw.rpc(this.rpcUrl, "empresas");
            rpc.setAsync(true);
            var func = function (r) {
                self.navTable.setModelData(r);
            };
            rpc.exec("populateTarifas", pr.id, func);
        },
        populateCentros: function populateCentros(pr) {
            var self = this;
            var rpc = new qxnw.rpc(this.rpcUrl, "empresas");
            rpc.setAsync(true);
            var func = function (r) {
                self.navTableCC.setModelData(r);
            };
            rpc.exec("populateCentros", pr.id, func);
        },
//        populateDetalleContratoFuec: function populateDetalleContratoFuec(pr) {
//            var self = this;
//            var rpc = new qxnw.rpc(this.rpcUrl, "empresas");
//            rpc.setAsync(true);
//            var func = function (r) {
//                self.navTableDetalleFuec.setModelData(r);
//            };
//            rpc.exec("populateDetalleContratoFuec", pr.id, func);
//        },
        createNavTableTarifas: function createNavTableTarifas() {
            var self = this;

            self.navTable = new qxnw.navtable(self);
            var columns = [
                {
                    caption: "id",
                    label: self.tr("id")
                },
                {
                    caption: "valor_unidad_tiempo",
                    label: self.tr("Valor unidad tiempo"),
                    type: "money"
                },
                {
                    caption: "valor_unidad_metros",
                    label: self.tr("Valor unidad metros"),
                    type: "money"
                },
                {
                    caption: "valor_banderazo",
                    label: self.tr("Valor banderazo"),
                    type: "money"
                },
                {
                    caption: "valor_mascota",
                    label: self.tr("Valor auxiliar"),
                    type: "money"
                },
                {
                    caption: "minima",
                    label: self.tr("Minima"),
                    type: "money"
                },
                {
                    caption: "trayecto",
                    label: self.tr("Trayecto")
                },
                {
                    caption: "porcentaje_comision",
                    label: self.tr("Porcentaje comisión"),
                    visible: false
                },
                {
                    caption: "trayecto_text",
                    label: self.tr("Trayecto")
                }
            ];
            self.navTable.setColumns(columns);
            self.navTable.hideColumn("id");
            self.navTable.hideColumn("trayecto");
            self.insertNavTable(self.navTable.getBase(), self.tr("Tarifas Trayecto"));
            self.__addButon = self.navTable.getAddButton();
            self.__addButon.addListener("click", function () {
                var d = new qxnw.forms();
                var fields = [
                    {
                        name: "",
                        type: "startGroup",
                        mode: "vertical"
                    },
                    {
                        name: "id",
                        type: "textField",
                        label: self.tr("id"),
                        visible: false
                    },
                    {
                        name: "valor_unidad_tiempo",
                        label: self.tr("Valor unidad tiempo"),
                        type: "textField",
                        mode: "money"
                    },
                    {
                        name: "valor_unidad_metros",
                        label: self.tr("Valor unidad metros"),
                        type: "textField",
                        mode: "money"
                    },
                    {
                        name: "valor_banderazo",
                        label: self.tr("Valor banderazo"),
                        type: "textField",
                        mode: "money"
                    },
                    {
                        name: "valor_mascota",
                        label: self.tr("Valor auxiliar"),
                        type: "textField",
                        mode: "money"
                    },
                    {
                        name: "minima",
                        label: self.tr("Minima"),
                        type: "textField",
                        mode: "money"
                    },
                    {
                        name: "porcentaje_comision",
                        label: self.tr("Porcentaje comisión"),
                        type: "textField",
                        visible: false
                    },
                    {
                        name: "trayecto",
                        label: self.tr("Trayecto"),
                        type: "selectBox",
                        required: true
                    },
                    {
                        type: "endGroup"
                    }
                ];

                d.setFields(fields);
                var dat = {};
                dat[""] = self.tr("Seleccione");
                qxnw.utils.populateSelectFromArray(d.ui.trayecto, dat);
                qxnw.utils.populateSelect(d.ui.trayecto, "master", "populate", {table: "edo_taximetro"});

                d.ui.accept.addListener("execute", function () {
                    var data = d.getRecord();
                    var nv = self.navTable.getAllData();
                    var cont = 0;
                    nv.forEach(function (n) {
                        if (n.trayecto == data.trayecto) {
                            cont++;
                        }
                    });
                    if (cont == 0) {
                        self.navTable.addRows([data]);
                    } else {
                        qxnw.utils.information(self.tr("La tarifa que intenta agregar ya existe"));
                    }
                    d.accept();

                });
                d.ui.cancel.addListener("execute", function () {
                    d.reject();
                });
                d.setModal(true);
                d.show();
            }, this);
            self._removeButton = self.navTable.getRemoveButton();
            self.navTable.setContextMenu("contextTrayecto");
            self._removeButton.addListener("execute", function () {
                var f = self.navTable.selectedRecord();
                if (f == undefined || f == null) {
                    qxnw.utils.information(self.tr("Seleccione un registro para eliminar"));
                    return;
                } else {
                    if (f.id == "") {
                        self.navTable.removeSelectedRow();
                        return;
                    }
                    var data = f;
                    data.id_cliente = self.ui.id.getValue();
                    data.table = 'edo_taximetro_cliente';
                    var rpc = new qxnw.rpc(self.getRpcUrl(), "empresas");
                    rpc.setAsync(true);
                    var func = function (r) {
                        self.navTable.removeSelectedRow();
                    };
                    rpc.exec("deleteNavcliente", data, func);
                }
            });
        },
        createNavTableTarifasFijas: function createNavTableTarifasFijas() {
            var self = this;
            self.navTableTF = new qxnw.navtable(self);
            var columns = [
                {
                    caption: "id",
                    label: self.tr("id")
                },
                {
                    caption: "tarifa",
                    label: self.tr("Tarifa")
                },
                {
                    caption: "tarifa_text",
                    label: self.tr("Tarifa")
                },
                {
                    caption: "service",
                    label: self.tr("Servicio")
                },
                {
                    caption: "service_text",
                    label: self.tr("Servicio")
                },
                {
                    caption: "valor",
                    label: self.tr("Valor")
                },
                {
                    caption: "porcentaje_empresa",
                    label: self.tr("% empresa")
                },
                {
                    caption: "porcentaje_proveedor",
                    label: self.tr("% proveedor")
                }
            ];
            self.navTableTF.setColumns(columns);
            self.navTableTF.hideColumn("id");
            self.navTableTF.hideColumn("service");
            self.navTableTF.hideColumn("tarifa");
            self.insertNavTable(self.navTableTF.getBase(), self.tr("Tarifas Fijas"));
            self.__addButon = self.navTableTF.getAddButton();
            self.__addButon.addListener("click", function () {
                var d = new qxnw.forms();
                var fields = [
                    {
                        name: "",
                        type: "startGroup",
                        mode: "vertical"
                    },
                    {
                        name: "id",
                        type: "textField",
                        label: self.tr("id"),
                        visible: false
                    },
                    {
                        name: "tarifa",
                        label: self.tr("Tarifa"),
                        type: "selectBox"
                    },
                    {
                        name: "service",
                        label: self.tr("Sub Servicios"),
                        type: "selectBox"
                    },
                    {
                        name: "valor",
                        label: self.tr("Valor"),
                        type: "textField"
                    },
                    {
                        name: "porcentaje_empresa",
                        label: self.tr("% empresa"),
                        type: "textField",
                        mode: "numeric"
                    },
                    {
                        name: "porcentaje_proveedor",
                        label: self.tr("% proveedor"),
                        type: "textField",
                        mode: "numeric"
                    },
                    {
                        type: "endGroup"
                    }
                ];
                d.setFields(fields);
                var dat = {};
                dat[""] = self.tr("Seleccione");
                qxnw.utils.populateSelectFromArray(d.ui.tarifa, dat);
                qxnw.utils.populateSelect(d.ui.tarifa, "empresas", "selectTarifasFijas", {table: "edo_foraneo"});
                var dat = {};
                dat[""] = self.tr("Seleccione");
                qxnw.utils.populateSelectFromArray(d.ui.service, dat);
                qxnw.utils.populateSelect(d.ui.service, "master", "populate", {table: "edo_subservice"});
                d.ui.accept.addListener("execute", function () {
                    var data = d.getRecord();
                    var nv = self.navTableTF.getAllData();
                    var cont = 0;
                    nv.forEach(function (n) {
                        if (n.tarifa == data.tarifa) {
                            if (n.service == data.service) {
                                cont++;
                            }
                        }
                    });
                    if (cont == 0) {
                        self.navTableTF.addRows([data]);
                    } else {
                        qxnw.utils.information(self.tr("La tarifa que intenta agregar ya existe"));
                    }
                    d.accept();
                });
                d.ui.cancel.addListener("execute", function () {
                    d.reject();
                });
                d.setModal(true);
                d.setTitle("Tarifas fijas");
                d.show();
            }, this);
            self._removeButton = self.navTableTF.getRemoveButton();
            self.navTableTF.setContextMenu("contextFijas");
            self._removeButton.addListener("execute", function () {
                var f = self.navTableTF.selectedRecord();
                if (f == undefined || f == null) {
                    qxnw.utils.information(self.tr("Seleccione un registro para eliminar"));
                    return;
                } else {
                    if (f.id == "") {
                        self.navTableTF.removeSelectedRow();
                        return;
                    }
                    var data = f;
                    data.id_cliente = self.ui.id.getValue();
                    data.table = 'edo_foraneo_clientes';
                    var rpc = new qxnw.rpc(self.getRpcUrl(), "empresas");
                    rpc.setAsync(true);
                    var func = function (r) {
                        self.navTableTF.removeSelectedRow();
                    };
                    rpc.exec("deleteNavcliente", data, func);
                }
            });
        },
        contextSedes: function contextSedes(pos) {
            var self = this;
            var r = self.navTableCC.selectedRecord();
            var m = new qxnw.contextmenu(self);
            m.addAction("Editar", qxnw.config.execIcon("document-properties"), function (e) {
                self.slotEditarCrearSede(r);
            });
            m.setParentWidget(self.navTableCC);
            m.exec(pos);
        },
        slotEditarCrearSede: function slotEditarCrearSede(p) {
            var self = this;
            var d = new qxnw.forms();
            var fields = [
                {
                    name: "",
                    type: "startGroup",
                    mode: "vertical"
                },
                {
                    name: "id",
                    type: "textField",
                    label: self.tr("id"),
                    visible: false
                },
                {
                    name: "nombre",
                    label: self.tr("Nombre"),
                    type: "textField",
                    required: true
                },
                {
                    name: "ciudad",
                    label: self.tr("Ciudad"),
                    type: "selectTokenField",
                    required: true
                },
                {
                    name: "direccion",
                    label: self.tr("Dirección"),
                    type: "textField",
                    required: true
                },
                {
                    name: "telefono",
                    label: self.tr("Telefono"),
                    type: "textField",
                    mode: "numeric",
                    required: true
                },
                {
                    name: "cliente_usuario",
                    label: self.tr("Usuario APP asociado (busca por nombre, usuario, documento)"),
                    type: "selectTokenField",
                    required: true
                },
                {
                    name: "cliente_correo",
                    label: self.tr("Correo notificaciones"),
                    type: "textField",
                    required: true,
                    enabled: false
                },
                {
                    name: "cliente_usuario_id",
                    label: self.tr("Usuario APP asociado ID"),
                    type: "textField",
                    mode: "numeric",
                    required: true,
                    visible: false
                },
                {
                    name: "latitud",
                    label: self.tr("Latitud"),
                    type: "textField",
                    required: true,
                    visible: false
                },
                {
                    name: "longitud",
                    label: self.tr("Longitud"),
                    type: "textField",
                    required: true,
                    visible: false
                },
                {
                    type: "endGroup"
                }
            ];
            d.setFields(fields);

            var up = qxnw.userPolicies.getUserData();

            console.log("p", p);
            if (qxnw.utils.evalueData(p)) {
                d.setRecord(p);
                if (qxnw.utils.evalue(p.ciudad)) {
                    var ciudad = {
                        id: p.ciudad,
                        nombre: p.ciudad_text
                    };
                    d.ui.ciudad.addToken(ciudad);
                }
                if (qxnw.utils.evalue(p.cliente_usuario) && qxnw.utils.evalue(p.cliente_usuario_id)) {
                    var token = {
                        id: p.cliente_usuario_id,
                        nombre: p.cliente_usuario
                    };
                    d.ui.cliente_usuario.addToken(token);
                }
            }

            d.ui.ciudad.addListener("loadData", function (e) {
                var data = {};
                data["token"] = e.getData();
                var rpc = new qxnw.rpc(self.getRpcUrl(), "empresas");
                rpc.setAsync(true);
                var func = function (r) {
                    d.ui.ciudad.setModelData(r);
                };
                rpc.exec("populateTokenCiudades", data, func);
            }, this);

            d.ui.accept.addListener("execute", function () {
                var data = d.getRecord();
                console.log("data", data);
                data.cliente_usuario = data.cliente_usuario_text;
                if (qxnw.utils.evalueData(p)) {
                    self.navTableCC.removeSelectedRow();
                }
                self.navTableCC.addRows([data]);
                d.accept();
            });
            d.ui.cancel.addListener("execute", function () {
                d.reject();
            });
            d.addListener("appear", function () {
                addCl(d.ui.direccion);
            });
            function addCl(widget) {
                if (!main.evalueData(widget)) {
                    setTimeout(function () {
                        addCl();
                    }, 500);
                    return false;
                }
                if (!main.evalueData(widget.getContentElement())) {
                    setTimeout(function () {
                        addCl();
                    }, 500);
                    return false;
                }
                if (!main.evalueData(widget.getContentElement().getDomElement())) {
                    setTimeout(function () {
                        addCl();
                    }, 500);
                    return false;
                }
                qx.bom.element.Class.add(widget.getContentElement().getDomElement(), "direccion_search_sede");
                main.autocomplete(".direccion_search_sede", false, function (e) {
                    var lat = e.location.lat().toString();
                    var lng = e.location.lng().toString();
                    d.ui.latitud.setValue(lat);
                    d.ui.longitud.setValue(lng);
                });
            }

            d.ui.cliente_usuario.addListener("loadData", function (e) {
                var data = {};
                data.token = e.getData();
                var rpc = new qxnw.rpc(self.getRpcUrl(), "clientes");
                rpc.setAsync(true);
                var func = function (r) {
                    console.log("r", r);
                    d.ui.cliente_usuario.setModelData(r);
                };
                rpc.exec("traeUsuariosPopulate", data, func);
            }, this);
            d.ui.cliente_usuario.addListener("addItem", function (e) {
                var val = e.getData();
                console.log("val", val);
                if (!qxnw.utils.evalueData(val)) {
                    return false;
                }
                if (qxnw.utils.evalueData(val.email)) {
                    d.ui.cliente_correo.setValue(val.email);
                }
                if (qxnw.utils.evalueData(val.id)) {
                    d.ui.cliente_usuario_id.setValue(val.id);
                }
            }, this);

            d.setModal(true);
            d.setTitle(self.tr("Sedes crear / editar"));
            d.show();
        },
        createNavTableCentros: function createNavTableCentros() {
            var self = this;
            self.navTableCC = new qxnw.navtable(self);
            var columns = [
                {
                    caption: "id",
                    label: self.tr("id")
                },
                {
                    caption: "nombre",
                    label: self.tr("Nombre")
                },
                {
                    caption: "ciudad",
                    label: self.tr("Ciudad")
                },
                {
                    caption: "ciudad_text",
                    label: self.tr("Ciudad")
                },
                {
                    caption: "direccion",
                    label: self.tr("Dirección")
                },
                {
                    caption: "telefono",
                    label: self.tr("Telefono")
                },
                {
                    caption: "cliente_correo",
                    label: self.tr("Correo notificaciones")
                },
                {
                    caption: "cliente_usuario",
                    label: self.tr("Usuario APP asociado")
                },
                {
                    caption: "cliente_usuario_id",
                    label: self.tr("Usuario APP asociado ID")
                },
                {
                    caption: "latitud",
                    label: self.tr("Latitud")
                },
                {
                    caption: "longitud",
                    label: self.tr("Longitud")
                }
            ];
            self.navTableCC.setColumns(columns);
            self.navTableCC.hideColumn("id");
            self.navTableCC.hideColumn("ciudad");
            self.insertNavTable(self.navTableCC.getBase(), self.tr("Sedes"));
            self.__addButon = self.navTableCC.getAddButton();

            self.__addButon.addListener("click", function () {
                self.slotEditarCrearSede();
            }, this);

            self._removeButton = self.navTableCC.getRemoveButton();

            self.navTableCC.setContextMenu("contextSedes");

            self._removeButton.addListener("execute", function () {
                var f = self.navTableCC.selectedRecord();
                if (f == undefined || f == null) {
                    qxnw.utils.information(self.tr("Seleccione un registro para eliminar"));
                    return;
                } else {
                    if (f.id == "") {
                        self.navTableCC.removeSelectedRow();
                        return;
                    }
                    var data = f;
                    data.id_cliente = self.ui.id.getValue();
                    data.table = 'edo_centro_costos';
                    var rpc = new qxnw.rpc(self.getRpcUrl(), "empresas");
                    rpc.setAsync(true);
                    var func = function (r) {
                        self.navTableCC.removeSelectedRow();
                    };
                    rpc.exec("deleteNavcliente", data, func);
                }
            });
        }
    }
});
