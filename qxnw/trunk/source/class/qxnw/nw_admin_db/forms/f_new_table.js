qx.Class.define("qxnw.nw_admin_db.forms.f_new_table", {
    extend: qxnw.forms,
    construct: function () {
        var self = this;
        this.base(arguments);
        this.setColumnsFormNumber(0);
        this.createBase();
        this.setTitle("Nueva Tabla");
        var text = "<h3>Nueva / Editar Table</h3>";
        self.addHeaderNote(text);
        self.orden_cargue = {};
        self.setGroupHeader("Nueva /Editar Tabla");
        var fields = [
            {
                name: "Tabla",
                type: "startGroup",
                icon: qxnw.config.execIcon("bookmark-new", "actions"),
                mode: "horizontal"
            },
            {
                name: "table_name",
                label: self.tr("<strong>Nombre</strong>"),
                type: "textField",
                required: true
            },
            {
                name: "owner",
                label: self.tr("<strong>Owner</strong>"),
                type: "selectBox"
            },
            {
                name: "descripcion",
                label: self.tr("<strong>Descripcion</strong>"),
                type: "checkBox"
            },
            {
                name: "menus",
                label: self.tr("<strong>Menú</strong>"),
                type: "checkBox"
            }];
        self.setFields(fields);
        self.navTable = new qxnw.navtable(self);
        self.navTable.setContextMenu("contextMenu");
        self.navTable.createBase();
        var columns = [
            {
                label: self.tr("Nombre Campo"),
                caption: "field_name"
            },
            {
                label: self.tr("Tipo Campo"),
                caption: "field_type"
            },
            {
                label: self.tr("Tamaño"),
                caption: "size"
            },
            {
                label: self.tr("Número de dimensión de arrays"),
                caption: "number_array"
            },
            {
                label: self.tr("Posición"),
                caption: "ordinal_position"
            },
            {
                label: self.tr("Llave"),
                caption: "primary_key",
                type: "checkbox",
                mode: "editable"
            },
            {
                label: self.tr("Unico"),
                caption: "unique",
                type: "checkbox",
                mode: "editable"
            },
            {
                label: self.tr("No nulo"),
                caption: "not_null",
                type: "checkbox",
                mode: "editable"

            },
            {
                label: self.tr("Default"),
                caption: "default"
            },
            {
                label: self.tr("Descripción"),
                caption: "descripcion"
            }];
        self.navTable.setColumns(columns);
        self.insertNavTable(self.navTable.getBase(), self.tr("Campos"));
        var agregarButton = self.navTable.getAddButton();
        self.deleteButton = self.navTable.getRemoveButton();
        self.deleteButton.addListener("click", function () {
            self.navTable.removeSelectedRow();
        });
        self.description = new qxnw.nw_admin_db.forms.f_description_table();
        self.insertNavTable(self.description, self.tr("Descripción Tabla"));
        self.slotMenu();
        agregarButton.addListener("click", function () {
            var d = new qxnw.nw_admin_db.forms.f_field();
            d.setParamRecord();
            d.show();
            d.setModal(true);
            d.settings.accept = function () {
                var r = d.getRecord();
                if (r.not_null == "true") {
                    r.not_null = "t";
                } else {
                    r.not_null = "f";
                }
                if (r.unique == "true") {
                    r.unique = "t";
                } else {
                    r.unique = "f";
                }
                if (r.primary_key == "true") {
                    r.primary_key = "t";
                } else {
                    r.primary_key = "f";
                }
                self.navTable.addRows([r]);
            };
        });
        self.ui.accept.addListener("execute", function () {
            self.slotSave();
        });
        self.ui.cancel.addListener("execute", function () {
            self.reject();
        });


    },
    members: {pr: null,
        box1: null,
        deleteButton: null,
        navTable: null,
        texto: null,
        slotMenu: function slotMenu() {
            var self = this;
            self.menu = new qxnw.forms();
            var field = [
                {
                    name: "Componente / Menú",
                    type: "startGroup",
                    icon: "",
                    mode: "horizontal"
                },
                {
                    name: "nombre_class",
                    label: self.tr("<strong>Nombre Componente</strong>"),
                    type: "textField"
                },
                {
                    name: "grupo",
                    label: self.tr("<strong>Grupo</strong>"),
                    type: "selectBox"
                },
                {
                    name: "icon",
                    label: self.tr("<strong>Icono Componente</strong>"),
                    type: "uploader"
                },
                {
                    name: "nombre",
                    label: self.tr("<strong>Nombre Menú</strong>"),
                    type: "textField"
                },
                {
                    name: "orden",
                    label: self.tr("<strong>Orden</strong>"),
                    type: "selectBox"
                },
                {
                    name: "",
                    type: "endGroup",
                    icon: ""
                },
                {
                    name: "Nivel",
                    type: "startGroup",
                    icon: "",
                    mode: "horizontal"
                },
                {
                    name: "nivel",
                    label: self.tr("<strong>Nivel</strong>"),
                    type: "selectBox"
                },
                {
                    name: "nivel_pariente",
                    label: self.tr("<strong>Nivel Padre</strong>"),
                    type: "selectBox"
                },
                {
                    name: "pariente",
                    label: self.tr("<strong>Padre</strong>"),
                    type: "selectListCheck"
                },
                {
                    name: "tipo_icono",
                    label: self.tr("<strong>Tipo Icono</strong>"),
                    type: "selectBox"
                },
                {
                    name: "tamano_icono",
                    label: self.tr("<strong>Tamaño Icono</strong>"),
                    type: "selectBox"
                },
                {
                    name: "icono",
                    label: self.tr("<strong>Icono</strong>"),
                    type: "selectBox"
                },
                {
                    name: "",
                    type: "endGroup",
                    icon: ""
                },
                {
                    name: "Permisos",
                    type: "startGroup",
                    icon: "",
                    mode: "horizontal"
                },
                {
                    name: "perfil",
                    label: self.tr("<strong>Perfil</strong>"),
                    type: "selectBox"
                },
                {
                    name: "todos",
                    label: self.tr("<strong>Todos</strong>"),
                    type: "checkBox"
                },
                {
                    name: "crear",
                    label: self.tr("<strong>Crear</strong>"),
                    type: "checkBox"
                },
                {
                    name: "consultar",
                    label: self.tr("<strong>Consultar</strong>"),
                    type: "checkBox"
                },
                {
                    name: "editar",
                    label: self.tr("<strong>Editar</strong>"),
                    type: "checkBox"
                },
                {
                    name: "eliminar",
                    label: self.tr("<strong>Elimnar</strong>"),
                    type: "checkBox"
                },
                {
                    name: "imprimir",
                    label: self.tr("<strong>Imprimir</strong>"),
                    type: "checkBox"
                },
                {
                    name: "enviar_correo",
                    label: self.tr("<strong>Enviar por Correo</strong>"),
                    type: "checkBox"
                },
                {
                    name: "exportar",
                    label: self.tr("<strong>Exportar</strong>"),
                    type: "checkBox"
                },
                {
                    name: "importar",
                    label: self.tr("<strong>Importar</strong>"),
                    type: "checkBox"
                },
                {
                    name: "terminal",
                    label: self.tr("<strong>Terminal</strong>"),
                    type: "checkBox"
                },
                {
                    name: "columnas_ocultas",
                    label: self.tr("<strong>Ocultar Columnas</strong>"),
                    type: "checkBox"
                },
                {
                    name: "",
                    type: "endGroup",
                    icon: ""
                }
            ];
            self.menu.setFields(field);
            self.menu.ui.accept.hide();
            self.menu.ui.cancel.hide();
            self.insertWidget(self.menu, "Menú");
            var data = {};
            data[""] = "Seleccione";
            qxnw.utils.populateSelectFromArray(self.menu.ui.tipo_icono, data);
            qxnw.utils.populateSelectFromArray(self.menu.ui.icono, data);
            qxnw.utils.populateSelectFromArray(self.menu.ui.nivel_pariente, data);
            qxnw.utils.populateSelectFromArray(self.menu.ui.nivel, data);
            qxnw.utils.populateSelectFromArray(self.menu.ui.perfil, data);

            data = {};
            data["qxnw"] = "QXNW";
            qxnw.utils.populateSelectFromArray(self.menu.ui.tipo_icono, data);
            qxnw.utils.populateSelectFromArray(self.menu.ui.tipo_icono, qxnw.config.getIconsCategories2DArray());
            data = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20"];
            qxnw.utils.populateSelectFromArray(self.menu.ui.orden, data);

            data = ["16", "22", "32", "48", "64"];
            qxnw.utils.populateSelectFromArray(self.menu.ui.tamano_icono, data);
            data = {};
            data["1"] = "1";
            data["2"] = "2";
            data["3"] = "3";
            data["4"] = "4";
            qxnw.utils.populateSelectFromArray(self.menu.ui.nivel, data);
            qxnw.utils.populateSelectFromArray(self.menu.ui.nivel_pariente, data);
            data = {};
            data["0"] = "Ninguno";
            qxnw.utils.populateSelectFromArray(self.menu.ui.pariente, data);
            qxnw.utils.populateSelectFromArray(self.menu.ui.grupo, data);

            data = {};
            data["General"] = "Generales";
            self.menu.ui.nivel_pariente.addListener("changeSelection", function () {
                self.populateParents(this.getValue());
            });
            self.menu.ui.pariente.setMaxItems(1);
            self.menu.ui.nivel.addListener("changeSelection", function () {
                var d = this.getValue();
                if (d["nivel"] == 1) {
                    self.menu.ui.nivel_pariente.setEnabled(false);
                    self.menu.ui.pariente.setEnabled(false);
                    self.menu.ui.nivel_pariente.setValue("");
                    self.menu.ui.pariente.deselectAllItems();
                } else {
                    self.menu.ui.nivel_pariente.setEnabled(true);
                    self.menu.ui.pariente.setEnabled(true);
                }
            });
            self.menu.ui.todos.addListener("click", function () {
                if (this.getValue() == "true") {

                }
            });
            self.menu.ui.tipo_icono.addListener("changeSelection", function () {
                self.populateIconsByType(this.getValue());
            });
            qxnw.utils.populateSelectFromArray(self.menu.ui.grupo, data);
            qxnw.utils.populateSelectAsync(self.menu.ui.grupo, "master", "populate", {table: "nw_modulos_grupos"});
            qxnw.utils.populateSelectAsync(self.menu.ui.perfil, "master", "populate", {table: "perfiles"});
            self.menu.ui.nivel_pariente.addListener("changeSelection", function () {
                self.populateParents(this.getValue());
            });
            self.menu.ui.pariente.setMaxItems(1);
            self.menu.ui.nivel.addListener("changeSelection", function () {
                var d = this.getValue();
                if (d["nivel"] == 1) {
                    self.menu.ui.nivel_pariente.setEnabled(false);
                    self.menu.ui.pariente.setEnabled(false);
                    self.menu.ui.nivel_pariente.setValue("");
                    self.menu.ui.pariente.deselectAllItems();
                } else {
                    self.menu.ui.nivel_pariente.setEnabled(true);
                    self.menu.ui.pariente.setEnabled(true);
                }
            });
            self.menu.ui.todos.addListener("click", function () {
                if (this.getValue() == "true") {

                }
            });
            self.menu.ui.tipo_icono.addListener("changeSelection", function () {
                self.populateIconsByType(this.getValue());
            });
        },
        populateIconsByType: function populateIconsByType(d) {
            var self = this;
            self.menu.ui.icono.removeAll();
            var ti = self.menu.ui.tamano_icono.getValue();
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
                    self.menu.ui.icono.add(selectItem);
                }
            };
            rpc.exec("getSystemIcons", data, func);
        },
        populateParents: function populateParents(data) {
            var self = this;
            if (data["nivel_pariente"] == "") {
                return;
            }
            self.menu.ui.pariente.removeAll();
            var d = {};
            d[""] = "Seleccione";
            qxnw.utils.populateSelectFromArray(self.menu.ui.tipo_icono, d);
            self.menu.ui.pariente.populate("nw_menu", "populateParentsByLevel", data);
        },
        slotSave: function slotSave() {
            var self = this;
            var data = this.getRecord();
            var ss = self.description.getRecord();
            data.fields = self.navTable.getAllData();
            data.cleanhtml = ss.cleanhtml;
            data.unique_fields = ss.unique_fields;
            ss.description_navTable = self.description.navTable_table.getAllData();
            ss.description_selectBox = self.description.navTable_selectBox.getAllData();
            ss.description_contex = self.description.navTable_contex.getAllData();
            var descripcion = qxnw.nw_admin_db.functions.processDescriptionsTables(ss);
            data.menu = self.menu.getRecord();
            data.des = descripcion;
            data.model = self.model;
            if (!self.validate()) {
                return;
            }
            if (data.fields.length == "0") {
                qxnw.utils.information("Debe agregar por lo menos un campo para crear la tabla");
                return;
            }
            var rpc = new qxnw.rpc(self.getRpcUrl(), "nw_admin_table_init");
            rpc.setAsync(true);
            var func = function (r) {
                var funcs = function (s) {
                    if (s == "t") {
                        var d = new qxnw.forms();
                        var fields = [
                            {
                                name: "view",
                                label: "DDL",
                                type: "ckeditor",
                                mode: "cero"
                            }
                        ];
                        d.setFields(fields);
                        d.ui.cancel.hide();
                        d.show();
                        d.setModal(true);
                        d.ui.view.setValue(r);
                        d.ui.accept.addListener("execute", function () {
                            d.accept();
                            self.accept();
                        });
                    }
                };
                qxnw.utils.fastRpcAsyncCall("nw_admin_tables", "viewCompilate", data, funcs);
            };
            rpc.exec("createTable", data, func);
        }
    }
});