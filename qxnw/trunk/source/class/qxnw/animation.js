/* ************************************************************************
 
 Copyright:
 2012 Netwoods, http://www.netwoods.net
 
 License:
 LGPL: http://www.gnu.org/licenses/lgpl.html
 EPL: http://www.eclipse.org/org/documents/epl-v10.php
 See the LICENSE file in the project's top-level directory for details.
 
 Authors:
 * Andrés Flórez
 
 ************************************************************************ */

/**
 * Manage all the animations of qxnw objects
 */

qx.Class.define("qxnw.animation", {
    extend: qx.core.Object,
    construct: function construct() {
        this.base(arguments);
    },
    statics: {
        switchEffect: function switchEffect(effect) {
            var data = "";
            switch (effect) {
                case "dance":
                    var data = {duration: 500, keyFrames: {
                            0: {"left": "0px", "top": "0px"},
                            30: {"left": "-10px", "top": "-10px"},
                            60: {"left": "10px", "top": "-10px"},
                            80: {"left": "-10px", "top": "10px"},
                            100: {"left": "0px", "top": "0px"}
                        }};
                    break;
                case "width":
                    var data = {duration: 1000, timing: "ease-out", keyFrames: {
                            0: {},
                            70: {"width": "200px"},
                            100: {}
                        }};
                    ;
                    break;
                case "scale":
                    var data = {duration: 1000, origin: "bottom center", keyFrames: {
                            0: {"scale": [1, 1]},
                            100: {"scale": [3, 3]}
                        }
                    };
                    break;
                case "scale_out":
                    var data = {duration: 1000, origin: "bottom center", keyFrames: {
                            0: {"scale": [3, 3]},
                            100: {"scale": [1, 1]}
                        }
                    };
                    break;
                case "appear":
                    data = {duration: 500, keyFrames: {
                            0: {"left": "10%"},
                            15: {"left": "20%"},
                            30: {"left": "30%"},
                            45: {"left": "50%"},
                            60: {"left": "60%"},
                            75: {"left": "70%"},
                            90: {"left": "90%"},
                            100: {"left": "100%"}
                        }
                    };
                    break;
                case "shake":
                    data = {duration: 1000, keyFrames: {
                            0: {translate: "0px"},
                            10: {translate: "-10px"},
                            20: {translate: "10px"},
                            30: {translate: "-10px"},
                            40: {translate: "10px"},
                            50: {translate: "-10px"},
                            60: {translate: "10px"},
                            70: {translate: "-10px"},
                            80: {translate: "10px"},
                            90: {translate: "-10px"},
                            100: {translate: "0px"}
                        }};
                    break;
                case "rotateIn":
                    data = {duration: 500, origin: "right bottom", keyFrames: {
                            0: {opacity: 0, rotate: "90deg"},
                            100: {opacity: 1, rotate: "0deg"}
                        }};
                    break;
                case "rotateOut":
                    data = {
                        duration: 500,
                        origin: "left bottom",
                        keyFrames: {
                            0: {
                                opacity: 0,
                                rotate: "90deg"
                            },
                            100: {
                                opacity: 1,
                                rotate: "0deg"
                            }
                        }};
                    break;
                case "vertical":
                    data = {
                        duration: 500,
                        origin: "left bottom",
                        keyFrames: {
                            0: {
                                opacity: 0,
                                rotate: "90deg"
                            },
                            100: {
                                opacity: 1,
                                rotate: "90deg"
                            }
                        }};
                    break;
                case "disapear":
                    var data = {duration: 500, origin: "left bottom", keyFrames: {
                            0: {opacity: 1, rotate: "0deg"},
                            100: {opacity: 0, rotate: "90deg"}
                        }};
                    break;
            }
            return data;
        },
        startEffect: function startEffect(effect, widget) {
            var self = this;
            if (qx.core.Environment.get("css.animation") == null) {
                return;
            }
            var animation = self.switchEffect(effect);
            try {
                return qx.bom.element.Animation.animate(widget.getContentElement().getDomElement(), animation);
            } catch (e) {

            }
        },
        startEffectOnDiv: function startEffectOnDiv(effect, widget) {
            var self = this;
            var animation = self.switchEffect(effect);
            try {
                return qx.bom.element.Animation.animate(widget, animation);
            } catch (e) {

            }
        }
    }
});