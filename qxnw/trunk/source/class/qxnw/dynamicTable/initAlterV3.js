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
qx.Class.define("qxnw.dynamicTable.initAlterV3", {
    extend: qxnw.forms,
    construct: function (tableParent, transferFilters) {
        var self = this;
        self.base(arguments);
        if (typeof tableParent == 'undefined') {
            qxnw.utils.error("No se definió la tabla pariente para el diseñador de tablas dinámicas");
        }
        self.tableParent = tableParent;
        try {
            self.__parentName = self.tableParent.getAppWidgetName();
        } catch (e) {
            self.__parentName = self.getAppWidgetName();
        }
        self.setTitle(self.tr("Inteligencia de negocios :: " + self.__parentName));

        self.__transferFilters = transferFilters;

        self.startInterface();
        self.createDeffectButtons();

        var buttons = [
            {
                name: "cmi_button",
                label: self.tr("Guardar informe"),
                icon: qxnw.config.execIcon("utilities-statistics", "apps")
            },
            {
                name: "cmi_ver_button",
                label: self.tr("Ver mis informes"),
                icon: qxnw.config.execIcon("cmi", "qxnw"),
                visible: false
            }
        ];
        self.addButtons(buttons);

        self.ui["cmi_ver_button"].addListener("execute", function () {
            var cmi = new qxnw.cmi.main();
            cmi.show();
        });
        var toolTipText = self.tr("Guardar en el cuadro de mando integral. Una forma de mantener la información de este \n\
                                            listado disponible para estadísticas de seguimiento.");
        var toolTip = new qx.ui.tooltip.ToolTip();
        toolTip.addListener("appear", function (e) {
            var label = toolTipText;
            toolTip.setLabel(label);
        });
        self.ui["cmi_button"].setToolTip(toolTip);
        self.ui["cmi_button"].addListener("click", function () {
            var valChildren = self.getListValues("valores");
            var filaRotulos = self.getListValues("filas");
            var filaColumnas = self.getListValues("columnas");
            var graphicType = self.graphicInterface.graphicType;
            self.tableParent.saveAsCmi(valChildren, filaRotulos, filaColumnas, graphicType);
        });
        self.tableParent.ui["cmiButton"] = self.ui["cmi_button"];


        self.ui.accept.setLabel(self.tr("Exportar"));
        self.ui.accept.setIcon(qxnw.config.execIcon("document-save-as"));

        self.ui.cancel.addListener("execute", function () {
            self.reject();
        });

        self.ui.accept.addListener("execute", function () {
            self.sendByExcel();
        });

        self.__promsArray = {};

        self.populateSavedSettings();

        self.addListener("close", function () {
            var head = document.getElementsByTagName('head')[0];
            var script = document.getElementById('nw_chart_css');
            if (script !== null) {
                head.removeChild(script);
            }
        });
    },
    destruct: function () {
        try {
            this.destroy();
            this._disposeMap("this.__promsArray");
            this._disposeMap("this.tableRecords");
            this._disposeMap("this.__colsSubList");
            this._disposeObjects("this.__parentName");
            this._disposeObjects("this.graphicInterface");
            this._disposeObjects("this.__transferFilters");
            this._disposeObjects("this.camposDisponiblesList");
            this._disposeObjects("this.filaRotulosList");
            this._disposeObjects("this.columnaRotulosList");
            this._disposeObjects("this.tableRecords");
            this._disposeObjects("this.subList");
            this._disposeObjects("this.ui");
            this.dispose();
        } catch (e) {
            this.dispose();
        }
    },
    members: {
        tableParent: null,
        tableRecords: null,
        camposDisponiblesList: null,
        filaRotulosList: null,
        columnaRotulosList: null,
        valoresList: null,
        subList: null,
        graphicInterface: null,
        __parentName: null,
        __transferFilters: false,
        __promsArray: null,
        isInsertedButtonsGraph: false,
        upContainer: null,
        __colsSubList: null,
        filtersChartContainer: null,
        closeChartButton: null,
        cleanAllFields: function cleanAllFields() {
            var self = this;

            //LIMPIAR RÓTULOS FILA
            var tar = self.filaRotulosList.getChildren();
            var items = [];
            for (var i = 0; i < tar.length; i++) {
                items.push(tar[i].clone());
            }
            self.filaRotulosList.removeAll();
            var children = self.camposDisponiblesList.getChildren();
            for (var ia = 0; ia < items.length; ia++) {
                var modItem = items[ia].getModel();
                for (var i = 0; i < children.length; i++) {
                    var mod = children[i].getModel();
                    if (mod["id"] > modItem["id"]) {
                        items[ia].setLabel(items[ia].getLabel().replace("Cuenta de", ""));
                        self.camposDisponiblesList.addBefore(items[ia], children[i]);
                        break;
                    }
                    if (i + 1 == children.length) {
                        items[ia].setLabel(items[ia].getLabel().replace("Cuenta de", ""));
                        self.camposDisponiblesList.addAfter(items[ia], children[i]);
                    }
                }
                self.removeSavedSettings(modItem, "rotule");
            }

            //LIMPIAR ROTULOS COLUMNA
            var tar = self.columnaRotulosList.getChildren();
            var items = [];
            for (var i = 0; i < tar.length; i++) {
                items.push(tar[i].clone());
            }
            self.columnaRotulosList.removeAll();
            var children = self.camposDisponiblesList.getChildren();
            for (var ia = 0; ia < items.length; ia++) {
                var modItem = items[ia].getModel();
                for (var i = 0; i < children.length; i++) {
                    var mod = children[i].getModel();
                    if (mod["id"] > modItem["id"]) {
                        items[ia].setLabel(items[ia].getLabel().replace("Cuenta de", ""));
                        self.camposDisponiblesList.addBefore(items[ia], children[i]);
                        break;
                    }
                    if (i + 1 == children.length) {
                        items[ia].setLabel(items[ia].getLabel().replace("Cuenta de", ""));
                        self.camposDisponiblesList.addAfter(items[ia], children[i]);
                    }
                }
            }

            //LIMPIAR VALORES
            var tar = self.valoresList.getChildren();
            var items = [];
            for (var i = 0; i < tar.length; i++) {
                items.push(tar[i].clone());
            }
            self.valoresList.removeAll();
            var children = self.camposDisponiblesList.getChildren();
            for (var ia = 0; ia < items.length; ia++) {
                var modItem = items[ia].getModel();
                for (var i = 0; i < children.length; i++) {
                    var mod = children[i].getModel();
                    if (mod["id"] > modItem["id"]) {
                        var lbl = items[ia].getLabel();
                        lbl = lbl.replace("Cuenta de", "");
                        lbl = lbl.replace("Suma de", "");
                        items[ia].setLabel(lbl);
                        self.camposDisponiblesList.addBefore(items[ia], children[i]);
                        break;
                    }
                    if (i + 1 == children.length) {
                        var lbl = items[ia].getLabel();
                        lbl = lbl.replace("Cuenta de", "");
                        lbl = lbl.replace("Suma de", "");
                        items[ia].setLabel(lbl);
                        self.camposDisponiblesList.addAfter(items[ia], children[i]);
                    }
                }
                self.removeSavedSettings(modItem, "values");
            }

            self.graphicInterface.startGraphic(self, [], "bars", [], []);
        },
        sendByExcel: function sendByExcel(fromGraph, callback) {
            var self = this;
            var r = {};
            r["records"] = self.subList.getAllRecords();
            if (r["records"].length == 0) {
                qxnw.utils.information(self.tr("Debe tener registros dinámicos para realizar la exportación"));
                return;
            }
            try {
                r["records"][r["records"].length - 1]["label"] = r["records"][r["records"].length - 1]["label"].replace("<b>", "").replace("</b>", "");
            } catch (e) {

            }
            try {
                for (var i = 0; i < r["records"].length; i++) {
                    r["records"][i]["label"] = r["records"][i]["label"].replace(/&nbsp;/gi, "-");
                }
            } catch (e) {

            }
            try {
                r["img_plot"] = self.graphicInterface.getImgUrl();
            } catch (e) {
                console.log(e);
                r["img_plot"] = false;
            }
            if (typeof fromGraph == 'undefined') {
                self.subList.exportData(false, r["records"], true, r["img_plot"]);
            } else {
                self.subList.exportData(false, r["records"], true, r["img_plot"], callback, true);
            }
        },
        getProcesedTableData: function getProcesedTableData() {
            var self = this;
            var r = self.getDynamicTableData();
            var colModel = self.subList.table.getTableColumnModel();
            var tableModel = self.subList.table.getTableModel();
            var colNum = colModel.getVisibleColumnCount();

            var table = "<table border='1'>";
            table += "<tbody>";
            table += "<tr>";
            var cols = [];

            for (var i = 0; i < colNum; i++) {
                table += "<th>";
                var colName = tableModel.getColumnName(i);
                var colId = tableModel.getColumnId(i);
                cols.push(colId);
                table += colName;
                table += "</th>";
            }
            table += "</tr>";
            for (var i = 0; i < r.length; i++) {
                table += "<tr>";
                for (var ia = 0; ia < cols.length; ia++) {
                    var type = self.subList.getColumnTypeFromIndex(ia - 1);
                    if (ia != 0) {
                        table += "<td align='right'>";
                    } else {
                        table += "<td>";
                    }
                    if (typeof type != 'undefined' && type == "money") {
                        try {
                            table += "$ " + qxnw.utils.formatCurrency(parseFloat(r[i][cols[ia]]).toFixed(2));
                        } catch (e) {
                            table += r[i][cols[ia]];
                        }
                    } else if (typeof type != 'undefined' && type == "percent") {
                        try {
                            table += parseFloat(r[i][cols[ia]]).toFixed(2) + "%";
                        } catch (e) {
                            table += r[i][cols[ia]];
                        }
                    } else if (typeof type != 'undefined' && type == "prom") {
                        try {
                            table += parseFloat(r[i][cols[ia]]).toFixed(2);
                        } catch (e) {
                            table += r[i][cols[ia]];
                        }
                    } else {
                        table += r[i][cols[ia]];
                    }
                    table += "</td>";
                }
                table += "</tr>";
            }
            table += "</tbody>";
            table += "</table>";
            return table;
        },
        getDynamicTableData: function getDynamicTableData() {
            var r = {};
            r["records"] = this.subList.getAllRecords();
            if (r["records"].length == 0) {
                return [];
            }
            try {
                r["records"][r["records"].length - 1]["label"] = r["records"][r["records"].length - 1]["label"].replace("<b>", "").replace("</b>", "");
            } catch (e) {

            }
            try {
                for (var i = 0; i < r["records"].length; i++) {
                    r["records"][i]["label"] = r["records"][i]["label"].replace(/&nbsp;/gi, "-");
                }
            } catch (e) {

            }
            return r["records"];
        },
        removeSavedSettings: function removeSavedSettings(item, type) {
            var self = this;
            var saved = qxnw.local.getData("dynamic_table_" + self.__parentName + "_" + type);
            if (saved != null) {
                for (var i = 0; i < saved.length; i++) {
                    if (saved[i]["model"] == item["model"]) {
                        saved.splice(i);
                        break;
                    }
                }
            } else {
                saved = [];
            }
            qxnw.local.storeData("dynamic_table_" + self.__parentName + "_" + type, saved);
        },
        populateSavedSettings: function populateSavedSettings() {
            var self = this;
            var savedRotules = qxnw.local.getData("dynamic_table_" + self.__parentName + "_rotule");
            var savedColumns = qxnw.local.getData("dynamic_table_" + self.__parentName + "_columns");
            var added = false;
            var children = self.camposDisponiblesList.getChildren();
            if (savedColumns != null) {
                for (var i = 0; i < savedColumns.length; i++) {
                    for (var ia = 0; ia < children.length; ia++) {
                        var field = children[ia].getModel();
                        if (field["model"] == savedColumns[i]["model"]) {
                            if (field["columnId"] == savedColumns[i]["columnId"]) {
                                if (field["id"] == savedColumns[i]["id"]) {
                                    self.columnaRotulosList.add(children[ia]);
                                    added = true;
                                    break;
                                }
                            }
                        }
                    }
                }
            }
            if (savedRotules != null) {
                for (var i = 0; i < savedRotules.length; i++) {
                    for (var ia = 0; ia < children.length; ia++) {
                        var field = children[ia].getModel();
                        if (field["model"] == savedRotules[i]["model"]) {
                            if (field["columnId"] == savedRotules[i]["columnId"]) {
                                if (field["id"] == savedRotules[i]["id"]) {
                                    self.filaRotulosList.add(children[ia]);
                                    added = true;
                                    break;
                                }
                            }
                        }
                    }
                }
//                var children = self.camposDisponiblesList.getChildren();
//                for (var i = 0; i < children.length; i++) {
//                    var field = children[i].getModel();
//                    for (var ia = 0; ia < savedRotules.length; ia++) {
//                        if (field["model"] == savedRotules[ia]["model"]) {
//                            if (field["columnId"] == savedRotules[ia]["columnId"]) {
//                                if (field["id"] == savedRotules[ia]["id"]) {
//                                    self.filaRotulosList.add(children[i]);
//                                    i--;
//                                    added = true;
//                                    break;
//                                }
//                            }
//                        }
//                    }
//                }
            }
            var savedValues = qxnw.local.getData("dynamic_table_" + self.__parentName + "_values");
            if (savedValues != null) {
                var children = self.camposDisponiblesList.getChildren();
                for (var i = 0; i < savedValues.length; i++) {
                    for (var ia = 0; ia < children.length; ia++) {
                        var field = children[ia].getModel();
                        if (field["model"] == savedValues[i]["model"]) {
                            if (field["columnId"] == savedValues[i]["columnId"]) {
                                if (field["id"] == savedValues[i]["id"]) {
                                    children[ia].setUserData("type", savedValues[i]["type"]);
                                    if (savedValues[i]["type"] == "SUM") {
                                        children[ia].setLabel("Suma de " + savedValues[i]["model"]);
                                    } else if (savedValues[i]["type"] == "PROM") {
                                        children[ia].setLabel("Promedio de " + savedValues[i]["model"]);
                                    } else if (savedValues[i]["type"] == "ABSO") {
                                        children[ia].setLabel("Valor absoluto de " + savedValues[i]["model"]);
                                    } else if (savedValues[i]["type"] == "PERCEN") {
                                        children[ia].setLabel("Porcentaje de " + savedValues[i]["model"]);
                                    } else {
                                        children[ia].setLabel("Cuenta de " + savedValues[i]["model"]);
                                    }
                                    self.valoresList.add(children[ia]);
                                    added = true;
                                    break;
                                }
                            }
                        }
                    }

                }
//                EN TESTING
//                for (var i = 0; i < children.length; i++) {
//                    var field = children[i].getModel();
//                    for (var ia = 0; ia < savedValues.length; ia++) {
//                        if (field["model"] == savedValues[ia]["model"]) {
//                            if (field["columnId"] == savedValues[ia]["columnId"]) {
//                                if (field["id"] == savedValues[ia]["id"]) {
//                                    children[i].setUserData("type", savedValues[ia]["type"]);
//                                    if (savedValues[ia]["type"] == "SUM") {
//                                        children[i].setLabel("Suma de " + savedValues[ia]["model"]);
//                                    } else if (savedValues[ia]["type"] == "PROM") {
//                                        children[i].setLabel("Promedio de " + savedValues[ia]["model"]);
//                                    } else {
//                                        children[i].setLabel("Cuenta de " + savedValues[ia]["model"]);
//                                    }
//                                    self.valoresList.add(children[i]);
//                                    i--;
//                                    added = true;
//                                    break;
//                                }
//                            }
//                        }
//                    }
//                }
            }

            var savedSelectedWidget = qxnw.local.getData("dynamic_table_" + self.__parentName + "_interface_type");
            if (savedSelectedWidget !== null) {
                if (self.getTabView() !== null) {
                    var selectables = self.getTabView().getSelectables(true);
                    for (var i = 0; i < selectables.length; i++) {
                        var rta = selectables[i].getLabel().toString();
                        if (rta === savedSelectedWidget) {
                            self.getTabView().setSelection([selectables[i]]);
                            break;
                        }
                    }
                }
            }

            if (added == true) {
                self.processDynamicTable();
            }
        },
        openHelp: function openHelp() {
            var f = new qxnw.forms();
            f.setModal(true);
            f.setTitle("::Tips::");
            var lbl = new qx.ui.basic.Label().set({
                rich: true
            });
            f.masterContainer.add(lbl, {
                flex: 1
            });
            var html = "";
            html += "<div>";
            html += "<ul>";
            html += "<li>Puede arrastrar y soltar los campos</li><br />";
            html += "<li>Por el momento sólo es posible crear informes con un campo en los rótulos de columna</li><br />";
            html += "<li>Puede imprimir un informe con un encabezado predeterminado. Por <b>Opciones -> Imprimir encabezado</b></li><br />";
            html += "<li>Puede cambiar los colores de hasta 10 campos, configurar las líneas, la posición de la leyenda entre otros, por el botón <b>Opciones</b> </li><br />";
            html += "<li>Los informes dinámicos se pueden enviar por correo. Así mismo se enviará un Excel con toda la información relacionada. Para esto puede ir al botón <b>Enviar correo</b></li><br />";
            html += "<li>Puede guardar un informe dando click en el botón <b>Guardar informe></b>. Luego podrá consultarlo en la barra a su izquierda, el <b>botón CMI (cuadro de mando integral)</b></li><br />";
            html += "<li>Todos los informes se pueden exportar a Excel. Incluso la imagen del informe saldrá en el mismo. Puede hacerlo por el botón <b>Exportar</b></li><br />";
            html += "<li>Es posible cambiar el ancho de las barras en la sección de <b>Opciones</b></li><br />";
            html += "<li>Puede cambiar el tamaño de las leyendas por la sección de <b>Opciones</b></li><br />";
            html += "</ul>";
            html += "</div>";
            lbl.setValue(html);
            f.show();
        },
        startInterface: function startInterface() {
            var self = this;
            var toolBar = new qx.ui.toolbar.ToolBar();
            var part = new qx.ui.toolbar.Part();
            toolBar.add(part);
            var hideFields = new qx.ui.form.Button(self.tr("Ocultar campos"), qxnw.config.execIcon("go-up"));
            hideFields.setUserData("nw_hide_up_container_" + self.__parentName, false);
            hideFields.addListener("execute", function () {
                var isHidden = this.getUserData("nw_hide_up_container_" + self.__parentName);
                if (isHidden === false) {
                    self.upContainer.setVisibility("excluded");
                    this.setLabel(self.tr("Mostrar campos"));
                    this.setIcon(qxnw.config.execIcon("go-down"));
                    this.setUserData("nw_hide_up_container_" + self.__parentName, true);
                    qxnw.local.setData("nw_hide_up_container_" + self.__parentName, true);
                } else {
                    self.upContainer.setVisibility("visible");
                    this.setLabel(self.tr("Ocultar campos"));
                    this.setIcon(qxnw.config.execIcon("go-up"));
                    this.setUserData("nw_hide_up_container_" + self.__parentName, false);
                    qxnw.local.setData("nw_hide_up_container_" + self.__parentName, false);
                }
            });
            part.add(hideFields);

            var refreshButton = new qx.ui.form.Button(self.tr("Refrescar data"), qxnw.config.execIcon("view-refresh"));
            refreshButton.addListener("execute", function () {
                if (typeof self.tableParent.applyFilters != 'undefined') {
                    self.tableParent.applyFilters();
                    self.tableParent.addListener("returnModelData", function () {
                        self.processDynamicTable();
                    });
                } else {
                    qxnw.utils.information(self.tr("No se encontró el metodo {applyFilters} en el listado"));
                }
            });
            part.add(refreshButton);

            var cleanButton = new qx.ui.form.Button(self.tr("Limpiar"), qxnw.config.execIcon("edit-clear"));
            cleanButton.addListener("execute", function () {
                self.cleanAllFields();
            });
            part.add(cleanButton);

            part.add(new qx.ui.toolbar.Separator());

            var helpButton = new qx.ui.form.Button(self.tr("Ayuda"), qxnw.config.execIcon("help-contents"));
            helpButton.addListener("execute", function () {
                self.openHelp();
            });
            part.add(helpButton);

            toolBar.addSpacer();

            var part1 = new qx.ui.toolbar.Part();

            var closeButton = new qx.ui.form.Button(self.tr("Cerrar"), qxnw.config.execIcon("dialog-close"));
            self.closeChartButton = closeButton;
            closeButton.setVisibility("excluded");
            part1.add(closeButton);

            toolBar.add(part1);

            self.masterContainer.add(toolBar, {
                flex: 0
            });

            var container = new qx.ui.container.Composite(new qx.ui.layout.HBox()).set({
                marginTop: 20
            });
            self.upContainer = container;
            self.masterContainer.add(container, {
                flex: 1
            });

            var uphf = qxnw.local.getData("nw_hide_up_container_" + self.__parentName);
            if (uphf != null) {
                if (uphf == true) {
                    self.upContainer.setVisibility("excluded");
                    hideFields.setLabel(self.tr("Mostrar campos"));
                    hideFields.setIcon(qxnw.config.execIcon("go-down"));
                    hideFields.setUserData("nw_hide_up_container_" + self.__parentName, true);
                }
            }

            var containercamposDisponibles = new qx.ui.container.Composite(new qx.ui.layout.VBox());

            var camposDisponiblesList = new qxnw.widgets.list().set({
                maxHeight: 260
            });
            camposDisponiblesList.hideLabel();
//            var camposDisponiblesList = new qx.ui.form.List().set({
//                maxHeight: 261
//            });
            self.camposDisponiblesList = camposDisponiblesList;
            camposDisponiblesList.addListener("dragstart", function (e) {
                e.addType("items");
                e.addType("value");
                e.addType("nw_type");
                e.addAction("copy");
                e.addAction("move");
                e.addData("nw_type", "campos_disponibles");
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
                var menuType = e.getData("nw_type");
                for (var i = 0, l = items.length; i < l; i++) {
                    var modItem = items[i].getModel();
                    items[i].setUserData("nw_state_drop", false);
                    self.andAddToMainList(items[i]);
                    if (menuType == "rotulos") {
                        self.removeSavedSettings(modItem, "rotule");
                    } else if (menuType == "rotulos_columna") {
                        self.removeSavedSettings(modItem, "columns");
                    } else if (menuType == "valores") {
                        self.removeSavedSettings(modItem, "values");
                    }
                }
                var timer = new qx.event.Timer(100);
                timer.start();
                timer.addListener("interval", function (e) {
                    this.stop();
                    qxnw.utils.stopLoading();
                    self.processDynamicTable();
                });
            });
            containercamposDisponibles.add(camposDisponiblesList, {
                flex: 1
            });
            container.add(containercamposDisponibles, {
                flex: 1
            });

            container.add(new qx.ui.core.Spacer(5));

            var subContainer = new qx.ui.container.Composite(new qx.ui.layout.VBox());
            container.add(subContainer, {
                flex: 1
            });

            var containerRotulosFila = new qx.ui.container.Composite(new qx.ui.layout.VBox());
            var lbla = new qx.ui.basic.Label(self.tr("Rótulos de fila:"));
            containerRotulosFila.add(lbla);
            var rotulosFilaList = new qx.ui.form.List().set({
                maxHeight: 70
            });
            rotulosFilaList.setContextMenu(self.getContextMenuRotulos());
            rotulosFilaList.addListener("contextmenu", function (e) {
                try {
                    var target = e.getTarget();
                    this.setSelection([target]);
                } catch (e) {
                    console.log(e);
                }
            });
            self.filaRotulosList = rotulosFilaList;
            rotulosFilaList.addListener("dragstart", function (e) {
                e.addType("items");
                e.addType("value");
                e.addType("nw_type");
                e.addAction("copy");
                e.addAction("move");
                e.addData("nw_type", "rotulos");
            });
            rotulosFilaList.addListener("droprequest", function (e) {
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

                dragTarget.setUserData("nw_state_drop", false);

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
            rotulosFilaList.setDraggable(true);
            rotulosFilaList.setSelectionMode("single");
            rotulosFilaList.addListener("drop", function (e) {
                qxnw.utils.loading(self.tr("Calculando..."));
                var items = e.getData("items");
                var menuType = e.getData("nw_type");
                for (var i = 0, l = items.length; i < l; i++) {
                    this.add(items[i]);
                    var mod = items[i].getModel();
                    self.saveItem(mod, "rotule");
                    if (menuType == "rotulos_columna") {
                        self.removeSavedSettings(mod, "columns");
                    }
                }
                var timer = new qx.event.Timer(100);
                timer.start();
                timer.addListener("interval", function (e) {
                    this.stop();
                    qxnw.utils.stopLoading();
                    self.processDynamicTable();
                });
            });
            rotulosFilaList.addListener("dragover", function (e) {
                if (!e.supportsType("items")) {
                    e.preventDefault();
                }
            });
            rotulosFilaList.setDroppable(true);
            containerRotulosFila.add(rotulosFilaList);
            subContainer.add(containerRotulosFila, {
                flex: 1
            });

            var containerRotulosColumna = new qx.ui.container.Composite(new qx.ui.layout.VBox());
            var lblc = new qx.ui.basic.Label(self.tr("Rótulos de columna:"));
            containerRotulosColumna.add(lblc);
            var rotulosColumnaList = new qx.ui.form.List().set({
                maxHeight: 70
            });
            rotulosColumnaList.addListener("contextmenu", function (e) {
                try {
                    var target = e.getTarget();
                    this.setSelection([target]);
                } catch (e) {
                    console.log(e);
                }
            });
            rotulosColumnaList.setContextMenu(self.getContextMenuColumnas());
            self.columnaRotulosList = rotulosColumnaList;
            rotulosColumnaList.addListener("dragstart", function (e) {
                e.addType("items");
                e.addType("value");
                e.addType("nw_type");
                e.addAction("copy");
                e.addAction("move");
                e.addData("nw_type", "rotulos_columna");
            });
            rotulosColumnaList.addListener("drop", function (e) {
                var items = e.getData("items");
                var children = this.getChildren();
                if (children.length > 0) {
                    qxnw.utils.information(self.tr("Temporalmente soporte sólo a una columna"));
                    self.andAddToMainList(items[0], "columns");
                    var timer = new qx.event.Timer(100);
                    timer.start();
                    timer.addListener("interval", function (e) {
                        this.stop();
                        self.processDynamicTable();
                    });
                    return;
                }
                for (var i = 0, l = items.length; i < l; i++) {
                    this.add(items[i]);
                    self.saveItem(items[i].getModel(), "columns");
                }
                var timer = new qx.event.Timer(100);
                timer.start();
                timer.addListener("interval", function (e) {
                    this.stop();
                    self.processDynamicTable();
                });
            });
            rotulosColumnaList.addListener("droprequest", function (e) {
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

                dragTarget.setUserData("nw_state_drop", false);

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
            rotulosColumnaList.setDraggable(true);
            rotulosColumnaList.addListener("dragover", function (e) {
                if (!e.supportsType("items")) {
                    e.preventDefault();
                }
            });
            rotulosColumnaList.setDroppable(true);
            containerRotulosColumna.add(rotulosColumnaList);
            subContainer.add(containerRotulosColumna, {
                flex: 1
            });

            var containerValores = new qx.ui.container.Composite(new qx.ui.layout.VBox());
            var lblb = new qx.ui.basic.Label(self.tr("Valores:"));
            containerValores.add(lblb);
            var valoresList = new qx.ui.form.List().set({
                maxHeight: 70
            });
            valoresList.addListener("contextmenu", function (e) {
                try {
                    var target = e.getTarget();
                    this.setSelection([target]);
                } catch (e) {
                    console.log(e);
                }
            });
            valoresList.setContextMenu(self.getContextMenuValores());
            self.valoresList = valoresList;
            valoresList.addListener("dragstart", function (e) {
                e.addType("items");
                e.addType("value");
                e.addType("nw_type");
                e.addAction("copy");
                e.addAction("move");
                e.addData("nw_type", "valores");
            });
            valoresList.addListener("droprequest", function (e) {
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

                dragTarget.setUserData("nw_state_drop", false);

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
            valoresList.setDraggable(true);
            valoresList.addListener("drop", function (e) {
                var items = e.getData("items");
                var childrenCols = self.columnaRotulosList.getChildren();
                var childrenVals = self.valoresList.getChildren();
                if (childrenCols.length > 0 && childrenVals.length > 0) {
                    qxnw.utils.information(self.tr("Temporalmente sólo puede usar un valor por columna"));
                    self.andAddToMainList(items[0], "values");
                    var timer = new qx.event.Timer(100);
                    timer.start();
                    timer.addListener("interval", function (e) {
                        this.stop();
                        self.processDynamicTable();
                    });
                    return;
                }
                var menuType = e.getData("nw_type");
                for (var i = 0, l = items.length; i < l; i++) {
                    items[i].setLabel("Cuenta de " + items[i].getModel()["model"]);
                    items[i].setUserData("type", "COUNT");
                    this.add(items[i]);
                    var mod = items[i].getModel();
                    mod["type"] = "COUNT";
                    self.saveItem(mod, "values");

                    if (menuType == "rotulos") {
                        self.removeSavedSettings(mod, "rotule");
                    } else if (menuType == "rotulos_columna") {
                        self.removeSavedSettings(mod, "columns");
                    }
                }
                var timer = new qx.event.Timer(100);
                timer.start();
                timer.addListener("interval", function (e) {
                    this.stop();
                    self.processDynamicTable();
                });
            });
            valoresList.addListener("dragover", function (e) {
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
            subList.setAppWidgetName("DATA_LIST");
            self.subList = subList;
            qxnw.local.setData(subList.getAppWidgetName() + "_list_sorted", null);
            subList.setMaxHeight(200);
            subList.ui.part1.setVisibility("excluded");
            subList.ui.part2.setVisibility("excluded");
            subList.ui.part3.setVisibility("excluded");
            subList.ui.printButton.setVisibility("excluded");
            subList.ui.dynamicTableButton.setVisibility("excluded");
            subList.ui.functionsButton.setVisibility("excluded");
            subList.hideFooterTools();
            subList.setUserData("interfaceType", "DATA");

            subList.addCheckBox("order_months", self.tr("Ordenar meses"), qxnw.config.execIcon("go-down"), self.tr("Ordenar por meses en caso de que sea posible"));
            subList.ui.order_months.addListener("changeValue", function (d) {
                if (d.getData()) {
                    self.orderListByMonths();
                } else {
                    qxnw.local.removeByKey(self.getAppWidgetName() + "_orderByMonth_" + self.getAppWidgetName());
                }
            });

            self.insertNavTable(subList.getBase(), self.tr("Data"));

            self.createGraphicsInterface();

            self.tableRecords = self.tableParent.getAllRecords();
            var columnsArray = self.tableParent.table.getTableColumnModel().getVisibleColumns();
            var columns = qx.lang.Array.clone(columnsArray);
            var funcSort = function (a, b) {
                return a - b;
            };
            columns.sort(funcSort);

            for (var i = 0; i < columns.length; i++) {
                var model = self.tableParent.table.getTableModel().getColumnName(columns[i]).replace("<b style='color:red'>*</b>", "");
                model = model.replace(/<div id='div_[0-9][0-9]{0,3}' color='[#a-zA-Z0-9]*'><.div>/gi, "");
                var idCol = self.tableParent.table.getTableModel().getColumnId(columns[i]);
                var type = self.tableParent.getColumnTypeFromId(idCol);
                var data = {};
                data["columnId"] = idCol;
                data["model"] = model;
                data["id"] = columns[i];
                data["typeColumn"] = type;
                var item = new qxnw.widgets.listItem(model);
                item.setModel(data);
                camposDisponiblesList.add(item);
            }
        },
        orderListByMonths: function orderListByMonths() {
            var self = this;

            var records = self.subList.getAllRecords();
            var valChildren = self.getListValues("valores");
            if (typeof valChildren === 'undefined') {
                return;
            }
            var cube = new qxnw.cube();
            var arr = cube.orderListByMonths(records);

            if (typeof arr === 'undefined' || arr === false) {
                self.subList.ui.order_months.setValue(false);
                qxnw.local.removeByKey(self.getAppWidgetName() + "_orderByMonth_" + self.getAppWidgetName());
                return;
            }
            self.graphicInterface.startGraphic(self, arr, "bars", self.__colsSubList, valChildren);

            qxnw.local.setData(self.subList.getAppWidgetName() + "_list_sorted", null);

            self.subList.model.sortByColumn(null, null);

            self.subList.setModelData(arr);
            qxnw.local.setData(self.getAppWidgetName() + "_orderByMonth_" + self.getAppWidgetName(), true);
        },
        orderListByMonthsOld: function orderListByMonthsOld() {
            var self = this;
            var records = self.subList.getAllRecords();
            var lastItem = records.pop();
            var arr = [];
            var months = ["ENERO", "FEBRERO", "MARZO", "ABRIL", "MAYO", "JUNIO", "JULIO", "AGOSTO", "SEPTIEMBRE", "OCTUBRE", "NOVIEMBRE", "DICIEMBRE"];
            var isArrayOfMonths = true;
            for (var ia = 0; ia < months.length; ia++) {
                var m = months[ia];
                for (var i = 0; i < records.length; i++) {
                    var v = records[i];
                    if (months.indexOf(v.label.toUpperCase()) == -1) {
                        isArrayOfMonths = false;
                        break;
                    }
                    var va = {};
                    var keys = Object.keys(v);
                    if (m == v.label.toUpperCase()) {
                        for (var ib = 0; ib < keys.length; ib++) {
                            va[keys[ib]] = v[keys[ib]];
                        }
                        va.level = 0;
                        arr.push(va);
                    }
                }
            }
            if (isArrayOfMonths == false) {
                qxnw.local.removeByKey(self.getAppWidgetName() + "_orderByMonth_" + self.getAppWidgetName());
                self.subList.ui.order_months.setValue(false);
                qxnw.utils.information(self.tr("La información del listado no es apta para el ordenamiento seleccionado"));
                return;
            }
            var valChildren = self.getListValues("valores");
            self.graphicInterface.startGraphic(self, arr, "bars", self.__colsSubList, valChildren);
            arr.push(lastItem);
            self.subList.setModelData(arr);
        },
        changeItemType: function changeItemType(item, type) {
            var self = this;
            var saved = qxnw.local.getData("dynamic_table_" + self.__parentName + "_values");
            if (saved != null) {
                for (var i = 0; i < saved.length; i++) {
                    if (saved[i]["model"] == item["model"]) {
                        saved[i]["type"] = type;
                    }
                }
                qxnw.local.storeData("dynamic_table_" + self.__parentName + "_values", saved);
            }
        },
        saveItem: function saveItem(item, type) {
            var self = this;
            var saved = qxnw.local.getData("dynamic_table_" + self.__parentName + "_" + type);
            if (saved != null) {
                var finded = false;
                for (var i = 0; i < saved.length; i++) {
                    if (saved[i]["model"] == item["model"]) {
                        finded = true;
                    }
                }
                if (!finded) {
                    saved.push(item);
                }
            } else {
                saved = [];
                saved.push(item);
            }
            qxnw.local.storeData("dynamic_table_" + self.__parentName + "_" + type, saved);
        },
        transferFilters: function transferFilters() {
            this.__transferFilters = true;
        },
        createFiltersContainer: function createFiltersContainer() {
            var self = this;
            var filtersContainer = new qx.ui.container.Composite(new qx.ui.layout.VBox());
            self.filtersChartContainer = filtersContainer;
            var group = new qx.ui.groupbox.GroupBox(self.tr("Filtros disponibles"), qxnw.config.execIcon("format-text-direction-ltr")).set({
                contentPadding: 2
            });
            group.setLayout(new qx.ui.layout.HBox().set({
                spacing: 10
            }));

            if (self.__transferFilters == true) {
                var clone = self.tableParent.containerFilters;
                group.add(clone);
            } else {
                var f = self.tableParent.getFiltersData();
                var excludeFilters = ["nw_color_filter", "count", "export", "page", "part", "rowHeight", "sort", "sorted", "sorted_method", "sorted_metdot", "sorted_name", "subfilters"];
                var counter = 0;
                for (var d in f) {
                    if (excludeFilters.indexOf(d) == -1 && f[d] != null) {
                        if (f[d] != "") {
                            if (d.indexOf("_label") == -1) {
                                if (d.indexOf("_array") == -1) {
                                    if (d.indexOf("_text") == -1) {
                                        var added = f[d];
                                        if (typeof f[d + "_array_all"] != 'undefined') {
                                            var html = "";
                                            for (var ia = 0; ia < f[d + "_array_all"].length; ia++) {
                                                var va = f[d + "_array_all"][ia];
                                                html += va["nombre"];
                                                html += "<br />";
                                            }
                                            added = html;
                                        }
                                        var l = new qx.ui.basic.Label("<b>" + qxnw.utils.ucFirst(d).replace("_", " ") + "</b>: " + added).set({
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
            }

            group.add(new qx.ui.core.Spacer(), {
                flex: 1
            });

            if (counter == 0) {
                var l = new qx.ui.basic.Label(self.tr("No hay filtros disponibles"));
                group.add(l);
            }
            var rec = self.tableParent.getAllRecords().length;
            var l1 = new qx.ui.basic.Label("<b>Registros <br />seleccionados: </b>" + rec.toString()).set({
                rich: true
            });
            var l2 = new qx.ui.basic.Label("<b>Total <br />registros: </b>" + self.tableParent.getTotalListRecords().toString()).set({
                rich: true
            });

            group.add(l1);
            group.add(l2);

            if (this.__transferFilters == true) {
                var l3 = new qx.ui.basic.Label("<b>Número máximo <br />de registros por <br />consulta: </b>").set({
                    rich: true
                });
                group.add(l3);
                group.add(self.tableParent.maxRows);
            }
            filtersContainer.add(group);
            return filtersContainer;
        },
        createGraphicsInterface: function createGraphicsInterface() {
            var self = this;
            self.graphicInterface = new qxnw.dynamicTable.f_graphicAdvanced("f_graphicAdvanced");
            self.graphicInterface.setParentName(self.__parentName);
            self.graphicInterface.setParentInit(self);
            self.graphicInterface.setUserData("interfaceType", "GRAPHIC");
            self.insertNavTable(self.graphicInterface, self.tr("Gráfico"));
            self.getTabView().addListener("changeSelection", function (e) {
                var d = e.getData();
                var rta = d[0].getLabel().toString();
                qxnw.local.storeData("dynamic_table_" + self.__parentName + "_interface_type", rta);
            });
        },
        checkAndGetFila: function checkAndGetFila() {
            var self = this;
            var filaRotulos = self.filaRotulosList.getChildren();
            if (typeof filaRotulos == 'undefined') {
                return false;
            }
            if (filaRotulos.length > 1) {
                return false;
            }
            if (filaRotulos.length < 1) {
                return false;
            }
            if (filaRotulos.length == 1) {
                var rta = filaRotulos[0].getModel();
                if (typeof rta["model"] == 'undefined') {
                    return false;
                }
                if (rta["model"] == '') {
                    return false;
                }
                return rta["model"];
            }
        },
        checkAndGetColumna: function checkAndGetColumna() {
            var self = this;
            var filaRotulos = self.columnaRotulosList.getChildren();
            if (typeof filaRotulos == 'undefined') {
                return false;
            }
            if (filaRotulos.length > 1) {
                return false;
            }
            if (filaRotulos.length < 1) {
                return false;
            }
            if (filaRotulos.length == 1) {
                var rta = filaRotulos[0].getModel();
                if (typeof rta["model"] == 'undefined') {
                    return false;
                }
                if (rta["model"] == '') {
                    return false;
                }
                return rta["model"];
            }
        },
        checkAndGetValue: function checkAndGetValue() {
            var self = this;
            var filaRotulos = self.valoresList.getChildren();
            if (typeof filaRotulos === 'undefined') {
                return false;
            }
            if (filaRotulos.length > 1) {
                return false;
            }
            if (filaRotulos.length < 1) {
                return false;
            }
            if (filaRotulos.length == 1) {
                var rta = filaRotulos[0].getModel();
                if (typeof rta["model"] == 'undefined') {
                    return false;
                }
                if (rta["model"] == '') {
                    return false;
                }
                return rta["model"];
            }
        },
        getListValues: function getListValues(type) {
            var self = this;
            var arr = [];
            switch (type) {
                case "valores":
                    var valChildren = self.valoresList.getChildren();
                    for (var i = 0; i < valChildren.length; i++) {
                        var zmod = valChildren[i].getModel();
                        zmod.type = valChildren[i].getUserData("type");
                        arr.push(zmod);
                    }
                    return arr;
                    break;
                case "filas":
                    var valChildren = self.filaRotulosList.getChildren();
                    for (var i = 0; i < valChildren.length; i++) {
                        var zmod = valChildren[i].getModel();
                        arr.push(zmod);
                    }
                    return arr;
                    break;
                case "columnas":
                    var valChildren = self.columnaRotulosList.getChildren();
                    for (var i = 0; i < valChildren.length; i++) {
                        var zmod = valChildren[i].getModel();
                        arr.push(zmod);
                        return arr;
                    }
                    break;

                default:

                    break;
            }
        },
        processDynamicTable: function processDynamicTable() {
            var self = this;
            var valChildren = self.getListValues("valores");
            var filaRotulos = self.getListValues("filas");
            var filaColumnas = self.getListValues("columnas");
            var tableRecords = self.tableParent.getAllRecords();

            var cube = new qxnw.cube();
            var data = cube.generateDynamicTable(valChildren, filaRotulos, filaColumnas, tableRecords);
            if (typeof data === 'undefined') {
                return;
            }
            data["normalCols"] = data["normalCols"].toArray();

            self.subList.setColumns(data["normalCols"]);

            var tableModel = self.subList.table.getTableModel();
            tableModel.setColumnSortable(1, false);
            tableModel.addListener("sorted", function (e) {
                var dat = e.getData();

                function isNumeric(n) {
                    return !isNaN(parseFloat(n)) && isFinite(n);
                }

                if (dat.columnIndex !== null && dat.columnIndex === 0) {
                    var n = self.getAppWidgetName() + "_orderByMonth_" + self.getAppWidgetName();
                    qxnw.local.setData(n, null);
                    self.subList.ui.order_months.setValue(false);
                    if (dat.ascending) {

                        function compareNumbers(a, b) {

                            a.label = qxnw.utils.cleanHtml(a.label);
                            b.label = qxnw.utils.cleanHtml(b.label);
                            a.label = a.label.replace('%', '');
                            b.label = b.label.replace('%', '');

                            var aIsNumber = false;
                            var bIsNumber = false;
                            if (+a.label === +a.label) {
                                aIsNumber = true;
                            }
                            if (+b.label === +b.label) {
                                bIsNumber = true;
                            }
                            if (aIsNumber === true && bIsNumber === true) {
                                return a.label - b.label;
                            }
                            if (typeof a.label === 'number' && typeof b.label === 'string') {
                                return -1;
                            }
                            if (typeof a.label === 'string' && typeof b.label === 'number') {
                                return 1;
                            }
                            if (typeof a.label === 'string' && typeof b.label === 'string') {
                                if (a.label < b.label)
                                    return -1;
                                else
                                    return 1;
                            }
                            return 0;
                        }

                        data["finalArray"].sort(compareNumbers);
                    } else {

                        function compareNumbers(a, b) {

                            a.label = qxnw.utils.cleanHtml(a.label);
                            b.label = qxnw.utils.cleanHtml(b.label);
                            a.label = a.label.replace('%', '');
                            b.label = b.label.replace('%', '');

                            var aIsNumber = false;
                            var bIsNumber = false;
                            if (+a.label === +a.label) {
                                aIsNumber = true;
                            }
                            if (+b.label === +b.label) {
                                bIsNumber = true;
                            }
                            if (aIsNumber === true && bIsNumber === true) {
                                return b.label - a.label;
                            }
                            if (typeof a.label === 'number' && typeof b.label === 'string') {
                                return -1;
                            }
                            if (typeof a.label === 'string' && typeof b.label === 'number') {
                                return 1;
                            }
                            if (typeof a.label === 'string' && typeof b.label === 'string') {
                                if (a.label > b.label)
                                    return -1;
                                else
                                    return 1;
                            }
                            return 0;
                        }

                        data["finalArray"].sort(compareNumbers);
                    }
                    self.graphicInterface.startGraphic(self, data["finalArray"], "bars", data["cols"], valChildren);
                }
            });

            for (var izz = 0; izz < data["normalCols"].length; izz++) {
                self.subList.table.setColumnWidth(izz, 200);
            }
            self.__colsSubList = data["cols"];
            self.graphicInterface.startGraphic(self, data["finalArray"], "bars", data["cols"], valChildren);
            self.subList.onlyPopulate(data["finalArray"]);
            self.subList.populateTotalColumns();

            var n = self.getAppWidgetName() + "_orderByMonth_" + self.getAppWidgetName();
            var savedOrder = qxnw.local.getData(n);
            if (typeof savedOrder !== 'undefined' && savedOrder !== null) {
                self.subList.ui.order_months.setValue(savedOrder);
                self.orderListByMonths();
            } else {
                self.subList.ui.order_months.setValue(false);
            }

            var total = "";
            total += data["total"]["label"];
            total += ": ";
            if (data["cols"][0]["type"] === "money") {
                total += qxnw.utils.formatDecimalCurrency(data["total"]["value"]);
            } else {
                total += data["total"]["value"];
            }
            self.addFooterNoteReplace(total, false);
        },
        generateDynamicTable: function generateDynamicTable(valChildren, filaRotulos, filaColumnas, tableRecords) {
            var self = this;

            self.tableRecords = tableRecords;

            var cols = [
                {
                    name: "label",
                    caption: "label",
                    label: self.tr("Rótulos de fila"),
                    type: "html",
                    sortable: true
                }
            ];

            self.getCols(cols, filaColumnas);

            self.__colsSubList = cols;

            if (self.valoresList == null) {
                return;
            }
//            var valChildren = self.valoresList.getChildren();
//            self.tableParent.table.getTableModel().sortByColumn(0, true);

            var lastType = "COUNT";
            var lastCaption = "";
            var lastTypeColumn = "";

            for (var za = 0; za < valChildren.length; za++) {
                var zmod = valChildren[za];
//                var zmod = valChildren[za].getModel();
//                var valChildrenType = valChildren[za].getUserData("type");
//                console.log("zmod", zmod);
//                console.log("valChildrenType", valChildrenType);
                var zz = [];
                zz["name"] = zmod["columnId"];
                zz["caption"] = zmod["columnId"];
                zz["columnId"] = zmod["columnId"];
                zz["model"] = zmod["label"];
                zz["id"] = za;
                if (cols.length > 1) {
                    zz["noEnter"] = true;
                }
                if (zmod["typeColumn"] === "money" || zmod["typeColumn"] === "dateField") {
                    zz["type"] = zmod["typeColumn"];
                }
                if (zmod["type"] === "SUM") {
                    zz["label"] = "Suma de " + zmod["model"];
                    zz["typeColumn"] = "SUM";
                } else if (zmod["type"] === "COUNT") {
                    zz["label"] = "Cuenta de " + zmod["model"];
                    zz["typeColumn"] = "COUNT";
                    zz["type"] = "";
                } else if (zmod["type"] === "ABSO") {
                    zz["label"] = "Valor absoluto de " + zmod["model"];
                    zz["typeColumn"] = "ABSO";
                } else if (zmod["type"] === "PROM") {
                    zz["label"] = "Promedio de " + zmod["model"];
                    zz["typeColumn"] = "PROM";
                    zz["type"] = "prom";
                } else if (zmod["type"] === "PERCEN") {
                    zz["label"] = "Porcentaje de " + zmod["model"];
                    zz["typeColumn"] = "PERCEN";
                    zz["type"] = "";
                    zz["typeAlter"] = "percent";
                }
                cols.push(zz);
                lastType = zz["typeColumn"];
                lastCaption = zz["columnId"];
                lastTypeColumn = typeof zz["typeAlter"] != 'undefined' ? zz["typeAlter"] : zz["type"];
                if (typeof zz["typeAlter"] != '') {
                    delete zz["typeAlter"];
                }
            }

            for (var za = 0; za < cols.length; za++) {
                if (typeof cols[za].metaColumn != 'undefined') {
                    cols[za].typeColumn = lastType;
                    cols[za].valCaption = lastCaption;
                    cols[za].type = lastTypeColumn;
                }
            }

            self.subList.setColumns(cols);

            for (var izz = 0; izz < cols.length; izz++) {
                self.subList.table.setColumnWidth(izz, 200);
            }

//            var filaRotulos = self.filaRotulosList.getChildren();
            if (typeof filaRotulos[0] === 'undefined') {
                return;
            }

            var finalArray = [];
            var newArray = [];
            var saveSearch = [];
            var alterArray = [];

            var qxdata = new qx.data.Array();

            var oldRotulo = null;
            var record = null;
            var oldValue = null;

            cols.shift();

            for (var ia = 0; ia < filaRotulos.length; ia++) {

                newArray = [];

                var filaRotulosModel = filaRotulos[ia];
                var rotulo = filaRotulosModel["columnId"];
                var sort = filaRotulosModel["id"];

                if (ia == 0) {
                    //TODO: cambiar a ordenamiento del array y no de la tabla IMPORTANTE!!!
                    //self.tableParent.table.getTableModel().sortByColumn(parseInt(sort), true);
                    self.tableRecords.sort((a, b) => (a[rotulo] > b[rotulo] ? 1 : -1));
                }

                var countHaveIn = 0;
                var countHaveInDeep = 0;
                for (var i = 0; i < self.tableRecords.length; i++) {

                    record = self.tableRecords[i];

                    if (ia == 0) {
                        if (saveSearch.indexOf(self.tableRecords[i][rotulo]) == -1) {
                            saveSearch.push(self.tableRecords[i][rotulo]);
                            var d = [];
                            d["fila"] = self.tableRecords[i][rotulo];
                            d["label"] = self.tableRecords[i][rotulo];
                            d["row"] = self.tableRecords[i];
                            d["level"] = ia;
                            d["key"] = rotulo;
                            finalArray.push(d);
                            newArray.push(d);
                            qxdata.push(d);
                        }

                        for (var za = 0; za < cols.length; za++) {
                            var tt = cols[za];
                            var type = cols[za].typeColumn;

                            if (typeof d[tt["columnId"]] == 'undefined') {
                                d[tt["columnId"]] = 0;
                            }

                            if (typeof cols[za].metaColumn != 'undefined') {
                                if (type == "COUNT") {
                                    if (self.tableRecords[i][tt["key"]] == tt["label"]) {
                                        d[tt["columnId"]] = d[tt["columnId"]] + 1;
                                    }
                                } else if (type == "SUM") {
                                    if (isNaN(d[tt["columnId"]]) || d[tt["columnId"]] == "") {
                                        d[tt["columnId"]] = 0;
                                    }
                                    if (isNaN(self.tableRecords[i][tt["valCaption"]]) || self.tableRecords[i][tt["valCaption"]] == "") {
                                        self.tableRecords[i][tt["valCaption"]] = 0;
                                    }
                                    if (self.tableRecords[i][tt["key"]] == tt["label"]) {
                                        d[tt["columnId"]] = parseFloat(d[tt["columnId"]]) + parseFloat(self.tableRecords[i][tt["valCaption"]]);
                                    }
                                } else if (type == "PERCEN") {
                                    if (isNaN(d[tt["columnId"]]) || d[tt["columnId"]] == "") {
                                        d[tt["columnId"]] = 0;
                                    }
                                    if (isNaN(self.tableRecords[i][tt["valCaption"]]) || self.tableRecords[i][tt["valCaption"]] == "") {
                                        self.tableRecords[i][tt["valCaption"]] = 0;
                                    }
                                    if (self.tableRecords[i][tt["key"]] == tt["label"]) {
                                        d[tt["columnId"]] = parseFloat(d[tt["columnId"]]) + parseFloat(self.tableRecords[i][tt["valCaption"]]);
                                    }
                                } else if (type == "ABSO") {
                                    if (self.tableRecords[i][tt["key"]] == tt["label"]) {
                                        d[tt["columnId"]] = self.tableRecords[i][tt["valCaption"]].toString();
                                    }
                                } else if (type == "PROM") {
                                    if (oldValue == null) {
                                        oldValue = self.tableRecords[i][rotulo];
                                    }
                                    if (oldValue != self.tableRecords[i][rotulo]) {
                                        countHaveIn = 1;
                                    } else {
                                        countHaveIn++;
                                    }
                                    //INTENTO DE ELIMINAR LOS NAN: POR VERIFICAR FUNCIONALIDAD
                                    d[tt["columnId"] + "_counter"] = countHaveIn;
                                    if (isNaN(d[tt["columnId"]]) || d[tt["columnId"]] == "") {
                                        d[tt["columnId"]] = 0;
                                    }
                                    if (isNaN(self.tableRecords[i][tt["valCaption"]]) || self.tableRecords[i][tt["columnId"]] == "") {
                                        self.tableRecords[i][tt["valCaption"]] = 0;
                                    }
                                    d[tt["columnId"]] = parseFloat(d[tt["columnId"]]) + parseFloat(self.tableRecords[i][tt["valCaption"]]);
                                    oldValue = self.tableRecords[i][rotulo];
                                }
                            } else {
                                if (type == "COUNT") {
                                    d[tt["columnId"]] = d[tt["columnId"]] + 1;
                                } else if (type == "SUM") {
                                    //INTENTO DE ELIMINAR LOS NAN: POR VERIFICAR FUNCIONALIDAD
                                    if (isNaN(d[tt["columnId"]]) || d[tt["columnId"]] == "") {
                                        d[tt["columnId"]] = 0;
                                    }
                                    if (isNaN(self.tableRecords[i][tt["columnId"]]) || self.tableRecords[i][tt["columnId"]] == "") {
                                        self.tableRecords[i][tt["columnId"]] = 0;
                                    }
                                    d[tt["columnId"]] = parseFloat(d[tt["columnId"]]) + parseFloat(self.tableRecords[i][tt["columnId"]]);
                                } else if (type == "PERCEN") {
                                    //INTENTO DE ELIMINAR LOS NAN: POR VERIFICAR FUNCIONALIDAD
                                    if (isNaN(d[tt["columnId"]]) || d[tt["columnId"]] == "") {
                                        d[tt["columnId"]] = 0;
                                    }
                                    if (isNaN(self.tableRecords[i][tt["columnId"]]) || self.tableRecords[i][tt["columnId"]] == "") {
                                        self.tableRecords[i][tt["columnId"]] = 0;
                                    }
                                    d[tt["columnId"]] = parseFloat(d[tt["columnId"]]) + parseFloat(self.tableRecords[i][tt["columnId"]]);
                                } else if (type == "ABSO") {
                                    d[tt["columnId"]] = self.tableRecords[i][tt["columnId"]].toString();
                                } else if (type == "PROM") {
                                    if (oldValue == null) {
                                        oldValue = self.tableRecords[i][rotulo];
                                    }
                                    if (oldValue != self.tableRecords[i][rotulo]) {
                                        countHaveIn = 1;
                                    } else {
                                        countHaveIn++;
                                    }
                                    //INTENTO DE ELIMINAR LOS NAN: POR VERIFICAR FUNCIONALIDAD
                                    d[tt["columnId"] + "_counter"] = countHaveIn;
                                    if (isNaN(d[tt["columnId"]]) || d[tt["columnId"]] == "") {
                                        d[tt["columnId"]] = 0;
                                    }
                                    if (isNaN(self.tableRecords[i][tt["columnId"]]) || self.tableRecords[i][tt["columnId"]] == "") {
                                        self.tableRecords[i][tt["columnId"]] = 0;
                                    }
                                    d[tt["columnId"]] = parseFloat(d[tt["columnId"]]) + parseFloat(self.tableRecords[i][tt["columnId"]]);
                                    oldValue = self.tableRecords[i][rotulo];
                                }
                            }
                        }
                    } else {
                        var lastItem = null;
                        var oldKey = "";
                        for (var il = 0; il < qxdata.length; il++) {
                            var item = qxdata.getItem(il);
                            var sumItem = 0;
                            oldKey = "";
                            var haveIn = false;
                            if (item["level"] == (ia - 1)) {
                                for (var rr = ia; rr > 0; rr--) {
                                    var inde = il - sumItem;
                                    if (inde < 0) {
                                        inde = 0;
                                    }
                                    var lastItem = qxdata.getItem(inde);
                                    while (lastItem["level"] == item["level"] && rr != ia) {
                                        lastItem = qxdata.getItem(inde - sumItem);
                                        sumItem++;
                                    }
                                    if (lastItem["level"] < ia) {
                                        if (record[lastItem["key"]] == lastItem["fila"] && lastItem["fila"] != record[rotulo]) {
                                            oldKey = oldKey + lastItem["fila"] + record[rotulo];
                                            haveIn = true;
                                        } else {
                                            haveIn = false;
                                            break;
                                        }
                                    } else {
                                        break;
                                    }
                                    sumItem++;
                                }
                            }
                            if (haveIn) {
                                var d = [];
                                if (saveSearch.indexOf(oldKey) == -1) {
                                    saveSearch.push(oldKey);
                                    d["fila"] = record[rotulo];
                                    d["label"] = new Array(ia + 1).join("&nbsp;&nbsp;&nbsp;&nbsp;") + record[rotulo];
                                    d["row"] = record;
                                    d["level"] = ia;
                                    d["parent"] = oldRotulo;
                                    d["key"] = rotulo;
                                    d["oldkey"] = oldKey;
                                    finalArray.push(d);
                                    newArray.push(d);
                                    qxdata.insertAfter(item, d);
                                }
                                for (var za = 0; za < cols.length; za++) {
                                    var tt = cols[za];
                                    var type = cols[za].typeColumn;

                                    if (typeof alterArray[oldKey] == 'undefined') {
                                        alterArray[oldKey] = [];
                                    }
                                    if (typeof alterArray[oldKey][tt["columnId"]] == 'undefined') {
                                        alterArray[oldKey][tt["columnId"]] = 0;
                                    }
                                    if (typeof alterArray[oldKey][record[rotulo]] == 'undefined') {
                                        alterArray[oldKey][rotulo] = record[rotulo];
                                    }

                                    if (typeof cols[za].metaColumn != 'undefined') {
                                        if (type == "COUNT") {
                                            if (record[tt["key"]] == tt["label"]) {
                                                alterArray[oldKey][tt["columnId"]] = parseFloat(alterArray[oldKey][tt["columnId"]]) + 1;
                                            }
                                        } else if (type == "SUM") {
                                            if (record[tt["key"]] == tt["label"]) {
                                                alterArray[oldKey][tt["columnId"]] = parseFloat(alterArray[oldKey][tt["columnId"]]) + parseFloat(record[tt["valCaption"]]);
                                            }
                                        } else if (type == "ABSO") {
                                            alterArray[oldKey][tt["columnId"]] = "";
                                        } else if (type == "PROM") {
                                            if (oldValue == null) {
                                                oldValue = self.tableRecords[i][rotulo];
                                            }
                                            if (oldValue != self.tableRecords[i][rotulo]) {
                                                countHaveInDeep = 1;
                                            } else {
                                                countHaveInDeep++;
                                            }
                                            if (record[tt["key"]] == tt["label"]) {
                                                d[tt["columnId"] + "_counter"] = countHaveInDeep;
                                                alterArray[oldKey][tt["columnId"]] = (parseFloat(alterArray[oldKey][tt["columnId"]]) + parseFloat(record[tt["valCaption"]]) / countHaveIn);
                                                oldValue = self.tableRecords[i][rotulo];
                                            }
                                        }
                                    } else {
                                        if (type == "COUNT") {
                                            alterArray[oldKey][tt["columnId"]] = parseFloat(alterArray[oldKey][tt["columnId"]]) + 1;
                                        } else if (type == "SUM") {
                                            alterArray[oldKey][tt["columnId"]] = parseFloat(alterArray[oldKey][tt["columnId"]]) + parseFloat(record[tt["columnId"]]);
                                        } else if (type == "ABSO") {
                                            alterArray[oldKey][tt["columnId"]] = "";
                                        } else if (type == "PROM") {
                                            if (oldValue == null) {
                                                oldValue = self.tableRecords[i][rotulo];
                                            }
                                            if (oldValue != self.tableRecords[i][rotulo]) {
                                                countHaveInDeep = 1;
                                            } else {
                                                countHaveInDeep++;
                                            }
                                            d[tt["columnId"] + "_counter"] = countHaveInDeep;
                                            alterArray[oldKey][tt["columnId"]] = (parseFloat(alterArray[oldKey][tt["columnId"]]) + parseFloat(record[tt["columnId"]]) / countHaveIn);
                                            oldValue = self.tableRecords[i][rotulo];
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }

            finalArray = qxdata.toArray();
            var totalValue = {};

            //RECORRIDO VALORES
            for (var za = 0; za < cols.length; za++) {

                var tt = cols[za];
                var type = cols[za].typeColumn;

                for (var i = 0; i < finalArray.length; i++) {

                    if (finalArray[i]["level"] == 0) {
                        if (typeof totalValue[tt["columnId"]] == 'undefined') {
                            totalValue[tt["columnId"]] = 0;
                        }
                        if (type == "PROM") {
                            totalValue[tt["columnId"]] = totalValue[tt["columnId"]] + finalArray[i][tt["columnId"]];
                            finalArray[i][tt["columnId"]] = parseFloat(finalArray[i][tt["columnId"]]) / finalArray[i][tt["columnId"] + "_counter"];
                        } else if (type == "PERCEN") {
                            //totalValue[tt["columnId"]] = totalValue[tt["columnId"]] + finalArray[i][tt["columnId"]];
                            if (finalArray[i][tt["columnId"]] > 0) {
                                totalValue[tt["columnId"]] = totalValue[tt["columnId"]] + finalArray[i][tt["columnId"]];
                                if (typeof tt.model == 'undefined') {
                                    continue;
                                }
                                finalArray[i][tt["columnId"]] = finalArray[i][tt["columnId"]] / finalArray[i][tt["valCaption"]] * 100;
                            }
                        } else if (type == "ABSO") {
                            totalValue[tt["columnId"]] = "";
                        } else {
                            totalValue[tt["columnId"]] = totalValue[tt["columnId"]] + finalArray[i][tt["columnId"]];
                        }
                    } else {
                        for (var di in alterArray) {
                            if (di == finalArray[i]["oldkey"]) {
                                if (type == "PROM") {
                                    finalArray[i][tt["columnId"]] = alterArray[di][tt["columnId"] + "_counter"];
                                } else if (type == "PERCEN") {
                                    finalArray[i][tt["columnId"]] = alterArray[di][tt["columnId"] + "_counter"];
                                } else {
                                    finalArray[i][tt["columnId"]] = alterArray[di][tt["columnId"]];
                                }
                            }
                        }
                    }
                }
            }

            var total = [];
            total["fila"] = "<b>Total General</b>";
            total["label"] = "<b>Total General</b>";
            for (var za = 0; za < cols.length; za++) {
                tt = cols[za];
                var type = cols[za].typeColumn;
                if (type == "PROM") {
                    total[tt["columnId"]] = totalValue[tt["columnId"]] / self.tableRecords.length;
                } else if (type == "PERCEN") {
                    total[tt["columnId"]] = totalValue[tt["columnId"]];
                    if (typeof tt.model == 'undefined') {
                        continue;
                    }
                    total[tt["columnId"]] = total[tt["columnId"]] / totalValue[tt["valCaption"]] * 100;
                } else {
                    total[tt["columnId"]] = totalValue[tt["columnId"]];
                }
            }

            var rta = {};
            rta["finalArray"] = finalArray;
            rta["cols"] = cols;
            rta["total"] = total;
            var valChildren = self.getListValues("valores");
            self.graphicInterface.startGraphic(self, finalArray, "bars", cols, valChildren);
            finalArray.push(total);
            self.subList.onlyPopulate(finalArray);
            self.subList.populateTotalColumns();
            return rta;
        },
        getCols: function getCols(finalArray, filaRotulos) {
            var self = this;

            var saveSearch = [];
            var record = null;

            var qxdata = new qx.data.Array();

            if (self.columnaRotulosList == null) {
                return;
            }

//            var filaRotulos = self.columnaRotulosList.getChildren();

            for (var ia = 0; ia < filaRotulos.length; ia++) {

                var filaRotulosModel = filaRotulos[ia];
//                var filaRotulosModel = filaRotulos[ia].getModel();
                var rotulo = filaRotulosModel["columnId"];
                var sort = filaRotulosModel["id"];

                if (ia == 0) {
                    //self.tableParent.table.getTableModel().sortByColumn(parseInt(sort), true);
                    self.sortByColumn(self.tableRecords, parseInt(sort), true);
                }

                for (var i = 0; i < self.tableRecords.length; i++) {

                    record = self.tableRecords[i];

                    if (ia == 0) {
                        if (saveSearch.indexOf(self.tableRecords[i][rotulo]) == -1) {
                            saveSearch.push(self.tableRecords[i][rotulo]);
                            var d = [];
                            d["fila"] = self.tableRecords[i][rotulo];
                            d["label"] = self.tableRecords[i][rotulo];
                            d["model"] = self.tableRecords[i][rotulo];
                            d["row"] = self.tableRecords[i];
                            d["level"] = ia;
                            d["key"] = rotulo;
                            d["caption"] = self.tableRecords[i][rotulo];
                            d["columnId"] = self.tableRecords[i][rotulo];
                            d["typeColumn"] = "COUNT";
                            d["id"] = 1;
                            d["metaColumn"] = "column";
                            finalArray.push(d);
                        }
                    } else {
                        var lastItem = null;
                        var oldKey = "";
                        for (var il = 0; il < qxdata.length; il++) {
                            var item = qxdata.getItem(il);
                            var sumItem = 0;
                            oldKey = "";
                            var haveIn = false;
                            if (item["level"] == (ia - 1)) {
                                for (var rr = ia; rr > 0; rr--) {
                                    var inde = il - sumItem;
                                    if (inde < 0) {
                                        inde = 0;
                                    }
                                    var lastItem = qxdata.getItem(inde);
                                    while (lastItem["level"] == item["level"] && rr != ia) {
                                        lastItem = qxdata.getItem(inde - sumItem);
                                        sumItem++;
                                    }
                                    if (lastItem["level"] < ia) {
                                        if (record[lastItem["key"]] == lastItem["fila"] && lastItem["fila"] != record[rotulo]) {
                                            oldKey = oldKey + lastItem["fila"] + record[rotulo];
                                            haveIn = true;
                                        } else {
                                            haveIn = false;
                                            break;
                                        }
                                    } else {
                                        break;
                                    }
                                    sumItem++;
                                }
                            }
                            if (haveIn) {
                                var d = [];
                                if (saveSearch.indexOf(oldKey) == -1) {
                                    saveSearch.push(oldKey);
                                    d["fila"] = record[rotulo];
                                    d["label"] = new Array(ia + 1).join("&nbsp;&nbsp;&nbsp;&nbsp;") + record[rotulo];
                                    d["model"] = new Array(ia + 1).join("&nbsp;&nbsp;&nbsp;&nbsp;") + record[rotulo];
                                    d["row"] = record;
                                    d["level"] = ia;
                                    d["key"] = rotulo;
                                    d["caption"] = rotulo;
                                    d["columnId"] = rotulo;
                                    d["oldkey"] = oldKey;
                                    d["typeColumn"] = "SUM";
                                    finalArray.push(d);
                                    qxdata.insertAfter(item, d);
                                }
                            }
                        }
                    }
                }
            }
            return finalArray;
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
            var promButton = new qx.ui.menu.Button(self.tr("Promedio"), qxnw.config.execIcon("format-indent-less"));
            promButton.setUserData("type", "PROM");
            var absoButton = new qx.ui.menu.Button(self.tr("Valor absoluto"), qxnw.config.execIcon("check-spelling"));
            absoButton.setUserData("type", "ABSO");
            var percenButton = new qx.ui.menu.Button(self.tr("Porcentaje (disponible si hay columnas)"), qxnw.config.execIcon("office-chart", "apps"));
            percenButton.setUserData("type", "PERCEN");

            quitButton.addListener("execute", function (e) {
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
                        var lbl = items[0].getLabel();
                        lbl = lbl.replace("Cuenta de", "");
                        lbl = lbl.replace("Suma de", "");
                        items[0].setLabel(lbl);
                        self.camposDisponiblesList.addBefore(items[0], children[i]);
                        break;
                    }
                    if (i + 1 == children.length) {
                        var lbl = items[0].getLabel();
                        lbl = lbl.replace("Cuenta de", "");
                        lbl = lbl.replace("Suma de", "");
                        items[0].setLabel(lbl);
                        self.camposDisponiblesList.addAfter(items[0], children[i]);
                    }
                }
                self.removeSavedSettings(modItem, "values");
                self.processDynamicTable();
            });
            countButton.addListener("execute", function (e) {
                var ot = e.getTarget();
                var menuType = ot.getUserData("type");
                var tar = self.valoresList.getSelection();
                var selectionType = tar[0].getUserData("type");
                if (menuType != selectionType) {
                    tar[0].setLabel("Cuenta de " + tar[0].getModel()["model"]);
                    tar[0].setUserData("type", "COUNT");
                    self.changeItemType(tar[0].getModel(), "COUNT");
                    self.processDynamicTable();
                }
            });
            sumButton.addListener("execute", function (e) {
                var ot = e.getTarget();
                var menuType = ot.getUserData("type");
                var tar = self.valoresList.getSelection();
                if (typeof tar[0] == 'undefined') {
                    qxnw.utils.information(self.tr("Debe seleccionar un item"));
                    return;
                }
                var selectionType = tar[0].getUserData("type");
                if (menuType != selectionType) {
                    tar[0].setLabel("Suma de " + tar[0].getModel()["model"]);
                    tar[0].setUserData("type", "SUM");
                    self.changeItemType(tar[0].getModel(), "SUM");
                    self.processDynamicTable();
                }
            });
            promButton.addListener("execute", function (e) {
                var ot = e.getTarget();
                var menuType = ot.getUserData("type");
                var tar = self.valoresList.getSelection();
                var selectionType = tar[0].getUserData("type");
                if (menuType != selectionType) {
                    tar[0].setLabel("Promedio de " + tar[0].getModel()["model"]);
                    tar[0].setUserData("type", "PROM");
                    self.changeItemType(tar[0].getModel(), "PROM");
                    self.processDynamicTable();
                }
            });
            absoButton.addListener("execute", function (e) {
                var ot = e.getTarget();
                var menuType = ot.getUserData("type");
                var tar = self.valoresList.getSelection();
                var selectionType = tar[0].getUserData("type");
                if (menuType != selectionType) {
                    tar[0].setLabel("Valor absoluto de " + tar[0].getModel()["model"]);
                    tar[0].setUserData("type", "ABSO");
                    self.changeItemType(tar[0].getModel(), "ABSO");
                    self.processDynamicTable();
                }
            });
            percenButton.addListener("execute", function (e) {
                var ot = e.getTarget();
                var menuType = ot.getUserData("type");
                var tar = self.valoresList.getSelection();
                var selectionType = tar[0].getUserData("type");
                if (tar.length > 1) {
                    qxnw.utils.information(self.tr("Para los cálculos por porcentaje debe tener un solo valor"));
                    return;
                }
                if (menuType != selectionType) {
                    tar[0].setLabel("Porcentaje de " + tar[0].getModel()["model"]);
                    tar[0].setUserData("type", "PERCEN");
                    self.changeItemType(tar[0].getModel(), "PERCEN");
                    self.processDynamicTable();
                }
            });

            menu.add(quitButton);
            menu.add(typeButton);

            typeButton.setMenu(subMenu);

            subMenu.add(countButton);
            subMenu.add(sumButton);
            subMenu.add(promButton);
            subMenu.add(absoButton);
            subMenu.add(percenButton);
            return menu;
        },
        sortByColumn: function sortByColumn(array, columnIndex, ascending) {
            var sortNormalMethod = function (row1, row2) {
                try {
                    var a = row1[arguments.callee.columnIndex];
                    var b = row2[arguments.callee.columnIndex];
                    if (typeof a == "string") {
                        a = a.toLowerCase();
                    }
                    if (typeof b == "string") {
                        b = b.toLowerCase();
                    }
                    if (isNaN(a) || isNaN(b)) {
                        if (a > b)
                            return 1;
                        else
                            return -1;
                    }
                } catch (e) {
                    qxnw.utils.error(e, self, 0, false, true);
                }
                return a - b;
            };
            sortNormalMethod.columnIndex = columnIndex;
            array.sort(sortNormalMethod);
        },
        andAddToMainList: function andAddToMainList(item, type) {
            var self = this;
            var children = self.camposDisponiblesList.getChildren();
            var modItem = item.getModel();
            for (var i = 0; i < children.length; i++) {
                var mod = children[i].getModel();
                if (mod["id"] > modItem["id"]) {
                    item.setLabel(item.getLabel().replace("Cuenta de", ""));
                    self.camposDisponiblesList.addBefore(item, children[i]);
                    break;
                }
                if (i + 1 == children.length) {
                    item.setLabel(item.getLabel().replace("Cuenta de", ""));
                    self.camposDisponiblesList.addAfter(item, children[i]);
                }
            }
            if (typeof type != 'undefined' && type != "") {
                self.removeSavedSettings(modItem, type);
            }
            //self.processDynamicTable();
        },
        removeAndRestoreRotulo: function removeAndRestoreRotulo() {
            var self = this;
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
                if (i + 1 == children.length) {
                    items[0].setLabel(items[0].getLabel().replace("Cuenta de", ""));
                    self.camposDisponiblesList.addAfter(items[0], children[i]);
                }
            }
            self.removeSavedSettings(modItem, "rotule");
            var timer = new qx.event.Timer(500);
            timer.start();
            timer.addListener("interval", function (e) {
                this.stop();
                self.processDynamicTable();
            });
        },
        getContextMenuRotulos: function getContextMenuRotulos() {
            var self = this;
            var menu = new qx.ui.menu.Menu;
            var quitButton = new qx.ui.menu.Button(self.tr("Quitar"), qxnw.config.execIcon("dialog-close"));
            quitButton.addListener("execute", function (e) {
                self.removeAndRestoreRotulo();
            });
            menu.add(quitButton);
            return menu;
        },
        getContextMenuColumnas: function getContextMenuColumnas() {
            var self = this;
            var menu = new qx.ui.menu.Menu;
            var quitButton = new qx.ui.menu.Button(self.tr("Quitar"), qxnw.config.execIcon("dialog-close"));
            quitButton.addListener("execute", function (e) {
                var tar = self.columnaRotulosList.getSelection();
                var items = [];
                for (var i = 0; i < tar.length; i++) {
                    items.push(tar[i].clone());
                    self.columnaRotulosList.remove(tar[i]);
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
                    if (i + 1 == children.length) {
                        items[0].setLabel(items[0].getLabel().replace("Cuenta de", ""));
                        self.camposDisponiblesList.addAfter(items[0], children[i]);
                    }
                }
                self.removeSavedSettings(modItem, "columns");
                var timer = new qx.event.Timer(500);
                timer.start();
                timer.addListener("interval", function (e) {
                    this.stop();
                    self.processDynamicTable();
                });
            });
            menu.add(quitButton);
            return menu;
        }
    }
});