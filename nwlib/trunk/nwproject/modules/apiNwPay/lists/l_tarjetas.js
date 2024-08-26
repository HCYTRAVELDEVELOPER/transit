function l_tarjetas(openOutside) {
    var thisDoc = this;
    thisDoc.constructor = constructor;
    thisDoc.updateContend = updateContend;

    function constructor(self) {
        empty(".loadModulosCenter");
        empty(".l_tarjetas");
        addHash("#execCallBack=formasPago");
        var divPadreContainer = ".container-main-myusers";
        initContainer(divPadreContainer);
        var classDocument = ".l_tarjetas";
        createContainer(divPadreContainer, false, classDocument);
        self = createDocument(classDocument);
        thisDoc.self = self;
        var up = getUserInfo();
        if (typeof up.usuario === "undefined") {
            return false;
        }
        var columns = [
            {
                label: "ID",
                caption: "id",
                visible: false
            },
            {
                label: "Nombre",
                caption: "nombre"
            },
            {
                label: "Fecha vencimiento",
                caption: "fecha_vencimiento"
            }
        ];
        createList(columns, self);

        var btn = actionInColForm(self, "buscar");
        btn.keypress(function (e) {
            if (e.which === 13) {
                thisDoc.updateContend();
                return false;
            }
        });

        var html = "<h2 class='subtitles titleMyUsersNwMaker'>Mis tarjetas</h2>";
        addHeaderNoteList(html, self);

        setMaxWidthList(1100, self);
        listScroll(self, false);

        var update = getButtonUpdateFilter(self, "update");
        update.click(function () {
            thisDoc.updateContend();
        });

        var nuevo = createButtonListEnc(self, "Crear Nueva Tarjeta");
        nuevo.click(function () {
            var data = {};
            data["pruebas"] = "NO";
            var p = {};
            p["price"] = 11000;
            p["service"] = "nwMaker";
            p["method"] = "apiNwPayTesting";
            p["data"] = data;
            p["noReject"] = true;
            p["type"] = "payu";
            p["wayToPay"] = "credito";
            p["newCard"] = true;
            p["callBack"] = function (r) {
                console.log(r);
                thisDoc.updateContend();
//                var params = {};
//                params.html = "callBack posterior a la respuesta del banco, en la consola se puede ver lo que devuelve...";
//                params.textAccept = "Listo, que bien!";
//                params.no_cancel_button = true;
//                params.onSave = function () {
//                    return true;
//                };
//                createDialogNw(params);
            };
            var d = new apiNwPay(p);
            d.open();
        });
        thisDoc.updateContend();
    }

    function updateContend() {
        var self = thisDoc.self;
        var data = {};
        data["filters"] = getDataFilters(self);
        var rpc = {};
        rpc["service"] = "nwMaker";
        rpc["method"] = "consultaMisTarjetas";
        rpc["data"] = data;
        var func = function (r) {
            resetList(self);
            if (!verifyErrorNwMaker(r, self) || verifyErrorNwMaker(r, self) === 0) {
                return;
            }
            setModelData(r, self);

            var options = {};
            options["margin"] = "10px";
            options["height"] = "auto";
            options["max-height"] = "initial";
            options["padding"] = "10px";
            options["margin"] = "0";
            listAddCss(self, options);

            listAddCssFor(self, ".colEncMobil p", {"padding": "10px 0", "text-align": "left"});

            listAddCssFor(self, "1", {"font-weight": "bold"});

            listAddCssFor(self, ".colsMobil", {"width": "auto", "height": "auto", "margin": "auto", "float": "none"}, "mobile");
            listAddCssFor(self, ".namedColMob", {"display": "none"}, "mobile");

            showRowInMobile(self, "nombre");
            showRowInMobile(self, "fecha_vencimiento");

            var eliminar = addButtonContextMenu(self, "Eliminar");
            eliminar.click(function () {
                var r = getSelectedRecord(self);
                var selfNew = generateSelf();
                createNwForms(selfNew, false, "popUp");
                addHeaderNote(selfNew, "¿Desea eliminar este registro?");
                setModal(true);
                setWidth(selfNew, 300);
                var accept = addButtonNwForm("Aceptar", selfNew);
                accept.click(function () {
                    var data = {};
                    data["id"] = r["id"];
                    data["table"] = "nwmaker_tarjetascredito";
                    deleteRecordForId(data);
                    reject(selfNew);
                    thisDoc.updateContend();
                });
                var cancel = addButtonNwForm("Cancelar", selfNew);
                cancel.click(function () {
                    reject(selfNew);
                });
            });
        };
        rpcNw("rpcNw", rpc, func, true);
    }
}