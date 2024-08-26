function f_usuarios_compartidos() {
    var self = createDocument(".f_usuarios_compartidos");
    var thisDoc = this;
    this.constructor = constructor;
    this.updateContend = updateContend;
    this.self = self;
    function constructor(r) {
        var fields = [
            {
                tipo: 'selectTokenField',
                nombre: 'Nombre, usuario o correo',
                name: 'usuario_cliente',
                placeholder: 'Digita el usuario o nombre',
                requerido: "SI"
            }
        ];
        var typeForm = "popup";
        createNwForms(self, fields, typeForm);
        setColumnsFormNumber(self, 1);
        setModal(true);
        setWidth(self, 700);
        /*        populateSelect(self, "usuario_cliente", "nwMaker", "populateSelectUsuariosCompartidos", false);*/
        activeSelectTokenField(self, "usuario_cliente", "nwMaker", "populateSelectUsuariosCompartidos");
        var accept = addButtonNwForm("Guardar", self);
        var cancel = addButtonNwForm("Cancelar", self);
        cancel.click(function () {
            rejectForm(self, typeForm);
        });
        accept.click(function () {
            if (!validateRequired(self)) {
                return;
            }
            var data = getRecordNwForm(self);
            var rpc = {};
            rpc["service"] = "nwMaker";
            rpc["method"] = "saveUsuariosCompartidos";
            rpc["data"] = data;
            var func = function (r) {
                console.log(r);
                if (!verifyErrorNwMaker(r, self) || verifyErrorNwMaker(r, self) == 0) {
                    return;
                }
                if (r == "enesperadeaprobacion") {
                    nw_dialog("Ya lo asociaste pero no te ha aprobado.");
                    return;
                }
                if (r == "yaexiste") {
                    nw_dialog("Este usuario ya se encuentra sociado");
                    return;
                }
                rejectForm(self, typeForm);
                var d = new l_usuarios_compartidos();
                d.updateContend();
            };
            rpcNw("rpcNw", rpc, func);
        });
        thisDoc.updateContend(r);
        removeLoadingNw();
    }
    function updateContend(ra) {
        setRecord(self, ra);
    }
}