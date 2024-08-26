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
/**
 * Form to control the behavior of system
 */
qx.Class.define("qxnw.calc.init", {
    extend: qxnw.forms,
    construct: function construct() {
        this.base(arguments);
        var self = this;
        self.setTitle(self.tr("Calculadora"));

        self.set({
            width: 150
        });

        self.addListenerOnce('appear', function () {
            var isMoved = qxnw.local.getData("nw_calc_is_moved");
            if (isMoved == null) {
                self.moveTo(35, 65);
                qxnw.local.setData("nw_calc_is_moved", true);
                qxnw.animation.startEffect("rotateIn", self);
            }
        });

        var win = self;

        win.setLayout(new qx.ui.layout.VBox(3));
        win.setShowMinimize(false);
        win.setShowMaximize(false);
        win.open();
        
        self.display = new qx.ui.form.TextField("0").set({
            allowGrowX: true,
            allowGrowY: true,
            textAlign: "right",
            font: "bold",
            decorator: "main"
        });
        
        self.display.addListener("appear", function () {
            qx.bom.element.Style.set(self.display.getContentElement().getDomElement(), "font-size", "200%");
            qx.bom.element.Style.set(self.display.getContentElement().getDomElement(), "overflow", "auto");
        });
        win.addWidget(self.display, {flex: 1});

        var buttonContainer = new qx.ui.container.Composite();
        var grid = new qx.ui.layout.Grid(3, 3);
        buttonContainer.setLayout(grid);
        win.add(buttonContainer, {flex: 6});

        var labels = [
            ["C", "AC", "/", "*"],
            ["7", "8", "9", "-"],
            ["4", "5", "6", "+"],
            ["1", "2", "3", "="],
            ["0", null, ".", null]
        ];

        var buttons = {};
        for (var row = 0; row < 5; row++) {
            grid.setRowFlex(row, 1);
            for (var column = 0; column < 4; column++) {
                grid.setColumnFlex(column, 1);
                var label = labels[row][column];
                if (label) {
                    var button = new qx.ui.form.Button(label).set({
                        rich: true,
                        allowShrinkX: false,
                        font: "bold"
                    });
                    button.addListener("appear", function () {
                        qx.bom.element.Style.set(this.getChildControl("label").getContentElement().getDomElement(), "font-size", "110%");
                    });
                    buttonContainer.add(button, {row: row, column: column});
                    buttons[label] = button;
                }
            }
        }

        buttons["="].setLayoutProperties({rowSpan: 2});
        buttons["0"].setLayoutProperties({colSpan: 2});

        for (label in buttons) {
            buttons[label].addListener("execute", function (e) {
                var button = e.getTarget();
                self.calculate(button);
            }, this);
        }
        win.addListener("keypress", function (e) {
            self.keyControl(e);
        }, this);
        self.addListener("appear", function () {
            self.display.focus();
        });
    },
    members: {
        display: null,
        oldValue: null,
        calculate: function calculate(button) {
            var self = this;
            if (button.getLabel() == "=") {
                self.display.setValue(eval(self.display.getValue()).toString());
            } else if (button.getLabel() == "C" || button.getLabel() == "AC") {
                self.display.setValue("");
            } else {
                self.display.setValue((self.display.getValue() == "0" ? "" : self.display.getValue()) + button.getLabel());
            }
        },
        keyControl: function keyControl(e) {
            var self = this;
            var key = e.getKeyIdentifier();
            if (key == "Alt" || key == "Control" || key == "Shift" || key == "CapsLock"
                    || key == "Tab") {
                return;
            }
            if (key == "Backspace") {
//              SE CAMBIA POR DEJAR DE SER LABEL Y AHORA SER TEXTFIELD
//                var display = self.display.getValue();
//                if (display != null) {
//                    if (display.length > 0) {
//                        self.display.setValue(display.slice(0, -1));
//                    }
//                }
                return;
            }
            if (key == "Delete") {
                self.display.setValue("");
                return;
            }
            if (!qxnw.utils.validateIsMathOperator(key)) {
                if (e.getKeyIdentifier() != "Enter") {
                    if (qxnw.utils.validateIsString(key)) {
                        return;
                    }
                }
            }
            if (self.__oldValue != null) {
                if (key == self.__oldValue && qxnw.utils.validateIsMathOperator(key)) {
                    return;
                }
            }
            if (key == "Enter") {
                self.display.setValue(eval(self.display.getValue()).toString());
            } else {
                self.display.setValue((self.display.getValue() == "0" ? "" : self.display.getValue()) + e.getKeyIdentifier());
            }
            self.__oldValue = key;
            e.preventDefault();
        }
    }
});