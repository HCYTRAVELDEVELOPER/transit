/* ************************************************************************
 
 Copyright:
 2013 Netwoods.net, http://www.netwoods.net
 
 License:
 LGPL: http://www.gnu.org/licenses/lgpl.html
 EPL: http://www.eclipse.org/org/documents/epl-v10.php
 See the LICENSE file in the project's top-level directory for details.
 
 Authors:
 Andrés Flórez
 
 ************************************************************************ */

qx.Class.define("qxnw.disposer", {
    type: "singleton",
    extend: qx.core.Object,
    members: {
        __nwarray: new Array()
    },
    statics: {
        /**
         * Function to dispose all class of objects
         * @param object {Object} the object to dispose
         * @return {Boolean} if the object was disposed or not
         */
        exec: function exec(object) {
            try {
                var childrenList = object.removeAll();
                for (var i = 0; i < childrenList.length; ++i) {
                    childrenList[i].dispose();
                }
            } catch (e) {
                qxnw.utils.error(e, object, 0, false);
            }
            //this._disposeObjects(object.classname.toString());
            return true;
        }
        /**
         * var childrenList = container.removeAll();
         for(var i=0; i<childrenList.length; ++i){
         childrenList[i].dispose();
         }
         this._disposeObjects("_buttonOk", "_buttonCancel");
         this._disposeArray("_children");
         this._disposeMap("_registry");
         */
    }
});