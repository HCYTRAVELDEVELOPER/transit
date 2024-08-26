qx.Class.define("qxnw.basics.forms.f_vista_general", {
    extend: qxnw.forms,
    construct: function () {
        var self = this;
        this.base(arguments);
        this.setTitle("Vista general");
        this.createBase();
        var fields = [
            {
                label: "",
                type: "startGroup",
                mode: "horizontal"
            },
            {
                label: "N° Ticket",
                name: "id",
                type: "textField",
                enabled: false
            },
            {
                label: "Fecha reporte",
                name: "fecha_reporte",
                type: "dateField",
                enabled: false
            },
            {
                label: "Nivel",
                name: "nivel",
                type: "textField",
                enabled: false
            },
            {
                label: "Estado",
                name: "estado",
                type: "textField",
                enabled: false
            },
            {
                type: "endGroup"
            },
            {
                label: "",
                type: "startGroup",
                mode: "horizontal"
            },
            {
                label: "Cliente",
                name: "cliente_text",
                type: "textField",
                enabled: false
            },
            {
                label: "Medio ingreso",
                name: "medio_ingreso",
                type: "textField",
                enabled: false
            },
            {
                label: "Tipo servicio",
                name: "tipo_servicio_text",
                type: "textField",
                enabled: false
            },
            {
                label: "Quien reporto",
                name: "quien_reporta",
                type: "textField",
                enabled: false
            },
            {
                type: "endGroup"
            },
            {
                label: "",
                type: "startGroup",
                mode: "horizontal"
            },
            {
                label: "Correo Quien Reporto",
                name: "correo_quien_reporto",
                type: "textField",
                enabled: false
            },
            {
                label: "Responsable de atencion",
                name: "atiende_text",
                type: "textField",
                enabled: false
            },
            {
                label: "Tiempo de respuesta(m)",
                name: "tiempo_respuesta",
                type: "textField",
                enabled: false
            },
            {
                type: "endGroup"
            },
            {
                label: "",
                type: "startGroup",
                mode: "horizontal"
            },
            {
                label: "Envio de correo",
                name: "enviar_correo",
                type: "checkBox",
                enabled: false
            },
            {
                label: "Adjunto",
                name: "adjunto",
                type: "uploader",
                enabled: false
            },
            {
                label: "Tipo ticket",
                name: "tipo_ticket_text",
                type: "textField",
                enabled: false
            },
            {
                label: "Programa",
                name: "programa_text",
                type: "textField",
                enabled: false
            },
            {
                label: "",
                type: "startGroup",
                mode: "horizontal"
            },
            {
                label: "Descripción de novedad",
                name: "novedad",
                type: "textArea",
                enabled: false
            },
            {
                label: "Diagnóstico",
                name: "diagnostico",
                type: "textArea",
                enabled: false
            },
            {
                type: "endGroup"
            },
            {
                label: "",
                type: "startGroup",
                mode: "horizontal"
            },
            {
                label: "Fecha de cierre(m)",
                name: "fecha_cierre",
                type: "textField",
                enabled: false
            },
            {
                label: "Responsable de cierre(m)",
                name: "responsable_cierre",
                type: "textField",
                enabled: false
            },
            {
                type: "endGroup"
            },
            {
                label: "",
                type: "startGroup",
                mode: "horizontal"
            },
            {
                label: "Observaciones de cierre(m)",
                name: "observaciones_cierre",
                type: "textArea",
                enabled: false
            },
            {
                type: "endGroup"
            }
        ];
        self.setFields(fields);


        self.navTable = new qxnw.navtable(self);
        self.navTable.setContextMenu("contextMenuUbicacion");
        var columns = [
            {
                label: "Avance ID",
                caption: "id",
                visible: false
            },
            {
                label: "Descripción de avance",
                caption: "observaciones",
                type: "html",
                mode: "toolTip"
            },
            {
                label: "adjunto",
                caption: "adjunto",
                type: "image"

            },
            {
                label: "Fecha de avance",
                caption: "fecha_avance"
            }
//            // , {caption: "calidad", label: self.tr(""), type: "html", colorHeader: "#019A49"}
        ];
        self.navTable.setColumns(columns);
        self.navTable.hideColumn("id");
        self.navTable.setTitle(self.tr("Avances"));
        self.nt = self.insertNavTable(self.navTable.getBase(), "Avances");
        //ocultar botones
        self.navTable.ui.addButton.setVisibility("excluded");
        self.navTable.ui.removeButton.setVisibility("excluded");
        var agregarButton = self.navTable.getAddButton();
        var deleteButton = self.navTable.getRemoveButton();


        self.navTableEs = new qxnw.navtable(self);
        self.navTableEs.setContextMenu("contextMenuUbicacion");
        var columnsEs = [
            {
                label: "id Escalamiento",
                caption: "id"
            },
            {
                label: "Fecha escalamiento",
                caption: "fecha_escalamiento"
            },
            {
                label: "Responsable Asignado",
                caption: "usuario_escalamiento_text"
            },
            {
                label: "Usuario que escalo",
                caption: "resp_que_escalo"
            },
            {
                label: "Diagnostico",
                caption: "diagnostico",
                mode: "toolTip"

            },
            {
                label: "Observaciones",
                caption: "observaciones",
                mode: "toolTip"

            },
            {
                label: "Evidencia",
                caption: "evidencia"
            }
        ];
        self.navTableEs.setColumns(columnsEs);
        self.navTableEs.hideColumn("id");
        self.navTableEs.setTitle(self.tr("Escalamiento"));
        self.nt = self.insertNavTable(self.navTableEs.getBase(), "Escalamiento");
        self.navTableEs.ui.addButton.setVisibility("excluded");
        self.navTableEs.ui.removeButton.setVisibility("excluded");

        self.navMensajesAdjuntos = new qxnw.navtable(self);
        var columnsMens = [
            {
                label: "id",
                caption: "id",
                visible: false
            },
            {
                label: "Ticket",
                caption: "ticket",
                visible: false
            },
            {
                label: "Adjunto ruta",
                caption: "adjunto",
                visible: false
            },
            {
                label: self.tr("Adunto"),
                caption: "adjunto_img",
                type: "html"
            },
            {
                label: "Mensaje",
                caption: "mensaje",
                type: "html",
                mode: "toolTip"
            },
            {
                label: "Fecha",
                caption: "fecha"
            },
            {
                label: "Usuario",
                caption: "usuario",
                visible: false

            },
            {
                label: "Empresa",
                caption: "empresa",
                visible: false
            },
            {
                label: "Cliente",
                caption: "cliente",
                visible: false
            }
        ];
        self.navMensajesAdjuntos.setColumns(columnsMens);
        self.navMensajesAdjuntos.hideColumn("id");
        self.navMensajesAdjuntos.setTitle(self.tr("Mensajes y Adjuntos"));
        self.insertNavTable(self.navMensajesAdjuntos.getBase(), "Mensajes y Adjuntos");
        self.navMensajesAdjuntos.ui.addButton.setVisibility("excluded");
        self.navMensajesAdjuntos.ui.removeButton.setVisibility("excluded");
        self.navMensajesAdjuntos.table.setRowHeight(50);
        self.navMensajesAdjuntos.table.getTableColumnModel().setColumnWidth(3, 180);
        self.navMensajesAdjuntos.table.addListener("cellTap", function (e) {
            var col = e.getColumn();
            console.log(col);
            switch (col) {
                case 3:
                    self.slotVerAdjunto();
                    break;
            }
        });


        self.navTableTraza = new qxnw.navtable(self);
        self.navTableTraza.setContextMenu("contextMenuUbicacion");
        var columnsEs = [
            {
                label: "Id Trazabilidad",
                caption: "id"
            },
            {
                label: "Fecha Trazabilidad",
                caption: "fecha"
            },
            {
                label: "Adjunto",
                caption: "evidencia"
            },
            {
                label: "Comentarios",
                caption: "comentarios",
                mode: "toolTip"
            },
            {
                label: "id estado",
                caption: "estado"
            },
            {
                label: "Estado",
                caption: "estado_text"
            },
            {
                label: "Usuario",
                caption: "usuario"
            }
        ];
        self.navTableTraza.setColumns(columnsEs);
        self.navTableTraza.hideColumn("id");
        self.navTableTraza.hideColumn("estado");
        self.navTableTraza.setTitle(self.tr("Trazabilidad Ticket"));
        self.insertNavTable(self.navTableTraza.getBase(), "Trazabilidad Ticket");
        self.navTableTraza.ui.addButton.setVisibility("excluded");
        self.navTableTraza.ui.removeButton.setVisibility("excluded");
        self.navTableTraza.setHaveToolTip(true);

        self.ui.accept.addListener("execute", function () {
        });
        self.ui.accept.setVisibility("excluded");

    },
    destruct: function () {
    },
    members: {
        pr: null,
        slotVerAdjunto: function slotVerAdjunto() {
            var self = this;
            var sl = self.navMensajesAdjuntos.selectedRecord();
            var win = window.open("https://nwadmin.gruponw.com" + sl.adjunto, '_blank');
            win.focus();
        },
        setParamRecord: function setParamRecord(pr) {
            var self = this;
            self.setRecord(pr);
            self.populateAvances(pr.id);
            self.populateEscalamiento(pr.id);
            self.populateTrazabilidad(pr.id);
            self.populateMensajesAdjuntos(pr.id);
        },
        populateTrazabilidad: function populateTrazabilidad(pr) {
            var self = this;
            var data = {};
            data.id = pr;
            data.method = "populateTrazabilidadTK";
//            data.class_param = "tk_tickets";
            var rpc = new qxnw.rpc(self.getRpcUrl(), "nw_configuraciones");
            rpc.setAsync(true);
            var func = function (r) {
                self.navTableTraza.setModelData(r);
            };
            rpc.exec("populateConsultasTK", data, func);
        },
        populateAvances: function populateAvances(pr) {
            var self = this;
            var data = {};
            data.id = pr;
            data.method = "populateAvancesTK";
            var rpc = new qxnw.rpc(self.getRpcUrl(), "nw_configuraciones");
            rpc.setAsync(true);
            var func = function (r) {
                self.navTable.setModelData(r);
            };
            rpc.exec("populateConsultasTK", data, func);
        },
        populateEscalamiento: function populateEscalamiento(pr) {
            var self = this;
            var data = {};
            data.id = pr;
            data.method = "populateEscalamientoTK";
            var rpc = new qxnw.rpc(self.getRpcUrl(), "nw_configuraciones");
            rpc.setAsync(true);
            var func = function (r) {
                self.navTableEs.setModelData(r);
            };
            rpc.exec("populateConsultasTK", data, func);
        },
        populateMensajesAdjuntos: function populateMensajesAdjuntos(pr) {
            var self = this;
            var data = {};
            data.id = pr;
            data.method = "populateMensajesAdjuntos";
            var rpc = new qxnw.rpc(self.getRpcUrl(), "nw_configuraciones");
            rpc.setAsync(true);
            var func = function (r) {
                for (var i = 0; i < r.length; i++) {
                    var response = r[i].adjunto;
                    var ext = qxnw.utils.getExtension(response);
                    console.log(ext);
                    switch (ext) {
                        case "doc":
                            r[i].adjunto_img = "<div style='display: flex; justify-content: space-evenly; align-items: center;'><img class='imgdoc' src='/nwlib6/icons/48/word.png'><div><a class=\"qxnw_verimgButton\" target=\"_blank\">Ver adjunto</a></div></div>";
                            break;
                        case "docx":
                            r[i].adjunto_img = "<div style='display: flex; justify-content: space-evenly; align-items: center;'><img class='imgdoc' src='/nwlib6/icons/48/word.png'><div><a class=\"qxnw_verimgButton\" target=\"_blank\">Ver adjunto</a></div></div>";
                            break;
                        case "pdf":
                            r[i].adjunto_img = "<div style='display: flex; justify-content: space-evenly; align-items: center;'><img class='imgdoc' src='/nwlib6/icons/48/pdf.png'><div><a class=\"qxnw_verimgButton\" target=\"_blank\">Ver adjunto</a></div></div>";
                            break;
                        case "XLSX":
                            r[i].adjunto_img = "<div style='display: flex; justify-content: space-evenly; align-items: center;'><img class='imgdoc' src='/nwlib6/icons/48/excel.png'><div><a class=\"qxnw_verimgButton\" target=\"_blank\">Ver adjunto</a></div></div>";
                            break;
                        case "xlsx":
                            r[i].adjunto_img = "<div style='display: flex; justify-content: space-evenly; align-items: center;'><img class='imgdoc' src='/nwlib6/icons/48/excel.png'><div><a class=\"qxnw_verimgButton\" target=\"_blank\">Ver adjunto</a></div></div>";
                            break;
                        case "pptx":
                            r[i].adjunto_img = "<div style='display: flex; justify-content: space-evenly; align-items: center;'><img class='imgdoc' src='/nwlib6/icons/48/PowerPoint-icon.png'><div><a class=\"qxnw_verimgButton\" target=\"_blank\">Ver adjunto</a></div></div>";
                            break;

                        default:
                            r[i].adjunto_img = "<div style='display: flex; justify-content: space-evenly; align-items: center;'><img class='imgdoc' src='/nwlib6/icons/48/image.png'><div><a class=\"qxnw_verimgButton\" target=\"_blank\">Ver adjunto</a></div></div>";
                            break;
                    }
                }
                self.navMensajesAdjuntos.setModelData(r);
            };
            rpc.exec("populateConsultasTK", data, func);
        }

    }
});


