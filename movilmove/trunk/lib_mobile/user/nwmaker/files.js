nw.Class.define("files", {
    extend: nw.menu,
    construct: function () {
        var f = this;
        f.id = "files";
        f.files = [];
        f.files.push("js/forms/f_metodo_pago.js");
        f.files.push("js/forms/f_reprograma.js");
//        f.files.push("js/forms/f_crear_viaje.js");
////new files add
        f.files.push("js/forms/f_crear_viaje_new.js");
        f.files.push("js/forms/create_viaje/f_00_markers.js");
        f.files.push("js/forms/create_viaje/f_0_configuracionServi.js");
        f.files.push("js/forms/create_viaje/f_1_createMapa.js");
        f.files.push("js/forms/create_viaje/f_2_createActionsInputsSearchDirections.js");
        f.files.push("js/forms/create_viaje/f_3_validaServiceActive.js");
        f.files.push("js/forms/create_viaje/f_4_resolveStatus.js");
        f.files.push("js/forms/create_viaje/f_activeEnRuta.js");
        f.files.push("js/forms/create_viaje/f_activeNormal.js");
        f.files.push("js/forms/create_viaje/f_activeAbordo.js");
        f.files.push("js/forms/create_viaje/f_activeEnSitio.js");
        f.files.push("js/forms/create_viaje/f_save_pedir_servicio.js");
        f.files.push("js/forms/create_viaje/f_showPrice.js");
        f.files.push("js/forms/create_viaje/f_showPrecioSubservice.js");
        f.files.push("js/forms/create_viaje/f_pedir_0_mostrarServicios.js");
        f.files.push("js/forms/create_viaje/f_traeTarifasContinua.js");
        f.files.push("js/forms/create_viaje/f_showHiddenDate.js");
        f.files.push("js/forms/create_viaje/f_formDatosCarga.js");
        f.files.push("js/forms/create_viaje/f_pedirDataAirpot.js");
        f.files.push("js/forms/create_viaje/f_ciudad_confirmar.js");
        f.files.push("js/forms/create_viaje/f_confirmar_valor_negociacion.js");
////new files add
        
        f.files.push("js/lists/l_tarjetas_credito.js");
        f.files.push("js/forms/f_tarjetas_credito.js");
        f.files.push("js/forms/f_crear_parada.js");
        f.files.push("js/forms/f_cancelar_servicio.js");
        f.files.push("js/forms/f_ver_viaje.js");
        f.files.push("js/forms/f_ver_viaje_mapstatic.js");
        f.files.push("js/forms/f_novedades.js");
        f.files.push("js/lists/l_navtable_favoritos.js");
        f.files.push("js/lists/l_navtable_paradas.js");
        f.files.push("js/forms/f_resumen_final.js");
        f.files.push("js/lists/l_vehiculos.js");
        f.files.push("js/forms/f_vehiculo.js");
        f.files.push("js/forms/f_redimir_cupon.js");
        f.files.push("js/lists/l_historico_viajes.js");
        f.files.push("js/forms/f_favoritos.js");
        f.files.push("js/lists/l_comentarios.js");
        f.files.push("js/forms/f_referidos.js");
        f.files.push("js/forms/f_chat.js");
        f.files.push("js/forms/f_soporte.js");
        f.files.push("js/forms/f_recargas.js");
        f.files.push("js/forms/f_mapa.js");
    },
    destruct: function () {
    },
    members: {
    }
});