qx.Class.define("transmovapp.lists.l_conductor", {
    extend: qxnw.lists,
    construct: function () {
        var self = this;
        this.base(arguments);
        this.buttonsAutomatic = true;
        this.createBase();
        var up = qxnw.userPolicies.getUserData();
        self.config_cliente = main.getConfiguracion();
        console.log("transmovapp.lists.l_conductor:::self.config_cliente", self.config_cliente);

        qxnw.local.storeData(self.getAppWidgetName() + "_max_show_rows", 20);

        var columns = [
            {
                label: self.tr("Foto"),
                caption: "foto_perfil",
                type: "image",
                mode: "phpthumb"
            },
            {
                label: self.tr("ID"),
                caption: "id"
            },
            {
                label: self.tr("Usuario"),
                caption: "usuario"
            },
            {
                label: self.tr("Usuario de APP"),
                caption: "usuario_cliente"
            },
            {
                label: self.tr("Fecha registro"),
                caption: "fecha_registro"
            },
            {
                label: self.tr("Servicios Activos"),
                caption: "servicios_activos",
                type: "html"
            },
            {
                label: self.tr("Estado Activación"),
                caption: "estado_activacion"
            },
            {
                label: self.tr("Estado Activación"),
                caption: "estado_activacion_text"
            },
            {
                label: self.tr("Estado App"),
                caption: "estado"
            },
            {
                label: self.tr("Fecha última conexión"),
                caption: "fecha_ultima_conexion"
            },
            {
                label: self.tr("Placa activa"),
                caption: "placa_activa"
            },
            {
                label: self.tr("Ocupado"),
                caption: "ocupado"
            },
            {
                label: self.tr("Tipo Documento"),
                caption: "tipo_doc"
            },
            {
                label: self.tr("Documento"),
                caption: "nit"
            },
            {
                label: self.tr("Celular"),
                caption: "celular"
            },
            {
                label: self.tr("Teléfono"),
                caption: "telefono",
                visible: false
            },
            {
                label: self.tr("Correo"),
                caption: "email"
            },
            {
                label: self.tr("Nombres"),
                caption: "nombre"
            },
            {
                label: self.tr("Apellidos"),
                caption: "apellido"
            },
            {
                label: self.tr("País ID"),
                caption: "pais"
            },
            {
                label: self.tr("País"),
                caption: "pais_text"
            },
            {
                label: self.tr("Ciudad ID"),
                caption: "ciudad"
            },
            {
                label: self.tr("Ciudad"),
                caption: "ciudad_text"
            },
            {
                label: self.tr("Terminal"),
                caption: "terminal"
            },
            {
                label: self.tr("Preoperacional fecha última revisión"),
                caption: "preoperacional_ultima_fecha"
            },
            {
                label: self.tr("Preoperacional novedad (última)"),
                caption: "preoperacional_novedad_encontrada"
            },
            {
                label: self.tr("LICENCIA SEMÁFORO"),
                caption: "licencia_semaforo",
                type: "html"
            },
            {
                label: self.tr("N° Licencia"),
                caption: "no_licencia"
            },
            {
                label: self.tr("Fecha Vencimiento"),
                caption: "fecha_vencimiento"
            },
            {
                label: self.tr("Género"),
                caption: "genero"
            },
            {
                label: self.tr("Perfil ID"),
                caption: "perfil"
            },
            {
                label: self.tr("Perfil"),
                caption: "perfil_text"
            },
            {
                label: self.tr("Contrato"),
                caption: "contrato"
            },
            {
                label: self.tr("Total viajes"),
                caption: "total_viajes"
            },
            {
                label: self.tr("Valor Total Viajes"),
                caption: "total_valor",
                type: "money"
            },
//            {
//                label: self.tr("Comisión %"),
//                caption: "comision_porcentaje",
//                type: "money"
//            },
//            {
//                label: self.tr("Utilidad driver"),
//                caption: "utilidad_conductor",
//                type: "money"
//            },
//            {
//                label: self.tr("Utilidad interna"),
//                caption: "utilidad_interna",
//                type: "money"
//            },
            {
                label: self.tr("Saldo"),
                caption: "saldo",
                type: "money"
            },
            {
                label: self.tr("Fecha Vencimiento recarga"),
                caption: "fecha_vencimiento_saldo"
            },
            {
                label: self.tr("Banco"),
                caption: "banco"
            },
            {
                label: self.tr("Tipo cuenta"),
                caption: "tipo_cuenta"
            },
            {
                label: self.tr("Número cuenta"),
                caption: "numero_cuenta"
            },
            {
                label: self.tr("Rechazado"),
                caption: "rechazado"
            },
//            {
//                label: self.tr("Capacitaciones"),
//                caption: "capacitaciones"
//            },
            {
                label: self.tr("Empresa"),
                caption: "empresa"
            },
//            {
//                caption: "hora_inicio",
//                label: "Hora inicio"
//            },
//            {
//                caption: "hora_fin",
//                label: "Hora Fin"
//            },
            {
                label: self.tr("Flota"),
                caption: "bodega",
                visible: false
            },
            {
                caption: "fecha_bloqueo",
                label: self.tr("ULTIMA FECHA DE BLOQUEO")
            },
            {
                caption: "motivo_bloqueo",
                label: self.tr("ULTIMO MOTIVO DE BLOQUEO")
            },
            {
                caption: "catidad_rechazos",
                label: "Numero rechazos"
            },
            {
                caption: "catidad_incumplimiento",
                label: "Numero de incumplimiento"
            },
            {
                caption: "catidad_tardanzas",
                label: "Numero de Tardanzas"
            },
            {
                label: self.tr("atiende subservicio"),
                caption: "atiende_subservicios",
                visible: false
            }
        ];
        self.setColumns(main.labels(columns));

        self.table.setRowHeight(50);
        self.hideColumn("usuario");
        self.hideColumn("estado_activacion");
        self.hideColumn("perfil");
        self.hideColumn("perfil_text");
        self.hideColumn("ciudad");
        self.hideColumn("pais");
        self.hideColumn("terminal");
        self.hideColumn("empresa");

        var filters = [
            {
                name: "buscar_driver",
                label: self.tr("Buscar..."),
                type: "textField"
            },
            {
                name: "estadoa",
                label: self.tr("Estado"),
                type: "selectBox"
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

//        var colors = ["white", "green", "yellow", "red"];
//        var name = "licencia";
//        self.createSemaphore(colors, name);


        var t = {};
        t[""] = self.tr("Todos");
        t["Cuenta-creada"] = self.tr("Cuenta-creada");
        t["Pre-Registrado"] = self.tr("Pre-Registrado");
        t["Activo"] = self.tr("Activo");
        t["rechazado"] = self.tr("Rechazado");
//        t["Inactivo"] = self.tr("Inactivo");
//        t["Supendido"] = self.tr("Supendido");
//        t["Bloqueado"] = self.tr("Bloqueado");
        qxnw.utils.populateSelectFromArray(self.ui.estadoa, t);


        self.creado = false;
        self.addListener("appear", function () {
            if (!self.creado) {
                self.ui.fecha_final.setValue("");
                self.ui.fecha_inicial.setValue("");
                self.ui.estadoa.setValue("");
                self.applyFilters();
            }
            self.creado = true;
        });



//        var date = new Date();
//        var primerDia = new Date(date.getFullYear(), date.getMonth(), 1);
//        var ultimoDia = new Date(date.getFullYear(), date.getMonth() + 1, 0);
//        var anio = date.getFullYear();
//        var mes = date.getMonth() + 1;
//        var fechaInicial = anio + "-" + mes + "-" + primerDia.getDate();
//        var fechaFinal = anio + "-" + mes + "-" + ultimoDia.getDate();
//        self.ui.fecha_inicial.setValue(fechaInicial);
//        self.ui.fecha_final.setValue(fechaFinal);

        var t = main.getConfiguracion();

        self.t = t;
        self.ui.newButton.addListener("click", function () {
            self.slotNuevo(false, t);
        });

        self.ui.deleteButton.setLabel(self.tr("Informe preoperacional"));
        self.ui.deleteButton.setIcon(qxnw.config.execIcon("zoom-fit-best"));
        self.ui.deleteButton.addListener("click", function () {
            main.slotPreoperacional();
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
        self.ui.emailButton.setVisibility("excluded");
        self.ui.printButton.setVisibility("excluded");
//        self.execSettings();
//        self.applyFilters();

//        self.table.addListener("cellTap", function (e) {
//            var r = self.selectedRecord();
//            var col = e.getColumn();
//            if (col == 0) {
//                self.slotVer(r);
//            }
//        });
    },
    destruct: function () {
    },
    members: {
        contextMenu: function contextMenu(pos) {
            var self = this;
            this.t = t;
            var t = self.t;
            var data = self.selectedRecord();
            var m = new qxnw.contextmenu(this);
            var up = qxnw.userPolicies.getUserData();
            var conf = main.getConfiguracion();
            var r = main.getPermiserv();
            var inactivar_activar = true, rechazar = true, administrar = true, enviar_correo = true, eliminar_conductores = false;
//            if (typeof up.bodega === "string") {
            if (qxnw.utils.evalue(r)) {
                if (r.activar_inactivar == "false" || r.activar_inactivar == false) {
                    inactivar_activar = false;
                }
                if (r.rechazar == "false" || r.rechazar == false) {
                    rechazar = false;
                }
                if (r.administrar_saldo == "false" || r.administrar_saldo == false) {
                    administrar = false;
                }
                if (r.enviar_correo == "false" || r.enviar_correo == false) {
                    enviar_correo = false;
                }
                if (r.eliminar_conductores == "true" || r.eliminar_conductores == true) {
                    eliminar_conductores = true;
                }
            }
//            }
            m.addAction(self.tr("Editar"), qxnw.config.execIcon("format-text-direction-rtl"), function (e) {
                self.slotEditar(data, t);
            });
            if (conf.administrar_horarios_conductor == "SI") {
                m.addAction(self.tr("Horarios"), qxnw.config.execIcon("appointment-new"), function (e) {
                    self.slotHours(data);
                });
            }
            if (administrar == true) {
                m.addAction(self.tr("Administrar saldo"), qxnw.config.execIcon("format-text-direction-rtl"), function (e) {
                    self.slotSaldo(data, t);
                });
            }
            console.log("inactivar_activar", inactivar_activar);
            console.log("data", data);
            if (inactivar_activar == true) {
                if (data.estado_activacion == "1") {
                    m.addAction(self.tr("Inactivar"), qxnw.config.execIcon("edit-delete"), function (e) {
                        self.slotActivar(data, t);
                    });
                } else {
                    m.addAction(self.tr("Activar"), qxnw.config.execIcon("edit-redo"), function (e) {
                        self.slotActivar(data, t);
                    });
                }
            }
            if (rechazar == true) {
                if (data.estado_activacion == "3") {
                    m.addAction(self.tr("Rechazar"), qxnw.config.execIcon("edit-redo"), function (e) {
                        qxnw.utils.question("¿Relalmente quiere rechazar este conductor?", function (e) {
                            if (e) {
                                self.slotRechazar(data, t);
                            }
                        });
                    });
                }
            }
            if (enviar_correo == true) {
                m.addAction(self.tr("Enviar mensaje (correo y Push app"), qxnw.config.execIcon("edit-redo"), function (e) {
                    qxnw.utils.question("¿Relalmente quieres enviar un correo al conductor?", function (e) {
                        if (e) {
                            self.slotCorreo(data, t);
                        }
                    });
                });
            }
            console.log(self.config_cliente);
            if (self.config_cliente.pide_preoperacional == "SI") {
                m.addAction(self.tr("Ver preoperacional"), qxnw.config.execIcon("edit-redo"), function (e) {
                    self.slotPreoperacional(data, t);
                });
            }
//            if (self.config_cliente.pide_fuec == "SI") {
//                m.addAction(self.tr("Fuec"), qxnw.config.execIcon("edit-redo"), function (e) {
//                    self.slotFuec(data, t);
//                });
//            }

//            var rpc = new qxnw.rpc(self.getRpcUrl(), "servicios_admin");
//            rpc.setAsync(true);
//            var func = function (r) {
//                if (r.length > 0) {
            m.addAction(self.tr("Ver vehículos"), qxnw.config.execIcon("document-print-preview"), function (e) {
                self.slotVehiculos(data);
            });
//                }
//            };
//            rpc.exec("consultaV", data, func);

            if (eliminar_conductores === true) {
                m.addAction("Eliminar", "icon/16/actions/dialog-close.png", function (e) {
                    self.slotEliminar(data);
                });
            }

            m.exec(pos);
        },
        slotCorreo: function slotCorreo(data, t) {
            var self = this;
            var form = new qxnw.forms();
            var fields = [
                {
                    name: "observaciones",
                    label: self.tr("Observaciones"),
                    type: "textArea",
                    required: true
                }
            ];
            form.setFields(fields);
            form.show();
            form.ui.accept.addListener("execute", function () {
                if (!form.validate()) {
                    return;
                }
                var datos = form.getRecord();
                data.observaciones = datos.observaciones;
                data.html = "Te hemos enviado unas observaciones que debes tener en cuenta.";
                data.body_notify = "Te hemos enviado unas observaciones a tu correo para que revises.";
                var rpc = new qxnw.rpc(self.getRpcUrl(), "conductores", true);
                var func = function (r) {
                    if (r !== true) {
                        qxnw.utils.information("Error al enviar el correo");
                        console.log(r);
                        return false;
                    }
                    qxnw.utils.information("Correo enviado correctamente");
                    form.reject();
                };
                rpc.exec("enviaCorreo", data, func);
            });
            form.ui.cancel.addListener("execute", function () {
                form.reject();
            });
        },
        slotFuec: function slotFuec() {
            var self = this;
            var d = new qxnw.forms();
            var fields = [
                {
                    name: "",
                    type: "startGroup",
                    mode: "vertical"
                },
                {
                    name: "cliente",
                    label: "Cliente",
                    type: "selectBox"
                },
                {
                    type: "endGroup"
                }
            ];
            d.setFields(fields);

            var up = qxnw.userPolicies.getUserData();
            var data = {};
            data[""] = "Seleccione";
            qxnw.utils.populateSelectFromArray(d.ui.cliente, data);
            data = {};
            data.table = "edo_empresas";
            data.where = " tipo_empresa='Cliente'";
            qxnw.utils.populateSelect(d.ui.cliente, "master", "populate", data);
            d.ui.accept.setVisibility("excluded");
            d.ui.cliente.addListener("changeSelection", function () {
                var clien = this.getValue();
                console.log(clien);
                var rpc = new qxnw.rpc(self.rpcUrl, "empresas");
                rpc.setAsync(true);
                var func = function (r) {
                    if (r.length > 0) {
                        for (var i = 0; i < r.length; i++) {
                            r[i].generar_fuec = '<p><a class=\"qxnw_verimgButton\" target=\"_blank\">Generar Fuec</a></p><br />';
                        }
                    }
                    self.navTableDetalleFuec.setModelData(r);
                };
                rpc.exec("populateDetalleContratoFuec", clien.cliente, func);

            });
            self.navTableDetalleFuec = new qxnw.navtable(d);
            var columns = [
                {
                    caption: "id",
                    label: "id"
                },
                {
                    caption: "id_cliente",
                    label: "Id Cliente",
                    visible: false
                },
                {
                    caption: "generar_fuec",
                    label: "Generar Fuec",
                    type: "html"
                },
                {
                    caption: "numero_contrato",
                    label: "Numero Contrato"
                },
                {
                    caption: "objeto_contrato",
                    label: "Objeto Contrato"
                },
                {
                    caption: "numero_fuec",
                    label: "Numero Fuec"
                },
                {
                    caption: "fecha_inicial",
                    label: "Fecha Inicial"
                },
                {
                    caption: "hora_fin",
                    label: "Hora fin"
                },
                {
                    caption: "origen",
                    label: "Origen"
                },
                {
                    caption: "destino",
                    label: "Destino"
                },
                {
                    caption: "descripcion_recorrido",
                    label: "Descripción del Recorrido"
                },
                {
                    caption: "convenio_text",
                    label: "Convenio"
                },
                {
                    caption: "convenio",
                    label: "Convenio id",
                    visible: false
                },
                {
                    caption: "empresa",
                    label: "Empresa",
                    visible: false
                },
                {
                    caption: "usuario",
                    label: "Usuario",
                    visible: false
                }
            ];
            self.navTableDetalleFuec.setColumns(columns);
            self.navTableDetalleFuec.hideColumn("id");
            self.navTableDetalleFuec.table.setRowHeight(90);
            self._removeButton = self.navTableDetalleFuec.getRemoveButton();
            self._removeButton.setVisibility("excluded");
            self.__addButon = self.navTableDetalleFuec.getAddButton();
            self.__addButon.setVisibility("excluded");
            d.insertNavTable(self.navTableDetalleFuec.getBase(), d.tr("Detalle contrato"));
            self.navTableDetalleFuec.table.addListener("cellTap", function (e) {
                var r = self.selectedRecord();
                if (r == undefined) {
                    qxnw.utils.alert("Seleccione un registro");
                    return;
                }
                var col = e.getColumn();
                console.log(col);
                if (col == 2) {
                    var cliente = d.getRecord();
                    var data = self.selectedRecord();
                    var navcontra = self.navTableDetalleFuec.selectedRecord();
                    console.log(navcontra);
                    var h = new qxnw.reports();
                    h.createPrinterToolBar();
                    h.hideSelectPrinters(true);
                    var archivo = "fuec";
                    //transprotours
                    var domain = window.location.host;
                    if (domain === "transprotours.gruponw.com" || domain === "transprotours.movilmove.com") {
//                        archivo = "fuec_transprotours";
                    }
//                    h.addFrame("/app/" + archivo + ".php?id_fuec=" + navcontra.id + "&id_conductor=" + data.id + "&nombre=" + data.nombre + "&apellido=" + data.apellido + "&celular="
//                            + data.celular + "&nit=" + data.nit + "&usuario=" + data.usuario_cliente + "&id_cliente=" + cliente.cliente + "&flota=" + data.bodega
//                            + "&fecha_vence_licencia=" + data.fecha_vencimiento + "&numero_contrato=" + navcontra.numero_contrato, false);
                    h.addFrame("/app/" + archivo + ".php?id_fuec=" + navcontra.id + "&id_conductor=" + data.id, false);
                    h.setWidth(800);
                    h.setHeight(630);
                    h.setInvalidateStore(true);
                    h.show();

                }
            });

            d.ui.cancel.addListener("execute", function () {
                d.reject();
            });
            d.setTitle("Fuec");
            d.show();
        },
        slotPreoperacional: function slotPreoperacional(data, t) {
            var self = this;
            main.slotPreoperacional(data);
//            var d = new transmovapp.lists.l_preoperacional(data);
//            d.show();
        },
        slotRechazar: function slotRechazar(data, t) {
            var self = this;
            var form = new qxnw.forms();
            var fields = [
                {
                    name: "observaciones",
                    label: self.tr("Observaciones"),
                    type: "textArea",
                    required: true
                }
            ];
            form.setFields(fields);
            form.show();
            form.ui.accept.addListener("execute", function () {
                var datos = form.getRecord();
                data.observaciones = datos.observaciones;
                var rpc = new qxnw.rpc(self.getRpcUrl(), "conductores", true);
                var func = function (r) {
                    qxnw.utils.information("Conductor rechazado correctamente");
                    self.applyFilters();
                    form.reject();
                    self.sendNotificacionPsh(data);
                };
                rpc.exec("updateRechazado", data, func);
            });
            form.ui.cancel.addListener("execute", function () {
                form.reject();
            });
        },
        sendNotificacionPsh: function sendNotificacionPsh(pos) {
            var self = this;
            var token = pos;
            var arr = {};
            arr.perfil = pos.perfil;
            arr.empresa = pos.empresa;
            arr.usuario = pos.usuario_cliente;
            var rpc = new qxnw.rpc(this.rpcUrl, "servicios_admin");
            rpc.setAsync(true);
            var func = function (res) {
                console.log(res);
                for (var i = 0; i < res.length; i++) {
                    var tokenUser = res[i].json;
                    self.sendNotificacionPushDos({
                        title: "Respuesta solicitud",
                        body: "Lo sentimos, no haz pasado el proceso de verificación",
                        icon: "fcm_push_icon",
                        sound: "default",
                        data: "nw.dialog('Lo sentimos, no haz pasado el proceso de verificación, te hemos enviado un correo con las observaciones que debes corregir.')",
                        callback: "FCM_PLUGIN_ACTIVITY",
                        to: tokenUser
                    }, function (r) {
                        console.log("Notify send OK to" + tokenUser + r);
                    });
                }


            };
            rpc.exec("tokenUsuario", arr, func);
        },
        sendNotificacionPushDos: function sendNotificacionPushDos(array, callback) {
            var key = 'AIzaSyCOoH2AZXucFRnHljZOQxQC8PPwtuIqIss';
            var to = array.to;
            console.log(to);
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
            })
//                    .catch(function (error) {
//                console.error(error);
//
//            })
        },
        applyFilters: function applyFilters() {
            var self = this;
            var data = {};
            data.filters = self.getFiltersData();
            if (qxnw.utils.evalue(self.config_cliente.bloqueo_tardanzas)) {
                if (parseInt(self.config_cliente.bloqueo_tardanzas) > 0) {
                    if (parseInt(self.config_cliente.minutos_adicionar_tardanzas) > 0) {
                        data.minutos_adicionar_tardanzas = self.config_cliente.minutos_adicionar_tardanzas;
                    }
                }
            }
            if (qxnw.utils.evalue(self.config_cliente.bloqueo_incumplimiento)) {
                if (parseInt(self.config_cliente.bloqueo_incumplimiento) > 0) {
                    data.bloqueo_incumplimiento = "SI";
                }
            }
            data.empresa_o_flota = main.empresa_o_flota;
//            data.permisos = main.permisos_usuario;
            data.permisos = main.permisos_usuario;
            console.log("data", data);
            var rpc = new qxnw.rpc(this.rpcUrl, "conductores");
            rpc.setAsync(true);
            var func = function (r) {
                console.log("r", r);
//                var porcent = r.comision.porcentaje;
//                var con = r.conductores.records;
                var con = r.records;
//                var ar = [];
                var totCondAct = 0;
                var divi = "<div style='width: 100%;height: 100%;display: flex;justify-content: center;align-items: center;background: #f3f3f3c9;'>";
                var divf = "</div>";
                for (var i = 0; i < con.length; i++) {
                    var ga = con[i];
                    if (ga.estado_activacion == "" || ga.estado_activacion == "null" || ga.estado_activacion === null) {
                        con[i].estado_activacion_text = "Cuenta-creada";
                    }
                    if (ga.estado_activacion == "1") {
                        totCondAct++;
                    }
                    if (ga.total_viajes === "0") {
                        con[i].total_valor = "0";
                    }
//                    con[i].comision_porcentaje = "0";
//                    if (r.comision !== false) {
//                        con[i].comision_porcentaje = parseFloat(porcent);
//                    }

                    var fecha_actual = new Date();
                    var fecha_lice = new Date(con[i].fecha_vencimiento);
                    fecha_actual.setDate(fecha_actual.getDate() + 31);
                    if (fecha_lice >= fecha_actual) {
                        con[i].licencia_semaforo = divi + "<img  alt='' src='/nwlib6/icons/green.png' />" + divf;
                    }
                    var fecha_actual = new Date();
                    fecha_actual.setDate(fecha_actual.getDate() + 1);

                    var fecha_actual2 = new Date();
                    fecha_actual2.setDate(fecha_actual.getDate() + 30);
                    if (fecha_lice > fecha_actual && fecha_lice <= fecha_actual2) {
                        con[i].licencia_semaforo = divi + "<img  alt='' src='/nwlib6/icons/yellow.png' />" + divf;
                    }
                    var fecha_actual = new Date();
                    if (fecha_lice <= fecha_actual) {
                        con[i].licencia_semaforo = divi + "<img  alt='' src='/nwlib6/icons/red.png' />" + divf;
                    }
//                    console.log(ga);
                    if (qxnw.utils.evalue(self.config_cliente.bloqueo_no_aceptacion_servicios)) {
                        if (parseInt(self.config_cliente.bloqueo_no_aceptacion_servicios) > 0) {
                            if (qxnw.utils.evalue(ga.numero_rechazos)) {
                                var numero_rechazos = JSON.parse(ga.numero_rechazos);
                                ga.catidad_rechazos = numero_rechazos.numero_rechazados;
                            }
                        }
                    }
                }

                r.records = con;

                self.setModelData(r);
            };
            rpc.exec("consultaConductor", data, func);
        },
        slotNuevo: function slotNuevo(a, t) {
            var self = this;
            var d = new transmovapp.forms.f_conductor(t);
            d.settings.accept = function () {
                self.applyFilters();
            };
            d.ui.estado_activacion.setValue(3);
            d.ui.estado_activacion.setEnabled(false);
            d.show();
            d.setModal(true);
            d.addListener("appear", function () {
                var element = d.ui.email.getContentElement().getDomElement();
                var element1 = d.ui.clave.getContentElement().getDomElement();
                element.setAttribute("autocomplete", "new-password");
                element1.setAttribute("autocomplete", "new-password");
            });
        },
        slotEditar: function slotEditar() {
            var self = this;
            var r = self.selectedRecord();
            if (r == undefined) {
                qxnw.utils.alert(self.tr("Seleccione un registro"));
                return;
            }
            var t = main.getConfiguracion();
            var d = new transmovapp.forms.f_conductor(t, r);
            d.ui.clave.setRequired(false);
//            d.ui.clave.setVisibility("excluded");
//            d.setFieldVisibility(self.ui.clave, "excluded");
            d.ui.estado_activacion.setEnabled(false);
            d.setParamRecord(r, t);
            d.settings.accept = function () {
                self.applyFilters();
            };
            d.show();
            d.setModal(true);
        },
        slotVer: function slotVer(dataa) {
            var self = this;
            var r = self.selectedRecord();
            if (r == undefined) {
                qxnw.utils.alert("Seleccione un registro");
                return;
            }
            var d = new transmovapp.lists.l_servicios(r.id);
            if (!d.setParamRecord(r.id)) {
                qxnw.utils.alert("No se usó el setParamRecord");
                return;
            }
            d.settings.accept = function () {
                self.applyFilters();
            };
            d.show();
        },
        slotVehiculos: function slotVehiculos(dataa) {
            var self = this;
            var r = self.selectedRecord();
            if (r == undefined) {
                qxnw.utils.alert("Seleccione un registro");
                return;
            }
            var d = new transmovapp.lists.l_vehiculos(r);
            if (!d.setParamRecord(r)) {
                qxnw.utils.alert("No se usó el setParamRecord");
                return;
            }
            d.maximize();
//            d.setMaxWidth(1100);
//            d.setMinWidth(1100);
            d.settings.accept = function () {
                self.applyFilters();
            };
            d.show();
        },
        slotEliminar: function slotEliminar() {
            var self = this;
            var r = self.selectedRecord();
            if (typeof r == 'undefined') {
                qxnw.utils.alert(self.tr("Seleccione un registro"));
                return;
            }
            qxnw.utils.question(self.tr("¿Está seguro de eliminar el registro de forma permanente?"), function (e) {
                if (e) {
                    var rpc = new qxnw.rpc(self.getRpcUrl(), "conductores", true);
                    var func = function (r) {
                        self.removeSelectedRow();
                        self.applyFilters();
                    };
                    rpc.exec("eliminar", r, func);
                } else {
                    return;
                }
            });
        },
        slotSaldo: function slotSaldo(data) {
            var self = this;
            var d = new usuarios_app.forms.f_usuarios_saldo();
            d.setParamRecord(data);
            d.settings.accept = function () {
                self.applyFilters();
            };
            d.show();
        },
        slotActivar: function slotActivar(p) {
            var self = this;
            var data = self.selectedRecord();
            if (typeof data == 'undefined') {
                qxnw.utils.alert(self.tr("Seleccione un registro"));
                return;
            }
            var msg = "¿Desea <strong style='color: green;'>ACTIVAR</strong> este usuari@ para que pueda recibir y asignarle servicios?";
            if (data.estado_activacion == "1") {
                msg = "¿Desea <strong style='color: red;'>INACTIVAR</strong> este usuari@ para que NO pueda recibir servicios?";
            }
            qxnw.utils.question(self.tr(msg), function (e) {
                if (e) {
                    var rpc = new qxnw.rpc(self.getRpcUrl(), "conductores", true);
                    console.log("slotActivar:::sendData", data);
                    var func = function (r) {
                        console.log("slotActivar:::responseServer", r);
                        self.applyFilters();
                    };
                    rpc.exec("cambioEstado", data, func);
                } else {
                    return;
                }
            });
        },
        slotHours: function slotHours(data) {
            var self = this;
            var d = new qxnw.forms();
            var fields = [
                {
                    label: "Hora inicio",
                    name: "hora_inicio",
                    type: "timeField",
                    required: true
                },
                {
                    label: "Hora Fin",
                    name: "hora_fin",
                    type: "timeField",
                    required: true
                }
            ];
            d.setFields(fields);
            d.setRecord(data);
            d.setTitle("Horarios de trabajo");
            d.setModal(true);
            d.setWidth(300);
            d.setHeight(200);
            d.show();
            d.ui.accept.addListener("execute", function () {
                var dat = d.getRecord();
                dat.id = data.id;
                var rpc = new qxnw.rpc(self.getRpcUrl(), "conductores");
                rpc.setAsync(true);
                var func = function (r) {
                    qxnw.utils.information("Horarios guradados con exito");
                    d.accept();
                };
                rpc.exec("saveHoursDrivers", dat, func);
            });
            d.ui.cancel.addListener("execute", function () {
                d.reject();
            });
        }
    }
});