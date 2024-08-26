qx.Class.define("qxnw.attached_admin.init", {
    extend: qxnw.forms,
    construct: function() {
        this.base(arguments);
        var table = "<table><tr><td>";
        table += "<center><p>No hay Adjuntos que ver</p></center>";
        table += "</td></tr></table>";
        var htmlEmbed = new qx.ui.embed.Html();
        htmlEmbed.setHtml(table);
        htmlEmbed.setCssClass("nw_test");
        this.add(htmlEmbed, {
            flex: 1
        });
    },
    members: {
        addAttached: function addAttached(path) {

        }
    }
});