<?php
// +----------------------------------------------------------------------
// | 作者：修缘    联系QQ：278896498   QQ群：1054861244
// | 声明：未经作者许可，禁止倒卖等商业运营，违者必究
// +----------------------------------------------------------------------
// | 创建时间:2020/2/22 21:47
// +----------------------------------------------------------------------

namespace app\common\validate;


class GameGmValidate extends Validate
{
    protected $rule = [
        'password' => 'require',
        'server_id' => 'require|number',
        'role_id' => 'require|number',
        'gold_num' => 'require|number',
        'item_id' => 'require|number|egt:1',
        'notice_content' => 'require',
        'inform_content' => 'require',
        'inform_type' => 'require|number|egt:1',
        'times' => 'require|number',
        'interval' => 'require|number',
        'charge_id' => 'require|number',
        'title_id' => 'require|number|egt:1',
        'account_id' => 'require',
        'ip_address' => 'require|ip',
        'gmlevel' => 'require|number',
    ];

    protected $message = [
        'password.require' => 'GM密码不能为空',
        'role_id.require' => '角色ID不能为空',
        'role_id.number' => '角色ID只能是数字',
        'gmlevel.require' => '等级不能为空',
        'gmlevel.number' => '等级只能是数字',
        'server_id.require' => '请选择大区',
        'server_id.number' => '选择大区异常',
        'gold_num.require' => '数量不能为空',
        'gold_num.number' => '数量只能是整数',
        'item_id.require' => '请选择物品',
        'item_id.egt' => '请选择物品',
        'notice_content.require' => '公告内容不能为空',
        'inform_content.require' => '通知内容不能为空',
        'inform_type.require' => '选择通知类型',
        'inform_type.number' => '通知类型选择异常',
        'inform_type.egt' => '请选择通知类型',
        'times.require' => '通知次数不能为空',
        'times.number' => '通知次数只能是整数或-1',
        'interval.require' => '间隔时长不能为空',
        'interval.number' => '间隔时长只能是整数 单位：秒',
        'charge_id.require' => '请选择充值选项',
        'charge_id.number' => '充值选项选择异常',
        'charge_id.between' => '充值选项选择异常',
        'title_id.require' => '请选择称号',
        'title_id.number' => '称号选择异常，请刷新重试',
        'title_id.egt' => '称号选择异常，请刷新重试',
        'account_id.require' => '玩家账号不能为空',
        'ip_address.require' => 'ip地址不能为空',
        'ip_address.ip' => '请输入正确的ip地址',
    ];

    protected $scene = [
        'recharge_gold' => ['password', 'role_id', 'gold_num'],
        'recharge_exp' => ['password', 'role_id', 'gold_num'],
        'mail_item' => ['password', 'role_id', 'item_id', 'gold_num'],
        'is_speek' => ['password', 'role_id'],
        'notice' => ['password', 'notice_content'],
        'inform' => ['password', 'server_id', 'inform_content', 'inform_type', 'times', 'interval'],
        'recharge' => ['role_id', 'charge_id'],
        'add_title' => ['password', 'role_id', 'title_id'],
        'frozen_account' => ['password', 'account_id'],
        'frozen_ip' => ['password', 'ip_address'],
        'setgm' => ['password', 'role_id', 'level'],
    ];

}