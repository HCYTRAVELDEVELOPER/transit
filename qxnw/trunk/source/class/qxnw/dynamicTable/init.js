/* ************************************************************************
 
 Copyright:
 2013 Netwoods.net, http://www.netwoods.net
 
 License:
 LGPL: http://www.gnu.org/licenses/lgpl.html
 EPL: http://www.eclipse.org/org/documents/epl-v10.php
 See the LICENSE file in the project's top-level directory for details.
 
 Authors:
 * Andrés Flórez (andresf)
 
 ************************************************************************ */
qx.Class.define("qxnw.dynamicTable.init", {
    extend: qxnw.forms,
    construct: function(tableParent) {
        var self = this;
        self.base(arguments);
        if (typeof tableParent == 'undefined') {
            qxnw.utils.error("No se definió la tabla pariente para el diseñador de tablas dinámicas");
        }
        self.tableParent = tableParent;
        self.setTitle(self.tr("Tabla dinámica avanzada"));

        var lbl = self.addFooterNote("Recuerde que este widget es una muestra y se encuentra en estado de pruebas. Agradecemos sus comentarios para mejorar esta herramienta haciendo clic <b>aquí</b>");
        lbl.addListener("activate", function() {
            main.showPQR(false);
        });

        self.startInterface();
        self.createDeffectButtons();

        self.ui.accept.setLabel(self.tr("Exportar"));
        self.ui.accept.setIcon(qxnw.config.execIcon("document-save-as"));

        self.ui.cancel.addListener("tap", function() {
            self.reject();
        });

        self.ui.accept.addListener("tap", function() {
            var r = {};
            r["records"] = self.subList.getAllRecords();
            if (r["records"].length == 0) {
                qxnw.utils.information(self.tr("Debe tener registros dinámicos para realizar la exportación"));
                return;
            }
            try {
                r["records"][r["records"].length - 1]["fila"] = r["records"][r["records"].length - 1]["fila"].replace("<b>", "").replace("</b>", "");
            } catch (e) {

            }
            try {
                for (var i = 0; i < r["records"].length; i++) {
                    r["records"][i]["fila"] = r["records"][i]["fila"].replace(/&nbsp;/gi, "-");
                }
            } catch (e) {

            }
            self.subList.exportData(false, r["records"], true);
        });
    },
    members: {
        tableParent: null,
        tableRecords: null,
        camposDisponiblesList: null,
        filaRotulosList: null,
        columnaRotulosList: null,
        valoresList: null,
        subList: null,
        startInterface: function startInterface() {
            var self = this;

            var container = new qx.ui.container.Composite(new qx.ui.layout.HBox());
            self.masterContainer.add(container, {
                flex: 1
            });

            var containercamposDisponibles = new qx.ui.container.Composite(new qx.ui.layout.VBox());
            var lbl = new qx.ui.basic.Label(self.tr("Seleccione los campos para agregar:"));
            containercamposDisponibles.add(lbl);
            var camposDisponiblesList = new qx.ui.form.List();
            self.camposDisponiblesList = camposDisponiblesList;
            camposDisponiblesList.addListener("dragstart", function(e) {
                e.addType("items");
                e.addType("value");
                e.addAction("copy");
                e.addAction("move");
            });
            camposDisponiblesList.addListener("droprequest", function(e) {
                var action = e.getCurrentAction();
                var type = e.getCurrentType();
                var result;
                var selection = this.getSelection();
                var dragTarget = e.getDragTarget();
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
                        this.remove(selection[i]);
                    }
                }
                // Add data to manager
                e.addData(type, result);
            });
            camposDisponiblesList.setDraggable(true);
            camposDisponiblesList.setSelectionMode("single");
            containercamposDisponibles.add(camposDisponiblesList, {
                flex: 1
            });
            container.add(containercamposDisponibles, {
                flex: 1
            });

            var subContainer = new qx.ui.container.Composite(new qx.ui.layout.VBox());
            container.add(subContainer, {
                flex: 1
            });

            var containerRotulosFila = new qx.ui.container.Composite(new qx.ui.layout.VBox());
            var lbla = new qx.ui.basic.Label(self.tr("Rótulos de fila:"));
            containerRotulosFila.add(lbla);
            var rotulosFilaList = new qx.ui.form.List().set({
                maxHeight: 100
            });
            rotulosFilaList.setContextMenu(self.getContextMenuRotulos());
            self.filaRotulosList = rotulosFilaList;
            rotulosFilaList.addListener("drop", function(e) {
                var items = e.getData("items");
                var child = this.getChildren();
                if (child.length > 2) {
                    qxnw.utils.information(self.tr("Por el momento opción disponible para 3 dimensiones"));
                    return;
                }
                for (var i = 0, l = items.length; i < l; i++) {
                    this.add(items[i]);
                }
                self.processDynamicTable();
            });
            rotulosFilaList.addListener("dragover", function(e) {
                if (!e.supportsType("items")) {
                    e.preventDefault();
                }
            });
            rotulosFilaList.setDroppable(true);
            containerRotulosFila.add(rotulosFilaList);
            subContainer.add(containerRotulosFila, {
                flex: 1
            });

//            var containerRotulosColumna = new qx.ui.container.Composite(new qx.ui.layout.VBox());
//            var lblc = new qx.ui.basic.Label(self.tr("Rótulos de columna:"));
//            containerRotulosColumna.add(lblc);
//            var rotulosColumnaList = new qx.ui.form.List().set({
//                maxHeight: 100
//            });
//            self.columnaRotulosList = rotulosColumnaList;
//            rotulosColumnaList.addListener("drop", function(e) {
//                var items = e.getData("items");
//                for (var i = 0, l = items.length; i < l; i++) {
//                    this.add(items[i]);
//                }
//                self.processDynamicTable();
//            });
//            rotulosColumnaList.addListener("dragover", function(e) {
//                if (!e.supportsType("items")) {
//                    e.preventDefault();
//                }
//            });
//            rotulosColumnaList.setDroppable(true);
//            containerRotulosColumna.add(rotulosColumnaList);
//            subContainer.add(containerRotulosColumna, {
//                flex: 1
//            });

            var containerValores = new qx.ui.container.Composite(new qx.ui.layout.VBox());
            var lblb = new qx.ui.basic.Label(self.tr("Valores:"));
            containerValores.add(lblb);
            var valoresList = new qx.ui.form.List().set({
                maxHeight: 100
            });
            valoresList.setContextMenu(self.getContextMenuValores());
            self.valoresList = valoresList;
            valoresList.addListener("drop", function(e) {
                var items = e.getData("items");
                for (var i = 0, l = items.length; i < l; i++) {
                    items[i].setLabel("Cuenta de " + items[i].getModel()["model"]);
                    items[i].setUserData("type", "COUNT");
                    this.add(items[i]);
                }
                self.processDynamicTable();
            });
            valoresList.addListener("dragover", function(e) {
                if (!e.supportsType("items")) {
                    e.preventDefault();
                }
            });
            valoresList.setDroppable(true);
            containerValores.add(valoresList);
            subContainer.add(containerValores, {
                flex: 1
            });

            self.masterContainer.add(self.createFiltersContainer(), {
                flex: 0
            });

            var subList = new qxnw.lists();
            self.subList = subList;
            subList.setMaxHeight(200);
            subList.hideTools();
            subList.hideFooterTools();
            self.insertNavTable(subList.getBase(), self.tr("Data"));

            self.tableRecords = self.tableParent.getAllRecords();
            var columns = self.tableParent.table.getTableColumnModel().getVisibleColumns();
            var funcSort = function(a, b) {
                return a - b;
            };
            columns.sort(funcSort);
            for (var i = 0; i < columns.length; i++) {
                var model = self.tableParent.table.getTableModel().getColumnName(columns[i]).replace("<b style='color:red'>*</b>", "");
                var idCol = self.tableParent.table.getTableModel().getColumnId(columns[i]);
                var data = {};
                data["columnId"] = idCol;
                data["model"] = model;
                data["id"] = columns[i];
                var item = new qxnw.widgets.listItem(model);
                item.setModel(data);
                camposDisponiblesList.add(item);
            }
        },
        createFiltersContainer: function createFiltersContainer() {
            var self = this;
            var filtersContainer = new qx.ui.container.Composite(new qx.ui.layout.VBox());
            var group = new qx.ui.groupbox.GroupBox(self.tr("Filtros disponibles"), qxnw.config.execIcon("format-text-direction-ltr")).set({
                contentPadding: 2
            });
            group.setLayout(new qx.ui.layout.HBox().set({
                spacing: 10
            }));
            var f = self.tableParent.getFiltersData();
            var excludeFilters = ["count", "export", "page", "part", "rowHeight", "sort", "sorted", "sorted_method", "sorted_name", "subfilters"];
            var counter = 0;
            for (var d in f) {
                if (excludeFilters.indexOf(d) == -1 && f[d] != null) {
                    if (f[d] != "") {
                        if (d.indexOf("_label") == -1) {
                            if (d.indexOf("_array") == -1) {
                                if (d.indexOf("_text") == -1) {
                                    var l = new qx.ui.basic.Label("<b>" + qxnw.utils.ucFirst(d).replace("_", " ") + "</b>:" + f[d]).set({
                                        rich: true
                                    });
                                    group.add(l);
                                    counter++;
                                }
                            }
                        }
                    }
                }
            }
            if (counter == 0) {
                var l = new qx.ui.basic.Label(self.tr("No hay filtros disponibles"));
                group.add(l);
            }
            var rec = self.tableParent.getAllRecords().length;
            var l1 = new qx.ui.basic.Label("<b>Registros seleccionados: </b>" + rec.toString()).set({
                rich: true
            });
            var l2 = new qx.ui.basic.Label("<b>Total registros: </b>" + self.tableParent.getTotalListRecords().toString()).set({
                rich: true
            });
            group.add(l1);
            group.add(l2);
            filtersContainer.add(group);
            return filtersContainer;
        },
        processDynamicTable: function processDynamicTable() {
            var self = this;
            var cols = [
                {
                    name: "fila",
                    caption: "fila",
                    label: self.tr("Rótulos de fila"),
                    type: "html"
                }
            ];

            var valChildren = self.valoresList.getChildren();
            for (var za = 0; za < valChildren.length; za++) {
                var zmod = valChildren[za].getModel();
                var zz = [];
                zz["name"] = zmod["columnId"];
                zz["caption"] = zmod["columnId"];
                if (valChildren[za].getUserData("type") == "SUM") {
                    zz["label"] = "Suma de " + zmod["model"];
                } else {
                    zz["label"] = "Cuenta de " + zmod["model"];
                }
                cols.push(zz);
            }
            self.subList.setColumns(cols);

            for (var izz = 0; izz < cols.length; izz++) {
                self.subList.table.setColumnWidth(izz, 200);
            }

            var filaRotulos = self.filaRotulosList.getChildren();
            if (filaRotulos.length == 1) {
                var mod = filaRotulos[0].getModel();
                self.tableParent.table.getTableModel().sortByColumn(parseInt(mod["id"]), true);
                self.tableRecords = self.tableParent.getAllRecords();
            }
            //var columnaRotulos = self.columnaRotulosList.getChildren();
            var dataArray = [];
            var dataArrayModel = [];
            var dataArrayQx = new qx.data.Array();
            var columnCount = [];
            for (var i = 0; i < filaRotulos.length; i++) {
                var model = filaRotulos[i].getModel();
                var columnId = model["columnId"];
                for (var ia = 0; ia < self.tableRecords.length; ia++) {
                    for (var ib in self.tableRecords[ia]) {
                        if (ib == columnId && i == 0) {
                            if (dataArray.indexOf(self.tableRecords[ia][ib]) == -1) {
                                var fila = [];
                                fila["fila"] = (self.tableRecords[ia][ib]).toString();
                                fila["key"] = [ib];
                                dataArrayModel.push(fila);
                                dataArray.push(self.tableRecords[ia][ib]);
                                var elm = [];
                                elm[columnId] = self.tableRecords[ia][ib];
                                dataArrayQx.push(elm);
                            }
                            for (var za = 0; za < valChildren.length; za++) {
                                var tt = valChildren[za].getModel();
                                var type = valChildren[za].getUserData("type");
                                if (self.tableRecords[ia][tt["columnId"]]) {
                                    if (typeof columnCount[tt["columnId"] + self.tableRecords[ia][ib]] == 'undefined') {
                                        columnCount[tt["columnId"] + self.tableRecords[ia][ib]] = 0;
                                    }
                                    if (type == "COUNT") {
                                        columnCount[tt["columnId"] + self.tableRecords[ia][ib]] = columnCount[tt["columnId"] + self.tableRecords[ia][ib]] + 1;
                                    } else if (type == "SUM") {
                                        columnCount[tt["columnId"] + self.tableRecords[ia][ib]] = parseInt(columnCount[tt["columnId"] + self.tableRecords[ia][ib]]) + parseInt(self.tableRecords[ia][tt["columnId"]]);
                                    }
                                }
                            }
                        }
                    }
                }
            }
            var totalValue = [];
            if (valChildren.length > 0) {
                for (var za = 0; za < valChildren.length; za++) {
                    tt = valChildren[za].getModel();
                    for (var zb = 0; zb < dataArrayModel.length; zb++) {
                        if (columnCount[tt["columnId"] + dataArrayModel[zb]["fila"]]) {
                            dataArrayModel[zb][tt["columnId"]] = columnCount[tt["columnId"] + dataArrayModel[zb]["fila"]];
                            if (typeof totalValue[tt["columnId"]] == 'undefined') {
                                totalValue[tt["columnId"]] = 0;
                            }
                            totalValue[tt["columnId"]] = parseInt(columnCount[tt["columnId"] + dataArrayModel[zb]["fila"]]) + parseInt(totalValue[tt["columnId"]]);
                        }
                    }
                }
            }
            if (filaRotulos.length > 1) {
                var arr = dataArrayQx.toArray();
                arr.sort();
                var newArray = [];
                var newArrayTmp = [];
                for (var z = 0; z < arr.length; z++) {
                    var search = "";
                    var val = "";
                    for (var d in arr[z]) {
                        search = d;
                        val = arr[z][d];
                        break;
                    }
                    var a = [];
                    a["fila"] = val;
                    a["key"] = search;
                    newArray.push(a);
                    var spacer = "&nbsp;&nbsp;&nbsp;&nbsp;";
                    for (var i = 1; i < filaRotulos.length; i++) {
                        var model = filaRotulos[i].getModel();
                        var columnId = model["columnId"];
                        newArrayTmp = [];
                        for (var ia = 0; ia < self.tableRecords.length; ia++) {
                            if (self.tableRecords[ia][search] == val) {
                                for (var ib in self.tableRecords[ia]) {
                                    if (columnId == ib) {
                                        if (typeof self.tableRecords[ia][ib] != 'undefined') {
                                            if (newArrayTmp.indexOf(self.tableRecords[ia][ib].toString().replace(/&nbsp;/gi, "")) == -1) {
                                                var ins = [];
                                                ins["fila"] = self.tableRecords[ia][ib].toString().replace(/&nbsp;/gi, "");
                                                ins["level"] = i;
                                                ins["key"] = ib;
                                                ins["row"] = self.tableRecords[ia];
                                                newArray.push(ins);
                                                newArrayTmp.push(self.tableRecords[ia][ib].toString().replace(/&nbsp;/gi, ""));
                                            }
                                        }
                                        for (var za = 0; za < valChildren.length; za++) {
                                            var tt = valChildren[za].getModel();
                                            if (self.tableRecords[ia][tt["columnId"]] && columnId == ib) {
                                                if (typeof columnCount[val + tt["columnId"] + self.tableRecords[ia][ib]] == 'undefined') {
                                                    columnCount[val + tt["columnId"] + self.tableRecords[ia][ib]] = 0;
                                                }
                                                var type = valChildren[za].getUserData("type");
                                                if (type == "COUNT") {
                                                    columnCount[val + tt["columnId"] + self.tableRecords[ia][ib]] = columnCount[val + tt["columnId"] + self.tableRecords[ia][ib]] + 1;
                                                } else if (type == "SUM") {
                                                    columnCount[val + tt["columnId"] + self.tableRecords[ia][ib]] = parseInt(columnCount[val + tt["columnId"] + self.tableRecords[ia][ib]]) + parseInt(self.tableRecords[ia][tt["columnId"]]);
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                totalValue = [];
                if (valChildren.length > 0) {
                    for (var za = 0; za < valChildren.length; za++) {
                        tt = valChildren[za].getModel();
                        var oldValue = "";
                        for (var zb = 0; zb < newArray.length; zb++) {
                            if (columnCount[tt["columnId"] + newArray[zb]["fila"]]) {
                                newArray[zb][tt["columnId"]] = columnCount[tt["columnId"] + newArray[zb]["fila"]];
                                if (typeof columnCount[tt["columnId"] + newArray[zb]["fila"]] != 'undefined') {
                                    if (typeof totalValue[tt["columnId"]] == 'undefined') {
                                        totalValue[tt["columnId"]] = 0;
                                    }
                                    totalValue[tt["columnId"]] = parseInt(columnCount[tt["columnId"] + newArray[zb]["fila"]]) + parseInt(totalValue[tt["columnId"]]);
                                }
                                oldValue = newArray[zb]["fila"];
                            } else if (columnCount[oldValue + tt["columnId"] + newArray[zb]["fila"].replace(/&nbsp;/gi, "")]) {
                                newArray[zb][tt["columnId"]] = columnCount[oldValue + tt["columnId"] + newArray[zb]["fila"].replace(/&nbsp;/gi, "")];
                                newArray[zb]["fila"] = new Array(parseInt(newArray[zb]["level"]) + 1).join(spacer) + newArray[zb]["fila"].replace(/&nbsp;/gi, "");
                            }
                        }
                    }
                }
                //máximo de rótulos: filaRotulos.length
                var finalArray = [];
                var tmpArray = newArray;
                var oldValue = [];
                for (var i = 0; i < newArray.length; i++) {
                    if (i == 0 || typeof newArray[i]["level"] == 'undefined') {
                        newArray[i]["inserted"] = true;
                        finalArray.push(newArray[i]);
                        var d = {};
                        d["value"] = newArray[i]["fila"];
                        d["key"] = newArray[i]["key"];
                        oldValue = [];
                        oldValue.push(d);
                    } else {
                        newArray[i]["inserted"] = true;
                        finalArray.push(newArray[i]);
                        var d = {};
                        d["value"] = newArray[i]["fila"];
                        d["key"] = newArray[i]["key"];
                        oldValue.push(d);
                        for (var ia = 0; ia < tmpArray.length; ia++) {
                            if (typeof tmpArray[ia]["level"] != 'undefined') {
                                if (tmpArray[ia]["level"] > newArray[i]["level"]) {
                                    if (tmpArray[ia]["row"][newArray[i]["key"]] == newArray[i]["fila"].replace(/&nbsp;/gi, "")) {
                                        var haveToIn = false;
                                        for (var si = 0; si < oldValue.length; si++) {
                                            if (tmpArray[ia]["row"][oldValue[si]["key"]] == oldValue[si]["value"].replace(/&nbsp;/gi, "")) {
                                                haveToIn = true;
                                            } else {
                                                break;
                                            }
                                        }
                                        if (haveToIn == true) {
                                            if (typeof tmpArray[ia]["inserted"] == 'undefined') {
                                                tmpArray[ia]["inserted"] = true;
                                                console.log({
                                                    oldValue: oldValue,
                                                    inserted: newArray[ia]
                                                });
                                                finalArray.push(newArray[ia]);
                                                tmpArray.splice(ia, 1);
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                var total = [];
                total["fila"] = "<b>Total General</b>";
                for (var za = 0; za < valChildren.length; za++) {
                    tt = valChildren[za].getModel();
                    total[tt["columnId"]] = totalValue[tt["columnId"]];
                }
                newArray.push(total);
                finalArray.push(total);
                self.subList.setModelData(finalArray);
                //self.subList.setModelData(newArray);
            } else if (filaRotulos.length == 1) {
                var total = [];
                total["fila"] = "<b>Total General</b>";
                for (var za = 0; za < valChildren.length; za++) {
                    tt = valChildren[za].getModel();
                    total[tt["columnId"]] = totalValue[tt["columnId"]];
                }
                dataArrayModel.push(total);
                self.subList.setModelData(dataArrayModel);
            }
        },
        getContextMenuValores: function getContextMenuValores() {
            var self = this;
            var menu = new qx.ui.menu.Menu;
            var quitButton = new qx.ui.menu.Button(self.tr("Quitar"), qxnw.config.execIcon("dialog-close"));
            var typeButton = new qx.ui.menu.Button(self.tr("Tipo de operación"), qxnw.config.execIcon("dialog-apply"));
            var subMenu = new qx.ui.menu.Menu;
            var countButton = new qx.ui.menu.Button(self.tr("Contar"), qxnw.config.execIcon("view-sort-descending"));
            countButton.setUserData("type", "COUNT");
            var sumButton = new qx.ui.menu.Button(self.tr("Sumar"), qxnw.config.execIcon("list-add"));
            sumButton.setUserData("type", "SUM");

            quitButton.addListener("execute", function(e) {
                var tar = self.valoresList.getSelection();
                var items = [];
                for (var i = 0; i < tar.length; i++) {
                    items.push(tar[i].clone());
                    self.valoresList.remove(tar[i]);
                }
                var children = self.camposDisponiblesList.getChildren();
                var modItem = items[0].getModel();
                for (var i = 0; i < children.length; i++) {
                    var mod = children[i].getModel();
                    if (mod["id"] > modItem["id"]) {
                        items[0].setLabel(items[0].getLabel().replace("Cuenta de", ""));
                        self.camposDisponiblesList.addBefore(items[0], children[i]);
                        break;
                    }
                }
                self.processDynamicTable();
            });
            countButton.addListener("execute", function(e) {
                var ot = e.getTarget();
                var menuType = ot.getUserData("type");
                var tar = self.valoresList.getSelection();
                var selectionType = tar[0].getUserData("type");
                if (menuType != selectionType) {
                    tar[0].setLabel("Cuenta de " + tar[0].getModel()["model"]);
                    tar[0].setUserData("type", "COUNT");
                    self.processDynamicTable();
                }
            });
            sumButton.addListener("execute", function(e) {
                var ot = e.getTarget();
                var menuType = ot.getUserData("type");
                var tar = self.valoresList.getSelection();
                var selectionType = tar[0].getUserData("type");
                if (menuType != selectionType) {
                    tar[0].setLabel("Suma de " + tar[0].getModel()["model"]);
                    tar[0].setUserData("type", "SUM");
                    self.processDynamicTable();
                }
            });

            menu.add(quitButton);
            menu.add(typeButton);

            typeButton.setMenu(subMenu);

            subMenu.add(countButton);
            subMenu.add(sumButton);

            return menu;
        },
        getContextMenuRotulos: function getContextMenuRotulos() {
            var self = this;
            var menu = new qx.ui.menu.Menu;
            var quitButton = new qx.ui.menu.Button(self.tr("Quitar"), qxnw.config.execIcon("dialog-close"));
            quitButton.addListener("execute", function(e) {
                var tar = self.filaRotulosList.getSelection();
                var items = [];
                for (var i = 0; i < tar.length; i++) {
                    items.push(tar[i].clone());
                    self.filaRotulosList.remove(tar[i]);
                }
                var children = self.camposDisponiblesList.getChildren();
                var modItem = items[0].getModel();
                for (var i = 0; i < children.length; i++) {
                    var mod = children[i].getModel();
                    if (mod["id"] > modItem["id"]) {
                        items[0].setLabel(items[0].getLabel().replace("Cuenta de", ""));
                        self.camposDisponiblesList.addBefore(items[0], children[i]);
                        break;
                    }
                }
                self.processDynamicTable();
            });
            menu.add(quitButton);
            return menu;
        }
    }
});