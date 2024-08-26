nw.Class.define("l_soporte_admin", {
    extend: nw.lists,
    construct: function () {
        var self = this;
        self.showContextMenu = false;
        self.id = "l_soporte_admin";
        self.setTitle = "Soporte";
        self.html = "Soporte";
        self.showBack = true;
        self.closeBack = false;
        self.textClose = "Atrás";
        self.createBase();

        var columns = [
            {
                name: "id",
                label: "Chat",
            },
            {
                name: "comentario",
                label: "Comentarios"
            },
            {
                name: "estado",
                label: "Estado"
            },
            {
                name: "fecha",
                label: "Fecha"
            },
            {
                name: "hora",
                label: "Hora"
            },
            {
                name: "chat",
                label: "",
                type: "button"
            }
        ];
        self.setColumns(columns);
        self.buttons = [];
        var css = "background-color: #ffffff;color:#333;font-weight: bold;border-bottom: 1px solid #ccc;";
        self.buttons.push(
                {
                    style: css,
                    colorBtnBackIOS: "#333",
                    icon: "material-icons playlist_add_check normal",
                    position: "top",
                    name: "crear",
                    label: "Nuevo chat",
                    callback: function (a) {
                        self.formComentarios();
                    }
                }
        );
        self.show();
        $(document).on("click", ".qx_containButton", function () {
            var sl = self.selectedRecord();
            self.chat(sl.id);
        });
//        self.ui.chat.addListener("click", function () {
//            var sl = self.selectedRecord();
//            self.chat(sl.id);
//        });
        self.onAppear(function () {
            setTimeout(function () {
                self.applyFilters();
            }, 100);
        });
    },
    destruct: function () {
    },
    members: {
        formComentarios: function formComentarios() {
            var self = this;
            self.detalle = new nw.forms();
            var up = nw.userPolicies.getUserData();
            self.detalle.id = "f_pagos_empresa";
            self.detalle.setTitle = "Comentarios";
            self.showBackCallBack = function () {
                nw.loadHome();
            };
            self.detalle.createBase();
            var fields = [
                {
                    label: "Bienvenido, cuentanos tu inquietud.",
                    name: 'comentarios',
                    type: "startGroup"
                },
                {
                    name: "comentarios",
                    label: "",
                    type: "textArea",
                    required: true
                },
                {
                    name: "",
                    type: "endGroup",
                }
            ];
            self.detalle.setFields(fields);
            self.detalle.buttons = [
                {
                    style: "border: 0;background-color:#1abbd7;color:#fff;margin:0px;",
                    icon: "material-icons check_circle normal",
                    colorBtnBackIOS: "#fff",
                    position: "bottom",
                    name: "aceptar_comentario",
                    label: "Aceptar",
                    callback: function () {
                        if (!self.detalle.validate()) {
                            return;
                        }
                        self.save();
                    }
                }
            ];
            self.detalle.show();
            if (self.mostrar_group_detalle == false) {
                self.detalle.ui.detalle_servicio.setVisibility(false);
            }
        },
        save: function save() {
            var self = this;
            var up = nw.userPolicies.getUserData();
            var token = nw.getToken();
            var data = self.detalle.getRecord();
            data.usuario = up.usuario;
            data.empresa = up.empresa;
            data.token = token;
            var rpc = new nw.rpc(self.getRpcUrl(), "servicios_conductor");
            rpc.setAsync(true);
            rpc.setLoading(true);
            var func = function (r) {
                self.applyFilters();
                self.chat(r);
            };
            rpc.exec("saveSalasSoporte", data, func);
        },
        chat: function chat(id) {
            var self = this;
            var up = nw.userPolicies.getUserData();
            var data = {};
            data.id = id;
            data.cliente_nombre = "Soporte central";
            data.usuario = up.usuario;
            data.empresa = up.empresa;
            var d = new f_chat();
            d.construct(data);
        },
        clicRow: function clicRow() {
            var self = this;
            var sl = self.selectedRecord();
            console.log(sl);
        },
        applyFilters: function applyFilters() {
            var self = this;
            var up = nw.userPolicies.getUserData();
            var data = {};
            data.usuario = up.usuario;
            data.empresa = up.empresa;
            var rpc = new nw.rpc(self.getRpcUrl(), "servicios_conductor");
            rpc.setAsync(true);
            rpc.setLoading(true);
            var func = function (r) {
                self.setModelData(r);
            };
            rpc.exec("consultaMisSalasChat", data, func);
        }
    }
});