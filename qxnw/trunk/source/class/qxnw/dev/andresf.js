/* ************************************************************************
 
 Copyright:
 2013 Netwoods.net, http://www.netwoods.net
 
 License:
 LGPL: http://www.gnu.org/licenses/lgpl.html
 EPL: http://www.eclipse.org/org/documents/epl-v10.php
 See the LICENSE file in the project's top-level directory for details.
 
 Authors:
 * Andrés Flórez (andresf)
 * 
 * Class to test on andresf projects
 
 *************************************************************************/

qx.Class.define("qxnw.dev.andresf", {
    extend: qx.core.Object,
    statics: {
        test: function test(parent) {

            return;

            var d = new qxnw.lists();
            d.setTitle("Lista de productos");
            d.setTableMethod("master");
            d.createFromTable("view_produccion_rda");
            d.setAllPermissions(true);
            d.show();
            return;

            qxnw.utils.enableMouse();

            return;

            var f = new qxnw.examples.form_light();
            f.setModal(true);
            f.show();
            return;

            return;

            var f = new propuestas_automaticas.lists.l_propuestas();
            f.show();
            return;

            var f = new ord_prod.forms.f_despachos();
            f.show();
            return;

            var f = new nwadmin3.lists.l_cuentas_cobro();
            f.show();
            return;

            var f = new qxnw.examples.form_light();
            f.setModal(true);
            f.show();
            return;

//            qxnw.config.setShowStorageDebug(true);

            var closeTimeOut = new qx.event.Timer(1000);
            closeTimeOut.start();
            closeTimeOut.addListener("interval", function (e) {
                this.stop();
                var f = new nwadmin3.lists.l_cuentas_cobro();
                f.show();
                return;
            });
            return;

            var cp = new nwadmin3.forms.f_cuentas_cobro();
            cp.show();
            return;

            var d = new crm.forms.f_clientes();
            d.setParamRecordMain("Masivo");
            var page = parent.addSubWindow("Clientes Masivo", d);
            d.ui.cancel.addListener("execute", function () {
                self.removeSubWindow(page);
                d.destroy();
            });
            return;

            var colores = new qx.ui.control.ColorPopup();
            colores.show();
            return;


            var f = new qxnw.forms();
            f.createDeffectButtons();

            var ui = new qxnw.widgets.addressWidgetV2();
            f.masterContainer.add(ui);

            ui.setValue("Autopista        78                              A ESTE  145  A 145   Norte       Agrupación              s                       Carretera               s                       Casa                    s                      ");

            f.ui.accept.addListener("execute", function () {

            });
            f.show();
            return;

            var f = new qxnw.nw_import_data.mainSmart();
            f.setTable("sit_tercero_propietario");
            f.show();
            return;

            var d = new qxnw.lists();
            d.setTableMethod("master");
            d.createFromTable("sit_tercero_propietario");
            d.setAllPermissions(true);
            d.show();
            return;

            var f = new tiquets.lists.l_generacion_tickets();
            f.show();
            return;

            var f = new qxnw.widgets.honeyWellReader();
//            f.setCanPrint(true);
            f.setModal(true);
            f.show();
            return;

            var f = new nwadmin3.lists.l_clientesProspecto();
            f.show();
            return;

            var f = new qxnw.forms.permissions();
            f.show();
            f.maximize();
            return;

            var f = new nwforms.lists.l_result();
            f.setModal(true);
            f.show();
            return;

            var f = new qxnw.examples.listBad();
            f.show();
            return;

            var f = new qxnw.examples.list();
            f.show();
            return;

            setTimeout(function () {
                var f = new qxnw.examples.list();
                parent.addSubWindow("TEST", f);
            }, 500);
            return;

            var f = new qxnw.examples.listEdit();
            f.show();
            return;

            setTimeout(function () {
                var f = new qxnw.examples.maps();
                f.show();
                return;
            }, 500);
            return;

            setTimeout(function () {
                var d = new qxnw.forms.permissionsProducts();
                parent.addSubWindow("Permisos productos", d);
            }, 500);
            return;

            var f = new nwadmin3.lists.l_os();
            f.show();
            f.maximize();
            return;

            var f = new qxnw.examples.printerReport();
            f.show();
            return;

            var f = new qxnw.examples.dragdrop();
            f.show();
            return;

            var f = new qxnw.examples.tree();
//            f.rightWidget.addBefore(form.masterContainer, f.tabView);
            f.show();
            return;

            var f = new qxnw.forms();
            f.createDeffectButtons();
            f.ui.accept.addListener("execute", function () {
                var f = new qxnw.examples.form_light();
                f.setModal(true);
                f.show();
            });
            f.show();
//            parent.addSubWindow("TEST", f);
            return;

            var f = new enrutamiento.tree.enrutamiento();
            f.show();
            return;

            qxnw.utils.enableMouse();

            return;

            var f = new nwadmin3.trees.nw_clientes_prospecto();
            f.show();
//            parent.addSubWindow("CP", f);
            return;

            var datos = {};
            datos.estado = "CUMPLIDO";
            datos.id = 17252;
            datos.id_op = "";
            datos.tipo_viaje = "Normal";
            datos.vista = "back";
            var f = new qxnw.forms("Manifiesto");
            f.createPrinterToolBar("Manifiesto", datos, 1);
            f.addFrame("/imp/manifiesto.php", true, datos);
            f.hidePrinterSelect();
            f.show();
            f.maximize();
            f.setModal(true);
            return;

            setTimeout(function () {
                var f = new qxnw.forms();
                f.setWidth(400);
                f.setHeight(700);
//                f.addFrame("https://app.sanitco.com/index.html?token=anVsaWFuYyxqdWxpYW5j", false, null);
//                f.addFrame("https://nwadmintest.gruponw.com/", false, null);
                f.addFrame("https://app.movilmove.com/?token=YWRtaW4sYWRtaW4=", false, null);
//                f.addFrame("https://sanitco.loc/compiled/source?token=Z2VyZW5jaWFAdGlhbmlwcy5jb20sJFRpYW5JUHNAMjAyMiM=", false, null);
                parent.addSubWindow("Movilmove", f);
            }, 500);
            return;

            var form = new qxnw.widgets.honeyWellReader();
            form.show();
            return;

            var f = new scs.forms.f_siembra();
            f.show();
            return;

            var f = new qxnw.cmi.main();
            f.show();
            return;

            var f = new qxnw.forms();

            var containerAll = new qx.ui.container.Composite(new qx.ui.layout.HBox());
            f.addWidget(containerAll, {
                flex: 1
            });
            var containerPersonal = new qx.ui.container.Composite(new qx.ui.layout.VBox).set({
                width: 780,
                height: 100
            });
            f.box1 = new qx.ui.groupbox.GroupBox("Respuestas", "icon/16/apps/utilities-text-editor.png");
            containerPersonal.add(f.box1, {
                flex: 1
            });
            f.box1.setLayout(new qx.ui.layout.VBox());

            f.navTable = new qxnw.navtable(self);
            f.navTable.setContextMenu("contextMenu");
            f.navTable.setTitle("Datos");
            f.navTable.createBase();
            var columns = [
                {
                    label: "ID",
                    caption: "id"
                },
                {
                    label: "Respuesta",
                    caption: "nombre"
                },
                {
                    label: "Seleccione",
                    caption: "respuesta",
                    type: "checkbox",
                    mode: "editable"
                }
            ];

            f.navTable.setColumns(columns);
//            qxnw.utils.addBorder(f.navTable);
            f.box1.add(f.navTable.getBase(), {
                flex: 1
            });

            containerAll.add(containerPersonal);

            //f.insertNavTable(nav.getBase(), "test");

            f.createDeffectButtons();
            f.show();
            return;

            var f = new qxnw.examples.formNav();
            f.show();
            return;


            var f = new qxnw.examples.tree();
            f.show();
            return;

            setTimeout(function () {
                var d = new historia_clinica.tree.consulta();
                parent.addSubWindow("HC", d);
            }, 500);
            return;

            var f = new nw_import_data.main();
            f.show();
            return;

            var f = new qxnw.examples.importacion_sitca();
            f.show();
            return;

            var f = new qxnw.forms();
//            var html = new qx.ui.basic.Label().set({
//                rich: true
//            });
            var html = new qx.ui.embed.Html();
            html.setHeight(1000);
            html.setWidth(1500);
            html.setHtml('<iframe src="http://sanitco.loc/compiled/source" sandbox="allow-forms allow-scripts allow-same-origin"></iframe>');
            f.masterContainer.add(html, {
                flex: 1
            });
            f.show();
            return;

            var f = new qxnw.forms();
//            var html = new qx.ui.embed.Html();
//            html.setHtml('<iframe src="http://sanitco.loc/compiled/source" sandbox="allow-forms"></iframe>');
//            f.masterContainer.add(html, {
//                flex: 1
//            });

            var frame = new qx.ui.embed.ThemedIframe();
            frame.setSource("http://sanitco.loc/compiled/source");
            f.masterContainer.add(frame, {
                flex: 1
            });

            f.show();
            return;

            var f = new nw_rh.forms.f_evaluacion();
            f.show();
            return;

            var f = new ord_prod.forms.f_cumplidos();
            f.show();
            return;

            var nav = new qxnw.examples.navTable();
            f.insertNavTable(nav.getBase(), "test");
            f.createDeffectButtons();
            f.show();
            return;

            setTimeout(function () {
                var w = new qx.ui.window.Window();
                w.setLayout(new qx.ui.layout.VBox());
                var c = new qx.ui.container.Composite(new qx.ui.layout.VBox());
                var css = {
                    width: 260,
                    height: 195
                };
                var arrbtRemote = {
                    autoPlay: true,
                    width: 260,
                    muted: true
                };
                var video = new qx.html.Element("video", css, arrbtRemote);
                c.addListener("appear", function () {
//                    var ce = c.getDefaultRoot();
                    var ce = c.getContentElement();
                    console.log(ce);
                    ce.add(video);
//                    c.getContentElement().add(video, {
//                        flex: 0
//                    });
                });
                w.add(c);
                w.show();
            }, 5000);

            return;

            var f = new qxnw.nw_file_manager.trees.vista_general();
//            f.setCanPrint(true);
            f.show();
            return;

            var d = new qxnw.nw_drive.trees.vista_general();
            d.createWindow();
            parent.addSubWindow("Mis Documentos", d);
            return;

//            return;

            var l = new qxnw.nw_import_data.main();
            l.setTable("nw_list_edit");
//            l.setTable("sit_viajes_sat");
//            l.setTable("sit_eps");
            l.show();
            return;

            var sb = new qxnw.fields.selectBox();
            sb.set({
                maxHeight: 27,
                minHeight: 27
            });

            var f = new qxnw.forms();
            f.createDeffectButtons();

            f.masterContainer.add(sb);

            sb.setUserData("name", "andresf");
            var selectItem = new qx.ui.form.ListItem("hola");
            selectItem.setModel("andresf");
            selectItem.setRich(true);
            sb.add(selectItem);
            f.show();

            return;

            var f = new qxnw.basics.lists.l_empresas();
            f.show();

            return;

            var f = new qxnw.forms();
            var nav = new qxnw.examples.navTable();
            f.insertNavTable(nav.getBase(), "test");
            f.createDeffectButtons();
            f.show();
            return;


            setTimeout(function () {
                var f = new nwadmin3.trees.nw_clientes_prospecto();
                parent.addSubWindow("CP", f);
            }, 500);

            return;

            var f = new qxnw.basics.lists.l_componentes();
            f.show();
            return;

            var cp = new nwadmin3.trees.nw_clientes_prospecto();
            cp.show();
            return;

//            var f = new ord_prod.forms.f_autorizacion_parqueadero();
//            f.show();
//            return;

            f.ui.accept.addListener("execute", function () {
                var data = {};
                data.id = 1;
                data.money = 20;
                data.visible = "true";
                console.log(data);
                nav.addRows([data]);
            });

            return;

            var encoder = new TextEncoder();
            var data = encoder.encode("padre08");
            var digest = window.crypto.subtle.digest('SHA-256', data);

            console.log(digest);

            return;

            qxnw.config.setShowStorageDebug(false);
            qxnw.config.setShowRpcDebug(false);

            return;

            qxnw.utils.loading("holaaaaaa");
            return;

            var d = new qxnw.lists();
//            d.setMaximizedDynamicTable();
            d.setTableMethod("master");
//            d.createFromTable("vis_plantillas_correos_destinatarios");
            d.createFromTable("nw_list_edit");
            d.setAllPermissions(true);
            parent.addSubWindow("NW LIST EDIT", d);
            return;

            var cp = new nwadmin3.trees.nw_clientes_prospecto();
            cp.show();
            return;

            qxnw.config.setShowDestroyObjects(true);

            var d = new qxnw.lists();
//            d.setMaximizedDynamicTable();
            d.setTableMethod("master");
//            d.createFromTable("vis_plantillas_correos_destinatarios");
            d.createFromTable("nw_list_edit");
            d.setAllPermissions(true);
            parent.addSubWindow("NW LIST EDIT", d);

            var f = new qxnw.examples.form_light();
            f.show();
            return;

            var d = new qxnw.lists();
//            d.setMaximizedDynamicTable();
            d.setTableMethod("master");
//            d.createFromTable("vis_plantillas_correos_destinatarios");
            d.createFromTable("nw_list_edit");
            d.setAllPermissions(true);
            parent.addSubWindow("NW LIST EDIT", d);
            return;

//            var l = new qxnw.examples.listEdit();
//            l.show();
            return;

            var f = new nw_rh.trees.nw_rh();
            f.show();
            return;

            var f = new qxnw.forms();
            var fields = [
                {
                    name: "address",
                    label: "Address",
                    type: "address"
                }
            ];
            f.setFields(fields);
            f.ui.address.setValue("Carrera          68                              A       12   A 20                                                                                       ");
            f.createDeffectButtons();
            f.ui.accept.addListener("execute", function () {
                var r = self.getRecord();
                console.log(r);
                return;
            });
            f.show();
            return;

            var fa = new qxnw.forms();
            fa.createDeffectButtons();

            fa.ui.accept.addListener("execute", function () {

                var rpc = new qxnw.rpc(qxnw.userPolicies.getRpcUrl(), "master", true);
                var data = {
                    "clients": [
                        {
                            "code": "Cod_ejemplo",
                            "address": "Cll 108 23",
                            "reference": "Easy",
                            "city": "BOGOTA, D.C.",
                            "county": "Cundinamarca",
                            "country": "Colombia",
                            "lat": 4.374562,
                            "lng": -74.452545,
                            "name": "Easy COLOMBIA S A ",
                            "client_name": "ANULL SAS BOGOTA, D.C.",
                            "client_code": "001",
                            "contact_phone": 3201112111,
                            "service_time": 20,
                            "time_windows": [
                                {
                                    "start": "05:00",
                                    "end": "10:45"
                                }
                            ],
                            "tags": [],
                            "orders": [
                                {
                                    "code": "10000035615",
                                    "description": "Ejemplo de orden",
                                    "units_1": 12,
                                    "units_2": 0.0375,
                                    "units_3": 1,
                                    "position": null,
                                    "vehicle_code": "12345678",
                                    "delivery_date": "07/09/2020",
                                    "order_tags": []
                                }
                            ]
                        }
                    ]
                };

                var func = function (rta) {
                    console.log(rta);
                };
                rpc.exec("testRestService", data, func);
                return;

                var req = new qx.io.remote.Request("https://app2-qa.driv.in/api/external/v2/orders?schema_code=123", "GET", "application/json");
                req.setCrossDomain(false);

                req.addListener("completed", function (e) {
                    console(e.getContent());
                });
                req.send();

                return;


                var rpc = new qx.io.remote.Rpc(
                        "https://app2-qa.driv.in/api/external/v2/orders?schema_code=123",
                        "orders"
                        );
                // asynchronous call
                var handler = function (result, exc) {
                    if (exc == null) {
                        alert("Result of async call: " + result);
                    } else {
                        alert("Exception during async call: " + exc);
                    }
                };
                rpc.callAsync(handler, "echo", "Test");

            });

            fa.ui.cancel.addListener("execute", function () {

            });
            fa.show();
            return;

            function start() {
                var fa = new qxnw.forms();
                fa.createDeffectButtons();

                fa.ui.accept.addListener("execute", function () {
                    var f = new qxnw.meet.widget();

                    var options = {};
                    options.startWithVideoMuted = false;
                    f.setConfigOptions(options);

                    f.setTitle("QXNW :: Vídeocall");
                    f.setRoom(12345);
                    f.setRoomName("Nombre room");
                    f.setDisplayName("Andrés Flórez");
                    f.setEmail("direccion@netwoods.net");
                    f.addListener("videoConferenceLeft", function () {
                        console.log("LEFT");
                    });
                    f.show();
//                    fa.masterContainer.add(f.getChildrenContainer());
                });

                fa.ui.cancel.addListener("execute", function () {
                    var f = new qxnw.meet.widget();
                    f.setTitle("QXNW :: Vídeocall")
                    f.setRoom(12345);
                    f.setRoomName("Nombre room");
                    f.setDisplayName("Andrés Flórez");
                    f.setEmail("direccion@netwoods.net");
                    f.addListener("videoConferenceLeft", function () {
                        console.log("LEFT");
                    });
                    f.show();
                });

//            f.close();

                fa.show();

            }

            start();
            return;

            var f = new crm.vista_metas.f_view();
            f.show();
            return;

            var f = new qxnw.forms();
            // table model
            var tableModel = new qx.ui.table.model.Simple();
            tableModel.setColumns(["ID", "A number"]);
            tableModel.setData([[1, 12.23], [3, 849759438750], [7, 354575], [67, 12345], [2, -2]]);

            // table
            var table = new qx.ui.table.Table(tableModel);
//            this.getRoot().add(table);
//            f.addButtonsFunctions();
            f.createDeffectButtons();
            f.ui.accept.addListener("execute", function () {
                tableModel.removeRows(2, 2);
//                var sm = table.getSelectionModel();
                var pane = table.getPane();
//                var pane = table.getPaneScroller(1);
                console.log(pane);
                var tablePane = pane.getTablePane();
//                sm.resetSelection();
//                pane.setFocusedCell(1, 1);
//                sm.setSelectionInterval(1, 1);
//                pane.activate();
                tablePane.activate();
            });
            f.add(table);
            f.show();
            return;

            var f = new qxnw.widgets.addressFinder();
            f.show();
            return;

            var f = new qxnw.forms();
            f.setWidth(400);
            f.setHeight(700);
            f.addFrame("https://api.whatsapp.com/send?phone=573144304998", false, null);
//            f.addFrame("/nwlib" + qxnw.userPolicies.getNwlibVersion() + "/includes/voip/WebPhone/webphone/samples/mobile_example.html#page_dialpad?callto=573144304998", false, null);
            f.show();
            return;

            var l = new nwadmin3.lists.l_grabacion_llamadas();
            l.show();
            return;

            var f = new crm.vista_metas.f_view();
            f.show();
            return;

            var closeTimeOut = new qx.event.Timer(3000);
            closeTimeOut.start();
            closeTimeOut.addListener("interval", function (e) {
                this.stop();
                var f = new paqueteo.lists.l_liquidaciones();
                f.show();
                return;
            });
            return;

            var f = new qxnw.nw_import_data.imp_chars_len();
            f.show();
            return;

            var f = new nwadmin3.trees.nw_clientes_prospecto();
            f.show();
            return;

            var f = new qxnw.nw_exp.main();
            f.show();
            return;

            var f = new nwproject5.forms.f_sitemaps();
            f.show();
            return;

            var d = new nwproject5.forms.f_seo();
            var pag = 1;
            d.setParamRecord(pag);
            d.setParamRecordEdit(pag);
            d.ui.titulo.setValue("hola es");
            d.ui.descripcion.setValue("una dos tres cuatro");
            d.setWidth(500);
            d.setHeight(500);
            d.show();
            return;

            var l = new nwproject5.lists.l_news();
            l.show();
            return;

            var l = new qxnw.nw_file_manager.trees.vista_general();
            parent.addSubWindow("Administración de imágenes / archivos", l);
            return;

            var l = new qxnw.examples.charts();
            var f = l.executeExample("funnel");
            f.ui.cancel.addListener("execute", function () {
                l.replot_widget("lines_image");
            });
            return;

            var f = new compras.tree.solicitudes();
            f.show();
            return;

            var f = new crm.vista_metas.f_view();
            f.show();
            return;

            var f = new qxnw.forms.main();
            f.show();
            return;

            var f = new compras.tree.solicitudes();
            f.show();
            return;

            var f = new cheques.forms.f_facturacion();
            f.show();
            return;

            var f = new qxnw.server.forms.f_execText();
            f.show();
            return;

            var f = new qxnw.examples.biostarTester();
            f.show();
            return;

            var f = new visitantes.lists.l_ingresos();
            f.show();
            return;

            var f = new qxnw.forms();
            var c = new qxnw.widgets.camera();
            f.masterContainer.add(c);
            f.show();
            return;

            var f = new visitantes.forms.f_ingresos();
            f.show();
            return;

            var f = new nwproject5.forms.f_news();
            f.show();
            return;

            var d = new nwproject5.forms.f_seo();
            var pag = 1;
            d.setParamRecord(pag);
            d.setParamRecordEdit(pag);
            d.ui.titulo.setValue("hola es");
            d.ui.descripcion.setValue("una dos tres cuatro");
            d.setWidth(500);
            d.setHeight(500);
            d.show();
            return;

            sit.utils.rndcGenerator();
            return;

            var f = new google_ads.tree.main();
            parent.addSubWindow("Sistema palabras clave", f);
            return;

            var wCalc = new qxnw.calc.init();
            wCalc.show();
            return;

            var f = new ord_prod.lists.l_remolques();
            f.show();
            return;

            var l = new nwadmin3.lists.l_cuentas_cobro();
            l.setMaximizedDynamicTable();
            l.show();
            return;

            var l = new logistica.lists.l_logistica();
            l.show();
            return;

            var d = new qxnw.lists();
//            d.setMaximizedDynamicTable();
            d.setTableMethod("master");
            //d.createFromTable("sit_caja_compensacion");
            d.createFromTable("nw_list_edit");
            d.setAllPermissions(true);
            parent.addSubWindow("NW LIST EDIT", d);
            return;

            var l = new qxnw.examples.list();
            l.show();
            return;

            var f = new ord_prod.lists.l_propietario();
            f.show();
            return;

            var f = new qxnw.nw_sync.forms.f_syncAll();
            f.show();
            return;

            var f = new qxnw.nw_sync.main();
            f.show();
            return;

            var f = new ord_prod.lists.l_remitentes_destinatarios();
            f.show();
            return;

            var f = new qxnw.cmi.main();
            f.show();
            return;

            parent.createMasterList("master", "ciudades", parent.tr("Empleados"), true);
            return;

            var f = [
                {
                    name: "fecha",
                    label: "Fecha",
                    type: "dateTimeField",
                    toolTip: "Ingrese el nombre del destinatario",
                    required: true
                },
                {
                    name: "fecha_alter",
                    label: "Fecha alter",
                    type: "dateTimeField",
                    toolTip: "Ingrese el nombre del destinatario",
                    required: true
                },
                {
                    name: "nombre",
                    label: "Nombre",
                    type: "textField",
                    mode: "search",
                    toolTip: "Ingrese el nombre del destinatario",
                    required: true
                },
                {
                    name: "email",
                    mode: "search.email",
                    label: "E-mail",
                    type: "textField",
                    toolTip: "Ingrese el correo electrónico",
                    required: true
                },
                {
                    name: "enviar_a_grupo",
                    label: "Enviar a un grupo",
                    type: "selectBox"
                },
                {
                    name: "observaciones",
                    mode: "maxWidth",
                    label: "Observaciones",
                    type: "textArea",
                    toolTip: "Observacioens"
                }
            ];
            qxnw.utils.dialog(f, "Envío de gráfico por correo electrónico", true);
            return;

            var f = new r_humanos.lists.l_empleados();
            f.show();
            return;

            var f = new qxnw.nw_sync.forms.f_syncAll();
            f.show();
            return;

            var f = new qxnw.nw_sync.main();
            f.show();
            return;

            var f = new qxnw.examples.formListEdit();
            f.show();
            return;

            var f = new crm.lists.l_tarifas();
            f.show();
            return;

            var f = new ord_prod.tree.vista_operativa();
            f.show();
            return;

            var f = new r_humanos.lists.l_empleados();
            f.show();
            return;

            var f = new ord_prod.forms.f_cumplir_manifiesto();
            f.setParamRecord(214);
            f.show();
            return;

            var f = new ord_prod.lists.l_remitentes_destinatarios();
            f.show();
            return;

            var f = new ord_prod.forms.f_cumplir_manifiesto();
            f.setParamRecord(201);
            f.show();
            return;

            var f = new ord_prod.forms.f_cumplir_remesa();
            f.setParamRecord(199);
            f.show();
            return;

            var l = new qxnw.examples.list();
            l.applyFilters();
            l.show();
            return;

            var f = new ord_prod.lists.l_remitentes_destinatarios();
            f.show();
            return;

            var f = new ord_prod.lists.l_vehiculos();
            f.show();
            return;

            var f = new ord_prod.lists.l_propietario();
            f.show();
            return;

            var f = new ord_prod.lists.l_conductor();
            f.show();
            return;

            var f = new nwproject5.forms.f_productoscatalogo();
            f.show();
            return;

            var l = new historia_clinica.forms.f_grafica();
            l.show();
            return;

            var f = new qxnw.errorreporting.form();
            f.show();
            return;

            parent.createMasterList("master", "nw_registro", parent.tr("Movimientos Generales"), false);
            return;

            var f = new historia_clinica.forms.f_consulta();
            f.show();
            return;

            var f = new historia_clinica.forms.f_historia_clinica();
            f.show();
            return;

            var l = new qxnw.forms.permissions();
            l.show();
            return;

            var d = new qxnw.lists();
            d.addAutoContextMenu("Eliminación completa", "icon/16/actions/document-properties.png", "slotEliminarPage", this);
            d.setTableMethod("master");
            d.createFromTable("paginas");
            d.addCounterLetters("titulo,descripcion");
            d.addCounterWords("palabras_clave");
            d.applyFilters();
            d.setAllPermissions(true);
            parent.addSubWindow("Páginas Sitio", d);
            return;

            var f = new nwproject5.forms.f_edit_seccion();
            f.setParamRecordEdit(1000651, "1", "1");
            f.show();
            return;

            var wNotes = new qxnw.forms.notes(self);
            wNotes.show();
            return;

            var f = new vas.lists.l_costo_embarque();
            f.show();
            return;

            var f = new ord_prod.forms.f_asociados_negocios();
            f.show();
            return;

            parent.loadDigitalPersonaSDK();

            var closeTimeOut = new qx.event.Timer(3000);
            closeTimeOut.start();
            closeTimeOut.addListener("interval", function (e) {
                this.stop();
                var f = new qxnw.examples.digitalPersona();
                f.show();
                return;
            });
            return;

            var f = new admisiones.forms.f_ingresos();
            f.show();
            return;

            var f = new logistica.lists.l_logistica();
            f.setModal(true);
            f.show();
            return;

            var l = new qxnw.nw_import_data.main();
            l.setTable("sit_configuracion_remolque");
//            l.setTable("sit_viajes_sat");
//            l.setTable("sit_eps");
            l.show();
            return;

            var l = new nwforms.lists.l_result();
            l.setParamRecord(12);
            l.applyFilters();
            parent.addSubWindow("FORMS", l);
            return;

            var f = new remision.lists.l_remision();
            parent.addSubWindow(parent.tr("Test"), f);
            return;

            var f = new qxnw.examples.form_no_qxnw();
            f.show();
            f.maximize();
            return;

            var f = new contratacion.lists.l_usuarios();
            f.setModal(true);
            f.show();
            return;

            parent.slotAnticiposViajes();
            return;

            var f = new ord_prod.forms.f_anticipos_generados();
            f.setModal(true);
            f.show();
            return;

            var l = new qxnw.security.entradas_salidas.l_entradas_salidas();
            l.show();
            return;

            var l = new admisiones.forms.f_datos_basicos();
            parent.addSubWindow(parent.tr("Reportes en Excel"), l);
            return;

            var l = new qxnw.nw_excel_reports.lists.l_er();
            parent.addSubWindow(parent.tr("Reportes en Excel"), l);
            return;

            var d = new qxnw.forms.permissions();
            d.show();
            return;

            var l = new qxnw.security.f_security_keys();
            l.show();
            return;

            var d = new qxnw.forms.cronometer();
            d.show();
            return;

            var d = new qxnw.lists();
            d.setTableMethod("master");
            d.createFromTable("nw_registro");
            parent.addSubWindow("Test maestro modificado", d);
            return;

            var f = new pos.forms.f_salidas();
            f.show();
            return;

            var l = new qxnw.examples.list();
            parent.addSubWindow("Encabezado Perfecto", l);
            return;

            qxnw.config.setShowInformationOnValidate(true);
            return;

//            var l = new contratacion.lists.l_manual();
//            l.show();
//            return;
//          
            var f = new qxnw.examples.tree();
            f.show();
            return;

//showTabView

            var l = new qxnw.locale.all();
            l.show();
            return;

            var f = new historia_clinica.forms.f_optometria();
            f.show();
            return;

            var t = new ord_prod.tree.vista_operativa();
            t.show();
            return;

            qxnw.userPolicies.setShowDashBoard(false);

            return;

            var l = new pos.lists.l_inventario();
            l.show();
            return;

            parent.createMasterList("master", "nw_list_edit", "TEST LIST", true);
            return;

            var t = new ord_prod.lists.l_op();
            t.show();
            return;

            var t = new ord_prod.forms.f_op_ne();
            t.show();
            return;

            var t = new ord_prod.forms.f_serviciosop_ne();
            t.show();
            return;

            var f = [
                {
                    name: "nombre",
                    label: "Nombre",
                    type: "textField",
                    mode: "search",
                    toolTip: "Ingrese el nombre del destinatario",
                    required: true
                },
                {
                    name: "email",
                    mode: "search.email",
                    label: "E-mail",
                    type: "textField",
                    toolTip: "Ingrese el correo electrónico",
                    required: true
                },
                {
                    name: "enviar_a_grupo",
                    label: "Enviar a un grupo",
                    type: "selectBox"
                },
                {
                    name: "observaciones",
                    mode: "maxWidth",
                    label: "Observaciones",
                    type: "textArea",
                    toolTip: "Observacioens"
                }
            ];
            qxnw.utils.dialog(f, "Envío de gráfico por correo electrónico", true);
            return;

            var data = {};
            data.cel = "573208481819";
            data.text = "Compra por Amazon";
            data.from = "NW Robot";
            data.user = "ecomsms";
            data.pass = "EcomSMS3";
            data.url = "http://ecom.colombiagroup.com.co/Api/rest/message";
            qxnw.utils.fastAsyncCallRpc("master", "sendSMSByCBG", data, function (rta) {
                console.log(rta);
            });
            return;

            var l = new productores.lists.l_productores();
            l.show();
            return;

            parent.slotAdminDB();
            return;

            var l = new qxnw.nw_file_manager.trees.vista_general();
            l.show();
            return;

            var d = new facturacion.forms.f_documentos();
            parent.addSubWindow("Documentos", d);
            return;

            parent.createMasterList("master", "nw_list_edit", "TEST LIST", true);
            return;

            parent.slotNwForms();
            return;

            var f = new nwforms.forms.f_json_agregar(10);
            f.show();
            return;

            var f = new nwforms.nav_table.n_json();
            f.setParamJson('{"VALIDATIONS":[{"value":"TRABAJANDO","fadeIn":{"grupos":{"0":"21","1":"27","2":"25","3":"15","4":"26"},"preguntas":{"0":"194","1":"195","2":"196","3":"197","4":"250","5":"249","6":"277","7":"251","8":"252","9":"253","10":"254","11":"255","12":"256","13":"257","14":"258","15":"259","16":"260","17":"219","18":"220","19":"221","20":"222","21":"223","22":"224","23":"225","24":"226","25":"227","26":"228","27":"132","28":"133","29":"134","30":"135","31":"136","32":"137","33":"138","34":"229","35":"175","36":"231","37":"232","38":"233","39":"233","40":"234","41":"235","42":"236","43":"238","44":"239","45":"240","46":"241","47":"242"}},"fadeOut":{"grupos":{"0":"10","1":"12","2":"14","3":"16","4":"23","5":"24","6":"20"}}},{"value":"BUSCANDO TRABAJO","fadeIn":{"grupos":{"0":"10","1":"12","2":"24","3":"14","4":"16","5":"20"},"preguntas":{"0":"98","1":"99","2":"100","3":"101","4":"102","5":"103","6":"104","7":"105","8":"106","9":"247","10":"248","11":"114","12":"115","13":"116","14":"209","15":"210","16":"211","17":"212","18":"213","19":"214","20":"215","21":"216","22":"217","23":"218","24":"219","25":"220","26":"123","27":"125","28":"127","29":"128","30":"129","31":"130","32":"139","33":"140","34":"141","35":"142","36":"143","37":"144","38":"145","39":"146","40":"147","41":"175","42":"176","43":"178","44":"280","45":"179","46":"180","47":"181","48":"182","49":"184","50":"186","51":"192","52":"193"}},"fadeOut":{"grupos":{"0":"11","1":"15","2":"21","3":"23","4":"25","5":"26","6":"27"}}},{"value":"ESTUDIANDO","fadeIn":{"grupos":{"0":"10","1":"12","2":"24","3":"14","4":"16","5":"20"},"preguntas":{"0":"98","1":"99","2":"100","3":"101","4":"102","5":"103","6":"104","7":"105","8":"106","9":"247","10":"248","11":"114","12":"115","13":"116","14":"209","15":"210","16":"211","17":"212","18":"213","19":"214","20":"215","21":"216","22":"217","23":"218","24":"219","25":"220","26":"123","27":"125","28":"127","29":"128","30":"129","31":"130","32":"139","33":"140","34":"141","35":"142","36":"143","37":"144","38":"145","39":"146","40":"147","41":"175","42":"176","43":"178","44":"280","45":"179","46":"180","47":"181","48":"182","49":"184","50":"186","51":"192","52":"193"}},"fadeOut":{"grupos":{"0":"11","1":"15","2":"21","3":"23","4":"25","5":"26","6":"27"}}},{"value":"OFICIOS DEL HOGAR","fadeIn":{"grupos":{"0":"10","1":"12","2":"24","3":"14","4":"16","5":"20"},"preguntas":{"0":"98","1":"99","2":"100","3":"101","4":"102","5":"103","6":"104","7":"105","8":"106","9":"247","10":"248","11":"114","12":"115","13":"116","14":"209","15":"210","16":"211","17":"212","18":"213","19":"214","20":"215","21":"216","22":"217","23":"218","24":"219","25":"220","26":"123","27":"125","28":"127","29":"128","30":"129","31":"130","32":"139","33":"140","34":"141","35":"142","36":"143","37":"144","38":"145","39":"146","40":"147","41":"175","42":"176","43":"178","44":"280","45":"179","46":"180","47":"181","48":"182","49":"184","50":"186","51":"192","52":"193"}},"fadeOut":{"grupos":{"0":"11","1":"15","2":"21","3":"23","4":"25","5":"26","6":"27"}}},{"value":"INCAPACIDAD PERMANENTE PARA TRABAJAR","fadeIn":{"grupos":{"0":"10","1":"12","2":"24","3":"14","4":"16","5":"20"},"preguntas":{"0":"98","1":"99","2":"100","3":"101","4":"102","5":"103","6":"104","7":"105","8":"106","9":"247","10":"248","11":"114","12":"115","13":"116","14":"209","15":"210","16":"211","17":"212","18":"213","19":"214","20":"215","21":"216","22":"217","23":"218","24":"219","25":"220","26":"123","27":"125","28":"127","29":"128","30":"129","31":"130","32":"139","33":"140","34":"141","35":"142","36":"143","37":"144","38":"145","39":"146","40":"147","41":"175","42":"176","43":"178","44":"280","45":"179","46":"180","47":"181","48":"182","49":"184","50":"186","51":"192","52":"193"}},"fadeOut":{"grupos":{"0":"11","1":"15","2":"21","3":"23","4":"25","5":"26","6":"27"}}},{"value":"OTRA ACTIVIDAD","fadeIn":{"grupos":{"0":"10","1":"12","2":"24","3":"14","4":"16","5":"20"},"preguntas":{"0":"98","1":"99","2":"100","3":"101","4":"102","5":"103","6":"104","7":"105","8":"106","9":"247","10":"248","11":"114","12":"115","13":"116","14":"209","15":"210","16":"211","17":"212","18":"213","19":"214","20":"215","21":"216","22":"217","23":"218","24":"219","25":"220","26":"123","27":"125","28":"127","29":"128","30":"129","31":"130","32":"139","33":"140","34":"141","35":"142","36":"143","37":"144","38":"145","39":"146","40":"147","41":"175","42":"176","43":"178","44":"280","45":"179","46":"180","47":"181","48":"182","49":"184","50":"186","51":"192","52":"193"}},"fadeOut":{"grupos":{"0":"11","1":"15","2":"21","3":"23","4":"25","5":"26","6":"27"}}},{"value":"OTHERS","fadeOut":{"grupos":{"0":"14","1":"15","2":"16","3":"20","4":"21","5":"23","6":"24","7":"25","8":"26","9":"27","10":"10","11":"12"}}}]}');
            f.show();
            return;

            var f = new nwforms.forms.f_json_agregar();
            f.show();
            return;

            var d = new veteapp.lists.l_bonos_veterinarias();
            parent.addSubWindow("Bonos Vete", d);
            return;

            var d = new qxnw.basics.forms.f_menu();
            d.show();
            return;

            var f = new veteapp.forms.grafico_pesos(100);
            f.setModal(true);
            f.setTitle("Gráfico de pesos");
            f.show();
            f.maximize();
            return;

            var l = new veteapp.lists.l_datos_basicos();
            parent.addSubWindow("DATOS BÁSICOS PRUEBA", l);
            return;

            parent.slotDeveloperDescriptions();
            return;

            qxnw.utils.enableMouse();
            return;

            var f = new qxnw.examples.listSQLServer();
            f.show();
            return;

            var f = new gsh.tiq.trees.f_map_estaciones_tiquets();
            f.show();
            return;

            parent.createMasterList("master", "fenavi_cargos", "Test maestro", true);
            return;

            var f = new historia_clinica.forms.f_fisioterapia();
            f.show();
            return;

            var l = new qxnw.examples.charts();
            l.executeExample("bars");
            return;

            var l = new contratacion.forms.f_empresas();
            var d = {};
            d.id_empresa = 1;
            //l.setParamRecordVer(d);
            l.show();
            return;

            parent.__slotConfigServersDb();
            return;

            var l = new qxnw.examples.listSQLServer();
            parent.addSubWindow("Encabezado Perfecto", l);
            return;

            setTimeout(function () {
                l.dynamicTable();
            }, 1000);
            return;

            var l = new qxnw.examples.list();
            l.setWidthAllColumns(100);
            l.setColumnVisibilityButtonVisible(false);
            l.table.blockHeaderElements();
            parent.addSubWindow("Encabezado Perfecto", l);
            return;

            var f = new qxnw.forms.themeSwitcher();
            f.show();
            return;

            var l = parent.createMasterList("master", "nw_server_db", "Test maestro", true);
            l.ui.updateButton.addListener("click", function () {
                var t = setInterval(function () {
                    clearInterval(t);
                    var data = {};
                    data.table = "nw_bulk_records";
                    data.columns = "clave,valor,modulo,empresa,usuario,fecha";
                    data.modulo = 1;
                    data.records = l.getAllRecords()[0];
                    qxnw.utils.fastAsyncCallRpc("master", "saveRecord", data, function (rta) {
                        console.log(rta);
                    });
                }, 100);
            });
            return;

            qx.theme.manager.Meta.getInstance().setTheme(qxnw.themes.aristo.Aristo);
            return;

            var f = new admisiones.forms.f_datos_basicos();
            f.show();
            return;

            var f = new qxnw.forms();
            var fields = [
                {
                    name: "dateTimeField",
                    label: "dateTimeField",
                    type: "dateTimeField"
                }
            ];
            f.setFields(fields);
            f.show();
            return;

            var f = new qxnw.examples.f_testing();
            f.show();
            return;

            var f = new qxnw.forms.securityQuestions();
            f.show();
            return;

            var f = new historia_clinica.forms.f_fisioterapia();
            f.show();
            return;

            //qxnw.utils.enableMouse();

            var f = new qxnw.examples.form_payu();
            f.show();
            return;

            var f = new historia_clinica.forms.f_psicologia_antecedentes();
            f.show();
            return;

            var d = new qxnw.basics.lists.l_usuarios();
            parent.addSubWindow(parent.tr("Usuarios"), d);
            return;

            parent.openSupport();
            return;

            var f = new historia_clinica.forms.f_personales();
            f.show();
            return;

            parent.createMasterList("master", "msf_pacientes", "Pacientes", true);
            return;

            var f = new qxnw.examples.formCkeditor();
            f.show();
            return;

            var f = new qxnw.forms.smtp();
            f.show();
            return;

            var f = new qxnw.examples.accordion();
            f.show();
            return;

            var l = new qxnw.examples.formNav();
            l.show();
            return;

            var l = new qxnw.chat.init();
            l.show();
            return;

            var d = new soporte.trees.soporte();
            parent.addSubWindow("NwLive", d);
            return;

            "que pasa amigó";
            return;

            var t = new edi.trees.edi();
            t.show();
            return;

            var l = new qxnw.examples.list();
            parent.addSubWindow("Encabezado perfecto", l);
            return;

            qxnw.utils.question("en serio??");
            return;

            var l = new qxnw.forms.notes();
            l.show();
            return;

            var l = new soporte.forms.init();
            l.show();
            return;

            qxnw.utils.enableMouse();

            return;

            var t = new compras.tree.solicitudes();
            t.show();
            return;

            var f = new entrenamientos.tree.programas();
            f.show();
            return;

            var l = new qxnw.examples.dragdrop();
            l.show();
            return;

            var l = new qxnw.examples.formNav();
            l.show();
            return;

            var f = new qxnw.examples.form_light();
            f.show();
            return;

            var par = {
                from: 'spa',
                to: 'zh',
                query: 'Hola China',
                appid: "20160629000024222",
                pass: "594f5RRXxr9P3NDq72sD"
            };
            var func = function (e) {
                console.log(e);
            };
            qxnw.local.translateByBaidu(par, func);
            return;

            var l = new admin.lists.l_siniestros();
            l.show();
            return;

            var self = this;
            var d = new qxnw.lists();
            d.setTableMethod("master");
            d.createFromTable("usuarios");
            d.setAllPermissions(true);
            parent.addSubWindow("Test otra tabla", d);
            return;

            var l = new crm.clientes.l_clientes();
            l.show();
            return;

            console.log(qxnw.utils.cleanLineBreaks(" hola"));

            return;

            var l = new entrenamientos.lists.l_cursos_calificacion();
            l.show();
            return;

            var l = new admin.lists.l_siniestros();
            parent.addSubWindow("Siniestros", l);
            return;

            var f = new entrenamientos.forms.f_asistencia();
            f.show();
            return;

            var f = new entrenamientos.lists.l_cursos_calificacion();
            f.show();
            return;

            var f = new entrenamientos.tree.sesiones();
            f.show();
            return;

            parent.createMasterList("master", "nw_modulos_grupos", "Módulos", true);
            return;

            var f = new entrenamientos.lists.l_participantes();
            f.show();
            return;

            var f = new entrenamientos.forms.f_asistencia();
            f.show();
            return;

            var f = new qxnw.forms();
            f.createButtons = true;
            f.show();
            return;

            var f = new qxnw.basics.lists.l_usuarios();
            parent.addSubWindow("Usuarios", f);
            return;

            parent.createMasterList("master", "pep_programas", "PepsiCo", true);
            return;

            var f = new qxnw.ssh.f_console();
            f.show();
            return;

            var f = new qxnw.examples.form();
            parent.addSubWindow("Formulario compuesto", f);
            return;

            parent.createMasterList("master", "view_produccion", "Producción");
            return;

            var cmi = new qxnw.cmi.main();
            parent.addSubWindow("Cuadro de mando integral", cmi);
            return;

            var l = new qxnw.examples.list();
            parent.addSubWindow("Encabezado perfecto", l);
            return;

            var f = new qxnw.examples.tree();
            parent.addSubWindow("Filter tree mistake", f);
            return;

            parent.slotSitDespachos();
            return;

            var f = new qxnw.nw_forms_designer.terminal();
            f.show();
            return;

            var f = new qxnw.basics.forms.f_menu();
            f.show();
            return;

            parent.test();
            return;

            var l = new gsh.tiq.lists.l_tiquets();
            l.show();
            return;

            var l = new gsh.tiq.trees.tickets();
            l.show();
            return;

            var tree = new qxnw.mobile.treeAdmin();
            parent.addSubWindow("Mobile test", tree);
            return;

            parent.slotAdminDB();
            return;

            parent.slotSitemaps();

            return;

            var l = new qxnw.examples.formApplet();
            l.show();
            return;

            var l = new qxnw.examples.listOracle();
            l.show();
            return;

            parent.createMasterList("master", "testOracle", "Oracle", true);
            return;

            qxnw.utils.enableMouse();

            var f = new qxnw.examples.formVideoChat();
            f.show();
            //f.hideTabButton(0);

            return;


            parent.slotNWUsuarios();
            return;

            var d = new saje.lists.l_proveedores();
            d.show();
            return;

            //qxnw.utils.enableMouse();

            //return;

            var f = new qxnw.examples.formNav();
            f.show();
            //f.hideTabButton(0);

            return;


//            var l = new qxnw.examples.listEdit();
//            var base = l.getBase();
//            //base.setMaxHeight(300);
//            f.insertNavTable(base, "NavTable");
//            
            return;

//
//
//            var t = new compras.tree.solicitudes();
//            t.show();
//            return;
//
//            var l = new sit.lists.l_trailers_vista_alterna();
//            l.show();
//            return;
//
//            return;
//
//            qxnw.utils.enableMouse();
//
//            var l = new qxnw.examples.listEdit();
//            l.show();
//            return;

//            var l = new geimp.lists.l_tir();
//            l.show();
//            return;
//            

            var l = new qxnw.nw_cron.l_cron();
            l.show();
            return;

//
//            return;
//
//            var l = new qxnw.nw_notifications.manage();
//            l.show();
//            return;
//
//            var l = new propuestas_automaticas.lists.l_propuestas();
//            l.show();
//            return;
//
//            return;
//
//

//            var t = new compras.tree.solicitudes();
//            t.show();
//            return;
//
//            var cmi = new qxnw.cmi.main();
//            cmi.show();
//            return;
//
//            var f = new crm.contratos.l_contratos();
//            f.show();
//            return;
//
//            var l = new sis.lists.l_backups();
//            l.show();
//            return;
//


//            var d = new qxnw.forms();
//            d.setTableMethod("master");
//            d.createFromTableGenerateSeq("usuarios");
//            d.settings.accept = function(r) {
//                console.log(r);
//            };
//            d.show();
//            return;
//
//
//            var l = new qxnw.examples.f_testing();
//            l.show();
//            return;
//            
//
//            var f = new co.forms.f_analisis();
//            f.show();
//            return;

            var d = new ek_operaciones.lists.l_novedades_empleados();
            d.setAllPermissions(true);
            d.ui.newButton.setEnabled(true);
            d.show();
            return;

            var f = new qxnw.forms();
            f.createFromTable("nw_list_edit");
            f.show();
            return;

            var f = new qxnw.examples.form();
            f.show();
            return;

            parent.slotNWModulos();
            return;

            //qxnw.utils.enableMouse(); 
            var f = new nwsa.forms.f_modify_firewall();
            f.show();
            return;

            var f = new qxnw.forms();
            f.serialField("id");
            f.setTableMethod("master");
            f.createFromTable("afiliadoras");
            f.setTitle("navTable test");
            f.show();
        }
    }
});
