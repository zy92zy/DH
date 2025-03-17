<?php


$url = "http://127.0.0.1:9561/admin/get_item_list";

$res = file_get_contents($url);


print_r($res);