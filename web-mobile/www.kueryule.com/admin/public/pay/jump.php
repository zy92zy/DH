<?php

//echo file_get_contents("http://127.0.0.1:8561/pay_return?".http_build_query($_GET));
 
$data = str_replace('@', '+', $_GET['data']);

$data = json_decode(base64_decode($data), true);


$url = $data['jumpurl'];
unset($data['jumpurl']);


?>



<!DOCTYPE html>
<html>
<form id="form1" name="form1" method="post" action="<? echo $url; ?>">

<?php
    $str = '<input type="hidden" name="%s" value="%s"/>';
    foreach($data as $k=>$v){
        echo sprintf($str, $k, $v)."\r\n";
    }
?>


</form>
<script language="javascript">
  document.form1.submit();
</script>

</html>