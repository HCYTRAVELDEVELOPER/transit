qx.Class.define("qxnw.nw_import_data.imp_chars_len", {
    extend: qxnw.forms,
    construct: function () {
        var self = this;
        self.base(arguments);
        self.setTitle(self.tr("Sistema de importación por caracteres :: QXNW"));
        self.setLayout(new qx.ui.layout.VBox().set({
            alignX: "center"
        }));

        self.createToolBar();

        var label = new qx.ui.basic.Label(self.tr("<font style='color: #20282F;font-size: 2em;'>Importación masiva de datos desde archivo CSV/TXT.</font>")).set({
            rich: true,
            alignX: "center"
        });
        self.masterContainer.add(label, {
            flex: 1
        });

        self.__listCols = new qxnw.listEdit();
        var cols = [
            {
                caption: "orden",
                label: self.tr("Orden"),
                editable: true,
                type: "spinner"
            },
            {
                caption: "title",
                label: self.tr("Título"),
                editable: true,
                type: "textField"
            },
            {
                caption: "data_type",
                label: self.tr("Tipo de dato"),
                editable: true,
                type: "textField"
            },
            {
                caption: "useful",
                label: self.tr("Uso"),
                editable: true,
                type: "checkBox"
            },
            {
                caption: "char_len",
                label: self.tr("Num caracteres"),
                editable: true,
                type: "textField"
            },
            {
                caption: "clean_spaces",
                label: self.tr("Limpiar espacios"),
                editable: true,
                type: "checkBox"
            },
            {
                caption: "remove_zero_left",
                label: self.tr("Limpiar ceros a la izquierda"),
                editable: true,
                type: "checkBox"
            }
        ];
        self.__listCols.setColumns(cols);

        self.__listCols.table.set({
            maxHeight: 300
        });
        self.__listCols.setListEdit();
        self.__listCols.hideFooterTools();
        self.__listCols.hideTools();
        self.insertNavTable(self.__listCols.getBase(), self.tr("Parametrizacioń columnas"));

        self.__listFields = new qxnw.listEdit();
        self.__listFields.ui.part2.setVisibility("excluded");
        self.__listFields.ui.updateButton.setVisibility("excluded");
        var cols = [
            {
                caption: "column_name",
                label: self.tr("Nombre")
            }
        ];
        self.__listFields.setColumns(cols);
        self.__listFields.setListEdit();
        self.__listFields.setMaxShowRows(100000);
        self.__listFields.hideFooterTools();
        self.insertNavTable(self.__listFields.getBase(), self.tr("Líneas importadas"), false, false, true);

        var l = new qx.ui.layout.Grid().set({
            spacing: 0,
            spacingX: 0,
            spacingY: 0
        });
        l.setColumnFlex(0, 1);
        var c1 = new qx.ui.container.Composite(l).set({
            alignX: "right",
            alignY: "top",
            padding: 0
        });

        self.masterContainer.add(new qx.ui.core.Spacer(null, 10), {
            flex: 0
        });

        self.add(c1, {
            flex: 0
        });

        var fields = [
            {
                name: "startGroup",
                type: "startGroup",
                label: self.tr("Opciones")
            },
            {
                name: "omitir",
                type: "checkBox",
                label: self.tr("Ignorar la primera línea:"),
                column: 4,
                row: 0,
                toolTip: self.tr("Puede excluir la primera línea de su archivo en caso de que contenga títulos")
            },
            {
                name: "file",
                type: "uploader",
                required: true,
                label: self.tr("Seleccionar archivo:"),
                column: 7,
                row: 0
            },
            {
                name: "import",
                type: "button",
                label: self.tr("Importar"),
                column: 8,
                row: 0
            },
            {
                name: "salir",
                type: "button",
                label: self.tr("Salir"),
                column: 9,
                row: 0
            }
        ];
        self.addFieldsByContainer(fields, c1, "grid");
        self.ui.omitir.setValue(true);
        self.ui.import.setPadding(0);
        self.ui.salir.setPadding(0);
        self.ui.import.setIcon(qxnw.config.execIcon("dialog-apply"));
        self.ui.salir.setIcon(qxnw.config.execIcon("dialog-close"));
        self.ui.salir.addListener("execute", function () {
            self.close();
        });
        self.ui.import.setMinWidth(100);
        self.ui.import.setMaxHeight(30);

        self.ui.salir.setMinWidth(100);
        self.ui.salir.setMaxHeight(30);
        self.ui.salir.setMaxWidth(100);

        self.ui.file.addListener("completed", function (e) {
            self.findColumns(e.getData());
            this.getImage().setMaxHeight(0);
        });

        self.ui.import.addListener("execute", function () {
            self.startImport();
        });

        self.ui.omitir.saveUserData("nw_import_delimiter_omitir");

        self.__ignoredLines = [];
        self.__errors = [];
        self.__importedLines = 0;
        self.__errorLines = [];
    },
    members: {
        __labelTable: null,
        __listCols: null,
        __selectColumns: null,
        __ignoredLines: null,
        __errors: null,
        mainSelect: null,
        fieldType: null,
        createToolBar: function createToolBar() {
            var self = this;
            var toolBar = new qx.ui.toolbar.ToolBar();
            var part = new qx.ui.toolbar.Part();
            toolBar.add(part);

            var selectMainButton = new qxnw.fields.selectBox().set({
                minWidth: 200
            });
            self.ui.mainSelect = selectMainButton;
            selectMainButton.addListener("changeSelection", function () {
                var t = new qx.event.Timer(100);
                t.start();
                t.addListener("interval", function (e) {
                    this.stop();
                    self.populateColumnsToImport();
                });
            });
            qxnw.utils.populateSelectAsync(self.ui.mainSelect, "nw_import_data", "getMain");
            part.add(selectMainButton);
            self.masterContainer.add(toolBar, {
                flex: 0
            });

            var selectEncodeButton = new qxnw.fields.selectBox().set({
                minWidth: 200
            });
            self.ui.encodeSelect = selectEncodeButton;
            
            var arr = {};
            arr["UTF-8"] = "UTF-8";
            arr["UTF-16"] = "UTF-16";
            arr["8859-15"] = "8859-15";
            qxnw.utils.populateSelectFromArray(self.ui.encodeSelect, arr);
            part.add(selectEncodeButton);
            
            self.fieldType = new qx.ui.form.TextField();
            self.fieldType.setEnabled(false);
            part.add(self.fieldType);

            var addField = new qx.ui.form.Button(self.tr("Agregar campo"), qxnw.config.execIcon("window-new"));
            addField.addListener("execute", function () {
                self.addField();
            });
            part.add(addField);
        },
        addField: function addField() {
            var self = this;
            var f = new qxnw.nw_import_data.forms.f_addField();
            var enc = this.ui.mainSelect.getValue();
            f.setParamRecord(enc.model);
            f.settings.accept = function () {
                self.populateColumnsToImport();
            };
            f.show();
        },
        populateColumnsToImport: function populateColumnsToImport() {
            var self = this;
            var v = self.ui.mainSelect.getValue();
            self.fieldType.setValue(v["data"]["tipo"]);
            var data = {};
            data["id"] = v["model"];
            var rpc = new qxnw.rpc(self.getRpcUrl(), "nw_import_data", true);
            var func = function (rta) {
                self.__listCols.setModelData(rta);
            };
            rpc.exec("getColumnsToImport", data, func);
        },
        processDataToList: function processDataToList(rta) {
            var self = this;
            var columns = [];
            for (var i = 0; i < rta.columns.length; i++) {
                var v = {};
                v["caption"] = rta.columns[i];
                v["label"] = rta.columns[i];
                columns.push(v);
            }
            self.__listFields.setColumns(columns);
            self.__listFields.setModelData(rta.rows);

            self.__listFields.setAutoWidth();
        },
        findColumns: function findColumns(file) {
            var self = this;
            var v = self.ui.mainSelect.getValue();
            var rpc = new qxnw.rpc(self.getRpcUrl(), "nw_import_data", true);
            var d = {};
            d.file = file;
            d.ref = v["data"]["ref"];
            d.omitir = self.ui.omitir.getValue();
            var func = function (rta) {
                self.processDataToList(rta);
            };
            rpc.exec("findFileColumnsByParameters", d, func);
        }
    }
});