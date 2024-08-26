
function myProfile(d) {
    var self = generateSelf(false, true);
    createTreeNwMaker(self);
    var fields = [
        {
            type: 'carpet',
            label: 'Cuenta',
            name: 'cuenta',
            depend: false
        },
        {
            type: 'file',
            label: 'Contraseña',
            name: 'contrasena',
            depend: false
        }
    ];
    addFieldsLeftInTree(self, fields);
    selfButton(self, "cuenta").click(function () {
        loadRightFuncTree(self, "editDataPersonal");
    });
    selfButton(self, "contrasena").click(function () {
        loadRightFuncTree(self, "changePass");
    });
    editDataPersonal(self + " .container-treen_rigth");
    removeLoadingNw();
}

function editDataPersonal(pr) { 
    empty(".loadModulosCenter");
    var up = getUserInfo();
    if (typeof up["usuario"] == "undefined") {
        return false;
    }
    var c = getConfigApp();
    var classDocument = ".editDataPersonal";
    var self = generateSelf(classDocument);
    if (pr != undefined) {
        if (pr != "popup") {
            self = pr;
        }
    }
    var fields = [];
    fields.push(
            {
                title: "Foto de Perfil y Portada",
                mode: "horizontal",
                name_group: "contenedor_1",
                numberCols: "1",
                tipo: "startGroup"
            },
            {
                tipo: 'textField',
                nombre: 'ID',
                name: 'id',
                visible: false
            }
    );
    fields.push(
            {
                tipo: 'uploader',
                nombre: 'Foto de perfil',
                name: 'foto_perfil',
                requerido: "SI"
            }
    );
    if (evalueData(c.config_datauser)) {
        if (c.config_datauser.professional_data === true) {
            fields.push(
                    {
                        tipo: 'uploader',
                        nombre: 'Foto de portada',
                        name: 'foto_portada',
                        requerido: "NO"
                    }
            );
        }
    }
    fields.push(
            {
                tipo: "endGroup"
            },
            {
                title: "Datos Básicos",
                mode: "horizontal",
                name_group: "contenedor_2",
                numberCols: "1",
                tipo: "startGroup"
            },
            {
                tipo: 'textField',
                mode: 'email',
                nombre: 'Correo / Usuario',
                name: 'email',
                requerido: "SI",
                enabled: false
            },
            {
                tipo: 'textField',
                nombre: 'Nombre',
                name: 'nombre',
                requerido: "SI"
            },
            {
                tipo: 'textField',
                nombre: 'Apellidos',
                name: 'apellido',
                requerido: "SI"
            },
            {
                tipo: 'textField',
                nombre: 'Documento',
                name: 'nit',
                requerido: "SI",
                enabled: true
            }

    );
    fields.push(
            {
                tipo: 'selectBox',
                nombre: 'País',
                name: 'pais',
                requerido: "SI"
            }
    );
    fields.push(
            {
                tipo: 'selectBox',
                nombre: 'Ciudad',
                name: 'ciudad',
                requerido: "SI"
            }
    );
    fields.push(
            {
                tipo: 'dateField',
                nombre: 'Fecha de Nacimiento',
                name: 'fecha_nacimiento',
                requerido: "SI"
            }
    );
    fields.push(
            {
                tipo: 'textField',
                mode: 'integer',
                nombre: 'Celular',
                name: 'celular',
                requerido: "NO"
            },
            {
                tipo: "endGroup"
            },
            {
                title: "Datos Profesionales",
                mode: "horizontal",
                name_group: "contenedor_3",
                numberCols: "1",
                tipo: "startGroup"
            },
            {
                tipo: 'selectBox',
                nombre: 'Área',
                name: 'departamento',
                requerido: "NO"
            },
            {
                tipo: 'selectBox',
                nombre: 'Profesión',
                name: 'profesion',
                requerido: "NO"
            },
            {
                tipo: 'textField',
                nombre: 'Cargo Actual',
                name: 'cargo_actual',
                requerido: "NO"
            },
            {
                tipo: 'textField',
                nombre: 'Empresa donde labora',
                name: 'empresa_labora',
                requerido: "NO"
            },
            {
                tipo: 'textArea',
                nombre: 'Descripción corta',
                name: 'descripcion',
                requerido: "NO"
            },
            {
                tipo: 'textArea',
                nombre: 'Tags',
                name: 'tags',
                requerido: "NO"
            },
            {
                tipo: "endGroup"
            }
    );

    pr = "nopopup";
    if (pr == "popup") {
        createNwForms(self, fields, "popUp");
    } else {
        createNwForms(self, fields);
    }
    setColumnsFormNumber(self, 2);

    setModal(true);
    setWidth(self, 800);

    var data = {};
    data[""] = "Seleccione";
    populateSelectFromArray("pais", data);
    populateSelectFromArray("departamento", data);
    populateSelectFromArray("profesion", data);

    var data = {};
    data["table"] = "paises";
    populateSelect(self, "pais", "nwprojectOut", "populate", data, " order by nombre asc ");

    var data = {};
    data['table'] = 'nwmaker_departamentos';
    data['bindValues'] = {};
    data['bindValues']['terminal'] = up.terminal;
    populateSelect(self, 'departamento', 'nwprojectOut', 'populate', data, ' and terminal=:terminal');

    var data = {};
    data['table'] = 'nwmaker_login_profesiones';
    data['bindValues'] = {};
    data['bindValues']['terminal'] = up.terminal;
    populateSelect(self, 'profesion', 'nwprojectOut', 'populate', data, ' and terminal=:terminal');

    $(self + " #pais").change(function () {
        generateCities();
    });

    $(self + " .contain_input_name_foto_portada").addClass("portadeEditeing");

    function generateCities() {
        var data = getRecordNwForm(self);
        var pais = data["pais"];
        $(self + " #ciudad").empty();
        var data = {};
        data[""] = "Seleccione";
        populateSelectFromArray("ciudad", data);

        var data = {};
        data["bindValues"] = {};
        data["bindValues"]["pais"] = pais;
        data["table"] = "ciudades";
        populateSelect(self, "ciudad", "nwprojectOut", "populate", data, " and pais_id=:pais order by nombre asc");
    }

    $(self + " .uploader_foto_portada").attr("self-div", self + " #nwform");
    $(self + " .uploader_foto_perfil").attr("self-div", self + " #nwform");

    var html = "<h2 style='text-align:center;'>Por favor complete su perfil.</h2>";
    addHeaderNote(self, html);

    var data = {};
    data["table"] = "nwmaker_perfiles";
    populateSelect(self, "perfil", "nwprojectOut", "populate", data);

    if (evalueData(c.config_datauser)) {
        if (c.config_datauser.professional_data === false) {
            addCss(self, ".contenedor_3", {"display": "none"});
        }
        if (c.config_datauser.fecha_nacimiento === false) {
            setRequired(self, "fecha_nacimiento", false);
            setVisibility(self, "fecha_nacimiento", false);
        }
        if (c.config_datauser.ciudad === false) {
            setRequired(self, "ciudad", false);
            setVisibility(self, "ciudad", false);
        }
    }

    var rpc = {};
    rpc["service"] = "nwprojectOut";
    rpc["method"] = "getInfoUserperfil";
    var func = function (r) {
        if (!verifyErrorNwMaker(r, self)) {
            return;
        }
        if (evalueData(r.documento)) {
            r.nit = r.documento;
        }
        if (evalueData(r.foto)) {
            r.foto_perfil = r.foto;
        }
        if (!evalueData(r.pais)) {
            var html = "<h1 style='text-align:center;'>¡Bienvenido!</h1>";
            addHeaderNote(self, html);
        }
        setRecord(self, r);
        generateCities();
        setValue(self, "ciudad", r["ciudad"]);
        removeLoadingNw();
    };
    rpcNw("rpcNw", rpc, func, true);

    var cancel = addButtonNwForm("Volver", self);
    cancel.addClass("cancel_btn");
    cancel.click(function () {
        reject(self);
        loadHomeNwMaker();
    });

    var accept = addButtonNwForm("Guardar", self);
    accept.addClass("accept_btn");
    accept.click(function () {
        if (!validateRequired(self)) {
            return;
        }
        var data = getRecordNwForm(self);
        var rpc = {};
        rpc["service"] = "nwprojectOut";
        rpc["method"] = "updateInfoUserperfil";
        rpc["data"] = data;
        var func = function (r) {
            if (!verifyErrorNwMaker(r, self)) {
                return;
            }
            window.location.reload();
            reject(self);
        };
        rpcNw("rpcNw", rpc, func, true);
    });
}

function changePass(pr, user, admin) {
    var self = generateSelf();
    if (pr != undefined) {
        if (pr != "popup") {
            self = pr;
        }
    }
    var fields = [];
    fields.push(
            {
                tipo: 'textField',
                nombre: 'Usuario',
                name: 'usuario',
                requerido: "SI",
                enabled: false
            }
    );
    if (admin !== true) {
        fields.push(
                {
                    tipo: 'password',
                    nombre: 'Contraseña actual',
                    name: 'pass_actual',
                    requerido: "SI"
                }
        );
    }
    fields.push(
            {
                tipo: 'password',
                nombre: 'Nueva Contraseña',
                name: 'clave',
                requerido: "SI"
            },
            {
                tipo: 'password',
                nombre: 'Confirmar Contraseña',
                name: 'clave_confirm',
                requerido: "SI"
            }
    );

    if (pr == "popup") {
        createNwForms(self, fields, "popUp");
    } else {
        createNwForms(self, fields);
    }

    var up = getUserInfo();
    if (evalueData(user)) {
        setValue(self, "usuario", user);
    } else {
        setValue(self, "usuario", up.usuario);
    }


    setColumnsFormNumber(self, 1);

    var html = "<h3>Cambiar contraseña</h3>";
    addHeaderNote(self, html);

    var cancel = addButtonNwForm("Volver", self);
    var accept = addButtonNwForm("Aceptar", self);

    accept.click(function () {
        if (!validateRequired(self)) {
            return false;
        }
        var data = getRecordNwForm(self);
        if (data.clave !== data.clave_confirm) {
            nw_dialog("Las contraseñas no coinciden");
            return false;
        }
        if (admin === true) {
            data.admin = true;
        }
        var rpc = {};
        rpc["service"] = "nwprojectOut";
        rpc["method"] = "updatePassNwMaker";
        rpc["data"] = data;
        var func = function (r) {
            if (r == "0") {
                nw_dialog("Lo sentimos, la contraseña actual que digitaste no coincide con la registrada.");
                return;
            }
            if (r) {
                window.location.reload();
                reject(self);
            } else {
                nw_dialog("A ocurrido un error: " + r);
            }
        };
        rpcNw("rpcNw", rpc, func);
    });

    cancel.click(function () {
        reject(self);
    });

    removeLoadingNw();

}

function createPayPlataform(pr) {
    var self = generateSelf();

    if (pr != undefined) {
        self = pr;
    }

    var fields = [
        {
            tipo: 'selectBox',
            nombre: 'Plan',
            name: 'plan',
            requerido: "SI"
        },
        {
            tipo: 'textArea',
            nombre: 'Características',
            name: 'caracteristicas',
            enabled: false
        },
        {
            tipo: 'textField',
            mode: "money",
            nombre: 'Valor',
            name: 'valor',
            requerido: "SI",
            enabled: false
        },
        {
            tipo: 'selectBox',
            nombre: 'Forma de pago',
            name: 'forma_pago',
            requerido: "SI"
        }
    ];

    createNwForms(self, fields);

    setColumnsFormNumber(self, 1);
    setWidth(self, 800);

    var data = {};
    data[""] = "Seleccione";
    data["debito"] = "Online";
    populateSelectFromArray("forma_pago", data);

    var data = {};
    data[""] = "Seleccione";
    populateSelectFromArray("plan", data);

    data = {};
    data["table"] = "nwmaker_planes";
    populateSelect(self, "plan", "nwprojectOut", "populate", data);


    actionInColForm(self, "plan").change(function () {
        var d = getValue(self, this);
        if (evalueData(d)) {
            var rpc = {};
            rpc["service"] = "nwMaker";
            rpc["method"] = "consultaPlanesPorID";
            rpc["data"] = d;
            var func = function (r) {
                if (r == false) {
                    nw_dialog("A ocurrido algo ineserado: " + r);
                } else {
                    setValue(self, "caracteristicas", r["descripcion"]);
                    setValue(self, "valor", r["valor"]);
                }
            };
            rpcNw("rpcNw", rpc, func);
        } else {
            setValue(self, "caracteristicas", "");
            setValue(self, "valor", "");
        }
    });

    var html = "<h3>Realiza tu pago</h3><p>Para continuar por favor realizar el respectivo pago para utilizar nuestros servicios.</p>";
    addHeaderNote(self, html);

    var accept = addButtonNwForm("Realizar pago ahora", self);

    accept.click(function () {
        if (!validateRequired(self)) {
            return false;
        }
        var data = getRecordNwForm(self);
        if (data["forma_pago"] == "debito") {
            nw_dialog("<h1>Gracias por preferirnos.</h1><p>En breves segundo sera redireccionado a la pasarela de pagos, al finalizar la transacción le enviaremos un correo informándole el estado de su pago para que pueda ingresar.</p>");
            setTimeout(function () {

                var payu = {};
                payu["valor"] = data["valor"];
                payu["buttonVisible"] = false;
                getFormPayu(self, payu);
                submitForm("#form_payu");
            }, 3000);
        }

    });
    removeLoadingNw();
}