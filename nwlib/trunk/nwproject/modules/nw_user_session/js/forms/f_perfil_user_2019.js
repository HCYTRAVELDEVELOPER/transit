function f_perfil_user_2019(user) {
    empty(".containFileDir");
    var classDocument = ".f_perfil_user_2019";
    var self = generateSelf(classDocument);
    this.constructor = constructor;
    this.self = self;
    function constructor() {
        loading("Cargando...", "rgba(255, 255, 255, 0.76)!important", self);
        var fields = [
            {
                name: "",
                type: "startGroup",
                name_group: "imagen",
                mode: "horizontal"
            },
            {
                tipo: 'textField',
                nombre: 'ID',
                name: 'id',
                visible: false
            },
            {
                tipo: 'textField',
                nombre: 'ID',
                name: 'nombre_apellido_ok',
                visible: false
            },
            {
                tipo: 'backgroundImage',
                nombre: 'Foto de Perfil',
                name: 'foto_perfil'
            },
            {
                tipo: 'label',
                nombre: 'Nombre',
                name: 'nombre_apellido'
            },
            {
                name: "",
                type: "endGroup"
            },
            {
                name: "Datos Básicos",
                type: "startGroup",
                name_group: "datos_basicos",
                mode: "horizontal"
            },
            {
                tipo: 'label',
                nombre: 'Correo',
                name: 'email'
            },
            {
                tipo: 'label',
                nombre: 'Documento',
                name: 'documento'
            },
            {
                tipo: 'label',
                nombre: 'País',
                name: 'pais_text'
            },
            {
                tipo: 'label',
                nombre: 'Celular',
                name: 'celular'
            },
            {
                name: "",
                type: "endGroup"
            }
        ];
        var get = getGET();
        var up = getUserInfo();

        createNwForms(self, fields, "nopopUp");

        setColumnsFormNumber(self, 1);
        var up = getUserInfo();

        /*
         var btn = addButtonNwForm("Enviar mensaje", self);
         btn.addClass("cancel_btn");
         btn.click(function () {
         var data = getRecordNwForm(self);
         var myName = up.nombre + up.apellido;
         var room = "";
         var tool = "";
         var tod = up.usuario + myName + data.nombre_apellido_ok + get.profilenw + up.terminal.toString() + up.apikey.toString();
         tool = tod.length + parseInt(data.id) + parseInt(up.id_usuario);
         var us = [];
         us[0] = {
         "usuario": up.usuario
         };
         us[1] = {
         "usuario": get.profilenw
         };
         us.sort(function (a, b) {
         return +(a.usuario > b.usuario) || +(a.usuario === b.usuario) - 1;
         });
         for (var i = 0; i < us.length; i++) {
         tool += cleanUserNwC(us[i].usuario);
         }
         room = "userchat_" + tool + "_" + up.terminal.toString() + "_" + up.apikey.toString();
         
         var me = up.usuario;
         var he = get.profilenw;
         var heName = false;
         var hePhoto = false;
         var callback = false;
         var contain = false;
         var addGetUrl = false;
         windowNwChat(room, me, he, heName, hePhoto, callback, contain, addGetUrl);
         });
         */

        var btn = addButtonNwForm("Volver al inicio", self);
        btn.addClass("cancel_btn");
        btn.click(function () {
            reject(self);
            loadHomeNwMaker();
        });

        if (up.usuario === get.profilenw) {
            var btn = addButtonNwForm("Editar perfil", self);
            btn.click(function () {
                editDataPersonal("popup");
            });

            var btn = addButtonNwForm("Cambiar contraseña", self);
            btn.click(function () {
                changePass("popup");
            });
        }

        if (typeof functionAddBtnProfile !== "undefined") {
            functionAddBtnProfile(self);
        }

        newLoadingTwo(self, "...", "background: #fff;height: 100%;position: absolute;width: 100%;z-index: 100000;top:0px;", "append");
        var rpc = {};
        rpc["service"] = "nwMaker";
        rpc["method"] = "consultaPerfilUserNwTwo";
        rpc["data"] = {usuario: get.profilenw};
        var func = function (r) {
            newRemoveLoading(self);
            removeLoadingList(self);
            newRemoveLoading(self);
            if (!verifyErrorNwMaker(r)) {
                return;
            }
            r.foto_perfil = getFileByType(r.foto_perfil, false, 350);
            r.nombre_apellido_ok = r.nombre_apellido;
            setRecord(self, r);
        };
        rpcNw("rpcNw", rpc, func, true);
    }
}
