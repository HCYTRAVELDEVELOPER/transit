qx.Class.define("qxnw.widgets.signer", {
    extend: qx.ui.core.Widget,
    construct: function construct() {
        this.base(arguments);
        this.createInterface();
        document.getElementsByTagName("head")[0].setAttribute("runat", "server");
    },
    members: {
        lblSO: null,
        signButton: null,
        containerSelections: null,
        containerImage: null,
        translate_address: true,
        canvasObj: null,
        rawData: null,
        imageData: null,
        maxHeightCanvas: 150,
        maxWidthCanvas: 300,
        __required: false,
        __invalidMessage: "",
        __valid: true,
        popup: null,
        id_listener: null,
        createInterface: function createInterface() {
            var self = this;
            var layout = new qx.ui.layout.VBox();
            this._setLayout(layout);
            layout.setAlignY("middle");
            layout.setAlignX("left");
            layout.setSpacing(5);
            self.setAppearance("textfield");
            self.setMaxHeight(self.maxHeightCanvas);
            var canvasCheckBox = new qx.ui.form.RadioButton(self.tr("Nativo"));
            canvasCheckBox.setModel("NATIVO");
            canvasCheckBox.addListener("execute", function () {
                var model = this.getModel();
                qxnw.local.setData("nw_signer_device", model);
                self.validateSO(model);
            });
            var epadLinkCheckBox = new qx.ui.form.RadioButton(self.tr("EpadLink"));
            epadLinkCheckBox.setModel("EPADLINK");
            epadLinkCheckBox.addListener("execute", function () {
                var model = this.getModel();
                qxnw.local.setData("nw_signer_device", model);
                self.validateSO(model);
            });
            var topazCheckBox = new qx.ui.form.RadioButton(self.tr("Topaz"));
            topazCheckBox.setModel("TOPAZ");
            topazCheckBox.addListener("execute", function () {
                var model = this.getModel();
                qxnw.local.setData("nw_signer_device", model);
                self.validateSO(model);
            });
            var checkRadioGroup = new qx.ui.form.RadioGroup();
            checkRadioGroup.add(canvasCheckBox);
            checkRadioGroup.add(epadLinkCheckBox);
            checkRadioGroup.add(topazCheckBox);

            var containerOptions = new qx.ui.container.Composite(new qx.ui.layout.HBox());
            var containerIcon = new qx.ui.container.Composite(new qx.ui.layout.HBox());
            var containerLabel = new qx.ui.container.Composite(new qx.ui.layout.HBox());
            var lbl = new qx.ui.basic.Label(self.tr("Seleccione la tecnología de captura:")).set({
                rich: true
            });
            containerIcon.getLayout().set({
                alignX: "right"
            });
            self.optionsButton = new qx.ui.form.Button("", qxnw.config.execIcon("system-run")).set({
                show: "icon"
            });
            self.optionsButton.addListener("execute", function (e) {
                self.openOptions(this);
            });
            containerIcon.add(self.optionsButton);
            containerLabel.add(lbl);

            containerOptions.add(containerLabel);
            containerOptions.add(containerIcon, {
                flex: 1
            });
            self._add(containerOptions);

            var containerRadios = new qx.ui.container.Composite(new qx.ui.layout.HBox());
            containerRadios.add(canvasCheckBox);
            containerRadios.add(epadLinkCheckBox);
            containerRadios.add(topazCheckBox);
            self._add(containerRadios);
            var checkSelected = qxnw.local.getData("nw_signer_device");
            switch (checkSelected) {
                case "NATIVO":
                    canvasCheckBox.setValue(true);
                    break;
                case "TOPAZ":
                    topazCheckBox.setValue(true);
                    break;
                case "EPADLINK":
                    epadLinkCheckBox.setValue(true);
                    break;
                default:

                    break;
            }

            self.containerSelections = new qx.ui.container.Composite(new qx.ui.layout.HBox());
            self.signButton = new qx.ui.form.Button(self.tr("Firmar"), qxnw.config.execIcon("format-text-direction-ltr"));
            self.containerSelections.add(self.signButton);
            self._add(self.containerSelections);

            self.signButton.addListener("click", function (e) {
                self.sign();
            });

            self.containerImage = new qx.ui.container.Composite(new qx.ui.layout.HBox()).set({
                maxWidth: self.maxWidthCanvas,
                maxHeight: self.maxHeightCanvas
            });
            qxnw.utils.addBorder(self.containerImage, "black", 1);
            self.canvasObj = new qx.ui.embed.Canvas().set({
                syncDimension: false
            });
            self.canvasObj.setCanvasHeight(100);
            self.canvasObj.setCanvasWidth(300);
            self.containerImage.add(self.canvasObj, {
                flex: 1
            });

            self._add(self.containerImage);
            self.validateSO(checkSelected);
        },
        openOptions: function openOptions(e) {
            var self = this;
            var popup = new qx.ui.popup.Popup(new qx.ui.layout.HBox());
            var optionsContainer = new qx.ui.container.Composite(new qx.ui.layout.VBox());
            var extEpadAtom = new qx.ui.form.Button(self.tr("Extensión EpadLink")).set({
                rich: true
            });
            extEpadAtom.addListener("execute", function () {
                window.open("https://chrome.google.com/webstore/detail/epadlink-sigcaptureweb-sd/idldbjenlmipmpigmfamdlfifkkeaplc", "_blank");
            });
            optionsContainer.add(extEpadAtom);
            var topazAtom = new qx.ui.form.Button(self.tr("Extensión Topaz"));
            optionsContainer.add(topazAtom);
            topazAtom.addListener("execute", function () {
                window.open("https://chrome.google.com/webstore/detail/topaz-sigplusextlite-exte/dhcpobccjkdnmibckgpejmbpmpembgco", "_blank");
            });
            popup.add(optionsContainer, {
                flex: 1
            });
            popup.placeToWidget(e);
            popup.show();
        },
        validateSO: function validateSO(model) {
            var self = this;
            var os = "ALL";
            if (qx.core.Environment.get("os.name") !== "win") {
                os = "LINUX";
            }
            if (self.lblSO !== null) {
                self.lblSO.destroy();
            }
            switch (model) {
                case "TOPAZ":
                    if (os !== "ALL") {
                        self.signButton.setEnabled(false);
                        self.lblSO = new qx.ui.basic.Label(self.tr("<font color='gray'>Sólo disponible para Windows</font>")).set({
                            rich: true
                        });
                        self.containerSelections.add(self.lblSO);
                    }
                    break;
                case "EPADLINK":
                    if (os !== "ALL") {
                        self.signButton.setEnabled(false);
                        self.lblSO = new qx.ui.basic.Label(self.tr("<font color='gray'>Sólo disponible para Windows</font>")).set({
                            rich: true
                        });
                        self.containerSelections.add(self.lblSO);
                    }
                    break;
                default:
                    self.signButton.setEnabled(true);
                    break;
            }
        },
        openImageWriter: function openImageWriter() {
            var self = this;
            var f = new qxnw.forms().set({
                showClose: false,
                showMinimize: false,
                showMaximize: false
            });

            f.setResizable(false);
            f.setInvalidateStore(true);
            f.setModal(true);
            f.setTitle(f.tr("Espacio de dibujo :: QXNW"));
            f.setWidth(700);
            f.setHeight(400);
            var canvas = new qx.ui.embed.Canvas().set({
                canvasWidth: 700,
                canvasHeight: 400,
                syncDimension: true
            });

            self.canvas = canvas;

            f.masterContainer.add(canvas, {
                flex: 1
            });

            f.createDeffectButtons();

            f.ui.accept.addListener("execute", function () {
                self.signNative();
                f.close();
            });

            f.ui.cancel.addListener("execute", function () {
                f.close();
            });

            canvas.addListener("appear", function () {
                ctx = canvas.getContext2d();
                var el = this.getContentElement().getDomElement();
                self.canvasMain = el;

                el.addEventListener("pointerdown", function (e) {
                    findxy('down', e);
                }, false);

                el.addEventListener("pointermove", function (e) {
                    findxy('move', e);
                }, false);

                el.addEventListener("pointerup", function (e) {
                    findxy('up', e);
                }, false);

                el.addEventListener("pointerout", function (e) {
                    findxy('out', e);
                }, false);

                el.addEventListener("mousedown", function (e) {
                    findxy('down', e);
                }, false);

                el.addEventListener("mousemove", function (e) {
                    findxy('move', e);
                }, false);

                el.addEventListener("mouseup", function (e) {
                    findxy('up', e);
                }, false);
                el.addEventListener("mouseout", function (e) {
                    findxy('out', e);
                }, false);
            });


            var ctx;

            var flag = false,
                    prevX = 0,
                    currX = 0,
                    prevY = 0,
                    currY = 0,
                    dot_flag = false;

            var y = 2;

            function draw() {
                ctx.beginPath();
                setCoordinates(prevX, prevY, currX, currY);
                ctx.moveTo(prevX, prevY);
                ctx.lineTo(currX, currY);

                var c = self.colorSelectBox.getValue();

                ctx.strokeStyle = c.model;
                ctx.lineWidth = y;
                ctx.stroke();
                ctx.closePath();
            }

            function setCoordinates(prevX, prevY, currX, currY) {
                var txt = "X: ";
                txt += prevX;
                txt += ", Y: ";
                txt += prevY;
                f.coordinatesLabel.setValue(txt);
            }

            function findxy(res, e) {

                var b = f.getBounds();
                var desv = 30;

                if (res == 'down') {
                    prevX = currX;
                    prevY = currY;
                    currX = e.clientX - b.left;
                    currY = e.clientY - (b.top + desv);

                    flag = true;
                    dot_flag = true;
                    if (dot_flag) {
                        ctx.beginPath();

                        var c = self.colorSelectBox.getValue();

                        ctx.fillStyle = c.model;
                        ctx.fillRect(currX, currY, 2, 2);
                        ctx.closePath();
                        dot_flag = false;
                    }
                }
                if (res == 'up' || res == "out") {
                    flag = false;
                }
                if (res == 'move') {
                    if (flag) {
                        prevX = currX;
                        prevY = currY;
                        currX = e.clientX - b.left;
                        currY = e.clientY - (b.top + desv);
                        draw();
                    }
                }
            }

            var lay = new qx.ui.layout.HBox();
            var cont = new qx.ui.container.Composite(lay);

            var line = new qx.ui.basic.Label("<hr/>").set({
                rich: true,
                width: 700
            });
            cont.add(line, {
                flex: 1
            });

            self.colorSelectBox = new qxnw.fields.selectBox();

            var d = {};
            d["black"] = "Negro";
            d["blue"] = "Azul";
            d["red"] = "Rojo";
            d["green"] = "Verde";
            qxnw.utils.populateSelectFromArray(self.colorSelectBox, d);
            cont.add(self.colorSelectBox);

            var button = new qx.ui.form.Button(f.tr("Limpiar"));
            button.setIcon(qxnw.config.execIcon("view-refresh"));
            button.addListener("execute", function () {
                var b = self.canvas.getBounds();
                ctx.clearRect(0, 0, b.width, b.height);
                f.coordinatesLabel.setValue(f.tr("Coordenadas de trazo..."));
            });
            cont.add(button);

            f.masterContainer.add(cont);

            f.coordinatesLabel = new qx.ui.basic.Label(f.tr("Coordenadas de trazo..."));
            f.masterContainer.add(f.coordinatesLabel);

            f.show();
            f.center;
            f.center();
        },
        signNative: function signNative() {
            var self = this;
            var imgWidth = self.canvasObj.getCanvasWidth();
            var imgHeight = self.canvasObj.getCanvasHeight();
            var canvasObj = self.canvasObj;

            var ctx = canvasObj.getContext2d();

            var img = new Image();
            img.onload = function () {
                ctx.clearRect(0, 0, imgWidth, imgHeight);
                ctx.drawImage(img, 0, 0, imgWidth, imgHeight);
            };
            var dataUrl = self.canvasMain.toDataURL();
            img.src = dataUrl;
            dataUrl = dataUrl.replace("data:image/png;base64,", "");
            self.rawData = dataUrl;
            self.imageData = dataUrl;
        },
        signTopaz: function signTopaz() {
            var self = this;
            var isInstalled = document.documentElement.getAttribute('SigPlusExtLiteExtension-installed');
            if (!isInstalled) {
                alert("SigPlusExtLite extension is either not installed or disabled. Please install or enable extension.");
                return;
            }
            var imgWidthCanva = self.canvasObj.getCanvasWidth();
            var imgWidth = imgWidthCanva;
            var imgHeightCanva = self.canvasObj.getCanvasHeight();
            var imgHeight = imgHeightCanva;
            var canvasObj = self.canvasObj;
            var message = {"firstName": "", "lastName": "", "eMail": "", "location": "", "imageFormat": 1, "imageX": imgWidth, "imageY": imgHeight, "imageTransparency": false, "imageScaling": false, "maxUpScalePercent": 0.0, "rawDataFormat": "ENC", "minSigPoints": 25};
            document.addEventListener('SignResponse', function (event) {
                var str = event.target.getAttribute("msgAttribute");
                var objResponse = JSON.parse(str);
                var obj = JSON.parse(JSON.stringify(objResponse));
                var ctx = canvasObj.getContext2d();
                if (obj.errorMsg != null && obj.errorMsg != "" && obj.errorMsg != "undefined") {
                    alert(obj.errorMsg);
                } else {
                    if (obj.isSigned) {
                        self.rawData = obj.rawData;
                        self.imageData = obj.imageData;
                        var img = new Image();
                        img.onload = function () {
                            ctx.drawImage(img, 0, 0, imgWidth, imgHeight);
                        };
                        img.src = "data:image/png;base64," + obj.imageData;
                    }
                }
            }, false);
            var messageData = JSON.stringify(message);
            var element = document.createElement("MyExtensionDataElement");
            element.setAttribute("messageAttribute", messageData);
            document.documentElement.appendChild(element);
            var evt = document.createEvent("Events");
            evt.initEvent("SignStartEvent", true, false);
            element.dispatchEvent(evt);
        },
        sign: function sign() {
            var self = this;
            var checkSelected = qxnw.local.getData("nw_signer_device");
            console.log(checkSelected);
            switch (checkSelected) {
                case "NATIVO":
                    self.openImageWriter();
                    break;
                case "TOPAZ":
                    self.signTopaz();
                    break;
                case "EPADLINK":
                    self.imgWidth = self.canvasObj.getCanvasWidth();
                    var imgWidth = self.imgWidth;
                    self.imgHeight = self.canvasObj.getCanvasHeight();
                    var imgHeight = self.imgHeight;
                    var canvasObj = self.canvasObj;
                    var message = {"firstName": "", "lastName": "", "eMail": "", "location": "", "imageFormat": 1, "imageX": self.imgWidth, "imageY": self.imgHeight, "imageTransparency": false, "imageScaling": false, "maxUpScalePercent": 0.0, "rawDataFormat": "ENC", "minSigPoints": 25, "penThickness": 3, "penColor": "#000000"};
                    document.addEventListener('SigCaptureWeb_SignResponse', function cb(event) {
                        var str = event.target.getAttribute("SigCaptureWeb_msgAttri");
                        var objResponse = JSON.parse(str);
                        var obj = JSON.parse(JSON.stringify(objResponse));
                        var ctx = canvasObj.getContext2d();
                        if (obj.errorMsg != null && obj.errorMsg != "" && obj.errorMsg != "undefined") {
                            alert(obj.errorMsg);
                        } else {
                            if (obj.isSigned) {
                                self.rawData = obj.rawData;
                                self.imageData = obj.imageData;
                                var img = new Image();
                                img.onload = function () {
                                    ctx.drawImage(img, 0, 0, imgWidth, imgHeight);
                                };
                                img.src = "data:image/png;base64," + obj.imageData;
                            }
                        }
                    }, {once: true});
                    var messageData = JSON.stringify(message);
                    var element = document.createElement("SigCaptureWeb_ExtnDataElem");
                    element.setAttribute("SigCaptureWeb_MsgAttribute", messageData);
                    document.documentElement.appendChild(element);
                    var evt = document.createEvent("Events");
                    evt.initEvent("SigCaptureWeb_SignStartEvent", true, false);
                    element.dispatchEvent(evt);
                    break;
                default:
                    self.openImageWriter();
                    break;
            }
        },
        setRawData: function setRawData(value) {
            this.rawData = value;
        },
        clean: function clean() {
            var self = this;
            var ctx = self.canvasObj.getContext2d();
            ctx.clearRect(0, 0, 300, 100);
            self.rawData = "";
            self.imageData = "";
        },
        setRequired: function setRequired(required) {
            this.__required = required;
        },
        setInvalidMessage: function setInvalidMessage(message) {
            this.__invalidMessage = message;
        },
        getInvalidMessage: function getInvalidMessage(message) {
            return this.__invalidMessage;
        },
        getValid: function getValid() {
            return this.__valid;
        },
        setValid: function setValid(bool) {
            var self = this;
            this.__valid = bool;
            if (bool == false) {
                qxnw.utils.addBorder(self);
                self.setAppearance("textfield");
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
                qxnw.utils.removeBorders(self);
                if (self.id_listener != null) {
                    self.removeListenerById(self.id_listener);
                }
            }
        },
        setValue: function setValue(value) {
            var self = this;
            self.imgWidth = self.canvasObj.getCanvasWidth();
            self.imgHeight = self.canvasObj.getCanvasHeight();
            self.imageData = value;
            self.rawData = "";
            var ctx = self.canvasObj.getContext2d();
            var img = new Image();
            img.onload = function () {
                ctx.drawImage(img, 0, 0, self.imgWidth, self.imgHeight);
            };
            img.src = "data:image/png;base64," + value;
        },
        getValue: function getValue() {
            var self = this;
            var rta = {};
            rta.rawData = self.rawData;
            rta.imageData = self.imageData;
            if (rta.imageData == null) {
                return null;
            }
            return rta;
        },
        _onListPointerDown: function () {
            return false;
        },
        _onListChangeSelection: function (e) {
            return null;
        },
        focus: function focus() {
            this.setFocus();
        },
        setAllTabIndex: function setAllTabIndex(index) {
            this.setTabIndex(index);
        }
    }
});