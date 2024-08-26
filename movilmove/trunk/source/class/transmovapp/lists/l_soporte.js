qx.Class.define("transmovapp.lists.l_soporte", {
    extend: qxnw.lists,
    construct: function (table) {
        var self = this;
        this.base(arguments);
        this.buttonsAutomatic = true;
        this.createBase();
        var columns = [
            {
                label: "Sala",
                caption: "id"
            },
            {
                label: "Usuario",
                caption: "usuario"
            },
            {
                label: "Comentarios",
                caption: "comentario"
            },
            {
                label: "Estado",
                caption: "estado"
            },
            {
                label: "Fecha",
                caption: "fecha"
            },
            {
                label: "Hora",
                caption: "hora"
            },
            {
                label: "Contestar Chat",
                caption: "chat",
                type: "html"
            },
            {
                label: "Cerrar chat",
                caption: "cerrar",
                type: "html"
            },
            {
                label: "Empresa",
                caption: "empresa"
            },
            {
                label: "Perfil",
                caption: "perfil"
            },
            {
                label: "Token",
                caption: "token"
            },
            {
                label: "Mensaje",
                caption: "ultimo_mensaje"
            },
            {
                label: "Leido",
                caption: "leido"
            }
        ];
        self.setColumns(columns);
        self.table.setRowHeight(90);
        var filters = [
            {
                name: "empresa",
                caption: "empresa",
                label: "empresa",
                type: "textField",
                visible: false
            },
            {
                name: "buscar",
                caption: "buscar",
                label: "Filtro...",
                type: "textField"
            }
        ];
        self.createFilters(filters);
        self.setAllPermissions(true);

        self.ui.deleteButton.addListener("click", function () {
            self.slotEliminar();
        });
        self.ui.editButton.addListener("click", function () {
            self.slotEditar();
        });
        self.ui.unSelectButton.addListener("click", function () {
            self.clearSelection();
        });
        self.ui.selectAllButton.addListener("click", function () {
            self.selectAll();
        });
        self.ui.updateButton.addListener("click", function () {
            self.applyFilters();
        });
        self.ui.searchButton.addListener("execute", function () {
            self.applyFilters();
        });
        self.ui.newButton.addListener("click", function () {
            self.slotNuevo();
        });
        self.table.addListener("cellTap", function (e) {
            var r = self.selectedRecord();
            if (r == undefined) {
                qxnw.utils.alert("Seleccione un registro");
                return;
            }
            var col = e.getColumn();
            console.log(col);
            if (col == 6) {
                self.slotChat(r);
            }
            if (col == 7) {
                self.slotFinChat(r);
            }
        });

        self.execSettings();
        self.hideColumn("empresa");
        self.hideColumn("token");
        self.hideColumn("perfil");
        self.hideColumn("leido");

        self.applyFilters();
        self.interval = setInterval(function () {
            self.applyFilters();
        }, 10000);
    },
    destruct: function () {
    },
    members: {
        contextMenu: function contextMenu() {
            var self = this;
        },
        slotFinChat: function slotFinChat(pr) {
            var self = this;
            pr.estado = "CERRADO";
            var rpc = new qxnw.rpc(self.getRpcUrl(), "servicios_admin");
            rpc.setAsync(true);
            var func = function (r) {
                qxnw.utils.information("El chat se cerro correctamente.");
                self.applyFilters();
            };
            rpc.exec("updateEstateSalasChat", pr, func);
        },
        slotChat: function slotChat(pr) {
            var self = this;
            datos_chat = pr;
            datos_chat.nombre = "Chat Soporte";
            pr.estado = "ATENDIENDO";
            var rpc = new qxnw.rpc(self.getRpcUrl(), "servicios_admin");
            var r = rpc.exec("updateEstateSalasChat", pr);
            if (rpc.isError()) {
                qxnw.utils.error(rpc.getError());
                return;
            }
            self.applyFilters();
            var frame = document.querySelector('.framechat_conversation_' + pr.id);
            if (frame) {
                qxnw.utils.information("El chat de esta sala ya esta abierto varifique por favor.");
                return;
            }


            function cleanUserNwC(u) {
                if (u === null) {
                    return "";
                }
                u = u.toString();
                var id = u.replace(/\//gi, "");
                id = id.replace(/\?/gi, "");
                id = id.replace(/\=/gi, "");
                id = id.replace(/\./gi, "");
                id = id.replace(/\,/gi, "");
                id = id.replace(/\&/gi, "");
                id = id.replace(/\=/gi, "");
                id = id.replace(/\@/gi, "");
                id = id.replace(/\-/gi, "");
                id = id.replace(/\./gi, "");
                id = id.replace(/\_/gi, "");
                id = id.replace(/\-/gi, "");
                id = id.replace(/\ /gi, "");
                id = id.replace(/\!/gi, "");
                id = id.replace(/\:/gi, "");
                id = id.replace(".", "");
                var acentos = "ÃÀÁÄÂÈÉËÊÌÍÏÎÒÓÖÔÙÚÜÛãàáäâèéëêìíïîòóöôùúüûÑñÇç";
                var original = "AAAAAEEEEIIIIOOOOUUUUaaaaaeeeeiiiioooouuuunncc";
                for (var i = 0; i < acentos.length; i++) {
                    id = id.replace(acentos.charAt(i), original.charAt(i));
                }
                return id;
            }

            var up = qxnw.userPolicies.getUserData();
            var chat = new qxnw.forms();
            chat.setTitle("Sala " + pr.id + " Conductor " + pr.usuario);
            chat.setMaxWidth(400);
            chat.setMinWidth(400);
            chat.setMaxHeight(500);
            chat.setMinHeight(500);
            chat.addListener("appear", function () {
                var frame = document.querySelector('.framechat_conversation_' + pr.id);
                if (frame) {
                    return;
                }
                frame = document.createElement('iframe');
                frame.className = 'framechat_conversation_' + pr.id;
                frame.id = 'framechat_conversation';
                frame.style = 'width: 100%;top: 0;left: 0;height: 100%;border: 0px;z-index: 13;position: absolute;';
                var host = window.location.origin;
                var domain = cleanUserNwC(host);
//                frame.src = host + '/nwlib6/nwproject/modules/webrtc/v4/index.html?myID=' + up.user + '&onlyChat=true&room=' + pr.id;
                frame.src = host + "/nwlib6/nwproject/modules/webrtc/v6/chat/index.html?room=" + domain + pr.id + "&setUserName=" + up.nombre + " (Operador)&setUserPhoto=" + up.foto + "&setUserEmail=" + up.email + "&id_user=" + up.user + "&saveToken=false";
                frame.allow = "geolocation; microphone; camera";
                var div = chat.getContentElement().getDomElement();
                var element = div.querySelector('.qx-window-pane');
                element.classList.add("conte_chat_" + pr.id);
                element.appendChild(frame);
                var iframeWin = frame.contentWindow;
                var m = {};
                m.tipo = "add_css_ringow";
                var cs = "";
                cs += ".encStatus{position: relative;}";
                cs += ".closeChat,.myName,.encPhoto{display:none!important;}";
                cs += ".contentChat{border-radius: 0px!important;}";
                cs += ".encChat{color: #6b6b6b;height: auto;min-height: inherit;background-color: #dc461e;padding: 5px 0;border-radius: 0;vertical-align: middle;align-items: center;}";
                cs += ".encChat *{margin:0 15px;}";
                cs += ".settingsEnc{position: relative!important;right: 0!important;background: #6b6b6b;border-radius: 5px;}";
                cs += ".statusTextOtherEnc span{left: 0;margin: 0px;background: #ffffff;}";
                cs += ".statusTextOtherEnc{top: 10px;}";
                cs += ".contentChat .message--mine .message__bubble{background-color: #dc461e}";
                cs += ".contentChat .message--theirs .message__bubble{background-color: #2f2f2f; color: #fff;}";
                m.message = cs;
                iframeWin.postMessage(m, '*');
            });

//            window.addEventListener('message', function (e) {
//                console.log(e);
//                if (e.data.tipo == "add_msg") {
//                    var datos = datos_chat;
//                    if (e.data.room) {
//                        if (/movilmove_number_/.test(e.data.room) != true) {
//                            if (datos.cliente_nombre != "Chat Soporte") {
//                                self.sendNotificacion({
//                                    title: "Nuevo mensaje de " + datos.nombre,
//                                    body: datos.nombre + ": " + e.data.text,
//                                    icon: "fcm_push_icon",
//                                    sound: "default",
//                                    data: "nw.dialog('Nuevo mensaje en el chat " + e.data.text + "')",
//                                    callback: "FCM_PLUGIN_ACTIVITY",
//                                    to: datos.token
//                                });
//                            }
//                        }
//                    }
//                }
//
//            });

            chat.show();
//            chat.reject(function () {
//                alert("hshs");
//            });



        },
        sendNotificacion: function sendNotificacion(array, callback) {
            var key = 'AIzaSyCOoH2AZXucFRnHljZOQxQC8PPwtuIqIss';
            var to = array.to;
            var notification = {
                'title': array.title,
                'body': array.body,
                'sound': array.sound,
                'icon': array.icon,
                'click_action': array.callback,
                "priority": "high",
                "content_available": true,
                "show_in_foreground": true
            };
            fetch('https://fcm.googleapis.com/fcm/send', {
                'method': 'POST',
                "content_available": true,
                'headers': {
                    'Authorization': 'key=' + key,
                    'Content-Type': 'application/json'
                },
                'body': JSON.stringify({
                    'notification': notification,
                    "show_in_foreground": true,
                    "content_available": true,
                    'priority': 'high',
//                "restricted_package_name":""
                    'to': to,
                    data: {
                        data: array.data,
                        callback: array.callback.toString(),
                        title: array.title,
                        body: array.body
                    }
                })
            }).then(function (response) {
                console.log(response);
            })
        },
        applyFilters: function applyFilters() {
            var self = this;
            var up = qxnw.userPolicies.getUserData();
            var data = {};
            data.filters = self.getFiltersData();
            var rpc = new qxnw.rpc(self.getRpcUrl(), "servicios_admin");
            var r = rpc.exec("consultaSalasChat", data);
            if (rpc.isError()) {
                qxnw.utils.error(rpc.getError());
                return;
            }
            self.setModelData(r);
            r.forEach(function (m) {
                if (m.leido == 0) {
                    var array = {};
                    array.title = "Soporte: Nuevo mensaje  " + m.usuario;
                    array.icon = location.origin + up.photo;
//                        array.icon = "http://localhost/imagenes/grupo.png";
                    array.body = m.ultimo_mensaje;

                    main.newNotificacion(array);

                    var body = document.querySelector("body");
                    var d = document.createElement("audio");
                    d.className = "soundNewAddUser";
                    d.src = "/nwlib6/audio/2019/point.mp3";
                    d.autoplay = "true";
                    d.onloadstart = function () {};
                    body.appendChild(d);
                    d.play();
                }
            });

            console.log(self.getAppWidgetName());
            var semaphore = [
                {
                    color: "#97ef82",
                    comment: "Test",
                    condition: "==",
                    column: "estado",
                    label: "Estado",
                    type: "Por fila", // "Sólo letra"
                    value: "LLAMANDO"
                }
            ];
            qxnw.local.storeData(self.getAppWidgetName() + "_colors", semaphore);
        },
        slotEditar: function slotEditar() {
            var self = this;
            var r = self.selectedRecord();
            if (r == undefined) {
                qxnw.utils.alert("Seleccione un registro");
                return;
            }
            var f = new qxnw.forms();
            var f = new qxnw.forms();
            f.setTitle("Establecer tiempos de espera");
            var fields = [
                {
                    name: " ",
                    type: "startGroup",
                    icon: "",
                    mode: "horizontal"
                },
                {
                    name: "id",
                    label: "ID",
                    caption: "id",
                    type: "textField",
                    visible: false
                },
                {
                    name: "empresa",
                    label: "ID Empresa",
                    caption: "empresa",
                    type: "textField",
                    required: true,
                    visible: false
                },
                {
                    name: "empresa_text",
                    label: "Empresa",
                    caption: "empresa_text",
                    type: "textField",
                    required: true,
                    visible: false
                },
                {
                    name: "label",
                    label: "<strong>Seleccione el tiempo de espera para la subcategoria o el recargo.</strong>",
                    caption: "label",
                    type: "label"
                },
                {
                    name: "",
                    type: "endGroup",
                    icon: ""
                },
                {
                    name: " ",
                    type: "startGroup",
                    icon: "",
                    mode: "horizontal"
                },
                {
                    name: "subcategoria",
                    label: "Subcategoria",
                    caption: "subcategoria",
                    type: "selectBox",
                    required: true
                },
                {
                    name: "recargo",
                    label: "Recargo",
                    caption: "recargo",
                    type: "selectBox",
                    required: true
                },
                {
                    name: "",
                    type: "endGroup",
                    icon: ""
                },
                {
                    name: " ",
                    type: "startGroup",
                    icon: "",
                    mode: "horizontal"
                },
                {
                    name: "desde",
                    label: "Origen/Destino",
                    caption: "desde",
                    type: "selectBox"
                },
                {
                    name: "tiempo",
                    label: "Tiempo espera (min)",
                    caption: "tiempo",
                    type: "textField",
                    mode: "integer",
                    required: true
                },
                {
                    name: "",
                    type: "endGroup",
                    icon: ""
                }
            ];
            f.setFields(fields);
            f.setModal(true);
            f.setFieldVisibility(f.ui.desde, "excluded");

            var data = {};
            data[""] = "Todas";
            qxnw.utils.populateSelectFromArray(f.ui.subcategoria, data);
            data.table = "edo_subcategoria";
            qxnw.utils.populateSelect(f.ui.subcategoria, "master", "populate", data);
            var data = {};
            data[""] = "Todas";
            qxnw.utils.populateSelectFromArray(f.ui.recargo, data);
            data.table = "edo_recargos";
            qxnw.utils.populateSelect(f.ui.recargo, "master", "populate", data);
            var data = {};
            data["Origen"] = "Origen";
            data["Destino"] = "Destino";
            qxnw.utils.populateSelectFromArray(f.ui.desde, data);

            f.ui.subcategoria.addListener("changeSelection", function () {
                var r = this.getValue();
                console.log(r);
                if (r.subcategoria != "") {
                    f.ui.recargo.setEnabled(false);
                    f.ui.recargo.setValue("");
                    f.setRequired("recargo", false);
                } else {
                    f.ui.recargo.setEnabled(true);
                    f.setRequired("recargo", true);
                }
            });
            f.ui.recargo.addListener("changeSelection", function () {
                var r = this.getValue();
                if (r.recargo != "") {
                    f.ui.subcategoria.setEnabled(false);
                    f.ui.subcategoria.setValue("");
                    f.setRequired("subcategoria", false);
                } else {
                    f.ui.subcategoria.setEnabled(true);
                    f.setRequired("subcategoria", true);
                }
            });
            f.ui.recargo.addListener("changeSelection", function () {
                var r = this.getValue();
                if (r.recargo === "1") {
                    f.setFieldVisibility(f.ui.desde, "visible");
                    f.setRequired("desde", true);
                } else {
                    f.setFieldVisibility(f.ui.desde, "excluded");
                    f.setRequired("desde", false);
                }
            });
            f.setRecord(r);
            f.show();
            f.ui.accept.addListener("execute", function () {
                if (!f.validate()) {
                    return;
                }
                var data = f.getRecord();
                var rpc = new qxnw.rpc(self.getRpcUrl(), "empresas");
                rpc.setAsync(true);
                var func = function () {
                    f.accept();
                    self.applyFilters();
                };
                rpc.exec("tiempo_espera", data, func);
            });
            f.ui.cancel.addListener("execute", function () {
                f.reject();
            });
        },
        slotEliminar: function slotEliminar() {
            var self = this;
            var r = self.selectedRecord();
            if (r == undefined) {
                qxnw.utils.alert("Seleccione un registro");
                return;
            }
            var rpc = new qxnw.rpc(this.rpcUrl, "empresas");
            rpc.exec("eliminar", r);
            if (rpc.isError()) {
                qxnw.utils.error(rpc.getError());
                return;
            }
            self.removeSelectedRow();
        },
        setParamRecord: function setParamRecord(pr) {
            var self = this;
            self.applyFilters();
            return true;
        }
    }
});
