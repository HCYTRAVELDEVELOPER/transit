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

qx.Class.define("qxnw.arrayManager", {
    type: "singleton",
    extend: qx.core.Object,
    events: {
        used: "qx.event.type.Data",
        change: "qx.event.type.Data"
    },
    members: {
        __array: [],
        setArray: function setArray(key, arr) {
            var data = {};
            data["key"] = key;
            data["data"] = arr;
            this.__array.push(data);
        },
        getArray: function getArray(key) {
            for (var i = 0; i < this.__array.length; i++) {
                if (key == this.__array[i]["key"]) {
                    return this.__array[i]["data"];
                }
            }
            return null;
        }
    },
    statics: {
        setArray: function setArray(key, arr) {
            var self = this.getInstance();
            self.setArray(key, arr);
        },
        getArray: function getArray(key) {
            var self = this.getInstance();
            return self.getArray(key);
        }
    }
});
