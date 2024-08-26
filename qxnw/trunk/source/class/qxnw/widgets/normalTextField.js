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
 * Manage a special way to create a basic TextField
 */
qx.Class.define("qxnw.widgets.normalTextField", {
    extend: qx.ui.form.AbstractField,
    construct: function construct() {
        this.base(arguments);
        this.set({
            minHeight: 27
        });
    },
    /*
     *****************************************************************************
     PROPERTIES
     *****************************************************************************
     */

    properties: {
        // overridden
        appearance: {
            refine: true,
            init: "textfield"
        },
        // overridden
        allowGrowY: {
            refine: true,
            init: false
        },
        // overridden
        allowShrinkY: {
            refine: true,
            init: false
        }
    },
    members: {
        setData: function setData(val) {
            if (typeof val !== 'undefined' && val !== null && typeof val === "number") {
                val = val.toString();
            }
            this.setValue(val);
            return true;
        },
        setPlaceHolder: function setPlaceHolder(text) {
            this.setPlaceholder(text);
        },
        // overridden
        _renderContentElement: function (innerHeight, element) {
            if ((qx.core.Environment.get("engine.name") == "mshtml") &&
                    (parseInt(qx.core.Environment.get("engine.version"), 10) < 9
                            || qx.core.Environment.get("browser.documentmode") < 9))
            {
                element.setStyles({
                    "line-height": innerHeight + 'px'
                });
            }
        },
        // overridden
        _createContentElement: function () {
            var el = this.base(arguments);
            var deviceType = qx.core.Environment.get("device.type");
            if (deviceType == "tablet" || deviceType == "mobile") {
                el.addListener("keypress", this._onKeyPress, this);
            }

            return el;
        },
        /**
         * Close the virtual keyboard if the Enter key is pressed.
         * @param evt {qx.event.type.KeySequence} the keypress event.
         */
        _onKeyPress: function (evt) {
            // On return
            if (evt.getKeyIdentifier() == "Enter") {
                this.blur();
            }
        }
    },
    destruct: function () {
        this.getContentElement().removeListener("keypress", this._onKeyPress, this);
    }
});