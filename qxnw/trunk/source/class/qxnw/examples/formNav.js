/* ************************************************************************
 
 Copyright:
 2013 Netwoods.net, http://www.netwoods.net
 
 License:
 LGPL: http://www.gnu.org/licenses/lgpl.html
 EPL: http://www.eclipse.org/org/documents/epl-v10.php
 See the LICENSE file in the project's top-level directory for details.
 
 Authors:
 * Andrés Flórez (andresf)
 
 ************************************************************************ */
qx.Class.define("qxnw.examples.formNav", {
    extend: qxnw.forms,
    construct: function construct() {
        this.base(arguments);
        var self = this;
        var fields = [
            {
                name: "select",
                type: "selectBox",
                label: "Selectbox"
            },
            {
                name: "producto",
                type: "textField",
                label: "TextField"
            },
//            {
//                name: "address",
//                type: "address",
//                label: "Address Widget"
//            },
            {
                name: "date",
                type: "dateField",
                label: "Date"
            },
//            {
//                name: "color",
//                type: "colorButton",
//                label: "Color"
//            },
            {
                name: "numeric",
                mode: "md5",
                type: "textField",
                label: "Numeric",
                required: true
            },
            {
                name: "timeField",
                type: "timeField",
                label: "Timefield"
            },
            {
                name: "dateFieldTime",
                type: "dateTimeField",
                label: "Datefield Time",
                required: true
            },
            {
                name: "uploader_multiple",
                type: "uploader_multiple",
                label: "Uploader múltiple",
                mode: "rename"
            },
            {
                name: "test",
                type: "selectListCheck",
                label: "text",
                toolTip: "prueba de tooltip!"
            },
            {
                name: "test_token",
                type: "selectTokenField",
                label: "Select Token Field"
            }
        ];
        self.setFields(fields);

        self.ui.select.populate("master", "populate", {table: "usuarios"});

//        self.ui.camera.setValue("http://ek.loc/imagenes/andres.jpg");
//        self.ui.camera.setValue("TEST");
        //f.ui.ciudad.setEnabled(false);
//        self.ui.dateFieldTime.setRequired(true);
        //f.ui.uploader_multiple.setEnabled(false);
        //qxnw.utils.populateSelectAsync(f.ui.select, "master", "populate", {table: "ciudades"});
//        self.ui.money.addListener("focusout", function () {
//            console.log("out!");
//        });
//        var data = [];
//        data["nombre"] = "test";
//        data["id"] = "test";
//        self.ui.test.addToken(data);
//        var d = [];
//        d["nombre"] = "dertd";
//        d["id"] = "dertd";
//        self.ui.test.addToken(d);
//        self.ui.test_token.addListener("loadData", function (e) {
//            var data = {};
//            data["token"] = e.getData();
//            var rpc = new qxnw.rpc(self.getRpcUrl(), "ciudades", true);
//            rpc.setAsync(true);
//            var func = function (r) {
//                f.ui.test_token.setModelData(r);
//            };
//            rpc.exec("populateTokenCiudades", data, func);
//        }, this);
//        var data = {};
//        data["table"] = "usuarios";
//        self.ui.test.populate("master", "populate", data);
//        self.show();

        self.ui.accept.addListener("execute", function () {

            self.nav.removeAllRowsNoModel();
            return;

            self.showTabView(1);
            return;

            var r = self.nav.getAllData();
            console.log(r);
            return;

            self.ui.select.removeItemByIndex(2);

            console.log("alert!");
            return;

            self.destroyNavTable(0);

            return;

            if (!self.validate()) {
                return;
            }

            console.log(self.getNumberOfNavtables());

            //console.log(self.getRecord());
            return;

            qxnw.utils.loading("test...");
            return;
            var r = self.nav.getAllData();
            console.log(r);
            return;
            self.clean();
        });
        self.ui.cancel.addListener("execute", function () {

            self.showTabView(0);
            return;

            self.reject();
        });

        var nav = new qxnw.navtable(self, true);

        nav.setEnableAll(true);

        nav.setShowFooterCalculate(true);

        self.nav = nav;
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

        nav.addInformation("test");

//        nav.ui.addButton.addListener("execute", function () {
//            console.log(nav.getAllData());
//            console.log(self.getNumberOfNavtables());
//            //nav.populate("master", "testListEdit");
//        });
        nav.ui.removeButton.addListener("execute", function () {
//            nav.removeAllRows();
            nav.removeSelectedRow();
        });
//        nav.populate("master", "testListEdit");
//        self.addListener("NWClickTabView", function (e) {
//            console.log(e.getData());
//        });
        nav.populate("master", "testListEdit");
//        nav.setEnableAll(false);

        var desktop = self.insertNavTable(nav.getBase(), "ALTER", false, 0, 0, 0, qxnw.config.execIcon("document-revert"));
        var page = desktop.getUserData("nw_associate_page");
        page.getChildControl("button").setBackgroundColor("red");
        return;

        self.navTableCodo = new qxnw.navtable(self, false);
//        var closeTimeOut = new qx.event.Timer(5000);
//        closeTimeOut.start();
//        closeTimeOut.addListener("interval", function (e) {
//            console.log("entra!");
//            this.stop();
//            qx.bom.element.Transform.rotate(self.navTableCodo.getBase().getContentElement().getDomElement(), "90deg");
//            qxnw.animation.startEffect("vertical", self.navTableCodo.getBase());
//        });

        var columns = [
            {
                label: self.tr("Id"),
                caption: "id"
            },
            {
                label: self.tr("<strong style='margin-left: 30px;'>Movimiento</strong>"),
                caption: "movimiento",
                type: "textField"

            },
            {
                label: self.tr("<strong style='margin-left: 9px;'>Movilidad</strong>"),
                caption: "movilidad_articular_derecho",
                method: "array.NORMAL:ANORMAL",
                type: "selectBox",
                colorHeader: "#4FA800",
                width: 200,
                editable: false
            },
            {
                label: self.tr("&nbsp;&nbsp;<strong>Articular (RM)</strong>"),
                caption: "movilidad_articular_derecho_desco",
                type: "textField",
                enabled: false,
                required: true,
                colorHeader: "#4FA800",
                width: 200,
                editable: false
            },
            {
                label: self.tr("<strong style='margin-left: 2px;'>Fuerza Muscular</strong>"),
                caption: "fuerza_muscular_derecho",
                method: "soandes_fuerza_muscular",
                type: "selectBox",
                width: 200,
                editable: false
            },
            {
                label: self.tr("<strong style='margin-left: 9px;'>Movilidad</strong>"),
                caption: "movilidad_articular_izquierdo",
                method: "array.NORMAL:ANORMAL",
                colorHeader: "#4FA800",
                type: "selectBox",
                width: 200,
                editable: false
            },
            {
                label: self.tr("&nbsp;&nbsp;<strong>Articular (RM)</strong>"),
                caption: "movilidad_articular_izquierdo_desco",
                colorHeader: "#4FA800",
                required: true,
                type: "textField",
                enabled: false,
                width: 200,
                editable: false
            },
            {
                label: self.tr("<strong style='margin-left: 2px;'>Fuerza Muscular</strong>"),
                caption: "fuerza_muscular_izquierdo",
                method: "soandes_fuerza_muscular",
                type: "selectBox",
                width: 200,
                editable: false

            }];
        self.navTableCodo.setColumns(columns);

        self.navTableCodo.excludeColumn("id");
        self.navTableCodo.excludeColumn("movilidad_articular_derecho");

//        self.navTableCodo.setListEdit();
//        self.navTableCodo.ui.toolsButton.setVisibility("excluded");
//        self.navTableCodo.hideFooterTools();
//        self.navTableCodo.hideTools();
        self.navTableCodo.table.setMaxHeight(150);
//        self.navTableCodo.setMaxWidth(740);

//        self.navTableCodo.setVerticalBehavior(true);

//        self.slotMovimientosCodo();
        //        self.addBeforeGroup("codo", self.navTableCodo.getBase());
        self.navTableCodo.table.getTableColumnModel().setColumnWidth(1, 140);
        self.navTableCodo.table.getTableColumnModel().setColumnWidth(2, 80);
        self.navTableCodo.table.getTableColumnModel().setColumnWidth(3, 160);
        self.navTableCodo.table.getTableColumnModel().setColumnWidth(4, 80);
        self.navTableCodo.table.getTableColumnModel().setColumnWidth(5, 80);
        self.navTableCodo.table.getTableColumnModel().setColumnWidth(6, 160);
        self.navTableCodo.table.getTableColumnModel().setColumnWidth(7, 80);

        self.navTableCodo.setShowFooterCalculate(false);
        //        self.addBeforeGroup("codo", self.ui.otros_codo.getLayoutParent());
//        self.navTableCodo.setColumnVisibilityButtonVisible(false);
//        self.navTableCodo.table.blockHeaderElements();
        self.insertNavTable(self.navTableCodo.getBase(), "NavTable", false, 0, 0, 0, qxnw.config.execIcon("document-revert"));

        self.navTableCodo.table.addListener("dataEdited", function (d) {
            var dat = d.getData();
            self.navTableCodo.table.cancelEditing();
//            soandes.utils.validaNormalidad(self, "navTableCodo", "otros_codo");
            var dat = d.getData();
            var value = null;
            if (dat.type == "selectBox") {
                value = dat.value.text;
            } else {
                value = dat.value.text;
            }
            var col = dat.col;
            var row = dat.row;
            var val = "";
            switch (row) {
                case 0:
                    val = "0°-150°";
                    break;
                case 1:
                    val = "150°-0°";
                    break;
                case 2:
                    val = "0°-80°";
                    break;
                case 3:
                    val = "0°-80°";
                    break;
                case 4:
                    val = "SIN HALLAZGOS";
                    break;
            }
            switch (col) {
                case 2:
                    if (value == "NORMAL") {
                        self.navTableCodo.setCellEnabled(3, row, false);
                        self.navTableCodo.setCellValue(3, row, val);
                    } else if (value == "ANORMAL") {
                        var val = "";
                        self.navTableCodo.setCellEnabled(3, row, true);
                        self.navTableCodo.setCellValue(3, row, val);
                    }
                    break;
                case 5:
                    if (value == "NORMAL") {
//                        var val = "SIN HALLAZGOS";
                        self.navTableCodo.setCellEnabled(6, row, false);
                        self.navTableCodo.setCellValue(6, row, val);
                    }
                    if (value == "ANORMAL") {
                        var val = "";
                        self.navTableCodo.setCellEnabled(6, row, true);
                        self.navTableCodo.setCellValue(6, row, val);
                        if (self.navTableCodo.table.isEditing()) {
                            self.navTableCodo.table.stopEditing();
                        }
                        self.navTableCodo.table.setFocusedCell(6, row);
                        if (!self.navTableCodo.table.isEditing()) {
                            self.navTableCodo.table.startEditing();
                        }
                    }
                    break;
                default:
                    self.navTableCodo.table.cancelEditing();
                    if (self.navTableCodo.table.isEditing()) {
                        self.navTableCodo.table.startEditing();
                    }
                    break;
            }
        });

//        self.navTableHombro.table.addListener("cellTap", function (e) {
//            var col = e.getColumn();
//            var row = self.navTableHombro.getFocusedRow();
//            var r = self.navTableHombro.selectedRecord();
//            switch (col) {
//                case 2:
//                    if (r.movilidad_articular_derecho.name == "NORMAL") {
//                        var val = "SIN HALLAZGOS";
//                        self.navTableHombro.setCellEnabled(3, row, false);
//                        self.navTableHombro.setCellValue(3, row, val);
//                        self.navTableHombro.flushEditor();
//                        if (self.navTableHombro.table.isEditing()) {
//                            self.navTableHombro.table.stopEditing();
//                        }
//                    }
//                    if (r.movilidad_articular_derecho.name == "ANORMAL") {
//                        var val = "";
//                        self.navTableHombro.setCellEnabled(3, row, true);
//                        self.navTableHombro.setFocusCell(3, row);
//                        self.navTableHombro.setCellValue(3, row, val);
//                        self.navTableHombro.flushEditor();
//
//                    }
//                    break;
//
//                case 5:
//                    if (r.movilidad_articular_izquierdo.name == "NORMAL") {
//                        var val = "SIN HALLAZGOS";
//                        self.navTableHombro.setCellEnabled(6, row, false);
//                        self.navTableHombro.setCellValue(6, row, val);
//                        self.navTableHombro.flushEditor();
//                        if (self.navTableHombro.table.isEditing()) {
//                            self.navTableHombro.table.stopEditing();
//                        }
//                    }
//                    if (r.movilidad_articular_izquierdo.name == "ANORMAL") {
//                        var val = "";
//                        self.navTableHombro.setCellEnabled(6, row, true);
//                        self.navTableHombro.setFocusCell(6, row);
//                        self.navTableHombro.setCellValue(6, row, val);
//                        self.navTableHombro.flushEditor();
//                    }
//                    break;
//            }
//        });

//        var pr = {};
//        var rpc = new qxnw.rpc(self.getRpcUrl(), "historia_clinica");
//        rpc.setAsync(true);
//        var func = function (r) {
//            for (var i = 0; i < r.length; i++) {
//                var l = r[i];
//                l.movilidad_articular_derecho_desc = "SIN HALLAZGOS";
//                l.movilidad_articular_izquierdo_desc = "SIN HALLAZGOS";
//                l.movilidad_articular_derecho = 1;
//                l.nom_movilidad_articular_derecho = "NORMAL";
//                l.movilidad_articular_izquierdo = 1;
//                l.nom_movilidad_articular_izquierdo = "NORMAL";
//                l.fuerza_muscular_derecho = 5;
//                l.nom_fuerza_muscular_derecho = "4/5";
//                l.fuerza_muscular_izquierdo = 5;
//                l.nom_fuerza_muscular_izquierdo = "4/5";
//            }
//            self.navTableHombro.setModelData(r);
//        };
//        rpc.exec("consultaMovimientos", pr, func);
//        return;

//        var nav = new qxnw.listEdit(self);
//        var nav = new qxnw.lists();


        var navt = new qxnw.navtable(self, true);
        self.navt = navt;
        var col = [
            {
                label: "ID",
                caption: "id"
            },
            {
                label: "Usuario",
                caption: "usuario"
            }
        ];
        navt.setColumns(col);
        navt.populate("master", "populate", {table: "usuarios"});
        navt.ui.addButton.addListener("execute", function () {
            var sheets = [];
            var r1 = nav.getAllData();
            var r2 = navt.getAllData();
            sheets.push(r1);
            sheets.push(r2);
            var r = {};
            r["records"] = sheets;
            if (r["records"].length == 0) {
                qxnw.utils.information(self.tr("No hay registros para exportar"));
                return;
            }
            r["part"] = "NavTable";
            var func = function (data) {
                try {
                    if (typeof data.id != 'undefined') {
                        if (data.id != "") {
                            if (data.id != null) {
                                if (typeof data.id != 'undefined') {
                                    if (typeof data.id != "") {
                                        if (typeof data.id != null) {
                                            if (qx.core.Environment.get("browser.name") == "ie") {
                                                main.isClosedApp = true;
                                                window.open(window.location + "/nwlib" + qxnw.userPolicies.getNwlibVersion() + "/downloader.php?id=" + data.id + "&key=" + data.key, "ExportDataIE", "width=200, height=100");
                                            } else {
                                                main.isClosedApp = true;
                                                window.location.href = "/nwlib" + qxnw.userPolicies.getNwlibVersion() + "/downloader.php?id=" + data.id + "&key=" + data.key;
                                            }
                                            return;
                                        }
                                    }
                                }
                            }
                        }
                    }
                } catch (e) {
                    qxnw.utils.error(e);
                }
            };
            console.log(r);
            qxnw.utils.fastAsyncRpcCall("exportExcel", "exportPHPExcelSimple", r, func);
        });
        self.addNewWidget(navt.getBase(), "New widget", true, false, "subNav");

        var navta = new qxnw.navtable(self, true);
        self.navta = navta;
        var col = [
            {
                label: "LANY",
                caption: "id"
            }
        ];
        navta.setColumns(col);
        self.addNewWidget(navta.getBase(), "New side widget", true, false, "subNav");

        var navtab = new qxnw.navtable(self, true);
        self.navtab = navtab;
        var col = [
            {
                label: "OK",
                caption: "id"
            }
        ];
        navtab.setColumns(col);
        self.addNewWidget(navtab.getBase(), "New side side", true, false, "other");
    },
    members: {
        slotMovimientosCodo: function slotMovimientosCodo() {
            var self = this;
            var pr = {};
            var rpc = new qxnw.rpc(self.getRpcUrl(), "historia_clinica");
            rpc.setAsync(true);
            var func = function (r) {
                var valor = "";
                for (var i = 0; i < r.length; i++) {
                    switch (i) {
                        case 0:
                            valor = "0°-150°";
                            break;
                        case 1:
                            valor = "150°-0°";
                            break;
                        case 2:
                            valor = "0°-80°";
                            break;
                        case 3:
                            valor = "0°-80°";
                            break;
                        case 4:
                            valor = "SIN HALLAZGOS";
                            break;
                    }
                    var l = r[i];
                    l.movilidad_articular_derecho_desco = valor;
                    l.movilidad_articular_izquierdo_desco = valor;
                    l.movilidad_articular_derecho = 1;
                    l.nom_movilidad_articular_derecho = "NORMAL";
                    l.movilidad_articular_izquierdo = 1;
                    l.nom_movilidad_articular_izquierdo = "NORMAL";
                    l.fuerza_muscular_derecho = 5;
                    l.nom_fuerza_muscular_derecho = "4/5";
                    l.fuerza_muscular_izquierdo = 5;
                    l.nom_fuerza_muscular_izquierdo = "4/5";
                }
                self.navTableCodo.setModelData(r);
            };
            rpc.exec("consultaMovimientosCodo", pr, func);
        }
    }
});