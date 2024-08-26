qx.Class.define("nwsites.lists.l_salidas", {
    extend: qxnw.lists,
    construct: function() {
        var self = this;
        this.base(arguments);
        self.setSelectMultiCell(true);
        this.buttonsAutomatic = true;
        this.createBase();
        var columns = [
            {
                label: "Estado ID",
                caption: "estado"
            },
            {
                label: "Estado ID Otros",
                caption: "estado_other"
            },
            {
                label: "N° Pedido",
                caption: "id"
            },
            {
                label: "Fecha",
                caption: "fecha_salida",
                type: "datetime"
            },
            {
                label: "Estado IMG",
                caption: "estado_img",
                type: "html"
            },
            {
                label: "Estado",
                caption: "nom_estado"
            },
            {
                label: "Cliente ID",
                caption: "cliente"
            },
            {
                label: "Cliente",
                caption: "cliente_text"
            },
            {
                label: "Mail",
                caption: "email"
            },
            {
                label: "Dirección",
                caption: "direccion"
            },
            {
                label: "N° Apto/Casa",
                caption: "aptocasa"
            },
            {
                label: "Telefono",
                caption: "telefono"
            },
            {
                label: "Sub Total",
                caption: "sub_total",
                type: "money"
            },
            {
                label: "Valor Domicilio",
                caption: "costo_domicilio",
                type: "money"
            },
            {
                label: "Valor Total",
                caption: "valor_total",
                type: "money"
            },
            {
                label: "Cantidad Total",
                caption: "cantidad_total"
            },
            {
                label: "Barrio",
                caption: "barrio"
            },
            {
                label: "Acción",
                caption: "aceptar",
                type: "html"
            },
            {
                label: "Acción",
                caption: "rechazar",
                type: "html"
            },
            {
                label: "Observaciones",
                caption: "observaciones"
            },
            {
                label: "Comentarios",
                caption: "comentario"
            },
            {
                label: "Forma de Pago",
                caption: "forma_pago"
            },
            {
                label: "Motivo traslado ID",
                caption: "motivo_traslado"
            },
            {
                label: "Motivo traslado",
                caption: "motivo_traslado_text"
            },
            {
                label: "Observaciones traslado",
                caption: "observaciones_traslado"
            },
            {
                label: "Tienda ID",
                caption: "terminal"
            },
            {
                label: "Tienda",
                caption: "terminal_text"
            },
            {
                label: "Operador ID",
                caption: "usuario"
            },
            {
                label: "Estado En Línea",
                caption: "estado_pago"
            },
            {
                label: "Ref Pago En Línea",
                caption: "ref_pago"
            },
            {
                label: "Medio Pago Online",
                caption: "medio_pago"
            },
            {
                label: "CUS",
                caption: "cus"
            },
            {
                label: "Fecha actualización PayU",
                caption: "fecha_actualizacion_payu"
            },
            {
                label: "Forma Respuesta PayU",
                caption: "forma_respuesta_payu"
            },
            {
                label: "Operador",
                caption: "usuario_text"
            }
        ];
        this.setColumns(columns);
        var filters = [
            {
                name: "buscar",
                caption: "buscar",
                label: "Filtro...",
                type: "textField"
            },
            {
                name: "estado",
                caption: "estado",
                label: "Estado",
                type: "selectBox"
            },
            {
                name: "terminal",
                caption: "terminal",
                label: "Tienda",
                type: "selectBox"
            },
            {
                name: "cliente",
                caption: "Cliente",
                label: "Cliente",
                type: "selectTokenField"
            },
            {
                name: "fecha_inicial",
                caption: "fecha_inicial",
                label: "Fecha Inicial",
                type: "dateField",
                required: true
            },
            {
                name: "fecha_final",
                caption: "fecha_final",
                label: "Fecha Final",
                type: "dateField",
                required: true
            }
        ];
        self.createFilters(filters);
//        var render = new qxnw.rowRenderer();
//        render.setHandleData(1, "0", "#AC1515");
//        render.setHandleData(0, "1", "#FFFB00");
//        render.setHandleData(0, "2", "#04A954");
//        render.setHandleData(0, "3", "green");
//        render.setHandleData(0, "4", "#ccc");
//        self.table.setDataRowRenderer(render);
//        self.spinnerUpdate.setValue(10);
//        self.Check.setValue(true);
        var data = {};
        data[""] = "Todas";
        qxnw.utils.populateSelectFromArray(self.ui.estado, data);
        qxnw.utils.populateSelectFromArray(self.ui.terminal, data);
        data = {};
        data.table = "terminales";
        qxnw.utils.populateSelect(self.ui.terminal, "master", "populate", data);

        data.table = "pv_estados_salidas";
        qxnw.utils.populateSelect(self.ui.estado, "master", "populate", data);

        self.ui.cliente.addListener("loadData", function(e) {
            var data = {};
            data["token"] = e.getData();
            var rpc = new qxnw.rpc(self.getRpcUrl(), "pv");
            rpc.setAsync(true);
            var func = function(r) {
                self.ui.cliente.setModelData(r);
            };
            rpc.exec("populateTokenClientes", data, func);
        }, this);
//        self.ui.estado.setValue(2);
        self.ui.newButton.addListener("click", function() {
            self.slotNuevo();
        });
        self.ui.deleteButton.addListener("click", function() {
            self.slotEliminar();
        });
        self.ui.editButton.addListener("click", function() {
            self.slotEditar();
        });
        self.ui.unSelectButton.addListener("click", function() {
            self.clearSelection();
        });
        self.ui.selectAllButton.addListener("click", function() {
            self.selectAll();
        });
        self.ui.updateButton.addListener("click", function() {
            self.applyFilters();
        });
        self.ui.searchButton.addListener("execute", function() {
            self.applyFilters();
        });
        self.execSettings();
        var up = qxnw.userPolicies.getUserData();
        if (up.profile != "1") {
            self.ui.terminal.setEnabled(false);
        } else {
            self.ui.terminal.setEnabled(true);
        }
        self.hideColumn("estado");
        self.hideColumn("medio");
        self.hideColumn("zona");
        self.hideColumn("observaciones");
        self.hideColumn("motivo_traslado");
        self.hideColumn("motivo_traslado_text");
        self.hideColumn("terminal");
//        self.hideColumn("terminal_text");
        self.hideColumn("usuario");
        self.hideColumn("usuario_text");
        self.hideColumn("email");
        self.hideColumn("cantidad_total");
        self.hideColumn("barrio");
//        self.hideColumn("forma_pago");
        self.hideColumn("estado_other");
        self.table.setRowHeight(35);
        self.table.addListener("cellTap", function(e) {
            var col = e.getColumn();
            var val = self.selectedRecord();
            if (col == 17) {
                if (val.estado == "1") {
                    self.slotAceptar();
                } else {
//                    self.slotEditar();
                    self.slotImprimir();
                }
            }
            if (col == 18) {
                if (val.estado == "1") {
                    self.slotRechazar();
                } else {
//                    self.slotEditar();
                    self.slotImprimir();
                }
            }
        });

//        self.execSettings();
//        self.processPermissions();
//        self.applyFilters();
    },
    destruct: function() {
    },
    statics: {
//        slotAtender: function slotAtender(id, vista) {
//            var sl = {};
//            sl["id"] = id;
//            sl["vista"] = vista;
//            if (sl == undefined) {
//                qxnw.utils.alert("Seleccione un registro");
//                return;
//            }
//            var f = new nwsites.forms.f_pedido;
//            if (!f.setParamRecordAtender(sl)) {
//                qxnw.utils.alert("No se usó el setParamRecord");
//                return;
//            }
//            f.setModal(true);
//            f.setWidth(800);
//            f.setHeight(700);
//            f.show();
//        },
//        slotPopUp: function slotPopUp(data) {
//            var self = this;
//            var d = new qxnw.forms();
//            d.setTitle(self("Nuevo Pedido!"));
//            var fields = [
//                {
//                    name: "Observaciones",
//                    type: "startGroup",
//                    icon: "",
//                    mode: "horizontal"
//                },
//                {
//                    name: "pedido",
//                    label: "Pedido",
//                    type: "label"
//                },
//                {
//                    name: "",
//                    type: "endGroup",
//                    icon: ""
//                }
//            ];
//            d.setFields(fields);
//            d.ui.pedido.setValue(data);
//            d.show();
//            d.ui.accept.addListener("execute", function() {
//            });
//            d.ui.cancel.addListener("execute", function() {
//                d.reject();
//            });
//        }
    },
    members: {
        contextMenu: function contextMenu(pos) {
            var self = this;
            var m = new qxnw.contextmenu(this);
            var sl = self.selectedRecord();
            if (sl.estado == "1") {
                var sls = self.selectedRecords();
                m.addAction("Facturar", "icon/16/actions/document-save.png", function(e) {
                    self.slotEditar();
                });
                m.addAction("Trasladar Pedido", "icon/16/actions/view-sort-ascending.png", function(e) {
                    self.slotTrasladarPedido();
                });
            }
            else {
                m.addAction("Imprimir", "icon/16/actions/document-print.png", function(e) {
                    self.slotImprimir();
                });
            }

            m.exec(pos);
        },
        applyFilters: function applyFilters() {
            var self = this;
            var data = {};
            data.filters = self.getFiltersData();
            data.tipo = self.tipo;
            var rpc = new qxnw.rpc(self.getRpcUrl(), "pv_nwsites");
            rpc.setAsync(true);
            var func = function(r) {
                var total = r.recordCount;
                if (total > 0) {
//                    qxnw.utils.makeSound();
                }
                self.setModelData(r);
            };
            rpc.exec("consultaSalidasNwsites", data, func);
        },
        slotNuevo: function slotNuevo()
        {
            var self = this;
            qxnw.utils.loading("Un momento por favor, cargando elementos de tiquet...");
            var interval = setInterval(function() {
                var d = new nwsites.forms.f_salidas();
                d.settings.accept = function() {
                    self.applyFilters();
                };
                d.setWidth(1300);
                d.setHeight(800);
                d.setModal(true);
                d.show();
                clearInterval(interval);
                qxnw.utils.stopPopup();
            }, 100);
        },
        slotEditar: function slotEditar()
        {
            var self = this;
            var r = self.selectedRecord();
            if (r == undefined)
            {
                qxnw.utils.alert("Seleccione un registro");
                return;
            }
            var d = new nwsites.forms.f_salidas();
            if (!d.setParamRecord(r)) {
                qxnw.utils.alert("No se usó el setParamRecord");
                return;
            }
            d.settings.accept = function() {
                self.applyFilters();
            }
            d.show();
        },
        slotTrasladarPedido: function slotTrasladarPedido() {
            var self = this;
            var data = {};
            var sl = self.selectedRecord();
            qxnw.utils.question("¿Está seguro de trasladar este pedido?", function(e) {
                if (e) {
                    var d = new qxnw.forms();
                    d.setTitle(self.tr("Observaciones Traslado Pedido"));
                    var fields = [
                        {
                            name: "Observaciones",
                            type: "startGroup",
                            icon: "",
                            mode: "horizontal"
                        },
                        {
                            name: "observaciones",
                            label: "Observaciones",
                            type: "textArea"
                        },
                        {
                            name: "motivo_traslado",
                            label: "Motivo traslado",
                            type: "selectBox"
                        },
                        {
                            name: "terminal",
                            label: "Tienda",
                            type: "selectBox"
                        },
                        {
                            name: "",
                            type: "endGroup",
                            icon: ""
                        }
                    ];
                    d.setFields(fields);
                    d.show();
                    var data = {};
                    data[""] = "Todas";
                    qxnw.utils.populateSelectFromArray(d.ui.terminal, data);
                    qxnw.utils.populateSelectFromArray(d.ui.motivo_traslado, data);
                    data.table = "pv_anular";
                    qxnw.utils.populateSelect(d.ui.motivo_traslado, "master", "populate", data);
                    data.table = "terminales";
                    qxnw.utils.populateSelect(d.ui.terminal, "master", "populate", data);
                    d.ui.accept.addListener("execute", function() {
                        var data = d.getRecord();
                        data.id = sl.id;
                        var rpc = new qxnw.rpc(self.getRpcUrl(), "pv_nwsites");
                        rpc.setAsync(true);
                        var func = function(r) {
                            qxnw.utils.information("Se ha trasladado el pedido N° " + sl.id);
                            d.accept();
                            self.applyFilters();
                        };
                        rpc.exec("updateTrasladarPedido", data, func);
                    });
                    d.ui.cancel.addListener("execute", function() {
                        d.reject();
                    });
//                    

                } else {
                    return;
                }
            });
        },
        slotAceptar: function slotAceptar() {
            var self = this;
            self.slotImprimir();
//            var r = self.selectedRecord();
//            if (r == undefined)
//            {
//                qxnw.utils.alert("Seleccione un registro");
//                return;
//            }
//            var d = new nwsites.forms.f_pedido();
//            if (!d.setParamRecord(r)) {
//                qxnw.utils.alert("No se usó el setParamRecord");
//                return;
//            }
//            d.settings.accept = function() {
//                self.applyFilters();
//            };
//            d.show();
        },
        slotRechazar: function slotRechazar()
        {
            var self = this;
            var r = self.selectedRecord();
            if (r == undefined)
            {
                qxnw.utils.alert("Seleccione un registro");
                return;
            }
            var d = new nwsites.forms.f_pedido_rechazar();
            if (!d.setParamRecord(r)) {
                qxnw.utils.alert("No se usó el setParamRecord");
                return;
            }
            d.settings.accept = function() {
                self.applyFilters();
            }
            d.show();
        },
        setParamOrdenPedido: function setParamOrdenPedido(pr) {
            var self = this;
            self.tipo = pr.tipo;
            var up = qxnw.userPolicies.getUserData();
            if (up.profile != "1" && up.profile != "7" && up.profile != "6") {
                self.ui.terminal.removeAll();
                var data = {};
                data[up.terminal] = up.nom_terminal;
                qxnw.utils.populateSelectFromArray(self.ui.terminal, data);
                self.ui.terminal.setEnabled(false);
            }
            self.applyFilters();
        },
        slotImprimir: function slotImprimir(id) {
            var self = this;
            var sl = self.selectedRecord();
            sl ["vista"] = "SI";
            if (sl == undefined) {
                qxnw.utils.alert("Seleccione un registro");
                return;
            }
            nwproject5.main.slotShowPedido(sl);
//            var f = new nwsites.forms.f_pedido;
//            if (!f.setParamRecordAtender(sl)) {
//                qxnw.utils.alert("No se usó el setParamRecord");
//                return;
//            }
//            var f = new qxnw.forms();
//            f.setInvalidateStore(true);
////            f.maximize();
////            f.getChildControl("captionbar").setVisibility("excluded");
////            f.addFrame("/nwlib/modulos/nw_soporte_chat/src/vista_general.php", false);
//            console.log(sl);
//            var id = sl.id;
//            var d = sl.costo_domicilio;
//            f.addFrame("/nwlib6/modulos/domonline/vista_pedido_resumen_consulta.php?id=" + id + "&d=" + d, false);
//            var buttons = [
//                {
//                    name: "despachar_pedido",
//                    label: "Despachar Pedido",
//                    icon: qxnw.config.execIcon("media-skip-forward")
//                },
//                {
//                    name: "trasladar_pedido",
//                    label: "Trasladar Pedido",
//                    icon: qxnw.config.execIcon("media-skip-forward")
//                },
//                {
//                    name: "aceptar_pedido",
//                    label: "Confirmar Pedido",
//                    icon: qxnw.config.execIcon("media-skip-forward")
//                },
//                {
//                    name: "rechazar",
//                    label: "Rechazar Pedido",
//                    icon: qxnw.config.execIcon("media-skip-forward")
//                }
//            ];
//            f.addButtons(buttons);
//
////            f.setModal(true);
//            f.setWidth(800);
//            f.setHeight(700);
//            f.show();
        }
    }
});
