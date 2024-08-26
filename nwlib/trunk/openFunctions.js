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

var qxnw = {
    loading: "",
    disable: function(obj) {
        obj.disabled = true;
    },
    submitFormByName: function(name) {
        document.getElementById(name).submit();
    },
    changeVisibility: function(obj) {
        if (typeof obj.style != 'undefined') {
            obj.style.visibility = "hidden";
        }
    },
    changeVisibilityById: function(id) {
        document.getElementById(id).style.visibility = "hidden";
    },
    setLoadingId: function(loadingId) {
        this.loading = loadingId;
        this.changeVisibilityById(loadingId);
    },
    startLoading: function(id) {
        document.getElementById(this.loading).style.visibility = "visible";
    },
    stopLoading: function(id) {
        document.getElementById(this.loading).style.visibility = "excluded";
    }
};