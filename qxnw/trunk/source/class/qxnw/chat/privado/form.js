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
 * Form to control the behavior of system
 */
qx.Class.define("qxnw.chat.privado.form", {
    extend: qxnw.forms,
    construct: function construct(parent) {
        this.base(arguments);
        var self = this;
        self.parent = parent;
        self.setTitle(self.tr("Chat"));

        self.setWidth(400);
        self.setHeight(500);

        var layout = new qx.ui.layout.Grid(0, 0);
        layout.setRowFlex(1, 1);
        layout.setColumnFlex(0, 1);

        var chatContainer = new qx.ui.container.Composite(layout);
        //self.setLayout(layout);
        //self.setContentPadding(0);
        //self.splitter.add(chatContainer, 1);
        self.masterContainer.add(chatContainer, {
            flex: 1
        });


        var data = [
            {
                "room": 0,
                "title": "title"
            }
        ];
        self.populateUsersList(data[0]);
        self.rightList = new qx.ui.form.List().set({
            width: 200
        });
        self.rightList.addListener("contextmenu", function(e) {
            self.contextMenu(e);
        });
        chatContainer.add(self.rightList, {
            column: 2,
            row: 0,
            rowSpan: 2
        });
        self.rightList.addListener("click", function() {
            var selected = self.rightList.getModelSelection().toArray();
            var up = qxnw.userPolicies.getInstance().getData();
            if (up["user"] != selected[0]["usuario"]) {
                self.populateList(selected);
            }
        });

        var toolbar = new qx.ui.toolbar.ToolBar().set({
            alignY: "middle",
            alignX: "center",
            spacing: 5
        });
        chatContainer.add(toolbar, {row: 0, column: 0, colSpan: 2});
        var reloadButton = new qx.ui.toolbar.Button(self.tr("Recargar"), qxnw.config.execIcon("edit-redo"));
        toolbar.add(reloadButton);
        reloadButton.setToolTipText(self.tr("Recargar mensajes"));
        reloadButton.addListener("execute", function() {
            this.fireEvent("reload");
            self.populateList();
        }, this);
        reloadButton.setEnabled(false);

        var button = new qx.ui.form.ToggleButton("Recargar automáticamente", qxnw.config.execIcon("preferences-clock", "apps"));
        button.setValue(true);
        button.addListener("execute", function(e) {
            if (!e.getTarget().getValue()) {
                reloadButton.setEnabled(true);
                if (!self.__isTimerStopped) {
                    self.__timer.stop();
                    self.__isTimerStopped = true;
                }
            } else {
                reloadButton.setEnabled(false);
                if (self.__isTimerStopped) {
                    self.__timer.start();
                    self.__isTimerStopped = false;
                }
            }
        }, this);
        toolbar.add(button);

        var label = new qx.ui.basic.Label("Número de mensajes mostrados:");
        self.rows = new qx.ui.form.Spinner().set({
            maxWidth: 50,
            maxHeight: 25
        });
        self.rows.setValue(10);

        toolbar.add(label);
        toolbar.add(self.rows);

        self.list = new qx.ui.form.List();
        chatContainer.add(self.list, {row: 1, column: 0, colSpan: 2});
        self.textArea = new qx.ui.form.TextArea();
        chatContainer.add(self.textArea, {row: 2, column: 0});
        self.textArea.setPlaceholder(self.tr("Ingrese su mensaje..."));
        self.textArea.addListener("input", function(e) {
            var value = e.getData();
            postButton.setEnabled(value.length < 140 && value.length > 0);
        }, this);
//        self.textArea.addListener("click", function(e) {
//            self.readNotificationChats();
//        }, this);
        self.textArea.addListener("focus", function(e) {
            self.readNotificationChats();
        }, this);

        var postButton = new qx.ui.form.Button(self.tr("Enviar"));
        chatContainer.add(postButton, {row: 2, column: 1});
        postButton.setToolTipText(self.tr("Envíe su mensaje"));
        postButton.addListener("execute", function() {
            self.sendMessage();
            this.fireDataEvent("post", self.textArea.getValue());
            self.textArea.focus();
        }, this);
        postButton.setWidth(60);
        postButton.setEnabled(false);

        var toolBarDown = new qx.ui.toolbar.ToolBar();
        chatContainer.add(toolBarDown, {row: 3, column: 0, colSpan: 2});
        var checkEnter = new qx.ui.form.CheckBox(self.tr("Enviar al dar Enter"));
        self.__sendOnEnter = qxnw.config.getSendOnEnter();
        checkEnter.setValue(self.__sendOnEnter);
        toolBarDown.add(checkEnter);

        checkEnter.addListener("changeValue", function(e) {
            self.__sendOnEnter = e.getData();
            qxnw.local.storeData("send_on_enter", e.getData());
        });

        self.addListener("keypress", function(e) {
            if (e.getKeyIdentifier() == "Enter") {
                if (self.__sendOnEnter) {
                    self.sendMessage();
                    self.fireDataEvent("post", self.textArea.getValue());
                    self.textArea.focus();
                }
            }
        }, this);

        self.textArea.focus();

        self.addListener("minimize", function(e) {
            self.__isMinimized = true;
        });
        self.addListener("appear", function(e) {
            self.__isMinimized = false;
            self.__isAlerted = false;
            self.textArea.focus();
        });
        self.__isTimerStopped = false;
    },
    destruct: function destruct() {
        this._disposeObjects("textArea");
        this._disposeObjects("list");
        this._disposeObjects("__timer");
        this._disposeObjects("rightList");
    },
    members: {
        __timer: null,
        __isTimerCreated: false,
        textArea: null,
        list: null,
        __sendOnEnter: true,
        rightList: null,
        __isMinimized: null,
        __messagesEqual: true,
        __isAlerted: false,
        __isAddedMessage: false,
        __isPrivate: true,
        pr: null,
        parent: null,
        populateUsersList: function populateUsersList(data) {
            var self = this;
            var rpc = new qxnw.rpc(qxnw.userPolicies.getRpcUrl(), "master");
            rpc.setShowLoading(false);
            rpc.setAsync(true);
            rpc.setHandleError(false);
            var func = function(r) {
                var child = self.rightList.getChildren();
                if (child.length == 0) {
                    self.rightList.removeAll();
                    for (var i = 0; i < r.length; i++) {
                        var text = "";
                        text += "<b>" + r[i].nombre + "   ";
                        text += "[" + r[i].usuario + "</b>]   ";
                        text += r[i].private_messages > 0 ? "(" + r[i].private_messages + ")" : "";
                        var icon = null;
                        if (r[i].private_messages > 0) {
                            icon = qxnw.config.execIcon("mail-mark-important");
                            self.tryToNotify();
                        } else {
                            icon = qxnw.config.execIcon("dialog-apply");
                        }
                        var item = new qxnw.widgets.listItem(text, icon);
                        item.setRich(true);
                        item.setModel(r[i]);
                        self.rightList.add(item);
                        if (data["room"] == 0) {
                            self.parent.setTitle("Chat :: Usuarios conectados: " + r.length);
                        }
                    }
                } else {
                    for (var ia = 0; ia < r.length; ia++) {
                        if (typeof child[ia] != 'undefined') {
                            var modelChildren = child[ia].getModel();
                            if (r[ia].id == modelChildren.id && r[ia].private_messages == modelChildren.private_messages) {
                                continue;
                            } else {
                                self.rightList.removeAll();
                                for (var i = 0; i < r.length; i++) {
                                    var text = "";
                                    text += "<b>" + r[i].nombre + "   ";
                                    text += "[" + r[i].usuario + "</b>]   ";
                                    text += r[i].private_messages > 0 ? "(" + r[i].private_messages + ")" : "";
                                    var icon = null;
                                    if (r[i].private_messages > 0) {
                                        icon = qxnw.config.execIcon("mail-mark-important");
                                        if (r[i].private_messages != modelChildren.private_messages) {
                                            self.tryToNotify();
                                        }
                                    } else {
                                        icon = qxnw.config.execIcon("dialog-apply");
                                    }

                                    var item = new qxnw.widgets.listItem(text, icon);
                                    item.setRich(true);
                                    item.setModel(r[i]);
                                    self.rightList.add(item);
                                }
                                if (data["room"] == 0) {
                                    self.parent.setTitle("Chat :: Usuarios conectados: " + r.length);
                                }
                                return;
                            }
                        }
                    }
                }
            };
            if (data["room"] == 0) {
                rpc.exec("getConnectedUsers", data, func);
            } else {
                rpc.exec("getRoomUsers", data, func);
            }
        },
        tryToNotify: function tryToNotify() {
            var self = this;
            if (self.parent.getWinIsMinimized()) {
                if (!self.parent.getIsAlerted()) {
                    //main.sendMinimizedAlert(self.parent.getAppWidgetName());
                    var funcOnClick = function(n) {
                        self.parent.restore();
                        main.maximizeWindow(self.parent.getAppWidgetName());
                        self.textArea.focus();
                        self.parent.setIsAlerted(false);
                    };
                    var funcOnClose = function() {
                        self.parent.setIsAlerted(false);
                    };
                    qxnw.notifications.createNotification(self, "Ha recibido un nuevo mensaje privado...", 0, funcOnClick, funcOnClose);
                    self.parent.setIsAlerted(true);
                    self.makeSound();
                }
            }
        },
        sendMessage: function sendMessage() {
            var self = this;
            var data = {};
            data["message"] = self.textArea.getValue();
            if (data["message"] == "") {
                return;
            }
            if (data["message"] == null) {
                return;
            }

            data["user_private"] = self.pr["usuario"];
            var rpc = new qxnw.rpc(self.getRpcUrl(), "master");
            rpc.setShowLoading(false);
            rpc.setAsync(true);
            rpc.setHandleError(false);
            var func = function(r) {

                var up = qxnw.userPolicies.getInstance().getData();
                var text = "";
                var d = new Date();
                var curr_date = d.getDate();
                var curr_month = d.getMonth() + 1;
                if (curr_month < 10) {
                    curr_month = "0" + curr_month;
                }
                var curr_year = d.getFullYear();
                text += "[<b>" + up.user + "</b>]   ";
                text += "<span style='font-size: 10px; color: #999;'>[" + curr_year + "-" + curr_month + "-" + curr_date + "]   ";
                text += "[" + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds() + "]</span>   ";
                text += self.textArea.getValue();
                var item = new qxnw.widgets.listItem(text);
                var model = {};
                item.setModel(model);
                item.setRich(true);
                self.list.add(item);

                self.textArea.setValue("");

                self.__isAddedMessage = true;
            };
            rpc.exec("sendPrivateMessage", data, func);
        }
        ,
        populateList: function populateList(sel) {
            var self = this;
            var data = {};
            data["rows"] = self.rows.getValue();
            if (sel != undefined) {
                self.pr = sel[0];
                data["user_private"] = sel[0].usuario;
            } else {
                data["user_private"] = self.pr["usuario"];
            }
            self.list.removeAll();
            var rpc = new qxnw.rpc(self.getRpcUrl(), "master");
            rpc.setShowLoading(false);
            rpc.setAsync(true);
            rpc.setHandleError(false);
            var func = function(r) {
                if (r == null) {
                    return;
                }
                var child = self.list.getChildren();
                if (child.length == 0) {
                    self.list.removeAll();
                    for (var i = 0; i < r.length; i++) {
                        var text = "";
                        var color = qxnw.config.processRandomColors(r[i].usuario_envia);
                        text += "[<b style='color: " + color + ";'>" + r[i].usuario_envia + "</b>]   ";
                        text += "<span style='font-size: 10px; color: #999;'>[" + r[i].fecha + "]   ";
                        text += "[" + r[i].hora + "]</span>   ";
                        text += r[i].mensaje;
                        var item = new qxnw.widgets.listItem(text, qxnw.config.execIcon("dialog-apply"));
                        item.setModel(r[i]);
                        item.setRich(true);
                        self.list.add(item);
                        if (i + 1 == r.length) {
                            self.__lastMensageId = r[i].id;
                        }
                    }
                    return;
                } else {
                    for (var ia = 0; ia < r.length; ia++) {
                        if (parseInt(r[ia].id) > parseInt(self.__lastMensageId)) {
                            self.__lastMensageId = r[ia].id;
                            self.clearSendedMessages();
                            var item = self.addItem(r[ia]);
                            var index = self.list.indexOf(item);
                            self.list.scrollByY(index + 20, 1);
                            self.__messagesEqual = false;
                            if (i + 1 == r.length) {
                                self.__lastMensageId = r[ia].id;
                            }
                            var up = qxnw.userPolicies.getInstance().getData();
                            if (up.user != r[ia].usuario_envia) {
                                self.tryToNotify();
                            }
                        }
                    }
                }
            };
            rpc.exec("getPrivateMessages", data, func);
        },
        readNotificationChats: function readNotificationChats() {
            var self = this;
            var data = {};
            data["user_private"] = self.pr["usuario"];
            var rpc = new qxnw.rpc(self.getRpcUrl(), "master");
            rpc.setShowLoading(false);
            rpc.setAsync(true);
            rpc.setHandleError(false);
            var func = function(r) {
            };
            rpc.exec("readNotificationChats", data, func);
        },
        clearSendedMessages: function clearSendedMessages() {
            var self = this;
            var child = self.list.getChildren();
            if (child == null) {
                return;
            }
            for (var i = 0; i < child.length; i++) {
                var childModel = child[i].getModel();
                if (typeof childModel == 'undefined' || childModel == null || typeof childModel.id == 'undefined') {
                    self.list.remove(child[i]);
                }
            }
        },
        addItem: function addItem(r) {
            var self = this;
            var text = "";
            var color = qxnw.config.processRandomColors(r.usuario_envia);
            text += "[<b style='color: " + color + ";'>" + r.usuario_envia + "</b>]   ";
            text += "<span style='font-size: 10px; color: #999;'>[" + r.fecha + "]   ";
            text += "[" + r.hora + "]</span>   ";
            text += r.mensaje;
            var item = new qxnw.widgets.listItem(text, qxnw.config.execIcon("dialog-apply"));
            item.setModel(r);
            item.setRich(true);
            self.list.add(item);
            return item;
        },
        setParamRecord: function setParamRecord(pr) {
            var self = this;
            self.pr = pr;
            self.__isPrivate = true;
            self.setTitle("Chat privado con " + pr["nombre"]);
            self.populateList();

            self.__timer = new qx.event.Timer(5000);
            self.__timer.start();
            self.__timer.addListener("interval", function(e) {
                self.populateList();
                if (self.__isMinimized) {
                    if (!self.__messagesEqual) {
                        if (!self.__isAlerted) {
                            main.sendMinimizedAlert(self);
                            self.__isAlerted = true;
                            var sound = new qx.bom.media.Audio("/resource/qxnw/chat.wav");
                            sound.play();
                        }
                    }
                }
            });
        }
    }
});