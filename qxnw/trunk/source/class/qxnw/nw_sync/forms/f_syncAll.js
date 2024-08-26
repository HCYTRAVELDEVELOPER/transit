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

qx.Class.define("qxnw.nw_sync.forms.f_syncAll", {
    extend: qxnw.forms,
    construct: function () {
        var self = this;
        self.base(arguments);
        self.setTitle(self.tr("Sincronización inteligente de información :: QXNW"));
        var fields = [
            {
                name: "enc",
                label: self.tr("Interface"),
                type: "selectBox"
            }
        ];
        self.setFields(fields);
        self.ui.enc.addListener("changeSelection", function () {
            self.populate();
        });
        qxnw.utils.populateSelect(self.ui.enc, "nw_sync", "getMain");
        self.navTable = new qxnw.navtable(self);
        var columns = [
            {
                label: "ID",
                caption: "id"
            },
            {
                label: self.tr("Tabla"),
                caption: "nombre"
            },
            {
                label: self.tr("Nivel"),
                caption: "nivel"
            },
            {
                label: self.tr("Conexiónes"),
                caption: "conexion"
            },
            {
                label: self.tr("Tipo"),
                caption: "tipo"
            },
            {
                label: self.tr("Registros procesados"),
                caption: "registros_importados"
            },
            {
                label: self.tr("Registros fallidos"),
                caption: "registros_fallidos"
            }
        ];
        self.navTable.setColumns(columns);
        self.navTable.hideColumn("id");
        self.navTable.setAutoWidth();
        self.navTable.hideButtons();
        self.insertNavTable(self.navTable.getBase(), self.tr("Tablas a sincronizar"));
        self.populate();
        self.ui.accept.setIcon(qxnw.config.execIcon("view-refresh"));
        self.ui.accept.setLabel(self.tr("Sincronizar"));
        self.ui.cancel.setLabel(self.tr("Salir"));
        self.ui.accept.addListener("execute", function () {
            self.sync();
        });
        self.ui.cancel.addListener("execute", function () {
            self.close();
        });

        // self.testInternet();

    },
    members: {
        navTable: null,
        linesByTable: null,
        labelProcess: null,
        numAllProcess: 0,
        imageInternet: null,
        isConnected: false,
        testInternet: function testInternet() {
            var self = this;
            var enc = self.ui.enc.getValue();
            if (enc.enc_model == null) {
                self.imageInternet.setSource(qxnw.config.execIcon("red", "qxnw"));
                self.isConnected = false;
                return;
            }
            var func = function (rta) {
                if (rta) {
                    self.imageInternet.setSource(qxnw.config.execIcon("green", "qxnw"));
                    self.isConnected = true;
                } else {
                    self.imageInternet.setSource(qxnw.config.execIcon("red", "qxnw"));
                    self.isConnected = false;
                }
            }
            qxnw.utils.fastAsyncRpcCall("master", "checkUrl", enc.enc_model.url, func);
        },
        populate: function populate() {
            var self = this;
            var enc = self.ui.enc.getValue()["enc"];
            if (enc == null) {
                return;
            }
            var func = function (rta) {
                self.navTable.setModelData(rta);
            };
            var d = {};
            d["model"] = enc;
            qxnw.utils.fastAsyncRpcCall("nw_sync", "getTablesByEnc", d, func);
        },
        sync: function sync() {
            var self = this;
            if (!self.isConnected) {
                // qxnw.utils.information(self.tr("Debe tener conexión a internet para sincronizar"));
                //return;
            }
            var f = new qxnw.forms("Ingresos");
            f.createPrinterToolBar("Ingreso", self.ui.enc.getValue(), 1);
            f.addFrame("/nwlib6/nw_sync/console_sync.nw.php", true, self.ui.enc.getValue());
            f.hidePrinterSelect();
            f.show();
            f.maximize();
            f.setModal(true);
            return;
            var enc = self.ui.enc.getValue();
            var tables = self.navTable.getAllData();
            for (var ia = 0; ia < tables.length; ia++) {
                var zz = tables[ia];
                qxnw.utils.loading(self.tr("Sincronizando datos remotos..."));
                var type = "";
                if (zz.tipo == "RECIBIR") {
                    type = "receive";
                    var req = new qx.io.request.Jsonp();
                    var md5table = qxnw.md5.MD5(zz.nombre);
                    var url = enc.enc_model.url + "?table=" + zz.nombre + "&type=" + type + "&key=624544d678d3c5e7cf68dd1cec317794:" + md5table;
                    req.setUrl(url);
                    req.setUserData("nw_sync_remote_table", zz.nombre);
                    req.setUserData("nw_sync_remote_type", zz.tipo);
                    req.addListener("statusError", function () {
                        qxnw.utils.information(self.tr("Se ha presentado un error"));
                        qxnw.utils.stopLoading();
                    });
                    req.addListener("success", function (e) {
                        var rq = e.getTarget();
                        var ry = rq.getResponse();
                        if (typeof ry.error != 'undefined' && ry.error == true) {
                            qxnw.utils.information(ry.message);
                            return;
                        }
                        if (ry.length > 0) {
                            var t = rq.getUserData("nw_sync_remote_table");
                            self.linesByTable[t] = ry.length;
                            self.setLines(ry.length);
                            self.processNavTable();
                            var f = {};
                            f.table = t;
                            f.data = ry;
                            qxnw.utils.fastAsyncRpcCall("nw_sync", "saveData", f);
                        }
                        qxnw.utils.stopLoading();
                    }, this);
                    req.send();
                } else if (zz.tipo == "ENVIAR") {
                    type = "send";
                    var md5table = qxnw.md5.MD5(zz.nombre);
                    var f = {};
                    f.table = zz.nombre;
                    f.url = enc.enc_model.url + "?table=" + zz.nombre + "&type=" + type + "&key=624544d678d3c5e7cf68dd1cec317794:" + md5table;
                    var func = function (rta) {
                        self.linesByTable[rta.table] = rta.enviados;
                        self.setLines(rta.enviados);
                        self.processNavTable();
                        qxnw.utils.stopLoading();
                    };
                    qxnw.utils.fastAsyncRpcCall("nw_sync", "sendDataByCurl", f, func);
                }
            }
        },
        setLines: function setLines(num) {
            var self = this;
            self.numAllProcess = self.numAllProcess + num;
            self.labelProcess.setValue("Líneas procesadas: " + self.numAllProcess);
        },
        processNavTable: function processNavTable() {
            var self = this;
            var data = self.navTable.getAllData();
            for (var i = 0; i < data.length; i++) {
                if (typeof self.linesByTable[data[i].nombre] != 'undefined') {
                    if (self.linesByTable[data[i].nombre] != '') {
                        data[i].registros_importados = self.linesByTable[data[i].nombre];
                    }
                }
            }
            self.navTable.setModelData(data);
        }
    }
});
