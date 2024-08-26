nw.Class.define("f_z102_finalizarViaje_traecomisiones", {
    extend: nw.lists,
    construct: function (self, r, callback) {
        if (self.debugConstruct) {
            console.log("START_LAUNCH:::::::::::::: f_z102_finalizarViaje_traecomisiones");
        }
//            if (self.debugConstruct) {
        console.log("RESPONSE:::totalPorcentajes:::r", r);
//            }
        var up = nw.userPolicies.getUserData();
        var referidos_viaje = [];
        var ga = {};
        ga.comision_porcentaje = 0;
        ga.utilidad_conductor = 0;
        var porcent = 0;
        if (r.porcentaje != null && r.porcentaje != 'null' && r.porcentaje != '' && r.porcentaje != '0' && r.porcentaje != 0) {
            if (nw.evalueData(r.porcentaje)) {
                porcent = r.porcentaje;
            }
        }
//            if (parseFloat(self.valor_total) <= parseFloat(self.minima)) {
//                ga.total_valor = self.minima;
//            } else {
//                ga.total_valor = self.valor_total;
//            }
//            if (r.tarifa && r.tarifa == "FIJA") {
//                ga.total_valor = r.valor_total;
//            }
//            ga.utilidad_interna = ga.total_valor;
        ga.porcentaje = porcent;
        ga.porcentaje_empresa = 100 - parseFloat(porcent);
        ga.porcentaje_proveedor = porcent;
        if (porcent == "0") {
            ga.utilidad_interna = r.precio_viaje;
            ga.utilidad_conductor = 0;
        } else {
            ga.utilidad_conductor = parseFloat(r.precio_viaje) * parseFloat(porcent) / 100;
            ga.utilidad_interna = parseFloat(r.precio_viaje) - parseFloat(ga.utilidad_conductor);
//            ga.utilidad_conductor = parseFloat(self.data_service.precio_viaje) * parseFloat(porcent) / 100;
//            ga.utilidad_interna = parseFloat(self.data_service.precio_viaje) - parseFloat(ga.utilidad_conductor);

//            ga.utilidad_conductor = ga.utilidad_conductor.toFixed(2);
//            ga.utilidad_interna = ga.utilidad_interna.toFixed(2);
        }
        ga.comision_porcentaje = parseFloat(porcent);
        console.log("ga.utilidad_conductor " + ga.utilidad_conductor)
        console.log("ga.utilidad_interna " + ga.utilidad_interna)
        console.log("ga.comision_porcentaje " + ga.comision_porcentaje)
//        alert("porcent " + porcent);
//            ga.utilidad_interna = parseFloat(ga.total_valor) * parseFloat(porcent) / 100;
//            ga.utilidad_conductor = parseFloat(ga.total_valor) - parseFloat(ga.utilidad_interna);
        //VALIDAR PARA DAR SALDO A REFERIDO
//            if (ga.utilidad_interna > 0) {
//                if (nw.evalueData(r.code_referido_cliente)) {
//                    r.code_referido_cliente = JSON.parse(r.code_referido_cliente);
//                    if (r.code_referido_cliente.length > 0) {
//                        for (var i = 0; i < r.code_referido_cliente.length; i++) {
//                            var row_ref = r.code_referido_cliente[i];
//                            row_ref.nivel = i + 1;
//                            row_ref.usuario_referido = self.data_service.usuario;
//                            row_ref.perfil_usuario_referido = "1";
//                            referidos_viaje.push(row_ref);
//                        }
//                    }
//                }
//                if (nw.evalueData(up.code_referido)) {
//                    var code_referido_conductor = JSON.parse(up.code_referido);
//                    if (code_referido_conductor.length > 0) {
//                        for (var e = 0; e < code_referido_conductor.length; e++) {
//                            var row_ref = code_referido_conductor[e];
//                            row_ref.nivel = e + 1;
//                            row_ref.usuario_referido = self.data_service.conductor_usuario;
//                            row_ref.perfil_usuario_referido = "2";
//                            referidos_viaje.push(row_ref);
//                        }
//                    }
//                }
//            }
//            if (nw.evalueData(self.configCliente.numero_referidos) && nw.evalueData(self.configCliente.porcentaje_referido) && referidos_viaje.length > 0) {
//                var num_ref = referidos_viaje.length;
//                console.log(num_ref);
//                if (self.configCliente.numero_referidos > 0 && self.configCliente.porcentaje_referido > 0) {
//                    ga.utilidad_interna_neto = ga.utilidad_interna;
//                    ga.valor_referido = ga.utilidad_interna * parseInt(self.configCliente.porcentaje_referido) / 100;
//                    console.log(ga.valor_referido);
//                    ga.numero_referidos = num_ref;
//                    console.log(ga.numero_referidos);
//                    ga.utilidad_interna = ga.utilidad_interna - (ga.valor_referido * num_ref);
//                    console.log(ga.utilidad_interna);
//                    ga.referidos_viaje = referidos_viaje;
//                    ga.porcentaje_referidos = self.configCliente.porcentaje_referido;
//                    ga.bono_referido = self.configCliente.bono_referido;
//                }
//            }
        callback(ga);
    },
    destruct: function () {
    },
    members: {
    }
});