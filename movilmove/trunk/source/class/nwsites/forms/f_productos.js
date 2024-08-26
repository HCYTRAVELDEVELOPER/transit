qx.Class.define("nwsites.forms.f_productos",
        {
            extend: qxnw.forms,
            construct: function()
            {
                var self = this;
                this.base(arguments);
                this.setTitle("Agregar Producto");
                this.setColumnsFormNumber(0);
                this.createBase();
                var fields = [
                    {
                        name: "Datos Principales",
                        type: "startGroup",
                        icon: "",
                        mode: "horizontal"
                    },
                    {
                        name: "id",
                        label: "ID",
                        type: "textField",
                        visible: false
                    },
                    {
                        name: "empresa_cliente",
                        label: "Tienda Cliente",
                        type: "selectBox",
                        required: true
                    },
                    {
                        name: "proveedor",
                        label: "Proveedor",
                        type: "selectTokenField",
                        required: true
                    },
                    {
                        name: "nombre",
                        label: "Nombre Producto",
                        caption: "nombre",
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
                        name: "",
                        type: "endGroup"
                    },
                    {
                        name: "Configuración Producto",
                        type: "startGroup",
                        icon: "",
                        mode: "horizontal"
                    },
                    {
                        name: "puntaje",
                        label: "Puntaje",
                        caption: "puntaje",
                        type: "textField",
                        mode: "numeric",
                        visible: false
                    },
                    {
                        name: "destacado",
                        label: "Destacado",
                        caption: "destacado",
                        type: "checkBox",
                        mode: "upperCase",
                        visible: false
                    },
//                    {
//                        name: "mostrar_producto",
//                        label: "Mostrar producto",
//                        caption: "mostrar_producto",
//                        type: "checkBox",
//                        visible: false
//                    },
                    {
                        name: "orden",
                        label: "Orden",
                        type: "textField",
                        mode: "numeric",
                        required: true
                    },
                    {
                        name: "mostrar_producto",
                        label: "Publicar?",
                        type: "selectBox",
                        required: true
                    },
                    {
                        name: "integrado",
                        label: "Contiene Productos Relacionados?",
                        type: "selectBox",
                        required: true
                    },
                    {
                        name: "",
                        type: "endGroup"
                    },
                    {
                        name: "Informacion del Producto",
                        type: "startGroup",
                        icon: "",
                        mode: "horizontal"
                    },
                    {
                        name: "foto",
                        label: "Imagen",
                        caption: "foto",
                        type: "uploader",
                        mode: "rename"
                    },
                    {
                        name: "precio_costo",
                        label: "Precio Costo",
                        caption: "precio_costo",
                        type: "textField",
                        mode: "money",
                        required: true
                    },
                    {
                        name: "precio",
                        label: "Precio Venta",
                        caption: "precio",
                        type: "textField",
                        mode: "money",
                        required: true
                    },
                    {
                        name: "iva",
                        label: "IVA %",
                        type: "textField",
                        visible: false
                    },
                    {
                        name: "valor_iva",
                        label: "Valor IVA",
                        type: "textField",
                        mode: "money",
                        visible: false
                    },
                    {
                        name: "valor",
                        label: "Valor",
                        type: "textField",
                        mode: "money"
                    },
                    {
                        name: "descripcion_corta",
                        label: "Descripción Corta",
                        type: "textArea"
                    },
                    {
                        name: "",
                        type: "endGroup"
                    },
                    {
                        name: "Descripción",
                        type: "startGroup",
                        icon: "",
                        mode: "vertical"
                    },
                    {
                        name: "descripcion",
                        label: "Descripción",
                        type: "textArea",
                        required: true
                    },
                    {
                        name: "",
                        type: "endGroup"
                    }
                ];
                this.setFields(fields);
                var data = {};
                data.table = "pv_categorias";
                qxnw.utils.populateSelect(self.ui.categoria, "master", "populate", data);
                data = {};
                data.table = "pv_empresas_clientes";
                qxnw.utils.populateSelect(self.ui.empresa_cliente, "master", "populate", data);
                var data = {};
                data["SI"] = "SI";
                data["NO"] = "NO";
                qxnw.utils.populateSelectFromArray(self.ui.mostrar_producto, data);
                var data = {};
                data["NO"] = "NO";
                data["SI"] = "SI";
                qxnw.utils.populateSelectFromArray(self.ui.integrado, data);
                self.ui.proveedor.addListener("loadData", function(e) {
                    var data = {};
                    data["token"] = e.getData();
                    var rpc = new qxnw.rpc(self.getRpcUrl(), "pv_nwsites");
                    rpc.setAsync(true);
                    var func = function(r) {
                        self.ui.proveedor.setModelData(r);
                    };
                    rpc.exec("populateTokenProveedor", data, func);
                }, this);
                self.ui.accept.addListener("click", function() {
                    self.slotSave();
                });
                self.ui.cancel.addListener("click", function() {
                    self.reject();
                });
                self.ui.iva.addListener("focusout", function() {
                    var data = self.getRecord();
                    if (data.iva == 0) {
                        self.ui.valor.setValue(data.precio.toString());
                        self.ui.valor_iva.setValue(data.precio.toString());
                    } else {
                        var valor = parseFloat(data.precio) * parseFloat(data.iva) / 100;
                        self.ui.valor_iva.setValue(valor);
                        var valor_total = parseFloat(data.precio) + parseFloat(valor);
                        self.ui.valor.setValue(valor_total);
                    }
                });
            },
            destruct: function() {
            },
            members: {
                navTableFormulario: null,
                navTableDescrip: null,
                pr: null,
                slotSave: function slotSave() {
                    var self = this;
                    if (!self.validate()) {
                        return;
                    }
                    var data = self.getRecord();
//                    console.log(data);
                    var rpc = new qxnw.rpc(self.getRpcUrl(), "pv_nwsites");
                    rpc.setAsync(true);
                    var func = function(r) {
                        self.accept();
                    };
                    rpc.exec("saveProductosNwsites", data, func);
                },
                populateNavTable: function populateNavTable(id) {
                    if (id == null) {
                        id = 0;
                        return;
                    }
                    var self = this;
                    var rpc = new qxnw.rpc(self.getRpcUrl(), "pv_nwsites");
                    rpc.setAsync(true);
                    var func = function(r) {
                        self.navTableFormulario.setModelData(r);
                    };
                    rpc.exec("populateTipos", id, func);
                },
                setParamRecord: function setParamRecord(pr) {
                    var self = this;
                    if (pr.destacado == "SI" || pr.destacado == "si") {
                        pr.destacado = "t";
                    } else {
                        pr.destacado = "f";
                    }
//                    if (pr.mostrar_producto == "SI" || pr.mostrar_producto == "si") {
//                        pr.mostrar_producto = "t";
//                    } else {
//                        pr.mostrar_producto = "f";
//                    }
                    self.setRecord(pr);
//                    var data = self.getRecord();
                    if (qxnw.utils.evalue(pr.proveedor)) {
                        var item = {
                            id: pr.proveedor,
                            nombre: pr.nom_proveedor
                        };
                        self.ui.proveedor.addToken(item);
                    }
                    return true;
                }
            }
        });
