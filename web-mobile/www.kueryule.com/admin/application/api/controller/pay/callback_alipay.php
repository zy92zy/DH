<?php
require_once './api/AlipayTradeService.php';
include_once "./api/AopClient.php";
include_once '../config.php';
$arr=$_POST;
if(!$arr) 
{die('');}
$alipaySevice = new AlipayTradeService($config);
$result = $alipaySevice->check($arr);
if(!$result) 
die('fail');

if($arr['trade_status'] !='TRADE_SUCCESS'){
	sql_log(json_encode($xml) ,'支付宝通知');
	die('success');
}
$order = $arr['out_trade_no'];
if(select($order,false) != null){
	sql_log(json_encode($xml) ,'订单重复');
	die('success');
}
$result = select($order);
if($result == null){
	sql_log(json_encode($xml) ,'无订单');
	die('fail');
}
$url = $result['notify_url'];
$result = [
	'result_code' => "SUCCESS",
	'err_code_des' => "",
	'total_fee' => $arr['total_amount'] *100,
	'cash_fee' => $arr['receipt_amount'] *100,
	'order' => $order,
	'paytype' => 'alipay',
	'game' => $result['game'],
	'form' => $result['form'],
	'server' => $result['server'],
	'user' => $result['user'],
	'attach' => $result['attach'],
	'ip' => $result['ip'],
	'channel' => $result['channel'],
	'success_time' => time(),
	'create_time' => $result['create_time'],
];

save_order($result , $url);

die('success');

