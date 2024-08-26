<div class="containerList">
    <style>
        .ui-dialog-buttonpane, .bgFond {
            display: none;
        }
    </style>
    <?php
    $file_nwlib = $_SERVER['DOCUMENT_ROOT'] . "/rpcsrv/_mod.inc.php";
    $ruta_enlaces = "";
    $motor_bd = "";
    if (file_exists($file_nwlib)) {
//POSTGRESQL NWLIB
        require_once $_SERVER['DOCUMENT_ROOT'] . "/rpcsrv/_mod.inc.php";
        $ruta_enlaces = "";
        $motor_bd = "PSQL";
    } else {
//MYSQL NWPROJECT
        $ruta_enlaces = "/nwproject/php/modulos/";
        $motor_bd = "MYSQL";
        require_once $_SERVER["DOCUMENT_ROOT"] . $ruta_enlaces . 'nw_maps/_mod.php';
    }

    global $pass1;
    $pass1 = $_POST["user"];
    $pass2 = $_POST["priority"];
    $pass3 = $_POST["estado"];

    function tareas_diarias($p, $u, $det, $others) {
        global $user;
        global $id_user;

        $para = "";
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $where = " where 1=1 ";
        if (isset($pass1)) {
            $where .= " and usuario_asignado=:user";
        }
        if (isset($det)) {
            if ($det != "0") {
                $where .= " and prioridad=:prioridad";
            }
        }
        if (isset($u)) {
            if ($u != "0") {
                $where .= " and usuario_asignado=:usuario";
            } else {
                $where .= " and usuario=:usuario_text";
                $para = "Para: ";
            }
        }
        if (isset($p)) {
            if ($p == 0) {
                $where .= " and estado<>'3'";
            } else
            if ($p == 3) {
                $where .= " and estado=:estado";
            } else
            if ($p == 1000) {
                $where .= " ";
            } else {
                $where .= " and estado=:estado and estado<>'3'";
            }
        }
        $sql = "select *,
        func_concepto(estado, 'estados_tareas_diarias') as estado_text,
        func_concepto(usuario_asignado, 'usuarios') as usuario_asignado_text
        FROM tareas_diarias " . $where . " order by id desc";
        $ca->prepare($sql);
        $ca->bindValue(":user", $id_user);
        $ca->bindValue(":prioridad", $det);
        $ca->bindValue(":usuario", $u);
        $ca->bindValue(":usuario_text", $_SESSION["usuario"]);
        $ca->bindValue(":estado", $p);
        if (!$ca->exec()) {
            echo "No se pudo realizar la consulta. ";
            return;
        }
        if ($ca->size() == 0) {
            echo "No se han encontrado datos";
        }
        if (isset($others)) {
            if ($others != "0") {
                for ($i = 0; $i < $ca->size(); $i++) {
                    $ca->next();
                    $r = $ca->assoc();
                    //  print_r($r);
                    $fecha_explode = explode("-", $r["fecha"]);
                    $post_vista_users = 1;
                    $date_mes_ano = $r["fecha"];
                    $date_hoy_numbers = date('Y-m-d');
                    $explodeDosFecha = explode(" ", $fecha_explode[2]);
                    $ei = $explodeDosFecha[0];
                    $user_show = "";
                    if ($u != "0") {
                        $user_show = $r["usuario"];
                    } else {
                        $user_show = $r["usuario_asignado_text"];
                    }
                    ?>
                    <?php
                    if (isset($_GET["Stask"])) {
                        if ($_GET["Stask"] != "") {
                            ?>
                            <script type="text/javascript">
                                $(document).ready(function() {
                                    SeeTarea(<?php echo $r["id"]; ?>,<?php echo $post_vista_users ?>, '<?php echo $date_mes_ano ?>', '<?php echo $date_hoy_numbers ?>',<?php echo $ei ?>, <?php echo $ei ?>);
                                });
                            </script>
                            <?php
                        }
                    }
                    ?>
                    <script type="text/javascript">
                        $('.list_filas_tareas__<?php echo $r["id"] ?>').click(function() {
                            SeeTarea(<?php echo $r["id"]; ?>,<?php echo $post_vista_users ?>, '<?php echo $date_mes_ano ?>', '<?php echo $date_hoy_numbers ?>',<?php echo $ei ?>, <?php echo $ei ?>);
                            //                                                SeeTarea(<?php echo $r["id"]; ?>);
                            ShowMob();
                        });
                    </script>
                    <?php
                    $leido = "";
                    if ($r["leido"] == "NO") {
                        $leido = "messaje_no_leido";
                    }
                    echo "<div class='list_filas_tareas list_filas_tareas__" . $r["id"] . " $leido' >
                             <h1>$para" . $user_show . "</h1>
                             <h2>" . strip_tags($r["tarea"]) . "</h2> 
                             <h3>" . $r["fecha"] . "</h3>
                             <h4>" . $r["estado_text"] . "</h4>
                     </div>";
                }
            }
        } else {
            echo $ca->size();
        }
    }
    ?>
    <script type="text/javascript">
        $(document).ready(function() {
            loadList();
            loadCalendarInto(3, 0, 0, 0, 0);
            removeLoading();
        });
        function verOthers(obj) {
            loadList();
            var id = obj[ obj.selectedIndex ].value;
            if (id == "other") {
                loadUsersList();
            }
            if (id == "my") {
                $("#lists_tasks_users").empty();
            }
        }
    </script>
    <?php
//    include 'src/filters.php';
    ?>
    <div class='list_tarea' id='lists_tasks'>
        <?php
//tareas_diarias($pass3, $pass1, $pass2, 1);
        ?> 
    </div>
    <div id="see_calendar"></div>
    <div id='see'>
        <div class='selecione_this'>
            Seleccione de la lista una tarea.
        </div>
    </div>
</div>
