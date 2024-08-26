<?php

if ($data->type == 'order.paid') {
    $ca->prepareSelect("nwconekta_orders", "*", "checkoutRequestId=:checkoutRequestId and type='create' ");
    $ca->bindValue(":checkoutRequestId", $id);
    if (!$ca->exec()) {
        return nwMaker::error($ca->lastErrorText(), true);
    }
    if ($ca->size() > 0) {
        $ra = $ca->flush();

        $xa = false;
        $fromName = "Nw test";
        $fromEmail = "info@gruponw.com";
        $title = "Pago realizado a {$ra["email_customer"]} ID {$id}.";
        $asuntoon = "Pago realizado a {$ra["email_customer"]} customer_id: {$ra["customer_id"]} valor: {$ra["valor"]}  empresa: {$ra["empresa"]} terminal: {$ra["terminal"]} perfil: {$ra["perfil"]} webhook ID {$id} DATA: " . $data;
        nw_configuraciones::sendEmail("desarrollonw1@gmail.com", "desarrollonw1@gmail.com", $title, $title, $asuntoon, false, $xa, false, $fromName, $fromEmail);
    }
}