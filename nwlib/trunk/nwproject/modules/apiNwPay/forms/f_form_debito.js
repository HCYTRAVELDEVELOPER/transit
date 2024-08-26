function f_form_debito(p) {
    var self = createDocument(".f_form_debito");
    var thisDoc = this;
    this.constructor = constructor;
    this.updateContend = updateContend;
    this.self = self;
    var up = getUserInfo();
    function constructor(r) {
        var fields = [
            {
                title: "Pago Tarjeta Débito",
                mode: "horizontal",
                name_group: "contenedor_1",
                numberCols: "1",
                tipo: "startGroup"
            },
            {
                tipo: 'label',
                mode: 'money',
                nombre: 'Total',
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
        x["price_segure"] = p.price_segure;
        if (evalueData(p["serviceResponse"]) && evalueData(p["methodResponse"])) {
            x["serviceResponse"] = p["serviceResponse"];
            x["methodResponse"] = p["methodResponse"];
        }
        rpc["data"] = x;
        var func = function (r) {
            if (!verifyErrorNwMaker(r)) {
                console.log(r);
                return;
            }
            if ("error" == r || false == r) {
                nw_dialog("Ocurrió un error con su pago, inténtelo nuevamente");
                reject(self);
                return;
            }
            var data = getRecordNwForm(self);
            var descriptionGeneral = "Pago Payu. ";
            if (evalueData(data["descripcion"])) {
                descriptionGeneral = data["descripcion"];
            }
            descriptionGeneral += " Ref: " + r["referencia"];
            setValue(self, "descripcion", descriptionGeneral);
            var buyerEmail = up["email"];
            var buyerFullName = up["nombre"] + " " + up["apellido"];
            var payerFullName = buyerFullName;
            var payerEmail = buyerEmail;

            var html = "";
            html += "<form method='post' action='" + r["action"] + "' id='form_payu' >";
            html += "<input name='merchantId'    type='hidden'  value='" + r["merchantId"] + "'   >";
            html += "<input name='accountId'     type='hidden'  value='" + r["accountId"] + "' >";
            html += "<input name='description'   type='hidden'  value='" + descriptionGeneral + "'  >";
            html += "<input name='referenceCode' id='referenceCode' type='hidden'  value='" + r["referencia"] + "' >";
            html += "<input name='amount' class='btn-inactive'   id='valor_total_pay'  type='hidden'  value='" + r["price"] + "'   >";
            html += "<input name='tax'           type='hidden'  value='0'  >";
            html += "<input name='taxReturnBase' type='hidden'  value='0' >";
            html += "<input name='currency'      type='hidden'  value='COP' >";
            html += "<input name='lng' type='hidden' value='es'/>";
            html += "<input name='sourceUrl' id='urlOrigen' value='' type='hidden'/>";
            html += "<input name='signature'     type='hidden'  value='" + r["signature"] + "'  >";
            html += "<input name='test'  type='hidden'  value='false' >";
            html += "<input name='buyerEmail'    type='hidden'  value='" + buyerEmail + "' >";
            html += "<input name='responseUrl'    type='hidden'  value='" + r["pagina_de_respuesta"] + "' >";
            html += "<input name='confirmationUrl'    type='hidden'  value='" + r["confirmationUrl"] + "' >";
            html += "<input name='buyerEmail'    type='hidden'  value='" + buyerEmail + "' >";
            html += "<input name='buyerFullName'    type='hidden'  value='" + buyerFullName + "' >";
            html += "<input name='payerFullName'    type='hidden'  value='" + payerFullName + "' >";
            html += "<input name='payerEmail'    type='hidden'  value='" + payerEmail + "' >";
            html += "</form>";
            addFooterNote(self, html);


            if (evalueData(p.service) && evalueData(p.method)) {
                var rpc = {};
                rpc["service"] = p.service;
                rpc["method"] = p.method;
                var g = p.data;
                g["dataPayNw"] = r;
                g["tipo_pago"] = "debito";
                rpc["data"] = g;
                var func = function (rb) {
                    if (!verifyErrorNwMaker(r)) {
                        console.log(rb);
                        return;
                    }
                    if (evalueData(p.callBack)) {
                        var h = {};
                        h["dataInitial"] = p.data;
                        h["dataResultTransaction"] = r;
                        h["responseYourService"] = rb;
                        h["self"] = self;
                        p.callBack(h);
                    }
                    newRemoveLoading(self);
                };
                rpcNw("rpcNw", rpc, func, true);
            } else {
                newRemoveLoading(self);
            }


            accept.click(function () {
                if (!validateRequired(self)) {
                    return;
                }
                var data = getRecordNwForm(self);
                loading("Procesando...", "rgba(255, 255, 255, 0.76)!important", false);
                var rpc = {};
                rpc["service"] = "nwMaker";
                rpc["method"] = "insertPayNwPay";
                rpc["data"] = {refPayNw: r["refPayNw"]};
                rpc["data"]["card"] = data;
                var func = function (r) {
                    if (!verifyErrorNwMaker(r) || verifyErrorNwMaker(r) == 0) {
                        console.log(r);
                        return;
                    }
                    submitForm("#form_payu");
                    return;
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