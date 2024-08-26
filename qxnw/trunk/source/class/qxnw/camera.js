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
qx.Class.define("qxnw.camera", {
    extend: qx.ui.container.Composite,
    include: [qx.locale.MTranslation],
    construct: function (height, width, mode) {
        var self = this;
        this.base(arguments);
        self.classname = "qxnw.camera";
        this.__baseLayout = new qx.ui.layout.HBox();
        this.setLayout(this.__baseLayout);

        this.setMinHeight(200);
        this.setMaxHeight(200);

        this.__newVersion = qxnw.utils.hasGetUserMedia();
        if (window.location.protocol != "https:") {
            this.__newVersion = false;
            var labelInformation = new qx.ui.basic.Label(self.tr("<br /><br /><br /><font color='gray'>Cámara no soportada. Debe estar en un ambiente seguro HTTPS y en un navegador compatible<br /><br /><br /></font>")).set({
                rich: true,
                alignX: 'center',
                alignY: 'middle'
            });
            self.add(labelInformation);
            return;
        }

        if (typeof mode != 'undefined' && mode == "simple") {
            this.__camera = new qxnw.widgets.camera(height, width);
            this.add(this.__camera);
        } else {
            this.startCamera();
        }

        self.__canvas = document.createElement("canvas");
        self.__canvas.width = 260;
        self.__canvas.height = 195;
        self.__ctx = self.__canvas.getContext('2d');

        self.__settedChange = false;
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
        "saved_image": "qx.event.type.Data"
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
        __normalHeight: 195,
        __normalWidth: 260,
        __buttonDescargar: null,
        __required: false,
        __invalidMessage: null,
        id_listener: null,
        popup: null,
        base64Img: null,
        __buttonSnapshot: null,
        __uploader: null,
        __selectDevices: null,
        __settedChange: false,
        __selectedDevices: false,
        __stream: null,
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
                if (this.__cameraOld !== null) {
                    this.__cameraOld.setValid(bool);
                }
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
                if (this.__cameraOld !== null) {
                    if (typeof this.__cameraOld.setInvalidMessage !== 'undefined') {
                        this.__cameraOld.setInvalidMessage(val);
                    }
                }
            } else {
                this.__invalidMessage = val;
            }
        },
        setRequired: function setRequired(val) {
            if (this.__newVersion == false) {
                if (this.__cameraOld !== null) {
                    this.__cameraOld.setRequired(val);
                }
            } else {
                this.__required = val;
            }
        },
        startCamera: function startCamera() {
            var self = this;
            var css = {
                width: 260,
                height: 195
            };
            var arrbtRemote = {
                autoPlay: true,
                width: 260,
                muted: true
            };

            self.__video = new qx.html.Element("video", css, arrbtRemote);
            self.addListener("appear", function () {
                self.getContentElement().add(self.__video);
            });

            var options = {video: true};

            if (typeof navigator.mediaDevices == 'undefined') {
                qxnw.utils.information(self.tr("Cámara no soportada. Debe estar en un ambiente seguro HTTPS y en un navegador compatible"));
            } else {
                navigator.mediaDevices.addEventListener('devicechange', function () {
                    qxnw.utils.loading(self.tr("Detectando cambios en los dispositivos..."));
                    self.__selectDevices.removeAll();
                    var timer = new qx.event.Timer(2000);
                    timer.start();
                    timer.addListener("interval", function (e) {
                        this.stop();
                        self.populateDevices();
                        qxnw.utils.stopLoading();
                    });
                });
            }

            self.changeVideoStream(options);

            self.add(new qx.ui.core.Spacer(270));

            self.createRightInterface();
        },
        populateDevices: function populateDevices() {
            var self = this;
            var count = 0;
            var videoSource = null;
            try {
                videoSource = qxnw.local.getData("nw_camera_video");
            } catch (e) {
                qxnw.local.setData("nw_camera_video", null);
            }
            if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
                console.log("enumerateDevices() not supported");
            } else {
                navigator.mediaDevices.enumerateDevices().then(function (devices) {
                    var data = {};
                    var videoExists = false;
                    devices.forEach(function (device) {
                        if (device.kind == "videoinput") {
                            data[device.deviceId] = device.label;
                            if (videoSource != null && videoSource != "undefined") {
                                if (videoSource == device.deviceId) {
                                    videoExists = videoSource;
                                }
                            }
                            count++;
                        }
                    });
                    if (count >= 1) {
                        qxnw.utils.populateSelectFromArray(self.__selectDevices, data);
                        self.__selectDevices.setEnabled(true);
                    } else {
                        self.__selectDevices.setEnabled(false);
                    }

                    if (self.__settedChange == false) {
                        self.__selectDevices.addListener("changeSelection", function () {
                            var val = this.getValue();
                            var videoSource = val.model;
                            var options = {video: {deviceId: videoSource ? {exact: videoSource} : undefined}};
                            qxnw.local.setData("nw_camera_video", videoSource);
                            self.changeVideoStream(options);
                        });
                        self.__settedChange = true;
                    }

                    if (videoExists != false) {
                        self.__selectDevices.setValue(videoExists);
                    }

                })["catch"]();
            }
        },
        changeVideoStream: function changeVideoStream(options) {
            var self = this;

            if (self.__stream != null) {
                try {
                    var mediaStreamTracks = self.__stream.getTracks();
                    for (var i = 0; i < mediaStreamTracks.length; i++) {
                        mediaStreamTracks[i].stop();
                    }
                } catch (e) {
                    console.log("Error CAMERA");
                    console.log(e);
                }
            }

            if (typeof navigator.mediaDevices == 'undefined') {
                qxnw.utils.information(self.tr("Cámara no soportada. Debe estar en un ambiente seguro HTTPS y en un navegador compatible"));
            } else {
                navigator.mediaDevices.getUserMedia(options)
                        .then(function (stream) {
                            self.__stream = stream;
                            if (self.__selectedDevices == false) {
                                self.populateDevices();
                                self.__selectedDevices = true;
                            }

                            var vid = self.__video.getDomElement();
                            try {
                                vid.srcObject = stream;
                            } catch (error) {
                                vid.src = (window.URL || window.webkitURL).createObjectURL(stream);
                            }
                            self.__localMediaStream = stream;
                        })["catch"](function (error) {
                    if (typeof error.name != "undefined") {
                        switch (error.name) {
                            case "PermissionDeniedError":
                                qxnw.utils.information(self.tr("Permiso denegado a la cámara: para activarla vaya a la configuración del navegador"));
                                break;
                            case "PermissionDismissedError":
                                qxnw.utils.information(self.tr("Permiso denegado a la cámara: para activarla vaya a la configuración del navegador"));
                                break;
                            case "SecurityError":
                                qxnw.utils.information(self.tr("Permiso denegado a la cámara: para activarla vaya a la configuración del navegador"));
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
            }

            self.getUserMedia(options, function (stream) {

                if (self.__selectedDevices == false) {
                    self.populateDevices();
                    self.__selectedDevices = true;
                }

                var vid = self.__video.getDomElement();
                try {
                    vid.srcObject = stream;
                } catch (error) {
                    vid.src = (window.URL || window.webkitURL).createObjectURL(stream);
                }
                self.__localMediaStream = stream;
            });

        },
        clean: function clean() {
//            this.__alterImageComposite.removeAll();
//            this.createRightInterface(false);
            if (this.__newVersion == false) {
//                this.__cameraOld.reset();
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
                    minWidth: 260,
                    maxWidth: 260,
                    minHeight: 195,
                    maxHeight: 195
                });
                qxnw.utils.addBorder(self.__alterImageComposite, "black", 1);
            }

            var labelInformation = new qx.ui.basic.Label(self.tr("<br /><br /><br /><font color='gray'>Espacio para procesar \n\la imagen<br /><br /><br /></font>")).set({
                rich: true,
                alignX: 'center',
                alignY: 'middle'
            });
            self.__alterImageComposite.add(labelInformation);
            var labelInformation1 = new qx.ui.basic.Label(self.tr("<b style='color: red;'>Recuerde CONFIRMAR la imagen cuando esté lista</b>")).set({
                rich: true,
                alignX: 'center',
                alignY: 'middle'
            });
            self.__alterImageComposite.add(labelInformation1);

            if (typeof noCreate == 'undefined') {
                self.add(self.__alterImageComposite, {
                    flex: 1
                });
                self.createButtonsInterface();
            }
        },
        createButtonsInterface: function createButtonsInterface() {
            var self = this;
            var alterButtonsComposite = new qx.ui.container.Composite(new qx.ui.layout.VBox()).set({
                minWidth: 100,
                maxWidth: 100
            });

            var buttonSnapshot = new qxnw.widgets.button(self.tr("Disparar")).set({
                maxHeight: 50,
                maxWidth: 300
            });
            self.__buttonSnapshot = buttonSnapshot;
            buttonSnapshot.setIcon(qxnw.config.execIcon("camera-web", "devices"));
            alterButtonsComposite.add(buttonSnapshot, {
                flex: 0
            });
            buttonSnapshot.addListener("execute", function () {
                self.snapshot();
            });

            var uploader = new qxnw.uploader(false, true);
            self.__uploader = uploader;
            uploader.addListener("completed", function (r) {
                self.addImage(r.getData());
            });
            uploader.getContainer().set({
                maxHeight: 50,
                maxWidth: 300
            });
            uploader.showResponse(false);
            var buttonUpload = uploader.getButton().set({
                maxHeight: 50,
                maxWidth: 100,
                minWidth: 100
            });
            self.__buttonUpload = buttonUpload;
            buttonUpload.setIcon(qxnw.config.execIcon("insert-image"));
            buttonUpload.setLabel(self.tr("Subir desde PC"));
            alterButtonsComposite.add(uploader.getContainer(), {
                flex: 0
            });

            var buttonCut = new qxnw.widgets.button(self.tr("Cortar")).set({
                maxHeight: 50,
                maxWidth: 300
            });
            self.__buttonCut = buttonCut;
            buttonCut.setIcon(qxnw.config.execIcon("edit-cut"));
            alterButtonsComposite.add(buttonCut, {
                flex: 0
            });
            buttonCut.addListener("execute", function () {
                self.cut();
            });
            buttonCut.setEnabled(false);

            var buttonGuardar = new qxnw.widgets.button(self.tr("Confirmar")).set({
                maxHeight: 50,
                maxWidth: 300
            });
            self.__buttonGuardar = buttonGuardar;
            buttonGuardar.setEnabled(false);
            buttonGuardar.setIcon(qxnw.config.execIcon("dialog-apply"));
            alterButtonsComposite.add(buttonGuardar, {
                flex: 0
            });
            buttonGuardar.addListener("execute", function () {
                self.saveImage();
            });

            var buttonDescargar = new qxnw.widgets.button(self.tr("Descargar")).set({
                maxHeight: 50,
                maxWidth: 300
            });
            self.__buttonDescargar = buttonDescargar;
            buttonDescargar.setIcon(qxnw.config.execIcon("document-save"));
            alterButtonsComposite.add(buttonDescargar, {
                flex: 0
            });
            buttonDescargar.addListener("execute", function () {
                self.downloadImage();
            });
            buttonDescargar.setEnabled(false);

            var selectDevices = new qxnw.fields.selectBox().set({
                maxHeight: 20,
                maxWidth: 300
            });
            self.__selectDevices = selectDevices;
            alterButtonsComposite.add(selectDevices, {
                flex: 0
            });
            selectDevices.setEnabled(true);

            var buttonClean = new qxnw.widgets.button(self.tr("Limpiar")).set({
                maxHeight: 50,
                maxWidth: 300
            });
            self.__buttonClean = buttonClean;
            buttonClean.setIcon(qxnw.config.execIcon("dialog-close"));
            alterButtonsComposite.add(buttonClean, {
                flex: 0
            });
            buttonClean.addListener("execute", function () {
                self.__alterImageComposite.removeAll();
                self.createRightInterface(true);
                self.__buttonCut.setEnabled(false);
                self.__buttonDescargar.setEnabled(false);
                self.__img = null;
            });

            self.add(alterButtonsComposite, {
                flex: 1
            });
        },
        downloadImage: function downloadImage() {
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
                return null;
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
                this.__img = val;
            }
        },
        addImage: function addImage(val, simple) {
            var self = this;
            if (self.__newVersion == false) {
                if (self.__cameraOld !== null) {
                    self.__cameraOld.addImage(val, simple);
                }
            } else {
                try {
                    self.__alterImageComposite.removeAll();
                    var img = new Image();
                    img.onload = function () {
                        var w = self.__canvas.height * (img.width / img.height);
                        self.__canvas.width = w;
                        var oc = document.createElement('canvas'), octx = oc.getContext('2d');
                        oc.width = 260;
                        oc.height = 195;
                        octx.drawImage(img, 0, 0, oc.width, oc.height);
                        self.__ctx.drawImage(oc, 0, 0, oc.width, oc.height, 0, 0, w, self.__canvas.height);
                        var imagRta = self.__canvas.toDataURL('image/png');
                        self.base64Img = imagRta;
                        self.__image = new qx.ui.basic.Image(imagRta).set({
                            minHeight: 195,
                            maxHeight: 195,
                            minWidth: 260,
                            maxWidth: 260,
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

//                maxWidth: 290,
//                maxHeight: 300,
//                minWidth: 290,
//                minHeight: 300
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
                width: 260,
                height: 195,
                backgroundColor: "white",
                cursor: "pointer"
            });
            var canvasCut = new qx.html.Canvas();
            f.canvasCut = canvasCut;
            canvasCut.setWidth(260);
            canvasCut.setHeight(195);
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
                img2.width = 260;
                img2.height = 195;
                f.contexto.clearRect(0, 0, f.canvasCut.getWidth(), f.canvasCut.getHeight());
                f.canvasCut.setWidth(mend.w);
                f.canvasCut.setHeight(mend.h);
                f.contexto.drawImage(img2, f.x_coo, f.y_coo, mend.w, mend.h, 0, 0, mend.w, mend.h);
                var c = f.canvasCut.getCanvas();
                var imagRta = c.toDataURL('image/png');
                self.base64Img = imagRta;
                self.__image.setSource(imagRta);
                self.__img = imagRta;
                f.close();
            });
            f.show();
        },
        snapshot: function snapshot() {
            var self = this;
            self.__buttonCut.setEnabled(true);
            var sound = new qx.bom.media.Audio("/nwlib" + qxnw.userPolicies.getNwlibVersion() + "/icons/camera_shutter_click.mp3");
            sound.play();
            if (self.__localMediaStream) {
                self.__ctx.drawImage(self.__video.getDomElement(), 0, 0, self.__normalWidth, self.__normalHeight);
                self.__alterImageComposite.removeAll();
                self.__img = self.__canvas.toDataURL('image/png');
                self.base64Img = self.__img;
                self.__image = new qx.ui.basic.Image(self.__img).set({
                    minHeight: 195,
                    maxHeight: 195,
                    minWidth: 260,
                    maxWidth: 260,
                    scale: false
                });
                self.__alterImageComposite.add(self.__image, {
                    flex: 1
                });
            }
            self.__buttonGuardar.setEnabled(true);
        },
        getUserMedia: function getUserMedia(options, callback) {
            var self = this;
//            navigator.genericGetUserMedia = (
//                    navigator.mediaDevices.getUserMedia ||
//                    navigator.getUserMedia ||
//                    navigator.webkitGetUserMedia ||
//                    navigator.mozGetUserMedia ||
//                    navigator.msGetUserMedia
//                    );
//            navigator.mediaDevices.getUserMedia(options).then(callback).catch(
////            navigator.mediaDevices.getUserMedia(options, callback, function (error) {
//
//                    console.log("ERROR!");
//                    console.log(error);
//            if (typeof error.name != "undefined") {
//                switch (error.name) {
//                    case "PermissionDeniedError":
//                        qxnw.utils.information(self.tr("Permiso denegado a la cámara: para activarla vaya a la configuración del navegador"));
//                        break;
//                    case "PermissionDismissedError":
//                        qxnw.utils.information(self.tr("Permiso denegado a la cámara: para activarla vaya a la configuración del navegador"));
//                        break;
//                    case "SecurityError":
//                        qxnw.utils.information(self.tr("Permiso denegado a la cámara: para activarla vaya a la configuración del navegador"));
//                        break;
//                    case "NotAllowedError":
//                        qxnw.utils.information(self.tr("Permiso denegado a la cámara: para activarla vaya a la configuración del navegador"));
//                        break;
//                    case "DevicesNotFoundError":
//                        qxnw.utils.information(self.tr("No posee una cámara instalada"));
//                        break;
//                    case "NotFoundError":
//                        qxnw.utils.information(self.tr("No posee una cámara instalada"));
//                        break;
//                    case "NotReadableError":
//                        qxnw.utils.information(self.tr("No posee una cámara instalada o no se puede leer"));
//                        break;
//                    case "Overconstrained":
//                        qxnw.utils.information(self.tr("No posee una cámara instalada o no se puede leer"));
//                        break;
//                    default:
//                        qxnw.utils.error(error.name);
//                        break;
//                }
//
//                return;
//            }
//            qxnw.utils.information(error);
//                    );
        }
    }
});