function f_usuarios_nwmaker(openOutside, parentSelf) {
    var self = createDocument(".f_usuarios_nwmaker");
    var thisDoc = this;
    this.constructor = constructor;
    this.updateContend = updateContend;
    this.self = self;
    var c = getConfigApp();
    function constructor(newuser) {
        var fields = [];
        fields.push(
                {
                    title: 'Nombre',
                    mode: 'horizontal',
                    name_group: 'filters_visible',
                    numberCols: '1', tipo: 'startGroup'
                },
                {
                    tipo: 'textField',
                    nombre: 'ID',
                    name: 'id',
                    requerido: "NO",
                    visible: true,
                    enabled: false
                },
                {
                    tipo: 'uploader',
                    nombre: 'Foto de perfil',
                    name: 'foto_perfil',
                    requerido: "NO"
                },
                {
                    tipo: 'textField',
                    nombre: 'Nombre',
                    name: 'nombre',
                    requerido: "SI"
                },
                {
                    tipo: 'textField',
                    nombre: 'Apellido',
                    name: 'apellido',
                    requerido: "SI"
                },
                {
                    tipo: 'endGroup'
                }
        );
        fields.push(
                {
                    title: 'Datos',
                    mode: 'horizontal',
                    name_group: 'filters_visible',
                    numberCols: '1', tipo: 'startGroup'
                },
                {
                    tipo: 'selectBox',
                    nombre: 'Estado conexión',
                    name: 'estado_conexion',
                    requerido: "SI",
                    visible: false
                },
                {
                    tipo: 'selectBox',
                    nombre: 'Perfil',
                    name: 'perfil',
                    requerido: "SI"
                },
                {
                    tipo: 'selectBox',
                    nombre: 'Género',
                    name: 'genero',
                    requerido: "SI"
                },
                {
                    tipo: 'selectBox',
                    nombre: 'Profesión',
                    name: 'profesion',
                    requerido: "NO"
                },
                {
                    tipo: 'textField',
                    nombre: 'Cargo',
                    name: 'cargo_actual',
                    requerido: "NO"
                },
                {
                    tipo: 'selectBox',
                    nombre: 'Sala principal',
                    name: 'sala',
                    requerido: "NO"
                },
                {
                    tipo: 'selectBox',
                    nombre: 'País',
                    name: 'pais',
                    requerido: "NO"
                },
                {
                    tipo: 'textField',
                    nombre: 'Extensión PBX',
                    name: 'extension_pbx',
                    requerido: "NO"
                },
                {
                    tipo: 'textField',
                    nombre: 'Celular',
                    name: 'celular',
                    requerido: "NO"
                }
        );
        if (evalueData(c.config_datauser)) {
            if (c.config_datauser.fecha_nacimiento === true) {
                fields.push(
                        {
                            tipo: 'dateField',
                            nombre: 'Fecha de nacimiento',
                            name: 'fecha_nacimiento',
                            requerido: "SI"
                        }
                );
            }
            if (c.config_datauser.tarifa === true) {
                fields.push(
                        {
                            tipo: 'textField',
                            nombre: 'Tarifa',
                            name: 'tarifa',
                            requerido: "SI"
                        }
                );
            }
            if (c.config_datauser.descripcion === true) {
                fields.push(
                        {
                            tipo: 'textArea',
                            nombre: 'Descripción',
                            name: 'descripcion',
                            requerido: "SI"
                        }
                );
            }
        }
        fields.push(
                {
                    title: 'Datos cuenta',
                    mode: 'horizontal',
                    name_group: 'filters_visible',
                    numberCols: '1', tipo: 'startGroup'
                },
                {
                    tipo: 'textField',
                    nombre: 'Correo (es el mismo usuario)',
                    name: 'usuario_cliente',
                    requerido: "SI"
                }
        );

        if (newuser !== false) {
            fields.push({
                tipo: 'password',
                nombre: 'Clave',
                name: 'clave',
                requerido: "SI"
            });
        }
        fields.push({
            tipo: 'endGroup'
        });


        fields.push(
                {
                    title: 'Horarios (formato 24 horas)',
                    mode: 'horizontal',
                    name_group: 'filters_visible_horario',
                    numberCols: '1',
                    tipo: 'startGroup'
                }
        );
        fields.push(
                {
                    tipo: 'time',
                    nombre: 'Horario ingreso',
                    name: 'horario_task_ingreso'
                }
        );
        fields.push(
                {
                    tipo: 'time',
                    nombre: 'Horario salida',
                    name: 'horario_task_salida'
                }
        );
        fields.push(
                {
                    tipo: 'time',
                    nombre: 'Horario almuerzo inicio',
                    name: 'horario_task_almuerzo_inicio'
                }
        );
        fields.push(
                {
                    tipo: 'time',
                    nombre: 'Horario almuerzo finaliza',
                    name: 'horario_task_almuerzo_finaliza'
                }
        );
        fields.push({
            tipo: 'endGroup'
        });

        var typeForm = "popup";
        createNwForms(self, fields, typeForm);

        if (newuser === false) {
            setEnabled(self, "usuario_cliente", true);
        }

        setVisibility(self, "id", false);
        setVisibility(self, "sala", false);
        setVisibility(self, "profesion", false);
        setVisibility(self, "cargo_actual", false);
        setVisibility(self, "pais", false);
        setVisibility(self, "extension_pbx", false);

        setValue(self, "foto_perfil", "/nwlib6/icons/2017/user.png");

        setColumnsFormNumber(self, 2);

        setModal(true);

        setWidth(self, 700);

        var up = getUserInfo();

        var data = {};
        data[""] = "Seleccione";
        populateSelectFromArray("perfil", data);
        populateSelectFromArray("profesion", data);
        populateSelectFromArray("sala", data);

        var data = {};
        data["activo"] = "Activo";
        data["inactivo"] = "Inactivo";
        populateSelectFromArray("estado", data);

        var data = {};
        data["hombre"] = "Hombre";
        data["mujer"] = "Mujer";
        populateSelectFromArray("genero", data);

        var data = {};
        data["desconectado"] = "Desconectado";
        data["conectado"] = "Conectado";
        populateSelectFromArray("estado_conexion", data);

        populateSelect(self, "perfil", "nwMaker", "consultaPerfiles", data);

        if (evalueData(c.config_datauser)) {
            if (c.config_datauser.cargo_actual === true) {
                setVisibility(self, "cargo_actual", true);
            }
            if (c.config_datauser.professional_data === true) {
                setVisibility(self, "profesion", true);
                populateSelect(self, "profesion", "nwMaker", "consultaProfesiones", data);
            }
            if (c.config_datauser.salas === true) {
                setVisibility(self, "sala", true);
                populateSelect(self, "sala", "nwMaker", "consultaSalas", data);
            }
            if (c.config_datauser.pais === true) {
                setVisibility(self, "pais", true);
                populateSelect(self, "pais", "nwMaker", "consultaPaises", data);
            }
            if (c.config_datauser.extension_pbx === true) {
                setVisibility(self, "extension_pbx", true);
            }
        }
        var accept = addButtonNwForm("Guardar", self);
        var cancel = addButtonNwForm("Cancelar", self);

        cancel.click(function () {
            rejectForm(self, typeForm);
        });

        accept.click(function () {
            var data = getRecordNwForm(self);
            if (!validateRequired(self)) {
                return;
            }
            data.usuario_cliente = stripTags(data.usuario_cliente);
            data.usuario_cliente = cleanName(data.usuario_cliente);

            if (evalueData(data.horario_task_ingreso) && evalueData(data.horario_task_salida)) {
                data.horario_task = '["' + data.horario_task_ingreso + '", "' + data.horario_task_salida + '"]';
            }
            if (evalueData(data.horario_task_almuerzo_inicio) && evalueData(data.horario_task_almuerzo_finaliza)) {
                data.horario_task_almuerzo = '["' + data.horario_task_almuerzo_inicio + '", "' + data.horario_task_almuerzo_finaliza + '"]';
            }
            var rpc = {};
            rpc["service"] = "nwMaker";
            rpc["method"] = "saveMyUsuariosNwMaker";
            rpc["data"] = data;
            console.log("data", data);
            loading("Cargando...", "rgba(255, 255, 255, 0.76)!important", self);
            var func = function (r) {
                removeLoading(self);
                if (!verifyErrorNwMaker(r, self) || verifyErrorNwMaker(r, self) === 0) {
                    return;
                }
                if (r === "yaexiste") {
                    nw_dialog("Este usuario ya existe");
                    return false;
                }
                if (openOutside === true) {
                    window.location.reload();
                }
                if (typeof parentSelf !== "undefined") {
                    parentSelf.updateContend();
                }
                rejectForm(self, typeForm);
            };
            rpcNw("rpcNw", rpc, func);
        });
    }

    function updateContend(ra) {
        console.log("ra", ra);

        if (evalueData(ra.horario_task)) {
            var dat = JSON.parse(ra.horario_task);
            console.log("dat", dat);
            ra.horario_task_ingreso = dat[0];
            ra.horario_task_salida = dat[1];
        }
        if (evalueData(ra.horario_task_almuerzo)) {
            var dat = JSON.parse(ra.horario_task_almuerzo);
            console.log("dat", dat);
            ra.horario_task_almuerzo_inicio = dat[0];
            ra.horario_task_almuerzo_finaliza = dat[1];
        }
        setRecord(self, ra);
        setVisibility(self, "estado_conexion", true);
    }

}