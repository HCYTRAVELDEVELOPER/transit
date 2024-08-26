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
 * Class only for static mode. A composition of util code who help you in entire your application
 */
qx.Class.define("qxnw.nw_admin_db.functions", {
    extend: qx.core.Object,
    statics: {
        processDescriptions: function processDescriptions(data) {
            var description = [];
            description[0] = {"name": data.widget};
            switch (data.method) {
                case "0":
                    description[1] = {"name": 0};
                    break;
                case "array":
                    description[1] = {"name": "array"};
                    break;
                case  "table":
                    description[1] = {"name": data.table};
                    break;
                case "class":
                    var clas = data.clase;
                    var clas = clas.split('.');
                    if (clas.length == 2) {
                        description[1] = {"name": data.clase};
                    } else {
                        qxnw.utils.information("Debe Ingresar la clase y el metodo");
                        return;
                    }
                    break;
            }

            description[2] = {"name": data.visible};
            description[3] = {"name": data.required};
            if (data.mode.length > 0) {
                description[4] = {"name": data.mode[0].id};
            } else {
                description[4] = {"name": 0};
            }
            if (qxnw.utils.evalue(data.label)) {
                description[5] = {"name": data.label};
            } else {
                description[5] = {"name": 0};
            }
            description[6] = {"name": data.filter};
            return qxnw.utils.getStringFromArrayList(description, "name");
        },
        processDescriptionsTables: function processDescriptionsTables(data) {
            var description = "[{";
            if (data.description_navTable.length > 0) {
                description += '"navTables": [';
            }
            var count_nav = data.description_navTable.length;
            var count_sel = data.description_selectBox.length;
            for (var i = 0; i < count_nav; i++) {
                description += "{";
                description += '"title":"' + data.description_navTable[i].tittle + '",';
                description += '"table":"' + data.description_navTable[i].table + '",';
                description += '"name":"' + data.description_navTable[i].navtable_name + '",';
                description += '"reference":"' + data.description_navTable[i].reference + '"';
                description += "}";
                if (i != parseInt(count_nav) - 1) {
                    description += ",";
                }
            }
            if (count_nav > 0) {
                description += ']';
            }
            if (count_sel > 0) {
                if (count_nav > 0) {
                    description += ',';
                }
            }
            if (count_sel > 0) {
                description += '"selectBoxArrays": [';
            }
            for (var i = 0; i < count_sel; i++) {
                description += "{";
                description += '"name":"' + data.description_selectBox[i].name + '",';
                description += '"data":{' + data.description_selectBox[i].data + '}';
                description += "}";
                if (i != parseInt(count_sel) - 1) {
                    description += ",";
                }
            }
            if (count_sel > 0) {
                description += ']';
            }
//            if (data.description_contex.length > 0) {
//                if (data.description_selectBox.length > 0) {
//                    description += ',';
//                } else if (data.description_navTable.length > 0) {
//                    description += ',';
//                }
//            }
//            if (data.description_contex.length > 0) {
//                description += '"contextMenu": [';
//            }
//            var count_sel = data.description_contex.length;
//            for (var i = 0; i < count_sel; i++) {
//                description += "{";
//                description += '"label":"' + data.description_contex[i].name + '",';
//                description += '"icon":"' + data.description_contex[i].icon + '",';
//                description += '"slot":"' + data.description_contex[i].slot + '",';
//                description += '"question":' + data.description_contex[i].quesion + ',';
//                description += '"questionAsk":"' + data.description_contex[i].quesion_ask + '"';
//                description += "}";
//                if (i != parseInt(count_sel) - 1) {
//                    description += ",";
//                }
//            }
//            if (data.description_contex.lengh > 0) {
//                description += ']';
//            }
//            description += ',"config": {"' + data.cleanhtml;
            description += "}]";
            return description;
        }
    }
});