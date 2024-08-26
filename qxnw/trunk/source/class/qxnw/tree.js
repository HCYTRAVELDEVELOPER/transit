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
qx.Class.define("qxnw.tree", {
    extend: qx.core.Object,
    construct: function () {
        this.base(arguments);
        this.createTree();
    },
    properties: {
        title: {
            init: "Please put a title here",
            check: "String"
        },
        icon: {
            init: "icon/16/places/user-desktop.png",
            check: "String"
        },
        levelOneIcon: {
            init: "icon/16/actions/dialog-apply.png",
            check: "String"
        },
        levelTwoIcon: {
            init: "icon/16/places/user-desktop.png",
            check: "String"
        },
        levelThreeIcon: {
            init: "icon/16/places/user-desktop.png",
            check: "String"
        },
        width: {
            init: 200,
            check: "Integer"
        },
        height: {
            init: 150,
            check: "Integer"
        }
    },
    members: {
        __tree: null,
        __root: null,
        __title: null,
        __levelOne: null,
        __levelTwo: null,
        __levelThree: null,
        getSelectedItem: function getSelectedItem() {
            var sct = this.getSelection();
            for (var i = 0; i < sct.length; i++) {
                var rta = {};
                rta["model"] = sct[i].getModel();
                rta["label"] = sct[i].getLabel();
                rta["widget"] = sct[i];
                return rta;
            }
            return;
        },
        getSelection: function getSelection() {
            return this.__tree.getSelection();
        },
        getBase: function getBase() {
            return this.__tree;
        },
        createTree: function createTree() {
            var self = this;
            self.__tree = null;
            self.__tree = new qx.ui.tree.Tree().set({
                width: self.getWidth(),
                height: self.getHeight(),
                padding: 0
            });
            self.addMainLevel();
        },
        cleanAll: function cleanAll() {
            var children = this.__tree.getChildren();
            for (var i = 0; i < children.length; i++) {
                children[i].removeAll();
            }
        },
        getItems: function getItems(recursive, invisible) {
            if (typeof invisible == 'undefined') {
                invisible = false;
            }
            return this.__tree.getItems(recursive, invisible);
        },
        getTree: function getTree() {
            return this.__tree;
        },
        addMainLevel: function () {
            var self = this;
            self.__tree.resetRoot();
            self.__tree.setHideRoot(false);
            self.__tree.setDecorator(null);
            self.__root = new qx.ui.tree.TreeFolder(self.getTitle()).set({
                icon: self.getIcon()
            });
            self.__root.setOpen(true);
            self.__tree.setRoot(self.__root);
            return self.__root;
        },
        process: function (child) {
            var self = this;
            var item = self.__tree.getChildren();
            item = item[0];
            if (typeof child != 'undefined') {
                item = child;
            }
            if (item != null) {
                var children = item;
                for (var i = 0; i < children.getChildren().length; i++) {
                    var child = children.getChildren();
                    child = child[i];
                    this.process(child);

                    if (typeof children != new qx.ui.tree.TreeFolder()) {
                        children.bind("checked", child, "checked", {
                            converter: function (value, child) {
                                if (value === null) {
                                    return child.getChecked();
                                }
                                return value;
                            }
                        });

                        child.bind("checked", children, "checked", {
                            converter: function (value, parent) {
                                var children = parent.getChildren().toArray();

                                var isAllChecked = children.every(function (item) {
                                    return item.getChecked();
                                });

                                var isOneChecked = children.some(function (item) {
                                    return item.getChecked() || item.getChecked() == null;
                                });

                                if (isOneChecked) {
                                    return isAllChecked ? true : null;
                                } else {
                                    return false;
                                }
                            }
                        });
                    }
                }
            }
        },
        addFolderOne: function (name, type, icon) {
            var self = this;
            var icon = typeof icon == 'undefined' ? self.getLevelOneIcon() : icon;
            self.__levelOne = new qx.ui.tree.TreeFolder(name).set({
                icon: icon
            });
            if (typeof type != 'undefined') {
                switch (type) {
                    case "checkbox":
                        var checkBox = new qx.ui.form.CheckBox();
                        //checkBox.bind("value", self.__levelOne, "value");
                        checkBox.setFocusable(false);
                        checkBox.setTriState(true);
                        self.__levelOne.setUserData("checkbox", checkBox);
                        self.__levelOne.addWidget(checkBox);
                        break;
                }
            }
            self.__levelOne.setOpen(false);
            self.__root.add(self.__levelOne);
            return self.__levelOne;
        },
        addFileOne: function (name, type, icon) {
            var self = this;
            var icon = typeof icon == 'undefined' ? self.getLevelOneIcon() : icon;
            self.__levelOne = new qx.ui.tree.TreeFile(name).set({
                icon: icon
            });
            if (typeof type != 'undefined') {
                switch (type) {
                    case "checkbox":
                        var checkBox = new qx.ui.form.CheckBox();
                        self.__levelOne.setUserData("checkbox", checkBox);
                        self.__levelOne.addWidget(checkBox);
                        break;
                }
            }
            self.__root.add(self.__levelOne);
        },
        addFolderTwo: function (name, type, icon, open) {
            var self = this;
            var icon = typeof icon == 'undefined' ? self.getLevelTwoIcon() : icon;
            if (typeof open == 'undefined') {
                open = false;
            }
            self.__levelTwo = new qx.ui.tree.TreeFolder(name).set({
                icon: icon
            });
            if (typeof type != 'undefined') {
                switch (type) {
                    case "checkbox":
                        var checkBox = new qx.ui.form.CheckBox();
                        self.__levelTwo.setUserData("checkbox", checkBox);
                        self.__levelTwo.addWidget(checkBox);
                        break;
                }
            }
            self.__levelTwo.setOpen(open);
            self.__levelOne.add(self.__levelTwo);
            return self.__levelTwo;
        },
        addFolderToFolder: function addFolderToFolder(folder, name, type, icon) {
            var self = this;
            var icon = typeof icon == 'undefined' ? self.getLevelTwoIcon() : icon;
            var file = new qx.ui.tree.TreeFolder(name).set({
                icon: icon
            });
            if (typeof type != 'undefined') {
                switch (type) {
                    case "checkbox":
                        var checkBox = new qx.ui.form.CheckBox().set({
                            rich: true
                        });
                        file.setUserData("checkbox", checkBox);
                        file.addWidget(checkBox);
                        break;
                }
            }
            file.setOpen(false);
            folder.add(file);
            return file;
        },
        addFileToFolder: function addFileToFolder(folder, name, type, icon) {
            var self = this;
            var icon = typeof icon == 'undefined' ? self.getLevelTwoIcon() : icon;
            var file = new qx.ui.tree.TreeFile(name).set({
                icon: icon
            });
            if (typeof type != 'undefined') {
                switch (type) {
                    case "checkbox":
                        var checkBox = new qx.ui.form.CheckBox();
                        file.setUserData("checkbox", checkBox);
                        file.addWidget(checkBox);
                        break;
                }
            }
            file.setOpen(false);
            folder.add(file);
            return file;
        },
        addFileTwo: function (name, type, icon) {
            var self = this;
            var icon = typeof icon == 'undefined' ? self.getLevelTwoIcon() : icon;
            self.__levelTwo = new qx.ui.tree.TreeFolder(name).set({
                icon: icon
            });
            if (typeof type != 'undefined') {
                switch (type) {
                    case "checkbox":
                        var checkBox = new qx.ui.form.CheckBox();
                        self.__levelTwo.setUserData("checkbox", checkBox);
                        self.__levelTwo.addWidget(checkBox);
                        break;
                }
            }
            self.__levelOne.add(self.__levelTwo);
        },
        addFolderThree: function (name, type, icon) {
            var self = this;
            var icon = typeof icon == 'undefined' ? self.getLevelThreeIcon() : icon;
            self.__levelThree = new qx.ui.tree.TreeFolder(name).set({
                icon: icon
            });
            if (typeof type != 'undefined') {
                switch (type) {
                    case "checkbox":
                        var checkBox = new qx.ui.form.CheckBox();
                        self.__levelThree.setUserData("checkbox", checkBox);
                        self.__levelThree.addWidget(checkBox);
                        break;
                }
            }
            self.__levelThree.setOpen(false);
            self.__levelTwo.add(self.__levelThree);
        },
        addFileThree: function (name, type, icon) {
            var self = this;
            var icon = typeof icon == 'undefined' ? self.getLevelThreeIcon() : icon;
            self.__levelThree = new qx.ui.tree.TreeFile(name).set({
                icon: icon
            });
            if (typeof type != 'undefined') {
                switch (type) {
                    case "checkbox":
                        var checkBox = new qx.ui.form.CheckBox();
                        self.__levelThree.setUserData("checkbox", checkBox);
                        self.__levelThree.addWidget(checkBox);
                        break;
                }
            }
            self.__levelTwo.add(self.__levelThree);
        }
    }
});