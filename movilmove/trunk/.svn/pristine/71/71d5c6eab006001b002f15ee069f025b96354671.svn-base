nw.Class.define("f_novedades", {
    extend: nw.forms,
    construct: function () {
        var self = this;
        self.id = "f_novedades";
        self.setTitle = "<span style='color:#fff;'>Reportar novedad</span>";
        self.html = "";
        self.showBack = true;
        self.closeBack = false;
        self.colorBtnBackIOS = "#ffffff;";
        self.styleCloseIOS = "color:#ffffff;color: rgb(255, 255, 255);background-color: transparent;border: 0;box-shadow:none;";
        self.createBase();
        var fields = [
            {
                name: "comentario",
                label: "Comentarios",
                visible_label: true,
                placeholder: 'Comentarios',
                type: "textArea",
                required: true
            },
            {
                name: "adjunto",
                label: "Soporte o Evidencia",
                visible_label: true,
                type: "button",
                mode: "camera_files",
//                type: "uploader_frame",
                required: false
            }
        ];
        self.setFields(fields);
        self.buttons = [];
        self.buttons.push(
                {
                    style: "border: 0;background-color:#f18107;color:#ffffff;margin:0px;",
                    icon: "material-icons check_circle normal",
                    colorBtnBackIOS: "#ffffff",
                    position: "top",
                    name: "enviar",
                    label: "Enviar",
                    callback: function () {
                        self.save();
                    }
                }
        );
        self.show();
    },
    destruct: function () {
    },
    members: {
        save: function save() {
            var self = this;
            if (!self.validate()) {
                return false;
            }
            var data = self.getRecord(true);
            var up = nw.userPolicies.getUserData();
            data.id_usuario = up.id_usuario;
            data.usuario = up.usuario;
            data.empresa = up.empresa;
            data.perfil = up.perfil;
            data.id_viaje = self.data.id;
            data.estado = "CREADO_POR_CONDUCTOR";
            var rpc = new nw.rpc(nw.getRpcUrl(), "servicios");
            rpc.setAsync(true);
            rpc.setLoading(true);
            var func = function (r) {
                if (r !== true) {
                    nw.dialog(r);
                    return false;
                }
                nw.dialog("Enviado correctamente");
                nw.back();
            };
            rpc.exec("reportarNovedad", data, func);
        },
        populate: function populate(pr) {
            var self = this;
            self.data = pr;
        }
    }
});