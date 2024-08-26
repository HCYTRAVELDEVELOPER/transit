<?php

class ringow_updater {

    public static function start($p) {
        session::check();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $ca->setPregMatchDuplicate(false);
//        $sql = "";
//        $ca->prepare($sql);
//        if (!$ca->exec()) {
//            master::logSystemError($ca->lastErrorText());
//        }
     ///////////**********************************************ENDMOVILMOVE*************************///////////////////////////////////////////////////////
//            if (isset($_SESSION["app_name"]) && $_SESSION["app_name"] === "ringow") {
///////////**********************************************STARRINGOW*************************///////////////////////////////////////////////////////
        $sql = "
CREATE TABLE sop_calificaciones (
    id int(11) NOT NULL AUTO_INCREMENT,
    id_visitante int(11),
    terminal int(11),
    asesor varchar(150),
    fecha date,
    calificacion int(11),
    ip varchar(150),
     PRIMARY KEY (id)
)ENGINE=InnoDB CHARSET=latin1;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
CREATE TABLE sop_chat (
    id int(11) NOT NULL AUTO_INCREMENT,
    visitante int(11),
    texto text,
    leido int(11),
    usuario varchar(150),
    fecha DATETIME,
    empresa int(11),
    terminal int(11),
    tipo_user varchar(20),
    ip varchar(100),
    nombre_operador varchar(150),
    foto_usuario varchar(150),
    status varchar(20),
     PRIMARY KEY (id)
)ENGINE=InnoDB CHARSET=latin1;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
CREATE TABLE sop_config (
    id int(11) NOT NULL AUTO_INCREMENT,
    texto_bienvenida text,
    img_online text,
    img_offline text,
    banner text,
    usuario varchar(150),
    terminal int(11),
    empresa int(11),
    actualizado varchar(2),
    texto_registro text,
    mensaje_buscando_op text,
    mensaje_ingresa_operador text,
    mensaje_vuelve_operador text,
     PRIMARY KEY (id)
)ENGINE=InnoDB CHARSET=latin1;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
CREATE TABLE sop_operadores (
    id int(11) NOT NULL AUTO_INCREMENT,
    usuario text,
    fecha DATETIME,
    estado varchar(20),
    empresa int(11),
    terminal int(11),
    nombre varchar(200),
     PRIMARY KEY (id)
)ENGINE=InnoDB CHARSET=latin1;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
CREATE TABLE sop_visitantes (
    id int(11) NOT NULL AUTO_INCREMENT,
    nombre varchar(100),
    correo varchar(100),
    ip varchar(100),
    host varchar(200),
    estado varchar(50) DEFAULT 'CONECTADO',
    atiende varchar(150),
    fecha DATETIME,
    usuario varchar(150),
    empresa varchar(100),
    url text,
    navegador varchar(50),
    terminal int(11),
    pais varchar(200),
    ciudad varchar(200),
    latitud varchar(50),
    longitud varchar(50),
    visita int(11) DEFAULT 1,
    device varchar(150),
     PRIMARY KEY (id)
)ENGINE=InnoDB CHARSET=latin1;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
CREATE TABLE sop_visitas (
    id int(11) NOT NULL AUTO_INCREMENT,
    id_visitante int(11),
    url varchar(200),
    ip varchar(100),
    terminal int(11),
    fecha DATETIME,
    visitas int(11),
     PRIMARY KEY (id)
)ENGINE=InnoDB CHARSET=latin1;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE  `sop_config` ADD  `activo` VARCHAR( 2 ) NULL COMMENT  'selectBox,array';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
            ALTER TABLE  `sop_config` ADD  `codigo_oculto` TEXT NULL ;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
            ALTER TABLE  `sop_config`
            ADD  `registro_usar_nombre` VARCHAR( 2 ) NULL COMMENT  'selectBox,boolean',
ADD  `registro_usar_email` VARCHAR( 2 ) NULL COMMENT  'selectBox,boolean',
ADD  `registro_usar_celular` VARCHAR( 2 ) NULL COMMENT  'selectBox,boolean';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
            ALTER TABLE  `sop_visitantes` ADD  `celular` VARCHAR( 15 ) NULL COMMENT  'textField';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
            ALTER TABLE  `sop_config`
            ADD  `requiere_redireccion_a_seccion` VARCHAR( 2 ) NULL COMMENT  'selectBox,boolean',
ADD  `foto_autorespondedor` VARCHAR( 80 ) NULL COMMENT  'uploader',
ADD  `mobile_img_online` VARCHAR( 80 ) NULL COMMENT  'uploader',
ADD  `mobile_img_offline` VARCHAR( 80 ) NULL COMMENT  'uploader';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
CREATE TABLE IF NOT EXISTS `sop_secciones` (
    `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'textField,0,false',
  `nombre` VARCHAR(50) DEFAULT NULL COMMENT 'textField',
  `descripcion` TEXT DEFAULT NULL COMMENT 'textArea',
  `imagen` varchar(100) DEFAULT NULL COMMENT 'uploader',
  `activo` varchar(2) DEFAULT NULL COMMENT 'selectBox,boolean',
  `usuario` varchar(100) DEFAULT NULL COMMENT 'textField,0,false',
  `redirecciona_al_chat` varchar(2) DEFAULT NULL COMMENT 'selectBox,boolean',
  `redirecciona_al_mostrar_info` varchar(2) DEFAULT NULL COMMENT 'selectBox,boolean',
  `texto_redireccion_info` TEXT DEFAULT NULL COMMENT 'ckeditor',
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
 ALTER TABLE sop_secciones COMMENT ' [
   {
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
ALTER TABLE  `sop_config`
ADD  `foto_perfil_generica_agentes` VARCHAR( 120 ) NULL COMMENT  'uploader';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE  `sop_visitantes` ADD  `sala` INT NULL ;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE  `sop_visitantes` ADD  `sala_text` VARCHAR(80) NULL ;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE  `usuarios` ADD  `sala` INT NULL ;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE  `sop_visitantes`
ADD  `fecha_ultima_interaccion_operador` TIMESTAMP NULL COMMENT  'dateField',
ADD  `fecha_ultima_interaccion_cliente` TIMESTAMP NULL COMMENT  'dateField';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
CREATE TABLE IF NOT EXISTS `sop_adjuntos` (
    `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'textField,0,false',
  `nombre` varchar(100) DEFAULT NULL COMMENT 'textField',
  `visitante` int DEFAULT NULL COMMENT 'textField',
  `fecha` date DEFAULT NULL COMMENT 'textField,0,false',
  `empresa` INT DEFAULT NULL COMMENT 'textField,0,false',
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
CREATE TABLE IF NOT EXISTS `sop_plantillas` (
    `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'textField,0,false',
  `nombre` varchar(100) DEFAULT NULL COMMENT 'textField',
  `pregunta` varchar(100) DEFAULT NULL COMMENT 'textField',
  `respuesta` varchar(100) DEFAULT NULL COMMENT 'textField',
  `fecha` date DEFAULT NULL COMMENT 'textField,0,false',
  `empresa` INT DEFAULT NULL COMMENT 'textField,0,false',
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
CREATE TABLE IF NOT EXISTS `sop_mensajes` (
    `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'textField,0,false',
      `nombre` varchar(100) DEFAULT NULL COMMENT 'textField',
      `correo` varchar(100) DEFAULT NULL COMMENT 'textField',
      `celular` varchar(100) DEFAULT NULL COMMENT 'textField',
   `fecha` TIMESTAMP COMMENT 'dateField',
  `mensaje` TEXT DEFAULT NULL COMMENT 'textField',
  `terminal` INT DEFAULT NULL COMMENT 'textField,0,false',
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE  `sop_config` ADD  `distribuir_llamadas` VARCHAR( 20 ) NULL COMMENT  'selectBox,array';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
ALTER TABLE  `sop_config` ADD  `maxima_llamadas_agente` int( 11 ) NULL COMMENT  'textField';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
    ALTER TABLE  `sop_mensajes` CHANGE  `fecha`  `fecha` TIMESTAMP NULL DEFAULT NULL COMMENT  'dateField';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
            ALTER TABLE `sop_visitantes` ADD COLUMN `departamento` VARCHAR(150) NULL AFTER `sala_text`;
            ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
                      ALTER TABLE `usuarios` 
                      ADD `usuario_asesor_rainbow` VARCHAR(80) NULL, 
                      ADD `usuario_cliente_rainbow` VARCHAR(80) NULL, 
                      ADD `estado_canal_rainbow` CHAR(10) NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
                      ALTER TABLE `usuarios` 
                      ADD `usuario_invitado1_rainbow` VARCHAR(80) NULL, 
                      ADD `usuario_invitado2_rainbow` VARCHAR(80) NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
                 ALTER TABLE `sop_restricciones` CHANGE `terminal` `terminal` INT(11) NULL DEFAULT NULL COMMENT 'textField,0,false';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
                ALTER TABLE `sop_restricciones` CHANGE `terminal` `terminal` INT(11) NOT NULL COMMENT 'textField,0,false';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
                    ALTER TABLE `sop_plantillas_correos` 
                    ADD `cuerpo_notificacion_interna` TEXT NULL COMMENT 'textArea', 
                    ADD `titulo_notificacion_interna` VARCHAR(120) NULL COMMENT 'textField';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE  `sop_plantillas` DROP  `pregunta` ,
DROP  `respuesta` ;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
            ALTER TABLE  `sop_plantillas` ADD  `texto` TEXT NULL COMMENT  'textArea';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
            ALTER TABLE  `sop_visitantes` ADD  `tipo` VARCHAR( 20 ) NULL ;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
            ALTER TABLE  `sop_visitantes` ADD  `userscallintern` VARCHAR( 250 ) NULL ;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
            ALTER TABLE  `sop_visitantes` ADD  `userscallintern_d` VARCHAR( 250 ) NULL ;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
            ALTER TABLE  `sop_chat` ADD  `num_envio` VARCHAR( 15 ) NULL COMMENT  'textField';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE  `sop_chat` ADD  `dispositivo` VARCHAR( 20 ) NULL ;
                    ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE  `sop_config` ADD  `info_site` VARCHAR( 200 ) NULL ;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
CREATE TABLE IF NOT EXISTS `sop_destinatarios_contact` (
    `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'textField,0,false',
  `usuario` varchar(80) DEFAULT NULL COMMENT 'textField,0,false',
  `correo` varchar(150) DEFAULT NULL COMMENT 'textField',
  `terminal` int(11) DEFAULT NULL COMMENT 'textField,0,false',
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
            ALTER TABLE  `sop_visitantes` ADD  `id_session` VARCHAR( 50 ) NULL ;
            ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
CREATE TABLE IF NOT EXISTS `sop_clientes` (
    `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'textField,0,false',
  `nombre` varchar(100) DEFAULT NULL COMMENT 'textField',
  `correo` varchar(100) DEFAULT NULL COMMENT 'textField',
  `celular` varchar(100) DEFAULT NULL COMMENT 'textField',
  `tipo` varchar(15) DEFAULT NULL COMMENT 'textField',
  `fecha` timestamp  COMMENT 'textField',
     `terminal` int(11) NULL COMMENT 'textField,0,false',
     `last_call` int(11) NULL COMMENT 'textField',
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
            ALTER TABLE `sop_config` 
            ADD `usar_chat` VARCHAR(2) NULL AFTER `info_site`, 
            ADD `videollamada` VARCHAR(2) NULL AFTER `usar_chat`, 
            ADD `llamadavoz` VARCHAR(2) NULL AFTER `videollamada`, 
            ADD `datoscontacto` VARCHAR(2) NULL AFTER `llamadavoz`, 
            ADD `formContacto` VARCHAR(2) NULL AFTER `datoscontacto`;
                ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
CREATE TABLE IF NOT EXISTS `sop_chat_backup` (
  `id` int(11) NOT NULL,
  `visitante` int(11) DEFAULT NULL,
  `texto` text,
  `leido` int(11) DEFAULT NULL,
  `usuario` varchar(150) DEFAULT NULL,
  `fecha` datetime DEFAULT NULL,
  `empresa` int(11) DEFAULT NULL,
  `terminal` int(11) DEFAULT NULL,
  `tipo_user` varchar(20) DEFAULT NULL,
  `ip` varchar(100) DEFAULT NULL,
  `nombre_operador` varchar(150) DEFAULT NULL,
  `foto_usuario` varchar(150) DEFAULT NULL,
  `status` varchar(20) DEFAULT NULL,
  `num_envio` varchar(15) DEFAULT NULL COMMENT 'textField',
  `dispositivo` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
                ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `sop_chat_backup`
  ADD PRIMARY KEY (`id`);
                ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `sop_chat_backup`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
                ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
CREATE TABLE IF NOT EXISTS `sop_visitantes_backup` (
  `id` int(11) NOT NULL,
  `nombre` varchar(100) DEFAULT NULL,
  `correo` varchar(100) DEFAULT NULL,
  `ip` varchar(100) DEFAULT NULL,
  `host` varchar(200) DEFAULT NULL,
  `estado` varchar(50) DEFAULT 'CONECTADO',
  `atiende` varchar(150) DEFAULT NULL,
  `fecha` datetime DEFAULT NULL,
  `usuario` varchar(150) DEFAULT NULL,
  `empresa` varchar(100) DEFAULT NULL,
  `url` text,
  `navegador` varchar(50) DEFAULT NULL,
  `terminal` int(11) DEFAULT NULL,
  `pais` varchar(200) DEFAULT NULL,
  `ciudad` varchar(200) DEFAULT NULL,
  `latitud` varchar(50) DEFAULT NULL,
  `longitud` varchar(50) DEFAULT NULL,
  `visita` int(11) DEFAULT '1',
  `device` varchar(150) DEFAULT NULL,
  `celular` varchar(15) DEFAULT NULL COMMENT 'textField',
  `sala` int(11) DEFAULT NULL,
  `sala_text` varchar(80) DEFAULT NULL,
  `departamento` varchar(150) DEFAULT NULL,
  `fecha_ultima_interaccion_operador` timestamp NULL DEFAULT NULL COMMENT 'dateField',
  `fecha_ultima_interaccion_cliente` timestamp NULL DEFAULT NULL COMMENT 'dateField',
  `tipo` varchar(20) DEFAULT NULL,
  `userscallintern` varchar(250) DEFAULT NULL,
  `userscallintern_d` varchar(250) DEFAULT NULL,
  `id_session` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
                ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `sop_visitantes_backup`
  ADD PRIMARY KEY (`id`);
                ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `sop_visitantes_backup`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
                ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `sop_visitantes` 
ADD `id_visita_real` INT NULL;
                ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `sop_visitantes_backup` 
ADD `id_visita_real` INT NULL;
                ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `terminales` CHANGE `usuario` `usuario` VARCHAR(150) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT 'textField,0,false';
                ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
            ALTER TABLE `sop_visitantes` 
            ADD `mensaje_al_visitante` VARCHAR(150) NULL, 
            ADD `mensaje_al_visitante_visto` VARCHAR(2) NULL;
                ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `sop_visitantes` ADD `mensaje_al_visitante_click` VARCHAR(2) NULL;
                ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `sop_visitas` ADD `id_session` VARCHAR(50) NULL;
                ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `sop_visitas` 
ADD `domain` VARCHAR(80) NULL,
ADD `pais` VARCHAR(80) NULL, 
ADD `ciudad` VARCHAR(100) NULL, 
ADD `device` VARCHAR(50) NULL, 
ADD `navegador` VARCHAR(200) NULL,
ADD `os` VARCHAR(15) NULL,
ADD `os_v` VARCHAR(25) NULL,
ADD `mobile` VARCHAR(60) NULL;
                ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `sop_config` 
ADD `visitas_tiempo_real` VARCHAR(2) NULL, 
ADD `enviar_mensaje_visitante` VARCHAR(2) NULL;
                ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `sop_visitantes` ADD `mensaje_al_visitante_closed` VARCHAR(2) NULL COMMENT 'selectBox,boolean';
                ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `sop_secciones` 
ADD `cuales_dominios_separados_por_coma` TEXT NULL COMMENT 'textArea';
                ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `sop_clientes` ADD `sala` INT NULL COMMENT 'selectBox,sop_secciones';
                ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `sop_mensajes` 
ADD `sala` INT NULL COMMENT 'selectBox,sop_secciones', 
ADD `origen` VARCHAR(40) NULL COMMENT 'textField';
                ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `sop_mensajes` 
ADD `domain` VARCHAR(80) NULL, 
ADD `url` VARCHAR(200) NULL;
                ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `sop_destinatarios_contact` 
ADD `sala` INT NULL COMMENT 'selectBox,sop_secciones';
                ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `sop_chat` ADD `id_session` VARCHAR(50) NULL;
                ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `sop_chat` CHANGE `id_session` `id_session` VARCHAR(200) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL;
                ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `sop_visitantes` CHANGE `id_session` `id_session` VARCHAR(200) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL;
                ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `sop_visitas` CHANGE `id_session` `id_session` VARCHAR(200) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL;
                ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `sop_visitantes_backup` CHANGE `id_session` `id_session` VARCHAR(200) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL;
                ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `sop_visitas` ADD `empresa` INT NULL COMMENT 'textField,0,false';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
              ALTER TABLE `sop_clientes` ADD `empresa` INT NULL COMMENT 'textField,0,false';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
//        $sql = "
//          ALTER TABLE `sop_visitantes` ADD INDEX(`id`);
//";
//        $ca->prepare($sql);
//        if (!$ca->exec()) {
//            master::logSystemError($ca->lastErrorText());
//        }
//        $sql = "
//            ALTER TABLE `sop_visitantes` ADD INDEX(`id_session`);
//";
//        $ca->prepare($sql);
//        if (!$ca->exec()) {
//            master::logSystemError($ca->lastErrorText());
//        }
//        $sql = "
//            ALTER TABLE `sop_chat` ADD INDEX(`id`);
//";
//        $ca->prepare($sql);
//        if (!$ca->exec()) {
//            master::logSystemError($ca->lastErrorText());
//        }
//        $sql = "
//     ALTER TABLE `sop_chat` ADD INDEX(`visitante`);
//";
//        $ca->prepare($sql);
//        if (!$ca->exec()) {
//            master::logSystemError($ca->lastErrorText());
//        }
//        $sql = "
//       ALTER TABLE `sop_chat` ADD INDEX(`id_session`);
//";
//        $ca->prepare($sql);
//        if (!$ca->exec()) {
//            master::logSystemError($ca->lastErrorText());
//        }
        $sql = "
ALTER TABLE `sop_visitantes` 
ADD `date_last_message` TIMESTAMP NULL COMMENT 'dateField',
ADD `last_message` VARCHAR(80) NULL;
";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE  `sop_chat` CHANGE  `leido`  `leido` VARCHAR( 2 ) NULL DEFAULT NULL ;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `sop_chat` ADD `usuario_recibe` VARCHAR(100) NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `sop_visitantes` ADD `is_webrtc` VARCHAR(2) NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `sop_config` 
ADD `usar_bot` VARCHAR(2) NULL,
ADD `abrir_chat_automaticamente` VARCHAR(2) NULL,
ADD `tiempo_abrir_chat_auto` VARCHAR(25) NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `sop_visitantes` CHANGE `last_message` `last_message` TEXT CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `sop_visitantes` CHANGE `mensaje_al_visitante` `mensaje_al_visitante` TEXT CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `sop_chat_backup` CHANGE `leido` `leido` VARCHAR(2) NULL DEFAULT NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `sop_config` 
ADD `color_principal` VARCHAR(15) NULL, 
ADD `background_image` VARCHAR(75) NULL ,
ADD `position` VARCHAR(15) NULL , 
ADD `sizes` VARCHAR(15) NULL , 
ADD `pregunta_programar_videocall` VARCHAR(2) NULL , 
ADD `bot_saludo` VARCHAR(80) NULL , 
ADD `bot_pedir_nombre` VARCHAR(80) NULL , 
ADD `bot_pedir_celular` VARCHAR(80) NULL, 
ADD `bot_pedir_correo` VARCHAR(80) NULL, 
ADD `bot_esperando_agente` VARCHAR(80) NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `sop_config` ADD `bot_pedir_celular_y_correo` VARCHAR(80) NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `sop_config` ADD `bot_nombre` VARCHAR(45) NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `sop_mensajes` CHANGE `origen` `origen` VARCHAR(100) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT 'textField';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "CREATE TABLE IF NOT EXISTS `sop_sequence` (`number` varchar(100) DEFAULT NULL) ENGINE=InnoDB  DEFAULT CHARSET=latin1 ;";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $ca->clear();
        $ca->prepareSelect("sop_sequence", "number", " 1=1");
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        if ($ca->size() === 0) {
            $ca->prepareInsert("sop_sequence", "number");
            $ca->bindValue(":number", "1");
            if (!$ca->exec()) {
                master::logSystemError($ca->lastErrorText());
            }
        }
        $ca->clear();

        $sql = "
CREATE TABLE IF NOT EXISTS `sop_records_stream` (
  `id` int(20) unsigned NOT NULL AUTO_INCREMENT COMMENT 'textField,0,false',
  `id_enc` int(11) DEFAULT NULL,
  `file` varchar(100) DEFAULT NULL,
  `usuario` varchar(90) DEFAULT NULL COMMENT 'textField,0,false',
  `usuario_recibe` varchar(90) DEFAULT NULL COMMENT 'textField,0,false',
  `terminal` int(11) DEFAULT NULL COMMENT 'selectBox,nw_modulos_grupos',
  `tipo` varchar(10) DEFAULT NULL COMMENT 'selectBox,nw_modulos_grupos',
    `fecha` timestamp COMMENT 'dateField',
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `sop_visitantes` 
ADD `tiempo` VARCHAR(5) NULL, 
ADD `audio_final` VARCHAR(80) NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `sop_visitantes_backup` 
ADD `tiempo` VARCHAR(5) NULL, 
ADD `audio_final` VARCHAR(80) NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `sop_visitantes_backup` 
ADD `num_llamadas_videocall` VARCHAR(2) NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `sop_visitantes` 
ADD `num_llamadas_videocall` VARCHAR(2) NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE sop_config CONVERT TO CHARACTER SET utf8;
ALTER TABLE sop_chat CONVERT TO CHARACTER SET utf8;
ALTER TABLE sop_chat_backup CONVERT TO CHARACTER SET utf8;
ALTER TABLE sop_visitantes CONVERT TO CHARACTER SET utf8;
ALTER TABLE sop_visitantes_backup CONVERT TO CHARACTER SET utf8;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `sop_visitantes` 
CHANGE `userscallintern` `userscallintern` TEXT CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL, 
CHANGE `userscallintern_d` `userscallintern_d` TEXT CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `sop_visitantes_backup` 
CHANGE `userscallintern` `userscallintern` TEXT CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL, 
CHANGE `userscallintern_d` `userscallintern_d` TEXT CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `sop_chat` 
CHANGE `usuario` `usuario` TEXT CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL, 
CHANGE `nombre_operador` `nombre_operador` TEXT CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL, 
CHANGE `usuario_recibe` `usuario_recibe` TEXT CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `sop_chat_backup` 
CHANGE `usuario` `usuario` TEXT CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL, 
CHANGE `nombre_operador` `nombre_operador` TEXT CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `sop_chat` ADD `foto_usuario_recibe` VARCHAR(100) NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `sop_visitantes` ADD `fecha_inicio_llamada` TIMESTAMP NULL COMMENT 'dateField';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `sop_visitantes_backup` ADD `fecha_inicio_llamada` TIMESTAMP NULL COMMENT 'dateField';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
            ALTER TABLE `sop_secciones` CHANGE `empresa` `empresa` INT(11) NULL COMMENT 'textField,0,false';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE  `sop_visitantes` CHANGE  `estado`  `estado` VARCHAR( 50 ) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL ;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `sop_config` ADD `creditos_ringow` VARCHAR(2) NULL DEFAULT 'SI';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE  `sop_visitantes` ADD  `msgsinleer` VARCHAR( 2 ) NULL ;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `sop_visitantes` ADD `fecha_finalizacion_llamada` TIMESTAMP NULL DEFAULT NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `sop_visitantes_backup` ADD `fecha_finalizacion_llamada` TIMESTAMP NULL DEFAULT NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `sop_chat_backup` 
ADD `id_session` VARCHAR(200) NULL, 
ADD `usuario_recibe` TEXT NULL, 
ADD `foto_usuario_recibe` VARCHAR(100) NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `sop_visitantes_backup` 
ADD `mensaje_al_visitante` TEXT NULL, 
ADD `mensaje_al_visitante_visto` VARCHAR(2) NULL, 
ADD `mensaje_al_visitante_click` VARCHAR(2) NULL, 
ADD `mensaje_al_visitante_closed` VARCHAR(2) NULL, 
ADD `date_last_message` TIMESTAMP NULL, 
ADD `last_message` TEXT NULL, 
ADD `is_webrtc` VARCHAR(2) NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `sop_visitantes_backup` 
ADD `mensaje_al_visitante` TEXT NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `sop_visitantes`
  DROP `latitud`,
  DROP `longitud`,
  DROP `id_visita_real`,
  DROP `mensaje_al_visitante_visto`,
  DROP `mensaje_al_visitante_click`,
  DROP `mensaje_al_visitante_closed`,
  DROP `photos`;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `sop_chat`
  DROP `empresa`,
  DROP `tipo_user`,
  DROP `ip`,
  DROP `status`,
  DROP `num_envio`,
  DROP `dispositivo`,
  DROP `id_session`;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `sop_config` 
ADD `enviar_emails` CHAR(2) NULL COMMENT 'selectBox,boolean', 
ADD `offline_recolectar_llamadas` CHAR(2) NULL COMMENT 'selectBox,boolean', 
ADD `offline_mensaje` VARCHAR(100) NULL AFTER `offline_recolectar_llamadas`, 
ADD `offline_recibir_mensaje` CHAR(2) NULL COMMENT 'selectBox,boolean';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE  `sop_chat_backup` 
ADD  `visitante_id_real` INT(11) NULL COMMENT  'textField';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `sop_config` 
CHANGE `offline_mensaje` `offline_mensaje` TEXT CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `sop_visitantes_backup`
  DROP `latitud`,
  DROP `longitud`;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `sop_visitantes_backup` CHANGE `date_last_message` `date_last_message` TIMESTAMP NULL DEFAULT NULL AFTER `id_session`;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `sop_visitantes_backup` CHANGE `last_message` `last_message` TEXT CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL AFTER `date_last_message`;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `sop_visitantes_backup` CHANGE `is_webrtc` `is_webrtc` VARCHAR(2) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL AFTER `last_message`;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `sop_visitantes_backup` CHANGE `tiempo` `tiempo` VARCHAR(5) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL AFTER `is_webrtc`;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `sop_visitantes_backup` CHANGE `audio_final` `audio_final` VARCHAR(80) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL AFTER `tiempo`;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `sop_visitantes_backup` CHANGE `id_visita_real` `id_visita_real` INT(11) NULL DEFAULT NULL AFTER `mensaje_al_visitante`;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `sop_visitantes_backup` DROP `mensaje_al_visitante_visto`;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `sop_visitantes_backup` CHANGE `fecha_inicio_llamada` `fecha_inicio_llamada` TIMESTAMP NULL DEFAULT NULL COMMENT 'dateField' AFTER `num_llamadas_videocall`;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `sop_visitantes` DROP `id_visita_real`;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `sop_visitantes`
  DROP `mensaje_al_visitante_click`;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `sop_visitantes`
  DROP `mensaje_al_visitante_visto`;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `sop_visitantes`
  DROP `mensaje_al_visitante_closed`;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
ALTER TABLE `sop_visitantes` 
ADD `enviado_crm` VARCHAR(2) NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `sop_visitantes_backup` 
ADD `enviado_crm` VARCHAR(2) NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `sop_config` ADD `archivar_llamadas_automatic` CHAR(2) NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `sop_config` ADD `getSalas` CHAR(2) NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `sop_config` ADD `texto_sala` VARCHAR(200) NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `sop_config` 
ADD `registro_usar_documento` CHAR(2) NULL, 
ADD `registro_validar_email` CHAR(2) NULL, 
ADD `registro_usar_recaptcha` CHAR(2) NULL, 
ADD `registro_usar_checkacepto` CHAR(2) NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `sop_config` ADD `text_checkacepto` VARCHAR(100) NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `sop_secciones` ADD `redirecciona_al_calendar` CHAR(2) NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `sop_visitantes` ADD `fecha_final` TIMESTAMP NULL DEFAULT NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `sop_visitantes` 
ADD `tipo_documento` CHAR(2) NULL, 
ADD `identificacion` VARCHAR(15) NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `sop_config` ADD `usar_filtro_grupos` CHAR(2) NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `sop_config` ADD `usar_conectar_cita_enc` CHAR(2) NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `sop_secciones` 
ADD `filtro` CHAR(2) NULL, 
ADD `id_filtro_padre` INT NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `sop_config` CHANGE `text_checkacepto` `text_checkacepto` VARCHAR(250) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `sop_visitantes` ADD `fecha_creacion` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'dateField';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `sop_secciones` ADD `tiempo_minimo_duracion_cita` INT NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `sop_visitantes` 
ADD `fecha_inicio_connect_op` TIMESTAMP NULL COMMENT 'dateField', 
ADD `fecha_inicio_connect_cl` TIMESTAMP NULL COMMENT 'dateField';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
CREATE TABLE IF NOT EXISTS `sop_disponibilidad` (
  `id` int(20) unsigned NOT NULL AUTO_INCREMENT COMMENT 'textField,0,false',
`fecha` date DEFAULT NULL,
  `hora_inicial` time DEFAULT NULL,
  `hora_final` time DEFAULT NULL,
  `empresa` int(11) DEFAULT NULL COMMENT 'textField,0,false',
  `usuario` varchar(150) DEFAULT NULL COMMENT 'textField,0,false',
  `terminal` int(11) DEFAULT NULL COMMENT 'textField,0,false',
  `estado` varchar(15) DEFAULT NULL,
  `servicio` int(11) DEFAULT NULL,
  `servicio_text` varchar(100) DEFAULT NULL,
  `id_relation_cita` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
CREATE TABLE IF NOT EXISTS `sop_disponibilidad_backup` (
  `id` int(20) unsigned NOT NULL AUTO_INCREMENT COMMENT 'textField,0,false',
   `id_real` int(11) DEFAULT NULL,
`fecha` date DEFAULT NULL,
  `hora_inicial` time DEFAULT NULL,
  `hora_final` time DEFAULT NULL,
  `empresa` int(11) DEFAULT NULL COMMENT 'textField,0,false',
  `usuario` varchar(150) DEFAULT NULL COMMENT 'textField,0,false',
  `terminal` int(11) DEFAULT NULL COMMENT 'textField,0,false',
  `estado` varchar(15) DEFAULT NULL,
  `servicio` int(11) DEFAULT NULL,
  `servicio_text` varchar(100) DEFAULT NULL,
  `id_relation_cita` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
ALTER TABLE `sop_disponibilidad` 
ADD `servicio` INT NULL, 
ADD `servicio_text` VARCHAR(100) NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `sop_disponibilidad` 
ADD `estado` VARCHAR(15) NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `sop_config` 
ADD `tipo_grupos_hijos` CHAR(15) NULL, 
ADD `link_css` VARCHAR(100) NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `sop_secciones` ADD `orden` CHAR(1) NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `sop_secciones` ADD `color` VARCHAR(25) NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `sop_config` CHANGE `info_site` `info_site` TEXT CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
CREATE TABLE IF NOT EXISTS `sop_plantillas_correos` (
 `id` int(20) unsigned NOT NULL AUTO_INCREMENT COMMENT 'textField,0,false',
  `nombre` varchar(60) DEFAULT NULL,
  `tipo` varchar(100) DEFAULT NULL,
  `fecha` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'textField,0,false',
  `usuario` varchar(60) DEFAULT NULL COMMENT 'textField,0,false',
  `terminal` int(11) DEFAULT NULL COMMENT 'textField,0,false',
  `empresa` int(11) DEFAULT NULL COMMENT 'textField,0,false',
  `asunto` varchar(60) DEFAULT NULL,
  `cuerpo_mensaje` text,
  `enviado_desde_correo` varchar(100) DEFAULT NULL,
  `enviado_desde_nombre` varchar(100) DEFAULT NULL,
  `activo` varchar(2) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;


  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `sop_disponibilidad` ADD `id_relation_cita` INT NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `sop_visitantes` ADD `fecha_cancelacion` TIMESTAMP NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
CREATE TABLE IF NOT EXISTS `sop_secciones_usuarios` (
 `id` int(20) unsigned NOT NULL AUTO_INCREMENT COMMENT 'textField,0,false',
 `seccion` int(11) NOT NULL,
  `usuario` text NOT NULL,
  `terminal` int(11) NOT NULL,
  `pertenece` tinyint(1) NOT NULL,
  `seccion_text` varchar(200) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
CREATE TABLE IF NOT EXISTS `sop_dias_habiles` (
 `id` int(20) unsigned NOT NULL AUTO_INCREMENT COMMENT 'textField,0,false',
  `fecha_no_habil` date DEFAULT NULL COMMENT 'dateField,0,true,true',
  `usuario` varchar(100) DEFAULT NULL COMMENT 'textField,0,false',
  `empresa` int(11) DEFAULT NULL COMMENT 'textField,0,false',
  `terminal` int(11) DEFAULT NULL COMMENT 'selectBox,terminales,false,false',
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
CREATE TABLE IF NOT EXISTS `sop_restricciones` (
 `id` int(20) unsigned NOT NULL AUTO_INCREMENT COMMENT 'textField,0,false',
  `terminal` int(11) NOT NULL COMMENT 'selectBox,terminales,false',
  `usuario` varchar(100) NOT NULL COMMENT 'textField,0,false',
  `tiempo_antes_cancelar` time DEFAULT NULL COMMENT 'timeField',
  `tiempo_antes_editar` time DEFAULT NULL COMMENT 'timeField',
  `tiempo_antes_conexion` time DEFAULT NULL COMMENT 'timeField',
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
CREATE TABLE IF NOT EXISTS `sop_config_notificaciones` (
 `id` int(20) unsigned NOT NULL AUTO_INCREMENT COMMENT 'textField,0,false',
  `terminal` int(11) NOT NULL COMMENT 'selectBox,terminales,false',
  `usuario` varchar(100) NULL COMMENT 'textField,0,false',
  `tipo` char(10) NULL COMMENT 'selectBox,boolean',
  `envia_sms` char(2) NULL COMMENT 'selectBox,boolean',
  `envia_correo` char(2) NULL COMMENT 'selectBox,boolean',
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `sop_secciones` CHANGE `tiempo_minimo_duracion_cita` `tiempo_minimo_duracion_cita` TIME NULL DEFAULT NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `sop_visitantes` ADD `finalizada_por` VARCHAR(100) NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `sop_restricciones` 
ADD `minutos_maximo_espera` CHAR(6) NULL, 
ADD `minutos_recordacion_cita` CHAR(5) NULL, 
ADD `minutos_minimo_para_agendar` CHAR(8) NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `sop_restricciones` CHANGE `tiempo_recordacion_cita` `minutos_recordacion_cita` CHAR(5) NULL DEFAULT NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `sop_restricciones` CHANGE `tiempo_minimo_para_agendar` `minutos_minimo_para_agendar` CHAR(8) NULL DEFAULT NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `sop_restricciones` CHANGE `tiempo_antes_conexion` `minutos_antes_conexion` CHAR(7) NULL DEFAULT NULL COMMENT 'timeField';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `sop_restricciones` CHANGE `tiempo_maximo_espera` `minutos_maximo_espera` CHAR(6) NULL DEFAULT NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `sop_secciones` ADD `pide_datos_formulario` CHAR(2) NULL COMMENT 'selectBox,boolean';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `sop_config` ADD `requiere_autenticacion` CHAR(2) NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `sop_visitantes` CHANGE `tiempo` `tiempo` CHAR(10) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `sop_config` 
ADD `color_texto` CHAR(50) NULL,
ADD `color_fondo` CHAR(50) NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `sop_config` 
ADD `banner_portada` VARCHAR(100) NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `sop_secciones` ADD `redirecciona_a_videollamada` CHAR(2) NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `sop_clientes` ADD `identificacion` VARCHAR(40) NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `sop_clientes` ADD `tipo_documento` CHAR(3) NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `sop_visitantes` ADD `room_v2` CHAR(80) NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `sop_chat` ADD `room_v2` VARCHAR(80) NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `sop_chat` ADD `recibido` CHAR(2) NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `sop_config` ADD `widget_button` CHAR(10) NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `sop_visitantes` CHANGE `identificacion` `identificacion` VARCHAR(20) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `sop_config` ADD `registro_usar_observaciones` CHAR(2) NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `sop_mensajes` CHANGE `origen` `origen` VARCHAR(200) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT 'textField';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `sop_visitantes` ADD `atiende_nombre` VARCHAR(150) NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `sop_visitantes` CHANGE `nombre` `nombre` VARCHAR(180) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `sop_visitantes_backup` CHANGE `nombre` `nombre` VARCHAR(200) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `sop_visitantes` ADD `calificacion` CHAR(17) NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `sop_calificaciones` ADD `usuario_califica` VARCHAR(100) NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
 ALTER TABLE `sop_calificaciones` ADD `comentarios` TEXT NULL AFTER `usuario_califica`;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `sop_calificaciones` CHANGE `calificacion` `calificacion` CHAR(20) NULL DEFAULT NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `sop_calificaciones` CHANGE `fecha` `fecha` TIMESTAMP NULL DEFAULT NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
            ALTER TABLE `sop_visitantes` ADD `HTTP_REFERER` VARCHAR(200) NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
            ALTER TABLE `sop_visitantes_backup` ADD `HTTP_REFERER` VARCHAR(200) NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `sop_visitantes_backup` ADD `eliminado` CHAR(2) NULL DEFAULT 'NO' COMMENT 'selectBox,boolean';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `sop_secciones_usuarios` 
CHANGE `seccion` `seccion` INT(11) NULL, 
CHANGE `usuario` `usuario` TEXT CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL, 
CHANGE `terminal` `terminal` INT(11) NULL, 
CHANGE `pertenece` `pertenece` TINYINT(1) NULL, 
CHANGE `seccion_text` `seccion_text` VARCHAR(200) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "ALTER TABLE `sop_config` ADD `requiere_pago_en_linea` CHAR(2) NULL;";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
            ALTER TABLE `sop_config` ADD `registro_usar_pais` CHAR(2) NULL;
                ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
            ALTER TABLE `sop_config` ADD `motor_api_webrtc` CHAR(8) NULL;
                ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
           ALTER TABLE `sop_config` ADD `nombre_sms_cliente` VARCHAR(50) NULL DEFAULT 'Ringow';
                ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `sop_config` ADD `logo_company` VARCHAR(80) NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `sop_plantillas_correos` ADD `terminal` INT NULL DEFAULT NULL AFTER `activo`;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `sop_visitantes_backup` CHANGE `tiempo` `tiempo` CHAR(10) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `sop_chat` CHANGE `visitante` `visitante` VARCHAR(100) NULL DEFAULT NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `sop_config` ADD `login_con_cedula_correo_celular` CHAR(15) NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `sop_restricciones` CHANGE `terminal` `terminal` INT(11) NULL COMMENT 'selectBox,terminales,false';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `sop_visitantes` ADD `observaciones` TEXT NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `sop_config` ADD `registro_palceholder_observaciones` VARCHAR(100) NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `sop_config` ADD `videollamada_grabar` CHAR(2) NULL DEFAULT 'SI' COMMENT 'selectBox,boolean';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `sop_clientes` ADD `maximo_citas` CHAR(3) NULL COMMENT 'textField';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `sop_clientes` ADD `fecha_creacion_ultima_cita` TIMESTAMP NULL COMMENT 'dateField';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `sop_clientes` CHANGE `fecha` `fecha` TIMESTAMP NULL DEFAULT NULL COMMENT 'textField';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `sop_clientes` ADD `servicios_habilitados` CHAR(35) NULL COMMENT 'textField';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `sop_restricciones` ADD `empresa` INT NOT NULL COMMENT 'textField,0,false';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `sop_visitantes` 
ADD `fecha_op_listo_videocall` TIMESTAMP NULL, 
ADD `fecha_usu_listo_videocall` TIMESTAMP NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `sop_visitantes` 
ADD `dispositivo_cliente_inicia_call` VARCHAR(200) NULL,
ADD `dispositivo_op_inicia_call` VARCHAR(200) NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `sop_visitantes` ADD `fecha_op_listo_videocall_inicial_init` TIMESTAMP NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
  ALTER TABLE `sop_visitantes` ADD `fecha_usu_listo_videocall_init` TIMESTAMP NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `sop_visitantes_backup` 
ADD `fecha_op_listo_videocall` TIMESTAMP NULL, 
ADD `fecha_usu_listo_videocall` TIMESTAMP NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `sop_visitantes_backup` 
ADD `dispositivo_cliente_inicia_call` VARCHAR(200) NULL,
ADD `dispositivo_op_inicia_call` VARCHAR(200) NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `sop_visitantes_backup` ADD `fecha_op_listo_videocall_inicial_init` TIMESTAMP NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
  ALTER TABLE `sop_visitantes_backup` ADD `fecha_usu_listo_videocall_init` TIMESTAMP NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `sop_config` CHANGE `registro_usar_observaciones` `registro_usar_observaciones` CHAR(15) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `sop_restricciones` DROP `hora_minima_para_construir_agenda`;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `sop_restricciones` DROP `hora_maxima_para_contruir_agenda`;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `sop_restricciones` ADD `tiempo_minimo_para_construir_agenda` CHAR(2) NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `sop_restricciones` ADD `tiempo_maximo_para_construir_agenda` CHAR(2) NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `sop_visitantes_backup` ADD `observaciones` TEXT NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `sop_visitantes` CHANGE `identificacion` `identificacion` VARCHAR(100) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `sop_clientes` CHANGE `identificacion` `identificacion` VARCHAR(100) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `sop_visitantes_backup` CHANGE `estado` `estado` VARCHAR(50) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `sop_visitantes_backup` ADD `identificacion` VARCHAR(100) NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `sop_visitantes_backup`
ADD `latitud` VARCHAR(50) NULL DEFAULT NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `sop_visitantes_backup`
ADD `longitud` varchar(50) DEFAULT NULL AFTER `fecha_usu_listo_videocall`;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `sop_visitantes_backup`
ADD `mensaje_al_visitante` text AFTER `fecha_usu_listo_videocall`;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `sop_visitantes_backup`
ADD `msgsinleer` varchar(2) DEFAULT NULL AFTER `fecha_usu_listo_videocall`;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `sop_visitantes_backup`
ADD `fecha_final` timestamp NULL DEFAULT NULL AFTER `fecha_usu_listo_videocall`;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `sop_visitantes_backup`
ADD `tipo_documento` char(2) DEFAULT NULL AFTER `fecha_usu_listo_videocall`;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `sop_visitantes_backup`
ADD `identificacion` varchar(20) DEFAULT NULL AFTER `fecha_usu_listo_videocall`;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `sop_visitantes_backup`
ADD `fecha_creacion` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'dateField' AFTER `fecha_usu_listo_videocall`;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `sop_visitantes_backup`
ADD `fecha_inicio_connect_op` timestamp NULL DEFAULT NULL COMMENT 'dateField' AFTER `fecha_usu_listo_videocall`;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `sop_visitantes_backup`
ADD `fecha_inicio_connect_cl` timestamp NULL DEFAULT NULL COMMENT 'dateField' AFTER `fecha_usu_listo_videocall`;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `sop_visitantes_backup`
ADD `fecha_cancelacion` timestamp NULL DEFAULT NULL AFTER `fecha_usu_listo_videocall`;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `sop_visitantes_backup`
ADD `finalizada_por` varchar(100) DEFAULT NULL AFTER `fecha_usu_listo_videocall`;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `sop_visitantes_backup`
ADD `room_v2` char(80) DEFAULT NULL AFTER `fecha_usu_listo_videocall`;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `sop_visitantes_backup`
ADD `atiende_nombre` varchar(150) DEFAULT NULL AFTER `fecha_usu_listo_videocall`;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `sop_visitantes_backup`
ADD `calificacion` char(17) DEFAULT NULL AFTER `fecha_usu_listo_videocall`;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `sop_visitantes_backup` DROP `mensaje_al_visitante_click`;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `sop_visitantes_backup` DROP `mensaje_al_visitante_closed`;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `sop_visitantes_backup` ADD `eliminado` CHAR(3) NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `sop_visitantes` ADD `fecha_inicio_connect_invitado` TIMESTAMP NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `sop_visitantes_backup` ADD `fecha_inicio_connect_invitado` TIMESTAMP NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `nwmaker_tarjetascredito` ADD `token_card` VARCHAR(50) NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `nwmaker_tarjetascredito` 
ADD `apellido` VARCHAR(80) NULL , 
ADD `tipo_doc` CHAR(2) NULL AFTER `apellido`, 
ADD `cuotas` INT NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `nwmaker_tarjetascredito` ADD `customer_id` VARCHAR(50) NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `nwmaker_tarjetascredito` ADD `email` VARCHAR(100) NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `nwmaker_tarjetascredito_pagos` 
ADD `ref_payco` VARCHAR(40) NULL AFTER `fecha`, 
ADD `factura` VARCHAR(40) NULL AFTER `ref_payco`, 
ADD `estado` VARCHAR(40) NULL AFTER `factura`, 
ADD `respuesta` VARCHAR(40) NULL AFTER `estado`, 
ADD `autorizacion` VARCHAR(40) NULL AFTER `respuesta`, 
ADD `recibo` VARCHAR(40) NULL AFTER `autorizacion`;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `nwmaker_tarjetascredito_pagos` 
ADD `empresa` INT NULL, 
ADD `perfil` INT NULL, 
ADD `usuario` VARCHAR(100) NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `nwmaker_tarjetascredito_pagos` CHANGE `respuesta` `respuesta` VARCHAR(200) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `nwmaker_tarjetascredito` ADD `json_response` TEXT NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `nwmaker_tarjetascredito_pagos` ADD `json_response` TEXT NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `nwmaker_tarjetascredito_pagos` CHANGE `respuesta` `respuesta` TEXT CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
                ALTER TABLE `nwmaker_tarjetascredito` ADD `fecha_ultima_actualizacion` TIMESTAMP NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `nwmaker_tarjetascredito` ADD `json_response_rechazo` TEXT NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `nwmaker_tarjetascredito_pagos` ADD `id_relational_pay` INT NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `nwmaker_tarjetascredito_pagos` ADD `description` TEXT NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
CREATE TABLE IF NOT EXISTS `nwmaker_users_geo` (
 `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT 'textField,0,false',
  `hora` time DEFAULT NULL,
  `fecha` date DEFAULT NULL,
  `latitud` varchar(70) DEFAULT NULL,
  `longitud` varchar(70) DEFAULT NULL,
  `usuario` varchar(300) NOT NULL,
  `ciudad` varchar(150) DEFAULT NULL,
  `perfil` int(11) DEFAULT NULL,
  `id_servicio` int(11) DEFAULT NULL,
  `empresa` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `nwmaker_notificaciones` ADD `sendNotifyPush` CHAR(2) NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `empresas` ADD `saldo` INT NULL DEFAULT '0';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `pv_clientes` CHANGE `puntaje` `puntaje` DOUBLE NULL DEFAULT NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
CREATE TABLE IF NOT EXISTS `nwmaker_promotions_in_app` (
   `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT 'textField,0,false',
  `fecha_inicial` timestamp DEFAULT CURRENT_TIMESTAMP COMMENT 'dateTimeField',
  `fecha_final` timestamp DEFAULT CURRENT_TIMESTAMP COMMENT 'dateTimeField',
  `title` varchar(25) DEFAULT NULL COMMENT 'textField',
  `description` varchar(100) DEFAULT NULL COMMENT 'textArea',
  `img_banner` varchar(100) DEFAULT NULL COMMENT 'uploader',
  `activo` char(2) DEFAULT 'SI' COMMENT 'selectBox,boolean',
  `orden` int(11) DEFAULT NULL,
  `usuario` varchar(300) NOT NULL COMMENT 'textField,0,false',
  `perfil` int(11) DEFAULT NULL COMMENT 'selectBox,nwmaker_perfiles',
  `empresa` int(11) DEFAULT NULL COMMENT 'textField,0,false',
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=1;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `nwmaker_users_geo` CHANGE `id` `id` BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `nwmaker_promotions_in_app` CHANGE `id` `id` BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'textField,0,false';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `nwmaker_resetpass` 
ADD `empresa` INT NULL, 
ADD `perfil` INT NULL, 
ADD `celular` VARCHAR(25) NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE nwmaker_notificaciones CONVERT TO CHARACTER SET utf8;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `nwmaker_notificaciones` CHARACTER SET = utf8 , COLLATE = utf8_general_ci ;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
CREATE TABLE IF NOT EXISTS `nwmaker_history_saldos` (
   `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT 'textField,0,false',
  `fecha` timestamp DEFAULT CURRENT_TIMESTAMP COMMENT 'dateTimeField',
  `tipo` varchar(100) DEFAULT NULL COMMENT 'textField',
  `description` text DEFAULT NULL COMMENT 'textArea',
  `saldo_anterior` varchar(300) NOT NULL COMMENT 'textField',
  `saldo_nuevo` varchar(300) NOT NULL COMMENT 'textField',
  `valor_descarga` varchar(300) NOT NULL COMMENT 'textField',
  `usuario` varchar(300) NOT NULL COMMENT 'textField,0,false',
  `perfil` int(11) DEFAULT NULL COMMENT 'selectBox,nwmaker_perfiles',
  `empresa` int(11) DEFAULT NULL COMMENT 'textField,0,false',
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=1;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `nwmaker_current_version` ADD `description` VARCHAR(25) NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `pv_clientes` ADD `pais_text` VARCHAR(80) NULL, ADD `pais_code` CHAR(5) NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `usuarios` ADD `pais_text` VARCHAR(80) NULL, ADD `pais_code` CHAR(5) NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `pv_clientes` ADD `sala` INT NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `sop_secciones` CHANGE `orden` `orden` CHAR(2) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `nwforms_respuestas_users_enc` CHANGE `url` `url` TEXT CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `sop_secciones` ADD `mostrar_service_asesor` CHAR(10) NULL AFTER `redirecciona_a_videollamada`;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
//        }
///////////**********************************************ENDRINGOW*************************///////////////////////////////////////////////////////
        
             $sql = "
ALTER TABLE `sop_plantillas_correos` ADD `empresa` INT NULL DEFAULT NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        
        
        $sql = "
ALTER TABLE `sop_restricciones` ADD `usar_replicar_disponibilidad`  CHAR(2) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
ALTER TABLE `sop_visitantes_backup` ADD `timezone_cliente` CHAR(40) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
ALTER TABLE `sop_visitantes_backup` add `timezone_agente` CHAR(40) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        
                $sql = "
ALTER TABLE `sop_disponibilidad` ADD `timezone` CHAR(40) NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
ALTER TABLE `sop_visitantes` 
ADD `fecha_inicial_cliente` TIMESTAMP NULL,
ADD `fecha_final_cliente` TIMESTAMP NULL, 
ADD `timezone_cliente` CHAR(40) NULL, 
ADD `timezone_agente` CHAR(40) NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
ALTER TABLE `sop_config` ADD `limite_videollamada` INT NULL ;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
ALTER TABLE `sop_config` ADD `url_finalizar` TEXT NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }


        $sql = "
ALTER TABLE `sop_config` ADD `tiempo_asesoria` INT NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
ALTER TABLE `sop_visitantes` CHANGE `fecha_op_listo_videocall` `fecha_op_listo_videocall` TIMESTAMP NULL DEFAULT NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        
                $sql = "
ALTER TABLE `sop_config` ADD `limite_videollamada` CHAR(10) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL;
";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
ALTER TABLE `sop_config` ADD `tiempo_asesoria` CHAR(10) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL;
";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
ALTER TABLE `sop_visitantes` ADD `videollamada` CHAR(10) NULL;
";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
ALTER TABLE `sop_config` ADD `aviso_limite_videollamada` INT NULL;
";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
ALTER TABLE `sop_restricciones` ADD `tiempo_minimo_duracion_cita_especial` CHAR(8) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT 'textField,0,true,false,integer,Minutos Minimo duracion Cita Especial';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        
            $sql = "
ALTER TABLE `sop_plantillas_correos` ADD `enviar_a` VARCHAR(100) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        
                $sql = "
ALTER TABLE `sop_plantillas_correos` ADD `enviar_a` VARCHAR(100) NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `sop_visitantes` CHANGE `room_v2` `room_v2` CHAR(180) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `sop_chat` CHANGE `room_v2` `room_v2` VARCHAR(180) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        
           $sql = "
ALTER TABLE `sop_config` ADD `mostrar_asesores_antes_calendar` CHAR(2) NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        
        //        if (isset($_SESSION["app_name"]) && $_SESSION["app_name"] === "ringow") {
     
        $sql = "
ALTER TABLE `usuarios` ADD `tarifa` INT NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `usuarios` ADD `descripcion` VARCHAR(200) NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
CREATE TABLE IF NOT EXISTS `sop_tipificacion` ( 
`id` INT NOT NULL AUTO_INCREMENT , 
`nombre` VARCHAR(100) NOT NULL COMMENT 'textField,0,true,false,0,Nombre,false' , 
`empresa` INT NOT NULL COMMENT 'textField,0,false,false,0,Empresa,false' , 
`terminal` INT NOT NULL COMMENT 'textField,0,false,false,0,Terminal,false' , 
 `categoria` INT NULL COMMENT 'selectBox,sop_secciones' ,
PRIMARY KEY (`id`)) ENGINE = InnoDB;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `sop_visitantes` 
ADD `tipificacion` INT NULL ,
ADD `tipificacion_text` VARCHAR(100) NULL , 
ADD `observaciones_tipificacion` TEXT NULL ;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `sop_visitantes_backup` 
ADD `tipificacion` INT NULL ,
ADD `tipificacion_text` VARCHAR(100) NULL , 
ADD `observaciones_tipificacion` TEXT NULL ;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `sop_secciones` ADD `subcategoria` CHAR(5) NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `sop_config` ADD `conversion_trm` CHAR(5) NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `sop_config` ADD `limitar_por_pais_lista_asesores` CHAR(2) NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `sop_visitantes` ADD `motivo_cancelacion` TEXT NULL AFTER `fecha_cancelacion`;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `sop_visitantes_backup` ADD `motivo_cancelacion` TEXT NULL ;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `sop_visitantes` ADD `accept_terms` CHAR(2) NULL DEFAULT 'SI';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
//        }
        $sql = "
                ALTER TABLE `paginas` CHANGE `lenguaje` `lenguaje` INT NULL DEFAULT NULL COMMENT 'selectBox,idiomas';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `nwmaker_promotions_in_app` ADD `tipo` CHAR(30) NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
            ALTER TABLE `pv_clientes` ADD `adjunto_opcional` VARCHAR(150) NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        
         $sql = "ALTER TABLE `sop_secciones` ADD `enviar_sms_recordatorio` CHAR(2) NULL;";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        
         $sql = "
ALTER TABLE `sop_config` ADD `validar_disponibilidad_agenda_en_servicios` CHAR(2) NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `sop_config` ADD `mostrar_anadir_calendar_crearcita` CHAR(2) NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        
         $sql = "
ALTER TABLE `sop_config` ADD `guarda_pre_registro` CHAR(2) NULL ;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `sop_config` ADD `muestra_form_no_disponibilidad` CHAR(2) NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
CREATE TABLE `sop_cursos_asociados_servicios` (
  `id` int NOT NULL COMMENT 'textField,0,false',
  `id_servicio` int NOT NULL COMMENT 'selectBox,sop_secciones',
  `empresa` int NOT NULL COMMENT 'textField,0,false',
  `terminal` int NOT NULL COMMENT 'textField,0,false',
  `usuario` varchar(100) NOT NULL COMMENT 'textField,0,false',
  `fecha_creacion` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'textField,0,false',
  `html` text NOT NULL COMMENT 'ckeditor',
  `activo` char(2) NOT NULL COMMENT 'selectBox,array',
  `activo_fecha_inicial` timestamp NOT NULL COMMENT 'dateTime',
  `activo_fecha_final` timestamp NOT NULL COMMENT 'dateTime'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='[{\"selectBoxArrays\":[{\"name\": \"activo\",\"data\": {\"SI\": \"SI\",\"NO\": \"NO\"}}],\"config\":{\"cleanHtml\": false}}]';

  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `sop_cursos_asociados_servicios`
  ADD PRIMARY KEY (`id`);
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `sop_cursos_asociados_servicios`
  MODIFY `id` int NOT NULL AUTO_INCREMENT COMMENT 'textField,0,false';
COMMIT;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `sop_restricciones` ADD `horas_recordacion_cita` CHAR(20) NULL COMMENT 'textField';
COMMIT;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `sop_visitantes` ADD `enviado_crm_ccb` CHAR(2) NULL DEFAULT 'NO';
COMMIT;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `sop_secciones` 
ADD `CodServicio` VARCHAR(50) NULL, 
ADD `CodigoTipoServicio` INT NULL, 
ADD `CodigoSubservicio` INT NULL, 
ADD `lda_linea` INT NULL;
COMMIT;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `sop_visitantes` 
ADD `lda_linea_id` INT NULL, 
ADD `lda_linea_text` VARCHAR(100) NULL;
COMMIT;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `sop_secciones` ADD `TipoAsistencia` CHAR(5) NULL;
COMMIT;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        
           $sql = "
CREATE TABLE `sop_lineas_lda` (
  `id` int NOT NULL COMMENT 'textField,0,false',
  `nombre` varchar(100) DEFAULT NULL COMMENT 'textField',
  `id_crm` varchar(50) DEFAULT NULL COMMENT 'textField'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
COMMIT;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
           $sql = "
ALTER TABLE `sop_lineas_lda`
  ADD PRIMARY KEY (`id`);
COMMIT;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
           $sql = "
ALTER TABLE `sop_lineas_lda`
  MODIFY `id` int NOT NULL AUTO_INCREMENT COMMENT 'textField,0,false';
COMMIT;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        
           $sql = "
ALTER TABLE `sop_visitantes` ADD `enviado_crm_ccb_fecha_envio` TIMESTAMP NULL DEFAULT NULL;
COMMIT;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
           $sql = "
CREATE TABLE `sop_crm_ccb_config` (
  `id` int NOT NULL COMMENT 'textField,0,false',
  `url` text COMMENT 'textField'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
COMMIT;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
           $sql = "
ALTER TABLE `sop_crm_ccb_config`
  ADD PRIMARY KEY (`id`);
COMMIT;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
           $sql = "
ALTER TABLE `sop_crm_ccb_config`
  MODIFY `id` int NOT NULL AUTO_INCREMENT COMMENT 'textField,0,false';
COMMIT;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
           $sql = "
ALTER TABLE `sop_crm_ccb_config` ADD `activo` CHAR(2) NULL;
COMMIT;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        
        
        return true;
    }

}
