qx.Class.define("qxnw.examples.maps", {
    extend: qxnw.treeWidget,
    construct: function () {
        var self = this;
        this.base(arguments);
        var filters = [
            {
                name: "buscar",
                label: "Filtro...",
                type: "textField"
            }
        ];
        self.createFilters(filters);

        self.createSettingsButton("contextMenuSettings");

        self.tabWidget.getChildControl("bar").setVisibility('visible');

        self.showTabView(1);

        var map = new qxnw.mapsWidget(self);
        map.setVisibleToolBar(true);
        map.setVisibleFiltersBar(true);
        map.setPoint("4.598056", "-74.075833", "prueba", true, null, true);
        self.addSubWindow("Mapa Ticket No " + "XX123334445", map);
    },
    destruct: function () {
    },
    members: {

    }
});