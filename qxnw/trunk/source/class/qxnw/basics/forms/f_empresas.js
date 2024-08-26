qx.Class.define("qxnw.basics.forms.f_empresas", {
    extend: qxnw.forms,
    construct: function () {
        var self = this;
        self.base(arguments);
        self.setTitle(self.tr("Empresas nuevo-editar"));
        self.createBase();
        var fields = [
            {
                name: "id",
                label: "ID",
                caption: "id",
                type: "textField",
                visible: false
            },
            {
                name: "razon_social",
                label: self.tr("Razón social"),
                caption: "razon_social",
                type: "textField"
            },
            {
                name: "nit",
                label: self.tr("NIT"),
                caption: "nit",
                type: "textField"
            },
            {
                name: "division",
                label: self.tr("División"),
                caption: "division",
                type: "textField"
            },
            {
                name: "pais",
                label: self.tr("País"),
                caption: "pais",
                type: "selectBox"
            },
            {
                name: "ciudad",
                label: self.tr("Ciudad"),
                caption: "ciudad",
                type: "selectBox"
            },
            {
                name: "direccion",
                label: self.tr("Dirección"),
                caption: "direccion",
                type: "textField"
            },
            {
                name: "telefono",
                label: self.tr("Teléfono"),
                caption: "telefono",
                type: "textField"
            },
            {
                name: "email",
                label: self.tr("E-mail"),
                caption: "email",
                type: "textField"
            },
            {
                name: "slogan",
                label: self.tr("Slogan"),
                caption: "slogan",
                type: "textField"
            },
            {
                name: "logo",
                label: self.tr("Logo"),
                caption: "logo",
                type: "uploader",
                mode: "rename"
            },
            {
                name: "nombre",
                label: self.tr("Nombre"),
                caption: "nombre",
                type: "textField"
            }
        ];
        self.setFields(fields);

        var data = {};
        data[""] = "Seleccione...";
        qxnw.utils.populateSelectFromArray(self.ui.pais, data);

        var data = {};
        data["table"] = "paises";
        qxnw.utils.populateSelect(self.ui.pais, "master", "populate", data);

        self.ui.pais.addListener("changeValue", function () {
            self.ui.ciudad.removeAll();
            var val = this.getValue();
            var data = {};
            data.table = "ciudades";
            data.where = "pais=" + val.pais;
            qxnw.utils.populateSelect(self.ui.ciudad, "master", "populate", data);
        });

        self.setGroupHeader("Editar");

        self.ui.accept.addListener("execute", function () {
            self.slotSave();
        });
        self.ui.cancel.addListener("execute", function () {
            self.reject();
        });
    },
    destruct: function () {
    },
    members: {
        pr: null,
        slotSave: function slotSave() {
            var self = this;
            var data = this.getRecord();
            var rpc = new qxnw.rpc(this.rpcUrl, "nw_empresas");
            rpc.exec("save", data);
            if (rpc.isError()) {
                qxnw.utils.error(rpc.getError(), self);
                return;
            }
            self.accept();
        },
        setParamRecord: function setParamRecord(pr) {
            var self = this;
            if (pr.pais !== "") {
                var data = {};
                data.table = "ciudades";
                data.where = "pais=" + pr.pais;
                qxnw.utils.populateSelect(self.ui.ciudad, "master", "populate", data);
            }
            this.setRecord(pr);
            return true;
        }
    }
});
