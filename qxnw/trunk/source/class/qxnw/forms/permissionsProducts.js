qx.Class.define("qxnw.forms.permissionsProducts", {
    extend: qxnw.forms.permissions,
    construct: function () {
        this.base(arguments, true);
        var self = this;
        self.setSaveFooterToolbarSettings(false);
        self.ui.copyProfileButton.setVisibility("visible");
        self.ui.copyProfileButton.setEnabled(true);
        self.ui.copyProfileButton.addListener("execute", function () {
            self.openCopyProfileDialog();
        });

        self.setFieldVisibility(self.ui.empresaCopyFrom, "visible");
        self.ui.empresaCopyFrom.setEnabled(true);
        self.ui.empresaCopyFrom.setMinWidth(300);
        
        var data = {};
        data[""] = "Seleccione...";
        qxnw.utils.populateSelectFromArray(self.ui.empresaCopyFrom, data);
        qxnw.utils.populateSelect(self.ui.empresaCopyFrom, "nw_permissions", "getEmpresas");
        self.ui.empresaCopyFrom.addListener("changeSelection", function () {
            var val = this.getValue();
            self.ui.profile.removeAll();
            var data = {};
            data[""] = "Seleccione...";
            qxnw.utils.populateSelectFromArray(self.ui.profile, data);
            qxnw.utils.populateSelectAsync(self.ui.profile, "nw_permissions", "getProfileByCompany", {company: val.empresaCopyFrom});
            self.ui.select_user_profile.setEnabled(true);
        });
        
        self.ui.select_user_profile.setEnabled(false);
    },
    members: {
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
                self.ui.user.setEnabled(false);
                self.ui.profile.setEnabled(true);
                
                var val = self.ui.empresaCopyFrom.getValue();
                qxnw.utils.populateSelectAsync(self.ui.profile, "nw_permissions", "getProfileByCompany", {company: val.empresaCopyFrom});
                
                self.ui.profile.focus();
            }

            self.getTree().cleanAll();
            self.getContainerUsers().removeAll();
            self.getContainerDash().removeAll();
        },
        asociateComponent: function asociateComponent() {
            var self = this;
            var f = new qxnw.basics.forms.f_asociateComponent(true);
            var profile = this.ui.profile.getValue();
            var model = self.getTree().getSelectedItem();
            if (typeof model.model.id == 'undefined' || model.model.id == "") {
                qxnw.utils.information(self.tr("Seleccione un item"));
                return;
            }
            var param = {};
            param["profile"] = profile.profile;
            param["module"] = model.model.id;
            f.setParamRecord(param);
            f.settings.accept = function () {
                self.populateProfiles();
            };
            f.addAutomatedFunctions();
            f.show();
        },
        openCopyProfileDialog: function openCopyProfileDialog() {
            var self = this;
            var fields = [
                {
                    name: "profile_copy_from",
                    type: "selectBox",
                    label: self.tr("Copiar de"),
                    required: true
                }
            ];
            var f = qxnw.utils.dialog(fields, self.tr("Copiar perfil"), true);
            qxnw.utils.populateSelectAsync(f.ui.profile_copy_from, "nw_permissions", "getAllProfiles");
            f.settings.accept = function () {
                var func = function (rta) {
                    if (rta) {
                        qxnw.utils.information(self.tr("Perfil copiado correctamente"));
                    }
                };
                var data = f.getRecord();
                data["perfil"] = self.ui.profile.getValue();
                qxnw.utils.fastAsyncCallRpc("nw_permissions", "copyPermissionsByProfile", data, func);
            };
        },
        openModulesGroup: function openModulesGroup(widget, value) {
            var self = this;
            if (value) {
                var haveTrue = false;
                widget.removeAll();
                var data = widget.getModel();
                if (qxnw.userPolicies.isProduct() == true) {
                    data["is_product"] = true;
                }
                data["filtro"] = self.ui.filtro.getValue();
                var rpc = new qxnw.rpc(self.getRpcUrl(), "nw_permissions");
                rpc.setAsync(true);
                var tree = self.getTree();
                var modulesGroup = self.getModulesGroup();
                var func = function (r) {
                    for (var i = 0; i < r.length; i++) {
                        modulesGroup[r[i].grupo] = r;
                        var folder = tree.addFolderToFolder(widget, r[i]["id"] + "::" + r[i]["nombre"] + "->" + "Menú:" + r[i]["menu"] + ", Nivel: " + r[i]["nivel"], "checkbox", qxnw.config.execIcon("system", "categories"));
                        var data = r[i];
                        data["type"] = "modules";
                        folder.setModel(r[i]);
                        var selected = false;
                        if (r[i]["crear"] == "t" || r[i]["eliminar"] == "t" || r[i]["editar"] == "t" || r[i]["consultar"] == "t" || r[i]["imprimir"] == "t"
                                || r[i]["enviar_por_correo"] == "t" || r[i]["exportar"] == "t" || r[i]["importar"] == "t" || r[i]["terminal"] == "t"
                                || r[i]["columnas_ocultas"] == "t" ||
                                r[i]["crear"] == "1" || r[i]["eliminar"] == "1" || r[i]["editar"] == "1" || r[i]["consultar"] == "1" || r[i]["imprimir"] == "1"
                                || r[i]["enviar_por_correo"] == "1" || r[i]["exportar"] == "1" || r[i]["importar"] == "1" || r[i]["terminal"] == "1"
                                || r[i]["columnas_ocultas"] == "1") {
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
                        tree.addFileToFolder(folder, "");
                        folder.addListener("changeOpen", function (e) {
                            self.openUserActions(this, e.getData());
                            self.changeChildValuesByModel(this);
                        });
                    }
                    if (haveTrue) {
                        widget.getUserData("checkbox").setValue(null);
                    }
                };
                rpc.exec("getModulesByGroupProducts", data, func);
            }
        },
        slotGetModulesGroups: function slotGetModulesGroups() {
            var self = this;
            var data = {};
            if (qxnw.userPolicies.isProduct() == true) {
                data["is_product"] = true;
            }
            var rpc = new qxnw.rpc(self.getRpcUrl(), "nw_permissions");
            var r = rpc.exec("populateModulosGrupos", data);
            if (rpc.isError()) {
                qxnw.utils.error(rpc.getError(), self);
                return false;
            }
            return r;
        }
    }
});