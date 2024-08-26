nw.Class.define("f_validaSoatVigente", {
    extend: nw.lists,
    construct: function (self) {
        if (self.debugConstruct) {
            console.log("START_LAUNCH:::::::::::::: f_validaSoatVigente");
        }
        var data = {};
        var vhei = self.vehiculo;
        if (vhei) {
            var fecha_actual = new Date();
            var fecha_tegno = new Date(vhei.fecha_vencimiento_soat);
            var dif = 0;
            var mes_actual = fecha_actual.getMonth() + 1;
            var mes_tegno = fecha_tegno.getMonth() + 1;
            var ano_actual = fecha_actual.getFullYear();
            var ano_tegno = fecha_tegno.getFullYear();
            if (ano_tegno == ano_actual && mes_tegno == mes_actual) {
                if (fecha_tegno >= fecha_actual) {
                    dif = (fecha_tegno.getDate() + 1) - fecha_actual.getDate();
                }
                if (dif == 0) {
                    self.inactiveVehiculo();
                }
                fecha_actual.setDate(fecha_actual.getDate() + 5);
                if (vhei.estado_activacion == "1" && fecha_tegno <= fecha_actual) {
                    var time = 59000;
                    var t = nw.createNotificacionBarInter({
                        addClass: "notifiVenici",
                        timeToRemove: time,
                        title: "<span style='color:#ed5851;font-size: 21px;'>Información.</span>",
                        body: "</br><div>el soat de tu vehiculo " + vhei.marca_text + " de placas " + vhei.placa + " esta por vencerce actualiza los datos de tu vehículo para evitar bloqueos.</div></br>\n\
                       <div style='text-align:center;'>Te quedan " + dif + " días.</div></br>\n\
                       <div style='display: flex;'><button style='width:150px;'>Aceptar</button></div>",
                        icon: false
                    });
                }
            }
        }
    },
    destruct: function () {
    },
    members: {
    }
});