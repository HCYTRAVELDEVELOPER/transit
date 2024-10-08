nw.Class.define("f_agregar_imagenes", {
    extend: nw.lists,
    construct: function (callback, opts) {
        var self = this;
        if (typeof opts == "undefined" || !nw.utils.evalueData(opts)) {
            opts = {};
        }
        self.opts = opts;

        if (nw.utils.evalueData(opts.usaRotulos) && opts.usaRotulos == "NO") {
            main.configCliente.usa_rotulos_en_paradas = "NO";
        }

        var up = nw.userPolicies.getUserData();
        var html = "";
        var options = {};
        options.setTitle = "Confirmar registro fotográfico";
        options.id = "taskConfirmaTime";
        options.html = "<div class='titleconfirmatime'>Confirmar registro fotográfico</div>";
        options.changeHash = true;
        options.showBack = true;
        options.closeBack = false;
        options.destroyAutomaticOnAccept = false;
        if (nw.isMobile()) {
            options.role = "page";
            options.transition = "slide";
        }
        options.fields = [];
        options.fields.push(
                {
                    label: "",
                    name: "fotoycomment",
                    type: "startGroup"
                },
                {
                    name: "registro_fotografico",
                    label: "SUBIR FOTO",
                    type: "button",
                    mode: "camera_files",
                    required: false
                },
                {
                    name: "comentarios",
                    label: "",
                    placeholder: "Comentarios",
                    type: "textArea",
                    required: false
                },
                {
                    type: "endGroup"
                },
                {
                    name: "novedad",
                    label: "",
                    type: "selectBox"
                }
        );
        options.fields.push(
                {
                    label: "",
                    name: "otros_documentos",
                    type: "startGroup"
                },
                {
                    type: "endGroup"
                }
        );
        if (nw.utils.evalueData(main.configCliente.usa_rotulos_en_paradas)) {
            if (main.configCliente.usa_rotulos_en_paradas == "SI") {
                options.fields.push(
                        {
                            label: "",
                            name: "otros_rotulos",
                            type: "startGroup"
                        },
                        {
                            type: "endGroup"
                        }
                );
            }
        }

        var accept = function () {
            return save("normal");
        };
        var cancel = function () {
            nw.remove(".pruebauno_container_fotos");
            return true;
        };

        var d = nw.dialog("<div id='pruebauno' class='pruebauno'></div>", accept, cancel, {
            addClass: "pruebauno_container_fotos",
            original: true,
            destroyAutomaticOnAccept: false,
            iconAccept: "<i class='material-icons' style='top: 5px;position: relative;'>check_circle</i>",
            iconCancel: "<i class='material-icons' style='top: 5px;position: relative;'>cancel</i>"
        });
        options.showButtons = false;
        options.createInHome = true;
        options.canvas = "#pruebauno";
        options.id = "pruebauno_list";
        options.id_form = "pruebauno_list_int";
        self.d = nw.dialog2(html, false, false, options);

//        console.log("d", d);
//        console.log("self.d", self.d);
//        console.log("self.d.canvas", self.d.canvas);
//        console.log("main.configCliente.omitir_fotos_driver_en_servicio", main.configCliente.omitir_fotos_driver_en_servicio);
//        console.log("main.configCliente.omitir_fotos_driver_en_servicio.toUpperCase()", main.configCliente.omitir_fotos_driver_en_servicio.toUpperCase());



//        if (main.configCliente.omitir_fotos_driver_en_servicio.toUpperCase() == "SI" && self.opts.permitirOmitir != false) {
        if (main.configCliente.omitir_fotos_driver_en_servicio.toUpperCase() == "SI") {
            var btd = {};
            btd.colorBtnBackIOS = "#7f7f7f";
            btd.style = "box-shadow: none;border: 0;background-color: transparent;color:#7f7f7f;";
            btd.text = nw.tr("Continuar sin fotos");
                    btd.className = "btnpil_other ";
            btd.type = "button";
            btd.icon = "<i class='material-icons' style='top: 5px;position: relative;'>hourglass_empty</i>";
            btd.position = "center";
            btd.callback = function () {
                return save("sin_fotos");
            };
            var div = nw.createButton(btd);
            $(d.querySelector(".popup_pil_btns")).prepend(div);
        }

        function save(mode) {
            if (!self.d.validate()) {
                return false;
            }
            var data = self.d.getRecord();
            var files = {};
            if (nw.utils.evalueData(main.configCliente.usa_rotulos_en_paradas)) {
                if (main.configCliente.usa_rotulos_en_paradas == "SI") {
                    files.rotulos = self.d.navTableRotulos.getAllData();
                }
            }
            files.files = self.d.navTable.getAllData();
            files.comentarios = data.comentarios;
            files.novedad = data.novedad;
            files.novedad_text = data.novedad_text;
            files.all_get_record = data;
            console.log("files", files);
            if (mode == "normal") {
                if (files.files.length == 0) {
                    nw.dialog("Seleccione por lo menos una imagen");
                    return false;
                }
            }
            d.remove();
            if (nw.evalueData(callback)) {
                return callback(files);
            }
            return true;
        }

        if (nw.utils.evalueData(main.configCliente.usa_rotulos_en_paradas)) {
            if (main.configCliente.usa_rotulos_en_paradas == "SI") {
                var canvas = self.d.canvas + " .otros_rotulos";
                var nav = new l_navtable_paradas_rotulos();
                nav.construct(canvas, self.opts.data);
                self.d.navTableRotulos = nav;
            }
        }

        var canvas = self.d.canvas + " .otros_documentos";
        var nav = new l_navtable_agregar_imagenes();
        nav.construct(canvas);
        self.d.navTable = nav;

        self.d.ui.registro_fotografico.addListener("change", function (e) {
            var data = self.d.ui.registro_fotografico.getValue();
            console.log("self.d.ui.registro_fotografico:::data", data);
            if (nw.evalueData(data)) {
                var ds = {};
                ds.imagen = data;
                ds.imagen_show = config.domain_rpc + data;
                self.d.navTable.addRow(ds);
            }
        });

        console.log("opts", opts);
        self.d.ui.novedad.setVisibility(false);
        if (opts.mostrarNovedades == true) {
            self.d.ui.novedad.setVisibility(true);
            self.d.ui.novedad.setRequired(true);

            var data = {};
            data[""] = "Seleccione la novedad";
            self.d.ui.novedad.populateSelectFromArray(data);

            var data = {};
            data.terminal = up.terminal;
            data.empresa = up.empresa;
            data.usuario = up.usuario;
            console.log("data", data);
            console.log("up", up);
            self.d.ui.novedad.populateSelect('conductores', 'consultaTipologiaNovedadParada', data, function (a) {

                self.d.ui.novedad.setValue("");
            }, true);
        }

        return self;
    },
    destruct: function () {
    },
    members: {
        test: function test() {
            var self = this;
        }
    }
});