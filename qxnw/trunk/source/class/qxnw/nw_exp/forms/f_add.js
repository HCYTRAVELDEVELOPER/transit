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

qx.Class.define("qxnw.nw_exp.forms.f_add", {
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
            if (self.table == null) {
                r.table_id = 0;
            } else {
                r.table_id = self.table.id;
            }
            r.fields = self.filtersList.getAllData();
            r.enc = self.enc;
            var func = function () {
                qxnw.utils.information(self.tr("Registro guardado correctamente"));
                self.accept();
                return;
            };
            qxnw.utils.fastAsyncRpcCall("nw_exp", "saveTableAndFields", r, func);
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
                self.getDataTable(selected.nombre);
            };
            qxnw.utils.fastAsyncRpcCall("nw_exp", "searchFieldsByTable", selected.nombre, func);
        },
        getDataTable: function getDataTable(table) {
            var self = this;
            self.data_tabla.setTableMethod("master");
            self.data_tabla.createFromTable(table);
            self.data_tabla.setAllPermissions(false);
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

            var container = new qx.ui.splitpane.Pane("horizontal").set({
                padding: 0
            });

//            var container = new qx.ui.container.Composite(new qx.ui.layout.HBox()).set({
//                marginTop: 0
//            });

            self.upContainer = container;
            self.masterContainer.add(container, {
                flex: 1
            });

            var subContainer = new qx.ui.container.Composite(new qx.ui.layout.VBox()).set({
                minWidth: 300
            });
            container.add(subContainer, 1);

            var containerTables = new qx.ui.container.Composite(new qx.ui.layout.VBox()).set({
                minHeight: 300
            });
            var lbla = new qx.ui.basic.Label(self.tr("<b>Tablas disponibles:</b>")).set({
                rich: true
            });
            containerTables.add(lbla);
            var tablasList = new qxnw.widgets.list().set({
                minHeight: 300
            });
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
                flex: 0
            });

            var containerFilters = new qx.ui.container.Composite(new qx.ui.layout.VBox());
            var lblc = new qx.ui.basic.Label(self.tr("<b>Campos seleccionados:</b>")).set({
                maxHeight: 25,
                rich: true
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

            var lbla = new qx.ui.basic.Label(self.tr("<b>Campos disponibles:</b>")).set({
                rich: true
            });
            containercamposDisponibles.add(lbla);
            var camposDisponiblesList = new qxnw.widgets.list().set({
                minHeight: 300
            });
            camposDisponiblesList.hideLabel();
            self.camposDisponiblesList = camposDisponiblesList;
            camposDisponiblesList.setDraggable(false);
            camposDisponiblesList.setDroppable(false);
            camposDisponiblesList.setSelectionMode("single");
            containercamposDisponibles.add(camposDisponiblesList, {
                flex: 1
            });
            container.add(containercamposDisponibles, 1);

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


            var lblb = new qx.ui.basic.Label(self.tr("<b>Data asociada a la tabla:</b>")).set({
                rich: true
            });
            containercamposDisponibles.add(lblb);
            var dt = new qxnw.nw_exp.lists.l_data_tabla();
            self.data_tabla = dt;
            containercamposDisponibles.add(dt.getBase());
            return;
        }
    }
});
