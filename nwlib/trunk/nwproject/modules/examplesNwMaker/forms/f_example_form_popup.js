function f_example_form_popup() {
    var self = createDocument(".f_example_form_popup");
    var thisDoc = this;
    this.constructor = constructor;
    this.updateContend = updateContend;
    this.self = self;
    function constructor(r) {
        var fields = [
            {
                tipo: 'textField',
                nombre: 'ID',
                name: 'id',
                requerido: "NO",
                visible: false
            },
            {
                title: "Sube tu archivo",
                mode: "horizontal",
                name_group: "contenedor_1",
                numberCols: "1",
                tipo: "startGroup"
            },
            {
                type: 'textField',
                nombre: 'textField',
                name: 'field_textField',
                requerido: "SI"
            },
            {
                type: 'selectTokenField',
                nombre: 'selectTokenField ciudades',
                name: 'field_token',
                requerido: "SI"
            },
            {
                tipo: 'label',
                nombre: 'Label',
                name: 'label',
                requerido: "SI"
            },
            {
                tipo: 'textArea',
                nombre: 'textArea',
                name: 'textarea',
                requerido: "SI"
            },
            {
                tipo: 'uploader',
                nombre: 'Archivo',
                name: 'ruta',
                requerido: "SI"
            },
            {
                tipo: 'selectBox',
                nombre: 'selectBox',
                name: 'compartir',
                requerido: "SI"
            },
            {
                tipo: 'selectBoxTwo',
                nombre: 'selectBoxTwo',
                name: 'pais',
                requerido: "SI"
            },
            {
                tipo: "endGroup"
            },
            {
                title: "navTable...",
                mode: "vertical",
                name_group: "contenedor_3",
                numberCols: "1",
                tipo: "startGroup"
            },
            {
                tipo: 'textField',
                nombre: 'Nombre',
                name: 'nombre',
                requerido: "NO"
            },
            {
                tipo: 'button',
                nombre: 'Agregar',
                name: 'agregar_a'
            },
            {
                tipo: "endGroup"
            },
            {
                title: "navTable 2...",
                mode: "vertical",
                name_group: "contenedor_4",
                numberCols: "1",
                tipo: "startGroup"
            },
            {
                tipo: "endGroup"
            }
        ];
        var typeForm = "popup";
        createNwForms(self, fields, typeForm);

        setColumnsFormNumber(self, 5);

        activeSelectTokenField(self, "field_token", "nwprojectOut", "populate", true, "ciudades", "nombre");

        $(self + " .uploader_ruta").attr("self-div", self + " #nwform");

        setModal(true);
        /*
         setWidth(self, 700);
         */

        var data = {};
        data["publico"] = "Público";
        data["solo_yo"] = "Solo yo";
        populateSelectFromArray("compartir", data);

        var data = {};
        data["table"] = "paises";
        populateSelect(self, "pais", "nwprojectOut", "populate", data, " order by nombre asc", true, true, true, function (aa) {
        }, false, true);

        onChangeSelectBoxTwo(function () {
            var pais = getValue(self, "pais");
            console.log(pais);
        });
        
        setValue(self, "ruta", "/nwlib6/icons/Accept-icon_16.png");

        listAddCssFor(self, ".contain_input_name_nombre", {"width": "auto"});
        listAddCssFor(self, ".contain_input_name_agregar_a", {"width": "auto"});

        loadJs("/nwlib6/nwproject/modules/examplesNwMaker/lists/l_navtable_example.js");
        loadJs("/nwlib6/nwproject/modules/examplesNwMaker/forms/f_navtable_example.js");
        var navTable = addNavTable(self, "contenedor_3", l_navtable_example);
        var btn = selfButton(self, "agregar_a");
        btn.click(function () {
//            var d = new f_navtable_example(navTable);
//            d.constructor();
            var data = getRecordNwForm(self);
            addRowNavTable(navTable, data);
            setValue(self, "nombre", "");
        });

        loadJs("/nwlib6/nwproject/modules/examplesNwMaker/lists/l_navtable_example_1.js");
        loadJs("/nwlib6/nwproject/modules/examplesNwMaker/forms/f_navtable_example_1.js");
        var navTableDos = addNavTable(self, "contenedor_4", l_navtable_example_1);


        var accept = addButtonNwForm("Guardar", self);
        var cancel = addButtonNwForm("Cancelar", self);
        cancel.click(function () {
            rejectForm(self, typeForm);
        });
        accept.click(function () {
            var data = getRecordNwForm(self);
            console.log(data);
            if (!validateRequired(self)) {
                return;
            }
            loading("Cargando", "rgba(255, 255, 255, 0.76)!important", self);
            data["nombre"] = nombre($(self + " .uploader_filenw").val());
            data["detalle"] = getDataNavTable(navTable);
            data["detalle_dos"] = getDataNavTable(navTableDos);
            console.log(data);
            removeLoading(self);
            return true;
//            var rpc = {};
//            rpc["service"] = "nw_drive";
//            rpc["method"] = "subir_file";
//            rpc["data"] = data;
//            var func = function (r) {
//                if (!verifyErrorNwMaker(r)) {
//                    return;
//                }
//                if (r) {
//                    var d = new l_files();
//                    d.updateContend();
//                    rejectForm(self, typeForm);
//                } else {
//                    nw_dialog("A ocurrido un error: " + r);
//                }
//                removeLoading(self);
//            };
//            rpcNw("rpcNw", rpc, func, true);
        });

        thisDoc.updateContend(r);

        var html = "<h3>Código:</h3>";
        html += "<iframe scrolling='auto' class='framecode' src='/nwlib6/nwproject/modules/examplesNwMaker/forms/f_example_form_popup.js' ></iframe>";
        addFooterNote(self, html);

        removeLoadingNw();
    }

    function updateContend(ra) {
        var ra = {};
        var r = "<strong>Hola</strong>";
        ra.textarea = r;
        ra.label = r;
        setRecord(self, ra);
    }

    function nombre(fic) {
        fic = fic.split('\\');
        return fic[fic.length - 1];
    }

}