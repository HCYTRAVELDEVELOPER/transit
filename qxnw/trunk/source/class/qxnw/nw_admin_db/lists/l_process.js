qx.Class.define("qxnw.nw_admin_db.lists.l_process", {
    extend: qxnw.lists,
    construct: function () {
        var self = this;
        this.base(arguments);
        self.setSelectMultiCell(true);
        this.buttonsAutomatic = true;
        this.createBase();
        var columns = [
            {
                label: self.tr("Data ID"),
                caption: "datid"
            },
            {
                label: self.tr("Proceso ID"),
                caption: "procpid"
            },
            {
                label: "Aplicación name",
                caption: "application_name",
                mode: "toolTip"
            },
            {
                label: "Inicio Proceso",
                caption: "backend_start"
            },
            {
                label: "Tiempo Actual Proceso",
                caption: "xact_start"
            },
            {
                label: "Tiempo Transcurrido",
                caption: "time"
            },
            {
                label: "Segundos",
                caption: "seconds"
            },
            {
                label: "Alerta",
                caption: "online",
                type: "image"
            },
            {
                label: "Base Datos",
                caption: "datname"
            },
            {
                label: "User ID",
                caption: "usesysid"
            },
            {
                label: "Usuario",
                caption: "usename"
            },
            {
                label: "Proceso",
                caption: "query",
                mode: "toolTip"
            },
            {
                label: "IP Cliente",
                caption: "client_addr"
            },
            {
                label: "Puerto Cliente",
                caption: "client_port"
            }];
        self.setColumns(columns);
        var filters = [
            {
                name: "tabla",
                label: "Tabla",
                type: "textField",
                visible: false
            },
            {
                name: "host",
                label: "Host",
                type: "textField",
                enabled: false
            },
            {
                name: "driver",
                label: "Driver",
                type: "textField",
                enabled: false
            },
            {
                name: "user_name",
                label: "User",
                type: "textField",
                enabled: false
            },
            {
                name: "password",
                label: "Password",
                type: "textField",
                visible: false
            },
            {
                name: "buscar",
                label: "Buscar ...",
                type: "textField"
            }, ];
        self.createFilters(filters);
        self.setColumns(columns);
        self.table.setRowHeight(25);
        self.spinnerUpdate.setValue(10);
        self.updateCheck.setValue(true);
        self.hideColumn("datid");
        self.ui.newButton.addListener("click", function () {
            self.slotNuevo();
        });
        self.ui.editButton.addListener("click", function () {
            self.slotEditar();
        });
        self.ui.deleteButton.addListener("click", function () {
            self.slotEliminar();
        });
        self.ui.deleteButton.setVisibility("excluded");
        self.ui.unSelectButton.addListener("click", function () {
            self.clearSelection();
        });
        self.ui.selectAllButton.addListener("click", function () {
            self.selectAll();
        });
        self.ui.updateButton.addListener("click", function () {
            self.applyFilters();
        });
        self.ui.searchButton.addListener("execute", function () {
            self.applyFilters();
        });
        self.execSettings();
    },
    destruct: function () {
    },
    members: {
        contextMenu: function contextMenu(pos) {
            var self = this;
            var m = new qxnw.contextmenu(this);
            m.addAction("Eliminar Conexión", "icon/16/actions/dialog-cancel.png", function (e) {
                self.slotDeleteConection();
            });
            m.addAction("Eliminar Proceso", "icon/16/actions/dialog-close.png", function (e) {
                self.slotDeleteConection();
            });
            m.exec(pos);
        },
        applyFilters: function applyFilters() {
            var self = this;
            var data = {};
            data.filters = self.getFiltersData();
            var rpc = new qxnw.rpc(self.getRpcUrl(), "nw_process");
            rpc.setAsync(true);
            var func = function (r) {
                self.setModelData(r);
            };
            rpc.exec("consulta", data, func);
        },
        slotDeleteConection: function slotDeleteConection(data) {
            var self = this;
            var sl = self.selectedRecords();
            var rpc = new qxnw.rpc(self.getRpcUrl(), "nw_process");
            rpc.setAsync(true);
            var func = function (r) {
                self.applyFilters(r);
            };
            rpc.exec("delete_conection", sl, func);
        },
        slotInfoHost: function slotInfoHost(data) {
            var self = this;
            self.ui.host.setValue(data.host).toString();
            self.ui.driver.setValue(data.driver).toString();
            self.ui.user_name.setValue(data.user_name).toString();
            self.ui.password.setValue(data.password).toString();
            self.applyFilters();
        }
    }
});