qx.Class.define("transmovapp.lists.l_empresas_flotas", {
    extend: qxnw.lists,
    construct: function (portal) {
        var self = this;
        this.base(arguments);
        this.buttonsAutomatic = true;
        this.createBase();
        var up = qxnw.userPolicies.getUserData();
        self.__conf = main.getConfiguracion();
        self.portal = false;
        if (portal) {
            self.portal = true;
        }
        var columns = [
            {
                label: "ID",
                caption: "id"
            },
            {
                label: "Usuario",
                caption: "usuario"
            },
            {
                label: "Empresa",
                caption: "empresa"
            },
            {
                label: "Fecha",
                caption: "fecha"
            },
            {
                label: "Nombre",
                caption: "nombre"
            },
            {
                label: "NIT",
                caption: "nit"
            },
            {
                label: "Razón Social",
                caption: "razon_social"
            },
            {
                label: "Dirección",
                caption: "direccion"
            },
            {
                label: "Teléfono",
                caption: "telefono"
            },
            {
                label: "ID Ciudad",
                caption: "ciudad"
            },
            {
                label: "Ciudad",
                caption: "ciudad_text"
            },
            {
                label: "Logo",
                caption: "logo",
                type: "image",
                mode: "phpthumb"
            },
            {
                label: "Encargado",
                caption: "encargado"
            },
            {
                label: "Correo",
                caption: "correo"
            },
            {
                label: "Saldo",
                caption: "tope_saldo"
            },
            {
                label: "Contrato",
                caption: "contrato",
                type: "image",
                mode: "phpthumb"
            },
            {
                label: "Adjuntar Contrato",
                caption: "adjuntar",
                type: "html"
            },
            {
                label: "Permisos",
                caption: "permisos_row",
                type: "html"
            },
            {
                label: "Permisos",
                caption: "permisos"
            },
            {
                label: "Numero contacto reponsable",
                caption: "numero_contacto_reponsable",
                visible: false
            },
            {
                label: "Numero de identificación reponsable",
                caption: "identificacion_reponsable",
                visible: false
            },
            {
                label: "Dirección reponsable",
                caption: "direccion_reponsable",
                visible: false
            },
            {
                label: "Firma representante legal",
                caption: "firma_representante_legal",
                visible: false
                
            }
        ];
        self.setColumns(main.labels(columns, "empresas"));

        console.log(self.portal);
        if (self.__conf.app_para == "CARGA" || self.portal == true) {
            self.excludeColumn("permisos_row");
            self.excludeColumn("permisos");
        } else {
            self.hideColumn("permisos_row", true);
        }


        var filters = [
            {
                name: "buscar",
                caption: "buscar",
                label: "Filtro...",
                type: "textField"
            }
        ];
        self.createFilters(filters);

        self.table.setRowHeight(50);
        self.setAllPermissions(true);

        self.ui.deleteButton.addListener("click", function () {
            self.slotEliminar();
        });
        self.ui.editButton.addListener("click", function () {
            self.slotEditar();
        });
        self.ui.unSelectButton.addListener("click", function () {
            self.clearSelection();
        });
        self.ui.selectAllButton.addListener("click", function () {
            self.selectAll();
        });
        self.ui.updateButton.addListener("click", function () {
            self.applyFilters();
        });
        self.ui.searchButton.addListener("execute", function () {
            self.applyFilters();
        });
        self.ui.newButton.addListener("click", function () {
            self.slotNuevo();
        });
        self.table.addListener("cellTap", function (e) {
            var col = e.getColumn();
            console.log(col);
            if (col === 16) {
                self.slotAdjuntar();
            }
//            if (col === 17) {
//                self.slotTiempos();
//            }
//            if (col === 17) {
//                self.slotPermisos();
//            }
        });

//        self.execSettings();
        self.hideColumn("id");
        self.hideColumn("usuario");
        self.hideColumn("empresa");
        self.hideColumn("fecha");
        self.hideColumn("ciudad");
        self.hideColumn("permisos");


        self.applyFilters();
    },
    destruct: function () {
    },
    members: {
        contextMenu: function contextMenu(veteapp) {
            var self = this;
            var m = new qxnw.contextmenu(this);
            var r = self.selectedRecord();
            if (r == undefined) {
//                qxnw.utils.alert("Seleccione un registro");
                return;
            } else {
                m.addAction("Editar", "icon/16/actions/document-properties.png", function (e) {
                    self.slotEditar();
                });
                m.addAction("Eliminar", "icon/16/actions/edit-delete.png", function (e) {
                    qxnw.utils.question("¿Está seguro de eliminar el registro?", function (e) {
                        if (e) {
                            self.slotEliminar();
                        } else {
                            return;
                        }
                    });
                });
                if (r.tiempo_espera == true) {
                    m.addAction("Ver tiempos establecidos", "icon/16/actions/document-open-recent.png", function (e) {
                        self.slotVerTiempos();
                    });
                }
            }
            m.exec(veteapp);
        },
        applyFilters: function applyFilters() {
            var self = this;
            var data = {};
            data.filters = self.getFiltersData();
            if (self.__conf.usa_flotas_clientes == "SI") {

                if (self.portal) {
                    data.tipo_empresa = "Cliente";
                } else {
                    data.tipo_empresa = "Flota";
                }
            }
            var rpc = new qxnw.rpc(self.getRpcUrl(), "empresas");
            var r = rpc.exec("execPage", data);
            if (rpc.isError()) {
                qxnw.utils.error(rpc.getError());
                return;
            }
            for (var i = 0; i < r.records.length; i++) {
                if (r.records[i].tiempo_espera === "1") {
                    r.records[i].tiempo_espera = true;
                } else {
                    r.records[i].tiempo_espera = false;
                }
            }
            self.setModelData(r);
        },
        slotNuevo: function slotNuevo() {
            var self = this;
            var d = new transmovapp.forms.f_empresas_flotas(self.portal);
            d.settings.accept = function () {
                self.applyFilters();
            };
            d.show();
        },
        slotVerTiempos: function slotVerTiempos() {
            var self = this;
            var r = self.selectedRecord();
            var d = new qxnw.forms();
            var fields = [];
            d.setFields(fields);
            d.navTable = new transmovapp.lists.l_tiempos;
            d.insertNavTable(d.navTable.getBase(), "Tiempos establecidos");
//            d.navTable.hideFooterTools();
//            d.navTable.hideTools();
            d.navTable.ui.empresa.setValue(r.empresa);
            d.navTable.ui["part1"].setVisibility("excluded");
            d.navTable.ui["part3"].setVisibility("excluded");
            d.navTable.ui["part4"].setVisibility("excluded");
            d.navTable.ui.newButton.setVisibility("excluded");
            d.show();
//            d.navTable.ui.minimizeFiltersButton.setVisibility("excluded");
//            d.navTable.ui.searchButton.setVisibility("excluded");
//            d.set({showClose: false, showMinimize: false, showMaximize: false});
            d.ui.accept.addListener("execute", function () {
                var dataZarpe = d.navTable.getFiltersData();
                dataZarpe.detalle = d.navTable.getAllData();
                if (parseFloat(dataZarpe.suma_cantidad_cantidad_kg) < parseFloat(dataZarpe.cantidad_kg)) {
                    qxnw.utils.information(self.tr("La cantidad de N° de sacos de café excelso de contrato es menor a la de N° de sacos de café de informe. Verifique por favor"));
                    return;
                } else {
                    var rpc = new qxnw.rpc(self.getRpcUrl(), "remision", true);
                    var func = function (r) {
                        d.accept();
                        self.accept();
                    };
                    rpc.exec("saveZarpe", dataZarpe, func);
                }
            });
            d.ui.cancel.addListener("execute", function () {
                d.reject();
            });
            d.navTable.applyFilters();
            d.setTitle(self.tr("Tiempos por Empresa"));
        },
        slotAdjuntar: function slotAdjuntar() {
            var self = this;
            var r = self.selectedRecord();
            if (r == undefined) {
                qxnw.utils.alert("Seleccione un registro");
                return;
            }
            var f = new qxnw.forms();
            f.setTitle("Adjuntar Contrato");
            var fields = [
                {
                    name: "id",
                    label: "ID",
                    caption: "id",
                    type: "textField",
                    required: true,
                    visible: false
                },
                {
                    name: "contrato",
                    label: "Contrato",
                    caption: "contrato",
                    type: "uploader",
                    required: true
                }
            ];
            f.setFields(fields);
            f.ui.id.setValue(r.id.toString());
            f.setModal(true);
            f.show();
            f.ui.accept.addListener("execute", function () {
                if (!f.validate()) {
                    return;
                }
                var data = f.getRecord();
                var rpc = new qxnw.rpc(self.getRpcUrl(), "empresas");
                rpc.setAsync(true);
                var func = function () {
                    f.accept();
                    self.applyFilters();
                };
                rpc.exec("adjuntar", data, func);
            });
            f.ui.cancel.addListener("execute", function () {
                f.reject();
            });
        },
        slotTiempos: function slotTiempos() {
            var self = this;
            var r = self.selectedRecord();
            if (r == undefined) {
                qxnw.utils.alert("Seleccione un registro");
                return;
            }
            var f = new qxnw.forms();
            f.setTitle("Establecer tiempos de espera");
            var fields = [
                {
                    name: " ",
                    type: "startGroup",
                    icon: "",
                    mode: "horizontal"
                },
                {
                    name: "id",
                    label: "ID",
                    caption: "id",
                    type: "textField",
                    visible: false
                },
                {
                    name: "empresa",
                    label: "ID Empresa",
                    caption: "empresa",
                    type: "textField",
                    required: true,
                    visible: false
                },
                {
                    name: "empresa_text",
                    label: "Empresa",
                    caption: "empresa_text",
                    type: "textField",
                    required: true,
                    visible: false
                },
                {
                    name: "label",
                    label: "<strong>Seleccione el tiempo de espera para la subcategoria o el recargo.</strong>",
                    caption: "label",
                    type: "label"
                },
                {
                    name: "",
                    type: "endGroup",
                    icon: ""
                },
                {
                    name: " ",
                    type: "startGroup",
                    icon: "",
                    mode: "horizontal"
                },
                {
                    name: "subcategoria",
                    label: "Subcategoria",
                    caption: "subcategoria",
                    type: "selectBox",
                    required: true
                },
                {
                    name: "recargo",
                    label: "Recargo",
                    caption: "recargo",
                    type: "selectBox",
                    required: true
                },
                {
                    name: "",
                    type: "endGroup",
                    icon: ""
                },
                {
                    name: " ",
                    type: "startGroup",
                    icon: "",
                    mode: "horizontal"
                },
                {
                    name: "desde",
                    label: "Origen/Destino",
                    caption: "desde",
                    type: "selectBox"
                },
                {
                    name: "tiempo",
                    label: "Tiempo espera (min)",
                    caption: "tiempo",
                    type: "textField",
                    mode: "integer",
                    required: true
                },
                {
                    name: "",
                    type: "endGroup",
                    icon: ""
                }
            ];
            f.setFields(fields);
            f.ui.empresa.setValue(r.id.toString());
            f.ui.empresa_text.setValue(r.nombre.toString());
            f.setModal(true);
            f.setFieldVisibility(f.ui.desde, "excluded");

            var data = {};
            data[""] = "Todas";
            qxnw.utils.populateSelectFromArray(f.ui.subcategoria, data);
            data.table = "edo_subcategoria";
            qxnw.utils.populateSelect(f.ui.subcategoria, "master", "populate", data);
            var data = {};
            data[""] = "Todas";
            qxnw.utils.populateSelectFromArray(f.ui.recargo, data);
            data.table = "edo_recargos";
            qxnw.utils.populateSelect(f.ui.recargo, "master", "populate", data);
            var data = {};
            data["Origen"] = "Origen";
            data["Destino"] = "Destino";
            qxnw.utils.populateSelectFromArray(f.ui.desde, data);

            f.ui.subcategoria.addListener("changeSelection", function () {
                var r = this.getValue();
                console.log(r);
                if (r.subcategoria != "") {
                    f.ui.recargo.setEnabled(false);
                    f.ui.recargo.setValue("");
                    f.setRequired("recargo", false);
                } else {
                    f.ui.recargo.setEnabled(true);
                    f.setRequired("recargo", true);
                }
            });
            f.ui.recargo.addListener("changeSelection", function () {
                var r = this.getValue();
                if (r.recargo != "") {
                    f.ui.subcategoria.setEnabled(false);
                    f.ui.subcategoria.setValue("");
                    f.setRequired("subcategoria", false);
                } else {
                    f.ui.subcategoria.setEnabled(true);
                    f.setRequired("subcategoria", true);
                }
            });
            f.ui.recargo.addListener("changeSelection", function () {
                var r = this.getValue();
                console.log(r);
                if (r.recargo === "1") {
                    f.setFieldVisibility(f.ui.desde, "visible");
                    f.setRequired("desde", true);
                } else {
                    f.setFieldVisibility(f.ui.desde, "excluded");
                    f.setRequired("desde", false);
                }
            });

            f.show();
            f.ui.accept.addListener("execute", function () {
                if (!f.validate()) {
                    return;
                }
                var data = f.getRecord();
                var rpc = new qxnw.rpc(self.getRpcUrl(), "empresas");
                rpc.setAsync(true);
                var func = function () {
                    f.accept();
                    self.applyFilters();
                };
                rpc.exec("tiempo_espera", data, func);
            });
            f.ui.cancel.addListener("execute", function () {
                f.reject();
            });
        },
        slotEditar: function slotEditar() {
            var self = this;
            var r = self.selectedRecord();
            if (r == undefined) {
                qxnw.utils.alert("Seleccione un registro");
                return;
            }
            var d = new transmovapp.forms.f_empresas_flotas(self.portal);
            if (!d.setParamRecord(r)) {
                qxnw.utils.alert("No se usó el setParamRecord");
                return;
            }
            d.settings.accept = function () {
                self.applyFilters();
            };
            d.show();
        },
        slotEliminar: function slotEliminar() {
            var self = this;
            var r = self.selectedRecord();
            if (r == undefined) {
                qxnw.utils.alert("Seleccione un registro");
                return;
            }
            var rpc = new qxnw.rpc(this.rpcUrl, "empresas");
            rpc.exec("eliminar", r);
            if (rpc.isError()) {
                qxnw.utils.error(rpc.getError());
                return;
            }
            self.removeSelectedRow();
        },
        setParamRecord: function setParamRecord(pr) {
            var self = this;
            self.applyFilters();
            return true;
        }
    }
});