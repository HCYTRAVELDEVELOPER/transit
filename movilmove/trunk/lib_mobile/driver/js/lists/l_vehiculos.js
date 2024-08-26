nw.Class.define("l_vehiculos", {
    extend: nw.lists,
    construct: function (createInHomeSend) {
        var self = this;
        self.showContextMenu = true;

        var createInHome = false;
        if (typeof createInHomeSend !== "undefined") {
            createInHome = createInHomeSend;
        }
        if (createInHome === true) {
            self.canvas = "#foo";
            self.id_form = "l_vehiculos";
        } else {
            self.id = "l_vehiculos";
            self.setTitle = nw.tr("Mis vehículos");
            self.html = nw.tr("Mis vehículos");
            self.showBack = true;
            self.closeBack = false;
            self.textClose = "Volver";
            self.colorBtnBackIOS = "#ffffff;";
            self.styleCloseIOS = "color:#ffffff;color: rgb(255, 255, 255);background-color: transparent;border: 0;box-shadow:none;";
            self.createBase();
        }

//        self.id = "l_vehiculos";
//        self.setTitle = "Mis vehículos";
//        self.html = "Mis vehículos";
//        self.showBack = true;
//        self.closeBack = false;
//        self.textClose = "Volver";
//        self.createBase();


        var fecha_vencimiento_soat_visible = false;
        if (main.configCliente.soat === "SI") {
            fecha_vencimiento_soat_visible = true;
        }

        var columns = [
            {
                name: "imagen_vehi_show",
                label: "",
                type: "image",
//                mode: "phpthumb",
                visible: true
            },
            {
                name: "id",
                label: "ID",
                visible: true
            },
            {
                name: "mostrar_vehi",
                label: "",
                visible: true
            },
            {
                name: "placa",
                label: "Placa"
            },
            {
//                name: "vehiculo_publico_particular",
                name: "vehiculo_publico_particular_text",
                label: "Vehículo público, particular o taxi",
                visible: true
            },
            {
                name: "tipo_vehiculo",
                label: "Tipo Vehículo",
                visible: false
            },
            {
                name: "capacidad_pasajeros",
                label: "Capacidad Pasajeros",
                visible: false
            },
            {
                name: "numero_puertas",
                label: "Número Puertas",
                visible: false
            },
            {
                name: "marca_text",
                label: "Marca",
                mode: "Marca",
                visible: true
            },
            {
                name: "usuario_usando",
                label: "Usuario usando"
            },
            {
                name: "color",
                label: "Color",
                visible: true
            },
            {
                name: "modelo",
                label: "Modelo",
                visible: false
            },
            {
                name: "fecha_vencimiento_soat",
                label: "SOAT fecha vencimiento",
                mode: "date_format",
                visible: fecha_vencimiento_soat_visible
            },
            {
                name: "tarjeta_propiedad",
                label: "Tarjeta de propiedad",
                visible: false
            },
            {
                name: "no_licencia",
                label: "Numero de licencia",
                visible: true
            },
            {
                name: "lic_conductor1",
                label: "Imagen de licencia frontal",
                visible: false
            },
            {
                name: "lic_conductor2",
                label: "Imagen de licencia trasera",
                visible: false
            },
            {
                name: "selfie_licencia",
                label: "Selfi de conductor y licencia",
                visible: false
            },
            {
                name: "hoja_vida",
                label: "Hoja de vida",
                visible: false
            },
            {
                name: "antecedentes_judiciales",
                label: "Antecedentes",
                visible: false
            },
            {
                name: "foto_perfil",
                label: "Foto perfil",
                visible: false
            },
            {
//                name: "estado_activacion_text",
                name: "estado_activacion_text_text",
                label: "Estado"
            },
            {
//                name: "activacion_cliente",
                name: "activacion_cliente_text",
                label: "Activado cliente"
            },
            {
                name: "usar_vehiculo",
                label: "",
                type: "button"
            }
        ];
        self.setColumns(columns);

        self.buttons = [];
        self.buttons.push(
                {
                    icon: "material-icons add normal",
                    position: "top",
                    name: "nuevo",
                    label: "",
                    callback: function () {
                        var d = new f_vehiculo();
                        d.construct();
//                        d.show();
                    }
                }
        );

        self.show();

        var click = 'click'; //touchstart click
        var col = "usar_vehiculo";
//        $(self.canvas).on(click, ".rowName_" + col, function () {
//            $(this.parentElement).trigger({type: 'click'});
//           self.activarVehiculo();
//        });
        (function () {
            $(self.canvas).delegate(".rowName_" + col, click, function (e, ev) {
                $(this.parentElement).trigger({type: 'click'});
//            callback(this);
                self.activarVehiculo();
            });
        })();
//        self.actionCol("iniciar_servicio", function () {
//            self.activarVehiculo();
//        });


        self.onAppear(function () {
            setTimeout(function () {
                self.applyFilters();
            }, 100);
        });
    },
    destruct: function () {
    },
    members: {
        contextMenu: function contextMenu() {
            var self = this;
            var up = nw.userPolicies.getUserData();
            var sl = self.selectedRecord();
            var m = new nw.contextmenu(this, "bottom");//vertical, bottom
//            m.addAction("Eliminar", "material-icons delete normal", function (e) {
//                self.eliminar(sl);
//            });
            m.addAction("Ver", "material-icons create normal", function (e) {
                var d = new f_vehiculo();
                d.construct(sl);
//                d.show();
                d.populate(sl);
                console.log(sl);
            });
            m.addAction("Usar Vehículo", "material-icons create normal", function (e) {
                self.activarVehiculo();
            });
        },
        clicRow: function clicRow() {
            var self = this;
//            var sl = self.selectedRecord();
//            var d = new f_vehiculo();
//            d.construct(sl);
//            d.populate(sl);
//            self.contextMenu();
        },
        canvas: function canvas(canvas) {
            var self = this;
            self.canvas = canvas;
        },
        eliminar: function eliminar(data) {
            var self = this;
            nw.dialog("¿Desea eliminar este vehículo?", accept, cancel);
            function accept() {
                nw.loading({text: "Eliminando...", textVisible: true, html: "", theme: "b", "container": self.canvas});
                var rpc = new nw.rpc(self.getRpcUrl(), "vehiculo");
                rpc.setAsync(true);
                var func = function (r) {
                    nw.loadingRemove({"container": self.canvas});
                    nw.dialog("Eliminado correctamente");
                    main.misVehiculos();
                };
                rpc.exec("eliminarVehiculo", data, func);
            }
            function cancel() {

            }
        },
        activarVehiculo: function activarVehiculo() {
            var self = this;
            var up = nw.userPolicies.getUserData();
            var ve = self.selectedRecord();
            console.log("up", up);
            console.log("selectedRecord", ve);
            var fecha_actual = new Date();
            var fecha_tegno = new Date(ve.fecha_vencimiento_soat);
            fecha_tegno.setDate(fecha_tegno.getDate() + 1);
            console.log(fecha_tegno);
            console.log(fecha_actual);
            if (fecha_tegno <= fecha_actual && main.configCliente.soat == "SI") {
                nw.dialog("Se ha vencido o esta por vencer el SOAT de tu vehículo por favor actualiza los datos para poder continuar.");
                return;
            }
            var data = {};
            data.usuario = up.usuario;
            data.id_usuario = up.id_usuario;
            data.empresa = up.empresa;
            data.id_vehiculo = ve.id;
            data.placa = ve.placa;

//            da.usuario = self.datadriver.usuario_cliente;
//            da.id_usuario = self.datadriver.id;
//            da.empresa = self.datadriver.empresa;
//            da.id_vehiculo = data.id;
//            da.placa = data.placa;
            var rpc = new nw.rpc(self.getRpcUrl(), "vehiculo");
            rpc.setAsync(true);
            var func = function (r) {
                console.log(r);
                if (r == "NO") {
                    nw.dialog("Lo sentimos. El vehículo aún no está activo, comunícate con el administrador");
                    return;
                }
                nw.dialog("¡Vehículo en uso! Ahora podrás iniciar servicios con este vehículo.", function () {
                    window.location.reload();
                });
            };
            rpc.exec("activarVehiculo", data, func);

        },
        applyFilters: function applyFilters() {
            var self = this;
            var up = nw.userPolicies.getUserData();
//            nw.loading({text: "Cargando visitas...", textVisible: true, html: "", theme: "b", "container": self.canvas});
            var data = {};
            data.empresa = up.empresa;
            data.usuario = up.usuario;
            data.id_usuario = up.id_usuario;
//            data.list = true;
//            data.filters = self.getFiltersData();
            var vencidos = [];
            var activo_uso = [];
            var activo = [];
            console.log("applyFilters:::sendData:::data", data);
            var rpc = new nw.rpc(self.getRpcUrl(), "vehiculo");
            rpc.setAsync(true);
            var func = function (r) {
                console.log("applyFilters:::responseServer:::r", r);
                nw.loadingRemove({"container": self.canvas});
//                var domain = config.domain_rpc;

                self.clean();

                for (var i = 0; i < r.length; i++) {
                    var row = r[i];
                    row.vehiculo_publico_particular_text = nw.tr(row.vehiculo_publico_particular);
                    var foto = config.domain_rpc + nw.utils.getFileByType(row.imagen_vehi, 100);
                    r[i].imagen_vehi_show = foto;

                    row.estado_activacion_text = row.estado_activacion_text.replace("_", " ").toUpperCase();
                    row.estado_activacion_text_text = nw.tr(row.estado_activacion_text);
                    row.activacion_cliente_text = nw.tr(row.activacion_cliente);

                    var fecha_actual = new Date();
                    var fecha_tegno = new Date(row.fecha_vencimiento_soat);
                    fecha_actual.setDate(fecha_actual.getDate() + 5);
                    if (fecha_tegno <= fecha_actual) {
                        vencidos.push({vencido: i});
                    } else {
                        if (row.estado_activacion == "1") {
//                            if (row.activacion_cliente == "SI") {
                            if (row.usuario_usando == up.usuario_cliente) {
                                activo_uso.push({activo_uso: i});
                            } else {
                                activo.push({activo: i});
                            }
                        } else if (row.estado_activacion == "2") {
                            vencidos.push({vencido: i});
                        }
                    }
                    r[i].usar_vehiculo = "<i class='material-icons'>play_arrow</i> " + nw.tr("Usar para servicios");

                }
                self.setModelData(r);

                if (activo_uso.length > 0) {
                    $("#rowlist_" + activo_uso[0]["activo_uso"]).css("cssText", "background:rgb(47, 236, 145);");
                    $("#rowlist_" + activo_uso[0]["activo_uso"]).append("<div style='width: 58%;position: absolute;bottom: 5px;right: 0;text-align: center;display: flex;justify-content: center;align-items: center;color: #1f1c1c;text-shadow: 0px 0px'> <i class='material-icons' style='margin-right: 6px;'>offline_pin</i>  " + nw.tr("En uso.") + "</div>");
                }
                if (activo.length > 0) {
                    for (var h = 0; h < activo.length; h++) {
                        $("#rowlist_" + activo[h]["activo"]).css("cssText", "background:rgba(243, 184, 52, 0.42);");
                        $("#rowlist_" + activo[h]["activo"]).append("<div style='width: 58%;position: absolute;bottom: 5px;right: 0;text-align: center;display: flex;justify-content: center;align-items: center;color: #1f1c1c;text-shadow: 0px 0px'> <i class='material-icons' style='margin-right: 6px;'>highlight_off</i>    " + nw.tr("Sin usar.") + "</div>");
                    }
                }
                if (vencidos.length > 0) {
                    for (var e = 0; e < vencidos.length; e++) {
                        $("#rowlist_" + vencidos[e]["vencido"]).css("cssText", "background:#ff00006b;");
                        $("#rowlist_" + vencidos[e]["vencido"]).append("<div style='width: 69%;position: absolute;bottom: 5px;right: 0;text-align: center;display: flex;justify-content: center;align-items: center;color: red;text-shadow: 0px 0px'> <i class='material-icons' style='margin-right: 0px;'>priority_high</i>" + nw.tr("Revisa este vehículo.") + "</div>");
                    }
                }
            };
            rpc.exec("consulataVehiculos", data, func);
        }
    }
});