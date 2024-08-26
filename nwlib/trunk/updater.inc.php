<?php

/* * ***********************************************************************

  Copyright:
  2013 Netwoods.net, http://www.netwoods.net

  Author:
  Andrés Flórez

 * *********************************************************************** */

class qxnw_updater {

    public static function load() {
        $d = include 'user_bienvenido.php';
//    $d = "hola";
        return $d;
    }

    public static function updateVersionDb($p) {
        session::check();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $ca->setPregMatchDuplicate(false);

        //TEST FUNCIONES:
        $sql = "
CREATE OR REPLACE FUNCTION public.func_concepto (
  p_parameter integer,
  p_table varchar,
  p_field varchar
)
RETURNS varchar AS
\$body$
DECLARE
  vnombre TEXT;
  VSQL TEXT;
BEGIN
  IF p_parameter IS NULL THEN
      RETURN NULL;
  END IF;
  IF p_field IS NULL THEN
  	RETURN func_concepto(p_parameter, p_table);
  END IF;  
  VSQL = 'SELECT SUBSTR(';
  VSQL = VSQL || p_field;
  VSQL = VSQL || ', 1, 1000)';
  VSQL = VSQL || ' FROM public.';
  VSQL = VSQL || p_table;
  VSQL = VSQL || ' WHERE id=';
  VSQL = VSQL || p_parameter;
  EXECUTE VSQL INTO vnombre;
  IF vnombre IS NOT NULL THEN
      RETURN vnombre;
  ELSE
      RETURN null;
  END IF;
END;
\$body$
LANGUAGE 'plpgsql'
VOLATILE
CALLED ON NULL INPUT
SECURITY INVOKER
COST 100;";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
ALTER TABLE public.modulos
  ADD COLUMN grupo INTEGER;

COMMENT ON COLUMN public.modulos.grupo
IS 'selectBox,nw_modulos_grupos';";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE public.modulos
  ADD COLUMN clase VARCHAR(100);

COMMENT ON COLUMN public.modulos.clase
IS 'textField';";
        $ca->prepare($sql);
        $sql = "
ALTER TABLE public.modulos
  ADD COLUMN clase VARCHAR(100);";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "CREATE TABLE public.nc_config (
  id SERIAL, 
  apikey VARCHAR(150), 
  apiLogin VARCHAR(150), 
  pagos_merchantId VARCHAR(150), 
  pagos_accountId VARCHAR(150), 
  pagos_pruebas VARCHAR(150), 
  valor_min_enviofree DOUBLE PRECISION, 
  payu_sandbox VARCHAR(150), 
  solo_validar VARCHAR(150), 
  CONSTRAINT nc_config_pkey PRIMARY KEY(id)
) WITHOUT OIDS;";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE public.ciudades
  ADD COLUMN pais integer;
  
COMMENT ON COLUMN public.ciudades.pais
IS 'selectBox,paises';";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
CREATE TABLE IF NOT EXISTS nwmaker_users_info_aditional(
    id SERIAL NOT NULL AUTO_INCREMENT COMMENT 'textField,0,false',
    usuario varchar(100) DEFAULT NULL,
    type_register varchar(20) DEFAULT NULL,
    id_relation_user_extern varchar(35) DEFAULT NULL,
    fecha timestamp NULL DEFAULT NULL COMMENT 'date',
    PRIMARY KEY (id),
    UNIQUE KEY id (id)) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT= 1 ;";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE public.modulos
  ADD COLUMN iconos_home TEXT;

COMMENT ON COLUMN public.modulos.iconos_home
IS 'uploader';";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE public.nw_registro
  ADD COLUMN empresa INTEGER;";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE public.nw_design
  ADD COLUMN color_mas_usados VARCHAR(50);";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE public.nw_design
  ADD COLUMN color_noticias VARCHAR(50);";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE public.nw_design
  ADD COLUMN color_muro VARCHAR(50);";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE public.nw_design
  ADD COLUMN color_soporte VARCHAR(50);";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE public.nw_design
  ADD COLUMN mostrar_cumpleanios VARCHAR(2);";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE public.nw_design
  ADD COLUMN mostrar_noticiasnw VARCHAR(2);";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE public.nw_design
  ADD COLUMN mostrar_muro VARCHAR(200);";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
ALTER TABLE public.usuarios
  ADD COLUMN documento VARCHAR(50);";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
ALTER TABLE public.usuarios
  ADD COLUMN cambio_clave INTEGER;";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE public.usuarios
  ADD COLUMN fecha_nacimiento DATE;";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
ALTER TABLE public.nw_init_settings
  ADD COLUMN fondo_bienvenida TEXT;";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE public.nw_modulos_home
  ADD COLUMN columna VARCHAR(10);";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE public.nw_modulos_home
  ADD COLUMN ancho VARCHAR(10);";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE public.nw_modulos_home
  ADD COLUMN alto VARCHAR(10);";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE public.nw_modulos_home
  ADD COLUMN orden VARCHAR(10);";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE public.nw_drive_files
  ADD COLUMN compartir VARCHAR(10);";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE public.nw_drive_folders
  ADD COLUMN compartir VARCHAR(20);";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE public.nw_drive_folders
  ADD COLUMN compartir_value VARCHAR(50);";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE public.nw_drive_folders
  ADD COLUMN favorito VARCHAR(2);";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE public.nw_modulos_home
  ADD COLUMN scrolling VARCHAR(10);";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE public.nw_modulos_home
  ADD COLUMN float VARCHAR(10);";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE public.nw_modulos_home
  ADD COLUMN activo VARCHAR(10);";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE public.nw_modulos_home
  ADD COLUMN frame_si_no VARCHAR(10);";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
COMMENT ON COLUMN public.nw_init_settings.fondo_bienvenida
IS 'uploader';";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE public.nw_init_settings
  ADD COLUMN empresa INTEGER;";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
ALTER TABLE public.permisos
  ADD COLUMN pariente INTEGER;";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE public.permisos
  ADD COLUMN terminal BOOLEAN;";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE public.permisos
  ADD COLUMN imprimir BOOLEAN;";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE public.permisos
  ADD COLUMN enviar_correo BOOLEAN;";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE public.permisos
  ADD COLUMN exportar BOOLEAN;";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE public.permisos
  ADD COLUMN importar BOOLEAN;";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE public.permisos
  ADD COLUMN columnas_ocultas BOOLEAN;";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE public.permisos
  ADD COLUMN imprimir BOOLEAN;";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
CREATE TABLE  IF NOT EXISTS nw_modulos_grupos (
    id integer NOT NULL,
    nombre character varying(100),
    empresa integer,
    usuario character varying(30),
    fecha date,
    parte character varying(30),
    icono character varying(100),
    pariente integer,
    modulo integer,
    orden integer
);
ALTER TABLE public.nw_modulos_grupos OWNER TO andresf;
COMMENT ON COLUMN nw_modulos_grupos.id IS 'textField,0,false';
COMMENT ON COLUMN nw_modulos_grupos.nombre IS 'textField';
COMMENT ON COLUMN nw_modulos_grupos.empresa IS 'textField,0,false';
COMMENT ON COLUMN nw_modulos_grupos.usuario IS 'textField,0,false';
COMMENT ON COLUMN nw_modulos_grupos.fecha IS 'textField,0,false';
COMMENT ON COLUMN nw_modulos_grupos.parte IS 'textField,0,true,true,string';
COMMENT ON COLUMN nw_modulos_grupos.icono IS 'uploader';
COMMENT ON COLUMN nw_modulos_grupos.pariente IS 'selectBox,nw_modulos_grupos';

CREATE SEQUENCE nw_modulos_grupos_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER TABLE public.nw_modulos_grupos_id_seq OWNER TO andresf;
ALTER SEQUENCE nw_modulos_grupos_id_seq OWNED BY nw_modulos_grupos.id;
ALTER TABLE ONLY nw_modulos_grupos ALTER COLUMN id SET DEFAULT nextval('nw_modulos_grupos_id_seq'::regclass);
ALTER TABLE ONLY nw_modulos_grupos ADD CONSTRAINT nw_modulos_grupos_pkey PRIMARY KEY (id);
;";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE public.nw_modulos_grupos
  ADD COLUMN pariente INTEGER;";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE public.nw_modulos_grupos
  ADD COLUMN icono VARCHAR(100);";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE public.nw_modulos_home
  ADD COLUMN orden INTEGER;";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE public.terminales
  ALTER COLUMN plan TYPE VARCHAR(100) COLLATE pg_catalog.'default';";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE public.empresas
  ALTER COLUMN plan TYPE VARCHAR(100) COLLATE pg_catalog.'default';";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
COMMENT ON COLUMN public.nw_init_settings.empresa
IS 'textField,0,false';";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }


        $sql = "
COMMENT ON COLUMN public.nw_init_settings.fecha
IS 'textField,0,false';";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
ALTER TABLE public.nw_init_settings
  ALTER COLUMN fecha TYPE TIMESTAMP(0) WITHOUT TIME ZONE;";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
  COMMENT ON COLUMN public.nw_init_settings.usuario
IS 'textField,0,false';";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
  COMMENT ON COLUMN public.nw_design.mostrar_cumpleanios
IS 'selectBox,boolean';";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
  COMMENT ON COLUMN public.nw_design.mostrar_noticiasnw
IS 'selectBox,boolean';";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
ALTER TABLE public.nw_modulos_grupos
  ADD COLUMN parte VARCHAR(30);";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

//        $sql = "
//COMMENT ON COLUMN public.nw_modulos_grupos.parte
//IS 'textField,0,true,true,string';";
//        $ca->prepare($sql);
//        if (!$ca->exec()) {
//            master::logSystemError($ca->lastErrorText());
//        }
        $sql = "
COMMENT ON COLUMN public.nw_modulos_grupos.parte
IS 'textField';";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
CREATE TABLE IF NOT EXISTS public.nw_version (
  id SERIAL, 
  version NUMERIC, 
  fecha TIMESTAMP WITHOUT TIME ZONE, 
  PRIMARY KEY(id)
) WITHOUT OIDS;";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
CREATE TABLE IF NOT EXISTS public.nw_downloads (
  id SERIAL, 
  file_name VTEXT, 
  path TEXT, 
  clave VARCHAR(20), 
  parte VARCHAR(50), 
  fecha_creacion DATE, 
  usuario VARCHAR(30), 
  PRIMARY KEY(id)
) WITHOUT OIDS;";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
 CREATE TABLE IF NOT EXISTS public.nw_read_user (
  id SERIAL, 
  visitas INTEGER, 
  modulo INTEGER, 
  fecha TIMESTAMP WITHOUT TIME ZONE, 
  usuario VARCHAR(80), 
  empresa INTEGER, 
  CONSTRAINT nw_read_user_pkey PRIMARY KEY(id)
) WITHOUT OIDS;";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
CREATE TABLE IF NOT EXISTS public.nw_smtp (
  id SERIAL, 
  host VARCHAR(100), 
  debug INTEGER, 
  auth BOOLEAN, 
  smtp_secure VARCHAR(10), 
  port INTEGER, 
  username VARCHAR(50), 
  pass VARCHAR(50), 
  usuario VARCHAR(30), 
  fecha TIMESTAMP WITHOUT TIME ZONE, 
  sended_from VARCHAR(50), 
  CONSTRAINT nw_smtp_pkey PRIMARY KEY(id)
) WITHOUT OIDS;

COMMENT ON COLUMN public.nw_smtp.id
IS 'textField,0,false';

COMMENT ON COLUMN public.nw_smtp.host
IS 'textField';

COMMENT ON COLUMN public.nw_smtp.debug
IS 'spinner';

COMMENT ON COLUMN public.nw_smtp.auth
IS 'checkbox';

COMMENT ON COLUMN public.nw_smtp.smtp_secure
IS 'textField';

COMMENT ON COLUMN public.nw_smtp.port
IS 'spinner';

COMMENT ON COLUMN public.nw_smtp.username
IS 'textField';

COMMENT ON COLUMN public.nw_smtp.pass
IS 'textField';

COMMENT ON COLUMN public.nw_smtp.usuario
IS 'textField,0,false';

COMMENT ON COLUMN public.nw_smtp.fecha
IS 'textField,0,false';

COMMENT ON COLUMN public.nw_smtp.sended_from
IS 'textField';";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
 CREATE TABLE  IF NOT EXISTS public.nw_design (
  id SERIAL, 
  fecha DATE, 
  fondo_gral_left VARCHAR(50), 
  color_letra VARCHAR(50), 
  fond_buttons VARCHAR(50), 
  color_fond_buttons VARCHAR(50), 
  color_letra_buttons VARCHAR(50), 
  fondo_modulo_uno VARCHAR(50), 
  color_letra_modulo_uno VARCHAR(50), 
  mostrar_menu_superior VARCHAR(2), 
  fondo_modulo_dos VARCHAR(50), 
  color_letra_modulo_dos VARCHAR(50), 
  fondo_modulo_tres VARCHAR(50), 
  color_letra_modulo_tres VARCHAR(50), 
  mostrar_mensaje_inbox VARCHAR(2), 
  mostrar_notificaciones VARCHAR(2), 
  mostrar_notas VARCHAR(2), 
  mostrar_tareas VARCHAR(2), 
  mostrar_usuarios VARCHAR(2), 
  mostrar_favoritos VARCHAR(2), 
  mostrar_especiales VARCHAR(2), 
  mostrar_chat VARCHAR(2), 
  usar_segunda_vista VARCHAR(2), 
  color_fond_buttons_indicadores VARCHAR(50), 
  buttons_menu_radius VARCHAR(5), 
  buttons_menu_margins VARCHAR(5), 
  fond_body VARCHAR(50), 
  usuario VARCHAR(50), 
  empresa INTEGER, 
  activo VARCHAR(2), 
  iconos_generales VARCHAR(50), 
  mostrar_generales VARCHAR(2), 
  CONSTRAINT nw_design_pkey PRIMARY KEY(id)
) WITHOUT OIDS;

COMMENT ON COLUMN public.nw_design.id
IS 'textField,0,false';

COMMENT ON COLUMN public.nw_design.fecha
IS 'dateField';

COMMENT ON COLUMN public.nw_design.fondo_gral_left
IS 'textField';

COMMENT ON COLUMN public.nw_design.color_letra
IS 'textField';

COMMENT ON COLUMN public.nw_design.fond_buttons
IS 'textField';

COMMENT ON COLUMN public.nw_design.color_fond_buttons
IS 'textField';

COMMENT ON COLUMN public.nw_design.color_letra_buttons
IS 'textField';

COMMENT ON COLUMN public.nw_design.fondo_modulo_uno
IS 'textField';

COMMENT ON COLUMN public.nw_design.color_letra_modulo_uno
IS 'textField';

COMMENT ON COLUMN public.nw_design.mostrar_menu_superior
IS 'selectBox,boolean,true';

COMMENT ON COLUMN public.nw_design.fondo_modulo_dos
IS 'textField';

COMMENT ON COLUMN public.nw_design.color_letra_modulo_dos
IS 'textField';

COMMENT ON COLUMN public.nw_design.fondo_modulo_tres
IS 'textField';

COMMENT ON COLUMN public.nw_design.color_letra_modulo_tres
IS 'textField';

COMMENT ON COLUMN public.nw_design.mostrar_mensaje_inbox
IS 'selectBox,boolean';

COMMENT ON COLUMN public.nw_design.mostrar_notificaciones
IS 'selectBox,boolean';

COMMENT ON COLUMN public.nw_design.mostrar_notas
IS 'selectBox,boolean';

COMMENT ON COLUMN public.nw_design.mostrar_tareas
IS 'selectBox,boolean';

COMMENT ON COLUMN public.nw_design.mostrar_usuarios
IS 'selectBox,boolean';

COMMENT ON COLUMN public.nw_design.mostrar_favoritos
IS 'selectBox,boolean';

COMMENT ON COLUMN public.nw_design.mostrar_especiales
IS 'selectBox,boolean';

COMMENT ON COLUMN public.nw_design.mostrar_chat
IS 'selectBox,boolean';

COMMENT ON COLUMN public.nw_design.usar_segunda_vista
IS 'selectBox,boolean';

COMMENT ON COLUMN public.nw_design.color_fond_buttons_indicadores
IS 'textField';

COMMENT ON COLUMN public.nw_design.buttons_menu_radius
IS 'spinner';

COMMENT ON COLUMN public.nw_design.buttons_menu_margins
IS 'spinner';

COMMENT ON COLUMN public.nw_design.fond_body
IS 'textField';

COMMENT ON COLUMN public.nw_design.usuario
IS 'textField,0,false';

COMMENT ON COLUMN public.nw_design.empresa
IS 'textField,0,false';

COMMENT ON COLUMN public.nw_design.activo
IS 'selectBox,boolean';

COMMENT ON COLUMN public.nw_design.iconos_generales
IS 'uploader';

COMMENT ON COLUMN public.nw_design.mostrar_generales
IS 'selectBox,boolean';";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
-- USUARIOS SETTINGS

ALTER TABLE public.usuarios
  ADD COLUMN apellido VARCHAR(100);";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
ALTER TABLE public.usuarios
  ADD COLUMN documento VARCHAR(100);";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
ALTER TABLE public.empresa
  ADD COLUMN empresa INTEGER;";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE public.usuarios
  ADD COLUMN foto text;";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }


        $sql = "
COMMENT ON COLUMN public.usuarios.apellido
IS 'textField';";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

//-- NW FAVORITES
        $sql = "
CREATE TABLE IF NOT EXISTS public.nw_favoritos (
  id SERIAL, 
  modulo INTEGER, 
  usuario VARCHAR(60), 
  empresa INTEGER, 
  CONSTRAINT nw_favoritos_pkey PRIMARY KEY(id)
) WITHOUT OIDS;";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
CREATE TABLE IF NOT EXISTS nw_modulos_home (
    id SERIAL,
    nombre character varying(60),
    url_php character varying(100),
    fecha timestamp without time zone,
    usuario character varying(60),
    empresa integer,
    perfil integer
);";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
    CREATE TABLE IF NOT EXISTS nwtaks_publications (
  id SERIAL, 
  fecha TIMESTAMP WITHOUT TIME ZONE, 
  comentario TEXT, 
  adjunto VARCHAR(200), 
  usuario VARCHAR, 
  empresa INTEGER, 
  id_user INTEGER, 
  id_relation INTEGER, 
  CONSTRAINT nwtaks_publications_pkey PRIMARY KEY(id)
) WITHOUT OIDS;";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
    CREATE TABLE IF NOT EXISTS nw_drive_configuration (
  id SERIAL, 
  fecha TIMESTAMP WITHOUT TIME ZONE, 
  full_size INTEGER, 
  usuario VARCHAR(100), 
  empresa INTEGER, 
  CONSTRAINT nw_drive_configuration_pkey PRIMARY KEY(id)
) WITHOUT OIDS;

COMMENT ON COLUMN public.nw_drive_configuration.id
IS 'textField,0,false';

COMMENT ON COLUMN public.nw_drive_configuration.fecha
IS 'dateField';

COMMENT ON COLUMN public.nw_drive_configuration.full_size
IS 'textField';

COMMENT ON COLUMN public.nw_drive_configuration.usuario
IS 'textField,0,false';

COMMENT ON COLUMN public.nw_drive_configuration.empresa
IS 'textField,0,false';";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
 CREATE TABLE IF NOT EXISTS nwtask_comments (
  id SERIAL, 
  fecha TIMESTAMP WITHOUT TIME ZONE, 
  id_relation INTEGER, 
  tipo INTEGER, 
  usuario VARCHAR(100), 
  comentario TEXT, 
  empresa INTEGER, 
  id_user INTEGER, 
  adjunto VARCHAR(200), 
  CONSTRAINT nwtask_comments_pkey PRIMARY KEY(id)
) WITHOUT OIDS;";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
 CREATE TABLE IF NOT EXISTS nw_drive_files (
  id SERIAL, 
  nombre VARCHAR(300), 
  extension VARCHAR(10), 
  ruta VARCHAR(150), 
  carpeta INTEGER, 
  fecha TIMESTAMP WITHOUT TIME ZONE, 
  peso INTEGER, 
  usuario VARCHAR(60), 
  empresa INTEGER, 
  compartir VARCHAR(2), 
  CONSTRAINT nw_drive_files_pkey PRIMARY KEY(id)
) WITHOUT OIDS;";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
 CREATE TABLE IF NOT EXISTS nw_drive_folders (
  id SERIAL, 
  nombre VARCHAR(200), 
  usuario VARCHAR(100), 
  fecha TIMESTAMP WITHOUT TIME ZONE, 
  size_full VARCHAR(100), 
  asociado INTEGER, 
  icono VARCHAR(400), 
  privada VARCHAR(2), 
  empresa INTEGER, 
  compartir VARCHAR(20), 
  favorito VARCHAR(2), 
  compartir_value VARCHAR(50), 
  CONSTRAINT nw_drive_folders_pkey PRIMARY KEY(id)
) WITHOUT OIDS;";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
 CREATE TABLE IF NOT EXISTS nw_drive_permisos (
  id SERIAL, 
  asociado INTEGER NOT NULL, 
  fecha TIMESTAMP WITHOUT TIME ZONE, 
  consultar VARCHAR(2), 
  crear VARCHAR(2), 
  editar VARCHAR(2), 
  eliminar VARCHAR(2), 
  usuario VARCHAR(100), 
  empresa INTEGER, 
  usuario_asociado INTEGER, 
  PRIMARY KEY(id)
) WITHOUT OIDS;

COMMENT ON COLUMN public.nw_drive_permisos.consultar
IS 'selectBox,boolean';

COMMENT ON COLUMN public.nw_drive_permisos.crear
IS 'selectBox,boolean';

COMMENT ON COLUMN public.nw_drive_permisos.editar
IS 'selectBox,boolean';

COMMENT ON COLUMN public.nw_drive_permisos.eliminar
IS 'selectBox,boolean';

COMMENT ON COLUMN public.nw_drive_permisos.usuario
IS 'selectBox,boolean';";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
 CREATE TABLE IF NOT EXISTS  nwtask_ubications (
  id SERIAL, 
  fecha TIMESTAMP WITHOUT TIME ZONE, 
  latitud VARCHAR(100), 
  longitud VARCHAR(100), 
  direccion VARCHAR(100), 
  usuario VARCHAR(60), 
  empresa INTEGER, 
  tarea INTEGER, 
  PRIMARY KEY(id)
) WITHOUT OIDS;

COMMENT ON COLUMN public.nwtask_ubications.id
IS 'textField,0,false';

COMMENT ON COLUMN public.nwtask_ubications.fecha
IS 'dateField';

COMMENT ON COLUMN public.nwtask_ubications.latitud
IS 'textField';

COMMENT ON COLUMN public.nwtask_ubications.longitud
IS 'textField';

COMMENT ON COLUMN public.nwtask_ubications.direccion
IS 'textField';

COMMENT ON COLUMN public.nwtask_ubications.usuario
IS 'textField,0,false';

COMMENT ON COLUMN public.nwtask_ubications.empresa
IS 'textField,0,false';";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
 CREATE TABLE IF NOT EXISTS  public.tareas_diarias (
  id SERIAL, 
  tarea TEXT, 
  estado INTEGER, 
  fecha TIMESTAMP WITHOUT TIME ZONE, 
  empresa INTEGER, 
  prioridad INTEGER, 
  usuario VARCHAR(20), 
  usuario_asignado INTEGER, 
  observaciones TEXT, 
  fecha_final DATE, 
  respuesta TEXT, 
  fecha_modificacion TIMESTAMP WITHOUT TIME ZONE, 
  fecha_cierre TIMESTAMP WITHOUT TIME ZONE, 
  hora_final TIME WITHOUT TIME ZONE, 
  leido VARCHAR(10), 
  proyecto INTEGER, 
  etapa INTEGER, 
  tipo VARCHAR(100), 
  tiempo VARCHAR(20), 
  aprobado_cliente VARCHAR(2), 
  propuesta INTEGER, 
  id_padre INTEGER, 
   PRIMARY KEY(id)
) WITHOUT OIDS;

COMMENT ON COLUMN public.tareas_diarias.id
IS 'textField,0,false';

COMMENT ON COLUMN public.tareas_diarias.tarea
IS 'textArea';

COMMENT ON COLUMN public.tareas_diarias.estado
IS 'selectBox,estados_tareas_diarias';

COMMENT ON COLUMN public.tareas_diarias.fecha
IS 'dateField';

COMMENT ON COLUMN public.tareas_diarias.empresa
IS 'textField,0,false';

COMMENT ON COLUMN public.tareas_diarias.prioridad
IS 'selectBox,estado_prioridades';

COMMENT ON COLUMN public.tareas_diarias.usuario
IS 'textField,0,false';

COMMENT ON COLUMN public.tareas_diarias.usuario_asignado
IS 'selectBox,usuarios';

COMMENT ON COLUMN public.tareas_diarias.observaciones
IS 'textArea';

COMMENT ON COLUMN public.tareas_diarias.fecha_final
IS 'dateField';

COMMENT ON COLUMN public.tareas_diarias.respuesta
IS 'textArea';

COMMENT ON COLUMN public.tareas_diarias.leido
IS 'textField';

COMMENT ON COLUMN public.tareas_diarias.proyecto
IS 'selectBox,proyectos';

COMMENT ON COLUMN public.tareas_diarias.etapa
IS 'selectBox,projectplan_etapas';";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
  CREATE TABLE IF NOT EXISTS nwtask_adjuntos (
  id SERIAL, 
  nombre VARCHAR(200), 
  id_relation INTEGER, 
  fecha TIMESTAMP WITHOUT TIME ZONE, 
  usuario VARCHAR(100), 
  empresa INTEGER, 
  CONSTRAINT nwtask_adjuntos_pkey PRIMARY KEY(id)
) WITHOUT OIDS;

COMMENT ON COLUMN public.nwtask_adjuntos.id
IS 'te';";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
-- USUARIOS SETTINGS

ALTER TABLE public.nw_modulos_home
  ADD COLUMN modulo INTEGER;";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }


        $sql = "
-- USUARIOS SETTINGS

ALTER TABLE public.nw_modulos_grupos
  ADD COLUMN modulo INTEGER;";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
-- USUARIOS SETTINGS

ALTER TABLE public.nw_modulos_grupos
  ADD COLUMN orden INTEGER;";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "ALTER TABLE public.usuarios
                ADD COLUMN pais INTEGER;";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
COMMENT ON COLUMN nw_modulos_home.id IS 'textField,0,false';
 
COMMENT ON COLUMN nw_modulos_home.nombre IS 'textField';

COMMENT ON COLUMN nw_modulos_home.url_php IS 'textField';

COMMENT ON COLUMN nw_modulos_home.fecha IS 'dateField';

COMMENT ON COLUMN nw_modulos_home.usuario IS 'textField,0,false';

COMMENT ON COLUMN nw_modulos_home.empresa IS 'textField,0,false';

COMMENT ON COLUMN nw_modulos_home.perfil IS 'selectBox,perfiles';";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
CREATE TABLE IF NOT EXISTS nw_integrations_credentials (
        id SERIAL PRIMARY KEY,
	empresa INT,
	usuario VARCHAR(50),
	aut_usuario VARCHAR(50),
	clave TEXT,
	aut_metodo VARCHAR(50),
	version VARCHAR(50),
	url TEXT
)";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
//        $sql = "CREATE OR REPLACE FUNCTION public.nw_admindb_getkey (
//  p_table varchar,
//  p_column varchar
//)
//RETURNS varchar AS
//\$body$\
//DECLARE
//  v_column varchar;
//BEGIN
// select into v_column kc.column_name 
//from  
//    information_schema.table_constraints tc,  
//    information_schema.key_column_usage kc  
//where 
//    tc.constraint_type = 'PRIMARY KEY' 
//    and kc.table_name = tc.table_name and kc.table_schema = tc.table_schema
//    and kc.constraint_name = tc.constraint_name
//    and tc.table_name=p_table and column_name=p_column
//order by 1;
//if v_column is null then
//	return 'f' ;
//end if;
//return 't'; 
//END;
//\$body$\
//LANGUAGE 'plpgsql'
//VOLATILE
//CALLED ON NULL INPUT
//SECURITY INVOKER
//COST 100;";
//        $ca->prepare($sql);
//        if (!$ca->exec()) {
//            master::logSystemError($ca->lastErrorText());
//        }
//        $sql = "CREATE OR REPLACE FUNCTION public.nw_admindb_unique (
//  p_table varchar,
//  p_column varchar
//)
//RETURNS varchar AS
//\$body$\
//DECLARE
//  v_column varchar;
//BEGIN
// select into v_column kc.column_name 
//from  
//    information_schema.table_constraints tc,  
//    information_schema.key_column_usage kc  
//where 
//    tc.constraint_type = 'UNIQUE' 
//    and kc.table_name = tc.table_name and kc.table_schema = tc.table_schema
//    and kc.constraint_name = tc.constraint_name
//    and tc.table_name=p_table and column_name=p_column
//order by 1;
//if v_column is null then
//	return 'f' ;
//end if;
//return 't'; 
//END;
//\$body$\
//LANGUAGE 'plpgsql'
//VOLATILE
//CALLED ON NULL INPUT
//SECURITY INVOKER
//COST 100;";
//        $ca->prepare($sql);
//        if (!$ca->exec()) {
//            master::logSystemError($ca->lastErrorText());
//        }

        $sql = "
--SECURITY UPDATE:
CREATE TABLE IF NOT EXISTS public.nw_keys_conf (
  id SERIAL, 
  block_fail_access INTEGER, 
  minutes_blocked_fail_access INTEGER, 
  expiration_days INTEGER, 
  concurrency VARCHAR(2), 
  inactivity_days INTEGER, 
  days_search_old_key INTEGER, 
  minimun_length INTEGER, 
  upper_word VARCHAR(2), 
  numeric_word VARCHAR(2), 
  special_characters VARCHAR(2), 
  fecha DATE, 
  usuario VARCHAR(30), 
  empresa INTEGER, 
  CONSTRAINT nw_keys_conf_pkey PRIMARY KEY(id)
) WITHOUT OIDS;
";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
CREATE TABLE  IF NOT EXISTS public.nw_init_settings (
  id SERIAL, 
  fondo TEXT, 
  logo TEXT, 
  mensaje VARCHAR(500), 
  usuario VARCHAR(30), 
  fecha DATE, 
  empresa INTEGER, 
  CONSTRAINT nw_init_settings_pkey PRIMARY KEY(id)
) WITHOUT OIDS;

COMMENT ON COLUMN public.nw_init_settings.id
IS 'textField,0,false';

COMMENT ON COLUMN public.nw_init_settings.fondo
IS 'uploader';

COMMENT ON COLUMN public.nw_init_settings.logo
IS 'uploader';

COMMENT ON COLUMN public.nw_init_settings.mensaje
IS 'textArea';

COMMENT ON COLUMN public.nw_init_settings.usuario
IS 'textField,0,false';

COMMENT ON COLUMN public.nw_init_settings.fecha
IS 'dateField,0,false';

COMMENT ON COLUMN public.nw_init_settings.empresa
IS 'textField,0,false';
";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
CREATE TABLE IF NOT EXISTS public.nw_drive_files (
  id SERIAL, 
  nombre VARCHAR(100), 
  extension VARCHAR(20), 
  ruta VARCHAR(100), 
  carpeta INTEGER, 
  fecha TIMESTAMP WITHOUT TIME ZONE, 
   peso INTEGER, 
   usuario VARCHAR(100), 
   empresa INTEGER, 
   compartir VARCHAR(100), 
  CONSTRAINT nw_drive_files_pkey PRIMARY KEY(id)
) WITHOUT OIDS;
";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
CREATE TABLE  IF NOT EXISTS public.nw_fail_access (
  id SERIAL, 
  error_description TEXT, 
  usuario VARCHAR(30), 
  clave VARCHAR(100), 
  blocked BOOLEAN, 
  hora TIME WITHOUT TIME ZONE, 
  fecha DATE, 
  CONSTRAINT nw_fail_access_pkey PRIMARY KEY(id)
) WITHOUT OIDS;
";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }


        $sql = "
CREATE TABLE IF NOT EXISTS public.nw_drive_folders (
  id SERIAL, 
  nombre VARCHAR(100), 
  usuario VARCHAR(100), 
  fecha TIMESTAMP WITHOUT TIME ZONE, 
  size_full VARCHAR(100), 
   asociado INTEGER, 
  icono VARCHAR(100), 
  privada VARCHAR(20), 
   empresa INTEGER, 
   compartir VARCHAR(100), 
   favorito VARCHAR(20), 
  CONSTRAINT nw_drive_folders_pkey PRIMARY KEY(id)
) WITHOUT OIDS;
";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }


        $sql = "
CREATE TABLE IF NOT EXISTS public.nw_drive_permisos (
  id SERIAL, 
  asociado INTEGER, 
  fecha TIMESTAMP WITHOUT TIME ZONE, 
  consultar VARCHAR(2), 
  crear VARCHAR(2), 
  editar VARCHAR(2), 
  eliminar VARCHAR(2), 
  usuario VARCHAR(100), 
   empresa INTEGER, 
   usuario_asociado INTEGER, 
  CONSTRAINT nw_drive_permisos_pkey PRIMARY KEY(id)
) WITHOUT OIDS;
";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

//EMAIL SETTINGS
        $sql = "
CREATE TABLE  IF NOT EXISTS public.nw_email_groups (
  id SERIAL, 
  nombre VARCHAR(50), 
  empresa INTEGER, 
  usuario VARCHAR(50), 
  fecha DATE, 
  CONSTRAINT nw_email_groups_pkey PRIMARY KEY(id)
) WITHOUT OIDS;";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
COMMENT ON COLUMN public.nw_email_groups.id
IS 'textField,0,false';

COMMENT ON COLUMN public.nw_email_groups.nombre
IS 'textField';

COMMENT ON COLUMN public.nw_email_groups.empresa
IS 'textField,0,false';

COMMENT ON COLUMN public.nw_email_groups.usuario
IS 'textField,0,false';

COMMENT ON COLUMN public.nw_email_groups.fecha
IS 'textField,0,false';
;";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
CREATE TABLE  IF NOT EXISTS public.nw_email_groups_users (
  id SERIAL, 
  usuario INTEGER, 
  grupo INTEGER, 
  empresa INTEGER, 
  fecha DATE, 
  CONSTRAINT nw_email_groups_users_pkey PRIMARY KEY(id)
) WITHOUT OIDS;";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
CREATE TABLE  IF NOT EXISTS public.nw_emails (
  id SERIAL, 
  usuario VARCHAR(50), 
  nombre VARCHAR(50), 
  email VARCHAR(50), 
  empresa INTEGER, 
  fecha DATE, 
  CONSTRAINT nw_emails_id_key UNIQUE(id)
) WITHOUT OIDS;";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

//SMTP SETTINGS
        $sql = "
CREATE TABLE  IF NOT EXISTS public.nw_smtp (
  id SERIAL, 
  host VARCHAR(100), 
  debug INTEGER, 
  auth BOOLEAN, 
  smtp_secure VARCHAR(10), 
  port INTEGER, 
  username VARCHAR(50), 
  sended_from VARCHAR(50), 
  pass VARCHAR(50),  
  usuario VARCHAR(30), 
  fecha TIMESTAMP WITHOUT TIME ZONE, 
  PRIMARY KEY(id)
) WITHOUT OIDS;

COMMENT ON COLUMN public.nw_smtp.sended_from
IS 'textField';

COMMENT ON COLUMN public.nw_smtp.id
IS 'textField,0,false';

COMMENT ON COLUMN public.nw_smtp.host
IS 'textField';

COMMENT ON COLUMN public.nw_smtp.debug
IS 'spinner';

COMMENT ON COLUMN public.nw_smtp.auth
IS 'checkbox';

COMMENT ON COLUMN public.nw_smtp.smtp_secure
IS 'textField';

COMMENT ON COLUMN public.nw_smtp.port
IS 'spinner';

COMMENT ON COLUMN public.nw_smtp.username
IS 'textField';

COMMENT ON COLUMN public.nw_smtp.pass
IS 'textField';

COMMENT ON COLUMN public.nw_smtp.usuario
IS 'textField,0,false';

COMMENT ON COLUMN public.nw_smtp.fecha
IS 'textField,0,false';";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

//VERSION 5.1.5
//EMPRESAS
        $sql = "ALTER TABLE public.empresas
  ADD COLUMN autoretenedor BOOLEAN;

COMMENT ON COLUMN public.empresas.autoretenedor
IS 'checkBox';

ALTER TABLE public.empresas
  ADD COLUMN regimen INTEGER;

COMMENT ON COLUMN public.empresas.regimen
IS 'selectBox,nw_regimenes';

ALTER TABLE public.empresas
  ADD COLUMN grande_contribuyente BOOLEAN;

COMMENT ON COLUMN public.empresas.grande_contribuyente
IS 'checkBox';
";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
CREATE TABLE  IF NOT EXISTS public.terminales (
  id SERIAL, 
  nombre VARCHAR(100) NOT NULL, 
  ciudad INTEGER NOT NULL, 
  direccion VARCHAR(200), 
  telefono VARCHAR(100), 
  latitud VARCHAR(200), 
  longitud VARCHAR(200), 
  clave VARCHAR(50), 
  host VARCHAR(100), 
  empresa INTEGER, 
  usuario VARCHAR(30), 
  fecha DATE, 
  CONSTRAINT terminales_pk_registro PRIMARY KEY(id)
) WITHOUT OIDS;

COMMENT ON COLUMN public.terminales.id
IS 'textField,0,false';

COMMENT ON COLUMN public.terminales.ciudad
IS 'selectBox,ciudades';

COMMENT ON COLUMN public.terminales.direccion
IS 'textArea';

COMMENT ON COLUMN public.terminales.empresa
IS 'textField,0,false';

COMMENT ON COLUMN public.terminales.usuario
IS 'textField,0,false';

COMMENT ON COLUMN public.terminales.fecha
IS 'dateField,0,false';";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "CREATE TABLE  IF NOT EXISTS public.nw_list_edit (
  id SERIAL, 
  token_field INTEGER, 
  select_token_field INTEGER, 
  select_box INTEGER, 
  usuario VARCHAR(30), 
  fecha DATE, 
  empresa INTEGER, 
  date DATE, 
  visible BOOLEAN, 
  text_field VARCHAR(100), 
  imagen VARCHAR(500), 
  CONSTRAINT nw_list_edit_pkey PRIMARY KEY(id)
) WITHOUT OIDS;";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "ALTER TABLE public.nw_list_edit
                ADD COLUMN money DOUBLE PRECISION;";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "ALTER TABLE public.nw_list_edit
                ADD COLUMN ciudad VARCHAR(20);";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "ALTER TABLE public.nw_list_edit
                ADD COLUMN pais VARCHAR(20);";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "INSERT INTO public.nw_list_edit 
VALUES (62, 0, 1, 1, NULL, NULL, NULL, E'2014-09-22', False, E'Sandra', E'http://www.netwoods.net/imagenes/imagenes_2012/logo_menu_kid.png', 250000, E'Bogota', E'Colombia');

INSERT INTO public.nw_list_edit 
VALUES (63, 0, 25, 28, NULL, NULL, NULL, E'2014-09-11', True, E'Lina', E'/imagenes/andres.jpg\r\n', 300000, E'Bogota', E'Argentina');

INSERT INTO public.nw_list_edit 
VALUES (64, 0, 0, 103, NULL, NULL, NULL, E'2014-09-22', False, E'130000', E'/imagenes/IMG00738-20110219-1446.jpg', 60000, E'Cali', E'Alemania');

INSERT INTO public.nw_list_edit 
VALUES (65, 0, 0, 0, NULL, NULL, NULL, E'2014-09-09', True, E'Rosa', E'http://ek.loc/qooxdoo/qooxdoo-4.0.1-sdk/framework/source/resource/qx/icon/Tango/16/actions/go-next.png', 25000, E'Cartagena', E'Alemania');

INSERT INTO public.nw_list_edit 
VALUES (66, 0, 25, 25, NULL, NULL, NULL, E'2014-09-22', True, E'Andres', NULL, 25000000, E'Cartagena', E'Mexico');";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "CREATE TABLE  IF NOT EXISTS public.nw_cmi_enc (
                id SERIAL, 
                nombre VARCHAR(100), 
                table_method VARCHAR(100), 
                classname VARCHAR(100), 
                is_main_form VARCHAR(50), 
                serial_column VARCHAR(50), 
                table_main VARCHAR(50), 
                label VARCHAR(100), 
                usuario VARCHAR(200), 
                fecha TIMESTAMP WITHOUT TIME ZONE, 
                empresa INTEGER, 
                PRIMARY KEY(id)
              ) WITHOUT OIDS;";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "ALTER TABLE public.nw_cmi_enc
                ADD COLUMN part VARCHAR(30);";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "CREATE TABLE  IF NOT EXISTS public.nw_notifications (
  id SERIAL, 
  parte VARCHAR(100), 
  mensaje TEXT, 
  enviado_por VARCHAR(50), 
  fecha TIMESTAMP WITHOUT TIME ZONE, 
  empresa INTEGER, 
  CONSTRAINT nw_notifications_pkey PRIMARY KEY(id)
) WITHOUT OIDS;";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "CREATE TABLE  IF NOT EXISTS public.nw_notifications_det (
  id SERIAL, 
  notificacion INTEGER, 
  leida BOOLEAN, 
  usuario VARCHAR(30), 
  fecha TIMESTAMP WITHOUT TIME ZONE, 
  fecha_entrega TIMESTAMP(0) WITHOUT TIME ZONE, 
  CONSTRAINT nw_notifications_read_pkey PRIMARY KEY(id)
) WITHOUT OIDS;";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "ALTER TABLE public.nw_notifications_det
                ADD COLUMN fecha_entrega TIMESTAMP(0) WITHOUT TIME ZONE;";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "ALTER TABLE public.nw_notifications_enc
                ADD COLUMN tipo VARCHAR(20);";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "CREATE TABLE  IF NOT EXISTS public.nw_cron (
        id SERIAL, 
        nombre VARCHAR(100), 
        trabajo VARCHAR(100), 
        minuto INTEGER, 
        hora INTEGER, 
        dia_mes INTEGER, 
        mes INTEGER, 
        dia_semana INTEGER, 
        fecha DATE, 
        usuario VARCHAR(30), 
        empresa INTEGER, 
        CONSTRAINT nw_cron_pkey PRIMARY KEY(id)
        ) WITHOUT OIDS;";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "ALTER TABLE public.empresas
            ADD COLUMN web VARCHAR(200);

            COMMENT ON COLUMN public.empresas.web
            IS 'textField';";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "ALTER TABLE public.usuarios_empresas
                ADD COLUMN perfil INTEGER;";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "CREATE TABLE  IF NOT EXISTS public.nwtaks_publications (
  id SERIAL, 
  fecha TIMESTAMP WITHOUT TIME ZONE, 
  comentario TEXT, 
  adjunto VARCHAR(200), 
  usuario VARCHAR, 
  empresa INTEGER, 
  id_user INTEGER, 
  id_relation INTEGER, 
  CONSTRAINT nwtaks_publications_pkey PRIMARY KEY(id)
) WITHOUT OIDS;";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "ALTER TABLE public.nw_downloads
        ADD COLUMN num_rows INTEGER; ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "CREATE TABLE  IF NOT EXISTS public.nw_printer_types (
                id SERIAL, 
                nombre VARCHAR(100), 
                empresa INTEGER, 
                fecha DATE, 
                usuario VARCHAR(30), 
                PRIMARY KEY(id)
               ) WITHOUT OIDS;";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
         CREATE TABLE  IF NOT EXISTS nwexcel_files (
    id SERIAL NOT NULL,
    fecha timestamp without time zone DEFAULT now(),
    fecha_update timestamp without time zone,
    nombre character varying(200),
    texto text,
    usuario character varying(100),
    tipo character varying(10),
    empresa integer
);
               ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }


        $sql = "
CREATE TABLE  IF NOT EXISTS nwexcel_variables_globales (
    id SERIAL NOT NULL,
    fecha timestamp without time zone DEFAULT now(),
    nombre character varying(200),
    usuario character varying(100),
    hoja integer
);
               ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
CREATE TABLE  IF NOT EXISTS public.nw_mobile_menu (
  id SERIAL, 
  menu INTEGER, 
  usuario VARCHAR(30), 
  fecha DATE, 
  perfil INTEGER, 
  pagina_principal BOOLEAN, 
  CONSTRAINT nw_mobile_menu_pkey PRIMARY KEY(id)
) WITHOUT OIDS;";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
CREATE TABLE  IF NOT EXISTS public.nw_excel_list (
  id SERIAL, 
  html TEXT, 
  usuario VARCHAR(30), 
  fecha TIMESTAMP WITHOUT TIME ZONE, 
  empresa INTEGER, 
  CONSTRAINT nw_excel_list_pkey PRIMARY KEY(id)
) WITHOUT OIDS;
";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "ALTER TABLE public.nwexcel_files
        ADD COLUMN code_js text; ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "ALTER TABLE public.nwexcel_files
        ADD COLUMN code_css text; ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "ALTER TABLE public.nwexcel_files
        ADD COLUMN acceso character varying(100); ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "ALTER TABLE public.nwexcel_files
        ADD COLUMN permisos character varying(100); ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "CREATE TABLE  IF NOT EXISTS public.nw_forgot_password (
  id SERIAL, 
  usuario VARCHAR(30), 
  correo VARCHAR(50), 
  clave VARCHAR(100), 
  usada BOOLEAN, 
  fecha TIMESTAMP WITHOUT TIME ZONE, 
  CONSTRAINT nw_forgot_password_pkey PRIMARY KEY(id)
) WITHOUT OIDS; ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "ALTER TABLE public.usuarios
    ADD COLUMN estado_chat VARCHAR(30);";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "ALTER TABLE public.menu
    ADD COLUMN movil BOOLEAN;";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "CREATE TABLE  IF NOT EXISTS public.nw_printer_settings (
  id SERIAL, 
  nombre VARCHAR(100), 
  encabezado TEXT, 
  pie TEXT, 
  usuario VARCHAR(30), 
  ancho INTEGER, 
  alto INTEGER, 
  text_transform VARCHAR(60), 
  ancho_tabla INTEGER, 
  fecha DATE, 
  empresa INTEGER, 
  margen_superior INTEGER, 
  margen_inferior INTEGER, 
  margen_izquierda INTEGER, 
  margen_derecha INTEGER, 
  fuente VARCHAR(60), 
  tamano_fuente INTEGER, 
  centrar BOOLEAN, 
  marca_agua TEXT, 
  centro TEXT, 
  oculto TEXT
) WITHOUT OIDS;

COMMENT ON COLUMN public.nw_printer_settings.id
IS 'textField,0,false';

COMMENT ON COLUMN public.nw_printer_settings.nombre
IS 'textField';

COMMENT ON COLUMN public.nw_printer_settings.encabezado
IS 'ckeditor';

COMMENT ON COLUMN public.nw_printer_settings.pie
IS 'ckeditor';

COMMENT ON COLUMN public.nw_printer_settings.usuario
IS 'textField,0,false';

COMMENT ON COLUMN public.nw_printer_settings.ancho
IS 'spinner';

COMMENT ON COLUMN public.nw_printer_settings.alto
IS 'spinner';

COMMENT ON COLUMN public.nw_printer_settings.text_transform
IS 'selectBox';

COMMENT ON COLUMN public.nw_printer_settings.ancho_tabla
IS 'spinner';

COMMENT ON COLUMN public.nw_printer_settings.fecha
IS 'textField,0,false';

COMMENT ON COLUMN public.nw_printer_settings.empresa
IS 'textField,0,false';

COMMENT ON COLUMN public.nw_printer_settings.margen_superior
IS 'spinner';

COMMENT ON COLUMN public.nw_printer_settings.margen_inferior
IS 'spinner';

COMMENT ON COLUMN public.nw_printer_settings.margen_izquierda
IS 'spinner';

COMMENT ON COLUMN public.nw_printer_settings.margen_derecha
IS 'spinner';

COMMENT ON COLUMN public.nw_printer_settings.fuente
IS 'textField';

COMMENT ON COLUMN public.nw_printer_settings.tamano_fuente
IS 'spinner';

COMMENT ON COLUMN public.nw_printer_settings.centrar
IS 'checkBox';

COMMENT ON COLUMN public.nw_printer_settings.marca_agua
IS 'textField';

COMMENT ON COLUMN public.nw_printer_settings.centro
IS 'textArea';";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
ALTER TABLE public.nw_printer_settings
  DROP CONSTRAINT nw_printer_settings_pkey RESTRICT;

ALTER TABLE public.nw_printer_settings
  ADD CONSTRAINT nw_printer_settings_pkey 
    UNIQUE (id);";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "ALTER TABLE public.menu
    ADD COLUMN orden_movil INTEGER;";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "CREATE TABLE  IF NOT EXISTS public.nw_export_calculate_enc (
  id SERIAL, 
  encabezado TEXT, 
  usuario VARCHAR(30), 
  fecha DATE, 
  empresa INTEGER, 
  CONSTRAINT nw_export_calculate_enc_pkey PRIMARY KEY(id)
) WITHOUT OIDS;";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "CREATE TABLE  IF NOT EXISTS public.nw_export_calculate_dev (
  id SERIAL, 
  encabezado TEXT, 
  usuario VARCHAR(30), 
  fecha DATE, 
  empresa INTEGER, 
  CONSTRAINT nw_export_calculate_dev_pkey PRIMARY KEY(id)
) WITHOUT OIDS;";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "CREATE OR REPLACE FUNCTION public.nw_admindb_getkey (
  p_table varchar,
  p_column varchar
)
RETURNS varchar AS
\$body$
DECLARE
  v_column varchar;
BEGIN
 select into v_column kc.column_name 
from  
    information_schema.table_constraints tc,  
    information_schema.key_column_usage kc  
where 
    tc.constraint_type = 'PRIMARY KEY' 
    and kc.table_name = tc.table_name and kc.table_schema = tc.table_schema
    and kc.constraint_name = tc.constraint_name
    and tc.table_name=p_table and column_name=p_column
order by 1;
if v_column is null then
    return 'f' ;
end if;
return 't'; 
END;
\$body$
LANGUAGE 'plpgsql'
VOLATILE
CALLED ON NULL INPUT
SECURITY INVOKER
COST 100;";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "CREATE OR REPLACE FUNCTION public.nw_admindb_unique (
  p_table varchar,
  p_column varchar
)
RETURNS varchar AS
\$body$
DECLARE
v_column varchar;
BEGIN
 select into v_column kc.column_name 
from  
    information_schema.table_constraints tc,  
    information_schema.key_column_usage kc  
where 
    tc.constraint_type = 'UNIQUE' 
    and kc.table_name = tc.table_name and kc.table_schema = tc.table_schema
    and kc.constraint_name = tc.constraint_name
    and tc.table_name=p_table and column_name=p_column
order by 1;
if v_column is null then
    return 'f' ;
end if;
return 't'; 
END;
\$body$
LANGUAGE 'plpgsql'
VOLATILE
CALLED ON NULL INPUT
SECURITY INVOKER
COST 100;";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
CREATE OR REPLACE FUNCTION public.func_permisos_empresa_usuario (
  p_usuario varchar,
  p_empresa integer
)
RETURNS boolean AS
\$body$
DECLARE
  vpermiso VARCHAR(100);
BEGIN
  SELECT INTO vpermiso usuario FROM public.usuarios_empresas
  WHERE usuario = p_usuario and empresa = p_empresa;
  
  IF FOUND THEN
  	RETURN true;
  ELSE
  	RETURN false;
  END IF;
END;
\$body$
LANGUAGE 'plpgsql'
VOLATILE
CALLED ON NULL INPUT
SECURITY INVOKER
    COST 100;
                ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
CREATE OR REPLACE FUNCTION public.func_registra_permisos (
  vperfil integer,
  vmodulo integer,
  vcrear boolean,
  veditar boolean,
  veliminar boolean,
  vconsultar boolean,
  vusuario text,
  vtodos boolean
)
RETURNS text AS
\$body$
DECLARE
  VSQL TEXT;
BEGIN
  BEGIN
    VSQL='INSERT INTO permisos (perfil,modulo,crear,editar,eliminar,consultar,todos,fecha) VALUES (';
    VSQL=VSQL || QUOTE_LITERAL(vperfil)||',';
    VSQL=VSQL || QUOTE_LITERAL(vmodulo) || ',';
    VSQL=VSQL || vcrear || ',';
    VSQL=VSQL || veditar || ',';
    VSQL=VSQL || veliminar || ',';
    VSQL=VSQL || vconsultar || ',';
    VSQL=VSQL || vtodos || ',';
    VSQL=VSQL || QUOTE_LITERAL(current_date::text) || ')';
    RAISE NOTICE 'CONSULTA2=%',VSQL;
    EXECUTE VSQL;
    RETURN 'INSERT';
    EXCEPTION
    WHEN unique_violation  THEN
    VSQL='UPDATE permisos SET crear=';
    VSQL=VSQL || vcrear || ',editar=';
    VSQL=VSQL || veditar || ',eliminar=';
    VSQL=VSQL || veliminar || ',consultar=';
    VSQL=VSQL || vconsultar || ',todos=';
    VSQL=VSQL || vtodos || ',fecha=';
    VSQL=VSQL || QUOTE_LITERAL(current_date::text);
    VSQL=VSQL || ' WHERE perfil=';
    VSQL=VSQL || vperfil || ' and modulo=';
    VSQL=VSQL || vmodulo;
    RAISE NOTICE 'CONSULTA3=%',VSQL;
    EXECUTE VSQL;
    WHEN OTHERS THEN
    	RETURN 'error';
  	END;
  RETURN 'UPDATE';
END;
\$body$
LANGUAGE 'plpgsql'
VOLATILE
CALLED ON NULL INPUT
SECURITY INVOKER
COST 100;";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }


        $sql = "ALTER TABLE public.usuarios_empresas
  ADD COLUMN perfil INTEGER;";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "ALTER TABLE public.usuarios_empresas
  ADD COLUMN terminal INTEGER;";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = 'ALTER TABLE public.nw_notifications
  ALTER COLUMN enviado_por TYPE VARCHAR(50) COLLATE pg_catalog."default";;';
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = 'ALTER TABLE public.nwtaks_publications
  ALTER COLUMN usuario TYPE VARCHAR(30) COLLATE pg_catalog."default";';
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "ALTER TABLE public.nw_design
  ADD COLUMN code_css TEXT;";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "ALTER TABLE public.nw_design
  ADD COLUMN url_hoja_css character varying(60);";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "ALTER TABLE public.nw_design
  ADD COLUMN plantilla character varying(10);";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
          COMMENT ON COLUMN public.nw_design.code_css
IS 'textArea';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
          COMMENT ON COLUMN public.nw_design.plantilla
IS 'selectBox,array';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

//            $sql = "
//COMMENT ON TABLE nw_design IS '  [
//                {
//                    \"navTables\": [
//                        {
//                            \"title\": \"plantilla\",
//                            \"table\": \"pep_programas_paises\",
//                            \"name\": \"programas_paises\",
//                            \"reference\": \"id_program\"
//                        },
//                         {
//                            \"title\": \"Áreas\",
//                            \"table\": \"pep_programas_areas\",
//                            \"name\": \"programas_areas\",
//                            \"reference\": \"id_area\"
//                        }
//                    ],
//                    \"config\": {
//                        	\"cleanHtml\": false
//                        }
//                }
//  ]'
//  ;
//  ";
//        $ca->prepare($sql);
//        if (!$ca->exec()) {
//            master::logSystemError($ca->lastErrorText());
//        }
        $sql = "
COMMENT ON TABLE nw_design IS '  [
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
  ]'
  ;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
CREATE TABLE  IF NOT EXISTS public.nw_cmi_det (
  id SERIAL, 
  tipo VARCHAR(30), 
  clave VARCHAR(30), 
  valor VARCHAR(50), 
  fecha DATE, 
  usuario VARCHAR(30), 
  empresa INTEGER, 
  CONSTRAINT nw_cmi_det_pkey PRIMARY KEY(id)
) WITHOUT OIDS;";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
ALTER TABLE public.nw_design
  ADD COLUMN usar_segunda_vista_como_home VARCHAR(2)
  ;";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
  COMMENT ON COLUMN public.nw_design.usar_segunda_vista_como_home
IS 'selectBox,boolean';";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE public.nw_design
  ADD COLUMN menu_segunda_vista_horizontal VARCHAR(2)
  ;";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
  COMMENT ON COLUMN public.nw_design.menu_segunda_vista_horizontal
IS 'selectBox,boolean';";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE public.nw_modulos_grupos
  ADD COLUMN mostrar_en_el_home VARCHAR(2)
  ;";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
  COMMENT ON COLUMN public.nw_modulos_grupos.mostrar_en_el_home
IS 'selectBox,boolean';";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
  ALTER TABLE public.nw_cron
  ALTER COLUMN trabajo TYPE VARCHAR(250) ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
ALTER TABLE public.usuarios
  ADD COLUMN fecha_ultima_conexion TIMESTAMP(0) WITHOUT TIME ZONE
  ;";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "ALTER TABLE permisos ADD COLUMN pais BOOLEAN;";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "ALTER TABLE departamentos ADD COLUMN pais INTEGER; COMMENT ON COLUMN departamentos.pais IS 'selectBox,paises';";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "ALTER TABLE departamentos ADD COLUMN usuario VARCHAR(30);
                COMMENT ON COLUMN departamentos.usuario IS 'textField,0,false';";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "ALTER TABLE departamentos ADD COLUMN fecha DATE;
                COMMENT ON COLUMN departamentos.fecha IS 'textField,0,false';";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "ALTER TABLE usuarios ADD COLUMN ver_chat VARCHAR(2);";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "ALTER TABLE nw_init_settings ADD COLUMN fondo_login TEXT;";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "ALTER TABLE usuarios ADD COLUMN celular VARCHAR(20);";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "ALTER TABLE usuarios ADD COLUMN cargo VARCHAR(50);";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "ALTER TABLE usuarios ADD COLUMN ver_chat VARCHAR(2);";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "CREATE TABLE  IF NOT EXISTS nw_server_db (
                  id SERIAL, 
                  driver VARCHAR(10), 
                  host VARCHAR(15), 
                  dbname VARCHAR(20), 
                  username VARCHAR(20), 
                  pass VARCHAR(30), 
                  empresa INTEGER, 
                  usuario VARCHAR(30), 
                  fecha DATE, 
                  CONSTRAINT nw_server_db_pkey PRIMARY KEY(id)
                ) WITHOUT OIDS;

            COMMENT ON TABLE public.nw_server_db
            IS '[
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

            COMMENT ON COLUMN public.nw_server_db.id
            IS 'textField,0,false';

            COMMENT ON COLUMN public.nw_server_db.driver
            IS 'selectBox,array';

            COMMENT ON COLUMN public.nw_server_db.empresa
            IS 'textField,0,false';

            COMMENT ON COLUMN public.nw_server_db.usuario
            IS 'textField,0,false';

            COMMENT ON COLUMN public.nw_server_db.fecha
            IS 'textField,0,false';";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "ALTER TABLE nw_server_db ADD COLUMN puerto VARCHAR(10);";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "CREATE TABLE nw_security_questions (
              id SERIAL NOT NULL, 
              pregunta VARCHAR(100), 
              usuario VARCHAR(50), 
              fecha DATE, 
              empresa INTEGER, 
              respuesta VARCHAR(100) NOT NULL
            ) WITHOUT OIDS; ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "COMMENT ON COLUMN nw_security_questions.id
            IS 'textField,0,false';

            COMMENT ON COLUMN nw_security_questions.usuario
            IS 'textField,0,false';

            COMMENT ON COLUMN nw_security_questions.fecha
            IS 'textField,0,false';

            COMMENT ON COLUMN nw_security_questions.empresa
            IS 'textField,0,false';

            COMMENT ON COLUMN nw_security_questions.respuesta
            IS 'passwordField';";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }




        //NwMaker



        $sql = " CREATE TABLE IF NOT EXISTS nwmaker_menu (
  id SERIAL NOT NULL,
  nombre varchar(200)  ,
  icono varchar(120)  ,
  nivel integer  ,
  pertenece integer ,
  usuario varchar(90) ,
  empresa integer ,
  fecha_creacion timestamp,
  activo varchar(20) ,
  mostrar_en_el_home varchar(2) ,
  callBack varchar(100) ,
  orden varchar(100) ,
  icono_menu_left varchar(100) ,
  callback_code varchar(200) ,
  PRIMARY KEY (id)
);

COMMENT ON COLUMN public.nwmaker_menu.id
IS 'textField,0,false';

COMMENT ON COLUMN public.nwmaker_menu.nombre
IS 'textField';

COMMENT ON COLUMN public.nwmaker_menu.orden
IS 'textField';

COMMENT ON COLUMN public.nwmaker_menu.icono
IS 'uploader';

COMMENT ON COLUMN public.nwmaker_menu.nivel
IS 'selectBox,array';

COMMENT ON COLUMN public.nwmaker_menu.pertenece
IS 'selectBox,nwmaker_menu';

COMMENT ON COLUMN public.nwmaker_menu.usuario
IS 'textField,0,false';

COMMENT ON COLUMN public.nwmaker_menu.empresa
IS 'textField,0,false';

COMMENT ON COLUMN public.nwmaker_menu.fecha_creacion
IS 'textField,0,false';

COMMENT ON COLUMN public.nwmaker_menu.activo
IS 'selectBox,array';

COMMENT ON COLUMN public.nwmaker_menu.callBack
IS 'selectBox,nwmaker_modulos';

COMMENT ON COLUMN public.nwmaker_menu.icono_menu_left
IS 'uploader';

COMMENT ON COLUMN public.nwmaker_menu.mostrar_en_el_home
IS 'selectBox,boolean';

COMMENT ON COLUMN public.nwmaker_menu.callback_code
IS 'textArea';
";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
CREATE TABLE IF NOT EXISTS nwmaker_modulos (
  id SERIAL NOT NULL ,
  nombre varchar(200) ,
  titulo varchar(120) ,
  css TEXT ,
  js TEXT ,
  usuario varchar(90),
  empresa integer ,
  fecha_creacion timestamp,
  activo varchar(20),
  PRIMARY KEY (id)
);

COMMENT ON COLUMN public.nwmaker_modulos.id
IS 'textField,0,false';

COMMENT ON COLUMN public.nwmaker_modulos.nombre
IS 'textField';

COMMENT ON COLUMN public.nwmaker_modulos.titulo
IS 'textField';

COMMENT ON COLUMN public.nwmaker_modulos.css
IS 'textArea';

COMMENT ON COLUMN public.nwmaker_modulos.js
IS 'textArea';

COMMENT ON COLUMN public.nwmaker_modulos.usuario
IS 'textField,0,false';

COMMENT ON COLUMN public.nwmaker_modulos.empresa
IS 'textField,0,false';

COMMENT ON COLUMN public.nwmaker_modulos.fecha_creacion
IS 'textField,0,false';

COMMENT ON COLUMN public.nwmaker_modulos.activo
IS 'selectBox,array';

";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
CREATE TABLE IF NOT EXISTS nwmaker_resetpass (
  id Serial NOT NULL ,
  token VARCHAR(40),
  tipo VARCHAR(40),
  usuario VARCHAR(150),
  usado VARCHAR(2),
   fecha date ,
  PRIMARY KEY (id)
);

COMMENT ON COLUMN public.nwmaker_resetpass.id
IS 'textField,0,false';

COMMENT ON COLUMN public.nwmaker_resetpass.token
IS 'textField';

COMMENT ON COLUMN public.nwmaker_resetpass.tipo
IS 'textField';

COMMENT ON COLUMN public.nwmaker_resetpass.usado
IS 'selectBox,boolean';

COMMENT ON COLUMN public.nwmaker_resetpass.fecha
IS 'dateField';

COMMENT ON COLUMN public.nwmaker_resetpass.usuario
IS 'textField,0,false';

";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
CREATE TABLE IF NOT EXISTS nwmaker_perfiles (
    id serial NOT NULL,
  nombre varchar(150),
  descripcion varchar,
  pagina integer,
  usuario varchar(60) ,
  PRIMARY KEY (id)
);

COMMENT ON COLUMN public.nwmaker_perfiles.id
IS 'textField,0,false';

COMMENT ON COLUMN public.nwmaker_perfiles.nombre
IS 'textField';

COMMENT ON COLUMN public.nwmaker_perfiles.descripcion
IS 'textArea';

COMMENT ON COLUMN public.nwmaker_perfiles.pagina
IS 'selectBox,paginas';

COMMENT ON COLUMN public.nwmaker_perfiles.usuario
IS 'textField,0,false';

";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
CREATE TABLE IF NOT EXISTS nwmaker_permisos (
  id SERIAL NOT NULL ,
  perfil integer ,
  modulo integer ,
  consultar varchar(2),
  editar varchar(2),
  eliminar varchar(2) ,
  exportar varchar(2) ,
  usuario varchar(60) ,
  PRIMARY KEY (id)
) ;

COMMENT ON COLUMN public.nwmaker_permisos.id
IS 'textField,0,false';

COMMENT ON COLUMN public.nwmaker_permisos.perfil
IS 'selectBox,nwmaker_perfiles';

COMMENT ON COLUMN public.nwmaker_permisos.modulo
IS 'selectBox,nwmaker_modulos';

COMMENT ON COLUMN public.nwmaker_permisos.consultar
IS 'selectBox,boolean';

COMMENT ON COLUMN public.nwmaker_permisos.editar
IS 'selectBox,boolean';

COMMENT ON COLUMN public.nwmaker_permisos.eliminar
IS 'selectBox,boolean';

COMMENT ON COLUMN public.nwmaker_permisos.exportar
IS 'selectBox,boolean';

COMMENT ON COLUMN public.nwmaker_permisos.usuario
IS 'textField,0,false';

";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
CREATE TABLE IF NOT EXISTS nwmaker_login (
    id SERIAL NOT NULL,
  permitir_crear_cuentas varchar(2) ,
  tipo_login varchar(25) ,
  activo varchar(2),
  usar_redireccion_login varchar(2),
  url_redireccion_login varchar(150),
  link_politicas varchar(150),
  politicas_texto varchar(150),
  logotipo_login varchar(150),
   pedir_documento varchar(2),
   permitir_login_user_only varchar(2),
   pedir_celular varchar(2),
   id_empresa_de_nuevas_cuentas varchar(4),
   verificar_email_via_correo varchar(2),
   apply_css_loginBox varchar(2),
   permitir_acceso_sin_login varchar(2),
   pedir_fecha_nacimiento varchar(2),
   pedir_nombre_y_apellidos varchar(2),
   pedir_ciudad varchar(2),
   pedir_code_promo varchar(2),
   permitir_registro_login_con_facebook varchar(2),
   permitir_registro_login_con_twitter varchar(2),
   pedir_pagina_web varchar(2),
   pedir_pais varchar(2),
   pedir_profesion varchar(2),
   pedir_genero varchar(2),
   callBack TEXT,
   codigo_libre TEXT,
   html_footer TEXT,
   html_encabezado TEXT,
   comprobar_via_email_login_user_only varchar(2),
  usuario varchar(100) ,
  PRIMARY KEY (id)
);


COMMENT ON COLUMN public.nwmaker_login.id
IS 'textField,0,false';

COMMENT ON COLUMN public.nwmaker_login.permitir_crear_cuentas
IS 'selectBox,boolean';

COMMENT ON COLUMN public.nwmaker_login.callBack
IS 'textArea';

COMMENT ON COLUMN public.nwmaker_login.html_encabezado
IS 'ckeditor';

COMMENT ON COLUMN public.nwmaker_login.codigo_libre
IS 'ckeditor';

COMMENT ON COLUMN public.nwmaker_login.html_footer
IS 'ckeditor';

COMMENT ON COLUMN public.nwmaker_login.pedir_nombre_y_apellidos
IS 'selectBox,boolean';

COMMENT ON COLUMN public.nwmaker_login.pedir_ciudad
IS 'selectBox,boolean';

COMMENT ON COLUMN public.nwmaker_login.pedir_code_promo
IS 'selectBox,boolean';

COMMENT ON COLUMN public.nwmaker_login.pedir_fecha_nacimiento
IS 'selectBox,boolean';

COMMENT ON COLUMN public.nwmaker_login.pedir_genero
IS 'selectBox,boolean';

COMMENT ON COLUMN public.nwmaker_login.pedir_profesion
IS 'selectBox,boolean';

COMMENT ON COLUMN public.nwmaker_login.pedir_pais
IS 'selectBox,boolean';

COMMENT ON COLUMN public.nwmaker_login.permitir_acceso_sin_login
IS 'selectBox,boolean';

COMMENT ON COLUMN public.nwmaker_login.tipo_login
IS 'selectBox,array';

COMMENT ON COLUMN public.nwmaker_login.activo
IS 'selectBox,boolean';

COMMENT ON COLUMN public.nwmaker_login.comprobar_via_email_login_user_only
IS 'selectBox,boolean';

COMMENT ON COLUMN public.nwmaker_login.permitir_login_user_only
IS 'selectBox,boolean';

COMMENT ON COLUMN public.nwmaker_login.usar_redireccion_login
IS 'selectBox,boolean';

COMMENT ON COLUMN public.nwmaker_login.apply_css_loginBox
IS 'selectBox,boolean';

COMMENT ON COLUMN public.nwmaker_login.url_redireccion_login
IS 'textField';

COMMENT ON COLUMN public.nwmaker_login.logotipo_login
IS 'uploader';

COMMENT ON COLUMN public.nwmaker_login.politicas_texto
IS 'textField';

COMMENT ON COLUMN public.nwmaker_login.link_politicas
IS 'textField';

COMMENT ON COLUMN public.nwmaker_login.id_empresa_de_nuevas_cuentas
IS 'textField';

COMMENT ON COLUMN public.nwmaker_login.pedir_documento
IS 'selectBox,boolean';

COMMENT ON COLUMN public.nwmaker_login.pedir_pagina_web
IS 'selectBox,boolean';

COMMENT ON COLUMN public.nwmaker_login.permitir_registro_login_con_facebook
IS 'selectBox,boolean';

COMMENT ON COLUMN public.nwmaker_login.pedir_celular
IS 'selectBox,boolean';

COMMENT ON COLUMN public.nwmaker_login.permitir_registro_login_con_facebook
IS 'selectBox,boolean';

COMMENT ON COLUMN public.nwmaker_login.permitir_registro_login_con_twitter
IS 'selectBox,boolean';

COMMENT ON COLUMN public.nwmaker_login.verificar_email_via_correo
IS 'selectBox,boolean';

COMMENT ON COLUMN public.nwmaker_login.usuario
IS 'textField,0,false';

";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
CREATE TABLE IF NOT EXISTS nwmaker_modulos_componentes (
  id SERIAL NOT NULL,
  html TEXT ,
  nwproject_modulo integer,
  orden integer,
  modulo integer ,
  maestro varchar(100) ,
  css TEXT ,
  js TEXT ,
  usuario varchar(90),
  empresa integer ,
  fecha_creacion timestamp ,
  maestro_columnas varchar(250) ,
  activo varchar(20) ,
  usar_modulo varchar(2) ,
  usar__tabla_maestro varchar(2) ,
  mostrar_archivo varchar(2) ,
  ruta_archivo varchar(100) ,
  PRIMARY KEY (id)
);

COMMENT ON COLUMN public.nwmaker_modulos_componentes.id
IS 'textField,0,false';

COMMENT ON COLUMN public.nwmaker_modulos_componentes.html
IS 'ckeditor';

COMMENT ON COLUMN public.nwmaker_modulos_componentes.nwproject_modulo
IS 'selectBox,nwmaker_modulos';

COMMENT ON COLUMN public.nwmaker_modulos_componentes.orden
IS 'textField';

COMMENT ON COLUMN public.nwmaker_modulos_componentes.modulo
IS 'selectBox,nwmaker_modulos';

COMMENT ON COLUMN public.nwmaker_modulos_componentes.maestro
IS 'textField';

COMMENT ON COLUMN public.nwmaker_modulos_componentes.css
IS 'textArea';

COMMENT ON COLUMN public.nwmaker_modulos_componentes.js
IS 'textArea';

COMMENT ON COLUMN public.nwmaker_modulos_componentes.usuario
IS 'textField,0,false';

COMMENT ON COLUMN public.nwmaker_modulos_componentes.empresa
IS 'textField,0,false';

COMMENT ON COLUMN public.nwmaker_modulos_componentes.fecha_creacion
IS 'textField,0,false';

COMMENT ON COLUMN public.nwmaker_modulos_componentes.activo
IS 'selectBox,array';

COMMENT ON COLUMN public.nwmaker_modulos_componentes.maestro_columnas
IS 'textField';

COMMENT ON COLUMN public.nwmaker_modulos_componentes.usar_modulo
IS 'selectBox,boolean';

COMMENT ON COLUMN public.nwmaker_modulos_componentes.usar__tabla_maestro
IS 'selectBox,boolean';

COMMENT ON COLUMN public.nwmaker_modulos_componentes.mostrar_archivo
IS 'selectBox,boolean';

COMMENT ON COLUMN public.nwmaker_modulos_componentes.ruta_archivo
IS 'textField';

";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
CREATE TABLE IF NOT EXISTS nwmaker_users_empresas (
    id serial NOT NULL ,
  usuario_cliente integer ,
  terminal integer ,
  terminal_asociada integer ,
  foto_perfil varchar(60) ,
  isGroup varchar(2) ,
  email varchar(60) ,
  nombres_apellidos varchar(60) ,
  user_cliente varchar(60) ,
  usersGroup text ,
  status_connection varchar(60) ,
  dispositivo varchar(60) ,
  idCallGroup varchar(60) ,
  last_connection date ,
  PRIMARY KEY (id)
);

COMMENT ON COLUMN public.nwmaker_users_empresas.id
IS 'textField,0,false';

COMMENT ON COLUMN public.nwmaker_users_empresas.usuario_cliente
IS 'textField';

COMMENT ON COLUMN public.nwmaker_users_empresas.terminal
IS 'textField';

COMMENT ON COLUMN public.nwmaker_users_empresas.user_cliente
IS 'textField';

COMMENT ON COLUMN public.nwmaker_users_empresas.idCallGroup
IS 'textField';

COMMENT ON COLUMN public.nwmaker_users_empresas.user_cliente
IS 'textField';

COMMENT ON COLUMN public.nwmaker_users_empresas.isGroup
IS 'textField';

COMMENT ON COLUMN public.nwmaker_users_empresas.usersGroup
IS 'textField';

COMMENT ON COLUMN public.nwmaker_users_empresas.last_connection
IS 'textField';

COMMENT ON COLUMN public.nwmaker_users_empresas.status_connection
IS 'textField';

COMMENT ON COLUMN public.nwmaker_users_empresas.dispositivo
IS 'textField';

COMMENT ON COLUMN public.nwmaker_users_empresas.email
IS 'textField';

COMMENT ON COLUMN public.nwmaker_users_empresas.nombres_apellidos
IS 'textField';

COMMENT ON COLUMN public.nwmaker_users_empresas.terminal_asociada
IS 'selectBox,terminales';

COMMENT ON COLUMN public.nwmaker_users_empresas.foto_perfil
IS 'uploader';

";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
CREATE TABLE IF NOT EXISTS nwmaker_modulos_home (
  id serial NOT NULL ,
  orden integer,
  modulo integer ,
  usuario varchar(90),
  empresa integer ,
  perfil integer ,
  activo varchar(20) ,
  ancho varchar(8) ,
  flotante varchar(8) ,
  PRIMARY KEY (id)
);

COMMENT ON COLUMN public.nwmaker_modulos_home.id
IS 'textField,0,false';

COMMENT ON COLUMN public.nwmaker_modulos_home.orden
IS 'textField';

COMMENT ON COLUMN public.nwmaker_modulos_home.flotante
IS 'selectBox,array';

COMMENT ON COLUMN public.nwmaker_modulos_home.ancho
IS 'textField';

COMMENT ON COLUMN public.nwmaker_modulos_home.modulo
IS 'selectBox,nwmaker_modulos';

COMMENT ON COLUMN public.nwmaker_modulos_home.usuario
IS 'textField,0,false';

COMMENT ON COLUMN public.nwmaker_modulos_home.empresa
IS 'textField,0,false';

COMMENT ON COLUMN public.nwmaker_modulos_home.activo
IS 'selectBox,array';

COMMENT ON COLUMN public.nwmaker_modulos_home.perfil
IS 'selectBox,nwmaker_perfiles';

";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
CREATE TABLE IF NOT EXISTS nwmaker_login_profesiones (
    id serial NOT NULL,
  nombre varchar(100) ,
  terminal varchar(100) ,
  nwmaker_login_profesiones text,
  fecha timestamp ,
  PRIMARY KEY (id)
);

COMMENT ON COLUMN public.nwmaker_login_profesiones.id
IS 'textField,0,false';

COMMENT ON COLUMN public.nwmaker_login_profesiones.nombre
IS 'textField';

COMMENT ON COLUMN public.nwmaker_login_profesiones.nwmaker_login_profesiones
IS 'textField';

COMMENT ON COLUMN public.nwmaker_login_profesiones.terminal
IS 'selectBox,terminales';

COMMENT ON COLUMN public.nwmaker_login_profesiones.fecha
IS 'textField';

";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
CREATE TABLE IF NOT EXISTS nwmaker_perfiles_autorizados (
    id serial NOT NULL,
  perfil_principal integer,
  perfil_autorizado integer ,
  usuario varchar(100),
  PRIMARY KEY (id)
);

COMMENT ON COLUMN public.nwmaker_perfiles_autorizados.id
IS 'textField,0,false';

COMMENT ON COLUMN public.nwmaker_perfiles_autorizados.perfil_principal
IS 'selectBox,nwmaker_perfiles';

COMMENT ON COLUMN public.nwmaker_perfiles_autorizados.perfil_autorizado
IS 'selectBox,nwmaker_perfiles';

COMMENT ON COLUMN public.nwmaker_perfiles_autorizados.usuario
IS 'textField,0,false';


";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
  CREATE TABLE IF NOT EXISTS nwmaker_idiomas (
  id serial NOT NULL ,
  nombre varchar(120) NOT NULL,
  PRIMARY KEY (id)
);

COMMENT ON COLUMN public.nwmaker_idiomas.id
IS 'textField,0,false';

COMMENT ON COLUMN public.nwmaker_idiomas.nombre
IS 'textField';

";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
CREATE TABLE IF NOT EXISTS nwmaker_puntaje_historico (
    id serial NOT NULL,
  usuario varchar(100) ,
  usuario_califica varchar(100),
  calificacion integer,
  fecha timestamp ,
  PRIMARY KEY (id)
);

";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
CREATE TABLE IF NOT EXISTS nwmaker_domains_autorizados (
    id serial NOT NULL,
  usuario varchar(100) ,
  nombre varchar(100),
  pagina varchar(3),
  PRIMARY KEY (id)
);

COMMENT ON COLUMN public.nwmaker_domains_autorizados.id
IS 'textField,0,false';

COMMENT ON COLUMN public.nwmaker_domains_autorizados.usuario
IS 'textField,0,false';

COMMENT ON COLUMN public.nwmaker_domains_autorizados.nombre
IS 'textField';

COMMENT ON COLUMN public.nwmaker_domains_autorizados.pagina
IS 'textField';

";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
CREATE TABLE IF NOT EXISTS nwmaker_terminos_condiciones (
    id serial NOT NULL,
  nombre varchar(100),
  html text ,
  activo varchar(2) ,
  fecha date,
  PRIMARY KEY (id)
);

COMMENT ON COLUMN public.nwmaker_terminos_condiciones.id
IS 'textField,0,false';

COMMENT ON COLUMN public.nwmaker_terminos_condiciones.nombre
IS 'textField';

COMMENT ON COLUMN public.nwmaker_terminos_condiciones.html
IS 'ckeditor';

COMMENT ON COLUMN public.nwmaker_terminos_condiciones.activo
IS 'selectBox,boolean';

COMMENT ON COLUMN public.nwmaker_terminos_condiciones.fecha
IS 'dateField';

";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
CREATE TABLE IF NOT EXISTS nwmaker_departamentos (
    id serial NOT NULL,
  nombre varchar(70),
  usuario_cliente varchar(100),
  terminal integer,
  PRIMARY KEY (id)
);

COMMENT ON COLUMN public.nwmaker_departamentos.id
IS 'textField,0,false';

COMMENT ON COLUMN public.nwmaker_departamentos.nombre
IS 'textField';

COMMENT ON COLUMN public.nwmaker_departamentos.usuario_cliente
IS 'textField';

COMMENT ON COLUMN public.nwmaker_departamentos.terminal
IS 'selectBox,terminales';

";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
CREATE TABLE IF NOT EXISTS nwmaker_usuarios_log (
    id serial NOT NULL,
  usuario varchar(100) ,
  estado varchar(30) ,
  terminal integer,
  fecha timestamp  ,
  PRIMARY KEY (id)
);

COMMENT ON COLUMN public.nwmaker_usuarios_log.id
IS 'textField,0,false';

COMMENT ON COLUMN public.nwmaker_usuarios_log.usuario
IS 'textField';

COMMENT ON COLUMN public.nwmaker_usuarios_log.estado
IS 'textField';

COMMENT ON COLUMN public.nwmaker_usuarios_log.terminal
IS 'textField';

COMMENT ON COLUMN public.nwmaker_usuarios_log.fecha
IS 'textField,0,false';

";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
CREATE TABLE IF NOT EXISTS nwmaker_suscriptorsPush (
    id serial NOT NULL ,
  usuario varchar(80) ,
  json text  ,
  endpoint varchar(150) ,
  userPublicKey varchar(150),
  userAuthToken varchar(100),
  fecha date,
  PRIMARY KEY (id)
);

COMMENT ON COLUMN public.nwmaker_suscriptorsPush.id
IS 'textField,0,false';

COMMENT ON COLUMN public.nwmaker_suscriptorsPush.usuario
IS 'textField,0,false';

COMMENT ON COLUMN public.nwmaker_suscriptorsPush.fecha
IS 'dateField';

";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
CREATE TABLE IF NOT EXISTS galeria_noticias_config (
  id serial NOT NULL,
  pagina integer NOT NULL,
  autoslide varchar(2),
  animation varchar(50),
  showbar varchar(2),
  pagination varchar(2),
  thumbnails varchar(2),
  height varchar(20),
  speed varchar(20),
  easing varchar(20),
  show_play_stop varchar(10),
  tipo varchar(5),
  show_descripcion varchar(2),
  position_description varchar(40),
  fondo_descripcion varchar(50),
  tipo_thumbs_textos varchar(50),
  overlay varchar(2) ,
  mostrar_flechas varchar(2) ,
  width varchar(10),
  html varchar(2),
  usuario varchar(80) NOT NULL ,
  fecha timestamp NOT NULL ,
  imagen_mode varchar(30)
);

COMMENT ON COLUMN public.galeria_noticias_config.id
IS 'textField,0,false';

COMMENT ON COLUMN public.galeria_noticias_config.pagina
IS 'selectBox,paginas';

COMMENT ON COLUMN public.galeria_noticias_config.height
IS 'textField';

COMMENT ON COLUMN public.galeria_noticias_config.fecha
IS 'dateField';

COMMENT ON COLUMN public.galeria_noticias_config.tipo
IS 'textField';

COMMENT ON COLUMN public.galeria_noticias_config.speed
IS 'textField';

COMMENT ON COLUMN public.galeria_noticias_config.fondo_descripcion
IS 'textField';

COMMENT ON COLUMN public.galeria_noticias_config.width
IS 'textField';

COMMENT ON COLUMN public.galeria_noticias_config.imagen_mode
IS 'selectBox,array';

COMMENT ON COLUMN public.galeria_noticias_config.autoslide
IS 'selectBox,array';

COMMENT ON COLUMN public.galeria_noticias_config.html
IS 'selectBox,array';

COMMENT ON COLUMN public.galeria_noticias_config.mostrar_flechas
IS 'selectBox,array';

COMMENT ON COLUMN public.galeria_noticias_config.overlay
IS 'selectBox,array';

COMMENT ON COLUMN public.galeria_noticias_config.tipo_thumbs_textos
IS 'selectBox,array';

COMMENT ON COLUMN public.galeria_noticias_config.animation
IS 'selectBox,array';

COMMENT ON COLUMN public.galeria_noticias_config.show_descripcion
IS 'selectBox,array';

COMMENT ON COLUMN public.galeria_noticias_config.easing
IS 'selectBox,array';

COMMENT ON COLUMN public.galeria_noticias_config.position_description
IS 'selectBox,array';

COMMENT ON COLUMN public.galeria_noticias_config.showbar
IS 'selectBox,array';

COMMENT ON COLUMN public.galeria_noticias_config.pagination
IS 'selectBox,array';

COMMENT ON COLUMN public.galeria_noticias_config.thumbnails
IS 'selectBox,array';

COMMENT ON COLUMN public.galeria_noticias_config.show_play_stop
IS 'selectBox,array';

COMMENT ON COLUMN public.galeria_noticias_config.usuario
IS 'textField,0,false';

COMMENT ON COLUMN public.galeria_noticias_config.fecha
IS 'dateField';

";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
CREATE TABLE IF NOT EXISTS nwmaker_tarjetascredito (
    id serial NOT NULL,
  usuario varchar(100),
  nombre varchar(100),
  numero_tarjeta varchar(100),
  fecha_vencimiento varchar(100),
  codigo_seguridad varchar(100),
  nombre_banco varchar(100),
  fecha date,
  PRIMARY KEY (id)
);

COMMENT ON COLUMN public.nwmaker_tarjetascredito.id
IS 'textField,0,false';

COMMENT ON COLUMN public.nwmaker_tarjetascredito.usuario
IS 'textField';

COMMENT ON COLUMN public.nwmaker_tarjetascredito.nombre
IS 'textField';

COMMENT ON COLUMN public.nwmaker_tarjetascredito.numero_tarjeta
IS 'textField';

COMMENT ON COLUMN public.nwmaker_tarjetascredito.fecha_vencimiento
IS 'textField';

COMMENT ON COLUMN public.nwmaker_tarjetascredito.codigo_seguridad
IS 'textField';

COMMENT ON COLUMN public.nwmaker_tarjetascredito.nombre_banco
IS 'textField';

COMMENT ON COLUMN public.nwmaker_tarjetascredito.fecha
IS 'textField';

";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = ";
CREATE TABLE IF NOT EXISTS nwmaker_sessions (
    id serial NOT NULL ,
  usuario varchar(100),
  key_tmp varchar(100),
  session_id varchar(40),
  terminal integer,
  PRIMARY KEY (id)
);

COMMENT ON COLUMN public.nwmaker_sessions.id
IS 'textField,0,false';

COMMENT ON COLUMN public.nwmaker_sessions.usuario
IS 'textField,0,false';

COMMENT ON COLUMN public.nwmaker_sessions.key_tmp
IS 'textField,0,false';

COMMENT ON COLUMN public.nwmaker_sessions.session_id
IS 'textField';

COMMENT ON COLUMN public.nwmaker_sessions.terminal
IS 'textField,0,false';

";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
CREATE TABLE IF NOT EXISTS nwmaker_notificaciones (
    id serial NOT NULL ,
  usuario_recibe varchar(100) ,
  usuario_envia varchar(100),
  leido varchar(2),
  tipo varchar(5)  ,
  fecha_envio timestamp  ,
  mensaje text ,
  fecha_aviso_recordat TIMESTAMP ,
  tipo_aviso_recordat VARCHAR( 5 ) ,
  link VARCHAR( 130 ) ,
  modo_window VARCHAR( 10 ),
  title VARCHAR( 100 ),
  icon VARCHAR( 100 ),
  id_objetivo INTEGER,
  PRIMARY KEY (id)
);

COMMENT ON COLUMN public.nwmaker_notificaciones.id
IS 'textField,0,false';

COMMENT ON COLUMN public.nwmaker_notificaciones.usuario_recibe
IS 'textField';

COMMENT ON COLUMN public.nwmaker_notificaciones.title
IS 'textField';

COMMENT ON COLUMN public.nwmaker_notificaciones.icon
IS 'textField';

COMMENT ON COLUMN public.nwmaker_notificaciones.usuario_envia
IS 'textField';

COMMENT ON COLUMN public.nwmaker_notificaciones.leido
IS 'textField';

COMMENT ON COLUMN public.nwmaker_notificaciones.tipo
IS 'textField';

COMMENT ON COLUMN public.nwmaker_notificaciones.id_objetivo
IS 'textField';

COMMENT ON COLUMN public.nwmaker_notificaciones.fecha_envio
IS 'textField';

COMMENT ON COLUMN public.nwmaker_notificaciones.mensaje
IS 'textField';

COMMENT ON COLUMN public.nwmaker_notificaciones.fecha_aviso_recordat
IS 'textField';

COMMENT ON COLUMN public.nwmaker_notificaciones.tipo_aviso_recordat
IS 'textField';

";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
CREATE TABLE IF NOT EXISTS nwmaker_planes (
    id serial NOT NULL,
  nombre varchar(150) ,
  valor varchar(80),
  descripcion varchar(150),
  usuario varchar(100),
  PRIMARY KEY (id)
);

COMMENT ON COLUMN public.nwmaker_planes.id
IS 'textField,0,false';

COMMENT ON COLUMN public.nwmaker_planes.nombre
IS 'textField';

COMMENT ON COLUMN public.nwmaker_planes.valor
IS 'textField';

COMMENT ON COLUMN public.nwmaker_planes.descripcion
IS 'ckeditor';

COMMENT ON COLUMN public.nwmaker_planes.usuario
IS 'textField,0,false';

";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
CREATE TABLE IF NOT EXISTS nw_admindb_configurations (
  id serial NOT NULL,
  usuario varchar(150) ,
  view_compilation boolean,
  PRIMARY KEY (id)
);

";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = " 
CREATE TABLE IF NOT EXISTS sop_calificaciones (
  id Serial NOT NULL,
  id_visitante integer,
  terminal integer,
  asesor varchar(150),
  fecha date ,
  calificacion integer,
  ip varchar(150)
);
";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
CREATE TABLE IF NOT EXISTS sop_operadores (
  id Serial,
  usuario text,
  fecha TIMESTAMP(0) WITHOUT TIME ZONE ,
  estado varchar(20) ,
  empresa integer,
  terminal integer ,
  nombre varchar(200) 
);

";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
CREATE TABLE IF NOT EXISTS sop_visitas (
  id serial,
  id_visitante integer,
  url varchar(200) ,
  ip varchar(100),
  terminal integer ,
  fecha TIMESTAMP(0) WITHOUT TIME ZONE ,
  visitas integer 
);

";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
CREATE TABLE IF NOT EXISTS sop_chat (
  id serial ,
  visitante integer ,
  texto text,
  leido integer ,
  usuario varchar(150),
  fecha TIMESTAMP(0) WITHOUT TIME ZONE ,
  empresa integer,
  terminal integer,
  tipo_user varchar(20),
  ip varchar(100),
  nombre_operador varchar(150) ,
  foto_usuario varchar(150),
  status varchar(20),
  num_envio varchar(15),
  dispositivo varchar(20) 
);
";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
ALTER TABLE public.sop_chat
  ADD COLUMN id_session VARCHAR(100);";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
CREATE TABLE IF NOT EXISTS sop_config (
   id serial, 
  texto_bienvenida text, 
  img_online text, 
  img_offline text, 
  banner text, 
  usuario varchar(150), 
  terminal integer, 
  empresa integer, 
  actualizado varchar(2), 
  texto_registro text, 
  mensaje_buscando_op text, 
  mensaje_ingresa_operador text, 
  mensaje_vuelve_operador text, 
  activo varchar(2), 
  codigo_oculto text, 
  registro_usar_nombre varchar(2), 
  registro_usar_email varchar(2), 
  registro_usar_celular varchar(2), 
  requiere_redireccion_a_seccion varchar(2), 
  foto_autorespondedor varchar(80), 
  mobile_img_online varchar(80), 
  mobile_img_offline varchar(80), 
  foto_perfil_generica_agentes varchar(120), 
  distribuir_llamadas varchar(20), 
  maxima_llamadas_agente integer, 
  info_site varchar(200)
);
";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
CREATE TABLE IF NOT EXISTS sop_visitantes (
   id serial, 
  nombre varchar(210), 
  correo varchar(220), 
  ip varchar(110), 
  host varchar(200), 
  estado varchar(50) DEFAULT 'CONECTADO'::character varying, 
  atiende varchar(30), 
  fecha TIMESTAMP WITHOUT TIME ZONE, 
  usuario varchar(30), 
  empresa varchar(100), 
  url text, 
  navegador varchar(50), 
  terminal integer, 
  pais varchar(200), 
  ciudad varchar(200), 
  latitud varchar(50), 
  longitud varchar(50), 
  visita integer DEFAULT 1, 
  device varchar(150), 
  userscallintern varchar(250), 
  userscallintern_d varchar(250), 
  tipo varchar(150), 
  id_session varchar(50), 
  celular varchar(50), 
  sala integer, 
  sala_text varchar(80), 
  departamento varchar(80), 
  fecha_ultima_interaccion_operador TIMESTAMP WITHOUT TIME ZONE, 
  fecha_ultima_interaccion_cliente TIMESTAMP WITHOUT TIME ZONE
);
";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
CREATE TABLE IF NOT EXISTS galeria_noticias (
  id serial NOT NULL,
  contenido text,
  imagen text,
  otro text,
  pagina text,
  tipo INTEGER,
  otro_dos varchar(180),
  usuario varchar(80),
  fecha timestamp NOT NULL,
  orden INTEGER,
  publicado varchar(2),
  video varchar(2),
  video_url varchar(200) 
);

COMMENT ON COLUMN public.galeria_noticias.id
IS 'textField,0,false';

COMMENT ON COLUMN public.galeria_noticias.imagen
IS 'uploader';

COMMENT ON COLUMN public.galeria_noticias.otro
IS 'textField';

COMMENT ON COLUMN public.galeria_noticias.orden
IS 'textField';

COMMENT ON COLUMN public.galeria_noticias.video_url
IS 'textField';

COMMENT ON COLUMN public.galeria_noticias.publicado
IS 'selectBox,boolean';

COMMENT ON COLUMN public.galeria_noticias.video
IS 'selectBox,array';

COMMENT ON COLUMN public.galeria_noticias.fecha
IS 'dateField';

COMMENT ON COLUMN public.galeria_noticias.tipo
IS 'textField';

COMMENT ON COLUMN public.galeria_noticias.otro_dos
IS 'textField';

COMMENT ON COLUMN public.galeria_noticias.contenido
IS 'ckeditor';

COMMENT ON COLUMN public.galeria_noticias.usuario
IS 'textField,0,false';

COMMENT ON COLUMN public.galeria_noticias.pagina
IS 'selectBox,paginas';

";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
CREATE TABLE IF NOT EXISTS sop_destinatarios_contact (
  id serial ,
  usuario varchar(80),
  correo varchar(150),
  terminal integer ,
  empresa integer 
) ;

COMMENT ON COLUMN public.sop_destinatarios_contact.id
IS 'textField,0,false';

COMMENT ON COLUMN public.sop_destinatarios_contact.usuario
IS 'textField,0,false';

COMMENT ON COLUMN public.sop_destinatarios_contact.correo
IS 'textField';

COMMENT ON COLUMN public.sop_destinatarios_contact.terminal
IS 'textField,0,false';

COMMENT ON COLUMN public.sop_destinatarios_contact.empresa
IS 'textField,0,false';

";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
CREATE TABLE IF NOT EXISTS sop_adjuntos (
  id serial,
  nombre varchar(100),
  visitante integer ,
  fecha date ,
  empresa integer ,
  usuario varchar(100)
);

COMMENT ON COLUMN public.sop_adjuntos.id
IS 'textField,0,false';

COMMENT ON COLUMN public.sop_adjuntos.usuario
IS 'textField,0,false';

COMMENT ON COLUMN public.sop_adjuntos.visitante
IS 'textField';

COMMENT ON COLUMN public.sop_adjuntos.nombre
IS 'textField';

COMMENT ON COLUMN public.sop_adjuntos.fecha
IS 'textField,0,false';

COMMENT ON COLUMN public.sop_adjuntos.empresa
IS 'textField,0,false';

";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
CREATE TABLE IF NOT EXISTS  sop_mensajes (
  id serial ,
  nombre varchar(100),
  correo varchar(100),
  celular varchar(100),
  fecha timestamp NULL,
  mensaje text,
  terminal integer
);


COMMENT ON COLUMN public.sop_mensajes.id
IS 'textField,0,false';

COMMENT ON COLUMN public.sop_mensajes.correo
IS 'textField';

COMMENT ON COLUMN public.sop_mensajes.celular
IS 'textField';

COMMENT ON COLUMN public.sop_mensajes.mensaje
IS 'textField';

COMMENT ON COLUMN public.sop_mensajes.nombre
IS 'textField';

COMMENT ON COLUMN public.sop_mensajes.terminal
IS 'textField,0,false';

";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
CREATE TABLE IF NOT EXISTS sop_plantillas (
  id serial,
  nombre varchar(100) ,
  fecha date ,
  empresa integer,
  usuario varchar(100),
  texto text
) ;

COMMENT ON COLUMN public.sop_plantillas.id
IS 'textField,0,false';

COMMENT ON COLUMN public.sop_plantillas.nombre
IS 'textField';

COMMENT ON COLUMN public.sop_plantillas.usuario
IS 'textField,0,false';

COMMENT ON COLUMN public.sop_plantillas.empresa
IS 'textField,0,false';

COMMENT ON COLUMN public.sop_plantillas.fecha
IS 'textField,0,false';

COMMENT ON COLUMN public.sop_plantillas.texto
IS 'textArea';

";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
CREATE TABLE IF NOT EXISTS  sop_secciones (
  id serial,
  nombre varchar(50),
  descripcion text
  imagen varchar(100),
  activo varchar(2),
  usuario varchar(100),
  redirecciona_al_chat varchar(2),
  redirecciona_al_mostrar_info varchar(2),
  texto_redireccion_info text ,
  terminal integer 
);

COMMENT ON COLUMN public.sop_secciones.id
IS 'textField,0,false';

COMMENT ON COLUMN public.sop_secciones.usuario
IS 'textField,0,false';

COMMENT ON COLUMN public.sop_secciones.terminal
IS 'textField,0,false';

COMMENT ON COLUMN public.sop_secciones.nombre
IS 'textField';

COMMENT ON COLUMN public.sop_secciones.descripcion
IS 'textArea';

COMMENT ON COLUMN public.sop_secciones.imagen
IS 'uploader';

COMMENT ON COLUMN public.sop_secciones.texto_redireccion_info
IS 'ckeditor';

COMMENT ON COLUMN public.sop_secciones.activo
IS 'selectBox,boolean';

COMMENT ON COLUMN public.sop_secciones.redirecciona_al_chat
IS 'selectBox,boolean';

COMMENT ON COLUMN public.sop_secciones.redirecciona_al_mostrar_info
IS 'selectBox,boolean';
";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
CREATE TABLE IF NOT EXISTS nwmaker_codigo_oculto (
  id Serial  NOT NULL ,
  codigo_css text ,
  activo VARCHAR(2),
  buscar_minimizado VARCHAR(2),
  solicitar_pago VARCHAR(2),
  multi_terminal VARCHAR(2),
  menu_vertical VARCHAR(2),
  permitir_chat VARCHAR(2),
  solicitar_completar_perfil VARCHAR(2),
  mostrar_chat_al_inicio VARCHAR(2),
  workLocal VARCHAR(2),
  useApiGoogleMaps VARCHAR(2),
  menu_para_qxnw VARCHAR(2),
  pedir_aceptar_terminos_interno VARCHAR(2),
  no_mostrar_foto_name_email_left VARCHAR(2),
  permitir_cargar_moduleshome_get VARCHAR(2),
  mostrar_primero_menu_que_modulos_home VARCHAR(2),
  usar_permisos_por_perfiles VARCHAR(2),
  menu_cache VARCHAR(2),
  mostrar_info_user_left VARCHAR(2),
  backgroundPage VARCHAR(200),
  lateral_left_alto_completo VARCHAR(2),
  usar_permisos_por_pagina VARCHAR(2),
  offlineNwDual VARCHAR(2),
  activeServerWorker VARCHAR(2),
  show_about VARCHAR(2),
  menu_movil_en_pc VARCHAR(2) DEFAULT  'SI',
  tipo_menu VARCHAR(15),
  tipo_menu_mobile VARCHAR(15),
  usuario VARCHAR(80) ,
  logotipo VARCHAR(80) ,
  fondo_barra_enc VARCHAR(80) ,
  url_javascript_principal VARCHAR(80) ,
  empresa integer ,
  codigo_libre text ,
  alto_barra_enc VARCHAR(5) ,
  ancho_menu_left VARCHAR(5) ,
  PRIMARY KEY (id)
);

COMMENT ON COLUMN public.nwmaker_codigo_oculto.id
IS 'textField,0,false';

COMMENT ON COLUMN public.nwmaker_codigo_oculto.codigo_css
IS 'textArea';

COMMENT ON COLUMN public.nwmaker_codigo_oculto.codigo_libre
IS 'textArea';

COMMENT ON COLUMN public.nwmaker_codigo_oculto.alto_barra_enc
IS 'textField';

COMMENT ON COLUMN public.nwmaker_codigo_oculto.ancho_menu_left
IS 'textField';

COMMENT ON COLUMN public.nwmaker_codigo_oculto.url_javascript_principal
IS 'textField';

COMMENT ON COLUMN public.nwmaker_codigo_oculto.backgroundPage
IS 'textField';

COMMENT ON COLUMN public.nwmaker_codigo_oculto.menu_movil_en_pc
IS 'selectBox,boolean';

COMMENT ON COLUMN public.nwmaker_codigo_oculto.workLocal
IS 'selectBox,boolean';

COMMENT ON COLUMN public.nwmaker_codigo_oculto.menu_cache
IS 'selectBox,boolean';

COMMENT ON COLUMN public.nwmaker_codigo_oculto.show_about
IS 'selectBox,boolean';

COMMENT ON COLUMN public.nwmaker_codigo_oculto.activeServerWorker
IS 'selectBox,boolean';

COMMENT ON COLUMN public.nwmaker_codigo_oculto.useApiGoogleMaps
IS 'selectBox,boolean';

COMMENT ON COLUMN public.nwmaker_codigo_oculto.mostrar_chat_al_inicio
IS 'selectBox,boolean';

COMMENT ON COLUMN public.nwmaker_codigo_oculto.menu_para_qxnw
IS 'selectBox,boolean';

COMMENT ON COLUMN public.nwmaker_codigo_oculto.offlineNwDual
IS 'selectBox,boolean';

COMMENT ON COLUMN public.nwmaker_codigo_oculto.solicitar_completar_perfil
IS 'selectBox,boolean';

COMMENT ON COLUMN public.nwmaker_codigo_oculto.no_mostrar_foto_name_email_left
IS 'selectBox,boolean';

COMMENT ON COLUMN public.nwmaker_codigo_oculto.pedir_aceptar_terminos_interno
IS 'selectBox,boolean';

COMMENT ON COLUMN public.nwmaker_codigo_oculto.permitir_chat
IS 'selectBox,boolean';

COMMENT ON COLUMN public.nwmaker_codigo_oculto.menu_vertical
IS 'selectBox,boolean';

COMMENT ON COLUMN public.nwmaker_codigo_oculto.multi_terminal
IS 'selectBox,boolean';

COMMENT ON COLUMN public.nwmaker_codigo_oculto.permitir_cargar_moduleshome_get
IS 'selectBox,boolean';

COMMENT ON COLUMN public.nwmaker_codigo_oculto.usar_permisos_por_pagina
IS 'selectBox,boolean';

COMMENT ON COLUMN public.nwmaker_codigo_oculto.solicitar_pago
IS 'selectBox,boolean';

COMMENT ON COLUMN public.nwmaker_codigo_oculto.mostrar_primero_menu_que_modulos_home
IS 'selectBox,boolean';

COMMENT ON COLUMN public.nwmaker_codigo_oculto.usar_permisos_por_perfiles
IS 'selectBox,boolean';

COMMENT ON COLUMN public.nwmaker_codigo_oculto.mostrar_info_user_left
IS 'selectBox,boolean';

COMMENT ON COLUMN public.nwmaker_codigo_oculto.lateral_left_alto_completo
IS 'selectBox,boolean';

COMMENT ON COLUMN public.nwmaker_codigo_oculto.fondo_barra_enc
IS 'colorButton';

COMMENT ON COLUMN public.nwmaker_codigo_oculto.buscar_minimizado
IS 'selectBox,boolean';

COMMENT ON COLUMN public.nwmaker_codigo_oculto.logotipo
IS 'uploader';

COMMENT ON COLUMN public.nwmaker_codigo_oculto.activo
IS 'selectBox,array';

COMMENT ON COLUMN public.nwmaker_codigo_oculto.tipo_menu
IS 'selectBox,array';

COMMENT ON COLUMN public.nwmaker_codigo_oculto.tipo_menu_mobile
IS 'selectBox,array';

COMMENT ON COLUMN public.nwmaker_codigo_oculto.usuario
IS 'textField,0,false';

COMMENT ON COLUMN public.nwmaker_codigo_oculto.empresa
IS 'textField,0,false';


";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "  ALTER TABLE  sop_visitantes ADD  userscallintern VARCHAR( 250 ) NULL ;";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "  ALTER TABLE  sop_visitantes ADD  userscallintern_d VARCHAR( 250 ) NULL ;";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "  ALTER TABLE  sop_visitantes ADD  tipo VARCHAR( 20 ) NULL ; ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "  ALTER TABLE  sop_visitantes ADD  id_session VARCHAR( 50 ) NULL ; ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "  ALTER TABLE  sop_visitantes ADD  celular VARCHAR( 50 ) NULL ; ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "  ALTER TABLE  sop_visitantes ADD  sala INTEGER NULL ; ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "  ALTER TABLE  sop_visitantes ADD  sala_text VARCHAR( 80 ) NULL ; ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "  ALTER TABLE  sop_visitantes ADD  departamento VARCHAR( 80 ) NULL ; ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "  ALTER TABLE  sop_visitantes ADD  fecha_ultima_interaccion_operador timestamp NULL ; ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "  ALTER TABLE  sop_visitantes ADD  fecha_ultima_interaccion_cliente timestamp NULL ; ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "ALTER TABLE public.empresas
                ADD COLUMN plantilla_bienvenida VARCHAR(50);

                COMMENT ON COLUMN public.empresas.plantilla_bienvenida
                IS 'textField';";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "  CREATE TABLE  IF NOT EXISTS paginas (
  id SERIAL NOT NULL,
  nombre text NOT NULL ,
  fecha_ingreso timestamp NOT NULL ,
  idioma INTEGER ,
  titulo text NOT NULL ,
  descripcion text NOT NULL ,
  palabras_clave text NOT NULL ,
  lenguaje text ,
  terminal INTEGER NOT NULL  
);

COMMENT ON COLUMN public.paginas.id
IS 'textField,0,false';

COMMENT ON COLUMN public.paginas.nombre
IS 'textField';

COMMENT ON COLUMN public.paginas.fecha_ingreso
IS 'textField,0,dateField';

COMMENT ON COLUMN public.paginas.idioma
IS 'selectBox,idiomas';

COMMENT ON COLUMN public.paginas.lenguaje
IS 'selectBox,idiomas';

COMMENT ON COLUMN public.paginas.terminal
IS 'selectBox,terminales';

COMMENT ON COLUMN public.paginas.titulo
IS 'textField';

COMMENT ON COLUMN public.paginas.descripcion
IS 'textArea';

COMMENT ON COLUMN public.paginas.palabras_clave
IS 'textArea';

";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "  
CREATE TABLE IF NOT EXISTS sop_config (
  id SERIAL NOT NULL,
  texto_bienvenida text,
  img_online text,
  img_offline text,
  banner text,
  usuario varchar(150),
  terminal INTEGER ,
  empresa INTEGER ,
  actualizado varchar(2) ,
  texto_registro text,
  mensaje_buscando_op text,
  mensaje_ingresa_operador text,
  mensaje_vuelve_operador text,
  activo varchar(2) ,
  codigo_oculto text,
  registro_usar_nombre varchar(2),
  registro_usar_email varchar(2) ,
  registro_usar_celular varchar(2),
  requiere_redireccion_a_seccion varchar(2),
  foto_autorespondedor varchar(80),
  mobile_img_online varchar(80),
  mobile_img_offline varchar(80),
  foto_perfil_generica_agentes varchar(120),
  distribuir_llamadas varchar(20),
  maxima_llamadas_agente INTEGER,
  info_site varchar(200)
);

COMMENT ON COLUMN public.sop_config.id
IS 'textField,0,false';

COMMENT ON COLUMN public.sop_config.activo
IS 'selectBox,array';

COMMENT ON COLUMN public.sop_config.textField
IS 'selectBox,array';

COMMENT ON COLUMN public.sop_config.distribuir_llamadas
IS 'selectBox,array';

COMMENT ON COLUMN public.sop_config.registro_usar_nombre
IS 'selectBox,boolean';

COMMENT ON COLUMN public.sop_config.registro_usar_email
IS 'selectBox,boolean';

COMMENT ON COLUMN public.sop_config.registro_usar_celular
IS 'selectBox,boolean';

COMMENT ON COLUMN public.sop_config.requiere_redireccion_a_seccion
IS 'selectBox,boolean';

COMMENT ON COLUMN public.sop_config.foto_autorespondedor
IS 'selectBox,boolean';

COMMENT ON COLUMN public.sop_config.foto_autorespondedor
IS 'uploader';

COMMENT ON COLUMN public.sop_config.mobile_img_online
IS 'uploader';

COMMENT ON COLUMN public.sop_config.mobile_img_offline
IS 'uploader';

COMMENT ON COLUMN public.sop_config.foto_perfil_generica_agentes
IS 'uploader';

";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "  
 CREATE TABLE IF NOT EXISTS sop_visitantes (
  id serial,
  nombre varchar(100),
  correo varchar(100),
  ip varchar(100),
  host varchar(200),
  estado varchar(50),
  atiende varchar(150),
  fecha TIMESTAMP(0) WITHOUT TIME ZONE,
  usuario varchar(150),
  empresa varchar(100) ,
  url text,
  navegador varchar(50),
  terminal integer,
  pais varchar(200),
  ciudad varchar(200),
  latitud varchar(50),
  longitud varchar(50),
  visita integer ,
  device varchar(150),
  celular varchar(15),
  fecha_ultima_interaccion_cliente date,
  sala integer,
  sala_text varchar(80),
  departamento varchar(150),
  tipo varchar(20),
  userscallintern varchar(250),
  userscallintern_d varchar(250)
);

";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
COMMENT ON TABLE nwmaker_modulos  IS ' [
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
COMMENT ON TABLE sop_secciones  IS ' 
[
    {
         \"conditions \": [
            {
                 \"widget \":  \"textArea \",
                 \"action \":  \"no_filter_special_characteres \"
            }],
         \"config \": {
             \"cleanHtml \": false
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
COMMENT ON TABLE nwmaker_menu  IS ' [
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
COMMENT ON TABLE nwmaker_modulos_componentes  IS ' [
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
COMMENT ON TABLE nwmaker_codigo_oculto  IS ' [
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
COMMENT ON TABLE nwmaker_login  IS ' [
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
COMMENT ON TABLE nwmaker_modulos_home  IS ' [
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
 CREATE TABLE IF NOT EXISTS public.nw_read_user (
  id SERIAL, 
  visitas INTEGER, 
  modulo INTEGER, 
  fecha TIMESTAMP WITHOUT TIME ZONE, 
  usuario VARCHAR(80), 
  empresa INTEGER, 
  CONSTRAINT nw_read_user_pkey PRIMARY KEY(id)
) WITHOUT OIDS;";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
 CREATE TABLE IF NOT EXISTS public.nwdb_server (
  id SERIAL, 
  host text, 
  user_name VARCHAR(80), 
  nombre VARCHAR(80), 
  driver VARCHAR(80), 
  puerto VARCHAR(80), 
  password VARCHAR(80), 
  fecha TIMESTAMP WITHOUT TIME ZONE, 
  usuario VARCHAR(80), 
  empresa INTEGER, 
  PRIMARY KEY(id)
) WITHOUT OIDS;";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
 CREATE TABLE  IF NOT EXISTS nwdb_server_db (
  id SERIAL, 
  host VARCHAR(80),
  user_name VARCHAR(80), 
  puerto VARCHAR(80), 
  password VARCHAR(80), 
  db_name VARCHAR(80), 
  fecha TIMESTAMP WITHOUT TIME ZONE, 
  usuario VARCHAR(80), 
  empresa INTEGER, 
   PRIMARY KEY(id)
) WITHOUT OIDS;";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
CREATE TABLE  IF NOT EXISTS nw_equipos_ip (
    id integer NOT NULL,
    nombre character varying(100),
    empresa integer,
    usuario character varying(30),
    fecha date,
    terminal integer,
    ip character varying(100),
    mac character varying(100),
    bodega character varying(100),
    estacion character varying(100),
    otro character varying(100),
    observaciones character varying(100), 
   PRIMARY KEY(id)
);
";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
CREATE SEQUENCE nw_equipos_ip_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
CREATE TABLE  IF NOT EXISTS nw_print_forms (
    id integer NOT NULL,
    nombre character varying(100),
    empresa integer,
    usuario character varying(30),
    fecha date,
    terminal integer,
    id_relation integer,
    html TEXT, 
   PRIMARY KEY(id)
);
";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
CREATE SEQUENCE nw_print_forms_id_seq 
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "ALTER TABLE nw_keys_conf ADD COLUMN change_at_init BOOLEAN;";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "CREATE TABLE nw_cambios_claves (
            id SERIAL, 
            usuario VARCHAR(50) NOT NULL, 
            fecha DATE NOT NULL, 
            CONSTRAINT nw_cambios_claves_pk_ PRIMARY KEY(id)
            ) WITHOUT OIDS;";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "ALTER TABLE usuarios_log ADD COLUMN terminal INTEGER;";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "CREATE TABLE nw_equipos_ip (
                id INTEGER NOT NULL, 
                nombre VARCHAR(100), 
                empresa INTEGER, 
                usuario VARCHAR(30), 
                fecha DATE, 
                terminal INTEGER, 
                ip VARCHAR(100), 
                mac VARCHAR(100), 
                bodega VARCHAR(100), 
                estacion VARCHAR(100), 
                otro VARCHAR(100), 
                observaciones VARCHAR(100), 
                CONSTRAINT nw_equipos_ip_pkey PRIMARY KEY(id)
        ) WITHOUT OIDS;";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "ALTER TABLE nw_keys_conf ADD COLUMN check_terminal BOOLEAN;";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "COMMENT ON COLUMN nw_equipos_ip.id IS 'textField,0,false';";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "COMMENT ON COLUMN nw_equipos_ip.empresa IS 'textField,0,false';";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "COMMENT ON COLUMN nw_equipos_ip.usuario IS 'textField,0,false';";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "COMMENT ON COLUMN nw_equipos_ip.fecha IS 'textField,0,false';";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "COMMENT ON COLUMN nw_equipos_ip.terminal IS 'selectBox,terminales';";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "COMMENT ON COLUMN nw_equipos_ip.observaciones IS 'textArea';";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "CREATE TABLE nw_reports_excel_enc (
                id SERIAL, 
                nombre VARCHAR(100), 
                sql_query TEXT, 
                usuario VARCHAR(60), 
                fecha TIMESTAMP WITHOUT TIME ZONE, 
                empresa INTEGER, 
                CONSTRAINT nw_reports_excel_enc_pkey PRIMARY KEY(id)
               ) WITHOUT OIDS;";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "CREATE TABLE nw_reports_excel_filters (
                id SERIAL, 
                reporte INTEGER, 
                nombre VARCHAR(100), 
                label VARCHAR(100), 
                type VARCHAR(100), 
                required INTEGER, 
                descripcion TEXT
               ) WITHOUT OIDS;";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "ALTER TABLE nw_equipos_ip ADD COLUMN id_red VARCHAR(50);";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "ALTER TABLE terminales ADD COLUMN usuario VARCHAR(150);";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "ALTER TABLE terminales ADD COLUMN fecha date;";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "ALTER TABLE terminales ADD COLUMN plan varchar(2);";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "ALTER TABLE terminales ADD COLUMN activo varchar(2);";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "ALTER TABLE terminales ADD COLUMN host varchar(80);";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "ALTER TABLE terminales ADD COLUMN clave varchar(40) null;";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "ALTER TABLE nwmaker_notificaciones ADD COLUMN notificado varchar(2) null;";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "ALTER TABLE nwmaker_notificaciones ADD COLUMN send_email char(2) null;";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "ALTER TABLE nwmaker_notificaciones ADD COLUMN correo_usuario_recibe varchar(150) null;";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "ALTER TABLE nwmaker_notificaciones ADD COLUMN fecha_final TIMESTAMP NULL;";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "ALTER TABLE nwmaker_notificaciones ADD COLUMN vencida_body TEXT null;";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "ALTER TABLE nwmaker_notificaciones ADD COLUMN vencida_title varchar(100) null;";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "ALTER TABLE nwmaker_notificaciones ADD COLUMN email_is_sent char(2) null;";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "ALTER TABLE nwmaker_notificaciones ADD COLUMN date_email_is_sent TIMESTAMP NULL;";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "ALTER TABLE nwmaker_notificaciones ADD COLUMN izquierda_nomostrar_despues_de char(10) null;";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "ALTER TABLE nwmaker_notificaciones ADD COLUMN fromName varchar(80) null;";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "ALTER TABLE nwmaker_notificaciones ADD COLUMN fromEmail varchar(80) null;";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "ALTER TABLE nwmaker_notificaciones 
                ADD COLUMN send_sms char(2) null,
                ADD COLUMN celular varchar(20) null,
                ADD COLUMN sms_body varchar(200) null,
                ADD COLUMN body_email TEXT null,
                ADD COLUMN asunto_email varchar(120) null,
                ADD COLUMN terminal INTEGER null,
                ADD COLUMN solo_campana char(2) null,
                ADD COLUMN sms_date_is_sent TIMESTAMP null,
                ADD COLUMN notify_open char(2) null,
                ADD COLUMN sendNotifyPush char(2) null;
                ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "ALTER TABLE nwmaker_menu 
               ADD COLUMN icono_menu_left varchar(80) null,
               ADD COLUMN callback_code varchar(80) null,
               ADD COLUMN contiene_hijos varchar(2) null,
               ADD COLUMN nivel_hijos varchar(1) null,
               ADD COLUMN ocultar_menu_on_click varchar(2) null,
               ADD COLUMN limpiar_modulos_center varchar(2) null,
               ADD COLUMN change_url varchar(2) null,
               ADD COLUMN solo_registrados varchar(2) null
               ;
               ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "CREATE SEQUENCE public.nw_security_questions_id_seq
  INCREMENT 1 MINVALUE 1
  MAXVALUE 9223372036854775807 START 1
  CACHE 1;
               ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "CREATE TABLE nw_exp_enc (
  id SERIAL, 
  nombre VARCHAR(100), 
  usuario VARCHAR(30), 
  fecha DATE, 
  empresa INTEGER, 
  CONSTRAINT nw_exp_enc_pkey PRIMARY KEY(id)
) WITHOUT OIDS;";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "CREATE TABLE nw_exp_conections (
  id SERIAL, 
  enc INTEGER, 
  campo_origen VARCHAR(100), 
  tabla_destino VARCHAR(100), 
  campo_destino VARCHAR(100), 
  usuario VARCHAR(30), 
  fecha DATE, 
  empresa INTEGER, 
  orden INTEGER, 
  tabla_origen VARCHAR(100), 
  mostrar_como VARCHAR(100), 
  CONSTRAINT nw_exp_conections_pkey PRIMARY KEY(id)
) WITHOUT OIDS;";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "CREATE TABLE nw_exp_fields (
  id SERIAL, 
  nombre VARCHAR(100), 
  usuario VARCHAR(30), 
  fecha DATE, 
  empresa INTEGER, 
  tabla INTEGER, 
  enc INTEGER, 
  nombre_campo VARCHAR(100), 
  tipo VARCHAR(50), 
  comodin VARCHAR(100), 
  orden INTEGER, 
  CONSTRAINT nw_exp_fields_pkey PRIMARY KEY(id)
) WITHOUT OIDS;

COMMENT ON COLUMN nw_exp_fields.tipo
IS '''TABLA''';";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "CREATE TABLE nw_exp_filters (
  id SERIAL, 
  nombre VARCHAR(100), 
  usuario VARCHAR(30), 
  fecha DATE, 
  empresa INTEGER, 
  CONSTRAINT nw_exp_filters_pkey PRIMARY KEY(id)
) WITHOUT OIDS;";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "CREATE TABLE nw_exp_tables (
  id SERIAL, 
  nombre VARCHAR(100), 
  usuario VARCHAR(30), 
  fecha DATE, 
  empresa INTEGER, 
  enc INTEGER, 
  CONSTRAINT nw_exp_tables_pkey PRIMARY KEY(id)
) WITHOUT OIDS;";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "ALTER TABLE nw_exp_fields
                ADD COLUMN nombre_mostrar VARCHAR(50);";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "ALTER TABLE usuarios
                ADD COLUMN dispositivo VARCHAR(20);";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "CREATE TABLE nw_sync_enc (
        id SERIAL, 
        nombre VARCHAR(100), 
        usuario VARCHAR(30), 
        fecha DATE, 
        empresa INTEGER, 
        url VARCHAR(200), 
        CONSTRAINT nw_sync_enc_pkey PRIMARY KEY(id)
    ) WITHOUT OIDS;";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "CREATE TABLE nw_sync_history (
  id SERIAL, 
  tabla VARCHAR(100), 
  id_enviado INTEGER, 
  usuario VARCHAR(30), 
  fecha DATE, 
  empresa INTEGER, 
  CONSTRAINT nw_sync_history_pkey PRIMARY KEY(id)
) WITHOUT OIDS;";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "CREATE TABLE nw_sync_tables (
  id SERIAL, 
  nombre VARCHAR(100), 
  usuario VARCHAR(30), 
  fecha DATE, 
  empresa INTEGER, 
  enc INTEGER, 
  tipo VARCHAR(50), 
  CONSTRAINT nw_sync_tables_pkey PRIMARY KEY(id)
) WITHOUT OIDS;";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "ALTER TABLE cpr_cotizaciones ADD COLUMN adjunto TEXT;";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "ALTER TABLE sop_config ADD COLUMN requiere_redireccion_a_seccion VARCHAR(2);";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "ALTER TABLE nwmaker_notificaciones ADD COLUMN callback VARCHAR(200);";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
               ALTER TABLE usuarios 
               ADD COLUMN account_code_activation INTEGER,
               ADD COLUMN account_date_expiration DATE;
               ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
               ALTER TABLE nwmaker_sessions ADD fecha TIMESTAMP NULL;
               ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
              ALTER TABLE empresas 
              ALTER COLUMN ciudad DROP  NOT NULL,
              ALTER COLUMN direccion DROP  NOT NULL,
              ALTER COLUMN telefono DROP  NOT NULL,
              ALTER COLUMN email DROP  NOT NULL,
              ALTER COLUMN slogan DROP  NOT NULL;
               ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
               ALTER TABLE terminales ADD pais integer NULL;
               ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
               ALTER TABLE usuarios ADD usuario_principal varchar(200) NULL;
               ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
               ALTER TABLE paises 
               ADD alias VARCHAR(3) NULL,
               ADD idioma_text VARCHAR(3) NULL;
               ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "ALTER TABLE nw_exp_filters
                ADD COLUMN label VARCHAR(50); ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "ALTER TABLE nw_exp_filters
                ADD COLUMN tipo VARCHAR(30); ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "ALTER TABLE nw_exp_filters
                ADD COLUMN comparativo VARCHAR(2);";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "ALTER TABLE nw_exp_filters
                ADD COLUMN enc INTEGER;";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "ALTER TABLE nw_exp_filters
                ADD COLUMN tabla_origen VARCHAR(50);";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "ALTER TABLE usuarios
                ADD COLUMN id_session VARCHAR(55);";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "ALTER TABLE usuarios
                ADD COLUMN estado_conexion VARCHAR(25);";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "ALTER TABLE nwmaker_sessions
                ADD COLUMN fecha_ultima_conexion TIMESTAMP,
                ADD COLUMN dispositivo VARCHAR(15);";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "ALTER TABLE nwmaker_sessions
                ADD COLUMN dispositivo VARCHAR(15);";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "ALTER TABLE nwmaker_sessions ADD COLUMN cookie VARCHAR(60);";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "ALTER TABLE nwmaker_sessions ADD COLUMN device VARCHAR(30);";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "ALTER TABLE sop_visitantes
                ADD COLUMN fecha_inicio_llamada TIMESTAMP;";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "CREATE TABLE IF NOT EXISTS `nwmaker_users_info_aditional` (
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
        $sql = "ALTER TABLE nw_exp_filters
                ADD COLUMN tabla_llenado VARCHAR(50);";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "ALTER TABLE nw_exp_filters
                ADD COLUMN campo_mostrar VARCHAR(50);";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "ALTER TABLE nw_exp_fields
                ADD COLUMN operacion VARCHAR(5);";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "ALTER TABLE nw_exp_fields
                ADD COLUMN campo_fijoa VARCHAR(50);";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "ALTER TABLE nw_exp_fields
                ADD COLUMN campo_fijob VARCHAR(50);";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "ALTER TABLE nw_exp_fields
                ADD COLUMN valor_comparativo VARCHAR(50);";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = 'ALTER TABLE nwmaker_resetpass
  ADD COLUMN "user" VARCHAR(100) NULL;';
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = 'ALTER TABLE public.nw_keys_conf
  ALTER COLUMN change_at_init TYPE BOOLEAN
  USING change_at_init::boolean;';
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = 'ALTER TABLE usuarios
  ADD COLUMN "celular_validado" VARCHAR(2) NULL;';
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
CREATE TABLE IF NOT EXISTS nwmaker_current_version (
    id serial NOT NULL ,
  version varchar(50) ,
  usuario varchar(150),
  fecha DATE,
  os char(2),
  empresa INTEGER,
  perfil INTEGER,
  description varchar(25),
  PRIMARY KEY (id)
);";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = 'ALTER TABLE nwmaker_current_version
  ADD COLUMN fecha DATE NULL;';
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = 'ALTER TABLE nwmaker_current_version
  ADD COLUMN "empresa" integer NUL,
  ADD COLUMN "perfil" integer NUL,
  ADD COLUMN "os" VARCHAR(10) NUL;';
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = '
ALTER TABLE nwmaker_current_version
ADD COLUMN description VARCHAR(100);
';
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = 'ALTER TABLE nwmaker_resetpass
  ADD COLUMN "user" VARCHAR(150) NULL;';
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = 'ALTER TABLE nw_smtp
  ADD COLUMN "empresa" integer NULL;';
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = 'ALTER TABLE public.nw_registro
  ALTER COLUMN usuario TYPE VARCHAR(100) COLLATE pg_catalog."default";';
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = '
  ALTER TABLE nwmaker_modulos_home
  ADD COLUMN "perfil" integer NULL;';
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = '
  ALTER TABLE paises
  ADD COLUMN "indicativo_celular" VARCHAR(5) NULL;
  ';
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = '
  ALTER TABLE usuarios
  ADD COLUMN modificado_por VARCHAR(100);
  ';
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = '
  CREATE TABLE public.nw_import_enc (
  id SERIAL, 
  nombre VARCHAR(100), 
  ref VARCHAR(50), 
  usuario VARCHAR(30), 
  fecha DATE, 
  empresa INTEGER, 
  tipo VARCHAR(15), 
  CONSTRAINT nw_import_enc_pkey PRIMARY KEY(id)
) WITHOUT OIDS;
  ';
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = '
  CREATE TABLE public.nw_import_data (
  id SERIAL, 
  orden INTEGER, 
  char_len INTEGER, 
  clean_spaces BOOLEAN, 
  title VARCHAR(200), 
  data_type VARCHAR(50), 
  useful BOOLEAN, 
  remove_zero_left BOOLEAN, 
  enc INTEGER, 
  CONSTRAINT nw_import_data_pkey PRIMARY KEY(id)
) WITHOUT OIDS;
  ';
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
  COMMENT ON COLUMN public.nw_import_data.orden
IS 'spinner';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
  COMMENT ON COLUMN public.nw_import_data.char_len
IS 'spinner';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
  COMMENT ON COLUMN public.nw_import_data.clean_spaces
IS 'checkbox';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
  COMMENT ON COLUMN public.nw_import_data.title
IS 'textField';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
  COMMENT ON COLUMN public.nw_import_data.data_type
IS 'textField';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
  COMMENT ON COLUMN public.nw_import_data.useful
IS 'checkBox';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
  ALTER TABLE public.nw_import_enc
  ADD UNIQUE (tipo);
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
  COMMENT ON COLUMN public.nw_init_settings.fondo_login
IS 'uploader';
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "
ALTER TABLE public.usuarios
  ADD COLUMN fecha_actualizacion TIMESTAMP(0) WITHOUT TIME ZONE;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `sop_visitantes_backup` ADD `envio_email` INT NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `sop_visitantes` ADD `envio_sms` INT NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `sop_visitantes` ADD `envio_email` INT NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE `sop_visitantes_backup` ADD `envio_email` INT NULL;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
CREATE FUNCTION count_estimate(query text)
  RETURNS integer
  LANGUAGE plpgsql AS
\$func$
DECLARE
    rec   record;
    rows  integer;
BEGIN
    FOR rec IN EXECUTE 'EXPLAIN ' || query LOOP
        rows := substring(rec.\"QUERY PLAN\" FROM ' rows=([[:digit:]]+)');
        EXIT WHEN rows IS NOT NULL;
    END LOOP;

    RETURN rows;
END
\$func$;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE IF EXISTS empresas ADD COLUMN pais integer;

COMMENT ON COLUMN public.empresas.pais
    IS 'selectBox,paises';
    ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE public.nw_init_settings
  ADD COLUMN codigo_css_dashboard TEXT;";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE public.nw_init_settings
  ADD COLUMN codigo_js_dashboard TEXT;";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE IF EXISTS nw_registro
    ADD COLUMN host text;
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE paises
  ADD COLUMN zona_horaria VARCHAR(50);
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE paises
  ADD COLUMN idioma_text VARCHAR(50);
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
CREATE TABLE public.nw_usuarios_iframe (
    id serial NOT NULL,
    empresa integer,
    usuario character varying(200),
	fecha date,
	nombre character varying(100),
	usuario_api character varying(200),
	password_api character varying(150),
	profile_api character varying(200),
	company_api character varying(200),
	descripcion character varying(350)
	);
  ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "ALTER TABLE IF EXISTS nw_init_settings
    ADD COLUMN web character varying(50);";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "alter table usuarios_log add column session_id varchar(200);";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
CREATE TABLE IF NOT EXISTS nwmaker_policies_accept
(
    id integer NOT NULL DEFAULT nextval('nwmaker_policies_accept_id_seq'::regclass),
    usuario character varying(100) COLLATE pg_catalog.'default' DEFAULT NULL::character varying,
    ip character varying(100) COLLATE pg_catalog.'default' DEFAULT NULL::character varying,
    fecha timestamp without time zone,
    accept character varying(10) COLLATE pg_catalog.'default' DEFAULT NULL::character varying
);
";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE nw_init_settings ADD nwads VARCHAR(2) NULL, ADD busca_version VARCHAR(2) NULL;
";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
        ALTER TABLE IF EXISTS empresas ADD COLUMN ticket_id_customer integer DEFAULT 121;
        ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
        ALTER TABLE IF EXISTS empresas ADD COLUMN ticket_name_customer character varying(100);
        ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
                    ALTER TABLE IF EXISTS usuarios ADD COLUMN token_actual_app character varying(200);
        ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
                    ALTER TABLE IF EXISTS usuarios ADD COLUMN token_actual_app_fecha TIMESTAMP;
        ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
     ALTER TABLE IF EXISTS nwmaker_suscriptorsPush ADD COLUMN device character varying(100);
        ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
           ALTER TABLE IF EXISTS nwmaker_suscriptorsPush ADD COLUMN perfil integer;
        ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
                 ALTER TABLE IF EXISTS nwmaker_suscriptorsPush ADD COLUMN empresa integer;
        ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }


        $sql = "
CREATE  FUNCTION public.func_usuarios_empresa(
	p_usuario varchar(100))
    RETURNS text
    LANGUAGE 'plpgsql'
    COST 100
AS \$BODY$

DECLARE
  v_rta TEXT DEFAULT '';
  v_r RECORD;
BEGIN

  FOR v_r IN
  SELECT a.*,b.nombre as nom_perfil,c.razon_social as nom_empresa
  FROM usuarios_empresas a
  left join perfiles b on (a.perfil=b.id)
    left join empresas c on (a.empresa=c.id)
  WHERE a.usuario = p_usuario
  LOOP

    v_rta = v_rta || 'Perfil: ' || v_r.nom_perfil || '->(' || v_r.perfil  ||')  ::  ';
    v_rta = v_rta || 'Empresa: ' || v_r.nom_empresa || '->('|| v_r.empresa ||') <br/> ';
  END LOOP;

  --  v_rta = left(v_rta, char_length(v_rta) - 1 );
  
  RAISE NOTICE 'MUESTRA: (%)', v_rta;
  
  IF v_rta = '' THEN
  RETURN '';
  END IF;

  v_rta = substr(v_rta, 1, char_length(v_rta) - 1);

  RETURN v_rta;
END;
\$BODY$;";
        $ca->setCleanHtml(false);
        $ca->setHtmlentities(false);
        $ca->cleanNonAscii(false);
        $ca->cleanNonAsciiPostgres(false);
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE public.nw_sync_enc
  ADD COLUMN user VARCHAR(50);";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE public.nw_sync_enc
  ADD COLUMN pass VARCHAR(50);";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE public.nw_sync_enc
  ADD COLUMN class VARCHAR(50);";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE public.nw_sync_enc
  ADD COLUMN method VARCHAR(50);";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE public.nw_sync_enc
  ADD COLUMN company VARCHAR(50);";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE public.nw_sync_enc
  ADD COLUMN profile VARCHAR(50);";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE public.nw_sync_enc
  ADD COLUMN json TEXT;";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE public.nw_sync_tables
  ADD COLUMN nivel integer;";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE public.nw_sync_tables
  ADD COLUMN nivel_pariente integer;";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE public.nw_sync_tables
  ADD COLUMN tabla_a_conectar VARCHAR(50);";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE public.nw_sync_tables
  ADD COLUMN orden integer;";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE public.nw_sync_tables
  ADD COLUMN validacion VARCHAR(50);";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE public.nw_sync_tables
  ADD COLUMN campo_validar VARCHAR(50);";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE public.nw_sync_tables
  ADD COLUMN camposdisponibles VARCHAR(50);";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE public.nw_sync_tables
  ADD COLUMN campos_tabla_destino VARCHAR(50);";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "
ALTER TABLE public.nw_sync_tables
  ADD COLUMN keys text;";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "  
CREATE TABLE IF NOT EXISTS public.nw_sync_history_enc
(
    id serial,
    tabla character varying(100) COLLATE pg_catalog.'default',
    id_enviado integer,
    id_resultado integer,
    enc integer,
    error_text text COLLATE pg_catalog.'default',
    estado character varying(30) COLLATE pg_catalog.'default',
    usuario character varying(30) COLLATE pg_catalog.'default',
    fecha date,
    empresa integer,
    CONSTRAINT nw_sync_history_enc_pkey PRIMARY KEY (id)
)
";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "CREATE TABLE IF NOT EXISTS public.nw_params
            (
                id serial,
                empresa integer,
                clave character varying(50) COLLATE pg_catalog.\"default\",
                valor character varying(100) COLLATE pg_catalog.\"default\",
                CONSTRAINT nw_params_pkey PRIMARY KEY (id)
            )";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "ALTER TABLE IF EXISTS nw_cmi_enc ADD COLUMN query text;";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "ALTER TABLE IF EXISTS nw_cmi_enc ADD COLUMN rotulos_fila text;";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "ALTER TABLE IF EXISTS nw_cmi_enc ADD COLUMN rotulos_columna text;";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "ALTER TABLE IF EXISTS nw_cmi_enc ADD COLUMN valores text;";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "ALTER TABLE IF EXISTS nw_cmi_enc ADD COLUMN filtros character varying(100);";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "ALTER TABLE IF EXISTS nw_cmi_enc ADD COLUMN tipo_grafico character varying(30);";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "ALTER TABLE IF EXISTS nw_cmi_det ADD COLUMN enc integer;";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "ALTER TABLE IF EXISTS nw_cmi_enc ADD COLUMN privado boolean;";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "ALTER TABLE IF EXISTS nw_cmi_enc ADD COLUMN perfiles text;";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "ALTER TABLE IF EXISTS nw_cmi_enc ADD COLUMN selected boolean;";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "ALTER TABLE nw_fail_access ALTER COLUMN clave TYPE character varying(200);";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "ALTER TABLE nw_fail_access ALTER COLUMN usuario TYPE character varying(200);";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "ALTER TABLE nw_cmi_enc ALTER COLUMN usuario TYPE character varying(200);";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "ALTER TABLE IF EXISTS nw_cmi_enc ADD COLUMN usuarios_autorizados character varying(200);";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "ALTER TABLE IF EXISTS nw_cmi_enc ADD COLUMN descripcion text;";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "ALTER TABLE nw_cmi_det ALTER COLUMN valor TYPE text;";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        //APP (ALEXF 15FEB2023)
        $sql = "CREATE TABLE public.nwmaker_current_version (
  id SERIAL, 
  version VARCHAR(50), 
  os VARCHAR(10), 
  fecha DATE, 
  usuario VARCHAR(150), 
  empresa INTEGER,
  perfil INTEGER,
  description VARCHAR(150), 
  route_release VARCHAR(60), 
  domain_rpc VARCHAR(45), 
  CONSTRAINT nwmaker_current_version_pkey PRIMARY KEY(id)
) WITHOUT OIDS;";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "CREATE TABLE public.nwmaker_sessions (
  id SERIAL, 
  usuario VARCHAR(150),
  key_tmp VARCHAR(100), 
  session_id VARCHAR(50), 
  terminal INTEGER,
  fecha timestamp NULL DEFAULT NULL, 
  cookie VARCHAR(60), 
  fecha_ultima_conexion timestamp NULL DEFAULT NULL, 
  dispositivo VARCHAR(15), 
  device VARCHAR(30), 
  CONSTRAINT nwmaker_sessions_pkey PRIMARY KEY(id)
) WITHOUT OIDS;";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "CREATE TABLE public.nwmaker_usuarios_log (
  id SERIAL, 
  usuario VARCHAR(150),
  estado VARCHAR(50), 
  terminal INTEGER,
  fecha timestamp NULL DEFAULT NULL, 
  CONSTRAINT nwmaker_usuarios_log_pkey PRIMARY KEY(id)
) WITHOUT OIDS;";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "CREATE TABLE public.nwmaker_contrato_consecutivo (
  id SERIAL, 
  usuario VARCHAR(150),
  empresa INTEGER,
  fecha timestamp NULL DEFAULT NULL, 
  contrato_consecutivo VARCHAR(4), 
  id_empresa INTEGER,
  usuario_pasajero VARCHAR(100), 
  CONSTRAINT nwmaker_contrato_consecutivo_pkey PRIMARY KEY(id)
) WITHOUT OIDS;";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "CREATE TABLE public.idiomas (
  id SERIAL, 
  nombre VARCHAR(150),
  icon VARCHAR(150),
  charset VARCHAR(10),
  hreflang VARCHAR(5),
  hreflang_alter VARCHAR(20),
  name_in_english VARCHAR(60),
  principal VARCHAR(2),
  activo VARCHAR(2),
  CONSTRAINT idiomas_pkey PRIMARY KEY(id)
) WITHOUT OIDS;";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "CREATE TABLE public.nwmaker_suscriptorsPush (
  id SERIAL, 
  usuario VARCHAR(150),
  json TEXT,
  fecha timestamp NULL DEFAULT NULL, 
  device VARCHAR(150),
  empresa INTEGER,
  perfil INTEGER,
  CONSTRAINT nwmaker_suscriptorsPush_pkey PRIMARY KEY(id)
) WITHOUT OIDS;";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "CREATE TABLE public.edo_app_permisos_users (
  id SERIAL, 
  usuario VARCHAR(150),
  empresa INTEGER,
  perfil INTEGER,
  text TEXT,
  fecha timestamp NULL DEFAULT NULL, 
  fecha_server timestamp NULL DEFAULT NULL, 
  os VARCHAR(50),
  token TEXT,
  CONSTRAINT edo_app_permisos_users_pkey PRIMARY KEY(id)
) WITHOUT OIDS;";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "CREATE TABLE public.nwmaker_resetpass (
  id SERIAL, 
  token VARCHAR(40),
  usado VARCHAR(2),
  fecha timestamp NULL DEFAULT NULL, 
  tipo VARCHAR(15),
  usuario VARCHAR(100),
  empresa INTEGER,
  perfil INTEGER,
  celular VARCHAR(25),
  CONSTRAINT nwmaker_resetpass_pkey PRIMARY KEY(id)
) WITHOUT OIDS;";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "ALTER TABLE IF EXISTS empresas ADD COLUMN idioma_por_defecto VARCHAR(3);";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "ALTER TABLE IF EXISTS terminales ADD COLUMN clave VARCHAR(50);";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "ALTER TABLE IF EXISTS usuarios ADD COLUMN estado_conexion VARCHAR(50);";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "ALTER TABLE IF EXISTS usuarios ADD COLUMN fecha_ultima_conexion timestamp NULL DEFAULT NULL;";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "ALTER TABLE IF EXISTS usuarios ADD COLUMN id_session VARCHAR(50) NULL DEFAULT NULL;";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "ALTER TABLE IF EXISTS usuarios ADD COLUMN acepto_terminos_condiciones VARCHAR(2) NULL DEFAULT NULL;";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "ALTER TABLE IF EXISTS usuarios ADD COLUMN fecha_acepta_terminos timestamp NULL DEFAULT NULL;";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "ALTER TABLE IF EXISTS usuarios ADD COLUMN contrato VARCHAR(100) NULL DEFAULT NULL;";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "ALTER TABLE IF EXISTS usuarios ADD COLUMN empresa INTEGER NULL DEFAULT NULL;";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "ALTER TABLE IF EXISTS usuarios ADD COLUMN version_in_this_device VARCHAR(50) NULL DEFAULT NULL;";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "ALTER TABLE IF EXISTS usuarios ADD COLUMN version VARCHAR(30) NULL DEFAULT NULL;";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "ALTER TABLE IF EXISTS usuarios ADD COLUMN dispositivo VARCHAR(100) NULL DEFAULT NULL;";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "ALTER TABLE IF EXISTS usuarios ADD COLUMN sistema_operativo VARCHAR(50) NULL DEFAULT NULL;";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "ALTER TABLE IF EXISTS usuarios ADD COLUMN token_actual_app VARCHAR(200) NULL DEFAULT NULL;";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "ALTER TABLE IF EXISTS usuarios ADD COLUMN token VARCHAR(200) NULL DEFAULT NULL;";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "ALTER TABLE IF EXISTS usuarios ADD COLUMN token_actual_app_fecha timestamp NULL DEFAULT NULL;";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "ALTER TABLE IF EXISTS usuarios ADD COLUMN zonahorariaactual VARCHAR(100) NULL DEFAULT NULL;";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "ALTER TABLE IF EXISTS usuarios ADD COLUMN fecha_actualizacion timestamp NULL DEFAULT NULL;";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "ALTER TABLE IF EXISTS empresas ADD COLUMN nombre VARCHAR(100) NULL DEFAULT NULL;";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "ALTER TABLE IF EXISTS ciudades ADD COLUMN pais INTEGER NULL DEFAULT NULL;";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = "ALTER TABLE IF EXISTS nwmaker_resetpass ADD COLUMN celular VARCHAR(25) NULL DEFAULT NULL;";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        
    }
}
