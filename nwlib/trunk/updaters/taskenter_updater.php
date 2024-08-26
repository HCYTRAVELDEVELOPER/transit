<?php

/* * ***********************************************************************

  Copyright:
  2013 Netwoods.net, http://www.netwoods.net

  Author:
  Andrés Flórez

 * *********************************************************************** */

class taskenter_updater {

    public static function start($p) {
        session::check();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $ca->setPregMatchDuplicate(false);

///////////**********************************************START TASKENTER*************************///////////////////////////////////////////////////////
        $sql = "
CREATE TABLE IF NOT EXISTS `nwtask_tareas` (
    `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'textField,0,false',
  `tarea` TEXT DEFAULT NULL COMMENT 'textField',
  `descripcion` TEXT DEFAULT NULL COMMENT 'ckeditor',
    `fecha_y_hora` TIMESTAMP COMMENT 'dateField',
    `fecha` date DEFAULT NULL COMMENT 'dateField',
    `hora` time DEFAULT NULL COMMENT 'timeField',
    `hora_inicial` time DEFAULT NULL COMMENT 'timeField',
    `hora_final` time DEFAULT NULL COMMENT 'timeField',
  `asignado_a` int(11) DEFAULT NULL COMMENT 'selectBox,pv_clientes',
  `asignado_a_text` varchar(100) DEFAULT NULL COMMENT 'selectBox,pv_clientes',
  `asignado_por` varchar(100) DEFAULT NULL COMMENT 'selectBox,pv_clientes',
  `grupo` int(11) DEFAULT NULL COMMENT 'textField',
  `grupo_text` varchar(60) DEFAULT NULL COMMENT 'textField',
  `estado` varchar(35) DEFAULT NULL COMMENT 'textField',
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
CREATE TABLE IF NOT EXISTS `nwtask_grupos` (
    `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'textField,0,false',
  `nombre` varchar(80) DEFAULT NULL COMMENT 'textField',
  `descripcion` varchar(150) DEFAULT NULL COMMENT 'ckeditor',
    `fecha_y_hora` TIMESTAMP  COMMENT 'dateField',
  `estado` varchar(35) DEFAULT NULL COMMENT 'textField',
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
CREATE TABLE IF NOT EXISTS `nwtask_grupos_usuarios` (
    `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'textField,0,false',
  `usuario_grupo` varchar(120) DEFAULT NULL COMMENT 'textField',
  `grupo` int(11) DEFAULT NULL COMMENT 'selectBox,nwtask_grupos',
  `rol` int(11) DEFAULT NULL COMMENT 'selectBox,nwtask_roles',
    `fecha` TIMESTAMP  COMMENT 'dateField',
  `estado` varchar(35) DEFAULT NULL COMMENT 'textField',
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
CREATE TABLE IF NOT EXISTS `nwtask_roles` (
    `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'textField,0,false',
  `nombre` varchar(80) DEFAULT NULL COMMENT 'textField',
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
CREATE TABLE IF NOT EXISTS `nwtask_wall_public` (
    `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'textField,0,false',
  `publicacion` TEXT DEFAULT NULL COMMENT 'textField',
  `tipo` varchar(20) DEFAULT NULL COMMENT 'ckeditor',
  `grupo` int(11) DEFAULT NULL COMMENT 'ckeditor',
  `grupo_text` varchar(80) DEFAULT NULL COMMENT 'ckeditor',
  `privacidad` varchar(11) DEFAULT NULL COMMENT 'ckeditor',
    `fecha` TIMESTAMP  COMMENT 'dateField',
  `usuario` varchar(100) DEFAULT NULL COMMENT 'textField,0,false',
  `usuario_nombre` varchar(100) DEFAULT NULL COMMENT 'textField,0,false',
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
CREATE TABLE IF NOT EXISTS `nwtask_grupos_files` (
    `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'textField,0,false',
  `nombre` varchar(100) DEFAULT NULL COMMENT 'textField',
  `ruta` varchar(100) DEFAULT NULL COMMENT 'ckeditor',
  `grupo` int(11) DEFAULT NULL COMMENT 'ckeditor',
    `fecha` TIMESTAMP  COMMENT 'dateField',
  `usuario` varchar(100) DEFAULT NULL COMMENT 'textField,0,false',
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
CREATE TABLE IF NOT EXISTS `nwtask_tareas_files` (
    `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'textField,0,false',
  `nombre` varchar(100) DEFAULT NULL COMMENT 'textField',
  `id_tarea` int(11) DEFAULT NULL COMMENT 'ckeditor',
    `fecha` TIMESTAMP  COMMENT 'dateField',
  `usuario` varchar(100) DEFAULT NULL COMMENT 'textField,0,false',
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
CREATE TABLE IF NOT EXISTS `nwtask_tareas_comments` (
    `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'textField,0,false',
  `descripcion` TEXT DEFAULT NULL COMMENT 'textField',
  `adjunto` varchar(100) DEFAULT NULL COMMENT 'ckeditor',
  `tarea_id` int(11) DEFAULT NULL COMMENT 'ckeditor',
  `tipo` varchar(10) DEFAULT NULL COMMENT 'ckeditor',
  `usuario` varchar(80) DEFAULT NULL COMMENT 'ckeditor',
  `privacidad` varchar(11) DEFAULT NULL COMMENT 'ckeditor',
    `fecha` TIMESTAMP  COMMENT 'dateField',
  `usuario_nombre` varchar(100) DEFAULT NULL COMMENT 'textField,0,false',
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
ALTER TABLE  `nwtask_tareas` ADD  `asignado_a_username` VARCHAR( 150 ) NOT NULL ;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
            ALTER TABLE  `nwtask_wall_public` ADD  `me_gusta` INT NULL DEFAULT  '0';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
            ALTER TABLE  `nwtask_wall_public` CHANGE  `fecha`  `fecha` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT  'dateField';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
            ALTER TABLE  `nwtask_tareas`
            ADD  `fecha_creacion` TIMESTAMP NOT NULL COMMENT  'dateField',
ADD  `prioridad` VARCHAR( 60 ) NULL COMMENT  'selectBox,array';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
ALTER TABLE  `nwtask_tareas` ADD  `terminal` INT NOT NULL ;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
            ALTER TABLE  `nwtask_tareas` ADD  `adjunto` VARCHAR( 80 ) NULL ;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
            ALTER TABLE  `nwtask_tareas` ADD  `adjunto_final` VARCHAR( 80 ) NULL ;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
ALTER TABLE  `nwtask_tareas` ADD  `puntaje` INT NULL ;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
ALTER TABLE  `nwtask_tareas` ADD  `comentarios_puntaje` TEXT NULL ,
ADD  `usuario_puntua` VARCHAR( 80 ) NULL ;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
ALTER TABLE  `nwtask_tareas` ADD  `usuario_recomendado_calificar` VARCHAR( 80 ) NULL ;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
ALTER TABLE  `nwtask_tareas` ADD  `fecha_inicio` DATE NULL COMMENT  'dateField';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE  `nwtask_grupos_usuarios` ADD  `rol_text` VARCHAR( 80 ) NULL COMMENT  'textField';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
CREATE TABLE IF NOT EXISTS `nwtask_muro_mensajes` (
    `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'textField,0,false',
  `mensaje` text DEFAULT NULL COMMENT 'textArea',
  `adjunto` varchar(100) DEFAULT NULL COMMENT 'uploader',
  `grupo` INT(11) DEFAULT NULL COMMENT 'selectBox,nwtask_grupos',
  `usuario_envia` varchar(100) DEFAULT NULL COMMENT 'textField',
  `fecha` TIMESTAMP  COMMENT 'dateField',
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
            ALTER TABLE  `nwtask_grupos_usuarios` ADD  `terminal` INT NOT NULL ;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
            ALTER TABLE  `nwtask_grupos` ADD  `terminal` INT NOT NULL ;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE  `nwtask_grupos_usuarios` ADD  `usuario_grupo_text` VARCHAR( 150 ) NOT NULL ;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
            ALTER TABLE  `nwtask_tareas` ADD  `comentarios_finalizado` TEXT NULL ,
ADD  `fecha_finalizado` TIMESTAMP NULL ;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
ALTER TABLE  `nwtask_tareas` ADD  `finalizado_por` VARCHAR( 100 ) NULL ;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
ALTER TABLE  `nwtask_grupos` 
ADD  `fecha_inicial` DATE NULL COMMENT  'dateField',
ADD  `fecha_final` DATE NULL COMMENT  'dateField';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
CREATE TABLE IF NOT EXISTS `nwtask_grupos_clientes` (
    `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'textField,0,false',
  `nombre_cliente` varchar(100) DEFAULT NULL COMMENT 'textField',
  `correo_cliente` varchar(100) DEFAULT NULL COMMENT 'textField',
  `grupo` int(11) DEFAULT NULL COMMENT 'textField',
  `usuario` varchar(100) DEFAULT NULL COMMENT 'textField',
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
CREATE TABLE IF NOT EXISTS `nwtask_grupos_categorias` (
    `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'textField,0,false',
  `nombre` varchar(100) DEFAULT NULL COMMENT 'textField',
  `grupo` int(11) DEFAULT NULL COMMENT 'textField',
  `usuario` varchar(100) DEFAULT NULL COMMENT 'textField',
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
ALTER TABLE  `nwtask_tareas` ADD  `tipo` VARCHAR( 15 ) NULL ,
ADD  `subgrupo` INT NULL ;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
            ALTER TABLE  `nwtask_wall_public`
            ADD  `imagen_adjunta` VARCHAR( 80 ) NULL ,
ADD  `url_video` VARCHAR( 80 ) NULL ;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE  `nwtask_tareas` ADD  `cumplimiento` INT NULL ;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE  `nwtask_grupos` ADD  `departamento` INT NULL ,
ADD  `departamento_text` VARCHAR( 60 ) NULL ;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
            ALTER TABLE  `nwtask_tareas` ADD  `peso` INT NULL ;
";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE  `nwtask_tareas` ADD  `fecha_califica` TIMESTAMP NULL ;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
CREATE TABLE IF NOT EXISTS `nwtask_users_replegar` (
    `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'textField,0,false',
  `usuario` varchar(80) DEFAULT NULL COMMENT 'textField,0,false',
  `nombre_user` varchar(100) DEFAULT NULL COMMENT 'textField',
  `tipo` varchar(20) DEFAULT NULL COMMENT 'textField',
  `id_asocia` int(11) DEFAULT NULL COMMENT 'textField',
  `fecha` timestamp  COMMENT 'textField',
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "CREATE TABLE `nwtask_contenidos` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT 'textField,0,false,false,0,0,false',
  `usuario` varchar(100) DEFAULT NULL COMMENT 'textField,0,false,false,0,0,false',
  `empresa` int(11) DEFAULT NULL COMMENT 'textField,0,false,false,0,0,false',
  `fecha` date DEFAULT NULL COMMENT 'dateField,0,false,false,0,0,false',
  `titulo` varchar(200) DEFAULT NULL COMMENT 'textField,0,true,true,0,0,false',
  `descripcion` text COMMENT 'textArea,0,true,true,0,0,false',
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
ALTER TABLE  `pv_clientes` ADD  `horario_task_almuerzo` VARCHAR(100) NULL ;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
 ALTER TABLE `nwtask_jornada_personal` CHANGE `mode` `mode` CHAR(30) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `pv_clientes` CHANGE `estado_laboral` `estado_laboral` CHAR(30) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
             ALTER TABLE `empresas` ADD `pausas_activas_total` CHAR(1) NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
 ALTER TABLE `empresas` ADD `pausas_activas_minutos` CHAR(2) NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
 ALTER TABLE `nwtask_jornada_personal` ADD `causa` VARCHAR(100) NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
 ALTER TABLE `nwtask_jornada_personal` ADD `adjunto` VARCHAR(100) NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
 ALTER TABLE `nwtask_jornada_personal` ADD `usuario_edito` VARCHAR(100) NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
 ALTER TABLE `nwtask_jornada_personal` ADD `fecha_edito` TIMESTAMP NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
            alter table nwtask_jornada_personal add column causa varchar(100)  NULL DEFAULT NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
            alter table nwtask_jornada_personal add column adjunto varchar(100)  NULL DEFAULT NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
            alter table nwtask_jornada_personal add column usuario_edito varchar(100)  NULL DEFAULT NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
            alter table nwtask_jornada_personal add column fecha_edito  timestamp  NULL DEFAULT NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
            CREATE TABLE taskenter.pv_clientes_permisos_board_log (
  `usuario` varchar(100) COLLATE utf8mb3_bin DEFAULT NULL,
  `empresa` int DEFAULT NULL,
  `fecha` timestamp NULL DEFAULT NULL,
  `permisos_antes` text COLLATE utf8mb3_bin,
  `permisos_ahora` text COLLATE utf8mb3_bin,
  `id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_bin;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
       ALTER TABLE taskenter.pv_clientes_permisos_board_log
  ADD PRIMARY KEY (`id`);
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
      ALTER TABLE taskenter.pv_clientes_permisos_board_log
  MODIFY `id` int NOT NULL AUTO_INCREMENT;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
      ALTER TABLE taskenter.pv_clientes ADD `permisos_board` TEXT NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

///////////**********************************************ENDTASKENTER*************************///////////////////////////////////////////////////////


        return true;
    }
}
