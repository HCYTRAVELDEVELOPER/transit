qx.Class.define("qxnw.forms.permissions", {
    extend: qxnw.lists,
    construct: function () {
        this.base(arguments, true);
        this.createBase();
        var self = this;
        self.__splitPaneP = new qx.ui.splitpane.Pane("vertical");
        self.containerTable.add(self.__splitPaneP, {
            flex: 1
        });
        self.createTree();
        self.createMenu();
        self.__modulesGeneral = [];
        var filters = [
            {
                name: "empresaCopyFrom",
                type: "selectBox",
                label: self.tr("<b>Empresa</b>")
            },
            {
                name: "select_user_profile",
                type: "selectBox",
                label: self.tr("<b>Seleccione usuario o perfil</b>")
            },
            {
                name: "user",
                type: "selectTokenField",
                label: self.tr("<b>Usuario</b>"),
                enabled: false
            },
            {
                name: "profile",
                type: "selectBox",
                label: self.tr("<b>Perfil</b>"),
                enabled: false
            },
            {
                name: "filtro",
                type: "textField",
                mode: "search",
                label: self.tr("<b>Filtro...</b>"),
                visible: false
            }
        ];
        self.createFilters(filters);
        var data = {};
        data[""] = "Seleccione...";
        data["USUARIO"] = "Usuario";
        data["PERFIL"] = "Perfil";
        qxnw.utils.populateSelectFromArray(self.ui.select_user_profile, data);
        self.ui.select_user_profile.addListener("changeSelection", function (e) {
            var v = this.getValue();
            self.setConfiguration(v);
        });
        self.ui.user.setHintText(self.tr("Buscar..."));
        self.ui.user.addListener("addItem", function (e) {
            var v = e.getData();
            var rpc = new qxnw.rpc(self.getRpcUrl(), "nw_permissions");
            rpc.setAsync(true);
            var func = function (r) {
                if (r.length == 0) {
                    var f = new qxnw.forms();
                    f.setTitle(self.tr("Seleccione la terminal asociada"));
                    var fields = [
                        {
                            name: "terminal",
                            label: self.tr("Terminal"),
                            type: "selectBox",
                            required: true
                        }
                    ];
                    f.setFields(fields);
                    qxnw.utils.populateSelectAsync(f.ui.terminal, "master", "populate", {table: "terminales"});
                    f.ui.cancel.addListener("execute", function () {
                        f.reject();
                        self.ui.user.cleanAll();
                    });
                    f.ui.accept.addListener("execute", function () {
                        if (!f.validate()) {
                            return;
                        }
                        v.terminal = f.ui.terminal.getValue().terminal;
                        v.empresaCopyFrom = self.ui.empresaCopyFrom.getValue()["empresaCopyFrom"];
                        qxnw.utils.loading("Creando perfil personalizado...");
                        var rpc = new qxnw.rpc(self.getRpcUrl(), "nw_permissions");
                        rpc.setAsync(true);
                        var funcA = function (r) {
                            if (r) {
                                f.accept();
                                self.processProfileFromUser(r);
                            }
                        };
                        rpc.exec("createUserProfile", v, funcA);
                    });
                    f.show();
                } else {
                    self.processProfileFromUser(r);
                }
            };
            rpc.exec("getProfileByUser", v, func);
        });
        self.ui.user.addListener("loadData", function (e) {
            var data = {};
            data["token"] = e.getData();
            var rpc = new qxnw.rpc(self.getRpcUrl(), "nw_permissions");
            rpc.setAsync(true);
            var func = function (r) {
                self.ui.user.setModelData(r);
            };
            rpc.exec("getUsers", data, func);
        });
        data = {};
        data[""] = "Seleccione...";
        qxnw.utils.populateSelectFromArray(self.ui.profile, data);
        self.ui.profile.addListener("changeSelection", function () {
            if (self.__stopChangin) {
                return;
            }
            var v = self.ui.profile.getValue();
            if (v["profile"] == "") {
                self.enableAllButtons(false);
            } else {
                self.enableAllButtons(true);
            }
            if (v["profile"] == null) {
                return;
            }
            if (typeof self.ui.newProfileButton != 'undefined') {
                self.ui.newProfileButton.setEnabled(true);
            }
            self.populateProfiles();
        });
        self.ui.searchButton.addListener("execute", function (e) {
            self.populateProfiles();
        });
        var filters = [
            {
                name: "copyProfileButton",
                type: "button",
                label: self.tr("Copiar perfil"),
                icon: qxnw.config.execIcon("edit-copy")
            },
            {
                name: "saveButton",
                type: "button",
                label: self.tr("Guardar"),
                icon: qxnw.config.execIcon("dialog-ok")
            },
            {
                name: "newProfileButton",
                type: "button",
                label: self.tr("Nuevo perfil"),
                icon: qxnw.config.execIcon("list-add")
            },
            {
                name: "deleteProfileButton",
                type: "button",
                label: self.tr("Borrar perfil"),
                icon: qxnw.config.execIcon("edit-delete")
            }
        ];
        self.addFiltersButtons(filters);
        self.ui.copyProfileButton.setVisibility("excluded");
        self.setFieldVisibility(self.ui.empresaCopyFrom, "excluded");
        self.ui.saveButton.addListener("execute", function (e) {
            self.savePermissions();
        });
        self.__stopChangin = false;
        self.ui.newProfileButton.addListener("execute", function (e) {
            var f = new qxnw.basics.forms.f_perfiles();
            f.settings.accept = function () {
                var data = {};
                data[""] = "Seleccione...";
                self.__stopChangin = true;
                self.ui.profile.removeAll();
                qxnw.utils.populateSelectFromArray(self.ui.profile, data);
                qxnw.utils.populateSelect(self.ui.profile, "nw_permissions", "getProfilesWithoutUsers");
                self.__stopChangin = false;
                f.close();
            };
            f.show();
        });
        self.ui.deleteProfileButton.addListener("execute", function (e) {
            qxnw.utils.question("¿Está seguro de eliminar el perfil y sus permisos asociados?", function (e) {
                if (e) {
                    self.deleteProfile();
                } else {
                    return;
                }
            });
        });
        self.hideTools();
        self.__modulesGroup = [];
        self.items = [];
        self.enableAllButtons(false);
        self.ui.newProfileButton.setEnabled(true);
    },
    members: {
        items: null,
        __modulesGroup: null,
        __tree: null,
        __modulesGroups: null,
        __modulesGeneral: null,
        __filter: null,
        __treeInside: null,
        __stopChangin: null,
        __splitPaneP: null,
        __containerDash: null,
        __containerUsers: null,
        containerMenu: null,
        menu: null,
        getContainerUsers: function getContainerUsers() {
            return this.__containerUsers;
        },
        getContainerDash: function getContainerDash() {
            return this.__containerDash;
        },
        deleteProfile: function deleteProfile() {
            var self = this;
            var data = {};
            data.profile = self.ui.profile.getValue().profile;
            var rpc = new qxnw.rpc(self.getRpcUrl(), "nw_permissions");
            rpc.setAsync(true);
            var func = function (r) {
                if (r) {
                    var ra = self.ui.select_user_profile.getValue();
                    self.setConfiguration(ra);
                    qxnw.utils.information(self.tr("Perfil y permisos eliminados correctamente"));
                }
            };
            rpc.exec("deleteProfileAndPermissions", data, func);
        },
        setConfiguration: function setConfiguration(v) {
            var self = this;
            if (v.select_user_profile == "USUARIO") {
                self.ui.user.setEnabled(true);
                self.ui.profile.setEnabled(false);
                self.ui.profile.setValue("");
                self.ui.user.cleanAll();
                self.ui.user.focus();
            } else {
                self.ui.profile.removeAll();
                var data = {};
                data[""] = "Seleccione...";
                qxnw.utils.populateSelectFromArray(self.ui.profile, data);
                self.ui.user.cleanAll();
//                self.ui.user.setEnabled(false);
                self.ui.profile.setEnabled(true);
                qxnw.utils.populateSelect(self.ui.profile, "nw_permissions", "getProfilesWithoutUsers");
                self.ui.profile.focus();
            }

            self.__tree.cleanAll();
            self.__containerUsers.removeAll();
            self.__containerDash.removeAll();
        },
        processProfileFromUser: function processProfileFromUser(r) {
            var self = this;
            var data = {};
            data[r[0].id] = r[0].id;
            qxnw.utils.populateSelectFromArray(self.ui.profile, data, r[0].id);
            qxnw.utils.stopLoading();
        },
        getTree: function getTree() {
            return this.__tree;
        },
        getModulesGroup: function getModulesGroup() {
            return this.__modulesGroup;
        },
        createMenu: function createMenu() {
            var self = this;
            var maincontainer = new qx.ui.container.Scroll();
            var container = new qx.ui.container.Composite(new qx.ui.layout.HBox());
            var containerv = new qx.ui.container.Composite(new qx.ui.layout.VBox());
            var lbl = new qx.ui.basic.Label(self.tr("Vista de menú"));
            containerv.add(lbl);
            self.containerMenu = new qx.ui.container.Composite(new qx.ui.layout.VBox()).set({
                minHeight: 50
            });
            self.__containerDash = new qx.ui.container.Composite(new qx.ui.layout.Flow());
            self.__containerDash.setAlignX("left");
            containerv.add(self.containerMenu);
            containerv.add(self.__containerDash, {
                flex: 0
            });
            self.__containerUsers = new qx.ui.container.Composite(new qx.ui.layout.VBox()).set({
                minWidth: 300
            });
            container.add(containerv, {
                flex: 1
            });
            container.add(self.__containerUsers, {
                flex: 1
            });
            maincontainer.add(container);
            self.__splitPaneP.add(maincontainer);
        },
        constructMenu: function constructMenu(module) {
            var self = this;
            if (self.menu == null) {
                self.menu = new qxnw.menu(this);
            }
            if (self.menu != null) {
                self.menu.removeMenu();
            }
            var rpc = new qxnw.rpc(self.getRpcUrl(), "nw_permissions");
            rpc.setAsync(true);
            var func = function (r) {
                var clase = null;
                for (var i = 0; i < r.length; i++) {
                    if (r[i].nivel == 1) {
                        clase = r[i].clase;
                        self.menu.addMenu(r[i].nombre, 0);
                        for (var ia = 0; ia < r.length; ia++) {
                            if (r[ia].nivel == 2) {
                                if (r[ia].pariente == r[i].id) {
                                    self.menu.addMenuAction(r[ia].nombre, r[ia].icono, 0, self);
                                    for (var ib = 0; ib < r.length; ib++) {
                                        if (r[ib].nivel == 3) {
                                            if (r[ib].pariente == r[ia].id) {
                                                self.menu.addSubMenuAction(r[ib].nombre, r[ib].icono, 0, self);
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                self.menu.exec();
            };
            var data = {};
            if (typeof module != 'undefined') {
                data["modulo"] = module;
            }
            data["perfil"] = self.ui.profile.getValue()["profile"];
            rpc.exec("getMenuHeader", data, func);
            return true;
        },
        createTree: function createTree() {
            var self = this;
            self.__tree = new qxnw.tree();
            self.__tree.setTitle(self.tr("Permisos dinámicos"));
            self.__splitPaneP.add(self.__tree.getBase());
            self.__tree.addMainLevel();
            function onBeforeContextmenuOpen(ev) {
                self.__treeInside.resetContextMenu();
                self.__treeInside.setContextMenu(null);
            }
            self.__treeInside = self.__tree.getTree();
            self.__treeInside.addListener("beforeContextmenuOpen", onBeforeContextmenuOpen);
            self.__treeInside.addListener("contextmenu", function (e) {
                try {
                    var target = e.getTarget();
                    var m = target.getModel();
                    if (typeof m.type != 'undefined') {
                        if (m.type == "level4") {
                            e.stop();
                            e.preventDefault();
                            self.__treeInside.setContextMenu(null);
                            return;
                        } else if (m.type == "userActions") {
                            if (target.classname == "qx.ui.tree.TreeFile" || target.classname == "qx.ui.tree.TreeFolder") {
                                var children = this.getItems();
                                for (var i = 0; i < children.length; i++) {
                                    children[i].removeState("selected");
                                }
                                this.setSelection([target]);
                                target.addState("selected");
                                self.contextMenuComponents(e);
                            } else {
                                e.stop();
                                e.preventDefault();
                                self.__treeInside.setContextMenu(null);
                                return;
                            }
                        } else if (m.type == "modules") {
                            if (target.classname == "qx.ui.tree.TreeFile" || target.classname == "qx.ui.tree.TreeFolder") {
                                var children = this.getItems();
                                for (var i = 0; i < children.length; i++) {
                                    children[i].removeState("selected");
                                }
                                this.setSelection([target]);
                                target.addState("selected");
                                self.contextMenuComponents(e);
                            } else {
                                e.stop();
                                e.preventDefault();
                                self.__treeInside.setContextMenu(null);
                                return;
                            }
                        } else if (m.type == "level1") {
                            if (target.classname == "qx.ui.tree.TreeFile" || target.classname == "qx.ui.tree.TreeFolder") {
                                var children = this.getItems();
                                for (var i = 0; i < children.length; i++) {
                                    children[i].removeState("selected");
                                }
                                this.setSelection([target]);
                                target.addState("selected");
                                self.contextMenu(e);
                            } else {
                                e.stop();
                                e.preventDefault();
                                self.__treeInside.setContextMenu(null);
                                return;
                            }
                        }
                    }

                } catch (e) {

                }
            });
        },
        contextMenuComponents: function contextMenuComponents(pos) {
            var self = this;
            var m = new qxnw.contextmenu(this);
            m.addAction("Editar componente", qxnw.config.execIcon("edit-redo"), function (e) {
                self.editComponent();
            });
//            m.addAction("Editar menú", qxnw.config.execIcon("dialog-ok"), function (e) {
//                self.editMenu();
//            });
            m.addAction("Desasociar componente", qxnw.config.execIcon("list-remove"), function (e) {
                self.disassociateComponent();
            });
            m.setParentWidget(self.__treeInside);
            m.exec(pos);
        },
        contextMenu: function contextMenu(pos) {
            var self = this;
            var m = new qxnw.contextmenu(this);
            var up = qxnw.userPolicies.getUserData();
            if (qxnw.userPolicies.isDeveloper(up.user)) {
                m.addAction("Editar módulo", qxnw.config.execIcon("folder-new"), function (e) {
                    self.editModule();
                });
            }
            m.addAction("Asociar componente", qxnw.config.execIcon("media-record"), function (e) {
                self.asociateComponent();
            });
            m.addAction("Copiar de otro perfil...", qxnw.config.execIcon("edit-copy"), function (e) {
                self.copyProfile();
            });
            m.setParentWidget(self.__treeInside);
            m.exec(pos);
        },
        disassociateComponent: function disassociateComponent() {
            var self = this;
            var model = self.__tree.getSelectedItem();
            qxnw.utils.question("¿Está seguro de desasociar el componente al módulo?", function (e) {
                if (e) {
                    var rpc = new qxnw.rpc(self.getRpcUrl(), "nw_permissions");
                    rpc.setAsync(true);
                    var func = function (rta) {
                        if (rta) {
                            self.populateProfiles();
                        }
                    };
                    rpc.exec("disassociateComponent", model.model, func);
                } else {
                    return;
                }
            });
        },
        editMenu: function editMenu() {
            var self = this;
            var model = self.__tree.getSelectedItem();
            console.log(model);
            var va = {};
            va["empresa"] = model.model.empresa;
            var d = new qxnw.basics.forms.f_menu();
            d.ui.empresa.setValue(model.model.empresa);
            qxnw.utils.populateSelect(d.ui.grupo, "nw_permisos", "getGrupos", va);
            model.model.id = model.model.id_menu;
            d.setParamRecord(model.model);
            d.settings.accept = function () {
                self.populateProfiles();
            };
            d.show();
        },
        editComponent: function editComponent() {
            var self = this;
            var model = self.__tree.getSelectedItem();
            var va = {};
            va["empresa"] = model.model.empresa;
            var d = new qxnw.basics.forms.f_componentes();
            d.setParamRecord(model.model);
            qxnw.utils.populateSelect(d.ui.grupo, "nw_permisos", "getGrupos", va);
            d.ui.grupo.setValue(model.model.grupo);
            d.settings.accept = function () {
                self.populateProfiles();
            };
            d.show();
        },
        editModule: function editModule() {
            var self = this;
            var f = new qxnw.basics.forms.f_modulos();
            var model = self.__tree.getSelectedItem();
            var va = {};
            va["empresa"] = model.model.empresa;
            qxnw.utils.populateSelect(f.ui.pariente, "nw_permisos", "getGrupos", va);
            f.setParamRecord(model.model);
            f.settings.accept = function () {
                self.populateProfiles();
            };
            f.show();
        },
        copyProfile: function copyProfile() {
            var self = this;
            var fields = [{
                    name: "last_profile",
                    type: "selectBox",
                    label: self.tr("Perfil")
                }
            ];
            var f = new qxnw.utils.dialog(fields);
            qxnw.utils.autoPopulateSelectAsync(f.ui.last_profile, "perfiles");
            f.settings.accept = function () {
                var r = f.getRecord();
                r["first_profile"] = self.ui.profile.getValue()["profile"];
                var func = function (ret) {
                    if (ret) {
                        self.populateProfiles();
                    }
                };
                qxnw.utils.fastAsyncRpcCall("nw_permissions", "copyProfile", r, func);
            };
        },
        asociateComponent: function asociateComponent() {
            var self = this;
            var f = new qxnw.basics.forms.f_asociateComponent();
            var profile = this.ui.profile.getValue();
            var model = self.__tree.getSelectedItem();
            if (typeof model.model.id == 'undefined' || model.model.id == "") {
                qxnw.utils.information(self.tr("Seleccione un item"));
                return;
            }
            var param = {};
            param["profile"] = profile.profile;
            param["module"] = model.model.id;
            f.setParamRecord(param);
            f.settings.accept = function (rta) {
                self.populateProfiles();
            };
            f.show();
        },
        populateProfiles: function populateProfiles() {
            var self = this;
            self.__tree.cleanAll();
            var profile = self.ui.profile.getValue();
            if (profile["profile"] == "") {
                return;
            }
            self.__modulesGroups = self.slotGetModulesGroups(profile);
            self.__modulesGeneral = self.getGeneralModules(profile);
            var folderGenerales = self.__tree.addFolderOne("Generales", "checkbox", qxnw.config.execIcon("office", "categories"));
            var checkboxGenerales = folderGenerales.getUserData("checkbox");
            checkboxGenerales.setUserData("folder", folderGenerales);
            self.populateGeneralModules(folderGenerales, true);
            checkboxGenerales.addListener("changeValue", function (e) {
                self.changeChildValues(this.getUserData("folder"), e.getData());
            });
            folderGenerales.getFocusElement().focus(true);
            folderGenerales.addListener("changeOpen", function (e) {
                self.changeChildValues(this);
            });
            for (var ia = 0; ia < self.__modulesGroups.length; ia++) {
                var folderTwo = self.__tree.addFolderOne(self.__modulesGroups[ia]["id"] + "::" + self.__modulesGroups[ia]["nombre"], "checkbox", qxnw.config.execIcon("office", "categories"));
                self.__modulesGroups[ia].profile = profile.profile;
                self.__modulesGroups[ia].type = "level1";
                folderTwo.setModel(self.__modulesGroups[ia]);
                var checkboxGroups = folderTwo.getUserData("checkbox");
                checkboxGroups.setTriState(true);
                checkboxGroups.setModel(self.__modulesGroups[ia]);
                checkboxGroups.setUserData("folder", folderTwo);
                checkboxGroups.addListener("changeValue", function (e) {
                    if (e.getData() != null) {
                        var folder = this.getUserData("folder");
                        if (!folder.isOpen()) {
                            this.getUserData("folder").setOpen(e.getData());
                        }
                    }
                    self.changeChildValues(this.getUserData("folder"), e.getData());
                });
                self.openModulesGroup(folderTwo, true);
            }
            self.poulateDashboard();
            self.populateUsers();
        },
        populateUsers: function populateUsers() {
            var self = this;
            var func = function (r) {
                self.__containerUsers.removeAll();
                var lblusers = new qx.ui.basic.Label(self.tr("Usuarios asociados:"));
                self.__containerUsers.add(lblusers, {
                    flex: 1
                });
                var list = new qx.ui.form.List();
                self.__containerUsers.add(list, {
                    flex: 1
                });
                for (var i = 0; i < r.length; i++) {
                    var lab = "<b>" + r[i].nombre + "</b>--Usuario:" + r[i].usuario + "--Terminal:" + r[i].terminal + "--Estado:" + qxnw.utils.lowerFirst(r[i].estado);
                    var item = new qxnw.widgets.listItem(lab).set({
                        rich: true
                    });
                    list.add(item);
                }
            };
            var profile = self.ui.profile.getValue()["profile"];
            qxnw.utils.fastAsyncRpcCall("nw_permissions", "populateUsersFromProfile", profile, func);
        },
        poulateDashboard: function poulateDashboard() {
            var self = this;
            var d = {};
            d.perfil = self.ui.profile.getValue()["profile"];
            self.__containerDash.removeAll();
            var func = function (r) {
                for (var i = 0; i < r.length; i++) {
                    var item = new qx.ui.form.Button(r[i].nombre, r[i].icono).set({
                        maxWidth: 170,
                        minWidth: 170,
                        maxHeight: 170,
                        minHeight: 170
                    });
                    item.getChildControl("icon").setScale(true);
                    item.setUserData("model", r[i]);
                    item.addListener("click", function () {
                        self.loadPartAndMenu(this.getUserData("model"));
                    });
                    self.__containerDash.add(item);
                }
            };
            qxnw.utils.fastAsyncRpcCall("nw_permissions", "getModulesDashboard", d, func);
        },
        loadPartAndMenu: function loadPartAndMenu(model) {
            var exploded = model.parte.split(".");
            var parte;
            if (exploded.length == 1) {
                parte = model.parte;
            } else {
                parte = exploded[0];
            }
            if (!qx.core.Environment.get("qx.debug")) {
                if (parte != "0") {
                    qx.io.PartLoader.require(parte, function () {
                    }, this);
                }
            }
            this.constructMenu(model.id);
        },
        changeChildValuesByModel: function changeChildValuesByModel(widget, arr) {
            var checkBox = widget.getUserData("checkbox");
            var model = widget.getModel();
            var checked = checkBox.getValue();
            var children = widget.getItems();
            for (var i = 0; i < children.length; i++) {
                var subCheckBox = children[i].getUserData("checkbox");
                if (subCheckBox != null) {
                    var started = subCheckBox.getUserData("started");
                    if (subCheckBox != null) {
                        if (model != null) {
                            if (typeof model.type != 'undefined' && model.type == "userActions" && started == null) {
                                var minModel = children[i].getModel();
                                if (model[minModel.nombre] == "t" || model[minModel.nombre] == "1") {
                                    subCheckBox.setValue(true);
                                } else if (model[minModel.nombre] == "f" || model[minModel.nombre] == "0") {
                                    subCheckBox.setValue(false);
                                }
                                subCheckBox.setUserData("started", true);
                            } else {
                                if (checked != null) {
                                    subCheckBox.setValue(checked);
                                }
                            }
                        } else {
                            if (checked != null) {
                                subCheckBox.setValue(checked);
                            }
                        }
                        subCheckBox.setUserData("opened", true);
                    }
                }
            }
        },
        changeChildValues: function changeChildValues(widget, arr) {
            var checkBox = widget.getUserData("checkbox");
            var model = widget.getModel();
            var checked = checkBox.getValue();
            var children = widget.getItems();
            for (var i = 0; i < children.length; i++) {
                var subCheckBox = children[i].getUserData("checkbox");
                if (subCheckBox != null) {
                    var started = subCheckBox.getUserData("started");
                    if (subCheckBox != null) {
                        if (model != null) {
                            if (checked != null) {
                                subCheckBox.setValue(checked);
                            }
                            subCheckBox.setUserData("started", true);
                            subCheckBox.setUserData("opened", true);
                        }
                    }
                }
            }
            return;
        },
        populateGeneralModules: function populateGeneralModules(widget, value) {
            var self = this;
            if (value) {
                var haveTrue = false;
                widget.removeAll();
                for (var i = 0; i < self.__modulesGeneral.length; i++) {
                    var fileFolder = self.__tree.addFolderToFolder(widget, self.__modulesGeneral[i]["nombre"], "checkbox", qxnw.config.execIcon("system", "categories"));
                    var data = self.__modulesGeneral[i];
                    data["type"] = "modules";
                    fileFolder.setModel(data);
                    var selected = false;
                    if (data["crear"] == "t" || data["eliminar"] == "t" || data["editar"] == "t" || data["consultar"] == "t" || data["imprimir"] == "t" ||
                            data["enviar_por_correo"] == "t" || data["exportar"] == "t" || data["importar"] == "t" || data["terminal"] == "t" || data["columnas_ocultas"] == "t" ||
                            data["crear"] == "1" || data["eliminar"] == "1" || data["editar"] == "1" || data["consultar"] == "1" || data["imprimir"] == "1" ||
                            data["enviar_por_correo"] == "1" || data["exportar"] == "1" || data["importar"] == "1" || data["terminal"] == "1" || data["columnas_ocultas"] == "1" ||
                            data["pais"] == "1") {
                        selected = true;
                        if (!haveTrue) {
                            haveTrue = true;
                        }
                    }
                    var checkboxGeneral = fileFolder.getUserData("checkbox");
                    checkboxGeneral.setTriState(true);
                    var selected = selected == true ? null : selected;
                    checkboxGeneral.setValue(selected);
                    checkboxGeneral.setUserData("folder", fileFolder);
                    checkboxGeneral.addListener("changeValue", function (e) {
                        var folder = this.getUserData("folder");
                        if (!folder.isOpen()) {
                            this.getUserData("folder").setOpen(e.getData());
                        }
                        self.changeChildValues(this.getUserData("folder"), e.getData());
                    });
                    self.__tree.addFileToFolder(fileFolder, "");
                    fileFolder.addListener("changeOpen", function (e) {
                        self.openUserActions(this, e.getData());
                        self.changeChildValuesByModel(this);
                    });
                }
                if (haveTrue) {
                    widget.getUserData("checkbox").setValue(null);
                }
            }
        },
        getGeneralModules: function getGeneralModules(d) {
            var self = this;
            var rpc = new qxnw.rpc(self.getRpcUrl(), "nw_permissions");
            var profile = self.ui.profile.getValue();
            var di = {};
            di["profile"] = profile.profile;
            di["filtro"] = self.ui.filtro.getValue();
            var r = rpc.exec("getGeneralModules", di);
            if (rpc.isError()) {
                qxnw.utils.error(rpc.getError(), self);
                return false;
            }
            var ra = Array();
            var data = Array();
            for (var i = 0; i < r.length; i++) {
                ra = r[i];
                ra["profile"] = d["profile"];
                data.push(ra);
            }
            return data;
        },
        openModulesGroup: function openModulesGroup(widget, value) {
            var self = this;
            if (value) {
                var haveTrue = false;
                widget.removeAll();
                var data = widget.getModel();
                data["filtro"] = self.ui.filtro.getValue();
                var rpc = new qxnw.rpc(self.getRpcUrl(), "nw_permissions");
                rpc.setAsync(true);
                var func = function (r) {
                    for (var i = 0; i < r.length; i++) {
                        self.__modulesGroup[r[i].grupo] = r;
                        r[i]["menu"] = r[i]["menu"] == null ? "N/A" : r[i]["menu"];

                        var ic = qxnw.config.execIcon("system", "categories");
                        if (r[i]["nivel"] === "1") {
                            ic = qxnw.config.execIcon("folder-new");
                        } else if (r[i]["nivel"] === "2") {
                            ic = qxnw.config.execIcon("go-next");
                        } else if (r[i]["nivel"] === "3") {
                            ic = qxnw.config.execIcon("window-new");
                        }
                        var folder = self.__tree.addFolderToFolder(widget, r[i]["id"] + "::" + r[i]["nombre"] + "->" + "Menú:" + r[i]["menu"] + ", Nivel: " + r[i]["nivel"], "checkbox", ic);
                        var data = r[i];
                        data["type"] = "modules";
                        folder.setModel(r[i]);
                        var selected = false;
                        if (r[i]["crear"] == "t" || r[i]["eliminar"] == "t" || r[i]["editar"] == "t" || r[i]["consultar"] == "t" || r[i]["imprimir"] == "t"
                                || r[i]["enviar_por_correo"] == "t" || r[i]["exportar"] == "t" || r[i]["importar"] == "t" || r[i]["terminal"] == "t"
                                || r[i]["columnas_ocultas"] == "t" ||
                                r[i]["crear"] == "1" || r[i]["eliminar"] == "1" || r[i]["editar"] == "1" || r[i]["consultar"] == "1" || r[i]["imprimir"] == "1"
                                || r[i]["enviar_por_correo"] == "1" || r[i]["exportar"] == "1" || r[i]["importar"] == "1" || r[i]["terminal"] == "1"
                                || r[i]["columnas_ocultas"] == "1" || r[i]["pais"] == "1") {
                            selected = true;
                            if (!haveTrue) {
                                haveTrue = true;
                            }
                        }
                        var checkboxGroups = folder.getUserData("checkbox");
                        checkboxGroups.setTriState(true);
                        var selected = selected == true ? null : selected;
                        checkboxGroups.setValue(selected);
                        checkboxGroups.setUserData("folder", folder);
                        checkboxGroups.addListener("changeValue", function (e) {
                            var folder = this.getUserData("folder");
                            if (!folder.isOpen()) {
                                this.getUserData("folder").setOpen(e.getData());
                            }
                            self.changeChildValues(this.getUserData("folder"), e.getData());
                        });
                        self.__tree.addFileToFolder(folder, "");
                        folder.addListener("changeOpen", function (e) {
                            self.openUserActions(this, e.getData());
                            self.changeChildValuesByModel(this);
                        });
                    }
                    //self.changeChildValues(widget);
                    if (haveTrue) {
                        widget.getUserData("checkbox").setValue(null);
                    }
                };
                rpc.exec("getModulesByGroup", data, func);
            }
        },
        getUserActions: function getUserActions() {
            var self = this;
            var items = [
                {
                    nombre: "Crear",
                    label: self.tr("Crear"),
                    crear: true,
                    type: "level4",
                    icon: qxnw.config.execIcon("folder-new")
                },
                {
                    nombre: "Consultar",
                    label: self.tr("Consultar"),
                    consultar: true,
                    type: "level4",
                    icon: qxnw.config.execIcon("edit-find")
                },
                {
                    nombre: "Editar",
                    label: self.tr("Editar"),
                    editar: true,
                    type: "level4",
                    icon: qxnw.config.execIcon("edit-select-all")
                },
                {
                    nombre: "Eliminar",
                    label: self.tr("Eliminar"),
                    eliminar: true,
                    type: "level4",
                    icon: qxnw.config.execIcon("edit-delete")
                },
                {
                    nombre: "Imprimir",
                    label: self.tr("Imprimir"),
                    imprimir: true,
                    type: "level4",
                    icon: qxnw.config.execIcon("document-print")
                },
                {
                    nombre: "Enviar_por_correo",
                    label: self.tr("Enviar por correo"),
                    enviar_por_correo: true,
                    type: "level4",
                    icon: qxnw.config.execIcon("mail-forward")
                },
                {
                    nombre: "Exportar",
                    label: self.tr("Exportar"),
                    exportar: true,
                    type: "level4",
                    icon: qxnw.config.execIcon("excel", "qxnw")
                },
                {
                    nombre: "Importar",
                    label: self.tr("Importar"),
                    importar: true,
                    type: "level4",
                    icon: qxnw.config.execIcon("document-send")
                },
                {
                    nombre: "Terminal",
                    label: self.tr("Terminal"),
                    terminal: true,
                    type: "level4",
                    icon: qxnw.config.execIcon("preferences-theme", "apps")
                },
                {
                    nombre: "Columnas_ocultas",
                    label: self.tr("Ocultar columnas"),
                    columnas_ocultas: true,
                    type: "level4",
                    icon: qxnw.config.execIcon("office-project", "apps")
                },
                {
                    nombre: "pais",
                    pais: true,
                    label: self.tr("País"),
                    type: "level4",
                    icon: qxnw.config.execIcon("internet-web-browser", "apps")
                }
            ];
            return items;
        },
        openUserActions: function openUserActions(widget, value) {
            var self = this;
            if (value) {
                widget.removeAll();
                var data = widget.getModel();
                self.items[data.id] = widget;
                var userActions = self.getUserActions();
                for (var i = 0; i < userActions.length; i++) {
                    var item = self.__tree.addFileToFolder(widget, typeof userActions[i].label == 'undefined' ? userActions[i].nombre.replace(/_/gi, " ") : userActions[i].label, "checkbox", userActions[i].icon);
                    data["type"] = "userActions";
                    userActions[i]["nombre"] = qxnw.utils.lowerFirst(userActions[i]["nombre"]);
                    userActions[i]["profile"] = data.profile;
                    userActions[i]["module"] = data.id;
                    item.setModel(userActions[i]);
                    var checkBox = item.getUserData("checkbox");
                    checkBox.setUserData("id", data.id);
                    checkBox.addListener("changeValue", function (e) {
                        if (e.getData()) { //var previousNode = self.__tree.getTree().getPreviousNodeOf(self.items[this.getUserData["id"]]);
//console.log(previousNode);
                        }
                    });
                }
            }
        },
        slotGetModulesGroups: function slotGetModulesGroups() {
            var self = this;
            var data = {};
            data["table"] = "nw_modulos_grupos";
            data["order"] = "lower(nombre)";
            var rpc = new qxnw.rpc(self.getRpcUrl(), "master");
            var r = rpc.exec("populate", data);
            if (rpc.isError()) {
                qxnw.utils.error(rpc.getError(), self);
                return false;
            }
            return r;
        },
        savePermissions: function savePermissions() {
            var self = this;
            var items = self.__tree.getItems(true, true);
            var data = [];
            for (var i = 0; i < items.length; i++) {
                var checkbox = items[i].getUserData("checkbox");
                if (checkbox != null) {
                    var model = items[i].getModel();
                    if (model != null) {
                        var opened = checkbox.getUserData("opened");
                        if (opened != null) {
                            if (opened) {
                                if (checkbox.getValue()) {
                                    if (model.type == "level4") {
                                        data.push(model);
                                    }
                                } else {
                                    model[model.nombre] = false;
                                    if (model.type == "level4") {
                                        data.push(model);
                                    }
                                }
                            }
                        }
                    }
                }
            }
            if (data.length == 0) {
                return;
            }
            var d = self.preparePermissionsArray(data);
            var rpc = new qxnw.rpc(self.getRpcUrl(), "nw_permissions");
            rpc.setAsync(true);
            rpc.exec("save", d);
        },
        preparePermissionsArray: function preparePermissionsArray(data) {
            data = qxnw.utils.sortByKey(data, "module");
            var module = null;
            var oldModule = null;
            var modArray = {};
            var count = 0;
            var entra = false;
            for (var i = 0; i < data.length; i++) {
                module = data[i].module;
                if (oldModule == null || module != oldModule) {
                    if (entra || count != 0) {
                        count++;
                    }
                    modArray[count] = {};
                    modArray[count]["profile"] = data[i]["profile"];
                    modArray[count]["module"] = data[i]["module"];
                    modArray[count][data[i].nombre] = data[i][data[i].nombre];
                    entra = true;
                } else {
                    modArray[count]["profile"] = data[i]["profile"];
                    modArray[count]["module"] = data[i]["module"];
                    modArray[count][data[i].nombre] = data[i][data[i].nombre];
                }
                oldModule = module;
            }
            return modArray;
        }
    }
}
);