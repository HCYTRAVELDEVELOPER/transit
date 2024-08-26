qx.Class.define("booking.tree.menu", {
    extend: qxnw.treeWidget,
    construct: function () {
        this.base(arguments);
        var self = this;
        self.setGroupHeader("Booking travel - Menú");
        self.setTitle("Booking travel - Menú");
        self.config = main.getConfiguracion();


        if (self.config.booking_activo != "SI") {
            qxnw.utils.information("El módulo Booking no está activo para esta cuenta. Consulte con su asesor comercial Movilmove.");
            return false;
        }
        if (main.isCustomer()) {
            qxnw.utils.information("No tiene permisos para portal clientes.");
            return false;
        }

        self.pages = [];
        self.items = [];
        self.populateTree();
    },
    members: {
        populateTree: function populateTree() {
            var self = this;
            self.addTreeHeader(self.tr("Booking"), qxnw.config.execIcon("view-sort-descending"));

            var bt = self.addTreeFolder("Offered", qxnw.config.execIcon("list-add", "actions"), 0, true);
            bt.addListener("click", function () {
                var model = this.getModel();
                if (self.parent_2 == null) {
//                    qxnw.utils.loading("Cargando...");
//                    var interval = setInterval(function () {
                    self.parent_2 = new booking.lists.l_booking_getavailableoffers();
                    var page = self.addSubWindow("Offered", self.parent_2);
                    page.addListener("close", function () {
                        self.parent_2 = null;
                    });
                    page.setShowCloseButton(true);
                    self.pages["parent_2"] = page;
//                        var page_envia = self.parent_2;
//                        self.updateSubWindowsPage(model, page_envia);
//                        clearInterval(interval);
//                        qxnw.utils.stopLoading();
//                    }, 100);
                } else {
//                    qxnw.utils.loading("Cargando...");
//                    var interval = setInterval(function () {
                    self.selectPage(self.pages["parent_2"]);
//                        self.updateSubWindowsPage(model);
//                        clearInterval(interval);
//                        qxnw.utils.stopLoading();
//                    }, 100);
                }
            });

            var bt = self.addTreeFolder("Accepted", qxnw.config.execIcon("list-add", "actions"), 0, true);
            bt.addListener("click", function () {
                var model = this.getModel();
                console.log("model", model);
                if (self.parent_3 == null) {
//                    qxnw.utils.loading("Cargando...");
//                    var interval = setInterval(function () {
                    self.parent_3 = new booking.lists.l_booking_searchjourneys();
                    var page = self.addSubWindow("Accepted", self.parent_3);
                    page.addListener("close", function () {
                        self.parent_3 = null;
                    });
                    page.setShowCloseButton(true);
                    self.pages["parent_3"] = page;

//                        var page_envia = self.parent_3;
//                        self.updateSubWindowsPage(model, page_envia);

//                        clearInterval(interval);
//                        qxnw.utils.stopLoading();
//                    }, 100);
                } else {
//                    qxnw.utils.loading("Cargando...");
//                    var interval = setInterval(function () {
                    self.selectPage(self.pages["parent_3"]);

//                        self.updateSubWindowsPage(model);

//                    clearInterval(interval);
//                        qxnw.utils.stopLoading();
//                    }, 100);
                }
            });

            var bt = self.addTreeFolder("Cancelled", qxnw.config.execIcon("list-add", "actions"), 0, true);
            bt.addListener("click", function () {
                var model = this.getModel();
                console.log("model", model);
                if (self.parent_4 == null) {
//                    qxnw.utils.loading("Cargando...");
//                    var interval = setInterval(function () {
                    self.parent_4 = new booking.lists.l_booking_cancelled();
                    var page = self.addSubWindow("Cancelled", self.parent_4);
                    page.addListener("close", function () {
                        self.parent_4 = null;
                    });
                    page.setShowCloseButton(true);
                    self.pages["parent_4"] = page;

//                        var page_envia = self.parent_4;
//                        self.updateSubWindowsPage(model, page_envia);

//                        clearInterval(interval);
//                        qxnw.utils.stopLoading();
//                    }, 100);
                } else {
//                    qxnw.utils.loading("Cargando...");
//                    var interval = setInterval(function () {
                    self.selectPage(self.pages["parent_4"]);

//                        self.updateSubWindowsPage(model);

//                    clearInterval(interval);
//                        qxnw.utils.stopLoading();
//                    }, 100);
                }
            });
        },
        setParamRecord: function setParamRecord(pr) {
            var self = this;
            self.data = pr;
            pr.distancia_text = pr.distancia + " " + pr.distancia_unidad;
            pr.precio_text = pr.precio + " " + pr.moneda;
            self.form.setRecord(pr);
            console.log("self.mapa", self.mapa);
        }
    }
});