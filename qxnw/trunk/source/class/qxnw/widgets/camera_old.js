qx.Class.define("qxnw.widgets.camera_old", {
    extend: qx.ui.container.Composite,
    include: [qx.locale.MTranslation],
    construct: function (height, width) {
        var self = this;
        this.base(arguments);
        self.classname = "qxnw.camera";
        this.__baseLayout = new qx.ui.layout.Grid();
        this.__baseLayout.setRowFlex(0, 1);
        this.__baseLayout.setColumnFlex(0, 1);
        this.__baseLayout.setColumnFlex(1, 1);
        this.setLayout(this.__baseLayout);
        if (typeof height == 'undefined') {

        }
        this.setMinHeight(height);
        this.setMinWidth(width);
        this.ui = [];
        this.__prePath = "";
        this.__postPath = "";
        this.returnCompletePath(true);
    },
    destruct: function destruct() {
        try {
            this.destroy();
            this._disposeObjects("this.ui");
            this._disposeObjects("this.__baseLayout");
            this._disposeObjects("image");
            this._disposeObjects("__label");
            this._disposeObjects("buttonsContainer");
            this.dispose();
        } catch (e) {
            this.dispose();
        }
    },
    events: {
        "upload": "qx.event.type.Data"
    },
    members: {
        ie: !!navigator.userAgent.match(/MSIE/),
        protocol: location.protocol.match(/https/i) ? 'https' : 'http',
        callback: null,
        swf_url: '/nwlib%version%/includes/cam/webcam.swf',
        shutter_url: '/nwlib%version%/includes/cam/shutter.mp3',
        api_url: '/nwlib%version%/includes/cam/upload.inc.php',
        loaded: false,
        quality: 100,
        shutter_sound: true,
        stealth: false,
        __namePicture: null,
        __freeze: null,
        __value: null,
        __baseLayout: null,
        ui: null,
        __label: null,
        __isCreatedImagesLayout: false,
        __uploaderValue: false,
        __prePath: "",
        __postPath: "",
        __tabIndexTmp: null,
        hooks: {
            onLoad: null,
            onComplete: null,
            onError: null
        },
        addAutomatedFunctions: function addAutomatedFunctions() {
            var self = this;
            if (typeof self.ui["take_picture"] != 'undefined') {
                self.ui["take_picture"].addListener("execute", function () {
                    self.freeze();
                    self.ui["upload"].setEnabled(true);
                    self.ui["take_picture"].setEnabled(false);
                });
            }
            if (typeof self.ui["upload"] != 'undefined') {
                self.ui["upload"].addListener("execute", function () {
                    //self.freeze();
                    self.upload();
                });
            }
            if (typeof self.ui["cancel"] != 'undefined') {
                self.ui["cancel"].addListener("execute", function () {
                    self.reset();
                    self.ui["upload"].setEnabled(false);
                    self.ui["take_picture"].setEnabled(true);
                });
            }
        },
        handleUploaderResponse: function handleUploaderResponse(response) {
            var self = this;
            self.__value = response;
        },
        setAllTabIndex: function setAllTabIndex(index) {
            var self = this;
            this.__tabIndexTmp = index;
        },
        createDefaultButtons: function createDefaultButtons() {
            var self = this;
            var buttonsContainer = new qx.ui.container.Composite(new qx.ui.layout.HBox());
            buttonsContainer.add(new qx.ui.core.Spacer(), {
                flex: 1
            });
            self.ui["take_picture"] = new qx.ui.form.Button(self.tr("Tomar foto"), qxnw.config.execIcon("camera-web", "devices")).set({
                maxHeight: 30
            });
            ;
            buttonsContainer.add(self.ui["take_picture"], {
                flex: 0
            });
            self.ui["upload"] = new qx.ui.form.Button(self.tr("Subir"), qxnw.config.execIcon("document-save-as")).set({
                maxHeight: 30
            });
            ;
            buttonsContainer.add(self.ui["upload"], {
                flex: 0
            });
            self.ui["upload"].setEnabled(false);
            self.ui["upload_file"] = new qxnw.uploader(false, true);
            self.ui["upload_file"].addListener("completed", function (e) {
                var response = e.getData();
                if (typeof response != 'undefined' && response != null) {
                    self.handleUploaderResponse(response);
                }
            });
            buttonsContainer.add(self.ui["upload_file"].getContainer(), {
                flex: 0
            });
            self.ui["cancel"] = new qx.ui.form.Button(self.tr("Limpiar"), qxnw.config.execIcon("edit-clear")).set({
                maxHeight: 30
            });
            buttonsContainer.add(self.ui["cancel"], {
                flex: 0
            });
            self.add(buttonsContainer, {
                column: 0,
                row: 1,
                colSpan: 2
            });
            self.addAutomatedFunctions();

            if (self.__tabIndexTmp != null) {
                self.ui["take_picture"].setTabIndex(self.__tabIndexTmp);
                self.ui["upload"].setTabIndex(self.__tabIndexTmp);
                self.ui["upload_file"].setTabIndex(self.__tabIndexTmp);
                self.ui["cancel"].setTabIndex(self.__tabIndexTmp);
            }
        },
        set_hook: function (name, callback) {
            if (typeof (this.hooks[name]) == 'undefined') {
                return alert("Hook type not supported: " + name);
            }
            this.hooks[name] = callback;
        },
        fire_hook: function (name, value) {
            if (this.hooks[name]) {
                if (typeof (this.hooks[name]) == 'function') {
                    this.hooks[name](value);
                } else if (typeof (this.hooks[name]) == 'array') {
                    this.hooks[name][0][this.hooks[name][1]](value);
                } else if (window[this.hooks[name]]) {
                    window[ this.hooks[name] ](value);
                }
                return true;
            }
            return false;
        },
        set_api_url: function (url) {
            this.api_url = url;
        },
        set_swf_url: function (url) {
            this.swf_url = url;
        },
        get_html: function (width, height, server_width, server_height) {
            if (!server_width) {
                server_width = width;
            }
            if (!server_height) {
                server_height = height;
            }
            var html = '';
            var flashvars = 'shutter_enabled=' + (this.shutter_sound ? 1 : 0) +
                    '&shutter_url=' + escape(this.shutter_url) +
                    '&width=' + width +
                    '&height=' + height +
                    '&server_width=' + server_width +
                    '&server_height=' + server_height;

            if (this.ie) {
                html += '<object classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" codebase="' + this.protocol + '://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=9,0,0,0" width="' + width + '" height="' + height + '" id="webcam_movie" align="middle"><param name="allowScriptAccess" value="always" /><param name="allowFullScreen" value="false" /><param name="movie" value="' + this.swf_url.replace("%version%", qxnw.userPolicies.getNwlibVersion()) + '" /><param name="loop" value="false" /><param name="menu" value="false" /><param name="quality" value="best" /><param name="bgcolor" value="#ffffff" /><param name="flashvars" value="' + flashvars + '"/></object>';
            } else {
                html += '<embed id="webcam_movie" src="' + this.swf_url.replace("%version%", qxnw.userPolicies.getNwlibVersion()) + '" loop="false" menu="false" quality="best" bgcolor="#ffffff" width="' + width + '" height="' + height + '" name="webcam_movie" align="middle" allowScriptAccess="always" allowFullScreen="false" type="application/x-shockwave-flash" pluginspage="http://www.macromedia.com/go/getflashplayer" flashvars="' + flashvars + '" />';
            }
            this.loaded = false;
            return html;
        },
        getFlashBars: function getFlashBars(width, height, server_width, server_height) {
            var self = this;
            if (!server_width) {
                server_width = width;
            }
            if (!server_height) {
                server_height = height;
            }
            self.createDefaultButtons();
            var data = {
                shutter_enabled: (this.shutter_sound ? 1 : 0),
                shutter_url: escape(this.shutter_url.replace("%version%", qxnw.userPolicies.getNwlibVersion())),
                width: width,
                height: height,
                server_width: server_width,
                server_height: server_height
            };
            self.__embedFlash = new qx.ui.embed.Flash(this.swf_url.replace("%version%", qxnw.userPolicies.getNwlibVersion())).set({
                loop: false,
                menu: false,
                quality: "best",
                allowScriptAccess: "always"
            });
            self.__embedFlash.setId('webcam_movie');
            self.__embedFlash.setMayScript(true);
            self.__embedFlash.setVariables(data);
            self.loaded = true;
            self.add(self.__embedFlash, {
                column: 0,
                row: 0,
                colSpan: 2
            });
            return self;
        },
        get_movie: function () {
            if (!this.loaded) {
                return alert("ERROR: Movie is not loaded yet");
            }
            var movie = document.getElementById('webcam_movie');
            if (!movie) {
                alert("ERROR: Cannot locate movie 'webcam_movie' in DOM");
            }
            return this.__embedFlash.getFlashElement();
        },
        set_stealth: function (stealth) {
            this.stealth = stealth;
        },
        snap: function (url, callback, stealth) {
            if (callback) {
                this.set_hook('onComplete', callback);
            }
            if (url) {
                this.set_api_url(url);
            }
            if (typeof (stealth) != 'undefined') {
                this.set_stealth(stealth);
            }
            this.get_movie()._snap(this.api_url.replace("%version%", qxnw.userPolicies.getNwlibVersion()), this.quality, this.shutter_sound ? 1 : 0, this.stealth ? 1 : 0);
        },
        freeze: function () {
            this.get_movie()._snap('', this.quality, this.shutter_sound ? 1 : 0, 0);
        },
        getNamePicture: function getnamePicture() {
            var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
            var string_length = 8;
            var randomstring = '';
            for (var i = 0; i < string_length; i++) {
                var rnum = Math.floor(Math.random() * chars.length);
                randomstring += chars.substring(rnum, rnum + 1);
            }
            this.__namePicture = randomstring;
            return this.__namePicture;
        },
        returnCompletePath: function returnCompletePath(bool) {
            if (bool) {
                this.__prePath = "/imagenes/";
                this.__postPath = ".jpg";
            } else if (!bool) {
                this.__prePath = "";
                this.__postPath = "";
            }
        },
        returnPartialPath: function returnPartialPath(bool) {
            if (bool) {
                this.__postPath = ".jpg";
            } else if (!bool) {
                this.__postPath = "";
            }
        },
        upload: function upload(url, callback) {
            var self = this;
            if (callback) {
                self.set_hook('onComplete', callback);
            }
            if (url) {
                this.set_api_url(url);
            }
            var name = self.getNamePicture();
            self.get_movie()._upload(this.api_url.replace("%version%", qxnw.userPolicies.getNwlibVersion()) + "?name=" + name);
            self.__value = this.__prePath + name + this.__postPath;
            self.fireDataEvent("upload", self.__value);
            self.showLabel("<b>Foto subida correctamente</b>");
            self.reset(false);
            return name;
        },
        resetLabel: function resetLabel() {
            var self = this;
            if (self.__label != null) {
                self.__label.setValue("");
            }
        },
        showLabel: function showLabel(message) {
            var self = this;
            self.__label = new qx.ui.basic.Label(message).set({
                rich: true,
                maxHeight: 20
            });
            self.add(self.__label, {
                column: 0,
                row: 4,
                colSpan: 2
            });
        },
        setValue: function setValue(val) {
            this.__value = val;
            this.addImage(val, true);
        },
        createImagesLayout: function createImagesLayout() {
            var self = this;
            if (!self.__isCreatedImagesLayout) {
                self.imagesContainer = new qx.ui.container.Composite(new qx.ui.layout.HBox());
                self.add(self.imagesContainer, {
                    column: 0,
                    row: 3
                });
                self.__isCreatedImagesLayout = true;
            }
        },
        addImage: function addImage(val, simple) {
            var self = this;
            if (typeof simple == 'undefined') {
                simple = false;
            }
            if (simple) {
                var path = val;
            } else {
                var path = "/imagenes/" + val + ".jpg";
            }
            var image = new qx.ui.basic.Image(path).set({
                allowGrowX: false,
                allowGrowY: false,
                scale: true,
                height: 35
            });
            image.addListener("tap", function () {
                var f = new qxnw.forms();
                f.setModal(true);
                f.setTitle(self.tr("Visor de imágenes"));
                f.createFlexPrinterToolBar(this.getSource());
                f.addFrame(this.getSource(), false);
                f.show();
            });
            if (!self.__isCreatedImagesLayout) {
                self.createImagesLayout();
            }
            self.imagesContainer.add(image);
            image.setUserData("foto", path);
            if (qx.io.ImageLoader.isLoaded(path)) {
                var width = qx.io.ImageLoader.getWidth(path);
                var height = qx.io.ImageLoader.getHeight(path);
                var maxHeight = 50 > parseInt(height) ? parseInt(height) : 50;
                var scale = parseInt(width) * maxHeight / parseInt(height);
                if (scale == null || scale == "" || 1 > scale) {
                    scale = 60;
                } else {
                    scale = Math.round(scale);
                }
                image.setWidth(scale);
            } else {
                image.addListener("loaded", function () {
                    var foto = this.getUserData("foto");
                    if (foto == null) {
                        return;
                    }
                    var width = qx.io.ImageLoader.getWidth(foto);
                    var height = qx.io.ImageLoader.getHeight(foto);
                    var maxHeight = 50 > parseInt(height) ? parseInt(height) : 50;
                    var scale = parseInt(width) * maxHeight / parseInt(height);
                    if (scale == null || scale == "" || 1 > scale) {
                        scale = 60;
                    } else {
                        scale = Math.round(scale);
                    }
                    this.setWidth(scale);
                });
            }
        },
        cleanValidate: function cleanValidate() {
            var self = this;
            if (self.__embedFlash != null) {
                qxnw.utils.removeBorders(self.__embedFlash);
            }
        },
        getValue: function getValue() {
            return this.__value;
        },
        setValid: function setValid(bool) {
            var self = this;
            if (bool == false) {
                if (self.__embedFlash != null) {
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
                }
            } else {
                if (self.id_listener != null) {
                    self.removeListenerById(self.id_listener);
                }
            }
        },
        setInvalidMessage: function setInvalidMessage(message) {
            this.__invalidMessage = message;
        },
        setRequired: function setRequired(bool) {
            this.__required = bool;
        },
        reset: function (resetLabel) {
            if (typeof resetLabel == null) {
                this.resetLabel();
            }
            try {
                this.get_movie()._reset();
            } catch (e) {

            }
        },
        configure: function (panel) {
            // "camera", "privacy", "default", "localStorage", "microphone", "settingsManager"
            if (!panel) {
                panel = "camera";
            }
            this.get_movie()._configure(panel);
        },
        set_quality: function (new_quality) {
            this.quality = new_quality;
        },
        set_shutter_sound: function (enabled, url) {
            this.shutter_sound = enabled;
            this.shutter_url = url ? url : 'shutter.mp3';
        },
        setFocus: function setFocus() {
            this.getFocusElement().focus();
        },
        focus: function focus() {
            this.getFocusElement().focus();
        },
        flash_notify: function (type, msg) {
            switch (type) {
                case 'flashLoadComplete':
                    this.loaded = true;
                    this.fire_hook('onLoad');
                    break;
                case 'error':
                    if (!this.fire_hook('onError', msg)) {
                        alert("JPEGCam Flash Error: " + msg);
                    }
                    break;
                case 'success':
                    this.fire_hook('onComplete', msg.toString());
                    break;
                default:
                    alert("jpegcam flash_notify: " + type + ": " + msg);
                    break;
            }
        }
    }
});