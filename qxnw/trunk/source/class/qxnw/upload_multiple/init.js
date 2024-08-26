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

qx.Class.define("qxnw.upload_multiple.init", {
    extend: qx.ui.core.Widget,
    construct: function (label, icon, fullPath, rename, destination, parentName) {
        this.base(arguments);
        var self = this;
        if (typeof fullPath != 'undefined') {
            self.__fullPath = fullPath;
        }
        var url = "/nwlib" + qxnw.userPolicies.getNwlibVersion() + "/upload_multiple.php";
        var add = "?";
        if (typeof rename != 'undefined') {
            if (rename === true) {
                url += "?rename=true";
                add = "&";
            } else if (rename == "rename_random") {
                url += "?rename_random=true";
                add = "&";
            }
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
                url += add + "destination=" + encodeURI("/" + destination + "/");
            }
        } else {
            destination = "/imagenes/" + "/" + parentName + "/";
            url += add + "destination=" + encodeURI(destination) + "&default=true";
        }

        console.log("url", url);

        this.setMinWidth(155);
        this._setLayout(new qx.ui.layout.VBox());
        this.setPadding(0);
        self.__button = new qxnw.upload_multiple.UploadButton(label, icon);
        self.__button.addListener("tap", function () {
            self.__itemsData = [];
            var childs = self._getChildren();
            for (var i = 0; i < childs.length; i++) {
                if (childs[i].classname == 'qx.ui.container.Composite') {
                    self._remove(childs[i]);
                    i--;
                }
            }
        });
        self._add(self.__button);
        self.__items = [];
        self.__itemsItems = [];
        self.__itemsData = [];

        self.addListener("appear", function () {
            qx.bom.element.Class.add(self.getContentElement().getDomElement(), "qxnw_upload_multiple_init");
        });
        var uploader = new qxnw.upload_multiple.UploadMgr(self.__button, url);
        uploader.addListener("addFile", function (evt) {
            var msg = "";
            var file = evt.getData();
            file.addListener("changeResponse", function () {
                var json = file.getResponse();

                var res = file.getFilename().replace("#", "_");
                try {
                    json = qx.lang.Json.parse(json);
                } catch (e) {
                    qxnw.utils.information(json);
                }

                if (json.success) {
                    msg = qx.lang.Json.parse(this.getResponse());
                    if (msg == null) {
                        msg = "";
                    }
                    if (typeof msg.error != 'undefined') {
                        var item = self.__itemsItems[res];
                        item.setValue("<strong style='color: red'>" + msg.error + "</strong>");
                        item.setUserData("error", true);
                        item.setUserData("error_text", msg.error);
                    }
                } else if (typeof json.error != 'undefined') {
                    if (json.error != null) {
                        if (json.error != '') {
                            var item = self.__itemsItems[res];
                            item.setValue("<strong style='color: red'>" + json.error + "</strong>");
                            item.setUserData("error", true);
                            item.setUserData("error_text", json.error);
                            return;
                        }
                    }
                }
            });
            var res = file.getFilename().replace("#", "_");
            if (typeof self.__items[res] == 'undefined' || self.__items[res] == null) {
                var border = new qx.ui.decoration.Decorator().set({
                    width: 1,
                    style: "solid",
                    color: "gray"
                });
                var container = new qx.ui.container.Composite(new qx.ui.layout.VBox().set({
                    separator: border,
                    alignX: "center"
                }));
                var item = new qx.ui.basic.Label(msg).set({
                    rich: true
                });
                var pb = new qx.ui.indicator.ProgressBar();
                container.add(pb);
                var subContainer = new qx.ui.container.Composite(new qx.ui.layout.HBox().set({
                    alignX: "center"
                }));
                subContainer.add(item);
                self.__items[res] = container;
                self.__itemsItems[res] = item;
                var image = new qx.ui.basic.Image(qxnw.config.execIcon("dialog-close"));
                image.addListener("appear", function () {
                    qx.bom.element.Style.set(image.getContentElement().getDomElement(), "cursor", "pointer");
                });
                container.setUserData("image", image);
                container.setUserData("subContainer", subContainer);
                subContainer.add(image);
                image.setUserData("uploader", uploader);
                image.setUserData("file", file);
                image.setUserData("file_name", res);
                image.addListenerOnce("tap", function () {
                    if (self.__itemsItems[this.getUserData("file_name")].getUserData("completed") === true) {
                        self.__items[this.getUserData("file_name")].destroy();
                        self.__items[this.getUserData("file_name")] = null;
                    } else {
                        try {
                            this.getUserData("uploader").cancel(this.getUserData("file"));
                        } catch (e) {
                            self.__items[this.getUserData("file_name")].destroy();
                        }
                    }
                });
                container.add(subContainer);
            } else {
                var container = self.__items[res];
                var image = container.getUserData("image");
                image.setVisibility("visible");
                var subContainer = container.getUserData("subContainer");
                image.setUserData("uploader", uploader);
                image.setUserData("file", file);
                image.setUserData("file_name", res);
                image.addListenerOnce("tap", function () {
                    if (self.__itemsItems[this.getUserData("file_name")].getUserData("completed") === true) {
                        if (self.__items[this.getUserData("file_name")] != null) {
                            self.__items[this.getUserData("file_name")].destroy();
                            self.__items[this.getUserData("file_name")] = null;
                        }
                    } else {
                        try {
                            this.getUserData("uploader").cancel(this.getUserData("file"));
                        } catch (e) {
                            self.__items[this.getUserData("file_name")].destroy();
                        }
                    }
                });
                var item = self.__itemsItems[res];
            }
            var progressListenerId = file.addListener("changeProgress", function (evt) {
                var res = file.getFilename().replace("#", "_");
                var lbl = "Subido " + res + ": " +
                        evt.getData() + " / " + file.getSize() + " - " +
                        Math.round(evt.getData() / file.getSize() * 100) + "%";
                item.setValue(lbl);
                self._add(container);
                var cont = self.__items[res];
                var childs = cont.getChildren();
                for (var i = 0; i < childs.length; i++) {
                    if (childs[i].classname == 'qx.ui.indicator.ProgressBar') {
                        childs[i].setValue(Math.round(evt.getData() / file.getSize() * 100));
                    }
                }
            }, this);

            var errors = [];

            var stateListenerId = file.addListener("changeState", function (evt) {
                var state = evt.getData();
                var res = file.getFilename().replace("#", "_");
                if (state == "uploading") {
                    item.setValue(res + " (Subiendo...)");
                } else if (state == "uploaded") {
                    item.setValue(res + " (Completado)");
                    var erro = item.getUserData("error");
                    item.setUserData("completed", true);
                    if (erro === true) {
                        var msg_error = item.getUserData("error_text");
                        item.setValue(msg_error);
                        errors.push(msg_error);
                        if (msg_error == "El archivo no se encuentra dentro de los autorizados por la plataforma / The file is not within the limits authorized by the platform") {
                            qxnw.utils.information(msg_error);
                        } else {
                            qxnw.utils.error(msg_error);
                        }
                        return;
                    }
                    var d = {};
                    var json = file.getResponse();
                    json = qx.lang.Json.parse(json);

                    var img = "/imagenes/";

                    if (typeof json.destination_light != 'undefined' && json.destination_light != null && json.destination_light != "") {
                        img = json.destination_light + "/";
                    }

                    if (typeof json.rename != 'undefined' && json != null && json.rename) {
                        d["absolute_path"] = img + json.newName;
                        d["filename"] = json.newName;
                    } else {
                        d["absolute_path"] = img + res;
                        d["filename"] = res;
                    }
                    d["size"] = file.getSize();

                    item.setUserData("key", d);
                    self.__itemsData.push(d);
                } else if (state == "cancelled") {
                    image.setVisibility("excluded");
                    item.setValue(res + " (Cancelado)");
                }
                if (state == "uploaded" || state == "cancelled") {
                    file.removeListenerById(progressListenerId);
                    file.removeListenerById(stateListenerId);
                }
            }, this);
        });
    },
    destruct: function destruct() {
        try {
            this.destroy();
            this._disposeMap("__itemsItems");
            this._disposeObjects("__button");
            this._disposeMap("__items");
            this.dispose();
        } catch (e) {
            this.dispose();
        }
    },
    properties: {
        "invalidMessage": {
            init: "",
            check: "String"
        },
        "maxItems": {
            init: null,
            check: "Integer"
        }
    },
    members: {
        __button: null,
        __items: null,
        required: false,
        readOnly: null,
        __filter: null,
        __itemsData: null,
        __fullPath: null,
        __itemsItems: null,
        __mainContainerInitUploader: null,
        getValue: function getValue() {
            var self = this;
            var d = [];
            if (self.__itemsData != null) {
                for (var i = 0; i < self.__itemsData.length; i++) {
                    d.push(self.__itemsData[i]);
                }
            }
            return d;
        },
        setAllTabIndex: function setAllTabIndex(index) {
            this.__button.setTabIndex(index);
        },
        tabFocus: function tabFocus() {
            this.focus();
        },
        focus: function focus() {
            this.focus();
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
                qxnw.utils.removeBorders(this);
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
        setValue: function setValue(valArr) {
            var self = this;
            if (self.items != null) {
                for (var i = 0; i < valArr.length; i++) {
                    var item = new qx.ui.basic.Label(valArr[i]).set({
                        rich: true
                    });
                    self._add(item);
                    item.setUserData("key", valArr[i]);
                }
            }
        },
        cleanAll: function cleanAll() {
            var self = this;
            var childs = self._getChildren();
            for (var i = 0; i < childs.length; i++) {
                if (childs[i].classname == 'qx.ui.container.Composite') {
                    self._remove(childs[i]);
                    i--;
                }
            }
        }
    }
});