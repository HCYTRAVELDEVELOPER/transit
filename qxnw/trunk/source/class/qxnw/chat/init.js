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
 * Main class of qxnw chat
 */
qx.Class.define("qxnw.chat.init", {
    extend: qxnw.forms,
    construct: function construct() {
        this.base(arguments);
        var self = this;
        var fields = [];
        self.setFields(fields);
        self.ui.accept.hide();
        self.ui.cancel.set({
            label: "Cerrar"
        });
        self.ui.cancel.addListener("execute", function (e) {
            self.reject();
        });
        self.setTitle(self.tr("Chat"));
        self.addListener('modified', function (e) {
            var bounds = e.getData();
            if (typeof bounds["width"] == 'undefined') {
                return;
            }
            var width = qx.bom.Viewport.getWidth() - (bounds.width + 30);
            self.moveTo(width, 30);
        });

        if (qxnw.local.getData("chat_modified") == null) {
            self.addListenerOnce('appear', function (e) {
                var bounds = this.getBounds();
                if (typeof bounds["width"] == 'undefined') {
                    return;
                }
                var width = qx.bom.Viewport.getWidth() - (bounds.width + 30);
                self.moveTo(width, 30);
                qxnw.local.storeData("chat_modified", true);
            });
        }
        self.tabView = new qx.ui.tabview.TabView();
        self.tabView.setContentPadding(2);
        self.addWidget(self.tabView, {
            flex: 1
        });
//        
//        
//        
//        
//        
//        
//        
//        
//        self.__timer = new qx.event.Timer(10000);
//        self.__timer.start();
//        self.__timer.addListener("interval", function(e) {
//            console.log({
//                minimizado: self.__isMinimized,
//                messages_equal: self.__messagesEqual,
//                alerta: self.__isAlerted
//            });
//            if (self.__isMinimized) {
//                if (!self.__messagesEqual && typeof self.__messagesEqual != 'undefined') {
//                    if (!self.__isAlerted) {
//                        var funcOnClick = function() {
//                            self.restore();
//                            main.maximizeWindow(self.getRealClassName());
//                            self.getFocusElement().focus();
//                        };
//                        qxnw.notifications.createNotification(self, "Ha recibido un nuevo mensaje privado...", 0, funcOnClick);
//                        self.__isAlerted = true;
//                        self.makeSound();
//                        self.__messagesEqual = true;
//                    }
//                }
//            }
//        });
//        ///TODO LADY
        self.addListener("minimize", function (e) {
            self.__isMinimized = true;
            self.__isAlerted = false;
        });
        self.addListener("restore", function (e) {
            self.__isAlerted = false;
        });
        self.addListener("appear", function (e) {
            self.__isMinimized = false;
            self.__isAlerted = false;
        });
        self.__isTimerStopped = false;
        self.roomPublic = new qxnw.chat.rooms(0, "Sala pública", self);
//        roomPublic.setParamRecord();
        var page = self.roomPublic.getPage();
        self.tabView.add(page);
        self.tabView.setSelection([page]);
        self.__roomsNumber = 1;
        self.populateRooms();
        self.__rooms = [];
        self.__rooms.push(self.roomPublic);
    },
    destruct: function destruct() {
        try {
            for (var i = 0; i < this.__rooms.length; i++) {
                this.__rooms[i].dispose();
            }
            this._disposeObjects("textArea");
            this._disposeObjects("list");
            this._disposeObjects("__timer");
            this._disposeObjects("rightList");
        } catch (e) {
            console.log(e);
        }
    },
    members: {
        __timer: null,
        __isTimerCreated: false,
        __isFocused: false,
        __command_copy: null,
        __roomsNumber: null,
        __rooms: null,
        __isAlerted: true,
        roomPublic: null,
        getIsAlerted: function getIsAlerted() {
            return this.__isAlerted;
        },
        setIsAlerted: function setIsAlerted(alerted) {
            this.__isAlerted = alerted;
        },
        getWinIsMinimized: function getWinIsMinimized() {
            return this.__isMinimized;
        },
        setWinIsMinimized: function setWinIsMinimized(isMin) {
            this.__isMinimized = isMin;
        },
        setMessagesEqual: function setMessagesEqual(bool) {
            this.__messagesEqual = bool;
        },
        populateRooms: function populateRooms() {
            var self = this;
            var rpc = new qxnw.rpc(self.getRpcUrl(), "master");
            rpc.setAsync(true);
            var func = function (r) {
                for (var i = 0; i < r.length; i++) {
                    var room = new qxnw.chat.rooms(r[i].id, r[i].nombre, self);
                    var page = room.getPage();
                    self.tabView.add(page);
                    self.tabView.setSelection([page]);
                    self.__rooms.push(room);
                }
                self.__roomsNumber = r.length;
            };
            rpc.exec("getRoomsByUser", 0, func);
        },
        addRoom: function addRoom(title) {
            var self = this;
            if (self.__roomsNumber >= 3) {
                qxnw.utils.information("Para evitar sobrecarga de transacciones, puede crear máximo 2 salas.");
                return;
            }
            var f = new qxnw.chat.forms.newRoom();
            f.addListener("close", function () {
                self.__roomsNumber--;
            });
            f.settings.accept = function () {
                var fields = f.getRecord();
                fields.users = f.getUsersList();
                if (typeof fields["title"] == 'undefined') {
                    title = self.tr("Nueva sala");
                } else {
                    title = fields["title"];
                }
                var rpc = new qxnw.rpc(self.getRpcUrl(), "master");
                rpc.setAsync(true);
                var func = function (r) {
                    var room = new qxnw.chat.rooms(r.id, r.title, self);
                    var page = room.getPage();
                    self.tabView.add(page);
                    self.tabView.setSelection([page]);
                };
                rpc.exec("newRoom", fields, func);
                self.__roomsNumber++;
            };
            f.show();
        },
        addUsers: function addUsers(data) {
            var f = new qxnw.chat.forms.newRoom();
            f.setParamRecord(data);
            f.show();
        },
        makeSound: function makeSound() {
            var sound = new qx.bom.media.Audio("/resource/qxnw/chat.wav");
            sound.play();
        }
    }
});