<?php
/**
 * @author yupoxiong<i@yufuping.com>
 * @title 首页
 */

namespace app\api\controller;

class IndexController extends Controller
{

    protected $authExcept = [
        'index'
    ];

    public function index()
    {
        return success('index');
    }
    
    
    
    
    
    
    
    
    
    
    
    public function get_wxpay_code($result)
    {
    	include_once "./lib/xml.php";
    	$nonce_str = md5(uniqid(microtime(true),true));
    	$xml = [
    		'appid' => Config::$wx_appid,
    		'mch_id' => Config::$wx_mch_id,
    		'nonce_str' => $nonce_str,
    		'body' => $result['body'],
    		'out_trade_no' => $result['order'],
    		'total_fee' => $result['total_fee'],
    		'spbill_create_ip' => $result['ip'],
    		'notify_url' => " ",
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
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    

}