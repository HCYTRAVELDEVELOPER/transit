/* ************************************************************************
 
 Copyright:
 2013 Netwoods.net, http://www.netwoods.net
 
 License:
 LGPL: http://www.gnu.org/licenses/lgpl.html
 EPL: http://www.eclipse.org/org/documents/epl-v10.php
 See the LICENSE file in the project's top-level directory for details.
 
 Authors:
 * Andrés Flórez (andresf)
 
 ************************************************************************ */
/**
 * Main class of old and new camera widget
 */
qx.Class.define("qxnw.widgets.camera", {
    extend: qx.ui.container.Composite,
    include: [qx.locale.MTranslation],
    construct: function () {
        var self = this;
        this.base(arguments);
        self.classname = "qxnw.camera";
        this.__baseLayout = new qx.ui.layout.HBox();
        this.setLayout(this.__baseLayout);

        this.__newVersion = qxnw.utils.hasGetUserMedia();
        if (window.location.protocol != "https:") {
            this.__newVersion = false;
        }
        this.setMinHeight(self.getImageHeight());
        this.setMaxHeight(self.getImageHeight());

        this.startCamera();

        self.__canvas = document.createElement("canvas");
        self.__canvas.width = self.getImageWidth();
        self.__canvas.height = self.getImageHeight();
        self.__ctx = self.__canvas.getContext('2d');
    },
    properties: {
        imageWidth: {
            init: 280,
            check: "Integer"
        },
        imageHeight: {
            init: 200,
            check: "Integer"
        }
    },
    destruct: function destruct() {
        var track = this.__localMediaStream.getTracks()[0];
        track.stop();
        try {
            this.destroy();
            this._disposeObjects("this.ui");
            this._disposeObjects("this.__alterImageComposite");
            this._disposeObjects("this.__buttonSnapshot");
            this._disposeObjects("this.__uploader");
            this._disposeObjects("this.__buttonUpload");
            this._disposeObjects("this.__buttonCut");
            this._disposeObjects("this.__buttonGuardar");
            this._disposeObjects("this.__canvas");
            this._disposeObjects("this.__baseLayout");
            this._disposeObjects("this.__video");
            this._disposeObjects("this.__ctx");
            this._disposeObjects("this.__localMediaStream");
            this.dispose();
        } catch (e) {
            this.dispose();
        }
    },
    events: {
        "saved_image": "qx.event.type.Data",
        "loaded_camera": "qx.event.type.Data",
        "take_snapshot": "qx.event.type.Data"
    },
    members: {
        __cameraOld: null,
        __oldVersion: false,
        __video: null,
        __localMediaStream: null,
        __ctx: null,
        __canvas: null,
        __canvasCut: null,
        __canvasGuardar: null,
        __alterImageComposite: null,
        __buttonCut: null,
        __img: null,
        __normalHeight: 200,
        __normalWidth: 280,
        __buttonDescargar: null,
        __required: false,
        __invalidMessage: null,
        id_listener: null,
        popup: null,
        base64Img: null,
        __buttonSnapshot: null,
        __uploader: null,
        spacer: null,
        stateOnOff: null,
        getImg: function getImg() {
            return this.__img;
        },
        getCanvas: function getCanvas() {
            return this.__canvas;
        },
        stop: function stop() {
            var track = this.__localMediaStream.getTracks()[0];
            track.stop();
        },
        setAllTabIndex: function setAllTabIndex(index) {
            var self = this;
            if (self.__newVersion == false) {
                self.__cameraOld.setAllTabIndex(index);
            } else {
                if (self.__buttonSnapshot != null) {
                    self.__buttonSnapshot.setTabIndex(index);
                }
                if (self.__uploader != null) {
                    self.__uploader.setTabIndex(index);
                }
                if (self.__buttonUpload != null) {
                    self.__buttonUpload.setTabIndex(index);
                }
                if (self.__buttonCut != null) {
                    self.__buttonCut.setTabIndex(index);
                }
                if (self.__buttonGuardar != null) {
                    self.__buttonGuardar.setTabIndex(index);
                }
                if (self.__buttonDescargar != null) {
                    self.__buttonDescargar.setTabIndex(index);
                }
                if (self.__buttonClean != null) {
                    self.__buttonClean.setTabIndex(index);
                }
            }
        },
        setValid: function setValid(bool) {
            var self = this;
            if (this.__newVersion == false) {
                this.__cameraOld.setValid(bool);
            } else {
                if (bool == false) {
                    qxnw.utils.addBorder(self);
                    self.id_listener = self.addListenerOnce("mouseover", function (e) {
                        self.popup = new qx.ui.popup.Popup(new qx.ui.layout.HBox()).set({
                            backgroundColor: "#FF0000"
                        });
                        if (self.__invalidMessage != null) {
                            self.popup.placeToPointer(e);
                            self.popup.add(new qx.ui.basic.Atom(self.__invalidMessage), {
                                flex: 1
                            });
                            self.popup.show();
                        }
                    });
                } else {
                    if (self.id_listener != null) {
                        self.removeListenerById(self.id_listener);
                        self.setDecorator(null);
                    }
                }
            }
        },
        setInvalidMessage: function setInvalidMessage(val) {
            if (this.__newVersion == false) {
                this.__cameraOld.setInvalidMessage(val);
            } else {
                this.__invalidMessage = val;
            }
        },
        setRequired: function setRequired(val) {
            if (this.__newVersion == false) {
                this.__cameraOld.setRequired(val);
            } else {
                this.__required = val;
            }
        },
        startCamera: function startCamera() {
            var self = this;
            var css = {
                width: self.getImageWidth(),
                height: self.getImageHeight()
            };
            var arrbtRemote = {
                autoPlay: true,
                width: self.getImageWidth(),
                muted: true
            };

            self.__video = new qx.html.Element("video", css, arrbtRemote);
            self.getContentElement().add(self.__video);

            self.spacer = new qx.ui.core.Widget().set({
                decorator: "main",
                backgroundColor: "black",
                width: self.getImageWidth()
            });
            self.add(self.spacer);

            self.createRightInterface();
        },
        start: function start() {
            var self = this;
            self.spacer.setVisibility("hidden");
            self.getUserMedia({video: true}, function (stream) {
                var vid = self.__video.getDomElement();
                try {
                    vid.srcObject = stream;
                } catch (error) {
                    vid.src = (window.URL || window.webkitURL).createObjectURL(stream);
                }
                self.__localMediaStream = stream;
                var d = {};
                self.fireDataEvent("loaded_camera", d);
            });
        },
        clean: function clean() {
            if (this.__newVersion == false) {
                this.__cameraOld.reset();
            } else {
                this.__alterImageComposite.removeAll();
                this.createRightInterface(false);
                this.__img = null;
            }
        },
        createRightInterface: function createRightInterface(noCreate) {
            var self = this;

            if (typeof noCreate == 'undefined') {
                self.__alterImageComposite = new qx.ui.container.Composite(new qx.ui.layout.VBox()).set({
                    minWidth: self.getImageWidth(),
                    maxWidth: self.getImageWidth(),
                    minHeight: self.getImageHeight(),
                    maxHeight: self.getImageHeight()
                });
                qxnw.utils.addBorder(self.__alterImageComposite, "black", 1);
            }

            if (typeof noCreate == 'undefined') {
                self.__alterImageComposite.setVisibility("excluded");
                self.add(self.__alterImageComposite, {
                    flex: 1
                });
                self.createButtonsInterface();
            }
        },
        createButtonsInterface: function createButtonsInterface() {
            var self = this;

            var minWidth = 35;
            var maxWidth = 35;
            var icon_size = 6;
            var padding_icon = 0;

            var alterButtonsComposite = new qx.ui.container.Composite(new qx.ui.layout.VBox()).set({
                minWidth: minWidth,
                maxWidth: maxWidth,
                padding: padding_icon
            });

            var buttonSnapshot = new qxnw.widgets.button(self.tr("Disparar")).set({
                maxHeight: 50,
                maxWidth: maxWidth,
                show: "icon",
                padding: padding_icon
            });
            var tT = new qx.ui.tooltip.ToolTip("Tomar foto", qxnw.config.execIcon("help-faq"));
            buttonSnapshot.setToolTip(tT);
            self.__buttonSnapshot = buttonSnapshot;
            buttonSnapshot.setIcon(qxnw.config.execIcon("camera-web", "devices", icon_size));
            alterButtonsComposite.add(buttonSnapshot, {
                flex: 0
            });
            buttonSnapshot.addListener("execute", function () {
                qxnw.utils.loading(self.tr("Subiendo..."));
                this.setEnabled(false);
                self.snapshot();
                var t = new qx.event.Timer(100);
                t.start();
                t.addListener("interval", function (e) {
                    this.stop();
                    qxnw.utils.stopLoading();
                    self.saveImage();
                    self.__buttonSnapshot.setEnabled(false);
                    self.__buttonStart.setValue(false);
                });
            });

//            var uploader = new qxnw.uploader();
//            self.__uploader = uploader;
//            uploader.addListener("completed", function (r) {
//                self.addImage(r.getData());
//            });
//            uploader.getContainer().set({
//                maxHeight: 50,
//                maxWidth: maxWidth
//            });
//            uploader.showResponse(false);
//            var buttonUpload = uploader.getButton().set({
//                maxHeight: 50,
//                maxWidth: maxWidth,
//                minWidth: minWidth,
//                show: "icon"
//            });
//            self.__buttonUpload = buttonUpload;
//            buttonUpload.setIcon(qxnw.config.execIcon("insert-image"));
//            buttonUpload.setLabel(self.tr("Subir"));
//            alterButtonsComposite.add(uploader.getContainer(), {
//                flex: 0
//            });

            var buttonCut = new qxnw.widgets.button(self.tr("Cortar")).set({
                maxHeight: 50,
                maxWidth: maxWidth,
                show: "icon",
                padding: padding_icon
            });
            self.__buttonCut = buttonCut;
            var tT = new qx.ui.tooltip.ToolTip("Cortar y cambiar de tamaño", qxnw.config.execIcon("help-faq"));
            buttonCut.setToolTip(tT);
            buttonCut.setIcon(qxnw.config.execIcon("edit-cut", "actions", icon_size));
            alterButtonsComposite.add(buttonCut, {
                flex: 0
            });
            buttonCut.addListener("execute", function () {
                self.cut();
            });
            buttonCut.setEnabled(false);

//            var buttonGuardar = new qxnw.widgets.button(self.tr("Confirmar")).set({
//                maxHeight: 50,
//                maxWidth: maxWidth,
//                show: "icon",
//                padding: padding_icon
//            });
//            self.__buttonGuardar = buttonGuardar;
//            buttonGuardar.setEnabled(false);
//            buttonGuardar.setIcon(qxnw.config.execIcon("dialog-apply", "actions", icon_size));
//            alterButtonsComposite.add(buttonGuardar, {
//                flex: 0
//            });
//            buttonGuardar.addListener("execute", function () {
//                self.saveImage();
//            });

            var buttonDescargar = new qxnw.widgets.button(self.tr("Descargar")).set({
                maxHeight: 50,
                maxWidth: maxWidth,
                show: "icon",
                padding: padding_icon
            });
            self.__buttonDescargar = buttonDescargar;
            var tT = new qx.ui.tooltip.ToolTip("Descargar foto", qxnw.config.execIcon("help-faq"));
            buttonDescargar.setToolTip(tT);
            buttonDescargar.setIcon(qxnw.config.execIcon("document-save", "actions", icon_size));
            alterButtonsComposite.add(buttonDescargar, {
                flex: 0
            });
            buttonDescargar.addListener("execute", function () {
                self.downloadImage();
            });
            buttonDescargar.setEnabled(false);

            var buttonClean = new qxnw.widgets.button(self.tr("Limpiar")).set({
                maxHeight: 50,
                maxWidth: maxWidth,
                show: "icon",
                padding: padding_icon
            });
            var tT = new qx.ui.tooltip.ToolTip("Limpiar y activar cámara", qxnw.config.execIcon("help-faq"));
            buttonClean.setToolTip(tT);
            self.__buttonClean = buttonClean;
            buttonClean.setIcon(qxnw.config.execIcon("edit-clear", "actions", icon_size));
            alterButtonsComposite.add(buttonClean, {
                flex: 0
            });
            buttonClean.addListener("execute", function () {
                self.__buttonSnapshot.setEnabled(true);
                if (self.__alterImageComposite) {
                    self.__alterImageComposite.removeAll();
                }
                self.__buttonCut.setEnabled(false);
                self.__buttonDescargar.setEnabled(false);
                self.__img = null;
                self.start();
            });

            var spacer = new qx.ui.core.Spacer();
            alterButtonsComposite.add(spacer, {
                flex: 1
            });

            var buttonStart = new qx.ui.form.ToggleButton(self.tr("Limpiar")).set({
                maxHeight: 50,
                maxWidth: maxWidth,
                show: "icon",
                padding: padding_icon
            });
            var tT = new qx.ui.tooltip.ToolTip("Encendido cámara", qxnw.config.execIcon("help-faq"));
            buttonStart.setToolTip(tT);
            self.__buttonStart = buttonStart;
            buttonStart.setIcon(qxnw.config.execIcon("system-shutdown", "actions", icon_size));
            alterButtonsComposite.add(buttonStart, {
                flex: 0
            });
            self.stateOnOff = true;
            var op = qxnw.local.getData("nw_open_camara_at_init");
            if (op != null && op == true) {
                buttonStart.setValue(true);
                self.start();
            } else {
                self.__buttonSnapshot.setEnabled(false);
            }
            buttonStart.addListener("changeValue", function (d) {
                qxnw.local.setData("nw_open_camara_at_init", d.getData());
                if (d.getData() == false) {
                    self.stop();
                    self.__buttonSnapshot.setEnabled(false);
                } else {
                    self.start();
                    self.__buttonSnapshot.setEnabled(true);
                }
            });

            self.add(alterButtonsComposite, {
                flex: 1
            });
        },
        downloadImage: function downloadImage() {
            console.log(this.__img);
            window.open(this.__img);
        },
        saveImage: function saveImage(takeSnapshot) {
            var self = this;
            if (self.__img == null && typeof takeSnapshot == 'undefined') {
                self.snapshot();
            }
            if (self.__img == null) {
                return;
            }
            self.__buttonDescargar.setEnabled(true);
            var rpc = new qxnw.rpc(qxnw.userPolicies.getRpcUrl(), "master");
            var rta = rpc.exec("saveImageBase64", self.base64Img);
            if (rpc.isError()) {
                qxnw.utils.error(rpc.getError(), self);
                return;
            }
            if (rta) {
                self.__img = rta;
                self.fireDataEvent("saved_image", rta);
            }
        },
        getValue: function getValue() {
            if (this.__newVersion == false) {
                return this.__cameraOld.getValue();
            } else {
                if (this.__img != null) {
                    if (this.__img.indexOf("base64") != -1) {
                        this.saveImage(false);
                    }
                }
                return this.__img == null ? "" : this.__img;
            }
        },
        setValue: function setValue(val) {
            if (this.__newVersion == false) {
                if (this.__cameraOld !== null) {
                    this.__cameraOld.setValue(val);
                }
            } else {
                if (this.__img !== null) {
                    this.__img = val;
                }
            }
        },
        addImage: function addImage(val, simple) {
            var self = this;
            if (self.__newVersion == false) {
                self.__cameraOld.addImage(val, simple);
            } else {
                try {
                    self.__alterImageComposite.removeAll();
                    var img = new Image();
                    img.onload = function () {
                        var w = self.__canvas.height * (img.width / img.height);
                        self.__canvas.width = w;
                        var oc = document.createElement('canvas'), octx = oc.getContext('2d');
                        oc.width = self.getImageWidth();
                        oc.height = 195;
                        octx.drawImage(img, 0, 0, oc.width, oc.height);
                        self.__ctx.drawImage(oc, 0, 0, oc.width, oc.height, 0, 0, w, self.__canvas.height);
                        var imagRta = self.__canvas.toDataURL('image/png');
                        self.base64Img = imagRta;
                        self.__image = new qx.ui.basic.Image(imagRta).set({
                            minHeight: 195,
                            maxHeight: 195,
                            minWidth: self.getImageWidth(),
                            maxWidth: self.getImageWidth(),
                            scale: false
                        });
                        self.__img = val;
                        self.__alterImageComposite.add(self.__image, {
                            flex: 1
                        });

                        self.__buttonCut.setEnabled(true);
                        self.__buttonDescargar.setEnabled(true);
                    };
                    img.src = val;
                    self.setValue(val);
                } catch (e) {
                    console.log(e);
                }
            }
        },
        cut: function cut() {
            var self = this;
            var f = new qxnw.forms().set({
                showClose: false,
                showMinimize: false,
                showMaximize: false
            });

            f.setModal(true);
            f.setTitle(self.tr("Procesar imagen"));
            f.masterContainer.setLayout(new qx.ui.layout.Canvas());
            var img = new qx.ui.basic.Image(self.__img).set({
                cursor: "pointer"
            });
            f.img = img;
            f.isMousePressed = false;
            f.masterContainer.add(img, {
                left: 0,
                top: 20
            });

            var canvasCutDest = new qx.ui.core.Widget().set({
                width: self.getImageWidth(),
                height: self.getImageHeight(),
                backgroundColor: "white",
                cursor: "pointer"
            });
            var canvasCut = new qx.html.Canvas();
            f.canvasCut = canvasCut;
            canvasCut.setWidth(self.getImageWidth());
            canvasCut.setHeight(self.getImageHeight());
            f.contexto = canvasCut.getContext2d();
            canvasCutDest.getContentElement().add(canvasCut);

            var paint = false;
            var mbegin;
            var mend;
            f.alterCoordinates = {};

            function up() {
                paint = false;
            }
            function down(e) {
                mbegin = obtenerCoordenadas(e);
                paint = true;
            }
            function pintarCuadro(e) {
                if (paint) {
                    mend = obtenerBounds(e);
                    f.contexto.clearRect(0, 0, canvasCut.getWidth(), canvasCut.getHeight());
                    dibujarCuadro(e);
                }
            }
            function obtenerBounds(event) {
                var width;
                var height;

                width = (event.getDocumentLeft()) - mbegin.x;
                height = (event.getDocumentTop()) - mbegin.y;

                return {
                    w: width,
                    h: height
                };
            }
            function obtenerCoordenadas(event) {
                var posX;
                var posY;

                posX = event.getDocumentLeft();
                posY = event.getDocumentTop();

                return {
                    x: posX,
                    y: posY
                };
            }
            function dibujarCuadro() {
                var bounds = f.getBounds();
                f.x_coo = mbegin.x - bounds.left - 10;
                f.y_coo = mbegin.y - bounds.top - 55;
                f.contexto.fillStyle = "rgba(22,87,122,0.7)";
                f.contexto.fillRect(f.x_coo, f.y_coo, mend.w, mend.h);
            }
            canvasCutDest.addListener('mousedown', down, false);
            canvasCutDest.addListener('mouseup', up, false);
            canvasCutDest.addListener('mousemove', pintarCuadro, false);

            canvasCutDest.addListener("appear", function () {
                qx.bom.element.Style.set(this.getContentElement().getDomElement(), "opacity", "0.5");
            });
            f.masterContainer.add(canvasCutDest, {
                left: 0,
                top: 20
            });

            var lbl = new qx.ui.basic.Label(self.tr("<b>Seleccione una parte de la imagen</b><br />")).set({
                rich: true
            });
            f.masterContainer.add(lbl);
            f.createDeffectButtons();
            f.ui.cancel.addListener("execute", function () {
                f.close();
            });
            f.ui.accept.addListener("execute", function () {
                var img2 = document.createElement('img'); // Uso DOM HTMLImageElement
                img2.src = f.img.getSource();
                img2.width = self.getImageWidth();
                img2.height = self.getImageHeight();
                f.contexto.clearRect(0, 0, f.canvasCut.getWidth(), f.canvasCut.getHeight());
                if (typeof mend == "undefined") {
                    f.close();
                    img2 = null;
                    return;
                }
                f.canvasCut.setWidth(mend.w);
                f.canvasCut.setHeight(mend.h);
                f.contexto.drawImage(img2, f.x_coo, f.y_coo, mend.w, mend.h, 0, 0, mend.w, mend.h);
                var c = f.canvasCut.getCanvas();
                var imagRta = c.toDataURL('image/png');
                self.base64Img = imagRta;
                self.__image.setSource(imagRta);
                self.__img = imagRta;
                f.close();
                self.saveImage();
            });
            f.show();
        },
        snapshot: function snapshot() {
            var self = this;
            self.spacer.setWidth(0);
            self.spacer.setVisibility("excluded");
            self.__alterImageComposite.setVisibility("visible");
            if (self.__buttonCut) {
                self.__buttonCut.setEnabled(true);
            }
            var sound = new qx.bom.media.Audio("/nwlib" + qxnw.userPolicies.getNwlibVersion() + "/icons/camera_shutter_click.mp3");
            sound.play();
            if (self.__localMediaStream) {
                self.__ctx.drawImage(self.__video.getDomElement(), 0, 0, self.getImageWidth(), self.getImageHeight());
                self.__alterImageComposite.removeAll();
                self.__img = self.__canvas.toDataURL('image/png');
                self.stop();
                self.base64Img = self.__img;
                self.__image = new qx.ui.basic.Image(self.__img).set({
                    minHeight: self.getImageHeight(),
                    maxHeight: self.getImageHeight(),
                    minWidth: self.getImageWidth(),
                    maxWidth: self.getImageWidth(),
                    scale: false
                });
                self.__alterImageComposite.add(self.__image, {
                    flex: 1
                });
                var r = {};
                self.fireDataEvent("take_snapshot", r);
            }
        },
        getUserMedia: function getUserMedia(options, callback) {
            var self = this;
            navigator.genericGetUserMedia = (
                    navigator.getUserMedia ||
                    navigator.webkitGetUserMedia ||
                    navigator.mozGetUserMedia ||
                    navigator.msGetUserMedia
                    );
            navigator.genericGetUserMedia(options, callback, function (error) {
                if (typeof error.name != "undefined") {
                    switch (error.name) {
                        case "PermissionDeniedError":
                            qxnw.utils.information(self.tr("Permiso denegado a la cámara: para activarla vaya a la configuración del navegador"));
                            break;
                        case "PermissionDismissedError":
                            qxnw.utils.information(self.tr("Permiso denegado a la cámara: para activarla vaya a la configuración del navegador"));
                            break;
                        case "SecurityError":
                            qxnw.utils.information(self.tr("Permiso denegado a la cámara o no posee seguridad SSL: para activarla vaya a la configuración del navegador"));
                            break;
                        case "NotAllowedError":
                            qxnw.utils.information(self.tr("Permiso denegado a la cámara: para activarla vaya a la configuración del navegador"));
                            break;
                        case "DevicesNotFoundError":
                            qxnw.utils.information(self.tr("No posee una cámara instalada"));
                            break;
                        case "NotFoundError":
                            qxnw.utils.information(self.tr("No posee una cámara instalada"));
                            break;
                        case "NotReadableError":
                            qxnw.utils.information(self.tr("No posee una cámara instalada o no se puede leer"));
                            break;
                        case "Overconstrained":
                            qxnw.utils.information(self.tr("No posee una cámara instalada o no se puede leer"));
                            break;
                        default:
                            qxnw.utils.error(error.name);
                            break;
                    }
                    return;
                }
                qxnw.utils.information(error);
            });
        },
        getFlashBars: function getFlashBars(width, height, server_width, server_height) {
            if (this.__newVersion == false) {
                return this.__cameraOld.getFlashBars(width, height, server_width, server_height);
            } else {
                return this;
            }
        }
    }
});