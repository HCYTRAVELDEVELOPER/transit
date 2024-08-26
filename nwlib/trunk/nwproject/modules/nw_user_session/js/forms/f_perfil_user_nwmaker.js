function f_perfil_user_nwmaker(user) {
    empty(".containFileDir");
    var classDocument = ".f_perfil_user_nwmaker";
    var self = generateSelf(classDocument);
    var thisDoc = this;
    this.constructor = constructor;
    this.self = self;
    function constructor() {

        loading("Cargando...", "rgba(255, 255, 255, 0.76)!important", self);

        var fields = [
            {
                tipo: 'textField',
                nombre: 'Usuario',
                name: 'usuario_ok',
                visible: false
            },
            {
                tipo: 'textField',
                nombre: 'Usuario Name',
                name: 'usuario_name',
                visible: false
            },
            {
                tipo: 'image',
                nombre: 'Foto Banner',
                name: 'foto_portada',
                visible: true
            },
            {
                tipo: 'image',
                nombre: 'Foto de Perfil',
                name: 'foto_perfil'
            },
            {
                tipo: 'label',
                nombre: 'Nombre',
                name: 'nombre_apellido'
            },
            {
                tipo: 'label',
                nombre: 'Correo',
                name: 'email'
            },
            {
                tipo: 'label',
                nombre: 'Celular',
                name: 'celular'
            },
            {
                tipo: 'label',
                nombre: 'Fecha de nacimiento',
                name: 'fecha_nacimiento'
            },
            {
                tipo: 'label',
                nombre: 'Usuario',
                name: 'usuario_cliente'
            },
            {
                tipo: 'label',
                nombre: 'Separador',
                name: 'separador'
            }
            ,
            {
                tipo: 'label',
                nombre: 'Puntaje',
                name: 'puntaje'
            },
            {
                tipo: 'label',
                nombre: 'Promedio',
                name: 'promedio'
            },
            {
                tipo: 'label',
                nombre: 'País',
                name: 'pais'
            },
            {
                tipo: 'label',
                nombre: 'ID SESSION',
                name: 'id_session'
            },
            {
                tipo: 'label',
                nombre: 'Último ingreso',
                name: 'fecha_actualizacion'
            }
        ];
        var get = getGET();
        var up = getUserInfo();
        if (up.usuario === get.profilenw) {
            fields.push(
                    {
                        tipo: 'label',
                        nombre: 'Estado',
                        name: 'estado'
                    },
                    {
                        tipo: 'label',
                        nombre: 'product_id',
                        name: 'product_id'
                    },
                    {
                        tipo: 'label',
                        nombre: 'account_code_activation',
                        name: 'account_code_activation'
                    },
                    {
                        tipo: 'label',
                        nombre: 'account_date_expiration',
                        name: 'account_date_expiration'
                    },
                    {
                        tipo: 'label',
                        nombre: 'Usuario principal',
                        name: 'usuario_principal'
                    },
                    {
                        tipo: 'label',
                        nombre: 'Plan',
                        name: 'plan'
                    }
            );
        }

        createNwForms(self, fields, "nopopUp");

        addCss(self, "#nwform", {"padding": "0px"});

        setColumnsFormNumber(self, 1);
        setMaxWidth(self, 800);


        var imagenPortadaNo = "/nwlib6/nwproject/modules/nw_user_session/img/banner_dos.jpg";
        var imagenPerfilNo = "/nwlib6/nwproject/modules/nw_user_session/img/icon_user.png";
        var userProfile = "";
        if (typeof get["profilenw"] != "undefined") {
            userProfile = get["profilenw"];
        }
        if (typeof user != "undefined") {
            userProfile = user;
        }
        if (typeof get["profilenw"] != "undefined" || typeof user != "undefined") {
            var rpc = {};
            rpc["service"] = "nwMaker";
            rpc["method"] = "consultaPerfilUserNw";
            rpc["data"] = {usuario: userProfile};
            var func = function (r) {
                if (!verifyErrorNwMaker(r)) {
                    return;
                }

                if (evalueData(r.documento)) {
                    r.nit = r.documento;
                }
                if (evalueData(r.foto)) {
                    r.foto_perfil = r.foto;
                }

                var imgPerfil = "/nwlib6/includes/phpthumb/phpThumb.php?src=" + r["foto_perfil"] + "&w=600&f=jpg";
                var imgPortada = "/nwlib6/includes/phpthumb/phpThumb.php?src=" + r["foto_portada"] + "&w=1090&f=jpg";
                if (!evalueData(r["foto_portada"])) {
                    imgPortada = imagenPortadaNo;
                }
                if (!evalueData(r["foto_perfil"])) {
                    imgPerfil = imagenPerfilNo;
                }
                r["nombre_apellido"] = r["nombre"] + " " + r["apellido"];
                r["usuario_name"] = r["nombre"] + " " + r["apellido"];
                r["usuario_ok"] = r["usuario_cliente"];
                listAddCssFor(self, ".nameimgup_foto_portada", {"background-image": "url(" + imgPortada + ")"});
                listAddCssFor(self, ".nameimgup_foto_perfil", {"background-image": "url(" + imgPerfil + ")"});

                var iconsCal = "";
                var total = r.calificaciones.length;
                var puntos = 0;
                var points = 0;
                if (total > 0) {
                    for (var a = 0; a < total; a++) {
                        var t = r.calificaciones[a];
                        if (t.calificacion > 0) {
                            puntos += parseInt(t.calificacion);
                        }
                    }
                    points = parseInt(puntos) / parseInt(total);
                }
                for (var a = 0; a < 5; a++) {
                    var num = a + 1;
                    var clasOk = "";
                    if (points >= num) {
                        clasOk = "llenocalifica";
                    }
                    iconsCal += "<div class='" + clasOk + " iconCalificacionPromedioEnc' data='" + num + "'></div>";
                }
                var prom = '<div class="calificEnc"><div class="calificEncInt">' + iconsCal + '</div></div>';
                $(self + " #promedio").append(prom);

                setRecord(self, r);
                continueCreatePerfil(self, userProfile);
            };
            rpcNw("rpcNw", rpc, func, true);
        } else {
            var imgPerfil = "/nwlib6/includes/phpthumb/phpThumb.php?src=" + up["foto_perfil"] + "&w=600&f=jpg";
            var imgPortada = "/nwlib6/includes/phpthumb/phpThumb.php?src=" + up["foto_portada"] + "&w=1090&f=jpg";
            if (!evalueData(up["foto_portada"])) {
                imgPortada = imagenPortadaNo;
            }
            if (!evalueData(up["foto_perfil"])) {
                imgPerfil = imagenPerfilNo;
            }
            listAddCssFor(self, ".nameimgup_foto_portada", {"background-image": "url(" + imgPortada + ")"});
            listAddCssFor(self, ".nameimgup_foto_perfil", {"background-image": "url(" + imgPerfil + ")"});
            up["nombre_apellido"] = up.nombre + " " + up.apellido;
            up["usuario_name"] = up.nombre + " " + up.apellido;
            up["usuario_ok"] = up.usuario;
            setRecord(self, up);
            continueCreatePerfil(self, userProfile);
        }

        function continueCreatePerfil(self, userProfile) {
            listAddCssFor(self, ".nameimgup_foto_portada", {"max-width": "100%", "max-height": "100%", "height": "300px", "background-position": "center", "background-repeat": "no-repeat", "background-size": "cover"});
            listAddCssFor(self, ".nameimgup_foto_portada img", {"display": "none"});
            listAddCssFor(self, ".contain_input_name_foto_portada .labelInt", {"display": "none"});

            listAddCssFor(self, ".contain_input_name_foto_perfil", {"position": "absolute", "left": "0px", "top": "200px"});
            listAddCssFor(self, ".nameimgup_foto_perfil", {"border-radius": "50%", "background-color": "#ffffff", "max-width": "initial", "max-height": "initial", "height": "130px", "width": "130px", "background-position": "center", "background-repeat": "no-repeat", "background-size": "cover"});
            listAddCssFor(self, ".contain_input_name_foto_perfil .showImage", {"max-width": "200px", "max-height": "200px", "border": "3px solid #fff", "margin": "0 15px"});
            listAddCssFor(self, ".contain_input_name_foto_perfil img", {"display": "none"});
            listAddCssFor(self, ".contain_input_name_foto_perfil .labelInt", {"display": "none"});

            listAddCssFor(self, ".contain_input_name_nombre_apellido", {"left": "220px", "max-width": "550px", "top": "0px", "display": "block", "float": "none"});
            listAddCssFor(self, "#nombre_apellido", {"font-weight": "bold", "font-size": "20px"});
            listAddCssFor(self, ".contain_input_name_nombre_apellido .labelInt", {"display": "none"});

            listAddCssFor(self, ".contain_input_name_puntaje .divlabelnwform", {"font-weight": "bold", "font-size": "24px"});
            listAddCssFor(self, ".contain_input_name_ranking .divlabelnwform", {"font-weight": "bold", "font-size": "24px"});
            listAddCssFor(self, ".contain_input_name_total_tareas .divlabelnwform", {"font-weight": "bold", "font-size": "24px"});

            listAddCssFor(self, ".contain_input_name_product_id", {"width": "auto"});
            listAddCssFor(self, ".contain_input_name_pais", {"width": "auto"});
            listAddCssFor(self, ".contain_input_name_usuario_principal", {"width": "auto"});
            listAddCssFor(self, ".contain_input_name_plan", {"width": "auto"});
            listAddCssFor(self, ".contain_input_name_account_code_activation", {"width": "auto"});
            listAddCssFor(self, ".contain_input_name_account_date_expiration", {"width": "auto"});
            listAddCssFor(self, ".contain_input_name_estado", {"width": "auto"});
            listAddCssFor(self, ".contain_input_name_id_session", {"width": "auto"});
            listAddCssFor(self, ".contain_input_name_fecha_actualizacion", {"width": "auto"});

            listAddCssFor(self, ".contain_input_name_separador .divContainInputIntern", {"display": "none"});

            listAddCssFor(self, ".contain_input_name_total_tareas", {"width": "auto"});
            listAddCssFor(self, ".contain_input_name_ranking", {"width": "auto"});
            listAddCssFor(self, ".contain_input_name_puntaje", {"width": "auto"});
            listAddCssFor(self, ".contain_input_name_email", {"width": "auto"});
            listAddCssFor(self, ".contain_input_name_celular", {"width": "auto"});
            listAddCssFor(self, ".contain_input_name_fecha_nacimiento", {"width": "auto"});
            listAddCssFor(self, ".contain_input_name_usuario_cliente", {"width": "auto"});
            listAddCssFor(self, ".contain_input_name_promedio", {"width": "200px"});

            listAddCssFor(self, ".contain_input_name_foto_portada .divContainInputIntern", {"margin": "0px", "padding": "0px"});

            listAddCssFor(self, ".contain_input_name_nombre_apellido", {"position": "relative", "left": "0px", "margin-top": "360px"}, "mobile");

            /*
             if (typeof up["usuario"] != "undefined") {
             if (userProfile != up["usuario"]) {
             var btn = addButtonNwForm("Enviar mensaje", self);
             btn.click(function () {
             var data = getRecordNwForm(self);
             windowNwChatPes(data["usuario_ok"], data["usuario_name"], ".footerTools");
             });
             
             var cancel = addButtonNwForm("Llamar", self);
             cancel.click(function () {
             var data = getRecordNwForm(self);
             openNwVideoChat(data["usuario_ok"], true);
             });
             
             var cancel = addButtonNwForm("Video LLamada", self);
             cancel.click(function () {
             var data = getRecordNwForm(self);
             openNwVideoChat(data["usuario_ok"]);
             });
             }
             }
             */

            if (userProfile == up["usuario"]) {
                var btn = addButtonNwForm("Editar perfil", self);
                btn.click(function () {
                    editDataPersonal("popup");
                });
                var btn = addButtonNwForm("Cambiar contraseña", self);
                btn.click(function () {
                    changePass("popup");
                });
            }
            removeLoading(self);
        }
    }
}
