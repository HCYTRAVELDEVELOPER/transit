function nwFormsMaker(form, divCon) {
    var classDocument = ".nwFormsMaker";
    if (evalueData(divCon)) {
        classDocument = divCon;
    }
    var self = createDocument(classDocument);
    var thisDoc = this;
    this.constructor = constructor;
    this.self = self;

    function constructor() {
        var rpc = {};
        rpc["service"] = "nwFormsMaker";
        rpc["method"] = "consulta";
        rpc["data"] = {id_enc: form};
        var func = function (ra) {
            if (!verifyErrorNwMaker(ra, self)) {
                return;
            }
            var r = ra.preguntas;
            var enc = ra.enc;
            var fields = [];
            if (r.length > 0) {
                var populates = [];
                for (var i = 0; i < r.length; i++) {
                    var f = r[i];
                    var name = stripTags(cleanName(f.nombre));
                    if (f.usar_name_submit == "SI" && evalueData(f.name_submit)) {
//                        name = stripTags(cleanName(f.name_submit));
                        name = f.name_submit;
                    }
//                    name = name.toLowerCase();
                    var tipo = f.tipo;
                    if (tipo == "checkbox") {
                        tipo = "checkBox";
                    }
                    var columnas =
                            {
                                tipo: tipo,
                                nombre: f.nombre,
                                name: name,
                                requerido: f.requerido,
                                texto_ayuda: f.texto_ayuda,
                                car_min: f.car_min,
                                car_max: f.car_max
                            };
                    fields.push(columnas);
                    if (tipo == "selectBox" || tipo == "checkBox" || tipo == "check" || tipo == "radio") {
                        var addPopulates =
                                {
                                    id: f.id,
                                    tipo: tipo,
                                    input: name,
                                    tabla_data: f.tabla_data,
                                    tabla_data_si_no: f.tabla_data_si_no
                                };
                        populates.push(addPopulates);
                    }
                }
                createNwForms(self, fields, "nopopup", enc);
                if (populates.length > 0) {
                    for (var p = 0; p < populates.length; p++) {
                        var pop = populates[p];
                        var id = pop["id"];
                        var input = pop["input"];
                        var tipo = pop["tipo"];
                        var tabla_data = pop["tabla_data"];
                        var tabla_data_si_no = pop["tabla_data_si_no"];
                        var data = {};
                        if (tipo === "selectBox") {
                            data = {};
                            data[""] = "Seleccione";
                            populateSelectFromArray(input, data);
                        }
                        if (tabla_data_si_no == "SI" && evalueData(tabla_data)) {
                            data = {};
                            data["table"] = tabla_data;
                            populateSelect(self, input, "nwprojectOut", "populate", data);
                        } else {
                            data = {};
                            data["id"] = id;
                            populateSelect(self, input, "nwFormsMaker", "populateOne", data);
                        }
                    }
                }
                setModal(self, false);
                setColumnsFormNumber(self, 1);
                var html = "<h1>" + enc.nombre + "</h1>";
                addHeaderNote(self, html);
                removeButtonsTitleForm(self);

                adapterSizeAndPositionDialogNw(selfOfDialog(self));
                setWidth(self, 700);

                var accept = addButtonNwForm("Enviar", self);
                accept.click(function () {
                    var data = getRecordNwForm(self);
                    if (!validateRequired(self)) {
                        return;
                    }
                    loading("Validando...", "rgba(255, 255, 255, 0.76)!important", self);

                    var table = $(self + " #nwform").attr("data-db");
                    fecha_insert_nwform = getDateHour();
                    if (enc.offline == "SI") {
                        //ENVÍO LA DATA A INDEXEDDB Y GUARDO LOCALMENTE function en file /nwproject/structure/js/nwdb.js
//        arreglaDataAdd(table, "#nwform");
                        arreglaDataAdd(table, self);
                    }

                    var data = getRecordNwForm(self);
                    var array = {};
                    var i = 0;
                    Object.keys(data).forEach(function (key) {
                        var h = getValue(self, key);
                        array[i] = {};
                        array[i]["campo"] = key;
                        array[i]["respuesta"] = h;
                        array[name] = h;
                        i++;
                    });
                    data["array"] = array;
                    data["id_enc"] = form;

                    var action = $(self).attr("data-action");
                    var action_func = $(self).attr("data-action-func");

                    if (action == "SI") {
                        window[action_func](array);
                    } else {
                        var rpc = {};
                        rpc["service"] = "nwFormsMaker";
                        rpc["method"] = "save";
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
                    }
                });
                removeLoadingNw();
            }
        };
        rpcNw("rpcNw", rpc, func, true, self);
    }
}