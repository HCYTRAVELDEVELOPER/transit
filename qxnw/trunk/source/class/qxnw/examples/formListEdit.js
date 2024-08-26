/* ************************************************************************
 
 Copyright:
 2015 Grupo NW S.A.S, http://www.gruponw.com
 
 License:
 LGPL: http://www.gnu.org/licenses/lgpl.html
 EPL: http://www.eclipse.org/org/documents/epl-v10.php
 See the LICENSE file in the project's top-level directory for details.
 
 Authors:
 * Andrés Flórez (andresf)
 * 
 * Class to test on andresf projects
 
 ************************************************************************ */

qx.Class.define("qxnw.examples.formListEdit", {
    extend: qxnw.forms,
    construct: function () {
        var self = this;
        self.base(arguments);
        var fields = [
            {
                name: "",
                type: "startGroup",
                icon: qxnw.config.execIcon("office-address-book", "apps"),
                mode: "horizontal",
                border: "#F7BE81"
            },
            {
                name: "id",
                label: self.tr("Id"),
                type: "textField",
                visible: false
            },
            {
                name: "datetimefield",
                label: self.tr("Date time field"),
                type: "dateTimeField"
//                required: true,
//                enabled: false
            },
            {
                name: "descripcion",
                label: self.tr("Descripción"),
                type: "ckeditor",
                required: true
            },
            {
                name: "servicio",
                label: self.tr("Servicio"),
                type: "selectBox",
                required: true
            },
            {
                name: "unidad_servicio",
                label: self.tr("Unidad Servicio"),
                type: "selectBox",
                required: true
            },
            {
                name: "tarifa_ministerio",
                label: self.tr("Tarifa Ministerio"),
                type: "textField",
                mode: "money",
                required: true
            },
            {
                name: "",
                type: "endGroup"
            },
            {
                name: self.tr(""),
                type: "startGroup",
                icon: qxnw.config.execIcon("office-address-book", "apps"),
                mode: "horizontal",
                border: "#F7BE81"
            },
            {
                name: "ruta",
                label: self.tr("Ruta"),
                type: "selectTokenField"
            },
            {
                name: "origen",
                label: self.tr("Origen"),
                type: "selectTokenField",
                required: true
            },
            {
                name: "destino",
                label: self.tr("Destino"),
                type: "selectTokenField",
                required: true
            },
            {
                name: "tolerancia",
                label: self.tr("% Tolerancia"),
                type: "textField",
                required: true
            },
            {
                name: "consolidable",
                label: self.tr("Consolidable"),
                type: "selectBox",
                required: true
            },
            {
                name: "",
                type: "endGroup"
            },
            {
                name: self.tr(""),
                type: "startGroup",
                icon: qxnw.config.execIcon("office-address-book", "apps"),
                mode: "horizontal",
                border: "#F7BE81"
            },
            {
                name: "fecha_inicial",
                label: self.tr("Fecha Inicial"),
                type: "dateField",
                required: true
            },
            {
                name: "fecha_final",
                label: self.tr("Fecha Final"),
                type: "dateField",
                required: true
            },
            {
                name: "",
                type: "endGroup"
            },
            {
                name: self.tr(""),
                type: "startGroup",
                icon: qxnw.config.execIcon("office-address-book", "apps"),
                mode: "horizontal",
                border: "#F7BE81"
            },
            {
                name: "clase_vehiculo",
                label: self.tr("Clase Vehiculo"),
                type: "selectBox",
                required: true
            },
            {
                name: "tipo_remolque",
                label: self.tr("Tipo Remolque"),
                type: "selectBox",
                required: true
            },
            {
                name: "valor",
                label: self.tr("Valor"),
                type: "textField",
                mode: "money",
                required: true
            },
            {
                name: "",
                type: "endGroup"
            }
        ];
        self.setFields(fields);

        self.navTable = new qxnw.listEdit(self);
        var columns = [
            {
                label: "Id",
                caption: "id"
            },
            {
                label: self.tr("Tipo Vehiculo ID"),
                caption: "tipo_vehiculo"
            },
            {
                label: self.tr("Tipo Vehiculo"),
                caption: "nom_tipo_vehiculo"
            },
            {
                label: self.tr("Flete Conductor Valor Máximo"),
                caption: "flete_conductor",
                editable: true,
                type: "textField",
                mode: "money"
            },
            {
                label: self.tr("% Máximo Anticipo"),
                caption: "maximo_anticipo",
                type: "textField",
                mode: "numeric",
                editable: true
            },
            {
                label: self.tr("Usuario"),
                caption: "usuario"
            },
            {
                label: self.tr("Fecha"),
                caption: "fecha"
            }];
        self.navTable.setColumns(columns);
        self.navTable.setEnabledFilters(false);
        self.navTable.hideColumn("id");
        self.navTable.hideColumn("tipo_vehiculo");
        self.navTable.hideColumn("usuario");
        self.navTable.hideColumn("fecha");
        self.navTable.setListEdit();
        self.navTable.hideTools();
        self.navTable.hideFooterTools();
        self.navTable.setTitle(self.tr("Procedimientos"));

        self.insertNavTable(self.navTable.getBase(), self.tr("Vehiculos"));

        self.consulta();
    },
    destruct: function () {

    },
    members: {
        consulta: function consulta(pr) {
            var self = this;
            var rpc = new qxnw.rpc(self.getRpcUrl(), "tarifas");
            rpc.setAsync(true);
            var func = function (r) {
                self.navTable.setModelData(r);
            };
            rpc.exec("populateVehiculos", pr, func);
        }
    }
});
