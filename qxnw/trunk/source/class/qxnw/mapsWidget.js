qx.Class.define("qxnw.mapsWidget", {
    extend: qxnw.forms,
    construct: function (sender) {
        var self = this;
        this.base(arguments);
        self.ui = {};
        self.filters = [];
        self.__createContainers();
        self.createToolBar();
        main.loadGoogleMaps();
        self.setQxnwType("qxnw_maps_widget");
        main.addListener("loadedGoogleMaps", function () {
            self.googleMap = new qxnw.maps(self.getLatitude(), self.getLongitude());
            self.googleMap.setCreateMarkers(false);
            var mapWidget = self.googleMap.createGoogleMap();
            if (mapWidget != null) {
                self.containerCenter.add(mapWidget);
            }
            self.googleMap.setManageCoordinates(true);
            self.googleMap.setLatitudeUpdate(self.ui.latitude);
            self.googleMap.setLongitudeUpdate(self.ui.longitude);
            self.googleMap.setZoomUpdate(self.ui.zoom);
            self.googleMap.setZoom(self.getStoredZoom());
            
            self.addListener("appear", function () {
                self.__restoreSettings();
                self.handleFocus();
            });
        });
        if (self.getUniqueName() === null) {
            if (typeof sender != 'undefined') {
                self.setUniqueName(sender.classname.toString() + "_" + self.classname.toString());
            } else {
                self.setUniqueName(self.classname.toString());
            }
        }
        self.classname = self.classname + (self.count++).toString();
        self.__convertedPositions = [];
        self.__positions = [];
        self.__markers = [];
        self.__items = [];
        self.type = [];
    },
    destruct: function () {
        this.googleMap = null;
        try {
            this._disposeObjects("pr");
            this._disposeObjects("mapWidget");
            this._disposeObjects("googleMap");
            this._disposeObjects("position");
            this._disposeObjects("map");
            this._disposeObjects("containerCenter");
            this._disposeObjects("containerFilters");
            this._disposeObjects("containerTools");
            this._disposeObjects("__mainContainer");
            this._disposeObjects("__leftContainer");
            this._disposeObjects("__rightContainer");
            this._disposeObjects("__list");
            this._disposeObjects("__splitter");
            this._disposeObjects("__filterButton");
            if (typeof this.ui != 'undefined') {
                if (this.ui != null) {
                    for (var i = 0; i < this.ui.length; i++) {
                        this._disposeObjects(this.fields[i]);
                    }
                }
            }
            if (typeof this.__markers != null) {
                for (var i = 0; i < this.__markers; i++) {
                    this.__markers.setMap(null);
                    this._disposeObjects(this.__markers[i]);
                }
            }
            this.dispose();
        } catch (e) {
            this.dispose();
            qxnw.utils.bindError(e, this, 0, true, false);
        }
    },
    properties: {
        showTextOnClick: {
            init: null,
            check: "Boolean"
        },
        appearListenerId: {
            init: null
        },
        moveListenerId: {
            init: null
        },
        uniqueName: {
            init: null,
            check: "String"
        },
        zoom: {
            init: 8,
            check: "Integer",
            apply: "__changeZoom"
        },
        latitude: {
            init: "4.598056"
        },
        longitude: {
            init: "-74.075833"
        },
        disableChangePosition: {
            init: false
        },
        minChars: {
            init: null
        }
    },
    members: {
        ui: {},
        filters: [],
        __lines: null,
        pr: null,
        latitude: null,
        longitude: null,
        googleMap: null,
        containerCenter: null,
        containerFilters: null,
        containerTools: null,
        count: 0,
        __leftContainer: null,
        __mainContainer: null,
        __rightContainer: null,
        __list: null,
        __splitter: null,
        __positions: null,
        __showPositionsBar: true,
        __oldInfoWindow: null,
        __markers: null,
        __oldMarker: null,
        __isCreatedPositionsBar: false,
        __filterButton: null,
        __items: null,
        type: null,
        __convertedPositions: null,
        setShowPositionsBar: function setShowPositionsBar() {

        },
        showPositionsBar: function showPositionsBar() {
            var self = this;
            if (self.__isCreatedPositionsBar) {
                return;
            }
            self.__rightContainer = new qx.ui.container.Composite(new qx.ui.layout.VBox()).set({
                width: 200
            });
            self.__splitter.add(self.__rightContainer, 0);
            var upContainer = new qx.ui.container.Composite(new qx.ui.layout.VBox());
            self.__rightContainer.add(upContainer);
            var check = new qx.ui.form.CheckBox(self.tr("Mostrar todos"));
            upContainer.add(check);
            var searchContainer = new qx.ui.container.Composite(new qx.ui.layout.HBox().set({
                alignX: "center",
                alignY: "middle"
            }));
            self.__filter = new qx.ui.form.TextField();
            self.__filter.setPlaceholder(self.tr("Filtro..."));
            searchContainer.add(self.__filter, {
                flex: 1
            });
            self.__filter.addListener("keypress", function (e) {
                if (e.getKeyIdentifier() == "Enter") {
                    self.__filterButton.focus();
                }
            });
            self.__filterButton = new qx.ui.form.Button();
            self.__filterButton.setIcon(qxnw.config.execIcon("dialog-ok"));
            searchContainer.add(self.__filterButton);
            self.__filterButton.addListener("execute", function () {
                var str = self.__filter.getValue();
                if (str == null || (str != null && str.length < self.getMinChars())) {
                    return false;
                }
                self.search(str);
                self.__filter.focus();
            });
            upContainer.add(searchContainer, {
                flex: 1
            });
            check.addListener("changeValue", function () {
                var selected = this.getValue();
                if (self.__list != null) {
                    var children = self.__list.getChildren();
//                    console.log(self.__markers);
                    for (var i = 0; i < children.length; i++) {
                        self.__markers[i].setMap(!selected ? null : self.googleMap.getMap());
                        children[i].setValue(selected);
                    }
                    return;
                }
                if (!selected) {
                    for (var i = 0; i < self.__markers.length; i++) {
                        self.__markers[i].setMap(null);
                    }
                } else {
                    for (var i = 0; i < self.__markers.length; i++) {
                        self.__markers[i].setMap(self.googleMap.getMap());
                    }
                }
            });
            check.setValue(true);
            self.__list = new qx.ui.form.List().set({
                spacing: 10
            });
            self.__rightContainer.add(self.__list, {
                flex: 1
            });
            self.__showPositionsBar = true;
            self.__isCreatedPositionsBar = true;

            self.__totalLabel = new qx.ui.basic.Label("");
            self.__rightContainer.add(self.__totalLabel);
        },
        cleanMap: function cleanMap() {
            for (var i = 0; i < this.__markers.length; i++) {
                this.__markers[i].setMap(null);
            }
        },
        search: function search(data) {
            var self = this;
            var arrPos = [];
            self.cleanMap();
            self.__list.removeAll();
            for (var i = 0; i < self.__items.length; i++) {
                var model = self.__items[i].getModel();
                if (qxnw.utils.lowerFirst(model.text).indexOf(qxnw.utils.lowerFirst(data)) != -1) {
                    self.__list.add(self.__items[i]);
                    model.marker.setMap(self.googleMap.getMap());
                    self.showInfoWindow(model.marker, model.latitude.toString(), model.longitude.toString(), model.text);
                }
            }
        },
        setVisibleToolBar: function setVisibleToolBar(sel) {
            if (!sel) {
                this.containerTools.setVisibility("excluded");
            } else if (sel) {
                this.containerTools.setVisibility("visible");
            }
        },
        setVisibleFiltersBar: function setVisibleFiltersBar() {
            this.containerFilters.setVisibility("excluded");
        },
        addPositions: function addPositions(arrayPositions, showTextOnClick, save) {
            var self = this;
            if (typeof save == 'undefined') {
                save = true;
            }
            if (typeof arrayPositions == 'undefined') {
                return;
            }
            if (self.__showPositionsBar) {
                self.showPositionsBar();
            }
            if (typeof showTextOnClick == 'undefined') {
                showTextOnClick = false;
            }
            self.setShowTextOnClick(showTextOnClick);
            if (arrayPositions == null) {
                return;
            }
            if (typeof self.__totalLabel != 'undefined') {
                self.__totalLabel.setValue(self.tr("Total: ") + arrayPositions.length);
            }
            for (var i = 0; i < arrayPositions.length; i++) {
                if (typeof arrayPositions[i].latitude != 'undefined' && arrayPositions[i].latitude != "" && typeof arrayPositions[i].longitude != 'undefined' && arrayPositions[i].longitude != "") {
                    if (arrayPositions[i].latitude === null || arrayPositions[i].latitude == null || arrayPositions[i].latitude == "null") {
                        continue;
                    }
                    if (arrayPositions[i].longitude === null || arrayPositions[i].longitude == null || arrayPositions[i].longitude == "null") {
                        continue;
                    }
                    var valLat = parseFloat(arrayPositions[i].latitude);
                    var valLon = parseFloat(arrayPositions[i].latitude);
//                    if (valLat != NaN && valLat <= 90 && valLat >= -90) {
//                        if (valLon != NaN && valLon <= 90 && valLon >= -90) {
                    var title = null;
                    if (typeof arrayPositions[i].text != 'undefined') {
                        title = arrayPositions[i].text;
                    } else if (typeof arrayPositions[i].nombre != 'undefined') {
                        title = arrayPositions[i].nombre;
                    } else if (typeof arrayPositions[i].name != 'undefined') {
                        title = arrayPositions[i].name;
                    }
                    arrayPositions[i].latitude = arrayPositions[i].latitude.replace(",", ".");
                    arrayPositions[i].longitude = arrayPositions[i].longitude.replace(",", ".");
                    arrayPositions[i].text = title;
                    var markerData = self.setPoint(arrayPositions[i].latitude.toString(), arrayPositions[i].longitude.toString(), title, showTextOnClick, arrayPositions[i].icon);
                    if (save) {
                        self.__positions.push(arrayPositions[i]);
                        self.__markers.push(markerData);
                    }
                    if (self.__showPositionsBar) {
                        var item = new qx.ui.form.CheckBox(title);
                        item.setValue(true);
                        arrayPositions[i]["marker"] = markerData;
                        item.setModel(arrayPositions[i]);
                        item.setRich(true);
                        self.__list.add(item);
                        self.__items.push(item);
                        item.addListener("changeValue", function () {
                            var model = this.getModel();
                            if (this.getValue()) {
                                self.showInfoWindow(model.marker, model.latitude.toString(), model.longitude.toString(), model.text);
                                model.marker.setMap(self.googleMap.getMap());
                                self.__oldMarker = model.marker;
                            } else {
                                model.marker.setMap(null);
                            }
                        });
//                            }
//                        }
                    }
                }
            }
        },
        removePolyLines: function removePolyLines() {
            if (this.__lines != null) {
                this.__lines.setMap(null);
            }
        },
        createPolyLines: function createPolyLines() {
            var self = this;
            if (self.__convertedPositions.length > 0) {
                self.__lines = new google.maps.Polyline({
                    path: self.__convertedPositions,
                    strokeColor: "#0000FF",
                    strokeOpacity: 0.8,
                    strokeWeight: 2
                });
                self.__lines.setMap(self.googleMap.getMap());
            }
        },
        showInfoWindow: function (marker, latitude, longitude, title) {
            var self = this;
            try {
                if (self.__oldInfoWindow != null) {
                    self.__oldInfoWindow.close();
                }
            } catch (e) {

            }
            var position = new google.maps.LatLng(latitude, longitude);
            var infoWindow = new google.maps.InfoWindow({
                content: title});
            self.__oldInfoWindow = infoWindow;
            infoWindow.open(self.googleMap.getMap(), marker);
        },
        getStoredZoom: function getStoredZoom() {
            var self = this;
            var storedZoom = qxnw.local.getData(self.getUniqueName());
            var zoom = self.getZoom();
            if (storedZoom != null) {
                if (typeof storedZoom.zoom != 'undefined' && storedZoom.zoom != null) {
                    zoom = storedZoom.zoom;
                }
            }
            return zoom;
        },
        clearAllMarkers: function clearAllMarkers() {
            if (this.googleMap != null) {
                this.googleMap.clearAllMarkers();
            }
            if (this.__list != null) {
                this.__list.removeAll();
            }
        },
        updateMap: function updateMap() {
            var self = this;
            var data = {};
            data["latitude"] = self.ui.latitude.getValue();
            data["longitude"] = self.ui.longitude.getValue();
            data["zoom"] = self.ui.zoom.getValue();
            data["type"] = self.ui.type.getValue()["type"];
            self.setZoom(data.zoom);
            self.setMapType(data.type);
            self.setWeirdPosition(data.latitude, data.longitude);
            return true;
        },
        setPoint: function setPoint(latitude, longitude, title, openAtClick, icon, openIcon) {
            var self = this;
            var reLat = new RegExp(/^-?([1-8]?[1-9]|[1-9]0)\.{1}\d{1,6}/);
            if (latitude == null) {
                qxnw.utils.information(self.tr("La latitud para el punto no está registrada"));
                return;
            }
            if (longitude == null) {
                qxnw.utils.information(self.tr("La longitud para el punto no está registrada"));
                return;
            }
            if (!reLat.test(latitude)) {
                qxnw.utils.information(self.tr("La latitud asociada al punto no es válida"));
                return;
            }
            if (!reLat.test(longitude)) {
                qxnw.utils.information(self.tr("La longitud asociada al punto no es válida"));
                return;
            }
            if (!main.isLoadedGoogleMapScript) {
                setTimeout(function () {
                    self.setPoint(latitude, longitude, title, openAtClick, icon, openIcon);
                }, 500);
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
            var position = new google.maps.LatLng(latitude, longitude);
            self.__convertedPositions.push(position);
            var marker = this.googleMap.placeMarker(position, title, openAtClick, icon, openIcon);
            self.ui.latitude.setValue(latitude);
            self.ui.longitude.setValue(longitude);
            self.__saveSettings();
            return marker;
        },
        getPosition: function getPosition() {
            var self = this;
            var data = {};
            data["longitude"] = self.ui.latitude.getValue();
            data["longitude"] = self.ui.longitude.getValue();
        },
        __changeZoom: function __changeZoom(val) {
            var self = this;
            self.googleMap.setZoom(val);
        },
        __saveSettings: function __saveSettings() {
            var self = this;
            var data = {};
            data["latitude"] = self.ui.latitude.getValue();
            data["longitude"] = self.ui.longitude.getValue();
//            data["zoom"] = self.ui.zoom.getValue();
//            data["type"] = self.ui.type.getValue()["type"];
            qxnw.local.storeData(self.getUniqueName(), data);
        },
        __restoreSettings: function __restoreSettings() {
            var self = this;
            var data = qxnw.local.getData(this.getUniqueName());
            if (data != null) {
                self.ui.latitude.setValue(data.latitude);
                self.ui.latitude.setValue(data.longitude);
                if (typeof data.zoom != 'undefined') {
                    self.setZoom(data.zoom);
                }
                self.ui.zoom.setValue(parseInt(data.zoom));
                if (typeof data.type != 'undefined') {
                    if (data.type != null) {
                        self.ui.type.setValue(data.type);
                        self.setMapType(data.type);
                    }
                }
                self.setWeirdPosition(data.latitude, data.longitude);
            }
        }, setMapType: function setMapType(val) {
            this.googleMap.setMapType(val);
        },
        __toolTipsManager: function __toolTipsManager(type) {
            var self = this;
            var toolTipText = "unknown";
            switch (type) {
                case "update":
                    toolTipText = self.tr("Actualice la vista del mapa");
                    break;
                case "longitude":
                    toolTipText = self.tr("Controle la longitud del mapa");
                    break;
                case "latitude":
                    toolTipText = self.tr("Controle la latitud del mapa");
                    break;
                case "zoom":
                    toolTipText = self.tr("Controle el zoom del mapa");
                    break;
                case "type":
                    toolTipText = self.tr("Controle el tipo del mapa");
                    break;
            }
            var toolTip = new qx.ui.tooltip.ToolTip();
            toolTip.addListener("appear", function (e) {
                var label = toolTipText;
                toolTip.setLabel(label);
            });
            return toolTip;
        },
        __createContainers: function __createContainers() {

            this.__splitter = new qx.ui.splitpane.Pane("horizontal");
            //this.__mainContainer = new qx.ui.container.Composite(new qx.ui.layout.HBox());

//            this.__mainContainer.add(this.__splitter, {
            //                flex: 1
//            });

            this.__leftContainer = new qx.ui.container.Composite(new qx.ui.layout.VBox());
            this.containerTools = new qx.ui.container.Composite(new qx.ui.layout.VBox()).set({
                padding: 3,
                maxHeight: 50
            });
            this.__leftContainer.add(this.containerTools, {
                flex: 1
            });
            this.containerFilters = new qx.ui.container.Composite(new qx.ui.layout.HBox().set({
                spacing: 5
            })).set({
                padding: 5,
                allowGrowY: false,
                allowShrinkY: true
            });
            this.__leftContainer.add(this.containerFilters, {
                flex: 1
            });
            this.containerCenter = new qx.ui.container.Composite(new qx.ui.layout.Grow());
            this.__leftContainer.add(this.containerCenter, {
                flex: 1
            });
            this.__splitter.add(this.__leftContainer);
            this.masterContainer.add(this.__splitter, {
                flex: 1
            });
        },
        setWeirdPosition: function setWeirdPosition(latitude, longitude) {
            if (typeof google == 'undefined') {
                return;
            }
            var position = new google.maps.LatLng(latitude, longitude);
            this.googleMap.setPosition(position);
            return true;
        },
        setPosition: function setPosition(pr) {
            var position = new google.maps.LatLng(pr.latitud, pr.longitud);
            this.googleMap.setCenter(position);
            return true;
        },
        setFilters: function setFilters(filters) {
            this.createFilters(filters);
        },
        createFilters: function createFilters(filters) {
            var self = this;
            var tabIndex = 1;
            var focused = false;
            self.filters = filters;
            for (var i = 0; i < filters.length; i++) {
                var name = filters[i].name;
                var label = filters[i].label;
                var type = filters[i].type;
                if (typeof filters[i].visible == 'undefined') {
                    filters[i].visible = true;
                }
                var enabled = typeof filters[i].enabled == 'undefined' ? true : filters[i].enabled;
                switch (type) {
                    case "textField":
                        //self.ui[name] = new qx.ui.form.TextField();
                        self.ui[name] = new qxnw.widgets.textField();
                        self.ui[name].setMode("search", self.getAppWidgetName());
                        self.ui[name].setUserData("key", name);
                        self.ui[name].set({
                            maxHeight: 25
                        });
                        break;
                    case "selectBox":
                        self.ui[name] = new qxnw.fields.selectBox();
                        self.ui[name].setValue = function (value) {
                            var items = this.getSelectables(true);
                            for (var i = 0; i < items.length; i++) {
                                if (items[i].getModel() == value) {
                                    this.setSelection([items[i]]);
                                }
                            }
                            return true;
                        };
                        self.ui[name].setUserData("name", name);
                        self.ui[name].getValue = function () {
                            var data = {};
                            if (!this.isSelectionEmpty()) {
                                var selectModel = this.getSelection()[0].getModel();
                                var selectText = this.getSelection()[0].getLabel();
                                data[this.getUserData("name")] = selectModel;
                                data[this.getUserData("name") + "_text"] = selectText;
                            } else {
                                return "";
                            }
                            return data;
                        };
                        self.ui[name].set({
                            maxHeight: 25
                        });
                        break;
                    case "dateField":
                        self.ui[name] = new qx.ui.form.DateField();
                        var format = new qx.util.format.DateFormat("yyyy-MM-dd");
                        self.ui[name].setDateFormat(format);
                        self.ui[name].addListener("focus", function (e) {
                            this.open();
                        });
                        self.ui[name].addListener("click", function (e) {
                            this.open();
                        });
                        break;
                }

                self.type[name] = type;
                self.ui[name].setAllowGrowY(false);
                self.ui[name].addListener("keypress", function (e) {
                    if (e._identifier == "Enter") {
                        self.ui["searchButton"].focus();
                    }
                });
                if (type == "textField" || type == "textArea") {
                    self.ui[name].setPlaceholder(label);
                }

                var container = new qx.ui.container.Composite(new qx.ui.layout.VBox());
                container.add(new qx.ui.basic.Label(label), {
                    flex: 1
                });
                container.add(self.ui[name], {
                    flex: 1
                });
                self.containerFilters.add(container, {
                    flex: 0
                });
                if (!focused) {
                    if (filters[i].visible) {
                        if (enabled) {
                            if (type == "spinner") {
                                self.ui[name].getChildControl("textfield").setLiveUpdate(true);
                                self.ui[name].getChildControl("textfield").getFocusElement().focus();
                            } else {
                                self.ui[name].focus();
                            }
                            focused = true;
                            self.setFocusAsync(type, name);
                        }
                    }
                }
                self.ui[name].setTabIndex(tabIndex);
                tabIndex++;
                self.count++;
            }
            self.createButtonSearch(tabIndex);
        },
        setFocusAsync: function setFocusAsync(type, name) {
            var self = this;
            self.__focusElement = {
                type: type,
                name: name
            };
        },
        handleFocus: function handleFocus() {
            var self = this;
            if (this.__focusElement == null) {
                return;
            }
            try {
                self.ui[self.__focusElement["name"]].focus();
            } catch (e) {
                if (self.__focusElement["type"] == "dateChooser") {
                    return;
                } else if (self.__focusElement["type"] == "spinner") {
                    self.ui[self.__focusElement["name"]].getChildControl("textfield").setLiveUpdate(true);
                    self.ui[self.__focusElement["name"]].getChildControl("textfield").getFocusElement().focus();
                } else if (self.__focusElement["type"] == "selectTokenField") {
                    self.ui[self.__focusElement["name"]].getChildControl("textfield").setLiveUpdate(true);
                    self.ui[self.__focusElement["name"]].focus();
                } else if (self.__focusElement["type"] == "dateField") {
                    self.ui[self.__focusElement["name"]].getChildControl("textfield").setLiveUpdate(true);
                    self.ui[self.__focusElement["name"]].getChildControl("textfield").getFocusElement().focus();
                    self.ui[self.__focusElement["name"]].focus();
                } else {
                    self.ui[self.__focusElement["name"]].focus();
                    self.ui[self.__focusElement["name"]].getFocusElement().focus();
                }
            }
        },
        getFiltersData: function getFiltersData() {
            var self = this;
            var filters = self.filters;
            var r = {};
            if (filters == null) {
                return;
            }
            for (var i = 0; i < filters.length; i++) {
                var name = filters[i].name;
                switch (filters[i].type) {
                    case "textField":
                        r[name] = self.ui[name].getValue();
                        break;
                    case "selectBox":
                        if (!self.ui[name].isSelectionEmpty()) {
                            var selection = self.ui[name].getSelection();
                            r[name + "_label"] = selection[0].getLabel();
                            r[name] = selection[0].getModel();
                        } else {
                            r[name + "_label"] = "";
                            r[name] = "";
                        }
                        break;
                    case "dateField":
                        r[name + "_label"] = self.ui[name].getChildControl("textfield").getValue();
                        r[name] = self.ui[name].getChildControl("textfield").getValue();
                        break;
                    case "radioGroup":
                        if (!self.ui[name].isSelectionEmpty()) {
                            var selection = self.ui[name].getSelection();
                            r[name] = selection[0].getModel();
                        } else {
                            r[name] = "";
                        }
                        break;
                }
            }
            return r;
        },
        createButtonSearch: function createButtonSearch(tabIndex) {
            var self = this;
            self.buttonSearch = new qx.ui.form.Button(self.tr(""), qxnw.config.execIcon("dialog-apply")).set({
                maxHeight: 30
            });
            self.buttonSearch.setShow("icon");
            self.buttonSearch.setAllowGrowX(false);
            self.containerFilters.add(self.buttonSearch, {
                flex: 0
            });
            self.__spacer = new qx.ui.core.Spacer(30, 40);
            self.containerFilters.add(self.__spacer, {
                flex: 1
            });
            self.ui["searchButton"] = self.buttonSearch;
            if (typeof tabIndex != 'undefined') {
                self.buttonSearch.setTabIndex(tabIndex);
            }
        },
        createToolBar: function createToolBar() {
            var self = this;
            self.toolBar = new qx.ui.toolbar.ToolBar();
            self.toolBar.setSpacing(5);
            var part = new qx.ui.toolbar.Part();
            var updateButton = new qx.ui.toolbar.Button(self.tr("Actualizar"), qxnw.config.execIcon("view-refresh"));
            updateButton.setToolTip(self.__toolTipsManager("update"));
            part.add(updateButton, {
                flex: 1
            });
            self.ui["updateButton"] = updateButton;
            self.ui["updateButton"].addListener("execute", function () {
                self.updateMap();
            });
            part.add(new qx.ui.toolbar.Separator());
            var zoomField = new qx.ui.form.Spinner(0, self.getZoom(), 18).set({
                maxWidth: 50,
                maxHeight: 25,
                alignX: "center",
                alignY: "middle"
            });
            zoomField.setToolTip(self.__toolTipsManager("zoom"));
            var vLayout = new qx.ui.layout.VBox();
            var container = new qx.ui.container.Composite(vLayout);
            var labelUi = new qx.ui.basic.Label(self.tr("Zoom")).set({
                rich: true
            });
            container.add(labelUi, {flex: 1});
            container.add(zoomField, {flex: 1});
            part.add(container, {
                flex: 1
            });
            self.ui["zoom"] = zoomField;
            self.ui["zoom"].addListener("changeValue", function () {
                self.setZoom(this.getValue());
                self.__saveSettings();
            });
            part.add(new qx.ui.toolbar.Separator());
            var latitudeField = new qx.ui.form.TextField().set({
                alignX: "center",
                alignY: "middle",
                minWidth: 140
            });
            latitudeField.setToolTip(self.__toolTipsManager("latitude"));
            var vLayoutL = new qx.ui.layout.VBox();
            var containerL = new qx.ui.container.Composite(vLayoutL);
            var labelUiL = new qx.ui.basic.Label(self.tr("Latitud")).set({
                rich: true
            });
            containerL.add(labelUiL, {flex: 1});
            containerL.add(latitudeField, {flex: 1});
            part.add(containerL, {
                flex: 1
            });
            self.ui["latitude"] = latitudeField;
            self.ui["latitude"].setValue(self.getLatitude());
            self.ui["latitude"].addListener("input", function () {
                self.__saveSettings();
            });
            part.add(new qx.ui.toolbar.Separator());
            var longitudeField = new qx.ui.form.TextField().set({
                alignX: "center",
                alignY: "middle",
                minWidth: 140
            });
            longitudeField.setToolTip(self.__toolTipsManager("longitude"));
            var vLayoutLon = new qx.ui.layout.VBox();
            var containerLon = new qx.ui.container.Composite(vLayoutLon);
            var labelUiLon = new qx.ui.basic.Label(self.tr("Longitud")).set({
                rich: true
            });
            containerLon.add(labelUiLon, {flex: 1});
            containerLon.add(longitudeField, {flex: 1});
            part.add(containerLon, {flex: 1
            });
            self.ui["longitude"] = longitudeField;
            self.ui["longitude"].setValue(self.getLongitude());
            self.ui["longitude"].addListener("input", function () {
                self.__saveSettings();
            });
            part.add(new qx.ui.toolbar.Separator());
            var type = new qxnw.fields.selectBox().set({
                alignX: "center",
                alignY: "middle"
            });
            type.setToolTip(self.__toolTipsManager("type"));
            type.getValue = function () {
                var data = new Array();
                if (!this.isSelectionEmpty()) {
                    var selectModel = this.getSelection()[0].getModel();
                    var selectText = this.getSelection()[0].getLabel();
                    data["type"] = selectModel;
                    data["type" + "_text"] = selectText;
                } else {
                    return "";
                }
                return data;
            };
            type.setValue = function (value) {
                var items = this.getSelectables(true);
                for (var i = 0; i < items.length; i++) {
                    if (items[i].getModel() == value) {
                        this.setSelection([items[i]]);
                    }
                }
                return true;
            };
            var vLayoutType = new qx.ui.layout.VBox();
            var containerType = new qx.ui.container.Composite(vLayoutType);
            var labelUiType = new qx.ui.basic.Label(self.tr("Tipo")).set({
                rich: true
            });
            containerType.add(labelUiType, {flex: 1});
            containerType.add(type, {flex: 1});
            part.add(containerType, {
                flex: 1
            });
            self.ui["type"] = type;
            var data = {};
            data["roadMap"] = "Normal";
            data["satellite"] = "Satélite";
            data["hybrid"] = "Híbrido";
            data["terrain"] = "Relieve";
            qxnw.utils.populateSelectFromArray(self.ui["type"], data);
            self.ui["type"].addListener("changeSelection", function () {
                var val = this.getValue();
                self.setMapType(val["type"]);
                self.__saveSettings();
            });
            self.toolBar.add(part);
            self.containerTools.add(self.toolBar, {
                flex: 1
            });
        }
    }
});

