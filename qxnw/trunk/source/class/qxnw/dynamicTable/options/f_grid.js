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
qx.Class.define("qxnw.dynamicTable.options.f_grid", {
    extend: qxnw.forms,
    construct: function construct(parent) {
        this.base(arguments);
        var self = this;
        self.setParentName(parent);
        self.setTitle(self.tr("Opciones generales"));
        //self.setModal(true);
        self.setColumnsFormNumber(1);
        var fields = [
            {
                name: "Rejilla - Grid",
                type: "startGroup",
                icon: qxnw.config.execIcon("office-spreadsheet", "apps"),
                mode: "vertical"
            },
            {
                name: "nw_td_haveXY_labels",
                label: self.tr("Mostrar títulos en X y Y"),
                type: "checkBox"
            },
            {
                name: "nw_td_grid_mostrar_linea_vertical",
                label: self.tr("Mostrar líneas verticales"),
                type: "checkBox"
            },
            {
                name: "nw_td_grid_mostrar_linea_horizontal",
                label: self.tr("Mostrar líneas horizontales"),
                type: "checkBox"
            },
            {
                name: "nw_td_grid_ancho_barras",
                label: self.tr("Ancho barras"),
                type: "spinner"
            },
            {
                name: "nw_td_grid_color_fondo",
                label: self.tr("Color fondo"),
                type: "colorButton"
            },
            {
                name: "nw_td_grid_sombra",
                label: self.tr("Sombra"),
                type: "checkBox"
            },
            {
                name: "nw_td_grid_color_linea",
                label: self.tr("Color línea"),
                type: "colorButton"
            },
            {
                name: "nw_td_grid_ancho_linea",
                label: self.tr("Ancho línea"),
                type: "spinner"
            },
            {
                name: "",
                type: "endGroup"
            },
            {
                name: "Estilos textos",
                type: "startGroup",
                icon: qxnw.config.execIcon("preferences-font", "apps"),
                mode: "grid"
            },
            {
                name: "nw_td_leyenda",
                label: self.tr("Mostrar leyenda"),
                type: "checkBox",
                row: 0,
                column: 0
            },
            {
                name: "nw_td_leyenda_posicion",
                label: self.tr("¿Dentro?"),
                type: "checkBox",
                row: 1,
                column: 0
            },
            {
                name: "nw_td_letra_size_xy",
                label: self.tr("Tamaño letra X y Y (px)"),
                type: "spinner",
                row: 0,
                column: 1
            },
            {
                name: "nw_td_letra_size_legend",
                label: self.tr("Tamaño letra leyenda (1-6)"),
                type: "spinner",
                row: 1,
                column: 1
            },
            {
                name: "",
                type: "endGroup"
            },
            {
                name: "Impresión",
                type: "startGroup",
                icon: qxnw.config.execIcon("document-print"),
                mode: "vertical"
            },
            {
                name: "nw_td_titulo_encabezado",
                label: self.tr("Título"),
                type: "textField"
            },
            {
                name: "nw_td_titulo_size",
                label: self.tr("Tamaño letra título"),
                type: "spinner"
            },
            {
                name: "nw_td_impresion_encabezado",
                label: self.tr("Imprimir encabezado"),
                type: "checkBox"
            },
            {
                name: "",
                type: "endGroup"
            },
            {
                name: "Colores de campos",
                type: "startGroup",
                toolTip: self.tr("Puede configurar los colores de los primeros 10 campos. El resto aparecerá en forma aleatoria. NO APLICA para el informe en pastel."),
                icon: qxnw.config.execIcon("preferences-font", "apps"),
                mode: "grid"
            }
        ];
        var col = 0;
        var row = 1;
        for (var i = 0; i < 10; i++) {
            fields.push({
                name: "nw_td_campos_color_" + i,
                label: "Color campo " + (i + 1),
                type: "colorButton",
                row: row,
                column: col
            });
            col++;
            if (i == 4) {
                row++;
                col = 0;
            }
        }
        fields.push({
            name: "",
            type: "endGroup"
        });

        self.setFields(fields);
        self.ui.nw_td_grid_mostrar_linea_vertical.setValue(true);
        self.ui.nw_td_grid_mostrar_linea_horizontal.setValue(true);
        self.ui.nw_td_leyenda.setValue(true);
        self.ui.nw_td_leyenda_posicion.setValue(true);
        self.ui.nw_td_letra_size_xy.setValue(14);
        self.ui.nw_td_letra_size_legend.setValue(2);
        self.ui.nw_td_letra_size_legend.set({
            maximum: 6,
            minimum: 1
        });
        self.populateAll();
        self.ui.accept.addListener("execute", function () {
            self.saveAll();
        });
        self.ui.cancel.setLabel(self.tr("Volver"));
        self.ui.accept.setLabel(self.tr("Aplicar"));
        self.ui.cancel.setIcon(qxnw.config.execIcon("dialog-cancel"));
        self.ui.cancel.addListener("execute", function () {
            self.reject();
        });
    },
    members: {
        values: null,
        __lastListenerId: null,
        __printWindow: null,
        __parentInit: null,
        tmpTitle: null,
        setTemporalTitle: function setTemporalTitle(title) {
            this.ui.nw_td_titulo_encabezado.setValue(title);
            this.tmpTitle = title;
        },
        getTemporalTitle: function getTemporalTitle() {
            return this.tmpTitle;
        },
        populateAll: function populateAll() {
            var self = this;
            var saved = qxnw.local.getData("nw_tb_grid_options");
            if (saved != null) {
                for (var v in saved) {
                    if (typeof self.ui[v] != 'undefined') {
                        if (saved[v] == "false") {
                            saved[v] = false;
                        } else if (saved[v] == "true") {
                            saved[v] = true;
                        }
                        self.ui[v].setValue(saved[v]);
                    }
                }
            }
        },
        setParentName: function setParentName(parentName) {
            this.__parentName = parentName;
        },
        saveAll: function saveAll() {
            var self = this;
            var data = self.getRecord();
            if (data["nw_td_titulo_encabezado"] == this.tmpTitle) {
                data["nw_td_titulo_encabezado"] = "";
            }
            qxnw.local.storeData("nw_tb_grid_options", data);
            this.__parentName.updateJPlot();
            return;
        },
        getSaved: function getSaved() {
            return qxnw.local.getData("dynamic_table_" + this.__parentName + "_graphic");
        }
    }
});