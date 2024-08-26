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
qx.Class.define("qxnw.dynamicTable.f_cmi", {
    extend: qxnw.forms,
    construct: function construct(filters) {
        this.base(arguments);
        var self = this;
        self.setTitle(self.tr("Reportes guardados"));
        self.setColumnsFormNumber(1);
        var fields = [
            {
                name: "Cuadro de mando integral",
                type: "startGroup",
                icon: qxnw.config.execIcon(""),
                mode: "horizontal"
            },
            {
                name: "select_cmi",
                label: self.tr("Selecciona el informe"),
                type: "selectBox",
            },
            {
                name: "refresh",
                label: self.tr("Actualiza los informes disponibles"),
                type: "button",
                toolTip: self.tr("Refresca los informes disponibles")
            },
            {
                name: "compare",
                label: self.tr("Comparar con"),
                type: "selectBox",
                toolTip: self.tr("Compare el informe actual con otro periodo")
            },
            {
                "name": "select_checkbox",
                "type": "checkBox",
                "label": self.tr("Predeterminado"),
                toolTip: self.tr("Deje el informe actual seleccionado por defecto cuando abra el módulo de informes")
            },
            {
                name: "",
                type: "endGroup"
            }
        ];
        self.setFields(fields);

        self.ui.refresh.setIcon(qxnw.config.execIcon("view-refresh"));
        self.ui.refresh.setShow("icon");
        self.ui.refresh.setMaxWidth(50);
        self.ui.refresh.addListener("execute", function () {
            self.loadCmiReports();
        });

        var a = [];
        a[""] = self.tr("Seleccione...");
        a["ano_anterior"] = self.tr("Año anterior");
        qxnw.utils.populateSelectFromArray(self.ui.compare, a);
        var containerFields = self.getContainerFields();
        self.setGroupWidth("cuadro_de_mando_integral", 600);
        self.ui.select_cmi.setMaxWidth(200);

        var d = {};
        d[""] = self.tr("Seleccione...");
        self.ui.select_cmi.populateFromArray(d);
        self.ui.select_cmi.addListener("changeValue", function (e) {
            self.cleanFilters();
            self.executeQuery();
            var savedSelectedReport = qxnw.local.getData(self.getAppWidgetName() + "_cmi_selected_report");
            if (typeof savedSelectedReport !== 'undefined' && savedSelectedReport !== null) {
                if (self.__model.select_cmi === savedSelectedReport) {
                    self.ui.select_checkbox.setValue(true);
                    self.selected_cmi = true;
                }
            }
        });

        self.populateSelectCmi(filters);

        self.ui.cancel.setVisibility("excluded");
        self.ui.accept.setVisibility("excluded");

        self.selected_cmi = false;

        self.createGraphicsInterface();

        var subList = new qxnw.lists();
        self.subList = subList;
        subList.setAppWidgetName("qxnw_cmi_list1");
        qxnw.local.setData(subList.getAppWidgetName() + "_list_sorted", null);
        subList.blockHeaderElements();
        subList.setAppWidgetName("DATA_LIST");
        subList.setMaxHeight(200);
        subList.ui.part1.setVisibility("excluded");
        subList.ui.part2.setVisibility("excluded");
        subList.ui.part3.setVisibility("excluded");
        subList.ui.printButton.setVisibility("excluded");
        subList.ui.dynamicTableButton.setVisibility("excluded");
        subList.ui.functionsButton.setVisibility("excluded");
        subList.hideFooterTools();
        subList.setUserData("interfaceType", "DATA");
        self.insertNavTable(subList.getBase(), self.tr("Data"));

        containerFields.add(self.createFiltersContainer(), {
            column: 1,
            row: 0
        });
        self.ui.compare.addListener("changeValue", function (e) {
            self.sd2 = null;
            if (e.getData()) {
                var d = this.getValue();
                if (d.compare === "") {
                    if (self.subList2 !== null) {
                        self.subList2.destroy();
                        self.subList2 = null;
                        self.destroyNavTable(2);
                    }
                    self.cleanCompareTotals();
                    return;
                }
                self.compare(d);
            }
        });
    },
    members: {
        formatDiff: false,
        total1: null,
        total2: null,
        sd2: null,
        subList2: null,
        filtersFooter: null,
        l2: null,
        l3: null,
        l4: null,
        l5: null,
        l6: null,
        groupFiltersC: null,
        __colsSubList: null,
        filtersChartContainer: null,
        graphicInterface: null,
        __model: null,
        __dataSeries: null,
        setDataSeries: function () {
            var self = this;
            if (self.__dataSeries !== null) {
                if (self.l2) {
                    self.l2.destroy();
                }
                self.l2 = new qx.ui.basic.Label("<b>Total registros analizados: </b>" + self.__dataSeries.length.toString()).set({
                    rich: true,
                    alignY: "bottom",
                    alignX: "right"
                });
                self.filtersFooter.addAt(new qx.ui.core.Spacer(20), 0, {
                    flex: 0
                });
                self.filtersFooter.addAt(self.l2, 0, {
                    flex: 0
                });
            }
        },
        cleanCompareTotals: function () {
            var self = this;
            self.l4.destroy();
            self.l5.destroy();
            self.l6.destroy();
        },
        compareTotals: function () {
            var self = this;
            self.total2 = parseInt(self.total2);
            self.total2 = self.total2.toFixed(0);
            var color = "green";
            var diff = self.total1 - self.total2;
            var icon = qxnw.config.execIcon("go-up");
            if (diff < 0) {
                color = "red";
                icon = qxnw.config.execIcon("go-down");
            }
            var percent = (diff / self.total2) * 100;
            diff = diff.toFixed(0);
            percent = percent.toFixed(2);

            var newTotal2 = self.total2;

            if (self.formatDiff) {
                diff = qxnw.utils.formatDecimalCurrency(diff, 0);
                newTotal2 = qxnw.utils.formatDecimalCurrency(newTotal2, 0);
            }
            self.l4 = new qx.ui.basic.Label("<b>Comparación</b>" + ": " + newTotal2 + " ").set({
                rich: true,
                alignY: "bottom",
                alignX: "right"
            });
            self.l5 = new qx.ui.basic.Label("<b style='color: " + color + ";'>Diferencia</b>" + ": " + diff + " ").set({
                rich: true,
                alignY: "bottom",
                alignX: "right"
            });
            self.l6 = new qx.ui.basic.Atom("<b style='color: " + color + ";'>Porcentaje</b>" + ": " + percent + "% ", icon).set({
                rich: true,
                alignY: "bottom",
                alignX: "right"
            });
            if (self.filtersFooter) {
                self.filtersFooter.add(new qx.ui.core.Spacer(20), {
                    flex: 0
                });
                self.filtersFooter.add(self.l4, {
                    flex: 0
                });
                self.filtersFooter.add(new qx.ui.core.Spacer(20), {
                    flex: 0
                });
                self.filtersFooter.add(self.l5, {
                    flex: 0
                });
                self.filtersFooter.add(new qx.ui.core.Spacer(20), {
                    flex: 0
                });
                self.filtersFooter.add(self.l6, {
                    flex: 0
                });
                self.setDataSeries();
            }
        },
        cleanFilters: function () {
            var self = this;
            self.sd2 = null;
            self.formatDiff = false;
            self.selected_cmi = false;
            self.ui.compare.setValue("");
            if (self.subList2 !== null) {
                self.subList2.destroy();
                self.subList2 = null;
                self.destroyNavTable(2);
            }
            self.ui.select_checkbox.setValue(false);
            self.__model = self.ui.select_cmi.getValue();
            if (self.filtersFooter) {
                self.filtersFooter.removeAll();
            }
            if (self.filtersChartContainer) {
                self.filtersChartContainer.removeAll();
            }
        },
        editCmiReports: function editCmiReports(model) {
            var self = this;
            var f = new qxnw.dynamicTable.saveAsCmi();

            if (self.graphicInterface.ui.select_charts) {
                var vr = self.graphicInterface.ui.select_charts.getValue();
                model.select_cmi_model.select_charts = vr.select_charts;
            }

            f.setParamRecord(model.select_cmi_model);
            f.show();
            f.ui.accept.addListener("execute", function () {
                var r = f.getRecord();
                var funcAsy = function () {
                    f.accept();
                    self.cleanFilters();
                    var func = function () {
                        self.ui.select_cmi.setValue(r.id);
                    };
                    self.loadCmiReports(func);
                };
                qxnw.utils.fastAsyncRpcCall("cmi", "saveListAsCmi", r, funcAsy);
            });
        },
        reset: function reset() {
            var self = this;
            if (self.graphicInterface !== null) {
                self.graphicInterface.reset();
            }
            if (self.subList !== null) {
                self.subList.setModelData([]);
                if (self.subList.model !== null) {
                    self.subList.model.setColumns([self.tr("Rótulo"), self.tr("Valor")]);
                }
            }
            if (self.subList2 !== null) {
                self.subList2.destroy();
                self.subList2 = null;
                self.destroyNavTable(2);
            }
        },
        populateSelectCmi: function populateSelectCmi(filters) {
            var self = this;
            for (var i = 0; i < filters.length; i++) {
                var selectItem = new qxnw.widgets.listItem(filters[i].nombre);
                var model = filters[i].id;
                selectItem.setUserData("model_data", filters[i]);
                selectItem.setModel(model);
                self.ui.select_cmi.add(selectItem);
                var savedSelectedReport = qxnw.local.getData(self.getAppWidgetName() + "_cmi_selected_report");
                if (typeof savedSelectedReport !== 'undefined' && savedSelectedReport !== null) {
                    if (model === savedSelectedReport) {
                        self.ui.select_cmi.setSelection([selectItem]);
                        self.ui.select_checkbox.setValue(true);
                        self.selected_cmi = true;
                    }
                }
            }
        },
        loadCmiReports: function loadCmiReports(callback) {
            var self = this;
            var func = function (filters) {
                if (filters && typeof filters.length !== 'undefined' && filters.length > 0) {
                    self.reset();
                    self.ui.select_cmi.removeAll();
                    var d = {};
                    d[""] = self.tr("Seleccione...");
                    self.ui.select_cmi.populateFromArray(d);
                    self.populateSelectCmi(filters);
                    if (callback) {
                        callback();
                    }
                }
            };
            var up = qxnw.userPolicies.getUserData();
            qxnw.utils.fastAsyncRpcCall("cmi", "populateScoreCards", up, func);
        },
        compare: function compare(v) {
            var self = this;
            if (self.sd2 !== null) {
                var tipoGrafico = self.graphicInterface.ui.select_charts.getValue().select_charts;
                self.graphicInterface.addSeriesToGraphic(this, self.sd2, tipoGrafico);
                if (self.total1 !== null && self.total2 !== null) {
                    self.compareTotals();
                }
                return;
            }
            self.executeOnlyQuery(v.compare);
        },
        saveSelectedFilters: function saveSelectedFilters(filters) {
            var self = this;
            var selectedCmi = self.ui.select_cmi.getValue();
            qxnw.local.setData(self.getAppWidgetName() + "_cmi_" + selectedCmi["select_cmi"], filters);
        },
        orderByMonth: function orderByMonth() {
            var self = this;

            var records = self.subList.getAllRecords();
            var valChildren = JSON.parse(self.__model.select_cmi_model.valores);
            var cube = new qxnw.cube();
            var arr = cube.orderListByMonths(records);
            if (arr === false) {
                self.orderLogical(records);
                return;
            }
            var tipoGrafico = self.__model.select_cmi_model.tipo_grafico;
            self.graphicInterface.startGraphic(self, arr, tipoGrafico, self.__colsSubList, valChildren);
            self.subList.setModelData(arr);
            var selectedCmi = self.ui.select_cmi.getValue();
            qxnw.local.setData(self.getAppWidgetName() + "_orderByMonth_" + selectedCmi["select_cmi"], true);
        },
        saveSelectedReport: function saveSelectedReport() {
            var self = this;
            var selectedCmi = self.ui.select_cmi.getValue();
            qxnw.local.setData(self.getAppWidgetName() + "_cmi_selected_report", selectedCmi.select_cmi);
        },
        selectCmi: function selectCmi() {
            var self = this;
            var selectedCmi = self.ui.select_cmi.getValue();
//            var func = function (rta) {
//                console.log(rta);
//            };
//            qxnw.utils.fastAsyncRpcCall("cmi", "selectScoreCard", toSelect, func);
        },
        deleteCmi: function deleteCmi(toDelete) {
            var self = this;
            var selectedCmi = self.ui.select_cmi.getValue();
            qxnw.local.removeByKey(self.getAppWidgetName() + "_cmi_" + selectedCmi["select_cmi"]);
            var func = function (rta) {
                self.loadCmiReports();
            };
            qxnw.utils.fastAsyncRpcCall("cmi", "removeScoreCard", toDelete, func);
        },
        executeQuery: function executeQuery() {
            var self = this;
            var d = {};
            if (self.__model.select_cmi_model === null) {
                return;
            }
            d["id"] = self.__model.select_cmi_model.id;
            var func = function (filters) {
                self.__filtersData = filters;
                d["id"] = self.__model.select_cmi_model.id;
                var up = self.up;
                d["empresa"] = up["company"];
                d["usuario"] = up["user"];
                d["pais"] = up["country"];
                self.loadFilters();
                var f = self.getRecord();
                var filters = [];
                for (var v in f) {
                    if (typeof f[v] === "string") {
                        var da = {};
                        da["clave"] = v;
                        da["valor"] = f[v];
                        filters.push(da);
                    }
                }
                d["filters"] = filters;
                var func = function (r) {
                    self.__dataSeries = r;
                    self.processDynamicTable();
                };
                qxnw.utils.fastAsyncRpcCall("cmi", "executeQuery", d, func);
            };
            qxnw.utils.fastAsyncRpcCall("cmi", "executeFilters", d, func);
        },
        executeOnlyQuery: function executeOnlyQuery(type_comparer) {
            var self = this;
            var d = {};
            if (self.__model.select_cmi_model === null) {
                return;
            }
            d["id"] = self.__model.select_cmi_model.id;
            d["query"] = self.__model.select_cmi_model.query;
            var f = self.getRecord();

            switch (type_comparer) {
                case "ano_anterior":
                    if (typeof f.fecha_inicial !== 'undefined' && typeof f.fecha_final !== 'undefined') {
                        var a1 = f.fecha_inicial.split('-');
                        var a2 = f.fecha_final.split('-');
                        var fInitialNew = new Date(a1[0] - 1, a1[1] - 1, a1[2]);
                        f.fecha_inicial = fInitialNew.getFullYear() + "-" + (fInitialNew.getMonth() + 1) + "-" + fInitialNew.getDate();
                        var fFinalNew = new Date(a2[0] - 1, a2[1] - 1, a2[2]);
                        f.fecha_final = fFinalNew.getFullYear() + "-" + (fFinalNew.getMonth() + 1) + "-" + fFinalNew.getDate();
                    } else if (typeof f.fecha_creacion_inicial !== 'undefined' && typeof f.fecha_creacion_final !== 'undefined') {
                        var a1 = f.fecha_creacion_inicial.split('-');
                        var a2 = f.fecha_creacion_final.split('-');
                        var fInitialNew = new Date(a1[0] - 1, a1[1] - 1, a1[2]);
                        f.fecha_creacion_inicial = fInitialNew.getFullYear() + "-" + (fInitialNew.getMonth() + 1) + "-" + fInitialNew.getDate();
                        f.fecha_inicial = fInitialNew.getFullYear() + "-" + (fInitialNew.getMonth() + 1) + "-" + fInitialNew.getDate();
                        var fFinalNew = new Date(a2[0] - 1, a2[1] - 1, a2[2]);
                        f.fecha_creacion_final = fFinalNew.getFullYear() + "-" + (fFinalNew.getMonth() + 1) + "-" + fFinalNew.getDate();
                        f.fecha_final = fFinalNew.getFullYear() + "-" + (fFinalNew.getMonth() + 1) + "-" + fFinalNew.getDate();
                    } else if (typeof f.fecha_inicial_filters !== 'undefined' && typeof f.fecha_final_filters !== 'undefined') {
                        var a1 = f.fecha_inicial_filters.split('-');
                        var a2 = f.fecha_final_filters.split('-');
                        var fInitialNew = new Date(a1[0] - 1, a1[1] - 1, a1[2]);
                        f.fecha_inicial_filters = fInitialNew.getFullYear() + "-" + (fInitialNew.getMonth() + 1) + "-" + fInitialNew.getDate();
                        f.fecha_inicial = fInitialNew.getFullYear() + "-" + (fInitialNew.getMonth() + 1) + "-" + fInitialNew.getDate();
                        var fFinalNew = new Date(a2[0] - 1, a2[1] - 1, a2[2]);
                        f.fecha_final_filters = fFinalNew.getFullYear() + "-" + (fFinalNew.getMonth() + 1) + "-" + fFinalNew.getDate();
                        f.fecha_final = fFinalNew.getFullYear() + "-" + (fFinalNew.getMonth() + 1) + "-" + fFinalNew.getDate();
                    }
                    if (typeof f.dateFieldFilter !== 'undefined') {
                        f[f.dateFieldFilter + "_inicial"] = f.fecha_inicial;
                        f[f.dateFieldFilter + "_final"] = f.fecha_final;
                    }
                    break;
                default:

                    break;
            }
            var filters = [];
            for (var v in f) {
                if (typeof f[v] === "string") {
                    var da = {};
                    da["clave"] = v;
                    da["valor"] = f[v];
                    filters.push(da);
                }
            }
            d["filters"] = filters;
            var func = function (r) {
                self.__dataSeries = r;
                self.processDynamicTableOnlyData();
            };
            var up = self.up;
            d["empresa"] = up["company"];
            d["usuario"] = up["user"];
            d["pais"] = up["country"];
            qxnw.utils.fastAsyncRpcCall("cmi", "executeQuery", d, func);
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
            if (r["records"].length === 0) {
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
        processDynamicTableOnlyData: function processDynamicTableOnlyData() {
            var self = this;
            var valChildren = JSON.parse(self.__model.select_cmi_model.valores);
            var filaRotulos = JSON.parse(self.__model.select_cmi_model.rotulos_fila);
            var filaColumnas = JSON.parse(self.__model.select_cmi_model.rotulos_columna);
            var tipoGrafico = self.graphicInterface.ui.select_charts.getValue().select_charts;
            if (tipoGrafico === "horizontalBar") {
                var d = self.ui.compare.getValue();
                if (d.compare !== "") {
                    qxnw.utils.information(self.tr("La comparación no es posible en el gráfico de barras horizontales"));
                    return;
                }
            }
            var tableRecords = self.__dataSeries;
            for (var i = 0; i < tableRecords.length; i++) {
                var ra = tableRecords[i];
                for (var da in ra) {
                    if (ra[da] === null) {
                        ra[da] = '';
                    }
                }
            }
            var cube = new qxnw.cube();
            var data = cube.generateDynamicTable(valChildren, filaRotulos, filaColumnas, tableRecords);
            if (typeof data === 'undefined') {
                return;
            }
            data["normalCols"] = data["normalCols"].toArray();

            self.sd2 = data["finalArray"];

            self.graphicInterface.addSeriesToGraphic(self, data["finalArray"], tipoGrafico, data["cols"], valChildren, false);
            if (self.subList2 === null) {
                var subList2 = new qxnw.lists();
                subList2.blockHeaderElements();
                subList2.setAppWidgetName("DATA_LIST2");
                qxnw.local.setData(subList2.getAppWidgetName() + "_list_sorted", null);
                self.subList2 = subList2;
                subList2.setMaxHeight(200);
                subList2.ui.part1.setVisibility("excluded");
                subList2.ui.part2.setVisibility("excluded");
                subList2.ui.part3.setVisibility("excluded");
                subList2.ui.printButton.setVisibility("excluded");
                subList2.ui.dynamicTableButton.setVisibility("excluded");
                subList2.ui.functionsButton.setVisibility("excluded");
                subList2.hideFooterTools();
                subList2.setUserData("interfaceType", "DATA");
                self.insertNavTable(subList2.getBase(), self.tr("Año anterior"));
            }

            self.subList2.setColumns(data["normalCols"]);
            for (var izz = 0; izz < data["normalCols"].length; izz++) {
                self.subList2.table.setColumnWidth(izz, 200);
            }

            data["finalArray"].push(data["total"]);

            if (self.l4) {
                self.l4.destroy();
            }
            var total = data["total"]["value"];
            self.total2 = total;
            self.formatDiff = false;
            if (typeof data["cols"] !== 'undefined' && typeof data["cols"][0]["type"] !== 'undefined' && data["cols"][0]["type"] === "money") {
                total = qxnw.utils.formatDecimalCurrency(data["total"]["value"], 0);
                self.formatDiff = true;
            }
            if (typeof data["total"] !== 'undefined' && typeof data["total"]["value"] !== 'undefined' && data["total"]["value"] !== "") {
                self.compareTotals();
            }

            self.subList2.onlyPopulate(data["finalArray"]);
            self.subList2.populateTotalColumns();
        },
        processDynamicTable: function processDynamicTable() {
            var self = this;

            var descripcion = null;

            if (typeof self.__model.select_cmi_model.descripcion !== 'undefined') {
                descripcion = self.__model.select_cmi_model.descripcion;
            }

            var valChildren = JSON.parse(self.__model.select_cmi_model.valores);
            var filaRotulos = JSON.parse(self.__model.select_cmi_model.rotulos_fila);
            var filaColumnas = JSON.parse(self.__model.select_cmi_model.rotulos_columna);
            var tipoGrafico = self.__model.select_cmi_model.tipo_grafico;
            var tableRecords = self.__dataSeries;
            for (var i = 0; i < tableRecords.length; i++) {
                var ra = tableRecords[i];
                for (var da in ra) {
                    if (ra[da] === null) {
                        ra[da] = '';
                    }
                }
            }
            var cube = new qxnw.cube();
            var data = cube.generateDynamicTable(valChildren, filaRotulos, filaColumnas, tableRecords);
            if (typeof data === 'undefined') {
                return;
            }

            data["normalCols"] = data["normalCols"].toArray();
            self.__colsSubList = data["cols"];
            self.subList.setColumns(data["normalCols"]);

            var tableModel = self.subList.table.getTableModel();
            tableModel.setColumnSortable(0, false);
            tableModel.setColumnSortable(1, false);

            for (var izz = 0; izz < data["normalCols"].length; izz++) {
                self.subList.table.setColumnWidth(izz, 200);
            }

            self.graphicInterface.startGraphic(self, data["finalArray"], tipoGrafico, data["cols"], valChildren, false, descripcion);

            if (self.l3) {
                self.l3.destroy();
            }
            var total = data["total"]["value"];
            self.total1 = total;
            total = parseInt(total);
            total = total.toFixed(0);
            if (typeof data["cols"] !== 'undefined' && typeof data["cols"][0]["type"] !== 'undefined' && data["cols"][0]["type"] === "money") {
                total = qxnw.utils.formatDecimalCurrency(total, 0);
            }
            if (typeof data["total"] !== 'undefined' && typeof data["total"]["value"] !== 'undefined' && data["total"]["value"] !== "") {
                self.l3 = new qx.ui.basic.Label(" " + data["total"]["label"] + ": " + total + " ").set({
                    rich: true,
                    alignY: "bottom",
                    alignX: "right"
                });
                if (self.filtersFooter) {
                    self.filtersFooter.removeAll();
                    self.filtersFooter.add(self.l3, {
                        flex: 0
                    });
                    self.setDataSeries();
                }
            }

            self.subList.onlyPopulate(data["finalArray"]);
            self.subList.populateTotalColumns();
        },
        createGraphicsInterface: function createGraphicsInterface() {
            var self = this;
            self.graphicInterface = new qxnw.dynamicTable.f_graphicAdvanced("f_graphicAdvanced");
            self.graphicInterface.setParentName(self.__parentName);
            self.graphicInterface.setParentInit(self);
            self.graphicInterface.setUserData("interfaceType", "GRAPHIC");
            self.insertNavTable(self.graphicInterface, self.tr("Gráfico"));
        },
        createFiltersContainer: function createFiltersContainer() {
            var self = this;
            if (self.filtersChartContainer !== null) {
                self.filtersChartContainer.destroy();
            }
            var filtersContainer = new qx.ui.container.Composite(new qx.ui.layout.HBox()).set({
                alignX: "left"
            });
            self.filtersChartContainer = filtersContainer;
            return filtersContainer;
        },
        loadFilters: function loadFilters() {
            var self = this;
            self.filtersChartContainer.removeAll();
            var f = self.__filtersData;
            var fields = [];
            var excludeFilters = ["nw_color_filter", "count", "export", "page", "part", "rowHeight", "sort", "sorted", "sorted_method", "sorted_metdot", "sorted_name", "subfilters"];
            var counter = 0;
            var types = {};
            for (var i = 0; i < f.length; i++) {
                var d = f[i].clave;
                if (d.indexOf("_type") !== -1) {
                    var alterName = d.replace("_type", "");
                    types[alterName] = f[i].valor;
                }
            }
            self.__model
            var selectListChecks = {};
            var values = {};
            for (var i = 0; i < f.length; i++) {
                var d = f[i].clave;
                if (excludeFilters.indexOf(d) === -1) {
                    if (d.indexOf("_label") === -1) {
                        if (d.indexOf("_text") === -1) {
                            if (d.indexOf("_type") === -1) {
                                if (types[f[i].clave] !== 'radioGroup') {
                                    if (d.indexOf("_array") !== -1) {
                                        selectListChecks[d] = f[i];
                                        continue;
                                    }

                                    values[d] = f[i].valor;
                                    var v = {};
                                    if (types[f[i].clave] === "selectListCheck") {
                                        v["enabled"] = false;
                                    }
                                    v["name"] = f[i].clave;
                                    v["type"] = types[f[i].clave];
                                    var lbl = d;
                                    if (lbl === "dateFieldFilter") {
                                        lbl = "Fecha de comparación";
                                    }
                                    if (lbl === "fecha_inicial_filters") {
                                        lbl = "Fecha inicial";
                                    }
                                    if (lbl === "fecha_final_filters") {
                                        lbl = "Fecha final";
                                    }
                                    v["label"] = qxnw.utils.ucFirst(lbl).replace("_", " ");
                                    if (v["type"] === "selectBox") {
                                        v["type"] = "label";
                                        v["mode"] = "showLegend";
                                    }
                                    fields.push(v);
                                    counter++;
                                }
                            }
                        }
                    }
                }
            }

            if (counter === 0) {
                var btLbl = {};
                btLbl["name"] = "lbl_no_filters";
                btLbl["type"] = "label";
                btLbl["label"] = self.tr("No hay filtros disponibles");
                fields.push(btLbl);
            }

            var bt = {};
            bt["name"] = "update_btn";
            bt["type"] = "button";
            bt["label"] = self.tr("Consultar");
            fields.push(bt);

            var editExists = false;
            if (typeof self.__model.select_cmi_model !== 'undefined') {
                if (typeof self.__model.select_cmi_model.usuario !== 'undefined') {
                    if (self.up.user === self.__model.select_cmi_model.usuario) {
                        var btEdit = {};
                        btEdit["name"] = "edit_btn";
                        btEdit["type"] = "button";
                        btEdit["label"] = self.tr("Editar");
                        fields.push(btEdit);

                        editExists = true;

                        var btDel = {};
                        btDel["name"] = "delete_btn";
                        btDel["type"] = "button";
                        btDel["label"] = self.tr("Eliminar");
                        fields.push(btDel);
                    }
                }
            }

            self.addFieldsByContainer(fields, self.filtersChartContainer);

            if (editExists === true) {
                self.ui.edit_btn.setIcon(qxnw.config.execIcon("edit-select-all"));
                self.ui.edit_btn.addListener("execute", function () {
                    self.editCmiReports(self.__model);
                });

                self.ui.delete_btn.addListener("execute", function () {
                    qxnw.utils.question(self.tr("¿Desea eliminar el reporte?"), function (e) {
                        if (e) {
                            self.sd2 = null;
                            var f = self.getRecord();
                            self.deleteCmi(f);
                        }
                    });
                });

                self.ui.update_btn.setIcon(qxnw.config.execIcon("dialog-apply"));
                self.ui.delete_btn.setIcon(qxnw.config.execIcon("edit-delete"));
            }

            for (var d in values) {
                if (self.ui[d]) {
                    self.ui[d].setValue(values[d]);
                }
            }

            for (var t in selectListChecks) {
                var arr = selectListChecks[t];
                t = t.replace("_array_all", "");
                if (typeof self.ui[t] !== 'undefined') {
                    self.ui[t].setValue(null);
                    var valor = JSON.parse(arr["valor"]);
                    for (var z = 0; z < valor.length; z++) {
                        self.ui[t].addToken(valor[z]);
                    }
                }
            }

            var selectedCmi = self.ui.select_cmi.getValue();
            var savedFilters = qxnw.local.getData(self.getAppWidgetName() + "_cmi_" + selectedCmi["select_cmi"]);
            if (savedFilters !== null) {
                for (var i = 0; i < savedFilters.length; i++) {
                    var ra = savedFilters[i];
                    if (ra.clave === "select_checkbox") {
                        continue;
                    }
                    if (ra.clave === "compare") {
                        continue;
                    }
                    if (self.ui[ra.clave]) {
                        try {
                            if (ra.valor === "true") {
                                ra.valor = true;
                            }
                            if (ra.valor === "false") {
                                ra.valor = false;
                            }
                            self.ui[ra.clave].setValue(ra.valor);
                        } catch (e) {

                        }
                    }
                }
            }

            var savedSelectedReport = qxnw.local.getData(self.getAppWidgetName() + "_cmi_selected_report");
            if (typeof savedSelectedReport !== 'undefined' && savedSelectedReport !== null) {
                if (selectedCmi["select_cmi"] === savedSelectedReport.select_cmi) {
                    self.ui.select_checkbox.setValue(true);
                }
            }

            self.ui.select_checkbox.addListener("execute", function (e) {
                var v = this.getValue();
                if (v) {
                    self.saveSelectedReport();
                } else {
                    qxnw.local.removeByKey(self.getAppWidgetName() + "_cmi_selected_report");
                }
            });
            self.ui.update_btn.addListener("execute", function () {
                var f = self.getRecord();
                if (typeof f.fecha_inicial !== 'undefined' && typeof f.fecha_final !== 'undefined') {
                    if (f.fecha_inicial > f.fecha_final) {
                        qxnw.utils.information(self.tr("La fecha inicial no puede ser mayor a la fecha final"));
                        return;
                    }
                }
                var filters = [];
                for (var v in f) {
                    if (typeof f[v] === "string") {
                        var d = {};
                        d["clave"] = v;
                        d["valor"] = f[v];
                        filters.push(d);
                    }
                }
                var d = {};
                d["id"] = self.__model.select_cmi_model.id;
                d["filters"] = filters;
                var up = self.up;
                d["empresa"] = up["company"];
                d["usuario"] = up["user"];
                d["pais"] = up["country"];
                self.saveSelectedFilters(filters);
                var func = function (r) {
                    self.__dataSeries = r;
                    self.processDynamicTable();
                    var d = self.ui.compare.getValue();
                    if (d.compare === "") {
                        return;
                    }
                    self.compare(d);
                };
                qxnw.utils.fastAsyncRpcCall("cmi", "executeQuery", d, func);
            });
            self.filtersFooter = new qx.ui.container.Composite(new qx.ui.layout.HBox()).set({
                alignX: "right"
            });
            self.masterContainer.add(self.filtersFooter, {
                flex: 0
            });
        }
    }
});