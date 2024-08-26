qx.Class.define("qxnw.nw_import_data.main", {
    extend: qxnw.forms,
    construct: function () {
        var self = this;
        self.base(arguments);
        self.setTitle(self.tr("Sistema de importación :: QXNW"));
        self.setLayout(new qx.ui.layout.VBox().set({
            alignX: "center"
        }));

        var label = new qx.ui.basic.Label(self.tr("<font style='color: #20282F;font-size: 2em;'>Importación masiva de datos desde archivo CSV/TXT.</font>")).set({
            rich: true,
            alignX: "center"
        });
        self.masterContainer.add(label, {
            flex: 1
        });

        var label1 = new qx.ui.basic.Label(self.tr("<font style='font-size: 1em;color: #A32027;width: 80%;margin: auto;'>Recuerde crear el archivo en Excel y guardarlo como archivo separado por tabulaciones o comas(,) (.CSV/.TXT)</font>")).set({
            rich: true,
            alignX: "center"
        });
        self.masterContainer.add(label1, {
            flex: 1
        });

        self.__labelTable = new qx.ui.basic.Label(self.tr("<font style='color: #20282F;font-size: 2em;'>Estructura tabla _____</font>")).set({
            rich: true,
            alignX: "center"
        });
        self.masterContainer.add(self.__labelTable, {
            flex: 1
        });

        self.__listCols = new qxnw.listEdit();
        var cols = [
            {
                caption: "column_name",
                label: self.tr("Nombre")
            },
            {
                caption: "data_type",
                label: self.tr("Tipo")
            },
            {
                caption: "is_nullable",
                label: self.tr("¿Puede estar vacía?")
            },
            {
                caption: "character_maximum_length",
                label: self.tr("Max caracteres")
            },
            {
                caption: "upload_field",
                label: self.tr("Importar campo"),
                editable: true,
                type: "checkBox"
            },
            {
                caption: "associate_column",
                label: self.tr("Columna asociada"),
                type: "html",
                editable: false
            }
        ];
        self.__listCols.setColumns(cols);

        self.__listCols.setColumnWidth(0, 200);
        self.__listCols.setColumnWidth(1, 200);
        self.__listCols.setColumnWidth(5, 200);

//        self.__listCols.table.set({
//            maxHeight: 300
//        });
        self.__listCols.setListEdit();
        self.__listCols.hideFooterTools();
        self.__listCols.hideTools();
        self.insertNavTable(self.__listCols.getBase(), self.tr("Columnas disponibles"));

        self.__listFields = new qxnw.listEdit();
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
        self.__listFields.hideTools();
        self.insertNavTable(self.__listFields.getBase(), self.tr("Líneas a importar"), false, false, true);

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
                name: "spacer",
                type: "spacer",
                label: "",
                column: 0,
                row: 0
            },
            {
                name: "table",
                type: "textField",
                label: self.tr("Tabla seleccionada"),
                column: 1,
                row: 0
            },
            {
                name: "defect_data",
                type: "checkBox",
                label: self.tr("Datos por defecto:"),
                column: 2,
                row: 0,
                toolTip: self.tr("Seleccione si los campos usuario, fecha y empresa se dejan por defecto de esta sesión")
            },
            {
                name: "delimiter",
                type: "selectBox",
                label: self.tr("Delimitar por:"),
                column: 3,
                row: 0,
                toolTip: self.tr("Seleccione el separador de campos de su archivo")
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
                name: "serial",
                type: "checkBox",
                label: self.tr("Serial en campo ID"),
                column: 5,
                row: 0,
                toolTip: self.tr("Puede hacer que el ID de la tabla se ennumere automáticamente")
            },
            {
                name: "column_update",
                type: "selectBox",
                label: self.tr("Actualizar por la columna"),
                column: 6,
                row: 0,
                toolTip: self.tr("En vez de insertar puede actualizar un registro cuando encuentre valores iguales a la columna seleccionada")
            },
            {
                name: "file",
                type: "uploader",
                mode: "destination=tmp",
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
        self.ui.table.setMinWidth(100);
        self.ui.delimiter.setMinWidth(150);
        self.ui.column_update.setMaxWidth(120);
        self.ui.table.setEnabled(false);
        self.ui.serial.setValue(true);
        self.ui.defect_data.setValue(true);
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
            console.log("FILE INFO: ", e.getData());
            self.findColumns(e.getData());
            this.getImage().setMaxHeight(0);
        });

        self.ui.import.addListener("execute", function () {
            self.startImport();
        });

        var data = {};
        data["EXCEL"] = self.tr("<b>Excel 97-2013 (.xls) </b>");
        data["EXCEL_365"] = self.tr("Excel 2007-365 (.xlsx) ");
        data["TAB"] = self.tr("Tabulaciones (r) ");
        data["COMA"] = self.tr("Comas (,) ");
        data["PUNTO_Y_COMA"] = self.tr("Punto y coma (;) ");
        data["ESPACIOS"] = self.tr("Espacios ( )");
        self.ui.delimiter.populateFromArray(data);
        
        self.ui.delimiter.saveUserData("nw_import_delimiter");
        self.ui.defect_data.saveUserData("nw_import_delimiter_defect");
        self.ui.omitir.saveUserData("nw_import_delimiter_omitir");
        self.ui.serial.saveUserData("nw_import_delimiter_serial");
        self.ui.column_update.saveUserData("nw_import_delimiter_column_update");

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
        processDataToList: function processDataToList(rta) {
            var self = this;
            var rf = self.getRecord();
            var records = self.__listCols.getAllData();
            var counter = 0;
            for (var i = 0; i < records.length; i++) {
                records[i].associate_column = "";
                if (typeof rta.cols[counter] == 'undefined') {
                    records[i].upload_field = false;
                    continue;
                }
                if ((rf.serial == "true") && (records[i].column_name == "id")) {
                    continue;
                }
                if ((rf.defect_data == "true") && (records[i].column_name == "empresa" || records[i].column_name == "fecha" || records[i].column_name == "usuario")) {
                    continue;
                }
                if (records[i].data_type == null || records[i].data_type == "") {
                    continue;
                }
                records[i].associate_column = "<b>" + rta.cols[counter] + "</b>";
                counter++;
            }
            self.__listCols.setModelData(records);
            var columns = [];
            var v = {};
            v.caption = "numero";
            v.label = self.tr("Posición");
            columns.push(v);
            for (var i = 0; i < rta.cols.length; i++) {
                var v = {};
                v.caption = rta.cols[i];
                v.label = rta.cols[i];
                columns.push(v);
            }

            v = {};
            v.caption = "importar";
            v.label = self.tr("Importar");
            v.type = "checkBox";
            columns.push(v);

            for (var i = 0; i < rta.rows.length; i++) {
                rta.rows[i]["numero"] = i + 1;
                rta.rows[i]["importar"] = true;
            }

            self.__listFields.setColumns(columns);
            self.__listFields.setModelData(rta.rows);

            self.__listFields.setAutoWidth();
        },
        findColumns: function findColumns(file) {
            var self = this;
            var rpc = new qxnw.rpc(self.getRpcUrl(), "nw_import_data", true);
            var d = {};
            d.file = file;
            d.delimiter = self.ui.delimiter.getValue();
            d.columns = self.__listCols.getAllData().length;
            var func = function (rta) {
                if (rta.cols.length > 99) {
                    qxnw.utils.question(self.tr("El archivo a importar tiene más de 100 columnas. <b>Es posible que el archivo haya sido guardado con columnas vacías</b>, ¿desea continuar?"), function (e) {
                        if (e) {
                            self.processDataToList(rta);
                        }
                    });
                    return;
                }
                self.processDataToList(rta);
            };
            rpc.exec("findFileColumns", d, func);
        },
        startImport: function startImport() {
            var self = this;
            if (!self.validate()) {
                return;
            }
            var f = self.getRecord();
            f.ignoredLines = self.__ignoredLines.join(",");
            f.nw_input_no_export = "";
            var records = self.__listCols.getAllData();
            var recordsArray = self.__listFields.getAllData();

            f.noImportRows = [];
            for (var i = 0; i < recordsArray.length; i++) {
                if (recordsArray[i]["importar"] == "f") {
                    f.noImportRows.push(i + 2);
                }
            }
            f.noImportRows = f.noImportRows.join(",");

            for (var i = 0; i < records.length; i++) {
                if (records[i].upload_field == "f") {
                    f.nw_input_no_export += records[i].column_name;
                    f.nw_input_no_export += ",";
                }
            }
            f.nw_input_no_export = f.nw_input_no_export.substr(0, f.nw_input_no_export.length - 1);
            var rpc = new qxnw.rpc(self.getRpcUrl(), "nw_import_data", true);
            var func = function (rta) {
                if (typeof rta.isError != 'undefined' && rta.isError == true) {
                    self.setError(rta);
                    return;
                }
                self.setFinalOk(rta);
                self.ui.file.clean();
                self.__errors = [];
                self.__ignoredLines = [];
                self.__importedLines = [];
            };
            rpc.exec("importData", f, func);
        },
        setFinalOk: function setFinalOk(rta) {
            var self = this;
            self.__importedLines = self.__importedLines + parseInt(rta["inserted_lines"]);
            var msg = "";
            msg += "<br />";
            msg += "<br />";
            msg += self.tr("<b>Archivo importado satisfactoriamente. En total se insertaron  ");
            msg += self.__importedLines;
            msg += self.tr(" líneas.</b>");
            msg += "<br />";
            msg += "<br />";
            msg += self.tr("<b>Se actualizaron ");
            msg += rta["updated_registers"];
            msg += self.tr(" registros. ");
            msg += "</b>";
            msg += "<br />";
            msg += "<br />";
            msg += self.tr("<b>Archivo importado: ");
            msg += rta["file"];
            msg += "</b>";
            msg += "<br />";
            msg += "<br />";
            var f = new qxnw.forms();
            f.setTitle(self.tr("Informe de importación :: QXNW"));
            f.setModal(true);
            var l = new qx.ui.basic.Label(msg).set({
                rich: true
            });
            f.masterContainer.add(l);
            var nt = new qxnw.lists();
            nt.setMaxShowRows(100000);
            nt.hideFooterTools();
            nt.setUserData("table", "nw_table_fake");
            nt.hideTools();
            var c = self.__listFields.getColumns();
            var captions = self.__listFields.getCaptions();
            var columns = [];
            for (var i = 0; i < c.length; i++) {
                var v = {};
                v["caption"] = captions[i];
                v["label"] = c[i];
                columns.push(v);
            }
            v = {};
            v["caption"] = "error";
            v["label"] = self.tr("Error");
            v["mode"] = "toolTip";
            columns.push(v);
            nt.setColumns(columns);
            var arr = [];
            for (var i = 0; i < self.__errorLines.length; i++) {
                var va = self.__errorLines[i];
                var a = self.__listFields.getRecordByRow(va["line"] - 1);
                a["error"] = va["error"];
                arr.push(a);
            }
            nt.setModelData(arr);
            f.insertNavTable(nt, self.tr("Líneas no importadas"), false, false, true);
            f.maximize();
            f.show();
        },
        setError: function setError(rta) {
            var self = this;
            self.__errors.push(rta);
            for (var i = rta["filaReal"]; i > 0; i--) {
                self.__ignoredLines.push(i);
            }
            var va = {};
            va["line"] = rta["line"];
            va["error"] = rta["error"];
            self.__errorLines.push(va);
            self.__importedLines = self.__importedLines + parseInt(rta["inserted_lines"]);
            var msg = "";
            msg += self.tr("<b>Se han importado ");
            msg += rta["inserted_lines"];
            msg += self.tr(" líneas </b>");
            msg += "<br />";
            msg += self.tr("<b>No se importó el registro en la línea ");
            msg += rta["line"] + "</b>";
            msg += "<br />";
            msg += self.tr("¿Desea continuar sin insertar el registro?");
            var b = qxnw.utils.question(msg, function (e) {
                if (e) {
                    self.startImport();
                } else {
                    qxnw.utils.information(self.tr("Importación cancelada"));
                    self.ui.file.clean();
                    self.__errors = [];
                    self.__ignoredLines = [];
                    self.__importedLines = [];
                }
            }, null, 3);
            var buttonError = new qx.ui.form.Button(qx.locale.Manager.tr("Ver error"), qxnw.config.execIcon("system-run")).set({
                maxWidth: 100,
                alignX: "center"
            });
            buttonError.addListener("execute", function () {
                qxnw.utils.information(rta["error"]);
            });
            b.add(buttonError, {
                row: 1,
                column: 2
            });
        },
        setTable: function setTable(table) {
            var self = this;
            self.ui.table.setValue(table);
            self.ui.table.addListener("keypress", function (e) {
                var key = e.getKeyIdentifier();
                if (key == "Enter") {
                    self.populateTable(this.getValue());
                }
            });
            self.__labelTable.setValue("<font style='color: #20282F;font-size: 2em;'>Estructura tabla " + table + "</font>");
            self.populateTable(table);
        },
        populateTable: function populateTable(table) {
            var self = this;
            var rpc = new qxnw.rpc(self.getRpcUrl(), "master", true);
            var func = function (rta) {
                var data = {};
                data[""] = self.tr("Ninguno");
                for (var i = 0; i < rta.cols.length; i++) {
                    rta.cols[i].upload_field = true;
                    data[rta.cols[i].column_name] = rta.cols[i].column_name;
                }
                self.__listCols.setModelData(rta.cols);
                for (var i = 0; i < rta.cols.length; i++) {
                    if (rta.cols[i].is_nullable == "NO") {
                        self.__listCols.setCellEnabled(4, i, false);
                    }
                }
                self.ui.column_update.populateFromArray(data);
            };
            rpc.exec("getColumns", {table: table}, func);
        }
    }
});