qx.Class.define("transmovapp.forms.f_empresas_flotas", {
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
                type: "endGroup"
            }
        ];
        this.setFields(main.labels(fields, "empresas"));
        this.setTitle(self.tr("Empresas / Flotas"));

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
        if (self.portal) {
            self.createNavTableFuec();
        }
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
//            if (self.__conf.app_para == "CARGA") {
                data.tarifas = self.navTable.getAllData();
                data.tarifas_fijas = self.navTableTF.getAllData();
                data.centro_costos = self.navTableCC.getAllData();
//            }
//            if (qxnw.utils.evalue(self.__conf.usa_centros_de_costo)) {
//                if (self.__conf.usa_centros_de_costo == "SI") {
                    data.centro_costos = self.navTableCC.getAllData();
//                }
//            }
            console.log(self.__conf.usa_flotas_clientes)
            console.log(self.portal)
//            if (self.__conf.usa_flotas_clientes == "SI") {
            if (self.portal) {
                data.detalle_contrato = self.navTableDetalleFuec.getAllData();
                data.tarifas = self.navTable.getAllData();
                data.tarifas_fijas = self.navTableTF.getAllData();
            }
//            }

            data.tipo_empresa = "Flota";
            if (self.portal) {
                data.tipo_empresa = "Cliente";
            }
            var rpc = new qxnw.rpc(this.rpcUrl, "empresas");
            rpc.setAsync(true);
            var func = function (r) {
                self.accept(r);
            };
            rpc.exec("save", data, func);
        },
        setParamRecord: function setParamRecord(pr) {
            var self = this;
            self.setRecord(pr);
//            if (self.__conf.app_para == "CARGA") {
            self.populateTarifas(pr);
            self.populateTarifasFijas(pr);
            self.populateCentros(pr);
//            }
//            if (self.__conf.usa_flotas_clientes == "SI") {
            if (self.portal) {
                self.populateDetalleContratoFuec(pr);
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
        populateDetalleContratoFuec: function populateDetalleContratoFuec(pr) {
            var self = this;
            var rpc = new qxnw.rpc(this.rpcUrl, "empresas");
            rpc.setAsync(true);
            var func = function (r) {
                self.navTableDetalleFuec.setModelData(r);
            };
            rpc.exec("populateDetalleContratoFuec", pr.id, func);
        },
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
                }
            ];
            self.navTableCC.setColumns(columns);
            self.navTableCC.hideColumn("id");
            self.navTableCC.hideColumn("ciudad");
            self.insertNavTable(self.navTableCC.getBase(), self.tr("Centros de costos"));
            self.__addButon = self.navTableCC.getAddButton();
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
                        name: "nombre",
                        label: self.tr("Nombre"),
                        type: "textField"
                    },
                    {
                        name: "ciudad",
                        label: self.tr("Ciudad"),
                        type: "selectTokenField"
                    },
                    {
                        name: "direccion",
                        label: self.tr("Dirección"),
                        type: "textField"
                    },
                    {
                        name: "telefono",
                        label: self.tr("Telefono"),
                        type: "textField",
                        mode: "numeric"
                    },
                    {
                        type: "endGroup"
                    }
                ];
                d.setFields(fields);

                var up = qxnw.userPolicies.getUserData();

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
                    self.navTableCC.addRows([data]);
                    d.accept();
                });
                d.ui.cancel.addListener("execute", function () {
                    d.reject();
                });
                d.setModal(true);
                d.setTitle(self.tr("Tarifas fijas"));
                d.show();
            }, this);
            self._removeButton = self.navTableCC.getRemoveButton();
            self.navTableCC.setContextMenu("contextFijas");
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
        },
        createNavTableFuec: function createNavTableFuec() {
            var self = this;

            self.navTableDetalleFuec = new qxnw.navtable(self);
            var columns = [
                {
                    caption: "id",
                    label: self.tr("id")
                },
                {
                    caption: "id_cliente",
                    label: self.tr("Id Cliente"),
                    visible: false
                },
                {
                    caption: "numero_contrato",
                    label: self.tr("Numero Contrato")
                },
                {
                    caption: "objeto_contrato",
                    label: self.tr("Objeto Contrato")
                },
                {
                    caption: "numero_fuec",
                    label: self.tr("Numero Fuec")
                },
                {
                    caption: "fecha_inicial",
                    label: self.tr("Fecha Inicial")
                },
                {
                    caption: "fecha_final",
                    label: self.tr("Fecha Final")
                },
                {
                    caption: "origen",
                    label: self.tr("Origen")
                },
                {
                    caption: "destino",
                    label: self.tr("Destino")
                },
                {
                    caption: "descripcion_recorrido",
                    label: self.tr("Descripción del Recorrido")
                },
                {
                    caption: "convenio_text",
                    label: self.tr("Convenio")
                },
                {
                    caption: "convenio",
                    label: self.tr("Convenio id"),
                    visible: false
                },
                {
                    caption: "empresa",
                    label: self.tr("Empresa"),
                    visible: false
                },
                {
                    caption: "usuario",
                    label: self.tr("Usuario"),
                    visible: false
                }
            ];
            self.navTableDetalleFuec.setColumns(columns);
            self.navTableDetalleFuec.hideColumn("id");
            self.insertNavTable(self.navTableDetalleFuec.getBase(), self.tr("Detalle contrato"));
            self.__addButon = self.navTableDetalleFuec.getAddButton();
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
                        name: "numero_contrato",
                        label: self.tr("Numero Contrato"),
                        type: "textField",
                        mode: "numeric"
                    },
                    {
                        name: "objeto_contrato",
                        label: self.tr("Objeto Contrato"),
                        type: "textArea"
                    },
                    {
                        name: "numero_fuec",
                        label: self.tr("Numero Fuec"),
                        type: "textArea",
                        mode: "numeric"
                    },
                    {
                        name: "fecha_inicial",
                        label: self.tr("Fecha Inicial"),
                        type: "dateField"
                    },
                    {
                        name: "fecha_final",
                        label: self.tr("Fecha Final"),
                        type: "dateField"
                    },
                    {
                        name: "origen",
                        label: self.tr("Origen"),
                        type: "textField"
                    },
                    {
                        name: "destino",
                        label: self.tr("Destino"),
                        type: "textField"
                    },
                    {
                        name: "descripcion_recorrido",
                        label: self.tr("Descripción del Recorrido"),
                        type: "textArea"
                    },
                    {
                        name: "convenio",
                        label: self.tr("Convenio"),
                        type: "selectBox"
                    },
                    {
                        type: "endGroup"
                    }
                ];
                d.setFields(fields);

                var up = qxnw.userPolicies.getUserData();
                var data = {};
                data[""] = self.tr("Seleccione");
                qxnw.utils.populateSelectFromArray(d.ui.convenio, data);
                data = {};
                data.table = "edo_empresas";
                data.where = " tipo_empresa='Flota'";
                qxnw.utils.populateSelect(d.ui.convenio, "master", "populate", data);

                d.ui.accept.addListener("execute", function () {
                    var data = d.getRecord();
                    self.navTableDetalleFuec.addRows([data]);
                    d.accept();
                });
                d.ui.cancel.addListener("execute", function () {
                    d.reject();
                });
                d.setModal(true);
                d.setTitle(self.tr("Tarifas fijas"));
                d.show();
            }, this);
            self._removeButton = self.navTableDetalleFuec.getRemoveButton();
            self.navTableDetalleFuec.setContextMenu("contextdetalle");
            self._removeButton.addListener("execute", function () {
                var f = self.navTableDetalleFuec.selectedRecord();
                if (f == undefined || f == null) {
                    qxnw.utils.information(self.tr("Seleccione un registro para eliminar"));
                    return;
                }
                self.navTableDetalleFuec.removeSelectedRow();
            });
        },
        contextdetalleForm: function contextdetalleForm(pos) {
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
                    name: "numero_contrato",
                    label: self.tr("Numero Contrato"),
                    type: "textField",
                    mode: "numeric"
                },
                {
                    name: "objeto_contrato",
                    label: self.tr("Objeto Contrato"),
                    type: "textArea"
                },
                {
                    name: "numero_fuec",
                    label: self.tr("Numero Fuec"),
                    type: "textField",
                    mode: "numeric"
                },
                {
                    name: "fecha_inicial",
                    label: self.tr("Fecha Inicial"),
                    type: "dateField"
                },
                {
                    name: "fecha_final",
                    label: self.tr("Fecha Final"),
                    type: "dateField"
                },
                {
                    name: "origen",
                    label: self.tr("Origen"),
                    type: "textField"
                },
                {
                    name: "destino",
                    label: self.tr("Destino"),
                    type: "textField"
                },
                {
                    name: "descripcion_recorrido",
                    label: self.tr("Descripción del Recorrido"),
                    type: "textArea"
                },
                {
                    name: "convenio",
                    label: self.tr("Convenio"),
                    type: "selectBox"
                },
                {
                    type: "endGroup"
                }
            ];
            d.setFields(fields);

            var up = qxnw.userPolicies.getUserData();
            var data = {};
            data[""] = self.tr("Seleccione");
            qxnw.utils.populateSelectFromArray(d.ui.convenio, data);
            data = {};
            data.table = "edo_empresas";
            data.where = " tipo_empresa='Flota'";
            qxnw.utils.populateSelect(d.ui.convenio, "master", "populate", data);

            d.ui.accept.addListener("execute", function () {
                var data = d.getRecord();
                self.navTableDetalleFuec.removeSelectedRow();
                self.navTableDetalleFuec.addRows([data]);
                d.accept();
            });
            d.ui.cancel.addListener("execute", function () {
                d.reject();
            });
            d.setModal(true);
            d.setTitle(self.tr("Tarifas fijas"));
            d.show();
            d.setRecord(pos);
        },
        contextdetalle: function contextdetalle(pos) {
            var self = this;
            var r = self.navTableDetalleFuec.selectedRecord();
            var m = new qxnw.contextmenu(self);
            m.addAction("Editar", qxnw.config.execIcon("document-properties"), function (e) {
                self.contextdetalleForm(r);
            });
            m.setParentWidget(self.navTableDetalleFuec);
            m.exec(pos);
        }

    }
});
