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
qx.Class.define("qxnw.maps", {
    extend: qx.core.Object,
    include: [qx.locale.MTranslation],
    properties: {
        latitude: {
            init: null
        },
        longitude: {
            init: null
        },
        dragable: {
            init: false,
            check: "Boolean"
        },
        createMarkers: {
            init: true,
            check: "Boolean"
        }
    },
    events: {
        "mapLoaded": "qx.event.type.Event"
    },
    construct: function (latitude, longitude) {
        var self = this;
        try {
            this.setLatitude(latitude);
            this.setLongitude(longitude);
        } catch (e) {
            qxnw.utils.error(e, self);
        }
        self.createPosition();
        self.markers = [];
        self.infoWindows = [];
        self.isle = new qx.ui.core.Widget();
        main.loadGoogleMaps();
        self.setQxnwType = function (name) {
            self.classname = name;
        };
        self.getQxnwType = function (name) {
            return self.classname;
        };
        self.setQxnwType("qxnw_maps_widget");
//        var input = document.getElementById('searchTextField');
//        var options = {
//            types: ['(cities)'],
//            componentRestrictions: {country: 'fr'}
//        };
//
//        autocomplete = new google.maps.places.Autocomplete(input, options);
    },
    destruct: function () {
        try {
            this._disposeObjects("isle");
            this._disposeObjects("map");
            this._disposeObjects("position");
            this._disposeObjects("infoWindows");
            this._disposeObjects("markers");
            if (typeof this.ui != 'undefined') {
                for (var i = 0; i < this.ui.length; i++) {
                    this._disposeObjects(this.fields[i]);
                }
            }
            this.dispose();
        } catch (e) {
            this.dispose();
        }
    },
    members: {
        isle: null,
        map: null,
        firstMarker: null,
        created: false,
        aparitions: false,
        countAparitions: 1,
        position: null,
        m_latitude: null,
        m_longitude: null,
        manage: false,
        input1: null,
        input2: null,
        input_zoom: null,
        zoom: 8,
        markers: null,
        __appear: false,
        infoWindows: null,
        isleAppear: false,
        setPoint: function setPoint(latitude, longitude, title, openAtClick, icon, openIcon) {
            if (!this.verifyGoogle()) {
                return;
            }
            if (typeof openIcon == 'undefined') {
                openIcon = false;
            }
            if (typeof title == 'undefined') {
                if (title == null) {
                    title = "";
                }
            }
            if (typeof latitude == 'undefined' || latitude == null || latitude == 'null') {
                return;
            }
            if (typeof longitude == 'undefined' || longitude == null || longitude == 'null') {
                return;
            }
            latitude = latitude.replace(",", ".");
            longitude = longitude.replace(",", ".");
            this.latitude = latitude;
            this.longitude = longitude;
            var position = new google.maps.LatLng(latitude, longitude);
            var marker = this.placeMarker(position, title, openAtClick, icon, openIcon);
            return marker;
        },
        clearAllMarkers: function clearAllMarkers() {
            while (this.markers.length) {
                this.markers.pop().setMap(null);
            }
        },
        manageCoordinates: function manageCoordinates(location) {
            var self = this;
            location = eval(location);
            var latitude = location.lat();
            var longitude = location.lng();
            if (typeof self.input1 != 'undefined') {
                if (self.input1 != null) {
                    self.input1.setValue(latitude.toString());
                }
            }
            if (typeof self.input2 != 'undefined') {
                if (self.input2 != null) {
                    self.input2.setValue(longitude.toString());
                }
            }
        },
        setZoom: function setZoom(zoom) {
            this.zoom = zoom;
            if (typeof this.map != 'undefined') {
                if (this.map != null) {
                    this.map.setZoom(zoom);
                }
            }
        },
        setDragableMap: function setDragableMap(drag) {
            this.dragablemap = drag;
            if (typeof this.map != 'undefined') {
                if (this.map != null) {
                    this.map.setDraggable(drag);
                }
            }
        },
        showInfoWindow: function showInfoWindow() {

        },
        setManageCoordinates: function setManageCoordinates(bool) {
            this.manage = bool;
        },
        setLatitudeUpdate: function setLatitudeUpdate(input) {
            var self = this;
            self.input1 = input;
        },
        setLongitudeUpdate: function setLongitudeUpdate(input) {
            var self = this;
            self.input2 = input;
        },
        setZoomUpdate: function setZoomUpdate(input) {
            var self = this;
            self.input_zoom = input;
        },
        placeMarker: function placeMarker(location, title, openAtClick, icon, openIcon, centerMap, callbackonclick, data, animationOnClick, othersPropertiesArray) {
            var self = this;
            if (typeof title == 'undefined') {
                title = "";
            }
            if (typeof openAtClick == 'undefined') {
                openAtClick = true;
            }
            if (title != "") {
                var infoWindow = new google.maps.InfoWindow({
                    content: title
                });
                self.infoWindows.push(infoWindow);
            }
            if (!self.__appear) {
                self.isle.show();
            }

            var options = {};
            options.position = location;
            options.draggable = self.getDragable();
            if (typeof othersPropertiesArray !== "undefined") {
                if (qxnw.utils.evalueData(othersPropertiesArray)) {
                    if (typeof othersPropertiesArray == "object") {
                        for (var i = 0; i < othersPropertiesArray.length; i++) {
                            var ra = othersPropertiesArray[i];
                            options[ra.name] = ra.value;
                        }
                    }
                }
            }
            var firstMarker = new google.maps.Marker(options);

            if (typeof data !== "undefined") {
                firstMarker.data = data;
            }

            if (typeof icon != 'undefined') {
                if (icon != null) {
                    if (icon != 'undefined') {
                        if (icon != '') {
                            if (!openIcon) {
                                icon = icon.replace(".png", "");
                                var check = icon.split("/");
                                if (check.length == 2) {
                                    var img_icon = "/resource/qx/icon/Tango/16/" + icon + ".png";
                                } else {
                                    var img_icon = icon;
                                }
                                if (qxnw.utils.checkImageExists(img_icon)) {
                                    firstMarker.setIcon(img_icon);
                                }
                            } else {
                                if (qxnw.utils.checkImageExists(icon)) {
                                    firstMarker.setIcon(icon);
                                }
                            }
                        }
                    }
                }
            }
            if (!self.__appear) {
                self.isle.addListener('appear', function () {
                    //MAKE ANIMATIONS: animation: google.maps.Animation.DROP
                    try {
                        var c = qx.util.TimerManager.getInstance();
                        c.start(function () {
                            google.maps.event.trigger(self.map, "resize");
                            firstMarker.setMap(self.map);
                            if (centerMap !== false) {
                                self.map.setCenter(location);
                            }
                            c.stop();
                        }, 0, this, null, 250);
                    } catch (e) {

                    }
                });
            } else {
                try {
                    var c = qx.util.TimerManager.getInstance();
                    c.start(function () {
                        google.maps.event.trigger(self.map, "resize");
                        firstMarker.setMap(self.map);
                        if (centerMap !== false) {
                            self.map.setCenter(location);
                        }
                        c.stop();
                    }, 0, this, null, 250);
                } catch (e) {

                }
            }
            var toggleBounce = function () {
                if (animationOnClick !== false) {
                    if (firstMarker.getAnimation() != null) {
                        firstMarker.setAnimation(null);
                    } else {
                        firstMarker.setAnimation(google.maps.Animation.BOUNCE);
                    }
                }
                if (title != "") {
                    if (!openAtClick) {
                        infoWindow.open(self.map, firstMarker);
                    }
                }
                if (typeof callbackonclick !== "undefined") {
                    callbackonclick(firstMarker);
                }
            };
            if (title != "") {
                if (openAtClick) {
                    infoWindow.open(self.map, firstMarker);
                }
            }

            if (typeof infoWindow != 'undefined') {
                infoWindow.openInfo = function (marker) {
                    infoWindow.open(self.map, marker);
                };
            }
            //google.maps.event.addListener(firstMarker, 'appear', function() {
            google.maps.event.addListener(firstMarker, 'click', toggleBounce);
            //});

            self.markers.push(firstMarker);

            return firstMarker;
        },
        getMap: function getMap() {
            return this.map;
        },
        getPosition: function getPosition() {
            return this.position;
        },
        createInfoWindow: function createInfoWindow(position) {
            var self = this;
            var infowindow = new google.maps.InfoWindow({
                content: 'Change the zoom level',
                position: position
            });
            infowindow.open(self.map);
        },
        verifyGoogle: function verifyGoogle() {
            if (typeof google != 'undefined' && google) {
                return true;
            } else {
                return false;
            }
        },
        createPosition: function () {
            var self = this;
            if (!self.verifyGoogle()) {
//                qxnw.utils.information(self.tr("Verifique su conexión a Internet. Es indispensable para ver los mapas."));
//                return;
            } else {
                self.position = new google.maps.LatLng(self.getLatitude(), self.getLongitude());
            }
        },
        setPosition: function setPosition(position) {
            var that = this;
            this.position = position;
            if (this.map != null) {
                var __timerAlerts = new qx.event.Timer(250);
                __timerAlerts.start();
                __timerAlerts.addListener("interval", function (e) {
                    google.maps.event.trigger(that.map, "resize");
                    that.map.setCenter(position);
                    __timerAlerts.stop();
                });
            }
        },
        setMapType: function setMapType(type) {
            var self = this;
            try {
                switch (type) {
                    case "roadMap":
                        self.map.setMapTypeId(google.maps.MapTypeId.ROADMAP);
                        break;
                    case "satellite":
                        self.map.setMapTypeId(google.maps.MapTypeId.SATELLITE);
                        break;
                    case "hybrid":
                        self.map.setMapTypeId(google.maps.MapTypeId.HYBRID);
                        break;
                    case "terrain":
                        self.map.setMapTypeId(google.maps.MapTypeId.TERRAIN);
                        break;
                    default:
                        self.map.setMapTypeId(google.maps.MapTypeId.ROADMAP);
                        break;
                }
            } catch (e) {
                return false;
            }
            return true;
        },
        updateVisilibity: function updateVisibility() {
            var self = this;
            qx.html.Element.flush();
            var oldCenter = self.map.getCenter();
            var __timerAlerts = new qx.event.Timer(250);
            __timerAlerts.start();
            __timerAlerts.addListener("interval", function (e) {
                self.map.setCenter(oldCenter);
                __timerAlerts.stop();
            });
        },
        addListenerToIsle: function addListenerToIsle() {
            var self = this;
            if (!this.verifyGoogle()) {
                setTimeout(() => {
                    self.addListenerToIsle();
                }, 1000);
            } else {
                if (!self.isleAppear) {
                    self.isle.addListenerOnce("appear", function () {
                        self.createMap();
                    });
                } else {
                    self.createMap();
                }
            }
        },
        createMap: function createMap() {
            var self = this;
            self.__appear = true;
            try {

                qx.bom.element.Class.add(self.isle.getContentElement().getDomElement(), "mapa_widget");

                self.map = new google.maps.Map(self.isle.getContentElement().getDomElement(), {
                    zoom: self.zoom,
                    mapTypeId: google.maps.MapTypeId.ROADMAP
                });

                if (self.getCreateMarkers()) {
                    google.maps.event.addListener(self.map, 'click', function (event) {
                        self.placeMarker(event.latLng, "");
                    });
                }

                if (self.manage) {
                    google.maps.event.addListener(self.map, 'bounds_changed', function (event) {
                        self.zoom = this.getZoom();
                        if (self.input_zoom != null) {
                            self.input_zoom.setValue(self.zoom);
                        }
                        self.manageCoordinates(self.map.getCenter());
                    });
                }

//                    google.maps.event.addListenerOnce(self.map, "idle", function(e) {
//                        window.setTimeout(function() {
//                            var zIndex = self.isle.getContentElement().getStyle('zIndex');
//                            self.isle.getContentElement().getDomElement().style.zIndex = zIndex;
//                            qx.html.Element.flush();
//                            var oldCenter = self.map.getCenter();
//                            var __timerAlerts = new qx.event.Timer(250);
//                            __timerAlerts.start();
//                            __timerAlerts.addListener("interval", function(e) {
//                                self.map.setCenter(oldCenter);
//                                __timerAlerts.stop();
//                            });
//                        }, 500);
//                    });

                self.map.setCenter(self.position);

                self.isle.addListener("resize", function () {
                    var c = qx.util.TimerManager.getInstance();
                    c.start(function () {
                        google.maps.event.trigger(self.map, "resize");

                    });
                });
            } catch (ex) {
                qxnw.utils.bindError(ex, self);
            }
            self.fireEvent("mapLoaded");
        },
        createGoogleMap: function createGoogleMap() {
            var self = this;
            self.isle.getQxnwType = function () {
                return "qxnw_maps";
            };
            self.isle.setDecorator("main");

            self.isle.addListenerOnce("appear", function () {
                self.isleAppear = true;
            });

            self.addListenerToIsle();
            self.created = true;
            qx.html.Element.flush();
            return self.isle;
        }
    }

});