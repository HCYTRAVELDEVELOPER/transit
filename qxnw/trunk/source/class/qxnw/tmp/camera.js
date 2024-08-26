qx.Class.define("qxnw.tmp.camera", {
    extend: qxnw.forms,
    construct: function() {
        var self = this;
        this.base(arguments);
        this.setTitle("Cámara");
        this.setWidth(530);
        this.setHeight(400);
        self.webcam = new qxnw.camera();
        self.add(self.webcam.getFlashBars(500, 350), {
            flex: 1
        });
        self.webcam.addListener("upload", function(e) {
            self.ruta = e.getData();
        });
        var buttons = [
            {
                name: "take",
                label: "Capturar",
                icon: qxnw.config.execIcon("dialog-apply")
            },
            {
                name: "upload",
                label: "Subir",
                icon: qxnw.config.execIcon("dialog-apply")
            },
            {
                name: "cancel",
                label: "Cancelar",
                icon: qxnw.config.execIcon("dialog-apply")
            }
        ];
        self.addButtons(buttons);
        self.ui.take.addListener("execute", function() {
            self.camGrabar();
        });
        self.ui.upload.addListener("execute", function() {
            self.camEnviar();
        });
        self.ui.cancel.addListener("execute", function() {
            self.camCancelar();
            self.reject();
        });
    },
    members: {
        webcam: null,
        ruta: null,
        camGrabar: function() {
            this.webcam.freeze();
        },
        camCancelar: function() {
            this.webcam.reset();
        },
        camEnviar: function() {
            this.webcam.freeze();
            this.webcam.upload();
            this.webcam.reset();
        }
    }
});