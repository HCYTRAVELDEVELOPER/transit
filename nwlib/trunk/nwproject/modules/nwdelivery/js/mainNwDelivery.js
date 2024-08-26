var tiendaAbierta = true;
$(document).ready(function () {
    loadCss("/nwlib6/nwproject/modules/nwdelivery/style/main.css");
    if (isMobile()) {
        loadCss("/nwlib6/nwproject/modules/nwdelivery/style/mobile.css");
    }
    loadJs("/nwlib6/nwproject/modules/nwdelivery/js/forms/f_busca_direccion.js");
    loadJs("/nwlib6/nwproject/modules/nwdelivery/js/forms/f_ver_producto.js");
    loadJs("/nwlib6/nwproject/modules/nwdelivery/js/forms/f_direcciones.js");
    loadJs("/nwlib6/nwproject/modules/nwdelivery/js/forms/f_datos_tienda.js");

    loadJs("/nwlib6/nwproject/modules/nwdelivery/js/lists/l_categorias_lista.js");
    loadJs("/nwlib6/nwproject/modules/nwdelivery/js/lists/l_productos_lista.js");
    loadJs("/nwlib6/nwproject/modules/nwdelivery/js/lists/l_carrito_flotante.js");
    loadJs("/nwlib6/nwproject/modules/nwdelivery/js/lists/l_mis_direcciones.js");

    (function () {
        $('body').delegate('.cancelarPedidoEspera', 'click', function () {
            cancelPedido();
        });
    })();

});


function initNwDelivery() {
    compruebaAbiertoTienda(continueInitNwDelivery);
}
function continueInitNwDelivery() {
    revisaPedidoEnLinea();

    var divClassName = ".container-main-nwdelivery";
    initContainer(divClassName);

//    var d = new f_datos_tienda();
//    d.constructor();


    var get = getGET();
    if (typeof get["showProduct"] != "undefined") {

        loadHomeNwDelivery();

        loading("Cargando...", "rgba(255, 255, 255, 0.76)!important", false);

        var rpca = {};
        rpca["service"] = "nwdelivery";
        rpca["method"] = "consultaDataProductGet";
        rpca["data"] = {id: get["showProduct"]};
        var funcc = function (r) {
            var d = new l_productos_lista();
            d.constructor();
            d.loadShowProduct(r);
            removeLoading(false);
        };
        rpcNw("rpcNw", rpca, funcc, true);
    } else
    if (typeof get["createDelivery"] != "undefined") {
        loadMakePedido();
    } else {
        loadHomeNwDelivery();
    }
}
function loadMakePedido(self) {
    loadRightFuncTree(self, "loadHacerPedido", ".container-main-nwdelivery");
}
function loadProductUnitary(self, data) {
    loadRightFuncTree(self, "loadObjecProductUnitary", ".container-main-nwdelivery", data);
}
function loadObjecProductUnitary(data) {
    var d = new f_ver_producto();
    d.constructor(data);
}

function loadHomeNwDelivery(normal) {
    var up = getUserInfo();

    if (tiendaAbierta === true) {
        if (typeof up["direccion_envio"] == "undefined" && typeof normal == "undefined") {
            loadBuscaDireccionDelivery("referer");
        } else {
            loadBuscaDireccionDelivery(normal);
        }
    }
    if (!isMobile()) {
        loadCategoriasDelivery();
    }
    loadProductosDelivery();
    loadCarritoDelivery();
    if (isMobile()) {
        (function () {
            $('body').delegate('.titleCategories', 'click', function () {
                $(".titleCategories").removeClass("titleCategoriesActive");
                $(this).addClass("titleCategoriesActive");
                var number = $(this).attr("number");
                $(".container-productosgrupos-delivery  .container-table-list").fadeOut(0);
                $(".l_productos_lista_" + number + " .container-table-list").fadeIn(0);
                scrollPage("titleCategorie_" + number, 500, 50, false);
            });
        })();
        $(".l_carrito_flotante").fadeOut(0);
        $(".container-main-nwdelivery").append("<div class='showCarrito'>Ver Orden</div>");
        $(".showCarrito").click(function () {
            $(".showCarrito").fadeOut(0);
            $(".l_carrito_flotante").fadeIn(0);
            $(".container-main-nwdelivery").append("<div class='cerrarCarrito cerrarCarrito_div'>Cerrar</div>");

            if (isMobile()) {
                var self = ".l_carrito_flotante";
                var h1 = $(self + " .colMobilLabel_nombre_producto").height();
                var h2 = $(self + " .colMobilLabel_unidades").height();
                var h3 = $(self + " .colMobilLabel_adicionales").height();
                var h4 = $(self + " .colMobilLabel_valor_total").height();
                var h = parseInt(h1) + parseInt(h2) + parseInt(h3) + parseInt(h4) + 20;
                listAddCssFor(self, ".pColsIntListName_imagen_producto", {"width": "auto", "float": "left", "height": h + "px"}, "mobile");
            }
            $(".cerrarCarrito").click(function () {
                $(".showCarrito").fadeIn(0);
                $(".l_carrito_flotante").fadeOut(0);
                $(".cerrarCarrito").fadeOut(0);
            });
        });
    }

}

function loadBuscaDireccionDelivery(referer) {

    var up = getUserInfo();
    if (typeof up["cubierto"] == "undefined") {
        var d = new f_busca_direccion(referer);
        d.constructor();
    }
//    else {
//        var d = new f_busca_direccion(true);
//        d.constructor();
//    }
}

function loadCategoriasDelivery() {
    var d = new l_categorias_lista();
    d.constructor();
}
function loadProductosDelivery() {

    var self = ".container-main-nwdelivery";
    var classDocument = ".container-productosgrupos-delivery";
    createContainer(self, true, classDocument);

    loading("Cargando productos...", "rgba(255, 255, 255, 0.76)!important", self);

    var rpca = {};
    rpca["service"] = "nwdelivery";
    rpca["method"] = "consultaCategorias";
    rpca["data"] = {};
    var funcc = function (r) {
        var t = r.length;
        for (var i = 0; i < t; i++) {
            var p = r[i];
            var d = new l_productos_lista(classDocument, p["id"]);
            d.constructor(p["id"], i, function (row) {
                if (t == row + 1) {
                    removeLoading(self);

                    var obj = $(document);
                    loadScrollCategories(obj.scrollTop(), t);

                    $(".l_categorias_lista .colsMobil").removeClass("activeLInkMenu");
                    $(".l_categorias_lista .colsMobil_0").addClass("activeLInkMenu");

                    obj.scroll(function () {
                        var scroll = obj.scrollTop();
                        loadScrollCategories(scroll, t);
                    });

                    actionTiendaCerrada();

                }
            });
            addHeaderNoteList("<h3 id='titleCategorie_" + p["id"] + "' number='" + p["id"] + "' class='titleCategories tCat_" + i + " titleCategorie_" + p["id"] + "' >" + p["nombre"] + "</h3>", ".l_productos_lista_" + p["id"]);
        }
    };
    rpcNw("rpcNw", rpca, funcc, true);
}

function compruebaAbiertoTienda(callBack) {
    var rpca = {};
    rpca["service"] = "nwdelivery";
    rpca["method"] = "consultaAbiertoTienda";
    var funcc = function (r) {
        if (r != "SI") {
            tiendaAbierta = false;
        }
        callBack();
    };
    rpcNw("rpcNw", rpca, funcc, true);
}

function actionTiendaCerrada() {
    if (tiendaAbierta === false) {
        remove(".pColsIntListName_agregar");
        remove(".l_carrito_flotante");
        remove(".containerShowCerrado");

        var html = "";
        html += "<div class='containerShowCerrado'>";
        html += "Establecimiento cerrado";
        html += "</div>";
        $(".encMenuMobile").append(html);
    }
}

var ob = 1;
var catActive = 1;
var catAnterior = catActive;
function loadScrollCategories(scroll, total) {
    var mode = "baja";
    if (scroll > ob) {
        mode = "baja";
    } else
    if (scroll <= ob) {
        mode = "sube";
    }
    ob = scroll;
    if (catActive >= total) {
        catActive = total - 1;
        catAnterior = catActive;
    }
    if (catActive < 1) {
        catActive = 1;
        catAnterior = catActive;
    }

    var toplimit = 100;
    if (typeof $(".tCat_" + catAnterior).offset() == "undefined") {
        return;
    }
    var topAnterior = $(".tCat_" + catAnterior).offset().top;
    var top = $(".tCat_" + catActive).offset().top;
    var tFinal = top - scroll;
    var tFinalAnterior = topAnterior - toplimit;
    if (tFinal <= toplimit) {
        if (mode == "baja") {
            $(".l_categorias_lista .colsMobil").removeClass("activeLInkMenu");
            $(".l_categorias_lista .colsMobil_" + catActive).addClass("activeLInkMenu");
            catAnterior = catActive;
            catActive++;
        }
    } else
    if (scroll < tFinalAnterior) {
        if (mode == "sube") {
            catActive = catAnterior--;
            $(".l_categorias_lista .colsMobil").removeClass("activeLInkMenu");
            $(".l_categorias_lista .colsMobil_" + catActive).addClass("activeLInkMenu");
        }
    }
}

function loadCarritoDelivery(pr) {
    var d = new l_carrito_flotante();
    d.constructor(pr);
}

function loadDireccion() {
    var d = new f_direcciones();
    d.constructor();
}

function loadHacerPedido() {
    var self = ".container-main-nwdelivery";

    var get = getGET();

    var classDocument = ".container-pasos-delivery";
    createContainer(self, true, ".container-pasos-delivery");

    var html = "";
    html += "<div class='circle-pasos-delivery paso-1' id='circle_pasos'>";
    html += "<p>";
    html += "Paso 1";
    html += "</p>";
    html += "<span>";
    html += "Cuenta";
    html += "</span>";
    html += "</div>";

    html += "<div class='circle-pasos-delivery paso-2'>";
    html += "<p>";
    html += "Paso 2";
    html += "</p>";
    html += "<span>";
    html += "Dirección";
    html += "</span>";
    html += "</div>";

    html += "<div class='circle-pasos-delivery paso-3'>";
    html += "<p>";
    html += "Paso 3";
    html += "</p>";
    html += "<span>";
    html += "Pago";
    html += "</span>";
    html += "</div>";

    addHtmlForm(classDocument, html);

    var up = getUserInfo();
    var step = 1;

    if (typeof up["usuario"] != "undefined") {
        step = 2;
        if (typeof get["step"] != "undefined") {
            step = 3;
        } else {
            step = 2;
        }
    } else {
        step = 1;
    }


    if (get === false) {
        addHash(location.pathname + "?createDelivery" + location.hash);
    }

    if (step == 1) {
        loadStepOne();
    }
    if (step == 2) {
        loadStepTwo();
    }
    if (step == 3) {
        loadStepThree();
    }
}

function loadStepOne() {
    scrollPage("container-nwmaker", 500, 0, false);

    var self = ".container-main-nwdelivery";
    addHash(location.pathname + "?createDelivery" + location.hash);
    activeStep("1");
    var classDocument = ".login_delivery";
    var div = createContainer(self, true, classDocument);
    loginNw(div);

    var html = "";
    html += "<div class='volverAtrasPasosBig omitir'>Omitir registro</div>";
    addHtmlForm(".containerInitSession", html);

    $(self + " .omitir").click(function () {
        remove(".login_delivery");
        loadStepTwo();
    });

}
function loadStepTwo() {

    scrollPage("container-nwmaker", 500, 0, false);

    var self = ".container-main-nwdelivery";

    addHash(location.pathname + "?createDelivery" + location.hash);

    activeStep("2");

    loadDireccion();

//    $(".continuarHacerPedido").click(function () {
//        remove(".f_direcciones");
//        loadStepThree();
//    });

}
function loadStepThree() {
    scrollPage("container-nwmaker", 500, 0, false);

    var self = ".l_carrito_flotante";
    addHash(location.pathname + "?createDelivery&step=3" + location.hash);
    activeStep("3");
    var classDocument = ".step3_delivery";
    var div = createContainer(self, true, classDocument);

    loadCarritoDelivery(true);

    var html = "";
    html += "<div class='containerValoresAndButtons'>";
    html += "<div class='containerButtonsVals'>";
    html += "<div class='btnBlueBig continuarHacerPedido'>Finalizar</div>";
    html += "<div class='volverAtrasPasosBig volverADirecciones'>Volver atrás</div>";
    html += "</div>";
    html += "</div>";
    addHtmlForm(self, html);

    $(self + " .continuarHacerPedido").click(function () {
        loadingNw(false, true, true, "rgba(255, 255, 255, 0.76)!important", false, "Espera por favor, creando pedido...");

        var rpca = {};
        rpca["service"] = "nwdelivery";
        rpca["method"] = "crearPedidoOnline";
        rpca["data"] = {};
        var funcc = function (r) {
            if (r == "tienda_cerrada") {
                var params = {};
                params.html = "<h3>Lo sentimos, el sitio se encuentra cerrado.</h3>";
                createDialogNw(params);
                removeLoadingNw();
            } else
            if (r == "tienda_cerrada_temporalmente") {
                var params = {};
                params.html = "<h3>Lo sentimos, el sitio se encuentra cerrado temporalmente.</h3>";
                createDialogNw(params);
                removeLoadingNw();
            } else
            if (r === true) {
                respondeWIndowEsperaConfirmaPed();
            }
        };
        rpcNw("rpcNw", rpca, funcc, true);
    });
    $(self + " .volverADirecciones").click(function () {
        loading("Espera...", "rgba(255, 255, 255, 0.76)!important", self);
        addHash(location.pathname + "?createDelivery" + location.hash);
        setTimeout(function () {
            window.location.reload();
        }, 1000);
    });
}

function respondeWIndowEsperaConfirmaPed() {
    nw_dialog_func("<style>.ui-button{display: none!important;}</style><div class='pantallaEsperafinal'><div class='imgEsperandoPedido'></div><span class='textEsperaASerA'>Espera por favor, tienes un pedido en espera de ser atendido</span><div class='cancelarPedidoEspera'>Cancelar</div></div>");
    removeLoadingNw();
    loadingNw(false, true, true, "rgba(255, 255, 255, 0.76)!important", false, "Espera por favor, verificando...");
    confirmaPedidoPorTienda();
}

function revisaPedidoEnLinea() {
    var rpca = {};
    rpca["service"] = "nwdelivery";
    rpca["method"] = "revisaPedidoEnLinea";
    rpca["data"] = {};
    var funcc = function (r) {
        if (r === true) {
            respondeWIndowEsperaConfirmaPed();
        }
    };
    rpcNw("rpcNw", rpca, funcc, true);
}

function cancelPedido() {
    var rpca = {};
    rpca["service"] = "nwdelivery";
    rpca["method"] = "cancelPedido";
    rpca["data"] = {};
    var funcc = function (r) {
        if (r === true) {

            var params = {};
            params.html = "<h3 class='textPedidoCalcelado'>Pedido cancelado correctamente</div>";
            params.no_cancel_button = true;
            params.onSave = function () {
                reloadPageRaiz();
            };
            createDialogNw(params);
        }
    };
    rpcNw("rpcNw", rpca, funcc, true);
}

function activeStep(step) {
    $(".circle-pasos-delivery").removeClass("circle-active");
    $(".paso-" + step).addClass("circle-active");
}


loadsetTimeoutUno = "";
function confirmaPedidoPorTienda() {
    var rpca = {};
    rpca["service"] = "nwdelivery";
    rpca["method"] = "confirmaPedidoPorTienda";
    rpca["data"] = {};
    var funcc = function (r) {
        if (r == "no") {
            loadsetTimeoutUno = setTimeout(function () {
                confirmaPedidoPorTienda();
            }, 3000);
        } else
            responseConfirmaPedido(r);
    };
    rpcNw("rpcNw", rpca, funcc, true);
}

function responseConfirmaPedido(r) {
    if (r == "rechazado") {
        createWIndowEndPedido("Tu pedido ha sido rechazado por la tienda", false);
    } else
    if (r == "no_existe_el_pedido") {
        createWIndowEndPedido("No existe el pedido", false);
    } else {
        createWIndowEndPedido("¡Tu pedido ha sido confirmado!", true);
    }
}

function createWIndowEndPedido(title, moto) {
    $(".ui-dialog").remove();
    $(".ui-widget-overlay").remove();

    if (typeof loadsetTimeoutUno != "undefined") {
        window.clearTimeout(loadsetTimeoutUno);
    }

    var self = generateSelf();
    createNwForms(self, false, "popUp");
    var html = "";
    html += "<h2 style='text-align: center;'>" + title + "</h2>";
    if (moto === true) {
        html += "<div class='contain_moto'><img class='img_moto' src='/nwlib6/nwproject/modules/nwdelivery/img/Orden2.png' /><div class='piso_moto'></div></div>";
    }
    addHeaderNote(self, html);
    setModal(true);
    setWidth(self, 600);
    document.getElementById('operador_sound').play();
    navigator.vibrate([1000, 500, 1000, 500, 1000, 500, 1000, 500, 1000, 500, 1000, 500, 1000, 500, 1000, 500]);
    document.getElementById('usuario_sound').play();
    listAddCssFor(self, ".footerButtonsNwForms", {"text-align": "center"});
    var accept = addButtonNwForm("Aceptar", self);
    accept.addClass("btnContinuarPedido");
    accept.click(function () {
        reloadPageRaiz();
    });
    removeLoadingNw();
}