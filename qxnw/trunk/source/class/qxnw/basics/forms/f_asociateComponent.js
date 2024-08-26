qx.Class.define("qxnw.basics.forms.f_asociateComponent", {
    extend: qxnw.forms,
    construct: function (isProduct) {
        var self = this;
        self.base(arguments);
        self.createBase();
        self.setTitle(self.tr("Perfiles"));
        var fields = [
            {
                name: "module",
                label: self.tr("Módulo"),
                type: "selectBox",
                required: true
            },
            {
                name: "component",
                label: self.tr("Componente"),
                type: "selectListCheck",
                required: true
            }
        ];
        self.setFields(fields);
        var dt = {};
        dt["Elija"] = "Elija";
        dt["General"] = "General";
        qxnw.utils.populateSelectFromArray(self.ui.module, dt);
        if (typeof isProduct != 'undefined' && isProduct == true) {
            qxnw.utils.populateSelectAsync(self.ui.module, "nw_permissions", "populateModulosGrupos", {is_product: true});
        } else {
            qxnw.utils.populateSelectAsync(self.ui.module, "master", "populate", {table: "nw_modulos_grupos"});
        }
        self.ui.module.addListener("changeSelection", function () {
            self.ui.component.removeAll();
            var dt = {};
            dt[""] = "Elija";
            qxnw.utils.populateSelectFromArray(self.ui.component, dt);
            var data = {};
            data["module"] = this.getValue().module;
            data["profile"] = self.pr.profile;
            if (typeof isProduct != 'undefined' && isProduct == true) {
                data["is_product"] = true;
            }
            self.ui.component.populate("nw_permissions", "getComponentsByModule", data);
        });
        self.ui.accept.addListener("execute", function () {
            if (!self.validate()) {
                return;
            }
            self.slotSave();
        });
        self.ui.cancel.addListener("execute", function () {
            self.reject();
        });
    },
    destruct: function () {
    },
    members: {
        pr: null,
        slotSave: function slotSave() {
            var self = this;
            var data = self.getRecord();
            data["profile"] = self.pr.profile;
            var rpc = new qxnw.rpc(self.getRpcUrl(), "nw_permissions", true);
            var func = function () {
                self.accept();
            };
            rpc.exec("asociateComponentToProfile", data, func);
        },
        setParamRecord: function setParamRecord(pr) {
            this.setRecord(pr);
            this.pr = pr;
            return true;
        }
    }
});
