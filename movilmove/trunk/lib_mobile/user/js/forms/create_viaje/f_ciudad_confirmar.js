nw.Class.define("f_ciudad_confirmar", {
    extend: nw.lists,
    construct: function (self_crearviaje) {
        var self = this;

        nw.remove(".popup_pil");

        self.self_crearviaje = self_crearviaje;
        self.saveConfirmaCiudad();
    },
    destruct: function () {
    },
    members: {
        saveConfirmaCiudad: function saveConfirmaCiudad() {
            var self = this;
            var html = "";
            var options = {};
            options.setTitle = "Confirmar ciudad";
            options.id = "taskConfirmaCiudad";
            options.html = "<div class='titleconfirmatime'>Confirma el tiempo que duraste para finalizar esta tarea</div>";
            options.changeHash = true;
            options.showBack = true;
            options.closeBack = false;
            options.destroyAutomaticOnAccept = false;
            if (nw.isMobile()) {
                options.role = "page";
                options.transition = "slide";
            }
            options.fields = [
                {
                    name: "texto_confirmar_ciudad",
                    label: "No hemos podido ubicar tu ciudad",
                    type: "html"
                },
                {
                    name: "ciudad",
                    label: "Busca tu ciudad actual",
                    placeholder: "Digita tu ciudad",
                    type: "search",
                    autocomplete: true,
                    required: true
                }
            ];
            var accept = function () {
                if (!d.validate()) {
                    return false;
                }
//                var data = d.getRecord();
//                console.log("data", data);
//                console.log("data.ciudad_all_data", data.ciudad_all_data);
//                self.self_crearviaje.ciudad_origen = data.ciudad_all_data.nombre;
                console.log("self.ciudad_all_data", self.ciudad_all_data);
                self.self_crearviaje.ciudad_origen = self.ciudad_all_data.nombre;
                nw.remove("." + d.id);
                nw.remove(".pruebauno_container");
                return true;
            };
//            var cancel = function () {
//                nw.remove(".pruebauno_container");
//                return true;
//            };

            nw.dialog("<div id='pruebauno' class='pruebauno'></div>", accept, false, {
                addClass: "pruebauno_container",
                original: true,
                destroyAutomaticOnAccept: false
            });
            options.showButtons = false;
            options.createInHome = true;
            options.canvas = "#pruebauno";
            options.id = "pruebauno_list";
            options.id_form = "pruebauno_list_int";
            var d = nw.dialog2(html, false, false, options);

//            var data = {};
//            data[""] = "Seleccione";
//            d.ui.ciudad.populateSelectFromArray(data);
//            d.ui.ciudad.populateSelect('app_user', 'populateCiudades', {}, function (a) {
//
//            }, true);


            var data = {};
            data.service = "app_user";
            data.method = "populateCiudades";
            data.showsinresult = true;
            d.ui.ciudad.actionSearch(data);
            d.ui.ciudad.addListener("clickToken", function (e) {
                var thi = e;
                console.log(thi);
                if (!thi.data) {
                    nw.cleanTokenField();
                    return false;
                }
                self.ciudad_all_data = thi.data.row;
                d.ui.ciudad.setValue(thi.data.row.nombre);
            });

            $(".ciudad").focus();

        },
        save: function save() {
            var self = this;
            if (!self.validate()) {
                return false;
            }
            var data = self.getRecord(true);
            console.log("data", data);
        },
        populate: function populate(pr) {
            var self = this;
            self.setRecord(pr);
        }
    }
});