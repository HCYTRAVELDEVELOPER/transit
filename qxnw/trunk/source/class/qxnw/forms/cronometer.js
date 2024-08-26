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

qx.Class.define("qxnw.forms.cronometer", {
    extend: qxnw.forms,
    construct: function (size) {
        var self = this;
        self.base(arguments);
        self.setTitle(self.tr("Cronómetro"));
        var cont = new qx.ui.container.Composite(new qx.ui.layout.HBox()).set({
            alignX: "center",
            alignY: "middle"
        });
        self.masterContainer.add(cont);
        var fontSize = 24;
        if (typeof size != 'undefined') {
            fontSize = size;
        } else {
            fontSize = self.fontSize;
        }
        var com = new qx.ui.basic.Label(":").set({
            rich: true,
            font: new qx.bom.Font.fromString(fontSize + "px")
        });
        var com1 = new qx.ui.basic.Label(":").set({
            rich: true,
            font: new qx.bom.Font.fromString(fontSize + "px")
        });
        var com2 = new qx.ui.basic.Label(":").set({
            rich: true,
            font: new qx.bom.Font.fromString(fontSize + "px")
        });
        self.hour = new qx.ui.basic.Label("00").set({
            rich: true,
            font: new qx.bom.Font.fromString(fontSize + "px")
        });
        self.min = new qx.ui.basic.Label("00").set({
            rich: true,
            font: new qx.bom.Font.fromString(fontSize + "px")
        });
        self.sec = new qx.ui.basic.Label("00").set({
            rich: true,
            font: new qx.bom.Font.fromString(fontSize + "px")
        });
        self.mil = new qx.ui.basic.Label("00").set({
            rich: true,
            font: new qx.bom.Font.fromString(fontSize + "px")
        });

        cont.add(self.hour);
        cont.add(com1);
        cont.add(self.min);
        cont.add(com);
        cont.add(self.sec);
        cont.add(com2);
        cont.add(self.mil);

        self.setMaxWidth(300);
        self.setMinWidth(300);
        self.setMaxHeight(150);
        self.setMinHeight(150);

        self.createDeffectButtons();

        self.set({
            showClose: true,
            showMinimize: true,
            showMaximize: false
        });

        self.ui.accept.setShow("icon");
        self.ui.accept.setIcon(qxnw.config.execIcon("media-playback-start"));
        self.ui.cancel.setShow("icon");
        self.ui.cancel.setIcon(qxnw.config.execIcon("media-playback-pause"));

        var buttons = [
            {
                label: self.tr("Reiniciar"),
                name: 'restart',
                icon: qxnw.config.execIcon("media-playback-stop")
            }
        ];
        self.addButtons(buttons);
        self.ui.restart.setShow("icon");

        self.__time = new qx.event.Timer(10);

        self.ui.cancel.addListener("tap", function () {
            self.pause();
        });
        self.ui.restart.addListener("tap", function () {
            self.stop();
        });
        self.ui.accept.addListener("tap", function () {
            self.start();
            this.setEnabled(false);
        });
    },
    destruct: function () {

    },
    members: {
        __time: null,
        hour: null,
        min: null,
        sec: null,
        mil: null,
        counterMil: 0,
        counterSec: 0,
        counterMin: 0,
        counterHour: 0,
        showCronometer: false,
        fontSize: 46,
        onlyMiliseconds: false,
        start: function start() {
            var self = this;
            self.__time.start();
            self.__time.addListener("interval", function (e) {
                self.counterMil++;
                if (self.counterMil == 100) {
                    self.counterSec = self.counterSec + 1;
                    var v = 0;
                    if (self.counterSec < 10) {
                        v = "0" + self.counterSec.toString();
                    } else {
                        v = self.counterSec.toString();
                    }
                    self.sec.setValue(v.toString());
                    if (self.onlyMiliseconds == false) {
                        self.counterMil = 0;
                    }
                }
                if (self.counterSec == 59) {
                    self.counterMin = self.counterMin + 1;
                    var v = 0;
                    if (self.counterMin < 10) {
                        v = "0" + self.counterMin.toString();
                    } else {
                        v = self.counterMin.toString();
                    }
                    self.min.setValue(v.toString());
                    self.counterSec = 0;
                }
                if (self.counterMin == 59) {
                    self.counterHour = self.counterHour + 1;
                    var v = 0;
                    if (self.counterHour < 10) {
                        v = "0" + self.counterHour.toString();
                    } else {
                        v = self.counterHour.toString();
                    }
                    self.hour.setValue(v.toString());
                    self.counterMin = 0;
                }
                self.mil.setValue(self.counterMil.toString());
            });
        },
        stop: function stop() {
            var self = this;
            self.__time.stop();
            self.mil.setValue("00");
            self.sec.setValue("00");
            self.min.setValue("00");
            self.hour.setValue("00");
            self.counterMil = 0;
            self.counterSec = 0;
            self.counterMin = 0;
            self.counterHour = 0;
        },
        pause: function pause() {
            var self = this;
            self.__time.stop();
            self.ui.accept.setEnabled(true);
        }
    }
});
