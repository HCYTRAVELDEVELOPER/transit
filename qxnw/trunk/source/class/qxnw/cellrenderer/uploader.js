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
/**
 * The image cell renderer renders image into table cells.
 */
qx.Class.define("qxnw.cellrenderer.uploader", {
    extend: qx.ui.table.cellrenderer.AbstractImage,
    /*
     *****************************************************************************
     CONSTRUCTOR
     *****************************************************************************
     */


    /**
     * @param height {Integer?16} The height of the image. The default is 16.
     * @param width {Integer?16} The width of the image. The default is 16.
     */
    construct: function (width, height) {
        this.base(arguments);

        if (width) {
            this.__imageWidth = width;
        }

        if (height) {
            this.__imageHeight = height;
        }

        this.__am = qx.util.AliasManager.getInstance();
    },
    /*
     *****************************************************************************
     MEMBERS
     *****************************************************************************
     */

    members: {
        __am: null,
        __imageHeight: 48,
        __imageWidth: 48,
        // overridden
        _identifyImage: function (cellInfo) {
            var imageHints = {
                imageWidth: this.__imageWidth,
                imageHeight: this.__imageHeight
            };

            var val = "";

            if (typeof cellInfo.value != 'undefined' && cellInfo.value != null) {
                val = cellInfo.value.trim();
            }

            var extensions = qxnw.config.getFilesExtensions();

            if (typeof cellInfo.value == 'undefined' || cellInfo.value == "" || cellInfo.value == null) {
                imageHints.url = qxnw.config.execIcon("upload", "qxnw", 32);
            } else {
                var ext = cellInfo.value.split('.').pop();
                if (extensions.indexOf(ext) != -1) {
                    var icon = qxnw.utils.getNWIconFromUrl(cellInfo.value);
                    imageHints.url = qxnw.config.execIcon(icon, "qxnw", 32);
                } else {
                    imageHints.imageWidth = 150;
                    imageHints.imageHeight = 160;
                    var phpThumbPath = qxnw.config.getPhpThumbPath().replace("%version%", qxnw.userPolicies.getNwlibVersion());
                    imageHints.url = phpThumbPath + this.__am.resolve(val) + "&w=200&q=" + qxnw.config.getPhpThumbQuality();
                }
            }

            imageHints.tooltip = cellInfo.tooltip;
            
            return imageHints;
        }
    },
    /*
     *****************************************************************************
     DESTRUCTOR
     *****************************************************************************
     */

    destruct: function () {
        this.__am = null;
    }
});