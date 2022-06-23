<?php

   if(isset($_GET['txtquery']))
      $query = $_GET['txtquery'];

       header("Location /yourpage/{$query}");


?>