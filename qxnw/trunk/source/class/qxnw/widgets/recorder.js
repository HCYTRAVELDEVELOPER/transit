qx.Class.define("qxnw.widgets.recorder", {
    extend: qx.ui.core.Widget,
    construct: function () {
        this.base(arguments);
        var self = this;
        this._setLayout(new qx.ui.layout.HBox());
        self.setWidth(200);
        self.setHeight(200);

        var input = document.createElement("audio");

        var inputEl = new qx.html.Element();
        inputEl.useElement(input);

        var root = new qx.html.Root();
        root.useElement(inputEl);

        self.getContentElement().add(inputEl);
    },
    destruct: function destruct() {
        try {
            this.destroy();
            this.dispose();
        } catch (e) {
            this.dispose();
        }
    },
    members: {
        _audio: null
    }
});