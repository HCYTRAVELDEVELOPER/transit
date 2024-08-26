<script>

    constructor();

    function constructor() {
        ////////////////////////////////////LISTADO MANUAL ///////////////////////////////////////
        var columns = [
            {
                label: "ID",
                caption: "id",
                visible: false
            },
            {
                label: "Nombre",
                caption: "nombre"
            },
            {
                label: "E-mail",
                caption: "email"
            },
            {
                label: "Usuario",
                caption: "usuario"
            },
            {
                label: "Estado",
                caption: "estado"
            },
            {
                label: "País",
                caption: "pais",
                visible: false
            }
        ];

        createList(columns);

//        var r = new Array();
//        for (var t = 0; t < 20; t++) {
//            r[t] = {"nombre": "Pedro Pepe es el número " + t, "id": t, "pais": t, "otro": "3", "usuario": "Mi usuario test"};
//        }
//        setModelData(r);

        var data = {};
        data["service"] = "nwprojectOut";
        data["method"] = "consultaDemo";
        ajax_nw_json("rpcNw", data, "setModelData");

        $(".btnNewForm").click(function() {
            newForm();
        });

        $(".btn-edit").click(function() {
            var data = getRecord(this);
            newForm(data);
        });

    }

    function newForm(r) {
        /////////////////////////////////////FORMULARIO MANUAL ///////////////////////////////////////////////////
        var fields = [
            {
                tipo: 'textField',
                nombre: 'ID',
                name: 'id',
                requerido: "NO",
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
                nombre: 'E-mail',
                name: 'email',
                requerido: "SI"
            },
            {
                tipo: 'textField',
                nombre: 'Usuario',
                name: 'usuario',
                requerido: "NO"
            },
            {
                tipo: 'selectBox',
                nombre: 'País',
                name: 'pais',
                requerido: "NO"
            },
            {
                tipo: 'selectBox',
                nombre: 'Estado',
                name: 'estado',
                requerido: "SI"
            }
        ];

        loadFormNwAll(fields);

        var data = {};
        data["table"] = "paises";
        populateSelect("pais", "nwprojectOut", "populate", data);

        data = {};
        data["activo"] = "Activo";
        data["inactivo"] = "Inactivo";
        populateSelectFromArray("estado", data);

        setRecord(r);

    }


</script>