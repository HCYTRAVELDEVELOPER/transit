function multiTerminalNw() {
    var self = createDocument(".multiTerminalNw");
    var thisDoc = this;
    this.constructor = constructor;
    this.updateContend = updateContend;
    this.newPopulate = newPopulate;
    this.self = self;

    function constructor(r) {
        var rpc = {};
        rpc["service"] = "nwMaker";
        rpc["method"] = "consultaTerminalesAdicionales";
        var func = function (r) {
            if (r === false) {
                remove(".changeTerminalMakerBtn");
                $("html").append("<style>.changeTerminalMakerBtn{display:none!important;}</style>");
                return;
            }

            var fields = [
                {
                    tipo: 'selectBox',
                    nombre: 'Terminal',
                    name: 'terminal',
                    requerido: "SI"
                }
            ];

            var typeForm = "popup";
            createNwForms(self, fields, typeForm);

            setColumnsFormNumber(self, 1);

            addHeaderNote(self, "<h3>Selecciona la terminal con la que deseas trabajar.</h3>");

            setModal(true);

            var up = getUserInfo();

            var data = {};
            data[""] = "Seleccione";
            populateSelectFromArray("terminal", data);

            var data = {};
            for (var i = 0; i < r.length; i++) {
                var p = r[i];
                data[p["terminal_asociada"]] = p["nombre"];
            }
            populateSelectFromArray("terminal", data);

            var accept = addButtonNwForm("Guardar", self);
            var cancel = addButtonNwForm("Cancelar", self);

            cancel.click(function () {
                reloadPageRaiz();
            });

            accept.click(function () {
                if (!validateRequired(self)) {
                    return;
                }
                var data = getRecordNwForm(self);
                var rpc = {};
                rpc["service"] = "nwMaker";
                rpc["method"] = "saveTerminalAdicional";
                rpc["data"] = data;
                var func = function (r) {
                    reloadPageRaiz();
                };
                rpcNw("rpcNw", rpc, func, true);
            });

/*
        thisDoc.updateContend(r);
 */

            removeLoadingNw();

        };
        rpcNw("rpcNw", rpc, func, true);
    }

    function newPopulate(ra) {
        setValue(self, "grupo", ra);
    }

    function updateContend(ra) {
        var up = getUserInfo();
        if (evalueData(ra)) {
            setRecord(self, ra);
        } else {
            var r = {};
            r["asignado_a"] = up.id_usuario;
            r["fecha"] = getFechaHoy();
            r["hora"] = traerHoraActual();
            setRecord(self, r);
        }
    }

}