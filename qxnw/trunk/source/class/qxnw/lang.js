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
 * Manage the local 
 */
qx.Class.define("qxnw.lang", {
    extend: qx.core.Object,
    include: [qx.locale.MTranslation],
    statics: {
        process: function process(locale) {
            return locale.__txt;
        },
        translate: function translate(text, sender) {
            return text;
        }
    }
});