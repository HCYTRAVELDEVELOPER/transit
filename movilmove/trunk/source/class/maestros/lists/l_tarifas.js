qx.Class.define("maestros.lists.l_tarifas", {
    extend: qxnw.lists,
    construct: function () {
        var self = this;
        this.base(arguments);
        this.buttonAutomatic = true;
        this.createBase();
        var columns = [
            {
                label: self.tr("Id"),
                caption: "id"
            },
            {
                label: self.tr("Metros"),
                caption: "metros"
            },
            {
                label: self.tr("Tiempo (segundos)"),
                caption: "tiempo"
            },
            {
                label: self.tr("Valor unidad tiempo"),
                caption: "valor_unidad_tiempo"
            },
            {
                label: self.tr("Valor unidad metros"),
                caption: "valor_unidad_metros"
            },
            {
                label: self.tr("Valor banderazo"),
                caption: "valor_banderazo"
            },
            {
                label: self.tr("Iva"),
                caption: "iva"
            },
            {
                label: self.tr("Valor mínimo"),
                caption: "minima"
            },
            {
                label: self.tr("Minutos mínimos duración servicio"),
                caption: "minutosMinimosParaPedirService"
            },
            {
                label: self.tr("Tipo servicio"),
                caption: "tipo_servicio"
            },
            {
                label: self.tr("Valor mascota"),
                caption: "valor_mascota"
            },
            {
                label: self.tr("Icono"),
                caption: "icono",
                type: "image",
                mode: "phpthumb"
            },
            {
                label: self.tr("Solo para mujeres"),
                caption: "solo_para_mujeres"
            },
            {
                label: self.tr("Orden"),
                caption: "orden"
            },
            {
                label: self.tr("Pide vehiculo cliente"),
                caption: "pide_vehiculo_cliente"
            },
            {
                label: self.tr("Mostrar fecha hora"),
                caption: "mostrar_fecha_hora"
            },
            {
                label: self.tr("Minutos agregar a fecha"),
                caption: "minutos_agregar_a_fecha"
            },
            {
                label: self.tr("Descuento maximo"),
                caption: "descuento_maximo"
            },
            {
                label: self.tr("Reservar"),
                caption: "reservar"
            },
            {
                label: self.tr("Nombre"),
                caption: "nombre"
            },
            {
                label: self.tr("Cargue"),
                caption: "cargue"
            },
            {
                label: self.tr("Descargue"),
                caption: "descargue"
            },
            {
                label: self.tr("Porcentaje valor declarado"),
                caption: "porcentaje_valor_declarado"
            },
            {
                label: self.tr("Retorno"),
                caption: "retorno"
            }
        ];
        self.setColumns(columns);
        self.hideColumn("id");

        var filters = [
            {
                name: "buscar",
                label: self.tr("Buscar..."),
                caption: "buscar",
                type: "textField"
            },
            {
                name: "fecha_inicial",
                label: self.tr("Fecha inicial"),
                type: "dateField"
            },
            {
                name: "fecha_final",
                label: self.tr("Fecha final"),
                type: "dateField"
            }
        ];
        self.createFilters(filters);

        self.ui.newButton.addListener("click", function () {
            self.slotNuevo();
        });
        self.ui.editButton.addListener("click", function () {
            self.slotEditar();
        });
        self.ui.deleteButton.addListener("click", function () {
//            self.slotEliminar();
        });
        self.ui.selectAllButton.addListener("click", function () {
            self.selectAll();
        });
        self.ui.searchButton.addListener("execute", function () {
            self.applyFilters();
        });
        self.ui.updateButton.addListener("click", function () {
            self.applyFilters();
        });

        self.applyFilters();
    },
    destruct: function () {
    },
    members: {

        contextMenu: function contextMenu(pos) {
            var self = this;
            var m = new qxnw.contextmenu(this);
            m.addAction("Editar", "icon/16/actions/document-properties.png", function (e) {
                self.slotEditar();
            });
//            m.addAction("Eliminar", "icon/16/actions/edit-delete.png", function (e) {
//                qxnw.utils.question(self.tr("¿Está seguro de eliminar el registro?"), function (e) {
//                    if (e) {
//                        self.slotEliminar();
//                    } else {
//                        return;
//                    }
//                });
//            });
            m.exec(pos);
            var data = self.selectedRecord();
            var up = qxnw.userPolicies.getUserData();
        },

        applyFilters: function applyFilters() {
            var self = this;
            var data = {};
            data.filters = self.getFiltersData();
            var rpc = new qxnw.rpc(self.getRpcUrl(), "configuracion_maestros");
            rpc.setAsync(true);
            var func = function (r) {
                console.log(r);
                self.setModelData(r);
            };
            rpc.exec("consultaTarifas", data, func);
        },

        slotNuevo: function slotNuevo() {
            var self = this;
            var d = new maestros.forms.f_tarifas();
            d.settings.accept = function () {
                self.applyFilters();
            };
            d.show();
//             d.setModal(true);
        },
        slotEditar: function slotEditar() {
            var self = this;
            var r = self.selectedRecord();
            if (r == undefined) {
                qxnw.utils.alert(self.tr("Seleccione un registro"));
                return;
            }
            var d = new maestros.forms.f_tarifas();
            d.setParamRecord(r);
            d.settings.accept = function () {
                self.applyFilters();
            };
            d.show();
        },

        slotEliminar: function slotEliminar() {
            var self = this;
            var r = self.selectedRecord();
            if (r == undefined) {
                qxnw.utils.alert(self.tr("Seleccione un registro"));
                return;
            }
            var rpc = new qxnw.rpc(this.rpcUrl, "configuracion_maestros");
            rpc.exec("EliminarTarifa", r);
            if (rpc.isError()) {
                qxnw.utils.error(rpc.getError());
                return;
            }
            self.removeSelectedRow();
        }
    }
});