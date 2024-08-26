qx.Class.define("qxnw.widgets.listItem", {
    extend: qx.ui.form.ListItem,
    construct(label, icon, model) {
        this.base(arguments, label, icon, model);
//        super(label, icon, model);
        var self = this;
        self.set({
            rich: true
        });
    }
});