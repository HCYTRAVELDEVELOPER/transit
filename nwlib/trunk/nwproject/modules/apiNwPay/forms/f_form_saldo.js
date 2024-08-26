function f_form_saldo(p) {
    var self = createDocument(".f_form_saldo");
    var thisDoc = this;
    this.constructor = constructor;
    this.updateContend = updateContend;
    this.self = self;
    var up = getUserInfo();
    function constructor(r) {
        var fields = [
            {
                title: "Pago con Saldo",
                mode: "horizontal",
                name_group: "contenedor_1",
                numberCols: "1",
                tipo: "startGroup"
            },
            {
                tipo: 'label',
                mode: 'money',
                nombre: 'Saldo Actual',
                name: 'saldo',
                required: true,
                enabled: false
            },
            {
                tipo: 'label',
                mode: 'money',
                nombre: 'Total a pagar',
                name: 'price',
                required: true,
                enabled: false
            },
            {
                tipo: 'label',
                nombre: 'Descripción',
                name: 'descripcion',
                required: true,
                enabled: false
            },
            {
                tipo: "endGroup"
            }
        ];

        var typeForm = "popup";
        createNwFormsNew(self, fields, typeForm);
        setColumnsFormNumber(self, 2);
        setModal(true);
        setWidth(self, 700);

        var accept = addButtonNwForm("Pagar", self);
        var cancel = addButtonNwForm("Cancelar", self);
        cancel.click(function () {
            rejectForm(self, typeForm);
        });

        newLoading(self, "Procesando", false, "allWindow");

        var rpc = {};
        rpc["service"] = "nwMaker";
        rpc["method"] = "getConfigPayuNw";
        var x = {};
        x["price"] = p.price;
        x["tipo"] = "SALDO";
        x["price_segure"] = p.price_segure;
        rpc["data"] = x;
        var func = function (r) {
            console.log(r);
            if (!verifyErrorNwMaker(r)) {
                console.log(r);
                return;
            }
            if ("errorconprecios" == r) {
                nw_dialog("Ocurrió un error con los precios en su pago, inténtelo nuevamente");
                reject(self);
                return;
            }
            if ("notienesaldo" == r) {
                nw_dialog("No tiene saldo disponible.");
                reject(self);
                return;
            }
            if ("error" == r || false == r) {
                nw_dialog("Ocurrió un error con su pago, inténtelo nuevamente");
                reject(self);
                return;
            }
            if ("saldonoalzanza" == r) {
                nw_dialog("Lo sentimos, su saldo actual no alcanza a cubrir la compra.");
                reject(self);
                return;
            }
            var data = getRecordNwForm(self);
            var descriptionGeneral = "Pago con Saldo a favor. ";
            if (evalueData(data["descripcion"])) {
                descriptionGeneral = data["descripcion"];
            }
            descriptionGeneral += " Ref: " + r["referencia"];
            setValue(self, "descripcion", descriptionGeneral);
            setValue(self, "saldo", r["saldo"]);

            newRemoveLoading(self);

            accept.click(function () {
                if (!validateRequired(self)) {
                    return;
                }
                var data = getRecordNwForm(self);
                loading("Procesando...", "rgba(255, 255, 255, 0.76)!important", self);
//                newLoading(self, "Procesando", false, "allWindow");
                var rpc = {};
                rpc["service"] = "nwMaker";
                rpc["method"] = "insertPayNwPay";
                var po = {};
                po["refPayNw"] = r["refPayNw"];
                po["estado"] = "PAGADO_CON_SALDO";
                rpc["data"] = po;
                rpc["data"]["card"] = data;
                var func = function (ra) {
                    if (!verifyErrorNwMaker(ra) || verifyErrorNwMaker(ra) == 0) {
                        nw_dialog("Ha ocurrido un error");
                        console.log(ra);
                        return;
                    }
                    if (evalueData(p.service) && evalueData(p.method)) {
                        var rpc = {};
                        rpc["service"] = p.service;
                        rpc["method"] = p.method;
                        var g = p.data;
                        g["dataPayNw"] = ra;
                        g["tipo_pago"] = "saldo";
                        rpc["data"] = g;
                        var func = function (rb) {
                            if (!verifyErrorNwMaker(r)) {
                                console.log(rb);
                                return;
                            }
                            if (evalueData(p.callBack)) {
                                var h = {};
                                h["dataInitial"] = p.data;
                                h["dataResultTransaction"] = ra;
                                h["responseYourService"] = rb;
                                h["self"] = self;
                                p.callBack(h);
                                reject(self);
                            }
                            newRemoveLoading(self);
                        };
                        rpcNw("rpcNw", rpc, func, true);
                    } else {
                        nw_dialog("Operación realizada exitosamente");
                        newRemoveLoading(self);
                        reject(self);
                    }
                };
                rpcNw("rpcNw", rpc, func, true);
            });

        };
        rpcNw("rpcNw", rpc, func, true);

        thisDoc.updateContend(p);
        removeLoadingNw();
    }

    function updateContend(ra) {
        var r = up;
        r["price"] = ra["price"];
        setRecord(self, r);
    }

}