nw.Class.define("f_registro_rotulos", {
    extend: nw.lists,
    construct: function (canvas, pr) {
        var self = this;
        var up = nw.userPolicies.getUserData();
        var html = "";
        var options = {};
        options.setTitle = "Confirmar registro Rotulos";
        options.id = "f_registro_rotulos";
        options.html = "<div class='registro_rotulos'>Confirmar registro Rotulos</div>";
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
                    label: "",
                    name: "rotulos",
                    type: "startGroup",
                    mode: "grid"
                },
                {
                    name: "num_rotulo",
                    label: "Num Rotulo",
                    type: "textField",
                    enabled: false,
                    width: 100,
                    row: 0,
                    column: 1
                },
                {
                    name: "unidades",
                    label: "Unidades",
                    type: "textField",
                    enabled: false,
                    width: 200,
                    row: 0,
                    column: 1
                },
                {
                    name: "estado",
                    label: "Estado",
                    type: "textField"
                },
                {
                    name: "fecha_creacion",
                    label: "Fecha Creacion",
                    type: "textField",
                    enabled: false,
                    visible: false
                },
                {
                    name: "fecha_hora_despacho",
                    label: "Fecha Hora Despacho",
                    type: "textField",
                    enabled: false,
                    visible: false
                },
                {
                    name: "peso_real",
                    label: "Peso",
                    type: "textField"
                },
                {
                    name: "alto",
                    label: "Alto",
                    type: "textField"
                },
                {
                    name: "ancho",
                    label: "Ancho",
                    type: "textField"
                },
                {
                    name: "largo",
                    label: "largo",
                    type: "textField"
                },
                {
                    name: "peso_volumen",
                    label: "Volumen",
                    type: "textField"
                },
                {
                    name: "estado_cliente",
                    label: "Estado Cliente",
                    type: "textField",
                    visible: false
                },
                {
                    name: "valor_declarado",
                    label: "Valor Declarado",
                    type: "textField",
                    visible: false
                },
                {
                    name: "verificado",
                    label: "Verificado",
                    type: "textField",
                    visible: false
                },
                {
                    name: "codigo_barras",
                    label: "Codigo Barras",
                    type: "textField",
                    visible: false
                },
                {
                    name: "unidad",
                    label: "Unidad",
                    type: "textField",
                    enabled: false
                },
                {
                    type: "endGroup"
                }
        );
        options.fields.push(
                {
                    label: "",
                    name: "otros_rotulos",
                    type: "startGroup"
                },
                {
                    type: "endGroup"
                }
        );


        var accept = function () {
            return save("normal");
        };
        var cancel = function () {
            nw.remove(".pruebauno_container_rotulos");
            return true;
        };

        var d = nw.dialog("<div id='pruebaunorotulos' class='pruebaunorotulos'></div>", accept, cancel, {
            addClass: "pruebauno_container_rotulos",
            original: true,
            destroyAutomaticOnAccept: false,
            iconAccept: "<i class='material-icons' style='top: 5px;position: relative;'>check_circle</i>",
            iconCancel: "<i class='material-icons' style='top: 5px;position: relative;'>cancel</i>"
        });
        options.showButtons = false;
        options.createInHome = true;
        options.canvas = "#pruebaunorotulos";
        options.id = "pruebauno_rotulos_list";
        options.id_form = "pruebauno_rotulos_list_int";
        self.d = nw.dialog2(html, false, false, options);
        self.d.setRecord(pr);

        function save(mode) {
            if (!self.d.validate()) {
                return false;
            }
            var data = self.d.getRecord();
            console.log("SAVE::", data)
            data.appliFilters = "NO";
            canvas.addRow(data, false, "prepend");
            canvas.removeRow(canvas.activeRow);
            d.remove();
        }

        return self;
    },
    destruct: function () {
    },
    members: {
        test: function test() {
            var self = this;
        }
    }
});