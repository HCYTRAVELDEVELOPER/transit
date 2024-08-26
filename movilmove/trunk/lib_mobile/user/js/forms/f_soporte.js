nw.Class.define("f_soporte", {
    extend: nw.forms,
    construct: function (datos) {
        var self = this;
        self.id = "f_soporte";
        self.showBack = false;
        self.closeBack = true;
        self.closeBackCallBack = function () {
            nw.loadHome();
//            self.dialog("¿Desea salir sin guardar cambios?", accept, cancel);
//            function accept() {
//                self.back();
//            }
//            function cancel() {
//
//            }
        };
        self.transition = "pop";
        self.setTitle = "";
        self.createBase();
        var fields = [
            {
                name: "frame_chat_form",
                label: "Cargando...",
                type: "html",
                visible: true
            }
        ];
        self.setFields(fields);

//        nw.getPermission(['android.permission.RECORD_AUDIO', 'android.permission.CAMERA', 'android.permission.MICROPHONE']);
//        nw.getPermission([
//            'android.permission.READ_PHONE_STATE',
//            'android.permission.READ_EXTERNAL_STORAGE',
//            'android.permission.RECORD_VIDEO',
//            'android.permission.WRITE_EXTERNAL_STORAGE',
//            'android.permission.ACCESS_WIFI_STATE',
//            'android.permission.ACCESS_NETWORK_STATE',
//            'android.permission.RECORD_AUDIO',
//            'android.permission.MODIFY_AUDIO_SETTINGS',
//            'android.permission.FLASHLIGHT',
//            'android.permission.RECORD_AUDIO',
//            'android.permission.CAMERA',
//            'android.permission.MICROPHONE'
//        ], function () {
//            console.log("Permisos concedidos");
//        });
        nw.getPermission([
            'android.permission.READ_PHONE_STATE',
            'android.permission.READ_EXTERNAL_STORAGE',
            'android.permission.RECORD_VIDEO',
            'android.permission.WRITE_EXTERNAL_STORAGE',
            'android.permission.ACCESS_WIFI_STATE',
            'android.permission.ACCESS_NETWORK_STATE',
            'android.permission.RECORD_AUDIO',
            'android.permission.MODIFY_AUDIO_SETTINGS',
            'android.permission.FLASHLIGHT',
            'android.permission.RECORD_AUDIO',
            'android.permission.CAMERA',
            'android.permission.MICROPHONE'
        ], function () {
            console.log("Permisos concedidos");
        });

        self.show();

        //grupo nw
//        var ringowID = "2";
//        var ringowApyKey = "66480";
        //netcar
        var ringowID = "3095";
        var ringowApyKey = "1510848061182";
        if (nw.evalueData(config.ringowID)) {
            ringowID = config.ringowID;
        }
        if (nw.evalueData(config.ringowApyKey)) {
            ringowApyKey = config.ringowApyKey;
        }

        var up = nw.userPolicies.getUserData();
        var frame = document.querySelector('.framechat_conversation');
        if (!frame) {
            frame = document.createElement('iframe');
            frame.className = 'framechat_conversation';
            frame.id = 'framechat_conversation';
            frame.src = 'https://app.ringow.com/ringowEmbed/' + ringowID + '/' + ringowApyKey + '?onlyChat=true&callingChat=true';
            frame.allow = "geolocation; microphone; camera";
            frame.onload = function () {
            };
            self.ui.frame_chat_form.setValue(frame);
        }
    },
    destruct: function () {
    },
    members: {
    }
});