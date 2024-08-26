qx.Class.define("qxnw.basics.forms.f_traducciones_app", {
    extend: qxnw.forms,
    construct: function () {
        var self = this;
        this.base(arguments);
        this.setTitle(self.tr("Traducciones APP"));
        self.createBase();
        var fields = [
            {
                name: "Buscar pasajero o parada",
                type: "startGroup",
                icon: "",
                mode: "horizontal"
            },
            {
                name: "id",
                label: "ID",
                caption: "id",
                type: "textField",
                visible: false
            },
            {
                name: "idioma",
                caption: "idioma",
                label: "Idioma",
                type: "textField"
            },
            {
                name: "empresa",
                caption: "empresa",
                label: "Empresa",
                type: "textField"
            },
            {
                name: "activo",
                caption: "activoempresa",
                label: "Activo",
                type: "textField"
            },
            {
                name: "",
                type: "endGroup",
                icon: ""
            },
            {
                name: "Buscar pasajero o parada",
                type: "startGroup",
                icon: "",
                mode: "horizontal"
            },
            {
                name: "original",
                caption: "original",
                label: "Original",
                type: "textField"
            },
            {
                name: "reemplazo",
                caption: "reemplazo",
                label: "Reemplazo",
                type: "textField"
            },
            {
                name: "agregar",
                caption: "agregar",
                label: "Agregar",
                type: "button"
            },
            {
                name: "",
                type: "endGroup",
                icon: ""
            }
        ];
        self.setFields(fields);
        self.ui.accept.addListener("execute", function () {
            self.slotSave();
        });
        self.ui.cancel.addListener("execute", function () {
            self.reject();
        });
        self.ui.agregar.addListener("execute", function () {
            var data = self.getRecord();
            self.navTable.addRows([data]);
            self.ui.original.setValue("");
            self.ui.reemplazo.setValue("");
            self.ui.original.focus();
        });

        self.createNav();
    },
    destruct: function () {
    },
    members: {
        populateNav: function populateNav() {
            var self = this;
            var data = self.data;
            console.log("data", data);
            if (qxnw.utils.evalueData(data.textos)) {
                var textos = JSON.parse(data.textos);
                var array = [];
                for (var i = 0; i < textos.length; i++) {
                    console.log("textos[i]", textos[i])
                    array.push(textos[i]);
                }
                console.log("array", array)
                self.navTable.setModelData(array);
            }
            return true;
        },
        createNav: function createNav() {
            var self = this;
            self.navTable = new qxnw.navtable(self);

            var columns = [
                {
                    caption: "original",
                    label: self.tr("Original")
                },
                {
                    caption: "reemplazo",
                    label: self.tr("ReemplazoValor")
                }
            ];

            self.navTable.setColumns(columns);
            self.insertNavTable(self.navTable.getBase(), self.tr("Textos reemplazo"));
//            self.__addButon = self.navTable.getAddButton();
//            self.__addButon.addListener("execute", function () {
//                var d = new maestros.forms.f_servicios();
//                d.settings.accept = function () {
//                    var data = d.getRecord();
//                    self.navTable.addRows([data]);
//                };
//                d.setModal(true);
//                d.show();
//            }, this);
            self.__removeButton = self.navTable.getRemoveButton();
            self.__removeButton.addListener("click", function () {
                var r = self.navTable.selectedRecord();
                if (r == undefined) {
                    qxnw.utils.information(self.tr("Seleccione un registro para eliminar"));
                    return;
                } else {
                    self.navTable.removeSelectedRow(r);
                }
            });
            self.navTable.setContextMenu("contextServicios");
        },
        slotSave: function slotSave() {
            var self = this;
            var data = self.getRecord();
            data.navtable = self.navTable.getAllData();
            data.textos = JSON.stringify(data.navtable);
            console.log("data", data);
            var rpc = new qxnw.rpc(self.getRpcUrl(), "nwMaker", true);
            var func = function (r) {
                if (r) {
                    self.accept();
                }
            };
            rpc.exec("guardarTraducciones", data, func);
        },
        setParamRecord: function setParamRecord(pr) {
            var self = this;
            self.data = pr;
            self.setRecord(pr);
            self.populateNav();
            return true;
        }
    }
});