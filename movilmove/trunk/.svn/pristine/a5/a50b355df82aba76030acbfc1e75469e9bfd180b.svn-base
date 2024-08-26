nw.Class.define("f_enableOrientationArrow", {
    extend: nw.lists,
    construct: function (self) {
        function handleMotion(event) {
            console.log(event)
            console.log("event.rotationRate", event.rotationRate)
        }
        window.addEventListener("devicemotion", handleMotion, true);
        var promise = FULLTILT.getDeviceOrientation({'type': 'world'});
        promise.then(function (deviceOrientation) {
            deviceOrientation.listen(function () { // Get the current *screen-adjusted* device orientation angles 
                var currentOrientation = deviceOrientation.getScreenAdjustedEuler();
                var compassHeading = 360 - currentOrientation.alpha;
                console.log("currentOrientation.alpha", currentOrientation.alpha)
                console.log("compassHeading", compassHeading)
                self.deviceRotation = compassHeading;
                if (nw.evalueData(self.markerMyPosition)) {
                    self.markerMyPosition.setRotation(self.deviceRotation);
                }
            });
        }).catch(function (errorMessage) {
            console.log(errorMessage);
        });
        if (window.DeviceOrientationEvent) {
            window.addEventListener("compassneedscalibration", function (event) {
                console.log('Your compass needs calibrating! Wave your device in a figure-eight motion');
                event.preventDefault();
            }, true);

            window.addEventListener('deviceorientation', function (event) {
                var compassdir = null;
                if (event.webkitCompassHeading) {
                    compassdir = event.webkitCompassHeading;
                } else {
                    compassdir = event.alpha;
                }
                self.deviceRotation = 360 - compassdir;
                console.log("compassdir", compassdir)
                console.log("self.deviceRotation", self.deviceRotation)
                if (nw.evalueData(self.markerMyPosition)) {
                    self.markerMyPosition.setRotation(compassdir);
                }
            }, false);
        }
        if (window.DeviceOrientationEvent) {
            window.addEventListener('deviceorientation', function (event) {
                var alpha;
                if (event.webkitCompassHeading) {
                    alpha = event.webkitCompassHeading;
                    alpha = 360 - alpha;
                } else {
                    alpha = event.alpha;
                    if (!window.chrome) {
                        alpha = alpha - 270;
//                            alpha = 360 - alpha;
                    }
                }
                console.log("alpha", alpha)
                if (nw.evalueData(self.markerMyPosition)) {
                    self.markerMyPosition.setRotation(alpha);
                }
            }, false);
        }
        function obtenerOrientacion(event) {
            console.log("obtenerOrientacion", event)
        }
        function errorBrujula(event) {
            console.log("errorBrujula", event)
        }
        var opciones = {frequency: 1500};
        navigator.compass.watchHeading(obtenerOrientacion, errorBrujula, opciones);
    },
    destruct: function () {
    },
    members: {
    }
});