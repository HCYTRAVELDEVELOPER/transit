
CREATE TABLE IF NOT EXISTS `nwplay_millonario_niveles` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT 'textField,0,false',
  `nombre` varchar(50) DEFAULT NULL,
    `fecha` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'textField,0,false',
  `puntaje` int(11) DEFAULT NULL,
  `usuario` varchar(100) DEFAULT NULL COMMENT 'textField,0,false',
  `empresa` int(11) DEFAULT NULL COMMENT 'textField,0,false',
  `terminal` int(11) DEFAULT NULL COMMENT 'textField,0,false',
  `nivel_seguro` varchar(2) DEFAULT NULL COMMENT 'textField',
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

CREATE TABLE IF NOT EXISTS `nwplay_millonario_preguntas` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT 'textField,0,false',
  `nombre` varchar(50) DEFAULT NULL,
  `puntaje` int(11) DEFAULT NULL,
  `nivel` int(11) DEFAULT NULL,
  `tiempo` int(11) DEFAULT NULL,
    `fecha` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'textField,0,false',
  `usuario` varchar(100) DEFAULT NULL COMMENT 'textField,0,false',
  `empresa` int(11) DEFAULT NULL COMMENT 'textField,0,false',
   `terminal` int(11) DEFAULT NULL COMMENT 'textField,0,false',
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

CREATE TABLE IF NOT EXISTS `nwplay_millonario_respuestas` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT 'textField,0,false',
  `nombre` varchar(50) DEFAULT NULL,
  `pregunta` int(11) DEFAULT NULL,
  `nivel` int(11) DEFAULT NULL,
  `correcta` varchar(10) DEFAULT NULL,
    `fecha` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'textField,0,false',
  `usuario` varchar(100) DEFAULT NULL COMMENT 'textField,0,false',
  `empresa` int(11) DEFAULT NULL COMMENT 'textField,0,false',
   `terminal` int(11) DEFAULT NULL COMMENT 'textField,0,false',
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;


CREATE TABLE IF NOT EXISTS `nwplay_millonario_sesiones` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT 'textField,0,false',
  `nombre` varchar(50) DEFAULT NULL,
  `usuario` varchar(100) DEFAULT NULL COMMENT 'textField,0,false',
  `empresa` int(11) DEFAULT NULL COMMENT 'textField,0,false',
   `terminal` int(11) DEFAULT NULL COMMENT 'textField,0,false',
  `pregunta` int(11) DEFAULT NULL,
  `nivel` int(11) DEFAULT NULL,
  `puntaje` varchar(10) DEFAULT NULL,
  `estado` varchar(50) DEFAULT NULL,
  `respuesta` varchar(10) DEFAULT NULL,
    `fecha` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'textField,0,false',
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

