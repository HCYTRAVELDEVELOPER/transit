function f_direcciones() {
    var classDocument = ".f_direcciones";
    var self = createContainer(".container-main-nwdelivery", true, classDocument);
    var up = getUserInfo();

    var thisDoc = this;
    this.constructor = constructor;
    this.self = self;
    function constructor(r) {

        var fields = [];

        if (typeof up["usuario"] == "undefined") {
            var columnas =
                    {
                        tipo: 'textField',
                        nombre: 'Nombre',
                        name: 'nombre',
                        requerido: "SI",
                        texto_ayuda: "Nombre"
                    };
            fields.push(columnas);

            var columnas =
                    {
                        tipo: 'textField',
                        nombre: 'Apellido',
                        name: 'apellido',
                        requerido: "SI",
                        texto_ayuda: "Apellido"
                    };
            fields.push(columnas);

            var columnas =
                    {
                        tipo: 'textField',
                        nombre: 'Correo',
                        name: 'email',
                        requerido: "SI",
                        texto_ayuda: "Correo"
                    };
            fields.push(columnas);
        }

        var columnas =
                {
                    tipo: 'textField',
                    nombre: 'Latitud',
                    name: 'latitud',
                    texto_ayuda: 'latitud',
                    requerido: "SI",
                    visible: false
                };
        fields.push(columnas);
        var columnas =
                {
                    tipo: 'textField',
                    nombre: 'Longitud',
                    name: 'longitud',
                    texto_ayuda: 'longitud',
                    requerido: "SI",
                    visible: false
                };
        fields.push(columnas);


        var columnas =
                {
                    tipo: 'selectBox',
                    nombre: 'Ciudad',
                    name: 'ciudad',
                    requerido: "SI",
                    visible: true
                };
        fields.push(columnas);
        var columnas =
                {
                    tipo: 'textField',
                    nombre: 'Dirección',
                    name: 'direccion',
                    requerido: "SI",
                    enabled: true,
                    texto_ayuda: "Digite su dirección"
                };
        fields.push(columnas);
        var columnas =
                {
                    tipo: 'button',
                    nombre: 'Mis direcciones favoritas',
                    name: 'otras_direcciones'
                };
        fields.push(columnas);
        var columnas =
                {
                    tipo: 'textField',
                    nombre: 'Barrio',
                    name: 'barrio',
                    requerido: "NO",
                    texto_ayuda: "Digite el barrio"
                };
        fields.push(columnas);
        var columnas =
                {
                    tipo: 'textField',
                    nombre: 'Casa / Apto',
                    name: 'casa_apto',
                    requerido: "NO",
                    texto_ayuda: "Digite su # de casa o de apartamento"
                };
        fields.push(columnas);
        var columnas =
                {
                    tipo: 'textField',
                    nombre: 'Teléfono / Celular',
                    name: 'celular',
                    requerido: "SI",
                    texto_ayuda: "Digite su celular"
                };
        fields.push(columnas);
        var columnas =
                {
                    tipo: 'selectBox',
                    nombre: 'Forma de Pago',
                    name: 'forma_de_pago',
                    requerido: "SI",
                    texto_ayuda: "Digite su celular"
                };
        fields.push(columnas);
        var columnas =
                {
                    tipo: 'textArea',
                    nombre: 'Observaciones',
                    name: 'observaciones',
                    texto_ayuda: "Digite observaciones, ejemplo: pago con 50 mil, traer datáfono, etc"
                };
        fields.push(columnas);


        createNwForms(self, fields, "nopopUp");

        populateSelect(self, "ciudad", "nwdelivery", "consultaCiudadesTexto", {});

        setColumnsFormNumber(self, 2);

        setMaxWidth(self, 500);

        var data = {};
        data[""] = "Seleccione";
        data["tarjeta_credito"] = "Tarjeta Crédito";
        data["tarjeta_debito"] = "Tarjeta Débito";
        data["efectivo"] = "Efectivo";
        populateSelectFromArray("forma_de_pago", data);

        up["ciudad"] = "Bogota";
        setRecord(self, up);

        listAddCssFor(self, ".contain_input_name_otras_direcciones", {"width": "100%"});
        listAddCssFor(self, ".contain_input_name_direccion", {"width": "100%"});
        listAddCssFor(self, ".contain_input_name_observaciones", {"width": "100%"});
        listAddCssFor(self, "#observaciones", {"border": "1px solid #bababa"});


        setContainerGeoSuggestions(".contain_input_name_direccion");
        $(".contain_input_name_direccion").keyup(function () {
            var d = new f_busca_direccion();
            d.ubicaDirEnMapa(self, null, "direccion");
        });


        var btn = selfButton(self, "otras_direcciones");
        btn.click(function () {
            var d = new l_mis_direcciones(self);
            d.constructor();
        });
        var accept = "";
        var cancel = "";
        if (isMobile()) {
            cancel = addButtonNwForm("Volver", self);
            accept = addButtonNwForm("Continuar", self);
        } else {
            accept = addButtonNwForm("Continuar", self);
            cancel = addButtonNwForm("Volver", self);
        }
        cancel.click(function () {
            reloadPageRaiz();
        });

        accept.addClass("btnBlueBig");
        cancel.addClass("volverAtrasPasosBig");
        accept.click(function () {
            var data = getRecordNwForm(self);
            if (!validateRequired(self)) {
                return;
            }
            var d = new f_busca_direccion();
            d.pointInMapIs(self, data["latitud"], data["longitud"], function (t) {

                remove(".ui-dialog");
                remove(".ui-widget-overlay");

                var rpc = {};
                rpc["service"] = "nwdelivery";
                rpc["method"] = "addDireccionSession";
                rpc["data"] = data;
                var func = function (r) {
                    if (!verifyErrorNwMaker(r, self)) {
                        return;
                    }
                    reject(self, false);
                    loadStepThree();
                };
                rpcNw("rpcNw", rpc, func, true);
            }, true);
        });

        addCss(self, ".volverAtrasPasosBig", {"background": "#c1c1c1"});
        addCss(self, ".btnBlueBig", {"background": "rgb(60, 186, 111)"});

        listAddCssFor(self, ".footerButtonsNwForms", {"position": "fixed", "bottom": "0px", "width": "100%", "padding": "0px", "z-index": "1"}, "mobile");
        listAddCssFor(self, ".button_nwform", {"width": "50%", "margin": "0px", "padding": "10px", "float": "left", "font-size": "14px", "max-width": "initial", "border": "0", "border-radius": "0px", "color": "#fff"}, "mobile");

    }
}
