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

/**
 * List style and all functionality for your lists. You can create a <code>list</code> very fast!
 */
qx.Class.define("qxnw.table.table", {
    extend: qx.ui.table.Table,
    /**
     * Event fired on edit one cell
     */
    events: {
        focusoutInput: "qx.event.type.Data",
        focusOutDate: "qx.event.type.Data",
        changeData: "qx.event.type.Data",
        editCell: "qx.event.type.Data",
        inputTextField: "qx.event.type.Data",
        headerColKeyPress: "qx.event.type.Data",
        headerColClick: "qx.event.type.Data",
        headerColInput: "qx.event.type.Data",
        metaColumnsChanged: "qx.event.type.Data",
        cellCheckbox: "qx.event.type.Data",
        setModelDataSTF: "qx.event.type.Data",
        storeOrderSaved: "qx.event.type.Data"
    },
    construct: function construct(tableModel, custom) {
        if (!custom) {
            custom = {};
        }

        if (!qx.lang.Type.isFunction(custom.tablePaneHeader)) {
            custom.tablePaneHeader = function (obj) {
                return new qxnw.table.optimizedHeader(obj);
            };
        }

        this.base(arguments, tableModel, custom);
        var self = this;

//        self.setDragScrollSlowDownFactor(1); 

//            //INTENTO DE SOLUCIONAR LA VELOCIDAD DE MOVIMIENTO DEL SCROLL DEL TABLE
//        self.addListener("appear", function (e) {
//            var p = self.getPaneScroller(0);
//            var el = self.getContentElement().getDomElement();
//            var handleScroll = function (evt) {
//                console.log("entra!");
//                if (!evt) {
//                    evt = event;
//                }
//                var w = evt.wheelDelta, d = evt.detail;
//                console.log(w);
//                if (d) {
//                    if (w) {
//                        return w / d / 40 * d > 0 ? 1 : -1;
//                    } else {
//                        return -d / 3;
//                    }
//                } else {
//                    return w / 120;
//                }
//            };
//            el.addEventListener('DOMMouseScroll', handleScroll, false); // for Firefox
//            el.addEventListener('mousewheel', handleScroll, false); // for everyone else
//        });

//var p = self.getPaneScroller(0);
//        p.getChildControl("scrollbar-y").set({
//            singleStep: 100
//        });

//        self.setDragScrollThresholdX(-10);
//        self.setDragScrollThresholdY(-10);
//        self.setDragScrollSlowDownFactor(-0.5);

        self.__columnDataWidth = [];
        self.getTableColumnModel().addListener("orderChanged", function (e) {
            self.__storeOrderChanged(e);
        });
        self.getTableColumnModel().addListener("widthChanged", function (e) {
            self.__storeColumnsWidth(e);
        });
        self.getTableColumnModel().addListener("visibilityChanged", function (e) {
            try {
                if (self.parent != null) {
                    var timer = new qx.event.Timer(500);
                    timer.start();
                    timer.addListener("interval", function (e) {
                        this.stop();
                        try {
                            if (typeof self.parent.populateColumnColors != 'undefined') {
                                self.parent.populateColumnColors();
                            }
                        } catch (e) {
                            console.log(e);
                        }
                    });
                }
            } catch (e) {

            }
        });

        self.addListener("metaColumnsChanged", function (e) {
            var d = e.getData();
            try {
                var count = 0;
                if (typeof d.scrollers == 'undefined') {
                    count = self.getMetaColumnCounts().length;
                } else {
                    count = d.scrollers;
                }
                for (var i = 1; i < count; i++) {
                    self.getPaneScroller(i).getHeader().addListener("contextmenu", function (e) {
                        if (self.getEnabledFilters() == false) {
                            e.stop();
                            return;
                        }
                        self.createFilterForm(e);
                        e.stop();
                    }, this);
                }
            } catch (e) {
                console.log(e);
            }
        });

//        TODO: ADD THE following TO THE CLASS Table in Qooxdoo
//        try {
//            var data = {};
//            data["eventFired"] = "changedMetaColumns";
//            this.fireDataEvent("metaColumnsChanged", data);
//        } catch (e) {
//
//        }


        self.getPaneScroller(0).getHeader().addListener("contextmenu", function (e) {
            if (self.getEnabledFilters() == false) {
                e.stop();
                return;
            }
            self.createFilterForm(e);
            e.stop();
        }, this);
        self.p_filter = [];
        self.p_checks = [];
        self.p_checksArr = [];
        self.getPaneScroller(0).addListener("beforeSort", function (e) {
            var d = e.getData();
            try {
                if (d.tapEvent.getTarget().getAppearance() == "textfield") {
                    e.preventDefault();
                }
            } catch (e) {
                qxnw.utils.error(e);
            }
        });
        self.addListener("columnVisibilityMenuCreateStart", function (data) {
            var columnButton = self.getChildControl("column-button");
            var menuButton = columnButton.factory("simple-checkbox", {
                text: self.tr("Mostrar todas")
            });
            var menuButtonHide = columnButton.factory("simple-checkbox", {
                text: self.tr("Ocultar todas")
            });
            menuButton.setIcon(qxnw.config.execIcon("dialog-ok"));
            menuButtonHide.setIcon(qxnw.config.execIcon("dialog-cancel"));
            columnButton.getMenu().add(menuButton);
            columnButton.getMenu().add(menuButtonHide);
            columnButton.factory("separator");
            var tableModel = self.getTableModel();
            menuButton.addListener("changeValue", function (e) {
                var change = true;
                for (var col = 0, l = tableModel.getColumnCount(); col < l; col++) {
                    self.getTableColumnModel().setColumnVisible(col, change);
                    var data = {
                        col: col,
                        visible: change
                    };
                    self.getTableColumnModel().fireDataEvent("visibilityChangedPre", data);
                    self.getTableColumnModel().fireDataEvent("visibilityChanged", data);
                }
                e.stop();
            }, this);
            menuButtonHide.addListener("changeValue", function (e) {
                var change = false;
                for (var col = 0, l = tableModel.getColumnCount(); col < l; col++) {
                    self.getTableColumnModel().setColumnVisible(col, change);
                    var data = {
                        col: col,
                        visible: change
                    };
                    self.getTableColumnModel().fireDataEvent("visibilityChangedPre", data);
                    self.getTableColumnModel().fireDataEvent("visibilityChanged", data);
                }
                e.stop();
            }, this);
        });
        self.monthsInFilters = [];
        self.yearsInFilters = [];
        self.hiddenColumnsNW = [];
    },
    destruct: function () {
        try {
            this.destroy();
            this._disposeMap("this.p_filter");
            this._disposeMap("this.p_checks");
            this._disposeMap("this.p_checksArr");
            this._disposeMap("this.monthsInFilters");
            this._disposeMap("this.monthsInFilters");
            this.dispose();
        } catch (e) {
            this.dispose();
        }
    },
    properties: {
        /**
         * block pane header updates
         */
        blockHeaderUpdate: {
            check: "Boolean",
            init: false,
            apply: "_applyBlockHeaderUpdate"
        },
        appName: {
            init: false
        }
    },
    members: {
        p_checksArr: null,
        parent: null,
        __columnDataWidth: null,
        __saveVisibility: true,
        __isSendedEventVisibility: false,
        haveToChangeVisibility: true,
        p_filter: null,
        p_checks: null,
        __enableFilters: true,
        monthsInFilters: null,
        yearsInFilters: null,
        getAppWidgetName: function getAppWidgetName() {
            var name = this.classname;
            var n = this.getAppName();
            if (n === null) {
                return name;
            } else {
                return n;
            }
        },
        setAppWidgetName: function setAppWidgetName(name) {
            name = name.replace(/ /g, "_");
            name = name;
            this.setAppName(name);
        },
        //applyer
        _applyBlockHeaderUpdate: function (value, old) {
            if (value === false) {
                this.getTableColumnModel().fireDataEvent("orderChanged");
            }
        },
        setSaveVisibility: function setSaveVisibility(bool) {
            this.__saveVisibility = bool;
        },
        applySavedConfigurations: function applySavedConfigurations() {
            var self = this;
            if (self.__isSendedEventVisibility === false) {
                self.getTableColumnModel().addListener("visibilityChanged", function (e) {
                    if (self.haveToChangeVisibility === true) {
                        if (qxnw.utils.isDebug()) {
                            if (qxnw.config.getShowStorageDebug() == true) {
                                console.log("%c <<<< Change column visibility >>>>", 'background: #19760E; color: #bada55');
                                console.log("DATA: ", e.getData());
                                console.log("%c <<<< / END >>>>", 'background: #19760E; color: #bada55');
                            }
                        }
                        self.__storeVisibilityColumnChanged(e);
                    }
                });
                try {
                    self.setStoredColumnsWidth();
                    self.restoreOrder();
                    self.setTheStoredVisibilityColumns();
                } catch (e) {
                    qxnw.utils.error(e, self);
                    self.__isSendedEventVisibility = true;
                }
                self.__isSendedEventVisibility = true;
            }
        },
        getIsSendedVisibility: function getIsSendedVisibility() {
            return this.__isSendedEventVisibility;
        },
        setEnabledFilters: function setEnabledFilters(v) {
            this.__enableFilters = v;
        },
        getEnabledFilters: function getEnabledFilters(v) {
            return this.__enableFilters;
        },
        cleanFiltersOnList: function cleanFiltersOnList() {
            var self = this;
            qxnw.local.clearKey(self.getAppWidgetName() + "_qxnw.table.table");
            var tableModel = self.getTableModel();
            var filters = tableModel.Filters;
            tableModel.resetHiddenRows();
            if (self.parent.classname == "qxnw.navtable") {
                self.parent.getAllData();
            }

            var columns = self.getTableColumnModel().getVisibleColumns();
            for (var i = 0; i < columns.length; i++) {
                var indicatorPane = 0;
                try {
                    try {
                        var alter = self.getMetaColumnCounts().length;
                        indicatorPane = alter;
                    } catch (e) {
                        console.log(e);
                    }
                } catch (e) {
                }
                var ps = self.getPaneScroller(indicatorPane);
                if (typeof ps === 'undefined') {
                    ps = self.getPaneScroller(0);
                }
                var header = ps.getHeader().getHeaderWidgetAtColumn(i);
                if (typeof header !== 'undefined') {
                    header.showFilterIcon(false, null);
                }
                qxnw.local.removeByKey(self.parent.getAppWidgetName() + "_" + i + "_" + "_list_filter_dates");
            }
            if (this.p_checks != null) {
                for (var i = 0; i < this.p_filter.length; i++) {
                    if (typeof this.p_checks[i] != 'undefined') {
                        for (var ia = 0; ia < this.p_checks[i].length; ia++) {
                            this.p_checks[i][ia].setValue(false);
                        }
                    }
                }
            }
            this.p_filter.length = 0;
            this.parent.calculateByColumn();
            tableModel.Filters = filters;
            tableModel.applyFilters();
            tableModel.setStoredColumnSorted();
        },
        createFilterForm: function createFilterForm(e, colNoOpen, checks) {
            var self = this;
            var placeToPointer = true;
            if (typeof colNoOpen !== 'undefined') {
                var col = colNoOpen;
                placeToPointer = false;
            } else {
                var target = e.getTarget();
                var col = target.getUserData("cellAllInfo").col;
                if (typeof target == 'undefined' || target.getUserData("cellAllInfo") == null) {
                    return;
                }
            }

            if (self.p_filter != null && self.p_filter[col] != null && col == self.p_filter[col].getUserData("colInfo") && placeToPointer === true) {
                self.updateColumnsFilterCheck(self.p_filter[col], col);
                if (self.p_filter[col] != null) {
                    self.p_filter[col].show();
                    self.p_filter[col].placeToPointer(e);
                }
                return;
            }
            qxnw.local.removeByKey(self.parent.getAppWidgetName() + "_" + col + "_" + "_list_filter_dates");
            var p = new qx.ui.popup.Popup().set({
                allowShrinkX: true,
                allowShrinkY: true
            });
            p.addListener("keypress", function (e) {
                var key = e.getKeyIdentifier();
                var target = e.getTarget();
                if (key == "Backspace") { // 8 == backspace
                    if (qxnw.config.checkBackspaceClass(target.classname, self) === true) {
                        e.preventDefault();
                    }
                }
                return;
            });
            var displayHeight = qx.bom.Viewport.getHeight();
            var bestHeight = displayHeight / 2;
            p.setMaxHeight(parseInt(bestHeight));
            p.setMaxWidth(450);
            self.p_filter[col] = p;
            self.p_filter[col].setUserData("colInfo", col);
            if (self.__isNewFilter === true) {
                self.p_filter[col].setUserData("newFilter", true);
                self.__isNewFilter = false;
            }
            p.setLayout(new qx.ui.layout.VBox());
            self.updateColumnsFilterCheck(self.p_filter[col], col, checks);
            if (typeof colNoOpen === 'undefined') {
                p.show();
                p.placeToPointer(e);
            }
        },
        openFormFilterDates: function openFormFilterDates(col, type, masterType, options) {
            var self = this;
            if (masterType == "color") {
                if (typeof self.p_filter[col] != 'undefined') {
                    if (self.p_filter[col] != null) {
                        self.p_filter[col].setUserData("nw_data_filter", options);
                        self.p_filter[col].setUserData("nw_type_filter", masterType);
                    }
                }
                self.changeFilterRows(masterType, options);
                return;
            }
            var fields = [];
            switch (type) {
                case "entre":
                    fields = [
                        {
                            name: "fecha_inicial",
                            type: "dateField",
                            label: self.tr("Fecha inicial"),
                            required: true
                        },
                        {
                            name: "fecha_final",
                            type: "dateField",
                            label: self.tr("Fecha final"),
                            required: true
                        }
                    ];
                    break;
                case "despues":
                    fields = [
                        {
                            name: "fecha",
                            type: "dateField",
                            label: self.tr("Buscar después de:"),
                            required: true
                        }
                    ];
                    break;
                case "antes":
                    fields = [
                        {
                            name: "fecha",
                            type: "dateField",
                            label: self.tr("Buscar antes de:"),
                            required: true
                        }
                    ];
                    break;
                case "entre_number":
                    fields = [
                        {
                            name: "numero_inicial",
                            type: "spinner",
                            label: self.tr("Número inicial:"),
                            required: true
                        },
                        {
                            name: "numero_final",
                            type: "spinner",
                            label: self.tr("Número final:"),
                            required: true
                        }
                    ];
                    break;
                case "es_diferente_number":
                    fields = [
                        {
                            name: "es_diferente_number",
                            type: "spinner",
                            label: self.tr("Registros diferentes a:"),
                            required: true
                        }
                    ];
                    break;
                case "mayor_que":
                    fields = [
                        {
                            name: "mayor_que",
                            type: "spinner",
                            label: self.tr("Registros mayores a:"),
                            required: true
                        }
                    ];
                    break;
                case "mayor_o_igual_que":
                    fields = [
                        {
                            name: "mayor_o_igual_que",
                            type: "spinner",
                            label: self.tr("Registros mayores o iguales a:"),
                            required: true
                        }
                    ];
                    break;
                case "menor_que":
                    fields = [
                        {
                            name: "menor_que",
                            type: "spinner",
                            label: self.tr("Registros menores a:"),
                            required: true
                        }
                    ];
                    break;
                case "menor_o_igual_que":
                    fields = [
                        {
                            name: "menor_o_igual_que",
                            type: "spinner",
                            label: self.tr("Registros menores o iguales a:"),
                            required: true
                        }
                    ];
                    break;
                case "es_diferente":
                    fields = [
                        {
                            name: "es_diferente",
                            type: "textField",
                            label: self.tr("Registros diferentes a:"),
                            required: true
                        }
                    ];
                    break;
            }
            var f = qxnw.utils.dialog(fields, self.tr("Autofiltro"), false, false);
            f.setModal(true);
            var savedRecord = qxnw.local.getData(self.parent.getAppWidgetName() + "_" + col + "_" + "_list_filter_dates");
            if (savedRecord != null) {
                if (typeof savedRecord == "object") {
                    for (var i = 0; i < savedRecord.length; i++) {
                        var r = savedRecord[i];
                        if (r.type == type) {
                            switch (type) {
                                case "entre":
                                    f.ui.fecha_inicial.setValue(r.fecha_inicial);
                                    f.ui.fecha_final.setValue(r.fecha_final);
                                    break;
                                case "despues":
                                    f.ui.fecha.setValue(r.fecha);
                                    break;
                                case "antes":
                                    f.ui.fecha.setValue(r.fecha);
                                    break;
                                case "entre_number":
                                    f.ui.numero_inicial.setValue(r.numero_inicial);
                                    f.ui.numero_inicial.setValue(r.numero_inicial);
                                    break;
                                case "es_diferente":
                                    f.ui.es_diferente.setValue(r.es_diferente);
                                    break;
                                case "mayor_que":
                                    f.ui.mayor_que.setValue(r.mayor_que);
                                    break;
                                case "mayor_o_igual_que":
                                    f.ui.mayor_o_igual_que.setValue(r.mayor_o_igual_que);
                                    break;
                                case "menor_que":
                                    f.ui.menor_que.setValue(r.menor_que);
                                    break;
                                case "menor_o_igual_que":
                                    f.ui.menor_o_igual_que.setValue(r.menor_o_igual_que);
                                    break;
                                case "es_diferente":
                                    f.ui.es_diferente.setValue(r.es_diferente);
                                    break;
                            }
                            break;
                        }
                    }
                }
            }
            f.ui.accept.addListener("execute", function () {
                if (!f.validate()) {
                    return;
                }
                var r = f.getRecord();
                r.type = type;
                r.column = col;
                r.name = col;
                switch (type) {
                    case "entre":
                        if (qxnw.utils.compareDates(r.fecha_inicial, r.fecha_final) == 1) {
                            qxnw.utils.information(self.tr("La fecha inicial no puede ser mayor a la fecha final"));
                            return;
                        }
                        if (qxnw.utils.compareDates(r.fecha_inicial, r.fecha_final) == 0) {
                            qxnw.utils.information(self.tr("La fechas no pueden ser iguales"));
                            return;
                        }
                        break;
                    case "entre_number":
                        if (r.numero_inicial > r.numero_final) {
                            qxnw.utils.information(self.tr("El número final no puede ser menor al número inicial"));
                            return;
                        }
                        break;
                }
                qxnw.local.insertUniqueIntoData(self.parent.getAppWidgetName() + "_" + col + "_" + "_list_filter_dates", r);

                if (typeof self.p_filter[col] != 'undefined') {
                    if (self.p_filter[col] != null) {
                        self.p_filter[col].setUserData("nw_data_filter", r);
                        self.p_filter[col].setUserData("nw_type_filter", masterType);
                    }
                }
                self.changeFilterRows();
                f.close();
            });
            f.ui.cancel.addListener("execute", function () {
                f.reject();
            });
        },
        updateColumnsFilterCheck: function updateColumnsFilterCheck(parent, col, checksArray) {
            var self = this;
            var model = self.getAllRecords();
            var dataArray = [];
            parent.removeAll();
            var columnCount = [];
            var tm = self.getTableModel();
            for (var i = 0; i < model.length; i++) {
                var counter = 0;
                for (var ia in model[i]) {
                    var columnIndex = tm.getColumnIndexById(ia);
                    if (columnIndex == col) {
                        if (typeof model[i][ia] == 'undefined') {
                            model[i][ia] = '';
                        }
                        if (dataArray.indexOf(model[i][ia]) == -1) {
                            dataArray.push(model[i][ia]);
                        }
                        if (typeof columnCount[model[i][ia]] == 'undefined') {
                            columnCount[model[i][ia]] = 0;
                        }
                        columnCount[model[i][ia]] = columnCount[model[i][ia]] + 1;
                    }
                    counter++;
                }
            }
            var containerTools = new qx.ui.container.Composite(new qx.ui.layout.VBox());
            parent.add(containerTools, {
                flex: 0
            });
            var lbl = new qx.ui.basic.Label(self.tr("Seleccione el filtro que desea:")).set({
                height: 0,
                rich: true
            });
            containerTools.add(lbl, {
                flex: 0
            });
            if (dataArray.length === 0) {
                if (typeof checksArray !== 'undefined') {
                    return;
                }
                self.p_filter[col] = null;
                lbl.setHeight(20);
                lbl.setValue(self.tr("<b>&nbsp;No hay grupos disponibles&nbsp;</b>"));
                var menuButton = qxnw.utils.createMenuButton(self.tr("Limpiar filtros"), qxnw.config.execIcon("edit-clear"));
                menuButton.setShowArrow(false);
                containerTools.add(menuButton);
                menuButton.addListener("click", function () {
                    self.cleanFiltersOnList();
                    parent.hide();
                });
                parent.show();
                return;
            }
            ia = 0;
            var checks = [];

            var type = self.parent.getColumnTypeFromColumn(col);

            if (type == "spinner") {
                type = "integer";
            }
            if (type == "passwordField") {
                parent.hide();
                return;
            }

            var dataRowRenderer = self.getDataRowRenderer();
            if (typeof dataRowRenderer.getDataGroup != 'undefined') {
                var colsData = dataRowRenderer.getDataGroup();
                if (typeof dataRowRenderer != 'undefined') {
                    if (dataRowRenderer != null) {
                        if (colsData.length > 0) {
                            var menuButtonColor = qxnw.utils.createMenuButton(self.tr("Filtro de colores"), qxnw.config.execIcon("utilities-color-chooser", "apps"));
                            menuButtonColor.setUserData("col", col);
                            containerTools.add(menuButtonColor);
                            menuButtonColor.addListener("click", function () {
                                var these = this;
                                var menu = qxnw.utils.menuToButton(these);
                                menu.setUserData("colInfo", col);
                                for (var iz = 0; iz < colsData.length; iz++) {
                                    menu.addMenu(colsData[iz].developerColor, false, colsData[iz].developerColor, colsData[iz]);
                                }
                                menu.addButtonCallback(function (e, name, options) {
                                    menu.hide();
                                    self.openFormFilterDates(these.getUserData("col"), name, "color", options);
                                });
                                return;
                            });
                        }
                    }
                }
            }

            var labelMenuButton = "";
            var iconMenu = null;
            if (type == "dateField" || type == "date" || type == "dateTimeField") {
                labelMenuButton = self.tr("Filtros de fecha");
                iconMenu = qxnw.config.execIcon("office-calendar", "apps");
            } else if (type == "integer" || type == "integer" || type == "money") {
                labelMenuButton = self.tr("Filtros de número");
                iconMenu = qxnw.config.execIcon("utilities-calculator", "apps");
            } else {
                labelMenuButton = self.tr("Filtros de texto");
                iconMenu = qxnw.config.execIcon("check-spelling");
                type = "text";
            }
            var menuButtonDate = qxnw.utils.createMenuButton(labelMenuButton, iconMenu);
            menuButtonDate.setUserData("col", col);
            menuButtonDate.addListener("click", function () {
                var these = this;
                var menu = qxnw.utils.menuToButton(these);
                menu.setUserData("colInfo", col);
                if (type == "dateField" || type == "date" || type == "dateTimeField") {
                    menu.addMenu("entre", true, self.tr("Entre..."));
                    menu.addMenu("despues", true, self.tr("Después..."));
                    menu.addMenu("antes", true, self.tr("Antes..."));
                } else if (type == "integer" || type == "money") {
                    menu.addMenu("entre_number", true, self.tr("Entre..."));
                    menu.addMenu("es_diferente_number", true, self.tr("No es igual a..."));
                    menu.addMenu("mayor_que", true, self.tr("Mayor que..."));
                    menu.addMenu("mayor_o_igual_que", true, self.tr("Mayor o igual que..."));
                    menu.addMenu("menor_que", true, self.tr("Menor que..."));
                    menu.addMenu("menor_o_igual_que", true, self.tr("Menor o igual que..."));
                } else {
                    menu.addMenu("es_diferente", true, self.tr("No es igual a..."));
                }
                var savedRecord = qxnw.local.getData(self.parent.getAppWidgetName() + "_" + col + "_" + "_list_filter_dates");
                if (qxnw.utils.checkVar(savedRecord)) {
                    if (typeof savedRecord == "object") {
                        for (var i = 0; i < savedRecord.length; i++) {
                            var r = savedRecord[i];
                            var check = menu.getCheckBox(r.type);
                            check.setValue(true);
                        }
                    }
                }
                menu.addCheckCallback(function (e, name) {
                    var check = menu.getCheckBox(name);
                    var val = check.getValue();
                    if (val == false) {
                        qxnw.local.deleteFromDataByName(self.parent.getAppWidgetName() + "_" + col + "_" + "_list_filter_dates", name);
                        self.changeFilterRows();
                        menu.hide();
                    } else {
                        menu.hide();
                        self.openFormFilterDates(these.getUserData("col"), name, type);
                    }
                });
                menu.addButtonCallback(function (e, name) {
                    menu.hide();
                    self.openFormFilterDates(these.getUserData("col"), name, type);
                });
                return;
            });
            containerTools.add(menuButtonDate);

            if (type == "dateField" || type == "date" || type == "dateTimeField") {
                var menuButtonDateMonth = qxnw.utils.createMenuButton(self.tr("Búsqueda por meses"), qxnw.config.execIcon("format-indent-less"));
                menuButtonDateMonth.setUserData("col", col);
                menuButtonDateMonth.addListener("click", function () {
                    var these = this;
                    var months = self.monthsInFilters[col];
                    months = qxnw.utils.sortByKey(months, "index");
                    var menuMonths = qxnw.utils.menuToButton(these);
                    for (var i = 0; i < months.length; i++) {
                        menuMonths.setUserData("colInfo", col);
                        menuMonths.addMenu(months[i].month, false, months[i].month);
                    }
                    menuMonths.addButtonCallback(function (e, name) {
                        menuMonths.hide();
                        var col = these.getUserData("col");
                        if (typeof self.p_filter[col] != 'undefined') {
                            if (self.p_filter[col] != null) {
                                self.p_filter[col].setUserData("nw_data_filter", name);
                                self.p_filter[col].setUserData("nw_type_filter", "month");
                            }
                        }
                        self.changeFilterRows();
                    });
                });
                containerTools.add(menuButtonDateMonth);

                var menuButtonDateYear = qxnw.utils.createMenuButton(self.tr("Búsqueda por años"), qxnw.config.execIcon("office-calendar", "apps"));
                menuButtonDateYear.setUserData("col", col);
                menuButtonDateYear.addListener("click", function () {
                    var these = this;
                    var years = self.yearsInFilters[col];
                    years = years.sort();
                    var menuYears = qxnw.utils.menuToButton(these);
                    for (var i = 0; i < years.length; i++) {
                        years[i] = years[i].toString();
                        menuYears.setUserData("colInfo", col);
                        menuYears.addMenu(years[i], false, years[i]);
                    }
                    menuYears.addButtonCallback(function (e, name) {
                        menuYears.hide();
                        var col = these.getUserData("col");
                        if (typeof self.p_filter[col] != 'undefined') {
                            if (self.p_filter[col] != null) {
                                self.p_filter[col].setUserData("nw_data_filter", name);
                                self.p_filter[col].setUserData("nw_type_filter", "year");
                            }
                        }
                        self.changeFilterRows();
                    });
                });
                containerTools.add(menuButtonDateYear);
            }

//            var menuButtonFreeze = qxnw.utils.createMenuButton(self.tr("Inmobilizar columna"), qxnw.config.execIcon("object-flip-horizontal"));
//            menuButtonFreeze.setUserData("col", col);
//            menuButtonFreeze.addListener("click", function () {
//                var column = this.getUserData("col");
//                column = parseInt(column) + 1;
//                qxnw.local.storeData(self.parent.getAppWidgetName() + "_metaColumn", true);
//                if (true) {
//                    self.setMetaColumnCounts([column, -1]);
//                } else {
//                    self.setMetaColumnCounts([0, -1]);
//                }
//                self.parent.saveFooterToolbarSettings();
//            });
//            containerTools.add(menuButtonFreeze);

            var scrollCenter = new qx.ui.container.Scroll();
            scrollCenter.setHeight(900);
            parent.containerCenterAll = new qx.ui.container.Composite(new qx.ui.layout.VBox());

            scrollCenter.add(parent.containerCenterAll, {
                flex: 1
            });

            parent.add(scrollCenter, {
                flex: 1
            });

            if (dataArray.length > 0) {
                var textField = new qx.ui.form.TextField();
                textField.setPlaceholder(self.tr("Buscar..."));
                textField.setUserData("col", col);
                containerTools.add(textField);
                parent.addListener("appear", function () {
                    textField.focus();
                });
                textField.addListener("keypress", function (e) {
                    if (e.getKeyIdentifier() == "Delete" || e.getKeyIdentifier() == "Backspace") {
                        var children = parent.containerCenterAll.getChildren();
                        for (var i = 0; i < children.length; i++) {
                            if (typeof children[i] != 'undefined') {
                                if (children[i].classname == "qx.ui.form.CheckBox") {
                                    children[i].setVisibility("visible");
                                }
                            }
                        }
                    } else if (e.getKeyIdentifier() == "Escape") {
                        var c = this.getUserData("col");
                        self.p_filter[c].hide();
                    }
                });
                textField.addListener("input", function (e) {
                    var children = parent.containerCenterAll.getChildren();
                    for (var i = 0; i < children.length; i++) {
                        if (typeof children[i] != 'undefined') {
                            if (children[i].classname == "qx.ui.form.CheckBox") {
                                if (children[i].getUserData("key_control") != "selectAll") {
                                    var val = children[i].getUserData("data_to_search");
                                    if (val.toString().toUpperCase().indexOf(textField.getValue().toUpperCase()) == -1) {
                                        children[i].setVisibility("excluded");
                                    }
                                }
                            }
                        }
                    }
                });
                var checks = new qx.ui.form.CheckBox(self.tr("<b>Seleccionar todos</b>"));
                checks.getChildControl("label").setRich(true);
                checks.setUserData("key_control", "selectAll");
                parent.containerCenterAll.add(checks);
                checks.addListener("execute", function (e) {
                    var children = parent.containerCenterAll.getChildren();
                    for (var i = 0; i < children.length; i++) {
                        if (typeof children[i] != 'undefined' && children[i].isVisible() === true) {
                            if (children[i].classname == "qx.ui.form.CheckBox") {
                                children[i].setValue(this.getValue());
                            }
                        }
                    }
                });
            }

            dataArray.sort();
            //TODO: terminar el exportar para el listEdit             var type = null;
            var isListEdit = null;
            if (parent != null) {
                isListEdit = self.parent.getIsListEdit();
            }
            var monthsArray = [];
            var yearsArray = [];
            for (var i = 0; i < dataArray.length; i++) {
                var vali = dataArray[i];
                var valiAlone = dataArray[i];
                if (typeof valiAlone == 'undefined') {
                    continue;
                }
                if (columnCount[dataArray[i]]) {
                    vali = dataArray[i] + " (" + columnCount[dataArray[i]] + ")";
                }
                if (isListEdit === true) {
                    if (type == "selectBox" || type == "selectTokenField") {
                        vali = dataArray[i]["name"];
                    }
                }

                checks[i] = new qx.ui.form.CheckBox(vali);
                checks[i].getChildControl("label").setRich(true);
                checks[i].setUserData("checkIndex", i);
                checks[i].setUserData("columnHide", col);
                checks[i].setUserData("data_to_search", valiAlone);
                checks[i].setUserData("valueHide", dataArray[i]);

                if (typeof checksArray !== 'undefined') {
                    if (typeof checksArray.length !== 'undefined') {
                        for (var z = 0; z < checksArray.length; z++) {
                            var checkVal = checksArray[z];
                            if (checkVal["val"] === valiAlone && checkVal["reset"] === true) {
                                checks[i].setValue(true);
                            }
                        }
                    }
                }

                parent.containerCenterAll.add(checks[i]);
                if (type == "dateField" || type == "date" || type == "dateTimeField") {
                    var checkTimestamp = valiAlone.split(" ");
                    var dt = checkTimestamp[0].split("-");
                    var d = new Date(dt[0], dt[1] != 0 ? dt[1] - 1 : dt[1], dt[2]);
                    var n = d.getMonth() + 1;
                    var year = d.getFullYear();
                    n = n - 1;
                    var month = qxnw.utils.getMonthNameByIndex(n);
                    var vz = {
                        index: n,
                        month: month
                    };
                    var exists = false;
                    var existsYear = false;
                    for (var ia = 0; ia < monthsArray.length; ia++) {
                        if (monthsArray[ia].index == n && monthsArray[ia].month == month) {
                            exists = true;
                        }
                    }
                    for (var ia = 0; ia < yearsArray.length; ia++) {
                        if (yearsArray[ia] == year) {
                            existsYear = true;
                        }
                    }
                    if (exists == false) {
                        if (!isNaN(vz.index)) {
                            monthsArray.push(vz);
                        }
                    }
                    if (existsYear == false) {
                        if (!isNaN(year)) {
                            yearsArray.push(year);
                        }
                    }
                }
                if (typeof self.p_checksArr[col] === 'undefined') {
                    self.p_checksArr[col] = [];
                }
                if (typeof self.p_checks[col] === 'undefined') {
                    self.p_checks[col] = [];
                }
                self.p_checks[col].push(checks[i]);
            }
            self.monthsInFilters[col] = monthsArray;
            self.yearsInFilters[col] = yearsArray;

            var containerFooterTools = new qx.ui.container.Composite(new qx.ui.layout.HBox());
            parent.add(containerFooterTools, {
                flex: 0
            });

            var acceptBton = new qx.ui.form.Button(self.tr("Aceptar"), qxnw.config.execIcon("dialog-apply"));
            acceptBton.setUserData("col", col);
            acceptBton.addListener("execute", function () {
                self.p_filter[this.getUserData("col")].setUserData("nw_enabled", true);
                self.changeFilterRows(false);
                parent.hide();
            });

            containerFooterTools.add(acceptBton);

            var cleanBton = new qx.ui.form.Button(self.tr("Limpiar"), qxnw.config.execIcon("edit-clear"));
            cleanBton.setUserData("colInfo", col);
            cleanBton.addListener("execute", function () {
                //TODO: antes se limpiaba todo en las listas. Ahora se requiere que sólo limpie el filtro actual. En pruebas!!
                //self.cleanFiltersOnList();
                var col = this.getUserData("colInfo");
                self.cleanFilter(col);
                self.changeFilterRows();
                self.updateColumnsFilterCheck(self.p_filter[col], col);
            });
            containerFooterTools.add(cleanBton);
        },
        cleanFilter: function cleanFilter(col) {
            var self = this;
            if (self.p_filter !== null) {
                for (var i = 0; i < self.p_filter.length; i++) {
                    if (i == col) {
                        if (typeof self.p_checks !== 'undefined') {
                            if (typeof self.p_checks[i] !== 'undefined') {
                                for (var ia = 0; ia < self.p_checks[i].length; ia++) {
                                    self.p_checks[i][ia].setValue(false);
                                }
                            }
                        }
                        break;
                    }
                }
            }
            if (typeof self.p_filter[col] != 'undefined') {
                if (self.p_filter[col] != null) {
                    self.p_filter[col].setUserData("nw_data_filter", null);
                    self.p_filter[col].setUserData("nw_type_filter", null);
                }
            }
            qxnw.local.clearKey(self.getAppWidgetName() + "_qxnw.table.table");
            qxnw.local.deleteFromDataByName(self.parent.getAppWidgetName() + "_" + col + "_" + "_list_filter_dates", col);
        },
        getAllSubFilters: function getAllSubFilters() {
            var self = this;
            var i = 0;
            var filters = [];
            for (var val in self.p_filter) {
                i = val;
                if (typeof self.p_checks[i] != 'undefined' && self.p_checks[i] != null && typeof self.p_filter[i] != 'undefined' && self.p_filter[i] != null) {
                    var col = self.p_filter[i].getUserData("colInfo");
                    for (var ia = 0; ia < self.p_checks[i].length; ia++) {
                        var checks = self.p_checks[i][ia];
                        var val = checks.getUserData("valueHide");
                        var reset = checks.getValue();
                        var value = {};
                        if (reset === true) {
                            if (typeof filters[col] == 'undefined') {
                                filters[col] = [];
                            }
                            value["value"] = val;
                            value["col"] = col;
                            value["colName"] = self.parent.getColumnIdFromIndex(col);
                            filters[col].push(value);
                        }
                    }
                }
            }
            return filters;
        },
        getAllRecords: function getAllRecords() {
            return this.getTableModel().getDataAsMapArray();
        },
        processFiltersData: function processFiltersData(col, type, arr, dt, val) {
            var self = this;
            var i = val;
            var tableModel = self.getTableModel();
            var hidingStore = [];
            var indicatorPane = 0;

            try {
                var alter = self.getMetaColumnCounts().length;
                indicatorPane = alter;
            } catch (e) {
                console.log(e);
            }
            var ps = self.getPaneScroller(indicatorPane);
            if (typeof ps === 'undefined') {
                ps = self.getPaneScroller(0);
            }
            var header = ps.getHeader().getHeaderWidgetAtColumn(col);
            var icon = qxnw.config.execIcon("list-add");
            if (typeof header != 'undefined') {
                if (header.getSortIcon() == "decoration/table/ascending.png") {
                    icon = qxnw.config.execIcon("view-sort-ascending");
                    tableModel.sortByColumn(col, true);
                } else if (header.getSortIcon() == "decoration/table/descending.png") {
                    icon = qxnw.config.execIcon("view-sort-descending");
                    tableModel.sortByColumn(col, false);
                }
                header.showFilterIcon(true, icon);
            }
            var model = self.getAllRecords();
            for (var ib = 0; ib < model.length; ib++) {
                var counter = 0;
                for (var ic in model[ib]) {
                    var indexColumn = tableModel.getColumnIndexById(ic);
                    if (indexColumn == col) {
                        if (typeof type != "undefined" && (type == "dateTimeField" || type == "dateField" || type == "date") && arr.type == "entre") {
                            if (qxnw.utils.dateInRange(model[ib][ic], arr.fecha_inicial, arr.fecha_final) == false) {
                                hidingStore.push(ib);
                            }
                        } else if (typeof type != "undefined" && (type == "dateTimeField" || type == "dateField" || type == "date") && arr.type == "despues") {
                            if (qxnw.utils.compareDates(model[ib][ic], arr.fecha) != 1) {
                                hidingStore.push(ib);
                            }
                        } else if (typeof type != "undefined" && (type == "dateTimeField" || type == "dateField" || type == "date") && arr.type == "antes") {
                            if (qxnw.utils.compareDates(model[ib][ic], arr.fecha) != -1) {
                                hidingStore.push(ib);
                            }
                        } else if (typeof type != "undefined" && (type == "integer" || type == "money" || type == "numeric") && arr.type == "entre_number") {
                            if (model[ib][ic] == "") {
                                model[ib][ic] = 0;
                            }
                            model[ib][ic] = parseFloat(model[ib][ic]);
                            if (qxnw.utils.betweenNumbers(model[ib][ic], arr.numero_inicial,
                                    arr.numero_final, false) != true) {
                                hidingStore.push(ib);
                            }
                        } else if (typeof type != "undefined" && (type == "integer" || type == "money" || type == "numeric") && arr.type == "es_diferente_number") {
                            if (model[ib][ic] == "") {
                                model[ib][ic] = 0;
                            }
                            model[ib][ic] = parseFloat(model[ib][ic]);
                            if (model[ib][ic] == arr.es_diferente_number) {
                                hidingStore.push(ib);
                            }
                        } else if (typeof type != "undefined" && (type == "integer" || type == "money" || type == "numeric") && arr.type == "mayor_que") {
                            if (model[ib][ic] == "") {
                                model[ib][ic] = 0;
                            }
                            model[ib][ic] = parseFloat(model[ib][ic]);
                            if (model[ib][ic] > arr.mayor_que != true) {
                                hidingStore.push(ib);
                            }
                        } else if (typeof type != "undefined" && (type == "integer" || type == "money" || type == "numeric") && arr.type == "menor_que") {
                            if (model[ib][ic] == "") {
                                model[ib][ic] = 0;
                            }
                            model[ib][ic] = parseFloat(model[ib][ic]);
                            if (model[ib][ic] < arr.menor_que != true) {
                                hidingStore.push(ib);
                            }
                        } else if (typeof type != "undefined" && (type == "integer" || type == "money" || type == "numeric") && arr.type == "mayor_o_igual_que") {
                            if (model[ib][ic] == "") {
                                model[ib][ic] = 0;
                            }
                            model[ib][ic] = parseFloat(model[ib][ic]);
                            if (model[ib][ic] >= arr.mayor_o_igual_que != true) {
                                hidingStore.push(ib);
                            }
                        } else if (typeof type != "undefined" && (type == "integer" || type == "money" || type == "numeric") && arr.type == "menor_o_igual_que") {
                            if (model[ib][ic] == "") {
                                model[ib][ic] = 0;
                            }
                            model[ib][ic] = parseFloat(model[ib][ic]);
                            if (model[ib][ic] <= arr.menor_o_igual_que != true) {
                                hidingStore.push(ib);
                            }
                        } else if (typeof type != "undefined" && type == "text" && arr.type == "es_diferente") {
                            if (model[ib][ic] != "") {
                                if (model[ib][ic] == arr.es_diferente) {
                                    hidingStore.push(ib);
                                }
                            }
                        } else if (typeof type != "undefined" && type == "month") {
                            var dt = model[ib][ic].split("-");
                            var d = new Date(dt[0], dt[1], dt[2]);
                            var n = d.getMonth();
                            n = n - 1;
                            var month = qxnw.utils.getMonthNameByIndex(n);
                            if (month != arr) {
                                hidingStore.push(ib);
                            }
                        } else if (typeof type != "undefined" && type == "year") {
                            if (model[ib][ic] != "") {
                                model[ib][ic] = qxnw.utils.convertDate(model[ib][ic]);
                                var year = model[ib][ic].getFullYear();
                                if (year != arr) {
                                    hidingStore.push(ib);
                                }
                            }
                        } else if (typeof type != "undefined" && type == "color") {
                            if (arr.condition == "<") {
                                var colName = tableModel.getColumnId(arr.handledColumn);
                                if (model[ib][colName] >= arr.handledVal) {
                                    hidingStore.push(ib);
                                }
                            } else if (arr.condition == ">") {
                                var colName = tableModel.getColumnId(arr.handledColumn);
                                if (model[ib][colName] <= arr.handledVal) {
                                    hidingStore.push(ib);
                                }
                            } else if (arr.condition == "==") {
                                var colName = tableModel.getColumnId(arr.handledColumn);
                                if (model[ib][colName] != arr.handledVal) {
                                    hidingStore.push(ib);
                                }
                            } else if (arr.condition == ">=") {
                                var colName = tableModel.getColumnId(arr.handledColumn);
                                if (model[ib][colName] > arr.handledVal) {
                                    hidingStore.push(ib);
                                }
                            } else if (arr.condition == "<=") {
                                var colName = tableModel.getColumnId(arr.handledColumn);
                                if (model[ib][colName] > arr.handledVal) {
                                    hidingStore.push(ib);
                                }
                            }
                        } else {
                            if (typeof model[ib][ic] == 'undefined') {
                                model[ib][ic] = '';
                            }
                            if (dt.indexOf(model[ib][ic]) == -1) {
                                hidingStore.push(ib);
                            }
                        }
                    }
                    counter++;
                }
            }
            var hidden = 0;
            for (var id = 0; id < hidingStore.length; id++) {
                var row = hidingStore[id];
                var count = 1;
                while (i + 1 < hidingStore.length && hidingStore[id] == hidingStore[id + 1] - 1) {
                    count++;
                    id++;
                }
                tableModel.hideRows(row - hidden, count, false);
                hidden += count;
            }
        },
        changeFilterRows: function changeFilterRows(searchSaved) {
            var self = this;
            var tableModel = self.getTableModel();
            var filters = tableModel.Filters;
            tableModel.resetHiddenRows();
            if (self.parent.classname === "qxnw.navtable") {
                self.parent.getAllData();
            }
            var i = 0;
            filterToSave = {};
            if (typeof searchSaved === 'undefined') {
                var filterToSave = qxnw.local.getData(self.getAppWidgetName() + "_qxnw.table.table");
                if (filterToSave === null) {
                    filterToSave = {};
                } else {
                    for (var z in filterToSave) {
                        var checksFinded = filterToSave[z]["checks"];
                        self.createFilterForm(null, z, checksFinded);
                    }
                    qxnw.local.clearKey(self.getAppWidgetName() + "_qxnw.table.table");
                }
            }
            for (var val in self.p_filter) {
                try {
                    i = val;
//                    console.log("self.p_filter[i]", self.p_filter[i]);
                    if (self.p_filter[i] === null) {
                        continue;
                    }
                    var arr = self.p_filter[i].getUserData("nw_data_filter");
                    var type = self.p_filter[i].getUserData("nw_type_filter");
                    var col = parseInt(self.p_filter[i].getUserData("colInfo"));
                    var valToSave = {};
                    valToSave["col"] = col;
                    valToSave["arr"] = arr;
                    valToSave["type"] = type;
                    valToSave["checks"] = [];
                    if (typeof self.p_checks[i] !== 'undefined' && self.p_checks[i] !== null && typeof self.p_filter[i] !== 'undefined' && self.p_filter[i] !== null) {
                        var dt = [];
                        var evalue = false;
                        for (var ia = 0; ia < self.p_checks[i].length; ia++) {
                            var checks = self.p_checks[i][ia];
                            var val = checks.getUserData("valueHide");
                            var reset = checks.getValue();
                            var checkArray = {};
                            checkArray["val"] = val;
                            checkArray["reset"] = reset;
                            valToSave["checks"].push(checkArray);
                            if (reset === true) {
                                dt.push(val);
                                evalue = true;
                            }
                        }
                        filterToSave[col] = valToSave;
                        if (typeof type !== "undefined" && (type === "dateTimeField" || type === "dateField" || type === "date" || type === "integer" || type === "money" || type === "text" || type === "month" || type === "color" || type === "year")) {
                            evalue = true;
                        }
                        if (evalue === true) {
                            self.processFiltersData(col, type, arr, dt, val);
                        } else {
                            var header = self.getPaneScroller(0).getHeader().getHeaderWidgetAtColumn(col);
                            if (typeof header != 'undefined') {
                                header.showFilterIcon(false, null);
                            }
                        }
                    }
                    qxnw.local.setData(self.getAppWidgetName() + "_qxnw.table.table", filterToSave);
                } catch (e) {
                    //TODO: REMOVED TEMP
                    console.log(e);
//                    qxnw.utils.error(e, self);
                }
            }
            tableModel.Filters = filters;
            tableModel.applyFilters();
            try {
                self.parent.model.setStoredColumnSorted();
                self.parent.calculateByColumn();
            } catch (e) {
            }
        },
        changeFilterRowsOnlyColors: function changeFilterRowsOnlyColors(type, arr) {
            var self = this;
            var tableModel = self.getTableModel();
            tableModel.resetHiddenRows();
            var i = 0;
            try {
                var hidingStore = [];
                var evalue = true;
                if (evalue === true) {
                    var model = self.getAllRecords();
                    for (var ib = 0; ib < model.length; ib++) {
                        var counter = 0;
                        for (var ic in model[ib]) {
                            if (counter == arr.handledColumn) {
                                if (typeof type != "undefined" && type == "color") {
                                    if (arr.condition == "<") {
                                        var colName = tableModel.getColumnId(arr.handledColumn);
                                        if (model[ib][colName] >= arr.handledVal) {
                                            hidingStore.push(ib);
                                        }
                                    } else if (arr.condition == ">") {
                                        var colName = tableModel.getColumnId(arr.handledColumn);
                                        if (model[ib][colName] <= arr.handledVal) {
                                            hidingStore.push(ib);
                                        }
                                    } else if (arr.condition == "==") {
                                        var colName = tableModel.getColumnId(arr.handledColumn);
                                        if (model[ib][colName] != arr.handledVal) {
                                            hidingStore.push(ib);
                                        }
                                    } else if (arr.condition == ">=") {
                                        var colName = tableModel.getColumnId(arr.handledColumn);
                                        if (model[ib][colName] > arr.handledVal) {
                                            hidingStore.push(ib);
                                        }
                                    } else if (arr.condition == "<=") {
                                        var colName = tableModel.getColumnId(arr.handledColumn);
                                        if (model[ib][colName] > arr.handledVal) {
                                            hidingStore.push(ib);
                                        }
                                    }
                                }
                            }
                            counter++;
                        }
                    }
                    var hidden = 0;
                    for (var id = 0; id < hidingStore.length; id++) {
                        var row = hidingStore[id];
                        var count = 1;
                        while (i + 1 < hidingStore.length && hidingStore[id] == hidingStore[id + 1] - 1) {
                            count++;
                            id++;
                        }
                        tableModel.hideRows(row - hidden, count, false);
                        hidden += count;
                    }
                }

            } catch (e) {
                //REMOVED TEMP
                //qxnw.utils.error(e, self);
                console.log(e);
            }
            tableModel.applyFilters();
            try {
                self.parent.calculateByColumn();
            } catch (e) {
            }
        },
        hideCssRows: function hideCssRows(row, count) {
            var el = this.getPaneScroller(0).getTablePane().getContentElement().getDomElement();
            var first = el.firstElementChild;
            //first.style.display = 'none';
            var rowNodes = first.children;
            rowNodes[row].className += "qxnw_hidden_rows";
            rowNodes[row].style.height = "0px";
            rowNodes[row].style.display = "none";
            rowNodes[row].setAttribute('class', " qxnw_hidden_rows");
            qx.bom.element.Style.set(rowNodes[row], "height", "0px");
            qx.bom.element.Style.set(rowNodes[row], "height", "0px!important");
            //qx.bom.element.Style.setStyles(rowNodes[row], fontStyle);
            return;
            for (var i = 0; i < children.length; i++) {
                children[i].className = 'qxnw_hidden_rows';
                children[i].style.display = 'none';
            }
            return;
            var forEach = Array.prototype.forEach;
            forEach.call(divContainer.childNodes, function (divChild) {
                divChild.parentNode.style.height = '0px';
                divChild.parentNode.style.visibility = 'hidden';
                divChild.parentNode.style.display = 'none';
                divChild.parentNode.style.className = 'qxnw_hidden_rows';
            });
            return;
            var rows = divContainer.children;
            rows.item(row).style.height = "0px";
        },
        /**
         * Store the column visibility when the user hide or show a column, fired by the event {qx.ui.table.columnmodel.Basic.visibilityChanged}.
         * @param e {Object} the object event fired by event {qx.ui.table.columnmodel.Basic.visibilityChanged},
         * @return {void}
         */
        __storeVisibilityColumnChanged: function __storeVisibilityColumnChanged(e) {
            var self = this;
            if (!qxnw.config.getSaveLists()) {
                return;
            }
            if (self.parent == null) {
                return;
            }
            if (!self.__saveVisibility) {
                return;
            }
            var data = qxnw.local.getData(self.parent.getAppWidgetName() + "_visibility");
            if (data == null) {
                data = [];
            }
            var exists = false;
            var model = this.getTableModel();
            var r = e.getData();
            r.colName = model.getColumnId(r.col);
            for (var i = 0; i < data.length; i++) {
                if (data[i].col == r.col) {
                    data[i] = r;
                    exists = true;
                }
            }
            if (!exists) {
                data.push(r);
            }
            qxnw.local.storeData(self.parent.getAppWidgetName() + "_visibility", data);
        },
        /**
         * Find the stored data and hide/show the columns
         * @return {void}
         */
        setTheStoredVisibilityColumns: function setTheStoredVisibilityColumns() {
            var self = this;
            if (!qxnw.config.getSaveLists()) {
                return;
            }
            if (self.parent === null) {
                return;
            }
            var data = qxnw.local.getData(self.parent.getAppWidgetName() + "_visibility");
            if (data == null) {
                return;
            }
            var model = this.getTableModel();
            for (var i = 0; i < data.length; i++) {
                try {
                    self.__saveVisibility = false;
                    var indexColumn = model.getColumnIndexById(data[i].colName);
                    if (typeof indexColumn != 'undefined') {
                        self.getTableColumnModel().setColumnVisible(indexColumn, data[i].visible);
                    }
                } catch (e) {
                    qxnw.utils.bindError(e, self, data, false, false, false);
                }
            }
            self.__saveVisibility = true;
        },
        /**
         * Restore the order stored in the client side
         * @return {void}
         */
        restoreOrder: function restoreOrder() {
            var self = this;
            if (!qxnw.config.getSaveLists()) {
                return;
            }
            if (self.parent === null) {
                return;
            }
            var data = qxnw.local.getData(self.parent.getAppWidgetName() + "_order");
            if (data == null) {
                return;
            }
            try {
                self.getTableColumnModel().setColumnsOrder(data);
            } catch (e) {
                return;
            }
        },
        setParent: function setParent(parent) {
            this.parent = parent;
        },
        /**
         * Store the changed order when user change the columns order
         * @param r {Object} the event object <code>orderChanged</code>
         * @return {void}
         */
        __storeOrderChanged: function __storeOrderChanged(r) {
            var self = this;
            if (!qxnw.config.getSaveLists()) {
                return;
            }
            if (self.parent === null) {
                return;
            }
            var cols = self.getTableColumnModel().getVisibleColumns();
            var colsCount = self.getTableColumnModel().getOverallColumnCount();
            for (var i = 0; i < colsCount; i++) {
                if (cols.indexOf(i) == -1) {
                    cols.push(i);
                }
            }
            qxnw.local.storeData(self.parent.getAppWidgetName() + "_order", cols);

            var d = r.getData();
            if (typeof d !== 'undefined') {
                var data = {};
                data["eventFired"] = "storeOrderSaved";
                data["fromOverXPos"] = d["fromOverXPos"];
                data["toOverXPos"] = d["toOverXPos"];
                self.fireDataEvent("storeOrderSaved", data);
            }
        },
        /*
         * Stored the column width
         * @param {type} e the event handler
         * @returns {unresolved}
         */
        storeColumnsWidth: function storeColumnsWidth(e, col, newWidth) {
            this.__storeColumnsWidth(e, col, newWidth);
        },
        __storeColumnsWidth: function __storeColumnsWidth(e, col, newWidth) {
            var self = this;
            if (!qxnw.config.getSaveLists()) {
                return;
            }
            if (self.parent === null) {
                return;
            }
            if (e == false) {
                var data = {};
                data.col = col;
                data.newWidth = newWidth;
            } else {
                var data = e.getData();
                if (!data.isPointerAction) {
                    return;
                }
            }
            var tableModel = self.getTableModel();
            var columnName = tableModel.getColumnId(data.col);
            var newData = {};
            newData[columnName] = data.newWidth;
            self.__columnDataWidth[data.col] = newData;
            try {
                qxnw.local.storeClassColumnsData(self.parent.getAppWidgetName() + "_list", self.__columnDataWidth);
            } catch (exc) {
                console.log(exc);
                //qxnw.utils.error(exc, self);
            }
        },
        /**
         * Store the data of a columns from a qxnw.lists
         * 
         * @param key {String} value for a data stored
         * @param data {Array} an array containing values of columns 
         */
        storeClassColumnsData: function storeClassColumnsData(key, data) {
            var self = this;
            if (typeof data == 'undefined') {
                this.debug("You try to save something, but the values to save are null");
                return;
            }
            if (qxnw.local.isStoreData() == null) {
                return;
            }
            try {
                var columnsData = self.__store.getItem(key);
            } catch (e) {
                return;
            }
            if (typeof columnsData != 'undefined') {
                if (columnsData != null) {
                    for (var i = 0; i < columnsData.length; i++) {
                        if (columnsData[i] != null) {
                            if (typeof data[i] == 'undefined') {
                                data[i] = columnsData[i];
                            }
                        }
                    }
                }
            }
            if (self.__prefix != null) {
                key = key + "_" + self.__prefix;
            }
            self.__store.setItem(key, data);
        },
        __setExcludedColumns: function __setExcludedColumns(excluded) {
            this.hiddenColumnsNW = excluded;
        },
        setExcludedColumns: function setExcludedColumns(excluded) {
            this.hiddenColumnsNW = excluded;
        },
        getStoredColumnWidth: function getStoredColumnWidth() {
            var self = this;
            if (!qxnw.config.getSaveLists()) {
                return;
            }
            if (self.parent === null) {
                return;
            }
            return qxnw.local.getData(self.parent.getAppWidgetName() + "_list");
        },
        searchIntoSavedWidths: function searchIntoSavedWidths(columnWidth, colSearch) {
            for (var i = 0; i < columnWidth.length; i++) {
                var col = columnWidth[i];
                if (typeof col == 'undefined' || col == null) {
                    continue;
                }
                for (var key in col) {
                    if (key != null) {
                        if (col[key] != null) {
                            if (typeof key != 'undefined' && typeof col[key] != 'undefined' && typeof col != 'undefined') {
                                if (key == colSearch) {
                                    return col[key];
                                }
                            }
                        }
                    }
                }
            }
            return null;
        },
        setSelectionMultiple: function setSelectionMultiple() {
            this.getSelectionModel().setSelectionMode(qx.ui.table.selection.Model.MULTIPLE_INTERVAL_SELECTION);
        },
        setStoredColumnsWidth: function setStoredColumnsWidth() {
            var self = this;
            if (!qxnw.config.getSaveLists()) {
                return;
            }
            if (self.parent === null) {
                return;
            }
            var columnWidth = self.getStoredColumnWidth();
            if (columnWidth == null) {
                columnWidth = [];
            }
            var columnModel = this.getTableColumnModel();
            var model = this.getTableModel();
            var columns = columnModel.getVisibleColumns();
            for (var ia = 0; ia < columns.length; ia++) {
                var colName = model.getColumnId(columns[ia]);
                var column = columns[ia];
                var width = self.searchIntoSavedWidths(columnWidth, colName);
                if (width == null) {
                    var label = model.getColumnName(column);
                    var size = label.length;
                    if (size > 10) {
                        width = 120;
                        self.setColumnWidth(column, width);
                    } else if (size > 20) {
                        width = 170;
                        self.setColumnWidth(column, width);
                    }
                } else {
                    self.setColumnWidth(column, parseInt(width));
                }
            }
        }
    }
});