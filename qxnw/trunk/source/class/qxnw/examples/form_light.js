qx.Class.define("qxnw.examples.form_light", {
    extend: qxnw.forms,
    ///TEST
    construct: function construct() {
        this.base(arguments);
        var self = this;
//        self.startCronometer();

        self.setCanPrint(true);
        self.setColumnsFormNumber(0);
        var fields = [
            {
                name: "",
                type: "startGroup",
                icon: qxnw.config.execIcon(""),
                mode: "vertical"
            },
            {
                name: "separador_uno",
                label: self.tr(""),
                type: "label"
            },
            {
                name: "ocrReader",
                label: "OCR Reader",
                type: "ocrReader"
            },
            {
                name: "selectToken",
                label: "text Area",
                type: "textArea",
                mode: "string.maxCharacteres:2.speech"
            },
            {
                name: "flete_real",
                label: self.tr("Flete Manifiesto Inicial"),
                type: "textField",
                mode: "money"
            },
            {
                name: "signer",
                label: "Firma",
                type: "signer",
                required: true
            },
            {
                name: "selectTokenField",
                label: "Select T F",
                type: "selectTokenField",
                method: "ciudades"
            },
            {
                name: "address",
                label: "Address",
                type: "address"
            },
            {
                name: "cod_examen",
                label: self.tr("textareaas"),
                type: "textField",
                enabled: true
//                mode: "maxCharacteres:10"
            },
            {
                name: "colorButton",
                label: "colorButton",
                type: "colorButton"
            },
//            {
//                name: "cam",
//                label: "CAM",
//                type: "camera",
//                mode: "simple"
//            },
            {
                name: "canvasWriter",
                label: "Firma alterna",
                type: "canvasWriter",
                required: true
            },
//            {
//                name: "neg",
//                label: "Negativo",
//                type: "image"
//            },
            {
                name: "estado",
                label: "select list check",
                type: "selectListCheck"
            },
            {
                name: "uploader_simple",
                type: "uploader",
                label: "Uploader simple",
                mode: "size:160x210"
            },
            {
                name: "selectBox",
                label: "Select",
                type: "selectBox"
            },
            {
                name: "uploader_multiple",
                label: "Uploader multiple",
                type: "uploader_multiple"
//                mode: "destination=tmp"
            },
//            {
//                name: "upload",
//                label: "Upload",
//                type: "uploader",
//                mode: "rename"
//            },
            {
                name: "dateField",
                label: "Date Field",
                type: "dateField"
            },
//            {
//                name: "cam",
//                label: "CAMERA",
//                type: "camera"
//            },
//            {
//                name: "ckeditor",
//                label: "CKEditor",
//                type: "ckeditor"
//            },
//            {
//                name: "pass",
//                label: "Password",
//                type: "passwordField"
//            },
            {
                name: "timeField",
                label: "TIME FIELD",
                type: "timeField"
            },
            {
                name: "text",
                label: "TEXT que pasa amigo ok ok ok",
                type: "textField",
                containerMode: "horizontal"
            },
            {
                name: "dateTimeField",
                label: "TIME FIELD",
                type: "dateTimeField"
            },
//            {
//                name: "peso_bascula",
//                label: "Peso báscula",
//                type: "textArea"
//            },
//            {
//                name: "textField",
//                label: "Text Field",
//                type: "textField",
////                mode: "integer.maxCharacteres:2"
//                mode: "money"
//            },
//            {
//                name: "ubicacion_grafico",
//                label: self.tr("Ubicación del grafico"),
//                type: "uploader",
//                required: true
//            },
            {
                name: "observaciones",
                label: self.tr("Observaciones"),
                type: "textArea",
                mode: "upperCase"
            },
//            {
//                name: "observaciones",
//                label: self.tr("Observaciones"),
//                type: "textArea",
//                mode: "upperCase"
//            },
//            {
//                name: "Test",
//                label: "Start",
//                type: "startGroup",
//                mode: "vertical"
//            },
            {
                name: "label",
                label: self.tr("LABEL"),
                type: "label"
            },
//            {
//                name: "selectTokenField",
//                label: self.tr("<b>Usuario</b>"),
//                type: "selectTokenField"
//            },
//            {
//                name: "",
//                type: "endGroup"
//            },
//            {
//                name: "slc",
//                type: "selectListCheck",
//                label: "text",
//                toolTip: "prueba de tooltip!"
//            },
//            {
//                name: "textArea1",
//                label: "TEXT AREA",
//                type: "textArea",
//                toolTip: "hola amigo",
//                enabled: false
//            },
//            {
//                name: "matriz_de_riesgos1",
//                type: "startGroup",
//                icon: qxnw.config.execIcon(""),
//                mode: "horizontal"
//            },
            {
                name: "numeric",
                label: "NUMERIC",
                type: "textField",
                mode: "money"
            },
//            {
//                name: "camera",
//                label: "Cámara",
//                type: "camera"
//            },
//            {
//                name: "uploader",
//                label: "Uploader",
//                type: "uploader",
//                mode: "server"
//            },
            {
                name: "",
                type: "endGroup"
            },
            {
                name: "Fotos de conductor",
                type: "startGroup",
                icon: qxnw.config.execIcon(""),
                mode: "horizontal"
            },
            {
                name: "foto_conductor",
                label: self.tr("Fots"),
                type: "textField"
            },
            {
                name: "",
                type: "endGroup"
            },
            {
                name: "boton_validaciones",
                label: "Validaciones",
                type: "button",
                mode: "icon:" + qxnw.config.execIcon("dialog-apply"),
                toolTip: self.tr("Aquí podrás configurar los comportamientos de ocultar o mostrar campos o grupos de acuerdo a los valores seleccionados")
            },
            {
                name: "checkBox",
                label: "checkBox",
                type: "checkBox"
            },
            {
                name: "uploader",
                label: "Uploader",
                type: "uploader_multiple"
            },
            {
                name: "textfi",
                label: "Text Field Normal",
                type: "textField",
                mode: "maxCharacteres:2"
            },
//            {
//                name: "",
//                type: "endGroup"
//            },
//            {
//                name: "camera2",
//                label: "Camera",
//                type: "camera"
//            },
//            {
//                name: "matriz_de_riesgos3",
//                type: "startGroup",
//                icon: qxnw.config.execIcon(""),
//                mode: "horizontal"
//            },
            {
                name: "email",
                label: "EMAIL",
                type: "textField",
                //mode: "email",
                required: false
            },
            {
                name: "address 2",
                label: "Dirección",
                type: "address"
            },
//            {
//                name: "dynamicImage",
//                label: "Imagen dinámica",
//                type: "dynamicImage"
//            },
            {
                name: "date",
                label: "DATE",
                type: "dateTimeField"
            },
//            {
//                name: "selectBox",
//                label: "selectBox",
//                type: "selectBox"
//            },
//            {
//                name: "textArea",
//                label: "textArea",
//                type: "textArea"
//            }
//            {
//                name: "checkBox",
//                label: "checkBox",
//                type: "checkBox",
//                enabled: true
//            },
//            {
//                name: "textField",
//                label: "TEXT FIELD",
//                type: "textField"
//            }
//            {
//                name: "image",
//                label: "IMAGE",
//                type: "image"
//            },
//            {
//                name: "dateTime",
//                label: "Date Time",
//                type: "dateField"
//            },
//            {
//                name: "uploader_multiple",
//                label: "UPLOADER MÚLTIPLE",
//                type: "uploader_multiple"
//            },
////            {
////                name: "ckeditor",
////                label: "CKEDITOR",
////                type: "ckeditor"
////            },
//            {
//                name: "time",
//                label: "TIME",
//                type: "timeField"
//            },
        ];
//        

//        ,
//            {
//                name: "textField",
//                label: "TexField",
//                type: "textField",
//                mode: "string",
//                required: true
//            },
//            {
//                name: "image_selector",
//                label: "Image selector",
//                type: "imageSelector"
//            },
//            {
//                name: "textarea",
//                label: "Text Area",
//                type: "dateField"
//            },
//            {
//                name: "moneys",
//                label: "Money",
//                type: "textField",
//                mode: "money"
//            },
//            {
//                name: "plazo",
//                label: "Plazo",
//                type: "textField",
//                mode: "integer.maxCharacteres:2"
//            },
//            {
//                name: "checkbox",
//                label: "Check",
//                type: "checkBox"
//            },

        self.setFields(fields);

        self.ui.address.setValue("Autopista        78                              A ESTE  145  A 145   Norte       Agrupación              s                       Carretera               s                       Casa                    s                      ");

        self.ui.estado.populate("master", "populate", {table: "usuarios", where: "estado='activo'"});

        self.ui.accept.addListener("execute", function () {

            var data = self.getRecord();
            console.log(data);
            return;

            var up = qxnw.userPolicies.getUserData();
            console.log(up);
            self.clean();
            return;

            var v = self.ui.numeric.getValue();
            console.log(v);
            return;

            self.ui.selectBox.setRequired(true);
            return;

            self.ui.flete_real.setValue(1);
            return;

            qxnw.utils.loading("Cargando...", null, true, true);
            var closeTimeOut = new qx.event.Timer(10000);
            closeTimeOut.start();
            closeTimeOut.addListener("interval", function (e) {
                this.stop();
                qxnw.utils.stopLoading();
            });
            return;

            var data = {};
            var rpc = new qxnw.rpc(self.getRpcUrl(), "master");
            rpc.setAsync(true);
            var func = function (r) {
                console.log(r);
            };
            rpc.exec("testTransaction", data, func);
            return;

            var f = new qxnw.forms();
            f.setWidth(400);
            f.setHeight(700);
            f.setModal(true);
            f.show();
            return;

            if (self.event == null) {
                self.event = document.createEvent('Event');
                self.event.initEvent('connect_dashboard');
                document.addEventListener("response_dashboard", function (rta) {
                    var js = JSON.parse(localStorage["dashboard"]);
                    console.log(js);
                });
            }
            document.dispatchEvent(self.event);
            return;

            self.ui.address.setValue("");
            return;
        });

        return;

        self.ui.timeField.hour.addListener("changeValue", function (e) {
            console.log(e.getData());
        });
        //self.ui.timeField.setEnabled(false);
        self.ui.timeField.time.getChildControl('textfield').setEnabled(false);
        self.ui.timeField.time.setSingleStep(15);

        var man = {
            id: 125,
            nombre: 123625211
        };
//        self.ui.selectTokenField.addToken(man);

//        self.ui.selectTokenField.setValue("80821912");

        self.ui.numeric.setValue(0);

        self.ui.flete_real.setValue("140000");


//        self.ui.selectTokenField.addListener("addItem", function (e) {
//            var v = this.getValue();
//            console.log("classname", this.classname);
//            console.log(v);
//        });

        self.ui.selectTokenField.addListener("loadData", function (e) {
            console.log("loadData");
            var data = {};
            var rpc = new qxnw.rpc(self.getRpcUrl(), "master");
            rpc.setAsync(true);
            rpc.setBlock(false);
            var func = function (r) {
                console.log({setModelData: r});
                self.ui.selectTokenField.setModelData(r);
            };
            var t = self.getRecord();
            console.log(t);
            rpc.exec("populate", {fields: "id,account_code_activation", table: "usuarios", "where": "usuario like '%" + t.selectTokenField_value + "%' "}, func);
        }, this);

//        self.ui.accept.addListener("execute", function () {
//
//
//            self.clean();
//
//            return;
//
//            var r = self.getRecord();
//            console.log(r);
//            return;
//
//            qxnw.utils.loading("cargando...", null, true, true);
//            var closeTimeOut = new qx.event.Timer(10000);
//            closeTimeOut.start();
//            closeTimeOut.addListener("interval", function (e) {
//                this.stop();
//                qxnw.utils.stopLoading();
//            });
//        });

        return;

//        self.setFieldVisibility(self.ui.foto_conductor, "excluded");
//
//        var grup6 = self.getGroup("fotos_de_conductor");
//        //grup6.setLayoutProperties({colSpan: 3});
//
//        var navTableFC = new qxnw.navtable(self);
//        var columns = [
//            {
//                caption: "id",
//                label: self.tr("Id"),
//                colorHeader: "#FF8000"
//            },
//            {
//                caption: "frente",
//                label: self.tr("Frente"),
//                colorHeader: "#FF8000",
//                type: "image",
//                mode: "expand"
//            },
//            {
//                caption: "izquierda",
//                label: self.tr("Izquierda"),
//                colorHeader: "#FF8000",
//                type: "image",
//                mode: "expand"
//            },
//            {
//                caption: "derecha",
//                label: self.tr("Derecha"),
//                colorHeader: "#FF8000",
//                type: "image",
//                mode: "expand"
//            },
//            {
//                caption: "posterior",
//                label: self.tr("Posterior"),
//                colorHeader: "#FF8000",
//                type: "image",
//                mode: "expand"
//            }];
//        navTableFC.setColumns(columns);
//        self.addBeforeGroup("fotos_de_conductor", self.insertNavTable(navTableFC.getBase(), self.tr("Fotos de conductor")));
//        return;

        var data = {};
        data.table = "estados_cp";
        self.ui.estado.populate("master", "populate", data);

        var sl = self.getRecord();
        console.log("sl", sl);
        var rpc = new qxnw.rpc(self.getRpcUrl(), "clientes_prospecto");
        rpc.setAsync(true);
        var func = function (ans) {
            for (var i = 0; i < ans.length; i++) {
                var r = ans[i];
                var estado = {
                    id: r.id,
                    nombre: r.nombre
                };
                self.ui.estado.addToken(estado);
            }
        };
        rpc.exec("populateEstadosDescartados", sl, func);

        self.ui.selectTokenField.setValue("TEST");

        return;

        self.ui.selectBox.addListener("changeValue", function () {
            console.log("CHANGEEEEEE");
        });
        self.ui.selectTokenField.setValue("TEST");
        self.ui.dateField.addListener("focusout", function () {
            console.log("out!");
        });
        var nav = new qxnw.navtable(self, true);
        self.nav = nav;
        var col = [
            {
                label: "ID",
                caption: "id"
            },
            {
                label: "Money",
                caption: "money",
                type: "money",
                colorHeader: "#4FA800"
            },
            {
                label: "Button",
                caption: "button",
                type: "button"
            },
            {
                label: "Ciudad",
                caption: "ciudad"
            },
            {
                label: "Pais",
                caption: "pais"
            },
            {
                label: "Imagen",
                caption: "imagen",
                type: "image",
                mode: "expand"
            },
            {
                label: "HTML",
                caption: "html",
                type: "html"
            },
            {
                label: "TextField",
                caption: "text_field",
                type: "textField",
                search: true,
                sortable: false,
                mode: "editable"
            },
            {
                label: "Date",
                caption: "date",
                type: "dateField",
                editable: true,
                required: true
            },
            {
                label: "Visible",
                caption: "visible",
                type: "checkBox",
                editable: true,
                mode: "editable"
            },
            {
                label: "selectTo",
                caption: "select_token_field",
                type: "selectTokenField",
                editable: true,
                method: "ciudades",
                search: true
            },
            {
                label: "selectBox",
                caption: "select_box",
                type: "selectBox",
                method: "ciudades",
                editable: true
            }
        ];
        nav.setColumns(col);
//        nav.addInformation("test");

        var cols = [
            {
                columns: 1,
                type: "spacer"
            },
            {
                color: "#5dc594",
                columns: 7,
                type: "container",
                label: self.tr("Físicos")
            },
            {
                color: "rgb(171, 81, 83)",
                columns: 5,
                type: "container",
                label: self.tr("Químicos")
            },
            {
                color: "rgb(184, 182, 70)",
                columns: 5,
                type: "container",
                label: self.tr("Biomecánicos")
            },
            {
                color: "rgb(217, 134, 215)",
                columns: 6,
                type: "container",
                label: self.tr("Biológicos")
            },
            {
                color: "rgb(130, 131, 211)",
                columns: 4,
                type: "container",
                label: self.tr("Psicosocial")
            },
            {
                color: "rgb(194, 145, 93)",
                columns: 7,
                type: "container",
                label: self.tr("Seguridad")
            }

        ];
//        nav.createUpColumns(cols, "white", 10);

//        nav.ui.addButton.addListener("execute", function () {
//            console.log(nav.getAllData());
//            console.log(self.getNumberOfNavtables());
//            //nav.populate("master", "testListEdit");
//        });
//        nav.ui.removeButton.addListener("execute", function () {
//            nav.removeAllRows();
//            //nav.removeSelectedRow();
//        });
//        nav.populate("master", "testListEdit");
//        self.addListener("NWClickTabView", function (e) {
//            console.log(e.getData());
//        });

//        nav.setEnabled(false);

        nav.populate("master", "testListEdit");
        self.insertNavTable(nav.getBase(), "NavTable", false, 0, 0, 0, qxnw.config.execIcon("document-revert"));
        self.ui.selectTokenField.addListener("loadData", function (e) {
            console.log("loadData");
            var data = {};
//            var r = self.getRecord();
//            data["token"] = e.getData();
//            data["contrato"] = r.contrato;
            var rpc = new qxnw.rpc(self.getRpcUrl(), "master");
            rpc.setAsync(true);
            var func = function (r) {
                console.log({setModelData: r});
                self.ui.selectTokenField.setModelData(r);
                if (r.length == 0) {
                    return false;
                } else {
                    //var t = self.ui.selectTokenField.getTable();
                    //t.setColumnWidth(1, 500);
                }
            };
//            console.log(data);
            var t = self.getRecord();
            rpc.exec("populate", {table: "usuarios", token: t.selectTokenField}, func);
        }, this);
//        self.ui.timeField.setValue("24:00");

//        self.ui.neg.setValue("https://www.gruponw.com/imagenes/logoNW04_ss.jpg");

//        self.ui.upload.setHaveAlterIconDelete(true);
//        self.ui.upload.setWidthSubImage(500);
//        self.ui.upload.setShowPdf(true, 500, 500);

//        console.log("hola");

//        self.ui.boton.setColor("#99ffbb");
//        self.ui.boton.getContentElement().setBackgroundColor("#99ffbb");

//        self.ui.text.setMaxWidth(50);
//        self.ui.text.setMinWidth(50);

        self.ui.accept.addListener("execute", function () {

            var data = {};
            data["data"] = "hola...";
            var rpc = new qxnw.rpc(self.getRpcUrl(), "master", true);
            var func = function (rta) {
                console.log(rta);
            };
            rpc.exec("checkPoints", data, func);
            return;
            var data = self.getRecord();
            console.log(data);
            return;
            if (self.event == null) {
                self.event = document.createEvent('Event');
                self.event.initEvent('connect_nwdp');
                document.addEventListener("response_nwdp", function (rta) {
                    var js = JSON.parse(localStorage["digital_persona"]);
                    console.log(js);
                });
            }
            document.dispatchEvent(self.event);
            return;
//            if (self.event == null) {
            var data = self.getRecord();
            //if (qxnw.utils.evalue(data.identificacion)) {
            self.event = document.createEvent('Event');
            self.event.initEvent('connect_nwdp');
            document.addEventListener("response_nwdp", function (rta) {
                var js = JSON.parse(localStorage["digital_persona"]);
                console.log(js);
            });
            document.dispatchEvent(self.event);
            //} else {
            //    qxnw.utils.information(self.tr("De ingresar la cédula del paciente"));
            // }
//            }
//            var data = self.getRecord();
//            if (qxnw.utils.evalue(data.identificacion)) {
//                localStorage["id"] = data.identificacion;
//                document.dispatchEvent(self.event);
//            } else {
//                qxnw.utils.information(self.tr("De ingresar la cédula del paciente"));
//            }
            return;
            var data = {};
            data["filters"] = [];
            data["filters"]["ver_avances"] = true;
            data["filters"]["fecha_inicial"] = "2022-01-01";
            data["filters"]["fecha_final"] = "2022-01-15";
            var rpc = new qxnw.rpc(self.getRpcUrl(), "clientes_prospecto", true);
            var func = function (rta) {
                console.log(rta);
            };
            rpc.exec("consulta", data, func);
            return;
            var v = self.ui.selectTokenField.getValue();
            console.log(v);
            return;
            var r = self.getRecord();
            console.log(r);
            return;
            var data = {};
            data["params"] = {};
            data["params"]["cedula"] = "80821912";
            data["method"] = "ConsultaConductor";
            data["function"] = "Integracion";
            //data["function"] = "Notificacion";

            var rpc = new qxnw.rpc(self.getRpcUrl(), "dataCarga", true);
            var func = function (rta) {
                console.log(rta);
            };
            rpc.exec("start", data, func);
            return;
            sit.main.sendEventToYanbal();
            return;
            var data = {};
//            data["url"] = "http://proxynp.unique-yanbal.com/integraciondesa/WSSeguridadWeb/WSSeguridadService";
//            data["codigoInterfaz"] = "GSEGTKNINT";
//            data["mode"] = "TOKEN";
//            data["file"] = "yanbalGetToken";

            data["url"] = "http://proxynp.unique-yanbal.com/integraciondesa/orden/soap.v1";
            data["token"] = "ggU68TWDKsUYw7/eyuJesw==]/cb+yb18RGMJqPHHHXQIBWt3NCc86dFOI1Tp7iY7BoUMYxBMPXhF8ehRmIg5NP8JDuDLy+eWjIaq3LVKtlW8rQ==";
            data["file"] = "yanbalSendEvent";
            data["mode"] = "EVENT";
            var rpc = new qxnw.rpc(self.getRpcUrl(), "master", true);
            var func = function (rta) {
                console.log(rta);
            };
            rpc.exec("webServiceRest", data, func);
            return;
        });
        self.ui.cancel.addListener("execute", function () {

            self.clean();
            return;
            var rpc = new qxnw.rpc(self.getRpcUrl(), "marketing", true);
            var func = function (rta) {
                console.log(rta);
            };
            rpc.exec("getFBLeads", data, func);
            return;
            var r = self.getRecord();
            console.log(r);
            return;
            var data = 72;
//            var data = {};
//            data["id"] = 37313;

            var data = 72;
//            var data = {};
//            data["id"] = 37313;
            var rpc = new qxnw.rpc(self.getRpcUrl(), "sit_destino_seguro", true);
            var func = function (rta) {
                console.log(rta);
                try {
                    var msn = "";
                    var json = JSON.parse(rta);
                    console.log(json);
                    for (var v in json) {
                        msn += v;
                        msn += ": ";
                        msn += json[v];
                        msn += "<br />";
                    }
                    qxnw.utils.information(msn);
                } catch (e) {
                    if (rta.indexOf("|")) {
                        var v = rta.split("|");
                        var msn = "";
                        var radicado = 0;
                        for (var i = 0; i < v.length; i++) {
                            if (i == 0) {
                                continue;
                            }
                            if (i == 1) {
                                msn += v[i];
                                continue;
                            }
                            if (i == 2) {
                                msn += "<br />";
                                msn += "<b>Radicado:</b> ";
                                msn += v[i];
                                radicado = v[i];
                                continue;
                            }
                        }
                        console.log(radicado);
                        qxnw.utils.information(msn);
                    } else {
                        console.log(rta);
                    }
                }
            };
            rpc.exec("iniciar", data, func);
            return;
            console.log("VALIDATE!");
            if (!self.validate()) {
                console.log("NO SE PUEDE VALIDATE!");
                return;
            }
            return;
            var data = self.getRecord();
            console.log(data);
            var rpc = new qxnw.rpc(self.getRpcUrl(), "master", true);
            var func = function (rta) {
                console.log(rta);
            };
            rpc.exec("testNWDbQuery", data, func);
            return;
            qxnw.utils.loading("holaaaaaa");
            return;
            self.clean(true);
            return;
//            self.ui.signer.setValue('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');
        });
        return;
        /*
         * Ejemplo de uso de la clase dynamicImage. Estas opciones se deben usar en estricto órden. Abajo hay otro ejemplo de uso
         * dinámico. Cabe anotar que la clase no devuelve valores en el getRecord por ser de uso en el evento clickedFrame
         */
//        self.ui.dynamicImage.showLines(false);
//        self.ui.dynamicImage.showTooltip(true);
//        self.ui.dynamicImage.setImage("/imagenes/capricho.jpg");
//        self.ui.dynamicImage.setSizeWidth(300);
//        self.ui.dynamicImage.setSizeHeight(300);
//        self.ui.dynamicImage.setFrames("20x20");

        /*
         * Es posible marcar los puntos que servirán al usuario. El evento devuelve si están seleccionados o no
         */
//        self.ui.dynamicImage.setOptionalLocation("2x5", "red");
//        self.ui.dynamicImage.setOptionalLocation("2x6");
//        self.ui.dynamicImage.setOptionalLocation("2x7");
//        self.ui.dynamicImage.setOptionalLocation("2x8");

//        self.ui.dynamicImage.addListener("clickedFrame", function (e) {
//            var d = e.getData();
//            console.log(d);
//            
//            
//        });


//        self.ui.ubicacion_grafico.setHaveAlterIconDelete(false);
//        self.ui.ubicacion_grafico.setShowPdf(true, 300, 750);
//        self.ui.ubicacion_grafico.setWidthSubImage(400);

//        self.addCounterWords("observaciones");
        self.addCounterLetters("observaciones");
        self.ui.observaciones.setValue("hola que tal");
        var f = [
            {
                name: "test_cont",
                type: "textArea",
                label: "TEXT AREAAA"
            }
        ];
        var g = new qx.ui.groupbox.GroupBox("test");
        g.setLayout(new qx.ui.layout.VBox());
//        self.add(g);
//        self.addFieldsByContainer(f, g);

        var fields = [
//            {
//                name: "",
//                type: "startGroup",
//                icon: qxnw.config.execIcon(""),
//                mode: "vertical"
//            },
            {
                name: "selectTokenField",
                label: self.tr("SelectTokenField"),
                type: "selectTokenField"
            },
            {
                name: "selectTokenField2",
                label: self.tr("SelectTokenField 2"),
                type: "selectTokenField"
            },
            {
                name: "selectTokenField3",
                label: self.tr("SelectTokenField 3"),
                type: "selectTokenField"
            },
            {
                name: "telefono_acompanante",
                label: self.tr("Telefono Acompañante"),
                type: "dateField",
                enabled: false
            },
            {
                name: "contrato",
                label: self.tr("Contrato y/o Convenio"),
                type: "selectBox"
            },
            {
                name: "camera",
                label: self.tr("Cámara"),
                type: "camera"
            },
            {
                name: "time_ok",
                label: self.tr("Time"),
                type: "timeField",
                enabled: false
            },
            {
                name: "selectListCheck",
                label: self.tr("SLC"),
                type: "selectListCheck"
            },
            {
                name: "address",
                label: self.tr("Direccion"),
                type: "address"
            },
            {
                name: "token_field",
                label: self.tr("Token Field"),
                type: "tokenField"
            },
            {
                name: "money",
                label: self.tr("Money"),
                type: "textField",
                mode: "money"
            },
            {
                name: "enfasis_evaluacion",
                label: self.tr("Enfasis Evaluación"),
                type: "textField"
            },
            {
                name: "enfasis_evaluacion_time",
                label: self.tr("Time"),
                type: "textField"
            },
            {
                name: "liquidacion",
                label: self.tr("Liquidacion"),
                type: "selectBox"
            },
            {
                name: "nombre_acompanante",
                label: self.tr("Nombre Acompañante"),
                type: "dateTimeField",
                enabled: false
            },
            {
                name: "origen",
                label: self.tr("Empresa Contratante"),
                type: "textField"
            },
            {
                name: "destino",
                label: self.tr("Misión"),
                type: "textField"
            },
            {
                name: "nombre_cargo",
                label: self.tr("Nombre Cargo"),
                type: "textField"
            },
            {
                name: "autorizacion",
                label: self.tr("Autorización"),
                type: "selectBox"
            },
            {
                name: "ver_empresa",
                label: self.tr("Ver Empresa"),
                type: "button"
            },
            {
                name: "empresa_mision",
                label: self.tr("Crear Empresa Misión"),
                type: "button"
            },
            {
                name: "tipo_evaluacion",
                label: self.tr("Tipo Evaluación"),
                type: "selectBox"
            },
            {
                name: "prioridad_ingreso",
                label: self.tr("Prioridad Ingreso"),
                type: "selectBox"
            },
            {
                name: "radiografia",
                label: self.tr("Radiografía"),
                type: "selectBox"
            },
            {
                name: "peso_bascula",
                label: self.tr("Exámenes"),
                type: "textField"
            }
        ];
//        self.setFields(fields);

//        self.createMatriz();
//
//        return;

        var e = null;
        e = self.addListener("appear", function () {
            for (var i = 0; i < fields.length; i++) {
                if (fields[i].type != "startGroup") {
                    if (fields[i].type != "endGroup") {
//                        console.log(fields[i].name);
//                        console.log(self.ui[fields[i].name].getTabIndex());
                    }
                }
            }
        });

//        self.ui.checkBox.addListener("click", function (e) {
//            alert("click!!!");
//        });

//        self.setMinCharacterByTypeOnValidate("textArea", 5);


//        self.ui.selectTokenField2.addListener("loadData", function (e) {
//            var data = {};
////            var r = self.getRecord();
////            data["token"] = e.getData();
////            data["contrato"] = r.contrato;
//            var rpc = new qxnw.rpc(self.getRpcUrl(), "master");
//            rpc.setAsync(true);
//            var func = function (r) {
////                console.log({setModelData: r});
//                self.ui.selectTokenField2.setModelData(r);
//                if (r.length == 0) {
//                    return false;
//                } else {
//                    //var t = self.ui.selectTokenField.getTable();
//                    //t.setColumnWidth(1, 500);
//                }
//            };
////            console.log(data);
//            var t = self.getRecord();
//            rpc.exec("populate", {table: "usuarios", token: t.selectTokenField}, func);
//        }, this);
//        self.ui.selectTokenField3.addListener("loadData", function (e) {
//            var data = {};
////            var r = self.getRecord();
////            data["token"] = e.getData();
////            data["contrato"] = r.contrato;
//            var rpc = new qxnw.rpc(self.getRpcUrl(), "master");
//            rpc.setAsync(true);
//            var func = function (r) {
////                console.log({setModelData: r});
//                self.ui.selectTokenField3.setModelData(r);
//                if (r.length == 0) {
//                    return false;
//                } else {
//                    //var t = self.ui.selectTokenField.getTable();
//                    //t.setColumnWidth(1, 500);
//                }
//            };
////            console.log(data);
//            var t = self.getRecord();
//            rpc.exec("populate", {table: "usuarios", token: t.selectTokenField}, func);
//        }, this);

//        self.ui.selectTokenField.addListener("loadData", function (e) {
//            var data = {};
//            data["token"] = e.getData();
//            data["table"] = "usuarios";
//            var rpc = new qxnw.rpc(self.getRpcUrl(), "master");
//            var r = rpc.exec("populateToken", data);
//            if (rpc.isError()) {
//                qxnw.utils.alert(rpc.getError().message);
//                return;
//            }
//            self.ui.selectTokenField.setModelData(r);
//            self.ui.selectTokenField.setColumnLabelByName("nombre", "HOLA AMIGO");
//        }, this);

//        self.ui.textfieldnum.setMaxDecimals(3);
//        self.ui.textfieldnum.setDecimalPlaces(3);

        self.ui.address.setValue("Autopista        78                              A ESTE  145  A 145   Norte       Agrupación              s                       Carretera               s                       Casa                    s                      ");
//        self.ui.address.setValue("                                                                           FRENTA AL CEMENTERIO                        DE TULUA            ");
//        self.ui.address.setValue("Carrera          56                                    7    C 39                                       Parque Industrial Bl                        oc Port Bodega 23                          ");
//        self.ui.address.setValue("Calle            64                              N      5    B 186                                                                                   ");
//        self.ui.address.setValue("Transversal      AV QUITO ABCDEFGHIJKLMNOPQRSTV  B      683  E 2     Norte       Conjunto Residencial   405                  Bloque                 1                    Conjunto               INVEL               ");
//        self.ui.address.setValue("Avenida Carrera  24          82      51                30    50                                                                                    ");
//        self.ui.address.setValue("Calle            37 SUR                          D BIS  4    E 50                                                                                    ");

//        self.ui.uploader.setDragAndDrop(true);

//        self.ui.signer.setValue('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');

        self.ui.accept.addListener("execute", function () {

            var rpc = new qxnw.rpc(self.getRpcUrl(), "biostar2Api", true);
            var func = function (rta) {
                console.log(rta);
                var js = JSON.parse(rta);
                qxnw.utils.processBiostarApiMsg(js);
            };
            var data = {};
            data["method"] = "POST";
            data["function"] = "login";
//            data["function"] = "devices/sync";
            data["name"] = "andresf";
            rpc.exec("updateDevices", data, func);
            return;
            if (self.event == null) {
                console.log("null");
                self.event = document.createEvent('Event');
                self.event.initEvent('connect_nwsuprema');
                document.addEventListener("response_nwsuprema", function (rta) {
                    var js = JSON.parse(localStorage["suprema"]);
                    console.log(js);
//                    var data = {};
//                    data["huella"] = js["message"];
//                    var rpc = new qxnw.rpc(self.getRpcUrl(), "master");
//                    var func = function (rta) {
//                        console.log(rta);
//                    };
//                    rpc.exec("enviarBiostar", data, func);
                    return;
                });
                document.dispatchEvent(self.event);
                return;
            } else {
                console.log("NOT null");
                self.event = document.createEvent('Event');
                self.event.initEvent('connect_nwsuprema');
                document.dispatchEvent(self.event);
            }
            return;
            qxnw.utils.information("Datos guardados correctamente!", function (e) {
                console.log("e:" + e);
                qxnw.utils.question("Desea enviar el viaje a Destino Seguro", function (ea) {
                    console.log("ea:" + ea);
                    alert("por fin!");
                });
            });
            return;
            var rpc = new qxnw.rpc(self.getRpcUrl(), "nw_service", true);
            var func = function (rta) {
                console.log(rta);
            };
            rpc.exec("sendByNWSoap", null, func);
            return;
//            var rpc = new qxnw.rpc(self.getRpcUrl(), "master");
//            var func = function (rta) {
//                console.log(rta);
//            };
//            rpc.exec("enviarBiostar", null, func);
//            return;

            /*JAVA*/

//            if (self.event == null) {
            self.event = document.createEvent('Event');
            console.log("pasa!");
            self.event.initEvent('connect_nwdp');
            localStorage["ip"] = "192.168.0.6";
            localStorage["port"] = "80";
            localStorage["protocol"] = "http";
            localStorage["id"] = "80821912"; //1023938065
            document.addEventListener("response_nwdp", function (rta) {
                var js = JSON.parse(localStorage["digital_persona"]);
                console.log(js);
                console.log("PASA");
            });
//            }
            document.dispatchEvent(self.event);
            return;
            var rpc = new qxnw.rpc(self.getRpcUrl(), "master");
            var func = function (rta) {
                console.log(rta);
            };
            console.log("comes");
            rpc.exec("testSleep", data, func);
            return;
            /*C++*/
            if (self.event == null) {
                self.event = document.createEvent('Event');
                self.event.initEvent('connect');
                document.addEventListener("response", function (rta) {
                    var js = JSON.parse(localStorage["bascula"]);
                    console.log(js);
                    self.ui.peso_bascula.setValue(js.text);
                });
            }
            document.dispatchEvent(self.event);
            return;
            var data = {};
            var rpc = new qxnw.rpc(self.getRpcUrl(), "NWUtils", true);
            var func = function (rta) {
                console.log(rta);
            };
            var d = {};
            d["file1"] = "/var/www/nwadmin3/imagenes/audios/alexf_orig.mp3";
            d["file2"] = "/var/www/nwadmin3/imagenes/audios/andresf_orig.mp3";
            d["final"] = "/var/www/nwadmin3/imagenes/audios/final.wav";
            rpc.exec("testMergeWavs", d, func);
            return;
            var data = {};
            var rpc = new qxnw.rpc(self.getRpcUrl(), "NWUtils", true);
            var func = function (rta) {
                console.log(rta);
            };
            rpc.exec("mp3ToWav", "/var/www/nwadmin3/imagenes/audios/andresf_orig.mp3", func);
            return;
            var data = {};
            var rpc = new qxnw.rpc(self.getRpcUrl(), "master", true);
            rpc.setCrossDomain(true);
            var func = function (rta) {
                console.log(rta);
            };
            rpc.exec("buscarUsuariosActivos", data, func);
            return;
            qxnw.utils.loading("cargando...", null, true, true);
            var closeTimeOut = new qx.event.Timer(5000);
            closeTimeOut.start();
            closeTimeOut.addListener("interval", function (e) {
                this.stop();
                qxnw.utils.stopLoading();
            });
            return;
            try {
                var f = new qxnw.examples.form_lights();
                f.show();
            } catch (e) {
                qxnw.utils.error(e);
            }

            return;
            var data = {};
            data.table = "nw_list_edit";
            var rpc = new qxnw.rpc(self.getRpcUrl(), "master", true);
            var func = function (rta) {
                console.log(rta);
            };
            rpc.exec("populate", data, func);
            return;
            var data = {};
            var rpc = new qxnw.rpc(self.getRpcUrl(), "session");
            var c = rpc.exec("getCookies", data);
            if (rpc.isError()) {
                qxnw.utils.error(rpc.getError(), self);
                return;
            }
            console.log(c);
            return;
            if (!self.validate()) {
                return;
            }

            var rpc = new qxnw.rpc(self.getRpcUrl(), "master");
            var func = function (rta) {
                console.log(rta);
            };
            rpc.exec("testTransaction", data, func);
            return;
            self.ui.camera.clean();
            return;
            self.ui.selectTokenField.cleanAll();
            return;
            return;
            self.clean();
            return;
            if (!self.validate()) {
                return;
            }
            var data = self.getRecord();
            console.log(data);
            qxnw.utils.information(data.address);
            return;
        });
//        self.setGroupVisibility("matriz_de_riesgos", "excluded");
//        self.setGroupVisibility("matriz_de_riesgos1", "excluded");
//        self.setGroupVisibility("matriz_de_riesgos2", "excluded");

        return;
        //self.ui.spinner.setMinimum(0);

        self.ui.checkBox.addListener("execute", function () {
            alert("hola");
        });
        self.ui.selectTokenField.setUniqueIndex(true);
//        self.ui.uploader.setShowPdf(true, 200, 200);
//        self.ui.uploader.setValue("/imagenes/logo_nw.png");

//        self.ui.uploader.setHaveAlterIconDelete(true);

        self.ui.selectTokenField.setMaxItems(30);
//        self.ui.address.setValue("TV 02 # 68 04");

        /******************************/

//        self.ui.image.setValue("/imagenes/Selección_003.png");
//        self.ui.image.setValue("/imagenes/capricho.jpg");
//
//        self.ui.time.setEnabled(false);
//
//        self.ui.image_selector.setValue(["/imagenes/DSC_0008_2016_04_02_23_51NOVA_25.JPG", "/imagenes/fondos_qxnw_4.jpg"]);
////        self.ui.uploader.setValue("/imagenes/DSC_0008_2016_04_02_23_51NOVA_25.JPG");
//        self.ui.uploader.setValue("/imagenes/Encuesta.xlsx");
////        self.ui.uploader.setEnabled(false);
//        self.ui.checkbox.setEnabled(false);
//        self.ui.ckeditor.setValue('<p><img alt="" src="/imagenes/DSC_0008_2016_04_02_23_51_25.JPG" /></p>');
        //finaliza grupo iniciado
//        var cont = new qx.ui.container.Composite(new qx.ui.layout.Grow());
//        var g = new qx.ui.groupbox.GroupBox("test");
//        g.setLayout(new qx.ui.layout.VBox());
//        cont.add(g);
//        self.addWidget(cont);
//        self.addFieldsByContainer(fields, g);
//
//        self.ui.ciudad.addListener("loadData", function (e) {
//            var data = {};
//            data["token"] = e.getData();
//            var rpc = new qxnw.rpc(self.getRpcUrl(), "ciudades");
//            rpc.setAsync(true);
//            var func = function (r) {
//                self.ui.ciudad.setModelData(r);
//            };
//            rpc.exec("populateTokenCiudades", data, func);
//        }, this);
//
        self.ui.accept.addListener("execute", function () {

            if (!self.validate()) {
                return;
            }
            return;
            self.setMinCharacterByTypeOnValidate("textField", 2);
            return;
            self.setMaxCharacterByType("textField", 2);
            return;
            var data = self.getRecord();
            console.log(data);
            return;
            for (var i = 0; i < 30; i++) {
                var t = {};
                t["nombre"] = "Carlos es el # " + i;
                t["id"] = i;
                self.ui.selectTokenField.addToken(t, null, true);
            }
            return;
            self.ui.dynamicImage.cleanMask();
            return;
            self.ui.dynamicImage.showLines(false);
            self.ui.dynamicImage.showTooltip(true);
            self.ui.dynamicImage.setImage("/imagenes/capricho.jpg");
            self.ui.dynamicImage.setSizeWidth(300);
            self.ui.dynamicImage.setSizeHeight(300);
            self.ui.dynamicImage.setFrames("20x20");
            return;
            self.ui.checkBox.setEnabled(false);
            return;
            self.ui.dynamicImage.showLines(true);
            self.ui.dynamicImage.showCoordinates(false);
            self.ui.dynamicImage.showTooltip(false);
            self.ui.dynamicImage.setImage("/imagenes/gruponw.png");
            self.ui.dynamicImage.setSizeWidth(232);
            self.ui.dynamicImage.setSizeHeight(145);
            self.ui.dynamicImage.setFrames("2x3");
            return;
            self.setEnabledAll(true);
            if (!self.validate()) {
                return;
            }
//            self.ui.image_selector.setEnabled(true);

            self.ui.dynamicImage.showLines(true);
            self.ui.dynamicImage.showCoordinates(false);
            self.ui.dynamicImage.showTooltip(false);
            self.ui.dynamicImage.setImage("/imagenes/andresf.png");
            self.ui.dynamicImage.setSizeWidth(232);
            self.ui.dynamicImage.setSizeHeight(145);
            self.ui.dynamicImage.setFrames("2x3");
            self.ui.date.setEnabled(false);
            return;
//            var rpc = new qxnw.rpc(self.getRpcUrl(), "master", true);
//            rpc.exec("test_security", data);
        });
//        self.ui.cancel.addListener("execute", function () {
//            self.reject();
//        });
//
//        self.ui.textarea.setServerDate();

        var text = "<div onclick='qxnw.examples.form_light.slotVistaGeneral(1)'>Ampliar</div>";
        self.addFooterNote(text);
//        self.setBackgroundImage("/imagenes/capricho.jpg", "cover", "no-repeat");

        self.createButtons();
        //self.ui.checkBox.setEnabled(false);
//        self.setEnabledAll(false);

//        self.ui.textField.addListener("appear", function () {
//            qx.bom.element.Style.set(this.getContentElement().getDomElement(), "color", "red");
//        });

//        var f = new qxnw.lists();
//        f.createFromTable("nw_list_edit");
//        //f.setFields(fields);
//        self.addNewWidget(f);
    },
    members: {
        event: null,
        createMatriz: function createMatriz() {
            var self = this;
            self.navTableMatrizRiesgos = new qxnw.listEdit(self);
            var columnsp = [
                {
                    label: self.tr("Id"),
                    caption: "id"
                },
                {
                    label: self.tr("<div> Empresa</div>"),
                    caption: "empresa",
                    type: "textField"
                }
            ];
            var j = self.populateNavTableMatrizRiesgos();
            var color = "";
            for (var i = 0; i < j.length; i++) {
                var campo = j[i]["riesgo"];
                var cap = campo.toLowerCase();
                cap.toString();
                var letra = [];
                for (var e = 0; e < cap.length; e++) {
                    if (cap[e] == " ") {
                        letra.push("_");
                    } else {
                        letra.push(cap[e]);
                    }
                }
                letra = letra.join("");
                switch (j[i]["tipo_riesgo"]) {
                    case "Fisico":
                        color = "#5dc594";
                        break;
                    case "Quimicos":
                        color = "rgb(171, 81, 83)";
                        break;
                    case "Biomecánico":
                        color = "rgb(184, 182, 70)";
                        break;
                    case "Biólogicos":
                        color = "rgb(217, 134, 215)";
                        break;
                    case "Psicosocial":
                        color = "rgb(130, 131, 211)";
                        break;
                    case "Seguridad":
                        color = "rgb(194, 145, 93)";
                        break;
                    default:
                        color = "";
                        break;
                }
                columnsp.push(
                        {
//                            label: self.tr(campo), alexf 7 jul 2022 (comment fix bug compile)
                            label: campo,
//                            label: self.tr("<div style='writing-mode: vertical-lr; transform: rotate(180deg); text-align: left!important; height: 190px;'>" + campo + ""),
                            caption: "" + letra + "",
                            type: "checkBox",
                            editable: true,
                            colorHeader: "" + color + ""
                        });
                if (i + 1 == j.length) {
                    columnsp.push(
                            {
                                label: self.tr("Observación"),
                                caption: "observacion",
                                type: "textField",
                                editable: true
                            });
                    self.navTableMatrizRiesgos.setColumns(columnsp);
                }
            }
//            self.setFieldVisibility(self.ui.campo_ciego_matriz, "excluded");
            self.navTableMatrizRiesgos.hideColumn("id");
//        self.navTableMatrizRiesgos.setFilters();
            self.navTableMatrizRiesgos.hideColumn("id");
            self.navTableMatrizRiesgos.setListEdit();
            self.navTableMatrizRiesgos.hideTools();
            self.navTableMatrizRiesgos.hideFooterTools();
            self.navTableMatrizRiesgos.setEnabledFilters(false);
//            self.navTableMatrizRiesgos.table.setHeight(450);
            self.navTableMatrizRiesgos.setColumnVisibilityButtonVisible(false);
//            self.navTableMatrizRiesgos.table.blockHeaderElements();
            self.navTableMatrizRiesgos.table.getTableModel().setColumnEditable(1, false);
//            self.navTableMatrizRiesgos.table.getTableColumnModel().setColumnWidth(1, 200);
            for (var i = 2; i < 36; i++) {
//                self.navTableMatrizRiesgos.table.getTableColumnModel().setColumnWidth(i, 40);
            }
//            self.navTableMatrizRiesgos.table.setHeaderCellHeight(200);
//        self.setGroupLayout("matriz_de_riesgos", "horizontal");

            self.addBeforeGroup("matriz_de_riesgos", self.navTableMatrizRiesgos.getBase());
            self.navTableMatrizRiesgos.setTitle(self.tr("Parte del Cuerpo"));
            var css = document.createElement('style');
//            css.innerHTML = ".qx-table-statusbar {display: none;}";
            document.body.appendChild(css);
            self.navTableMatrizRiesgos.setVerticalBehavior(true);
            var cols = [
                {
                    columns: 1,
                    type: "spacer"
                },
                {
                    color: "#5dc594",
                    columns: 7,
                    type: "container",
                    label: self.tr("Físicos")
                },
                {
                    color: "rgb(171, 81, 83)",
                    columns: 5,
                    type: "container",
                    label: self.tr("Químicos")
                },
                {
                    color: "rgb(184, 182, 70)",
                    columns: 5,
                    type: "container",
                    label: self.tr("Biomecánicos")
                },
                {
                    color: "rgb(217, 134, 215)",
                    columns: 6,
                    type: "container",
                    label: self.tr("Biológicos")
                },
                {
                    color: "rgb(130, 131, 211)",
                    columns: 4,
                    type: "container",
                    label: self.tr("Psicosocial")
                },
                {
                    color: "rgb(194, 145, 93)",
                    columns: 7,
                    type: "container",
                    label: self.tr("Seguridad")
                }
            ];
            self.navTableMatrizRiesgos.createUpColumns(cols, "white");
            self.navTableMatrizRiesgos.blockHeaderElements();
            return;
//            var filt = self.navTableMatrizRiesgos.containerTable;
            var filt = new qx.ui.container.Composite(new qx.ui.layout.HBox()).set({
                minHeight: 100
            });
            var spacer = new qx.ui.core.Spacer(200, 5);
            filt.add(spacer);
            var container = new qx.ui.container.Composite(new qx.ui.layout.VBox()).set({
                minWidth: 280,
                backgroundColor: "#5dc594",
                maxHeight: 25
            });
            container.add(self.ui.fisicos.getLayoutParent(), {
                flex: 0
            });
            filt.add(container);
            var containers = new qx.ui.container.Composite(new qx.ui.layout.VBox()).set({
                minWidth: 200,
                backgroundColor: "rgb(171, 81, 83)",
                maxHeight: 25
            });
            containers.add(self.ui.quimicos.getLayoutParent());
            filt.add(containers);
            var containers = new qx.ui.container.Composite(new qx.ui.layout.VBox()).set({
                minWidth: 198,
                backgroundColor: "rgb(184, 182, 70)",
                maxHeight: 25
            });
            containers.add(self.ui.biomec.getLayoutParent());
            filt.add(containers);
            var containers = new qx.ui.container.Composite(new qx.ui.layout.VBox()).set({
                minWidth: 240,
                backgroundColor: "rgb(217, 134, 215)",
                maxHeight: 25
            });
            containers.add(self.ui.biologicos.getLayoutParent());
            filt.add(containers);
            var containers = new qx.ui.container.Composite(new qx.ui.layout.VBox()).set({
                minWidth: 161,
                backgroundColor: "rgb(130, 131, 211)",
                maxHeight: 25
            });
            containers.add(self.ui.psico.getLayoutParent());
            filt.add(containers);
            var containers = new qx.ui.container.Composite(new qx.ui.layout.VBox()).set({
                minWidth: 222,
                backgroundColor: "rgb(194, 145, 93)",
                maxHeight: 25
            });
            containers.add(self.ui.seguridad.getLayoutParent());
            filt.add(containers);
            var ps = self.navTableMatrizRiesgos.table.getPaneScroller(0);
            var containerHeader = new qx.ui.container.Composite(new qx.ui.layout.VBox());
            containerHeader.add(filt);
            ps.getHeaderClipper()._add(containerHeader);
        },
        populateNavTableMatrizRiesgos: function populateNavTableMatrizRiesgos() {
            var self = this;
            var data = [
                {tipo_riesgo: "Fisico", riesgo: "Ruido"}, {tipo_riesgo: "Fisico", riesgo: "Rad. Ionizantes"}, {tipo_riesgo: "Fisico", riesgo: "Rad. No Ionizantes"}, {tipo_riesgo: "Fisico", riesgo: "Iluminación"}, {tipo_riesgo: "Fisico", riesgo: "Vibraciones"}, {tipo_riesgo: "Fisico", riesgo: "Temp. Altas o Bajas"}, {tipo_riesgo: "Fisico", riesgo: "Presión Atmosferica"},
                {tipo_riesgo: "Quimicos", riesgo: "Liquidos"}, {tipo_riesgo: "Quimicos", riesgo: "Material Particulado"}, {tipo_riesgo: "Quimicos", riesgo: "Fibras"}, {tipo_riesgo: "Quimicos", riesgo: "Vapores"}, {tipo_riesgo: "Quimicos", riesgo: "Humos-Gases"},
                {tipo_riesgo: "Biomecánico", riesgo: "Movimientos Repetitivos"}, {tipo_riesgo: "Biomecánico", riesgo: "Sedente Prolongado"}, {tipo_riesgo: "Biomecánico", riesgo: "Bipedestación Prolongada"}, {tipo_riesgo: "Biomecánico", riesgo: "Esfuerzo"}, {tipo_riesgo: "Biomecánico", riesgo: "Manipulación de Cargas"},
                {tipo_riesgo: "Biólogicos", riesgo: "Virus"}, {tipo_riesgo: "Biólogicos", riesgo: "Bacterias"}, {tipo_riesgo: "Biólogicos", riesgo: "Hongos"}, {tipo_riesgo: "Biólogicos", riesgo: "Parásitos"}, {tipo_riesgo: "Biólogicos", riesgo: "Picaduras"}, {tipo_riesgo: "Biólogicos", riesgo: "Mordeduras"},
                {tipo_riesgo: "Psicosocial", riesgo: "Jornada De Trabajo"}, {tipo_riesgo: "Psicosocial", riesgo: "Condiciones De La Tarea"}, {tipo_riesgo: "Psicosocial", riesgo: "Organización Del Trabajo"}, {tipo_riesgo: "Psicosocial", riesgo: "Interfaces Persona Tarea"},
                {tipo_riesgo: "Seguridad", riesgo: "Mecánico"}, {tipo_riesgo: "Seguridad", riesgo: "Eléctrico"}, {tipo_riesgo: "Seguridad", riesgo: "Locativo"}, {tipo_riesgo: "Seguridad", riesgo: "Públicos"}, {tipo_riesgo: "Seguridad", riesgo: "Trabajo En Alturas"}, {tipo_riesgo: "Seguridad", riesgo: "Espacios Confinados"}, {tipo_riesgo: "Seguridad", riesgo: "Otros Riesgos"}
            ];
            return data;
        },
        slotVistaGeneral: function slotVistaGeneral(test) {
            alert("ok" + test);
        }
    }
});