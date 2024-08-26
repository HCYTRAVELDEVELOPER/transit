qx.Class.define("qxnw.basics.forms.f_permisos", {
    extend: qxnw.forms,
    construct: function() {
        var self = this;
        this.base(arguments);
        this.createBase();
        this.setTitle("Permisos");

        this.setGroupHeader("Editar");
        self.ui.accept.addListener("execute", function() {
            self.slotSave();
        });
        self.ui.cancel.addListener("execute", function() {
            self.reject();
        });
        
        var containerAll = new qx.ui.container.Composite(new qx.ui.layout.HBox());
        self.add(containerAll);

        var containerProfiles = new qx.ui.container.Composite(new qx.ui.layout.Grow).set({
            width: 200,
            height: 300,
            decorator: "main"
        });
        self.box1 = new qx.ui.groupbox.GroupBox("Perfiles", "icon/16/apps/utilities-text-editor.png");
        containerProfiles.add(self.box1);
        self.box1.setLayout(new qx.ui.layout.VBox());

        var containerModules = new qx.ui.container.Composite(new qx.ui.layout.Grow).set({
            width: 200,
            height: 300,
            decorator: "main"
        });
        self.box2 = new qx.ui.groupbox.GroupBox("Módulos", "icon/16/apps/utilities-text-editor.png");
        containerModules.add(self.box2);
        self.box2.setLayout(new qx.ui.layout.VBox());

        var containerController = new qx.ui.container.Composite(new qx.ui.layout.Grow).set({
            width: 200,
            height: 300,
            decorator: "main"
        });

        self.box3 = new qx.ui.groupbox.GroupBox("Opciones", "icon/16/apps/utilities-text-editor.png");
        containerController.add(self.box3);

        var model = {
            "id": "todos"
        };
        self.box3.setLayout(new qx.ui.layout.VBox());
        self.checkTodos = new qx.ui.form.CheckBox("Todos");
        self.checkTodos.addListener("click", function(e) {
            self.checkConsultar.setValue(self.checkTodos.getValue());
            self.checkCrear.setValue(self.checkTodos.getValue());
            self.checkEditar.setValue(self.checkTodos.getValue());
            self.checkEliminar.setValue(self.checkTodos.getValue());
            self.checkTerminal.setValue(self.checkTodos.getValue());
            self.saveController(this);
        });
        model = {
            "id": "consultar"
        };
        self.box3.setLayout(new qx.ui.layout.VBox());
        self.checkConsultar = new qx.ui.form.CheckBox("Consultar");
        self.checkConsultar.addListener("click", function(e) {
            if (!this.getValue()) {
                self.checkTodos.setValue(false);
            }
            self.saveController(this);
        });
        self.checkConsultar.setModel(model);
        self.checkCrear = new qx.ui.form.CheckBox("Crear");
        self.checkCrear.addListener("click", function(e) {
            if (!this.getValue()) {
                self.checkTodos.setValue(false);
            }
            self.saveController(this);
        });
        model = {
            "id": "crear"
        };
        self.checkCrear.setModel(model);
        self.checkEditar = new qx.ui.form.CheckBox("Editar");
        self.checkEditar.addListener("click", function(e) {
            if (!this.getValue()) {
                self.checkTodos.setValue(false);
            }
            self.saveController(this);
        });
        model = {
            "id": "editar"
        };
        self.checkEditar.setModel(model);
        self.checkEliminar = new qx.ui.form.CheckBox("Eliminar");
        self.checkEliminar.addListener("click", function(e) {
            if (!this.getValue()) {
                self.checkTodos.setValue(false);
            }
            self.saveController(this);
        });
        model = {
            "id": "eliminar"
        };
        self.checkEliminar.setModel(model);
        self.checkTerminal = new qx.ui.form.CheckBox("Terminal");
        self.checkTerminal.addListener("click", function(e) {
            if (!this.getValue()) {
                self.checkTodos.setValue(false);
            }
            self.saveController(this);
        });
        model = {
            "id": "terminal"
        };
        self.checkTerminal.setModel(model);
        self.box3.add(self.checkTodos);
        self.box3.add(self.checkConsultar);
        self.box3.add(self.checkCrear);
        self.box3.add(self.checkEditar);
        self.box3.add(self.checkEliminar);
        self.box3.add(self.checkTerminal);

        self._checkBoxes = [self.checkTodos, self.checkConsultar, self.checkCrear, self.checkEditar, self.checkEliminar, self.checkTerminal];

        containerAll.add(containerProfiles);

        containerAll.add(containerModules);

        containerAll.add(containerController);

        self.populateProfiles();
        self.populateModules();
    },
    destruct: function() {
    },
    members: {
        pr: null,
        permisos: null,
        listModules: null,
        listProfiles: null,
        box1: null,
        box3: null,
        box2: null,
        checkConsultar: null,
        checkCrear: null,
        checkEditar: null,
        checkEliminar: null,
        checkTerminal: null,
        _checkBoxes: null,
        populateProfiles: function populateProfiles() {
            var self = this;
            self.slotGetProfiles()
            self.listProfiles = new qx.ui.form.List();
            var modules = self.slotGetProfiles();
            for (var i = 0; i < modules.length; i++) {
                var r = modules[i];
                var item = new qxnw.widgets.listItem(r.nombre);
                item.setModel(r);
                self.listProfiles.add(item);
                item.addListener("click", function(e) {
                    self.clearChecks();
                    if (!self.listModules.isSelectionEmpty()) {
                        self.listModules.resetSelection();
                    }
                });
            }
            self.box1.add(self.listProfiles);
        },
        clearChecks: function clearChecks() {
            var self = this;
            var checkBoxes = self._checkBoxes;
            for (var i = 0; i < checkBoxes.length; i++) {
                checkBoxes[i].setValue(false);
            }
        },
        populateModules: function populateModules() {
            var self = this;
            self.slotGetModules()
            self.listModules = new qx.ui.form.List();
            var modules = self.slotGetModules();
            for (var i = 0; i < modules.length; i++) {
                var r = modules[i];
                var item = new qxnw.widgets.listItem(r.nombre);
                item.setModel(r);
                self.listModules.add(item);
                item.addListener("click", function(e) {
                    self.getController();
                });
            }
            self.box2.add(self.listModules);
        },
        slotGetProfiles: function slotGetProfiles() {
            var self = this;
            var rpc = new qxnw.rpc(this.getRpcUrl(), "perfiles");
            var r = rpc.exec("getProfiles");
            if (rpc.isError()) {
                qxnw.utils.error(rpc.getError(), self);
                return false;
            }
            return r;
        },
        slotGetModules: function slotGetModules() {
            var self = this;
            var rpc = new qxnw.rpc(this.getRpcUrl(), "modulos");
            var r = rpc.exec("getModules");
            if (rpc.isError()) {
                qxnw.utils.error(rpc.getError(), self);
                return false;
            }
            return r;
        },
        getController: function getController() {
            var self = this;
            var data = {};
            var selection = self.listProfiles.getSelection();
            if (typeof selection[0] == 'undefined') {
                qxnw.utils.information("Seleccione el perfil");
                return false;
            }
            data["perfil"] = selection[0].getModel().id;
            selection = self.listModules.getSelection();
            if (typeof selection[0] == 'undefined') {
                qxnw.utils.information("Seleccione el módulo");
                return false;
            }
            data["modulo"] = selection[0].getModel().id;
            var rpc = new qxnw.rpc(this.getRpcUrl(), "permisos");
            var r = rpc.exec("getProfiles", data);
            if (rpc.isError()) {
                qxnw.utils.alert(rpc.getError());
                return false;
            }
            if (r.length == 0) {
                self.clearChecks();
                return false;
            }
            var checkBoxes = self._checkBoxes;
            for (var i = 0; i < checkBoxes.length; i++) {
                var t = null;
                if (qxnw.utils.lowerFirst(checkBoxes[i].getLabel()) == "todos") {
                    t = r[0].todos;
                } else if (qxnw.utils.lowerFirst(checkBoxes[i].getLabel()) == "crear") {
                    t = r[0].crear;
                } else if (qxnw.utils.lowerFirst(checkBoxes[i].getLabel()) == "consultar") {
                    t = r[0].consultar;
                } else if (qxnw.utils.lowerFirst(checkBoxes[i].getLabel()) == "editar") {
                    t = r[0].editar;
                } else if (qxnw.utils.lowerFirst(checkBoxes[i].getLabel()) == "eliminar") {
                    t = r[0].eliminar;
                } else if (qxnw.utils.lowerFirst(checkBoxes[i].getLabel()) == "terminal") {
                    t = r[0].terminal;
                }
                if (t == 't') {
                    t = true;
                } else {
                    t = false;
                }
                checkBoxes[i].setValue(t);
            }
            return true;
        },
        saveController: function saveController(checkBox) {
            var self = this;
            var data = {};
            var selection = self.listProfiles.getSelection();
            if (typeof selection[0] == 'undefined') {
                checkBox.setValue(false);
                qxnw.utils.information("Seleccione el perfil");
                return false;
            }
            data["perfil"] = selection[0].getModel().id;
            selection = self.listModules.getSelection();
            if (typeof selection[0] == 'undefined') {
                checkBox.setValue(false);
                qxnw.utils.information("Seleccione el módulo");
                return false;
            }
            data["modulo"] = selection[0].getModel().id;
            var checkBoxes = self._checkBoxes;
            for (var i = 0; i < checkBoxes.length; i++) {
                data[qxnw.utils.lowerFirst(checkBoxes[i].getLabel())] = checkBoxes[i].getValue();
            }
            var rpc = new qxnw.rpc(this.getRpcUrl(), "permisos");
            rpc.exec("save", data);
            if (rpc.isError()) {
                qxnw.utils.alert(rpc.getError());
                return false;
            }
            return true;
        },
        slotSave: function slotSave() {
            var self = this;
            var data = this.getRecord();
            var rpc = new qxnw.rpc(this.rpcUrl, "perfiles");
            rpc.exec("save", data);
            if (rpc.isError()) {
                qxnw.utils.error(rpc.getError(), self);
                return;
            }
            self.accept();
        },
        setParamRecord: function setParamRecord(pr) {
            this.setRecord(pr);
            return true;
        }
    }
});
