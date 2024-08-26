<?php
require_once dirname(__FILE__)."/XPM4-v.0.4/MAIL.php";
class CMemailXpm extends MAIL {

}
/*
 *   $m=new wemailXpm();
  $m->from("emotions@emotionsbuilder.com");
  $m->addto($d["atr_email_recomendar"]);
  $m->subject(wstr("Un amigo te recomienda emotionsbuilders"));
  $m->html(plantillaEmail($d["atr_texto"]));
  $m->send();
*/


class CMemail {
  public static function sendmail($from,$to, $subject, $message){
    @$s=mail( $to, $subject, $message,"From:$from");
    if($s) return true;
    return false;
  }

  public static function validateField($campo,$abort=false){
    //Array con las posibles cabeceras a utilizar por un spammer
    $badHeads = array("Content-Type:",
                                 "MIME-Version:",
                                 "Content-Transfer-Encoding:",
                                 "Return-path:",
                                 "Subject:",
                                 "From:",
                                 "Envelope-to:",
                                 "To:",
                                 "bcc:",
                                 "cc:");

    //Comprobamos que entre los datos no se encuentre alguna de
    //las cadenas del array. Si se encuentra alguna cadena se
    //dirige a una p�gina de Forbidden
    foreach($badHeads as $valor){
      if(strpos(strtolower($campo), strtolower($valor)) !== false){
        if($abort==false) return false;
        header("HTTP/1.0 403 Forbidden");
        exit;
      }
    }

    return true;
  }
}
?>