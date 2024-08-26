qx.Class.define("qxnw.nw_admin_db.trees.vista_general", {
    extend: qxnw.treeWidget,
    construct: function () {
        this.base(arguments);
        var self = this;
        self.pages = [];
        self.pagina = 0;
        var filters = [
            {
                label: "Registrar Conexión",
                type: "button",
                name: "nueva_coneccion"
            },
//            {
//                label: "Crear DB",
//                type: "button",
//                name: "crear_db"
//            },
            {
                label: "Configuración",
                type: "button",
                name: "configuracion"
            }
        ];
        self.createFilters(filters);
        self.populateTree();
        self.ui.searchButton.addListener("execute", function () {
            self.populateTree();
        });
        self.ui.nueva_coneccion.addListener("execute", function () {
            var f = new qxnw.nw_admin_db.forms.f_server();
            f.tipo = "new";
            f.settings.accept = function () {
                self.populateTree();
            };
            f.show();
        });
        self.ui.configuracion.addListener("execute", function () {
            var f = new qxnw.nw_admin_db.forms.f_configurations();
            f.settings.accept = function () {
            };
            f.show();
        });
        self.ui.nueva_coneccion.set({
            icon: qxnw.config.execIcon("list-add", "actions")
        });
        self.ui.configuracion.set({
            icon: qxnw.config.execIcon("system-run", "actions")
        });
    },
    destruct: function destruct() {
    },
    members: {
        vista_general: null,
        map: null,
        pages: null,
        sequence: null,
        funcion: null,
        view: null,
        view_page: null,
        triger_page: null,
        sequence_page: null,
        table: null,
        pagina: 0,
        functions: null,
        trigger: null,
        up: null,
        imp: null,
        navTableAdjuntos: null,
        nuevoImportacion: function nuevoImportacion() {
            var self = this;
            qxnw.utils.loading("Cargando elemento...");
            var interval = setInterval(function () {
                var d = new geimp.forms.f_transito_internacional();
                d.settings.accept = function () {
                    self.populateTree();
                };
                clearInterval(interval);
                d.show();
                d.maximize();
                d.setModal(true);
                qxnw.utils.stopPopup();
            }, 100);
        },
        populateTree: function populateTree() {
            var self = this;
            var rpc = new qxnw.rpc(self.getRpcUrl(), "nw_admin_tables");
            rpc.setAsync(true);
            var host = {};
            var db = {};
            var funcs = function (s) {
                self.addTreeHeader("Server ", qxnw.config.execIcon("mysql"));
                for (var i = 0; i < s.length; i++) {
                    host["s" + i] = self.addTreeFolder(s[i].nombre, qxnw.config.execIcon("utilities-terminal", "apps"), s[i], true);
                    host["s" + i].addListener("dblclick", function () {
                        var sl = this.getModel();
                        console.log("MODEL", sl);
                        var item_server = this;
                        this.setOpen(true);
                        this.removeAll();
                        if (sl.driver == "PGSQL") {
                            self.slotProcess(sl);
                        }
                        var new_db = self.addTreeFile("Nueva DB", qxnw.config.execIcon("list-add", "actions"), 0);
                        this.add(new_db);
                        new_db.addListener("click", function () {
                            self.slotNewTable();
                        });
                        qxnw.utils.loading("Cargando elemento...");
                        var interval = setInterval(function () {
                            var rpc = new qxnw.rpc(self.getRpcUrl(), "nw_admin_tables");
                            rpc.setAsync(true);
                            var funcs = function (res) {
//                                new_db.setLabel("Base Datos--><b> " + s.length);
                                for (var y = 0; y < res.length; y++) {
                                    db["db" + y] = self.addTreeFolder("<b>" + res[y].nombre, qxnw.config.execIcon("battery", "devices"), res[y]);
                                    db["db" + y].addListener("dblclick", function () {
                                        var model = this.getModel();
                                        this.removeAll();
                                        var item_db = this;
                                        this.setOpen(true);
                                        var func = function () {
                                            var item_service = self.addTreeFolder("Service", qxnw.config.execIcon("plus", "qxnw"), 0, true);
                                            var item_query = self.addTreeFile("New Query", qxnw.config.execIcon("list-add", "actions"), 0);
                                            item_db.add(item_service);
                                            item_db.add(item_query);
                                            item_query.addListener("click", function () {
                                                self.newQuery(model);
                                            });
                                            var item_backup = self.addTreeFile("Backup", qxnw.config.execIcon("chat3", "qxnw"), 0);
                                            item_service.add(item_backup);
                                            item_backup.addListener("click", function () {
                                                self.slotBackup(model);
                                            });
                                            var item_backup = self.addTreeFile("Restore", qxnw.config.execIcon("chat3", "qxnw"), 0);
                                            item_service.add(item_backup);
                                            item_backup.addListener("click", function () {
                                                self.slotRestore(model);
                                            });
                                            var item_tables = self.addTreeFolder("Tables", qxnw.config.execIcon("window-new"), 0);
                                            var item_functions = self.addTreeFolder("Functions", qxnw.config.execIcon("accessories", "categories"), 0);
                                            var item_views = self.addTreeFolder("Views", qxnw.config.execIcon("utilities-log-viewer", "apps"), 0);
                                            var item_triggers = self.addTreeFolder("Triggers", qxnw.config.execIcon("network-wired", "devices"), 0);
                                            var item_sequences = self.addTreeFolder("Sequences", qxnw.config.execIcon("view-sort-ascending"), 0);
                                            var item_procces = self.addTreeFolder("Procesos BD", qxnw.config.execIcon("window-new"), 0);
                                            item_db.add(item_tables);
                                            item_db.add(item_functions);
                                            item_db.add(item_views);
                                            item_db.add(item_triggers);
                                            item_db.add(item_sequences);
                                            item_db.add(item_procces);
                                            item_tables.setOpen(true);
                                            item_functions.setOpen(true);
                                            item_views.setOpen(true);
                                            item_triggers.setOpen(true);
                                            item_sequences.setOpen(true);
                                            item_procces.addListener("click", function () {
                                                self.slotProccesDB(model);
                                            });
                                            item_tables.addListener("dblclick", function () {
                                                item_tables.removeAll();
                                                var new_table = self.addTreeFile("Nueva Tabla", qxnw.config.execIcon("list-add", "actions"), 0);
                                                item_tables.add(new_table);
                                                new_table.addListener("click", function () {
                                                    self.slotNewTable(model);
                                                });
                                                qxnw.utils.loading("Cargando elemento...");
                                                var interval = setInterval(function () {
                                                    var r = {};
                                                    r.model = model;
                                                    var rpc = new qxnw.rpc(self.getRpcUrl(), "nw_admin_tables");
                                                    rpc.setAsync(true);
                                                    var funcs = function (s) {
                                                        item_tables.setLabel("Tablas --><b> " + s.length);
                                                        for (var i = 0; i < s.length; i++) {
                                                            s[i].model = model;
                                                            var table = self.addTreeFile("<b>" + s[i].nombre, qxnw.config.execIcon("battery", "devices"), s[i]);
                                                            table.addListener("dblclick", function () {
                                                                var models = this.getModel();
                                                                models.model = model;
                                                                self.updateWindows(models);
                                                            });
                                                            item_tables.add(table);
                                                        }
                                                    };
                                                    rpc.exec("populateTables", r, funcs);
                                                    clearInterval(interval);
                                                    qxnw.utils.stopPopup();
                                                }, 100);
                                            });
                                            item_views.addListener("dblclick", function () {
                                                qxnw.utils.loading("Cargando elemento...");
                                                var interval = setInterval(function () {
                                                    item_views.removeAll();
                                                    var new_view = self.addTreeFile("Nueva Vista", qxnw.config.execIcon("list-add", "actions"), 0);
                                                    item_views.add(new_view);
                                                    new_view.addListener("click", function (e) {
                                                        self.slotNewView();
                                                    });
                                                    var r = {};
                                                    r.model = model;
                                                    var rpc = new qxnw.rpc(self.getRpcUrl(), "nw_admin_tables");
                                                    rpc.setAsync(true);
                                                    var funcs = function (s) {
                                                        item_views.setLabel("Vistas --><b> " + s.length);
                                                        for (var i = 0; i < s.length; i++) {
                                                            s[i].model = model;
                                                            var view = self.addTreeFile("<b>" + s[i].nombre, qxnw.config.execIcon("view-fullscreen", "actions"), s[i]);
                                                            item_views.add(view);
                                                            view.addListener("dblclick", function () {
                                                                var models = this.getModel();
                                                                models.model = model;
                                                                self.updateWindows(models);
                                                            });
                                                        }
                                                    };
                                                    rpc.exec("populateViews", r, funcs);
                                                    clearInterval(interval);
                                                    qxnw.utils.stopPopup();
                                                }, 100);
                                            });
                                            item_functions.addListener("dblclick", function () {
                                                qxnw.utils.loading("Cargando elemento...");
                                                var interval = setInterval(function () {
                                                    item_functions.removeAll();
                                                    var new_function = self.addTreeFile("Nueva Función", qxnw.config.execIcon("list-add", "actions"), 0);
                                                    item_functions.add(new_function);
                                                    new_function.addListener("click", function (e) {
                                                        self.slotNewFunction();
                                                    });
                                                    var r = {};
                                                    r.model = model;
                                                    var rpc = new qxnw.rpc(self.getRpcUrl(), "nw_admin_tables");
                                                    rpc.setAsync(true);
                                                    var funcs = function (s) {
                                                        item_functions.setLabel("Funciones --><b> " + s.length);
                                                        for (var i = 0; i < s.length; i++) {
                                                            s[i].model = model;
                                                            var functionn = self.addTreeFile("<b>" + s[i].nombre, qxnw.config.execIcon("preferences-network", "apps"), s[i]);
                                                            item_functions.add(functionn);
                                                            functionn.addListener("dblclick", function () {
                                                                var models = this.getModel();
                                                                models.model = model;
                                                                self.updateWindows(models);
                                                            });
                                                        }
                                                    };
                                                    rpc.exec("populateFunctions", r, funcs);
                                                    clearInterval(interval);
                                                    qxnw.utils.stopPopup();
                                                }, 100);
                                            });
                                            item_triggers.addListener("dblclick", function () {
                                                qxnw.utils.loading("Cargando elemento...");
                                                var interval = setInterval(function () {
                                                    item_triggers.removeAll();
                                                    var new_function = self.addTreeFile("Nuevo Trigger", qxnw.config.execIcon("list-add", "actions"), 0);
                                                    item_functions.add(new_function);
                                                    new_function.addListener("click", function (e) {
                                                        self.slotNewFunction();
                                                    });
                                                    var r = {};
                                                    r.model = model;
                                                    var rpc = new qxnw.rpc(self.getRpcUrl(), "nw_admin_tables");
                                                    rpc.setAsync(true);
                                                    var funcs = function (s) {
                                                        s[i].model = model;
                                                        item_triggers.setLabel("Disparadores --><b> " + s.length);
                                                        for (var i = 0; i < s.length; i++) {
                                                            var functionn = self.addTreeFile("<b>" + s[i].nombre, qxnw.config.execIcon("security-high", "status"), s[i]);
                                                            item_triggers.add(functionn);
                                                        }
                                                    };
                                                    rpc.exec("populateTriggers", r, funcs);
                                                    clearInterval(interval);
                                                    qxnw.utils.stopPopup();
                                                }, 100);
                                            });
                                            item_sequences.addListener("dblclick", function () {
                                                qxnw.utils.loading("Cargando elemento...");
                                                var interval = setInterval(function () {
                                                    item_sequences.removeAll();
                                                    var r = {};
                                                    r.model = model;
                                                    var rpc = new qxnw.rpc(self.getRpcUrl(), "nw_admin_tables");
                                                    rpc.setAsync(true);
                                                    var funcs = function (s) {
                                                        item_sequences.setLabel("Secuencias --><b> " + s.length);
                                                        for (var i = 0; i < s.length; i++) {
                                                            s[i].model = model;
                                                            var functionn = self.addTreeFile("<b>" + s[i].nombre, qxnw.config.execIcon("view-sort-ascending", "actions"), s[i]);
                                                            item_sequences.add(functionn);
                                                            functionn.addListener("dblclick", function () {
                                                                var models = this.getModel();
                                                                models.model = model;
                                                                self.updateWindows(models);
                                                            });
                                                        }
                                                    };
                                                    rpc.exec("populateSequences", r, funcs);
                                                    clearInterval(interval);
                                                    qxnw.utils.stopPopup();
                                                }, 100);
                                            });
                                        };
                                        qxnw.utils.fastRpcAsyncCall("nw_admin_tables", "setUserConection", model, func);
                                    }
                                    );
                                    item_server.add(db["db" + y]);
                                }
                            };
                            rpc.exec("populateDBS", sl.host, funcs);
                            clearInterval(interval);
                            qxnw.utils.stopPopup();
                        }
                        , 100);
                    });
                }
            };
            rpc.exec("populateServers", 0, funcs);
        }
        ,
        contextMenu: function contextMenu(pos) {
            var self = this;
            var m = new qxnw.contextmenu(self.tree);
            var si = self.getSelectedItem();
            if (si.tipo == "table") {
                m.addAction("Renombrar Tabla", qxnw.config.execIcon("dialog-ok", "actions"), function (e) {
                    self.slotRenameTable(si);
                });
                m.addAction("Borrar Tabla", qxnw.config.execIcon("edit-delete", "actions"), function (e) {
                    self.slotDropTable();
                });
                m.addAction("Vaciar Tabla", qxnw.config.execIcon("view-restore", "actions"), function (e) {
                    self.slotEmptyTable();
                });
                m.addAction("Propiedades", qxnw.config.execIcon("view-restore", "actions"), function (e) {
                    self.slotPropieties();
                });
            }
            if (si.tipo == "trigger") {
                m.addAction(self.tr("Nueva Disparador"), qxnw.config.execIcon("list-add", "actions"), function (e) {
                    self.slotNewDisparador();
                });
            }
            if (si.tipo == "db") {
                m.addAction(self.tr("Editar Base datos"), qxnw.config.execIcon("list-add", "actions"), function (e) {
                    self.slotNewDisparador();
                });
            }
            if (si.tipo == "host") {
                m.addAction(self.tr("Registrar Base datos"), qxnw.config.execIcon("list-add", "actions"), function (e) {
                    self.slotRegisterDB();
                });
                m.addAction(self.tr("Editar Configuración"), qxnw.config.execIcon("dialog-ok", "actions"), function (e) {
                    self.slotEditDB();
                });
                m.addAction(self.tr("Borrar Host"), qxnw.config.execIcon("dialog-close", "actions"), function (e) {
                    self.slotDeleteDB();
                });
                m.addAction(self.tr("Desconectar Host"), qxnw.config.execIcon("insert-link", "actions"), function (e) {
                    self.slotDeleteDB();
                });
            }
//            m.addAction("Duplicate Table", qxnw.config.execIcon("object-flip-horizontal", "actions"), function (e) {
//            });
            m.setParentWidget(self.tree);
            m.exec(pos);
        }
        ,
        updateWindows: function updateWindows(r) {
            var self = this;
            self.table = {};
            self.funcion = {};
            self.view_page = {};
            self.triger_page = {};
            switch (r.tipo) {
                case "table":
                    if (self.pages["table" + r.nombre] == null)
                    {
                        qxnw.utils.loading("Cargando elemento...");
                        var interval = setInterval(function () {
                            self.tabla = new qxnw.nw_admin_db.forms.f_tables();
                            self.table["table" + r.nombre] = new qxnw.nw_admin_db.forms.f_tables();
                            self.table["table" + r.nombre].setParamRecord(r);
                            self.table.model = r.model;
                            var page = self.addSubWindow("public." + r.nombre, self.table["table" + r.nombre]);
                            clearInterval(interval);
                            self.pages["table" + r.nombre] = page;
                            page.setShowCloseButton(true);
                            page.addListener("close", function () {
                                self.pages["table" + r.nombre] = null;
                            });
                            page.setIcon(qxnw.config.execIcon("battery", "devices"));
                            qxnw.utils.stopLoading();
                        }, 100);
                    } else {
                        self.selectPage(self.pages["table" + r.nombre]);
                        self.tabla.setParamRecord(r);
                    }
                    break;
                case "function":
                    if (self.pages["function" + r.nombre] == null)
                    {
                        qxnw.utils.loading("Cargando elemento...");
                        var interval = setInterval(function () {
                            self.funcion = new qxnw.nw_admin_db.forms.f_view_objects();
                            self.funcion["function" + r.nombre] = new qxnw.nw_admin_db.forms.f_view_objects();
                            self.funcion["function" + r.nombre].setParamRecord(r);
                            var page = self.addSubWindow("public." + r.nombre, self.funcion["function" + r.nombre]);
                            clearInterval(interval);
                            self.pages["function" + r.nombre] = page;
                            page.setShowCloseButton(true);
                            page.addListener("close", function () {
                                self.pages["function" + r.nombre] = null;
                            });
                            page.setIcon(qxnw.config.execIcon("battery", "devices"));
                            qxnw.utils.stopLoading();
                            clearInterval(interval);
                            qxnw.utils.stopLoading();
                        }, 100);
                    } else {
                        self.selectPage(self.pages["function" + r.nombre]);
                        self.funcion["function" + r.nombre].setParamRecord(r);
                    }
                    break;
                case "view":
                    if (self.pages["vista" + r.nombre] == null)
                    {
                        qxnw.utils.loading("Cargando elemento...");
                        var interval = setInterval(function () {
                            self.view_page = new qxnw.nw_admin_db.forms.f_view_objects();
                            self.view_page["vista" + r.nombre] = new qxnw.nw_admin_db.forms.f_view_objects();
                            self.view_page["vista" + r.nombre].setParamRecord(r);
                            var page = self.addSubWindow("public." + r.nombre, self.view_page["vista" + r.nombre]);
                            clearInterval(interval);
                            self.pages["vista" + r.nombre] = page;
                            page.setShowCloseButton(true);
                            page.addListener("close", function () {
                                self.pages["vista" + r.nombre] = null;
                            });
                            page.setIcon(qxnw.config.execIcon("battery", "devices"));
                            qxnw.utils.stopLoading();
                            clearInterval(interval);
                            qxnw.utils.stopLoading();
                        }, 100);
                    } else {
                        self.selectPage(self.pages["vista" + r.nombre]);
                        self.view_page["vista" + r.nombre].setParamRecord(r);
                    }
                    break;
                case "trigger":
                    if (self.pages["trigger" + r.nombre] == null)
                    {
                        qxnw.utils.loading("Cargando elemento...");
                        var interval = setInterval(function () {
                            self.triger_page = new qxnw.nw_admin_db.forms.f_view_objects();
                            self.triger_page["trigger" + r.nombre] = new qxnw.nw_admin_db.forms.f_view_objects();
                            self.triger_page["trigger" + r.nombre].setParamRecord(r);
                            var page = self.addSubWindow("public." + r.nombre, self.triger_page["trigger" + r.nombre]);
                            clearInterval(interval);
                            self.pages["trigger" + r.nombre] = page;
                            page.setShowCloseButton(true);
                            page.addListener("close", function () {
                                self.pages["trigger" + r.nombre] = null;
                            });
                            page.setIcon(qxnw.config.execIcon("battery", "devices"));
                            qxnw.utils.stopLoading();
                            clearInterval(interval);
                            qxnw.utils.stopLoading();
                        }, 100);
                    } else {
                        self.selectPage(self.pages["trigger" + r.nombre]);
                        self.triger_page["trigger" + r.nombre].setParamRecord(r);
                    }
                    break;
                case "sequence":
                    if (self.pages["sequence_page" + r.nombre] == null)
                    {
                        qxnw.utils.loading("Cargando elemento...");
                        var interval = setInterval(function () {
                            self.sequence_page = new qxnw.nw_admin_db.forms.f_sequence();
                            self.sequence_page["sequence_page" + r.nombre] = new qxnw.nw_admin_db.forms.f_sequence();
                            self.sequence_page["sequence_page" + r.nombre].setParamRecord(r);
                            var page = self.addSubWindow("public." + r.nombre, self.sequence_page["sequence_page" + r.nombre]);
                            clearInterval(interval);
                            self.pages["sequence_page" + r.nombre] = page;
                            page.setShowCloseButton(true);
                            page.addListener("close", function () {
                                self.pages["sequence_page" + r.nombre] = null;
                            });
                            page.setIcon(qxnw.config.execIcon("battery", "devices"));
                            qxnw.utils.stopLoading();
                            clearInterval(interval);
                            qxnw.utils.stopLoading();
                        }, 100);
                    } else {
                        self.selectPage(self.pages["sequence_page" + r.nombre]);
                        self.sequence_page["sequence_page" + r.nombre].setParamRecord(r);
                    }
                    break;
            }
        }
        ,
        newQuery: function newQuery(model) {
            var self = this;
            qxnw.utils.loading("Cargando elemento...");
            var interval = setInterval(function () {
                self.pagina++;
                self.query = new qxnw.nw_admin_db.forms.f_query();
                var page = self.addSubWindow(model.host + "-" + model.db_name + "-Query." + self.pagina, self.query);
                self.query.model = model;
                clearInterval(interval);
                page.setShowCloseButton(true);
                page.setIcon(qxnw.config.execIcon("battery", "devices"));
                qxnw.utils.stopLoading();
            }, 100);
        },
        slotProccesDB: function slotProccesDB(model) {
            var self = this;
            var models = {};
            models.model = model;
            qxnw.utils.loading("Cargando elemento...");
            var interval = setInterval(function () {
                self.pagina++;
                self.procces = new qxnw.nw_admin_db.forms.procces_db(models);
                var page = self.addSubWindow(model.host + "-" + model.db_name + "-Procces.", self.procces);
                self.procces.model = model;
                clearInterval(interval);
                page.setShowCloseButton(true);
                page.setIcon(qxnw.config.execIcon("battery", "devices"));
                qxnw.utils.stopLoading();
            }, 100);
        },
        slotProcess: function slotProcess(model) {
            var self = this;
            qxnw.utils.loading("Cargando elemento...");
            var interval = setInterval(function () {
                self.funcion = new qxnw.nw_admin_db.lists.l_process();
                self.funcion["process"] = new qxnw.nw_admin_db.lists.l_process();
                self.funcion["process"].slotInfoHost(model);
                var page = self.addSubWindow("Process Server -> " + model.host, self.funcion["process"]);
                clearInterval(interval);
                self.pages["process"] = page;
                page.setShowCloseButton(true);
                page.addListener("close", function () {
                    self.pages["process"] = null;
                });
                page.setIcon(qxnw.config.execIcon("battery", "devices"));
                qxnw.utils.stopLoading();
                clearInterval(interval);
                qxnw.utils.stopLoading();
            }, 100);
        },
        slotNewTable: function slotNewTable(pr) {
            var self = this;
            var d = new qxnw.nw_admin_db.forms.f_new_table();
            d.model = pr;
            qxnw.utils.populateSelectAsync(d.ui.owner, "nw_admin_tables", "populateOwner", {"model": pr});
            d.show();
            d.ui.accept.addListener("execute", function () {
                self.populateTree();
            });
        }
        ,
        slotNewFunction: function slotNewFunction(pr) {
            var self = this;
            var d = new qxnw.nw_admin_db.forms.f_view_objects();
            qxnw.utils.loading("Cargando elemento...");
            var interval = setInterval(function () {
                self.funcion = new qxnw.nw_admin_db.forms.f_view_objects();
                self.funcion["function_new"] = new qxnw.nw_admin_db.forms.f_view_objects();
                self.funcion["function_new"].Function();
                var page = self.addSubWindow("Function New", self.funcion["function_new"]);
                clearInterval(interval);
                self.pages["function_new"] = page;
                page.setShowCloseButton(true);
                page.addListener("close", function () {
                    self.pages["function_new"] = null;
                });
                page.setIcon(qxnw.config.execIcon("battery", "devices"));
                qxnw.utils.stopLoading();
                clearInterval(interval);
                qxnw.utils.stopLoading();
            }, 100);
            d.Function();
        }
        ,
        slotRegisterDB: function slotRegisterDB(pr) {
            var self = this;
            var si = self.getSelectedItem();
            qxnw.utils.loading("Cargando elemento...");
            var interval = setInterval(function () {
                var f = new qxnw.nw_admin_db.forms.f_server_db();
                f.ui.db_name.setRequired(true);
                f.tipo = 'new';
                qxnw.utils.populateSelectFromArray(f.ui.db_name, {"": "Seleccione"});
                qxnw.utils.populateSelect(f.ui.db_name, "nw_admin_tables", "populateDatabases", si);
                f.setRecord(si);
                f.settings.accept = function () {
                    self.populateTree();
                };
                f.show();
                qxnw.utils.stopLoading();
                clearInterval(interval);
                qxnw.utils.stopLoading();
            }, 100);
        },
        slotEditDB: function slotEditDB(pr) {
            var self = this;
            var si = self.getSelectedItem();
            qxnw.utils.loading("Cargando elemento...");
            var interval = setInterval(function () {
                var f = new qxnw.nw_admin_db.forms.f_server();
                f.tipo = "edit";
                qxnw.utils.populateSelectFromArray(f.ui.db_name, {"": "Seleccione"});
                qxnw.utils.populateSelect(f.ui.db_name, "nw_admin_tables", "populateDatabases", si);
                f.ui.accept.setEnabled(true);
                f.setRecord(si);
                f.settings.accept = function () {
                    self.populateTree();
                };
                f.show();
                qxnw.utils.stopLoading();
                clearInterval(interval);
                qxnw.utils.stopLoading();
            }, 100);
        },
        slotDeleteDB: function slotDeleteDB(pr) {
            var self = this;
            var si = self.getSelectedItem();
            qxnw.utils.loading("Cargando elemento...");
            var interval = setInterval(function () {
                var funcs = function () {
                    self.populateTree();
                };
                qxnw.utils.fastRpcAsyncCall("nw_admin_tables", "deleteServers", si, funcs);
                qxnw.utils.stopLoading();
                clearInterval(interval);
                qxnw.utils.stopLoading();
            }, 100);
        },
        slotNewView: function slotNewView(pr) {
            var self = this;
            var d = new qxnw.nw_admin_db.forms.f_view_objects();
            qxnw.utils.loading("Cargando elemento...");
            var interval = setInterval(function () {
                self.view_page = new qxnw.nw_admin_db.forms.f_view_objects();
                self.view_page["vista_new"] = new qxnw.nw_admin_db.forms.f_view_objects();
                self.view_page["vista_new"].View();
                var page = self.addSubWindow("vista_new", self.view_page["vista_new"]);
                clearInterval(interval);
                self.pages["vista_new"] = page;
                page.setShowCloseButton(true);
                page.addListener("close", function () {
                    self.pages["vista_new"] = null;
                });
                page.setIcon(qxnw.config.execIcon("battery", "devices"));
                qxnw.utils.stopLoading();
                clearInterval(interval);
                qxnw.utils.stopLoading();
            }, 100);
            d.Function();
        }
        ,
        slotRenameTable: function slotRenameTable(pr) {
            var self = this;
            var d = new qxnw.forms();
            var fields = [
                {
                    name: "rename_table",
                    label: "Nombre",
                    type: "textField",
                    required: true
                }
            ];
            d.setFields(fields);
            d.ui.rename_table.setValue(pr.nombre.toString());
            d.ui.rename_table.setTextSelection(0);
            d.ui.cancel.addListener("execute", function () {
                d.reject();
            });
            d.ui.accept.addListener("execute", function () {
                if (!d.validate()) {
                    return;
                }
                self.data = d.getRecord();
                qxnw.utils.question("<b>¿Esta Seguro de renombrar esta tabla public." + pr.nombre, function (e) {
                    if (e) {
                        d.accept();
                        self.data.detalle = pr;
                        self.data.model = pr.model;
                        var funcs = function () {
                            self.populateTree();
                        };
                        qxnw.utils.fastRpcAsyncCall("nw_admin_table_init", "renameTable", self.data, funcs);
                    } else {
                        return;
                    }
                });
            });
            d.show();
        }
        ,
        slotDropTable: function slotDropTable(pr) {
            var self = this;
            var si = self.getSelectedItem();
            qxnw.utils.question("<b>¿Esta Seguro de borrar esta tabla public." + si.nombre, function (e) {
                if (e) {
                    var rpc = new qxnw.rpc(self.getRpcUrl(), "nw_admin_table_init");
                    rpc.setAsync(true);
                    var funcs = function () {
                        self.populateTree();
                    };
                    rpc.exec("dropTable", si, funcs);
                } else {
                    return;
                }
            });
        }
        ,
        slotEmptyTable: function slotEmptyTable(pr) {
            var self = this;
            var si = self.getSelectedItem();
            qxnw.utils.question("<b>¿Esta Seguro de vaciar esta tabla public." + si.nombre, function (e) {
                if (e) {
                    var rpc = new qxnw.rpc(self.getRpcUrl(), "nw_admin_table_init");
                    rpc.setAsync(true);
                    var funcs = function () {
                        self.populateTree();
                    };
                    rpc.exec("emptyTable", si, funcs);
                } else {
                    return;
                }
            });
        }
        ,
        slotBackup: function slotBackup(pr) {
            var self = this;
            var si = self.getSelectedItem();
            var r = {};
            r.model = pr;
            qxnw.utils.question("<b>¿Esta Seguro de generar el backup de esta base de datos? ", function (e) {
                if (e) {
                    var funcs = function (data) {
                        if (typeof data != 'undefined' && data != null) {
                            window.open(window.location.protocol + "//" + window.location.hostname + "/nwlib" + qxnw.userPolicies.getNwlibVersion() + "/downloader.php?id=" + data.id + "&key=" + data.key, '_blank');
                        }
                    };
                    qxnw.utils.fastRpcAsyncCall("nw_admin_tables", "pg_dumpDataBase", r, funcs);
                } else {
                    return;
                }
            });
        },
        slotRestore: function slotRestore(pr) {
            var self = this;
            var f = [
                {
                    name: "adjunto",
                    label: self.tr("Adjunto"),
                    type: "uploader",
                    required: true
                },
                {
                    name: "limpiar",
                    label: self.tr("Limpiar DB"),
                    type: "checkBox"
                }];
            var dialog = qxnw.utils.dialog(f, self.tr("Elija el archivo a subir"), true);
            dialog.setModal(true);
            dialog.settings.accept = function () {
                var d = dialog.getRecord();
                d.model = pr;
                qxnw.utils.question("<b>¿Esta Seguro de generar el restore a esta base de datos? ", function (e) {
                    if (e) {
                        var funcs = function (data) {
                            qxnw.utils.information("Db Actualizada correctamente.");
                        };
                        qxnw.utils.fastRpcAsyncCall("nw_admin_tables", "pg_restoreDataBase", d, funcs);
                    } else {
                        return;
                    }
                });
            };
        }
    }
});