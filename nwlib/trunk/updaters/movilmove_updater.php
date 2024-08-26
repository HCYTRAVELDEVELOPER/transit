<?php

/* * ***********************************************************************

  Copyright:
  2013 Netwoods.net, http://www.netwoods.net

  Author:
  Andrés Flórez

 * *********************************************************************** */

class movilmove_updater {

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
        ///////////**********************************************STARMOVILMOVE*************************///////////////////////////////////////////////////////
        $sql = "
CREATE TABLE `edo_preoperacional_otros_documentos` 
( `id` INT NOT NULL AUTO_INCREMENT , 
`id_preoperacional` INT NOT NULL , 
`fecha` TIMESTAMP NOT NULL , 
`usuario` VARCHAR(150) NOT NULL , 
`usuario_conductor` VARCHAR(150) NOT NULL , 
`adjunto` VARCHAR(150) NOT NULL , 
`empresa` INT NOT NULL , PRIMARY KEY (`id`)) ENGINE = InnoDB;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `edo_preoperacional_otros_documentos` 
ADD `observaciones` TEXT NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `edo_servicios` ADD `notificado_back` TEXT NULL AFTER `pathDriverToOrigin`;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
ALTER TABLE `edo_servicios` ADD `centro_costo` INT NULL AFTER `notificado_back`;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
ALTER TABLE `edo_servicios` ADD `centro_costo_text` CHAR(150) NULL AFTER `centro_costo`;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
ALTER TABLE `edo_servicios` ADD `remesa` TEXT NULL AFTER `centro_costo_text`;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
ALTER TABLE `edo_servicios` ADD `descricion_carga` TEXT NULL AFTER `remesa`;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
ALTER TABLE `edo_servicios` ADD `numero_auxiliares` CHAR(20) NULL AFTER `descricion_carga`, 
ADD `salida_periferia` VARCHAR(100) NULL AFTER `numero_auxiliares`, ADD `despacho` VARCHAR(100) NULL AFTER `salida_periferia`, 
ADD `retorno` CHAR(10) NULL AFTER `despacho`, ADD `cargue` CHAR(10) NULL AFTER `retorno`, 
ADD `descargue` CHAR(10) NULL AFTER `cargue`, ADD `observaciones_servicio` TEXT NULL AFTER `descargue`, 
ADD `contacto_recogida` VARCHAR(100) NULL AFTER `observaciones_servicio`, 
ADD `telefono_recogida` VARCHAR(50) NULL AFTER `contacto_recogida`, ADD `observaciones_recogida` TEXT NULL AFTER `telefono_recogida`, 
ADD `contacto_entrega` VARCHAR(100) NULL AFTER `observaciones_recogida`, 
ADD `telefono_entrega` VARCHAR(50) NULL AFTER `contacto_entrega`, ADD `observaciones_entrega` TEXT NULL AFTER `telefono_entrega`, 
ADD `cantidad` VARCHAR(100) NULL AFTER `observaciones_entrega`, ADD `volumen` VARCHAR(100) NULL AFTER `cantidad`;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
ALTER TABLE `edo_servicios` ADD `peso` VARCHAR(100) NULL AFTER `volumen`, ADD `empaque` VARCHAR(10) NULL AFTER `peso`, 
ADD `valor_declarado` VARCHAR(100) NULL AFTER `empaque`;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
ALTER TABLE `edo_servicios` ADD `id_tarifa` INT NULL AFTER `valor_declarado`;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
ALTER TABLE `edo_servicios` ADD `subservicio` INT NULL AFTER `id_tarifa`;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
ALTER TABLE `edo_servicios` ADD `subservicio_text` VARCHAR(100) NULL AFTER `subservicio`;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
ALTER TABLE `edo_servicios` ADD `descripcion_carga` TEXT NULL AFTER `subservicio_text`;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
ALTER TABLE `edo_servicios` ADD `stated_travel` TEXT NULL AFTER `descripcion_carga`;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
ALTER TABLE `edo_configuraciones` ADD `texto_boton_a_donde_vas` VARCHAR(100) NULL AFTER `rango_modelo_vheiculo`;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `edo_taximetro` ADD `cargue` DOUBLE NULL AFTER `nombre`, ADD `descargue` DOUBLE NULL AFTER `cargue`, 
ADD `porcentaje_valor_declarado` INT NULL AFTER `descargue`, ADD `retorno` DOUBLE NULL AFTER `porcentaje_valor_declarado`;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }


        $sql = "
CREATE TABLE `edo_adjuntos` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `nombre` varchar(200) DEFAULT NULL,
  `descripcion` text,
  `adjunto` text,
  `fecha` timestamp NULL DEFAULT NULL,
  `usuario` varchar(100) DEFAULT NULL,
  `empresa` int(11) DEFAULT NULL,
  `bodega` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
CREATE TABLE `edo_adicionales_servicio` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `id_service` int(11) DEFAULT NULL,
  `caracteristicas` text,
  `empresa` int(11) DEFAULT NULL,
  `fecha` timestamp NULL DEFAULT NULL,
  `usuario` varchar(100) DEFAULT NULL,
  `bodega` int(11) DEFAULT NULL,
  `leido` char(2) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=latin1
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
CREATE TABLE `edo_plantilla_correo` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT 'textField,0,false',
  `fecha` timestamp NULL DEFAULT NULL COMMENT 'textField,0,false',
  `asunto` varchar(120) DEFAULT NULL,
  `cuerpo_mensaje` text COMMENT 'ckeditor,0,true,true,false,Cuerpo',
  `quien_envia_correo` varchar(100) DEFAULT NULL,
  `quien_envia_nombre` varchar(100) DEFAULT NULL,
  `activo` char(2) DEFAULT NULL COMMENT 'selectBox,boolean',
  `empresa` int(11) DEFAULT NULL COMMENT 'textField,0,false',
  `usuario` varchar(100) DEFAULT NULL COMMENT 'textField,0,false',
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
CREATE TABLE `edo_centro_costos` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `usuario` varchar(50) DEFAULT NULL,
  `empresa` int(11) DEFAULT NULL,
  `fecha` date DEFAULT NULL,
  `nombre` varchar(200) DEFAULT NULL,
  `ciudad` int(11) DEFAULT NULL,
  `ciudad_text` varchar(150) DEFAULT NULL,
  `direccion` text,
  `telefono` bigint(20) DEFAULT NULL,
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
CREATE TABLE `edo_consecutivo_remesas` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT 'textField,0,false,false,0,0,false',
  `empresa` int(11) DEFAULT NULL COMMENT 'textField,0,false,false,0,0,false',
  `usuario` varchar(100) DEFAULT NULL COMMENT 'textField,0,false,false,0,0,false',
  `fecha` date DEFAULT NULL COMMENT 'dateField,0,false,false,0,0,false',
  `rango_inicial` bigint(20) DEFAULT NULL COMMENT 'textField,0,true,false,integer,0,false',
  `rango_final` bigint(20) DEFAULT NULL COMMENT 'textField,0,true,false,integer,0,false',
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
CREATE TABLE `edo_foraneo_clientes` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `usuario` varchar(100) DEFAULT NULL,
  `empresa` int(11) DEFAULT NULL,
  `tarifa` int(11) DEFAULT NULL,
  `tarifa_text` varchar(200) DEFAULT NULL,
  `valor` varchar(100) DEFAULT NULL,
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
CREATE TABLE `edo_subservice` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT 'textField,0,false,false,0,0,false',
  `empresa` int(11) DEFAULT NULL COMMENT 'textField,0,false,false,0,0,false',
  `usuario` varchar(100) DEFAULT NULL COMMENT 'textField,0,false,false,0,0,false',
  `fecha` date DEFAULT NULL COMMENT 'dateField,0,false,false,0,0,false',
  `nombre` varchar(150) DEFAULT NULL COMMENT 'textField,0,true,false,0,0,false',
  `icono` text COMMENT 'uploader,0,true,false,0,0,false',
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
CREATE TABLE `edo_taximetro_cliente` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT 'textField,0,false,false,0,0,false',
  `valor_unidad_tiempo` double DEFAULT NULL COMMENT 'textField,0,true,false,money,Valor unidad tiempo,false',
  `valor_unidad_metros` double DEFAULT NULL COMMENT 'textField,0,true,false,money,Valor unidad metros,false',
  `valor_banderazo` double DEFAULT NULL COMMENT 'textField,0,true,false,money,Valor banderazo,false',
  `valor_mascota` double DEFAULT NULL COMMENT 'textField,0,true,false,money,Valor mascota,false',
  `minima` double DEFAULT NULL COMMENT 'textField,0,true,false,money,Minima,false',
  `trayecto` int(11) DEFAULT NULL COMMENT 'selectBox,edo_taximetro,true,false,0,Trayecto,false',
  `id_cliente` int(11) DEFAULT NULL COMMENT 'textField,0,true,false,0,Cliente,false',
  `empresa` int(11) DEFAULT NULL COMMENT 'textField,0,false,false,0,0,false',
  `fecha` date DEFAULT NULL COMMENT 'dateField,0,false,false,0,0,false',
  `usuario` varchar(100) DEFAULT NULL COMMENT 'textField,0,true,false,0,0,false',
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
CREATE TABLE `edo_foraneo_service` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT 'textField,0,false,false,0,0,false',
  `empresa` int(11) DEFAULT NULL COMMENT 'textField,0,false,false,0,0,false',
  `usuario` varchar(100) DEFAULT NULL COMMENT 'textField,0,false,false,0,0,false',
  `fecha` date DEFAULT NULL COMMENT 'dateField,0,false,false,0,0,false',
  `service` int(11) DEFAULT NULL COMMENT 'selectBox,edo_subservice,true,true,0,Servicio,false',
  `valor` varchar(100) DEFAULT NULL COMMENT 'textField,0,true,false,0,0,false',
  `id_tarifa` int(11) DEFAULT NULL COMMENT 'selectBox,edo_foraneo,true,false,0,Tarifa,false',
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
ALTER TABLE `trans_servicio_parada` ADD `descripcion_carga` TEXT NULL AFTER `longitud_parada`;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
ALTER TABLE `trans_servicio_parada` ADD `estado` VARCHAR(100) NULL AFTER `descripcion_carga`;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
ALTER TABLE `usuarios` ADD `centro_costo` VARCHAR(100) NULL AFTER `usuario_invitado2_rainbow`;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
ALTER TABLE `edo_configuraciones` ADD `usar_descripcion_carroceria` VARCHAR(40) NULL COMMENT 'selectBox,array,true,false,0,0,false' AFTER `capacidad_pasajeros`, 
ADD `capacidad_carga_kg` VARCHAR(40) NULL COMMENT 'selectBox,array,true,false,0,0,false' AFTER `usar_descripcion_carroceria`, 
ADD `capacidad_volumen_m3` VARCHAR(40) NULL COMMENT 'selectBox,array,true,false,0,0,false' AFTER `capacidad_carga_kg`, 
ADD `tarjeta_propiedad_trasera` VARCHAR(40) NULL COMMENT 'selectBox,array,true,false,0,0,false' AFTER `capacidad_volumen_m3`, 
ADD `revision_tegnomecanica` VARCHAR(40) NULL COMMENT 'selectBox,array,true,false,0,0,false' AFTER `tarjeta_propiedad_trasera`,
ADD `direccion_domicilio` VARCHAR(40) NULL AFTER `revision_tegnomecanica`, ADD `telefono` VARCHAR(40) NULL AFTER `direccion_domicilio`, 
ADD `afp` VARCHAR(40) NULL AFTER `telefono`, ADD `eps` VARCHAR(40) NULL AFTER `afp`, ADD `arl` VARCHAR(40) NULL AFTER `eps`,
ADD `referencias_per_lab` VARCHAR(40) NULL AFTER `arl`, ADD `documento_imagen_respaldo` VARCHAR(40) NULL AFTER `referencias_per_lab`,
ADD `pedir_datos_propietario_vehiculo` VARCHAR(40) NULL AFTER `documento_imagen_respaldo`;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
CREATE TABLE `edo_descripcion_carroceria` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT 'textField,0,false',
  `nombre` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'textField,0,true',
  `fecha` date DEFAULT NULL COMMENT 'dateField,0,false',
  `usuario` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'textField,0,false',
  `empresa` int(11) DEFAULT NULL COMMENT 'textField,0,false',
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }


        $sql = "
ALTER TABLE `edo_vehiculos` ADD `descripcion_carroceria` INT NULL AFTER `bodega`, ADD `descripcion_carroceria_text` VARCHAR(100) NULL AFTER `descripcion_carroceria`,
ADD `capacidad_carga_kg` VARCHAR(100) NULL AFTER `descripcion_carroceria_text`, ADD `capacidad_volumen_m3` VARCHAR(100) NULL AFTER `capacidad_carga_kg`, 
ADD `tarjeta_propiedad_trasera` TEXT NULL AFTER `capacidad_volumen_m3`, ADD `revision_tegnomecanica` TEXT NULL AFTER `tarjeta_propiedad_trasera`;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
ALTER TABLE `documentos_conductor` ADD `documento_imagen_respaldo` TEXT NULL AFTER `documento_imagen`, 
ADD `direccion_domicilio` VARCHAR(200) NULL AFTER `documento_imagen_respaldo`, ADD `telefono` VARCHAR(40) NULL AFTER `direccion_domicilio`, 
ADD `afp` TEXT NULL AFTER `telefono`, ADD `eps` TEXT NULL AFTER `afp`, ADD `arl` TEXT NULL AFTER `eps`,
ADD `referencias_per_lab` TEXT NULL AFTER `arl`;

  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
ALTER TABLE `edo_configuraciones` ADD `texto_boton_confirmar_abordaje` VARCHAR(150) NULL AFTER `texto_boton_a_donde_vas`, 
ADD `texto_boton_llegada_destino` VARCHAR(150) NULL AFTER `texto_boton_confirmar_abordaje`;

  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
ALTER TABLE `edo_servicios` ADD `firma_recibido` TEXT NULL AFTER `stated_travel`;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
ALTER TABLE `edo_vehiculos` ADD `nombre_propietario` VARCHAR(200) NULL AFTER `revision_tegnomecanica`, 
ADD `identificacion_propietario` VARCHAR(150) NULL AFTER `nombre_propietario`, 
ADD `rut` TEXT NULL AFTER `identificacion_propietario`, ADD `direccion_proietario` VARCHAR(200) NULL AFTER `rut`, 
ADD `telefono_proietario` VARCHAR(60) NULL AFTER `direccion_proietario`;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
ALTER TABLE `edo_novedades` ADD `notificado_back` TEXT NULL AFTER `adjunto`;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
ALTER TABLE `edo_configuraciones` ADD `pide_preoperacional` CHAR(40) NULL AFTER `texto_boton_llegada_destino`;
";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
ALTER TABLE `edo_configuraciones` ADD `usa_subservicios` CHAR(40) NULL AFTER `pide_preoperacional`,
ADD `usa_flotas_clientes` CHAR(40) NULL AFTER `usa_subservicios`;
";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
ALTER TABLE `edo_empresas` ADD `tipo_empresa` VARCHAR(100) NULL AFTER `tope_saldo`;
";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
ALTER TABLE `pv_clientes` ADD `atiende_subservicios` TEXT NULL AFTER `sala_text`;
";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
ALTER TABLE `edo_empresas` ADD `numero_contacto_reponsable` VARCHAR(60) NULL AFTER `tipo_empresa`, 
ADD `identificacion_reponsable` VARCHAR(100) NULL AFTER `numero_contacto_reponsable`, 
ADD `direccion_reponsable` VARCHAR(200) NULL AFTER `identificacion_reponsable`, 
ADD `firma_representante_legal` TEXT NULL AFTER `direccion_reponsable`;
";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
ALTER TABLE `edo_vehiculos` ADD `numero_interno` VARCHAR(100) NULL AFTER `telefono_proietario`,
ADD `numero_tarjeta_operacion` VARCHAR(100) NULL AFTER `numero_interno`;
";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
ALTER TABLE `edo_configuraciones` ADD `pide_fuec` CHAR(40) NULL AFTER `usa_flotas_clientes`;
";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
CREATE TABLE `edo_detalle_contrato_fuec` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `id_cliente` int(11) DEFAULT NULL,
  `fecha` date DEFAULT NULL,
  `numero_contrato` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `objeto_contrato` text COLLATE utf8mb4_unicode_ci,
  `fecha_inicial` date DEFAULT NULL,
  `fecha_final` date DEFAULT NULL,
  `origen` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `destino` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `descripcion_recorrido` text COLLATE utf8mb4_unicode_ci,
  `convenio_text` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `convenio` int(11) DEFAULT NULL,
  `usuario` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `empresa` int(11) DEFAULT NULL,
  `numero_fuec` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
CREATE TABLE `edo_preoperacional` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `fecha` timestamp NULL DEFAULT NULL,
  `presion` char(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `tuercas_completas_aseguradas` char(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `labrado` char(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `freno_parqueo_funciona` char(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `frenos_funcionando` char(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `liquido_frenos_dentro_limites` char(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `enciende_luz_reversa` char(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `encienden_luces_bajas` char(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `encienden_cocuyos` char(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `encienden_luces_freno` char(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `encienden_direccionales_atras_delante` char(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `nivel_combustible` char(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `indicador_presion_aceite` char(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `indicador_nivel_bateria` char(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `espejos_retrovisores_funcionando` char(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `todas_puertas_cierran_ajustan` char(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `nivel_aceite_motor` char(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `nivel_liquido_direccion` char(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `nivel_liquido_refrigerante` char(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `nivel_agua_limpiabrisas` char(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `pito` char(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `limpiabrisas_funcionando` char(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `radiador_tapa_ajustada` char(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `correa_ventilador_tensionada` char(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bateria_sin_residuos` char(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ajuste_horizontal_sillas_delanteras` char(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ajuste_vertical_sillas_delanteras` char(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `tapizado_roturas_manchas` char(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `firma_fonductor_inspeccion` text COLLATE utf8mb4_unicode_ci,
  `observaciones` text COLLATE utf8mb4_unicode_ci,
  `id_usuario` int(11) DEFAULT NULL,
  `empresa` int(11) DEFAULT NULL,
  `usuario` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `id_vehiculo` int(11) DEFAULT NULL,
  `bodega` int(11) DEFAULT NULL,
  `marca` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `tipo` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `placa` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `modelo` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
ALTER TABLE `nc_cupones` CHANGE `fecha_expiracion` `fecha_expiracion` TIMESTAMP NULL DEFAULT NULL COMMENT 'dateTimeField';
";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
ALTER TABLE `nc_cupones` ADD `descripcion` TEXT NULL AFTER `valido_para_conductor`,
ADD `ciudad` INT NULL COMMENT 'selectBox,ciudades,true' AFTER `descripcion`, 
ADD `servicios` INT NULL COMMENT 'selectBox,edo_taximetro,true' AFTER `ciudad`,
ADD `quemar_cupon` VARCHAR(40) NULL COMMENT 'selectBox,array,true' AFTER `servicio`;
";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
ALTER TABLE `nc_cupones_redimidos` 
ADD `valor` VARCHAR(50) NULL, 
ADD `tipo` VARCHAR(100) NULL, 
ADD `descripcion` TEXT NULL AFTER `tipo`, 
ADD `fecha_expiracion` TIMESTAMP NULL, 
ADD `estado` VARCHAR(100) NULL, 
ADD `id_cupon` INT NULL AFTER `id`,
ADD `ciudad` INT NULL COMMENT 'selectBox,ciudades,true', 
ADD `servicio` INT NULL COMMENT 'selectBox,edo_taximetro,true',
ADD `quemar_cupon` VARCHAR(20) NULL COMMENT 'selectBox,array,true';
";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `nc_cupones_redimidos` ADD `empresa` INT NULL;
";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
                ALTER TABLE `nc_cupones_redimidos` ADD `perfil` INT NULL;
";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
ALTER TABLE `edo_servicios` ADD `datos_cupon` TEXT NULL AFTER `firma_recibido`,
ADD `numero_referidos` INT NULL AFTER `datos_cupon`,
ADD `valor_referido` INT NULL AFTER `numero_referidos`;
";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
ALTER TABLE `pv_clientes` CHANGE `code_referido` `code_referido` TEXT CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL;
";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
ALTER TABLE `edo_configuraciones` ADD `numero_referidos` INT NULL COMMENT 'textField,0,true,false,numeric' AFTER `pide_fuec`, 
ADD `porcentaje_referido` INT NULL COMMENT 'textField,0,true,false,numeric' AFTER `numero_referidos`,
ADD `bono_referido` INT NULL AFTER `porcentaje_referido`;
";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
  CREATE TABLE `edo_movimientos_referidos` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `id_servicio` int(11) DEFAULT NULL,
  `id_ref` int(11) DEFAULT NULL,
  `utilidad_interna_neto` double DEFAULT NULL,
  `utilidad_referido` double DEFAULT NULL,
  `porcentaje_referidos` int(11) DEFAULT NULL,
  `numero_referidos` int(11) DEFAULT NULL,
  `perfil` int(11) DEFAULT NULL,
  `nivel` int(11) DEFAULT NULL,
  `saldo` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `nuevo_saldo` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `usuario` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `empresa` int(11) DEFAULT NULL,
  `hora` time DEFAULT NULL,
  `fecha` date DEFAULT NULL,
  `bono_primer_viaje` double DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
ALTER TABLE `edo_taximetro_cliente` ADD `porcentaje_comision` INT(10) NULL AFTER `usuario`;
";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `edo_foraneo_clientes` ADD `porcentaje_empresa` INT(10) NULL AFTER `usuario`;
";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `edo_foraneo_clientes` ADD `porcentaje_proveedor` INT(10) NULL AFTER `usuario`;
";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
ALTER TABLE `edo_servicios` ADD `bodega_conductor` INT(10) NULL AFTER `valor_referido`;
";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
ALTER TABLE `edo_movimientos_referidos` CHANGE `usuario` `usuario_referido` VARCHAR(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL;
";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
ALTER TABLE `edo_movimientos_referidos` ADD `perfil_usuario_referido` INT NULL AFTER `bono_primer_viaje`;
";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
ALTER TABLE `edo_vehiculos` ADD `num_maletas` INT NULL AFTER `activar_servicios`;
";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
ALTER TABLE `edo_configuraciones` ADD `pedir_num_maletas` INT NULL AFTER `capacidad_pasajeros`;
";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
ALTER TABLE edo_foraneo_clientes MODIFY porcentaje_empresa  DOUBLE;
";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
ALTER TABLE edo_foraneo_clientes MODIFY porcentaje_proveedor  DOUBLE;
";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
ALTER TABLE `edo_configuraciones` ADD `usa_codigos_verificacion_servicio` VARCHAR(10) NULL AFTER `pedir_num_maletas`;
";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `edo_servicios` ADD `code_verifi_service` INT(4) NULL AFTER `bodega_conductor`,
ADD `code_verifi_service_fin` INT(4) NULL AFTER `code_verifi_service`;
";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
ALTER TABLE `edo_configuraciones` ADD `mostrar_valor_despues_abordaje` VARCHAR(10) NULL AFTER `usa_codigos_verificacion_servicio`;
";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
ALTER TABLE `edo_configuraciones` ADD `administrar_horarios_conductor` VARCHAR(10) NULL AFTER `mostrar_valor_despues_abordaje`;
";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
ALTER TABLE `pv_clientes` ADD `hora_inicio` TIME NULL AFTER `atiende_subservicios`;
";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
ALTER TABLE `pv_clientes` ADD `hora_fin` TIME NULL AFTER `hora_inicio`;
";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
ALTER TABLE `edo_servicios` ADD `valor_espera` DOUBLE NULL AFTER `code_verifi_service_fin`;
";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
ALTER TABLE `edo_servicios` ADD `tiempo_espera` DOUBLE NULL AFTER `valor_espera`;
";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
CREATE TABLE `edo_salas_soporte` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `comentario` text COLLATE utf8mb4_unicode_ci,
  `usuario` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `empresa` int(11) DEFAULT NULL,
  `perfil` int(11) DEFAULT NULL,
  `hora` time DEFAULT NULL,
  `fecha` date DEFAULT NULL,
  `estado` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
ALTER TABLE `edo_configuraciones` ADD `pedir_datos_viaje_airpot` DOUBLE NULL AFTER `administrar_horarios_conductor`;
";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
ALTER TABLE `edo_servicios` ADD `num_maletas` INT NULL AFTER `tiempo_espera`;
";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
ALTER TABLE `edo_servicios` ADD `num_personas` INT NULL AFTER `num_maletas`;
";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
ALTER TABLE `edo_configuraciones` ADD `tiempo_notificacion_servicio` INT NULL COMMENT 'textField,0,true,false,integer' AFTER `pedir_datos_viaje_airpot`;
";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
ALTER TABLE `edo_configuraciones` ADD `bloqueo_tardanzas` INT NULL COMMENT 'textField,0,true,false,integer' AFTER `hora_fin_atencion`, 
ADD `bloqueo_incumplimiento` INT NULL COMMENT 'textField,0,true,false,integer' AFTER `bloqueo_tardanzas`, 
ADD `bloqueo_no_aceptacion_servicios` INT NULL COMMENT 'textField,0,true,false,integer' AFTER `bloqueo_incumplimiento`;
";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
ALTER TABLE `pv_clientes` ADD `fecha_bloqueo` TIMESTAMP NULL AFTER `hora_fin`;
";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
ALTER TABLE `pv_clientes` ADD `numero_rechazos` TEXT NULL AFTER `fecha_bloqueo`;
";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }


        $sql = "
ALTER TABLE `nwmaker_plantillas_correos` ADD `correo_destino` VARCHAR(100) NULL AFTER `terminal`;
";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
ALTER TABLE `edo_servicios` ADD `saldo_user_aplicado` VARCHAR(100) NULL AFTER `num_personas`;
";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
ALTER TABLE `edo_configuraciones` ADD `hora_inicio_atencion` TIME NULL AFTER `tiempo_notificacion_servicio`;
";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
ALTER TABLE `edo_configuraciones` ADD `hora_fin_atencion` TIME NULL AFTER `hora_inicio_atencion`;
";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
ALTER TABLE `edo_configuraciones` ADD `minutos_a_adicionar_tardanzas` VARCHAR(10) NULL AFTER `bloqueo_tardanzas`;
";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
ALTER TABLE `edo_vehiculos` ADD `fecha_vencimiento_tegnomecanica` DATE NULL AFTER `num_maletas`;
";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
CREATE TABLE `edo_otros_documentos_conductor` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `nombre` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `conductor` int(11) DEFAULT NULL,
  `descripcion` text COLLATE utf8mb4_unicode_ci,
  `adjunto` text COLLATE utf8mb4_unicode_ci,
  `fecha` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `empresa` int(11) DEFAULT NULL,
  `usuario` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
ALTER TABLE `edo_taximetro` ADD `metros_paradas_adicionales` INT NULL AFTER `nombre`, ADD `valor_metros_parada_adicionales` DOUBLE NULL AFTER `metros_paradas_adicionales`;
";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }


        $sql = "
ALTER TABLE `edo_salas_soporte` ADD `token` TEXT NULL AFTER `estado`;
";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `edo_salas_soporte` ADD `ultimo_mensaje` TEXT NULL AFTER `estado`;
";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
ALTER TABLE `edo_salas_soporte` ADD `leido` tinyint(1) NULL AFTER `estado`;
";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `edo_configuraciones` ADD `repetir_servicio_continiuamente` VARCHAR(10) NULL AFTER `app_para`,
ADD `minutos_para_cerrar_servicio` VARCHAR(10) NULL AFTER `repetir_servicio_continiuamente`;
";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `documentos_conductor` ADD `capacitaciones` VARCHAR(10) NULL AFTER `referencias_per_lab`
";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
CREATE TABLE `edo_comparendos` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `id_conductor` int(11) DEFAULT NULL,
  `fecha_comparendo` date DEFAULT NULL,
  `adjunto` text COLLATE utf8mb4_unicode_ci,
  `numero_comparendo` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `vehiculo` int(11) DEFAULT NULL,
  `vehiculo_text` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `observacion` text COLLATE utf8mb4_unicode_ci,
  `usuario` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `empresa` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
";

        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
ALTER TABLE `pv_clientes` ADD `motivo_bloqueo` VARCHAR(100) NULL AFTER `numero_rechazos`;
";

        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `edo_configuraciones` ADD `usa_centros_de_costo` VARCHAR(4) NULL AFTER `bloqueo_no_aceptacion_servicios`;
";

        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `pv_clientes` ADD `centro_costo` INT NULL AFTER `motivo_bloqueo`;
";

        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `edo_recargas` ADD `checkoutRequestId` VARCHAR(200) NULL AFTER `tipo`;
";

        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `documentos_conductor` ADD `codigo_rut` VARCHAR(50) NULL AFTER `capacitaciones`;
";

        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `edo_configuraciones` ADD `foto_usuario_app` CHAR(2) NULL AFTER `bloqueo_no_aceptacion_servicios`;
";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `edo_configuraciones` ADD `codigo_rut` CHAR(50) NULL;
";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `documentos_conductor` ADD `adjunto_rut` TEXT NULL;
";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `edo_configuraciones` ADD `valor_minimo_recarga` DOUBLE NOT NULL COMMENT 'textField,0,true,false,numeric' AFTER `adjunto_rut`;

";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `edo_configuraciones` ADD `permitir_tomar_servicios_ocupado` VARCHAR(4) NULL AFTER `usa_centros_de_costo`;

";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `edo_servicios` ADD `servicio_cancelado` VARCHAR(4) NULL AFTER `saldo_user_aplicado`;

";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `edo_configuraciones` ADD `permitirReasignarConductor` VARCHAR(4) NULL AFTER `permitir_tomar_servicios_ocupado`;

";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `edo_configuraciones` ADD `usar_recarga_libre_driver` VARCHAR(4) NULL;

";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `edo_configuraciones` ADD `usar_recarga_libre_user` VARCHAR(4) NULL AFTER `usar_recarga_libre_driver`;

";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `edo_configuraciones` ADD `saldo_minimo_para_tomar_servicios_conductor` VARCHAR(100) NOT NULL COMMENT 'textField,0,true,false,money' AFTER `usar_recarga_libre_user`;

";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `edo_planes` ADD `tiempo_vencimiento` INT NULL COMMENT 'textField,0,true,false,integer' AFTER `fecha`;

";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
                ALTER TABLE `pv_clientes` 
                ADD `bodega_text` VARCHAR(100) NULL , 
                ADD `centro_costo_text` VARCHAR(100) NULL;
";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }


        $sql = "
            ALTER TABLE edo_foraneo ADD FULLTEXT(ciudad_o_lugar_origen)
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
            ALTER TABLE edo_foraneo ADD FULLTEXT(ciudad_o_lugar_destino)
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }


        $sql = "
           ALTER TABLE `edo_configuraciones` ADD `cobertura_por_ciudades` CHAR(25) NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
            CREATE TABLE `usuarios_referidos_register` (
  `id` int(11) NOT NULL,
  `usuario` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `usuario_refiere` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `fecha` timestamp NULL DEFAULT NULL,
  `perfil` int(11) NOT NULL,
  `empresa` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
          ALTER TABLE `edo_planes` ADD `perfil` INT NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
            ALTER TABLE `edo_configuraciones` 
            ADD `bloquear_conductor_fecha_vencimiento` CHAR(2) NULL, 
            ADD `recargar_saldo_planes_driver` CHAR(2) NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
         ALTER TABLE `edo_servicios` ADD `total_metros_final` INT NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
            ALTER TABLE `edo_taximetro` CHANGE `iva` `iva` DOUBLE NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
            ALTER TABLE `edo_comisiones` CHANGE `porcentaje` `porcentaje` DOUBLE NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
    ALTER TABLE `edo_servicios` 
    ADD `iva_porcentaje` DOUBLE NULL DEFAULT NULL AFTER `total_metros_final`, 
    ADD `valor_tarifa_minima` DOUBLE NULL DEFAULT NULL AFTER `iva_porcentaje`, 
    ADD `porcentaje_empresa` DOUBLE NULL DEFAULT NULL AFTER `valor_tarifa_minima`, 
    ADD `porcentaje_proveedor` DOUBLE NULL DEFAULT NULL AFTER `porcentaje_empresa`;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
         ALTER TABLE `edo_servicios` 
         CHANGE `calificacion` `calificacion` DOUBLE NULL DEFAULT NULL, 
         CHANGE `calificacion_conductor` `calificacion_conductor` DOUBLE NULL DEFAULT NULL, 
         CHANGE `comision_porcentaje` `comision_porcentaje` DOUBLE NULL DEFAULT NULL, 
         CHANGE `utilidad_conductor` `utilidad_conductor` DOUBLE NULL DEFAULT NULL, 
         CHANGE `utilidad_empresa` `utilidad_empresa` DOUBLE NULL DEFAULT NULL, 
         CHANGE `valor_metros_add` `valor_metros_add` DOUBLE NULL DEFAULT NULL, 
         CHANGE `inicia_metros_add` `inicia_metros_add` DOUBLE NULL DEFAULT NULL, 
         CHANGE `valor_peajes` `valor_peajes` DOUBLE NULL DEFAULT NULL, 
         CHANGE `valor_recargo_ruta_fija` `valor_recargo_ruta_fija` DOUBLE NULL DEFAULT NULL, 
         CHANGE `valorbase` `valorbase` DOUBLE NULL DEFAULT NULL, 
         CHANGE `valorminutos` `valorminutos` DOUBLE NULL DEFAULT NULL, 
         CHANGE `valordistancia` `valordistancia` DOUBLE NULL DEFAULT NULL, 
         CHANGE `valor_unidad_tiempo` `valor_unidad_tiempo` DOUBLE NULL DEFAULT NULL, 
         CHANGE `valor_unidad_metros` `valor_unidad_metros` DOUBLE NULL DEFAULT NULL, 
         CHANGE `metros_cobro_recargo` `metros_cobro_recargo` DOUBLE NULL DEFAULT NULL, 
         CHANGE `metros_cobro_peaje` `metros_cobro_peaje` DOUBLE NULL DEFAULT NULL, 
         CHANGE `valor_referido` `valor_referido` DOUBLE NULL DEFAULT NULL, 
         CHANGE `valor_espera` `valor_espera` DOUBLE NULL DEFAULT NULL, 
         CHANGE `tiempo_espera` `tiempo_espera` DOUBLE NULL DEFAULT NULL, 
         CHANGE `total_metros_final` `total_metros_final` DOUBLE NULL DEFAULT NULL, 
         CHANGE `valor_tarifa_minima` `valor_tarifa_minima` DOUBLE NULL DEFAULT NULL, 
         CHANGE `porcentaje_empresa` `porcentaje_empresa` DOUBLE NULL DEFAULT NULL, 
         CHANGE `porcentaje_proveedor` `porcentaje_proveedor` DOUBLE NULL DEFAULT NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `edo_servicios` 
ADD `paradas_adicional_numero_total` INT NULL,
ADD `paradas_adicional_valor_unitario` DOUBLE NULL, 
ADD `paradas_adicional_valor_total` DOUBLE NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `edo_posicion_users` 
ADD `latitudEnd` VARCHAR(100) NULL,
ADD `longitudEnd` VARCHAR(100) NULL,
ADD `metros` DOUBLE NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `edo_posicion_users` 
CHANGE `hora` `hora` TIME NULL, 
CHANGE `latitud` `latitud` VARCHAR(300) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL, 
CHANGE `longitud` `longitud` VARCHAR(300) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL, 
CHANGE `usuario` `usuario` INT(11) NULL, 
CHANGE `usuario_text` `usuario_text` VARCHAR(200) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL, 
CHANGE `pais` `pais` VARCHAR(300) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL, 
CHANGE `localidad` `localidad` VARCHAR(300) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL, 
CHANGE `direccion` `direccion` VARCHAR(300) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL, 
CHANGE `ciudad` `ciudad` VARCHAR(300) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL, 
CHANGE `barrio` `barrio` VARCHAR(300) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `edo_posicion_users` ADD `id_servicio` INT NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `edo_servicios` ADD `valor_final_sin_iva` DOUBLE NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `edo_posicion_users` ADD `tipo` CHAR(40) NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
ALTER TABLE `trans_servicio_parada` CHANGE `fecha` `fecha` TIMESTAMP NULL DEFAULT NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `nc_cupones_redimidos` CHANGE `fecha` `fecha` TIMESTAMP NULL DEFAULT NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
 ALTER TABLE `trans_favoritos` CHANGE `fecha` `fecha` TIMESTAMP NULL DEFAULT NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `trans_servicio_parada` CHANGE `fecha` `fecha` TIMESTAMP NULL DEFAULT NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
ALTER TABLE `nc_config` ADD `usa_api_logimov` CHAR(2) NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
            ALTER TABLE `nc_config` 
            ADD `observaciones` VARCHAR(150) NULL,
            ADD `terminal` INT NULL, 
            ADD `usa_api_logimov` CHAR(2) NULL, 
            ADD `usa_api_logimov_domain` VARCHAR(100) NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
         ALTER TABLE `nc_config` 
         ADD `api_user` VARCHAR(100) NULL, 
         ADD `api_pass` VARCHAR(100) NULL, 
         ADD `api_profile` INT NULL, 
         ADD `api_company` INT NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
        ALTER TABLE `nc_config` ADD `api_empresa` INT NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
      ALTER TABLE `nc_config` ADD `api_domain_images` VARCHAR(100) NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `documentos_conductor` ADD `datos_contacto_emergencia` TEXT NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `edo_vehiculos` 
ADD `vehiculo_poliza_todoriesgo` DATE NULL, 
ADD `vehiculo_poliza_contractual` DATE NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }


        $sql = "
            ALTER TABLE `edo_servicios` ADD `cliente_foto` VARCHAR(100) NULL;  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
            ALTER TABLE `edo_subservice` ADD `porcentaje_aumento` DOUBLE NULL;
            ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
            ALTER TABLE `edo_vehiculos` ADD `concepto_bloqueo` VARCHAR(200) NULL;
            ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
            ALTER TABLE `empresas` ADD `dominio_back` VARCHAR(100) NULL;
            ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
            ALTER TABLE `edo_servicios` ADD `consec_fuec` INT NULL;
            ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }


        $sql = "
CREATE TABLE `edo_fuec_consecutivos` (
  `id` int(11) NOT NULL,
  `id_servicio` int(11) NOT NULL,
  `consecutivo` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `edo_fuec_consecutivos`
  ADD PRIMARY KEY (`id`);
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `edo_fuec_consecutivos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `empresas` 
ADD `logo_ministerio` VARCHAR(150) NULL, 
ADD `fuec_numeracion_fija` CHAR(11) NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
ALTER TABLE `empresas` ADD `imagen_sello_fuec` VARCHAR(100) NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        if (isset($_SESSION["app_name"]) && $_SESSION["app_name"] === "movilmove") {
            $sql = "
CREATE TABLE IF NOT EXISTS `nwmaker_contrato_consecutivo` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT 'textField,0,false',
  `usuario` varchar(150) NOT NULL,
  `empresa` int NOT NULL,
  `fecha` timestamp NOT NULL,
  `contrato_consecutivo` CHAR(4) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;
  ";
            $ca->prepare($sql);
            if (!$ca->exec()) {
                master::logSystemError($ca->lastErrorText());
            }
            $sql = "
ALTER TABLE `edo_empresas` CHANGE `contrato` `contrato` CHAR(4) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL;
  ";
            $ca->prepare($sql);
            if (!$ca->exec()) {
                master::logSystemError($ca->lastErrorText());
            }
            $sql = "
ALTER TABLE `edo_empresas` ADD `contrato_adjunto` VARCHAR(100) NULL;
  ";
            $ca->prepare($sql);
            if (!$ca->exec()) {
                master::logSystemError($ca->lastErrorText());
            }
            $sql = "
ALTER TABLE `nwmaker_contrato_consecutivo` 
ADD `id_empresa` INT NULL, 
ADD `usuario_pasajero` VARCHAR(150) NULL;
  ";
            $ca->prepare($sql);
            if (!$ca->exec()) {
                master::logSystemError($ca->lastErrorText());
            }
            $sql = "
ALTER TABLE `nwmaker_contrato_consecutivo` CHANGE `empresa` `empresa` INT NULL;
  ";
            $ca->prepare($sql);
            if (!$ca->exec()) {
                master::logSystemError($ca->lastErrorText());
            }
            $sql = "
CREATE TABLE IF NOT EXISTS `edo_configuraciones_documentos_driver` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT 'textField,0,false',
  `usuario` varchar(150) NOT NULL,
  `empresa` int NOT NULL,
  `fecha` timestamp NOT NULL,
  `foto_perfil` char(2) NULL,
  `tipo_doc` char(2) NULL,
  `nit` char(2) NULL,
  `documento_imagen` char(2) NULL,
  `documento_imagen_respaldo` char(2) NULL,
  `direccion_domicilio` char(2) NULL,
  `celular` char(2) NULL,
  `afp` char(2) NULL,
  `eps` char(2) NULL,
  `arl` char(2) NULL,
  `referencias_per_lab` char(2) NULL,
  `no_licencia` char(2) NULL,
  `lic_conductor1` char(2) NULL,
  `lic_conductor2` char(2) NULL,
  `selfie_licencia` char(2) NULL,
  `hoja_vida` char(2) NULL,
  `antecedentes_judiciales` char(2) NULL,
  `codigo_rut` char(2) NULL,
  `adjunto_rut` char(2) NULL,
  `capacitaciones` char(2) NULL,
  `adjuntos_html` char(2) NULL,
  `datos_contacto_emergencia` char(2) NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;
  ";
            $ca->prepare($sql);
            if (!$ca->exec()) {
                master::logSystemError($ca->lastErrorText());
            }
            $sql = "
CREATE TABLE IF NOT EXISTS `edo_configuraciones_documentos_vehiculos` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT 'textField,0,false',
  `usuario` varchar(150) NOT NULL,
  `empresa` int NOT NULL,
  `fecha` timestamp NOT NULL,
  `vehiculo_publico_particular` char(2) NULL,
  `imagen_vehi` char(2) NULL,
  `tipo_vehiculo` char(2) NULL,
  `placa` char(2) NULL,
  `descripcion_carroceria` char(2) NULL,
  `capacidad_carga_kg` char(2) NULL,
  `capacidad_volumen_m3` char(2) NULL,
  `marca_text` char(2) NULL,
  `marca` char(2) NULL,
  `modelo` char(2) NULL,
  `color` char(2) NULL,
  `numero_puertas` char(2) NULL,
  `capacidad_pasajeros` char(2) NULL,
  `num_maletas` char(2) NULL,
  `foto_soat` char(2) NULL,
  `fecha_vencimiento_soat` char(2) NULL,
  `tarjeta_propiedad` char(2) NULL,
  `tarjeta_propiedad_trasera` char(2) NULL,
  `revision_tegnomecanica` char(2) NULL,
  `fecha_vencimiento_tegnomecanica` char(2) NULL,
  `nombre_propietario` char(2) NULL,
  `identificacion_propietario` char(2) NULL,
  `rut` char(2) NULL,
  `direccion_proietario` char(2) NULL,
  `telefono_proietario` char(2) NULL,
  `numero_tarjeta_operacion` char(2) NULL,
  `numero_interno` char(2) NULL,
  `vehiculo_poliza_contractual` char(2) NULL,
  `vehiculo_poliza_todoriesgo` char(2) NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;
  ";
            $ca->prepare($sql);
            if (!$ca->exec()) {
                master::logSystemError($ca->lastErrorText());
            }
            $sql = "
ALTER TABLE `edo_vehiculos` ADD `vehiculo_publico_particular` CHAR(20) NULL;
  ";
            $ca->prepare($sql);
            if (!$ca->exec()) {
                master::logSystemError($ca->lastErrorText());
            }
            $sql = "
 ALTER TABLE `edo_servicios` CHANGE `estado_final` `estado_final` CHAR(50) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL;
  ";
            $ca->prepare($sql);
            if (!$ca->exec()) {
                master::logSystemError($ca->lastErrorText());
            }
        }


        $sql = "
ALTER TABLE `edo_configuraciones` ADD `minutosMinimosParaPedirService` CHAR(3) NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `edo_taximetro` ADD `minutosMinimosParaPedirService` CHAR(20) NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
                ALTER TABLE `trans_servicio_parada` ADD `nombre_pasajero` VARCHAR(100) NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
                ALTER TABLE `edo_configuraciones` ADD `link_soporte_conductor` VARCHAR(200) NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
                ALTER TABLE `edo_configuraciones` ADD `usaSitca` CHAR(2) NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
                ALTER TABLE `edo_configuraciones` ADD `tipos_vehiculos_independientes_otras_empresas` CHAR(2) NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
            ALTER TABLE `edo_configuraciones` 
            ADD `clienteServicioPorDefecto` CHAR(3) NULL, 
            ADD `clientePreciosVisibles` CHAR(10) NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
            ALTER TABLE `edo_configuraciones` ADD `clienteEstadoCreaServicios` CHAR(25) NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `edo_servicios` 
ADD `liquida_usuario` VARCHAR(100) NULL, 
ADD `liquida_fecha` TIMESTAMP NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `edo_servicios` ADD `cliente_empresa_id` INT NULL, ADD `cliente_sede_id` INT NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
            ALTER TABLE `mov_enrutamiento` ADD `id_servicio` INT NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
            ALTER TABLE `edo_servicios` ADD `times_dis_travel_gps` TEXT NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `edo_configuraciones` 
ADD `crear_viaje_sentido_por_defecto` CHAR(15) NULL, 
ADD `crear_viaje_cliente_id_por_defecto` INT NULL, 
ADD `crear_viaje_sede_id_por_defecto` INT NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
            ALTER TABLE `trans_servicio_parada` ADD `tipo` CHAR(30) NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
      ALTER TABLE `edo_configuraciones` ADD `driver_asignar_automatic_servicios_back` CHAR(2) NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
 ALTER TABLE `edo_servicios` 
 ADD `calificacion_conductor_comentarios` VARCHAR(200) NULL, 
 ADD `calificacion_cliente` VARCHAR(200) NULL, 
 ADD `calificacion_cliente_comentarios` VARCHAR(200);
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `edo_servicios` CHANGE `calificacion_cliente` `calificacion_cliente` INT NULL DEFAULT NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
            ALTER TABLE `edo_configuraciones` ADD `conductores_siempre_online` CHAR(2) NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
            ALTER TABLE `trans_servicio_parada` ADD `token_usuario` TEXT NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `edo_configuraciones` ADD `driver_mostrar_califica_viaje` CHAR(2) NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
 CREATE TABLE `edo_linea_tiempo` (
  `id` int NOT NULL,
  `id_servicio` int DEFAULT NULL,
  `usuario` varchar(150) DEFAULT NULL,
  `accion` text,
  `empresa` int DEFAULT NULL,
  `perfil` int DEFAULT NULL,
  `fecha` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `edo_linea_tiempo`
  ADD PRIMARY KEY (`id`);
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `edo_linea_tiempo`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
            ALTER TABLE `edo_linea_tiempo` ADD `modulo` TEXT NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `edo_linea_tiempo` ADD `comentarios` TEXT NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `edo_linea_tiempo` 
ADD `latitud` VARCHAR(200) NULL, 
ADD `longitud` VARCHAR(200) NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `edo_servicios` 
ADD `ciudad_conductores_id` INT NULL, 
ADD `ciudad_conductores_nombre` VARCHAR(120) NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `edo_configuraciones` 
ADD `latitud_mapa_crear_servicios` CHAR(30) NULL, 
ADD `longitud_mapa_crear_servicios` CHAR(30) NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `edo_configuraciones` ADD `zoom_mapa_crear_servicios` CHAR(30) NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `edo_configuraciones` ADD `servicio_para_por_defecto` CHAR(10) NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `edo_configuraciones` 
ADD `crearviajefields_pasajeros_filtros` CHAR(2) NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `edo_configuraciones` 
ADD `crear_viaje_fields_settings` TEXT NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `pv_clientes` 
ADD `placa_activa` VARCHAR(10) NULL ;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `edo_configuraciones` 
ADD `booking_activo` CHAR(2) NULL, 
ADD `booking_key` VARCHAR(50) NULL ;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `edo_servicios` CHANGE `usuario` `usuario` VARCHAR(100) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `trans_servicio_parada` CHANGE `ciudad_parada` `ciudad_parada` VARCHAR(200) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `edo_servicios` ADD `moneda` CHAR(5) NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `edo_servicios` ADD `vuelo_numero` VARCHAR(8) NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `edo_configuraciones` ADD `moneda_por_defecto` CHAR(5) NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `edo_servicios` CHANGE `valor` `valor` VARCHAR(100) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `edo_configuraciones` ADD `precioMinimoIgualInicio` CHAR(2) NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `edo_configuraciones` ADD `precioFinalIgualInicio` CHAR(2) NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `edo_servicios` ADD `booking_id_journey` INT NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
ALTER TABLE `edo_configuraciones` ADD `css_app_driver` TEXT NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `edo_configuraciones` ADD `css_app_pax` TEXT NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `edo_configuraciones` ADD `paradaValidaFinalizar` CHAR(2) NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `edo_servicios` ADD `fecha_final_estimada` TIMESTAMP NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `edo_vehiculos` ADD `id_otros_conductores` VARCHAR(200) NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `edo_servicios` 
ADD `flota_id` INT NULL, ADD `flota_text` VARCHAR(150) NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `edo_configuraciones` ADD `historial_app_driver_minutos_ver_reservados` INT NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `trans_servicio_parada` ADD `usuario_principal_del_viaje` VARCHAR(150) NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `edo_configuraciones` 
ADD `foto_para_iniciar_servicio` CHAR(2) NULL, 
ADD `foto_para_confirmar_llegada` CHAR(2) NULL, 
ADD `foto_para_confirmar_abordaje` CHAR(2) NULL, 
ADD `foto_para_finalizar_servicio` CHAR(2) NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `edo_configuraciones` 
ADD `use_telefono_principal_en_paradas` CHAR(2) NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `edo_configuraciones` 
ADD `use_chat_principal_en_paradas` CHAR(2) NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `edo_configuraciones` 
ADD `paises_iso_relation_autocomplete_maps` CHAR(40) NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `edo_posicion_users` ADD `speed` VARCHAR(50) NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `edo_configuraciones` ADD `usar_distancia_punto_recogida` CHAR(2) NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `edo_configuraciones` ADD `apiGoogleTrafficBack` CHAR(2) NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `edo_recargos` CHANGE `fecha_fin` `fecha_fin` DATE NULL DEFAULT NULL COMMENT 'dateField';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `edo_recargos` CHANGE `desde` `desde` TIME NULL DEFAULT NULL COMMENT 'timeField', CHANGE `hasta` `hasta` TIME NULL DEFAULT NULL COMMENT 'timeField';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `edo_recargos` CHANGE `estado` `estado` VARCHAR(100) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT 'selectBox,array';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
 ALTER TABLE edo_recargos COMMENT ' [
   {
                    \"selectBoxArrays\": [
              {
                \"name\": \"estado\",
                \"data\": {
                    \"activo\": \"Activo\",
                    \"inactivo\": \"Inactivo\"
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
ALTER TABLE `edo_configuraciones` ADD `valor_minimo_activacion_tarjeta_credito` CHAR(5) NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
             ALTER TABLE `edo_vehiculos` ADD `fecha_vencimiento_numero_tarjeta_operacion` DATE NULL DEFAULT NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
             ALTER TABLE `edo_configuraciones_documentos_vehiculos` ADD `fecha_vencimiento_numero_tarjeta_operacion` CHAR(2) NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `edo_configuraciones` ADD `usa_banners_promo` CHAR(2) NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `edo_configuraciones` ADD `busca_servicios_conductor` CHAR(2) NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `edo_configuraciones` ADD `usa_bloqueo_conductores` CHAR(2) NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `edo_configuraciones` ADD `verServiciosReservados` CHAR(2) NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `edo_configuraciones` ADD `enviar_mail_final_driver` CHAR(2) NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
             ALTER TABLE `edo_configuraciones` ADD `omitir_fotos_driver_en_servicio` CHAR(2) NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
             ALTER TABLE `edo_configuraciones` ADD `usar_api_polylinea_pedir_servicio` CHAR(2) NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
  ALTER TABLE `edo_configuraciones` ADD `notifica_drivers_offline_servicio` CHAR(2) NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `edo_configuraciones` ADD `cobertura_ciudades_exactas` CHAR(2) NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
             ALTER TABLE `edo_configuraciones` ADD `usar_preoperacional_dynamic` CHAR(2) NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
CREATE TABLE `edo_motivos_rechazos` (
  `id` bigint UNSIGNED NOT NULL,
  `empresa` int DEFAULT NULL,
  `usuario` varchar(100) COLLATE utf8mb3_bin DEFAULT NULL,
  `fecha` date DEFAULT NULL,
  `nombre` varchar(100) COLLATE utf8mb3_bin DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_bin;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `edo_motivos_rechazos`
  ADD UNIQUE KEY `id` (`id`);
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `edo_motivos_rechazos`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
alter table edo_servicios add column motivo_rechazo varchar(10) NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
alter table edo_servicios add column motivo_rechazo_text varchar(100) NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
alter table edo_servicios add column fecha_rechazo timestamp NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `edo_vehiculos` ADD `usuario_usando` VARCHAR(120) NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
 CREATE TABLE `edo_booking_journeys_accepted` (
  `id` int NOT NULL COMMENT 'textField,0,false',
  `empresa` int DEFAULT NULL COMMENT 'textField,0,false',
  `json` text COMMENT 'textArea',
  `fecha_creacion` timestamp NULL DEFAULT NULL,
  `booking_id` varchar(50) DEFAULT NULL,
  `booking_code` varchar(50) DEFAULT NULL,
  `id_servicio` int DEFAULT NULL,
  `usuario` varchar(100) DEFAULT NULL,
  `fecha_actualizacion` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `edo_booking_journeys_accepted`
  ADD PRIMARY KEY (`id`);
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `edo_booking_journeys_accepted`
  MODIFY `id` int NOT NULL AUTO_INCREMENT COMMENT 'textField,0,false';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `edo_booking_journeys_accepted` ADD `fecha_servicio` TIMESTAMP NULL AFTER `fecha_actualizacion`, ADD `estado` CHAR(60) NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
CREATE TABLE `edo_servicios_rotulos` (
  `id` int NOT NULL COMMENT 'textField,0,false',
  `id_servicio` int DEFAULT NULL,
  `id_guia_sitca` int DEFAULT NULL,
  `estado` char(35) DEFAULT NULL,
  `fecha` timestamp NULL DEFAULT NULL,
  `json` text COMMENT 'textArea'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `edo_servicios_rotulos`
  ADD PRIMARY KEY (`id`);
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `edo_servicios_rotulos`
  MODIFY `id` int NOT NULL AUTO_INCREMENT COMMENT 'textField,0,false';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
CREATE TABLE `edo_servicios_conductores_notificados` (
  `id` int NOT NULL COMMENT 'textField,0,false',
  `id_servicio` int NOT NULL,
  `drivers` text NOT NULL,
  `empresa` int NOT NULL COMMENT 'textField,0,false',
  `fecha` timestamp NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `edo_servicios_conductores_notificados`
  ADD PRIMARY KEY (`id`);
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `edo_servicios_conductores_notificados`
  MODIFY `id` int NOT NULL AUTO_INCREMENT COMMENT 'textField,0,false';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
CREATE TABLE `edo_wompi_config` (
  `id` int NOT NULL COMMENT 'textField,0,false',
  `empresa` int DEFAULT NULL COMMENT 'textField,0,false',
  `activo` char(2) DEFAULT NULL COMMENT 'selectBox,boolean',
  `llavePublica` varchar(150) DEFAULT NULL COMMENT 'textArea'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `edo_wompi_config` ADD PRIMARY KEY(`id`);
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `edo_wompi_config` ADD UNIQUE(`id`);
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `edo_wompi_config` CHANGE `id` `id` INT NOT NULL AUTO_INCREMENT COMMENT 'textField,0,false';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `edo_wompi_config` ADD `llavePrivada` VARCHAR(150) NULL AFTER `llavePublica`;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `edo_wompi_config` ADD `redirectUrl` VARCHAR(150) NULL AFTER `llavePrivada`;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
CREATE TABLE `edo_formas_pago` (
  `id` int NOT NULL COMMENT 'textField,0,false',
  `nombre` varchar(65) DEFAULT NULL COMMENT 'textField',
  `empresa` int DEFAULT NULL COMMENT 'textField,0,false'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `edo_formas_pago`
  ADD PRIMARY KEY (`id`);
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `edo_formas_pago`
  MODIFY `id` int NOT NULL AUTO_INCREMENT COMMENT 'textField,0,false';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `pv_clientes` CHANGE `metodo_de_pago` `metodo_de_pago` CHAR(15) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT 'efectivo';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
CREATE TABLE `edo_configuraciones_carga` (
  `id` int NOT NULL,
  `empresa` int NOT NULL,
  `numero_auxiliares` char(2) DEFAULT NULL,
  `contacto_recogida` char(2) DEFAULT NULL,
  `telefono_recogida` char(2) DEFAULT NULL,
  `observaciones_recogida` char(2) DEFAULT NULL,
  `contacto_entrega` char(2) DEFAULT NULL,
  `telefono_entrega` char(2) DEFAULT NULL,
  `observaciones_entrega` char(2) DEFAULT NULL,
  `descripcion_carga` char(2) DEFAULT NULL,
  `empaque` char(2) DEFAULT NULL,
  `cantidad` char(2) DEFAULT NULL,
  `volumen` char(2) DEFAULT NULL,
  `peso` char(2) DEFAULT NULL,
  `valor_declarado` char(2) DEFAULT NULL,
  `salida_periferia` char(2) DEFAULT NULL,
  `despacho` char(2) DEFAULT NULL,
  `retorno` char(2) DEFAULT NULL,
  `cargue` char(2) DEFAULT NULL,
  `descargue` char(2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `edo_configuraciones_carga`
  ADD PRIMARY KEY (`id`);
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `edo_configuraciones_carga`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `edo_servicios` ADD `tipo_urbanrural` CHAR(15) NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
                  ALTER TABLE `edo_servicios` 
                  ADD `motivo_rechazo` CHAR(10) NULL, 
                  ADD `observaciones_rechazo` VARCHAR(100) NULL, 
                  ADD `adjunto_cotizacion_aprobada` VARCHAR(100) NULL, 
                  ADD `numero_expediente` VARCHAR(50) NULL, 
                  ADD `adjunto_cotizacion` VARCHAR(100) NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `edo_servicios` ADD `id_relation_group_travel` INT NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `edo_servicio_parada` 
ADD `origen_manual_direccion` VARCHAR(100) NULL, 
ADD `origen_manual_latitud` VARCHAR(50) NULL, 
ADD `origen_manual_longitud` VARCHAR(50) NULL, 
ADD `origen_manual_pais` VARCHAR(70) NULL, 
ADD `origen_manual_ciudad` VARCHAR(100) NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `edo_servicio_parada` ADD `estado_origendestino` CHAR(25) NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `edo_servicios` ADD `conductor_proximo` VARCHAR(50) NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `edo_enrutamiento` 
ADD `origen_manual_direccion` VARCHAR(100) NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `edo_enrutamiento` 
ADD `origen_manual_latitud` VARCHAR(50) NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `edo_enrutamiento` 
ADD `origen_manual_longitud` VARCHAR(50) NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `edo_enrutamiento` 
ADD `origen_manual_pais` VARCHAR(70) NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `edo_enrutamiento` 
ADD `origen_manual_ciudad` VARCHAR(100) NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `edo_enrutamiento` 
ADD `origen_manual_nombre` VARCHAR(100) NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
            CREATE TABLE `edo_enrutamiento_rotulos` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `empresa` int DEFAULT NULL,
  `usuario` varchar(30) COLLATE utf8mb3_bin DEFAULT NULL,
  `fecha` date DEFAULT NULL,
  `estado` varchar(30) COLLATE utf8mb3_bin DEFAULT NULL,
  `id_servicio` int DEFAULT NULL,
  `numero_guia` varchar(30) COLLATE utf8mb3_bin DEFAULT NULL,
  `rotulos` text COLLATE utf8mb3_bin,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_bin;
    ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `edo_servicios` ADD `valor_viaje_booking` VARCHAR(100) NULL;
    ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
            ALTER TABLE `edo_servicios` ADD `booking_id_real_journey` VARCHAR(50) NULL;
    ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
 ALTER TABLE `edo_fotos_relacionadas` ADD `tipo` CHAR(30) NULL, ADD `id_parada` INT NULL;
    ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `edo_configuraciones` ADD `booking_url_endpoint` VARCHAR(100) NULL COMMENT 'textField';
    ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `edo_linea_tiempo` ADD `dispositivo` VARCHAR(100) NULL;
    ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `edo_enrutamiento_rotulos` ADD `id_parada` INT NULL;
    ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `edo_configuraciones` ADD `usa_rotulos_en_paradas` CHAR(2) NULL;
    ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE edo_tipologia_novedad_paradas ADD `aplica_no_abordo` CHAR(2) NULL;
    ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
            ALTER TABLE `edo_enrutamiento_rotulos` ADD `rotulos_finales` TEXT NULL;
    ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `edo_configuraciones` ADD `minutos_de_vida_notificacion_conductores_viajes_ahora` CHAR(6) NULL;
    ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
            ALTER TABLE `edo_posicion_users` ADD `placa` CHAR(15) NULL;
    ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
            ALTER TABLE `edo_vehiculos` ADD `latitud` VARCHAR(100) NULL DEFAULT NULL,
 ADD `longitud` VARCHAR(100) NULL DEFAULT NULL,
  ADD `geoloc_fecha` TIMESTAMP NULL DEFAULT NULL, 
  ADD `last_service_id` INT NULL DEFAULT NULL ;
  ALTER TABLE `edo_vehiculos` ADD `geoloc_last_user` VARCHAR(100) NULL DEFAULT NULL;
    ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
         ALTER TABLE `edo_servicios` ADD `latitud_actual` VARCHAR(100) NULL DEFAULT NULL , ADD `longitud_actual` VARCHAR(100) NULL DEFAULT NULL;
    ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
            ALTER TABLE `pv_clientes` ADD `zonaHorariaActual` VARCHAR(100) NULL;
    ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
            CREATE TABLE `edo_usuarios_terminales` (
  `id` int(11) NOT NULL,
  `usuario` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `fecha` timestamp NULL DEFAULT NULL,
  `terminal` int(11) NOT NULL,
  `empresa` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=latin1;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `edo_configuraciones` ADD `user_confirma_valor_pedir_service` CHAR(2) NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
            CREATE TABLE `edo_app_permisos_users` (
  `id` int(11) NOT NULL,
  `usuario` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `empresa` int(11) NULL,
  `perfil` int(11) NULL,
  `text` TEXT NULL,
  `fecha` timestamp NULL DEFAULT NULL,
  `fecha_server` timestamp NULL DEFAULT NULL,
  `os` CHAR(50) NULL,
  `token` TEXT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=latin1;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
        ALTER TABLE `edo_app_permisos_users` CHANGE `id` `id` INT NOT NULL AUTO_INCREMENT;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `edo_configuraciones` ADD `driver_puede_ofertar_valor_servicio` CHAR(2) NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
            CREATE TABLE `edo_servicios_ofertas` (
  `id` int(11) NOT NULL,
  `usuario` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `empresa` int(11) NULL,
  `perfil` int(11) NULL,
  `id_servicio` int(11) NULL,
  `estado` CHAR(50) NULL,
  `oferta` VARCHAR(50) NULL,
  `fecha` timestamp NULL DEFAULT NULL,
  `fecha_server` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=latin1;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
           ALTER TABLE `edo_servicios_ofertas` CHANGE `id` `id` INT NOT NULL AUTO_INCREMENT;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
                  ALTER TABLE `edo_servicios_ofertas` ADD `token` TEXT NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `edo_servicios_ofertas` ADD `conductor_foto` VARCHAR(100) NULL, 
ADD `conductor_marca_carro` VARCHAR(100) NULL, 
ADD `conductor_nombre` VARCHAR(100) NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `edo_servicios_ofertas` ADD `conductor_foto_carro` VARCHAR(100) NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
                  ALTER TABLE `edo_servicios_ofertas` ADD `usuario_pasajero` VARCHAR(100) NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `edo_servicios` ADD `ofertado` CHAR(2) NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `edo_configuraciones` ADD `ofertar_valor_salto_mas_menos` CHAR(2) NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `edo_configuraciones` ADD `app_cliente_trae_pasajeros_vista_principal` CHAR(2) NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
CREATE TABLE `edo_servicios_calificaciones` 
( `id` INT NOT NULL AUTO_INCREMENT , 
`id_servicio` INT NOT NULL , 
`id_parada` INT NOT NULL , 
`fecha` TIMESTAMP NOT NULL , 
`usuario_pasajero` VARCHAR(150) NOT NULL , 
`usuario_conductor` VARCHAR(150) NOT NULL , 
`calificacion_pasajero` VARCHAR(150) NOT NULL , 
`comentarios_pasajero` VARCHAR(150) NOT NULL , 
`calificacion_conductor` VARCHAR(150) NOT NULL , 
`comentarios_conductor` VARCHAR(150) NOT NULL , 
`empresa` INT NOT NULL , PRIMARY KEY (`id`)) ENGINE = InnoDB;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `edo_servicio_parada` ADD `calificacion_a_conductor` CHAR(10) NULL AFTER `estado_origendestino`;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
               ALTER TABLE `edo_servicio_parada` ADD `calificacion_a_conductor_comentarios` VARCHAR(100) NULL AFTER `calificacion_a_conductor`;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `edo_configuraciones` ADD `notifica_admin_por_correo` CHAR(2) NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `edo_configuraciones` ADD `app_conductor_ve_cartel_vuelo` CHAR(2) NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
CREATE TABLE `edo_config_destinatarios_email` 
( `id` INT NOT NULL AUTO_INCREMENT , 
`correo_destinatario` VARCHAR(150) NOT NULL , 
`cliente` INT(11) NULL , 
`usuario` VARCHAR(150) NULL , 
`empresa` INT NOT NULL , PRIMARY KEY (`id`)) ENGINE = InnoDB;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `edo_foraneo` ADD `valor_pasajero_adicional` INT NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `edo_foraneo` ADD `pasajero_adicional_rango_inicia_cobro` INT NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
                 ALTER TABLE `edo_configuraciones` ADD `usa_firebase` CHAR(2) NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
                 ALTER TABLE `edo_configuraciones` ADD `usa_firebase_modo_pruebas` CHAR(2) NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
                 ALTER TABLE `edo_configuraciones` ADD `usa_favoritos_app_user` CHAR(2) NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `edo_servicios_calificaciones` 
CHANGE `id_servicio` `id_servicio` INT NULL, CHANGE `id_parada` `id_parada` INT NULL, 
CHANGE `fecha` `fecha` TIMESTAMP NULL, 
CHANGE `usuario_pasajero` `usuario_pasajero` VARCHAR(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL, 
CHANGE `usuario_conductor` `usuario_conductor` VARCHAR(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL, 
CHANGE `calificacion_pasajero` `calificacion_pasajero` VARCHAR(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL, 
CHANGE `comentarios_pasajero` `comentarios_pasajero` VARCHAR(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL, 
CHANGE `calificacion_conductor` `calificacion_conductor` VARCHAR(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL, 
CHANGE `comentarios_conductor` `comentarios_conductor` VARCHAR(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL, 
CHANGE `empresa` `empresa` INT NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `edo_configuraciones` ADD `mostrar_chat_a_conductor_de_pax_principal` CHAR(2) NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `edo_configuraciones` ADD `mostrar_telefono_a_conductor_de_pax_principal` CHAR(2) NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `edo_configuraciones` ADD `mostrar_boton_ver_pasajeros_a_conductor_en_pax_principal` CHAR(2) NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE edo_configuraciones_documentos_driver ADD `email` CHAR(2) NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE edo_configuraciones_documentos_driver ADD `activar_servicios` CHAR(2) NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE edo_configuraciones_documentos_driver ADD `clave` CHAR(2) NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE edo_configuraciones_documentos_driver ADD `pais` CHAR(2) NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE edo_configuraciones_documentos_driver ADD `ciudad` CHAR(2) NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
                 ALTER TABLE `edo_configuraciones` ADD `usa_firebase_account` CHAR(2) NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `edo_config_destinatarios_email` 
ADD `usuario_back` VARCHAR(50) NULL, 
ADD `id_usuario_pc` INT NULL, 
ADD `email_pc` VARCHAR(100) NULL, 
ADD `nombre_pc` VARCHAR(50) NULL;
  ";
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
ALTER TABLE `edo_configuraciones` 
ADD `tarifas_fijas_usa_valor_por_paradas_pax_maximos` CHAR(2) NULL, 
ADD `tarifas_fijas_usa_valor_por_paradas_mensaje_maximo` VARCHAR(100) NULL;
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
        $sql = "
ALTER TABLE `edo_configuraciones` ADD `pasajero_minutos_para_calificar_servicio` CHAR(7) NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `edo_configuraciones` 
ADD `btn_adondevamos_texto` CHAR(40) NULL, 
ADD `btn_adondevamos_abre_historico` CHAR(2) NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "ALTER TABLE `edo_configuraciones` ADD `usa_informe_conductor` CHAR(2) NULL;";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
CREATE TABLE `edo_motivos_rechazos` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT 'textField,0,false',
  `fecha` timestamp NULL DEFAULT NULL COMMENT 'textField,0,false',
  `empresa` int(11) DEFAULT NULL COMMENT 'textField,0,false',
  `usuario` varchar(100) DEFAULT NULL COMMENT 'textField,0,false',
   `nombre` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'textField,0,true',
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
CREATE TABLE `edo_creacion_viajes_por` 
( `id` INT NOT NULL AUTO_INCREMENT , 
`fecha` TIMESTAMP NOT NULL , 
`usuario` VARCHAR(150) NOT NULL , 
`nombre` VARCHAR(100) NOT NULL , 
`empresa` INT NOT NULL , PRIMARY KEY (`id`)) ENGINE = InnoDB;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
CREATE TABLE `edo_destino_viajes` 
( `id` INT NOT NULL AUTO_INCREMENT , 
`fecha` TIMESTAMP NOT NULL , 
`usuario` VARCHAR(150) NOT NULL , 
`nombre` VARCHAR(100) NOT NULL , 
`direccion` VARCHAR(100) NOT NULL , 
`empresa` INT NOT NULL , 
PRIMARY KEY (`id`)) ENGINE = InnoDB;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "ALTER TABLE `edo_configuraciones` ADD `usa_medios_pago` CHAR(2) NULL;";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "ALTER TABLE `edo_configuraciones` ADD `usa_origen_viaje` CHAR(2) NULL;";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "ALTER TABLE `edo_configuraciones` ADD `usa_destinos_conf` CHAR(2) NULL;";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
CREATE TABLE `edo_homologaciones_ciudades` 
( `id` INT NOT NULL AUTO_INCREMENT , 
`fecha` TIMESTAMP NOT NULL , 
`usuario` VARCHAR(150) NOT NULL , 
`ciudad_homologar` VARCHAR(100) NOT NULL , 
`ciudad_homologada` VARCHAR(100) NOT NULL , 
`empresa` INT NOT NULL , 
PRIMARY KEY (`id`)) ENGINE = InnoDB;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE  edo_servicios add column  trf integer default 0;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
ALTER TABLE  edo_servicios add column  trf_text varchar(100);
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE  edo_servicios add column tipo_pago_id varchar(20) Null;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE  edo_servicios add column cod_compra varchar(100);
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }


        $sql = "COMMIT; ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        return true;
    }
}
