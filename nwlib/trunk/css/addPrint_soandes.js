document.addEventListener("DOMContentLoaded", function () {
    var get = getGET();
    var da = document.querySelectorAll(".qx-button-disabled");
    for (var x = 0; x < da.length; x++) {
        var h = da[x];
        var g = get_content(h);
        if (g === "Hoy") {
            h.remove();
        }
    }

    if (get) {
        if (get.type === "Evolución EMO") {
            console.log(get.type);
//            addClass(document.querySelector(".qx-group_padre_2 .qx-group"), "nwContainFields");
//            organizeFields("0", "1", false, "auto", "auto", ".qx-group_padre_2");

//            anchoinDivChild("Evolucion_EMO", "0", "3", 1, "1000", false, "margin: 5px 0px 10px 0px!important;");
//            cssTable("Evolucion_EMO", "0", "1");
//            anchoColTable("Evolucion_EMO", "0", "7", "2", "250");
//            anchoColTable("Evolucion_EMO", "0", "8", "2", "300");
//            var d = document.querySelector(".fieldsOrganEnded_form_4_group_1_item_60");
//            anchoinDivChild("Evolucion_EMO", "4", "1", 4, "1000", d, "margin: 10px 0px 0px 0px!important;border-top: 1px solid #e2e2e2!important;");
//            addCss("1", "2", ".qx-table-scroller-header", "background:#fff!important;");

        } else
        if (get.type === "Evolución Espirometría") {
            var a = document.querySelectorAll(".containerForm_0 .qxuigroupboxGroupBox_0 .nw_container_fields_form_qxnwfield_endGroup_padre > div");
            a[0].innerHTML = "<h2 class='containFile'></h2>";

        } else
        if (get.type === "Evolución Fisioterapia") {
            cssTable("Evolucion_Fisioterapia", "0", "0");
//            anchoColTable("Evolucion_Fisioterapia", "0", "0", "2", "400");
        } else
        if (get.type === "Evolución Visiometría") {
            cssTable("Evolucion_Visiometria", "0", "0");
            anchoColTable("Evolucion_Visiometria", "0", "0", "2", "400");
        } else
        if (get.type === "Evolución Optometría") {
            cssTable("Evolucion_Optometria", "0", "0");
            anchoColTable("Evolucion_Optometria", "0", "0", "2", "400");
        } else
        if (get.type === "Evolución Audiometría") {
            organizeFields("0", "0");
        } else
        if (get.type === "Visiometría") {

            pageBreak("0", "7", "before");
            pageBreak("0", "12", "before");

            organizeFields("0", "1", true, "200", "200");
//            anchoinDivChild("Visiometria", "0", "1", 3, "1000", false, "margin: 5px 0px 10px 0px!important;");
            var d = document.querySelector(".fieldsOrganEnded_form_0_group_1_item_4");
            anchoinDivChild("Visiometria", "3", "17", 10, "1000", d, "");

            organizeFields("0", "2", true, "200", "200");
            var d = document.querySelector(".fieldsOrganEnded_form_0_group_2_item_7");
            anchoinDivChild("Visiometria", "3", "17", 10, "1000", d, "");

            organizeFields("0", "3", true);
            organizeFields("0", "4", true, "200", "200");
            organizeFields("0", "5", true, "200", "200");
            organizeFields("0", "6");
            orderTextOfSelectBox("Visiometria", "0", "3", 30, "90", "380");
            orderTextOfSelectBox("Visiometria", "0", "6", 30, "90", "380");
            anchoinDivChild("Visiometria", "0", "6", 11, "1000");

            cssTable("Visiometria", "0", "7");

            anchoColTable("Visiometria", "0", "7", "2", "250");
            anchoColTable("Visiometria", "0", "7", "3", "250");

        } else
        if (get.type === "Alturas") {
            organizeFields("0", "1");
            organizeFields("0", "2");
            organizeFields("0", "3");
            organizeFields("0", "4");
            organizeFields("0", "5");
            organizeFields("0", "6");

            orderTextOfSelectBox("Alturas", "0", "1", 32, "90", "350");

            var d = document.querySelector(".fieldsOrganEnded_form_0_group_1_item_32");
            anchoinDivChild("Alturas", "0", "1", "last", "1000", d);

            orderTextOfSelectBox("Alturas", "0", "2", 32, "120", "350");
            anchoinDivChild("Alturas", "0", "2", 7, "1000");
            anchoinDivChild("Alturas", "0", "2", 8, "120");
            anchoinDivChild("Alturas", "0", "2", 9, "350");
            anchoinDivChild("Alturas", "0", "2", 10, "120");
            anchoinDivChild("Alturas", "0", "2", 11, "350");
            anchoinDivChild("Alturas", "0", "2", 12, "1000");


        } else
        if (get.type === "Exploración de Olfato") {
            organizeFields("0", "1");
            organizeFields("0", "2");
            organizeFields("0", "3");
            organizeFields("0", "4");
            organizeFields("0", "5");
            organizeFields("0", "6");
        } else
        if (get.type === "Fisioterapia") {
            organizeFields("0", "1");

//            addMidle("0", "1");

            organizeFields("0", "3", false, "auto", "auto");
            anchoinDivChild("Fisioterapia", "0", "3", 1, "1000", false, "margin: 5px 0px 10px 0px!important;");
            anchoinDivChild("Fisioterapia", "0", "3", 2, "1000", false, "display: none!important;");
            anchoinDivChild("Fisioterapia", "0", "3", 14, "1000", false, "margin: 5px 0px 10px 0px!important;");
            anchoinDivChild("Fisioterapia", "0", "3", 15, "1000", false, "display: none!important;");
            anchoinDivChild("Fisioterapia", "0", "3", 27, "1000", false, "margin: 5px 0px 10px 0px!important;");
            anchoinDivChild("Fisioterapia", "0", "3", 28, "1000", false, "display: none!important;");
            anchoinDivChild("Fisioterapia", "0", "3", 42, "1000", false, "margin: 5px 0px 10px 0px!important;");
            anchoinDivChild("Fisioterapia", "0", "3", 43, "1000", false, "margin: 5px 0px 10px 0px!important;");
            anchoinDivChild("Fisioterapia", "0", "3", 44, "1000", false, "margin: 5px 0px 10px 0px!important;");

//            anchoinDivChild("Fisioterapia", "0", "1", 2, "350");

            organizeFields("0", "2");
            organizeFields("0", "16");
            organizeFields("0", "17");
            organizeFields("0", "18");
            organizeFields("0", "19");
            organizeFields("0", "20");
            organizeFields("0", "21");
            organizeFields("0", "22");
            organizeFields("0", "23");
            organizeFields("0", "24");
            organizeFields("0", "26");
            cssTable("Fisioterapia", "0", "27");
            anchoColTable("Fisioterapia", "0", "27", "2", "850");

            organizeFields("0", "28", false, "400", "400");
            organizeFields("0", "29", false, "400", "400");
            organizeFields("0", "30", false, "auto", "auto");

        } else
        if (get.type === "General") {
            organizeFields("1", "1");
            organizeFields("1", "2");
            organizeFields("1", "4");
            organizeFields("1", "5");
            organizeFields("1", "6");
            organizeFields("1", "7");
            organizeFields("1", "8");
            organizeFields("1", "9");
//            organizeFields("1", "10");
            organizeFields("1", "11");

            for (var i = 1; i < 23; i++) {
                organizeFields("3", i);
            }

            cssTable("General", "2", "1");
//            anchoColTable("Fisioterapia", "0", "27", "2", "850");

        } else
        if (get.type === "Vacunación") {
            var a = document.querySelectorAll(".containerForm_0 .qxuigroupboxGroupBox_2 .qx-group .qx-button");
            var t = a.length;
            for (var i = 0; i < t; i++) {
                var e = a[i];
                e.remove();
            }

            var inf = convertedRowInHeight(8, 60, 0, 1);
            var s = document.querySelector(".containerForm_0 .qxuigroupboxGroupBox_1");
            s.style.height = inf + 100 + "px";

            var inf = convertedRowInHeight(7, 40, 0, 2);
            var s = document.querySelector(".containerForm_0 .qxuigroupboxGroupBox_2");
            s.style.height = inf + 100 + "px";

            cssTable("Vacunacion", "0", "0");
            cssTable("Vacunacion", "0", "1");
            cssTable("Vacunacion", "0", "2");
//            anchoColTable("Vacunacion", "0", "27", "2", "850");

        } else
        if (get.type === "Apoyo Diagnóstico") {
            var a = document.querySelectorAll(".containerForm_0 .qxuigroupboxGroupBox_2 .qx-group > div");
            a[0].innerHTML = "<h2 class='containFile'></h2>";
            organizeFields("0", "1");
            organizeFields("0", "2");
        } else
        if (get.type === "Psicología") {
            var a = document.querySelector(".containerForm_1 .qxuigroupboxGroupBox_1 .qx-group");
            a.innerHTML = "<h2 class='containFile'></h2>";
            organizeFields("1", "0");
            organizeFields("1", "1");
            organizeFields("2", "1");
            organizeFields("2", "2");
            organizeFields("2", "3");
            organizeFields("2", "4");
            organizeFields("2", "5");
            organizeFields("4", "1");
            organizeFields("4", "2");
            organizeFields("4", "3");


            orderTextOfSelectBox("Psicologia", "2", "1", 7, "200", "200");
            orderTextOfSelectBox("Psicologia", "2", "2", 7, "350", "250");
            orderTextOfSelectBox("Psicologia", "2", "3", 7, "350", "250");
            orderTextOfSelectBox("Psicologia", "2", "4", 12, "1000", "1000");

            orderTextOfSelectBox("Psicologia", "4", "2", 30, "140", "320");
//            anchoinDivChild("Espirometria", "0", "1", 29, "1000");

        } else
        if (get.type === "Espirometría") {
            var a = document.querySelectorAll(".containerForm_0 .qxuigroupboxGroupBox_5 .qx-group > div");
            a[0].innerHTML = "<h2 class='containFile'></h2>";
            var a = document.querySelectorAll(".containerForm_0 .qxuigroupboxGroupBox_6 .qx-group .qx-button-disabled");
            var t = a.length;
            for (var i = 0; i < t; i++) {
                var e = a[i];
                e.remove();
            }
            var a = document.querySelectorAll(".containerForm_0 .qxuigroupboxGroupBox_6 .qx-group .qx-button");
            var t = a.length;
            for (var i = 0; i < t; i++) {
                var e = a[i];
                e.remove();
            }
            organizeFields("0", "1");
            organizeFields("0", "2");
            organizeFields("0", "3");
            organizeFields("0", "4");
            organizeFields("0", "6");
            organizeFields("0", "7");
            organizeFields("0", "8");
            organizeFields("0", "9");
            organizeFields("0", "10");
            organizeFields("0", "11");

//            organizeFields("0", "5");
//            cssTable("Espirometria", "0", "5");
//            anchoColTable("Espirometria", "2", "3", "2", "300");

            orderTextOfSelectBox("Espirometria", "0", "1", 30, "90", "350");
            anchoinDivChild("Espirometria", "0", "1", 29, "1000");

            orderTextOfSelectBox("Espirometria", "0", "3", 30, "100", "350");
            anchoinDivChild("Espirometria", "0", "2", 8, "1000");
            anchoinDivChild("Espirometria", "0", "2", 15, "1000");
            anchoinDivChild("Espirometria", "0", "4", 7, "1000");


        } else
        if (get.type === "Psicosensometrico") {
            var a = document.querySelector(".containerForm_1 .qxuigroupboxGroupBox_1 .qx-group");
            a.innerHTML = "<h2 class='containFile'></h2>";
            organizeFields("1", "1");
            organizeFields("2", "1");
            organizeFields("2", "2");
            organizeFields("2", "3");
            organizeFields("3", "1");
        } else
        if (get.type === "Imagenología") {
            var a = document.querySelector(".qxuigroupboxGroupBox_1 .qx-group");
            a.innerHTML = "<h2 class='containFile'></h2>";
            organizeFields("0", "1");
            organizeFields("0", "3");

        } else
        if (get.type === "Audiometría") {
            organizeFields("1", "0");
            organizeFields("1", "1");
            organizeFields("1", "2");
            organizeFields("1", "3");
            organizeFields("1", "4");
            organizeFields("1", "5");
            organizeFields("1", "6");
            organizeFields("1", "7");
            organizeFields("2", "0");
            organizeFields("4", "0");
            organizeFields("3", "0");
            organizeFields("3", "5");
            organizeFields("4", "1");
            organizeFields("5", "0");
//            organizeFields("5", "1");

        } else
        if (get.type === "Optometría") {
            organizeFields("0", "1");
            organizeFields("0", "2");
            organizeFields("0", "3");
            organizeFields("0", "4");
            organizeFields("0", "5");
            organizeFields("0", "6");
            organizeFields("0", "7");
            organizeFields("0", "11", false, "400", "400");
            organizeFields("0", "12", false, "400", "400");
            organizeFields("0", "13", false, "400", "400");
            organizeFields("0", "14");
            organizeFields("0", "15", true, "100", "300");
//            organizeFields("0", "16", true, "auto", "auto");
            organizeFields("0", "17");
            organizeFields("0", "18", true, "auto", "auto");
            organizeFields("0", "19");
            organizeFields("0", "20");

            addCss("0", "16", "", "height:100px;");

            var d = document.querySelector(".fieldsOrganEnded_form_0_group_15_item_10");
            anchoinDivChild("Examen_Medico_Ocupacional", "3", "17", 10, "1000", d, "margin-top:10px;");

//            cssTable("Optometria", "0", "8");
            anchoColTable("Optometria", "0", "8", "2", "300");
            anchoColTable("Optometria", "0", "8", "3", "300");
            //            orderTextOfSelectBox("Examen_Medico_Ocupacional", "1", "5", 120, "90", "350");
            anchoinDivChild("Optometria", "0", "1", "4", "1000");
            anchoinDivChild("Optometria", "0", "1", "5", "1000");

        } else
        if (get.type === "Examen Médico Ocupacional") {


//            organizeFields("1", "5");
            organizeFields("1", "5", false, "auto", "auto");

//            anchoinDivChild("Examen_Medico_Ocupacional", "0", "3", 1, "1000", false, "margin: 5px 0px 10px 0px!important;");

            addCss("1", "2", ".qx-table-scroller-header", "background:#fff!important;");

            organizeFields("1", "0", false, "auto", "auto");
//            organizeFields("1", "3");
            organizeFields("1", "8");
            organizeFields("1", "9");
            organizeFields("1", "10");

            organizeFields("2", "0");
            organizeFields("2", "1");

            organizeFields("3", "0");
            organizeFields("3", "1");
            organizeFields("3", "2");
//            organizeFields("3", "3");
            organizeFields("3", "4");
            organizeFields("3", "5");
            organizeFields("3", "6");
            organizeFields("3", "7", true, "auto", "auto");
            organizeFields("3", "8", true, "auto", "auto");
            organizeFields("3", "9", true, "auto", "auto");
            organizeFields("3", "10", true, "auto", "auto");
            organizeFields("3", "11");
            organizeFields("3", "12", true, "auto", "auto");
            organizeFields("3", "13");
            organizeFields("3", "14");
            organizeFields("3", "15");
            organizeFields("3", "16");

            organizeFields("3", "17", false, "240", "240");
            var d = document.querySelector(".fieldsOrganEnded_form_3_group_17_item_0");
            anchoinDivChild("Examen_Medico_Ocupacional", "3", "17", 10, "400", d, "");
            var d = document.querySelector(".fieldsOrganEnded_form_3_group_17_item_1");
            anchoinDivChild("Examen_Medico_Ocupacional", "3", "17", 10, "400", d, "");

            organizeFields("3", "18");
            organizeFields("3", "19");
            organizeFields("3", "20", true, "auto", "auto");

            orderTextOfSelectBox("Examen_Medico_Ocupacional", "3", "1", 5, "200", "200");
            orderTextOfSelectBox("Examen_Medico_Ocupacional", "3", "2", 10, "200", "200");
            orderTextOfSelectBox("Examen_Medico_Ocupacional", "3", "4", 25, "220", "220");
            orderTextOfSelectBox("Examen_Medico_Ocupacional", "3", "7", 25, "200", "200");
            orderTextOfSelectBox("Examen_Medico_Ocupacional", "3", "18", 25, "200", "200");

            organizeFields("3", "3", true, "100", "300");
            var d = document.querySelector(".fieldsOrganEnded_form_3_group_3_item_10");
            anchoinDivChild("Examen_Medico_Ocupacional", "3", "3", 10, "1000", d, "margin: 10px 0px 0px 0px!important;border-top: 1px solid #e2e2e2!important;");

            organizeFields("3", "11", true, "auto", "auto");

            organizeFields("4", "0");

            organizeFields("4", "1", false, "330", "330");

            var d = document.querySelector(".fieldsOrganEnded_form_4_group_1_item_3");
            anchoinDivChild("Examen_Medico_Ocupacional", "4", "1", 4, "1000", d, "margin: 10px 0px 0px 0px!important;border-top: 1px solid #e2e2e2!important;");
            var d = document.querySelector(".fieldsOrganEnded_form_4_group_1_item_7");
            anchoinDivChild("Examen_Medico_Ocupacional", "4", "1", 4, "1000", d, "margin: 10px 0px 0px 0px!important;border-top: 1px solid #e2e2e2!important;");
            var d = document.querySelector(".fieldsOrganEnded_form_4_group_1_item_11");
            anchoinDivChild("Examen_Medico_Ocupacional", "4", "1", 4, "1000", d, "margin: 10px 0px 0px 0px!important;border-top: 1px solid #e2e2e2!important;");
            var d = document.querySelector(".fieldsOrganEnded_form_4_group_1_item_15");
            anchoinDivChild("Examen_Medico_Ocupacional", "4", "1", 4, "1000", d, "display:none!important;");
            var d = document.querySelector(".fieldsOrganEnded_form_4_group_1_item_19");
            anchoinDivChild("Examen_Medico_Ocupacional", "4", "1", 4, "1000", d, "display:none!important;");
            var d = document.querySelector(".fieldsOrganEnded_form_4_group_1_item_23");
            anchoinDivChild("Examen_Medico_Ocupacional", "4", "1", 4, "1000", d, "display:none!important;");
            var d = document.querySelector(".fieldsOrganEnded_form_4_group_1_item_27");
            anchoinDivChild("Examen_Medico_Ocupacional", "4", "1", 4, "1000", d, "display:none!important;");
            var d = document.querySelector(".fieldsOrganEnded_form_4_group_1_item_31");
            anchoinDivChild("Examen_Medico_Ocupacional", "4", "1", 4, "1000", d, "display:none!important;");
            var d = document.querySelector(".fieldsOrganEnded_form_4_group_1_item_35");
            anchoinDivChild("Examen_Medico_Ocupacional", "4", "1", 4, "1000", d, "display:none!important;");
            var d = document.querySelector(".fieldsOrganEnded_form_4_group_1_item_39");
            anchoinDivChild("Examen_Medico_Ocupacional", "4", "1", 4, "1000", d, "display:none!important;");
            var d = document.querySelector(".fieldsOrganEnded_form_4_group_1_item_43");
            anchoinDivChild("Examen_Medico_Ocupacional", "4", "1", 4, "1000", d, "display:none!important;");
            var d = document.querySelector(".fieldsOrganEnded_form_4_group_1_item_47");
            anchoinDivChild("Examen_Medico_Ocupacional", "4", "1", 4, "1000", d, "display:none!important;");
            var d = document.querySelector(".fieldsOrganEnded_form_4_group_1_item_51");
            anchoinDivChild("Examen_Medico_Ocupacional", "4", "1", 4, "1000", d, "display:none!important;");
            var d = document.querySelector(".fieldsOrganEnded_form_4_group_1_item_55");
            anchoinDivChild("Examen_Medico_Ocupacional", "4", "1", 4, "1000", d, "display:none!important;");
            var d = document.querySelector(".fieldsOrganEnded_form_4_group_1_item_59");
            anchoinDivChild("Examen_Medico_Ocupacional", "4", "1", 4, "1000", d, "display:none!important;");
            var d = document.querySelector(".fieldsOrganEnded_form_4_group_1_item_60");
            anchoinDivChild("Examen_Medico_Ocupacional", "4", "1", 4, "1000", d, "margin: 10px 0px 0px 0px!important;border-top: 1px solid #e2e2e2!important;");

            organizeFields("5", "0");
            organizeFields("5", "1");
            organizeFields("5", "3");
            orderTextOfSelectBox("Examen_Medico_Ocupacional", "5", "3", 25, "200", "200");
            organizeFields("5", "4");
            orderTextOfSelectBox("Examen_Medico_Ocupacional", "5", "4", 25, "220", "220");
            organizeFields("5", "5");
            orderTextOfSelectBox("Examen_Medico_Ocupacional", "5", "5", 25, "200", "200");
            organizeFields("5", "6");
            organizeFields("5", "8");

            var te = document.querySelector(".containerForm_1 .qxuigroupboxGroupBox_1 .convertedInputs_textarea");
            if (te != null) {
                var a = document.createElement("div");
                a.innerHTML = "<h2>Observaciones</h2>" + te.innerHTML;
//                document.querySelector(".containerForm_1 .qxuigroupboxGroupBox_1 .nwContainFields").appendChild(te);
                document.querySelector(".containerForm_1 .qxuigroupboxGroupBox_1 .nwContainFields").appendChild(a);
            }
            var te = document.querySelector(".containerForm_1 .qxuigroupboxGroupBox_1 .convertedInputs_convertedInputs_textarea_padre");
            if (te) {
                te.remove();
            }
//            var inf = convertedRowInHeight(10, 30, 1, 1);
//            var s = document.querySelector(".containerForm_1 .qxuigroupboxGroupBox_1");
//            s.style.height = inf + 0 + "px";
//            var s = document.querySelector(".containerForm_1 .qxuigroupboxGroupBox_1 .qx-table-statusbar_padre");
//            s.style.minHeight = inf + 0 + "px";
//            var s = document.querySelector(".containerForm_1 .qxuigroupboxGroupBox_1 .qx-tabview-pane_padre_padre");
//            s.style.minHeight = inf + 0 + "px";

            cssTable("Examen_Medico_Ocupacional", "1", "1");

            cssTable("Examen_Medico_Ocupacional", "1", "6");

            anchoColTable("Examen_Medico_Ocupacional", "1", "6", "1", "250");
            anchoColTable("Examen_Medico_Ocupacional", "1", "6", "2", "350");

            var w = "90";
            for (var i = 1; i < 10; i++) {
                anchoColTable("Examen_Medico_Ocupacional", "1", "1", i, w);
            }

            cssTable("Examen_Medico_Ocupacional", "1", "7");
            var w = "120";
            for (var i = 1; i < 9; i++) {
                anchoColTable("Examen_Medico_Ocupacional", "1", "7", i, w);
            }

            var inf = convertedRowInHeight(6, 50, 1, 4);
            var s = document.querySelector(".containerForm_1 .qxuigroupboxGroupBox_4");
            if (s) {
                s.style.height = inf + 100 + "px";
            }
            var s = document.querySelector(".containerForm_1 .qxuigroupboxGroupBox_4 .qx-table-statusbar_padre");
            if (s) {
                s.style.minHeight = inf + 0 + "px";
            }
            var s = document.querySelector(".containerForm_1 .qxuigroupboxGroupBox_4 .qx-tabview-pane_padre_padre");
            if (s) {
                s.style.minHeight = inf + 0 + "px";
            }
            cssTable("Examen_Medico_Ocupacional", "2", "2");
            cssTable("Examen_Medico_Ocupacional", "2", "3");
            anchoColTable("Examen_Medico_Ocupacional", "2", "3", "2", "300");
            anchoColTable("Examen_Medico_Ocupacional", "2", "3", "3", "300");
            cssTable("Examen_Medico_Ocupacional", "2", "4");
            cssTable("Examen_Medico_Ocupacional", "1", "3");
            cssTable("Examen_Medico_Ocupacional", "5", "2");

            cssTable("Examen_Medico_Ocupacional", "1", "4");

            anchoColTable("Examen_Medico_Ocupacional", "1", "4", "1", "160");
            anchoColTable("Examen_Medico_Ocupacional", "1", "4", "2", "70");
            anchoColTable("Examen_Medico_Ocupacional", "1", "4", "3", "70");
            anchoColTable("Examen_Medico_Ocupacional", "1", "4", "4", "70");
            anchoColTable("Examen_Medico_Ocupacional", "1", "4", "5", "100");
            anchoColTable("Examen_Medico_Ocupacional", "1", "4", "6", "200");

            var w = "120";
            for (var i = 1; i < 9; i++) {
                anchoColTable("Examen_Medico_Ocupacional", "1", "3", i, w);
            }

            cssTable("Examen_Medico_Ocupacional", "1", "2");
            var w = "27";
            for (var i = 1; i < 37; i++) {
//                anchoColTable("Examen_Medico_Ocupacional", "1", "2", i, w);
            }

            var t = document.querySelector(".nw_login_box_prue_padre");
            var a = document.createElement("div");
            a.className = "nw_login_box_prue_padre nw_login_box_prue_padre_2";
            a.innerHTML = t.innerHTML;
//            t.appendChild(a);
            t.innerHTML = "<div class='newprue newprue1'>" + t.innerHTML + "</div><div class='newprue newprue2'>" + t.innerHTML + "</div>";


//            orderTextOfSelectBox("Examen_Medico_Ocupacional", "1", "5", 120, "90", "350");


//            anchoinDivChild("Examen_Medico_Ocupacional", "1", "5", "9", "1000");
//            anchoinDivChild("Examen_Medico_Ocupacional", "1", "5", "1", "1000");
//            anchoinDivChild("Examen_Medico_Ocupacional", "1", "5", "11", "1000");
//            anchoinDivChild("Examen_Medico_Ocupacional", "1", "5", "17", "1000");
//            anchoinDivChild("Examen_Medico_Ocupacional", "1", "5", "20", "1000");
//            anchoinDivChild("Examen_Medico_Ocupacional", "1", "5", "24", "1000");
//            anchoinDivChild("Examen_Medico_Ocupacional", "1", "5", "27", "1000");
//            anchoinDivChild("Examen_Medico_Ocupacional", "1", "5", "28", "1000");
//            anchoinDivChild("Examen_Medico_Ocupacional", "1", "5", "29", "1000");
//            anchoinDivChild("Examen_Medico_Ocupacional", "1", "5", "34", "1000");
//            anchoinDivChild("Examen_Medico_Ocupacional", "1", "5", "42", "1000");
//            anchoinDivChild("Examen_Medico_Ocupacional", "1", "5", "50", "1000");
//            anchoinDivChild("Examen_Medico_Ocupacional", "1", "5", "57", "1000");
//            anchoinDivChild("Examen_Medico_Ocupacional", "1", "5", "66", "1000");
//            anchoinDivChild("Examen_Medico_Ocupacional", "1", "5", "74", "1000");
//            anchoinDivChild("Examen_Medico_Ocupacional", "1", "5", "76", "1000");
//            anchoinDivChild("Examen_Medico_Ocupacional", "1", "5", "78", "1000");
//            anchoinDivChild("Examen_Medico_Ocupacional", "1", "5", "80", "1000");
//            anchoinDivChild("Examen_Medico_Ocupacional", "1", "5", "82", "1000");
//            anchoinDivChild("Examen_Medico_Ocupacional", "1", "5", "84", "1000");
//            anchoinDivChild("Examen_Medico_Ocupacional", "1", "5", "86", "1000");
//            anchoinDivChild("Examen_Medico_Ocupacional", "1", "5", "92", "1000");
//            anchoinDivChild("Examen_Medico_Ocupacional", "1", "5", "94", "1000");
//            anchoinDivChild("Examen_Medico_Ocupacional", "1", "5", "96", "1000");
//            anchoinDivChild("Examen_Medico_Ocupacional", "1", "5", "98", "1000");
//            anchoinDivChild("Examen_Medico_Ocupacional", "1", "5", "106", "1000");


            orderTextOfSelectBox("Examen_Medico_Ocupacional", "1", "8", 20, "150", "150");
//            orderTextOfSelectBox("Examen_Medico_Ocupacional", "1", "9", 20, "200", "200");

            anchoinDivChild("Examen_Medico_Ocupacional", "3", "5", "4", "1000");

            anchoColTable("Examen_Medico_Ocupacional", "1", "2", "1", "200", "last");
            anchoColTable("Examen_Medico_Ocupacional", "1", "2", "2", "200", "last");


            var ref = document.querySelector(".containerForm_1 .qxuigroupboxGroupBox_1");
            var refCortar = document.querySelector(".containerForm_1 .qxuigroupboxGroupBox_2");
            var refCortar3 = document.querySelector(".containerForm_1 .qxuigroupboxGroupBox_3");
            if (ref.offsetHeight > 300) {
                refCortar.style.pageBreakBefore = "always";
                if (refCortar.offsetHeight < 500) {
                    refCortar3.style.pageBreakBefore = "initial";
                }
            }
        }
    }
});