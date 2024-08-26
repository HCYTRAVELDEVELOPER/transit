function f_salas_usuarios(parentSelf) {
    var self = createDocument(".f_salas_usuarios");
    var thisDoc = this;
    thisDoc.constructor = constructor;
    thisDoc.updateContend = updateContend;
    thisDoc.self = self;
    var c = getConfigApp();
    function constructor(ra) {
        var fields = [
            {
                tipo: 'textField',
                nombre: 'ID',
                name: 'id',
                requerido: "SI",
                visible: false,
                enabled: false
            },
            {
                tipo: 'textField',
                nombre: 'Usuario',
                name: 'usuario_cliente',
                requerido: "SI",
                visible: true,
                enabled: false
            },
            {
                title: "Seleccione la sala a agregar al usuario",
                mode: "vertical",
                name_group: "contenedor_3",
                numberCols: "1",
                tipo: "startGroup"
            },
            {
                tipo: 'selectBox',
                nombre: 'Nombre',
                name: 'salas',
                requerido: "NO"
            },
            {
                tipo: 'button',
                nombre: 'Agregar',
                name: 'agregar_a'
            },
            {
                tipo: "endGroup"
            }
        ];

        var typeForm = "popup";
        createNwForms(self, fields, typeForm);

/*
        setVisibility(self, "id", false);
 */

        setColumnsFormNumber(self, 2);

        setModal(true);

        setWidth(self, 700);

        var data = {};
        data[""] = "Seleccione";
        populateSelectFromArray("salas", data);
        populateSelect(self, "salas", "nwMaker", "consultaSalas", data);

        addCss(self, ".contenedor_3", {"width": "100%"});

        loadJs("/nwlib6/nwproject/modules/nw_user_session/js/lists/l_salas_usuarios.js");
        thisDoc.navTable = addNavTable(self, "contenedor_3", l_salas_usuarios, ra);

        var btn = selfButton(self, "agregar_a");
        btn.click(function () {
            var data = getRecordNwForm(self);
            var d = data.salas_all_data;
            console.log(d);
            var rows = getDataNavTable(thisDoc.navTable, true);
            if (rows.length > 0) {
                for (var i = 0; i < rows.length; i++) {
                    var row = rows[i];
                    console.log(row);
                    console.log(d.id);
                    if (row["seccion"] === d.id.toString()) {
                        nw_dialog("este servicio ya ha sido asignado.");
                        return;
                    }
                }
            }
            var de = {};
            de.id = "";
            de.seccion = d.id;
            de.seccion_text = d.nombre;
            de.tiempo_minimo_duracion_cita = d.tiempo_minimo_duracion_cita;
            addRowNavTable(thisDoc.navTable, de);
            var elimi = addButtonContextMenu(thisDoc.navTable, "Eliminar", "contextSelect");
            removeButtonContextMenu(self, ".contextList");
            elimi.click(function () {
                var r = getSelectedRecord(thisDoc.navTable);
                var selfNew = generateSelf();
                createNwForms(selfNew, false, "popUp");
                addHeaderNote(selfNew, "¿Desea eliminar este registro?");
                setModal(true);
                setWidth(selfNew, 300);
                $(selfNew + ".footerButtonsNwForms").css("display:none");
                var accept = addButtonNwForm("Aceptar", selfNew);
                accept.click(function () {
                    var data = {};
                    data["id"] = r["id"];
                    data["table"] = "sop_secciones_usuarios";
                    deleteRecordForId(data);
                    reject(selfNew);
                    removeRow(thisDoc.navTable);
                });
            });
            setValue(self, "perfiles", "");
        });

        var up = getUserInfo();

        var accept = addButtonNwForm("Guardar", self);
        var cancel = addButtonNwForm("Cancelar", self);

        cancel.click(function () {
            rejectForm(self, typeForm);
        });

        accept.click(function () {
            if (!validateRequired(self)) {
                return;
            }
            var data = getRecordNwForm(self);
            data["detalle"] = getDataNavTable(thisDoc.navTable);
            console.log(data);
            var rpc = {};
            rpc["service"] = "nwMaker";
            rpc["method"] = "saveSalasByUser";
            rpc["data"] = data;
            var func = function (r) {
                console.log(r);
                if (!verifyErrorNwMaker(r, self) || verifyErrorNwMaker(r, self) === 0) {
                    return;
                }
                if (r === "yaexiste") {
                    nw_dialog("Este usuario ya existe");
                    return false;
                }
                if (typeof parentSelf !== "undefined") {
                    parentSelf.updateContend();
                }
                rejectForm(self, typeForm);
            };
            rpcNw("rpcNw", rpc, func);
        });

        removeLoadingNw();
    }

    function updateContend(ra) {
        setRecord(self, ra);
    }

}