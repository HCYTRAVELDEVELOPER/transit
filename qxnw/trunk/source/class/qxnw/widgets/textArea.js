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
qx.Class.define("qxnw.widgets.textArea", {
    extend: qx.ui.form.TextArea,
    construct: function (spellcheck) {
        this.base(arguments);
        var self = this;
//        self.set({
//            allowShrinkY: false
//        });
        self.setNativeContextMenu(true);
        if (typeof spellcheck == 'undefined' || spellcheck == true) {
            self.getContentElement().setAttribute("spellcheck", true);
        }
//        self.addListener("appear", function () {
//            qx.bom.element.Style.set(this.getContentElement().getDomElement(), "resize", "horizontal");
//            qx.bom.element.Style.set(this.getContentElement().getDomElement(), "resize", "vertical");
//            qx.bom.element.Style.set(this.getContentElement().getDomElement(), "wrap", "soft");
//        });

        self.setFilter(self._getFilterRegExp("special_characteres"));

        // Se encuentra un BUG que cambiaba la estructura del form gráfica
        self.addListener("keypress", function (e) {
            var evt = e.getKeyIdentifier();
            if (evt == "PageDown" || evt == "PageUp") {
                e.stopPropagation();
                e.stop();
            }
        });
        self.addListener("changeEnabled", function (e) {
            if (self.getExecuteChangeEnabled()) {
                var bool = e.getData();
                if (bool) {
                    this.setReadOnly(false);
                    this.setSelectable(true);
                    this.setFocusable(true);
                } else {
                    this.setReadOnly(true);
                    this.setSelectable(false);
                    this.setFocusable(true);
                }
            }
        });
    },
    properties: {
        executeChangeEnabled: {
            init: true,
            check: "Boolean"
        }
    },
    members: {
        _getFilterRegExp: function _getFilterRegExp(type) {
            var filterRegExp;
            switch (type) {
                case "money":
                    filterRegExp = /[0-9$.,]+/;
                    break;
                case "string" :
                    filterRegExp = /[\D ]+/;
                    break;
                case "numeric" :
                    //filterRegExp = /^\s*(\+|-)?((\d+(\.\d+)?)|(\.\d+))\s*$/;
                    filterRegExp = /[0-9.,]+/;
                    break;
                case "integer" :
                    filterRegExp = /[0-9]+/;
                    break;
                case "email" :
                    filterRegExp = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
                    break;
                case "lowerCase" :
                    filterRegExp = /[a-z]/g;
                    break;
                case "upperCase" :
                    filterRegExp = /[A-Z]/g;
                    break;
                case "special_characteres" :
                    filterRegExp = qxnw.userPolicies.getRegexSpecialCharacteres();
                    break;
            }
            return filterRegExp;
        }
    }
});