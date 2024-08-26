<!DOCTYPE html>
<!--
To change this license header, choose License Headers in Project Properties.
To change this template file, choose Tools | Templates
and open the template in the editor.
jasond daza
-->
<?php
require_once $_SERVER['DOCUMENT_ROOT'] . "/rpcsrv/_mod.inc.php";
global $datos;
$datos = $_GET;
session::check();
$si = session::info();
$db = NWDatabase::database();
$ca = new NWDbQuery($db);
//$sql = "select logo from empresas where id=:empresa";
//$ca->prepare($sql);
//$ca->bindValue(":empresa", $_SESSION["empresa"]);
//if (!$ca->exec()) {
//    $db->rollback();
//    echo $ca->lastErrorText();
//    return;
//}
$sql = "select logo from edo_empresas where id=:empresa";
$ca->prepare($sql);
$ca->bindValue(":empresa", $_SESSION["bodega"]);
if (!$ca->exec()) {
    $db->rollback();
    echo $ca->lastErrorText();
    return;
}
if ($ca->size() != 0) {
    $emp = $ca->flush();
    $empresa = $emp["logo"];
}
?>
<html>
    <head>
        <meta charset="UTF-8">
        <title></title>
        <style>
            body{
                background-image: url(/imagenes/Carry-Express-Envios-Nacionales-2.jpg);
                background-repeat: no-repeat;
                background-size: cover;
            }
            .contain_glob {
                flex-wrap: wrap;
                position: relative;
                display: flex;
                /*justify-content: space-evenly;*/
                /*align-items: center;*/
            }
            .left {
                width: 28%;
                position: relative;
            }
            .right {
                width: 72%;
                position: relative;
                background: #0808088f;
                flex-wrap: wrap;
                position: relative;
                display: flex;
                /*margin: 7px -1vw;*/
                justify-content: space-evenly;
                align-items: center;
            }
            .contain_bottom {
                position: relative;
                width: 69vw;
                height: 55vh;
                background: #4290e054;
                overflow: hidden;
                display: flex;
                justify-content: center;
                background-image: url(/imagenes/team_page_title_02.jpg);
                background-repeat: no-repeat;
                background-size: cover;
            } 
            /*            .img-logo{
                            width: 150px;
                            height: 100px;
                            bottom: 0px;
                            float: right;
                            position: relative;
                        }*/
            img.img-portada{
                width: 100%;
                height: 100%;
                bottom: 0px;
                position: relative;
            }
            .img-logo{
                /*width: 487px;*/
                /*height: 145px;*/
                width: auto;
                height: 100px;
                bottom: 0px;
                position: absolute;
            }
            .contain_top {
                position: relative;
                width: 69vw;
                height: 18vw;
                background: #4290e054;
                overflow: hidden;
                color: #fff;
            }
            .user_photo  {
                background-repeat: no-repeat;
            }
            .contain_center {
                /*                position: relative;
                                width: 78vw;
                                display: flex;
                                overflow: hidden;
                                flex-wrap: wrap;
                                justify-content: space-between;
                                margin: auto;*/
                position: relative;
                width: 25vw;
                height: 100vh;
                overflow: hidden;
                flex-wrap: wrap;
                justify-content: space-between;
                background: #0808088f;
                background-size: cover;
                overflow-y: auto;
                max-width: 331px;
            }
            .containerBoxM.containerBoxM_home {
                position: relative;
                margin: 12px;
                height: 123px;
                background: #4290e054;
                color: #fff;
                transition: 1s;

            }   
            #contend_modules_div {
                text-align: center;
                cursor: pointer;
                height: 100%;
                display: flex;
                justify-content: space-evenly;
                align-items: center;
            }
            .img_contend_modules_div {
                background-repeat: no-repeat;
                width: 100%;
                height: 69px;
                background-size: contain;
                text-align: center;
                background-position: center;
            }
            .contain_center::-webkit-scrollbar {
                -webkit-appearance: none;
            }

            .contain_center::-webkit-scrollbar:vertical {
                width:6px;
            }

            .contain_center::-webkit-scrollbar-button:increment,.contain_center::-webkit-scrollbar-button {
                display: none;
            } 

            .contain_center::-webkit-scrollbar:horizontal {
                height: 10px;
            }

            .contain_center::-webkit-scrollbar-thumb {
                background-color: #797979;
                border-radius: 20px;
                /*border: 2px solid #f1f2f3;*/
            }

            .contain_center::-webkit-scrollbar-track {
                border-radius: 10px;  
            }
            .boxDownText {
                display: none;
            }
            .img_contend_modules_div {
                background-repeat: no-repeat;
                width: 40%;
                height: 69px;
                background-size: contain;
                text-align: center;
                filter: drop-shadow(1px 1px 0px #fff);
            }
            .containerBoxM_home:hover {
                background: linear-gradient(54deg, #4a4d55 30%, transparent 73%);
                transform: scale(1.1);
            }


            /*///baner*/     
            .changePhoto {
                position: relative;
                top: 150px;
                text-decoration: underline;
                cursor: pointer;
            }
            .contend_sliderEnc {
                display: flex;
                align-items: center;
                height: 100%;
            }
            .contenidoM{
                position: relative;
                top: 0;
                z-index: 0;
                height: 100%;
            }
            .user_enc.box_users {
                z-index: 2;
                position: relative;
                width: 19%;
                height: 95%;
                margin: 18px;
                text-align: center;
                display: flex;
                justify-content: center;
                align-items: center;
                background: #a7a3a361;
            }
            h3.nw_user_dash {
                position: absolute;
                top: -21px;
                font-size: 36px;
            }
            .user_name {
                display: none;
            }
            .user_info_basic {
                display: none;
            }
            .user_photo {
                width: 140px;
                height: 140px;
                background-size: cover;
                border-radius: 50%;
                border: 1px solid;
                position: relative;
            }
        </style>
    </head>
    <body>
        <div class='contain_glob'>
            <div class="left">
                <div class="contain_center">
                </div>
            </div>
            <div class='right'>
                <div class="contain_top">
                </div>
                <div class="contain_bottom">
                    <img class="img-logo" alt='' src="<?php echo $empresa ?>" />
                </div>
            </div>
        </div>
    </body>
</html>
