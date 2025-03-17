<?php

function alipay($data){

	include_once "./api/AlipayTradeWapPayRequest.php";
	include_once "./api/AopClient.php";
	$aop = new AopClient ();
	$request = new AlipayTradeWapPayRequest ();
	$request->setBizContent(json_encode([
		'body'=> $data['body'],
		'subject' => $data['subject']?$data['subject']:'游戏充值',
		'out_trade_no' => $data['order'],
		'total_amount' => sprintf("%.2f",$data['total_fee'] * 0.01),
		'product_code' => 'QUICK_WAP_WAY',
		'timeout_express' => '30m',
	]));
	$request->setNotifyUrl(' ');
	$request->setReturnUrl(' ');
	$result = $aop->pageExecute($request , 'GET');
	return $result;
}

function alipay_jssdk($data){
	include_once "./api/AlipayTradeWapPayRequest.php";
	include_once "./api/AopClient.php";
	$aop = new AopClient ();
	$request = new AlipayTradeWapPayRequest ();
	$request->setBizContent(json_encode([
		'body'=> $data['body'],
		'subject' => $data['subject']?$data['subject']:'游戏充值',
		'out_trade_no' => $data['order'],
		'total_amount' => sprintf("%.2f",$data['total_fee'] * 0.01),
		'product_code' => 'QUICK_WAP_WAY',
		'timeout_express' => '30m',
	]));
	$request->setNotifyUrl('http://pay.o8yx.com/pay/callback_alipay.php');
	$request->setReturnUrl('http://pay.o8yx.com/pay/index.php?'.ali_returnUrl($data));
	$result = $aop->sdkExecute($request);
	return $result;
}


function get_alipay_code()
{
	include_once '../config.php';
	$data = select($_GET['order']);
	if($data == null)
	{die('订单错误');}
	include_once "./api/AlipayTradePagePayRequest.php";
	include_once "./api/AopClient.php";
	$aop = new AopClient ();
	$request = new AlipayTradePagePayRequest ();
	$request->setBizContent(json_encode([
		'body'=> $data['body'],
		'subject' => $data['subject']?$data['subject']:'游戏充值',
		'out_trade_no' => $data['order'],
		'total_amount' => sprintf("%.2f",$data['total_fee'] * 0.01),
		'product_code' => 'FAST_INSTANT_TRADE_PAY',
		'timeout_express' => '30m',
		'qr_pay_mode' => '4',
		'qrcode_width' => '160',
	]));
	$request->setNotifyUrl('http://pay.o8yx.com/pay/callback_alipay.php');
	$request->setReturnUrl('http://pay.o8yx.com/pay/index.php?'.ali_returnUrl($data));
	$result = $aop->pageExecute($request);
	echo $result;
}


function ali_returnUrl($data){
	$s = [
		'order' => $data['order'],
		'form' => 'o8yx',
		'time' => time(),
	];
	$s['sign'] = sign($data,'&key='.$form_key['o8yx']);
	return http_build_query($s);
}