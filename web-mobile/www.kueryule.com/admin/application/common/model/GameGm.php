<?php
// +----------------------------------------------------------------------
// | 作者:修缘    联系QQ:278896498   QQ群:1054861244
// | 声明:未经作者许可，禁止倒卖等商业运营，违者必究
// +----------------------------------------------------------------------
// | 创建时间:2020/2/22 21:47
// +----------------------------------------------------------------------

namespace app\common\model;


class GameGm extends Model
{
    protected $name = 'game_gm';
    protected $autoWriteTimestamp = true;
    protected $searchField = ['username','content'];
    protected $whereField = ['type','status'];
    protected $timeField = ['create_time'];

    static $gameKey = 'Z2dQoK5Nvx6Uip0Ds8Iu123';

    public function getTypeTextAttr($value, $data)
    {
        $type = [0=>'未知异常',1=>'发送仙玉', 2=>'发送经验', 3=>'发送物品', 4=>'设置公告', 5=>'玩家禁言', 6=>'解除禁言',7=>'发送通知', 8=>'仙玉充值', 9=>'添加称号', 10=>'禁封账号', 11=>'封禁IP',];
        return $type[$data['type']];
    }

    public function getStatusTextAttr($value, $data)
    {
        $status = [0=>'已成功', 1=>'未成功'];
        return $status[$data['status']];
    }


    public static function setGmPerform($param, $url)
    {
        
        
        $data['username'] =  $param['username'];
        switch ($param['type']) {
            case 'add_jade' :
                $url .= "?mod=add_jade&role_id={$param['role_id']}&jade={$param['jade']}&sign=".self::$gameKey;
                $data['type'] = 1;
                $data['content'] = "角色ID:{$param['role_id']};发送数量:{$param['jade']}";
                break;
            case 'add_exp' :
                $url .= "?mod=add_exp&role_id={$param['role_id']}&exp={$param['exp']}&sign=".self::$gameKey;
                $data['type'] = 2;
                $data['content'] = "角色ID:{$param['role_id']};发送数量:{$param['exp']}";
                break;
            case 'mail_item' :
                $url .= "?mod=add_item&role_id={$param['role_id']}&item={$param['item']}&num={$param['item_num']}&sign=".self::$gameKey;
                $data['type'] = 3;
                $data['role_id'] = $param['role_id'];
                $data['content'] = "角色ID:{$param['role_id']};物品ID:{$param['item']};数量:{$param['item_num']}";
                break;
            case 'notice' :

                $text = urlencode($param['text']);
                $url .= "?mod=set_comment&text={$text}&sign=".self::$gameKey;
                $data['type'] = 4;
                
                //$param['text'] = "防止异常先不记录";
                $data['content'] = "设置公告内容:{$param['text']}";
                break;
            case 'not_speek' :
                $url .= "?mod=not_speak&role_id={$param['role_id']}&server_id={$param['server_id']}&sign=".self::$gameKey;
                $data['type'] = 5;
                $data['content'] = "角色ID:{$param['role_id']}";
                break;
            case 'can_speek' :
                $url .= "?mod=can_speak&role_id={$param['role_id']}&server_id={$param['server_id']}&sign=".self::$gameKey;
                $data['type'] = 6;
                $data['content'] = "角色ID:{$param['role_id']}";
                break;
            case 'inform' :
                $url .= "?mod=sys_notice&text={$param['text']}&type={$param['inform_type']}&server_id={$param['server_id']}&interval={$param['interval']}&times={$param['times']}&sign=".self::$gameKey;
                $data['type'] = 7;
                switch ($param['inform_type']) {
                    case 1 : $type = '走马灯'; break;
                    case 2 : $type = '聊天框'; break;
                    case 3 : $type = '走马灯+聊天框'; break;
                }
                $text = urldecode($param['text']);
                $data['content'] = "类型:{$type};大区:{$param['server_id']};次数:{$param['times']};间隔时间:{$param['interval']}秒;内容:{$text}";
                break;
            case 'charge' :
                $data['type'] = 8;
                $url .= "?mod=agent_charge&role_id={$param['role_id']}&charge_id={$param['charge_id']}&count={$param['count']}&sign=".self::$gameKey;
                $data['content'] = "角色ID:{$param['role_id']};金额:{$param['money']}元;jade:{$param['jade']};ex_jade:{$param['ex_jade']}";
                break;
            case 'add_title' :
                $data['type'] = 9;
                $url .= "?mod=add_title&role_id={$param['role_id']}&title_id={$param['title_id']}&type={$param['title_type']}&sign=".self::$gameKey;
                $data['content'] = "角色ID:{$param['role_id']};称号:{$param['title_name']}";
                break;
            case 'frozen_account' :
                $data['type'] = 10;
                $url .= "?mod=frozen_mac&account_id={$param['account_id']}&sign=".self::$gameKey;
                $data['content'] = "账号:{$param['account_id']}";
                break;
            case 'frozen_ip' :
                $data['type'] = 11;
                $url .= "?mod=frozen_ip&frozen_ip={$param['ip_address']}&sign=".self::$gameKey;
                $data['content'] = "IP地址:{$param['ip_address']}";
                break;
            case 'user_num' :
                $data['type'] = 12;
                $url .= "?mod=online_num&sign=".self::$gameKey;
                $data['content'] = "在线数量查询";
                break;
            case 'setgm' :
                $data['type'] = 13;
                $url .= "?mod=setgm&role_id={$param['role_id']}&level={$param['gmlevel']}&sign=".self::$gameKey;
                $data['content'] = "设置GM号";
                break;
            case 'reload' :
                $data['type'] = 14;
                $url .= "?mod=fresh_shop&sign=".self::$gameKey;
                $data['content'] = "刷新商城";
                break;
        }
        $create_data = GameGm::create($data);
        if ($create_data->id < 1) error('发送异常,请重试');
        //var_dump(curl_get($url));die;
        $result['gm'] = curl_get($url);
        $result['id'] = $create_data->id;
        return $result;
    }

    public static function strToUtf8($str){
        $encode = mb_detect_encoding($str, array("ASCII",'UTF-8',"GB2312","GBK",'BIG5'));
        if($encode == 'UTF-8'){
            return $str;
        }else{
            return mb_convert_encoding($str, 'UTF-8', $encode);
        }
    }

    public static function getItemList(){
        $list = curl_get(config('game.game.gm_url') . '?mod=get_item_list&sign='.self::$gameKey);
        if ($list) {
            $list = json_decode($list, true);
        }
        $list = json_decode($list['list'], true);
        return $list ? $list : [];
    }

    public static function getServList(){
        $list = curl_get(config('game.game.gm_url') . '?mod=get_serv_list&sign='.self::$gameKey);
        if ($list) {
            $list = json_decode($list, true);
        }
        $list = json_decode($list['list'], true);
        return  $list ? $list : [];
    }
    
}