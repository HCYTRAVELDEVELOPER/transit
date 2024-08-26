<?php

//error_reporting(E_ALL);
//include_once dirname(__FILE__) . "/../../html/rpcsrv/_mod.inc.php";
include_once "/var/www/nwtask.com/html/rpcsrv/_mod.inc.php";
require_once dirname(__FILE__) . '/../../includes/nusoap-0.9.5/lib/nusoap.php';

$miURL = 'https://task.gruponw.com/nwlib6/nwproject/ws/';
$server = new soap_server();
$server->configureWSDL('netwoods', $miURL);
$server->wsdl->schemaTargetNamespace = $miURL;

$server->register('crearTarea', array('parametro' => 'xsd:array'), array('return' => 'xsd:string'), $miURL);

function crearTarea($p) {

    $location = "/var/www/nwtask.com/html/imagenes/";

    $grupo = 0;
    $grupo_nombre = "N/A";
    $db = NWDatabase::database();
    $ca = new NWDbQuery($db);
    $ca->cleanHtml = false;
    if (isset($p["cc"])) {
        $grupo = 11;
        $is_task = explode("@", $p["cc"]);
        if (isset($is_task[0])) {
            $grupo = 1;
            if (isset($is_task[1])) {
                $grupo = 2;
                $tarea = $is_task[1];
                if ($is_task[1] == "taskenter.com") {
                    $testCp = explode("_", $is_task[0]);
                    if (count($testCp) > 1) {
                        if ($testCp[0] == "cp") {
                            $db_16 = new NWDatabase("PGSQL");
                            $db_16->setHostName("192.168.1.30");
                            $db_16->setDatabaseName("nwadmin3");
                            $db_16->setUserName("andresf");
                            $db_16->setPassword("padre18");
                            $db_16->open_();
                            $cb = new NWDbQuery($db_16);
                            $cb->cleanHtml = false;
                            $cb->prepareSelect("clientes_prospecto", "*", "id=:id");
                            $cb->bindValue(":id", $testCp[1]);
                            if (!$cb->exec()) {
                                return new soapval("return", "xsd:string", $cb->lastErrorText());
                            }
                            if ($cb->size() > 0) {
                                $cb->next();
                                $ra = $cb->assoc();
                                $uniq = md5(uniqid(rand(), true));
                                $descripcion = '<a style="color: blue!important; text-decoration: underline; cursor: pointer!important;" onclick="if (document.getElementById(\'123\').style.display == \'none\') {document.getElementById(\'123\').style.display = \'initial\'; }  else if (document.getElementById(\'123\').style.display == \'initial\') { document.getElementById(\'123\').style.display = \'none\';}">';
                                $descripcion = preg_replace('/\b123\b/', $uniq, $descripcion);
                                $descripcion .= $p["tarea"];
                                $descripcion .= '</a>';
                                $descripcion .= '<div id="' . $uniq . '" style="display: none;">';

                                if (class_exists("tidy")) {
                                    $tidy = new tidy();
                                    $tidy->parseString($p["descripcion"], array('show-body-only' => true), 'utf8');
                                    $tidy->cleanRepair();
                                    $p["descripcion"] = $tidy;
                                }

                                $descripcion .= $p["descripcion"];
                                $descripcion .= '</div>';
                                $cb->prepareInsert("cp_acciones", "cp,tipo_accion,observaciones,fecha_accion,usuario,empresa");
                                $cb->bindValue(":cp", $ra["id"]);
                                $cb->bindValue(":tipo_accion", 0);
                                $cb->bindValue(":observaciones", $descripcion);
                                $cb->bindValue(":fecha_accion", date("Y-m-d H:i:s"));
                                $cb->bindValue(":usuario", "andresf");
                                $cb->bindValue(":empresa", 1);
                                if (!$cb->exec()) {
                                    return new soapval("return", "xsd:string", $cb->lastErrorText());
                                }
                                return new soapval("return", "xsd:string", "true");
                            }
                        }
                    } else {
                        $grupo = 3;
                        $ca->prepareSelect("nwtask_grupos", "id,nombre", "correo_ws=:correo_ws");
                        $ca->bindValue(":correo_ws", trim($is_task[0]));
                        if (!$ca->exec()) {
                            return new soapval("return", "xsd:string", $ca->lastErrorText());
                        }
                        if ($ca->size() > 0) {
                            $ca->next();
                            $ri = $ca->assoc();
                            $grupo = $ri["id"];
                            $grupo_nombre = $ri["nombre"];
                        }
                    }
                }
            }
        }
    }

    if (isset($p["asignado_a_varios"])) {
        $p["asignado_a_varios"] = explode(",", $p["asignado_a_varios"]);
        for ($i = 0; $i < count($p["asignado_a_varios"]); $i++) {
            $r = $p["asignado_a_varios"][$i];
            $ca->prepareSelect("pv_clientes", "id,email,foto_perfil", "usuario_cliente=:email");
            $ca->bindValue(":email", trim($r));
            if (!$ca->exec()) {
                continue;
            }
            if ($ca->size() == 0) {
                continue;
            }
            $ca->next();
            $ra = $ca->assoc();
            try {
                $ca->clean();
                $fields = "hora,grupo,grupo_text,tarea,descripcion,asignado_por,asignado_a,asignado_a_text,asignado_a_username,fecha_creacion,terminal,fecha,estado,tipo,fecha_inicio,hora_inicial,fecha_y_hora";
                //hora_final
                if (isset($p["adjunto"])) {
                    $fields .= ",adjunto";
                    $current = file_get_contents($location . $p["adjunto"]);
                    $current = base64_decode($p["adjunto_base"]);
                    file_put_contents($location . $p["adjunto"], $current);
                }
                $ca->prepareInsert("nwtask_tareas", $fields);
                $ca->bindValue(":hora", date("H:i:s"));
                $ca->bindValue(":fecha_inicio", date("Y-m-d"));
                $ca->bindValue(":hora_inicial", date("H:i:s"));
                $ca->bindValue(":grupo", $grupo);
                $ca->bindValue(":grupo_text", $grupo_nombre);

                $uniq = md5(uniqid(rand(), true));
                $descripcion = '<a style="color: blue!important; text-decoration: underline; cursor: pointer;" onclick="if (document.getElementById(\'123\').style.display == \'none\') {document.getElementById(\'123\').style.display = \'initial\'; }  else if (document.getElementById(\'123\').style.display == \'initial\') { document.getElementById(\'123\').style.display = \'none\';}">';
                $descripcion = preg_replace('/\b123\b/', $uniq, $descripcion);
                $descripcion .= $p["tarea"];
                $descripcion .= '</a>';
                $descripcion .= '<div id="' . $uniq . '" style="display: none;">';

                if (class_exists("tidy")) {
                    $tidy = new tidy();
                    $tidy->parseString($p["descripcion"], array('show-body-only' => true), 'utf8');
                    $tidy->cleanRepair();
                    $p["descripcion"] = $tidy;
                }

                $descripcion .= $p["descripcion"];
                $descripcion .= '</div>';

                $ca->bindValue(":tarea", $descripcion);
                //$ca->bindValue(":tarea", $p["descripcion"]);
                $ca->bindValue(":descripcion", $p["descripcion"], true);
                $ca->bindValue(":asignado_por", $p["asignado_por"]);
                $ca->bindValue(":asignado_a", $ra["id"]);
                $ca->bindValue(":asignado_a_text", $ra["email"]);
                $ca->bindValue(":asignado_a_username", $ra["email"]);
                $ca->bindValue(":fecha_creacion", date("Y-m-d"));
                $ca->bindValue(":fecha", date("Y-m-d"));

//                    $hora_entrega = date("H:i:s", strtotime('+48 hours', date("H:i:s")));
                $fecha_entrega = date("Y-m-d", strtotime(date("Y-m-d") . ' +3 days'));

//                $ca->bindValue(":hora_final", $hora_entrega);
                $ca->bindValue(":fecha_inicio", $fecha_entrega);
                $ca->bindValue(":fecha_y_hora", date("Y-m-d H:i:s"));
                $ca->bindValue(":estado", "Nuevo");
                $ca->bindValue(":tipo", "EMAIL");
                $ca->bindValue(":terminal", 1);

                if (isset($p["adjunto"])) {
                    $ca->bindValue(":adjunto", "/imagenes/" . $p["adjunto"]);
                }

                if (!@$ca->exec()) {
                    return new soapval("return", "xsd:string", $ca->lastErrorText());
                }

//                nwMaker::crearNotificacion("direccion@netwoods.net", $p["tarea"], 'chat', false, null, false, false, false, null, 'Tarea por correo', $r, $ra["foto_perfil"]);
                nwMaker::crearNotificacion($ra["email"], $p["tarea"], 'chat', false, null, false, false, false, null, 'Tarea por correo', $r, $ra["foto_perfil"]);
            } catch (Exception $exc) {
                $ca->rollback();
                return new soapval("return", "xsd:string", "exception");
            }
        }
    }
    return new soapval("return", "xsd:string", "true");
}

if (!isset($HTTP_RAW_POST_DATA)) {
    $HTTP_RAW_POST_DATA = file_get_contents('php://input');
}
$server->service($HTTP_RAW_POST_DATA);
?>