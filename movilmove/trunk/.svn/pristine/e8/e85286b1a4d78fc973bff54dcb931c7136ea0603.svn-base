qx.Class.define("transmovapp.lists.l_preoperacional_new", {
    extend: qxnw.lists,
    construct: function (datos) {
        var self = this;
        this.base(arguments);
        this.buttonsAutomatic = true;
        this.createBase();
        console.log("transmovapp.lists.l_preoperacional_new:::datos", datos);
        self.datos = {};
        if (qxnw.utils.evalueData(datos)) {
            self.datos = datos;
        }
        console.log("transmovapp.lists.l_preoperacional_new:::datos", self.datos);

        qxnw.local.storeData(self.getAppWidgetName() + "_max_show_rows", 20);

        var columns = [
            {
                label: "ID",
                caption: "id"
            },
            {
                label: "Fecha",
                caption: "fecha"
            },
            {
                label: "Marca",
                caption: "marca"
            },
            {
                label: "Modelo",
                caption: "modelo"
            },
            {
                label: "Tipo",
                caption: "tipo"
            },
            {
                label: "Placa",
                caption: "placa"
            },
            {
                label: "Ciudad",
                caption: "ciudad_text"
            },
            {
                label: "Nombre conductor",
                caption: "nombres_conductor"
            },
            {
                label: "Usuario conductor",
                caption: "usuario"
            },
            {
                label: self.tr("Fecha Vencimiento Soat"),
                caption: "fecha_vencimiento_soat",
                colorHeader: "#4d90fe"//azul
            },
            {
                label: self.tr("Póliza contractual fecha vencimiento"),
                caption: "vehiculo_poliza_contractual",
                colorHeader: "#FF8000"
            },
            {
                label: self.tr("Póliza todoriesgo fecha vencimiento"),
                caption: "vehiculo_poliza_todoriesgo",
                colorHeader: "#2fff00"
            },
            {
                label: self.tr("Tecnomecánica fecha vencimiento"),
                caption: "fecha_vencimiento_tegnomecanica",
                colorHeader: "#8bc4ef"
            },
        ];

        self.traerPreguntas(function (data) {
            self.preguntas = data;

            for (var i = 0; i < data.length; i++) {
                var r = data[i];
                if (r.required == "SI") {
                    r.required = true;
                }
                if (r.required == "NO") {
                    r.required = false;
                }
                if (r.visible == "SI") {
                    r.visible = true;
                }
                if (r.visible == "NO") {
                    r.visible = false;
                }
                columns.push(
                        {
                            label: r.label,
                            caption: r.name
                        }
                );
            }

            self.setColumns(columns);

            var filters = [
                {
                    name: "usuario",
                    caption: "usuario",
                    label: "Usuario",
                    type: "selectBox"
                },
                {
                    name: "fecha_inicial",
                    caption: "fecha_inicial",
                    label: "Fecha Inicial",
                    type: "dateTimeField",
                    required: true
                },
                {
                    name: "fecha_final",
                    caption: "fecha_final",
                    label: "Fecha Final",
                    type: "dateTimeField",
                    required: true
                }
            ];
            self.createFilters(filters);
            self.setAllPermissions(true);

            self.ui.deleteButton.addListener("click", function () {
                self.slotEliminar();
            });
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
            self.ui.part1.setVisibility("excluded");
            self.ui.part2.setVisibility("excluded");
            self.execSettings();
            self.hideColumn("id");
            self.maximize();
            self.applyFilters();

            var data = {};
            data[""] = self.tr("Seleccione");
            data["TODOS"] = self.tr("TODOS");
            qxnw.utils.populateSelectFromArray(self.ui.usuario, data);

//        setTimeout(function () {
//            var up = qxnw.userPolicies.getUserData();
//            console.log("up", up);
//            var t = {};
//            t.table = "pv_clientes";
//            t.where = " empresa=" + up.company + " and perfil=2 ";
//            qxnw.utils.populateSelect(self.ui.usuario, "master", "populate", t);
            qxnw.utils.populateSelect(self.ui.usuario, "preoperacional", "getUsuariosPopulate");
            self.ui.usuario.setValue(self.datos.usuario_cliente);
//        }, 2000);
        });
    },
    destruct: function () {
    },
    members: {
        traerPreguntas: function traerPreguntas(callback) {
            var self = this;
            var up = qxnw.userPolicies.getUserData();
            console.log("up", up);
            console.log("up.company", up.company);
            var data = {};
            data.empresa = up.company;
            var rpc = new qxnw.rpc(self.getRpcUrl(), "preoperacional");
            rpc.setAsync(true);
            var func = function (r) {
                console.log("f_preoperacional:::responseServer", r);
                callback(r);
            };
            rpc.exec("getPreopeAdminPreguntas", data, func);
        },
        contextMenu: function contextMenu(pos) {
            var self = this;
            var data = self.selectedRecord();
            var m = new qxnw.contextmenu(this);
            var up = qxnw.userPolicies.getUserData();
            m.addAction(self.tr("Imprimir día"), qxnw.config.execIcon("format-text-direction-rtl"), function (e) {
                self.viewFormat(data);
            });
//            m.addAction(self.tr("Imprimir semana"), qxnw.config.execIcon("format-text-direction-rtl"), function (e) {
//                self.viewFormat(data, true);
//            });
            m.addAction(self.tr("Ver documentos adjuntos"), qxnw.config.execIcon("format-text-direction-rtl"), function (e) {
                self.viewDocuments(data);
            });
            m.exec(pos);
        },
        applyFilters: function applyFilters() {
            var self = this;
            if (!self.validate()) {
                return;
            }
            var up = qxnw.userPolicies.getUserData();
            var data = {};
            data.filters = self.getFiltersData();
            if (qxnw.utils.evalueData(data.filters.usuario)) {
                data.usuario = data.filters.usuario;
            } else {
                data.usuario = self.datos.usuario_cliente;
            }
            data.empresa = up.company;
            data.empresa_o_flota = main.empresa_o_flota;
            data.permisos = main.permisos_usuario;
            console.log("data.filters", data.filters);
            var fil = data.filters;
            if (fil.usuario == "TODOS") {
                if (!qxnw.utils.evalueData(fil.fecha_inicial) || !qxnw.utils.evalueData(fil.fecha_final)) {
                    qxnw.utils.information("Para buscar todos los registros debe seleccionar un rango de fechas");
                    return false;
                }
            }
            console.log("data", data);
            var rpc = new qxnw.rpc(self.getRpcUrl(), "preoperacional", true);
            var func = function (r) {
                console.log("r", r);
                self.setModelData(r);
            };
            rpc.exec("consultaPreopeAdmin", data, func);
        },
        viewDocuments: function viewDocuments(pr) {
            var self = this;
            var d = new transmovapp.lists.l_preoperacional_documentos();
            d.applyFilters(pr);
            d.show();
//            self.addSubWindow("Conductores", d);
        },
        viewFormat: function viewFormat(pr, semana) {
            var self = this;
            var data = pr;
            data.nombre_conductor = self.datos.nombre + self.datos.apellido;
            data.fecha_vencimiento_licencia = self.datos.fecha_vencimiento;
            data.id_conductor = self.datos.id;
            var up = qxnw.userPolicies.getUserData();
            console.log(up)
            var datos = {};
            datos.id = pr.id;
            datos.id_usuario = pr.code;
            console.log(pr);
            var f = new qxnw.forms("Formato pre-operacional");
            f.createPrinterToolBar("Formato pre-operacional", datos, 1);
            if (semana === true) {
                f.addFrame("/app/formato_preoperacional_new.php", true, data);
            } else {
                f.addFrame("/imp/preoperacional_new.php", true, data);
            }
            f.hidePrinterSelect();
            f.show();
            f.maximize();
            f.setModal(true);
        }
    }
});