qx.Class.define("nwsites.forms.f_pedido", {
    extend: qxnw.forms,
    construct: function () {
        var self = this;
        this.base(arguments);
        this.createBase();
        this.setColumnsFormNumber(0);
        this.setTitle("Confirmar Pedido");
        var fields = [
            {
                name: "DATOS GENERALES",
                type: "startGroup",
                icon: qxnw.config.execIcon("office-address-book", "apps"),
                mode: "horizontal"
            },
            {
                name: "id",
                label: "Pedido #",
                caption: "id",
                type: "textField",
                visible: true,
                enabled: false
            },
            {
                name: "estado_nuevo",
                label: "Estado",
                type: "textField",
                visible: false
            },
            {
                name: "costo_domicilio",
                label: "Costo Domicilio",
                type: "textField",
                enabled: false
            },
            {
                name: "valor_total",
                label: "Valor Total",
                type: "textField",
                enabled: false
            },
            {
                name: "forma_pago",
                label: "Forma de Pago",
                type: "textField",
                enabled: false
            },
            {
                name: "cliente_text",
                label: "Cliente",
                type: "textField",
                enabled: false
            },
            {
                name: "barrio",
                label: "Barrio",
                type: "textField",
                enabled: false
            },
            {
                name: "email",
                label: "Email",
                type: "textField",
                enabled: false
            },
            {
                name: "telefono",
                label: "Teléfono",
                type: "textField",
                enabled: true
            },
            {
                name: "",
                type: "endGroup"
            },
            {
                name: "DOMICILIO",
                type: "startGroup",
                icon: qxnw.config.execIcon("office-address-book", "apps"),
                mode: "horizontal"
            },
            {
                name: "direccion",
                label: "Dirección",
                type: "textField",
                enabled: false
            },
            {
                name: "aptocasa",
                label: "N° Apto/Casa",
                type: "textField",
                enabled: false
            },
            {
                name: "comentario",
                label: "Comentarios Cliente",
                type: "textArea",
                enabled: false
            },
            {
                name: "duracion_pedido",
                label: "Duración del Pedido",
                type: "selectBox",
                required: true
            },
            {
                name: "observaciones",
                label: "Observaciones",
                type: "textArea",
                required: false
            },
            {
                name: "",
                type: "endGroup"
            },
//            {
//                name: "Productos",
//                type: "startGroup",
//                icon: qxnw.config.execIcon("office-address-book", "apps"),
//                mode: "horizontal"
//            },
            {
                name: "historial",
                label: "Pedido",
//                type: "label",
                type: "ckeditor",
                mode: "maxWidth",
//                mode: "simple",
                enabled: false,
                visible: false
            }
//            {
//                name: "",
//                type: "endGroup"
//            }
        ];
        self.setFields(fields);
//        var id = self.ui.id.getValue().toString();
//        var d = self.ui.costo_domicilio.getValue().toString();
////        self.iframe = self.addFrame("/nwlib6/modulos/domonline/vista_pedido_resumen.php", false);
//        self.iframe = self.addFrame("/nwlib6/modulos/domonline/vista_pedido_resumen_consulta.php?id=" + id + "&d=" + d, false);
//        self.addListener("appear", function() {
//            self.iframe.getContentElement().getDomElement().id = "topFrameDom";
//        });
//        self.iframe.addListener("appear", function() {
//            setTimeout(function() {
//                var id = self.ui.id.getValue().toString();
//                var d = self.ui.costo_domicilio.getValue().toString();
//                document.getElementById('topFrameDom').contentWindow.changeData(id, d);
//            }, 1000);
//        });
//        
//        
//        self.ui.telefono.setSelectable(false);
//        self.ui.historial.addListener("changeEnabled", function(e) {
//            var bool = e.getData();
//            if (bool) {
//                this.setReadOnly(false);
//                this.setSelectable(true);
//                this.setFocusable(true);
//            } else {
//                this.setReadOnly(true);
//                this.setSelectable(false);
//                this.setFocusable(true);
//            }
//        });
        var data = {};
        data[""] = "Todas";
        qxnw.utils.populateSelectFromArray(self.ui.duracion_pedido, data);
        data.table = "pv_tiempos_domicilio";
        qxnw.utils.populateSelect(self.ui.duracion_pedido, "master", "populate", data);
        self.ui.duracion_pedido.focus();
        self.ui.observaciones.setMaxHeight(50);
        self.ui.comentario.setMaxHeight(50);
        var buttons = [
            {
                name: "despachar_pedido",
                label: "Despachar Pedido",
                icon: qxnw.config.execIcon("media-skip-forward")
            },
            {
                name: "trasladar_pedido",
                label: "Trasladar Pedido",
                icon: qxnw.config.execIcon("media-skip-forward")
            },
            {
                name: "aceptar_pedido",
                label: "Confirmar Pedido",
                icon: qxnw.config.execIcon("media-skip-forward")
            },
            {
                name: "rechazar",
                label: "Rechazar Pedido",
                icon: qxnw.config.execIcon("media-skip-forward")
            }
        ];
        self.addButtons(buttons);
        self.ui.despachar_pedido.addListener("click", function () {
            self.slotSave();
        });
        self.ui.aceptar_pedido.addListener("click", function () {
            self.slotSave();
        });
        self.ui.rechazar.addListener("click", function () {
            self.slotRechazar();
        });
        self.ui.trasladar_pedido.addListener("click", function () {
            self.slotTrasladarPedido(self);
        });
        self.ui.cancel.setVisibility("hidden");
        self.ui.accept.setVisibility("hidden");
        self.ui.despachar_pedido.setVisibility("hidden");
    },
    destruct: function () {
    },
    members: {
        pr: null,
        slotTrasladarPedido: function slotTrasladarPedido(s) {
            var self = this;
            var data = {};
            var sl = this.getRecord();
            qxnw.utils.question("¿Está seguro de trasladar este pedido?", function (e) {
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
                            type: "textArea",
                            required: true
                        },
                        {
                            name: "motivo_traslado",
                            label: "Motivo traslado",
                            type: "selectBox",
                            required: true
                        },
                        {
                            name: "terminal",
                            label: "Tienda",
                            type: "selectBox",
                            required: true
                        },
                        {
                            name: "",
                            type: "endGroup",
                            icon: ""
                        }
                    ];
                    d.setFields(fields);
                    d.setModal(true);
                    d.show();
                    var data = {};
                    data[""] = "Todas";
                    qxnw.utils.populateSelectFromArray(d.ui.terminal, data);
                    qxnw.utils.populateSelectFromArray(d.ui.motivo_traslado, data);
                    data.table = "pv_anular";
                    qxnw.utils.populateSelect(d.ui.motivo_traslado, "master", "populate", data);
                    data.table = "terminales";
                    qxnw.utils.populateSelect(d.ui.terminal, "master", "populate", data);
                    d.ui.accept.addListener("execute", function () {
                        if (!d.validate()) {
                            return;
                        }
                        var data = d.getRecord();
                        data.id = sl.id;
                        var rpc = new qxnw.rpc(self.getRpcUrl(), "pv_nwsites");
                        rpc.setAsync(true);
                        var func = function (r) {
                            qxnw.utils.information("Se ha trasladado el pedido N° " + sl.id);
                            d.accept();
                            s.accept();
                        };
                        rpc.exec("updateTrasladarPedido", data, func);
                    });
                    d.ui.cancel.addListener("execute", function () {
                        d.reject();
                    });
                } else {
                    return;
                }
            });
        },
        slotRechazar: function slotRechazar() {
            var self = this;
            var data = this.getRecord();
            var rpc = new qxnw.rpc(self.getRpcUrl(), "pv_nwsites");
            rpc.setAsync(true);
            var func = function (r) {
                self.accept();
            };
            rpc.exec("savePedidosRechazar", data, func);
        },
        slotSave: function slotSave() {
            var self = this;
            if (!self.validate()) {
                return;
            }
            var data = this.getRecord();
            var rpc = new qxnw.rpc(self.getRpcUrl(), "pv_nwsites");
            rpc.setAsync(true);
            var func = function (r) {
                try {
                    pedidosForms.close();
                    pedidosForms.destroy();
                    pedidosForms = null;
                    var iframe = document.getElementById('frame_home');
                    iframe.src = iframe.src;
                    self.accept();
                } catch (e) {
                    try {
                        self.accept();
                    } catch (ee) {

                    }
                }
            };
            rpc.exec("savepedidosnwsites", data, func);
        },
        setParamRecord: function setParamRecord(pr) {
            this.setRecord(pr);
            return true;
        },
        setParamRecordAtender: function setParamRecordAtender(data) {
            var self = this;
            self.ui.estado_nuevo.setValue("2");
            if (data.vista == "SI") {
                self.ui.aceptar_pedido.setVisibility("hidden");
                self.ui.rechazar.setVisibility("hidden");
                self.ui.duracion_pedido.setEnabled(false);
                self.ui.observaciones.setEnabled(false);
                self.ui.estado_nuevo.setValue("");
            } else
            if (data.vista == "ATENDIDO") {
                self.ui.aceptar_pedido.setVisibility("hidden");
                self.ui.rechazar.setVisibility("hidden");
                self.ui.duracion_pedido.setEnabled(false);
                self.ui.observaciones.setEnabled(false);
                self.ui.despachar_pedido.setVisibility("visible");
                self.ui.estado_nuevo.setValue("3");
            } else
            if (data.vista == "DESPACHADO") {
                self.ui.aceptar_pedido.setVisibility("hidden");
                self.ui.rechazar.setVisibility("hidden");
                self.ui.trasladar_pedido.setVisibility("hidden");
                self.ui.duracion_pedido.setEnabled(false);
                self.ui.observaciones.setEnabled(false);
                self.ui.estado_nuevo.setValue("");
            }
            var rpc = new qxnw.rpc(self.rpcUrl, "pv_nwsites");
            rpc.setAsync(true);
            var func = function (pr) {
                self.setRecord(pr[0]);
                var fuck = function (r) {
                    self.ui.historial.setValue(r);
                };
                var sl = {};
                sl["id"] = pr[0].id;
                sl["d"] = pr[0].costo_domicilio;
                qxnw.utils.fastAsyncRpcCall("pv_nwsites", "consultaPedidoClientesProductos", sl, fuck);
                var id = pr[0].id;
                var d = pr[0].costo_domicilio;
                self.iframe = self.addFrame("/nwlib6/modulos/domonline/vista_pedido_resumen_consulta.php?id=" + id + "&d=" + d, false);
            };
            self.ui.duracion_pedido.focus();
            rpc.exec("consultaPedidoClientes", data, func);
            return true;
        }
    }
});
