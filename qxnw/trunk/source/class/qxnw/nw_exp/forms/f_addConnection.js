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

qx.Class.define("qxnw.nw_exp.forms.f_addConnection", {
    extend: qxnw.forms,
    construct: function () {
        var self = this;
        this.base(arguments);
        self.setTitle(self.tr("Agregar conexión :: QXNW"));
        var fields = [
            {
                name: "camposDisponibles",
                label: self.tr("Campo a conectar de la tabla"),
                type: "selectBox",
                required: true
            },
            {
                name: "tabla_a_conectar",
                label: self.tr("Tabla a conectar"),
                type: "selectBox",
                required: true
            },
            {
                name: "campos_tabla_destino",
                label: self.tr("Campo a conectar"),
                type: "selectBox",
                required: true
            },
            {
                name: "mostrar_como",
                label: self.tr("Mostrar como"),
                type: "textField"
            },
            {
                name: "orden",
                label: self.tr("Orden"),
                type: "textField",
                required: true
            }
        ];
        self.setFields(fields);
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
        setParamRecordTable: function setParamRecordTable(table, enc) {
            var self = this;
            self.enc = enc;
            self.table = table;
            var data = {};
            data.enc = enc;
            data.table = table;
            qxnw.utils.populateSelectAsync(self.ui.camposDisponibles, "nw_exp", "searchFieldsByTable", table);
            qxnw.utils.populateSelectAsync(self.ui.tabla_a_conectar, "nw_exp", "getTablesByEncAndModel", data);
            self.ui.tabla_a_conectar.addListener("changeSelection", function () {
                var val = this.getValue();
                var t = val["tabla_a_conectar_text"];
                self.ui.campos_tabla_destino.removeAll();
                qxnw.utils.populateSelectAsync(self.ui.campos_tabla_destino, "nw_exp", "searchFieldsByTable", t);
            });
            return;
        },
        setParamRecord: function setParamRecord(id) {
            this.enc = id;
        },
        save: function save() {
            var self = this;
            if (!self.validate()) {
                return;
            }
            var r = self.getRecord();
            r.tabla = self.table;
            r.enc = self.enc;
            var func = function () {
                qxnw.utils.information(self.tr("Registro guardado correctamente"));
                self.accept();
                return;
            };
            qxnw.utils.fastAsyncRpcCall("nw_exp", "saveConnections", r, func);
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
                var seleccionados = self.filtersList.getAllData();
                for (var i = 0; i < r.length; i++) {
                    var d = r[i];
                    var finded = false;
                    if (seleccionados != null) {
                        if (self.table != null) {
                            for (var ia = 0; ia < seleccionados.length; ia++) {
                                if (d["field_name"] == seleccionados[ia]["nombre"]) {
                                    finded = true;
                                    break;
                                }
                            }
                        }
                    }
                    if (finded == true) {
                        continue;
                    }
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
            };
            qxnw.utils.fastAsyncRpcCall("nw_exp", "searchFieldsByTable", selected.nombre, func);
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
        },
        startInterface: function startInterface() {
            var self = this;

            var container = new qx.ui.container.Composite(new qx.ui.layout.HBox()).set({
                marginTop: 0
            });
            self.upContainer = container;
            self.masterContainer.add(container, {
                flex: 1
            });

            var subContainer = new qx.ui.container.Composite(new qx.ui.layout.VBox());
            container.add(subContainer, {
                flex: 1
            });

            var containerTables = new qx.ui.container.Composite(new qx.ui.layout.VBox());
            var lbla = new qx.ui.basic.Label(self.tr("Tablas disponibles:"));
            containerTables.add(lbla);
            var tablasList = new qx.ui.form.List();
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
            containerTables.add(tablasList);
            subContainer.add(containerTables, {
                flex: 1
            });

            var containerFilters = new qx.ui.container.Composite(new qx.ui.layout.VBox());
            var lblc = new qx.ui.basic.Label(self.tr("Campos seleccionados:")).set({
                maxHeight: 25
            });
            containerFilters.add(lblc);
            var filtersList = new qxnw.widgets.list();
            filtersList.setDroppable(true);
            filtersList.addListener("drop", function (e) {
                var items = e.getData("items");
                for (var i = 0, l = items.length; i < l; i++) {
                    this.add(items[i]);
                }
                if (items.length > 0) {
                    self.tablasList.setEnabled(false);
                }
            });
            filtersList.addListener("contextmenu", function (e) {
                try {
                    var target = e.getTarget();
                    this.setSelection([target]);
                } catch (e) {
                    console.log(e);
                }
            });
//            filtersList.setContextMenu(self.getContextMenuColumnas());
            self.filtersList = filtersList;
            filtersList.setDraggable(true);
            filtersList.addListener("dragover", function (e) {
                if (!e.supportsType("items")) {
                    e.preventDefault();
                }
            });
            filtersList.setDroppable(true);
            containerFilters.add(filtersList);
            subContainer.add(containerFilters, {
                flex: 1
            });

            container.add(new qx.ui.core.Spacer(5));

            var containercamposDisponibles = new qx.ui.container.Composite(new qx.ui.layout.VBox());

            var lbla = new qx.ui.basic.Label(self.tr("Campos disponibles:"));
            containercamposDisponibles.add(lbla);
            var camposDisponiblesList = new qxnw.widgets.list();
            camposDisponiblesList.hideLabel();
            self.camposDisponiblesList = camposDisponiblesList;
            camposDisponiblesList.setDraggable(false);
            camposDisponiblesList.setDroppable(false);
            camposDisponiblesList.setSelectionMode("single");
            containercamposDisponibles.add(camposDisponiblesList, {
                flex: 1
            });
            container.add(containercamposDisponibles, {
                flex: 1
            });

            camposDisponiblesList.addListener("dragstart", function (e) {
                e.addType("items");
                e.addType("value");
                e.addAction("copy");
                e.addAction("move");
            });
            camposDisponiblesList.addListener("droprequest", function (e) {
                var action = e.getCurrentAction();
                var type = e.getCurrentType();
                var result;
                var selection = this.getSelection();
                var dragTarget = e.getDragTarget();

                dragTarget.setUserData("nw_state_drop", true);
                if (selection.length === 0) {
                    selection.push(dragTarget);
                } else if (selection.indexOf(dragTarget) == -1) {
                    selection = [dragTarget];
                }

                switch (type) {
                    case "items":
                        result = selection;
                        if (action == "copy") {
                            var copy = [];
                            for (var i = 0, l = result.length; i < l; i++) {
                                copy[i] = result[i].clone();
                            }
                            result = copy;
                        }
                        break;

                    case "value":
                        result = selection[0].getLabel();
                        break;
                }

                // Remove selected items on move
                if (action == "move") {
                    for (var i = 0, l = selection.length; i < l; i++) {
                        try {
                            this.remove(selection[i]);
                        } catch (e) {
                            qxnw.utils.error(e);
                        }
                    }
                }
                // Add data to manager
                e.addData(type, result);
            });
            camposDisponiblesList.setDraggable(true);
            camposDisponiblesList.setDroppable(true);
            camposDisponiblesList.setSelectionMode("single");
            camposDisponiblesList.addListener("drop", function (e) {
                var items = e.getData("items");
                for (var i = 0, l = items.length; i < l; i++) {
                    items[i].setUserData("nw_state_drop", false);
                    self.andAddToMainList(items[i]);
                }
                var timer = new qx.event.Timer(100);
                timer.start();
                timer.addListener("interval", function (e) {
                    this.stop();
                    qxnw.utils.stopLoading();
                    self.processDynamicTable();
                });
            });
            return;
        }
    }
});
