qx.Class.define("qxnw.basics.forms.f_dashboard_new", {
    extend: qxnw.forms,
    construct: function () {
        var self = this;
        self.base(arguments);
        self.createBase();
        self.setTitle("Dashboard");

//        self.timeToValidaVersion = 5000; //5 segundos (pruebas)
        self.timeToValidaVersion = 3600000; //1 hora;
//        self.domainApiFiles = "http://nwadmin3.loc";
        self.domainApiFiles = "https://nwadmin.gruponw.com";
//        self.domainApiFiles = "https://nwadmintest.gruponw.com";
        self.domainApiRpc = "https://nwadmin.gruponw.com";
//        self.domainApiRpc = "https://nwadmintest.gruponw.com";
//        self.domainApiRpc = "http://nwadmin3.loc";
        self.debug = false;
        self.data_config = null;
        self.data_design = null;

        var get = qxnw.utils.getGET();
        if (qxnw.utils.evalueData(get)) {
            if (qxnw.utils.evalueData(get.redirectionTo)) {
                window.location = get.redirectionTo;0
            }
        }

        var up = qxnw.userPolicies.getUserData();
        var tit = "";
        if (typeof qxnw.userPolicies.name_product !== "undefined") {
            tit += qxnw.userPolicies.name_product + " - ";
        }
        tit += up.name_company;
        document.title = tit;

        var html = "";
        html += "<div class='containerNew' id='containerNew' style='position:fixed;display: block;width: 100%;height: 100%;'>";
        html += "";
        html += "</div>";

        var fields = [
            {
                name: "menu",
                label: html,
                type: "label"
            }
        ];
        self.setFields(fields);
        self.ui.accept.setVisibility("excluded");
        self.ui.cancel.setVisibility("excluded");
        if (self.debug) {

        }
        console.log("%c<<<<DASHBOARD::: V: 10.0.2.2!!!!!!!!!!!!!>>>>", 'background: #fd3366; color: #fff');

        self.iconBack = null;
        self.nwlibV = qxnw.userPolicies.getNwlibVersion();
        if (self.nwlibV == null) {
            self.nwlibV = "";
        }
        self.loadEnd = false;
        self.inWindow = true;


        if (self.debug) {
            console.log("document.visibilityState", document.visibilityState);
        }
        if (document.visibilityState == "visible") {
            self.inWindow = true;
        } else {
            self.inWindow = false;
        }
        document.addEventListener("visibilitychange", function (event) {
            if (document.visibilityState == "visible") {
                if (self.debug) {
                    console.log("tab is active 1");
                }
                self.inWindow = true;
                if (!self.create) {
                    setTimeout(function () {
                        self.init();
                    }, 1000);
                }
            } else {
                self.inWindow = false;
                if (self.debug) {
                    console.log("tab is inactive 1");
                }
            }
        });
        qxnw.utils.loadingnw("Cargando espacio de trabajo...", "cargando_axtest");
        if (document.visibilityState == "visible") {
            self.init();
        }
//        self.init();
    },
    destruct: function () {
    },
    members: {
        create: false,
        timeh: null,
        init: function () {
            var self = this;
            self.clock();
            setInterval(function () {
                self.clock();
            }, 1000);
            self.start(function () {
                self.nwAds();
                self.validateVersion();
            });
            self.btnTickets();
//            self.nwAds();
        },
        num: 0,
        conContainer: null,
        getContainer: function getContainer() {
            var self = this;
            if (self.conContainer !== null && typeof self.conContainer !== "undefined") {
                return self.conContainer;
            }
            var containerAll = document.querySelectorAll(".containerNew");
            var to = containerAll.length - 1;
//            var containerNew = document.querySelector(".containerNew");
            var containerNew = containerAll[to];
            self.conContainer = containerNew;
            return containerNew;
        },
        start: function start(callback, onCreate) {
            var self = this;
//        self.addListener("appear", function () {
            self.profile();
            self.consulta(function (ra) {
                self.data_config = ra;

                var containerNew = self.getContainer();
                if (!containerNew) {
                    setTimeout(function () {
                        self.start(callback);
                    }, 500);
                    return false;
                }
                if (self.num === 0) {
                    self.num++;
                    setTimeout(function () {
                        self.start(callback);
                    }, 500);
                    return false;
                }
                var m = document.querySelector(".containerModulesBtns");
                if (m) {
                    m.remove();
                }
                var main = document.createElement("div");
                main.className = "containerModulesBtns";
                containerNew.appendChild(main);
                var des = ra.design;
                var imgb = "";
                if (self.iconBack !== null) {
                    imgb = self.iconBack;
                } else {
                    imgb = "/nwlib" + self.nwlibV + "/icons/dashbard_new/" + self.getRandomInt(1, 5) + ".jpg";
                }
                var codigoCss = null;
                var codigoJS = null;
                if (self.debug) {
                    console.log("des", des);
                }
                if (self.evalueData(des)) {
                    if (des.length > 0) {
                        var res = self.getConfigInitSetting(des);
                        self.data_design = res;
                        if (self.debug) {
                            console.log("res", res);
                        }
                        if (self.evalueData(res)) {
                            if (self.evalueData(res.imgb)) {
                                imgb = res.imgb;
                            }
                            if (self.evalueData(res.codigoCss)) {
                                codigoCss = res.codigoCss;
                            }
                            if (self.evalueData(res.codigoJS)) {
                                codigoJS = res.codigoJS;
                            }
                        }
                    }
                }

                self.iconBack = imgb;
                containerNew.style.backgroundImage = "url(" + imgb + ")";
                containerNew.style.backgroundRepeat = "no-repeat";
                containerNew.style.backgroundSize = "cover";
                if (self.evalueData(codigoCss)) {
                    var oc = document.createElement("div");
                    oc.innerHTML = codigoCss;
                    oc.className = "codigo_css_dashboard";
                    document.body.appendChild(oc);
                }

                qxnw.basics.forms.f_dashboard_new.arrayModules = [];
                var r = ra.modules;
                for (var i = 0; i < r.length; i++) {
                    var ra = r[i];
                   // var icon = "/nwlib" + self.nwlibV + "/icons/icon_control_panel_68.png";
                    if (self.evalueData(ra.icono)) {
                        icon = ra.icono;
                    }
                    var bt = document.createElement("div");
                    bt.className = "btnxq_module";
                    //color de fondo botones
                    bt.innerHTML = "<div class='btnxq_btimg' style='background-color:#F46523;'></div><div class='btnxq_btlabel'>" + self.tr(ra.nombre.toString()) + "</div>";
                    bt.data = ra;
                    bt.onclick = function () {
                        qxnw.basics.forms.f_dashboard_new.execModule(this.data, this);
                    };
                    main.appendChild(bt);
                    qxnw.basics.forms.f_dashboard_new.arrayModules.push(ra);
                }

                if (self.evalueData(codigoJS)) {
                    var fn = eval("(function() {" + codigoJS + "})");
                    fn();
                }

                if (self.debug) {
                    console.log("%c<<<<DEBUG: END CREATE BUTTONS DASHBOARD NEW 1!!!!!!!!!!!!!>>>>", 'background: yellow; color: #000');
                    console.log("DEBUG: END CREATE BUTTONS DASHBOARD NEW 1!!!!!!!!!!!!!", main);
                }
                qxnw.utils.loadingnw_remove("cargando_axtest");

                self.create = true;

                if (typeof callback !== "undefined") {
                    callback();
                }

            });
//        });            
        },
        getConfigInitSetting: function (des) {
            var self = this;
            if (!self.evalueData(des)) {
                return false;
            }
            if (des.length <= 0) {
                return false;
            }
            var de = des[self.getRandomInt(0, des.length)];
            if (self.debug) {
            }
            if (typeof de === "undefined") {
                return self.getConfigInitSetting(des);
            } else {
                var res = {};
                if (self.evalueData(de.fondo_bienvenida)) {
                    res.imgb = de.fondo_bienvenida;
                }
                if (self.evalueData(de.codigo_css_dashboard)) {
                    res.codigoCss = de.codigo_css_dashboard;
                }
                if (self.evalueData(de.codigo_js_dashboard)) {
                    res.codigoJS = de.codigo_js_dashboard;
                }
                if (self.evalueData(de.nwads)) {
                    res.nwads = de.nwads;
                }
                if (self.evalueData(de.busca_version)) {
                    res.busca_version = de.busca_version;
                }
                return res;
            }
            return false;
        },
        getRandomInt: function (min, max) {
            min = Math.ceil(min);
            max = Math.floor(max);
            return Math.floor(Math.random() * (max - min + 1)) + min;
        },
        strip_tags: function (str) {
            var self = this;
            if (!self.evalueData(str)) {
                return false;
            }
            str = str.toString();
            return str.replace(/<\/?[^>]+>/gi, '');
        },
        cleanUserNwC: function (u) {
            if (u === null) {
                return "";
            }
            u = u.toString();
            var id = u.replace(/\//gi, "");
            id = id.replace(/\?/gi, "");
            id = id.replace(/\=/gi, "");
            id = id.replace(/\./gi, "");
            id = id.replace(/\,/gi, "");
            id = id.replace(/\&/gi, "");
            id = id.replace(/\=/gi, "");
            id = id.replace(/\@/gi, "");
            id = id.replace(/\-/gi, "");
            id = id.replace(/\./gi, "");
            id = id.replace(/\_/gi, "");
            id = id.replace(/\-/gi, "");
            id = id.replace(/\ /gi, "");
            id = id.replace(/\!/gi, "");
            id = id.replace(/\:/gi, "");
            id = id.replace(".", "");
            var acentos = "ÃÀÁÄÂÈÉËÊÌÍÏÎÒÓÖÔÙÚÜÛãàáäâèéëêìíïîòóöôùúüûÑñÇç";
            var original = "AAAAAEEEEIIIIOOOOUUUUaaaaaeeeeiiiioooouuuunncc";
            for (var i = 0; i < acentos.length; i++) {
                id = id.replace(acentos.charAt(i), original.charAt(i));
            }
            return id;
        },
        validateVersion: function validateVersion() {
            var self = this;
            if (self.debug) {
                console.log("self.data_design", self.data_design);
            }
            if (self.data_design !== null) {
                if (self.data_design.busca_version == "NO") {
                    return false;
                }
            }
            var v = Math.random();
            fetch("/version.json?" + v)
                    .then(function (response) {
                        return response.json();
                    })
                    .then(function (jsondata) {
                        if (self.debug) {
                            console.log("jsondata", jsondata);
                        }
                        var regex = /(\d+)/g;
                        var versionDevice = qxnw.userPolicies.getVersion();
                        var versionDeviceClean = self.strip_tags(versionDevice);
                        if (versionDeviceClean == "Developer") {
                            return false;
                        }
//                        console.log("versionDeviceClean", versionDeviceClean);
                        versionDeviceClean = self.cleanUserNwC(versionDeviceClean);
//                        console.log("versionDeviceClean", versionDeviceClean);
                        versionDeviceClean = versionDeviceClean.match(regex);
//                        console.log("versionDeviceClean", versionDeviceClean);
                        if (self.debug) {
                            console.log("versionDevice", versionDevice);
                            console.log("versionDeviceClean", versionDeviceClean);
                            console.log("typeof versionDeviceClean", typeof versionDeviceClean);
                        }
                        if (qxnw.utils.evalueData(versionDeviceClean)) {
                            versionDeviceClean = parseInt(versionDeviceClean[0]);
                        }
//                        if (qxnw.basics.forms.f_dashboard_new.evalueData(versionDeviceClean)) {
//                            if (typeof versionDeviceClean[0] !== "undefined") {
//                                versionDeviceClean = parseInt(versionDeviceClean[0]);
//                            }
//                        }

                        var versionLatest = jsondata.version;
                        var versionLatestClean = self.strip_tags(versionLatest);
                        versionLatestClean = self.cleanUserNwC(versionLatestClean);
                        versionLatestClean = versionLatestClean.match(regex);
                        versionLatestClean = parseInt(versionLatestClean[0]);
                        if (self.debug) {
                            console.log("versionDevice", versionDevice);
                            console.log("versionDeviceClean", versionDeviceClean);
                            console.log("versionLatest", versionLatest);
                            console.log("versionLatestClean", versionLatestClean);
                        }
                        var versionLocalQxJson = versionLatestClean;
                        if (qxnw.basics.forms.f_dashboard_new.evalueData(window.localStorage.getItem("versionLocalQxJson"))) {
                            versionLocalQxJson = JSON.parse(window.localStorage.getItem("versionLocalQxJson"));
                        }
                        if (self.debug) {
                            console.log("versionLocalQxJson", versionLocalQxJson);
                        }
                        if (versionDeviceClean !== versionLatestClean || versionLocalQxJson !== versionLatestClean) {

                            var verac = versionLocalQxJson;
                            if (versionDeviceClean !== versionLatestClean) {
                                verac = versionDeviceClean;
                            }
                            if (versionLocalQxJson !== versionLatestClean) {
                                verac = versionLocalQxJson;
                            }

                            var text = "<h2>¡Nueva versión encontrada!</h2><br />";
                            text += "<br /><strong>" + verac + "</strong> Versión actual";
                            text += "<br /><strong>" + versionLatestClean + "</strong> Versión nueva";
                            text += "<br /><br />Click en aceptar para obtenerla o cancelar para omitir.";
                            qxnw.utils.question(text, function (e) {
                                if (e) {
                                    var ht = "";
                                    ht += "Actualizando de la versión actual " + verac;
                                    ht += " a la versión nueva " + versionLatestClean;
                                    ht += "... Por favor espere.";
                                    qxnw.utils.information(ht);
                                    qxnw.main.deleteMenuCache(false);
                                    window.localStorage.setItem("versionLocalQxJson", versionLatestClean);
                                    setTimeout(function () {
                                        window.location.reload();
                                    }, 2000);
                                } else {
                                    setTimeout(function () {
                                        self.validateVersion();
                                    }, self.timeToValidaVersion);
                                    return;
                                }
                            });
                        } else {
                            setTimeout(function () {
                                self.validateVersion();
                            }, self.timeToValidaVersion);
                            window.localStorage.setItem("versionLocalQxJson", versionLatestClean);
                        }
                    });
        },
        btnTickets: function btnTickets() {
            var self = this;
            var containerNew = self.getContainer();
            if (!containerNew) {
                setTimeout(function () {
                    self.btnTickets();
                }, 500);
                return false;
            }
            var m = document.querySelector(".containDateTickets");
            if (m) {
                m.remove();
            }
            var dat = document.createElement("div");
            //dat.innerHTML = "<img class='imgnovedadeshome' src='/nwlib6/icons/call_icon_50.png' /><span>¿Novedades? Ingresa aquí para recibir soporte</span>";
            //dat.className = "containDateTickets";
            //dat.style.zindex = 5;
            //dat.onclick = function () {
            //    qxnw.main.slotBtnTicketsNw();
            //};
            //containerNew.appendChild(dat);
        },
        clock: function clock() {
            var self = this;
            var containerNew = self.getContainer();
            if (!containerNew) {
                return false;
            }
            var m = document.querySelector(".containDateDash");
            if (m) {
                m.remove();
            }
            var hoy = new Date();
//                var fecha = hoy.getDate() + '-' + (hoy.getMonth() + 1) + '-' + hoy.getFullYear();
            var mon = (hoy.getMonth() + 1);
            if (mon.toString().length <= 1) {
                mon = "0" + mon;
            }
            var day = hoy.getDate();
            if (day.toString().length <= 1) {
                day = "0" + day;
            }
            var fecha = hoy.getFullYear() + '/' + mon + '/' + day;
//                var hora = hoy.getHours() + ':' + hoy.getMinutes() + ':' + hoy.getSeconds();
            var min = hoy.getMinutes();
            if (min.toString().length <= 1) {
                min = "0" + min;
            }
            var hour = hoy.getHours();
            if (hour.toString().length <= 1) {
                hour = "0" + hour;
            }
            var hora = hour + ':' + min;
            //var dias = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
            var numeroDia = new Date().getDay();
            var nombreDia = dias[numeroDia];
            //var full = fecha + " <span class='nombreDia'>" + nombreDia + "</span>";
            var dat = document.createElement("div");
            //dat.innerHTML = "<span class='hour hour_qxnwnew' id='hour_qxnwnew'>" + hora + "</span><span class='fulldate'>" + full + "</span>";
            dat.className = "containDateDash";
            containerNew.appendChild(dat);
        },
        profile: function profile() {
            var self = this;
            var up = qxnw.userPolicies.getUserData();
            var containerNew = self.getContainer();
            if (!containerNew) {
                return false;
            }

            var m = document.querySelector(".containerProfilebtns");
            if (m) {
                m.remove();
            }

            var pr = document.createElement("div");
            pr.className = "containerProfilebtns";
            containerNew.appendChild(pr);

            var ph = "/nwlib6/icons/2017/user.png";
            if (self.evalueData(up.photo)) {
                ph = up.photo;
            }
            if (self.evalueData(up.foto)) {
                ph = up.foto;
            }
            if (self.evalueData(up.foto_perfil)) {
                ph = up.foto_perfil;
            }
            var photo = document.createElement("div");
            //photo.className = "photoProfile";
            photo.style.backgroundImage = "url(" + ph + ")";
            photo.onclick = function () {
                main.slotMyPersonalData();
            };
            pr.appendChild(photo);
            var n = "<p>";
            if (self.evalueData(up.nombre)) {
                n += up.nombre;
            } else
            if (self.evalueData(up.name)) {
                n += up.name;
            } else {
                n += up.user;
            }
            if (self.evalueData(up.apellido)) {
                n += " " + up.apellido;
            }
            n += "</p>";
           // n += "<p>Email: " + up.email + "</p>";
           // n += "<p>Empresa: " + up.name_company + "</p>";
            //n += "<p>Perfil: " + up.nom_profile + "</p>";
            var name = document.createElement("div");
            name.innerHTML = n;
            name.className = "nameProfile";
            pr.appendChild(name);
            var btns = document.createElement("div");
            btns.className = "btnsProfile";
            pr.appendChild(btns);
            var bt = [];
            bt.push(
 //                   {
 //                       className: "btn_nwdrive",
 //                       name: "NwDrive",
 //                       icon: "/nwlib6/icons/usb_drive.png",
 //                       callback: function () {
 //                           var d = new qxnw.nw_drive.trees.vista_general();
 //                           d.createWindow();
  //                          main.addSubWindow(self.tr("Mis Archivos"), d);
  //                      }
  //                  },
//                    {
//                        className: "btn_notas",
//                        name: "Notas",
//                        icon: "/nwlib6/icons/stock_notes.png",
//                        callback: function () {
//                            var d = new qxnw.forms.notes(self);
//                            d.show();
//                        }
//                    },
//                    {
//                        className: "btn_config",
//                        name: "Configurar",
//                        icon: "/nwlib6/icons/configuracion.png",
//                        callback: function () {
//                            qxnw.main.slotBtnConfigQxnw();
//                        }
//                    },
//                    {
//                        className: "btn_support",
//                        name: "Soporte",
//                        icon: "/nwlib6/icons/call_icon.png",
//                        callback: function () {
//                            qxnw.main.slotBtnTicketsNw();
//                        }
//                    },
//                    {
//                        className: "btn_pqr",
//                        name: "PQR",
//                        icon: "/nwlib6/icons/question5.png",
//                        callback: function () {
//                            qxnw.main.slotLoadModulePQR();
//                        }
//                    },
//                    {
 //                       className: "btn_excel",
 //                       name: self.tr("Nw Excel"),
//                        icon: "/nwlib6/icons/application_vnd_ms_excel.png",
 //                       callback: function () {
 //                           qxnw.main.slotNwExcel();
 //                       }
 //                   },
//                    {
//                        className: "informes",
 //                       name: self.tr("Informessssss"),
  //                      icon: "/nwlib6/icons/office-spreadsheet.png",
  //                      callback: function () {
  //                          qxnw.main.loadCmiReports();
  //                      }
  //                  },
  //                  {
  //                      className: "btn_cerrarsesion",
  //                      name: self.tr("Cerrar sesiónddddd"),
  //                      icon: "/nwlib6/icons/22/salir.png",
   //                     callback: function () {
    //                        qxnw.main.slotSalir();
   //                     }
    //                }
            );
//            if (qxnw.config.getManyCompanies()) {
//                bt.push(
//                        {
//                            className: "btn_companies",
//                            name: "Cambiar empresa",
//                            icon: "/nwlib6/icons/22/salir.png",
//                            callback: function () {
//                                qxnw.main.slotSalir();
//                            }
//                        }
//                );
//            }
            for (var i = 0; i < bt.length; i++) {
                var b = bt[i];
                var name = document.createElement("div");
                name.innerHTML = "<span style='background-image: url(" + b.icon + ");' class='btIcon'></span><span class='btName'>" + self.tr(b.name.toString()) + "</span>";
                name.className = "btBlockProfile " + b.className;
                name.data = b;
                name.onclick = function () {
                    var da = this.data;
                    da.callback();
                };
                btns.appendChild(name);
            }
        },
        nwAds: function nwAds(callback) {
            var self = this;
            if (self.data_design !== null) {
                if (self.data_design.nwads == "NO") {
                    return false;
                }
            }
            if (!qxnw.utils.isOnline()) {
                return false;
            }
            ///////////publicidad////////
            if (qxnw.basics.forms.f_dashboard_new.evalueData(window.localStorage.getItem("nwAdsLocalQx"))) {
                var r = JSON.parse(window.localStorage.getItem("nwAdsLocalQx"));
                if (self.debug) {
                    console.log("nwAds:::r:::cache", r);
                }
                self.nwAdsAppend(r);
                if (typeof callback !== "undefined") {
                    callback();
                }
                return true;
            }
            if (!qx.core.Environment.get("qx.debug")) {
                var data = {};
                data.domain = window.location.host;
                data.domainApi = self.domainApiFiles;
                data.domainApiRpc = self.domainApiRpc;
                var rpc = new qxnw.rpc(self.getRpcUrl(), "nwMaker", true);
                rpc.setShowLoading(false);
                var func = function (r) {
                    if (self.debug) {
                        console.log("nwAds:::r:::responseServer", r);
                    }
                    if (r.error !== null) {
                        clearInterval(self.inverTwo);
                        clearTimeout(self.inverTwo);
//                    qxnw.utils.information(r.error.message);
                        console.log("%c<<<<DASHBOARD_NWADS:::ERROR>>>>", 'background: #ff3366; color: #fff');
                        console.log(r.error.message);
                        console.log("%c<<<<DASHBOARD_NWADS:::ERROR END>>>>", 'background: #ff3366; color: #fff');
                        return false;
                    }
                    window.localStorage.setItem("nwAdsLocalQx", JSON.stringify(r));
                    self.nwAdsAppend(r);
                    if (typeof callback !== "undefined") {
                        callback();
                    }
                };
                rpc.exec("getApiNwAds", data, func);
            }
        },
        nwAdsAppend: function nwAdsAppend(r) {
            var self = this;
            var bt = [];
            for (var i = 0; i < r.result.length; i++) {
                var ra = r.result[i];
                bt.push(
                        {
                            image: self.domainApiFiles + ra.imagen,
                            link: ra.link,
                            callback: function () {
                                window.open(ra.link, '_blank');
                            }
                        });
            }
            creaSliders(bt);

            function creaSliders(bt) {
                var pr = document.querySelector(".containerProfilebtns");
                if (self.debug) {
                    console.log("creaSliders:::pr", pr);
                }
                if (!pr) {
                    return;
                }
                var publi = document.createElement("div");
                publi.className = "btnsPublinw";
                pr.appendChild(publi);

                var hover = false;
                var publiInt = document.createElement("div");
                publiInt.className = "btnsPublinwInt";
                publiInt.onmouseenter = function () {
                    hover = true;
                };
                publiInt.onmouseout = function () {
                    hover = false;
                };
                publi.appendChild(publiInt);

                for (var i = 0; i < bt.length; i++) {
                    var b = bt[i];
                    var name = document.createElement("div");
                    name.innerHTML = "<span style='background-image: url(" + b.image + ");' class='btImagePubli'></span>";
                    name.className = "btBlockPubli";
                    name.data = b;
                    name.onclick = function () {
                        var da = this.data;
//                        da.callback();
                        window.open(da.link, '_blank');
                    };
                    publiInt.appendChild(name);
                }
                var time = 4; //velocidad, normal en 10
                var sum = 0;
                var totalSlider = bt.length;
                var slide = 0;
                var height = 130;
                setInterval(function () {
                    if (hover) {
                        return;
                    }
                    sum++;
                    if (sum === time) {
                        slide++;
                        var top = height * slide;
                        if (slide === totalSlider) {
                            slide = 0;
                            sum = 0;
                            top = 0;
//                            publiInt.style.top = top + "px";
//                            return;
                        }
                        publiInt.style.top = "-" + top + "px";
                        sum = 0;
                        qxnw.basics.forms.f_dashboard_new.addClass(publiInt, "btnsPublinwInt_anim");
                        setTimeout(function () {
                            qxnw.basics.forms.f_dashboard_new.removeClass(publiInt, "btnsPublinwInt_anim", true)
                        }, 1000);
                    }
                }, 1000);
            }
        },
        evalueData: function evalueData(data) {
            return qxnw.basics.forms.f_dashboard_new.evalueData(data);
        },
        addClass: function (el, cls) {
            return qxnw.basics.forms.f_dashboard_new.addClass(el, cls);
        },
        consulta: function consulta(callback) {
            var self = this;
            if (qxnw.basics.forms.f_dashboard_new.evalueData(window.localStorage.getItem("menuHomeLocalQx"))) {
                var ra = JSON.parse(window.localStorage.getItem("menuHomeLocalQx"));
                callback(ra);
                return true;
            }
            var data = {};
            data.getOnlyData = true;
            data.dashbysit = qxnw.userPolicies.dashbysit;
            data.versionDashboard = qxnw.userPolicies.versionDashboard;
            data.usedSecondView = qxnw.userPolicies.versionDashboardUsedSecondView;
            data.showGroups = qxnw.userPolicies.versionDashboardShowGroups;
            data.hostHTTP = window.location.host;
            data.products = qxnw.userPolicies.versionDashboardisProduct;
            var rpc = new qxnw.rpc(self.getRpcUrl(), "nw_configuraciones", true);
            var func = function (r) {
                callback(r);
                window.localStorage.setItem("menuHomeLocalQx", JSON.stringify(r));
            };
            rpc.exec("consultaModulesNew", data, func);
        }
    },
    statics: {
        menu: function () {
            var self = this;
            var up = qxnw.userPolicies.getUserData();
            var btns = qxnw.basics.forms.f_dashboard_new.arrayModules;
            if (document.querySelector(".menuFloatNew")) {
                qxnw.basics.forms.f_dashboard_new.addClass(document.querySelector(".menuFloatNew"), "menuFloatNew_show");
                return false;
            }
            var main = document.createElement("div");
            main.innerHTML = "<div class='menuFloatNew_contain'></div>";
            main.className = "menuFloatNew";
            main.onclick = function () {
                qxnw.basics.forms.f_dashboard_new.removeClass(".menuFloatNew", "menuFloatNew_show");
            };
            document.body.appendChild(main);
            var con = document.querySelector(".menuFloatNew_contain");
            var n = "<p class='nameenc'>";
            if (qxnw.basics.forms.f_dashboard_new.evalueData(up.nombre)) {
                n += up.nombre;
            } else
            if (qxnw.basics.forms.f_dashboard_new.evalueData(up.name)) {
                n += up.name;
            } else {
                n += up.user;
            }
            if (qxnw.basics.forms.f_dashboard_new.evalueData(up.apellido)) {
                n += " " + up.apellido;
            }
           // n += "</p>";
            //n += "<p>Email: " + up.email + "</p>";
            //n += "<p>Empresa: " + up.name_company + "</p>";
            //n += "<p>Perfil: " + up.nom_profile + "</p>";
            //var bt = document.createElement("div");
            bt.className = "btnxq_menenc";
            bt.innerHTML = n;
            con.appendChild(bt);
            for (var i = 0; i < btns.length; i++) {
                var ra = btns[i];
              //  var icon = "/nwlib6/icons/icon_control_panel_68.png";
                if (qxnw.basics.forms.f_dashboard_new.evalueData(ra.icono)) {
                    icon = ra.icono;
                }
                var bt = document.createElement("div");
                bt.className = "btnxq_module";
                bt.innerHTML = "<div class='btnxq_btimg' style='background-image: url(" + icon + ");'></div><div class='btnxq_btlabel'>" + self.tr(ra.nombre.toString()) + "</div>";
                bt.data = ra;
                bt.onclick = function () {
                    qxnw.basics.forms.f_dashboard_new.removeClass(".menuFloatNew", "menuFloatNew_show");
                    qxnw.basics.forms.f_dashboard_new.execModule(this.data, this);
                };
                con.appendChild(bt);
            }

            setTimeout(function () {
                qxnw.basics.forms.f_dashboard_new.addClass(main, "menuFloatNew_show");
            }, 500);
        },
        execModule: function (data, self) {

//            var e = window.event;
//            var style = "left: " + e.clientX + "px; top: " + e.clientY + "px;";
//            qxnw.utils.loadingnw("Cargando, por favor espere...", "cargando_axmini", style);
//            setTimeout(function () {
//                qxnw.utils.loadingnw_remove("cargando_axmini");
//            }, 2000);

            if (qxnw.basics.forms.f_dashboard_new.debug) {
                console.log("execModule:::START", data);
            }
            var parte = "";
            var execSlotInitial = function () {};
            if (qxnw.basics.forms.f_dashboard_new.evalueData(data.parte)) {
                var explodeParte = data.parte.split(".");
                var totalParte = explodeParte.length;
                if (qxnw.basics.forms.f_dashboard_new.debug) {
                    console.log("explodeParte", explodeParte);
                    console.log("totalParte", totalParte);
                }
                if (totalParte == 1) {
                    parte = data.parte;
                } else {

                    parte = explodeParte[0];
                    execSlotInitial = function () {
                        if (qxnw.basics.forms.f_dashboard_new.debug) {
                            console.log("explodeParte[1]", explodeParte[1]);
                        }
//                        qxnw.main.openAnyFunction(explodeParte[1], null, 2000);
                        qxnw.main.openAnyFunction(explodeParte[1], null, 500);
//                        qxnw.main.openAnyFunction(explodeParte[1], null);
                    };
                }
            }
            if (!qxnw.basics.forms.f_dashboard_new.evalueData(parte)) {
                parte = "0";
            }
            if (qxnw.basics.forms.f_dashboard_new.debug) {
                console.log("parte", parte);
                console.log("data.id", data.id);
            }
            qxnw.main.slotLoadModule(parte, data.id);
            execSlotInitial();
            if (qxnw.basics.forms.f_dashboard_new.debug) {
                console.log("execSlotInitial OK");
            }
            if (data.mostrar_popup === 't' || data.mostrar_popup === '1' || data.mostrar_popup === 1 || data.mostrar_popup === true || data.mostrar_popup === "true") {
                qxnw.basics.forms.f_dashboard_new.loadMainDivs(data, self);
            }
            if (qxnw.basics.forms.f_dashboard_new.debug) {
                console.log("execModule OK");
            }
        },
        removeItemArray: function (id, arr) {
            for (var i = 0; i < arr.length; i++) {
                if (arr[i].pariente === id) {
                    arr.splice(i, 1);
                }
            }
        },
        validateIfExistOpen: function (id) {
            var migas = qxnw.basics.forms.f_dashboard_new.migaArrayIds;
            for (var i = 0; i < migas.length; i++) {
                if (migas[i].pariente == id) {
                    return true;
                }
            }
            return false;
        },
        migaArray: [],
        migaArrayIds: [],
        loadMainDivs: function (d, parent) {
//            var pariente = d.pariente;
            var pariente = d.grupo;
            var exist = qxnw.basics.forms.f_dashboard_new.validateIfExistOpen(pariente);
            if (exist === true) {
                setTimeout(function () {
                    var m = document.querySelectorAll(".menuFloatNew_subwindow");
                    for (var i = 0; i < m.length; i++) {
                        qxnw.basics.forms.f_dashboard_new.removeClass(m[i], "menuFloatNew_subwindow_frontall", true);
                    }
                    setTimeout(function () {
                        qxnw.basics.forms.f_dashboard_new.addClass(".menuFloatNew_" + pariente, "menuFloatNew_subwindow_frontall");
                    }, 50);
                }, 100);
                return false;
            }
            qxnw.basics.forms.f_dashboard_new.migaArray.push(d.nombre);
            qxnw.basics.forms.f_dashboard_new.migaArrayIds.push({pariente: pariente});
            if (qxnw.utils.evalueData(window.localStorage.getItem("menuHomeLocalQx_subwind_" + pariente))) {
                var ra = JSON.parse(window.localStorage.getItem("menuHomeLocalQx_subwind_" + pariente));
                qxnw.basics.forms.f_dashboard_new.loadMainDivsContinue(ra, pariente, d, parent);
                return true;
            }
            if (qxnw.basics.forms.f_dashboard_new.debug) {
                console.log("pariente", pariente);
                console.log("d", d);
            }
            var data = {};
            data.getOnlyData = true;
            data.dashbysit = qxnw.userPolicies.dashbysit;
            data.versionDashboard = qxnw.userPolicies.versionDashboard;
            data.segVista = pariente;
            data.usedSecondView = qxnw.userPolicies.versionDashboardUsedSecondView;
            data.showGroups = qxnw.userPolicies.versionDashboardShowGroups;
            data.hostHTTP = window.location.host;
            data.products = qxnw.userPolicies.versionDashboardisProduct;
            data.getStyle = false;
            if (qxnw.basics.forms.f_dashboard_new.debug) {
                console.log("loadMainDivsContinue:::datasend:::::", data);
            }
            var rpc = new qxnw.rpc(main.getRpcUrl(), "nw_configuraciones", true);
            var func = function (r) {
                if (qxnw.basics.forms.f_dashboard_new.debug) {
                    console.log("loadMainDivsContinue:::", r);
                }
                window.localStorage.setItem("menuHomeLocalQx_subwind_" + pariente, JSON.stringify(r));
                qxnw.basics.forms.f_dashboard_new.loadMainDivsContinue(r, pariente, d, parent);
            };
            rpc.exec("consultaModulesNew", data, func);
        },
        loadMainDivsContinue: function (r, pariente, d, parent) {
            var self = this;
            var rand = Math.floor(Math.random() * 100);
            var classRand = "menuFloatNew_" + rand;
            var classRandInt = "menuFloatNew_contain_" + rand;
            var migas = qxnw.basics.forms.f_dashboard_new.migaArray;
//            var top = 0;
//            var left = 0;
            var top = 150;
            var left = 250;
            if (migas.length > 1) {
//                top = migas.length + "0";
//                left = migas.length + "0";
                top = (top + migas.length) + 30;
                left = (left + migas.length) + 30;
            }
            var title = "<h1 class='titlesub'>";
            if (typeof parent.data.parienteName !== "undefined") {
                title += parent.data.parienteName;
                title += " / ";
            }
            title += d.nombre;
            title += "</h1>";
            var main = document.createElement("div");
            main.innerHTML = "<div class='menuFloatNew_contain_subwind menuFloatNew_contain " + classRandInt + "'>" + title.toString() + "</div>";
            main.style = "left: " + left + "px;top: " + top + "px;";
            main.className = "menuFloatNew menuFloatNew_subwindow menuFloatNew_" + pariente + " " + classRand;
            main.onclick = function () {
                var m = document.querySelectorAll(".menuFloatNew_subwindow");
                for (var i = 0; i < m.length; i++) {
                    qxnw.basics.forms.f_dashboard_new.removeClass(m[i], "menuFloatNew_subwindow_frontall", true);
                }
                qxnw.basics.forms.f_dashboard_new.addClass(this, "menuFloatNew_subwindow_frontall");
            };
            document.querySelector(".containerNew").appendChild(main);
            setTimeout(function () {
                var m = document.querySelectorAll(".menuFloatNew_subwindow");
                for (var i = 0; i < m.length; i++) {
                    qxnw.basics.forms.f_dashboard_new.removeClass(m[i], "menuFloatNew_subwindow_frontall", true);
                }
                qxnw.basics.forms.f_dashboard_new.addClass(main, "menuFloatNew_subwindow_frontall");
            }, 50);
            var con = document.querySelector("." + classRandInt);
            qxnw.basics.forms.f_dashboard_new.drag("." + classRand);
            main.pariente = pariente;
            main.miga = d.nombre;
            var icon = "/nwlib6/icons/cancelar_negro_32.png";
            var bt = document.createElement("div");
            bt.className = "btnxq_module_back";
            bt.innerHTML = "<img src='" + icon + "' />";
            bt.data = main;
            bt.onclick = function () {
                var main = this.data;
                var pariente = main.pariente;
                qxnw.basics.forms.f_dashboard_new.removeItemArray(pariente, qxnw.basics.forms.f_dashboard_new.migaArrayIds);
                qxnw.basics.forms.f_dashboard_new.migaArray.pop();
                qxnw.basics.forms.f_dashboard_new.removeClass(main, "menuFloatNew_subwindow_end", true);
                qxnw.basics.forms.f_dashboard_new.removeClass(main, "menuFloatNew_show", true);
                setTimeout(function () {
                    main.remove();
                }, 500);
            };
            con.appendChild(bt);
            var btns = r.modules;
            for (var i = 0; i < btns.length; i++) {
                var ra = btns[i];
//                    if (ra.pariente == pariente) {
//                        ra.pariente = ra.grupo;
//                    }
                ra.parienteName = d.nombre;
                var icon = "/nwlib6/icons/icon_control_panel_68.png";
                if (qxnw.basics.forms.f_dashboard_new.evalueData(ra.icono)) {
                    icon = ra.icono;
                }
                var bt = document.createElement("div");
                bt.className = "btnxq_module";
                bt.innerHTML = "<div class='btnxq_btimg' style='background-image: url(" + icon + ");'></div><div class='btnxq_btlabel'>" + ra.nombre.toString() + "</div>";
                bt.data = ra;
                bt.onclick = function () {
                    qxnw.basics.forms.f_dashboard_new.execModule(this.data, this);
                };
                con.appendChild(bt);
            }
            setTimeout(function () {
                qxnw.basics.forms.f_dashboard_new.addClass(main, "menuFloatNew_show");
                setTimeout(function () {
                    qxnw.basics.forms.f_dashboard_new.addClass(main, "menuFloatNew_subwindow_end");
                }, 200);
            }, 100);
        },
        drag: function (classOrID) {
            dragElement(document.querySelector(classOrID));
            function dragElement(elmnt) {
                var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
                if (document.getElementById(elmnt.id + "header")) {
                    // if present, the header is where you move the DIV from:
                    document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
                } else {
                    // otherwise, move the DIV from anywhere inside the DIV:
                    elmnt.onmousedown = dragMouseDown;
                }

                function dragMouseDown(e) {
                    e = e || window.event;
                    e.preventDefault();
                    // get the mouse cursor position at startup:
                    pos3 = e.clientX;
                    pos4 = e.clientY;
                    document.onmouseup = closeDragElement;
                    // call a function whenever the cursor moves:
                    document.onmousemove = elementDrag;
                }

                function elementDrag(e) {
                    e = e || window.event;
                    e.preventDefault();
                    // calculate the new cursor position:
                    pos1 = pos3 - e.clientX;
                    pos2 = pos4 - e.clientY;
                    pos3 = e.clientX;
                    pos4 = e.clientY;
                    // set the element's new position:
                    elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
                    elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
                }

                function closeDragElement() {
                    // stop moving when mouse button is released:
                    document.onmouseup = null;
                    document.onmousemove = null;
                }
            }
        },
        removeClass: function (el, cls, isWidget) {
            var di = null;
            if (isWidget === true) {
                di = el;
                di.classList.remove(cls);
            } else {
                di = document.querySelectorAll(el);
            }
            var t = di.length;
            for (var i = 0; i < t; i++) {
                var d = di[i];
                d.classList.remove(cls);
            }
            return true;
        },
        addClass: function (el, cls) {
            if (typeof el === "string") {
                el = document.querySelector(el);
            }
            if (!el) {
                console.log("%c<<<<ERROR: nw.f_dashboard_new.addClass>>>>", 'background: red; color: #fff');
                console.log("f_darshboard_new::: El elemento no existe para la clase " + cls, el);
                return false;
            }
            if (el.classList) {
                el.classList.add(cls);
            } else {
                var cur = ' ' + (el.getAttribute('class') || '') + ' ';
                if (cur.indexOf(' ' + cls + ' ') < 0) {
                    setClass(el, (cur + cls).trim());
                }
            }
            return true;
        },
        evalueData: function evalueData(data) {
            if (typeof data === "undefined") {
                return false;
            }
            if (data === false || data === "" || data === null || data === 0 || data === "0") {
                return false;
            }
            if (typeof data === "number") {
                if (isNaN(parseInt(data))) {
                    return false;
                }
            }
            return true;
        }
    }
});
