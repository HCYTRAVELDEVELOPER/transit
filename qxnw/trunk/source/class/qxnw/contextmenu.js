qx.Class.define("qxnw.contextmenu", {
    extend: qx.core.Object,
    construct: function (parent) {
        var self = this;
        self.parent = parent;
        self.menu = new qx.ui.menu.Menu();
        self.menu.removeAll();
        if (typeof self.parent != 'undefined') {
            if (self.parent.table != null) {
                self.parent.table.resetContextMenu();
                self.parent.table.setContextMenu(null);
            }
        }
        self.parentWidget = null;
        self.subButtons = [];
        self.counter = 0;
    },
    events: {
        "beforeContextmenuOpen": "qx.event.type.Event"
    },
    members: {
        parent: null,
        menu: null,
        parentWidget: null,
        oldButton: null,
        menuImplicit: null,
        subButtons: null,
        counter: null,
        addedButtons: false,
        addAction: function addAction(name, icon, callback) {
            var button = new qx.ui.menu.Button(name, icon);
            this.oldButton = button;
            button.getChildControl("label").setRich(true);
            button.addListener("execute", function (e) {
                try {
                    callback(e);
                } catch (e) {
                    qxnw.utils.error(e);
                }
            });
            this.menu.add(button);
            this.addedButtons = true;
        },
        addSubAction: function addSubAction(name, icon, callback, data_send) {
            var self = this;
            if (this.menuImplicit == null) {
                this.menuImplicit = new qx.ui.menu.Menu();
                this.menuImplicit.setMargin(1);
            }
            self.subButtons[self.counter] = new qx.ui.menu.Button(name, icon);
            self.subButtons[self.counter].getChildControl("label").setRich(true);
            self.subButtons[self.counter].data_send = data_send;
            self.subButtons[self.counter].addListener("execute", function (e) {
                var data_send = this.data_send;
                try {
                    e.data_send = data_send;
                    callback(e);
                } catch (e) {
                    qxnw.utils.error(e);
                }
            });
            self.subButtons[self.counter].setUserData("counter", self.counter);
            this.menuImplicit.add(self.subButtons[self.counter]);
            this.oldButton.setMenu(this.menuImplicit);
            var rta = self.subButtons[self.counter];
            self.counter++;
            this.addedButtons = true;
            return rta;
        },
        setMenu: function (pos) {
            var self = this;
            if (typeof self.parent != 'undefined' && typeof self.parent.table != 'undefined') {
                self.parent.table.setContextMenuFromDataCellsOnly(true);
                self.parent.table.setContextMenu(self.menu);
                if (typeof pos == 'undefined') {
                    self.menu.open();
                } else {
                    self.menu.openAtPointer(pos);
                }
            } else if (typeof self.parent != 'undefined' && typeof self.parent.getTable() != "undefined") {
                self.parent.getTable().setContextMenuFromDataCellsOnly(true);
                self.parent.getTable().setContextMenu(self.menu);
                if (typeof pos == 'undefined') {
                    self.menu.open();
                } else {
                    self.menu.openAtPointer(pos);
                }
            }
            self.menu.setZIndex(10000000);
        },
        exec: function exec(pos) {
            var self = this;
            if (self.addedButtons === false) {
                return;
            }
            if (self.parentWidget != null) {
                var haveTable = false;
                try {
                    if (typeof self.parentWidget.getMainTable != 'undefined') {
                        if (self.parentWidget.getMainTable() != null) {
                            haveTable = true;
                        }
                    }
                } catch (e) {
                    haveTable = false;
                }
                if (haveTable) {
                    self.parentWidget.getMainTable().setContextMenu(self.menu);
                    if (typeof pos == 'undefined') {
                        self.menu.open();
                    } else {
                        self.menu.openAtPointer(pos);
                    }
                    return;
                } else {
                    self.parentWidget.setContextMenu(self.menu);
                    if (typeof pos == 'undefined') {
                        self.menu.open();
                    } else {
                        self.menu.openAtPointer(pos);
                    }
                    return;
                }
            }
            self.setMenu(pos);
        },
        remove: function remove() {
            this.menu = null;
            this._disposeObjects(this.menu);
        },
        getMenu: function getMenu() {
            return this.menu;
        },
        setParentWidget: function setParentWidget(parent) {
            var self = this;
            self.parentWidget = parent;
        }
    }
});