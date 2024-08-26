qx.Class.define("qxnw.nw_sync.main", {
    extend: qxnw.treeWidget,
    construct: function () {
        this.base(arguments);
        var self = this;
        var filters = [
            {
                name: "conexion",
                label: "Conexiones",
                type: "selectBox"
            },
            {
                name: "agregar_conexion",
                label: "Agregar Conexión",
                type: "button"
            },
            {
                name: "agregar_tabla",
                label: "Agregar Tabla",
                type: "button"
            }
        ];
        self.createFilters(filters);
        qxnw.utils.addClassToElement(self.ui.agregar_tabla, "btn_rojo_oscuro");
        qxnw.utils.addClassToElement(self.ui.agregar_tabla, "btn_rojo_oscuro");
        self.ui.agregar_tabla.setMinWidth(150);
        self.ui.agregar_tabla.setMaxWidth(150);
        self.ui.conexion.setMinWidth(600);
        self.ui.conexion.setMaxWidth(600);
        self.ui.agregar_tabla.setMinHeight(50);
        self.ui.agregar_tabla.setMaxHeight(50);
        qxnw.utils.addClassToElement(self.ui.agregar_conexion, "btn_rojo_oscuro");
        qxnw.utils.addClassToElement(self.ui.agregar_conexion, "btn_rojo_oscuro");
        self.ui.agregar_conexion.setMinWidth(150);
        self.ui.agregar_conexion.setMaxWidth(150);
        self.ui.agregar_conexion.setMinHeight(50);
        self.ui.agregar_conexion.setMaxHeight(50);
        var d = {};
        d[""] = self.tr("Seleccione");
        qxnw.utils.populateSelectFromArray(self.ui.conexion, d);
        qxnw.utils.populateSelect(self.ui.conexion, "nw_sync", "getMain");
        self.ui.agregar_tabla.addListener("execute", function () {
            self.addTable();
        });
        self.ui.agregar_conexion.addListener("execute", function () {
            self.addExp();
        });
        self.buttonSearch.addListener("execute", function () {
            self.populateTree();
        });
        self.viewJson = new qxnw.forms();
        self.viewJson.setTitle("Json");
        var fields = [
            {
                type: "startGroup",
                mode: "vertical"
            },
            {
                name: "json_tables",
                label: "Json Tables",
                type: "ckeditor"
            },
            {
                type: "endGroup"
            }
        ];
        self.syncAll = new qxnw.nw_sync.forms.f_syncAll();
        self.pageSync = self.addSubWindow("Sincronización inteligente de información :: QXNW", self.syncAll);
        self.pageSync.addListener("close", function () {
            self.syncAll = null;
        });
        self.viewJson.setFields(fields);
        self.page = self.addSubWindow("View Json", self.viewJson);
        self.page.addListener("close", function () {
            self.viewJson = null;
        });
        self.ui.conexion.addListener("changeSelection", function () {
            var conexion = this.getValue();
            var func = function (r) {
                if (r) {
                    self.syncAll.ui.enc.setValue(r.id);
                    var ckeditor = self.viewJson.ui.json_tables.getCKEditor();
                    self.viewJson.ui.json_tables.setValue(r.json);
                    ckeditor.setData(r.json);
                    ckeditor.updateElement();
                    self.populateTree();
                }
            };
            qxnw.utils.fastRpcAsyncCall("nw_sync", "selectEnc", conexion, func);
        });

    },
    destruct: function () {
    },
    members: {
        ntFilters: null,
        code: null,
        mainSelect: null,
        containercamposDisponibles: null,
        subList: null,
        addExp: function addExp() {
            var self = this;
            var f = new qxnw.forms();
            f.setModal(true);
            f.setTitle(self.tr("Nueva sincronización dinámica :: QXNW"));
            var fields = [
                {
                    name: "nombre",
                    label: self.tr("Nombre"),
                    type: "textField",
                    required: true
                },
                {
                    name: "url",
                    label: self.tr("URL"),
                    type: "textField",
                    required: true
                }
            ];
            f.setFields(fields);
            f.ui.cancel.addListener("execute", function () {
                f.close();
            });
            f.settings.accept = function () {
                self.populateTree();
            };
            f.ui.accept.addListener("execute", function () {
                if (!f.validate()) {
                    return;
                }
                var r = f.getRecord();
                var func = function (rta) {
                    if (rta) {
                        self.ui.conexion.removeAll();
                        qxnw.utils.populateSelectAsync(self.ui.conexion, "nw_sync", "getMain");
                    }
                    f.close();
                };
                qxnw.utils.fastAsyncRpcCall("nw_sync", "addMain", r, func);
            });
            f.show();
        },
        addTable: function addTable() {
            var self = this;
            var data = {};
            data.filters = self.getFiltersData();
            if (data.filters.conexion) {
                var f = new qxnw.nw_sync.forms.f_addField();
                f.setParamRecord(data.filters.conexion);
                f.settings.accept = function () {
                    self.populateTree();
                };
                f.setModal(true);
                f.show();
            }
        },
        populateTree: function populateTree() {
            var self = this;
            var rpc = new qxnw.rpc(self.getRpcUrl(), "nw_sync");
            rpc.setAsync(true);
            var data = {};
            data.filters = self.getFiltersData();
            var func = function (r) {
                var cuerpo = null;
                var cuerpo_1 = null;
                var cuerpo_2 = null;
                var icon = qxnw.config.execIcon("office-spreadsheet", "apps");
                self.addTreeHeader("Tablas  ", qxnw.config.execIcon("preferences-users", "apps"));
                for (var i = 0; i < r.length; i++) {
                    var prefix = "";
                    var sufix = "";
                    var div = "style='background:white'";
                    var header = self.addTreeFolder("<div><div " + div + ">\n\
                                                                         <b style='color: chocolate'> " + r[i].tipo + "</b>&nbsp;<b style='color: blue'>" + r[i].nombre + "</b>&nbsp;<b> >>" + r[i].orden + "</b>\n\
                                                                        </div>", icon, r[i], true);
                    header.setOpen(true);
                    header.addListener("click", function () {
                        var up = qxnw.userPolicies.getUserData();
                        var label = new qx.ui.basic.Label(html).set({
                            rich: true,
                            selectable: true
                        });
                        self.replaceOnLayer(label);
                        var si = header.getModel();
                        self.slotVerEvaluaciones(si);
                    });
                    var hijo = {};
                    var count = 1;
                    var id = 0;
                    var val = 0;
                    var parent = "";
                    var s = "";
                    var ra = self.slotDependencia(r[i].id);
                    if (ra) {
                        if (ra.length > 0) {
                            for (var ia = 0; ia < ra.length; ia++) {
                                var div = "style='background:white'";
                                hijo["hijo" + count] = self.addTreeFolder("<div>\n\
                                                                          <div " + div + ">\n\
                                                                  <b style='color: chocolate'>>" + ra[ia].tipo + "</b>&nbsp;<b style='color: blue'>" + ra[ia].nombre + " </b>&nbsp;<b>>> " + ra[ia].orden + "</b>\n\
                                                                        </div>", icon, ra[ia], header);
                                hijo["hijo" + count].addListener("click", function () {
                                    var html = self.createHtml(this.getModel());
                                    var label = new qx.ui.basic.Label(html).set({
                                        rich: true,
                                        selectable: true
                                    });
                                    self.replaceOnLayer(label);
                                    var model = this.getModel();
                                    self.slotVerEvaluaciones(model);
                                    self.updateEvaluaciones(model);
                                });
                                header.add(hijo["hijo" + count]);
                                var max_order = parseInt(ra[ia].orden);
                                var tipo = parseInt(ra[ia].tipo);
                                id = ra[ia].id;
                                count++;
                                for (var y = tipo; y <= max_order; y++) {
                                    var depen = self.slotDependencia(id);
                                    if (depen.length == 0) {
                                        s = s[val];
                                    } else {
                                        s = depen;
                                    }
                                    var s = self.slotDependencia(id);
                                    parent = parseInt(count) - 1;
                                    for (var x = 0; x < s.length; x++) {
                                        if (s[x].color != "") {
                                            var div = "style='background:" + s[x].color + "'";
                                        } else {
                                            var div = "style='background:white'";
                                        }
                                        hijo["hijo" + count] = self.addTreeFolder("<div>\n\
                                                                         <div " + div + ">\n\
                                                                         <b style='color: chocolate'>>" + s[x].tipo + "</b>&nbsp;<b style='color: blue'>" + s[x].nombre + " </b>&nbsp;<b>>> " + s[x].orden + "</b>\n\
                                                                        </div>", icon, s[x], hijo["hijo" + parent]);
                                        hijo["hijo" + count].addListener("click", function () {
                                            var html = self.createHtml(this.getModel());
                                            var label = new qx.ui.basic.Label(html).set({
                                                rich: true,
                                                selectable: true
                                            });
                                            self.replaceOnLayer(label);
                                            var model = this.getModel();
                                            self.updateEvaluaciones(model);
                                        });
                                        hijo["hijo" + parent].add(hijo["hijo" + count]);
                                        id = s[x].id;
                                        val = parseInt(x) + 1;
                                        cuerpo = s[val];
                                        count++;
                                    }

                                }
                            }
                        }
                    }
//                    self.items[r[i].nombres] = parent;

                }
            }
            ;
            rpc.exec("getTablesByEnc", data, func);
        },
        slotDependencia: function slotDependencia(pr) {
            var self = this;
            var ra = "";
            var rpc = new qxnw.rpc(this.rpcUrl, "nw_sync");
            var r = rpc.exec("getTablesByDependecy", pr);
            if (rpc.isError()) {
                qxnw.utils.error(rpc.getError(), self);
                return;
            }
            return r;
        },
        getContextMenuConections: function getContextMenuConections() {
            var self = this;
            var menu = new qx.ui.menu.Menu;
            var deleteButton = new qx.ui.menu.Button(self.tr("Eliminar"), qxnw.config.execIcon("edit-delete"));
            deleteButton.addListener("execute", function () {
                qxnw.utils.question(self.tr("¿Desea eliminar ésta conexión de tablas?"), function (e) {
                    if (e) {
                        var tar = self.filtersList.getSelection();
                        if (tar.length == 0) {
                            return;
                        }
                        var model = tar[0].getModel();
                        self.deleteConectionById(model.id);
                    }
                });
            });
            menu.add(deleteButton);
            return menu;
        }
    }
});