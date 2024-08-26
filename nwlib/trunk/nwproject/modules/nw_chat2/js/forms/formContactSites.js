$(document).ready(function () {
    var d = new formContactSites();
    d.constructor();
});

function formContactSites() {
    var classDocument = ".formContactSites";
    var self = createDocument(classDocument);
    var thisDoc = this;
    this.constructor = constructor;
    this.self = self;
    var get = getGET();

    function constructor(r) {
        var fields = [
            {
                tipo: 'textField',
                nombre: 'ID',
                name: 'id',
                visible: false
            },
            {
                tipo: 'textField',
                nombre: 'Nombre',
                name: 'nombre',
                requerido: "SI"
            },
            {
                tipo: 'textField',
                nombre: 'Email',
                name: 'email',
                requerido: "SI"
            },
            {
                tipo: 'textField',
                nombre: 'Teléfono',
                name: 'celular',
                requerido: "NO"
            },
            {
                tipo: 'selectBox',
                nombre: 'Sala',
                name: 'sala',
                requerido: "NO"
            },
            {
                tipo: 'textArea',
                nombre: 'Comentarios',
                name: 'mensaje'
            }
        ];
        createNwForms(self, fields, "popup");

        setModal(self, false);

        setColumnsFormNumber(self, 1);
        var html = "Formulario de Contacto";
        addHeaderNote(self, html);

        removeButtonsTitleForm(self);

        setRecord(self, get);

        adapterSizeAndPositionDialogNw(selfOfDialog(self));

//        setWidth(self, 700);
        var accept = addButtonNwForm("Enviar", self);
        accept.click(function () {
            if (!validateRequired(self)) {
                return;
            }
            loading("Validando...", "rgba(255, 255, 255, 0.76)!important", self);
            var data = getRecordNwForm(self);
            data.origen = "form_contact";
            data.domain = get.href;
            data.url = get.origin;
            data.id_sess = setDataSend();
            var rpc = {};
            rpc["service"] = "nwchat";
            rpc["method"] = "sendMessageDisconected";
            rpc["data"] = data;
            var func = function (r) {
                if (!verifyErrorNwMaker(r)) {
                    return;
                }
                resetForm(self);
                nw_dialog("Enviado correctamente.");
                removeLoading(self);
            };
            rpcNw("rpcNw", rpc, func, true);
        });
        removeLoadingNw();
    }
}
function setDataSend() {
    var get = getGET();
    return get.id + get.href;
}