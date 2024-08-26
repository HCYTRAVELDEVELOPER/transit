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

include_once dirname(__FILE__) . '/../includes/facebook-php-sdk/vendor/autoload.php';

//include_once dirname(__FILE__) . '/../includes/facebook-php-business-sdk/vendor/autoload.php';

use FacebookAds\Api;
use FacebookAds\Object\Ad;
use FacebookAds\Object\AdSet;
use FacebookAds\Object\Fields\AdSetFields;
use FacebookAds\Object\Campaign;
use FacebookAds\Object\Fields\CampaignFields;
use FacebookAds\Logger\CurlLogger;

//error_reporting(1);

class nw_marketing {

    public static function getFacebookLeads($p) {

        $app_secret = $p["app_secret"];
        $app_id = $p["app_id"];
        $id_ad = $p["campaign_id"];

//        $t1 = json_decode(self::get_user_access_token($app_id, $app_secret), true);
//        print_r($t1);
//        echo "<br />";
//        $t2 = json_decode(self::get_app_access_token("10154611188093121", $t1["access_token"]), true);
//        print_r($t2);
//        return;
//
//        return;
//        $access_token = "EAAD5kwOgVtABANLTadl7ccp5x85CZASFZBoocwsH2Ayo0idx2sveMDcBqdm6cgT3TBsMBG57rg0pix3VgsJgp2uc3Ad6BBehqU5TkS9YvZAy7JEMFIdnmqM7GtlPL51n86uwcAlqsrXn48bNhmF0qr1JD2OItZA3tM3n7sdOfR2m3KP6marjZBrjAHYM1T3cZD";
//        $access_token = $t1["access_token"];
//        $access_token = $p["access_token"];
//        ini_set("display_errors", 1);
        //SACAR DESDE LAS APPS DE FACEBOOK CON LOS PERMISOS DE MARKETING
        $access_token = $p["token"];
        $api = Api::init($app_id, $app_secret, $access_token);
        $api->setLogger(new CurlLogger());
        $fields = array();
        $params = array();
//        try {
        $ads = (new Campaign($id_ad))->getAds($fields, $params)->getResponse()->getContent();
//        } catch (Exception $exc) {
//            echo $exc->getTraceAsString();
//        }

        $campaign_name = nw_marketing::getCampaignName($id_ad);

        $data = Array();

        for ($i = 0; $i < count($ads["data"]); $i++) {
            $ra = $ads["data"][$i];

            $leads = (new Ad($ra["id"]))->getLeads($fields, $params);
            $group_id = (new Ad($ra["id"]))->getSelf($fields, $params);

            $leads->fetchAfter();

            $adset_name = nw_marketing::getAdsetName($ra["id"]);

            $ad_name = $adset_name;

            foreach ($leads as $lead) {

                $fname = $lead->field_data;

                $d = array();
                $d['lead_id'] = $lead->id;
                $d['created_time'] = $lead->created_time;
                $d['ad_name'] = $ad_name;
                $d['campaign_name'] = $campaign_name;

                array_push($d, $fname);

                array_push($data, $d);
            }
        }

        return $data;
    }

    public static function getAdsetName($adset_id) {
        $adset = (new AdSet($adset_id))->getSelf(array(
            AdSetFields::NAME,
        ));
        return $adset->name;
    }

    public static function getCampaignName($campaign_id) {
        $campaign = (new Campaign($campaign_id))->getSelf(array(
            CampaignFields::NAME,
        ));
        return $campaign->name;
    }

    public static function post_url($url, $params) {
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        $v = http_build_query($params, null, '&');
        echo $v;
        curl_setopt($ch, CURLOPT_POSTFIELDS, $v);
        $ret = curl_exec($ch);
        curl_close($ch);
        return $ret;
    }

    public static function get_user_access_token($app_id, $secret) {
        $url = 'https://graph.facebook.com/oauth/access_token';
        $token_params = array(
            "grant_type" => "client_credentials",
            "client_id" => $app_id,
            "client_secret" => $secret
        );
        return nw_marketing::post_url($url, $token_params);
    }

    public static function get_app_access_token($user_id, $token) {
        $url = 'https://graph.facebook.com/';
        $url .= $user_id;
        $url .= '/accounts';
//        $url .= $token;
        echo $url;
        echo "<br />";
        $token_params = array(
            "name" => "af",
            "access_token" => $token
        );
        return nw_marketing::post_url($url, $token_params);
    }

}

//$p = Array();
//
//$p["app_secret"] = "0a24a6c384db0d3bfcc2c2837720ab0a";
//$p["app_id"] = "274409816348368";
//$p["campaign_id"] = "6163587477118";
//$p["token"] = "EAAD5kwOgVtABAMzjoK2iXbZCAqM5sAY3d6DIsz1EZBbalZCSgC6F1Xm7MC1sSyip8MJXgMZAAIMXgZCLwFhLM6cPQQNXiG5eMG1HT36qEMXy6a8ZBsfCy5L5kd8F5URzqGsFy2ThSsguy3oT5PeZCKOg33ZCrLgvWiyrF58TrC3BkhvmbjXSFCy14b1DXjfx1Wa1ZAU0adrlUogZDZD";
//
//$v = nw_marketing::getFacebookLeads($p);
//print_r($v);
?>
