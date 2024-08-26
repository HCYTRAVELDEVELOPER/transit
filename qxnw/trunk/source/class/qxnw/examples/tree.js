qx.Class.define("qxnw.examples.tree", {
    extend: qxnw.treeWidget,
    construct: function () {
        this.base(arguments);
        var self = this;
        var filters = [
            {
                name: "selectListCheck",
                label: "Seleccione...",
                type: "selectListCheck"
            },
            {
                name: "action",
                label: "Botón",
                type: "button"
            },
            {
                name: "buscar",
                label: "Filtro...",
                type: "textField"
            }
        ];
        self.createFilters(filters);
        self.pages = [];
//        self.createSettingsButton("contextMenuSettings");

        self.ui.buttonSearch.addListener("execute", function () {
            if (self.aperturas == null) {
                self.aperturas = new compras.lists.l_solicitudes();
                self.page = self.addSubWindow("Informe Aperturas", self.aperturas);
                self.page.setShowCloseButton(true);
                self.pages["aperturas"] = self.page;
                self.page.addListener("close", function () {
//                self.aperturas = null;
//                self.pages["aperturas"] = null;
                });
            } else {
                self.selectPage(self.pages["aperturas"]);
            }
        });

//        self.tabWidget.getChildControl("bar").setVisibility('visible');

//        self.showTabView(1);
        return;

        //self.setAskOnCloseSubWindow(true);
        //self.setAskOnClose(true);

        self.ui.selectListCheck.populate("master", "populate", {table: "usuarios"});

        self.ui.buttonSearch.addListener("execute", function () {
            self.showTabView(1);

            self.populateTree();
            return;

            self.closeAllSubWindows();
            return;

            self.populateTree();
            return;
            if (self.times == 2) {
                if (!self.validate()) {
                    return;
                }
            } else {
                if (self.isEnabledWidget == true) {
                    self.isEnabledWidget = false;
                    self.setRequired("selectListCheck", self.isEnabledWidget);
                } else {
                    self.isEnabledWidget = true;
                    self.setRequired("selectListCheck", self.isEnabledWidget);
                }
                self.times++;
            }
        });

        var colors = ["white", "green", "yellow", "red"];
        self.createSemaphore(colors, "semaforo");

        self.populateTree();

        self.createSecondLayer();

        var f1 = new qxnw.examples.form();
        var p = self.addSubWindow("Sub 2", f1, true, null, qxnw.config.execIcon("dialog-apply"));
        var a = p.getChildControl("button");
        var b = a.getChildControl("close-button");
        b.addListener("tap", function (e) {
            e.preventDefault();
        });
//        var em = new qx.event.Manager();
//        console.log(b);
//        em.removeListener(b, "tap", function () {
//            console.log("removed!");
//        }, this);
        return;

        var f = new qxnw.examples.form_light();
        self.addSubWindow("Sub", f);

    },
    destruct: function destruct() {
    },
    members: {
        navTableAdjuntosDifer: null,
        isEnabledWidget: true,
        times: 0,
        contextMenuSettings: function contextMenuSettings(pos) {
            var self = this;
            var m = new qxnw.contextmenu(self.ui["settingsButton"]);
            m.addAction("<b>TEST </b>", qxnw.config.execIcon("office-project", "apps"), function (e) {
                alert("HOLA!");
            });
            m.addAction("<b>PRUEBA 2</b>", qxnw.config.execIcon("office-project", "apps"), function (e) {
                alert("HOLA QUE!");
            });
            m.setParentWidget(self.ui["settingsButton"]);
            m.exec(pos);
            return m.getMenu();
        },
        populateTree: function populateTree() {
            var self = this;
            var data = {};
            self.removeOnLayer();
            data.filters = self.getFiltersData();
            var func = function (r) {
                self.cleanTree();
                self.handleExecPages(r);
                self.addTreeHeader("Tickets vigentes  " + "   : :  " + 5, qxnw.config.execIcon("view-sort-descending"));
                for (var i = 0; i < r.records.length; i++) {
                    var icon = qxnw.config.execIcon("archive", "mimetypes");
                    var parent = self.addTreeFolder("XXXXX::TEST -> " + r.records[i].ciudad, icon, 0, true);
                    parent.setModel(i);
                    parent.setOpen(true);
                    parent.addListener("click", function () {
                        var text = "";
                        text += "Nombre: TEST";
                        text += "<br /> Dirección: DIRECC";
                        text += "<br /> Numero torre: NUMBER";
                        text += "<br /> <b>Status: STATUS</b>";
                        var label = new qx.ui.basic.Label(text).set({
                            rich: true,
                            selectable: true
                        });
                        self.replaceOnLayer(label);
                    });
                    var item_mapa = self.addTreeFile(r.records[i].pais, qxnw.config.execIcon("mapapp", "qxnw"), i, parent);
                    if (r.records[i].pais == "Mexico") {
                        var item_alter = self.addTreeFile("Colombia", qxnw.config.execIcon("mapapp", "qxnw"), i, parent);
                        var item_alter = self.addTreeFile("Brasil", qxnw.config.execIcon("mapapp", "qxnw"), i, parent);
                    }
                    item_mapa.setUserData("model", i);
                    item_mapa.addListener("click", function () {
                        qxnw.utils.loading("Cargando elemento...");
                        var interval = setInterval(function () {
                            clearInterval(interval);
                            var text = "";
                            text += "Nombre: TEST";
                            text += "<br /> Dirección: DIRECC";
                            text += "<br /> Numero torre: NUMBER";
                            text += "<br /> <b>Status: STATUS</b>";
                            var map = self.createForm("form", text);
                            var page = self.addSubWindow("Mapa Ticket No " + "XX123334445", map);
                            page.addListener("close", function () {
                                map = null;
                            });
                            page.setShowCloseButton(true);
                            qxnw.utils.stopLoading();
                        }, 100);
                    });
                }
            }
            qxnw.utils.fastAsyncRpcCall("master", "testListEdit", data, func);
        },
        createForm: function createForm(type, text) {
            var self = this;
            if (typeof type == 'undefined') {
                type = "map";
            }
            switch (type) {
                case "map":
                    var map = new qxnw.mapsWidget(self);
                    map.setVisibleToolBar(false);
                    map.setVisibleFiltersBar(false);
                    map.setPoint("1000.000", "100000.000.555", text, true, null, true);
                    break;
                case "form":
                    var map = new qxnw.examples.form_light();
                    break;
            }
            return map;
        },
        contextMenu: function contextMenu(pos) {
            var self = this;
            var m = new qxnw.contextmenu(this);
            var si = self.getSelectedItem();
            m.addAction("<b>TEST " + si + "</b>", qxnw.config.execIcon("office-project", "apps"), function (e) {
                self.test(si);
            });
            for (var iii = 0; iii < 3; iii++) {
                m.addSubAction("<b>SUB" + iii + "</b>", qxnw.config.execIcon("internet-transfer", "apps"), function (e) {
                    self.test(si);
                });
            }
            m.setParentWidget(this);
            m.exec(pos);
        },
        test: function test(data) {
            console.log(data);
        }
    }
});