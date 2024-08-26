nw.Class.define("f_redimir_cupon", {
    extend: nw.forms,
    construct: function (callback) {
        var self = this;
        self.id = "f_redimir_cupon";
        self.canvas = "#foo";
        self.setTitle = "<span style='color:#fff;'>Promociones</span>";
        self.html = nw.tr("Redimir cupón promocional");
        self.showBack = true;
        self.closeBack = false;
        self.textClose = "Volver";
        self.colorBtnBackIOS = "#ffffff;";
        self.styleCloseIOS = "color:#ffffff;color: rgb(255, 255, 255);background-color: transparent;border: 0;box-shadow:none;";
//        self.transition = "slideup";
        self.createBase();
        self.callback = callback;
        var fields = [
            {
                label: "",
                style: '',
                name: "contenedor_promociones",
                mode: "div",
                type: "startGroup"
            },
            {
                name: "my_link_img",
                label: "<span class='imgRefiereAmigos' style='background-image: url(" + config.domain_rpc + "/lib_mobile/driver/img/Cupones_IMG.png);'></span>",
                type: "html"
            },
            {
                name: "my_link_description",
                label: "<span class='titleRefiereAmigos'>" + nw.tr("Redimir cupón promocional") + "</span><span class='descpRefiereAmigos'>" + nw.tr("Redime y viaja con nosotros a donde tu quieras.") + "</span>",
                type: "html"
            },
            {
                label: "",
                style: '',
                name: "contenedor_refiere_amigos_actions",
                mode: "div",
                visible: false,
                type: "startGroup"
            },
            {
                name: "nombre",
                label: "Código",
                placeholder: 'Código',
                type: "textField",
                required: true,
                visible: false
            },
            {
                label: "",
                style: '',
                name: "contenedor_refiere_amigos_buttons",
                mode: "div",
                type: "startGroup"
            },
            {
                name: "redimir",
                label: "Redimir",
                type: "button",
                visible: false
            },
            {
                mode: "div",
                type: "endGroup"
            },
            {
                mode: "div",
                type: "endGroup"
            },
            {
                mode: "div",
                type: "endGroup"
            },
            {
                label: "",
                name: "l_cupones_group",
                type: "startGroup",
                visible: true
            },
            {
                type: "endGroup"
            }
        ];
        self.setFields(fields);
//        self.buttons = [
//            {
//                style: "background-color: #f18107;color: #ffffff;",
//                icon: "nwmaker/img/baseline-how_to_reg-24px.svg",
//                colorBtnBackIOS: "#ffffff",
//                name: "aceptar",
//                label: "Enviar",
//                callback: function () {
//                    self.save();
//                }
//            }
//        ];
        self.show();
        self.ui.redimir.addListener("click", function () {
            self.save();
        });
        $("#f_redimir_cupon .nw_label_nombre").css("cssText", "display:none!important;");


        self.onAppear(function () {
            setTimeout(function () {
                self.createNavTableCupones();
                var nav = new l_navtable_cupones();
                nav.construct(self.canvas + " .l_cupones_group");
                self.navTable = nav;
            }, 100);
        });


    },
    destruct: function () {
    },
    members: {
        save: function save() {
            var self = this;
            if (!self.validate()) {
                return false;
            }
            var up = nw.userPolicies.getUserData();
            var data = self.getRecord(true);
            data.usuario = up.usuario;
            data.empresa = up.empresa;
            data.perfil = up.perfil;
            data.ciudad = up.ciudad;
//            console.log(up);
//            console.log(data);
//            return;
            var rpc = new nw.rpc(nw.getRpcUrl(), "vehiculo");
            rpc.setAsync(true);
            var func = function (r) {
//                console.log(r);
                if (r === false) {
                    nw.dialog("El código no existe o ya fue redimido");
                    return false;
                }
                var op = {};
                op.cleanHtml = false;
                if (!nw.evalueData(up.saldo)) {
                    up.saldo = 0;
                }
                var saldo = parseFloat(up.saldo) + parseFloat(r.valor);
                up.saldo = saldo;
                window.localStorage.setItem("saldo", saldo);
                nw.dialog("<strong>¡Código redimido!</strong>", false, false, op);
//                if (nw.evalueData(self.callback)) {
//                    self.callback();
//                    self.reject();
//                } else {
                self.navTable.applyFilters();
//                }
            };
            rpc.exec("validate_cupon", data, func);
        },
        createNavTableCupones: function createNavTableCupones() {
            var self = this;
            nw.Class.define("l_navtable_cupones", {
                extend: nw.lists,
                construct: function (canvas) {
                    var list = this;
//                    list.showContextMenu = true;
                    list.canvas = canvas;
                    var columns = [
                        {
                            name: "id",
                            label: "ID",
                            visible: false
                        },
                        {
                            style: {data: "width: 150px;position: relative;overflow: hidden;text-align: justify;height: auto;white-space: pre-wrap;font-size: 14px;font-weight: bold; left: 22px;"},
                            name: "descripcion",
                            label: ""
                        },
                        {
                            style: {data: "position: relative;font-weight: bold; font-size: 14px; left: 26px;", label: "color: grey;font-size: 14px;left: 26px;position: relative;"},
                            name: "saldo",
                            label: "Saldo:"
                        },
                        {
                            style: {data: "position: relative;font-weight: bold; font-size: 14px; left: 26px;", label: "color: grey;font-size: 14px;left: 26px;position: relative;"},
                            name: "nombre",
                            label: "Codigo:"
                        },
                        {
                            style: {data: "position: absolute;right: 10px;top: 0px;text-align: center;"},
                            name: "fecha_expiracion",
                            label: ""
                        },
                        {
                            name: "fecha_expiracion_format",
                            label: "",
                            visible: false
                        },
                        {
                            name: "servicio",
                            label: "",
                            visible: false
                        }
                    ];
                    list.setColumns(columns);
                    list.applyFilters();
                    return list;
                },
                destruct: function () {
                },
                members: {
                    contextMenu: function contextMenu() {
                        var self = this;
                        var up = nw.userPolicies.getUserData();
                        var sl = self.selectedRecord();
                        var m = new nw.contextmenu(this, "bottom"); //vertical, bottom
                        m.addAction("Quitar de la lista", "material-icons create normal", function (e) {
                            var li = self.activeRow;
                            $(li).remove();
                        });
                    },
                    clicRow: function clicRow() {
                        var list = this;
                        var data = list.selectedRecord();
                        nw.console.log("clicRow", data);
                    },
                    applyFilters: function applyFilters() {
                        var list = this;
                        var up = nw.userPolicies.getUserData();
                        var data = {};
                        data.usuario = up.usuario;
                        data.empresa = up.empresa;
                        data.perfil = up.perfil;
                        nw.console.log("clicRow", data);
                        var rpc = new nw.rpc(nw.getRpcUrl(), "servicios");
                        rpc.setAsync(true);
                        rpc.setLoading(true);
                        var func = function (jd) {
                            var r = [];
                            console.log(jd);
//                            console.log(list);
                            list.numberRow = 0;
                            var fecha2 = nw.getActualFullDate("datetime-local");
                            for (var e = 0; e < jd.length; e++) {

                                jd[e].fecha_expiracion_format = jd[e].fecha_expiracion;
                                var fecha1 = nw.toDatetimeLocal(jd[e].fecha_expiracion);
                                var dd = nw.calcularTiempoDosFechas(fecha2, fecha1);
//                                console.log(dd);
                                jd[e].fecha_expiracion = "Vence en: <br>" + dd.hours + "H:" + dd.minutes + "M";
                                jd[e].saldo = "$" + jd[e].valor;
                                if (jd[e].tipo_descuento == "porcentaje") {
                                    jd[e].saldo = jd[e].valor + "%";
                                }
//                                    console.log(up.ciudad);
//                                    console.log(jd[e].ciudad);
                                if (nw.evalueData(up.ciudad)) {
                                    if (nw.evalueData(jd[e].ciudad) && jd[e].ciudad != null && jd[e].ciudad != "" && up.ciudad != "" && up.ciudad != jd[e].ciudad) {
                                        continue;
                                    }
                                }
                                r.push(jd[e]);
                            }
                            list.setModelData(r);
                            console.log(r);
                            for (var i = 0; i < r.length; i++) {
                                var ele = document.querySelector(".l_cupones_group #rowlist_" + i);
//                                console.log(ele);
                                if (ele) {
                                    var div = document.createElement('div');
                                    div.className = 'contened-div-line';
                                    div.innerHTML = '<svg class="card__svg" viewBox="43 0 540 500">\n\
                                  <path class="card__line1" d="M 0 100 Q 50 200 100 250 Q 250 400 350 300 C 400 250 550 150 650 300 Q 750 450 800 400 L 800 500 L 0 500" stroke="transparent" fill="#333"/>\n\
                                  <path class="card__line" d="M 0 100 Q 50 200 100 250 Q 250 400 350 300 C 400 250 550 150 650 300 Q 750 450 800 400" stroke="pink" stroke-width="3" fill="transparent"/>\n\
                                  </svg>';
                                    ele.appendChild(div);
                                    var btn_usu = document.createElement('div');
                                    console.log(r[i].estado);
                                    if (r[i].estado == "ACTIVO") {
                                        btn_usu.innerHTML = '<i class="material-icons">check_circle</i><span>Activo</span>';
                                        btn_usu.className = 'btn_usu activo_cupon';
                                    } else {
                                        btn_usu.innerHTML = "Usar Cupón";
                                        btn_usu.className = 'btn_usu';
                                    }
                                    btn_usu.setAttribute("data", i);
                                    btn_usu.onclick = function () {
//                                        console.log(ele);
                                        var num = this.getAttribute("data");
                                        var eleconte = document.querySelector(".l_cupones_group #rowlist_" + num + " .containerListRow");
//                                        console.log(eleconte);
                                        eleconte.click();
                                        list.this_cup = this;
//                                        console.log(list.this_cup.classList);
                                        if (/activo_cupon/.test(list.this_cup.classList)) {
                                            return;
                                        }
                                        var active = document.querySelector(".activo_cupon");
                                        console.log("active cupon", active);
                                        if (active) {
                                            nw.dialog('Ya esta usando un cupon, desea cambiarlo por este', function () {
                                                list.updateCupon(function () {
                                                    active.classList.remove('activo_cupon');
                                                    active.innerHTML = 'Usar Cupón';
                                                    list.this_cup.classList.add('activo_cupon');
                                                    list.this_cup.innerHTML = '<i class="material-icons">check_circle</i><span>Activo</span>';
                                                    if (nw.evalueData(self.callback)) {
                                                        self.callback();
                                                    }
                                                });
                                            }, function () {
                                                return;
                                            });
                                        } else {
                                            list.updateCupon(function () {
                                                list.this_cup.classList.add('activo_cupon');
                                                list.this_cup.innerHTML = '<i class="material-icons">check_circle</i><span>Activo</span>';
                                                if (nw.evalueData(self.callback)) {
                                                    self.callback();
                                                }
                                            });
                                        }
                                    };
                                    ele.appendChild(btn_usu);
                                }
                            }
                        };
                        rpc.exec("consultaCupones", data, func);
                    },
                    updateCupon: function updateCupon(callback) {
                        var list = this;
                        var up = nw.userPolicies.getUserData();
                        var cupon_uti = list.selectedRecord();
                        var data = list.selectedRecord();
                        data.usuario = up.usuario;
                        data.empresa = up.empresa;
                        data.perfil = up.perfil;
//                        console.log(up);
//                        console.log(data);
//                        return;
                        var rpc = new nw.rpc(nw.getRpcUrl(), "servicios");
                        rpc.setAsync(true);
                        var func = function (r) {
                            up.cupon = JSON.stringify(cupon_uti);
                            callback();
                        };
                        rpc.exec("updateCupon", data, func);
                    }
                }
            });
        },
        populate: function populate(pr) {
            var self = this;
            self.setRecord(pr);
        }
    }
});