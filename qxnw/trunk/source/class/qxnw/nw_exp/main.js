qx.Class.define("qxnw.nw_exp.main", {
    extend: qxnw.forms,
    construct: function () {
        this.base(arguments);
        var self = this;
        self.setTitle(self.tr("QXNW :: Exportación de datos dinámica"));
        self.startInterface();
        self.createDeffectButtons();
        self.ui.accept.setVisibility("excluded");
        self.ui.cancel.setLabel(self.tr("Salir"));
        self.ui.cancel.addListener("execute", function () {
            self.close();
        });
    },
    destruct: function () {
    },
    members: {
        ntFilters: null,
        code: null,
        mainSelect: null,
        containercamposDisponibles: null,
        subList: null,
        startInterface: function startInterface() {
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
                    self.populateAll();
                });
            });
            qxnw.utils.populateSelect(self.ui.mainSelect, "nw_exp", "getMain");
            part.add(selectMainButton);

            var deleteExp = new qx.ui.form.Button(self.tr("Eliminar"), qxnw.config.execIcon("edit-delete"));
            deleteExp.addListener("execute", function () {
                qxnw.utils.question(self.tr("Está segur@ de eliminar la interfaz?"), function (d) {
                    if (d) {
                        self.deleteExp();
                    }
                });
            });
            part.add(deleteExp);

            var editExp = new qx.ui.form.Button(self.tr("Editar"), qxnw.config.execIcon("document-revert"));
            editExp.addListener("execute", function () {
                self.editExp();
            });
            part.add(editExp);

            var addExp = new qx.ui.form.Button(self.tr("Nuevo listado"), qxnw.config.execIcon("mail-message-new"));
            addExp.addListener("execute", function () {
                self.addExp();
            });
            part.add(addExp);

            var updateExp = new qx.ui.form.Button(self.tr("Actualizar"), qxnw.config.execIcon("view-refresh"));
            updateExp.addListener("execute", function () {
                self.populateAll();
            });
            part.add(updateExp);

            var addTable = new qx.ui.form.Button(self.tr("Agregar tabla"), qxnw.config.execIcon("list-add"));
            addTable.addListener("execute", function () {
                self.addTable();
            });
            part.add(addTable);

            var addField = new qx.ui.form.Button(self.tr("Agregar campo"), qxnw.config.execIcon("window-new"));
            addField.addListener("execute", function () {
                self.addField();
            });
            part.add(addField);
            var addFieldCondi = new qx.ui.form.Button(self.tr("Agregar campo CONDICIONAL"), qxnw.config.execIcon("format-text-direction-ltr"));
            addFieldCondi.addListener("execute", function () {
                self.addFieldCondi();
            });
            part.add(addFieldCondi);

            var addFilter = new qx.ui.form.Button(self.tr("Agregar filtro"), qxnw.config.execIcon("edit-find"));
            addFilter.addListener("execute", function () {
                self.addFilter();
            });
            part.add(addFilter);

            var hideFields = new qx.ui.form.Button(self.tr("Ocultar campos"), qxnw.config.execIcon("go-up"));
            hideFields.setUserData("nw_hide_up_container", false);
            hideFields.addListener("execute", function () {
                var isHidden = this.getUserData("nw_hide_up_container");
                if (isHidden === false) {
                    self.upContainer.setVisibility("excluded");
                    this.setLabel(self.tr("Mostrar campos"));
                    this.setIcon(qxnw.config.execIcon("go-down"));
                    this.setUserData("nw_hide_up_container", true);
                    qxnw.local.setData("nw_hide_up_container", true);
                } else {
                    self.upContainer.setVisibility("visible");
                    this.setLabel(self.tr("Ocultar campos"));
                    this.setIcon(qxnw.config.execIcon("go-up"));
                    this.setUserData("nw_hide_up_container", false);
                    qxnw.local.setData("nw_hide_up_container", false);
                }
            });
            part.add(hideFields);

            var cleanButton = new qx.ui.form.Button(self.tr("Limpiar"), qxnw.config.execIcon("edit-clear"));
            cleanButton.addListener("execute", function () {
                self.cleanAllFields();
            });
//            part.add(cleanButton);

            part.add(new qx.ui.toolbar.Separator());
            var helpButton = new qx.ui.form.Button(self.tr("Ayuda"), qxnw.config.execIcon("help-contents"));
            helpButton.addListener("execute", function () {
                self.openHelp();
            });
//            part.add(helpButton);

            self.masterContainer.add(toolBar, {
                flex: 0
            });

            var container = new qx.ui.container.Composite(new qx.ui.layout.HBox()).set({
                marginTop: 20,
                alignX: "center",
                alignY: "middle"
            });
            self.upContainer = container;
            self.masterContainer.add(container, {
                flex: 1
            });

            var uphf = qxnw.local.getData("nw_hide_up_container");
            if (uphf != null) {
                if (uphf == true) {
                    self.upContainer.setVisibility("excluded");
                    hideFields.setLabel(self.tr("Mostrar campos"));
                    hideFields.setIcon(qxnw.config.execIcon("go-down"));
                    hideFields.setUserData("nw_hide_up_container", true);
                }
            }

            var containercamposDisponibles = new qx.ui.container.Composite(new qx.ui.layout.VBox());
            self.containercamposDisponibles = containercamposDisponibles;

            self.createUpDownButtons();

            var lbla = new qx.ui.basic.Label(self.tr("Campos:"));
            containercamposDisponibles.add(lbla);
            var camposDisponiblesList = new qxnw.widgets.list().set({
                maxHeight: 330
            });
            self.camposDisponiblesList = camposDisponiblesList;

            camposDisponiblesList.setEnableCopy(false);
            camposDisponiblesList.setContextMenu(self.getContextMenuFields());
            camposDisponiblesList.addListener("contextmenu", function (e) {
                try {
                    var target = e.getTarget();
                    this.setSelection([target]);
                } catch (e) {
                    console.log(e);
                }
            });

            camposDisponiblesList.hideLabel();
            camposDisponiblesList.setDraggable(false);
            camposDisponiblesList.setDroppable(false);
            camposDisponiblesList.setSelectionMode("single");
            containercamposDisponibles.add(camposDisponiblesList, {
                flex: 1
            });
            container.add(containercamposDisponibles, {
                flex: 1
            });

            container.add(new qx.ui.core.Spacer(5));

            var subContainer = new qx.ui.container.Composite(new qx.ui.layout.VBox());
            container.add(subContainer, {
                flex: 1
            });

            var containerTables = new qx.ui.container.Composite(new qx.ui.layout.VBox());
            var lbla = new qx.ui.basic.Label(self.tr("Tablas:"));
            containerTables.add(lbla);
            var tablasList = new qx.ui.form.List().set({
                maxHeight: 150,
                minHeight: 150
            });
            tablasList.setContextMenu(self.getContextMenuTablas());
            tablasList.addListener("contextmenu", function (e) {
                try {
                    var target = e.getTarget();
                    this.setSelection([target]);
                } catch (e) {
                    console.log(e);
                }
            });
            self.filaRotulosList = tablasList;
            tablasList.setDraggable(false);
            tablasList.setSelectionMode("single");
            tablasList.setDroppable(false);
            containerTables.add(tablasList);
            subContainer.add(containerTables, {
                flex: 1
            });

            var containerFilters = new qx.ui.container.Composite(new qx.ui.layout.VBox());
            var lblc = new qx.ui.basic.Label(self.tr("Conexiones:"));
            containerFilters.add(lblc);
            var filtersList = new qx.ui.form.List().set({
                maxHeight: 70
            });
            filtersList.addListener("contextmenu", function (e) {
                try {
                    var target = e.getTarget();
                    this.setSelection([target]);
                } catch (e) {
                    console.log(e);
                }
            });
            filtersList.setContextMenu(self.getContextMenuConections());
            self.filtersList = filtersList;
            filtersList.setDraggable(true);
            filtersList.addListener("dragover", function (e) {
                if (!e.supportsType("items")) {
                    e.preventDefault();
                }
            });
            filtersList.setDroppable(true);
            containerFilters.add(filtersList);
            subContainer.add(containerFilters, {
                flex: 1
            });

            var containerRealFilters = new qx.ui.container.Composite(new qx.ui.layout.VBox());
            var lblc = new qx.ui.basic.Label(self.tr("Filtros:"));
            containerRealFilters.add(lblc);
            var realFiltersList = new qx.ui.form.List().set({
                maxHeight: 70
            });
            realFiltersList.addListener("contextmenu", function (e) {
                try {
                    var target = e.getTarget();
                    this.setSelection([target]);
                } catch (e) {
                    console.log(e);
                }
            });
            realFiltersList.setContextMenu(self.getContextMenuFilters());
            self.realFiltersList = realFiltersList;
            realFiltersList.setDraggable(true);
            realFiltersList.addListener("dragover", function (e) {
                if (!e.supportsType("items")) {
                    e.preventDefault();
                }
            });
            realFiltersList.setDroppable(true);
            containerRealFilters.add(realFiltersList);
            subContainer.add(containerRealFilters, {
                flex: 1
            });

            self.loadSubList();
            return;
        },
        loadSubList: function loadSubList() {
            var self = this;
            var subList = new qxnw.nw_exp.lists.l_view(self);
            self.subList = subList;
            subList.hideFooterColumnStill();
            subList.hideFooterCalculate();
            var enc = self.ui.mainSelect.getValue();
            subList.setEnc(enc["model"]);
            subList.setMaxHeight(200);
            subList.ui.newButton.setVisibility("excluded");
            subList.ui.editButton.setVisibility("excluded");
            subList.ui.deleteButton.setVisibility("excluded");
            subList.setUserData("interfaceType", "DATA");
            self.insertNavTable(subList.getBase(), self.tr("Data"));
        },
        saveItemsOrder: function saveItemsOrder() {
            var self = this;
            var items = self.camposDisponiblesList.getChildren();
            var data = {};
            data.records = [];
            for (var i = 0; i < items.length; i++) {
                var model = items[i].getModel();
                var d = {};
                d["id"] = model.id;
                d["order"] = i;
                d["name"] = model.nombre;
                data.records.push(d);
            }
            var func = function () {
                qxnw.utils.information(self.tr("Registro guardado correctamente"));
                self.populateAll();
                return;
            };
            qxnw.utils.fastAsyncRpcCall("nw_exp", "saveOrder", data, func);
        },
        createUpDownButtons: function createUpDownButtons() {
            var self = this;
            var upButton = new qx.ui.form.Button("", qxnw.config.execIcon("go-up")).set({
                alignX: "center",
                alignY: "middle",
                maxHeight: 30,
                maxWidth: 30,
                show: "icon",
                padding: 0
            });
            var downButton = new qx.ui.form.Button("", qxnw.config.execIcon("go-down")).set({
                alignX: "center",
                alignY: "middle",
                maxHeight: 30,
                maxWidth: 30,
                show: "icon",
                padding: 0
            });
            var saveButton = new qx.ui.form.Button("", qxnw.config.execIcon("dialog-apply")).set({
                alignX: "center",
                alignY: "middle",
                maxHeight: 30,
                maxWidth: 30,
                show: "icon",
                padding: 0
            });
            upButton.addListener("execute", function () {
                self.moveItem("up");
            });
            downButton.addListener("execute", function () {
                self.moveItem("down");
            });
            saveButton.addListener("execute", function () {
                self.saveItemsOrder();
            });
            var container = new qx.ui.container.Composite(new qx.ui.layout.VBox()).set({
                alignX: "center",
                alignY: "middle"
            });
            container.add(new qx.ui.core.Spacer(), {
                flex: 1
            });
            container.add(upButton, {
                flex: 1
            });
            container.add(downButton, {
                flex: 1
            });
            container.add(saveButton, {
                flex: 1
            });
            container.add(new qx.ui.core.Spacer(), {
                flex: 1
            });
            var maxContainer = new qx.ui.container.Composite(new qx.ui.layout.HBox()).set({
                alignX: "center",
                alignY: "middle"
            });
            maxContainer.add(self.containercamposDisponibles);
            maxContainer.add(container);
            self.upContainer.add(maxContainer);
        },
        save: function save() {
            var self = this;
            var r = self.getRecord();
            var func = function () {
                qxnw.utils.information(self.tr("Registro guardado correctamente"));
                return;
            };
            qxnw.utils.fastAsyncRpcCall("nw_exp", "save", r, func);
        },
        addExp: function addExp() {
            var self = this;
            var f = new qxnw.forms();
            f.setModal(true);
            f.setTitle(self.tr("Nuevo listado dinámico :: QXNW"));
            var fields = [
                {
                    name: "nombre",
                    label: self.tr("Nombre"),
                    type: "textField",
                    required: true
                }
            ];
            f.setFields(fields);
            f.ui.cancel.addListener("execute", function () {
                f.close();
            });
            f.settings.accept = function () {
                self.populateAll();
            };
            f.ui.accept.addListener("execute", function () {
                if (!f.validate()) {
                    return;
                }
                var r = f.getRecord();
                var func = function (rta) {
                    if (rta) {
                        self.ui.mainSelect.removeAll();
                        qxnw.utils.populateSelectAsync(self.ui.mainSelect, "nw_exp", "getMain");
                    }
                    f.close();
                };
                qxnw.utils.fastAsyncRpcCall("nw_exp", "addMain", r, func);
            });
            f.show();
        },
        editExp: function editExp() {
            var self = this;
            var f = new qxnw.forms();
            f.setModal(true);
            f.setTitle(self.tr("Editar listado dinámico :: QXNW"));
            var fields = [
                {
                    name: "nombre",
                    label: self.tr("Nombre"),
                    type: "textField",
                    required: true
                }
            ];
            f.setFields(fields);

            var enc = this.ui.mainSelect.getValue();
            if (typeof enc.label == 'undefined') {
                f.destroy();
                f = null;
                qxnw.utils.information(self.tr("No hay interfaces para eliminar"));
                return;
            }
            var s = enc.label.split(".");
            if (typeof s[1] != 'undefined') {
                f.ui.nombre.setValue(s[1]);
            }

            f.ui.cancel.addListener("execute", function () {
                f.close();
            });
            f.settings.accept = function () {
                self.populateAll();
            };
            f.ui.accept.addListener("execute", function () {
                if (!f.validate()) {
                    return;
                }
                var r = f.getRecord();
                r.edit = true;
                r.id = enc.model;
                var func = function (rta) {
                    if (rta) {
                        self.ui.mainSelect.removeAll();
                        qxnw.utils.populateSelectAsync(self.ui.mainSelect, "nw_exp", "getMain");
                        self.ui.mainSelect.setValue(enc.model);
                    }
                    f.close();
                };
                qxnw.utils.fastAsyncRpcCall("nw_exp", "addMain", r, func);
            });
            f.show();
        },
        addTable: function addTable() {
            var self = this;
            var f = new qxnw.nw_exp.forms.f_add();
            var enc = this.ui.mainSelect.getValue();
            f.setParamRecord(enc.model);
            f.settings.accept = function () {
                self.populateAll();
            };
            f.setModal(true);
            f.show();
            f.maximize();
        },
        populateAll: function populateAll() {
            var self = this;
            var enc = self.ui.mainSelect.getValue();
            if (enc.model == null) {
                return;
            }
            if (typeof self.subList != 'undefined' && self.subList != null) {
                self.subList.setEnc(enc.model);
            }
            self.populateTables(enc);
            self.populateFields(enc);
            self.populateConnection(enc);
            self.populateFilters(enc);
            self.subList.populateFilters();
        },
        populateTables: function populateTables(enc) {
            var self = this;
            var func = function (r) {
                if (typeof self.filaRotulosList == 'undefined') {
                    return;
                }
                self.filaRotulosList.removeAll();
                for (var i = 0; i < r.length; i++) {
                    var d = r[i];
                    var label = typeof d["nombre"] == "undefined" ? d["name"] : d["nombre"];
                    var item = new qxnw.widgets.listItem(label).set({
                        rich: true,
                        selectable: true,
                        focusable: true
                    });
                    item.addListener("focusout", function () {
                        this.setUserData("nw_focus", false);
                    });
                    item.setModel(d);
                    self.filaRotulosList.add(item);
                }
            };
            qxnw.utils.fastAsyncRpcCall("nw_exp", "getTablesByEnc", enc, func);
        },
        populateFields: function populateFields(enc) {
            var self = this;
            var func = function (r) {
                self.camposDisponiblesList.removeAll();
                var count = 1;
                for (var i = 0; i < r.length; i++) {
                    var d = r[i];
                    var label = typeof d["nombre_campo"] == "undefined" ? d["name"] : d["nombre_campo"];
                    var nombre_mostrar = d["nombre_mostrar"] == "" ? "" : d["nombre_mostrar"];
                    nombre_mostrar = nombre_mostrar == null ? "" : nombre_mostrar;
                    if (nombre_mostrar != "") {
                        nombre_mostrar = "(" + nombre_mostrar + ") ";
                    }
                    var tipo = " <b>Tipo-></b>";
                    tipo += d["tipo"] == null ? "TABLA" : d["tipo"];
                    label = nombre_mostrar + label + tipo;
                    var item = new qxnw.widgets.listItem(count + ". " + label).set({
                        rich: true,
                        selectable: true,
                        focusable: true
                    });
                    item.addListener("focusout", function () {
                        this.setUserData("nw_focus", false);
                    });
                    item.setModel(d);
                    self.camposDisponiblesList.add(item);
                    count++;
                }
            };
            qxnw.utils.fastAsyncRpcCall("nw_exp", "getFieldsByEnc", enc, func);
        },
        populateConnection: function populateConnection(enc) {
            var self = this;
            var func = function (r) {
                if (typeof self.filtersList == 'undefined') {
                    return;
                }
                self.filtersList.removeAll();
                for (var i = 0; i < r.length; i++) {
                    var d = r[i];
                    var label = typeof d["nombre"] == "undefined" ? d["name"] : d["nombre"];
                    var item = new qxnw.widgets.listItem(label).set({
                        rich: true,
                        selectable: true,
                        focusable: true
                    });
                    item.addListener("focusout", function () {
                        this.setUserData("nw_focus", false);
                    });
                    item.setModel(d);
                    self.filtersList.add(item);
                }
            };
            qxnw.utils.fastAsyncRpcCall("nw_exp", "getConnectionsByEnc", enc, func);
        },
        populateFilters: function populateFilters(enc) {
            var self = this;
            var func = function (r) {
                if (typeof self.realFiltersList == 'undefined') {
                    return;
                }
                self.realFiltersList.removeAll();
                for (var i = 0; i < r.length; i++) {
                    var d = r[i];
                    var label = typeof d["tabla_origen"] == "undefined" ? d["tabla_origen"] : d["tabla_origen"];
                    label += ".";
                    label += d["nombre"];
                    label += " <b>-></b>Mostrar cómo: ";
                    label += d["label"];
                    label += " <b>-></b>Tipo: ";
                    label += d["tipo"];
                    label += " <b>-></b>Comparativo: ";
                    label += d["comparativo"];
                    var item = new qxnw.widgets.listItem(label).set({
                        rich: true,
                        selectable: true,
                        focusable: true
                    });
                    item.addListener("focusout", function () {
                        this.setUserData("nw_focus", false);
                    });
                    item.setModel(d);
                    self.realFiltersList.add(item);
                }
            };
            qxnw.utils.fastAsyncRpcCall("nw_exp", "getFiltersByEnc", enc.model, func);
        },
        getContextMenuTablas: function getContextMenuTablas() {
            var self = this;
            var menu = new qx.ui.menu.Menu;
            var editButton = new qx.ui.menu.Button(self.tr("Editar"), qxnw.config.execIcon("document-new"));
            var connectButton = new qx.ui.menu.Button(self.tr("Conexiones"), qxnw.config.execIcon("insert-link"));
            var deleteButton = new qx.ui.menu.Button(self.tr("Eliminar"), qxnw.config.execIcon("edit-delete"));
            editButton.addListener("execute", function (e) {
                var tar = self.filaRotulosList.getSelection();
                var f = new qxnw.nw_exp.forms.f_add();
                var enc = self.ui.mainSelect.getValue();
                var mod = tar[0].getModel();
                f.setParamRecordTable(mod);
                f.setParamRecord(enc.model);
                f.settings.accept = function () {
                    self.populateAll();
                };
                f.setModal(true);
                f.show();
                f.maximize();
            });
            connectButton.addListener("execute", function (e) {
                var tar = self.filaRotulosList.getSelection();
                var f = new qxnw.nw_exp.forms.f_addConnection();
                var enc = self.ui.mainSelect.getValue();
                f.setParamRecordTable(tar[0].getModel(), enc);
                f.settings.accept = function () {
                    self.populateAll();
                };
                f.setModal(true);
                f.show();
            });
            deleteButton.addListener("execute", function (e) {
                qxnw.utils.question(self.tr("¿Desea eliminar la conexión a esta tabla y los campos asociados?"), function (e) {
                    if (e) {
                        var tar = self.filaRotulosList.getSelection();
                        if (tar.length == 0) {
                            return;
                        }
                        var model = tar[0].getModel();
                        self.deleteTableById(model.id);
                    }
                });
            });
            menu.add(editButton);
            menu.add(connectButton);
            menu.add(deleteButton);
            return menu;
        },
        getContextMenuConections: function getContextMenuConections() {
            var self = this;
            var menu = new qx.ui.menu.Menu;
            var deleteButton = new qx.ui.menu.Button(self.tr("Eliminar"), qxnw.config.execIcon("edit-delete"));
            deleteButton.addListener("execute", function () {
                qxnw.utils.question(self.tr("¿Desea eliminar ésta conexión de tablas?"), function (e) {
                    if (e) {
                        var tar = self.filtersList.getSelection();
                        if (tar.length == 0) {
                            return;
                        }
                        var model = tar[0].getModel();
                        self.deleteConectionById(model.id);
                    }
                });
            });
            menu.add(deleteButton);
            return menu;
        },
        getContextMenuFilters: function getContextMenuFilters() {
            var self = this;
            var menu = new qx.ui.menu.Menu;
            var deleteButton = new qx.ui.menu.Button(self.tr("Eliminar"), qxnw.config.execIcon("edit-delete"));
            deleteButton.addListener("execute", function () {
                qxnw.utils.question(self.tr("¿Desea eliminar ésta conexión de filtros?"), function (e) {
                    if (e) {
                        var tar = self.realFiltersList.getSelection();
                        if (tar.length == 0) {
                            return;
                        }
                        var model = tar[0].getModel();
                        self.deleteFilterById(model.id);
                    }
                });
            });
            menu.add(deleteButton);
            return menu;
        },
        getContextMenuFields: function getContextMenuFields() {
            var self = this;
            var menu = new qx.ui.menu.Menu;
            var editButton = new qx.ui.menu.Button(self.tr("Editar"), qxnw.config.execIcon("edit-select-all"));
            var dupliButton = new qx.ui.menu.Button(self.tr("Duplicar"), qxnw.config.execIcon("help-about"));
            var deleteButton = new qx.ui.menu.Button(self.tr("Eliminar"), qxnw.config.execIcon("edit-delete"));
            deleteButton.addListener("execute", function () {
                qxnw.utils.question(self.tr("¿Desea eliminar este campo?"), function (e) {
                    if (e) {
                        var tar = self.camposDisponiblesList.getSelection();
                        if (typeof tar[0] == 'undefined') {
                            return;
                        }
                        var model = tar[0].getModel();
                        self.deleteFieldById(model.id);
                    }
                });
            });
            editButton.addListener("execute", function () {
                var tar = self.camposDisponiblesList.getSelection();
                if (typeof tar[0] == 'undefined') {
                    return;
                }
                var model = tar[0].getModel();
                if (model.tipo == "CONDICIONAL") {
                    qxnw.utils.information(self.tr("Un campo CONDICIONAL no se puede editar. Se debe eliminar y crear de nuevo"));
                    return;
                }
                var f = new qxnw.nw_exp.forms.f_addField();
                var enc = self.ui.mainSelect.getValue();
                f.setParamRecord(enc.model);
                f.setParamRecordEdit(model);
                f.settings.accept = function () {
                    self.populateAll();
                };
                f.setModal(true);
                f.show();
            });
            dupliButton.addListener("execute", function () {
                var tar = self.camposDisponiblesList.getSelection();
                if (typeof tar[0] == 'undefined') {
                    return;
                }
                var f = new qxnw.nw_exp.forms.f_addField();
                var enc = self.ui.mainSelect.getValue();
                f.setParamRecord(enc.model);
                f.setParamRecordEdit(tar[0].getModel());
                f.ui.id.setValue("");
                f.settings.accept = function () {
                    self.populateAll();
                };
                f.setModal(true);
                f.show();
            });
            menu.add(dupliButton);
            menu.add(editButton);
            menu.add(deleteButton);
            return menu;
        },
        deleteExp: function deleteExp() {
            var self = this;
            var id = self.ui.mainSelect.getValue()["model"];
            if (typeof id == 'undefined') {
                qxnw.utils.information(self.tr("No hay interfaces para eliminar"));
                return;
            }
            var func = function () {
                self.ui.mainSelect.removeAll();
                qxnw.utils.populateSelect(self.ui.mainSelect, "nw_exp", "getMain");
                self.populateAll();
            };
            qxnw.utils.fastAsyncRpcCall("nw_exp", "deleteExp", id, func);
        },
        deleteFieldById: function deleteFieldById(id) {
            var self = this;
            var func = function () {
                self.populateAll();
            };
            qxnw.utils.fastAsyncRpcCall("nw_exp", "deleteFieldById", id, func);
        },
        deleteConectionById: function deleteConectionById(id) {
            var self = this;
            var func = function () {
                self.populateAll();
            };
            qxnw.utils.fastAsyncRpcCall("nw_exp", "deleteConectionById", id, func);
        },
        deleteFilterById: function deleteFilterById(id) {
            var self = this;
            var func = function () {
                self.populateAll();
            };
            qxnw.utils.fastAsyncRpcCall("nw_exp", "deleteFilterById", id, func);
        },
        deleteTableById: function deleteTableById(id) {
            var self = this;
            var func = function () {
                self.populateAll();
            };
            qxnw.utils.fastAsyncRpcCall("nw_exp", "deleteTableById", id, func);
        },
        addField: function addField() {
            var self = this;
            var f = new qxnw.nw_exp.forms.f_addField();
            var enc = this.ui.mainSelect.getValue();
            f.setParamRecord(enc.model);
            f.settings.accept = function () {
                self.populateAll();
            };
            f.show();
        },
        addFieldCondi: function addFieldCondi() {
            var self = this;
            var f = new qxnw.nw_exp.forms.f_addFieldCondi();
            var enc = this.ui.mainSelect.getValue();
            f.setParamRecord(enc.model);
            f.settings.accept = function () {
                self.populateAll();
            };
            f.show();
        },
        addFilter: function addFilter() {
            var self = this;
            var f = new qxnw.nw_exp.forms.f_addFilter();
            var enc = this.ui.mainSelect.getValue();
            f.setParamRecord(enc.model);
            f.settings.accept = function () {
                self.populateAll();
            };
            f.show();
        },
        moveItem: function moveItem(type) {
            var self = this;
            var sr = self.camposDisponiblesList.getSelection();
            if (sr.length == 0) {
                return;
            }
            sr = sr[0];
            switch (type) {
                case "up":
                    var before = null;
                    var children = self.camposDisponiblesList.getChildren();
                    for (var i = 0; i < children.length; i++) {
                        if (children[i] == sr) {
                            before = children[i - 1];
                            break;
                        }
                    }
                    if (before == null) {
                        return;
                    }
                    self.camposDisponiblesList.remove(sr);
                    self.camposDisponiblesList.addBefore(sr, before);
                    self.camposDisponiblesList.setSelection([sr]);
                    break;
                case "down":
                    var after = null;
                    var children = self.camposDisponiblesList.getChildren();
                    for (var i = 0; i < children.length; i++) {
                        if (children[i] == sr) {
                            after = children[i + 1];
                            break;
                        }
                    }
                    if (after == null) {
                        return;
                    }
                    self.camposDisponiblesList.remove(sr);
                    self.camposDisponiblesList.addAfter(sr, after);
                    self.camposDisponiblesList.setSelection([sr]);
                    break;
            }
        }
    }
});