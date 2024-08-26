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
qx.Class.define("qxnw.forms.behavior", {
    extend: qxnw.forms,
    construct: function construct() {
        this.base(arguments);
        var self = this;
        this.setTitle("Configuración de comportamientos");
        self.setColumnsFormNumber(0);
        var fields = [
            {
                name: self.tr("Formularios"),
                type: "startGroup",
                icon: qxnw.config.execIcon("address-book-new"),
                mode: "vertical"
            },
            {
                name: "nw_select_token_field_searchoninput",
                label: self.tr("Buscar al escribir"),
                type: "checkBox"
            },
            {
                name: "",
                type: "endGroup"
            },
            {
                name: self.tr("Configuraciones generales"),
                type: "startGroup",
                icon: qxnw.config.execIcon("system-run"),
                mode: "vertical"
            },
            {
                name: "resizeMainLeftMenu",
                label: self.tr("Mostrar/ocultar menú izquierdo automáticamente"),
                type: "checkBox"
            },
            {
                name: "treeLeftWidget",
                label: self.tr("Minimizar menú izquierdo en las vistas operativas automáticamente"),
                type: "checkBox"
            },
            {
                name: "soundStart",
                label: self.tr("Sonido al iniciar el programa"),
                type: "checkBox"
            },
            {
                name: "hideButtonsText",
                label: self.tr("Ocultar el texto de los botones"),
                type: "checkBox"
            },
            {
                name: "shakeOnValidate",
                label: self.tr("Agitar al validar formularios"),
                type: "checkBox"
            },
            {
                name: "saveLists",
                label: self.tr("Guardar configuraciones de listados (ancho de columnas, orden, columnas visibles)"),
                type: "checkBox"
            },
            {
                name: "savePositionForm",
                label: self.tr("Guardar posiciones de las ventanas (medidas, posición)"),
                type: "checkBox"
            },
            {
                name: "timeout",
                label: self.tr("Tiempo máximo de espera por consulta (120 segundos por defecto)"),
                type: "spinner",
                width: 60
            },
            {
                name: "showInitialPage",
                label: self.tr("Abrir página de inicio al empezar el programa"),
                type: "checkBox"
            },
            {
                name: "",
                type: "endGroup"
            },
            {
                name: self.tr("Chat"),
                type: "startGroup",
                icon: qxnw.config.execIcon("internet-messenger", "apps"),
                mode: "vertical"
            },
            {
                name: "timeChatRequest",
                label: self.tr("Tiempo de actualización del chat"),
                type: "spinner"
            },
            {
                name: "timeChatUsersRequest",
                label: self.tr("Tiempo de actualización del estado de usuarios chat"),
                type: "spinner"
            },
            {
                name: "showChatAtInit",
                label: self.tr("Abrir el chat al inicio"),
                type: "checkBox"
            },
            {
                name: "soundChat",
                label: self.tr("Sonidos al recibir mensajes"),
                type: "checkBox"
            },
            {
                name: "",
                type: "endGroup"
            },
            {
                name: self.tr("Alertas"),
                type: "startGroup",
                icon: qxnw.config.execIcon("mail-mark-important"),
                mode: "vertical"
            },
            {
                name: "startAlertsAtInit",
                label: self.tr("Abrir las alertas al inicio"),
                type: "checkBox"
            },
            {
                name: "",
                type: "endGroup"
            },
            {
                name: self.tr("Tablas"),
                type: "startGroup",
                icon: qxnw.config.execIcon("internet-transfer", "apps"),
                mode: "vertical"
            },
            {
                name: "maxShowRows",
                label: self.tr("Máximo número de filas mostradas por defecto"),
                type: "textField"
            },
            {
                name: "",
                type: "endGroup"
            },
            {
                name: self.tr("Otros"),
                type: "startGroup",
                icon: qxnw.config.execIcon("bookmark-new"),
                mode: "vertical"
            },
            {
                name: "showInformationOnValidate",
                label: self.tr("Mostrar una notificación al validar"),
                type: "checkBox"
            },
            {
                name: "showLogo",
                label: self.tr("Mostrar el logo"),
                type: "checkBox"
            },
            {
                name: "menuStyle",
                label: self.tr("Estilo del menú"),
                type: "selectBox"
            },
            {
                name: "addNewSubWindows",
                label: self.tr("No abrir nuevas pestañas si ya están abiertas"),
                type: "checkBox"
            },
            {
                name: "",
                type: "endGroup"
            },
            {
                name: self.tr("Notificaciones"),
                type: "startGroup",
                icon: qxnw.config.execIcon("mail-message-new"),
                mode: "vertical"
            },
            {
                name: "notifications",
                label: self.tr("Activar notificaciones"),
                type: "checkBox"
            },
            {
                name: "notifications_type",
                label: self.tr("Tipo de notificaciones"),
                type: "selectBox"
            },
            {
                name: "time_notifications",
                label: self.tr("Tiempo para actualizar notificaciones"),
                type: "spinner"
            },
            {
                name: "notifications_sound",
                label: self.tr("Sonido en notificaciones"),
                type: "checkBox"
            },
            {
                name: "notifications_animation",
                label: self.tr("Animación en notificaciones"),
                type: "checkBox"
            },
            {
                name: "",
                type: "endGroup"
            }
        ];
        self.setFields(fields);

        var data = {
            "vertical": "Horizontal",
            "horizontal": "Vertical"
        };
        qxnw.utils.populateSelectFromArray(self.ui.menuStyle, data);
        data = {
            "W3C": "W3C",
            "NW": "NW"
        };
        qxnw.utils.populateSelectFromArray(self.ui.notifications_type, data);

        self.ui.resizeMainLeftMenu.setValue(qxnw.config.getResizeMainLeftMenu());
        self.ui.treeLeftWidget.setValue(qxnw.config.getTreeLeftWidget());
        self.ui.nw_select_token_field_searchoninput.setValue(qxnw.config.getSearchOnInput());
        self.ui.savePositionForm.setValue(qxnw.config.getSavePositionForm());
        self.ui.menuStyle.setValue(qxnw.config.getMenuStyle().toString());
        self.ui.maxShowRows.setValue(qxnw.config.getMaxShowRows().toString());
        self.ui.hideButtonsText.setValue(qxnw.config.getHideButtonsText());
        self.ui.shakeOnValidate.setValue(qxnw.config.getShakeOnValidate());
        self.ui.saveLists.setValue(qxnw.config.getSaveLists());
        self.ui.timeout.setValue(qxnw.config.getRpcTimeout() / 1000);
        self.ui.showInitialPage.setValue(qxnw.config.getShowInitialPage());
        self.ui.showChatAtInit.setValue(qxnw.config.getShowChatAtInit());
        self.ui.startAlertsAtInit.setValue(qxnw.config.getStartAlertsAtInit());
        self.ui.showLogo.setValue(qxnw.config.getShowLogo());
        self.ui.timeChatRequest.setValue(qxnw.config.getTimeChatRequest());
        self.ui.timeChatUsersRequest.setValue(qxnw.config.getTimeUsersChatRequest());
        self.ui.notifications_type.setValue(qxnw.config.getNotificationsType());
        self.ui.notifications_sound.setValue(qxnw.config.getNotificationsSound());
        self.ui.notifications.setValue(qxnw.config.getNotifications());
        self.ui.time_notifications.setValue(qxnw.config.getTimeNotifications());
        self.ui.notifications_animation.setValue(qxnw.config.getNotificationsAnimation());
        self.ui.addNewSubWindows.setValue(qxnw.config.getAddNewSubWindows());
        self.ui.soundChat.setValue(qxnw.config.getSoundChat());
        self.ui.soundStart.setValue(qxnw.config.getSoundStart());
        self.ui.showInformationOnValidate.setValue(qxnw.config.getShowInformationOnValidate());
        self.ui.accept.addListener("click", function () {
            self.save();
        });
        self.ui.cancel.addListener("click", function () {
            self.reject();
        });

        self.setHeight(600);
    },
    members: {
        save: function save() {
            var self = this;
            var data = self.getRecord();
            data = qxnw.utils.stringValuesToBoolean(data);
            qxnw.local.storeData("resizeMainLeftMenu", data["resizeMainLeftMenu"]);
            qxnw.local.storeData("treeLeftWidget", data["treeLeftWidget"]);
            qxnw.local.storeData("save_position_form", data["savePositionForm"]);
            qxnw.local.storeData("menu_style", data["menuStyle"]);
            qxnw.local.storeData("max_show_rows", data["maxShowRows"]);
            qxnw.local.storeData("config_rpc_timeout", data["timeout"] * 1000);
            qxnw.local.storeData("config_save_lists", data["saveLists"]);
            qxnw.local.storeData("config_shake_validate", data["shakeOnValidate"]);
            qxnw.local.storeData("show_initial_page", data["showInitialPage"]);
            qxnw.local.storeData("start_alerts_at_init", data["startAlertsAtInit"]);
            qxnw.local.storeData("show_chat_at_init", data["showChatAtInit"]);
            qxnw.local.storeData("show_logo", data["showLogo"]);
            qxnw.local.storeData("hide_buttons_text", data["hideButtonsText"]);
            qxnw.local.storeData("time_chat_request", data["timeChatRequest"]);
            qxnw.local.storeData("notifications", data["notifications"]);
            qxnw.local.storeData("notifications_type", data["notifications_type"]);
            qxnw.local.storeData("time_notifications", data["time_notifications"]);
            qxnw.local.storeData("add_new_sub_windows", data["addNewSubWindows"]);
            qxnw.local.storeData("notifications_sound", data["notifications_sound"]);
            qxnw.local.storeData("notifications_animation", data["notifications_animation"]);
            qxnw.local.storeData("time_users_chat_request", data["timeChatUsersRequest"]);
            qxnw.local.storeData("sound_chat", data["soundChat"]);
            qxnw.local.storeData("soundStart", data["soundStart"]);
            qxnw.local.storeData("nw_select_token_field_searchoninput", data["nw_select_token_field_searchoninput"]);
            qxnw.local.storeData("nw_show_information_on_validate", data["showInformationOnValidate"]);
            if (!data["showLogo"]) {
                main.removeLogo();
            } else {
                if (!main.isCreatedLogo()) {
                    main.createFloatLogo();
                }
            }
            try {
                main.disableNotifications(true);
            } catch (e) {

            }
            qxnw.utils.information(self.tr("Configuración guardada correctamente. Para aplicar algunos cambios, es posible que deba actualizar el navegador."));
            self.accept();
        }
    }
});