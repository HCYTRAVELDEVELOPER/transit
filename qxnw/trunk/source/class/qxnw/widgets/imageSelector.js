qx.Class.define("qxnw.widgets.imageSelector", {
    extend: qx.ui.core.Widget,
    events: {
        "selectImages": "qx.event.type.Data"
    },
    properties: {
        invalidMessage: {
            init: "",
            check: "String"
        },
        // overridden
        appearance: {
            refine: true,
            init: "colorpopup"
        }
    },
    construct: function () {
        this.base(arguments);
        var self = this;
        self._setLayout(new qx.ui.layout.VBox(5));
        self.setPadding(0);
        self.preview = this._createChildControl("preview-selected");
        self._createChildControl("selector-button");
        self.__selectedImages = [];

        self.addListener("changeEnabled", function (e) {
            var enabled = e.getData();
            if (enabled == false) {
                if (self.processEnabled === true) {
                    self.closeTimeOut = new qx.event.Timer(1000);
                    self.closeTimeOut.start();
                    self.closeTimeOut.addListener("interval", function (e) {
                        this.stop();
                        self.processEnabled = false;
                        self.setEnabled(true);
                        self.disableAllDeleteItems();
                        self.getChildControl("selector-button").setEnabled(false);
                        self.processEnabled = true;
                    });
                }
            }
        });
    },
    members: {
        id_listener: null,
        popup: null,
        required: false,
        readOnly: null,
        __filter: null,
        __selectedImages: null,
        preview: null,
        processEnabled: true,
        disableAllDeleteItems: function disableAllDeleteItems() {
            var self = this;
            var children = self.preview.getChildren();
            for (var i = 0; i < children.length; i++) {
                var internal = children[i].getChildren();
                for (var ia = 0; ia < internal.length; ia++) {
                    var ud = internal[ia].getUserData("delete_image");
                    if (ud != null && ud === true) {
                        internal[ia].setEnabled(false);
                        break;
                    }
                }
            }
        },
        setAllTabIndex: function setAlTabIndex(index) {
            this.getChildControl("selector-button").setTabIndex(index);
        },
        tabFocus: function tabFocus() {
            this.getChildControl("selector-button").focus();
        },
        focus: function focus() {
            this.getChildControl("selector-button").focus();
        },
        cleanValidate: function cleanValidate() {
            var border = new qx.ui.decoration.Decorator().set({
                backgroundColor: "white",
                width: 1,
                style: "solid",
                color: "black"
            });
            this.setDecorator(border);
        },
        setValid: function setValid(bool) {
            var self = this;
            if (bool == false) {
                var border = new qx.ui.decoration.Decorator().set({
                    backgroundColor: "white",
                    width: 3,
                    style: "solid",
                    color: "red"
                });
                this.setAppearance("textfield");
                this.setDecorator(border);
                self.id_listener = self.addListenerOnce("mouseover", function (e) {
                    self.popup = new qx.ui.popup.Popup(new qx.ui.layout.HBox()).set({
                        backgroundColor: "#FF0000"
                    });
                    if (self.getInvalidMessage() != "") {
                        self.popup.placeToPointer(e);
                        self.popup.add(new qx.ui.basic.Atom(self.getInvalidMessage()), {
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
        setRequired: function setRequired(bool) {
            this.required = bool;
        },
        setReadOnly: function setReadOnly(bool) {
            this.readOnly = bool;
        },
        _createChildControlImpl: function (id, hash) {
            var control;
            switch (id) {
                case "preview-selected":
                    control = new qx.ui.container.Composite(new qx.ui.layout.Flow());
                    control.setAllowStretchX(true);
                    control.set({
                        minHeight: 20,
                        padding: 10
                    });
                    this._add(control, {
                        flex: 1
                    });
                    break;
                case "selector-button":
                    control = new qx.ui.form.Button(this.tr("Administrador de imágenes"), qxnw.config.execIcon("utilities-graphics-viewer", "apps"));
                    control.addListener("execute", this._onOpenAdministrator, this);
                    this._add(control);
                    break;
                default:
                    break;
            }
            return control || this.base(arguments, id);
        },
        _onOpenAdministrator: function _onOpenAdministrator() {
            var self = this;
            var admin = new qxnw.nw_file_manager.trees.vista_general("img");
            admin.setModal(true);
            admin.addListener("accept", function () {
                var selectedImages = this.getSelectedImages();
                if (selectedImages.length != 0) {
                    for (var i = 0; i < selectedImages.length; i++) {
                        self.__selectedImages.push(selectedImages[i]);
                    }
                    self.processSelectedImages();
                    self.fireDataEvent("selectImages", self.__selectedImages);
                }
            });
            admin.show();
        },
        cleanSelectedImages: function cleanSelectedImages() {
            this.preview.removeAll();
        },
        processSelectedImages: function processSelectedImages() {
            var self = this;
            var selectedImages = self.__selectedImages;
            self.preview.removeAll();
            if (typeof selectedImages == 'undefined' || selectedImages == null || selectedImages.length == 0) {
                return;
            }
            for (var i = 0; i < selectedImages.length; i++) {
                var containerCarpet = new qxnw.widgets.imageViewer().set({
                    maxHeight: 80,
                    minHeight: 80,
                    minWidth: 80,
                    maxWidth: 80
                });
                var deleteButton = new qx.ui.basic.Image(qxnw.config.execIcon("edit-delete")).set({
                    maxHeight: 15,
                    minHeight: 15,
                    maxWidth: 15,
                    minWidth: 15
                });
                deleteButton.setUserData("delete_image", true);
                containerCarpet.add(deleteButton);
                deleteButton.setUserData("parent_container", containerCarpet);
                deleteButton.setUserData("model_data", selectedImages[i]);
                deleteButton.addListener("click", function () {
                    var toRemove = this.getUserData("parent_container");
                    toRemove.destroy();
                    var toSearch = this.getUserData("model_data");
                    for (var ia = 0; ia < self.__selectedImages.length; ia++) {
                        if (self.__selectedImages[ia] == toSearch) {
                            self.__selectedImages.splice(ia, 1);
                            break;
                        }
                    }
                });
                containerCarpet.setValue(selectedImages[i], true);
                self.preview.add(containerCarpet);
            }
        },
        setFilter: function setFilter() {
            return true;
        },
        getValue: function () {
            return this.__selectedImages;
        },
        setValue: function setValue(value) {
            this.__selectedImages = value;
            this.processSelectedImages(value);
        }
    }
});