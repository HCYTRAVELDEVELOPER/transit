function f_showTerminosCondicionesNwMaker() {
    var self = createDocument(".f_showTerminosCondicionesNwMaker");
    var thisDoc = this;
    this.constructor = constructor;
    this.self = self;

    function constructor(r) {
        var rpc = {};
        rpc["service"] = "nwMaker";
        rpc["method"] = "consultaSiAceptoTerminos";
        var func = function (r) {
            if (r === true) {
                return;
            }
            var fields = [];
            var typeForm = "popup";
            createNwForms(self, fields, typeForm);
            setColumnsFormNumber(self, 1);
            addHeaderNote(self, "<h3 class='titleTermsAnd'>Antes de continuar por favor acepta nuestros términos y condiciones</h3><div class='containerTermsAndConds'>" + r["html"] + "</div>");
            setModal(true);

            addCss(self, ".containerTermsAndConds", {"position": "relative", "max-height": "300px", "overflow": "hidden", "overflow-y": "auto", "font-size": "12px", "color": "#565656"});
            addCss(self, ".titleTermsAnd", {"margin": "10px", "text-align": "center"});

            setTimeout(function () {
                remove(".containDialogNwForm_f_showTerminosCondicionesNwMaker .ui-dialog-titlebar-close");
            }, 1000);

            var accept = addButtonNwForm("Acepto los términos y condiciones", self);

            accept.click(function () {
                if (!validateRequired(self)) {
                    return;
                }
                var data = getRecordNwForm(self);
                var rpc = {};
                rpc["service"] = "nwMaker";
                rpc["method"] = "saveAceptoTerminosCondiciones";
                rpc["data"] = data;
                var func = function (r) {
                    reloadPageRaiz();
                };
                rpcNw("rpcNw", rpc, func, true);
            });
            removeLoadingNw();
        };
        rpcNw("rpcNw", rpc, func, true);
    }
}