qx.Class.define("transmovapp.forms.f_operarios", {
    extend: qxnw.forms,
    construct: function (tipo) {
        var self = this;
        this.base(arguments);
        this.createBase();
        self.setGroupHeader("Editar - crear usuarios de Back-end");
        this.setTitle("Editar - crear usuarios de Back-end");
        self.config = main.getConfiguracion();
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
                name: "email",
                label: "E-mail",
                type: "textField",
                mode: "email",
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
                name: "celular",
                label: "Celular",
                caption: "celular",
                type: "textField"
            },
            {
                name: "estado",
                label: "Estado",
                caption: "estado",
                type: "selectBox"
            },
            {
                name: "terminal",
                label: self.tr("Terminal"),
                type: "selectBox",
                visible: true,
                required: true
            },
            {
                name: "pais",
                caption: "pais",
                label: "País",
                type: "selectBox",
                required: true
            },
            {
                name: "ciudad",
                label: "Ciudad",
                caption: "ciudad",
                type: "selectBox",
                required: true
            },
            {
                name: "foto",
                label: "Foto",
                caption: "foto",
                type: "uploader"
            },
            {
                name: "firma",
                label: "Firma",
                caption: "firma",
                type: "uploader",
                mode: "rename"
            },
            {
                name: "tipo_empresa",
                label: "Tipo empresa",
                caption: "tipo_empresa",
                type: "selectBox"
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

                name: "terminales",
                label: "Terminales asociar",
                caption: "terminales",
                type: "selectListCheck"
            }
        ];
        this.setFields(fields);
        var up = qxnw.userPolicies.getUserData();
//        self.ui.categoria.setEnabled(false);
        var data = {};
        data[""] = "Seleccione";
        qxnw.utils.populateSelectFromArray(self.ui.perfil, data);
        qxnw.utils.populateSelectFromArray(self.ui.terminal, data);

        var t = {};
        t.table = "terminales";
        t.where = " empresa=" + up.company;
        qxnw.utils.populateSelect(self.ui.terminal, "master", "populate", t);
        self.ui.terminales.populate("master", "populate", t);

        data = {};
        data.table = "perfiles";
//        data.where = " and id in(1229,1230,1232,1233,1234)";
//        data.where = " 1=1";
        qxnw.utils.populateSelect(self.ui.perfil, "usuarios", "perfiles", data);

        var data = {};
        data[""] = "Seleccione";
        qxnw.utils.populateSelectFromArray(self.ui.bodega, data);

        data = {};
        data.table = "edo_empresas";
        qxnw.utils.populateSelect(self.ui.bodega, "master", "populate", data);


        if (up.profile == "1230") {
            self.ui.perfil.setEnabled(false);
        }
//        self.setFieldVisibility(self.ui.bodega, "excluded");
        self.setRequired("bodega", false);
//        self.setFieldVisibility(self.ui.tipo_empresa, "excluded");
//        self.setRequired("tipo_empresa", false);

        self.ui.tipo_empresa.addListener("changeSelection", function (e) {
            var datas = this.getValue();
            console.log(datas);
            if (datas.tipo_empresa != "") {
                self.ui.bodega.removeAll();
                self.setFieldVisibility(self.ui.bodega, "visible");
                self.setRequired("bodega", true);
                var data = {};
                data[""] = "Seleccione";
                qxnw.utils.populateSelectFromArray(self.ui.bodega, data);
                data = {};
                data.table = "edo_empresas";
                data.where = " tipo_empresa='" + datas.tipo_empresa + "'";
                qxnw.utils.populateSelect(self.ui.bodega, "master", "populate", data);
            }
        });

//        self.ui.perfil.addListener("changeSelection", function (e) {
//            var data = this.getValue();
//            if (self.config.usa_flotas_clientes != "SI") {
//                if (data.perfil == "1232" || data.perfil == "1232") {
//                    self.setFieldVisibility(self.ui.bodega, "visible");
//                    self.setRequired("bodega", true);
//                } else {
//                    self.setFieldVisibility(self.ui.bodega, "excluded");
//                    self.setRequired("bodega", false);
//                }
//            } else {
//                if (data.perfil == "1232" || data.perfil == "1233") {
//                    self.setFieldVisibility(self.ui.tipo_empresa, "visible");
//                    self.setRequired("tipo_empresa", true);
//                } else {
//                    self.setFieldVisibility(self.ui.tipo_empresa, "excluded");
//                    self.ui.tipo_empresa.setValue("");
//                    self.setRequired("tipo_empresa", false);
//                    self.setFieldVisibility(self.ui.bodega, "excluded");
//                    self.setRequired("bodega", false);
//                }
//            }
//        });

//        self.setFieldVisibility(self.ui.centro_costo, "excluded");
        self.__conf = main.getConfiguracion();
//        if (self.__conf.app_para == "CARGA" || qxnw.utils.evalue(self.__conf.usa_centros_de_costo) && self.__conf.usa_centros_de_costo == "SI") {
        self.ui.bodega.addListener("changeSelection", function (e) {
            var data = this.getValue();
            if (data.bodega != "") {
                self.ui.centro_costo.removeAll();
                var dta = {};
                dta[""] = "Seleccione";
                qxnw.utils.populateSelectFromArray(self.ui.centro_costo, dta);
                var dat = data.bodega;
                qxnw.utils.populateSelect(self.ui.centro_costo, "empresas", "populateCentros", dat);
                self.setFieldVisibility(self.ui.centro_costo, "visible");
            } else {
//                self.setFieldVisibility(self.ui.centro_costo, "excluded");
            }
        });
//        }

        var data = {};
        data[""] = "Seleccione";
        qxnw.utils.populateSelectFromArray(self.ui.pais, data);
        qxnw.utils.populateSelect(self.ui.pais, "usuarios", "traePaises", data);

        self.ui.pais.addListener("changeSelection", function (e) {
            var datas = this.getValue();
            console.log(datas);
            self.ui.ciudad.removeAll();

            var data = {};
            data[""] = "Seleccione";
            qxnw.utils.populateSelectFromArray(self.ui.ciudad, data);

            var data = {};
            data.pais_id = datas.pais;
            console.log("data", data);
            qxnw.utils.populateSelect(self.ui.ciudad, "usuarios", "ciudad", data);
        });
//        qxnw.utils.populateSelect(self.ui.ciudad, "usuarios", "ciudad", data);
//        var data = {};
//        data[""] = "Todas";
//        qxnw.utils.populateSelectFromArray(self.ui.ciudad, data);
//        data.table = "ciudades";
//        qxnw.utils.populateSelect(self.ui.ciudad, "master", "populate", data);

        data = {};
        data["TODOS"] = "Ninguno";
        data["activo"] = "Activo";
        data["inactivo"] = "Inactivo";
        qxnw.utils.populateSelectFromArray(self.ui.estado, data);

        var data = {};
        data[""] = "Seleccione";
        data["Cliente"] = "Cliente";
        data["Flota"] = "Flota";
        qxnw.utils.populateSelectFromArray(self.ui.tipo_empresa, data);

        self.ui.accept.addListener("execute", function () {
            var id = self.slotSave();
        });
        self.ui.cancel.addListener("execute", function () {
            self.reject();
        });

        self.ui.clave.setValue("12345");
//        self.createNavTable();
//        self.populateNavTable();
    },
    destruct: function () {
    },
    members: {
        navTable: null,
//        createNavTable: function () {
//            var self = this;
//            self.navTable = new qxnw.navtable();
//            self.navTable.setTitle("Empresas asociadas");
//            self.createButtons(false);
//            self.navTable.createBase();
//            var columns = [
//                {
//                    label: "ID",
//                    caption: "id"
//                },
//                {
//                    label: "Nombre",
//                    caption: "nombre"
//                },
//                {
//                    label: "Asociado",
//                    caption: "pertenece",
//                    type: "checkbox",
//                    mode: "editable"
//                }
//            ];
//            self.navTable.setColumns(columns);
//            self.insertNavTable(self.navTable.getBase());
//            var addButton = self.navTable.getAddButton();
//            var removeButton = self.navTable.getRemoveButton();
//            addButton.setEnabled(false);
//            removeButton.setEnabled(false);
//        },
//        populateNavTableFromParams: function (usuario) {
//            var self = this;
//            var data = {};
//            data["usuario"] = usuario;
//            var rpc = new qxnw.rpc(this.rpcUrl, "usuarios");
//            var r = rpc.exec("permisosEmpresas", data);
//            if (rpc.isError()) {
//                qxnw.utils.error(rpc.getError(), self);
//                return;
//            }
////            if (r.length > 0) {
////                r[0].pertenece = true;
////            }
////            console.log(r)
//            self.navTable.setModelData(r);
//            self.navTable.hideColumn("id");
//        },
//        populateNavTable: function () {
//            var self = this;
//            var rpc = new qxnw.rpc(this.rpcUrl, "usuarios");
//            var r = rpc.exec("populatePermisosEmpresas");
//            if (rpc.isError()) {
//                qxnw.utils.error(rpc.getError(), self);
//                return;
//            }
//            console.log(r)
//            self.navTable.setModelData(r);
//            self.navTable.hideColumn("id");
//        },
        slotSave: function slotSave() {
            var self = this;
            if (!self.validate()) {
                return;
            }
            var data = self.getRecord();
            if (self.datosUsu) {
                data.usu = self.datosUsu;
            }
            console.log("data", data);
//            if (data.clave == "" || data.clave == "12345") {
            if (data.clave == "") {
                qxnw.utils.information("Por favor ingrese o cambie la clave");
                return;
            }
//            data.detail = self.navTable.getAllData();
            var rpc = new qxnw.rpc(this.rpcUrl, "usuarios");
            rpc.setAsync(true);
            var func = function (r) {
                self.accept(r);
            };
            rpc.exec("saveBack", data, func);
        },
        setParamRecord: function setParamRecord(pr) {
            var self = this;
            self.datosUsu = pr;
            var self = this;
            var data = pr;
            var rpc = new qxnw.rpc(this.rpcUrl, "usuarios");
            rpc.setAsync(true);
            var func = function (r) {
                for (var i = 0; i < r.length; i++) {
                    var terminales = {
                        id: r[i].id,
                        nombre: r[i].nombre
                    };
                    self.ui.terminales.addToken(terminales);
                }
                self.setRecord(pr);
                self.ui.clave.setValue("12345");

            };
            rpc.exec("slotTerminales", data, func);
//            self.populateNavTableFromParams(pr.usuario);
            return true;
        }
    }
});
