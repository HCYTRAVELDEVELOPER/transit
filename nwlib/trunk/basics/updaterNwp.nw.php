<?php

class updaterNwp {

    public static function updaterNw() {
        self::all();
    }

    public static function updaterNwMenu() {
        self::menu();
    }

    public static function generarMantenimiento($p) {
        $p = nwMaker::getData($p);
        session::check();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $si = session::info();
        $tipo = "N/A";
        if (isset($p["tipo"])) {
            $tipo = $p["tipo"];
        }
        $clean_nwregistro = "NO";
        if (isset($p["clean_nwregistro"])) {
            if ($p["clean_nwregistro"] === "SI" || $p["clean_nwregistro"] === true) {
                $clean_nwregistro = "SI";
            }
        }
        $clean_usuarioslog = "NO";
        if (isset($p["clean_usuarioslog"])) {
            if ($p["clean_usuarioslog"] === "SI" || $p["clean_usuarioslog"] === true) {
                $clean_usuarioslog = "SI";
                $r = updaterNwp::cleanNwUsersLog();
                if ($r !== true) {
                    return $r;
                }
            }
        }
        $optimiza_tablas_nwmaker = "NO";
        if (isset($p["optimiza_tablas_nwmaker"])) {
            if ($p["optimiza_tablas_nwmaker"] === "SI" || $p["optimiza_tablas_nwmaker"] === true) {
                $optimiza_tablas_nwmaker = "SI";
                $r = updaterNwp::optimizarTablasNwMaker();
                if ($r !== true) {
                    return $r;
                }
            }
        }
        $optimiza_tablas_nwlib = "NO";
        if (isset($p["optimiza_tablas_nwlib"])) {
            if ($p["optimiza_tablas_nwlib"] === "SI" || $p["optimiza_tablas_nwlib"] === true) {
                $optimiza_tablas_nwlib = "SI";
                $r = updaterNwp::optimizarTablasNwLib();
                if ($r !== true) {
                    return $r;
                }
            }
        }
        $backupNotificaciones = "NO";
        if (isset($p["backupNotificaciones"])) {
            if ($p["backupNotificaciones"] === "SI" || $p["backupNotificaciones"] === true) {
                $backupNotificaciones = "SI";
                $r = updaterNwp::backUpNwMakerNotificaciones();
                if ($r !== true) {
                    return $r;
                }
            }
        }

        $device = nwMaker::getDispositivo();
        $sys = nwMaker::getSystem();
        $navegador = "";
        if (isset($sys["browser"]))
            $navegador .= $sys["browser"];
        if (isset($sys["os"]))
            $navegador .= " OS:" . $sys["os"];
        if (isset($sys["version"]))
            $navegador .= " V:" . $sys["version"];
        $ing_disp = $device . "-" . $navegador;

        $ip = master::getRealIp();

        $id = master::getNextSequence("nwmaker_mantenimientos_id_seq", $db);
        $ca->prepareInsert("nwmaker_mantenimientos", "id,usuario,fecha,terminal,empresa,tipo,optimiza_tablas_nwmaker,optimiza_tablas_nwlib,clean_nwregistro,clean_usuarioslog,backupNotificaciones,ip,disp,host");
        $ca->bindValue(":id", $id);
        $ca->bindValue(":optimiza_tablas_nwmaker", $optimiza_tablas_nwmaker);
        $ca->bindValue(":optimiza_tablas_nwlib", $optimiza_tablas_nwlib);
        $ca->bindValue(":clean_nwregistro", $clean_nwregistro);
        $ca->bindValue(":clean_usuarioslog", $clean_usuarioslog);
        $ca->bindValue(":backupNotificaciones", $backupNotificaciones);
        $ca->bindValue(":tipo", $tipo);
        $ca->bindValue(":usuario", $si["usuario"]);
        $ca->bindValue(":empresa", $si["empresa"]);
        $ca->bindValue(":terminal", $si["terminal"]);
        $ca->bindValue(":fecha", date("Y-m-d H:i:s"));
        $ca->bindValue(":ip", $ip);
        $ca->bindValue(":disp", $ing_disp);
        $ca->bindValue(":host", $_SERVER["HTTP_HOST"]);
        if (!$ca->exec()) {
            return NWJSonRpcServer::error($ca->lastErrorText());
        }


        $correos = "alexf@gruponw.com,direccion@netwoods.net,soporte@gruponw.com,orionjafe@gmail.com,cristianm@gruponw.com";
//        $correos = "alexf@gruponw.com";
        $x = false;
        $asunto = "NW: Nuevo mantenimiento en {$_SERVER["HTTP_HOST"]} ";
        $titleEnc = "NW: Nuevo mantenimiento en {$_SERVER["HTTP_HOST"]}";
        $textBody = "El usuario {$si["usuario"]} ha generado el mantenimiento #{$id} el " . date("Y-m-d H:i:s") . " del tipo {$tipo}.";

        $textBody .= "<br />Clean nw_registro: {$clean_nwregistro}";
        $textBody .= "<br />Clean usuarios log: {$clean_usuarioslog}";
        $textBody .= "<br />Optimización de tablas, índices NwMaker: {$optimiza_tablas_nwmaker}";
        $textBody .= "<br />Optimización de tablas, índices NwLib: {$optimiza_tablas_nwlib}";
        $textBody .= "<br />Notificaciones, copia creada y tabla límpia: {$backupNotificaciones}";
        if ($tipo === "ringow") {
            $textBody .= "<br />Disponibilidad, servicios y chat: copia creada y tabla límpia: SI";
        }
        if (isset($p["notes"])) {
            $textBody .= $p["notes"];
        }

        $send = nw_configuraciones::sendEmail($correos, "Nw", $asunto, $titleEnc, $textBody, false, $x);
        if ($send) {
            $ca->prepareUpdate("nwmaker_mantenimientos", "envio_correo_aviso,log_final", "id=:id");
            $ca->bindValue(":id", $id);
            $ca->bindValue(":envio_correo_aviso", $correos);
            $ca->bindValue(":log_final", nwMaker::cortaText($textBody, 1500));
            if (!$ca->exec()) {
                return NWJSonRpcServer::error($ca->lastErrorText());
            }
        }

        if ($clean_nwregistro === "SI") {
            $r = updaterNwp::cleanNwRegistro();
            if ($r !== true) {
                return $r;
            }
        }

        $db->commit();

        return $id;
    }

    public static function optimizarTablasNwLib() {
        session::check();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $sql = "REPAIR TABLE `nwmaker_codigo_oculto`, `nwmaker_current_version`, `nwmaker_departamentos`, `nwmaker_domains_autorizados`, `nwmaker_idiomas`, `nwmaker_login`, `nwmaker_login_datostarjetabiente`, `nwmaker_login_profesiones`, `nwmaker_login_valores_formapago`, `nwmaker_menu`, `nwmaker_modulos`, `nwmaker_modulos_componentes`, `nwmaker_modulos_home`, `nwmaker_notificaciones`, `nwmaker_perfiles`, `nwmaker_perfiles_autorizados`, `nwmaker_permisos`, `nwmaker_planes`, `nwmaker_policies_accept`, `nwmaker_puntaje_historico`, `nwmaker_resetpass`, `nwmaker_sessions`, `nwmaker_suscriptorsPush`, `nwmaker_tarjetascredito`, `nwmaker_tarjetascredito_pagos`, `nwmaker_terminos_condiciones`, `nwmaker_users_empresas`, `nwmaker_users_info_aditional`, `nwmaker_usuarios_log`, `nwmaker_videollamadas`, `nwmaker_videollamadas_chats`, `pv_clientes`";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            return "Error. " . $ca->lastErrorText();
        }
        $sql = "OPTIMIZE TABLE `nwmaker_codigo_oculto`, `nwmaker_current_version`, `nwmaker_departamentos`, `nwmaker_domains_autorizados`, `nwmaker_idiomas`, `nwmaker_login`, `nwmaker_login_datostarjetabiente`, `nwmaker_login_profesiones`, `nwmaker_login_valores_formapago`, `nwmaker_menu`, `nwmaker_modulos`, `nwmaker_modulos_componentes`, `nwmaker_modulos_home`, `nwmaker_notificaciones`, `nwmaker_perfiles`, `nwmaker_perfiles_autorizados`, `nwmaker_permisos`, `nwmaker_planes`, `nwmaker_policies_accept`, `nwmaker_puntaje_historico`, `nwmaker_resetpass`, `nwmaker_sessions`, `nwmaker_suscriptorsPush`, `nwmaker_tarjetascredito`, `nwmaker_tarjetascredito_pagos`, `nwmaker_terminos_condiciones`, `nwmaker_users_empresas`, `nwmaker_users_info_aditional`, `nwmaker_usuarios_log`, `nwmaker_videollamadas`, `nwmaker_videollamadas_chats`, `pv_clientes`";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            return "Error. " . $ca->lastErrorText();
        }
        $db->commit();
        return true;
    }

    public static function optimizarTablasNwMaker() {
        session::check();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $sql = "REPAIR TABLE `nwmaker_codigo_oculto`, `nwmaker_current_version`, `nwmaker_departamentos`, `nwmaker_domains_autorizados`, `nwmaker_idiomas`, `nwmaker_login`, `nwmaker_login_datostarjetabiente`, `nwmaker_login_profesiones`, `nwmaker_login_valores_formapago`, `nwmaker_menu`, `nwmaker_modulos`, `nwmaker_modulos_componentes`, `nwmaker_modulos_home`, `nwmaker_notificaciones`, `nwmaker_perfiles`, `nwmaker_perfiles_autorizados`, `nwmaker_permisos`, `nwmaker_planes`, `nwmaker_policies_accept`, `nwmaker_puntaje_historico`, `nwmaker_resetpass`, `nwmaker_sessions`, `nwmaker_suscriptorsPush`, `nwmaker_tarjetascredito`, `nwmaker_tarjetascredito_pagos`, `nwmaker_terminos_condiciones`, `nwmaker_users_empresas`, `nwmaker_users_info_aditional`, `nwmaker_usuarios_log`, `nwmaker_videollamadas`, `nwmaker_videollamadas_chats`, `pv_clientes`;";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            return "Error. " . $ca->lastErrorText();
        }
        $sql = "OPTIMIZE TABLE `nwmaker_codigo_oculto`, `nwmaker_current_version`, `nwmaker_departamentos`, `nwmaker_domains_autorizados`, `nwmaker_idiomas`, `nwmaker_login`, `nwmaker_login_datostarjetabiente`, `nwmaker_login_profesiones`, `nwmaker_login_valores_formapago`, `nwmaker_menu`, `nwmaker_modulos`, `nwmaker_modulos_componentes`, `nwmaker_modulos_home`, `nwmaker_notificaciones`, `nwmaker_perfiles`, `nwmaker_perfiles_autorizados`, `nwmaker_permisos`, `nwmaker_planes`, `nwmaker_policies_accept`, `nwmaker_puntaje_historico`, `nwmaker_resetpass`, `nwmaker_sessions`, `nwmaker_suscriptorsPush`, `nwmaker_tarjetascredito`, `nwmaker_tarjetascredito_pagos`, `nwmaker_terminos_condiciones`, `nwmaker_users_empresas`, `nwmaker_users_info_aditional`, `nwmaker_usuarios_log`, `nwmaker_videollamadas`, `nwmaker_videollamadas_chats`, `pv_clientes`";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            return "Error. " . $ca->lastErrorText();
        }
        $db->commit();
        return true;
    }

    public static function cleanNwUsersLog() {
        session::check();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $ca->prepareDelete("nwmaker_usuarios_log", "1=1");
        if (!$ca->exec()) {
            return "Error. " . $ca->lastErrorText();
        }
        $ca->prepareDelete("usuarios_log", "1=1");
        if (!$ca->exec()) {
            return "Error. " . $ca->lastErrorText();
        }
        $db->commit();
        return true;
    }

    public static function cleanNwRegistro() {
        session::check();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $ca->prepareDelete("nw_registro", "1=1");
        if (!$ca->exec()) {
            return "Error. " . $ca->lastErrorText();
        }
        $db->commit();
        return true;
    }

    public static function backUpNwMakerNotificaciones() {
        session::check();
        $db = NWDatabase::database();
        $cb = new NWDbQuery($db);
        $ca = new NWDbQuery($db);
        $fecha = nwMaker::sumaRestaFechas("-24 hour", "+0 minute", "+0 second");
        $ca->prepareSelect("nwmaker_notificaciones", "*", "fecha_aviso_recordat<:fecha");
        $ca->bindValue(":fecha", $fecha);
        if (!$ca->exec()) {
            return "Error. " . $ca->lastErrorText();
        }
//        return $ca->preparedQuery();
        $t = $ca->size();
        if ($t > 0) {
            for ($i = 0; $i < $t; $i++) {
                $r = $ca->flush();
                $f = "id_real,usuario_recibe,usuario_envia,leido,tipo,fecha_envio,mensaje,tipo_aviso_recordat,link,modo_window,id_objetivo,title,icon,notificado,fecha_aviso_recordat,callback";
                $f .= ",send_email,fecha_lectura,correo_usuario_recibe,fecha_final,vencida_title,vencida_body,email_is_sent,date_email_is_sent,izquierda_nomostrar_despues_de,inhabil_callback_despues_de";
                $f .= ",fromName,fromEmail,send_sms,celular,sms_body,body_email,asunto_email,terminal";
                $cb->prepareInsert("nwmaker_notificaciones_backup", $f);
                $cb->bindValue(":id_real", $r["id"]);
                $cb->bindValue(":usuario_recibe", $r["usuario_recibe"]);
                $cb->bindValue(":usuario_envia", $r["usuario_envia"]);
                $cb->bindValue(":leido", $r["leido"]);
                $cb->bindValue(":tipo", $r["tipo"]);
                $cb->bindValue(":fecha_envio", $r["fecha_envio"]);
                $cb->bindValue(":mensaje", $r["mensaje"]);
                $cb->bindValue(":tipo_aviso_recordat", $r["tipo_aviso_recordat"]);
                $cb->bindValue(":link", $r["link"]);
                $cb->bindValue(":modo_window", $r["modo_window"]);
                $cb->bindValue(":id_objetivo", $r["id_objetivo"]);
                $cb->bindValue(":title", $r["title"]);
                $cb->bindValue(":icon", $r["icon"]);
                $cb->bindValue(":notificado", $r["notificado"]);
                $cb->bindValue(":fecha_aviso_recordat", $r["fecha_aviso_recordat"]);
                $cb->bindValue(":callback", $r["callback"]);
                $cb->bindValue(":send_email", $r["send_email"]);
                $cb->bindValue(":fecha_lectura", $r["fecha_lectura"]);
                $cb->bindValue(":correo_usuario_recibe", $r["correo_usuario_recibe"]);
                $cb->bindValue(":fecha_final", $r["fecha_final"]);
                $cb->bindValue(":vencida_title", $r["vencida_title"]);
                $cb->bindValue(":vencida_body", $r["vencida_body"]);
                $cb->bindValue(":email_is_sent", $r["email_is_sent"]);
                $cb->bindValue(":date_email_is_sent", $r["date_email_is_sent"]);
                $cb->bindValue(":izquierda_nomostrar_despues_de", $r["izquierda_nomostrar_despues_de"]);
                $cb->bindValue(":inhabil_callback_despues_de", $r["inhabil_callback_despues_de"]);
                $cb->bindValue(":fromName", $r["fromName"]);
                $cb->bindValue(":fromEmail", $r["fromEmail"]);
                $cb->bindValue(":send_sms", $r["send_sms"]);
                $cb->bindValue(":celular", $r["celular"]);
                $cb->bindValue(":sms_body", $r["sms_body"]);
                $cb->bindValue(":body_email", $r["body_email"]);
                $cb->bindValue(":asunto_email", $r["asunto_email"]);
                $cb->bindValue(":terminal", $r["terminal"]);
                if (!$cb->exec()) {
                    return "Error. " . $cb->lastErrorText();
                }
            }

            $ca->prepareDelete("nwmaker_notificaciones", "fecha_aviso_recordat<:fecha");
            $ca->bindValue(":fecha", $fecha);
            if (!$ca->exec()) {
                return "Error. " . $ca->lastErrorText();
            }
        }
        $db->commit();
        return true;
    }

    private static function cleanBD() {
        
    }

    private static function menu() {
        return paginas_updater::menu();
    }

    private static function all() {
        session::check();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $cb = new NWDbQuery($db);

        $sql = "
 CREATE TABLE `paises` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'textField,0,false',
  `nombre` varchar(100) DEFAULT NULL,
  `empresa` int(11) DEFAULT NULL COMMENT 'textField,0,false',
  `usuario` varchar(100) DEFAULT NULL COMMENT 'textField,0,false',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
CREATE TABLE `terminales` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'textField,0,false',
  `nombre` varchar(100) NOT NULL,
  `ciudad` int(11) NOT NULL,
  `direccion` varchar(200) DEFAULT NULL,
  `telefono` varchar(100) DEFAULT NULL,
  `latitud` varchar(200) DEFAULT NULL,
  `longitud` varchar(200) DEFAULT NULL,
  `clave` varchar(50) DEFAULT NULL,
  `host` varchar(100) DEFAULT NULL,
  `empresa` int(11) DEFAULT NULL COMMENT 'textField,0,false',
  `usuario` varchar(30) DEFAULT NULL COMMENT 'textField,0,false',
  `fecha` date DEFAULT NULL COMMENT 'textField,0,false',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
CREATE TABLE `usuarios_empresas` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'textField,0,false',
  `usuario` varchar(15) DEFAULT NULL,
  `empresa` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
CREATE TABLE `empresas` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'textField,0,false',
  `razon_social` varchar(200) NOT NULL,
  `nit` varchar(100) NOT NULL,
  `division` int(11) DEFAULT NULL,
  `ciudad` int(11) DEFAULT NULL,
  `direccion` text NOT NULL,
  `telefono` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `slogan` text NOT NULL,
  `logo` text,
  `codigo` int(11) DEFAULT NULL,
  `representante_legal` varchar(100) DEFAULT NULL,
  `nombre_comercial` varchar(100) DEFAULT NULL,
  `firma_digital` varchar(100) DEFAULT NULL,
  `web` text,
  `regimen` varchar(150) DEFAULT NULL,
  `observaciones` text,
  `nombre` varchar(200) DEFAULT NULL,
  `fecha` date DEFAULT NULL COMMENT 'textField,0,false',
  `empresa` int(11) DEFAULT NULL COMMENT 'textField,0,false',
  `usuario` varchar(30) DEFAULT NULL COMMENT 'textField,0,false',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
CREATE TABLE `nw_keys_conf` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'textField,0,false',
  `block_fail_access` int(11) DEFAULT NULL,
  `minutes_blocked_fail_access` int(11) DEFAULT NULL,
  `expiration_days` int(11) DEFAULT NULL,
  `concurrency` varchar(2) DEFAULT NULL,
  `inactivity_days` int(11) DEFAULT NULL,
  `days_search_old_key` int(11) DEFAULT NULL,
  `minimun_length` int(11) DEFAULT NULL,
  `upper_word` varchar(2) DEFAULT NULL,
  `numeric_word` varchar(2) DEFAULT NULL,
  `special_characters` varchar(2) DEFAULT NULL,
  `fecha` date DEFAULT NULL,
  `usuario` varchar(30) DEFAULT NULL,
  `empresa` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
CREATE TABLE `usuarios_log` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'textField,0,false',
  `usuario` varchar(50) DEFAULT NULL,
  `fecha` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `ip` varchar(30) DEFAULT NULL,
  `accion` varchar(30) DEFAULT NULL,
  `empresa` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=latin1;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
CREATE TABLE `nw_control_acceso` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `usuario` varchar(50) DEFAULT NULL,
  `fecha` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `ip` varchar(255) DEFAULT NULL,
  `accion` varchar(30) DEFAULT NULL,
  `empresa` int(11) DEFAULT NULL,
  `fecha_dia` date DEFAULT NULL,
  `hora` time DEFAULT NULL,
  `hora_ingreso` time DEFAULT NULL,
  `hora_salida` time DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=latin1;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
CREATE TABLE `nw_init_settings` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'textField,0,false',
  `fondo` text,
  `logo` text,
  `mensaje` text,
  `usuario` varchar(30) DEFAULT NULL COMMENT 'textField,0,false',
  `fecha` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'textField,0,false',
  `fondo_bienvenida` text,
  `empresa` int(11) DEFAULT NULL COMMENT 'textField,0,false',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
CREATE TABLE `nw_html_forms` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) DEFAULT NULL,
  `html` text,
  `empresa` int(11) DEFAULT NULL COMMENT 'textField,0,false',
  `fecha` date DEFAULT NULL COMMENT 'textField,0,false',
  `usuario` varchar(30) DEFAULT NULL COMMENT 'textField,0,false',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
CREATE TABLE `nw_fail_access` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `error_description` text,
  `usuario` varchar(30) DEFAULT NULL,
  `clave` varchar(100) DEFAULT NULL,
  `blocked` tinyint(1) DEFAULT NULL,
  `hora` time DEFAULT NULL,
  `fecha` date DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=latin1;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
CREATE TABLE `nw_errores` (
  `id` int(11) NOT NULL,
  `error` text,
  `ubicacion` varchar(100) DEFAULT NULL,
  `empresa` int(11) DEFAULT NULL,
  `usuario` varchar(50) DEFAULT NULL,
  `fecha` date DEFAULT NULL,
  `hora` time DEFAULT NULL,
  `status` varchar(50) DEFAULT NULL,
  `code` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
CREATE TABLE `nw_emails` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'textField,0,false',
  `usuario` varchar(255) DEFAULT NULL COMMENT 'textField,0,false',
  `empresa` int(11) DEFAULT NULL COMMENT 'textField,0,false',
  `fecha` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'textField,0,false',
  `asunto` varchar(150) DEFAULT NULL,
  `para` varchar(150) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `mensaje` text,
  `id_relation` int(11) DEFAULT NULL,
  `nombre` varchar(150) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
CREATE TABLE `nw_email_groups_users` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'textField,0,false',
  `usuario` int(11) DEFAULT NULL COMMENT 'textField,0,false',
  `grupo` int(11) DEFAULT NULL,
  `empresa` int(11) DEFAULT NULL COMMENT 'textField,0,false',
  `fecha` date DEFAULT NULL COMMENT 'textField,0,false',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
CREATE TABLE `nw_email_groups` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'textField,0,false',
  `nombre` varchar(50) DEFAULT NULL,
  `empresa` int(11) DEFAULT NULL COMMENT 'textField,0,false',
  `usuario` varchar(50) DEFAULT NULL COMMENT 'textField,0,false',
  `fecha` date DEFAULT NULL COMMENT 'textField,0,false',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
CREATE TABLE `nw_drive_permisos` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `asociado` int(11) NOT NULL,
  `fecha` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `consultar` varchar(2) DEFAULT NULL,
  `crear` varchar(2) DEFAULT NULL,
  `editar` varchar(2) DEFAULT NULL,
  `eliminar` varchar(2) DEFAULT NULL,
  `usuario` varchar(100) DEFAULT NULL,
  `empresa` int(11) DEFAULT NULL,
  `usuario_asociado` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
CREATE TABLE `nw_drive_folders` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'textField,0,false',
  `size_full` varchar(100) DEFAULT NULL,
  `asociado` int(11) DEFAULT NULL,
  `icono` text,
  `privada` varchar(2) DEFAULT NULL,
  `empresa` int(11) DEFAULT NULL,
  `compartir` varchar(20) DEFAULT NULL,
  `favorito` varchar(2) DEFAULT NULL,
  `compartir_value` varchar(50) DEFAULT NULL,
  `fecha` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'textField,0,false',
  `usuario` varchar(100) DEFAULT NULL COMMENT 'textField,0,false',
  `nombre` varchar(200) DEFAULT NULL COMMENT 'textField,0,false',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
CREATE TABLE `nw_drive_files` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'textField,0,false',
  `nombre` text,
  `extension` varchar(10) DEFAULT NULL,
  `ruta` varchar(150) DEFAULT NULL,
  `carpeta` int(11) DEFAULT NULL,
  `fecha` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'textField,0,false',
  `peso` int(11) DEFAULT NULL,
  `usuario` varchar(60) DEFAULT NULL COMMENT 'textField,0,false',
  `empresa` int(11) DEFAULT NULL COMMENT 'textField,0,false',
  `compartir` varchar(2) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
CREATE TABLE `nw_drive_configuration` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `fecha` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `full_size` int(11) DEFAULT NULL,
  `usuario` varchar(100) DEFAULT NULL COMMENT 'textField,0,false',
  `empresa` int(11) DEFAULT NULL COMMENT 'textField,0,false',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
CREATE TABLE `nw_downloads` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'textField,0,false',
  `file_name` varchar(200) DEFAULT NULL,
  `path` text,
  `clave` varchar(20) DEFAULT NULL,
  `parte` varchar(50) DEFAULT NULL,
  `fecha_creacion` date DEFAULT NULL,
  `usuario` varchar(30) DEFAULT NULL COMMENT 'textField,0,false',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
CREATE TABLE `nw_design` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT 'textField,0,false',
  `fondo_gral_left` varchar(50) DEFAULT NULL,
  `color_letra` varchar(50) DEFAULT NULL,
  `fond_buttons` varchar(50) DEFAULT NULL,
  `color_fond_buttons` varchar(50) DEFAULT NULL,
  `color_letra_buttons` varchar(50) DEFAULT NULL,
  `fondo_modulo_uno` varchar(50) DEFAULT NULL,
  `color_letra_modulo_uno` varchar(50) DEFAULT NULL,
  `mostrar_menu_superior` varchar(2) DEFAULT NULL,
  `fondo_modulo_dos` varchar(50) DEFAULT NULL,
  `color_letra_modulo_dos` varchar(50) DEFAULT NULL,
  `fondo_modulo_tres` varchar(50) DEFAULT NULL,
  `color_letra_modulo_tres` varchar(50) DEFAULT NULL,
  `mostrar_mensaje_inbox` varchar(2) DEFAULT NULL,
  `mostrar_notificaciones` varchar(2) DEFAULT NULL,
  `mostrar_notas` varchar(2) DEFAULT NULL,
  `mostrar_tareas` varchar(2) DEFAULT NULL,
  `mostrar_usuarios` varchar(2) DEFAULT NULL,
  `mostrar_favoritos` varchar(2) DEFAULT NULL,
  `mostrar_especiales` varchar(2) DEFAULT NULL,
  `mostrar_chat` varchar(2) DEFAULT NULL,
  `usar_segunda_vista` varchar(2) DEFAULT NULL,
  `color_fond_buttons_indicadores` varchar(50) DEFAULT NULL,
  `buttons_menu_radius` varchar(5) DEFAULT NULL,
  `buttons_menu_margins` varchar(5) DEFAULT NULL,
  `fond_body` varchar(50) DEFAULT NULL,
  `activo` varchar(2) DEFAULT NULL,
  `iconos_generales` varchar(50) DEFAULT NULL,
  `mostrar_generales` varchar(2) DEFAULT NULL,
  `mostrar_muro` varchar(200) DEFAULT NULL,
  `mostrar_cumpleanios` varchar(2) DEFAULT NULL,
  `mostrar_noticiasnw` varchar(2) DEFAULT NULL,
  `color_mas_usados` varchar(50) DEFAULT NULL,
  `color_noticias` varchar(50) DEFAULT NULL,
  `color_muro` varchar(50) DEFAULT NULL,
  `usuario` varchar(50) DEFAULT NULL COMMENT 'textField,0,false',
  `empresa` int(11) DEFAULT NULL COMMENT 'textField,0,false',
  `fecha` date DEFAULT NULL COMMENT 'textField,0,false',
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
CREATE TABLE `nw_cron` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'textField,0,false',
  `nombre` varchar(100) DEFAULT NULL,
  `trabajo` varchar(100) DEFAULT NULL,
  `minuto` int(11) DEFAULT NULL,
  `hora` int(11) DEFAULT NULL,
  `dia_mes` int(11) DEFAULT NULL,
  `mes` int(11) DEFAULT NULL,
  `dia_semana` int(11) DEFAULT NULL,
  `fecha` date DEFAULT NULL COMMENT 'textField,0,false',
  `usuario` varchar(30) DEFAULT NULL COMMENT 'textField,0,false',
  `empresa` int(11) DEFAULT NULL COMMENT 'textField,0,false',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
CREATE TABLE `nw_cmi_enc` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'textField,0,false',
  `nombre` varchar(100) DEFAULT NULL,
  `table_method` varchar(100) DEFAULT NULL,
  `classname` varchar(100) DEFAULT NULL,
  `is_main_form` varchar(50) DEFAULT NULL,
  `serial_column` varchar(50) DEFAULT NULL,
  `table_main` varchar(50) DEFAULT NULL,
  `label` varchar(100) DEFAULT NULL,
  `part` varchar(30) DEFAULT NULL,
  `usuario` varchar(30) DEFAULT NULL COMMENT 'textField,0,false',
  `fecha` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'textField,0,false',
  `empresa` int(11) DEFAULT NULL COMMENT 'textField,0,false',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
CREATE TABLE `nw_alerts` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'textField,0,false',
  `texto` text,
  `tiempo_alerta` int(11) DEFAULT NULL,
  `empresa` int(11) DEFAULT NULL COMMENT 'textField,0,false',
  `vigencia` int(11) DEFAULT NULL,
  `usuario` varchar(60) DEFAULT NULL COMMENT 'textField,0,false',
  `estado` varchar(60) DEFAULT NULL,
  `fecha` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'textField,0,false',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
CREATE TABLE `nw_read_user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `visitas` int(11) DEFAULT NULL,
  `modulo` int(11) DEFAULT NULL,
  `fecha` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'textField,0,false',
  `usuario` varchar(80) DEFAULT NULL COMMENT 'textField,0,false',
  `empresa` int(11) DEFAULT NULL COMMENT 'textField,0,false',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=latin1;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
CREATE TABLE `nw_drive_permisos` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `asociado` int(11) NOT NULL,
  `fecha` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `consultar` varchar(2) DEFAULT NULL,
  `crear` varchar(2) DEFAULT NULL,
  `editar` varchar(2) DEFAULT NULL,
  `eliminar` varchar(2) DEFAULT NULL,
  `usuario` varchar(100) DEFAULT NULL,
  `empresa` int(11) DEFAULT NULL,
  `usuario_asociado` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
CREATE TABLE `nw_modulos_grupos` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'textField,0,false',
  `nombre` varchar(100) DEFAULT NULL,
  `empresa` int(11) DEFAULT NULL COMMENT 'textField,0,false',
  `usuario` varchar(30) DEFAULT NULL COMMENT 'textField,0,false',
  `fecha` date DEFAULT NULL COMMENT 'textField,0,false',
  `parte` varchar(30) DEFAULT NULL,
  `icono` varchar(100) DEFAULT NULL,
  `pariente` int(11) DEFAULT NULL,
  `modulo` int(11) DEFAULT NULL,
  `orden` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=34 DEFAULT CHARSET=latin1;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
CREATE TABLE `permisos` (
  `perfil` int(11) NOT NULL,
  `modulo` int(11) NOT NULL,
  `usuario` varchar(50) DEFAULT NULL,
  `fecha` date DEFAULT NULL,
  `crear` tinyint(1) DEFAULT NULL,
  `consultar` tinyint(1) DEFAULT NULL,
  `editar` tinyint(1) DEFAULT NULL,
  `eliminar` tinyint(1) DEFAULT NULL,
  `todos` tinyint(1) DEFAULT NULL,
  `terminal` tinyint(1) DEFAULT NULL,
  `imprimir` tinyint(1) DEFAULT NULL,
  `enviar_correo` tinyint(1) DEFAULT NULL,
  `exportar` tinyint(1) DEFAULT NULL,
  `importar` tinyint(1) DEFAULT NULL,
  `columnas_ocultas` tinyint(1) DEFAULT NULL,
  `pariente` int(11) DEFAULT NULL,
  UNIQUE KEY `perfil` (`perfil`,`modulo`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
CREATE TABLE `nw_favoritos` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `modulo` int(11) DEFAULT NULL,
  `usuario` varchar(60) DEFAULT NULL,
  `empresa` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
CREATE TABLE `nw_modulos_home` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'textField,0,false',
  `nombre` varchar(60) DEFAULT NULL,
  `url_php` varchar(100) DEFAULT NULL,
  `fecha` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'textField,0,false',
  `usuario` varchar(60) DEFAULT NULL COMMENT 'textField,0,false',
  `empresa` int(11) DEFAULT NULL COMMENT 'textField,0,false',
  `perfil` int(11) DEFAULT NULL,
  `ancho` varchar(10) DEFAULT NULL,
  `alto` varchar(10) DEFAULT NULL,
  `orden` int(11) DEFAULT NULL,
  `scrolling` varchar(20) DEFAULT NULL,
  `float` varchar(20) DEFAULT NULL,
  `activo` varchar(2) DEFAULT NULL,
  `modulo` int(11) DEFAULT NULL,
  `frame_si_no` varchar(2) DEFAULT NULL,
  `columna` varchar(10) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
CREATE TABLE `nw_notifications_det` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'textField,0,false',
  `notificacion` int(11) DEFAULT NULL,
  `leida` tinyint(1) DEFAULT NULL,
  `usuario` varchar(30) DEFAULT NULL,
  `fecha` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `fecha_entrega` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
CREATE TABLE `modulos` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT 'textField,0,false',
  `nombre` varchar(50) DEFAULT NULL,
  `clase` varchar(100) DEFAULT NULL,
  `empresa` int(11) DEFAULT NULL COMMENT 'textField,0,false',
  `grupo` int(11) DEFAULT NULL COMMENT 'selectBox,nw_modulos_grupos',
  `iconos_home` text COMMENT 'uploader',
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=474 DEFAULT CHARSET=latin1;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
CREATE TABLE `menu` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT 'textField,0,false',
  `nombre` varchar(100) DEFAULT NULL,
  `orden` int(11) DEFAULT NULL,
  `nivel` int(11) DEFAULT NULL,
  `callback` text,
  `pariente` int(11) DEFAULT NULL,
  `icono` varchar(100) DEFAULT NULL,
  `modulo` int(11) DEFAULT NULL,
  `empresa` int(11) DEFAULT NULL COMMENT 'textField,0,false',
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=292 DEFAULT CHARSET=latin1;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
CREATE TABLE `nw_notifications` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'textField,0,false',
  `parte` varchar(100) DEFAULT NULL,
  `mensaje` text,
  `enviado_por` varchar(255) DEFAULT NULL,
  `fecha` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'textField,0,false',
  `empresa` int(11) DEFAULT NULL COMMENT 'textField,0,false',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
CREATE TABLE `nw_registro` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'textField,0,false',
  `modulo` varchar(100) DEFAULT NULL,
  `tabla` varchar(100) DEFAULT NULL,
  `query` text,
  `observaciones` text,
  `accion` varchar(60) DEFAULT NULL,
  `usuario` varchar(30) DEFAULT NULL COMMENT 'textField,0,false',
  `fecha` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'textField,0,false',
  `empresa` int(11) DEFAULT NULL COMMENT 'textField,0,false',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }


        $sql = "ALTER TABLE `usuarios` ADD COLUMN `estado_chat` VARCHAR(30) NULL;";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "ALTER TABLE `usuarios` ADD COLUMN `estado` VARCHAR(30) NULL;";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "ALTER TABLE `usuarios` ADD COLUMN `pais` INT(11) NULL;";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "ALTER TABLE `usuarios` ADD COLUMN `terminal` INT(11) NULL;";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
ALTER TABLE  `nc_config`
ADD  `pagos_merchantId` VARCHAR( 12 ) NOT NULL COMMENT  'textField',
ADD  `pagos_accountId` VARCHAR( 12 ) NOT NULL COMMENT  'textField',
ADD  `pagos_pruebas` VARCHAR( 2 ) NOT NULL COMMENT  'selectBox,array';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
ALTER TABLE  `terminales`
ADD  `pos_x` VARCHAR(100) NULL COMMENT  'textField',
ADD  `pos_y` VARCHAR(100) NULL COMMENT  'textField',
ADD  `zoom` VARCHAR(100) NULL COMMENT  'textField'
;
  ";

        $sql = "
ALTER TABLE  `nwp_modulos` ADD 
`parametros` TEXT NULL COMMENT  'textArea';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }


        $sql = "
ALTER TABLE  `ciudades`
ADD  `latitud` VARCHAR( 200 ) NULL COMMENT  'textField',
ADD  `longitud` VARCHAR( 200 ) NULL COMMENT  'textField';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE  `ciudades` ADD  `zoom_map` INT NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
CREATE TABLE nw_excel_list (
    id INT(11) NOT NULL AUTO_INCREMENT,
    html TEXT,
    usuario VARCHAR(50),
    empresa INT(11),
    fecha date,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=latin1;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE  `nc_config` ADD  `apikey` VARCHAR( 60 ) NOT NULL COMMENT  'textField';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }


        $sql = "
            ALTER TABLE `usuarios_empresas` ADD `perfil` INTEGER;  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
            ALTER TABLE `usuarios_empresas` ADD `terminal` INTEGER; ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
        ALTER TABLE  `nw_downloads` ADD  `num_rows` INT NULL ;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
            ALTER TABLE  `ciudades` ADD  `pais_id` INT NULL COMMENT  'selectBox,paises';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
CREATE TABLE IF NOT EXISTS `nw_export_calculate_enc` (
    `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'textField,0,false',
  `encabezado` text DEFAULT NULL COMMENT 'ckeditor',
  `usuario` varchar(100) DEFAULT NULL COMMENT 'textField,0,false',
    `fecha` date DEFAULT NULL COMMENT 'dateField',
    `empresa` int(11) DEFAULT NULL COMMENT 'textField,0,false',
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }


        $sql = "
CREATE TABLE IF NOT EXISTS `nw_export_calculate_enc` (
    `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'textField,0,false',
  `encabezado` TEXT DEFAULT NULL COMMENT 'textArea',
   `fecha` date DEFAULT NULL COMMENT 'dateField',
  `usuario` varchar(100) DEFAULT NULL COMMENT 'textField,0,false',
  `empresa` int(11) DEFAULT NULL COMMENT 'textField,0,false',
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
CREATE TABLE IF NOT EXISTS `nw_export_calculate_dev` (
    `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'textField,0,false',
  `encabezado` TEXT DEFAULT NULL COMMENT 'textArea',
   `fecha` date DEFAULT NULL COMMENT 'dateField',
  `usuario` varchar(100) DEFAULT NULL COMMENT 'textField,0,false',
  `empresa` int(11) DEFAULT NULL COMMENT 'textField,0,false',
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
            ALTER TABLE  `nw_emails` ADD  `cliente_nws` VARCHAR(5) NULL COMMENT  'textField';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
            ALTER TABLE  `nc_config` ADD  `payu_sandbox` VARCHAR( 2 ) NULL COMMENT  'selectBox,boolean';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
            ALTER TABLE  `nc_config` ADD  `pagina_de_respuesta` VARCHAR( 100 ) NULL COMMENT  'textField';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
ALTER TABLE 
`nw_design`
ADD  `usar_segunda_vista_como_home` VARCHAR( 2 ) NULL COMMENT  'selectBox,boolean',
ADD  `menu_segunda_vista_horizontal` VARCHAR( 2 ) NULL COMMENT  'selectBox,boolean'
;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE 
`nw_modulos_grupos`
ADD  `mostrar_en_el_home` VARCHAR( 2 ) NULL COMMENT  'selectBox,boolean'
;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }



        $sql = "
ALTER TABLE  `usuarios`
ADD  `nom_sala` VARCHAR(60) NULL,
ADD  `ver_chat` VARCHAR(5) NULL ;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "ALTER TABLE `nw_cron`
CHANGE COLUMN `trabajo` `trabajo` VARCHAR(250) NULL DEFAULT NULL ;";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "ALTER TABLE `permisos`
                ADD COLUMN `paisl` TINYINT(1) NULL AFTER `pariente`;";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }


        $sql = "
            ALTER TABLE  `permisos` ADD  `pais` INT NOT NULL COMMENT  'selectBox,paises';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }




        $sql = "
            ALTER TABLE  `ciudades`  ENGINE = MYISAM ;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
            ALTER TABLE ciudades ADD FULLTEXT(nombre);
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
ALTER TABLE  `nc_config` ADD  `apiLogin` VARCHAR( 80 ) NULL ;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
ALTER TABLE  `nc_config` ADD `solo_validar` VARCHAR( 2 ) NULL COMMENT  'selectBox,boolean' ;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "CREATE TABLE `nw_security_questions` 
                ( `id` INT NOT NULL AUTO_INCREMENT COMMENT 'textField,0,false' , 
                `pregunta` VARCHAR(100) NOT NULL , 
                `usuario` VARCHAR(50) NOT NULL , 
                `fecha` DATE NOT NULL COMMENT 'textField,0,false' , 
                `empresa` INT NOT NULL COMMENT 'textField,0,false' , 
                `respuesta` VARCHAR(100) NOT NULL COMMENT 'passwordField' , 
                PRIMARY KEY (`id`)) 
                ENGINE = InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }



        $sql = "CREATE TABLE `nw_forgot_password` 
            ( `id` INT(11) NOT NULL AUTO_INCREMENT , 
            `usuario` VARCHAR(30) NOT NULL , 
            `correo` VARCHAR(50) NOT NULL , 
            `clave` VARCHAR(100) NOT NULL , 
            `usada` BOOLEAN NOT NULL , 
            `fecha` TIMESTAMP NOT NULL , 
            PRIMARY KEY (`id`)) 
            ENGINE = InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1;";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
ALTER TABLE `terminales` CHANGE `ciudad` `ciudad` INT(11) NULL;
            ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }



        $sql = "
ALTER TABLE  `nw_drive_files` CHANGE  `compartir`  `compartir` VARCHAR( 20 ) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL ;
            ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        self::nwmaker();

        self::perfiles("WebMaster", 1223);
        self::perfiles("Operador NwChat", 1224);
        self::perfiles("Operador POS", 1225);
        self::perfiles("Only News", 1226);
        self::perfiles("Only Products", 1227);
        self::perfiles("Only Contacts", 1228);
        self::perfiles("Locales CC", 1229);
        self::perfiles("Admin Tienda NwComerce", 1230);
        return true;
    }

    private static function perfiles($nombre, $id) {
        session::check();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $ca->prepareSelect("perfiles", "nombre", "nombre=:nombre");
        $ca->bindValue(":nombre", $nombre);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        if ($ca->size() == 0) {
            $ca->prepareDelete("perfiles", "nombre=:nombre");
            $ca->bindValue(":nombre", $nombre);
            if (!$ca->exec()) {
                master::logSystemError($ca->lastErrorText());
            }
            $sql = "INSERT INTO  `perfiles` (`id` , `nombre` , `empresa` , `usuario` , `fecha`) VALUES ($id ,  '{$nombre}',  '1',  'alexf', NULL);";
            $ca->prepare($sql);
            if (!$ca->exec()) {
                master::logSystemError($ca->lastErrorText());
            }
        }
    }

    public static function nwmaker() {
        session::check();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $cb = new NWDbQuery($db);
        $sql = "
CREATE TABLE IF NOT EXISTS `nwmaker_menu` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'textField,0,false',
  `nombre` varchar(200) NOT NULL COMMENT 'textField',
  `icono` varchar(120) NOT NULL COMMENT 'uploader',
  `nivel` int(11) NOT NULL COMMENT 'textField',
  `pertenece` int(11) NOT NULL COMMENT 'textField',
  `usuario` varchar(90) NOT NULL COMMENT 'textField,0,false',
  `empresa` int(11) NOT NULL COMMENT 'textField,0,false',
  `fecha_creacion` timestamp NULL DEFAULT NULL COMMENT 'textField,0,false',
  `activo` varchar(20) NOT NULL COMMENT 'selectBox,array',
  `callBack` varchar(100) DEFAULT NULL COMMENT 'textField',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
CREATE TABLE IF NOT EXISTS `nwmaker_modulos` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'textField,0,false',
  `nombre` varchar(200) NOT NULL COMMENT 'textField',
  `titulo` varchar(120) NOT NULL COMMENT 'textField',
  `css` TEXT NULL COMMENT 'ckeditor',
  `js` TEXT NULL COMMENT 'ckeditor',
  `usuario` varchar(90) NOT NULL COMMENT 'textField,0,false',
  `empresa` int(11) NOT NULL COMMENT 'textField,0,false',
  `fecha_creacion` timestamp NULL DEFAULT NULL COMMENT 'textField,0,false',
  `activo` varchar(20) NOT NULL COMMENT 'selectBox,array',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
CREATE TABLE IF NOT EXISTS `nwmaker_modulos_componentes` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'textField,0,false',
  `html` TEXT NULL COMMENT 'ckeditor',
  `nwproject_modulo` int(11) NOT NULL COMMENT 'textField',
  `orden` int(11) NOT NULL COMMENT 'textField',
  `modulo` int(11) NOT NULL COMMENT 'selectBox,nwp_modulos',
  `maestro` varchar(100) NOT NULL COMMENT 'textField',
  `css` TEXT NULL  COMMENT 'ckeditor',
  `js` TEXT NULL COMMENT 'ckeditor',
  `usuario` varchar(90) NOT NULL COMMENT 'textField,0,false',
  `empresa` int(11) NOT NULL COMMENT 'textField,0,false',
  `fecha_creacion` timestamp NULL DEFAULT NULL COMMENT 'textField,0,false',
  `activo` varchar(20) NOT NULL COMMENT 'selectBox,array',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
CREATE TABLE IF NOT EXISTS `nwmaker_modulos_home` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'textField,0,false',
  `orden` int(11) NOT NULL COMMENT 'textField',
  `modulo` int(11) NOT NULL COMMENT 'selectBox,nwp_modulos',
  `usuario` varchar(90) NOT NULL COMMENT 'textField,0,false',
  `empresa` int(11) NOT NULL COMMENT 'textField,0,false',
  `activo` varchar(2) NOT NULL COMMENT 'selectBox,boolean',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE  `nwmaker_menu` ADD  `description` VARCHAR( 150 ) NULL COMMENT  'textArea';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE  `nwmaker_modulos_componentes` CHANGE  `nwproject_modulo`  `nwproject_modulo` INT( 11 ) NULL COMMENT  'selectBox,nwp_modulos';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE  `nwmaker_modulos_componentes` ADD  `maestro_columnas` VARCHAR( 250 ) NULL COMMENT  'textField';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE  `nwmaker_modulos` CHANGE  `css`  `css` TEXT CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL COMMENT  'textArea';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE  `nwmaker_modulos` CHANGE  `js`  `js` TEXT CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL COMMENT  'textArea';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE  `nwmaker_menu` CHANGE  `nivel`  `nivel` INT( 11 ) NULL COMMENT  'selectBox,array';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE  `nwmaker_menu` CHANGE  `pertenece`  `pertenece` INT( 11 ) NULL COMMENT  'selectBox,nwmaker_menu';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE  `nwmaker_menu` CHANGE  `callBack`  `callBack` VARCHAR( 100 ) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT 'textArea';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
 ALTER TABLE nwmaker_modulos COMMENT ' [
   {
                    \"selectBoxArrays\": [
              {
                \"name\": \"activo\",
                \"data\": {
                    \"SI\": \"SI\",
                    \"NO\": \"NO\"
                }
            }
        ],
          \"conditions\": [
                        {
                            \"widget\": \"textArea\",
                            \"action\": \"no_filter_special_characteres\"
                        }
                    ],
          \"navTables\": [
                        {
                            \"title\": \"Componentes\",
                            \"table\": \"nwmaker_modulos_componentes\",
                            \"name\": \"componentes\",
                            \"reference\": \"modulo\"
                        }
                   ],
         \"config\": {
                            \"cleanHtml\": false
                        }
    }
  ]
';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
 ALTER TABLE nwmaker_menu COMMENT ' [
   {
                    \"selectBoxArrays\": [
              {
                \"name\": \"activo\",
                \"data\": {
                    \"SI\": \"SI\",
                    \"NO\": \"NO\"
                }
            },
              {
                \"name\": \"nivel\",
                \"data\": {
                    \"1\": \"1\",
                    \"2\": \"2\",
                    \"3\": \"3\"
                }
            }
        ],
         \"config\": {
                            \"cleanHtml\": false
                        }
    }
  ]
';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
 ALTER TABLE  `nwmaker_modulos_componentes` CHANGE  `maestro`  `maestro` VARCHAR( 100 ) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL COMMENT 'textField';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE  `nwmaker_modulos_componentes` DROP  `js` ;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE  `nwmaker_modulos_componentes` DROP  `css` ;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
             ALTER TABLE  `nwmaker_modulos_componentes` ADD  `usar_modulo` VARCHAR( 2 ) NULL COMMENT  'selectBox,boolean' AFTER  `html` ;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
             ALTER TABLE  `nwmaker_modulos_componentes` ADD  `usar__tabla_maestro` VARCHAR( 2 ) NULL COMMENT  'selectBox,boolean' AFTER  `orden` ;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
             ALTER TABLE  `nwmaker_modulos_componentes`
             ADD  `mostrar_archivo` VARCHAR( 2 ) NULL COMMENT  'selectBox,boolean',
             ADD  `ruta_archivo` VARCHAR( 130 ) NULL COMMENT  'textField';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE  `nwmaker_modulos_componentes` CHANGE  `modulo`  `modulo` INT( 11 ) NOT NULL COMMENT  'selectBox,nwmaker_modulos';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
 ALTER TABLE nwmaker_modulos_componentes COMMENT ' [
   {
                    \"selectBoxArrays\": [
              {
                \"name\": \"activo\",
                \"data\": {
                    \"SI\": \"SI\",
                    \"NO\": \"NO\"
                }
            }
        ],
          \"conditions\": [
                        {
                            \"widget\": \"textArea\",
                            \"action\": \"no_filter_special_characteres\"
                        }
                    ],
         \"config\": {
                            \"cleanHtml\": false
                        }
    }
  ]
';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
CREATE TABLE IF NOT EXISTS `nwmaker_codigo_oculto` (
  `id` int(20) unsigned NOT NULL AUTO_INCREMENT COMMENT 'textField,0,false',
  `codigo` text DEFAULT NULL COMMENT 'textArea',
  `activo` VARCHAR(2) DEFAULT NULL COMMENT 'selectBox,array',
  `usuario` VARCHAR(80) DEFAULT NULL COMMENT 'textField,0,false',
  `empresa` int(11) DEFAULT NULL COMMENT 'textField,0,false',
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
 ALTER TABLE nwmaker_codigo_oculto COMMENT ' [
   {
                    \"selectBoxArrays\": [
              {
                \"name\": \"activo\",
                \"data\": {
                    \"SI\": \"SI\",
                    \"NO\": \"NO\"
                }
            },
              {
                \"name\": \"tipo_menu\",
                \"data\": {
                       \"cuadros\": \"cuadros\",
                    \"lista\": \"lista\"
                }
            },
              {
                \"name\": \"tipo_menu_mobile\",
                \"data\": {
                    \"lista\": \"lista\",
                    \"cuadros\": \"cuadros\"
                }
            }
        ],
          \"conditions\": [
                        {
                            \"widget\": \"textArea\",
                            \"action\": \"no_filter_special_characteres\"
                        }
                    ],
         \"config\": {
                            \"cleanHtml\": false
                        }
    }
  ]
';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
CREATE TABLE IF NOT EXISTS `nwmaker_login` (
    `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'textField,0,false',
  `permitir_crear_cuentas` varchar(2) DEFAULT NULL COMMENT 'selectBox,boolean',
  `tipo_login` varchar(25) DEFAULT NULL COMMENT 'selectBox,array',
  `activo` varchar(2) DEFAULT NULL COMMENT 'selectBox,boolean',
  `usar_redireccion_login` varchar(2) DEFAULT NULL COMMENT 'selectBox,boolean',
  `url_redireccion_login` varchar(150) DEFAULT NULL COMMENT 'textField',
   `pedir_documento` varchar(2) DEFAULT NULL COMMENT 'selectBox,boolean',
   `pedir_celular` varchar(2) DEFAULT NULL COMMENT 'selectBox,boolean',
   `permitir_registro_login_con_facebook` varchar(2) DEFAULT NULL COMMENT 'selectBox,boolean',
   `permitir_registro_login_con_twitter` varchar(2) DEFAULT NULL COMMENT 'selectBox,boolean',
  `usuario` varchar(100) DEFAULT NULL COMMENT 'textField,0,false',
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
 ALTER TABLE nwmaker_login COMMENT ' [
   {
                    \"selectBoxArrays\": [
              {
                \"name\": \"tipo_login\",
                \"data\": {
                    \"nwproject\": \"Normal para nwproject\",
                    \"qxnw\": \"Para QXNW \"
                }
            }
        ],
          \"conditions\": [
                        {
                            \"widget\": \"textArea\",
                            \"action\": \"no_filter_special_characteres\"
                        }
                    ],
         \"config\": {
                            \"cleanHtml\": false
                        }
    }
  ]
';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE  `nwmaker_codigo_oculto` ADD  `tipo_menu` VARCHAR( 15 ) NULL COMMENT  'selectBox,array',
ADD  `tipo_menu_mobile` VARCHAR( 15 ) NULL COMMENT  'selectBox,array';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE  `nwmaker_menu` CHANGE  `callBack`  `callback` VARCHAR( 100 ) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT  'textArea';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
CREATE TABLE IF NOT EXISTS `nwmaker_resetpass` (
    `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'textField,0,false',
  `token` VARCHAR(40) DEFAULT NULL COMMENT 'textField',
  `user` VARCHAR(150) DEFAULT NULL COMMENT 'textField',
  `usado` VARCHAR(2) DEFAULT NULL COMMENT 'selectBox,boolean',
   `fecha` date DEFAULT NULL COMMENT 'dateField',
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE  `nwmaker_login` ADD  `html_encabezado` TEXT NULL COMMENT  'ckeditor';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE  `nwmaker_login` ADD  `html_footer` TEXT NULL COMMENT  'ckeditor';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE  `nwmaker_codigo_oculto` ADD  `menu_movil_en_pc` VARCHAR( 2 ) NULL COMMENT  'selextBox,boolean';        
";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
            ALTER TABLE  `nwmaker_codigo_oculto` CHANGE  `menu_movil_en_pc`  `menu_movil_en_pc` VARCHAR( 2 ) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT  'SI' COMMENT  'selectBox,boolean';
";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
            ALTER TABLE  `nwmaker_codigo_oculto` ADD  `logotipo` VARCHAR( 100 ) NULL COMMENT  'uploader',
ADD  `buscar_minimizado` VARCHAR( 2 ) NULL COMMENT  'selectBox,boolean';
";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
            ALTER TABLE  `nwmaker_codigo_oculto` ADD  `alto_barra_enc` INT NULL COMMENT  'textField';
";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
            ALTER TABLE  `nwmaker_codigo_oculto` ADD  `fondo_barra_enc` VARCHAR( 65 ) NULL COMMENT  'colorButton';
";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
            ALTER TABLE  `nwmaker_modulos_home` CHANGE  `activo`  `activo` VARCHAR( 2 ) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL COMMENT  'selectBox,boolean';
";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
            ALTER TABLE  `nwmaker_menu` ADD  `mostrar_en_el_home` VARCHAR( 2 ) NULL COMMENT  'selectBox,boolean';
";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
            ALTER TABLE  `nwmaker_codigo_oculto` ADD  `mostrar_info_user_left` VARCHAR( 2 ) NULL COMMENT  'selectBox,boolean';
";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
            ALTER TABLE  `nwmaker_modulos_home` CHANGE  `modulo`  `modulo` INT( 11 ) NOT NULL COMMENT  'selectBox,nwmaker_modulos';
";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
            ALTER TABLE  `nwmaker_codigo_oculto` ADD  `codigo_libre` TEXT NULL COMMENT  'textArea';
";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
            ALTER TABLE  `nwmaker_codigo_oculto` CHANGE  `codigo`  `codigo_css` TEXT CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT  'textArea';
";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
            ALTER TABLE  `nwmaker_menu` ADD  `orden` INT NULL COMMENT  'textField';
";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
            ALTER TABLE  `nwmaker_menu` CHANGE  `callback`  `callback` VARCHAR( 5 ) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT  'selectBox,nwmaker_modulos';
";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
            ALTER TABLE  `nwmaker_codigo_oculto` CHANGE  `alto_barra_enc`  `alto_barra_enc` VARCHAR( 5 ) NULL DEFAULT NULL COMMENT  'textField';
";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
            ALTER TABLE  `nwmaker_codigo_oculto` ADD  `ancho_menu_left` VARCHAR( 5 ) NULL COMMENT  'textField';
";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
            ALTER TABLE  `nwmaker_codigo_oculto` ADD  `lateral_left_alto_completo` VARCHAR( 2 ) NULL COMMENT  'selectBox,boolean';
";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
CREATE TABLE IF NOT EXISTS `nwmaker_perfiles` (
    `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'textField,0,false',
  `nombre` varchar(150) DEFAULT NULL COMMENT 'textField',
  `descripcion` varchar(100) DEFAULT NULL COMMENT 'textArea',
  `pagina` int(11) DEFAULT NULL COMMENT 'selectBox,paginas',
  `usuario` varchar(60) DEFAULT NULL COMMENT 'textField,0,false',
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
CREATE TABLE IF NOT EXISTS `nwmaker_permisos` (
    `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'textField,0,false',
  `perfil` int(11) DEFAULT NULL COMMENT 'selectBox,nwmaker_perfiles',
  `modulo` int(11) DEFAULT NULL COMMENT 'selectBox,nwmaker_modulos',
  `consultar` varchar(2) DEFAULT NULL COMMENT 'selectBox,boolean',
  `editar` varchar(2) DEFAULT NULL COMMENT 'selectBox,boolean',
  `eliminar` varchar(2) DEFAULT NULL COMMENT 'selectBox,boolean',
  `exportar` varchar(2) DEFAULT NULL COMMENT 'selectBox,boolean',
  `usuario` varchar(60) DEFAULT NULL COMMENT 'textField,0,false',
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE  `nwmaker_modulos_home` ADD  `perfil` INT NULL COMMENT  'selectBox,nwmaker_perfiles';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
            ALTER TABLE  `nwmaker_modulos_home`
            ADD  `ancho` varchar(8) NULL COMMENT  'textField',
            ADD  `flotante` varchar(10) NULL COMMENT  'selectBox,array';
";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "   ALTER TABLE nwmaker_modulos_home COMMENT ' [
   {
                    \"selectBoxArrays\": [
              {
                \"name\": \"flotante\",
                \"data\": {
                    \"none\": \"None\",
                    \"left\": \"Left\",
                    \"right\": \"Right\"
                }
            }
        ],
         \"config\": {\"cleanHtml\": false}
    }
  ]
';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
            ALTER TABLE  `nwmaker_codigo_oculto` ADD  `url_javascript_principal` VARCHAR( 60 ) NULL COMMENT  'textField';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
            ALTER TABLE  `nwmaker_codigo_oculto` ADD  `usar_permisos_por_pagina` VARCHAR( 2 ) NULL COMMENT  'selectBox,boolean',
ADD  `usar_permisos_por_perfiles` VARCHAR( 2 ) NULL COMMENT  'selectBox,boolean';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
            ALTER TABLE  `nwmaker_codigo_oculto` ADD  `mostrar_primero_menu_que_modulos_home` VARCHAR( 2 ) NULL COMMENT  'selectBox,boolean';
            ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
                    ALTER TABLE  `nwmaker_codigo_oculto` ADD  `solicitar_pago` VARCHAR( 2 ) NULL COMMENT  'selectBox,boolean';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
CREATE TABLE IF NOT EXISTS `nwmaker_planes` (
    `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'textField,0,false',
  `nombre` varchar(150) DEFAULT NULL COMMENT 'textField',
  `valor` varchar(80) DEFAULT NULL COMMENT 'textField',
  `descripcion` varchar(150) DEFAULT NULL COMMENT 'ckeditor',
  `usuario` varchar(100) DEFAULT NULL COMMENT 'textField,0,false',
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE  `nwmaker_login` ADD  `codigo_libre` TEXT NULL COMMENT  'textArea';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
ALTER TABLE  `nwmaker_login` ADD  `callBack` TEXT NULL COMMENT  'textArea';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }


        $sql = "
            ALTER TABLE  `nwmaker_login` ADD  `pedir_nombre_y_apellidos` VARCHAR( 2 ) NULL COMMENT  'selectBox,boolean',
ADD  `pedir_ciudad` VARCHAR( 2 ) NULL COMMENT  'selectBox,boolean',
ADD  `pedir_fecha_nacimiento` VARCHAR( 2 ) NULL COMMENT  'selectBox,boolean';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
ALTER TABLE  `nwmaker_menu` ADD  `icono_menu_left` VARCHAR( 80 ) NULL COMMENT  'uploader';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
CREATE TABLE IF NOT EXISTS `nwmaker_perfiles_autorizados` (
    `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'textField,0,false',
  `perfil_principal` int(11) DEFAULT NULL COMMENT 'selectBox,nwmaker_perfiles',
  `perfil_autorizado` int(11) DEFAULT NULL COMMENT 'selectBox,nwmaker_perfiles',
  `usuario` varchar(100) DEFAULT NULL COMMENT 'textField,0,false',
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
    ALTER TABLE  `nwmaker_login` ADD  `pedir_code_promo` VARCHAR( 2 ) NULL COMMENT  'selectBox,boolean';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
CREATE TABLE IF NOT EXISTS `nwmaker_notificaciones` (
    `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'textField,0,false',
  `usuario_recibe` varchar(100) DEFAULT NULL COMMENT 'textField',
  `usuario_envia` varchar(100) DEFAULT NULL COMMENT 'textField',
  `leido` varchar(2) DEFAULT NULL COMMENT 'textField',
  `tipo` varchar(5) DEFAULT NULL COMMENT 'textField',
  `fecha_envio` timestamp  COMMENT 'textField',
  `mensaje` text DEFAULT NULL COMMENT 'textArea',
  `fecha_aviso_recordat` TIMESTAMP COMMENT 'textField',
  `tipo_aviso_recordat` VARCHAR( 5 ) COMMENT 'textField',
  `link` VARCHAR( 130 ) COMMENT 'textField',
  `modo_window` VARCHAR( 10 ) COMMENT 'textField',
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
            ALTER TABLE  `nwmaker_login`
            ADD  `pedir_genero` VARCHAR( 2 ) NULL COMMENT  'selectBox,boolean',
ADD  `pedir_profesion` VARCHAR( 2 ) NULL COMMENT  'selectBox,boolean',
ADD  `pedir_pais` VARCHAR( 2 ) NULL COMMENT  'selectBox,boolean';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }


        $sql = "
CREATE TABLE IF NOT EXISTS `nwmaker_login_profesiones` (
    `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'textField,0,false',
  `nombre` varchar(100) DEFAULT NULL COMMENT 'textField',
  `terminal` varchar(100) DEFAULT NULL COMMENT 'textField',
  `fecha` timestamp  COMMENT 'textField',
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
            ALTER TABLE  `nwmaker_login` ADD  `permitir_acceso_sin_login` VARCHAR( 2 ) NULL COMMENT  'selectBox,boolean';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
CREATE TABLE IF NOT EXISTS `nwmaker_users_empresas` (
    `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'textField,0,false',
  `usuario_cliente` int(11) DEFAULT NULL COMMENT 'textField',
  `terminal` int(11) DEFAULT NULL COMMENT 'textField',
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE  `nwmaker_codigo_oculto` ADD  `multi_terminal` VARCHAR( 2 ) NULL COMMENT  'selectBox,boolean';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
            ALTER TABLE  `nwmaker_users_empresas` CHANGE  `terminal`  `terminal_asociada` INT( 11 ) NULL DEFAULT NULL COMMENT  'textField';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
            ALTER TABLE  `nwmaker_users_empresas` CHANGE  `terminal_asociada`  `terminal_asociada` INT( 11 ) NULL DEFAULT NULL COMMENT  'selectBox,terminales';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
            ALTER TABLE  `nwmaker_login_profesiones`  ENGINE = MYISAM ;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
            ALTER TABLE nwmaker_login_profesiones ADD FULLTEXT(nombre);
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
               ALTER TABLE  `nwmaker_codigo_oculto` ADD  `permitir_cargar_moduleshome_get` VARCHAR( 2 ) NULL COMMENT  'selectBox,boolean';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE  `nwmaker_notificaciones` ADD  `id_objetivo` INT NULL ;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE  `nwmaker_notificaciones`
ADD  `title` VARCHAR( 70 ) NULL ,
ADD  `icon` VARCHAR( 70 ) NULL ;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE  `nwmaker_notificaciones`
ADD  `tipo_text_optional` CHAR( 100 ) NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE  `nwmaker_notificaciones`
ADD  `title` VARCHAR( 70 ) NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE  `nwmaker_notificaciones`
ADD  `icon` VARCHAR( 70 ) NULL ;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
ALTER TABLE  `nwmaker_codigo_oculto` ADD  `menu_vertical` VARCHAR( 2 ) NULL COMMENT  'selectBox,boolean';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
CREATE TABLE IF NOT EXISTS `nwmaker_departamentos` (
    `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'textField,0,false',
  `nombre` varchar(70) DEFAULT NULL COMMENT 'textField',
  `usuario_cliente` varchar(100) DEFAULT NULL COMMENT 'textField',
  `terminal` int(11) DEFAULT NULL COMMENT 'textField',
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
            CREATE TABLE IF NOT EXISTS `nwmaker_idiomas` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(120) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=15 ;
";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE  `nwmaker_menu` ADD  `callback_code` VARCHAR( 200 ) NULL COMMENT  'textArea';
";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE  `nwmaker_login` ADD  `permitir_login_user_only` VARCHAR( 2 ) NULL COMMENT  'selectBox,boolean',
ADD  `comprobar_via_email_login_user_only` VARCHAR( 2 ) NULL COMMENT  'selectBox,boolean';
";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
ALTER TABLE  `nwmaker_codigo_oculto` ADD  `solicitar_completar_perfil` VARCHAR( 2 ) NULL COMMENT  'selectBox,boolean';
";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
            ALTER TABLE  `nwmaker_codigo_oculto` ADD  `permitir_chat` VARCHAR( 2 ) NULL COMMENT  'selectBox,boolean';
";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
ALTER TABLE  `nwmaker_users_empresas`
ADD  `foto_perfil` VARCHAR( 60 ) NULL ,
ADD  `email` VARCHAR( 100 ) NULL ,
ADD  `nombres_apellidos` VARCHAR( 130 ) NULL ,
ADD  `user_cliente` VARCHAR( 100 ) NOT NULL ;
";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
ALTER TABLE  `nwmaker_notificaciones` CHANGE  `tipo`  `tipo` VARCHAR( 15 ) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT  'textField';
";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
CREATE TABLE IF NOT EXISTS `nwmaker_puntaje_historico` (
    `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'textField,0,false',
  `usuario` varchar(100) DEFAULT NULL COMMENT 'textField,0,false',
  `usuario_califica` varchar(100) DEFAULT NULL COMMENT 'textField,0,false',
  `calificacion` int(11) DEFAULT NULL COMMENT 'textField,0,false',
  `fecha` timestamp  COMMENT 'textField',
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
ALTER TABLE  `nwmaker_users_empresas` ADD  `last_connection` TIMESTAMP NULL COMMENT  'dateField';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
ALTER TABLE  `nwmaker_users_empresas` ADD  `status_connection` varchar(20) NULL COMMENT  'textField';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
CREATE TABLE IF NOT EXISTS `nwmaker_usuarios_log` (
    `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'textField,0,false',
  `usuario` varchar(100) DEFAULT NULL COMMENT 'textField,0,false',
  `estado` varchar(30) DEFAULT NULL COMMENT 'textField,0,false',
  `terminal` int(11) DEFAULT NULL COMMENT 'textField,0,false',
  `fecha` timestamp  COMMENT 'dateField',
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
CREATE TABLE IF NOT EXISTS `nwmaker_sessions` (
    `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'textField,0,false',
  `usuario` varchar(100) DEFAULT NULL COMMENT 'textField,0,false',
  `key_tmp` varchar(100) DEFAULT NULL COMMENT 'textField,0,false',
  `session_id` varchar(40) DEFAULT NULL COMMENT 'textField',
  `terminal` int(11) DEFAULT NULL COMMENT 'textField,0,false',
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE  `nwmaker_codigo_oculto`
ADD  `no_mostrar_foto_name_email_left` VARCHAR( 2 ) NULL COMMENT  'selectBox,boolean';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE  `nwmaker_login`
ADD  `link_politicas` VARCHAR( 80 ) NULL ,
ADD  `politicas_texto` VARCHAR( 100 ) NULL ;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE  `nwmaker_codigo_oculto` ADD  `pedir_aceptar_terminos_interno` VARCHAR( 2 ) NULL COMMENT  'selectBox,boolean';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
CREATE TABLE IF NOT EXISTS `nwmaker_terminos_condiciones` (
    `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'textField,0,false',
  `nombre` varchar(100) DEFAULT NULL COMMENT 'textField',
  `html` text DEFAULT NULL COMMENT 'ckeditor',
  `activo` varchar(2) DEFAULT NULL COMMENT 'selectBox,boolean',
  `fecha` timestamp  COMMENT 'textField',
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
CREATE TABLE IF NOT EXISTS `nwmaker_tarjetascredito` (
    `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'textField,0,false',
  `usuario` varchar(100) DEFAULT NULL COMMENT 'textField',
  `nombre` varchar(100) DEFAULT NULL COMMENT 'textField',
  `numero_tarjeta` varchar(100) DEFAULT NULL COMMENT 'textField',
  `fecha_vencimiento` varchar(100) DEFAULT NULL COMMENT 'textField',
  `codigo_seguridad` varchar(100) DEFAULT NULL COMMENT 'textField',
  `nombre_banco` varchar(100) DEFAULT NULL COMMENT 'textField',
  `fecha` timestamp  COMMENT 'textField',
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
CREATE TABLE IF NOT EXISTS `nwmaker_domains_autorizados` (
    `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'textField,0,false',
  `usuario` varchar(100) DEFAULT NULL COMMENT 'textField,0,false',
  `nombre` varchar(100) DEFAULT NULL COMMENT 'textField',
  `pagina` varchar(3) DEFAULT NULL COMMENT 'textField',
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
                    ALTER TABLE  `nwmaker_users_empresas` ADD  `dispositivo` VARCHAR( 60 ) NULL ;
                    ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
         ALTER TABLE  `nwmaker_usuarios_log` CHANGE  `usuario`  `usuario` VARCHAR( 100 ) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT  'textField',
CHANGE  `estado`  `estado` VARCHAR( 30 ) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT  'textField',
CHANGE  `terminal`  `terminal` INT( 11 ) NULL DEFAULT NULL COMMENT  'textField',
CHANGE  `fecha`  `fecha` TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT  'textField';
                    ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
ALTER TABLE  `nwmaker_terminos_condiciones` CHANGE  `fecha`  `fecha` TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT  'dateField';
                    ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
                    ALTER TABLE  `nwmaker_idiomas` CHANGE  `id`  `id` INT( 11 ) NOT NULL AUTO_INCREMENT COMMENT  'textField,0,false';
                    ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
ALTER TABLE  `nwmaker_login_profesiones` CHANGE  `terminal`  `terminal` VARCHAR( 100 ) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT  'selectBox,terminales',
CHANGE  `fecha`  `fecha` TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT  'textField,0,false';
                    ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
ALTER TABLE  `nwmaker_departamentos` CHANGE  `usuario_cliente`  `usuario_cliente` VARCHAR( 100 ) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT  'textField,0,false',
CHANGE  `terminal`  `terminal` INT( 11 ) NULL DEFAULT NULL COMMENT  'selectBox,terminales';
                    ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE  `nwmaker_codigo_oculto` ADD  `useApiGoogleMaps` VARCHAR( 2 ) NULL COMMENT  'selectBox,boolean';
                    ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
CREATE TABLE IF NOT EXISTS `nwmaker_suscriptorsPush` (
    `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'textField,0,false',
  `usuario` varchar(80) DEFAULT NULL COMMENT 'textField,0,false',
  `json` text DEFAULT NULL COMMENT 'textArea',
  `endpoint` varchar(150) DEFAULT NULL COMMENT 'textField',
  `userPublicKey` varchar(150) DEFAULT NULL COMMENT 'textField',
  `userAuthToken` varchar(100) DEFAULT NULL COMMENT 'textField',
  `fecha` timestamp  COMMENT 'textField',
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE  `nwmaker_codigo_oculto` 
ADD  `backgroundPage` VARCHAR( 60 ) NULL ,
ADD  `activeServerWorker` VARCHAR(2) NULL COMMENT  'selectBox,boolean',
ADD  `show_about` VARCHAR(2) NULL COMMENT  'selectBox,boolean',
ADD  `offlineNwDual` VARCHAR(2) NULL COMMENT  'selectBox,boolean',
ADD  `menu_cache` VARCHAR(2) NULL COMMENT  'selectBox,boolean',
ADD  `workLocal` VARCHAR(2) NULL COMMENT  'selectBox,boolean' ;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE  `nwmaker_login` 
ADD  `pedir_pagina_web` VARCHAR( 2 ) NULL COMMENT  'selectBox,boolean',
ADD  `id_empresa_de_nuevas_cuentas` VARCHAR( 4 ) NULL ,
ADD  `apply_css_loginBox` VARCHAR( 2 ) NULL COMMENT  'selectBox,boolean',
ADD  `logotipo_login` VARCHAR( 80 ) NULL COMMENT  'textField';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE  `nwmaker_users_empresas` 
ADD  `isGroup` VARCHAR( 2 ) NULL ,
ADD  `usersGroup` TEXT NULL ;
            ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
ALTER TABLE  `nwmaker_users_empresas` ADD  `idCallGroup` VARCHAR( 4 ) NULL ;
            ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
ALTER TABLE `nwmaker_users_empresas` CHANGE `user_cliente` `user_cliente` VARCHAR(100) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL;
            ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `nwmaker_login` ADD `verificar_email_via_correo` VARCHAR(2) NULL COMMENT 'selectBox,boolean';
            ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
ALTER TABLE `nwmaker_resetpass` ADD `tipo` VARCHAR(15) NULL;
            ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
ALTER TABLE `nwmaker_resetpass` CHANGE `fecha` `fecha` TIMESTAMP NULL DEFAULT NULL COMMENT 'dateField';
            ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `nwmaker_codigo_oculto` ADD `menu_para_qxnw` VARCHAR(2) NULL COMMENT 'selectBox,boolean';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `nwmaker_codigo_oculto` ADD `mostrar_chat_al_inicio` VARCHAR(2) NULL COMMENT 'selectBox,boolean';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
CREATE TABLE pv_clientes (
    id INT(11) NOT NULL AUTO_INCREMENT,
    nit VARCHAR(100),
    nombre VARCHAR(150),
    telefono FLOAT,
    direccion VARCHAR(100),
    email VARCHAR(150),
    usuario VARCHAR(80),
    empresa INT(11),
    fecha date,
    zona INT(11),
    usuario_cliente VARCHAR(200),
    clave VARCHAR(100),
    fecha_registro timestamp NOT NULL,
    fecha_actualizacion timestamp NOT NULL,
    celular VARCHAR(20),
    ciudad INT(11) NOT NULL,
    barrio VARCHAR(100),
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=latin1;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE  `pv_clientes` CHANGE  `id`  `id` INT( 11 ) NOT NULL AUTO_INCREMENT COMMENT  'textField,0,false',
CHANGE  `usuario`  `usuario` VARCHAR( 80 ) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT  'textField,0,false',
CHANGE  `fecha`  `fecha` DATE NULL DEFAULT NULL COMMENT  'dateField',
CHANGE  `usuario_cliente`  `usuario_cliente` VARCHAR( 200 ) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT  'textField,0,false',
CHANGE  `fecha_registro`  `fecha_registro` TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT  'dateField',
CHANGE  `fecha_actualizacion`  `fecha_actualizacion` TIMESTAMP NOT NULL DEFAULT  '0000-00-00 00:00:00' COMMENT  'dateField',
CHANGE  `ciudad`  `ciudad` INT( 11 ) NULL COMMENT  'selectBox,ciudades';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE  `pv_clientes` ADD  `apellido` VARCHAR( 120 ) NULL COMMENT  'textField';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
            ALTER TABLE  `pv_clientes` CHANGE  `usuario_cliente`  `usuario_cliente` VARCHAR( 200 ) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT  'textField';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
            ALTER table `pv_clientes`
       MODIFY COLUMN `apellido` VARCHAR( 120 ) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT  'textField'
       AFTER `nombre`
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
            ALTER TABLE  `pv_clientes` CHANGE  `fecha`  `fecha` DATE NULL DEFAULT NULL COMMENT  'textField,0,false';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
            ALTER TABLE  `pv_clientes`
ADD  `terminal` INT NULL DEFAULT  '1000000' COMMENT  'selectBox,terminales',
ADD  `pais` INT NULL DEFAULT  '1' COMMENT  'selectBox,paises',
ADD  `perfil` INT NULL DEFAULT  '120' COMMENT  'selectBox,perfiles',
ADD  `estado` VARCHAR( 15 ) NULL DEFAULT  'activo' COMMENT  'textField';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
            ALTER TABLE  `pv_clientes` ADD  `fecha_nacimiento` DATE NULL COMMENT  'dateField';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
                    ALTER TABLE  `pv_clientes` CHANGE  `perfil`  `perfil` INT( 11 ) NULL DEFAULT  '120' COMMENT  'selectBox,nwmaker_perfiles';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE  `pv_clientes` ADD  `foto_perfil` VARCHAR( 150 ) NULL COMMENT  'uploader';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE  `pv_clientes`
ADD  `url_personalizada` VARCHAR( 20 ) NULL COMMENT  'textField',
ADD  `estado_conexion` VARCHAR( 25 ) NULL COMMENT  'textField';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE  `pv_clientes` ADD  `puntaje` INT NULL DEFAULT  '0';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE  `pv_clientes`
ADD  `pago_estado` VARCHAR( 60 ) NULL ,
ADD  `pago_medio` VARCHAR( 60 ) NULL ,
ADD  `pago_fecha` TIMESTAMP NULL ,
ADD  `pago_plan` VARCHAR( 60 ) NULL ,
ADD  `pago_referencia` VARCHAR( 60 ) NULL ,
ADD  `pago_forma_pago` VARCHAR( 60 ) NULL ,
ADD  `pago_cus` VARCHAR( 60 ) NULL ,
ADD  `pago_valor` VARCHAR( 60 ) NULL ;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
            ALTER TABLE  `pv_clientes` CHANGE  `terminal`  `terminal` INT( 11 ) NULL COMMENT  'selectBox,terminales';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE  `pv_clientes` ADD  `codigo_promocional` VARCHAR( 50 ) NULL COMMENT  'textField';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE  `pv_clientes` ADD  `usuario_principal` VARCHAR( 100 ) NULL COMMENT  'selectBox,pv_clientes';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE  `pv_clientes` ADD  `genero` VARCHAR( 10 ) NOT NULL ,
ADD  `profesion` INT NOT NULL ;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
            ALTER TABLE  `pv_clientes` ADD  `saldo` VARCHAR( 20 ) NULL COMMENT  'textField';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
            ALTER TABLE  `pv_clientes` CHANGE  `pais`  `pais` INT( 11 ) NULL COMMENT  'selectBox,paises';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
 ALTER TABLE pv_clientes COMMENT '
[
                {
                    \"navTables\": [
                        {
                            \"title\": \"Configuración Otras Terminales\",
                            \"table\": \"nwmaker_users_empresas\",
                            \"name\": \"usuario_cliente\",
                            \"reference\": \"usuario_cliente\"
                        }
                   ]
                }
            ]
';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
            ALTER TABLE  `pv_clientes`  ENGINE = MYISAM ;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
            ALTER TABLE pv_clientes ADD FULLTEXT(nombre);
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
            ALTER TABLE pv_clientes ADD FULLTEXT(apellido);
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
                ALTER TABLE pv_clientes
ADD FULLTEXT(nombre),
ADD FULLTEXT(apellido)
;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
            ALTER TABLE  `pv_clientes` ADD  `tags` VARCHAR( 100 ) NULL ;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
            ALTER TABLE pv_clientes ADD FULLTEXT(tags);
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
               ALTER TABLE  `pv_clientes` ADD  `casa_apto` VARCHAR( 40 ) NULL ;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE pv_clientes ADD UNIQUE (usuario_cliente);
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
            ALTER TABLE  `pv_clientes` ADD  `foto_portada` VARCHAR( 100 ) COMMENT  'uploader';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
            ALTER TABLE  `pv_clientes` ADD  `cargo_actual` VARCHAR( 100 ) NULL COMMENT  'textField',
ADD  `empresa_labora` VARCHAR( 100 ) NULL COMMENT  'textField',
ADD  `descripcion` TEXT NULL COMMENT  'textArea';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
            ALTER TABLE  `pv_clientes` ADD  `departamento` INT NULL COMMENT  'selectBox,nwmaker_departamentos';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE  `pv_clientes` ADD  `fecha_ultima_conexion` TIMESTAMP NULL COMMENT  'dateField';
";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE  `pv_clientes` ADD  `cookie` VARCHAR( 55 ) NULL ;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE  `pv_clientes` ADD  `acepto_terminos_condiciones` VARCHAR( 2 ) NULL COMMENT  'selectBox,boolean',
ADD  `fecha_acepta_terminos` TIMESTAMP NULL COMMENT  'dateField';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE  `pv_clientes` ADD  `tipo_doc` VARCHAR( 20 ) NULL COMMENT  'textField' AFTER  `id` ;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
              ALTER TABLE  `pv_clientes` ADD  `dispositivo` VARCHAR( 60 ) NULL ;
                    ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
            ALTER TABLE `pv_clientes` CHANGE `fecha_actualizacion` `fecha_actualizacion` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'dateField';
            ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
            ALTER TABLE `pv_clientes` CHANGE `genero` `genero` VARCHAR(20) NULL COMMENT 'textField';
            ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
            ALTER TABLE `pv_clientes` CHANGE `profesion` `profesion` INT(11) NULL;
            ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
            ALTER TABLE `pv_clientes` ADD `fecha_actualizacion` TIMESTAMP NULL AFTER `fecha_acepta_terminos`;
            ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }



        $sql = "
CREATE TABLE IF NOT EXISTS `nwpay_pagos` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'textField,0,false',
  `cliente_nom` varchar(200) NOT NULL COMMENT 'textField',
  `email_cliente` varchar(120) NOT NULL COMMENT 'textField',
  `documento_cliente` int(11) NOT NULL COMMENT 'textField',
  `num_factura` varchar(60) NOT NULL COMMENT 'textField',
  `usuario` varchar(90) NOT NULL COMMENT 'textField,0,false',
  `empresa` int(11) NOT NULL COMMENT 'textField,0,false',
  `fecha_creacion` timestamp NULL DEFAULT NULL COMMENT 'textField,0,false',
  `fecha_actualizacion` timestamp NULL DEFAULT NULL COMMENT 'textField,0,false',
  `estado` varchar(20) NOT NULL COMMENT 'selectBox,array',
  `referencia` varchar(20) DEFAULT NULL COMMENT 'textField',
  `total` int(11) NOT NULL COMMENT 'textField',
  `clave_segura` varchar(50) NOT NULL COMMENT 'textField',
  PRIMARY KEY (`id`),
  UNIQUE KEY `ref` (`referencia`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
 ALTER TABLE nwpay_pagos COMMENT ' [
   {
                    \"selectBoxArrays\": [
              {
                \"name\": \"estado\",
                \"data\": {
                    \"CREADO\": \"CREADO\",
                    \"EN_PROCESO_DE_PAGO\": \"EN PROCESO DE PAGO\",
                    \"APROBADA\": \"APROBADA\",
                    \"CANCELADO\": \"CANCELADO\",
                    \"DECLINADA\": \"DECLINADA\"
                }
            }
        ],
         \"config\": {
                            \"cleanHtml\": false
                        }
    }
  ]
';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE  `nwpay_pagos` ADD  `ref_session_pedido` VARCHAR( 50 ) NULL COMMENT  'textField,0,false';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
            ALTER TABLE  `nwpay_pagos` ADD  `fecha_actualizacion_payu` TIMESTAMP NULL COMMENT  'textField';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
            ALTER TABLE  `nwpay_pagos` ADD  `email_informativo_enviado` VARCHAR( 2 ) NULL COMMENT  'selectBox,boolean';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
            ALTER TABLE  `nwpay_pagos` ADD  `tipo_respuesta_payu` VARCHAR( 35 ) NULL COMMENT  'textField';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE  `nwpay_pagos` 
ADD  `tipo` VARCHAR( 40 ) NULL ,
ADD  `serviceResponse` VARCHAR( 80 ) NULL ,
ADD  `methodResponse` VARCHAR( 80 ) NULL ;
                    ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE  `nwpay_pagos` ADD  `estado_response_pay` VARCHAR( 50 ) NULL ;
                    ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
            ALTER TABLE  `nwpay_pagos` CHANGE  `fecha_actualizacion`  `fecha_actualizacion` TIMESTAMP NULL DEFAULT NULL COMMENT  'textField,0,false';
            ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
            ALTER TABLE  `nwpay_pagos` CHANGE  `fecha_actualizacion_payu`  `fecha_actualizacion_payu` TIMESTAMP NULL DEFAULT NULL COMMENT  'textField,0,false';
            ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
            ALTER TABLE  `nwpay_pagos` CHANGE  `email_informativo_enviado`  `email_informativo_enviado` VARCHAR( 2 ) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL COMMENT  'selectBox,boolean';
            ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE  `nwpay_pagos` CHANGE  `estado`  `estado` VARCHAR( 100 ) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL COMMENT  'textField';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `nwpay_pagos` 
CHANGE `cliente_nom` `cliente_nom` VARCHAR(200) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL COMMENT 'textField', 
CHANGE `email_cliente` `email_cliente` VARCHAR(120) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL COMMENT 'textField', 
CHANGE `documento_cliente` `documento_cliente` INT(11) NULL COMMENT 'textField', 
CHANGE `num_factura` `num_factura` VARCHAR(60) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL COMMENT 'textField', 
CHANGE `usuario` `usuario` VARCHAR(90) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL COMMENT 'textField,0,false', 
CHANGE `empresa` `empresa` INT(11) NULL COMMENT 'textField,0,false', 
CHANGE `estado` `estado` VARCHAR(100) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL COMMENT 'textField', 
CHANGE `total` `total` INT(11) NULL COMMENT 'textField', 
CHANGE `clave_segura` `clave_segura` VARCHAR(50) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL COMMENT 'textField', 
CHANGE `email_informativo_enviado` `email_informativo_enviado` VARCHAR(2) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL COMMENT 'selectBox,boolean';
            ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
ALTER TABLE  `nwmaker_puntaje_historico` ADD  `comentario` VARCHAR( 150 ) NULL ;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
            ALTER TABLE  `nwmaker_puntaje_historico` ADD  `tipo` VARCHAR( 20 ) NULL ;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
            ALTER TABLE  `nwmaker_notificaciones` ADD  `notificado` VARCHAR( 2 ) NULL COMMENT  'selectBox,boolean';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
     ALTER TABLE `nwmaker_notificaciones` ADD `fecha_aviso_recordat` TIMESTAMP NULL COMMENT 'dateField';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }


        $sql = "ALTER TABLE `empresas` ADD `plantilla_bienvenida` VARCHAR(50) NOT NULL AFTER `usuario`;";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }



        $sql = "
                ALTER TABLE  `pv_clientes` ADD  `show_tutorial` VARCHAR( 2 ) NULL COMMENT  'selectBox,boolean';
                ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }




        $sql = "
CREATE TABLE `nw_cmi_det` ( `id` INT NOT NULL AUTO_INCREMENT , `tipo` VARCHAR(30) NOT NULL , `clave` VARCHAR(30) NOT NULL , `valor` VARCHAR(50) NOT NULL , `fecha` DATE NOT NULL , `usuario` VARCHAR(30) NOT NULL , `empresa` INT NOT NULL , PRIMARY KEY (`id`)) ENGINE = InnoDB;
                ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
ALTER TABLE `empresas` CHANGE `plantilla_bienvenida` `plantilla_bienvenida` VARCHAR(50) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL;
                ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
ALTER TABLE `nwmaker_menu` ADD `contiene_hijos` VARCHAR(2) NULL COMMENT 'selectBox,boolean';
                ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `nwmaker_menu` ADD `nivel_hijos` VARCHAR(1) NULL COMMENT 'textField';
                ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `nwmaker_menu` ADD `ocultar_menu_on_click` VARCHAR(2) NULL COMMENT 'selectBox,boolean';
                ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `nwmaker_users_empresas` 
CHANGE `usuario_cliente` `usuario_cliente` INT(11) NULL DEFAULT NULL COMMENT 'textField', 
CHANGE `terminal_asociada` `terminal_asociada` INT(11) NULL DEFAULT NULL COMMENT 'selectBox,terminales', 
CHANGE `foto_perfil` `foto_perfil` VARCHAR(60) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT 'uploader', 
CHANGE `email` `email` VARCHAR(100) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT 'email', 
CHANGE `nombres_apellidos` `nombres_apellidos` VARCHAR(130) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT 'textField', 
CHANGE `user_cliente` `user_cliente` VARCHAR(100) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT 'textField', 
CHANGE `last_connection` `last_connection` TIMESTAMP NULL DEFAULT NULL COMMENT 'dateField', 
CHANGE `status_connection` `status_connection` VARCHAR(20) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT 'textField',
CHANGE `dispositivo` `dispositivo` VARCHAR(60) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT 'textField,0,false', 
CHANGE `isGroup` `isGroup` VARCHAR(2) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT 'textField,0,false', 
CHANGE `usersGroup` `usersGroup` TEXT CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT 'textField,0,false', 
CHANGE `idCallGroup` `idCallGroup` VARCHAR(4) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT 'textField,0,false';
                ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }


        $sql = "
CREATE TABLE IF NOT EXISTS `nwexcel_files` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'textField,0,false',
  `fecha` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'textField,0,false',
  `fecha_update` timestamp NOT NULL COMMENT 'dateField',
  `nombre` varchar(200) DEFAULT NULL COMMENT 'ckeditor',
  `texto` longtext COMMENT 'ckeditor',
  `usuario` varchar(100) DEFAULT NULL COMMENT 'textField,0,false',
  `tipo` varchar(10) DEFAULT NULL COMMENT 'selectBox',
  `empresa` int(11) DEFAULT NULL COMMENT 'textField,0,false',
  `code_js` text COMMENT 'textArea',
  `acceso` varchar(100) DEFAULT NULL COMMENT 'textField',
  `permisos` varchar(100) DEFAULT NULL COMMENT 'textField',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=35 ;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
CREATE TABLE IF NOT EXISTS `nwexcel_files` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'textField,0,false',
  `fecha` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'textField,0,false',
  `fecha_update` timestamp NOT NULL NOT NULL COMMENT 'dateField',
  `nombre` varchar(200) DEFAULT NULL COMMENT 'ckeditor',
  `texto` LONGTEXT DEFAULT NULL COMMENT 'ckeditor',
  `usuario` varchar(100) DEFAULT NULL COMMENT 'textField,0,false',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE  `nwexcel_files`
ADD  `tipo` VARCHAR( 10 ) NULL COMMENT  'selectBox',
ADD  `empresa` INT NULL COMMENT  'textField,0,false',
ADD  `code_js` TEXT NULL COMMENT  'textArea';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
ALTER TABLE  `nwexcel_files` ADD  `tipo` VARCHAR( 10 ) NULL COMMENT  'selectBox';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
ALTER TABLE  `nwexcel_files` ADD  `empresa` INT NULL COMMENT  'textField,0,false';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
ALTER TABLE  `nwexcel_files`
ADD  `acceso` VARCHAR( 100 ) NULL COMMENT  'textField',
ADD  `permisos` VARCHAR( 100 ) NULL COMMENT  'textField';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `nwexcel_files` CHANGE `fecha_update` `fecha_update` TIMESTAMP NULL DEFAULT NULL COMMENT 'dateField';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `nwexcel_files` CHANGE `code_js` `code_js` TEXT CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
CREATE TABLE IF NOT EXISTS  `nwexcel_variables_globales` (
 `id` INT( 11 ) NOT NULL AUTO_INCREMENT ,
 `nombre` VARCHAR( 60 ) NOT NULL ,
 `usuario` VARCHAR( 60 ) NOT NULL ,
 `fecha` DATE NOT NULL ,
 `hoja` INT( 11 ) NOT NULL ,
PRIMARY KEY (  `id` )
) ENGINE = INNODB DEFAULT CHARSET = latin1 AUTO_INCREMENT =1;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE  `nwexcel_files` ADD  `code_css` TEXT NULL COMMENT  'textArea';           
";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
CREATE TABLE nwexcel_condicionales (
    id INT(11) NOT NULL AUTO_INCREMENT COMMENT  'textField,0,false',
    id_documento INT(11)  COMMENT  'selectBox,nc_filtros',
    campo_div VARCHAR(100)  COMMENT  'textField',
    campo_max VARCHAR(100)  COMMENT  'textField',
    campo_min VARCHAR(100)  COMMENT  'textField',
    igual VARCHAR(100)  COMMENT  'textField',
    colormax VARCHAR(100)  COMMENT  'textField',
    colormin VARCHAR(100)  COMMENT  'textField',
    colorigual VARCHAR(100)  COMMENT  'textField',
    colornormal VARCHAR(100)  COMMENT  'textField',
    usuario VARCHAR(50) COMMENT  'textField,0,false',
    empresa INT(11) COMMENT  'textField,0,false',
    fecha date COMMENT  'textField,0,false',
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=latin1;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "ALTER TABLE `nwmaker_notificaciones` CHANGE `fecha_envio` `fecha_envio` TIMESTAMP on update CURRENT_TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'dateTimeField';";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "ALTER TABLE `nwmaker_notificaciones` CHANGE `leido` `leido` VARCHAR(2) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT 'textField,0,false';";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "ALTER TABLE `nwmaker_notificaciones` CHANGE `tipo` `tipo` VARCHAR(15) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT 'textField,0,false';";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "ALTER TABLE `nwmaker_notificaciones` CHANGE `tipo_aviso_recordat` `tipo_aviso_recordat` VARCHAR(5) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT 'textField,0,false';";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "ALTER TABLE `nwmaker_notificaciones` CHANGE `modo_window` `modo_window` VARCHAR(10) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT 'textField,0,false';";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "ALTER TABLE `nwmaker_notificaciones` CHANGE `fecha_aviso_recordat` `fecha_aviso_recordat` TIMESTAMP NULL DEFAULT NULL COMMENT 'textField,0,false';";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "ALTER TABLE `nwmaker_notificaciones` CHANGE `id_objetivo` `id_objetivo` INT(11) NULL DEFAULT NULL COMMENT 'textField,0,false';";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }




        $sql = "
CREATE TABLE nwmaker_videollamadas (
    id INT(11) NOT NULL AUTO_INCREMENT COMMENT  'textField,0,false',
    usuario VARCHAR(100)  COMMENT  'textField',
    usuario_recibe VARCHAR(100)  COMMENT  'textField',
    terminal INT(11) COMMENT  'textField,0,false',
     `fecha` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'textField',
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=latin1;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE  `nwmaker_videollamadas` ADD  `tipo` VARCHAR( 20 ) NULL ;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
            ALTER TABLE  `nw_keys_conf` ADD  `change_at_init` BOOLEAN NULL COMMENT  'selectBox,boolean';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
            ALTER TABLE  `usuarios_log` ADD  `terminal` INT NULL COMMENT  'textField,0,false';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
CREATE TABLE nw_print_forms (
    id INT(11) NOT NULL AUTO_INCREMENT COMMENT  'textField,0,false',
    nombre VARCHAR(100)  COMMENT  'textField',
    html text  COMMENT  'textArea',
    usuario VARCHAR(100)  COMMENT  'textField',
    id_relation INT(11) COMMENT  'textField',
    empresa INT(11) COMMENT  'textField,0,false',
    terminal INT(11) COMMENT  'textField,0,false',
     `fecha` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'textField',
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=latin1;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
ALTER TABLE  `terminales` ADD  `plan` VARCHAR( 50 ) NULL ;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
            ALTER TABLE  `terminales` 
ADD  `pos_x` VARCHAR(100) NULL COMMENT  'textField',
ADD  `pos_y` VARCHAR(100) NULL COMMENT  'textField',
ADD  `zoom` VARCHAR(100) NULL COMMENT  'textField'
;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `terminales` ADD `url` VARCHAR(70) NULL AFTER `activo`;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `nwmaker_menu` 
ADD `limpiar_modulos_center` VARCHAR(2) NULL COMMENT 'selectBox,boolean', 
ADD `change_url` VARCHAR(2) NULL COMMENT 'selectBox,boolean';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `nwmaker_menu` ADD `solo_registrados` VARCHAR(2) NULL COMMENT 'selectBox,boolean';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `usuarios` CHANGE `usuario` `usuario` VARCHAR(200) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL COMMENT 'textField';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `nwmaker_sessions` ADD `fecha` TIMESTAMP NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
            ALTER TABLE `terminales` CHANGE `tienda_nwscliente` `tienda_nwscliente` INT(11) NULL COMMENT 'selectBox,pv_empresas_clientes';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE  `nwmaker_codigo_oculto` 
ADD  `theme_color`
VARCHAR( 15 ) NULL COMMENT  'textField';        
";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE  `nwmaker_codigo_oculto` 
ADD  `use_menu_of_bd`
VARCHAR( 2 ) NULL COMMENT  'selectBox,boolean';        
";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `nw_downloads` CHANGE `usuario` `usuario` VARCHAR(180) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL COMMENT 'textField,0,false';
";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
            ALTER TABLE `nwmaker_users_empresas` 
            ADD `usuario_quien_asocia` VARCHAR(190) NULL, 
            ADD `aprobado_por_ambos` VARCHAR(2) NULL;
";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
//        $sql = "
//        ALTER TABLE `nwmaker_menu` ADD INDEX(`id`);
//";
//        $ca->prepare($sql);
//        if (!$ca->exec()) {
//            master::logSystemError($ca->lastErrorText());
//        }
//        $sql = "
//        ALTER TABLE `nwmaker_notificaciones` ADD INDEX(`id`);
//";
//        $ca->prepare($sql);
//        if (!$ca->exec()) {
//            master::logSystemError($ca->lastErrorText());
//        }
//        $sql = "
//      ALTER TABLE `nwmaker_notificaciones` ADD INDEX(`usuario_recibe`);
//";
//        $ca->prepare($sql);
//        if (!$ca->exec()) {
//            master::logSystemError($ca->lastErrorText());
//        }
//        $sql = "
//            ALTER TABLE `nwmaker_users_empresas` ADD INDEX(`idCallGroup`);
//";
//        $ca->prepare($sql);
//        if (!$ca->exec()) {
//            master::logSystemError($ca->lastErrorText());
//        }

        $sql = "
     CREATE TABLE nwdb_server (
    id INT(11) NOT NULL AUTO_INCREMENT COMMENT  'textField,0,false',
   host VARCHAR(100)  COMMENT  'textField',
   user_name VARCHAR(100)  COMMENT  'textField',
   nombre VARCHAR(100)  COMMENT  'textField',
   driver VARCHAR(100)  COMMENT  'textField',
   puerto VARCHAR(100)  COMMENT  'textField',
   password VARCHAR(100)  COMMENT  'textField',
    usuario VARCHAR(100)  COMMENT  'textField',
    empresa INT(11)  COMMENT  'textField',
    terminal INT(11) COMMENT  'textField,0,false',
     `fecha` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'textField',
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=latin1;
";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
     CREATE TABLE nwdb_server_db (
    id INT(11) NOT NULL AUTO_INCREMENT COMMENT  'textField,0,false',
   host VARCHAR(100)  COMMENT  'textField',
   user_name VARCHAR(100)  COMMENT  'textField',
   puerto VARCHAR(100)  COMMENT  'textField',
   password VARCHAR(100)  COMMENT  'textField',
   db_name VARCHAR(100)  COMMENT  'textField',
    usuario VARCHAR(100)  COMMENT  'textField',
    empresa INT(11)  COMMENT  'textField',
    terminal INT(11) COMMENT  'textField,0,false',
     `fecha` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'textField',
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=latin1;
";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
     CREATE TABLE nw_server_db (
    id INT(11) NOT NULL AUTO_INCREMENT COMMENT  'textField,0,false',
   driver VARCHAR(100)  COMMENT  'selectBox,array',
   host VARCHAR(100)  COMMENT  'textField',
   dbname VARCHAR(100)  COMMENT  'textField',
   username VARCHAR(100)  COMMENT  'textField',
   pass VARCHAR(100)  COMMENT  'textField',
    usuario VARCHAR(100)  COMMENT  'textField,0,false',
    empresa INT(11)  COMMENT  'textField,0,false',
    terminal INT(11) COMMENT  'textField,0,false',
     `fecha` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'textField',
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=latin1;
";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
 ALTER TABLE nw_server_db COMMENT '[
{
             \"selectBoxArrays\": [
                                    {
                                        \"name\": \"driver\",
                                        \"data\": {

                                                \"MYSQL\": \"MYSQL\",
                                                \"PGSQL\": \"PGSQL\",
                                                \"ORACLE\": \"ORACLE\"
                                        }
                                    }
                                ]
            }
            ]';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "ALTER TABLE `nw_server_db` ADD puerto VARCHAR(10);";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "CREATE TABLE `nw_cambios_claves` ( `id` SERIAL NOT NULL AUTO_INCREMENT , `usuario` VARCHAR(50) NOT NULL , `fecha` DATE NOT NULL , PRIMARY KEY (`id`)) ENGINE = InnoDB;";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `perfiles` ADD `empresa` INT NULL;            
";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
            ALTER TABLE `permisos` CHANGE `pais` `pais` INT(11) NULL COMMENT 'selectBox,paises';
";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
       ALTER TABLE `nwmaker_sessions` ADD `cookie` VARCHAR(60) NULL;
";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
            ALTER TABLE `nwmaker_sessions` ADD `fecha` TIMESTAMP NULL;
";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
            ALTER TABLE `nwmaker_notificaciones` ADD `callback` VARCHAR(200) NULL;
";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "ALTER TABLE `nwmaker_notificaciones` CHANGE `fecha_envio` `fecha_envio` TIMESTAMP NULL COMMENT 'dateTimeField';";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
ALTER TABLE `usuarios` ADD `foto_portada` VARCHAR(85) NULL AFTER `departamento`;
";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `usuarios` ADD `tags` VARCHAR(80) NULL;
";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `usuarios` ADD `fecha_actualizacion` TIMESTAMP NULL;
";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "ALTER TABLE `usuarios` ADD `dispositivo` VARCHAR(20) NULL;";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
            ALTER TABLE  `terminales` ADD  `dominios_autorizados` VARCHAR( 200 ) NULL ;
                ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
            ALTER TABLE `usuarios` CHANGE `documento` `documento` VARCHAR(22) NULL COMMENT 'textField';
                ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
CREATE TABLE nwmaker_videollamadas_chats (
    id INT(11) NOT NULL AUTO_INCREMENT COMMENT  'textField,0,false',
    usuario_foto VARCHAR(100)  COMMENT  'textField',
    usuario_envia VARCHAR(100)  COMMENT  'textField',
    mensaje text  COMMENT  'textArea',
    id_enc INT(11) COMMENT  'textField,0,false',
    terminal INT(11) COMMENT  'textField,0,false',
     `fecha` timestamp NULL DEFAULT NULL COMMENT 'dateField',
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=latin1;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `nwmaker_videollamadas_chats` ADD `leido` VARCHAR(2) NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `nwmaker_videollamadas_chats` ADD `usuario_recibe` VARCHAR(100) NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `usuarios`
ADD `account_code_activation` INT NULL, 
ADD `account_date_expiration` DATE NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `pv_clientes` ADD `fecha_actualizacion` TIMESTAMP NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `pv_clientes`
ADD `account_code_activation` INT NULL, 
ADD `account_date_expiration` DATE NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
            ALTER TABLE  `usuarios_empresas` CHANGE  `usuario`  `usuario` VARCHAR( 100 ) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL ;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }


        $sql = "
ALTER TABLE `nwmaker_login` 
ADD `no_usar_clave` VARCHAR(2) NULL COMMENT 'selectBox,boolean', 
ADD `loguear_alcrear_siexiste` VARCHAR(2) NULL COMMENT 'selectBox,boolean';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `nwmaker_login` 
ADD `pedir_direccion` VARCHAR(2) NULL COMMENT 'selectBox,boolean', 
ADD `pedir_departamento_geo` VARCHAR(2) NULL COMMENT 'selectBox,boolean';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }


        $sql = "
ALTER TABLE `nwmaker_login` 
ADD `pedir_formas_pago` VARCHAR(2) NULL COMMENT 'selectBox,boolean';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `nwmaker_login` 
ADD `pedir_observaciones` VARCHAR(2) NULL COMMENT 'selectBox,boolean';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `usuarios` ADD `usuario_principal` VARCHAR(100) NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `empresas` 
CHANGE `razon_social` `razon_social` VARCHAR(200) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL, 
CHANGE `nit` `nit` VARCHAR(100) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL, 
CHANGE `direccion` `direccion` TEXT CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL, 
CHANGE `telefono` `telefono` VARCHAR(100) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL, 
CHANGE `email` `email` VARCHAR(100) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL, 
CHANGE `slogan` `slogan` TEXT CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `nc_config` 
ADD `descuento_valor` INT NULL COMMENT 'textField', 
ADD `descuento_es_porcentaje` VARCHAR(2) NULL COMMENT 'selectBox,boolean', 
ADD `descuento_finicial` DATE NULL COMMENT 'dateField', 
ADD `descuento_ffinal` DATE NULL COMMENT 'dateField';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `nc_config` ADD `descuento_descripcion` TEXT NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }


        $sql = "
ALTER TABLE `nwmaker_login` ADD `usar_datos_envio_tarjetabiente` VARCHAR(2) NULL COMMENT 'selectBox,boolean';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
CREATE TABLE IF NOT EXISTS `nwmaker_login_datostarjetabiente` (
  `id` int(20) NOT NULL AUTO_INCREMENT COMMENT 'textField,0,false',
  `usuario` varchar(100) DEFAULT NULL,
  `nombre` varchar(100) DEFAULT NULL,
  `apellido` varchar(100) DEFAULT NULL,
  `telefono` varchar(100) DEFAULT NULL,
  `direccion` varchar(100) DEFAULT NULL,
  `pais` varchar(100) DEFAULT NULL,
  `departamento` varchar(100) DEFAULT NULL,
  `ciudad` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `nwmaker_login_datostarjetabiente` ADD `session_id` VARCHAR(55) NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }


        $sql = "
ALTER TABLE `usuarios` 
ADD `saldo` VARCHAR(20) NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
ALTER TABLE `paises` ADD `alias` VARCHAR(3) NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `paises` ADD `idioma_text` VARCHAR(3) NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `terminales` ADD `pais` INT NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `nc_config` ADD `maneja_iva` VARCHAR(2) NULL COMMENT 'selectBox,boolean';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `nc_config` ADD `iva` INT NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE  `nwmaker_codigo_oculto` ADD  `url_al_salir` VARCHAR(100) NULL COMMENT  'textField';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
                    ALTER TABLE `nwpconfig` ADD `url_json_manifest` VARCHAR(80) NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
                    ALTER TABLE `nwpconfig` ADD `theme_color` VARCHAR(50) NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
CREATE TABLE IF NOT EXISTS `nwmaker_policies_accept` (
  `id` int(20) NOT NULL AUTO_INCREMENT COMMENT 'textField,0,false',
  `usuario` varchar(100) DEFAULT NULL,
  `ip` varchar(100) DEFAULT NULL,
    `fecha` timestamp NULL DEFAULT NULL COMMENT 'date',
  `accept` varchar(10) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `noticias` CHANGE `Keywords` `Keywords` VARCHAR(200) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT 'textField';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `nwmaker_login` ADD `concurrencia` VARCHAR(2) NULL COMMENT 'selectBox,boolean';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
    ALTER TABLE `usuarios` ADD `id_session` VARCHAR(55) NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
    ALTER TABLE `usuarios` ADD `estado_conexion` VARCHAR(25) NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
    ALTER TABLE `pv_clientes` ADD `id_session` VARCHAR(55) NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
    ALTER TABLE `nwmaker_sessions` 
    ADD `fecha_ultima_conexion` TIMESTAMP NULL COMMENT  'dateField',
    ADD `dispositivo` VARCHAR(15) NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
CREATE TABLE IF NOT EXISTS `nwmaker_users_info_aditional` (
  `id` int(20) NOT NULL AUTO_INCREMENT COMMENT 'textField,0,false',
  `usuario` varchar(100) DEFAULT NULL,
  `type_register` varchar(20) DEFAULT NULL,
  `id_relation_user_extern` varchar(35) DEFAULT NULL,
    `fecha` timestamp NULL DEFAULT NULL COMMENT 'date',
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `nwmaker_login` ADD `fb_app_id` VARCHAR(35) NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
CREATE TABLE IF NOT EXISTS `nc_config` (
  `id` int(20) NOT NULL AUTO_INCREMENT COMMENT 'textField,0,false',
  `apikey` varchar(150) DEFAULT NULL,
  `apiLogin` varchar(150) DEFAULT NULL,
  `pagos_merchantId` varchar(25) DEFAULT NULL,
  `pagos_accountId` varchar(25) DEFAULT NULL,
  `pagos_pruebas` varchar(2) DEFAULT NULL,
  `valor_min_enviofree` varchar(50) DEFAULT NULL,
  `payu_sandbox` varchar(2) DEFAULT NULL,
  `solo_validar` varchar(2) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `paises` ADD `moneda` VARCHAR(5) NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
ALTER TABLE `nwmaker_login` ADD `permitir_registro_login_con_google` VARCHAR(2) NOT NULL DEFAULT 'NO' AFTER `fb_app_id`;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `nwmaker_login` ADD `google_api_key` VARCHAR(100) NULL DEFAULT NULL AFTER `permitir_registro_login_con_google`;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `nwmaker_login` ADD `google_cliente_id` TEXT NULL DEFAULT NULL AFTER `google_api_key`;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE  `nwmaker_codigo_oculto` ADD  `url_css_principal` VARCHAR(100) NULL ;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
ALTER TABLE  `nwmaker_login` ADD  `show_login_and_makeaccount` VARCHAR(2) NULL COMMENT 'selectBox,boolean';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `productos` CHANGE `nombre` `nombre` VARCHAR(100) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT 'textField';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `productos` CHANGE `descripcion` `descripcion` TEXT CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT 'ckeditor';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `galeria_noticias` CHANGE `contenido` `contenido` TEXT CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT 'ckeditor';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `galeria_noticias` ADD `fecha` TIMESTAMP NULL DEFAULT NULL AFTER `video_url`;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `productos_grupos` CHANGE `nombre` `nombre` VARCHAR(100) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT 'textField';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `nw_registro` CHANGE `query` `query` TEXT CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE  `nwmaker_login` ADD  `url_css_principal_login` VARCHAR(80) NULL ;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE  `nwmaker_login` ADD  `country_change_url` VARCHAR(2) NULL COMMENT 'selectBox,boolean';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
ALTER TABLE  `nwmaker_login` 
ADD  `pedir_confirmar_pass` CHAR( 2 ) NULL ,
ADD  `pedir_suscribirse` CHAR( 2 ) NULL ,
ADD  `pedir_suscribirse_texto` VARCHAR( 55 ) NULL ;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE  `nwmaker_login` 
ADD  `asunto_bienvenido_registro` VARCHAR( 55 ) NULL ,
ADD  `html_bienvenido_registro` TEXT NULL COMMENT  'ckeditor';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE  `nwmaker_login` 
ADD  `desti_nombre_bienvenido_registro` VARCHAR( 40 ) NULL ,
ADD  `desti_emailreply_bienvenido_registro` VARCHAR( 50 ) NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE  `nwmaker_login` 
ADD  `pedir_apellido` VARCHAR(2) NULL COMMENT  'selectBox,boolean';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE  `nwmaker_login` 
ADD  `type_input_forma_pago` VARCHAR(10) NULL COMMENT  'textField';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
CREATE TABLE IF NOT EXISTS `nwmaker_login_valores_formapago` (
  `id` int(20) NOT NULL AUTO_INCREMENT COMMENT 'textField,0,false',
  `usuario` varchar(150) DEFAULT NULL,
  `id_usuario` varchar(150) DEFAULT NULL,
  `id_forma_pago` int(20) NULL COMMENT  'selectBox,nc_formas_pago',
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
ALTER TABLE  `productos_config` 
ADD  `order_lists` VARCHAR(25) NULL COMMENT  'textField';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
ALTER TABLE `paises` ADD `imagen` VARCHAR(120) NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
ALTER TABLE `nwmaker_codigo_oculto` ADD `fondo_menu` VARCHAR(25) NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `nwmaker_codigo_oculto` ADD `color_links_menu` VARCHAR(25) NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `nwmaker_login` ADD `background_img_login` VARCHAR(85) NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `nwmaker_login` ADD `background_color_login` VARCHAR(25) NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
ALTER TABLE `nwmaker_codigo_oculto` ADD `activar_notificaciones` VARCHAR(2) NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
            ALTER TABLE `terminales` ADD `clave` VARCHAR(25) NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
   ALTER TABLE `usuarios` ADD `ver_chat` VARCHAR(2) NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
            ALTER TABLE `usuarios_empresas` ADD `perfil` INT NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE  `usuarios`
ADD  `fecha_ultima_conexion` TIMESTAMP NULL COMMENT  'dateField';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
CREATE TABLE IF NOT EXISTS `nwmaker_current_version` (
  `id` int(20) unsigned NOT NULL AUTO_INCREMENT COMMENT 'textField,0,false',
  `version` varchar(50) DEFAULT NULL,
  `usuario` varchar(30) DEFAULT NULL COMMENT 'textField,0,false',
  `fecha` date DEFAULT NULL COMMENT 'dateField',
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `pv_clientes` ADD `cambio_clave` CHAR(2) NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `pv_clientes` ADD `cambio_prox` DECIMAL(3,0) NULL DEFAULT NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `nwmaker_current_version` ADD `os` CHAR(10) NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
ALTER TABLE `usuarios` ADD `tipo_creacion` CHAR(10) NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `pv_clientes` ADD `tipo_creacion` CHAR(10) NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `nwmaker_perfiles` ADD `disponible_en_app` VARCHAR(2) NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `nwmaker_suscriptorsPush` ADD `device` VARCHAR(30) NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `nwmaker_sessions` ADD `device` VARCHAR(30) NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `nwmaker_suscriptorsPush` CHANGE `fecha` `fecha` TIMESTAMP NULL COMMENT 'textField';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
ALTER TABLE `nwmaker_notificaciones` ADD `send_email` CHAR(2) NULL COMMENT 'selectBox,booelan';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
ALTER TABLE `nwmaker_usuarios_log` CHANGE `estado` `estado` CHAR(15) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT 'textField';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
ALTER TABLE `usuarios` CHANGE `fecha_nacimiento` `fecha_nacimiento` DATE NULL COMMENT 'dateField';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
ALTER TABLE `nwmaker_notificaciones` CHANGE `id_objetivo` `id_objetivo` VARCHAR(55) NULL DEFAULT NULL COMMENT 'textField,0,false';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
ALTER TABLE `nwmaker_notificaciones` ADD `fecha_lectura` TIMESTAMP NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
ALTER TABLE `nwmaker_notificaciones` ADD `correo_usuario_recibe` VARCHAR(150) NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `nwmaker_notificaciones` ADD `fecha_final` TIMESTAMP NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `nwmaker_notificaciones` 
ADD `vencida_title` VARCHAR(80) NULL,
ADD `vencida_body` TEXT NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
ALTER TABLE `nwmaker_notificaciones` CHANGE `tipo_aviso_recordat` `tipo_aviso_recordat` CHAR(10) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT 'textField,0,false';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `nwmaker_notificaciones` 
CHANGE `leido` `leido` CHAR(2) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT 'textField,0,false', 
CHANGE `tipo` `tipo` CHAR(15) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT 'textField,0,false', 
CHANGE `modo_window` `modo_window` CHAR(10) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT 'textField,0,false', 
CHANGE `notificado` `notificado` CHAR(2) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT 'selectBox,boolean';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `usuarios` CHANGE `telefono` `telefono` DOUBLE NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
ALTER TABLE `nwmaker_notificaciones` ADD `email_is_sent` CHAR(2) NULL COMMENT 'selectBox,boolean';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
ALTER TABLE `nwmaker_notificaciones` ADD `date_email_is_sent` TIMESTAMP NULL DEFAULT NULL COMMENT 'dateField';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
ALTER TABLE `nw_modulos_grupos` ADD `mostrar_popup` CHAR(2) NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }


        $sql = "
ALTER TABLE `pv_clientes` ADD `empresa` INT NULL;
                ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
            ALTER TABLE `pv_clientes` ADD `ciudad_text` VARCHAR(80) NULL;
                ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
            ALTER TABLE `nc_config` ADD `observaciones` VARCHAR(150) NULL;
                ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

//        $sql = "
//            ALTER TABLE `menu` ADD INDEX(`nivel`);
//                ";
//        $ca->prepare($sql);
//        if (!$ca->exec()) {
//            master::logSystemError($ca->lastErrorText());
//        }
//        $sql = "
//            ALTER TABLE `modulos` ADD INDEX(`grupo`);
//                ";
//        $ca->prepare($sql);
//        if (!$ca->exec()) {
//            master::logSystemError($ca->lastErrorText());
//        }
//        $sql = "
//            ALTER TABLE `permisos` ADD INDEX(`perfil`);
//                ";
//        $ca->prepare($sql);
//        if (!$ca->exec()) {
//            master::logSystemError($ca->lastErrorText());
//        }
//        $sql = "
//            ALTER TABLE `permisos` ADD INDEX(`modulo`);
//                ";
//        $ca->prepare($sql);
//        if (!$ca->exec()) {
//            master::logSystemError($ca->lastErrorText());
//        }
//        $sql = "
//            ALTER TABLE `permisos` ADD INDEX(`pais`);
//                ";
//        $ca->prepare($sql);
//        if (!$ca->exec()) {
//            master::logSystemError($ca->lastErrorText());
//        }
//        $sql = "
//            ALTER TABLE `pv_clientes` ADD INDEX(`id`);
//                ";
//        $ca->prepare($sql);
//        if (!$ca->exec()) {
//            master::logSystemError($ca->lastErrorText());
//        }
//
//        $sql = "
//            ALTER TABLE `usuarios` ADD INDEX(`id`);
//                ";
//        $ca->prepare($sql);
//        if (!$ca->exec()) {
//            master::logSystemError($ca->lastErrorText());
//        }

        $sql = "
            ALTER TABLE `nwmaker_current_version` ADD `empresa` INT NULL, ADD `perfil` INT NULL;
                ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
           ALTER TABLE `usuarios` ADD `celular_validado` CHAR(2) NULL COMMENT 'selectBox,boolean';
                ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
            ALTER TABLE `pv_clientes` ADD `celular_validado` CHAR(2) NULL COMMENT 'selectBox,boolean';
                ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
            ALTER TABLE `nwmaker_resetpass` DROP `user`;
                ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
            ALTER TABLE `nwmaker_resetpass` ADD `usuario` VARCHAR(150) NULL;
                ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
           ALTER TABLE `nw_smtp` ADD `empresa` INT NULL;
                ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `nwmaker_tarjetascredito` 
ADD `documento` CHAR(40) NULL, 
ADD `nombre_tarjeta` VARCHAR(90) NULL, 
ADD `pais` CHAR(3) NULL, 
ADD `currency` CHAR(3) NULL, 
ADD `empresa` INT NULL, 
ADD `perfil` INT NULL;
                ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `nwmaker_tarjetascredito` ADD `pago_unico_mensual` CHAR(8) NULL;
                ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `nwmaker_tarjetascredito` ADD `status` CHAR(25) NULL;
                ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
CREATE TABLE IF NOT EXISTS `nwmaker_tarjetascredito_pagos` (
    `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'textField,0,false',
    `id_tarjeta` int(11) NOT NULL COMMENT 'selectBox,nwmaker_tarjetascredito',
  `correo` varchar(100) DEFAULT NULL COMMENT 'textField',
  `valor` varchar(100) DEFAULT NULL COMMENT 'textField',
  `fecha` timestamp  COMMENT 'textField',
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
ALTER TABLE `nwmaker_notificaciones` CHANGE `id_objetivo` `id_objetivo` VARCHAR(100) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT 'textField,0,false';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
ALTER TABLE `nwmaker_tarjetascredito` CHANGE `status` `status` VARCHAR(150) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `nwmaker_notificaciones` 
ADD `izquierda_nomostrar_despues_de` CHAR(10) NULL, 
ADD `inhabil_callback_despues_de` CHAR(10) NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
                      ALTER TABLE `pv_clientes` 
                      ADD `usuario_asesor_rainbow` VARCHAR(80) NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
                      ALTER TABLE `pv_clientes` 
                        ADD `usuario_cliente_rainbow` VARCHAR(80) NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
ALTER TABLE `nwmaker_notificaciones` 
ADD `fromName` VARCHAR(70) NULL, 
ADD `fromEmail` VARCHAR(70) NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `nwmaker_notificaciones` ADD `send_sms` CHAR(2) NULL DEFAULT 'NO';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `nwmaker_notificaciones` ADD `celular` VARCHAR(20) NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `nwmaker_notificaciones` ADD `sms_body` VARCHAR(200) NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `nwmaker_notificaciones` 
ADD `body_email` TEXT NULL,
ADD `asunto_email` VARCHAR(120) NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
ALTER TABLE `nwmaker_notificaciones` ADD `terminal` INT NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }


        $sql = "
CREATE TABLE IF NOT EXISTS `nwmaker_mantenimientos` (
  `id` int(20) unsigned NOT NULL AUTO_INCREMENT COMMENT 'textField,0,false',
  `usuario` varchar(50) DEFAULT NULL COMMENT 'textField,0,false',
  `empresa` int(11) DEFAULT NULL COMMENT 'textField,0,false',
  `terminal` int(11) DEFAULT NULL COMMENT 'textField,0,false',
  `fecha` date DEFAULT NULL COMMENT 'textField,0,false',
  `optimiza_tablas_nwmaker` char(2) DEFAULT NULL COMMENT 'selectBox,array',
  `optimiza_tablas_nwlib` char(2) DEFAULT NULL COMMENT 'selectBox,array',
  `clean_nwregistro` char(2) DEFAULT NULL COMMENT 'selectBox,array',
  `clean_usuarioslog` char(2) DEFAULT NULL COMMENT 'selectBox,array',
  `backupNotificaciones` char(2) DEFAULT NULL COMMENT 'selectBox,array',
  `tipo` char(15) DEFAULT NULL COMMENT 'textField',
  `ip` varchar(50) DEFAULT NULL COMMENT 'textField',
  `disp` text DEFAULT NULL COMMENT 'textField',
  `host` text DEFAULT NULL COMMENT 'textField',
  `envio_correo_aviso` text DEFAULT NULL COMMENT 'textField',
  `log_final` text DEFAULT NULL COMMENT 'textField',
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
CREATE TABLE IF NOT EXISTS `nwmaker_notificaciones_backup` (
   `id` int(20) unsigned NOT NULL AUTO_INCREMENT COMMENT 'textField,0,false',
   `id_real` int(11) NOT NULL COMMENT 'textField',
  `usuario_recibe` varchar(100) DEFAULT NULL COMMENT 'textField',
  `usuario_envia` varchar(100) DEFAULT NULL COMMENT 'textField',
  `leido` char(2) DEFAULT NULL COMMENT 'textField,0,false',
  `tipo` char(15) DEFAULT NULL COMMENT 'textField,0,false',
  `fecha_envio` timestamp NULL DEFAULT NULL COMMENT 'dateTimeField',
  `mensaje` text COMMENT 'textArea',
  `tipo_aviso_recordat` char(10) DEFAULT NULL COMMENT 'textField,0,false',
  `link` text COMMENT 'textField',
  `modo_window` char(10) DEFAULT NULL COMMENT 'textField,0,false',
  `id_objetivo` varchar(100) DEFAULT NULL COMMENT 'textField,0,false',
  `title` varchar(70) DEFAULT NULL,
  `icon` varchar(70) DEFAULT NULL,
  `notificado` char(2) DEFAULT NULL COMMENT 'selectBox,boolean',
  `fecha_aviso_recordat` timestamp NULL DEFAULT NULL COMMENT 'textField,0,false',
  `callback` varchar(200) DEFAULT NULL,
  `send_email` char(2) DEFAULT NULL COMMENT 'selectBox,booelan',
  `fecha_lectura` timestamp NULL DEFAULT NULL,
  `correo_usuario_recibe` varchar(150) DEFAULT NULL,
  `fecha_final` timestamp NULL DEFAULT NULL,
  `vencida_title` varchar(80) DEFAULT NULL,
  `vencida_body` text,
  `email_is_sent` char(2) DEFAULT NULL COMMENT 'selectBox,boolean',
  `date_email_is_sent` timestamp NULL DEFAULT NULL COMMENT 'dateField',
  `izquierda_nomostrar_despues_de` char(10) DEFAULT NULL,
  `inhabil_callback_despues_de` char(10) DEFAULT NULL,
  `fromName` varchar(70) DEFAULT NULL,
  `fromEmail` varchar(70) DEFAULT NULL,
  `send_sms` char(2) DEFAULT 'NO',
  `celular` varchar(20) DEFAULT NULL,
  `sms_body` varchar(200) DEFAULT NULL,
  `body_email` text,
  `asunto_email` varchar(120) DEFAULT NULL,
  `terminal` int(11) DEFAULT NULL,
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
ALTER TABLE `usuarios` CHANGE `dispositivo` `dispositivo` VARCHAR(100) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `pv_clientes` CHANGE `dispositivo` `dispositivo` VARCHAR(100) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `usuarios` ADD `ip` VARCHAR(50) NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `pv_clientes` ADD `ip` VARCHAR(50) NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
CREATE TABLE IF NOT EXISTS `nwmaker_users_login_linetime` (
  `id` int(20) unsigned NOT NULL AUTO_INCREMENT COMMENT 'textField,0,false',
  `usuario` varchar(50) DEFAULT NULL COMMENT 'textField,0,false',
  `empresa` int(11) DEFAULT NULL COMMENT 'textField,0,false',
  `terminal` int(11) DEFAULT NULL COMMENT 'textField,0,false',
  `fecha` date DEFAULT NULL COMMENT 'textField,0,false',
  `tipo` char(10) DEFAULT NULL COMMENT 'textField',
  `ip` varchar(50) DEFAULT NULL COMMENT 'textField',
  `dispositivo` varchar(100) DEFAULT NULL COMMENT 'textField',
  `host` text DEFAULT NULL COMMENT 'textField',
  `ciudad` text DEFAULT NULL COMMENT 'textField',
  `pais` text DEFAULT NULL COMMENT 'textField',
  `latitud` text DEFAULT NULL COMMENT 'textField',
  `longitud` text DEFAULT NULL COMMENT 'textField',
  `timezone` text DEFAULT NULL COMMENT 'textField',
  `obs` text DEFAULT NULL COMMENT 'textField',
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `usuarios` 
ADD `ciudad_ultimo_login` VARCHAR(35) NULL, 
ADD `pais_ultimo_login` VARCHAR(35) NULL, 
ADD `latitud_ultimo_login` VARCHAR(45) NULL, 
ADD `longitud_ultimo_login` VARCHAR(45) NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `pv_clientes` 
ADD `ciudad_ultimo_login` VARCHAR(35) NULL, 
ADD `pais_ultimo_login` VARCHAR(35) NULL, 
ADD `latitud_ultimo_login` VARCHAR(45) NULL, 
ADD `longitud_ultimo_login` VARCHAR(45) NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }



        $sql = "
ALTER TABLE `nwmaker_videollamadas` ADD `observaciones` TEXT NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `nwmaker_videollamadas` ADD `nombre` VARCHAR(100) NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `nwmaker_videollamadas` ADD `empresa` INT NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `nwmaker_videollamadas` ADD `fecha_caducidad` TIMESTAMP NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `nwmaker_videollamadas` ADD `link_usuario_recibe` TEXT NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `nwmaker_videollamadas` ADD `link_usuario` TEXT NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `nwmaker_notificaciones` ADD `solo_campana` CHAR(2) NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `nwmaker_notificaciones` CHANGE `callback` `callback` VARCHAR(300) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `nwmaker_notificaciones_backup` CHANGE `callback` `callback` VARCHAR(300) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `nwmaker_notificaciones` ADD `sms_date_is_sent` TIMESTAMP NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `nwmaker_notificaciones` ADD `notify_open` CHAR(2) NULL DEFAULT 'NO';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `nwmaker_suscriptorsPush` 
ADD `empresa` INT NULL, 
ADD `perfil` INT NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `nwmaker_suscriptorsPush` CHANGE `device` `device` VARCHAR(100) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `nwmaker_suscriptorsPush`
  DROP `endpoint`,
  DROP `userPublicKey`,
  DROP `userAuthToken`;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }



        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `usuarios` ADD `extension_pbx` CHAR(11) NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `pv_clientes` ADD `extension_pbx` CHAR(11) NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `pv_clientes` ADD `sala_text` VARCHAR(60) NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `usuarios` ADD `sala_text` VARCHAR(60) NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }



        $sql = "
ALTER TABLE `paises` ADD `zona_horaria` CHAR(40) NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }


        $sql = "
ALTER TABLE `usuarios` ADD `session_id` VARCHAR(50) NULL;
";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `usuarios` ADD `modificado_por` VARCHAR(100) NULL DEFAULT NULL;
";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
ALTER TABLE `usuarios` ADD `genero` CHAR(20) NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
CREATE TABLE `nwmaker_plantillas_correos` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT 'textField,0,false',
  `fecha` timestamp NULL DEFAULT NULL COMMENT 'textField,0,false',
  `tipo` varchar(100) DEFAULT NULL COMMENT 'textField,0,true',
  `asunto` varchar(120) DEFAULT NULL,
  `cuerpo_mensaje` text COMMENT 'ckeditor,0,true,true,false,Cuerpo',
  `enviado_por_correo` varchar(100) DEFAULT NULL,
  `enviado_por_nombre` varchar(100) DEFAULT NULL,
  `activo` char(2) DEFAULT NULL COMMENT 'selectBox,boolean',
  `empresa` int(11) DEFAULT NULL COMMENT 'textField,0,false',
  `usuario` varchar(100) DEFAULT NULL COMMENT 'textField,0,false',
  `terminal` int(11) DEFAULT NULL COMMENT 'textField,0,false',
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
ALTER TABLE `nc_config` ADD `terminal` INT NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }


        $sql = "
           ALTER TABLE `perfiles` ADD `tipo` CHAR(25) NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
            ALTER TABLE `nc_config` ADD `activo` CHAR(2) NULL;
            ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "ALTER TABLE `usuarios` ADD `offline` VARCHAR(2) NOT NULL AFTER `modificado_por`;";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
                ALTER TABLE `nw_init_settings` ADD `codigo_css_dashboard` TEXT NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
                ALTER TABLE `nw_init_settings` ADD `codigo_js_dashboard` TEXT NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
                ALTER TABLE `empresas` ADD `pais` INT NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
                ALTER TABLE `nw_registro` ADD `host` VARCHAR(80) NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
                ALTER TABLE `paises` ADD `unicode_emoji_characters_flags` CHAR(40) NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }


        $sql = "
ALTER TABLE `nw_init_settings` ADD `web` VARCHAR(80) NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
                ALTER TABLE `perfiles` ADD `tipo` CHAR(10) NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
                ALTER TABLE usuarios_log add column session_id varchar(200) NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
CREATE TABLE IF NOT EXISTS `nc_translate_keys` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT 'textField,0,false',
  `apiKey` TEXT DEFAULT NULL,
  `estado` varchar(50) DEFAULT NULL,
  `comentarios` TEXT DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=1;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
INSERT INTO `nc_translate_keys` 
(`id`, `apiKey`, `estado`, `comentarios`) 
VALUES 
(1, 'AIzaSyB61YikB30yCYNFKTQPbYLvps9LsX_yGwk', 'ACTIVO', 'new desarrollonw@gmail.com credit card Libia 12abr2022');
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
            ALTER TABLE `usuarios` CHANGE `offline` `offline` VARCHAR(2) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `nw_init_settings` ADD `nwads` CHAR(2) NULL AFTER `web`, ADD `busca_version` CHAR(2) NULL AFTER `nwads`;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `pv_clientes` ADD `version_in_this_device` VARCHAR(20) NULL, 
ADD `version` VARCHAR(30) NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
ALTER TABLE `usuarios` 
ADD `version_in_this_device` VARCHAR(20) NULL, 
ADD `version` VARCHAR(30) NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `pv_clientes` ADD `token` VARCHAR(200) NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `pv_clientes` ADD `sistema_operativo` CHAR(50) NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `usuarios` ADD `token` VARCHAR(200) NULL, 
ADD `sistema_operativo` CHAR(50) NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `pv_clientes` CHANGE `version_in_this_device` `version_in_this_device` VARCHAR(50) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `usuarios` CHANGE `version_in_this_device` `version_in_this_device` VARCHAR(50) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `empresas` 
ADD `ticket_id_customer` INT NULL  DEFAULT '121',
ADD `ticket_name_customer` VARCHAR(100) NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `empresas` CHANGE `ticket_id_customer` `ticket_id_customer` INT NULL DEFAULT '121', 
CHANGE `ticket_name_customer` `ticket_name_customer` VARCHAR(100) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT 'GRUPO NW S.A.S.';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `pv_clientes` 
ADD `token_actual_app` VARCHAR(200) NULL, 
ADD `token_actual_app_fecha` TIMESTAMP NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `empresas` ADD `idioma_por_defecto` CHAR(3) NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
CREATE TABLE `nwmaker_traducciones` (
  `id` int NOT NULL COMMENT 'textField,0,false',
  `textos` text NOT NULL COMMENT 'textArea',
  `idioma` char(3) DEFAULT NULL COMMENT 'textField',
  `empresa` int DEFAULT NULL COMMENT 'selectBox,empresas',
  `activo` char(2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `nwmaker_traducciones`
  ADD PRIMARY KEY (`id`);
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `nwmaker_traducciones`
  MODIFY `id` int NOT NULL AUTO_INCREMENT COMMENT 'textField,0,false';
COMMIT;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
CREATE TABLE `nw_params` (
  `id` int NOT NULL COMMENT 'textField,0,false',
  `empresa` int DEFAULT NULL COMMENT 'selectBox,empresas',
  `clave` char(50) DEFAULT NULL COMMENT 'textField',
  `valor` char(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `nw_cmi_enc` 
ADD `query` TEXT NULL, 
ADD `rotulos_fila` TEXT NULL, 
ADD `rotulos_columna` TEXT NULL, 
ADD `valores` TEXT NULL, 
ADD `filtros` VARCHAR(100) NULL, 
ADD `tipo_grafico` VARCHAR(30) NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `nw_cmi_enc` 
ADD `privado` CHAR(5) NULL, 
ADD `perfiles` TEXT NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `nw_cmi_det` 
ADD `enc` INT NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "ALTER TABLE `nw_cmi_enc` ADD COLUMN `privado` BOOLEAN NULL AFTER `empresa`;";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
            ALTER TABLE `nw_notifications_enc` ADD `fecha_final` DATE NULL;
                ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `nw_notifications_users` CHANGE `id` `id` INT NOT NULL AUTO_INCREMENT COMMENT 'textField,0,false';
                ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `secciones` ADD COLUMN `alto` INT NULL DEFAULT NULL AFTER `clase_dom`;

                ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        
                     $sql = "
ALTER TABLE `nwmaker_current_version` ADD `route_release` CHAR(60) NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
                  $sql = "
                 ALTER TABLE `nwmaker_current_version` ADD `domain_rpc` CHAR(45) NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        master::logSystemError("FINISH UPDATE DATABASE NWPROJECT 2021 ok");
    }

}
