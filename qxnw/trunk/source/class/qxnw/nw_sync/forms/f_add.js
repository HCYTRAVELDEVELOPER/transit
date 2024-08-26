/* ************************************************************************
 
 Copyright:
 2015 Grupo NW S.A.S, http://www.gruponw.com
 
 License:
 LGPL: http://www.gnu.org/licenses/lgpl.html
 EPL: http://www.eclipse.org/org/documents/epl-v10.php
 See the LICENSE file in the project's top-level directory for details.
 
 Authors:
 * Andrés Flórez (andresf)
 * 
 * Class to test on andresf projects
 
 ************************************************************************ */

qx.Class.define("qxnw.nw_sync.forms.f_add", {
    extend: qxnw.forms,
    construct: function () {
        var self = this;
        this.base(arguments);
        self.setTitle(self.tr("Agregar tabla :: QXNW"));
        self.startInterface();
        self.populateTables();
        self.createDeffectButtons();
        self.ui.accept.addListener("execute", function () {
            self.save();
        });
        self.ui.cancel.addListener("execute", function () {
            self.reject();
        });
    },
    members: {
        enc: null,
        table: null,
        data_tabla: null,
        startInterface: function startInterface() {
            var self = this;
            var container = new qx.ui.splitpane.Pane("horizontal").set({
                padding: 0
            });
            self.upContainer = container;
            self.masterContainer.add(container, {
                flex: 1
            });
            var subContainer = new qx.ui.container.Composite(new qx.ui.layout.VBox()).set({
                minWidth: 300
            });
            container.add(subContainer, 1);
            var containerTables = new qx.ui.container.Composite(new qx.ui.layout.VBox());
            var lbla = new qx.ui.basic.Label(self.tr("<b>Tablas disponibles:</b>")).set({
                rich: true
            });
            containerTables.add(lbla);
            var tablasList = new qxnw.widgets.list();
            tablasList.addListener("contextmenu", function (e) {
                try {
                    var target = e.getTarget();
                    this.setSelection([target]);
                } catch (e) {
                    console.log(e);
                }
            });
            self.tablasList = tablasList;
            tablasList.setDraggable(false);
            tablasList.setSelectionMode("single");
            tablasList.setDroppable(false);
            containerTables.add(tablasList, {
                flex: 1
            });
            subContainer.add(containerTables, {
                flex: 1
            });
            var containercamposDisponibles = new qx.ui.container.Composite(new qx.ui.layout.VBox());
            container.add(containercamposDisponibles, 1);
            self.box1 = new qx.ui.groupbox.GroupBox("Datos tabla", "icon/16/apps/utilities-text-editor.png");
            self.box1.setLayout(new qx.ui.layout.HBox());
            self.box2 = new qx.ui.groupbox.GroupBox("Datos tabla", "icon/16/apps/utilities-text-editor.png");
            self.box2.setLayout(new qx.ui.layout.HBox());
            self.datos = [
                {
                    name: "tipo",
                    label: self.tr("Tipo"),
                    type: "selectBox",
                    required: true
                },
                {
                    name: "nivel",
                    label: self.tr("Nivel"),
                    type: "selectBox",
                    required: true
                },
                {
                    name: "nivel_pariente",
                    label: self.tr("Nivel Pariente"),
                    type: "selectBox",
                    required: true
                },
                {
                    name: "tabla_a_conectar",
                    label: self.tr("Pariente"),
                    type: "selectBox",
                    required: true
                }];
            self.datos2 = [
                {
                    name: "camposDisponibles",
                    label: self.tr("Campo Tabla Origen"),
                    type: "selectBox",
                    required: true
                },

                {
                    name: "campos_tabla_destino",
                    label: self.tr("Campo Tabla Destino"),
                    type: "selectBox",
                    required: true
                },
                {
                    name: "orden",
                    label: self.tr("Orden"),
                    type: "textField",
                    required: true
                },
                {
                    name: "validacion",
                    label: self.tr("Validacion"),
                    type: "selectBox",
                    required: true
                }, {
                    name: "campo_validar",
                    label: self.tr("Campo a Validar"),
                    type: "selectBox",
                    required: true
                }];
            self.addFieldsByContainer(self.datos, self.box1);
            self.addFieldsByContainer(self.datos2, self.box2);
            containercamposDisponibles.add(self.box1);
            containercamposDisponibles.add(self.box2);
            var d = {};
            d["ENVIAR"] = self.tr("Enviar");
            d["RECIBIR"] = self.tr("Recibir");
            qxnw.utils.populateSelectFromArray(self.ui.tipo, d);
            var d = {};
            d["1"] = self.tr("1");
            d["2"] = self.tr("2");
            d["3"] = self.tr("3");
            d["4"] = self.tr("4");
            d["5"] = self.tr("5");
            d["6"] = self.tr("6");
            d["7"] = self.tr("7");
            d["8"] = self.tr("8");
            d["9"] = self.tr("9");
            d["10"] = self.tr("10");
            qxnw.utils.populateSelectFromArray(self.ui.nivel, d);
            qxnw.utils.populateSelectFromArray(self.ui.nivel_pariente, d);
            //qxnw.utils.populateSelectAsync(self.ui.tabla_a_conectar, "nw_exp", "getTablesByEncAndModel", table);
            return;
        },
        setParamRecordTable: function setParamRecordTable(table) {
            var self = this;
            self.table = table;
            var func = function (r) {
                if (r == false) {
                    return;
                }
                self.filtersList.removeAll();
                for (var i = 0; i < r.length; i++) {
                    var d = r[i];
                    var label = d["nombre"];
                    var item = new qxnw.widgets.listItem(label).set({
                        rich: true,
                        selectable: true,
                        focusable: true
                    });
                    item.addListener("focusout", function () {
                        this.setUserData("nw_focus", false);
                    });
                    item.setModel(d);
                    self.filtersList.add(item);
                }
                return;
            };
            qxnw.utils.fastAsyncRpcCall("nw_exp", "getFieldsByTable", table, func);
        },
        setParamRecord: function setParamRecord(id) {
            this.enc = id;
        },
        save: function save() {
            var self = this;
            var r = {};
            r.table = self.tablasList.getSelection();
            r.table = r.table[0].getModel();
            r.enc = self.enc;
            var func = function () {
                qxnw.utils.information(self.tr("Registro guardado correctamente"));
                self.accept();
                return;
            };
            qxnw.utils.fastAsyncRpcCall("nw_sync", "saveTable", r, func);
        },
        searchFields: function searchFields() {
            var self = this;
            var selected = self.tablasList.getSelection();
            selected = selected[0].getModel();
            if (typeof selected == 'undefined') {
                return;
            }
            var func = function (r) {
                if (r == false) {
                    return;
                }
                self.camposDisponiblesList.removeAll();
                for (var i = 0; i < r.length; i++) {
                    var d = r[i];
                    var label = d["field_name"];
                    var item = new qxnw.widgets.listItem(label).set({
                        rich: true,
                        selectable: true,
                        focusable: true
                    });
                    item.addListener("focusout", function () {
                        this.setUserData("nw_focus", false);
                    });
                    item.addListener("execute", function () {
                        self.searchFields();
                    });
                    item.setModel(d);
                    self.camposDisponiblesList.add(item);
                }
                self.getDataTable(selected.nombre);
            };
            qxnw.utils.fastAsyncRpcCall("nw_exp", "searchFieldsByTable", selected.nombre, func);
        },
        getDataTable: function getDataTable(table) {
            var self = this;
            self.data_tabla.setTableMethod("master");
            self.data_tabla.createFromTable(table);
            self.data_tabla.setAllPermissions(false);
            self.data_tabla.applyFilters();
        },
        populateTables: function populateTables() {
            var self = this;
            var func = function (r) {
                if (r == false) {
                    return;
                }
                self.tablasList.removeAll();
                var sl = false;
                for (var i = 0; i < r.length; i++) {
                    var d = r[i];
                    var label = typeof d["nombre"] == "undefined" ? d["name"] : d["nombre"];
                    var item = new qxnw.widgets.listItem(label).set({
                        rich: true,
                        selectable: true,
                        focusable: true
                    });
                    item.addListener("focusout", function () {
                        this.setUserData("nw_focus", false);
                    });
                    item.addListener("click", function () {
                        self.searchFields();
                    });
                    item.setModel(d);
                    self.tablasList.add(item);
                    if (self.table != null && self.table["nombre"] == d["nombre"]) {
                        sl = item;
                    }
                }
                if (sl != false) {
                    self.tablasList.setSelection([sl]);
                    self.searchFields();
                    self.tablasList.setEnabled(false);
                }
            };
            qxnw.utils.fastAsyncRpcCall("nw_exp", "searchTables", null, func);
        }
    }
});
