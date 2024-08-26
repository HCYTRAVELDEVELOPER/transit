qx.Class.define("nwsites.forms.f_sitios",
        {
            extend: qxnw.forms,
            construct: function()
            {
                var self = this;
                this.base(arguments);
                this.setTitle("Agregar Terminal");
                this.createBase();
                var fields = [
                    {
                        name: "id",
                        label: "ID",
                        caption: "id",
                        type: "textField",
                        visible: true,
                        enabled: false
                    },
                    {
                        name: "nombre",
                        label: "Nombre",
                        caption: "nombre",
                        type: "textField",
                        required: true
                    },
                    {
                        name: "piso",
                        label: "Piso",
                        type: "textField",
                        required: true
                    },
                    {
                        name: "id_map_enc",
                        label: "Mapa",
                        type: "selectBox"
                    },
                    {
                        name: "direccion",
                        label: "Direccion",
                        caption: "direccion",
                        type: "textField",
                        required: true
                    },
                    {
                        name: "telefono",
                        label: "Teléfono",
                        type: "textField",
                        required: true
                    },
                    {
                        name: "correo",
                        label: "Correo",
                        type: "textField",
                        required: true
                    },
                    {
                        name: "url",
                        label: "Url",
                        type: "textField",
                        required: true
                    },
                    {
                        name: "categoria",
                        label: "Categoria",
                        type: "selectBox",
                        required: true
                    },
                    {
                        name: "active",
                        label: "¿Activo?",
                        type: "selectBox",
                        required: true
                    },
                    {
                        name: "descripcion_corta",
                        label: "Descripción Corta",
                        type: "textField"
                    },
                    {
                        name: "tags",
                        label: "Tags (Palabras Clave)",
                        type: "textField"
                    },
                    {
                        name: "imagen_logo",
                        label: "Imagen Logo",
                        type: "uploader",
                        mode: "rename_random",
                        required: true
                    },
                    {
                        name: "productImage",
                        label: "Imagen de Portada",
                        type: "uploader",
                        mode: "rename_random"
                    }
                ];
                this.setFields(fields);
                var data = {};
                data["0"] = "Ninguna";
                qxnw.utils.populateSelectFromArray(self.ui.id_map_enc, data);
                data = {};
                qxnw.utils.populateSelect(self.ui.categoria, "nwsites", "consulta_categorias", data);
                data = {};
                data.table = "nc_maps_config";
                qxnw.utils.populateSelect(self.ui.id_map_enc, "master", "populate", data);
                data = {};
                data["1"] = "SI";
                data["0"] = "NO";
                qxnw.utils.populateSelectFromArray(self.ui.active, data);
                
                self.ui.accept.addListener("execute", function() {
                    self.slotSave();
                });
                self.ui.cancel.addListener("execute", function() {
                    self.reject();
                });
            },
            destruct: function() {
            },
            members:
                    {
                        pr: null,
                        slotSave: function slotSave() {
                            var self = this;
                            if (!self.validate()) {
                                return;
                            }
                            var data = this.getRecord();
                            var rpc = new qxnw.rpc(this.rpcUrl, "nwsites");
                            rpc.exec("save", data);
                            if (rpc.isError()) {
                                qxnw.utils.error(rpc.getError(), self);
                                return;
                            }
                            self.accept();
                        },
                        setParamRecord: function setParamRecord(pr) {
                            var self = this;
                            self.setRecord(pr);
                            self.ui.id.setValue(pr.productID);
                            return true;
                        }
                    }
        });
