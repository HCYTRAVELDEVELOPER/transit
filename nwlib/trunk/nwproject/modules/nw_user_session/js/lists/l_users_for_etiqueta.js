function l_users_for_etiqueta(top, left, inputReferer) {
    empty(".l_users_for_etiqueta");
    remove(".l_users_for_etiqueta");
    var divPadreContainer = "body";
    var classDocument = ".l_users_for_etiqueta";
    createContainer(divPadreContainer, true, classDocument);
    var self = createDocument(classDocument);
    var thisDoc = this;
    this.constructor = constructor;
    this.updateContend = updateContend;
    this.self = self;

    function constructor() {
        hiddenUser();
        hideMenuMovilNwMaker();

        var columns = [
            {
                label: "Imagen",
                caption: "foto_perfil",
                type: "image",
                mode: "phpthumb",
                clickable: false
            },
            {
                label: "Nombre",
                caption: "nombre"
            },
            {
                label: "Usuario",
                caption: "usuario_cliente",
                visible: false
            }
        ];
        createList(columns, self);
        var filters = [
            {
                name: "buscar_usuario",
                caption: "buscar_usuario",
                label: "Buscar",
                texto_ayuda: "Buscar",
                tipo: "textField"
            }
        ];
        createFilters(filters, self);
        var btn = actionInColForm(self, "buscar_usuario");
        btn.keypress(function (e) {
            if (e.which == 13) {
                thisDoc.updateContend();
                return false;
            }
        });

        setMaxWidthList(200, self);
        listScroll(self, false);
        listAddCssFor(self, "", {"position": "absolute", "top": top + 50 + "px", "left": left + "px", "height": "200px", "z-index": "1000000000", "width": "100%", "background": "#fff", "box-shadow": "0px 0px 5px #000", "overflow-y": "auto"});

        loading("Cargando", "rgba(255, 255, 255, 0.76)!important", self);
        thisDoc.updateContend();
    }

    function updateContend() {
        var data = {};
        var rpc = {};
        data["filters"] = getDataFilters(self);
        rpc["service"] = "nwMaker";
        rpc["method"] = "consultaUsuariosParaEtiquetar";
        rpc["data"] = data;
        var func = function (r) {
            resetList(self);
            if (!verifyErrorNwMaker(r, self) || verifyErrorNwMaker(r, self) == 0) {
                return;
            }
            setModelData(r, self);

            fadeOutMainColumns(self);

            listAddCssFor(self, ".colsMobil p", {"margin": "0px", "padding": "0px"});
            listAddCssFor(self, ".colsMobil", {"cursor": "pointer"});
            listAddCssFor(self, ".colMobil", {"width": "auto", "margin-left": "5px"});
            listAddCssFor(self, ".imageListNwMaker2", {"width": "30px", "height": "30px", "border-radius": "50%", "background-position": "center", "background-size": "cover"});


            if (isMobile()) {
                listAddCssFor(self, ".namedColMob", {"display": "none"});
                listAddCssFor(self, ".colMobilLabel_foto_perfil", {"max-width": "35px"});
            }

            var options = {};
            options["padding"] = "4px 0px";
            options["height"] = "auto";
            options["max-height"] = "initial";
            listAddCss(self, options);

            showRowInMobile(self, "foto_perfil");
            showRowInMobile(self, "nombre");

            var btnOk = actionInRow(self);
            btnOk.click(function () {
                var data = getSelectedRecord(self);
                var dAntes = $(inputReferer).val();
                var ds = dAntes.split(" @");
                if (typeof ds[1] != "undefined") {
                    dAntes = ds[0];
                } else {
                    dAntes = "";
                }
                var dAhora = dAntes + " <nw>" + data.usuario_cliente + "</nw> ";
                $(inputReferer).val(dAhora);
                reject(self);
                $(inputReferer).focus();
            });
            remove(self + " .menuList");
            removeColorsRows(self);
            removeLoading(self);
        };
        rpcNw("rpcNw", rpc, func, true);

    }
}