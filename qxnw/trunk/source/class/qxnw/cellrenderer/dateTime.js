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

/**
 * Specific data cell renderer for dates.
 */
qx.Class.define("qxnw.cellrenderer.dateTime", {
    extend: qx.ui.table.cellrenderer.Conditional,
    /*
     *****************************************************************************
     PROPERTIES
     *****************************************************************************
     */

    properties: {
        /**
         * DateFormat used to format the data.
         */
        dateFormat: {
            check: "qx.util.format.DateFormat",
            init: null,
            nullable: true
        }
    },
    /*
     *****************************************************************************
     MEMBERS
     *****************************************************************************
     */

    members: {
        _getContentHtml: function (cellInfo) {
//            var df = this.getDefaultDateFormatter();
            var lang = qxnw.local.getOpenData("lang");
            var df = new qx.util.format.DateFormat(qxnw.config.getDateTimeFormat(lang));
            if (df) {
                if (cellInfo.value) {
                    if (typeof cellInfo.value == "string") {
                        var d = qxnw.utils.createDateTimeFromString(cellInfo.value);
                        return qx.bom.String.escape(df.format(d));
                    } else {
                        return qx.bom.String.escape(df.format(cellInfo.value));
                    }
                } else {
                    return "";
                }
            } else {
                return cellInfo.value || "";
            }
        },
        getDefaultDateFormatter: function getDefaultDateFormatter() {
//            var dateTimeFormat = qx.locale.Date.getDateTimeFormat("medium");
            var lang = qxnw.local.getOpenData("lang");
            var dateTimeFormat = new qx.util.format.DateFormat(qxnw.config.getDateTimeFormat(lang));
            var format = null;
            if (typeof dateTimeFormat != 'undefined') {
                format = dateTimeFormat.toString();
            } else {
                format = dateTimeFormat;
            }
            if (format == this.__dateFormat) {
                return this.__formatter;
            }
            if (this.__formatter) {
                this.__formatter.dispose();
            }
//            this.__formatter = new qx.util.format.DateFormat(format, qx.locale.Manager.getInstance().getLocale());
            var format = new qx.util.format.DateFormat(qxnw.config.getDateTimeFormat(lang));
            this.__dateFormat = format;
            return this.__formatter;
        },
        // overridden
        _getCellClass: function (cellInfo) {
            return "qooxdoo-table-cell";
        }
    }
});