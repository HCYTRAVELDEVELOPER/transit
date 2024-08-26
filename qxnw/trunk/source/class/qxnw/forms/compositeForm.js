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
qx.Class.define("qxnw.forms.compositeForm", {
    extend: qx.ui.container.Composite,
    construct: function (layout) {
        this.base(arguments, layout || new qx.ui.layout.VBox());
    },
    members: {
        // overridden
        // Instead of creating a <div> for the content element, use <form>
        _createContentElement: function ()
        {
            return new qx.html.Element("form");
        }
    }
});