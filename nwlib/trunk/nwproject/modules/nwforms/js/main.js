var timeoutIDNotifica;
var fileExtension = "";
msgEndNwForms = "Formulario enviado correctamente.";

if (document.readyState !== 'loading') {
    myInitCodeMainNwForms();
} else {
    document.addEventListener('DOMContentLoaded', function () {
        myInitCodeMainNwForms();
    });
}

function myInitCodeMainNwForms() {
    validaJqueryFormsMain(function () {
        startNwformMain();
    });

}

function validaJqueryFormsMain(callback) {
    if (typeof jQuery !== "undefined") {
        callback();
    } else {
        setTimeout(function () {
            validaJqueryFormsMain(callback);
        }, 1000);
    }
}

function startNwformMain() {

    var get = getGET();
    if (get) {
        setTimeout(function () {
            for (var key in get) {
                console.log(key, get[key]);
                var ele = document.querySelector("." + key);
                if (ele) {
                    ele.value = get[key];
                }
            }
        }, 1000);
    }

    $(".checkbox_activar").click(function () {
        var selected = $(this).attr('checked');
        if (selected == undefined) {
            $(this).attr('checked', true);
        } else
        if (selected == "checked") {
            $(this).attr('checked', false);
        }
    });

    $(".nwform").submit(function () {
        var self = ".nwformnumber_" + $(this).attr("data-i");
        submitNwForm(self);
        return false;
    });

    (function () {
        $('body').delegate('.start_blob', 'click', function () {
            var data = this.getAttribute("data");
            var input = this.getAttribute("data-input");
            console.log("dat", data);
            document.querySelector("." + input).value = data;

            $(".start_blob_" + input).removeClass("start_blob_click");
            for (var i = 0; i < data; i++) {
                $(".widgetStars_" + input + " .start_blob_" + i).addClass("start_blob_click");
            }
            $(this).addClass("start_blob_click");

        });
    })();
    (function () {
        $('body').delegate('#sendNwForm', 'click', function () {
            var self = ".nwformnumber_" + $(this).attr("data-i");
            submitNwForm(self);
            return false;
        });
    })();
    (function () {
        $('body').delegate('.inputdatanwform', 'change', function () {
            validateLogics(this);
        });
    })();
    var statusOffline = $("#nwform").attr("offline");
    if (statusOffline == "SI") {
    }
    (function () {
        $('body').delegate('.div_enabled_nwf', 'click', function () {
            return false;
        });
    })();
    $('.div_enabled_nwf').change(function () {
        return false;
    });
    $('.div_enabled_nwf').keypress(function () {
        return false;
    });
}

function validateLogics(self) {
    var val = $(self).val();
    var validations = $(self).attr("validations");
    if (evalueData(validations)) {
        var json = JSON.parse(validations).VALIDATIONS;
        for (var i = 0; i < json.length; i++) {
            var j = json[i];
            var v = j.value;
            if (v == val || v == "OTHERS") {
                if (typeof j.fadeIn != "undefined") {
                    if (typeof j.fadeIn.grupos != "undefined") {
                        var gruposIn = j.fadeIn.grupos;
                        $.each(gruposIn, function (key, value) {
                            $(".divGroupForm_" + value).fadeIn(0);
                        });
                    }
                }
                if (typeof j.fadeOut != "undefined") {
                    if (typeof j.fadeOut.grupos != "undefined") {
                        var gruposOut = j.fadeOut.grupos;
                        $.each(gruposOut, function (key, value) {
                            $(".divGroupForm_" + value).fadeOut(0);
                        });
                    }
                }
                break;
                return;
            }
        }
    }
    var sies_valor = $(self).attr("sies_valor");
    var sies_efecto = $(self).attr("sies_efecto");
    var sies_pregunta = $(self).attr("sies_pregunta");
    if (evalueData(sies_valor)) {
        if (val == sies_valor) {
            if (sies_efecto == "fadeOut") {
                $(".divContainInput" + sies_pregunta).fadeOut(0);
            } else
            if (sies_efecto == "fadeIn") {
                $(".divContainInput" + sies_pregunta).fadeIn(0);
            } else
            if (sies_efecto == "goTo") {
                var top = $(".divContainInput" + sies_pregunta).position().top;
                $("body").scrollTop(top);
            }
        } else {
            $(".divContainInput" + sies_pregunta).fadeIn(0);
        }
    }
}

function getVarsMaker() {
    var rta = {};
    rta["carpet_module"] = $(".loginnw").attr("carpet_module");
    rta["url_sites"] = $(".loginnw").attr("url_sites");
    return rta;
}

function funcSavForm() {
    var data = {};
    var hash = location.hash;
    var form = $("#nwform").serializeArray();
    data.fields = form;
    data["hash"] = hash;
    nw_ajax("/nwlib6/nwproject/modules/nwforms/srv/saveNwFormAll.php", data);
}

function submitNwForm(self, onlygetdata) {
    console.log("submitNwForm", self);
//    var dg = getRecord(self);
//    console.log("dg", dg);
    var array = {};
    var inputDiv = $(self + " .inputdatanwform");
    var total = inputDiv.length;
    for (var i = 0; i < total; i++) {
        var div = $(inputDiv[i]);
        var divInitial = $(inputDiv[i]);
        var divOnclick = div;
        var id = div.attr("id");
        var name = div.attr("name");
        var type = div.attr("type");
        var typeData = div.attr("data-type");
        var revOrden = div.attr("data-revorden");
        var revLabel = div.attr("data-revlabel");
        var data = div.val();
        var title = div.attr("data-t");
        var require = div.attr("require");
        var ios = div.attr("datainp");
        var s = ".divContainInputIntern" + ios;
        var divFocus = $(s);

        var totalcaracteres = div.val().length;
        var car_min = div.attr("minlength");
        var car_max = div.attr("maxlength");
        if (typeof car_min != "undefined" && onlygetdata !== true) {
            if (totalcaracteres < car_min) {
                divFocus.focus().append("<span class='errorForm'>Faltan caracteres, mínimo " + car_min + " </span>").addClass("containerRequired");
                div.focus();
                div.keyup(function () {
                    if ($(this).val() != "") {
                        removeErrorN(divFocus);
                    }
                });
                div.change(function () {
                    if ($(this).val() != "") {
                        removeErrorN(divFocus);
                    }
                });
                return false;
            }
        }
        if (type == "radio") {
            data = $(s + ' input[name=' + name + ']:checked').attr('value');
            if (typeof data == "undefined") {
                data = "";
            }
        }
        if (type == "checkbox") {
            require = "NO";
            var totalChecks = $(s + " .checkbox_input").length;
            for (var ii = 0; ii < totalChecks; ii++) {
                if (ii == 0) {
                    data = "";
                }
                var divCheck = $(s + " .checkbox_" + ii);
                var check = divCheck.attr("checked");
                var requireCheck = divCheck.attr("require");
                if (check == "checked") {
                    var coma = ",";
                    if (ii + 1 == totalChecks) {
                        coma = "";
                    }
                    data += divCheck.val() + coma;
                } else {
                    if (requireCheck == "SI") {
                        require = "SI";
                        div = $(s);
                        divOnclick = $(".inputdatanwform" + ios);
                    }
                }
            }
        }
        var er = "Este campo no puede quedar vacío";
        if (type == "email" || type == "correo") {
            if (evalueData(data)) {
                er = "Correo no válido";
            }
            data = validateEmail(data);
        }
        if (require == "SI" && onlygetdata !== true) {
            if (data == "" || !data) {
                var error = er;
                $(".errorForm").remove();
                divFocus.focus().append("<span class='errorForm'>" + error + "</span>").addClass("containerRequired");
                div.focus();
                divOnclick.click(function () {
                    if ($(this).val() != "") {
                        removeErrorN(divFocus);
                    }
                });
                divOnclick.keyup(function () {
                    if ($(this).val() != "") {
                        removeErrorN(divFocus);
                    }
                });
                divOnclick.change(function () {
                    if ($(this).val() != "") {
                        removeErrorN(divFocus);
                    }
                });
                return false;
            }
        }

        array[i] = {};
        array[i]["id"] = id;
        array[i]["name"] = name;
        array[i]["campo"] = title;
        array[i]["respuesta"] = data;
        array[i]["type"] = type;
        array[i]["typeData"] = typeData;
        array[i]["id_pregunta"] = ios;
        array[i]["rev_orden"] = revOrden;
        array[i]["rev_label"] = revLabel;
        array[name] = data;
    }

    if (onlygetdata === true) {
        return array;
    }

    loading("Cargando", "rgba(255, 255, 255, 0.76)!important", self);

    var action = $(self).attr("data-action");

    if (action === "SI") {
        var action_func = $(self).attr("data-action-func");
        delayedAlertOne(window[action_func](array), 100);
    } else {
        sendDataNwForm(array, self);
    }
}

function removeErrorN(div) {
    $(".errorForm").remove();
    div.removeClass("containerRequired");
}


function b(funcionLlamada) {
    window[funcionLlamada]();
}
function delayedAlertOne(func, time) {
    timeoutIDNotifica = window.setTimeout(func, time);
}

idform = 0;
function sendDataNwForm(array, self) {
    var table = $(self).attr("data-db");
    var offline = $(self).attr("offline");
    fecha_insert_nwform = getDateHour();
    if (offline == "SI") {
        arreglaDataAdd(table, self);
    }
    localStorage["dataNwForm" + idform] = array;

    console.log("array", array);

    var get = getGET();


    traeDataLocalNwForm();
    idform++;
    var id_enc = $(self).attr("data-i");
    var data_f = $(self).serializeArray();
    var data_g = "";
    var tieneCaptcha = false;
    for (var i = 0; i < data_f.length; i++) {
        var dd = data_f[i];
        if (dd.name === "g-recaptcha-response") {
            data_g = dd.value;
            tieneCaptcha = true;
        }
    }
    var data = {};
    data.array = array;
    data.id_enc = id_enc;
    data.fecha_insert = fecha_insert_nwform;
    data.data_f = data_f;
    data.data_g = data_g;
    data.url = location.href;
    if (get) {
        if (evalueData(get.id_relational)) {
            data.id_relational = get.id_relational;
        }
    }
    if (tieneCaptcha === true) {
        data.contain_captcha = "SI";
        if (!evalueData(data.data_g)) {
            removeLoading(self);
            removeLoading();
            nw_dialog("Debe rellenar el reCaptcha");
            return false;
        }
    }
    console.log("tieneCaptcha", tieneCaptcha);
    console.log("data1 start", data);

    $.ajax({
        type: "post",
        url: "/nwlib6/nwproject/modules/nwforms/srv.php",
        data: data,
        dataType: "json",
        error: function (error) {
            removeLoading(self);
            removeLoading();
            console.log(error);
            verifyErrorNwMaker(error);
            sendErrorMaker("Ha ocurrido un error. (mira la consola) " + error);
            /*
             nw_dialog("Ha ocurrido un error. (mira la consola) " + error);
             */
        },
        success: function (data) {
            console.log("data", data);
//            return;
            var urlRe = $("#nwform").attr("url-redirect");
            if (data === "reCAPTCHA_invalido") {
                removeLoading(self);
                removeLoading();
                nw_dialog("CAPTCHA inválido");
                return false;
            }
            var sb = $(self).attr("data-sub-end");
            if (evalueData(sb)) {
                var r = {};
                r.data = data;
                r.array = array;
                r.self = self;
                r.url_end = urlRe;
                r.end = function () {
                    if (evalueData(urlRe) === true) {
                        window.location = urlRe;
                        return true;
                    }
                    dialogOk(array, self);
                };
                window[sb](r);
                return true;
            }
            if (data !== "") {
                removeLoading(self);
                removeLoading();
                nw_dialog(data);
                console.log(data);
                return;
            }
            if (evalueData(urlRe) == true) {
                removeLoading(self);
                removeLoading();
                window.location = urlRe;
                return;
            }
            if (evalueNextBack(self, "next") == false) {
                removeLoading(self);
                removeLoading();
                dialogOk(array, self);
            }
            removeLoading(self);
            removeLoading();
        }
    });
}

function evalueNextBack(self, mode) {
    var idForm = $(self).attr("data-i");
    var next = $("." + mode + "NwForm_" + idForm).attr("data-next");
    if (evalueData(next)) {
        window.location = "/nwlib6/nwproject/modules/nwforms/index.php?form=" + next + "&vista=nwvista";
        return true;
    }
    return false;
}
function traeDataLocalNwForm() {
    for (var i = 0; i < idform; i++) {
        localStorage["dataNwForm" + i];
    }
}
function formNwClean() {
    var msg = "Enviado correctamente.";
    showPopUp("", "Información de formulario", msg);
    document.getElementById("nwform").reset();
}
function resetNwForm() {
    document.getElementById("nwform").reset();
    $(".showImage").html(" ");
}
function dialogOk(array, self) {
    resetForm(self);
    $.ajax({
        type: "post",
        url: "/nwlib6/nwproject/modules/nwforms/srv/getArray.php",
        data: {array: array},
        error: function (e) {
            console.log(e);
            /*
             nw_dialog("La operación no pudo ser procesada. Inténtelo de nuevo. (ver consola)");
             */
            sendErrorMaker("La operación no pudo ser procesada. Inténtelo de nuevo. (ver consola)" + e);
            verifyErrorNwMaker(e);
            return;
        },
        success: function (data) {
            removeLoading(self);
            var html = "";
            html += "<div class='popupNwForm popupNwFormNwproject'>";
            html += "<h2>" + msgEndNwForms + " </h2>";
            html += "<div class='buttonsNwfEnc'>";
//            html += "<div class='printNwForm btn btn-blue'>Imprimir</div>";
//            html += "<div class='listnwformDilig' ><div class='listnwformDiligInt' id='printDivForm' >" + data + "</div></div>";
            html += "</div";
            html += "</div>";
            var params = {};
            params.html = html;
            params.self = "dialogNwFormNwProject";
            params.onSave = function () {
                window.location.reload();
                return false;
            };
            params.no_cancel_button = true;
            params.no_buttons_enc = true;
            params.buttonMin = false;
            params.buttonMax = false;
            params.showEnc = false;
            params.width = 500;
            params.title = 'Formulario Enviado';
            createDialogNw(params);
        }
    });
}

function actionSelectBoxDinamic(ra) {
    var div = $("select.selectBox" + ra["asociado_selectbox"]);
    div.attr("relation_select", ra["id"]);
    div.attr("relation_tb", ra["table"]);
    div.attr("relation_col", ra["asociado_columna"]);
    div.attr("table_data", ra["tableData"]);
    $(document).ready(function () {
        onChangeSelect(div);
        div.change(function () {
            onChangeSelect(this);
        });
    });

}

function onChangeSelect(self) {
    var data = $(self).val();
    var ref = $(self).attr("ref");
    $(self).addClass("option_selected_" + data);
    addOptionsSelect(data, ref);
}

function addOptionsSelect(id, ref) {
    var div = $(".selectBox" + ref);
    var col = div.attr("relation_col");
    var id_relation = div.attr("relation_select");
    var relation_tb = div.attr("relation_tb");
    var table_data = div.attr("table_data");
    var order = div.attr("order");
    var order_asc = div.attr("order_asc");

    var data = {};
    data["id_select_enc"] = id;
    data["id_select_depend"] = id_relation;
    data["column_relation"] = col;
    data["relation_tb"] = relation_tb;
    data["table_data"] = table_data;
    data["order"] = order;
    data["order_asc"] = order_asc;
    $.ajax({
        url: '/nwlib6/nwproject/modules/nwforms/srv/loadFormsPreguntasValores.php',
        type: 'POST',
        data: data,
        async: false,
        success: function (data) {
            $('.selectBox' + id_relation).html(data);
        },
        error: function (r) {
            nw_dialog("<span class='error'>Ha ocurrido un error.</span>" + r);
            console.log("<span class='error'>Ha ocurrido un error.</span>" + r);
        }
    });

}

function comprueba_extension(archivo) {
    var extensiones_permitidas = new Array(".gif", ".jpg", ".doc", ".pdf", ".xlsx", ".png", ".JPG", ".PNG", ".GIF");
    var extension = getExtensionFile(archivo);
    var permitida = false;
    for (var i = 0; i < extensiones_permitidas.length; i++) {
        if (extensiones_permitidas[i] == extension) {
            permitida = true;
            break;
        }
    }
    return permitida;
}