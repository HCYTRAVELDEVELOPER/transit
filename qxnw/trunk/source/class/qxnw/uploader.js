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
 * Manage all the uploads. Presents a good user interface, and can gelp you to upload any file.
 */
qx.Class.define("qxnw.uploader", {
    extend: qx.core.Object,
    include: [qx.locale.MTranslation],
    events: {
        "sending": "qx.event.type.Event",
        "completed": "qx.event.type.Event"
    },
    construct: function construct(fullPath, rename, url, label, icon, destination, parentName, sizes) {
        this.base(arguments);
        var self = this;
        if (typeof url == 'undefined' || url == false) {
            url = '/nwlib' + qxnw.userPolicies.getNwlibVersion() + '/uploader.php';
        }
        if (typeof fullPath != 'undefined') {
            if (fullPath != false) {
                self.__fullPath = fullPath;
            }
        }
        var add = "?";
        if (typeof rename !== 'undefined') {
            if (rename === true) {
                url += "?rename=true";
                add = "&";
            } else if (rename === "rename_random") {
                url += "?rename_random=true";
                add = "&";
            }
        }
        if (typeof icon === 'undefined' || icon === false) {
            icon = 'icon/16/actions/document-save.png';
        }

        self.up = qxnw.userPolicies.getUserData();

        if (typeof label === 'undefined' || label === false) {
            label = "Seleccionar archivo...";
        }

        if (typeof parentName === 'undefined') {
            parentName = self.classname;
        }

        if (typeof destination === 'undefined') {
            destination = false;
        }
        
        if (destination !== false) {
            if (destination === "tmp" || destination === "imagenes") {
                url += add + "destination=" + encodeURI("/" + destination + "/" + parentName + "/");
            } else {
                destination = destination.replace(/\b\$nw\$\b/g, ".");
                url += add + "destination=" + encodeURI("/" + destination + "/" + parentName + "/");
            }
        } else {
            destination = "/imagenes/" + "/" + parentName + "/";
            url += add + "destination=" + encodeURI(destination);
        }

        if (typeof sizes !== 'undefined' && sizes !== false) {
            url += "&sizes=" + sizes;
        }

        self.mainContainer = new qx.ui.container.Composite(new qx.ui.layout.VBox().set({
            alignX: "center"
        })).set({
            minWidth: 155
        });
        self.mainContainer.getValue = function () {
            return self.getResponse();
        };
        self.mainContainer.setValue = function (val) {
            self.setValue(val);
        };

        var container = new qx.ui.container.Composite(new qx.ui.layout.VBox());

//        var quality = new qxnw.widgets.normalTextField().set({
//            minWidth: 160,
//            maxWidth: 160
//        });
//        container.add(quality);
//        quality.setValue("100");
//        quality.setPlaceholder(self.tr("Calidad de imagen"));

        self.__containerFormUploader = container;
        self.__form = new qxnw.uploader.UploadForm('uploadFrm', url);
        self.__form.setParameter('rm', 'upload');
        self.__form.setLayout(new qx.ui.layout.Basic);
        container.add(self.__form);
        self.mainContainer.add(container);
        self.imagesContainer = new qx.ui.container.Composite(new qx.ui.layout.VBox().set({
            alignX: "center"
        })).set({
            height: 1
        });
        self.mainContainer.add(self.imagesContainer);
        self.file = new qxnw.uploader.UploadField('uploadfile', label, icon);
        self.__fields = [];
        self.__fields.push(self.file);
        self.__form.add(self.file);
        self.__form.addListener('completed', function (e) {
            self.file.setFieldValue('');
            var response = this.getIframeHtmlContent();
            if (response == null) {
                return;
            }
            response = qx.lang.Json.parse(response.toString());

            console.log(response);

            qxnw.utils.stopLoading();

            if (response.error == null) {
                if (self.__showResponse) {
                    self.__showResponseOk(response.result);
                }
                if (typeof response.result.fileUrl != 'undefined' && response.result.fileUrl != null) {
                    self.__response = response.result.fileUrl;
                } else if (self.__fullPath) {
                    self.__response = response.result.image;
                } else {
                    self.__response = response.result.image_light;
                }
            } else {
                self.__response = null;
                self.__showError(response.error);
                if (typeof response.error.code != 'undefined') {
                    if (response.error.code == 102) {
                        qxnw.utils.information(response.error.message.message);
                    } else {
                        if (typeof response.error.message != 'undefined') {
                            if (typeof response.error.message != 'undefined') {
                                qxnw.utils.error(response.error.message, self);
                            }
                        }
                    }
                }
            }
            self.fireDataEvent("completed", self.__response);
        });
        self.__form.addListener('sending', function (e) {
            qxnw.utils.loading("Enviando...");
            self.fireEvent("sending");
        });
        self.file.addListener('changeFieldValue', function (e) {
            var val = e.getData();
            if (val != '') {
                self.__form.send();
            }
        });

    },
    properties: {
        haveAlterIconDelete: {
            init: false
        },
        onClickProp: {
            init: true
        },
        widthSubImage: {
            init: 100
        }
    },
    destruct: function () {
        this._disposeObjects("this.__image", "this.__form", "this.file");
    },
    members: {
        up: null,
        enabledFlag: true,
        file: null,
        __form: null,
        __fullPath: false,
        __response: null,
        __fields: null,
        __showResponse: true,
        mainContainer: null,
        __label: null,
        __image: null,
        __isUploadedImage: false,
        __containerDelete: null,
        __required: false,
        __invalidMessage: null,
        __showPdf: false,
        __showPdfHeight: 600,
        __showPdfWidth: 500,
        _dragAndDrop: false,
        __containerFormUploader: null,
        getLayoutParent: function getLayoutParent() {
            return this.getContainer().getLayoutParent();
        },
        isVisible: function isVisible() {
            return this.file.getButton().isVisible();
        },
        getImage: function getImage() {
            return this.__image;
        },
        setOpenServer: function setOpenServer(val) {
            var self = this;
            if (val == true) {
                var button = new qxnw.widgets.button(self.tr("Buscar en servidor"), qxnw.config.execIcon("utilities-log-viewer", "apps")).set({
                    maxWidth: 165,
                    alignX: "left"
                });
                button.addListener("execute", function () {
                    var l = new qxnw.nw_file_manager.trees.vista_general();
                    l.setModal(true);
                    l.settings.accept = function () {
                        l.close();
                        var selectedImage = l.getSelectedImages();
                        if (typeof selectedImage[0] == 'undefined') {
                            return;
                        }
                        self.setValue(selectedImage[0]);
                    };
                    l.show();
                    l.maximize();
                });
                self.mainContainer.addBefore(button, self.__containerFormUploader);
            }
        },
        setDragAndDrop: function setDragAndDrop(val) {
            this._dragAndDrop = true;
            this.file.setDragAndDrop(val);
        },
        setShowPdf: function setShowPdf(val, height, width) {
            this.__showPdf = val;

            if (typeof height != 'undefined') {
                this.__showPdfHeight = height;
            }
            if (typeof width != 'undefined') {
                this.__showPdfWidth = width;
            }
        },
        getButton: function getButton() {
            return this.file.getButton();
        },
        setVisibility: function setVisibility(visibility) {
            this.file.getButton().setVisibility(visibility);
        },
        setTabIndex: function setTabIndex(index) {
            this.file.getButton().setTabIndex(index);
        },
        isFocusable: function isFocusable() {
            return true;
        },
        // overridden
        setUserBounds: function setUserBounds() {
            return true;
        },
        // overridden
        tabFocus: function tabFocus() {
            this.file.getButton().focus();
        },
        getFocusElement: function getFocusElement() {
            return this.file.getButton().getFocusElement();
        },
        setEnabled: function setEnabled(enable) {
            var button = this.file.getButton();
            button.setEnabled(enable);
            if (!enable) {
                button.setCursor("default");
            } else {
                button.setCursor("pointer");
            }
            if (this.__containerDelete != null) {
                this.__containerDelete.setEnabled(enable);
            }
            this.enabledFlag = enable;
        },
        cleanValidate: function cleanValidate() {
            var self = this;
            qxnw.utils.removeBorders(self.file);
        },
        focus: function focus() {
            this.file.focusOnButton();
        },
        setValid: function setValid(bool) {
            var self = this;
            if (bool == false) {
                qxnw.utils.addBorder(self.file);
                self.id_listener = self.mainContainer.addListenerOnce("mouseover", function (e) {
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
                }
            }
        },
        setInvalidMessage: function setInvalidMessage(message) {
            this.__invalidMessage = message;
        },
        setRequired: function setRequired(bool) {
            this.__required = bool;
        },
        __showError: function __showError(error) {
            var self = this;
            self.deleteImage();
            var text = "<span style='color: gray; font-size: 11px;'>";
            text += "El archivo " + error.name + " no fue subido. <br />";
            text += "<b>" + error.message;
            text += '</span>';
            if (self.__label != null) {
                self.__label = null;
            }
            self.__label = new qx.ui.basic.Label(text).set({
                rich: true
            });
            self.imagesContainer.add(self.__label);
        },
        showResponse: function showResponse(bool) {
            this.__showResponse = bool;
        },
        __showResponseOk: function __showResponseOk(response) {
            var self = this;
            self.cleanValidate();
            if (self.__image != null) {
                self.__image.setSource(null);
            }

            if (self._dragAndDrop == true) {
                this.file.setDragAndDrop(false);
            }

            var num = Math.random();

            self.imagesContainer.removeAll();
            self.mainContainer.resetMaxHeight();
            self.createImageDelete();

            var ext = qxnw.utils.getExtension(response.name);

            if (self.__showPdf == true && (ext == "pdf" || ext == "PDF")) {
                var addedWidth = self.getWidthSubImage();
                var iframe = new qx.ui.embed.Iframe().set({
                    minWidth: self.__showPdfWidth,
                    minHeight: self.__showPdfHeight,
                    scrollbar: "no"
                });
                iframe.setSource(response.image_light);
                self.mainContainer.resetMaxHeight();
                self.mainContainer.resetMaxWidth();
                self.imagesContainer.add(iframe, {
                    flex: 1
                });
                iframe.addListener("load", function () {
//                    var w = this.getWindow();
//                    var h = this.getBody();
//                    console.log(h.scrollHeight);
//                    console.log(h.scrollTopMax);
//                    console.log(h.scrollTop);
                });
            } else {
                var s = response.image_light;
                if (typeof response.type != 'undefined' && response.type == "file") {
                    s = response.image;
                }
                self.__image = new qx.ui.basic.Image(s + "?v=" + num).set({
                    allowGrowX: false,
                    allowGrowY: false,
                    scale: true,
                    cursor: "pointer"
                });
                if (self.getOnClickProp() === true) {
                    self.__image.addListener("click", function () {
                        if (typeof response.fileUrl == 'undefined' || response.fileUrl == null) {
                            var f = new qxnw.forms();
                            f.setModal(true);
                            f.setTitle(self.tr("Visor de imágenes"));
                            f.createFlexPrinterToolBar(response);
                            var frame = f.addFrame(response.image_light, false);
                            frame.setWidth(100);
                            f.show();
                            f.maximize();
                        } else {
                            response.fileUrl = response.fileUrl.replace(/var\/www\/[a-zA-Z0-9]*\//gi, "");
                            var win = window.open(response.fileUrl, '_blank');
                            win.focus();
                        }
                    });
                }
                self.imagesContainer.add(self.__image);

                var addedWidth = self.getWidthSubImage();
                if (addedWidth <= 100) {
                    addedWidth = 0;
                }

                self.__image.setUserData("height", Math.round(response.height) + addedWidth);
                self.__image.setUserData("width", Math.round(response.width) + addedWidth);
                self.__image.resetMaxWidth();
                self.__image.resetMaxHeight();
                self.__image.setMaxWidth(Math.round(response.width) + addedWidth);
                self.__image.setMaxHeight(Math.round(response.height) + addedWidth);

                self.mainContainer.resetMaxHeight();
                self.mainContainer.resetMaxWidth();
                self.mainContainer.set({
                    maxHeight: (Math.round(response.height) + 90) + addedWidth
                });
                self.mainContainer.set({
                    maxWidth: (Math.round(response.width) + 70) + addedWidth
                });
            }

//            self.mainContainer.setMinWidth(50);

            if (self.__label != null) {
                self.__label.setValue("");
            }
            var fileNameIndex = response.image.lastIndexOf("/") + 1;
            var filename = response.image.substr(fileNameIndex);

            if (typeof response.fileUrl != 'undefined' && response.fileUrl != null) {
                fileNameIndex = response.fileUrl.lastIndexOf("/") + 1;
                filename = response.fileUrl.substr(fileNameIndex);
            }

            if (typeof response.type != 'undefined' && response.type == "file") {
                filename = response.image_light;
            }

            var text = "<span style='color: gray; font-size: 11px;'>";
            text += "El archivo " + filename + " fue guardado correctamente. <br />";
            text += '</span>';
            if (self.__label != null) {
                self.__label = null;
            }
            self.__label = new qx.ui.basic.Label(text).set({
                rich: true
            });
            self.imagesContainer.add(self.__label);
            self.__isUploadedImage = true;
        },
        createImageDelete: function createImageDelete() {
            var self = this;
            var mh = 10;
            if (self.getHaveAlterIconDelete() == true) {
                mh = 50;
            }
            self.__containerDelete = new qx.ui.container.Composite(new qx.ui.layout.VBox()).set({
                maxHeight: mh
            });
            self.imagesContainer.add(self.__containerDelete);

            var icon = qxnw.config.execIcon("list-remove");

            if (self.getHaveAlterIconDelete() == true) {
                icon = qxnw.config.execIcon("eliminar", "qxnw", 32);
            }

            var imageDelete = new qx.ui.basic.Image(icon).set({
                allowGrowX: false,
                allowGrowY: false,
                scale: true,
                cursor: "pointer"
            });
            imageDelete.addListener("click", function () {
                if (self.enabledFlag === true) {
                    qxnw.utils.question(self.tr("¿Está segur@ de eliminar la imagen del servidor?"), function (e) {
                        if (e) {
                            self.deleteImage();
                        }
                    });
                }
            });
            self.__containerDelete.add(imageDelete);
            self.__containerDelete.add(new qx.ui.core.Spacer(70, 30));
        },
        deleteImage: function deleteImage() {
            var self = this;
            if (self._dragAndDrop == true) {
                this.file.setDragAndDrop(true);
            }
            self.imagesContainer.removeAll();
            if (self.__isUploadedImage) {
                if (self.__response != null) {
                    var rpc = new qxnw.rpc(qxnw.userPolicies.getRpcUrl(), "master");
                    rpc.setAsync(true);
                    var func = function (r) {
                        if (r) {
                            self.__isUploadedImage = false;
                            self.__response = null;
                        }
                    };
                    rpc.exec("deleteImage", self.__response, func);
                } else {
                    self.__isUploadedImage = false;
                }
            }
            self.__response = null;
        },
        __showEdit: function __showEdit(response) {
            var self = this;
            self.cleanValidate();
            if (response == null) {
                return;
            }
            var exists = true;

            var oldResponse = response;

            if (qxnw.utils.checkImageExists(response) == false) {
                response = qxnw.config.getImageNoExists();
                exists = false;
            }

            self.imagesContainer.removeAll();
            self.createImageDelete();

            var ext = oldResponse.split('.').pop();
            var extensions = qxnw.config.getFilesExtensions();

            if (self.__showPdf == true && (ext == "pdf" || ext == "PDF")) {
                var iframe = new qx.ui.embed.Iframe().set({
                    minWidth: self.__showPdfWidth,
                    minHeight: self.__showPdfHeight
                });
                iframe.setSource(response);
                self.mainContainer.resetMaxHeight();
                self.mainContainer.resetMaxWidth();
                self.imagesContainer.add(iframe, {
                    flex: 1
                });
            } else {
                if (qxnw.utils.isImage(response) === false) {
                    response = qxnw.config.getImageFileAll();
                }
                if (self.__image != null) {
                    self.__image.setSource(null);
                }
                if (extensions.indexOf(ext) != -1 && exists == true) {
                    var icon = qxnw.utils.getNWIconFromExt(ext);
                    response = qxnw.config.execIcon(icon, "qxnw", 32);
                } else {
                    response = "/nwlib" + qxnw.userPolicies.getNwlibVersion() + "/includes/phpthumb/phpThumb.php?src=" + response + "&w=" + self.getWidthSubImage() + "&q=" + qxnw.config.getPhpThumbQuality();
                }
                self.__image = new qx.ui.basic.Image(response).set({
                    allowGrowX: false,
                    allowGrowY: false,
                    scale: true,
                    cursor: "pointer"
                });
                self.imagesContainer.add(self.__image);
                if (exists === true) {
                    if (self.getOnClickProp() === true) {
                        self.__image.addListener("click", function () {
                            var f = new qxnw.forms();
                            f.setModal(true);
                            f.setTitle(self.tr("Visor de imágenes"));
                            f.createFlexPrinterToolBar(oldResponse);
                            f.addFrame(oldResponse, false);
                            f.show();
                        });
                    }
                }
            }
            self.__isUploadedImage = true;
        },
        addField: function addField() {
        },
        getContainer: function getContainer() {
            return this.mainContainer;
        },
        getImagesContainer: function getImagesContainer() {
            return this.imagesContainer;
        },
        getResponse: function getResponse() {
            return this.__response;
        },
        getValue: function getValue() {
            return this.__response;
        },
        clean: function clean() {
            this.imagesContainer.removeAll();
            this.__response = "";
        },
        setValue: function setValue(val) {
            this.__response = val;
            if (typeof val == 'undefined' || val == null || val == 'null' || val == "") {
                return;
            }
            this.mainContainer.resetMaxHeight();
            this.__showEdit(val);
        }
    }
});