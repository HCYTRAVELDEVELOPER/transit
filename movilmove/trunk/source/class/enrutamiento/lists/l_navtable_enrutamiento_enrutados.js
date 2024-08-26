qx.Class.define("enrutamiento.lists.l_navtable_enrutamiento_enrutados", {
    extend: qxnw.lists,
    construct: function () {
        var self = this;
        this.base(arguments);
        this.setButtonsAutomatic(true);
        this.createBase();
        var columns = [
            {
                label: self.tr("ID"),
                caption: "id",
                visible: false
            },
            {
                label: self.tr("Pasajero en ruta"),
                caption: "pasajero",
                type: "html",
                mode: "toolTip",
                colorHeader: "#0acf0a"
            },
            {
                label: self.tr("Nombre"),
                caption: "nombre",
                visible: false
            },
            {
                label: self.tr("Dirección"),
                caption: "direccion",
                visible: false
            },
            {
                label: self.tr("Latitud"),
                caption: "latitud",
                visible: false
            },
            {
                label: self.tr("Longitud"),
                caption: "longitud",
                visible: false
            }
        ];
        self.setColumns(columns);
//        var filters = [
//            {
//                name: "buscar",
//                caption: "buscar",
//                label: self.tr("Buscar"),
//                type: "textField"
//            }
//        ];
//        self.createFilters(filters);
    },
    destruct: function () {
    },
    members: {
        setParamForm: function setParamForm() {
            var self = this;
        }
    }});
