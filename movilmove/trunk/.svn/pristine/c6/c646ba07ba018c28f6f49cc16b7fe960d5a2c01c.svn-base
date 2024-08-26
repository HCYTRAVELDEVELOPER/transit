qx.Class.define("transmovapp.lists.l_paradas_adicionales", {
    extend: qxnw.lists,
    construct: function (r) {
        var self = this;
        this.base(arguments);
        this.buttonsAutomatic = true;
        this.createBase();
        self.setTitle("Informe de abordaje pasajeros / paradas ");
//        self.__conf = main.getConfiguracion();

        qxnw.local.storeData(self.getAppWidgetName() + "_max_show_rows", 20);

        self.data = {};
        if (qxnw.utils.evalueData(r)) {
            self.data = r;
        }
        var columns = [
            {
                caption: "id",
                label: "ID",
                visible: true
            },
            {
                caption: "id_servicio",
                label: "Servicio ID"
            },
            {
                caption: "estado",
                label: "Estado parada/pasajero",
                type: "html",
                mode: "toolTip"
            },
            {
                caption: "estado_servicio",
                label: "Estado Servicio",
                type: "html",
                mode: "toolTip"
            },
            {
                caption: "direccion",
                label: "Dirección",
                type: "html",
                mode: "toolTip"
            },
            {
                caption: "ciudad_parada",
                label: "Ciudad",
                type: "html",
                mode: "toolTip"
            },
            {
                caption: "abordo",
                label: "Abordó",
                type: "html",
                mode: "toolTip"
            },
            {
                caption: "cliente_empresa_nombre",
                label: "Cliente",
                type: "html",
                mode: "toolTip"
            },
            {
                caption: "fecha",
                label: "Fecha creación",
                type: "html",
                mode: "toolTip"
            },
            {
                caption: "fecha_servicio",
                label: "Fecha servicio",
                type: "html",
                mode: "toolTip"
            },
            {
                caption: "hora_servicio",
                label: "Hora servicio",
                type: "html",
                mode: "toolTip"
            },
            {
                caption: "fecha_final",
                label: "Fecha entrega/recogida",
                type: "html",
                mode: "toolTip"

            },
            {
                caption: "fecha_finaliza_servicio_driver",
                label: "Fecha conductor finaliza servicio completo",
                type: "html",
                mode: "toolTip"
            },
            {
                caption: "nombre_pasajero",
                label: "Nombre pasajero",
                type: "html",
                mode: "toolTip"
            },
            {
                caption: "correo",
                label: "Correo",
                type: "html",
                mode: "toolTip"
            },
            {
                caption: "telefono",
                label: "Teléfono",
                type: "html",
                mode: "toolTip"
            },
            {
                caption: "usuario_pasajero",
                label: "Usuario pasajero",
                type: "html",
                mode: "toolTip"
            },
            {
                caption: "documento",
                label: "Documento",
                type: "html",
                mode: "toolTip"
            },
            {
                caption: "usuario",
                label: "Usuario crea",
                visible: false,
                type: "html",
                mode: "toolTip"
            },
            {
                caption: "placa",
                label: "Placa",
                type: "html",
                mode: "toolTip"
            },
            {
                caption: "conductor",
                label: "Conductor",
                type: "html",
                mode: "toolTip"
            },
            {
                caption: "sentido",
                label: "Sentido",
                type: "html",
                mode: "toolTip"
            },
            {
                caption: "tipo",
                label: "Tipo",
                type: "html",
                mode: "toolTip"
            },
            {
                caption: "subcategoria_servicio_text",
                label: "Servicio",
                type: "html",
                mode: "toolTip"
            },
            {
                caption: "descripcion_carga",
                label: "Comentarios",
                type: "html",
                mode: "toolTip"
            },
            {
                caption: "registro_fotografico",
                label: "Foto final",
                type: "image",
                mode: "toolTip"
            },
            {
                caption: "fecha_cancelacion_pasajero",
                label: "Fecha cancelación pasajero",
                type: "html",
                mode: "toolTip"
            },
            {
                caption: "novedad_text",
                label: "Novedad",
                type: "html",
                mode: "toolTip"
            },
            {
                caption: "novedad_observaciones",
                label: "Novedades comentarios",
                type: "html",
                mode: "toolTip"
            },
            {
                caption: "latitud_parada",
                label: "Latitud inicial",
                type: "html",
                mode: "toolTip"
            },
            {
                caption: "longitud_parada",
                label: "Longitud inicial",
                type: "html",
                mode: "toolTip"
            },
            {
                caption: "latitud_final",
                label: "Latitud final de entrega",
                type: "html",
                mode: "toolTip"
            },
            {
                caption: "longitud_final",
                label: "Longitud final de entrega",
                type: "html",
                mode: "toolTip"
            },
            {
                caption: "token_usuario",
                label: "Token",
                type: "html",
                mode: "toolTip"
            },
            {
                caption: "calificacion_a_conductor",
                label: "Calificación a conductor",
                type: "html",
                mode: "toolTip"
            },
            {
                caption: "calificacion_a_conductor_comentarios",
                label: "Calificación a conductor comentarios",
                type: "html",
                mode: "toolTip"
            }
        ];
        self.setColumns(columns);

        var filters = [
            {
                name: "buscar",
                caption: "buscar",
                label: "Buscar...",
                type: "textField"
            },
            {
                name: "buscar_por_id",
                caption: "buscar_por_id",
                label: "Buscar por ID",
                type: "textField"
            },
            {
                name: "cliente",
                caption: "cliente",
                label: "Cliente",
                type: "selectTokenField"
            },
            {
                name: "servicio_id",
                caption: "servicio_id",
                label: "Servicio ID",
                required: true,
                type: "selectBox"
            },
            {
                name: "fecha_inicio",
                caption: "fecha_inicio",
                label: "Fecha Inicial",
                required: false,
                type: "dateField"
            },
            {
                name: "fecha_final",
                caption: "fecha_final",
                label: "Fecha Final",
                required: false,
                type: "dateField"
            }
        ];
        self.createFilters(filters);
        self.setAllPermissions(true);

        var render = new qxnw.rowRenderer();
        render.setHandleData(2, "ENTREGADO", "green");
        render.setHandleData(2, "CONFIRMADO", "green");
        render.setHandleData(2, "REPARTO", "orange");
        render.setHandleData(2, "NOVEDAD", "red");
        render.setHandleData(2, "SOLICITUD", "#ffffff");
        self.table.setDataRowRenderer(render);

//        self.ui.deleteButton.addListener("click", function () {
//            self.slotEliminar();
//        });
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

        var d = {};
        d["TODOS"] = "TODOS";
        if (qxnw.utils.evalueData(self.data.id)) {
            d[self.data.id] = self.data.id.toString();
        }
        qxnw.utils.populateSelectFromArray(self.ui.servicio_id, d);

        self.creado = false;
        self.addListener("appear", function () {
            if (!self.creado) {
                if (qxnw.utils.evalueData(self.data.id)) {
                    self.ui.servicio_id.setValue(self.data.id);
                }
                self.ui.fecha_inicio.setValue("");
                self.ui.fecha_final.setValue("");
            }
            self.creado = true;
        });

        self.ui.fecha_inicio.setValue("");
        self.ui.fecha_final.setValue("");

        self.ui["part2"].setVisibility("excluded");

        self.table.setRowHeight(80);

        self.ui.cliente.addListener("loadData", function (e) {
            var data = {};
            data.token = e.getData();
            var rpc = new qxnw.rpc(self.getRpcUrl(), "enrutamiento_masivo");
            rpc.setAsync(true);
            var func = function (r) {
                self.ui.cliente.setModelData(r);
            };
            rpc.exec("populateTokenClientes", data, func);
        }, this);
//        self.ui.cliente.addListener("addItem", function (e) {
//            var val = e.getData();
//            console.log("val", val);
//        }, this);
        console.log("self.data.cliente_empresa_id", self.data.cliente_empresa_id);
        if (qxnw.utils.evalueData(self.data.cliente_empresa_id)) {
            var item = {
                id: self.data.cliente_empresa_id,
                nombre: "Cliente ID " + self.data.cliente_empresa_id
            };
            self.ui.cliente.addToken(item);
        }

        self.execSettings();
        self.applyFilters();
    },
    destruct: function () {
    },
    members: {
        contextMenu: function contextMenu(veteapp) {
            var self = this;
            var up = qxnw.userPolicies.getUserData();
            var r = self.selectedRecord();
            console.log("r", r);
            var m = new qxnw.contextmenu(this);
            if (!main.isCustomer()) {
                m.addAction("Editar", "icon/16/actions/document-properties.png", function (e) {
                    self.slotEditar();
                });
            }
            if (!main.isCustomer()) {
                m.addAction("Chat del pasajero y conductor", "icon/16/actions/document-properties.png", function (e) {
                    var ds = {};
                    ds.id = "_parada_" + r.id;
                    ds.cliente_nombre = "Chat pasajero";
                    if (qxnw.utils.evalueData(r.nombre_pasajero)) {
                        ds.cliente_nombre = r.nombre_pasajero;
                    }
                    main.chat(ds);
                });
            }
            m.addAction("Fotos adjuntas del viaje", "icon/16/actions/view-sort-descending.png", function (e) {
                var d = new transmovapp.lists.l_servicios_fotos();
//                    d.setWidth(900);
//                    d.setMaxWidth(900);
//                    d.setHeight(700);
//                    d.setMaxHeight(700);
                d.setModal(true);
                d.maximize();
                d.show();

                var pr = {};
                pr.id_servicio = r.id_servicio;
                pr.id_parada = r.id;
                d.setParamRecord(pr);
            });
            m.exec(veteapp);
        },
        applyFilters: function applyFilters() {
            var self = this;
            var fil = self.getFiltersData();
            if (fil.servicio_id == "TODOS" && !qxnw.utils.evalueData(fil.buscar_por_id)) {
                if (!qxnw.utils.evalueData(fil.fecha_inicio) || !qxnw.utils.evalueData(fil.fecha_final)) {
                    qxnw.utils.information("Para buscar todos los registros debe seleccionar un rango de fechas");
                    return false;
                }
            }
            var ds = {};
            ds.filters = fil;
            ds.id = ds.filters.servicio_id;
            console.log("ds", ds);
            var rpc = new qxnw.rpc(self.rpcUrl, "servicios_admin");
            rpc.setAsync(true);
            var func = function (res) {
                for (var i = 0; i < res.records.length; i++) {
                    res.records[i].abordo = "";
                    if (res.records[i].estado == "SOLICITUD") {
                        res.records[i].abordo = "N/A";
                    } else
                    if (res.records[i].estado == "CONFIRMADO" || res.records[i].estado == "ENTREGADO") {
                        res.records[i].abordo = "SI";
                    } else {
                        res.records[i].abordo = "NO";
                    }
                }
                console.log("res", res);
                self.setModelData(res);
            };
            rpc.exec("consultaParadasAdicionales", ds, func);
        },
//        slotNuevo: function slotNuevo(table) {
//            var self = this;
//            table = self.ui.tabla.getValue();
//            var d = new transmovapp.forms.f_operarios(table);
//            d.ui.tabla.setValue(table);
//            d.settings.accept = function () {
//                self.applyFilters();
//            };
//            d.addListener("appear", function () {
//                var element = d.ui.email.getContentElement().getDomElement();
//                var element1 = d.ui.clave.getContentElement().getDomElement();
//                console.log(element);
//                element.setAttribute("autocomplete", "new-password");
//                element1.setAttribute("autocomplete", "new-password");
//            });
//            d.show();
//        },
        slotEditar: function slotEditar() {
            var self = this;
            var r = self.selectedRecord();
            if (r == undefined) {
                qxnw.utils.alert("Seleccione un registro");
                return;
            }
            var d = new transmovapp.forms.f_paradas_adicionales();
            if (!d.setParamRecord(r)) {
                qxnw.utils.alert("No se usó el setParamRecord");
                return;
            }
            d.settings.accept = function () {
                self.applyFilters();
            };
            d.setModal(true);
            d.show();
        },
//        slotEliminar: function slotEliminar() {
//            var self = this;
//            var r = self.selectedRecord();
//            if (r == undefined) {
//                qxnw.utils.alert("Seleccione un registro");
//                return;
//            }
//            var rpc = new qxnw.rpc(this.rpcUrl, "usuarios");
//            rpc.exec("eliminarB", r);
//            if (rpc.isError()) {
//                qxnw.utils.error(rpc.getError());
//                return;
//            } else {
//                self.removeSelectedRow();
//                self.applyFilters();
//            }
//        },
        setParamRecord: function setParamRecord(pr) {
            var self = this;
            self.applyFilters();
            return true;
        }
    }
});