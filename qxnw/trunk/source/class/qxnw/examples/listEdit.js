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
qx.Class.define("qxnw.examples.listEdit", {
    extend: qxnw.listEdit,
    construct: function () {
        this.base(arguments);
        var self = this;
        var columns = [
            {
                label: "ID",
                caption: "id"
            },
            {
                label: self.tr(""),
                caption: 1
            },
            {
                label: "HTML color",
                caption: "html",
                type: "html",
                colorHeader: "#00A3E2",
                tooltipHeader: self.tr("hola andres que pasa"),
                mode: "toolTip"
            },
            {
                label: "Date Time Field",
                caption: "dateTimeField",
                type: "dateTimeField",
                editable: true
            },
            {
                label: "Time Field",
                caption: "textarea_time",
                type: "timeField",
                editable: true
            },
            {
                label: "TextField",
                caption: "textField",
                type: "textField",
                mode: "upperCase",
                editable: true
            },
            {
                label: "Imagen",
                caption: "image",
                type: "uploader",
                editable: true
            },
            {
                label: "moneda",
                caption: "moneda",
                type: "textField",
                mode: "money",
                editable: true
            },
            {
                label: "REPETIDA",
                caption: "moneda_repetida",
                type: "textField",
                editable: true,
                mode: "money"
            },
//            {
//                label: "Fecha",
//                caption: "fecha_test",
//                type: "dateTimeField",
//                editable: true,
//                required: true
//            },
            {
                label: "Visible",
                caption: "visible",
                type: "checkBox",
                editable: true,
                tooltipHeader: self.tr("test header tool tip")
            },
            {
                label: "Check",
                caption: "visible_alter",
                type: "checkBox",
                editable: true,
                tooltipHeader: self.tr("test header tool tip")
            },
            {
                label: "selectTokenField test",
                caption: "select_token_field",
                type: "selectTokenField",
                editable: true,
                method: "master.test_security",
                hiddenColumns: "id"
            },
            {
                label: "selectBox",
                caption: "select_box",
                type: "selectBox",
                method: "master.populate.ciudades.departamento",
                editable: true
            },
            {
                label: "TextField Money",
                caption: "text_field",
                type: "textField",
                editable: true,
                search: true
            },
            {
                label: "uploader",
                caption: "uploader",
                type: "money",
                editable: true
            }
        ];
        self.setColumns(columns);

        var semaphore = [
            {
                color: "red",
                comment: "Test",
                condition: "==",
                column: "id",
                label: "ID",
                type: "Por fila", // "Sólo letra"
                value: "64"
            }
        ];
        self.addRenderColors(semaphore);

//        self.setCellEnabled(3, 0, false);

//        self.setColumnSelectboxMethod(9, 2, "master.populate.usuarios");
//
//        self.setSelectboxWhere(9, 2, "usuario='andresf'");
//
//        self.setColumnTypeAlter(9, 3, "textField");

        var filters = [
            {
                name: "buscar",
                caption: "buscar",
                label: "N° caso",
                type: "textField",
                mode: "integer"
            },
            {
                name: "selectoken",
                label: "Select token",
                type: "selectTokenField"
            },
            {
                name: "fecha_inicial",
                caption: "Fecha inicial",
                label: "Fecha inicial",
                type: "dateField",
                required: true
            },
            {
                name: "fecha_final",
                caption: "Fecha final",
                label: "Fecha final",
                type: "dateField",
                required: true
            }
        ];
        self.createFilters(filters);

        self.table.addListener("inputTextField", function (e) {
            console.log({
                event: "inputTextField",
                data: e.getData()
            });
        });

        self.table.addListener("cellCheckbox", function (e) {
            console.log({
                event: "cellCheckbox",
                data: e.getData()
            });
        });

//        self.setEnableAll(false);

//        self.setVerticalBehavior(true);

        self.table.addListener("setModelDataSTF", function (e) {
            console.log(e.getData());
        });

//        qxnw.config.setShowInformationOnValidate(true);

        self.setListEdit();

//        self.excludeColumn("id");

//        self.table.blockHeaderElements();

        //self.table.setRowHeight(50);

//        self.setCellEnabled(1, 1, false);

//        self.setEnableAll(false);

        self.table.addListener("editCell", function () {
            var d = self.getAllData(false);
            console.log(d);
        });

        self.ui.newButton.addListener("execute", function () {

            self.removeAllRows();
            return;

            var d = {};
            d["id"] = 55;

            self.addRows([d]);
            return;

            self.setColumnLabelByName("uploader", "JASON");
            return;

            console.log(self.getRecord());

            var sl = self.selectedRecord();
            console.log(sl);
            return;

            self.addEmptyRow();
            //self.setCellEnabled(1, 1, true);
            //self.setCellEnabled(2, 3, false);
            //self.table.setFocusedCell(3, 0);
            //self.setCellEnabled(1, 1, true);
            //self.setCellEnabled(1, 3, false);
        });
        self.ui.updateButton.addListener("execute", function () {

            self.applyFilters();
            return;

            if (!self.validate()) {
                qxnw.utils.information("Debe llenar los campos obligatorios");
            }
            console.log(self.getAllData());
            return;

            var loading = new qxnw.widgets.loading("holaaaaaa", null, true, true);
            loading.createCancelButton();
            return;

            var cancelButton = new qx.ui.form.Button("Cancelar", qxnw.config.execIcon("list-remove")).set({
                gap: 1,
                cursor: "pointer"
            });
            cancelButton.getChildControl("label").set({
                alignX: "center"
            });
            cancelButton.getChildControl("icon").set({
                alignX: "center"
            });
            cancelButton.setZIndex(100000000);
            cancelButton.rpc = null;
            cancelButton.getRpc = function () {
                return this.rpc;
            };
            cancelButton.setAppearance("label");
            cancelButton.setRpc = function (rpc) {
                this.rpc = rpc;
            };
            cancelButton.setRpc(self.rpc);
            cancelButton.addListener("execute", function () {
                if (typeof this.rpc != 'undefined') {
                    this.rpc.abort(self.__call);
                    qxnw.utils.stopLoading();
                    self.cancelAll();
                }
            });
            var wid = loading.getLayout().getCellWidget(2, 0);
            if (wid != null) {
                wid.destroy();
            }
            var cont = new qx.ui.container.Composite(new qx.ui.layout.HBox());
            cont.add(new qx.ui.core.Spacer().set({
                width: 5
            }), {
                flex: 0
            });
            cont.add(cancelButton, {
                flex: 1
            });
            loading.add(cont, {
                column: 0,
                row: 2
            });
            return;

            self.applyFilters();
            return;

//            self.removeSelectedRow();
//            self.applyFilters();
            if (!self.validateData()) {
//                qxnw.utils.information("no se puede!!");
            }
        });
        self.ui.editButton.setLabel("Guardar");
        self.ui.editButton.addListener("execute", function () {
            self.save();
        });
        self.ui.deleteButton.addListener("execute", function () {
//            self.removeSelectedRow();
            self.applyFilters();
//            self.testUnknownBehavior();
        });
        self.applyFilters();

//        self.ui.newButton.setVisibility("excluded");
//        self.ui.editButton.setVisibility("excluded");
        self.ui.unSelectButton.setVisibility("excluded");
//        self.ui.exportButton.setVisibility("excluded");
        self.ui.printButton.setVisibility("excluded");
        self.ui.emailButton.setVisibility("excluded");
//        self.ui.dynamicTableButton.setVisibility("excluded");

//        this.table.getPaneScroller(0).getTablePane().activate();
//        self.setFocusCell(0, 0);
    },
    members: {
        testUnknownBehavior: function testUnknownBehavior() {
            var self = this;
            var sl = self.getAllRecords();
            console.log(sl);
            var rpc = new qxnw.rpc(self.getRpcUrl(), "master");
            rpc.setAsync(true);
            var func = function (r) {
                self.setModelData(r);
            };
            var dt = {};
            dt.cleanAll = true;
            rpc.exec("testListEdit", dt, func);
        },
        applyFilters: function applyFilters() {
            var self = this;
            var data = {};
            data.filters = self.getFiltersData();
            var rpc = new qxnw.rpc(qxnw.userPolicies.getRpcUrl(), "master");
            rpc.setAsync(true);
            var func = function (r) {
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
            console.log(data);
            var rpc = new qxnw.rpc(qxnw.userPolicies.getRpcUrl(), "master", true);
            var func = function (e) {
                self.applyFilters();
            };
            rpc.exec("saveListEdit", data, func);
        }
    }
});