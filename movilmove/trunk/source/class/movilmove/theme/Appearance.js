/* ************************************************************************
 
 Copyright:
 
 License:
 
 Authors:
 
 ************************************************************************ */

qx.Theme.define("movilmove.theme.Appearance", {
    extend: qx.theme.modern.Appearance,
    appearances: {
        'token': 'combobox',
        'tokenitem': {
            include: 'listitem',
            style: function (states) {
                return {
                    decorator: 'group',
                    textColor: states.hovered ? 'blue' : states.head ? '#000000' : '#000000',
                    height: 18,
                    padding: [1, 6, 1, 6],
                    margin: 0
                            // icon: states.close ? "decoration/window/close-active.png" : "decoration/window/close-inactive.png"
                };
            }
        },
        'loading': {
            style: function (states) {
                return {};
            }
        },
        "menu-button":
                {
                    alias: "atom",
                    style: function (states) {
                        var decorator = states.selected ? "selected" : undefined;
                        if (decorator && qx.core.Environment.get("css.gradient.linear")) {
                            decorator += "-css";
                        }

                        return {
                            decorator: decorator,
                            textColor: states.selected ? "text-selected" : undefined,
                            padding: [4, 6]
                        };
                    }
                }
    }
});
