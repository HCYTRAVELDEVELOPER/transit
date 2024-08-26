qx.Class.define("qxnw.examples.formApplet", {
    extend: qxnw.forms,
    ///TEST
    construct: function construct() {
        this.base(arguments);
        var self = this;
        var params = {
            paramType: "testType",
            paramUser: "andresf"
        };
        var pathClass = "fingersuprema/fingerSuprema.class";
        var pathJar = "fingersuprema/fingerSuprema.jar";
        var html = qxnw.utils.getHtmlApplet(pathClass, pathJar, 300, 400, params);
        self.addHtml(html, 1);
    }
});