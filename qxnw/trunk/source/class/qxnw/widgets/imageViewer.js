qx.Class.define("qxnw.widgets.imageViewer", {
    extend: qx.ui.container.Composite,
    construct: function construct() {
        var self = this;
        self.base(arguments);
        self.setLayout(new qx.ui.layout.VBox());

        var result = document.createElement("DIV");
        result.style.overflowX = "hidden";
        result.style.overflowY = "hidden";
        result.style.border = "1px solid #aaa";
        result.style.width = "400px";
        result.style.height = "400px";
        result.style.position = "absolute";
        result.setAttribute("id", "myresult");
        document.body.appendChild(result);

        result.style.display = "none";

        self.addListener("disappear", function () {
            self.closeResultWidget();
            var w1 = document.getElementById("myresult");
            if (w1 != null && w1 != "") {
                w1.remove();
            }
            var w2 = document.getElementById("img-zoom-lens");
            if (w2 != null && w2 != "") {
                w2.remove();
            }
        });
        self.addListener("appear", function () {
            qx.bom.element.Class.add(this.getContentElement().getDomElement(), "img-zoom-container");
        });
    },
    events: {
        "imageData": "qx.event.type.Event",
        "createdToolBar": "qx.event.type.Event"
    },
    members: {
        __value: null,
        __rPath: null,
        __rWidth: null,
        __rHeight: null,
        containerPrinter: null,
        __checkZoom: false,
        __startedCheckZoom: false,
        __uiCheckZoom: null,
        closeResultWidget: function closeResultWidget() {
            var w = document.getElementById("myresult");
            if (w != null && w != "") {
                w.style.display = "none";
            }
            var lens = document.getElementById("img-zoom-lens");
            if (lens != null && lens != "") {
                lens.style.display = "none";
            }
        },
        getToolBar: function getToolBar() {
            return this.containerPrinter;
        },
        createToolBar: function createToolBar() {
            var self = this;
            self.containerPrinter = new qx.ui.container.Composite(new qx.ui.layout.HBox().set({
                spacing: 2
            })).set({
                padding: 2,
                allowGrowY: false,
                allowShrinkY: true,
                maxHeight: 50
            });
//            self.add(self.containerPrinter, {
//                flex: 0
//            });
            var downloadButton = new qx.ui.form.Button(self.tr("Descargar"), qxnw.config.execIcon("document-save"));
            downloadButton.addListener("execute", function () {
                if (self.__rPath === null) {
                    return;
                }
                var xhr = new XMLHttpRequest();
                xhr.open("GET", self.__rPath, true);
                xhr.responseType = "blob";
                xhr.onload = function () {
                    var urlCreator = window.URL || window.webkitURL;
                    var imageUrl = urlCreator.createObjectURL(this.response);
                    var tag = document.createElement('a');
                    tag.href = imageUrl;
                    tag.download = self.__rPath.split(/(\\|\/)/g).pop();
                    document.body.appendChild(tag);
                    tag.click();
                    document.body.removeChild(tag);
                };
                xhr.send();
            });
            self.containerPrinter.add(downloadButton);
            var printerButton = new qx.ui.form.Button(self.tr("Ver en dimensiones reales"), qxnw.config.execIcon("document-print-preview"));
            var tT = new qx.ui.tooltip.ToolTip("Ver y descargar la imagen en sus dimensiones originales y con máxima calidad", qxnw.config.execIcon("help-faq"));
            printerButton.setToolTip(tT);
            printerButton.addListener("execute", function () {
                if (self.__rPath == null) {
                    return;
                }
                try {
                    self.closeResultWidget();
                    self.__uiCheckZoom.setValue(false);
                } catch (e) {
                    qxnw.utils.console(e);
                }
                var f = new qxnw.forms();
                f.setModal(true);
                f.setTitle(self.tr("Visor de imágenes"));
                f.createFlexPrinterToolBar(self.__rPath);
                f.addFrame(self.__rPath, false);
                f.maximize();
                f.show();
            });
            self.containerPrinter.add(printerButton);

            self.__uiCheckZoom = new qx.ui.form.CheckBox(self.tr("Usar zoom"));
            var tT = new qx.ui.tooltip.ToolTip("Abrir una lupa para ver el detalle de la foto", qxnw.config.execIcon("help-faq"));
            self.__uiCheckZoom.setToolTip(tT);
            self.__uiCheckZoom.addListener("execute", function () {
                var w = document.getElementById("myresult");
                if (this.getValue()) {
                    w.style.display = "inline";
                    self.__checkZoom = true;
                    if (self.__startedCheckZoom == false) {
                        self.imageZoom("image1", "myresult");
                        self.__startedCheckZoom = true;
                    }
                } else {
                    self.closeResultWidget();
                }
            });
            self.containerPrinter.add(self.__uiCheckZoom);
            self.fireDataEvent("createdToolBar", true);
            return self.containerPrinter;
        },
        getValue: function getValue() {
            return this.__value;
        },
        imageZoom: function imageZoom(imgID, resultID) {
            var self = this;
            var img, lens, result, cx, cy;
            img = document.getElementById(imgID);
            result = document.getElementById(resultID);

            lens = document.createElement("DIV");
            lens.setAttribute("class", "img-zoom-lens");
            lens.setAttribute("id", "img-zoom-lens");

            img.parentElement.insertBefore(lens, img);

            cx = result.offsetWidth / lens.offsetWidth;
            cy = result.offsetHeight / lens.offsetHeight;

            result.style.backgroundImage = "url('" + img.src + "')";
            result.style.backgroundSize = (img.width * cx) + "px " + (img.height * cy) + "px";

            lens.addEventListener("mousemove", moveLens);
            img.addEventListener("mousemove", moveLens);

            lens.addEventListener("touchmove", moveLens);
            img.addEventListener("touchmove", moveLens);

            result.style.zIndex = 100;

            function moveLens(e) {
                var pos, x, y;

                e.preventDefault();

                pos = getCursorPos(e);
                if (self.__uiCheckZoom.getValue() == false) {
                    lens.style.display = "none";
                } else {
                    lens.style.display = "inline";
                }

                result.style.top = (e.pageY + 17) + "px";
                result.style.left = (e.pageX + 17) + "px";

                x = pos.x - (lens.offsetWidth / 2);
                y = pos.y - (lens.offsetHeight / 2);

                if (x > img.width - lens.offsetWidth) {
                    x = img.width - lens.offsetWidth;
                }
                if (x < 0) {
                    x = 0;
                }
                if (y > img.height - lens.offsetHeight) {
                    y = img.height - lens.offsetHeight;
                }
                if (y < 0) {
                    y = 0;
                }

                lens.style.left = x + "px";
                lens.style.top = y + "px";

                result.style.backgroundPosition = "-" + (x * cx) + "px -" + (y * cy) + "px";
            }
            function getCursorPos(e) {
                var a, x = 0, y = 0;
                e = e || window.event;

                a = img.getBoundingClientRect();

                x = e.pageX - a.left;
                y = e.pageY - a.top;

                x = x - window.pageXOffset;
                y = y - window.pageYOffset;
                return {x: x, y: y};
            }
        },
        setValue: function setValue(imagePath, usePhpThumb) {
            var self = this;
            if (typeof imagePath == 'undefined' || imagePath == null || imagePath == '') {
                return;
            }
            self.__value = imagePath;

            var p = {};
            p["imagePath"] = imagePath;
            p["max_thumb_width"] = 790;
            p["max_thumb_height"] = 690;

            var rpc = new qxnw.rpc(qxnw.userPolicies.getRpcUrl(), "nwFileManager", true);
            if (typeof rpc.setRequireDb != 'undefined') {
                rpc.setRequireDb(false);
            }
            var func = function (r) {
                self.removeAll();
                if (r == false) {
                    self.add(new qx.ui.basic.Image(qxnw.config.getImageNoExists()).set({
                        height: 65,
                        width: 85,
                        scale: true
                    }), {
                        flex: 1
                    });
                    self.fireDataEvent("imageData", false);
                    return;
                }
                self.fireDataEvent("imageData", r);
                var path = r.path;
                self.__rPath = path;
                if (typeof usePhpThumb != 'undefined' && usePhpThumb === true) {
                    path = "/nwlib" + qxnw.userPolicies.getNwlibVersion() + "/includes/phpthumb/phpThumb.php?src=" + r.path + "&w=60&q=" + qxnw.config.getPhpThumbQuality();
                }
                var image = new qx.ui.basic.Image(path).set({
                    allowGrowX: false,
                    allowGrowY: false,
                    scale: true
                });

                image.addListener("appear", function () {
                    var el = this.getContentElement().getDomElement();
                    el.id = "image1";
                    qx.bom.element.Class.add(el, "img-zoom-result");
                    var css = "position: relative";
                    var c = qx.bom.element.Style.getCss(el);
                    qx.bom.element.Style.setCss(el, c + css);
                });

                self.add(image, {
                    flex: 1
                });
                image.setUserData("data", r);
                image.setMaxWidth(r.width);
                image.setMaxHeight(r.height);

//                self.createToolBar();
            };
            rpc.exec("getImageDimensions", p, func);
        }
    }
});