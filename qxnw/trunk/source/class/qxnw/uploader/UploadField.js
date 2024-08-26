/* ************************************************************************
 
 qooxdoo - the new era of web development
 
 http://qooxdoo.org
 
 Copyright:
 2013 Netwoods.net, http://www.netwoods.net
 
 License:
 LGPL: http://www.gnu.org/licenses/lgpl.html
 EPL: http://www.eclipse.org/org/documents/epl-v10.php
 See the LICENSE file in the project's top-level directory for details.
 
 Authors:
 * Andrés Flórez (andresf)
 
 ************************************************************************ */

/* ************************************************************************
 
 ************************************************************************ */

/**
 * UploadField: A textfield which holds the filename of the file which
 * should be uploaded and a button which allows selecting the file via the native
 * file selector 
 *
 */
qx.Class.define("qxnw.uploader.UploadField", {
    extend: qx.ui.container.Composite,
    // --------------------------------------------------------------------------
    // [Constructor]
    // --------------------------------------------------------------------------

    construct: function (fieldName, label, icon) {
        this.base(arguments);

        this.setLayout(new qx.ui.layout.VBox().set({spacing: 2}));

        if (fieldName) {
            this.setFieldName(fieldName);
        }
//    this._textfield = new qx.ui.form.TextField();
//    this._textfield.setReadOnly(true);
//    this._textfield.setVisibility("hidden");

        this._button = new qxnw.uploader.UploadButton(this.getFieldName(), label, icon);
        this._button.addListener("changeFieldValue", this._onChangeFieldValue, this);

//    this.add(this._textfield, {flex: 1});
        this.add(this._button);

//        this._button.addListener("appear", function () {
//            var target = this.getContentElement().getDomElement();
//            qx.bom.element.Style.set(target, "overflow-y", "scroll");
//            qx.bom.element.Style.set(target, "overflow-x", "scroll");
//        });
    },
    // --------------------------------------------------------------------------
    // [Destructor]
    // --------------------------------------------------------------------------

    destruct: function () {
        this._disposeObjects("_button", "_textfield");
    },
    // --------------------------------------------------------------------------
    // [Properties]
    // --------------------------------------------------------------------------

    properties: {
        /**
         * The name which is assigned to the form
         */
        fieldName: {
            check: "String",
            init: "",
            apply: "_applyFieldName"
        },
        /**
         * The value which is assigned to the form
         */
        fieldValue: {
            check: "String",
            init: "",
            apply: "_applyFieldValue",
            event: "changeFieldValue"
        }
    },
    // --------------------------------------------------------------------------
    // [Members]
    // --------------------------------------------------------------------------

    members: {
        // ------------------------------------------------------------------------
        // [Instance Variables]
        // ------------------------------------------------------------------------

        _value: "",
        _dragAndDrop: false,
        // ------------------------------------------------------------------------
        // [Modifiers]
        // ------------------------------------------------------------------------
        focusOnButton: function focusOnButton() {
            this._button.getFocusElement().focus();
        },
        setDragAndDrop: function setDragAndDrop(val) {
            if (val == true) {
                if (window.File && window.FileList && window.FileReader) {
                    this._dragAndDrop = true;
                    this._button.setAppearance("widget");
                    this._button.setHeight(155);
                    this._button.setWidth(155);
                    this._button.setLabel("Selecciona un archivo o arrástralo aquí...");
                    this._button.setIconPosition("right");
                    var lbl = this._button.getChildControl("label");
                    lbl.setPaddingLeft(5);
                    var icon = this._button.getChildControl("icon");
                    icon.setPaddingRight(5);
                    qxnw.utils.addBorder(this._button, "black", 1);
                    this._button.addListener("mouseover", function () {
                        qxnw.utils.addBorder(this, "red", 2);
                    });
                    this._button.addListener("mouseout", function () {
                        qxnw.utils.addBorder(this, "black", 1);
                    });
                }
            } else {
                this._button.setLabel("Selecciona un archivo...");
                this._button.setIconPosition("left");
                this._button.setHeight(30);
                this._button.setWidth(155);
                var lbl = this._button.getChildControl("label");
                lbl.setPaddingLeft(0);
                var icon = this._button.getChildControl("icon");
                icon.setPaddingRight(0);
                qxnw.utils.removeBorders(this._button);
                this._button.setAppearance("button");
            }
        },
        /**
         * Value modifier. Sets the value of both the text field and
         * the UploadButton. The setValue modifier of UploadButton
         * throws an exception if the value is not an empty string.
         *
         * @param value {var} Current value
         * @param old {var} Previous value
         */
        _applyFieldValue: function (value, old) {
            this._button.setFieldValue(value);
            //this._textfield.setValue(value);
        },
        /**
         * Upload parameter value modifier. Sets the name attribute of the
         * the hidden input type=file element in UploadButton which should.
         * This name is the form submission parameter name.
         *
         * @param value {var} Current value
         * @param old {var} Previous value
         */
        _applyFieldName: function (value, old) {
            if (this._button)
                this._button.setFieldName(value);
        },
        // ------------------------------------------------------------------------
        // [Setters / Getters]
        // ------------------------------------------------------------------------

        /**
         * Returns component text field widget.
         */
        getTextField: function () {
            return this._textfield;
        },
        /**
         * Returns component button widget.
         */
        getButton: function () {
            return this._button;
        },
        // ------------------------------------------------------------------------
        // [Event Handlers]
        // ------------------------------------------------------------------------

        /**
         * If the user select a file by clicking the button, the value of
         * the input type=file tag of the UploadButton changes and
         * the text field is set with the value of the selected filename.
         *
         * @param e {Event} change value event data
         * @return {void}
         */
        _onChangeFieldValue: function (e) {
            var value = e.getData();
            //this._textfield.setValue(value);
            this.setFieldValue(value);
        }
    }
});