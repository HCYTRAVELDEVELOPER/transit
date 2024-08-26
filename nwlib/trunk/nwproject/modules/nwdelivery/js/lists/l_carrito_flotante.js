function l_carrito_flotante() {
    var classDocument = ".l_carrito_flotante";
    var self = createContainer(".container-main-nwdelivery", true, classDocument);
    var thisDoc = this;
    this.constructor = constructor;
    this.updateContend = updateContend;
    this.self = self;

    function constructor(r) {
        var columns = [
            {
                label: "ID",
                caption: "id",
                visible: false
            },
            {
                label: "Imagen",
                caption: "imagen_producto",
                type: "image"
            },
            {
                label: "Nombre",
                caption: "nombre_producto"
            },
            {
                label: "Descripción",
                caption: "descripcion_producto",
                visible: false
            },
            {
                label: "Adicionales",
                caption: "adicionales",
                visible: true
            },
            {
                label: "Unidades",
                caption: "unidades"
            },
            {
                label: "Valor",
                caption: "valor_total",
                type: "money"
            }
        ];
        createList(columns, self);
        var html = "<h2 class='subtitles subtitle_carrito'>Carrito</h2>";
        if (r === true) {
            loadCss("/nwlib6/nwproject/modules/nwdelivery/style/hacer_pedido.css", self);
        }
        addHeaderNoteList(html, self);
        setMaxWidthList(190, self);
        listScroll(self, false);
        thisDoc.updateContend();
    }

    function updateContend() {
        var rpc = {};
        rpc["service"] = "nwdelivery";
        rpc["method"] = "consultaCarritoProductos";
        rpc["data"] = {};
        var func = function (rh) {
            listAddCssFor(self, ".colsMobilEnc", {"display": "none"});
            if (rh == "0" || rh == 0) {

                $(self + " .containDataColsInt").empty();
                remove(".containerValoresAndButtons");

                $(".solicitarCarrito").fadeOut(0);
                var html = "<div class='noproductoscarrito'>No tienes productos agregados</div>";
                addHtmlForm(self + " .container-table-list", html, false, "prepend");
                return false;
            } else
            if (rh) {
                var r = rh["productos"];
                var conf = rh["config"];

                setModelData(r, self);

                var subtotal = 0;
                var domicilio = parseInt(conf["valor"]);
                var descuento = parseInt(conf["descuento_global_porcentaje"]);
                var total = 0;
                for (var i = 0; i < r.length; i++) {
                    var f = r[i];
                    subtotal = subtotal + parseInt(f["valor_total"]);
                }
                var descuento_valor = (subtotal * parseInt(conf["descuento_global_porcentaje"])) / 100;
                if (conf["descuento_aplica_con_domicilio"] == "SI") {
                    descuento_valor = ((subtotal + domicilio) * parseInt(conf["descuento_global_porcentaje"])) / 100;
                }
                total = (subtotal + domicilio) - descuento_valor;

                $(".solicitarCarrito").fadeIn(0);

                listAddCssFor(self, ".colsMobilEnc", {"display": "none"});
                listAddCssFor(self, ".colsMobil p", {"margin": "0", "padding": "0"});
                listAddCssFor(self, "1", {"height": "30px", "background-position": "center", "border-radius": "50%", "background-size": "contain"});

                moveDataToColumn(self, "2", "1");
                moveDataToColumn(self, "3", "1");
                moveDataToColumn(self, "4", "1");
                moveDataToColumn(self, "5", "1");
                moveDataToColumn(self, "6", "1");

                $(self + " .nameColList_unidades").append(" Unids");

                listAddCssFor(self, ".pColsIntListName_imagen_producto", {"width": "30px", "float": "left", "margin": "0", "padding": "0"});
                listAddCssFor(self, ".colMobilLabel_nombre_producto", {"width": "100px", "font-weight": "bold", "margin": "5px 0"});
                listAddCssFor(self, ".colMobilLabel_nombre_producto", {"max-width": "160px"}, "mobile");
                listAddCssFor(self, ".colMobilLabel_imagen_producto", {"width": "100%", "font-weight": "bold", "margin": "5px 0"});
                listAddCssFor(self, ".colMobilLabel_unidades", {"width": "auto", "text-align": "center", "margin": "5px 0"});
                listAddCssFor(self, ".colMobilLabel_valor_total", {"width": "150px", "font-weight": "bold", "margin": "5px 0"});
                listAddCssFor(self, ".colMobilLabel_descripcion_producto", {"width": "100%", "margin": "5px 0"});
                listAddCssFor(self, ".colMobilLabel_adicionales", {"width": "100%", "margin": "5px 0"});


                listAddCssFor(self, ".colMobilLabel_unidades", {"max-width": "100px", "text-align": "left"}, "mobile");
                listAddCssFor(self, ".colMobilLabel_valor_total", {"max-width": "150px"}, "mobile");
                listAddCssFor(self, ".p_adic", {"float": "left", "margin-left": "5px", "font-size": "11px"}, "mobile");
                listAddCssFor(self, ".namedColMob", {"display": "none"}, "mobile");

                listAddCssFor(self, ".colMobilLabel_descripcion_producto", {"max-width": "230px"}, "mobile");
                listAddCssFor(self, ".colMobilLabel_adicionales", {"max-width": "230px"}, "mobile");

                listAddCssFor(self, ".pColsIntListName_imagen_producto .imageListNwMaker2", {"width": "100px", "height": "100px"}, "mobile");

                listAddCssFor(self, ".p_adic", {"margin": "0", "padding": "0"}, "mobile");
                listAddCssFor(self, ".pColsIntList", {"margin": "0", "padding": "0"}, "mobile");

                showRowInMobile(self, "nombre_producto");
                showRowInMobile(self, "adicionales");
                showRowInMobile(self, "unidades");
                showRowInMobile(self, "valor_total");
//                showRowInMobile(self, "descripcion_producto");

                inactiveClicInRow(self);

                var options = {};
                options["margin"] = "3px 0";
                options["height"] = "auto";
                options["width"] = "auto";
                options["max-height"] = "initial";
                options["padding"] = "5px 1px";
                listAddCss(self, options);
                var dom2 = true;

                var html = "";
                html += "<div class='containerValoresAndButtons'>";
                html += "<div class='containerValores'>";
                html += "<p><span class='colLeft subtotal' >SubTotal:</span> <span class='colRigth subtotal' >$" + subtotal + "</span></p>";

                if (conf["descuento_aplica_con_domicilio"] == "SI") {
                    html += "<p><span class='colLeft subtotal' >Domicilio:</span> <span class='colRigth subtotal' >$" + domicilio + "</span></p>";
                    dom2 = false;
                }
                html += "<p><span class='colLeft subtotal' >Descuento:</span> <span class='colRigth subtotal' >(" + descuento + "%) $" + descuento_valor + "</span></p>";

                if (dom2 === true) {
                    html += "<p><span class='colLeft subtotal' >Domicilio:</span> <span class='colRigth subtotal' >$" + domicilio + "</span></p>";
                }
                html += "<p><span class='colLeft subtotal' >Total:</span> <span class='colRigth subtotal' >$" + total + "</span></p>";
                html += "</div>";
                html += "<div class='containerButtonsVals'>";
                html += "<div class='solicitarCarrito'>Hacer Pedido</div>";
                html += "</div>";
                html += "</div>";
                addFooterNoteList(self, html);

                listAddCssFor(self, ".solicitarCarrito", {"position": "fixed", "bottom": "0px", "width": "100%"}, "mobile");

                var eliminar = addButtonContextMenu(self, "Quitar");
                eliminar.click(function () {
                    var r = getSelectedRecord(self);
                    var data = {};
                    data["id"] = r["id"];
                    data["table"] = "pv_carrito_productos";
                    deleteRecordForId(data, function (r) {
                        if (r) {
                            loadCarritoDelivery();
                        }
                    });
                });

                $(".solicitarCarrito").click(function () {
                    reject(".f_ver_producto");
                    loadMakePedido(self);
                });

            } else {
                nw_dialog("A ocurrido un error: " + rh);
                console.log(rh);
            }

            if (!isMobile()) {
                listAddCssFor(self, ".colsMobil p", {"margin": "1px", "padding": "1px"});
                listAddCssFor(self, ".colMobil", {"margin": "0px", "padding": "0px"});
            }

//            var h1 = $(self + " .colMobilLabel_nombre_producto").height();
//            var h2 = $(self + " .colMobilLabel_descripcion_producto").height();
//            var h3 = $(self + " .colMobilLabel_adicionales").height();
//            var h = parseInt(h1) + parseInt(h2) + parseInt(h3);
//            console.log(h);
//            listAddCssFor(self, ".pColsIntListName_imagen_producto", {"width": "auto", "float": "left", "height": h + "px"}, "mobile");

        };
        rpcNw("rpcNw", rpc, func, true);
    }
}