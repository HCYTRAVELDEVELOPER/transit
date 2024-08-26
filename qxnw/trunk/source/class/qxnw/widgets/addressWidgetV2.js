qx.Class.define("qxnw.widgets.addressWidgetV2", {
    extend: qx.ui.core.Widget,
    construct: function construct() {
        this.base(arguments);
        var self = this;
        self.widgets = [];
        var layout = new qx.ui.layout.VBox();
        this._setLayout(layout);
        layout.setAlignY("middle");
        self.setAppearance("textfield");
        self.setMaxHeight(210);
        self.setFocusable(false);
        self.containerSelections = new qx.ui.container.Composite(new qx.ui.layout.HBox());
        self._add(self.containerSelections);

        self.__groupAll = new qx.ui.groupbox.GroupBox(self.tr("Dirección"), qxnw.config.execIcon("bookmark-new")).set({
            contentPadding: 2
        });
        self.__groupAll.setLayout(new qx.ui.layout.VBox().set({
            spacing: 5
        }));
        self.containerSelections.add(self.__groupAll, {
            flex: 1
        });

        this._createChildControl("textArea");
        self.__groupAll.add(this.getChildControl("textArea"), {
            flex: 1
        });
    },
    events: {
        input: "qx.event.type.Data"
    },
    properties: {
        "country": {
            init: null,
            check: "String"
        }
    },
    members: {
        containerSelections: null,
        __groupAll: null,
        addressField: null,
        _createChildControlImpl: function (id, hash) {
            var control;
            switch (id) {
                case "textArea":
                    control = new qxnw.widgets.textArea();
                    control.setFocusable(true);
                    this._add(control, {
                        flex: 1
                    });
                    break;
                default:
                    break;
            }

            return control || this.base(arguments, id);
        },
        setRequired: function setRequired(required) {
            var self = this;
            self.addressField.setRequired(required);
        },
        setValue: function setValue(v) {
            v = v.replace(/\s+/g, " ");
            this.getChildControl("textArea").setValue(v);
        },
        getValue: function getValue() {
            return this.getChildControl("textArea").getValue();
        },
        _onListPointerDown: function () {
            return false;
        },
        _onListChangeSelection: function (e) {
            return null;
        },
        focus: function focus() {
            this.getChildControl("textArea").setFocus();
        },
        setTabIndex: function setTabIndex(index) {
            this.getChildControl("textArea").setTabIndex(index);
        },
        setAllTabIndex: function setAllTabIndex(index) {
            this.getChildControl("textArea").setTabIndex(index);
        }
    }
});