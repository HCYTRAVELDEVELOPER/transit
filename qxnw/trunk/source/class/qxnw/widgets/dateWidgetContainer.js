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

qx.Class.define("qxnw.widgets.dateWidgetContainer", {
    extend: qx.ui.container.Composite,
    construct: function (layout, parent, container_user, widget_dates_position) {
        this.base(arguments);
        var self = this;
        self.setLayout(layout);
        self.__parent = parent;
        var containerDates = new qx.ui.container.Composite(new qx.ui.layout.HBox()).set({
            padding: 2,
            alignY: "bottom"
        });
        var cI = parent.containerFieldsArray["fecha_inicial"];
        if (typeof cI === 'undefined') {
            cI = parent.containerFieldsArray["fecha_inicio"];
            self.fecha_inicial = "fecha_inicio";
        }
        if (typeof cI === 'undefined') {
            cI = parent.containerFieldsArray["fecha"];
            self.fecha_inicial = "fecha";
        }
        if (typeof cI === 'undefined') {
            cI = parent.containerFieldsArray["fecha_inicial_filters"];
            self.fecha_inicial = "fecha_inicial_filters";
        }
        var cF = parent.containerFieldsArray["fecha_final"];
        if (typeof cF === 'undefined') {
            cF = parent.containerFieldsArray["fecha_fin"];
            self.fecha_final = "fecha_fin";
        }
        if (typeof cF === 'undefined') {
            cF = parent.containerFieldsArray["fecha_final_filters"];
            self.fecha_final = "fecha_final_filters";
        }

        cI.add(parent.labelForm[self.fecha_inicial], {
            flex: 1
        });
        cI.add(parent.ui[self.fecha_inicial], {
            flex: 1
        });
        cF.add(parent.labelForm[self.fecha_final], {
            flex: 1
        });
        cF.add(parent.ui[self.fecha_final], {
            flex: 1
        });

        containerDates.add(cI);
        containerDates.add(cF);

        parent.ui[self.fecha_inicial].addListener("click", function () {
            self.resetSelectedType();
            if (self.lblStatusDate) {
                self.lblStatusDate.destroy();
            }
        });
        
        parent.ui[self.fecha_final].addListener("click", function () {
            self.resetSelectedType();
            if (self.lblStatusDate) {
                self.lblStatusDate.destroy();
            }
        });

        var openButton = new qx.ui.toolbar.SplitButton("Open", qxnw.config.execIcon("appointment-new"), self.getDateMenu()).set({
            show: "icon",
            maxWidth: 40,
            alignY: "bottom"
        });
        openButton.getChildControl("button").addListener("execute", function () {
            var menu = openButton.getMenu();
            menu.placeToWidget(this);
            menu.show();
        });
        self.add(openButton);
        containerDates.add(this);
        if (typeof container_user !== 'undefined') {
            var position = 0;
            if (typeof widget_dates_position !== 'undefined') {
                position = widget_dates_position;
            }
            container_user.addAt(containerDates, position);
        } else {
            self.__parent.containerFilters.add(containerDates, {
                flex: 0
            });
        }
    },
    destruct: function () {

    },
    members: {
        fecha_inicial: "fecha_inicial",
        fecha_final: "fecha_final",
        __parent: null,
        __type: null,
        getDateMenu: function getDateMenu() {
            var self = this;

            var menu = new qx.ui.menu.Menu();

            var buttonNone = new qx.ui.menu.Button("Ninguno", qxnw.config.execIcon("office-calendar", "apps"));
            var buttonToday = new qx.ui.menu.Button("Hoy", qxnw.config.execIcon("office-calendar", "apps"));
            var buttonYesterday = new qx.ui.menu.Button("Ayer", qxnw.config.execIcon("office-calendar", "apps"));
            var buttonCurrentMonth = new qx.ui.menu.Button("Este mes", qxnw.config.execIcon("office-calendar", "apps"));
            var buttonAfterMonth = new qx.ui.menu.Button("Mes anterior", qxnw.config.execIcon("office-calendar", "apps"));
            var buttonThreeMonths = new qx.ui.menu.Button("3 últimos meses desde hoy", qxnw.config.execIcon("office-calendar", "apps"));
            var buttonSixMonths = new qx.ui.menu.Button("6 últimos meses desde hoy", qxnw.config.execIcon("office-calendar", "apps"));
            var buttonThisYear = new qx.ui.menu.Button("Este año", qxnw.config.execIcon("office-calendar", "apps"));
            var buttonAllYear = new qx.ui.menu.Button("Todo el año", qxnw.config.execIcon("office-calendar", "apps"));
            var buttonLastYear = new qx.ui.menu.Button("Año anterior", qxnw.config.execIcon("office-calendar", "apps"));

            buttonNone.addListener("execute", function () {
                self.switchDateType(null);
            });
            buttonToday.addListener("execute", function () {
                self.switchDateType("today");
            });
            buttonYesterday.addListener("execute", function () {
                self.switchDateType("yesterday");
            });
            buttonCurrentMonth.addListener("execute", function () {
                self.switchDateType("current_month");
            });
            buttonAfterMonth.addListener("execute", function () {
                self.switchDateType("after_month");
            });
            buttonThreeMonths.addListener("execute", function () {
                self.switchDateType("last_three_months");
            });
            buttonSixMonths.addListener("execute", function () {
                self.switchDateType("last_six_months");
            });
            buttonThisYear.addListener("execute", function () {
                self.switchDateType("this_year");
            });
            buttonAllYear.addListener("execute", function () {
                self.switchDateType("all_year");
            });
            buttonLastYear.addListener("execute", function () {
                self.switchDateType("last_year");
            });

            menu.add(buttonNone);
            menu.add(buttonToday);
            menu.add(buttonYesterday);
            menu.add(buttonCurrentMonth);
            menu.add(buttonAfterMonth);
            menu.add(buttonThreeMonths);
            menu.add(buttonSixMonths);
            menu.add(buttonThisYear);
            menu.add(buttonAllYear);
            menu.add(buttonLastYear);

            return menu;
        },
        resetSelectedType: function resetSelectedType() {
            var self = this;
            self.__type = null;
            return self.__type;
        },
        getSelectedType: function getSelectedType() {
            var self = this;
            return self.__type;
        },
        switchDateType: function switchDateType(type) {
            var self = this;
            switch (type) {
                case null:
                    self.__parent.ui[self.fecha_inicial].setValue(null);
                    self.__parent.ui[self.fecha_final].setValue(null);
                    if (self.lblStatusDate) {
                        self.lblStatusDate.destroy();
                    }
                    break;
                case "today":
                    var d = new Date();
                    self.__parent.ui[self.fecha_inicial].setValue(d);
                    self.__parent.ui[self.fecha_final].setValue(d);
                    if (self.lblStatusDate) {
                        self.lblStatusDate.destroy();
                    }
                    self.lblStatusDate = new qx.ui.basic.Label(self.tr("Hoy")).set({
                        alignX: "right",
                        font: new qx.bom.Font(10, ["Verdana", "sans-serif"])
                    });
                    self.add(self.lblStatusDate);
                    break;
                case "yesterday":
                    var d = new Date();
                    var yesterday = new Date(d.getFullYear(), d.getMonth(), d.getDate() - 1);
                    self.__parent.ui[self.fecha_inicial].setValue(yesterday);
                    self.__parent.ui[self.fecha_final].setValue(yesterday);
                    if (self.lblStatusDate) {
                        self.lblStatusDate.destroy();
                    }
                    self.lblStatusDate = new qx.ui.basic.Label(self.tr("Ayer")).set({
                        alignX: "right",
                        font: new qx.bom.Font(10, ["Verdana", "sans-serif"])
                    });
                    self.add(self.lblStatusDate);
                    break;
                case "current_month":
                    var date = new Date();
                    var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
                    var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
                    self.__parent.ui[self.fecha_inicial].setValue(firstDay);
                    self.__parent.ui[self.fecha_final].setValue(lastDay);
                    if (self.lblStatusDate) {
                        self.lblStatusDate.destroy();
                    }
                    self.lblStatusDate = new qx.ui.basic.Label(self.tr("Este mes")).set({
                        alignX: "right",
                        font: new qx.bom.Font(10, ["Verdana", "sans-serif"])
                    });
                    self.add(self.lblStatusDate);
                    break;

                case "after_month":
                    var date = new Date();
                    var prevStartDate = new Date(date.getFullYear(), date.getMonth() - 1, 1);
                    var preEndDate = new Date(date.getFullYear(), date.getMonth() - 1 + 1, 0);
                    self.__parent.ui[self.fecha_inicial].setValue(prevStartDate);
                    self.__parent.ui[self.fecha_final].setValue(preEndDate);
                    if (self.lblStatusDate) {
                        self.lblStatusDate.destroy();
                    }
                    self.lblStatusDate = new qx.ui.basic.Label(self.tr("Mes anterior")).set({
                        alignX: "right",
                        font: new qx.bom.Font(10, ["Verdana", "sans-serif"])
                    });
                    self.add(self.lblStatusDate);
                    break;

                case "last_three_months":
                    var date = new Date();
                    var prevStartDate = new Date(date.getFullYear(), date.getMonth(), date.getDate() - 90);
                    var preEndDate = new Date();
                    self.__parent.ui[self.fecha_inicial].setValue(prevStartDate);
                    self.__parent.ui[self.fecha_final].setValue(preEndDate);
                    if (self.lblStatusDate) {
                        self.lblStatusDate.destroy();
                    }
                    self.lblStatusDate = new qx.ui.basic.Label(self.tr("3 últimos meses")).set({
                        alignX: "right",
                        font: new qx.bom.Font(10, ["Verdana", "sans-serif"])
                    });
                    self.add(self.lblStatusDate);
                    break;
                    
                case "last_six_months":
                    var date = new Date();
                    var prevStartDate = new Date(date.getFullYear(), date.getMonth(), date.getDate() - 180);
                    var preEndDate = new Date();
                    self.__parent.ui[self.fecha_inicial].setValue(prevStartDate);
                    self.__parent.ui[self.fecha_final].setValue(preEndDate);
                    if (self.lblStatusDate) {
                        self.lblStatusDate.destroy();
                    }
                    self.lblStatusDate = new qx.ui.basic.Label(self.tr("6 últimos meses")).set({
                        alignX: "right",
                        font: new qx.bom.Font(10, ["Verdana", "sans-serif"])
                    });
                    self.add(self.lblStatusDate);
                    break;

                case "this_year":
                    var date = new Date();
                    self.__parent.ui[self.fecha_final].setValue(date);
                    var firstDay = new Date(date.getFullYear(), 0, 1);
                    self.__parent.ui[self.fecha_inicial].setValue(firstDay);
                    if (self.lblStatusDate) {
                        self.lblStatusDate.destroy();
                    }
                    self.lblStatusDate = new qx.ui.basic.Label(self.tr("Este año")).set({
                        alignX: "right",
                        font: new qx.bom.Font(10, ["Verdana", "sans-serif"])
                    });
                    self.add(self.lblStatusDate);
                    break;

                case "all_year":
                    var date = new Date();
                    var firstDay = new Date(date.getFullYear(), 0, 1);
                    self.__parent.ui[self.fecha_inicial].setValue(firstDay);
                    var lastDay = new Date(date.getFullYear(), 11, 31);
                    self.__parent.ui[self.fecha_final].setValue(lastDay);
                    if (self.lblStatusDate) {
                        self.lblStatusDate.destroy();
                    }
                    self.lblStatusDate = new qx.ui.basic.Label(self.tr("Todo el año")).set({
                        alignX: "right",
                        font: new qx.bom.Font(10, ["Verdana", "sans-serif"])
                    });
                    self.add(self.lblStatusDate);
                    break;

                case "last_year":
                    var date = new Date();
                    var firstDay = new Date(date.getFullYear() - 1, 0, 1);
                    self.__parent.ui[self.fecha_inicial].setValue(firstDay);
                    var lastDay = new Date(date.getFullYear() - 1, 11, 31);
                    self.__parent.ui[self.fecha_final].setValue(lastDay);
                    if (self.lblStatusDate) {
                        self.lblStatusDate.destroy();
                    }
                    self.lblStatusDate = new qx.ui.basic.Label(self.tr("Año anterior")).set({
                        alignX: "right",
                        font: new qx.bom.Font(10, ["Verdana", "sans-serif"])
                    });
                    self.add(self.lblStatusDate);
                    break;

                default:

                    break;
            }
            self.__type = type;
        }
    }
});
