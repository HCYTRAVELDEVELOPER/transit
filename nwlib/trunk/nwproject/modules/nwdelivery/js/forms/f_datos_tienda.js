function f_datos_tienda(referer) {
    var classDocument = ".f_datos_tienda";
    createContainer(".container-main-nwdelivery", true, classDocument);
    var self = createDocument(classDocument);
    var thisDoc = this;
    this.constructor = constructor;
    this.self = self;
    function constructor(r) {
        var fields = [
            {
                tipo: 'label',
                nombre: 'Tiempo de entrega aproximado',
                name: 'tiempo_entrega_aproximada'
            },
            {
                tipo: 'label',
                nombre: 'Pedido mínimo',
                name: 'pedido_minimo'
            }
        ];
        createNwForms(self, fields, "nopopUp");
        $(".addDivConverted").css({"margin-top": "60px", "margin-bottom": "100px"});
        remove(".ui-dialog-titlebar-close");
        setMaxWidth(self, 800);
        var up = getUserInfo();
        $(".footerButtonsNwForms").remove();
        $(".divSendNwForm").remove();
//        listAddCssFor(self, ".divContainInput p", {"display": "none"});
        var rpca = {};
        rpca["service"] = "nwdelivery";
        rpca["method"] = "consultaDataTienda";
        var funcc = function (r) {
            console.log(r);
            setRecord(self, r);
        };
        rpcNw("rpcNw", rpca, funcc, true);

    }
}