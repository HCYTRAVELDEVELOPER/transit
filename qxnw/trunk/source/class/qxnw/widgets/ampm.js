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
qx.Class.define("qxnw.widgets.ampm", {
    extend: qx.ui.core.Widget,
    implement: [
        qx.ui.form.IForm
    ],
    include: [
        qx.ui.core.MContentPadding,
        qx.ui.form.MForm
    ],
    events: {
        "changeValue": "qx.event.type.Event"
    },
    /*
     *****************************************************************************
     CONSTRUCTOR
     *****************************************************************************
     */

    /**
     * @param min {Number} Minimum value
     * @param value {Number} Current value
     * @param max {Number} Maximum value
     */
    construct: function () {

        this.base(arguments);

        // MAIN LAYOUT
        var layout = new qx.ui.layout.Grid();
        layout.setColumnFlex(0, 1);
        layout.setRowFlex(0, 1);
        layout.setRowFlex(1, 1);
        this._setLayout(layout);

        // EVENTS
        this.addListener("keydown", this._onKeyDown, this);
        this.addListener("keyup", this._onKeyUp, this);

        // CREATE CONTROLS
        this._createChildControl("textfield");
        this._createChildControl("upbutton");
        this._createChildControl("downbutton");
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
            init: "spinner"
        },
        // overridden
        focusable: {
            refine: true,
            init: true
        },
        /** The amount to increment on each event (keypress or pointerdown) */
        singleStep: {
            check: "Number",
            init: 1
        },
        /** The amount to increment on each pageup/pagedown keypress */
        pageStep: {
            check: "Number",
            init: 10
        },
        // overridden
        allowShrinkY: {
            refine: true,
            init: false
        }
    },
    /*
     *****************************************************************************
     MEMBERS
     *****************************************************************************
     */

    members: {
        /** Saved last value in case invalid text is entered */
        __lastValidValue: null,
        /** Whether the page-up button has been pressed */
        __pageUpMode: false,
        /** Whether the page-down button has been pressed */
        __pageDownMode: false,
        /*
         ---------------------------------------------------------------------------
         WIDGET INTERNALS
         ---------------------------------------------------------------------------
         */

        // overridden
        _createChildControlImpl: function (id, hash) {
            var control;

            switch (id) {
                case "textfield":
                    control = new qx.ui.form.TextField();
                    control.addState("inner");
                    control.setWidth(40);
                    control.setEnabled(false);
                    control.setValue("AM");
                    control.setFocusable(false);
                    this._add(control, {column: 0, row: 0, rowSpan: 2});
                    break;

                case "upbutton":
                    control = new qx.ui.form.RepeatButton();
                    control.addState("inner");
                    //control.setFocusable(false);
                    control.addListener("execute", this._moveAMPM, this);
                    this._add(control, {column: 1, row: 0});
                    break;

                case "downbutton":
                    control = new qx.ui.form.RepeatButton();
                    control.addState("inner");
                    control.setFocusable(false);
                    control.addListener("execute", this._moveAMPM, this);
                    this._add(control, {column: 1, row: 1});
                    break;
            }

            return control || this.base(arguments, id);
        },
        _moveAMPM: function _moveAMPM(e) {
            var self = this;
            var textField = self.getChildControl("textfield");
            var val = textField.getValue();
            if (val == "AM") {
                textField.setValue("PM");
            } else {
                textField.setValue("AM");
            }
            self.fireEvent("changeValue", e);
        },
        // overridden
        /**
         * @lint ignoreReferenceField(_forwardStates)
         */
        _forwardStates: {
            focused: true,
            invalid: true
        },
        // overridden
        tabFocus: function () {
            var field = this.getChildControl("textfield");
            field.getFocusElement().focus();
            field.selectAllText();
        },
        // overridden
        _applyEnabled: function (value, old) {
            this.base(arguments, value, old);
            this._updateButtons();
        },
        /**
         * Check whether the value being applied is allowed.
         *
         * If you override this to change the allowed type, you will also
         * want to override {@link #_applyValue}, {@link #_applyMinimum},
         * {@link #_applyMaximum}, {@link #_countUp}, {@link #_countDown}, and
         * {@link #_onTextChange} methods as those cater specifically to numeric
         * values.
         *
         * @param value {var}
         *   The value being set
         * @return {Boolean}
         *   <i>true</i> if the value is allowed;
         *   <i>false> otherwise.
         */
        _checkValue: function (value) {
            return typeof value === "number" && value >= this.getMinimum() && value <= this.getMaximum();
        },
        getValue: function getValue() {
            return this.getChildControl("textfield").getValue();
        },
        setValue: function setValue(val) {
            var textField = this.getChildControl("textfield");
            textField.setValue(val);
        },
        /**
         * Checks the min and max values, disables / enables the
         * buttons and handles the wrap around.
         */
        _updateButtons: function () {
            var upButton = this.getChildControl("upbutton");
            var downButton = this.getChildControl("downbutton");

            if (!this.getEnabled()) {
                // If Spinner is disabled -> disable buttons
                upButton.setEnabled(false);
                downButton.setEnabled(false);
            } else {
                // If wraped -> always enable buttons
                upButton.setEnabled(true);
                downButton.setEnabled(true);
            }
        },
        /*
         ---------------------------------------------------------------------------
         KEY EVENT-HANDLING
         ---------------------------------------------------------------------------
         */

        /**
         * Callback for "keyDown" event.<br/>
         * Controls the interval mode ("single" or "page")
         * and the interval increase by detecting "Up"/"Down"
         * and "PageUp"/"PageDown" keys.<br/>
         * The corresponding button will be pressed.
         *
         * @param e {qx.event.type.KeySequence} keyDown event
         */
        _onKeyDown: function (e) {
            switch (e.getKeyIdentifier()) {
                case "PageUp":
                    // mark that the spinner is in page mode and process further
                    this.__pageUpMode = true;

                case "Up":
                    this.getChildControl("upbutton").press();
                    break;

                case "PageDown":
                    // mark that the spinner is in page mode and process further
                    this.__pageDownMode = true;

                case "Down":
                    this.getChildControl("downbutton").press();
                    break;

                default:
                    // Do not stop unused events
                    return;
            }

            e.stopPropagation();
            e.preventDefault();
        },
        /**
         * Callback for "keyUp" event.<br/>
         * Detecting "Up"/"Down" and "PageUp"/"PageDown" keys.<br/>
         * Releases the button and disabled the page mode, if necessary.
         *
         * @param e {qx.event.type.KeySequence} keyUp event
         */
        _onKeyUp: function (e) {
            switch (e.getKeyIdentifier()) {
                case "PageUp":
                    this.getChildControl("upbutton").release();
                    this.__pageUpMode = false;
                    break;

                case "Up":
                    this.getChildControl("upbutton").release();
                    break;

                case "PageDown":
                    this.getChildControl("downbutton").release();
                    this.__pageDownMode = false;
                    break;

                case "Down":
                    this.getChildControl("downbutton").release();
                    break;
            }
        }
    },
    destruct: function () {
    }
});