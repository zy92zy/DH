<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="ko" lang="ko">
<head>
<title>微信支付</title>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<meta name="viewport" content="width=device-width,initial-scale=1,user-scalable=no" />
<script type="text/javascript" src="js/jquery.min.js"></script>
<script type="text/javascript" src="js/qrcode.min.js"></script>

<style type="text/css"> 
html,body{hight:100%}
#qrcode{margin-top: 20px;}
#qrcode img{margin: 0 auto;}
.text{left: 0; right: 0; text-align: center; margin-top: 30px; font-size: 23px;}

</style>

</head>
<body>
<div id="qrcode"></div>
<div class="text">移动端请保存二维码或直接截屏，发送截图给好友并点开长按进行识别二维码。</div>


<script type="text/javascript">
new QRCode('qrcode',{
    text: '<?php echo $_GET['url']?>',
    width: 300,
    height: 300,
})

//.makeCode('<?php echo $_GET['url']?>')


</script>
</body>
</html>