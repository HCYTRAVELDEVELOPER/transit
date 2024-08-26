qx.Class.define("nwsites.forms.f_usuarios", {
    extend: qxnw.forms,
    construct: function() {
        var self = this;
        this.base(arguments);
        this.createBase();
        self.setGroupHeader("Editar usuarios");
        var fields = [
            {
                name: "id",
                label: "ID",
                caption: "id",
                type: "textField",
                visible: false
            },
            {
                name: "nombre",
                label: "Nombre",
                type: "textField",
                required: true
            },
            {
                name: "usuario",
                label: "Usuario",
                caption: "usuario",
                type: "textField",
                required: true
            },
            {
                name: "clave",
                label: "Clave",
                caption: "clave",
                type: "passwordField",
                required: true
            },
            {
                name: "terminal",
                label: "Terminal",
                caption: "terminal",
                type: "textField"
            },
            {
                name: "email",
                label: "E-mail",
                type: "textField",
                required: true,
                mode: "email"
            },
            {
                name: "perfil",
                label: "Perfil",
                caption: "perfil",
                type: "selectBox"
            },
            {
                name: "cliente",
                label: "Cliente",
                caption: "cliente",
                type: "selectBox"
            },
            {
                name: "estado",
                label: "Estado",
                caption: "estado",
                type: "selectBox"
            }];
        this.setFields(fields);
        this.setTitle("Editar - crear usuarios");
//        var data = {};
//        data.table = "terminales";
//        data.order = "nombre";
//        qxnw.utils.populateSelect(self.ui.terminal, "master", "populate", data);
        qxnw.utils.populateSelect(self.ui.perfil, "perfiles", "getPerfiles");

        var data = {};
        data["TODOS"] = "Todos";
        qxnw.utils.populateSelectFromArray(self.ui.cliente, data);
        data.table = "clientes";
        qxnw.utils.populateSelect(self.ui.cliente, "master", "populate", data);
        data = {};
        data["activo"] = "Activo";
        data["inactivo"] = "Inactivo";
        qxnw.utils.populateSelectFromArray(self.ui.estado, data);
        self.ui.accept.addListener("execute", function() {
            self.slotSave();
        });
        self.ui.cancel.addListener("execute", function() {
            self.reject();
        });
        self.ui.clave.setValue("12345");
        self.createNavTable();
        self.populateNavTable();
    },
    destruct: function() {
    },
    members: {
        navTable: null,
        createNavTable: function() {
            var self = this;
            self.navTable = new qxnw.navtable();
            self.navTable.setTitle("Empresas asociadas");
            self.createButtons(false);
            self.navTable.createBase();
            var columns = [
                {
                    label: "ID",
                    caption: "id"
                },
                {
                    label: "Nombre",
                    caption: "nombre"
                },
                {
                    label: "Asociado",
                    caption: "pertenece",
                    type: "checkbox",
                    mode: "editable"
                }
            ];
            self.navTable.setColumns(columns);
            self.insertNavTable(self.navTable.getBase());
            var addButton = self.navTable.getAddButton();
            var removeButton = self.navTable.getRemoveButton();
            addButton.setEnabled(false);
            removeButton.setEnabled(false);
        },
        populateNavTableFromParams: function(usuario) {
            var self = this;
            var data = {};
            data["usuario"] = usuario;
            var rpc = new qxnw.rpc(this.rpcUrl, "nwsites");
            var r = rpc.exec("permisosEmpresas", data);
            if (rpc.isError()) {
                qxnw.utils.error(rpc.getError(), self);
                return;
            }
            self.navTable.setModelData(r);
            self.navTable.hideColumn("id");
        },
        populateNavTable: function() {
            var self = this;
            var rpc = new qxnw.rpc(this.rpcUrl, "nwsites");
            var r = rpc.exec("populatePermisosEmpresas");
            if (rpc.isError()) {
                qxnw.utils.error(rpc.getError(), self);
                return;
            }
            self.navTable.setModelData(r);
            self.navTable.hideColumn("id");
        },
        slotSave: function slotSave() {
            var self = this;
            if (!self.validate()) {
                return;
            }
            var data = this.getRecord();
            data.detail = self.navTable.getAllData();
            var rpc = new qxnw.rpc(this.rpcUrl, "nwsites");
            rpc.exec("saveUser", data);
            if (rpc.isError()) {
                qxnw.utils.error(rpc.getError(), self);
                return;
            }
            self.accept();
        },
        setParamRecord: function setParamRecord(pr) {
            var self = this;
            self.setRecord(pr);
            self.ui.clave.setValue("12345");
            self.populateNavTableFromParams(pr.usuario);
            return true;
        },
        setParamRecordLocales: function setParamRecordLocales(pr) {
            var self = this;
            self.setRecord(pr);
            self.populateNavTableFromParams(pr.usuario);
            self.ui.terminal.setValue(pr.id.toString());
//            self.ui.terminal.setValue(pr.productID);
            self.ui.terminal.setEnabled(false);
            self.ui.perfil.setEnabled(false);
            self.ui.cliente.setEnabled(false);
            self.ui.cliente.setVisibility("hidden");
            self.ui.email.setValue(pr.correo);
            self.ui.id.setValue("");
            self.ui.perfil.setValue("2");
            return true;
        }
    }
});
