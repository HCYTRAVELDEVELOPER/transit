qx.Class.define("usuarios_app.forms.f_usuarios", {
    extend: qxnw.forms,
    construct: function (data, filters) {
        var self = this;
        this.base(arguments);
        this.createBase();
        self.setGroupHeader("Editar - crear usuarios de App");
        self.__conf = main.getConfiguracion();
        self.data = {};
        if (qxnw.utils.evalueData(data)) {
            self.data = data;
        }
        self.filters = {};
        if (qxnw.utils.evalueData(filters)) {
            self.filters = filters;
        }
        var fields = [
            {
                name: "id",
                label: "ID",
                caption: "id",
                type: "textField",
                visible: false
            },
            {
                name: "tabla",
                label: "tabla",
                caption: "tabla",
                type: "textField",
                visible: false
            },
            {
                name: self.tr("Datos Basicos"),
                type: "startGroup",
                icon: "",
                mode: "horizontal"
            },
            {
                name: "foto_perfil",
                label: "Foto",
                caption: "foto_perfil",
                type: "uploader"
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
                name: "email",
                label: "E-mail",
                type: "textField",
                mode: "email",
                required: true
            },
            {
                name: "nit",
                label: "# Documento",
                caption: "nit",
                type: "textField"
            },
            {
                name: "",
                type: "endGroup"
            },
            {
                name: self.tr("Acceso a la aplicación"),
                type: "startGroup",
                icon: "",
                mode: "horizontal"
            },
            {
                name: "usuario_cliente",
                label: "Usuario (iniciar sesión)",
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
                name: "perfil",
                label: "Perfil",
                caption: "perfil",
                type: "selectBox",
                required: true
            },
            {
                name: "estado",
                label: "Estado",
                caption: "estado",
                type: "selectBox"
            },
            {
                name: "",
                type: "endGroup"
            },
            {
                name: self.tr("Ubicación"),
                type: "startGroup",
                icon: "",
                mode: "horizontal"
            },
            {
                name: "ciudad",
                label: "Ciudad",
                caption: "ciudad",
                type: "selectBox",
                required: true
            },
            {
                name: "",
                type: "endGroup"
            },
            {
                name: self.tr("Datos de empresa/flota a la que pertenece (opcional)"),
                type: "startGroup",
                icon: "",
                mode: "horizontal"
            },
            {
                name: "bodega",
                label: "Empresa cliente",
                caption: "bodega",
                type: "selectBox"
            },
            {
                name: "centro_costo",
                label: "Centro de costo",
                caption: "centro_costo",
                type: "selectBox"
            },
            {
                name: "contrato",
                label: "# Contrato",
                caption: "contrato",
                type: "textField",
                required: false,
                enabled: false
            },
            {
                name: "",
                type: "endGroup"
            },
            {
                name: self.tr("Otros datos (opcional)"),
                type: "startGroup",
                icon: "",
                mode: "horizontal"
            },
            {
                name: "genero",
                label: "Genero",
                caption: "genero",
                type: "selectBox"
            },
            {
                name: "celular",
                label: "Celular",
                caption: "celular",
                type: "textField"
            },
            {
                name: "",
                type: "endGroup"
            }
        ];
        this.setFields(fields);

        this.setTitle("Editar - crear usuarios de App");

        self.dataPopulate = false;

        var data = {};
        data["1"] = "Pasajero";
        data["2"] = "Conductor";
        self.ui.perfil.populateFromArray(data);
//        self.ui.perfil.setValue(1);
//        self.ui.perfil.setEnabled(false);

        if (qxnw.utils.evalueData(self.filters.perfil)) {
            self.ui.perfil.setValue(self.filters.perfil);
            self.ui.perfil.setEnabled(false);
//            self.form.setRequired(fi.field, false);
        }

        var data = {};
        data[""] = "Seleccione";
        qxnw.utils.populateSelectFromArray(self.ui.bodega, data);
        qxnw.utils.populateSelectFromArray(self.ui.centro_costo, data);

        data = {};
        data.table = "edo_empresas";
        qxnw.utils.populateSelect(self.ui.bodega, "master", "populate", data);

        self.ui.bodega.addListener("changeSelection", function () {
            self.ui.centro_costo.removeAll();

            var dta = {};
            dta[""] = "Seleccione";
            qxnw.utils.populateSelectFromArray(self.ui.centro_costo, dta);

//        var dat = up.bodega;
            var bod = self.ui.bodega.getValue();
            console.log("bod", bod);
            var dat = bod.bodega;
            console.log("bodega empresa", dat);
            if (dat !== "") {

                qxnw.utils.populateSelect(self.ui.centro_costo, "empresas", "populateCentros", dat);

                console.log("bod.contrato", bod.bodega_model.contrato);
                if (typeof bod.bodega_model.contrato === "undefined" || bod.bodega_model.contrato == null || bod.bodega_model.contrato == undefined) {
                    qxnw.utils.information("Esta empresa no cuenta con número de contrato, se asignará uno automático.");
                } else {
                    self.ui.contrato.setValue(bod.bodega_model.contrato);
                }
            } else {
                self.ui.contrato.setValue("");
            }
        });

        var user_cc = main.getUsercc();
        if (typeof user_cc.centro_costo != 'undefined' && user_cc.centro_costo != "" && user_cc.centro_costo != null) {
            self.ui.centro_costo.setValue(user_cc.centro_costo);
        }

        var up = qxnw.userPolicies.getUserData();
        console.log(up);

        var data = {};
        data[""] = "Todas";
        qxnw.utils.populateSelect(self.ui.ciudad, "usuarios", "ciudad", data);

        data = {};
        data["activo"] = "Activo";
        data["inactivo"] = "Inactivo";
        qxnw.utils.populateSelectFromArray(self.ui.estado, data);

        data = {};
        data[""] = "Seleccione";
        data["hombre"] = "Masculino";
        data["mujer"] = "Femenino";
        data["otro"] = "Otro";
        qxnw.utils.populateSelectFromArray(self.ui.genero, data);

        self.ui.accept.addListener("execute", function () {
            var data = self.getRecord();
            if (!qxnw.utils.evalueData(data.id)) {
                self.validaUsuarioExiste(function () {
                    self.slotSave();
                });
            } else {
                self.slotSave();
            }
        });
        self.ui.cancel.addListener("execute", function () {
            self.reject();
        });
        self.ui.usuario_cliente.addListener("focusout", function (e) {
            var data = self.getRecord();
            if (!qxnw.utils.evalueData(data.id)) {
                self.validaUsuarioExiste();
            }
        });
        self.ui.clave.setValue("12345");
    },
    destruct: function () {
    },
    members: {
        navTable: null,
        validaUsuarioExiste: function validaUsuarioExiste(callback) {
            var self = this;
            var data = self.getRecord();
            console.log("validaUsuarioExiste:::sendData", data);
            var rpc = new qxnw.rpc(self.getRpcUrl(), "usuarios_app", true);
            var func = function (r) {
                console.log("validaUsuarioExiste:::responseServer", r);
                if (r) {
                    qxnw.utils.information("El email ya se encuentra registrado, Valide por favor");
                }
                if (qxnw.utils.evalueData(callback)) {
                    callback();
                }
            };
            rpc.exec("verificarUsuario", data, func);
        },
        slotSave: function slotSave() {
            var self = this;
            if (!self.validate()) {
                return;
            }
            var data = self.getRecord();
            console.log("data", data);
            var rpc = new qxnw.rpc(this.rpcUrl, "usuarios_app");
            rpc.setAsync(true);
            var func = function (r) {
                self.accept(r);
            };
            rpc.exec("guardaUsuario", data, func);
        },
        setParamRecord: function setParamRecord(pr) {
            var self = this;
            console.log("setParamRecord", pr);
            self.setRecord(pr);
            self.ui.clave.setValue("12345");
//            self.populateNavTableFromParams(pr.usuario);
            return true;
        }
    }
});
