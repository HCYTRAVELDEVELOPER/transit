qx.Class.define("usuarios_app.lists.l_usuarios", {
    extend: qxnw.lists,
    construct: function (table) {
        var self = this;
        this.base(arguments);
        this.buttonsAutomatic = true;
        this.createBase();

        self.permisos = main.permisos_usuario;

        qxnw.local.storeData(self.getAppWidgetName() + "_max_show_rows", 20);

        var columns = [
            {
                label: "Código",
                caption: "id"
            },
            {
                label: "FUEC Contrato extracto",
                caption: "contrato"
            },
            {
                label: "Foto",
                caption: "foto_perfil",
                type: "image",
                mode: "phpthumb"
            },
            {
                label: "Fecha registro",
                caption: "fecha_registro"
            },
            {
                label: "Fecha Ultima Conexión",
                caption: "fecha_ultima_conexion"
            },
            {
                label: "Fecha acepta términos",
                caption: "fecha_acepta_terminos"
            },
            {
                label: "Documento #",
                caption: "nit"
            },
            {
                label: "Tipo Documento",
                caption: "tipo_doc"
            },
            {
                label: "Nombre",
                caption: "nombre"
            },
            {
                label: "Apellido",
                caption: "apellido"
            },
            {
                label: "Usuario",
                caption: "usuario_cliente"
            },
            {
                label: "País ID",
                caption: "pais"
            },
            {
                label: "País",
                caption: "pais_text"
            },
            {
                label: "Ciudad ID",
                caption: "ciudad"
            },
            {
                label: "Ciudad",
                caption: "ciudad_text"
            },
            {
                label: "Clave",
                caption: "clave"
            },
            {
                label: "Saldo",
                caption: "saldo"
            },
            {
                label: "E-mail",
                caption: "email"
            },
            {
                label: "Telefono",
                caption: "celular"
            },
            {
                label: "Perfil",
                caption: "perfil_text"
            },
            {
                label: "ID Perfil",
                caption: "perfil"
            },
            {
                label: "ID empresa",
                caption: "empresa"
            },
            {
                label: "Conectado",
                caption: "estado_conexion"
            },
            {
                label: "Genero",
                caption: "genero"
            },
            {
                label: "Puntaje",
                caption: "puntaje"
            },
            {
                label: "Estado",
                caption: "estado"
            },
            {
                label: "Empresa cliente ID",
                caption: "bodega"
            },
            {
                label: "Empresa cliente",
                caption: "bodega_text"
            },
            {
                label: "Centro costos ID",
                caption: "centro_costo"
            },
            {
                label: "Centro costos",
                caption: "centro_costo_text"
            },
            {
                label: "Número Referidos User",
                caption: "numero_referidos_user"
            },
            {
                label: "Número Referidos Driver",
                caption: "numero_referidos_driver"
            },
            {
                label: "Token",
                caption: "token"
            },
            {
                label: "Token actual app",
                caption: "token_actual_app"
            },
            {
                label: "Token actual app fecha",
                caption: "token_actual_app_fecha"
            },
            {
                label: "Sistema operativo",
                caption: "sistema_operativo"
            },
            {
                label: "Zona Horaria Actual",
                caption: "zonaHorariaActual"
            },
            {
                label: "Dispositivo",
                caption: "dispositivo"
            },
            {
                label: "Offline",
                caption: "offline"
            },
            {
                label: "Estado activacion code",
                caption: "estado_activacion"
            },
            {
                label: "Estado activacion",
                caption: "estado_activacion_text"
            },
            {
                label: "Creado desde",
                caption: "creado_desde"
            },
            {
                label: "Latitud",
                caption: "latitud"
            },
            {
                label: "Longitud",
                caption: "longitud"
            }
        ];
        self.setColumns(columns);

        var filters = [
            {
                name: "buscar",
                caption: "buscar",
                label: "Filtro...",
//                type: "search"
                type: "textField"
            },
            {
                name: "perfil",
                caption: "Perfil",
                label: "Perfil",
                type: "selectBox",
                required: true
            },
            {
                name: "estado",
                caption: "estado",
                label: "Estado",
                type: "selectBox"
            },
            {
                name: "fecha_inicial",
                caption: "fecha_inicial",
                label: "Fecha Inicial",
//                required: true,
                type: "dateField"
            },
            {
                name: "fecha_final",
                caption: "fecha_final",
                label: "Fecha Final",
//                required: true,
                type: "dateField"
            },
            {
                name: "tabla",
                caption: "tabla",
                label: "tabla",
                type: "textField",
                visible: false
            }
        ];
        self.createFilters(filters);

        self.hideColumn("clave");
        self.hideColumn("bodega");
        self.hideColumn("centro_costo");
        self.hideColumn("perfil");
        self.hideColumn("pais");
        self.hideColumn("ciudad");
        self.hideColumn("bodega");

        self.setAllPermissions(true);

        var data = {};
        data["activo"] = "Activo";
        data["inactivo"] = "Inactivo";
        data[""] = "Todos";
        qxnw.utils.populateSelectFromArray(self.ui.estado, data);

        var data = {};
        data[""] = "Seleccione";
        data["1"] = "Pasajero";
        data["2"] = "Conductor";
        qxnw.utils.populateSelectFromArray(self.ui.perfil, data);
        self.ui.perfil.setValue("");

        self.ui.editButton.addListener("click", function () {
            self.slotEditar();
        });

        self.ui.unSelectButton.setIcon(qxnw.config.execIcon("zoom-fit-best"));
        qxnw.utils.addClassToElement(self.ui.unSelectButton, "btn_redAdmi");
        qxnw.utils.addClassToElement(self.ui.unSelectButton, "btn_others");
        self.ui.unSelectButton.setLabel(self.tr("Importación masiva"));
        self.ui.unSelectButton.setShow("both");
        self.ui.unSelectButton.setMaxWidth(190);
        self.ui.unSelectButton.setMinWidth(190);
        self.ui.unSelectButton.setMaxHeight(30);
        self.ui.unSelectButton.setMinHeight(30);
        self.ui.unSelectButton.addListener("click", function () {
            var d = new usuarios_app.forms.importar();
            d.settings.accept = function () {
                self.applyFilters();
            };
            d.show();
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

        self.ui.selectAllButton.setVisibility("excluded");
        self.ui.editButton.setVisibility("excluded");
        self.ui.deleteButton.setVisibility("excluded");

        var up = qxnw.userPolicies.getUserData();

        self.ui.exportButton.setEnabled(true);
        if (up.profile == "1223") {
            self.ui.editButton.setEnabled(false);
            self.ui.deleteButton.setEnabled(false);
        }

        self.created = false;
        self.addListener("appear", function () {
            if (!self.created) {
                self.ui.perfil.setValue("");
                self.ui.fecha_inicial.setValue("");
                self.ui.fecha_final.setValue("");
                self.ui.estado.setValue("activo");

                self.ui.perfil.addListener("changeSelection", function (e) {
                    var data = this.getValue();
                    console.log("data", data);
                    if (qxnw.utils.evalueData(data)) {
                        self.applyFilters();
                    }
                });

                self.created = true;
            }
        });
//        self.execSettings();
//        self.applyFilters();
    },
    destruct: function () {
    },
    members: {
        contextMenu: function contextMenu(veteapp) {
            var self = this;
            var pr = self.selectedRecord();
            console.log("pr", pr);
            pr.filters = self.getFiltersData();
            var m = new qxnw.contextmenu(this);
            var up = qxnw.userPolicies.getUserData();
            console.log("pr", pr);
//            if (up.profile !== "1223") {
            m.addAction("Saldo", "icon/16/actions/document-properties.png", function (e) {
                self.slotSaldo();
            });
            m.addAction("Editar", "icon/16/actions/document-properties.png", function (e) {
                self.slotEditar();
            });
            m.addAction("Enviar mensaje (PUSH app y correo)", "icon/16/actions/document-properties.png", function (e) {
                console.log("pr", pr);
                main.slotEnviarMsgByUser(pr.usuario_cliente, pr.filters.perfil);
            });
            m.addAction("Permisos otorgados en el dispositivo", "icon/16/actions/document-properties.png", function (e) {
                self.slotPermisosHistorial();
            });
            m.addAction("Histórico de recargas", "icon/16/actions/document-properties.png", function (e) {
                self.slotRecargas();
            });
            m.addAction("Histórico de referidos", "icon/16/actions/document-properties.png", function (e) {
                self.slotReferidosHistorial();
            });
            if (pr.perfil.toString() == "1") {
                m.addAction("Direcciones guardadas", "icon/16/actions/document-properties.png", function (e) {
                    self.slotDireccionesGuardadas();
                });
            }
            if (self.permisos.eliminar_usuarios_app == "true") {
                m.addAction("Eliminar", "icon/16/actions/dialog-close.png", function (e) {
                    self.slotEliminar();
                });
            }

            m.addAction("Última Ubicación", "icon/16/actions/document-properties.png", function (e) {
                if (!qxnw.utils.evalueData(pr.latitud) || !qxnw.utils.evalueData(pr.longitud)) {
                    qxnw.utils.information("El usuario no cuenta con coordenadas de ubicación. Esto se debe a que no ha iniciado sesión en la aplicación o no cuenta con los permisos suficientes.");
                    return false;
                }
                self.mapa = new enrutamiento.forms.f_mapa_libre();
                self.mapa.setModal(true);
                self.mapa.setWidth(800);
                self.mapa.setHeight(600);
                self.mapa.show();

                self.mapa.addListener("appear", function () {
                    if (!self.mapa.creadoOnAppear) {
                        ubicar();
                    }
                    self.mapa.creadoOnAppear = true;
                });

                function ubicar() {
                    var icon = false;
                    var lat = parseFloat(pr.latitud);
                    var lng = parseFloat(pr.longitud);
                    var latLong = new google.maps.LatLng(lat, lng);
                    var location = latLong;
                    var title = pr.usuario;
                    var titleHover = pr.usuario;
                    var openAtClick = false;
                    var animationOnClick = false;
                    var openIcon = true;
                    var centerMap = false;
                    var callbackonclick = function (marker) {
                        marker.data.callbackMarker(marker);
                    };
                    var othersPropertiesArray = false;
                    var marker = self.mapa.googleMap.placeMarker(location, title, openAtClick, icon, openIcon, centerMap, callbackonclick, false, animationOnClick, othersPropertiesArray);

                    setTimeout(function () {
                        var location = new google.maps.LatLng(pr.latitud, pr.longitud);
                        self.mapa.googleMap.map.setCenter(location);
                    }, 500);
                }
            });
            m.exec(veteapp);
//            }
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
                    var rpc = new qxnw.rpc(self.getRpcUrl(), "usuarios", true);
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
        slotDireccionesGuardadas: function slotDireccionesGuardadas() {
            var self = this;
            var pr = self.selectedRecord();
            self.navTableDirecciones = new qxnw.lists();
            self.navTableDirecciones.createBase();
            var columns = [
                {
                    label: self.tr("Usuario"),
                    caption: "usuario",
                    mode: "toolTip"
                },
                {
                    label: self.tr("Nombre"),
                    caption: "nombre",
                    mode: "toolTip"
                },
                {
                    label: self.tr("Dirección"),
                    caption: "direccion",
                    mode: "toolTip"
                },
                {
                    label: self.tr("Tipo"),
                    caption: "tipo",
                    mode: "toolTip"
                },
                {
                    label: self.tr("Fecha"),
                    caption: "fecha",
                    mode: "toolTip"
                },
                {
                    label: self.tr("Results"),
                    caption: "results",
                    mode: "toolTip"
                }
            ];
            self.navTableDirecciones.setColumns(columns);

//            self.navTableDirecciones.setMaxWidth(600);
//            self.navTableDirecciones.setMinWidth(600);

            self.navTableDirecciones.hideFooterTools();
            self.navTableDirecciones.ui.newButton.setVisibility("excluded");
            self.navTableDirecciones.ui.deleteButton.setVisibility("excluded");
            self.navTableDirecciones.ui.updateButton.setVisibility("excluded");
            self.navTableDirecciones.ui.editButton.setVisibility("excluded");
//            self.navTableRecargas.ui.part3.setVisibility("excluded");
//            self.navTableRecargas.ui.part4.setVisibility("excluded");
            self.navTableDirecciones.applyFilters = function () {
                var rpc = new qxnw.rpc(self.getRpcUrl(), "usuarios");
                rpc.setAsync(true);
                var func = function (r) {
                    self.navTableDirecciones.setModelData(r);
                };
                rpc.exec("consultaHistoricoDirecciones", pr, func);
            };
            self.navTableDirecciones.applyFilters();
            self.navTableDirecciones.show();
        },
        slotPermisosHistorial: function slotPermisosHistorial() {
            var self = this;
            var pr = self.selectedRecord();
            self.navTablePermisos = new qxnw.lists();
            self.navTablePermisos.createBase();
            var columns = [
                {
                    label: self.tr("Usuario"),
                    caption: "usuario",
                    mode: "toolTip"
                },
                {
                    label: self.tr("Perfil"),
                    caption: "perfil",
                    mode: "toolTip"
                },
                {
                    label: self.tr("Empresa"),
                    caption: "empresa",
                    mode: "toolTip"
                },
                {
                    label: self.tr("Text"),
                    caption: "text",
                    mode: "toolTip"
                },
                {
                    label: self.tr("Fecha"),
                    caption: "fecha",
                    mode: "toolTip"
                },
                {
                    label: self.tr("Fecha server"),
                    caption: "fecha_server",
                    mode: "toolTip"
                },
                {
                    label: self.tr("OS"),
                    caption: "os",
                    mode: "toolTip"
                },
                {
                    label: self.tr("Token"),
                    caption: "token",
                    mode: "toolTip"
                }
            ];
            self.navTablePermisos.setColumns(columns);

//            self.navTablePermisos.setMaxWidth(600);
//            self.navTablePermisos.setMinWidth(600);

            self.navTablePermisos.hideFooterTools();
            self.navTablePermisos.ui.newButton.setVisibility("excluded");
            self.navTablePermisos.ui.deleteButton.setVisibility("excluded");
            self.navTablePermisos.ui.updateButton.setVisibility("excluded");
            self.navTablePermisos.ui.editButton.setVisibility("excluded");
//            self.navTableRecargas.ui.part3.setVisibility("excluded");
//            self.navTableRecargas.ui.part4.setVisibility("excluded");
            self.navTablePermisos.applyFilters = function () {
                var rpc = new qxnw.rpc(self.getRpcUrl(), "usuarios");
                rpc.setAsync(true);
                var func = function (r) {
                    self.navTablePermisos.setModelData(r);
                };
                rpc.exec("consultaHistoricoPermisos", pr, func);
            };
            self.navTablePermisos.applyFilters();
            self.navTablePermisos.show();
        },
        slotReferidosHistorial: function slotReferidosHistorial() {
            var self = this;
            var pr = self.selectedRecord();
            self.navTableReferidos = new qxnw.lists();
            self.navTableReferidos.createBase();
            var columns = [
                {
                    label: self.tr("ID"),
                    caption: "id",
                    visible: false

                },
                {
                    label: self.tr("Perfil"),
                    caption: "perfil"
                },
                {
                    label: self.tr("Empresa"),
                    caption: "empresa",
                    visible: false
                },
                {
                    label: self.tr("Fecha"),
                    caption: "fecha"
                },
                {
                    label: self.tr("Usuario referido"),
                    caption: "usuario_referido"
                },
                {
                    label: self.tr("Usuario"),
                    caption: "usuario"
                },
                {
                    label: self.tr("Nombre referido"),
                    caption: "nombre_referido"
                },
                {
                    label: self.tr("Usuario refiere"),
                    caption: "usuario_refiere",
                    visible: false
                }
            ];
            self.navTableReferidos.setColumns(columns);

            self.navTableReferidos.setMaxWidth(600);
            self.navTableReferidos.setMinWidth(600);

            self.navTableReferidos.hideFooterTools();
            self.navTableReferidos.ui.newButton.setVisibility("excluded");
            self.navTableReferidos.ui.deleteButton.setVisibility("excluded");
            self.navTableReferidos.ui.updateButton.setVisibility("excluded");
            self.navTableReferidos.ui.editButton.setVisibility("excluded");
//            self.navTableRecargas.ui.part3.setVisibility("excluded");
//            self.navTableRecargas.ui.part4.setVisibility("excluded");
            self.navTableReferidos.applyFilters = function () {
                var rpc = new qxnw.rpc(self.getRpcUrl(), "usuarios");
                rpc.setAsync(true);
                var func = function (r) {
                    self.navTableReferidos.setModelData(r);
                };
                rpc.exec("consultaHistoricoReferidos", pr, func);
            };
            self.navTableReferidos.applyFilters();
            self.navTableReferidos.show();
        },
        slotRecargas: function slotRecargas() {
            var self = this;
            var pr = self.selectedRecord();
            self.navTableRecargas = new qxnw.lists();
            self.navTableRecargas.createBase();
            var columns = [
                {
                    label: self.tr("ID"),
                    caption: "id"
                },
                {
                    label: self.tr("Fecha"),
                    caption: "fecha"
                },
                {
                    label: self.tr("Valor"),
                    caption: "valor_recarga"
                },
                {
                    label: self.tr("Estado"),
                    caption: "estado"
                },
                {
                    label: self.tr("Fecha Transacción"),
                    caption: "fecha_transaccion"
                },
                {
                    label: self.tr("Saldo Anterior"),
                    caption: "saldo_anterior"
                },
                {
                    label: self.tr("Saldo Actual"),
                    caption: "saldo_actual"
                },
                {
                    label: self.tr("Tipo"),
                    caption: "tipo"
                },
                {
                    label: "Usuario recarga",
                    caption: "usuario_modifica"
                }
            ];
            self.navTableRecargas.setColumns(columns);
            self.navTableRecargas.hideColumn("id");
            self.navTableRecargas.hideColumn("adjunto");
            self.navTableRecargas.hideColumn("vehiculo");
            self.navTableRecargas.hideColumn("usuario");
//            self.navTableRecargas.setMaxWidth(600);
//            self.navTableRecargas.setWidth(600);

            self.navTableRecargas.setWidth(1200);
            self.navTableRecargas.setHeight(600);
            self.navTableRecargas.setModal(true);


            self.navTableRecargas.hideFooterTools();
            self.navTableRecargas.ui.newButton.setVisibility("excluded");
            self.navTableRecargas.ui.deleteButton.setVisibility("excluded");
            self.navTableRecargas.ui.updateButton.setVisibility("excluded");
            self.navTableRecargas.ui.editButton.setVisibility("excluded");
//            self.navTableRecargas.ui.part3.setVisibility("excluded");
//            self.navTableRecargas.ui.part4.setVisibility("excluded");
            self.navTableRecargas.applyFilters = function () {
                var rpc = new qxnw.rpc(self.getRpcUrl(), "usuarios");
                rpc.setAsync(true);
                var func = function (r) {
                    self.navTableRecargas.setModelData(r);
                };
                rpc.exec("consultaHistoricoRecargas", pr, func);
            }
            self.navTableRecargas.applyFilters();
            self.navTableRecargas.show();
        },
        applyFilters: function applyFilters() {
            var self = this;
            if (!self.validate()) {
                return false;
            }
            var data = {};
            data.filters = self.getFiltersData();
            if (!qxnw.utils.evalueData(data.filters.perfil)) {
                qxnw.utils.information("Seleccione el perfil");
                return false;
            }
            var up = qxnw.userPolicies.getUserData();
            if (up.profile == "1232") {
                data.filters["bodega"] = up.bodega;
            }
            var rpc = new qxnw.rpc(self.getRpcUrl(), "usuarios_app");
            rpc.setAsync(true);
            var func = function (r) {
                console.log("l_servicios_totales:::applyFilters:::responseServer:::r", r);
                self.setModelData(r);
            };
            rpc.exec("consultaUsuariosList", data, func);
        },
        slotNuevo: function slotNuevo() {
            var self = this;
            var r = self.selectedRecord();
            var filters = self.getFiltersData();
            if (!qxnw.utils.evalueData(filters.perfil)) {
                qxnw.utils.information("Seleccione el perfil");
                if (!self.validate()) {
                    return false;
                }
            }
            var table = self.ui.tabla.getValue();
//            var d = new usuarios_app.forms.f_usuarios(table, r);
            var d = new usuarios_app.forms.f_usuarios(r, filters);
            d.ui.tabla.setValue(table);
            d.settings.accept = function () {
                self.applyFilters();
            };
            d.addListener("appear", function () {
                var element = d.ui.email.getContentElement().getDomElement();
                var element1 = d.ui.clave.getContentElement().getDomElement();
                element.setAttribute("autocomplete", "new-password");
                element1.setAttribute("autocomplete", "new-password");
            });
            d.setWidth(1200);
            d.setHeight(600);
            d.setModal(true);
//                d.setMaxWidth(1200);
//                d.setMaxHeight(600);
            d.show();
        },
        slotSaldo: function slotSaldo() {
            var self = this;
            var r = self.selectedRecord();
            if (r == undefined) {
                qxnw.utils.alert("Seleccione un registro");
                return false;
            }
            var d = new usuarios_app.forms.f_usuarios_saldo();
            d.setParamRecord(r);
            d.settings.accept = function () {
                self.applyFilters();
            };
            d.show();
        },
        slotEditar: function slotEditar() {
            var self = this;
            var r = self.selectedRecord();
            if (r == undefined) {
                qxnw.utils.alert("Seleccione un registro");
                return;
            }
            table = self.ui.tabla.getValue();
            var d = new usuarios_app.forms.f_usuarios();
//            d.ui.clave.setValue("0");
//            d.setFieldVisibility(d.ui.clave, "excluded");
            d.ui.usuario_cliente.setEnabled(false);
            d.ui.tabla.setValue(table);
            if (!d.setParamRecord(r)) {
                qxnw.utils.alert("No se usó el setParamRecord");
                return;
            }
            d.settings.accept = function () {
                self.applyFilters();
            };
            d.setWidth(1200);
            d.setHeight(600);
            d.setModal(true);
            d.show();
        },
        setParamRecord: function setParamRecord(pr) {
            var self = this;
            self.applyFilters();
            return true;
        }
    }
});