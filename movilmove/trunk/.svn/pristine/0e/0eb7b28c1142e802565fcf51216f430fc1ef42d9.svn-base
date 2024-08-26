qx.Class.define("nwsites.forms.f_empresas_clientes", {
    extend: qxnw.forms,
    construct: function() {
        var self = this;
        this.base(arguments);
        this.createBase();
        this.setTitle("Empresas Clientes");
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
                caption: "nombre",
                type: "textField",
                visible: true,
                required: true
            },
            {
                name: "nit",
                label: "Nit",
                caption: "nit",
                type: "textField",
                required: true
            },
            {
                name: "razon_social",
                label: "Razon Social",
                caption: "razon_social",
                type: "textField",
                required: true
            },
            {
                name: "telefono",
                label: "Telefono",
                caption: "telefono",
                type: "textField",
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
                name: "direccion",
                label: "Dirección",
                caption: "direccion",
                type: "textField",
                required: true
            },
            {
                name: "estado",
                label: "Estado",
                caption: "estado",
                type: "textField",
                required: true
            },
            {
                name: "contacto_directo",
                label: "Contacto Directo",
                caption: "contacto_directo",
                type: "textField",
                required: true
            },
            {
                name: "logo",
                label: "Logo",
                caption: "logo",
                type: "uploader",
                required: true
            },
            {
                name: "imagen_portada",
                label: "Imagen de Portada",
                caption: "imagen_portada",
                type: "uploader",
                required: true
            },
            {
                name: "url",
                label: "URL",
                caption: "url",
                type: "textField",
                required: true
            }
            
        ];
        self.setFields(fields);
        self.ui.accept.addListener("execute", function() {
            self.slotSave();
        });
        self.ui.cancel.addListener("execute", function() {
            self.reject();
        });
        var button = [
        ];
       
        self.addButtons(button);
    },
    destruct: function() {
    },
    members: {
        pr: null,
        slotSave: function slotSave() {
            var self = this;
            var data = this.getRecord();
            var rpc = new qxnw.rpc(self.getRpcUrl(), "pv_nwsites");
            rpc.setAsync(true);
            var func = function(r) {
                self.accept();
            }
            rpc.exec("saveEmpresaClientes", data, func);
        },
        setParamRecord: function setParamRecord(pr) {
            this.setRecord(pr);
            return true;
        }
    }
});
