var onchangeselextboxtwofunc = false;
$(document).ready(function () {
    (function () {
        $('html').delegate('.divResultTokenNw', 'click', function (e) {
            var add = getAttributeNw(this, "data-add");
            var id = getAttributeNw(this, "data");
            var text = $(this).text();
            var self = getAttributeNw(this, "self");
            var field = getAttributeNw(this, "field");
            if (evalueData(add)) {
                text = add;
            }
            addValueSelectTokenField(self, field, id, text, this);
        });
    })();
    (function () {
        $('html').delegate('.resetSelectTokenField', 'click', function (e) {
            var field = getAttributeNw(this, "field");
            var self = getAttributeNw(this, "self");
            var box = ".boxTextselectTokenField_" + field;
            $(".boxTextselectTokenField_" + field).text("");
            setValue(self, field, "");
            setValue(self, field + "_text", "");
            $(box).removeClass("fullTextselectTokenField");
            $(".boxTextselectTokenField_" + field).attr("contenteditable", "true");
            $(self + " .palceholderSelectTokenField_" + field).fadeIn(0);

        });
    })();
    (function () {
        $('body').delegate('.showImage', 'click', function (e) {
            shwoImagePopUp(this);
        });
    })();
    (function () {
        $('body').delegate('.deleteImgMakerUp', 'click', function (e) {
            var s = $(this);
            var self = s.attr("data-self");
            var key = s.attr("data-input");
            setValue(self, key, "");
            s.remove();
        });
    })();
    (function () {
        $('body').delegate('.selectBoxTwo', 'click', function (e) {
            $(this).addClass("selectBoxTwo_hover");
            $(this).find(".optionSelextBoxTwo").addClass("opseltw_hover");
        });
    })();
    (function () {
        $('body').delegate('.selectBoxTwo', 'mouseleave', function (e) {
            $(this).removeClass("selectBoxTwo_hover");
            $(this).find(".optionSelextBoxTwo").addClass("opseltw_hover");
        });
    })();
    (function () {
        $('body').delegate('.optionSelextBoxTwo', 'mousedown', function (e) {
            var s = $(this);
            var self = s.attr("data-self");
            var input = s.attr("data-input");
            var d = s.attr("value");
            setValue(self, input, d);
            $(self + " ." + input).find(".optionSelextBoxTwo").removeClass("opseltw_selected");
            s.addClass("opseltw_selected");
            $(self + " .selectBoxTwo").removeClass("selectBoxTwo_hover");
            if (onchangeselextboxtwofunc !== false) {
                onchangeselextboxtwofunc();
            }
        });
    })();
    (function () {
        $('body').delegate('select', 'change', function (e) {
            var s = $(this);
            var v = s.attr("val-data");
            if (evalueData(v)) {
                var d = s.val();
                s.attr("val-data", d);
            }
        });
    })();
    (function () {
        $('body').delegate('.class_maxmin_maker', 'keydown', function (e) {
            return validateMaxMinNumbers(this, e);
        });
    })();

    (function () {
        $('body').delegate('.inputdatanwform', 'keyup', function (e) {
            var val = $(this).val();
            var name = $(this).attr("name");
            var self = $(this).attr("data-self");

            hiddenShooLabel(self, val, name);

            validateCartsInv(this);
        });
    })();
    (function () {
        $('body').delegate('.class_maxmin_maker', 'change', function (e) {
            return validateMaxMinNumbers(this, e);
        });
    })();
    (function () {
        $('body').delegate('.dialogNwRestaura', 'click', function () {
            var self = $(this).attr("self");
            $(this).fadeOut(0);
            restauraForm(self);
        });
    })();
    (function () {
        $('body').delegate('.dialogNwMax', 'click', function () {
            var self = $(this).attr("self");
            $(this).fadeOut(0);
            maximiceForm(self);
        });
    })();
    (function () {
        $('#containerHomeUser').delegate('#cancelNwFormMaster', 'click', function () {
            reject(".containFormFields");
            $(".midivtest").fadeIn(0);
            $(".mainModulesMaker").fadeIn(0);
            getFuncHash();
            location.hash = oldHashMaster;
        });
    })();
    (function () {
        $('body').delegate('input', 'click', function () {
            $(".colsMenuInt").removeClass("colsMobil_show_menu");
        });
    })();
    (function () {
        $('body').delegate('.dialogNwMIn', 'click', function () {
            var self = $(this).attr("self");
            var di = $(".dialogEnc_" + self.replace(".", ""));
            var bg = $(".BGdialogBg_" + self.replace(".", ""));
            if ($(".containerWindMin").length == 0) {
                $("body").append("<div class='containerWindMin'></div>");
            }
            di.addClass("nwDialogMinimiced");
            di.fadeOut(0);
            bg.fadeOut(0);
            $(".containerWindMin").append("<div class='containDialogNwMinimiced' self='" + self + "' ></div>");
            setBodyOverflow("reject");
        });
    })();
    (function () {
        $('body').delegate('.containDialogNwMinimiced', 'click', function () {
            var self = $(this).attr("self");
            var di = $(".dialogEnc_" + self.replace(".", ""));
            var bg = $(".BGdialogBg_" + self.replace(".", ""));
            di.removeClass("nwDialogMinimiced");
            di.fadeIn(0);
            bg.fadeIn(0);
            $(this).remove();
            if ($(".containDialogNwMinimiced").length == 0) {
                $(".containerWindMin").remove();
            }
            adapterSizeAndPositionDialogNw(".dialogEnc_" + self.replace(".", ""));
        });
    })();
    (function () {
        $('body').delegate(':file', 'change', function () {
            var self = this;
            newLoading(self, "Subiendo", false, "after");
            var name = $(this).attr("id-div");
            var div = $(this).attr("self-div");
            var func = function (r) {
                newRemoveLoading(self);
            };
            if (typeof div != "undefined") {
                subeFile(name, div, func);
            } else {
                subeFile(name, false, func);
            }
        });
    })();
    (function () {
        $('body').delegate('input', 'keyup', function () {
            var self = this;
            var typeNumber = $(self).attr("typeNumber");
            if (typeNumber == "number") {
                $(this).val(this.value.match(/[0-9]*/));
            }
        });
    })();
    click(".groupAcordeonOpen", function () {
        var parent = $(this).attr("self");
        var self = $(this).attr("group");
        self = self.replace(/ /gi, '');
        var selfClean = self;
        selfClean = selfClean.replace(/\./gi, '');
        self = parent + " " + self;
        var show = $(self).attr("show");
        if (show == "true") {
            $(self).attr("show", "false");
            $(self).find(".titleStartGroupAcordeon").fadeIn(0);
            $(self).find(".startGroupIntern").removeClass("showContainAcordeon");
            $(self).removeClass("showContainAcordeon_parent");
            $(self).removeClass("showContainAcordeon_parent_" + selfClean);
        } else {
            $(self).attr("show", "true");
            $(self).find(".titleStartGroupAcordeon").fadeOut(0);
            $(self).find(".startGroupIntern").addClass("showContainAcordeon");
            $(self).addClass("showContainAcordeon_parent");
            $(self).addClass("showContainAcordeon_parent_" + selfClean);
        }
        if (evalueData(show) == false) {
            adapterSizeAndPositionDialogNw();
        }
    });
});

function createContainer(addTo, code, divClassName) {
    if (addTo == undefined) {
        addTo = ".loadModulosCenter";
    } else
    if (addTo == "master") {
        addTo = ".loadModulosCenter";
    }
    if (code === true && typeof divClassName != "undefined") {
        remove(divClassName);
        code = convertDivNameInObjectDiv(divClassName);
    }

    if ($(addTo).length == 0) {
        addTo = convertDivNameInObjectDiv(addTo);
        initContainer(addTo);
    }

    $(addTo).append(code);
    if (typeof divClassName != "undefined") {
        return divClassName;
    }
}
function createDocument(self) {
    return    generateSelf(self, false, true);
}
function initContainer(divClassName) {
    return generateSelf(divClassName, true, "niporelputas");
}
function generateSelf(self, create, dontEmpty) {
    var div = self;
    var empty = false;
    if (self != undefined && self != false && self != null && self != "" && self != "rand") {
        empty = true;
    }
    if (dontEmpty === "niporelputas" || dontEmpty === "generateDiv") {
        if ($(".containFileDir").length === 0) {
            createContainer("master", "<div class='loadModulesUnitary'><div class='containFileDir containFileDir_" + containFileDirNum + "' ></div></div>");
        }
        $(".containFileDir").append(convertDivNameInObjectDiv(div));
        $(div).addClass("addDivConverted");
    } else {
        if (self != "rand") {
            if (dontEmpty) {
                empty = false;
                return self;
            }
            if (!dontEmpty) {
                $(self).empty();
            }
        } else
        if (self == "rand") {
            create = true;
        }
        if (empty) {
            $(self).empty();
            return self;
        }
        var num = Math.floor((Math.random() * 10000) + 1);
        var div = ".newNwFormMaker_" + num;
        if (create) {
            if ($(div).length == 0) {
                var divapp = convertDivNameInObjectDiv(div);
                $(".containFileDir").append(divapp);
            }
        }
    }
    return div;
}

function formAddCss(self, div, css) {
    $(self + " " + div).css(css);
}

function addCss(self, cell, css, mode, append) {
    listAddCssFor(self, cell, css, mode, append);
}

function listAddCssFor(self, cell, css, mode, append) {
    if (self == undefined) {
        self = ".containFileDir";
    }
    var show = false;

    if (mode == "mobile") {
        if (isMobile()) {
            show = true;
        }
    } else {
        show = true;
    }
    /*comprueba que cell no sea un número, si es número es una clase propia como fila de row
     entonces, si cell es NaN osea no es un número*/
    if (show) {
        if (!isNaN(parseInt(cell))) {
            cell = ".numberColList_" + cell;
        }
        if (append === true || append === "append") {
            var csson = "";
            csson += self + " " + cell + " {";
            $.each(css, function (key, value) {
                var imp = "";
                if (key === "width" && value.indexOf("!important") === -1) {
                    imp = "!important";
                }
                csson += key + ":" + value + imp + ";";
            });
            csson += "}";
            var co = document.querySelector(self + " .containStyleMakerApp");
            if (co) {
                $(self + " .containStyleMakerApp style").append(csson);
            } else {
                var cssap = "<div class='containStyleMakerApp'>";
                cssap += "<style>";
                cssap += csson;
                cssap += "</style>";
                cssap += "</div>";
            }
            $(self).append(cssap);
        } else {
            $(self + " " + cell).css(css);
        }
    }
}

function validateCartsInv(element) {
    var val = $(element).val();
    if (evalueData(val)) {
        if (val.indexOf("'") !== -1 || val.indexOf('"') !== -1) {
            var str2 = val.substring(0, val.length - 1);
            $(element).val(str2);
        }
    }
}
function hiddenShooLabel(self, val, name) {
    var hidden = $(self + " .labelInt_" + name).attr("data-hidden");
    if (hidden === "SI") {
        var top = "0";
        if (val.length <= 0) {
            top = "35px";
        }
        $(self + " .labelInt_" + name).css({top: top});
    }
}

function shwoImagePopUp(self) {
    var src = $(self).attr("url-img");
    var src2 = $(self).attr("src");
    if (evalueData(src) === false) {
        if (evalueData(src2)) {
            src2 = src2.replace("/nwlib6/includes/phpthumb/phpThumb.php?src=", "");
            src2 = src2.replace("/nwproject/includes/phpthumb/phpThumb.php?src=", "");
            for (var i = 0; i < 500; i++) {
                src2 = src2.replace("&w=" + i + "&f=jpg", "");
                src2 = src2.replace("&h=" + i + "&f=jpg", "");
            }
            src2 = src2.replace("&w=150&f=jpg", "");
            src2 = src2.replace("&w=150&f=JPG", "");
            src2 = src2.replace("&w=150&f=png", "");
            src2 = src2.replace("&w=150&f=PNG", "");
            src2 = src2.replace("&w=150&f=gif", "");
            src2 = src2.replace("&w=560&f=jpg", "");
            src2 = src2.replace("&w=560&f=JPG", "");
            src2 = src2.replace("&w=560&f=png", "");
            src2 = src2.replace("&w=560&f=PNG", "");
            src2 = src2.replace("&w=560&f=gif", "");
            src = src2;
        }
    }
    if (!src) {
        return false;
    }
    var html = "";
    var ext = getExtensionFile(src);
    var extensiones_img = new Array(".gif", ".jpg", ".png", ".JPG", ".JPEG", ".jpeg", ".PNG", ".GIF");
    var extensiones_pdf = new Array(".pdf", ".PDF");
    var extensiones_excel = new Array(".xls", ".xlsx");
    var extensiones_word = new Array(".doc", ".docx");

    if (extensiones_img.indexOf(ext) !== -1) {
        html = "<img class='containPhotoPopUp' src='" + src + "' />";
    } else {
        html = "<iframe style='width: 1000px;height: 800px;' class='containPhotoPopUp' src='" + src + "' ></iframe>";
    }

    var params = {};
    params.width = "auto";
    params.height = "auto";
    params.html = "<div class='containPhotoNwDialog'>" + html + "</div>";
    createDialogNw(params);
}

function onChangeSelectBoxTwo(func) {
    onchangeselextboxtwofunc = func;
}

function subeFile(name, div, callBack) {
    var divForm = $("#nwform")[0];
    if (evalueData(div)) {
        divForm = $(div)[0];
    } else {
        div = "#nwform";
    }
    var archivo = $(div + " #uploader_" + name).val();
    var data = new FormData(divForm);
    data.append("archivo", archivo);
    data.append("name_file", name);
    data.append("uploadfile", "uploader_" + name);
    data.append("rename_random", "rename_random");

    $.ajax({
        url: '/nwlib6/uploader.php',
        type: 'POST',
        data: data,
        cache: false,
        contentType: false,
        processData: false,
        beforeSend: function () {
            $(".bgBl").fadeIn();
        },
        success: function (data) {
            data = JSON.parse(data);
            if (typeof data.result.image_light_nwmaker != "undefined") {
                data.result.fileUrl = data.result.image_light_nwmaker;
            }
            if (!verifyErrorNwMaker(data)) {
                if (evalueData(callBack)) {
                    callBack(data);
                }
                if (typeof callbackForChangeFile !== "undefined") {
                    callbackForChangeFile(data);
                }
                return false;
            }
            var image = data.result.image_light;
            if (evalueData(data.result.fileUrl)) {
                image = data.result.fileUrl;
            }
            var urlFile = image;
            var file = getFileByType(urlFile);
            $(div + " #" + name).val(urlFile);
            var im = $(div + " .showImage" + name);
            im.before("<span data-self='" + div + "' data-input='" + name + "' class='deleteImgMakerUp'></span>");
            im.html("<div class='preViewFileUploader' style='background-image: url(" + file + ")' />");
            im.attr("url-img", file);
            if (evalueData(callBack)) {
                callBack();
            }
            var ret = {};
            ret.urlFile = urlFile;
            ret.file = file;
            if (typeof callbackForChangeFile !== "undefined") {
                callbackForChangeFile(ret);
            }
        },
        error: function (error) {
            nw_dialog("Error");
            if (!verifyErrorNwMaker(data)) {
                if (evalueData(callBack)) {
                    callBack();
                }
                return;
            }
            console.log(error);
            removeLoadingNw();
        }
    });
}

function loadFormsMain(idForm, nwtablemaker, r, self) {
    var rta = "";
    var offline;
    var action;
    var action_data;
    var tableDb;
    var fieldsForm;
    if (!evalueData(r)) {
        /*    if (idForm != "0" && idForm != "false" && idForm != "alf" && idForm != "createFormByTable" && idForm != "editFormByTable") {
         } else { */
        r = {};
        r["id"] = idForm;
        r["nombre"] = "";
        r["submit_externo"] = "SI";
        r["funcion_submit_externo"] = "funcSavForm";
        offline = "NO";
        r["offline_usar_consulta"] = "NO";
    } else {
        offline = r.offline;
    }
    action = "NO";
    action_data = "";

    if (r["submit_externo"] != undefined) {
        if (r["submit_externo"] == "SI" && r["funcion_submit_externo"] != "") {
            action = r["submit_externo"];
            action_data = r["funcion_submit_externo"];
        }
    }
    tableDb = "nwform" + idForm;
    /*
     rta += "<form offline='" + offline + "' data-db='" + tableDb + "' enctype='multipart/form-data' class='nwform' data-i='" + idForm + "' data-action='" + action + "' data-action-func='" + action_data + "' data-consult='" + r['offline_usar_consulta'] + "' >";
     */
    rta += "<form offline='" + offline + "' data-db='" + tableDb + "' enctype='multipart/form-data' class='nwform' id='nwform' data-i='" + idForm + "' data-action='" + action + "' data-action-func='" + action_data + "' data-consult='" + r['offline_usar_consulta'] + "' >";
    rta += "<h1>" + r['nombre'] + "</h1>";
    if (r["offline"] != undefined) {
        if (r["offline"] == "SI") {
            rta += "<script id='myscript' type='text/javascript' src='/nwlib6/nwproject/modules/nwforms/js/offline.js' ></script>";
            rta += "<script id='myscript' type='text/javascript' src='/nwproject/structure/js/nwdb.js' ></script>";
            if (r["css_offline"] != undefined) {
                if (r["css_offline"] == "SI") {
                    rta += "  <link href='/nwlib6/nwproject/modules/nwforms/css/styleOffline.css' rel='stylesheet' type='text/css' />";
                }
            }
            /*    fieldsForm = "";
             var c = JSON.parse(nwtablemaker);
             for (var i = 0; i < c.length; i++) {
             var name = c[i].name;
             fieldsForm += "{name: '" + name + "',field: '" + name + "',unique: false},";
             }
             */
            var rpc = {};
            rpc["service"] = "nwFormsMaker";
            rpc["method"] = "traeColsFormOffline";
            rpc["data"] = {id: r.id};
            var func = function (m) {
                if (!verifyErrorNwMaker(m)) {
                    return;
                }
                fieldsForm = m;
            };
            rpcNw("rpcNw", rpc, func, false);

            rta += "<script>var columns = [" + fieldsForm + "];</script>";
            rta += "<script>startDB('bd" + idForm + "nwproject5" + r['version_db'] + "', '" + tableDb + "', columns, " + r['version_db'] + ");</script>";
            rta += "<div class='containOfflineAll'>";
            rta += "<div class='containOfflineAllButtons'>";
            rta += "<button type='button' data-db='" + tableDb + "' class='loadTableDb'>Cargar Historial</button>";
            rta += "<button type='button'  class='newRegistroNwForm'>Crear nuevo registro</button>";
            rta += "<button type='button'  data-db='" + tableDb + "' class='nwSync' data-url='" + r['url_php_sincronizar'] + "' >Sincronizar</button>";
            rta += "</div>";
            rta += "<table id='elementsList' class='elementsList' ></table>";
            rta += "</div>";
        }
    }
    rta += "<div class='containFormFields' >";

    if (idForm == "false") {
        rta += loadGrupos("0", nwtablemaker);
    } else
    if (idForm == "createFormByTable") {
        rta += loadFormsPreguntas("newrecord", nwtablemaker, null);
    } else
    if (idForm == "alf") {
        var lista = JSON.parse(nwtablemaker);
        var inputs = createInputsFor(lista, self);
        rta += inputs;
    } else {
        rta += loadGrupos(r["id"], nwtablemaker);
    }
    rta += "<div class='divSendNwForm' style='display:none;'><input type='button' id='sendNwForm' value='Enviar'  /></div>";
    rta += "<div class='clear'></div>";
    rta += "</div>";

    rta += "</form>";
    return rta;
}

function createInputsFor(cols, self) {
    var rta = "";
    var total = cols.length;
    for (var i = 0; i < total; i++) {
        var r = createInputs(cols[i], self);
        if (typeof cols[i]["tipo"] != "undefined") {
            if (cols[i]["tipo"] == "startGroup" || cols[i]["tipo"] == "endGroup") {
                r = "";
            }
        }
        if (typeof cols[i]["tipo"] != "undefined") {
            if (cols[i]["tipo"] == "startGroup") {
                var classGroup = "";
                var nameGroup = "";
                if (typeof cols[i]["mode"] != "undefined") {
                    if (cols[i]["mode"] == "vertical") {
                        classGroup = " startGroupVertical";
                    }
                }
                if (typeof cols[i]["name_group"] != "undefined") {
                    nameGroup = " " + cols[i]["name_group"];
                }
                var acordeon = "";
                if (typeof cols[i]["acordeon"] != "undefined") {
                    acordeon = " groupAcordeon";
                }
                rta += "<div class='startGroup" + classGroup + "" + nameGroup + " " + acordeon + "'>";
                if (typeof cols[i]["acordeon"] != "undefined") {
                    rta += "<div class='groupAcordeonOpen' self='" + self + "' group='." + nameGroup + "'><span class='spanTitleStartGroupAcordeon'>" + str(cols[i]["title"]) + "</span></div>";
                }
                rta += "<div class='startGroupIntern'>";
                if (typeof cols[i]["title"] != "undefined") {
                    rta += "<div class='titleStartGroup'><span class='spanTitleStartGroup'>" + str(cols[i]["title"]) + "</span></div>";
                } else
                if (typeof cols[i]["name"] != "undefined") {
                    rta += "<div class='titleStartGroup'><span class='spanTitleStartGroup'>" + str(cols[i]["name"]) + "</span></div>";
                } else
                if (typeof cols[i]["nombre"] != "undefined") {
                    rta += "<div class='titleStartGroup'><span class='spanTitleStartGroup'>" + str(cols[i]["nombre"]) + "</span></div>";
                }
            }
        }
        rta += r;
        if (typeof cols[i]["tipo"] != "undefined") {
            if (cols[i]["tipo"] == "endGroup") {
                rta += "<div class='clear'></div>";
                rta += "</div>";
                rta += "</div>";
            }
        }
    }
    return rta;
}

loadrecaptcha = false;
function createInputs(r, self) {
    var dataTable = null;
    var icon = "";
    var icon_type = "materialize";
    var classicon = "";
    var classaddic = "";
    if (r.tipo == 'textArea') {
        classaddic = "iconfortextarea";
    }
    if (typeof r.icon_type !== "undefined") {
        icon_type = r.icon_type;
    }
    if (typeof r.icon !== "undefined") {
        if (icon_type === "image" || icon_type === "imagen") {
            classicon += " inputWithIcontypeImage ";
            icon = "<div class='iconForm " + classaddic + "'><img class='icon_type_image' src='" + r.icon + "' /></div>";
        } else {
            icon = "<div class='iconForm " + classaddic + "'><i class='material-icons'>" + r.icon + "</i></div>";
        }
        classicon = "inputWithIcon";
    }
    if (r["id_parameter"] == undefined) {
        r["id_parameter"] = "0";
    }
    if (r["id"] == undefined) {
        r["id"] = "0";
    }
    if (typeof r.texto_ayuda == "undefined") {
        r["texto_ayuda"] = "";
    }
    if (typeof r.placeholder != "undefined") {
        r["texto_ayuda"] = r["placeholder"];
    }
    if (r["class"] == undefined) {
        r["class"] = "inputdatanwform";
    }
    if (r["name_submit"] == undefined) {
        r["name_submit"] = "";
    }
    if (r["requiredClass"] == undefined) {
        r["requiredClass"] = "";
    }
    if (r["idDiv"] == undefined) {
        r["idDiv"] = r["name"];
    }
    if (r["name_submit"] != "") {
        r["name"] = r["name_submit"];
    }
    if (typeof r["required"] == "undefined") {
        r["required"] = "NO";
    }
    if (typeof r["requerido"] != "undefined") {
        if (r["requerido"] == "SI" || r["requerido"] == true) {
            r["required"] = "SI";
            r["requiredClass"] = " <span class='requiredSpanNw'> *</span>";
        }
    }
    if (typeof r["required"] != "undefined") {
        if (r["required"] == true || r["required"] == "SI") {
            r["required"] = "SI";
            r["requiredClass"] = " <span class='requiredSpanNw'> *</span>";
        }
    }

    var autocomplete = "";
    if (typeof r["autocomplete"] != "undefined") {
        if (r["autocomplete"] != undefined) {
            if (!r["autocomplete"]) {
                autocomplete = " autocomplete='off' ";
            }
        }
    }

    var value = "";
    if (r["value"] != undefined) {
        value = r["value"];
    }
    var visible = "";
    var visibleClass = "";
    if (r["visible"] != undefined) {
        if (!r["visible"]) {
            visible = "visible='" + r["visible"] + "' ";
            visibleClass = " fieldNotVisible";
        }
    }
    if (r["tabla_data_si_no"] != undefined) {
        if (r["tabla_data_si_no"] == "SI") {
            if (r["tabla_data"] != "") {
                dataTable = r["tabla_data"];
            }
        }
    }
    var class_required = "";
    if (r["required"] == "SI") {
        class_required = " required ";
    }
    var onKeyUp = "";
    var enabled = "";
    var disabled = "";
    if (r["enabled"] != undefined) {
        if (!r["enabled"]) {
            enabled = " div_enabled_nwf";
            disabled = " readonly";
            onKeyUp = "onkeyup='onkeyreturn(this)'";
        }
    }

    var style = "";
    if (typeof r["style"] != "undefined") {
        $.each(r["style"], function (key, value) {
            style += key + ":" + value + ";";
        });
    }

    var class_maxmin_number = "";
    var maxlength = "";
    var minlength = "";
    if (typeof r["car_min"] != "undefined") {
        if (r["car_min"] != "") {
            minlength = "minlength='" + r["car_min"] + "'";
            class_maxmin_number = "class_maxmin_maker ";
        }
    }
    if (typeof r["min"] != "undefined") {
        if (r["min"] != "") {
            minlength = "minlength='" + r["min"] + "'";
            class_maxmin_number = "class_maxmin_maker ";
        }
    }
    if (typeof r["car_max"] != "undefined") {
        if (r["car_max"] != "") {
            maxlength = "maxlength='" + r["car_max"] + "'";
            class_maxmin_number = "class_maxmin_maker ";
        }
    }
    if (typeof r["max"] != "undefined") {
        if (r["max"] != "") {
            maxlength = "maxlength='" + r["max"] + "'";
            class_maxmin_number = "class_maxmin_maker ";
        }
    }

    var max_number = "";
    var min_number = "";
    if (typeof r["min_numer"] != "undefined") {
        if (r["min_numer"] != "") {
            min_number = "min='" + r["min_numer"] + "'";
            class_maxmin_number = "class_maxmin_maker ";
        }
    }
    if (typeof r["max_number"] != "undefined") {
        if (r["max_number"] != "") {
            max_number = "max='" + r["max_number"] + "'";
            class_maxmin_number = "class_maxmin_maker ";
        }
    }

    var tooltip = "";
    if (evalueData(r.tooltip)) {
        tooltip = "<div class='tooltipMaker'><div class='texttooltipMaker'>" + r.tooltip + "</div></div>";
    }
    var idioma = "";
    var idioma_sql = "";
    var idioma_native = false;
    if (idioma_sql != false)
        idioma_native = idioma_sql["name_in_english"];

    var label = "";
    if (typeof r["nombre"] != "undefined") {
        label = r["nombre"];
    }
    if (typeof r["label"] != "undefined") {
        label = r["label"];
    }
    /*
     label = label.replace("_", " ");
     */

    var classlab = "label_normal";
    var labelhidden = "NO";
    if (typeof r.mode_label != "undefined") {
        if (r.mode_label === "hidden") {
            classlab = "label_hidden";
            labelhidden = "SI";
        }
    }

    var dself = "";
    if (evalueData(self)) {
        dself = " data-self='" + self + "' ";
    }

    var rta = "";
    rta += "<div class='divContainInput divContainInput" + r['id'] + " " + visibleClass + " contain_input_name_" + r.name + " " + classicon + "' >";
    rta += "<div class='divContainInputIntern divContainInputIntern" + r['id'] + "'>";
    rta += "<div class='labelInt labelInt_" + r.name + " " + classlab + "' data-hidden='" + labelhidden + "' " + dself + " >";
    if (typeof r["type"] != "undefined") {
        r["tipo"] = r["type"];
    }
    if (r["tipo"] != "button") {
        rta += "<span class='textlabels'>" + str(label) + "</span>";
        rta += r["requiredClass"];
    } else {
        rta += "<span class='novisible' style='opacity: 0;'>.</span>";
    }
    rta += tooltip;
    rta += "</div>";

    if (r["tipo"] == "startGroup") {
        rta += "";
    } else
    if (r["tipo"] == "endGroup") {
        rta += "";
    } else
    if (r["tipo"] == "uploader") {
        var typeFile = '  accept="image/*;capture=camera" ';
        if (r.mode === "takePhoto") {
            typeFile = ' accept="image/*" capture="camera" ';
        } else
        if (r.mode === "images") {
            typeFile = ' accept="image/*" ';
        }
        if (typeof r.accept_ext !== "undefined") {
            if (r.accept_ext !== false) {
                typeFile = ' accept="' + r.accept_ext + '" ';
            }
        }
        rta += icon + "<input " + dself + " type='file' " + typeFile + " class='uploader_filenw uploader_" + r['name'] + "' id='uploader_" + r['name'] + "' name='uploader_" + r['name'] + "'  id-div='" + r['idDiv'] + "' />";
        rta += "<input " + dself + " type='hidden' typeNwmaker='file' name='" + r['name'] + "' id='" + r['idDiv'] + "' class='" + r['class'] + " inputdatanwform" + r['id'] + " " + class_required + " " + enabled + " " + r['idDiv'] + " ' " + disabled + " data-t='" + r['nombre'] + "'  require='" + r['required'] + "' data-i='" + r['id_parameter'] + "' />";
        rta += "<div class='showImage showImageNwForm showImage" + r['idDiv'] + " nameimgup_" + r['idDiv'] + "'></div>";
        rta += "<p class='textholder_uploader'>" + str(r['texto_ayuda']) + "</p>";
    } else
    if (r["tipo"] == "image" || r["tipo"] == "img" || r["tipo"] == "imagen") {
        var mod = "";
        var maxw = "";
        if (typeof r.mode !== "undefined") {
            if (r.mode === "phpthumb") {
                mod = " data-mode='phpthumb' ";
            }
        }
        if (typeof r.maxWidth !== "undefined") {
            maxw = " data-max-width='" + r.maxWidth + "' ";
        }
        rta += icon + "<input " + dself + " " + maxw + " " + mod + " type='hidden' typeNwmaker='file' name='" + r['name'] + "' id='" + r['idDiv'] + "' class='" + r['class'] + " inputdatanwform" + r['id'] + " " + class_required + " " + enabled + " " + r['idDiv'] + "' data-t='" + r['nombre'] + " '  " + disabled + "   require='" + r['required'] + "' data-i='" + r['id_parameter'] + "' />";
        rta += "<div class='showImage showImageNwForm showImage" + r['idDiv'] + " nameimgup_" + r['idDiv'] + "'></div>";
        rta += "<p class='textholder_uploader'>" + str(r['texto_ayuda']) + "</p>";
    } else
    if (r.tipo === "background-image" || r.tipo === "background_image" || r.tipo === "backgroundImage") {
        var mod = "";
        if (typeof r.mode !== "undefined") {
            if (r.mode === "phpthumb") {
                mod = " data-mode='phpthumb' ";
            }
        }
        rta += icon + "<span " + dself + " name='" + r['name'] + "' id='" + r['idDiv'] + "' type='background-image' class='inputbackgroundImage inputdatanwform" + r['id'] + " " + r['idDiv'] + "' data-t='" + r['nombre'] + " ' data-i='" + r['id_parameter'] + "'></span>";
        rta += "<p class='textholder_uploader'>" + str(r['texto_ayuda']) + "</p>";
    } else
    if (r.tipo == "color" || r.tipo == "colorpicker" || r.tipo == "colorbutton") {
        rta += icon + "<input " + dself + "  onfocus='validateFocus(this)' " + pattern + " style='" + style + "' " + max_number + " " + min_number + " " + autocomplete + " " + maxlength + " " + minlength + "  " + onKeyUp + " modeinput='" + modeInput + "'  " + visible + "  placeholder='" + str(r['texto_ayuda']) + "' type='color' name='" + r['name'] + "' id='" + r['idDiv'] + "' class='inputcolorpicker " + class_maxmin_number + r['class'] + " " + visibleClass + " " + r['name'] + " inputdatanwform" + r['id'] + " " + class_required + " " + enabled + "'  " + disabled + "  data-t='" + r['nombre'] + "'  require='" + r['required'] + "' data-i='" + r['id_parameter'] + "' value='" + value + "' />";
    } else
    if (r.tipo == "textField" || r.tipo == "selectTokenField") {
        var textint = "";
        var modeInput = "text";
        var typeInput = "text";
        var pattern = "";
        if (r["mode"] != undefined) {
            if (r["mode"] == "numeric") {
                typeInput = "number";
            } else
            if (r["mode"] == "integer" || r["mode"] == "int") {
                /*                typeInput = "number";*/
                pattern = "pattern='([0-9]|[0-9]|[0-9])' typeNumber='number' ";
            } else
            if (r["mode"] == "money") {
                modeInput = "money";
                typeInput = "number";
                textint = "<span class='spanMoneyInit'>$</span>";
            } else
            if (r["mode"] == "email") {
                modeInput = "email";
                typeInput = "email";
            } else {
                modeInput = "text";
                typeInput = "text";
            }
        }
        if (r.tipo == "selectTokenField") {
            visible = "visible='" + r["visible"] + "' ";
            visibleClass = " fieldNotVisible";
            rta += textint + "<input " + pattern + " style='" + style + "' " + max_number + " " + min_number + " " + autocomplete + " " + maxlength + " " + minlength + "  " + onKeyUp + " modeinput='" + modeInput + "'  " + visible + "  placeholder='" + str(r['texto_ayuda']) + "' type='" + typeInput + "' name='" + r['name'] + "_text' id='" + r['idDiv'] + "_text' class='" + class_maxmin_number + " " + r['class'] + "_text " + visibleClass + " " + r['name'] + "_text inputdatanwform_" + r['id'] + "_text " + class_required + " " + enabled + "'  " + disabled + "  data-t='" + r['nombre'] + "_text'  require='" + r['required'] + "' data-i='" + r['id_parameter'] + "' value='" + value + "' />";
            if (evalueData(r['texto_ayuda'])) {
                rta += "<div class='palceholderSelectTokenField  palceholderSelectTokenField_" + r['name'] + "'>" + r['texto_ayuda'] + "</div>";
            }
            rta += "<div " + dself + " id='showTextselectTokenField' class='showTextselectTokenField boxTextselectTokenField_" + r['name'] + "' contenteditable='true'></div><div id='containerResultselectTokenField' class='containerResultselectTokenField containerResultselectTokenField_" + r['name'] + "'></div>";
        }
        rta += icon + textint + "<input " + dself + "  onfocus='validateFocus(this)' " + pattern + " style='" + style + "' " + max_number + " " + min_number + " " + autocomplete + " " + maxlength + " " + minlength + "  " + onKeyUp + " modeinput='" + modeInput + "'  " + visible + "  placeholder='" + str(r['texto_ayuda']) + "' type='" + typeInput + "' name='" + r['name'] + "' id='" + r['idDiv'] + "' class='" + class_maxmin_number + r['class'] + " " + visibleClass + " " + r['name'] + " inputdatanwform" + r['id'] + " " + class_required + " " + enabled + "'  " + disabled + "  data-t='" + r['nombre'] + "'  require='" + r['required'] + "' data-i='" + r['id_parameter'] + "' value='" + value + "' />";
    } else
    if (r["tipo"] == "password") {
        rta += icon + "<input " + dself + "  " + visible + "  placeholder='" + str(r['texto_ayuda']) + "' type='password' autocomplete='password' name='" + r['name'] + "' id='" + r['idDiv'] + "' class='" + r['class'] + " " + visibleClass + " " + r['name'] + " inputdatanwform" + r['id'] + " " + class_required + " " + enabled + "'  " + disabled + "  data-t='" + r['nombre'] + "'  require='" + r['required'] + "' data-i='" + r['id_parameter'] + "' value='" + value + "' />";
    } else
    if (r["tipo"] == "link") {
        var target = "_self";
        if (evalueData(r["target"])) {
            target = r["target"];
        }
        rta += "<a " + dself + " style='" + style + "'  " + visible + "  placeholder='" + str(r['texto_ayuda']) + "' type='link' name='" + r['name'] + "' id='" + r['idDiv'] + "' target='" + target + "' loading='NO' class='linkFormNw " + r['class'] + " " + visibleClass + " " + r['name'] + " inputdatanwform" + r['id'] + " " + class_required + " " + enabled + "'  " + disabled + "  data-t='" + r['name'] + "'  require='" + r['required'] + "' data-i='" + r['id_parameter'] + "' >" + value + "</a>";
    } else
    if (r["tipo"] == "button") {
        var lab = "";
        if (evalueData(r['nombre'])) {
            lab = r['nombre'];
        }
        if (evalueData(r['label'])) {
            lab = r['label'];
        }
        /*
         rta += "<input " + dself + " style='" + style + "'  " + visible + "  placeholder='" + str(r['texto_ayuda']) + "' type='button' name='" + r['name'] + "' id='" + r['idDiv'] + "' class='" + r['class'] + " " + visibleClass + " " + r['name'] + " inputdatanwform" + r['id'] + " " + class_required + " " + enabled + "'  " + disabled + "  data-t='" + r['name'] + "'  require='" + r['required'] + "' data-i='" + r['id_parameter'] + "' value='" + str(lab) + "' />";
         */
        rta += icon + "<button " + dself + " style='" + style + "'  " + visible + "  placeholder='" + str(r['texto_ayuda']) + "' type='button' name='" + r['name'] + "' id='" + r['idDiv'] + "' class='" + r['class'] + " " + visibleClass + " " + r['name'] + " inputdatanwform" + r['id'] + " " + class_required + " " + enabled + "'  " + disabled + "  data-t='" + r['name'] + "'  require='" + r['required'] + "' data-i='" + r['id_parameter'] + "' >" + str(lab) + "</button>";
    } else
    if (r['tipo'] == 'textArea') {
        /*
         rta += icon + "<textarea type='" + r.tipo + "' style='" + style + "' placeholder='" + str(r['texto_ayuda']) + "' name='" + r['name'] + "' id='" + r['idDiv'] + "' class='" + r['class'] + " " + r['name'] + " inputdatanwform" + r['id'] + "  " + class_required + " " + enabled + "' " + disabled + "  data-t='" + r['name'] + "' require='' data-i='' ></textarea>";
         */
        rta += icon + "<textarea type='" + r.tipo + "' style='" + style + "' placeholder='" + str(r['texto_ayuda']) + "' name='" + r['name'] + "' class='" + r['class'] + " " + r['name'] + " inputdatanwform" + r['id'] + "  " + class_required + " " + enabled + "' " + disabled + "  data-t='" + r['name'] + "' require='' data-i='' ></textarea>";
    } else
    if (r["tipo"] == "selectBox") {
        var multiple = "";
        if (r["mode"] != undefined) {
            if (r["mode"] == "multiple" || r["mode"] == "integer" || r["mode"] == "int") {
                multiple = " multiple ";
            }
        }
        rta += icon + "<select " + dself + " style='" + style + "' type='selectBox' placeholder='" + str(r['texto_ayuda']) + "' " + multiple + " name='" + r['name'] + "' id='" + r['idDiv'] + "' class='" + r['class'] + " " + r['name'] + " inputdatanwform" + r['id'] + "  " + class_required + " " + enabled + "' " + disabled + " data-t='" + r['nombre'] + "' require='" + r['required'] + "' data-i='" + r['id_parameter'] + "' >";
        rta += "</select>";
    } else
    if (r["tipo"] == "selectBoxTwo") {
        rta += icon + "<div " + dself + " style='" + style + "' type='selectBoxTwo' placeholder='" + str(r['texto_ayuda']) + "' name='" + r['name'] + "' id='" + r['idDiv'] + "' class='selectBoxTwo " + r['class'] + " " + r['name'] + " inputdatanwform" + r['id'] + "  " + class_required + " " + enabled + "' " + disabled + " data-t='" + r['nombre'] + "' require='" + r['required'] + "' data-i='" + r['id_parameter'] + "' >";
        rta += "<div " + dself + " class='containOptionsSelectTwo_selected'></div>";
        rta += "<div " + dself + " class='containOptionsSelectTwo'></div>";
        rta += "</div>";
    } else
    if (r["tipo"] == "radio") {
        rta += icon + "<input " + dself + " style='" + style + "'  modeinput='" + modeInput + "'  " + visible + "  type='radio' name='" + r['name'] + "' id='" + r['idDiv'] + "' class='" + r['class'] + " " + visibleClass + " " + r['name'] + " inputdatanwform" + r['id'] + " " + class_required + " " + enabled + "'  " + disabled + "  data-t='" + r['nombre'] + "'  require='" + r['required'] + "' data-i='" + r['id_parameter'] + "' value='" + value + "' />";
    } else
    if (r["tipo"] == "checkBoxMultiple") {
        rta += icon + "<input " + dself + "  modeinput='" + modeInput + "'  " + visible + "  type='checkBox' name='" + r['name'] + "' id='" + r['idDiv'] + "' class='" + r['class'] + " " + visibleClass + " " + r['name'] + " inputdatanwform" + r['id'] + " " + class_required + " " + enabled + "'  " + disabled + "  data-t='" + r['nombre'] + "'  require='" + r['required'] + "' data-i='" + r['id_parameter'] + "' value='" + value + "' />";
    } else
    if (r["tipo"] == "checkbox" || r["tipo"] == "checkBox") {
        rta += icon + "<input " + dself + " style='" + style + "' " + autocomplete + " " + maxlength + " " + minlength + "  " + onKeyUp + " modeinput='" + modeInput + "'  " + visible + "  placeholder='" + str(r['texto_ayuda']) + "' type='checkBox' name='" + r['name'] + "' id='" + r['idDiv'] + "' class='" + r['class'] + " " + visibleClass + " " + r['name'] + " inputdatanwform" + r['id'] + " " + class_required + " " + enabled + "'  " + disabled + "  data-t='" + r['nombre'] + "'  require='" + r['required'] + "' data-i='" + r['id_parameter'] + "' value='" + value + "' />";
    } else
    if (r["tipo"] == "date" || r["tipo"] == "dateField") {
        rta += icon + "<input " + dself + " style='" + style + "' placeholder='" + str(r['texto_ayuda']) + "' type='date' name='" + r['name'] + "' id='" + r['idDiv'] + "' class='" + r['class'] + " inputdatanwform" + r['id'] + "  " + class_required + " " + r['name'] + " " + enabled + "' " + disabled + "  data-t='" + r['nombre'] + "'  require='" + r['required'] + "' data-i='" + r['id_parameter'] + "' />";
    } else
    if (r["tipo"] == "time") {
        rta += icon + "<input " + dself + " style='" + style + "' placeholder='" + str(r['texto_ayuda']) + "' type='time' name='" + r['name'] + "' id='" + r['idDiv'] + "' class='" + r['class'] + " inputdatanwform" + r['id'] + " " + r['name'] + " " + class_required + " " + enabled + "' " + disabled + "  data-t='" + r['nombre'] + "'  require='" + r['required'] + "' data-i='" + r['id_parameter'] + "' />";
    } else
    if (r["tipo"] == "datetime" || r["tipo"] == "dateTimeField") {
        rta += icon + "<input " + dself + " style='" + style + "' placeholder='" + str(r['texto_ayuda']) + "' type='datetime-local' name='" + r['name'] + "' id='" + r['idDiv'] + "' class='" + r['class'] + " inputdatanwform" + r['id'] + " " + r['name'] + " " + class_required + " " + enabled + "' " + disabled + "  data-t='" + r['nombre'] + "'  require='" + r['required'] + "' data-i='" + r['id_parameter'] + "' />";
    } else
    if (r["tipo"] == "label") {
        rta += icon + "<div " + dself + " type='label' style='" + style + "' type='divlabel' id='" + r['idDiv'] + "' class='" + r['class'] + " inputdatanwform" + r['id'] + " divlabelnwform " + r['idDiv'] + "' data-t='" + r['nombre'] + "'  data-i='" + r['id_parameter'] + "' ></div>";
    } else
    if (r.tipo === "redes_sociales") {
        rta += nwSocial();
    } else
    if (r.tipo === "captcha") {
        rta += "<script src='https://www.google.com/recaptcha/api.js'></script>";
        rta += "<div " + dself + " class='g-recaptcha' data-sitekey='6LfWZ4oUAAAAADXlU61YvGl5jkGyvv79Zz1Pa6Lc'></div>";
        loadrecaptcha = true;
    } else {
        rta += "<input " + dself + " style='" + style + "' " + visible + "  placeholder='" + str(r['texto_ayuda']) + "' type='text' name='" + r['name'] + "' id='" + r['idDiv'] + "' class='" + r['class'] + " " + visibleClass + " " + r['name'] + " inputdatanwform" + r['id'] + " " + class_required + " " + enabled + "' " + disabled + "  data-t='" + r['nombre'] + "'  require='" + r['required'] + "' data-i='" + r['id_parameter'] + "' value='" + value + "' />";
    }
    rta += "<div class='clear'></div></div>";
    rta += "<div class='clear'></div></div>";

    return rta;
}

function setColumnsFormNumber(self, num) {
    if (!isMobile()) {
        if (self == ".containFormNw") {
            self = ".containFormFields";
        }
        var width = 100 / parseInt(num);
        $("div" + self).find(".divContainInput").css({"width": width + "%", "display": "inline-block", "min-width": "auto"});
    }
}

function setWidth(self, width) {
    if (isMobile()) {
        return;
    }
    if (self == ".containFormNw") {
        self = ".containFormFields";
    }
    if ($(".dialogEnc_" + self.replace(".", "")).length > 0) {
        $($(".dialogEnc_" + self.replace(".", ""))).width(width);
    } else {
        $(self).width(width);
        var wbody = $("body").width();
        var left = (wbody / 2) - (width / 2);
        $(".ui-dialog").css({"left": left});
    }
}

function setHeight(self, height) {
    if (self == ".containFormNw") {
        self = ".containFormFields";
    }
    if (height == "100%") {
        $(self).height("!100%");
        return;
    }
    $(self).height(height);
    var hbody = $("body").height();
    var top = (hbody / 2) - (height / 2);
    $(".ui-dialog").css({"top": top});
}
function createNwForms(self, fields, mode, r) {
    return createNwFormsNew(self, fields, mode, r);
}
function getRecord(self) {
    var id = $(self).attr("data");
    var div = $(".namedColMob_" + id);
    var divValue = $(".valueColMob_" + id);
    var total = div.length;
    var rta = {};
    for (var i = 0; i < total; i++) {
        var name = $(div[i]).attr("name");
        var value = $(divValue[i]).text();
        rta[name] = value;
    }
    return rta;
}
function addDivButtonsNwForms(self) {
    $(self).append("<div class='footerButtonsNwForms'></div>");
}
function addHeaderNote(self, html, forma) {
    addHtmlForm(self, html, "header", forma);
}

function addFooterNote(self, html) {
    addHtmlForm(self, html, "footer");
}

function addHtmlForm(self, html, mode, forma) {
    if (self == ".containFormNw") {
        self = ".containFormFields";
    }
    var exist = false;
    if (mode == "header") {

        if (forma != "remove") {
            if ($(self + " .addHeaderNote").length > 0) {
                self = self + " .addHeaderNote";
                exist = true;
            }
        }
        if (forma == "remove") {
            $(self + " .addHeaderNote").remove();
        }

        html = str(html);

        if (forma == "appendInHeader") {
            if (exist) {
                $(self + " .addHeaderNote").append(html);
            }
        } else
        if (forma == "append") {
            if (exist) {
                $(self).append(html);
            } else {
                $(self).append("<div class='addHtmlForm addHeaderNote'>" + html + "</div>");
            }
        } else
        if (forma == "prepend") {
            if (exist) {
                $(self).prepend(html);
            } else {
                $(self).prepend("<div class='addHtmlForm addHeaderNote'>" + html + "</div>");
            }
        } else
        if (forma == "before") {
            if (exist) {
                $(self).before(html);
            } else {
                $(self).before("<div class='addHtmlForm addHeaderNote'>" + html + "</div>");
            }
        } else
        if (forma == "remove") {
            if (exist) {
                $(self).append(html);
            } else {
                $(self).append("<div class='addHtmlForm addHeaderNote'>" + html + "</div>");
            }
        } else {
            if (exist) {
                $(self).prepend(html);
            } else {
                $(self).prepend("<div class='addHtmlForm addHeaderNote'>" + html + "</div>");
            }
        }
    } else
    if (mode == "footer") {
        if ($(".dialogEnc_" + self.replace(".", "") + " .dialogNwNewInter").length > 0) {
            $(".dialogEnc_" + self.replace(".", "") + " .dialogNwNewInter").append("<div class='addHtmlForm addFooterNote'>" + html + "</div>");
        } else
        if ($(self + " .footerButtonsNwForms").length > 0) {
            $(self + " .footerButtonsNwForms").append("<div class='addHtmlForm addFooterNote'>" + html + "</div>");
        } else {
            $(self).after("<div class='addHtmlForm addFooterNote'>" + html + "</div>");
        }
    } else {
        if (typeof forma != "undefined") {
            if (forma == "after") {
                $(self).after(html);
            } else
            if (forma == "before") {
                $(self).before(html);
            } else
            if (forma == "append") {
                $(self).append(html);
            } else
            if (forma == "prepend") {
                $(self).prepend(html);
            } else
            if (forma == "appendto") {
                $(self).appendto(html);
            } else {
                $(self).append(html);
            }
        } else {
            $(self).append(html);
        }
    }
    return false;
}

function prepend(self, html) {
    $(self).prepend(html);
}

function onlyAddHtml(data, div) {
    addInWIndow(data, div, "onlyAddHtml");
}
function actionInColForm(self, ui) {
    var f = $(self + " ." + ui);
    if (!f) {
        nw_dialog("El campo " + ui + " que intenta hacer una accion con actionInColForm no existe");
        return false;
    }
    return f;
}

function removeButtonsNwForm(self) {
    $(self + " .divSendNwForm").remove();
}
function addStyleLInk(self, button) {
    addStyleInButton(self, button, "link");
}

function addStyleBig(self, button) {
    addStyleInButton(self, button, "big");
}

function addStyleInButton(self, button, type) {
    var className = "";
    if (type == "big") {
        className = "btnMakerBig";
    } else
    if (type == "link") {
        className = "btnMakerLink";
    }
    if (button[0] == "." || button[0] == "#") {
        $(self + " " + button).addClass(className);
    } else {
        button.addClass(className);
    }
}
function validateFocus(s) {
    if (s) {
        var r = s.getAttribute("readonly");
        if (r == "" || r == "readonly" || r == "SI" || r == "yes" || r == "YES") {
            $(s).focusout();
            $(s).blur();
        }
    }
}
function getRecordNwForm(self, formDiv) {
    var div = self;
    if (self == ".containFormNw") {
        div = ".ui-dialog";
    }
    /*
     var refForm = "#nwform";
     */
    var refForm = ".nwform";
    if (typeof formDiv != "undefined") {
        if (evalueData(formDiv)) {
            refForm = formDiv;
        }
    }
    var form = $(div).find(refForm);
    var array = form.serializeArray();

    var names = (function () {
        var n = [],
                l = array.length - 1;
        for (; l >= 0; l--) {
            n.push(array[l].name);
        }
        return n;
    })();

    var data = {};
    $(div + ' input[type="checkbox"]:not(:checked)').each(function () {
        if ($.inArray(this.name, names) === -1) {
            array.push({name: this.name, value: 'off'});
        }
    });

    $(div + ' .selectBoxTwo').each(function () {
        if ($.inArray(this.name, names) === -1) {
            var se = $(this);
            var na = se.attr("name");
            var va = se.attr("val-data");
            array.push({name: na, value: va});
        }
    });

    var che = document.querySelectorAll(".divContainInput");
    if (che.length > 0) {
        for (var i = 0; i < che.length; i++) {
            var ch = che[i];
            var ti = ch.getAttribute("type");
            if (ti === "checkBoxMultiple") {
                var checks = [];
                var na = ch.getAttribute("id-div");
                var ko = 0;
                $(ch).find('.divCheckBoxOrRadio_input').each(function () {
                    var id = this.value;
                    var v = false;
                    if ($(this).is(":checked")) {
                        v = true;
                    }
                    checks[ko] = {
                        name: id,
                        value: v
                    };
                    ko++;
                });
                data["checkbox_" + na] = checks;
            }
        }
    }

    $(div + ' input[type="radio"]:not(:checked)').each(function () {
        if ($.inArray(this.name, names) === -1) {
            array.push({name: this.name, value: 'off'});
        }
    });
    var tot = array.length;
    for (var i = 0; i < tot; i++) {
        var dat = array[i];
        var key = dat.name;
        var value = dat.value;

        var val = getValueData(self, key, value).value;
        var array_ = getValueData(self, key, value).array;
        var text = getValueData(self, key, value).text;

        if (typeof val === "undefined") {
            val = "";
        }

        var input = $("div" + self).find("." + key);
        var type = input.attr("type");
        if (type === "selectBox") {
            var all_data = getValueData(self, key, value).all_data;
            if (evalueData(all_data)) {
                data[key + "_all_data"] = all_data;
            }
        } else
        if (type === "selectBoxTwo") {
            var all_data = getValueData(self, key, value).all_data;
            if (evalueData(all_data)) {
                data[key + "_all_data"] = all_data;
            }
        }
        data[key] = val;
        if (evalueData(array_)) {
            data[key + "_array"] = array_;
        }
        if (evalueData(text)) {
            data[key + "_text"] = text;
        }
    }
    return data;
}

function getValue(self, ui) {
    if (typeof ui == "string") {
        ui.replace("#", "");
        ui.replace(".", "");
    }
    var p = getValueData(self, ui);
    var r = p["value"];
    return r;
}

function getValueData(self, ui, val) {
    var input = $(ui);
    if (typeof ui == "string") {
        input = $("div" + self).find("#" + ui);
    }
    var data = {};
    var key = input.attr("name");
    var value = input.val();
    if (evalueData(val)) {
        value = val;
    }
    var type = input.attr("type");
    var attrData = input.attr("val-data");
    if (evalueData(attrData) && typeof ui != "object") {
        value = attrData;
    }
    var modeinput = input.attr("modeinput");
    if (modeinput == "money" || modeinput == "integer") {
        value = value.replace(".", "");
        value = value.replace(".", "");
        value = value.replace(".", "");
        value = value.replace(".", "");
        value = value.replace(".", "");
        value = value.replace(".", "");
    }
    if (type == "radio") {
        value = $('input[name=' + key + ']:checked').attr('value');
    } else
    if (type == "selectBoxTwo") {
        var valor = input.attr('val-data');
        var text = input.find('.optionsValueMaker_' + valor).text();
        value = valor;
        data.text = text;
        if (typeof ui === "string") {
            var ds = document.querySelector(self + " ." + ui + " .optionsValueMaker_" + cleanUserNwC(valor));
            var all_data = "";
            if (ds) {
                all_data = ds.data;
            }
        }
        data.all_data = all_data;

    } else
    if (type == "selectBox") {
        var multiple = input.attr("multiple");
        if (multiple === "multiple") {
            var num = 0;
            var concatValor = [];
            input.find('option:selected').each(function () {
                if ($(this).val() != "") {
                    concatValor[num] = {};
                    concatValor[num]["value"] = $(this).val();
                    concatValor[num]["text"] = $(this).text();
                    num++;
                }
            });
            data["array"] = concatValor;
        }
        var text = input.find('option:selected').text();
        var valor = input.find('option:selected').val();
        value = valor;
        if (typeof ui === "string") {
            var ds = document.querySelector(self + " ." + ui + " .optionsValueMaker_" + cleanUserNwC(valor));
            var all_data = "";
            if (ds) {
                all_data = ds.data;
            }
        }
        if (value === "") {
            text = "";
        }
        data.text = text;
        data.all_data = all_data;
    } else if (type == "button") {
        var value = input.text();
    }
    data["value"] = value;
    return data;
}

function setValue(self, key, value) {
    key = key.replace("://", "");
    var fclass_key = key;
    var fclass = "." + fclass_key;
    var d = document.querySelector(self + " .inputradiobuttonnwf_" + key);
    if (evalueData(d, "0")) {
        if (d) {
            fclass = ".inputradiobuttonnwf_" + key;
            fclass_key = "inputradiobuttonnwf_" + key;
        }
    }
    var type = $(self).find(fclass).attr("type");
    var pass = true;
    if (type === "selectBox" || type === "selectBoxTwo") {
        var dataAsync = $(self).find(fclass).attr("data-async");
        if (dataAsync === "true") {
            var s = $(self).find(fclass);
            s.attr("val-data", value);
            var sa = $(self).find(fclass + " option");
            var t = sa.length;
            var pass = false;
            for (var i = 0; i < t; i++) {
                var x = $(sa[i]);
                if (x.val() == value) {
                    pass = true;
                }
            }
            if (type === "selectBoxTwo") {
                $(self).find(fclass + " .optionsValueMaker_" + value).addClass("opseltw_selected");
                var htt = $(self).find(fclass + " .optionsValueMaker_" + value).html();
                $(self).find(fclass + " .containOptionsSelectTwo_selected").html(htt);
            }
        }
    }
    if (false === pass) {
        return false;
    }

    var typeNwmaker = $(self).find(fclass).attr("typeNwmaker");
    var modeinput = $(self).find(fclass).attr("modeinput");
    var modedata = $(self).find(fclass).attr("data-mode");
    var modedatamaxwidth = $(self).find(fclass).attr("data-max-width");

    if (typeof value == "object") {
        var name = "";
        if (typeof value.name != "undefined") {
            name = value.name;
        } else
        if (typeof value.nombre != "undefined") {
            name = value.nombre;
        }
        addValueSelectTokenField(self, fclass_key, value.id, name);
    } else
    if (type == "checkBox" || type == "check" || type == "radio") {
        $(self).find(fclass).prop('checked', value);
    } else
    if (type == "backgroundImage" || type == "background-image" || type == "background_image") {
        $(self).find(fclass).css({"background-image": "url(" + value + ")"});
    } else
    if (type == "divlabel" || type == "label") {
        $(self).find(fclass).html(value);
    } else
    if (type == "link") {
        $(self).find(fclass).text(value);
        $(self).find(fclass).attr("href", value);
    } else
    if (type == "file" || typeNwmaker == "file") {
        $(self).find(fclass).val(value);
        var imgshow = value;
        if (evalueData(modedata)) {
            if (modedata === "phpthumb") {
                var wx = 700;
                if (evalueData(modedatamaxwidth)) {
                    wx = modedatamaxwidth;
                }
                imgshow = getFileByType(value, false, 700);
            }
        }
        $(self).find(".nameimgup_" + fclass_key).before("<span data-self='" + self + "' data-input='" + key + "' class='deleteImgMakerUp'></span>");
        $(self).find(".nameimgup_" + fclass_key).html("<img class='imgshownwmaker imgshownwmaker_" + key + "' src='" + imgshow + "' />");
        $(self).find(".nameimgup_" + fclass_key).attr("url-img", value);
    } else {
        var val = value;
        if (modeinput == "money") {
            val = formato_numero(value, "0", ".", ".");
        }
        $(self + " " + fclass).val(val);
    }

    hiddenShooLabel(self, value, key);

}

function setRecordNwForm(array, time) {
    if (isNotTrue(time)) {
        time = 1000;
    }
    setTimeout(function () {
        setRecord("#nwform", array);
    }, time);
}
function setRecord(self, array, cleanHTML) {
    if (array == undefined) {
        return false;
    }
    if (self == ".containFormNw") {
        self = ".containFormFields";
    }
    $.each(array, function (key, value) {
        if (evalueData(value, "0")) {
            if (cleanHTML === true) {
                value = strip_tags(value);
            }
            setValue(self, key, value);
        }
    });
}
function activeSelectTokenField(self, field, service, method, isgeneri, table, fieldsSearch, otherData, valueInputSet) {
    var box = ".boxTextselectTokenField_" + field;
    var boxResults = ".containerResultselectTokenField_" + field;
    addListener(self, box, "keyup", function (a) {
        var d = $(box).text();
        var data = {};
        if (evalueData(otherData)) {
            data = otherData;
        }
        data.token = d;
        if (evalueData(d)) {
            $(self + " .palceholderSelectTokenField_" + field).fadeOut(0);
        } else {
            $(self + " .palceholderSelectTokenField_" + field).fadeIn(0);
        }
        setValue(self, field, "");
        setValue(self, field, d);
        addCss(self, boxResults, {"display": "none"});
        if (isgeneri === true) {
            service = "nwMaker";
            method = "populateSelectTokenFieldGeneric";
            data.table = table;
            data.fields = fieldsSearch;
        }
        var rpc = {};
        rpc["service"] = service;
        rpc["method"] = method;
        rpc["data"] = data;
        var func = function (r) {
            if (!verifyErrorNwMaker(r)) {
                return false;
            }
            var html = "";
            var t = r.length;
            if (t > 0) {
                addCss(self, boxResults, {"display": "block"});
                for (var i = 0; i < t; i++) {
                    var ra = r[i];
                    var dat = ra.id;
                    var datAd = "";
                    if (evalueData(valueInputSet)) {
                        dat = ra[valueInputSet];
                        datAd = " data-add='" + dat + "' ";
                    }
                    html += "<div class='divResultTokenNw' " + datAd + " data-number='" + i + "' data-name='" + ra.nombre + "' data='" + ra.id + "' self='" + self + "' field='" + field + "' >" + r[i].nombre + "</div>";
                }
            } else {
                addCss(self, boxResults, {"display": "none"});
            }
            if (d === "") {
                addCss(self, boxResults, {"display": "none"});
            }
            setEmpty(self, boxResults);
            appendDataToken(self, boxResults, html, r);
        };
        rpcNw("rpcNw", rpc, func);
    });
}

function appendDataToken(self, div, html, r) {
    $(self + " " + div).append(html);
    $(self + " " + div).find('.divResultTokenNw').each(function () {
        var i = $(this).attr("data-number");
        this.data = r[i];
    });
}

var funcchangetoken = false;

function addValueSelectTokenField(self, field, id, text, ob) {
    var box = ".boxTextselectTokenField_" + field;
    var boxResults = ".containerResultselectTokenField_" + field;
    $(".boxTextselectTokenField_" + field).attr("contenteditable", "false");
    $(".boxTextselectTokenField_" + field).text(text);
    $(".boxTextselectTokenField_" + field).append("<div class='resetSelectTokenField' field='" + field + "' self='" + self + "'>x</div>");

    setValue(self, field, id);
    setValue(self, field + "_text", text);
    addCss(self, boxResults, {"display": "none"});
    setEmpty(self, boxResults);
    $(box).addClass("fullTextselectTokenField");
    if (evalueData(funcchangetoken)) {
        funcchangetoken(ob);
    }
}

function getNamesCols(self) {
    var d = document.querySelectorAll(self + " .colEncMobil");
    var t = d.length;
    var r = [];
    for (var i = 0; i < t; i++) {
        var x = d[i];
        var cap = x.getAttribute("caption");
        var name = strip_tags(x.innerHTML);
        var order = x.getAttribute("order");
        var visible = x.getAttribute("visible");
        var html = x.innerHTML;
        var y = {
            caption: cap,
            html: html,
            order: order,
            visible: visible,
            name: name
        };
        r.push(y);
    }
    return r;
}
function setTitleForm(self, title) {
    $(".containDialogNwForm_" + self.replace(".", "") + " .ui-dialog-title").text(title);
}
function addCssTitleForm(self, css, mobile) {
    var inMobile = "";
    if (mobile === true) {
        inMobile = "mobile";
    }
    listAddCssFor(".containDialogNwForm_" + self.replace(".", ""), ".ui-dialog-titlebar", css, inMobile);
}
function changeTextButton(self, text) {
    $(self + " .btn_enc_Nuevo").text(str(text));
}
function resetGroupForm(self, grupo_name) {
    resetForm(self + " ." + grupo_name);
}
function restauraForm(self) {
    var di = $(".dialogEnc_" + self.replace(".", ""));
    $(".dialogEnc_" + self.replace(".", "") + " .dialogNwMax").fadeIn(0);
    di.removeClass("nwDialogMaximiced");
}
function maximiceForm(self) {
    var di = $(".dialogEnc_" + self.replace(".", ""));
    di.addClass("nwDialogMaximiced");
    $(".dialogEnc_" + self.replace(".", "") + " .dialogNwRestaura").fadeIn(0);
}
function populateSelectAsync(self, input, service, method, array, where, async, remove, select) {
    populateSelect(self, input, service, method, array, where, async, remove, select);
}

function populateSelect(self, input, service, method, array, where, async, remove, select, callback, typejson, createIcon) {
    if (!evalueData(async)) {
        async = true;
    }
    $(self).find("#" + input).attr("data-async", "true");
    var di = self + " #" + input;
    var type = $(di).attr("type");
    if (type == "selectBox" || type == "selectBoxTwo") {
        newLoading(di);
    }
    if (remove == true) {
        $(di).find('option').remove().end();
    }
    if (select === true) {
        var data = {};
        data[""] = str("(Seleccione)");
        populateSelectFromArray(input, data, self, remove);
    }
    var data = {};
    data["data"] = array;
    data["table"] = array["table"];
    data["bindValues"] = array["bindValues"];
    data["input"] = input;
    data["self"] = self;
    data["where"] = where;
    var rpc = {};
    rpc["service"] = service;
    rpc["method"] = method;
    rpc["data"] = data;
    var func = function (r) {
        newRemoveLoading(di);
        if (typejson === true) {
            if (r.indexOf("Error") !== -1) {
                nw_dialog(r);
                return;
            }
            r = JSON.parse(r);
        }
        if (!verifyErrorNwMaker(r)) {
            if (typeof callback !== "undefined") {
                if (evalueData(callback)) {
                    callback(r);
                }
            }
            return;
        }
        setPopulateSelect(self, input, r);
        if (createIcon === true) {
            for (var i = 0; i < r.length; i++) {
                var da = r[i];
                var img = da.imagen;
                var h = "<span class='iconSelectBoxTwo' style='background-image: url(" + img + ");'></span>";
                $(self + " ." + input + " .optionsValueMaker_" + da.id).prepend(h);
            }
        }
        var val = $(self).find("#" + input).attr("val-data");
        if (evalueData(val)) {
            setValue(self, input, val);
        }
        if (typeof callback !== "undefined") {
            if (evalueData(callback)) {
                callback(r);
            }
        }
    };
    rpcNw("rpcNw", rpc, func, async);
}

function loadPopulateSelect(self, input, array) {
    $(self + " ." + input).empty();
    var t = {};
    t[""] = "Seleccione";
    populateSelectFromArray(input, t, self);
    var total = array.length;
    for (var i = 0; i < total; i++) {
        var r = array[i];
        var t = {};
        t[r["id"]] = r["nombre"];
        populateSelectFromArray(input, t, self);
    }
}

function populateSelectFromArray(input, array, self, clean, isArray) {
    if (self == undefined) {
        self = "";
    } else {
        self = self + " ";
    }
    var div = $(self + " ." + input);
    var type = div.attr("type");
    var html = "";
    if (type !== "radio" && type !== "checkBox") {
        if (clean === true) {
            div.find('option').remove().end();
        }
    }
    if (isArray === true) {
        for (var i = 0; i < array.length; i++) {
            var alla = array[i];
            var key = alla.id;
            var value = alla.nombre;
            var ht = makeHtmlPopulate(input, key, i, value, type, self);
            html += ht;
            if (type !== "radio" && type !== "checkBox") {
                if (type == "selectBoxTwo") {
                    div.find(".containOptionsSelectTwo").append(ht);
                } else {
                    div.append(ht);
                }
                if (evalueData(alla.all_data) && document.querySelector(self + " ." + input + " .optionsValueMaker_" + cleanUserNwC(key))) {
                    document.querySelector(self + " ." + input + " .optionsValueMaker_" + cleanUserNwC(key)).data = alla.all_data;
                }
            }
        }
    } else {
        var i = 0;
        $.each(array, function (key, value) {
            var ht = makeHtmlPopulate(input, key, i, value, type, self);
            html += ht;
            if (type !== "radio" && type !== "checkBox") {
                if (type == "selectBoxTwo") {
                    var sel = strip_tags(ht);
                    if (sel === "(Seleccione)" || sel === "(Select)") {
                        ht = "<span class='toselc'>" + str("(Seleccione)") + "</span>";
                    }

                    div.find(".containOptionsSelectTwo_selected").html(ht);
                    div.find(".containOptionsSelectTwo").append(ht);
                } else {
                    div.append(ht);
                }
            }
            i++;
        });
    }
    if (type === "radio" || type === "checkBox") {
        if (evalueData(clean)) {
            if (clean === true) {
                remove(self + " .radioButtonsNw_" + input);
                remove(self + " .checkBoxMultiplesNw_" + input);
            }
        }
        if (typeof div.attr("require") !== "undefined") {
            if (div.attr("require") === "SI") {
                var tipo = "checkBoxMultiple";
                if (type == "radio") {
                    tipo = "radioMultiple";
                }
                $(self + " .contain_input_name_" + input + "").attr("id", "div_type_" + tipo + "_" + input);
                $(self + " .contain_input_name_" + input + "").attr("id-div", input);
                $(self + " .contain_input_name_" + input + "").attr("require", "SI");
                $(self + " .contain_input_name_" + input + "").attr("type", tipo);
                $(self + " .contain_input_name_" + input + "").addClass("required");
            }
        }
        div.before(html);
        if (clean === true) {
            div.fadeOut(0);
        } else {
            div.remove();
        }
    }
    $(self + " .optionsValueMaker_").addClass("opseltw_selected");
}

function makeHtmlPopulate(input, key, i, value, type, self) {
    var html = "";
    var num = Math.floor((Math.random() * 100) + 1);
    if (type == "radio") {
        html += "<div class='divCheckBoxOrRadio container-radios-buttons-nwforms radioButtonsNw_" + input + "'>";
        html += "<input name='" + input + "' id='inputradiobuttonnwf" + input + i + "' class='divCheckBoxOrRadio_input inputradiobuttonnwf inputradiobuttonnwf_" + input + " " + input + " " + input + num + " inputradionwmk_" + key + "' type='radio' value='" + key + "' />";
        html += "<label class='divCheckBoxOrRadio_label labelforradionwform labelforradionwform_" + input + " labelforradionwform_" + input + i + "' for='inputradiobuttonnwf" + input + i + "'>" + value + "</label>";
        html += "</div>";
    } else
    if (type == "checkBox") {
        html += "<div class='divCheckBoxOrRadio container-checkbox-buttons-nwforms checkBoxMultiplesNw_" + input + "'>";
        html += "<input name='" + input + num + "' id='inputcheckboxmultibuttonnwf" + input + i + "' inp-name='" + input + "' class='divCheckBoxOrRadio_input inputcheckboxbuttonnwf inputcheckboxtonnwf_" + input + " " + input + " " + input + num + "' type='checkBox' value='" + key + "' />";
        html += "<label class='divCheckBoxOrRadio_label labelforcheckboxmultiwform labelforcheckboxmultiwform_" + input + "' for='inputcheckboxmultibuttonnwf" + input + i + "'>" + value + "</label>";
        html += "</div>";
    } else
    if (type == "selectBoxTwo") {
        html += "<span  data-input='" + input + "' data-self='" + self + "' value='" + key + "' class='optionSelextBoxTwo optionsValueMaker optionsValueMaker_" + key + "' >" + str(value) + "</span>";
    } else {
        html += "<option value='" + key + "' class='optionsValueMaker optionsValueMaker_" + key + "' >" + str(value) + "</option>";
    }
    return html;
}
function setPopulateSelect(self, input, data) {
    if (!data) {
        return false;
    }
    var total = data.length;
    var d = [];
    /*    var d = {};*/
    for (var i = 0; i < total; i++) {
        d[i] = {};
        d[i]["id"] = data[i].id;
        d[i]["nombre"] = data[i].nombre;
        d[i]["all_data"] = data[i];
    }
    populateSelectFromArray(input, d, self, false, true);
}

function setMaxWidth(self, width) {
    $(self).css({"max-width": width});
}

function setMaxWidthModuleContain(self, w) {
    $(self).css({"max-width": w});
}

function selfButton(self, button) {
    return $(self + " ." + button);
}
function setVisibility(self, ui, option) {
    var display = "block";
    if (option === false) {
        display = "none";
        $(self + " .contain_input_name_" + ui).removeClass("fieldNotVisible");
        $(self + " .contain_input_name_" + ui).addClass("fieldNotVisible");

        $(self + " ." + ui).removeClass("fieldNotVisible");
        $(self + " ." + ui).addClass("fieldNotVisible");
    } else
    if (option === true) {
        display = "inline-block";
        $(self + " .contain_input_name_" + ui).removeClass("fieldNotVisible");
        $(self + " ." + ui).removeClass("fieldNotVisible");
    }
    $(self + " .contain_input_name_" + ui).css({"display": display});
    $(self + " ." + ui).css({"display": display});
}

function setRequired(self, ui, option) {
    if (option === true || option === "SI") {
        $(self + " ." + ui).addClass("required");
        $(self + " ." + ui).attr("require", "SI");
    } else {
        $(self + " ." + ui).removeClass("required");
        $(self + " ." + ui).attr("require", "NO");
    }
}

function hiddeButton(self, ui) {
    $(self + " " + ui).addClass("hiddenButon");
}

function setEnabled(self, ui, option) {
    var div = "." + ui;
    if (ui == "all") {
        div = ".inputdatanwform";
    }
    if (option === false) {
        $(self).find(div).removeClass("div_enabled_nwf");
        $(self + " " + div).removeAttr("readonly");
    } else {
        $(self + " " + div).addClass("div_enabled_nwf");
        $(self + " " + div).attr("readonly", "readonly");
    }
}
function addNavTable(self, nameGroup, func, params) {
    var divAdd = "";
    if (evalueData(nameGroup)) {
        divAdd = " ." + nameGroup + " .startGroupIntern";
    }
    var divContenedor = self + divAdd;
    var d = new func(divContenedor, params);
    d.constructor();
    return divContenedor;
}
function addRowNavTable(self, row) {
    var totalRows = $(self + " .colsMobil").length;
    var i = totalRows;
    var t = addRowInList(self, row, i);
    return t;
}
function getDataNavTable(navTable, array) {
    var t = getSelectedRecord(navTable, true, array);
    return t;
}
function validateMaxMinNumbers(s, e) {
    var d = $(s).val();
    if (evalueData(d)) {
        d = parseInt(d);
        var tecla = "";
        if (evalueData(e)) {
            tecla = e.keyCode;
        }
        var max_car = parseInt($(s).attr("max"));
        var min_car = parseInt($(s).attr("min"));
        var minlength = parseInt($(s).attr("minlength"));
        var maxlength = parseInt($(s).attr("maxlength"));
        var t = d.length + 1;

        if (evalueData(max_car)) {
            if (d > max_car) {
                $(s).val(max_car);
                return false;
            }
        }
        if (evalueData(min_car)) {
            if (d < min_car) {
                $(s).val(min_car);
                return false;
            }
        }

        if (evalueData(maxlength)) {
            if (t > maxlength) {
                return false;
            }
        }
        if (evalueData(minlength)) {
            if (t < minlength) {
            }
        }
    }
}

function cleanSelectBox(self, input) {
    var di = self + " #" + input;
    $(di).find('option').remove().end();
}