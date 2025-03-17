<?php

function wxpay($result){
	include_once "../lib/xml.php";
	$nonce_str = md5(uniqid(microtime(true),true));
	$scene_info = "{'h5_info': {'type':'Wap','wap_url': 'http://www.o8yx.com','wap_name': 'o8yx游戏'}}";
	$xml = [
		'appid' => Config::$wx_appid,
		'mch_id' => Config::$wx_mch_id,
		'nonce_str' => $nonce_str,
		'body' => $result['body'],
		'out_trade_no' => $result['order'],
		'total_fee' => $result['total_fee'],
		'spbill_create_ip' => $result['ip'],
		'notify_url' => "",
		'trade_type' => 'MWEB',
		'scene_info' => $scene_info,
	];
	$xml['sign'] = sign($xml,"&key=".Config::$wx_key);
	$xml = ArrToXml($xml);
	//$redirect_url = 'redirect_url='.urlencode(Config::$url.'Result.php?order='.$result['order']);
	$result = curlPost('https://api.mch.weixin.qq.com/pay/unifiedorder',$xml);
	$result = xmltoarr($result);
	if($result['return_code'] != 'SUCCESS')
	{ die ($result['return_msg']);}
	return $result['mweb_url'];
}


function wxpay_jssdk($result){
	include_once "../lib/xml.php";
	$nonce_str = md5(uniqid(microtime(true),true));
	$time = time();
	$data = [
		'noncestr' => $nonce_str,
		'jsapi_ticket' => get_jsapi_ticket(),
		'timestamp' => $time,
		'url' => 'http://'.$_SERVER['HTTP_HOST'].$_SERVER['REQUEST_URI'],
	];
	$wxsdk_config = [
		'appId' => Config::$wx_appid,
		'timestamp' => $time,
		'nonceStr' => $nonce_str,
		'signature' => sign($data),
	];

	$scene_info = "{'h5_info': {'type':'Wap','wap_url': 'http://www.o8yx.com','wap_name': 'o8yx游戏'}}";
	$xml = [
		'appid' => Config::$wx_appid,
		'mch_id' => Config::$wx_mch_id,
		'nonce_str' => $nonce_str,
		'body' => $result['body'],
		'out_trade_no' => $result['order'],
		'total_fee' => $result['total_fee'],
		'spbill_create_ip' => $result['ip'],
		'notify_url' => "http://pay.o8yx.com/pay/callback_wxpay.php",
		'trade_type' => 'MWEB',
		'scene_info' => $scene_info,
	];
	$xml['sign'] = sign($xml,"&key=".Config::$wx_key);
	$xml = ArrToXml($xml);
	//$redirect_url = 'redirect_url='.urlencode(Config::$url.'Result.php?order='.$result['order']);
	$result = curlPost('https://api.mch.weixin.qq.com/pay/unifiedorder',$xml);
	$result = xmltoarr($result);
	if($result['return_code'] != 'SUCCESS')
	return false;

	$data = [
		'appid' => Config::$wx_appid,
		"timestamp" => time(),
		"nonceStr" => $nonce_str,
		"ursignTypel" => "MD5",
		"package" => 'prepay_id='.$result['prepay_id'],
	];
	$data['paySign'] = sign($xml,"&key=".Config::$wx_key);
	return [ $wxsdk_config, $data];
}

function get_wxpay_code($result)
{


	include_once "../lib/xml.php";
	$nonce_str = md5(uniqid(microtime(true),true));
	$xml = [
		'appid' => Config::$wx_appid,
		'mch_id' => Config::$wx_mch_id,
		'nonce_str' => $nonce_str,
		'body' => $result['body'],
		'out_trade_no' => $result['order'],
		'total_fee' => $result['total_fee'],
		'spbill_create_ip' => $result['ip'],
		'notify_url' => "http://pay.o8yx.com/pay/callback_wxpay.php",
		'trade_type' => 'NATIVE',
	];
	$xml['sign'] = sign($xml,"&key=".Config::$wx_key);
	$xml = ArrToXml($xml);
	//$redirect_url = 'redirect_url='.urlencode(Config::$url.'Result.php?order='.$result['order']);
	$result = curlPost('https://api.mch.weixin.qq.com/pay/unifiedorder',$xml);
	$result = xmltoarr($result);
	if($result['return_code'] != 'SUCCESS')
	{ 
		return $result['return_msg'];
	
	}
	return $result['code_url'];
}


