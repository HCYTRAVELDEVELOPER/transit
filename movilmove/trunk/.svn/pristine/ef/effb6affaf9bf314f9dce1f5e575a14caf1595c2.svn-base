/* ************************************************************************
 
 Copyright:
 2013 Netwoods.net, http://www.netwoods.net
 
 License:
 LGPL: http://www.gnu.org/licenses/lgpl.html
 EPL: http://www.eclipse.org/org/documents/epl-v10.php
 See the LICENSE file in the project's top-level directory for details.
 
 Authors:
 * Jason Daza (jasond)
 
 ************************************************************************ */
/**
 * Class only for static mode. A composition of util code who help you in entire your application
 */
qx.Class.define("movilmove.utils", {
    extend: qx.core.Object,
    include: [qx.locale.MTranslation],
    type: "singleton",
    events: {
        "ok": "qx.event.type.Event",
        "stop": "qx.event.type.Event"
    },
    /**
     * The resetter of a select box
     */
    properties: {
        resetter: {
            init: null
        }
    },
    members: {
    },
    statics: {
        initPortalClientes: function initPortalClientes(widget) {
//            var usu = qxnw.userPolicies.getUserData();
//            var page = widget.initPage;
//            widget.MainWindow.addListener("appear", function () {
            var framesHome = document.getElementById('frame_home');
            framesHome.onload = function () {
//                var conf = main.getConfiguracion();
//                    console.log(conf);
//                if (conf.usa_flotas_clientes == "SI") {
                    var resDiv = this.contentWindow.document.querySelectorAll('div.containerBoxM_home');
//                    console.log(resDiv)
//                    for (var i = 0; i < resDiv.length; i++) {
//                        if (resDiv[i].querySelector('.textSpan').innerHTML == "Clientes") {
//                            resDiv[i].querySelector('.textSpan').innerHTML = "Flotas";
//                            resDiv[i].querySelector('.textSpanTwo').innerHTML = "Flotas";
//                            var newmodule = resDiv[i].cloneNode(true);
//                            newmodule.querySelector('.textSpan').innerHTML = 'Clientes';
//                            newmodule.querySelector('.textSpanTwo').innerHTML = 'Clientes';
//                            newmodule.querySelector('.contend_modules_div').setAttribute('onclick', "parent.qxnw.main.slotLoadModule('0', '58');   parent.qxnw.main.openAnyFunction('slotEmpresas2')");
//                            resDiv[i].after(newmodule);
//                        }
//                    }
//                }
//                    if (usu.company != '1' && usu.company != '22') {
//                        var resDiv = this.contentWindow.document.querySelectorAll('div.containerBoxM_home');
//                        for (var e = 0; e < resDiv.length; e++) {
//                            if (resDiv[e].querySelector('.textSpan').innerHTML == "Soporte") {
//                                resDiv[e].remove();
//                            }
//                        }
//                    }
            }
//            });
        },
        initDasboard: function initDasboard(widget) {
            var usu = qxnw.userPolicies.getUserData();
            var page = widget.initPage;
//            widget.MainWindow.addListener("appear", function () {
            var framesHome = document.getElementById('frame_home');
            framesHome.style.display = "none";
            framesHome.onload = function () {
                var conf = main.getConfiguracion();
                var tipoEmpresa = main.getTipoempresa();
//                    console.log(conf);
//                    console.log(tipoEmpresa);
                var resDiv = this.contentWindow.document.querySelectorAll('div.containerBoxM_home');
                var resDiv1 = this.contentWindow.document.querySelector('div.contend_modules div.contend_sliderEnc');

                var form = new qxnw.forms();
//                    widget.ifram = form.addFrame("/dasboard/dash.php?admi=" + usu.company, false);
                widget.ifram = form.addFrame("/app/dasboard_portal_clientes/dash.php?admi=" + usu.company, false);
                page.add(widget.ifram);
                widget.ifram.addListener("appear", function () {
                    var content = widget.ifram.getContentElement().getDomElement();
                    content.onload = function () {
                        var test = this.contentWindow.document.querySelector('div.contain_center');
                        var test2 = this.contentWindow.document.querySelector('div.contain_top');
                        for (var i = 0; i < resDiv.length; i++) {
//                                console.log(resDiv[i].querySelector('.textSpan').innerHTML);
//                                console.log(conf);
                            if (conf.usa_flotas_clientes != "SI" || conf.usa_flotas_clientes == "SI" && tipoEmpresa == "Flota") {
                                if (resDiv[i].querySelector('.textSpan').innerHTML == "Usuarios APP") {
                                    continue;
                                }
                            }
                            if (conf.app_para == "CARGA" || conf.usa_flotas_clientes == "SI" && tipoEmpresa == "Cliente") {
                                if (resDiv[i].querySelector('.textSpan').innerHTML == "Servicios, crear / monitorear" || resDiv[i].querySelector('.textSpan').innerHTML == "Servicios") {
                                    test.appendChild(resDiv[i]);
                                }
                                if (resDiv[i].querySelector('.textSpan').innerHTML == "Historico viajes" || resDiv[i].querySelector('.textSpan').innerHTML == "Histórico viajes") {
                                    test.appendChild(resDiv[i]);
                                }
                                if (resDiv[i].querySelector('.textSpan').innerHTML == "Usuarios APP") {
                                    test.appendChild(resDiv[i]);
                                }
                            } else {
                                test.appendChild(resDiv[i]);
                            }
                        }  
                        test2.appendChild(resDiv1);
                        framesHome.remove();
                    };
                });
            };
//            });
        }
    }
});