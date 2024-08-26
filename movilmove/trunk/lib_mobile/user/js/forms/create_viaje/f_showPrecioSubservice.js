nw.Class.define("f_showPrecioSubservice", {
    extend: nw.lists,
    construct: function (self, valor_estimado, iva, distancia, tiempo, servi, others, count) {

        var up = nw.userPolicies.getUserData();
        iva = valor_estimado * iva / 100;
//            console.log(valor_estimado);
        var valor_total = valor_estimado + iva;
//            console.log(valor_total);
        var saldo = up.saldo;
        var pri = "$";
        if (!nw.evalueData(valor_estimado)) {
            iva = "";
            pri = "";
            valor_estimado = "Por demanda";
            valor_total = "Por demanda";
        }
        if (self.cobro !== "LIBRE") {
            var val = "";
            var tol = valor_total;
            var descuento = self.getMaxDiscount(valor_total, servi.descuento_maximo);
            self.descuento = 0;
            if (descuento > 0) {
                self.descuento = descuento;
            }
            others.descuento = descuento;
//            tol = parseInt(tol);
            tol = parseFloat(tol);
            valor_total = tol;
        } else {
            var priceEnd = valor_total;
            if (valor_total !== "Por demanda") {
                if (valor_total > saldo) {
                    priceEnd = valor_total - saldo;
                }
            }
            self.valor_total = priceEnd;
        }
        if (nw.evalueData(servi.valor_mascota) && nw.evalueData(self.num_mascota)) {
//            valor_total = parseFloat(valor_total) + (parseInt(self.num_mascota) * parseInt(servi.valor_mascota));
            valor_total = parseFloat(valor_total) + (parseFloat(self.num_mascota) * parseFloat(servi.valor_mascota));
        } else {
            self.num_mascota = 0;
        }
        if (self.configCliente.app_para == "CARGA") {
            var datRetorno = self.detalle.ui.retorno.getValue();
            if (nw.evalueData(servi.retorno)) {
                if (nw.evalueData(datRetorno)) {
                    if (datRetorno == "true" || datRetorno == true || datRetorno == 1) {
//                        valor_total = parseFloat(valor_total) + parseInt(servi.retorno);
                        valor_total = parseFloat(valor_total) + parseFloat(servi.retorno);
//                            console.log(datRetorno.retorno);
                    }
                }
            }
            var datCargue = self.detalle.ui.cargue.getValue();
            if (nw.evalueData(servi.cargue)) {
                if (nw.evalueData(datCargue)) {
                    if (datCargue == "true" || datCargue == true || datCargue == 1) {
//                        valor_total = parseFloat(valor_total) + parseInt(servi.cargue);
                        valor_total = parseFloat(valor_total) + parseFloat(servi.cargue);
//                            console.log(datCargue.cargue);
                    }
                }
            }
            var datDesCargue = self.detalle.ui.descargue.getValue();
            if (nw.evalueData(servi.descargue)) {
                if (nw.evalueData(datDesCargue)) {
                    if (datDesCargue == "true" || datDesCargue == true || datDesCargue == 1) {
//                        valor_total = parseFloat(valor_total) + parseInt(servi.descargue);
                        valor_total = parseFloat(valor_total) + parseFloat(servi.descargue);
//                            console.log(datCargue.descargue);
                    }
                }
            }

            var datvalorDeclarado = self.detalle.ui.valor_declarado.getValue();
            if (nw.evalueData(servi.porcentaje_valor_declarado)) {
                if (nw.evalueData(datvalorDeclarado)) {
                    if (datvalorDeclarado != "") {
//                        var declarado = (parseInt(servi.porcentaje_valor_declarado) * parseInt(datvalorDeclarado)) / 100;
                        var declarado = (parseFloat(servi.porcentaje_valor_declarado) * parseFloat(datvalorDeclarado)) / 100;
//                        valor_total = parseFloat(valor_total) + parseInt(declarado);
                        valor_total = parseFloat(valor_total) + parseFloat(declarado);
                    }
                }
            }
        }
        console.log("valor_total", valor_total);
        valor_total = parseFloat(valor_total);
        valor_total = valor_total.toFixed(2);
        console.log("valor_total", valor_total);
        self.valor_total = valor_total;
    },
    destruct: function () {
    },
    members: {
    }
});