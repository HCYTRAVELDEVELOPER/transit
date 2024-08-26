qx.Class.define("qxnw.basics.forms.f_usuarios", {
    extend: qxnw.forms,
    construct: function () {
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
                name: "apellido",
                label: "Apellido",
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
                name: "celular",
                label: "Celular",
                caption: "celular",
                type: "textField",
                required: true
            },
            {
                name: "cargo",
                label: "Cargo",
                caption: "cargo",
                type: "textField",
                required: true
            },
            {
                name: "terminal",
                label: "Terminal",
                caption: "terminal",
                type: "selectBox"
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
                name: "pais",
                label: "País",
                caption: "pais",
                type: "selectBox"
            },
            {
                name: "documento",
                label: "Documento",
                caption: "documento",
                type: "textField",
                mode: "integer"
            },
            {
                name: "cliente",
                label: "Cliente",
                caption: "cliente",
                type: "selectBox"
            },
            {
                name: "fecha_nacimiento",
                label: "Fecha Nacimiento",
                type: "dateField",
                required: true
            },
            {
                name: "foto",
                label: "Foto",
                type: "uploader",
                required: false
            },
            {
                name: "estado",
                label: "Estado",
                type: "selectBox"
            },
            {
                name: "ver_chat",
                label: "Ver Chat",
                type: "selectBox"
            }
        ];
        this.setFields(fields);
        this.setTitle("Editar - crear usuarios");
        qxnw.utils.populateSelect(self.ui.terminal, "master", "populate", {table: "terminales"});
        qxnw.utils.populateSelect(self.ui.perfil, "master", "populate", {table: "perfiles"});
        qxnw.utils.populateSelect(self.ui.pais, "master", "populate", {table: "paises"});

        var data = {};
        data["TODOS"] = "Todos";
        qxnw.utils.populateSelectFromArray(self.ui.cliente, data);
        data = {};
        data["SI"] = "SI";
        data["NO"] = "NO";
        qxnw.utils.populateSelectFromArray(self.ui.ver_chat, data);

        qxnw.utils.populateSelect(self.ui.cliente, "master", "populate", {table: "clientes"});
        data = {};
        data["activo"] = "Activo";
        data["inactivo"] = "Inactivo";
        qxnw.utils.populateSelectFromArray(self.ui.estado, data);
        self.ui.accept.addListener("execute", function () {
            self.slotSave();
        });
        self.ui.cancel.addListener("execute", function () {
            self.reject();
        });
        self.ui.clave.setValue("12345");
        self.createNavTable();
        self.populateNavTable();
    },
    destruct: function () {
    },
    members: {
        navTable: null,
        createNavTable: function () {
            var self = this;
            self.navTable = new qxnw.navtable(self, true);
            self.navTable.setTitle("Empresas asociadas");
            self.createButtons(false);
            self.navTable.createBase();
            var columns = [
                {
                    label: "ID",
                    caption: "id"
                },
                {
                    label: self.tr("Nombre"),
                    caption: "nombre"
                },
                {
                    label: self.tr("Perfil"),
                    caption: "perfil",
                    type: "selectBox",
                    mode: "editable",
                    method: "nw_usuarios.populatePerfilesPorEmpresa.add"
                },
                {
                    label: self.tr("Terminal"),
                    caption: "terminal",
                    type: "selectBox",
                    mode: "editable",
                    method: "nw_usuarios.populateTerminalesPorEmpresa.add"
                },
                {
                    label: self.tr("Asociado"),
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
        populateNavTableFromParams: function (usuario) {
            var self = this;
            var data = {};
            data["usuario"] = usuario;
            data["version"] = qxnw.local.getAppVersion();
            var rpc = new qxnw.rpc(self.getRpcUrl(), "nw_usuarios", true);
            var func = function (r) {
                self.navTable.setModelData(r);
//                self.navTable.hideColumn("id");
            };
            rpc.exec("permisosEmpresas", data, func);
        },
        populateNavTable: function () {
            var self = this;
            var rpc = new qxnw.rpc(self.getRpcUrl(), "nw_usuarios", true);
            var func = function (r) {
                self.navTable.setModelData(r);
//                self.navTable.hideColumn("id");
            };
            rpc.exec("populatePermisosEmpresas", 0, func);
        },
        slotSave: function slotSave() {
            var self = this;
            if (!self.validate()) {
                return;
            }
            var data = this.getRecord();

            var newDate = new Date();

            if (qxnw.utils.compareDates(data.fecha_nacimiento_obj, newDate) == 1) {
                qxnw.utils.information(self.tr("La fecha de nacimiento no puede ser mayor a la fecha actual"));
                return;
            }

            data.detail = self.navTable.getAllData();
            data.version = qxnw.local.getAppVersion();
            var rpc = new qxnw.rpc(self.getRpcUrl(), "nw_usuarios", true);
            var func = function () {
                self.accept();
            };
            rpc.exec("save", data, func);
            
        },
        setParamRecord: function setParamRecord(pr) {
            var self = this;
            self.setRecord(pr);
            self.ui.clave.setValue("12345");
            self.populateNavTableFromParams(pr.usuario);
            return true;
        },
        setParamRecordMydata: function setParamRecordMydata(pr) {
            var self = this;
            self.setRecord(pr);
            var up = qxnw.userPolicies.getUserData();
            self.setEnabledAll(false);
            return true;
        }
    }
});
