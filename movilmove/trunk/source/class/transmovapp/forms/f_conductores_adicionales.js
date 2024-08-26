qx.Class.define("transmovapp.forms.f_conductores_adicionales", {
    extend: qxnw.forms,
    construct: function () {
        var self = this;
        this.base(arguments);
        this.createBase();
        self.setTitle(self.tr("Conductores de viaje"));
        var html = "<div class='div_title'>Agrega los conductores de viaje y el vehículo.</div>";
//        html += "<div class='div_title_rojo'>¡Recuerda! El primer conductor de la lista queda como conductor principal del viaje.</div>";
        self.addHeaderNote(html);
        self.__conf = main.getConfiguracion();

        self.addConductorPrincipal = false;

        var fields = [
            {
                name: "Conductor principal y vehículo principal",
                type: "startGroup",
                mode: "horizontal"
            },
            {
                name: "conductor_principal",
                label: self.tr("Conductor principal"),
                type: "selectTokenField",
                required: true
            },
            {
                name: "vehiculo",
                label: self.tr("Vehículo principal (busca por placa)"),
                type: "selectTokenField",
                required: false
            },
            {
                type: "endGroup"
            },
            {
                name: "Conductor adicional",
                type: "startGroup",
                mode: "horizontal"
            },
            {
                name: "conductor",
                label: self.tr("Conductor adicional (buscar por nombre, documento, celular"),
                type: "selectTokenField"
//                ,
//                required: true
            },
            {
                name: "add_conductor",
                label: self.tr("Agregar conductor"),
                type: "button"
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

        self.createNavTable();

        self.ui.conductor.addListener("loadData", function (e) {
            var data = {};
            data.token = e.getData();
            var rpc = new qxnw.rpc(self.getRpcUrl(), "servicios_admin");
            rpc.setAsync(true);
            var func = function (r) {
                self.ui.conductor.setModelData(r);
            };
            rpc.exec("populateTokenConductores", data, func);
        }, this);

        self.ui.conductor_principal.addListener("loadData", function (e) {
            var data = {};
            data.token = e.getData();
            var rpc = new qxnw.rpc(self.getRpcUrl(), "servicios_admin");
            rpc.setAsync(true);
            var func = function (r) {
                self.ui.conductor_principal.setModelData(r);
            };
            rpc.exec("populateTokenConductores", data, func);
        }, this);

        self.ui.conductor_principal.addListener("addItem", function (e) {
            var item = self.ui.conductor_principal.getValue();
//            var item = self.getRecord();
            console.log("item", item);
//            self.agregarNav(item);

            if (qxnw.utils.evalueData(item[0].placa_activa)) {
                var up = qxnw.userPolicies.getUserData();
                var data = {};
                data.placa = item[0].placa_activa;
                data.empresa = up.company;
                console.log("data", data);
                var rpc = new qxnw.rpc(self.getRpcUrl(), "servicios_admin");
                rpc.setAsync(true);
                var func = function (r) {
                    console.log("r", r);
                    if (qxnw.utils.evalueData(r)) {
                        var con = {
                            id: r.id,
                            vehiculo_text: r.marca_text,
                            placa: r.placa
                        };
                        self.slotVehiculoPrincipal(con);
                    }
                };
                rpc.exec("traeVehiculoPorPlaca", data, func);
            }

        }, this);

        self.ui.add_conductor.addListener("execute", function () {
            var item = self.getRecord();
            console.log("item", item);
            if (!qxnw.utils.evalueData(item.conductor)) {
                return false;
            }
            self.agregarNav(item);
        });


        self.ui.vehiculo.addListener("loadData", function (e) {
            var data = {};
            data.token = e.getData();
            var rpc = new qxnw.rpc(self.getRpcUrl(), "servicios_admin");
            rpc.setAsync(true);
            var func = function (r) {
                self.ui.vehiculo.setModelData(r);
            };
            rpc.exec("populateTokenVehiculosNormal", data, func);
        }, this);

//        self.ui.vehiculo.addListener("addItem", function () {
//            var item = self.getRecord();
//            console.log("item", item);
//            self.agregarNav(item);
//        }, this);

        self.ui.conductor_principal.focus();

    },
    destruct: function () {
    },
    members: {
        navTable: null,
        agregarNav: function agregarNav(item) {
            var self = this;
            console.log("item", item);
            var data = {
                id: item.conductor_array.id,
                nombre: item.conductor_array.nombre_completo,
                vigencia: item.conductor_array.fecha_vencimiento,
                usuario: item.conductor_array.usuario_principal,
                usuario_principal: item.conductor_array.usuario_principal,
                cedula: item.conductor_array.nit,
                licencia: item.conductor_array.no_licencia
            };
            self.navTable.addRows([data]);

            if (!self.addConductorPrincipal && !qxnw.utils.evalueData(item.conductor_principal)) {
                self.slotConductorPrincipal(data);
            }

//            if (qxnw.utils.evalueData(item.placa_activa)) {
//                var con = {
//                    id: item.placa_activa,
//                    vehiculo_text: item.placa_activa,
//                    placa: item.placa_activa
//                };
//                self.slotVehiculoPrincipal(con);
//            }

        },
        slotConductorPrincipal: function slotConductorPrincipal(data) {
            var self = this;
            var con = {
                id: data.id,
                usuario_principal: data.usuario_principal,
                nombre: data.nombre
            };
            self.ui.conductor_principal.addToken(con);
            self.addConductorPrincipal = true;
        },
        slotVehiculoPrincipal: function slotVehiculoPrincipal(data) {
            var self = this;
            var con = {
                id: data.id,
                nombre: data.placa,
                vehiculo_text: data.nombre,
                placa: data.placa
            };
            self.ui.vehiculo.addToken(con);
            self.addVehiculoPrincipal = true;
        },
        slotSave: function slotSave() {
            var self = this;
            if (!self.validate()) {
                return false;
            }
            var nav = self.navTable.getAllData();
            var data = self.getRecord();
            data.id_servicio = self.data_service.id;
            data.detalle = nav;
            console.log("self.data_service", self.data_service);
            if (qxnw.utils.evalueData(self.data_service.usuario)) {
                data.usuario_pasajero = self.data_service.usuario;
            }
//            if (t == 0) {
//                qxnw.utils.information("Debe agregar mínimo un conductor para continuar.");
//                return false;
//            }
            var otros_conductores = [];
            for (var i = 0; i < nav.length; i++) {
                otros_conductores.push(nav[i].id);
            }
            console.log("otros_conductores", otros_conductores);
//            data.otros_conductores = JSON.stringify(otros_conductores);
            data.otros_conductores = otros_conductores;
            console.log("f_conductores_adicionales:::self.data_service", self.data_service);
            console.log("f_conductores_adicionales:::sendData", data);
            var rpc = new qxnw.rpc(this.rpcUrl, "servicios_admin");
            rpc.setAsync(true);
            var func = function (r) {
                console.log("f_conductores_adicionales:::responseServer", r);
                self.accept();

                var title_conductor = "Conductor(a), tienes un servicio asignado";
                var body_conductor = "¡Conductor(a)!, tienes un servicio asignado, revisa tu agenda";
                for (var i = 0; i < r.tokens_conductores.length; i++) {
                    var re = r.tokens_conductores[i];
                    main.sendNotificacion({
                        title: title_conductor,
                        body: body_conductor,
                        icon: "fcm_push_icon",
                        sound: "default",
                        data: "main.newServiceRutaCliente()",
                        callback: "FCM_PLUGIN_ACTIVITY",
                        to: re.json
                    });
                }

                var title_conductor = "Hola! se ha asignado un conductor";
                var body_conductor = "Se ha asignado un conductor a tu viaje #" + self.data_service.id + ", revisa tu agenda";
                console.log("data.conductor_principal_array", data.conductor_principal_text);
                console.log("data.conductor_principal_array", data.conductor_principal_array);
                console.log("data.conductor_principal_array.nombre_completo", data.conductor_principal_array.nombre_completo);
                if (qxnw.utils.evalueData(data.conductor_principal_text)) {
                    body_conductor += ", conductor " + data.conductor_principal_text;
                }
                if (qxnw.utils.evalueData(data.vehiculo_text)) {
                    body_conductor += ", placa " + data.vehiculo_text;
                }
                body_conductor += ", revisa tu agenda";
                for (var i = 0; i < r.tokens_pasajeros.length; i++) {
                    var re = r.tokens_pasajeros[i];
                    main.sendNotificacion({
                        title: title_conductor,
                        body: body_conductor,
                        icon: "fcm_push_icon",
                        sound: "default",
                        data: "main.newServiceRutaCliente()",
                        callback: "FCM_PLUGIN_ACTIVITY",
                        to: re.json
                    });
                }


                main.registerServiceInFirebase(self.data_service.id);
            };
            rpc.exec("guardaOtrosConductores", data, func);
        },
        setParamRecord: function setParamRecord(pr) {
            var self = this;
            console.log("setParamRecord:::pr", pr);
            self.data_service = pr;
            self.applyFilters();
            return true;
        },
        applyFilters: function applyFilters() {
            var self = this;
            if (!qxnw.utils.evalueData(self.data_service.otros_conductores)) {
                return false;
            }
            var rpc = new qxnw.rpc(self.getRpcUrl(), "servicios_admin");
            var r = rpc.exec("consultaOtrosConductores", self.data_service);
            console.log("applyFilters:::r", r);
            if (rpc.isError()) {
                qxnw.utils.error(rpc.getError());
                return;
            }
            self.navTable.setModelData(r);
            return true;
        },
        createNavTable: function createNavTable() {
            var self = this;
            self.navTable = new qxnw.navtable(self);
            var columns = [
                {
                    caption: "id",
                    label: self.tr("id")
                },
                {
                    caption: "nombre",
                    label: self.tr("Nombre")
                },
                {
                    caption: "cedula",
                    label: self.tr("Número cédula")
                },
                {
                    caption: "usuario",
                    label: self.tr("Usuario")
                },
                {
                    caption: "licencia",
                    label: self.tr("Número licencia")
                },
                {
                    caption: "vigencia",
                    label: self.tr("Vigencia")
                }
            ];
            self.navTable.setColumns(columns);
            self.insertNavTable(self.navTable.getBase(), self.tr("Conductores de viaje"));
//            self.__addButon = self.navTable.getAddButton();
//            self.navTable.setContextMenu("contextTrayecto");
            self._removeButton = self.navTable.getRemoveButton();
            self._removeButton.addListener("execute", function () {
                var f = self.navTable.selectedRecord();
                if (f == undefined || f == null) {
                    qxnw.utils.information(self.tr("Seleccione un registro para eliminar"));
                    return;
                }
                self.navTable.removeSelectedRow();
            });
        }
    }
});
