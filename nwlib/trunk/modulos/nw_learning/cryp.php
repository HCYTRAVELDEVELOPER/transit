<?php

// Copyright (c) 2009 By Jamm "Rpe-Scia"
## encript ID
$cl_v = 54750;
class encript
{
//   var $characters2 = 'abcdefghijklmnñopqrstuvwxyz0123456789';
//   var $characters = '#%bc1de2f3gh/(j)kl6m7nñ8op9qr?tuv¡¿yz&';
   private static $charAllows = 'abcdefghijklmnnopqrstuvwxyz0123456789';
   private static $characters = 'abcdefghijklmnnopqrstuvwxyz0123456789';
   private static $num_encript;
   public static $string;
   public static function encode($inputVar, $num = 0){
      self::$num_encript = $num;
      $len = strlen($inputVar);
      for($i=0 ; $i<strlen($inputVar); $i++)
      {
         self::addNum($len++);
         $position = strpos( self::$charAllows, strtolower($inputVar{$i}) );
         if(!is_int($position))
         {
            return 'Cadena ingresada con caracteres invalidos "'.$inputVar{$i}.'"';
         }
         $char = self::characters();
         $string .=  $char{$position};
      }
      return self::$string=$string;
   }
   public static function decode($inputVar, $num = 0) {
      self::$num_encript = $num;
      $len = strlen($inputVar);
      for($i=0 ; $i<strlen($inputVar); $i++)
      {
         self::addNum($len++);
         $position = strpos( self::characters(), strtolower($inputVar{$i}) );
         $char = self::$charAllows;
         $string .= $char{$position};
      }
      return self::$string=$string;
   }
   private static function addNum($len)
   {
      self::$num_encript = ( (self::$num_encript+($len)) - (int)(sqrt( $len * log(($len*4)-1) * log($len*10) )) );
   }
   private static function characters()
   {
      $num = self::$num_encript % (strlen(self::$characters)-1);
      return substr(self::$characters,$num).substr(self::$characters,0,$num);
   }
}
?>
