qx.Class.define("qxnw.nw_file_manager.trees.vista_general", {
    extend: qxnw.treeWidget,
    construct: function (type) {
        this.base(arguments);
        var self = this;
        self.setTitle(self.tr("Administrador de archivos :: NW Group"));
        qxnw.utils.loadCss("/nwlib" + qxnw.userPolicies.getNwlibVersion() + "/css/nwdrive.css");
        self.idCarpet = 1;
        self.idCarpetAfter = 0;
        self.placeHolder = "";
        self.placeh = self.tr("Escritorio");
        self.placeHolderAdd = "";
        self.placeHolderLeft = "";
        localStorage["init"] = 0;
        var selectionContainer = new qx.ui.container.Composite(new qx.ui.layout.HBox()).set({
            padding: 5
        });
        var otherContainer = new qx.ui.container.Composite(new qx.ui.layout.HBox()).set({
            padding: 5
        });
        self.lblAutoFilter.setVisibility("excluded");
        self.leftScroller.setWidth(200);
        self.atras = new qx.ui.form.Button().set({
            maxHeight: 24
        });
        self.atras.setIcon(qxnw.config.execIcon("go-previous"));
        self.ruta = new qxnw.widgets.textField("").set({
            paddingTop: 3,
            minWidth: 200
        });
        self.ruta.setEnabled(false);
        self.ruta.setPlaceholder(self.placeHolder);
        self.cuadros = new qx.ui.form.ToggleButton("Cuadros");
        self.actualizar = new qx.ui.form.Button(self.tr("Actualizar"), qxnw.config.execIcon("view-refresh"));
        self.cuadros.setIcon(qxnw.config.execIcon("format-justify-left"));
        self.lista = new qx.ui.form.ToggleButton("Lista");
        self.lista.setIcon(qxnw.config.execIcon("view-restore", "actions"));
        self.buscarTextField = new qxnw.widgets.textField().set({
            paddingTop: 3,
            minWidth: 200
        });
        self.ui["texfield_auto_filter"].setPlaceHolder(self.tr("Buscar en árbol..."));
        self.ctnr.set({
            paddingTop: 2
        });
        otherContainer.add(self.ctnr);

        self.buscarTextField.setPlaceholder(self.tr("Buscar en servidor..."));
        self.buscar = new qx.ui.form.Button().set({
            maxHeight: 24
        });
        self.buscar.setIcon(qxnw.config.execIcon("system-search", "actions"));

        self.checkMultiple = new qxnw.widgets.checkBox(self.tr("Selección múltiple"));
        self.checkMultiple.setValue(true);
        self.checkMultiple.addListener("changeValue", function () {
            if (self.checkMultiple.getValue()) {
                self.onlySelectOneImage = true;
            } else {
                self.onlySelectOneImage = false;
            }
        });

        self.seleccionar = new qx.ui.form.Button(self.tr("Seleccionar"), qxnw.config.execIcon("dialog-apply"));
        self.seleccionarTodoButton = new qx.ui.form.Button(self.tr("Seleccionar todo"), qxnw.config.execIcon("view-sort-descending"));
        self.desactivar = new qx.ui.form.Button(self.tr("Desactivar todo"), qxnw.config.execIcon("dialog-cancel"));
        self.eliminar = new qx.ui.form.Button(self.tr("Eliminar"), qxnw.config.execIcon("edit-delete"));
        self.subir = new qx.ui.form.Button(self.tr("Subir"));
        self.subir.setIcon(qxnw.config.execIcon("document-save", "actions"));
        self.newCarpeta = new qx.ui.form.Button(self.tr("Nuevo"));
        self.newCarpeta.setIcon(qxnw.config.execIcon("folder-new", "actions"));
        self.configuracion = new qx.ui.form.Button();
        self.configuracion.setIcon(qxnw.config.execIcon("system", "categories"));
        self.atras.setEnabled(false);
        otherContainer.add(self.atras);
        otherContainer.add(self.ruta, {
            flex: 1
        });
        otherContainer.add(self.buscarTextField, {
            flex: 1
        });
        otherContainer.add(self.buscar);
        otherContainer.add(self.checkMultiple);
        selectionContainer.add(self.actualizar, {
            flex: 1
        });
        selectionContainer.add(self.seleccionar, {
            flex: 1
        });
        selectionContainer.add(self.seleccionarTodoButton, {
            flex: 1
        });
        selectionContainer.add(self.desactivar, {
            flex: 1
        });
        selectionContainer.add(self.eliminar, {
            flex: 1
        });
        selectionContainer.add(self.subir, {
            flex: 1
        });
        selectionContainer.add(self.newCarpeta, {
            flex: 1
        });
        selectionContainer.add(self.cuadros, {
            flex: 1
        });
        selectionContainer.add(self.lista, {
            flex: 1
        });

        self.buscarTextField.addListener("keypress", function (e) {
            if (e.getKeyIdentifier() == "Enter") {
                self.reloadWindow();
            }
        });

        var composite = new qx.ui.container.Composite(new qx.ui.layout.HBox());

        var radioGroup = new qx.ui.form.RadioGroup();

        self.typesGroup = radioGroup;

        var radioButtonTodos = new qx.ui.form.RadioButton("Todos");
        radioButtonTodos.setModel("todos");
        var radioButtonImg = new qx.ui.form.RadioButton("Img");
        radioButtonImg.setModel("img");
        var radioButtonFlash = new qx.ui.form.RadioButton("Flash");
        radioButtonFlash.setModel("flash");
        var radioButtonGif = new qx.ui.form.RadioButton("Gif");
        radioButtonGif.setModel("gif");
        var radioButtonPdf = new qx.ui.form.RadioButton("PDF");
        radioButtonPdf.setModel("pdf");

        composite.add(radioButtonTodos, {
            flex: 1
        });
        composite.add(radioButtonImg, {
            flex: 1
        });
        composite.add(radioButtonFlash, {
            flex: 1
        });
        composite.add(radioButtonGif, {
            flex: 1
        });
        composite.add(radioButtonPdf, {
            flex: 1
        });

        radioGroup.add(radioButtonTodos, radioButtonImg, radioButtonFlash, radioButtonGif, radioButtonPdf);

        radioButtonTodos.addListener("changeValue", function (e) {
            qxnw.local.setData("nw_radio_button_admin_img", this.getModel());
        });
        radioButtonImg.addListener("changeValue", function (e) {
            qxnw.local.setData("nw_radio_button_admin_img", this.getModel());
        });
        radioButtonFlash.addListener("changeValue", function (e) {
            qxnw.local.setData("nw_radio_button_admin_img", this.getModel());
        });
        radioButtonGif.addListener("changeValue", function (e) {
            qxnw.local.setData("nw_radio_button_admin_img", this.getModel());
        });
        radioButtonPdf.addListener("changeValue", function (e) {
            qxnw.local.setData("nw_radio_button_admin_img", this.getModel());
        });

        radioGroup.addListener("changeSelection", function () {
            self.reloadWindow();
        });

        selectionContainer.add(composite);
        self.containerFilters.setLayout(new qx.ui.layout.VBox());

        self.containerFilters.add(selectionContainer, {
            flex: 1
        });
        self.containerFilters.add(otherContainer, {
            flex: 1
        });

        var selectedTypeFile = qxnw.local.getData("nw_radio_button_admin_img");
        if (selectedTypeFile != null) {
            switch (selectedTypeFile) {
                case ("img"):
                    radioGroup.setSelection([radioButtonImg]);
                    break;
                case ("flash"):
                    radioGroup.setSelection([radioButtonFlash]);
                    break;
                case ("gif"):
                    radioGroup.setSelection([radioButtonGif]);
                    break;
                case ("pdf"):
                    radioGroup.setSelection([radioButtonPdf]);
                    break;
            }
        }

        if (type != 'undefined' && type != "") {
            switch (type) {
                case ("img"):
                    radioGroup.setSelection([radioButtonImg]);
                    radioGroup.setEnabled(false);
                    break;
            }
        }

        self.seleccionarTodoButton.addListener("click", function () {
            self.seleccionarTodo();
        });
        self.desactivar.addListener("click", function () {
            self.desactivarTodos();
        });
        self.atras.addListener("click", function () {
            var ruta = self.ruta.getValue().split("/");
            ruta.pop();
            if (typeof ruta[3] == 'undefined') {
                return;
            }
            self.containerTest.removeAll();
            ruta = ruta.join("/");
            self.ruta.setValue(ruta);
            self.loadCarpet(0, ruta);
            if (self.positions == 1) {
                this.setEnabled(false);
            }
            self.positions--;
        });
        self.newCarpeta.addListener("click", function () {
            var data = self.ruta.getValue();
            self.newCarpet(data);
        });
        self.subir.addListener("click", function () {
            self.uploadFile();
        });
        self.ruta.addListener("keypress", function (e) {
            if (e.getKeyIdentifier() === "Enter") {
                self.reloadWindow();
            }
        });
        self.actualizar.addListener("click", function () {
            self.reloadWindow();
        });
        self.seleccionar.addListener("click", function () {
            self.seleccionarItems();
        });
        self.buscar.addListener("click", function () {
            self.reloadWindow();
        });

        var selectedTypeView = qxnw.local.getData("nw_admin_img_nwproject");
        if (selectedTypeView != null) {
            if (selectedTypeView == "lista") {
                self.lista.setValue(true);
            } else if (selectedTypeView == "cuadros") {
                self.cuadros.setValue(true);
            }
        } else {
            self.cuadros.setValue(true);
        }

        self.cuadros.addListener("changeValue", function (e) {
            if (self.eventOnChange == false) {
                return;
            }
            self.eventOnChangeList = false;
            if (e.getData() == false) {
                self.lista.setValue(true);
            } else {
                self.lista.setValue(false);
                qxnw.local.setData("nw_admin_img_nwproject", "cuadros");
            }
            self.reloadWindow();
            self.eventOnChangeList = true;
        });
        self.lista.addListener("changeValue", function (e) {
            if (self.eventOnChangeList == false) {
                return;
            }
            self.eventOnChange = false;
            if (e.getData() == false) {
                self.cuadros.setValue(true);
            } else {
                self.cuadros.setValue(false);
                qxnw.local.setData("nw_admin_img_nwproject", "lista");
            }
            self.reloadWindow();
            self.eventOnChange = true;
        });

        self.eliminar.addListener("click", function () {
            qxnw.utils.question(self.tr("¿Está segur@ de eliminar el/los item/s?"), function (e) {
                if (e) {
                    self.deleteAppFile();
                }
            });
        });
        self.initialWindow();
        self.selectedImages = [];
    },
    destruct
            : function destruct() {
            },
    members: {
        typesGroup: null,
        containerCarpet: null,
        positions: 0,
        positionsAlter: 0,
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
        selectedImages: null,
        carpetaInicial: null,
        onlySelectOneImage: true,
        eventOnChangeList: true,
        eventOnChange: true,
        __loadedItems: null,
        __carpeta: null,
        lblNoFiles: null,
        lblNoDirectories: null,
        checkMultiple: null,
        checkSquareOrList: function checkSquareOrList() {
            var self = this;
            var val = self.cuadros.getValue();
            if (val == false) {
                return "lista";
            } else {
                return "cuadros";
            }
        },
        createList: function createList(r, total, carpeta, remove) {
            var self = this;
            self.__loadedItems = r;

            if (typeof remove == 'undefined') {
                remove = false;
            }

            r["count"] = self.ui["maxRowsField"].getValue();
            var page = self.ui["page"].getValue();

            var registrosPorPagina = self.ui.maxRowsField.getValue();
            var numeroPaginas = Math.ceil(total / registrosPorPagina);
            self.__maxPages = numeroPaginas;
            self.ui.labelTotalPags.setValue("Total páginas: " + numeroPaginas.toString());

            var offset = (page - 1) * registrosPorPagina;

            self.containerTest.setLayout(new qx.ui.layout.VBox());

            if (remove == true) {
                self.containerTest.removeAll();
            }
            if (offset > 0) {
                offset = offset + 2;
            }
            var max_i = registrosPorPagina + offset;
            if (max_i > total) {
                max_i = total + 1;
            }
            if (max_i == 30) {
                max_i = 32;
            }

            for (var i = offset; i < max_i; i++) {
                if (typeof r[i] == 'undefined') {
                    return;
                }
                var containerCarpet = new qx.ui.container.Composite(new qx.ui.layout.HBox()).set({
                    minHeight: 30,
                    alignX: "left"
                });
                var ruta = r[i].ruta;
                self.containerCarpet = containerCarpet;
                containerCarpet.setUserData("nombre", r[i].nombre);
                containerCarpet.setUserData("relative_path", r[i].relative_path);
                containerCarpet.setUserData("filetype", r[i].filetype);
                containerCarpet.setUserData("id", r[i].id);
                containerCarpet.setUserData("text", carpeta + "/" + r[i].nombre);
                containerCarpet.setUserData("size", r[i].size);
                containerCarpet.setUserData("permissions", r[i].permissions);
                containerCarpet.setUserData("valueCompartir", r[i].compartir);
                containerCarpet.setUserData("owner", r[i].owner);
                containerCarpet.setUserData("dirInitial", r[i].dirInitial);
                containerCarpet.setUserData("tipo", "folder");
                var rutaFile = ruta.replace(r[i].dirInitial, "/");
                containerCarpet.setUserData("archivo", rutaFile);
                containerCarpet.setUserData("extension", r[i].extension);
                containerCarpet.setContextMenu(self.getContextMenuFiles(containerCarpet));

                var imgIcon = "";
                var isFile = false;

                var ruta = r[i].ruta;
                if (r[i].extension == "JPG" || r[i].extension == "jpg" || r[i].extension == "jpeg" || r[i].extension == "PNG" || r[i].extension == "png" || r[i].extension == "gif" || r[i].extension == "HEIF" || r[i].extension == "webp" || r[i].extension == "WEBP") {
                    imgIcon = "/nwlib" + qxnw.userPolicies.getNwlibVersion() + "/includes/phpthumb/phpThumb.php?src=" + ruta + "&w=70&q=" + qxnw.config.getPhpThumbQuality();
                } else if (r[i].extension == "ico" || r[i].extension == "ICO") {
                    imgIcon = qxnw.config.execIcon("utilities-graphics-viewer", "apps", 32);
                } else if (r[i].extension == "SWF" || r[i].extension == "swf") {
                    imgIcon = qxnw.config.execIcon("flash", "qxnw", 32);
                } else if (r[i].extension == "pdf" || r[i].extension == "PDF") {
                    imgIcon = "/nwlib" + qxnw.userPolicies.getNwlibVersion() + "/icons/64/pdf.png";
                } else if (r[i].extension == "mp3" || r[i].extension == "ogg") {
                    imgIcon = qxnw.config.execIcon("media-audio", "mimetypes", 32);
                } else if (r[i].extension == "html") {
                    imgIcon = qxnw.config.execIcon("text-html", "mimetypes", 32);
                } else if (r[i].extension == "txt") {
                    imgIcon = qxnw.config.execIcon("text-plain", "mimetypes", 32);
                } else if (r[i].extension == "sql") {
                    imgIcon = "/nwlib" + qxnw.userPolicies.getNwlibVersion() + "/icons/48/texto_sql.png";
                } else if (r[i].extension == "js") {
                    imgIcon = "/nwlib" + qxnw.userPolicies.getNwlibVersion() + "/icons/48/javascript.png";
                } else if (r[i].extension == "php") {
                    imgIcon = "/nwlib" + qxnw.userPolicies.getNwlibVersion() + "/icons/48/php.png";
                } else if (r[i].extension == "zip" || r[i].extension == "rar" || r[i].extension == "tar" || r[i].extension == "exe" || r[i].extension == "tgz" || r[i].extension == "deb" || r[i].extension == "gz") {
                    imgIcon = qxnw.config.execIcon("zip", "qxnw", 32);
                    imgIcon = "/nwlib" + qxnw.userPolicies.getNwlibVersion() + "/icons/48/zip.png";
                } else if (r[i].extension == "pps" || r[i].extension == "ppt" || r[i].extension == "pptx") {
                    imgIcon = "/nwlib" + qxnw.userPolicies.getNwlibVersion() + "/icons/48/PowerPoint-icon.png";
                } else if (r[i].extension == "xls" || r[i].extension == "xml" || r[i].extension == "xla" || r[i].extension == "xlsx" || r[i].extension == "xlsb" || r[i].extension == "xlsm" || r[i].extension == "xltx" || r[i].extension == "xltm" || r[i].extension == "xlam" || r[i].extension == "ods") {
                    imgIcon = "/nwlib" + qxnw.userPolicies.getNwlibVersion() + "/icons/48/excel.png";
                } else if (r[i].extension == "doc" || r[i].extension == "docx" || r[i].extension == "docm" || r[i].extension == "dotx" || r[i].extension == "dotm" || r[i].extension == "odt") {
                    imgIcon = "/nwlib" + qxnw.userPolicies.getNwlibVersion() + "/icons/64/word.png";
                } else if (r[i].extension == "ttf" || r[i].extension == "TTF" || r[i].extension == "otf" || r[i].extension == "OTF") {
                    imgIcon = "/nwlib" + qxnw.userPolicies.getNwlibVersion() + "/icons/64/font.png";
                } else if (r[i].extension == "css" || r[i].extension == "CSS") {
                    imgIcon = "/nwlib" + qxnw.userPolicies.getNwlibVersion() + "/icons/64/css.png";
                } else {
                    isFile = true;
                    if (r[i].nombre == "..") {
                        continue;
                    } else {
                        imgIcon = qxnw.config.execIcon("document-open", "actions", 32);
                    }
                }
                var img = new qx.ui.basic.Image(imgIcon).set({
                    cursor: "pointer",
                    alignX: "center",
                    alignY: "middle"
                });

                var containerImg = new qx.ui.container.Composite(new qx.ui.layout.VBox()).set({
                    minWidth: 150,
                    maxWidth: 150
                });
                containerImg.add(img);

                var lab = r[i].nombre;
                if (!isFile) {
                    lab += "<br />";
                    lab += r[i].datetime;
                    lab += "<br />";
                    lab += r[i].size;
                }
                var label = new qx.ui.basic.Label(lab).set({
                    rich: true,
                    padding: 5
                });

                containerCarpet.add(containerImg);
                containerCarpet.add(label);
                if (r[i].nombre != ".") {
                    self.containerTest.add(containerCarpet);
                    self.containerTest.add(containerCarpet);
                    var line = new qx.ui.basic.Label("<hr>").set({
                        rich: true,
                        width: qx.bom.Viewport.getWidth()
                    });
                    self.containerTest.add(line, {
                        flex: 1
                    });
                }
                containerCarpet.addListener("dblclick", function () {
                    if (this.getUserData("extension") !== "") {
                        var arch = this.getUserData("archivo");
                        self.openFile(arch);
                    }
                });
                containerCarpet.addListener("click", function () {
                    if (this.getUserData("extension") === "") {
                        var nombre = this.getUserData("nombre");
                        var text = this.getUserData("text");
                        self.abrirCarpeta(nombre, text);
                    } else {
                        if (self.onlySelectOneImage != false) {
                            self.desactivarTodos();
                        }
                        if (this.getUserData("selected") == true) {
                            this.setUserData("selected", false);
                            qx.bom.element.Style.set(this.getContentElement().getDomElement(), "background", "initial");
                        } else {
                            this.setUserData("selected", true);
                            qx.bom.element.Style.set(this.getContentElement().getDomElement(), "background", "gray");
                        }
                    }
                });
            }
            var num = self.containerTest.getChildren();
            self.lblNoFilesMom.setValue(self.tr("<b>Total archivos en esta vista: ") + num.length + "</b>");
        },
        restartPaginationAll: function restartPaginationAll() {
            var self = this;
            self.ui["page"].setValue(1);
            self.__labelTotalPags.setValue(self.tr("Total páginas: 0"));
            self.containerTest.removeAll();
        },
        createSquare: function createSquare(r, total, carpeta, remove) {
            var self = this;
            self.__loadedItems = r;

            if (typeof remove == 'undefined') {
                remove = false;
            }

            r["count"] = self.ui["maxRowsField"].getValue();
            var page = self.ui["page"].getValue();

            var registrosPorPagina = self.ui.maxRowsField.getValue();
            var numeroPaginas = Math.ceil(total / registrosPorPagina);
            self.__maxPages = numeroPaginas;
            self.ui.labelTotalPags.setValue("Total páginas: " + numeroPaginas.toString());

            var offset = (page - 1) * registrosPorPagina;

            self.containerTest.setLayout(new qx.ui.layout.Flow());

            if (remove == true) {
                self.containerTest.removeAll();
            }
            if (offset > 0) {
                offset = offset + 2;
            }
            var max_i = registrosPorPagina;
            var max_i = registrosPorPagina + offset;
            if (max_i > total) {
                max_i = total + 1;
            }
            if (max_i == 30) {
                max_i = 32;
            }

            for (var i = offset; i < max_i; i++) {
                if (i >= total) {
                    break;
                }
                var containerCarpet = new qx.ui.container.Composite(new qx.ui.layout.VBox().set({
                    spacing: 5,
                    alignX: "center",
                    alignY: "middle"
                })).set({
                    maxHeight: 150,
                    minHeight: 150,
                    minWidth: 130,
                    maxWidth: 130,
                    alignX: "center",
                    alignY: "middle"
                });

                self.containerCarpet = containerCarpet;

                var imgIcon = "";
                var isFile = false;

                var ruta = r[i].ruta;
                if (r[i].extension == "JPG" || r[i].extension == "jpg" || r[i].extension == "jpeg" || r[i].extension == "PNG" || r[i].extension == "png" || r[i].extension == "gif" || r[i].extension == "webp" || r[i].extension == "WEBP") {
                    imgIcon = "/nwlib" + qxnw.userPolicies.getNwlibVersion() + "/includes/phpthumb/phpThumb.php?src=" + ruta + "&w=70&q=" + qxnw.config.getPhpThumbQuality();
                } else if (r[i].extension == "ico" || r[i].extension == "ICO") {
                    imgIcon = qxnw.config.execIcon("utilities-graphics-viewer", "apps", 32);
                } else if (r[i].extension == "SWF" || r[i].extension == "swf") {
                    imgIcon = qxnw.config.execIcon("flash", "qxnw", 32);
                } else if (r[i].extension == "pdf" || r[i].extension == "PDF") {
                    imgIcon = "/nwlib" + qxnw.userPolicies.getNwlibVersion() + "/icons/64/pdf.png";
                } else if (r[i].extension == "mp3" || r[i].extension == "ogg") {
                    imgIcon = qxnw.config.execIcon("media-audio", "mimetypes", 32);
                } else if (r[i].extension == "html") {
                    imgIcon = qxnw.config.execIcon("text-html", "mimetypes", 32);
                } else if (r[i].extension == "txt") {
                    imgIcon = qxnw.config.execIcon("text-plain", "mimetypes", 32);
                } else if (r[i].extension == "sql") {
                    imgIcon = "/nwlib" + qxnw.userPolicies.getNwlibVersion() + "/icons/48/texto_sql.png";
                } else if (r[i].extension == "js") {
                    imgIcon = "/nwlib" + qxnw.userPolicies.getNwlibVersion() + "/icons/48/javascript.png";
                } else if (r[i].extension == "php") {
                    imgIcon = "/nwlib" + qxnw.userPolicies.getNwlibVersion() + "/icons/48/php.png";
                } else if (r[i].extension == "zip" || r[i].extension == "rar" || r[i].extension == "tar" || r[i].extension == "exe" || r[i].extension == "tgz" || r[i].extension == "deb" || r[i].extension == "gz") {
                    imgIcon = qxnw.config.execIcon("zip", "qxnw", 32);
                    imgIcon = "/nwlib" + qxnw.userPolicies.getNwlibVersion() + "/icons/48/zip.png";
                } else if (r[i].extension == "pps" || r[i].extension == "ppt" || r[i].extension == "pptx") {
                    imgIcon = "/nwlib" + qxnw.userPolicies.getNwlibVersion() + "/icons/48/PowerPoint-icon.png";
                } else if (r[i].extension == "xls" || r[i].extension == "xml" || r[i].extension == "xla" || r[i].extension == "xlsx" || r[i].extension == "xlsb" || r[i].extension == "xlsm" || r[i].extension == "xltx" || r[i].extension == "xltm" || r[i].extension == "xlam" || r[i].extension == "ods") {
                    imgIcon = "/nwlib" + qxnw.userPolicies.getNwlibVersion() + "/icons/48/excel.png";
                } else if (r[i].extension == "doc" || r[i].extension == "docx" || r[i].extension == "docm" || r[i].extension == "dotx" || r[i].extension == "dotm" || r[i].extension == "odt") {
                    imgIcon = "/nwlib" + qxnw.userPolicies.getNwlibVersion() + "/icons/64/word.png";
                } else if (r[i].extension == "ttf" || r[i].extension == "TTF" || r[i].extension == "otf" || r[i].extension == "OTF") {
                    imgIcon = "/nwlib" + qxnw.userPolicies.getNwlibVersion() + "/icons/64/font.png";
                } else if (r[i].extension == "css" || r[i].extension == "CSS") {
                    imgIcon = "/nwlib" + qxnw.userPolicies.getNwlibVersion() + "/icons/64/css.png";
                } else {
                    isFile = true;
                    if (r[i].nombre == "..") {
                        continue;
                    } else {
                        imgIcon = qxnw.config.execIcon("document-open", "actions", 32);
                    }
                }

                var img = new qx.ui.basic.Atom(null, imgIcon).set({
                    center: true,
                    show: 'icon',
                    cursor: 'pointer'
                });

                var tT = new qx.ui.tooltip.ToolTip(r[i].nombre);
                img.setToolTip(tT);
                containerCarpet.setUserData("nombre", r[i].nombre);
                containerCarpet.setUserData("relative_path", r[i].relative_path);
                containerCarpet.setUserData("filetype", r[i].filetype);
                containerCarpet.setUserData("id", r[i].id);
                containerCarpet.setUserData("text", carpeta + "/" + r[i].nombre);
                containerCarpet.setUserData("size", r[i].size);
                containerCarpet.setUserData("permissions", r[i].permissions);
                containerCarpet.setUserData("valueCompartir", r[i].compartir);
                containerCarpet.setUserData("owner", r[i].owner);
                containerCarpet.setUserData("dirInitial", r[i].dirInitial);
                containerCarpet.setUserData("tipo", "folder");
                var rutaFile = ruta.replace(r[i].dirInitial, "/");
                containerCarpet.setUserData("archivo", rutaFile);
                containerCarpet.setUserData("extension", r[i].extension);
                containerCarpet.setContextMenu(self.getContextMenuFiles(containerCarpet));
                img.set({
                    maxHeight: 80,
                    minHeight: 80,
                    minWidth: 130,
                    maxWidth: 130,
                    alignX: "center",
                    alignY: "middle"
                });
                var lab = r[i].nombre;
                if (!isFile) {
                    lab += "<br />";
                    lab += r[i].datetime;
                    lab += "<br />";
                    lab += r[i].size;
                }
                var label = new qx.ui.basic.Label(lab).set({
                    rich: true,
                    alignX: "center",
                    alignY: "bottom"
                });
                containerCarpet.add(img);
                containerCarpet.add(label);
                if (r[i].nombre != ".") {
                    self.containerTest.add(containerCarpet);
                }
                containerCarpet.addListener("appear", function () {
                    qx.bom.element.Class.add(this.getContentElement().getDomElement(), "qxnw_file_block");
                });
                img.addListener("appear", function () {
                    qx.bom.element.Class.add(this.getContentElement().getDomElement(), "qxnw_buttonCarpet");
                });
                label.addListener("appear", function () {
                    qx.bom.element.Class.add(this.getContentElement().getDomElement(), "qxnw_buttonCarpetLabel");
                });
                containerCarpet.addListener("dblclick", function () {
                    if (this.getUserData("extension") !== "") {
                        var arch = this.getUserData("archivo");
                        self.openFile(arch);
                    }
                });
                containerCarpet.addListener("click", function () {
                    if (this.getUserData("extension") === "") {
                        var nombre = this.getUserData("nombre");
                        var text = this.getUserData("text");
                        self.restartPaginationAll();
                        self.abrirCarpeta(nombre, text);
                    } else {
                        if (self.onlySelectOneImage != false) {
                            self.desactivarTodos();
                        }
                        if (this.getUserData("selected") == true) {
                            this.setUserData("selected", false);
                            qx.bom.element.Style.set(this.getContentElement().getDomElement(), "background", "initial");
                        } else {
                            this.setUserData("selected", true);
                            qx.bom.element.Style.set(this.getContentElement().getDomElement(), "background", "gray");
                        }
                    }
                });
            }
            var num = self.containerTest.getChildren();
            self.lblNoFilesMom.setValue(self.tr("<b>Total archivos en esta vista: ") + num.length + "</b>");
        },
        setOnlySelectOneImage: function setOnlySelectOneImage(bool) {
            this.onlySelectOneImage = bool;
        },
        getSelectedImages: function getSelectedImages() {
            this.seleccionarItems(false);
            return this.selectedImages;
        },
        seleccionarItems: function seleccionarItems(close) {
            var self = this;
            var children = self.containerTest.getChildren();
            self.selectedImages = [];
            for (var i = 0; i < children.length; i++) {
                var selected = children[i].getUserData("selected");
                if (selected === true) {
                    var ruta = children[i].getUserData("relative_path");
                    self.selectedImages.push(ruta);
                }
            }
            if (self.selectedImages.length == 0) {
                qxnw.utils.information(self.tr("No hay items seleccionados"));
                return;
            }
            if (typeof close == 'undefined' || close === true) {
                self.accept();
            }
            return true;
        },
        desactivarTodos: function desactivarTodos() {
            var self = this;
            var children = self.containerTest.getChildren();
            for (var i = 0; i < children.length; i++) {
                qx.bom.element.Style.set(children[i].getContentElement().getDomElement(), "background", "initial");
                children[i].setUserData("selected", false);
            }
        },
        initialWindow: function initialWindow() {
            var self = this;
            var func = function (p) {
                self.carpetaInicial = p;
                self.ruta.setValue(p);
                self.createWindowView(p);
            };
            var rpc = new qxnw.rpc(self.getRpcUrl(), "nw_file_manager", true);
            rpc.exec("consulta_carpet_initial", 0, func);
        },
        reloadWindow: function reloadWindow() {
            var self = this;
            if (self.containerTest == null) {
                return;
            }
            self.containerTest.removeAll();
            var data = self.ruta.getValue();
            self.loadCarpet("", data);
        },
        showProperties: function showProperties(ruta, name, extension, type, size, permissions, owner) {
            var html = "";
            html += this.tr("<b>Ruta: </b>") + ruta;
            html += "<br />";
            html += this.tr("<b>Nombre: </b>") + name;
            html += "<br />";
            html += this.tr("<b>Extensión: </b>") + extension;
            html += "<br />";
            html += this.tr("<b>Tipo: </b>") + type;
            html += "<br />";
            html += this.tr("<b>Tamaño: </b>") + size;
            html += "<br />";
            if (typeof permissions != 'undefined') {
                if (permissions != null) {
                    if (permissions != '') {
                        html += this.tr("<b>Permisos: </b>") + permissions;
                        html += "<br />";
                    }
                }
            }
            if (typeof owner != 'undefined') {
                if (owner != null) {
                    if (owner != '') {
                        html += this.tr("<b>Propietario: </b>") + owner;
                        html += "<br />";
                    }
                }
            }
            qxnw.utils.information(html);
        },
        createWindowView: function createWindowView(r) {
            var self = this;
            self.page = new qxnw.forms();
            self.containerTest = new qx.ui.container.Composite(new qx.ui.layout.Flow());
            self.page.addWidget(self.containerTest, 1);
            self.addSubWindow("Carpeta", self.page);
            self.createPaginationImages(self.page);
            self.reloadWindow();
        },
        setNoRows: function setNoRows(rows, type) {
            var self = this;
            switch (type) {
                case "files":
                    rows = rows > 0 ? rows - 1 : 0;
                    self.lblNoFiles.setValue(self.tr("<b>Total archivos servidor: ") + rows + "</b>");
                    break;
                case "directories":
                    self.lblNoDirectories.setValue(self.tr("<b>Total directorios: ") + rows + "</b>");
                    break;
            }
        },
        createPaginationImages: function createPaginationImages(page) {
            var self = this;

            var footerInfo = new qx.ui.container.Composite(new qx.ui.layout.HBox()).set({
                minHeight: 25,
                maxHeight: 25
            });
            self.lblNoFilesMom = new qx.ui.basic.Label("<b>Archivos en esta vista: 0</b>").set({
                rich: true,
                alignY: "bottom"
            });
            self.lblNoFiles = new qx.ui.basic.Label("<b>Total archivos servidor: 0</b>").set({
                rich: true,
                alignY: "bottom"
            });
            self.lblNoDirectories = new qx.ui.basic.Label("<b>Total directorios: 0</b>").set({
                rich: true,
                alignY: "bottom"
            });
            footerInfo.add(self.lblNoFilesMom);
            footerInfo.add(new qx.ui.core.Spacer(30));
            footerInfo.add(self.lblNoFiles);
            footerInfo.add(new qx.ui.core.Spacer(30));
            footerInfo.add(self.lblNoDirectories);
            page.add(footerInfo);

            var lblLine = new qx.ui.basic.Label("<hr>").set({
                rich: true,
                width: qx.bom.Viewport.getWidth(),
                maxHeight: 7
            });
            page.add(lblLine);

            var containerPagination = new qx.ui.container.Composite(new qx.ui.layout.HBox()).set({
                minHeight: 40,
                maxHeight: 40,
                alignY: "middle",
                alignX: "center"
            });

            var compositeMaxRows = new qx.ui.container.Composite(new qx.ui.layout.VBox().set({
                alignY: "middle"
            }));
            var labelMaxRows = new qx.ui.basic.Label(self.tr("<b><font color='red'>Registros por página</font></b>")).set({
                rich: true
            });
            self.maxRows = new qx.ui.form.Spinner(100).set({
                minWidth: 70,
                maxWidth: 70,
                maxHeight: 25,
                maximum: 10000000000000,
                minimum: 1
            });
            var valSelected = qxnw.local.getData("nw_files_admin_advanced");
            if (valSelected != null) {
                if (typeof valSelected == "number") {
                    self.maxRows.setValue(valSelected);
                }
            }
            self.maxRows.addListener("keyup", function (e) {
                if (e.getKeyIdentifier() == "Enter") {
                    qxnw.local.setData("nw_files_admin_advanced", this.getValue());
                    try {
                        if (self.checkSquareOrList() == "cuadros") {
                            self.createSquare(self.__loadedItems, self.__loadedItems.length, self.__carpeta, true);
                        } else {
                            self.createList(self.__loadedItems, self.__loadedItems.length, self.__carpeta, true);
                        }
                    } catch (e) {

                    }
                }
            });
            compositeMaxRows.add(labelMaxRows);
            compositeMaxRows.add(self.maxRows);
            containerPagination.add(compositeMaxRows);
            self.ui["maxRowsField"] = self.maxRows;

            var containerPage = new qx.ui.container.Composite(new qx.ui.layout.VBox().set({
                alignY: "middle"
            }));
            var labelPage = new qx.ui.basic.Label(self.tr("Página actual"));
            self.page = new qx.ui.form.Spinner(1).set({
                minWidth: 70,
                maxWidth: 70,
                maxHeight: 25,
                maximum: 10000000000000,
                minimum: 1
            });
            self.page.addListener("keyup", function (e) {
                if (e.getKeyIdentifier() == "Enter") {
                    try {
                        if (self.checkSquareOrList() == "cuadros") {
                            self.createSquare(self.__loadedItems, self.__loadedItems.length, self.__carpeta, true);
                        } else {
                            self.createList(self.__loadedItems, self.__loadedItems.length, self.__carpeta, true);
                        }
                    } catch (e) {

                    }
                }
            });
            containerPage.add(labelPage);
            containerPage.add(self.page);
            self.ui["page"] = self.page;
            containerPagination.add(containerPage);

            self.__labelTotalPags = new qx.ui.basic.Label(self.tr("Total páginas: 0")).set({
                rich: true
            });
            self.ui["labelTotalPags"] = self.__labelTotalPags;
            containerPagination.add(self.__labelTotalPags, {
                flex: 1
            });

            var paginationSelect = new qx.ui.container.Composite(new qx.ui.layout.HBox().set({
                alignY: "middle"
            }));
            self.initIcon = new qx.ui.form.Button(self.tr(""), qxnw.config.execIcon("go-first")).set({
                show: "icon",
                maxHeight: 30
            });
            self.initIcon.addListener("execute", function () {
                var oldValue = self.ui["page"].getValue();
                if (oldValue != 1) {
                    self.page.setValue(1);
                    try {
                        if (self.checkSquareOrList() == "cuadros") {
                            self.createSquare(self.__loadedItems, self.__loadedItems.length, self.__carpeta, true);
                        } else {
                            self.createList(self.__loadedItems, self.__loadedItems.length, self.__carpeta, true);
                        }
                    } catch (e) {

                    }
                }
            });
            self.nextIcon = new qx.ui.form.Button(self.tr(""), qxnw.config.execIcon("go-next")).set({
                show: "icon",
                maxHeight: 30
            });
            self.nextIcon.addListener("execute", function () {
                var oldValue = self.ui["page"].getValue();
                if (oldValue != self.__maxPages) {
                    if (oldValue < self.__maxPages) {
                        oldValue = oldValue + 1;
                        self.ui["page"].setValue(oldValue);
                        try {
                            if (self.checkSquareOrList() == "cuadros") {
                                self.createSquare(self.__loadedItems, self.__loadedItems.length, self.__carpeta, true);
                            } else {
                                self.createList(self.__loadedItems, self.__loadedItems.length, self.__carpeta, true);
                            }
                        } catch (e) {
                            console.log(e);
                        }
                    }
                }
            });
            self.previousIcon = new qx.ui.form.Button(self.tr(""), qxnw.config.execIcon("go-previous")).set({
                show: "icon",
                maxHeight: 30
            });
            self.previousIcon.addListener("execute", function () {
                var oldValue = self.ui["page"].getValue();
                if (oldValue > 1) {
                    oldValue = oldValue - 1;
                    self.ui["page"].setValue(oldValue);
                    try {
                        if (self.checkSquareOrList() == "cuadros") {
                            self.createSquare(self.__loadedItems, self.__loadedItems.length, self.__carpeta, true);
                        } else {
                            self.createList(self.__loadedItems, self.__loadedItems.length, self.__carpeta, true);
                        }
                    } catch (e) {

                    }
                }
            });
            self.lastIcon = new qx.ui.form.Button(self.tr("Test"), qxnw.config.execIcon("go-last")).set({
                show: "icon",
                maxHeight: 30
            });
            self.lastIcon.addListener("execute", function () {
                if (self.__maxPages != null) {
                    self.page.setValue(self.__maxPages);
                    try {
                        if (self.checkSquareOrList() == "cuadros") {
                            self.createSquare(self.__loadedItems, self.__loadedItems.length, self.__carpeta, true);
                        } else {
                            self.createList(self.__loadedItems, self.__loadedItems.length, self.__carpeta, true);
                        }
                    } catch (e) {

                    }
                }
            });
            paginationSelect.add(self.initIcon);
            paginationSelect.add(self.previousIcon);
            paginationSelect.add(self.nextIcon);
            paginationSelect.add(self.lastIcon);
            containerPagination.add(paginationSelect);

            page.add(containerPagination);
        },
        loadCarpet: function loadCarpet(actual, carpet) {
            var self = this;
            var rpc = new qxnw.rpc(self.getRpcUrl(), "nw_file_manager");
            rpc.setAsync(true);
            var data = {};
            var carpeta = "";
            if (carpet != 'undefined') {
                carpeta = carpet;
            }
            carpeta = self.ruta.getValue();
            self.__carpeta = carpeta;
            data["carpet"] = self.ruta.getValue();
            data["buscar"] = self.buscarTextField.getValue();

            var selectedType = self.typesGroup.getSelection();
            if (typeof selectedType[0] != 'undefined') {
                data["type"] = selectedType[0].getModel();
            }

            var func = function (ra) {
                var r = ra["files"];
                self.setNoRows(ra["files"].length - (1 + ra["directories"].length), "files");
                self.setNoRows(ra["directories"].length > 0 ? ra["directories"].length - 1 : 0, "directories");
                var total = r.length;
                if (self.checkSquareOrList() == "cuadros") {
                    self.createSquare(r, total, carpeta);
                } else {
                    self.createList(r, total, carpeta);
                }
                self.populateTree(ra["directories"]);
            };
            rpc.exec("consulta_tree", data, func);
        },
        editFile: function editFile(pr) {
            var self = this;
            var d = new qxnw.forms();
            d.setTitle(pr);
            d.setColumnsFormNumber(0);
            var fields = [
                {
                    name: "id",
                    label: "ID",
                    type: "textField",
                    visible: false
                },
                {
                    name: "ruta",
                    label: self.tr("Ruta"),
                    type: "textField",
                    visible: false,
                    enabled: false
                },
                {
                    name: "texto",
                    label: self.tr("Código"),
                    type: "textArea"
                }
            ];
            d.setFields(fields);
            d.ui.ruta.setValue(pr);
            d.ui.texto.focus();
            var func = function (a) {
                d.ui.texto.setValue(a);
            };
            qxnw.utils.fastRpcAsyncCall("nw_file_manager", "readFile", pr, func);
            d.ui.accept.addListener("execute", function () {
                var r = d.getRecord();
                var funct = function (aa) {
                    d.close();
                    self.reloadWindow();
                };
                qxnw.utils.fastRpcAsyncCall("nw_file_manager", "saveEditFile", r, funct);
            });
            d.ui.cancel.addListener("execute", function () {
                d.reject();
            });
            d.setWidth(800);
            d.setHeight(600);
            d.setModal(true);
            d.show();
        },
        newCarpet: function newCarpet(pr) {
            var self = this;
            var d = new qxnw.forms();
            d.setTitle(self.tr("Nueva carpeta :: NW Group"));
            var fields = [
                {
                    name: "id",
                    label: "ID",
                    type: "textField",
                    visible: false
                },
                {
                    name: "ruta",
                    label: self.tr("Ruta"),
                    type: "textField",
                    visible: true,
                    enabled: false
                },
                {
                    name: "nombre",
                    label: self.tr("Nombre"),
                    type: "textField",
                    required: true
                }
            ];
            d.setFields(fields);
            d.ui.ruta.setValue(pr);
            d.ui.nombre.focus();
            d.ui.accept.addListener("execute", function () {
                if (!d.validate()) {
                    return;
                }
                var r = d.getRecord();
                var funct = function () {
                    d.close();
                    self.reloadWindow();
                };
                qxnw.utils.fastRpcAsyncCall("nw_file_manager", "save", r, funct);
            });
            d.ui.nombre.addListener("keypress", function (e) {
                if (e.getKeyIdentifier() == "Enter") {
                    if (!d.validate()) {
                        return;
                    }
                    var r = d.getRecord();
                    var funct = function () {
                        d.close();
                        self.reloadWindow();
                    };
                    qxnw.utils.fastRpcAsyncCall("nw_file_manager", "save", r, funct);
                }
            });
            d.ui.cancel.addListener("execute", function () {
                d.reject();
            });
            d.setMinWidth(400);
            d.setModal(true);
            d.show();
        },
        uploadFile: function uploadFile() {
            var self = this;
            var d = new qxnw.forms();
            d.setModal(true);
            d.set({
                showClose: false,
                showMinimize: false,
                showMaximize: false,
                maxHeight: 400
            });
            d.setTitle(self.tr("Subir archivos::NW Group"));
            var ruta = self.ruta.getValue();
            ruta = ruta.replace(/\./g, "$nw$");
            var fields = [
                {
                    name: "ruta",
                    label: self.tr("Archivo"),
                    type: "uploader_multiple",
                    mode: "destination=" + ruta
                }
            ];
            d.setFields(fields);
            d.ui.accept.addListener("execute", function () {
                var r = d.getRecord();
                if (r.ruta.length > 0) {
                    self.reloadWindow();
                }
                d.close();
            });
            d.ui.cancel.addListener("execute", function () {
                d.reject();
            });
            d.setMinWidth(300);
            d.setModal(true);
            d.show();
        },
        populateTree: function populateTree(r) {
            var self = this;
            if (typeof r == 'undefined') {
                r = [];
            }
            self.addTreeHeader("Carpetas " + "   : :  " + r.length, qxnw.config.execIcon("view-sort-descending"));
            var desk = self.addTreeFolder(self.tr("Escritorio"), qxnw.config.execIcon("user-home", "places"), 0, true);
            desk.addListener("click", function () {
                self.ruta.setValue(self.carpetaInicial);
                self.containerTest.removeAll();
                self.loadCarpet();
            });
            var initialPosition = 100;
            var oldParent = null;
            for (var i = 0; i < r.length; i++) {
                var prefix = "";
                var icon = "";
                var parent = {};
                var partes = r[i].parts;
                if (r[i].nombre != ".." && r[i].nombre != "." && r[i].extension == "") {
                    icon = qxnw.config.execIcon("document-open", "actions");
                    if (initialPosition < r[i].parts) {
                        parent["s" + i] = self.addTreeFile((prefix + r[i].nombre), icon, r[i].id, oldParent, 0, true);
                    } else {
                        parent["s" + i] = self.addTreeFolder((prefix + r[i].nombre), icon, r[i].id, 0, true);
                    }
                    parent["s" + i].setModel(r[i]);
                    parent["s" + i].addListener("click", function () {
                        var text = this.getModel();
                        var ruta = text.ruta;
                        self.ruta.setValue(ruta);
                        self.containerTest.removeAll();
                        self.loadCarpet(text.id, ruta);
                        self.atras.setEnabled(true);
                        self.positionsAlter++;
                    });
                    oldParent = parent["s" + i];
                }
                initialPosition = partes;
            }
        },
        seleccionarTodo: function seleccionarTodo() {
            var self = this;
            var children = self.containerTest.getChildren();
            for (var i = 0; i < children.length; i++) {
                qx.bom.element.Style.set(children[i].getContentElement().getDomElement(), "background", "gray");
                children[i].setUserData("selected", true);
            }
            return true;
        },
        openFile: function openFile(imagen) {
            var self = this;
            var r = {};
            r["imagen"] = imagen;
            if (r == 'undefined') {
                qxnw.utils.alert("Seleccione un registro");
                return;
            }
            var d = new qxnw.nw_file_manager.f_visto_imagenes();
            d.setModal(true);
            if (!d.setParamRecord(r)) {
                return;
            }
            d.settings.accept = function () {
                self.containerTest.removeAll();
                self.loadCarpet();
            };
//            d.setWidth(700);
//            d.setHeight(650);
            d.show();
        },
        abrirCarpeta: function abrirCarpeta(nombre, ruta) {
            var self = this;
            var placed = self.ruta.getValue();
            var placeh = ruta;
            if (nombre == "..") {
                var plt = placed.split("/");
                var lastCarpet = plt[plt.length - 1];
                placeh = placed.replace("/" + lastCarpet, "");
            }
            self.ruta.setValue(placeh);
            self.containerTest.removeAll();
            self.loadCarpet(0, placeh);
            self.atras.setEnabled(true);
            self.positions++;
        },
        cambiarNombre: function cambiarNombre(ruta, nombre, extension) {
            var self = this;
            var data = {};
            data["ruta"] = ruta;
            data["extension"] = extension;
            var f = new qxnw.forms();
            f.setModal(true);
            f.setTitle(self.tr("Cambiar nombre :: NW Group"));
            var fields = [
                {
                    name: "nombre_anterior",
                    type: "textField",
                    enabled: false
                },
                {
                    name: "nombre_nuevo",
                    type: "textField"
                }
            ];
            f.setFields(fields);
            f.ui.nombre_anterior.setValue(nombre);
            f.ui.nombre_nuevo.setValue(nombre);
            f.ui.accept.addListener("keypress", function (e) {
                if (e.getKeyIdentifier() == "Enter") {
                    var r = f.getRecord();
                    data["nombre_nuevo"] = r.nombre_nuevo;
                    data["nombre_anterior"] = r.nombre_anterior;
                    var rpc = new qxnw.rpc(self.getRpcUrl(), "nw_file_manager", true);
                    var func = function () {
                        f.accept();
                        self.containerTest.removeAll();
                        self.loadCarpet();
                    };
                    rpc.exec("changeName", data, func);
                }
            });
            f.ui.accept.addListener("execute", function () {
                var r = f.getRecord();
                data["nombre_nuevo"] = r.nombre_nuevo;
                data["nombre_anterior"] = r.nombre_anterior;
                var rpc = new qxnw.rpc(self.getRpcUrl(), "nw_file_manager", true);
                var func = function () {
                    f.accept();
                    self.containerTest.removeAll();
                    self.loadCarpet();
                };
                rpc.exec("changeName", data, func);
            });
            f.ui.cancel.addListener("execute", function () {
                f.reject();
            });
            f.show();
        },
        getContextMenuFiles: function (parent) {
            var self = this;
            var id = parent.getUserData("id");
            var text = parent.getUserData("text");
            var archivo = parent.getUserData("archivo");
            var extension = parent.getUserData("extension");
            var nombre = parent.getUserData("nombre");
            var type = parent.getUserData("filetype");
            var size = parent.getUserData("size");
            var permissions = parent.getUserData("permissions");
            var owner = parent.getUserData("owner");

            var menu = new qx.ui.menu.Menu;
            var open = new qx.ui.menu.Button("Abrir Carpeta", qxnw.config.execIcon("document-open"));
            var openFile = new qx.ui.menu.Button("Abrir Archivo", qxnw.config.execIcon("edit-find"));
            var rename = new qx.ui.menu.Button("Cambiar nombre", qxnw.config.execIcon("document-revert"));
            var downloadFile = new qx.ui.menu.Button("Descargar Archivo", qxnw.config.execIcon("document-save"));
            var deletteFolder = new qx.ui.menu.Button("Eliminar Carpeta", qxnw.config.execIcon("edit-delete"));
            var deletteFile = new qx.ui.menu.Button("Eliminar Archivo", qxnw.config.execIcon("edit-delete"));
            var propiedades = new qx.ui.menu.Button("Propiedades", qxnw.config.execIcon("system-run"));

            open.addListener("click", function () {
                self.containerTest.removeAll();
                self.abrirCarpeta(archivo, text);
                self.atras.setEnabled(true);
            });
            rename.addListener("click", function () {
                self.cambiarNombre(text, nombre, extension);
            });
            propiedades.addListener("click", function () {
                self.showProperties(text, nombre, extension, type, size, permissions, owner);
            });

            downloadFile.addListener("click", function () {
                self.slotVerAdjunto(archivo);
            });
            openFile.addListener("click", function () {
                self.openFile(archivo);
            });
            deletteFolder.addListener("click", function () {
                qxnw.utils.question("¿Está seguro de eliminar esta carpeta? (" + text + ")", function (e) {
                    if (e) {
                        self.deleteCarpet(text);
                    } else {
                        return;
                    }
                });
            });
            deletteFile.addListener("click", function () {
                qxnw.utils.question("¿Está seguro de eliminar este archivo?", function (e) {
                    if (e) {
                        self.deleteAppFile(text);
                    } else {
                        return;
                    }
                });
            });
            if (extension == "") {
                menu.add(open);
                menu.add(rename);
                menu.add(deletteFolder);
                menu.add(propiedades);
            } else {
                menu.add(openFile);
                menu.add(rename);
                menu.add(downloadFile);
                menu.add(deletteFile);
                menu.add(propiedades);
            }
            return menu;
        },
        slotVerAdjunto: function slotVerAdjunto(img) {
            var sl = window.location.hostname + img;
            var win = window.open(sl, '_blank');
            win.focus();
        },
        deleteCarpet: function deleteCarpet(id) {
            var self = this;
            var r = id;
            if (r == 'undefined') {
                qxnw.utils.alert("Seleccione un registro");
                return;
            }
            var rpc = new qxnw.rpc(this.rpcUrl, "nw_file_manager");
            var p = rpc.exec("eliminarCarpet", r);
            if (rpc.isError()) {
                qxnw.utils.alert(rpc.getError());
                return;
            }
            self.reloadWindow();
        },
        deleteAppFile: function deleteAppFile(ruta) {
            var self = this;
            if (typeof ruta == 'undefined') {
                var r = self.getSelectedImages();
            } else {
                var r = [ruta];
            }
            if (r == 'undefined' || r.length == 0) {
                return;
            }
            var rpc = new qxnw.rpc(self.getRpcUrl(), "nw_file_manager", true);
            var func = function () {
                self.reloadWindow();
            };
            rpc.exec("eliminarArchivo", r, func);
        }
    }
});