function l_main(self) {
    if (self === "execFunc") {
        var self = generateSelf(false, true);
    } else {
        var self = generateSelf(self);
    }
    var thisDoc = this;
    this.constructor = constructor;
    this.self = self;
    var up = getUserInfo();
    function constructor() {

        createTreeNwMaker(self);
        var fields = [
            {
                type: 'carpet',
                label: 'Pagos Epayco',
                name: 'pagos_epayco',
                depend: false
            },
            {
                type: 'carpet',
                label: 'Imagen phpthumb',
                name: 'imagen_phpthumb',
                depend: false
            },
            {
                type: 'carpet',
                label: 'Create event outlook',
                name: 'event_outlook',
                depend: false
            },
            {
                type: 'carpet',
                label: 'Send SMS',
                name: 'send_sms',
                depend: false
            },
            {
                type: 'carpet',
                label: 'Loading (example)',
                name: 'nwloading_example',
                depend: false
            },
            {
                type: 'carpet',
                label: 'Loading (code)',
                name: 'nwloading',
                depend: false
            },
            {
                type: 'carpet',
                label: 'NwDialog new',
                name: 'nwdialognew',
                depend: false
            },
            {
                type: 'carpet',
                label: 'Sacar ubicación por GPS',
                name: 'sacarubicaciongps',
                depend: false
            },
            {
                type: 'carpet',
                label: 'Agregar link al menú con JS',
                name: 'add_link',
                depend: false
            },
            {
                type: 'carpet',
                label: 'Crear maestro',
                name: 'crear_maestro',
                depend: false
            },
            {
                type: 'carpet',
                label: 'Crear maestro options',
                name: 'crear_maestro_options',
                depend: false
            },
            {
                type: 'carpet',
                label: 'Listado',
                name: 'listado',
                depend: false
            },
            {
                type: 'carpet',
                label: 'Abrir Listado en popup',
                name: 'listado_popup',
                depend: false
            },
            {
                type: 'carpet',
                label: 'Listado paginación',
                name: 'listado_paginacion',
                depend: false
            },
            {
                type: 'carpet',
                label: 'Listado data filters',
                name: 'listado_datafilters',
                depend: false
            },
            {
                type: 'carpet',
                label: 'Listado action al cambiar un select',
                name: 'listado_actionchangeselect',
                depend: false
            },
            {
                type: 'carpet',
                label: 'Listado populateSelect',
                name: 'listado_populateSelect',
                depend: false
            },
            {
                type: 'carpet',
                label: 'Listado data selected record',
                name: 'listado_selected_record',
                depend: false
            },
            {
                type: 'carpet',
                label: 'Listado add contexmenu',
                name: 'listado_add_contexmenu',
                depend: false
            },
            {
                type: 'carpet',
                label: 'Listado action contexmenu',
                name: 'listado_action_contexmenu',
                depend: false
            },
            {
                type: 'carpet',
                label: 'Listado eliminar registro',
                name: 'listado_eliminar_registro',
                depend: false
            },
            {
                type: 'carpet',
                label: 'Forms grupos',
                name: 'forms_grupos',
                depend: false
            },
            {
                type: 'carpet',
                label: 'Formulario PopUp',
                name: 'formulariopopup',
                depend: false
            },
            {
                type: 'carpet',
                label: 'Formulario No Popup',
                name: 'formularionopopup',
                depend: false
            },
            {
                type: 'carpet',
                label: 'Formulario Tipos inputs',
                name: 'formTiposInputs',
                depend: false
            },
            {
                type: 'carpet',
                label: 'Formulario acción en botón',
                name: 'actioninbuttonform',
                depend: false
            },
            {
                type: 'carpet',
                label: 'Formulario getRecordNwForm',
                name: 'getRecordNwForm',
                depend: false
            },
            {
                type: 'file',
                label: 'googleMaps Buscar dirección',
                name: 'googlemaps_buscadir',
                depend: false
            },
            {
                type: 'file',
                label: 'googleMaps Trazar PolyLine',
                name: 'googlemaps_poly',
                depend: false
            },
            {
                type: 'file',
                label: 'Abrir Chat',
                name: 'open_chat',
                depend: false
            },
            {
                type: 'file',
                label: 'Abrir chat con usuario',
                name: 'open_chat_width_user',
                depend: false
            },
            {
                type: 'file',
                label: 'NwForm New',
                name: 'nwformnew',
                depend: false
            },
            {
                type: 'file',
                label: 'CODE Zona de Pagos',
                name: 'ApiNwPayCode',
                depend: false
            },
            {
                type: 'file',
                label: 'CODE ApiNwPay Crédito',
                name: 'code_ApiNwPayCredit',
                depend: false
            },
            {
                type: 'file',
                label: 'Zona de Pagos',
                name: 'ApiNwPay',
                depend: false
            },
            {
                type: 'file',
                label: 'ApiNwPay Crédito',
                name: 'ApiNwPayCredit',
                depend: false
            },
            {
                type: 'file',
                label: 'ApiNwPay Débito',
                name: 'ApiNwPayDebito',
                depend: false
            },
            {
                type: 'file',
                label: 'Crear Notificación desde PHP',
                name: 'crear_notifica',
                depend: false
            },
            {
                type: 'file',
                label: 'Notificaciones Push JS (mobile and desktop)',
                name: 'push',
                depend: false
            },
            {
                type: 'file',
                label: 'Valida WebSite',
                name: 'checkwebsite',
                depend: false
            },
            {
                type: 'file',
                label: 'Ver mi IP',
                name: 'vermiip',
                depend: false
            },
            {
                type: 'file',
                label: 'Simular error',
                name: 'simular_error',
                depend: false
            }
        ];
        addFieldsLeftInTree(self, fields);
//        if ('serviceWorker' in navigator) {
//            window.addEventListener('load', function () {
//                navigator.serviceWorker.register('/sw.js').then(function (registration) {
//                    console.log('ServiceWorker registration successful with scope: ', registration.scope);
//                }).catch(function (err) {
//                    console.log('ServiceWorker registration failed: ', err);
//                });
//            });
//        } else {
//            console.log("no serviceWorker");
//        }
//        addCss(self, ".container-treenwmIntern", {"height": "10000px"});

        selfButton(self, "event_outlook").click(function () {
            var d = new event_outlook();
            d.constructor();
        });
        selfButton(self, "send_sms").click(function () {
            var d = new send_sms();
            d.constructor();
        });
        selfButton(self, "imagen_phpthumb").click(function () {
            var params = {};
            var html = "";
            html += "var file = 'ruta_imagen';<br />";
            html += "var mode = false; //nophpthumb no lo convierte<br />";
            html += "var w = 180;<br />";
            html += "getFileByType(file, mode, w);<br />";
            params.html = html;
            createDialogNw(params);
        });
        selfButton(self, "listado_popup").click(function () {
            var params = {};
            var html = "";
            html += 'var params = {};<br />\n\
        params.showButonsEnc = true;<br />\n\
        createList(columns, self, "popup", params);';
            params.html = html;
            createDialogNw(params);
        });
        selfButton(self, "nwloading").click(function () {
            var params = {};
            var html = "";
            html += "TODO EN JAVASCRIPT (mode is optional or = allWindow o append): <br /> OPCION 1: newLoading(self, textShow, css, mode);<br />";
            html += "OPCION 2: newLoadingTwo(self, textShow, css, mode); <br />";
            html += "REMOVE: newRemoveLoading(self); <br />";
            params.html = html;
            createDialogNw(params);
        });
        selfButton(self, "nwloading_example").click(function () {
            var params = {};
            params.html = "<div class='containloadingexample'>Texto cargando...<br /><br /><br /><br /></div>";
            var s = createDialogNw(params);
            newLoadingThree(s + " .containloadingexample", "Texto cargando ejemplo...", "");
        });
        selfButton(self, "sacarubicaciongps").click(function () {
            var params = {};
            var html = "TODO EN JAVASCRIPT: getPositionGPS(function (gps) { console.log(gps); });";
            params.html = html;
            createDialogNw(params);
        });
        selfButton(self, "simular_error").click(function () {
            var data = {};
            var rpc = {};
            rpc["service"] = "nwMaker";
            rpc["method"] = "simulateError";
            rpc["data"] = data;
            var func = function (r) {
                removeLoading(self);
                if (!verifyErrorNwMaker(r)) {
                    return;
                }
            };
            rpcNw("rpcNw", rpc, func, true);
        });
        selfButton(self, "add_link").click(function () {
            var params = {};
            var html = "\
        //Nota: Si va a poner links verticales debe poner antes esto   createMenuVerticalNwMaker();<br />\n\
        var r = {};<br />\n\
        r.nombre = 'Agregar nuevo sitio';<br />\n\
        r.id = '1';<br />\n\
        r.callback = '1';<br />\n\
        r.contiene_hijos = 'NO';<br />\n\
        r.limpiar_modulos_center = 'NO';<br />\n\
        r.change_url = 'NO';<br />\n\
        r.ocultar_menu_on_click = 'NO';<br />\n\
        r.emptycenter = 'NO';<br />\n\
        r.vertical = true;<br />\n\
        r.solo_registrados = 'SI';<br />\n\
        r.execCallBack = function () {<br />\n\
            addNewSite();<br />\n\
        };<br />\n\
        addLinkMenuMaker(r);\n\
";
            params.html = html;
            createDialogNw(params);
        });
        selfButton(self, "vermiip").click(function () {
//            loadJs("/nwlib6/nwproject/modules/webrtc/js/getIP.js");
            loadJs("/nwlib6/nwproject/modules/webrtc/js/getIP2.js");
            getIPs(function (d) {
                console.log(d);
                var ip = d.ip;
                var red = d.id_red;
                var params = {};
                var html = "";
                html += "<p>";
                html += " MI IP: " + ip;
                html += " ID RED: " + red;
                html += "</p>";
                params.html = html;
                createDialogNw(params);
            });
        });
        selfButton(self, "formTiposInputs").click(function () {
            loadJs("/nwlib6/nwproject/modules/examplesNwMaker/forms/formTiposInputs.js");
            var d = new formTiposInputs();
            d.constructor();
        });
        selfButton(self, "checkwebsite").click(function () {
            loadJs("/nwlib6/nwproject/modules/examplesNwMaker/forms/f_check_web_site.js");
            var d = new f_check_web_site();
            d.constructor();
        });
        selfButton(self, "crear_notifica").click(function () {
            var params = {};
            var html = "";
            html += "<p>";
            html += " Al crear una notificación desde Php esta llega al buzón del usuario que usted quiere, también llega notificación PUSH, de escritorio y en el aplicativo. <br /><br />";
            html += "</p>";
            html += "<strong>EJEMPLO</strong>:<br />\n\
            $a = Array();<br />\n\
            $a['destinatario'] = 'correo@destinatario.com';<br />\n\
            $a['body'] = 'Hola, este es el cuerpo del mensaje';<br />\n\
            $a['tipo'] = 'n_min'; //opcional<br />\n\
            $a['link'] = 'https://www.gruponw.com/'; //opcional, abre un link url<br />\n\
            $a['modo_window'] = 'popup';  //opcional, popup abre normal, alert abre ventana más grande<br />\n\
            $a['fechaAviso'] = date('Y-m-d H:i:s'); //opcional<br />\n\
            $a['sendEmail'] = true;//opcional true or false envía correo<br />\n\
            $a['titleMensaje'] = 'Petro requiere permisos';<br />\n\
            $a['callback'] = 'myFunction(5);'; //opcional al aceptar notificación ejecuta esto<br />\n\
            nwMaker::notificacionNwMaker($a);<br />\n\
";
            html += "</p>";
            params.html = html;
            createDialogNw(params);
        });
        selfButton(self, "push").click(function () {
            notificationPush("Hola esta es una prueba!", "", "Hola!");
            var params = {};
            var html = "";
            html += "<p>";
            html += " notificationPush(theBody, theIcon, theTitle, array) ";
            html += "</p>";
            html += "<p>";
            html += " EN ESTE EJEMPLO: notificationPush('Hola esta es una prueba!'', '/imagenes/logo.jpg'', 'Hola!''); ";
            html += "</p>";
            params.html = html;
            createDialogNw(params);
        });
        selfButton(self, "ApiNwPayCode").click(function () {
            var params = {};
            var html = "";
            html += "<p>";
            html += "    var x = {};\n\
            x['wayToPay'] = 'selectService';\n\
            x['saldo'] = function () {\n\
                var data = {};\n\
                data['pruebas'] = 'SI';\n\
                priceSegure('10000', function (v) {\n\
                    var p = {};\n\
                    p['data'] = data;\n\
                    p['noReject'] = true;\n\
                    p['type'] = 'payu';\n\
                    p['wayToPay'] = 'saldo';\n\
                    p['price'] = '10000';\n\
                    p['price_segure'] = v;\n\
                    p['callBack'] = function (r) {\n\
                        console.log(r);\n\
                        var params = {};\n\
                        params.html = 'callBack posterior... en consola sale la respuesta y ahí puedo decidir qué hacer.';\n\
                        params.textAccept = 'Continuar';\n\
                        params.no_cancel_button = true;\n\
                        params.onSave = function () {\n\
                            return true;\n\
                        };\n\
                        createDialogNw(params);\n\
                    };\n\
                    var d = new apiNwPay(p);\n\
                    d.open();\n\
                });\n\
            };\n\
            x['credito'] = function () {\n\
                var data = {};\n\
                data['pruebas'] = 'SI';\n\
                var p = {};\n\
                p['service'] = 'nwMaker';\n\
                p['method'] = 'apiNwPayTesting';\n\
                p['data'] = data;\n\
                p['noReject'] = true;\n\
                p['type'] = 'payu';\n\
                p['wayToPay'] = 'credito';\n\
                p['callBack'] = function (r) {\n\
                    console.log(r);\n\
                    var params = {};\n\
                    params.html = 'callBack posterior a la respuesta del banco, en la consola se puede ver lo que devuelve...';\n\
                    params.textAccept = 'Listo, que bien!';\n\
                    params.no_cancel_button = true;\n\
                    params.onSave = function () {\n\
                        return true;\n\
                    };\n\
                    createDialogNw(params);\n\
                };\n\
                var d = new apiNwPay(p);\n\
                d.open();\n\
            };\n\
            x['debito'] = function () {\n\
                var data = {};\n\
                data['pruebas'] = 'SI';\n\
                priceSegure('10000', function (v) {\n\
                    var p = {};\n\
                    p['service'] = 'nwMaker';\n\
                    p['method'] = 'apiNwPayTesting';\n\
                    p['serviceResponse'] = 'doctolk';\n\
                    p['methodResponse'] = 'saveReserva';\n\
                    p['data'] = data;\n\
                    p['noReject'] = true;\n\
                    p['type'] = 'payu';\n\
                    p['wayToPay'] = 'debito';\n\
                    p['price'] = '10000';\n\
                    p['price_segure'] = v;\n\
                    p['callBack'] = function (r) {\n\
                        console.log(r);\n\
                        var params = {};\n\
                        params.html = 'callBack posterior... en consola sale la respuesta y ahí puedo decidir qué hacer.';\n\
                        params.textAccept = 'Continuar';\n\
                        params.no_cancel_button = true;\n\
                        params.onSave = function () {\n\
                            return true;\n\
                        };\n\
                        createDialogNw(params);\n\
                    };\n\
                    var d = new apiNwPay(p);\n\
                    d.open();\n\
                });\n\
            };\n\
            var d = new apiNwPay(x);\n\
            d.open();";
            html += "</p>";
            params.html = html;
            createDialogNw(params);
        });
        selfButton(self, "ApiNwPay").click(function () {

            var x = {};
            x["wayToPay"] = "selectService";
            x["saldo"] = function () {
                var data = {};
                data["pruebas"] = "SI";
                priceSegure("10000", function (v) {
                    var p = {};
                    p["data"] = data;
                    p["noReject"] = true;
                    p["type"] = "payu";
                    p["wayToPay"] = "saldo";
                    p["price"] = "10000";
                    p["price_segure"] = v;
                    p["callBack"] = function (r) {
                        console.log(r);
                        var params = {};
                        params.html = "callBack posterior... en consola sale la respuesta y ahí puedo decidir qué hacer.";
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
            x["credito"] = function () {
                var data = {};
                data["pruebas"] = "SI";
                var p = {};
                p["service"] = "nwMaker";
                p["method"] = "apiNwPayTesting";
                p["data"] = data;
                p["noReject"] = true;
                p["type"] = "payu";
                p["wayToPay"] = "credito";
                p["callBack"] = function (r) {
                    console.log(r);
                    var params = {};
                    params.html = "callBack posterior a la respuesta del banco, en la consola se puede ver lo que devuelve...";
                    params.textAccept = "Listo, que bien!";
                    params.no_cancel_button = true;
                    params.onSave = function () {
                        return true;
                    };
                    createDialogNw(params);
                };
                var d = new apiNwPay(p);
                d.open();
            };
            x["debito"] = function () {
                var data = {};
                data["pruebas"] = "SI";
                priceSegure("10000", function (v) {
                    var p = {};
                    p["service"] = "nwMaker";
                    p["method"] = "apiNwPayTesting";
                    p["serviceResponse"] = "doctolk";
                    p["methodResponse"] = "saveReserva";
                    p["data"] = data;
                    p["noReject"] = true;
                    p["type"] = "payu";
                    p["wayToPay"] = "debito";
                    p["price"] = "10000";
                    p["price_segure"] = v;
                    p["callBack"] = function (r) {
                        console.log(r);
                        var params = {};
                        params.html = "callBack posterior... en consola sale la respuesta y ahí puedo decidir qué hacer.";
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
            var d = new apiNwPay(x);
            d.open();
        });
        selfButton(self, "ApiNwPayDebito").click(function () {
            var data = {};
            data["pruebas"] = "SI";
            priceSegure("10000", function (v) {
                var p = {};
                p["service"] = "nwMaker";
                p["method"] = "apiNwPayTesting";
                p["serviceResponse"] = "doctolk";
                p["methodResponse"] = "saveReserva";
                p["data"] = data;
                p["noReject"] = true;
                p["type"] = "payu";
                p["wayToPay"] = "debito";
                p["price"] = "10000";
                p["price_segure"] = v;
                p["callBack"] = function (r) {
                    console.log(r);
                    var params = {};
                    params.html = "callBack posterior... en consola sale la respuesta y ahí puedo decidir qué hacer.";
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
        });
        selfButton(self, "code_ApiNwPayCredit").click(function () {
            var params = {};
            var html = "";
            html += "<p>";
            html += 'var data = {};<br />\n\
            data["pruebas"] = "SI";<br />\n\
            var p = {};<br />\n\
            p["service"] = "nwMaker";<br />\n\
            p["method"] = "apiNwPayTesting";<br />\n\
            p["data"] = data;<br />\n\
            p["noReject"] = true;<br />\n\
            p["type"] = "payu";<br />\n\
            p["wayToPay"] = "credito";<br />\n\
            p["callBack"] = function (r) {<br />\n\
                console.log(r);<br />\n\
                var params = {};<br />\n\
                params.html = "callBack posterior a la respuesta del banco, en la consola se puede ver lo que devuelve...";<br />\n\
                params.textAccept = "Listo, que bien!";<br />\n\
                params.no_cancel_button = true;<br />\n\
                params.onSave = function () {<br />\n\
                    return true;<br />\n\
                };<br />\n\
                createDialogNw(params);<br />\n\
            };<br />\n\
            var d = new apiNwPay(p);\n\
            d.open();';
            html += "</p>";
            params.html = html;
            createDialogNw(params);
        });
        selfButton(self, "ApiNwPayCredit").click(function () {
            //EXPLICACIÓN
            //Se envían parámetros como la clase y el método, siempre debe devolver $rta = nwMaker::NwPayments($p); y pasarle todos los datos con $p
            //ejemplo método en PHP:
//          class nwMaker {
//              public static function apiNwPayTesting($data) {
//                 $p = $data["data"];
//                 $p["valor"] = 11000;
//                 $p["descripcion"] = "Pago prueba";
//                 $ra = nwMaker::NwPayments($p);
//                 if ($ra["APPROVED"] === true) {
////                  ejecuta el script que quiera
//                 }
//                return $ra;
//               }
//            }
            var data = {};
            data["pruebas"] = "SI";
            var p = {};
            p["service"] = "nwMaker";
            p["method"] = "apiNwPayTesting";
            p["data"] = data;
            p["noReject"] = true;
            p["type"] = "payu";
            p["wayToPay"] = "credito";
            p["callBack"] = function (r) {
                console.log(r);
                var params = {};
                params.html = "callBack posterior a la respuesta del banco, en la consola se puede ver lo que devuelve...";
                params.textAccept = "Listo, que bien!";
                params.no_cancel_button = true;
                params.onSave = function () {
                    return true;
                };
                createDialogNw(params);
            };
            var d = new apiNwPay(p);
            d.open();
        });
        selfButton(self, "forms_grupos").click(function () {
            var params = {};
            var html = "";
            html += "<p>";
            html += "{title: 'titulo_opcional',mode: 'horizontal',name_group: 'filters_visible',numberCols: '1',tipo: 'startGroup'},";
            html += "</p>";
            html += "<p>";
            html += "{tipo: 'endGroup'},";
            html += "</p>";
            params.html = html;
            createDialogNw(params);
        });
        selfButton(self, "listado_paginacion").click(function () {
            var params = {};
            var html = "";
            html += "<p>";
            html += " 1. Poner esto en el constructor, siempre después del createList y createFilters: activepagination(self, function () {thisDoc.updateContend();});";
            html += "</p>";
            html += "<p>";
            html += " 2. En el populate del listado si usa setModelData no debe hacer nada más en el JS. Si no lo usa debe poner al final del arreglo que esté haciendo lo siguiente:     addDataPagination(self, totalRows);";
            html += "</p>";
            html += "<p>";
            html += " 3. En el PHP debe poner lo siguiente:   $order .= nwMaker::paginationLIst($data); Ej:    $ca->prepareSelect('mitabla', '*', '1=1'  . $order);'";
            html += "</p>";
            params.html = html;
            createDialogNw(params);
        });
        selfButton(self, "listado_datafilters").click(function () {
            var params = {};
            params.html = "   dat['filters'] = getDataFilters(self); ";
            createDialogNw(params);
        });
        selfButton(self, "getRecordNwForm").click(function () {
            var params = {};
            params.html = "  var data = getRecordNwForm(self); ";
            createDialogNw(params);
        });
        selfButton(self, "actioninbuttonform").click(function () {
            var params = {};
            params.html = "  var btn = selfButton(self, 'back_calendar');btn.click(function () {alert('fdsafdsa');});";
            createDialogNw(params);
        });
        selfButton(self, "crear_maestro").click(function () {
            var params = {};
            params.html = "  createMaster('nombre_de_la_tabla'');";
            createDialogNw(params);
        });
        selfButton(self, "crear_maestro_options").click(function () {
            var params = {};
            params.html = " var options = {}; options['optionsForm'] = {numberCols: '1' };  options['service'] = 'buscar_calificar_int';  options['method'] = 'consulta_lista_favoritos'; options['callBack'] = function (r) {};  \n\
                                           options['filter_by_user'] = false; options['filter_by_terminal'] = false; options['order'] = 'nombre asc'; options['container'] = containerRigth; options['cleanHtml'] = true;\n\
                                       createMaster('nombre_de_la_tabla', options);";
            createDialogNw(params);
        });
        selfButton(self, "nwdialognew").click(function () {
            var params = {};
            var html = "Code:";
            html += "<br />var params = {};";
            html += "<br />params.html = 'Aquí el html que quiere mostrar';";
            html += "<br />params.onSave = function() {alert('Hola!!'); return false; }";
            html += "<br />params.textAccept = 'Es aceptar!!';";
            html += "<br />params.textCancel = 'Es cancelll!!';";
            html += "<br />params.no_cancel_button = true; //para quitar el cancelar y botones de max, minimizar y cerrar";
            html += "<br />params.no_buttons_enc = true; //para quitar los botones de max, minimizar y cerrar";
            html += "<br />params.buttonMin = false; //quita minimizar";
            html += "<br />params.buttonMax = false; //quita maximizar";
            html += "<br />params.showEnc = true; //quita barra de título y todo encabezado en false o NO también con removeTitleForm(self) ";
            html += "<br />params.width = 500;";
            html += "<br />params.height = 500;";
            html += "<br />params.css = 'color:red; background: #fff;';";
            html += "<br />params.frame = 'url_frame'; //mostrar un frame";
            html += "<br />params.title = 'Título de ventana';";
            html += "<br />createDialogNw(params);";
            params.showEnc = false;
            params.html = html;
            params.onSave = function () {
                alert('Hola!!');
                return false;
            };
            createDialogNw(params);
        });
        selfButton(self, "listado_actionchangeselect").click(function () {
            var params = {};
            params.html = "  var btn = actionInColForm(self, 'grupo'); btn.change(function () {var data = getValue(self, this); //la funcion que quiera ejecutar });";
            createDialogNw(params);
        });
        selfButton(self, "listado_populateSelect").click(function () {
            var params = {};
            params.html = " Opción 1: var up = getUserInfo();var data = {}; data['table'] = 'fundaka_listas'; data['bindValues'] = {}; data['bindValues']['usuario'] = up.usuario; populateSelect(self, 'addProfile', 'nwprojectOut', 'populate', data, ' and usuario=:usuario'); \n\
                                        <br />Opción 2:     var data = {}; data[''] = 'Añadir a lista'; populateSelectFromArray('addProfile', data);\n\
                                          <br />Opción 3:     populateSelect(self, 'grupo', 'nwTask', 'consultaGrupos', {select: true});";
            createDialogNw(params);
        });
        selfButton(self, "listado").click(function () {
            loadRightFuncTree(self, "listado");
        });
        selfButton(self, "listado_selected_record").click(function () {
            var params = {};
            params.html = "Code: var r = getSelectedRecord(self);";
            createDialogNw(params);
        });
        selfButton(self, "listado_add_contexmenu").click(function () {
            var params = {};
            params.html = "Code:  var eliminar = addButtonContextMenu(self, 'Eliminar'');";
            createDialogNw(params);
        });
        selfButton(self, "listado_action_contexmenu").click(function () {
            var params = {};
            params.html = "Code:   click(eliminar, function() { ... }, true);";
            createDialogNw(params);
        });
        selfButton(self, "listado_eliminar_registro").click(function () {
            var params = {};
            params.html = "Code:       var params = {}; params.html = '¿Desea eliminar este registro?'; params.onSave = function () {var data = {};data['id'] = r['id'];data['table'] ='nwtask_grupos_usuarios';deleteRecordForId(data);thisDoc.updateContend();}createDialogNw(params); ";
            createDialogNw(params);
        });
        selfButton(self, "formulariopopup").click(function () {
            openFormExample();
        });
        selfButton(self, "formularionopopup").click(function () {
            loadRightFuncTree(self, "formOne");
        });
        selfButton(self, "googlemaps_buscadir").click(function () {
            loadRightFuncTree(self, "googlemaps_buscadir");
        });
        selfButton(self, "googlemaps_poly").click(function () {
            loadRightFuncTree(self, "googlemaps_poly");
        });
        selfButton(self, "open_chat").click(function () {
            loadRightFuncTree(self, "openNwMakerChat");
        });
        selfButton(self, "open_chat_width_user").click(function () {
            windowNwChatPes(up["usuario"], up["nombre"], ".footerTools");
        });
        selfButton(self, "nwformnew").click(function () {
            nwFormNew();
        });
        selfButton(self, "pagos_epayco").click(function () {
            pagos_epayco();
        });
//        editDataPersonal(self + " .container-treen_rigth");
        removeLoadingNw();
    }
}

//openFormExample();

function openFormExample() {
    loadJs("/nwlib6/nwproject/modules/examplesNwMaker/forms/f_example_form_popup.js");
    var d = new f_example_form_popup();
    d.constructor();
}

function listado(pr) {
    loadJs("/nwlib6/nwproject/modules/examplesNwMaker/lists/l_example_list_one.js");
    var d = new l_example_list_one(pr);
    d.constructor();
}

function formOne(pr) {
    var d = new f_example_form(pr);
    d.constructor();
}

function googlemaps_buscadir(pr) {
    loadJs("/nwlib6/nwproject/modules/examplesNwMaker/forms/f_example_googlemaps_buscadir.js");
    var d = new f_example_googlemaps_buscadir(pr);
    d.constructor();
}

function googlemaps_poly(pr) {
    loadJs("/nwlib6/nwproject/modules/examplesNwMaker/forms/f_example_googlemaps_polyline.js");
    var d = new f_example_googlemaps_polyline(pr);
    d.constructor();
}

function nwFormNew() {
    loadJs("/nwlib6/nwproject/modules/examplesNwMaker/forms/f_nwform_new.js");
    var d = new f_nwform_new();
    d.constructor();
}

function event_outlook() {
    var self = createDocument(".event_outlook");
    var thisDoc = this;
    this.constructor = constructor;
    this.self = self;
    function constructor() {
        var fields = [
            {
                tipo: 'datetime',
                nombre: 'Fecha Inicio',
                name: 'fecha_inicial',
                requerido: "SI"
            },
            {
                tipo: 'datetime',
                nombre: 'Fecha Final',
                name: 'fecha_final',
                requerido: "SI"
            },
            {
                tipo: 'textField',
                nombre: 'Correo',
                name: 'correo',
                requerido: "SI"
            },
            {
                tipo: 'textField',
                nombre: 'Asunto',
                name: 'asunto',
                requerido: "SI"
            },
            {
                tipo: 'textArea',
                nombre: 'Mensaje',
                name: 'mensaje'
            }
        ];
        createNwForms(self, fields, "popup");

        var fechaFinal = addMinutesDate(5).replace(" ", "T");
        var hoy = getDateHour().replace(" ", "T");
        setValue(self, "fecha_inicial", hoy);
        setValue(self, "fecha_final", fechaFinal);
        setValue(self, "correo", "orionjafe@hotmail.com");
        setValue(self, "asunto", "Agenda " + hoy + " - " + fechaFinal);
        setValue(self, "mensaje", "Agenda prueba outlook");

        setColumnsFormNumber(self, 1);
        var html = "Crea un evento en el calendario Outlook";
        addHeaderNote(self, html);
//        setModal(true);
//        setWidth(self, 700);
        var accept = addButtonNwForm("Enviar", self);
        var cancel = addButtonNwForm("Cancelar", self);
        cancel.click(function () {
            rejectForm(self);
        });
        accept.click(function () {
            if (!validateRequired(self)) {
                return;
            }
            loading("Enviando...", "rgba(255, 255, 255, 0.76)!important", self);
            var data = getRecordNwForm(self);
            console.log(data);
            var rpc = {};
            rpc["service"] = "nwMaker";
            rpc["method"] = "createEventCalendarOutlook";
            rpc["data"] = data;
            var func = function (r) {
                console.log(r);
                removeLoading(self);
                if (r === false) {
                    nw_dialog("El correo no fue enviado");
                    return false;
                }
                if (!verifyErrorNwMaker(r)) {
                    return;
                }
                if (r === true) {
                    nw_dialog("Correo enviado correctamente");
                    return true;
                }
                nw_dialog(r);
            };
            rpcNw("rpcNw", rpc, func, true);
        });
        removeLoadingNw();
    }
}

function send_sms() {
    var self = createDocument(".send_sms");
    var thisDoc = this;
    this.constructor = constructor;
    this.self = self;
    function constructor() {
        var fields = [
            {
                tipo: 'textField',
                nombre: 'Número celular',
                name: 'numero',
                requerido: "SI"
            },
            {
                tipo: 'textField',
                nombre: 'Asunto',
                name: 'asunto',
                requerido: "SI"
            },
            {
                tipo: 'textArea',
                nombre: 'Mensaje',
                name: 'mensaje'
            }
        ];
        createNwForms(self, fields, "popup");

        setValue(self, "numero", "3125729272");
        setValue(self, "asunto", "Agenda");
        setValue(self, "mensaje", "Agenda prueba outlook");

        setColumnsFormNumber(self, 1);
        var html = "Envía un mensaje de texto";
        addHeaderNote(self, html);
//        setModal(true);
//        setWidth(self, 700);
        var accept = addButtonNwForm("Enviar", self);
        var cancel = addButtonNwForm("Cancelar", self);
        cancel.click(function () {
            rejectForm(self);
        });
        accept.click(function () {
            if (!validateRequired(self)) {
                return;
            }
            loading("Enviando...", "rgba(255, 255, 255, 0.76)!important", self);
            var data = getRecordNwForm(self);

            var dataMSN = {};
            dataMSN.cel = data.numero;
            dataMSN.text = data.mensaje;
//            dataMSN.from = "Grupo NW";
            dataMSN.from = "ECOM Col";
//            dataMSN.user = "ecomsms";
//            dataMSN.pass = "EcomSMS3";
            dataMSN.user = "GRUPONW";
            dataMSN.pass = "Nw729272";
//            dataMSN.url = "http://ecom.colombiagroup.com.co/Api/rest/message";
            dataMSN.url = "http://sms.colombiagroup.com.co/Api/rest/message";
//            qxnw.utils.fastAsyncCallRpc("master", "sendSMSByCBG", dataMSN, function (rta) {
//                console.log(rta);
//            });

            var rpc = {};
            rpc["service"] = "master";
            rpc["method"] = "sendSMSByCBG";
            rpc["data"] = dataMSN;
            console.log(dataMSN);
            var func = function (r) {
                console.log(r);
                removeLoading(self);
                if (r === false) {
                    nw_dialog("El SMS no fue enviado");
                    return false;
                }
                if (!verifyErrorNwMaker(r)) {
                    return;
                }
                if (r === true) {
                    nw_dialog("SMS enviado correctamente");
                    return true;
                }
                nw_dialog(r);
            };
            rpcNw("rpcNw", rpc, func, true);
        });
        removeLoadingNw();
    }
}

function pagos_epayco() {
    var data = {};
    data["pruebas"] = "SI";
    var p = {};
    p["service"] = "nwMaker";
    p["method"] = "apiNwPayTesting";
    p["data"] = data;
    p["noReject"] = true;
    p["type"] = "epayco";
    p["pruebas"] = "SI";
    p["wayToPay"] = "credito";
    p["callBack"] = function (r) {
        console.log(r);
        var params = {};
        params.html = "callBack posterior a la respuesta del banco, en la consola se puede ver lo que devuelve...";
        params.textAccept = "Listo, que bien!";
        params.no_cancel_button = true;
        params.onSave = function () {
            return true;
        };
        createDialogNw(params);
    };
    var d = new apiNwPay(p);
    d.open();
}