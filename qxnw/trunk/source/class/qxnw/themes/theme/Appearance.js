/* ************************************************************************
 
 Copyright:
 2010 Norbert Schröder
 
 License:
 LGPL: http://www.gnu.org/licenses/lgpl.html
 EPL: http://www.eclipse.org/org/documents/epl-v10.php
 
 Authors:
 * Norbert Schröder (scro34)
 
 ************************************************************************ */

qx.Theme.define("qxnw.themes.theme.Appearance",
        {
            extend: qx.theme.modern.Appearance,
            appearances:
                    {
                        'token': 'combobox',
                        'tokenitem':
                                {
                                    include: 'listitem',
                                    style: function (states, styles)
                                    {
                                        return {
                                            decorator: 'group',
                                            textColor: states.hovered ? '#314a6e' : states.head ? '#07304d' : '#000000',
                                            backgroundColor: states.head ? '#4d94ff' : undefined,
                                            height: 18,
                                            padding: [1, 6, 1, 6],
                                            margin: 0,
                                            icon: states.hovered ? "decoration/window/close-active.png" : "decoration/window/close-inactive.png"
                                        };
                                    }
                                }
                    }
        });