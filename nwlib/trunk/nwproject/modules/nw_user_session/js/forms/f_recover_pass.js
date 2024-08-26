
function changePassRecovery() {
    var data = getGET();
    var rpc = {};
    rpc["service"] = "nwprojectOut";
    rpc["method"] = "validateChangeRecoverPass";
    rpc["data"] = data;
    var func = function (r) {
        if (r === false) {
            var params = {};
            params.html = 'Enlace no válido';
            params.onSave = function () {
                window.location = "/nwUserAccount";
                return false;
            };
            params.onCancel = function () {
                window.location = "/nwUserAccount";
                return false;
            };
            createDialogNw(params);
            return false;
        }
        if (!verifyErrorNwMaker(r) || verifyErrorNwMaker(r) == 0) {
            return;
        }
        changePassRecoveryCont();
    };
    rpcNw("rpcNw", rpc, func, true);
}

function changePassRecoveryCont() {
    var self = generateSelf("#container-nwmaker");
    var fields = [
        {
            tipo: 'password',
            nombre: 'Nueva clave',
            name: 'passnew',
            requerido: "SI"
        },
        {
            tipo: 'password',
            nombre: 'Repita su nueva clave',
            name: 'passnewrepit',
            requerido: "SI"
        }
    ];
    createNwForms(self, fields, "nopopup");
    var get = getGET();
    $(self).addClass("contain-recover-pass");
    addCss(self, "", {"position": "relative", "margin": "50px auto", "max-width": "500px", "box-shadow": "0px 0px 5px #bebebe"});
    var accept = addButtonNwForm("Enviar", self);
    accept.click(function () {
        if (!validateRequired(self)) {
            return;
        }
        var css = "position: fixed;top: 0;left: 0;height: 100%;z-index: 10000000000000000000;background: #fff;color: #000;";
        newLoadingTwo("body", "Cargando...", css, "append");
        var data = getRecordNwForm(self);
        if (data["passnew"] != data["passnewrepit"]) {
            nw_dialog("Las contraseñas no coinciden");
            return false;
        }
        data.user = get.user;
        var rpc = {};
        rpc["service"] = "nwMaker";
        rpc["method"] = "changeRecoveryPassNwMaker";
        rpc["data"] = data;
        var func = function (r) {
            removeLoadingNw();
            newRemoveLoading("body");
            if (!verifyErrorNwMaker(r)) {
                return;
            }
            var params = {};
            params.html = '<h2>Cambio de clave exitoso!</h2><p>Será redireccionado al login de autenticación en 5 segundos, por favor espere...</p>';
            params.onSave = function () {
                validaFinal();
            };
            createDialogNw(params);
            setTimeout(function () {
                validaFinal();
            }, 5000);

            return true;
        };
        rpcNw("rpcNw", rpc, func, true);
    });

    function validaFinal() {
        var get = getGET();
        newLoadingTwo("html", "Cargando...", "background: rgba(27, 104, 156, 0.38);", "allWindow");
        var ob = "/nwmaker?createLogin=true";
        if (get) {
            if (typeof get.linkredirect !== "undefined") {
                ob += "&linkredirect=" + encodeURIComponent(get.linkredirect);
            }
        }
        window.location = ob;
        return false;
    }
}