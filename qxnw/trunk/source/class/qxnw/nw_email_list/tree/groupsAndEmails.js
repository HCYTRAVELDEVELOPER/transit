qx.Class.define("qxnw.nw_email_list.tree.groupsAndEmails", {
    extend: qxnw.treeWidget,
    construct: function() {
        this.base(arguments);
        var self = this;
        self.setCreateButton(false);
        self.__emails = new qxnw.nw_email_list.lists.l_email_groups();
        self.addSubWindow("Correos asociados", self.__emails);
        self.populateTree();
        var filters = [
            {
                name: "newGroup",
                label: "Nuevo grupo",
                type: "button"
            }
        ];
        self.createFilters(filters);
        self.ui.newGroup.addListener("execute", function() {
            self.newGroup();
        });
    },
    members: {
        __emails: null,
        contextMenu: function contextMenu(pos) {
            var self = this;
            var m = new qxnw.contextmenu(this);
            var sl = self.getSelectedItem();
            if (sl == "") {
                return;
            }
            m.addAction("Asociar correos", qxnw.config.execIcon("preferences-users", "apps"), function(e) {
                self.slotAsociateUsers();
            });
            m.addAction("Eliminar", qxnw.config.execIcon("list-remove", "actions"), function(e) {
                qxnw.utils.question(self.tr("¿Desea eliminar el grupo junto a sus correos asociados?"), function(rta) {
                    if (rta) {
                        self.slotDeleteGroup();
                    }
                });
            });
            m.setParentWidget(self.tree);
            m.exec(pos);
        },
        slotDeleteGroup: function slotDeleteGroup() {
            var self = this;
            var sl = self.getSelectedItem();
            var rpc = new qxnw.rpc(self.getRpcUrl(), "email");
            rpc.setAsync(true);
            var func = function(r) {
                if (r) {
                    self.populateTree();
                }
            };
            rpc.exec("deleteGroup", sl, func);
        },
        slotAsociateUsers: function slotAsociateUsers() {
            var self = this;
            var f = new qxnw.forms();
            var fields = [{
                    name: "usuario",
                    type: "selectBox",
                    label: self.tr("Seleccione el usuario")
                }];
            f.setFields(fields);
            var data = {
                table: "nw_emails",
                order: "nombre"
            };
            f.ui.accept.addListener("execute", function() {
                f.accept();
            });
            f.ui.cancel.addListener("execute", function() {
                f.reject();
            });
            qxnw.utils.populateSelect(f.ui.usuario, "master", "populate", data);
            f.settings.accept = function() {
                var r = f.getRecord();
                var sl = self.getSelectedItem();
                r["grupo"] = sl["id"];
                var rpc = new qxnw.rpc(self.getRpcUrl(), "email");
                rpc.setAsync(true);
                var func = function(r) {
                    self.updateSubWindows();
                };
                rpc.exec("asociateUserToGroup", r, func);
            };
            f.show();
        },
        newGroup: function newGroup() {
            var self = this;
            var d = new qxnw.forms();
            d.serialField("id");
            d.setTableMethod("master");
            d.createFromTable("nw_email_groups");
            d.settings.accept = function() {
                self.populateTree();
            };
            d.show();
        },
        populateTree: function populateTree() {
            var self = this;
            self.addTreeHeader(self.tr("Grupos de correos"), qxnw.config.execIcon("view-sort-descending"), true);
            var parent = self.addTreeFolder("Grupos de correos", qxnw.config.execIcon("utilities-network-manager", "apps"), "", 0, true);
            var data = {table: "nw_email_groups"};
            var rpc = new qxnw.rpc(self.getRpcUrl(), "master");
            rpc.setAsync(true);
            var func = function(r) {
                for (var i = 0; i < r.length; i++) {
                    var icon = qxnw.config.execIcon("mail-reply-all");
                    var item = self.addTreeFile(r[i].nombre, icon, r[i], parent);
                    item.addListener("click", function() {
                        var model = this.getModel();
                        self.updateSubWindows(model);
                    });
                }
            };
            rpc.exec("populate", data, func);
        },
        updateSubWindows: function updateSubWindows() {
            var self = this;
            var model = self.getSelectedItem();
            self.__emails.applyFilters(model.id);
        }
    }
});