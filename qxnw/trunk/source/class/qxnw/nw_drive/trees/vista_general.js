qx.Class.define("qxnw.nw_drive.trees.vista_general", {
    extend: qxnw.treeWidget,
    construct: function () {
        this.base(arguments);
        var self = this;
//        var hash = "" + window.location.hash;
//        alert(hash);
        qxnw.utils.loadCss("/nwlib" + qxnw.userPolicies.getNwlibVersion() + "/css/nwdrive.css");
                
        self.idCarpet = 1;
        self.idCarpetAfter = 0;
        self.placeHolder = "Escritorio";
        self.placeHolderAdd = "";
        self.placeHolderLeft = "";
        localStorage["init"] = "0";
        var up = qxnw.userPolicies.getUserData();
        var selectionContainer = new qx.ui.container.Composite(new qx.ui.layout.HBox());
        self.atras = new qx.ui.form.Button();
        self.atras.setIcon(qxnw.config.execIcon("go-previous"));
        self.adelante = new qx.ui.form.Button().set({
            show: "icon"
        });
        self.adelante.setIcon(qxnw.config.execIcon("go-next"));
        self.ruta = new qx.ui.form.TextField("");
        self.ruta.setPlaceholder(self.placeHolder);
        self.cuadros = new qx.ui.form.Button("Cuadros");
        self.actualizar = new qx.ui.form.Button("Actualizar");
        self.cuadros.setIcon(qxnw.config.execIcon("format-justify-left"));
        self.lista = new qx.ui.form.Button("Lista");
        self.lista.setIcon(qxnw.config.execIcon("view-restore", "actions"));
        self.buscar = new qx.ui.form.Button();
        self.buscar.setIcon(qxnw.config.execIcon("system-search", "actions"));
        self.subir = new qx.ui.form.Button("Subir Archivos");
        self.subir.setIcon(qxnw.config.execIcon("document-save", "actions"));
        self.newCarpeta = new qx.ui.form.Button("Nueva Carpeta");
        self.newCarpeta.setIcon(qxnw.config.execIcon("folder-new", "actions"));
        self.configuracion = new qx.ui.form.Button();
        self.configuracion.setIcon(qxnw.config.execIcon("system", "categories"));
        self.atras.setEnabled(false);
        selectionContainer.add(self.atras);
        selectionContainer.add(self.adelante);
        selectionContainer.add(self.ruta, {
            flex: 1
        });
        selectionContainer.add(self.buscar);
        selectionContainer.add(self.subir);
        selectionContainer.add(self.newCarpeta);
        selectionContainer.add(self.actualizar);
        selectionContainer.add(self.cuadros);
        selectionContainer.add(self.lista);
        selectionContainer.add(self.configuracion);
        self.containerFilters.add(selectionContainer, {
            flex: 1
        });


        self.atras.addListener("click", function () {
            self.containerTest.removeAll();
            localStorage["init"]--;
            var num = localStorage["init"];
            self.loadCarpet(localStorage[num]);

            var nuevasrutas = "";
            if (self.placeHolderLeft != "") {
                nuevasrutas = self.placeHolderAdd;
            } else {
                var mystr = self.placeHolderAdd;
                var myarr = mystr.split("/");
                for (var i = 0; i < myarr.length; i++) {
                    var number = i + 1;
                    if (number != myarr.length) {
                        if (myarr[i] != "") {
                            nuevasrutas += "/" + myarr[i];
                        }
                    }
                }
                self.placeHolderAdd = nuevasrutas;
            }
            self.placeHolderLeft = "";
            self.ruta.setPlaceholder(self.placeHolder + nuevasrutas);
            if (localStorage["init"] == 0) {
                self.atras.setEnabled(false);
                return;
            }
        });


        self.newCarpeta.addListener("click", function () {
            var num = localStorage["init"];
            self.newCarpet(localStorage[num], localStorage["valueCompartir" + num]);
        });
        self.subir.addListener("click", function () {
            var num = localStorage["init"];
            self.uploadFile(localStorage[num], localStorage["valueCompartir" + num]);
        });
        self.actualizar.addListener("click", function () {
            self.containerTest.removeAll();
            var num = localStorage["init"];
            self.loadCarpet(localStorage[num]);
            self.populateTree();
        });
        self.buscar.addListener("click", function () {
            self.containerTest.removeAll();
            var data = self.ruta.getValue();
            var num = localStorage["init"];
            self.loadCarpet(localStorage[num], data);
        });

        self.populateTree();
//        self.createSecondLayer();
    },
    destruct
            : function destruct() {
            },
    members: {
        vista_general: null,
        map: null,
        page: null,
        pages: null,
        items: null,
        containerTest: null,
        placeHolder: null,
        idParamRecord: null,
        placeHolderAdd: "",
        placeHolderLeft: "",
        idCarpet: 1,
        tiquet_captura: null,
        avances: null,
        up: null,
        imp: null,
        navTableAdjuntos: null,
        createWindow: function createWindow(pr) {
            var self = this;
            if (pr != undefined) {
                self.idParamRecord = pr;
            }
            self.page = new qxnw.forms();
            self.containerTest = new qx.ui.container.Composite(new qx.ui.layout.Flow());
            if (self.idParamRecord != null) {
                self.loadCarpet(self.idParamRecord);
            } else {
                self.loadCarpet();
            }
            self.page.addWidget(self.containerTest);
            self.addSubWindow("Carpeta", self.page);
        },
        loadCarpet: function loadCarpet(actual, buscar, usuario, compartido) {
            var self = this;
            var rpc = new qxnw.rpc(self.getRpcUrl(), "nw_drive");
            rpc.setAsync(true);
            var data = {};
            data["carpeta"] = "0";
            data["buscar"] = 0;
            data["compartido"] = 0;
            data["usuario"] = 0;
            if (buscar != undefined) {
                data["buscar"] = buscar;
            }
            if (buscar != 0) {
                data["buscar"] = buscar;
            }
            if (buscar != "") {
                data["buscar"] = buscar;
            }
            if (actual != undefined) {
                data["carpeta"] = actual;
            }
            if (actual != 0) {
                data["carpeta"] = actual;
            }
            if (usuario != undefined) {
                data["usuario"] = usuario;
            }
            if (usuario != 0) {
                data["usuario"] = usuario;
            }
            if (usuario != "") {
                data["usuario"] = usuario;
            } else {
                data["usuario"] = 0;
            }
            if (compartido != undefined) {
                data["compartido"] = compartido;
            } else
            if (compartido != 0) {
                data["compartido"] = compartido;
            } else
            if (compartido != "") {
                data["compartido"] = compartido;
            } else {
                data["compartido"] = 0;
            }
            var autorizado = "";
            var func = function (r) {
                for (var i = 0; i < r.length; i++) {
                    var up = qxnw.userPolicies.getUserData()["code"];
                    if (data["compartido"] == "SI" && r[i].compartir_value == "CON_ALGUNOS") {
                        autorizado = "NO";
                        var rpcPermisions = new qxnw.rpc(self.getRpcUrl(), "nw_drive");
                        var rPermisos = rpcPermisions.exec("consultaUsuariosPermisos", r[i].id);
                        for (var iii = 0; iii < rPermisos.length; iii++) {
                            if (rPermisos[iii].usuario_asociado == up) {
                                autorizado = "SI";
                            }
                        }
                    } else {
                        autorizado = "SI";
                    }
                    if (autorizado == "SI") {
                        var containerCarpet = new qx.ui.container.Composite(new qx.ui.layout.VBox()).set({
                            maxHeight: 100,
                            minHeight: 100,
                            minWidth: 100,
                            maxWidth: 100
                        });
                        var icon = "";
                        if (r[i].compartir == "SI") {
                            icon = "folder-remote";
                        } else
                        if (r[i].compartir == "CON_ALGUNOS") {
                            icon = "folder-remote";
                        } else {
                            icon = "folder";
                        }
                        var img = new qx.ui.basic.Image(qxnw.config.execIcon(icon, "places", 32));
                        containerCarpet.setUserData("id", r[i].id);
                        containerCarpet.setUserData("text", r[i].nombre);
                        containerCarpet.setUserData("buscar", buscar);
                        containerCarpet.setUserData("usuario", usuario);
                        containerCarpet.setUserData("compartido", compartido);
                        containerCarpet.setUserData("valueCompartir", r[i].compartir);
                        containerCarpet.setUserData("tipo", "folder");
                        containerCarpet.setUserData("archivo", "0");
                        containerCarpet.setContextMenu(self.getContextMenuFiles(containerCarpet));
                        img.set({
                            maxHeight: 50,
                            minHeight: 50,
                            minWidth: 100,
                            maxWidth: 100
                        });
                        var label = new qx.ui.basic.Label(r[i].nombre);
                        containerCarpet.add(img);
                        containerCarpet.add(label);
                        self.containerTest.add(containerCarpet);
                        containerCarpet.addListener("appear", function () {
                            qx.bom.element.Class.add(this.getContentElement().getDomElement(), "qxnw_file_block");
                        });
                        img.addListener("appear", function () {
                            qx.bom.element.Class.add(this.getContentElement().getDomElement(), "qxnw_buttonCarpet");
                        });
                        label.addListener("appear", function () {
                            qx.bom.element.Class.add(this.getContentElement().getDomElement(), "qxnw_buttonCarpetLabel");
                        });
                        if (r[i].compartir == "SI") {
                            compartido = 0;
                        }
                        containerCarpet.addListener("click", function () {
                            var id = this.getUserData("id");
                            var text = this.getUserData("text");
                            var valueCompartir = this.getUserData("valueCompartir");
                            localStorage["init"]++;
                            var num = localStorage["init"];
                            localStorage[num] = id;
                            localStorage["carpet" + num] = text;
                            localStorage["valueCompartir" + num] = valueCompartir;
                            self.placeHolderAdd += "/" + localStorage["carpet" + num];
                            self.ruta.setPlaceholder(self.placeHolder + self.placeHolderAdd);
                            self.placeHolderLeft = "";
                            self.containerTest.removeAll();
                            self.loadCarpet(id, buscar, usuario, compartido);
                            self.atras.setEnabled(true);
                        });
                    }
                }
            };
            rpc.exec("consulta_tree", data, func);
            self.loadFiles(data, compartido, buscar);
        },
        loadFiles: function loadFiles(pr, compartido) {
            var self = this;
            var data = "";
            data["compartirdo"] = compartido;
            if (pr != undefined) {
                data = pr;
            }
            if (pr != 0) {
                data = pr;
            }
            var rpc = new qxnw.rpc(self.getRpcUrl(), "nw_drive");
            rpc.setAsync(true);
            var func = function (r) {
                console.log(r);
                for (var i = 0; i < r.length; i++) {
                    var containerFile = new qx.ui.container.Composite(new qx.ui.layout.VBox()).set({
                        maxHeight: 100,
                        minHeight: 100,
                        minWidth: 100,
                        maxWidth: 100
                    });
                    var imgIcon = "";
                    if (r[i].extension == "jpg" || r[i].extension == "png" || r[i].extension == "gif") {
                        imgIcon = "/nwlib" + qxnw.userPolicies.getNwlibVersion() + "/includes/phpthumb/phpThumb.php?src=" + r[i].ruta + "&w=70&q=" + qxnw.config.getPhpThumbQuality();
                    } else
                    if (r[i].extension == "pdf") {
//                         imgIcon = qxnw.config.execIcon("pdf", "qxnw", 32);
                        imgIcon = "/nwlib" + qxnw.userPolicies.getNwlibVersion() + "/icons/64/pdf.png";
                    } else
                    if (r[i].extension == "mp3" || r[i].extension == "ogg") {
                        imgIcon = qxnw.config.execIcon("media-audio", "mimetypes", 32);
                    } else
                    if (r[i].extension == "html") {
                        imgIcon = qxnw.config.execIcon("text-html", "mimetypes", 32);
                    } else
                    if (r[i].extension == "txt") {
                        imgIcon = qxnw.config.execIcon("text-plain", "mimetypes", 32);
                    } else
                    if (r[i].extension == "sql") {
//                         imgIcon = qxnw.config.execIcon("texto_sql", "qxnw", 32);
                        imgIcon = "/nwlib" + qxnw.userPolicies.getNwlibVersion() + "/icons/48/texto_sql.png";
                    } else
                    if (r[i].extension == "js") {
//                         imgIcon = qxnw.config.execIcon("javascript", "qxnw", 32);
                        imgIcon = "/nwlib" + qxnw.userPolicies.getNwlibVersion() + "/icons/48/javascript.png";
                    } else
                    if (r[i].extension == "php") {
//                         imgIcon = qxnw.config.execIcon("php", "qxnw", 32);
                        imgIcon = "/nwlib" + qxnw.userPolicies.getNwlibVersion() + "/icons/48/php.png";
                    } else
                    if (r[i].extension == "zip" || r[i].extension == "rar" || r[i].extension == "tar" || r[i].extension == "exe" || r[i].extension == "tgz" || r[i].extension == "deb" || r[i].extension == "gz") {
                        imgIcon = qxnw.config.execIcon("zip", "qxnw", 32);
                        imgIcon = "/nwlib" + qxnw.userPolicies.getNwlibVersion() + "/icons/48/zip.png";
                    } else
                    if (r[i].extension == "pps" || r[i].extension == "ppt" || r[i].extension == "pptx") {
//                         imgIcon = qxnw.config.execIcon("PowerPoint-icon", "qxnw", 32);
                        imgIcon = "/nwlib" + qxnw.userPolicies.getNwlibVersion() + "/icons/48/PowerPoint-icon.png";
                    } else
                    if (r[i].extension == "xls" || r[i].extension == "xml" || r[i].extension == "xla" || r[i].extension == "xlsx" || r[i].extension == "xlsb" || r[i].extension == "xlsm" || r[i].extension == "xltx" || r[i].extension == "xltm" || r[i].extension == "xlam" || r[i].extension == "ods") {
//                        imgIcon = qxnw.config.execIcon("excel", "qxnw", 32);
                        imgIcon = "/nwlib" + qxnw.userPolicies.getNwlibVersion() + "/icons/48/excel.png";
                    } else
                    if (r[i].extension == "doc" || r[i].extension == "docx" || r[i].extension == "docm" || r[i].extension == "dotx" || r[i].extension == "dotm" || r[i].extension == "odt") {
//                         imgIcon = qxnw.config.execIcon("word", "qxnw", 32);
                        imgIcon = "/nwlib" + qxnw.userPolicies.getNwlibVersion() + "/icons/64/word.png";
                    } else
                    {
                        imgIcon = qxnw.config.execIcon("text-plain", "mimetypes", 32);
                    }
                    var img = new qx.ui.basic.Image(imgIcon);
                    containerFile.setUserData("id", r[i].id);
                    containerFile.setUserData("ext", r[i].extension);
                    containerFile.setUserData("buscar", pr.buscar);
                    containerFile.setUserData("usuario", pr.usuario);
                    containerFile.setUserData("compartido", pr.compartido);
                    containerFile.setUserData("tipo", "file");
                    containerFile.setUserData("archivo", r[i].ruta);
                    containerFile.setContextMenu(self.getContextMenuFiles(containerFile));
                    img.set({
                        maxHeight: 50,
                        minHeight: 50,
                        minWidth: 100,
                        maxWidth: 100
                    });
                    var label = new qx.ui.basic.Label(r[i].nombre);
                    containerFile.add(img);
                    containerFile.add(label);
                    self.containerTest.add(containerFile);
                    containerFile.addListener("appear", function () {
                        qx.bom.element.Class.add(this.getContentElement().getDomElement(), "qxnw_file_block");
                    });
                    img.addListener("appear", function () {
                        qx.bom.element.Class.add(this.getContentElement().getDomElement(), "qxnw_buttonCarpet");
                    });
                    label.addListener("appear", function () {
                        qx.bom.element.Class.add(this.getContentElement().getDomElement(), "qxnw_buttonCarpetLabel");
                    });
                    containerFile.addListener("click", function () {
                        var id = this.getUserData("id");
                        var arch = this.getUserData("archivo");
                        self.openFile(arch);
                    });
                }
            };
            rpc.exec("consulta_treeFiles", data, func);
        },
        loadRed: function loadRed() {
            var self = this;
            self.containerTest.removeAll();
            self.ruta.setPlaceholder("Red");
            self.placeHolderLeft = "";
            var rpc = new qxnw.rpc(self.getRpcUrl(), "nw_drive");
            rpc.setAsync(true);
            var data = {};
            var func = function (r) {
                for (var i = 0; i < r.length; i++) {
                    var containerCarpet = new qx.ui.container.Composite(new qx.ui.layout.VBox()).set({
                        maxHeight: 100,
                        minHeight: 100,
                        minWidth: 100,
                        maxWidth: 100
                    });
                    var img = new qx.ui.basic.Image(qxnw.config.execIcon("network-server", "places", 32));
                    containerCarpet.setUserData("user", r[i].usuario);
                    img.set({
                        maxHeight: 50,
                        minHeight: 50,
                        minWidth: 100,
                        maxWidth: 100
                    });
                    var label = new qx.ui.basic.Label(r[i].usuario);
                    containerCarpet.add(img);
                    containerCarpet.add(label);
                    self.containerTest.add(containerCarpet);
                    containerCarpet.addListener("appear", function () {
                        qx.bom.element.Class.add(this.getContentElement().getDomElement(), "qxnw_file_block");
                    });
                    img.addListener("appear", function () {
                        qx.bom.element.Class.add(this.getContentElement().getDomElement(), "qxnw_buttonCarpet");
                    });
                    label.addListener("appear", function () {
                        qx.bom.element.Class.add(this.getContentElement().getDomElement(), "qxnw_buttonCarpetLabel");
                    });
                    containerCarpet.addListener("click", function () {
                        var user = this.getUserData("user");
                        self.ruta.setPlaceholder(self.placeHolder + "/Red");
                        self.placeHolderLeft = "";
                        self.containerTest.removeAll();
                        self.loadCarpet("", "", user, "SI");
                        self.atras.setEnabled(true);
                    });
                }
            };
            rpc.exec("consulta_red", data, func);
        },
        newCarpet: function newCarpet(pr, compartir) {
            var self = this;
            var d = new qxnw.forms();
            var fields = [
                {
                    name: "id",
                    label: "ID",
                    type: "textField",
                    visible: false
                },
                {
                    name: "asociado",
                    label: "Carpeta Asociada ",
                    type: "textField",
                    visible: false
                },
                {
                    name: "compartir",
                    label: "Compartir",
                    type: "textField",
                    enabled: false
                },
                {
                    name: "nombre",
                    label: "Nombre",
                    type: "textField"
                }
            ];
            d.setFields(fields);
            var asoc = "";
            if (pr == undefined) {
                asoc = "0";
            } else {
                asoc = pr;
            }
            var shared = "";
            if (compartir == "SI") {
                shared = "SI";
            } else {
                shared = "NO";
            }
            d.ui.asociado.setValue(asoc);
            d.ui.compartir.setValue(shared);
            d.ui.accept.addListener("execute", function () {
                var r = d.getRecord();
                var funct = function () {
                    d.close();
                    self.containerTest.removeAll();
                    self.loadCarpet(pr);
                    self.populateTree();
                };
                qxnw.utils.fastRpcAsyncCall("nw_drive", "save", r, funct);
            });
            d.ui.cancel.addListener("execute", function () {
                d.reject();
            });
            d.setWidth(400);
            d.setHeight(200);
            d.setModal(true);
            d.show();
        },
        sharedCarpet: function sharedCarpet(id) {
            var self = this;
            var d = new qxnw.forms();
            d.setTitle("Crear - Editar Cuenta de Cobro");
            d.addHeaderNote(self.tr("<div style='font-size: 12px;'><h2>Compartición de Carpetas</h2></div>"));
            d.setColumnsFormNumber(2);
            var fields = [
                {
                    name: "id",
                    label: "ID",
                    type: "textField",
                    visible: false
                },
                {
                    name: "compartir",
                    label: "Compartir esta carpeta",
                    type: "selectBox"
                }
            ];
            d.setFields(fields);
            d.ui.id.setValue(id.toString());
            var data = {};
            data = {"NO": "No compartir", "SI": "Compartida con todos", "CON_ALGUNOS": "Compartida con algunos usuarios"};
            qxnw.utils.populateSelectFromArray(d.ui.compartir, data);
            d.ui.accept.addListener("execute", function () {
                var r = d.getRecord();
                r.usuarios = d.navTable.getAllData();
                var funct = function () {
                    d.close();
                };
                qxnw.utils.fastRpcAsyncCall("nw_drive", "savePermisos", r, funct);
            });
            d.ui.cancel.addListener("execute", function () {
                d.reject();
            });
            ////AGREGA OTRA TABLA EN EL FORM
            d.navTable = new qxnw.navtable(d);
            d.navTable.setTitle("Productos");
            d.navTable.createBase();
            var columns = [
                {
                    label: "id",
                    caption: "id"
                },
                {
                    label: "ID Asociado",
                    caption: "asociado"
                },
                {
                    label: "Usuario ID",
                    caption: "usuario"
                },
                {
                    label: "Usuario",
                    caption: "usuario_text"
                },
                {
                    label: "Consultar",
                    caption: "consultar"
                },
                {
                    label: "Crear",
                    caption: "crear"
                },
                {
                    label: "Editar",
                    caption: "editar"
                },
                {
                    label: "Eliminar",
                    caption: "eliminar"
                }
            ];
            d.navTable.setColumns(columns);
            d.navTable.hideColumn("id");
            d.navTable.hideColumn("asociado");
            d.navTable.hideColumn("usuario");
            var agregarButton = d.navTable.getAddButton();
            d.__removeButton = d.navTable.getRemoveButton();
            agregarButton.addListener("click", function () {
                var dd = new qxnw.forms();
                dd.setTitle("Agregar Usuarios");
                dd.addHeaderNote(self.tr("<div style='font-size: 12px;'><h2>Agregar Usuario</h2></div>"));
                dd.setColumnsFormNumber(2);
                var fields = [
                    {
                        name: "id",
                        label: "ID",
                        type: "textField",
                        visible: false
                    },
                    {
                        name: "asociado",
                        label: "ID Asociado",
                        type: "textField",
                        visible: false
                    },
                    {
                        name: "usuario",
                        label: "Usuario",
                        type: "selectBox"
                    },
                    {
                        name: "consultar",
                        label: "Consultar",
                        type: "selectBox"
                    },
                    {
                        name: "editar",
                        label: "Editar",
                        type: "selectBox"
                    },
                    {
                        name: "crear",
                        label: "Crear",
                        type: "selectBox"
                    },
                    {
                        name: "eliminar",
                        label: "Eliminar",
                        type: "selectBox"
                    }
                ];
                dd.setFields(fields);
                dd.ui.asociado.setValue(id.toString());
                var data = {};
                data = {"NO": "NO", "SI": "SI"};
                qxnw.utils.populateSelectFromArray(dd.ui.consultar, data);
                qxnw.utils.populateSelectFromArray(dd.ui.editar, data);
                qxnw.utils.populateSelectFromArray(dd.ui.crear, data);
                qxnw.utils.populateSelectFromArray(dd.ui.eliminar, data);
                var datau = {};
                datau["Ninguno"] = "Ninguno";
                qxnw.utils.populateSelectFromArray(dd.ui.usuario, datau);
                datau.table = "usuarios";
                qxnw.utils.populateSelect(dd.ui.usuario, "master", "populate", datau);
                dd.ui.accept.addListener("execute", function () {
                    var ra = dd.getRecord();
                    var arr = [ra];
                    d.navTable.addRows(arr);
                    dd.close();
                });
                dd.setModal(true);
                dd.setWidth(900);
                dd.setHeight(600);
                dd.show();
            });
            d.__removeButton.addListener("click", function () {
//            d.slotDeleteRow();
                var r = d.navTable.selectedRecord();
                if (r == undefined || r == null) {
                    qxnw.utils.information(self.tr("Seleccione un registro para eliminar"));
                    return;
                } else {
                    if (r.id == "") {
                        d.navTable.removeSelectedRow();
                    } else {
                        qxnw.utils.question(self.tr("¿Está seguro dejar de compartir con esta persona?"), function (e) {
                            if (e) {
                                d.navTable.removeSelectedRow();
                                self.slotDelete(r);
                            } else {
                                return;
                            }
                        });
                    }

                }
            });
            d.insertNavTable(d.navTable.getBase(), "Usuarios");
            //FIN CREA OTRA TABLA EN FORM

            agregarButton.setEnabled(false);
            d.__removeButton.setEnabled(false);
            d.ui.compartir.addListener("changeSelection", function () {
                var box = d.ui.compartir.getValue();
                if (box.compartir == "CON_ALGUNOS") {
                    agregarButton.setEnabled(true);
                    d.__removeButton.setEnabled(true);
                } else
                if (box.compartir == "NO") {
                    agregarButton.setEnabled(false);
                    d.__removeButton.setEnabled(false);
                } else
                if (box.compartir == "SI") {
                    agregarButton.setEnabled(false);
                    d.__removeButton.setEnabled(false);
                }
            });
            var func = function (r) {
                if (r == false) {
                    return;
                }
                d.setRecord(r[0]);
            };
            qxnw.utils.fastRpcAsyncCall("nw_drive", "consultaPermisos", id, func);
            var rpc = new qxnw.rpc(self.getRpcUrl(), "nw_drive");
            rpc.setAsync(true);
            var func = function (r) {
                if (r.length >= 1) {
                    d.ui.compartir.setValue("CON_ALGUNOS");
                }
                d.navTable.setModelData(r);
            };
            rpc.exec("consultaUsuariosPermisos", id, func);
            d.setWidth(600);
            d.setHeight(500);
            d.setModal(true);
            d.show();
        },
        sendFile: function sendFile(archivo) {
            var self = this;
            var d = new qxnw.forms();
            d.setTitle("Enviar por Correo");
            d.addHeaderNote(self.tr("<div style='font-size: 12px;'><h2>Enviar enlace por correo</h2></div>"));
            d.setColumnsFormNumber(2);
            var fields = [
                {
                    name: "Datos de Envío",
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
                    name: "correo",
                    label: "Correo al que desea enviar",
                    type: "textField",
                    required: true
                },
                {
                    name: "Datos de Envío",
                    type: "endGroup",
                    icon: "",
                    mode: "horizontal"
                },
                {
                    name: "Datos de Envío",
                    type: "startGroup",
                    icon: "",
                    mode: "horizontal"
                },
                {
                    name: "observacion",
                    label: "Observaciones",
                    type: "ckeditor",
                    required: true
                },
                {
                    name: "Datos de Envío",
                    type: "endGroup",
                    icon: "",
                    mode: "horizontal"
                }
            ];
            d.setFields(fields);
//            d.ui.id.setValue(id.toString());
//            var data = {};
//            data = {"NO": "No compartir", "SI": "Compartida con todos", "CON_ALGUNOS": "Compartida con algunos usuarios"};
            //qxnw.utils.populateSelectFromArray(d.ui.compartir, data);
//            d.ui.accept.addListener("execute", function () {
//                var r = d.getRecord();
//                r.usuarios = d.navTable.getAllData();
//                var funct = function () {
//                    d.close();
//                };
//                qxnw.utils.fastRpcAsyncCall("nw_drive", "savePermisos", r, funct);
//            });
            var up = qxnw.userPolicies.getUserData();
            var name = up.name;
            var host = window.location.hostname;
            var link = "http://" + host + archivo;
            d.ui.observacion.setValue("<h1>Hola</h1><p>El usuario " + name + " ha compartido un archivo</p><p><a href='" + link + "'></p>\n\
<div style='width:150px;background: #ee6900;color: #ffffff;font-size: 14px;padding: 5px;'><a href='" + link + "' target='_blank'>Descargar Archivo</a></div> o también puede copiar la siguiente url: <a href='" + link + "' target='_blank'>" + host + archivo + "</a>");
            d.ui.accept.addListener("execute", function () {
                var r = d.getRecord();
                //  r.usuarios = d.navTable.getAllData();
                var funct = function () {
                    d.close();
                };
                qxnw.utils.fastRpcAsyncCall("nw_drive", "saveMail", r, funct);
            });
            d.ui.cancel.addListener("execute", function () {
                d.reject();
            });
            ////AGREGA OTRA TABLA EN EL FORM
            // var agregarButton = d.navTable.getAddButton();
            //d.__removeButton = d.navTable.getRemoveButton();
            // d.__removeButton.addListener("click", function () {
            //   d.slotDeleteRow();
            // });
            //d.insertNavTable(d.navTable.getBase(), "Usuarios");
            //FIN CREA OTRA TABLA EN FORM

            // agregarButton.setEnabled(false);
            //d.__removeButton.setEnabled(false);
//            var func = function (r) {
//                if (r == false) {
//                    return;
//                }
//                d.setRecord(r[0]);
//            };
//            qxnw.utils.fastRpcAsyncCall("nw_drive", "consultaPermisos", id, func);
//            var rpc = new qxnw.rpc(self.getRpcUrl(), "nw_drive");
//            rpc.setAsync(true);
//            var func = function (r) {
//                if (r.length >= 1) {
//                    d.ui.compartir.setValue("CON_ALGUNOS");
//                }
//                d.navTable.setModelData(r);
//            };
//            rpc.exec("consultaUsuariosPermisos", id, func);
            d.setWidth(600);
            d.setHeight(500);
            d.setModal(true);
            d.show();
        },
        slotDelete: function slotDelete(pr) {
            var self = this;
            var rpc = new qxnw.rpc(self.getRpcUrl(), "nw_drive");
            rpc.setAsync(true);
            rpc.exec("eliminarUsuarioCompartir", pr);
        },
        uploadFile: function uploadFile(pr, compartir) {
            var self = this;
            var d = new qxnw.forms();
            d.setAppName("nw_drive");
            var fields = [
                {
                    name: "id",
                    label: "ID",
                    type: "textField",
                    visible: false
                },
                {
                    name: "asociado",
                    label: "Carpeta Asociada ",
                    type: "textField",
                    visible: false
                },
                {
                    name: "compartir",
                    label: "Compartir",
                    type: "textField",
                    enabled: false
                },
                {
                    name: "ruta",
                    label: "Archivo",
                    type: "uploader_multiple",
                    mode: "rename"
                }
            ];
            d.setFields(fields);
//            d.ui.ruta.setDragAndDrop(true);
            var asoc = "";
            if (pr == undefined) {
                asoc = "0";
            } else {
                asoc = pr;
            }
            var shared = "";
            if (compartir == "SI") {
                shared = "SI";
            } else {
                shared = "NO";
            }
            d.ui.asociado.setValue(asoc);
            d.ui.compartir.setValue(shared);
            d.ui.accept.addListener("execute", function () {
                var r = d.getRecord();
                r.file = d.ui.ruta.getValue();
                var funct = function () {
                    d.close();
                    self.containerTest.removeAll();
                    self.loadCarpet(pr);
                    self.populateTree();
                };
                qxnw.utils.fastRpcAsyncCall("nw_drive", "saveFile", r, funct);
            });
            d.ui.cancel.addListener("execute", function () {
                d.reject();
            });
            d.setWidth(300);
            d.setHeight(200);
            d.setModal(true);
            d.show();
        },
        populateTree: function populateTree() {
            var self = this;
            var rpc = new qxnw.rpc(self.getRpcUrl(), "nw_drive");
            rpc.setAsync(true);
            var data = {};
            self.removeOnLayer();
            var func = function (r) {
                self.addTreeHeader("Lugares " + "   : :  " + r.length, qxnw.config.execIcon("view-sort-descending"));
                var desk = self.addTreeFolder("Escritorio", qxnw.config.execIcon("user-home", "places"), 0, true);
                var share = self.addTreeFolder("Lo que he compartido", qxnw.config.execIcon("folder-remote", "places"), 0, true);
                var red = self.addTreeFolder("Red", qxnw.config.execIcon("network-workgroup", "places"), 0, true);
                var favorite = self.addTreeFolder("Favoritos", qxnw.config.execIcon("help-about", "actions"), 0, true);
                desk.addListener("click", function () {
                    self.containerTest.removeAll();
                    localStorage["init"] = 0;
                    self.loadCarpet();
                    self.placeHolderLeft = "Escritorio";
                    self.ruta.setPlaceholder(self.placeHolder);

//                    self.containerTest.removeAll();
//                    var num = localStorage["init"];
//                    self.loadCarpet(localStorage[num]);
//                    self.populateTree();
//                    self.placeHolderLeft = "Escritorio";
//                    self.ruta.setPlaceholder(self.placeHolder);
                });
                //TODO: MODEL PROVISIONAL
                desk.setModel("test");
                red.addListener("click", function () {
                    self.loadRed();
                    self.placeHolderLeft = "Red";
                    self.ruta.setPlaceholder(self.placeHolder);
                });
                share.addListener("click", function () {
                    self.containerTest.removeAll();
                    self.loadCarpet("", "", "", "SI");
                    self.placeHolderLeft = "Red";
                    self.ruta.setPlaceholder(self.placeHolder);
                });
                for (var i = 0; i < r.length; i++) {
                    var prefix = "";
                    var icon = "";
                    var parent = {};
                    icon = qxnw.config.execIcon("document-open", "actions");
                    parent["s" + i] = self.addTreeFolder((prefix + r[i].nombre), icon, r[i].id, true);
                    parent["s" + i].setModel(r[i]);
                    parent["s" + i].addListener("click", function () {
                        var text = this.getModel();
                        if (localStorage["init"] != 0) {
                            if (localStorage[localStorage["init"]] == text.id) {
                                return;
                            }
                        }
                        localStorage["init"]++;
                        var num = localStorage["init"];
                        localStorage[num] = text.id;
                        self.placeHolderLeft = text.nombre;
                        self.ruta.setPlaceholder(self.placeHolder + "/" + text.nombre);
                        self.containerTest.removeAll();
                        self.loadCarpet(text.id);
                        self.atras.setEnabled(true);
                    });
                }
            };
            rpc.exec("consulta_tree", data, func);
        },
        contextMenu: function contextMenu(pos) {
            var self = this;
            var item = self.tree.getSelection();
            if (typeof item[0] == 'undefined') {
                return;
            }
            var model = qx.util.Serializer.toNativeObject(item[0].getModel());
            if (model == null) {
                return;
            }
            var m = new qxnw.contextmenu(self.tree);
            m.addAction("Editar", "icon/16/actions/document-print.png", function (e) {
                self.slotEditar(model);
            });
            m.addAction("Eliminar", "icon/16/actions/dialog-apply.png", function (e) {
                self.slotEliminar(model);
            });
            m.setParentWidget(this.tree);
            m.exec(pos);
        },
        contextMenuFiles: function contextMenuFiles(pos) {
            var self = this;
            var m = new qxnw.contextmenu(self.containerTest);
            m.addAction("Editar", "icon/16/actions/document-print.png", function (e) {
                self.slotEditar(model);
            });
            m.addAction("Eliminar", "icon/16/actions/dialog-apply.png", function (e) {
                self.slotEliminar(model);
            });
            m.setParentWidget(self.containerTest);
            m.exec(pos);
        },
        openFile: function openFile(imagen) {
            var self = this;
            var r = {};
            r["imagen"] = imagen;
            if (r == undefined) {
                qxnw.utils.alert("Seleccione un registro");
                return;
            }
            var d = new qxnw.nw_drive.f_visto_imagenes();
            if (!d.setParamRecord(r)) {
                return;
            }
            d.settings.accept = function () {
                self.containerTest.removeAll();
                var num = localStorage["init"];
                self.loadCarpet(localStorage[num]);
                self.populateTree();
            }
            d.setWidth(700);
            d.setHeight(650);
            d.show();
        },
        getContextMenuFiles: function (parent) {
            var self = this;
            var id = parent.getUserData("id");
            var text = parent.getUserData("text");
            var buscar = parent.getUserData("buscar");
            var usuario = parent.getUserData("usuario");
            var compartido = parent.getUserData("compartido");
            var archivo = parent.getUserData("archivo");
            var tipo = parent.getUserData("tipo");
            var menu = new qx.ui.menu.Menu;
            var open = new qx.ui.menu.Button("Abrir Carpeta", "", this._cutCommand);
            var openFile = new qx.ui.menu.Button("Abrir Archivo", "", this._cutCommand);
            var openSubWindow = new qx.ui.menu.Button("Abrir en nueva ventana", "", this._cutCommand);
            var newCarpet = new qx.ui.menu.Button("Nueva carpeta", "", this._copyCommand);
            var loadFile = new qx.ui.menu.Button("Subir Archivos a esta carpeta", "", this._copyCommand);
            var sharedFolder = new qx.ui.menu.Button("Compartir Carpeta", "", this._pasteCommand);
            var sendMail = new qx.ui.menu.Button("Enviar por Correo", "", this._pasteCommand);
            var favorite = new qx.ui.menu.Button("Agregar a favoritos", "", this._pasteCommand);
            var rename = new qx.ui.menu.Button("Cambiar nombre", "", this._pasteCommand);
            var downloadFile = new qx.ui.menu.Button("Descargar Archivo", "", this._pasteCommand);
            var deletteFolder = new qx.ui.menu.Button("Eliminar Carpeta", "", this._pasteCommand);
            var deletteFile = new qx.ui.menu.Button("Eliminar Archivo", "", this._pasteCommand);
            var propiedades = new qx.ui.menu.Button("Propiedades", "", this._pasteCommand);
            var abrir_con = new qx.ui.menu.Button("Abrir Con", "icon/16/actions/edit-paste.png", this._pasteCommand);
            open.addListener("click", function () {
                localStorage["init"]++;
                var num = localStorage["init"];
                localStorage[num] = id;
                localStorage["carpet" + num] = text;
                self.placeHolderAdd += "/" + localStorage["carpet" + num];
                self.ruta.setPlaceholder(self.placeHolder + self.placeHolderAdd);
                self.placeHolderLeft = "";
                self.containerTest.removeAll();
                self.loadCarpet(id, buscar, usuario, compartido);
                self.atras.setEnabled(true);
            });
            downloadFile.addListener("click", function () {
                self.slotVerAdjunto(archivo);
            });
            openFile.addListener("click", function () {
                self.openFile(id, archivo);
            });
            openSubWindow.addListener("click", function () {
                self.slotOpenCarpetOtherWindow(id);
            });
            sharedFolder.addListener("click", function () {
                self.sharedCarpet(id);
            });
            sendMail.addListener("click", function () {
                self.sendFile(archivo);
            });
            newCarpet.addListener("click", function () {
                var num = localStorage["init"];
                self.newCarpet(localStorage[num]);
            });
            loadFile.addListener("click", function () {
                self.uploadFile(id);
            });
            deletteFolder.addListener("click", function () {
                qxnw.utils.question("¿Está seguro de eliminar esta carpeta?", function (e) {
                    if (e) {
                        self.deleteCarpet(id);
                    } else {
                        return;
                    }
                });
            });
            deletteFile.addListener("click", function () {
                qxnw.utils.question("¿Está seguro de eliminar este archivo?", function (e) {
                    if (e) {
                        self.deleteFile(id);
                    } else {
                        return;
                    }
                });
            });
            if (tipo == "folder") {
                menu.add(open);
                menu.add(openSubWindow);
                menu.add(newCarpet);
                menu.add(loadFile);
                menu.add(sharedFolder);
                menu.add(deletteFolder);
            }
            if (tipo == "file") {
                menu.add(openFile);
//                menu.add(abrir_con);
                menu.add(downloadFile);
                menu.add(deletteFile);
                menu.add(sendMail);
            }
//            menu.add(favorite);
//            menu.add(rename);
//            if (tipo == "folder") {
//                menu.add(deletteFolder);
//            }
//            if (tipo == "file") {
//                menu.add(deletteFile);
//            }
//            menu.add(propiedades);
            return menu;
        },
        slotVerAdjunto: function slotVerAdjunto(img) {
            var sl = img;
            var win = window.open(sl, '_blank');
            win.focus();
        },
        slotOpenCarpetOtherWindow: function slotOpenCarpetOtherWindow(r) {
            var self = this;
            if (r == undefined) {
                qxnw.utils.alert("Seleccione un registro");
                return;
            }
            var d = new qxnw.nw_drive.trees.vista_general();
            d.createWindow(r);
            d.setWidth(800);
            d.setHeight(650);
            d.show();
        },
        deleteCarpet: function deleteCarpet(id) {
            var self = this;
            var r = id;
            if (r == undefined) {
                qxnw.utils.alert("Seleccione un registro");
                return;
            }
            var rpc = new qxnw.rpc(this.rpcUrl, "nw_drive");
            rpc.exec("eliminarCarpet", r);
            if (rpc.isError()) {
                qxnw.utils.alert(rpc.getError());
                return;
            }
            self.containerTest.removeAll();
            var num = localStorage["init"];
            self.loadCarpet(localStorage[num]);
            self.populateTree();
        },
        deleteFile: function deleteFile(id) {
            var self = this;
            var r = id;
            if (r == undefined) {
                qxnw.utils.alert("Seleccione un registro");
                return;
            }
            var rpc = new qxnw.rpc(this.rpcUrl, "nw_drive");
            rpc.exec("eliminarArchivo", r);
            if (rpc.isError()) {
                qxnw.utils.alert(rpc.getError());
                return;
            }
            self.containerTest.removeAll();
            var num = localStorage["init"];
            self.loadCarpet(localStorage[num]);
            self.populateTree();
        },
        populateFolders: function populateFolders(pr) {
            var self = this;
            var ra = "";
            var rpc = new qxnw.rpc(this.rpcUrl, "nw_drive");
            var r = rpc.exec("populateFolders", pr);
            if (rpc.isError()) {
                qxnw.utils.error(rpc.getError(), self);
                return;
            }
            return r;
        }
    }
});