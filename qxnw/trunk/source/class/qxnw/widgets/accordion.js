/* ************************************************************************
 
 Copyright:
 2015 Grupo NW S.A.S, http://www.gruponw.com
 
 License:
 LGPL: http://www.gnu.org/licenses/lgpl.html
 EPL: http://www.eclipse.org/org/documents/epl-v10.php
 See the LICENSE file in the project's top-level directory for details.
 
 Authors:
 * Andrés Flórez (andresf)
 * 
 * Class to test on andresf projects
 
 ************************************************************************ */

qx.Class.define("qxnw.widgets.accordion", {
    extend: qx.ui.core.Widget,
    construct: function () {
        this.base(arguments);
        var self = this;
        self.containerAll = new qx.ui.container.Composite(new qx.ui.layout.VBox());
        self.isOpened = [];
    },
    properties: {
        colorBars: {
            init: "#9BC8C8",
            check: "String"
        },
        openOlyOne: {
            init: false,
            check: "Boolean"
        }
    },
    members: {
        callback: null,
        isOpened: null,
        counter: 0,
        getMainContainer: function getMainContainer() {
            return this.containerAll;
        },
        populate: function populate(table, fieldLabel) {
            var self = this;
            var func = function (rta) {
                if (rta != false) {
                    if (rta != null) {
                        if (rta != "") {
                            if (rta.length > 0) {
                                for (var i = 0; i < rta.length; i++) {
                                    var v = rta[i];
                                    self.addRow(v[fieldLabel], v);
                                }
                            }
                        }
                    }
                }
            };
            qxnw.utils.fastAsyncCallRpc("master", "populate", {table: table}, func);
        },
        addRow: function addRow(label, model) {
            var self = this;
            var cont = new qx.ui.container.Composite(new qx.ui.layout.VBox()).set({
                minHeight: 20
            });
            qxnw.utils.addBorder(cont, "black", 1);

            cont.add(new qx.ui.core.Spacer(10), {
                flex: 1
            });

            var l = new qx.ui.basic.Label(label);
            cont.add(l);
            this.containerAll.add(cont);
            cont.addListener("appear", function () {
                qx.bom.element.Style.set(this.getContentElement().getDomElement(), "background-color", self.getColorBars());
            });
            cont.set({
                cursor: "pointer"
            });

            var space = new qx.ui.container.Composite(new qx.ui.layout.VBox());
            cont.add(space, {
                flex: 1
            });

            self.counter++;

            cont.setUserData("model", model);
            cont.setUserData("space", space);
            cont.setUserData("counter", self.counter);

            var d = {};
            d["counter"] = self.counter;
            d["isOpened"] = false;
            self.isOpened.push(d);

            cont.addListener("appear", function () {
                qx.bom.element.Class.add(this.getContentElement().getDomElement(), "nw_accordion_container");
            });

            cont.addListener("click", function (e) {

                var s = this.getUserData("space");
                var c = this.getUserData("counter");

                try {
                    var className = e.getOriginalTarget().className;
                    var splittedClassName = className.split(" ");
                    var isFrame = false;
                    for (var i = 0; i < splittedClassName.length; i++) {
                        if (splittedClassName[i] == "nw_accordion_container") {
                            isFrame = true;
                        }
                    }
                    if (!isFrame) {
                        return;
                    }
                } catch (ev) {
                    console.log(ev);
                }

                if (self.getOpenOlyOne() == true) {
                    self.closeAllRows();
                }

                if (self.isOpenedTab(c) == false) {
                    var model = this.getUserData("model");
                    if (self.callback != null) {
                        self.callback(model, s);
                    }
                    self.setOpened(c, true);
                } else {
                    s.removeAll();
                    self.setOpened(c, false);
                }
            });
        },
        closeAllRows: function closeAllRows() {
            var self = this;
            var children = self.containerAll.getChildren();
            for (var i = 0; i < children.length; i++) {
                var v = children[i];
                var s = v.getUserData("space");
                if (s != null) {
                    s.removeAll();
                }
            }
        },
        setOpened: function setOpened(counter, state) {
            for (var i = 0; i < this.isOpened.length; i++) {
                var v = this.isOpened[i];
                if (v.counter == counter) {
                    v.isOpened = state;
                    break;
                }
            }
        },
        isOpenedTab: function isOpenedTab(searchIndex) {
            for (var i = 0; i < this.isOpened.length; i++) {
                var v = this.isOpened[i];
                if (v.counter == searchIndex) {
                    return v.isOpened;
                }
            }
        },
        setCallback: function setCallback(callback) {
            this.callback = callback;
        }
    }
});
