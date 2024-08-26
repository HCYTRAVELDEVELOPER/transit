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

qx.Class.define("qxnw.cmi.main", {
    extend: qxnw.forms,
    construct: function construct() {
        this.base(arguments);
        this.setTitle(this.tr("Cuadro de mando integral :: NW Group"));
        this.scorecards = [];
        this.containerScorecards = {};
        this.populateScoreCards();
        this.isMinimized = {};
    },
    members: {
        scorecards: null,
        isMinimized: false,
        containerScorecards: null,
        defaulMinusHeight: 105,
        createButtonsToolbar: function createButtonsToolbar() {
            var self = this;
            var toolBar = new qx.ui.toolbar.ToolBar();
            var part = new qx.ui.toolbar.Part();
            toolBar.add(part);
            var refreshButton = new qx.ui.form.Button(self.tr("Refrescar"), qxnw.config.execIcon("view-refresh"));
            refreshButton.addListener("execute", function () {
                self.populateScoreCards();
            });
            part.add(refreshButton);
            self.masterContainer.add(toolBar, {
                flex: 0
            });
            self.masterContainer.add(new qx.ui.core.Spacer(10, 10), {
                flex: 0
            });
        },
        maximizeScoreCard: function maximizeScoreCard(id, button) {
            if (this.isMinimized[id] == true) {
                var bounds = qx.bom.Viewport.getHeight() - this.defaulMinusHeight;
                for (var i = 0; i < this.scorecards.length; i++) {
                    if (this.scorecards[i].getUserData("id_scorecard") == id) {
                        this.scorecards[i].setVisibility("visible");
                        this.containerScorecards[id].setMaxHeight(bounds);
                        this.containerScorecards[id].setMinHeight(bounds);
                        button.setIcon(qxnw.config.execIcon("view-restore"));
                        button.setLabel(this.tr("Minimizar"));
                        button.setUserData("scorecard", id);
                        qxnw.local.storeData("dynamic_table_main_is_maximized_scorecard" + id, true);
                        return true;
                        break;
                    }
                }
            }
        },
        minimizeScoreCard: function minimizeScoreCard(id, button) {
            var self = this;
            var bounds = qx.bom.Viewport.getHeight() - this.defaulMinusHeight;
            if (self.isMinimized[id] == false) {
                for (var i = 0; i < self.scorecards.length; i++) {
                    if (self.scorecards[i].getUserData("id_scorecard") == id) {
                        self.scorecards[i].setVisibility("excluded");
                        self.containerScorecards[id].resetMaxHeight();
                        self.containerScorecards[id].resetMinHeight();
                        button.setIcon(qxnw.config.execIcon("view-fullscreen"));
                        button.setLabel(self.tr("Maximizar"));
                        button.setUserData("scorecard", id);
                        self.isMinimized[id] = true;
                        qxnw.local.storeData("dynamic_table_main_is_maximized_scorecard" + id, false);
                        return true;
                        break;
                    }
                }
            } else {
                for (var i = 0; i < self.scorecards.length; i++) {
                    if (self.scorecards[i].getUserData("id_scorecard") == id) {
                        self.scorecards[i].setVisibility("visible");
                        self.containerScorecards[id].setMaxHeight(bounds);
                        self.containerScorecards[id].setMinHeight(bounds);
                        button.setIcon(qxnw.config.execIcon("view-restore"));
                        button.setLabel(self.tr("Minimizar"));
                        button.setUserData("scorecard", id);
                        self.isMinimized[id] = false;
                        qxnw.local.storeData("dynamic_table_main_is_maximized_scorecard" + id, true);
                        return true;
                        break;
                    }
                }
            }
        },
        populateScoreCards: function populateScoreCards() {
            var self = this;
            self.masterContainer.removeAll();
            self.createButtonsToolbar();
            self.containerScorecards = {};
            self.isMinimized = {};
            self.scorecards = [];
            var func = function (r) {
                if (r.length == 0) {
                    var lbl = new qx.ui.basic.Label(self.tr("<b>No hay informes integrales para mostrar.</b>")).set({
                        rich: true
                    });
                    self.masterContainer.add(lbl);
                    return;
                }
                for (var i = 0; i < r.length; i++) {
                    var ra = r[i];
                    if (ra["part"] != "" && ra["part"] != null) {
                        try {
                            qx.io.PartLoader.require(ra["part"], function () {
                                self.createScoreCard(ra);
                            }, this);
                        } catch (e) {
                            self.createScoreCard(ra);
                        }
                    } else {
                        self.createScoreCard(ra);
                    }
                }
            };
            qxnw.utils.fastAsyncRpcCall("cmi", "populateScoreCards", self.up, func);
        },
        createScoreCard: function createScoreCard(ra) {
            var self = this;
            self.containerScorecards[ra["id"]] = new qx.ui.container.Composite(new qx.ui.layout.VBox());
            qxnw.utils.addBorder(self.containerScorecards[ra["id"]], "black", 1);
            //self.containerScorecards[ra["id"]].setMaxHeight(20);
            //self.containerScorecards[ra["id"]].setMinHeight(20);

            var layout = new qx.ui.layout.HBox();
            var containerModes = new qx.ui.container.Composite(layout).set({
                alignY: "middle"
            });
            var lbl = new qx.ui.basic.Atom("<b> " + ra["nombre"] + "</b>", qxnw.config.execIcon("help-about")).set({
                rich: true,
                minWidth: 300,
                minHeight: 40,
                alignY: "middle"
            });

            lbl.setFont(new qx.bom.Font(20));

            qxnw.utils.addBorder(containerModes, "black", 1);

            containerModes.add(lbl, {
                flex: 1
            });

            containerModes.add(new qx.ui.core.Spacer(50));

            var lblDate = new qx.ui.basic.Atom("<b>Fecha creación: " + ra["fecha"] + "</b>", qxnw.config.execIcon("office-calendar", "apps")).set({
                rich: true
            });

            lblDate.setFont(new qx.bom.Font(16));

            containerModes.add(lblDate);

            containerModes.add(new qx.ui.core.Spacer(), {
                flex: 1
            });

            var buttonMinimize = new qx.ui.form.Button(self.tr("Minimizar"), qxnw.config.execIcon("view-restore"));
            buttonMinimize.setMinWidth(130);
            buttonMinimize.setAppearance("label");
            buttonMinimize.set({
                cursor: "pointer"
            });
            qxnw.utils.addBorder(buttonMinimize, "black", 1);
            buttonMinimize.setUserData("id_scorecard", ra["id"]);
            buttonMinimize.addListener("execute", function () {
                self.minimizeScoreCard(this.getUserData("id_scorecard"), this);
            });
            containerModes.add(buttonMinimize);

            var buttonDelete = new qx.ui.form.Button(self.tr("Eliminar"), qxnw.config.execIcon("dialog-close"));
            buttonDelete.setAppearance("label");
            buttonDelete.setMinWidth(130);
            buttonDelete.set({
                cursor: "pointer"
            });
            qxnw.utils.addBorder(buttonDelete, "black", 1);
            buttonDelete.setUserData("id_scorecard", ra["id"]);
            buttonDelete.addListener("execute", function () {
                self.removeScoreCard(this.getUserData("id_scorecard"));
            });
            containerModes.add(buttonDelete);

            self.containerScorecards[ra["id"]].add(containerModes);

            var scrollContainer = new qx.ui.container.Scroll();

            scrollContainer.setUserData("id_scorecard", ra["id"]);
            self.scorecards.push(scrollContainer);

            var desktop = new qx.ui.window.Desktop();

            scrollContainer.add(desktop);

            buttonMinimize.setUserData("table_method", ra["table_method"]);
            buttonMinimize.setUserData("table_main", ra["table_main"]);
            buttonMinimize.setUserData("classname", ra["classname"]);
            buttonMinimize.setUserData("nw_desktop", desktop);
            buttonMinimize.setUserData("created_inside", false);

            buttonMinimize.addListener("execute", function () {
                var created_inside = this.getUserData("created_inside");
                if (created_inside === true) {
                    return;
                }

                var table_method = this.getUserData("table_method");
                var table_main = this.getUserData("table_main");
                var classname = this.getUserData("classname");
                var nw_desktop = this.getUserData("nw_desktop");

                if (table_method == "master") {
                    var l = new qxnw.lists();
                    l.createFromTable(table_main);
                } else {
                    var la = eval(classname);
                    var l = new la();
                }
                l.setMaximizedDynamicTable(desktop, containerModes);
                l.hideFooterTools();
                l.hideTools();

//                qxnw.utils.loading(self.tr("Trabajando"));
                qxnw.utils.loadingnw("Trabajando...", "cargando_trabajando");
                setTimeout(function () {
                    l.applyFilters();
//                    qxnw.utils.stopLoading();
                    qxnw.utils.loadingnw_remove("cargando_trabajando");
                }, 2000);
                l.set({
                    showClose: false,
                    showMinimize: false,
                    showMaximize: false
                });
                l.setResizable(false);
                l.getChildControl("captionbar").setVisibility("excluded");
                l.setAlwaysOnTop(false);
                l.show();
                l.maximize();
                nw_desktop.add(l, {
                    width: "100%",
                    height: "100%",
                    top: 0,
                    left: 0
                });
                this.setUserData("created_inside", true);
            });

            self.containerScorecards[ra["id"]].add(scrollContainer, {
                flex: 1
            });
            self.masterContainer.add(self.containerScorecards[ra["id"]], {
                flex: 0
            });

            self.isMinimized[ra["id"]] = false;

            self.minimizeScoreCard(ra["id"], buttonMinimize);

//            var isMaximized = qxnw.local.getData("dynamic_table_main_is_maximized_scorecard" + ra["id"]);
//            if (isMaximized == null) {
//                self.minimizeScoreCard(ra["id"], buttonMinimize);
//            } else if (isMaximized == false) {
//                self.minimizeScoreCard(ra["id"], buttonMinimize);
//            }
        },
        removeScoreCard: function removeScoreCard(id) {
            var self = this;
            var func = function (r) {
                if (r == true) {
                    self.populateScoreCards();
                }
            };
            qxnw.local.clearKey("dynamic_table_main_is_maximized_scorecard" + id);
            qxnw.utils.fastAsyncRpcCall("cmi", "removeScoreCard", id, func);
        }
    }
});