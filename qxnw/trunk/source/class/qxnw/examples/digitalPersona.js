/* ************************************************************************
 
 Copyright:
 2015 Grupo NW S.A.S, http://www.gruponw.com
 
 License:
 LGPL: http://www.gnu.org/licenses/lgpl.html
 EPL: http://www.eclipse.org/org/documents/epl-v10.php
 See the LICENSE file in the project's top-level directory for details.
 
 Authors:
 * Andrés Flórez (andresf)
 * 
 * Class to test on andresf projects
 
 ************************************************************************ */
qx.Class.define("qxnw.examples.digitalPersona", {
    extend: qxnw.forms,
    construct: function construct() {
        this.base(arguments);
        var self = this;
        self.setTitle(self.tr("Captura biométrico Digital Persona :: QXNW "));
        var size = 530;
        self.set({
            maxWidth: size - 12,
            maxHeight: size,
            minWidth: size - 12,
            minHeight: size,
            showClose: false,
            showMinimize: false,
            showMaximize: false,
            resizable: false
        });
        var container1 = new qx.ui.container.Composite(new qx.ui.layout.HBox());
        self.masterContainer.add(container1);

        var containerImage = new qx.ui.container.Composite(new qx.ui.layout.HBox()).set({
            maxWidth: 490,
            maxHeight: 400
        });
        self.__containerImage = containerImage;
        containerImage.setBackgroundColor("white");
        self.masterContainer.add(containerImage, {
            flex: 1
        });

        var containerButtons = new qx.ui.container.Composite(new qx.ui.layout.HBox().set({
            alignX: "right"
        }));
        self.masterContainer.add(containerButtons);

        var fields = [
            {
                name: "devices",
                type: "selectBox",
                label: self.tr("Seleccione dispositivo")
            },
            {
                name: "quality",
                type: "textField",
                label: self.tr("Calidad muestra"),
                enabled: false
            },
            {
                name: "state",
                type: "label",
                label: self.tr("En espera..."),
                enabled: false
            }
        ];
        self.addFieldsByContainer(fields, container1);

        self.ui.state.set({
            alignY: "middle",
            alignX: "center"
        });
        self.ui.state.setMinWidth(200);
        self.ui.devices.setMinWidth(175);

        var buttons = [
            {
                name: "capture",
                type: "button",
                icon: qxnw.config.execIcon("fingerprint", "qxnw"),
                label: self.tr("Capturar huella")
            },
            {
                name: "clean",
                type: "button",
                icon: qxnw.config.execIcon("edit-clear"),
                label: self.tr("Limpiar")
            },
            {
                name: "accept",
                type: "button",
                icon: qxnw.config.execIcon("dialog-apply"),
                label: self.tr("Aceptar"),
                enabled: false
            },
            {
                name: "cancel",
                type: "button",
                icon: qxnw.config.execIcon("dialog-close"),
                label: self.tr("Cancelar")
            }
        ];
        self.addFieldsByContainer(buttons, containerButtons);

        self.ui.accept.addListener("execute", function () {
            self.accept();
        });
        self.ui.cancel.addListener("execute", function () {
            self.close();
        });

        var myVal = "";

        var currentFormat = Fingerprint.SampleFormat.PngImage;

        var FingerprintSdkTest = (function () {
            function FingerprintSdkTest() {
                this.operationToRestart = null;
                this.acquisitionStarted = false;
                this.sdk = new Fingerprint.WebApi;
                this.sdk.onDeviceConnected = function (e) {
                    self.setState("Pasa el dedo por favor");
                };
                this.sdk.onDeviceDisconnected = function (e) {
                    self.setState("Dispositivo desconectado");
                };
                this.sdk.onCommunicationFailed = function (e) {
                    self.setState("Fallo en la comunicación");
                };
                this.sdk.onSamplesAcquired = function (s) {
                    self.sampleAcquired(s);
                };
                this.sdk.onQualityReported = function (e) {
                    var q = "";
                    switch (e.quality) {
                        case 0:
                            q = self.tr("Excelente");
                            break;
                        case 1:
                            q = self.tr("Sin imagen");
                            break;
                        case 2:
                            q = self.tr("Mucha luz");
                            break;
                        case 3:
                            q = self.tr("Muy oscura");
                            break;
                        case 4:
                            q = self.tr("Borrosa");
                            break;
                        case 5:
                            q = self.tr("Bajo contraste");
                            break;
                        case 6:
                            q = self.tr("No es una muestra completa");
                            break;
                        case 7:
                            q = self.tr("No está en el centro");
                            break;
                        case 8:
                            q = self.tr("No es un dedo");
                            break;
                        case 9:
                            q = self.tr("Muy arriba");
                            break;
                        case 10:
                            q = self.tr("Muy abajo");
                            break;
                        case 11:
                            q = self.tr("Muy a la izquierda");
                            break;
                        case 12:
                            q = self.tr("Muy a la derecha");
                            break;
                        case 13:
                            q = self.tr("Muestra extraña");
                            break;
                        case 14:
                            q = self.tr("Muy rápido");
                            break;
                        case 15:
                            q = self.tr("Sesgada");
                            break;
                        case 16:
                            q = self.tr("Muy corta");
                            break;
                        case 17:
                            q = self.tr("Muy despacio");
                            break;
                        case 18:
                            q = self.tr("Movimiento inverso");
                            break;
                        case 19:
                            q = self.tr("Muy oprimido");
                            break;
                        case 20:
                            q = self.tr("Muy suave");
                            break;
                        case 21:
                            q = self.tr("Dedo húmedo");
                            break;
                        case 22:
                            q = self.tr("No parece un dedo");
                            break;
                        case 23:
                            q = self.tr("Muy pequeña");
                            break;
                        case 24:
                            q = self.tr("Girar más");
                            break;
                    }
                    self.ui.quality.setValue(q);
                };
            }

            FingerprintSdkTest.prototype.startCapture = function () {
                if (this.acquisitionStarted) {
                    return;
                }
                var _instance = this;
                this.operationToRestart = this.startCapture;
                this.sdk.startAcquisition(currentFormat, myVal).then(function () {
                    _instance.acquisitionStarted = true;
                }, function (error) {
                    qxnw.utils.information(error.message);
                });
            };
            FingerprintSdkTest.prototype.stopCapture = function () {
                if (!this.acquisitionStarted) {
                    return;
                }
                var _instance = this;
                this.sdk.stopAcquisition().then(function () {
                    _instance.acquisitionStarted = false;
                }, function (error) {
                    qxnw.utils.information(error.message);
                });
            };

            FingerprintSdkTest.prototype.getInfo = function () {
                return this.sdk.enumerateDevices();
            };

            FingerprintSdkTest.prototype.getDeviceInfoWithID = function (uid) {
                return  this.sdk.getDeviceInfo(uid);
            };

            return FingerprintSdkTest;
        })();

        var test = new FingerprintSdkTest();
        self.__sdk = test;

        var allReaders = test.getInfo();
        allReaders.then(function (sucessObj) {
            var d = {};
            for (var i = 0; i < sucessObj.length; i++) {
                d[sucessObj[i]] = sucessObj[i];
            }
            self.ui.devices.populateFromArray(d);
        }, function (error) {
            self.setState(error.message);
        });

        self.ui.capture.addListener("execute", function () {
            test.startCapture();
        });
        self.ui.clean.addListener("execute", function () {
            self.clearImage();
        });
        self.addListener("close", function () {
            self.__sdk.stopCapture();
            self.__sdk = null;
            self.sdk = null;
        });
    },
    destruct: function () {
        this.__rawData = null;
        this.__sdk = null;
        this.sdk = null;
    },
    members: {
        __sdk: null,
        __containerImage: null,
        __imageSample: null,
        __imageBase64: null,
        __rawData: null,
        getValue: function getValue() {
            return this.__rawData;
        },
        clearImage: function clearImage() {
            this.__containerImage.removeAll();
        },
        sampleAcquired: function sampleAcquired(s) {
            var self = this;
            qxnw.utils.loading(self.tr("Tomando muestra..."));
            var myVal = "";
            var rawFormat = Fingerprint.SampleFormat.Raw; //1
            var intermediateFormat = Fingerprint.SampleFormat.Intermediate; //2
            var alterFormat = Fingerprint.SampleFormat.Compressed; //3
            var pngFormat = Fingerprint.SampleFormat.PngImage; //5
            var samples = JSON.parse(s.samples);
            
            console.log(samples);
            
            var imageSrc = "";
            switch (s.sampleFormat) {
                case 1:
                    var sampleData = Fingerprint.b64UrlTo64(samples[0].Data);
                    var decodedData = JSON.parse(Fingerprint.b64UrlToUtf8(sampleData));
                    self.__rawData = Fingerprint.b64UrlTo64(decodedData.Data);
                    self.setState("¡Huella capturada RAW correctamente!", "blue");
                    self.__sdk.stopCapture();
                    self.ui.accept.setEnabled(true);
                    break;
                case 2:
                    var sampleData = Fingerprint.b64UrlTo64(samples[0].Data);
                    self.__rawData = sampleData;
                    self.setState("¡Huella capturada INTER correctamente!", "blue");
                    self.__sdk.stopCapture();
                    self.ui.accept.setEnabled(true);
                    break;
                case 3:
                    var sampleData = Fingerprint.b64UrlTo64(samples[0].Data);
                    var decodedData = JSON.parse(Fingerprint.b64UrlToUtf8(sampleData));
                    self.__rawData = "data:application/octet-stream;base64," + Fingerprint.b64UrlTo64(decodedData.Data);

                    self.__rawData = samples[0].Data;

                    self.setState("¡Huella capturada COM SAM correctamente!", "blue");
                    self.__sdk.stopCapture();
                    self.ui.accept.setEnabled(true);
                    break;
                case 5:
                    imageSrc = "data:image/png;base64," + Fingerprint.b64UrlTo64(samples[0]);
                    self.__rawData = imageSrc;
                    self.__imageSample = new qx.ui.basic.Image(imageSrc).set({
                        allowGrowX: false,
                        allowGrowY: false,
                        scale: true
                    });
                    self.__containerImage.add(self.__imageSample);
                    var closeTimeOut = new qx.event.Timer(2000);
                    closeTimeOut.start();
                    closeTimeOut.addListener("interval", function (e) {
                        this.stop();
                        self.ui.quality.setValue("");
                        self.__sdk.sdk.startAcquisition(intermediateFormat, myVal).then(function () {
                        }, function (error) {
                            qxnw.utils.information(error.message);
                        });
                    });
                    self.setState("¡Imagen capturada correctamente!", "blue");
                    break;
            }
            qxnw.utils.stopLoading();
        },
        setState: function setState(msg, color) {
            if (typeof color == 'undefined') {
                color = "red";
            }
            var v = "<font color='" + color + "' style='font-size: 26px; padding-top: 10px'><b>" + msg + "</b></font>";
            if (this.ui.state != null) {
                this.ui.state.setValue(v);
            }
        }
    }
});