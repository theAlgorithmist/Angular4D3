<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");

$resp = "{ \"frequency\" : [
  {
    \"l\": \"A\",
    \"f\": 0.08167
  },
  { 
    \"l\": \"B\",
    \"f\": 0.01492
  },
  {
    \"l\": \"C\",
    \"f\": 0.02782
  },
  {
    \"l\": \"D\",
    \"f\": 0.04253
  },
  {
    \"l\": \"E\",
    \"f\": 0.12702
  },
  {
    \"l\": \"F\",
    \"f\": 0.02288
  },
  {
    \"l\": \"G\",
    \"f\": 0.02015
  },
  {
    \"l\": \"H\",
    \"f\": 0.06094
  },
  {
    \"l\": \"I\",
    \"f\": 0.06966
  },
  {
    \"l\": \"J\",
    \"f\": 0.00153
  },
  {
    \"l\": \"K\",
    \"f\": 0.00772
  },
  {
    \"l\": \"L\",
    \"f\": 0.04025
  },
  {
    \"l\": \"M\",
    \"f\": 0.02406
  },
  {
    \"l\": \"N\",
    \"f\": 0.06749
  },
  {
    \"l\": \"O\",
    \"f\": 0.07507
  },
  {
    \"l\": \"P\",
    \"f\": 0.01929
  },
  {
    \"l\": \"Q\",
    \"f\": 0.00095
  },
  {
    \"l\": \"R\",
    \"f\": 0.05987
  },
  {
    \"l\": \"S\",
    \"f\": 0.06327
  },
  {
    \"l\": \"T\",
    \"f\": 0.09056
  },
  {
    \"l\": \"U\",
    \"f\": 0.02758
  },
  {
    \"l\": \"V\",
    \"f\": 0.00978
  },
   {
    \"l\": \"W\",
    \"f\": 0.02360
  },
   {
    \"l\": \"X\",
    \"f\": 0.00150
  },
   {
    \"l\": \"Y\",
    \"f\": 0.01974
  },
  {
    \"l\": \"Z\",
    \"f\": 0.00074
  }
]}";

echo json_encode($resp);

exit;
?>