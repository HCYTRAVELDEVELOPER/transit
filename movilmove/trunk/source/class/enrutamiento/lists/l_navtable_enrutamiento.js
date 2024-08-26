qx.Class.define("enrutamiento.lists.l_navtable_enrutamiento", {
    extend: qxnw.lists,
    construct: function (callbackOnAdd) {
        var self = this;
        self.callbackOnAdd = callbackOnAdd;
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
                label: self.tr("Pasajero sin ruta"),
                caption: "pasajero",
                type: "html",
                mode: "toolTip",
                colorHeader: "orange"
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
        var filters = [
            {
                name: "buscar",
                caption: "buscar",
                label: self.tr("Buscar"),
                type: "textField"
            },
            {
                name: "nuevo_pasajero",
                caption: "nuevo_pasajero",
                label: self.tr("Crear pasajeros"),
                type: "button"
            }
        ];
        self.createFilters(filters);
    },
    destruct: function () {
    },
    members: {
        setParamForm: function setParamForm() {
            var self = this;
        }
    }});
