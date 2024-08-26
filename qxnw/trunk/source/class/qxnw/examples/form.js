qx.Class.define("qxnw.examples.form", {
    extend: qxnw.forms,
    ///TEST
    construct: function construct() {
        this.base(arguments);
        var self = this;
        self.setColumnsFormNumber(3);
        var fields = [
            {
                type: "startGroup",
                mode: "horizontal",
                border: "red",
                color: "blue"
            },
            {
                name: "uploader_multiple",
                label: "Uploader múltiple",
                type: "uploader_multiple"
            },
            {
                name: "uploader",
                label: "Uploader",
                type: "uploader"
            },
            {
                name: "select",
                label: "Select token",
                type: "selectTokenField",
                required: false
            },
            {
                name: "dateTimeField",
                label: "Date time",
                type: "dateTimeField"
            },
            {
                name: "dateField",
                label: "Date",
                type: "dateField"
            },
            {
                name: "time",
                label: "Time",
                type: "timeField",
                required: true
            },
            {
                name: "plazo",
                label: "Plazo",
                type: "textField",
                required: true
            },
            {
                name: "money",
                label: "MONEY",
                type: "textField",
                mode: "money",
                required: false
            },
            {
                name: "search",
                label: "Search",
                type: "textField",
                mode: "search",
                required: true
            },
            {
                name: "tokenField",
                label: "Token",
                type: "tokenField",
                required: false
            },
            {
                name: "proveedor",
                label: "Proveedor",
                type: "selectListCheck"
            },
            {
                name: "list_check",
                label: "List Check",
                type: "selectListCheck",
                required: false
            },
            {
                name: "",
                type: "endGroup"
            },
            {
                type: "startGroup",
                mode: "horizontal"
            },
            {
                name: "factura",
                label: "Factura",
                type: "textField",
                mode: "numeric"
            },
            {
                name: "fecha",
                label: "Fecha",
                type: "dateField"
            },
            {
                name: "f_pago",
                label: "Forma Pago",
                caption: "f_pago",
                type: "selectBox"
            },
            {
                name: "listCheck",
                label: "List check",
                caption: "listCheck",
                type: "listCheck"
            },
            {
                name: "text_area",
                label: "Text Area",
                type: "textArea",
                mode: "upperCase"
            },
            {
                name: "",
                type: "endGroup"
            }
        ];
        //finaliza grupo iniciado
        self.setFields(fields);
        
//        self.ui.time.setEnabled(false);

        self.setAskOnClose(true);

        self.ui.select.setMinChars(1);

        self.ui.money.addListener("input", function (e) {
            console.log(e.getData());
        });

        //self.ui.f_pago.setAppearance("nw_selectbox");

        self.ui.proveedor.populate("master", "populate", {table: "usuarios"});
        self.ui.listCheck.populate("master", "populate", {table: "usuarios"});
        self.ui.listCheck.setBoldFonts(true);

        var psicosomaticos = {
            id: 2,
            nombre: "andresf"
        };
        self.ui.proveedor.addToken(psicosomaticos);

        self.ui.listCheck.contextMenu = function (pos, item) {
            var these = this;
            item.setValue(true);
            var m = new qxnw.contextmenu(these);
            m.addAction(self.tr("Copiar"), qxnw.config.execIcon("edit-copy"), function (e) {
                self.slotCopy();
            });
            m.addAction(self.tr("Normal"), qxnw.config.execIcon("white", "qxnw"), function (e) {
                qxnw.utils.addColorToListItem(item, "black");
                var model = [];
                model["color"] = "black";
                these.setModelToItem(item, model);
            });
            m.addAction(self.tr("Moderado"), qxnw.config.execIcon("green", "qxnw"), function (e) {
                qxnw.utils.addColorToListItem(item, "green");
                var model = [];
                model["color"] = "green";
                these.setModelToItem(item, model);
            });
            m.addAction(self.tr("Severo"), qxnw.config.execIcon("red", "qxnw"), function (e) {
                qxnw.utils.addColorToListItem(item, "red");
                var model = [];
                model["color"] = "red";
                these.setModelToItem(item, model);
            });
            m.exec(pos);
        };

        self.ui.proveedor.contextMenu = function (pos, item) {
            var these = this;
            var m = new qxnw.contextmenu(these);
            m.addAction(self.tr("Copiar"), qxnw.config.execIcon("edit-copy"), function (e) {
                these.slotCopy();
            });
            m.addAction(self.tr("Normal"), qxnw.config.execIcon("white", "qxnw"), function (e) {
                qxnw.utils.addColorToListItem(item, "black");
                var model = [];
                model["color"] = "black";
                these.setModelToItem(item, model);
            });
            m.addAction(self.tr("Moderado"), qxnw.config.execIcon("green", "qxnw"), function (e) {
                qxnw.utils.addColorToListItem(item, "green");
                var model = [];
                model["color"] = "green";
                these.setModelToItem(item, model);
            });
            m.addAction(self.tr("Severo"), qxnw.config.execIcon("red", "qxnw"), function (e) {
                qxnw.utils.addColorToListItem(item, "red");
                var model = [];
                model["color"] = "red";
                these.setModelToItem(item, model);
            });
            m.exec(pos);
        };

//        self.listUrls = new qxnw.widgets.list();
//        self.listUrls.populate("master", "populate", {table: "usuarios"}, "listItem");
//        self.addNewWidget(self.listUrls, self.tr("Sitemaps disponibles"), false);

        self.ui.tokenField.addListener("loadData", function (e) {
            var data = {};
            data["token"] = e.getData();
            var rpc = new qxnw.rpc(self.getRpcUrl(), "master");
            rpc.setAsync(true);
            var func = function (r) {
                self.ui.tokenField.setModelData(data["token"], r);
            };
            data["table"] = "usuarios"
            rpc.exec("populateToken", data, func);
        }, this);
        self.ui.select.addListener("loadData", function (e) {
            var data = {};
            data["token"] = e.getData();
            var rpc = new qxnw.rpc(self.getRpcUrl(), "ciudades");
            rpc.setAsync(true);
            var func = function (r) {
                self.ui.select.setModelData(r);
            };
            rpc.exec("populateTokenCiudades", data, func);
        }, this);

        self.ui.list_check.setMaxItems(20);

        var token = [];
        token["id"] = 1;
        token["nombre"] = "TEST";
        //self.ui.list_check.addToken(token);
        //qxnw.utils.enableMouse();

        //var data = {};
        //data["table"] = "usuarios";
        //qxnw.utils.populateSelect(self.ui.f_pago, "master", "populate", data);

        var data = [];
        data["test"] = "<font color='green'>hola</font>";
        data["otro"] = "<font color='red'>Test</font>";
        qxnw.utils.populateSelectFromArray(self.ui.f_pago, data);

        self.ui.f_pago.addListener("changeSelection", function () {
            self.ui.money.setValue("200000");
        });
        self.ui.list_check.populate("master", "populate", {table: "perfiles"});
        self.ui.proveedor.populate("master", "populate", {table: "perfiles"});

        self.ui.select.addListener("addItem", function () {
            self.ui.select.cleanAll();
            return;
        });

        self.ui.accept.addListener("execute", function () {

            if (!self.validate()) {
                return;
            }
            var data = self.getRecord();
            console.log(data);
            return;

            var enabled = self.enabled;

            if (enabled == false) {
                enabled = true;
            } else {
                enabled = false;
            }
            self.enabled = enabled;
            self.ui.text_area.setEnabled(enabled);

            return;

            self.destroyNavTable(0);

            return;


            self.clean();

            return;

            var rpc = new qxnw.rpc(self.getRpcUrl(), "master", true);
            rpc.exec("test_security", data);
        });
        self.ui.cancel.addListener("execute", function () {
            self.reject();
        });


        var nav = new qxnw.navtable(self, true);
        var col = [
            {
                label: "ID",
                caption: "id"
            },
            {
                label: "Money",
                caption: "money",
                type: "money"
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
                editable: true,
                search: true
            },
            {
                label: "Date",
                caption: "datevalue",
                type: "dateField",
                editable: true,
                required: true
            },
            {
                label: "Visible",
                caption: "visible",
                type: "checkBox",
                editable: true
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
        nav.ui.addButton.addListener("execute", function () {
            console.log(nav.getAllData());
            nav.populate("master", "testListEdit");
        });
        nav.ui.removeButton.addListener("execute", function () {
            nav.removeSelectedRow();
        });
        nav.populate("master", "testListEdit");
        nav.setEnablePanel(false);
        nav.enableButtons(false);
        self.insertNavTable(nav.getBase(), "NavTable", true, 0, 0, 0, 0);

        var f = new qxnw.examples.form_light();
        self.insertNavTable(f, "Form", true);


        var r = {};
        r.dateField = "2017-01-10";
        self.setRecord(r);
    },
    members: {
        enabled: false
    }
});