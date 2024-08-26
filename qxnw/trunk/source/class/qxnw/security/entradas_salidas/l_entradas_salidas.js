/* ************************************************************************
 
 Copyright:
 2015 Netwoods.net, http://www.netwoods.net
 
 License:
 LGPL: http://www.gnu.org/licenses/lgpl.html
 EPL: http://www.eclipse.org/org/documents/epl-v10.php
 See the LICENSE file in the project's top-level directory for details.
 
 Authors:
 * Andrés Flórez (andresf)
 
 ************************************************************************ */
qx.Class.define("qxnw.security.entradas_salidas.l_entradas_salidas", {
    extend: qxnw.lists,
    construct: function () {
        var self = this;
        this.base(arguments);
        this.setButtonsAutomatic(true);
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
                label: self.tr("Nombre usuario"),
                caption: "nombre_usuario"
            },
            {
                label: self.tr("Fecha"),
                caption: "fecha"
            },
            {
                label: self.tr("IP"),
                caption: "ip"
            },
            {
                label: self.tr("Acción"),
                caption: "accion"
            },
            {
                label: self.tr("Terminal ID"),
                caption: "terminal"
            },
            {
                label: self.tr("Sede"),
                caption: "nom_terminal"
            },
            {
                label: self.tr("Empresa"),
                caption: "nom_empresa"
            },
            {
                label: self.tr("Estado usuario"),
                caption: "estado"
            },
            {
                label: self.tr("Empresa ID"),
                caption: "empresa"
            }
        ];

        self.setColumns(columns);

        self.hideColumn("id");
        self.hideColumn("empresa");
        self.hideColumn("terminal");

        var filters = [
            {
                name: "filtro",
                caption: "filtro",
                label: self.tr("Buscar..."),
                type: "textField"
            },
            {
                name: "accion",
                caption: "accion",
                label: self.tr("Acción"),
                type: "selectBox"
            },
            {
                name: "fecha_inicial",
                caption: "fecha_inicial",
                label: self.tr("Fecha inicial"),
                type: "dateTimeField",
                required: true
            },
            {
                name: "fecha_final",
                caption: "fecha_final",
                label: self.tr("Fecha final"),
                type: "dateTimeField",
                required: true
            }
        ];
        self.createFilters(filters);

        var d = {};
        d["TODOS"] = self.tr("Todos");
        d["INGRESO"] = self.tr("Ingreso");
        d["SALIDA"] = self.tr("Salida");
        self.populateSelectFromArray("accion", d);

        self.ui.part2.setEnabled(false);
        self.ui.part3.setEnabled(false);
        self.ui.part4.setEnabled(false);

        self.ui.exportButton.setEnabled(true);

        self.ui.updateButton.addListener("click", function () {
            self.applyFilters();
        });
        self.ui.searchButton.addListener("execute", function () {
            self.applyFilters();
        });
    },
    destruct: function () {
    },
    members: {
        applyFilters: function applyFilters() {
            var self = this;
            if (!self.validate()) {
                return;
            }
            var data = {};
            data.filters = self.getFiltersData();
            var rpc = new qxnw.rpc(self.getRpcUrl(), "nw_security", true);
            var func = function (r) {
                self.setModelData(r);
            };
            rpc.exec("getLogEntradasSalidas", data, func);
        }
    }
});