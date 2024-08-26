function f_form_credit(p, ws) {
    if (ws === false) {
        if (typeof p.data === "undefined") {
            p.data = {};
        }
        p.data.tipo_pago = "credito";
    }
    var self = createDocument(".f_form_credit");
    var thisDoc = this;
    thisDoc.constructor = constructor;
    thisDoc.updateContend = updateContend;
    thisDoc.self = self;
    thisDoc.tienecards = false;
    function constructor(r) {
        var enablePrice = false;
        if (evalueData(p.price) === false) {
            enablePrice = true;
        }
        var fields = [
            {
                title: "Detalle",
                mode: "vertical",
                name_group: "contenedor_resumen_pago",
                numberCols: "1",
                tipo: "startGroup"
            },
            {
                tipo: 'textField',
                nombre: 'Plan ID',
                name: 'plan',
                visible: true,
                required: true,
                enabled: enablePrice
            },
            {
                tipo: 'textField',
                nombre: 'Plan',
                name: 'plan_text',
                required: true,
                enabled: enablePrice
            },
            {
                tipo: 'textArea',
                nombre: 'Descripción',
                name: 'description',
                required: true,
                enabled: enablePrice
            },
            {
                tipo: 'textField',
                mode: 'money',
                nombre: 'Valor total',
                name: 'price',
                required: true,
                enabled: enablePrice
            },
            {
                tipo: "endGroup"
            },
            {
                title: "Datos Básicos",
                mode: "vertical",
                name_group: "contenedor_datos_user",
                numberCols: "1",
                tipo: "startGroup"
            },
            {
                tipo: 'textField',
                nombre: 'Nombre',
                name: 'nombre_tarjeta',
                placeholder: 'Nombres',
                required: true,
                tooltip: "Ingresa el nombre que tienes en la tarjeta, verifica que sea exacta"
            },
            {
                tipo: 'textField',
                nombre: 'Apellido',
                name: 'apellido_tarjeta',
                placeholder: 'Apellidos',
                required: true,
                tooltip: "Ingresa el apellido que tienes en la tarjeta, verifica que sea exacta"
            },
            {
                tipo: 'selectBox',
                nombre: 'Tipo Documento',
                name: 'tipo_documento',
                required: true
            },
            {
                tipo: 'textField',
                nombre: 'Documento',
                name: 'documento',
                required: true
            },
            {
                tipo: 'textField',
                mode: 'email',
                nombre: 'Correo electrónico',
                name: 'email',
                placeholder: 'ejemplo@gmail.com',
                required: true,
                enabled: true
            },
            {
                tipo: 'selectBox',
                nombre: 'País',
                name: 'pais',
                required: true
            },
            {
                tipo: 'textField',
                nombre: 'Moneda',
                name: 'moneda',
                enabled: false,
                required: true
            },
            {
                tipo: 'selectBox',
                nombre: 'Cuotas',
                name: 'cuotas',
                required: true
            },
            {
                tipo: 'button',
                nombre: 'Continuar',
                name: 'continuar_datos',
                visible: false
            },
            {
                tipo: "endGroup"
            },
            {
                title: "Seleccionar tarjeta existente",
                mode: "vertical",
                name_group: "contenedor_select_tarjeta",
                numberCols: "1",
                tipo: "startGroup"
            },
            {
                tipo: 'button',
                nombre: 'Nueva Tarjeta',
                name: 'nueva_tarjeta'
            },
            {
                tipo: 'radio',
                nombre: 'Seleccione su tarjeta registrada',
                name: 'tarjetas_registradas'
            },
            {
                tipo: "endGroup"
            },
            {
                title: "Datos Tarjeta de Crédito",
                mode: "vertical",
                name_group: "contenedor_crear_tarjeta",
                numberCols: "1",
                tipo: "startGroup"
            },
            {
                tipo: 'radio',
                nombre: 'Banco',
                name: 'nombre_banco'
            },
            {
                type: 'textField',
                mode: "int",
                nombre: 'Número de tarjeta',
                name: 'numero_tarjeta',
                placeholder: '4444 4444 4444 4444',
                car_min: 13,
                car_max: 20,
                min_numer: 1,
                max_numer: 99999999999999999999
            },
            {
                tipo: 'textField',
                mode: "int",
                nombre: 'CVV',
                name: 'codigo_seguridad',
                tooltip: "<h2>Código de seguridad</h2><p><img src='/nwlib6/icons/cvv_cards1.png' /><img src='/nwlib6/icons/cvvamex_1.png' /></p>",
                placeholder: '000',
                car_min: 3,
                car_max: 3
            },
            {
                tipo: 'selectBox',
                nombre: 'Mes',
                name: 'mes_vencimiento'
            },
            {
                tipo: 'selectBox',
                nombre: 'Año',
                name: 'anio_vencimiento'
            },
            {
                tipo: "endGroup"
            }
        ];

        var typeForm = "popup";
        createNwFormsNew(self, fields, typeForm);
        setColumnsFormNumber(self, 2);
        setModal(true);
        setWidth(self, 1000);

        removeTitleForm(self);

        addCss(self, ".contenedor_crear_tarjeta", {"display": "none"});

        addCss(self, ".contain_input_name_email", {"width": "45%"});
        addCss(self, ".contain_input_name_pais", {"width": "25%"});
        addCss(self, ".contain_input_name_moneda", {"width": "15%"});
        addCss(self, ".contain_input_name_cuotas", {"width": "15%"});
//        addCss(self, ".contain_input_name_moneda .labelInt", {"opacity": "0"});
        addCss(self, ".divContainInputIntern", {"margin": "0", "padding": "0px 5px"});

        addFooterNote(self, "<div class='footerpriceseg' style='position: relative;margin: 10px 20px;'><img style='max-width: 150px;' src='/nwlib6/icons/seguro_verificado.png' /></div>");


        setValue(self, "price", p.price);
        if (typeof p.description === "undefined" && typeof nwm !== "undefined") {
            var v = nwm.getInfoApp();
            setValue(self, "description", "Pago suscripción " + v.name);
        } else {
            setValue(self, "description", p.description);

        }
        if (typeof p.plan === "undefined") {
            setValue(self, "plan", "1");
            setValue(self, "plan_text", "PLAN");
            setVisibility(self, "plan", false);
            setVisibility(self, "plan_text", false);
        } else {
            setValue(self, "plan", p.plan);
            setValue(self, "plan_text", p.plan_text);
        }
        if (typeof p.plan_text === "undefined") {
            setValue(self, "plan_text", "PLAN");
            setVisibility(self, "plan_text", false);
        } else {
            setVisibility(self, "plan_text", true);
            setValue(self, "plan_text", p.plan_text);
        }
        var up = getUserInfo();
        var data = {};
        data["0"] = "-" + str("Año") + "-";
        for (var i = 18; i < 34; i++) {
            data["20" + i] = i;
        }
        populateSelectFromArray("anio_vencimiento", data, self, true, false);

        var data = {};
        for (var i = 1; i < 25; i++) {
            data[i] = i;
        }
        populateSelectFromArray("cuotas", data, self, true, false);

        var data = {};
        data["0"] = "-" + str("Mes") + "-";
        for (var i = 0; i < 12; i++) {
            var n = i + 1;
            data[n] = n;
        }
        populateSelectFromArray("mes_vencimiento", data, self);

        var data = {};
        data["CC"] = "Cédula de ciudadanía";
        data["PP"] = "Pasaporte";
        populateSelectFromArray("tipo_documento", data, self);

        var data = {};
        data["VISA"] = "<div class='creditscards visa' data='visa' ></div>";
        data["MASTERCARD"] = "<div class='creditscards mastercard' data='mastercard' ></div>";
        data["AMEX"] = "<div class='creditscards amex' data='amex' ></div>";
        data["DINERS"] = "<div class='creditscards diners' data='diners' ></div>";
        populateSelectFromArray("nombre_banco", data, self);

        function actionLoadCrads(e) {
            if (e === false) {
                addCss(self, ".contenedor_select_tarjeta", {"display": "none"});
                modeCard("new");
                thisDoc.tienecards = false;
            } else {
                thisDoc.tienecards = true;
                setRequired(self, "tarjetas_registradas", true);
            }
            actionInCards();
        }

        var data = {};
        data["table"] = "nwmaker_tarjetascredito";
        var where = " and 1=2";
        if (typeof up.usuario !== "undefined" && evalueData(up.usuario)) {
            data["bindValues"] = {};
            data["bindValues"]["usuario"] = up.usuario;
            if (up["profile"] === "4") {
                data["bindValues"]["usuario"] = up["usuario_principal"];
            }
            where = " and usuario=:usuario";
        }
        var typejson = false;
        var async = true;
        var remove = true;
        var select = false;
        var clase = "nwprojectOut";
        var fun = "populate";
        var callback = function (e) {
            actionLoadCrads(e);
        };
        if (ws === true) {
            typejson = true;
            clase = "nwMaker";
            fun = "populateCreditsCards";
        }
        populateSelect(self, "tarjetas_registradas", clase, fun, data, where, async, remove, select, callback, typejson);

        var data = {};
        data["table"] = "paises";
        data["bindValues"] = {};
        populateSelect(self, "pais", "nwprojectOut", "populate", data, " ", true, true, true, function (e) {
            validateMoneda();
        });

        var nombre = "";
        var apellido = "";
        if (evalueData(up.nombre)) {
            nombre += up.nombre;
        }
        if (evalueData(up.apellido)) {
            apellido = " " + up.apellido;
        }
        setValue(self, "nombre_tarjeta", nombre);
        setValue(self, "apellido_tarjeta", apellido);
        if (evalueData(p.nombre)) {
            setValue(self, "nombre_tarjeta", p.nombre);
        }
        if (evalueData(p.apellido)) {
            setValue(self, "apellido_tarjeta", p.apellido);
        }

        if (evalueData(up.email)) {
            setValue(self, "email", up.email);
//            setEnabled(self, "email", false);
        }
        if (evalueData(p.email)) {
            setValue(self, "email", p.email);
//            setEnabled(self, "email", false);
        }
        if (evalueData(up.documento)) {
            setValue(self, "documento", up.documento);
        }
        if (evalueData(up.nit)) {
            setValue(self, "documento", up.nit);
        }
        if (evalueData(p.documento)) {
            setValue(self, "documento", p.documento);
        }
        if (evalueData(up.pais)) {
            var pa = up.pais;
            setEnabled(self, "pais", true);
            setValue(self, "pais", pa);
        }
        if (evalueData(p.country)) {
            var pa = p.country;
            setEnabled(self, "pais", true);
            setValue(self, "pais", pa);
        }

        var nueva_tarjeta = actionInColForm(self, "nueva_tarjeta");
        nueva_tarjeta.css({"background": "#f79e1e", "max-width": "157px", "border": "0px", "padding": "5px", "font-size": "13px"});
        nueva_tarjeta.click(function () {
            openNewCard();
        });

        function openNewCard() {
            cleanField(self, "tarjetas_registradas");
            modeCard("new");
            scrollPage("numero_tarjeta", 100, -300, false, ".dialogNwNewInter", "position");
            focusInput(self, "numero_tarjeta");
        }

        click(".creditscards", function () {
            var d = this.getAttribute("data");
            changeSelectedCard(d);
        });

        document.querySelector(".numero_tarjeta").addEventListener("input", function () {
            var d = getValue(self, this);
            var k = detectCardType(d);
            if (evalueData(k)) {
                changeSelectedCard(k);
            }
        });

        var pais = actionInColForm(self, "pais");
        pais.change(function () {
            validateMoneda();
        });

        function validateMoneda() {
            var data = getRecordNwForm(self);
            setValue(self, "moneda", "");
            if (evalueData(data.pais_all_data)) {
                if (evalueData(data.pais_all_data.moneda)) {
                    setValue(self, "moneda", data.pais_all_data.moneda);
                } else {
                    setEnabled(self, "moneda", true);
                    setEnabled(self, "pais", true);
                }
            }
            if (evalueData(data.pais) === false) {
//                if (evalueData(up.pais) === false) {
//                    setEnabled(self, "pais", false);
//                } else
//                if (evalueData(p.country) === false) {
//                    setEnabled(self, "pais", false);
//                }
                setEnabled(self, "moneda", false);
                setEnabled(self, "pais", false);
            }
        }

        function actionInCards() {
            var tarjetasRegistradas = actionInColForm(self, "tarjetas_registradas");
            tarjetasRegistradas.change(function () {
                modeCard();
            });
            tarjetasRegistradas.click(function () {
                modeCard();
            });

            addCss(self, ".contain_input_name_tarjetas_registradas .radioButtonsNw_tarjetas_registradas", {"float": "left", "padding": "0 5px", "max-width": "33%"});
            addCss(self, ".contain_input_name_tarjetas_registradas .inputradiobuttonnwf", {"display": "none"});
            addCss(self, ".contain_input_name_tarjetas_registradas .labelforradionwform", {"background": "#fff", "border": "1px solid #ccc", "padding": "5px", "box-sizing": "border-box", "border-radius": "5px"});

            var op = $(self + " .contain_input_name_tarjetas_registradas .labelforradionwform");
            for (var i = 0; i < op.length; i++) {
                var a = op[i];
                var t = a.innerHTML;
                var tnew = t.replace("VISA-", "<span class='creditscards_mini' style='background-position: 0px -410px;'></span><span class='titlecardop'>Visa</span> ");
                var tnew = t.replace("VISA", "<span class='creditscards_mini' style='background-position: 0px -410px;'></span><span class='titlecardop'>Visa</span> ");
                tnew = tnew.replace("MASTERCARD-", "<span class='creditscards_mini' style='background-position: 0px -308px;'></span><span class='titlecardop'>MasterCard</span> ");
                tnew = tnew.replace("MASTERCARD", "<span class='creditscards_mini' style='background-position: 0px -308px;'></span><span class='titlecardop'>MasterCard</span> ");
                tnew = tnew.replace("AMEX-", "<span class='creditscards_mini' style='background-position: 0px -38px;'></span><span class='titlecardop'>Amex</span> ");
                tnew = tnew.replace("AMEX", "<span class='creditscards_mini' style='background-position: 0px -38px;'></span><span class='titlecardop'>Amex</span> ");
                tnew = tnew.replace("DINERS-", "<span class='creditscards_mini' style='background-position: 0px 0px;'></span><span class='titlecardop'>Diners</span> ");
                tnew = tnew.replace("DINERS", "<span class='creditscards_mini' style='background-position: 0px 0px;'></span><span class='titlecardop'>Diners</span> ");
                a.innerHTML = tnew;
            }

            click(".radioButtonsNw_tarjetas_registradas .labelforradionwform", function () {
                $(".radioButtonsNw_tarjetas_registradas .labelforradionwform").removeClass("creditscards_mini_active");
                $(this).addClass("creditscards_mini_active");
            });
        }

        function detectCardType(number) {
            var re = {
                electron: /^(4026|417500|4405|4508|4844|4913|4917)\d+$/,
                maestro: /^(5018|5020|5038|5612|5893|6304|6759|6761|6762|6763|0604|6390)\d+$/,
                dankort: /^(5019)\d+$/,
                interpayment: /^(636)\d+$/,
                unionpay: /^(62|88)\d+$/,
                visa: /^4[0-9]{12}(?:[0-9]{3})?$/,
                mastercard: /^5[1-5][0-9]{14}$/,
                amex: /^3[47][0-9]{13}$/,
                diners: /^3(?:0[0-5]|[68][0-9])[0-9]{11}$/,
                discover: /^6(?:011|5[0-9]{2})[0-9]{12}$/,
                jcb: /^(?:2131|1800|35\d{3})\d{11}$/
            };
            for (var key in re) {
                if (re[key].test(number)) {
                    return key;
                }
            }
            return false;
        }

        function modeCard(mode) {
            if (mode === "new") {
                addCss(self, ".contenedor_crear_tarjeta", {"display": "block"});
                addCss(self, ".contenedor_datos_user", {"display": "block"});

                setRequired(self, "tarjetas_registradas", false);

                setRequired(self, "numero_tarjeta", true);
                setRequired(self, "codigo_seguridad", true);
                setRequired(self, "fecha_vencimiento", true);
                setRequired(self, "anio_vencimiento", true);
                setRequired(self, "mes_vencimiento", true);
                setRequired(self, "nombre_banco", true);

                $(".radioButtonsNw_tarjetas_registradas .labelforradionwform").removeClass("creditscards_mini_active");

                thisDoc.tienecards = false;

            } else {
                addCss(self, ".contenedor_crear_tarjeta", {"display": "none"});
                addCss(self, ".contenedor_datos_user", {"display": "none"});

                setRequired(self, "tarjetas_registradas", true);

                setRequired(self, "numero_tarjeta", false);
                setRequired(self, "codigo_seguridad", false);
                setRequired(self, "fecha_vencimiento", false);
                setRequired(self, "anio_vencimiento", false);
                setRequired(self, "mes_vencimiento", false);
                setRequired(self, "nombre_banco", false);

                thisDoc.tienecards = true;
            }

            validaHidden();
        }

        function changeSelectedCard(card) {
            $(".creditscards").removeClass("creditscards_selected");
            if (card === "none") {
                addCss(self, ".numero_tarjeta", {"background-position": "right -442px"});
                return;
            }
            if (card === "visa") {
                addCss(self, ".numero_tarjeta", {"background-position": "right -408px"});
            }
            if (card === "mastercard") {
                addCss(self, ".numero_tarjeta", {"background-position": "right -306px"});
            }
            if (card === "amex") {
                addCss(self, ".numero_tarjeta", {"background-position": "right -35px"});
            }
            if (card === "diners") {
                addCss(self, ".numero_tarjeta", {"background-position": "right -0px"});
            }
            var d = document.querySelector(self + " .inputradionwmk_" + card.toUpperCase());
            if (d)
                d.checked = true;
            $("." + card).addClass("creditscards_selected");
        }

        addCss(self, ".creditscards", {"background-repeat": "no-repeat", "height": "40px", "width": "60px", "background-color": "#fff", "text-indent": "0", "border": "1px solid #A5C407", "display": "inline-block", "text-align": "center", "padding": "0", "cursor": "pointer", "position": "relative", "-webkit-border-radius": "6px", "-moz-border-radius": "6px", "-ms-border-radius": "6px", "-o-border-radius": "6px", "border-radius": "6px"});
        addCss(self, ".visa", {"height": "40px", "width": "60px", "background-position": "-384px -210px", "background-image": "url(/nwlib6/icons/spritebox-desktop.png)"});
        addCss(self, ".mastercard", {"height": "40px", "width": "60px", "background-position": "-384px -170px", "background-image": "url(/nwlib6/icons/spritebox-desktop.png)"});
        addCss(self, ".amex", {"height": "40px", "width": "60px", "background-position": "-384px -130px", "background-image": "url(/nwlib6/icons/spritebox-desktop.png)"});
        addCss(self, ".diners", {"height": "40px", "width": "60px", "background-position": "-324px -130px", "background-image": "url(/nwlib6/icons/spritebox-desktop.png)"});
        addCss(self, ".inputradiobuttonnwf_nombre_banco", {"display": "none"});


        addCss(self, ".contain_input_name_nueva_tarjeta", {"width": "auto", "position": "absolute", "top": "0", "right": "0", "margin": "0", "padding": "0", "left": "auto"});
        addCss(self, ".contain_input_name_tarjetas_registradas", {"width": "100%", "margin-top": "0px", "max-width": "500px"});
        addCss(self, ".contain_input_name_tarjetas_registradas .divContainInputIntern", {"width": "100%", "overflow": "hidden"});

        addCss(self, ".contain_input_name_tarjetas_registradas .labelInt", {"display": "none"});

        addCss(self, ".radioButtonsNw_nombre_banco", {"float": "left"});

        addCss(self, ".contain_input_name_nombre_banco .labelInt", {"display": "none"});

        var cs = document.createElement("div");
        cs.innerHTML = "<style>.titlecardop{\n\
    position: relative;\n\
    top: -10px;\n\
    font-weight: bold;\n\
    color: #000;\n\
}\n\
.creditscards_mini{background-repeat: no-repeat;\n\
background-repeat: no-repeat;\n\
    position: relative;\n\
    height: 30px;\n\
    width: 40px;\n\
    text-indent: 0px;\n\
    display: inline-block;\n\
    text-align: center;\n\
    padding: 0px;\n\
    cursor: pointer;\n\
    border-radius: 6px;\n\
    background-image: url(/nwlib6/icons/bines_desktop.png);\n\
}\n\
.radioButtonsNw_tarjetas_registradas .labelforradionwform{\n\
cursor: pointer;\n\
}\n\
.radioButtonsNw_tarjetas_registradas .labelforradionwform:hover{\n\
box-shadow: 0px 0px 5px #000;\n\
}\n\
.creditscards_mini_active{\n\
box-shadow: 0px 0px 5px #000;\n\
}\n\
    ::placeholder {color: #bbb;}:-ms-input-placeholder {color: #bbb;}::-ms-input-placeholder {color: #bbb;}.creditscards:hover, .creditscards_selected{border: 1px solid #A5C407;-webkit-box-shadow: 0 0 6px 1px #A5C407;-moz-box-shadow: 0 0 6px 1px #A5C407;-ms-box-shadow: 0 0 6px 1px #A5C407;-o-box-shadow: 0 0 6px 1px #A5C407;box-shadow: 0 0 6px 1px #A5C407;}</style>";
        document.querySelector(self).appendChild(cs);

        addCss(self, ".contenedor_resumen_pago", {"float": "right"});
//        addCss(self, ".startGroupIntern", {"background": "#fafafa", "background-clip": "padding-box", "border": "1px #d9d9d9 solid", "border-radius": "5px", "color": "#545454", "padding": "0"});
        addCss(self, ".startGroupIntern", {"border": "0"});
        addCss(self, ".titleStartGroup", {"background": "rgb(255, 255, 255)", "font-weight": "400", "color": "rgb(51, 51, 51)", "padding": "10px", "border-bottom": "4px solid rgb(246, 247, 249)", "border-radius": "5px", "font-size": "20px"});
        addCss(self, ".divContainInput", {"padding": "5px", "box-sizing": "border-box"});
        addCss(self, ".contenedor_resumen_pago .startGroupIntern", {"border-left": "1px solid #e1e1e1"});

        addCss(self, ".contain_input_name_codigo_seguridad", {"width": "33%"});
        addCss(self, ".contain_input_name_anio_vencimiento", {"width": "33%"});
        addCss(self, ".contain_input_name_mes_vencimiento", {"width": "33%"});

        addCss(self, ".contain_input_name_nombre_banco", {"width": "100%"});
        addCss(self, ".contain_input_name_codigo_seguridad", {"width": "70px"});
        addCss(self, ".contain_input_name_anio_vencimiento", {"width": "82px"});
        addCss(self, ".contain_input_name_mes_vencimiento", {"width": "82px"});

        addCss(self, ".contenedor_resumen_pago", {"width": "35%"});
        addCss(self, ".contenedor_datos_user", {"width": "65%"});
        addCss(self, ".contenedor_select_tarjeta", {"width": "65%"});
        addCss(self, ".contenedor_crear_tarjeta", {"width": "65%"});


        addCss(self, ".anio_vencimiento", {"padding": "8px 0px", "font-size": "13px"});
        addCss(self, ".mes_vencimiento", {"padding": "8px 0px", "font-size": "13px"});

        addCss(self, ".div_enabled_nwf", {"border": "0px", "box-shadow": "none", "background": "transparent"});
        addCss(self, ".price", {"font-weight": "bold", "font-size": "28px"});
        addCss(self, ".spanMoneyInit", {"left": "5px"});

        addCss(self, ".contain_input_name_description", {"width": "100%"});
        addCss(self, ".contain_input_name_price", {"width": "100%"});

        addCss(self, ".contain_input_name_anio_vencimiento .labelInt", {"text-align": "center"});
        addCss(self, ".contain_input_name_mes_vencimiento .labelInt", {"text-align": "center"});
        addCss(self, ".contain_input_name_codigo_seguridad .labelInt", {"text-align": "center"});

        addCss(self, ".nombre_tarjeta", {"border": "0", "box-shadow": "none", "border-bottom": "1px solid #ccc", "border-radius": "0"});
        addCss(self, ".apellido_tarjeta", {"border": "0", "box-shadow": "none", "border-bottom": "1px solid #ccc", "border-radius": "0"});
        addCss(self, ".documento", {"border": "0", "box-shadow": "none", "border-bottom": "1px solid #ccc", "border-radius": "0"});
        addCss(self, ".email", {"border": "0", "box-shadow": "none", "border-bottom": "1px solid #ccc", "border-radius": "0"});
        addCss(self, ".numero_tarjeta", {"border": "0", "box-shadow": "none", "border-bottom": "1px solid #ccc", "border-radius": "0"});
        addCss(self, ".codigo_seguridad", {"border": "0", "box-shadow": "none", "border-bottom": "1px solid #ccc", "border-radius": "0"});
        addCss(self, ".mes_vencimiento", {"border": "0", "box-shadow": "none", "border-bottom": "1px solid #ccc", "border-radius": "0"});
        addCss(self, ".anio_vencimiento", {"border": "0", "box-shadow": "none", "border-bottom": "1px solid #ccc", "border-radius": "0"});

        addCss(self, ".numero_tarjeta", {"background-image": "url(/nwlib6/icons/bines_desktop.png)", "background-repeat": "no-repeat"});

        addCss(self, ".contenedor_resumen_pago", {"width": "auto", "float": "none"}, "mobile");
        addCss(self, ".contenedor_datos_user", {"width": "auto", "float": "none"}, "mobile");
        addCss(self, ".contenedor_select_tarjeta", {"width": "auto", "float": "none"}, "mobile");
        addCss(self, ".contenedor_crear_tarjeta", {"width": "auto", "float": "none"}, "mobile");
        addCss(self, ".contenedor_resumen_pago .startGroupIntern", {"height": "auto", "min-height": "initial", "border": "0"}, "mobile");

        changeSelectedCard("none");

        var accept = addButtonNwForm("Realizar pago", self);
        addStyleBig(self, accept);
        accept.addClass("btnGreen");
        var cancel = addButtonNwForm("Volver", self);
//        cancel.addClass("btnGray");
        cancel.addClass("btnTransparent");

        cancel.click(function () {
            rejectForm(self, typeForm);
        });

        accept.click(function () {
            if (!validateRequired(self)) {
                return;
            }
//            if (ws === false) {
//                if (typeof p.noReject == "undefined") {
//                    reject(self);
//                }
//            }
            var data = getRecordNwForm(self);
            if (data.mes_vencimiento.toString().length === 1) {
                data.mes_vencimiento = "0" + data.mes_vencimiento;
            }
            data.id_tarjeta = data.tarjetas_registradas;
            if (data.id_tarjeta === "off") {
                data.id_tarjeta = "";
            }
            data.fecha_vencimiento = data.anio_vencimiento + "/" + data.mes_vencimiento;
            if (data.nombre_banco === "off" && evalueData(data.numero_tarjeta) === true) {
                nw_dialog("Seleccione el banco de su tarjeta de crédito");
                return;
            }
            if (data.id_tarjeta === "" && thisDoc.tienecards === true && p.newCard !== true) {
                nw_dialog("Seleccione su tarjeta de crédito");
                return;
            }
            data.data_others = p.data;
            data.pais = data.pais_all_data.alias;
            data.currency = data.moneda;
            data.serviceResponse = p.serviceResponse;
            data.methodResponse = p.methodResponse;
            data.product_id = p.product_id;
            data.id_plan = p.plan;
            data.plan_text = p.plan_text;
            data.pago_unico_mensual = "UNICO";
            if (typeof p.pago_unico_mensual !== "undefined") {
                data.pago_unico_mensual = p.pago_unico_mensual;
            }
            if (typeof p.empresa !== "undefined") {
                data.empresa = p.empresa;
            }
            if (typeof p.perfil !== "undefined") {
                data.perfil = p.perfil;
            }
            if (typeof p.type !== "undefined") {
                data.type = p.type;
            }
            var rpc = {};
            rpc["service"] = "nwMaker";
            if (ws === true) {
                rpc["method"] = "payMentsProducts";
            } else {
                rpc["method"] = "apiNwPayTesting";
            }
            rpc["data"] = data;
            /*
             */
            console.log("data send", data);
            var css = "position: fixed;display: flex;flex-direction: column;top: 0;left: 0;height: 100%;z-index: 10000000000000000000;background: #fff;color: #000;";
            newLoadingTwo(self, "", css);
            var func = function (r) {
                removeLoading(false);
                newRemoveLoading(self);
                $(".loadingNwInto").remove();

                /*
                 console.log("response creditcard", r);
                 if (typeof r === "string") {
                 if (r.indexOf("Error") !== -1 || r.indexOf("ERROR") !== -1) {
                 nw_dialog(r);
                 return;
                 }
                 }
                 */
                if (ws === true) {
                    r = JSON.parse(r);
                }
                if (typeof r.error != "undefined") {
                    if (typeof r.error.message != "undefined") {
                        var msg = false;
                        if (r.error.message.indexOf("El n&uacute;mero de la tarjeta de cr&eacute;dito no es v&aacute;lido") != -1) {
                            msg = "El número de la tarjeta de crédito no es válido";
                        }
                        if (!verifyErrorNwMaker(r, self, msg) || verifyErrorNwMaker(r, self, msg) == 0) {
                            return;
                        }
                    }
                }
                var result = false;
                var html = "";
                if (typeof r["APPROVED"] != "undefined") {
                    var a = validateNwPayments(r["result"]);
                    html += "<p>Estado: " + a["status_description"] + "</p>";
                    html += "<p>Respuesta: " + a["responseCode"] + "</p>";
                    if (a["approved"] === true) {
                        result = true;
                    }
                } else {
                    html = r;
                }
                var params = {};
                params.html = html;
                params.textAccept = "Continuar";
                params.no_cancel_button = true;
                if (result === true) {
                    params.onSave = function () {
                        if (evalueData(p.callBack)) {
                            var h = {};
                            p.data["card"] = {};
                            h["dataInitial"] = p.data;
                            h["dataResultTransaction"] = r;
                            p.callBack(h);
                        }
                        return true;
                    };
                }
                createDialogNw(params);
            };
            rpcNw("rpcNw", rpc, func, true);
        });
        thisDoc.updateContend(r);
        removeLoadingNw();

        validaHidden();

        function validaHidden() {
            //validar si se usa
            return;
            var data = getRecordNwForm(self);
            if (evalueData(data.nombre_tarjeta) === false || evalueData(data.documento) === false || evalueData(data.email) === false) {
                addCss(self, ".contenedor_datos_user", {"display": "block"});
                addCss(self, ".contenedor_select_tarjeta", {"display": "none"});
                addCss(self, ".contenedor_crear_tarjeta", {"display": "none"});
                setVisibility(self, "continuar_datos", true);
                accept.css({"display": "none"});
                return;
            }
            accept.css({"display": "inline-block", "    min-width": "200px"});
            addCss(self, ".contenedor_datos_user", {"display": "block"});
            if (thisDoc.tienecards === false) {
                addCss(self, ".contenedor_crear_tarjeta", {"display": "block"});
            } else {
                addCss(self, ".contenedor_select_tarjeta", {"display": "block"});
            }
            setVisibility(self, "continuar_datos", false);
        }

        var continuar_datos = actionInColForm(self, "continuar_datos");
        continuar_datos.addClass("btnGreenAdd");
        continuar_datos.click(function () {
            if (!validateRequired(".contenedor_datos_user")) {
                return;
            }
            validaHidden();
        });

        if (evalueData(p.newCard)) {
            if (p.newCard === true) {
                $(self + " .contenedor_datos_user").css({"width": "100%"});
                $(self + " .contenedor_crear_tarjeta").css({"width": "100%"});
                $(self + " .contenedor_resumen_pago").fadeOut(0);
                $(self + " .contenedor_select_tarjeta").fadeOut(0);
                setVisibility(self, "cuotas", false);
                openNewCard();
                thisDoc.tienecards = false;
            }
        }

    }

    function updateContend(ra) {
        setRecord(self, ra);
    }

}