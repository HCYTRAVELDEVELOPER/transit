nw.Class.define("l_navtable_paradas", {
    extend: nw.lists,
    construct: function (canvas, datos, selfparent) {
        var self = this;
        if (nw.evalueData(selfparent)) {
            if (selfparent.debugConstruct) {
                console.log("START:::l_navtable_paradas");
            }
        }
        self.canvas = canvas;
        self.showContextMenu = true;
        var columns = [
            {
                name: "id",
                label: "ID"
//                ,
//                visible: false
            },
            {
                name: "index_arrayParadas",
                label: "index_arrayParadas",
                visible: false
            },
            {
                name: "index_markersParadas",
                label: "index_arrayParadas",
                visible: false
//                
            },
            {
                name: "direccion",
                label: "Dirección"
            },
            {
                name: "nombre_pasajero",
                label: ""
            },
            {
                name: "descripcion_carga",
                label: ""
            },
            {
                name: "latitud",
                label: "Latitud",
                visible: false
            },
            {
                name: "longitud",
                label: "Longitud",
                visible: false
            }
        ];
        self.setColumns(columns);
        if (datos) {
            self.applyFilters(datos.id);
        }
        return self;
    },
    destruct: function () {
    },
    members: {
        clicRow: function clicRow() {
            var self = this;
            var data = self.selectedRecord();
            console.log(data);
            self.contextMenu();
        },
        contextMenu: function contextMenu() {
            var self = this;
            var data = self.selectedRecord();
            var m = new nw.contextmenu(this, "bottom"); //vertical, bottom
            m.addAction("Eliminar", "nwmaker/img/baseline-create-24px.svg", function (e) {
                nw.dialog("¿Esta seguro de eliminar esta parada?", function () {
                    self.deleteParada();
                });
            });
            if (nw.evalueData(data.id)) {
                m.addAction("Editar", "nwmaker/img/baseline-create-24px.svg", function (e) {
                    self.editaParada();
                });
            }
        },
        editaParada: function editaParada() {
            var self = this;
            var data = self.selectedRecord();
            console.log(data);
            var up = nw.userPolicies.getUserData();
            var d = new f_crear_parada();
            self.update_paradas = true;
            d.construct(self);
            d.ui.direccion.setValue(data.direccion);
            d.ui.nombre_pasajero.setValue(data.nombre_pasajero);
            d.ui.descripcion_carga.setValue(data.descripcion_carga);
            d.ui.latitud.setValue(data.latitud_parada);
            d.ui.longitud.setValue(data.longitud_parada);
        },
        updateParada: function updateParada(data) {
            var self = this;
            var det = self.selectedRecord();
            console.log(det);
            var up = nw.userPolicies.getUserData();
            var datos = data;
            datos.empresa = up.empresa;
            datos.perfil = up.perfil;
            datos.usuario = up.usuario;
            datos.id_servicio = det.id_servicio;
            datos.id = det.id;
            var rpc = new nw.rpc(self.getRpcUrl(), "servicios");
            rpc.setAsync(true);
            rpc.setLoading(false);
            var func = function (ra) {
                self.applyFilters(data.id_servicio);
                nw.dialog("Parada  modificada correctamente.");
            };
            rpc.exec("actualizaParada", datos, func);
        },
        deleteParada: function deleteParada() {
            var self = this;
            var data = self.selectedRecord();
            console.log("deleteParada:::data", data);
            if (!nw.evalueData(data.id)) {

                console.log("main.selfCrearViaje.arrayParadas", main.selfCrearViaje.arrayParadas);
                console.log("main.selfCrearViaje.markersParadas", main.selfCrearViaje.markersParadas);
                if (data.index_arrayParadas !== "") {
                    main.selfCrearViaje.arrayParadas.pop(data.index_arrayParadas);
                }
                if (data.index_markersParadas !== "") {
                    main.selfCrearViaje.markersParadas.pop(data.index_markersParadas);
                    nwgeo.removeMarker(main.selfCrearViaje.markersParadas[data.index_markersParadas]);
                }
                console.log("main.selfCrearViaje.arrayParadas", main.selfCrearViaje.arrayParadas);
                console.log("main.selfCrearViaje.markersParadas", main.selfCrearViaje.markersParadas);

                self.removeRow(self.activeRow);
                main.selfCrearViaje.continuar();
                return false;
            }
            var up = nw.userPolicies.getUserData();
            var datos = data;
            datos.empresa = up.empresa;
            datos.perfil = up.perfil;
            datos.usuario = up.usuario;
            var rpc = new nw.rpc(self.getRpcUrl(), "servicios");
            rpc.setAsync(true);
            rpc.setLoading(false);
            var func = function (ra) {
                self.applyFilters(data.id_servicio);
                nw.dialog("Parada eliminada correctamente.");
            };
            rpc.exec("eliminaParada", datos, func);
        },
        applyFilters: function applyFilters(id_enc) {
            nw.loading();
            var self = this;
            var up = nw.userPolicies.getUserData();
            var data = {};
            data.id_service = id_enc;
            data.empresa = up.empresa;
            var rpc = new nw.rpc(self.getRpcUrl(), "app_user");
            rpc.setAsync(true);
            rpc.setLoading(false);
            var func = function (r) {
                console.log(r);
                nw.loadingRemove({"container": self.canvas});
                self.setModelData(r);
            };
            rpc.exec("paradasAdicionalesUserApp", data, func);
        }
    }
});