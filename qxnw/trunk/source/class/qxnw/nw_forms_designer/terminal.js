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
qx.Class.define("qxnw.nw_forms_designer.terminal", {
    extend: qxnw.forms,
    construct: function () {
        this.base(arguments);
        var self = this;
        self.setTitle(self.tr("Terminal de desarrolladores"));
        var widgets = [
            {
                type: "recorder",
                name: "recorder",
                label: self.tr("Grabadora")
            },
            {
                type: "address",
                name: "address",
                label: self.tr("Direcciones")
            },
            {
                type: "uploader_multiple",
                name: "uploader_multiple",
                label: self.tr("Subir varios archivos")
            },
            {
                type: "colorButton",
                name: "colorButton",
                label: self.tr("Botón de colores")
            },
            {
                type: "label",
                name: "label",
                label: self.tr("Título")
            },
            {
                type: "colorPopup",
                name: "colorPopup",
                label: self.tr("Vista de colores")
            },
            {
                type: "camera",
                name: "camera",
                label: self.tr("Cámara")
            },
            {
                type: "camera",
                name: "camera",
                label: self.tr("Cámara")
            }
        ];
        self.masterContainer.setLayout(new qx.ui.layout.HBox());
        //CONTENEDOR IZQUIERDA
        self.createLeftWidget();
        //CONTENEDOR CENTRO
        self.createCenterWidget();
        //CONTENEDOR DERECHA
        self.createRightWidget();
    },
    destruct: function () {

    },
    properties: {
    },
    members: {
        createTerminalButtons: function createTerminalButtons(buttons, parent) {
            var self = this;
            for (var i = 0; i < buttons.length; i++) {
                var r = buttons[i];
                self.ui[r.name] = new qx.ui.toolbar.Button(r.label, r.icon).set({
                    rich: true
                });
                self.ui[r.name].setIconPosition("bottom");
                var css = "display:block;-webkit-transform: rotate(-90deg); -moz-transform: rotate(-90deg); filter: progid:DXImageTransform.Microsoft.BasicImage(rotation=3);";
                qx.bom.element.Style.setCss(self.ui[r.name].getChildControl("label").getContentElement(), css);
                parent.add(self.ui[r.name], {
                    flex: 1
                });
            }
        },
        createLeftWidget: function createLeftWidget() {
            var self = this;
            var containerToolsLeft = new qx.ui.container.Composite(new qx.ui.layout.VBox()).set({
                maxWidth: 30
            });
            qxnw.utils.addBorder(containerToolsLeft);
            var buttons = [
                {
                    name: "widgets",
                    label: self.tr("Widgets"),
                    icon: qxnw.config.execIcon("window-new")
                },
                {
                    name: "lady",
                    label: self.tr("Lady"),
                    icon: qxnw.config.execIcon("window-new")
                }
            ];
            self.createTerminalButtons(buttons, containerToolsLeft);
            self.masterContainer.add(containerToolsLeft, {
                flex: 1
            });
        },
        createCenterWidget: function createCenterWidget() {
            var self = this;
            var containerCenter = new qx.ui.container.Composite(new qx.ui.layout.VBox());
            qxnw.utils.addBorder(containerCenter, "yellow");
            self.masterContainer.add(containerCenter, {
                flex: 1
            });
        },
        createRightWidget: function createRightWidget() {
            var self = this;
            var containerRight = new qx.ui.container.Composite(new qx.ui.layout.VBox()).set({
                maxWidth: 20
            });
            qxnw.utils.addBorder(containerRight, "green");
            self.masterContainer.add(containerRight, {
                flex: 1
            });
        }
    }
});