/* ************************************************************************
 
 Copyright:
 
 License:
 
 Authors:
 
 ************************************************************************ */

qx.Theme.define("movilmove.theme.Decoration",
        {
            extend: qx.theme.modern.Decoration,
            decorations: {
                "table": {
                    decorator: [
                        qx.ui.decoration.MSingleBorder,
                        qx.ui.decoration.MBoxShadow
                    ],
                    style: {
                        width: 1,
                        color: "#000000",
                        shadowBlurRadius: 5,
                        shadowLength: 4,
                        shadowColor: "table-shadow"
                    }
                },
                "selected": {
                    decorator: qx.ui.decoration.Decorator,
                    style: {
                        startColorPosition: 0,
                        endColorPosition: 100,
                        startColor: "#be1d2c",
                        endColor: "#be1d2c"
                    }
                },
                "selected-css": {
                    decorator: [qx.ui.decoration.MLinearBackgroundGradient],
                    style: {
                        startColorPosition: 0,
                        endColorPosition: 100,
                        startColor: "#be1d2c",
                        endColor: "#be1d2c"
                    }
                }
            }
        });