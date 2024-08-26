qx.Class.define("qxnw.basics.forms.f_menu", {
    extend: qxnw.forms,
    construct: function () {
        var self = this;
        this.base(arguments);
        this.createBase();
        this.setTitle("Administración del menú");
        var fields = [
            {
                name: "id",
                label: "ID",
                caption: "id",
                type: "textField",
                visible: false
            },
            {
                name: "empresa",
                label: self.tr("Empresa"),
                caption: "empresa",
                type: "textField",
                enabled: false
            },
            {
                name: "nombre",
                label: self.tr("Nombre"),
                caption: "nombre",
                type: "textField"
            },
            {
                name: "grupo",
                label: self.tr("Módulo"),
                caption: "grupo",
                type: "selectBox",
                required: true
            },
            {
                name: "modulo",
                label: self.tr("Componente"),
                caption: "modulo",
                type: "selectListCheck",
                required: true
            },
            {
                name: "crear_modulo",
                label: self.tr("Crear componente"),
                caption: "crear_modulo",
                type: "checkBox",
                required: false
            },
            {
                name: "clase",
                label: self.tr("Clase"),
                caption: "clase",
                type: "textField",
                required: false,
                enabled: false
            },
            {
                name: "orden",
                label: self.tr("Orden"),
                caption: "orden",
                type: "selectBox"
            },
            {
                name: "nivel",
                label: self.tr("Nivel"),
                caption: "nivel",
                type: "selectBox"
            },
            {
                name: "nivel_pariente",
                label: self.tr("Nivel padre"),
                caption: "nivel_pariente",
                type: "selectBox"
            },
            {
                name: "pariente",
                label: self.tr("Padre"),
                caption: "pariente",
                type: "selectListCheck",
                required: true
            },
            {
                name: "tipo_icono",
                label: self.tr("Tipo ícono"),
                caption: "tipo_icono",
                type: "selectBox"
            },
            {
                name: "tamano_icono",
                label: self.tr("Tamaño ícono"),
                caption: "tamano_icono",
                type: "selectBox",
                required: true
            },
            {
                name: "icono",
                label: self.tr("Ícono"),
                caption: "icono",
                type: "selectBox",
                required: true
            },
            {
                name: "movil",
                label: self.tr("Móvil"),
                caption: "icono",
                type: "checkBox",
                required: false,
                enabled: false
            },
            {
                name: "orden_movil",
                label: self.tr("Orden móvil"),
                type: "spinner",
                required: false,
                enabled: false
            },
            {
                name: "callback",
                label: "Callback",
                caption: "callback",
                type: "textArea",
                required: true
            }
        ];
        self.setFields(fields);

        self.ui.crear_modulo.addListener("changeValue", function (e) {
            var d = e.getData();
            if (d === true) {
                self.ui.clase.setEnabled(true);
                self.setRequired("modulo", false);
            } else {
                self.ui.clase.setValue("");
                self.ui.clase.setEnabled(false);
                self.setRequired("modulo", true);
            }
        });

        self.ui.callback.addListener("input", function () {
            var v = this.getValue();
            if (v == "createMaster") {
                self.ui.movil.setEnabled(true);
                self.ui.orden_movil.setEnabled(true);
            } else if (v == "") {
                self.ui.movil.setEnabled(false);
                self.ui.orden_movil.setEnabled(false);
            }
        });

        var data = {};
        data[""] = "Seleccione";
        qxnw.utils.populateSelectFromArray(self.ui.tipo_icono, data);
        qxnw.utils.populateSelectFromArray(self.ui.icono, data);
        qxnw.utils.populateSelectFromArray(self.ui.nivel_pariente, data);
        qxnw.utils.populateSelectFromArray(self.ui.nivel, data);

        data = {};
        data["qxnw"] = "QXNW";
        qxnw.utils.populateSelectFromArray(self.ui.tipo_icono, data);
        qxnw.utils.populateSelectFromArray(self.ui.tipo_icono, qxnw.config.getIconsCategories2DArray());

        self.ui.pariente.setMaxItems(1);
        self.ui.modulo.setMaxItems(1);

        data = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20"];
        qxnw.utils.populateSelectFromArray(self.ui.orden, data);

        data = ["16", "22", "32", "48", "64"];
        qxnw.utils.populateSelectFromArray(self.ui.tamano_icono, data);

        data = {};
        data["1"] = "1";
        data["2"] = "2";
        data["3"] = "3";
        data["4"] = "4";
        qxnw.utils.populateSelectFromArray(self.ui.nivel, data);
        qxnw.utils.populateSelectFromArray(self.ui.nivel_pariente, data);

        self.ui.nivel.addListener("changeSelection", function () {
            var d = this.getValue();
            if (d["nivel"] == 1) {
                self.ui.nivel_pariente.setEnabled(false);
                self.ui.pariente.setEnabled(false);
                self.ui.nivel_pariente.setValue("");
                self.ui.pariente.deselectAllItems();
            } else {
                self.ui.nivel_pariente.setEnabled(true);
                self.ui.pariente.setEnabled(true);
            }
        });

        data = {};
        data["0"] = "Ninguno";
        qxnw.utils.populateSelectFromArray(self.ui.pariente, data);
        qxnw.utils.populateSelectFromArray(self.ui.grupo, data);

        data = {};
        data["General"] = "Generales";
        qxnw.utils.populateSelectFromArray(self.ui.grupo, data);

//        qxnw.utils.populateSelectAsync(self.ui.grupo, "master", "populate", {table: "nw_modulos_grupos"});

        self.ui.nivel_pariente.addListener("changeSelection", function () {
            self.populateParents(self.getRecord());
        });

        self.ui.tipo_icono.addListener("changeSelection", function () {
            self.populateIconsByType(this.getValue());
        });

        self.ui.grupo.addListener("changeSelection", function () {
            self.ui.modulo.removeAll();
            var data = {};
            data["grupo"] = this.getValue().grupo;
            data["empresa"] = self.ui.empresa.getValue();
            self.ui.modulo.populate("nw_modulos", "getModulesByGroup", data);
        });

        self.ui.accept.addListener("execute", function () {
            self.slotSave();
        });
        self.ui.cancel.addListener("execute", function () {
            self.reject();
        });
    },
    destruct: function () {
    },
    members: {
        pr: null,
        populateIconsByType: function populateIconsByType(d) {
            var self = this;
            self.ui.icono.removeAll();
            var ti = self.ui.tamano_icono.getValue();
            var data = {};
            var prefix = "";
            if (qx.core.Environment.get("qx.debug")) {
                prefix = "/source";
            }
            if (d["tipo_icono"] == "qxnw") {
                data["ubicacion"] = prefix + "/resource/qxnw/icon/" + ti.tamano_icono_text + "/";
            } else {
                data["ubicacion"] = prefix + "/resource/qx/icon/Tango/" + ti.tamano_icono_text + "/" + d["tipo_icono"];
            }
            var rpc = new qxnw.rpc(self.getRpcUrl(), "nw_menu", true);
            var func = function (r) {
                var item;
                var mod;
                var v = new Array();
                for (v in r) {
                    mod = v;
                    item = r[v];
                    var selectItem = new qxnw.widgets.listItem(qxnw.utils.ucfirst(item.replace(".png", "")),
                            data["ubicacion"] + "/" + mod);
                    var model = mod;
                    if (d["tipo_icono"] == "qxnw") {
                        selectItem.setModel(d["tipo_icono"] + "/" + ti.tamano_icono_text + "/" + model);
                    } else {
                        selectItem.setModel("/" + d["tipo_icono"] + "/" + model);
                    }
                    self.ui.icono.add(selectItem);
                }
            };
            rpc.exec("getSystemIcons", data, func);
        },
        populateParents: function populateParents(data) {
            if (data["nivel_pariente"] == "") {
                return;
            }
            this.ui.pariente.removeAll();
            var d = {};
            d[""] = "Seleccione";
            qxnw.utils.populateSelectFromArray(this.ui.tipo_icono, d);
            this.ui.pariente.populate("nw_menu", "populateParentsByLevel", data);
        },
        slotSave: function slotSave() {
            var self = this;
            var data = self.getRecord();
            var rpc = new qxnw.rpc(self.getRpcUrl(), "nw_menu", true);
            var func = function () {
                self.accept();
            };
            rpc.exec("save", data, func);
        },
        setParamRecord: function setParamRecord(pr) {
            this.setRecord(pr);
            if (pr.pariente != 0) {
                var token = {};
                token["id"] = pr.pariente;
                token["nombre"] = pr.nom_pariente;
                this.ui.pariente.addToken(token);
            }
            if (pr.modulo != 0) {
                var token = {};
                token["id"] = pr.modulo;
                token["nombre"] = pr.nom_modulo;
                this.ui.modulo.addToken(token);
            }
            if (pr.icono != "") {
                try {
                    var d = pr.icono.split("/");
                    if (typeof d[2] != 'undefined' && d[0] != "qxnw") {
                        this.ui.tipo_icono.setValue(d[1]);
                        this.ui.icono.setValue(pr.icono);
                    } else {
                        this.ui.tipo_icono.setValue(d[0]);
                        this.ui.icono.setValue(pr.icono);
                    }
                } catch (e) {
                    qxnw.utils.nwconsole(e);
                }
            }
            return true;
        }
    }
});
