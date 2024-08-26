function reinitAll() {
    $(".th_enc").remove();
    $(".field_enc").remove();
    file_ya_existe = "";
    tr();
    loadInitial("pasa");
    butons_enc();
    file_ya_existe = $("#name_file").val();
    createBarEnc();
}
function field_get(div, data) {
    $("#" + div).html(data);
    $("." + div).html(data);
    values();
}
function loadInitial(d) {
    $("td").addClass("td_all");
        if (testdivs) {
        replaceNewDivs();
        addClassNewDivs();
    }
    $("Cell").addClass("td_all");
    if (d != "pasa") {
        $(".td_all").dblclick(function() {
            td_all_dblclick(this);
        });
    }
    var id_get = $("#form_general").attr("data-id");
    
    if (id_get == "") {
        $(".td_all").removeClass("td_selected");
        $("#A0").addClass("td_selected");
    }
    
    if (d != "pasa") {

        $(".td_all").mousedown(function(e) {
            tdAllMouseUp(e);
            td_all_click(this);
        });

//        (function() {
//            $('body').delegate('.td_all', 'click', function(e) {
//                tdAllMouseUp(e);
//                td_all_click(this);
//            });
//        })();
    }
    values();
}
function validarSiNumero(numero) {
    if (!/^([0-9])*$/.test(numero)) {
        return false;
    } else {
        return true;
    }
    return false;
}
function CopyToClipboard() {
//    var CopiedTxt = document.selection.createRange();
//    console.log(CopiedTxt);
//    CopiedTxt.execCommand("Copy");
//    $("#body_contain").bind({
//        copy: function() {
//            alert("¡Has copiado!");
//        },
//        paste: function() {
//            alert("¡Has pegado!");
//        },
//        cut: function() {
//            alert("¡Has cortado!");
//        }
//    });
}
function create_variable_global() {
    var div = $(".td_selected");
    div.attr("var-global", "true");
    div.addClass("varGlobal");
}
function remove_variable_global() {
    var div = $(".td_selected");
    div.attr("var-global", "false");
    div.removeClass("varGlobal");
}
function vista_previa() {
    $("head").after("<div class='css_vista_previa'><link href='" + carpeta + "css/vista_previa.css' rel='stylesheet' type='text/css' charset='utf-8' /></div>");
//    $(".th_rows").addClass("display_none");
//    $(".th_enc").addClass("display_none");
//    $(".formulas_enc").addClass("display_none");
//    $("#footer").addClass("display_none");
//    $("html").addClass("show_normal");
//    $("body").addClass("show_normal");
//    $(".enc_print").addClass("show_normal");
//    $("#contenedor").addClass("show_normal");
//    $("#form_general").addClass("show_normal");
//    $("#body_contain").addClass("show_normal");
//    $("#body_contain").addClass("show_hidden_overflow");
//    $("td").addClass("td_normal");
//    $("tr").addClass("td_normal");
//    $(".divisor_page").addClass("divisor_page_vista_previa");
//    $(".varGlobal").addClass("varGlobalNo");
}
function cancel_print() {
    $(".css_vista_previa").remove();
//    $(".th_rows").removeClass("display_none");
//    $(".th_enc").removeClass("display_none");
//    $(".formulas_enc").removeClass("display_none");
//    $("#footer").removeClass("display_none");
//    $("html").removeClass("show_normal");
//    $("body").removeClass("show_normal");
//    $(".enc_print").removeClass("show_normal");
//    $("#contenedor").removeClass("show_normal");
//    $("#form_general").removeClass("show_normal");
//    $("#body_contain").removeClass("show_normal");
//    $("#body_contain").removeClass("show_hidden_overflow");
//    $("td").removeClass("td_normal");
//    $("tr").removeClass("td_normal");
//    $(".divisor_page").removeClass("divisor_page_vista_previa");
//    $(".varGlobal").removeClass("varGlobalNo");
}
function print_document() {
    window.print();
}
function validate_doc() {
    $(".error").remove();
    if ($("#nombre").val() == "") {
        $("#nombre").after("<span class='error'>Debe poner un nombre al documento</span>");
        $("#nombre").focus();
        $("#nombre").keydown(function() {
            $(".error").remove();
        });
        return;
    }
    save();
}
function detecta_fecha(data) {
    var f = new Date();
//    var f = new Date('8/24/2009');
//    var f = new Date('2015-05-14');
    data = data.replace(/-/gi, "/");
    var f = new Date(data);
    if (data == 1) {
        return false;
    }
    if (f == "Invalid Date") {
        return false;
    }
    var error = 0;
    var year = f.getFullYear();
    var day = f.getDate();
    var month = f.getMonth() + 1;
    var splot_data = data.split("/");
    var date_format = year + "-" + splot_data[1] + "-" + day;
    //compruebo el año
    if (splot_data[0] == year || splot_data[2] == year) {
        error = 1;
    } else {
        error = 0;
    }
    //COMPRUEBO EL MES
    if (splot_data[1] == month) {
        error = 1;
    } else {
        error = 0;
    }
    //COMPRUEBO EL DÍA
    if (splot_data[2] == day || splot_data[0] == day) {
        error = 1;
    } else {
        error = 0;
    }
    if (error == 1) {
        return date_format;
    } else {
        return false;
    }
}
function fecha_actual() {
    var meses = new Array("Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre");
    var f = new Date();
    var date = f.getDate() + " de " + meses[f.getMonth()] + " de " + f.getFullYear();
    return date;
}
function pone_fecha_actual(div, func) {
    var date = fecha_actual();
    $(div).attr("func", func);
    $(div).text(date);
}
function mouse_hover_info() {
//    $(".td_all").mouseenter(function() {
//        var data = $(this).attr("id");
//        $(".field_footer").text(data);
//        field_hover = data;
//    });
}
//function abb() {
//    var str = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
//    for (var i = 0; i < str.length; i++) {
//        var nextChar = str.charAt(i);
//        console.log(nextChar);
//    }
//}
//recorre_abc = -1;
//letra_abc = 0;
//recorre_abc_two = -1;
//letra_abc_two = 0;
//function abc(a, toUpperCase, suma, usedTwo, sumFor) {
//    var init_total_abc = 26;
//    var rta = false;
//    if (a == -1) {
//        rta = "";
//        return rta;
//    }
//    var abecedario = new Array('a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z');
//    var total_abc = init_total_abc;
//    if (sumFor != undefined) {
//        total_abc = sumFor;
//    }
//    if (a == total_abc) {
//        if (usedTwo == true) {
//            letra_abc_two = parseInt(a) - parseInt(total_abc);
//            recorre_abc_two++;
//        } else {
//            letra_abc = parseInt(a) - parseInt(total_abc);
//            recorre_abc++;
//        }
//        total_abc = parseInt(init_total_abc) + parseInt(total_abc);
//    }
//    if (toUpperCase == true) {
//        if (abecedario[a] == undefined) {
//            var newNum = recorre_abc;
//            var newNumInit = letra_abc;
//            if (usedTwo == true) {
//                newNum = recorre_abc_two;
//                newNumInit = letra_abc_two;
//            }
//            rta = abc(newNum, true, false, usedTwo, total_abc) + abc(newNumInit, true, false, usedTwo, total_abc);
//        } else {
//            rta = abecedario[a].toUpperCase();
//        }
//    }
//    else {
//        rta = abecedario[a];
//    }
//    //COMPRUEBO QUE SEA DE UN NÚMERO SUPERIOR A 26 Y LE 
////    AUMENTO 1 A LAS VARIABLES GLOBALES
//    if (suma != false) {
//        if (usedTwo == true) {
//            letra_abc_two++;
//        } else {
//            letra_abc++;
//        }
//        if (a == 0) {
//            if (usedTwo == true) {
//                recorre_abc_two = -1;
//                letra_abc_two = 0;
//            }
//            else {
//                recorre_abc = -1;
//                letra_abc = 0;
//            }
//        }
//    }
//    return rta;
//}
function letras(a) {
    var letra = new Array("A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "AA", "AB", "AC", "AD", "AE", "AF", "AG", "AH", "AI", "AJ", "AK", "AL", "AM", "AN", "AO", "AP", "AQ", "AR", "AS", "AT", "AU", "AV", "AW", "AX", "AY", "AZ", "BA", "BB", "BC", "BD", "BE", "BF", "BG", "BH", "BI", "BJ", "BK", "BL", "BM", "BN", "BO", "BP", "BQ", "BR", "BS", "BT", "BU", "BV", "BW", "BX", "BY", "BZ", "CA", "CB", "CC", "CD", "CE", "CF", "CG", "CH", "CI", "CJ", "CK", "CL", "CM", "CN", "CO", "CP", "CQ", "CR", "CS", "CT", "CU", "CV", "CW", "CX", "CY", "CZ", "DA", "DB", "DC", "DD", "DE", "DF", "DG", "DH", "DI", "DJ", "DK", "DL", "DM", "DN", "DO", "DP", "DQ", "DR", "DS", "DT", "DU", "DV", "DW", "DX", "DY", "DZ", "EA", "EB", "EC", "ED", "EE", "EF", "EG", "EH", "EI", "EJ", "EK", "EL", "EM", "EN", "EO", "EP", "EQ", "ER", "ES", "ET", "EU", "EV", "EW", "EX", "EY", "EZ", "FA", "FB", "FC", "FD", "FE", "FF", "FG", "FH", "FI", "FJ", "FK", "FL", "FM", "FN", "FO", "FP", "FQ", "FR", "FS", "FT", "FU", "FV", "FW", "FX", "FY", "FZ", "GA", "GB", "GC", "GD", "GE", "GF", "GG", "GH", "GI", "GJ", "GK", "GL", "GM", "GN", "GO", "GP", "GQ", "GR", "GS", "GT", "GU", "GV", "GW", "GX", "GY", "GZ", "HA", "HB", "HC", "HD", "HE", "HF", "HG", "HH", "HI", "HJ", "HK", "HL", "HM", "HN", "HO", "HP", "HQ", "HR", "HS", "HT", "HU", "HV", "HW", "HX", "HY", "HZ", "IA", "IB", "IC", "ID", "IE", "IF", "IG", "IH", "II", "IJ", "IK", "IL", "IM", "IN", "IO", "IP", "IQ", "IR", "IS", "IT", "IU", "IV", "IW", "IX", "IY", "IZ", "JA", "JB", "JC", "JD", "JE", "JF", "JG", "JH", "JI", "JJ", "JK", "JL", "JM", "JN", "JO", "JP", "JQ", "JR", "JS", "JT", "JU", "JV", "JW", "JX", "JY", "JZ", "KA", "KB", "KC", "KD", "KE", "KF", "KG", "KH", "KI", "KJ", "KK", "KL", "KM", "KN", "KO", "KP", "KQ", "KR", "KS", "KT", "KU", "KV", "KW", "KX", "KY", "KZ", "LA", "LB", "LC", "LD", "LE", "LF", "LG", "LH", "LI", "LJ", "LK", "LL", "LM", "LN", "LO", "LP", "LQ", "LR", "LS", "LT", "LU", "LV", "LW", "LX", "LY", "LZ", "MA", "MB", "MC", "MD", "ME", "MF", "MG", "MH", "MI", "MJ", "MK", "ML", "MM", "MN", "MO", "MP", "MQ", "MR", "MS", "MT", "MU", "MV", "MW", "MX", "MY", "MZ", "NA", "NB", "NC", "ND", "NE", "NF", "NG", "NH", "NI", "NJ", "NK", "NL", "NM", "NN", "NO", "NP", "NQ", "NR", "NS", "NT", "NU", "NV", "NW", "NX", "NY", "NZ", "OA", "OB", "OC", "OD", "OE", "OF", "OG", "OH", "OI", "OJ", "OK", "OL", "OM", "ON", "OO", "OP", "OQ", "OR", "OS", "OT", "OU", "OV", "OW", "OX", "OY", "OZ", "PA", "PB", "PC", "PD", "PE", "PF", "PG", "PH", "PI", "PJ", "PK", "PL", "PM", "PN", "PO", "PP", "PQ", "PR", "PS", "PT", "PU", "PV", "PW", "PX", "PY", "PZ", "QA", "QB", "QC", "QD", "QE", "QF", "QG", "QH", "QI", "QJ", "QK", "QL", "QM", "QN", "QO", "QP", "QQ", "QR", "QS", "QT", "QU", "QV", "QW", "QX", "QY", "QZ", "RA", "RB", "RC", "RD", "RE", "RF", "RG", "RH", "RI", "RJ", "RK", "RL", "RM", "RN", "RO", "RP", "RQ", "RR", "RS", "RT", "RU", "RV", "RW", "RX", "RY", "RZ", "SA", "SB", "SC", "SD", "SE", "SF", "SG", "SH", "SI", "SJ", "SK", "SL", "SM", "SN", "SO", "SP", "SQ", "SR", "SS", "ST", "SU", "SV", "SW", "SX", "SY", "SZ", "TA", "TB", "TC", "TD", "TE", "TF", "TG", "TH", "TI", "TJ", "TK", "TL", "TM", "TN", "TO", "TP", "TQ", "TR", "TS", "TT", "TU", "TV", "TW", "TX", "TY", "TZ", "UA", "UB", "UC", "UD", "UE", "UF", "UG", "UH", "UI", "UJ", "UK", "UL", "UM", "UN", "UO", "UP", "UQ", "UR", "US", "UT", "UU", "UV", "UW", "UX", "UY", "UZ", "VA", "VB", "VC", "VD", "VE", "VF", "VG", "VH", "VI", "VJ", "VK", "VL", "VM", "VN", "VO", "VP", "VQ", "VR", "VS", "VT", "VU", "VV", "VW", "VX", "VY", "VZ", "WA", "WB", "WC", "WD", "WE", "WF", "WG", "WH", "WI", "WJ", "WK", "WL", "WM", "WN", "WO", "WP", "WQ", "WR", "WS", "WT", "WU", "WV", "WW", "WX", "WY", "WZ", "XA", "XB", "XC", "XD", "XE", "XF", "XG", "XH", "XI", "XJ", "XK", "XL", "XM", "XN", "XO", "XP", "XQ", "XR", "XS", "XT", "XU", "XV", "XW", "XX", "XY", "XZ", "YA", "YB", "YC", "YD", "YE", "YF", "YG", "YH", "YI", "YJ", "YK", "YL", "YM", "YN", "YO", "YP", "YQ", "YR", "YS", "YT", "YU", "YV", "YW", "YX", "YY", "YZ", "ZA", "ZB", "ZC", "ZD", "ZE", "ZF", "ZG", "ZH", "ZI", "ZJ", "ZK", "ZL", "ZM", "ZN", "ZO", "ZP", "ZQ", "ZR", "ZS", "ZT", "ZU", "ZV", "ZW", "ZX", "ZY", "ZZ", "AAA", "AAB", "AAC", "AAD", "AAE", "AAF", "AAG", "AAH", "AAI", "AAJ", "AAK", "AAL", "AAM", "AAN", "AAO", "AAP", "AAQ", "AAR", "AAS", "AAT", "AAU", "AAV", "AAW", "AAX", "AAY", "AAZ", "ABA", "ABB", "ABC", "ABD", "ABE", "ABF", "ABG", "ABH", "ABI", "ABJ", "ABK", "ABL", "ABM", "ABN", "ABO", "ABP", "ABQ", "ABR", "ABS", "ABT", "ABU", "ABV", "ABW", "ABX", "ABY", "ABZ", "ACA", "ACB", "ACC", "ACD", "ACE", "ACF", "ACG", "ACH", "ACI", "ACJ", "ACK", "ACL", "ACM", "ACN", "ACO", "ACP", "ACQ", "ACR", "ACS", "ACT", "ACU", "ACV", "ACW", "ACX", "ACY", "ACZ", "ADA", "ADB", "ADC", "ADD", "ADE", "ADF", "ADG", "ADH", "ADI", "ADJ", "ADK", "ADL", "ADM", "ADN", "ADO", "ADP", "ADQ", "ADR", "ADS", "ADT", "ADU", "ADV", "ADW", "ADX", "ADY", "ADZ", "AEA", "AEB", "AEC", "AED", "AEE", "AEF", "AEG", "AEH", "AEI", "AEJ", "AEK", "AEL", "AEM", "AEN", "AEO", "AEP", "AEQ", "AER", "AES", "AET", "AEU", "AEV", "AEW", "AEX", "AEY", "AEZ", "AFA", "AFB", "AFC", "AFD", "AFE", "AFF", "AFG", "AFH", "AFI", "AFJ", "AFK", "AFL", "AFM", "AFN", "AFO", "AFP", "AFQ", "AFR", "AFS", "AFT", "AFU", "AFV", "AFW", "AFX", "AFY", "AFZ", "AGA", "AGB", "AGC", "AGD", "AGE", "AGF", "AGG", "AGH", "AGI", "AGJ", "AGK", "AGL", "AGM", "AGN", "AGO", "AGP", "AGQ", "AGR", "AGS", "AGT", "AGU", "AGV", "AGW", "AGX", "AGY", "AGZ", "AHA", "AHB", "AHC", "AHD", "AHE", "AHF", "AHG", "AHH", "AHI", "AHJ", "AHK", "AHL", "AHM", "AHN", "AHO", "AHP", "AHQ", "AHR", "AHS", "AHT", "AHU", "AHV", "AHW", "AHX", "AHY", "AHZ", "AIA", "AIB", "AIC", "AID", "AIE", "AIF", "AIG", "AIH", "AII", "AIJ", "AIK", "AIL", "AIM", "AIN", "AIO", "AIP", "AIQ", "AIR", "AIS", "AIT", "AIU", "AIV", "AIW", "AIX", "AIY", "AIZ", "AJA", "AJB", "AJC", "AJD", "AJE", "AJF", "AJG", "AJH", "AJI", "AJJ", "AJK", "AJL", "AJM", "AJN", "AJO", "AJP", "AJQ", "AJR", "AJS", "AJT", "AJU", "AJV", "AJW", "AJX", "AJY", "AJZ", "AKA", "AKB", "AKC", "AKD", "AKE", "AKF", "AKG", "AKH", "AKI", "AKJ", "AKK", "AKL", "AKM", "AKN", "AKO", "AKP", "AKQ", "AKR", "AKS", "AKT", "AKU", "AKV", "AKW", "AKX", "AKY", "AKZ", "ALA", "ALB", "ALC", "ALD", "ALE", "ALF", "ALG", "ALH", "ALI", "ALJ", "ALK", "ALL");
    return letra[a];
    //   var letra = {};
//    letra[0] = "A";
//    letra[1] = "B";
//    letra[2] = "C";
//    letra[3] = "D";
//    letra[4] = "E";
//    letra[5] = "F";
//    letra[6] = "G";
//    letra[7] = "H";
//    letra[8] = "I";
//    letra[9] = "J";
//    letra[10] = "K";
//    letra[11] = "L";
//    letra[12] = "M";
//    letra[13] = "N";
//    letra[14] = "O";
//    letra[15] = "P";
//    letra[16] = "Q";
//    letra[17] = "R";
//    letra[18] = "S";
//    letra[19] = "T";
//    letra[20] = "U";
//    letra[21] = "V";
//    letra[22] = "W";
//    letra[23] = "X";
//    letra[24] = "Y";
//    letra[25] = "Z";
}
function clean_number(number) {
    if (number == 0 || number == "0") {
        number = "0";
    }
    number = number.replace(/\(/gi, '');
    number = number.replace(/\)/gi, '');
    number = number.replace(/\#/gi, '');
    number = number.replace(/\|/gi, '');
    number = number.replace(/\!/gi, '');
    number = number.replace(/\?/gi, '');
    number = number.replace(/\//gi, '');
    number = number.replace(/$/gi, '');
    number = number.replace(/,/gi, '');
    number = number.replace("$", "");
    number = number.replace(",", "");
//    number = number.replace(/\./gi, '');
    if (number == "" || number == "." || number == ",") {
        number = "NA";
//        number = "0";
    }
    return number;
}
function compara_valores(campo_div, campo_max, campo_min, igual, colorcampo_max, colorcampo_min, colorigual, colornormal) {
    var val = parseFloat(clean_number(campo_div.text()));
    campo_max = parseFloat(clean_number(campo_max));
    campo_min = parseFloat(clean_number(campo_min));
    igual = parseFloat(clean_number(igual));
    campo_div.css({"color": colornormal});
    if (val > campo_max) {
        campo_div.css({"color": colorcampo_max});
    }
    if (val < campo_min) {
        campo_div.css({"color": colorcampo_min});
    }
    if (val == igual) {
        campo_div.css({"color": colorigual});
    }
    if (val < campo_max && val > campo_min && val != igual) {
        campo_div.css({"color": colornormal});
    }
}
function cleanDocumentHtml() {
    $(".th_enc").remove();
    $(".th_rows").remove();
    $(".contain_divisor_page").remove();
    $(".fixed_column_td").remove();
    return $("#body_contain").html();
}