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
 * Class containing all rooms structure
 */
qx.Class.define("qxnw.chat.rooms", {
    extend: qx.core.Object,
    include: [qx.locale.MTranslation],
    construct: function construct(room_no, title, parent) {
        this.base(arguments);
        var self = this;
        self.parent = parent;
        self.__randomColors = [];
        self.__titleAll = title;
        var page = new qx.ui.tabview.Page(title);

        self.mainSpliter = new qx.ui.splitpane.Pane("horizontal");
        page.add(self.mainSpliter);

        self.pageAll = page;

        var data = [
            {
                "room": room_no,
                "title": title
            }
        ];
        self.__roomNo = room_no;
        self.__roomName = title;
        self.setUserData("room", data);
        page.addListener("appear", function (e) {
            self.textArea.focus();
            qx.bom.element.Class.add(this.getContentElement().getDomElement(), "nwchat_initial");
        });
        self.__page = page;
        if (room_no == 0) {
            page.setShowCloseButton(false);
        } else {
            page.setShowCloseButton(true);
        }
        page.setLayout(new qx.ui.layout.Grow());
        var layout = new qx.ui.layout.Grid(0, 0);
        layout.setRowFlex(1, 1);
        layout.setColumnFlex(0, 1);
        layout.setColumnFlex(1, 1);
        layout.setColumnMinWidth(0, 1);
        layout.setColumnMaxWidth(0, 1);
        self.containerChatMain = new qx.ui.container.Composite(layout);
        self.mainSpliter.add(self.containerChatMain);
        var toolbar = new qx.ui.toolbar.ToolBar().set({
            alignY: "middle",
            alignX: "center",
            spacing: 5
        });
        self.toolbar = toolbar;
        self.containerChatMain.add(toolbar, {row: 0, column: 1, colSpan: 2});
        var reloadButton = new qx.ui.toolbar.Button(self.tr("Recargar"), qxnw.config.execIcon("edit-redo"));
        toolbar.add(reloadButton);
        reloadButton.setToolTipText(self.tr("Recargar mensajes"));
        reloadButton.addListener("execute", function () {
            this.fireEvent("reload");
            self.populateListPrivate();
        }, this);
        reloadButton.setEnabled(false);

        if (qx.core.Environment.get("browser.name") != "ie") {
            if (window.location.protocol == "https:") {
                var buttonLlamada = new qx.ui.form.Button(self.tr("Llamar"), qxnw.config.execIcon("camera-web", "devices"));
                buttonLlamada.setUserData("state", "cancall");
                buttonLlamada.setEnabled(false);
                self.buttonLlamada = buttonLlamada;
                buttonLlamada.addListener("execute", function (e) {
                    if (buttonLlamada.getUserData("state") == "cancall") {
                        if (self.callInProgress === true) {
                            qxnw.utils.information(self.tr("Tiene una llamada en progreso"));
                            return;
                        }
                        self.startCall();
                        buttonLlamada.setLabel(self.tr("Cancelar"));
                        buttonLlamada.setUserData("state", "ringing");
                    } else {
                        self.stopCall();
                        buttonLlamada.setLabel(self.tr("Llamar"));
                        buttonLlamada.setUserData("state", "cancall");
                    }
                }, this);
                toolbar.add(buttonLlamada);
            }
        }
        var button = new qx.ui.form.ToggleButton(self.tr("Recarga automática"), qxnw.config.execIcon("preferences-clock", "apps"));
        button.setValue(true);
        button.addListener("execute", function (e) {
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
        var label = new qx.ui.basic.Label(self.tr("# mensajes:"));
        self.rows = new qx.ui.form.Spinner().set({
            maxWidth: 50,
            maxHeight: 25
        });
        self.rows.setValue(qxnw.config.getChatNumberMessages());
        self.rows.addListener("changeValue", function () {
            qxnw.local.storeData("chat_number_messages", this.getValue());
        });
        toolbar.add(label);
        toolbar.add(self.rows);
        self.list = new qxnw.widgets.list();
        self.containerChatMain.add(self.list, {row: 1, column: 1, colSpan: 2});
        self.textArea = new qx.ui.form.TextArea();
        self.textArea.setFilter(/[^\'\\{}|]/g);
        self.containerChatMain.add(self.textArea, {row: 2, column: 1});
        self.textArea.setPlaceholder(self.tr("Ingrese su mensaje..."));
        self.textArea.addListener("input", function (e) {
            var value = e.getData();
            postButton.setEnabled(value.length > 0);
            self.canCall = true;
        }, this);
        self.textArea.addListener("focusin", function () {
            self.__haveFocus = true;
        });
        self.textArea.addListener("focusout", function () {
            self.__haveFocus = false;
        });
        var postButton = new qx.ui.form.Button(self.tr("Enviar"), qxnw.config.execIcon("dialog-apply"));
        self.containerChatMain.add(postButton, {row: 2, column: 2});
        postButton.setToolTipText(self.tr("Envíe su mensaje"));
        postButton.addListener("execute", function () {
            this.fireDataEvent("post", self.textArea.getValue());
            self.sendMessage();
            self.textArea.focus();
        }, this);
        postButton.setWidth(80);
        postButton.setEnabled(false);
        //self.textArea.setEnabled(false);

        self.textArea.addListener("focus", function (e) {
            self.readNotificationChats();
        }, this);

        var toolBarDown = new qx.ui.toolbar.ToolBar();
        self.containerChatMain.add(toolBarDown, {row: 3, column: 1, colSpan: 2});
        self.containerChatMain.add(toolBarDown);
        var checkEnter = new qx.ui.form.CheckBox(self.tr("Enviar al dar Enter"));
        self.__sendOnEnter = qxnw.config.getSendOnEnter();
        checkEnter.setValue(self.__sendOnEnter);
        toolBarDown.add(checkEnter);
        checkEnter.addListener("changeValue", function (e) {
            self.__sendOnEnter = e.getData();
            qxnw.local.storeData("send_on_enter", e.getData());
        });
        var spacer = new qx.ui.core.Spacer(30, 5);
        toolBarDown.add(spacer);
        var showAtInit = new qx.ui.form.CheckBox(self.tr("Abrir al inicio"));
        showAtInit.setValue(qxnw.config.getShowChatAtInit() == 'false' ? false : qxnw.config.getShowChatAtInit());
        showAtInit.addListener("changeValue", function (e) {
            qxnw.local.storeData("show_chat_at_init", e.getData());
        });
        if (data[0]["room"] != 0) {
            showAtInit.setVisibility("excluded");
        }
        toolBarDown.add(showAtInit);
        self.textArea.addListener("keypress", function (e) {
            var iden = e.getKeyIdentifier();
            if (iden == "Enter") {
                if (self.__sendOnEnter) {
                    self.fireDataEvent("post", self.textArea.getValue());
                    self.sendMessage();
                    postButton.focus();
                    self.textArea.focus();
                    e.preventDefault();
                }
            } else if (iden == "Up") {
                self.editLastMessage();
            } else if (iden == "Escape") {
                if (self.editionMode == true) {
                    self.clearEditedMode();
                }
            }
        }, this);

        var rightContainer = new qx.ui.container.Composite(new qx.ui.layout.VBox());

        self.rightList = new qxnw.widgets.list().set({
            width: 200
        });
        rightContainer.add(self.rightList, {
            flex: 1
        });
        self.rightList.addListener("click", function () {
            qxnw.utils.loading(self.tr("Cargando chat privado..."));
            self.isPrivate = true;
            self.list.removeAll();
            var selected = self.rightList.getModelSelection().toArray();
            var up = qxnw.userPolicies.getInstance().getData();
            if (typeof selected[0] != 'undefined') {
                if (up["user"] != selected[0]["usuario"]) {
                    self.populateListPrivate(selected);
                    self.textArea.focus();
                }
                self.usuarioLlega = selected[0]["usuario"];
            }
            if (typeof buttonLlamada != 'undefined') {
                buttonLlamada.setEnabled(true);
            }
            self.readNotificationChats();
        });
        self.mainSpliter.add(rightContainer, 0);
        var newRoomButton = new qx.ui.form.Button("", qxnw.config.execIcon("list-add"));
        if (room_no == 0) {
            newRoomButton.setLabel(self.tr("Nueva sala"));
            newRoomButton.addListener("execute", function () {
                parent.addRoom();
            });
        } else {
            newRoomButton.setLabel(self.tr("Agregar usuarios"));
            newRoomButton.addListener("execute", function () {
                parent.addUsers({room: self.__roomNo, title: self.__roomName});
            });
        }
        rightContainer.add(newRoomButton);
//        self.containerChatMain.add(newRoomButton, {
//            column: 3,
//            row: 2
//        });

        var state = new qxnw.fields.selectBox();
        var datos = {};
        datos["disponible"] = "Disponible";
        datos["ocupado"] = "Ocupad@";
        datos["ausente"] = "Ausente";
        qxnw.utils.populateSelectFromArray(state, datos);
        self.toolbar.add(state);

        var stateModel = qxnw.local.getData("nw_chat_state");
        if (stateModel != null) {
            state.setValue(stateModel);
        }
        state.addListener("changeSelection", function () {
            var state = this.getValue();
            qxnw.local.setData("nw_chat_state", state["model"]);
        });

        var terminalCheck = new qx.ui.form.CheckBox(self.tr("Mostrar mi terminal"));
        terminalCheck.setUserData("data", data);
        var terminal = qxnw.local.getData("nw_chat_terminal");
        if (terminal != null) {
            terminalCheck.setValue(terminal);
        }
        terminalCheck.addListener("changeValue", function () {
            var val = this.getValue();
            qxnw.local.setData("nw_chat_terminal", val);
            self.populateUsersList(this.getUserData("data")[0]);
        });
        self.toolbar.add(terminalCheck);

        var salaPrincipal = new qx.ui.form.Button(self.tr("Sala principal"), qxnw.config.execIcon("go-home"));
        salaPrincipal.setShow("icon");
        salaPrincipal.setUserData("data", data);
        salaPrincipal.addListener("execute", function () {
            self.isPrivate = false;
            if (typeof buttonLlamada != 'undefined') {
                buttonLlamada.setEnabled(false);
            }
            qxnw.utils.loading(self.tr("Cargando sala principal..."));
            var d = {};
            d["room"] = 0;
            self.list.removeAll();
            self.pr = null;
            if (self.__timer != null) {
                self.__timer.stop();
            }
            self.parent.setTitle(self.tr("Sala principal"));
            self.pageAll.setLabel(self.tr("Sala principal"));
            self.populateList(d);
            self.__timerSalaPrincipal.start();
            self.textArea.focus();
        });
        self.toolbar.add(salaPrincipal);

        self.populateList(data[0]);
        self.populateUsersList(data[0]);
        self.rightList.addListener("contextmenu", function (e) {
            self.contextMenu(e);
        });
        self.__timerSalaPrincipal = new qx.event.Timer(qxnw.config.getTimeChatRequest());
        self.__timerSalaPrincipal.start();
        self.__timerSalaPrincipal.addListener("interval", function (e) {
            var data = self.getUserData("room");
            if (self.isPrivate == true) {
                self.populateListPrivate(data[0]);
            } else {
                self.populateList(data[0]);
            }
        });
        self.__timerUsers = new qx.event.Timer(qxnw.config.getTimeUsersChatRequest());
        self.__timerUsers.start();
        self.__timerUsers.addListener("interval", function (e) {
            var data = self.getUserData("room");
            self.populateUsersList(data[0]);
        });
        self.textArea.focus();

        page.addListener("close", function () {
            qxnw.utils.question(self.tr("¿Desea eliminar la sala?"), function (e) {
                if (e) {
                    self.deleteRoom();
                }
            });
        });
        self.__soundedItems = [];
    },
    properties: {
        randomColor: {
            init: null,
            check: "String"
        }
    },
    destruct: function destruct() {
        if (this.__timerSalaPrincipal) {
            this.__timerSalaPrincipal.stop();
        }
        this.__timer = null;
        if (this.__timer) {
            this.__timer.stop();
        }
        this.__timer = null;
        if (this.__timerUsers) {
            this.__timerUsers.stop();
        }
        this.__timerUsers = null;
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
        __messagesEqualGeneral: true,
        __isAlerted: false,
        __isAddedMessage: false,
        __lastMensageId: null,
        __lastMensageGeneralId: null,
        containerChatMain: null,
        __isFocused: false,
        __command_copy: null,
        parent: null,
        __page: null,
        __roomNo: null,
        __roomName: null,
        __randomColors: null,
        __timerUsers: null,
        __titleAll: null,
        __itemTemp: null,
        initial: null,
        options: {},
        videoMe: null,
        videoRemote: null,
        containerChatVideo: null,
        canCall: false,
        notificationsLbl: null,
        usuarioLlega: null,
        toolbar: null,
        ringButton: null,
        callInProgress: false,
        intervalState: null,
        streamMe: null,
        buttonLlamada: null,
        userState: null,
        __soundedItems: null,
        pageAll: null,
        editionMode: false,
        editionId: false,
        isPrivate: false,
        sendEditedMessage: function sendEditedMessage(isPrivate) {
            var self = this;
            var data = {};
            data["id"] = self.editionId;
            var msg = self.textArea.getValue();
            data["message"] = msg + " <strong style='color: green;'>(edited)</strong>";
            self.clearEditedMode();
            if (typeof isPrivate != 'undefined' && isPrivate == true) {
                data["is_private"] = true;
            }
            qxnw.utils.fastAsyncCallRpc("master", "editChatMessage", data);
            var child = self.list.getChildren();
            if (child.length == 0) {
                return;
            }
            for (var i = 0; i < child.length; i++) {
                var children = child[i];
                var model = children.getModel();
                if (model.id == data["id"]) {
                    var up = qxnw.userPolicies.getInstance().getData();
                    var d = new Date();
                    var curr_date = d.getDate();
                    var curr_month = d.getMonth() + 1;
                    if (curr_month < 10) {
                        curr_month = "0" + curr_month;
                    }
                    var curr_year = d.getFullYear();
                    var color = qxnw.config.processRandomColors(up.user);
                    var text = "[<b style='color: " + color + ";'>" + up.user + "</b>]   ";
                    text += "<span style='font-size: 10px; color: #999;'>[" + curr_year + "-" + curr_month + "-" + curr_date + "]   ";
                    text += "[" + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds() + "]</span>   ";
                    text += data["message"];
                    children.setLabel(text);
                    break;
                }
            }
            self.list.scrollByY(200000, 1);
        },
        editLastMessage: function editLastMessage() {
            var self = this;
            self.editionMode = true;
            var child = self.list.getChildren();
            if (child.length == 0) {
                return;
            }
            var up = qxnw.userPolicies.getUserData();
            for (var i = child.length - 1; i > 0; i--) {
                var children = child[i];
                var model = children.getModel();
                if (model.usuario_envia == up.user) {
                    var msg = model.mensaje;
                    msg = msg.replace("<strong style='color: green;'>(edited)</strong>", "");
                    msg = msg.replace("(edited)", "");
                    self.textArea.setValue(msg);
                    self.editionId = model.id;
                    break;
                }
            }
            self.textArea.setAppearance("widget");
            self.textArea.setLiveUpdate(true);
            self.textArea.getChildrenContainer().set({
                backgroundColor: "#efe75c"
            });
            var timer = new qx.event.Timer(100);
            timer.start();
            timer.addListener("interval", function (e) {
                this.stop();
                self.textArea.selectAllText();
            });
        },
        clearEditedMode: function clearEditedMode() {
            var self = this;
            self.editionMode = false;
            self.editionId = null;
            self.textArea.setAppearance("textarea");
            self.textArea.setValue("");
        },
        startVideoAndPeer: function startVideoAndPeer() {
            var self = this;

            var moz = !!navigator.mozGetUserMedia;
            var chromeVersion = !!navigator.mozGetUserMedia ? 0 : parseInt(navigator.userAgent.match(/Chrom(e|ium)\/([0-9]+)\./)[2]);

            var layout = self.containerChatMain.getLayout();
            layout.setColumnWidth(1, 300);
            self.containerChatVideo = new qx.ui.container.Composite(new qx.ui.layout.VBox()).set({
                minWidth: 310,
                minHeight: 300,
                maxHeight: 300
            });
            var iceServers = [];

            if (moz) {
                iceServers.push({
                    url: 'stun:23.21.150.121'
                });

                iceServers.push({
                    url: 'stun:stun.services.mozilla.com'
                });
            } else {
                iceServers.push({
                    url: 'stun:stun.l.google.com:19302'
                });

                iceServers.push({
                    url: 'stun:stun.anyfirewall.com:3478'
                });
            }

            if (!moz && chromeVersion < 28) {
                iceServers.push({
                    url: 'turn:homeo@turn.bistri.com:80',
                    credential: 'homeo'
                });
            }

            if (!moz && chromeVersion >= 28) {
                iceServers.push({
                    url: 'turn:turn.bistri.com:80',
                    credential: 'homeo',
                    username: 'homeo'
                });

                iceServers.push({
                    url: 'turn:turn.anyfirewall.com:443?transport=tcp',
                    credential: 'webrtc',
                    username: 'webrtc'
                });
            }

            iceServers.push({
                'url': 'turn:192.158.29.39:3478?transport=udp',
                'credential': 'JZEOEt2V3Qb0y27GRntt2u2PAYA=',
                'username': '28224511:1379330808'
            });
            iceServers.push({
                'url': 'turn:192.158.29.39:3478?transport=tcp',
                'credential': 'JZEOEt2V3Qb0y27GRntt2u2PAYA=',
                'username': '28224511:1379330808'
            });
            iceServers.push({
                url: 'turn:turn.bistri.com:80',
                username: 'homeo',
                credential: 'homeo'
            });
            iceServers.push({
                url: 'stun:stun.l.google.com:19302'
            });
            iceServers.push({
                url: 'stun:stun1.l.google.com:19302'
            });
            iceServers.push({
                url: 'stun:stun2.l.google.com:19302'
            });
            iceServers.push({
                url: 'stun:stu3.l.google.com:19302'
            });
            iceServers.push({
                url: 'stun:stun4.l.google.com:19302'
            });
            iceServers.push({
                url: 'stun:stun.ekiga.net'
            });
            iceServers.push({
                url: 'stun:stun.ideasip.com'
            });
            iceServers.push({
                url: 'stun:stun.iptel.org'
            });
            iceServers.push({
                url: 'stun:stun.rixtelecom.se'
            });
            iceServers.push({
                url: 'stun:stun.schlund.de'
            });
            iceServers.push({
                url: 'stun:stunserver.org'
            });
            iceServers.push({
                url: 'stun:stun.softjoys.com'
            });
            iceServers.push({
                url: 'stun:stun.voiparound.com'
            });
            iceServers.push({
                url: 'stun:stun.voipbuster.com'
            });
            iceServers.push({
                url: 'stun:stun.voipstunt.com'
            });
            iceServers.push({
                url: 'stun:stun.stunprotocol.org:3478'
            });
            iceServers.push({
                url: 'stun:stun.services.mozilla.com'
            });
            iceServers.push({
                url: 'stun:stun.sipgate.net'
            });
            iceServers.push({
                url: 'turn:numb.viagenie.ca:3478',
                username: 'assdres@gmail.com',
                credential: 'padre08'
            });

            var servers = {
                iceServers: iceServers
            };

            var pc = self.getPeer(servers);
            self.pc = pc;
            self.pc.onaddstream = function (event) {
                var vid = self.videoRemote.getDomElement();
                vid.src = URL.createObjectURL(event.stream);
                vid.play();
            };

            var css = {
                heigth: 100,
                width: 100
            };
            var arrbtRemote = {
                autoPlay: true,
                width: 300
            };

            self.videoRemote = new qx.html.Element("video", css, arrbtRemote);

            var arrbtMe = {
                autoPlay: true,
                width: 100,
                muted: true
            };

            self.videoMe = new qx.html.Element("video", css, arrbtMe);
            self.containerChatVideoIntro = new qx.ui.container.Composite(new qx.ui.layout.VBox()).set({
                minHeight: 300
            });
            self.containerChatVideoNotifications = new qx.ui.container.Composite(new qx.ui.layout.VBox()).set({
                minHeight: 10
            });
            self.notificationsLbl = new qx.ui.basic.Label().set({
                rich: true
            });

            self.checkStateButton = new qx.ui.form.Button("Estado", qxnw.config.execIcon("document-properties")).set({
                maxHeight: 40,
                show: "icon"
            });
            self.checkStateButton.addListener("click", function () {
                self.checkConnectionState();
            });

            self.muteButton = new qx.ui.form.Button("Pause", qxnw.config.execIcon("media-playback-pause")).set({
                maxHeight: 40,
                show: "icon"
            });
            self.muteButton.addListener("click", function () {
                self.muteMe(this);
            });

            self.cancelButton = new qx.ui.form.Button("Cancelar", qxnw.config.execIcon("media-playback-stop")).set({
                maxHeight: 40,
                show: "icon"
            });
            self.cancelButton.addListener("click", function () {
                self.stopCall();
                self.buttonLlamada.setLabel(self.tr("Llamar"));
                self.buttonLlamada.setUserData("state", "cancall");
            });

            self.sizeButton = new qx.ui.form.Button("Tamaño", qxnw.config.execIcon("zoom-in")).set({
                maxHeight: 40,
                show: "icon"
            });
            self.sizeButton.setUserData("size", "maximized");
            self.sizeButton.addListener("click", function () {
                var ud = this.getUserData("size");
                if (ud == "maximized") {
                    self.changeSize(ud);
                    this.setIcon(qxnw.config.execIcon("zoom-out"));
                    this.setUserData("size", "mimimized");
                } else {
                    self.changeSize(ud);
                    this.setIcon(qxnw.config.execIcon("zoom-in"));
                    this.setUserData("size", "maximized");
                }
            });

            self.setNotification(self.tr("Creando interfaz..."));

            var containerTools = new qx.ui.container.Composite(new qx.ui.layout.HBox());
            containerTools.add(self.checkStateButton);
            containerTools.add(self.muteButton);
            containerTools.add(self.cancelButton);
            containerTools.add(self.sizeButton);

            self.containerChatVideoNotifications.add(containerTools);
            self.containerChatVideoNotifications.add(new qx.ui.core.Spacer());
            self.containerChatVideoNotifications.add(self.notificationsLbl);

            self.containerChatVideoIntro.getContentElement().add(self.videoMe, {
                flex: 0
            });

            self.containerChatVideoIntro.getContentElement().add(self.videoRemote, {
                flex: 0
            });
            self.containerChatVideo.add(self.containerChatVideoIntro);
            self.containerChatMain.add(self.containerChatVideoNotifications, {
                column: 0,
                row: 2
            });
            self.containerChatMain.add(self.containerChatVideo, {
                column: 0,
                row: 1
            });
        },
        muteMe: function muteMe(sender) {
            var vid = this.videoMe.getDomElement();
            var audioTracks = this.streamMe.getAudioTracks();
            var videoTracks = this.streamMe.getVideoTracks();
            if (vid.paused) {
                vid.play();
                sender.setIcon(qxnw.config.execIcon("media-playback-pause"));
                if (audioTracks[0]) {
                    audioTracks[0].enabled = true;
                }
                if (videoTracks[0]) {
                    videoTracks[0].enabled = true;
                }
                this.setNotification(this.tr("Conectado"));
            } else {
                vid.pause();
                sender.setIcon(qxnw.config.execIcon("media-playback-start"));
                if (audioTracks[0]) {
                    audioTracks[0].enabled = false;
                }
                if (videoTracks[0]) {
                    videoTracks[0].enabled = false;
                }
                this.setNotification(this.tr("En pausa"));
            }
        },
        setNotification: function setNotification(text) {
            var html = "<br /><br /><br /><br />";
            html += "<strong style='size: 22'>";
            html += "<b>";
            html += text;
            html += "</b>";
            html += "</strong>";
            var rta = "";
            this.notificationsLbl.setValue(html + "  " + rta);
        },
        stopCall: function stopCall() {
            var self = this;

            try {
                var layout = self.containerChatMain.getLayout();
                layout.setColumnWidth(1, 0);

                var wd = layout.getCellWidget(2, 0);
                wd.destroy();

                var wd1 = layout.getCellWidget(1, 0);
                wd1.destroy();

                self.containerChatVideo = null;
                self.containerChatVideoNotifications = null;

            } catch (e) {
                console.log(e);
            }
            qxnw.utils.fastAsyncRpcCall("master", "clearCalls");
            self.callInProgress = false;

            var streams = self.pc.getRemoteStreams();
            for (var stream in streams) {
                try {
                    self.pc.removeStream(stream);
                } catch (e) {

                }
            }
            if (self.streamMe != null) {
                try {
                    self.streamMe.stop();
                } catch (e) {
                    console.log(e);
                }
            }

            if (self.pc != null) {
                self.pc.close();
                self.pc = null;
            }
            if (self.videoMe != null) {
                var vid = self.videoMe.getDomElement();
                vid.pause();
                vid.src = "";
                self.videoMe = null;
            }
            if (self.videoRemote != null) {
                vid = self.videoRemote.getDomElement();
                vid.pause();
                vid.src = "";
                self.videoRemote = null;
            }
        },
        answerCall: function answerCall() {
            var self = this;
            self.startVideoAndPeer();
            self.setNotification(self.tr("Verificando llamada..."));
            var func = function (rta) {
                function error(err) {
                    qxnw.utils.error(err);
                }
                self.pc.onicecandidate = function (evt) {
                    self.setNotification(self.tr("Guardando información de conexión"));
                    var v = {};
                    if (evt.candidate == null) {
                        return;
                    }
                    v["candidate"] = JSON.stringify(evt.candidate);
                    v["usuario"] = self.usuarioLlega;
                    qxnw.utils.fastAsyncCallRpc("master", "saveCandidate", v, 0, 0, false);
                };
                self.getUserMedia({video: true, audio: true}, function (stream) {
                    var vid = self.videoMe.getDomElement();
                    vid.src = URL.createObjectURL(stream);
                    vid.play();
                    self.streamMe = stream;
                    var val = {
                        'type': "offer",
                        'sdp': rta
                    };
                    self.pc.addStream(stream);
                    self.pc.setRemoteDescription(self.getSessionDescription(val), function () {
                        self.pc.createAnswer(function (answer) {
                            self.pc.setLocalDescription(self.getSessionDescription(answer), function () {
                                var d = {
                                    answer: answer.sdp,
                                    usuario: self.usuarioLlega
                                };
                                self.setNotification(self.tr("Respondiendo interfaz..."));
                                qxnw.utils.fastAsyncRpcCall("master", "saveResponseSecondRtc", d);
                                self.startSearchCandidates();
                            }, error);
                        }, error);
                    }, error);
                });
            };
            var d = {
                usuario: self.usuarioLlega
            };
            qxnw.utils.fastAsyncRpcCall("master", "getRtc", d, func);
        },
        startRing: function startRing(user) {
            var self = this;
            self.usuarioLlega = user;
            if (self.ringButton == null) {
                self.ringButton = new qx.ui.form.Button(user + " llamando", qxnw.config.execIcon("telephone", "qxnw"));
                self.ringButton.addListener("click", function (e) {
                    self.answerCall();
                    self.ringButton.destroy();
                    self.ringButton = null;
                }, this);
                self.toolbar.add(self.ringButton);
            }
            qxnw.animation.startEffect("shake", self.ringButton);
            qxnw.utils.makeSound();
        },
        startCall: function startCall() {
            var self = this;
            self.startVideoAndPeer();
            function error(err) {
                qxnw.utils.error(err);
            }
            //var constraints: { 'mandatory': { 'OfferToReceiveAudio': true, 'OfferToReceiveVideo': true } };
            self.pc.onicecandidate = function (evt) {
                self.setNotification(self.tr("Guardando información de conexión"));
                var v = {};
                if (evt.candidate == null) {
                    return;
                }
                v["candidate"] = JSON.stringify(evt.candidate);
                v["usuario"] = self.usuarioLlega;
                qxnw.utils.fastAsyncCallRpc("master", "saveCandidate", v, 0, 0, false);
            };
            self.setNotification(self.tr("Generando llamada"));
            self.getUserMedia({audio: true, video: true}, function (stream) {
                self.pc.addStream(stream);
                var vid = self.videoMe.getDomElement();
                vid.src = URL.createObjectURL(stream);
                vid.play();
                self.streamMe = stream;
                self.pc.createOffer(function (offer) {
                    self.pc.setLocalDescription(self.getSessionDescription(offer), function () {
                        var d = {
                            offer: offer.sdp,
                            usuario: self.usuarioLlega
                        };
                        self.setNotification(self.tr("Enviando información de llamada"));
                        var funcOffer = function () {
                            self.setNotification(self.tr("Información de llamada enviada... esperando respuesta"));
                        };
                        qxnw.utils.fastAsyncRpcCall("master", "processRtc", d, funcOffer);
                    }, error);
                }, error);
            }, function (error) {
                alert(error);
            });
            self.interval = setInterval(function () {
                self.testIsAnswered();
            }, 3000);
        },
        changeSize: function changeSize(type) {
            var vid = this.videoRemote.getDomElement();
            if (type == "maximized") {
                vid.width = 500;
                this.videoRemote.width = 500;
                this.containerChatVideoIntro.setWidth(600);
            } else {
                vid.width = 300;
                this.videoRemote.width = 300;
                this.containerChatVideoIntro.setWidth(300);
            }
        },
        checkConnectionState: function checkConnectionState() {
            var self = this;
            var state = self.pc.iceConnectionState;
            var msg = "<b>Descripción:</b> ";
            switch (state) {
                case "new":
                    msg += "the ICE agent is gathering addresses or waiting for remote candidates (or both)";
                    break;
                case "checking":
                    msg += "the ICE agent has remote candidates, on at least one component, and is check them, though it has not found a connection yet. At the same time, it may still be gathering candidates";
                    break;
                case "connected":
                    msg += "the ICE agent has found a usable connection for each component, but is still testing more remote candidates for a better connection. At the same time, it may still be gathering candidates";
                    break;
                case "completed":
                    msg += "the ICE agent has found a usable connection for each component, and is no more testing remote candidates";
                    break;
                case "failed":
                    msg += "the ICE agent has checked all the remote candidates and didn't find a match for at least one component. Connections may have been found for some components";
                    break;
                case "disconnected":
                    msg += "liveness check has failed for at least one component. This may be a transient state, e. g. on a flaky network, that can recover by itself";
                    break;
                case "closed":
                    msg += " the ICE agent has shutdown and is not answering to requests";
                    break;
            }
            var signalState = self.pc.signalingState;
            msg = "<b>Estado de señal:</b> " + signalState + ". " + msg;

            var gatheringState = self.pc.iceGatheringState;
            msg = "<b>Estado de puerta:</b> " + gatheringState + ". " + msg;

            var candidate = self.pc.peerIdentity;
            msg = "<b>Candidato:</b> " + candidate + ". " + msg;

            qxnw.utils.information(msg);
        },
        getPeer: function getPeer(parameter) {
            var genericRTCPeerConnection;
            if (typeof RTCPeerConnection !== "undefined") {
                genericRTCPeerConnection = RTCPeerConnection;
            }
            if (typeof mozRTCPeerConnection !== "undefined") {
                genericRTCPeerConnection = mozRTCPeerConnection;
            }
            if (typeof webkitRTCPeerConnection !== "undefined") {
                genericRTCPeerConnection = webkitRTCPeerConnection;
            }
            if (typeof msRTCPeerConnection !== "undefined") {
                genericRTCPeerConnection = msRTCPeerConnection;
            }
            if (typeof genericRTCPeerConnection === "undefined") {
                return false;
            }
            return new genericRTCPeerConnection(parameter);
        },
        getSessionDescription: function getSessionDescription(parameter) {
            var genericRTCSessionDescription;
            if (typeof RTCSessionDescription !== "undefined") {
                genericRTCSessionDescription = RTCSessionDescription;
            }
            if (typeof mozRTCSessionDescription !== "undefined") {
                genericRTCSessionDescription = mozRTCSessionDescription;
            }
            if (typeof webkitRTCSessionDescription !== "undefined") {
                genericRTCSessionDescription = webkitRTCSessionDescription;
            }
            if (typeof msRTCSessionDescription !== "undefined") {
                genericRTCSessionDescription = msRTCSessionDescription;
            }
            return new genericRTCSessionDescription(parameter);
        },
        getUserMedia: function getUserMedia(options, callback) {
            navigator.genericGetUserMedia = (
                    navigator.getUserMedia ||
                    navigator.webkitGetUserMedia ||
                    navigator.mozGetUserMedia ||
                    navigator.msGetUserMedia
                    );
            navigator.genericGetUserMedia(options, callback, function (error) {
                qxnw.utils.error(error);
            });
        },
        getRtcCandidate: function getRtcCandidate(candidate) {
            var genericRTCIceCandidate;
            if (typeof RTCIceCandidate !== "undefined") {
                genericRTCIceCandidate = RTCIceCandidate;
            }
            if (typeof mozRTCIceCandidate !== "undefined") {
                genericRTCIceCandidate = mozRTCIceCandidate;
            }
            if (typeof webkitRTCIceCandidate !== "undefined") {
                genericRTCIceCandidate = webkitRTCIceCandidate;
            }
            if (typeof msRTCIceCandidate !== "undefined") {
                genericRTCIceCandidate = msRTCIceCandidate;
            }
            return new genericRTCIceCandidate(candidate);
        },
        testIsAnswered: function testIsAnswered() {
            var self = this;
            function error(err) {
                qxnw.utils.error(err);
            }
            self.setNotification(self.tr("Marcando..."));
            var d = {
                usuario: self.usuarioLlega
            };
            var func = function (rta) {
                if (rta != false) {
                    var v = {
                        type: "answer",
                        sdp: rta
                    };
                    self.setNotification(self.tr("Llamada exitosa"));
                    self.pc.setRemoteDescription(self.getSessionDescription(v), function () {
                        self.setNotification(self.tr("Conectado"));
                        self.callInProgress = true;
                        self.startSearchCandidates();
                    }, error);
                    window.clearInterval(self.interval);
                }
            };
            qxnw.utils.fastAsyncRpcCall("master", "haveResponseRtc", d, func, 0, false);
        },
        startSearchCandidates: function startSearchCandidates() {
            var self = this;
            self.setNotification(self.tr("Recuperando información de conexión"));
            var func = function (rta) {
                if (rta == null) {
                    return;
                }
                rta = rta.substring(2);
                var arr = rta.split("||");
                for (var i = 0; i < arr.length; i++) {
                    var candidate = JSON.parse(arr[i]);
                    if (candidate != null) {
                        self.pc.addIceCandidate(self.getRtcCandidate(candidate));
                    }
                }
                self.setNotification(self.tr("Conectado"));
                self.callInProgress = true;
            };
            var d = {};
            d["usuario"] = self.parent.up.user;
            qxnw.utils.fastAsyncRpcCall("master", "getCandidates", 0, func);
        },
        deleteRoom: function deleteRoom() {
            var rpc = new qxnw.rpc(qxnw.userPolicies.getRpcUrl(), "master");
            rpc.setAsync(true);
            rpc.exec("deleteRoom", this.__roomNo);
        },
        close: function close() {
            this._disposeObjects("textArea");
            this._disposeObjects("list");
            this._disposeObjects("__timer");
            this._disposeObjects("rightList");
        },
        getPage: function getPage() {
            return this.__page;
        },
        makeSound: function makeSound(sound) {
            if (typeof sound == 'undefined') {
                sound = "/resource/qxnw/chat.wav";
            }
            var soundW = new qx.bom.media.Audio(sound);
            soundW.play();
        },
        alreadySounded: function alreadySounded() {
            var self = this;
            if (typeof self.pr == 'undefined' || self.pr == null) {
                if (typeof self.__soundedItems["general"] == 'undefined') {
                    self.__soundedItems["general"] = true;
                    return false;
                } else {
                    return true;
                }
            }
            if (typeof self.__soundedItems[self.pr["usuario"]] == 'undefined') {
                self.__soundedItems[self.pr["usuario"]] = true;
                return false;
            } else {
                return true;
            }
            return true;
        },
        sendMessage: function sendMessage() {
            var self = this;
            var data = {};

            if (!self.alreadySounded()) {
                self.makeSound("/nwlib6/audio/008872064_prev.mp3");
            }

            data["message"] = self.textArea.getValue();

            data["message"] = self.checkHaveUrl(data["message"]);

            if (data["message"] == "") {
                return;
            }
            if (data["message"] == null) {
                return;
            }

            if (typeof self.pr == 'undefined' || self.pr == null) {
                if (self.editionMode == true && self.editionId != null) {
                    self.sendEditedMessage();
                    return;
                }
                self.sendMessageGeneral();
                return;
            }

            data["user_private"] = self.pr["usuario"];

            if (self.editionMode == true && self.editionId != null) {
                self.sendEditedMessage(true);
                return;
            }

            self.textArea.setValue("");

            var rpc = new qxnw.rpc(qxnw.userPolicies.getRpcUrl(), "master");
            rpc.setShowLoading(false);
            rpc.setAsync(true);
            //rpc.setHandleError(false);
            var up = qxnw.userPolicies.getInstance().getData();
            var text = "";
            var d = new Date();
            var curr_date = d.getDate();
            var curr_month = d.getMonth() + 1;
            if (curr_month < 10) {
                curr_month = "0" + curr_month;
            }
            var curr_year = d.getFullYear();
            var fecha_hoy = curr_year + "-" + curr_month + "-" + curr_date + " " + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();
            var mensaje = data["message"];

            text += "<div class='item_chat_temp_div'  contenteditable='true'>";
            text += "<b style='color: #999;'>" + up.user + "</b>: ";
            text += mensaje;
            text += "</div>";
            text += "<span style='font-size: 10px; color: #999;'>" + fecha_hoy + "</span>  ";

            var item = new qx.ui.form.ListItem(text);
            item.setRich(true);
            self.list.add(item);
            self.__itemTemp = item;
            item.addListener("appear", function () {
                qx.bom.element.Class.add(this.getContentElement().getDomElement(), "item_chat_temp");
            });
            self.__isAddedMessage = true;
            self.list.scrollByY(200000, 1);
            rpc.exec("sendPrivateMessage", data);
        },
        sendMessageGeneral: function sendMessageGeneral() {
            var self = this;
            var data = {};
            data["message"] = self.textArea.getValue();
            data["room"] = self.__roomNo;
            if (data["message"] == "" || data["message"] == null) {
                return;
            }

            data["message"] = self.checkHaveUrl(data["message"]);

            self.textArea.setValue("");

            var rpc = new qxnw.rpc(qxnw.userPolicies.getRpcUrl(), "master");
            rpc.setShowLoading(false);
            rpc.setAsync(true);
            //rpc.setHandleError(false);
            var up = qxnw.userPolicies.getInstance().getData();
            var text = "";
            var d = new Date();
            var curr_date = d.getDate();
            var curr_month = d.getMonth() + 1;
            if (curr_month < 10) {
                curr_month = "0" + curr_month;
            }
            var curr_year = d.getFullYear();
            var color = qxnw.config.processRandomColors(up.user);
            text += "[<b style='color: " + color + ";'>" + up.user + "</b>]   ";
            text += "<span style='font-size: 10px; color: #999;'>[" + curr_year + "-" + curr_month + "-" + curr_date + "]   ";
            text += "[" + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds() + "]</span>   ";
            text += data["message"];
            var item = new qx.ui.form.ListItem(text);
            item.setRich(true);
            self.list.add(item);
            self.__isAddedMessage = true;
            item.addListener("appear", function () {
                qx.bom.element.Class.add(this.getContentElement().getDomElement(), "item_chat_temp");
            });
            var index = self.list.indexOf(item);
            self.list.scrollByY(index + 2000, 1);
            rpc.exec("sendMessage", data);
        },
        processRandomColors: function processRandomColors(key) {
            for (var i = 0; i < this.__randomColors.length; i++) {
                if (key === this.__randomColors[i]["key"]) {
                    return this.__randomColors[i]["color"];
                }
            }
            var color = qxnw.utils.createRandomColor();
            var data = {
                key: key,
                color: color
            };
            this.__randomColors.push(data);
            return color;
        },
        checkHaveUrl: function checkHaveUrl(string) {
            if (string == "") {
                return string;
            }
            try {
                var exploded = string.split(" ");
                for (var i = 0; i < exploded.length; i++) {
                    if (qxnw.utils.checkStringIsUrl(exploded[i])) {
                        exploded[i] = "<a style='color: blue; text-decoration: underline;' target='_blank' href='" + exploded[i] + "' >" + exploded[i] + "</a>";
                    }
                }
                return exploded.join(" ");
            } catch (e) {
                return string;
            }
        },
        populateList: function populateList(dat) {
            var self = this;
            var data = {};
            self.clearSendedMessages();
            data["rows"] = self.rows.getValue();
            data["room"] = dat["room"];
            var rpc = new qxnw.rpc(qxnw.userPolicies.getRpcUrl(), "master");
            rpc.setShowLoading(false);
            rpc.setAsync(true);
            rpc.setHandleError(false);
            var func = function (r) {
                self.list.removeAll();
                for (var i = 0; i < r.length; i++) {
                    var text = "";
                    var color = qxnw.config.processRandomColors(r[i].usuario_envia);
                    text += "[<b style='color: " + color + ";'>" + r[i].usuario_envia + "</b>]   ";
                    text += "<span style='font-size: 10px; color: #999;'>[" + r[i].fecha + "]   ";
                    text += "[" + r[i].hora + "]</span>   ";
                    r[i].mensaje = self.checkHaveUrl(r[i].mensaje);
                    r[i].mensaje = r[i].mensaje.replace("(edited)", "<strong style='color: green;'>(edited)</strong>");
                    text += r[i].mensaje;
                    var item = new qx.ui.form.ListItem(text, qxnw.config.execIcon("dialog-apply")).set({
                        rich: true,
                        selectable: true,
                        focusable: true
                    });
                    item.setModel(r[i]);
                    item.setRich(true);
                    self.list.add(item);
                    if (i + 1 == r.length) {
                        self.__lastMensageGeneralId = r[i].id;
                    }
                }
                self.list.scrollByY(200000, 1);
                qxnw.utils.stopLoading();
            };
            rpc.exec("getMessages", data, func);
        },
//        populateParam: function populateParam() {
//            var self = this;
//            self.__timer = new qx.event.Timer(5000);
//            self.__timer.start();
//            self.__timer.addListener("interval", function(e) {
//                self.populateListPrivate();
//                if (self.__isMinimized) {
//                    if (!self.__messagesEqual) {
//                        if (!self.__isAlerted) {
//                            main.sendMinimizedAlert(self);
//                            self.__isAlerted = true;
//                            var sound = new qx.bom.media.Audio("/resource/qxnw/chat.wav");
//                            sound.play();
//                        }
//                    }
        //                }
//            });
//        },
        readNotificationChats: function readNotificationChats() {
            var self = this;
            var data = {};
            if (typeof self.pr == 'undefined' || self.pr == null) {
                return;
            }
            data["user_private"] = self.pr["usuario"];
            var rpc = new qxnw.rpc(qxnw.userPolicies.getRpcUrl(), "master");
            rpc.setShowLoading(false);
            rpc.setAsync(true);
            rpc.setHandleError(false);
            var func = function (r) {
            };
            rpc.exec("readNotificationChats", data, func);
        },
        setParamRecord: function setParamRecord() {
            var self = this;
//            self.pr = pr;
//            self.__isPrivate = true;
//            self.setTitle("Chat privado con " + pr["nombre"]);
            //            self.populateListPrivate();
            self.textArea.setEnabled(true);
            self.textArea.focus();
            self.__timerSalaPrincipal.stop();
            self.__timer = new qx.event.Timer(5000);
            self.__timer.start();
            self.__timer.addListener("interval", function (e) {
                self.populateListPrivate();
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
        },
        populateListPrivate: function populateListPrivate(sel) {
            var self = this;
            if (self.initial == null) {
                self.initial = "hola";
                self.setParamRecord();
            }
            self.clearSendedMessages();
            var data = {};
            data["rows"] = self.rows.getValue();
            if (typeof sel != 'undefined' && typeof sel[0] != 'undefined') {
                self.pr = sel[0];
                data["user_private"] = sel[0].usuario;
            } else {
                data["user_private"] = self.pr["usuario"];
            }
            var lblTitle = "Chat privado con " + data["user_private"];
            self.parent.setTitle(lblTitle);
            self.pageAll.setLabel(lblTitle);

            var rpc = new qxnw.rpc(qxnw.userPolicies.getRpcUrl(), "master");
            rpc.setShowLoading(false);
            rpc.setAsync(true);
            rpc.setHandleError(false);
            var func = function (r) {
                if (r == null) {
                    return;
                }
                self.list.removeAll();
                for (var i = 0; i < r.length; i++) {
                    var text = "";
                    var color = "";
                    if (data["user_private"] == r[i].usuario_recibe) {
                        color = "blue";
                    } else {
                        color = "red";
                    }
                    r[i].mensaje = r[i].mensaje.replace("(edited)", "<strong style='color: green;'>(edited)</strong>");
                    text += "<div class='item_chat_temp_div'  contenteditable='true'>";
                    text += "<b style='color: " + color + ";'>" + r[i].usuario_envia + "</b>: ";
                    text += r[i].mensaje;
                    text += "</div>";
                    text += "<span style='font-size: 10px; color: #999;'>" + r[i].fecha + "  " + r[i].hora + "</span>  ";

                    var item = new qx.ui.form.ListItem(text, qxnw.config.execIcon("dialog-apply")).set({
                        rich: true,
                        selectable: true,
                        focusable: true
                    });
                    item.setModel(r[i]);
                    item.setRich(true);
                    item.addListener("appear", function () {
                        qx.bom.element.Class.add(this.getContentElement().getDomElement(), "item_chat_stand");
                    });
                    self.list.add(item);
                    self.list.scrollByY(200000, 1);
                    if (i + 1 == r.length) {
                        self.__lastMensageId = r[i].id;
                    }
                }
                qxnw.utils.stopLoading();
            };
            self.list.scrollByY(200000, 1);
            rpc.exec("getPrivateMessages", data, func);
        },
        clearSendedMessages: function clearSendedMessages() {
            var self = this;
            var child = self.list.getChildren();
            if (child == null) {
                return;
            }
            for (var i = 0; i < child.length; i++) {
                var childModel = child[i].getModel();
                if (childModel == null || typeof childModel.id == 'undefined') {
                    self.list.remove(child[i]);
                }
            }
        },
        addItem: function addItem(r, isGeneral) {
            var self = this;
            var text = "";
            //            var color = qxnw.config.processRandomColors(r.usuario_envia);
            var color = "";
            if (typeof self.pr == 'undefined' || self.pr == null) {
                color = qxnw.config.processRandomColors(r.usuario_envia);
            } else {
                if (self.pr["usuario"] == r.usuario_recibe) {
                    color = "blue";
                } else {
                    color = "red";
                }
            }
            r.mensaje = self.checkHaveUrl(r.mensaje);
            if (typeof isGeneral != 'undefined' && isGeneral == true) {
                text += "[<b style='color: " + color + ";'>" + r.usuario_envia + "</b>]   ";
                text += "<span style='font-size: 10px; color: #999;'>[" + r.fecha + "]   ";
                text += "[" + r.hora + "]</span>   ";
                text += r.mensaje;
            } else {
                text += "<div class='item_chat_temp_div'  contenteditable='true'>";
                text += "<b style='color: " + color + ";'>" + r.usuario_envia + "</b>: ";
                text += r.mensaje;
                text += "</div>";
                text += "<span style='font-size: 10px; color: #999;'>" + r.fecha + "  " + r.hora + "</span>  ";
            }
            var item = new qx.ui.form.ListItem(text, qxnw.config.execIcon("dialog-apply")).set({
                rich: true,
                selectable: true,
                focusable: true
            });
            item.setModel(r);
            item.setRich(true);
            self.list.add(item);
            return item;
        },
        contextMenu: function contextMenu(pos) {
            var self = this;
            var m = new qxnw.contextmenu(this);
            m.setParentWidget(self.rightList);
            var selected = self.rightList.getModelSelection().toArray();
            var up = qxnw.userPolicies.getInstance().getData();
            if (up["user"] != selected[0]["usuario"]) {
                m.addAction("Chat privado", qxnw.config.execIcon("help-faq"), function (e) {
                    self.slotPrivateChat(selected);
                });
            }
            m.exec(pos);
        },
        slotPrivateChat: function slotPrivateChat(selected) {
            var self = this;
            var f = new qxnw.chat.privado.form(self.parent);
            f.setParamRecord(selected[0]);
            var page = new qx.ui.tabview.Page("Chat privado con " + selected[0].nombre);
            page.addListener("appear", function (e) {
                qx.bom.element.Class.add(this.getContentElement().getDomElement(), "nwchat_others");
            });
            page.setShowCloseButton(true);
            page.setLayout(new qx.ui.layout.Grow());
            var scrollContainer = new qx.ui.container.Scroll();
            var desktop = new qx.ui.window.Desktop();
            desktop.set({
                decorator: "main",
                backgroundColor: "black"
            });
            scrollContainer.add(desktop);
            page.add(scrollContainer);
            f.removeListenerById(f.getListenerIdAppear());
            f.removeListenerById(f.getListenerIdMove());
            f.set({
                showClose: false,
                showMinimize: false,
                showMaximize: false
            });
            f.setResizable(false);
            f.getChildControl("captionbar").setVisibility("excluded");
            f.show();
            desktop.add(f, {
                width: "100%",
                height: "100%",
                top: 0,
                left: 0
            });
            self.parent.tabView.add(page);
            self.parent.tabView.setSelection([page]);
        },
        populateUsersList: function populateUsersList(data) {
            var self = this;
            var rpc = new qxnw.rpc(qxnw.userPolicies.getRpcUrl(), "master");
            rpc.setShowLoading(false);
            rpc.setAsync(true);
            //rpc.setHandleError(false);
            var func = function (ra) {
                if (typeof ra.haveMessage != 'undefined') {
                    self.startRing(ra.userCall);
                }
                var r = ra.records;
                if (self.rightList != null) {
                    self.rightList.removeAll();
                }
                if (r.length == 0) {
                    self.parent.setTitle("Chat :: Usuarios conectados: " + r.length);
                    return;
                }
                for (var i = 0; i < r.length; i++) {
                    var text = "";
                    text += "<b>" + r[i].nombre + "   ";
                    text += "[" + r[i].usuario + "</b>]   ";
                    text += r[i].private_messages > 0 ? "(" + r[i].private_messages + ")" : "";
                    var icon = null;
                    if (r[i].private_messages > 0) {
                        icon = qxnw.config.execIcon("mail-mark-important");
                        if (self.__haveFocus == false) {
                            self.tryToNotify();
                        }
                    } else {
                        icon = qxnw.config.execIcon("dialog-apply");
                        if (typeof r[i].estado_chat != 'undefined') {
                            switch (r[i].estado_chat) {
                                case "ocupado":
                                    icon = qxnw.config.execIcon("list-remove");
                                    break;
                                case "ausente":
                                    icon = qxnw.config.execIcon("system-log-out");
                                    break;
                            }
                        }
                    }
                    var item = new qx.ui.form.ListItem(text, icon).set({
                        rich: true,
                        selectable: true,
                        focusable: true
                    });
                    item.setRich(true);
                    item.setModel(r[i]);
                    self.rightList.add(item);
                    if (data["room"] == 0) {
                        self.parent.setTitle("Chat :: Usuarios conectados: " + r.length);
                    }
                }
            };
            var stateModel = qxnw.local.getData("nw_chat_state");
            var terminal = qxnw.local.getData("nw_chat_terminal");
            data["state"] = stateModel;
            data["terminal"] = terminal;
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
                    var funcOnClick = function (n) {
                        self.parent.restore();
                        main.maximizeWindow(self.parent.getAppWidgetName());
                        self.textArea.focus();
                        self.parent.setIsAlerted(false);
                    };
                    var funcOnClose = function () {
                        self.parent.setIsAlerted(false);
                    };
                    qxnw.notifications.createNotification(self, "Ha recibido un nuevo mensaje privado...", 0, funcOnClick, funcOnClose);
                    self.parent.setIsAlerted(true);
                    main.sendMinimizedAlert(self.parent);
                    self.makeSound();
                }
            }
        }
    }
});