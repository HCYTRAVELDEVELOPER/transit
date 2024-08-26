nw.Class.define("f_preoperacional_documento", {
    extend: nw.forms,
    construct: function (parent) {
        var self = this;
        self.id = "f_preoperacional_documento";
        self.setTitle = "<span style='color:#fff;'>Documento</span>";
        self.showBack = true;
        self.closeBack = false;
        self.textClose = "Atrás";
        self.colorBtnBackIOS = "#ffffff;";
        self.styleCloseIOS = "color:#ffffff;color: rgb(255, 255, 255);background-color: transparent;border: 0;box-shadow:none;";
        self.closeBackCallBack = function () {
            nw.back();
        };
//        self.transition = "slideup";
        self.createBase();

        var fields = [
            {
                icon: "n",
                name: "adjunto",
                label: "Adjunto",
                placeholder: "Adjunto",
                type: "button",
                mode: "camera_files",
                required: true
            },
            {
                icon: "n",
                name: "observaciones",
                label: "Observaciones",
                placeholder: "Observaciones",
                type: "textArea",
                required: false
            }
        ];
        self.setFields(fields);

        self.buttons = [
            {
                style: "background-size:20px;box-shadow: none;border: 0;background-color: transparent;color: #ffffff;",
                icon: "material-icons how_to_reg normal",
                colorBtnBackIOS: "#ffffff",
                position: "top",
                name: "aceptar",
                label: "Listo",
                callback: function () {
                    var data = self.getRecord();
                    if (!self.validate()) {
                        return false;
                    }
                    nw.utils.remove(parent.canvas + " .showZeroRows");
                    data.adjunto_show = config.domain_rpc + data.adjunto;
                    parent.navTable.addRow(data);
                    nw.back();
                }
            }
        ];
        self.show();
    },
    destruct: function () {
    },
    members: {
        canvas: function canvas(canvas) {
            this.canvas = canvas;
        }
    }
});