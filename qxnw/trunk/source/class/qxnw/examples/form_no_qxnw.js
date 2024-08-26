qx.Class.define("qxnw.examples.form_no_qxnw", {
    extend: qx.ui.window.Window,
    construct: function construct() {
        this.base(arguments);

        this.setLayout(new qx.ui.layout.VBox());
        var gridLayout = new qx.ui.layout.Grid();
        var container = new qx.ui.container.Composite(gridLayout);

        //ROW ONE
        container.add(new qx.ui.form.SelectBox(), {
            column: 0,
            row: 0
        });

        container.add(new qx.ui.form.TextField(), {
            column: 1,
            row: 0
        });

        container.add(new qx.ui.form.TextField(), {
            column: 2,
            row: 0
        });

        container.add(new qx.ui.form.SelectBox(), {
            column: 3,
            row: 0
        });

        container.add(new qx.ui.form.TextField(), {
            column: 4,
            row: 0
        });

        this.add(container, {
            flex: 1
        });

        qx.ui.core.FocusHandler.getInstance().addRoot(this);

    }
});