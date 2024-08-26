qx.Class.define("qxnw.nw_chat.forms.f_salasPorUsuario", {
    extend: qxnw.forms,
    construct: function() {
        var self = this;
        this.base(arguments);
        this.setTitle("Agregar Nuevos Usuarios");
        this.createBase();
        var fields = [
            {
                name: "id",
                label: "ID",
                caption: "id",
                type: "textField",
                visible: false
            },
            {
                name: "nombre",
                label: "Nombre",
                caption: "nombre",
                type: "textField"
            },
            {
                name: "room",
                label: "Salas Disponibles",
                caption: "room",
                type: "selectBox"
            }];

       this.setFields(fields);
            var data = {};
        data.table = "nw_chat_rooms";
        
        qxnw.utils.populateSelectAsync(self.ui.room, "master", "populate", data);
        
        self.ui.accept.addListener("execute", function() {
            self.slotSave();
        });
        self.ui.cancel.addListener("execute", function() {
            self.reject();
        });
    },
    destruct: function() {
    },
    members:
            {
                slotSave: function slotSave() {
                    var self = this;
                    if (!self.validate())
                        {
                            return;
                        }
                    var data = this.getRecord();
                    var rpc = new qxnw.rpc(this.rpcUrl, "SalasPorUsuario");
                    rpc.exec("save", data);
                    if (rpc.isError()) {
                        qxnw.utils.error(rpc.getError(), self);
                        return;
                    }
                    self.accept();
                },
                setParamRecord: function setParamRecord(pr) {
                    var self = this;
                    self.setRecord(pr);
                    //self.ui.hora.setValueString(pr.hora);
                    return true;
                }
            }
})

