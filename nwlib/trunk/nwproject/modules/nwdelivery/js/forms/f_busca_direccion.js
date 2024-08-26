function f_busca_direccion(referer) {
    var isPopUp = false;
    if (typeof referer != "undefined") {
        if (referer != true) {
            isPopUp = true;
        }
    }
    if (isPopUp) {
        var self = generateSelf(".f_busca_direccion");
    } else {
        var classDocument = ".f_busca_direccion";
        createContainer(".container-main-nwdelivery", true, classDocument);
        var self = createDocument(classDocument);
    }

    var thisDoc = this;
    this.constructor = constructor;
    this.updateContend = updateContend;
    this.ubicaDirEnMapa = ubicaDirEnMapa;
    this.pointInMapIs = pointInMapIs;
    this.self = self;

    function constructor(r) {
        var fields = [
            {
                tipo: 'textField',
                nombre: 'id',
                name: 'id',
                visible: false
            },
            {
                tipo: 'selectBox',
                nombre: 'Ciudad',
                name: 'ciudad',
                requerido: "SI",
                visible: true
            },
            {
                tipo: 'textField',
                nombre: 'Dirección',
                name: 'address',
                requerido: "SI",
                autocomplete: false,
                texto_ayuda: "Digita tu dirección"
            },
            {
                tipo: 'button',
                nombre: 'Comprobar Cobertura',
                name: 'buscar'
            },
            {
                tipo: 'textField',
                nombre: 'Latitud',
                name: 'latitud',
                texto_ayuda: 'latitud',
                requerido: "SI",
                visible: false
            },
            {
                tipo: 'textField',
                nombre: 'Longitud',
                name: 'longitud',
                texto_ayuda: 'longitud',
                requerido: "SI",
                visible: false
            }
        ];


        if (referer == "externo") {
            createNwForms(self, fields, "nopopUp");
            $(".addDivConverted").css({"margin-top": "60px", "margin-bottom": "100px"});
        } else
        if (isPopUp) {
            createNwForms(self, fields, "popUp");
            addHeaderNote(self, "<h3 class='titleCobertura'>Cobertura, ingresa tu dirección</h3>");
        } else {
            createNwForms(self, fields, "nopopUp");
        }

        remove(".ui-dialog-titlebar-close");

        populateSelect(self, "ciudad", "nwdelivery", "consultaCiudadesTexto", {});

        setMaxWidth(self, 800);

        var up = getUserInfo();

        loading("Cargando", "rgba(255, 255, 255, 0.76)!important", self);
        getMyUbic(function (r) {
            var gps = getUbicGeoUser();
            var latInit = gps["lat"];
            var lngInit = gps["lng"];

            if (evalueData(gps["direccion"])) {
                setValue(self, "address", gps["direccion"]);
            } else {
                setValue(self, "address", up.direccion);
            }
            setValue(self, "latitud", gps["lat"]);
            setValue(self, "longitud", gps["lng"]);

            var crearMapa = true;
            if (referer == true) {
                crearMapa = false;
            }
            if (crearMapa) {
                addFooterNote(self, "<div class='mapa'></div>");
                setTimeout(function () {
                    var wi = "250px";
                    if (isMobile()) {
                        wi = "150px";
                    }
                    var map = createGoogleMap(latInit, lngInit, "100%", wi, ".mapa");
                    var marker1 = addPointInGoogleMap(map, latInit, lngInit);
                    dragMarkerMap(map, marker1, function (g) {
                        setValue(self, "address", g["direccion"]);
                        setValue(self, "latitud", g["lat"]);
                        setValue(self, "longitud", g["lng"]);
                    });
                    var btn = selfButton(self, "buscar");
                    btn.click(function () {
                        ubicaDirEnMapa(self, map);
                    });
                    setContainerGeoSuggestions(self + " .contain_input_name_address");
                    $(self + " .contain_input_name_address").keyup(function () {
                        ubicaDirEnMapa(self, map);
                    });
                }, 1000);
            } else {
                var btn = selfButton(self, "buscar");
                btn.click(function () {
                    if (!validateRequired(self)) {
                        nw_dialog("<h3>Verifique que su direccion</h3>");
                        return;
                    }
                    var data = getRecordNwForm(self);
                    loadingNw(false, true, true, "rgba(255, 255, 255, 0.76)!important", false, "Estamos verificando tu cobertura, espera por favor...");
                    pointInMapIs(self, data["latitud"], data["longitud"]);
                });
                setContainerGeoSuggestions(".contain_input_name_address");
                $(".contain_input_name_address").keyup(function () {
                    ubicaDirEnMapa(self, null);
                });
//                getLatAndLong(up, self);
            }

            if (isPopUp) {
                setVisibility(self, "buscar", false);
                var accept = addButtonNwForm("Aceptar", self);
                accept.addClass("btnBlueBig");
                accept.click(function () {
                    if (!validateRequired(self)) {
                        nw_dialog("<h3 class='verifiqueCobInfo'>Por favor digita tu dirección para verificar la cobertura</h3>");
                        return;
                    }
                    var data = getRecordNwForm(self);
                    loadingNw(false, true, true, "rgba(255, 255, 255, 0.76)!important", false, "Estamos verificando tu cobertura, espera por favor...");
                    pointInMapIs(self, data["latitud"], data["longitud"]);
                });
                var cancel = addButtonNwForm("Cerrar", self);
                cancel.addClass("btn_forms");
                cancel.addClass("btn_cerrar_mapa");
                cancel.click(function () {
                    reject(self);
                    loadHomeNwDelivery(true);
                });
                listAddCssFor(self, ".btnBlueBig", {"position": "relative"});
                listAddCssFor(self, ".btn_cerrar_mapa", {"position": "relative"});
                listAddCssFor(self, "", {"background-color": "#fff"});

                listAddCssFor(".containDialogNwForm_f_busca_direccion", ".ui-dialog-titlebar", {"display": "block"}, "mobile");

                listAddCssFor(self, "#nwform", {"overflow": "initial"}, "mobile");

                setTitleForm(self, "Domicilios Online");
                addCssTitleForm(self, {"color": "#fff"});

                setTimeout(function () {
                    scrollPage("container-nwmaker", 500, 0, false);
                }, 2000);
            }

            console.log(isPopUp);
            if (isPopUp === false) {
                $(".footerButtonsNwForms").remove();
                $(".divSendNwForm").remove();

                addCss(self, "", {"left": "190px", "float": "left"});

            }

            addCss(self, ".containFormFields", {"overflow": "inherit"});

            listAddCssFor(self, ".divContainInput p", {"display": "none"});
//            listAddCssFor(self, ".address", {"width": "100%", "max-width": "600px", "border": "0"});
            listAddCssFor(self, ".address", {"width": "100%", "max-width": "600px"});
            if (!isMobile()) {
                listAddCssFor(self, ".divContainInput", {"width": "auto", "min-width": "initial"});
                listAddCssFor(self, ".ciudad", {"width": "100px"});
                listAddCssFor(self, ".address", {"width": "450px"});
            }
//            listAddCssFor(self, ".buscar", {"font-weight": "lighter", "width": "145px", "padding": "13px", "margin": "0px", "background": "#26d526", "border": "0"});
            listAddCssFor(self, ".buscar", {"font-weight": "lighter", "width": "145px", "padding": "13px", "margin": "0px", "background": "#26d526"});
            listAddCssFor(self, ".divContainInputIntern", {"margin": "0px"});

            removeLoading(self);
        });

    }

    function ubicaDirEnMapa(self, map, field) {
        var data = getRecordNwForm(self);
        var dir = data["address"];
        if (typeof field != "undefined") {
            dir = data[field];
        }
        if (dir == "") {
            $(".ulothermap").remove();
            return;
        }
        var address = data["ciudad"] + " " + dir;
        ubicaEnMapaGoogle(address, map, "getLatAndLong", self);
    }

    statusGeoGoo = false;
    function pointInMapIs(self, pointX, pointY, callBack, noMessage) {
        statusGeoGoo = false;
        var tienda = "1";
        var rpc = {};
        rpc["service"] = "nwdelivery";
        rpc["method"] = "getTiendasByCliente";
        rpc["data"] = {tienda: tienda};
        var func = function (r) {
            if (!r) {
                var params = {};
                params.html = "<p class='infoNoHayTienda'>Lo sentimos, no hay tiendas</p>";
                createDialogNw(params);

                return false;
            } else {
                for (var i = 0; i < r.length; i++) {
                    if (statusGeoGoo === true) {
                        break;
                    }
                    var terminal = r[i].id;
                    var rpca = {};
                    rpca["service"] = "nwdelivery";
                    rpca["method"] = "getCoberturaPorPunto";
                    rpca["data"] = {tienda: tienda, terminal: terminal};
                    var funcc = function (ra) {
                        if (!ra) {
                        } else {
                            var triangleCoords = [];
                            for (var i = 0; i < ra.length; i++) {
                                var x = parseFloat(ra[i].x);
                                var y = parseFloat(ra[i].y);
                                var coor = {lat: x, lng: y};
                                triangleCoords.push(coor);
                            }
                            var bermudaTriangle = new google.maps.Polygon({paths: triangleCoords});
                            var myPosition = new google.maps.LatLng(pointX, pointY);
                            var status = google.maps.geometry.poly.containsLocation(myPosition, bermudaTriangle);
                            var response = "NO";
                            var sede = "";
                            var sede_nombre = "";
                            if (status) {
                                statusGeoGoo = true;
                                response = "SI";
                                sede = ra[0].terminal;
                                sede_nombre = ra[0].terminal_text;
                                responseGeoLocaliza(self, response, sede, callBack, noMessage);
                                return;
                            }
                        }
                    };
                    rpcNw("rpcNw", rpca, funcc, false);
                }
                if (statusGeoGoo === false) {
                    responseGeoLocaliza(self, "NO");
                }
            }
        };
        rpcNw("rpcNw", rpc, func, true);
    }


    function responseGeoLocaliza(self, response, terminal, callBack, noMessage) {
        var data = getRecordNwForm(self);
        data["terminal"] = terminal;
        var rta = "";
        if (response == "NO") {

            var params = {};
            params.html = "<p class='textNoCubre'>lo sentimos, estas por fuera de nuestra cobertura</p>";
            createDialogNw(params);

            removeLoadingNw();
        } else {
            var rpca = {};
            rpca["service"] = "nwdelivery";
            rpca["method"] = "finalizaCoberturaOk";
            rpca["data"] = data;
            var funcc = function (ra) {
                if (noMessage == true) {
                    if (typeof callBack != "undefined") {
                        callBack(ra);
                    }
                    return;
                }

                var params = {};
                params.html = "<h3 class='textExcelentCobertura'>Excelente! Estas cubierto por " + ra["nombre"] + ".</h3>";
                params.no_cancel_button = true;
                params.onSave = function () {
                    if (typeof callBack != "undefined") {
                        callBack(ra);
                    } else {
                        window.location.reload();
                    }
                };
                createDialogNw(params);

                removeLoadingNw();

            };
            rpcNw("rpcNw", rpca, funcc, true);
        }
//    addFooterNote(self, "<div class='mapa'></div>");
//    var map = createGoogleMap(4.598056, -74.07583299999999, "100%", "300px", ".mapa");
//    addPointInGoogleMap(map, 4.598056, -74.07583299999999);
//    addPointInGoogleMap(map, 4.598056, -72.07583299999999);
    }

    function updateContend() {

    }
}

function getLatAndLong(data, self) {
    setValue(self, "latitud", data["latitud"]);
    setValue(self, "longitud", data["longitud"]);
    $(self + " .btnOrange").removeClass("btnDisabled");
}

function changeDirectionMap(data) {
    $("#address").val(data);
}