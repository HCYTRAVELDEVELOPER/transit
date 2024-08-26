qx.Class.define("qxnw.populate", {
    type: "singleton",
    extend: qx.core.Object,
    statics: {
        populateSelect: function populateSelect(parent, selectBox, method, exec, data, options, defaultValue) {
            var self = self.getInstance();
            if (typeof selectBox == 'undefined') {
                self.bindError("El selectBox que intenta ingresar no existe.", self);
                return false;
            }
            var rpcUrl = qxnw.userPolicies.rpcUrl();
            var rpc = new qxnw.rpc(rpcUrl, method);
            rpc.setAsync(true);
            var func = function(r) {
                for (var i = 0; i < r.length; i++) {
                    selectItem = new qxnw.widgets.listItem(r[i].nombre);
                    model = r[i].id;
                    selectItem.setModel(model);
                    selectBox.add(selectItem);
                }
            };
            if (typeof data != undefined && typeof data != 0 && data != 0) {
                rpc.exec(exec, data);
            } else {
                rpc.exec(exec, "");
            }
            var selectItem = null;
            var model = null;
            var item;
            var v = new Array();
            if (typeof options != undefined && typeof options != 0 && options != 0) {
                for (v in options) {
                    item = options[v];
                    selectItem = new qxnw.widgets.listItem(item);
                    model = v;
                    selectItem.setModel(model);
                    selectBox.add(selectItem);
                }
            }
            if (typeof defaultValue != 'undefined' && defaultValue != 0) {
                var items = selectBox._getItems();
                var ia = 0;
                if (defaultValue == 'lastData') {
                    for (ia = 0; ia < items.length; ia++) {
                        if (ia + 1 == items.length) {
                            selectBox.setSelection([items[ia]]);
                        }
                    }
                } else {
                    for (ia = 0; ia < items.length; ia++) {
                        if (items[ia].getModel() == defaultValue) {
                            selectBox.setSelection([items[ia]]);
                        }
                    }
                }
            }
            return true;
        }
    }
});
