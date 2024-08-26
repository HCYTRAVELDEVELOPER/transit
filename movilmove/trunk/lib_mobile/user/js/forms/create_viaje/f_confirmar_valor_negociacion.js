nw.Class.define("f_confirmar_valor_negociacion", {
    extend: nw.lists,
    construct: function (self, callback) {
        var up = nw.userPolicies.getUserData();
        var html = "";
        var options = {};
        options.setTitle = "Confirmar valor";
        options.id = "taskConfirmaTime";
        options.html = "<div class='titleconfirmatime'>Confirmar valor</div>";
        options.changeHash = true;
        options.showBack = true;
        options.closeBack = false;
        options.destroyAutomaticOnAccept = false;
        if (nw.isMobile()) {
            options.role = "page";
            options.transition = "slide";
        }
        options.fields = [];
        options.fields.push(
                {
                    label: "Confirma el valor del servicio",
                    name: "valorfijargrupo",
                    type: "startGroup"
                },
                {
                    name: "moneda",
                    label: "",
                    type: "label"
                },
                {
                    name: "valor_fijado",
                    label: "",
//                        placeholder: "Confirma el valor del servicio",
//                        mask: "1999.99",
//                        type: "textField",
                    type: "numeric",
                    required: true
                },
                {
                    type: "endGroup"
                }
        );

        var accept = function () {
            var data = ds.getRecord();
            console.log("data", data);
            if (!ds.validate()) {
                return false;
            }
            self.valor_total = parseFloat(data.valor_fijado);
            nw.remove(".container_valorfijo");
//                self.pedirVar = false;
            return callback();
        };
        var cancel = function () {
            self.pedirVar = false;
            nw.remove(".container_valorfijo");
            return true;
        };

        var d = nw.dialog("<div id='valorfijo' class='valorfijo'></div>", accept, cancel, {
            addClass: "container_valorfijo",
            original: true,
            destroyAutomaticOnAccept: false,
            iconAccept: "<i class='material-icons' style='top: 5px;position: relative;'>check_circle</i>",
            iconCancel: "<i class='material-icons' style='top: 5px;position: relative;'>cancel</i>"
        });
        options.showButtons = false;
        options.createInHome = true;
        options.canvas = "#valorfijo";
        options.id = "valorfijo_list";
        options.id_form = "valorfijo_list_int";
        var ds = nw.dialog2(html, false, false, options);

//            var val = nw.addNumber(self.valor_total);
//            console.log("val", val);
//            ds.ui.valor_fijado.setValue(val);
        ds.ui.moneda.setValue(config.moneda);
//        ds.ui.valor_fijado.setValue(self.valor_total);
        ds.ui.valor_fijado.focus();

        $(".valor_fijado").focus();
    },
    destruct: function () {
    },
    members: {
    }
});