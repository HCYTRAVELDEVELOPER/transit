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
 * Class created to be the main window. Into this class, you can put content as sub-windows, show forms, see some bars and more!
 */
qx.Class.define("qxnw.forms.favorites", {
    extend: qxnw.forms,
    /**
     * Gets and create the session data, starts partial layout, sets the rpcUrl value and gets and save the actual theme. 
     */
    construct: function(parent) {
        this.base(arguments);
        var self = this;
        self.removeListenerById(self.getListenerIdClose());

//        var border = new qx.ui.decoration.Single(1, "solid", "black");
//        self.set({
//            decorator: border
//        });

        self.__parent = parent;
        self.getChildControl("captionbar").setVisibility("excluded");
        self.set({
            width: 100,
            height: 200,
            contentPaddingTop: 0,
            contentPaddingRight: 0,
            contentPaddingLeft: 0
        });
        var layout = new qx.ui.layout.VBox();
        self.setLayout(layout);

        self.addListenerOnce('appear', function() {
            self.populateFavorites();
            var root = qx.core.Init.getApplication().getRoot();
            var bounds = root.getBounds();
            var width = bounds.width - self.getWidth() - 30;
            self.moveTo(width, 30);
            qxnw.animation.startEffect("rotateIn", self);
        });

        self.__layoutButtons = new qx.ui.layout.HBox();
        self.__containerButtons = new qx.ui.container.Composite(self.__layoutButtons).set({
            height: 0
        });
        self.addWidget(self.__containerButtons);


        self.__layoutContent = new qx.ui.layout.VBox();
        self.__containerContent = new qx.ui.container.Composite(self.__layoutContent).set({
            padding: 5
        });
        self.addWidget(self.__containerContent);

        self.createButtonsBar();
        self.createContent();
        /*
         self.addListenerOnce("minimize", function() {
         var button = new qx.ui.form.HoverButton("Hello World");
         button.addListener("execute", function(e) {
         alert("Button is hovered");
         }, this);
         self.MainWindow.add(button);
         });
         */
    },
    destruct: function destruct() {
        try {
            this._disposeObjects("__layoutButtons");
            this._disposeObjects("__layoutContent");
            this._disposeObjects("__containerButtons");
            this._disposeObjects("__containerContent");
            this._disposeObjects("__parent");
            for (var i = 0; i < this.ui.length; i++) {
                this._disposeObjects(this.fields[i]);
            }
        } catch (e) {
            qxnw.utils.bindError(e, this, 0, true, false);
        }
    },
    properties: {
    },
    members: {
        __layoutButtons: null,
        __layoutContent: null,
        __containerButtons: null,
        __containerContent: null,
        __parent: null,
        populateFavorites: function populateFavorites() {
            var self = this;
            var favorites = qxnw.local.getFavorites();
            if (favorites == null) {
                return;
            }
            for (var i = 0; i < favorites.length; i++) {
                var label = new qx.ui.basic.Label("<b>-" + favorites[i].label + "</b>").set({
                    rich: true,
                    cursor: "pointer"
                });
                label.setUserData("class", favorites[i].classname);
                self.__containerContent.add(label, {
                    flex: 1
                });
                label.addListener("click", function(e) {
                    self.openFavorite(this);
                });
            }
        },
        openFavorite: function openFavorite(label) {
            var classname = label.getUserData("class");
            var favorites = qxnw.local.getFavoriteByClassName(classname);
            if (!favorites) {
                return;
            }
            main.restoreSubWindowByArrayData(favorites);
        },
        createContent: function createContent() {
            var self = this;
            var title = new qx.ui.basic.Label("Favoritos: <br /><br />").set({
                rich: true
            });
            self.__containerContent.add(title);
        },
        createButtonsBar: function createButtonsBar() {
            var self = this;
            var minimizeImage = new qx.ui.basic.Image(qxnw.config.execIcon("list-remove")).set({
                cursor: "pointer",
                maxHeight: 10
            });
            var spacer = new qx.ui.container.Composite(new qx.ui.layout.Grow());

            self.__containerButtons.set({
                maxHeight: 10
            });
            self.__containerButtons.add(spacer, {
                flex: 1
            });
            self.__containerButtons.add(minimizeImage);

            minimizeImage.addListener("click", function() {
                self.close();
                self.__parent.__isFavoritesCreated = false;
            });
        }
    }
});