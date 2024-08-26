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

qx.Class.define("qxnw.widgets.ocrReaderButton", {
    extend: qx.ui.core.Widget,
    construct: function () {
        this.base(arguments);
        var self = this;

        self._setLayout(new qx.ui.layout.HBox());

        var openCamera = new qx.ui.form.Button(self.tr("Leer"), qxnw.config.execIcon("dialog-apply"));
        self.openCameraButton = openCamera;
        self._add(openCamera, {
            flex: 1
        });

        var readerContainer = new qx.ui.container.Composite(new qx.ui.layout.VBox);
        self._add(readerContainer, {
            flex: 1
        });

        self.label = new qx.ui.basic.Label().set({
            rich: true,
            padding: 10
        });
        qxnw.utils.addBorder(readerContainer, "black", 1);
        readerContainer.add(self.label, {
            flex: 1
        });

        openCamera.addListener("execute", function () {
            var f = new qxnw.forms();
            f.setModal(true);
            f.setResizable(false);
            f.setWidth(750);
            f.setHeight(550);

            var ocrReader = new qxnw.widgets.ocrReader(f);

            ocrReader.addListener("parsed", function (d) {
                self.process(d);
            });

            f.masterContainer.add(ocrReader, {
                flex: 1
            });

            f.setTitle(self.tr("Lector de códigos OCR :: QXNW "));
            f.center();
            f.show();
        });
    },
    events: {
        "captured": "qx.event.type.Data"
    },
    members: {
        label: null,
        openCameraButton: null,
        setTooltip: function setTooltip(toolTip) {
            this.openCameraButton.setToolTip(toolTip);
        },
        setIcon: function setIcon(v) {
            this.openCameraButton.setIcon(v);
        },
        setValue: function setValue(v) {
            this.openCameraButton.setLabel(v);
        },
        clean: function clean() {
            this.label.setValue("");
        },
        process: function process(d) {
            var self = this;
            var data = d.getData();
            var html = "";
            for (var v in data) {
                if (v !== 'undefined') {
                    html += "<b/>";
                    html += v.toUpperCase();
                    html += ": ";
                    html += "</b>";
                    html += data[v];
                    html += "<br />";
                }
            }
            self.label.setValue(html);
            self.fireDataEvent("captured", data);
        }

    }
});
