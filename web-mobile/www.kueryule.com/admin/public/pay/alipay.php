<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html>
<head>
<title>支付宝支付</title>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<meta name="viewport" content="width=device-width,initial-scale=1,user-scalable=no" />


<style type="text/css"> 
iframe{margin-top: 20px; margin: 0 auto; display: block;}
.text{left: 0; right: 0; text-align: center; margin-top: 30px; font-size: 23px;}
</style>

</head>
<body>



    
<iframe id="qrcode" width="300px" height="300px" src="https://openapi.alipay.com/gateway.do?<?php echo http_build_query($_GET);?>" frameborder="0" scrolling="no"></iframe>

<div class="text">移动端请保存二维码或直接截屏，并在扫码界面选择扫描本地图片。</div>

    
<script>




<?php echo json_encode($_GET) ?>






</script>
</body>
</html>