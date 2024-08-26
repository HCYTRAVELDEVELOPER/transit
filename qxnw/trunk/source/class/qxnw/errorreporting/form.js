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
qx.Class.define("qxnw.errorreporting.form", {
    extend: qxnw.forms,
    construct: function construct() {
        this.base(arguments);
        var self = this;
        self.setModal(true);
        self.setTitle(self.tr("Enviar comentarios"));

        self.set({
            contentPadding: 10,
            showClose: false,
            showMinimize: false,
            showMaximize: false,
            maxWidth: 350
        });

        self.addListener("keypress", function (e) {
            var k = e.getKeyIdentifier();
            if (k == "Escape") {
                self.close();
            }
        });

        var label = new qx.ui.basic.Label(self.tr("Se ha generado una novedad en el sistema <br /><br />Comentarios si desea generar un código de seguimiento:")).set({
            rich: true
        });
        self.masterContainer.add(label);

        self.textArea = new qx.ui.form.TextArea();
        self.textArea.setPlaceholder(self.tr("Escriba sus comentarios o la acción que realizó en el momento de la novedad"));

        self.masterContainer.add(self.textArea);

        self.masterContainer.getLayout().set({
            spacing: 10
        });

        self.__includeScreenButton = new qx.ui.form.CheckBox(self.tr("Enviar captura de pantalla"));
        self.__includeScreenButton.setValue(true);
        self.__includeScreenButton.setVisibility("excluded");
        self.__includeScreenButton.addListener("changeValue", function (e) {
            if (e.getData()) {
                self.__errorImg.setVisibility("visible");
            } else {
                self.__errorImg.setVisibility("excluded");
            }
        });
        self.masterContainer.add(self.__includeScreenButton);

        self.__errorImg = new qx.ui.basic.Image(qxnw.config.getImageNoExists()).set({
            maxWidth: 150,
            maxHeight: 100,
            scale: true,
            alignY: "middle",
            alignX: "center"
        });
        self.__errorImg.setVisibility("excluded");
        self.masterContainer.add(self.__errorImg, {
            flex: 1
        });

        var checkButton = new qx.ui.form.CheckBox(self.tr("Preguntar antes de enviar"));
        checkButton.setVisibility("excluded");
        self.masterContainer.add(checkButton);
        checkButton.setValue(qxnw.local.getData("config_ask_error_report"));
        checkButton.addListener("execute", function (e) {
            qxnw.local.storeData("config_ask_error_report", this.getValue());
        });

        self.up = qxnw.userPolicies.getUserData();

        var c = new qx.ui.container.Composite(new qx.ui.layout.HBox()).set({
            backgroundColor: "white"
        });
        var lblLegal = new qx.ui.basic.Label(self.tr("Acceda a nuestra sección de <a style='cursor: pointer; color: #0099ff; ' target='_blank' href='https://www.gruponw.com/politicas'>políticas</a> para solicitar cambios <br />\n\
                    en el contenido por motivos legales. Sus comentarios e <br /> información adicional serán enviadas a las centrales de <br />\n\
                    <b>Grupo NW</b>")).set({
            rich: true
        });
        c.add(lblLegal);
        self.masterContainer.add(c, {
            flex: 0
        });

        if (qxnw.utils.isDebug() || qxnw.userPolicies.getDevelopers().indexOf(self.up.user) != -1) {
            var seeDetailsLbl = new qx.ui.basic.Label(self.tr("Ver detalles específicos para desarrolladores"));
            seeDetailsLbl.setFont(qx.bom.Font.fromString("bold underline"));
            self.masterContainer.add(seeDetailsLbl);
            seeDetailsLbl.setCursor("pointer");
            seeDetailsLbl.addListener("click", function (e) {
                self.showDetails();
            });
        }

        self.createDeffectButtons();
        self.ui.accept.addListener("execute", function () {
            self.accept();
        });
        self.ui.accept.setLabel("Generar código");
        self.ui.cancel.addListener("execute", function () {
            self.reject();
        });

        self.textArea.focus();

        var loading = document.querySelectorAll(".loadingnw");
        if (loading.length > 0) {
            for (var i = 0; i < loading.length; i++) {
                loading[i].remove();
            }
        }

    },
    members: {
        textArea: null,
        __error: null,
        up: null,
        __errorImg: null,
        __errorPathString: null,
        __includeScreenButton: null,
        setImageError: function setImageError(img) {
            var self = this;
            self.__errorPathString = img;
            self.__includeScreenButton.setVisibility("visible");
            self.__errorImg.setVisibility("visible");
            self.__errorImg.setSource(img);
            self.__errorImg.addListener("mousemove", function () {
                self.__errorImg.resetMaxWidth();
                self.__errorImg.setMaxWidth(300);
                self.__errorImg.setMaxHeight(200);
            });
            self.__errorImg.addListener("mouseout", function () {
                self.__errorImg.resetMaxWidth();
                self.__errorImg.setMaxWidth(150);
                self.__errorImg.setMaxHeight(100);
            });
        },
        showDetails: function showDetails() {
            var self = this;
            if (self.__error != null) {
                var err = self.__error.replace(/\$/g, "'");
                err = err.replace(/\+/g, ",");
                err = err.replace(/\___/g, ":");
                qxnw.utils.error_show(err);
            }
        },
        setError: function setError(error) {
            var str = "";
            for (var r in error) {
                str += "<b>" + qxnw.utils.ucfirst(r) + ":</b> " + error[r] + ". ";
            }
            this.__error = str;
        },
        getData: function getData() {
            var self = this;
            var data = {};
            data["text"] = self.textArea.getValue();
            return data;
        },
        setParamRecord: function setParamRecord(response) {

        }
    }
});