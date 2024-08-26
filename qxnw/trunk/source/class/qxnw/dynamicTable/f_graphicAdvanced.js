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
qx.Class.define("qxnw.dynamicTable.f_graphicAdvanced", {
    extend: qxnw.forms,
    construct: function construct() {
        this.base(arguments);
    },
    properties: {
        temporalTitle: {
            init: null
        }
    },
    members: {
        graphic: null,
        graphicType: null,
        values: null,
        __lastListenerId: null,
        __printWindow: null,
        __parentInit: null,
        __mainModel: null,
        useNewChart: true,
        __plot: null,
        reset: function reset() {
            if (this.graphic !== null) {
                this.graphic.destroy();
            }
        },
        getSavedValues: function getSavedValues(type) {
            var self = this;
            var rta = {};
            var savedGrid = self.getOptions("nw_tb_grid_options");
            if (typeof savedGrid != null) {
                switch (type) {
                    case "xylabels":
                        rta = false;
                        for (var v in savedGrid) {
                            if (v != null) {
                                switch (v) {
                                    case "nw_td_haveXY_labels":
                                        if (savedGrid[v] != null) {
                                            rta = savedGrid[v] == "true" ? true : savedGrid[v] == "false" ? false : false;
                                        }
                                        break;
                                }
                            }
                        }
                        break;
                    case "leyenda_size":
                        rta = "";
                        for (var v in savedGrid) {
                            if (v != null) {
                                switch (v) {
                                    case "nw_td_letra_size_legend":
                                        if (savedGrid[v] != null) {
                                            rta = savedGrid[v];
                                        }
                                        break;
                                }
                            }
                        }
                        break;
                    case "ancho_barras":
                        rta = "";
                        for (var v in savedGrid) {
                            if (v != null) {
                                switch (v) {
                                    case "nw_td_grid_ancho_barras":
                                        if (savedGrid[v] != null) {
                                            rta = savedGrid[v];
                                        }
                                        break;
                                }
                            }
                        }
                        break;
                    case "letra_xy":
                        rta = "";
                        for (var v in savedGrid) {
                            if (v != null) {
                                switch (v) {
                                    case "nw_td_letra_size_xy":
                                        if (savedGrid[v] != null) {
                                            rta = savedGrid[v];
                                        }
                                        break;
                                }
                            }
                        }
                        break;
                    case "colores":
                        var count = 0;
                        rta = [];
                        for (var v in savedGrid) {
                            if (parseInt(v.substr(v.length - 1)) == count) {
                                if (savedGrid[v] != null) {
                                    rta.push(savedGrid[v]);
                                }
                                count++;
                            }
                        }
                        break;
                    case "grid_show_vertical":
                        for (var v in savedGrid) {
                            if (v != null) {
                                switch (v) {
                                    case "nw_td_grid_mostrar_linea_vertical":
                                        if (savedGrid[v] != null) {
                                            rta.showGridline = savedGrid[v] == "true" ? true : savedGrid[v] == "false" ? false : false;
                                        }
                                        break;
                                }
                            }
                        }
                        break;
                    case "title":
                        var haveSomething = false;
                        for (var v in savedGrid) {
                            if (v != null) {
                                switch (v) {
                                    case "nw_td_titulo_encabezado":
                                        if (savedGrid[v] != null && savedGrid[v] != "") {
                                            rta.text = savedGrid[v];
                                            haveSomething = true;
                                        }
                                    case "nw_td_titulo_size":
                                        if (savedGrid[v] != null && savedGrid[v] != 0) {
                                            rta.fontSize = parseInt(savedGrid[v]);
                                            haveSomething = true;
                                        }
                                }
                            }
                        }
                        if (haveSomething === false) {
                            return false;
                        }
                        break;
                    case "header":
                        for (var v in savedGrid) {
                            if (v != null) {
                                switch (v) {
                                    case "nw_td_impresion_encabezado":
                                        if (savedGrid[v] != null) {
                                            rta = savedGrid[v] == "true" ? true : savedGrid[v] == "false" ? false : true;
                                        }
                                        break;
                                }
                            }
                        }
                        break;
                    case "grid_show_horizontal":
                        for (var v in savedGrid) {
                            if (v != null) {
                                switch (v) {
                                    case "nw_td_grid_mostrar_linea_horizontal":
                                        if (savedGrid[v] != null) {
                                            rta.showGridline = savedGrid[v] == "true" ? true : savedGrid[v] == "false" ? false : false;
                                        }
                                        break;
                                }
                            }
                        }
                        break;
                    case "grid":
                        for (var v in savedGrid) {
                            if (v != null) {
                                switch (v) {
                                    case "nw_td_grid_color_fondo":
                                        if (savedGrid[v] != null) {
                                            rta.background = savedGrid[v];
                                        }
                                        break;
                                    case "nw_td_grid_sombra":
                                        if (savedGrid[v] != null) {
                                            rta.shadow = savedGrid[v];
                                        }
                                        break;
                                    case "nw_td_grid_color_linea":
                                        if (savedGrid[v] != null) {
                                            rta.gridLineColor = savedGrid[v];
                                        }
                                        break;
                                    case "nw_td_grid_ancho_linea":
                                        if (savedGrid[v] != null) {
                                            rta.gridLineWidth = savedGrid[v];
                                        }
                                        break;
                                }
                            }
                        }
                        break;
                    case "legend":
                        for (var v in savedGrid) {
                            if (v != null) {
                                switch (v) {
                                    case "nw_td_leyenda":
                                        rta.show = savedGrid[v] == "true" ? true : savedGrid[v] == "false" ? false : true;
                                        break;
                                    case "nw_td_leyenda_posicion":
                                        rta.placement = savedGrid[v] == "true" ? "insideGrid" : savedGrid[v] == "false" ? "outsideGrid" : "insideGrid";
                                        break;
                                }
                            }
                        }
                        break;
                }
            }
            return rta;
        },
        getOptions: function getOptions(key) {
            return qxnw.local.getData(key);
        },
        updateJPlot: function updateJPlot() {
            this.__parentInit.processDynamicTable();
        },
        openGridOptions: function openGridOptions() {
            var self = this;
            var gridOptions = new qxnw.dynamicTable.options.f_grid(self);
            gridOptions.setTemporalTitle(self.getTemporalTitle());
            gridOptions.setModal(true);
            var w = gridOptions.getChildrenContainer();
            w.set({
                maxWidth: 200
            });
            self.containerH.add(gridOptions.masterContainer);
        },
        setParentName: function setParentName(parentName) {
            this.__parentName = parentName;
        },
        setParentInit: function setParentInit(parent) {
            this.__parentInit = parent;
        },
        saveGraphicType: function saveGraphicType(type, selectedCmi) {
            var self = this;
            qxnw.local.storeData("dynamic_table_" + self.__parentName + "_graphic_" + selectedCmi, type);
        },
        saveGraphicPallete: function saveGraphicPallete(type) {
            var self = this;
            qxnw.local.storeData("dynamic_table_" + self.__parentName + "_pallete", type);
        },
        getSavedGraphicType: function getSavedGraphicType(selectedCmi) {
            return qxnw.local.getData("dynamic_table_" + this.__parentName + "_graphic_" + selectedCmi);
        },
        getSavedGraphicPallete: function getSavedGraphicPallete() {
            return qxnw.local.getData("dynamic_table_" + this.__parentName + "_pallete");
        },
        addSeriesToGraphic: function addSeriesToGraphic(parent, model, name, values, valChildren, searchSavedType) {
            var self = this;
            var arrAll = [];
            var arrAllXY = [];
            for (var ia = 0; ia < self.values.length; ia++) {
                var tt = self.values[ia];
                var ss = [];
                for (var i = 0; i < model.length; i++) {
                    if (model[i]["level"] === 0) {
                        arrAll.push(model[i][tt["caption"]]);
                        var r = {};
                        r["x"] = qxnw.utils.cleanHtml(model[i]["label"]);
                        r["y"] = model[i][tt["caption"]];
                        arrAllXY.push(r);
                    }
                }
                arrAll.push(ss);
            }
            if (typeof this.graphic.addDataSeries !== 'undefined') {
                if (name === "pie") {
                    self.ui["select_charts"].setUserData("ds2", arrAll);
                    self.graphic.addDataSeries(arrAll);
                } else {
                    self.ui["select_charts"].setUserData("ds2", arrAllXY);
                    self.graphic.addDataSeries(arrAllXY);
                }
            }
        },
        startGraphic: function startGraphic(parent, model, name, values, valChildren, searchSavedType, descripcion) {
            var self = this;
            self.graphicType = name;
            self.values = values;
            self.__mainModel = model;
            var jqplot = null;
            self.setColumnsFormNumber(0);
            self.__parentInit = parent;
            self.ui["select_charts"] = new qxnw.fields.selectBox();
            self.ui["select_charts"].setUserData("name", "select_charts");
            self.ui["select_charts"].setUserData("model", model);
            var d = {};
            d["bars"] = self.tr("Barras");
            d["horizontalBar"] = self.tr("Barras horizontales");
            d["lines"] = self.tr("Líneas");
            d["pie"] = self.tr("Torta");
            d["bars3d"] = self.tr("Barras apiladas");
            d["funnel"] = self.tr("Tunel");
            qxnw.utils.populateSelectFromArray(self.ui["select_charts"], d);

            self.ui["pallete"] = new qxnw.fields.selectBox();
//            self.ui["pallete"].set({
//                maxHeight: 27,
//                minHeight: 27,
//                maxWidth: 150
//            });
            self.ui["pallete"].setUserData("name", "pallete");
            self.ui["pallete"].setUserData("model", model);

            var d = {};
            d["Classic10"] = self.tr("Combinado");
            d["BlancoVerde"] = self.tr("Blanco a verde");
            d["BlancoAzul"] = self.tr("Blanco a azul");
            d["AmarilloRojo"] = self.tr("Amarillo a rojo");
            d["BlancoPurpura"] = self.tr("Blanco a púrpura");
            d["PurpuraVerde"] = self.tr("Púrpura a verde");
            d["RojoVerde"] = self.tr("Rojo a verde");
            d["ClassicLight10"] = self.tr("ClassicLight10");
            d["ClassicGray5"] = self.tr("ClassicGray5");
            d["ClassicColorBlind10"] = self.tr("ClassicColorBlind10");
            d["ClassicTrafficLight9"] = self.tr("ClassicTrafficLight9");
            d["ClassicPurpleGray6"] = self.tr("ClassicPurpleGray6");
            d["ClassicPurpleGray12"] = self.tr("ClassicPurpleGray12");
            d["ClassicGreenOrange6"] = self.tr("ClassicGreenOrange6");
            d["ClassicGreenOrange12"] = self.tr("ClassicGreenOrange12");
            d["ClassicBlueRed6"] = self.tr("ClassicBlueRed6");
            d["ClassicBlueRed12"] = self.tr("ClassicBlueRed12");
            d["ClassicCyclic13"] = self.tr("ClassicCyclic13");
            qxnw.utils.populateSelectFromArray(self.ui["pallete"], d);

            var itemModel = "";
            var childrenVals = valChildren;
            if (childrenVals.length === 1) {
                var modelItem = childrenVals[0];
                var modelVal = childrenVals[0]["type"];
                modelItem["typeFinded"] = modelVal;
                itemModel = modelItem;
            }

            var selectedPrefix = self.getAppWidgetName();
            if (typeof parent.ui.select_cmi !== 'undefined') {
                var selectedCmi = parent.ui.select_cmi.getValue();
                selectedPrefix = selectedCmi["select_cmi"];
            }
            var savedType = self.getSavedGraphicType(selectedPrefix);
            if (savedType !== null) {
                self.graphicType = savedType;
                self.ui["select_charts"].setValue(savedType);
                name = savedType;
            }
            var savedPallete = self.getSavedGraphicPallete();
            if (savedPallete !== null) {
                self.ui["pallete"].setValue(savedPallete);
            }

            self.ui["select_charts"].setUserData("sort", self.ui["order_graphic"]);
            self.ui["select_charts"].setUserData("modelVal", itemModel);
            self.ui["pallete"].setUserData("modelVal", itemModel);
            self.ui["select_charts"].addListener("changeSelection", function () {
                var model = this.getUserData("model");
                var modelVal = this.getUserData("modelVal");
                var name = this.getValue();
                var selectedPrefix = self.getAppWidgetName();
                if (typeof parent.ui.select_cmi !== 'undefined') {
                    var selectedCmi = parent.ui.select_cmi.getValue();
                    selectedPrefix = selectedCmi["select_cmi"];
                }
                self.graphicType = name["select_charts"];
                self.saveGraphicType(name["select_charts"], selectedPrefix);
                self.switchChartTipe(name["select_charts"], model, modelVal);

                if (self.graphicType === "horizontalBar") {
                    if (typeof parent.ui.compare !== 'undefined') {
                        var d = parent.ui.compare.getValue();
                        if (d.compare !== "") {
                            qxnw.utils.information(self.tr("La comparación no es posible en el gráfico de barras horizontales"));
                            return;
                        }
                    }
                }

                var sd2 = self.ui["select_charts"].getUserData("ds2");
                if (typeof sd2 !== 'undefined' && sd2 !== null && sd2 !== "") {
                    if (typeof self.graphic.addDataSeries !== 'undefined') {
                        self.graphic.addDataSeries(sd2);
                    }
                }
            });
            self.ui["pallete"].addListener("changeSelection", function () {
                var model = this.getUserData("model");
                var modelVal = this.getUserData("modelVal");
                var name = self.ui.select_charts.getValue();
                var namePallete = this.getValue();
                self.saveGraphicPallete(namePallete["pallete"]);
                self.switchChartTipe(name["select_charts"], model, modelVal);

                if (name["select_charts"] === "horizontalBar") {
                    qxnw.utils.information(self.tr("La comparación no es posible en el gráfico de barras horizontales"));
                    return;
                }

                var sd2 = self.ui["select_charts"].getUserData("ds2");
                if (typeof sd2 !== 'undefined' && sd2 !== null && sd2 !== "") {
                    if (typeof self.graphic.addDataSeries !== 'undefined') {
                        self.graphic.addDataSeries(sd2);
                    }
                }
            });

            var jqplot = self.switchChartTipe(name, model, itemModel, descripcion);
            self.__plot = jqplot;
            self.createDeffectButtons();
            self.ui.cancel.setVisibility("excluded");
            self.ui.accept.setIcon(qxnw.config.execIcon("document-print-preview"));
            self.ui.accept.setLabel(self.tr("Imprimir informe"));
            if (self.__lastListenerId !== null) {
                try {
                    self.ui.accept.removeListenerById(self.__lastListenerId);
                } catch (e) {
                    console.log(e);
                }
            }
            self.__lastListenerId = self.ui.accept.addListener("tap", function () {
                self.openInNewWindow();
            });
            if (!parent.isInsertedButtonsGraph) {
                var btns = [
                    {
                        label: self.tr("Enviar por correo"),
                        icon: qxnw.config.execIcon("document-send"),
                        name: "send_graph_email"
                    }
                ];
                parent.addButtons(btns);
                parent.ui.send_graph_email.addListener("execute", function () {
                    self.sendGraphByEmail();
                });
                parent.isInsertedButtonsGraph = true;
            }

//            self.openGridOptions();

            self.show();
        },
        switchChartTipe: function switchChartTipe(name, model, itemModel, descripcion) {
            var self = this;
            var jqplot = null;
            self.ui["select_charts"].setValue(name);
            var self = this;
            switch (name) {
                case "horizontalBar":
                    jqplot = self.horizontalBar(model, itemModel, descripcion);
                    break;
                case "bars":
                    jqplot = self.bars(model, itemModel, descripcion);
                    break;
                case "bars3d":
                    jqplot = self.bars3d(model, itemModel, descripcion);
                    break;
                case "pie":
                    jqplot = self.pie(model, itemModel, descripcion);
                    break;
                case "hardLines":
                    jqplot = self.lines(model, itemModel, descripcion);
                    break;
                case "lines":
                    jqplot = self.lines(model, itemModel, descripcion);
                    break;
                case "funnel":
                    jqplot = self.funnel(model, itemModel, descripcion);
                    break;
                case "globes":
                    jqplot = self.globes(model, itemModel, descripcion);
                    break;
            }
            self.graphic = jqplot;
            self.masterContainer.removeAll();
            var optionsContainer = new qx.ui.container.Composite(new qx.ui.layout.HBox());

            var containerFieldType = new qx.ui.container.Composite(new qx.ui.layout.VBox());

            var lbl1 = new qx.ui.basic.Label(self.tr("Tipo de gráfico")).set({
                rich: true,
                alignY: "bottom",
                alignX: "left"
            });

            containerFieldType.add(lbl1);

            optionsContainer.add(containerFieldType);

            self.masterContainer.add(optionsContainer, {
                flex: 0
            });
            containerFieldType.add(self.ui["select_charts"], {
                flex: 0
            });

            var containerFieldPallete = new qx.ui.container.Composite(new qx.ui.layout.VBox());
            var lbl2 = new qx.ui.basic.Label(self.tr("Estilo")).set({
                rich: true,
                alignY: "bottom",
                alignX: "left"
            });
            containerFieldPallete.add(lbl2);
            containerFieldPallete.add(self.ui["pallete"], {
                flex: 0
            });

            optionsContainer.add(containerFieldPallete);

            if (jqplot == false) {
                return;
            }
            self.masterContainer.set({
                alignX: "center",
                alignY: "middle"
            });

            self.containerH = new qx.ui.container.Composite(new qx.ui.layout.HBox());
            self.containerH.add(jqplot, {
                flex: 1
            });
            self.masterContainer.add(self.containerH, {
                flex: 1
            });
            return jqplot;
        },
        sendGraphByEmail: function sendGraphByEmail() {
            var self = this;
            var f = [
                {
                    name: "subject",
                    label: self.tr("Asunto"),
                    type: "textField",
                    mode: "search",
                    toolTip: self.tr("Ingrese el asunto del correo"),
                    required: true
                },
                {
                    name: "nombre",
                    label: self.tr("Nombre"),
                    type: "textField",
                    mode: "search",
                    toolTip: self.tr("Ingrese el nombre del destinatario"),
                    required: true
                },
                {
                    name: "email",
                    mode: "search.email",
                    label: self.tr("E-mail"),
                    type: "textField",
                    toolTip: self.tr("Ingrese el correo electrónico"),
                    required: true
                },
                {
                    name: "enviar_a_grupo",
                    label: self.tr("Enviar a un grupo"),
                    type: "selectBox",
                    toolTip: self.tr("Puede crear sus grupos por el menú Configuración->Listas de correos")
                },
                {
                    name: "observaciones",
                    label: self.tr("Observaciones"),
                    type: "textArea",
                    mode: "maxWidth",
                    toolTip: self.tr("Observaciones que saldrán en el cuerpo del mensaje")
                }
            ];
            var dialog = qxnw.utils.dialog(f, self.tr("Envío de gráfico por correo electrónico"), true);
            dialog.setModal(true);
            var data = {
                "": "Seleccione..."
            };
            dialog.ui.subject.setValue("Inteligencia empresarial QXNW");
            qxnw.utils.populateSelectFromArray(dialog.ui.enviar_a_grupo, data);
            qxnw.utils.populateSelect(dialog.ui.enviar_a_grupo, "email", "getGroupsByUser");
            dialog.ui.enviar_a_grupo.addListener("changeSelection", function () {
                var s = this.getValue();
                if (s.enviar_a_grupo == "") {
                    dialog.ui.email.setValue("");
                    dialog.ui.email.setEnabled(true);
                    dialog.ui.nombre.setValue("");
                    dialog.ui.nombre.setEnabled(true);
                    dialog.setRequired("email", true);
                    dialog.setRequired("nombre", true);
                } else {
                    dialog.ui.email.setValue("");
                    dialog.ui.email.setEnabled(false);
                    dialog.ui.nombre.setValue("");
                    dialog.ui.nombre.setEnabled(false);
                    dialog.setRequired("email", false);
                    dialog.setRequired("nombre", false);
                }
            });
            dialog.settings.accept = function () {
                var d = dialog.getRecord();
                d["body"] = self.getHtmlGraph();
                d["body"] += d["observaciones"] != "" ? "<hr><p><b>Observaciones: " + d["observaciones"] + "</b></p><hr>" : "";
                var func2 = function (excelPath) {
                    var func = function (r) {
                        if (r["enviar_a_grupo"] != "") {
                            if (r == true) {
                                qxnw.utils.information(self.tr("Correos enviados correctamente"));
                            }
                        }
                    };
                    d["excelPath"] = excelPath;
                    qxnw.utils.fastAsyncRpcCall("master", "sendDynamicTable", d, func);
                };
                self.__parentInit.sendByExcel(true, func2);
            };
        },
        getHtmlGraph: function getHtmlGraph(includeData, observations) {
            var self = this;
            if (typeof includeData == 'undefined') {
                includeData = true;
            }
            if (typeof observations == 'undefined') {
                observations = "";
            }
            var imgData = self.getImgUrl();
            console.log("imgData", imgData);
            var body = "";
            var currentTime = new Date();
            var year = currentTime.getFullYear();
            body += "<font color='gray' size='2'>&copy; Powered by NW Group " + year + "</font>";
            var title = self.getSavedValues("title");
            if (title != null && title != false && title != "") {
                title.title = title;
            }
            body += "<center><h2><b>Inteligencia empresarial</b></h2></center>";
            var header = self.getSavedValues("header");
            if (header != null && header != "" && header === true) {
                body += "<br />";
                body += "<span>Generado por: " + self.up.name + "</strong>";
                body += "<br />";
                body += "<span>Fecha: " + qxnw.utils.getActualDate() + "</strong>";
                body += "<br />";
            }
            body += "<br />";
            body += "<center>";

            if (includeData === true) {
                body += self.__parentInit.getProcesedTableData();
                body += "<br />";
            }

            if (imgData != false) {
                body += '<img width="100%" max-width="700px" src="' + imgData + '"/>';
            }

            if (observations != "") {
                if (observations != null) {
                    body += "<br />";
                    body += "<br />";
                    body += "<div id='tabla1' style='border: 1px solid #1E679A; width: '100%';'>";
                    body += "<div id='cabtab1' style='background-color: #1E679A; font-weight: bold; color: #ffffff; padding: 2 2 2 2px;'>";
                    body += "Observaciones";
                    body += "</div>";
                    body += "<div id='cuerpotab1' style='padding: 4 4 4 4px; background-color: #ffffcc;'>";
                    body += observations;
                    body += "</div>";
                    body += "</div>";
                    body += "<br />";
                }
            }

            body += "</center>";
            body += "<br />";
            return body;
        },
        openInNewWindow: function openInNewWindow() {
            var self = this;
            var f = new qxnw.forms();
            f.setModal(true);
            f.setTitle(self.tr("Opciones de impresión"));
            var fields = [
                {
                    name: "mostrar_data",
                    label: self.tr("Mostrar tabla de datos"),
                    type: "checkBox"
                },
                {
                    name: "observaciones",
                    label: self.tr("Observaciones"),
                    type: "textArea"
                }
            ];
            f.setFields(fields);
            var show_data = qxnw.local.getData("nw_dynamic_table_show_data");
            if (show_data == null) {
                f.ui.mostrar_data.setValue(true);
            } else if (typeof show_data == "boolean") {
                f.ui.mostrar_data.setValue(show_data);
            }
            var saved_observations = qxnw.local.getData("nw_dynamic_table_observations");
            if (saved_observations != null) {
                f.ui.observaciones.setValue(saved_observations);
            }
            f.ui.accept.addListener("execute", function () {
                try {
                    self.__printWindow = window.open(null, "_blank", "scrollbars=0");
                    var includeData = f.ui.mostrar_data.getValue();
                    var observations = f.ui.observaciones.getValue();

                    qxnw.local.storeData("nw_dynamic_table_show_data", includeData);
                    qxnw.local.storeData("nw_dynamic_table_observations", observations);

                    var body = self.getHtmlGraph(includeData, observations);
                    self.__printWindow.document.write(body);
                    self.__printWindow.document.close(); // necessary for IE >= 10
                    self.__printWindow.focus(); // necessary for IE >= 10

                    var timer = new qx.event.Timer(100);
                    timer.start();
                    timer.addListener("interval", function (e) {
                        timer.stop();
                        self.__printWindow.print();
                        self.__printWindow.close();
                    });

                } catch (e) {
                    qxnw.utils.error(e);
                }
            });
            f.ui.cancel.addListener("execute", function () {
                f.reject();
            });
            f.show();
            return;
        },
        openFormToPrint: function openFormToPrint() {
            var self = this;
            var f = new qxnw.forms();
            f.setMinWidth(300);
            f.setMinHeight(300);
            f.setTitle(self.tr("Impresión de informe"));
            var containerFilters = new qx.ui.container.Composite(new qx.ui.layout.VBox());
            var printButton = new qx.ui.toolbar.Button(self.tr("Imprimir"), qxnw.config.execIcon("document-print-preview"));
            var toolTip = new qx.ui.tooltip.ToolTip();
            toolTip.setLabel(self.tr("Imprimir el informe"));
            printButton.setToolTip(toolTip);
            containerFilters.add(printButton);
            printButton.addListener("execute", function () {
                f.masterContainer.print();
            });
            f.masterContainer.add(containerFilters);
            var body = self.getHtmlGraph();
            f.addHtml(body, 1);
            f.masterContainer.addListener("appear", function () {
                var target = this.getContentElement().getDomElement();
                qx.bom.element.Style.set(target, "overflow-y", "scroll");
                qx.bom.element.Style.set(target, "overflow-x", "scroll");
            });
            f.show();
            return;
        },
        getImgUrl: function getImgUrl() {
            var self = this;
            if (self.useNewChart === true) {
                var imgData = self.__plot.jqplotToImg();
            } else {
                var plot = self.__plot.getPlotObject();
                if (plot === null) {
                    return false;
                }
                var id = plot.targetId;
                var imgData = $(id).jqplotToImageStr({});
            }
            //TODO: MONITOREAR SI SE DETIENE. SE RETIRAN LAS SIGUIENTES LÍNEAS PORQUE NO EXPORTAN LOS POINTERS
            //var imgData = qxnw.utils.plotToImg($(id));
            //TODO: SE SOLUCIONA LA IMPRESION DE LOS VALORES, LEYENDAS, ETC
//            var imgData = qxnw.utils.plotToImgBetter($(id));
            //imgData = imgData.toDataURL("image/png");
            return imgData;
        },
        funnel: function funnel(model, modelVal, descripcion) {
            var self = this;
            var arrAll = [];
            var arrAllInside = [];
            var ticks = [];
            var labels = [];

            for (var i = 0; i < model.length; i++) {
                try {
                    delete model[i].fila;
                } catch (e) {

                }
                try {
                    delete model[i].key;
                } catch (e) {

                }
                try {
                    delete model[i].row;
                } catch (e) {

                }
            }
            for (var i = 0; i < model.length; i++) {
                if (model[i]["level"] == 0) {
                    var label = model[i]["label"];
                    if (label == "") {
                        ticks.push("(en blanco)");
                    } else {
                        ticks.push(label);
                    }
                }
            }

            for (var ia = 0; ia < self.values.length; ia++) {
                var tt = self.values[ia];

                var label = tt["caption"];
                if (label == "") {
                    label = "(en blanco)";
                }
                label = "<font size='16'>" + label + "</font>";

                labels.push({label: label});
                for (var i = 0; i < model.length; i++) {
                    if (model[i]["level"] == 0) {
                        var v = [];
                        v.push(model[i]["label"]);
                        v.push(model[i][tt["caption"]]);
                        arrAllInside.push(v);
                    }
                }
            }
            arrAll = [arrAllInside];
            var options = function ($jqplot) {
                var pointLabels = {
                    show: true
                };
                if (typeof modelVal.typeFinded != 'undefined') {
                    switch (modelVal.typeFinded) {
                        case "PERCEN":
                            pointLabels = {
                                show: true,
                                formatString: '%#.2f%'
                            };
                            break;
                        case "SUM":
                            if (typeof modelVal.typeColumn != 'undefined') {
                                if (modelVal.typeColumn == 'money') {
                                    pointLabels = {
                                        show: true,
                                        formatString: "$ %'.2f"
                                    };
                                }
                            }
                            break;
                    }
                }
                var tmpTitle = 'Inteligencia empresarial - Líneas';

                if (typeof descripcion !== 'undefined' && descripcion !== null) {
                    tmpTitle = descripcion;
                }

                self.setTemporalTitle(tmpTitle);
                var rta = {
                    type: "funnel",
                    title: {
                        text: tmpTitle
                    },
                    animate: true,
                    animateReplot: true,
                    showDataLabels: true,
                    stackSeries: true,
                    seriesDefaults: {
                        renderer: $jqplot.FunnelRenderer,
                        rendererOptions: {
                            animation: {
                                speed: 1500
                            }
                        },
                        tickOptions: {
                            textColor: 'black'
                        }
                    },
                    highlighter: {
                        show: true,
                        sizeAdjust: 7.5,
                        tooltipAxes: 'y',
                        useAxesFormatters: false
                    },
                    axesDefaults: {
                        tickRenderer: $jqplot.CanvasAxisTickRenderer,
                        borderColor: "black",
                        tickOptions: {
                            angle: -30,
                            textColor: 'black'
                        }
                    },
                    axesStyles: {
                        ticks: {
                            textColor: 'black'
                        },
                        label: {
                            textColor: 'black'
                        }
                    },
                    legend: {
                        show: true,
                        placement: 'insideGrid'
                    },
                    cursor: {
                        show: true,
                        zoom: true
                    }
                };
                return rta;
            };
            var plugins = ['funnelRenderer', 'highlighter'];
            return new qxnw.charts(arrAll, options, plugins);
        },
        lines: function lines(model, modelVal, descripcion) {
            //var data = [[[0, 3], [5, 7], [3, 2]]];
            var self = this;
            var arrAll = [];
            var arrAllXY = [];
            var ticks = [];
            var labels = [];
            for (var i = 0; i < model.length; i++) {
                try {
                    delete model[i].fila;
                } catch (e) {

                }
                try {
                    delete model[i].key;
                } catch (e) {

                }
                try {
                    delete model[i].row;
                } catch (e) {

                }
            }
            for (var i = 0; i < model.length; i++) {
                if (model[i]["level"] == 0) {
                    var label = model[i]["label"];
                    if (label == "") {
                        ticks.push("(en blanco)");
                    } else {
                        try {
                            label = qxnw.utils.cleanHtml(label);
                        } catch (e) {

                        }
                        ticks.push(label);
                    }
                }
            }
            var colors = self.getSavedValues("colores");
            var anchoBarras = self.getSavedValues("ancho_barras");
            var labelSize = self.getSavedValues("leyenda_size");
            if (typeof labelSize == 'undefined' || labelSize == null || labelSize == "") {
                labelSize = 2;
            }
            for (var ia = 0; ia < self.values.length; ia++) {
                var tt = self.values[ia];
                var label = tt["caption"];
                if (label == "") {
                    label = "(en blanco)";
                }
                label = "<font size='" + labelSize + "'>" + label + "</font>";
                if (typeof colors[ia] != 'undefined') {
                    if (typeof anchoBarras != 'undefined' && anchoBarras != "") {
                        labels.push({label: label, color: colors[ia], rendererOptions: {barWidth: anchoBarras}});
                    } else {
                        labels.push({label: label, color: colors[ia]});
                    }
                } else if (typeof anchoBarras != 'undefined' && anchoBarras != "") {
                    labels.push({label: label, rendererOptions: {barWidth: anchoBarras}});
                } else {
                    labels.push({label: label});
                }
                if (typeof tt["noEnter"] != 'undefined') {
                    continue;
                }
                var ss = [];
                for (var i = 0; i < model.length; i++) {
                    if (model[i]["level"] == 0) {
                        ss.push(model[i][tt["caption"]]);
                        var r = {};
                        r["x"] = qxnw.utils.cleanHtml(model[i]["label"]);
                        r["y"] = model[i][tt["caption"]];
                        arrAllXY.push(r);
                    }
                }
                arrAll.push(ss);
            }
            var pointLabels = {
                show: true
            };
            if (typeof modelVal.typeFinded !== 'undefined') {
                switch (modelVal.typeFinded) {
                    case "PERCEN":
                        pointLabels = {
                            show: true,
                            formatString: '%#.2f%'
                        };
                        break;
                    case "SUM":
                        if (typeof modelVal.typeColumn != 'undefined') {
                            if (modelVal.typeColumn == 'money') {
                                pointLabels = {
                                    show: true,
                                    formatString: "$ %'.2f"
                                };
                            }
                        }
                        break;
                }
            }
            var tmpTitle = 'Inteligencia empresarial - Líneas';

            if (typeof descripcion !== 'undefined' && descripcion !== null) {
                tmpTitle = descripcion;
            }

            self.setTemporalTitle(tmpTitle);

            var pallete = self.ui["pallete"].getValue();

            var rta = {
                pallete: pallete,
                type: "lines",
                title: {
                    text: tmpTitle
                },
                animate: true,
                animateReplot: true,
                series: labels,
                seriesDefaults: {
                    renderer: "CanvasAxisLabelRenderer",
                    pointLabels: pointLabels,
                    showHighlight: false,
                    rendererOptions: {
                        animation: {
                            speed: 1500
                        }
                    },
                    tickOptions: {
                        textColor: 'black'
                    }
                },
                highlighter: {
                    show: true,
                    sizeAdjust: 7.5
                },
                axesDefaults: {
                    tickRenderer: "CanvasAxisTickRenderer",
                    borderColor: "black",
                    tickOptions: {
                        angle: -30,
                        textColor: 'black'
                    }
                },
                axesStyles: {
                    ticks: {
                        textColor: 'black'
                    },
                    label: {
                        textColor: 'black'
                    }
                },
                axes: {
                    xaxis: {
                        renderer: "CategoryAxisRenderer",
                        ticks: ticks,
                        rendererOptions: {
                            sortMergedLabels: true
                        }
                    },
                    yaxis: {
                        pad: 1.05
                    }
                },
                legend: {
                    show: true,
                    placement: 'insideGrid'
                },
                cursor: {
                    show: true,
                    zoom: true
                }
            };
            var grid = self.getSavedValues("grid");
            if (grid != null && grid != false) {
                rta.grid = grid;
            }
            var gridShow = self.getSavedValues("grid_show_vertical");
            if (gridShow != null && gridShow != false) {
                rta.axes.xaxis.tickOptions = gridShow;
            }
            var gridShow = self.getSavedValues("grid_show_horizontal");
            if (gridShow != null && gridShow != false) {
                rta.axes.yaxis.tickOptions = gridShow;
            }
            var fontSize = self.getSavedValues("letra_xy");
            if (fontSize != null && fontSize != "" && fontSize != false) {
                rta.axesDefaults.tickOptions.fontSize = fontSize + "px";
            }
            var legend = self.getSavedValues("legend");
            if (legend != false && typeof legend.show != 'undefined') {
                if (legend.show == false && legend.placement == "outsideGrid") {
                    legend.show = true;
                }
                rta.legend = legend;
            } else {
                rta.legend = {
                    show: true,
                    placement: 'insideGrid'
                };
            }
            var title = self.getSavedValues("title");
            if (title != null && title != false && title != "") {
                if (typeof title.text == 'undefined') {
                    title.text = rta.title.text;
                }
                rta.title = title;
            }
            try {
                var haveXYLabels = self.getSavedValues("xylabels");
                if (haveXYLabels != null && haveXYLabels != false) {
                    if (haveXYLabels === true) {
                        var yLabel = self.__parentInit.checkAndGetFila();
                        if (yLabel !== false) {
                            rta.axes.xaxis.label = yLabel;
                        }
                        var xLabel = self.__parentInit.checkAndGetValue();
                        if (xLabel !== false) {
                            rta.axes.yaxis.label = xLabel;
                        }
                    }
                }
            } catch (e) {

            }
            var plugins = ['canvasTextRenderer'];
            if (self.useNewChart) {
                return new qxnw.chartsNew(arrAllXY, rta, plugins, labels, ticks);
            } else {
                return new qxnw.charts(arrAll, rta, plugins);
            }
        },
        bars3d: function bars3d(model, modelVal, descripcion) {
            var self = this;
            var arrAll = [];
            var arrAllXY = [];
            var ticks = [];
            var labels = [];
            for (var i = 0; i < model.length; i++) {
                try {
                    delete model[i].fila;
                } catch (e) {

                }
                try {
                    delete model[i].key;
                } catch (e) {

                }
                try {
                    delete model[i].row;
                } catch (e) {

                }
            }
            for (var i = 0; i < model.length; i++) {
                if (model[i]["level"] == 0) {
                    var label = model[i]["label"];
                    if (label == "") {
                        ticks.push("(en blanco)");
                    } else {
                        try {
                            label = qxnw.utils.cleanHtml(label);
                        } catch (e) {

                        }
                        ticks.push(label);
                    }
                }
            }

            var colors = self.getSavedValues("colores");
            var anchoBarras = self.getSavedValues("ancho_barras");
            var labelSize = self.getSavedValues("leyenda_size");
            if (typeof labelSize == 'undefined' || labelSize == null || labelSize == "") {
                labelSize = 2;
            }
            for (var ia = 0; ia < self.values.length; ia++) {
                var tt = self.values[ia];
                var label = tt["caption"];
                if (label == "") {
                    label = "(en blanco)";
                }
                label = "<font size='" + labelSize + "'>" + label + "</font>";
                if (typeof colors[ia] != 'undefined') {
                    if (typeof anchoBarras != 'undefined' && anchoBarras != "") {
                        labels.push({label: label, color: colors[ia], rendererOptions: {barWidth: anchoBarras}});
                    } else {
                        labels.push({label: label, color: colors[ia]});
                    }
                } else if (typeof anchoBarras != 'undefined' && anchoBarras != "") {
                    labels.push({label: label, rendererOptions: {barWidth: anchoBarras}});
                } else {
                    labels.push({label: label});
                }
                if (typeof tt["noEnter"] != 'undefined') {
                    continue;
                }
                var ss = [];
                for (var i = 0; i < model.length; i++) {
                    if (model[i]["level"] == 0) {
                        ss.push(model[i][tt["caption"]]);
                        var r = {};
                        r["x"] = qxnw.utils.cleanHtml(model[i]["label"]);
                        r["y"] = model[i][tt["caption"]];
                        arrAllXY.push(r);
                    }
                }
                arrAll.push(ss);
            }
            var options = function ($jqplot) {
                var pointLabels = {
                    show: true,
                    hideZeros: true
                };
                if (typeof modelVal.typeFinded != 'undefined') {
                    switch (modelVal.typeFinded) {
                        case "PERCEN":
                            pointLabels = {
                                show: true,
                                hideZeros: true,
                                formatString: '%#.2f%'
                            };
                            break;
                        case "SUM":
                            if (typeof modelVal.typeColumn != 'undefined') {
                                if (modelVal.typeColumn == 'money') {
                                    pointLabels = {
                                        show: true,
                                        hideZeros: true,
                                        formatString: "$ %'.2f"
                                    };
                                }
                            }
                            break;
                    }
                }
                var tmpTitle = self.tr('Inteligencia empresarial - Valores porcentuales');

                if (typeof descripcion !== 'undefined' && descripcion !== null) {
                    tmpTitle = descripcion;
                }

                self.setTemporalTitle(tmpTitle);
                var pallete = self.ui["pallete"].getValue();
                var rta = {
                    pallete: pallete,
                    type: "bar3d",
                    title: {
                        text: tmpTitle
                    },
                    animate: true,
                    animateReplot: true,
                    series: labels,
                    stackSeries: true,
                    seriesDefaults: {
                        renderer: $jqplot.BarRenderer,
                        pointLabels: pointLabels,
                        showHighlight: false,
                        rendererOptions: {
                            animation: {
                                speed: 1500
                            }
                        }
                    },
                    highlighter: {
                        show: true,
                        sizeAdjust: 7.5
                    },
                    axesDefaults: {
                        tickRenderer: $jqplot.CanvasAxisTickRenderer,
                        borderColor: "black",
                        tickOptions: {
                            angle: -30,
                            textColor: 'black'
                        }
                    },
                    axesStyles: {
                        ticks: {
                            textColor: 'black'
                        },
                        label: {
                            textColor: 'black'
                        }
                    },
                    axes: {
                        xaxis: {
                            renderer: $jqplot.CategoryAxisRenderer,
                            ticks: ticks,
                            rendererOptions: {
                                sortMergedLabels: true
                            }
                        },
                        yaxis: {
                            pad: 1.05,
                            min: 0
                        }
                    },
                    legend: {
                        show: true,
                        placement: 'insideGrid'
                    }
                };
                var grid = self.getSavedValues("grid");
                if (grid != null && grid != false) {
                    rta.grid = grid;
                }
                var gridShow = self.getSavedValues("grid_show_vertical");
                if (gridShow != null && gridShow != false) {
                    rta.axes.xaxis.tickOptions = gridShow;
                }
                var gridShow = self.getSavedValues("grid_show_horizontal");
                if (gridShow != null && gridShow != false) {
                    rta.axes.yaxis.tickOptions = gridShow;
                }
                var fontSize = self.getSavedValues("letra_xy");
                if (fontSize != null && fontSize != "" && fontSize != false) {
                    rta.axesDefaults.tickOptions.fontSize = fontSize + "px";
                }
                var legend = self.getSavedValues("legend");
                if (legend != false && typeof legend.show != 'undefined') {
                    if (legend.show == false && legend.placement == "outsideGrid") {
                        legend.show = true;
                    }
                    rta.legend = legend;
                } else {
                    rta.legend = {
                        show: true,
                        placement: 'insideGrid'
                    };
                }
                var title = self.getSavedValues("title");
                if (title != null && title != false && title != "") {
                    if (typeof title.text == 'undefined') {
                        title.text = rta.title.text;
                    }
                    rta.title = title;
                }
                try {
                    var haveXYLabels = self.getSavedValues("xylabels");
                    if (haveXYLabels != null && haveXYLabels != false) {
                        if (haveXYLabels === true) {
                            var yLabel = self.__parentInit.checkAndGetFila();
                            if (yLabel !== false) {
                                rta.axes.xaxis.label = yLabel;
                            }
                            var xLabel = self.__parentInit.checkAndGetValue();
                            if (xLabel !== false) {
                                rta.axes.yaxis.label = xLabel;
                            }
                        }
                    }
                } catch (e) {

                }
                return rta;
            };
            var plugins = ['canvasTextRenderer', 'canvasAxisTickRenderer', 'categoryAxisRenderer', 'barRenderer'];
            return new qxnw.charts(arrAll, options, plugins);
        },
        bars: function bars(model, modelVal, descripcion) {
            var self = this;
            var rta = false;
            var arrAll = [];
            var arrAllXY = [];
            var ticks = [];
            var labels = [];
            //CLEAN MODEL
            for (var i = 0; i < model.length; i++) {
                try {
                    delete model[i].fila;
                } catch (e) {

                }
                try {
                    delete model[i].key;
                } catch (e) {

                }
                try {
                    delete model[i].row;
                } catch (e) {

                }
            }
            for (var i = 0; i < model.length; i++) {
                if (model[i]["level"] == 0) {
                    var label = model[i]["label"];
                    if (label == "") {
                        ticks.push("(en blanco)");
                    } else {
                        try {
                            label = qxnw.utils.cleanHtml(label);
                        } catch (e) {

                        }
                        ticks.push(label);
                    }
                }
            }
            var colors = self.getSavedValues("colores");
            var anchoBarras = self.getSavedValues("ancho_barras");
            var labelSize = self.getSavedValues("leyenda_size");
            if (typeof labelSize == 'undefined' || labelSize == null || labelSize == "") {
                labelSize = 2;
            }
            for (var ia = 0; ia < self.values.length; ia++) {
                var tt = self.values[ia];
                var label = tt["caption"];
                if (label == "") {
                    label = "(en blanco)";
                }
                label = "<font size='" + labelSize + "'>" + label + "</font>";
                if (typeof colors[ia] != 'undefined') {
                    if (typeof anchoBarras != 'undefined' && anchoBarras != "") {
                        labels.push({label: label, color: colors[ia], rendererOptions: {barWidth: anchoBarras}});
                    } else {
                        labels.push({label: label, color: colors[ia]});
                    }
                } else if (typeof anchoBarras != 'undefined' && anchoBarras != "") {
                    labels.push({label: label, rendererOptions: {barWidth: anchoBarras}});
                } else {
                    labels.push({label: label});
                }
                if (typeof tt["noEnter"] != 'undefined') {
                    continue;
                }
                var ss = [];
                for (var i = 0; i < model.length; i++) {
                    if (model[i]["level"] == 0) {
                        ss.push(model[i][tt["caption"]]);
                        var r = {};
                        r["x"] = qxnw.utils.cleanHtml(model[i]["label"]);
                        r["y"] = model[i][tt["caption"]];
                        arrAllXY.push(r);
                    }
                }
                arrAll.push(ss);
            }

            var pointLabels = {
                show: true
            };
            if (typeof modelVal.typeFinded != 'undefined') {
                switch (modelVal.typeFinded) {
                    case "PERCEN":
                        pointLabels = {
                            show: true,
                            formatString: "%#.2f%"
                        };
                        break;
                    case "SUM":
                        if (typeof modelVal.typeColumn != 'undefined') {
                            if (modelVal.typeColumn == 'money') {
                                pointLabels = {
                                    show: true,
                                    formatString: "$ %'.2f"
                                };
                            }
                        }
                        break;
                }
            }
            var tmpTitle = 'Inteligencia empresarial - Barras';

            if (typeof descripcion !== 'undefined' && descripcion !== null) {
                tmpTitle = descripcion;
            }

            self.setTemporalTitle(tmpTitle);
            var pallete = self.ui["pallete"].getValue();
            var rta = {
                pallete: pallete,
                type: "bar",
                title: {
                    text: tmpTitle
                },
                fontSize: '50pt',
                animate: true,
                animateReplot: true,
                series: labels,
                seriesDefaults: {
                    renderer: "BarRenderer",
                    pointLabels: pointLabels,
                    showHighlight: false,
                    label: {
                        textColor: 'black'
                    },
                    rendererOptions: {
                        animation: {
                            speed: 1500
                        }
                    }
                },
                highlighter: {
                    show: true,
                    sizeAdjust: 7.5
                },
                axesStyles: {
                    ticks: {
                        textColor: 'black'
                    },
                    label: {
                        textColor: 'black'
                    }
                },
                axesDefaults: {
                    tickRenderer: "CanvasAxisTickRenderer",
                    labelRenderer: "CanvasAxisLabelRenderer",
                    borderColor: "black",
                    rendererOptions: {
                        smooth: true
                    },
                    tickOptions: {
                        angle: -60,
                        textColor: 'black'
                    }
                },
                axes: {
                    xaxis: {
                        renderer: "CategoryAxisRenderer",
                        ticks: ticks,
                        pad: 0,
                        rendererOptions: {
                            sortMergedLabels: true
                        }
                    },
                    yaxis: {
                        pad: 1.10,
                        min: 0
                    }
                },
                legend: {
                    show: true,
                    placement: 'insideGrid'
                },
                cursor: {
                    show: true,
                    zoom: true
                },
                grid: {
                    background: 'black',
                    gridLineColor: 'black',
                    borderColor: 'black'
                }
            };
            try {
                var haveXYLabels = self.getSavedValues("xylabels");
                if (haveXYLabels != null && haveXYLabels != false) {
                    if (haveXYLabels === true) {
                        var yLabel = self.__parentInit.checkAndGetFila();
                        if (yLabel !== false) {
                            rta.axes.xaxis.label = yLabel;
                        }
                        var xLabel = self.__parentInit.checkAndGetValue();
                        if (xLabel !== false) {
                            rta.axes.yaxis.label = xLabel;
                        }
                    }
                }
            } catch (e) {

            }
            var grid = self.getSavedValues("grid");
            if (grid != null && grid != false) {
                rta.grid = grid;
            }
            var gridShow = self.getSavedValues("grid_show_vertical");
            if (gridShow != null && gridShow != false) {
                rta.axes.xaxis.tickOptions = gridShow;
            }
            var fontSize = self.getSavedValues("letra_xy");
            if (fontSize != null && fontSize != "" && fontSize != false) {
                rta.axesDefaults.tickOptions.fontSize = fontSize + "px";
            }
            var gridShow = self.getSavedValues("grid_show_horizontal");
            if (gridShow != null && gridShow != false) {
                rta.axes.yaxis.tickOptions = gridShow;
            }
            var legend = self.getSavedValues("legend");
            if (legend != false && typeof legend.show != 'undefined') {
                if (legend.show == false && legend.placement == "outsideGrid") {
                    legend.show = true;
                }
                rta.legend = legend;
            } else {
                rta.legend = {
                    show: true,
                    placement: 'insideGrid'
                };
            }
            var title = self.getSavedValues("title");
            if (title != null && title != false && title != "") {
                if (typeof title.text == 'undefined') {
                    title.text = rta.title.text;
                }
                title.textColor = 'black';
                rta.title = title;
            }
            var plugins = ['canvasTextRenderer', 'canvasAxisTickRenderer', 'categoryAxisRenderer', 'barRenderer'];
            try {
                if (self.useNewChart) {
                    return new qxnw.chartsNew(arrAllXY, rta, plugins, labels, ticks);
                } else {
                    rta = new qxnw.charts(arrAll, rta, plugins);
                }
            } catch (e) {
                console.log(e);
            }
            return rta;
        },
        horizontalBar: function horizontalBar(model, modelVal, descripcion) {
            var self = this;
            var rta = false;
            var arrAll = [];
            var arrAllXY = [];
            var ticks = [];
            var labels = [];
            //CLEAN MODEL
            for (var i = 0; i < model.length; i++) {
                try {
                    delete model[i].fila;
                } catch (e) {

                }
                try {
                    delete model[i].key;
                } catch (e) {

                }
                try {
                    delete model[i].row;
                } catch (e) {

                }
            }
            for (var i = 0; i < model.length; i++) {
                if (model[i]["level"] == 0) {
                    var label = model[i]["label"];
                    if (label == "") {
                        ticks.push("(en blanco)");
                    } else {
                        try {
                            label = qxnw.utils.cleanHtml(label);
                        } catch (e) {

                        }
                        ticks.push(label);
                    }
                }
            }
            var colors = self.getSavedValues("colores");
            var anchoBarras = self.getSavedValues("ancho_barras");
            var labelSize = self.getSavedValues("leyenda_size");
            if (typeof labelSize == 'undefined' || labelSize == null || labelSize == "") {
                labelSize = 2;
            }
            for (var ia = 0; ia < self.values.length; ia++) {
                var tt = self.values[ia];
                var label = tt["caption"];
                if (label == "") {
                    label = "(en blanco)";
                }
                label = "<font size='" + labelSize + "'>" + label + "</font>";
                if (typeof colors[ia] != 'undefined') {
                    if (typeof anchoBarras != 'undefined' && anchoBarras != "") {
                        labels.push({label: label, color: colors[ia], rendererOptions: {barWidth: anchoBarras}});
                    } else {
                        labels.push({label: label, color: colors[ia]});
                    }
                } else if (typeof anchoBarras != 'undefined' && anchoBarras != "") {
                    labels.push({label: label, rendererOptions: {barWidth: anchoBarras}});
                } else {
                    labels.push({label: label});
                }
                if (typeof tt["noEnter"] != 'undefined') {
                    continue;
                }
                var ss = [];
                for (var i = 0; i < model.length; i++) {
                    if (model[i]["level"] == 0) {
                        ss.push(model[i][tt["caption"]]);
                        var r = {};
                        r["x"] = qxnw.utils.cleanHtml(model[i]["label"]);
                        r["y"] = model[i][tt["caption"]];
                        arrAllXY.push(r);
                    }
                }
                arrAll.push(ss);
            }

            var pointLabels = {
                show: true
            };
            if (typeof modelVal.typeFinded != 'undefined') {
                switch (modelVal.typeFinded) {
                    case "PERCEN":
                        pointLabels = {
                            show: true,
                            formatString: "%#.2f%"
                        };
                        break;
                    case "COUNT":
                        pointLabels = {
                            show: true,
                            formatString: "%#.2f%"
                        };
                        break;
                    case "SUM":
                        if (typeof modelVal.typeColumn != 'undefined') {
                            if (modelVal.typeColumn == 'money') {
                                pointLabels = {
                                    show: true,
                                    formatString: "$ %'.2f"
                                };
                            }
                        }
                        break;
                }
            }
            var tmpTitle = 'Inteligencia empresarial - Barras';

            if (typeof descripcion !== 'undefined' && descripcion !== null) {
                tmpTitle = descripcion;
            }

            self.setTemporalTitle(tmpTitle);
            var pallete = self.ui["pallete"].getValue();
            var rta = {
                pallete: pallete,
                type: "horizontalBar",
                title: {
                    text: tmpTitle
                },
                fontSize: '50pt',
                animate: true,
                animateReplot: true,
                series: labels,
                seriesDefaults: {
                    renderer: "BarRenderer",
                    pointLabels: pointLabels,
                    showHighlight: false,
                    label: {
                        textColor: 'black'
                    },
                    rendererOptions: {
                        animation: {
                            speed: 1500
                        }
                    }
                },
                highlighter: {
                    show: true,
                    sizeAdjust: 7.5
                },
                axesStyles: {
                    ticks: {
                        textColor: 'black'
                    },
                    label: {
                        textColor: 'black'
                    }
                },
                axesDefaults: {
                    tickRenderer: "CanvasAxisTickRenderer",
                    labelRenderer: "CanvasAxisLabelRenderer",
                    borderColor: "black",
                    rendererOptions: {
                        smooth: true
                    },
                    tickOptions: {
                        angle: -60,
                        textColor: 'black'
                    }
                },
                axes: {
                    xaxis: {
                        renderer: "CategoryAxisRenderer",
                        ticks: ticks,
                        pad: 0,
                        rendererOptions: {
                            sortMergedLabels: true
                        }
                    },
                    yaxis: {
                        pad: 1.10,
                        min: 0
                    }
                },
                legend: {
                    show: true,
                    placement: 'insideGrid'
                },
                cursor: {
                    show: true,
                    zoom: true
                },
                grid: {
                    background: 'black',
                    gridLineColor: 'black',
                    borderColor: 'black'
                }
            };
            try {
                var haveXYLabels = self.getSavedValues("xylabels");
                if (haveXYLabels != null && haveXYLabels != false) {
                    if (haveXYLabels === true) {
                        var yLabel = self.__parentInit.checkAndGetFila();
                        if (yLabel !== false) {
                            rta.axes.xaxis.label = yLabel;
                        }
                        var xLabel = self.__parentInit.checkAndGetValue();
                        if (xLabel !== false) {
                            rta.axes.yaxis.label = xLabel;
                        }
                    }
                }
            } catch (e) {

            }
            var grid = self.getSavedValues("grid");
            if (grid != null && grid != false) {
                rta.grid = grid;
            }
            var gridShow = self.getSavedValues("grid_show_vertical");
            if (gridShow != null && gridShow != false) {
                rta.axes.xaxis.tickOptions = gridShow;
            }
            var fontSize = self.getSavedValues("letra_xy");
            if (fontSize != null && fontSize != "" && fontSize != false) {
                rta.axesDefaults.tickOptions.fontSize = fontSize + "px";
            }
            var gridShow = self.getSavedValues("grid_show_horizontal");
            if (gridShow != null && gridShow != false) {
                rta.axes.yaxis.tickOptions = gridShow;
            }
            var legend = self.getSavedValues("legend");
            if (legend != false && typeof legend.show != 'undefined') {
                if (legend.show == false && legend.placement == "outsideGrid") {
                    legend.show = true;
                }
                rta.legend = legend;
            } else {
                rta.legend = {
                    show: true,
                    placement: 'insideGrid'
                };
            }
            var title = self.getSavedValues("title");
            if (title != null && title != false && title != "") {
                if (typeof title.text == 'undefined') {
                    title.text = rta.title.text;
                }
                title.textColor = 'black';
                rta.title = title;
            }
            var plugins = ['canvasTextRenderer', 'canvasAxisTickRenderer', 'categoryAxisRenderer', 'barRenderer'];
            try {
                if (self.useNewChart) {
                    return new qxnw.chartsNew(arrAll, rta, plugins, labels, ticks);
                } else {
                    rta = new qxnw.charts(arrAll, rta, plugins);
                }
            } catch (e) {
                console.log(e);
            }
            return rta;
        },
        pie: function pie(model, test, descripcion) {
            var self = this;
            var arrAll = [];
            var arrAllXY = [];
            var labels = [];
            var ticks = [];
            for (var i = 0; i < model.length; i++) {
                try {
                    delete model[i].fila;
                } catch (e) {

                }
                try {
                    delete model[i].key;
                } catch (e) {

                }
                try {
                    delete model[i].row;
                } catch (e) {

                }
            }
            for (var i = 0; i < model.length; i++) {
                if (model[i]["level"] == 0) {
                    var label = model[i]["label"];
                    if (label == "") {
                        ticks.push("(en blanco)");
                    } else {
                        try {
                            label = qxnw.utils.cleanHtml(label);
                        } catch (e) {

                        }
                        ticks.push(label);
                    }
                }
            }
            var colors = self.getSavedValues("colores");
            var anchoBarras = self.getSavedValues("ancho_barras");
            var labelSize = self.getSavedValues("leyenda_size");
            for (var ia = 0; ia < self.values.length; ia++) {
                var tt = self.values[ia];
                var label = tt["caption"];
                if (label == "") {
                    label = "(en blanco)";
                }
                label = "<font size='" + labelSize + "'>" + label + "</font>";
                if (typeof colors[ia] != 'undefined') {
                    if (typeof anchoBarras != 'undefined' && anchoBarras != "") {
                        labels.push({label: label, color: colors[ia], rendererOptions: {barWidth: anchoBarras}});
                    } else {
                        labels.push({label: label, color: colors[ia]});
                    }
                } else if (typeof anchoBarras != 'undefined' && anchoBarras != "") {
                    labels.push({label: label, rendererOptions: {barWidth: anchoBarras}});
                } else {
                    labels.push({label: label});
                }
//                var subArrays = [];
//                var counter = 0;
//                for (var i = 0; i < model.length; i++) {
//                    if (model[i]["label"] != "<b>Total General</b>") {
//                        if (model[i].level == 0) {
//                            subArrays[counter] = [model[i]["label"], model[i][tt["columnId"]]];
//                            counter++;
//                        }
//                    }
//                }
//                arrAll.push(subArrays);
                var ss = [];
                for (var i = 0; i < model.length; i++) {
                    if (model[i]["level"] == 0) {
                        ss.push(model[i][tt["caption"]]);
                        var r = {};
                        r["x"] = qxnw.utils.cleanHtml(model[i]["label"]);
                        r["y"] = model[i][tt["caption"]];
                        arrAllXY.push(r);
                    }
                }
                arrAll.push(ss);
                if (typeof tt["noEnter"] != 'undefined') {
                    continue;
                }
                if (typeof tt["model"] != 'undefined') {
                    continue;
                }
            }
            if (self.values.length == 0) {
                var subArrays = [];
                subArrays[counter] = 0;
                arrAll.push(subArrays);
            }
            var tmpTitle = 'Inteligencia empresarial - Torta';

            if (typeof descripcion !== 'undefined' && descripcion !== null) {
                tmpTitle = descripcion;
            }

            self.setTemporalTitle(tmpTitle);
            var pallete = self.ui["pallete"].getValue();
            var rta = {
                pallete: pallete,
                type: "pie",
                title: {
                    text: tmpTitle
                },
                seriesDefaults: {
                    renderer: "PieRenderer",
                    rendererOptions: {
                        showDataLabels: true,
                        padding: 10,
                        sliceMargin: 6
                    },
                    animation: {
                        speed: 1500
                    }
                },
                axesDefaults: {
                    borderColor: "black"
                },
                highlighter: {
                    show: true,
                    useAxesFormatters: false,
                    tooltipFormatString: '%s'
                },
                animate: true,
                animateReplot: true,
                legend: {
                    show: true,
                    location: 'e'
                }
            }
            ;
            var grid = self.getSavedValues("grid");
            if (grid != null && grid != false) {
                rta.grid = grid;
            }
            var legend = self.getSavedValues("legend");
            if (legend != false && typeof legend.show != 'undefined') {
                if (legend.show == false && legend.placement == "outsideGrid") {
                    legend.show = true;
                }
                rta.legend = legend;
            } else {
                rta.legend = {
                    show: true,
                    placement: 'insideGrid'
                };
            }
            var title = self.getSavedValues("title");
            if (title != null && title != false && title != "") {
                if (typeof title.text == 'undefined') {
                    title.text = rta.title.text;
                }
                rta.title = title;
            }
            var plugins = ['pieRenderer', 'highlighter'];
            if (self.useNewChart) {
                return new qxnw.chartsNew(arrAll, rta, plugins, labels, ticks);
            } else {
                return new qxnw.charts(arrAll, rta, plugins);
            }
        },
        globes: function globes(model) {
            //var data = [[['ranas', 3], ['buitres', 7], ['ciervos', 2.5], ['pavos', 6], ['topos', 5], ['perros', 4]]];
            var self = this;
            var arrAll = [];
            for (var ia = 0; ia < self.values.length; ia++) {
                var tt = self.values[ia];
                if (typeof tt["model"] != 'undefined') {
                    continue;
                }
                var subArrays = [];
                var counter = 0;
                for (var i = 0; i < model.length; i++) {
                    if (model[i]["label"] != "<b>Total General</b>") {
                        subArrays[counter] = [model[i]["label"], model[i][tt["columnId"]]];
                        counter++;
                    }
                }
                arrAll.push(subArrays);
            }
            if (self.values.length == 0) {
                var subArrays = [];
                subArrays[counter] = 0;
                arrAll.push(subArrays);
            }
            //TODO_ POR SOLUCIONAR
            var arr = [[11, 123, 1236, "Acura"], [45, 92, 1067, "Alfa Romeo"],
                [24, 104, 1176, "AM General"], [50, 23, 610, "Aston Martin Lagonda"],
                [18, 17, 539, "Audi"], [7, 89, 864, "BMW"], [2, 13, 1026, "Bugatti"]];
            var options = function ($jqplot) {
                return{
                    title: 'Inteligencia empresarial - Globos',
                    seriesDefaults: {
                        renderer: $jqplot.BubbleRenderer,
                        rendererOptions: {
                            bubbleAlpha: 0.6,
                            highlightAlpha: 0.8
                        },
                        shadow: true,
                        shadowAlpha: 0.05
                    }
                };
            };
            var plugins = ['bubbleRenderer'];
            return new qxnw.charts([arr], options, plugins);
        },
        hardLines: function hardLines(data, ticks, labels) {
//            var data = [
            //                [[2, 1], [4, 2], [6, 3], [3, 4]],
            //                [[5, 1], [1, 2], [3, 3], [4, 4]],
            //                [[4, 1], [7, 2], [1, 3], [2, 4]]];
            var options = function ($jqplot) {
                return{
                    title: 'Test de charts interactivos',
                    series: labels,
                    seriesDefaults: {
                        renderer: $jqplot.BarRenderer,
// Show point labels to the right ('e'ast) of each bar.
                        // edgeTolerance of -15 allows labels flow outside the grid
                        // up to 15 pixels.  If they flow out more than that, they 
                        // will be hidden.
                        pointLabels: {show: true, location: 'e', edgeTolerance: -15},
                        // Rotate the bar shadow as if bar is lit from top right.
                        shadowAngle: 135,
                        // Here's where we tell the chart it is oriented horizontally.
                        rendererOptions: {
                            barDirection: 'horizontal'
                        },
                        axes: {
                            yaxis: {
                                renderer: $jqplot.CategoryAxisRenderer
                            },
                            xaxis: {
                                ticks: ticks
                            }
                        }
                    },
                    legend: {show: true}
                };
            };
            var plugins = ['lineRenderer'];
            if (self.useNewChart) {
                return new qxnw.chartsNew(arrAll, options, plugins);
            } else {
                return new qxnw.charts(data, options, plugins);
            }
        }
    }

});
