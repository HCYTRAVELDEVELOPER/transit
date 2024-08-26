qx.Class.define("transmovapp.lists.l_pagos", {
    extend: qxnw.lists,
    construct: function (rs) {
        var self = this;
        this.base(arguments);
        this.buttonsAutomatic = true;
        this.createBase();
        var columns = [
            {
                label: self.tr("ID"),
                caption: "id"
            },
            {
                label: self.tr("Documento"),
                caption: "documento"
            },
            {
                label: self.tr("Nombre"),
                caption: "nombre"
            },
            {
                label: self.tr("Comprobante de pago"),
                caption: "comprobante_pago",
                type: "image",
                mode: "expand"
            },
            {
                label: self.tr("Valor"),
                caption: "valor"
            },
            {
                label: self.tr("Fecha de pago"),
                caption: "fecha_pago"
            },
            {
                label: self.tr("Estado"),
                caption: "estado"
            },
            {
                label: self.tr("Observaciones"),
                caption: "observaciones"
            },
            {
                label: self.tr("Tipo"),
                caption: "tipo"
            },
            {
                label: self.tr("Saldo"),
                caption: "saldo_anterior"
            },
            {
                label: self.tr("Nuevo saldo"),
                caption: "nuevo_saldo"
            },
            {
                label: self.tr("Usuario"),
                caption: "usuario"
            },
            {
                label: self.tr("Empresa"),
                caption: "empresa"
            },
            {
                label: self.tr("Fecha Creación"),
                caption: "fecha"
            }
        ];
        self.setColumns(columns);
        self.hideColumn("id");
        self.hideColumn("empresa");
        self.hideColumn("usuario");
        var filters = [
            {
                name: "usuario",
                label: self.tr("Conductor"),
                type: "selectTokenField"
            },
            {
                name: "fecha_inicio",
                label: self.tr("Fecha inicio"),
                type: "dateField"
            },
            {
                name: "fecha_fin",
                label: self.tr("Fecha final"),
                type: "dateField"
            },
            {
                name: "tipo",
                label: self.tr("Tipo"),
                type: "selectBox"
            },
            {
                name: "estado",
                label: self.tr("Estado"),
                type: "selectBox"
            }
        ];
        self.createFilters(filters);

        var t = {};
        t[""] = self.tr("Todos");
        t["PAGO"] = self.tr("PAGO");
        t["RETIRO"] = self.tr("RETIRO");
        qxnw.utils.populateSelectFromArray(self.ui.tipo, t);
        
        var t = {};
        t[""] = self.tr("Todos");
        t["SOLICITUD"] = self.tr("SOLICITUD");
        t["EN REVISION"] = self.tr("EN REVISION");
        t["RECHAZADO"] = self.tr("RECHAZADO");
        t["APROBADO"] = self.tr("APROBADO");
        qxnw.utils.populateSelectFromArray(self.ui.estado, t);

        self.ui.usuario.addListener("loadData", function (e) {
            var data = {};
            data["token"] = e.getData();
            var rpc = new qxnw.rpc(self.getRpcUrl(), "servicios_admin");
            rpc.setAsync(true);
            var func = function (r) {
                self.ui.usuario.setModelData(r);
            };
            rpc.exec("populateTokenConductor", data, func);
        }, this);


        self.ui.deleteButton.setVisibility("excluded");
        self.ui.newButton.addListener("click", function () {
            self.slotNuevo();
        });
        self.ui.deleteButton.addListener("click", function () {
            self.slotEliminar();
        });
        self.ui.editButton.addListener("click", function () {
            self.slotEditar();
        });
        self.ui.updateButton.addListener("click", function () {
            self.applyFilters();
        });
        self.ui.searchButton.addListener("execute", function () {
            self.applyFilters();
        });
        self.ui.newButton.setEnabled(false);
        self.ui.editButton.setEnabled(false);
//        self.execSettings();
        self.applyFilters();
    },
    destruct: function () {
    },
    members: {
        contextMenu: function contextMenu(pos) {
            var self = this;
            var data = self.selectedRecord();
            console.log(data);
            if (data.estado != "APROBADO" && data.estado != "RECHAZADO") {
                var m = new qxnw.contextmenu(this);
                m.addAction("APROBADO", "icon/16/actions/format-text-direction-rtl.png", function (e) {
                    data.estado = "APROBADO";
                    self.slotCambiaEstado(data);
                });
                m.addAction("Rechazar", "icon/16/actions/format-text-direction-rtl.png", function (e) {
                    data.estado = "RECHAZADO";
                    self.slotCambiaEstado(data);
                });
                m.exec(pos);
            }
        },
        applyFilters: function applyFilters() {
            var self = this;
            var data = {};
            data.filters = self.getFiltersData();
            var rpc = new qxnw.rpc(self.getRpcUrl(), "servicios_admin", true);
            var func = function (r) {
//                console.log(r);
                self.setModelData(r);
            };
            rpc.exec("consultaPagos", data, func);
        },
        slotCambiaEstado: function slotCambiaEstado(data) {
            var self = this;
            if (data == undefined) {
                qxnw.utils.alert(self.tr("Seleccione un registro"));
                return;
            }
            var rpc = new qxnw.rpc(self.getRpcUrl(), "servicios_admin", true);
            var func = function (r) {
//                console.log(r);
                var estado = data.estado.toLowerCase();
                qxnw.utils.alert(self.tr("Pago " + estado + " correctamente"));
                self.applyFilters();
            };
            rpc.exec("aprobarPago", data, func);
        },
        slotNuevo: function slotNuevo() {
            var self = this;
            var t = main.getConfiguracion();
            var d = new transmovapp.forms.f_vehiculo(t);
            d.settings.accept = function () {
                self.applyFilters();
            };
            d.show();
            d.setModal(true);
        },
        slotEditar: function slotEditar() {
            var self = this;
            var r = self.selectedRecord();
            if (r == undefined) {
                qxnw.utils.alert(self.tr("Seleccione un registro"));
                return;
            }
            var t = main.getConfiguracion();
            var d = new transmovapp.forms.f_vehiculo(t);
            d.setParamRecord(r);
            d.settings.accept = function () {
                self.applyFilters();
            };
            d.setModal(true);
            d.show();
        }
    }
});