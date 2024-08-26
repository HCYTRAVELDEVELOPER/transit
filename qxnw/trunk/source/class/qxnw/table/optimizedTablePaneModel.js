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

qx.Class.define("qxnw.table.optimizedTablePaneModel", {
    extend: qx.ui.table.pane.Model,
    construct: function (tableColumnModel) {
        this._fireModelChangedDebounced = qx.util.Function.debounce(this.fireEvent.bind(this, qx.ui.table.pane.Model.EVENT_TYPE_MODEL_CHANGED), 50);
        this.base(arguments, tableColumnModel);
    },
    members: {
        _fireModelChangedDebounced: null,
        /**
         * Event handler. Called when the visibility of a column has changed.
         *
         * @param evt {Map} the event.
         */
        _onColVisibilityChanged: function (evt) {
            // this function is not available in framework but we need it because we cannot access the private member
            // After updating qooxdoo it will be missing and has to be added to qx.ui.table.pane.Model like this:
            //_resetColumnCount: function() {
            //      this.__columnCount = null;
            //},
            this._resetColumnCount();

            this._fireModelChangedDebounced();
        },
        /**
         * Event handler. Called when the cell renderer of a column has changed.
         *
         * @param evt {Map} the event.
         */
        _onHeaderCellRendererChanged: function (evt) {
            this._fireModelChangedDebounced();
        }
    }
});