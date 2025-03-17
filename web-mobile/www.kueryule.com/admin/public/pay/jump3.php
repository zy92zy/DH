<?php


echo file_get_contents("http://127.0.0.1:8561/pay_return?".http_build_query($_GET));

