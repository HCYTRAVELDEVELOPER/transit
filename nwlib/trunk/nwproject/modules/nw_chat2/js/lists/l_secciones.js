function l_secciones(thisDocAf) {
    var classDocument = ".l_secciones";
    createContainer("body", true, classDocument);
    var self = createDocument(classDocument);

    var thisDoc = this;
    thisDoc.constructor = constructor;
    thisDoc.updateContend = updateContend;
    thisDoc.self = self;
    var get = getGET();

    function constructor() {
        var columns = [
            {
                label: "ID",
                caption: "id",
                visible: false
            },
            {
                label: "Imagen",
                caption: "imagen",
                type: "image",
                mode: "phpthumb",
                clickable: false
            },
            {
                label: "Nombre Sección",
                caption: "nombre"
            },
            {
                label: "Redirecciona al chat",
                caption: "redirecciona_al_chat",
                visible: false
            },
            {
                label: "Muestra Info",
                caption: "redirecciona_al_mostrar_info",
                visible: false
            }
        ];
        createList(columns, self);

        var html = "<h2 class='subtitles'>Selecciona una opción</h2><p>Selecciona el servicio que necesites, para que nuestro equipo te colabore.</p>";
        addHeaderNoteList(html, self);
        listScroll(self, false);
        addCss(self, "", {"background-color": "#fff"});
        fadeOutMainColumns(self);

        thisDoc.updateContend();
    }

    function updateContend() {
        var orig = get.origin;
        orig = orig.replace("www.", "");
        orig = orig.replace("http://", "");
        orig = orig.replace("https://", "");
        orig = orig.replace(/\//gi, "");
        var data = {};
        data.id_sess = setDataSend();
        var rpc = {};
        rpc["service"] = "nwchat";
        rpc["method"] = "queryProfiles";
        rpc["data"] = data;
        var func = function (rh) {
            resetList(self);
            if (!verifyErrorNwMaker(rh)) {
                return;
            }
            var add = [];
            var num = 0;
            var totalTask = rh.length;
            for (var i = 0; i < totalTask; i++) {
                var row = rh[i];
                var p = row.cuales_dominios_separados_por_coma;
                if (evalueData(p)) {
                    var g = p.split(",");
                    for (var x = 0; x < g.length; x++) {
                        var dom = g[x];
                        dom = dom.replace("www.", "");
                        dom = dom.replace("http://", "");
                        dom = dom.replace("https://", "");
                        dom = dom.replace(/\//gi, "");
                        if (dom == orig) {
                            add[num] = row;
                            num++;
                        }
                    }
                } else {
                    add[num] = row;
                    num++;
                }
            }

            if (add.length < 1) {
                thisDocAf.createNwChatConversation();
                return;
            }
            if (add.length == 1) {
                actionInSala(add[0]);
            }
            setModelData(add, self);

            fadeOutMainColumns(self);
            listBloqs(self);
            removeColorsRows(self);
            $(".menuList").remove();
            var options = {};
            options["margin"] = "10px";
            options["width"] = "100px";
            options["height"] = "100px";
            options["max-height"] = "100px";
            options["padding"] = "5px";
            options["text-align"] = "center";
            listAddCss(self, options);
            listAddCssFor(self, ".colsMobil", {"cursor": "pointer"});
            listAddCssFor(self, ".colsMobil p", {"padding": "0px", "margin": "0px", "text-align": "center"});
            listAddCssFor(self, "2", {"font-size": "10px"});
            listAddCssFor(self, ".namedColMob", {"display": "none"});
            listAddCssFor(self, ".imageListNwMaker2", {"background-position": "center"});
            listAddCssFor(self, ".childrenValuesList", {"text-align": "center"});
            showRowInMobile(self, "nombre");
            vistaSecciones();
            onChangeWindow("vistaSecciones");

            var btnOk = actionInRow(self);
            console.log(btnOk);
            btnOk.click(function () {
                var data = getSelectedRecord(self);
                actionInSala(data);
            });

            activeClickDontOpen(self);

            function actionInSala(data) {
                if (data.redirecciona_al_chat === "SI") {
                    data.get = get;
                    data.tipo = "chat";
                    if (typeof get.videollamada != "undefined") {
                        data.tipo = "videollamada";
                    }
                    var rpc = {};
                    data.operatorsOnline = operatorsOnline;
                    data.id_sess = setDataSend();
                    rpc["service"] = "nwchat";
                    rpc["method"] = "initAllCallInitialVisitor";
                    rpc["data"] = data;
                    var func = function (r) {
                        if (!verifyErrorNwMaker(r)) {
                            return;
                        }
                        reject(self);
                        if (r == "salanodisponible") {
                            thisDocAf.createWindowMessageDisconect();
                        } else
                        if (r) {
                            if (operatorsOnline == false) {
                                thisDocAf.createWindowMessageDisconect();
                            } else {
                                thisDocAf.createNwChatConversation();
                            }
                        }
                        removeLoadingNw("fast");
                    };
                    rpcNw("rpcNw", rpc, func, true);
                } else
                if (data.redirecciona_al_mostrar_info === "SI") {
                    var rpc = {};
                    rpc["service"] = "nwchat";
                    rpc["method"] = "getInfoBySeccionShow";
                    rpc["data"] = data;
                    var func = function (r) {
                        if (r) {
                            var html = "<div class='showInfoBySeccionInWindow'><div class='closeWindowParentNwMaker closeInfoWindowSeccion'></div>" + r["texto_redireccion_info"] + "</div>";
                            addHeaderNoteList(html, self);
                            if (isMobile()) {
                                $(".closeWindowParentNwMaker").css({"top": "27px", "right": "3px", "width": "25px", "height": "25px", "line-height": "25px"});
                            }
                        } else {
                            nw_dialog("A ocurrido un error: " + r);
                        }
                        removeLoadingNw("fast");
                    };
                    rpcNw("rpcNw", rpc, func, true);
                } else {
                    nw_dialog("Ha ocurrido algo inesperado. Consulte con el administrador del sistema.");
                }
            }

        };
        rpcNw("rpcNw", rpc, func, true);
    }
}