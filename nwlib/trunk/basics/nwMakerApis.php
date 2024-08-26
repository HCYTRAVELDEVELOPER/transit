<?php

class nwMakerApis {

    public static function sendNotificacionPush($p) {
        $p = nwMaker::getData($p);
        $cleanHTML = true;
        if (isset($p["cleanHTML"])) {
            if ($p["cleanHTML"] === false) {
                $cleanHTML = false;
            }
        }
        $title = $p["title"];
        $body = $p["body"];
        if ($cleanHTML === true) {
            $title = strip_tags($title);
            $body = strip_tags($body);
        }
        $p["icon"] = "fcm_push_icon";
        $p["sound"] = "default";
        $p["callback"] = "FCM_PLUGIN_ACTIVITY";

        $data = array(
            'title' => $title,
            'body' => $body,
            'sound' => $p["sound"],
            'click_action' => $p["callback"],
            'icon' => $p["icon"]
        );

        $fields = array();
        $fields['notification'] = $data;
        $fields['to'] = $p["token"];

        $ch = curl_init("https://fcm.googleapis.com/fcm/send");
        $header = array('Content-Type: application/json',
            "Authorization: key=AIzaSyCOoH2AZXucFRnHljZOQxQC8PPwtuIqIss");
        curl_setopt($ch, CURLOPT_HTTPHEADER, $header);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        //show result false or not true
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);
        curl_setopt($ch, CURLOPT_POST, 1);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($fields));
        curl_exec($ch);
        curl_close($ch);
    }

    public static function createEventCalendarOutlook($p) {
        return true;
        $p = nwMaker::getData($p);
//        $p["fecha_inicial"] = nwMaker::sumaRestaFechasByFecha("+5 hour", "+0 minute", "+0 second", $p["fecha_inicial"]);
//        $p["fecha_final"] = nwMaker::sumaRestaFechasByFecha("+5 hour", "+0 minute", "+0 second", $p["fecha_final"]);
        $email = $p["correo"];
        $status = "COMFIRMED";
        $event_id = 1234;
        $sequence = 1;
        $tsStart = str_replace(":", "", $p["fecha_inicial"]);
        $tsStart = str_replace("-", "", $tsStart);
        $tsEnd = str_replace(":", "", $p["fecha_final"]);
        $tsEnd = str_replace("-", "", $tsEnd);
        $location = "Colombia";
        $summary = $p["mensaje"];
        $asunto = $p["asunto"];
        $title = $p["correo"];
        $resources = "";
        $to = $email;
        $subject = $p["asunto"];
        $from = "info@gruponw.com";
//        $dtstart = '20190415T180000';
//        $dtend = '20190415T190000';
        $dtstart = $tsStart;
        $dtend = $tsEnd;

//        $start = '20190415';
//        $start_time = '170630';
//        $end = '20190415';
//        $end_time = '180630';
        $mail = new PHPMailer();
        master::trySendSmtp($mail);
//            $mail->IsHTML(false);
        $mail->setFrom($from, "Grupo(info@gruponw.com)");
        $mail->addReplyTo($from, "Grupo(info@gruponw.com)");
        $mail->addAddress($email, $email);
        $mail->ContentType = 'text/calendar';
        $mail->Subject = $asunto . " / " . $summary;

        $mail->addCustomHeader('MIME-version', "1.0");
        $mail->addCustomHeader('Content-type', "text/calendar; name=event.ics; method=REQUEST; charset=UTF-8;");
        $mail->addCustomHeader('Content-type', "text/html; charset=UTF-8");
        $mail->addCustomHeader('Content-Transfer-Encoding', "7bit");
        $mail->addCustomHeader('X-Mailer', "Microsoft Office Outlook 12.0");
        $mail->addCustomHeader("Content-class: urn:content-classes:calendarmessage");

        $ical = "BEGIN:VCALENDAR\r\n";
        $ical .= "VERSION:2.0\r\n";
        $ical .= "PRODID:-//YourCassavaLtd//EateriesDept//EN\r\n";
        $ical .= "METHOD:REQUEST\r\n";
        $ical .= "BEGIN:VEVENT\r\n";
        $ical .= "ORGANIZER;SENT-BY=\"MAILTO:{$from}\":MAILTO:{$from}\r\n";
        $ical .= "ATTENDEE;CN={$email};ROLE=REQ-PARTICIPANT;PARTSTAT=ACCEPTED;RSVP=TRUE:mailto:{$from}\r\n";
        $ical .= "UID:" . strtoupper(nwMaker::encrypt($event_id, "md5")) . "-gruponw.com\r\n";
        $ical .= "SEQUENCE:" . $sequence . "\r\n";
        $ical .= "STATUS:" . $status . "\r\n";
//        $ical .= "DTSTAMPTZID=Africa/Nairobi:" . date('Ymd') . 'T' . date('His') . "\r\n";
//        $ical .= "DTSTART:" . $start . "T" . $start_time . "\r\n";
//        $ical .= "DTEND:" . $end . "T" . $end_time . "\r\n";
        $ical .= "DTSTAMP:" . date('Ymd') . 'T' . date('His') . "\r\n";
        $ical .= "DTSTART:$dtstart\r\n";
        $ical .= "DTEND:$dtend\r\n";
        $ical .= "LOCATION:" . $location . "\r\n";
        $ical .= "SUMMARY:" . $asunto . "\r\n";
        $ical .= "DESCRIPTION:" . $summary . "\r\n";
        $ical .= "BEGIN:VALARM\r\n";
        $ical .= "TRIGGER:-PT15M\r\n";
        $ical .= "ACTION:DISPLAY\r\n";
        $ical .= "DESCRIPTION:Reminder\r\n";
        $ical .= "END:VALARM\r\n";
        $ical .= "END:VEVENT\r\n";
        $ical .= "END:VCALENDAR\r\n";

        $vcal = "BEGIN:VCALENDAR\r\n";
        $vcal .= "VERSION:2.0\r\n";
        $vcal .= "PRODID:-//nonstatics.com//OrgCalendarWebTool//EN\r\n";
        $vcal .= "METHOD:REQUEST\r\n";
        $vcal .= "BEGIN:VEVENT\r\n";
        $vcal .= "ORGANIZER;CN=\"Grupo(info@netwoods.net)" . "\":mailto:$from\r\n";
        $vcal .= "UID:" . date('Ymd') . 'T' . date('His') . "-" . rand() . "-nonstatics.com\r\n";
        $vcal .= "STATUS:" . $status . "\r\n";
        $vcal .= "DTSTAMP:" . date('Ymd') . 'T' . date('His') . "\r\n";
        $vcal .= "DTSTART:$dtstart\r\n";
        $vcal .= "DTEND:$dtend\r\n";
        $vcal .= "LOCATION:$location\r\n";
        $vcal .= "SUMMARY:$summary\r\n";
        $vcal .= "DESCRIPTION:Sumary: $summary - Resources: $resources \r\n";
        $vcal .= "BEGIN:VALARM\r\n";
        $vcal .= "TRIGGER:-PT15M\r\n";
        $vcal .= "ACTION:DISPLAY\r\n";
        $vcal .= "DESCRIPTION:Reminder\r\n";
        $vcal .= "END:VALARM\r\n";
        $vcal .= "END:VEVENT\r\n";
        $vcal .= "END:VCALENDAR\r\n";

        $mail->AddStringAttachment($vcal, "event.ics", "7bit", "text/calendar; charset=utf-8; method=REQUEST");

        $mail->Body = $vcal;
        if (!$mail->send()) {
            return nwMaker::error("Error al programar en calendario (Outlook) para {$email}:" . $mail->ErrorInfo . "", true);
        }
        return true;

//        $vcal = "BEGIN:VCALENDAR\r\n";
//        $vcal .= "VERSION:2.0\r\n";
//        $vcal .= "PRODID:-//nonstatics.com//OrgCalendarWebTool//EN\r\n";
//        $vcal .= "METHOD:REQUEST\r\n";
//        $vcal .= "BEGIN:VEVENT\r\n";
//        $vcal .= "ORGANIZER;CN=\"Grupo(info@netwoods.net)" . "\":mailto:$from\r\n";
//        $vcal .= "UID:" . date('Ymd') . 'T' . date('His') . "-" . rand() . "-nonstatics.com\r\n";
//        $vcal .= "DTSTAMP:" . date('Ymd') . 'T' . date('His') . "\r\n";
//        $vcal .= "DTSTART:$dtstart\r\n";
//        $vcal .= "DTEND:$dtend\r\n";
//        $vcal .= "LOCATION:$location\r\n";
//        $vcal .= "SUMMARY:$summary\r\n";
//        $vcal .= "DESCRIPTION:Sumary: $summary - Resources: $resources \r\n";
//        $vcal .= "BEGIN:VALARM\r\n";
//        $vcal .= "TRIGGER:-PT15M\r\n";
//        $vcal .= "ACTION:DISPLAY\r\n";
//        $vcal .= "DESCRIPTION:Reminder\r\n";
//        $vcal .= "END:VALARM\r\n";
//        $vcal .= "END:VEVENT\r\n";
//        $vcal .= "END:VCALENDAR\r\n";
//        $headers = "From: $from\r\nReply-To: $from";
//        $headers .= "\r\nMIME-version: 1.0\r\nContent-Type: text/calendar; name=calendar.ics; method=REQUEST; charset=\"iso-8859-1\"";
//        $headers .= "\r\nContent-Transfer-Encoding: 7bit\r\nX-Mailer: Microsoft Office Outlook 12.0";
//        return @mail($to, $subject, $vcal, $headers);
    }

}
