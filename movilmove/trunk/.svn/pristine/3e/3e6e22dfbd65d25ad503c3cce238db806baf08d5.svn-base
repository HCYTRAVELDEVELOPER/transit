nw.Class.define("f_redimir_cupon", {
    extend: nw.forms,
    construct: function (callback) {
        var self = this;
        self.id = "f_redimir_cupon";
        self.setTitle = "<span style='color:#fff;'>" + nw.tr("Promociones") + "</span>";
//        self.html = "Redimir cupón promocional";
        self.showBack = true;
        self.closeBack = false;
        self.colorBtnBackIOS = "#ffffff;";
        self.styleCloseIOS = "color:#ffffff;color: rgb(255, 255, 255);background-color: transparent;border: 0;box-shadow:none;";
//        self.transition = "slideup";
        self.createBase();
        self.callback = callback;
        var fields = [
            {
                label: "",
                style: '',
                name: "contenedor_promociones",
                mode: "div",
                type: "startGroup"
            },
            {
                name: "my_link_img",
                label: "<span class='imgRefiereAmigos' style='background-image: url(" + config.domain_rpc + "/lib_mobile/driver/img/Cupones_IMG.png); background-size: 158px;background-position: center;'></span>",
                type: "html"
            },
            {
                name: "my_link_description",
                label: "<span class='titleRefiereAmigos'>" + nw.tr("Redimir cupón promocional") + "</span><span class='descpRefiereAmigos'>" + nw.tr("Redime y viaja con nosotros a donde tu quieras.") + "</span>",
                type: "html"
            },
            {
                label: "",
                style: '',
                name: "contenedor_refiere_amigos_actions",
                mode: "div",
                type: "startGroup"
            },
            {
                name: "nombre",
                label: "Código",
                placeholder: 'Código',
                type: "textField",
                required: true,
                visible: true
            },
            {
                label: "",
                style: '',
                name: "contenedor_refiere_amigos_buttons",
                mode: "div",
                type: "startGroup"
            },
            {
                name: "redimir",
                label: "Redimir",
                type: "button"
            },
            {
                mode: "div",
                type: "endGroup"
            },
            {
                mode: "div",
                type: "endGroup"
            },
            {
                mode: "div",
                type: "endGroup"
            }
        ];
        self.setFields(fields);
//        self.buttons = [
//            {
//                style: "background-color: #f18107;color: #ffffff;",
//                icon: "nwmaker/img/baseline-how_to_reg-24px.svg",
//                colorBtnBackIOS: "#ffffff",
//                name: "aceptar btn_generic",
//                label: "Enviar",
//                callback: function () {
//                    self.save();
//                }
//            }
//        ];
        self.show();
        self.ui.redimir.addListener("click", function () {
            self.save();
        });

        $("#f_redimir_cupon .nw_label_nombre").css("cssText", "display:none!important;");
    },
    destruct: function () {
    },
    members: {
        save: function save() {
            var self = this;
            if (!self.validate()) {
                return false;
            }
            var up = nw.userPolicies.getUserData();
            var data = self.getRecord(true);
            data.usuario = up.usuario;
            data.empresa = up.empresa;
            data.perfil = up.perfil;
            var rpc = new nw.rpc(nw.getRpcUrl(), "vehiculo");
            rpc.setAsync(true);
            var func = function (r) {
                console.log(r);
                if (r === false) {
                    nw.dialog("El código no existe o ya fue redimido");
                    return false;
                }
                var op = {};
                op.cleanHtml = false;
                if (!nw.evalueData(up.saldo)) {
                    up.saldo = 0;
                }
                var saldo = parseFloat(up.saldo) + parseFloat(r.valor);
                up.saldo = saldo;
                window.localStorage.setItem("saldo", saldo);
                nw.dialog("<strong>" + nw.tr("¡Código redimido!") + "</strong><br /><br />" + r.valor + " " + nw.tr("es tu saldo para próximos viajes"), false, false, op);
                if (nw.evalueData(self.callback)) {
                    self.callback();
                } else {
                    self.reject();
                    nw.home();
                }
            };
            rpc.exec("validate_cupon", data, func);
        },
        populate: function populate(pr) {
            var self = this;
            self.setRecord(pr);
        }
    }
});