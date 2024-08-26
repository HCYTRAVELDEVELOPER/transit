qx.Class.define("qxnw.widgets.addressWidget", {
    extend: qx.ui.core.Widget,
    construct: function construct(country) {
        this.base(arguments);
        var self = this;
        self.widgets = [];
        self.setCountry(country);
        var layout = new qx.ui.layout.VBox();
        this._setLayout(layout);
        layout.setAlignY("middle");
        self.setAppearance("textfield");
        self.setMaxHeight(210);
        self.containerSelections = new qx.ui.container.Composite(new qx.ui.layout.HBox());
        self._add(self.containerSelections);
        self.containerComplements = new qx.ui.container.Composite(new qx.ui.layout.VBox());
        self._add(self.containerComplements);

        self.__groupComplements = new qx.ui.groupbox.GroupBox(self.tr("Complementos"), qxnw.config.execIcon("bookmark-new")).set({
            contentPadding: 2
        });
        self.__groupComplements.setLayout(new qx.ui.layout.VBox().set({
            spacing: 5
        }));
        self.containerComplements.add(self.__groupComplements);

        self.containerTranslate = new qx.ui.container.Composite(new qx.ui.layout.HBox());
        self._add(self.containerTranslate);
        this.addListener("focusin", function (e) {
            self.widgets["type"].fireNonBubblingEvent("focusin", qx.event.type.Focus);
        }, this);
        this.addListener("focusout", function (e) {
            self.widgets["type"].fireNonBubblingEvent("focusout", qx.event.type.Focus);
        }, this);
        self.createByCountry(country);

        self.__groupLabels = new qx.ui.groupbox.GroupBox(self.tr("Dirección completa"), qxnw.config.execIcon("dialog-apply")).set({
            contentPadding: 7
        });
        self.__groupLabels.setLayout(new qx.ui.layout.VBox().set({
            spacing: 5
        }));
        self.lblTranslate = new qx.ui.basic.Label().set({
            paddingTop: 8,
            visibility: "excluded"
        });
        self.lblTranslateShow = new qx.ui.basic.Label().set({
            paddingTop: 8
        });
        self.__groupLabels.add(self.lblTranslate);
        self.__groupLabels.add(self.lblTranslateShow);

        self.containerTranslate.add(self.__groupLabels, {
            flex: 1
        });
    },
    events: {
        input: "qx.event.type.Data"
    },
    properties: {
        "country": {
            init: null,
            check: "String"
        }
    },
    members: {
        _isCreatedTime: false,
        widgets: null,
        containerSelections: null,
        containerTranslate: null,
        lblTranslate: null,
        lblTranslateShow: null,
        type_len: 16,
        via_len: 31,
        prefix_len: 3,
        prefix_a_len: 5,
        generadora_len: 4,
        generadora_a_len: 3,
        placa_len: 5,
        cuadrante_len: 11,
        complemento_len: 23,
        adicional_len: 23,
        translate_address: true,
        __groupComplements: null,
        setRequired: function setRequired() {
            if (qx.core.Environment.get("qx.debug")) {
                qxnw.utils.information(this.tr("Por las características de este widget (addressWidget) no acepta ser requerido obligatorio"));
            }
        },
        translateAddress: function translateAddress(val) {
            var self = this;
            self.translate_address = false;
            var v;
            if (typeof val == 'undefined') {
                v = this.getValue();
            } else {
                v = val;
            }

            this.lblTranslate.setValue(v);
            var val = v.replace(/\s\s+/g, ' ');
            this.lblTranslateShow.setValue(val);
            self.translate_address = true;
        },
        addListeners: function addListeners() {
            var self = this;
            self.widgets["type"].addListener("changeSelection", function () {
                if (self.translate_address == true) {
                    self.translateAddress();
                }
            });
            self.widgets["via"].addListener("changeValue", function () {
                if (self.translate_address == true) {
                    self.translateAddress();
                }
            });
            self.widgets["via"].addListener("keyup", function () {
                if (self.translate_address == true) {
                    self.translateAddress();
                }
            });
            self.widgets["prefix"].addListener("changeSelection", function () {
                if (self.translate_address == true) {
                    self.translateAddress();
                }
            });
            self.widgets["prefix_a"].addListener("changeSelection", function () {
                if (self.translate_address == true) {
                    self.translateAddress();
                }
            });
            self.widgets["generadora"].addListener("changeValue", function () {
                if (self.translate_address == true) {
                    self.translateAddress();
                }
            });
            self.widgets["generadora"].getChildControl("textfield").addListener("keyup", function () {
                if (self.translate_address == true) {
                    self.translateAddress();
                }
            });
            self.widgets["generadora_a"].addListener("changeSelection", function () {
                if (self.translate_address == true) {
                    self.translateAddress();
                }
            });
            self.widgets["placa"].addListener("changeValue", function () {
                if (self.translate_address == true) {
                    self.translateAddress();
                }
            });
            self.widgets["placa"].getChildControl("textfield").addListener("keyup", function () {
                if (self.translate_address == true) {
                    self.translateAddress();
                }
            });
            self.widgets["cuadrante"].addListener("changeSelection", function () {
                if (self.translate_address == true) {
                    self.translateAddress();
                }
            });
            self.widgets["complemento"].addListener("changeSelection", function () {
                if (self.translate_address == true) {
                    self.translateAddress();
                }
            });
            self.widgets["complemento1"].addListener("changeSelection", function () {
                if (self.translate_address == true) {
                    self.translateAddress();
                }
            });
            self.widgets["complemento2"].addListener("changeSelection", function () {
                if (self.translate_address == true) {
                    self.translateAddress();
                }
            });
            self.widgets["adicional"].addListener("keyup", function () {
                if (self.translate_address == true) {
                    self.translateAddress();
                }
            });
            self.widgets["adicional1"].addListener("keyup", function () {
                if (self.translate_address == true) {
                    self.translateAddress();
                }
            });
            self.widgets["adicional2"].addListener("keyup", function () {
                if (self.translate_address == true) {
                    self.translateAddress();
                }
            });
        },
        createByCountry: function createByCountry(country) {
            var self = this;
            switch (country) {
                case "co":
                    var d = [];
                    d[""] = "";
                    d["Adelante"] = "Adelante";
                    d["Administración"] = "Administración";
                    d["Aeropuerto"] = "Aeropuerto";
                    d["Agencia"] = "Agencia";
                    d["Agrupación"] = "Agrupación";
                    d["Al lado"] = "Al lado";
                    d["Almacén"] = "Almacén";
                    d["Almacén"] = "Almacén";
                    d["Altillo"] = "Altillo";
                    d["Anillo vial"] = "Anillo vial";
                    d["Apartamento"] = "Apartamento";
                    d["Apartado"] = "Apartado";
                    d["Atrás"] = "Atrás";
                    d["Autopista"] = "Autopista";
                    d["Avenida"] = "Avenida";
                    d["Avenida calle"] = "Avenida calle";
                    d["Avenida carrera"] = "Avenida carrera";
                    d["Barrio"] = "Barrio";
                    d["Bloque"] = "Bloque";
                    d["Bodega"] = "Bodega";
                    d["Boulevard"] = "Boulevard";
                    d["Calle"] = "Calle";
                    d["Callejón"] = "Callejón";
                    d["Casa"] = "Casa";
                    d["Camino"] = "Camino";
                    d["Carrera"] = "Carrera";
                    d["Carretera"] = "Carretera";
                    d["Caserío"] = "Caserío";
                    d["Célula"] = "Célula";
                    d["Centro"] = "Centro";
                    d["Centro comercial"] = "Centro comercial";
                    d["Ciudadela"] = "Ciudadela";
                    d["Circular"] = "Circular";
                    d["Circunvalar"] = "Circunvalar";
                    d["Conjunto"] = "Conjunto";
                    d["Conjunto residencial"] = "Conjunto residencial";
                    d["Consultorio"] = "Consultorio";
                    d["Corregimiento"] = "Corregimiento";
                    d["Departamento"] = "Departamento";
                    d["Depósito"] = "Depósito";
                    d["Depósito sótano"] = "Depósito sótano";
                    d["Diagonal"] = "Diagonal";
                    d["Edificio"] = "Edificio";
                    d["Entrada"] = "Entrada";
                    d["Escalera"] = "Escalera";
                    d["Esquina"] = "Esquina";
                    d["Este"] = "Este";
                    d["Etapa"] = "Etapa";
                    d["Exterior"] = "Exterior";
                    d["Finca"] = "Finca";
                    d["Garaje"] = "Garaje";
                    d["Garaje sótano"] = "Garaje sótano";
                    d["Glorieta"] = "Glorieta";
                    d["Hacienda"] = "Hacienda";
                    d["Hangar"] = "Hangar";
                    d["Interior"] = "Interior";
                    d["Inspección de Policía"] = "Inspección de Policía";
                    d["Inspección Departamental"] = "Inspección Departamental";
                    d["Inspección Municipal"] = "Inspección Municipal";
                    d["Kilómetro"] = "Kilómetro";
                    d["Local"] = "Local";
                    d["Lote"] = "Lote";
                    d["Manzana"] = "Manzana";
                    d["Mezzanine"] = "Mezzanine";
                    d["Módulo"] = "Módulo";
                    d["Mojón"] = "Mojón";
                    d["Muelle"] = "Muelle";
                    d["Norte"] = "Norte";
                    d["Occidente"] = "Occidente";
                    d["Oeste"] = "Oeste";
                    d["Oficina"] = "Oficina";
                    d["Oriente"] = "Oriente";
                    d["Penthouse"] = "Penthouse";
                    d["Paraje"] = "Paraje";
                    d["Parcela"] = "Parcela";
                    d["Park Way"] = "Park Way";
                    d["Parque"] = "Parque";
                    d["Parqueadero"] = "Parqueadero";
                    d["Pasaje"] = "Pasaje";
                    d["Paseo"] = "Paseo";
                    d["Piso"] = "Piso";
                    d["Planta"] = "Planta";
                    d["Predio"] = "Predio";
                    d["Poste"] = "Poste";
                    d["Portería"] = "Portería";
                    d["Puente"] = "Puente";
                    d["Puesto"] = "Puesto";
                    d["Round Point"] = "Round Point";
                    d["Salida"] = "Salida";
                    d["Salón"] = "Salón";
                    d["Salón comunal"] = "Salón comunal";
                    d["Sector"] = "Sector";
                    d["Semisótano"] = "Semisótano";
                    d["Solar"] = "Solar";
                    d["Sótano"] = "Sótano";
                    d["Suite"] = "Suite";
                    d["Súper manzana"] = "Súper manzana";
                    d["Sur"] = "Sur";
                    d["Terminal"] = "Terminal";
                    d["Terraplén"] = "Terraplén";
                    d["Terraza"] = "Terraza";
                    d["Torre"] = "Torre";
                    d["Transversal"] = "Transversal";
                    d["Transversal"] = "Transversal";
                    d["Unidad"] = "Unidad";
                    d["Unidad residencial"] = "Unidad residencial";
                    d["Urbanización"] = "Urbanización";
                    d["Variante"] = "Variante";
                    d["Vereda"] = "Vereda";
                    d["Vías de nombre común"] = "Vías de nombre común";
                    d["Zona"] = "Zona";
                    d["Zona franca"] = "Zona franca";
//                    d.sort((a,b)=>{
//                        a=a.toLowerCase();
//                        b=b.toLowerCase();
//                        if(a==b){
//                            return 0
//                        }
//                        if(a<b){
//                            return -1
//                        }
//                        return 1
//                    });
                    var maxHeight = 25;
                    self.widgets["type"] = new qxnw.fields.selectBox().set({
                        maxHeight: maxHeight
                    });
                    self.widgets["type"].setMaxWidth(140);
                    self.type = self.widgets["type"];
                    qxnw.utils.populateSelectFromArray(self.widgets["type"], d);
                    qxnw.utils.addDevTooltip(self.widgets["type"], "Para ocultarlo: self.ui.addressWidget.type.setVisibility('excluded')", "Tipo Calle");
                    self.containerSelections.add(self.widgets["type"], {
                        flex: 1
                    });
                    maxHeight = 999;
                    self.widgets["via"] = new qxnw.widgets.normalTextField().set({
                        maxLength: self.via_len
                    });
                    self.via = self.widgets["via"];
                    self.via.setFilter(/[^«#$%&/()=*?¡¿@.;,:-]/);
                    qxnw.utils.addDevTooltip(self.widgets["via"], "Para ocultarlo: self.ui.addressWidget.via.setVisibility('excluded')", "Vía - Número");
                    self.containerSelections.add(self.widgets["via"], {
                        flex: 1
                    });
                    self.widgets["prefix"] = new qxnw.fields.selectBox().set({
                        maxWidth: 45
                    });
                    qxnw.utils.populateSelectFromArray(self.widgets["prefix"], qxnw.utils.getABCLetters());
                    self.prefix = self.widgets["prefix"];
                    self.widgets["prefix"].setMaxWidth(50);
                    qxnw.utils.addDevTooltip(self.widgets["prefix"], "Para ocultarlo: self.ui.addressWidget.prefix.setVisibility('excluded')", "Prefijo - Letra");
                    self.containerSelections.add(self.widgets["prefix"], {
                        flex: 1
                    });
                    d = [];
                    d[""] = "";
                    d["ESTE"] = "ESTE";
                    d["BIS"] = "BIS";
                    d["Sur"] = "Sur";
                    self.widgets["prefix_a"] = new qxnw.fields.selectBox().set({
                        maxHeight: maxHeight
                    });
                    self.prefix_a = self.widgets["prefix_a"];
                    qxnw.utils.addDevTooltip(self.widgets["prefix_a"], "Para ocultarlo: self.ui.addressWidget.prefix_a.setVisibility('excluded')", "Prefijo BIS");
                    self.widgets["prefix_a"].setMaxWidth(60);
                    qxnw.utils.populateSelectFromArray(self.widgets["prefix_a"], d);
                    self.containerSelections.add(self.widgets["prefix_a"], {
                        flex: 1
                    });
                    self.widgets["generadora"] = new qx.ui.form.Spinner().set({
                        maxHeight: maxHeight,
                        maximum: 999,
                        minimum: 0
                    });
                    self.generadora = self.widgets["generadora"];
                    qxnw.utils.addDevTooltip(self.widgets["generadora"], "Para ocultarlo: self.ui.addressWidget.generadora.setVisibility('excluded')", "Generadora - Número");
                    self.widgets["generadora"].setMaxWidth(70);
                    self.containerSelections.add(self.widgets["generadora"], {
                        flex: 1
                    });
                    self.widgets["generadora_a"] = new qxnw.fields.selectBox().set({
                        maxWidth: 45
                    });
                    qxnw.utils.populateSelectFromArray(self.widgets["generadora_a"], qxnw.utils.getABCLetters());
                    self.generadora_a = self.widgets["generadora_a"];
                    qxnw.utils.addDevTooltip(self.widgets["generadora_a"], "Para ocultarlo: self.ui.addressWidget.generadora_a.setVisibility('excluded')", "Generadora - Letra");

                    self.containerSelections.add(self.widgets["generadora_a"], {
                        flex: 1
                    });
                    var label = new qx.ui.basic.Label("-").set({
                        maxHeight: maxHeight
                    });
                    self.containerSelections.add(label, {
                        flex: 1
                    });
                    self.widgets["placa"] = new qx.ui.form.Spinner().set({
                        maxHeight: maxHeight,
                        maximum: 999,
                        minimum: 0
                    });
                    self.placa = self.widgets["placa"];
                    qxnw.utils.addDevTooltip(self.widgets["placa"], "Para ocultarlo: self.ui.addressWidget.placa.setVisibility('excluded')", "Placa - Número");
                    self.widgets["placa"].setMaxWidth(70);
                    self.containerSelections.add(self.widgets["placa"], {
                        flex: 1
                    });
                    d = [];
                    d[""] = "";
                    d["Norte"] = "Norte";
                    d["Occidente"] = "Occidente";
                    d["Oriente"] = "Oriente";
                    d["Sur"] = "Sur";
                    d["Oeste"] = "Oeste";
                    d["Este"] = "Este";
                    self.widgets["cuadrante"] = new qxnw.fields.selectBox().set({
                        maxHeight: maxHeight
                    });
                    self.cuadrante = self.widgets["cuadrante"];
                    qxnw.utils.addDevTooltip(self.widgets["cuadrante"], "Para ocultarlo: self.ui.addressWidget.cuadrante.setVisibility('excluded')", "Cuadrante - Orientación");
                    self.widgets["cuadrante"].setMaxWidth(100);
                    self.widgets["cuadrante"].setMinWidth(100);
                    qxnw.utils.populateSelectFromArray(self.widgets["cuadrante"], d);
                    self.containerSelections.add(self.widgets["cuadrante"], {
                        flex: 1
                    });
                    self.createComplements("");
                    self.createComplements(1);
                    self.createComplements(2);
                    break;
            }
            self.addListeners();
        },
        createComplements: function createComplements(index) {
            var self = this;
            var container = new qx.ui.container.Composite(new qx.ui.layout.HBox());
            var maxHeight = 999;
            var d = [];
            d[""] = "";
            d["Autopista"] = "Autopista";
            d["Avenida calle"] = "Avenida calle";
            d["Administración"] = "Administración";
            d["Adelante"] = "Adelante";
            d["Aeropuerto"] = "Aeropuerto";
            d["Agencia"] = "Agencia";
            d["Agrupación"] = "Agrupación";
            d["Avenida carrera"] = "Avenida carrera";
            d["Altillo"] = "Altillo";
            d["Al lado"] = "Al lado";
            d["Almacén"] = "Almacén";
            d["Almacén"] = "Almacén";
            d["Apartamento"] = "Apartamento";
            d["Apartado"] = "Apartado";
            d["Atrás"] = "Atrás";
            d["Autopista"] = "Autopista";
            d["Avenida"] = "Avenida";
            d["Anillo vial"] = "Anillo vial";
            d["Bodega"] = "Bodega";
            d["Bloque"] = "Bloque";
            d["Boulevard"] = "Boulevard";
            d["Barrio"] = "Barrio";
            d["Corregimiento"] = "Corregimiento";
            d["Casa"] = "Casa";
            d["Caserío"] = "Caserío";
            d["Centro comercial"] = "Centro comercial";
            d["Ciudadela"] = "Ciudadela";
            d["Célula"] = "Célula";
            d["Centro"] = "Centro";
            d["Circular"] = "Circular";
            d["Calle"] = "Calle";
            d["Callejón"] = "Callejón";
            d["Camino"] = "Camino";
            d["Conjunto residencial"] = "Conjunto residencial";
            d["Conjunto"] = "Conjunto";
            d["Carrera"] = "Carrera";
            d["Carretera"] = "Carretera";
            d["Circunvalar"] = "Circunvalar";
            d["Consultorio"] = "Consultorio";
            d["Diagonal"] = "Diagonal";
            d["Depósito"] = "Depósito";
            d["Departamento"] = "Departamento";
            d["Depósito sótano"] = "Depósito sótano";
            d["Edificio"] = "Edificio";
            d["Entrada"] = "Entrada";
            d["Escalera"] = "Escalera";
            d["Esquina"] = "Esquina";
            d["Este"] = "Este";
            d["Etapa"] = "Etapa";
            d["Exterior"] = "Exterior";
            d["Finca"] = "Finca";
            d["Garaje"] = "Garaje";
            d["Garaje sótano"] = "Garaje sótano";
            d["Glorieta"] = "Glorieta";
            d["Hacienda"] = "Hacienda";
            d["Hangar"] = "Hangar";
            d["Interior"] = "Interior";
            d["Inspección de Policía"] = "Inspección de Policía";
            d["Inspección Departamental"] = "Inspección Departamental";
            d["Inspección Municipal"] = "Inspección Municipal";
            d["Kilómetro"] = "Kilómetro";
            d["Local"] = "Local";
            d["Lote"] = "Lote";
            d["Módulo"] = "Módulo";
            d["Mojón"] = "Mojón";
            d["Muelle"] = "Muelle";
            d["Mezzanine"] = "Mezzanine";
            d["Manzana"] = "Manzana";
            d["Vías de nombre común"] = "Vías de nombre común";
            d["Norte"] = "Norte";
            d["Oriente"] = "Oriente";
            d["Occidente"] = "Occidente";
            d["Oeste"] = "Oeste";
            d["Oficina"] = "Oficina";
            d["Piso"] = "Piso";
            d["Parcela"] = "Parcela";
            d["Parque"] = "Parque";
            d["Predio"] = "Predio";
            d["Penthouse"] = "Penthouse";
            d["Pasaje"] = "Pasaje";
            d["Planta"] = "Planta";
            d["Puente"] = "Puente";
            d["Portería"] = "Portería";
            d["Poste"] = "Poste";
            d["Parqueadero"] = "Parqueadero";
            d["Paraje"] = "Paraje";
            d["Paseo"] = "Paseo";
            d["Puesto"] = "Puesto";
            d["Park Way"] = "Park Way";
            d["Round Point"] = "Round Point";
            d["Salón"] = "Salón";
            d["Salón comunal"] = "Salón comunal";
            d["Salida"] = "Salida";
            d["Sector"] = "Sector";
            d["Solar"] = "Solar";
            d["Súper manzana"] = "Súper manzana";
            d["Semisótano"] = "Semisótano";
            d["Sótano"] = "Sótano";
            d["Suite"] = "Suite";
            d["Sur"] = "Sur";
            d["Terminal"] = "Terminal";
            d["Terraplén"] = "Terraplén";
            d["Torre"] = "Torre";
            d["Terraza"] = "Terraza";
            d["Transversal"] = "Transversal";
            d["Unidad"] = "Unidad";
            d["Unidad residencial"] = "Unidad residencial";
            d["Urbanización"] = "Urbanización";
            d["Vereda"] = "Vereda";
            d["Variante"] = "Variante";
            d["Zona franca"] = "Zona franca";
            d["Zona"] = "Zona";
//            d["Agrupación"] = "Agrupación";
//            d["Apartamento"] = "Apartamento";
//            d["Bloque"] = "Bloque";
//            d["Bodega"] = "Bodega";
//            d["Camino"] = "Camino";
//            d["Carretera"] = "Carretera";  
//            d["Casa"] = "Casa";
//            d["Célula"] = "Célula";
//            d["Centro Comercial"] = "Centro Comercial";
//            d["Conjunto"] = "Conjunto";
//            d["Conjunto Residencial"] = "Conjunto Residencial";
//            d["Consultorio"] = "Consultorio";
//            d["Depósito"] = "Depósito";
//            d["Edificio"] = "Edificio";
//            d["Entrada"] = "Entrada";
//            d["Esquina"] = "Esquina";
//            d["Etapa"] = "Etapa";
//            d["Garaje"] = "Garaje";
//            d["Interior"] = "Interior";
//            d["Kilómetro"] = "Kilómetro";
//            d["Local"] = "Local";
//            d["Lote"] = "Lote";
//            d["Manzana"] = "Manzana";
//            d["Mezanine"] = "Mezanine";
//            d["Módulo"] = "Módulo";
//            d["Norte"] = "Norte";
//            d["Oeste"] = "Oeste";
//            d["Oriente"] = "Oriente";
//            d["Oficina"] = "Oficina";
//            d["Parque industrial"] = "Parque industrial";
//            d["Paseo"] = "Paseo";
//            d["Penthouse"] = "Penthouse";
//            d["Piso"] = "Piso";
//            d["Predio"] = "Predio";
//            d["Puente"] = "Puente";
//            d["Salón comunal"] = "Salón comunal";
//            d["Sector"] = "Sector";
//            d["Semisótano"] = "Semisótano";
//            d["Solar"] = "Solar";
//            d["Supermanzana"] = "Supermanzana";
//            d["Torre"] = "Torre";
//            d["Ubanización"] = "Ubanización";
//            d["Ubanización y zona"] = "Ubanización y zona";
//            d["Unidad"] = "Unidad";
//            d["Unidad Residencial"] = "Unidad Residencial";
//            d["Vereda"] = "Vereda";
//            d["Vía"] = "Vía";
            self.widgets["complemento" + index] = new qxnw.fields.selectBox().set({
                maxHeight: maxHeight,
                maxWidth: 200
            });
            self.complemento = self.widgets["complemento" + index];
            qxnw.utils.addDevTooltip(self.widgets["complemento" + index], "Para ocultarlo: self.ui.addressWidget.complemento" + index + ".setVisibility('excluded')", "Tipo Vivienda");
            qxnw.utils.populateSelectFromArray(self.widgets["complemento" + index], d);
            container.add(self.widgets["complemento" + index], {
                flex: 1
            });
            self.widgets["adicional" + index] = new qxnw.widgets.normalTextField().set({
                maxHeight: maxHeight,
                maxLength: self.adicional_len
            });
            self.adicional = self.widgets["adicional" + index];
            qxnw.utils.addDevTooltip(self.widgets["adicional" + index], "Para ocultarlo: self.ui.addressWidget.adicional" + index + ".setVisibility('excluded')");
            container.add(self.widgets["adicional" + index], {
                flex: 1
            });
            self.__groupComplements.add(container);
        },
        setValue: function setValue(v) {
            var self = this;
            if (v === "") {
                self.widgets["type"].setValue("");
                self.widgets["via"].setValue("");
                self.widgets["prefix"].setValue("");
                self.widgets["prefix_a"].setValue("");
                self.widgets["generadora"].setValue(null);
                self.widgets["generadora_a"].setValue("");
                self.widgets["placa"].setValue(null);
                self.widgets["cuadrante"].setValue("");
                self.widgets["complemento"].setValue("");
                self.widgets["adicional"].setValue("");
                self.widgets["complemento1"].setValue("");
                self.widgets["adicional1"].setValue("");
                self.widgets["complemento2"].setValue("");
                self.widgets["adicional2"].setValue("");
                self.lblTranslate.setValue("");
                self.lblTranslateShow.setValue("");
                return;
            }
            try {
                var count = 0;
                var type = v.substr(count, self.type_len);
                count = self.type_len;
                self.widgets["type"].setValue(type.trim());
                var via = v.substr(count, self.via_len);
                count = count + self.via_len;
                via = via.trim();
                if (via != null) {
                    if (via != "") {
                        self.widgets["via"].setValue(via);
                    }
                }
                var prefix = v.substr(count, self.prefix_len);
                count = count + self.prefix_len;
                self.widgets["prefix"].setValue(prefix.trim());
                var prefix_a = v.substr(count, self.prefix_a_len);
                count = count + self.prefix_a_len;
                self.widgets["prefix_a"].setValue(prefix_a.trim());
                count++;
                var generadora = v.substr(count, self.generadora_len);
                count = count + self.generadora_len;
                generadora = generadora.trim();
                if (generadora != null) {
                    if (generadora != "") {
                        if (!isNaN(generadora)) {
                            self.widgets["generadora"].setValue(parseInt(generadora));
                        }
                    }
                }
                var generadora_a = v.substr(61, 2);
                count = count + self.generadora_a_len;
                self.widgets["generadora_a"].setValue(generadora_a.trim());
                var placa = v.substr(62, 5);
                var placas = placa.split(" ");
                count = count + self.placa_len;
                placa = placa.trim();
                if (parseInt(placas.length) == 1) {
                    placas[1] = placas[0];
                }
                if (placas[1].trim() == "") {
                    placas[1] = 0;
                }
                if (placas[1] != null) {
                    if (placas[1] != "") {
                        if (!isNaN(placas[1])) {
                            self.widgets["placa"].setValue(parseInt(placas[1].trim()));
                        }
                    }
                }

                var cuadrante = v.substr(count, self.cuadrante_len);
                count = count + self.cuadrante_len;
                self.widgets["cuadrante"].setValue(cuadrante.trim());
                var complemento = v.substr(count, self.complemento_len);
                count = count + self.complemento_len;
                self.widgets["complemento"].setValue(complemento.trim());
                var adicional = v.substr(count, self.adicional_len);

                self.widgets["adicional"].setValue(adicional.trim());
                count = count + self.complemento_len;
                var complemento1 = v.substr(count, self.complemento_len);

                count = count + self.complemento_len;
                self.widgets["complemento1"].setValue(complemento1.trim());
                var adicional1 = v.substr(count, self.adicional_len);

                self.widgets["adicional1"].setValue(adicional1.trim());

                count = count + self.complemento_len;
                //count = count + self.adicional_len;

                var complemento2 = v.substr(count, self.complemento_len);
                count = count + self.complemento_len;
                self.widgets["complemento2"].setValue(complemento2.trim());
                var adicional2 = v.substr(count, self.adicional_len);
                self.widgets["adicional2"].setValue(adicional2.trim());

            } catch (e) {
                console.log(e);
            }

            this.translateAddress();
//            this.lblTranslate.setValue(v);
        },
        getValue: function getValue() {
            var self = this;
            var v = "";
            v += self.widgets["type"].getValue().text;

            var type_l = self.widgets["type"].getValue().text.length;
            if (type_l < this.type_len) {
                for (var i = this.type_len; i > type_l; i--) {
                    v += "\xa0";
                }
            }
            v += " ";
            v += new qx.type.BaseString(self.widgets["via"].getValue());
            var viatxt = self.widgets["via"].getValue() == null ? "" : self.widgets["via"].getValue();
            type_l = viatxt.toString().length;
            if (type_l < this.via_len) {
                for (var i = this.via_len; i > type_l; i--) {
                    v += "\xa0";
                }
            }
            if (self.widgets["prefix"].getValue().text != null) {
                v += " ";
                v += self.widgets["prefix"].getValue().text;
                type_l = self.widgets["prefix"].getValue().toString().length;
                if (type_l < this.prefix_len) {
                    for (var i = this.prefix_len; i > type_l; i--) {
                        v += "\xa0";
                    }
                }
            }
            v += " ";
            v += self.widgets["prefix_a"].getValue().text;
            type_l = self.widgets["prefix_a"].getValue().text.toString().length;
            if (type_l < this.prefix_a_len) {
                for (var i = this.prefix_a_len; i > type_l; i--) {
                    v += "\xa0";
                }
            }
            if (self.widgets["generadora"].getValue() != null) {
                v += " ";
                v += self.widgets["generadora"].getValue() == 0 ? " " : self.widgets["generadora"].getValue();
                type_l = self.widgets["generadora"].getValue().toString().length;
                if (type_l < this.generadora_len) {
                    for (var i = this.generadora_len; i > type_l; i--) {
                        v += "\xa0";
                    }
                }
            }
            if (self.widgets["generadora_a"].getValue().text != null) {
                v += " ";
                v += self.widgets["generadora_a"].getValue().text;
                type_l = self.widgets["generadora_a"].getValue().toString().length;
                if (type_l < this.generadora_a_len) {
                    for (var i = this.generadora_a_len; i > type_l; i--) {
                        v += "\xa0";
                    }
                }
            }
            if (self.widgets["placa"].getValue() != null) {
                v += " ";
                v += self.widgets["placa"].getValue() == 0 ? " " : self.widgets["placa"].getValue();
                type_l = self.widgets["placa"].getValue().toString().length;
                if (type_l < this.placa_len) {
                    for (var i = this.placa_len; i > type_l; i--) {
                        v += "\xa0";
                    }
                }
            }
            v += " ";
            v += self.widgets["cuadrante"].getValue().text;
            type_l = self.widgets["cuadrante"].getValue().text.toString().length;
            if (type_l < this.cuadrante_len) {
                for (var i = this.cuadrante_len; i > type_l; i--) {
                    v += "\xa0";
                }
            }
            v += " ";
            v += self.widgets["complemento"].getValue().text;
            type_l = self.widgets["complemento"].getValue().text.toString().length;
            if (type_l < this.complemento_len) {
                for (var i = this.complemento_len; i > type_l; i--) {
                    v += "\xa0";
                }
            }
            if (self.widgets["adicional"].getValue() != "" && self.widgets["adicional"].getValue() != null) {
                v += " ";
                v += new qx.type.BaseString(self.widgets["adicional"].getValue());
                type_l = self.widgets["adicional"].getValue().toString().length;
                if (type_l < this.adicional_len) {
                    for (var i = this.adicional_len; i > type_l; i--) {
                        v += "\xa0";
                    }
                }
            }
            v += " ";
            v += self.widgets["complemento1"].getValue().text;
            type_l = self.widgets["complemento1"].getValue().text.toString().length;
            if (type_l < this.complemento_len) {
                for (var i = this.complemento_len; i > type_l; i--) {
                    v += "\xa0";
                }
            }
            if (self.widgets["adicional1"].getValue() != "" && self.widgets["adicional1"].getValue() != null) {
                v += " ";
                v += new qx.type.BaseString(self.widgets["adicional1"].getValue());
                type_l = self.widgets["adicional1"].getValue().toString().length;
                if (type_l < this.adicional_len) {
                    for (var i = this.adicional_len; i > type_l; i--) {
                        v += "\xa0";
                    }
                }
            }
            v += " ";
            v += self.widgets["complemento2"].getValue().text;
            type_l = self.widgets["complemento2"].getValue().text.toString().length;
            if (type_l < this.complemento_len) {
                for (var i = this.complemento_len; i > type_l; i--) {
                    v += "\xa0";
                }
            }
            if (self.widgets["adicional2"].getValue() != "" && self.widgets["adicional2"].getValue() != null) {
                v += " ";
                v += new qx.type.BaseString(self.widgets["adicional2"].getValue());
                type_l = self.widgets["adicional2"].getValue().toString().length;
                if (type_l < this.adicional_len) {
                    for (var i = this.adicional_len; i > type_l; i--) {
                        v += "\xa0";
                    }
                }
            }
            return v;
        },
        _onListPointerDown: function () {
            return false;
        },
        _onListChangeSelection: function (e) {
            return null;
        },
        focus: function focus() {
            this.widgets["type"].setFocus();
        },
        setAllTabIndex: function setAllTabIndex(index) {
            this.widgets["type"].setTabIndex(index);
            this.widgets["via"].setTabIndex(qxnw.config.getActualTabIndex());
            this.widgets["prefix"].setTabIndex(qxnw.config.getActualTabIndex());
            this.widgets["prefix_a"].setTabIndex(qxnw.config.getActualTabIndex());
            this.widgets["generadora"].setTabIndex(qxnw.config.getActualTabIndex());
            this.widgets["generadora_a"].setTabIndex(qxnw.config.getActualTabIndex());
            this.widgets["placa"].setTabIndex(qxnw.config.getActualTabIndex());
            this.widgets["cuadrante"].setTabIndex(qxnw.config.getActualTabIndex());
            this.widgets["complemento"].setTabIndex(qxnw.config.getActualTabIndex());
            this.widgets["adicional"].setTabIndex(qxnw.config.getActualTabIndex());
            this.widgets["complemento1"].setTabIndex(qxnw.config.getActualTabIndex());
            this.widgets["adicional1"].setTabIndex(qxnw.config.getActualTabIndex());
            this.widgets["complemento2"].setTabIndex(qxnw.config.getActualTabIndex());
            this.widgets["adicional2"].setTabIndex(qxnw.config.getActualTabIndex());
        }
    }
});