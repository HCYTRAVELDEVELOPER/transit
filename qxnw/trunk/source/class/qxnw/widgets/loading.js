/* ************************************************************************
 
 Copyright:
 2013 Netwoods.net, http://www.netwoods.net
 
 License:
 LGPL: http://www.gnu.org/licenses/lgpl.html
 EPL: http://www.eclipse.org/org/documents/epl-v10.php
 See the LICENSE file in the project's top-level directory for details.
 
 Authors:
 * Andrés Flórez (andresf)
 
 ************************************************************************ */
qx.Class.define("qxnw.widgets.loading", {
    extend: qx.ui.popup.Popup,
    construct: function (message, icon, changeCursor, block) {
        this.base(arguments);
        var self = this;

        try {
            if (typeof changeCursor == 'undefined' || changeCursor == null) {
                changeCursor = true;
            }
            if (changeCursor) {
                var root = qx.core.Init.getApplication().getRoot();
                root.setCursor("wait");
                if (typeof main != 'undefined') {
                    main.getWidget().setCursor("wait");
                }
                document.body.style.cursor = 'progress';
            }
        } catch (e) {

        }

        var text = self.tr("Trabajando...");
        var haveToolTip = false;
        var showTooltip = qxnw.config.getShowTips();

        if (typeof showTooltip !== 'undefined') {
            if (showTooltip === true) {
                var tip = qxnw.config.getRandomTip();
                if (tip !== null && tip !== "") {
                    text = tip.text;
                    if (tip.haveImage) {
                        haveToolTip = true;
                    }
                }
            }
        }

        if (typeof message !== 'undefined' && message !== null && message !== "Trabajando...") {
            text = message;
        }

        var baseLayout = new qx.ui.layout.Grid();
        baseLayout.setRowAlign(0, "center", "middle");
        baseLayout.setRowAlign(1, "center", "middle");
        baseLayout.setRowAlign(2, "right", "bottom");

        self.setLayout(baseLayout);

        self.setBackgroundColor("transparent");
        self.setPadding([2, 4]);
        self.setOffset(3);
        self.setOffsetBottom(20);
        self.setOpacity(0.75);
        self.setAutoHide(false);
        self.setMinWidth(100);

        self.setAppearance("widget");

        baseLayout.setSpacing(5);
        baseLayout.setColumnMaxWidth(0, 70);

        var textMessage = new qx.ui.basic.Atom(text).set({
            rich: true,
            alignY: "middle",
            alignX: "center"
        });

        self.add(textMessage, {
            column: 0,
            row: 0
        });
        self.addListener("appear", function () {
            try {
                qx.bom.element.Class.add(this.getContentElement().getDomElement(), "qxnw_loading_box");
            } catch (e) {
            }
            var bounds = self.getBounds();
            if (bounds != null) {
                var top = parseInt(Math.round((qx.bom.Viewport.getHeight() / 2) - (bounds.height / 2)));
                var left = parseInt(Math.round((qx.bom.Viewport.getWidth() / 2) - (bounds.width / 2)));
                self.placeToPoint({
                    left: left,
                    top: top
                });
            }
            document.body.appendChild(this.getContentElement().getDomElement());
        });

        self.setVisibility("visible");

        var img_path = "/nwlib" + qxnw.userPolicies.getNwlibVersion() + "/img/ajax-loader.gif";
        if (haveToolTip === false) {
            try {
                var stored_logo = qxnw.local.getData("nw_init_settings_logo");
                if (typeof stored_logo != 'undefined' && stored_logo != null && stored_logo != "") {
                    var am = qx.util.AliasManager.getInstance();
                    img_path = am.resolve(stored_logo);
                }
            } catch (e) {
                qxnw.utils.hiddenError(e);
            }
        }
        var image = new qx.ui.basic.Image(img_path);
        if (typeof stored_logo != 'undefined' && stored_logo != null && stored_logo != "") {
            try {
                image.setAllowGrowX(false);
                image.setAllowGrowY(false);
                image.setScale(true);
                var b = qxnw.local.getData("logo_bounds");
                if (b != null && typeof b.scale != 'undefined') {
                    var width = b.width;
                    var height = b.height;
                    var maxHeight = 50 > parseInt(height) ? parseInt(height) : 50;
                    var scale = parseInt(width) * maxHeight / parseInt(height);
                    if (scale == null || scale == "" || 1 > scale) {
                        b.scale = 95;
                    } else {
                        b.scale = Math.round(scale);
                    }
                } else {
                    b = {};
                    b.scale = 100;
                }
                image.setWidth(b.scale);
                image.setHeight(50);
            } catch (e) {
                qxnw.utils.hiddenError(e);
            }
        }
        self.setZIndex(1000000);
        self.add(image, {
            row: 1,
            column: 0
        });

        if (typeof block != 'undefined' && block === true) {

            self.blocker = qxnw.utils.createBlocker();

            self.addListener("appear", function () {
                var t = new qx.event.Timer(100);
                t.start();
                t.addListener("interval", function (e) {
                    this.stop();
                    if (self != null) {
                        var zIndex = self.getZIndex();
                        qxnw.utils.startBlocker(zIndex - 1);
//                        self.blocker.blockContent(zIndex - 1);
                    }
                });
            });

            self.addListener("disappear", function () {
                try {
                    qxnw.utils.stopBlocker();
                    self.blocker = null;
                    self.destroy();
                    self = null;

                    //document.body.removeChild(this.getContentElement().getDomElement());
                } catch (e) {
                    console.log(e);
                }
                this.destroy();
            });
        } else {
            self.addListener("disappear", function () {
                this.destroy();
            });
        }

        self.show();
    },
    events: {
        executeCancel: "qx.event.type.Data"
    },
    members: {
        __blocker: null,
        __rpc: null,
        __call: null,
        __cancelButton: null,
        setCall: function setCall(call) {
            this.__call = call;
        },
        setRpc: function setRpc(rpc) {
            this.__rpc = rpc;
        },
        createCancelButton: function createCancelButton() {
            var self = this;
            self.__cancelButton = new qx.ui.form.Button("Cancelar", qxnw.config.execIcon("list-remove")).set({
                gap: 1,
                cursor: "pointer"
            });
            var cancelButton = self.__cancelButton;
            cancelButton.getChildControl("label").set({
                alignX: "center"
            });
            cancelButton.getChildControl("icon").set({
                alignX: "center"
            });
            cancelButton.setZIndex(100000000);
            cancelButton.setAppearance("label");
            cancelButton.addListener("execute", function () {
                self.fireDataEvent("executeCancel", null);
                qxnw.utils.stopLoading();
            });
            var wid = self.getLayout().getCellWidget(2, 0);
            if (wid != null) {
                wid.destroy();
            }
            var cont = new qx.ui.container.Composite(new qx.ui.layout.HBox());
            cont.add(new qx.ui.core.Spacer().set({
                width: 5
            }), {
                flex: 0
            });
            cont.add(cancelButton, {
                flex: 1
            });
            self.add(cont, {
                column: 0,
                row: 2
            });
        }

    }
});