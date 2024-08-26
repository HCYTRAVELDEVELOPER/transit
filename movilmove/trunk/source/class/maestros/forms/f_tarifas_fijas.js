qx.Class.define("maestros.forms.f_tarifas_fijas", {
    extend: qxnw.forms,
    construct: function () {
        var self = this;
        this.base(arguments);
        this.createBase();
        this.setTitle(self.tr("Administración de tarifas fijas"));

        var fields = [
            {
                name: "id",
                label: self.tr("ID"),
                type: "textField",
                visible: false
            },

            {
                name: "",
                type: "startGroup",
                icon: "",
                mode: "grid"
            },
            {
                name: "ciudad_o_lugar_origen",
                label: self.tr("Ciudad o lugar origen"),
                type: "textField",
                row: 0,
                column: 0
            },
            {
                name: "valor",
                label: self.tr("Valor"),
                type: "textField",
                row: 0,
                column: 1
            },
            {
                name: "ciudad_o_lugar_destino",
                label: self.tr("Ciudad o lugar destino"),
                type: "textField",
                row: 0,
                column: 2
            },
            {
                name: "servicio_id",
                label: self.tr("Servicio id"),
                type: "selectBox",
                row: 1,
                column: 0
            },
            {
                name: "valor_metros_add",
                label: self.tr("Valor metros add"),
                type: "textField",
                row: 1,
                column: 1
            },
            {
                name: "inicia_metros_add",
                label: self.tr("Inicia metros add"),
                type: "textField",
                row: 1,
                column: 2
            },
            {
                name: "valor_peajes",
                label: self.tr("Valor peajes"),
                type: "textField",
                row: 2,
                column: 0
            },
            {
                type: "endGroup"
            },
            {
                name: "",
                type: "startGroup",
                icon: "",
                mode: "grid"
            },
            {
                name: "valor_recargo",
                label: self.tr("Valor recargo"),
                type: "textField",
                mode: "money",
                row: 0,
                column: 0
            },
            {
                name: "concepto_recargo",
                label: self.tr("Concepto recargo"),
                type: "textField",
                row: 0,
                column: 1
            },
            {
                name: "metros_cobro_peaje",
                label: self.tr("Metros cobro peaje"),
                type: "textField",
                row: 0,
                column: 2
            },
            {
                name: "metros_cobro_recargo",
                label: self.tr("Metros cobro recargo"),
                type: "textField",
                row: 1,
                column: 0
            },
            {
                name: "type",
                label: self.tr("Type"),
//                type: "textField",
                type: "selectBox",
                row: 1,
                column: 1
            },
            {
                name: "nombre",
                label: self.tr("Nombre"),
                type: "textField",
                row: 1,
                column: 2
            },
            {
                name: "valor_pasajero_adicional",
                label: self.tr("Valor pasajero adicional"),
                type: "textField",
                mode: "money",
                row: 3,
                column: 0
            },
            {
                name: "pasajero_adicional_rango_inicia_cobro",
                label: self.tr("Pasajero adicional rango inicia cobro"),
                type: "textField",
                row: 3,
                column: 1
            },
            {
                type: "endGroup"
            }
        ];
        self.setFields(fields);

        self.ui.accept.addListener("execute", function () {
            self.slotSave();
        });

        self.ui.cancel.addListener("execute", function () {
            self.reject();
        });

        var data = {};
        data ["urbano"] = "Urbano";
        data ["intermunicipal"] = "Intermunicipal";
        data ["airport"] = "Aeropuerto";
        qxnw.utils.populateSelectFromArray(self.ui.type, data);

        data = {};
        data.table = "edo_taximetro";
        qxnw.utils.populateSelect(self.ui.servicio_id, "master", "populate", data);

        self.navTable_servicios = new qxnw.navtable(self);

        var columns = [
            {

                label: self.tr("Id"),
                caption: "id"

            },
            {

                label: self.tr("Id tarifa"),
                caption: "id_tarifa"

            },
            {
                caption: "service",
                label: self.tr("Servicio")

            },
            {
                caption: "valor",
                label: self.tr("Valor")
            }
        ];

        self.navTable_servicios.setColumns(columns);
        self.navTable_servicios.hideColumn("id_tarifa");
        self.insertNavTable(self.navTable_servicios.getBase(), self.tr("Subservicios"));
        self.__addButon = self.navTable_servicios.getAddButton();
        self.__addButon.addListener("execute", function () {
            var d = new maestros.forms.f_servicios();
            d.settings.accept = function () {
                var data = d.getRecord();
                self.navTable_servicios.addRows([data]);
            };
            d.setModal(true);
            d.show();
        }, this);
        self.__removeButton = self.navTable_servicios.getRemoveButton();
        self.__removeButton.addListener("click", function () {
            var r = self.navTable_servicios.selectedRecord();
            if (r == undefined) {
                qxnw.utils.information(self.tr("Seleccione un registro para eliminar"));
                return;
            } else {
                qxnw.utils.question(self.tr("¿Está seguro de eliminar el registro?"), function (e) {
                    if (e == true) {
                        var rpc = new qxnw.rpc(self.getRpcUrl(), "configuracion_maestros", true);
                        var func = function (r) {
                            self.navTable_servicios.removeSelectedRow(r);
                        };
                        rpc.exec("eliminarServicios", r, func);
                    } else {
                        return;
                    }
                });
            }
        });
        self.navTable_servicios.setContextMenu("contextServicios");
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
        contextServicios: function contextServicios(pos) {
            var self = this;
            var r = self.navTable_servicios.selectedRecord();
            var m = new qxnw.contextmenu(self);
            m.addAction("Editar", qxnw.config.execIcon("document-properties"), function (e) {
                self.slotEditarServicios(r);
            });
            m.setParentWidget(self.navTable_servicios);
            m.exec(pos);
        },

        slotEditarServicios: function slotEditarServicios(pr) {
            var self = this;
            if (!pr) {
                qxnw.utils.information(self.tr("Seleccione Un registro por favor"));
                return;
            }
            var d = new maestros.forms.f_servicios();
            d.setParamRecord(pr);
            d.settings.accept = function () {
                self.navTable_servicios.removeSelectedRow();
                var data = d.getRecord();
                self.navTable_servicios.addRows([data]);
            };
            d.setModal(true);
            d.show();
        },

        slotSave: function slotSave() {
            var self = this;
            if (!self.validate()) {
                return;
            }
            var data = self.getRecord();
            data.servicios = self.navTable_servicios.getAllData();
            var rpc = new qxnw.rpc(self.getRpcUrl(), "configuracion_maestros");
            rpc.setAsync(true);
            var func = function (r) {
                console.log(r);
                self.accept();      
            };
            rpc.exec("saveTarifasFijas", data, func);

        },
        populateNavTable: function populateNavTable(data) {
            var self = this;
            var rpc = new qxnw.rpc(self.getRpcUrl(), "configuracion_maestros");
            rpc.setAsync(true);
            var func = function (r) {
                self.navTable_servicios.setModelData(r);
            };
            rpc.exec("populateNavtableSubservicios", data, func);

        }



    }

});
