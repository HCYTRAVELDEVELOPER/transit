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
qx.Class.define("qxnw.chat.forms.newRoom", {
    extend: qxnw.forms,
    construct: function construct() {
        this.base(arguments);
        var self = this;
        self.setTitle(self.tr("Nueva sala"));
        self.setWidth(400);
        self.setHeight(500);
        self.setModal(true);
        var fields = [
            {
                name: "title",
                type: "textField",
                label: self.tr("Título"),
                required: true
            }
        ];
        self.setFields(fields);
        self.ui.accept.addListener("execute", function() {
            if (!self.validate()) {
                return;
            }
            if (self.pr == null) {
                self.accept();
            } else {
                self.save();
            }
        });
        self.ui.cancel.addListener("execute", function() {
            self.reject();
        });
        self.__list = new qx.ui.form.List();
        self.addNewWidget(self.__list, self.tr("Usuarios vinculados"));
        self.createDeffectButtons();

        self.populateUsersList();
    },
    destruct: function destruct() {
        this._disposeObjects("navTable");
    },
    members: {
        navTable: null,
        save: function save() {
            var self = this;
            var data = self.pr;
            data.users = self.getUsersList();
            var rpc = new qxnw.rpc(self.getRpcUrl(), "master");
            rpc.setAsync(true);
            rpc.exec("saveUsersInRoom", data);
            self.accept();
        },
        getUsersList: function getusersList() {
            var self = this;
            var data = [];
            var childs = self.__list.getChildren();
            for (var i = 0; i < childs.length; i++) {
                if (childs[i].getValue()) {
                    var r = childs[i].getModel();
                    data.push(r);
                }
            }
            return data;
        },
        populateUsersList: function populateUsersList() {
            var self = this;
            var rpc = new qxnw.rpc(qxnw.userPolicies.getRpcUrl(), "master");
            rpc.setAsync(true);
            var func = function(r) {
                self.__list.removeAll();
                for (var i = 0; i < r.length; i++) {
                    var d = r[i];
                    var item = new qx.ui.form.CheckBox(d["nombre"]);
                    item.setValue(d["pertenece"] == "true" ? true : false);
                    item.setModel(d);
                    self.__list.add(item);
                }
            };
            var data = self.pr == null ? 0 : self.pr;
            if (data == 0) {
                data = {
                    room: 0
                };
            }
            rpc.exec("getConnectedUsersToRoom", data, func);
        },
        makeSound: function makeSound() {
            var sound = new qx.bom.media.Audio("/resource/qxnw/chat.wav");
            sound.play();
        },
        setParamRecord: function setParamRecord(pr) {
            var self = this;
            self.pr = pr;
            var title = self.tr("Editando la sala: ");
            title += pr.title;
            self.setTitle(title);
            self.setRecord(pr);
            self.populateUsersList(pr);
        }
    }
});