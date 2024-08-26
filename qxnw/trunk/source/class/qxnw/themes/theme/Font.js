/* ************************************************************************

   Copyright:
     2010 Norbert Schröder

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php

   Authors:
     * Norbert Schröder (scro34)

************************************************************************ */

qx.Theme.define("qxnw.themes.theme.Font",
{
  fonts :
  {
    "default" :
    {
      size : ((qx.core.Environment.get("os.version") === "vista") || (qx.core.Environment.get("os.version") === "7")) ? 12 : 11,
      lineHeight : 1.4,
      family : (qx.core.Environment.get("os.name") === "mac") ? [ "Lucida Grande" ] :
        ((qx.core.Environment.get("os.version") === "vista") || (qx.core.Environment.get("os.version") === "7")) ?
        [ "Segoe UI", "Candara" ] :
		[ "Verdana", "Lucida Sans", "Tahoma", "Liberation Sans", "Arial", "sans-serif" ]
    },
    
    "bold":
    {
      size : ((qx.core.Environment.get("os.version") === "vista") || (qx.core.Environment.get("os.version") === "7")) ? 12 : 11,
      lineHeight : 1.4,
      family : (qx.core.Environment.get("os.name") === "mac") ? [ "Lucida Grande" ] :
        ((qx.core.Environment.get("os.version") === "vista") || (qx.core.Environment.get("os.version") === "7")) ?
        [ "Segoe UI", "Candara" ] :
		[ "Verdana", "Lucida Sans", "Tahoma", "Liberation Sans", "Arial", "sans-serif" ],
      bold: true
    },

    "small":
    {
      size : ((qx.core.Environment.get("os.version") === "vista") || (qx.core.Environment.get("os.version") === "7")) ? 11 : 10,
      lineHeight : 1.4,
      family : (qx.core.Environment.get("os.name") === "mac") ? [ "Lucida Grande" ] :
        ((qx.core.Environment.get("os.version") === "vista") || (qx.core.Environment.get("os.version") === "7")) ?
        [ "Segoe UI", "Candara" ] :
		[ "Verdana", "Lucida Sans", "Tahoma", "Liberation Sans", "Arial", "sans-serif" ]
    },

    "monospace":
    {
      size: 11,
      lineHeight: 1.4,
      family: (qx.core.Environment.get("os.name") === "mac") ? [ "Lucida Console", "Monaco" ] :
        ((qx.core.Environment.get("os.version") === "vista") || (qx.core.Environment.get("os.version") === "7")) ?
        [ "Consolas" ] :
        [ "Consolas", "DejaVu Sans Mono", "Courier New", "monospace" ]
    }
  }
});