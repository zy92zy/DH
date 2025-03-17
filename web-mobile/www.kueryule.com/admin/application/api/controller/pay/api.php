<?php
include_once '../config.php';
include_once 'wxpay.php';
include_once 'alipay.php';

switch($_GET['api']){
    case 'wx_sdk_pay':
        wx_sdk_pay();
    break;
}




function wx_sdk_pay(){

    if(!isset($_GET['order']))
    {die('缺少参数');}
    $result = select($_GET['order']);
    if(select($_GET['order'] , false) != null){
        die('订单充值成功');
    }
    if($result == null)
    {die('订单不存在');}
    $prepay_id = wxpay_js($result);
    if(!$prepay_id)
    die('发起订单失败');

    $res = curlPost("https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=".Config::$mp_appId."&secret=".Config::$mp_AppSecret);
    $res = json_decode($res,true);
    $res = curlPost("https://api.weixin.qq.com/cgi-bin/ticket/getticket?type=jsapi&access_token=".$res['access_token']);
    $res = json_decode($res,true);

    $nonceStr = getRand();
    $time = time();
    $data = [
        'noncestr' => $nonceStr,
        'jsapi_ticket' => $res['ticket'],
        'timestamp' => $time,
        'url' => urldecode($_GET['url']),
    ];
    $cfg = [
        'debug' => false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
        'appId' => Config::$mp_appId, // 必填，公众号的唯一标识
        'timestamp' => $time, // 必填，生成签名的时间戳
        'signature' => sign($data),// 必填，签名
        'nonceStr' => getRand(), // 必填，生成签名的随机串
        'jsApiList' => ['chooseWXPay'], // 必填，需要使用的JS接口列表
    ];


    $pay_cfg = [
        'timeStamp' => $time, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
        'nonceStr' => $nonceStr, // 支付签名随机串，不长于 32 位
        'package' => "prepay_id=$prepay_id", // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=\*\*\*）
        'signType' => 'MD5', // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
    ];
    $pay_cfg['paySign'] = sign($pay_cfg);

    $return = [
        'cfg' => $cfg,
        'pay_cfg' => $pay_cfg,
    ];

    die(json_encode($return));
}


