qx.Class.define("nwsites.forms.f_productos_asociados",
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
                        name: "referencia",
                        label: "Referencia",
                        caption: "referencia",
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
                        visible: false
                    },
                    {
                        name: "orden",
                        label: "Orden",
                        caption: "orden",
                        type: "textField",
                        mode: "numeric",
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
                        required: true
                    },
                    {
                        name: "valor_iva",
                        label: "Valor IVA",
                        type: "textField",
                        mode: "money",
                        required: true
                    },
                    {
                        name: "valor",
                        label: "Valor",
                        type: "textField",
                        mode: "money",
                        required: true,
                        enabled: false
                    }];
                var res = "";

                self.setFields(fields);
                var data = {};
                data.table = "pv_categorias";
                qxnw.utils.populateSelect(self.ui.categoria, "master", "populate", data);

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
                self.navTableProductosAsociados = new qxnw.navtable(self);
                self.navTableProductosAsociados.setTitle("Productos Asociados");
                self.navTableProductosAsociados.setContextMenu("contextMenu");
                self.navTableProductosAsociados.createBase();
                var columns = [
                    {
                        label: "Producto ID",
                        caption: "producto"
                    },
                    {
                        label: "Orden",
                        caption: "orden"
                    },
                    {
                        label: "Nombre Producto",
                        caption: "producto_text"
                    },
                    {
                        label: "Categoria",
                        caption: "categoria_text"
                    },
                    {
                        label: "Categoria",
                        caption: "categoria"
                    },
                    {
                        label: "Opción",
                        caption: "opcion_text"
                    },
                    {
                        label: "Opción",
                        caption: "opcion"
                    },
                    {
                        label: "Valor",
                        caption: "valor"
                    },
                    {
                        label: "Color",
                        caption: "color"
                    },
                    {
                        label: "Tipo ID",
                        caption: "tipo"
                    },
                    {
                        label: "Tipo",
                        caption: "tipo_text"
                    },
                    {
                        label: "Descripción",
                        caption: "descripcion"
                    },
                    {
                        label: "Empresa",
                        caption: "empresa"
                    },
                    {
                        label: "Fecha",
                        caption: "fecha"
                    },
                    {
                        label: "Usuario",
                        caption: "usuario"
                    }
                ];
                self.navTableProductosAsociados.setColumns(columns);
                self.navTableProductosAsociados.hideColumn("tipo_text");
                self.navTableProductosAsociados.hideColumn("tipo");
                self.navTableProductosAsociados.hideColumn("color");
                self.navTableProductosAsociados.hideColumn("categoria");
                self.navTableProductosAsociados.hideColumn("producto");
                self.navTableProductosAsociados.hideColumn("empresa");
                self.navTableProductosAsociados.hideColumn("usuario");
                self.navTableProductosAsociados.hideColumn("fecha");
                self.navTableProductosAsociados.hideColumn("opcion");
                self.navTableProductosAsociados.hideColumn("tipo");
                var agregarButton_1 = self.navTableProductosAsociados.getAddButton();
                self.deleteButton_1 = self.navTableProductosAsociados.getRemoveButton();
                self.deleteButton_1.addListener("click", function() {
                    var r = self.navTableProductosAsociados.selectedRecord();
                    if (r == undefined) {
                        qxnw.utils.information("Seleccione un registro para eliminar");
                        return;
                    }
                    self.navTableProductosAsociados.removeSelectedRow();
                });
                agregarButton_1.addListener("click", function() {
                    var d = new nwsites.forms.f_asociados();
                    var data = self.getRecord();
                    qxnw.utils.populateSelect(d.ui.opcion, "pv_nwsites", "populateOpciones", data.id);
                    d.settings.accept = function() {
                        var r = d.getRecord();
                        self.navTableProductosAsociados.addRows([r]);
                    };
                    d.setModal(true);
                    d.show();
                });
                self.insertNavTable(self.navTableProductosAsociados.getBase(), "Productos Asociados");
                self.setEnabledAll(false);

                self.navTableProductosOpcion = new qxnw.navtable(self);
                self.navTableProductosOpcion.setContextMenu("contextMenuOp");
                self.navTableProductosOpcion.setTitle("Opciones");
                self.navTableProductosOpcion.createBase();
                var columns = [
                    {
                        label: "ID",
                        caption: "id"
                    },
                    {
                        label: "Nombre",
                        caption: "nombre"
                    },
                    {
                        label: "Tipo",
                        caption: "tipo"
                    },
                    {
                        label: "Multiselección",
                        caption: "multiseleccion"
                    },
                    {
                        label: "Producto ID",
                        caption: "producto"
                    },
                    {
                        label: "Producto",
                        caption: "producto_text"
                    },
                    {
                        label: "Requerido",
                        caption: "requerido"
                    },
                    {
                        label: "Descripción",
                        caption: "descripcion"
                    },
                    {
                        label: "Empresa",
                        caption: "empresa"
                    },
                    {
                        label: "Fecha",
                        caption: "fecha"
                    },
                    {
                        label: "Usuario",
                        caption: "usuario"
                    }
                ];
                self.navTableProductosOpcion.setColumns(columns);
                self.navTableProductosOpcion.hideColumn("producto_text");
                self.navTableProductosOpcion.hideColumn("producto");
                self.navTableProductosOpcion.hideColumn("empresa");
                self.navTableProductosOpcion.hideColumn("usuario");
                self.navTableProductosOpcion.hideColumn("fecha");
                self.navTableProductosOpcion.hideColumn("id");
                var agregarButton_1 = self.navTableProductosOpcion.getAddButton();
                self.deleteButton_1 = self.navTableProductosOpcion.getRemoveButton();
                self.deleteButton_1.addListener("click", function() {
                    var r = self.navTableProductosOpcion.selectedRecord();
                    if (r == undefined) {
                        qxnw.utils.information("Seleccione un registro para eliminar");
                        return;
                    }
                    self.navTableProductosOpcion.removeSelectedRow();
                });
                agregarButton_1.addListener("click", function() {
                    var d = new nwsites.forms.f_opciones_productos();
                    d.settings.accept = function() {
                        var r = d.getRecord();
                        self.navTableProductosOpcion.addRows([r]);
                    };
                    d.setModal(true);
                    d.show();
                });
                self.insertNavTable(self.navTableProductosOpcion.getBase(), "Opciones");
            },
            destruct: function() {
            },
            members: {
                pr: null,
                navTableProductosAsociados: null,
                navTableProductosOpcion: null,
                deleteButton: null,
                contextMenu: function contextMenu(pos) {
                    var self = this;
                    //var sl = self.navTable.selectedRecord();
                    var r = self.navTableProductosAsociados.selectedRecord();
                    var m = new qxnw.contextmenu(self);
                    m.addAction("Editar", qxnw.config.execIcon("document-properties"), function(e) {
                        self.slotEditarProductosAsociados();
                    });
                    m.setParentWidget(self.navTableProductosAsociados);
                    m.exec(pos);
                },
                slotEditarProductosAsociados: function slotEditarProductosAsociados() {
                    var self = this;
                    var d = new nwsites.forms.f_asociados();
                    var data = self.getRecord();
                    var r = self.navTableProductosAsociados.selectedRecord();
                    qxnw.utils.populateSelect(d.ui.opcion, "pv_nwsites", "populateOpciones", data.id);
                    if (!d.setParamRecordEditar(r)) {
                        return;
                    }
                    d.settings.accept = function() {
                        self.navTableProductosAsociados.removeSelectedRow();
                        var r = d.getRecord();
                        self.navTableProductosAsociados.addRows([r]);
                    };
                    d.setModal(true);
                    d.show();
                },
                contextMenuOp: function contextMenuOp(pos) {
                    var self = this;
                    //var sl = self.navTable.selectedRecord();
                    var r = self.navTableProductosOpcion.selectedRecord();
                    var m = new qxnw.contextmenu(self);
                    m.addAction("Editar", qxnw.config.execIcon("document-properties"), function(e) {
                        self.slotEditarOpcionesAsociados();
                    });
                    m.setParentWidget(self.navTableProductosOpcion);
                    m.exec(pos);
                },
                slotEditarOpcionesAsociados: function slotEditarOpcionesAsociados() {
                    var self = this;
                    var d = new nwsites.forms.f_opciones_productos();
                    var r = self.navTableProductosOpcion.selectedRecord();
                    if (!d.setParamRecordEditar(r)) {
                        return;
                    }
                    d.settings.accept = function() {
                        self.navTableProductosOpcion.removeSelectedRow();
                        var r = d.getRecord();
                        self.navTableProductosOpcion.addRows([r]);
                    };
                    d.setModal(true);
                    d.show();
                },
                populateProductosAsociados: function populateProductosAsociados(id) {
                    var self = this;
                    var rpc = new qxnw.rpc(self.getRpcUrl(), "pv_nwsites");
                    rpc.setAsync(true);
                    var func = function(pr) {
                        self.navTableProductosAsociados.setModelData(pr);
                    };
                    rpc.exec("populateProductosAsociados", id, func);
                },
                populateProductosOpcion: function populateProductosOpcion(id) {
                    var self = this;
                    var rpc = new qxnw.rpc(self.getRpcUrl(), "pv_nwsites");
                    rpc.setAsync(true);
//                    console.log(id);
                    var func = function(pr) {
                        self.navTableProductosOpcion.setModelData(pr);
                    };
                    rpc.exec("populateProductosOpcion", id, func);
                },
                slotSave: function slotSave() {
                    var self = this;
//                    if (!self.validate()) {
//                        return;
//                    }
                    var data = self.getRecord();
                    data.producto = self.navTableProductosAsociados.getAllData();
                    data.opcion = self.navTableProductosOpcion.getAllData();
                    var rpc = new qxnw.rpc(self.getRpcUrl(), "pv_nwsites");
                    rpc.setAsync(true);
                    var func = function(r) {
                        self.accept();
                    };
                    rpc.exec("saveP", data, func);
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
                    self.populateProductosAsociados(pr);
                    self.populateProductosOpcion(pr);
                    if (pr.destacado == "SI" || pr.destacado == "si") {
                        pr.destacado = "t";
                    } else {
                        pr.destacado = "f";
                    }
                    self.setRecord(pr);
                    var data = self.getRecord();
                    if (qxnw.utils.evalue(pr.proveedor)) {
                        var item = {
                            id: pr.proveedor,
                            nombre: pr.nom_proveedor
                        };
//                        console.log(item);
                        self.ui.proveedor.addToken(item);
                    }
                    return true;
                },
                setParamRecordAdmin: function setParamRecordAdmin(pr) {
                    var self = this;
                    self.populateProductosAsociados(pr.id);
                    self.populateProductosOpcion(pr.id);
                    pr.nombre = pr.nombre;
                    self.setRecord(pr);
                    return true;
                }
            }
        });
