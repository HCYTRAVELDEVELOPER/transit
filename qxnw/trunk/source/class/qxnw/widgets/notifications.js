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
 * Class created to be the main window. Into this class, you can put content as sub-windows, show forms, see some bars and more!
 */
qx.Class.define("qxnw.widgets.notifications", {
    extend: qxnw.forms,
    /**
     * Gets and create the session data, starts partial layout, sets the rpcUrl value and gets and save the actual theme. 
     * @param parent {Object} the parent of the notificatiosn to establish an special comunication
     */
    construct: function (parent) {
        this.base(arguments);
        var self = this;
        self.removeListenerById(self.getListenerIdClose());
        self.__parent = parent;
        self.getChildControl("captionbar").setVisibility("excluded");
        self.set({
            width: 500,
            contentPaddingTop: 0,
            contentPaddingRight: 0,
            contentPaddingLeft: 0
        });
        var layout = new qx.ui.layout.VBox();
        self.setLayout(layout);

        self.addListenerOnce('appear', function () {
            self.updateNotifications();
            //var root = qx.core.Init.getApplication().getRoot();
            //var bounds = root.getBounds();
            //var width = bounds.width - this.getBounds()["width"] - 40;            
            var h = qx.bom.Viewport.getHeight() - 80;
            self.setHeight(h);
        });

        self.__layoutButtons = new qx.ui.layout.HBox();
        self.__containerButtons = new qx.ui.container.Composite(self.__layoutButtons).set({
            height: 0,
            padding: 5
        });
        self.addWidget(self.__containerButtons);
        var lblLine = new qx.ui.basic.Label("<hr>").set({
            rich: true,
            width: qx.bom.Viewport.getWidth(),
            maxHeight: 7
        });
        self.addWidget(lblLine);

        self.__layoutContent = new qx.ui.layout.VBox();
        self.__containerContent = new qx.ui.container.Composite(self.__layoutContent).set({
            padding: 5
        });

        var scrollContainer = new qx.ui.container.Scroll();
        scrollContainer.add(self.__containerContent);

        self.addWidget(scrollContainer, {
            flex: 1
        });

        self.saveMove = false;

        self.__labelShowMore = new qx.ui.basic.Label(self.tr("<center><strong style='color: red'>Mostrar más...</strong></center>")).set({
            rich: true,
            cursor: "pointer"
        });
        self.__labelShowMore.setVisibility("excluded");
        self.__labelShowMore.addListener("click", function () {
            self.showMoreNotifications();
        });
        self.addWidget(self.__labelShowMore);

        self.createButtonsBar();
        self.createContent();
    },
    destruct: function destruct() {
        try {
            this._disposeObjects("__layoutButtons");
            this._disposeObjects("__layoutContent");
            this._disposeObjects("__containerButtons");
            this._disposeObjects("__containerContent");
            this._disposeObjects("__parent");
            for (var i = 0; i < this.ui.length; i++) {
                this._disposeObjects(this.fields[i]);
            }
        } catch (e) {
            qxnw.utils.nwconsole(e);
        }
    },
    properties: {
    },
    members: {
        __layoutButtons: null,
        __layoutContent: null,
        __containerButtons: null,
        __containerContent: null,
        __parent: null,
        __limit: 10,
        __offset: 0,
        __limitText: null,
        moveToPosition: function moveToPosition(l, t) {
            var self = this;
            self.addListenerOnce('appear', function () {
                var bounds = self.getBounds();
                self.moveTo(l - (bounds.width), t);
            });
        },
        showMoreNotifications: function showMoreNotifications() {
            var self = this;
            var rpc = new qxnw.rpc(self.getRpcUrl(), "nw_notifications");
            rpc.setAsync(true);
            var func = function (favorites) {
                if (favorites.length == 0) {
                    return;
                }
                var color = qxnw.utils.createRandomColor();
                for (var i = 0; i < favorites.length; i++) {
                    if (typeof favorites[i].message == 'undefined') {
                        continue;
                    }
                    var data = favorites[i].message.split("|");
                    var text = "<div style='border-bottom: 1px dotted #ccc;margin: 5px;width: 100%;color: #888;background: #f7f7f7;padding: 5px;min-width: 350px;box-shadow: 0 1px 1px rgba(0,0,0,.25);border-top: 1px solid #E6E6E6;'>\n\
                                <p style='color: " + color + ";padding: 0;margin: 0px;font-weight: bold;font-size: 12px;'>" +
                            data[0].replace("++", "'") +
                            "</p>";
                    if (typeof data[1] != 'undefined') {
                        text += "<p style='color: blue;padding: 0;margin: 0px;font-weight: bold;font-size: 12px;'>" +
                                data[1].replace("::", "'") +
                                "</p>";
                    }
                    text += "<br />Fecha: " + favorites[i].fecha +
                            "<br />Enviado por: " + favorites[i].enviado_por + "</div>";
                    var label = new qx.ui.basic.Label(text).set({
                        rich: true
                    });
                    self.__containerContent.add(label, {
                        flex: 1
                    });
                }
            };
            var limit = self.__limitText.getValue();
            self.__offset = self.__offset + limit;
            var data = {
                offset: self.__offset,
                limit: limit
            };
            rpc.exec("getALotNotificationsByUser", data, func);
        },
        updateNotifications: function updateNotifications() {
            var self = this;
            var rpc = new qxnw.rpc(self.getRpcUrl(), "nw_notifications");
            rpc.setAsync(true);
            var func = function () {
                main.flushNotifications();
                self.populateNotifications();
            };
            rpc.exec("setReadedNotifications", 0, func);
        },
        populateNotifications: function populateNotifications() {
            var self = this;
            var rpc = new qxnw.rpc(self.getRpcUrl(), "nw_notifications");
            rpc.setAsync(true);
            self.__containerContent.removeAll();
            var func = function (favorites) {
                if (favorites.length == 0) {
                    self.__labelTitle.setValue(self.tr("<b style='color: gray'>No hay notificaciones pendientes</b>"));
                    return;
                }
                self.__labelShowMore.setVisibility("visible");
                self.__labelTitle.setVisibility("excluded");
                for (var i = 0; i < favorites.length; i++) {
                    if (typeof favorites[i].message == 'undefined') {
                        continue;
                    }
                    var data = favorites[i].message.split("|");
                    var text = "<div style='border-bottom: 1px dotted #ccc;margin: 5px;width: 100%;color: #888;background: #f7f7f7;padding: 5px;min-width: 350px;box-shadow: 0 1px 1px rgba(0,0,0,.25);border-top: 1px solid #E6E6E6;'>\n\
                                <p style='color: firebrick;padding: 0;margin: 0px;font-weight: bold;font-size: 12px;'>" +
                            data[0].replace("++", "'") +
                            "</p>";
                    if (typeof data[1] != 'undefined') {
                        text += "<p style='color: blue;padding: 0;margin: 0px;font-weight: bold;font-size: 12px;'>" +
                                data[1].replace("::", "'") +
                                "</p>";
                    }
                    text += "<br /><b>Fecha: </b>" + favorites[i].fecha +
                            "<br /><b>Enviado por: </b>" + favorites[i].enviado_por + "</div>";
                    var label = new qx.ui.basic.Label(text).set({
                        rich: true
                    });
                    self.__containerContent.add(label, {
                        flex: 1
                    });
                }
            };
            var d = {};
            d["limit"] = self.__limitText.getValue();
            rpc.exec("getALotNotificationsByUser", d, func);
        },
        openFavorite: function openFavorite(label) {
            var classname = label.getUserData("class");
            var favorites = qxnw.local.getFavoriteByClassName(classname);
            if (!favorites) {
                return;
            }
            main.restoreSubWindowByArrayData(favorites);
        },
        createContent: function createContent() {
            var self = this;
            self.__labelTitle = new qx.ui.basic.Label("").set({
                rich: true
            });
            self.__containerContent.add(self.__labelTitle);
        },
        createButtonsBar: function createButtonsBar() {
            var self = this;

            var lbl = new qx.ui.basic.Label(self.tr("<b>No. Registros: </b>")).set({
                rich: true
            });
            self.__containerButtons.add(lbl);

            self.__limitText = new qx.ui.form.Spinner();
            self.__limitText.set({
                maximum: 3000,
                minimum: -3000
            });
            self.__limitText.addListener("keypress", function (e) {
                var key = e.getKeyIdentifier();
                if (key == "Enter") {
                    self.populateNotifications();
                }
            });
            self.__limitText.setValue(10);
            self.__containerButtons.add(self.__limitText);

            var minimizeImage = new qx.ui.basic.Image(qxnw.config.execIcon("dialog-close")).set({
                cursor: "pointer"
            });
            var spacer = new qx.ui.container.Composite(new qx.ui.layout.Grow());

            self.__containerButtons.add(spacer, {
                flex: 1
            });
            self.__containerButtons.set({
                maxHeight: 22
            });
            self.__containerButtons.add(minimizeImage);

            minimizeImage.addListener("click", function () {
                console.log("click!!!!");
                self.__parent.__isNotificationsCreated = false;
                qxnw.main.setNotificationsCreated(false);
                notification_window = null;
                self.close();
            });
        }
    }
});