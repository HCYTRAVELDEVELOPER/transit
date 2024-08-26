qx.Class.define("qxnw.widgets.dynamicImage", {
    extend: qx.ui.container.Composite,
    include: [qx.locale.MTranslation],
    construct: function () {
        var self = this;
        this.base(arguments);
        self.classname = "qxnw.widgets.dynamicImage";
        self.__baseLayout = new qx.ui.layout.Canvas();
        self.setLayout(self.__baseLayout);

        self.setMainWidth();
        self.setMainHeight();

        qxnw.utils.addBorder(self, "black", 1);

        self.set({
            alignX: "center",
            alignY: "middle"
        });
    },
    destruct: function destruct() {
        try {
            this.destroy();
            this._disposeObjects("this.ui");
            this._disposeObjects("this.__baseLayout");
            this.dispose();
        } catch (e) {
            this.dispose();
        }
    },
    events: {
        "clickedFrame": "qx.event.type.Data"
    },
    properties: {
        sizeWidth: {
            init: 300,
            check: "Integer",
            apply: "_applyMainWidth"
        },
        sizeHeight: {
            init: 200,
            check: "Integer",
            apply: "_applyMainHeight"
        },
        framesY: {
            init: 0,
            check: "Integer"
        },
        framesX: {
            init: 0,
            check: "Integer"
        },
        widthFrames: {
            init: 0,
            check: "Integer"
        },
        heightFrames: {
            init: 0,
            check: "Integer"
        }
    },
    members: {
        __ctx: null,
        __canvas: null,
        __canvasCut: null,
        __canvasGuardar: null,
        __alterImageComposite: null,
        __buttonCut: null,
        __img: null,
        __normalHeight: 195,
        __normalWidth: 260,
        __buttonDescargar: null,
        __required: false,
        __invalidMessage: null,
        sizeHeight: 300,
        sizeWidth: 300,
        canvasCutDest: null,
        __showLines: false,
        __showTooltip: false,
        __labelCoordinates: null,
        __showCoordinates: true,
        showCoordinates: function showCoordinates(val) {
            this.__showCoordinates = val;
        },
        showLines: function showLines(val) {
            this.__showLines = val;
        },
        showTooltip: function showTooltip(val) {
            this.__showTooltip = val;
        },
        _applyMainHeight: function _applyMainHeight(val) {
            this.setMainHeight(val);
        },
        _applyMainWidth: function _applyMainWidth(val) {
            this.setMainWidth(val);
        },
        setMainWidth: function setMainWidth(val) {
            if (typeof val != 'undefined') {
                this.setSizeWidth(val);
            }
            this.setMaxWidth(this.getSizeWidth());
            this.setMinWidth(this.getSizeWidth());

            if (this.__image != null) {
                this.__image.setMaxWidth(this.getSizeWidth());
                this.__image.setMinWidth(this.getSizeWidth());
            }
            if (this.__canvas != null) {
                this.__canvas.width = this.getSizeWidth();
            }
            if (this.canvasCutDest != null) {
                this.canvasCutDest.setWidth(this.getSizeWidth());
            }
        },
        setMainHeight: function setMainHeight(val) {
            if (typeof val != 'undefined') {
                this.setSizeHeight(val);
            }

            var haveCoordinates = 0;
            if (this.__showCoordinates == true) {
                haveCoordinates += 15;
            }

            this.setMaxHeight(this.getSizeHeight() + haveCoordinates);
            this.setMinHeight(this.getSizeHeight() + haveCoordinates);

            if (this.__image != null) {
                this.__image.setMaxHeight(this.getSizeHeight());
                this.__image.setMinHeight(this.getSizeHeight());
            }
            if (this.__canvas != null) {
                this.__canvas.height = this.getSizeHeight();
            }
            if (this.canvasCutDest != null) {
                this.canvasCutDest.setHeight(this.getSizeHeight());
            }

            if (this.__showCoordinates == true) {
                try {
                    this.remove(this.__labelCoordinates);
                } catch (e) {

                }
                this.__labelCoordinates = null;
                this.__labelCoordinates = new qx.ui.basic.Label(this.tr("X=0, Y=0"));
                this.add(this.__labelCoordinates, {
                    top: this.getSizeHeight()
                });
            }
        },
        setValid: function setValid(bool) {
            var self = this;
            if (this.__newVersion == false) {
                this.__cameraOld.setValid(bool);
            } else {
                if (bool == false) {
                    qxnw.utils.addBorder(self);
                    self.id_listener = self.addListenerOnce("mouseover", function (e) {
                        self.popup = new qx.ui.popup.Popup(new qx.ui.layout.HBox()).set({
                            backgroundColor: "#FF0000"
                        });
                        if (self.__invalidMessage != null) {
                            self.popup.placeToPointer(e);
                            self.popup.add(new qx.ui.basic.Atom(self.__invalidMessage), {
                                flex: 1
                            });
                            self.popup.show();
                        }
                    });
                } else {
                    if (self.id_listener != null) {
                        self.removeListenerById(self.id_listener);
                        self.setDecorator(null);
                    }
                }
            }
        },
        setInvalidMessage: function setInvalidMessage(val) {
            this.__invalidMessage = val;
        },
        setRequired: function setRequired(val) {
            this.__required = val;
        },
        getValue: function getValue() {
            if (this.__newVersion == false) {
                return this.__cameraOld.getValue();
            } else {
                return this.__img;
            }
        },
        setValue: function setValue(val) {
            this.__img = val;
        },
        setFrames: function setFrames(val) {
            var exploded = val.split("x");
            this.setFramesX(parseInt(exploded[0]));
            this.setFramesY(parseInt(exploded[1]));
            this.setWidthFrames(parseInt(this.getSizeWidth() / parseInt(exploded[0])));
            this.setHeightFrames(parseInt(this.getSizeHeight() / parseInt(exploded[1])));
            this.createMask();
        },
        setImage: function setImage(val) {
            var self = this;
            if (self.__image == null) {
                self.__image = new qx.ui.basic.Image(val);
                self.add(self.__image, {
                    left: 0,
                    top: 0
                });
            } else {
                self.__image.setSource(val);
            }
        },
        setOptionalLocation: function setOptionalLocation(location, color) {
            var self = this;
            var v = location.split("x");
            var x = v[0];
            var y = v[1];
            var widget = self.getWidgetByLocation(x, y);
            var colorDest = "green";
            if (typeof color != 'undefined') {
                colorDest = color;
            }
            widget.setBackgroundColor(colorDest);
        },
        getWidgetByLocation: function getWidgetByLocation(row, col) {
            var self = this;
            var children = self.getChildren();
            for (var i = 0; i < children.length; i++) {
                var w = children[i];
                var x = w.getUserData("nw_widget_location_x");
                var y = w.getUserData("nw_widget_location_y");
                if (row == x && col == y) {
                    w.setUserData("nw_widget_location_selected", true);
                    return children[i];
                    break;
                }
            }
            console.log("No se encontró el widget solicitado row:" + row + " col: " + col);
        },
        setCoordinatesValue: function setCoordinatesValue(x, y) {
            this.__labelCoordinates.setValue("X=" + x + ", Y=" + y);
        },
        cleanMask: function cleanMask() {
            var self = this;
            var children = self.getChildren();
            for (var i = 0; i < children.length; i++) {
                var clicked = children[i].getUserData("nw_clicked");
                if (clicked == true) {
                    children[i].setBackgroundColor("white");
                    children[i].setUserData("nw_clicked", false);
                }
            }
        },
        createMask: function createMask() {
            var self = this;
            var children = this.getChildren();
            for (var i = 0; i < children.length; i++) {
                var isRemove = children[i].getUserData("nw_widget_dynamicImage");
                if (isRemove === true) {
                    self.removeAt(i);
                    i--;
                }
            }
            var top = 0;
            var left = 0;
            var add = 0;
            if (this.__showLines == true) {
                add = 1;
            }
            var widthFrame = self.getWidthFrames() - add;
            var heightFrame = self.getHeightFrames() - add;
            for (var i = 0; i < self.getFramesY(); i++) {
                left = 0;
                for (var ia = 0; ia < self.getFramesX(); ia++) {
                    var canvasCutDest = new qx.ui.core.Widget().set({
                        minWidth: widthFrame,
                        maxWidth: widthFrame,
                        minHeight: heightFrame,
                        maxHeight: heightFrame,
                        backgroundColor: "white",
                        cursor: "pointer"
                    });
                    canvasCutDest.setUserData("nw_clicked", false);
                    canvasCutDest.setUserData("nw_widget_dynamicImage", true);
                    canvasCutDest.setUserData("nw_widget_location_y", i);
                    canvasCutDest.setUserData("nw_widget_location_x", ia);
                    canvasCutDest.setUserData("nw_widget_location_selected", false);
                    if (self.__showTooltip == true) {
                        var tool = new qx.ui.tooltip.ToolTip().set({
                            showTimeout: 0
                        });
                        tool.setLabel("Y:" + i + " X:" + ia);
                        canvasCutDest.setToolTip(tool);
                    }
                    function click() {
                        var clicked = this.getUserData("nw_clicked");
                        var d = {};
                        d.x = this.getUserData("nw_widget_location_x");
                        d.y = this.getUserData("nw_widget_location_y");
                        d.selected = this.getUserData("nw_widget_location_selected");
                        d.widget = this;
                        if (clicked == null || clicked == false) {
                            this.setBackgroundColor("blue");
                            this.setUserData("nw_clicked", true);
                        } else if (clicked == true) {
                            this.setBackgroundColor("white");
                            this.setUserData("nw_clicked", false);
                        }
                        self.fireDataEvent("clickedFrame", d);
                    }
                    function out(e) {
                        qx.bom.element.Style.set(this.getContentElement().getDomElement(), "opacity", "0.3");
                    }
                    function move(e) {
                        if (self.__showCoordinates == true) {
                            var x = this.getUserData("nw_widget_location_x");
                            var y = this.getUserData("nw_widget_location_y");
                            self.setCoordinatesValue(x, y);
                        }
                        qx.bom.element.Style.set(this.getContentElement().getDomElement(), "opacity", "0.0");
                    }
                    canvasCutDest.addListener('mouseout', out, false);
                    canvasCutDest.addListener('click', click, false);
                    canvasCutDest.addListener('mousemove', move, false);
                    canvasCutDest.addListener("appear", function () {
                        qx.bom.element.Style.set(this.getContentElement().getDomElement(), "opacity", "0.3");
                    });
                    self.add(canvasCutDest, {
                        left: left,
                        top: top
                    });
                    left = left + self.getWidthFrames();
                }
                top = top + self.getHeightFrames();
            }
        }
    }
});