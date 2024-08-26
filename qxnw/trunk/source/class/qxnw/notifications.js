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

qx.Class.define("qxnw.notifications", {
    type: "singleton",
    extend: qx.core.Object,
    construct: function () {
        this.__notifications = [];
    },
    statics: {
        getNotifications: function getNotifications() {
            var self = this.getInstance();
            return self.__notifications;
        },
        createNotification: function createNotification(parent, text, icon, callbackOnClick, callbackOnClose, complementText) {
            var self = this.getInstance();
            if (typeof complementText == 'undefined' || complementText == null || complementText == "" || complementText == false) {
                complementText = "NW Notifications";
            }
            if (!("Notification" in window)) {
                self.createWindowPopUp(parent, text, complementText);
                return true;
            } else {
                if (qxnw.config.getNotificationsType() == null || qxnw.config.getNotificationsType() == "W3C") {
                    text = qxnw.utils.cleanHtml(text);
                    if (typeof complementText != 'undefined') {
                        text += qxnw.utils.cleanHtml(complementText);
                    }
                    var perm = self.requestNotificationPermission();
                    if (perm) {
                        if (Notification.permission === "granted") {
                            var popup = new Notification(text, {
                                icon: icon,
                                body: text
                            });
                            popup.onclick = function () {
                                var these = this;
                                try {
                                    callbackOnClick(self.getNotifications);
                                    these.close();
                                } catch (e) {

                                }
                            };
                            popup.onclose = function () {
                                try {
                                    callbackOnClose();
                                } catch (e) {

                                }
                            };
                            self.__notifications.push(popup);
                        }
                    } else {
                        self.createWindowPopUp(parent, text, complementText);
                    }
                } else {
                    self.createWindowPopUp(parent, text, complementText);
                }
                return true;
            }
        }
    },
    members: {
        __notifications: null,
        requestNotificationPermission: function requestNotificationPermission() {
            if (Notification.permission === "granted") {
                return true;
            } else if (Notification.permission !== 'denied') {
                qxnw.utils.question("¿Desea activar las notificaciones del navegador?", function (e) {
                    if (e) {
                        Notification.requestPermission(function (permission) {
                        });
                    } else {
                        qxnw.local.storeData("notifications_type", "NW");
                    }
                });
                return false;
            } else {
                return false;
            }
        },
        getNotifications: function getNotifications() {
            return this.__notifications;
        },
        //DEPRECATED
        requestNotificationMozillaPermission: function requestNotificationMozillaPermission() {
            if (Notification && Notification.permission !== "granted") {
                Notification.requestPermission(function (status) {
                    if (Notification.permission !== status) {
                        Notification.permission = status;
                    }
                });
                return false;
            } else {
                return true;
            }
        },
        createWindowPopUp: function createWindowPopUp(parent, text, complement) {

            if (typeof notification_window != 'undefined' && notification_window != null) {
                notification_window.label_main.setValue("<br /><b>" + text + "</b>");
                notification_window.lblComplement.setValue("<hr><font style='gray'>" + complement + "</font>");
                notification_window.show();
            } else {
                var f = new qx.ui.popup.Popup().set({
                    backgroundColor: "transparent"
                });
                notification_window = f;
                var layout = new qx.ui.layout.Grid();
                layout.setColumnFlex(0, 1);
                layout.setColumnFlex(1, 1);
                layout.setRowFlex(0, 1);
                layout.setRowFlex(1, 1);
                layout.setRowAlign(0, "center", "middle");
                layout.setRowAlign(1, "right", "bottom");
                f.setLayout(layout);
                var scrollContainer = new qx.ui.container.Scroll();
                var lbl = new qx.ui.basic.Label("<br /><b>" + text + "</b>").set({
                    rich: true,
                    cursor: "pointer"
                });
                f.label_main = lbl;
                lbl.addListener("click", function () {
                    if (!qxnw.main.isNotificationsCreated()) {
                        main.__notification = new qxnw.widgets.notifications(main);
                        main.__notification.moveToPosition(parseInt(Math.round(qx.bom.Viewport.getWidth() - (195))), 46);
                        main.__notification.show();
                        qxnw.main.setNotificationsCreated(true);
                    }
                    if (f) {
                        f.destroy();
                    }
                    notification_window = null;
                });
                scrollContainer.add(lbl, {
                    flex: 1
                });
                f.add(scrollContainer, {
                    row: 0,
                    column: 0
                });
                f.addListener("disappear", function () {
                    main.disableNotifications();
                    notification_window = null;
                });
                var lblComplement = new qx.ui.basic.Label("<hr><font style='gray'>" + complement + "</font>").set({
                    rich: true
                });
                f.lblComplement = lblComplement;
                f.add(lblComplement, {
                    row: 1,
                    column: 0
                });
                f.setWidth(700);
                f.setHeight(63);
                f.setAutoHide(true);
                f.addListener("appear", function () {
                    var bounds = this.getBounds();
                    this.moveTo(parseInt(Math.round(qx.bom.Viewport.getWidth() - (bounds.width + 195))), 46);
//                    this.moveTo(parseInt(Math.round((qx.bom.Viewport.getWidth()) - ((qx.bom.Viewport.getWidth() / 2) + bounds.width))),
//                            parseInt(Math.round((qx.bom.Viewport.getHeight()) - ((qx.bom.Viewport.getHeight() / 2) + bounds.height)))
//                            );
                });
                f.show();
            }

        },
        createPopUp: function createPopUp(parent, text) {
            var popup = qxnw.utils.createIdeaPopUp(parent, text);
            popup.addListener("appear", function () {
                var bounds = this.getBounds();
                this.placeToPoint({
                    left: parseInt(Math.round((qx.bom.Viewport.getWidth()) - ((qx.bom.Viewport.getWidth() / 2) + bounds.width))),
                    top: parseInt(Math.round((qx.bom.Viewport.getHeight()) - ((qx.bom.Viewport.getHeight() / 2) + bounds.height)))
                });
            });
            popup.show();
        }
    }
});