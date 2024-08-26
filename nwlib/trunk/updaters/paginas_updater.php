<?php

/* * ***********************************************************************

  Copyright:
  2013 Netwoods.net, http://www.netwoods.net

  Author:
  Andrés Flórez

 * *********************************************************************** */

class paginas_updater {

    private static function menu() {
        session::check();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $cb = new NWDbQuery($db);
        $sql = "
DROP TABLE `menu`, `modulos`, `nw_modulos_grupos`,  `nw_modulos_home`, `nw_design` ;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
DELETE FROM `permisos` WHERE perfil=1 ;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
CREATE TABLE IF NOT EXISTS `modulos` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT 'textField,0,false',
  `nombre` varchar(50) DEFAULT NULL,
  `clase` varchar(100) DEFAULT NULL,
  `empresa` int(11) DEFAULT NULL COMMENT 'textField,0,false',
  `grupo` int(11) DEFAULT NULL COMMENT 'selectBox,nw_modulos_grupos',
  `iconos_home` text COMMENT 'uploader',
  `mostrar_en_el_home` varchar(2) NULL COMMENT  'selectBox,boolean',
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=517 ;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
CREATE TABLE IF NOT EXISTS `permisos` (
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
CREATE TABLE IF NOT EXISTS `menu` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT 'textField,0,false',
  `nombre` varchar(100) DEFAULT NULL,
  `orden` int(11) DEFAULT NULL,
  `nivel` int(11) DEFAULT NULL,
  `callback` text,
  `pariente` int(11) DEFAULT NULL,
  `icono` varchar(100) DEFAULT NULL,
  `modulo` int(11) DEFAULT NULL,
  `empresa` int(11) DEFAULT NULL COMMENT 'textField,0,false',
    `movil` tinyint(1) DEFAULT NULL,
  `orden_movil` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
CREATE TABLE IF NOT EXISTS `nw_modulos_grupos` (
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
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=55 ;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
CREATE TABLE IF NOT EXISTS `nw_modulos_home` (
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
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=5 ;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
CREATE TABLE IF NOT EXISTS `nw_design` (
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
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=2 ;
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

        $sqla = "
INSERT INTO `menu` (`id`, `nombre`, `orden`, `nivel`, `callback`, `pariente`, `icono`, `modulo`, `empresa`, `movil`, `orden_movil`) VALUES
(291, 'Links', 1, 1, 'slotLInksMenu', 0, '', 475, 1, NULL, NULL),
(292, 'Configurar Menú', 2, 1, 'slotOptionsMenu', 0, '', 476, 1, NULL, NULL),
(293, 'Crear Módulos', 1, 1, 'createMaster\:\master,nwp_modulos,Módulos Sistema,true', 0, '', 480, 1, NULL, NULL),
(294, 'Lista Páginas', 1, 1, 'slotLIstaPages', 0, '', 484, 1, NULL, NULL),
(295, 'Restringir Páginas', 2, 1, 'createMaster\:\master,restringidas,Páginas Restringidas,true', 0, '', 485, 1, NULL, NULL),
(296, 'Administrar Páginas Restringidas', 3, 1, '0', 0, '', 486, 1, NULL, NULL),
(297, 'Seguridad', 1, 1, 'createMaster\:\master,seguridad,Seguridad Sistema,true', 0, '', 487, 1, NULL, NULL),
(298, 'MetaEtiqueta Google', 1, 2, 'createMaster\:\master,google,metaetiqueta Google,true', 308, '', 488, 1, NULL, NULL),
(299, 'Metaetiqueta Google Analytics', 2, 2, 'createMaster\:\master,analythics,meta etiqueta Analytics,true', 308, '', 488, 1, NULL, NULL),
(300, 'Metaetiqueta Yahoo', 3, 2, 'createMaster\:\master,yahoo,meta etiqueta Yahoo,true', 308, '', 488, 1, NULL, NULL),
(301, 'Metaetiqueta Bing', 4, 2, 'createMaster\:\master,bing,meta etiqueta Bing,true', 308, '', 488, 1, NULL, NULL),
(302, 'Metaetiqueta Quantcast', 5, 2, 'createMaster\:\master,quantcast,meta etiqueta Quantcast,true', 308, '', 488, 1, NULL, NULL),
(303, 'Sitemaps', 6, 1, 'slotSitemaps', 0, '', 488, 1, NULL, NULL),
(304, 'Dublin Core', 7, 1, 'createMaster\:\master,dublin_core,Dublin Core,true', 0, '', 488, 1, NULL, NULL),
(305, 'Geo Posición', 8, 1, 'createMaster\:\master,geo,Geo Posición,true', 0, '', 488, 1, NULL, NULL),
(306, 'URL Canónica', 9, 1, 'createMaster\:\master,canonical,Url canonical,true', 0, '', 488, 1, NULL, NULL),
(307, 'Facebook', 10, 1, 'createMaster\:\master,seo_facebook,Seo en Facebook,true', 0, '', 488, 1, NULL, NULL),
(308, 'Meta Etiquetas', 1, 1, '0', 0, '', 488, 1, NULL, NULL),
(309, 'Usuarios del Sistema', 1, 1, 'slotNWUsuarios', 0, '', 477, 1, NULL, NULL),
(310, 'Usuarios Registrados', 2, 1, '0', 0, '', 478, 1, NULL, NULL),
(311, 'Perfiles', 3, 1, '0', 0, '', 479, 1, NULL, NULL),
(312, 'Mensajes Recibidos', 1, 1, 'createMaster\:\master,contactos,Mensajes Recibidos,true', 0, '', 481, 1, NULL, NULL),
(313, 'Destinatarios', 0, 1, 'createMaster\:\master,correos,Destinatarios de correo,true', 0, '', 482, 1, NULL, NULL),
(314, 'Autorespondedor', 3, 1, 'createMaster\:\master,contacto_body,AutoRespuestas Contacto,true', 0, '', 483, 1, NULL, NULL),
(315, 'Administración de Archivos', 0, 1, 'slotFileManager', 0, '', 492, 1, NULL, NULL),
(320, 'Menú', 1, 2, '0', 332, '', 474, 1, NULL, NULL),
(322, 'Diseño', 1, 1, '0', 0, '', 474, 1, NULL, NULL),
(323, 'Fondo General', 0, 2, 'slotFondosGeneral', 322, '', 474, 1, NULL, NULL),
(324, 'Fondo Centro', 1, 2, 'slotFondosCentro', 322, '', 474, 1, NULL, NULL),
(325, 'Tamaños', 3, 2, 'slotTamanos', 322, '', 474, 1, NULL, NULL),
(326, 'Fuentes, otras configuraciones', 3, 2, 'slotConfigPage', 322, '', 474, 1, NULL, NULL),
(327, 'Insertar', 3, 1, '0', 0, '', 474, 1, NULL, NULL),
(328, 'Nueva Página', 0, 2, 'slotNewPage', 327, '', 474, 1, NULL, NULL),
(329, 'Bloque de Contenido', 1, 2, 'slotInsertarSeccion', 327, '', 474, 1, NULL, NULL),
(331, 'Objeto flotante', 3, 2, 'slotInsertarObject', 327, '', 474, 1, NULL, NULL),
(332, 'Estructura', 4, 1, '0', 0, '', 474, 1, NULL, NULL),
(333, 'Código', 4, 1, 'slotSource', 0, '', 474, 1, NULL, NULL),
(335, 'SEO', 8, 1, 'slotSeo', 0, '', 474, 1, NULL, NULL),
(336, 'Links', 0, 3, 'slotLInksMenu', 320, '', 474, 1, NULL, NULL),
(337, 'Diseño / Opciones', 1, 3, 'slotOptionsMenu', 320, '', 474, 1, NULL, NULL),
(338, 'Departamentos', 5, 1, 'createMaster\:\master,departamentos,Áreas de Contacto,true', 0, '', 496, 1, NULL, NULL),
(339, 'Blog / Noticias', 2, 2, 'slotBlogNoticias', 385, '', 497, 1, NULL, NULL),
(340, 'Categorías de Noticias', 0, 2, 'createMaster\:\master,noticias_categorias,Categorías de Noticias,true', 385, '', 498, 1, 0, 0),
(343, 'Mostrar delimitadores ', 2, 2, '0', 319, '', 474, 1, NULL, NULL),
(344, 'Header', 0, 2, '0', 332, '', 474, 1, NULL, NULL),
(345, 'Footer', 1, 2, '0', 332, '', 474, 1, NULL, NULL),
(346, 'Secciones', 3, 2, '0', 332, '', 474, 1, NULL, NULL),
(347, 'Objetos Flotantes', 4, 2, '0', 332, '', 474, 1, NULL, NULL),
(348, 'Publicar Cambios', 14, 1, 'slotVistaPrevia', 0, '', 474, 1, 0, 0),
(349, 'Administrar Formularios', 0, 1, 'slotNwForms', 0, '', 499, 1, NULL, NULL),
(351, 'Administrar Animaciones', 0, 1, 'slotTreeNwAnimation', 0, '', 506, 1, NULL, NULL),
(352, 'Configuración', 0, 1, 'slotNWSoporteConfig', 0, '', 501, 1, NULL, NULL),
(353, 'Estadísticas e Informes', 1, 1, 'slotNWSoporteEstadisticas', 0, '', 502, 1, NULL, NULL),
(354, 'Histórico', 2, 1, 'slotNWSoporteHistorial', 0, '', 503, 1, NULL, NULL),
(355, 'Operadores', 3, 1, 'slotNWSoporteOperadores', 0, '', 504, 1, NULL, NULL),
(357, 'Grupos Tienda', 0, 1, 'createMaster\:\master,nc_colors,Grupos Tienda,true', 0, '', 507, 1, NULL, NULL),
(358, 'Categorías Tienda', 1, 1, 'createMaster\:\master,nc_groups,Categorías NwCommerce,true', 0, '', 508, 1, NULL, NULL),
(359, 'Productos', 3, 1, 'slotNwCommerceProductos', 0, '', 509, 1, NULL, NULL),
(360, 'Banners Tienda', 4, 1, 'createMaster\:\master,nc_banner,Banners Home NwCommerce,true', 0, '', 510, 1, NULL, NULL),
(361, 'Comentarios', 5, 1, 'createMaster\:\master,nc_comments,Comentarios NwCommerce,true', 0, '', 514, 1, NULL, NULL),
(362, 'Pop Up', 0, 1, 'createMaster\:\master,nc_popup,PopUp NwCommerce,true', 0, '', 513, 1, NULL, NULL),
(363, 'Configuración Tienda', 0, 1, 'createMaster\:\master,nc_config,Configuración Tienda,true', 0, '', 512, 1, NULL, NULL),
(364, 'Proveedores', 6, 1, 'createMaster\:\master,nc_manufacturers,Proveedores Tienda,true', 0, '', 511, 1, NULL, NULL),
(365, 'Publicidad Tienda', 8, 1, 'createMaster\:\master,nc_publicidad,Publicidad Tienda,true', 0, '', 515, 1, NULL, NULL),
(366, 'Código', 8, 1, 'slotNWSoporteCode', 0, '', 501, 1, NULL, NULL),
(368, 'Módulos', 0, 1, '0', 0, '', 474, 1, NULL, NULL),
(373, 'Nw Animations', 5, 2, 'slotTreeNwAnimation', 368, '', 474, 1, NULL, NULL),
(374, 'Nw Forms', 5, 2, 'slotNwForms', 368, '', 474, 1, NULL, NULL),
(375, 'Módules Disponibles', 0, 2, 'createMaster\:\master,nwp_modulos,Módulos Sistema Consola,true', 368, '', 521, 1, NULL, NULL),
(378, 'Blog / Noticias', 3, 2, '0', 368, '', 474, 1, NULL, NULL),
(379, 'Administrar Noticias', 1, 3, 'slotBlogNoticias', 378, '', 522, 1, NULL, NULL),
(380, 'Categorias News', 1, 3, 'createMaster\:\master,noticias_categorias,Categorías de Noticias,true', 378, '', 523, 1, 0, 0),
(381, 'Actualizar', 13, 1, 'slotActualizar', 0, '', 474, 1, NULL, NULL),
(383, 'Productos Catálogo / Imágenes', 2, 1, 'slotProductosCatalogo', 0, '', 525, 1, NULL, NULL),
(384, 'Tiendas C.C', 0, 1, 'slotSitiosNwsites', 0, '', 526, 1, NULL, NULL),
(385, 'Noticias', 3, 1, '0', 0, '', 528, 1, NULL, NULL),
(450, 'Configurar Contacto', 8, 1, 'createMaster\:\master,contacto_config,Configurar Contacto,true', 0, NULL, 481, 1, NULL, NULL),
(451, 'Formas de Pago', 10, 1, 'createMaster\:\master,nc_formas_pago,Configurar Formas Pago Tienda,true', 0, '', 510, 1, 0, 0),
(452, 'Categorías C.C', 0, 1, 'createMaster\:\master,nc_groups,Categorias,true', 0, '', 531, 1, NULL, NULL),
(453, 'Inmobiliario', 0, 1, 'slotProductosCatalogo', 0, '', 530, 1, NULL, NULL),
(455, 'Pedidos', 0, 1, '', 0, '', 532, 1, NULL, NULL),
(456, 'Historial de Pedidos', 0, 2, 'slotSalidas', 455, '', 532, 1, NULL, NULL),
(457, 'Detalle de Productos', 1, 2, 'createMaster\:\master,pv_salidas_det,Detalle de Ordenes de Pedido,true', 455, '', 533, 1, NULL, NULL),
(458, 'Clientes', 1, 1, 'createMaster\:\master,pv_clientes,Clientes Registrados,true', 0, '', 532, 1, NULL, NULL),
(459, 'Productos Tienda Domicilios', 2, 1, 'slotProductosRedwings', 0, '', 534, 1, 0, 0),
(460, 'Proveedores nws', 4, 2, 'createMaster\:\master,pv_proveedores,Proveedores,true', 462, '', 535, 1, 0, 0),
(461, 'Tiendas / Cobertura', 5, 1, 'slotTerminales', 0, '', 536, 1, 0, 0),
(462, 'Otras Configuraciones', 7, 1, '', 0, '', 537, 1, 0, 0),
(463, 'Categorías', 0, 2, 'createMaster\:\master,pv_categorias,Categorias,true', 462, '', 538, 1, 0, 0),
(465, 'Duración Pedidos', 3, 2, 'createMaster\:\master,pv_tiempos_domicilio,Tiempos Pedidos,true', 462, '', 540, 1, 0, 0),
(466, 'Horarios abierto / cerrado', 3, 2, 'slotHorariosTiendasGrupos', 462, '', 541, 1, 0, 0),
(467, 'Motivos Traslado Pedidos', 5, 2, 'createMaster\:\master,pv_anular,Motivos Traslado Pedidos,true', 462, '', 542, 1, 0, 0),
(468, 'Diseño / Estructura tienda', 6, 2, 'createMaster\:\master,pv_configuracion_tienda,Configuración Tienda,true', 462, '', 543, 1, 0, 0),
(469, 'Formas de Pago', 7, 2, 'createMaster\:\master,nc_formas_pago,Formas de pago Domicilios,true', 462, '', 544, 1, 0, 0),
(470, 'Configuración Productos', 7, 2, 'createMaster\:\master,pv_config_products,Configuración Productos,true', 462, '', 545, 1, NULL, NULL),
(471, 'Banner TiendaWeb', 8, 2, 'createMaster\:\master,pv_banner,Banner tienda comicilios,true', 462, '', 546, 1, 0, 0),
(472, 'Administrar mi Local', 0, 1, 'slotTreeNwSites', 0, '', 548, 1, NULL, NULL),
(474, 'Asociar Marcas', 8, 1, 'slotNwCommerceAsociarMarcas', 0, '', 550, 1, NULL, NULL),
(475, 'Ciudades', 0, 1, 'createMaster\:\master,ciudades,Ciudades,true', 0, '', 552, 1, NULL, NULL),
(476, 'Configurar Pop-up', 6, 1, 'createMaster\:\master,nwp_popup,Configuración Pop-up,true', 0, '', 553, 1, NULL, NULL),
(477, 'Crear / Consultar Pagos', 0, 1, 'createMaster\:\master,nwpay_pagos,Crar / Consular Pagos,true', 0, '', 555, 1, NULL, NULL),
(478, 'Páginas', 0, 2, 'slotLIstaPages', 332, '', 556, 1, NULL, NULL),
(479, 'Pop-up', 4, 2, 'createMaster\:\master,nwp_popup,Configuración Pop-up,true', 368, '', 521, 1, NULL, NULL),
(480, 'Departamentos Ciudades', 0, 1, 'createMaster\:\master,deptosGeo,Departamentos,true', 0, '', 557, 1, 0, 0),
(481, 'NwMaker Menú', 0, 1, 'createMaster\:\master,nwmaker_menu,NwMaker Menú,true', 0, '', 559, 1, 0, 0),
(482, 'NwMaker Módulos', 1, 1, 'createMaster\:\master,nwmaker_modulos,NwMaker Módulos,true', 0, '', 560, 1, 0, 0),
(483, 'NwMaker Módulos Home', 3, 1, 'createMaster\:\master,nwmaker_modulos_home,NwMaker Módulos Home,true', 0, '', 561, 1, 0, 0),
(484, 'NwMaker Usuarios Registrados', 4, 1, 'createMaster\:\master,pv_clientes,NwMaker Usuarios registrados,true', 0, '', 562, 1, 0, 0),
(485, 'Configuración General Nwproject', 0, 1, 'createMaster\:\master,nwpconfig,Config General Nwproject,true', 0, '', 563, 1, 0, 0),
(486, 'NwMaps', 0, 1, 'slotTreeNwMaps', 0, '', 565, 1, 0, 0),
(487, 'Nw Reservas', 0, 1, NULL, 0, '', 566, 1, 0, 0),
(488, 'Reservas Horarios', 0, 2, 'createMaster\:\master,reservas_horarios,Seguridad Sistema,true', 487, '', 567, 1, 0, 0),
(489, 'Reservas Variables', 1, 2, 'createMaster\:\master,reservas_variables,Reservas Variables,true', 487, '', 568, 1, 0, 0),
(490, 'Reservas Realizadas', 2, 2, 'createMaster\:\master,reservas_realizadas,Reservas Realizadas,true', 487, '', 569, 1, 0, 0),
(491, 'Construcción Page', 3, 1, NULL, 0, '', 570, 1, 0, 0),
(492, 'Configurar Página en construcción', 0, 2, 'createMaster\:\master,nw_cons_page_design,Configurar Página en construcción,true', 491, '', 571, 1, 0, 0),
(493, 'Registrados en construcción', 1, 2, 'createMaster\:\master,nw_cons_page_regist,Registrados en construcción,true', 491, '', 572, 1, 0, 0),
(494, 'Bodegas Tienda eCommerce', 10, 1, 'createMaster\:\master,nc_bodegas,Bodegas Tienda Virtual,true', 0, '', 573, 1, 0, 0),
(495, 'Domicilios Tiempo aprox / Pedido mínimo ', 0, 2, 'createMaster\:\master,pv_empresas_descripcion,Domicilios Costos / Tiempos / Descuentos ,true', 462, '', 574, 1, 0, 0),
(496, 'Costos / Descuentos Domicilios ', 0, 2, 'createMaster\:\master,pv_costos_domicilio,Costos Domicilios ,true', 462, '', 575, 1, 0, 0),
(497, 'NwMaker Componentes', 3, 1, 'createMaster\:\master,nwmaker_modulos_componentes,Componentes Módulos NwMaker ,true', 0, '', 562, 1, 0, 0),
(498, 'Configuración Gral', 5, 1, 'createMaster\:\master,nwmaker_codigo_oculto,Diseño / Js / CSS NwMaker ,true', 0, '', 562, 1, 0, 0),
(499, 'Robots', 10, 1, 'slotProcessRobots', 0, '', 488, 1, NULL, NULL),
(500, 'NwMaker Config Login', 4, 1, 'createMaster\:\master,nwmaker_login,NwMaker Admin Login,true', 0, '', 576, 1, 0, 0),
(501, 'Idiomas', 4, 1, 'createMaster\:\master,idiomas,Idiomas,true', 0, '', 577, 1, 0, 0),
(502, 'Países', 0, 1, 'createMaster\:\master,paises,Países,true', 0, '', 578, 1, NULL, NULL),
(503, 'Categorías productos catálogo', 0, 1, 'createMaster\:\master,productos_grupos,Categorías productos catálogo,true', 0, '', 579, 1, NULL, NULL),
(504, 'Configurar productos catálogo', 0, 1, 'createMaster\:\master,productos_config,Configurar productos catálogo,true', 0, '', 579, 1, NULL, NULL),
(505, 'NwMaker Perfiles', 0, 1, 'createMaster\:\master,nwmaker_perfiles,NwMaker Perfiles,true', 0, '', 581, 1, NULL, NULL),
(506, 'NwMaker Permisos', 0, 1, 'createMaster\:\master,nwmaker_permisos,NwMaker Permisos,true', 0, '', 582, 1, NULL, NULL),
(507, 'Secciones NwChat', 0, 1, 'createMaster\:\master,sop_secciones,NwChat Secciones,true', 0, '', 583, 1, NULL, NULL),
(508, 'NwCalendar', 0, 1, 'createMaster\:\master,nwcalendar_eventos,NwCalendar,true', 0, '', 585, 1, NULL, NULL),
(509, 'NwMaker Perfiles Autorizados', 0, 1, 'createMaster\:\master,nwmaker_perfiles_autorizados,NwMaker Perfiles Autorizados,true', 0, '', 584, 1, NULL, NULL),
(510, 'JSON-LD Google', 11, 1, 'createMaster\:\master,google_seo,NwMaker Google SEO,true', 0, '', 488, 1, NULL, NULL),
(511, 'Zona clientes - Clientes', 0, 1, 'createMaster\:\master,nwp_zonaclientes_clientes,Zona clientes - Clientes,true', 0, '', 587, 1, NULL, NULL),
(512, 'Zona clientes - Contenido portal', 0, 1, 'createMaster\:\master,nwp_zonaclientes_contenido,Zona clientes - Contenido portal,true', 0, '', 588, 1, NULL, NULL),
(513, 'Zona clientes - Categorías', 0, 1, 'createMaster\:\master,nwp_zonaclientes_categorias,Zona clientes - Categorías,true', 0, '', 589, 1, NULL, NULL);
";
        $cb->prepare($sqla);
        if (!$cb->exec()) {
            master::logSystemError($cb->lastErrorText());
        }

        $sql = "
INSERT INTO `modulos` (`id`, `nombre`, `clase`, `empresa`, `grupo`, `iconos_home`) VALUES
(474, 'Editar Sitio Consola', '0', 1, 34, '0'),
(475, 'Menú Principal', 'menuprincipal', 1, 35, '0'),
(476, 'Menú Principal Opciones', 'menuprincipal_opciones', 1, 35, '0'),
(477, 'Usuarios del sistema', 'qxnw.basics.lists.l_usuarios', 1, 36, '0'),
(478, 'Usuarios Registrados', 'usuarios', 1, 36, '0'),
(479, 'Perfiles', 'perfiles', 1, 36, '0'),
(480, 'Crear Módulos', 'nwp_modulos', 1, 37, '0'),
(481, 'Mensajes Recibidos', 'contactos', 1, 38, '0'),
(482, 'Destinatarios de contacto', 'correos', 1, 38, '0'),
(483, 'Autorespondedor', '0', 1, 38, '0'),
(484, 'Páginas', 'paginas', 1, 39, '0'),
(485, 'Restringir páginas', 'paginas', 1, 39, '0'),
(486, 'Administrar páginas restringidas', '0', 1, 39, '0'),
(487, 'Seguridad Enc', '0', 1, 40, '0'),
(488, 'SEO Enc', '0', 1, 41, '0'),
(489, 'Nwcommerce ENC', '0', 1, 43, '0'),
(490, 'Administrador de Archivos ENC', '0', 1, 42, '0'),
(491, 'Imágenes', '0', 1, 42, '0'),
(492, 'Archivos', '0', 1, 42, '0'),
(493, 'Flash', '0', 1, 42, '0'),
(494, 'Videos', '0', 1, 42, '0'),
(495, 'Estructuras Enc', '0', 1, 44, '0'),
(496, 'Departamentos Contacto', 'Departamentos', 1, 38, '0'),
(497, 'Blog Noticias Enc', 'noticias', 1, 37, '0'),
(498, 'Categorías Noticias', 'categorias_noticias', 1, 37, '0'),
(499, 'Administrar Formularios', '0', 1, 46, '0'),
(500, 'Tipos de Campos', 'nwforms_tipos', 1, 46, '0'),
(501, 'Configuración Chat', '0', 1, 47, '0'),
(502, 'Estadísticas e Informes Chat', '0', 1, 47, '0'),
(503, 'Histórico de Chats', '0', 1, 47, '0'),
(504, 'Operadores Chat', '0', 1, 47, '0'),
(506, 'Nw Animate Enc', '0', 1, 48, '0'),
(507, 'Grupos Tienda', 'nc_colors', 1, 43, '0'),
(508, 'Categorías Tienda', 'nc_groups', 1, 43, '0'),
(509, 'Productos', 'nc_products', 1, 43, '0'),
(510, 'Banner Principal Tienda', 'nc_banner', 1, 43, '0'),
(511, 'Proveedores', 'nc_manufacturers', 1, 43, '0'),
(512, 'Configuración Tienda', 'nc_config', 1, 43, '0'),
(514, 'Comentarios Tienda', 'nc_comments', 1, 43, '0'),
(515, 'Publicidad Tienda', 'nc_publicidad', 1, 43, '0'),
(516, 'NwSites Enc', '0', 1, 49, '0'),
(517, 'Editar Slider Nw', 'nwproject5.lists.l_slidernw', 1, 34, '0'),
(518, 'Menú Principal Links', 'menuprincipal', 1, 34, '0'),
(519, 'Menú Principal Opciones', 'menuprincipal_opciones', 1, 34, '0'),
(520, 'Slider Nw Config', 'nwproject5.lists.l_slidernw', 1, 34, '0'),
(521, 'Crear Módulos', 'nwp_modulos', 1, 34, '0'),
(522, 'NOticias', 'noticias', 1, 34, '0'),
(523, 'Categorias News', 'categorias_noticias', 1, 34, '0'),
(524, 'Catálogo Productos / Imágenes', 'productos', 1, 34, '0'),
(525, 'Productos Catálogo / Imágenes', 'productos', 1, 37, '0'),
(526, 'tiendas', 'tiendas', 1, 49, '0'),
(528, 'Noticias Enc', '0', 1, 37, '0'),
(529, 'nwpos_enc', '0', 1, 51, '0'),
(530, 'Inmuebles Enc', 'productos', 1, 49, '0'),
(531, 'Categorias NwSites', 'nc_groups', 1, 49, '0'),
(532, 'Ordenes de Pedido', 'nwsites.lists.l_salidas', 1, 51, '0'),
(533, 'Salidas Productos Detalle', 'pv_salidas_det', 1, 51, '0'),
(534, 'Productos PV', 'pos.lists.l_productos', 1, 51, '0'),
(535, 'Proveedores PV', 'pv_proveedores', 1, 51, '0'),
(536, 'Tiendas / terminales PV', 'terminales', 1, 51, '0'),
(537, 'Panel de Control', '0', 1, 51, '0'),
(538, 'Categorías PV', 'pv_categorias', 1, 51, '0'),
(539, 'Métodos de pago PV', 'pv_metodos_pago', 1, 51, '0'),
(540, 'Tiempos Domicilio Pv', 'pv_tiempos_domicilio', 1, 51, '0'),
(541, 'Horarios Tiendas Grupos', 'pv_horarios_tiendas_grupos', 1, 51, '0'),
(542, 'Motivos Traslado Pedidos', 'pv_anular', 1, 51, '0'),
(543, 'Configuración TiendaWeb PV', 'pv_configuracion_tienda', 1, 51, '0'),
(544, 'Formas Pago Pv', 'nc_formas_pago', 1, 51, '0'),
(545, 'Config Productos Pv', 'pv_config_products', 1, 51, '0'),
(546, 'Banner Tienda Pv', 'pv_banner', 1, 51, '0'),
(548, 'Administrar Mi Local', 'nc_products', 1, 49, '0'),
(550, 'Asociar Marcas NwCommerce', 'nc_manufacturers_asociate', 1, 43, '0'),
(551, 'Configuraciones Generales Enc', '0', 1, 52, '0'),
(552, 'Ciudades', 'ciudades', 1, 52, '0'),
(553, 'nwp_popup', 'nwp_popup', 1, 37, '0'),
(554, 'Pagos en Línea Enc', '0', 1, 53, '0'),
(555, 'nwpay_pagos', 'nwpay_pagos', 1, 53, '0'),
(556, 'Páginas Estructura', 'paginas', 1, 34, '0'),
(557, 'Ciudades Departamentos', 'deptosGeo', 1, 52, '0'),
(558, 'Nw Maker Enc', '0', 1, 54, '0'),
(559, 'Nw Maker Menu', 'nwmaker_menu', 1, 54, '0'),
(560, 'Nw Maker Modulos', 'nwmaker_modulos', 1, 54, '0'),
(561, 'Nw Maker Modulos Home', 'nwmaker_modulos_home', 1, 54, '0'),
(562, 'Nw Maker Usuarios', 'pv_clientes', 1, 54, '0'),
(563, 'Configuración General Nwproject', 'nwpconfig', 1, 52, '0'),
(564, 'NwMaps Enc', '0', 1, 55, '0'),
(565, 'NwMaps Administrar', '0', 1, 55, '0'),
(566, 'NwReservas Enc', '0', 1, 37, '0'),
(567, 'NwReservas Horarios', 'reservas_horarios', 1, 37, '0'),
(568, 'NwReservas Variables', 'reservas_variables', 1, 37, '0'),
(569, 'NwReservas Realizadas', 'reservas_realizadas', 1, 37, '0'),
(570, 'Nw Cons Enc', '0', 1, 52, '0'),
(571, 'Nw Cons Configurar', 'nw_cons_page_design', 1, 52, '0'),
(572, 'Nw Cons Registrados', 'nw_cons_page_regist', 1, 52, '0'),
(573, 'Tienda Bodegas', 'nc_bodegas', 1, 43, '0'),
(574, 'pv_empresas_descripcion', 'pv_empresas_descripcion', 1, 51, '0'),
(575, 'pv_costos_domicilio', 'pv_costos_domicilio', 1, 51, '0'),
(576, 'nwmaker_login', 'nwmaker_login', 1, 54, '0'),
(577, 'idiomas', 'idiomas', 1, 52, '0'),
(578, 'Países', 'ciudades', 1, 52, '0'),
(579, 'Categorías Productos catálogo', 'productos_grupos', 1, 37, '0'),
(580, 'Configurar Productos catálogo', 'productos_config', 1, 37, '0'),
(581, 'NwMaker Perfiles', 'nwmaker_perfiles', 1, 54, '0'),
(582, 'NwMaker Permisos', 'nwmaker_permisos', 1, 54, '0'),
(583, 'Secciones NwChat', '0', 1, 47, '0'),
(584, 'NwMaker Perfiles Autorizados', 'nwmaker_perfiles_autorizados', 1, 54, '0'),
(585, 'NwCalendar', 'nwcalendar_eventos', 1, 37, '0'),
(586, 'NwGoogleSEO', '0', 1, 41, '0'),
(587, 'Zona clientes - Clientes', 'nwp_zonaclientes_clientes', 1, 56, '0'),
(588, 'Zona clientes - Contenido portal', 'nwp_zonaclientes_contenido', 1, 56, '0'),
(589, 'Zona clientes - Categorias', 'nwp_zonaclientes_categorias', 1, 56, '0');
";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
INSERT INTO `nw_modulos_grupos` (`id`, `nombre`, `empresa`, `usuario`, `fecha`, `parte`, `icono`, `pariente`, `modulo`, `orden`) VALUES
(34, 'Apariencia / Editar Contenido', 1, 'andresf', '2015-07-06', '0.slotEditarSitioConsola', '/nwproject/utilities/imagenes/icons/icons25.png', 0, 0, 1),
(35, 'Menú Principal', 1, 'andresf', '2015-06-02', '0', '/nwproject/utilities/imagenes/icons/icons29.png', 0, 0, 2),
(36, 'Usuarios', 1, 'andresf', '2015-07-06', '0', '/nwproject/utilities/imagenes/icons/icons15.png', 0, 3, 3),
(37, 'Módulos / Plugins', 1, 'andresf', '2015-06-04', '0', '/nwproject/utilities/imagenes/icons/icons30.png', 0, 0, 8),
(38, 'Administrar Contacto', 1, 'andresf', '2015-07-06', '0', '/nwproject/utilities/imagenes/icons/icons11.png', 0, 0, 1),
(39, 'Páginas', 1, 'andresf', '2015-06-04', '0', '/nwproject/utilities/imagenes/icons/icons27.png', 0, 0, 4),
(40, 'Seguridad', 1, 'andresf', '2015-06-04', '0', '/nwproject/utilities/imagenes/icons/icons17.png', 0, 0, 11),
(41, 'SEO', 1, 'andresf', '2015-06-04', '0', '/nwproject/utilities/imagenes/icons/icons22.png', 0, 0, 12),
(42, 'Administración de Archivos', 1, 'andresf', '2015-11-30', '0.slotFileManager', '/nwproject/utilities/imagenes/icons/icons2.png', 0, 0, 5),
(43, 'Tienda Virtual NwCommerce', 1, 'alexf', '2016-02-08', '0.slotNwCommerceDash', '/nwproject/utilities/imagenes/icons/icons21.png', 0, 0, 13),
(46, 'Formularios', 1, 'alexf', '2015-07-08', '0.slotNwForms', '/nwproject/utilities/imagenes/icons/icons7.png', 0, 0, 10),
(47, 'NwChat', 1, 'andresf', '2015-06-11', '0.slotVistaInicialNwSoporte', '/nwproject/utilities/imagenes/icons/icons8.png', 0, 0, 7),
(48, 'Nw Animations', 1, 'andresf', '2015-06-11', '0.slotTreeNwAnimation', '/nwproject/utilities/imagenes/icons/icons26.png', 0, 0, 9),
(49, 'Nw Centros Comerciales', 1, 'andresf', '2015-11-30', '0', '/nwproject/utilities/imagenes/icons/icons28.png', 0, 0, 14),
(51, 'Nw POS / Domicilios', 1, 'andresf', '2015-11-30', '0', '/nwproject/utilities/imagenes/icons/icons28.png', 0, 0, 15),
(52, 'Configuraciones Generales', 1, 'alexf', '2015-12-01', '0', '/nwproject/utilities/imagenes/icons/icons30.png', 0, 0, 22),
(53, 'Pagos en Línea', 1, 'alexf', '2015-12-04', '0', '/nwproject/utilities/imagenes/icons/icons21.png', 0, 0, 23),
(54, 'Nw Maker Soft', 1, 'alexf', '2016-02-01', '0', '/nwproject/utilities/imagenes/back_next_icon.png', 0, 0, 24),
(55, 'NwMaps', 1, 'alexf', '2016-02-11', '0.slotTreeNwMaps', '/nwproject/utilities/imagenes/icons/nwmaps.png', 0, 0, 25),
(56, 'Zona clientes', 1, 'alexf', '2019-11-11', '0', '/nwproject/utilities/imagenes/back_next_icon.png', 0, 0, 26);
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "

INSERT INTO `permisos` (`perfil`, `modulo`, `usuario`, `fecha`, `crear`, `consultar`, `editar`, `eliminar`, `todos`, `terminal`, `imprimir`, `enviar_correo`, `exportar`, `importar`, `columnas_ocultas`, `pariente`) VALUES
(1, 5, 'andresf', '2015-05-29', 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, NULL),
(1, 474, 'andresf', '2015-05-31', 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, NULL),
(1, 475, 'andresf', '2015-06-02', 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, NULL),
(1, 476, 'andresf', '2015-06-02', 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, NULL),
(1, 477, 'andresf', '2015-06-04', 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, NULL),
(1, 478, 'andresf', '2015-06-04', 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, NULL),
(1, 479, 'andresf', '2015-06-04', 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, NULL),
(1, 480, 'alexf', '2015-06-04', 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, NULL),
(1, 481, 'andresf', '2015-06-04', 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, NULL),
(1, 482, 'andresf', '2015-06-04', 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, NULL),
(1, 483, 'andresf', '2015-06-04', 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, NULL),
(1, 484, 'andresf', '2015-06-04', 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, NULL),
(1, 485, 'andresf', '2015-06-04', 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, NULL),
(1, 486, 'andresf', '2015-06-04', 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, NULL),
(1, 487, 'andresf', '2015-06-04', 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, NULL),
(1, 488, 'andresf', '2015-06-04', 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, NULL),
(1, 489, 'andresf', '2015-06-04', 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, NULL),
(1, 490, 'andresf', '2015-06-10', 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, NULL),
(1, 491, 'andresf', '2015-06-10', 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, NULL),
(1, 492, 'andresf', '2015-06-10', 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, NULL),
(1, 493, 'andresf', '2015-06-10', 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, NULL, NULL),
(1, 494, 'andresf', '2015-06-10', 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, NULL),
(1, 495, 'andresf', '2015-06-10', 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, NULL, NULL),
(1, 496, 'andresf', '2015-06-10', 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, NULL),
(1, 497, 'alexf', '2015-06-10', 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, NULL),
(1, 498, 'alexf', '2015-06-10', 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, NULL),
(1, 499, 'andresf', '2015-06-11', 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, NULL),
(1, 500, 'andresf', '2015-06-11', 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, NULL),
(1, 501, 'andresf', '2015-06-11', 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, NULL),
(1, 502, 'andresf', '2015-06-11', 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, NULL),
(1, 503, 'andresf', '2015-06-11', 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, NULL),
(1, 504, 'andresf', '2015-06-11', 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, NULL),
(1, 505, 'andresf', '2015-06-11', 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, NULL),
(1, 506, 'andresf', '2015-06-11', 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, NULL),
(1, 507, 'andresf', '2015-06-11', 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, NULL),
(1, 508, 'andresf', '2015-06-11', 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, NULL),
(1, 509, 'andresf', '2015-06-11', 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, NULL),
(1, 510, 'andresf', '2015-06-11', 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, NULL),
(1, 511, 'andresf', '2015-06-11', 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, NULL),
(1, 512, 'andresf', '2015-06-11', 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, NULL),
(1, 513, 'alexf', '2015-06-11', 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, NULL),
(1, 514, 'andresf', '2015-06-11', 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, NULL),
(1, 515, 'andresf', '2015-06-11', 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, NULL),
(1, 516, 'andresf', '2015-06-11', 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, NULL),
(1, 517, 'andresf', '2015-06-16', 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, NULL),
(1, 518, 'andresf', '2015-06-16', 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, NULL),
(1, 519, 'andresf', '2015-06-16', 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, NULL),
(1, 520, 'andresf', '2015-06-16', 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, NULL),
(1, 521, 'andresf', '2015-06-17', 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, NULL),
(1, 522, 'andresf', '2015-06-17', 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, NULL),
(1, 523, 'andresf', '2015-06-17', 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, NULL),
(1, 524, 'andresf', '2015-06-30', 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, NULL),
(1, 525, 'alexf', '2015-06-30', 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, NULL),
(1, 526, 'andresf', '2015-07-03', 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, NULL),
(1, 527, 'andresf', '2015-07-03', 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, NULL),
(1, 528, 'alexf', '2015-07-08', 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, NULL),
(1, 529, 'andresf', '2015-11-30', 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, NULL),
(1, 530, 'andresf', '2015-11-30', 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, NULL),
(1, 531, 'andresf', '2015-11-30', 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, NULL),
(1, 532, 'andresf', '2015-11-30', 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, NULL),
(1, 533, 'andresf', '2015-11-30', 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, NULL),
(1, 534, 'andresf', '2015-11-30', 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, NULL),
(1, 535, 'andresf', '2015-11-30', 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, NULL),
(1, 536, 'andresf', '2015-11-30', 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, NULL),
(1, 537, 'andresf', '2015-11-30', 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, NULL),
(1, 538, 'andresf', '2015-11-30', 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, NULL),
(1, 539, 'andresf', '2015-11-30', 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, NULL),
(1, 540, 'andresf', '2015-11-30', 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, NULL),
(1, 541, 'andresf', '2015-11-30', 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, NULL),
(1, 542, 'andresf', '2015-11-30', 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, NULL),
(1, 543, 'andresf', '2015-11-30', 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, NULL),
(1, 544, 'andresf', '2015-11-30', 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, NULL),
(1, 545, 'andresf', '2015-11-30', 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, NULL),
(1, 546, 'andresf', '2015-11-30', 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, NULL),
(1, 547, 'andresf', '2015-11-30', 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, NULL),
(1, 548, 'andresf', '2015-11-30', 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, NULL),
(1, 550, 'andresf', '2015-11-30', 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, NULL),
(1, 551, 'alexf', '2015-12-01', 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, NULL),
(1, 552, 'alexf', '2015-12-01', 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, NULL),
(1, 553, 'alexf', '2015-12-04', 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, NULL),
(1, 554, 'alexf', '2015-12-04', 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, NULL),
(1, 555, 'alexf', '2015-12-04', 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, NULL),
(1, 556, 'andresf', '2015-12-14', 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, NULL),
(1, 557, 'alexf', '2015-12-17', 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, NULL),
(1, 558, 'alexf', '2016-02-01', 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, NULL),
(1, 559, 'alexf', '2016-02-01', 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, NULL),
(1, 560, 'alexf', '2016-02-01', 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, NULL),
(1, 561, 'alexf', '2016-02-01', 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, NULL),
(1, 562, 'alexf', '2016-02-01', 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, NULL),
(1, 563, 'alexf', '2016-02-01', 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, NULL),
(1, 564, 'alexf', '2016-02-11', 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, NULL),
(1, 565, 'alexf', '2016-02-11', 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, NULL),
(1, 566, 'alexf', '2016-02-12', 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, NULL),
(1, 567, 'alexf', '2016-02-12', 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, NULL),
(1, 568, 'alexf', '2016-02-12', 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, NULL),
(1, 569, 'alexf', '2016-02-12', 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, NULL),
(1, 570, 'alexf', '2016-02-29', 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, NULL),
(1, 571, 'alexf', '2016-02-29', 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, NULL),
(1, 572, 'alexf', '2016-02-29', 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, NULL),
(1, 573, 'andresf', '2016-03-10', 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, NULL),
(1, 574, 'andresf', '2016-03-17', 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, NULL),
(1, 575, 'andresf', '2016-03-17', 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, NULL),
(1, 576, 'andresf', '2016-03-17', 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, NULL),
(1, 577, 'andresf', '2016-03-17', 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, NULL),
(1, 578, 'andresf', '2016-03-17', 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, NULL),
(1, 579, 'andresf', '2016-03-17', 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, NULL),
(1, 580, 'andresf', '2016-03-17', 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, NULL),
(1, 581, 'andresf', '2016-03-17', 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, NULL),
(1, 582, 'andresf', '2016-03-17', 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, NULL),
(1, 583, 'andresf', '2016-03-17', 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, NULL),
(1, 584, 'andresf', '2016-03-17', 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, NULL),
(1, 585, 'andresf', '2016-03-17', 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, NULL),
(1, 586, 'andresf', '2016-03-17', 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, NULL),
(1, 587, 'andresf', '2016-03-17', 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, NULL),
(1, 588, 'andresf', '2016-03-17', 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, NULL),
(1, 589, 'andresf', '2016-03-17', 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, NULL);
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
INSERT INTO `nw_modulos_home` (`id`, `nombre`, `url_php`, `fecha`, `usuario`, `empresa`, `perfil`, `ancho`, `alto`, `orden`, `scrolling`, `float`, `activo`, `modulo`, `frame_si_no`, `columna`) VALUES
(4, 'Soporte Chat / Usuarios en Línea', '/nwlib6/modulos/nw_soporte_chat/widgets/connects.php', '2014-11-14 10:00:00', 'alexf', 1, NULL, '100%', '400px', 1, 'SI', 'right', 'SI', NULL, 'NO', 'right'),
(5, 'Pedidos Nuevos DomOnline', '/nwlib6/modulos/domonline/widgets/connects.php', '2015-11-30 19:00:31', 'alexf', 1, NULL, '100%', '400px', 1, 'SI', 'right', 'SI', NULL, 'NO', 'right');
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
INSERT INTO `nw_design` (`id`, `fondo_gral_left`, `color_letra`, `fond_buttons`, `color_fond_buttons`, `color_letra_buttons`, `fondo_modulo_uno`, `color_letra_modulo_uno`, `mostrar_menu_superior`, `fondo_modulo_dos`, `color_letra_modulo_dos`, `fondo_modulo_tres`, `color_letra_modulo_tres`, `mostrar_mensaje_inbox`, `mostrar_notificaciones`, `mostrar_notas`, `mostrar_tareas`, `mostrar_usuarios`, `mostrar_favoritos`, `mostrar_especiales`, `mostrar_chat`, `usar_segunda_vista`, `color_fond_buttons_indicadores`, `buttons_menu_radius`, `buttons_menu_margins`, `fond_body`, `activo`, `iconos_generales`, `mostrar_generales`, `mostrar_muro`, `mostrar_cumpleanios`, `mostrar_noticiasnw`, `color_mas_usados`, `color_noticias`, `color_muro`, `usuario`, `empresa`, `fecha`) VALUES
(1, '#888', '#000', '0', '0', '0', '0', '0', 'SI', '0', '0', '0', '0', 'NO', 'SI', 'NO', 'NO', 'NO', 'NO', 'NO', 'NO', 'NO', '0', '0', '1', '0', 'SI', '0', 'NO', 'NO', 'NO', 'SI', '0', '0', '0', 'andresf', 1, '2015-11-30');
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
    }

    public static function start($p) {
        session::check();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $ca->setPregMatchDuplicate(false);

        $sql = "
CREATE TABLE `nwmaker_forms_enc` (
  `id` int NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `mode` char(10) DEFAULT NULL,
  `codigo_oculto` text,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
CREATE TABLE `nwmaker_forms_grupos` (
  `id` int NOT NULL,
  `id_enc` int NOT NULL,
  `fecha` timestamp NOT NULL,
  `nombre` varchar(150) NOT NULL,
  `fondo` varchar(150) DEFAULT NULL,
  `orden` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
CREATE TABLE `nwmaker_forms_preguntas` (
  `id` int NOT NULL,
  `id_enc` int NOT NULL,
  `id_grupo` int NOT NULL,
  `opciones` text NOT NULL,
  `nombre` varchar(150) NOT NULL,
  `tipo_opciones` char(15) NULL,
  `orden` int NOT NULL,
  `populateSelectFromArray` text,
  `optionsBtnNext` text,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
CREATE TABLE `nwmaker_forms_respuestas` (
  `id` int NOT NULL,
  `fecha` timestamp NOT NULL,
  `respuestas` text NOT NULL,
  `id_enc` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `nwmaker_forms_enc` ADD `url_respuesta` VARCHAR(150) NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
            ALTER TABLE `nwmaker_forms_enc` ADD `url_respuesta_encode` CHAR(2) NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
            ALTER TABLE `nwforms_respuestas_users` CHANGE `sync` `sync` CHAR(2) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT 'selectBox,array';
                ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `nwforms_respuestas_users` CHANGE `respuesta` `respuesta` VARCHAR(300) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT 'textArea';
                ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
            ALTER TABLE `galeria_noticias` CHANGE `pagina` `pagina` INT NULL DEFAULT NULL COMMENT 'selectBox,paginas';
                ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `nwforms_preguntas_valores` 
CHANGE `id_enc` `id_enc` VARCHAR(60) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL, 
CHANGE `id_pregunta` `id_pregunta` VARCHAR(60) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL, 
CHANGE `value` `value` VARCHAR(60) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL, 
CHANGE `nombre` `nombre` VARCHAR(60) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL, 
CHANGE `fecha` `fecha` TIMESTAMP NULL DEFAULT NULL, 
CHANGE `usuario` `usuario` VARCHAR(60) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL;
                ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `noticias` CHANGE `title` `title` VARCHAR(100) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT 'textField';
        ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `nwforms_preguntas_valores` CHANGE `id_enc` `id_enc` VARCHAR(60) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
ALTER TABLE `nwforms_preguntas_valores` CHANGE `id_enc` `id_enc` VARCHAR(60) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL, CHANGE `id_pregunta` `id_pregunta` VARCHAR(60) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL, CHANGE `value` `value` VARCHAR(60) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL, CHANGE `nombre` `nombre` VARCHAR(60) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL, CHANGE `usuario` `usuario` VARCHAR(60) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }


        $sql = "
            ALTER TABLE  `nwforms_preguntas`
            ADD  `asociado` VARCHAR( 2 ) NULL COMMENT  'selectBox,boolean',
ADD  `asociado_selectbox` INT NULL COMMENT  'selectBox,nwforms_preguntas',
ADD  `asociado_columna` VARCHAR( 10 ) NULL COMMENT  'textField';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }


        $sql = "
ALTER TABLE  `nwforms_respuestas_users` CHANGE  `respuesta`  `respuesta` TEXT CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL COMMENT  'textArea';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
                ALTER TABLE  `nwforms_respuestas_users` CHANGE  `campo`  `campo` VARCHAR( 200 ) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL COMMENT  'textField';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
                ALTER TABLE  `nwforms_respuestas_users` CHANGE  `id_enc`  `id_enc` VARCHAR( 60 ) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL COMMENT  'selectBox,nwforms_enc';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE  `nwforms_respuestas_users` CHANGE  `id`  `id` INT( 11 ) NOT NULL AUTO_INCREMENT COMMENT  'textField,0,false';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
                ALTER TABLE  `nwforms_respuestas_users` CHANGE  `fecha`  `fecha` TIMESTAMP NULL DEFAULT NULL COMMENT  'dateField',
CHANGE  `usuario`  `usuario` VARCHAR( 60 ) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL COMMENT  'textField,0,false',
CHANGE  `enc_user`  `enc_user` INT( 11 ) NOT NULL COMMENT  'selectBox,nwforms_respuestas_users_enc';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }


        $sql = "
            ALTER TABLE  `nwforms_preguntas` CHANGE  `orden`  `orden` INT NOT NULL ;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
            ALTER TABLE  `nwforms_preguntas` CHANGE  `asociado_columna`  `asociado_columna` VARCHAR( 20 ) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT  'textField';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }



        $sql = "
            ALTER TABLE  `nwforms_preguntas` ADD  `car_min` VARCHAR( 3 ) NULL COMMENT  'textField',
ADD  `car_max` VARCHAR( 3 ) NULL COMMENT  'textField';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
            ALTER TABLE  `nwforms_preguntas` ADD  `llenar_con_dato_de_session` VARCHAR( 15 ) NULL COMMENT  'selectBox,boolean';
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
ALTER TABLE `deptosGeo` ADD `valor_domicilio` VARCHAR(5) NULL AFTER `nombre`;
            ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
            ALTER TABLE `secciones` CHANGE `ancho_max_medida` `ancho_max_medida` VARCHAR(3) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL COMMENT 'selectBox,array';
            ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
       ALTER TABLE  `nwforms_grupos` ADD  `descripcion` TEXT NULL COMMENT  'ckeditor';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
       ALTER TABLE `seo_facebook` ADD `appid` VARCHAR(100) NOT NULL AFTER `imagen`;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE  `nwforms_enc` 
ADD  `codigo_libre` TEXT NULL DEFAULT NULL ,
ADD  `tipo_login` VARCHAR( 50 ) NULL DEFAULT NULL ,
ADD  `id_form_siguiente` INT NULL DEFAULT NULL ,
ADD  `id_form_atras` INT NULL DEFAULT NULL ;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE  `nwforms_enc` 
ADD  `id_form_atras` INT NULL DEFAULT NULL ;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE  `nwforms_enc` 
ADD  `id_form_siguiente` INT NULL DEFAULT NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE  `nwforms_enc` 
ADD  `tipo_login` VARCHAR( 50 ) NULL DEFAULT NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE  `nwforms_enc` 
ADD  `codigo_libre` TEXT NULL DEFAULT NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE  `nwforms_enc` ADD  `ancho_maximo` VARCHAR( 5 ) NULL DEFAULT NULL ;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE  `nwforms_grupos` ADD  `columnas_inputs` VARCHAR( 2 ) NULL DEFAULT NULL ;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE  `nwforms_preguntas` 
ADD  `Is_set_value` VARCHAR( 2 ) NULL DEFAULT NULL ,
ADD  `setValueOfTable` VARCHAR( 2 ) NULL DEFAULT NULL ,
ADD  `setValueTable` VARCHAR( 50 ) NULL DEFAULT NULL ,
ADD  `setValueColumnTable` VARCHAR( 50 ) NULL DEFAULT NULL ,
ADD  `setValueKeyForanea` VARCHAR( 50 ) NULL DEFAULT NULL ,
ADD  `setValue` VARCHAR( 50 ) NULL DEFAULT NULL ;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }


        $sql = "
            ALTER TABLE `secciones` CHANGE `ancho_max` `ancho_max` INT(11) NULL COMMENT 'textField';
            ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
            ALTER TABLE `nc_products_variantes` CHANGE `precio_talla` `precio_talla` FLOAT NULL COMMENT 'textField,0,true';
            ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
            ALTER TABLE `nc_products_variantes` CHANGE `nombre_talla` `nombre_talla` VARCHAR(50) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT 'textField';
            ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }



        $sql = "ALTER TABLE  `nc_products_variantes` 
                    ADD  `precio_talla` FLOAT NOT NULL COMMENT  'textField,0,true';";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
            ALTER TABLE  `pv_configuracion_direcciones` ADD  `latitud` VARCHAR( 60 ) NULL ,
ADD  `longitud` VARCHAR( 60 ) NULL ;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `pv_configuracion_direcciones`
CHANGE `direccion` `direccion` TEXT CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT 'textField,0,true,true',
CHANGE `barrio` `barrio` VARCHAR(200) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT 'textField,0,true,true',
CHANGE `telefono` `telefono` VARCHAR(100) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT 'textField,0,true,true',
CHANGE `celular` `celular` INT(12) NULL DEFAULT NULL COMMENT 'textField,0,true,true',
CHANGE `ciudad` `ciudad` VARCHAR(80) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT 'selectBox,ciudades,true,true',
CHANGE `aptocasa` `aptocasa` VARCHAR(60) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT 'textField,0,true,true',
CHANGE `latitud` `latitud` VARCHAR(60) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT 'textField,0,false',
CHANGE `longitud` `longitud` VARCHAR(60) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT 'textField,0,false';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
ALTER TABLE  `pv_configuracion_direcciones` CHANGE  `dir_modo`  `dir_modo` VARCHAR( 25 ) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL COMMENT  'textField,0,false',
CHANGE  `dir_xx`  `dir_xx` VARCHAR( 25 ) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL COMMENT  'textField,0,false',
CHANGE  `dir_yy`  `dir_yy` VARCHAR( 25 ) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL COMMENT  'textField,0,false',
CHANGE  `dir_zz`  `dir_zz` VARCHAR( 25 ) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL COMMENT  'textField,0,false',
CHANGE  `dir_city`  `dir_city` VARCHAR( 25 ) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL COMMENT  'textField,0,false';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
ALTER TABLE  `pv_configuracion_direcciones` CHANGE  `fecha_creacion`  `fecha` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT  'textField,0,false';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
            ALTER TABLE `pv_salidas` CHANGE `telefono` `telefono` VARCHAR( 45 ) NOT NULL COMMENT 'textField';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }


        $sql = "
ALTER TABLE  `nc_colors`
ADD  `filters_valor_min` INT NULL COMMENT  'textField',
ADD  `filters_valor_max` INT NULL COMMENT  'textField',
ADD  `filters_step` INT NULL COMMENT  'textField';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE  `nc_colors`
ADD  `text_label_talla` VARCHAR( 80 ) NULL ,
ADD  `text_label_color` VARCHAR( 80 ) NULL ,
ADD  `text_label_presentacion` VARCHAR( 80 ) NULL ;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE  `nc_colors` ADD  `color_decoracion` VARCHAR( 10 ) NOT NULL ;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE  `nc_colors` CHANGE  `color_decoracion`  `color_dec` VARCHAR( 10 ) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL COMMENT  'textField,0,true';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE  `pv_salidas` ADD  `ip` VARCHAR( 20 ) NULL ,
ADD  `sistema_operativo` VARCHAR( 50 ) NULL ,
ADD  `navegador` VARCHAR( 50 ) NULL ,
ADD  `dispositivo` VARCHAR( 50 ) NULL ;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE  `pv_salidas` ADD  `mobile` VARCHAR( 12 ) NULL ;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }




        $sql = "ALTER TABLE `departamentos` ADD COLUMN `pais` INT NULL BEFORE `usuario`;";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }





        $sql = "
            ALTER TABLE  `pv_salidas` CHANGE  `id`  `id` INT( 11 ) NOT NULL AUTO_INCREMENT COMMENT  'textField,0,false';
            ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
ALTER TABLE `pv_salidas`
CHANGE `bodega` `bodega` INT(11) NULL DEFAULT NULL COMMENT 'selectBox,nc_bodegas',
CHANGE `estado` `estado` INT(11) NULL DEFAULT NULL COMMENT 'selectBox,pv_estados_salidas',
CHANGE `cantidad_total` `cantidad_total` FLOAT NULL DEFAULT NULL COMMENT 'textField,integer',
CHANGE `empresa` `empresa` INT(11) NULL DEFAULT NULL COMMENT 'textField,0,false',
CHANGE `usuario` `usuario` VARCHAR(80) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT 'textField,0,false',
CHANGE `observaciones` `observaciones` TEXT CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT 'textArea',
CHANGE `fecha_salida` `fecha_salida` TIMESTAMP on update CURRENT_TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'textField,0,false',
CHANGE `costo_domicilio` `costo_domicilio` INT(11) NULL DEFAULT NULL COMMENT 'textField,integer',
CHANGE `session` `session` VARCHAR(100) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT 'textField,0,false',
CHANGE `empresa_cliente` `empresa_cliente` INT(11) NULL DEFAULT NULL COMMENT 'textField,0,false',
CHANGE `cliente` `cliente` INT(11) NULL DEFAULT NULL COMMENT 'selectBox,pv_clientes',
CHANGE `fecha_atendido` `fecha_atendido` TIMESTAMP NULL DEFAULT '0000-00-00 00:00:00' COMMENT 'textField,0,false',
CHANGE `telefono` `telefono` FLOAT NULL DEFAULT NULL COMMENT 'textField', CHANGE `cedula` `cedula` FLOAT NULL DEFAULT NULL COMMENT 'textField',
CHANGE `email` `email` VARCHAR(150) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT 'textField',
CHANGE `cliente_text` `cliente_text` VARCHAR(100) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT 'textField',
CHANGE `direccion` `direccion` VARCHAR(100) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT 'textField',
CHANGE `barrio` `barrio` CHAR(150) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT 'textField',
CHANGE `sub_total` `sub_total` FLOAT NULL DEFAULT NULL COMMENT 'textField,integer',
CHANGE `medio` `medio` INT(11) NULL DEFAULT NULL COMMENT 'selectBox,pv_medios',
CHANGE `duracion_pedido` `duracion_pedido` VARCHAR(100) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT 'txtField',
CHANGE `terminal` `terminal` INT(11) NULL DEFAULT NULL COMMENT 'textField,0,false',
CHANGE `motivo_traslado` `motivo_traslado` INT(11) NULL DEFAULT NULL COMMENT 'selectBox';
            ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
ALTER TABLE  `nc_bodegas` CHANGE  `id_ciudad`  `id_ciudad` INT( 11 ) NULL DEFAULT NULL COMMENT  'selectBox,ciudades,true,true,0,Ciudad,true';
            ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
CREATE TABLE IF NOT EXISTS `productos_relaciones` (
    `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'textField,0,false',
    `referencia` int(11) NOT NULL COMMENT 'selectBox,productos',
    `nivel1` int(11) COMMENT 'selectBox,productos_grupos',
    `nivel2` int(11) COMMENT 'selectBox,productos_grupos',
    `nivel3` int(11) COMMENT 'selectBox,productos_grupos',
      `fecha` date DEFAULT NULL COMMENT 'dateField',
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
ALTER TABLE  `productos` ADD  `otros` VARCHAR( 75 ) NULL COMMENT  'textField';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }


        $sql = "
            ALTER TABLE  `pv_salidas`
            ADD  `fecha_pago` TIMESTAMP NULL COMMENT  'dateField',
ADD  `payu_urlget_or_datapost` TEXT NULL COMMENT  'textArea';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
            ALTER TABLE  `pv_salidas` ADD  `fecha_actualizacion_payu` TIMESTAMP NULL COMMENT  'dateField';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
            ALTER TABLE  `pv_salidas` ADD  `forma_respuesta_payu` VARCHAR( 20 ) NULL COMMENT  'textField';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }


        $sql = "
ALTER TABLE  `reservas_variables` ADD  `tipo` VARCHAR( 10 ) NULL COMMENT  'selectBox,array';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
CREATE TABLE IF NOT EXISTS `reservas_disenadores` (
    `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'textField,0,false',
  `nombre` varchar(100) DEFAULT NULL COMMENT 'textField',
  `terminal` INT DEFAULT NULL COMMENT 'textField,0,false',
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
ALTER TABLE  `reservas_realizadas`
ADD  `servicio` INT NULL COMMENT  'selectBox,reservas_variables',
ADD  `disenador` INT NULL COMMENT  'selectBox,reservas_disenadores',
ADD  `valor_total` INT NULL COMMENT  'textField';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
                          ALTER TABLE  `reservas_horarios` ADD  `disenador` INT NULL COMMENT  'selectBox,reservas_disenadores';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }


        $sql = "
            ALTER TABLE `nc_products_variantes` ADD `precio_descuento_tipo` FLOAT NULL AFTER `precio_talla`;
            ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
            ALTER TABLE `pv_configuracion_direcciones` CHANGE `celular` `celular` VARCHAR(120) NULL DEFAULT NULL COMMENT 'textField,0,true,true';
            ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
            ALTER TABLE `analythics` COMMENT = '[{\"config\": {\"cleanHtml\": false}}]';
            ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
ALTER TABLE  `nwforms_preguntas` 
ADD  `sies_valor` VARCHAR( 100 ) NULL ,
ADD  `sies_efecto` VARCHAR( 25 ) NULL ,
ADD  `sies_pregunta` INT NULL ;
            ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE  `nwforms_preguntas` ADD  `validaciones` TEXT NULL ;
            ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
ALTER TABLE  `nwforms_preguntas` ADD  `visible` VARCHAR( 2 ) NULL ;
            ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
ALTER TABLE  `nwforms_grupos` ADD  `visible` VARCHAR( 2 ) NULL ;
            ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }



        $sql = "
ALTER TABLE `nc_colors` ADD `date` DATE NULL COMMENT 'dateField';
            ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
ALTER TABLE `nc_groups` ADD `date` DATE NULL COMMENT 'dateField';
            ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
             ALTER TABLE `nc_groups` CHANGE `empresa` `empresa` INT(11) NOT NULL COMMENT 'textField,0,false';
            ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `nc_groups` CHANGE `orden` `orden` INT(11) NULL DEFAULT '1' COMMENT 'textField,0,true,true,integer';
            ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `nc_groups` CHANGE `nombre` `nombre` TEXT CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT 'textField,0,true,true', CHANGE `color` `color` INT(11) NULL DEFAULT NULL COMMENT 'selectBox,nc_colors,true,true', CHANGE `url_path` `url_path` VARCHAR(100) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT 'textField,0,true,true';
            ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `nc_groups` DROP `date`;
            ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `nc_colors` DROP `date`;
            ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `nc_colors` CHANGE `nombre` `nombre` TEXT CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT 'textField,0,true,true', CHANGE `pagina` `pagina` INT(11) NULL DEFAULT NULL COMMENT 'selectBox,paginas', CHANGE `url_path` `url_path` VARCHAR(100) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT 'textField,0,true,true', CHANGE `activo` `activo` VARCHAR(2) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT 'SI' COMMENT 'selectBox,array', CHANGE `orden` `orden` INT(11) NULL DEFAULT '1' COMMENT 'textField,0,true,true,integer', CHANGE `filters_valor_min` `filters_valor_min` INT(11) NULL DEFAULT NULL COMMENT 'textField,0,true,true,integer,\'Filtro valor mínimo\'', CHANGE `filters_valor_max` `filters_valor_max` INT(11) NULL DEFAULT NULL COMMENT 'textField,0,true,true,integer, \'Filtro valor máximo\'', CHANGE `filters_step` `filters_step` INT(11) NULL DEFAULT NULL COMMENT 'textField,0,true,true,integer, \'Saltos de rango\'';
            ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
             ALTER TABLE `nc_manufacturers` DROP `datetime`;
            ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
             ALTER TABLE `nc_manufacturers_asociate` CHANGE `id` `id` INT(11) NOT NULL AUTO_INCREMENT COMMENT 'textField,0,false', CHANGE `usuario` `usuario` VARCHAR(60) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL COMMENT 'textField,0,false';
            ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `nc_manufacturers_asociate` CHANGE `marca` `marca` VARCHAR(80) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL;
            ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `nw_design` 
ADD `color_soporte` VARCHAR(20) NULL COMMENT 'textField', 
ADD `code_css` TEXT NULL COMMENT 'textArea', 
ADD `url_hoja_css` VARCHAR(50) NULL COMMENT 'textField', 
ADD `plantilla` VARCHAR(10) NULL COMMENT 'selectBox,array';
            ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
 ALTER TABLE nw_design COMMENT '
  [
                {
                   \"selectBoxArrays\": [
              {
                \"name\": \"plantilla\",
                \"data\": {
                    \"estilo1\": \"Estilo 1\",
                    \"estilo2\": \"Estilo 2\",
                    \"estilo3\": \"Estilo 3\"
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
ALTER TABLE `nw_registro` CHANGE `usuario` `usuario` VARCHAR(120) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT 'textField,0,false';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `seo_facebook` CHANGE `imagen` `imagen` TEXT CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT 'uploader,0,true,true,server';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `nwforms_preguntas` 
ADD `orden_lista` VARCHAR(25) NULL, 
ADD `orden_asc_desc` VARCHAR(5) NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `nwforms_enc` ADD `url_redireccion_final` VARCHAR(55) NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
            ALTER TABLE `nc_groups` CHANGE `color` `color` INT(11) NULL DEFAULT NULL COMMENT 'selectBox,nc_colors,true,true,0,Grupo, true';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
            ALTER TABLE `nc_products` CHANGE `relevancia` `relevancia` INT(11) NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `nc_products` 
CHANGE `direccion` `direccion` VARCHAR(100) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL COMMENT 'textField,0,false', 
CHANGE `tags` `tags` VARCHAR(100) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL COMMENT 'textField,0,false', 
CHANGE `descuento_fecha_final` `descuento_fecha_final` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `nc_products_variantes` 
CHANGE `imagen_logo` `imagen_logo` VARCHAR(100) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL COMMENT 'textField,0,true,true', 
CHANGE `unidades_disponibles_t` `unidades_disponibles_t` INT(11) NULL COMMENT 'uploader,0,true,true';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `nc_images` CHANGE `terminal` `terminal` INT(11) NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
            ALTER TABLE  `insertar` 
ADD  `js` text,
ADD  `css_page` text,
ADD  `js_page` text,
ADD  `usuario` VARCHAR(80) NULL,
ADD  `pagina` int(11) NULL,
ADD  `fecha` timestamp NULL DEFAULT NULL
;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE  `menuprincipal_opciones` 
ADD  `tipo_submenu` VARCHAR( 50 ) NULL, 
ADD  `fondo_submenu` VARCHAR( 50 ) NULL, 
ADD  `active_link` VARCHAR( 50 ) NULL, 
ADD  `active_link_color_font` VARCHAR( 50 ) NULL 
;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE  `menuprincipal_opciones` 
ADD  `color_font_submenu` VARCHAR( 50 ) NULL 
;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE  `menuprincipal_opciones` 
ADD  `tipo_menu` VARCHAR( 50 ) NULL 
;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
      ALTER TABLE `paginas` CHANGE `fecha_ingreso` `fecha_ingreso` TIMESTAMP on update CURRENT_TIMESTAMP NULL DEFAULT NULL COMMENT 'dateField';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
            ALTER TABLE `articles_config` ADD `tipo_numero` VARCHAR(2) NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
            ALTER TABLE `idiomas` ADD `icon` VARCHAR(50) NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
   ALTER TABLE `paginas_equivalencia_idiomas` 
   CHANGE `pagina_madre` `pagina_madre` INT(11) NULL DEFAULT NULL COMMENT 'selectBox,paginas', 
   CHANGE `idioma_id` `idioma_id` INT(11) NULL DEFAULT NULL COMMENT 'selectBox,idiomas';
";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
            ALTER TABLE `paginas` ADD `position` INT NULL COMMENT 'textField';
";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
            ALTER TABLE `paginas` ADD `use_hreflang` VARCHAR(2) NULL COMMENT 'selectBox,boolean';
";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
  ALTER TABLE `idiomas` ADD `activo` VARCHAR(2) NULL COMMENT 'selectBox,boolean';
";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
 ALTER TABLE `idiomas` CHANGE `icon` `icon` VARCHAR(80) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL COMMENT 'uploader';
";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
CREATE TABLE IF NOT EXISTS `nc_cupones` (
  `id` int(20) unsigned NOT NULL AUTO_INCREMENT COMMENT 'textField,0,false',
  `nombre` varchar(50) DEFAULT NULL,
  `tipo_descuento` varchar(15) DEFAULT NULL COMMENT 'selectBox,array',
  `valor` varchar(50) DEFAULT NULL,
  `fecha_expiracion` date DEFAULT NULL  COMMENT 'dateField',
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
 ALTER TABLE nc_cupones COMMENT ' [
   {
                    \"selectBoxArrays\": [
              {
                \"name\": \"tipo_descuento\",
                \"data\": {
                    \"valor\": \"Valor\",
                    \"porcentaje\": \"Porcentaje\"
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
CREATE TABLE IF NOT EXISTS `nc_cupones_redimidos` (
  `id` int(20) unsigned NOT NULL AUTO_INCREMENT COMMENT 'textField,0,false',
  `usuario` varchar(100) DEFAULT NULL,
  `cupon` varchar(50) DEFAULT NULL,
  `fecha` date DEFAULT NULL  COMMENT 'dateField',
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE menuprincipal CONVERT TO CHARACTER SET utf8;
ALTER TABLE secciones CONVERT TO CHARACTER SET utf8;
ALTER TABLE imagenes CONVERT TO CHARACTER SET utf8;
ALTER TABLE footer CONVERT TO CHARACTER SET utf8;
ALTER TABLE galeria_noticias CONVERT TO CHARACTER SET utf8;
ALTER TABLE noticias CONVERT TO CHARACTER SET utf8;
ALTER TABLE productos CONVERT TO CHARACTER SET utf8;

ALTER TABLE secciones CONVERT TO CHARACTER SET utf8 COLLATE utf8_general_ci;
ALTER TABLE secciones DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;
ALTER TABLE secciones CHANGE texto texto TEXT CHARACTER SET utf8 COLLATE utf8_general_ci;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `nwp_popup` ADD `url` VARCHAR(120) NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `pv_salidas` 
ADD `nombre_recibe_pedido` VARCHAR(120) NULL, 
ADD `apellido_recibe_pedido` VARCHAR(120) NULL, 
ADD `direccion_recibe_pedido` VARCHAR(120) NULL, 
ADD `telefono_recibe_pedido` VARCHAR(120) NULL, 
ADD `pais_recibe_pedido` VARCHAR(120) NULL, 
ADD `departamento_recibe_pedido` VARCHAR(120) NULL, 
ADD `ciudad_recibe_pedido` VARCHAR(120) NULL,
ADD `pais_recibe_pedido_text` VARCHAR(120) NULL, 
ADD `departamento_recibe_pedido_text` VARCHAR(120) NULL, 
ADD `ciudad_recibe_pedido_text` VARCHAR(120) NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `pv_salidas` CHANGE `fecha_atendido` `fecha_atendido` TIMESTAMP NULL DEFAULT NULL COMMENT 'textField,0,false';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `pv_salidas` CHANGE `celular` `celular` VARCHAR(20) NULL DEFAULT NULL COMMENT 'textField';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `pv_salidas_det` ADD `referencia` CHAR(25) NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
            ALTER TABLE `secciones` ADD `clase_dom` CHAR(25) NULL;
";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
            ALTER TABLE `menuprincipal` ADD `clase_dom` CHAR(25) NULL;
";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
CREATE TABLE IF NOT EXISTS `nwp_zonaclientes_categorias` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT 'textField,0,false',
  `nombre` varchar(50) DEFAULT NULL COMMENT 'textField',
  `orden` int(11) DEFAULT NULL,
  `abrir_en_popup` char(2) DEFAULT NULL COMMENT 'selectBox,boolean',
  `pagina` int(11) NOT NULL  COMMENT 'selectBox,paginas',
  `usuario` varchar(100) DEFAULT NULL COMMENT 'textField,0,false',
  `empresa` int(11) DEFAULT NULL COMMENT 'textField,0,false',
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=0 ;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
CREATE TABLE IF NOT EXISTS `nwp_zonaclientes_contenido` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT 'textField,0,false',
  `pagina` int(11) NOT NULL COMMENT 'selectBox,paginas',
  `categoria` int(11) DEFAULT NULL COMMENT 'selectBox,nwp_zonaclientes_categorias',
  `forma` char(15) NOT NULL COMMENT 'selectBox,array',
  `mostrar_en_el_home` char(2) DEFAULT NULL COMMENT 'selectBox,boolean',
  `titulo` varchar(100) DEFAULT NULL,
  `archivo` varchar(150) DEFAULT NULL COMMENT 'uploader',
  `imagen_portada` varchar(150) DEFAULT NULL COMMENT 'uploader',
  `descripcion` text DEFAULT NULL COMMENT 'ckeditor',
  `orden` int(11) DEFAULT NULL,
  `usuario` varchar(100) DEFAULT NULL COMMENT 'textField,0,false',
  `empresa` int(11) DEFAULT NULL COMMENT 'textField,0,false',
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=0 ;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
CREATE TABLE IF NOT EXISTS `nwp_zonaclientes_clientes` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT 'textField,0,false',
   `pagina` int(11) NOT NULL COMMENT 'selectBox,paginas',
  `logotipo` varchar(100) DEFAULT NULL COMMENT 'uploader',
  `nombre` varchar(100) DEFAULT NULL,
  `url_propuesta` varchar(200) DEFAULT NULL,
  `dirigido_a_name` varchar(100) DEFAULT NULL,
  `correo` varchar(100) DEFAULT NULL,
  `clave` varchar(100) DEFAULT NULL,
  `fecha_inicial` date DEFAULT NULL COMMENT 'dateField',
  `fecha_final` date DEFAULT NULL COMMENT 'dateField',
  `fecha_ingreso` date DEFAULT NULL COMMENT 'dateField',
  `usuario` varchar(100) DEFAULT NULL COMMENT 'textField,0,false',
  `empresa` int(11) DEFAULT NULL COMMENT 'textField,0,false',
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=0 ;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `nwp_zonaclientes_contenido` CHANGE `forma` `forma` VARCHAR(25) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT 'selectBox,array';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE nwp_zonaclientes_contenido COMMENT ' [
   {
                    \"selectBoxArrays\": [
              {
                \"name\": \"forma\",
                \"data\": {
                    \"libre\": \"Libre\",
                    \"slider\": \"Slider\",
                    \"videos\": \"Videos\",
                    \"videos_instructivo\": \"Videos Instructivos\",
                    \"card\": \"Card\",
                    \"list\": \"Lista\"
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
             ALTER TABLE `terminales` CHANGE `tienda_nwscliente` `tienda_nwscliente` INT(11) NULL COMMENT 'selectBox,pv_empresas_clientes';
            ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }


        $sql = "ALTER TABLE analythics COMMENT = '[{\"config\": {\"cleanHtml\": false, \"cleanSpecialWords\": false}}]';";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "ALTER TABLE bing COMMENT = '[{'config': {'cleanHtml': false}}]';";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "ALTER TABLE canonical COMMENT = '[{'config': {'cleanHtml': false}}]';";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "ALTER TABLE dublin_core COMMENT = '[{'config': {'cleanHtml': false}}]';";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "ALTER TABLE google COMMENT = '[{'config': {'cleanHtml': false}}]';";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "ALTER TABLE google COMMENT = '[{\"config\": {\"cleanSpecialWords\": false,\"cleanHtml\": false}}]';";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
         ALTER TABLE  `productos_grupos` CHANGE  `id`  `id` INT( 11 ) NOT NULL AUTO_INCREMENT COMMENT  'textField,0,false',
CHANGE  `nombre`  `nombre` VARCHAR( 100 ) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT  'textField',
CHANGE  `pagina`  `pagina` INT( 11 ) NULL DEFAULT NULL COMMENT  'selectBox,paginas',
CHANGE  `nivel`  `nivel` INT( 11 ) NULL DEFAULT  '1' COMMENT  'selectBox,array',
CHANGE  `pertenece`  `pertenece` INT( 11 ) NULL DEFAULT NULL COMMENT  'selectBox,productos_grupos',
CHANGE  `imagen`  `imagen` VARCHAR( 150 ) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT  'uploader',
CHANGE  `descripcion`  `descripcion` VARCHAR( 250 ) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT  'ckeditor',
CHANGE  `orden`  `orden` INT( 11 ) NULL DEFAULT NULL COMMENT  'textField',
CHANGE  `activo`  `activo` VARCHAR( 2 ) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT  'selectBox,boolean';
            ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "   ALTER TABLE productos_grupos COMMENT ' [
   {
                    \"selectBoxArrays\": [
              {
                \"name\": \"nivel\",
                \"data\": {
                    \"1\": \"1\",
                    \"2\": \"2\",
                    \"3\": \"3\"
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
ALTER TABLE `productos_config`
CHANGE `id` `id` INT(11) NOT NULL AUTO_INCREMENT COMMENT 'textField,0,false',
CHANGE `pagina` `pagina` INT(11) NULL DEFAULT NULL COMMENT 'selectBox,paginas',
CHANGE `mostrar_categorias` `mostrar_categorias` VARCHAR(2) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT 'selectBox,boolean',
CHANGE `estilo_lista_columna` `estilo_lista_columna` VARCHAR(40) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT 'selectBox,array',
CHANGE `estilo_general` `estilo_general` VARCHAR(50) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT 'selectBox,array',
CHANGE `mostrar_descripcion` `mostrar_descripcion` VARCHAR(2) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT 'selectBox,boolean',
CHANGE `categorias_hor_vert` `categorias_hor_vert` VARCHAR(20) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT 'selectBox,array',
CHANGE `usuario` `usuario` VARCHAR(100) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT 'textField,0,false',
CHANGE `fecha` `fecha` DATE NULL DEFAULT NULL COMMENT 'textField,0,false',
CHANGE `title_menu` `title_menu` VARCHAR(100) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT 'textField',
CHANGE `fondo_left` `fondo_left` VARCHAR(100) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT 'colorButton',
CHANGE `fondo_links_left` `fondo_links_left` VARCHAR(100) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT 'colorButton',
CHANGE `mostrar_titulos_home` `mostrar_titulos_home` VARCHAR(2) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT 'selectBox,boolean',
CHANGE `title_right_home` `title_right_home` VARCHAR(100) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT 'textField',
CHANGE `fondo_right` `fondo_right` VARCHAR(100) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT 'colorButton',
CHANGE `mostrar_en_home` `mostrar_en_home` VARCHAR(100) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT 'selectBox,array',
CHANGE `img_banner_home` `img_banner_home` VARCHAR(150) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT 'uploader',
CHANGE `show_mas_vistos` `show_mas_vistos` VARCHAR(2) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT 'selectBox,boolean',
CHANGE `estilo_producto_unitario` `estilo_producto_unitario` VARCHAR(80) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT 'selectBox,array',
CHANGE `hoja_contacto` `hoja_contacto` VARCHAR(60) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT 'selectBox,paginas',
CHANGE `marca_agua` `marca_agua` VARCHAR(70) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT 'uploader',
CHANGE `tamano_por_pagina` `tamano_por_pagina` VARCHAR(5) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT 'textField',
CHANGE `usar_tabs` `usar_tabs` VARCHAR(2) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT 'selectBox,boolean',
CHANGE `menu_modo` `menu_modo` VARCHAR(11) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT 'selectBox,array',
CHANGE `otras_fotos` `otras_fotos` VARCHAR(2) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT 'selectBox,boolean',
CHANGE `mostrar_slider` `mostrar_slider` VARCHAR(2) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT 'selectBox,boolean',
CHANGE `modo_contacto` `modo_contacto` VARCHAR(20) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT 'selectBox,array';
            ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "   ALTER TABLE productos_config COMMENT ' [
   {
                    \"selectBoxArrays\": [
              {
                \"name\": \"estilo_lista_columna\",
                \"data\": {
                    \"lista\": \"Listas\",
                    \"cuadros\": \"Cuadros\",
                    \"lista_dos_columnas\": \"Lista en dos columnas\"
                }
            },
              {
                \"name\": \"categorias_hor_vert\",
                \"data\": {
                    \"catalogo\": \"Catálogo\",
                    \"galeria\": \"Galería\",
                    \"archivos\": \"Archivos\",
                    \"videos\": \"Videos\"
                }
            },
              {
                \"name\": \"estilo_general\",
                \"data\": {
                    \"vertical\": \"Vertical\",
                    \"horizontal\": \"Horizontal\",
                    \"videos\": \"Videos\"
                }
            },
              {
                \"name\": \"mostrar_en_home\",
                \"data\": {
                    \"ultimos_productos\": \"Últimos Ítems\",
                    \"categorias_imagen\": \"Solo Categorías\",
                    \"productos_y_categorias\": \"Solo Últimos ítems y Categorías\"
                }
            },
              {
                \"name\": \"estilo_producto_unitario\",
                \"data\": {
                    \"auto\": \"Automático\",
                    \"img_arriba_des_abajo\": \"Imagen Arriba Descripción abajo\",
                    \"img_arriba_des_der\": \"Imagen Arriba Descripción Derecha\"
                }
            },
              {
                \"name\": \"menu_modo\",
                \"data\": {
                    \"categorias\": \"Categorías\",
                    \"productos\": \"Productos\",
                    \"no_mostrar\": \"No Mostrar\"
                }
            },
              {
                \"name\": \"modo_contacto\",
                \"data\": {
                    \"boton\": \"Botón\",
                    \"form\": \"Formulario\"
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
            ALTER TABLE  `productos_config`
            ADD  `mostrar_titulos_categs` VARCHAR( 2 ) NULL COMMENT  'selextBox,boolean',
ADD  `mostrar_productos_y_categs_por_categs` VARCHAR( 2 ) NULL COMMENT  'selextBox,boolean';";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
            ALTER TABLE  `pv_salidas` CHANGE  `valor_total`  `valor_total` FLOAT NULL DEFAULT NULL COMMENT  'textField,money';
";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
            ALTER TABLE  `nc_products`ADD  `seo_titulo` VARCHAR( 70 ) NULL COMMENT  'textField';  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
            ALTER TABLE  `nc_products`
ADD  `seo_descripcion` VARCHAR( 170 ) NULL COMMENT  'textField';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
            ALTER TABLE  `nc_products`
ADD  `seo_palabras` VARCHAR( 200 ) NULL COMMENT  'textField';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }


        $sql = "
            ALTER TABLE  `pv_salidas`
            ADD  `estado_pago` VARCHAR( 60 ) NULL COMMENT  'textField',
ADD  `medio_pago` VARCHAR( 60 ) NULL COMMENT  'textField',
ADD  `cus` VARCHAR( 60 ) NULL COMMENT  'textField';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE  `pv_salidas`
ADD  `ciudad` INT NULL COMMENT  'selectBox,ciudades',
ADD  `departamento` INT NULL COMMENT  'selectBox,deptosGeo',
ADD  `pais` INT NULL COMMENT  'selectBox,paises';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE  `idiomas` ADD  `name_in_english` VARCHAR( 60 ) NULL COMMENT  'textField';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }


        $sql = "
ALTER TABLE  `pv_salidas` ADD  `ref_pago` VARCHAR( 50 ) NULL COMMENT  'textField';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
            ALTER TABLE  `footer` CHANGE  `ancho_centro`  `ancho_centro` VARCHAR( 10 ) NULL DEFAULT NULL COMMENT  'textField';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
            ALTER TABLE  `nc_products`
            ADD  `precio_descuento` INT NULL COMMENT  'textField',
ADD  `descuento_fecha_inicial` DATE NULL COMMENT  'dateField',
ADD  `descuento_fecha_final` DATE NULL COMMENT  'dateField',
ADD  `texto_boton_notificar_existencias` VARCHAR( 100 ) NULL COMMENT  'textField';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
CREATE TABLE IF NOT EXISTS `nc_products_visitas` (
    `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'textField,0,false',
  `producto_id` int(11) DEFAULT NULL COMMENT 'textField',
  `producto_name` VARCHAR(150) DEFAULT NULL COMMENT 'textField',
  `visita` VARCHAR(1) DEFAULT NULL COMMENT 'textField',
  `ip` VARCHAR(30) DEFAULT NULL COMMENT 'textField',
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
ALTER TABLE  `secciones`
ADD  `color_fondo` VARCHAR( 75 ) NULL COMMENT  'textField',
ADD  `color_texto` VARCHAR( 75 ) NULL COMMENT  'textField';

  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
ALTER TABLE  `secciones` ADD  `css` TEXT NULL COMMENT  'textArea';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }


        $sql = "
            ALTER TABLE  `pv_costos_domicilio` ADD  `descuento_aplica_con_domicilio` VARCHAR( 2 ) NULL COMMENT  'selectBox,boolean';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
            ALTER TABLE  `pv_costos_domicilio` CHANGE  `fecha`  `fecha` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP COMMENT  'textField,0,false';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }


        $sql = "
ALTER TABLE  `pv_salidas`
ADD  `usuario_acepta_cancelado` VARCHAR( 100 ) NULL COMMENT  'textField',
ADD  `fecha_acepta_cancelado` TIMESTAMP NULL COMMENT  'dateField';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
INSERT INTO  `pv_estados_salidas` (
`id` ,
`nombre` ,
`usuario` ,
`fecha` ,
`empresa`
)
VALUES (
7 ,  'Cancelado por el cliente y aceptado por la tienda',  'alexf',
CURRENT_TIMESTAMP ,  '1'
);
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }




        $sql = "ALTER TABLE `departamentos` ADD COLUMN `pais` INT NULL AFTER `usuario`;";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }




        $sql = "
ALTER TABLE  `nwanimate_objetos` ADD  `capa` INT NOT NULL COMMENT  'textField';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
CREATE TABLE IF NOT EXISTS `nwforms_destinatarios` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT COMMENT 'textField,0,false',
  `nombre` varchar(50) DEFAULT NULL COMMENT 'textField',
  `correo` varchar(50) DEFAULT NULL COMMENT 'textField',
  `id_form` int(11) DEFAULT NULL COMMENT 'selectBox,nwforms_enc',
  `empresa` int(11) DEFAULT NULL COMMENT 'textField,0,false',
  `usuario` varchar(80) DEFAULT NULL COMMENT 'textField,0,false',
  `fecha` text COMMENT 'dateField',
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE  `nwforms_enc` ADD  `enviar_mail` VARCHAR( 2 ) NULL COMMENT  'selectBox,array';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
CREATE TABLE IF NOT EXISTS `nwforms_respuestas_users_enc` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_enc` varchar(60) NOT NULL,
  `fecha` timestamp NULL DEFAULT NULL,
  `usuario` varchar(60) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
CREATE TABLE IF NOT EXISTS `nwforms_respuestas_users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_enc` varchar(60) NOT NULL,
  `campo` varchar(60) NOT NULL,
  `respuesta` varchar(60) NOT NULL,
  `fecha` timestamp NULL DEFAULT NULL,
  `usuario` varchar(60) NOT NULL,
  `enc_user` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
CREATE TABLE IF NOT EXISTS `nwforms_preguntas_valores` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_enc` varchar(60) NOT NULL,
  `id_pregunta` varchar(60) NOT NULL,
  `value` varchar(60) NOT NULL,
  `nombre` varchar(60) NOT NULL,
  `fecha` timestamp NULL DEFAULT NULL,
  `usuario` varchar(60) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
CREATE TABLE IF NOT EXISTS `nwforms_preguntas` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_enc` varchar(60) NOT NULL,
  `nombre` varchar(60) NOT NULL,
  `texto_ayuda` varchar(60) DEFAULT NULL,
  `requerido` varchar(60) NOT NULL,
  `tipo` varchar(10) NOT NULL,
  `orden` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
CREATE TABLE IF NOT EXISTS `nwforms_enc` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(60) NOT NULL,
  `usuario` varchar(60) NOT NULL,
  `fecha` date NOT NULL,
  `privado` varchar(2) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
ALTER TABLE  `nwforms_enc`
ADD  `submit_externo` VARCHAR( 2 ) NULL COMMENT  'textField',
ADD  `funcion_submit_externo` VARCHAR( 100 ) NULL COMMENT  'textField';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE  `nwforms_preguntas`
ADD  `usar_name_submit` VARCHAR( 2 ) NULL COMMENT  'textField',
ADD  `name_submit` VARCHAR( 60 ) NULL COMMENT  'textField';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
            ALTER TABLE  `pv_anular` CHANGE  `empresa`  `empresa` INT( 11 ) NULL DEFAULT NULL COMMENT  'textField,0,false',
CHANGE  `usuario`  `usuario` VARCHAR( 80 ) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT  'textField,0,false',
CHANGE  `fecha`  `fecha` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT  'textField,0,false';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
      ALTER TABLE  `pv_banner` CHANGE  `id`  `id` INT( 11 ) NOT NULL AUTO_INCREMENT COMMENT  'textField,0,false',
CHANGE  `imagen`  `imagen` VARCHAR( 150 ) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT  'uploader',
CHANGE  `usuario`  `usuario` VARCHAR( 80 ) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT  'textField,0,false',
CHANGE  `empresa`  `empresa` INT( 11 ) NULL DEFAULT NULL COMMENT  'textField,0,false',
CHANGE  `empresa_cliente`  `empresa_cliente` INT( 11 ) NULL DEFAULT NULL COMMENT  'selectBox,pv_empresas_clientes',
CHANGE  `terminal`  `terminal` INT( 11 ) NULL DEFAULT NULL COMMENT  'textField,0,false',
CHANGE  `fecha`  `fecha` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT  'textField,0,false';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `pv_configuracion_tienda`
CHANGE `id` `id` INT(11) NOT NULL AUTO_INCREMENT COMMENT 'textField,0,false',
CHANGE `fondo_color_menu` `fondo_color_menu` VARCHAR(40) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT 'colorButton',
CHANGE `fondo_general` `fondo_general` VARCHAR(100) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT 'selectBox,array',
CHANGE `estilo_productos` `estilo_productos` VARCHAR(100) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT 'selectBox,array',
CHANGE `usuario` `usuario` VARCHAR(100) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT 'textField,0,false',
CHANGE `empresa` `empresa` INT(11) NULL DEFAULT NULL COMMENT 'textField,0,false',
CHANGE `terminal` `terminal` INT(11) NULL DEFAULT NULL COMMENT 'textField,0,false',
CHANGE `fecha` `fecha` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'textField,0,false',
CHANGE `fondo_img_menu` `fondo_img_menu` VARCHAR(150) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT 'uploader',
CHANGE `estilo_menu` `estilo_menu` VARCHAR(50) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT 'selectBox,array',
CHANGE `mostrar_banner` `mostrar_banner` VARCHAR(2) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT 'selectBox,array',
CHANGE `fondo_titulos` `fondo_titulos` VARCHAR(50) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT 'colorButton',
CHANGE `fondo_menu_activo` `fondo_menu_activo` VARCHAR(50) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT 'colorButton',
CHANGE `colorfont_menu_activo` `colorfont_menu_activo` VARCHAR(50) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT 'colorButton',
CHANGE `colorfont_menu` `colorfont_menu` VARCHAR(50) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT 'colorButton',
CHANGE `mostrar_destacados` `mostrar_destacados` VARCHAR(2) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT 'selectBox,array',
CHANGE `activo` `activo` VARCHAR(2) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT 'selectBox,array',
CHANGE `colorfont_titulos` `colorfont_titulos` VARCHAR(50) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT 'colorButton',
CHANGE `diseno` `diseno` VARCHAR(1) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT 'selectBox,array',
CHANGE `usar_fondo_grupos` `usar_fondo_grupos` VARCHAR(2) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT 'selectBox,array',
CHANGE `salsas_popup` `salsas_popup` VARCHAR(10) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT 'selectBox,array',
CHANGE `diseno_carrito` `diseno_carrito` VARCHAR(1) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT 'selectBox,array',
CHANGE `tienda_nwscliente` `tienda_nwscliente` INT(11) NOT NULL COMMENT 'selectBox,pv_empresas_clientes';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
 ALTER TABLE pv_configuracion_tienda COMMENT '
[{\"selectBoxArrays\":[{\"name\":\"mostrar_destacados\",\"data\":{\"SELECCIONE\":\"Seleccione\",\"SI\":\"SI\",\"NO\":\"NO\"}},{\"name\":\"activo\",\"data\":{\"SELECCIONE\":\"Seleccione\",\"SI\":\"SI\",\"NO\":\"NO\"}},{\"name\":\"mostrar_banner\",\"data\":{\"SELECCIONE\":\"Seleccione\",\"SI\":\"SI\",\"NO\":\"NO\"}},{\"name\":\"salsas_popup\",\"data\":{\"SELECCIONE\":\"Seleccione\",\"left\":\"left\",\"right\":\"right\"}},{\"name\":\"fondo_general\",\"data\":{\"SELECCIONE\":\"Seleccione\",\"orange\":\"orange\",\"brown\":\"brown\",\"red\":\"red\",\"yellow\":\"yellow\",\"green\":\"green\"}},{\"name\":\"estilo_productos\",\"data\":{\"SELECCIONE\":\"Seleccione\",\"cuadros\":\"cuadros\",\"lista\":\"lista\"}},{\"name\":\"diseno_carrito\",\"data\":{\"SELECCIONE\":\"Seleccione\",\"1\":\"1\",\"2\":\"2\",\"3\":\"3\"}},{\"name\":\"diseno\",\"data\":{\"SELECCIONE\":\"Seleccione\",\"1\":\"1\",\"2\":\"2\"}}]}]
';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
             ALTER TABLE  `pv_empresas_descripcion` DROP  `costo_domicilio` ;
;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
             ALTER TABLE  `pv_empresas_descripcion` DROP  `descuento_global_porcentaje` ;
;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
             ALTER TABLE  `pv_costos_domicilio` ADD  `descuento_global_porcentaje` VARCHAR( 3 ) NULL COMMENT  'textField';
;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
             ALTER TABLE  `pv_salidas` ADD  `descuento_porcentaje` INT NULL COMMENT  'textField',
ADD  `descuento_valor` INT NULL COMMENT  'textField';
;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
             ALTER TABLE  `usuarios_empresas`
             ADD  `perfil` INT NULL COMMENT  'selectBox,perfiles',
ADD  `terminal` INT NULL COMMENT  'selectBox,terminales';
;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
          DROP TABLE tz_who_is_online
;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
          DROP TABLE servicios_tabs;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
        DROP TABLE tiposdeletra;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
        DROP TABLE usuarios_facebook;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
        DROP TABLE webmovil;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
        DROP TABLE registre_su_pago;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
       DROP TABLE registro;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
        DROP TABLE registros;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
        DROP TABLE acordeon_horizontal;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
         DROP TABLE archivos;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
          DROP TABLE cambios_claves;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
         DROP TABLE carpeta;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
       DROP TABLE datos;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
       DROP TABLE encuestas;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
       DROP TABLE encuestas_respuestas;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
       DROP TABLE eventos;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
    DROP TABLE galeria_audiovisuales;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
    DROP TABLE galeria_productos_tira;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
               DROP TABLE galeria_saint_germain;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
                DROP TABLE galeria_seguridad;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
                  DROP TABLE galeria_videos_audiovisuales;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
                 DROP TABLE marco1;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
                 DROP TABLE marco2;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
                 DROP TABLE mensajes_italo;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
                  DROP TABLE musica;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
                DROP TABLE noticias_marquee;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
             ALTER TABLE  `nwforms_enc` CHANGE  `id`  `id` INT( 11 ) NOT NULL AUTO_INCREMENT COMMENT  'textField,0,false',
CHANGE  `nombre`  `nombre` VARCHAR( 60 ) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL COMMENT  'textField',
CHANGE  `usuario`  `usuario` VARCHAR( 60 ) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL COMMENT  'textField,0,false',
CHANGE  `privado`  `privado` VARCHAR( 2 ) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL COMMENT  'selectBox,array',
CHANGE  `fecha`  `fecha` DATE NOT NULL COMMENT  'dateField';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
 ALTER TABLE nwforms_enc COMMENT ' [
   {
                    \"selectBoxArrays\": [
              {
                \"name\": \"privado\",
                \"data\": {
                    \"SI\": \"SI\",
                    \"NO\": \"NO\"
                }
            },
              {
                \"name\": \"enviar_mail\",
                \"data\": {
                    \"SI\": \"SI\",
                    \"NO\": \"NO\"
                }
            },
              {
                \"name\": \"offline\",
                \"data\": {
                    \"SI\": \"SI\",
                    \"NO\": \"NO\"
                }
            },
              {
                \"name\": \"offline_usar_consulta\",
                \"data\": {
                    \"SI\": \"SI\",
                    \"NO\": \"NO\"
                }
            },
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
ALTER TABLE  `nc_filtros_productos` DROP  `empresa` ;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE  `nc_filtros` ADD  `activo` VARCHAR(2) NULL COMMENT  'selectBox,boolean';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE  `nc_filtros_cat` ADD  `activo` VARCHAR(2) NULL COMMENT  'selectBox,boolean';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE  `nc_filtros` ADD  `orden` VARCHAR(2) NULL COMMENT  'textField';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE  `nc_filtros_cat` ADD  `orden` VARCHAR(2) NULL COMMENT  'textField';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
              DROP TABLE contacto_ieko;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
            ALTER TABLE  `productos_grupos` ADD  `activo` VARCHAR( 2 ) NULL COMMENT  'selectBox,boolean';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE  `idiomas` CHANGE  `id`  `id` INT( 11 ) NOT NULL AUTO_INCREMENT COMMENT  'textField,0,false';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
CREATE TABLE IF NOT EXISTS `nwforms_autocontestador` (
    `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'textField,0,false',
  `id_form` int(11) NOT NULL COMMENT 'selectBox,nwforms_enc',
  `activo` varchar(2) DEFAULT NULL COMMENT 'selectBox,boolean',
  `body` text DEFAULT NULL COMMENT 'ckeditor',
  `usuario` varchar(100) DEFAULT NULL COMMENT 'textField,0,false',
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;
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
CREATE TABLE nwanimate_code (
    id int(11) NOT NULL AUTO_INCREMENT,
    id_enc int(11),
    escena int(11),
    codigo text,
    usuario varchar(100),
    empresa int(11),
    terminal int(11),
     PRIMARY KEY (id)
)ENGINE=InnoDB CHARSET=latin1;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
CREATE TABLE nwanimate_enc (
    id int(11) NOT NULL AUTO_INCREMENT,
    nombre varchar(80),
    descripcion varchar(100),
    fecha DATETIME,
    usuario varchar(70),
    empresa int(11),
    terminal int(11),
    publico varchar(2),
    tipo varchar(20),
    ancho int(11),
    alto int(11),
    ancho_medida varchar(2),
    alto_medida varchar(2),
     PRIMARY KEY (id)
);
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
CREATE TABLE nwanimate_escenas (
    id int(11) NOT NULL AUTO_INCREMENT,
    nombre varchar(70),
    id_enc int(11),
    fecha DATETIME,
    usuario varchar(80),
    empresa int(11),
    duracion varchar(50),
    transicion varchar(50),
    orden int(11),
    background varchar(50),
    transicion_final varchar(50),
     PRIMARY KEY (id)
);
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
CREATE TABLE nwanimate_objects_animation (
    id int(11) NOT NULL AUTO_INCREMENT,
    pos_x text,
    pos_y text,
    opacidad int(11),
    velocidad text,
    usuario varchar(60),
    empresa int(11),
    terminal int(11),
    objeto int(11),
    delay text,
    num_animate int(11),
    activo varchar(2),
    width text,
    height text,
    easing varchar(20),
     PRIMARY KEY (id)
);
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
CREATE TABLE nwanimate_objetos (
    id int(11) NOT NULL AUTO_INCREMENT,
    id_enc int(11),
    id_escena int(11),
    pos_x text,
    pos_y text,
    fecha DATETIME,
    descripcion text,
    nombre text,
    usuario varchar(60),
    empresa int(11),
    animado varchar(2),
    pos_x_final text,
    pos_y_final text,
    orden int(11),
    imagen varchar(100),
    width varchar(50),
    height varchar(50),
    repeticiones varchar(10),
    movimiento varchar(2),
    pos_x_inicial text,
    pos_y_inicial text,
    velocidad int(11),
    reproducir varchar(100),
    opacidad_inicial int(11),
    opacidad_final int(11),
    tipo varchar(10),
    color varchar(50),
    rotacion varchar(10),
    tipo_figura varchar(25),
     PRIMARY KEY (id)
);
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }


        $sql = "
ALTER TABLE  `idiomas` CHANGE  `idioma`  `nombre` TEXT CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT  'textField';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
            UPDATE `noticias` SET fecha_creacion = NULL WHERE CAST(fecha_creacion AS CHAR(20)) = '0000-00-00 00:00:00'
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
            ALTER TABLE `noticias` CHANGE `fecha_creacion` `fecha_creacion` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'textField,0,false';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
            ALTER TABLE `noticias` CHANGE `fecha` `fecha` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'dateField';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
            ALTER TABLE `noticias` ADD `mostrar_rss` BOOLEAN NOT NULL AFTER `Keywords`;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
            ALTER TABLE `noticias` CHANGE `mostrar_rss` `mostrar_rss` TINYINT(1) NULL DEFAULT NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
              CREATE TABLE IF NOT EXISTS `nw_config_pagina` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `tamano_texto` varchar(2) NOT NULL,
  `fuente_texto` varchar(50) NOT NULL,
  `header_menu_position` varchar(50) NOT NULL,
  `color_texto` varchar(30) NOT NULL,
  `color_texto_footer` varchar(30) NOT NULL,
  `tamano_texto_footer` varchar(2) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=2 
;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }


        $sql = "
ALTER TABLE  `nc_manufacturers` CHANGE  `name`  `nombre` TEXT CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT  'textField';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE  `nc_groups` CHANGE  `name`  `nombre` VARCHAR( 100 ) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT  'textField';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE  `nc_colors` CHANGE  `name`  `nombre` VARCHAR( 100 ) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT  'textField';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
 ALTER TABLE nc_products COMMENT ' [
   {
                    \"selectBoxArrays\": [
              {
                \"name\": \"registrado\",
                \"data\": {
                    \"1\": \"SI\",
                    \"0\": \"NO\"
                }
            },
              {
                \"name\": \"active\",
                \"data\": {
                    \"1\": \"SI\",
                    \"0\": \"NO\"
                 }
               },
              {
                \"name\": \"important\",
                \"data\": {
                    \"1\": \"SI\",
                    \"0\": \"NO\"
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
ALTER TABLE  `nc_products` CHANGE  `productID`  `id` INT( 11 ) NOT NULL AUTO_INCREMENT COMMENT  'textField,0,false';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE  `nc_products`
CHANGE  `id`  `id` INT( 11 ) NOT NULL AUTO_INCREMENT COMMENT  'textField,0,false',
CHANGE  `asociate`  `asociate` INT( 11 ) NULL DEFAULT NULL COMMENT  'textField,0,false',
CHANGE  `productName`  `productName` VARCHAR( 50 ) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT  'textField',
CHANGE  `productImage`  `productImage` VARCHAR( 250 ) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT  'uploader',
CHANGE  `productPrice`  `productPrice` TEXT CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT  'textField',
CHANGE  `productCode`  `productCode` VARCHAR( 50 ) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT  'textField',
CHANGE  `productBefore`  `productBefore` TEXT CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT  'textField',
CHANGE  `productGroup`  `productGroup` INT( 11 ) NULL DEFAULT NULL COMMENT  'selectBox,nc_groups',
CHANGE  `important`  `important` TINYINT( 1 ) NULL DEFAULT NULL COMMENT  'selectBox,array',
CHANGE  `active`  `active` TINYINT( 1 ) NULL DEFAULT NULL COMMENT  'selectBox,array',
CHANGE  `initDate`  `initDate` DATETIME NULL DEFAULT NULL COMMENT  'dateField',
CHANGE  `endDate`  `endDate` DATE NULL DEFAULT NULL COMMENT  'dateField',
CHANGE  `dateIndef`  `dateIndef` TINYINT( 1 ) NULL DEFAULT NULL COMMENT  'dateField',
CHANGE  `insertDate`  `insertDate` DATETIME NULL DEFAULT NULL COMMENT  'dateField',
CHANGE  `user`  `user` TEXT CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT  'textField,0,false',
CHANGE  `productDescription`  `productDescription` TEXT CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT  'ckeditor',
CHANGE  `manufacturer`  `manufacturer` INT( 11 ) NULL DEFAULT NULL COMMENT  'selectBox,nc_manufacturers',
CHANGE  `visits`  `visits` INT( 11 ) NULL DEFAULT NULL COMMENT  'textField,0,false',
CHANGE  `available`  `available` INT( 11 ) NULL DEFAULT NULL COMMENT  'textField',
CHANGE  `registrado`  `registrado` VARCHAR( 2 ) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT  'selectBox,array',
CHANGE  `unitsAvailable`  `unitsAvailable` INT( 11 ) NULL DEFAULT NULL COMMENT  'textField',
CHANGE  `precio_registrados`  `precio_registrados` DECIMAL( 19, 2 ) NULL DEFAULT NULL COMMENT  'textField',
CHANGE  `dateActualizado`  `dateActualizado` TIMESTAMP NULL DEFAULT NULL COMMENT  'dateField',
CHANGE  `descripcion_corta`  `descripcion_corta` TEXT CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL COMMENT  'textArea',
CHANGE  `terminal`  `terminal` INT( 11 ) NULL COMMENT  'textField,0,false',
CHANGE  `url`  `url` VARCHAR( 50 ) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT  'textField,0,false',
CHANGE  `direccion`  `direccion` VARCHAR( 100 ) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL COMMENT  'textField,0,false',
CHANGE  `tags`  `tags` VARCHAR( 100 ) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL COMMENT  'textField,0,false',
CHANGE  `imagen_logo`  `imagen_logo` VARCHAR( 200 ) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT  'textField,0,false',
CHANGE  `ciudad`  `ciudad` INT( 11 ) NULL DEFAULT NULL COMMENT  'textField,0,false',
CHANGE  `perfil`  `perfil` VARCHAR( 50 ) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT  'textField,0,false',
CHANGE  `registro_completado`  `registro_completado` VARCHAR( 2 ) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT  'textField,0,false',
CHANGE  `patrocinador`  `patrocinador` VARCHAR( 50 ) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT  'textField,0,false',
CHANGE  `url_path`  `url_path` VARCHAR( 100 ) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT  'textField'
;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE  `nc_groups`
CHANGE  `id`  `id` INT( 11 ) NOT NULL AUTO_INCREMENT COMMENT  'textField,0,false',
 CHANGE  `nombre`  `nombre` TEXT CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT  'textField',
 CHANGE  `color`  `color` INT( 11 ) NULL DEFAULT NULL COMMENT  'selectBox,nc_colors',
 CHANGE  `user`  `user` TEXT CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT  'textField,0,false',
 CHANGE  `date`  `date` DATE NULL DEFAULT NULL COMMENT  'dateField',
 CHANGE  `url_path`  `url_path` VARCHAR( 100 ) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT  'textField'

;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE  `nc_groups` DROP  `banner_publicidad` ;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE  `nc_groups` DROP  `terminal` ;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE nc_publicidad COMMENT ' [
   {
                    \"selectBoxArrays\": [
              {
                \"name\": \"tipo\",
                \"data\": {
                    \"home\": \"Home\",
                    \"color\": \"Categoría\",
                    \"categoria\": \"SubCategoría\"
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
ALTER TABLE  `nc_colors`
CHANGE  `id`  `id` INT( 11 ) NOT NULL AUTO_INCREMENT COMMENT  'textField,0,false',
CHANGE  `nombre`  `nombre` TEXT CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT  'textField',
CHANGE  `color`  `color` TEXT CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT  'textField,0,false',
CHANGE  `user`  `user` TEXT CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT  'textField,0,false',
CHANGE  `date`  `date` DATE NULL DEFAULT NULL COMMENT  'dateField',
CHANGE  `pagina`  `pagina` INT( 11 ) NULL DEFAULT NULL COMMENT  'selectBox,paginas',
CHANGE  `url_path`  `url_path` VARCHAR( 100 ) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT  'textField'
;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
ALTER TABLE  `nc_publicidad`
CHANGE  `id`  `id` INT( 11 ) NOT NULL AUTO_INCREMENT COMMENT  'textField,0,false',
CHANGE  `texto`  `texto` TEXT CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL COMMENT  'ckeditor',
CHANGE  `categoria`  `categoria` INT( 11 ) NULL DEFAULT NULL COMMENT  'selectBox,nc_groups',
CHANGE  `pagina`  `pagina` INT( 11 ) NULL DEFAULT NULL COMMENT  'selectBox,paginas',
CHANGE  `fecha`  `fecha` DATE NULL COMMENT  'dateField',
CHANGE  `usuario`  `usuario` VARCHAR( 200 ) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL COMMENT  'textField,0,false',
CHANGE  `tipo`  `tipo` VARCHAR( 30 ) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT  'selectBox,array',
CHANGE  `nombre`  `nombre` VARCHAR( 100 ) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT  'textField',
CHANGE  `url`  `url` VARCHAR( 150 ) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT  'textField',
CHANGE  `visitas`  `visitas` VARCHAR( 20 ) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT  'textField,0,false',
CHANGE  `color`  `color` INT( 11 ) NULL DEFAULT NULL COMMENT  'selectBox,nc_colors'
;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
 ALTER TABLE nc_publicidad COMMENT ' [
   {
                    \"selectBoxArrays\": [
              {
                \"name\": \"tipo\",
                \"data\": {
                    \"categoria\": \"Categoría\",
                    \"color\": \"Color\",
                    \"home\": \"Home\"
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
ALTER TABLE  `nc_manufacturers`
CHANGE  `id`  `id` INT( 11 ) NOT NULL AUTO_INCREMENT COMMENT  'textField,0,false',
CHANGE  `nombre`  `nombre` TEXT CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT  'textField',
CHANGE  `image`  `image` TEXT CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT  'uploader',
CHANGE  `active`  `active` VARCHAR( 2 ) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT  'selectBox,array',
CHANGE  `datetime`  `datetime` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP COMMENT  'dateField',
CHANGE  `user`  `user` TEXT CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT  'textField,0,false'
;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
 ALTER TABLE nc_manufacturers COMMENT '
 [
                {
                    'selectBoxArrays': [
              {
                'name': 'active',
                'data': {
                    'SI': 'SI',
                    'NO': 'NO'
                }
            }
        ],
                    'config': {
                            'cleanHtml': false
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
CREATE TABLE IF NOT EXISTS `nc_manufacturers_asociate` (
  `id` int(11)  NOT NULL AUTO_INCREMENT COMMENT 'textField,0,false',
  `marca` int(11) DEFAULT NULL COMMENT 'selectBox,nc_manufacturers',
  `categoria` varchar(100) DEFAULT NULL COMMENT 'selectBox,nc_colors',
  `grupo` int(11) DEFAULT NULL COMMENT 'selectBox,nc_groups',
  `usuario` varchar(80) DEFAULT NULL COMMENT 'textField,0,false',
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }


        $sql = "
update menu set callback='slotNWUsuarios' where modulo=477;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
update modulos set clase='qxnw.basics.lists.l_usuarios' where nombre='Usuarios del sistema';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE  `nc_baskets` ADD  `imagen` VARCHAR( 100 ) NULL COMMENT  'textField';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE  `nc_baskets` ADD  `productName` VARCHAR( 100 ) NULL COMMENT  'textField';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE  `nc_publicidad` ADD  `color` INT( 11 ) NULL COMMENT  'selectBox,nc_colors';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE  `nc_colors` ADD  `url_path` VARCHAR(100) NULL COMMENT  'textField';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE  `nc_groups` ADD  `url_path` VARCHAR(100) NULL COMMENT  'textField';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE  `nc_products` ADD  `url_path` VARCHAR(100) NULL COMMENT  'textField';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE  `nc_colors` ADD  `banner_publicidad` TEXT NULL COMMENT  'textField';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE  `noticias` ADD  `url_path` VARCHAR(100) NULL COMMENT  'textField';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
CREATE TABLE IF NOT EXISTS `noticias_config` (
  `id` int(11)  NOT NULL AUTO_INCREMENT COMMENT 'textField,0,false',
  `pagina` int(11) DEFAULT NULL COMMENT 'selectBox,paginas',
  `marca_agua` varchar(100) DEFAULT NULL COMMENT 'uploader',
  `registros_pagina` int(11) DEFAULT NULL COMMENT 'textField',
  `fondos` varchar(60) DEFAULT NULL COMMENT 'textField',
  `empresa` int(11) DEFAULT NULL COMMENT 'textField,0,false',
  `usuario` varchar(80) DEFAULT NULL COMMENT 'textField,0,false',
  `fecha` text COMMENT 'dateField',
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE  `productos_config` ADD  `marca_agua` VARCHAR( 70 ) NULL COMMENT  'uploader';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE  `productos_config` ADD  `tamano_por_pagina` VARCHAR(5) NULL COMMENT  'textField';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }


        $sql = "
ALTER TABLE  `imagenes` ADD  `usuario` VARCHAR( 100 ) NULL COMMENT  'textField,0,false';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE  `galeria_noticias_config`
ADD  `usuario` VARCHAR( 80 ) NOT NULL COMMENT  'textField,0,false',
ADD  `fecha` TIMESTAMP NOT NULL COMMENT  'dateField',
ADD  `imagen_mode` VARCHAR( 30 ) NULL COMMENT  'selectBox,array'
;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE  `productos_config` CHANGE  `hoja_contacto`  `hoja_contacto` VARCHAR( 60 ) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT  'selectBox,paginas';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE  `productos_config` ADD  `usar_tabs` VARCHAR( 2 ) NULL COMMENT  'selectBox,array';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE  `productos_imagenes` ADD  `usuario` VARCHAR( 80 ) NOT NULL COMMENT  'textField,0,false';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
CREATE TABLE IF NOT EXISTS `productos_tabs_data` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT COMMENT 'textField,0,false',
  `id_tab` int(11) DEFAULT NULL COMMENT 'textField',
  `id_producto` int(11) DEFAULT NULL COMMENT 'textField',
  `descripcion` TEXT DEFAULT NULL COMMENT 'textArea',
  `usuario` varchar(80) DEFAULT NULL COMMENT 'textField,0,false',
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
CREATE TABLE IF NOT EXISTS `productos_tabs` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT COMMENT 'textField,0,false',
  `nombre` varchar(50) DEFAULT NULL COMMENT 'textField',
  `pagina` int(11) DEFAULT NULL COMMENT 'selectBox,paginas',
  `empresa` int(11) DEFAULT NULL COMMENT 'textField,0,false',
  `usuario` varchar(80) DEFAULT NULL COMMENT 'textField,0,false',
  `fecha` text COMMENT 'dateField',
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE  `galeria_noticias`
ADD  `usuario` VARCHAR( 80 ) NULL COMMENT  'textField,0,false',
ADD  `fecha` TIMESTAMP NOT NULL COMMENT  'dateField',
ADD  `orden` INT( 11 ) NULL COMMENT  'textField';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE  `productos` ADD  `subsubgrupo` INT NULL COMMENT  'selectBox,productos_grupos';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
            ALTER TABLE `productos` ADD `descripcion_articulo_home` TEXT NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE  `productos`
CHANGE  `id`  `id` INT( 11 ) NOT NULL AUTO_INCREMENT COMMENT  'textField,0,false',
CHANGE  `grupo`  `grupo` INT( 11 ) NULL DEFAULT NULL COMMENT  'selectBox,productos_grupos',
CHANGE  `nombre`  `nombre` VARCHAR( 100 ) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT 'textField',
CHANGE  `descripcion`  `descripcion` TEXT CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT 'ckeditor',
CHANGE  `referencia`  `referencia` VARCHAR( 10000 ) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT  'textField',
CHANGE  `imagen`  `imagen` VARCHAR( 100 ) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT 'uploader',
CHANGE  `usuario`  `usuario` VARCHAR( 100 ) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT 'textField,0,false',
CHANGE  `fecha`  `fecha` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP COMMENT  'textField,0,false',
CHANGE  `pagina`  `pagina` INT( 11 ) NULL DEFAULT NULL COMMENT  'selectBox,paginas',
CHANGE  `idioma`  `idioma` INT( 11 ) NULL DEFAULT NULL COMMENT  'selectBox,idiomas',
CHANGE  `visitas`  `visitas` INT( 11 ) NULL DEFAULT NULL COMMENT  'textField,0,false',
CHANGE  `orden`  `orden` INT( 10 ) NULL DEFAULT NULL COMMENT  'textField',
CHANGE  `tipo`  `tipo` VARCHAR( 50 ) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT  'selectBox'
;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE  `categorias`
CHANGE  `categoria`  `nombre` VARCHAR( 40 ) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT  'textField'
;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE  `categorias`
CHANGE  `id`  `id` INT( 11 ) NOT NULL AUTO_INCREMENT COMMENT  'textField,0,false',
CHANGE  `nombre`  `nombre` VARCHAR( 40 ) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT  'textField',
CHANGE  `descripcion`  `descripcion` VARCHAR( 100 ) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT  'textArea',
CHANGE  `pagina`  `pagina` INT( 10 ) NULL DEFAULT NULL COMMENT  'selectBox,paginas'
;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE  `categorias_noticias` CHANGE  `texto`  `nombre` TEXT CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL COMMENT  'textField';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE  `categorias_noticias`
CHANGE  `nombre`  `nombre` TEXT CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL COMMENT  'textField',
CHANGE  `id`  `id` INT( 11 ) NOT NULL AUTO_INCREMENT COMMENT  'textField,0,false';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE  `noticias`
CHANGE  `id`  `id` INT( 11 ) NOT NULL AUTO_INCREMENT COMMENT  'textField,0,false',
CHANGE  `autor`  `autor` TEXT CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT  'textField',
CHANGE  `titulo`  `titulo` TEXT CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL COMMENT  'textField',
CHANGE  `categoria`  `categoria` TEXT CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT  'selectBox,categorias',
CHANGE  `noticia`  `noticia` TEXT CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL COMMENT  'ckeditor',
CHANGE  `imagen`  `imagen` TEXT CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT  'uploader',
CHANGE  `fecha`  `fecha` DATE NOT NULL COMMENT  'dateField',
CHANGE  `time`  `time` TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT  'textField,0,false',
CHANGE  `pagina`  `pagina` INT( 11 ) NOT NULL COMMENT  'selectBox,paginas',
CHANGE  `idioma`  `idioma` INT( 11 ) NULL DEFAULT NULL COMMENT  'selectBox,idiomas',
CHANGE  `ciudad`  `ciudad` TEXT CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT  'selectBox,ciudades',
CHANGE  `comentarios`  `comentarios` TEXT CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT  'textField,0,false',
CHANGE  `usuario`  `usuario` VARCHAR( 150 ) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT  'textField,0,false',
CHANGE  `empresa`  `empresa` INT( 11 ) NULL DEFAULT NULL COMMENT  'textField,0,false',
CHANGE  `destacado`  `destacado` VARCHAR( 10 ) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT  'selectBox,array'
;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
CREATE TABLE IF NOT EXISTS `nwpconfig` (
    `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'textField,0,false',
  `usar_cargando` varchar(2) DEFAULT NULL COMMENT 'selectBox,array',
  `usar_nwsites` varchar(100) DEFAULT NULL COMMENT 'selectBox,array',
  `hoja_nwsites` int( 11 ) DEFAULT NULL COMMENT 'selectBox,paginas',
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE  `nwpconfig` ADD  `hojaurl_nwsites` VARCHAR( 80 ) NOT NULL;
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
 ALTER TABLE contacto_body COMMENT '[
    {
        \"selectBoxArrays\": [
              {
                \"name\": \"activo\",
                \"data\": {
                    \"SI\": \"SI\",
                    \"NO\": \"NO\"
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
        $sql = "
 ALTER TABLE noticias COMMENT '
 [
                {
                    \"selectBoxArrays\": [
              {
                \"name\": \"destacado\",
                \"data\": {
                    \"SI\": \"SI\",
                    \"NO\": \"NO\"
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
ALTER TABLE  `menuprincipal`
CHANGE  `texto`  `nombre` TEXT CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL COMMENT  'textField'
;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE  `menuprincipal`
CHANGE  `id`  `id` INT( 11 ) NOT NULL AUTO_INCREMENT COMMENT  'textField,0,false',
CHANGE  `nombre`  `nombre` TEXT CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL COMMENT  'textField',
CHANGE  `pertenece`  `pertenece` INT( 11 ) NULL DEFAULT NULL COMMENT  'selectBox,menuprincipal',
CHANGE  `link`  `link` TEXT CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT  'selectBox,paginas',
CHANGE  `idioma`  `idioma` INT( 11 ) NULL DEFAULT NULL COMMENT  'selectBox,idiomas',
CHANGE  `pagina`  `pagina` INT( 11 ) NULL DEFAULT NULL COMMENT  'selectBox,paginas',
CHANGE  `mostrar`  `mostrar` TEXT CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT  'selectBox,array',
CHANGE  `nivel`  `nivel` INT( 11 ) NOT NULL COMMENT  'selectBox,array',
CHANGE  `imagen`  `imagen` VARCHAR( 200 ) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT  'uploader',
CHANGE  `orden`  `orden` INT( 3 ) NULL DEFAULT NULL COMMENT  'selectBox,array',
CHANGE  `tipo_link`  `tipo_link` VARCHAR( 20 ) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT  'selectBox,array',
CHANGE  `privado`  `privado` VARCHAR( 2 ) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT  'selectBox,array'
;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE  `menuprincipal_opciones`
CHANGE  `id`  `id` INT( 11 ) NOT NULL AUTO_INCREMENT COMMENT  'textField,0,false',
CHANGE  `texto`  `texto` LONGTEXT CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT  'ckeditor',
CHANGE  `modulo`  `modulo` INT( 11 ) NULL DEFAULT NULL COMMENT  'selectBox,nwp_modulos',
CHANGE  `fondo`  `fondo` VARCHAR( 50 ) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT  'colorButton',
CHANGE  `fondo_centro`  `fondo_centro` VARCHAR( 50 ) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT  'colorButton',
CHANGE  `fondo_links`  `fondo_links` VARCHAR( 50 ) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT  'colorButton',
CHANGE  `color_links`  `color_links` VARCHAR( 50 ) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT  'colorButton',
CHANGE  `color_hover_fondo`  `color_hover_fondo` VARCHAR( 50 ) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT  'colorButton',
CHANGE  `color_hover_links`  `color_hover_links` VARCHAR( 50 ) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT  'colorButton',
CHANGE  `ancho_links`  `ancho_links` VARCHAR( 50 ) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT  'textField',
CHANGE  `separacion_links`  `separacion_links` VARCHAR( 50 ) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT  'textField',
CHANGE  `borde_links`  `borde_links` VARCHAR( 50 ) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT  'textField',
CHANGE  `ancho_centro`  `ancho_centro` VARCHAR( 10 ) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT  'textField',
CHANGE  `animation_submenus`  `animation_submenus` VARCHAR( 10 ) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT  'selectBox',
CHANGE  `animation_hover`  `animation_hover` VARCHAR( 10 ) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT  'selectBox',
CHANGE  `radius_buttons`  `radius_buttons` VARCHAR( 10 ) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT  'textField',
CHANGE  `tipo_submenu`  `tipo_submenu` VARCHAR( 50 ) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT  'selectBox',
CHANGE  `fondo_submenu`  `fondo_submenu` VARCHAR( 50 ) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT  'colorButton',
CHANGE  `active_link`  `active_link` VARCHAR( 50 ) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT  'colorButton',
CHANGE  `active_link_color_font`  `active_link_color_font` VARCHAR( 50 ) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT  'colorButton',
CHANGE  `color_font_submenu`  `color_font_submenu` VARCHAR( 50 ) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT  'colorButton',
CHANGE  `tipo_menu`  `tipo_menu` VARCHAR( 50 ) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT  'selectBox'
;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
ALTER TABLE  `nwp_modulos`
CHANGE  `id`  `id` INT( 11 ) NOT NULL AUTO_INCREMENT COMMENT  'textField,0,false',
CHANGE  `nombre`  `nombre` TEXT CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL COMMENT  'textField',
CHANGE  `idioma`  `idioma` INT( 11 ) NULL DEFAULT NULL COMMENT  'selectBox,idiomas',
CHANGE  `descripcion`  `descripcion` TEXT CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT  'textArea',
CHANGE  `links`  `links` TEXT CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT  'textArea',
CHANGE  `css`  `css` TEXT CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT  'textArea',
CHANGE  `fecha`  `fecha` DATE NULL DEFAULT NULL COMMENT  'dateField',
CHANGE  `usuario`  `usuario` VARCHAR( 60 ) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT  'textField,0,false',
CHANGE  `tipo`  `tipo` VARCHAR( 50 ) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT  'selectBox',
CHANGE  `grupo`  `grupo` INT( 11 ) NULL DEFAULT NULL COMMENT  'selectBox'
;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE  `paginas`
CHANGE  `id`  `id` INT( 11 ) NOT NULL AUTO_INCREMENT COMMENT  'textField,0,false',
CHANGE  `nombre`  `nombre` TEXT CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL COMMENT  'textField',
CHANGE  `fecha_ingreso`  `fecha_ingreso` TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL DEFAULT  'dateField',
CHANGE  `idioma`  `idioma` INT( 11 ) NULL DEFAULT NULL COMMENT  'selectBox,idiomas',
CHANGE  `titulo`  `titulo` TEXT CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL COMMENT  'textField',
CHANGE  `descripcion`  `descripcion` TEXT CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL COMMENT  'textArea',
CHANGE  `palabras_clave`  `palabras_clave` TEXT CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL COMMENT  'textArea',
CHANGE  `lenguaje`  `lenguaje` TEXT CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT  'selectBox,idiomas'
;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE  `restringidas`
CHANGE  `id`  `id` INT( 11 ) NOT NULL AUTO_INCREMENT COMMENT  'textField,0,false',
CHANGE  `pagina`  `pagina` INT( 11 ) NOT NULL COMMENT  'selectBox,paginas',
CHANGE  `redireccion`  `redireccion` INT( 11 ) NOT NULL COMMENT  'selectBox,paginas',
CHANGE  `direfencia`  `direfencia` VARCHAR( 20 ) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT  'textField',
CHANGE  `argumento`  `argumento` VARCHAR( 200 ) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT  'textField'
;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE  `google`
CHANGE  `id`  `id` INT( 11 ) NOT NULL DEFAULT  '0' COMMENT  'textField,0,false',
CHANGE  `texto`  `texto` TEXT CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT  'textArea'
;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE  `yahoo`
CHANGE  `id`  `id` INT( 11 ) NOT NULL DEFAULT  '0' COMMENT  'textField,0,false',
CHANGE  `texto`  `texto` TEXT CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT  'textField';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE  `bing`
CHANGE  `id`  `id` INT( 11 ) NOT NULL DEFAULT  '0' COMMENT  'textField,0,false',
CHANGE  `texto`  `texto` TEXT CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT  'textArea';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE  `quantcast`
CHANGE  `id`  `id` INT( 11 ) NOT NULL AUTO_INCREMENT COMMENT  'textField,0,false',
CHANGE  `texto`  `texto` TEXT CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT  'textField';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE  `analythics`
CHANGE  `id`  `id` INT( 11 ) NOT NULL AUTO_INCREMENT COMMENT  'textField,0,false',
CHANGE  `texto`  `texto` TEXT CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL COMMENT  'textField';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE  `sitemaps`
CHANGE  `id`  `id` INT( 11 ) NOT NULL AUTO_INCREMENT COMMENT  'textField,0,false',
CHANGE  `texto`  `texto` TEXT CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT  'textField',
CHANGE  `fecha`  `fecha` DATE NULL DEFAULT NULL COMMENT  'dateField',
CHANGE  `enviadas`  `enviadas` INT( 11 ) NULL DEFAULT NULL COMMENT  'textArea'
;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE  `dublin_core`
CHANGE  `id`  `id` INT( 11 ) NOT NULL AUTO_INCREMENT COMMENT  'textField,0,false',
CHANGE  `texto`  `texto` TEXT CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT  'textField';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE  `geo`
CHANGE  `id`  `id` INT( 11 ) NOT NULL AUTO_INCREMENT COMMENT  'textField,0,false',
CHANGE  `latitud`  `latitud` TEXT CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT  'textField',
CHANGE  `longitud`  `longitud` TEXT CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT  'textField',
CHANGE  `country`  `country` TEXT CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT  'textField',
CHANGE  `placename`  `placename` TEXT CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT  'textField',
CHANGE  `region`  `region` TEXT CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT  'textField'
;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE  `canonical`
CHANGE  `id`  `id` INT( 11 ) NOT NULL AUTO_INCREMENT COMMENT  'textField,0,false',
CHANGE  `texto`  `texto` TEXT CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT  'textField';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE  `seo_facebook`
CHANGE  `id`  `id` INT( 11 ) NOT NULL AUTO_INCREMENT COMMENT  'textField,0,false',
CHANGE  `texto`  `texto` TEXT CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT  'textField',
CHANGE  `imagen`  `imagen` TEXT CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT  'uploader';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
ALTER TABLE  `correos`
CHANGE  `id`  `id` INT( 11 ) NOT NULL AUTO_INCREMENT COMMENT  'textField,0,false',
CHANGE  `correo`  `correo` TEXT CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL COMMENT  'textField',
CHANGE  `usuario`  `usuario` TEXT CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL COMMENT  'textField,0,false',
CHANGE  `departamento`  `departamento` INT( 11 ) NULL DEFAULT NULL COMMENT  'selectBox,departamentos'
;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE  `contacto_body`
CHANGE  `id`  `id` INT( 11 ) NOT NULL AUTO_INCREMENT COMMENT  'textField,0,false',
CHANGE  `departamento`  `departamento` VARCHAR( 2 ) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL COMMENT  'selectBox,departamentos',
CHANGE  `cuerpo_mensaje`  `cuerpo_mensaje` TEXT CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT  'ckeditor',
CHANGE  `activo`  `activo` VARCHAR( 2 ) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL COMMENT  'selectBox'
;
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
ALTER TABLE  `paginas` ADD  `terminal` INT NOT NULL COMMENT  'selectBox,terminales';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
ALTER TABLE  `galeria_noticias`
CHANGE  `id`  `id` INT( 11 ) NOT NULL AUTO_INCREMENT COMMENT  'textField,0,false',
CHANGE  `contenido`  `contenido` TEXT CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT 'ckeditor',
CHANGE  `imagen`  `imagen` TEXT CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT 'uploader',
CHANGE  `otro`  `otro` TEXT CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT  'textField',
CHANGE  `pagina`  `pagina` TEXT CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT 'selectBox,paginas',
CHANGE  `tipo`  `tipo` INT( 11 ) NULL DEFAULT NULL COMMENT  'textField',
CHANGE  `otro_dos`  `otro_dos` VARCHAR( 100 ) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT  'textField'
;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE  `galeria_noticias_config`
CHANGE  `id`  `id` INT( 11 ) NOT NULL AUTO_INCREMENT COMMENT  'textField,0,false',
CHANGE  `pagina`  `pagina` INT( 11 ) NOT NULL COMMENT  'selectBox,paginas',
CHANGE  `autoslide`  `autoslide` VARCHAR( 2 ) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT 'selectBox,array',
CHANGE  `animation`  `animation` VARCHAR( 50 ) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT  'selectBox,array',
CHANGE  `showbar`  `showbar` VARCHAR( 2 ) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT 'selectBox,array',
CHANGE  `pagination`  `pagination` VARCHAR( 2 ) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT  'selectBox,array',
CHANGE  `thumbnails`  `thumbnails` VARCHAR( 2 ) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT  'selectBox,array',
CHANGE  `height`  `height` VARCHAR( 20 ) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT 'textField',
CHANGE  `speed`  `speed` VARCHAR( 20 ) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT 'textField',
CHANGE  `easing`  `easing` VARCHAR( 20 ) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT 'selectBox,array',
CHANGE  `show_play_stop`  `show_play_stop` VARCHAR( 10 ) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT  'selectBox,array',
CHANGE  `tipo`  `tipo` VARCHAR( 5 ) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT  'textField',
CHANGE  `show_descripcion`  `show_descripcion` VARCHAR( 2 ) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT  'selectBox,array',
CHANGE  `position_description`  `position_description` VARCHAR( 40 ) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT  'selectBox,array',
CHANGE  `fondo_descripcion`  `fondo_descripcion` VARCHAR( 50 ) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT  'textField',
CHANGE  `tipo_thumbs_textos`  `tipo_thumbs_textos` VARCHAR( 50 ) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT  'selectBox,array',
CHANGE  `overlay`  `overlay` VARCHAR( 2 ) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT 'selectBox,array',
CHANGE  `mostrar_flechas`  `mostrar_flechas` VARCHAR( 2 ) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT  'selectBox,array',
CHANGE  `width`  `width` VARCHAR( 10 ) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT 'textField',
CHANGE  `html`  `html` VARCHAR( 2 ) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT 'selectBox,array'
;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE galeria_noticias_config COMMENT '[
    {
        \"selectBoxArrays\": [
              {
                \"name\": \"autoslide\",
                \"data\": {
                    \"si\": \"SI\",
                    \"no\": \"NO\"
                }
            },
            {
                \"name\": \"animation\",
                \"data\": {
                    \"normal\": \"Normal\"
                }
            },
             {
                \"name\": \"showbar\",
                \"data\": {
                    \"si\": \"SI\",
                    \"no\": \"NO\"
                }
            },
             {
                \"name\": \"pagination\",
                \"data\": {
                    \"si\": \"SI\",
                    \"no\": \"NO\"
                }
            },
             {
                \"name\": \"thumbnails\",
                \"data\": {
                    \"si\": \"SI\",
                    \"no\": \"NO\"
                }
            },
             {
                \"name\": \"easing\",
                \"data\": {
                    \"easing\": \"Easing\",
                    \"slide\": \"Slide Horizontal\",
                    \"slide_v\": \"Slide Vertical\",
                    \"slide_vd\": \"Slide Vertical Dos\",
                    \"slide_elastic\": \"Slide Elastic\"
                }
            },
              {
                \"name\": \"show_play_stop\",
                \"data\": {
                    \"si\": \"SI\",
                    \"no\": \"NO\"
                }
            },
              {
                \"name\": \"show_descripcion\",
                \"data\": {
                    \"si\": \"SI\",
                    \"no\": \"NO\"
                }
            },
              {
                \"name\": \"position_description\",
                \"data\": {
                    \"top\": \"Arriba\",
                    \"bottom\": \"Abajo\",
                    \"center\": \"Centro\"
                }
            },
              {
                \"name\": \"tipo_thumbs_textos\",
                \"data\": {
                    \"down_h\": \"Abajo_H\",
                    \"down_h_fuera\": \"Abajo_H_fuera \",
                    \"down_uno\": \"De_a_Uno\",
                     \"bloques_img\": \"Bloques_IMG\"
                }
            },
              {
                \"name\": \"overlay\",
                \"data\": {
                    \"si\": \"SI\",
                    \"no\": \"NO\"
                }
            },
              {
                \"name\": \"mostrar_flechas\",
                \"data\": {
                    \"si\": \"SI\",
                    \"no\": \"NO\"
                }
            },
              {
                \"name\": \"html\",
                \"data\": {
                    \"si\": \"SI\",
                    \"no\": \"NO\"
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
        $sql = "
ALTER TABLE  `menuprincipal` CHANGE  `mostrar`  `mostrar` VARCHAR( 2 ) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT  'selectBox,array';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
 ALTER TABLE menuprincipal COMMENT '[
    {
        \"selectBoxArrays\": [
              {
                \"name\": \"mostrar\",
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
            },
            {
                \"name\": \"orden\",
                \"data\": {
                    \"1\": \"1\",
                    \"2\": \"2\",
                    \"3\": \"3\",
                    \"4\": \"4\",
                    \"5\": \"5\",
                    \"6\": \"6\",
                    \"7\": \"7\",
                    \"8\": \"8\",
                    \"9\": \"9\",
                    \"10\": \"10\",
                    \"11\": \"11\",
                    \"12\": \"12\",
                    \"13\": \"13\",
                    \"14\": \"14\",
                    \"15\": \"15\"
                }
            },
             {
                \"name\": \"tipo_link\",
                \"data\": {
                    \"pagina\": \"Página Interna\",
                    \"link\": \"Link absoluto\"
                }
            },
             {
                \"name\": \"privado\",
                \"data\": {
                    \"NO\": \"NO\",
                    \"SI\": \"SI\"
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
        $sql = "
CREATE TABLE IF NOT EXISTS `nw_fuentes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(60) NOT NULL,
  `usuario` varchar(60) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
INSERT INTO `usuarios` (`id`, `nombre`, `usuario`, `clave`, `terminal`, `email`, `perfil`, `cookie`, `cambio_prox`, `conectado`, `estado`, `empresa`, `cliente`, `celular`, `cargo`, `documento`, `apellido`, `foto`, `area`, `fecha_nacimiento`, `cambio_clave`, `ciudad`, `bodega`, `pais`, `firma`) VALUES
  (32,'Alexander Flórez','alexf','4fdc67cd9ae8581927afd444aadb697f',NULL,'alexf@netwoods.net',1,6881540,0,'SI','activo',1,0,'3125729272','Netwoods',1019029476, 'Flórez','/imagenes/TWEBBw9p.jpg',6,'1988-12-23',1,3160,8,NULL,NULL);
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
INSERT INTO `usuarios` (`id`, `nombre`, `usuario`, `clave`, `terminal`, `email`, `perfil`, `cookie`, `cambio_prox`, `conectado`, `estado`, `empresa`, `cliente`, `celular`, `cargo`, `documento`, `apellido`, `foto`, `area`, `fecha_nacimiento`, `cambio_clave`, `ciudad`, `bodega`, `pais`, `firma`) VALUES
  (33,'Diego Sánchez','diegos','c7c3887a34d647636077b9342279bde9',NULL,'diegos@netwoods.net',1,6881540,0,'SI','activo',1,0,'3125729272','Netwoods',1019029476, 'Sanchez','/imagenes/TWEBBw9p.jpg',6,'1988-12-23',1,3160,8,NULL,NULL);
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
INSERT INTO `usuarios` (`id`, `nombre`, `usuario`, `clave`, `terminal`, `email`, `perfil`, `cookie`, `cambio_prox`, `conectado`, `estado`, `empresa`, `cliente`, `celular`, `cargo`, `documento`, `apellido`, `foto`, `area`, `fecha_nacimiento`, `cambio_clave`, `ciudad`, `bodega`, `pais`, `firma`) VALUES
  (34,'Admin','admin','03c173d988d62ba8a242267a91796f1b',NULL,'diegos@netwoods.net',1,6881540,0,'SI','activo',1,0,'3125729272','Cliente',1019029476, 'Cliente','/imagenes/TWEBBw9p.jpg',6,'1988-12-23',1,3160,8,NULL,NULL);
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
INSERT INTO `usuarios_empresas` (`id`, `usuario`, `empresa`)
VALUES
  (2,'alexf',1),
  (3,'diegos',1),
  (4,'admin',1)
;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
CREATE TABLE IF NOT EXISTS nc_maps_enc (
    id int(11) NOT NULL AUTO_INCREMENT COMMENT 'textField,0,false',
    nombre varchar(100) DEFAULT NULL COMMENT 'textField',
    descripcion text DEFAULT NULL COMMENT 'textArea',
    terminal  int(11) DEFAULT NULL COMMENT 'textField,0,false',
    imagen varchar(100) DEFAULT NULL COMMENT 'textField',
    fecha date COMMENT 'dateField',
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
CREATE TABLE IF NOT EXISTS nc_maps_config (
    id int(11) NOT NULL AUTO_INCREMENT COMMENT 'textField,0,false',
  `fecha` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'textField,0,false',
    nombre varchar(100) DEFAULT NULL COMMENT 'textField',
    imagen varchar(100) DEFAULT NULL COMMENT 'textField',
    piso varchar(100) DEFAULT NULL COMMENT 'textField',
    terminal int(11) DEFAULT NULL COMMENT 'textField,0,false',
    id_map_enc int(11) DEFAULT NULL COMMENT 'textField',
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
CREATE TABLE IF NOT EXISTS nc_maps_local (
    id int(11) NOT NULL AUTO_INCREMENT COMMENT 'textField,0,false',
    id_local int(11) DEFAULT NULL COMMENT 'textField',
    pos_x int(11) DEFAULT NULL COMMENT 'textField',
    pos_y int(11) DEFAULT NULL COMMENT 'textField',
    id_imagen int(11) DEFAULT NULL COMMENT 'textField',
    tipo_url int(11) DEFAULT NULL COMMENT 'textField',
    terminal int(11) DEFAULT NULL COMMENT 'textField,0,false',
    id_map_enc int(11) DEFAULT NULL COMMENT 'textField',
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
CREATE TABLE IF NOT EXISTS nc_maps_visitas_virtuales (
    id int(11) NOT NULL AUTO_INCREMENT COMMENT 'textField,0,false',
    nombre varchar(100) DEFAULT NULL COMMENT 'textField',
    id_local int(11) DEFAULT NULL COMMENT 'textField',
    imagen_pano varchar(150) DEFAULT NULL COMMENT 'uploader',
    usuario varchar(70) DEFAULT NULL COMMENT 'textField,0,false',
    empresa int(11) DEFAULT NULL COMMENT 'textField,0,false',
    terminal int(11) DEFAULT NULL COMMENT 'textField,0,false',
    id_map_enc int(11) DEFAULT NULL COMMENT 'selectBox,nw_maps_enc',
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE  `nc_groups` ADD  `icono` VARCHAR( 100 ) NULL COMMENT  'uploader';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE  `nc_products` ADD  `id_map_enc` INT NULL COMMENT  'textField';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE  `pv_salidas` ADD  `aptocasa` VARCHAR( 60 ) NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE  `productos` ADD  `destacado` VARCHAR( 2 ) NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE  `nwanimate_objects_animation`
ADD  `rotacion` VARCHAR( 10 ) NULL,
ADD  `perspectiveX` VARCHAR( 10 ) NULL,
ADD  `perspectiveY` VARCHAR( 10 ) NULL ;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE  `nwanimate_objetos`
ADD  `perspectiveX` VARCHAR( 10 ) NULL,
ADD  `perspectiveY` VARCHAR( 10 ) NULL ;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
CREATE TABLE IF NOT EXISTS `nwcalendar_eventos` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'textField,0,false',
  `fecha_evento` date NOT NULL NOT NULL COMMENT 'dateField',
  `fecha` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'textField,0,false',
  `descripcion` TEXT DEFAULT NULL COMMENT 'ckeditor',
  `usuario` varchar(60) DEFAULT NULL COMMENT 'textField,0,false',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
 ALTER TABLE nwcalendar_eventos COMMENT ' [
   {
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
ALTER TABLE  `galeria_noticias` ADD  `publicado` VARCHAR( 2 ) NULL DEFAULT  'SI' COMMENT  'selectBox,array';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE  `galeria_noticias` CHANGE  `publicado`  `publicado` VARCHAR( 2 ) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT  'SI' COMMENT  'selectBox,array';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
CREATE TABLE IF NOT EXISTS `articles_config` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'textField,0,false',
  `pagina` int(11) NOT NULL COMMENT 'selectBox,paginas',
  `posicion` varchar(20) DEFAULT NULL COMMENT 'selectBox,array',
  `html_article` varchar(2) DEFAULT NULL COMMENT 'selectBox,array',
  `max_caracteres` varchar(2) DEFAULT NULL COMMENT 'textField',
  `tamano_img` varchar(5) DEFAULT NULL COMMENT 'textField',
  `bt_read_more` varchar(20) DEFAULT NULL COMMENT 'selectBox,array',
  `padding_article` varchar(5) DEFAULT NULL COMMENT 'textField',
  `max_registros` varchar(2) DEFAULT NULL COMMENT 'textField',
  `filas` varchar(2) DEFAULT NULL COMMENT 'textField',
  `columnas` varchar(2) DEFAULT NULL COMMENT 'textField',
  `animation` varchar(30) DEFAULT NULL COMMENT 'selectBox,array',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE  `articles_config`
ADD  `fecha` TIMESTAMP NULL COMMENT  'dateField',
ADD  `usuario` VARCHAR( 80 ) NULL COMMENT  'textField,0,false',
ADD  `vel_slider` VARCHAR( 20 ) NULL COMMENT  'textField',
ADD  `info_pagina` INT NULL COMMENT  'selectBox,paginas';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE  `articles_config` CHANGE  `max_caracteres`  `max_caracteres` VARCHAR( 5 ) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT 'textField';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE  `nc_config`
ADD  `mostrar_submenu_active` VARCHAR( 2 ) NULL COMMENT  'selectBox,array',
ADD  `mostrar_submenu_active_principal` VARCHAR( 2 ) NULL COMMENT  'selectBox,array';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE  `nc_products` CHANGE  `productID`  `id` INT( 11 ) NOT NULL AUTO_INCREMENT COMMENT  'textField,0,false';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE  `nc_baskets` CHANGE  `basketID`  `id` INT( 11 ) NOT NULL AUTO_INCREMENT COMMENT  'textField,0,false';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
 ALTER TABLE pv_horarios_tiendas_grupos COMMENT '
[
                {
                    \"navTables\": [
                        {
                            \"title\": \"Configuración Horarios Tiendas\",
                            \"table\": \"pv_horarios_tiendas_horas\",
                            \"name\": \"configuracion\",
                            \"reference\": \"id_grupo\"
                        },
                         {
                            \"title\": \"Configuración Horarios\",
                            \"table\": \"pv_horarios_tiendas\",
                            \"name\": \"horarios\",
                            \"reference\": \"grupo\"
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
ALTER TABLE  `pv_productos_relacionados`
ADD  `orden` INT NULL COMMENT  'textField',
ADD  `descripcion` TEXT NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE  `pv_productos_opciones`
ADD  `requerido` VARCHAR( 2 ) NULL,
ADD  `descripcion` TEXT NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE  `pv_productos` ENGINE = MYISAM ;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE pv_productos ADD FULLTEXT(nombre,descripcion);
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE  `pv_empresas_clientes` ENGINE = MYISAM ;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE pv_empresas_clientes ADD FULLTEXT(nombre,observaciones,tags,url);
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE  `pv_salidas_det` ADD  `product` INT NOT NULL COMMENT  'selectBox,pv_productos';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE  `pv_salidas_det`
CHANGE  `id`  `id` INT( 11 ) NOT NULL AUTO_INCREMENT COMMENT  'textField,0,false',
CHANGE  `salida`  `salida` INT( 11 ) NULL DEFAULT NULL COMMENT  'textField,0,false',
CHANGE  `fecha`  `fecha` TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT  'dateField',
CHANGE  `producto`  `producto` INT( 11 ) NULL DEFAULT NULL COMMENT  'textField,0,false',
CHANGE  `label`  `label` TEXT CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT  'textField,0,false',
CHANGE  `valor`  `valor` FLOAT NULL DEFAULT NULL COMMENT  'textField',
CHANGE  `usuario`  `usuario` VARCHAR( 80 ) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT  'textField,0,false',
CHANGE  `unidades`  `unidades` INT( 11 ) NULL DEFAULT NULL COMMENT  'textField',
CHANGE  `observaciones`  `observaciones` TEXT CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT  'textField,0,false',
CHANGE  `adicionales`  `adicionales` TEXT CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT  'textField,0,false',
CHANGE  `session`  `session` VARCHAR( 100 ) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT  'textField,0,false',
CHANGE  `nombre_producto`  `nombre_producto` VARCHAR( 150 ) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT  'textField,0,false',
CHANGE  `descripcion_producto`  `descripcion_producto` TEXT CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT  'textField',
CHANGE  `imagen_producto`  `imagen_producto` TEXT CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT  'uploader',
CHANGE  `empresa_cliente`  `empresa_cliente` INT( 11 ) NULL DEFAULT NULL COMMENT  'textField,0,false'
;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
INSERT INTO `permisos` (`perfil`, `modulo`, `usuario`, `fecha`, `crear`, `consultar`, `editar`, `eliminar`, `todos`, `terminal`, `imprimir`, `enviar_correo`, `exportar`, `importar`, `columnas_ocultas`, `pariente`) VALUES
  (1,5,'andresf','2015-05-29',1,1,1,1,0,1,1,1,1,1,0,NULL);
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE  `galeria_noticias` ADD  `video` VARCHAR( 2 ) NULL DEFAULT  'NO' COMMENT  'selectBox,array';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
ALTER TABLE  `nwp_modulos` ADD  `html` TEXT NULL COMMENT  'ckeditor';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
 ALTER TABLE nwp_modulos COMMENT ' [
   {
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
UPDATE  `menu` SET  `callback` =  'slotNwCommerceProductos' WHERE  `menu`.`id` =359 or nombre='Productos';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE  `nc_products` DROP  `asociate` ;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE  `nc_products` DROP  `available` ;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE  `nc_products` DROP  `dateIndef` ;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE  `nc_products` DROP  `registrado` ;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE  `nc_products` DROP  `precio_registrados` ;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE  `nc_products` DROP  `dateActualizado` ;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }



        $sql = "
ALTER TABLE  `nc_groups` ADD  `activo` VARCHAR( 2 ) NULL DEFAULT  'SI' COMMENT  'selectBox,array';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
 ALTER TABLE nc_groups COMMENT ' [
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
ALTER TABLE  `nc_colors` ADD  `activo` VARCHAR( 2 ) NULL DEFAULT  'SI' COMMENT  'selectBox,array';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
 ALTER TABLE nc_colors COMMENT ' [
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
 ALTER TABLE nc_manufacturers COMMENT ' [
   {
                    \"selectBoxArrays\": [
              {
                \"name\": \"active\",
                \"data\": {
                    \"SI\": \"SI\",
                    \"NO\": \"NO\"
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
CREATE TABLE IF NOT EXISTS `contacto_config` (
  `id` int(11)  NOT NULL AUTO_INCREMENT COMMENT 'textField,0,false',
  `captcha` varchar(2) DEFAULT NULL COMMENT 'selectBox,array',
  `politicas` varchar(2) DEFAULT NULL COMMENT 'selectBox,array',
  `politicas_url` varchar(200) DEFAULT NULL COMMENT 'textField',
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
 ALTER TABLE contacto_config COMMENT ' [
   {
                    \"selectBoxArrays\": [
              {
                \"name\": \"captcha\",
                \"data\": {
                    \"SI\": \"SI\",
                    \"NO\": \"NO\"
                }
            },
              {
                \"name\": \"politicas\",
                \"data\": {
                    \"SI\": \"SI\",
                    \"NO\": \"NO\"
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
INSERT INTO  `menu` (
`id` ,
`nombre` ,
`orden` ,
`nivel` ,
`callback` ,
`pariente` ,
`icono` ,
`modulo` ,
`empresa`
)
VALUES (
'450',  'Configurar Contacto',  '8',  '1',  :callback,  '0', NULL ,  '481',  '1'
);
  ";
        $ca->prepare($sql);
        $ca->bindValue(":callback", "createMaster:master,contacto_config,Configurar Contacto,true");
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE  `nc_products`
ADD  `variantes` VARCHAR( 2 ) NULL COMMENT  'selectBox,array';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
CREATE TABLE IF NOT EXISTS `nc_products_variantes` (
  `id` int(11)  NOT NULL AUTO_INCREMENT COMMENT 'textField,0,false',
  `nombre` varchar(80) DEFAULT NULL COMMENT 'textField',
  `tipo` varchar(20) DEFAULT NULL COMMENT 'selectBox,array',
  `id_producto` varchar(2) DEFAULT NULL COMMENT 'textField',
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE  `productos_config` ADD  `menu_modo` VARCHAR( 11 ) NULL COMMENT  'selectBox,array'
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE  `nc_products`
ADD  `titulo_adjunto` VARCHAR( 60 ) NULL COMMENT  'textField',
ADD  `adjunto` VARCHAR( 150 ) NULL COMMENT  'uploader';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = " update menu set callback='slotSitemaps' where id=303";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = " ALTER TABLE  `productos_imagenes` ADD  `nombre` VARCHAR( 100 ) NULL COMMENT  'textField';";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }


        $sql = "
ALTER TABLE  `productos_config` ADD  `otras_fotos` VARCHAR(2) NULL COMMENT  'selectBox,array';     
";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE  `nc_products` CHANGE  `active`  `active` VARCHAR( 2 ) NULL DEFAULT NULL COMMENT  'selectBox,array';
";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
CREATE TABLE IF NOT EXISTS `nc_formas_pago` (
  `id` int(11)  NOT NULL AUTO_INCREMENT COMMENT 'textField,0,false',
  `nombre` varchar(100) DEFAULT NULL COMMENT 'selectBox,array',
  `descripcion` text DEFAULT NULL COMMENT 'ckeditor',
  `usuario` varchar(80) DEFAULT NULL COMMENT 'textField,0,false',
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;
";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
 ALTER TABLE nc_formas_pago COMMENT ' [
   {
                    \"selectBoxArrays\": [
              {
                \"name\": \"nombre\",
                \"data\": {
                    \"consignacion\": \"Consignación\",
                    \"efectivo_contraentrega\": \"Efectivo Contra Entrega\",
                    \"payu\": \"Payu / Pago en línea (tarjeta crédito, débito)\",
                    \"cuenta_coriente_ahorros\": \"Cuenta Corriente o de Ahorros\",
                    \"tarjeta_credito\": \"Tarjeta de Crédito\",
                    \"tarjeta_credito_pago_en_casa\": \"Tarjeta de Crédito/Débito pago en casa\",
                    \"sodexo\": \"Sodexo\"
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



//        ///////////////////7 TABLAS PV /////////////////////////

        $sql = "
CREATE TABLE pv_anular (
    id INT(11) NOT NULL AUTO_INCREMENT,
    nombre VARCHAR(100),
    empresa INT(11),
    usuario VARCHAR(80),
    fecha timestamp NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=latin1;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
CREATE TABLE pv_banner (
    id INT(11) NOT NULL AUTO_INCREMENT,
    imagen VARCHAR(150),
    usuario VARCHAR(80),
    empresa INT(11),
    empresa_cliente INT(11),
    terminal INT(11),
    fecha timestamp NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=latin1;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
CREATE TABLE pv_bodega (
    id INT(11) NOT NULL AUTO_INCREMENT,
    nombre VARCHAR(100),
    usuario VARCHAR(80),
    fecha date,
    empresa INT(11),
    terminal INT(11),
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=latin1;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
CREATE TABLE pv_carrito_productos (
    id INT(11) NOT NULL AUTO_INCREMENT,
    usuario VARCHAR(80),
    empresa INT(11),
    fecha timestamp NOT NULL,
    empresa_cliente INT(11),
    producto INT(11),
    unidades INT(11),
    observaciones text,
    adicionales text,
    session VARCHAR(60),
    nombre_producto text,
    descripcion_producto text,
    valor_producto INT(11),
    imagen_producto text,
    valor_total INT(11),
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=latin1;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
CREATE TABLE pv_categorias (
    id INT(11) NOT NULL AUTO_INCREMENT,
    nombre VARCHAR(100),
    usuario VARCHAR(80) NOT NULL,
    fecha date NOT NULL,
    empresa INT(11) NOT NULL,
    empresa_cliente INT(11),
    terminal INT(11),
    orden INT(11),
    mostrar_producto VARCHAR(2),
    color_fondo VARCHAR(50),
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=latin1;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
CREATE TABLE pv_clientes_registrados (
    id INT(11) NOT NULL AUTO_INCREMENT,
    nombre VARCHAR(200),
    fecha_nacimiento timestamp NOT NULL,
    ciudad INT(11),
    mail VARCHAR(150),
    telefono VARCHAR(100),
    celular VARCHAR(100),
    observaciones text,
    empresa_cliente INT(11),
    empresa INT(11),
    fecha_registro timestamp,
    usuario VARCHAR(80),
    terminal INT(11),
    usuario_cliente VARCHAR(200) NOT NULL,
    clave VARCHAR(200) NOT NULL,
    fecha_actualizacion timestamp NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=latin1;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
CREATE TABLE pv_colores (
    id INT(11) NOT NULL AUTO_INCREMENT,
    nombre VARCHAR(100),
    usuario VARCHAR(80) NOT NULL,
    fecha date NOT NULL,
    empresa INT(11) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=latin1;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
CREATE TABLE pv_config_products (
    id INT(11) NOT NULL AUTO_INCREMENT,
    empresa INT(11),
    usuario VARCHAR(80),
    marca boolean,
    talla boolean,
    color boolean,
    medio boolean,
    unidad_medida boolean,
    ubicacion boolean,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=latin1;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
CREATE TABLE pv_configuracion_direcciones (
    id INT(11) NOT NULL AUTO_INCREMENT,
    direccion text,
    usuario VARCHAR(80),
    fecha_creacion timestamp NOT NULL,
    cliente INT(11),
    barrio VARCHAR(200),
    telefono VARCHAR(100),
    empresa INT(11),
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=latin1;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
CREATE TABLE pv_configuracion_tienda (
    id INT(11) NOT NULL AUTO_INCREMENT,
    fondo_color_menu VARCHAR(40),
    fondo_general VARCHAR(100),
    estilo_productos VARCHAR(100),
    usuario VARCHAR(80),
    empresa INT(11),
    terminal INT(11),
    fecha timestamp NOT NULL,
    empresa_cliente INT(11),
    fondo_img_menu VARCHAR(150),
    estilo_menu VARCHAR(50),
    mostrar_banner VARCHAR(2),
    fondo_titulos VARCHAR(50),
    fondo_menu_activo VARCHAR(50),
    colorfont_menu_activo VARCHAR(50),
    colorfont_menu VARCHAR(50),
    mostrar_destacados VARCHAR(2),
    activo VARCHAR(2),
    colorfont_titulos VARCHAR(50),
    diseno VARCHAR(1),
    usar_fondo_grupos VARCHAR(2),
    salsas_popup VARCHAR(10),
    diseno_carrito VARCHAR(1),
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=latin1;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
CREATE TABLE pv_costos_domicilio (
    id INT(11) NOT NULL AUTO_INCREMENT,
    valor FLOAT NOT NULL,
    empresa_cliente INT(11) NOT NULL,
    usuario VARCHAR(80) NOT NULL,
    empresa INT(11) NOT NULL,
    terminal INT(11) NOT NULL,
    fecha timestamp NOT NULL NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=latin1;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
CREATE TABLE pv_descuentos (
    id INT(11) NOT NULL AUTO_INCREMENT,
    nombre VARCHAR(100),
    valor_descuento FLOAT,
    descripcion text,
    fecha_inicial timestamp NOT NULL,
    fecha_final timestamp NOT NULL,
    usuario VARCHAR(80),
    empresa INT(11),
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=latin1;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
CREATE TABLE pv_domiciliarios (
    id INT(11) NOT NULL AUTO_INCREMENT,
    nombre VARCHAR(100),
    usuario VARCHAR(80),
    empresa INT(11),
    fecha timestamp NOT NULL,
    cc VARCHAR(40),
    correo VARCHAR(100),
    direccion VARCHAR(200),
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=latin1;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
CREATE TABLE pv_domicilios (
    id INT(11) NOT NULL AUTO_INCREMENT,
    cliente INT(11),
    nomenclatura_uno INT(11),
    nuemero_uno VARCHAR(50),
    nomenclatura_dos INT(11),
    numero_dos VARCHAR(50),
    telefono VARCHAR(50),
    celular VARCHAR(50),
    empresa_cliente VARCHAR(80),
    empresa INT(11),
    usuario VARCHAR(80),
    fecha timestamp,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=latin1;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
CREATE TABLE pv_empresas_clientes (
    id INT(11) NOT NULL AUTO_INCREMENT,
    nombre VARCHAR(100),
    nit VARCHAR(100),
    razon_social VARCHAR(100),
    telefono VARCHAR(100),
    celular VARCHAR(100),
    direccion VARCHAR(200),
    estado INT(11),
    observaciones text,
    contacto_directo VARCHAR(100),
    usuario VARCHAR(80),
    empresa INT(11),
    fecha timestamp,
    logo VARCHAR(100),
    url VARCHAR(300),
    imagen_portada VARCHAR(100),
    tags text,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=latin1;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
CREATE TABLE pv_empresas_descripcion (
    id INT(11) NOT NULL AUTO_INCREMENT,
    costo_domicilio VARCHAR(100),
    tiempo_entrega_aproximada VARCHAR(100),
    pedido_minimo VARCHAR(60),
    usuario VARCHAR(80),
    empresa_cliente INT(11),
    empresa INT(11),
    fecha timestamp NOT NULL,
    terminal INT(11),
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=latin1;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
CREATE TABLE pv_empresas_formas_pago (
    id INT(11) NOT NULL AUTO_INCREMENT,
    forma_pago INT(11),
    empresa_cliente INT(11),
    empresa INT(11),
    usuario VARCHAR(80),
    fecha timestamp NOT NULL,
    terminal INT(11),
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=latin1;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
CREATE TABLE pv_empresas_horarios (
    id INT(11) NOT NULL AUTO_INCREMENT,
    horario_apertura VARCHAR(60),
    horario_cierre VARCHAR(60),
    empresa INT(11),
    dia date,
    empresa_cliente INT(11),
    terminal INT(11),
    usuario INT(11),
    fecha timestamp NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=latin1;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
CREATE TABLE pv_entradas (
    id INT(11) NOT NULL AUTO_INCREMENT,
    fecha_ingreso timestamp NOT NULL,
    fecha_hora_ingreso timestamp NOT NULL,
    bodega INT(11),
    nom_bodega VARCHAR(150),
    estado INT(11),
    nom_estado VARCHAR(150),
    valor_total FLOAT,
    cantidad_total FLOAT,
    empresa INT(11),
    usuario VARCHAR(80),
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=latin1;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
CREATE TABLE pv_estado_empresas_cliente (
    id INT(11) NOT NULL AUTO_INCREMENT,
    nombre VARCHAR(100),
    empresa_cliente INT(11),
    empresa INT(11),
    terminal INT(11),
    usuarios VARCHAR(80),
    fecha timestamp NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=latin1;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
CREATE TABLE pv_estado_producto (
    id INT(11) NOT NULL AUTO_INCREMENT,
    nombre VARCHAR(150),
    usuario VARCHAR(80),
    fecha timestamp NOT NULL,
    empresa INT(11),
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=latin1;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
CREATE TABLE pv_estados_entradas (
    id INT(11) NOT NULL AUTO_INCREMENT,
    nombre VARCHAR(150),
    usuario VARCHAR(80),
    fecha timestamp NOT NULL,
    empresa INT(11),
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=latin1;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }


        $sql = "CREATE TABLE pv_estados_inventario (
    id INT(11) NOT NULL AUTO_INCREMENT,
    nombre VARCHAR(150),
    usuario VARCHAR(80),
    fecha timestamp NOT NULL,
    empresa INT(11),
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=latin1;  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "CREATE TABLE pv_estados_salidas (
    id INT(11) NOT NULL AUTO_INCREMENT,
    nombre VARCHAR(150),
    usuario VARCHAR(80),
    fecha timestamp NOT NULL,
    empresa INT(11),
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=latin1;  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "CREATE TABLE pv_formas_pago (
    id INT(11) NOT NULL AUTO_INCREMENT,
    nombre VARCHAR(100),
    icono VARCHAR(100),
    empresa_cliente INT(11),
    empresa INT(11),
    terminal INT(11),
    usuario VARCHAR(80),
    fecha timestamp NOT NULL,
    pais INT(11),
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=latin1;  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "CREATE TABLE pv_horarios_empresas (
    id INT(11) NOT NULL AUTO_INCREMENT,
    usuario VARCHAR(80),
    empresa INT(11),
    empresa_cliente INT(11),
    hora_apertura VARCHAR(10),
    hora_cierre VARCHAR(10),
    dia_semana VARCHAR(10),
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=latin1;  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "CREATE TABLE pv_horarios_tiendas (
    id INT(11) NOT NULL AUTO_INCREMENT,
    empresa_cliente INT(11) NOT NULL,
    usuario VARCHAR(80),
    empresa INT(11),
    terminal INT(11),
    fecha timestamp NOT NULL,
    dia_semana VARCHAR(20),
    grupo INT(11),
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=latin1;  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "CREATE TABLE pv_horarios_tiendas_grupos (
    id INT(11) NOT NULL AUTO_INCREMENT,
    nombre VARCHAR(60),
    usuario VARCHAR(80),
    empresa INT(11),
    empresa_cliente INT(11),
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=latin1;  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "CREATE TABLE pv_ingresos (
    id INT(11) NOT NULL AUTO_INCREMENT,
    fecha date,
    bodega INT(11),
    estado INT(11),
    valor_total FLOAT,
    cantidad_total FLOAT,
    empresa INT(11),
    usuario VARCHAR(80),
    observaciones text,
    fecha_ingreso timestamp NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=latin1;  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "CREATE TABLE pv_ingresos_det (
    id INT(11) NOT NULL AUTO_INCREMENT,
    ingreso INT(11),
    fecha date,
    producto INT(11),
    marca INT(11),
    categoria INT(11),
    color INT(11),
    talla INT(11),
    proveedor INT(11),
    label text,
    valor FLOAT,
    usuario VARCHAR(80),
    empresa INT(11),
    ubicacion INT(11),
    unidad_medida INT(11),
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=latin1;  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "CREATE TABLE pv_inventario (
    id INT(11) NOT NULL AUTO_INCREMENT,
    ingreso INT(11),
    fecha date,
    producto INT(11),
    marca INT(11),
    categoria INT(11),
    color INT(11),
    talla INT(11),
    proveedor INT(11),
    label text,
    valor FLOAT,
    usuario VARCHAR(80),
    empresa INT(11),
    ubicacion INT(11),
    unidad_medida INT(11),
    bodega INT(11),
    estado INT(11),
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=latin1;  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "CREATE TABLE pv_kardex (
    id INT(11) NOT NULL AUTO_INCREMENT,
    ingreso INT(11),
    fecha date,
    producto INT(11),
    marca INT(11),
    categoria INT(11),
    color INT(11),
    talla INT(11),
    proveedor INT(11),
    label text,
    valor_entradas FLOAT,
    usuario VARCHAR(80),
    empresa INT(11),
    ubicacion INT(11),
    unidad_medida INT(11),
    bodega INT(11),
    estado INT(11),
    salida INT(11),
    saldo_cantidad FLOAT,
    valor_salidas FLOAT,
    saldo FLOAT,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=latin1;  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "CREATE TABLE pv_marcas (
    id INT(11) NOT NULL AUTO_INCREMENT,
    nombre VARCHAR(100),
    usuario VARCHAR(80),
    fecha date,
    empresa INT(11),
    sigla VARCHAR(10),
    imagen VARCHAR(150),
    empresa_cliente INT(11),
    terminal INT(11),
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=latin1;  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "CREATE TABLE pv_medios (
    id INT(11) NOT NULL AUTO_INCREMENT,
    nombre VARCHAR(100),
    usuario VARCHAR(80),
    empresa INT(11),
    fecha timestamp NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=latin1;  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "CREATE TABLE pv_metodos_pago (
    id INT(11) NOT NULL AUTO_INCREMENT,
    tienda INT(11),
    empresa_cliente INT(11),
    empresa INT(11),
    usuario VARCHAR(80),
    fecha timestamp NOT NULL,
    nombre INT(11),
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=latin1;  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "CREATE TABLE pv_productos (
    id INT(11) NOT NULL AUTO_INCREMENT,
    nombre VARCHAR(100),
    usuario VARCHAR(80),
    fecha date,
    empresa INT(11),
    referencia VARCHAR(200),
    talla INT(11),
    marca INT(11),
    categoria INT(11),
    color INT(11),
    foto text,
    valor FLOAT,
    proveedor INT(11),
    iva FLOAT,
    precio FLOAT,
    descripcion text,
    unidad_medida INT(11),
    puntaje FLOAT,
    descripcion_corta text,
    comentario text,
    visitas VARCHAR(10),
    empresa_cliente INT(11),
    destacado VARCHAR(2),
    precio_costo VARCHAR(100),
    valor_iva VARCHAR(100),
    integrado VARCHAR(2),
    orden INT(11),
    mostrar_producto VARCHAR(2),
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=latin1;  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "CREATE TABLE pv_productos_asociados (
    id INT(11) NOT NULL AUTO_INCREMENT,
    producto INT(11),
    usuario VARCHAR(80),
    fecha timestamp NOT NULL,
    empresa INT(11),
    id_producto INT(11),
    producto_nombre VARCHAR(100),
    valor numeric,
    opcion INT(11),
    categoria INT(11),
    orden INT(11),
    destacado VARCHAR(2),
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=latin1;  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "CREATE TABLE pv_productos_opciones (
    id INT(11) NOT NULL AUTO_INCREMENT,
    nombre VARCHAR(60),
    id_relacion INT(11),
    empresa_cliente INT(11),
    empresa INT(11),
    terminal INT(11),
    tipo VARCHAR(20),
    multiseleccion VARCHAR(2),
    usuario VARCHAR(80),
    fecha timestamp NOT NULL,
    id_producto INT(11),
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=latin1;  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "CREATE TABLE pv_productos_relacionados (
    id INT(11) NOT NULL AUTO_INCREMENT,
    id_relacion INT(11),
    producto INT(11),
    producto_nombre VARCHAR(200),
    empresa INT(11),
    terminal INT(11),
    empresa_cliente INT(11),
    valor FLOAT,
    color VARCHAR(60),
    tipo INT(11),
    id_producto INT(11),
    categoria INT(11),
    usuario character(80),
    fecha timestamp NOT NULL,
    opcion INT(11),
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=latin1;  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "CREATE TABLE pv_proveedores (
    id INT(11) NOT NULL AUTO_INCREMENT,
    nit VARCHAR(100),
    nombre VARCHAR(150),
    razon_social VARCHAR(150),
    telefono FLOAT,
    direccion VARCHAR(100),
    email VARCHAR(150),
    usuario VARCHAR(80),
    empresa INT(11),
    fecha date,
    nombre_contacto VARCHAR(100),
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=latin1;  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "CREATE TABLE pv_salidas (
    id INT(11) NOT NULL AUTO_INCREMENT,
    bodega INT(11),
    estado INT(11),
    valor_total FLOAT,
    cantidad_total FLOAT,
    empresa INT(11),
    usuario VARCHAR(80),
    observaciones text,
    fecha_salida timestamp NOT NULL,
    costo_domicilio INT(11),
    session VARCHAR(100),
    empresa_cliente INT(11),
    cliente INT(11),
    fecha_atendido timestamp NOT NULL,
    telefono FLOAT,
    cedula FLOAT,
    email VARCHAR(150),
    cliente_text VARCHAR(100),
    direccion VARCHAR(100),
    barrio character(150),
    sub_total FLOAT,
    medio INT(11),
    duracion_pedido VARCHAR(100),
    terminal INT(11),
    motivo_traslado INT(11),
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=latin1;  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "CREATE TABLE pv_salidas_det (
    id INT(11) NOT NULL AUTO_INCREMENT,
    salida INT(11),
    fecha timestamp NOT NULL,
    producto INT(11),
    label text,
    valor FLOAT,
    usuario VARCHAR(80),
    empresa INT(11),
    unidades INT(11),
    observaciones text,
    adicionales text,
    session VARCHAR

(100),
    nombre_producto VARCHAR(150),
    descripcion_producto text,
    valor_producto INT(11),
    imagen_producto text,
    empresa_cliente INT(11),
    estado INT(11),
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=latin1;  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "CREATE TABLE pv_subcategorias (
    id INT(11) NOT NULL AUTO_INCREMENT,
    nombre character(100),
    fecha timestamp NOT NULL,
    categoria INT(11),
    empresa INT(11),
    empresa_cliente INT(11),
    terminal INT(11) NOT NULL,
    usuario VARCHAR(80),
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=latin1;  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "CREATE TABLE pv_tallas (
    id INT(11) NOT NULL AUTO_INCREMENT,
    nombre VARCHAR(100),
    usuario VARCHAR(80) NOT NULL,
    fecha date NOT NULL,
    empresa INT(11) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=latin1;  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "CREATE TABLE pv_tiempos_domicilio (
    id INT(11) NOT NULL AUTO_INCREMENT,
    nombre VARCHAR(100),
    usuario VARCHAR(80),
    fecha timestamp NOT NULL,
    empresa INT(11),
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=latin1;  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "CREATE TABLE pv_tiendas_direcciones (
    id INT(11) NOT NULL AUTO_INCREMENT,
    pos_x VARCHAR(100),
    pos_y VARCHAR(100),
    empresa_cliente INT(11),
    usuario VARCHAR(80),
    empresa INT(11),
    terminal INT(11),
    terminal_text VARCHAR(80),
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=latin1;  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "CREATE TABLE pv_ubicacion (
    id INT(11) NOT NULL AUTO_INCREMENT,
    nombre VARCHAR(150),
    usuario VARCHAR(80),
    fecha timestamp NOT NULL,
    empresa INT(11),
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=latin1;  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "CREATE TABLE pv_unidad_medida (
    id INT(11) NOT NULL AUTO_INCREMENT,
    nombre VARCHAR(150),
    usuario VARCHAR(80),
    fecha timestamp NOT NULL,
    empresa INT(11),
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=latin1;  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "CREATE TABLE pv_zonas (
    id INT(11) NOT NULL AUTO_INCREMENT,
    nombre VARCHAR(100),
    ciudad INT(11),
    domiciliarios INT(11),
    usuario VARCHAR(80),
    empresa INT(11),
    fecha timestamp NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=latin1;  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "CREATE TABLE pv_horarios_tiendas_horas (
    id int(11) NOT NULL AUTO_INCREMENT,
    empresa_cliente int(11),
    id_grupo int(11),
    hora_inicial varchar(20),
    hora_final varchar(20),
    fecha timestamp,
    usuario varchar(100),
    empresa int(11),
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=latin1;  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "ALTER TABLE  `pv_salidas` ADD  `comentario` TEXT NULL COMMENT  'textArea';
";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
            ALTER TABLE  `pv_salidas` ADD  `forma_pago` VARCHAR( 80 ) NULL COMMENT  'textField';
";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
          ALTER TABLE  `pv_salidas` ADD  `celular` INT( 10 ) NULL COMMENT  'textField';
";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
      ALTER TABLE  `pv_configuracion_direcciones` ADD  `celular` INT( 12 ) NULL COMMENT  'textField';
";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
   ALTER TABLE  `pv_configuracion_direcciones` ADD  `ciudad` VARCHAR( 80 ) NULL COMMENT  'textField';
";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
 INSERT INTO `pv_estados_salidas` (`id`, `nombre`, `usuario`, `fecha`, `empresa`) VALUES
(1, 'Nuevo', 'ladyg', '2015-06-24 18:02:06', 1),
(2, 'Atendido', 'ladyg', '2015-06-24 18:02:06', 1),
(3, 'Despachado', 'alexf', '2015-06-24 18:02:06', 1),
(4, 'Rechazado', 'juliand', '2015-04-22 05:00:00', 1);
";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
///////////////////FIN TABLAS PV //////////////////////////




        $sql = "
ALTER TABLE  `noticias_config` ADD  `slider_home` VARCHAR( 2 ) NULL COMMENT  'selectBox,array';
";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE  `productos_config` ADD  `mostrar_slider` VARCHAR( 2 ) NULL COMMENT  'selectBox,array';
";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE  `productos_config` ADD  `modo_contacto` VARCHAR( 20 ) NULL COMMENT  'selectBox,array';
";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE  `productos` CHANGE  `presentacion`  `presentacion` TEXT NULL COMMENT  'ckeditor';
";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE  `nc_products` ADD  `text_nodisponible` VARCHAR( 75 ) NULL COMMENT  'textField';
";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE  `nc_baskets` ADD  `description` TEXT NULL COMMENT  'textArea';
";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE  `ciudades` ADD  `valor_domicilio` INT NULL COMMENT  'textField';
";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "CREATE TABLE nc_basket_enc (
    id INT(11) NOT NULL AUTO_INCREMENT,
    session VARCHAR(100),
    domicilio VARCHAR(50),
    subtotal VARCHAR(50),
    total VARCHAR(50),
    cliente VARCHAR(50),
    fecha date,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=latin1;  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE  `nc_config` ADD  `valor_min_enviofree` INT (11) NULL COMMENT  'textField';
";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE  `nc_products_variantes` ADD  `nombre_talla` VARCHAR(10) NULL COMMENT  'textField';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE  `nc_products_variantes` ADD  `nombre_color` VARCHAR(10) NULL COMMENT  'textField';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE  `nc_products_variantes` ADD  `nombre_presentacion` VARCHAR(10) NULL COMMENT  'textField';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE  `nc_products_variantes` ADD  `unidades_disponibles` INT(11) NULL COMMENT  'textField';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE  `nc_products_variantes` ADD  `referencia` VARCHAR(10) NULL COMMENT  'textField';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE  `productos` ADD  `imagen_portada` VARCHAR(70) NULL COMMENT  'textField';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE  `nc_manufacturers_asociate` CHANGE  `categoria`  `categoria` INT( 11 ) NULL DEFAULT NULL COMMENT  'selectBox,nc_groups';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE  `nc_manufacturers_asociate` CHANGE  `grupo`  `grupo` INT( 11 ) NOT NULL COMMENT  'selectBox,nc_colors';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }


        $sql = "
INSERT INTO `nw_fuentes` (`id`, `nombre`, `usuario`) VALUES
(4, 'arial', 'alexf'),
(5, 'bpicons', 'alexf'),
(6, 'Acens', 'andresf'),
(7, 'NeoSansIntel', 'andresf'),
(8, 'titillium_1', 'andresf'),
(9, 'titillium_2', 'andresf'),
(10, 'titillium_3', 'andresf'),
(11, 'titillium_4', 'andresf'),
(12, 'titillium_5', 'andresf'),
(13, 'FontAwesome', 'andresf'),
(14, 'gothic', 'andresf'),
(15, 'LETTERGOTHICSTD', 'andresf'),
(16, 'LETTERGOTHICSTD-BOLD', 'andresf'),
(17, 'LETTERGOTHICSTD-BOLDSLANTED', 'andresf'),
(18, 'LETTERGOTHICSTD-SLANTED', 'andresf'),
(19, 'Drugs', 'andresf'),
(20, 'timeless', 'andresf'),
(21, 'Timeless-Bold', 'andresf'),
(22, 'BrothersRegular', 'andresf');
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE  `secciones` ADD  `ancho_max` INT( 11 ) NOT NULL COMMENT  'textField';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE  `secciones` ADD  `ancho_max_medida` VARCHAR( 3 ) NOT NULL COMMENT  'selectBox,array';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
CREATE TABLE IF NOT EXISTS `nwp_popup` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'textField,0,false',
  `pagina` int(11) NOT NULL COMMENT 'selectBox,paginas',
   `activo` varchar(2) NOT NULL COMMENT 'selectBox,array',
     `fecha_inicio` date NULL DEFAULT NULL COMMENT 'dateField',
  `fecha_final` date NULL DEFAULT NULL COMMENT 'dateField',
  `imagen` varchar(100) NOT NULL COMMENT 'uploader',
  `html` TEXT NOT NULL COMMENT 'ckeditor',
  `usuario` varchar(90) NOT NULL COMMENT 'textField,0,false',
  `empresa` int(11) NOT NULL COMMENT 'textField,0,false',
  `fecha` timestamp NULL DEFAULT NULL COMMENT 'textField,0,false',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE  `nc_config`
CHANGE  `id`  `id` INT( 11 ) NOT NULL AUTO_INCREMENT COMMENT  'textField,0,false',
CHANGE  `marcas`  `marcas` VARCHAR( 2 ) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT  'selectBox,array',
CHANGE  `precios`  `precios` VARCHAR( 2 ) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT  'selectBox,array',
 CHANGE  `banner`  `banner` VARCHAR( 2 ) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT  'selectBox,array',
  CHANGE  `destacados`  `destacados` VARCHAR( 2 ) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT  'selectBox,array',
  CHANGE  `buscar`  `buscar` VARCHAR( 2 ) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT  'selectBox,array',
  CHANGE  `carrito`  `carrito` VARCHAR( 2 ) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT  'selectBox,array',
  CHANGE  `login`  `login` VARCHAR( 2 ) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT  'selectBox,array',
    CHANGE  `destacados_orden`  `destacados_orden` VARCHAR( 20 ) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT  'selectBox,array',
    CHANGE  `destacados_asc`  `destacados_asc` VARCHAR( 4 ) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT  'selectBox,array',
    CHANGE  `productos_pagina`  `productos_pagina` VARCHAR(2) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT  'textField',
    CHANGE  `relacionados`  `relacionados` VARCHAR( 2 ) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT  'selectBox,array',
    CHANGE  `me_gusta`  `me_gusta` VARCHAR( 2 ) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT  'selectBox,array',
    CHANGE  `productos_orden`  `productos_orden` VARCHAR( 20 ) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT  'selectBox,array',
    CHANGE  `productos_asc`  `productos_asc` VARCHAR( 4 ) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT  'selectBox,array',
    CHANGE  `crear_cuentas`  `crear_cuentas` VARCHAR( 2 ) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT  'selectBox,array',
    CHANGE  `usuario`  `usuario` VARCHAR( 50 ) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL COMMENT  'textField,0,false',
    CHANGE  `fecha`  `fecha` TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT  'textField,0,false',
    CHANGE  `descontar`  `descontar` VARCHAR( 2 ) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT  'selectBox,array',
    CHANGE  `correo_copia`  `correo_copia` VARCHAR( 150 ) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT  'textField',
    CHANGE  `logo_factura`  `logo_factura` VARCHAR( 200 ) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT  'uploader',
    CHANGE  `empresa`  `empresa` INT NULL DEFAULT NULL COMMENT  'textField,0,false',
    CHANGE  `nit`  `nit` VARCHAR( 20 ) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT  'textField',
   CHANGE  `marca_agua`  `marca_agua` VARCHAR( 100 ) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT  'uploader',
    CHANGE  `descripcion`  `descripcion` VARCHAR( 2 ) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT  'selectBox,array',
    CHANGE  `vistos`  `vistos` VARCHAR( 2 ) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT  'selectBox,array',
    CHANGE  `votados`  `votados` VARCHAR( 2 ) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT  'selectBox,array',
    CHANGE  `seguridad`  `seguridad` VARCHAR( 2 ) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT  'selectBox,array',
    CHANGE  `estilo_menu`  `estilo_menu` VARCHAR( 50 ) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT  'selectBox,array',
    CHANGE  `mostrar_submenu_active`  `mostrar_submenu_active` VARCHAR( 2 ) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT  'selectBox,array',
    CHANGE  `pagos_pruebas`  `pagos_pruebas` VARCHAR( 2 ) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT  'selectBox,array',
    CHANGE  `mostrar_submenu_active_principal`  `mostrar_submenu_active_principal` VARCHAR( 2 ) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT  'selectBox,array'
;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
//COMMENT TIENDA COMPRIMIDO
        $sql_c = "ALTER TABLE nc_config COMMENT ' [{\"selectBoxArrays\": [
{
\"name\": \"destacados_orden\",
\"data\": {
\"nombre\": \"Nombre\",
\"referencia\": \"Referencia\",
\"relevancia\": \"Relevancia\",
\"fecha\": \"Fecha\"
}
},
{
\"name\": \"destacados_asc\",
\"data\": {
\"asc\": \"Ascendente\",
\"desc\": \"Descendente\"
}
},
{
\"name\": \"productos_orden\",
\"data\": {
\"productPrice\": \"Precio\",
\"productName\": \"Nombre\",
\"productCode\": \"Referencia\",
\"relevancia\": \"Relevancia\",
\"insertDate\": \"Fecha insertado\"
}
},
{
\"name\": \"productos_asc\",
\"data\": {
\"asc\": \"Ascendente\",
\"desc\": \"Descendente\"
}
},
{
\"name\": \"estilo_menu\",
\"data\": {
\"horizontal\": \"Horizontal\",
\"vertical\": \"Vertical\"
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
//        $sql_c = "
// ALTER TABLE nc_config COMMENT '[{\"selectBoxArrays\": [{
//                \"name\": \"marcas\",
//                \"data\": {
//                    \"SI\": \"SI\",
//                    \"NO\": \"NO\"
//                }
//            },
//              {
//                \"name\": \"precios\",
//                \"data\": {
//                    \"SI\": \"SI\",
//                    \"NO\": \"NO\"
//                }
//            },
//              {
//                \"name\": \"banner\",
//                \"data\": {
//                    \"SI\": \"SI\",
//                    \"NO\": \"NO\"
//                }
//            },
//              {
//                \"name\": \"destacados\",
//                \"data\": {
//                    \"SI\": \"SI\",
//                    \"NO\": \"NO\"
//                }
//            },
//              {
//                \"name\": \"buscar\",
//                \"data\": {
//                    \"SI\": \"SI\",
//                    \"NO\": \"NO\"
//                }
//            },
//              {
//                \"name\": \"carrito\",
//                \"data\": {
//                    \"SI\": \"SI\",
//                    \"NO\": \"NO\"
//                }
//            },
//              {
//                \"name\": \"login\",
//                \"data\": {
//                    \"SI\": \"SI\",
//                    \"NO\": \"NO\"
//                }
//            },
//              {
//                \"name\": \"destacados_orden\",
//                \"data\": {
//                    \"nombre\": \"Nombre\",
//                    \"referencia\": \"Referencia\",
//                    \"relevancia\": \"Relevancia\",
//                    \"fecha\": \"Fecha\"
//                }
//            },
//              {
//                \"name\": \"destacados_asc\",
//                \"data\": {
//                    \"asc\": \"Ascendente\",
//                    \"desc\": \"Descendente\"
//                }
//            },
//              {
//                \"name\": \"relacionados\",
//                \"data\": {
//                    \"SI\": \"SI\",
//                    \"NO\": \"NO\"
//                }
//            },
//              {
//                \"name\": \"me_gusta\",
//                \"data\": {
//                    \"SI\": \"SI\",
//                    \"NO\": \"NO\"
//                }
//            },
//                 {
//                \"name\": \"productos_orden\",
//                \"data\": {
//                    \"nombre\": \"Nombre\",
//                    \"referencia\": \"Referencia\",
//                    \"relevancia\": \"Relevancia\",
//                    \"fecha\": \"Fecha\"
//                }
//            },
//              {
//                \"name\": \"productos_asc\",
//                \"data\": {
//                    \"asc\": \"Ascendente\",
//                    \"desc\": \"Descendente\"
//                }
//            },
//              {
//                \"name\": \"crear_cuentas\",
//                \"data\": {
//                    \"SI\": \"SI\",
//                    \"NO\": \"NO\"
//                }
//            },
//              {
//                \"name\": \"descontar\",
//                \"data\": {
//                    \"SI\": \"SI\",
//                    \"NO\": \"NO\"
//                }
//            },
//              {
//                \"name\": \"descripcion\",
//                \"data\": {
//                    \"SI\": \"SI\",
//                    \"NO\": \"NO\"
//                }
//            },
//              {
//                \"name\": \"vistos\",
//                \"data\": {
//                    \"SI\": \"SI\",
//                    \"NO\": \"NO\"
//                }
//            },
//              {
//                \"name\": \"votados\",
//                \"data\": {
//                    \"SI\": \"SI\",
//                    \"NO\": \"NO\"
//                }
//            },
//              {
//                \"name\": \"pagos_pruebas\",
//                \"data\": {
//                    \"SI\": \"SI\",
//                    \"NO\": \"NO\"
//                }
//            },
//              {
//                \"name\": \"seguridad\",
//                \"data\": {
//                    \"SI\": \"SI\",
//                    \"NO\": \"NO\"
//                }
//            },
//              {
//                \"name\": \"estilo_menu\",
//                \"data\": {
//                    \"horizontal\": \"Horizontal\",
//                    \"vertical\": \"Vertical\"
//                }
//            },
//              {
//                \"name\": \"mostrar_submenu_active_principal\",
//                \"data\": {
//                    \"SI\": \"SI\",
//                    \"NO\": \"NO\"
//                }
//            },
//              {
//                \"name\": \"mostrar_submenu_active\",
//                \"data\": {
//                    \"SI\": \"SI\",
//                    \"NO\": \"NO\"
//                }
//            },
//              {
//                \"name\": \"seleccionar_ciudad\",
//                \"data\": {
//                    \"NO\": \"NO\",
//                    \"SI\": \"SI\",
//                }
//            }
//        ],
//         \"config\": {
//                            \"cleanHtml\": false
//                        }
//    }
//  ]
//';
//  ";
//        $sql_c = str_replace(" ", "", $sql_c);
//        $sql_c = str_replace("                    ", "", $sql_c);
//        $sql_c = str_replace("                ", "", $sql_c);
//        $sql_c = str_replace("false", ": false", $sql_c);
//           $sql_c = str_replace(":", ": ", $sql_c);
//           $sql_c = str_replace("#", " ", $sql_c);
//           $sql_c = gzdeflate($sql_c, 9);
//echo $compressed;
        $ca->prepare($sql_c);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `nc_config`
CHANGE `marcas` `marcas` VARCHAR(2) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT 'selectBox,boolean',
CHANGE `precios` `precios` VARCHAR(2) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT 'selectBox,boolean',
CHANGE `banner` `banner` VARCHAR(2) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT 'selectBox,boolean',
CHANGE `destacados` `destacados` VARCHAR(2) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT 'selectBox,boolean',
CHANGE `buscar` `buscar` VARCHAR(2) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT 'selectBox,boolean',
CHANGE `carrito` `carrito` VARCHAR(2) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT 'selectBox,boolean',
CHANGE `login` `login` VARCHAR(2) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT 'selectBox,boolean',
CHANGE `relacionados` `relacionados` VARCHAR(2) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT 'selectBox,boolean',
CHANGE `me_gusta` `me_gusta` VARCHAR(2) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT 'selectBox,boolean',
CHANGE `crear_cuentas` `crear_cuentas` VARCHAR(2) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT 'selectBox,boolean',
CHANGE `descontar` `descontar` VARCHAR(2) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT 'selectBox,boolean',
CHANGE `descripcion` `descripcion` VARCHAR(2) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT 'selectBox,boolean',
CHANGE `vistos` `vistos` VARCHAR(2) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT 'selectBox,boolean',
CHANGE `votados` `votados` VARCHAR(2) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT 'selectBox,boolean',
CHANGE `seguridad` `seguridad` VARCHAR(2) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT 'selectBox,boolean',
CHANGE `pagos_pruebas` `pagos_pruebas` VARCHAR(2) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT 'selectBox,boolean',
CHANGE `mostrar_submenu_active` `mostrar_submenu_active` VARCHAR(2) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT 'selectBox,boolean',
CHANGE `mostrar_submenu_active_principal` `mostrar_submenu_active_principal` VARCHAR(2) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT 'selectBox,boolean',
CHANGE `seleccionar_ciudad` `seleccionar_ciudad` VARCHAR(2) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT 'selectBox,boolean';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
            ALTER TABLE  `nc_config` DROP  `color_carrito` ,
DROP  `imagen_titulo` ,
DROP  `imagen_relacionados` ,
DROP  `color_letra_prod` ,
DROP  `recordar_clave` ,
DROP  `texto_login` ,
DROP  `recordar_clave` ,
DROP  `color_pedido` ,
DROP  `responsive` ,
DROP  `random` ,
DROP  `mouse` ,
DROP  `velocidad` ,
DROP  `unidades` ,
DROP  `estilos`
;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
UPDATE  `usuarios` SET  `terminal` =  '1' WHERE  `usuarios`.`id` =31;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
UPDATE  `usuarios` SET  `terminal` =  '1' WHERE  `usuarios`.`id` =32;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
UPDATE  `usuarios` SET  `terminal` =  '1' WHERE  `usuarios`.`id` =33;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
UPDATE  `usuarios` SET  `terminal` =  '1' WHERE  `usuarios`.`id` =34;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE  `nc_products` ADD  `relevancia` INT NULL DEFAULT  '1' COMMENT  'selectBox,array';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE  `nc_products` CHANGE  `productPrice`  `productPrice` INT NULL DEFAULT NULL ;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE  `nc_baskets` ADD  `descripcion_completa` TEXT NULL COMMENT  'textArea';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE  `noticias` DROP  `time` ;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE  `noticias` CHANGE  `fecha`  `fecha` TIMESTAMP NOT NULL COMMENT  'dateField';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }


        $sql = "
ALTER TABLE  `noticias` ADD  `fecha_creacion` TIMESTAMP NOT NULL COMMENT  'textField,0,false';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE  `galeria_noticias` ADD  `video_url` VARCHAR( 200 ) NULL COMMENT  'textField';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE  `nc_colors` ADD  `orden` INT NULL DEFAULT  '1' COMMENT  'textField';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE  `nc_groups` ADD  `orden` INT NULL DEFAULT  '1' COMMENT  'textField';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
CREATE TABLE productos_contactos (
    id INT(11) NOT NULL AUTO_INCREMENT COMMENT  'textField,0,false',
    correo VARCHAR(150)  COMMENT  'textField,0,false',
    pagina INT(11) COMMENT  'selectBox,paginas',
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
        $sql = "
ALTER TABLE  `noticias_config`
ADD  `html_home` VARCHAR( 2 ) NULL COMMENT  'selectBox,array',
ADD  `caracteres_limite_home` VARCHAR( 5 ) NULL COMMENT  'textField';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE  `pv_salidas` ADD  `movito_cancelar` TEXT NULL COMMENT  'textArea';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
INSERT INTO  `pv_estados_salidas` (
`id` ,
`nombre` ,
`usuario` ,
`fecha` ,
`empresa`
)
VALUES (
'5',  'Cancelado por el cliente',  'alexf',
CURRENT_TIMESTAMP ,  '1'
);
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE  `ciudades` CHANGE  `departamento`  `departamento` INT( 11 ) NOT NULL COMMENT  'selectBox,ciudades_departamentos';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
CREATE TABLE ciudades_departamentos (
    id INT(11) NOT NULL AUTO_INCREMENT COMMENT  'textField,0,false',
    nombre VARCHAR(150)  COMMENT  'textField',
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
        $sql = "
ALTER TABLE  `productos` CHANGE  `referencia`  `referencia` TEXT CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT  'textField';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE  `contacto_body` CHANGE  `activo`  `activo` VARCHAR( 2 ) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT  'selectBox,array';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE  `contactos` CHANGE  `id`  `id` INT( 11 ) NOT NULL AUTO_INCREMENT COMMENT  'textField,0,false';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE  `contactos` CHANGE  `nombre_contacto`  `nombre_contacto` VARCHAR( 200 ) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL COMMENT  'textField';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE  `contactos` CHANGE  `email_contacto`  `email_contacto` VARCHAR( 150 ) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL COMMENT  'textField';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE  `contactos` CHANGE  `telefono_contacto`  `telefono_contacto` VARCHAR( 30 ) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL COMMENT  'textField';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE  `contactos` CHANGE  `pais_contacto`  `pais_contacto` VARCHAR( 10 ) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT  'textField';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE  `contactos` CHANGE  `ciudad_contacto`  `ciudad_contacto` VARCHAR( 200 ) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL COMMENT  'textField';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE  `contactos` CHANGE  `seccion_contacto`  `seccion_contacto` INT NULL COMMENT  'selectBox,departamentos';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE  `contactos` CHANGE  `comentarios_contacto`  `comentarios_contacto` TEXT CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL COMMENT  'textArea';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE  `contactos` CHANGE  `respuesta`  `respuesta` TEXT CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT  'textArea';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE  `contactos` CHANGE  `fecha`  `fecha` DATE NULL DEFAULT NULL COMMENT  'dateField';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE  `contactos` CHANGE  `empresa_contacto`  `empresa_contacto` VARCHAR( 100 ) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT  'textField';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
            ALTER TABLE  `productos_grupos` ADD  `orden` INT NULL COMMENT  'textField';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
         ALTER TABLE  `productos` ADD  `url_contacto` VARCHAR( 200 ) NULL COMMENT  'textField';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
CREATE TABLE nc_filtros (
    id INT(11) NOT NULL AUTO_INCREMENT COMMENT  'textField,0,false',
    nombre VARCHAR(150)  COMMENT  'textField',
    imagen VARCHAR(150)  COMMENT  'uploader',
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
        $sql = "
CREATE TABLE nc_filtros_cat (
    id INT(11) NOT NULL AUTO_INCREMENT COMMENT  'textField,0,false',
    id_filtro INT(11)  COMMENT  'selectBox,nc_filtros',
    nombre VARCHAR(150)  COMMENT  'textField',
    imagen VARCHAR(150)  COMMENT  'uploader',
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
        $sql = "
CREATE TABLE nc_filtros_productos (
    id INT(11) NOT NULL AUTO_INCREMENT COMMENT  'textField,0,false',
    filtro_id INT(11)  COMMENT  'selectBox,nc_filtros',
    filtro_cat_id INT(11)  COMMENT  'selectBox,nc_filtros',
    referencia_producto VARCHAR(150)  COMMENT  'textField',
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
        $sql = "
ALTER TABLE  `nc_products_variantes` ADD  `imagen_logo` VARCHAR( 200 ) NULL COMMENT  'uploader';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE  `nc_products_variantes` ADD  `unidades_disponibles_t` INT NULL COMMENT  'textField';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE  `menu` ADD  `movil` BOOLEAN NULL ;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE  `menu` ADD  `orden_movil` INT NULL ;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE  `pv_empresas_clientes` CHANGE  `id`  `id` INT( 11 ) NOT NULL AUTO_INCREMENT COMMENT  'textField,0,false';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE  `pv_empresas_clientes` CHANGE  `usuario`  `usuario` VARCHAR( 60 ) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT  'textField,0,false';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE  `pv_empresas_clientes` CHANGE  `empresa`  `empresa` INT( 11 ) NULL DEFAULT NULL COMMENT  'textField,0,false';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE  `pv_empresas_clientes` CHANGE  `fecha`  `fecha` TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT  'dateField';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE  `pv_categorias` CHANGE  `empresa_cliente`  `empresa_cliente` INT( 11 ) NOT NULL COMMENT  'selectBox,pv_empresas_clientes';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE  `pv_categorias` ADD  `tienda_nwscliente` INT NOT NULL COMMENT  'selectBox,pv_empresas_clientes';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE  `pv_categorias` DROP  `empresa_cliente` ;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE  `pv_configuracion_tienda` ADD  `tienda_nwscliente` INT NOT NULL COMMENT  'selectBox,pv_empresas_clientes';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE  `pv_configuracion_tienda` DROP  `empresa_cliente` ;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE  `pv_empresas_clientes` CHANGE  `logo`  `logo` VARCHAR( 100 ) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT  'uploader';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE  `pv_empresas_clientes` CHANGE  `imagen_portada`  `imagen_portada` VARCHAR( 100 ) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT  'uploader';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE  `terminales` ADD  `tienda_nwscliente` INT NOT NULL COMMENT  'selectBox,pv_empresas_clientes';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE  `pv_empresas_descripcion` CHANGE  `id`  `id` INT( 11 ) NOT NULL AUTO_INCREMENT COMMENT  'textField,0,false';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE  `pv_empresas_descripcion` CHANGE  `usuario`  `usuario` VARCHAR( 80 ) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT  'textField,0,false';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE  `pv_empresas_descripcion` CHANGE  `empresa`  `empresa` INT( 11 ) NULL DEFAULT NULL COMMENT  'textField,0,false';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE  `pv_empresas_descripcion` CHANGE  `fecha`  `fecha` TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP COMMENT  'dateField';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE  `pv_empresas_descripcion` CHANGE  `terminal`  `terminal` INT( 11 ) NULL DEFAULT NULL COMMENT  'textField,0,false';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE  `pv_empresas_descripcion` ADD  `tienda_nwscliente` INT NOT NULL COMMENT  'selectBox,pv_empresas_clientes';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE  `pv_empresas_descripcion` DROP  `empresa_cliente` ;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE  `pv_costos_domicilio`
CHANGE  `id`  `id` INT( 11 ) NOT NULL AUTO_INCREMENT COMMENT  'textField,0,false',
CHANGE  `usuario`  `usuario` VARCHAR( 100 ) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL COMMENT  'textField,0,false',
CHANGE  `empresa`  `empresa` INT( 11 ) NOT NULL COMMENT  'textField,0,false',
CHANGE  `terminal`  `terminal` INT( 11 ) NOT NULL COMMENT  'textField,0,false',
CHANGE  `fecha`  `fecha` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP COMMENT  'dateField'
;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE  `pv_costos_domicilio`
ADD  `tienda_nwscliente` INT NOT NULL COMMENT  'selectBox,pv_empresas_clientes'
;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE  `pv_costos_domicilio` DROP  `empresa_cliente` ;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE  `contactos` CHANGE  `nombre_contacto`  `name_contacto` VARCHAR( 200 ) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL COMMENT  'textField';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE  `nc_products_variantes` ADD  `orden` INT NULL COMMENT  'textField';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }





        $sql = "
DROP TABLE pv_clientes_registrados;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE  `nwpconfig` ADD  `nwdual_pagina_offline` VARCHAR( 2 ) NULL COMMENT  'selectBox,array';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE  `nwpconfig` ADD  `logo_movil` VARCHAR( 150 ) NULL COMMENT  'uploader';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE  `galeria_noticias` CHANGE  `otro_dos`  `otro_dos` VARCHAR( 180 ) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT  'textField';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
              ALTER TABLE  `nwforms_enc` ADD  `offline` VARCHAR(2) COMMENT  'selectBox,array';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
              ALTER TABLE  `nwforms_enc` ADD  `version_db` VARCHAR(2)  NULL COMMENT  'textField';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
              ALTER TABLE  `nwforms_enc` ADD  `css_offline` VARCHAR(2)  NULL COMMENT  'textField';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
              ALTER TABLE  `nwforms_enc` ADD  `url_php_sincronizar` VARCHAR(150)  NULL COMMENT  'textField';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
              ALTER TABLE  `nwforms_enc` ADD  `grupo` int(11)  NULL COMMENT  'selectBox,nwforms_grupos';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
CREATE TABLE IF NOT EXISTS `nwforms_grupos` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'textField,0,false',
  `nombre` varchar(100) NOT NULL COMMENT 'textField',
  `orden` int(11) NOT NULL COMMENT 'selectBox,array',
  `id_form` int(11) NOT NULL COMMENT 'selectBox,nwforms_enc',
  `usuario` varchar(90) NOT NULL COMMENT 'textField,0,false',
  `empresa` int(11) NOT NULL COMMENT 'textField,0,false',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE  `nwforms_grupos` CHANGE  `ir_form`  `id_form` INT( 11 ) NOT NULL COMMENT  'selectBox,nwforms_enc';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
            ALTER TABLE  `nwforms_grupos` CHANGE  `nombre`  `nombre` VARCHAR( 100 ) NULL COMMENT  'textField';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
CREATE TABLE IF NOT EXISTS `nc_products_avisame` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'textField,0,false',
  `nombre` varchar(100) NOT NULL COMMENT 'textField',
  `correo` varchar(100) NOT NULL COMMENT 'textField',
  `tipo` varchar(30) NOT NULL COMMENT 'textField,0,false',
  `id_producto` int(11) NOT NULL COMMENT 'selectBox,nc_products',
  `estado` varchar(10) NOT NULL COMMENT 'textField',
  `nombre_producto` varchar(100) NULL COMMENT 'textField',
  `descripcion_producto` TEXT NOT NULL COMMENT 'textArea',
  `referencia` varchar(25) NOT NULL COMMENT 'textField',
  `url` varchar(195) NOT NULL COMMENT 'textField',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
CREATE TABLE IF NOT EXISTS `deptosGeo` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'textField,0,false',
  `nombre` varchar(100) NOT NULL COMMENT 'textField',
  `usuario` varchar(90) NOT NULL COMMENT 'textField,0,false',
  `empresa` int(11) NOT NULL COMMENT 'textField,0,false',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE  `ciudades` CHANGE  `departamento`  `departamento` INT( 11 ) NULL COMMENT  'selectBox,deptosGeo';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
DROP TABLE ciudades_departamentos;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
               ALTER TABLE  `nc_products_variantes` ADD  `nombre_color_text` VARCHAR( 60 ) NULL COMMENT  'textField';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
               ALTER TABLE  `nc_products_variantes` ADD  `unidades_alerta` int( 2 ) NULL COMMENT  'textField';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
            ALTER TABLE  `pv_salidas_det` DROP  `empresa` ;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
            ALTER TABLE  `pv_salidas_det` ADD  `name_producto` VARCHAR( 150 ) NULL COMMENT  'textField';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
            ALTER TABLE  `nwpconfig`
            ADD  `noticias_offline` VARCHAR( 2 ) NULL COMMENT  'selectBox,array',
ADD  `numero_noticias_offline` INT NULL COMMENT  'textField',
ADD  `catalogo_offline` VARCHAR( 2 ) NULL COMMENT  'selectBox,array',
ADD  `numero_catalogo_offline` INT NULL COMMENT  'textField',
ADD  `tienda_offline` VARCHAR( 2 ) NULL COMMENT  'selectBox,array',
ADD  `numero_productos_tienda_offline` INT NULL COMMENT  'textField';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE  `nwpconfig`
ADD  `forms_offline` VARCHAR( 2 ) NULL COMMENT  'selectBox,array',
ADD  `user_session_offline` VARCHAR( 2 ) NULL COMMENT  'selectBox,array';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
            ALTER TABLE  `nc_maps_config` ADD  `id_map_enc` INT NULL COMMENT  'selectBox,nc_maps_enc';
            ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
            ALTER TABLE  `nc_maps_config` ADD  `terminal` INT NULL COMMENT  'textField,0,false';
            ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
            ALTER TABLE  `nc_maps_local` ADD  `terminal` INT NULL COMMENT  'textField,0,false';
            ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
            ALTER TABLE  `nc_maps_local` ADD  `id_map_enc` INT NULL COMMENT  'selectBox,nc_maps_enc';
            ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
            ALTER TABLE  `nc_maps_visitas_virtuales` ADD  `terminal` INT NULL COMMENT  'textField,0,false',
ADD  `id_map_enc` INT NULL COMMENT  'selectBox,nc_maps_enc';
            ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
        ALTER TABLE  `nwpconfig`
        ADD  `menumovil_enwebdepc` VARCHAR( 2 ) NULL COMMENT  'selectBox,array',
ADD  `menumovil_position` VARCHAR( 20 ) NULL COMMENT  'selectBox,array';
            ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }



        $sql = "ALTER TABLE  `nc_products_avisame` CHANGE  `id_producto`  `id_producto` INT( 11 ) NOT NULL COMMENT  'selectBox,pv_productos';";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "ALTER TABLE  `nwp_popup` ADD `modulo`  INT( 11 ) NULL COMMENT  'selectBox,nwp_modulos';";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "ALTER TABLE  `nwp_popup` ADD `usar_modulo`  VARCHAR( 2 ) NULL COMMENT  'selectBox,array';";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
 ALTER TABLE nwp_popup COMMENT ' [
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
                \"name\": \"usar_modulo\",
                \"data\": {
                 \"NO\": \"NO\",
                    \"SI\": \"SI\"
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
        $sql = "ALTER TABLE  `nc_config` ADD `seleccionar_ciudad`  VARCHAR( 2 ) NULL COMMENT  'selectBox,array';";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
RENAME TABLE  `categorias` TO  `noticias_categorias` ;           
";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
            ALTER TABLE  `noticias_config` 
            ADD  `diseno_blog_avanzado` VARCHAR( 2 ) NULL COMMENT  'selectBox,array',
ADD  `mostrar_categorias` VARCHAR( 2 ) NULL COMMENT  'selectBox,array';
";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE  `productos`
ADD  `url_nombre` VARCHAR( 70 ) NULL COMMENT  'textField',
ADD  `title` VARCHAR( 70 ) NULL COMMENT  'textField',
ADD  `Metadescription` VARCHAR( 200 ) NULL COMMENT  'textField',
ADD  `Keywords` VARCHAR( 150 ) NULL COMMENT  'textField'
;
";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE  `noticias`
ADD  `title` VARCHAR( 70 ) NULL COMMENT  'textField',
ADD  `Metadescription` VARCHAR( 200 ) NULL COMMENT  'textField',
ADD  `Keywords` VARCHAR( 150 ) NULL COMMENT  'textField'
;
";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE  `nwforms_enc`
ADD  `offline_usar_consulta` VARCHAR( 2 ) NULL COMMENT  'selectBox,array',
ADD  `offline_tabla_consulta` VARCHAR( 20 ) NULL COMMENT  'textField',
ADD  `offline_campos_tabla_consulta` VARCHAR( 100 ) NULL COMMENT  'textField',
ADD  `url_consulta` VARCHAR( 80 ) NULL COMMENT  'textField';
";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE  `nwanimate_escenas` ADD  `publicado` VARCHAR( 2 ) NULL COMMENT  'selectBox,array';
";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
            ALTER TABLE  `menuprincipal` ADD  `target` VARCHAR( 10 ) NULL COMMENT  'selectBox,array';
";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
CREATE TABLE IF NOT EXISTS `nw_cons_page_design` (
  `id` int(20) unsigned NOT NULL AUTO_INCREMENT COMMENT 'textField,0,false',
  `body` varchar(200) DEFAULT NULL COMMENT 'ckeditor',
  `css` TEXT DEFAULT NULL COMMENT 'textArea',
  `img_background` varchar(150) DEFAULT NULL COMMENT 'uploader',
  `launchDate` DATE DEFAULT NULL COMMENT 'dateField',
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
CREATE TABLE IF NOT EXISTS `nw_cons_page_regist` (
  `id` int(20) unsigned NOT NULL AUTO_INCREMENT COMMENT 'textField,0,false',
  `email` varchar(200) DEFAULT NULL COMMENT 'textField',
  `date` DATE DEFAULT NULL COMMENT 'dateField',
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE  `nwpconfig` ADD  `pagina_en_construccion` VARCHAR( 2 ) NULL COMMENT  'selectBox,array';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
 ALTER TABLE nwpconfig COMMENT '[
{
\"selectBoxArrays\": [
{
\"name\": \"usar_cargando\",
\"data\": {
\"SI\": \"SI\",
\"NO\": \"NO\"
}
},
{
\"name\": \"usar_nwsites\",
\"data\": {
\"SI\": \"SI\",
\"NO\": \"NO\"
}
},
{
\"name\": \"nwdual_pagina_offline\",
\"data\": {
\"SI\": \"SI\",
\"NO\": \"NO\"
}
},
{
\"name\": \"noticias_offline\",
\"data\": {
\"SI\": \"SI\",
\"NO\": \"NO\"
}
},
{
\"name\": \"catalogo_offline\",
\"data\": {
\"SI\": \"SI\",
\"NO\": \"NO\"
}
},
{
\"name\": \"tienda_offline\",
\"data\": {
\"SI\": \"SI\",
\"NO\": \"NO\"
}
},
{
\"name\": \"forms_offline\",
\"data\": {
\"SI\": \"SI\",
\"NO\": \"NO\"
}
},
{
\"name\": \"user_session_offline\",
\"data\": {
\"SI\": \"SI\",
\"NO\": \"NO\"
}
},
{
\"name\": \"menumovil_enwebdepc\",
\"data\": {
\"SI\": \"SI\",
\"NO\": \"NO\"
}
},
{
\"name\": \"menumovil_position\",
\"data\": {
\"left\": \"Left\",
\"right\": \"Right\"
}
},
{
\"name\": \"pagina_en_construccion\",
\"data\": {
\"NO\": \"NO\",
\"SI\": \"SI\"
}
},
{
\"name\": \"position_links_translate\",
\"data\": {
\"HEADER\": \"HEADER\",
\"MENU\": \"MENU\",
\"OUT_OF_PAGE\": \"OUT_OF_PAGE\"
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



        $sql = "
                    ALTER TABLE  `nw_cons_page_regist` CHANGE  `date`  `date` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP COMMENT  'dateField';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
 ALTER TABLE nw_cons_page_design COMMENT ' [
   {
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
 ALTER TABLE  `nw_cons_page_design` ADD  `logo` VARCHAR( 15 ) NOT NULL COMMENT  'uploader' AFTER  `img_background` ,
ADD  `dias` VARCHAR( 15 ) NOT NULL COMMENT  'textField' AFTER  `logo` ,
ADD  `horas` VARCHAR( 15 ) NOT NULL COMMENT  'textField' AFTER  `dias` ,
ADD  `minutos` VARCHAR( 15 ) NOT NULL COMMENT  'textField' AFTER  `horas` ,
ADD  `segundos` VARCHAR( 15 ) NOT NULL COMMENT  'textField' AFTER  `minutos` ;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE  `articles_config` ADD  `tipo` VARCHAR( 10 ) NULL COMMENT  'selectBox,array';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
             ALTER TABLE  `nwforms_respuestas_users`
             ADD  `sync` VARCHAR( 2 ) NULL COMMENT  'selectBox,array',
ADD  `id_session` VARCHAR( 100 ) NULL COMMENT  'textField';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
             ALTER TABLE  `nwforms_respuestas_users_enc`
             ADD  `sync` VARCHAR( 2 ) NULL COMMENT  'selectBox,array',
ADD  `id_session` VARCHAR( 100 ) NULL COMMENT  'textField';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE  `nwforms_respuestas_users` ADD  `fecha_actualizacion` TIMESTAMP NULL COMMENT  'dateField';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
        ALTER TABLE  `nwforms_respuestas_users_enc` ADD  `date_last_sync` TIMESTAMP NULL COMMENT  'dateField';
       ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
        ALTER TABLE  `nwforms_respuestas_users` ADD  `date_last_sync` TIMESTAMP NULL COMMENT  'dateField';
       ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
            ALTER TABLE  `nc_products` ADD  `bodega` INT NULL COMMENT  'selectBox,nc_bodega';
       ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
        ALTER TABLE  `nc_products` ADD  `lote` VARCHAR( 50 ) NULL COMMENT  'textField';
       ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
            ALTER TABLE  `nc_products` ADD  `dateUpdate` TIMESTAMP NULL COMMENT  'dateField';
       ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
CREATE TABLE IF NOT EXISTS `nc_bodegas` (
  `id` int(20) unsigned NOT NULL AUTO_INCREMENT COMMENT 'textField,0,false',
  `nombre` varchar(200) DEFAULT NULL COMMENT 'textField',
  `id_ciudad` int(11) DEFAULT NULL COMMENT 'selectBox,ciudades',
  `fecha` DATE DEFAULT NULL COMMENT 'dateField',
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
ALTER TABLE  `pv_salidas` ADD  `estado_text` VARCHAR( 60 ) NULL COMMENT  'textField';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
       ALTER TABLE  `nwforms_preguntas` ADD  `grupo` INT NULL COMMENT  'selectBox,nwforms_grupos';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
       ALTER TABLE  `pv_configuracion_direcciones` ADD  `aptocasa` VARCHAR( 60 ) NULL COMMENT  'textField';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
       ALTER TABLE  `pv_configuracion_direcciones`
       ADD  `dir_modo` VARCHAR( 25 ) NOT NULL ,
ADD  `dir_xx` VARCHAR( 25 ) NOT NULL ,
ADD  `dir_yy` VARCHAR( 25 ) NOT NULL ,
ADD  `dir_zz` VARCHAR( 25 ) NOT NULL ,
ADD  `dir_city` VARCHAR( 25 ) NOT NULL ;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE  `pv_configuracion_direcciones` ADD  `tienda_id` INT NULL COMMENT  'selectBox,terminales';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
       ALTER TABLE  `terminales` ADD  `activo` VARCHAR( 2 ) NULL COMMENT  'selectBox,array';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
 ALTER TABLE terminales COMMENT '[
{
\"selectBoxArrays\": [
{
\"name\": \"activo\",
\"data\": {
\"SI\": \"SI\",
\"NO\": \"NO\"
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
        $sql = "
 ALTER TABLE  `pv_salidas` ADD  `observaciones_traslado` VARCHAR( 200 ) NULL COMMENT  'textArea';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
            INSERT INTO  `mrdomicilios_nwproject5`.`pv_estados_salidas` (
`id` ,
`nombre` ,
`usuario` ,
`fecha` ,
`empresa`
)
VALUES (
'6',  'Trasladado',  'alexf',
CURRENT_TIMESTAMP ,  '1'
);
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE  `nwforms_preguntas` ADD  `tabla_data` VARCHAR( 65 ) NULL COMMENT  'textField';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE  `nwforms_preguntas` ADD  `tabla_data_si_no` VARCHAR( 2 ) NULL COMMENT  'selectBox,array';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
            ALTER TABLE  `pv_empresas_descripcion` ADD  `descuento_global_porcentaje` VARCHAR( 5 ) NULL COMMENT  'textField';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
            ALTER TABLE  `pv_tiempos_domicilio` CHANGE  `id`  `id` INT( 11 ) NOT NULL AUTO_INCREMENT COMMENT  'textField,0,false';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
            ALTER TABLE  `pv_categorias` CHANGE  `id`  `id` INT( 11 ) NOT NULL AUTO_INCREMENT COMMENT  'textField,0,false';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
            ALTER TABLE  `pv_categorias` CHANGE  `fecha`  `fecha` TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT  'textField,0,false';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
            ALTER TABLE  `pv_categorias` CHANGE  `empresa`  `empresa` INT( 11 ) NOT NULL COMMENT  'textField,0,false';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
            ALTER TABLE  `pv_categorias` CHANGE  `terminal`  `terminal` INT( 11 ) NULL DEFAULT NULL COMMENT  'textField,0,false';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
            ALTER TABLE  `pv_categorias` CHANGE  `usuario`  `usuario` VARCHAR( 50 ) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL COMMENT  'textField,0,false';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
            ALTER TABLE  `pv_categorias` CHANGE  `mostrar_producto`  `mostrar_producto` VARCHAR( 2 ) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT  'selectBox,array';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
 ALTER TABLE pv_categorias COMMENT '[
{
\"selectBoxArrays\": [
{
\"name\": \"mostrar_producto\",
\"data\": {
\"SI\": \"SI\",
\"NO\": \"NO\"
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
        $sql = "
ALTER TABLE  `pv_categorias` CHANGE  `color_fondo`  `color_fondo` VARCHAR( 50 ) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT  'colorButton';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
            ALTER TABLE  `pv_categorias` CHANGE  `tienda_nwscliente`  `tienda_nwscliente` INT( 11 ) NOT NULL COMMENT  'selectBox,pv_empresas_clientes';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
            ALTER TABLE  `pv_tiempos_domicilio` CHANGE  `usuario`  `usuario` VARCHAR( 80 ) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT  'textField,0,false';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
            ALTER TABLE  `pv_tiempos_domicilio` CHANGE  `fecha`  `fecha` TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT  'textField,0,false';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
            ALTER TABLE  `pv_tiempos_domicilio` CHANGE  `empresa`  `empresa` INT( 11 ) NULL DEFAULT NULL COMMENT  'textField,0,false';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
            ALTER TABLE  `pv_horarios_tiendas_grupos` CHANGE  `empresa_cliente`  `empresa_cliente` INT( 11 ) NULL DEFAULT NULL COMMENT  'selectBox,pv_empresas_clientes';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
            ALTER TABLE  `pv_anular` CHANGE  `id`  `id` INT( 11 ) NOT NULL AUTO_INCREMENT COMMENT  'textField,0,false';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
            ALTER TABLE `nc_config` ADD `showHome` VARCHAR(2) NOT NULL AFTER `activo`;
            ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }


        $sql = "ALTER TABLE `pv_salidas` CHANGE `cedula` `cedula` DOUBLE NULL DEFAULT NULL COMMENT 'textField';";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }


        $sql = "
ALTER TABLE `yahoo` ENGINE=InnoDB;
ALTER TABLE `visitas` ENGINE=InnoDB;
ALTER TABLE `tamano_centro` ENGINE=InnoDB;
ALTER TABLE `st_usuarios` ENGINE=InnoDB;
ALTER TABLE `sitemaps` ENGINE=InnoDB;
ALTER TABLE `seo_facebook` ENGINE=InnoDB;
ALTER TABLE `seguridad` ENGINE=InnoDB;
ALTER TABLE `secciones` ENGINE=InnoDB;
ALTER TABLE `seccion_ciudades` ENGINE=InnoDB;
ALTER TABLE `restringidas` ENGINE=InnoDB;
ALTER TABLE `quantcast` ENGINE=InnoDB;
ALTER TABLE `pv_productos` ENGINE=InnoDB;
ALTER TABLE `pv_empresas_clientes` ENGINE=InnoDB;
ALTER TABLE `pv_clientes` ENGINE=InnoDB;
ALTER TABLE `productos_imagenes` ENGINE=InnoDB;
ALTER TABLE `productos_grupos` ENGINE=InnoDB;
ALTER TABLE `productos_config` ENGINE=InnoDB;
ALTER TABLE `productos` ENGINE=InnoDB;
ALTER TABLE `portafolio` ENGINE=InnoDB;
ALTER TABLE `paginas` ENGINE=InnoDB;
ALTER TABLE `objetos` ENGINE=InnoDB;
ALTER TABLE `nwproject_initial` ENGINE=InnoDB;
ALTER TABLE `nwp_modulos` ENGINE=InnoDB;
ALTER TABLE `nwmaker_login_profesiones` ENGINE=InnoDB;
ALTER TABLE `nw_rutas_url` ENGINE=InnoDB;
ALTER TABLE `noticias_categorias` ENGINE=InnoDB;
ALTER TABLE `noticias` ENGINE=InnoDB;
ALTER TABLE `nc_vote` ENGINE=InnoDB;
ALTER TABLE `nc_sites_perfil_options_values` ENGINE=InnoDB;
ALTER TABLE `nc_sites_perfil_options` ENGINE=InnoDB;
ALTER TABLE `nc_sites_config_registro` ENGINE=InnoDB;
ALTER TABLE `nc_products` ENGINE=InnoDB;
ALTER TABLE `nc_popup` ENGINE=InnoDB;
ALTER TABLE `nc_orders_prod` ENGINE=InnoDB;
ALTER TABLE `nc_manufacturers` ENGINE=InnoDB;
ALTER TABLE `nc_local_configuracion` ENGINE=InnoDB;
ALTER TABLE `nc_local_comments` ENGINE=InnoDB;
ALTER TABLE `nc_local_banners` ENGINE=InnoDB;
ALTER TABLE `nc_ip` ENGINE=InnoDB;
ALTER TABLE `nc_img_config` ENGINE=InnoDB;
ALTER TABLE `nc_images` ENGINE=InnoDB;
ALTER TABLE `nc_comments` ENGINE=InnoDB;
ALTER TABLE `nc_banner` ENGINE=InnoDB;
ALTER TABLE `menuprincipal` ENGINE=InnoDB;
ALTER TABLE `login` ENGINE=InnoDB;
ALTER TABLE `links` ENGINE=InnoDB;
ALTER TABLE `letra` ENGINE=InnoDB;
ALTER TABLE `lenguajes` ENGINE=InnoDB;
ALTER TABLE `insertar` ENGINE=InnoDB;
ALTER TABLE `imagenes_aleatorias` ENGINE=InnoDB;
ALTER TABLE `imagenes` ENGINE=InnoDB;
ALTER TABLE `idiomas` ENGINE=InnoDB;
ALTER TABLE `id_serial` ENGINE=InnoDB;
ALTER TABLE `id_cliente` ENGINE=InnoDB;
ALTER TABLE `google` ENGINE=InnoDB;
ALTER TABLE `geo` ENGINE=InnoDB;
ALTER TABLE `galeria_noticias_config` ENGINE=InnoDB;
ALTER TABLE `galeria_noticias` ENGINE=InnoDB;
ALTER TABLE `footer` ENGINE=InnoDB;
ALTER TABLE `errores` ENGINE=InnoDB;
ALTER TABLE `dublin_core` ENGINE=InnoDB;
ALTER TABLE `correos` ENGINE=InnoDB;
ALTER TABLE `contactos` ENGINE=InnoDB;
ALTER TABLE `con_usuarios` ENGINE=InnoDB;
ALTER TABLE `comentarios` ENGINE=InnoDB;
ALTER TABLE `colores` ENGINE=InnoDB;
ALTER TABLE `ciudades` ENGINE=InnoDB;
ALTER TABLE `categorias_noticias` ENGINE=InnoDB;
ALTER TABLE `canonical` ENGINE=InnoDB;
ALTER TABLE `bing` ENGINE=InnoDB;
ALTER TABLE `analythics` ENGINE=InnoDB;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }



        $sql = "
ALTER TABLE empresas ADD COLUMN id_text_nw character varying(100);  
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }



        $sql = "
ALTER TABLE empresas ADD COLUMN id_nw integer   
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
     ALTER TABLE `nwpconfig` ADD `usar_traductor` VARCHAR(2) NULL COMMENT 'selectBox,boolean';
";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
     ALTER TABLE `nwpconfig` ADD `position_links_translate` VARCHAR(20) NULL COMMENT 'selectBox,array';
";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
            ALTER TABLE  `idiomas` ADD  `principal` VARCHAR( 2 ) NULL COMMENT  'selectBox,boolean'
";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
                ALTER TABLE `nwmaker_forms_preguntas` ADD `data` CHAR(50) NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
         ALTER TABLE `nwmaker_forms_preguntas` ADD `usuario` VARCHAR(100) NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
ALTER TABLE `nwforms_respuestas_users_enc` ADD `url` VARCHAR(120) NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "ALTER TABLE `nwforms_preguntas` CHANGE `id_enc` `id_enc` VARCHAR(60) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL, CHANGE `texto_ayuda` `texto_ayuda` VARCHAR(60) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL;";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }


        $sql = "
ALTER TABLE `nwforms_grupos` CHANGE `nombre` `nombre` TEXT CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT 'textField';
                ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
            ALTER TABLE `nwanimate_objetos` CHANGE `capa` `capa` INT(11) NULL COMMENT 'textField';
                ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `nwanimate_objetos` CHANGE `capa` `capa` INT(11) NULL DEFAULT '0' COMMENT 'textField';
                ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `nwforms_enc` 
ADD `activar_reCAPTCHA` VARCHAR(2) NULL, 
ADD `sitekey_reCAPTCHA` VARCHAR(60) NULL, 
ADD `secretKey_reCAPTCHA` VARCHAR(60) NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }




        $sql = "
ALTER TABLE `nwforms_autocontestador` ADD `responder_a_email` VARCHAR(120) NULL, ADD `responder_a_nombre` VARCHAR(120) NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `nwforms_autocontestador` ADD `asunto` VARCHAR(100) NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `nwforms_enc` ADD `funcion_submit_final` VARCHAR(90) NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }


        $sql = "
ALTER TABLE `nwforms_autocontestador` ADD `responder_a_email` VARCHAR(120) NOT NULL AFTER `usuario`;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `nwforms_autocontestador` ADD `responder_a_nombre` VARCHAR(120) NOT NULL AFTER `responder_a_email`;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `nwforms_autocontestador` ADD `asunto` VARCHAR(100) NOT NULL AFTER `responder_a_nombre`;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }



        $sql = "
            ALTER TABLE `nwforms_preguntas` 
            CHANGE `nombre` `nombre` TEXT CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL, 
            CHANGE `texto_ayuda` `texto_ayuda` TEXT CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL, 
            CHANGE `requerido` `requerido` VARCHAR(60) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL, 
            CHANGE `orden` `orden` INT(11) NULL;
                ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
CREATE TABLE IF NOT EXISTS `nc_emails_copy` (
  `id` int(20) NOT NULL AUTO_INCREMENT COMMENT 'textField,0,false',
  `email` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
ALTER TABLE `deptosGeo` ADD `pais` INT NULL COMMENT 'selectBox,paises';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
ALTER TABLE `nc_products` ADD `fecha_final_nueva_coleccion` DATE NULL COMMENT 'dateField';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `nc_products` ADD `desc_porcentaje` VARCHAR(2) NULL COMMENT 'selectBox,boolean' AFTER `fecha_final_nueva_coleccion`, ADD `valor_descuento` DOUBLE NULL AFTER `desc_porcentaje`;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `pv_salidas` ADD `numero_guia_envio` VARCHAR(50) NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `pv_salidas` 
ADD `pais_text` VARCHAR(80) NULL,
ADD `departamento_text` VARCHAR(80) NULL,
ADD `ciudad_text` VARCHAR(80) NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `nc_filtros_productos` CHANGE `filtro_cat_id` `filtro_cat_id` INT(11) NULL DEFAULT NULL COMMENT 'selectBox,nc_filtros_cat';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }


        $sql = "
ALTER TABLE `nc_baskets` ADD `referencia` VARCHAR(25) NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
ALTER TABLE `paginas` CHANGE `terminal` `terminal` INT(11) NOT NULL COMMENT 'selectBox,terminales,true,true';
";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "CREATE TABLE `google_seo` ( `id` SERIAL NOT NULL AUTO_INCREMENT , `valor` TEXT NOT NULL , `tipo` VARCHAR(100) NOT NULL , PRIMARY KEY (`id`)) ENGINE = InnoDB;";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "ALTER TABLE `google_seo` ADD `valor_uno` TEXT NOT NULL AFTER `valor`;";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "ALTER TABLE `google_seo` ADD `valor_dos` TEXT NOT NULL AFTER `valor_uno`;";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "ALTER TABLE `google_seo` ADD `valor_tres` TEXT NOT NULL AFTER `valor_dos`;";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "ALTER TABLE `google_seo` ADD `valor_cuatro` TEXT NOT NULL AFTER `valor_tres`;";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "ALTER TABLE `analythics` CHANGE `texto` `texto` TEXT CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL COMMENT 'textArea';";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "ALTER TABLE `idiomas` ADD COLUMN `hreflang` VARCHAR(5) NULL AFTER `nombre`;";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "ALTER TABLE `idiomas` ADD `charset` VARCHAR(10) NOT NULL AFTER `nombre`;";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
//        $sql = "ALTER TABLE `idiomas` CHANGE COLUMN `hreflang` `hreflang` VARCHAR(5) NULL, 
//            ADD UNIQUE INDEX `hreflang_UNIQUE` (`hreflang` ASC); ";
//        $ca->prepare($sql);
//        if (!$ca->exec()) {
//            master::logSystemError($ca->lastErrorText());
//        }
        $sql = "ALTER TABLE `idiomas` CHANGE COLUMN `hreflang` `hreflang` VARCHAR(5) NULL; ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "ALTER TABLE `idiomas` ADD `hreflang_alter` VARCHAR(20) NOT NULL AFTER `hreflang`;";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "ALTER TABLE `idiomas` ADD COLUMN `charset` VARCHAR(20) NULL;";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "ALTER TABLE `idiomas` ADD COLUMN `hreflang_alter` VARCHAR(20) NULL;";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "ALTER TABLE `paginas` CHANGE `idioma` `idioma` INT(11) NULL DEFAULT NULL COMMENT 'selectBox,idiomas,true,true,0,0,true';";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "ALTER TABLE `idiomas` ADD `icon` TEXT NOT NULL COMMENT 'uploader' AFTER `nombre`;";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "ALTER TABLE `geo` ADD `idioma` INT NOT NULL COMMENT 'selectBox,idiomas,true,true,0,0,true' AFTER `region`;";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "ALTER TABLE `idiomas` CHANGE `hreflang_alter` `hreflang_alter` VARCHAR(20) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL COMMENT 'textField,0,true,false,0,Lenguaje y país (en-GK)';";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "ALTER TABLE `idiomas` CHANGE `hreflang` `hreflang` VARCHAR(5) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT 'textField,0,true,true,0,Lenguaje (en)';";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }


        $sql = "
ALTER TABLE `paginas` ADD `use_nwmakerlib` VARCHAR(2) NULL COMMENT 'selectBox,boolean';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `paginas` ADD `use_module_nwmaker` VARCHAR(2) NULL COMMENT 'selectBox,boolean';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }


        $sql = "
            ALTER TABLE `seo_facebook` ADD `page_id` VARCHAR(50) NOT NULL AFTER `texto`;
                ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }






        $sql = "
            ALTER TABLE `nwpconfig` 
            ADD `crear_manifest_auto` CHAR(2) NULL, 
            ADD `name_manifest` VARCHAR(100) NULL, 
            ADD `manifest_description` VARCHAR(100) NULL, 
            ADD `manifest_nw_icon_32` VARCHAR(100) NULL, 
            ADD `manifest_nw_icon_192` VARCHAR(100) NULL, 
            ADD `manifest_nw_icon_512` VARCHAR(100) NULL, 
            ADD `manifest_start_url` VARCHAR(70) NULL, 
            ADD `manifest_theme_color` VARCHAR(15) NULL, 
            ADD `manifest_background_color` VARCHAR(15) NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
ALTER TABLE `paginas` ADD COLUMN `fecha_modificacion` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
ALTER TABLE `paginas` CHANGE COLUMN `fecha_ingreso` `fecha_ingreso` TIMESTAMP NULL COMMENT 'dateField' ;

  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
ALTER TABLE `nw_registro` ADD COLUMN `host` VARCHAR(100) NULL AFTER `empresa`;

  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
 ALTER TABLE `nwforms_respuestas_users` 
 ADD `id_pregunta` INT NULL, 
 ADD `typeData` VARCHAR(50) NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `nwforms_respuestas_users` 
ADD `name_submit` VARCHAR(100) NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
//        $sql = "
//ALTER TABLE `nwforms_respuestas_users_enc` 
//ADD `nombre` VARCHAR(100) NULL, 
//ADD `calificacion_general` CHAR(10) NULL;
//  ";
//        $ca->prepare($sql);
//        if (!$ca->exec()) {
//            master::logSystemError($ca->lastErrorText());
//        }
        $sql = "
ALTER TABLE `nwforms_preguntas` 
ADD `rev_orden` INT NULL, 
ADD `rev_label` VARCHAR(100) NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `nwforms_respuestas_users` 
ADD `rev_orden` INT NULL, 
ADD `rev_label` VARCHAR(100) NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `nwforms_preguntas` ADD `rev_visible` CHAR(2) NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `nwforms_preguntas` ADD `rev_bloqueperfil` CHAR(2) NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "ALTER TABLE `google_seo` ADD COLUMN `valor_cinco` TEXT NULL;  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "ALTER TABLE `google_seo` ADD COLUMN `valor_seis` TEXT NULL;  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = " ALTER TABLE `google_seo` ADD COLUMN `valor_siete` TEXT NULL;   ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = " ALTER TABLE google_seo ADD COLUMN pagina INT NULL DEFAULT 0;  ";
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
            ALTER TABLE `articles_config` ADD `orden` CHAR(20) NULL AFTER `tipo_numero`;
            ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
            ALTER TABLE `perfiles`  ADD COLUMN `tipo` VARCHAR(100) NULL AFTER `empresa`;
            ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        
        $sql = "
            CREATE TABLE `preload_images` (
              `id` int NOT NULL AUTO_INCREMENT,
              `nombre` varchar(100) DEFAULT NULL,
              `fecha` date DEFAULT NULL,
              `usuario` varchar(45) DEFAULT NULL,
              PRIMARY KEY (`id`),
              UNIQUE KEY `id_UNIQUE` (`id`)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
            ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        
        $sql = "ALTER TABLE `preload_images` ADD COLUMN `pagina` INT NULL AFTER `usuario`;";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "ALTER TABLE `productos_config` CHANGE COLUMN `mostrar_titulos_categs` `mostrar_titulos_categs` VARCHAR(2) NULL DEFAULT NULL COMMENT 'selectBox,boolean' ;";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        
        $sql = "ALTER TABLE `productos_config` CHANGE COLUMN `mostrar_productos_y_categs_por_categs` `mostrar_productos_y_categs_por_categs` VARCHAR(2) NULL DEFAULT NULL COMMENT 'selectBox,boolean' ;";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        return true;
    }

}
