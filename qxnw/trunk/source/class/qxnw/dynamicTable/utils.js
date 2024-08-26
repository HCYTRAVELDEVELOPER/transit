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
qx.Class.define("qxnw.dynamicTable.utils", {
    extend: qx.core.Object,
    include: [qx.locale.MTranslation],
    statics: {
        processDynamicTable: function processDynamicTable() {
            var self = this;

            var cols = [
                {
                    name: "label",
                    caption: "label",
                    label: self.tr("Rótulos de fila"),
                    type: "html",
                    sortable: false
                }
            ];

            self.getCols(cols);

            self.__colsSubList = cols;

            if (self.valoresList == null) {
                return;
            }

            var valChildren = self.valoresList.getChildren();

//            self.tableParent.table.getTableModel().sortByColumn(0, true);

            self.tableRecords = self.tableParent.getAllRecords();

            var lastType = "COUNT";
            var lastCaption = "";
            var lastTypeColumn = "";

            for (var za = 0; za < valChildren.length; za++) {
                var zmod = valChildren[za].getModel();
                var zz = [];
                zz["name"] = zmod["columnId"];
                zz["caption"] = zmod["columnId"];
                zz["columnId"] = zmod["columnId"];
                zz["model"] = zmod["label"];
                zz["id"] = za;
                if (cols.length > 1) {
                    zz["noEnter"] = true;
                }
                if (zmod["typeColumn"] == "money" || zmod["typeColumn"] == "dateField") {
                    zz["type"] = zmod["typeColumn"];
                }
                if (valChildren[za].getUserData("type") == "SUM") {
                    zz["label"] = "Suma de " + zmod["model"];
                    zz["typeColumn"] = "SUM";
                } else if (valChildren[za].getUserData("type") == "COUNT") {
                    zz["label"] = "Cuenta de " + zmod["model"];
                    zz["typeColumn"] = "COUNT";
                    zz["type"] = "";
                } else if (valChildren[za].getUserData("type") == "ABSO") {
                    zz["label"] = "Valor absoluto de " + zmod["model"];
                    zz["typeColumn"] = "ABSO";
                } else if (valChildren[za].getUserData("type") == "PROM") {
                    zz["label"] = "Promedio de " + zmod["model"];
                    zz["typeColumn"] = "PROM";
                    zz["type"] = "";
                } else if (valChildren[za].getUserData("type") == "PERCEN") {
                    zz["label"] = "Porcentaje de " + zmod["model"];
                    zz["typeColumn"] = "PERCEN";
                    zz["type"] = "";
                    zz["typeAlter"] = "percent";
                }
                cols.push(zz);
                lastType = zz["typeColumn"];
                lastCaption = zz["columnId"];
                lastTypeColumn = typeof zz["typeAlter"] != 'undefined' ? zz["typeAlter"] : zz["type"];
                if (typeof zz["typeAlter"] != '') {
                    delete zz["typeAlter"];
                }
            }

            for (var za = 0; za < cols.length; za++) {
                if (typeof cols[za].metaColumn != 'undefined') {
                    cols[za].typeColumn = lastType;
                    cols[za].valCaption = lastCaption;
                    cols[za].type = lastTypeColumn;
                }
            }

            self.subList.setColumns(cols);

            for (var izz = 0; izz < cols.length; izz++) {
                self.subList.table.setColumnWidth(izz, 200);
            }

            var filaRotulos = self.filaRotulosList.getChildren();
            if (typeof filaRotulos[0] == 'undefined') {
                return;
            }

            var finalArray = [];
            var newArray = [];
            var saveSearch = [];
            var alterArray = [];

            var qxdata = new qx.data.Array();

            var oldRotulo = null;
            var record = null;
            var oldValue = null;

            cols.shift();

            for (var ia = 0; ia < filaRotulos.length; ia++) {

                newArray = [];

                var rotulo = filaRotulos[ia].getModel()["columnId"];

                var sort = filaRotulos[ia].getModel()["id"];

                if (ia == 0) {
                    //TODO: cambiar a ordenamiento del array y no de la tabla IMPORTANTE!!!
                    self.tableParent.table.getTableModel().sortByColumn(parseInt(sort), true);
                    self.tableRecords = self.tableParent.getAllRecords();
                }

                var countHaveIn = 0;
                var countHaveInDeep = 0;
                for (var i = 0; i < self.tableRecords.length; i++) {

                    record = self.tableRecords[i];

                    if (ia == 0) {
                        if (saveSearch.indexOf(self.tableRecords[i][rotulo]) == -1) {
                            saveSearch.push(self.tableRecords[i][rotulo]);
                            var d = [];
                            d["fila"] = self.tableRecords[i][rotulo];
                            d["label"] = self.tableRecords[i][rotulo];
                            d["row"] = self.tableRecords[i];
                            d["level"] = ia;
                            d["key"] = rotulo;
                            finalArray.push(d);
                            newArray.push(d);
                            qxdata.push(d);
                        }

                        for (var za = 0; za < cols.length; za++) {
                            var tt = cols[za];
                            var type = cols[za].typeColumn;

                            if (typeof d[tt["columnId"]] == 'undefined') {
                                d[tt["columnId"]] = 0;
                            }

                            if (typeof cols[za].metaColumn != 'undefined') {
                                if (type == "COUNT") {
                                    if (self.tableRecords[i][tt["key"]] == tt["label"]) {
                                        d[tt["columnId"]] = d[tt["columnId"]] + 1;
                                    }
                                } else if (type == "SUM") {
                                    if (isNaN(d[tt["columnId"]]) || d[tt["columnId"]] == "") {
                                        d[tt["columnId"]] = 0;
                                    }
                                    if (isNaN(self.tableRecords[i][tt["valCaption"]]) || self.tableRecords[i][tt["valCaption"]] == "") {
                                        self.tableRecords[i][tt["valCaption"]] = 0;
                                    }
                                    if (self.tableRecords[i][tt["key"]] == tt["label"]) {
                                        d[tt["columnId"]] = parseFloat(d[tt["columnId"]]) + parseFloat(self.tableRecords[i][tt["valCaption"]]);
                                    }
                                } else if (type == "PERCEN") {
                                    if (isNaN(d[tt["columnId"]]) || d[tt["columnId"]] == "") {
                                        d[tt["columnId"]] = 0;
                                    }
                                    if (isNaN(self.tableRecords[i][tt["valCaption"]]) || self.tableRecords[i][tt["valCaption"]] == "") {
                                        self.tableRecords[i][tt["valCaption"]] = 0;
                                    }
                                    if (self.tableRecords[i][tt["key"]] == tt["label"]) {
                                        d[tt["columnId"]] = parseFloat(d[tt["columnId"]]) + parseFloat(self.tableRecords[i][tt["valCaption"]]);
                                    }
                                } else if (type == "ABSO") {
                                    if (self.tableRecords[i][tt["key"]] == tt["label"]) {
                                        d[tt["columnId"]] = self.tableRecords[i][tt["valCaption"]].toString();
                                    }
                                } else if (type == "PROM") {
                                    if (oldValue == null) {
                                        oldValue = self.tableRecords[i][rotulo];
                                    }
                                    if (oldValue != self.tableRecords[i][rotulo]) {
                                        countHaveIn = 1;
                                    } else {
                                        countHaveIn++;
                                    }
                                    //INTENTO DE ELIMINAR LOS NAN: POR VERIFICAR FUNCIONALIDAD
                                    d[tt["columnId"] + "_counter"] = countHaveIn;
                                    if (isNaN(d[tt["columnId"]]) || d[tt["columnId"]] == "") {
                                        d[tt["columnId"]] = 0;
                                    }
                                    if (isNaN(self.tableRecords[i][tt["valCaption"]]) || self.tableRecords[i][tt["columnId"]] == "") {
                                        self.tableRecords[i][tt["valCaption"]] = 0;
                                    }
                                    d[tt["columnId"]] = parseFloat(d[tt["columnId"]]) + parseFloat(self.tableRecords[i][tt["valCaption"]]);
                                    oldValue = self.tableRecords[i][rotulo];
                                }
                            } else {
                                if (type == "COUNT") {
                                    d[tt["columnId"]] = d[tt["columnId"]] + 1;
                                } else if (type == "SUM") {
                                    //INTENTO DE ELIMINAR LOS NAN: POR VERIFICAR FUNCIONALIDAD
                                    if (isNaN(d[tt["columnId"]]) || d[tt["columnId"]] == "") {
                                        d[tt["columnId"]] = 0;
                                    }
                                    if (isNaN(self.tableRecords[i][tt["columnId"]]) || self.tableRecords[i][tt["columnId"]] == "") {
                                        self.tableRecords[i][tt["columnId"]] = 0;
                                    }
                                    d[tt["columnId"]] = parseFloat(d[tt["columnId"]]) + parseFloat(self.tableRecords[i][tt["columnId"]]);
                                } else if (type == "PERCEN") {
                                    //INTENTO DE ELIMINAR LOS NAN: POR VERIFICAR FUNCIONALIDAD
                                    if (isNaN(d[tt["columnId"]]) || d[tt["columnId"]] == "") {
                                        d[tt["columnId"]] = 0;
                                    }
                                    if (isNaN(self.tableRecords[i][tt["columnId"]]) || self.tableRecords[i][tt["columnId"]] == "") {
                                        self.tableRecords[i][tt["columnId"]] = 0;
                                    }
                                    d[tt["columnId"]] = parseFloat(d[tt["columnId"]]) + parseFloat(self.tableRecords[i][tt["columnId"]]);
                                } else if (type == "ABSO") {
                                    d[tt["columnId"]] = self.tableRecords[i][tt["columnId"]].toString();
                                } else if (type == "PROM") {
                                    if (oldValue == null) {
                                        oldValue = self.tableRecords[i][rotulo];
                                    }
                                    if (oldValue != self.tableRecords[i][rotulo]) {
                                        countHaveIn = 1;
                                    } else {
                                        countHaveIn++;
                                    }
                                    //INTENTO DE ELIMINAR LOS NAN: POR VERIFICAR FUNCIONALIDAD
                                    d[tt["columnId"] + "_counter"] = countHaveIn;
                                    if (isNaN(d[tt["columnId"]]) || d[tt["columnId"]] == "") {
                                        d[tt["columnId"]] = 0;
                                    }
                                    if (isNaN(self.tableRecords[i][tt["columnId"]]) || self.tableRecords[i][tt["columnId"]] == "") {
                                        self.tableRecords[i][tt["columnId"]] = 0;
                                    }
                                    d[tt["columnId"]] = parseFloat(d[tt["columnId"]]) + parseFloat(self.tableRecords[i][tt["columnId"]]);
                                    oldValue = self.tableRecords[i][rotulo];
                                }
                            }
                        }
                    } else {
                        var lastItem = null;
                        var oldKey = "";
                        for (var il = 0; il < qxdata.length; il++) {
                            var item = qxdata.getItem(il);
                            var sumItem = 0;
                            oldKey = "";
                            var haveIn = false;
                            if (item["level"] == (ia - 1)) {
                                for (var rr = ia; rr > 0; rr--) {
                                    var inde = il - sumItem;
                                    if (inde < 0) {
                                        inde = 0;
                                    }
                                    var lastItem = qxdata.getItem(inde);
                                    while (lastItem["level"] == item["level"] && rr != ia) {
                                        lastItem = qxdata.getItem(inde - sumItem);
                                        sumItem++;
                                    }
                                    if (lastItem["level"] < ia) {
                                        if (record[lastItem["key"]] == lastItem["fila"] && lastItem["fila"] != record[rotulo]) {
                                            oldKey = oldKey + lastItem["fila"] + record[rotulo];
                                            haveIn = true;
                                        } else {
                                            haveIn = false;
                                            break;
                                        }
                                    } else {
                                        break;
                                    }
                                    sumItem++;
                                }
                            }
                            if (haveIn) {
                                var d = [];
                                if (saveSearch.indexOf(oldKey) == -1) {
                                    saveSearch.push(oldKey);
                                    d["fila"] = record[rotulo];
                                    d["label"] = new Array(ia + 1).join("&nbsp;&nbsp;&nbsp;&nbsp;") + record[rotulo];
                                    d["row"] = record;
                                    d["level"] = ia;
                                    d["parent"] = oldRotulo;
                                    d["key"] = rotulo;
                                    d["oldkey"] = oldKey;
                                    finalArray.push(d);
                                    newArray.push(d);
                                    qxdata.insertAfter(item, d);
                                }
                                for (var za = 0; za < cols.length; za++) {
                                    var tt = cols[za];
                                    var type = cols[za].typeColumn;

                                    if (typeof alterArray[oldKey] == 'undefined') {
                                        alterArray[oldKey] = [];
                                    }
                                    if (typeof alterArray[oldKey][tt["columnId"]] == 'undefined') {
                                        alterArray[oldKey][tt["columnId"]] = 0;
                                    }
                                    if (typeof alterArray[oldKey][record[rotulo]] == 'undefined') {
                                        alterArray[oldKey][rotulo] = record[rotulo];
                                    }

                                    if (typeof cols[za].metaColumn != 'undefined') {
                                        if (type == "COUNT") {
                                            if (record[tt["key"]] == tt["label"]) {
                                                alterArray[oldKey][tt["columnId"]] = parseFloat(alterArray[oldKey][tt["columnId"]]) + 1;
                                            }
                                        } else if (type == "SUM") {
                                            if (record[tt["key"]] == tt["label"]) {
                                                alterArray[oldKey][tt["columnId"]] = parseFloat(alterArray[oldKey][tt["columnId"]]) + parseFloat(record[tt["valCaption"]]);
                                            }
                                        } else if (type == "ABSO") {
                                            alterArray[oldKey][tt["columnId"]] = "";
                                        } else if (type == "PROM") {
                                            if (oldValue == null) {
                                                oldValue = self.tableRecords[i][rotulo];
                                            }
                                            if (oldValue != self.tableRecords[i][rotulo]) {
                                                countHaveInDeep = 1;
                                            } else {
                                                countHaveInDeep++;
                                            }
                                            if (record[tt["key"]] == tt["label"]) {
                                                d[tt["columnId"] + "_counter"] = countHaveInDeep;
                                                alterArray[oldKey][tt["columnId"]] = (parseFloat(alterArray[oldKey][tt["columnId"]]) + parseFloat(record[tt["valCaption"]]) / countHaveIn);
                                                oldValue = self.tableRecords[i][rotulo];
                                            }
                                        }
                                    } else {
                                        if (type == "COUNT") {
                                            alterArray[oldKey][tt["columnId"]] = parseFloat(alterArray[oldKey][tt["columnId"]]) + 1;
                                        } else if (type == "SUM") {
                                            alterArray[oldKey][tt["columnId"]] = parseFloat(alterArray[oldKey][tt["columnId"]]) + parseFloat(record[tt["columnId"]]);
                                        } else if (type == "ABSO") {
                                            alterArray[oldKey][tt["columnId"]] = "";
                                        } else if (type == "PROM") {
                                            if (oldValue == null) {
                                                oldValue = self.tableRecords[i][rotulo];
                                            }
                                            if (oldValue != self.tableRecords[i][rotulo]) {
                                                countHaveInDeep = 1;
                                            } else {
                                                countHaveInDeep++;
                                            }
                                            d[tt["columnId"] + "_counter"] = countHaveInDeep;
                                            alterArray[oldKey][tt["columnId"]] = (parseFloat(alterArray[oldKey][tt["columnId"]]) + parseFloat(record[tt["columnId"]]) / countHaveIn);
                                            oldValue = self.tableRecords[i][rotulo];
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }

            finalArray = qxdata.toArray();
            var totalValue = {};

            //RECORRIDO VALORES
            for (var za = 0; za < cols.length; za++) {

                var tt = cols[za];
                var type = cols[za].typeColumn;

                for (var i = 0; i < finalArray.length; i++) {

                    if (finalArray[i]["level"] == 0) {
                        if (typeof totalValue[tt["columnId"]] == 'undefined') {
                            totalValue[tt["columnId"]] = 0;
                        }
                        if (type == "PROM") {
                            totalValue[tt["columnId"]] = totalValue[tt["columnId"]] + finalArray[i][tt["columnId"]];
                            finalArray[i][tt["columnId"]] = parseFloat(finalArray[i][tt["columnId"]]) / finalArray[i][tt["columnId"] + "_counter"];
                        } else if (type == "PERCEN") {
                            //totalValue[tt["columnId"]] = totalValue[tt["columnId"]] + finalArray[i][tt["columnId"]];
                            if (finalArray[i][tt["columnId"]] > 0) {
                                totalValue[tt["columnId"]] = totalValue[tt["columnId"]] + finalArray[i][tt["columnId"]];
                                if (typeof tt.model == 'undefined') {
                                    continue;
                                }
                                finalArray[i][tt["columnId"]] = finalArray[i][tt["columnId"]] / finalArray[i][tt["valCaption"]] * 100;
                            }
                        } else if (type == "ABSO") {
                            totalValue[tt["columnId"]] = "";
                        } else {
                            totalValue[tt["columnId"]] = totalValue[tt["columnId"]] + finalArray[i][tt["columnId"]];
                        }
                    } else {
                        for (var di in alterArray) {
                            if (di == finalArray[i]["oldkey"]) {
                                if (type == "PROM") {
                                    finalArray[i][tt["columnId"]] = alterArray[di][tt["columnId"] + "_counter"];
                                } else if (type == "PERCEN") {
                                    finalArray[i][tt["columnId"]] = alterArray[di][tt["columnId"] + "_counter"];
                                } else {
                                    finalArray[i][tt["columnId"]] = alterArray[di][tt["columnId"]];
                                }
                            }
                        }
                    }
                }
            }

            var total = [];
            total["fila"] = "<b>Total General</b>";
            total["label"] = "<b>Total General</b>";
            for (var za = 0; za < cols.length; za++) {
                tt = cols[za];
                var type = cols[za].typeColumn;
                if (type == "PROM") {
                    total[tt["columnId"]] = totalValue[tt["columnId"]] / self.tableRecords.length;
                } else if (type == "PERCEN") {
                    total[tt["columnId"]] = totalValue[tt["columnId"]];
                    if (typeof tt.model == 'undefined') {
                        continue;
                    }
                    total[tt["columnId"]] = total[tt["columnId"]] / totalValue[tt["valCaption"]] * 100;
                } else {
                    total[tt["columnId"]] = totalValue[tt["columnId"]];
                }
            }

            self.graphicInterface.startGraphic(self, finalArray, "bars", cols);

            finalArray.push(total);

            self.subList.onlyPopulate(finalArray);

//            self.subList.table.getTableColumnModel().addListener("sorted", function () {
//                console.log("sort!!");
//            });

            self.subList.populateTotalColumns();
        }
    }
});