<?php
include_once '../config.php';
include_once "../lib/xml.php";
$xml_str = isset($GLOBALS['HTTP_RAW_POST_DATA']) ? $GLOBALS['HTTP_RAW_POST_DATA'] : file_get_contents("php://input");
if(empty($xml_str)){ die('');}
$xml = xmltoarr($xml_str);

if($xml['return_code'] != 'SUCCESS'){ 
	sql_log(json_encode($xml) ,'return_code错误');
	return_msg('SUCCESS','return_code错误'); 
}
$order = $xml['out_trade_no'];
if(select($order,false) != null){
	sql_log(json_encode($xml),'订单重复');
	return_msg('SUCCESS','订单重复');
}
$request = select($order);
if($request == null){
	sql_log(json_encode($xml),'没有查询到订单');
	return_msg('SUCCESS','没有查询到订单');
}
$sign = sign($xml,"&key=".Config::$wx_key);
if($xml['sign'] != $sign){
	sql_log(json_encode($xml),'sign效验失败');
	return_msg('SUCCESS','sign效验失败');
}


$url = $request['notify_url'];
$result = [
	'result_code' => $xml['result_code'],
	'err_code_des' => $xml['err_code_des'],
	'total_fee' => $xml['total_fee'],
	'cash_fee' => $xml['cash_fee'],
	'order' => $order,
	'paytype' => 'wxpay',
	'game' => $request['game'],
	'form' => $request['form'],
	'server' => $request['server'],
	'user' => $request['user'],
	'attach' => $request['attach'],
	'ip' => $request['ip'],
	'channel' => $request['channel'],
	'success_time' => time(),
	'create_time' => $request['create_time'],
];

save_order($result , $url);

return_msg();

function return_msg($code='SUCCESS' , $msg='')
{
	$xml = "<xml>
	<return_code><![CDATA[$code]]></return_code>
	<return_msg><![CDATA[$msg]]></return_msg>
</xml>";
die($xml);
}
