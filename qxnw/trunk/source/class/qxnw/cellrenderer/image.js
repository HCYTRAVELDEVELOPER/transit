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
qx.Class.define("qxnw.cellrenderer.image", {
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
    construct: function (width, height, phpthumb) {
        this.base(arguments);

        if (width) {
            this.__imageWidth = width;
        }

        if (height) {
            this.__imageHeight = height;
        }

        if (phpthumb) {
            this.__isphpthumb = phpthumb;
        }

        this.__am = qx.util.AliasManager.getInstance();

        this.__extensions = ["doc", "docx", "xls", "xlsx", "pdf", "ppp", "ppt"];
        this.__imageExtensions = ["word", "word", "excel", "excel", "pdf", "PowerPoint-icon", "PowerPoint-icon"];
    },
    /*
     *****************************************************************************
     MEMBERS
     *****************************************************************************
     */

    members: {
        __am: null,
        __imageHeight: 16,
        __imageWidth: 16,
        __isphpthumb: false,
        __extensions: [],
        __imageExtensions: [],
        // overridden
        _identifyImage: function (cellInfo) {
            var imageHints = {
                imageWidth: this.__imageWidth,
                imageHeight: this.__imageHeight
            };

            var val = "";

            if (typeof cellInfo.value != 'undefined') {
                val = cellInfo.value.trim();
            }

            var fileExt = "";

            if (typeof cellInfo.value != 'undefined') {
                if (typeof cellInfo.value == 'string') {
                    fileExt = cellInfo.value.split('.').pop();
                }
            }

            fileExt = fileExt.trim();

            var indexFinded = this.__extensions.indexOf(fileExt.toLowerCase());

            if (typeof cellInfo.value == 'undefined' || cellInfo.value == "") {
                imageHints.url = null;
            } else {
                if (this.__isphpthumb) {
                    if (indexFinded != -1) {
                        var icon = qxnw.config.execIcon(this.__imageExtensions[indexFinded], "qxnw", 32);
                        imageHints.url = encodeURI(this.__am.resolve(icon));
                    } else {
                        var phpThumbPath = qxnw.config.getPhpThumbPath().replace("%version%", qxnw.userPolicies.getNwlibVersion());
                        imageHints.url = encodeURI(phpThumbPath + this.__am.resolve(val) + "&w=100&q=" + qxnw.config.getPhpThumbQuality());
                    }
                } else {
                    if (indexFinded != -1) {
                        var icon = qxnw.config.execIcon(this.__imageExtensions[indexFinded], "qxnw", 32);
                        imageHints.url = encodeURI(this.__am.resolve(icon));
                    } else {
                        imageHints.url = encodeURI(this.__am.resolve(cellInfo.value));
                    }
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