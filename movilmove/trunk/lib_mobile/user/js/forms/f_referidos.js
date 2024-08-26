nw.Class.define("f_referidos", {
    extend: nw.forms,
    construct: function (callback) {
        console.log("FORMULARIO REFERIDOS");
        var self = this;
        self.id = "f_referidos";
        self.setTitle = "<span style='color:#fff;'>Referidos</span>";
        self.html = "";
        self.showBack = true;
        self.closeBack = false;
        self.textClose = "Volver";
        self.colorBtnBackIOS = "#ffffff;";
        self.styleCloseIOS = "color:#ffffff;color: rgb(255, 255, 255);background-color: transparent;border: 0;box-shadow:none;";
//        self.transition = "slideup";
        self.createBase();
        self.callback = callback;
        self.configCliente = main.configCliente;
        var up = nw.userPolicies.getUserData();
        var code_referido = [];
        var data = {};
        data.id_ref = up.id_usuario;
        data.perf = up.perfil;
        if (nw.evalueData(up.code_referido) && nw.evalueData(self.configCliente.numero_referidos)) {
            code_referido = JSON.parse(up.code_referido);
            if (code_referido.length > 0) {
                if (code_referido.length == self.configCliente.numero_referidos) {
                    code_referido.shift();
                }
            }
            code_referido.push(data);
        } else {
            code_referido.push(data);
        }
        code_referido = JSON.stringify(code_referido);

        var nameconfig = domainExternConfigName.replace("user", "");
        nameconfig += nameconfig + "driver";

        console.log("nameconfig", nameconfig);

        self.link = config.domain_rpc + "/lib_mobile/user/index.html?empresa=" + up.empresa + "&createAccount=true&code_referido=" + code_referido + "&conf=" + domainExternConfigName;
        self.link_driver = config.domain_rpc + "/lib_mobile/driver/index.html?empresa=" + up.empresa + "&createAccount=true&code_referido=" + code_referido + "&conf=" + nameconfig;

        var fields = [];
        fields.push(
                {
                    label: "",
                    style: '',
                    name: "contenedor_refiere_amigos",
                    mode: "div",
                    type: "startGroup"
                },
                {
                    name: "my_link_img",
                    label: "<span class='imgRefiereAmigos' style='background-image: url(" + config.domain_rpc + "/lib_mobile/user/img/imagen_referido_amigo.png);'></span>",
                    type: "html"
                },
                {
                    name: "my_link_description",
                    label: "<span class='titleRefiereAmigos'>" + nw.tr("Refiere amigos") + "</span><span class='descpRefiereAmigos'>" + nw.tr("Este es tu link, puedes copiarlo y compartirlo para que tus contactos se registren como usuario") + "</span>",
                    type: "html"
                },
                {
                    label: "",
                    style: '',
                    name: "contenedor_refiere_amigos_actions",
                    mode: "div",
                    type: "startGroup"
                },
                {
                    name: "my_link",
                    label: "",
                    placeholder: self.link,
                    type: "textField",
                    required: true,
                    visible: true
                },
                {
                    label: "",
                    style: '',
                    name: "contenedor_refiere_amigos_buttons",
                    mode: "div",
                    type: "startGroup"
                },
                {
                    name: "my_link_copy",
                    label: '<i class="material-icons">content_copy</i>',
                    type: "button"
                },
                {
                    name: "my_link_shared",
                    label: nw.tr("Compartir") + " <i class='material-icons'>share</i>",
                    type: "button"
                },
                {
                    mode: "div",
                    type: "endGroup"
                },
                {
                    mode: "div",
                    type: "endGroup"
                },
                {
                    mode: "div",
                    type: "endGroup"
                });

        fields.push(
                {
                    label: "",
                    style: '',
                    name: "contenedor_refiere_conductores",
                    mode: "div",
                    type: "startGroup"
                },
                {
                    name: "my_link_img",
                    label: "<span class='imgRefiereAmigos'></span>",
                    type: "html"
                },
                {
                    name: "my_link_description",
                    label: "<span class='titleRefiereAmigos'>" + nw.tr("Refiere conductores") + "</span><span class='descpRefiereAmigos'>" + nw.tr("Cópialo y compártelo con tus amigos conductores") + "</span>",
                    type: "html"
                },
                {
                    label: "",
                    style: '',
                    name: "contenedor_refiere_amigos_actions",
                    mode: "div",
                    type: "startGroup"
                },
                {
                    name: "my_link_driver",
                    label: "",
                    placeholder: self.link,
                    type: "textField",
                    required: true,
                    visible: true
                },
                {
                    label: "",
                    style: '',
                    name: "contenedor_refiere_amigos_buttons",
                    mode: "div",
                    type: "startGroup"
                },
                {
                    name: "my_link_copy_driver",
                    label: '<i class="material-icons">content_copy</i>',
                    type: "button"
                },
                {
                    name: "my_link_shared_driver",
                    label: nw.tr("Compartir") + " <i class='material-icons'>share</i>",
                    type: "button"
                },
                {
                    mode: "div",
                    type: "endGroup"
                },
                {
                    mode: "div",
                    type: "endGroup"
                },
                {
                    mode: "div",
                    type: "endGroup"
                });

        console.log("PASAJERO REFIERE CONDUCTOR::: ", self.configCliente.pasajero_refiere_conductor);
        if (self.configCliente.pasajero_refiere_conductor == "NO") {
            $(self.canvas).append("<style>.contentCenter .contenedor_refiere_conductores{background-image: url(" + config.domain_rpc + "/lib_mobile/user/img/Referido_amigo_conductor.jpg);display: none;}</style>");
        } else {
            $(self.canvas).append("<style>.contentCenter .contenedor_refiere_conductores{background-image: url(" + config.domain_rpc + "/lib_mobile/user/img/Referido_amigo_conductor.jpg);}</style>");
        }
        self.setFields(fields);

        self.show();

        self.onAppear(function () {
            setTimeout(function () {
                self.getUrl(function (r) {

                    self.ui.my_link.setValue(r.link);
                    self.ui.my_link_driver.setValue(r.link_driver);

                    self.ui.my_link_copy.addListener("click", function () {
                        var aux = document.querySelector(".my_link");
                        aux.select();
                        document.execCommand("copy");
                    });
                    self.ui.my_link_shared.addListener("click", function () {
                        var title = nw.tr("¡Gana más con") + " " + config.name + "!";
                        var body = nw.tr("¡Gana más con") + " " + config.name + "! " + up.nombre + " " + nw.tr("te refirió para que te unas como usuario a") + " " + config.name + ", " + nw.tr("la línea de transporte única en Colombia, enlace:") + " " + r.link;
                        if (nw.evalueData(config.titleReferidoUser)) {
                            title = config.titleReferidoUser.replace("{link}", r.link);
                        }
                        if (nw.evalueData(config.bodyReferidoUser)) {
                            body = config.bodyReferidoUser.replace("{link}", r.link);
                        }
                        nw.shareSocial(body, title);
                    });

                    self.ui.my_link_copy_driver.addListener("click", function () {
                        var aux = document.querySelector(".my_link_driver");
                        aux.select();
                        document.execCommand("copy");
                    });
                    self.ui.my_link_shared_driver.addListener("click", function () {
                        var title = nw.tr("¡Gana más con") + " " + config.name + "!";
                        var body = nw.tr("¡Gana más con") + " " + config.name + "! " + up.nombre + " " + nw.tr("te refirió para que te unas como conductor a") + " " + config.name + ", " + nw.tr("la línea de transporte única en Colombia, enlace:") + " " + r.link_driver;
                        if (nw.evalueData(config.titleReferidoDriver)) {
                            title = config.titleReferidoDriver.replace("{link}", r.link_driver);
                        }
                        if (nw.evalueData(config.bodyReferidoDriver)) {
                            body = config.bodyReferidoDriver.replace("{link}", r.link_driver);
                        }
                        nw.shareSocial(body, title);
                    });
                });

            }, 100);
        });
    },
    destruct: function () {
    },
    members: {
        getUrl: function getUrl(callback) {
            var self = this;
            var up = nw.userPolicies.getUserData();
            var data = self.getRecord(true);
            data.usuario = up.usuario;
            data.empresa = up.empresa;
            data.perfil = up.perfil;
            data.domain = config.domain_rpc;
            data.link_driver = self.link_driver;
            data.link = self.link;
            var rpc = new nw.rpc(nw.getRpcUrl(), "conductores");
            rpc.setAsync(true);
            rpc.setLoading(true);
            var func = function (r) {
                console.log(r);
                callback(r);
            };
            rpc.exec("getUrlShort", data, func);
        },
        populate: function populate(pr) {
            var self = this;
            self.setRecord(pr);
        }
    }
});