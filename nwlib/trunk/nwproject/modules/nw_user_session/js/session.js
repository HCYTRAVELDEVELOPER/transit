haveActionUs = false;
$(document).ready(function() {
    login_val();
    $(document).on('keydown', 'input.input_login', function(ev) {
        if (ev.which === 13) {
            comprobarFormLogin();
            return false;
        }
    });
    actionsUs();
});
function compruebaSpaceUser() {
    var v = getVarsMaker();
    var urlsite = v["url_sites"];
    var data = $("#containerInitSession").attr("data");
    if (data == "spaceUser") {
        window.location = "/" + urlsite + "/nwaccount";
        return true;
    }
    return false;
}
function formCrearCuenta() {
    $.ajax({
        url: "/nwlib6/nwproject/modules/nw_user_session/src/info_cliente/crearcuenta_nws.php",
        type: 'post',
        error: function() {
            console.log("La operación no pudo ser procesada. Inténtelo de nuevo. ");
        },
        success: function(data) {
            nw_dialog(data);
            $(".lnk_crear_account").click(function() {
                comprobarFormRegistro();
            });
        }
    });
}
function comprobarFormRegistro() {
    var emailreg = /^[a-zA-Z0-9_\.\-]+@[a-zA-Z0-9\-]+\.[a-zA-Z0-9\-\.]+$/;
    if ($(".email_crear").val() == "" || !emailreg.test($(".email_crear").val())) {
        $(".email_crear").focus().after("<span class='error'>Ingrese un email correcto</span>");
        return false;
    }
    if ($(".clave_registro").val() == "") {
        $(".clave_registro").focus().after("<span class='error'>Ingrese su contraseña</span>");
        return false;
    }
    if ($(".password_confirm").val() == "") {
        $(".password_confirm").focus().after("<span class='error'>Ingrese su contraseña</span>");
        return false;
    }
    if ($(".password_confirm").val() != $(".clave_registro").val()) {
        $(".password_confirm").focus().after("<span class='error'>Las contraseñas no coinciden</span>");
        return false;
    }
    if ($(".nombre_crear").val() == "") {
        $(".nombre_crear").focus().after("<span class='error'>Ingrese su nombre</span>");
        return false;
    }
    if ($(".apellido_crear").val() == "") {
        $(".apellido_crear").focus().after("<span class='error'>Ingrese su apellido</span>");
        return false;
    }
    if ($(".celular_crear").val() == "") {
        $(".celular_crear").focus().after("<span class='error'>Ingrese su celular</span>");
        return false;
    }
    if ($(".nit_crear").val() == "") {
        $(".nit_crear").focus().after("<span class='error'>Ingrese su documento</span>");
        return false;
    }
    crearCuenta();
}
function  crearCuenta() {
    var con = getConfigPage();
    var data = $("#formPedido").serialize();
    data += "&page=" + con["pagina"];
    var url = "/nwlib6/nwproject/modules/nw_user_session/src/info_cliente/crearCuenta.php";
    ajax_nw_json(url, data, "recibeInitSession");
}
function actionsUs() {
    $(".lnk_olvido").click(function() {
        rememberPass();
    });
    $(".lnk_ingresar").click(function() {
        comprobarFormLogin();
    });
    $(document).on('keydown', 'input.input_login', function(ev) {
        if (ev.which === 13) {
            comprobarFormLogin();
            return false;
        }
    });
    $(".lnk_crear").click(function() {
//        formCrearCuenta();
        openFormCrearCuenta();
    });
    $(".lnk_crear_account").click(function() {
        comprobarFormRegistro();
    });
    var emailreg = /^[a-zA-Z0-9_\.\-]+@[a-zA-Z0-9\-]+\.[a-zA-Z0-9\-\.]+$/;
    $(".nombre_crear, .email_crear, .clave_registro").keyup(function() {
        if ($(this).val() != "") {
            $(".error").fadeOut();
            return false;
        }
    });
    $(".email_crear").keyup(function() {
        if ($(this).val() != "" && emailreg.test($(this).val())) {
            $(".error").fadeOut();
            return false;
        }
    });
//    document.getElementById('nombre').focus();
}

function rememberPass() {
//    var self = generateSelf();
    loadingNw();

    var fields = [
        {
            tipo: 'textField',
            nombre: 'Correo Registrado',
            name: 'correo_registrado',
            requerido: "SI"
        }
    ];

    //muestra el form en un div, se debe crear el self al principio
//    createNwForms(self, fields);
//crea el form en un popup dialog
    var self = createNwForms(self, fields, "popUp");

    //para abrirlo en un popup
//    var self = createNwFormDialog(fields);
    //otra forma para crearlo en un div como lista
//    var self = createNwForm(fields, ".containerInitSession");

    var accept = addButtonNwForm("OK", self);
    var cancel = addButtonNwForm("Cerrar", self);

    accept.click(function() {
        if (!validateRequired(self)) {
            return;
        }

        var data = getRecordNwForm(self);

        var rpc = {};
        rpc["service"] = "nwprojectOut";
        rpc["method"] = "rememberPassNwMaker";
        rpc["data"] = data;

        var func = function(r) {
            if (!r) {
                nw_dialog("Lo sentimos, no existe el usuario");
                return false;
            } else {
                nw_dialog("Hemos enviado un mensaje a su correo electronico registrado. Por favor ingrese a su E-mail y siga las instrucciones que hemos enviado.");
                return true;
            }
        };

        rpcNw("rpcNw", rpc, func);

    });

    cancel.click(function() {
        reject(self);
    });

    removeLoadingNw();

}

function login_val() {
    var emailreg = /^[a-zA-Z0-9_\.\-]+@[a-zA-Z0-9\-]+\.[a-zA-Z0-9\-\.]+$/;
    $(".usuario_login, .clave_login").keyup(function() {
        if ($(this).val() != "") {
            $(".error").fadeOut();
            $("#respuesta").remove();
            return false;
        }
    });
    $(".usuario_login").keyup(function() {
        if ($(this).val() != "" && emailreg.test($(this).val())) {
            $(".error").fadeOut();
            $("#respuesta").remove();
            return false;
        }
    });
//    document.getElementById('usuario').focus();
}
function comprobarFormLogin() {
//    var config = nw_ajax_fast("nwmaker_login", false);
    var tipo = $(".containerInitSession").attr("datatype");

    var emailreg = /^[a-zA-Z0-9_\.\-]+@[a-zA-Z0-9\-]+\.[a-zA-Z0-9\-\.]+$/;
    $(".error").remove();

    var div = $(".usuario_login");
    if (tipo == "qxnw") {
        if (div.val() == "") {
            div.focus().after("<span class='error'>Ingrese su usuario</span>");
            return false;
        }
    } else {
        if (div.val() == "" || !emailreg.test(div.val())) {
            div.focus().after("<span class='error'>Ingrese un email correcto</span>");
            return false;
        }
    }

    if ($(".clave_login").val() == "") {
        $(".clave_login").focus().after("<span class='error'>Ingrese su contraseña</span>");
        return false;
    }
//    if (validateRequired() == false) {
//        return false;
//    }
    IniciarSesion();
}

function  IniciarSesion() {
    loading_nw();
//    var v = getVarsMaker();

    var tipo = $(".containerInitSession").attr("datatype");
    var ruta = "";
//    var rutaNWP = v["carpet_module"] + "src/info_cliente/iniciar_sesion.php";
    var rutaNWP = "/nwlib6/nwproject/modules/nw_user_session/src/info_cliente/iniciar_sesion.php";
    var rutaQXNW = "/rpcsrv/server.php";

    var data = {};
    var dataForm = $("#form_login").serializeArray();
    data["usuario"] = dataForm[0].value;
    data["clave"] = MD5(dataForm[1].value);
    data["service"] = "nw_session";
    data["method"] = "consulta";
    var key = {};
    key["key"] = "bndjYWYyMzIz";
    data["server_data"] = key;

    if (tipo == "qxnw") {
        ruta = rutaQXNW;
    } else {
        ruta = rutaNWP;
    }

    ruta = rutaNWP;
    ajax_nw_json(ruta, data, "recibeInitSession");

}

function recibeInitSession(data) {
    var tipo = "";
    if (data.create != undefined && data.create != null) {
        tipo = data.create;
    }
    if (data.error != undefined && data.error != null) {
        data = data.error.message;
    }

    var dataredirecSi = $(".containerInitSession").attr("dataurlk");
    var dataurlredirec = $(".containerInitSession").attr("dataurl");
    var redirec = false;

    if (tipo == "create") {
        var dataForm = $("#formPedido").serializeArray();
        var usuario = dataForm[0].value;
    } else {
        var dataForm = $("#form_login").serializeArray();
        var usuario = dataForm[0].value;
    }
    if (data.usuario == usuario) {

        localStorage["autenticado"] = "SI";

        if (dataredirecSi == "SI") {
            if (dataurlredirec != "" && dataurlredirec != "0" && dataurlredirec != null) {
                redirec = true;
            }
        }
        //comprueba el redireccionamiento
        if (redirec == false) {
            window.location.reload();
        } else {
            window.location = dataurlredirec;
        }

    } else {
        nw_dialog(data);
    }
}



var MD5 = function(string) {

    function RotateLeft(lValue, iShiftBits) {
        return (lValue << iShiftBits) | (lValue >>> (32 - iShiftBits));
    }

    function AddUnsigned(lX, lY) {
        var lX4, lY4, lX8, lY8, lResult;
        lX8 = (lX & 0x80000000);
        lY8 = (lY & 0x80000000);
        lX4 = (lX & 0x40000000);
        lY4 = (lY & 0x40000000);
        lResult = (lX & 0x3FFFFFFF) + (lY & 0x3FFFFFFF);
        if (lX4 & lY4) {
            return (lResult ^ 0x80000000 ^ lX8 ^ lY8);
        }
        if (lX4 | lY4) {
            if (lResult & 0x40000000) {
                return (lResult ^ 0xC0000000 ^ lX8 ^ lY8);
            } else {
                return (lResult ^ 0x40000000 ^ lX8 ^ lY8);
            }
        } else {
            return (lResult ^ lX8 ^ lY8);
        }
    }

    function F(x, y, z) {
        return (x & y) | ((~x) & z);
    }
    function G(x, y, z) {
        return (x & z) | (y & (~z));
    }
    function H(x, y, z) {
        return (x ^ y ^ z);
    }
    function I(x, y, z) {
        return (y ^ (x | (~z)));
    }

    function FF(a, b, c, d, x, s, ac) {
        a = AddUnsigned(a, AddUnsigned(AddUnsigned(F(b, c, d), x), ac));
        return AddUnsigned(RotateLeft(a, s), b);
    }
    ;

    function GG(a, b, c, d, x, s, ac) {
        a = AddUnsigned(a, AddUnsigned(AddUnsigned(G(b, c, d), x), ac));
        return AddUnsigned(RotateLeft(a, s), b);
    }
    ;

    function HH(a, b, c, d, x, s, ac) {
        a = AddUnsigned(a, AddUnsigned(AddUnsigned(H(b, c, d), x), ac));
        return AddUnsigned(RotateLeft(a, s), b);
    }
    ;

    function II(a, b, c, d, x, s, ac) {
        a = AddUnsigned(a, AddUnsigned(AddUnsigned(I(b, c, d), x), ac));
        return AddUnsigned(RotateLeft(a, s), b);
    }
    ;

    function ConvertToWordArray(string) {
        var lWordCount;
        var lMessageLength = string.length;
        var lNumberOfWords_temp1 = lMessageLength + 8;
        var lNumberOfWords_temp2 = (lNumberOfWords_temp1 - (lNumberOfWords_temp1 % 64)) / 64;
        var lNumberOfWords = (lNumberOfWords_temp2 + 1) * 16;
        var lWordArray = Array(lNumberOfWords - 1);
        var lBytePosition = 0;
        var lByteCount = 0;
        while (lByteCount < lMessageLength) {
            lWordCount = (lByteCount - (lByteCount % 4)) / 4;
            lBytePosition = (lByteCount % 4) * 8;
            lWordArray[lWordCount] = (lWordArray[lWordCount] | (string.charCodeAt(lByteCount) << lBytePosition));
            lByteCount++;
        }
        lWordCount = (lByteCount - (lByteCount % 4)) / 4;
        lBytePosition = (lByteCount % 4) * 8;
        lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80 << lBytePosition);
        lWordArray[lNumberOfWords - 2] = lMessageLength << 3;
        lWordArray[lNumberOfWords - 1] = lMessageLength >>> 29;
        return lWordArray;
    }
    ;

    function WordToHex(lValue) {
        var WordToHexValue = "", WordToHexValue_temp = "", lByte, lCount;
        for (lCount = 0; lCount <= 3; lCount++) {
            lByte = (lValue >>> (lCount * 8)) & 255;
            WordToHexValue_temp = "0" + lByte.toString(16);
            WordToHexValue = WordToHexValue + WordToHexValue_temp.substr(WordToHexValue_temp.length - 2, 2);
        }
        return WordToHexValue;
    }
    ;

    function Utf8Encode(string) {
        string = string.replace(/\r\n/g, "\n");
        var utftext = "";

        for (var n = 0; n < string.length; n++) {

            var c = string.charCodeAt(n);

            if (c < 128) {
                utftext += String.fromCharCode(c);
            }
            else if ((c > 127) && (c < 2048)) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            }
            else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }

        }

        return utftext;
    }
    ;

    var x = Array();
    var k, AA, BB, CC, DD, a, b, c, d;
    var S11 = 7, S12 = 12, S13 = 17, S14 = 22;
    var S21 = 5, S22 = 9, S23 = 14, S24 = 20;
    var S31 = 4, S32 = 11, S33 = 16, S34 = 23;
    var S41 = 6, S42 = 10, S43 = 15, S44 = 21;

    string = Utf8Encode(string);

    x = ConvertToWordArray(string);

    a = 0x67452301;
    b = 0xEFCDAB89;
    c = 0x98BADCFE;
    d = 0x10325476;

    for (k = 0; k < x.length; k += 16) {
        AA = a;
        BB = b;
        CC = c;
        DD = d;
        a = FF(a, b, c, d, x[k + 0], S11, 0xD76AA478);
        d = FF(d, a, b, c, x[k + 1], S12, 0xE8C7B756);
        c = FF(c, d, a, b, x[k + 2], S13, 0x242070DB);
        b = FF(b, c, d, a, x[k + 3], S14, 0xC1BDCEEE);
        a = FF(a, b, c, d, x[k + 4], S11, 0xF57C0FAF);
        d = FF(d, a, b, c, x[k + 5], S12, 0x4787C62A);
        c = FF(c, d, a, b, x[k + 6], S13, 0xA8304613);
        b = FF(b, c, d, a, x[k + 7], S14, 0xFD469501);
        a = FF(a, b, c, d, x[k + 8], S11, 0x698098D8);
        d = FF(d, a, b, c, x[k + 9], S12, 0x8B44F7AF);
        c = FF(c, d, a, b, x[k + 10], S13, 0xFFFF5BB1);
        b = FF(b, c, d, a, x[k + 11], S14, 0x895CD7BE);
        a = FF(a, b, c, d, x[k + 12], S11, 0x6B901122);
        d = FF(d, a, b, c, x[k + 13], S12, 0xFD987193);
        c = FF(c, d, a, b, x[k + 14], S13, 0xA679438E);
        b = FF(b, c, d, a, x[k + 15], S14, 0x49B40821);
        a = GG(a, b, c, d, x[k + 1], S21, 0xF61E2562);
        d = GG(d, a, b, c, x[k + 6], S22, 0xC040B340);
        c = GG(c, d, a, b, x[k + 11], S23, 0x265E5A51);
        b = GG(b, c, d, a, x[k + 0], S24, 0xE9B6C7AA);
        a = GG(a, b, c, d, x[k + 5], S21, 0xD62F105D);
        d = GG(d, a, b, c, x[k + 10], S22, 0x2441453);
        c = GG(c, d, a, b, x[k + 15], S23, 0xD8A1E681);
        b = GG(b, c, d, a, x[k + 4], S24, 0xE7D3FBC8);
        a = GG(a, b, c, d, x[k + 9], S21, 0x21E1CDE6);
        d = GG(d, a, b, c, x[k + 14], S22, 0xC33707D6);
        c = GG(c, d, a, b, x[k + 3], S23, 0xF4D50D87);
        b = GG(b, c, d, a, x[k + 8], S24, 0x455A14ED);
        a = GG(a, b, c, d, x[k + 13], S21, 0xA9E3E905);
        d = GG(d, a, b, c, x[k + 2], S22, 0xFCEFA3F8);
        c = GG(c, d, a, b, x[k + 7], S23, 0x676F02D9);
        b = GG(b, c, d, a, x[k + 12], S24, 0x8D2A4C8A);
        a = HH(a, b, c, d, x[k + 5], S31, 0xFFFA3942);
        d = HH(d, a, b, c, x[k + 8], S32, 0x8771F681);
        c = HH(c, d, a, b, x[k + 11], S33, 0x6D9D6122);
        b = HH(b, c, d, a, x[k + 14], S34, 0xFDE5380C);
        a = HH(a, b, c, d, x[k + 1], S31, 0xA4BEEA44);
        d = HH(d, a, b, c, x[k + 4], S32, 0x4BDECFA9);
        c = HH(c, d, a, b, x[k + 7], S33, 0xF6BB4B60);
        b = HH(b, c, d, a, x[k + 10], S34, 0xBEBFBC70);
        a = HH(a, b, c, d, x[k + 13], S31, 0x289B7EC6);
        d = HH(d, a, b, c, x[k + 0], S32, 0xEAA127FA);
        c = HH(c, d, a, b, x[k + 3], S33, 0xD4EF3085);
        b = HH(b, c, d, a, x[k + 6], S34, 0x4881D05);
        a = HH(a, b, c, d, x[k + 9], S31, 0xD9D4D039);
        d = HH(d, a, b, c, x[k + 12], S32, 0xE6DB99E5);
        c = HH(c, d, a, b, x[k + 15], S33, 0x1FA27CF8);
        b = HH(b, c, d, a, x[k + 2], S34, 0xC4AC5665);
        a = II(a, b, c, d, x[k + 0], S41, 0xF4292244);
        d = II(d, a, b, c, x[k + 7], S42, 0x432AFF97);
        c = II(c, d, a, b, x[k + 14], S43, 0xAB9423A7);
        b = II(b, c, d, a, x[k + 5], S44, 0xFC93A039);
        a = II(a, b, c, d, x[k + 12], S41, 0x655B59C3);
        d = II(d, a, b, c, x[k + 3], S42, 0x8F0CCC92);
        c = II(c, d, a, b, x[k + 10], S43, 0xFFEFF47D);
        b = II(b, c, d, a, x[k + 1], S44, 0x85845DD1);
        a = II(a, b, c, d, x[k + 8], S41, 0x6FA87E4F);
        d = II(d, a, b, c, x[k + 15], S42, 0xFE2CE6E0);
        c = II(c, d, a, b, x[k + 6], S43, 0xA3014314);
        b = II(b, c, d, a, x[k + 13], S44, 0x4E0811A1);
        a = II(a, b, c, d, x[k + 4], S41, 0xF7537E82);
        d = II(d, a, b, c, x[k + 11], S42, 0xBD3AF235);
        c = II(c, d, a, b, x[k + 2], S43, 0x2AD7D2BB);
        b = II(b, c, d, a, x[k + 9], S44, 0xEB86D391);
        a = AddUnsigned(a, AA);
        b = AddUnsigned(b, BB);
        c = AddUnsigned(c, CC);
        d = AddUnsigned(d, DD);
    }

    var temp = WordToHex(a) + WordToHex(b) + WordToHex(c) + WordToHex(d);

    return temp.toLowerCase();
}