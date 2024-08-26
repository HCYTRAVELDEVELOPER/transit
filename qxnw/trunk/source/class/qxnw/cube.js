qx.Class.define("qxnw.cube", {
    extend: qx.core.Object,
    include: [qx.locale.MTranslation],
    members: {
        generateDynamicTable: function generateDynamicTable(valChildren, filaRotulos, filaColumnas, tableRecords) {
            var self = this;

            self.tableRecords = tableRecords;

            var cols = [
                {
                    name: "label",
                    caption: "label",
                    label: self.tr("Rótulos de fila"),
                    type: "html",
                    sortable: true
                }
            ];

            cols.push();

            self.getCols(cols, filaColumnas);

            self.__colsSubList = cols;

            if (typeof valChildren === 'undefined' || typeof valChildren[0] === 'undefined') {
                return;
            }

            var lastType = "COUNT";
            var lastCaption = "";
            var lastTypeColumn = "";

            for (var za = 0; za < valChildren.length; za++) {
                var zmod = valChildren[za];
                var zz = [];
                zz["name"] = zmod["columnId"];
                zz["caption"] = zmod["columnId"];
                zz["columnId"] = zmod["columnId"];
                zz["model"] = zmod["label"];
                zz["id"] = za;
                if (cols.length > 1) {
                    zz["noEnter"] = true;
                }
                if (zmod["typeColumn"] === "money" || zmod["typeColumn"] === "dateField") {
                    zz["type"] = zmod["typeColumn"];
                }
                if (zmod["type"] === "SUM") {
                    zz["label"] = "Suma de " + zmod["model"];
                    zz["typeColumn"] = "SUM";
                } else if (zmod["type"] === "COUNT") {
                    zz["label"] = "Cuenta de " + zmod["model"];
                    zz["typeColumn"] = "COUNT";
                    zz["type"] = "";
                } else if (zmod["type"] === "ABSO") {
                    zz["label"] = "Valor absoluto de " + zmod["model"];
                    zz["typeColumn"] = "ABSO";
                } else if (zmod["type"] === "PROM") {
                    zz["label"] = "Promedio de " + zmod["model"];
                    zz["typeColumn"] = "PROM";
                    zz["type"] = "prom";
                } else if (zmod["type"] === "PERCEN") {
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

            var normalCols = new qx.data.Array(cols);

            if (typeof filaRotulos === 'undefined' || typeof filaRotulos[0] === 'undefined') {
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

                var filaRotulosModel = filaRotulos[ia];
                var rotulo = filaRotulosModel["columnId"];
                var sort = filaRotulosModel["id"];

                if (ia == 0) {
                    function compareNumbers(a, b) {
                        var aLabel = qxnw.utils.cleanHtml(a[rotulo]);
                        var bLabel = qxnw.utils.cleanHtml(b[rotulo]);
                        aLabel = aLabel.replace('%', '');
                        bLabel = bLabel.replace('%', '');

                        var aIsNumber = false;
                        var bIsNumber = false;
                        if (+aLabel === +aLabel) {
                            aIsNumber = true;
                        }
                        if (+bLabel === +bLabel) {
                            bIsNumber = true;
                        }
                        if (aIsNumber === true && bIsNumber === true) {
                            return aLabel - bLabel;
                        }
                        if (typeof aLabel === 'number' && typeof bLabel === 'string') {
                            return -1;
                        }
                        if (typeof aLabel === 'string' && typeof bLabel === 'number') {
                            return 1;
                        }
                        if (typeof aLabel === 'string' && typeof bLabel === 'string') {
                            if (aLabel < bLabel)
                                return -1;
                            else
                                return 1;
                        }
                        return 0;
//                        var aIsNumber = false;
//                        var bIsNumber = false;
//                        if (+a[rotulo] === +a[rotulo]) {
//                            aIsNumber = true;
//                        }
//                        if (+b[rotulo] === +b[rotulo]) {
//                            bIsNumber = true;
//                        }
//                        if (aIsNumber === true && bIsNumber === true) {
//                            return a[rotulo] - b[rotulo];
//                        }
//                        if (typeof a[rotulo] === 'number' && typeof b[rotulo] === 'string') {
//                            return -1;
//                        }
//                        if (typeof a[rotulo] === 'string' && typeof b[rotulo] === 'number') {
//                            return 1;
//                        }
//                        if (typeof a[rotulo] === 'string' && typeof b[rotulo] === 'string') {
//                            if (a[rotulo] < b[rotulo])
//                                return -1;
//                            else
//                                return 1;
//                        }
//                        return 0;
                    }
                    self.tableRecords.sort(compareNumbers);
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
                                            if (record[rotulo] === "") {
                                                record[rotulo] = "(Vacío)";
                                            }
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
                    total["value"] = total[tt["columnId"]] / totalValue[tt["valCaption"]] * 100;
                } else {
                    total[tt["columnId"]] = totalValue[tt["columnId"]];
                    total["value"] = totalValue[tt["columnId"]];
                }
            }

            var rta = {};
            var ordered = self.orderListByMonths(finalArray);
            if (ordered !== false) {
                finalArray = ordered;
            } else {
                if (filaRotulos.length === 1) {
                    self.orderLogical(finalArray);
                }
            }
            rta["finalArray"] = finalArray;
            rta["cols"] = cols;
            rta["normalCols"] = normalCols;
            rta["total"] = total;
            
            return rta;
        },
        orderLogical: function orderLogical(arr) {
            var self = this;



            function isNumeric(n) {
                return !isNaN(parseFloat(n)) && isFinite(n);
            }

            function compareNumbers(a, b) {

                var aLabel = qxnw.utils.cleanHtml(a.label);
                var bLabel = qxnw.utils.cleanHtml(b.label);
                aLabel = aLabel.replace('%', '');
                bLabel = bLabel.replace('%', '');

                var aIsNumber = false;
                var bIsNumber = false;
                if (+aLabel === +aLabel) {
                    aIsNumber = true;
                }
                if (+bLabel === +bLabel) {
                    bIsNumber = true;
                }
                if (aIsNumber === true && bIsNumber === true) {
                    return aLabel - bLabel;
                }
                if (typeof aLabel === 'number' && typeof bLabel === 'string') {
                    return -1;
                }
                if (typeof aLabel === 'string' && typeof bLabel === 'number') {
                    return 1;
                }
                if (typeof aLabel === 'string' && typeof bLabel === 'string') {
                    if (aLabel < bLabel)
                        return -1;
                    else
                        return 1;
                }
                return 0;
            }

            return arr.sort(compareNumbers);
        },
        orderListByMonths: function orderListByMonths(records) {
            var self = this;
//            var lastItem = records.pop();
            var arr = [];
            var months = ["ENERO", "FEBRERO", "MARZO", "ABRIL", "MAYO", "JUNIO", "JULIO", "AGOSTO", "SEPTIEMBRE", "OCTUBRE", "NOVIEMBRE", "DICIEMBRE"];
            var isArrayOfMonths = true;
            for (var ia = 0; ia < months.length; ia++) {
                var m = months[ia];
                for (var i = 0; i < records.length; i++) {
                    var v = records[i];
                    if (typeof v.label === 'undefined') {
                        return false;
                    }
                    if (months.indexOf(v.label.toUpperCase()) == -1) {
                        isArrayOfMonths = false;
                        break;
                    }
                    var va = {};
                    var keys = Object.keys(v);
                    if (m == v.label.toUpperCase()) {
                        for (var ib = 0; ib < keys.length; ib++) {
                            va[keys[ib]] = v[keys[ib]];
                        }
                        va.level = 0;
                        arr.push(va);
                    }
                }
            }
            if (isArrayOfMonths == false) {
                return false;
            }
//            arr.push(lastItem);
            return arr;
        },
        sortByColumn: function sortByColumn(array, columnIndex, ascending) {
            var sortNormalMethod = function (row1, row2) {
                try {
                    var a = row1[arguments.callee.columnIndex];
                    var b = row2[arguments.callee.columnIndex];
                    if (typeof a == "string") {
                        a = a.toLowerCase();
                    }
                    if (typeof b == "string") {
                        b = b.toLowerCase();
                    }
                    if (isNaN(a) || isNaN(b)) {
                        if (a > b)
                            return 1;
                        else
                            return -1;
                    }
                } catch (e) {
                    qxnw.utils.error(e, self, 0, false, true);
                }
                return a - b;
            };
            sortNormalMethod.columnIndex = columnIndex;
            array.sort(sortNormalMethod);
        },
        getCols: function getCols(finalArray, filaRotulos) {
            var self = this;

            var saveSearch = [];
            var record = null;

            var qxdata = new qx.data.Array();
            if (typeof filaRotulos === 'undefined') {
                return;
            }
            if (filaRotulos === null) {
                return;
            }
            if (filaRotulos !== null && typeof filaRotulos[0] === 'undefined') {
                return;
            }

            for (var ia = 0; ia < filaRotulos.length; ia++) {

                var filaRotulosModel = filaRotulos[ia];
//                var filaRotulosModel = filaRotulos[ia].getModel();
                var rotulo = filaRotulosModel["columnId"];
                var sort = filaRotulosModel["id"];

                if (ia == 0) {
                    //self.tableParent.table.getTableModel().sortByColumn(parseInt(sort), true);
                    self.sortByColumn(self.tableRecords, parseInt(sort), true);
                }

                for (var i = 0; i < self.tableRecords.length; i++) {

                    record = self.tableRecords[i];

                    if (ia == 0) {
                        if (saveSearch.indexOf(self.tableRecords[i][rotulo]) == -1) {
                            saveSearch.push(self.tableRecords[i][rotulo]);
                            var d = [];
                            d["fila"] = self.tableRecords[i][rotulo];
                            d["label"] = self.tableRecords[i][rotulo];
                            d["model"] = self.tableRecords[i][rotulo];
                            d["row"] = self.tableRecords[i];
                            d["level"] = ia;
                            d["key"] = rotulo;
                            d["caption"] = self.tableRecords[i][rotulo];
                            d["columnId"] = self.tableRecords[i][rotulo];
                            d["typeColumn"] = "COUNT";
                            d["id"] = 1;
                            d["metaColumn"] = "column";
                            finalArray.push(d);
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
                                    d["model"] = new Array(ia + 1).join("&nbsp;&nbsp;&nbsp;&nbsp;") + record[rotulo];
                                    d["row"] = record;
                                    d["level"] = ia;
                                    d["key"] = rotulo;
                                    d["caption"] = rotulo;
                                    d["columnId"] = rotulo;
                                    d["oldkey"] = oldKey;
                                    d["typeColumn"] = "SUM";
                                    finalArray.push(d);
                                    qxdata.insertAfter(item, d);
                                }
                            }
                        }
                    }
                }
            }
            return finalArray;
        }
    }
}); 