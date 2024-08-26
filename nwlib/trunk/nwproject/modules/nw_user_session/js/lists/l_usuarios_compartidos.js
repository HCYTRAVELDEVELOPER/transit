function l_usuarios_compartidos() {
    empty(".l_usuarios_compartidos");
    var divPadreContainer = ".container-main-myusers";
    initContainer(divPadreContainer);
    var classDocument = ".l_usuarios_compartidos";
    createContainer(divPadreContainer, false, classDocument);
    var self = createDocument(classDocument);
    var thisDoc = this;
    this.constructor = constructor;
    this.updateContend = updateContend;
    this.self = self;
    function constructor() {

        var s = new l_invitaciones_personas(thisDoc);
        s.constructor();

        var up = getUserInfo();
        var columns = [
            {
                label: "ID",
                caption: "id",
                visible: false
            },
            {
                label: "Foto de perfil",
                caption: "foto_perfil",
                type: "image",
                mode: "phpthumb",
                clickable: false
            },
            {
                label: "Nombre",
                caption: "nombres_apellidos"
            },
            {
                label: "Usuario ID",
                caption: "usuario_cliente",
                visible: false
            },
            {
                label: "Usuario quien asocia",
                caption: "usuario_quien_asocia",
                visible: true
            },
            {
                label: "Aprobado",
                caption: "aprobado_por_ambos",
                visible: true
            },
            {
                label: "Usuario",
                caption: "user_cliente"
            }
        ];
        createList(columns, self);
        var html = "<h2 class='subtitles titleMyUsersNwMaker'>Mis amigos externos</h2>";
        addHeaderNoteList(html, self);
        setMaxWidthList(1100, self);
        listScroll(self, false);
        var update = getButtonUpdateFilter(self, "update");
        update.click(function () {
            thisDoc.updateContend();
        });
        var nuevo = createButtonListEnc(self, "Nuevo");
        nuevo.click(function () {
            var d = new f_usuarios_compartidos();
            d.constructor();
        });
        thisDoc.updateContend();
    }

    function updateContend() {
        var data = {};
        var rpc = {};
        rpc["service"] = "nwMaker";
        rpc["method"] = "misUsuariosCompartidos";
        rpc["data"] = data;
        var func = function (r) {
            if (!verifyErrorNwMaker(r, self) || verifyErrorNwMaker(r, self) == 0) {
                return;
            }
            setModelData(r, self);
            addCss(self, ".colsMobil", {"overflow": "hidden"});
            showRowInMobile(self, "estado");
            var eliminar = addButtonContextMenu(self, "Eliminar");
            eliminar.click(function () {
                var r = getSelectedRecord(self);
                var params = {};
                params.html = "¿Desea eliminar este amigo?";
                params.onSave = function () {
                    var rpc = {};
                    rpc["service"] = "nwMaker";
                    rpc["method"] = "eliminarUsuarioCompartido";
                    rpc["data"] = r;
                    var func = function (r) {
                        if (!verifyErrorNwMaker(r, self)) {
                            return;
                        }
                        nw_dialog("Eliminado correctamente");
                        thisDoc.updateContend();
                    };
                    rpcNw("rpcNw", rpc, func, true);
                    return true;
                };
                createDialogNw(params);
            });
        };
        rpcNw("rpcNw", rpc, func, true);
    }
}
function l_invitaciones_personas(parent) {
    empty(".l_invitaciones_personas");
    var divPadreContainer = ".container-main-myusers";
    initContainer(divPadreContainer);
    var classDocument = ".l_invitaciones_personas";
    createContainer(divPadreContainer, false, classDocument);
    var self = createDocument(classDocument);
    var thisDoc = this;
    this.constructor = constructor;
    this.updateContend = updateContend;
    this.self = self;
    function constructor() {
        var up = getUserInfo();
        var columns = [
            {
                label: "ID",
                caption: "id",
                visible: false
            },
            {
                label: "ID User",
                caption: "id_user",
                visible: false
            },
            {
                label: "Foto",
                caption: "foto_perfil",
                type: "image",
                mode: "phpthumb",
                clickable: false
            },
            {
                label: "Nombre de quien te invita",
                caption: "nombres_apellidos"
            },
            {
                label: "Usuario de quien te invita",
                caption: "usuario_cliente"
            },
            {
                label: "Aprobar",
                caption: "aprobar",
                type: "button"
            }
        ];
        createList(columns, self);
        var html = "<h2 class='subtitles titleMyUsersNwMaker'>Invitaciones</h2>";
        addHeaderNoteList(html, self);
        setMaxWidthList(1100, self);
        listScroll(self, false);
        var update = getButtonUpdateFilter(self, "update");
        update.click(function () {
            thisDoc.updateContend();
        });
        thisDoc.updateContend();
    }

    function updateContend() {
        var data = {};
        var rpc = {};
        rpc["service"] = "nwMaker";
        rpc["method"] = "misUsuariosCompartidosInvitaciones";
        rpc["data"] = data;
        var func = function (r) {
            if (!verifyErrorNwMaker(r, self) || verifyErrorNwMaker(r, self) == 0) {
                return;
            }
            setModelData(r, self);
            addCss(self, ".colsMobil", {"overflow": "hidden"});

            var btnOk = actionInColList(self, "aprobar");
            btnOk.click(function () {
                var r = getSelectedRecord(self);
                var params = {};
                params.html = "¿Desea aprobar este usuario como amigo? <p>Recuerde que podrá ver todas sus publicaciones y agregarlo a grupos.</p>";
                params.onSave = function () {
                    var rpc = {};
                    rpc["service"] = "nwMaker";
                    rpc["method"] = "aprobarUsuarioCompartido";
                    rpc["data"] = r;
                    var func = function (r) {
                        if (!verifyErrorNwMaker(r, self)) {
                            return;
                        }
                        nw_dialog("Aprobado correctamente");
                        thisDoc.updateContend();
                        parent.updateContend();
                    };
                    rpcNw("rpcNw", rpc, func, true);
                    return true;
                };
                createDialogNw(params);
            });
        };
        rpcNw("rpcNw", rpc, func, true);
    }
}