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

/**
 * TextField with table
 */
qx.Class.define("qxnw.examples.list", {
    extend: qxnw.lists,
    construct: function () {
        this.base(arguments);
        var self = this;
        var columns = [
            {
                label: "Timestamp",
                caption: "fecha",
                type: "dateTimeField",
                editable: true,
                required: true
            },
            {
                label: "ID",
                caption: "id"
            },
            {
                label: "Money í ó ñ",
                caption: "money",
                type: "money",
                colorHeader: "#F7FE2E",
                sortable: true
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
                caption: 'acepto <a href="/imagenes/politicas_tratamiento_de_datos_personales_red_de_arboles_2022.pdf" target="_blank" style="color: #30ba45; margin: 0px 0px 0px 5px;">  políticas de privacidad  de datos </a>',
                label: 'acepto <a href="/imagenes/politicas_tratamiento_de_datos_personales_red_de_arboles_2022.pdf" target="_blank" style="color: #30ba45; margin: 0px 0px 0px 5px;">  políticas de privacidad  de datos </a>',
                type: "html"
            },
            {
                label: "HTML",
                caption: "html",
                type: "html"
            },
//            {
//                label: "Imagen",
//                caption: "imagen",
//                type: "image",
//                mode: "expand"
//            },
            {
                label: self.tr("Imagen Guia Firmada"),
                caption: "text_field",
                type: "image",
                mode: "phpthumb.expand"
            },
//            {
//                label: "TextField",
//                caption: "text_field",
//                type: "textField",
//                editable: true,
//                search: true,
//                colorHeader: "blue"
//            },
            {
                label: "Date",
                caption: "fecha_test",
                type: "dateField",
                editable: true,
                required: true
            },
            {
                label: "Visible",
                caption: "visible",
                type: "checkBox",
                editable: true,
                colorHeader: "green"
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

        self.setColumns(columns);

        //self.setMaxHeight(350);
        var filters = [
            {
                name: "buscar",
                caption: "buscar",
                label: "N° caso",
                type: "textField"
            },
            {
                name: "select",
                caption: "select",
                label: "Select",
                type: "selectBox"
            },
            {
                name: "fecha_inicial",
                caption: "fecha_inicial",
                label: "Fecha inicial",
                type: "dateField"
            },
            {
                name: "fecha_final",
                caption: "fecha_final",
                label: "Fecha final",
                type: "dateField"
            },
            {
                name: "fecha_time",
                caption: "fecha_time",
                label: "Fecha time",
                type: "dateTimeField"
            },
            {
                name: "slch",
                caption: "slch",
                label: "SLCH",
                type: "selectListCheck"
            }
        ];
        self.createFilters(filters);

        var rpc = new qxnw.rpc(self.getRpcUrl(), "clientes_prospecto");
        rpc.setAsync(true);
        var func = function (ans) {
            for (var i = 0; i < ans.length; i++) {
                var r = ans[i];
                var estado = {
                    id: r.id,
                    nombre: r.nombre
                };
                self.ui.slch.addToken(estado);
            }
        };
        rpc.exec("populateEstadosDescartados", null, func);

        self.setRequired("buscar", true);

        self.ui.newButton.addListener("execute", function () {

            var sl = self.selectedRecord();
            console.log(sl);
            return;

            var data = {};
            data["id"] = 1;
            data["money"] = 123000;
            data["ciudad"] = 5;
            self.addRows([data]);
            return;

            self.removeAllRows();
            return;
            self.addEmptyRow();
            //self.setCellEnabled(1, 1, true);
            //self.setCellEnabled(2, 3, false);
            //self.table.setFocusedCell(3, 0);
            //self.setCellEnabled(1, 1, true);
            //self.setCellEnabled(1, 3, false);
        });
        self.addListener("headerColInput", function (e) {
            var data = e.getData();
            var text = self.getHeaderColumnSearchByColId(data["col"]);
            //text.setValue("");
            //self.table.cleanFiltersOnList();
        });
        self.addListener("headerColKeyPress", function (e) {
            var data = e.getData();
            var text = self.getHeaderColumnSearchByColId(data["col"]);
            //var text = self.getHeaderColumnSearchByColName(data["col"]);
            //text.setValue("");
            //self.table.cleanFiltersOnList();
        });
        self.ui.updateButton.addListener("execute", function () {
            var f = self.getFiltersData();
            console.log("filters", f);
            return;
//            if (!self.validate()) {
//                return;
//            }
            self.applyFilters();
        });
        self.ui.editButton.addListener("execute", function () {

            var d = new qxnw.lists();
            d.setTableMethod("master");
            d.createFromTable("nw_list_edit");
            d.setAllPermissions(true);
            d.show();
            return;

            var records = self.getAllRecords();
            return;
            self.save();
        });

        var data = {};
        data["init"] = "init";
        data["two"] = "two";
        data["tree"] = "tree";
        qxnw.utils.populateSelectFromArray(self.ui.select, data);

        return;

        var functions = [
            {
                column_name: "MES_OTRO", //label
                function_num: 1, //counter de función
                type: "EXTRAER_MES", // ver tipos de funciones en el módulo
                columns: [
                    {
                        columna: "date"
                    }
                ]
            }
        ];
        qxnw.local.storeData(self.getAppWidgetName() + "_functions", functions);

        var semaphore = [
            {
                color: "red",
                comment: "Test",
                condition: "==",
                column: "pais",
                label: "Pais",
                type: "Por fila", // "Sólo letra"
                value: "Colombia"
            }
        ];
        self.addRenderColors(semaphore);
//        qxnw.local.storeData(self.getAppWidgetName() + "_colors", semaphore);

        self.ui.deleteButton.addListener("execute", function () {
            self.removeSelectedRow();
        });

        var render = new qxnw.rowRenderer();
        render.setHandleData(4, "ciudad", "aquamarine");
//        self.table.setDataRowRenderer(render);

//        self.applyFilters();
//        self.execPermissions();
        self.setAllPermissions(true);
        self.execSettings();

//        self.table.setStatusBarVisible(false);

//        self.hideFooterColumnStill();
//        self.hideFooterCalculate();
//        self.hideFooterUpdateBySecs();

        self.excludeColumn("ciudad");
    },
    members: {
        contextMenu: function contextMenu(pos) {
            var self = this;
            var m = new qxnw.contextmenu(this);
            var sl = self.getSelectedRecord();
            if (typeof sl != 'undefined') {
                m.addAction("Eliminar", "icon/16/actions/document-properties.png", function (e) {
                    self.removeSelectedRow();
                });
            }
            m.exec(pos);
        },
        applyFilters: function applyFilters() {
            var self = this;
            var data = {};
            data.filters = self.getFiltersData();
            var rpc = new qxnw.rpc(qxnw.userPolicies.getRpcUrl(), "master");
            rpc.setAsync(true);
            var func = function (r) {
                for (var i = 0; i < r.records.length; i++) {
                    r["records"][i]["html"] = "<b>hola</b>";
                }
                self.setModelData(r);
            };
            rpc.exec("testListEdit", data, func);
        },
        save: function save() {
            var self = this;
            if (!self.validate()) {
                return;
            }
            var data = self.getAllData();
            var rpc = new qxnw.rpc(qxnw.userPolicies.getRpcUrl(), "master", true);
            var func = function (e) {

            };
            rpc.exec("saveListEdit", data, func);
        }
    }
});