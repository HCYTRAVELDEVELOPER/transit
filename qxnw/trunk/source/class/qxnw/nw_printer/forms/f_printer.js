qx.Class.define("qxnw.nw_printer.forms.f_printer", {
    extend: qxnw.forms,
    construct: function () {
        var self = this;
        this.base(arguments);
        self.setColumnsFormNumber(0);
        self.setTitle(self.tr("Configuraciones de impresión"));
        self.createGeneralForm();
        self.createEnc();
        self.createQuerys();
        self.createCenter();
        self.createPie();
        self.createWaterMark();
        self.createView();
        self.createHiddenCode();
        self.createDeffectButtons();
        self.ui.cancel.addListener("execute", function (e) {
            self.close();
        });
        self.ui.accept.addListener("execute", function () {
            self.save();
        });
    },
    members: {
        f_water_mark: null,
        f_pie: null,
        f_enc: null,
        f_general: null,
        f_querys: null,
        navQuerys: null,
        fView: null,
        __url: null,
        printer: null,
        fHiddenCode: null,
        contextMenu: function contextMenu(pos) {
            var self = this;
            var m = new qxnw.contextmenu(self.navQuerys);
            m.addAction("Editar", "icon/16/actions/document-properties.png", function (e) {
                self.slotEditNavTable();
            });
            m.exec(pos);
        },
        populateView: function populateView(r) {
            var self = this;
            if (self.printer == null) {
                return;
            }
            if (typeof r == 'undefined') {
                r = self.printer;
            }
            var data = {};
            data["selectPrinterSettings"] = r;
            self.fView.addFrame("/nwlib" + qxnw.userPolicies.getNwlibVersion() + "/printer.php?1", false, data);
        },
        updateView: function updateView() {
            var self = this;
            self.fView.updateFrame();
        },
        createView: function createView() {
            var self = this;
            self.fView = new qxnw.forms("qxnw_printer_view");
            self.fView.createFlexPrinterToolBar();
            self.fView.ui["downloadButton"].setLabel(self.tr("Ingresar paŕametros"));
            self.fView.ui["downloadButton"].setIcon("view-sort-ascending");
            self.fView.ui["downloadButton"].addListener("tap", function () {
                var f = new qxnw.forms();
                var fields = [
                    {
                        name: "parameters",
                        type: "textArea",
                        required: true,
                        label: self.tr("Ingrese los parámetros separados por comas (i.e id:1,factura=345)")
                    }
                ];
                f.setFields(fields);
                f.ui.accept.addListener("tap", function () {
                    if (!f.validate()) {
                        return;
                    }
                    var d = f.getRecord();
                    var v = "";
                    var rta = d["parameters"].split(",");
                    if (rta.length > 0) {
                        for (var i = 0; i < rta.length; i++) {
                            var rtas = rta[i].split(":");
                            v += "&";
                            v += rtas[0];
                            v += "=";
                            v += rtas[1];
                        }
                    }
                    self.fView.updateFrame(false, v);
                    self.fView.accept();
                });
                f.ui.cancel.addListener("tap", function () {
                    f.reject();
                });
                f.setModal(true);
                f.show();
            });
            self.insertWidget(self.fView, self.tr("Vista previa"));
        },
        createHiddenCode: function createHiddenCode() {
            var self = this;
            self.fHiddenCode = new qxnw.forms("qxnw_hidden_code");
            var fields = [
                {
                    name: "oculto",
                    type: "textArea",
                    label: self.tr("Código oculto")
                }
            ];
            self.fHiddenCode.setFields(fields);
            self.fHiddenCode.hideAutomaticButtons();
            self.insertWidget(self.fHiddenCode, self.tr("Código oculto"));
        },
        slotEditNavTable: function slotEditNavTable() {
            var self = this;
            var f = new qxnw.forms();
            var sl = self.navQuerys.selectedRecord();
            self.navQuerys.startToolTip();
            var fields = [
                {
                    name: "nombre",
                    type: "textField",
                    label: "Nombre"
                },
                {
                    name: "sql",
                    type: "textArea",
                    label: "SQL"
                }
            ];
            f.setFields(fields);
            f.ui.sql.setFilter(/[^\\]/g);
            f.setRecord(sl);
            f.addAutomatedFunctions();
            f.settings.accept = function () {
                var r = f.getRecord();
                self.navQuerys.removeSelectedRow();
                self.navQuerys.addRows([r]);
            };
            f.show();
        },
        createQuerys: function createQuerys() {
            var self = this;
            self.f_querys = new qxnw.forms("qxnw_printer_query");
            self.f_querys.hideAutomaticButtons();
            self.navQuerys = new qxnw.navtable(self);
            var columns = [
                {
                    label: "Nombre",
                    caption: "nombre"
                },
                {
                    label: "SQL",
                    caption: "sql"
                }
            ];
            self.navQuerys.setColumns(columns);
            self.navQuerys.ui.addButton.addListener("execute", function () {
                var f = new qxnw.forms("qxnw_printer_sql_form");
                f.setModal(true);
                var fields = [
                    {
                        name: "nombre",
                        type: "textField",
                        label: "Nombre"
                    },
                    {
                        name: "sql",
                        type: "textArea",
                        label: "SQL"
                    }
                ];
                f.setFields(fields);
                f.ui.sql.setFilter(/[^\\]/g);
                f.show();
                f.settings.accept = function () {
                    var d = f.getRecord();
                    self.navQuerys.addRows([d]);
                };
                f.ui.accept.addListener("execute", function () {
                    f.accept();
                });
                f.ui.cancel.addListener("execute", function () {
                    f.reject();
                });
            });
            self.navQuerys.ui.removeButton.addListener("execute", function () {
                self.navQuerys.removeSelectedRow();
            });
            self.f_querys.insertNavTable(self.navQuerys.getBase(), self.tr("Consultas"));
            self.insertNavTable(self.f_querys, self.tr("Datos"));
        },
        createGeneralForm: function createGeneralForm() {
            var self = this;
            self.f_general = new qxnw.forms("qxnw_printer_gen");
            self.f_general.setColumnsFormNumber(2);
            var fields = [
                {
                    name: "id",
                    type: "textField",
                    label: self.tr("ID"),
                    visible: false
                },
                {
                    name: "nombre",
                    type: "textField",
                    label: self.tr("Nombre")
                },
                {
                    name: "ancho",
                    type: "textField",
                    mode: "integer",
                    label: self.tr("Ancho")
                },
                {
                    name: "alto",
                    type: "textField",
                    mode: "integer",
                    label: self.tr("Alto")
                },
                {
                    name: "ancho_tabla",
                    type: "textField",
                    mode: "integer",
                    label: self.tr("Ancho tabla")
                },
                {
                    name: "text_transform",
                    type: "selectBox",
                    label: self.tr("Texto en mayúsculas")
                },
                {
                    name: "margen_superior",
                    type: "textField",
                    mode: "integer",
                    label: self.tr("Margen superior")
                },
                {
                    name: "margen_inferior",
                    type: "textField",
                    mode: "integer",
                    label: self.tr("Margen inferior")
                },
                {
                    name: "margen_izquierda",
                    type: "textField",
                    mode: "integer",
                    label: self.tr("Margen izquierda")
                },
                {
                    name: "fuente",
                    type: "selectBox",
                    label: self.tr("Fuente")
                },
                {
                    name: "tamano_fuente",
                    type: "textField",
                    mode: "integer",
                    label: self.tr("Tamaño fuente")
                },
                {
                    name: "margen_derecha",
                    type: "textField",
                    mode: "integer",
                    label: self.tr("Margen derecha")
                },
                {
                    name: "centrar",
                    type: "checkBox",
                    label: self.tr("Centrar contenido")
                }
            ];
            self.f_general.setFields(fields);
            self.f_general.hideAutomaticButtons();
            self.insertNavTable(self.f_general, self.tr("Configuraciones generales"));
            var data = {};
            data["none"] = "Ninguno";
            data["uppercase"] = "Mayúsculas";
            data["lowercase"] = "Minúsculas";
            data["capitalize"] = "Mayúsculas";
            qxnw.utils.populateSelectFromArray(self.f_general.ui.text_transform, data);
            qxnw.utils.populateSelectFromArray(self.f_general.ui.fuente, qxnw.utils.getFontsFamily());
        },
        createEnc: function createEnc() {
            var self = this;
            self.f_enc = new qxnw.forms("qxnw_printer_enc");
            var fields_enc = [
                {
                    name: "encabezado",
                    type: "ckeditor",
                    label: self.tr("Encabezado"),
                    mode: "maxHeight"
                }
            ];
            self.f_enc.setFields(fields_enc);
            self.f_enc.hideAutomaticButtons();
            self.insertNavTable(self.f_enc, self.tr("Encabezado"));
        },
        createPie: function createPie() {
            var self = this;
            self.f_pie = new qxnw.forms("qxnw_printer_pie");
            var fields_enc = [
                {
                    name: "pie",
                    type: "ckeditor",
                    label: self.tr("Pie de página"),
                    mode: "maxHeight"
                }
            ];
            self.f_pie.setFields(fields_enc);
            self.f_pie.hideAutomaticButtons();
            self.insertNavTable(self.f_pie, self.tr("Pie de página"));
        },
        createWaterMark: function createWaterMark() {
            var self = this;
            self.f_water_mark = new qxnw.forms("qxnw_printer_water_mark");
            self.f_water_mark.setColumnsFormNumber(3);
            var fields = [
                {
                    name: "id",
                    type: "textField",
                    label: self.tr("ID"),
                    visible: false
                },
                {
                    name: "have_text",
                    type: "checkBox",
                    label: self.tr("¿Texto?")
                },
                {
                    name: "imagen",
                    type: "uploader",
                    label: self.tr("Imagen")
                },
                {
                    name: "texto",
                    type: "textField",
                    label: self.tr("Texto para la imagen"),
                    mode: "String"
                },
                {
                    name: "rotacion",
                    type: "textField",
                    mode: "integer",
                    label: self.tr("Rotación")
                },
                {
                    name: "tamano_fuente",
                    type: "textField",
                    mode: "integer",
                    label: self.tr("Tamaño fuente")
                },
                {
                    name: "fuente",
                    type: "uploader",
                    label: self.tr("Fuente"),
                    mode: "fullPath"
                },
                {
                    name: "espacio",
                    type: "textField",
                    mode: "integer",
                    label: self.tr("Espaciado")
                },
                {
                    name: "transparente",
                    type: "checkBox",
                    label: self.tr("¿Fondo transparente?")
                }
            ];
            self.f_water_mark.setFields(fields);
            self.f_water_mark.hideAutomaticButtons();
            self.f_water_mark.ui.texto.setEnabled(false);
//            self.f_water_mark.ui.rotacion.set({
//                maximum: 90,
//                minimum: 0,
//                singleStep: 30
//            });
//            self.f_water_mark.ui.tamano_fuente.set({
//                maximum: 120,
//                minimum: 8,
//                singleStep: 12
//            });
//            self.f_water_mark.ui.espacio.set({
//                maximum: 100,
//                minimum: 0,
//                singleStep: 5
//            });
            self.f_water_mark.ui.have_text.addListener("changeValue", function () {
                self.f_water_mark.ui.texto.setEnabled(this.getValue());
                if (!this.getValue()) {
                    self.f_water_mark.ui.texto.setValue("");
                }
            });
            self.ui["font_colors"] = qxnw.utils.createColorSelector();
            self.f_water_mark.insertNavTable(self.ui.font_colors, "Colores para el texto");
            self.ui["back_colors"] = qxnw.utils.createColorSelector();
            self.f_water_mark.insertNavTable(self.ui.back_colors, "Colores para el fondo");
            self.insertNavTable(self.f_water_mark, self.tr("Marca de agua"));
        },
        createCenter: function createCenter() {
            var self = this;
            self.f_center = new qxnw.forms("qxnw_printer_center");
            var fields_enc = [
                {
                    name: "centro",
                    type: "ckeditor",
                    label: self.tr("Centro de página"),
                    mode: "maxHeight"
                }
            ];
            self.f_center.setFields(fields_enc);
            self.f_center.hideAutomaticButtons();
            self.insertNavTable(self.f_center, self.tr("Centro"));
        },
        save: function save() {
            var self = this;
            var data = self.f_general.getRecord();
            data["encabezado"] = self.f_enc.getRecord()["encabezado"];
            data["pie"] = self.f_pie.getRecord()["pie"];
            data["centro"] = self.f_center.getRecord()["centro"];
            data["datos"] = self.navQuerys.getAllData();
            data["oculto"] = self.fHiddenCode.getRecord()["oculto"];
            data["marca_agua"] = self.f_water_mark.getRecord();
            data["marca_agua"]["rojo_fuente"] = self.ui.font_colors.getColors()["red"];
            data["marca_agua"]["azul_fuente"] = self.ui.font_colors.getColors()["blue"];
            data["marca_agua"]["verde_fuente"] = self.ui.font_colors.getColors()["green"];

            data["marca_agua"]["rojo_fondo"] = self.ui.back_colors.getColors()["red"];
            data["marca_agua"]["azul_fondo"] = self.ui.back_colors.getColors()["blue"];
            data["marca_agua"]["verde_fondo"] = self.ui.back_colors.getColors()["green"];
            var rpc = new qxnw.rpc(self.getRpcUrl(), "nw_printer");
            rpc.setAsync(true);
            var func = function (r) {
                self.updateView();
                qxnw.utils.createNotifyPopUp(self, self.tr("Datos guardados..."));
            };
            rpc.exec("save", data, func);
        },
        setParamRecord: function setParamRecord(pr) {
            this.printer = pr.id;
            this.f_general.setRecord(pr);
            this.populateWaterMark(pr);
            this.populateBody(pr);
            this.populateData(pr);
            this.populateView(pr.id);
            return true;
        },
        populateData: function populateData(pr) {
            var self = this;
            var rpc = new qxnw.rpc(self.getRpcUrl(), "nw_printer");
            rpc.setAsync(true);
            var func = function (r) {
                for (var i = 0; i < r.length; i++) {
                    if (typeof r[i].sql_data != 'undefined') {
                        r[i].sql = r[i].sql_data;
                    }
                }
                self.navQuerys.setModelData(r);
            };
            rpc.exec("getSQLData", pr.id, func);
        },
        populateBody: function populateBody(pr) {
            var self = this;
            var rpc = new qxnw.rpc(self.getRpcUrl(), "nw_printer");
            rpc.setAsync(true);
            var func = function (r) {
                if (typeof r.centro != 'undefined') {
                    if (r.centro != null) {
                        if (r.centro != "") {
                            self.f_center.ui.centro.setValue(r.centro);
                        }
                    }
                }
                if (typeof r.encabezado != 'undefined') {
                    if (r.encabezado != null) {
                        if (r.encabezado != "") {
                            self.f_enc.ui.encabezado.setValue(r.encabezado);
                        }
                    }
                }
                if (typeof r.pie != 'undefined') {
                    if (r.pie != null) {
                        if (r.pie != "") {
                            self.f_pie.ui.pie.setValue(r.pie);
                        }
                    }
                }
                if (typeof r.oculto != 'undefined') {
                    if (r.oculto != null) {
                        if (r.oculto != "") {
                            self.fHiddenCode.ui.oculto.setValue(r.oculto);
                        }
                    }
                }
            };
            rpc.exec("getBody", pr.id, func);
        },
        populateWaterMark: function populateWaterMark(pr) {
            var self = this;
            var rpc = new qxnw.rpc(self.getRpcUrl(), "master");
            rpc.setAsync(true);
            var func = function (r) {
                if (r.length > 0) {
                    self.f_water_mark.setRecord(r[0]);

                    self.ui.font_colors.addListener("appear", function () {
                        self.ui.font_colors.setGreen(parseInt(r[0]["verde_fuente"]));
                        self.ui.font_colors.setRed(parseInt(r[0]["rojo_fuente"]));
                        self.ui.font_colors.setBlue(parseInt(r[0]["azul_fuente"]));
                    });

                    self.ui.back_colors.addListener("appear", function () {
                        self.ui.back_colors.setGreen(parseInt(r[0]["verde_fondo"]));
                        self.ui.back_colors.setRed(parseInt(r[0]["rojo_fondo"]));
                        self.ui.back_colors.setBlue(parseInt(r[0]["azul_fondo"]));
                    });
                }
            };
            var data = {};
            data["table"] = "nw_printer_water_mark";
            data["field"] = "printer";
            data["value"] = pr["id"];
            rpc.exec("getDataFromTable", data, func);
        }
    }
});