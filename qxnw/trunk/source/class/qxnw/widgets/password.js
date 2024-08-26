/* ************************************************************************
 
 Copyright:
 2015 Grupo NW S.A.S, http://www.gruponw.com
 
 License:
 LGPL: http://www.gnu.org/licenses/lgpl.html
 EPL: http://www.eclipse.org/org/documents/epl-v10.php
 See the LICENSE file in the project's top-level directory for details.
 
 Authors:
 * Andrés Flórez (andresf)
 * 
 * Class to test on andresf projects
 
 ************************************************************************ */

qx.Class.define("qxnw.widgets.password", {
    extend: qx.ui.form.TextField,
    members: {
        __mode: "password",
        setMode: function (mode) {
            this.__mode = mode;
            
        },
        // overridden
//        _createInputElement() {
   //alexf 7 jul 2022 (comment fix bug compile) and generate this start
        _createInputElement: function() {
   //alexf 7 jul 2022 (comment fix bug compile) and generate this end
            return new qx.html.Input("password");
        }
    }
});
