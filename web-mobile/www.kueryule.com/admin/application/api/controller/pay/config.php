<?php
date_default_timezone_set("Asia/Shanghai");
header("Content-Type:text/html; charset=utf-8");
class Config{
	public static $db_host = '127.0.0.1';
	public static $db_port = '3306';
	public static $db_username = ' ';
	public static $db_password = ' ';
	public static $db_name = ' ';
	public static $table_order = ' ';
	public static $table_temp = ' ';
	public static $url;

	//管理员openid
	public static $adminID = [
		"123456" => '*',
	];

	//微信支付
	public static $wx_appid = ' ';
	public static $wx_mch_id = ' ';
	public static $wx_key = ' ';
	public static $wx_appsecret =' ';
	public static $wx_notify_url = 'http://pay.o8yx.com/pay/callback_wxpay.php';


	//微信公众号
	public static $mp_encodingAesKey = " ";
	public static $mp_token = " ";
	public static $mp_appId = " ";
	public static $mp_gamekey = ' ';
	public static $mp_AppSecret = ' ';


	//暂存数据
	public static $mp_key;
	public static $mp_timeStamp;
	public static $mp_nonce;
	public static $mp_signature;
	public static $mp_msg_signature;




	
	//文件大小转换
	public static function sizecount($filesize) {
		if($filesize >= 1073741824) {
			$filesize = round($filesize / 1073741824 * 100) / 100 . ' GB';
		} elseif($filesize >= 1048576) {
			$filesize = round($filesize / 1048576 * 100) / 100 . ' MB';
		} elseif($filesize >= 1024) {
			$filesize = round($filesize / 1024 * 100) / 100 . ' KB';
		} else {
			$filesize = $filesize . ' Bytes';
		}
		return $filesize;
	}


public static function sql_log($log , $title = ''){
	$sql="INSERT INTO `log` (`log` , `title`) VALUES ('$log' , '$title')";
	return DB::mysqlQuery($sql);
}
}
class DB{
	private static $mysql = null;
    public static function _initialize(){
		if(self::$mysql) return;
		$dsn="mysql:host=".Config::$db_host.";port=".Config::$db_port.";dbname=".Config::$db_name;
        self::$mysql = new PDO( $dsn , Config::$db_username, Config::$db_password , array(PDO::ATTR_PERSISTENT => true)) 
		or die("Mysql连接失败");
		self::$mysql->query("set names utf-8;");
    }

    public static function mysqlFetch($sql){
        $stmt = self::$mysql->prepare($sql);
        $stmt->execute(); 
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }
    public static function mysqlFetchAll($sql){
        $stmt = self::$mysql->prepare($sql);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
    public static function mysqlQuery($sql){
        return self::$mysql->exec($sql);
    }
}
DB::_initialize();


function sign($result , $str='')
{
	ksort($result);
	$stringSignTemp ='';
	foreach($result as $k => $v)
	{
		if($k == 'sign' || empty($v))
		{continue;}
		if(is_array($v))
    	{$v = json_encode($v);}
		$stringSignTemp .= '&'.$k.'='.$v;
	}
	$stringSignTemp = substr($stringSignTemp,1);
	$stringSignTemp .= $str;
	return strtoupper(MD5($stringSignTemp));
}

function fee_convert($fee){
	if(empty($fee)) $fee=0;
	return	'¥'.sprintf("%.2f",$fee * 0.01);
}

function get_client_ip(){
	$ip = "unknown";
	if ($_SERVER['REMOTE_ADDR'] )
	{
	$ip = $_SERVER['REMOTE_ADDR'];
	}
	else if (getenv("REMOTE_ADDR"))
	{
	$ip = getenv( "REMOTE ADDR");
	}
	return $ip;
}

function save($result , $temp = true)
{
	$sql="INSERT INTO ";
	$sql .= '`'.($temp ? Config::$table_temp : Config::$table_order).'`';
	$sql .= ' (`'. implode("`,`", array_keys($result)) ."`) VALUES ('";
	$sql .= implode("','", $result);
	$sql .= "')";
	return DB::mysqlQuery($sql);
}

//查询充值订单
function select($order , $temp = true)
{
	$sql = "SELECT * FROM ";
	$sql .= '`'.($temp ? Config::$table_temp : Config::$table_order).'`';
	$sql .= " WHERE `order`='$order'";
	return DB::mysqlFetch($sql);
}


function sql_log($log , $title = ''){
	$sql="INSERT INTO `log` (`log` , `title`) VALUES ('$log' , '$title')";
	return DB::mysqlQuery($sql);
}


function curlPost($url, $data = null){
	$curl = curl_init();
	curl_setopt($curl, CURLOPT_URL, $url);
	curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, false);
	if(!empty($data)){
		curl_setopt($curl, CURLOPT_POST, 1);
		curl_setopt($curl, CURLOPT_POSTFIELDS, $data);
	}
	curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
	$output = curl_exec($curl);
	curl_close($curl);
	return $output;
}

function save_order($result , $url){
	include_once './key.php';
	$result['sign']= sign($result,'&key='.$form_key[$result['form']]);
	$res = curlPost($url , ['data'=>json_encode($result)]);
	$result['return_msg'] =  empty($res) ? '无返回信息' :(count($res) < 190 ? $res : '返回信息过长');
	if($result['return_msg'] !='SUCCESS') 
	sql_log('充值结果通知失败\n单号:'.$result['order'] . "\n".$result['return_msg']);
	unset($result['sign']);
	unset($result['attach']);
	if($result['channel'] & $result['channel'] !='')
	{
		include_once "../lib/cps.php";
		$rows = cps_select_user($result['channel']);
		if($rows !=null){
			$result['cps_fee'] = $rows['percentage'] * $result['cash_fee'] * 0.01;
			if(!cps_user_case_get($result['channel'], $result['cps_fee'], true)){
				sql_log('推广佣金增加失败 用户:'.$result['channel'] . '\n金额:'.
				$result['cps_fee'] .'\n单号:' .$result['order']	);
	}}}
	$res = save($result , false);
	if(!$res) 
		sql_log('储存充值记录失败\n单号:'.$result['order'] . "\n" . json_encode($result));
	return $res;
}

function isMobile() { 
	// 如果有HTTP_X_WAP_PROFILE则一定是移动设备
	if (isset($_SERVER['HTTP_X_WAP_PROFILE'])) {
	  return true;
	} 
	// 如果via信息含有wap则一定是移动设备,部分服务商会屏蔽该信息
	if (isset($_SERVER['HTTP_VIA'])) { 
	  // 找不到为flase,否则为true
	  return stristr($_SERVER['HTTP_VIA'], "wap") ? true : false;
	} 
	// 脑残法，判断手机发送的客户端标志,兼容性有待提高。其中'MicroMessenger'是电脑微信
	if (isset($_SERVER['HTTP_USER_AGENT'])) {
	  $clientkeywords = array('nokia','sony','ericsson','mot','samsung','htc','sgh','lg','sharp','sie-','philips','panasonic','alcatel','lenovo','iphone','ipod','blackberry','meizu','android','netfront','symbian','ucweb','windowsce','palm','operamini','operamobi','openwave','nexusone','cldc','midp','wap','mobile','MicroMessenger'); 
	  // 从HTTP_USER_AGENT中查找手机浏览器的关键字
	  if (preg_match("/(" . implode('|', $clientkeywords) . ")/i", strtolower($_SERVER['HTTP_USER_AGENT']))) {
		return true;
	  } 
	} 
	// 协议法，因为有可能不准确，放到最后判断
	if (isset ($_SERVER['HTTP_ACCEPT'])) { 
	  // 如果只支持wml并且不支持html那一定是移动设备
	  // 如果支持wml和html但是wml在html之前则是移动设备
	  if ((strpos($_SERVER['HTTP_ACCEPT'], 'vnd.wap.wml') !== false) && (strpos($_SERVER['HTTP_ACCEPT'], 'text/html') === false || (strpos($_SERVER['HTTP_ACCEPT'], 'vnd.wap.wml') < strpos($_SERVER['HTTP_ACCEPT'], 'text/html')))) {
		return true;
	  } 
	} 
	return false;
}

function isWeixin() { 
	if (strpos($_SERVER['HTTP_USER_AGENT'], 'MicroMessenger') !== false) { 
	  return true; 
	} else {
	  return false; 
	}
}

function getRand($length = 8){
    // 密码字符集，可任意添加你需要的字符
    $chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    $str = "";
    for ( $i = 0; $i < $length; $i++ )
    {
        $str .= $chars[ mt_rand(0, strlen($chars) - 1) ];
    }
    return $str ;
}


function get_access_token(){
	$sql="SELECT * FROM `config`";
	$row = DB::mysqlFetch($sql);
	$time = time();
	if($time - $row['tokentime'] < 6000){
		$url = "https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=".Config::$mp_appId."&secret=".Config::$mp_AppSecret;
		$res = json_decode(curlPost($url) , true);
		$token =  $res['access_token'];
		$sql = "UPDATE `config` SET `token`='$token', `tokentime`='$time' WHERE (`id`='1')";
		DB::mysqlQuery($sql);
	}else
	$token = $row['token'];
	return $token;
}

function get_jsapi_ticket(){
	$sql="SELECT * FROM `config`";
	$row = DB::mysqlFetch($sql);
	$time = time();
	$row = json_decode($row['jsapi_ticket'] ,true);
	if($time - $row['time'] < 6000){
		$url = "https://api.weixin.qq.com/cgi-bin/ticket/getticket?type=jsapi&access_token=".get_access_token();
		$res = json_decode(curlPost($url) , true);
		$ticket =  $res['ticket'];
		$sql = "UPDATE `config` SET `ticket`='".json_encode(['ticket' => $ticket , 'time'=>$time])." WHERE (`id`='1')";
		DB::mysqlQuery($sql);
	}else
	$ticket = $row['ticket'];
	return $ticket;
}