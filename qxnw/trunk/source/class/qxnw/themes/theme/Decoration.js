/* ************************************************************************

   Copyright:
     2010 Norbert Schröder

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php

   Authors:
     * Norbert Schröder (scro34)

************************************************************************ */

/* ************************************************************************

#asset(darktheme/decoration/*)

************************************************************************ */

qx.Theme.define("qxnw.themes.theme.Decoration",
{
  aliases: {
    decoration: "darktheme/decoration"
  },

  decorations:
  {
    /*
    ---------------------------------------------------------------------------
      APPLICATION
    ---------------------------------------------------------------------------
    */

    "app-header":
    {
      decorator: qx.ui.decoration.Decorator,

      style:
      {
        baseImage: "decoration/window/captionbar-active.png"
      }

    },
    
    /*
    ---------------------------------------------------------------------------
      CORE
    ---------------------------------------------------------------------------
    */
    "main" :
    {
      decorator: qx.ui.decoration.Uniform,

      style :
      {
        width : 1,
        color : "border-main"
      }
    },
    
    "selected":
    {
      decorator: qx.ui.decoration.Background,

      style:
      {
        backgroundColor: "background-selected"
      }
    },
    
    "keyboard-focus" :
    {
      decorator : qx.ui.decoration.Single,

      style :
      {
        width : 1,
        color : "black",
        style : "dotted"
      }
    },
    
    /*
    ---------------------------------------------------------------------------
      BUTTON
    ---------------------------------------------------------------------------
    */
    "button":
    {
      decorator: qx.ui.decoration.Decorator,
      
      style:
      {
        baseImage: "decoration/form/button.png",
        insets: [3, 3, 5, 3]
      }
    },
    
    "button-checked":
    {
      decorator: qx.ui.decoration.Decorator,
      
      style:
      {
        baseImage: "decoration/form/button-pressed.png",
        insets: [3, 3, 5, 3]
      }
    },
    
    "button-hovered":
    {
      decorator: qx.ui.decoration.Decorator,
      
      style:
      {
        baseImage: "decoration/form/button-hovered.png",
        insets: [3, 3, 5, 3]
      }
    },
    
    "button-red-checked":
    {
      decorator: qx.ui.decoration.Decorator,
      
      style:
      {
        baseImage: "decoration/form/button-red-pressed.png",
        insets: [3, 3, 5, 3]
      }
    },
    
    "button-red-hovered":
    {
      decorator: qx.ui.decoration.Decorator,
      
      style:
      {
        baseImage: "decoration/form/button-red-hovered.png",
        insets: [3, 3, 5, 3]
      }
    },
    
    "button-simple":
    {
      decorator: qx.ui.decoration.Decorator,
      
      style:
      {
        baseImage: "decoration/form/button-simple.png",
        insets: [0, 1, 0, 1]
      }
    },
    
    "button-simple-checked":
    {
      decorator: qx.ui.decoration.Decorator,
      
      style:
      {
        baseImage: "decoration/form/button-simple-pressed.png",
        insets: [1, 0, 0, 2]
      }
    },
    
    "button-simple-hovered":
    {
      decorator: qx.ui.decoration.Decorator,
      
      style:
      {
        baseImage: "decoration/form/button-simple-hovered.png",
        insets: [0, 1, 0, 1]
      }
    },
    
    "button-simple-disabled":
    {
      decorator: qx.ui.decoration.Decorator,
      
      style:
      {
        baseImage: "decoration/form/button-simple-disabled.png",
        insets: [0, 1, 0, 1]
      }
    },
    
    "splitbutton":
    {
      decorator: qx.ui.decoration.Decorator,
      
      style:
      {
        baseImage: "decoration/form/split-button.png",
        insets: [3, 3, 5, 3]
      }
    },
    
    "splitbutton-checked":
    {
      decorator: qx.ui.decoration.Decorator,
      
      style:
      {
        baseImage: "decoration/form/split-button-pressed.png",
        insets: [3, 3, 5, 3]
      }
    },
    
    "splitbutton-hovered":
    {
      decorator: qx.ui.decoration.Decorator,
      
      style:
      {
        baseImage: "decoration/form/split-button-hovered.png",
        insets: [3, 3, 5, 3]
      }
    },
    
    "splitbutton-right":
    {
      decorator: qx.ui.decoration.Decorator,
      
      style:
      {
        baseImage: "decoration/form/split-button-right.png",
        insets: [3, 3, 5, 3]
      }
    },
    
    "splitbutton-right-checked":
    {
      decorator: qx.ui.decoration.Decorator,
      
      style:
      {
        baseImage: "decoration/form/split-button-right-pressed.png",
        insets: [3, 3, 5, 3]
      }
    },
    
    "splitbutton-right-hovered":
    {
      decorator: qx.ui.decoration.Decorator,
      
      style:
      {
        baseImage: "decoration/form/split-button-right-hovered.png",
        insets: [3, 3, 5, 3]
      }
    },
    
    
    /*
    ---------------------------------------------------------------------------
      GROUPBOX
    ---------------------------------------------------------------------------
    */
    "group":
    {
      decorator: qx.ui.decoration.Decorator,
      
      style:
      {
        baseImage: "decoration/form/groupbox.png",
        insets: [1, 0, 1, 0]
      }
    },
    
    "group-focused":
    {
      decorator: qx.ui.decoration.Decorator,
      
      style:
      {
        baseImage: "decoration/form/groupbox-focused.png",
        insets: [1, 0, 1, 0]
      }
    },
    
    /*
    ---------------------------------------------------------------------------
      MENU
    ---------------------------------------------------------------------------
    */
    "menu" :
    {
      decorator: qx.ui.decoration.Decorator,
      
      style:
      {
        baseImage: "decoration/menu/menu-pane.png",
        insets: [3, 3, 5, 3]
      }
    },
    
    "menu-button-selected" :
    {
      decorator: qx.ui.decoration.Background,

      style:
      {
        backgroundImage: "decoration/menu/button-selected.png",
        backgroundRepeat: "scale"
      }
    },
    
    "menu-button-red" :
    {
      decorator: qx.ui.decoration.Background,

      style:
      {
        backgroundImage: "decoration/menu/button-red.png",
        backgroundRepeat: "scale"
      }
    },
    
    "menu-separator" :
    {
      decorator :  qx.ui.decoration.Single,

      style :
      {
        widthTop    : 1,
        colorTop    : "black",

        widthBottom : 1,
        colorBottom : "gray"
      }
    },
    
    /*
    ---------------------------------------------------------------------------
      MENUBAR
    ---------------------------------------------------------------------------
    */
    "menubar":
    {
      decorator: qx.ui.decoration.Background,

      style:
      {
        backgroundImage: "decoration/bar/background.png",
        backgroundRepeat: "scale"
      }
    },
    
    "menubar-selected":
    {
      decorator: qx.ui.decoration.Background,

      style:
      {
        backgroundImage: "decoration/bar/background-selected.png",
        backgroundRepeat: "scale"
      }
    },
    
    /*
    ---------------------------------------------------------------------------
      TEXT FIELD
    ---------------------------------------------------------------------------
    */

    "input" :
    {
      decorator: qx.ui.decoration.Decorator,
      
      style:
      {
        baseImage: "decoration/form/display.png",
        insets: [3, 3, 3, 3]
      }
    },
    
    "input-focused":
    {
      decorator: qx.ui.decoration.Decorator,
      
      style:
      {
        baseImage: "decoration/form/display-blue.png",
        insets: [3, 3, 3, 3]
      }
    },
    
    "input-disabled":
    {
      decorator: qx.ui.decoration.Decorator,
      
      style:
      {
        baseImage: "decoration/form/display-gray.png",
        insets: [3, 3, 3, 3]
      }
    },
    
    "input-error":
    {
      decorator: qx.ui.decoration.Decorator,
      
      style:
      {
        baseImage: "decoration/form/input-error.png",
        insets: [3, 3, 3, 3]
      }
    },
    
    "input-invalid":
    {
      decorator: qx.ui.decoration.Decorator,
      
      style:
      {
        baseImage: "decoration/form/input-invalid.png",
        insets: [3, 3, 3, 3]
      }
    },
    
    "input-focused-invalid":
    {
      decorator: qx.ui.decoration.Decorator,
      
      style:
      {
        baseImage: "decoration/form/input-error.png",
        insets: [3, 3, 3, 3]
      }
    },
    
    /*
    ---------------------------------------------------------------------------
      PANE
    ---------------------------------------------------------------------------
    */
    "pane" :
    {
      decorator : qx.ui.decoration.Decorator,

      style :
      {
        baseImage : "decoration/pane/pane.png",
        insets    : [0, 2, 3, 0]
      }
    },
    
    /*
    ---------------------------------------------------------------------------
      POPUP
    ---------------------------------------------------------------------------
    */
    "popup" :
    {
      decorator: qx.ui.decoration.Single,

      style:
      {
        width: 1,
        color: "black",
        style: "solid"
      }
    },
    
    /*
    ---------------------------------------------------------------------------
      PROGRESSBAR
    ---------------------------------------------------------------------------
    */

    "progressbar" :
    {
      decorator: qx.ui.decoration.Single,

      style:
      {
        width: 1,
        color: "border-input"
      }
    },
    
    /*
    ---------------------------------------------------------------------------
      PROGRESSIVE
    ---------------------------------------------------------------------------
    */

    "progressive-table-header" :
    {
       decorator : qx.ui.decoration.Single,

       style :
       {
         width       : 1,
         color       : "border-main",
         style       : "solid"
       }
    },
    
    /*
    ---------------------------------------------------------------------------
      SHADOWS
    ---------------------------------------------------------------------------
    */

    "shadow-window" :
    {
      decorator : qx.ui.decoration.Decorator,

      style : {
        baseImage : "decoration/shadow/shadow.png",
        // insets    : [ 3, 4, 4, 3 ]
        insets    : [ 4, 8, 8, 8 ]
      }
    },

    "shadow-popup" : 
    {
      decorator : qx.ui.decoration.Decorator,

      style : {
        baseImage : "decoration/shadow/shadow-small.png",
        insets    : [ 0, 3, 3, 0 ]
      }
    },
    
    /*
    ---------------------------------------------------------------------------
      SCROLLBAR
    ---------------------------------------------------------------------------
    */
    "scrollbar-horizontal" :
    {
      decorator : qx.ui.decoration.Background,

      style :
      {
        backgroundImage : "decoration/scrollbar/scrollbar-bg-horizontal.png",
        backgroundRepeat : "repeat-x"
      }
    },

    "scrollbar-vertical" :
    {
      decorator : qx.ui.decoration.Background,

      style :
      {
        backgroundImage : "decoration/scrollbar/scrollbar-bg-vertical.png",
        backgroundRepeat : "repeat-y"
      }
    },
    
    "scrollbar-slider-horizontal" :
    {
      decorator : qx.ui.decoration.Beveled,

      style : {
        backgroundImage : "decoration/scrollbar/scrollbar-slider-horizontal.png",
        backgroundRepeat : "scale",
        
        outerColor : "#525252",
        innerColor : "#929292",
        innerOpacity : 0.5
      }
    },
    
    "scrollbar-slider-horizontal-hovered" :
    {
      decorator : qx.ui.decoration.Beveled,

      style : {
        backgroundImage : "decoration/scrollbar/scrollbar-slider-horizontal-hovered.png",
        backgroundRepeat : "scale",
        
        outerColor : "#525252",
        innerColor : "#929292",
        innerOpacity : 0.5
      }
    },
    
    "scrollbar-slider-horizontal-disabled" :
    {
      decorator : qx.ui.decoration.Beveled,

      style : {
        backgroundImage : "decoration/scrollbar/scrollbar-button-bg-horizontal.png",
        backgroundRepeat : "scale",
        outerColor : "border-disabled",
        innerColor : "white",
        innerOpacity : 0.3
      }
    },
    
    "scrollbar-slider-vertical" :
    {
      decorator : qx.ui.decoration.Beveled,

      style : {
        backgroundImage : "decoration/scrollbar/scrollbar-slider-vertical.png",
        backgroundRepeat : "scale",
        
        outerColor : "#525252",
        innerColor : "#929292",
        innerOpacity : 0.5
      }
    },
    
    "scrollbar-slider-vertical-hovered" :
    {
      decorator : qx.ui.decoration.Beveled,

      style : {
        backgroundImage : "decoration/scrollbar/scrollbar-slider-vertical-hovered.png",
        backgroundRepeat : "scale",
        
        outerColor : "#525252",
        innerColor : "#929292",
        innerOpacity : 0.5
      }
    },
    
    "scrollbar-slider-vertical-disabled" :
    {
      decorator : qx.ui.decoration.Beveled,

      style : {
        backgroundImage : "decoration/scrollbar/scrollbar-button-bg-vertical.png",
        backgroundRepeat : "scale",
        outerColor : "border-disabled",
        innerColor : "white",
        innerOpacity : 0.3
      }
    },
    
    /*
    ---------------------------------------------------------------------------
      SEPARATOR
    ---------------------------------------------------------------------------
    */

    "separator-horizontal" :
    {
      decorator: qx.ui.decoration.Single,

      style :
      {
        widthLeft : 1,
        colorLeft : "border-separator"
      }
    },

    "separator-vertical" :
    {
      decorator: qx.ui.decoration.Single,

      style :
      {
        widthTop : 1,
        colorTop : "border-separator"
      }
    },
    
    /*
    ---------------------------------------------------------------------------
      SPLITPANE
    ---------------------------------------------------------------------------
    */

    "splitpane" :
    {
      decorator : qx.ui.decoration.Uniform,

      style :
      {
        backgroundColor : "background-pane",

        width : 1,
        color : "transparent",
        style : "solid"
      }
    },
    
    /*
    ---------------------------------------------------------------------------
      TABLE
    ---------------------------------------------------------------------------
    */
    "table" :
    {
      decorator : qx.ui.decoration.Single,

      style :
      {
        width : 1,
        color : "border-main",
        style : "solid"
      }
    },
    
    "table-header-cell":
    {
      decorator: qx.ui.decoration.Single,

      style:
      {
        backgroundImage: "decoration/bar/background.png",
        backgroundRepeat: "scale",
        
        widthRight : 1,
        colorRight: "#525252",
        styleRight : "solid"
      }
    },
    
    "table-header-cell-hovered" :
    {
      decorator :  qx.ui.decoration.Single,

      style :
      {
        widthRight : 1,
        colorRight : "border-separator",
        styleRight : "solid",

        widthBottom : 1,
        colorBottom : "white",
        styleBottom : "solid"
      }
    },
    
    "table-header-cell-selected":
    {
      decorator: qx.ui.decoration.Background,

      style:
      {
        backgroundImage: "decoration/bar/background-selected.png",
        backgroundRepeat: "scale"
      }
    },
    
    "table-column-button" :
    {
      decorator : qx.ui.decoration.Single,

      style :
      {
        backgroundImage  : "decoration/table/header-cell.png",
        backgroundRepeat : "scale",

        widthBottom : 1,
        colorBottom : "border-main",
        style       : "solid"
      }
    },
    
    "table-scroller-header":
    {
      decorator: qx.ui.decoration.Single,

      style:
      {
        backgroundImage: "decoration/bar/background.png",
        backgroundRepeat: "scale"
      }
    },
    
    "table-scroller-focus-indicator" :
    {
      decorator : qx.ui.decoration.Single,

      style :
      {
        width : 2,
        color : "table-focus-indicator",
        style : "solid"
      }
    },
    
    "table-statusbar":
    {
      decorator: qx.ui.decoration.Double,

      style:
      {
        backgroundColor: "background-window",
        
        widthTop: 1,
        colorTop: "#525252",
        style: "solid",
        
        innerWidthTop: 1,
        innerColorTop: "silver"
      }
    },
    
    /*
    ---------------------------------------------------------------------------
      TABVIEW
    ---------------------------------------------------------------------------
    */
    
    "tabview":
    {
      decorator: qx.ui.decoration.Single,

      style:
      {
        backgroundImage: "decoration/bar/background.png",
        backgroundRepeat: "scale"
      }
    },
    
    "tabview-pane" :
    {
      decorator : qx.ui.decoration.Decorator,

      style:
      {
        baseImage: "decoration/tabview/tabview-pane.png",
        insets: [3, 3, 3, 3]
      }
    },
    
    "tabview-button-top":
    {
      decorator: qx.ui.decoration.Decorator,
      
      style:
      {
        baseImage: "decoration/tabview/tabview-button-top.png"
      }
    },
    
    "tabview-button-top-disabled":
    {
      decorator: qx.ui.decoration.Decorator,
      
      style:
      {
        baseImage: "decoration/tabview/tabview-button-top-disabled.png"
      }
    },
    
    "tabview-button-top-hovered":
    {
      decorator: qx.ui.decoration.Decorator,
      
      style:
      {
        baseImage: "decoration/tabview/tabview-button-top-active.png"
      }
    },
    
    "tabview-button-bottom":
    {
      decorator: qx.ui.decoration.Decorator,
      
      style:
      {
        baseImage: "decoration/tabview/tabview-button-bottom.png",
        insets: [0, 1, 0, 1]
      }
    },
    
    "tabview-button-bottom-disabled":
    {
      decorator: qx.ui.decoration.Decorator,
      
      style:
      {
        baseImage: "decoration/tabview/tabview-button-bottom-disabled.png",
        insets: [0, 1, 0, 1]
      }
    },
    
    "tabview-button-bottom-hovered":
    {
      decorator: qx.ui.decoration.Decorator,
      
      style:
      {
        baseImage: "decoration/tabview/tabview-button-bottom-active.png",
        insets: [0, 1, 0, 1]
      }
    },
    
    "tabview-button-left":
    {
      decorator: qx.ui.decoration.Decorator,
      
      style:
      {
        baseImage: "decoration/tabview/tabview-button-left.png",
        insets: [0, 1, 0, 1]
      }
    },
    
    "tabview-button-left-disabled":
    {
      decorator: qx.ui.decoration.Decorator,
      
      style:
      {
        baseImage: "decoration/tabview/tabview-button-left-disabled.png",
        insets: [0, 1, 0, 1]
      }
    },
    
    "tabview-button-left-hovered":
    {
      decorator: qx.ui.decoration.Decorator,
      
      style:
      {
        baseImage: "decoration/tabview/tabview-button-left-active.png",
        insets: [0, 1, 0, 1]
      }
    },
    
    "tabview-button-right":
    {
      decorator: qx.ui.decoration.Decorator,
      
      style:
      {
        baseImage: "decoration/tabview/tabview-button-right.png",
        insets: [0, 1, 0, 1]
      }
    },
    
    "tabview-button-right-disabled":
    {
      decorator: qx.ui.decoration.Decorator,
      
      style:
      {
        baseImage: "decoration/tabview/tabview-button-right-disabled.png",
        insets: [0, 1, 0, 1]
      }
    },
    
    "tabview-button-right-hovered":
    {
      decorator: qx.ui.decoration.Decorator,
      
      style:
      {
        baseImage: "decoration/tabview/tabview-button-right-active.png",
        insets: [0, 1, 0, 1]
      }
    },
    
    /*
    ---------------------------------------------------------------------------
      TOOLBAR
    ---------------------------------------------------------------------------
    */
    
    "toolbar":
    {
      decorator: qx.ui.decoration.Background,

      style:
      {
        backgroundImage: "decoration/toolbar/toolbar-black.png",
        backgroundRepeat: "scale"
      }
    },
    
    "toolbar-blank" :
    {
      decorator: qx.ui.decoration.Single,

      style:
      {
        backgroundColor: "transparent",

        width: 1,
        color: "transparent",
        colorBottom: "border-separator",
        
        style: "solid"
      }
    },
    
    "toolbar-light":
    {
      decorator: qx.ui.decoration.Background,

      style:
      {
        backgroundImage: "decoration/bar/background.png",
        backgroundRepeat: "scale"
      }
    },
    
    "toolbar-separator":
    {
      decorator : qx.ui.decoration.Single,

      style :
      {
        widthLeft : 1,
        widthRight : 1,

        colorLeft: "#525252",
        colorRight: "silver",

        styleLeft : "solid",
        styleRight : "solid"
      }
    },
    
    "toolbar-button-checked":
    {
      decorator : qx.ui.decoration.Single,

      style :
      {
        backgroundImage: "decoration/form/button-hovered-c.png",
        backgroundRepeat : "scale",
        
        width: 1,

        colorTop: "#323232",
        colorLeft: "#323232",
        colorBottom: "#929292",
        colorRight: "#929292",

        style: "solid"
      }
    },
    
    "toolbar-button-hovered" :
    {
      decorator : qx.ui.decoration.Single,

      style :
      {
        backgroundImage: "decoration/form/button-hovered-c.png",
        backgroundRepeat : "scale"
      }
    },
    
    
    "toolbar-splitbutton-hovered":
    {
      decorator: qx.ui.decoration.Single,

      style:
      {
        backgroundImage: "decoration/form/button-hovered-c.png",
        backgroundRepeat: "scale",
        
        widthRight: 1,
        colorRight: "#525252",
        styleRight: "solid"
      }
    },
    
    "toolbar-splitbutton-arrow-hovered":
    {
      decorator: qx.ui.decoration.Single,

      style:
      {
        backgroundImage: "decoration/form/button-hovered-c.png",
        backgroundRepeat: "scale",
        
        widthLeft: 1,
        colorLeft: "silver",
        styleLeft: "solid"
      }
    },
    
    /*
    ---------------------------------------------------------------------------
      TOOLTIP
    ---------------------------------------------------------------------------
    */

    "tooltip" :
    {
      decorator : qx.ui.decoration.Decorator,

      style : {
        baseImage : "decoration/tooltip/tooltip.png",
        insets    : [ 2, 5, 5, 2 ]
      }
    },
    
    "tooltip-error" :
    {
      decorator : qx.ui.decoration.Decorator,

      style : {
        baseImage : "decoration/tooltip/tooltip-error.png",
        insets    : [ 2, 5, 5, 2 ]
      }
    },
    
    "tooltip-error-arrow" :
    {
      decorator: qx.ui.decoration.Background,

      style: {
        backgroundImage: "decoration/tooltip/tooltip-error-arrow.png",
        backgroundPositionY: "top",
        backgroundRepeat: "no-repeat",
        insets: [-4, 0, 0, 13]
      }
    },


    "tooltip-error-arrow-left" :
    {
      decorator: qx.ui.decoration.Background,

      style: {
        backgroundImage: "decoration/tooltip/tooltip-error-arrow-right.png",
        backgroundPositionY: "top",
        backgroundPositionX: "right",
        backgroundRepeat: "no-repeat",
        insets: [-4, -13, 0, 0]
      }
    },
    
    /*
    ---------------------------------------------------------------------------
      VIRTUAL WIDGETS
    ---------------------------------------------------------------------------
    */

    "group-item" :
    {
      decorator : qx.ui.decoration.Background,

      style :
      {
        backgroundImage  : "decoration/group-item.png",
        backgroundRepeat : "scale"
      }
    },
    
    /*
    ---------------------------------------------------------------------------
      WINDOW
    ---------------------------------------------------------------------------
    */
    "window":
    {
      decorator: qx.ui.decoration.Decorator,

      style:
      {
        baseImage: "decoration/window/window-pane.png"
      }
    },
    
    "window-captionbar-active":
    {
      decorator: qx.ui.decoration.Decorator,

      style:
      {
        baseImage: "decoration/window/captionbar-active.png"
      }
    },
    
    "window-captionbar-inactive":
    {
      decorator: qx.ui.decoration.Decorator,

      style:
      {
        baseImage: "decoration/window/captionbar-inactive.png"
      }
    },
    
    "window-statusbar" :
    {
      decorator : qx.ui.decoration.Decorator,

      style : {
        baseImage : "decoration/window/statusbar.png"
      }
    }
    
  }
});