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
 * Class only for static mode. A composition of util code who help you in entire your application
 */
qx.Class.define("qxnw.forms.config", {
    extend: qxnw.forms,
    construct: function construct() {
        this.base(arguments);
        var self = this;
        this.setTitle("Configuración de estilos");
        this.createBase();
        var fields = [{
                name: "iconConfig",
                label: "Tamaño de los íconos",
                type: "selectBox"
            },
            {
                name: "fontSizes",
                label: "Tamaño de las fuentes",
                type: "selectBox"
            },
            {
                name: "fontFamilys",
                label: "Familias de fuentes",
                type: "selectBox"
            }
        ];
        this.setFields(fields);
        var data = {};
        var icons = qxnw.config.getIconAcceptedSizes();
        var fontSizes = qxnw.config.getFontAcceptedSizes();
        var fontFamilys = qxnw.config.getFontAcceptedFamilys();
        var r = {};
        for (r in icons) {
            data[icons[r].toString()] = icons[r].toString();
        }
        qxnw.utils.populateSelectFromArray(self.ui.iconConfig, data, qxnw.config.getIconSize());
        r = {};
        data = {};
        for (r in fontSizes) {
            data[fontSizes[r].toString()] = fontSizes[r].toString();
        }
        qxnw.utils.populateSelectFromArray(self.ui.fontSizes, data, qxnw.config.getFontSize());
        r = {};
        data = {};
        for (r in fontFamilys) {
            data[fontFamilys[r].toString()] = fontFamilys[r].toString();
        }
        qxnw.utils.populateSelectFromArray(self.ui.fontFamilys, data, qxnw.config.getFontFamilys());
        this.ui.accept.addListener("click", function() {
            self.save();
        });
        self.ui.cancel.addListener("click", function() {
            self.reject();
        });
    },
    members: {
        save: function save() {
            var self = this;
            var data = self.getRecord();
            qxnw.local.storeData("config_icon_size", data["iconConfig"]);
            qxnw.local.storeData("config_font_size", data["fontSizes"]);
            qxnw.local.storeData("config_font_familys", data["fontFamilys"]);
            try {
                qxnw.utils.question("¿Desea actualizar la página para completar la actualización de estilos?", function(e) {
                    if (e) {
                        window.location.reload();
                    }
                });
            } catch (e) {
                qxnw.utils.bindError(e, self);
            }
        }
    }
});