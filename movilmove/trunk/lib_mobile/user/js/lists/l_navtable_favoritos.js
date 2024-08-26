nw.Class.define("l_navtable_favoritos", {
    extend: nw.lists,
    construct: function (canvas, parent) {
        var self = this;
        self.id = "l_navtable_favoritos";
        self.setTitle = "Favoritos";
        self.html = "Favoritos";
        self.showBack = false;
        self.closeBack = true;
        self.textClose = "Volver";
        self.html = "";
//        self.colorBtnBackIOS = "#ffffff;";
//        self.styleCloseIOS = "top: 3px;";
        self.showContextMenu = false;
        self.parent = parent;
        if (!nw.evalueData(parent)) {
            self.createBase();
            self.showContextMenu = true;
        } else {
            self.canvas = canvas;
        }

        var columns = [
            {
                name: "id",
                label: "ID",
                visible: false
            },
            {
                name: "nombre",
                label: ""
            },
            {
                name: "direccion",
                label: "",
                visible: false
            }
        ];
        self.setColumns(columns);

        self.buttons = [];
        self.buttons.push(
                {
                    icon: "material-icons add normal",
                    position: "top",
                    name: "nuevo",
                    label: "Nuevo",
                    callback: function () {
                        var d = new f_favoritos();
                        d.construct(function () {
                            self.clean();
                            self.applyFilters();

                            main.navTableFavoritos.clean();
                            main.navTableFavoritos.applyFilters();
                        });
                        d.ui.nombre.setVisibility(false);
                    }
                }
        );
        self.show();
        self.onAppear(function () {
            setTimeout(function () {
                self.applyFilters();
            }, 100);
        });
        return self;
    },
    destruct: function () {
    },
    members: {
        clicRow: function clicRow() {
            var self = this;
            var data = self.selectedRecord();
            data.nombre = nw.stripTags(data.nombre_clean);
            if (data.direccion === "") {
                var d = new f_favoritos();
                if (data.tipo === "home") {
                    data.nombre = nw.utils.tr("Casa");
                } else
                if (data.tipo === "work") {
                    data.nombre = nw.utils.tr("Trabajo");
                }
                d.construct(function () {
                    self.clean();
                    self.applyFilters();

                    main.navTableFavoritos.clean();
                    main.navTableFavoritos.applyFilters();
                });
                d.orden = 1;
                d.tipo = data.tipo;
                d.populate(data);
                return false;
            }
            if (nw.evalueData(self.parent)) {
                var dataparent = self.parent.getRecord();
//                console.log("dataparent", dataparent);
//                console.log("dataparent", dataparent.address);
//                self.parent.ui.address_destino.setValue(data.direccion);
                var r = JSON.parse(data.results);
//                console.log("r", r);
                if (!nw.evalueData(r)) {
                    return false;
                }
                var dat = {};
                dat.lat = r.lat;
                dat.lng = r.lng;
                dat.ciudad = r.ciudad;
                dat.name = data.direccion;
                dat.icon = r.icon;
                dat.name_place = r.name_place;
                dat.allData = r;
                dat.type = r.type;
//                if (!nw.utils.evalueData(dataparent.address) && !nw.utils.evalueData(dataparent.address_destino)) {
//                    nw.dialog("Debe completar los datos de dirección de origen y destino");
//                    return false;
//                }
                if (self.parent.configCliente.app_para == "CARGA" && nw.utils.evalueData(dataparent.address)) {
//                if (self.parent.configCliente.app_para == "CARGA") {
                    self.parent.formDatosCarga(function () {
                        self.parent.pointMapDestinoExec(dat);
                    });
                } else
                if (self.parent.configCliente.pedir_datos_viaje_airpot == "SI" && r.type == "airport" && nw.evalueData(self.parent)) {
                    self.parent.pedirDataAirpot(function (e) {
                        self.parent.pointMapDestinoExec(dat);
                    });
                } else {
                    self.parent.pointMapDestinoExec(dat);
                }
                return true;
            }
            var d = new f_favoritos();
            d.construct(function () {
                self.clean();
                self.applyFilters();

                main.navTableFavoritos.clean();
                main.navTableFavoritos.applyFilters();
            });
            d.populate(data);
        },
        contextMenu: function contextMenu() {
            var self = this;
//            var up = nw.userPolicies.getUserData();
            var sl = self.selectedRecord();
            var typemenu = "bottom";
//            var typemenu = "normal";
            var m = new nw.contextmenu(this, typemenu);//vertical, bottom
            m.addAction("Eliminar", "nwmaker/img/baseline-create-24px.svg", function (e) {
                self.eliminar(sl);
            });
            m.addAction("Editar", "nwmaker/img/baseline-create-24px.svg", function (e) {
                var d = new f_favoritos();
                d.construct();
                d.populate(sl);
            });
        },
        eliminar: function eliminar(data) {
            var self = this;
            nw.dialog("¿Desea eliminar este registro?", accept, cancel);
            function accept() {
                nw.loading({text: "Eliminando...", textVisible: true, html: "", theme: "b", "container": self.canvas});
                var rpc = new nw.rpc(self.getRpcUrl(), "servicios");
                rpc.setAsync(true);
                var func = function (r) {
                    nw.loadingRemove({"container": self.canvas});
                    nw.dialog("Eliminado correctamente");
                    var d = new l_navtable_favoritos();
                    d.construct();
                };
                rpc.exec("eliminarUbicacion", data, func);
            }
            function cancel() {

            }
        },
        applyFilters: function applyFilters() {
            var self = this;
            var up = nw.userPolicies.getUserData();
            var data = {};
            data.empresa = up.empresa;
            data.usuario = up.usuario;
            data.perfil = up.perfil;
            var rpc = new nw.rpc(self.getRpcUrl(), "servicios");
            rpc.setAsync(true);
            rpc.setLoading(false);
            var funcs = function (r) {
                var d = [];
                if (!r) {
                    r = [];
                }
                var haveHome = false;
                var haveWork = false;
                for (var i = 0; i < r.length; i++) {
                    if (r[i].tipo === "home") {
                        haveHome = true;
                    }
                    if (r[i].tipo === "work") {
                        haveWork = true;
                    }
                }
                var rs = [];
                if (!haveHome) {
                    rs.push({
                        tipo: "home",
                        direccion: "",
                        nombre: "Agregar dirección particular",
                        nombre_clean: "Agregar dirección particular"
                    });

                }
                if (!haveWork) {
                    rs.push({
                        tipo: "work",
                        direccion: "",
                        nombre: "Agregar dirección laboral",
                        nombre_clean: "Agregar dirección laboral"
                    });
                }
                for (var i = 0; i < r.length; i++) {
                    rs.push(r[i]);
                }
//                console.log("r", r);
                for (var i = 0; i < rs.length; i++) {
                    var ra = rs[i];
                    if (!nw.evalueData(ra.results)) {
                        continue;
                    }
                    var rson = JSON.parse(ra.results);
                    if (!nw.evalueData(rson)) {
                        continue;
                    }
                    var addClass = "";
                    var icon = "access_time";
                    if (ra.agregado_especial === "SI") {
                        icon = "favorite";
                    }
                    if (ra.tipo === "home") {
                        icon = "home";
                        addClass = " listFavAdd listFav_home";
                    } else
                    if (ra.tipo === "work") {
                        icon = "work";
                        addClass = " listFavAdd listFav_work";
                    }
                    var classdataDir = "classdataDir";
                    var dataDir = "";
                    if (ra.nombre !== ra.direccion) {
                        dataDir = "<span class='spanDireccFavir'>" + ra.direccion + "</span>";
                        classdataDir = "";
                    }
                    ra.nombre_clean = ra.nombre;
                    ra.nombre = "<span class='spanNameFavir " + addClass + " " + classdataDir + "'><span class='spanIconFavir'><i class='material-icons'>" + icon + "</i></span>" + nw.utils.tr(ra.nombre) + "</span>" + dataDir + "";
                    d.push(ra);
                }
                self.setModelData(d);
            };
            rpc.exec("populateFavoritos", data, funcs);
        }
    }
});