qx.Class.define("qxnw.nw_file_manager.f_visto_imagenes", {
    extend: qxnw.forms,
    construct: function () {
        var self = this;
        this.base(arguments);
        self.setInvalidateStore(true);
        self.setTitle("NW Group::Visualizar imágenes");
        qxnw.utils.loadCss("/nwlib" + qxnw.userPolicies.getNwlibVersion() + "/css/nwdrive.css");
        self.ui.accept.addListener("execute", function () {
            self.reject();
        });
        self.ui.cancel.addListener("execute", function () {
            self.reject();
        });
    },
    destruct: function () {
    },
    members: {
        createWindow: function createWindow(pr) {
            var self = this;
            var l = self;
            var containerTest = new qx.ui.container.Composite(new qx.ui.layout.Flow()).set({
                maxHeight: 30,
                minHeight: 30
            });
            containerTest.addListener("appear", function () {
                qx.bom.element.Class.add(this.getContentElement().getDomElement(), "qxnw_containerImageVisor");
            });
            l.addListener("appear", function () {
                qx.bom.element.Class.add(this.getContentElement().getDomElement(), "qxnw_containerVisorAll");
            });
            var Descargar = new qx.ui.form.Button("Descargar", qxnw.config.execIcon("document-save"));
            var Cerrar = new qx.ui.form.Button("Cerrar", qxnw.config.execIcon("dialog-close"));
            var ZoomMas = new qx.ui.form.Button("Zoom +");
            var ZoomMenos = new qx.ui.form.Button("Zoom -");
            var Siguiente = new qx.ui.form.Button("Siguiente");
            var Atras = new qx.ui.form.Button("Atrás");
            Cerrar.addListener("click", function () {
                self.reject();
            });
            containerTest.add(Descargar);
            containerTest.add(Cerrar);
//            containerTest.add(ZoomMas);
//            containerTest.add(ZoomMenos);
//            containerTest.add(Siguiente);
//            containerTest.add(Atras);
            var imgIcon = pr.imagen;
            l.addBefore(containerTest, l.scrollContainer);
            ZoomMas.setVisibility("excluded");
            ZoomMenos.setVisibility("excluded");
            Siguiente.setVisibility("excluded");
            Atras.setVisibility("excluded");
//IMAGEN O ARCHIVO MUESTRA///////////////////////////////////////////////////////////////////////////////////////////////
            var containerCarpet = new qx.ui.container.Composite(new qx.ui.layout.Flow()).set({
                minHeight: 500,
                minWidth: 600
            });
            var str = imgIcon;
            var myarr = str.split(".");
            var extension = "";
            for (var i = 0; i < myarr.length; i++) {
                var number = i + 1;
                if (number == myarr.length) {
                    if (myarr[i] != "") {
                        extension = myarr[i];
                    }
                }
            }
            l.hideSelectPrinters(true);
            var img = "";
            var urlCompleta = "http://" + document.domain + imgIcon;
            if (extension == "pdf" || extension == "PDF") {
                l.addFrame(imgIcon, false);
            } else if (extension == "JPG" || extension == "jpg" || extension == "png" || extension == "PNG" || extension == "gif"  || extension == "HEIF") {
                img = new qx.ui.basic.Image(imgIcon);
//                l.addFrame(imgIcon, false);
                ZoomMas.setVisibility("visible");
                ZoomMenos.setVisibility("visible");
                Siguiente.setVisibility("visible");
                Atras.setVisibility("visible");
            } else if (extension == "doc" || extension == "docx" || extension == "docm" || extension == "dotx" || extension == "dotm" || extension == "odt") {
//                        l.addFrame("/nwlib/modulos/office/word/word.php?archivo=" + imgIcon, false);
                l.addFrame("https://docs.google.com/gview?url=" + urlCompleta + "&embedded=true", false);
            } else {
                var htmlNotificationTwo = "<div class='no_suppor_extension_file'><h1>Lo sentimos</h1><p>El archivo que intenta visualizar no es posible mostrarlo o no existe.</p><a href='" + imgIcon + "' target='_blank'>Descargar</div></div>";
                var notificationsImage = new qx.ui.basic.Label(htmlNotificationTwo).set({
                    rich: true
                });
                notificationsImage.addListener("appear", function () {
                    qx.bom.element.Class.add(this.getContentElement().getDomElement(), "no_found_div");
                });
                containerCarpet.add(notificationsImage);
            }
            containerCarpet.addListener("appear", function () {
                qx.bom.element.Class.add(this.getContentElement().getDomElement(), "qxnw_containerImageBlock");
            });
            Descargar.addListener("click", function () {
                self.slotVerAdjunto(imgIcon);
            });
            if (img != "") {
                img.addListener("appear", function () {
                    qx.bom.element.Class.add(this.getContentElement().getDomElement(), "qxnw_containerImageBlockIMG");
                });
                containerCarpet.add(img);
            }
            l.addWidget(containerCarpet);

        },
        slotVerAdjunto: function slotVerAdjunto(img) {
            var sl = img;
            var win = window.open(sl, '_blank');
            win.focus();
        },
        setParamRecord: function setParamRecord(pr) {
            var self = this;
            self.createWindow(pr);
            return true;
        }
    }
});