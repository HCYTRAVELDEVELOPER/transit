qx.Class.define("qxnw.examples.printerReport", {
    extend: qxnw.reports,
    ///TEST
    construct: function construct() {
        this.base(arguments);
        var self = this;
        var data = {};
        data.water_text = "Anulado";
        data.id = 1;
        data.no_show_contents = true;

        data.file = "/impresiones/cc_pdf.php?id=12&id_fac=12";

//        self.addFrame("http://nwadmin3.loc/impresiones/cc_pdf.php?id=12&id_fac=12", false);

//        self.hideSelectPrinters(true);
        self.createPrinterToolBar("Prueba", data);
        self.setModal(true);
    }
});