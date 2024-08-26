qx.Class.define("qxnw.nw_chat.lists.l_salasPorUsuario", {
    extend: qxnw.lists,
    construct: function() {
        var self = this;
        this.base(arguments);
        this.setButtonsAutomatic(true);
        this.createBase();
        
        var columns = [
            {
                label: "ID",
                caption: "id"
            },
            {
                label: "Sala",
                caption: "nom_room"
            },
            {
                label: "Usuario",
                caption: "usuario"
            },
            {
                label: "Nombre",
                caption: "nombre"
            },
            {
                label: "ID Sala",
                caption: "room"
            }];
        this.setColumns(columns);
        var filters = [
            {
                name: "buscar",
                caption: "buscar",
                label: "Filtro...",
                type: "textField"
            }];
        this.createFilters(filters);
        self.ui.newButton.addListener("click", function() {
            self.slotNuevo();
        });
        self.ui.deleteButton.addListener("click", function() { //mensaje de eliminar 
        qxnw.utils.question("¿Está seguro de eliminar el registro?", function(e) {
          if (e){
                self.slotEliminar();
                } else {
                  
                return;
                }
            });
        });
        
        self.ui.editButton.addListener("click", function() {
            self.slotEditar();
        });
        self.ui.unSelectButton.addListener("click", function() {
            self.clearSelection();
        });
        self.ui.selectAllButton.addListener("click", function() {
            self.selectAll();
        });
        self.ui.updateButton.addListener("click", function() {
            self.applyFilters();
        });
        self.ui.searchButton.addListener("execute", function() {
            self.applyFilters();
        });
//        self.hideColumn("id");
//        self.hideColumn("sala");
       
        this.applyFilters();
    },
    destruct: function() {
    },
    members: {
        contextMenu: function contextMenu(pos) {
            var self = this;
            var m = new qxnw.contextmenu(this);
            m.addAction("Editar", "icon/16/actions/document-properties.png", function(e) {
                self.slotEditar();
            });
            m.addAction("Eliminar", "icon/16/actions/edit-delete.png", function(e) {
                qxnw.utils.question("¿Está seguro de eliminar el registro?", function(e) {
                    if (e) {
                        self.slotEliminar();
                    } else {
                        return;
                    }
                });
            });
            m.exec(pos);
        },
        applyFilters: function applyFilters() {
            var self = this;
            var data = {};
            data.filters = self.getFiltersData();
            var rpc = new qxnw.rpc(self.getRpcUrl(), "SalasPorUsuario");
            rpc.setAsync(true);
            var func = function(r) {
                self.setModelData(r);
            }
            rpc.exec("consulta", data, func);
        },
        slotNuevo: function slotNuevo() {
            var self = this;
            var d = new qxnw.nw_chat.forms.f_salasPorUsuario();
            d.settings.accept = function() {
                self.applyFilters();
            }
            d.show();
        },
        slotEditar: function slotEditar() {
            var self = this;
            var r = self.selectedRecord();
            if (r == undefined) {
                qxnw.utils.alert("Seleccione un registro");
                return;
            }
            var d = new qxnw.nw_chat.forms.f_salasPorUsuario();
            if (!d.setParamRecord(r)) {
                return;
            }
            d.settings.accept = function() {
                self.applyFilters();
            }
            d.show();
        },
        slotEliminar: function slotEliminar() {
            var self = this;
            var r = self.selectedRecord();
            if (r == undefined) {
                qxnw.utils.alert("Seleccione un registro");
                return;
            }
            var rpc = new qxnw.rpc(this.rpcUrl, "SalasPorUsuario");
            rpc.exec("eliminar", r);
            if (rpc.isError()) {
                qxnw.utils.alert(rpc.getError());
                return;
            }
        }
    }
})