function f_ver_producto() {
    var classDocument = ".f_ver_producto";
    var self = generateSelf(classDocument);
    var thisDoc = this;
    this.constructor = constructor;
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
                title: "Unidades",
                mode: "horizontal",
                name_group: "grupop",
                numberCols: "1",
                tipo: "startGroup"
            },
            {
                tipo: 'image',
                nombre: 'Imagen',
                name: 'foto'
            },
            {
                tipo: 'label',
                nombre: 'Nombre',
                name: 'nombre'
            },
            {
                tipo: 'label',
                nombre: 'Descripción',
                name: 'descripcion'
            },
            {
                tipo: "endGroup"
            },
            {
                title: "Unidades",
                mode: "horizontal",
                name_group: "grupouno",
                numberCols: "1",
                tipo: "startGroup"
            },
            {
                type: 'button',
                nombre: '-',
                name: 'restar',
                style: {
                    margin: 'auto',
                    width: '50px',
                    background: '#ccc',
                    color: '#000'
                }
            },
            {
                type: 'textField',
                mode: 'integer',
                nombre: 'Unidadades',
                name: 'unidades',
                required: true,
                enabled: false,
                style: {
                    "margin": 'auto',
                    "width": '100px',
                    "background": '#fff',
                    "border": '0',
                    "box-shadow": "none",
                    "text-align": "center",
                    "font-weight": "bold",
                    "font-size": "20px",
                    "max-width": "130px"
                }
            },
            {
                type: 'button',
                nombre: '+',
                name: 'suma',
                style: {
                    margin: 'auto',
                    width: '50px',
                    background: '#ccc',
                    color: '#000'
                }
            },
            {
                tipo: 'label',
                nombre: 'Valor',
                name: 'valor'
            },
            {
                tipo: "endGroup"
            },
            {
                tipo: 'label',
                nombre: 'Adicionales',
                name: 'adicionales'
            }
        ];

        var ops = [];
        var rpc = {};
        rpc["service"] = "nwdelivery";
        rpc["method"] = "consultaProductosOpciones";
        rpc["data"] = r;
        var func = function (rr) {
            if (rr == 0) {
            } else {
                for (var i = 0; i < rr.length; i++) {
                    var f = rr[i];
                    ops[i] = {};
                    ops[i]["id"] = f["id"];
                    var require = "NO";
                    if (f["requerido"] == "SI") {
                        require = "SI";
                    }
                    var tipo = "radio";
                    if (f["multiseleccion"] == "SI") {
                        tipo = "checkBoxMultiple";
                    }
                    var columnas =
                            {
                                tipo: tipo,
                                nombre: f["nombre"],
                                name: f["id"],
                                requerido: require
                            };
                    fields.push(columnas);
                }
            }
        };
        rpcNw("rpcNw", rpc, func, false);

        createNwForms(self, fields, "nopopup");

        setValue(self, "unidades", "1");

        var valor_unit = r.valor;

        var units = parseInt(getValue(self, "unidades"));
        var btn = selfButton(self, "suma");
        clickInObject(btn, function () {
            units++;
            var u = units;
            var v = valor_unit;
            v = v.replace("$", "");
            var newVal = parseInt(v) * parseInt(u);
            setValue(self, "unidades", u);
            setValue(self, "valor", newVal);
        }, true);
        var btn = selfButton(self, "restar");
        clickInObject(btn, function () {
            if (units <= 1) {
                return;
            }
            units--;
            var u = units;
            var v = valor_unit;
            v = v.replace("$", "");
            var newVal = parseInt(v) * parseInt(u);
            setValue(self, "unidades", u);
            setValue(self, "valor", newVal);
        }, true);

        if (ops.length > 0) {
            for (var x = 0; x < ops.length; x++) {
                var b = ops[x];
                var rpc = {};
                rpc["service"] = "nwdelivery";
                rpc["method"] = "consultaProductosRelacionados";
                rpc["data"] = b;
                var func = function (r) {
                    if (r != 0) {
                        var data = {};
                        for (var i = 0; i < r.length; i++) {
                            var f = r[i];
                            var valor = " $(" + f["valor"] + ")";
                            if (f["valor"] == "0" || f["valor"] == 0) {
                                valor = " (Gratis)";
                            }
                            data[f["id"] + "(" + f["valor"] + ")"] = f["producto_nombre"] + valor;
                        }
                        populateSelectFromArray(b["id"], data, self);
                    }
                };
                rpcNw("rpcNw", rpc, func, false);
            }
        }

        if (ops.length == 0) {
            setVisibility(self, "adicionales", false);
        }

        setColumnsFormNumber(self, 2);
        setMaxWidth(self, 800);

        var phpthumb = "phpthumb";
        if (typeof usePhpThumb != "undefined") {
            if (usePhpThumb == false) {
                phpthumb = "nophpthumb";
            }
        }
        r["foto"] = getFileByType(r["foto"], phpthumb);
        setRecord(self, r);
        setValue(self, "valor_unitario", r.valor);
        
        setValue(self, "adicionales", "Agregra tus adicionales");

        listAddCssFor(self, ".contain_input_name_adicionales p", {"display": "none"});
        listAddCssFor(self, ".contain_input_name_foto p", {"display": "none"});
        listAddCssFor(self, ".contain_input_name_nombre p", {"display": "none"});
        listAddCssFor(self, ".contain_input_name_descripcion p", {"display": "none"});
        listAddCssFor(self, ".contain_input_name_valor p", {"display": "none"});
        listAddCssFor(self, ".contain_input_name_foto", {"width": "40%"});
        listAddCssFor(self, ".contain_input_name_valor", {"width": "auto", "float": "right"});
        listAddCssFor(self, "#valor", {"font-weight": "bold", "font-size": "20px"});
        listAddCssFor(self, "#nombre", {"font-weight": "bold", "font-size": "20px"});
        listAddCssFor(self, ".nameimgup_foto", {"max-height": "200px", "max-width": "200px"});
        listAddCssFor(self, ".showImageNwForm img", {"max-height": "200px"});
        listAddCssFor(self, ".contain_input_name_nombre", {"width": "50%"});
        listAddCssFor(self, ".contain_input_name_descripcion", {"width": "50%"});

        listAddCssFor(self, ".footerButtonsNwForms", {"margin-bottom": "100px"});

        listAddCssFor(self, ".divContainInput p", {"font-weight": "bold", "font-size": "13px"});

        listAddCssFor(self, ".contain_input_name_adicionales", {"width": "100%", "border-bottom": "1px solid #e5e5e5", "background": "#f5f5f5"});

//        listAddCssFor(self, ".contain_input_name_separador", {"width": "100%"});
        listAddCssFor(self, ".grupop", {"width": "100%", "margin": "0px"});
        listAddCssFor(self, ".grupouno", {"width": "auto", "margin": "0", "float": "right", "background": "transparent", "border": "0", "box-shadow": "none"});
        listAddCssFor(self, ".grupouno", {"float": "none"}, "mobile");
        listAddCssFor(self, ".contain_input_name_restar", {"width": "auto"});
        listAddCssFor(self, ".contain_input_name_suma", {"width": "auto"});
        listAddCssFor(self, ".contain_input_name_unidades", {"width": "auto"});
//        listAddCssFor(self, ".contain_input_name_valor_unitario", {"width": "auto"});

        if (isMobile()) {
            var cancel = addButtonNwForm("Volver", self);
            var accept = addButtonNwForm("Agregar", self);
        } else {
            var accept = addButtonNwForm("Agregar", self);
            var cancel = addButtonNwForm("Volver", self);
        }

        cancel.click(function () {
            addHash(location.pathname + location.hash);
            reject(self);
        });

        accept.addClass("btn_forms");
        accept.addClass("btn_forms_addproduct");
        accept.click(function () {
            if (!validateRequired(self)) {
                return;
            }
            var data = getRecordNwForm(self);
            var adi = [];
            $.each(data, function (key, value) {
                var k = value.split("(");
                if (k.length > 1) {
                    var dd = {
                        producto_texto: value,
                        id: k[0],
                        producto_valor: k[1].replace(")", "")
                    };
                    adi.push(dd);
                }
            });
            data["adicionales"] = adi;

            var rpc = {};
            rpc["service"] = "nwdelivery";
            rpc["method"] = "agregarProductoCarrito";
            rpc["data"] = data;
            var func = function (r) {
                if (r) {
                    reject(self);
                    var d = new l_carrito_flotante();
                    d.constructor();
                    if (isMobile()) {
                        $(".l_carrito_flotante").fadeOut(0);
                    }
                    removeLoadingNw();
                    addHash(location.pathname + location.hash);
                } else {
                    nw_dialog("Algo inesperado ha ocurrido, console...");
                    console.log(r);
                }
            };
            rpcNw("rpcNw", rpc, func, true);
        });

        addCss(self, ".button_nwform", {"background": "#c1c1c1"});
        addCss(self, ".btn_forms_addproduct", {"background": "rgb(60, 186, 111)"});

        listAddCssFor(self, ".footerButtonsNwForms", {"position": "fixed", "bottom": "50px", "margin": "0", "width": "100%", "padding": "0px"}, "mobile");
        listAddCssFor(self, ".button_nwform", {"width": "50%", "padding": "8px", "margin": "0px", "float": "none", "display": "inline-block", "height": "auto", "border": "0px", "border-radius": "0px", "font-size": "14px", "font-weight": "lighter"}, "mobile");

        scrollPage("container-nwmaker", 500, 0, false);

    }
}
