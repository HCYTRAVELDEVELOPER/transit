qx.Class.define("qxnw.examples.dragdrop", {
    extend: qxnw.dragDropWidget,
    ///TEST
    construct: function construct() {
        this.base(arguments);
        var self = this;
        self.setColumnsFormNumber(0);
        var fields = [
            {
                name: "Test",
                label: "Start",
                type: "startGroup",
                mode: "vertical"
            },
            {
                name: "uploader",
                label: "UPLOADER",
                type: "uploader",
                mode: "rename_random"
            },
            {
                name: "time",
                label: "TIME",
                type: "timeField"
            },
            {
                name: "selectTokenField",
                label: "Select T F",
                type: "selectTokenField",
                mode: "lowerCase"
            },
            {
                name: "textArea",
                label: "Text Area",
                type: "textArea"
            },
            {
                name: "dateTime",
                label: "Date Time",
                type: "dateTimeField"
            }
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
//                name: "uploader",
//                label: "uploader",
//                type: "uploader"
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
//            {
//                name: "ciudad",
//                label: "selectToken",
//                type: "selectTokenField"
//            },
//            {
//                name: "selectToken",
//                label: "text Area",
//                type: "textArea",
//                mode: "string.maxCharacteres:2.speech"
//            }

        self.setFields(fields);

        self.list2.setTypeListItem("checkBox");

//        self.list1.populate("master", "populate", {table: "usuarios"}, "checkBox");

        self.ui.time.setEnabled(false);
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
        var filters = [
            {
                name: "fecha_ruta",
                label: "Fecha Ruta",
//                type: "dateField",
                type: "dateTimeField",
                required: true
            },
            {
                name: "tipo_ruta",
                label: "Tipo Ruta",
                type: "selectBox",
                required: true
            },
            {
                name: "tipo_consulta",
                label: "Tipo consulta",
                type: "selectBox",
                required: true
            },
            {
                name: "ciudad",
                label: "Ciudad",
                type: "selectTokenField",
                required: true
            },
            {
                name: "zona",
                label: "Zona",
                type: "selectTokenField"
            },
            {
                name: "terminal",
                label: "Terminal",
                type: "selectTokenField",
                required: true
            }
        ];
        self.createFilters(filters);
//
        self.ui.accept.addListener("execute", function () {
            if (!self.validate()) {
                return;
            }
            self.ui.image_selector.setEnabled(true);
            var data = self.getRecord();
            console.log(data);
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

        self.createButtons();

//        var f = new qxnw.lists();
//        f.createFromTable("nw_list_edit");
//        //f.setFields(fields);
//        self.addNewWidget(f);
    },
    statics: {
        slotVistaGeneral: function slotVistaGeneral(test) {
            alert("ok" + test);
        }
    }
});