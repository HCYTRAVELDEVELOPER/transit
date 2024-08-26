/*
 v18 27 Enero 2022 alexf
 */
var __url_nwmaker_account = "nwmaker";
var __configPage = {};
var __infoUser = {};
var __myUbication = {};
var __markersGoogleMaps = new Array();
var __polyGoogleMaps = new Array();
var __classClicks = new Array();
var infoWindowMakerMap = null;
var __totalCountTitle = 0;
var windowFocused = true;
var __scrollBodyNw = 0;
var __mainTraduc = "";
var __loadPrepareNwLogin = false;
var __mainTraducAlter = false;
var createDialogTimeConcurrencia = false;
var __userWebpPhpThumb = false;
if (typeof localStorage["mainLanguageNwMaker"] == "undefined") {
    localStorage["mainLanguageNwMaker"] = "";
}
if (typeof localStorage["geoPositionStatus"] == "undefined") {
    localStorage["geoPositionStatus"] = "";
}
if (typeof localStorage["geoPositionCode"] == "undefined") {
    localStorage["geoPositionCode"] = "";
}

if (document.readyState !== 'loading') {
    myInitCode();
} else {
    document.addEventListener('DOMContentLoaded', function () {
        myInitCode();
    });
}

function myInitCode() {
    $(".loadingNwMakerHome").remove();
    if (document.querySelector(".contend_tw")) {
        validaJquery(function () {
            initNwProject();
            loadAllImagesLazy('lzy_img');
        });
    }
}

function loadAllImagesLazy(classImages) {
    var imageObserver = new IntersectionObserver((entries, imgObserver) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                var lazyImage = entry.target;
                var data_bg = lazyImage.getAttribute("data-bg");
                var data_src = lazyImage.getAttribute("data-src");
                if (data_bg === "true") {
                    lazyImage.style.backgroundImage = "url(" + data_src + ")";
                } else {
                    lazyImage.src = lazyImage.dataset.src;
                }
                lazyImage.classList.remove(classImages);
                imgObserver.unobserve(lazyImage);
            }
        });
    });
    var arr = document.querySelectorAll("." + classImages);
    arr.forEach((v) => {
        imageObserver.observe(v);
    });
}

function validaJquery(callback) {
    if (typeof jQuery !== "undefined") {
        callback();
    } else {
        setTimeout(function () {
            validaJquery(callback);
        }, 1000);
    }
}

windowBlurFocus();

function testingConnectionRed() {
    var h = ' <h1>Network Information API</h1>\n\
      <span id="ni-unsupported" class="api-support hidden">API not supported</span>\n\
      <span id="nio-supported" class="api-support hidden">Old API version supported</span>\n\
      <ul>\n\
         <li class="new-api hidden">\n\
            The connection type is <span id="t-value" class="value">undefined</span>.\n\
         </li>\n\
         <li class="old-api hidden">\n\
            The connection bandwidth is <span id="b-value" class="value">undefined</span>.\n\
         </li>\n\
         <li class="old-api hidden">\n\
            The connection is <span id="m-value" class="value">undefined</span>.\n\
         </li>\n\
      </ul>\n\
      <small class="author">\n\
         Demo created by <a href="http://www.audero.it">Aurelio De Rosa</a>\n\
         (<a href="https://twitter.com/AurelioDeRosa">@AurelioDeRosa</a>).<br />\n\
         This demo is part of the <a href="https://github.com/AurelioDeRosa/HTML5-API-demos">HTML5 API demos repository</a>.\n\
      </small>';
    $("body").html(h);
    setTimeout(function () {
        var connection = window.navigator.connection ||
                window.navigator.mozConnection ||
                null;
        console.log(connection);
        if (connection === null) {
            document.getElementById('ni-unsupported').classList.remove('hidden');
        } else if ('metered' in connection) {
            document.getElementById('nio-supported').classList.remove('hidden');
            [].slice.call(document.getElementsByClassName('old-api')).forEach(function (element) {
                element.classList.remove('hidden');
            });

            var bandwidthValue = document.getElementById('b-value');
            var meteredValue = document.getElementById('m-value');

            connection.addEventListener('change', function (event) {
                bandwidthValue.innerHTML = connection.bandwidth;
                meteredValue.innerHTML = (connection.metered ? '' : 'not ') + 'metered';
            });
            connection.dispatchEvent(new Event('change'));
        } else {
            var typeValue = document.getElementById('t-value');
            [].slice.call(document.getElementsByClassName('new-api')).forEach(function (element) {
                element.classList.remove('hidden');
            });

            connection.addEventListener('typechange', function (event) {
                typeValue.innerHTML = connection.type;
            });
            connection.dispatchEvent(new Event('typechange'));
        }
    }, 3000);
}

function addToolTip() {

}

function loadCodeOcultOne() {
    var divOne = document.querySelector(".codeOcultNwOne");
    if (divOne) {
        var codeOne = divOne.innerHTML;
        codeOne = codeOne.replace(/<pre>/gi, '');
        codeOne = codeOne.replace(/<xmp>/gi, '');
        codeOne = codeOne.replace(/<\/pre>/gi, '');
        codeOne = codeOne.replace(/<\/xmp>/gi, '');
        $("body").append(codeOne);
    } else {
        setTimeout(function () {
            loadCodeOcultOne();
        }, 1000);
    }
}
function loadCodeOcultTwo() {
    var divTwo = document.querySelector(".codeOcultNwTwo");
    if (divTwo) {
        var codeTwo = divTwo.innerHTML;
        codeTwo = codeTwo.replace(/<pre>/gi, '');
        codeTwo = codeTwo.replace(/<xmp>/gi, '');
        codeTwo = codeTwo.replace(/<\/pre>/gi, '');
        codeTwo = codeTwo.replace(/<\/xmp>/gi, '');
        $("body").append(codeTwo);
    } else {
        setTimeout(function () {
            loadCodeOcultTwo();
        }, 1000);
    }
}

function initNwProject() {
    loadCodeOcultOne();
    loadCodeOcultTwo();

    if (typeof headerPosNwp !== "undefined") {
        headerPos(headerPosNwp);
    }
    setConfigPage();
    menuCss();
    var d = document.querySelectorAll(".addtooltip");
    if (d.length > 0) {
        for (var i = 0; i < d.length; i++) {
            var da = d[i];
            var dat = da.getAttribute("data");
            var moe = document.createElement("div");
            moe.innerHTML = dat;
            moe.className = "showToolTip";
            da.appendChild(moe);
        }
    }
    /*
     (function () {
     $('body').delegate('a', 'click', function () {
     var data = $(this).attr("data");
     var loading = $(this).attr("loading");
     var link = $(this).attr("href");
     if (link == "#") {
     return false;
     }
     if (activeAnimateScroll(data) != false) {
     if (loading != "NO") {
     loadingNw();
     }
     }
     });
     })();
     */
    (function () {
        $('body').delegate('.containerLanguajesAct', 'click', function () {
            document.querySelector('.containerChangeLanguajes').style.display = 'block';
        });
    })();
    (function () {
        $('body').delegate('.containerLanguajesAct', 'mouseleave', function () {
            document.querySelector('.containerChangeLanguajes').style.display = 'none';
        });
    })();
    (function () {
        $('body').delegate('.popupimg_automatic', 'click', function () {
            var data = $(this).attr("data-link");
            if (evalueData(data) && data !== "false") {
                window.open(data, "_SELF");
            }
        });
    })();
    /*
     subirScroll();
     */
    $(".open_popup").click(function () {
        var r = $(this).attr("title");
        showPopUp(r, "");
    });
    (function () {
        $('body').delegate('.div_integrado_popup_data', 'click', function () {
            var r = $(this).attr("data");
            var t = $(this).attr("data-title");
            showPopUp(r, t);
        });
    })();
    $("#nw_button_chat").click(function () {
        $('#myform').submit();
    });
    $('#myform').submit(function () {
        window.open('', 'formpopup', 'width=600,height=550,resizeable,scrollbars');
        this.target = 'formpopup';
    });
    window.onload = function () {
        removeLoadingNw();
    };
    (function () {
        $('body').delegate('.cerrar_sesion', 'click', function () {
            /*cerrarSesion();*/
            closeSession();
        });
    })();
    compruebaUrlScroll();
    if ($(".imgZoom").length > 0) {
        $(".imgZoom").mouseenter(function () {
            loadImgZoom(this);
        });
    }
    /*
     if ($(".dataEnc").attr("data-menumovilpc") == "SI") {
     activeMenuMovil();
     }
     */
    activeMenuMovil();
    var device = navigator.userAgent;
    /*
     if (device.match(/Iphone/i) || device.match(/Ipod/i) || device.match(/Android/i) || device.match(/J2ME/i) || device.match(/BlackBerry/i) || device.match(/iPhone|iPad|iPod/i) || device.match(/Opera Mini/i) || device.match(/IEMobile/i) || device.match(/Mobile/i) || device.match(/Windows Phone/i) || device.match(/windows mobile/i) || device.match(/windows ce/i) || device.match(/webOS/i) || device.match(/palm/i) || device.match(/bada/i) || device.match(/series60/i) || device.match(/nokia/i) || device.match(/symbian/i) || device.match(/HTC/i))
     {
     activeMenuMovil();
     compruebaAppHibrida();
     }
     */
    var animsDivs = 0;
    if ($(".animateBounceIn").length > 0 || $(".flipInX_animate").length > 0 || $(".fadeIn_animate").length > 0 || $(".fadeInUp_animate").length > 0) {
        animsDivs = 1;
    }
    if (animsDivs > 0) {
        loadCss("/nwproject/structure/css/animate.css");
        cargaJs("/nwproject/utilities/jquery/waypoints.min.js", function () {
            animateElement(".animateBounceIn", "bounceIn");
            animateElement(".flipInX_animate", "flipInX");
            animateElement(".fadeIn_animate", "fadeIn");
            animateElement(".fadeInUp_animate", "fadeInUp");
        }, false, true);
    }
}

function animateElement(classOrID, animate, funcUp, funcDown) {
    var bob = document.querySelectorAll(classOrID);
    if (bob.length > 0) {
        for (var i = 0; i < bob.length; i++) {
            var waypoint = new Waypoint({
                element: bob[i],
                handler: function (direction) {
                    if (evalueData(animate)) {
                        $(this.element).toggleClass(animate + ' animated');
                    }
                    if (evalueData(funcUp) && direction === "up") {
                        funcUp();
                    }
                    if (evalueData(funcUp) && direction === "down") {
                        funcDown();
                    }
                },
                offset: '70%',
                triggerOnce: false
            });
        }
    }
}

function getConfigApp() {
    if (typeof __configApp === "undefined") {
        return false;
    }
    return __configApp;
}

function addHash(hash) {
    /*
     var stateObj = {foo: "/inicio"};
     if (location.href.indexOf(hash) === -1) {
     */
    var stateObj = location.href;
    history.pushState(stateObj, hash, hash);
    /*
     }
     */
}

function closeSession() {
    var self = this;
    var config = getConfigApp();
    var css = "position: fixed;top: 0;left: 0;height: 100%;z-index: 10000000000000000000;background: #fff;color: #000;";
    newLoadingTwo("body", "Cerrando sesión, por favor espere...", css, "append");
    var rpc = {};
    rpc["service"] = "nwMaker";
    rpc["method"] = "closeSessionInApp";
    rpc["data"] = {};
    var func = function (r) {
        /*
         removeLoadingNw();
         newRemoveLoading("body");
         */
        if (!verifyErrorNwMaker(r)) {
            removeLoading("body");
            console.log(r);
            return;
        }
        /*
         try {
         FB.logout(function (response) {
         console.log(response);
         });
         } catch (e) {
         console.log(e);
         }
         var time = setInterval(function () {
         */
        localStorage["initSession"] = "undefined";
        localStorage["outputMenuLeft"] = "undefined";
        localStorage["outputMenuCenter"] = "undefined";
        $.each(localStorage, function (key, value) {
            localStorage.removeItem(key);
        });
        if (typeof updateUserCon !== "undefined") {
            clearInterval(updateUserCon);
        }
        setTimeout(function () {
            var url = location.pathname + "?action=out";
            if (typeof config.url_al_salir !== "undefined") {
                if (evalueData(config.url_al_salir) === true) {
                    url = config.url_al_salir;
                }
            }
            window.location = url;
        }, 400);
    };
    rpcNw("rpcNw", rpc, func, true);
}

function wsClientesNwRDA(ra) {
    console.log("wsClientesNwRDA::ra", ra);
    var data = {};
    var s = ra.array;
    var self = ra.self;
    var allData = "";
    $.each(s, function (key, value) {
        var sa = value.name;
        if (sa === "nombre") {
            data.nombre = value.respuesta;
        }
        if (sa === "telefono") {
            data.telefono = value.respuesta;
        }
        if (sa === "correo") {
            data.correo = value.respuesta;
        }
        if (sa === "observaciones") {
            data.observaciones = value.respuesta + " URL: " + location.href;
        }
        if (sa === "pais") {
            data.pais = value.respuesta;
        }
        if (sa === "nombre_empresa") {
            data.nombre_empresa = value.respuesta;
        }
        allData += sa + ": " + value.respuesta + " --- ";
    });
    data.allData = allData;
    data.tipo = "pagina_web";
    data.dominio = location.host;
    data.url = location.href;
    data.pathname = location.pathname;
    data.hash = location.hash;
    data.search = location.search;

    if (!evalueData(data.nombre) && !evalueData(data.telefono) && !evalueData(data.observaciones) && evalueData(data.correo)) {
        data.nombre = data.correo;
        data.telefono = data.correo;
        data.observaciones = data.correo;
    }
    if (!evalueData(data.nombre) || !evalueData(data.telefono) || !evalueData(data.correo)) {
        nw_dialog("No cumple para el WS clientes nw, debe tener nombre, telefono, correo y observaciones (opcional), sin embargo si se envió el correo y se guardó.");
        return false;
    }
    if (!evalueData(data.observaciones)) {
        data.observaciones = "Sin observaciones";
    }
    console.log("wsClientesNwRDA::data", data);
    var rpc = {};
    rpc["service"] = "nwMaker";
    rpc["method"] = "wsClientesNwRDA";
    rpc["data"] = data;
    /*
     loading("Cargando", "rgba(255, 255, 255, 0.76)!important", self);
     */
    var func = function (r) {
        console.log("wsClientesNwRDA::response", r);
        removeLoading(self);
        removeLoading();
        if (!verifyErrorNwMaker(r)) {
            console.log("wsClientesNwRDA::ERROR", r);
            return false;
        }
        ra.end();
    };
    rpcNw("rpcNw", rpc, func, true);
}

function wsClientesNw(ra) {
    console.log("wsClientesNw::ra", ra);
    var data = {};
    var s = ra.array;
    var self = ra.self;
    var allData = "";
    $.each(s, function (key, value) {
        var sa = value.name;
        if (sa === "nombre") {
            data.nombre = value.respuesta;
        }
        if (sa === "telefono") {
            data.telefono = value.respuesta;
        }
        if (sa === "correo") {
            data.correo = value.respuesta;
        }
        if (sa === "observaciones") {
            data.observaciones = value.respuesta + " URL: " + location.href;
        }
        if (sa === "pais") {
            data.pais = value.respuesta;
        }
        if (sa === "nombre_empresa") {
            data.nombre_empresa = value.respuesta;
        }
        allData += sa + ": " + value.respuesta + " --- ";
    });
    data.allData = allData;
    data.tipo = "pagina_web";
    data.dominio = location.host;
    data.url = location.href;
    data.pathname = location.pathname;
    data.hash = location.hash;
    data.search = location.search;
    if (!evalueData(data.nombre) && !evalueData(data.telefono) && !evalueData(data.observaciones) && evalueData(data.correo)) {
        data.nombre = data.correo;
        data.telefono = data.correo;
        data.observaciones = data.correo;
    }
    if (!evalueData(data.nombre) || !evalueData(data.telefono) || !evalueData(data.correo)) {
        nw_dialog("No cumple para el WS clientes nw, debe tener nombre, telefono, correo y observaciones (opcional), sin embargo si se envió el correo y se guardó.");
        return false;
    }
    if (!evalueData(data.observaciones)) {
        data.observaciones = "Sin observaciones";
    }
    console.log("wsClientesNw::data", data);
    var rpc = {};
    rpc["service"] = "nwMaker";
    rpc["method"] = "wsClientesNw";
    rpc["data"] = data;
    /*
     loading("Cargando", "rgba(255, 255, 255, 0.76)!important", self);
     */
    var func = function (r) {
        console.log("wsClientesNw::response", r);
        removeLoading(self);
        removeLoading();
        if (!verifyErrorNwMaker(r)) {
            console.log("wsClientesNw::ERROR", r);
            return false;
        }
        ra.end();
    };
    rpcNw("rpcNw", rpc, func, true);
}

function verifySession(callBack, configGral) {
    var rpc = {};
    rpc["service"] = "nwMaker";
    rpc["method"] = "verifySession";
    rpc["data"] = configGral;
    var func = function (r) {
        /*
         console.log("verifySession", r);
         */
        if (evalueData(r)) {
            if (evalueData(r.error)) {
                if (typeof r.error.message !== "undefined") {
                    if (r.error.message.indexOf("Error en su usuario o clave") !== -1) {
                        loginNw();
                        return false;
                    }
                }
            }
        }
        if (typeof r.concurrente !== "undefined") {
            if (r.concurrente === true) {
                openConcurrente(r);
                return false;
            }
        }
        if (!verifyErrorNwMaker(r)) {
            return;
        }
        if (r.usuario != "undefined") {
            setUserInfo(r);
        } else {
            nw_dialog(r);
        }
        if (typeof callBack != "undefined") {
            callBack(r);
        }
    };
    rpcNw("rpcNw", rpc, func, true);
}

function openConcurrente(r) {
    var da = "00:01:30";
    var d = "00:01:30";
    var text = str("Ya existe otra sesión iniciada con esta cuenta. Vuelve a intentar en");
    if (evalueData(r.fecha_ultima_conexion)) {
        if (typeof r.fecha_ultima_conexion.split(" ")[1] !== "undefined") {
            var separadorHoras = ":";
            var f = new Date();

            var hourInit = f.getHours() + separadorHoras + f.getMinutes() + separadorHoras + f.getSeconds();
            var hourEnd = r.fecha_ultima_conexion.split(" ")[1];
            d = diferenciaHoras(hourInit, hourEnd);
            d = diferenciaHoras(da, d);
        }
    }
    var html = text + " <span class='createDialogTimeConcurrencia'>" + d + "</span>";
    nw_dialog(html);
    activeTimerConcurrenDialog(d);
    createDialogTimeConcurrencia = setInterval(activeTimerConcurrenDialog, 1000);
    loginNw();
}

function activeTimerConcurrenDialog(tim) {
    var di = document.querySelector(".createDialogTimeConcurrencia");
    if (!di) {
        clearInterval(createDialogTimeConcurrencia);
        return;
    }
    var time = di.innerHTML;
    if (typeof tim !== "undefined") {
        time = tim;
    }
    time = time.replace(/:/gi, "");
    time = parseFloat(time) - 1;
    time = time.toString();
    var seg = time.substr(-2);
    var min = time.replace(seg, "");
    if (parseInt(seg) >= 60) {
        seg = 59;
    }
    var timeend = min + ":" + seg;
    di.innerHTML = timeend;
    if (timeend === ":0") {
        clearInterval(createDialogTimeConcurrencia);
        return;
    }
}

function getUbicGeoUser() {
    var gps = __myUbication;
    var p = validaPermisoGPS();
    if (!p) {
        var gps = {};
        gps["lat"] = 4.598056;
        gps["lng"] = -74.07583299999999;
    }
    return gps;
}

function setUbicGeoUser(data) {
    __myUbication = data;
}
function validaPermisoGPS() {
    var g = __myUbication;
    if (g == "PERMISSION_DENIED" || g == "POSITION_UNAVAILABLE" || g == "TIMEOUT") {
        return false;
    }
    if (typeof g["lat"] == "undefined") {
        return false;
    }
    if (typeof g["lng"] == "undefined") {
        return false;
    }
    return true;
}

function setUserInfo(df) {
    localStorage["initSession"] = "true";
    __infoUser = df;
}
function getUserInfo() {
    return __infoUser;
}
function getUserData() {
    return getUserInfo();
}

function setConfigPage() {
    if ($("#contenedor").length > 0) {
        __configPage["pagina"] = $("#contenedor").attr("data-p");
        __configPage["language"] = $("#contenedor").attr("data-language");
        __configPage["url_sites"] = $("#contenedor").attr("data-site");
    }
}
function getConfigPage() {
    return __configPage;
}

function compruebaAppHibrida() {
    var get = getGET();
    if (get.app != undefined) {
        if (get.app == "true") {
            $(".menMovilButtonFix").remove();
        }
    }
}

function activeMenuMovil() {
    if ($(".dataEnc").attr("data-menumovilpos") == "left") {
        $(".menMovilButtonFix").addClass("menMovilButtonFixLeft");
        $(".logoMovil").addClass("logoMovilLeft");
    }
    (function () {
        $('body').delegate('.buscarMovilShow', 'click', function () {
            showBuscadorMovil();
        });
    })();
    (function () {
        $('body').delegate('.containBuscarMovilHidden', 'click', function () {
            hiddenBuscadorMovil();
        });
    })();
    (function () {
        $('body').delegate('.showmenmovil', 'click', function () {
            showMenuMovil();
        });
    })();
    (function () {
        $('body').delegate('.hidemenmovil', 'click', function () {
            hideMenuMovil();
        });
    })();
    /*
     loadCss("/nwproject/structure/css/menu_movil.css");
     $(".containBuscarMovilInt").load("/modules/nw_buscador/index.php");
     */
}

function scrollObjectAnime(scroll) {
    return true;
    var total = 100 - 60;
    var height_window = ($("body").height() * total) / 100;
    var scroll_critical = parseInt($("#1000170").offset().top);
    var window_y = scroll;
    if (window_y + height_window > scroll_critical) {
    }
}
function showBuscadorMovil() {
    $(".containBuscarMovil").addClass("containBuscarMovilHidden");
    $(".containBuscarMovil").removeClass("buscarMovilShow");
    $(".containBuscarMovilInt").fadeIn();
}
function hiddenBuscadorMovil() {
    $(".containBuscarMovil").addClass("buscarMovilShow");
    $(".containBuscarMovil").removeClass("containBuscarMovilHidden");
    $(".containBuscarMovilInt").fadeOut();
}
function showMenuMovil() {
    $("#menu").css({"z-index": "100000"});
    $(".menu_inside").addClass("menu_inside_movshow");
    $("#menu").append("<div class='menu_bg'></div>");
    $(".movilEquis1").addClass("menuEquis1");
    $(".movilEquis2").addClass("menuEquis2");
    $(".movilEquis3").css({"display": "none"});
    $(".menMovilButtonFix").addClass("hidemenmovil");
    $(".menMovilButtonFix").removeClass("showmenmovil");
    $("body").css({"overflow": "hidden"});
    $(".encMovilBox").removeClass("encMovilBoxIn");
}
function hideMenuMovil() {
    $("#menu").css({"z-index": "1"});
    $(".menu_inside").removeClass("menu_inside_movshow");
    $(".menMovilButtonFix").addClass("showmenmovil");
    $(".menMovilButtonFix").removeClass("hidemenmovil");
    $(".movilEquis1").removeClass("menuEquis1");
    $(".movilEquis2").removeClass("menuEquis2");
    $(".movilEquis3").css({"display": "block"});
    $(".menu_bg").remove();
    $("body").css({"overflow": "auto"});
}
function cortaTextVerMas() {
    $(".vermascortatext").remove();
    var text = $(".divtextvermas").text();
    $(".containTextCorto").text(text);
    $(".divtextvermas").remove();
}
function cortaText(text, numMax) {
    return text.slice(0, numMax);
}
function subirScroll() {
    var html = "<div class='btnSubirScroll'></div>";
    $("body").append(html);
    $(".btnSubirScroll").click(function () {
        scrollPage("contenedor", 500);
    });
    $(window).scroll(function () {
        var scroll = $(window).scrollTop();
        resolveMenuMovil(scroll);
        if (scroll >= 180) {
            $(".btnSubirScroll").fadeIn();
        } else {
            $(".btnSubirScroll").fadeOut();

        }
        clearTimeout($.data(this, "TestScroll"));
        $.data(this, "TestScroll", setTimeout(function () {
        }, 3000));
    });
}
function resolveMenuMovil(scroll) {
    if (scroll >= 120) {
        $(".encMovilBox").addClass("encMovilBoxIn");
    } else {
        $(".encMovilBox").removeClass("encMovilBoxIn");
    }
}

function compruebaUrlScroll() {
    var path = window.location.pathname;
    var hash = window.location.hash;
    var data = path + hash;
    if (hash != "") {
        if (hash.split("callback").length < 2) {
            activeAnimateScroll(data, "", "SI");
        }
    }
}

function activeAnimateScroll(data, movil, otherpage) {
    var device = navigator.userAgent;
    if (device.match(/Iphone/i) || device.match(/Ipod/i) || device.match(/Android/i) || device.match(/J2ME/i) || device.match(/BlackBerry/i) || device.match(/iPhone|iPad|iPod/i) || device.match(/Opera Mini/i) || device.match(/IEMobile/i) || device.match(/Mobile/i) || device.match(/Windows Phone/i) || device.match(/windows mobile/i) || device.match(/windows ce/i) || device.match(/webOS/i) || device.match(/palm/i) || device.match(/bada/i) || device.match(/series60/i) || device.match(/nokia/i) || device.match(/symbian/i) || device.match(/HTC/i))
    {
        hideMenuMovil();
    }
    var vel = 2000;
    var top = 0;
    var page = $("#contenedor").attr("data-site");
    if (typeof data == 'undefined') {
        data = "";
    }
    var r = data.split("#");
    var p_link = r[0].replace(/\//gi, "");
    var min = 0;
    if (movil == "SI") {
        min = 1;
    }
    if (r.length > min) {
        if (p_link == page || page == "") {
            if (r[1] == undefined)
                return false;
            var param = r[1].split(",");
            if (param[1] != undefined) {
                vel = param[1];
            }
            if (param[2] != undefined) {
                top = param[2];
            }
            data = param[0];

            var device = navigator.userAgent;
            if (device.match(/Iphone/i) || device.match(/Ipod/i) || device.match(/Android/i) || device.match(/J2ME/i) || device.match(/BlackBerry/i) || device.match(/iPhone|iPad|iPod/i) || device.match(/Opera Mini/i) || device.match(/IEMobile/i) || device.match(/Mobile/i) || device.match(/Windows Phone/i) || device.match(/windows mobile/i) || device.match(/windows ce/i) || device.match(/webOS/i) || device.match(/palm/i) || device.match(/bada/i) || device.match(/series60/i) || device.match(/nokia/i) || device.match(/symbian/i) || device.match(/HTC/i))
            {
                top = 40;
            }
            if (otherpage == "SI") {
                setTimeout(function () {
                    scrollPage(data, vel, top);
                }, 1000);
            } else {
                scrollPage(data, vel, top);
            }
            return false;
        } else {
            if (movil == "SI") {
                location.href = data;
            }
        }
    } else {
        if (movil == "SI") {
            location.href = data;
        }
    }
    return true;
}

function showPopUp(r, t, msg, link, id, page) {
    if (evalueData(id) && evalueData(page)) {
        if (evalueData(localStorage["popup_page_" + id + "_id" + id])) {
            return false;
        }
        /*
         localStorage["popup_page_" + id + "_id" + id] = id + "_" + page;
         */
    }
    $(".nwDiextern_openPopupNwp").remove();
    reject(".divMainPopUpAutoMaker");
    var title = "Nueva Ventana";
    if (t != undefined) {
        title = "<div class='titlePopUpAll'>" + t + "</div>";
    }
    if (t == undefined || t == "") {
        title = "";
    }
    var img = r.split(".");
    var isimage = false;
    if (img[1] === "jpg" || img[1] === "jpeg" || img[1] === "JPEG" || img[1] === "png" || img[1] === "JPG" || img[1] === "PNG" || img[1] === "gif" || img[0] === "/nwlib6/includes/phpthumb/phpThumb") {
        isimage = true;
    } else
    if (msg !== undefined && msg !== "" && msg !== false) {
        isimage = true;
    }
    if (isimage === true) {
        var m = getFileByType(r, false, 1000);
        /*
         var imgshow = "<img class='img_opzero' src='" + m + "' />";
         */
        var imgshow = "";
        imgshow += "<div class='imgbacgpoauto' data-image='" + m + "' style='background-image: url(" + m + ");'></div>";
        var barraencmob = "";
        barraencmob = "<div class='barraencpopupauto'><div class='btnbrencpa btnbrencpa_close'></div></div>";

        openPopupNew("<div class='popupimg_automatic' data-link='" + link + "'>" + barraencmob + imgshow + "</div>");
        return true;
    }
    var data = {};
    data["modulo"] = r;
    data["connect"] = "SI";
    $.ajax({
        type: "POST",
        url: "/modules/popUpAutomatico/index.php",
        data: data,
        error: function () {
            console.log("La operación no pudo ser procesada en " + r + ". Inténtelo de nuevo.");
            removePopUp();
            return false;
        },
        success: function (data) {
            openPopupNew(data);
            return true;
        }
    });

}

function openPopupNew(html) {
    var classname = "divMainPopUpAutoMaker" + Math.floor((Math.random() * 10000) + 1);
    var params = {};
    params.self = classname;
    params.html = html;
    params.textAccept = 'Cerrar';
    params.buttonMin = false;
    params.buttonMax = false;
    params.title = 'Título';
    if (!isMobile()) {
        params.width = '300px';
        params.height = '300px';
    }
    params.showEnc = false;
    var self = createDialogNw(params);

    newLoadingTwo(self, "Cargando...", "");

    $(self + " .nwformFoot").css({"display": "none"});
    $(self + " .dialogNwNewInter").css({"margin": "0", "padding": "0"});
    var m = $(self + " .imgbacgpoauto").attr("data-image");
    var img = new Image();
    img.src = m;
    img.onload = function () {
        newRemoveLoading(self);
        if (!isMobile()) {
            $(self).css({"width": this.width, "height": "100%"});
        }
    };
    $(".nwDiextern_" + self.replace(".", "")).addClass("nwDiextern_openPopupNwp");
    $(self).css({"background-color": "transparent", "border": "0px", "box-shadow": "none"});
    $(".dialogBg_" + classname).css({"background-color": "rgba(0, 0, 0, 0.84)"});

    $(".dialogEnc_" + classname + " .btnbrencpa_close").click(function () {
        reject("." + classname);
    });
    if (isMobile()) {
        $(self).css({"background-color": "#000000"});
    }
}

function addContendPopUp(data, title) {
    var html = "";
    html += "<div class='bg_popup_fond'></div>";
    html += "<div class='div_integrado_popup animate_center_popup'>";
    html += " <div class='animate_center_popup_inter'>";

    html += "  <div class='close_div_integrado_popup'>x</div>";

    html += "  <div class='containtitle_popup'>" + title + "</div>";

    html += data;
    html += " </div>";
    html += "</div>";

    removePopUp();

    $("body").append(html).addClass("body_static");

    $(".close_div_integrado_popup").click(function () {
        removePopUp();
    });
    $(".bg_popup_fond").click(function () {
        removePopUp();
    });
    removeLoadingNw();
}
function removePopUp() {
    $(".div_integrado_popup").remove();
    $(".bg_popup_fond").remove();
    $("body").removeClass("body_static");
    reject(".divMainPopUpAutoMaker");
}

function newLoadingThree(self, textShow, css, mode) {
    if (css.indexOf("background:") === -1)
        css += "background: #fff;";
    newLoading(self, textShow, css, mode, "three");
}
function newLoadingTwo(self, textShow, css, mode) {
    if (css.indexOf("background:") === -1)
        css += "background: #fff;";
    newLoading(self, textShow, css, mode, "two");
}
function newLoading(self, textShow, css, mode, skind) {
    var idDiv = "newLoadingNw_" + Math.floor((Math.random() * 10000) + 1);
    $(self).attr("nw-lon", idDiv);
    var style = "";
    if (evalueData(css) === true) {
        style = "style='" + css + "'";
    }
    var otherd = "";
    if (typeof mode === "undefined") {
        mode = "allWindow";
    }
    if (!evalueData(mode)) {
        mode = "allWindow";
    }
    if (mode == "allWindow") {
        otherd = "loadingAllWindow";
    }
    var html = "";
    html += " <div id='" + idDiv + "' class='" + idDiv + " newLoadingNw " + otherd + "' " + style + "  >";
    if (skind === "three") {
        html += "<div class='cEftVf'></div>";
    } else
    if (skind === "two") {
        html += "<div class='cEftVf'></div>";
    } else {
        html += "<div class='cEftVf'></div>";
    }
    if (evalueData(textShow)) {
        html += "<div class='textShowLoad'>" + textShow + "</div>";
    }
    html += "</div>";
    if (mode == "append" || mode == "allWindow") {
        $(self).append(html);
    } else {
        $(self).after(html);
    }
}

function newRemoveLoading(self) {
    var div = $(self).attr("nw-lon");
    var is = "." + div;
    if (evalueData(div)) {
        if (typeof self == "object") {
            var o = $(is);
            $(self).find(o).remove();
            o.remove();
        } else {
            $(self + " " + is).remove();
        }
        if (document.querySelector(is) === null) {
            if (typeof self == "object") {
                $(self).find(".newLoadingNw").remove();
            } else {
                $(self + " .newLoadingNw").remove();
            }
        }
    }
}


function loading_nw(img) {
    loadingNw(img);
}

function loading(msg, fondoColor, divCarga, after) {

    if (evalueData(divCarga)) {
        if ($(divCarga + " .loadingNwInto").length == 0) {
            if ($(".dialogEnc_" + divCarga.replace(".", "")).length > 0) {
                divCarga = ".dialogEnc_" + divCarga.replace(".", "");
            }
        }
    }
    loadingNw(false, true, true, fondoColor, false, msg, divCarga, after);
}

function loadingNw(img, dontRemoveAuto, modal, bgColor, icon, textLoading, divCarga, after) {
    if (!evalueData(divCarga)) {
        $(".loadingNw").remove();
    }
    var textShow = "";
    if (textLoading != undefined) {
        textShow = "<div class='textLoadingNw'>" + str(textLoading) + "</div>";
    }
    var css = "";
    if (modal) {
        var color = "rgba(0, 0, 0, 0.54)";
        if (bgColor != undefined) {
            color = bgColor;
        }
        css += " background-color: " + color + "; ";
    }
    var idDiv = "loadingNw";
    if (evalueData(divCarga)) {
        idDiv = "loadingNwInto";
    }
    var html = " <div id='" + idDiv + "' class='" + idDiv + "' style='" + css + "' >";

    html += "<div class='cEftVf'></div>";
    /*
     html += "<div class='h1_carga'>";
     html += "<div class='loader2' id='loader' ></div>";
     html += textShow;
     html += "</div>";
     */
    html += "</div>";


    var fries = document.createElement("div");
    fries.innerHTML = html;
    if (evalueData(divCarga)) {
        if (after === true) {
            $(divCarga).after(fries);
        } else {
            $(divCarga).append(fries);
        }
    } else {
        document.body.appendChild(fries);
    }

    if (dontRemoveAuto != true) {
        setTimeout(function () {
            removeLoadingNw();
        }, 5000);
    }
}
function remove_loading_nw(timeOut) {
    removeLoadingNw(timeOut);
}
function removeLoading(divCarga) {
    removeLoadingNw(false, divCarga);
}
function removeLoadingNw(timeOut, divCarga) {
    var div = $(".loadingNw");
    if (evalueData(divCarga)) {
        div = $(".loadingNwInto");
    }
    var time = 400;
    if (timeOut == undefined) {
        timeOut = 1000;
    }
    if (timeOut == "fast") {
        timeOut = 10;
        time = 10;
    }
    var timeEnd = parseInt(time);
    setTimeout(function () {
        div.remove();
    }, timeEnd);
    div.addClass("hiddenLoading");
}
function updateContent() {
    window.location.reload();
}
function prepareDialogs() {
    $(".ajax-loader-div").ajaxStart(function () {
        $(this).show();
        $(".ajax-loader-div").show();
        $(".ajax-loader").show();
    }).ajaxStop(function () {
        $(this).hide();
        $(".ajax-loader-div").hide();
        $(".ajax-loader").hide();
    });
}
function OcultarDiv(nombre) {
    $("#" + nombre).hide("slow");
}
function MostrarDiv(nombre) {
    $("#" + nombre).show(1500);
}
function checkKey(evt) {
    if (evt.ctrlKey)
        alert("Por razones de seguridad este boton ha sido deshabilitado");
}
function headerPos(tipo) {
    var h_head = $(".header").height();
    var h_men = $("#menu").height();
    var maxwidth = "750px";
    var pos = "absolute";
    var h_men_final = (h_head / 2) - (h_men / 2);
    if (tipo == "logo_left_menu_right_fixed") {
        pos = "fixed";
        $("#menu").css({"z-index": "10000"});
        $(".header").css({"position": pos, "z-index": "10000", "top": "0px"});
        maxwidth = "850px";
    }
    $("#menu").css({"top": h_men_final, "position": pos});
    $(".menu_au_center").css({"float": "right", "max-width": maxwidth});
}
function returnoncontextmenu() {
    document.oncontextmenu = function () {
        return false;
    };
}
function nolocationFrame() {
    if (top.location != location) {
        top.location = self.location;
    }
}
function userNoSession() {
    window.location = "/";
}
function noSelection() {
    function disableselect(e) {
        return false;
    }
    function reEnable() {
        return true;
    }
    document.onselectstart = new Function("return false");
    if (window.sidebar) {
        document.onmousedown = disableselect;
        document.onclick = reEnable;
    }
}
function subMenuWidth(p) {
    var width_menu = $(".menunw_one").width();
    var middle_menu = $(".menunw_one").width() / 2;
    var left_this = $(".li_menu" + p).position();
    var width_this = $(".menu_action").width();
    var right_this = width_menu - left_this.left;
    if (left_this.left < middle_menu) {
        $(".menu_au_sub_" + p).css("left", left_this.left + "px");
    } else
    if (left_this.left > middle_menu) {
        $(".menu_au_sub_" + p).css("right", right_this - width_this + "px");
    }
}
function menuCss() {
    var width = $(".menu_action").width();
    $(".menu_au_sub").width(width);
    $(".sub_sub_ul").css({left: width});
}
function scrollInPage(pagina, classOrID, velocidad, marginTop, makeUrlGet) {
    var pActual = document.querySelector("#contenedor").getAttribute("data-site");
    if (pActual !== pagina) {
        window.location = '/' + pagina + '#' + classOrID;
        return;
    }
    scrollPage(classOrID, velocidad, marginTop, makeUrlGet);
}
function scrollTop() {
    scrollPage("body", 300, 0, false);
}
function scrollPage(p, vel, toped, url, divScroll, tipo) {
    if (vel == undefined) {
        vel = 2000;
    }
    if (toped == undefined) {
        toped = 100;
    }
    var div = p.split(",");

    if (p.indexOf("execCallBack") == 0) {
        return;
    }
    var divObjetivo = "#" + p;
    if (p == "body") {
        divObjetivo = p;
    } else
    if (p.indexOf("#") != -1) {
        divObjetivo = p;
    } else
    if (p.indexOf(".") != -1) {
        divObjetivo = p;
    }
    var pos = $(divObjetivo).offset();
    if (tipo == "position") {
        pos = $("#" + p).position();
    }
    if (pos == undefined) {
        return;
    }
    var topp = parseInt(pos.top) - parseInt(toped);
    var divMoveScroll = "html, body";
    if (evalueData(divScroll)) {
        divMoveScroll = divScroll;
    }

    $(divMoveScroll).animate({
        scrollTop: topp
    }, parseInt(vel));

    var rutaSite = $("#contenedor").attr("data-site");

    if (url != false) {
        if (p != "contenedor") {
            setTimeout(function () {
                history.pushState(null, "", "/" + rutaSite + "#" + div[0] + "");
            }, 100);
        }
    }
}


function loadModuleAll(php, div) {
    loadModule(php, div, false, false, "libre");
}
function loadModule(php, div, connect, pag, type, url_sites, array, callback) {
    var url = "/modules/" + php + "/index.php";
    if (typeof type != "undefined") {
        if (type != undefined) {
            if (type == "libre") {
                url = php;
            }
        }
    }
    var data = {};
    data.connect = connect;
    data.pagina = pag;
    data.url_sites = url_sites;
    if (typeof array !== "undefined") {
        data.get = array;
    }
    $.ajax({
        type: "POST",
        url: url,
        data: data,
        error: function () {
            console.log("No se pudo cargar el módulo " + php + ". Compruebe que el módulo esté bien configurado o si existe.");
        },
        success: function (data) {
            $(div).append(data);
            if (typeof callback !== "undefined") {
                callback();
            }
        }
    });
}

function number_format(self, onlyNumber) {
    if (onlyNumber === true) {
        return self.replace(/\D/g, "")
                .replace(/([0-9])([0-9]{2})$/, '$1.$2')
                .replace(/\B(?=(\d{3})+(?!\d)\.?)/g, ",");
    }
    $(self).val(function (index, value) {
        return value.replace(/\D/g, "")
                .replace(/([0-9])([0-9]{2})$/, '$1.$2')
                .replace(/\B(?=(\d{3})+(?!\d)\.?)/g, ",");
    });
}

function formato_numero(numero, decimales, separador_decimal, separador_miles) {
    numero = parseFloat(numero);
    if (isNaN(numero)) {
        return "";
    }
    if (decimales !== undefined) {
        numero = numero.toFixed(decimales);
    }
    numero = numero.toString().replace(".", separador_decimal !== undefined ? separador_decimal : ",");
    if (separador_miles) {
        var miles = new RegExp("(-?[0-9]+)([0-9]{3})");
        while (miles.test(numero)) {
            numero = numero.replace(miles, "$1" + separador_miles + "$2");
        }
    }

    return numero;
}

function addNumber(nStr) {
    var x, x1, x2;
    nStr += '';
    x = nStr.split('.');
    x1 = x[0];
    x2 = x.length > 1 ? '.' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
        x1 = x1.replace(rgx, '$1' + ',' + '$2');
    }
    return x1 + x2;
}

function importjs(url) {
    var script = document.createElement('script');
    var parentScript = document.getElementById('myscript');
    parentScript = parentScript.src;
    parentScript = parentScript.split('/');
    parentScript.pop();
    parentScript = parentScript.join();
    parentScript = parentScript.replace(/,/gi, '/');
    script.src = parentScript + url;
    var body = document.body;
    body.appendChild(script);
}
var myPrettyCode = function () {
};
function loadJs(url, callback, id, async) {
    cargaJs(url, callback, id, async);
}

function fileExists(path, callBack) {
    var xmlhttp;
    if (window.XMLHttpRequest) {
        xmlhttp = new XMLHttpRequest();
    } else {
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.onloadend = function () {
        xmlhttp.fileExist = false;
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            xmlhttp.fileExist = true;
        }
        callBack(xmlhttp);
    };
    xmlhttp.open("POST", path, true);
    xmlhttp.send();
}

function lee_json(url, callBack) {
    $.getJSON(url, function (datos) {
        callBack(datos);
    });
}


function cargaJs(url, callback, idDiv, async) {
    var version = "v=0";
    if (typeof nwm != "undefined") {
        version = "v=" + nwm.getInfoApp().version;
    }
    if (url.indexOf("?") == -1) {
        version = "?" + version;
    } else {
        version = "&" + version;
    }
    url = url + version;
    try {
        var id = url.replace(/\//gi, "");
        id = id.replace(/\?/gi, "");
        id = id.replace(/\=/gi, "");
        id = id.replace(/\./gi, "");
        id = id.replace(/\,/gi, "");
        id = id.replace(/\&/gi, "");
        id = id.replace(/\=/gi, "");
        id = id.replace(/\_/gi, "");
        id = id.replace(/\-/gi, "");
        id = id.replace(/-/gi, "");
        id = id.replace(/\#/gi, "");
        id = id.replace(/#/gi, "");
        id = id.replace(/\:/gi, "");
        id = id.replace(/:/gi, "");
        id = id.replace(/{/gi, "");
        id = id.replace(/}/gi, "");
        id = id.replace(".", "");
        if (evalueData(idDiv)) {
            id = idDiv;
        }
        var a = document.createElement("script");
        a.type = "text/javascript";
        a.charset = "UTF-8";
        a.async = "async";
        a.src = url;
        a.id = id;
        var style = document.querySelector("#" + id);
        if (!style) {
            a.onload = function () {
                if (evalueData(callback)) {
                    callback();
                }
            };
            if (async === true) {
                document.getElementsByTagName('head')[0].appendChild(a);
            } else {
                $("body").append(a);
            }
        } else {
            if (evalueData(callback)) {
                callback();
            }
        }
    } catch (e) {
        console.log(e);
    }
}

function loadCss(url, div, onlyAdd, callback) {
    if (document.createStyleSheet) {
        document.createStyleSheet(url);
    } else {
        var id = url.replace(/\//gi, "");
        id = id.replace(/\?/gi, "");
        id = id.replace(/\=/gi, "");
        id = id.replace(/\./gi, "");
        id = id.replace(/\,/gi, "");
        id = id.replace(/\&/gi, "");
        id = id.replace(/\=/gi, "");
        id = id.replace(/\_/gi, "");
        id = id.replace(/\-/gi, "");
        id = id.replace(".", "");
        var styles = url;
        var ob = document.createElement('link');
        ob.id = id;
        ob.rel = 'stylesheet';
        ob.type = 'text/css';
        ob.href = styles;
        ob.onload = function () {
            if (evalueData(callback)) {
                callback();
            }
        };
        if (onlyAdd === true) {
            document.getElementsByTagName("head")[0].appendChild(ob);
        } else {
            var style = document.querySelector("#" + id);
            if (!evalueData(style)) {
                if (evalueData(div)) {
                    $(div).append(ob);
                } else {
                    document.getElementsByTagName("head")[0].appendChild(ob);
                }
            }
        }
    }
}



/*                                                       UBICACIÓN GEOGRÁFICA GOOGLE MAPS                                */

function directionsService(lat, long, lat2, long2, callBack, map, travelMode) {
    var start = new google.maps.LatLng(lat, long);
    var end = new google.maps.LatLng(lat2, long2);
    if (map != undefined && map != false && map != null && map != "") {
        var marcadorA = new google.maps.Marker({
            position: start,
            map: map,
            title: 'soy la referencia',
            animation: google.maps.Animation.DROP,
            draggable: false
        });

        var marcadorB = new google.maps.Marker({
            position: end,
            map: map,
            title: 'Arrastrame',
            animation: google.maps.Animation.DROP,
            draggable: true,
            icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
        });

        /*ponemos evento en marcador B*/
        google.maps.event.addListener(marcadorB, 'dragend', function () {
            console.log('Estas a :' + google.maps.geometry.spherical.computeDistanceBetween(start, marcadorB.getPosition()) + 'mts. de A');
            /*Calculando la distancia en metros*/
            console.log(google.maps.geometry.spherical.computeDistanceBetween(start, end));
            /*    Calculando el ángulo en grados*/
            console.log(google.maps.geometry.spherical.computeHeading(start, end));
        });
    }

    if (typeof travelMode == "undefined") {
        travelMode = google.maps.TravelMode.DRIVING;
    } else
    if (travelMode == "DRIVING") {
        travelMode = google.maps.TravelMode.DRIVING;
    } else
    if (travelMode == "BICYCLING") {
        travelMode = google.maps.TravelMode.BICYCLING;
    } else
    if (travelMode == "TRANSIT") {
        travelMode = google.maps.TravelMode.TRANSIT;
    } else
    if (travelMode == "WALKING") {
        travelMode = google.maps.TravelMode.WALKING;
    }

    var directionsService = new google.maps.DirectionsService();
    var request = {
        origin: start,
        destination: end,
        travelMode: travelMode,
        drivingOptions: {
            departureTime: new Date(Date.now()), /* for the time N milliseconds from now.*/
            trafficModel: "optimistic"
        }
    };
    directionsService.route(request, function (result, status) {
        var rta = "";
        if (status == google.maps.DirectionsStatus.OK) {
            rta = result;
        } else {
            rta = "sin resultados";
        }
        callBack(rta);
    });
}

function changeTextTravelMode(travelMode) {
    if (travelMode == "DRIVING") {
        travelMode = "Carro";
    } else
    if (travelMode == "BICYCLING") {
        travelMode = "Bicicleta";
    } else
    if (travelMode == "TRANSIT") {
        travelMode = "Transporte público";
    } else
    if (travelMode == "WALKING") {
        travelMode = "A pie";
    }
    return travelMode;
}


load_varios_map = null;
/*SACAR LATITUD Y LONGITUD POR DIRECCIÓN*/
function validarGeo(city, modo, xx, yy, zz, type, all_direction) {
    if (type != undefined && type != 0 && type != false) {
        load_varios_map = type;
    }
    var address = "";
    if (all_direction != undefined) {
        address = all_direction;
    } else {
        address = modo + " " + xx + " " + yy + " " + zz + " " + city;
    }
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode({'address': address}, geocodeResult);
}

function geocodeResult(results, status) {
    if (status == 'OK') {
        var data = results[0].geometry.location;
        var place = results[0].address_components[2].long_name;
        X = data.lng();
        Y = data.lat();
        if (load_varios_map == "cobertura") {
            validarDireccion("" + X + "", "" + Y + "");
        } else {
            loadCoordenMapa(0, 0, X, Y, 17);
        }
    } else {
        console.log("Geocoding no tuvo éxito debido a: " + status);
    }
}

function getDirGeo(r) {
}

function getMyUbic(callBack) {
    miUbicacion(callBack, false, true);
}

function miUbicacion(func, loadMap, loadCallBack) {
    if (localStorage["geoPositionStatus"] === "rejected") {
        if (loadCallBack === true && evalueData(func)) {
            func("rejected");
        }
        return false;
    }
    var self;
    var selfTwo;
    if (navigator.geolocation) {
        if (typeof navigator.permissions === "undefined") {
            return false;
        }
        navigator.permissions.query({name: 'geolocation'}).then(function (permissionStatus) {
            localStorage["geoPositionStatus"] = permissionStatus.state;
            var st = localStorage["geoPositionStatus"];
            if (st === "prompt") {
                openDialogGps();
            }
            permissionStatus.onchange = function () {
                localStorage["geoPositionStatus"] = this.state;
                var st = localStorage["geoPositionStatus"];
                if (st === "prompt") {
                    openDialogGps();
                }
            };
        });
        function openDialogGps() {
            var params = {};
            params.html = location.hostname + ' requiere usar tu GPS. ';
            params.onSave = function () {
                activeGPS();
                return true;
            };
            params.onCancel = function () {
                localStorage["geoPositionStatus"] = "rejected";
                setUbicGeoUser(false);
                if (loadCallBack === true && evalueData(func)) {
                    func("singps");
                }
                return true;
            };
            params.textAccept = 'Permitir GPS';
            params.textCancel = 'Bloquear';
            params.no_buttons_enc = true;
            params.width = "300px";
            params.title = 'Solicitud de permisos';
            self = createDialogNw(params);

            addCss(self, ".btnm", {"width": "50%"});
            addCss(self, ".btnm_cancel", {"background": "transparent", "color": "#000", "box-shadow": "none"});
        }
        function indicacionGPS() {
            if (isMobile()) {
                return false;
            }
            var params = {};
            params.html = 'Por favor haga clic en <strong>PERMITIR</strong> para activar su GPS.';
            params.textAccept = 'Entendido';
            params.no_cancel_button = true;
            params.width = "300px";
            selfTwo = createDialogNw(params);
            addCss(selfTwo, "", {"top": "100px", "left": "100px"});
        }

        function activeGPS() {
            if (evalueData(self)) {
                reject(self);
            }
            indicacionGPS();
            navigator.geolocation.getCurrentPosition(okGeo, errorGeo, {maximumAge: 75000, timeout: 15000});
        }
        function okGeo(objPosition) {
            reject(selfTwo);
            var lon = objPosition.coords.longitude;
            var lat = objPosition.coords.latitude;
            X = lon;
            Y = lat;
            var data = {};
            data["lat"] = objPosition.coords.latitude;
            data["lng"] = objPosition.coords.longitude;
            funcGeo = "getDirGeo";
            var geocoder = new google.maps.Geocoder();
            var yourLocation = new google.maps.LatLng(data["lat"], data["lng"]);
            geocoder.geocode({'latLng': yourLocation}, processGeocoderTest);
            function processGeocoderTest(results, status) {

                localStorage["geoPositionStatus"] = "permitted";

                if (status == google.maps.GeocoderStatus.OK) {
                    var data = extraerDataResult(results);
                    data["lat"] = objPosition.coords.latitude;
                    data["lng"] = objPosition.coords.longitude;
                    if (loadCallBack === true && evalueData(func)) {
                        if (data == "singps") {
                            console.log("Sin permisos para el GPS main");
                        }
                        func(data);
                    }

                } else {
                    error("Geocoding fallo debido a : " + status);
                }
            }
            if (loadMap == undefined) {
                loadCoordenMapa(0, 0, "" + lon + "", "" + lat + "", 17, "yo", func);
            } else
            if (loadMap === false && loadCallBack != true) {
                window[func](objPosition.coords);
            }
        }
        function errorGeo(objPositionError) {
            reject(selfTwo);
            localStorage["geoPositionStatus"] = objPositionError.message;
            localStorage["geoPositionCode"] = objPositionError.code;
            switch (objPositionError.code) {
                case objPositionError.PERMISSION_DENIED:
                    setUbicGeoUser(objPositionError.message);
                    setUbicGeoUser("PERMISSION_DENIED");
                    break;
                case objPositionError.POSITION_UNAVAILABLE:
                    setUbicGeoUser("POSITION_UNAVAILABLE");
                    break;
                case objPositionError.TIMEOUT:
                    setUbicGeoUser("TIMEOUT");
                    break;
                default:
            }
            setUbicGeoUser(false);
            if (loadCallBack === true && evalueData(func)) {
                func("singps");
            }
        }
    } else {
        nw_dialog("Su navegador no soporta la API de geolocalización");
    }
}

function getPositionGPS(callback) {
    navigator.geolocation.getCurrentPosition(ok, error, {maximumAge: 75000, timeout: 15000});
    function ok(e) {
        var data = {};
        data.lat = e.coords.latitude;
        data.lng = e.coords.longitude;

        var geocoder = new google.maps.Geocoder();
        var ui = new google.maps.LatLng(data.lat, data.lng);

        geocoder.geocode({'latLng': ui}, processGeocoderValidate);

        function processGeocoderValidate(results, status) {
            if (status === google.maps.GeocoderStatus.OK) {
                var d = extraerDataResult(results);
                d.lat = e.coords.latitude;
                d.lng = e.coords.longitude;
                d.coords = e.coords;
                d.responseAll = e;
                callback(d);
            } else {
                error("Geocoding fallo debido a : " + status);
            }
        }
    }
    function error(e) {
        console.log(e);
        nw_dialog("Error in GPS, open console");
    }
}

map = null;
createMapa = false;
function loadCoordenMapa(total, ee, xx, yy, Z, y, func) {
    var iterations = 0;
    function checksIfscriptIsLoaaded() {
        if (typeof GBrowserIsCompatible === 'undefined') {
            setTimeout(checksIfscriptIsLoaaded, 1000);
            iterations++;/*you want to do this finite number of times say 10*/
        } else {
            if (GBrowserIsCompatible()) {
                /*do your thing*/
                continueloadCoordenMapa(total, ee, xx, yy, Z, y, func);
            } else {
                alert('browser is not supported.');
            }
        }
    }
    checksIfscriptIsLoaaded();
}
function continueloadCoordenMapa(total, ee, xx, yy, Z, y, func) {
    if (xx != undefined && yy != undefined) {
        var positionX = parseFloat(xx);
        var positionY = parseFloat(yy);
    } else {
        var positionX = parseFloat(X);
        var positionY = parseFloat(Y);
    }
    if (Z == undefined) {
        Z = 15;
    }
    if (func != undefined) {
        createMapa = true;
        window[func](positionX, positionY, true);
    }
    if (map == null) {
        map = new GMap2(document.getElementById("map"));
        map.setCenter(new GLatLng(positionY, positionX), Z);
        map.setMapType(G_NORMAL_MAP);
    }
    if (total != undefined && ee != undefined) {
        if (total > 0) {
            var datosPolig = [];
            for (var i = 0; i < total; i++) {
                var pp = ee[i].split("/");
                xx = pp[1];
                yy = pp[0];
                if (xx != undefined && yy != undefined) {
                    datosPolig[i] = new GLatLng(xx, yy);
                }
            }
            polygon = new GPolygon([datosPolig], "#669933", 5, 0.7, "#996633", 0.4);
            map.addOverlay(polygon);
        }
    }
    var iconoMarca = new GIcon(G_DEFAULT_ICON);
    if (y == "yo") {
    } else {
    }
    var punto_marca = new GPoint(positionX, positionY);
    var marca = new GMarker(punto_marca, iconoMarca);
    map.addOverlay(marca);
    $("#map").fadeIn();
}


function printContent(div, css, isHtml) {
    var hoja_css = "";
    var htmlPrint = "";
    if (isHtml == true) {
        htmlPrint = div;
    } else {
        htmlPrint = document.getElementById(div).innerHTML;
    }
    if (css != undefined && css != 0 && css != "" && css != false) {
        hoja_css = "<link href='" + css + "' rel='stylesheet' type='text/css' />";
    }
    var page = $("#contenedor").attr("data-p");
    var html = '<html><head>' + hoja_css + '\n\
                                                       <link href="/nwproject/utilities/css.php?p=' + page + '&idioma=1" rel="stylesheet" type="text/css" />\n\
                                                      <script type="text/javascript" src="/nwproject/utilities/jquery/jquery.min.js" ></script>\n\
                                                        </head><body style="background:#ffffff;">' + htmlPrint + '</body></html>';
    var WindowObject = window.open("", "PrintWindow", "width=850,height=750,top=0,left=0,toolbars=no,scrollbars=yes,status=no,resizable=yes");
    WindowObject.document.writeln(html);
    WindowObject.focus();
    setTimeout(function () {
        WindowObject.print();
    }, 2000);
    setTimeout(function () {
        window.close(this);
    }, 2000);
}


function screenShot(div, chart) {
    var divs = ".page";
    var transform = $("" + divs + ">div:first>div").css("transform");
    var comp = transform.split(",");
    var mapleft = parseFloat(comp[4]);
    var maptop = parseFloat(comp[5]);
    $("" + divs + ">div:first>div").css({
        "transform": "none",
        "left": mapleft,
        "top": maptop
    });
    if (chart == "SI") {
        html2canvas($('#' + div), {
            logging: true,
            proxy: "html2canvasproxy.php",
            profile: true,
            allowTaint: true,
            onrendered: function (canvas) {
                var dato = canvas.toDataURL('image/jpeg');
                dato = dato.replace("image/jpeg", "image/octet-stream");
                document.location.href = dato;
            }
        });
    } else {
        html2canvas($('#' + div), {
            useCORS: true,
            onrendered: function (canvas) {
                var dato = canvas.toDataURL('image/jpeg');
                dato = dato.replace("image/jpeg", "image/octet-stream");
                document.location.href = dato;
                $("" + divs + ">div:first>div").css({
                    left: 0,
                    top: 0,
                    "transform": transform
                });
            }
        });
    }
}

function validateRequired(self, exceptions) {
    var el = document.querySelector(':focus');
    if (el) {
        el.blur();
    }
    var div_required = "";
    $("*").removeClass("inputRequiredNotable");
    $(".errorForm").remove();
    $(".error").remove();
    if (self != undefined) {
        if (self == ".containFormNw") {
            div_required = $("div.nw_dialog_intern").find('.required');
        } else {
            div_required = $(self).find('.required');
        }
    } else {
        var div_required = $(".required");
    }
    var total = div_required.length;
    for (var i = 0; i < total; i++) {
        var di = div_required[i];
        if (evalInput(di, exceptions) == false) {
            return false;
        }
        var div = $(di);
        var name = div.attr("name");
        var totalcaracteres = div.val().length;
        var car_min = div.attr("minlength");
        var car_max = div.attr("maxlength");
        if (car_min != undefined) {
            if (totalcaracteres < car_min) {
                $(div).focus();
                var mensaje = "<span class='errorForm'>" + str("Faltan caracteres, mínimo") + " " + car_min + " </span>";
                $(".contain_input_name_" + name).append(mensaje);
                $(".contain_input_name_" + name).addClass("inputRequiredNotable");
                /*
                 div.focus().after(mensaje);
                 */
                div.keyup(function () {
                    if ($(this).val() != "") {
                        $(".errorForm").remove();
                        $(".errorFormInBox").remove();
                        $(".error").remove();
                        $(".loadingNwInto").remove();
                        $("*").removeClass("inputRequiredNotable");
                        removeLoadingNw();
                        return false;
                    }
                });
                div.change(function () {
                    if ($(this).val() != "") {
                        $(".errorFormInBox").remove();
                        $(".errorForm").remove();
                        $(".error").remove();
                        $(".loadingNwInto").remove();
                        $("*").removeClass("inputRequiredNotable");
                        removeLoadingNw();
                        return false;
                    }
                });
                return false;
            }
        }
    }
    return true;
}

function evalInput(d, exceptions) {
    var mensaje = "<span class='error'>" + str("Campo obligatorio") + "</span>";
    var input = $(d);
    var value = input.val();
    var type = input.attr("type");
    var name = input.attr("name");
    if (input.is(':checked')) {
    }
    if (type == "selectBoxTwo") {
        value = input.attr('val-data');
    }
    if (type == "checkbox" || type == "checkBox" || type == "check") {
        value = input.prop('checked');
    }
    if (type == "radioMultiple" || type == "checkBoxMultiple") {
        var id = input.attr("id");
        var id_div = input.attr("id-div");
        var p = input.find('.inputradiobuttonnwf_' + id_div);
        if (type == "checkBoxMultiple") {
            p = input.find('.inputcheckboxtonnwf_' + id_div);
        }
        for (var i = 0; i < p.length; i++) {
            var pp = p[i];
            if ($(pp).is(":checked") === true) {
                value = true;
                break;
            }
        }
    }
    if (type == "email" || type == "correo") {
        value = validateEmail(value);
    }
    var isnot = false;
    if (value == undefined || value == "" || value == "0" || value == 0 || value == false) {
        isnot = true;
    }
    if (typeof exceptions !== "undefined") {
        if (value.indexOf(exceptions) !== -1) {
            isnot = false;
        }
    }
    if (isnot) {
        if (type == "radioMultiple" || type == "checkBoxMultiple") {
            /*
             $(input).prepend(mensaje);
             */
            scrollPage(id, 400, 100, false);
        } else {
            /*
             $(input).focus().after(mensaje);
             */
        }
        $(".contain_input_name_" + name + " .divContainInputIntern").append(mensaje);
        $(".contain_input_name_" + name).addClass("inputRequiredNotable");
        input.focus();
        input.keydown(function () {
            $(".error").remove();
            $("*").removeClass("errorFormInBox");
            $("*").removeClass("inputRequiredNotable");
        });
        input.change(function () {
            $(".error").remove();
            $("*").removeClass("errorFormInBox");
            $("*").removeClass("inputRequiredNotable");
        });
        return false;
    }
    return true;
}

function validateEmail(email) {
    var chrbeforAt = email.substr(0, email.indexOf('@'));
    if (!($.trim(email).length > 127)) {
        if (chrbeforAt.length >= 2) {
            var re = /^(([^<>()[\]{}'^?\\.,!|//#%*-+=&;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
            return re.test(email);
        } else {
            return false;
        }
    } else {
        return false;
    }
}

function validateFomatDomain(nombre_dominio) {
    var arr = new Array(
            '.com', '.net', '.org', '.biz', '.coop', '.info', '.museum', '.name',
            '.pro', '.edu', '.gov', '.int', '.mil', '.ac', '.ad', '.ae', '.af', '.ag',
            '.ai', '.al', '.am', '.an', '.ao', '.aq', '.ar', '.as', '.at', '.au', '.aw',
            '.az', '.ba', '.bb', '.bd', '.be', '.bf', '.bg', '.bh', '.bi', '.bj', '.bm',
            '.bn', '.bo', '.br', '.bs', '.bt', '.bv', '.bw', '.by', '.bz', '.ca', '.cc',
            '.cd', '.cf', '.cg', '.ch', '.ci', '.ck', '.cl', '.cm', '.cn', '.co', '.cr',
            '.cu', '.cv', '.cx', '.cy', '.cz', '.de', '.dj', '.dk', '.dm', '.do', '.dz',
            '.ec', '.ee', '.eg', '.eh', '.er', '.es', '.et', '.fi', '.fj', '.fk', '.fm',
            '.fo', '.fr', '.ga', '.gd', '.ge', '.gf', '.gg', '.gh', '.gi', '.gl', '.gm',
            '.gn', '.gp', '.gq', '.gr', '.gs', '.gt', '.gu', '.gv', '.gy', '.hk', '.hm',
            '.hn', '.hr', '.ht', '.hu', '.id', '.ie', '.il', '.im', '.in', '.io', '.iq',
            '.ir', '.is', '.it', '.je', '.jm', '.jo', '.jp', '.ke', '.kg', '.kh', '.ki',
            '.km', '.kn', '.kp', '.kr', '.kw', '.ky', '.kz', '.la', '.lb', '.lc', '.li',
            '.lk', '.lr', '.ls', '.lt', '.lu', '.lv', '.ly', '.ma', '.mc', '.md', '.mg',
            '.mh', '.mk', '.ml', '.mm', '.mn', '.mo', '.mp', '.mq', '.mr', '.ms', '.mt',
            '.mu', '.mv', '.mw', '.mx', '.my', '.mz', '.na', '.nc', '.ne', '.nf', '.ng',
            '.ni', '.nl', '.no', '.np', '.nr', '.nu', '.nz', '.om', '.pa', '.pe', '.pf',
            '.pg', '.ph', '.pk', '.pl', '.pm', '.pn', '.pr', '.ps', '.pt', '.pw', '.py',
            '.qa', '.re', '.ro', '.rw', '.ru', '.sa', '.sb', '.sc', '.sd', '.se', '.sg',
            '.sh', '.si', '.sj', '.sk', '.sl', '.sm', '.sn', '.so', '.sr', '.st', '.sv',
            '.sy', '.sz', '.tc', '.td', '.tf', '.tg', '.th', '.tj', '.tk', '.tm', '.tn',
            '.to', '.tp', '.tr', '.tt', '.tv', '.tw', '.tz', '.ua', '.ug', '.uk', '.um',
            '.us', '.uy', '.uz', '.va', '.vc', '.ve', '.vg', '.vi', '.vn', '.vu', '.ws',
            '.wf', '.ye', '.yt', '.yu', '.za', '.zm', '.zw');
    var comprobacion = nombre_dominio;
    var val = true;
    var punto = comprobacion.lastIndexOf(".");
    var nombre_dominio = comprobacion.substring(0, punto);
    var extension = comprobacion.substring(punto, comprobacion.length);
    if (punto > 2 && punto < 57)
    {
        for (var i = 0; i < arr.length; i++)
        {
            if (extension == arr[i])
            {
                val = true;
                break;
            } else
            {
                val = false;
            }
        }
        if (val == false)
        {
            return ("la extensión de su página web " + extension + " no es correcta");
        } else
        {
            for (var j = 0; j < nombre_dominio.length; j++)
            {
                var dh = nombre_dominio.charAt(j);
                var hh = dh.charCodeAt(0);
                if ((hh > 47 && hh < 59) || (hh > 64 && hh < 91) || (hh > 96 && hh < 123) || hh == 45 || hh == 46)
                {
                    if ((j == 0 || j == nombre_dominio.length - 1) && hh == 45)
                    {
                        return ("El nombre de su página web no puede contener el simbolo guión '-' al principio ni al final");
                    }
                } else {
                    return ("El nombre de su página web no puede contener caracteres especiales");
                }
            }
        }
    } else
    {
        return ("Verifique el nombre de su página web");
    }
    return true;
}

function  validateSession(func) {
    $.ajax({
        type: "POST",
        url: "/nwproject/utilities/srv/validateSession.php",
        error: function () {
            alert("La operación no pudo ser procesada. Inténtelo de nuevo.");
        },
        success: function (data) {
            if (data == 1) {
                func();
                return true;
            } else {
                nw_dialog("Debe iniciar sesión o registrarse");
                $("#usuario").focus();
                return false;
            }
        }
    });
}

function nw_dialog_func(data, func, dataForFunc) {
    nw_dialog(data, str("información"), false, false, func, dataForFunc);
}
function nw_dialog_self(self) {
    nw_dialog(false, false, false, false, false, false, self);
}
function nw_dialog(data, title, overflow, options, func, dataForFunc, self) {
    var params = {};
    params.html = data;
    params.no_cancel_button = true;
    params.onSave = function () {
        if (func != undefined && func != "" && func != 0 && func != "0" && func != null) {
            if (typeof func == 'object') {
                func(dataForFunc);
            } else if (typeof func == 'string') {
                window[func](dataForFunc);
            }
        }
        return true;
    };
    createDialogNw(params);
}

function rejectForm(self, typeForm) {
    reject(self, typeForm, "form");
}
function rejectDontShowTree(self) {
    reject(self);
    reject(".containDialogNwForm_" + self.replace(".", ""));
    reject();
    reject(".backIntreeNw");
    $("div").removeClass("dontShowTree");
}

function setBodyOverflow(mode) {
    if (mode === "create") {
        if (!isMobile()) {
            $("body").addClass("bodyOverflowHidden");
        }
    } else
    if (mode === "reject") {
        var d = document.querySelectorAll(".nwDiextern");
        if (d.length <= 1) {
            $("body").removeClass("bodyOverflowHidden");
        }
    }
}

function reject(self, mode, type, callBack) {
    setBodyOverflow("reject");
    if (typeof self !== "undefined") {
        if (mode !== false) {
            if (mode === "slider") {
            } else {
                $(".containDialogNwForm_" + self.replace(".", "")).remove();
            }
        }
    } else {
        $(".containFileDir").remove();
        $(".nwDiextern").remove();
    }
    $("div").removeClass("dontShowTree");
    if (type !== "form") {
        if (mode === "slider") {
            self = ".containFileDir";
        }
    }
    if (isMobile()) {
        $("body").removeClass("noOverflow");
        /*experimental para iOS*/
        $("body").removeClass("hiddenBody");
        var elmnt = document.body;
        elmnt.scrollTop = __scrollBodyNw;
    }

    if (mode !== "popup") {
        var divi = self;
        if (type === "form") {
            divi = "";
        }
        $(divi + " .backIntreeNw").remove();
        $(".hiddenColumnInShowRow").removeClass("hiddenColumn");
        $(divi + " *").removeClass("moveWindowSlideFormContainerPrelimin");
        $(divi + " .btn-reject-nwform").remove();
        $(divi + " .addDivConverted").removeClass("moveWindowSlideForm");
        $(divi + " .addDivConverted").removeClass("moveWindowSlideFormAbs");
        $(divi + " .loadModulesHome").removeClass("moveWindowContainModule");
        $(divi + " .showRowMax").removeClass("showRowMax");
        $(divi + " .colsMobil").removeClass("showRowMax");
        $(divi + " .colsMenu").removeClass("colsMenuInWindowSlide");
        $(divi).css({"top": "auto"});
        $(".colsMobil_show_inrow").css({"top": "auto"});
        $(divi).removeClass("colsMobil_show_inrow");
        $(".colsMobil_show_inrow").removeClass("colsMobil_show_inrow");
        $(divi + " .barraEncWindowSlide").remove();
        $(divi + " .newContainerInRow").remove();
        /*
         $(divi + " *").removeClass("colsMobil_show");
         */
        $(divi + " *").attr("dontclick", "none");
        $(divi + " .containWindowSlide").remove();
    }

    if (self === undefined || self === ".containFormNw") {
        $(".ui-dialog").empty();
    } else {
        if (isMobile()) {
            $("#container-nwmaker").removeClass("hiddenBack").removeClass("container-nwmaker_showFormNw");
            $("body").css({"overflow": "auto"});
        }
        if ($(".dialogEnc_" + self.replace(".", "")).length > 0) {
            $(".dialogEnc_" + self.replace(".", "")).remove();
            $(".dialogBg_" + self.replace(".", "")).remove();
            $(".dialogNwBg" + self.replace(".", "")).remove();
            $(".nwDiextern_" + self.replace(".", "")).remove();
        }
        if (type == "form") {
            $(self).empty();
            $(self).remove();
        } else
        if (mode != "slider") {
            $(self).empty();
            $(self).remove();
        }
    }
    if (typeof callBack != undefined) {
        if (evalueData(callBack)) {
            callBack();
        }
    }
}

function addButtonNwForm(text, self) {
    var selfSp = self.split(".");
    var classParent = "containDialogNwForm_" + selfSp[1];
    if ($(".dialogEnc_" + self.replace(".", "")).length == 0) {
        $(self).parent().addClass(classParent);
    }
    $("." + classParent + " .ui-dialog-buttonset").remove();
    $(self + " .divSendNwForm").remove();
    var newButton = $("<button type='button' mode='buttonNw' id='button_nw' class='button_nwform ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only'><span class='ui-button-text' >" + str(text) + "</span></button>");
    var showinEnc = false;
    if (isMobile()) {
        showinEnc = true;
    }
    if ($(self + " .barraEncWindowSlide").length == 0) {
        showinEnc = false;
    }
    var divCont = self + " .footerButtonsNwForms";
    if (showinEnc) {
        divCont = self + " .barraEncWindowSlide";
    }
    if ($(".dialogEnc_" + self.replace(".", "")).length > 0) {

        var nclass = text;
        nclass = "btn_nwform_" + strip_tags(str_replace(" ", "_", nclass).toLowerCase());

        divCont = ".dialogEnc_" + self.replace(".", "") + " .nwformFootIntern";
        newButton = $("<div class='btnm btnm_news " + nclass + "'><span class='btnm_news_span'>" + str(text) + "</span></div>");
        remove(self + " .footerButtonsNwForms");
        remove(divCont + " .btnm_accept");
    }
    $(divCont).append(newButton);

    if ($(".dialogEnc_" + self.replace(".", "")).length > 0) {
        if (isMobile()) {
            var t = $(".dialogEnc_" + self.replace(".", "") + " .btnm_news").length;
            $(".dialogEnc_" + self.replace(".", "") + " .btnm_news").width(100 / t + "%");
            adapterSizeAndPositionDialogNw(".dialogEnc_" + self.replace(".", ""));
        }
    }
    return newButton;
}

function  ajaxNw(url, data, func, mensaje, div, type, funcInDialog) {
    nw_ajax(url, data, func, mensaje, div, type, funcInDialog);
}
function  ajax_nw_json(url, data, func) {
    if (url == "rpcNw") {
        url = "/nwlib6/nwproject/modules/nw_user_session/src/rpcNw.php";
    }
    nw_ajax(url, data, func, null, null, null, null, null, "json");
}
function domains_rpc_qxnw() {
    var domain = location.hostname;
    if (domain == "nwchat.loc"
            || domain == "ccb.gruponw.com"
            || domain == "asesoriasvirtuales.ccb.org.co"
            || domain == "controlturnos.loc"
            || domain == "app.controlturnos.com"
            || domain == "test.controlturnos.com"
            ) {
        return true;
    }
    return false;
}
function  rpcNw(url, data, func, async, self) {
    var isQXNW = false;
    var doms = domains_rpc_qxnw();
    if (doms) {
        isQXNW = true;
    }
    if (typeof nwm !== "undefined") {
        var v = nwm.getInfoApp();
        if (typeof v.rpcQXNW !== "undefined") {
            isQXNW = v.rpcQXNW;
        }
    }
    if (isOnline() === false) {
        if (evalueData(self) == true) {
            removeLoading(self);
            if (typeof localStorage["data_of_" + self] === "undefined") {
                return;
            }
            var d = JSON.parse(localStorage["data_of_" + self]);
            func(d);
            return;
        }
    }
    var asyncEnd = true;
    if (async === false) {
        asyncEnd = false;
    }

    var key = "nwcaf2323";
    key = btoa(unescape(encodeURIComponent(key)));

    var toSend = {};

    var params = [];
    if (evalueData(data["data"])) {
        params[0] = JSON.stringify(data["data"]);
    }
    toSend.server_data = {};
    toSend.server_data.key = key;
    toSend.id = Math.floor(Math.random() * 10000);
    toSend.data = params;
    toSend.service = data.service;
    toSend.method = data.method;
    var obj = {
        "service": data["service"],
        "method": data["method"],
        "id": Math.floor(Math.random() * 10000),
        "params": JSON.stringify(params)
    };

    if (url == "rpcNw") {
        url = "/nwlib6/nwproject/modules/nw_user_session/src/rpcNw.php?s=" + data.id;
        if (isQXNW === true) {
            url = "/rpcsrv/server.php?s=" + data.id;
        }
    }
    if ($(".container-pagination-nwlist-unique").length > 0) {
        if ($(".paglist-total").text() != "0") {
            var init = $(".paglist-initial").text();
            var end = $(".paglist-final").text();
            data["dataPaginationInit"] = init;
            data["dataPaginationEnd"] = end;
        }
    }
    /*    var dataSend = data; */
    var dataSend = toSend;
    if (isQXNW === true) {
        dataSend = JSON.stringify(data);
    }
    nw_ajax(url, dataSend, func, null, null, "POST", null, null, "json", "nwforms", asyncEnd);
}
function nw_ajax_fast(table, where) {
    var url = "/nwproject/utilities/master.nw.php";
    data = {};
    data["table"] = table;
    nw_ajax(url, data, null, null, null, null, null, true, "text");
}
function  nw_ajax(url, data, func, mensaje, div, type, funcInDialog, onlyreturndata, datatype, typeFunc, async) {
    if (async == undefined) {
        async = false;
    }
    if (type == undefined) {
        type = "POST";
    }
    if (datatype == undefined) {
        datatype = "text";
    }
    $.ajax({
        type: type,
        crossDomain: true,
        cache: false,
        url: url,
        data: data,
        dataType: datatype,
        async: async,
        traditional: true,
        error: function (e) {
            console.log("Error", e);
            verifyErrorNwMaker(e);
            return false;
        },
        success: function (data) {
            if (typeof data == "object") {
                if (typeof data.result !== "undefined") {
                    data = data.result;
                }
            }
            var error = "";
            if (datatype == "json") {
                error = null;
            } else {
                error = data.split("ERROR");
            }
            if (onlyreturndata == true) {
                return data;
            } else {
                loaderDataAjax(data, error, mensaje, div, func, funcInDialog, typeFunc);
            }
            return data;
        }
    });
}
function loaderDataAjax(data, error, mensaje, div, func, funcInDialog, typeFunc) {
    if (error != undefined && error != "" && error != 0 && error != "0" && error != null) {
        if (error[1] != undefined) {
            nw_dialog(error);
            return false;
        }
    }
    if (funcInDialog == "dialogload") {
        if (func != undefined && func != "" && func != 0 && func != "0" && func != null) {
            nw_dialog(data, null, null, null, func);
        } else {
            nw_dialog(data);
        }
    } else
    if (mensaje != undefined && mensaje != "" && mensaje != 0 && mensaje != "0" && mensaje != null) {
        nw_dialog(mensaje);
    } else
    if (div != undefined) {
        $(div).html(data);
        $(div).addClass("container_formall");
    } else
    if (func != undefined && func != "" && func != 0 && func != "0" && func != null) {
        if (funcInDialog == true) {
            nw_dialog(data, null, null, null, func);
        } else {
            if (typeFunc == "nwforms") {
                func(data);
            } else {
                try {
                    window[func](data);
                } catch (e) {
                    /*TODO: control de errores*/
                }
            }
        }
    } else {
        nw_dialog(data);
    }
    /*
     localStorage["dataNwAjax"] = data;
     */
}
function verifyErrorNwMaker(r, self, textNoRows, onlyError, showDialogError) {
    /*
     console.log("verifyErrorNwMaker", r);
     */
    removeLoading();
    /*
     remove(".newLoadingNw");
     */
    if (evalueData(self)) {
        removeLoading(self);
    }
    if (typeof r === "undefined") {
        return true;
    }
    var showDialog = true;
    if (showDialogError === false) {
        showDialog = false;
    }
    if (r == "nohaysession") {
        window.location.reload();
    }
    if (r === "session_expired") {
        nw_dialog("Su sesión ha expirado");
        loginNw();
        var html = "";
        html += "<div class='volverNwMLogin'>Volver</div>";
        addHtmlForm(".containerInitSession", html);
        $(".volverNwMLogin").click(function () {
            reloadPageRaiz();
        });
        /*
         window.location = "/";
         window.location.reload();
         */
        return false;
    }
    textNoRows = str(textNoRows);
    if (isOnline() === true) {
        /*
         localStorage["data_of_" + self] = JSON.stringify(r);
         */
    }
    if (r === true || r == null) {
        removeLoading(self);
        return r;
    }
    if (typeof r == "string") {
        if (r.indexOf("query failed") != -1) {
            sendErrorMaker(r, false, false, showDialog);
            return false;
        }
    }
    var error = "A ocurrido un error: " + r;
    if (r.length > 0) {
        removeLoading(self);
        return r;
    }
    if (onlyError != true) {
        if (r.length == 0 || r.length == "0" || r == 0 || r == "0") {
            if (evalueData(self)) {
                resetList(self);
                remove(self + " .no_rows");
                var html = "";
                if (!evalueData(textNoRows)) {
                    textNoRows = str("No hay registros");
                }
                html += "<h3 class='no_rows'>" + textNoRows + "</h3>";
                if ($(self + " .containDataCols").length > 0) {
                    $(self + " .containDataCols").append(html);
                } else {
                    addFooterNote(self, html);
                }
                remove(self + " .loadingNwInto");
            }
            return 0;
        }
    }
    if (typeof r.toString().split("Failed") != "undefined") {
        if (r.toString().split("Failed").length >= 2) {
            removeLoadingComplete();
            error = r;
            if (evalueData(textNoRows)) {
                error = textNoRows;
            }
            sendErrorMaker(error, false, false, showDialog);
            return false;
        }
    }
    if (typeof r.responseText != "undefined") {
        removeLoadingComplete();
        if (r.responseText != "") {
            error = r.responseText;
            if (evalueData(textNoRows)) {
                error = textNoRows;
            }
            sendErrorMaker(error, false, false, showDialog);
            return false;
        }
    }
    if (typeof r.statusText != "undefined") {
        removeLoadingComplete();
        if (r.statusText !== "error" && r.statusText !== "OK") {
            error = r.statusText;
            if (evalueData(textNoRows)) {
                error = textNoRows;
            }
            sendErrorMaker(error, false, false, showDialog);
            return false;
        }
    }
    if (evalueData(r)) {
        if (evalueData(r.error)) {
            if (typeof r.error.message !== "undefined") {
                if (r.error.message.indexOf("ya está creado") !== -1) {
                    removeLoading(self);
                    nw_dialog(r.error.message);
                    return false;
                }
                if (r.error.message.indexOf("Error en su usuario o clave") !== -1) {
                    removeLoading(self);
                    nw_dialog(r.error.message);
                    return false;
                }
            }
            if (typeof r.error.message != "undefined" && r.error.message.indexOf("ya está creado") === -1) {
                removeLoadingComplete();
                error = r.error.message;
                if (evalueData(error.message)) {
                    error = error.message;
                } else
                if (error.split("Sesi&Atilde;&sup3;n").length == 2 || error.split("Sesi&oacute;n").length == 2) {
                    error = "Sesión Inválida";
                }
                if (evalueData(textNoRows)) {
                    error = textNoRows;
                }
                sendErrorMaker(error, false, false, showDialog);
                var d = $(".divContainerErrorMaker").text();
                if (d.split("Sesión").length == 2 || d.split("SesiÃ³n").length == 2) {
                    loginNw();
                    var html = "";
                    html += "<div class='volverNwMLogin'>Volver</div>";
                    addHtmlForm(".containerInitSession", html);
                    $(".volverNwMLogin").click(function () {
                        reloadPageRaiz();
                    });
                }
                if (error == "Sesión Inválida") {
                    window.location = "/";
                }
                return false;
            }
        }
    }
    removeLoading(self);
    return r;
}

function sendErrorMaker(error, prog, vers, showDialog) {
    var version = "v=0";
    var program = "";
    var domain = window.location.href;

    if (typeof nwm != "undefined") {
        version = "v=" + nwm.getInfoApp().version;
        program = nwm.getInfoApp().alias;
    }
    if (typeof prog !== "undefined") {
        if (prog !== false) {
            program = prog;
        }
    }
    if (typeof vers !== "undefined") {
        if (vers !== false) {
            version = vers;
        }
    }
    if (typeof error == "string") {
        if (error.indexOf("Sesi&oacute;n Inv&aacute;lida") != -1 || error.indexOf("Sesión") != -1 || error.indexOf("Inválida") != -1) {
            nw_dialog("Sesión inválida");
            setTimeout(function () {
                window.location = "/";
            }, 2000);
            return false;
        }
    }

    var data = {};
    data.error_text = JSON.stringify(error);
    data.program_name = "nwMaker. " + program + " " + version + " " + domain;

    var classname = "divMainPopUpAutoMaker_" + Math.floor((Math.random() * 10000) + 1);
    var params = {};
    params.self = classname;
    params.html = "Se ha presentado una novedad en el sistema, ¿Desea generar un ticket?";
    params.textAccept = 'Generar ticket';
    params.buttonMin = false;
    params.buttonMax = false;
    params.title = 'Información';
    if (!isMobile()) {
        params.width = '300px';
        params.height = 'auto';
    }
    params.showEnc = false;
    params.onSave = function () {
        removeLoading("body");
        if (showDialog !== false) {
            loading("Espere un momento...", "#fff!important", "body");
        }
        var rpc = {};
        rpc["service"] = "master";
        rpc["method"] = "sendReport";
        rpc["data"] = data;
        var func = function (r) {
            removeLoading("body");
            console.log("sendErrorMaker-r", r);
            if (showDialog !== false) {
                nw_dialog("<div class='divContainerErrorMaker'>" + r + " <br /><br /><p style='color: #8b8b8b;font-style: italic;'>LOG ERROR: " + error + "</p></div>");
            }
        };
        rpcNw("rpcNw", rpc, func, true);
        return true;
    };
    params.onCancel = function () {
        return true;
    };
    var self = createDialogNw(params);
}

function removeLoadingComplete() {
    removeLoadingNw();
    removeLoadingNw("fast");
    removeLoading(false);
    removeLoading(".loadingNwInto");
    removeLoading("#loadingNwInto");
    remove(".loadingNwInto");
}
function omitirAcentos(text) {
    var acentos = "ÃÀÁÄÂÈÉËÊÌÍÏÎÒÓÖÔÙÚÜÛãàáäâèéëêìíïîòóöôùúüûÑñÇç";
    var original = "AAAAAEEEEIIIIOOOOUUUUaaaaaeeeeiiiioooouuuunncc";
    for (var i = 0; i < acentos.length; i++) {
        text = text.replace(acentos.charAt(i), original.charAt(i));
    }
    return text;
}
function cerrarSesion() {
    localStorage["autenticado"] = "NO";
    var data = {};
    data["url_sites"] = $("#contenedor").attr("data-site");
    nw_ajax("/nwlib6/nwproject/modules/nw_user_session/src/cerrar_sesion.php", data);
    updateContent();
}
function getGET(url) {
    var loc = document.location.href;
    if (typeof url !== "undefined") {
        loc = url;
    }
    var getString = loc.split('?')[1];
    if (getString == undefined) {
        return false;
    }
    var GET = getString.split('&');
    var get = {};
    for (var i = 0, l = GET.length; i < l; i++) {
        var tmp = GET[i].split('=');
        /*
         get[tmp[0]] = unescape(decodeURI(tmp[1]));
         */
        get[tmp[0]] = unescape(decodeURIComponent(encodeURIComponent(tmp[1])));
    }
    return get;
}

function loadImgZoom(self) {
    divImg = $(self);
    $(".square").remove();
    $(".imgSmall").remove();
    imagen = divImg.attr("data");
    if (imagen == undefined) {
        imagen = divImg.attr("src");
    }
    if (imagen == undefined) {
        var bg_url = divImg.css('background-image');
        bg_url = bg_url.replace(/.*\s?url\([\'\"]?/, '').replace(/[\'\"]?\).*/, '');
        imagen = bg_url;
    }
    divImg.after("<div class='square div_integrado_popup_data' data='" + imagen + "'></div><div class='imgSmall'><img class='imgetiq' src='" + imagen + "' onload='javascript:activeImgZoomSquare();' /></div>");
    squareDiv = $(".square");

    containZoom = $(".imgSmall");
    imgZoom = $(".imgetiq");
    multiple = divImg.attr("zoomImg");
    if (multiple == undefined)
        multiple = 3;
    squareDiv.width(containZoom.width() / multiple);
    squareDiv.height(containZoom.height() / multiple);
    rest = squareDiv.height() / 2;
}

function activeImgZoomSquare() {
    var imgPosition = divImg.position();
    imgTop = imgPosition.top;
    imgLeft = imgPosition.left;
    imgHeight = divImg.height() + imgTop;
    imgWidth = divImg.width() + imgLeft;

    imgZoom.height(parseInt(divImg.height() * multiple));
    imgZoom.width(parseInt(divImg.width() * multiple));

    containZoom.mousemove(function (event) {
        mostrarImagen(event);
    });
    divImg.mousemove(function (event) {
        mostrarImagen(event);
    });
    $(".product-unitary-img-intern").mouseleave(function () {
        containZoom.remove();
        squareDiv.remove();
    });
    squareDiv.mousemove(function (event) {
        mostrarImagen(event);
    });
}

function mostrarImagen(event) {
    var parentOffset = divImg.offset();
    var relX = event.pageX - parentOffset.left;
    var relY = event.pageY - parentOffset.top;
    squareDiv.css({"top": relY - rest, "left": relX - rest});
    var y = -((relY - imgTop) - rest) * multiple;
    var x = -((relX - imgLeft) - rest) * multiple;
    containZoom.fadeIn();
    squareDiv.fadeIn();
    imgZoom.css({"top": y, "left": x, "display": "block"});
}

function createNwFormDialog(fields) {
    return  loadFormNwAll(fields, false, false, "", true);
}
function createNwForm(fields, div) {
    return   loadFormNwAll(fields, div, false, "", false);
}

num = Math.floor((Math.random() * 100) + 1);

function loadFormNwAll(fields, div, table, html, dialog) {
    num = Math.floor((Math.random() * 100) + 1);

    if (div == null || div == false || div == undefined) {
        $(".containFileDir").append("<div class='containFormNw'></div>");
        div = ".containFormNw";
        div = ".nw_dialog_" + num;
        if ($(div).length == 0) {
            var divapp = convertDivNameInObjectDiv(div);
            $(".containFormNw").append(divapp);
        }
    }

    var loadDialog = "dialogload";
    if (dialog == false) {
        loadDialog = false;
    }
    nw_ajax("/nwlib6/nwproject/modules/nwforms/srv/consultaPrAvisame.php", {fields: fields, html: html}, null, null, div, "POST", loadDialog);

    $("body").attr("table-nwform", table);

    return div;
}

function startDictation(div) {
    if (window.hasOwnProperty('webkitSpeechRecognition')) {
        var recognition = new webkitSpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = "es-COL";
        recognition.start();
        recognition.onresult = function (e) {
            document.getElementById(div).value = e.results[0][0].transcript;
            recognition.stop();
        };
        recognition.onerror = function (e) {
            recognition.stop();
        };
    }
}

function secondsToTime(s) {
    function addZ(n) {
        return (n < 10 ? '0' : '') + n;
    }
    var ms = s % 1000;
    s = (s - ms) / 1000;
    var secs = s % 60;
    s = (s - secs) / 60;
    var mins = s % 60;
    var hrs = (s - mins) / 60;
    return addZ(hrs) + ':' + addZ(mins) + ':' + addZ(secs) + '.' + addZ(ms);
}
function diffEntreFechas(fechaIni, fechaFin) {
    if (fechaFin == undefined) {
        fechaFin = getFechaHoraActual();
    }
    var diaEnMils = 1000 * 60 * 60 * 24,
            desde = new Date(fechaIni.substr(0, 10)),
            hasta = new Date(fechaFin.substr(0, 10)),
            diff = hasta.getTime() - desde.getTime() + diaEnMils;/* +1 incluir el dia de ini*/

    var r = diff / diaEnMils;
    r = r - 1;
    return r;
}

function calcularTiempoDosFechas(date1, date2, actual) {
    if (typeof date2 === "undefined") {
        date2 = getFechaHoraActual();
    }

    var hoy = getDateHour();
    var start_actual_time = new Date();
    if (typeof actual === "undefined") {
        start_actual_time = new Date(date1);
    }
    var end_actual_time = new Date(date2);
    var diff = end_actual_time - start_actual_time;
    var diffSeconds = diff / 1000;
    var HH = Math.floor(diffSeconds / 3600);
    var MM = Math.floor(diffSeconds % 3600) / 60;
    var SS = diffSeconds % 60;
    var days = diffEntreFechas(date1, date2);
    var hours = (HH < 10) ? ("0" + HH) : HH;
    var infoDate = dataOfDate(date1);
    var infoDate2 = dataOfDate(hoy);
    var mesDate = infoDate.fecha_mes;
    var mesDateText = infoDate.fecha_mes_text;
    var dayDate = infoDate.fecha_dia;
    var dayDateText = infoDate.fecha_dia_text;
    var hoursDate = infoDate.hora_horas;
    var minutesDate = infoDate.hora_minutos;
    var minutes = ((MM < 10) ? ("0" + MM) : MM);
    var seconds = ((MM < 10) ? ("0" + MM) : SS);
    var formatted = hours + ":" + minutes;
    minutes = parseInt(minutes);
    var isMayor = false;

    if (date1 > hoy) {
        isMayor = true;
    }

    if (minutesDate.toString().length === 1) {
        minutesDate = "0" + minutesDate;
    }
    if (minutes.toString().length === 1) {
        minutes = "0" + minutes;
    }

    var r = {};
    r["hoy"] = hoy;
    r["fecha_mayor_a_hoy"] = isMayor;
    r["date1"] = date1;
    r["time_complet"] = formatted;
    r["days"] = days;
    r["hours"] = hours;
    r["mesDate"] = mesDate;
    r["mesDateText"] = mesDateText;
    r["dayDate"] = dayDate;
    r["dayDateText"] = dayDateText;
    r["hoursDate"] = hoursDate;
    r["minutesDate"] = minutesDate;
    r["minutes"] = minutes;
    r["seconds"] = seconds;

    var dateInFormat = mesDateText + " " + dayDate + " a las " + hoursDate + ":" + minutesDate;
    if (isMayor == true) {
        /*        dateInFormat = "En " + hoursDate + ":" + minutesDate;*/
    } else {
        if (days > 0) {
            if (days == 1) {
                dateInFormat = str("Ayer a las") + " " + hoursDate + ":" + minutesDate;
            } else {
                dateInFormat = mesDateText + " " + dayDate + " a las " + hoursDate + ":" + minutesDate;
            }
        } else {
            if (hours < 24) {
                if (hours < 1) {
                    if (minutes < 59) {
                        dateInFormat = str("Hace") + " " + minutes + " " + str("minutos");
                    }
                } else {
                    dateInFormat = str("Hace") + " " + hours + " " + str("horas") + " " + str("y") + " " + minutes + " " + str("minutos");
                }
            }
        }
    }
    r["dateInFormat"] = dateInFormat;
    return r;
}

function infoDeFecha(date) {
    dataOfDate(date);
}
function dataOfDate(date) {
    var onlyF = date;
    if (date == undefined) {
        date = getFechaHoraActual();
    }
    if (date.split(" ").length == 1) {
        date = date + " 00:00:00";
    }
    onlyF = date.split(" ")[0];

    var diasSemana = new Array("Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado");

    var dateString = date;
    dateString = dateString.replace(/-/g, '/');
    var d = new Date(dateString);
    var r = {};
    r["fecha_sin_hora"] = onlyF;
    r["fecha_completa"] = date;
    r["fecha_anio"] = d.getFullYear();
    r["fecha_mes"] = d.getMonth() + 1;
    r["fecha_mes_string"] = r["fecha_mes"].toString();
    if (r["fecha_mes_string"].length == 1) {
        r["fecha_mes_string"] = "0" + r["fecha_mes_string"];
    }
    r["fecha_mes_text"] = lettersArray(r.fecha_mes);
    r["fecha_mes_text_english"] = mesTextEnglish(r["fecha_mes_string"]);
    r["fecha_dia"] = d.getDate();
    r["fecha_dia_semana"] = d.getDay();
    r.fecha_dia_text = diasSemana[d.getDay()];
    /*    r["fecha_dia_text"] = diasArray(r["fecha_dia_semana"]);*/

    var habil = "SI";
    var festivo = "NO";
    if (r["fecha_dia_semana"] == 6 || r["fecha_dia_semana"] == 0) {
        habil = "NO";
    }
    if (r["fecha_dia_semana"] == 0) {
        festivo = "SI";
    }
    r["fecha_dia_habil"] = habil;
    r["fecha_dia_festivo"] = festivo;
    r["fecha"] = r["fecha_anio"] + "-" + r["fecha_mes"] + "-" + r["fecha_dia"];
    r.semana = semanadelano(r.fecha);
    r["hora_ex"] = d.getTime();
    r["hora_horas"] = d.getHours();
    r["hora_minutos"] = d.getMinutes();
    r["hora_segundos"] = d.getSeconds();
    r["hora_completa"] = d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();
    return r;
}

function diferenciaEntreFechas(dateEnd, dateInit) {
    return  substractDays(dateEnd, dateInit);
}
function substractDays(dateEnd, dateInit) {
    var f = new Date();
    if (dateInit == undefined) {
        dateInit = f.getFullYear() + "-" + (f.getMonth() + 1) + "-" + f.getDate();
    }
    var date1 = new Date(dateInit);
    var date2 = new Date(dateEnd);
    var timeDiff = Math.abs(date2.getTime() - date1.getTime());
    var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return diffDays;
}

function diferenciaHorasClean(hourEnd, hourInit) {
    return    diferenciaHoras(hourEnd, hourInit, true);
}

function diferenciaHoras(hourEnd, hourInit, clean) {
    var f = new Date();
    var separadorHoras = ":";
    var hNow = f.getHours() + separadorHoras + f.getMinutes() + separadorHoras + f.getSeconds();
    if (evalueData(hourInit)) {
        hNow = hourInit;
    }
    var hDay = hourEnd;
    var hora2 = (hNow).split(":"),
            hora1 = (hDay).split(":"),
            t1 = new Date(),
            t2 = new Date();
    t1.setHours(hora1[0], hora1[1], hora1[2]);
    t2.setHours(hora2[0], hora2[1], hora2[2]);
    t1.setHours(t1.getHours() - t2.getHours(), t1.getMinutes() - t2.getMinutes(), t1.getSeconds() - t2.getSeconds());
    var hora = (t1.getHours() ? t1.getHours() + (t1.getHours() > 1 ? "" : "") : "");
    var min = (t1.getMinutes() ? +t1.getMinutes() + (t1.getMinutes() > 1 ? "" : "") : "");
    var seg = (t1.getSeconds() ? (t1.getHours() || t1.getMinutes() ? "" : "") + t1.getSeconds() + (t1.getSeconds() > 1 ? "" : "") : "");

    if (hora.length == 1) {
        hora = "0" + hora;
    }
    if (hora == "") {
        hora = "00";
    }
    if (min == "") {
        min = "00";
    }
    if (min.length == 1) {
        min = "0" + min;
    }
    if (seg == "") {
        seg = "00";
    }
    if (seg.length == 1) {
        seg = "0" + seg;
    }
    var separator = ":";
    if (clean === true) {
        separator = "";
        if (hora == 00 || hora == "00") {
            hora = "";
        }
    }
    var total = hora + separator + min + separator + seg;
    return total;
}

function addMinutesDate(time, dateComplet) {
    return addDate(time, dateComplet, "minutes");
}
function addHourDate(time, dateComplet) {
    return addDate(time, dateComplet, "hours");
}
function addDate(time, dateComplet, mode) {
    time = parseInt(time);
    if (!evalueData(mode)) {
        mode = "hours";
    }
    var d = new Date();
    if (evalueData(dateComplet)) {
        d = new Date(dateComplet);
    }
    if (mode === "hours") {
        d.setHours(d.getHours() + time);
    }
    if (mode === "minutes") {
        d.setMinutes(d.getMinutes() + time);
    }
    var month = (d.getMonth() + 1).toString();
    var day = d.getDate().toString();
    var hora = d.getHours().toString();
    var minuto = d.getMinutes().toString();
    var segundo = d.getSeconds().toString();
    if (month.length == 1) {
        month = "0" + month;
    }
    if (day.length == 1) {
        day = "0" + day;
    }
    if (hora.length == 1) {
        hora = "0" + hora;
    }
    if (minuto.length == 1) {
        minuto = "0" + minuto;
    }
    if (segundo.length == 1) {
        segundo = "0" + segundo;
    }
    var fecha = d.getFullYear() + "-" + month + "-" + day + " " + hora + ":" + minuto + ":" + segundo;
    return fecha;
}

function traerHoraActual(sumHours, sumMinutes, sumSeconds, setHour, setMinute, setSecond) {
    var d = new Date();
    var hora = d.getHours().toString();
    if (evalueData(sumHours)) {
        d.setHours(d.getHours() + sumHours);
        hora = d.getHours().toString();
    }
    if (evalueData(setHour)) {
        hora = setHour;
    }
    if (setHour == 0 || setHour == "0") {
        hora = "00";
    }
    var minuto = d.getMinutes().toString();
    if (evalueData(sumMinutes)) {
        d.setMinutes(d.getMinutes() + sumMinutes);
        minuto = d.getMinutes().toString();
    }
    if (evalueData(setMinute)) {
        minuto = setMinute;
    }
    if (setMinute == 0 || setMinute == "0") {
        minuto = "00";
    }
    var segundo = d.getSeconds().toString();
    if (evalueData(sumSeconds)) {
        d.setSeconds(d.getSeconds() + sumSeconds);
        segundo = d.getSeconds().toString();
    }
    if (evalueData(setSecond)) {
        segundo = setSecond;
    }
    if (setSecond == 0 || setSecond == "0") {
        segundo = "00";
    }

    if (hora.length == 1) {
        hora = "0" + hora;
    }
    if (minuto.length == 1) {
        minuto = "0" + minuto;
    }
    if (segundo.length == 1) {
        segundo = "0" + segundo;
    }
    var fecha = hora + ":" + minuto + ":" + segundo;
    return fecha;
}

function getFechaHoraActual() {
    var d = new Date();
    var month = (d.getMonth() + 1).toString();
    var day = d.getDate().toString();
    var hora = d.getHours().toString();
    var minuto = d.getMinutes().toString();
    var segundo = d.getSeconds().toString();
    if (month.length == 1) {
        month = "0" + month;
    }
    if (day.length == 1) {
        day = "0" + day;
    }
    if (hora.length == 1) {
        hora = "0" + hora;
    }
    if (minuto.length == 1) {
        minuto = "0" + minuto;
    }
    if (segundo.length == 1) {
        segundo = "0" + segundo;
    }
    var fecha = d.getFullYear() + "-" + month + "-" + day + " " + hora + ":" + minuto + ":" + segundo;
    return fecha;
}

function hoy() {
    return getFechaHoraActual();
}

function calendarnw_cant_ds(mes, ano) {
    if ((mes == 1) || (mes == 3) || (mes == 5) || (mes == 7) || (mes == 8) || (mes == 10) || (mes == 12))
        return 31;
    else if ((mes == 4) || (mes == 6) || (mes == 9) || (mes == 11))
        return 30;
    else if (mes == 2) {
        if ((ano % 4 == 0) && (ano % 100 != 0) || (ano % 400 == 0))
            return 29;
        else
            return 28;
    }
}
function sacaDiaSemana(dia, mes, anio) {
    var dias = ["7", "1", "2", "3", "4", "5", "6"];
    var dt = new Date(mes + ' ' + dia + ', ' + anio + ' 12:00:00');
    return dias[dt.getUTCDay()];
}

function onloadcalendar(date) {

}

function getNwCalendar(div, date, callback, version) {
    loadJs("/nwlib6/nwproject/modules/nw_calendar/nwcalendar.js", function () {
        var d = new nwCalendar();
        d.constructor(div, date, version);
        if (typeof callback !== "undefined") {
            if (evalueData(callback)) {
                callback(date);
            }
        }
    }, false, true);
}

function traeFechaHoraActual() {
    return getFechaHoraActual();
}


function getDateHour() {
    return getFechaHoraActual();
}

function getFechaHoy(date) {
    var d = new Date();
    if (evalueData(date)) {
        d = new Date(date);
    }
    var year = (d.getFullYear()).toString();
    var month = (d.getMonth() + 1).toString();
    var day = d.getDate().toString();
    if (month.length == 1) {
        month = "0" + month;
    }
    if (day.length == 1) {
        day = "0" + day;
    }
    return  year + "-" + month + "-" + day;
}

function calculaSemanaByWeek2(week, year) {
    if (week < 1 || week > 53) {
        alert("Error: la semana debe ser un número entre 1 y 53");
        return false;
    }
    var meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    var dias = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];

    /*
     var anterior = new Date(year, 0, (week - 1) * 7 + 1);
     var primer = new Date(year, 0, (week - 1) * 7 + 2);
     var seg = new Date(year, 0, (week - 1) * 7 + 3);
     var ter = new Date(year, 0, (week - 1) * 7 + 4);
     var cuar = new Date(year, 0, (week - 1) * 7 + 5);
     var quin = new Date(year, 0, (week - 1) * 7 + 6);
     var sex = new Date(year, 0, (week - 1) * 7 + 7);
     var ultimo = new Date(year, 0, (week - 1) * 7 + 8);
     var siguiente = new Date(year, 0, (week - 1) * 7 + 9);
     */
    var anterior = new Date(year, 0, (week - 1) * 7 - 1);
    var primer = new Date(year, 0, (week - 1) * 7 + 0);
    var seg = new Date(year, 0, (week - 1) * 7 + 1);
    var ter = new Date(year, 0, (week - 1) * 7 + 2);
    var cuar = new Date(year, 0, (week - 1) * 7 + 3);
    var quin = new Date(year, 0, (week - 1) * 7 + 4);
    var sex = new Date(year, 0, (week - 1) * 7 + 5);
    var ultimo = new Date(year, 0, (week - 1) * 7 + 6);
    var siguiente = new Date(year, 0, (week - 1) * 7 + 7);
    var m = parseInt(primer.getMonth()) + 1;
    if (m.toString().length == 1) {
        m = "0" + m;
    }
    var m2 = parseInt(seg.getMonth()) + 1;
    if (m2.toString().length == 1) {
        m2 = "0" + m2;
    }
    var m3 = parseInt(ter.getMonth()) + 1;
    if (m3.toString().length == 1) {
        m3 = "0" + m3;
    }
    var m4 = parseInt(cuar.getMonth()) + 1;
    if (m4.toString().length == 1) {
        m4 = "0" + m4;
    }
    var m5 = parseInt(quin.getMonth()) + 1;
    if (m5.toString().length == 1) {
        m5 = "0" + m5;
    }
    var m6 = parseInt(sex.getMonth()) + 1;
    if (m6.toString().length == 1) {
        m6 = "0" + m6;
    }
    var m7 = parseInt(ultimo.getMonth()) + 1;
    if (m7.toString().length == 1) {
        m7 = "0" + m7;
    }
    var m_anterior = parseInt(anterior.getMonth()) + 1;
    if (m_anterior.toString().length == 1) {
        m_anterior = "0" + m_anterior;
    }
    var m_siguiente = parseInt(siguiente.getMonth()) + 1;
    if (m_siguiente.toString().length == 1) {
        m_siguiente = "0" + m_siguiente;
    }
    var d1 = primer.getDate();
    if (d1.toString().length == 1) {
        d1 = "0" + d1;
    }
    var d2 = seg.getDate();
    if (d2.toString().length == 1) {
        d2 = "0" + d2;
    }
    var d3 = ter.getDate();
    if (d3.toString().length == 1) {
        d3 = "0" + d3;
    }
    var d4 = cuar.getDate();
    if (d4.toString().length == 1) {
        d4 = "0" + d4;
    }
    var d5 = quin.getDate();
    if (d5.toString().length == 1) {
        d5 = "0" + d5;
    }
    var d6 = sex.getDate();
    if (d6.toString().length == 1) {
        d6 = "0" + d6;
    }
    var d7 = ultimo.getDate();
    if (d7.toString().length == 1) {
        d7 = "0" + d7;
    }
    var r = [];

    r["0"] = year + "-" + m + "-" + d1;
    r["1"] = year + "-" + m2 + "-" + d2;
    r["2"] = year + "-" + m3 + "-" + d3;
    r["3"] = year + "-" + m4 + "-" + d4;
    r["4"] = year + "-" + m5 + "-" + d5;
    r["5"] = year + "-" + m6 + "-" + d6;
    r["6"] = year + "-" + m7 + "-" + d7;
    r["-1"] = year + "-" + m_anterior + "-" + anterior.getDate();
    r["-2"] = year + "-" + m_siguiente + "-" + siguiente.getDate();

    console.log(week);
    if (week >= 2 && year == 2020) {
        d1 = parseInt(d1) - 1;
        if (d1.toString().length == 1) {
            d1 = "0" + d1;
        }
        d2 = parseInt(d2) - 1;
        if (d2.toString().length == 1) {
            d2 = "0" + d2;
        }
        d3 = parseInt(d3) - 1;
        if (d3.toString().length == 1) {
            d3 = "0" + d3;
        }
        d4 = parseInt(d4) - 1;
        if (d4.toString().length == 1) {
            d4 = "0" + d4;
        }
        d5 = parseInt(d5) - 1;
        if (d5.toString().length == 1) {
            d5 = "0" + d5;
        }
        d6 = parseInt(d6) - 1;
        if (d6.toString().length == 1) {
            d6 = "0" + d6;
        }
        d7 = parseInt(d7) - 1;
        if (d7.toString().length == 1) {
            d7 = "0" + d7;
        }
        var r = [];
        if (week == 5 && year == 2020) {
            m5 = "01";
            d5 = "31";
        }
        if (week == 9 && year == 2020) {
            m6 = "02";
            d6 = "29";
        }
        r["0"] = year + "-" + m + "-" + d1;
        r["1"] = year + "-" + m2 + "-" + d2;
        r["2"] = year + "-" + m3 + "-" + d3;
        r["3"] = year + "-" + m4 + "-" + d4;
        r["4"] = year + "-" + m5 + "-" + d5;
        r["5"] = year + "-" + m6 + "-" + d6;
        r["6"] = year + "-" + m7 + "-" + d7;
        r["-1"] = year + "-" + m_anterior + "-" + anterior.getDate();
        r["-2"] = year + "-" + m_siguiente + "-" + siguiente.getDate();
    }

    if (week == 1 && year == 2019) {
        r["0"] = year + "-" + m + "-" + "30";
        r["1"] = year + "-" + "12" + "-" + "31";
        r["2"] = year + "-" + m3 + "-" + "01";
        r["3"] = year + "-" + m4 + "-" + "02";
        r["4"] = year + "-" + m5 + "-" + "03";
        r["5"] = year + "-" + m6 + "-" + "04";
        r["6"] = year + "-" + m7 + "-" + "05";
        r["-1"] = year + "-" + m_anterior + "-" + anterior.getDate();
        r["-2"] = year + "-" + m_siguiente + "-" + siguiente.getDate();
    }
    return r;
}
function calculaSemanaByDate(date) {
    if (date == undefined || !evalueData(date)) {
        date = getFechaHoraActual();
    }
    var r = [];
    var ONE_DAY_IN_MILLIS = 1000 * 60 * 60 * 24;
    var curr = new Date(date);
    /*
     Trae el primer día de la semana
     Nota: Dependiendo de la zona horaria, 0 puede ser domingo o lunes.
     */
    var offset = curr.getDay() * ONE_DAY_IN_MILLIS;

    /*
     Fecha al comienzo de la semana; tenga en cuenta que las horas, minutos y segundos son! = 0
     */
    var start = new Date(curr.getTime() - offset);
    for (var i = 0; i < 9; i++) {
        var nextDay = new Date(start.getTime() + (i * ONE_DAY_IN_MILLIS));
        r.push(nextDay);
    }
    return r;
}


function PadLeft(value, length) {
    return (value.toString().length < length) ? PadLeft("0" + value, length) :
            value;
}

function calculaSemanaByWeek(week, year) {
    if (week < 1 || week > 53) {
        alert("Error: la semana debe ser un nÃºmero entre 1 y 53");
        return false;
    }
    var meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    var dias = ["Domingo", "Lunes", "Martes", "MiÃ©rcoles", "Jueves", "Viernes", "SÃ¡bado"];

    /*
     var anterior = new Date(year, 0, (week - 1) * 7 + 1);
     var primer = new Date(year, 0, (week - 1) * 7 + 2);
     var seg = new Date(year, 0, (week - 1) * 7 + 3);
     var ter = new Date(year, 0, (week - 1) * 7 + 4);
     var cuar = new Date(year, 0, (week - 1) * 7 + 5);
     var quin = new Date(year, 0, (week - 1) * 7 + 6);
     var sex = new Date(year, 0, (week - 1) * 7 + 7);
     var ultimo = new Date(year, 0, (week - 1) * 7 + 8);
     var siguiente = new Date(year, 0, (week - 1) * 7 + 9);
     */
    var anterior = new Date(year, 0, (week - 1) * 7 - 1);
    var primer = new Date(year, 0, (week - 1) * 7 + 0);
    var seg = new Date(year, 0, (week - 1) * 7 + 1);
    var ter = new Date(year, 0, (week - 1) * 7 + 2);
    var cuar = new Date(year, 0, (week - 1) * 7 + 3);
    var quin = new Date(year, 0, (week - 1) * 7 + 4);
    var sex = new Date(year, 0, (week - 1) * 7 + 5);
    var ultimo = new Date(year, 0, (week - 1) * 7 + 6);
    var siguiente = new Date(year, 0, (week - 1) * 7 + 7);
    var m = parseInt(primer.getMonth()) + 1;
    if (m.toString().length == 1) {
        m = "0" + m;
    }
    var m2 = parseInt(seg.getMonth()) + 1;
    if (m2.toString().length == 1) {
        m2 = "0" + m2;
    }
    var m3 = parseInt(ter.getMonth()) + 1;
    if (m3.toString().length == 1) {
        m3 = "0" + m3;
    }
    var m4 = parseInt(cuar.getMonth()) + 1;
    if (m4.toString().length == 1) {
        m4 = "0" + m4;
    }
    var m5 = parseInt(quin.getMonth()) + 1;
    if (m5.toString().length == 1) {
        m5 = "0" + m5;
    }
    var m6 = parseInt(sex.getMonth()) + 1;
    if (m6.toString().length == 1) {
        m6 = "0" + m6;
    }
    var m7 = parseInt(ultimo.getMonth()) + 1;
    if (m7.toString().length == 1) {
        m7 = "0" + m7;
    }
    var m_anterior = parseInt(anterior.getMonth()) + 1;
    if (m_anterior.toString().length == 1) {
        m_anterior = "0" + m_anterior;
    }
    var m_siguiente = parseInt(siguiente.getMonth()) + 1;
    if (m_siguiente.toString().length == 1) {
        m_siguiente = "0" + m_siguiente;
    }
    var d1 = primer.getDate();
    if (d1.toString().length == 1) {
        d1 = "0" + d1;
    }
    var d2 = seg.getDate();
    if (d2.toString().length == 1) {
        d2 = "0" + d2;
    }
    var d3 = ter.getDate();
    if (d3.toString().length == 1) {
        d3 = "0" + d3;
    }
    var d4 = cuar.getDate();
    if (d4.toString().length == 1) {
        d4 = "0" + d4;
    }
    var d5 = quin.getDate();
    if (d5.toString().length == 1) {
        d5 = "0" + d5;
    }
    var d6 = sex.getDate();
    if (d6.toString().length == 1) {
        d6 = "0" + d6;
    }
    var d7 = ultimo.getDate();
    if (d7.toString().length == 1) {
        d7 = "0" + d7;
    }
    var r = [];
    r["0"] = year + "-" + m + "-" + d1;
    r["1"] = year + "-" + m2 + "-" + d2;
    r["2"] = year + "-" + m3 + "-" + d3;
    r["3"] = year + "-" + m4 + "-" + d4;
    r["4"] = year + "-" + m5 + "-" + d5;
    r["5"] = year + "-" + m6 + "-" + d6;
    r["6"] = year + "-" + m7 + "-" + d7;
    r["-1"] = year + "-" + m_anterior + "-" + anterior.getDate();
    r["-2"] = year + "-" + m_siguiente + "-" + siguiente.getDate();
    return r;
}


function openLoginNw() {
    $.ajax({
        url: "/nwlib6/nwproject/modules/nw_user_session/src/info_cliente/login_nws.php",
        type: 'post',
        error: function () {
            console.log("La operación no pudo ser procesada. Inténtelo de nuevo. ");
        },
        success: function (data) {
            $("body").css("overflow", "hidden");
            nw_dialog(data, null, null, {"width": 400});
        }
    });
}
function openFormCrearCuenta() {
    var con = getConfigPage();
    $.ajax({
        url: "/nwlib6/nwproject/modules/nw_user_session/src/info_cliente/crearcuenta_nws.php",
        type: 'post',
        data: con,
        error: function () {
            console.log("La operación no pudo ser procesada. Inténtelo de nuevo. ")
        },
        success: function (data) {
            nw_dialog(data);
            $(".lnk_crear_account").click(function () {
                comprobarFormRegistro();
            });
        }
    });
}
function cleanUrl() {
    var url_sites = $("#contenedor").attr("data-site");
    history.pushState(null, "", "/" + url_sites);
    window.location.reload();
}


/*                                      SACA LA DIRECCIÓN DE LA LATITUD Y LONGITUD                                */
if (typeof funcGeo == "undefined")
    funcGeo = null;
function getGeo(funcGeoAuto) {
    if (funcGeoAuto != undefined) {
        funcGeo = funcGeoAuto;
    }
    if (navigator && navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(geoOK, geoKO);
    } else {
        geoMaxmind();
    }
}

function geoOK(position) {
    showLatLong(position.coords.latitude, position.coords.longitude);
}
function geoMaxmind() {
    showLatLong(geoip_latitude(), geoip_longitude());
}

function geoKO(err) {
    if (err.code == 1) {
        error('El usuario ha denegado el permiso para obtener informacion de ubicacion.');
    } else if (err.code == 2) {
        error('Tu ubicacion no se puede determinar.');
    } else if (err.code == 3) {
        error('TimeOut.');
    } else {
        error('No sabemos que pasó pero ocurrio un error.');
    }
}

function showLatLong(lat, longi) {
    var geocoder = new google.maps.Geocoder();
    var yourLocation = new google.maps.LatLng(lat, longi);
    geocoder.geocode({'latLng': yourLocation}, processGeocoder);
}
function processGeocoder(results, status) {
    if (status == google.maps.GeocoderStatus.OK) {
        if (results[0]) {
            var address = results[0].formatted_address;
            if (funcGeo != null && funcGeo != undefined) {
                window[funcGeo](results);
            }
        } else {
            error('Google no retorno resultado alguno.');
        }
    } else {
        error("Geocoding fallo debido a : " + status);
    }
    removeLoadingNw("fast");
}
function error(msg) {
    console.log(msg);
}

function noSubmitForm(self) {
    $(self + ' #nwform').submit(function () {
        return false;
    });
}

function resetForm(classOrId) {
    $(':input', classOrId)
            .not(':button, :submit, :reset, :hidden')
            .val('')
            .removeAttr('checked')
            .removeAttr('selected');
    $(".showImage").html(" ");
    var d = $(':input', classOrId);
    var t = d.length;
    for (var i = 0; i < t; i++) {
        var ta = $(d[i]);
        var type = ta.attr("type");
        var typenwmaker = ta.attr("typenwmaker");
        if (typenwmaker == "file") {
            ta.val('');
        }
    }
}

function cleanForm(self) {
    resetForm(self);
    var array = getRecordNwForm(self);
    $.each(array, function (key, value) {
        cleanField(self, key);
    });
}
function setRecordClean(self, array) {
    if (array == undefined) {
        return false;
    }
    if (self == ".containFormNw") {
        self = ".containFormFields";
    }
    $.each(array, function (key, value) {
        if (evalueData(value)) {
            cleanField(self, key);
        }
    });
}

function cleanField(self, field) {
    var f = null;
    var fclass = "." + field;
    var d = document.querySelector("." + field);
    if (d) {
        f = d;
    }
    var d = document.querySelector(".inputradiobuttonnwf_" + field);
    if (d) {
        f = d;
        fclass = ".inputradiobuttonnwf_" + field;
    }
    if (!f) {
        return false;
    }
    var mode = f.tagName;
    var type = f.getAttribute("type");
    var ele = f;
    for (var i = 0; i < ele.length; i++) {
        ele[i].checked = false;
    }
    remove(self + " .imgshownwmaker");
    $(':input', self + " " + fclass).not(':button, :submit, :reset, :hidden').val('').removeAttr('checked').removeAttr('selected');
    setValue(self, fclass.replace(".", ""), "");
    return true;
}

function submitForm(div) {
    $(div).submit();
}

function getFormPayu(div, data, callBack) {
    var buttonVisible = true;

    if (data.valor == undefined) {
        nw_dialog("El valor no puede ser nulo");
        return false;
    }

    if (data.buttonVisible != undefined) {
        buttonVisible = data.buttonVisible;
    }

    var dataPayu = {};
    dataPayu["valor"] = data.valor;

    if (data.referencia != undefined) {
        dataPayu["referencia"] = data.referencia;
    }

    if (data.cliente_nombre != undefined) {
        dataPayu["cliente_nombre"] = data.cliente_nombre;
    }

    if (data.id_cuenta != undefined) {
        dataPayu["id_cuenta"] = data.id_cuenta;
    }

    if (data.factura_crear_pago != undefined) {
        dataPayu["factura_crear_pago"] = data.factura_crear_pago;
    }

    if (data.session != undefined) {
        dataPayu["session"] = data.session;
    }

    var rpc = {};
    rpc["service"] = "nwprojectOut";
    rpc["method"] = "getFormPayu";
    rpc["data"] = dataPayu;
    var funcpay = function (r) {
        $("#form_payu").remove();
        var payu = "";
        if (buttonVisible == true) {
            payu += r;
        } else {
            payu += "<div style='display: none;' >";
            payu += r;
            payu += "</div>";
        }
        if (data.appendInDiv != undefined) {
            $(div).append(payu);
        } else {
            addFooterNote(div, payu);
        }
        if (typeof callBack != "undefined") {
            callBack(r);
        }

    };
    rpcNw("rpcNw", rpc, funcpay);
}
function LlamarCiudades() {
    var data = {};
    data["depto"] = $("#deptosGeo").val();
    data["id_citie"] = "0";
    data["only_options"] = true;
    var rpc = {};
    rpc["service"] = "nwprojectOut";
    rpc["method"] = "ciudades";
    rpc["data"] = data;
    var funcpay = function (r) {
        $('#ciudad').empty();
        $('#ciudad').append(r);
    };
    rpcNw("rpcNw", rpc, funcpay);

}


function pointInPoligono(poligonos, pointX, pointY) {
    var path = [];
    if (poligonos != false) {
        for (var i = 0; i < poligonos.length; i++) {
            var x = parseFloat(poligonos[i].x);
            var y = parseFloat(poligonos[i].y);
            path.push(new google.maps.LatLng(x, y));
        }
    }
    var cascadiaFault = new google.maps.Polygon({path: path});
    var status = google.maps.geometry.poly.containsLocation(pointX, cascadiaFault);
    console.log({
        status: status
    });
    return status;
}


divMap2 = null;
execFuncByGoogleMap2 = null;
dataFuncByGoogleMap2 = null;
containerGeoSuggestions = null;
function setContainerGeoSuggestions(div) {
    containerGeoSuggestions = div;
}
function ubicaEnMapaGoogle(address, divMap, func, dataFunc, divShow) {
    divMap2 = divMap;
    execFuncByGoogleMap2 = func;
    dataFuncByGoogleMap2 = dataFunc;
    if (evalueData(divShow)) {
        containerGeoSuggestions = divShow;
    }
    var geocoder = new google.maps.Geocoder();
    var d = geocoder.geocode({'address': address}, geocodeResult2);
    return d;
}

function geocodeResult2(results, status) {
    if (status == 'OK') {
        var html = "";
        if (containerGeoSuggestions == null) {
            html += "<div class='container-window-other-direction'><p>Confirma la dirección: </p>";
        } else {
            $(".ulothermap").remove();
        }
        html += "<ul class='ulothermap'>";
        for (var x = 0; x < results.length; x++) {
            html += "<li class='linkothermap linkothermap_" + x + "' data='" + results[x]["formatted_address"] + "' x='" + x + "' >" + results[x]["formatted_address"] + "</li>";
        }
        html += "</ul></div>";

        if (containerGeoSuggestions != null) {
            $("" + containerGeoSuggestions + "").append(html);
        } else {
            nw_dialog_func(html, "changeOtherDirRecomend", results);
        }
        $(".linkothermap").click(function () {
            $(".linkothermap").removeClass("dirNewSelected");
            $(this).addClass("dirNewSelected");
            changeOtherDirRecomend(results);
            if (containerGeoSuggestions != null) {
                $(".ulothermap").remove();
            }
        });
        return;
    } else {
    }
}

function removeAllPolyLines() {
    for (var i = 0; i < __polyGoogleMaps.length; i++) {
        __polyGoogleMaps[i].setMap(null);
    }
}

function removeAllMakersMap() {
    for (var i = 0; i < __markersGoogleMaps.length; i++) {
        removePointMap(__markersGoogleMaps[i]);
    }
}
function removeMakersMapByArray(array) {
    for (var i = 0; i < array.length; i++) {
        removePointMap(array[i]);
    }
}

function removePointMap(marker) {
    marker.setMap(null);
}

function latAndLngInfo(lat, lng, callBack) {
    var geocoder = new google.maps.Geocoder();
    var yourLocation = new google.maps.LatLng(lat, lng);
    geocoder.geocode({'latLng': yourLocation}, processGeocoderTest);

    function processGeocoderTest(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            var data = extraerDataResult(results);
            callBack(data);

        } else {
            error("Geocoding fallo debido a : " + status);
        }
    }
}

function extraerDataResult(results) {
    var data = {};
    var a = getDataResult(results);
    data.address_components = a;
    data["direccion"] = results[0].formatted_address;
    data["barrio"] = a.neighborhood;
    data["localidad"] = a.sublocality;
    data["ciudad"] = a.locality;
    data["pais"] = a.country;
    data.allData = results;
    return data;
}

function dragMarkerMap(map, marker, callBack, manageData) {
    google.maps.event.addListener(marker, 'dragend', function () {
        openInfoWindowMakerMap(map, marker, callBack, manageData);
    });
}

function openInfoWindowMakerMap(map, marker, callBack, manageData) {
    var markerLatLng = marker.getPosition();
    latAndLngInfo(markerLatLng.lat(), markerLatLng.lng(), function (h) {
        var r = h;
        r.lat = markerLatLng.lat();
        r.latitud = markerLatLng.lat();
        r.lng = markerLatLng.lng();
        r.longitud = markerLatLng.lng();
        if (manageData != true) {
            infoWindowMakerMap.setContent(h.direccion);
            infoWindowMakerMap.open(map, marker);
        }
        callBack(r);
    });
}

function pintarRutaGoogleMap(map, array, overview_polyline) {
    if (evalueData(overview_polyline)) {
        var encodedPoints = overview_polyline;
        var decodedPoints = google.maps.geometry.encoding.decodePath(encodedPoints);
        var encodedPolyline = new google.maps.Polyline({
            strokeColor: "#970E04",
            strokeOpacity: 1.0,
            strokeWeight: 2,
            path: decodedPoints,
            clickable: true
        });
        __polyGoogleMaps.push(encodedPolyline);
        encodedPolyline.setMap(map);
        return encodedPolyline;
    } else {
        var flightPlanCoordinates = array;
        var flightPath = new google.maps.Polyline({
            path: flightPlanCoordinates,
            geodesic: true,
            strokeColor: '#FF0000',
            strokeOpacity: 1.0,
            strokeWeight: 3
        });
        return flightPath.setMap(map);
    }
}

function changeOtherDirRecomend(results) {
    var address = $(".dirNewSelected").attr("data");
    var x = $(".dirNewSelected").attr("x");
    var data = results[x].geometry.location;
    if (typeof changeDirectionMap != "undefined") {
        changeDirectionMap(address);
    } else {
        alert("Mensaje para developers: Este widget le devuelve la nueva dirección a una función que debe crear con el nombre de changeDirectionMap y recibe los datos, ej: changeDirectionMap(data) ");
    }
    var mapOptions = {
        center: results[x].geometry.location,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    if (divMap2 == null) {
    } else {
        map = divMap2;
    }
    if (divMap2 != null) {
        map.fitBounds(results[x].geometry.viewport);
        var markerOptions = {
            position: results[x].geometry.location
        };
        var marker = new google.maps.Marker(markerOptions);
        marker.setMap(map);
    }
    if (typeof execFuncByGoogleMap2 != "undefined") {
        if (execFuncByGoogleMap2 != null) {
            var r = {};
            r.latitud = data.lat();
            r.longitud = data.lng();
            r.allData = results;
            r.address_components = getDataResult(results);
            var dt = false;
            if (dataFuncByGoogleMap2 != null) {
                dt = dataFuncByGoogleMap2;
            }
            window[execFuncByGoogleMap2](r, dt);
        }
    }
}

function getDataResult(results) {
    var re = results[0];
    var d = re.address_components;
    var total = d.length;
    var r = {};
    for (var i = 0; i < total; i++) {
        var x = d[i];
        var val = x.long_name;
        var t = x.types;
        for (var y = 0; y < t.length; y++) {
            var g = t[y];
            if (g == "political") {
                continue;
            }
            r[g] = val;
        }
    }
    if (typeof r.route != "undefined") {
        if (typeof r.route.split(" ")[0] != "undefined") {
            r.mode = r.route.split(" ")[0];
        }
        if (typeof r.route.split(" ")[1] != "undefined") {
            r.mode_number = r.route.split(" ")[1];
        }
    }
    if (results.length > 1) {
        var d = results[1].address_components;
        var total = d.length;
        for (var i = 0; i < total; i++) {
            var x = d[i];
            var val = x.long_name;
            var t = x.types;
            for (var y = 0; y < t.length; y++) {
                var g = t[y];
                if (typeof r.neighborhood == "undefined" && g == "neighborhood" || typeof r.sublocality == "undefined" && g == "sublocality" || typeof r.sublocality_level_1 == "undefined" && g == "sublocality_level_1") {
                    r[g] = val;
                }
            }
        }
    }
    return r;
}

googleMapGlobal = null;
/*                                                 CREATE MAP GOOGLEINIT                                        */
function createGoogleMap(lat, lng, width, height, divClass, zoom, style, mapaType) {
    if (width == undefined) {
        width = "100%";
    }
    if (height == undefined) {
        height = "100%";
    }
    if (lat == undefined || lat == null || lat == false) {
        lat = 4.681994480844155;
    }
    if (lng == undefined || lng == null || lng == false) {
        lng = -74.07651901245117;
    }
    if (typeof divClass === "undefined") {
        divClass = "#mapa";
    }
    if (!evalueData(zoom)) {
        zoom = 15;
    }
    var estilo = styleMapStandard();
    if (typeof style != "undefined") {
        estilo = style;
    }
    var maptyp = google.maps.MapTypeId.TERRAIN;
    if (typeof mapaType != "undefined") {
        maptyp = mapaType;
    }
    var map = new google.maps.Map(document.querySelector(divClass), {
        center: {lat: lat, lng: lng},
        zoom: zoom,
        mapTypeId: maptyp,
        draggable: true,
        scrollwheel: true,
        disableDefaultUI: true,
        /*cooperative:usa dos dedos, greedy:mueve siempre un dedo, none:no se mueve, auto: puede ser cooperative o greedy  */
        gestureHandling: 'auto',
        /* styleMapSilver styleMapBlueDark  styleMapRetro styleMapStandard */
        styles: estilo
    });
    $(divClass).css({"width": width, "height": height});

    infoWindowMakerMap = new google.maps.InfoWindow({
        zIndex: 0
    });

    googleMapGlobal = map;
    return map;
}

function Standard_places() {
    var d = [
        [
            {
                "stylers": [
                    {
                        "visibility": "on"
                    }
                ]
            },
            {
                "featureType": "administrative",
                "stylers": [
                    {
                        "visibility": "on"
                    }
                ]
            },
            {
                "featureType": "administrative",
                "elementType": "geometry",
                "stylers": [
                    {
                        "visibility": "on"
                    }
                ]
            },
            {
                "featureType": "administrative",
                "elementType": "geometry.fill",
                "stylers": [
                    {
                        "visibility": "on"
                    }
                ]
            },
            {
                "featureType": "administrative",
                "elementType": "geometry.stroke",
                "stylers": [
                    {
                        "visibility": "on"
                    }
                ]
            },
            {
                "featureType": "administrative",
                "elementType": "labels",
                "stylers": [
                    {
                        "visibility": "on"
                    }
                ]
            },
            {
                "featureType": "administrative",
                "elementType": "labels.text",
                "stylers": [
                    {
                        "visibility": "on"
                    }
                ]
            },
            {
                "featureType": "landscape",
                "stylers": [
                    {
                        "visibility": "on"
                    }
                ]
            },
            {
                "featureType": "poi",
                "stylers": [
                    {
                        "visibility": "on"
                    }
                ]
            },
            {
                "featureType": "poi",
                "elementType": "geometry.fill",
                "stylers": [
                    {
                        "visibility": "on"
                    }
                ]
            },
            {
                "featureType": "poi",
                "elementType": "geometry.stroke",
                "stylers": [
                    {
                        "visibility": "on"
                    }
                ]
            },
            {
                "featureType": "poi",
                "elementType": "labels.text",
                "stylers": [
                    {
                        "visibility": "on"
                    }
                ]
            },
            {
                "featureType": "poi",
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "visibility": "on"
                    }
                ]
            },
            {
                "featureType": "poi",
                "elementType": "labels.text.stroke",
                "stylers": [
                    {
                        "visibility": "on"
                    }
                ]
            },
            {
                "featureType": "poi.attraction",
                "stylers": [
                    {
                        "visibility": "on"
                    }
                ]
            },
            {
                "featureType": "poi.attraction",
                "elementType": "geometry.fill",
                "stylers": [
                    {
                        "visibility": "on"
                    }
                ]
            },
            {
                "featureType": "poi.attraction",
                "elementType": "geometry.stroke",
                "stylers": [
                    {
                        "visibility": "on"
                    }
                ]
            },
            {
                "featureType": "poi.attraction",
                "elementType": "labels.icon",
                "stylers": [
                    {
                        "visibility": "on"
                    }
                ]
            },
            {
                "featureType": "poi.attraction",
                "elementType": "labels.text",
                "stylers": [
                    {
                        "visibility": "on"
                    }
                ]
            },
            {
                "featureType": "poi.attraction",
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "visibility": "on"
                    }
                ]
            },
            {
                "featureType": "poi.attraction",
                "elementType": "labels.text.stroke",
                "stylers": [
                    {
                        "visibility": "on"
                    }
                ]
            },
            {
                "featureType": "poi.business",
                "stylers": [
                    {
                        "visibility": "on"
                    }
                ]
            },
            {
                "featureType": "poi.government",
                "stylers": [
                    {
                        "visibility": "on"
                    }
                ]
            },
            {
                "featureType": "poi.medical",
                "stylers": [
                    {
                        "visibility": "on"
                    }
                ]
            },
            {
                "featureType": "poi.park",
                "stylers": [
                    {
                        "visibility": "on"
                    }
                ]
            },
            {
                "featureType": "road.highway",
                "stylers": [
                    {
                        "visibility": "on"
                    }
                ]
            },
            {
                "featureType": "road.highway",
                "elementType": "geometry.fill",
                "stylers": [
                    {
                        "visibility": "on"
                    }
                ]
            },
            {
                "featureType": "road.highway",
                "elementType": "geometry.stroke",
                "stylers": [
                    {
                        "visibility": "on"
                    }
                ]
            },
            {
                "featureType": "road.highway",
                "elementType": "labels.icon",
                "stylers": [
                    {
                        "visibility": "on"
                    }
                ]
            },
            {
                "featureType": "road.highway",
                "elementType": "labels.text",
                "stylers": [
                    {
                        "visibility": "on"
                    }
                ]
            },
            {
                "featureType": "road.highway",
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "visibility": "on"
                    }
                ]
            },
            {
                "featureType": "road.highway",
                "elementType": "labels.text.stroke",
                "stylers": [
                    {
                        "visibility": "on"
                    }
                ]
            },
            {
                "featureType": "road.highway.controlled_access",
                "stylers": [
                    {
                        "visibility": "on"
                    }
                ]
            },
            {
                "featureType": "road.highway.controlled_access",
                "elementType": "geometry",
                "stylers": [
                    {
                        "visibility": "on"
                    }
                ]
            },
            {
                "featureType": "road.highway.controlled_access",
                "elementType": "geometry.fill",
                "stylers": [
                    {
                        "visibility": "on"
                    }
                ]
            },
            {
                "featureType": "road.highway.controlled_access",
                "elementType": "geometry.stroke",
                "stylers": [
                    {
                        "visibility": "on"
                    }
                ]
            },
            {
                "featureType": "road.highway.controlled_access",
                "elementType": "labels",
                "stylers": [
                    {
                        "visibility": "on"
                    }
                ]
            },
            {
                "featureType": "road.highway.controlled_access",
                "elementType": "labels.icon",
                "stylers": [
                    {
                        "visibility": "on"
                    }
                ]
            },
            {
                "featureType": "road.highway.controlled_access",
                "elementType": "labels.text",
                "stylers": [
                    {
                        "visibility": "on"
                    }
                ]
            },
            {
                "featureType": "road.highway.controlled_access",
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "visibility": "on"
                    }
                ]
            },
            {
                "featureType": "road.highway.controlled_access",
                "elementType": "labels.text.stroke",
                "stylers": [
                    {
                        "visibility": "on"
                    }
                ]
            },
            {
                "featureType": "road.local",
                "stylers": [
                    {
                        "visibility": "on"
                    }
                ]
            },
            {
                "featureType": "road.local",
                "elementType": "geometry",
                "stylers": [
                    {
                        "visibility": "on"
                    }
                ]
            },
            {
                "featureType": "road.local",
                "elementType": "geometry.fill",
                "stylers": [
                    {
                        "visibility": "on"
                    }
                ]
            },
            {
                "featureType": "road.local",
                "elementType": "geometry.stroke",
                "stylers": [
                    {
                        "visibility": "on"
                    }
                ]
            },
            {
                "featureType": "road.local",
                "elementType": "labels",
                "stylers": [
                    {
                        "visibility": "on"
                    }
                ]
            },
            {
                "featureType": "road.local",
                "elementType": "labels.icon",
                "stylers": [
                    {
                        "visibility": "on"
                    }
                ]
            },
            {
                "featureType": "road.local",
                "elementType": "labels.text",
                "stylers": [
                    {
                        "visibility": "on"
                    }
                ]
            },
            {
                "featureType": "road.local",
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "visibility": "on"
                    }
                ]
            },
            {
                "featureType": "road.local",
                "elementType": "labels.text.stroke",
                "stylers": [
                    {
                        "visibility": "on"
                    }
                ]
            }
        ]
    ];
    return d;
}

function styleMapStandard() {
    var d = [
        {
            "featureType": "administrative",
            "elementType": "geometry",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "featureType": "poi",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "featureType": "road",
            "elementType": "labels.icon",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "featureType": "transit",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        }
    ];
    return d;
}
function styleMapSilver() {
    var d = [
        {
            "elementType": "geometry",
            "stylers": [
                {
                    "color": "#f5f5f5"
                }
            ]
        },
        {
            "elementType": "labels.icon",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "elementType": "labels.text.fill",
            "stylers": [
                {
                    "color": "#616161"
                }
            ]
        },
        {
            "elementType": "labels.text.stroke",
            "stylers": [
                {
                    "color": "#f5f5f5"
                }
            ]
        },
        {
            "featureType": "administrative.land_parcel",
            "elementType": "labels.text.fill",
            "stylers": [
                {
                    "color": "#bdbdbd"
                }
            ]
        },
        {
            "featureType": "poi",
            "elementType": "geometry",
            "stylers": [
                {
                    "color": "#eeeeee"
                }
            ]
        },
        {
            "featureType": "poi",
            "elementType": "labels.text.fill",
            "stylers": [
                {
                    "color": "#757575"
                }
            ]
        },
        {
            "featureType": "poi.business",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "featureType": "poi.park",
            "elementType": "geometry",
            "stylers": [
                {
                    "color": "#e5e5e5"
                }
            ]
        },
        {
            "featureType": "poi.park",
            "elementType": "labels.text",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "featureType": "poi.park",
            "elementType": "labels.text.fill",
            "stylers": [
                {
                    "color": "#9e9e9e"
                }
            ]
        },
        {
            "featureType": "road",
            "elementType": "geometry",
            "stylers": [
                {
                    "color": "#ffffff"
                }
            ]
        },
        {
            "featureType": "road.arterial",
            "elementType": "labels.text.fill",
            "stylers": [
                {
                    "color": "#757575"
                }
            ]
        },
        {
            "featureType": "road.highway",
            "elementType": "geometry",
            "stylers": [
                {
                    "color": "#dadada"
                }
            ]
        },
        {
            "featureType": "road.highway",
            "elementType": "labels.text.fill",
            "stylers": [
                {
                    "color": "#616161"
                }
            ]
        },
        {
            "featureType": "road.local",
            "elementType": "labels.text.fill",
            "stylers": [
                {
                    "color": "#9e9e9e"
                }
            ]
        },
        {
            "featureType": "transit.line",
            "elementType": "geometry",
            "stylers": [
                {
                    "color": "#e5e5e5"
                }
            ]
        },
        {
            "featureType": "transit.station",
            "elementType": "geometry",
            "stylers": [
                {
                    "color": "#eeeeee"
                }
            ]
        },
        {
            "featureType": "water",
            "elementType": "geometry",
            "stylers": [
                {
                    "color": "#c9c9c9"
                }
            ]
        },
        {
            "featureType": "water",
            "elementType": "labels.text.fill",
            "stylers": [
                {
                    "color": "#9e9e9e"
                }
            ]
        }
    ];
    return d;
}
function styleMapBlueDark() {
    var d = [
        {elementType: 'geometry', stylers: [{color: '#242f3e'}]},
        {elementType: 'labels.text.stroke', stylers: [{color: '#242f3e'}]},
        {elementType: 'labels.text.fill', stylers: [{color: '#746855'}]},
        {
            featureType: 'administrative.locality',
            elementType: 'labels.text.fill',
            stylers: [{color: '#d59563'}]
        },
        {
            featureType: 'poi',
            elementType: 'labels.text.fill',
            stylers: [{color: '#d59563'}]
        },
        {
            featureType: 'poi.park',
            elementType: 'geometry',
            stylers: [{color: '#263c3f'}]
        },
        {
            featureType: 'poi.park',
            elementType: 'labels.text.fill',
            stylers: [{color: '#6b9a76'}]
        },
        {
            featureType: 'road',
            elementType: 'geometry',
            stylers: [{color: '#38414e'}]
        },
        {
            featureType: 'road',
            elementType: 'geometry.stroke',
            stylers: [{color: '#212a37'}]
        },
        {
            featureType: 'road',
            elementType: 'labels.text.fill',
            stylers: [{color: '#9ca5b3'}]
        },
        {
            featureType: 'road.highway',
            elementType: 'geometry',
            stylers: [{color: '#746855'}]
        },
        {
            featureType: 'road.highway',
            elementType: 'geometry.stroke',
            stylers: [{color: '#1f2835'}]
        },
        {
            featureType: 'road.highway',
            elementType: 'labels.text.fill',
            stylers: [{color: '#f3d19c'}]
        },
        {
            featureType: 'transit',
            elementType: 'geometry',
            stylers: [{color: '#2f3948'}]
        },
        {
            featureType: 'transit.station',
            elementType: 'labels.text.fill',
            stylers: [{color: '#d59563'}]
        },
        {
            featureType: 'water',
            elementType: 'geometry',
            stylers: [{color: '#17263c'}]
        },
        {
            featureType: 'water',
            elementType: 'labels.text.fill',
            stylers: [{color: '#515c6d'}]
        },
        {
            featureType: 'water',
            elementType: 'labels.text.stroke',
            stylers: [{color: '#17263c'}]
        }
    ];
    return d;
}

function styleMapRetro() {
    var d = [
        {
            "elementType": "geometry",
            "stylers": [
                {
                    "color": "#ebe3cd"
                }
            ]
        },
        {
            "elementType": "labels.text.fill",
            "stylers": [
                {
                    "color": "#523735"
                }
            ]
        },
        {
            "elementType": "labels.text.stroke",
            "stylers": [
                {
                    "color": "#f5f1e6"
                }
            ]
        },
        {
            "featureType": "administrative",
            "elementType": "geometry.stroke",
            "stylers": [
                {
                    "color": "#c9b2a6"
                }
            ]
        },
        {
            "featureType": "administrative.land_parcel",
            "elementType": "geometry.stroke",
            "stylers": [
                {
                    "color": "#dcd2be"
                }
            ]
        },
        {
            "featureType": "administrative.land_parcel",
            "elementType": "labels.text.fill",
            "stylers": [
                {
                    "color": "#ae9e90"
                }
            ]
        },
        {
            "featureType": "landscape.natural",
            "elementType": "geometry",
            "stylers": [
                {
                    "color": "#dfd2ae"
                }
            ]
        },
        {
            "featureType": "poi",
            "elementType": "geometry",
            "stylers": [
                {
                    "color": "#dfd2ae"
                }
            ]
        },
        {
            "featureType": "poi",
            "elementType": "labels.text.fill",
            "stylers": [
                {
                    "color": "#93817c"
                }
            ]
        },
        {
            "featureType": "poi.business",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "featureType": "poi.park",
            "elementType": "geometry.fill",
            "stylers": [
                {
                    "color": "#a5b076"
                }
            ]
        },
        {
            "featureType": "poi.park",
            "elementType": "labels.text",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "featureType": "poi.park",
            "elementType": "labels.text.fill",
            "stylers": [
                {
                    "color": "#447530"
                }
            ]
        },
        {
            "featureType": "road",
            "elementType": "geometry",
            "stylers": [
                {
                    "color": "#f5f1e6"
                }
            ]
        },
        {
            "featureType": "road.arterial",
            "elementType": "geometry",
            "stylers": [
                {
                    "color": "#fdfcf8"
                }
            ]
        },
        {
            "featureType": "road.highway",
            "elementType": "geometry",
            "stylers": [
                {
                    "color": "#f8c967"
                }
            ]
        },
        {
            "featureType": "road.highway",
            "elementType": "geometry.stroke",
            "stylers": [
                {
                    "color": "#e9bc62"
                }
            ]
        },
        {
            "featureType": "road.highway.controlled_access",
            "elementType": "geometry",
            "stylers": [
                {
                    "color": "#e98d58"
                }
            ]
        },
        {
            "featureType": "road.highway.controlled_access",
            "elementType": "geometry.stroke",
            "stylers": [
                {
                    "color": "#db8555"
                }
            ]
        },
        {
            "featureType": "road.local",
            "elementType": "labels.text.fill",
            "stylers": [
                {
                    "color": "#806b63"
                }
            ]
        },
        {
            "featureType": "transit.line",
            "elementType": "geometry",
            "stylers": [
                {
                    "color": "#dfd2ae"
                }
            ]
        },
        {
            "featureType": "transit.line",
            "elementType": "labels.text.fill",
            "stylers": [
                {
                    "color": "#8f7d77"
                }
            ]
        },
        {
            "featureType": "transit.line",
            "elementType": "labels.text.stroke",
            "stylers": [
                {
                    "color": "#ebe3cd"
                }
            ]
        },
        {
            "featureType": "transit.station",
            "elementType": "geometry",
            "stylers": [
                {
                    "color": "#dfd2ae"
                }
            ]
        },
        {
            "featureType": "water",
            "elementType": "geometry.fill",
            "stylers": [
                {
                    "color": "#b9d3c2"
                }
            ]
        },
        {
            "featureType": "water",
            "elementType": "labels.text.fill",
            "stylers": [
                {
                    "color": "#92998d"
                }
            ]
        }
    ];
    return d;
}

/*                                  CREATE MAP GOOGLEINIT                     */
var map3 = null;
function addMarkerMapByAddress(address, map) {
    map3 = map;
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode({'address': address}, geocodeResult3);
}
function geocodeResult3(results, status) {
    if (status == 'OK') {
        var data = results[0].geometry.location;
        var x = data.lat();
        var y = data.lng();
        return addMarkerMap(map3, x, y);
    }
}
function addMarkerMap(map, x, y) {
    return addPointInGoogleMap(map, x, y);
}
function addPointInGoogleMap(map, x, y, icon, draggable, title, zoom) {
    var image = '';
    if (evalueData(icon)) {
        image = icon;
    }
    if (typeof draggable == "undefined") {
        draggable = true;
    }
    if (!evalueData(title)) {
        title = "Info";
    }
    if (!evalueData(zoom)) {
        zoom = 12;
    }
    var myLatLng = {lat: x, lng: y};
    var marker = new google.maps.Marker({
        position: myLatLng,
        map: map,
        draggable: draggable,
        title: title,
        zoom: zoom,
        center: myLatLng,
        icon: image,
        animation: google.maps.Animation.DROP
                /* ,
                 label: "Hola"
                 */
    });
    __markersGoogleMaps.push(marker);
    return marker;
}

function centerMarkersInMap(map, marker1, marker2) {
    var bounds = new google.maps.LatLngBounds();
    bounds.extend(marker1.position);
    if (evalueData(marker2)) {
        bounds.extend(marker2.position);
    }
    map.fitBounds(bounds);
}

/*                             SHOW POLIGONOS INIT                                                */
function showPoligonoMap(map, triangleCoords, showcoordenadas) {
    if (showcoordenadas != undefined && showcoordenadas != "") {
        showcoordenadas = true;
    }
    maped = null;
    infoWindow = null;
    var bermudaTriangleShow = new google.maps.Polygon({
        paths: triangleCoords,
        strokeColor: '#FF0000',
        strokeOpacity: 0.8,
        strokeWeight: 3,
        fillColor: '#FF0000',
        fillOpacity: 0.35
    });
    if (showcoordenadas != true) {
        bermudaTriangleShow.setMap(map);
        bermudaTriangleShow.addListener('click', showArrays);
        infoWindow = new google.maps.InfoWindow;
    }

    var bermudaTriangle = new google.maps.Polygon({paths: triangleCoords});

    google.maps.event.addListener(map, 'click', function (e) {

        var o = e.latLng;
        pointInPoligono(bermudaTriangle, o);

        var status = google.maps.geometry.poly.containsLocation(o, bermudaTriangle);
        console.log({
            statusdos: status
        });

        var resultColor = google.maps.geometry.poly.containsLocation(o, bermudaTriangle) ? 'red' : 'green';

        new google.maps.Marker({
            position: e.latLng,
            map: map,
            icon: {
                path: google.maps.SymbolPath.CIRCLE,
                fillColor: resultColor,
                fillOpacity: .2,
                strokeColor: 'white',
                strokeWeight: .5,
                scale: 6
            }
        });
    });

    return bermudaTriangleShow;

}

function showArrays(event) {
    var vertices = this.getPath();
    var contentString = '<b>Bermuda Triangle polygon</b><br>' +
            'Clicked location: <br>' + event.latLng.lat() + ',' + event.latLng.lng() +
            '<br>';
    for (var i = 0; i < vertices.getLength(); i++) {
        var xy = vertices.getAt(i);
        contentString += '<br>' + 'Coordinate ' + i + ':<br>' + xy.lat() + ',' +
                xy.lng();
    }
    infoWindow.setContent(contentString);
    infoWindow.setPosition(event.latLng);
    infoWindow.open(maped);
}
/*                                SHOW POLIGONOS END                          */


/*                                      CREA POLIGONOS INIT                                       */
function createPoligonosMaps(map) {
    var polyLineGoogle = new google.maps.Polyline({
        strokeColor: '#000000',
        strokeOpacity: 1,
        strokeWeight: 3,
        map: map
    });
    return polyLineGoogle;
}
function addLatLngToPoly(latLng, poly) {
    var path = poly.getPath();
    path.push(latLng);
    var encodeString = google.maps.geometry.encoding.encodePath(path);
    if (encodeString) {
        var myLatLng = latLng;
        var lat = myLatLng.lat();
        var lng = myLatLng.lng();
        var array = {};
        array["lat"] = lat;
        array["lng"] = lng;
        return array;
    }
}
/*                      CREA POLIGONOS END                                                  */

function setModal(self, resp) {
    if (resp === false) {
        $(".ui-widget-overlay").remove();
        $(".dialogBg_" + self.replace(".", "")).remove();
    }
}

function isMobile() {
    var device = navigator.userAgent;
    if (device.match(/Iphone/i) || device.match(/Ipod/i) || device.match(/Android/i) || device.match(/J2ME/i) || device.match(/BlackBerry/i) || device.match(/iPhone|iPad|iPod/i) || device.match(/Opera Mini/i) || device.match(/IEMobile/i) || device.match(/Mobile/i) || device.match(/Windows Phone/i) || device.match(/windows mobile/i) || device.match(/windows ce/i) || device.match(/webOS/i) || device.match(/palm/i) || device.match(/bada/i) || device.match(/series60/i) || device.match(/nokia/i) || device.match(/symbian/i) || device.match(/HTC/i))
    {
        return true;
    }
    return false;
}

function getDevice() {
    var isMobile = {
        Android: function () {
            return navigator.userAgent.match(/Android/i);
        },
        BlackBerry: function () {
            return navigator.userAgent.match(/BlackBerry/i);
        },
        iOS: function () {
            return navigator.userAgent.match(/iPhone|iPad|iPod/i);
        },
        Opera: function () {
            return navigator.userAgent.match(/Opera Mini/i);
        },
        Windows: function () {
            return navigator.userAgent.match(/IEMobile/i);
        },
        any: function () {
            return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
        }
    };
    var rta = false;
    var r = isMobile.any();
    if (r !== null) {
        rta = r;
    }
    return rta;
}

function getMobileOperatingSystem() {
    var userAgent = navigator.userAgent || navigator.vendor || window.opera;
    /*
     Windows Phone must come first because its UA also contains "Android"
     */
    if (/windows phone/i.test(userAgent)) {
        return "WINDOWS_PHONE";
    }
    if (/android/i.test(userAgent)) {
        return "ANDROID";
    }
    /*
     iOS detection from: http://stackoverflow.com/a/9039885/177710
     */
    if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
        return "IOS";
    }
    return "NONE";
}

function formato_numero(numero, decimales, separador_decimal, separador_miles) {
    numero = parseFloat(numero);
    if (isNaN(numero)) {
        return "";
    }
    if (decimales !== undefined) {
        numero = numero.toFixed(decimales);
    }
    numero = numero.toString().replace(".", separador_decimal !== undefined ? separador_decimal : ",");
    if (separador_miles) {
        var miles = new RegExp("(-?[0-9]+)([0-9]{3})");
        while (miles.test(numero)) {
            numero = numero.replace(miles, "$1" + separador_miles + "$2");
        }
    }
    return numero;
}

function formatearNumeroMoney(value) {
    var val = formatNumber.new(value, "$");
    return val;
}

var formatNumber = {
    separador: ".",
    sepDecimal: ',',
    formatear: function (num) {
        num += '';
        var splitStr = num.split('.');
        var splitLeft = splitStr[0];
        var splitRight = splitStr.length > 1 ? this.sepDecimal + splitStr[1] : '';
        var regx = /(\d+)(\d{3})/;
        while (regx.test(splitLeft)) {
            splitLeft = splitLeft.replace(regx, '$1' + this.separador + '$2');
        }
        return this.simbol + splitLeft + splitRight;
    },
    new : function (num, simbol) {
        this.simbol = simbol || '';
        return this.formatear(num);
    }
}

function textSeparateMilesKeyUp(donde, caracter) {
    var pat = /[\*,\+,\(,\),\?,\,$,\[,\],\^]/;
    var valor = donde.value;
    var largo = valor.length;
    var crtr = true;
    if (isNaN(caracter) || pat.test(caracter) == true) {
        if (pat.test(caracter) == true) {
            caracter = "" + caracter;
        }
        var carcter = new RegExp(caracter, "g");
        valor = valor.replace(carcter, "");
        donde.value = valor;
        crtr = false;
    } else {
        var nums = new Array();
        var cont = 0;
        for (var m = 0; m < largo; m++) {
            if (valor.charAt(m) == "." || valor.charAt(m) == " ")
            {
                continue;
            } else {
                nums[cont] = valor.charAt(m);
                cont++;
            }
        }
    }
    var cad1 = "";
    var cad2 = "";
    var tres = 0;
    if (largo > 3 && crtr == true) {
        for (var k = nums.length - 1; k >= 0; k--) {
            cad1 = nums[k];
            cad2 = cad1 + cad2;
            tres++;
            if ((tres % 3) == 0) {
                if (k != 0) {
                    cad2 = "." + cad2;
                }
            }
        }
        donde.value = cad2;
    }
}

function isset(d) {
    return evalueData(d);
}

function evalueData(d, exception) {
    if (typeof d == "undefined") {
        return false;
    }
    if (typeof exception !== "undefined") {
        if (d == exception) {
            return true;
        }
    }
    if (d == undefined) {
        return false;
    }
    if (d == null) {
        return false;
    }
    if (d == "null") {
        return false;
    }
    if (d === false) {
        return false;
    }
    if (d == "") {
        return false;
    }
    return true;
}

function isNotTrue(d) {
    if (d == undefined) {
        return true;
    }
    if (d == null) {
        return true;
    }
    if (d == false) {
        return true;
    }
    if (d == "") {
        return true;
    }
    return false;
}

function execAnyFunction(func, data) {
    window[func](data);
}
function getBoolean(string) {
    if (string == "false") {
        return false;
    }
    if (string == "falso") {
        return false;
    }
    if (string == false) {
        return false;
    }
    if (string == "0") {
        return false;
    }
    if (string == undefined) {
        return true;
    }
    if (string == "true") {
        return true;
    }
    if (string == "yes") {
        return true;
    }
    if (string == "si") {
        return true;
    }
    if (string == "1") {
        return true;
    }
    return true;
}

function loadInclude(file, module_nwproject) {

    var get = getGET();
    var data = {};
    data["file"] = file;
    data["get"] = get;
    if (evalueData(module_nwproject)) {
        data["module_nwproject"] = module_nwproject;
    }

    var rpc = {};
    rpc["service"] = "nwMaker";
    rpc["method"] = "loadInclude";
    rpc["data"] = data;
    var func = function (r) {
        if (r) {
            return r;
        } else {
            nw_dialog("A ocurrido un error: " + r);
        }
    };
    rpcNw("rpcNw", rpc, func);
}


function nwMakerByNwPMod(callback) {
    loadCss("/nwlib6/nwproject/modules/nw_user_session/nwmaker_css.php?nwproject=true");
    /*
     loadJs("/nwlib6/nwproject/modules/nw_user_session/js/jquery/fastclick.js");
     loadJs("/nwlib6/nwproject/modules/nw_user_session/js/jquery/datePicker.js");
     loadJs("/nwlib6/nwproject/modules/nw_user_session/js/home.js");
     loadJs("/nwlib6/nwproject/modules/nwforms/js/forms.js");
     loadJs("/nwlib6/nwproject/modules/nwforms/js/main.js");
     loadJs("/nwlib6/nwproject/modules/nw_user_session/js/jquery/jquery-ui.min.js");
     */

    loadJs("/nwlib6/nwproject/modules/nw_user_session/nwmaker_jsmaker.php?v=1&addtohomescreen=NO&getcompressringow=true", function () {
        activeButtonsNwMaker();
        if (evalueData(callback)) {
            callback();
        }
    }, false, true);
    return true;
}

function loginNwByLink() {
    loginNw(false, "popup");
}

function prepareNwLogin(callback) {
    verifySession(function (r) {
        var d = {};
        d.data_session = r;
        loadJs("/nwlib6/nwproject/modules/nw_user_session/js/nwmaker-login.js", function () {
            if (typeof nwm === "undefined") {
                loadCss("/nwlib6/nwproject/modules/nw_user_session/css/session.css");
                getConfigurationLogin(false, function () {
                    callback(d);
                });
            } else {
                var conf = nwm.getConfigLogin();
                if (typeof nwm.getConfigLogin().config_login !== "undefined") {
                    conf = nwm.getConfigLogin().config_login;
                }

                setConfigAppLogin(conf);
                callback(d);
            }
            newRemoveLoading("body");
        }, false, true);
    });
}

function loginNw(div, popup, otherdiv, mode) {
    var get = getGET();
    prepareNwLogin(function (r) {
        if (typeof r.data_session.usuario !== "undefined") {
            if (typeof get.createAccount != "undefined" || typeof get.login != "undefined" || typeof get.createLogin != "undefined") {
                window.location = "/";
                return false;
            }
            window.location.reload();
        } else {
            if (typeof div === "undefined") {
                div = "#container-nwmaker";
            }
            if (div !== false) {
                var divs = " <div class='containerInitSession' id='containerInitSession'>";
                divs += "  <div class='containlogoencduomaker'></div>";
                divs += "  <div class='bloqueInitSession bloqueInitSessionNew bloqueInitSession_login container-nwmaker-createlogin' id='container-nwmaker-createlogin'></div>";
                divs += "  <div class='bloqueInitSession bloqueInitSessionNew bloqueInitSession_createAccount container-nwmaker-createAccount' id='container-nwmaker-createAccount'></div>";
                divs += " </div>";
                $(div).html(divs);
                applyDesignLogin();
            }
            continueLoginNw(popup, otherdiv, mode);
        }
    });
}

function continueLoginNw(popup, otherdiv, mode) {
    var get = getGET();
    if (typeof get.createAccount !== "undefined" || mode === "createAccount") {
        createAccountNw(false, false, true);
    } else
    if (typeof get.loginUserOnly !== "undefined" || mode === "loginUserOnly") {
        if (otherdiv !== "undefined") {
            nwMakerAutenticUserOnly(otherdiv, popup, false, otherdiv);
        } else {
            nwMakerAutenticUserOnly(false, false, true);
        }
    } else
    if (typeof get.AuthenticUserNwMaker !== "undefined" || mode === "AuthenticUserNwMaker") {
        nwMakerCompletKeyUserOnly(false, false, true);
    } else {
        createNwMakerLogin(popup, otherdiv);
    }
}

function createAccountNwByLink() {
    loadCss("/nwlib6/nwproject/modules/nw_user_session/css/session.css");
    createAccountNw(false, "popup", true);
}
function createAccountNw(div, popup, initConfig, otherdiv) {
    if (typeof div == "undefined") {
        div = "#container-nwmaker";
    }
    var divs = " <div class='containerInitSession' id='containerInitSession'>";
    divs += "  <div class='bloqueInitSession bloqueInitSessionNew bloqueInitSession_createAccount' id='container-nwmaker-createAccount'></div>";
    divs += " </div>";
    $(div).html(divs);

    loadCss("/nwlib6/nwproject/modules/nw_user_session/css/session.css");
    loadJs("/nwlib6/nwproject/modules/nw_user_session/js/nwmaker-login.js");
    loadJs("/nwlib6/nwmaker/config_nwmaker.js");

    if (initConfig === true) {
        createNwMakerCreateAccount(popup, otherdiv);
    } else {
        getConfigurationLogin("out", function () {
            createNwMakerCreateAccount(popup, otherdiv);
        });
    }
}

function nwMakerAutenticUserOnly(div, popup, initConfig, otherdiv) {
    if (typeof div == "undefined") {
        div = "#container-nwmaker";
    }
    var divs = " <div class='containerInitSession' id='containerInitSession'>";
    divs += "  <div class='bloqueInitSession bloqueInitSessionNew bloqueInitSession_createAccount' id='container-nwmaker-createAccount'></div>";
    divs += " </div>";
    $(div).html(divs);
    loadCss("/nwlib6/nwproject/modules/nw_user_session/css/session.css");
    loadJs("/nwlib6/nwproject/modules/nw_user_session/js/nwmaker-login.js", function () {
        getConfigurationLogin(false, function () {
            createNwMakerAutenticUserOnly(popup, otherdiv);
        });
        newRemoveLoading("body");
    }, false, true);
}

function nwMakerCompletKeyUserOnly(div, popup, initConfig) {
    if (typeof div == "undefined") {
        div = "#container-nwmaker";
    }
    var divs = " <div class='containerInitSession' id='containerInitSession'>";
    divs += "  <div class='bloqueInitSession bloqueInitSessionNew bloqueInitSession_createAccount' id='container-nwmaker-createAccount'></div>";
    divs += " </div>";
    $(div).html(divs);
    loadCss("/nwlib6/nwproject/modules/nw_user_session/css/session.css");
    loadJs("/nwlib6/nwproject/modules/nw_user_session/js/nwmaker-login.js");
    getConfigurationLogin("out", function () {
        createNwMakerCompleteAutenticUserOnly(popup);
    });
    /*
     if (initConfig === true) {
     createNwMakerCompleteAutenticUserOnly(popup);
     } else {
     getConfigurationLogin("out", function () {
     createNwMakerCompleteAutenticUserOnly(popup);
     });
     }
     */
}

function getExtensionFile(archivo) {
    return (archivo.substring(archivo.lastIndexOf("."))).toLowerCase();
}

function getFileByType(file, mode, w) {
    if (evalueData(w) == false) {
        w = "200";
    }
    var extensiones_img = new Array(".gif", ".jpg", ".png", ".JPG", ".JPEG", ".jpeg", ".PNG", ".GIF");
    var extensiones_pdf = new Array(".pdf");
    var extensiones_excel = new Array(".xls", ".xlsx");
    var extensiones_word = new Array(".doc", ".docx");
    var ext = getExtensionFile(file);
    var extreate = false;
    var phpthumb = "/nwlib6/includes/phpthumb/phpThumb.php?src=";
    var phpthumbEnd = "&w=" + w + "&f=";
    if (mode == "nophpthumb") {
        phpthumb = "";
        phpthumbEnd = "";
    }
    for (var i = 0; i < extensiones_img.length; i++) {
        if (extensiones_img[i] == ext) {
            ext = ext.replace(".", "");
            if (phpthumbEnd == "") {
                ext = "";
            }
            file = phpthumb + file + phpthumbEnd + ext;
            extreate = true;
            break;
        }
    }
    for (var i = 0; i < extensiones_pdf.length; i++) {
        if (extensiones_pdf[i] == ext) {
            file = "/nwlib6/icons/48/pdf.png";
            extreate = true;
            break;
        }
    }
    for (var i = 0; i < extensiones_word.length; i++) {
        if (extensiones_word[i] == ext) {
            file = "/nwlib6/icons/48/word.png";
            extreate = true;
            break;
        }
    }
    for (var i = 0; i < extensiones_excel.length; i++) {
        if (extensiones_excel[i] == ext) {
            file = "/nwlib6/icons/48/excel.png";
            extreate = true;
            break;
        }
    }
    if (extreate === false) {
        file = "/nwlib6/icons/48/upload.png";
    }
    return file;
}

function openNwVideoChat(usuarioCliente, callVoice) {
    var voice = "";
    if (callVoice === true) {
        voice = "&video=false";
    }
    var domain = location.hostname;
    var url = location.protocol + "//" + domain + "/nwlib6/nwproject/modules/webrtc/index.php?usuario=" + usuarioCliente + "&calling=true" + voice;
    if (isMobile()) {
    } else {
    }
    var params = {};
    params["html"] = "<div class='containeriframevideollamada'><iframe class='iframevideollamadap' src='" + url + "&enllamadadoc=true'></iframe></div>";
    createDialogNw(params);

}

function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}
function nameRealFile(fic) {
    fic = fic.split('\\');
    return fic[fic.length - 1];
}

function createReportsNwmaker(container, title, cols, values, hAxisTitle, vAxisTitle) {
    var vals = "";
    for (var i = 0; i < values.length; i++) {
        var k = values[i];
        vals += "||name:" + k["name"] + ",value:" + k["value"];
    }
    $(container).append("<iframe class='frameReportnwMaker' src='/nwlib6/includes/google_api_informes/reportframe.php?title=" + title + "&cols=" + cols + "&values=" + vals + "&hAxisTitle=" + hAxisTitle + "&vAxisTitle=" + vAxisTitle + "'></iframe>");
}

function lettersArray(i) {
    var r = {};
    r["1"] = "Enero";
    r["2"] = "Febrero";
    r["3"] = "Marzo";
    r["4"] = "Abril";
    r["5"] = "Mayo";
    r["6"] = "Junio";
    r["7"] = "Julio";
    r["8"] = "Agosto";
    r["9"] = "Septiembre";
    r["10"] = "Octubre";
    r["11"] = "Noviembre";
    r["12"] = "Diciembre";
    return r[i];
}

function mesesArray(i) {
    return lettersArray(i);
}

function mesTextEnglish(i) {
    var d = {};
    d["01"] = "January";
    d["02"] = "February";
    d["03"] = "March";
    d["04"] = "April";
    d["05"] = "May";
    d["06"] = "June";
    d["07"] = "July";
    d["08"] = "August";
    d["09"] = "September";
    d["10"] = "October";
    d["11"] = "November";
    d["12"] = "December";
    return d[i];
}

function diasArray(i) {
    var r = {};
    r["1"] = "Lunes";
    r["2"] = "Martes";
    r["3"] = "Miércoles";
    r["4"] = "Jueves";
    r["5"] = "Viernes";
    r["6"] = "Sábado";
    r["0"] = "Domingo";
    return r[i];
}

function semanadelanio(date) {
    semanadelano(date);
}
function semanadelano(date) {
    var dateString = date;
    dateString = dateString.replace(/-/g, '/');
    var fecha = new Date(dateString);
    var f2 = new Date(fecha.getFullYear(), fecha.getMonth(), fecha.getDate(), 0, 0);
    var f1 = new Date(fecha.getFullYear(), 0, 1, 0, 0);
    var day = f1.getDay();
    if (day == 0)
        day = 7;
    if (day < 5)
    {
        var FW = parseInt(((Math.round(((f2 - f1) / 1000 / 60 / 60 / 24)) + (day - 1)) / 7) + 1);
        /*
         if (FW > 53 || FW == 0)
         if (FW == 0)
         */
        if (FW == 53 || FW == 0)
            FW = 1;
    } else
    {
        FW = parseInt(((Math.round(((f2 - f1) / 1000 / 60 / 60 / 24)) + (day - 1)) / 7));
        if (FW == 0)
            FW = 52;
        if (FW == 53)
            FW = 1;
    }
    return(FW);
}

function getDomain() {
    return location.hostname;
}

function click(classOrId, callBack, isWidget) {
    clickInObject(classOrId, callBack, isWidget);
}
function clickIn(classOrId, callBack, isWidget) {
    clickInObject(classOrId, callBack, isWidget);
}


function clickInObject(classOrId, callBack, isWidget) {
    if (isWidget == true) {
        classOrId.click(callBack);
    } else {
        if (__classClicks.indexOf(classOrId) == -1) {
            (function () {
                __classClicks.push(classOrId);
                $('body').delegate(classOrId, 'click', callBack);
            })();
        }
    }
}

function sortSelectOptions(selector, skip_first) {
    var options = (skip_first) ? $(selector + ' option:not(:first)') : $(selector + ' option');
    var arr = options.map(function (_, o) {
        return {t: $(o).text(), v: o.value, s: $(o).prop('selected')};
    }).get();
    arr.sort(function (o1, o2) {
        var t1 = o1.t.toLowerCase(), t2 = o2.t.toLowerCase();
        return t1 > t2 ? 1 : t1 < t2 ? -1 : 0;
    });
    options.each(function (i, o) {
        o.value = arr[i].v;
        $(o).text(arr[i].t);
        if (arr[i].s) {
            $(o).attr('selected', 'selected').prop('selected', true);
        } else {
            $(o).removeAttr('selected');
            $(o).prop('selected', false);
        }
    });
}

function cleanValuesSelect(select) {
    var valOld = "";
    $(select + " option").each(function () {
        var val = $(this).attr('value');
        if (valOld == val) {
            $(this).remove();
        }
        valOld = val;
    });
}

function orderAndCleanSelectBox(selector, skip_first) {
    sortSelectOptions(selector, skip_first);
    cleanValuesSelect(selector);
}


function createDialogNw(params, viewbtn) {
    if ($(".contend_tw").length > 0) {
        loadCss("/nwlib6/nwproject/modules/nw_user_session/css/nwdialog.css");
    }
    var body = params.html;
    var num = Math.floor((Math.random() * 100) + 1);
    var self = "dialogNwNew_" + num;
    var classEnc = " dialogEnc_" + self;
    var classBg = "dialogNwBg" + self;
    var classBgTwo = "BGdialogBg_" + self;
    var style = "style='";
    if (typeof params.width != "undefined") {
        if (!isMobile()) {
            style += "width: " + params.width + ";";
        }
    }
    if (typeof params.height != "undefined") {
        style += "height: " + params.height + ";";
    }
    if (typeof params.css != "undefined") {
        style += params.css;
    }
    var formManual = false;
    style += "'";
    var se = self;
    if (typeof params.self != "undefined") {
        formManual = true;
        se = params.self.replace(".", "");
        classBgTwo = "BGdialogBg_" + se;
        classBg += " dialogBg_" + se;
        classEnc = " dialogEnc_" + se;
    } else {
        params.self = self;
        se = self;
    }
    var html = "";
    if (!isMobile()) {
        html += "<div class='dialogNwBg " + classBg + " " + classBgTwo + "'></div>";
    }
    html += "<div class='dialogNwNew " + self + classEnc + "' dialog-number='" + num + "' " + style + ">";

    var btnMIn = true;
    var btnMax = true;
    if (params.self.indexOf("dialogNwNew_") == 0) {
        btnMIn = false;
        btnMax = false;
    }
    if (typeof params.onSave != "undefined") {
        btnMIn = true;
        btnMax = true;
    }
    if (typeof params.showButonsEnc != "undefined") {
        btnMIn = true;
        btnMax = true;
    }
    var titleEnc = str("Información");
    if (typeof params.title != "undefined") {
        titleEnc = params.title;
    }
    if (typeof params.buttonMin != "undefined") {
        if (params.buttonMin === false) {
            btnMIn = false;
        }
    }
    if (typeof params.buttonMax != "undefined") {
        if (params.buttonMax === false) {
            btnMax = false;
        }
    }

    var showTitleAndHeader = true;
    if (isMobile()) {
        showTitleAndHeader = false;
    }
    if (typeof params.showEncInMobile != "undefined") {
        if (params.showEncInMobile == true) {
            showTitleAndHeader = true;
        }
    }
    if (typeof params.showEnc != "undefined") {
        if (params.showEnc === false || params.showEnc == "NO" || params.showEnc == "no") {
            showTitleAndHeader = false;
        }
    }

    if (showTitleAndHeader === true) {
        html += "<div class='header-enc'>";
        html += "<div class='title-enc'>" + str(titleEnc) + "</div>";
        if (typeof params.noButtons == "undefined") {
            var showenc = true;
            if (!isMobile()) {
                showenc = true;
            }
            if (isMobile()) {
                showenc = false;
            }
            if (typeof params.no_cancel_button != "undefined") {
                showenc = false;
            }
            if (typeof params.no_buttons_enc != "undefined") {
                showenc = false;
            }
            if (typeof params.showEncInMobile != "undefined") {
                if (typeof params.showEncInMobile == true) {
                    showenc = true;
                }
            }
            if (showenc == true) {
                html += "<div class='buttonsEnc dialogNwClose' self='" + params.self.replace(".", "") + "' ><i class='material-icons'>close</i></div>";
                if (btnMIn === true) {
                    html += "<div class='buttonsEnc dialogNwMIn' self='" + params.self.replace(".", "") + "' ><i class='material-icons'>remove</i></div>";
                }
                if (btnMax === true) {
                    html += "<div class='buttonsEnc dialogNwMax' self='" + params.self.replace(".", "") + "' ><i class='material-icons'>crop_5_4</i></div>";
                    html += "<div class='buttonsEnc dialogNwRestaura' self='" + params.self.replace(".", "") + "' ><i class='material-icons'>crop_7_5</i></div>";
                }
            }
        }
        html += "</div>";
    }

    html += "<div class='dialogNwNewInter' id='dialogNwNewInter'>";
    html += "<div class='dialogNwNewInterContend' id='dialogNwNewInterContend'>";
    html += "</div>";
    html += "</div>";
    html += "</div>";

    var addc = "";
    if (!formManual) {
        addc = " formAutomaticMaker";
    }

    var classMobile = "dialog_notMobile";
    if (isMobile() && typeof params.formManual !== "undefined") {
        classMobile = "dialog_classMobile";
    }
    html = "<div class='nwDiextern " + classMobile + " nwDiextern_" + se + " " + addc + "'>" + html + "</div>";

    if (isMobile()) {
        if (document.querySelector(".container-notifications-mini")) {
            $(".container-notifications-mini").before(html);
        } else {
            $("body").append(html);
        }
    } else {
        $("body").append(html);
    }

    var containformall = ".nwDiextern_" + se;
    /*
     loading("Cargando... por favor espere", "#000!important", self);
     */
    var b = "";
    if (typeof params.frame != "undefined" && params.frame == true) {
        b = "<div class='containeriframevideollamada'><iframe class='iframevideollamadap' src='" + body + "&enllamadadoc=true'></iframe></div>";
    } else {
        b = str(body);
    }
    $("." + self + " .dialogNwNewInterContend").append(b + "<div class='clear'></div>");
    var selfClass = "." + self;
    var textAccept = "Aceptar";
    if (typeof params.textAccept != "undefined") {
        textAccept = params.textAccept;
    }
    var foot = "<div class='nwformFoot'><div class='nwformFootIntern'>";
    var btnAccept = "";
    var btnCancel = "";
    if (typeof params.noButtons == "undefined") {
        var classAddAccept = "";
        if (typeof params.classAddAccept != "undefined") {
            classAddAccept = params.classAddAccept;
        }
        if (typeof params.onSave != "undefined") {
            if (typeof params.no_cancel_button == "undefined") {
                var textCancel = "Cancelar";
                if (typeof params.textCancel != "undefined") {
                    textCancel = params.textCancel;
                }
                btnCancel += "<div class='btnm btnm_inherit btnm_cancel_n'><span class='btnm_news_span btnm_cancel'>" + str(textCancel) + "</span></div>";
            }
        }
        btnAccept += "<div class='btnm btnm_inherit btnm_accept_n'><span class='btnm_news_span btnm_accept " + classAddAccept + "'>" + str(textAccept) + "</span></div>";
    }
    if (isMobile()) {
        foot += btnAccept;
        foot += btnCancel;
    } else {
        foot += btnCancel;
        foot += btnAccept;
    }
    foot += "</div></div>";
    if (typeof (viewbtn)) {
        if (viewbtn != false) {
            $("." + self).append(foot);
        }
    } else {
        $("." + self).append(foot);
    }
    $(selfClass + " .btnm_accept").click(function () {
        var rej = true;
        if (evalueData(params)) {
            if (evalueData(params.onSave)) {
                if (params.onSave() === false) {
                    rej = false;
                }
            }
        }
        if (rej === true) {
            reject(selfClass);
            reject("." + classBg);
            execClose(false);
        }
    });
    $(selfClass + " .btnm_cancel").click(function () {
        execClose();
    });
    $(selfClass + " .dialogNwClose").click(function () {
        execClose(false);
    });

    setBodyOverflow("create");

    function execClose(execCancel) {
        reject(containformall);
        reject(selfClass);
        reject("." + classBg);
        reject("." + classBgTwo);

        if (execCancel !== false) {
            if (evalueData(params)) {
                if (evalueData(params.onCancel)) {
                    params.onCancel();
                }
            }
        }
        if (isMobile()) {
            $("#container-nwmaker").removeClass("hiddenBack").removeClass("container-nwmaker_showFormNw");
            $("body").css({"overflow": "auto"});
        }
    }
    if (isMobile()) {
        /* hiddeen alexf 11oct2018
         setTimeout(function () {
         $("#container-nwmaker").addClass("hiddenBack");
         }, 500);
         */
        /*experimental para iOS*/
        var elmnt = document.body;
        __scrollBodyNw = elmnt.scrollTop;
        $("body").addClass("hiddenBody");
        elmnt.scrollTop = 0;
        var t = $(selfClass + " .btnm_inherit").length;
        $(selfClass + " .btnm_inherit").width(100 / t + "%");
        $(selfClass + " input").click(function () {
            var name = $(this).attr("name");
            setTimeout(function () {
                var obj = document.getElementById(name);
                var objd = document.getElementById("dialogNwNewInter");
                var top = getOffset(obj).top - getOffset(objd).top - 35;
                $(selfClass + " .dialogNwNewInter").animate({
                    scrollTop: top
                }, 300);
            }, 400);
        });
    }
    if (!isMobile()) {
        focusFirst(selfClass);
    }
    adapterSizeAndPositionDialogNw(self, true);

    $(selfClass).addClass("animDialog");

    $(window).resize(function () {
        adapterSizeAndPositionDialogNw(self, true);
    });
    /*
     removeLoading(self);
     */
    return "." + self;
}

function adapterSizeAndPositionDialogNw(self, adapter) {
    if (isMobile()) {
        return false;
    }
    adapter = false;
    if (evalueData(self) === false) {
        self = "dialogNwNew";
    }
    self = self.replace(".", "");
    var wpage = window.innerWidth;
    var wdialog = $("." + self).width();
    var wend = (wpage - wdialog) / 2;

    var hFoot = $("." + self + " .nwformFoot").height();
    var header = $("." + self + " .header-enc");
    var headerh = 0;
    if (header.length > 0) {
        headerh = parseInt(header.height());
    }
    var hpage = window.innerHeight;
    var hdialog = $("." + self).height();
    var hdialog = $("." + self).height();
    var hend = (hpage - hdialog) / 2;
    if (hend < 0) {
        hend = 0;
    }

    var maxheight = "500";
    maxheight = hpage - hFoot - headerh;
    if (hdialog >= hpage) {
        adapter = true;
    }

    $("." + self + " .dialogNwNewInter").css({"max-height": "initial"});

    if (!isMobile()) {
        $("." + self).css({"left": wend + "px", "top": hend + "px"});
        $("." + self + " .dialogNwNewInter").css({"max-height": maxheight});

    }
    if (isMobile() || adapter === true) {
        var hendInter = (hpage - hFoot);
        hendInter = parseInt(hendInter) - headerh;
        $("." + self + " .dialogNwNewInter").css({"height": hendInter});
    }
}

function removeTitleForm(self) {
    self = selfOfDialog(self);
    remove(self + " .header-enc");
}

function removeButtonsTitleForm(self) {
    self = selfOfDialog(self);
    remove(self + " .buttonsEnc");
}

function removeButtonMin(self) {
    remove(selfOfDialog(self) + " .dialogNwMIn");
}
function removeButtonMax(self) {
    remove(selfOfDialog(self) + " .dialogNwMax");
}

function selfTitleForm(self, text) {
    var d = document.querySelector(".dialogEnc_" + self.replace(".", "") + " .title-enc");
    if (d) {
        d.innerHTML = text;
    }
}

function selfOfDialog(self) {
    return ".dialogEnc_" + self.replace(".", "");
}

function createNwFormsNew(self, fields, mode, r) {
    /*  var datetime = [];*/
    var times = [];
    var fechas = [];
    var inps = [];
    for (var i = 0; i < fields.length; i++) {
        var d = fields[i];
        if (!isMobile()) {
            var tipo = "";
            if (evalueData(d.tipo)) {
                tipo = d.tipo;
            }
            if (evalueData(d.type)) {
                tipo = d.type;
            }
            if (tipo == "dateField" || tipo == "date") {
                d.type = "textField";
                fechas[i] = d.name;
            } else
            if (tipo == "timeField" || tipo == "time") {
                d.type = "textField";
                times[i] = d.name;
            }
            /*
             else
             if (tipo == "datetime") {
             d.type = "textField";
             datetime[i] = d.name;
             }
             */
        }
        inps[i] = d;
    }

    var productosJSON = JSON.stringify(inps);
    var dataform = loadFormsMain("alf", productosJSON, r, self);

    if (mode == "popUp" || mode == "popup" || mode == "dialog") {
        var divapp = convertDivNameInObjectDiv(self, dataform);
        var params = {};
        params.html = divapp["div"];
        params.self = self;
        params.formManual = true;
        var n = createDialogNw(params);
        addDivButtonsNwForms(divapp["class_name"]);
        activeDatePickerInCol(fechas, self);
        activeTimePickerInCol(times, self);
        $(self).addClass("contand_mainw");
        $(self).addClass("form_mainw");
        return n;
    } else
    if (mode == "slide" || mode == "slider") {
        addWindowSlide(self, dataform, "slide");
        activeDatePickerInCol(fechas, self);
        activeTimePickerInCol(times, self);
        $(self).addClass("contand_mainw");
        $(self).addClass("form_mainw");
        return true;
    } else
    if (mode == "nopopup" || mode === "prepend" || mode === "after" || mode === "before") {
        addInWIndow(dataform, self, mode);
        addDivButtonsNwForms(self);
        activeDatePickerInCol(fechas, self);
        activeTimePickerInCol(times, self);
        $(self).addClass("contand_mainw");
        $(self).addClass("form_mainw");
        return true;
    } else {
        addInWIndow(dataform, self);
        addDivButtonsNwForms(self);
        activeDatePickerInCol(fechas, self);
        activeTimePickerInCol(times, self);
        $(self).addClass("contand_mainw");
        $(self).addClass("form_mainw");
        return true;
    }
}

function activeDateTimePickerInCol(datetime, self) {
    if (isMobile()) {
        return;
    }
    if (datetime.length > 0) {
        for (var i = 0; i < datetime.length; i++) {
            var d = datetime[i];
            var control = "#" + d;
            if (typeof d !== "undefined") {
                $(control).mask("00-00-0000 00:00:00", {placeholder: "__-__-____ __:__:__"}, {selectOnFocus: true});
            }
        }
    }
}
function activeTimePickerInCol(times, self) {
    if (isMobile()) {
        return;
    }
    if (times.length > 0) {
        for (var i = 0; i < times.length; i++) {
            var d = times[i];
            var control = self + " #" + d;
            if (typeof d !== "undefined") {
                $(control).mask("00:00:00", {placeholder: "__:__:__"}, {selectOnFocus: true});
            }
        }
    }
}
function activeDatePickerInCol(fechas, self) {
    if (isMobile()) {
        return;
    }
    if (fechas.length > 0) {
        for (var i = 0; i < fechas.length; i++) {
            var d = fechas[i];
            var control = self + " #" + d;
            if (typeof d !== "undefined") {
                $(control).datepicker({
                    showButtonPanel: true,
                    changeMonth: true,
                    changeYear: true,
                    yearRange: "-100:+20",
                    dateFormat: "yy-mm-dd",
                    /*
                     showOn: "button",
                     */
                    buttonImage: "/nwlib6/icons/calendar.gif",
                    buttonImageOnly: false,
                    buttonText: "Seleccionar fecha",
                    showWeek: true,
                    firstDay: 1
                });
                $(control).mask("0000-00-00", {placeholder: "____-__-__"}, {selectOnFocus: true});
            }
        }
    }
}


function createDialogNwForm(params) {
    var modal = true;
    if (evalueData(params)) {
        if (evalueData(params["modal"])) {
            if (params["modal"] == false) {
                modal = false;
            }
        }
    }
    if (evalueData(params["self"])) {
        var self = generateSelf(params["self"]);
    } else {
        var self = generateSelf();
    }
    var fields = [];
    createNwForms(self, fields, "popUp");
    setColumnsFormNumber(self, 1);
    setModal(modal);
    if (evalueData(params["html"])) {
        addHeaderNote(self, params["html"]);
    }
    var accept = addButtonNwForm("Aceptar", self);
    accept.addClass("btnDialogNw");
    accept.addClass("btnAcceptDialogNw");
    accept.click(function () {
        if (evalueData(params["accep"])) {
            params["accep"]();
        } else {
            reject(self);
        }
    });
    var cancel = addButtonNwForm("Cancelar", self);
    cancel.addClass("btnDialogNw");
    cancel.addClass("btnCanceltDialogNw");
    cancel.click(function () {
        if (evalueData(params["cancel"])) {
            params["cancel"]();
        } else {
            reject(self);
        }
    });
    return self;
}

function openLink(url, target, optionsPopUp) {
    if (typeof target === "undefined") {
        target = "_self";
    }
    if (target === "blank") {
        target = "_blank";
    }
    if (target === "self") {
        target = "_self";
    }
    var popup = "";
    if (target === "popup") {
        if (!evalueData(optionsPopUp)) {
            /*
             optionsPopUp = "top=0,left=0,width=800,height=800";
             */
            optionsPopUp = "top=0,left=0,width=" + screen.width + ",height=" + screen.height + ",fullscreen=yes";
        }
        popup = "toolbar=yes,scrollbars=yes,resizable=yes," + optionsPopUp;
    }
    window.open(url, target, popup);
}

function getNavigator(all) {
    var r = "";
    if (navigator.userAgent.indexOf('MSIE') !== -1 || navigator.appVersion.indexOf('Trident/') > 0) {
        r = "Internet Explorer";
    } else
    if (navigator.userAgent.indexOf('Firefox') != -1) {
        r = "Firefox";
    } else
    if (navigator.userAgent.indexOf('Chrome') != -1) {
        r = "Google Chrome";
    } else
    if (navigator.userAgent.indexOf('Opera') != -1) {
        r = "Opera";
    } else {
        r = "Navegador no identificado ...";
    }
    if (all == true) {

    }
    return r;
}

function validaCompatibilityVideoCall() {
    var nav = getNavigator();
    if (nav == "Internet Explorer") {
        var params = {};
        params.html = "Lo sentimos, está utilizando Internet Explorer, no es compatible con la videollamada. Recomendamos usar Google Chrome, Mozilla, Opera.";
        createDialogNw(params);
        return false;
    }
    return true;
}

function createAbcFilters(self, typeLink, callBack) {
    var response = "";
    response += "";
    return response;
}

function focusInput(self, input) {
    $(self + " #" + input).focus();
}
function focusOutInput(self, input, isWidget) {
    if (isWidget === true) {
        $(input).focusout();
    } else {
        $(self + " " + input).focusout();
    }
}


function filterAbc(self, funcion) {
    var abc = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'ñ', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
    var tam = abc.length;
    var w = 100 / tam;
    $(self).prepend("<div id='nw_filter_abc' class='nw_filter_abcd'></div>");
    var cont = $(".nw_filter_abcd");
    for (var l = 0; l < abc.length; l++) {
        var con_l = "<div id='nw_f_" + abc[l] + "' class='nw_f_subAbc' >" + abc[l] + "</div>";
        cont.append(con_l);
    }
    click(".nw_f_subAbc", function () {
        funcion($(this).text());
    }, false);
    $('.nw_f_subAbc').css('width', w + '%');
}

function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}
function str_replace(fields, fieldsChange, variable) {
    var replace = fields;
    var re = new RegExp(replace, "g");
    var str = variable.replace(re, fieldsChange);
    return str;
}
function cleanHTML(str) {
    return strip_tags(str);
}
function stripTags(str) {
    return strip_tags(str);
}
function strip_tags(str) {
    if (!evalueData(str)) {
        return "";
    }
    str = str.toString();
    return str.replace(/<\/?[^>]+>/gi, '');
}
function cleanName(str) {
    str = str.toString();
    str = str.replace(/ /gi, '');
    str = str.replace(/=/gi, "");
    str = str.replace(/,/gi, ".");
    return str;
}
function pintaPosPuntero(evento) {
    var r = {};
    r["cursorX"] = evento.clientX;
    r["cursorY"] = evento.clientY;
    r["posicionX"] = evento.screenX;
    r["posicionY"] = evento.screenY;
    return r;
}
function getOffset(el) {
    var _x = 0;
    var _y = 0;
    while (el && !isNaN(el.offsetLeft) && !isNaN(el.offsetTop)) {
        _x += el.offsetLeft - el.scrollLeft;
        _y += el.offsetTop - el.scrollTop;
        el = el.offsetParent;
    }
    return {top: _y, left: _x};
}

function focusFirst(parent) {
    $(parent).find('input, textarea, select')
            .not('input[type=hidden],input[type=button],input[type=submit],input[type=reset],input[type=image],button')
            .filter(':enabled:visible:first')
            .focus();
}

function getApiGoogleMaps(callBack) {
    var call = "";
    if (evalueData(callBack)) {
        call = callBack;
    }
    var v = 2;
    var css = "position: fixed;top: 0px;z-index: 1000000000000000;background: #fff;";
    newLoading("body", "Cargando Api Google Maps, espere por favor...", css, "append");
    /*
     loadJs("https://maps.googleapis.com/maps/api/js?file=api&v=" + v + "&key=AIzaSyCkI3HE2iU7-m3qSy3LR7dON2Pf_Qx8Tas&libraries=geometry" + call, function () {
     */
    loadJs("https://maps.googleapis.com/maps/api/js?file=api&v=" + v + "&key=AIzaSyDwzPL22nfy3hRDB-kxNSJLc_dpSMGQijY&libraries=geometry" + call, function () {
        miUbicacion(true);
        newRemoveLoading("body");
    }, "apiGoogleMaps", true);
}


function priceSegure(price, callBack) {
    var rpc = {};
    rpc["service"] = "nwMaker";
    rpc["method"] = "getPriceSegure";
    rpc["data"] = {price: price};
    var func = function (r) {
        if (!verifyErrorNwMaker(r)) {
            return;
        }
        callBack(r);
    };
    rpcNw("rpcNw", rpc, func, false);
}

function serializeForm(stringId) {
    var data = $(stringId).serializeArray();
    data = arraySerializedToArray(data);
    return data;
}
function arraySerializedToArray(arr) {
    var req = {};
    for (var i = 0; i < arr.length; i++) {
        req[arr[i].name] = arr[i].value;
    }
    return req;
}
function isOnline() {
    if (getDomain() === "localhost" || getDomain().indexOf(".loc") !== -1) {
        return true;
    }
    return navigator.onLine;
}
function isOffline() {
    if (getDomain() === "localhost") {
        return false;
    }
    return navigator.onLine;
}
function imgThumb(file, w) {
    var phpthumb = "/nwlib6/includes/phpthumb/phpThumb.php?src=";
    var phpthumbEnd = "&w=" + w + "&f=";
    var extensiones_img = new Array(".gif", ".jpg", ".png", ".JPG", ".jpeg", ".JPEG", ".PNG", ".GIF");
    var ext = "";
    for (var i = 0; i < extensiones_img.length; i++) {
        if (file.indexOf(extensiones_img[i]) != -1) {
            ext = extensiones_img[i].replace(".", "");
            break;
        }
    }

    if (__userWebpPhpThumb == true) {
        if (ext == "jpeg" || ext == "jpg" || ext == "png") {
            ext = "webp";
        }
    }

    file = phpthumb + file + phpthumbEnd + ext;
    return file;
}

function insideIframe() {
    var rta = false;
    if (top.location != self.location) {
        rta = true;
    }
    return rta;
}

function changeTitle(title, notify, isTitleInitial, changeFavi) {
    var ntitle = title;
    var ti = document.querySelector(".title_initial");
    if (!ti) {
        return;
    }
    var titleInitial = ti.getAttribute("data");
    var faviconInitial = document.querySelector(".favicon_initial").getAttribute("data");
    if (isTitleInitial == true) {
        ntitle = titleInitial;
        if (changeFavi == true) {
            changeFavicon(faviconInitial);
        }
        __totalCountTitle = 0;
    } else
    if (typeof notify != "undefined") {
        ntitle = "(" + notify + ")" + " " + titleInitial;
        if (changeFavi == true) {
            changeFavicon("/imagenes/favicon.png");
        }
        __totalCountTitle = notify;
    }
    document.title = ntitle;
}
function changeFavicon(iconNew) {
    document.getElementById('favicon').href = iconNew;
}
function windowBlurFocus() {
    window.onfocus = function () {
        windowFocused = true;
    };
    window.onblur = function () {
        windowFocused = false;
    };
}


function removeDuplicates(originalArray, prop) {
    var newArray = [];
    var lookupObject = {};
    for (var i in originalArray) {
        lookupObject[originalArray[i][prop]] = originalArray[i];
    }
    for (i in lookupObject) {
        newArray.push(lookupObject[i]);
    }
    return newArray;
}

function addItemLocalStorageArray(name, addItem) {
    if (typeof addItem == "undefined") {
        return false;
    }
    if (addItem.length == 0) {
        return false;
    }
    var aa = [];
    var n = 0;
    if (typeof localStorage[name] != "undefined") {
        aa = JSON.parse(localStorage[name]);
        n = JSON.parse(localStorage[name]).length;
    }
    aa[n] = addItem;
    localStorage[name] = JSON.stringify(aa);
}

function getLocalStorageArray(name) {
    if (typeof localStorage[name] == "undefined") {
        return false;
    }
    var d = JSON.parse(localStorage[name]);
    return d;
}

function removeItemLocalStorageArray(name, item) {
    var aa = [];
    var allUsersOpen = getLocalStorageArray(name);
    var t = allUsersOpen.length;
    var n = 0;
    for (var i = 0; i < t; i++) {
        var g = allUsersOpen[i];
        $.each(g, function (key, value) {
            if (value != item) {
                aa[n] = g;
                n++;
            }
        });
    }
    /*
     aa = removeDuplicates(aa, item);
     */
    localStorage[name] = JSON.stringify(aa);
}

function cleanUserNwC(u) {
    if (evalueData(u)) {
        u = u.toString();
        var id = u.replace(/\//gi, "");
        id = id.replace(/\!/gi, "");
        id = id.replace(/\¡/gi, "");
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
        id = id.replace(".", "");
        return id;
    } else {
        return "";
    }
}

function isInFocus(divFoc, callBack) {
    if ($(divFoc).is(":focus")) {
        callBack(true);
    } else {
        callBack(false);
    }
}

function addListener(self, field, action, callBack, isWidget) {
    if (isWidget != true) {
        field = field.replace(".", "");
    }
    if (action == "changeSelection") {
        action = "change";
    } else
    if (action == "execute") {
        action = "click";
    }
    var input = "";
    if (isWidget === true) {
        input = field;
    } else {
        input = document.querySelector(self + " ." + field);
    }
    if (isWidget === true) {
        if (action == "click") {
            field.click(function () {
                var s = this;
                callBack(s);
            });
        }
    } else {
        var type = input.getAttribute("type");
        input.addEventListener(action, function () {
            var s = this;
            var val = s.value;
            if (type == "selectBox" || type == "selectbox") {
                s.setAttribute("val-data", val);
            }
            callBack(s);
        });
    }
}
function removeAll(self, field) {
    $(self + " " + field).find('option').remove().end();
}


function setLanguage(set, callBack) {
    var get = getGET();
    if (set != null && set != false && set != "") {
        localStorage["mainLanguageNwMaker"] = set;
        changeHashLang(set);
        changeInsrvLanguaje(localStorage["mainLanguageNwMaker"], function () {
            if (callBack !== "NA") {
                if (evalueData(callBack)) {
                    callBack();
                } else {
                    window.location = "/";
                }
            }
        });
        return true;
    }
    if (get != false && typeof get.lang != "undefined") {
        ln = get.lang;
        localStorage["mainLanguageNwMaker"] = ln;
        changeInsrvLanguaje(localStorage["mainLanguageNwMaker"]);
        return true;
    }
    if (localStorage["mainLanguageNwMaker"] != "") {
        return false;
    }
    var lang = navigator.languages ? navigator.languages[0] : (navigator.language || navigator.userLanguage);
    var x = lang.split("-");
    var ln = x[0];
    localStorage["mainLanguageNwMaker"] = ln;
    changeInsrvLanguaje(localStorage["mainLanguageNwMaker"]);
    return true;
}
function changeHashLang(ln) {
    var get = getGET();
    if (get == false) {
        return false;
    }
    if (typeof get.lang == "undefined") {
        return false;
    }
    var loc = location.search;
    loc = loc.replace("?lang=es", "");
    loc = loc.replace("?lang=en", "");
    loc = loc.replace("&lang=en", "");
    loc = loc.replace("&lang=en", "");
    if (loc.indexOf("?") == -1) {
        loc += "?lang=" + ln;
    } else {
        loc += "&lang=" + ln;
    }
    loc += location.hash;
    addHash("/" + loc);
}
function getLanguage() {
    return localStorage["mainLanguageNwMaker"];
}
function changeInsrvLanguaje(lan, callBack) {
    var rpc = {};
    rpc["service"] = "nwMaker";
    rpc["method"] = "changeInsrvLanguaje";
    rpc["data"] = {language: lan};
    var func = function (r) {
        if (!verifyErrorNwMaker(r)) {
            return;
        }
        if (evalueData(callBack)) {
            callBack();
        }
    };
    rpcNw("rpcNw", rpc, func);
}
function initTraductor() {
    setLanguage();
    fileExists("/nwlib6/nwmaker/es.json", function (x) {
        if (x.fileExist === true) {
            var r = JSON.parse(x.response);
            __mainTraduc = r;
        }
    });
}
function alterTraductor() {
    fileExists("/translate_nwmaker.json", function (x) {
        if (x.fileExist === true) {
            var r = JSON.parse(x.response);
            __mainTraducAlter = r;
        }
    });
}
function str(dato) {
    if (!evalueData(dato)) {
        return dato;
    }
    var ln = getLanguage();
    var ln_ot = false;
    if (typeof lan_global_config !== "undefined") {
        ln_ot = lan_global_config;
    }
    if (!evalueData(ln_ot) && typeof nwm !== "undefined") {
        var v = nwm.getInfoApp();
        if (evalueData(v.language)) {
            ln_ot = v.language;
            lan_global_config = ln_ot;
        }
    }
    if (evalueData(ln_ot)) {
        ln = ln_ot;
    }
    if (ln == "es") {
        ln = "";
    }
    var n = dato.toString();
    var x = __mainTraduc["" + n + "_" + ln + ""];
    if (evalueData(__mainTraducAlter)) {
        if (evalueData(__mainTraducAlter["" + n + "_" + ln + ""])) {
            x = __mainTraducAlter["" + n + "_" + ln + ""];
        }
    }
    if (!evalueData(x)) {
        x = dato;
    } else {
        x = strip_tags(x);
    }
    return x;
}

function getPermissionWebCam(callback) {
    navigator.getUserMedia = navigator.getUserMedia ||
            navigator.webkitGetUserMedia ||
            navigator.mozGetUserMedia;

    if (navigator.getUserMedia) {
        navigator.getUserMedia({audio: true, video: {width: 1280, height: 720}},
                function (stream) {
                    callback(stream);
                },
                function (err) {
                    callback("The following error occurred: " + err.name);
                }
        );
    } else {
        callback("getUserMedia not supported");
    }
}

function getPermissionsNwMaker(callBack) {
    if (navigator.geolocation) {
        if (typeof navigator.permissions === "undefined") {
            return false;
        }
        var r = {};
        navigator.permissions.query({name: 'notifications'}).then(function (permissionStatus) {
            r.notifications = permissionStatus.state;

            navigator.permissions.query({name: 'geolocation'}).then(function (permissionStatus) {
                r.geolocation = permissionStatus.state;

                callBack(r);

            });

        });
    }
}

function execPermissionsAppNwMaker() {
    var c = getConfigApp();
    var v = nwm.getInfoApp();
    var version = v.version;
    var gv = "?v=" + version;
    if (typeof c.activeServerWorker !== "undefined") {
        initServerWorker();
    }
    if (c.useApiGoogleMaps === "SI" || c.useApiGoogleMaps === true) {
        miUbicacion(true);
    }
}

function cleanUserNwRingow(u) {
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
    id = id.replace(/\:/gi, "");
    id = id.replace(/\ /gi, "");
    id = id.replace(/\!/gi, "");
    id = id.replace(/\¡/gi, "");
    id = id.replace(/\¿/gi, "");
    id = id.replace(/\?/gi, "");
    id = id.replace(/\ñ/gi, "");
    id = id.replace(/\{/gi, "");
    id = id.replace(/\}/gi, "");
    id = id.replace(".", "");
    return id;
}

function showPlanesProductsNw(product_id, div, mode, permitir_demo, rutademo, country, callback, lang, country_id) {
    newLoading(div, "Cargando planes, espere un momento por favor...", "background-color: #fff;", "allWindow");
    var up = getUserInfo();
    loadCss("/nwlib6/nwproject/modules/nw_user_session/css/plans_products.css");
    var data = {};
    data.product_id = product_id;
    data.pais = country;
    data.usuario_principal = up.usuario_principal;
    data.id_plan = up.id_plan;
    data.mode = mode;
    var rpc = {};
    rpc["service"] = "nwMaker";
    rpc["method"] = "getPlansProducts";
    rpc["data"] = data;

    var isInDash = false;
    if (evalueData(data.usuario_principal)) {
        isInDash = true;
    }
    var func = function (rs) {
        console.log(rs);
        newRemoveLoading(div);
        if (rs === "notienecliente") {
            nw_dialog("No tiene cliente principal");
            return false;
        }
        if (rs === null) {
            return false;
        }
        var r = JSON.parse(rs.plans);
        if (!verifyErrorNwMaker(ra)) {
            return false;
        }
        var html = "";
        html += "<div class='containPlans'>";
        if (mode !== "ACTIVE" && mode !== "NEW") {
            html += "<div class='containPlansTitleExpired'>";
            html += str("Su cuenta ha expirado.");
            html += "</div>";
        }
        html += "<div class='containPlansTitle'>";
        var plant = "Planes y Suscripciones";
        var plantext = "Por favor seleccione el plan que desea adquirir";
        var tbestval = "Mejor precio";
        if (typeof text_title_plan !== "undefined") {
            plant = text_title_plan;
        }
        if (typeof text_title_bestval !== "undefined") {
            tbestval = text_title_bestval;
        }
        if (typeof text_title_descrip !== "undefined") {
            plantext = text_title_descrip;
        }
        html += "<h1>" + str(plant) + "</h1>";
        html += str(plantext);
        html += "</div>";

        var cl = r.modulos;
        var pl = r.planes;
        var tplanes = pl.length;
        var tmodulos = cl.length;
        html += "<div class='maincontplans'>";
        for (var i = 0; i < tplanes; i++) {
            var ra = pl[i];
            var descatado = "";
            var textdescatado = "";
            if (typeof ra.descatado !== "undefined") {
                if (ra.descatado === "SI" || ra.descatado === "true" || ra.descatado === true || ra.descatado === "t" || ra.descatado === "T") {
                    descatado = " plan_destacado";
                }
            }
            var n = ra.nombre;
            var val = ra.valor_plan;
            var totalpay = parseFloat(ra.valor_plan);
            var lic = ra.observaciones;
            var plan_id = ra.plan;
            var plan = ra.name_space;
            var pais = ra.pais;
            var text = "Comprar";
            var demo = "NO";
            var tdemo = "Probar demo de";
            var tdays = "días";
            var url = rutademo;
            var profile = "";
            if (evalueData(ra.url)) {
                url = ra.url;
            }
            if (evalueData(ra.perfil)) {
                profile = ra.perfil;
            }
            if (permitir_demo === true && ra.dias_prueba > 0) {
                text = tdemo + " " + ra.dias_prueba + " " + tdays;
                demo = "SI";
            }
            if (typeof ra.texto_boton !== "undefined") {
                if (evalueData(ra.texto_boton)) {
                    text = ra.texto_boton;
                }
            }
            if (isInDash) {
                text = "Comprar";
            }
            if (descatado === "" && i === 1) {
                descatado = " plan_destacado";
            }
            if (descatado !== "") {
                textdescatado = "<span class='bestvalue'>" + tbestval + "</span>";
            }
            html += "<div class='bPlans" + descatado + "'>";
            html += "<div class='bPlansInt'>";
            html += textdescatado;
            html += "<div class='bTitle'>" + n + "</div>";
            html += "<div class='b_price'>" + formatearNumeroMoney(val) + "<span>" + pais + "</span></div>";
            html += "<div class='b_m'>" + lic + "</div>";

            if (permitir_demo === false) {
                html += "<br /><div class='conTouser'>";
                html += "Total usuarios: 1";
                html += "</div>";
                html += "<div class='conTotalPay'>";
                html += "Total pago: $" + totalpay;
                html += "</div>";
            }

            html += "<div class='b_btn b_btn_active' data='" + totalpay + "' data-demo='" + demo + "' data-url='" + url + "' data-profile='" + profile + "' data-plan='" + plan + "' data-plan_id='" + plan_id + "'><span href='#'>" + text + "</span></div>";
            html += "<div class='containModulesPlanPr'>";

            html += "<div>";
            for (var ia = 0; ia < tmodulos; ia++) {
                var c = cl[ia];
                var name = c.modulo;
                var description = c.descripcion;
                if (typeof c.nombre_alterno !== "undefined") {
                    if (evalueData(c.nombre_alterno)) {
                        name = c.nombre_alterno;
                    }
                }
                if (typeof c.descripcion_alterno !== "undefined") {
                    if (evalueData(c.descripcion_alterno)) {
                        description = c.descripcion_alterno;
                    }
                }
                if (c.plan === plan_id) {
                    html += "<div class='linemodcon'>";
                    html += "<span class='linemod'>+</span><span class='linemodclose'>-</span><span class='namemodul'>" + name + "</span> <p class='description_module'>" + description + "</p>";
                    html += "</div>";
                }
            }
            html += "</div>";
            html += "</div>";

            html += "</div>";
            html += "</div>";
        }
        html += "</div>";

        html += "</div>";
        var co = document.querySelector(div);
        co.innerHTML = html;
        co.style.left = "0px";

        $(".b_btn_active").click(function () {
            var price = $(this).attr("data");
            var demo = $(this).attr("data-demo");
            var plan_text = $(this).attr("data-plan");
            var plan_id = $(this).attr("data-plan_id");
            var profile = $(this).attr("data-profile");
            var url = $(this).attr("data-url");
            if (typeof up.usuario !== "undefined") {
                openPay(price, plan_id, plan_text);
            } else {
                var ur = url + "&payPlanProductNw=" + plan_text;
                if (evalueData(profile)) {
                    ur += "&profile=" + profile;
                }
                if (typeof lang !== "undefined") {
                    if (evalueData(lang)) {
                        ur += "&lang=" + lang;
                    }
                }
                if (typeof country_id !== "undefined") {
                    if (evalueData(country_id)) {
                        ur += "&country=" + country_id;
                    }
                }
                window.location = ur;
            }
        });

        $(".linemodcon").click(function () {
            var d = $(this);
            var op = d.attr("data-open");
            var dismod = "none";
            var dis = "none";
            var dist = "none";
            if (op === "false" || typeof op === "undefined") {
                d.attr("data-open", "true");
                dismod = "block";
                dis = "inline-block";
                dist = "none";
            } else {
                d.attr("data-open", "false");
                dismod = "none";
                dis = "none";
                dist = "inline-block";
            }
            d.find(".linemod").css({"display": dist});
            d.find(".linemodclose").css({"display": dis});
            d.find(".description_module").css({"display": dismod});

            resolveHeight();
        });

        /*ARREGLA ALTO PARA TODOS LOS BLOQUES IGUAL AL MAYOR */
        resolveHeight();
        function resolveHeight() {
            if (isMobile()) {
                return false;
            }
            var ht = 0;
            var bPlans = document.querySelectorAll(".bPlans");
            for (var i = 0; i < bPlans.length; i++) {
                var b = bPlans[i];
                b.style.height = "auto";
            }
            for (var i = 0; i < bPlans.length; i++) {
                var b = bPlans[i];
                var h = b.clientHeight;
                if (h > ht) {
                    ht = h;
                }
            }
            for (var i = 0; i < bPlans.length; i++) {
                var b = bPlans[i];
                b.style.height = ht + "px";
            }
        }
        if (typeof callback !== "undefined") {
            if (evalueData(callback)) {
                callback();
            }
        }
    };
    rpcNw("rpcNw", rpc, func);

    function openPay(price, plan_id, plan_text) {
        var pruebas = "SI";
        var pruebas = "NO";
        var x = {};
        /*
         x["wayToPay"] = "selectService";
         x["wayToPay"] = "credito_ws";
         */
        x["wayToPay"] = "credito";
        x.html = "<p>Realice su pago con tarjeta crédito o saldo a favor para activar este plan.</p>";
        x.mode = "popup";
        x.self = ".containerCenterPay";
        x.plan = plan_id;
        x.plan_text = plan_text;
        x.pais = country;
        x.product_id = product_id;
        x.price = price;
        x["credito"] = function () {
            var data = {};
            data["pruebas"] = pruebas;
            var p = {};
            p["service"] = "nwMaker";
            p["method"] = "apiNwPayTesting";
            p["price"] = price;
            p["serviceResponse"] = "nwMaker";
            p["methodResponse"] = "updateSaldoStateUser";
            p.data = data;
            p["noReject"] = true;
            p["type"] = "payu";
            p["wayToPay"] = "credito";
            p["plan"] = plan_id;
            p["callBack"] = function (r) {
                console.log(r);
                if (r.dataResultTransaction.APPROVED === true) {
                    var params = {};
                    params.html = "Su pago fue realizado correctamente y su cuenta ha sido activada.";
                    params.textAccept = "¡Listo!";
                    params.no_cancel_button = true;
                    params.onSave = function () {
                        window.location.reload();
                        return true;
                    };
                    createDialogNw(params);
                } else {
                    var params = {};
                    params.html = "Algo salió mal...";
                    params.textAccept = "Aceptar";
                    params.no_cancel_button = true;
                    params.onSave = function () {
                        return true;
                    };
                    createDialogNw(params);
                }
            };
            console.log(p);
            var d = new apiNwPay(p);
            d.open();
        };
        x["saldo"] = function () {
            var data = {};
            data["pruebas"] = pruebas;
            priceSegure(price, function (v) {
                var p = {};
                p["data"] = data;
                p["noReject"] = true;
                p["type"] = "payu";
                p["wayToPay"] = "saldo";
                p["serviceResponse"] = "nwMaker";
                p["methodResponse"] = "updateSaldoStateUser";
                p["price"] = price;
                p["price_segure"] = v;
                p["callBack"] = function (r) {
                    var params = {};
                    params.html = "callBack posterior saldo... en consola sale la respuesta y ahí puedo decidir qué hacer.";
                    params.textAccept = "Continuar";
                    params.no_cancel_button = true;
                    params.onSave = function () {
                        return true;
                    };
                    createDialogNw(params);
                };
                var d = new apiNwPay(p);
                d.open();
            });
        };
        /*
         x["debito"] = function () {
         var data = {};
         data["pruebas"] = pruebas;
         priceSegure(price, function (v) {
         var p = {};
         p["service"] = "nwMaker";
         p["method"] = "apiNwPayTesting";
         p["serviceResponse"] = "doctolk";
         p["methodResponse"] = "saveReserva";
         p["data"] = data;
         p["noReject"] = true;
         p["type"] = "payu";
         p["wayToPay"] = "debito";
         p["price"] = price;
         p["price_segure"] = v;
         p["callBack"] = function (r) {
         console.log(r);
         var params = {};
         params.html = "callBack posterior débito... en consola sale la respuesta y ahí puedo decidir qué hacer.";
         params.textAccept = "Continuar";
         params.no_cancel_button = true;
         params.onSave = function () {
         return true;
         };
         createDialogNw(params);
         };
         var d = new apiNwPay(p);
         d.open();
         });
         };
         */
        var d = new apiNwPay(x);
        d.open();
        newRemoveLoading("body");
        return false;
    }
}

function getWidthPos() {
    return {width: window.innerWidth, height: window.innerHeight};
}

function setIconUploader(self, field, icon) {
    addCss(self, ".uploader_" + field + "", {"opacity": "0", "position": "absolute", "top": "0", "left": "0"});
    addCss(self, ".contain_input_name_" + field + " .labelInt", {"display": "block", "pointer-events": "none", "z-index": "0", "background-image": "url(" + icon + ")", "background-position": "center", "background-repeat": "no-repeat", "background-size": "contain", "color": "transparent", "height": "100%", "padding": "0", "margin": "0"});
}

function nwSocialOpen(self, title_page, url) {
    if (typeof url === "undefined" || url === false || url === null || url === "") {
        url = location.href;
    }
    if (typeof title_page === "undefined" || title_page === undefined || title_page === "undefined" || title_page === false || title_page === null || title_page === "") {
        title_page = document.title;
    }
    var img = "";
    var m = document.querySelector(".imgSharedFB");
    if (m) {
        var mm = m.src;
        mm = mm.replace(location.protocol + "//" + location.host, "");
        mm = mm.replace("/imagenes/", "");
        mm = mm.replace(".jpeg", "");
        mm = mm.replace(".jpg", "");
        mm = mm.replace(".JPG", "");
        mm = mm.replace(".JPEG", "");
        img = location.protocol + "//" + location.host + "/imagethumb/" + mm;
    }
    var res = encodeURIComponent(url);
    title_page = title_page.replace(" ", "%20");
    var urlp = self.href;
    var urlopen = urlp;
    urlopen = urlopen.replace(/title_page_nwmaker/gi, title_page);
    urlopen = urlopen.replace(/url_nwmaker/gi, res);
    urlopen = urlopen.replace(/img_nwmaker/gi, img);
    window.open(urlopen, '', 'resizable=yes,status=no,location=no,toolbar=no,menubar=no,fullscreen=no,scrollbars=no,dependent=no,width=600,height=600');
    return false;
}
/*
 <a rel='nofollow' class='link_shared_redes link_shared_fb' href='https://www.facebook.com/sharer/sharer.php?app_id=170629313010218&sdk=joey&u=url_nwmaker&display=popup&ref=plugin&src=share_button' onclick='nwSocialOpen(this, " + title_page + ", " + url + ");return false;'>\n\
 <a rel='nofollow' class='link_shared_redes link_shared_fb' href='https://www.facebook.com/dialog/feed?app_id=1389892087910588&redirect_uri=https://scotch.io&link=https://scotch.io&picture=http://placekitten.com/500/500' onclick='nwSocialOpen(this, " + title_page + ", " + url + ");return false;'>\n\
 <a rel='nofollow' class='link_shared_redes link_shared_fb' href='https://www.facebook.com/dialog/feed?app_id=1042641042579033&redirect_uri=https://" + location.host + "&link=url_nwmaker&picture=img_nwmaker' onclick='nwSocialOpen(this, " + title_page + ", " + url + ");return false;'>\n\
 */
function nwSocial(container, url, title_page) {
    var html = "";
    html += "<div class='linkssocial'>\n\
    <a rel='nofollow' class='link_shared_redes link_shared_fb' href='https://www.facebook.com/sharer/sharer.php?app_id=170629313010218&sdk=joey&u=url_nwmaker&display=popup&ref=plugin&src=share_button' onclick='nwSocialOpen(this, " + title_page + ", " + url + ");return false;'>\n\
        <div class='icon_reds icon_fb1'></div>Compartir\n\
    </a>\n\
    <a rel='nofollow' class='link_shared_redes link_shared_tw' href='https://twitter.com/intent/tweet?original_referer=title_page_nwmaker&ref_src=twsrc%5Etfw&text=title_page_nwmaker&tw_p=tweetbutton&url=url_nwmaker' onclick='nwSocialOpen(this, " + title_page + ", " + url + ");return false;'>\n\
        <div class='icon_reds icon_tw1'></div>Twittear\n\
    </a>\n\
    <a rel='nofollow' class='link_shared_redes link_shared_goo' href='https://plus.google.com/share?url=url_nwmaker' onclick='nwSocialOpen(this, " + title_page + ", " + url + ");return false;'>\n\
        <div class='icon_reds icon_goo1'></div>Comparte\n\
    </a>\n\
    <a rel='nofollow' class='link_shared_redes link_shared_wa' href='https://api.whatsapp.com/send?text=url_nwmaker' data-action='share/whatsapp/share' onclick='nwSocialOpen(this, " + title_page + ", " + url + ");return false;'>\n\
        <div class='icon_reds icon_what'></div>Compartir\n\
    </a>\n\
    <a rel='nofollow' class='link_shared_redes link_shared_msn' href='fb-messenger://share/?link=url_nwmaker' data-action='share/whatsapp/share' onclick='nwSocialOpen(this, " + title_page + ", " + url + ");return false;'>\n\
        <div class='icon_reds icon_msn'></div>Compartir\n\
    </a>\n\
</div>";
    if (evalueData(container)) {
        var d = document.querySelector(container);
        if (d) {
            d.innerHTML = container;
        }
    }
    return html;
}

function activelink(id, item) {
    $(".li_menu" + id).addClass("active_link");
    $(".menu_au_a_" + id).addClass("active_link_a");

    $(".li_menu_item" + item).addClass("active_link");
    $(".li_menu_item" + item + " .menu_au_a").addClass("active_link_a");
}
function setEmpty(self, div) {
    empty(self + " " + div);
}

function empty(div) {
    $(div).empty();
}

function remove(div) {
    $(div).remove();
}
function convertDivNameInObjectDiv(div, data) {
    var rta = "";
    var attr = "class";
    var name = "";
    var class_name = "";
    if (evalueData(div)) {
        var exp1 = div.split("#");
        if (exp1.length > 1) {
            attr = "id";
            name = exp1[1];
            class_name = "#" + name;
        }
        var exp2 = div.split(".");
        if (exp2.length > 1) {
            attr = "class";
            name = exp2[1];
            class_name = "." + name;
        }
    }
    var divRef = attr + "='" + name + "' ";
    if (data != undefined) {
        rta = "<div " + divRef + " >" + data + "</div>";
        var d = {};
        d["div"] = rta;
        d["class_name"] = class_name;
        return d;
    } else {
        rta += "<div " + attr + "='" + name + "' ></div>";
        return rta;
    }
}
containFileDirNum = 0;
function addInWIndow(data, div, mode, parameters) {
    var response = true;
    var dirPrincipal = ".containFileDir";
    if (mode == "nopopup") {
        if ($(dirPrincipal).length == 1) {
            /*
             containFileDirNum = 0;
             */
        }
    }
    var dir = ".containFileDir_" + containFileDirNum;
    if (mode != "createListPopup") {
        if (mode != "onlyAddHtml") {
            if (div != undefined) {
                dir = div;
                if ($(div).length == 0) {
                    var divapp = convertDivNameInObjectDiv(div);
                    if ($(".containFileDir_" + containFileDirNum).length == 0) {
                        $(".loadModulosCenter").append("<div class='containFileDir containFileDir_" + containFileDirNum + "' id='containFileDir_" + containFileDirNum + "' ></div>");
                    }
                    $(".containFileDir_" + containFileDirNum).append(divapp);
                    $(div).addClass("addDivConverted");
                }
            }
        }
    }
    if (mode == "before") {
        $(dir).before(data);
    } else
    if (mode == "after") {
        $(dir).after(data);
    } else
    if (mode == "prepend") {
        console.log("dir", dir);
        $(dir).prepend(data);
    } else
    if (mode == "createListPopup") {
        var params = {};
        if (typeof parameters != "undefined") {
            params = parameters;
        }
        var divapp = convertDivNameInObjectDiv(div, data);
        params.html = "<div class='containFileDir containFileDir_" + containFileDirNum + "' id='containFileDir_" + containFileDirNum + "' >" + divapp.div + "</div>";
        response = createDialogNw(params);
    } else {
        $(dir).append(data);
    }
    if (mode == "createList" || mode == "createListPopup") {
        containFileDirNum++;
    }
    return response;
}
function addWindowSlide(self, dataform, add, addRow) {
    if (add != "slide") {
        if (isNotTrue(add)) {
            self = createDocument("rand");
            $(".showRowMax").removeClass("showRowMax");
        }
    }
    if ($(".showRowMax").length >= 1) {
    }
    if ($(".showRowMax").length == 1) {
    } else {
    }
    if (isMobile()) {
        $("body").addClass("noOverflow");
    }
    $(self + " .loadModulesHome").addClass("moveWindowContainModule");
    if (add == "slide") {
        addInWIndow("<div class='containWindowSlide' >" + dataform + "</div>", self, "nopopup");
        addDivButtonsNwForms(self);
    } else
    if (isNotTrue(add)) {
        addInWIndow("<div class='containWindowSlide' >" + dataform + "</div>", self, "nopopup");
        addDivButtonsNwForms(self);
    }
    var htmlBack = "<div class='barraEncWindowSlide'><div class='backIntreeNw backIntreeNwForm btn-reject-nwform'> <i class='material-icons'>arrow_back</i></div></div>";
    if (evalueData(addRow)) {
        $(addRow).prepend(htmlBack);
        $(".btn-reject-nwform").click(function () {
            if (isMobile()) {
                cleanListShowMobile();
            }
            reject(addRow, "slider");
        });
        $(addRow).addClass("moveWindowSlideFormContainerPrelimin");
        $(self + " .colsMenu").addClass("colsMenuInWindowSlide");
    } else {
        $(self).prepend(htmlBack);
        $(self + " .btn-reject-nwform").click(function () {
            reject(self, "slider", "form");
        });
        $(self).addClass("moveWindowSlideFormContainerPrelimin");
    }
    if (!isMobile()) {
        $(".addDivConverted").addClass("moveWindowSlideForm");
    }
    $(addRow).removeClass("moveWindowSlideForm");
    if (!isMobile()) {
        $(".addDivConverted").addClass("moveWindowSlideFormAbs");
    }
    $(self).addClass("moveWindowSlideFormContainer");
    if (evalueData(add)) {
        $(addRow).addClass("showRowMax");
        $(".moveWindowSlideFormAbs").css({"opacity": "1"});
        scrollPage("containerCenter", 500, 100, false);
        listShowDataMobile();
    }
    return self;
}
function onChangeWindow(func, parameters) {
    $(window).resize(function () {
        window[func](parameters);
    });
}
function cleanDomainByHost(dom) {
    if (typeof dom === "undefined") {
        dom = location.href;
    }
    var state = dom;
    state = state.replace(/\//gi, "");
    state = state.replace(/:/gi, "");
    state = state.replace(/https/gi, "");
    state = state.replace(/http/gi, "");
    return state;
}
function getAttributeNw(widget, attr, self) {
    if (evalueData(self)) {
        return $(self + " " + widget).attr(attr);
    } else {
        return $(widget).attr(attr);
    }
}
function setAttribute(widget, attr, value, self) {
    if (evalueData(self)) {
        return $(self + " " + widget).attr(attr, value);
    } else {
        return $(widget).attr(attr, value);
    }
}
function playSound(classOrID, isWidget, playRequired) {
    var play = true;
    if (typeof localStorage["playSoundsMaker"] !== "undefined") {
        if (localStorage["playSoundsMaker"] === "false") {
            play = false;
        }
    }
    if (playRequired === true) {
        play = true;
    }
    if (play) {
        var d = "";
        if (isWidget === true) {
            d = classOrID;
        } else {
            d = document.querySelector(classOrID);
        }
        if (d) {
            d.play();
        } else {
            var m = "No existe el elemento para reproducir audio";
            alert(m);
            console.log(m);
        }
    }
}


function createMiniBar(classAdd) {
    var up = getUserInfo();
    var cl = "miniBar_" + Math.floor((Math.random() * 10000) + 1);
    if (typeof classAdd !== "undefined") {
        cl = classAdd;
    }
    cl = cl.toString();
    $("*").removeClass("minibar_active");
    if (document.querySelector("." + cl)) {
        $("." + cl).addClass("minibar_active");
        return false;
    }

    var div = document.createElement("div");
    div.className = "miniBar minibar_active " + cl;
    div.data = cl;

    var minimize = document.createElement("div");
    minimize.className = "minimizeMiniBar minimizeMiniBar_" + cl;
    minimize.innerHTML = '<i class="material-icons">indeterminate_check_box</i>';
    minimize.data = cl;
    minimize.onclick = function () {
        var room = this.data;
        this.style.display = "none";
        document.querySelector("." + room).style.height = "30px";
        document.querySelector(".openMiniBar_" + room).style.display = "block";
        $(".closeMiniBar_" + room).removeClass("closeMiniBarShowEnc");
    };
    div.appendChild(minimize);

    var open = document.createElement("div");
    open.className = "openMiniBar openMiniBar_" + cl;
    open.innerHTML = '<i class="material-icons">open_in_new</i>';
    open.style = "display: none;";
    open.data = cl;
    open.onclick = function () {
        var room = this.data;
        this.style.display = "none";
        document.querySelector("." + room).style.height = "500px";
        $(".closeMiniBar_" + room).addClass("closeMiniBarShowEnc");
        document.querySelector(".minimizeMiniBar_" + room).style.display = "block";
    };
    div.appendChild(open);

    var close = document.createElement("div");
    close.className = "closeMiniBar closeMiniBarShowEnc closeMiniBar_" + cl;
    close.innerHTML = '<i class="material-icons">close</i>';
    close.data = cl;
    close.onclick = function () {
        document.querySelector("." + this.data).remove();
    };
    div.appendChild(close);

    /*
     var videocall = document.createElement("div");
     videocall.className = "videoMiniBar videoMiniBarShowEnc videoMiniBar_" + cl;
     videocall.innerHTML = '<i class="material-icons">videocam</i>';
     videocall.data = cl;
     videocall.onclick = function () {
     var room = this.data;
     var domain = location.hostname;
     var name = up.nombre + " " + up.apellido;
     var foto = location.protocol + "//" + domain + up.foto;
     openLink("/nwlib6/nwproject/modules/webrtc/v4/initVideo.php?room=" + room + "&email=" + up.email + "&name=" + name + "&id_user=" + up.id_usuario + "&foto=" +  foto, "popup");
     openLink("/nwlib6/nwproject/modules/webrtc/v4/initVideo.php?room=" + room, "popup");
     };
     div.appendChild(videocall);
     */
    return div;
}

window.addEventListener('message', function (e) {
    if (typeof e.data !== "undefined") {
        var r = e.data;
        if (r.tipo === "closeringow") {
            console.log(r.room);
            $("." + r.room).addClass("hiddenMiniBar");
        } else
        if (r.tipo === "openringow") {
            $("." + r.room).removeClass("hiddenMiniBar");
        } else
        if (r.tipo === "initvideocallringow") {
            console.log("initvideocallringow", r);
        } else
        if (r.tipo === "initaudiocallringow") {
            console.log("initaudiocallringow", r);
        }
    }
});

function maquinaEscribir(palabra, element, duracion) {
    if (typeof duracion == 'undefined') {
        duracion = 100;
    }
    var count = 0;
    var devuelve = false;
    var total = 0;
    var op = 1;
    var cursor = "<div class='cursor' style='opacity:" + op + ";'></div>";
    var borra = false;
    $(element).html("");
    var funAccion = function () {
        if (op == 1) {
            op--;
        } else {
            op++;
        }
        var s = palabra[total].split("");
        if (count == s.length) {
            devuelve = true;
        }
        if (devuelve == false) {
            $(".cursor").remove();
            var letra = s[count].toString();
            letra = letra + cursor;
            $(element).append(letra);
            count++;
        } else {
            if (!borra) {
                clearInterval(interval);
                duracion = duracion / 4;
                interval = setInterval(funAccion, duracion);
                borra = true;
            }
            count--;
            var text = $(element).text();
            text = text.slice(0, -1);

            text = text + cursor;
            $(element).html(text);
            if (count == 0) {
                devuelve = false;
                borra = false;
                clearInterval(interval);
                duracion = duracion * 4;
                interval = setInterval(funAccion, duracion);
                if (total == palabra.length - 1) {
                    total = 0;
                } else {
                    total++;
                }
            }
        }
        $(".cursor").css("cssText", "opacity:" + op + ";");
    };
    var interval = setInterval(funAccion, duracion);
}

function dontPastAndCopy(classOrID) {
    var myInput = document.querySelector(classOrID);
    if (myInput) {
        myInput.onpaste = function (e) {
            e.preventDefault();
            return false;
        };
        myInput.oncopy = function (e) {
            e.preventDefault();
            return false;
        };
    }
}

function formatAMPM(hour) {
    var hours = hour.split(":")[0];
    var minutes = hour.split(":")[1];
    var ampm = hours >= 12 ? 'p. m' : 'a. m';
    hours = hours % 12;
    hours = hours ? hours : 12;
    /*
     minutes = minutes < 10 ? '0' + minutes : minutes;
     */
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
}

function getFormatHourTime(value) {
    value = value.toString();
    if (value.length === 1) {
        value = "0" + value;
    }
    return value;
}

var loadedCht = false;
var chtAdd = [];
function searchInDoc(classOrID, textCompare, callback, isLoaded) {
    var tx = textCompare.split(",");
    var d = document.querySelectorAll(classOrID);
    if (d) {
        if (d.length > 0) {
            for (var i = 0; i < d.length; i++) {
                var da = d[i];
                var rr = chtAdd.indexOf(da);
                if (rr === -1) {
                    chtAdd.push(da);
                    var te = da.textContent;
                    var execc = true;
                    if (isLoaded === true && loadedCht === false) {
                        execc = false;
                    }
                    for (var x = 0; x < tx.length; x++) {
                        var ta = tx[x];
                        if (te === ta && execc || te.indexOf(ta) !== -1 && execc) {
                            if (typeof callback !== "undefined") {
                                callback(te);
                            }
                        }
                    }
                }
            }
            loadedCht = true;
        }
    }
}

function diffInTowDates(fecha1, fecha2) {
    var date1 = new Date(fecha1).getTime();
    var date2 = new Date(fecha2).getTime();
    var msec = date2 - date1;
    var mins = Math.floor(msec / 60000);
    var hrs = Math.floor(mins / 60);
    var days = Math.floor(hrs / 24);
    var yrs = Math.floor(days / 365);

    var r = {};
    r.seconds = msec;
    r.minutes = mins;
    r.hours = hrs;
    r.days = days;
    r.years = yrs;
    return r;

    mins = mins % 60;
    hrs = hrs % 24;
    days = days % 365;
}

function newNotificacion(pr) {
    var classname = "notificacion_" + Math.floor((Math.random() * 10000) + 1);
    var addClassName = "";
    if (evalueData(pr.className)) {
        addClassName = pr.className;
    }
    var contain = ".container-notifications-mini";
    if (pr.position === "right") {
        contain = ".container-notifications-mini-right";
    }
    if (evalueData(pr.contain)) {
        contain = pr.contain;
    }
    var modeAppend = "append";
    if (evalueData(pr.modeAppend)) {
        modeAppend = pr.modeAppend;
    }
    var html = "";
    html += "<div class='createAlertNotificaMini notification_new " + classname + " " + addClassName + "'>";
    html += "<div class='notificationBox'>";
    html += "<div class='bodyMensajeNotific'>" + pr.body + "</div>";
    html += "<div class='fechaNotif'></div>";
    html += "<div class='usuarioEnviaNot'></div>";
    html += "<div class='containBtnsNotify'></div>";
    html += "</div>";
    html += "</div>";
    if (modeAppend === "after") {
        $(contain).after(html);
    } else
    if (modeAppend === "prepend") {
        $(contain).prepend(html);
    } else
    if (modeAppend === "append") {
        $(contain).append(html);
    } else {
        $(contain).append(html);
    }

    if (evalueData(pr.timeDestroy)) {
        setTimeout(function () {
            remove("." + classname);
        }, pr.timeDestroy);
    }
    if (pr.notificacionAlert === true) {
        alert(strip_tags(pr.title));
    }
    if (pr.notificacionDesktop === true) {
        spawnNotification(stripTags(pr.body), pr.icon, stripTags(pr.title), pr);
    }
    return classname;
}

function sendNotificacionPush(array, callback) {
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
            /*
             "restricted_package_name":""
             */
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
        if (evalueData(callback)) {
            callback(response);
        }
    }).catch(function (error) {
        console.error(error);
    });
}

function setBtnLoading(widget) {
    $(widget).append("<span class='cEftVf loading_into_btn'></span>");
    $(widget).addClass("events_click_none");
}

function removeBtnLoading(widget) {
    $(widget).find(".loading_into_btn").remove();
    $(widget).removeClass("events_click_none");
}


function addHoraMinutosSegundosToDate(Addhora, minutos, segundos, dateComplet) {
    Addhora = parseInt(Addhora);
    minutos = parseInt(minutos);
    segundos = parseInt(segundos);
    var d = new Date();
    if (evalueData(dateComplet)) {
        d = new Date(dateComplet);
    }
    d.setHours(d.getHours() + Addhora);
    d.setMinutes(d.getMinutes() + minutos);
    d.setSeconds(d.getSeconds() + segundos);
    var month = (d.getMonth() + 1).toString();
    var day = d.getDate().toString();
    var hora = d.getHours().toString();
    var minuto = d.getMinutes().toString();
    var segundo = d.getSeconds().toString();
    if (month.length == 1) {
        month = "0" + month;
    }
    if (day.length == 1) {
        day = "0" + day;
    }
    if (hora.length == 1) {
        hora = "0" + hora;
    }
    if (minuto.length == 1) {
        minuto = "0" + minuto;
    }
    if (segundo.length == 1) {
        segundo = "0" + segundo;
    }
    var fecha = d.getFullYear() + "-" + month + "-" + day + " " + hora + ":" + minuto + ":" + segundo;
    return fecha;
}

function apiNwPay(p) {
    this.open = open;
    if (typeof p["wayToPay"] == "undefined") {
        p["wayToPay"] = "credito";
    }
    function open() {
        if (p["wayToPay"] == "selectService") {
            loadJs("/nwlib6/nwproject/modules/apiNwPay/forms/f_select_service.js", function () {
                var d = new f_select_service(p);
                d.constructor();
            }, false, true);
        } else
        if (p["wayToPay"] == "saldo") {
            loadJs("/nwlib6/nwproject/modules/apiNwPay/forms/f_form_saldo.js", function () {
                var d = new f_form_saldo(p);
                d.constructor();
            }, false, true);
        } else
        if (p["wayToPay"] == "debito") {
            loadJs("/nwlib6/nwproject/modules/apiNwPay/forms/f_form_debito.js", function () {
                var d = new f_form_debito(p);
                d.constructor();
            }, false, true);
        } else {
            loadJs("/nwlib6/nwproject/modules/apiNwPay/forms/f_form_credit.js", function () {
                var ws = false;
                if (p["wayToPay"] == "credito_ws") {
                    ws = true;
                }
                var d = new f_form_credit(p, ws);
                d.constructor();
            }, false, true);
        }
    }
}

function validateNwPayments(r) {
    var d = {};
    d["allLog"] = r;
    d["responseMessage"] = r["transactionResponse"]["responseMessage"];
    d["status"] = "";
    d["status_description"] = "";
    d["approved"] = "";
    d["responseCode"] = "";

    var testing = false;
    if (r["transactionResponse"]["responseCode"] == "DECLINED_TEST_MODE_NOT_ALLOWED") {
        d["responseCode"] = "DECLINED_TEST_MODE_NOT_ALLOWED / MODO DE PRUEBA DECLINADA NO PERMITIDO";
        testing = true;
    }
    if (r["transactionResponse"]["responseCode"] == "INVALID_CARD") {
        d["responseCode"] = "La tarjeta es inválida.";
    }
    if (r["transactionResponse"]["responseCode"] == "ERROR") {
        d["responseCode"] = "Ocurrió un error general.";
    }
    if (r["transactionResponse"]["responseCode"] == "APPROVED") {
        d["responseCode"] = "La transacción fue aprobada.";
    }
    if (r["transactionResponse"]["responseCode"] == "ANTIFRAUD_REJECTED") {
        d["responseCode"] = "La transacción fue rechazada por el sistema anti-fraude.";
    }
    if (r["transactionResponse"]["responseCode"] == "PAYMENT_NETWORK_REJECTED") {
        d["responseCode"] = "La red financiera rechazó la transacción.";
    }
    if (r["transactionResponse"]["responseCode"] == "ENTITY_DECLINED") {
        d["responseCode"] = "	La transacción fue declinada por el banco o por la red financiera debido a un error.";
    }
    if (r["transactionResponse"]["responseCode"] == "INTERNAL_PAYMENT_PROVIDER_ERROR") {
        d["responseCode"] = "Ocurrió un error en el sistema intentando procesar el pago.";
    }
    if (r["transactionResponse"]["responseCode"] == "INACTIVE_PAYMENT_PROVIDER") {
        d["responseCode"] = "El proveedor de pagos no se encontraba activo.";
    }
    if (r["transactionResponse"]["responseCode"] == "DIGITAL_CERTIFICATE_NOT_FOUND") {
        d["responseCode"] = "La red financiera reportó un error en la autenticación.";
    }
    if (r["transactionResponse"]["responseCode"] == "INVALID_EXPIRATION_DATE_OR_SECURITY_CODE") {
        d["responseCode"] = "El código de seguridad o la fecha de expiración estaba inválido.";
    }
    if (r["transactionResponse"]["responseCode"] == "INVALID_RESPONSE_PARTIAL_APPROVAL") {
        d["responseCode"] = "Tipo de respuesta no válida. La entidad aprobó parcialmente la transacción y debe ser cancelada automáticamente por el sistema.";
    }
    if (r["transactionResponse"]["responseCode"] == "INSUFFICIENT_FUNDS") {
        d["responseCode"] = "La cuenta no tenía fondos suficientes.";
    }
    if (r["transactionResponse"]["responseCode"] == "CREDIT_CARD_NOT_AUTHORIZED_FOR_INTERNET_TRANSACTIONS") {
        d["responseCode"] = "La tarjeta de crédito no estaba autorizada para transacciones por Internet.";
    }
    if (r["transactionResponse"]["responseCode"] == "INVALID_TRANSACTION") {
        d["responseCode"] = "La red financiera reportó que la transacción fue inválida.";
    }
    if (r["transactionResponse"]["responseCode"] == "EXPIRED_CARD") {
        d["responseCode"] = "La tarjeta ya expiró.";
    }
    if (r["transactionResponse"]["responseCode"] == "RESTRICTED_CARD") {
        d["responseCode"] = "La tarjeta presenta una restricción.";
    }
    if (r["transactionResponse"]["responseCode"] == "CONTACT_THE_ENTITY") {
        d["responseCode"] = "Debe contactar al banco.";
    }
    if (r["transactionResponse"]["responseCode"] == "REPEAT_TRANSACTION") {
        d["responseCode"] = "Se debe repetir la transacción.";
    }
    if (r["transactionResponse"]["responseCode"] == "ENTITY_MESSAGING_ERROR") {
        d["responseCode"] = "La red financiera reportó un error de comunicaciones con el banco.";
    }
    if (r["transactionResponse"]["responseCode"] == "BANK_UNREACHABLE") {
        d["responseCode"] = "El banco no se encontraba disponible.";
    }
    if (r["transactionResponse"]["responseCode"] == "EXCEEDED_AMOUNT") {
        d["responseCode"] = "La transacción excede un monto establecido por el banco.";
    }
    if (r["transactionResponse"]["responseCode"] == "NOT_ACCEPTED_TRANSACTION") {
        d["responseCode"] = "La transacción no fue aceptada por el banco por algún motivo.";
    }
    if (r["transactionResponse"]["responseCode"] == "ERROR_CONVERTING_TRANSACTION_AMOUNTS") {
        d["responseCode"] = "Ocurrió un error convirtiendo los montos a la moneda de pago.";
    }
    if (r["transactionResponse"]["responseCode"] == "EXPIRED_TRANSACTION") {
        d["responseCode"] = "La transacción expiró.";
    }
    if (r["transactionResponse"]["responseCode"] == "PENDING_TRANSACTION_REVIEW") {
        d["responseCode"] = "La transacción fue detenida y debe ser revisada, esto puede ocurrir por filtros de seguridad.";
    }
    if (r["transactionResponse"]["responseCode"] == "PENDING_TRANSACTION_CONFIRMATION") {
        d["responseCode"] = "La transacción está pendiente de ser confirmada.";
    }
    if (r["transactionResponse"]["responseCode"] == "PENDING_TRANSACTION_TRANSMISSION") {
        d["responseCode"] = "La transacción está pendiente para ser trasmitida a la red financiera. Normalmente esto aplica para transacciones con medios de pago en efectivo.";
    }
    if (r["transactionResponse"]["responseCode"] == "PAYMENT_NETWORK_BAD_RESPONSE") {
        d["responseCode"] = "El mensaje retornado por la red financiera es inconsistente.";
    }
    if (r["transactionResponse"]["responseCode"] == "PAYMENT_NETWORK_NO_CONNECTION") {
        d["responseCode"] = "No se pudo realizar la conexión con la red financiera.";
    }
    if (r["transactionResponse"]["responseCode"] == "PAYMENT_NETWORK_NO_RESPONSE") {
        d["responseCode"] = "La red financiera no respondió.";
    }
    if (r["transactionResponse"]["responseCode"] == "FIX_NOT_REQUIRED") {
        d["responseCode"] = "Clínica de transacciones: Código de manejo interno.";
    }
    if (r["transactionResponse"]["responseCode"] == "AUTOMATICALLY_FIXED_AND_SUCCESS_REVERSAL") {
        d["responseCode"] = "Clínica de transacciones: Código de manejo interno. Sólo aplica para la API de reportes.";
    }
    if (r["transactionResponse"]["responseCode"] == "AUTOMATICALLY_FIXED_AND_UNSUCCESS_REVERSAL") {
        d["responseCode"] = "Clínica de transacciones: Código de manejo interno. Sólo aplica para la API de reportes.";
    }
    if (r["transactionResponse"]["responseCode"] == "AUTOMATIC_FIXED_NOT_SUPPORTED") {
        d["responseCode"] = "Clínica de transacciones: Código de manejo interno. Sólo aplica para la API de reportes.";
    }
    if (r["transactionResponse"]["responseCode"] == "NOT_FIXED_FOR_ERROR_STATE") {
        d["responseCode"] = "Clínica de transacciones: Código de manejo interno. Sólo aplica para la API de reportes.";
    }
    if (r["transactionResponse"]["responseCode"] == "ERROR_FIXING_AND_REVERSING") {
        d["responseCode"] = "Clínica de transacciones: Código de manejo interno. Sólo aplica para la API de reportes.";
    }
    if (r["transactionResponse"]["responseCode"] == "ERROR_FIXING_INCOMPLETE_DATA") {
        d["responseCode"] = "Clínica de transacciones: Código de manejo interno. Sólo aplica para la API de reportes.";
    }

    if (r["transactionResponse"]["state"] == "APPROVED") {
        d["status"] = "APPROVED";
        d["status_description"] = "Transacción aprobada";
        d["approved"] = true;
    } else
    if (r["transactionResponse"]["state"] == "DECLINED") {
        d["status"] = "DECLINED";
        d["status_description"] = "Transacción rechazada";
        d["approved"] = false;
    } else
    if (r["transactionResponse"]["state"] == "ERROR") {
        d["status"] = "ERROR";
        d["status_description"] = "Error procesando la transacción";
        d["approved"] = false;
    } else
    if (r["transactionResponse"]["state"] == "EXPIRED") {
        d["status"] = "EXPIRED";
        d["status_description"] = "Transacción expirada";
        d["approved"] = false;
    } else
    if (r["transactionResponse"]["state"] == "PENDING") {
        d["status"] = "PENDING";
        d["status_description"] = "Transacción pendiente o en validación";
        d["approved"] = false;
    } else
    if (r["transactionResponse"]["state"] == "SUBMITTED") {
        d["status"] = "PENDING";
        d["status_description"] = "Transacción enviada a la entidad financiera y por algún motivo no terminó su procesamiento. Sólo aplica para la API de reportes.";
        d["approved"] = false;
    }
    if (testing === true) {
        d["status"] = "APPROVED";
        d["status_description"] = "Transacción aprobada (modo pruebas)";
        d["approved"] = true;
        d["responseCode"] = "La transacción fue aprobada (modo pruebas)";
    }
    return d;
}

function minutesToMilisegs(minutos) {
    var mins = 0;
    var milisegsMinute = 60000;
    mins = milisegsMinute * minutos;
    return mins;
}

function fechasPorRango(fechaInicial, fechaFinal) {
    var fechaInicio = new Date(fechaInicial);
    var fechaFin = new Date(fechaFinal);
    var r = [];
    while (fechaFin.getTime() >= fechaInicio.getTime()) {
        fechaInicio.setDate(fechaInicio.getDate() + 1);
        var dia = fechaInicio.getDate();
        if (dia.toString().length === 1) {
            dia = "0" + dia;
        }
        var mes = (fechaInicio.getMonth() + 1);
        if (mes.toString().length === 1) {
            mes = "0" + mes;
        }
        var f = fechaInicio.getFullYear() + '-' + mes + '-' + dia;
        r.push(f);
    }
    return r;
}

function urlify(text) {
    var urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.replace(urlRegex, function (url) {
        return '<a href="' + url + '">' + url + '</a>';
    });
    /*
     or alternatively
     return text.replace(urlRegex, '<a href="$1">$1</a>')
     */
}

function checkLoginState(callback) {
    FB.getLoginStatus(function (response) {
        statusChangeCallback(response, callback);
    });
}
function statusChangeCallback(response, callback) {
    if (response.status === 'connected') {
        /*
         FB.api('/me?fields=name,email,gender,age_range,picture,location{location{country, country_code, city, city_id, latitude, longitude, region, region_id, state, street, name}}', {fields: 'name,last_name,first_name,email,picture,birthday'}, function (response) {
         */
        FB.api('/me?fields=name,email,gender,age_range,picture', {fields: 'name,last_name,first_name,email,picture,birthday'}, function (response) {
            /*
             FB.login(function (response) {}, {scope: 'email,public_profile'});
             FB.login(function (response) {}, {scope: 'email,public_profile,user_location'});
             */
            console.log('Successful login for: ' + response.name, response);
            if (typeof callback !== "undefined") {
                callback(response);
            }
        });
    } else {
        FB.login(function (response) {
            if (typeof callback !== "undefined") {
                callback(response);
            }
        }, {scope: 'email,public_profile'});
    }
}

function loadSDKFB(appid, callback) {
    if (isloadFacebookSDKShared === false) {
        (function (d, s, id) {
            var js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id))
                return;
            js = d.createElement(s);
            js.id = id;
            js.src = "https://connect.facebook.net/en_US/sdk.js";
            fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', 'facebook-jssdk'));
    }

    window.fbAsyncInit = function () {
        FB.init({
            appId: appid,
            cookie: true,
            xfbml: true,
            version: 'v3.2'
        });
        FB.getLoginStatus(function (response) {
            if (typeof callback !== "undefined") {
                callback(response);
            }
        });
    };
    if (typeof FB !== "undefined") {
        FB.getLoginStatus(function (response) {
            if (typeof callback !== "undefined") {
                callback(response);
            }
        });
    }
}

isloadFacebookSDKShared = false;
function loadFacebookSDKShared() {
    if (isloadFacebookSDKShared === true) {
        return true;
    }
    var r = "";
    r += ' <!-- Load Facebook SDK for JavaScript -->\n\
  <div id="fb-root"></div>\n\
  <script>(function(d, s, id) {\n\
    var js, fjs = d.getElementsByTagName(s)[0];\n\
    if (d.getElementById(id)) return;\n\
    js = d.createElement(s); js.id = id;\n\
    js.src = "https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v3.0";\n\
    fjs.parentNode.insertBefore(js, fjs);\n\
  }(document, \'script\', \'facebook-jssdk\'));</script>';
    $("body").append(r);
    isloadFacebookSDKShared = true;
}
function changeStyleRel(self) {
    self.rel = "stylesheet";
}


function isDefined(object) {
    return object !== undefined && object !== null;
}

function isNotEmpty(string) {
    return isDefined(string) && string.length > 0;
}

function updateUrlParam(name, value) {
    var urlInfo = decodeURI(window.location.href).split('?');
    var path = urlInfo[0];
    var query = urlInfo[1];

    var params = '';
    var anchor = null;
    if (isNotEmpty(query)) {
        var queryInfo = query.split('#');
        query = queryInfo[0];
        anchor = queryInfo[1];

        queryInfo = query.split('&');
        for (var i = 0; i < queryInfo.length; ++i) {
            if (queryInfo[i].split('=')[0] !== name) {
                params += '&' + queryInfo[i];
            }
        }
    } else {
        var queryInfo = path.split('#');
        query = queryInfo[0];
        anchor = queryInfo[1];
        if (isNotEmpty(query)) {
            path = query;
        }
    }
    query = '?' + name + '=' + value + params;
    if (isNotEmpty(anchor)) {
        query += '#' + anchor;
    }

    window.history.replaceState('', '', encodeURI(path + query));
}

function addClassNew(el, cls) {
    if (el.classList) {
        el.classList.add(cls);
    } else {
        var cur = ' ' + (el.getAttribute('class') || '') + ' ';
        if (cur.indexOf(' ' + cls + ' ') < 0) {
            setClass(el, (cur + cls).trim());
        }
    }
}
function removeClassNew(el, cls, isWidget) {
    var di = null;
    if (isWidget === true) {
        di = el;
        di.classList.remove(cls);
    } else {
        di = document.querySelectorAll(el);
    }
    var t = di.length;
    for (var i = 0; i < t; i++) {
        var d = di[i];
        d.classList.remove(cls);
    }
}
function formatKey(val) {
    val = val.replace(/_/gi, ' ');
    val = val.replace(/text/gi, '');
    return val;
}

function addVarInUrl(variable) {
    var get = getGET();
    var url = location.protocol + "//" + location.host;
    if (typeof url.split("?")[1] !== "undefined") {
        url += "&";
    } else {
        url += "?";
    }
    url += variable;
    if (get) {
        $.each(get, function (key, value) {
            if (key !== "createLogin" && key !== "createAccount") {
                url += "&" + key + "=" + encodeURIComponent(value);
            }
        });
    }
    return url;
}

selfDataCountryIP = null;
function getDataCountryIP(callback) {
    if (selfDataCountryIP !== null) {
        return callback(selfDataCountryIP);
    }
    if (navigator.onLine === false) {
        var data = {};
        data.referrer = document.referrer;
        selfDataCountryIP = data;
        return callback(data);
    }
    window.visitor_loaded = function () {
        var r = visitor;
        var data = {};
        data.all = r;
        data.referrer = r.orig_session.referrer;
        if (typeof r.location === "undefined" || r.location === null) {
            return getDataCountryIPOld(callback, data);
        }
        data.languages = r.locale.lang + "-" + r.locale.country;
        data.latitude = r.location.address.latitude;
        data.longitude = r.location.address.longitude;
        data.country_name = r.location.address.country;
        data.city = r.location.address.city;
        selfDataCountryIP = data;
        return callback(data);
    };
    window.visitor_opts = {enable_location: true, session_days: 5};
    loadJs("/nwlib6/nwproject/modules/webrtc/v2/js/visitor.js", function () {
    });
    return true;
}

function getDataCountryIPOld(callback, r) {
    function reqListener() {
        var data = JSON.parse(this.responseText);
        if (typeof r !== "undefined") {
            if (typeof r.referrer !== "undefined") {
                data.referrer = r.referrer;
            }
        }
        selfDataCountryIP = data;
        return callback(data);
    }
    function reqError(err) {
        return callback('Fetch Error :-S', err);
    }
    var oReq = new XMLHttpRequest();
    oReq.onload = reqListener;
    oReq.onerror = reqError;
    oReq.open('get', 'https://ipapi.co/json/', true);
    oReq.send();
}

function textToVoice(text) {
    var synth = window.speechSynthesis;
    var utterThis = new SpeechSynthesisUtterance(text);
    utterThis.pitch = "0";
    utterThis.rate = "1";
    utterThis.lang = 'es-US';
    synth.speak(utterThis);
}


function currencyExchanges(base, symbols, callback) {
    /*
     fetch("http://data.fixer.io/api/convert?access_key=22d160756c45d1da89b00505fb5c014d&from=USD&to=COP")
     fetch("http://data.fixer.io/api/latest?access_key=22d160756c45d1da89b00505fb5c014d")
     fetch("http://api.currencylayer.com/live?access_key=2be03977256bd5901ce71fc903fbd78a&source=USD&currencies=COP")
     fetch("http://apilayer.net/api/live?access_key=2be03977256bd5901ce71fc903fbd78a&source=USD&currencies=COP")
     .then(respuesta => respuesta.json())
     .then(respuestaDecodificada => {
     console.log("respuestaDecodificada", respuestaDecodificada)
     });
     */
    var sym = "";
    if (symbols !== false) {
        sym = "&symbols=" + symbols;
    }
    fetch("https://openexchangerates.org/api/latest.json?app_id=c78bc6ec680c4ab48f1dddfff0cda62d&base=" + base + sym)
            /*fetch("https://api.exchangeratesapi.io/latest?base=USD")*/
            /*fetch("https://api.exchangeratesapi.io/latest?base=USD&symbols=MXN")*/
            .then(respuesta => respuesta.json())
            .then(respuestaDecodificada => {
                callback(respuestaDecodificada);
            });
}

function getCurrencyByTimeZone(timezone) {
    var d = {};
    d["America/Bogota"] = "COP";
    d["America/Sao_Paulo"] = "COP";
    return d;
}


function iniciarBotonSoporte() {
    var div = document.createElement("div");
    div.className = "widgetTicketNw";
    div.id = "widgetTicketNw";
    div.innerHTML = "<div class='contText'><img class='img_nw' src='https://nwadmin.gruponw.com/app/tickets_widget/img/asistente.gif' /><p class='textWidget'> ¿Te podemos ayudar?</p><div class='btn_chat' > Chat de atención</div><div class='btn_crear' > Crear ticket</div><div class='btn_ver' > Histórico de tickets</div> </div> ";
    div.onclick = function () {
        this.classList.add('expandWidget');
    };
    document.body.appendChild(div);

    $(document).on("mouseleave", "#widgetTicketNw", function () {
        this.classList.remove('expandWidget');
    });

    $(document).on("click", ".btn_chat", function () {
        frameCrear('chat');
    });
    $(document).on("click", ".btn_crear", function () {
        frameCrear('crear');
    });
    $(document).on("click", ".btn_ver", function () {
        frameCrear('listar');
    });
    dragElement(div);
}
function frameCrear(tipo) {
    if (tipo == "chat") {
        var ancho = 400, alto = 600;
        var posicion_x;
        var posicion_y;
        posicion_x = (screen.width / 2) - (ancho / 2);
        posicion_y = (screen.height / 2) - (alto / 2);
        window.open('https://app.ringow.com/ringowEmbed/2/66480?onlyChat=true&callingChat=true', "popup", "width=" + ancho + ",height=" + alto + ",menubar=0,toolbar=0,directories=0,scrollbars=no,resizable=no,left=" + posicion_x + ",top=" + posicion_y + "");
        return;
    }
    var up = {};
    if (document.querySelector(".qx-window")) {
        up = qxnw.userPolicies.getUserData();
        up.lib = "qxnw";
    } else {
        up = getUserInfo();
        up.lib = "nwmaker";
    }
    up = JSON.stringify(up);
    var body = document.querySelector('body');
    var div = document.createElement('div');
    div.innerHTML = "<div class='header-bar'><div class='btn_close_wid'></div></div>";

    if (tipo == "listar") {
        div.style = "width: 1048px; height: 535px;";
    } else {
        div.style = "width: 551px; height: 535px;";
    }
    div.className = "contain-widget";
    var frame = document.createElement('iframe');
    frame.className = 'widgetCrear';
    frame.id = 'widgetCrear';
    frame.src = "https://nwadmin.gruponw.com/app/tickets_widget/index.php?action=" + tipo + "&up=" + up;
    div.appendChild(frame);
    body.appendChild(div);
    document.querySelector(".btn_close_wid").addEventListener("click", function () {
        div.remove();
    });
}
;

function submitformpayu(self) {
    function focusOnInput() {
        $("#valor_total_pay").focus();
    }
    var data = {};
    data["referencia"] = $(self + " .referenceCode").val();
    data["total"] = $(self + " .valor_total_pay").val();
    /*
     if (typeof data["total"] == 'undefined' || data["total"] < 11000) {
     nw_dialog("El monto mínimo que acepta el canal de pagos es de 11.000 COP", "Verificar monto", null, focusOnInput);
     return false;
     }
     */
    $.ajax({
        type: "POST",
        data: data,
        url: "/modules/nwcommerce2/src/formas_pago/payu_insertPayNw.php",
        error: function () {
            console.log("La operación no pudo ser procesada. Inténtelo de nuevo.");
        },
        success: function (data) {
            if (data != "") {
                nw_dialog(data);
                return false;
            }
            ;
            $(self).submit();
        }
    });
}
;

dragElement: function dragElement(elmnt) {
    var self = this;
    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    if (document.getElementById(elmnt.id)) {
        /* if present, the header is where you move the DIV from:*/
        document.getElementById(elmnt.id).onmousedown = dragMouseDown;
    } else {
        /* otherwise, move the DIV from anywhere inside the DIV:*/
        elmnt.onmousedown = dragMouseDown;
    }
    ;

    function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;
    }
    ;

    function elementDrag(e) {
        elmnt.classList.remove('expandWidget');
        e = e || window.event;
        e.preventDefault();
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        if (elmnt.offsetTop < -11 && pos2 > 0 || elmnt.offsetTop > screen.height - 150 && pos2 < 0 || elmnt.offsetLeft < -11 && pos1 > 0 || elmnt.offsetLeft > screen.width - 50 && pos1 < 0) {
            return;
        }
        elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
        elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";

    }
    ;

    function closeDragElement() {
        /* stop moving when mouse button is released:*/
        document.onmouseup = null;
        document.onmousemove = null;
    }
}

function validateElementIfExist(element, callback) {
    if (!element) {
        setTimeout(function () {
            validateElementIfExist(element, callback);
        }, 300);
        return;
    }
    callback(element);
}

function cierraSesionInfo() {
    nw_dialog("Su sesión ha expirado, vuelva a ingresar por favor");
    setTimeout(function () {
        window.location.reload();
    }, 5000);
    return false;
}