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

qx.Class.define("qxnw.validator", {
    
    extend: qx.core.Object,
      
    construct: function(){
        var self = this;
        self.__manager = new qx.ui.form.validation.Manager();
    },
    
    members: { 
        __manager: null,
        __validations: null,
        setValidator: function(input, type) {
            var self = this;
            switch (type) {
                case "number":
                    self.__manager.add(input, qx.util.Validate.number());
                    break;
                case "email":
                    self.__manager.add(input, qx.util.Validate.email());
                    break;
                case "string":
                    self.__manager.add(input, qx.util.Validate.string());
                    break;
                case "url":
                    self.__manager.add(input, qx.util.Validate.url());
                    break;
                case "color":
                    self.__manager.add(input, qx.util.Validate.color());
                    break;                        
            }
        },
        exec: function() {
            var self = this;
            return self.__manager.validate();
        },
        getManager: function() {
            return this.__manager;
        }
    }
});