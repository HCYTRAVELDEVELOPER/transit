qx.Class.define("maestros.lists.l_enrutamiento", {
    extend: qxnw.lists,
    construct: function () {
        var self = this;
        this.base(arguments);
        this.buttonsAutomatic = true;
        this.createBase();
        var columns = [
            {
                label: self.tr("ID"),
                caption: "id"
            },
            {
                label: self.tr("Usuario"),
                caption: "usuario"
            },
            {
                label: self.tr("Empresa"),
                caption: "empresa"
            },
            {
                label: self.tr("Fecha"),
                caption: "fecha"
            },
            {
                label: self.tr("Nombre"),
                caption: "nombre"
            },
            {
                label: self.tr("Dirección"),
                caption: "direccion_parada"
            },
            {
                label: self.tr("Longitud"),
                caption: "longitud"
            },
            {
                label: self.tr("Latitud"),
                caption: "latitud"
            },
            {
                label: self.tr("Observación"),
                caption: "observacion"
            },
            {
                label: self.tr("Estado"),
                caption: "estado"
            }
        ];
        self.setColumns(columns);
        self.hideColumn("id");
        self.hideColumn("empresa");
        var filters = [
            {
                name: "buscar_driver",
                label: self.tr("Buscar..."),
                type: "textField"
            },
            {
                name: "fecha_inicial",
                label: self.tr("Fecha inicial"),
                type: "dateField",
                required: true
            },
            {
                name: "fecha_final",
                label: self.tr("Fecha final"),
                type: "dateField",
                required: true
            }
        ];
        self.createFilters(filters);
        self.ui.newButton.addListener("click", function () {
            self.slotNuevo();
        });
        self.ui.editButton.addListener("click", function () {
            self.slotEditar();
        });
        self.ui.updateButton.addListener("click", function () {
            self.applyFilters();
        });
        self.ui.searchButton.addListener("execute", function () {
            self.applyFilters();
        });
//        self.applyFilters();
    },
    destruct: function () {
    },
    members: {
        contextMenu: function contextMenu(pos) {
            var self = this;
            this.t = t;
            var t = self.t;
            var data = self.selectedRecord();
            var m = new qxnw.contextmenu(this);
            var up = qxnw.userPolicies.getUserData();
            m.addAction(self.tr("Editar"), qxnw.config.execIcon("format-text-direction-rtl"), function (e) {
                self.slotEditar(data, t);
            });

            m.exec(pos);
        },
        formatoFecha: function formatoFecha(fecha, formato) {
            var dia = fecha.getDate();
            var mes = fecha.getMonth() + 1;
            var anio = fecha.getFullYear();

            console.log(mes.toString.length);
            if (mes.toString.length == 1) {
                mes = "0" + mes;
            }
            return anio + "-" + mes + "-" + dia;
        },
        applyFilters: function applyFilters() {
            var self = this;
            var data = {};
            let fecha_inicial = new Date(self.ui.fecha_inicial.getValue());
            let fecha_final = new Date(self.ui.fecha_final.getValue());
            var fechai = self.formatoFecha(fecha_inicial, "yyyy-mm-dd");
            var fechaf = self.formatoFecha(fecha_final, "yyyy-mm-dd");
            data.fecha_inicial = fechai;
            data.fecha_final = fechaf;
//            data.filters = self.getFiltersData();
            var rpc = new qxnw.rpc(this.rpcUrl, "conductores");
            rpc.setAsync(true);
            var func = function (r) {
                console.log(r)
                self.setModelData(r);
            };
            rpc.exec("enrutamientoUltimamilla", data, func);
        },
        
        slotNuevo: function slotNuevo(a, t) {
            var self = this;
            var d = new maestros.forms.f_enrutamiento();
            d.settings.accept = function () {
                self.applyFilters();
            };
            d.show();
            d.setModal(true);
        },
        slotEditar: function slotEditar() {
            var self = this;
            var r = self.selectedRecord();
            if (r == undefined) {
                qxnw.utils.alert(self.tr("Seleccione un registro"));
                return;
            }
            var t = main.getConfiguracion();
            var d = new transmovapp.forms.f_conductor(t);
            d.ui.clave.setRequired(false);
//            d.ui.clave.setVisibility("excluded");
//            d.setFieldVisibility(self.ui.clave, "excluded");
            d.ui.estado_activacion.setEnabled(false);
            d.setParamRecord(r, t);
            d.settings.accept = function () {
                self.applyFilters();
            };
            d.show();
            d.setModal(true);
        }
    }
});