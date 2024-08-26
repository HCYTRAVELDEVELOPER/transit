<?php

/* * ***********************************************************************

  Copyright:
  2013 Netwoods.net, http://www.netwoods.net

  Author:
  Andrés Flórez

 * *********************************************************************** */

class nwadmin_updater {

    public static function start($p) {
        session::check();

        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $ca->setPregMatchDuplicate(false);

        $sql = "CREATE TABLE trazabilidad_certificaciones (
	id serial primary key,
	usuario varchar(120),
	empresa int,
	estado varchar(50),
	id_certificado int,
	fecha date,
	factura int,
	factura_text varchar(50)
        )";

        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "CREATE TABLE certificados_retencion (
        id serial primary key,
	usuario varchar(120),
	empresa int,
	estado varchar(50),
	fecha_creacion date,
	cliente int,
	nit varchar(50),
	factura int,
	factura_text varchar(50),
	valor double precision,
	valor_retefuente double precision,
	valor_reteica double precision,
	valor_iva double precision,
	total_retencion double precision,
	total_pago double precision,
	nom_usuario_asignado varchar(120),
	nro_telefonico varchar(50),
	correo_responsable varchar(50),
	direcc_responsable text,
        fecha_recibido date,
        usuario_responsable varchar(100),
        archivo text,
        cliente_text varchar(200),
        nom_empresa varchar(200),
        usuario_adjunto varchar(50),
        fecha_solicitud date
        )";

        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "CREATE TABLE certificado_retencion_fact (
	id serial primary key,
	usuario varchar(120),
	empresa int,
	fecha date,
	id_certificado int,
	factura int,
	factura_text varchar(50),
	valor double precision,
	valor_retefuente double precision,
	valor_reteica double precision,
	valor_iva double precision,
	total_retencion double precision,
	total_pago double precision
        )";

        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        
        $sql = " ALTER TABLE `cuentas_cobro` ADD COLUMN `creacion_solicitud_c` boolean; ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = " ALTER TABLE IF EXISTS op_release ADD COLUMN enviado boolean; ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = " ALTER TABLE IF EXISTS op_release ADD COLUMN limitar_banda boolean DEFAULT False; ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = " ALTER TABLE IF EXISTS op_release ADD COLUMN usuario_svn character varying(50); ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = " ALTER TABLE IF EXISTS op_release ADD COLUMN clave_svn character varying(50); ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = " ALTER TABLE IF EXISTS op_release ADD COLUMN ip_destino character varying(200); ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = " ALTER TABLE IF EXISTS op_release ADD COLUMN carpeta_destino character varying(200); ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = " ALTER TABLE IF EXISTS op_release ADD COLUMN pem character varying(200); ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = " ALTER TABLE IF EXISTS op_release ADD COLUMN fecha_hora_lanzamiento timestamp without time zone; ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = " ALTER TABLE IF EXISTS op_productos ADD COLUMN repositorio character varying(100); ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = " ALTER TABLE IF EXISTS op_release ADD COLUMN resultado text; ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = " ALTER TABLE IF EXISTS op_release ADD COLUMN www_path character varying(50); ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        $sql = " ALTER TABLE IF EXISTS op_release ADD COLUMN intentos integer DEFAULT 0; ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        
        return true;
    }

}
