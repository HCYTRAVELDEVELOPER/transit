nw.Class.define("f_preoperacional_dynamic", {
    extend: nw.forms,
    construct: function (parent, pr, callback, createInHome) {
        var self = this;
//        createInHome = false;
        if (createInHome) {
            self.canvas = "#foo";
            self.id_form = "f_preoperacional_dynamic";
        } else {
            self.id = "f_preoperacional";
            self.setTitle = "<span style='color:#fff;'>Pre-operacional</span>";
            self.html = "<div class='vehiculo'>Pre-operacional</div>";
            self.showBack = true;
            self.closeBack = false;
            self.colorBtnBackIOS = "#ffffff;";
            self.styleCloseIOS = "color:#ffffff;color: rgb(255, 255, 255);background-color: transparent;border: 0;box-shadow:none;";
            self.createBase();
        }

        self.parent = parent;
        self.callback = callback;
        self.configCliente = main.configCliente;
        self.datos_vehiculo = false;
        if (typeof main.vehiculo !== 'undefined') {
            self.datos_vehiculo = main.vehiculo;
        }

        self.datos = pr;

        self.firma_fonductor_inspeccion = false;
        if (nw.evalueData(pr)) {
            if (nw.evalueData(pr.firma_fonductor_inspeccion)) {
                self.firma_fonductor_inspeccion = pr.firma_fonductor_inspeccion;
            }
        }

        var htmlsino = "<option value='NO'>NO</option><option value='SI'>SI</option>";
//        var type = "selectBox";
        var type = "switch";

        self.traerPreguntas(function (data) {

            var fields = [];

            if (!nw.evalueData(data)) {
                nw.dialog("Debe configurar las preguntas del preoperacional. Consulte con el administrador del sistema.")
                return false;
            }

            fields.push(
                    {
                        name: "marca",
                        label: "Marca",
                        type: 'textField',
                        enabled: false
                    },
                    {
                        name: "modelo",
                        label: "Modelo",
                        type: 'textField',
                        enabled: false
                    },
                    {
                        name: "tipo",
                        label: "Tipo",
                        type: 'textField',
                        enabled: false
                    },
                    {
                        name: "placa",
                        label: "Placa",
                        type: 'textField',
                        enabled: false
                    },
                    {
                        name: "id",
                        label: "ID",
                        placeholder: 'id',
                        type: "textField",
                        required: false,
                        visible: false
                    }
            );

            self.preguntas = data;

            for (var i = 0; i < data.length; i++) {
                var r = data[i];
                if (r.required == "SI") {
                    r.required = true;
                }
                if (r.required == "NO") {
                    r.required = false;
                }
                if (r.visible == "SI") {
                    r.visible = true;
                }
                if (r.visible == "NO") {
                    r.visible = false;
                }
                fields.push(
                        {
                            name: r.name,
                            label: r.label,
                            palceholder: r.label,
                            type: r.type,
                            mode: r.mode,
                            options: htmlsino,
                            required: r.required,
                            visible: r.visible
                        }
                );
            }

            fields.push(
                    {
                        styleContainer: "margin:0;",
                        label: "Documentos adicionales",
                        name: "otros_documentos",
                        type: "startGroup"
                    },
                    {
                        style: "background: #ec7c7c; color: #fff;",
                        name: "nuevo_documento",
                        label: "Agregar documento en el preoperacional",
                        type: "button"
                    },
                    {
                        type: "endGroup"
                    }
            );
            self.setFields(fields);
            self.buttons = [
                {
                    style: "border: 0;background-color:#1abbd7;color:#fff;margin:0px;",
                    icon: "material-icons check_circle normal",
                    colorBtnBackIOS: "#fff",
                    position: "bottom",
                    name: "aceptar btn_generic",
                    label: "Guardar",
                    callback: function () {
                        self.save();
                    }
                }
            ];
            self.show();

            if (createInHome) {
                nw.utils.addClass(document.querySelector(self.canvas), "foo_preope");
            }

            if (self.datos_vehiculo) {
                self.ui.marca.setValue(self.datos_vehiculo.marca_text);
                self.ui.modelo.setValue(self.datos_vehiculo.modelo);
                self.ui.tipo.setValue(self.datos_vehiculo.tipo_vehiculo_text);
                self.ui.placa.setValue(self.datos_vehiculo.placa);
            }

            console.log("data", data);
            console.log("data.length", data.length);
            for (var i = 0; i < data.length; i++) {
                var r = data[i];
                console.log("r", r);
                console.log("r.type", r.type);
                if (r.type == "selectBox" || r.type == "radio") {
                    var ds = {};
                    ds[""] = "Seleccione";
                    if (nw.evalueData(r.op1)) {
                        ds[r.op1] = r.op1;
                    }
                    if (nw.evalueData(r.op2)) {
                        ds[r.op2] = r.op2;
                    }
                    if (nw.evalueData(r.op3)) {
                        ds[r.op3] = r.op3;
                    }
                    self.ui[r.name].populateSelectFromArray(ds);
                    self.ui[r.name].setValue("");
                }
            }
            self.createNavTableOtrosDocumentos();
            self.ui.nuevo_documento.addListener("click", function () {
                var d = new f_preoperacional_documento();
                d.construct(self);
            });
        });
    },
    destruct: function () {
    },
    members: {
        traerPreguntas: function traerPreguntas(callback) {
            var up = nw.userPolicies.getUserData();
            var data = {};
            data.empresa = up.empresa;
            var rpc = new nw.rpc(nw.getRpcUrl(), "preoperacional");
            rpc.setAsync(true);
            var func = function (r) {
                console.log("f_preoperacional:::responseServer", r);
                callback(r);
            };
            rpc.exec("getPreopeAdminPreguntas", data, func);
        },
        createNavTableOtrosDocumentos: function createNavTableOtrosDocumentos() {
            var self = this;
            var datos = self.datos;

            var canvas = self.canvas + " .otros_documentos";
            var nav = new l_navtable_preoperacional_otros_documentos();
            nav.construct(canvas, datos);
            self.navTable = nav;
        },
        save: function save() {
            var self = this;
            if (!self.validate()) {
                return false;
            }
//            nw.loading({text: "Guardando, por favor espere...", "container": self.canvas, css: "position: fixed;margin-left: -6.875em;margin-top: -2.6875em;top: 50%;left: 50%;"});
//            nw.loading({text: "Guardando, por favor espere...", css: "position: fixed;margin-left: -6.875em;margin-top: -2.6875em;top: 50%;left: 50%;"});
            var up = nw.userPolicies.getUserData();

            var dataform = self.getRecord(true);

//            var data = {};
            var data = dataform;
            data.usuario = up.usuario;
            data.empresa = up.empresa;
            data.usuario_text = up.nombre;
            data.id_usuario = up.id_usuario;
            data.otros_documentos = self.navTable.getAllData();


            data.preguntas_dinamicas = {};
            for (var i = 0; i < self.preguntas.length; i++) {
                var r = self.preguntas[i];
                data.preguntas_dinamicas[r.name] = dataform[r.name];
            }
            if (self.datos_vehiculo) {
                data.id_vehiculo = self.datos_vehiculo.id;
            } else {
                nw.dialog("sin datos del Vehículo");
                return;
            }
            if (typeof up.bodega === 'string') {
                if (up.bodega != "" && up.bodega != 'null') {
                    data.bodega = up.bodega;
                }
            }
            console.log("f_preoperacional:::sendData", data);
            var rpc = new nw.rpc(nw.getRpcUrl(), "preoperacional");
            rpc.setAsync(true);
            rpc.setLoading(true);
            var func = function (r) {
                console.log("f_preoperacional:::responseServer", r);
                nw.dialog("¡Guardado correctamente!", function () {
//                    nw.back();
                    if (nw.evalueData(self.callback)) {
                        self.callback(r);
                        return true;
                    }
                    if (nw.evalueData(self.parent)) {
                        self.parent.applyFilters();
                    }
                }, false, {original: true});

                if (nw.evalueData(self.callback)) {
                    setTimeout(function () {
                        nw.changePage("");
                        window.location.reload();
                    }, 2000);
                }
            };
            rpc.exec("savePreopeAdmin", data, func);
        },
        populate: function populate(pr) {
            var self = this;
            self.setRecord(pr);
        }
    }
});