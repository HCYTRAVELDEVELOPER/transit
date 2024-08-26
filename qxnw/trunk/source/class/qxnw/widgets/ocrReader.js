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

qx.Class.define("qxnw.widgets.ocrReader", {
    extend: qxnw.widgets.camera,
    construct: function (parent) {
        var self = this;
        self.setImageWidth(700);
        self.setImageHeight(500);
        self.base(arguments);
        self.parent = parent;
        qxnw.utils.loading(self.tr("Cargando librerías..."));
        self.dynLoader = new qx.util.DynamicScriptLoader(["qxnw/mrz-worker.bundle-min-wrapped.js", "qxnw/demo.bundle.js"]);
        self.dynLoader.addListenerOnce("loaded", function (e) {
            self.__isLoaded = true;
        });
        self.dynLoader.addListenerOnce("ready", function (e) {
            self.worker = self.initWorker();
            qxnw.utils.stopLoading();
        });
        self.dynLoader.start();
    },
    events: {
        "parsed": "qx.event.type.Data"
    },
    members: {
        pb: null,
        parent: null,
        worker: null,
        processError: function processError(data) {
            var self = this;
            qxnw.utils.information(self.tr("El documento no pudo ser leído. Intente de nuevo"));
            self.__buttonSnapshot.setEnabled(true);
            if (self.__alterImageComposite) {
                self.__alterImageComposite.removeAll();
            }
            self.__img = null;
            self.clean();
            self.start();
        },
        processData: function processData(data) {
            var self = this;
            if (data.error) {
                self.processError(data);
                return;
            }
            var rta = data.parsed.fields;
            var rta2 = {"birthDate": "fecha_nacimiento", "documentCode": "tipo_documento", "firstName": "nombres", "lastName": "apellidos", "nationality": "nacionalidad", "sex": "sexo", "optional2": "identificacion"};
            var rta3 = {};
            for (var v in rta) {
                rta3[rta2[v]] = rta[v];
            }
            self.fireDataEvent("parsed", rta3);
            self.parent.close();
        },
        initWorker: function initWorker() {
            var self = this;
            var blob = new Blob([mrz_worker.toString().replace(/^function .+\{?|\}$/g, '')], {type: 'text/javascript'});
            var objectURL = URL.createObjectURL(blob);
            var worker = new Worker(objectURL);
            worker.addEventListener('error', function (e) {
                console.log(e);
                $('html').html(['<pre>', e.message, ' (', e.filename, ':', e.lineno, ':', e.colno, ')</pre>'].join(''));
            }, false);

            worker.addEventListener('message', function (e) {
                var data = e.data;

                console.log(data);

                switch (data.type) {
                    case 'progress':
                        console.log("PROGRESO");
//                        console.log(data.msg.substr(0, 1).toUpperCase() + data.msg.substr(1));
//                          $('.progress-text').text(data.msg.substr(0, 1).toUpperCase() + data.msg.substr(1));
                        break;

                    case 'error':
//                        $('.progress').removeClass('visible');
//                        $('.progress').removeClass('visible');
                        console.log(data);
                        console.log(data.error);
                        setTimeout(function () {
//                            window.alert(data.error);
                        }, 100);
                        break;

                    case 'result':
//                        $('.progress').removeClass('visible');
//                        console.log(data.result);
                        self.processData(data.result);
                        break;

                    default:
                        console.log(data);
                        break;
                }
            }, false);

            var pathname = document.location.pathname.split('/');
            pathname.pop();
            pathname = pathname.join('/');

            worker.postMessage({
                cmd: 'config',
                config: {
                    fsRootUrl: document.location.origin + pathname
                }
            });

            return worker;
        },
        getDataFromImage: function getDataFromImage() {
            var self = this;
            var img = this.getImg();
            self.worker.postMessage({
                cmd: 'process',
                image: img
            });
        },
        createButtonsInterface: function createButtonsInterface() {
            var self = this;

            var minWidth = 35;
            var maxWidth = 35;
            var icon_size = 6;
            var padding_icon = 0;

            var alterButtonsComposite = new qx.ui.container.Composite(new qx.ui.layout.VBox()).set({
                minWidth: minWidth,
                maxWidth: maxWidth,
                padding: padding_icon
            });

            var buttonSnapshot = new qxnw.widgets.button(self.tr("Disparar")).set({
                maxHeight: 50,
                maxWidth: maxWidth,
                show: "icon",
                padding: padding_icon
            });
            var tT = new qx.ui.tooltip.ToolTip("Tomar foto", qxnw.config.execIcon("help-faq"));
            buttonSnapshot.setToolTip(tT);
            self.__buttonSnapshot = buttonSnapshot;
            buttonSnapshot.setIcon(qxnw.config.execIcon("camera-web", "devices", icon_size));
            alterButtonsComposite.add(buttonSnapshot, {
                flex: 0
            });
            buttonSnapshot.addListener("execute", function () {
                qxnw.utils.loading(self.tr("Subiendo..."));
                this.setEnabled(false);
                self.snapshot();
                self.getDataFromImage();
                qxnw.utils.stopLoading();
            });

            var buttonClean = new qxnw.widgets.button(self.tr("Limpiar")).set({
                maxHeight: 50,
                maxWidth: maxWidth,
                show: "icon",
                padding: padding_icon
            });
            var tT = new qx.ui.tooltip.ToolTip("Limpiar y activar cámara", qxnw.config.execIcon("help-faq"));
            buttonClean.setToolTip(tT);
            self.__buttonClean = buttonClean;
            buttonClean.setIcon(qxnw.config.execIcon("edit-clear", "actions", icon_size));
            alterButtonsComposite.add(buttonClean, {
                flex: 0
            });
            buttonClean.addListener("execute", function () {
                self.__buttonSnapshot.setEnabled(true);
                if (self.__alterImageComposite) {
                    self.__alterImageComposite.removeAll();
                }
                self.__img = null;
                self.clean();
                self.start();
            });

            var spacer = new qx.ui.core.Spacer();
            alterButtonsComposite.add(spacer, {
                flex: 1
            });

            var buttonStart = new qx.ui.form.ToggleButton(self.tr("Encender")).set({
                maxHeight: 50,
                maxWidth: maxWidth,
                show: "icon",
                padding: padding_icon
            });
            var tT = new qx.ui.tooltip.ToolTip("Encendido cámara", qxnw.config.execIcon("help-faq"));
            buttonStart.setToolTip(tT);
            self.__buttonStart = buttonStart;
            buttonStart.setIcon(qxnw.config.execIcon("system-shutdown", "actions", icon_size));
            alterButtonsComposite.add(buttonStart, {
                flex: 0
            });
            self.stateOnOff = false;
            var op = true;
            if (op != null && op == true) {
                buttonStart.setValue(true);
                self.start();
            } else {
                self.__buttonSnapshot.setEnabled(false);
            }
            buttonStart.addListener("changeValue", function (d) {
                qxnw.local.setData("nw_open_camara_at_init", d.getData());
                if (d.getData() == false) {
                    self.stop();
                    self.__buttonSnapshot.setEnabled(false);
                } else {
                    self.start();
                    self.__buttonSnapshot.setEnabled(true);
                }
            });

            self.add(alterButtonsComposite, {
                flex: 1
            });
        }
    }
});
