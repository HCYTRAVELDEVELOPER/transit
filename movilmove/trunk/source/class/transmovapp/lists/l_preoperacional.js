qx.Class.define("transmovapp.lists.l_preoperacional", {
    extend: qxnw.lists,
    construct: function (datos) {
        var self = this;
        this.base(arguments);
        this.buttonsAutomatic = true;
        this.createBase();
        console.log("transmovapp.lists.l_preoperacional:::datos", datos);
        self.datos = {};
        if (qxnw.utils.evalueData(datos)) {
            self.datos = datos;
        }
        console.log("transmovapp.lists.l_preoperacional:::datos", self.datos);

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
            {
                label: "Presión",
                caption: "presion"
            },
            {
                label: "Labrado",
                caption: "labrado"
            },
            {
                label: "Tuercas completas y aseguradas",
                caption: "tuercas_completas_aseguradas"
            },
            {
                label: "Freno de parqueo funciona",
                caption: "freno_parqueo_funciona"
            },
            {
                label: "Frenos funcionando",
                caption: "frenos_funcionando"
            },
            {
                label: "Líquido de frenos dentro de los límites",
                caption: "liquido_frenos_dentro_limites"
            },
            {
                label: "Enciende la luz de reversa",
                caption: "enciende_luz_reversa"
            },
            {
                label: "Encienden luces bajas",
                caption: "encienden_luces_bajas"
            },
            {
                label: "Encienden cocuyos",
                caption: "encienden_cocuyos"
            },
            {
                label: "Encienden luces de freno",
                caption: "encienden_luces_freno"
            },
            {
                label: "Encienden direccionales (adelante y atrás)",
                caption: "encienden_direccionales_atras_delante"
            },
            {
                label: "Nivel de combustible",
                caption: "nivel_combustible"
            },
            {
                label: "Indicador de presión de aceite",
                caption: "indicador_presion_aceite"
            },
            {
                label: "Indicador nivel de batería",
                caption: "indicador_nivel_bateria"
            },
            {
                label: "Espejos retrovisores funcionando",
                caption: "espejos_retrovisores_funcionando"
            },
            {
                label: "Todas las puertas cierran y ajustan",
                caption: "todas_puertas_cierran_ajustan"
            },
            {
                label: "Nivel de aceite del motor",
                caption: "nivel_aceite_motor"
            },
            {
                label: "Nivel del líquido de la dirección",
                caption: "nivel_liquido_direccion"
            },
            {
                label: "Nivel del líquido refrigerante",
                caption: "nivel_liquido_refrigerante"
            },
            {
                label: "Nivel del agua del limpiabrisas",
                caption: "nivel_agua_limpiabrisas"
            },
            {
                label: "Pito",
                caption: "pito"
            },
            {
                label: "Limpiabrisas funcionando",
                caption: "limpiabrisas_funcionando"
            },
            {
                label: "Radiador con tapa ajustada",
                caption: "radiador_tapa_ajustada"
            },
            {
                label: "Correa del ventilador tensionada",
                caption: "correa_ventilador_tensionada"
            },
            {
                label: "Batería sin residuos",
                caption: "bateria_sin_residuos"
            },
            {
                label: "Ajuste horizontal sillas delanteras",
                caption: "ajuste_horizontal_sillas_delanteras"
            },
            {
                label: "Ajuste vertical sillas delanteras",
                caption: "ajuste_vertical_sillas_delanteras"
            },
            {
                label: "Tapizado sin roturas o manchas",
                caption: "tapizado_roturas_manchas"
            },
            {
                label: "Firma del Conductor que hace la Inspección",
                caption: "firma_fonductor_inspeccion",
                type: "image",
                mode: "phpthumb"
            },
            {
                label: "Observaciones",
                caption: "observaciones"
            }
        ];
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

    },
    destruct: function () {
    },
    members: {
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
            rpc.exec("consultaPreoperacional", data, func);
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
                f.addFrame("/app/formato_preoperacional.php", true, data);
            } else {
                f.addFrame("/imp/preoperacional.php", true, data);
            }
            f.hidePrinterSelect();
            f.show();
            f.maximize();
            f.setModal(true);
        }
    }
});
