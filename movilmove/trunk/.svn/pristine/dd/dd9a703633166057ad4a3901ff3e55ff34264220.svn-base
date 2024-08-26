qx.Class.define("enrutamiento.forms.f_enrutamiento_pasajeros", {
    extend: qxnw.dragDropWidget,
    construct: function (parent) {
        var self = this;
        this.base(arguments);
        this.createBase();
        self.parent = parent;
        self.onlyIcons = true;
        self.setOnlyIcons(true);
        self.setGroupHeader("Enrutamiento pasajeros");
        self.setTitle("Enrutamiento pasajeros");
        self.addHeaderNote("<div class='div_title'>Pasajeros</div>");
        self.config = main.getConfiguracion();

//        self.setDropable(false);
//        self.setDraggable(false);

        var fields = [];
        self.setFields(fields);
        var filters = [
            {
                name: "fecha_inicial",
                label: "Fecha Inicial",
                type: "dateTimeField"
            },
            {
                name: "fecha_fin",
                label: "Fecha Final",
                type: "dateTimeField"
            },
            {
                name: "lote",
                label: "Lote",
                type: "selectBox"
            },
            {
                name: "estado",
                label: "Estado",
                type: "selectBox"
            }
        ];
        self.createFilters(filters);
        self.buttonSearch.addListener("click", function () {
            self.slotApplyFilters();
        });
//        self.ui.accept.addListener("execute", function () {
//            self.slotSave();
//        });
//        self.ui.cancel.addListener("execute", function () {
//            self.reject();
//        });

        self.populateLote();

        self.ui.fecha_inicial.setMaxWidth(100);
        self.ui.fecha_inicial.setMinWidth(100);
        self.ui.fecha_fin.setMaxWidth(100);
        self.ui.fecha_fin.setMinWidth(100);

        self.ui.lote.setMaxWidth(100);
        self.ui.lote.setMinWidth(100);
        self.ui.lote.setMaxHeight(20);
        self.ui.lote.setMinHeight(20);

        self.ui.estado.setMaxWidth(100);
        self.ui.estado.setMinWidth(100);
        self.ui.estado.setMaxHeight(20);
        self.ui.estado.setMinHeight(20);

//        self.ui.buttonSearch.setMaxWidth(35);
//        self.ui.buttonSearch.setMinWidth(35);
//        self.ui.buttonSearch.setMaxHeight(20);
//        self.ui.buttonSearch.setMinHeight(20);

        self.list1.addListener("contextmenu", function (e) {
            self.contextMenu(e);
        });

        self.list1.list.setDraggable(false);
        self.list2.list.setDraggable(false);
//        self.list1.setDragSelection(false);
//        self.list2.setDragSelection(false);

        var data = {};
        data["SIN_ENRUTAR"] = "SIN_ENRUTAR";
        data["TODOS"] = "TODOS";
        qxnw.utils.populateSelectFromArray(self.ui.estado, data);

    },
    destruct: function () {
    },
    members: {
        contextMenu: function contextMenu(pos) {
            var self = this;
            console.log("contextMenu");
//            var m = new qxnw.contextmenu(self.list1);
//            m.addAction("Quitar", "icon/16/actions/document-properties.png", function (e) {
//                self.slotQuitar();
//            });
//            m.exec(pos);
        },
        slotQuitar: function slotQuitar() {
            var self = this;
            var s = self.list1.getSelection();
//            var model = s[0].getModel();
            self.list1.remove(s);
        },
        populateLote: function populateLote() {
            var self = this;
            self.setFieldVisibility(self.ui.lote, "excluded");
            self.ui.lote.removeAll();
//            var data = {};
//            data[""] = "Seleccione";
//            qxnw.utils.populateSelectFromArray(self.ui.lote, data);
//            qxnw.utils.populateSelect(self.ui.lote, "enrutamiento_masivo", "populateLotes");
        },
        setParamRecord: function setParamRecord(pr) {
            var self = this;
            console.log("setParamRecord", pr);
//            self.setRecord(pr);
            return true;
        },
        validateFilters: function validateFilters() {
            var self = this;
            console.log("self.ui.lote.getValue()", self.ui.lote.getValue());
            if (main.evalueData(self.ui.lote.getValue().lote)) {
                return true;
            }
            if (!main.evalueData(self.ui.fecha_inicial.getValue())) {
                return false;
            }
            if (!main.evalueData(self.ui.fecha_fin.getValue())) {
                return false;
            }
            return true;
        },
        getDataThisForm: function getDataThisForm() {
            var self = this;
            var data = {};
            data.fecha_inicial = "";
            data.fecha_final = "";
            data.hora_inicial = "";
            data.hora_final = "";
            data.lote = self.ui.lote.getValue();
            data.estado = self.ui.estado.getValue();
            console.log("data.estado", data.estado);
            data.estado = data.estado.estado;
            if (main.evalueData(self.ui.fecha_inicial.getValue())) {
                data.fecha_inicial = self.ui.fecha_inicial.getValue().split(" ")[0];
                data.hora_inicial = self.ui.fecha_inicial.getValue().split(" ")[1];
            }
            if (main.evalueData(self.ui.fecha_fin.getValue())) {
                data.fecha_final = self.ui.fecha_fin.getValue().split(" ")[0];
                data.hora_final = self.ui.fecha_fin.getValue().split(" ")[1];
            }
            return data;
        },
        slotApplyFilters: function slotApplyFilters() {
            var self = this;
            if (!self.validateFilters()) {
                qxnw.utils.information("Debe poner una fecha inicial y final para consultar");
                return false;
            }
            var da = self.getDataThisForm();
            console.log("da", da);
            var data = {};
            data.filters = da;
            if (main.evalueData(self.parent.form.ui.ciudad)) {
                data.ciudad = self.parent.form.ui.ciudad.getValue();
            }
            console.log("slotApplyFilters:::data:::", data);
            var rpc = new qxnw.rpc(self.getRpcUrl(), "enrutamiento_masivo");
            rpc.setAsync(true);
            rpc.setShowLoading(true);
            var func = function (r) {
                console.log("slotApplyFilters:::response:::", r);
                self.setModelDragDrop(r);
            };
            rpc.exec("consulta", data, func);
        },
        setModelDragDrop: function setModelDragDrop(r, populate_plantilla, callback) {
            console.log("setModelDragDrop:::rrrrrrrrrr", r);
            var self = this;

            self.list1.removeAll();
            self.list2.removeAll();
            for (var i = 0; i < self.parent.allMarkersPasajeros.length; i++) {
                var mark = self.parent.allMarkersPasajeros[i];
                mark.setMap(null);
            }

            self.parent.countPasajerosHTML();

            if (typeof r === "undefined") {
                return false;
            }
            if (r === 0 || r === false || r.length === 0) {
                if (populate_plantilla !== true) {
//                    var msg = "No existen paradas/pasajeros ";
//                    if (main.evalueData(self.ui.fecha_inicial.getValue()) && main.evalueData(self.ui.fecha_fin.getValue())) {
//                        var fi = self.ui.fecha_inicial.getValue();
//                        var ff = self.ui.fecha_fin.getValue();
//                        msg += " entre las fechas " + fi + " y " + ff;
//                    }
//                    msg += " para enrutar";
//                    qxnw.utils.information(msg);
                }
                return false;
            }
            for (var i = 0; i < r.length; i++) {
                var dat = r[i];
                console.log("setModelDragDrop:::dat", dat);

                dat.id = dat.id + "_pasajeros";

                if (self.config.usa_origen_manual == "SI") {
                    var nombre_a = dat.origen_manual_direccion;
                    var nombre_b = dat.direccion_parada;
                    if (main.evalueData(dat.origen_manual_nombre)) {
                        nombre_a = dat.origen_manual_nombre;
                    }
                    dat.pasajero = nombre_a + " " + dat.origen_manual_direccion + " - "
;
                    if (main.evalueData(dat.nombre)) {
                        nombre_b = dat.nombre;
                    }
                    dat.pasajero += nombre_b + " " + dat.direccion_parada;
                    if (main.evalueData(dat.documento)) {
                        dat.pasajero += " - " + dat.documento;
                    }
                    if (main.evalueData(dat.observacion)) {
                        dat.pasajero += " - GUIA: " + dat.observacion;
                    }
                } else {
                    var nombre = dat.direccion_parada;
                    if (main.evalueData(dat.nombre)) {
                        nombre = dat.nombre;
                    }
                    dat.pasajero = nombre + " " + dat.direccion_parada;
                    if (main.evalueData(dat.documento)) {
                        dat.pasajero += " - " + dat.documento;
                    }
                    if (main.evalueData(dat.observacion)) {
                        dat.pasajero += " - " + dat.observacion;
                    }
                }

                var selectItem = new qxnw.widgets.listItem(dat.pasajero);
                dat.item_qxnw = selectItem;
                selectItem.setModel(dat);
                self.list1.add(selectItem);

                console.log("DAT::: ", dat)

                self.parent.creaMarkersEvaluePasajeros(dat);
            }

            self.parent.countPasajerosHTML();

            if (typeof callback !== "undefined") {
                if (qxnw.utils.evalueData(callback)) {
                    callback();
                }
            }

        }
    }
});
