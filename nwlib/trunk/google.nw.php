<?php

/* * ***********************************************************************

  Copyright:
  2015 Grupo NW S.A.S, http://www.gruponw.com

  License:
  LGPL: http://www.gnu.org/licenses/lgpl.html
  EPL: http://www.eclipse.org/org/documents/epl-v10.php
  See the LICENSE file in the project's top-level directory for details.

  Authors:
 * Andrés Flórez (andresf)
 * 
 * Class to test on andresf projects

 * *********************************************************************** */

class google_seo {

    static $have_corporate = false;

    public static function processAllGoogleSeo($pageData = null) {

        $g = self::getAll($pageData);

        $url = (isset($_SERVER['HTTPS']) ? "https" : "http") . "://" . $_SERVER['HTTP_HOST'];

        $html = "";

        for ($i = 0; $i < count($g); $i++) {

            $r = $g[$i];
            $s = "";

            switch ($r["tipo"]) {

                case "searchAction":

                    $s = self::getSample("searchAction");
                    $s = str_replace("{url_search}", $url . "/inicio?buscar=", $s);
                    $s = str_replace("{url}", $url, $s);
                    $s = str_replace("{name}", $r["valor"], $s);
                    $s = str_replace("{description}", $r["valor_uno"], $s);
                    $s = str_replace("{who_we_are}", $r["valor_dos"], $s);
                    $html .= $s;
                    break;

                case "corporateContact":

                    $s = self::getSample("corporateContact");
                    $s = str_replace("{name}", $r["valor_dos"], $s);
                    $s = str_replace("{url_logo}", $r["valor"], $s);
                    $s = str_replace("{telefono}", $r["valor_uno"], $s);
                    $s = str_replace("{caption}", $r["valor_dos"], $s);
                    $s = str_replace("{valor_ancho}", $r["valor_cuatro"], $s);
                    $s = str_replace("{valor_alto}", $r["valor_cinco"], $s);

                    if (isset($r["valor_tres"]) && $r["valor_tres"] !== "" && $r["valor_tres"] !== "0") {
                        $s = str_replace("{social_media}", '"sameAs": [' . $r["valor_tres"] . "],", $s);
                    } else {
                        $s = str_replace("{social_media}", "", $s);
                    }
                    $s = str_replace("{url}", $url, $s);
                    $html .= $s;

                    break;

                case "WebApplication":

                    $tipo = isset($r["valor_siete"]) ? $r["valor_siete"] : "";
                    $total = 0;
                    $puntaje = 0;
                    $puntaje_count = 0;

                    if ($tipo !== "" && $tipo !== "0" && $tipo !== 0) {

                        $db = NWDatabase::database();
                        $ca = new NWDbQuery($db);
                        $cb = new NWDbQuery($db);
                        $ca->prepareSelect("nwforms_respuestas_users_enc", "id,fecha,usuario,url", " id_enc=:id order by id desc");
                        $ca->bindValue(":id", $tipo);
                        if (!$ca->exec()) {
                            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
                            return;
                        }
                        $data = $ca->assocAll();
                        $total = $ca->size();

                        $cb->prepareSelect("nwforms_respuestas_users", "*", "id_enc=:id_enc order by enc_user,name_submit asc");
                        $cb->bindValue(":id_enc", $tipo);
                        if (!$cb->exec()) {
                            master::sendPHPError("Error ejecutando la consulta: " . $cb->lastErrorText());
                            return;
                        }
                        $puntaje = 0;
                        $tgen = $cb->size();

                        if ($tgen > 0) {
                            $gen = $cb->assocAll();
                            $num = 0;

                            $rev = Array();
                            $rev["review"] = Array();

                            $rev_arr = Array();
                            $iz = 0;
                            $ga = null;

                            $worst_rating = 0;

                            for ($iz = 0; $iz < $tgen; $iz++) {
                                $ga = $gen[$iz];

                                if ($ga["typeData"] === "stars") {
                                    if ($ga["respuesta"] != null && $ga["respuesta"] != "") {
                                        if ($ga["name_submit"] == "calificaciongeneral" || $ga["name_submit"] == "calificacion general") {

                                            $puntaje += intval($ga["respuesta"]);

                                            if ($iz === 0 || $iz === 1) {
                                                $worst_rating = $ga["respuesta"];
                                            } else {
                                                if ((int) $ga["respuesta"] < (int) $worst_rating) {
                                                    $worst_rating = $ga["respuesta"];
                                                }
                                            }

                                            $num++;

                                            $reviewRating = Array();
                                            $reviewRating["@type"] = "Rating";
                                            $reviewRating["ratingValue"] = $ga["respuesta"];
                                            $rev_arr["reviewRating"] = $reviewRating;
                                        }
                                    }
                                } else if ($ga["name_submit"] === "contras" && $ga["respuesta"] !== "") {
                                    $reviewRating = Array();
                                    $reviewRating["@type"] = "ItemList";
                                    $list = Array();
                                    $list["@type"] = "ListItem";
                                    $list["position"] = 1;
                                    $list["name"] = $ga["respuesta"];
                                    $reviewRating["itemListElement"] = $list;
                                    $rev_arr["negativeNotes"] = $reviewRating;
                                } else if ($ga["name_submit"] === "nombre") {
                                    $rev_arr["@type"] = "Review";
                                    $reviewPerson = Array();
                                    $reviewPerson["@type"] = "Person";
                                    $reviewPerson["name"] = $ga["respuesta"];
                                    $rev_arr["author"] = $reviewPerson;
                                } else if ($ga["name_submit"] === "pros") {
                                    if ($ga["respuesta"] === "") {
                                        $rev["review"][] = $rev_arr;
                                        $rev_arr = Array();
                                    } else {
                                        $reviewRating = Array();
                                        $reviewRating["@type"] = "ItemList";
                                        $list = Array();
                                        $list["@type"] = "ListItem";
                                        $list["position"] = 1;
                                        $list["name"] = $ga["respuesta"];
                                        $reviewRating["itemListElement"] = $list;
                                        $rev_arr["positiveNotes"] = $reviewRating;
                                        $rev["review"][] = $rev_arr;
                                        $rev_arr = Array();
                                    }
                                }
                            }
                            if ($puntaje == 0 && $num == 0) {
                                $puntaje = 0;
                            } else {
                                $puntaje = $puntaje / $num;
                            }
                        }
                    }

                    $s = self::getSample("WebApplication");
                    $s = str_replace("{name}", $r["valor"], $s);
                    $s = str_replace("{applicationCategory}", $r["valor_uno"], $s);
                    $s = str_replace("{keywords}", $r["valor_dos"], $s);
                    $s = str_replace("{url_contact}", $r["valor_tres"], $s);
                    $s = str_replace("{url_login}", $r["valor_cuatro"], $s);
                    $s = str_replace("{description}", isset($r["valor_cinco"]) ? $r["valor_cinco"] : "", $s);
                    $s = str_replace("{applicationSubCategory}", isset($r["valor_seis"]) ? $r["valor_seis"] : "", $s);

                    if ($tipo !== "" && $tipo !== "0" && $tipo !== 0) {
                        $ar = '"aggregateRating": {
                            "@type": "AggregateRating",
                            "bestRating": 5,
                            "ratingCount": {no_reviews},
                            "ratingValue": {score},
                            "worstRating": {worst_rating}
                        },';
                        $sa = str_replace("{score}", round($puntaje, 1), $ar);
                        $sa = str_replace("{no_reviews}", $total, $sa);
                        $sa = str_replace("{worst_rating}", $worst_rating, $sa);
                        $s = str_replace("{aggregateRating}", $sa, $s);

                        $rev = json_encode($rev);
                        $rev = ltrim($rev, '{');
                        $rev = substr($rev, 0, -1);
                        $rev = $rev . ",";

                        $s = str_replace("{reviews}", $rev, $s);
                    } else {
                        $s = str_replace("{aggregateRating}", "", $s);
                        $s = str_replace("{reviews}", "", $s);
                    }

                    $html .= $s;

                    break;

                case "Service":

                    $tipo = isset($r["valor_siete"]) ? $r["valor_siete"] : "";
                    $total = 0;
                    $puntaje = 0;
                    $puntaje_count = 0;

                    if ($tipo !== "" && $tipo !== "0") {

                        $db = NWDatabase::database();
                        $ca = new NWDbQuery($db);
                        $cb = new NWDbQuery($db);
                        $ca->prepareSelect("nwforms_respuestas_users_enc", "id,fecha,usuario,url", " id_enc=:id order by id desc");
                        $ca->bindValue(":id", $tipo);
                        if (!$ca->exec()) {
                            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
                            return;
                        }
                        $data = $ca->assocAll();
                        $total = $ca->size();

                        $cb->prepareSelect("nwforms_respuestas_users", "*", "id_enc=:id_enc order by enc_user,name_submit asc");
                        $cb->bindValue(":id_enc", $tipo);
                        if (!$cb->exec()) {
                            master::sendPHPError("Error ejecutando la consulta: " . $cb->lastErrorText());
                            return;
                        }
                        $puntaje = 0;
                        $tgen = $cb->size();

                        if ($tgen > 0) {
                            $gen = $cb->assocAll();
                            $num = 0;

                            $rev = Array();
                            $rev["review"] = Array();

                            $rev_arr = Array();
                            $iz = 0;
                            $ga = null;

                            for ($iz = 0; $iz < $tgen; $iz++) {
                                $ga = $gen[$iz];

                                if ($ga["typeData"] === "stars") {
                                    if ($ga["respuesta"] != null && $ga["respuesta"] != "") {
                                        if ($ga["name_submit"] == "calificaciongeneral") {

                                            $puntaje += intval($ga["respuesta"]);
                                            $num++;

                                            $reviewRating = Array();
                                            $reviewRating["@type"] = "Rating";
                                            $reviewRating["ratingValue"] = $ga["respuesta"];
                                            $rev_arr["reviewRating"] = $reviewRating;
                                        }
                                    }
                                } else if ($ga["name_submit"] === "contras" && $ga["respuesta"] !== "") {
                                    $reviewRating = Array();
                                    $reviewRating["@type"] = "ItemList";
                                    $list = Array();
                                    $list["@type"] = "ListItem";
                                    $list["position"] = 1;
                                    $list["name"] = $ga["respuesta"];
                                    $reviewRating["itemListElement"] = $list;
                                    $rev_arr["negativeNotes"] = $reviewRating;
                                } else if ($ga["name_submit"] === "nombre") {
                                    $rev_arr["@type"] = "Review";
                                    $reviewPerson = Array();
                                    $reviewPerson["@type"] = "Person";
                                    $reviewPerson["name"] = $ga["respuesta"];
                                    $rev_arr["author"] = $reviewPerson;
                                } else if ($ga["name_submit"] === "pros") {
                                    if ($ga["respuesta"] === "") {
                                        $rev["review"][] = $rev_arr;
                                        $rev_arr = Array();
                                    } else {
                                        $reviewRating = Array();
                                        $reviewRating["@type"] = "ItemList";
                                        $list = Array();
                                        $list["@type"] = "ListItem";
                                        $list["position"] = 1;
                                        $list["name"] = $ga["respuesta"];
                                        $reviewRating["itemListElement"] = $list;
                                        $rev_arr["positiveNotes"] = $reviewRating;
                                        $rev["review"][] = $rev_arr;
                                        $rev_arr = Array();
                                    }
                                }
                            }
                            $puntaje = $puntaje / $num;
                        }
                    }

                    $s = self::getSample("Service");
                    $s = str_replace("{url}", $url, $s);
                    $s = str_replace("{name}", $r["valor"], $s);
                    $s = str_replace("{url_type}", $r["valor_uno"], $s);
                    $s = str_replace("{url_logo}", $r["valor_dos"], $s);
                    $s = str_replace("{legal_name}", $r["valor_tres"], $s);
                    $s = str_replace("{area_served}", $r["valor_cuatro"], $s);
                    $s = str_replace("{description}", isset($r["valor_cinco"]) ? $r["valor_cinco"] : "", $s);

                    if ($tipo !== "" && $tipo !== "0" && isset($rev)) {
                        $ar = '"aggregateRating": {
                            "@type": "AggregateRating",
                            "bestRating": 5,
                            "ratingCount": {no_reviews},
                            "ratingValue": {score},
                            "worstRating": 0
                        },';
                        $sa = str_replace("{score}", round($puntaje, 1), $ar);
                        $sa = str_replace("{no_reviews}", $total, $sa);
                        $s = str_replace("{aggregateRating}", $sa, $s);

                        $rev = json_encode(isset($rev) ? $rev : "");
                        $rev = ltrim(isset($rev) ? $rev : "", '{');
                        $rev = substr($rev, 0, -1);
                        $rev = $rev . ",";

                        $s = str_replace("{reviews}", $rev, $s);
                    } else {
                        $s = str_replace("{aggregateRating}", "", $s);
                        $s = str_replace("{reviews}", "", $s);
                    }

                    $html .= $s;

                    break;

                case "socialProfile":

                    $s = self::getSample("socialProfile");
                    $s = str_replace("{nombre_empresa}", $r["valor"], $s);
                    $s = str_replace("{url}", $url, $s);
                    $patron = "";
                    if (isset($r["valor_uno"]) && $r["valor_uno"] != "") {
                        $patron .= '"' . $r["valor_uno"] . '"';
                    }
                    if (isset($r["valor_dos"]) && $r["valor_dos"] != "") {
                        $patron .= ', "' . $r["valor_dos"] . '"';
                    }
                    if (isset($r["valor_tres"]) && $r["valor_tres"] != "") {
                        $patron .= ',"' . $r["valor_tres"] . '"';
                    }
                    if (isset($r["valor_cuatro"]) && $r["valor_cuatro"] != "") {
                        $patron .= ',"' . $r["valor_cuatro"] . '"';
                    }
                    $s = str_replace("{patron}", $patron, $s);
                    $html .= $s;

                    break;

                default:
                    break;
            }
        }
        return $html;
    }

    public static function getSample($type) {

        $s = '<script type="application/ld+json">';

        switch ($type) {

            case "Service":
                $s .= '{
                "@context": "http://schema.org",
                "@type": "Product",
                "name": "{name}",
                "additionalType": "{url_type}",
                {aggregateRating}
                {reviews}
                "description": "{description}",
                "provider": {
                    "@type": "Organization",
                    "url": "{url}",
                    "logo": "{url_logo}",
                    "legalName": "{legal_name}"
                },
                "areaServed": {
                    "@type": "Place",
                    "name":[{area_served}]
                }
            }';
                break;

            case "WebApplication":
                $s .= '{
                "@context": "http://schema.org",
                "@type": "WebApplication",
                "name": "{name}",
                "url": "{url_login}",
                "browserRequirements": "Requires JavaScript, requires HTML5",
                {aggregateRating}
                {reviews}
                "applicationCategory": "{applicationCategory}",
                "applicationSubCategory": [{applicationSubCategory}],
                "operatingSystem": "All",
                "description": "{description}",
                "about": {
                    "@type": "Thing",
                    "description": "{keywords}"
                },
                "softwareHelp": {
                    "@type": "CreativeWork",
                    "url": "{url_contact}"
                }
            }';
                break;

            case "corporateContact":
                $s .= '{
                "@context": "http://schema.org",
                "@type": "Organization",
                "name": "{name}",
                "url": "{url}",
                "logo": {
                    "@type": "ImageObject",
                    "inLanguage": "es",
                    "url": "{url_logo}",
                    "contentUrl": "{url_logo}",
                    "width": "{valor_ancho}",
                    "height": "{valor_alto}",
                    "caption": "{caption}"
                },
                {social_media}
                "contactPoint": [{
                    "@type": "ContactPoint",
                    "telephone": "{telefono}",
                    "contactType": "customer support"
                }]
            }';
                break;

            case "searchAction":
                $s .= '{
                "@context": "http://schema.org",
                "@type": "WebSite",
                "name": "{name}",
                "description": "{description}",
                "url": "{url}",
                "publisher": {
                        "@id": "{who_we_are}"
                },
                "potentialAction": {
                    "@type": "SearchAction",
                    "query-input": "required name=search_term_string",
                    "target": {
                        "@type": "EntryPoint",
                        "urlTemplate": "{url_search}{search_term_string}"
                    }
                }
            }';
                break;

            case "socialProfile":
                $s .= '{
                "@context": "http://schema.org",
                "@type": "Organization",
                "name": "{nombre_empresa}",
                "url": "{url}",
                "sameAs": [
                    {patron}
                ]
            }';
                break;

            default:
                break;
        }

        $s .= "</script>";

        return $s;
    }

    public static function getAll($pageData = null) {
        session::check();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        if ($pageData !== null) {
            $sql = "select * from google_seo where pagina=:pagina or pagina=0 order by tipo asc";
        } else {
            $sql = "select * from google_seo order by tipo asc";
        }
        $ca->prepare($sql);
        if ($pageData !== null) {
            $ca->bindValue(":pagina", $pageData["id"]);
        }
        if (!$ca->exec()) {
            return array();
        }
        return $ca->assocAll();
    }
}

?>
