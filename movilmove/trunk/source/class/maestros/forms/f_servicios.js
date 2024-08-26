qx.Class.define("maestros.forms.f_servicios", {
    extend: qxnw.forms,
    construct: function () {
        var self = this;
        this.base(arguments);
        this.createBase();
        this.setTitle(self.tr("Nuevo/Editar Edo foraneo"));
        var fields = [
            {
                name: "id_tarifa",
                label: self.tr("ID"),
                caption: "id_tarifa",
                type: "textField",
                visible: false
            },
            {
                name: "service",
                label: self.tr("Servicio"),
                type: "selectBox"
            },
            {
                name: "valor",
                label: self.tr("Valor"),
                type: "textField"
            }
        ];
        self.setFields(fields);

        self.ui.accept.addListener("execute", function () {
            self.accept();
        });

        self.ui.cancel.addListener("execute", function () {
            self.reject();
        });

        var data = {};
        data.table = "edo_subservice";
        qxnw.utils.populateSelect(self.ui.service, "master", "populate", data);

    },
    destruct: function () {
    },
    members: {
        __total: null,
        navTable: null,
        __addButon: null,
        __removeButton: null,
        contextMenu: function contextMenu(pos) {

        },
        setParamRecord: function setParamRecord(pr) {
            var self = this;
            self.setRecord(pr);
        }

    }
});