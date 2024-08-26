/* ************************************************************************
 
 Copyright:
 2016 Netwoods.net, http://www.netwoods.net
 
 License:
 LGPL: http://www.gnu.org/licenses/lgpl.html
 EPL: http://www.eclipse.org/org/documents/epl-v10.php
 See the LICENSE file in the project's top-level directory for details.
 
 Authors:
 * Andrés Flórez (andresf)
 
 07 Nov 2013: CAMBIOS EN LA CARGA Y PRECARGA DE CKEDITOR
 26 MAR 2014: CAMBIOS EN EL TAMAÑO FLEX DEL CKEDITOR
 ************************************************************************ */

qx.Class.define("qxnw.widgets.ckeditor", {
    extend: qx.ui.form.TextArea,
    properties: {
        appearance: {
            refine: true
        }
    },
    destruct: function destruct() {
        try {
            this.destroy();
            this._disposeObjects("this.__ckEditor");
            this._disposeObjects("this.__parseData");
        } catch (e) {

        }
    },
    construct: function (value, menubarheight, mode) {
        if (typeof menubarheight == 'undefined' || menubarheight == 0 || !menubarheight) {
            menubarheight = 141; // default menubar is 141px
        }
        this.base(arguments, value);
        var self = this;
        self.setNativeContextMenu(true);
        self.set({
            autoSize: false,
            height: 400
        });
        var toolbar;
        if (typeof mode == 'undefined') {
            toolbar = [
                ['Source', '-', 'Save', 'NewPage', 'Preview', '-', 'Templates'],
                ['Cut', 'Copy', 'Paste', 'PasteText', 'PasteFromWord', '-', 'Print', 'SpellChecker', 'Scayt'],
                ['Undo', 'Redo', '-', 'Find', 'Replace', '-', 'SelectAll', 'RemoveFormat'],
                ['Form', 'Checkbox', 'Radio', 'TextField', 'Textarea', 'Select', 'Button', 'ImageButton', 'HiddenField'],
                '/',
                ['Bold', 'Italic', 'Underline', 'Strike', '-', 'Subscript', 'Superscript'],
                ['NumberedList', 'BulletedList', '-', 'Outdent', 'Indent', 'Blockquote', 'CreateDiv'],
                ['JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock'],
                ['BidiLtr', 'BidiRtl'],
                ['Link', 'Unlink', 'Anchor'],
                ['Image', 'Flash', 'Table', 'HorizontalRule', 'Smiley', 'SpecialChar', 'PageBreak', 'Iframe'],
                '/',
                ['Styles', 'Format', 'Font', 'FontSize'],
                ['TextColor', 'BGColor'],
                ['ShowBlocks', '-', 'lineheight']
            ];
        } else if (mode == "simple") {
            toolbar = [['Cut', 'Copy', 'Paste', 'PasteText', 'PasteFromWord'],
                ['Bold', 'Italic', 'Underline', 'Strike', '-', 'Subscript', 'Superscript'], ['FontSize', 'TextColor'],
                ['NumberedList', 'BulletedList'], ['JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock']];
        } else if (mode == "cero") {
            toolbar = [];
        }
        var isLoaded = qxnw.config.getIsCkeditorLoaded();
        if (!isLoaded) {
            self.addListenerOnce("appear", function () {
                self.isLoaded = true;
            });
            self.isLoaded = false;

            var uri = "/nwlib" + qxnw.userPolicies.getNwlibVersion() + "/includes/ckeditor/ckeditor.js";
            var sl = new qx.bom.request.Script();

            var src = qx.util.ResourceManager.getInstance().toUri(uri);

            sl.open("GET", src);

            sl.onload = function (status) {

                if (status !== false) {
                    if (!self.isLoaded) {

                        self.addListenerOnce("appear", function (e) {

                            var el = self.getContentElement().getDomElement();
                            var hint = self.getBounds();
                            self.__ckEditor = CKEDITOR.replace(el, {
                                on: {
                                    'instanceReady': function (evt) {
                                        evt.editor.resize("100%", "100%", true, false);
                                    }
                                },
                                autoGrow_minHeight: hint.height - menubarheight,
                                //  42px for the frame
                                //width: hint.width,
                                resize_enabled: true,
                                autoGrow_onStartup: true,
                                tabIndex: self.getTabIndex(),
                                toolbar: toolbar
                            });
//                            self.__ckEditor.resize('100%', '100%', true);
//                            self.__ckEditor.Height = '100%';
                            self.__ckEditor.on('key', function (event) {
                                if (event.data.keyCode == 33 || event.data.keyCode == 34) {
                                    event.cancel();
                                }
                            });
                            if (self.__parseData != self) {
                                self.__ckEditor.setData(self.__parseData);
                            }
                        }, self);
                    } else {

                        var el = self.getContentElement().getDomElement();
                        var hint = self.getBounds();
                        self.__ckEditor = CKEDITOR.replace(el, {
                            on: {
                                // maximize the editor on startup
                                'instanceReady': function (evt) {
//                                    evt.editor.resize("100%", "100%", true, false);
                                    if (self.__finalHeight != null) {
                                        evt.editor.resize("100%", self.__finalHeight - 30);
                                    }
                                }
                            },
//                            autoGrow_minHeight: hint.height - menubarheight,
                            //  42px for the frame
                            //width: hint.width,
                            //baseFloatZIndex: 9,
                            resize_enabled: true,
                            autoGrow_onStartup: true,
                            tabIndex: self.getTabIndex(),
                            toolbar: toolbar
                        });

//                        self.__ckEditor.resize('100%', '100%');
                        self.__ckEditor.on('key', function (event) {
                            if (event.data.keyCode == 9) {
                                if (self.__parentCK != null) {
                                    self.__parentCK.sendNextTab(self);
                                }
                            }
                            if (event.data.keyCode == 8) {
                                if (self.__parentCK != null) {
                                    self.__parentCK.setEnableBackspaceCK(true);
                                }
                            }
                            if (event.data.keyCode == 33 || event.data.keyCode == 34) {
                                event.cancel();
                            }
                        });
                        //self.__ckEditor.Height = '1000px';
                        if (self.__parseData != false) {
                            self.__ckEditor.setData(self.__parseData);
                        }
                    }
                }
                CKEDITOR.on('dialogDefinition', function (ev) {
                    var dialogName = ev.data.name;
                    var dialogDefinition = ev.data.definition;
                    if (dialogName == 'image') {
                        var infoTab = dialogDefinition.getContents('info');
                        var imageButton = infoTab.get("browse");
                        var textImageButton = infoTab.get("txtUrl");
                        textImageButton['onMyEvent'] = textImageButton['onChange'];
                        imageButton.onClick = function () {
                            var dialog = CKEDITOR.dialog.getCurrent();
                            var position = dialog.getPosition();
                            var x = position.x;
                            var y = position.y;
                            dialogDefinition.dialog.lockRatio = false;
                            var f = new qxnw.nw_file_manager.trees.vista_general();
                            f.setModal(true);
                            f.setOnlySelectOneImage(true);
                            f.addListener("appear", function () {
                                f.setZIndex(99999);
                                //f.setDomTop(100);
                            });
                            f.settings.accept = function () {
                                dialog.move(x, y);
                                f.close();
                                var selectedImage = f.getSelectedImages();
                                if (typeof selectedImage[0] == 'undefined') {
                                    return;
                                }
                                CKEDITOR.dialog.getCurrent().getContentElement('info', 'txtUrl').setValue(selectedImage[0]);
                            };
                            f.addListener("close", function () {
                                dialog.move(x, y);
                            });
                            f.show();
                            f.maximize();
                            dialog.move(100000, 10000);
                        };
                    }
                });
            };
            //sl.setDetermineSuccess(func);
            sl.send();
        } else {
            self.addListenerOnce("appear", function (e) {
                var el = this.getContentElement().getDomElement();
                var hint = this.getBounds();
                self.__ckEditor = CKEDITOR.replace(el, {
                    on: {
                        // maximize the editor on startup
                        'instanceReady': function (evt) {
                            evt.editor.resize("100%", "100%", true, false);
                        }
                    },
                    autoGrow_minHeight: hint.height - menubarheight,
                    //  42px for the frame
                    //width: hint.width,
                    resize_enabled: true,
                    autoGrow_onStartup: true,
                    tabIndex: this.getTabIndex(),
                    toolbar: toolbar
                });
                self.__ckEditor.on('key', function (event) {
                    if (event.data.keyCode == 33 || event.data.keyCode == 34) {
                        event.cancel();
                    }
                });
                if (this.__parseData != false) {
                    this.__ckEditor.setData(this.__parseData);
                }
            }, this);
        }

        this.addListener("resize", function () {
            if (this.__resizeInProgress) {
                return;
            }
            this.__resizeInProgress = true;
            var hint = this.getBounds();
            if (this.__ckEditor != null) {
                try {
                    this.__ckEditor.resize(hint.width, hint.height - 4);
                } catch (e) {

                }
            }
            this.__resizeInProgress = false;
        }, this);
        this.setLiveUpdate(true);
        this.__parseData = null;
    },
    events: {
        resize: "qx.event.type.Data"
    },
    members: {
        __ckEditor: null,
        __parseData: false,
        isLoaded: false,
        __resizeInProgress: false,
        __parentCK: null,
        __finalHeight: null,
        setFinalHeight: function setFinalHeight(h) {
            this.__finalHeight = h;
            try {
                this.__ckEditor.resize("100%", h, true, false);
            } catch (e) {

            }
        },
        setParentCKEditor: function setParentCKEditor(parent) {
            this.__parentCK = parent;
        },
        getCKEditor: function getCKEditor() {
            return this.__ckEditor;
        },
        getEditorValue: function getEditorValue() {
            if (this.__ckEditor != null) {
                return this.__ckEditor.getData();
            } else {
                return null;
            }
        },
        setParseValue: function setParseValue(val) {
            this.__parseData = val;
        },
        linkTo: function (savebutton) {
            savebutton.addListener("execute", function () {
                var old = this.getValue();
                this.__ckEditor.updateElement();
                var val = this.getValue();
                if (old != val) {
                    this.fireDataEvent("changeValue", val, old);
                }
            }, this);
        }
    }
});