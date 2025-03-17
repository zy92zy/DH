<?php
/**
 * 余额变更记录验证器
 */

namespace app\common\validate;

class AgentMoneyValidate extends Validate
{
    protected $rule = [
    'type|操作方式' => 'require|in:0,1',
    'agent|代理账户' => 'require',
    'money|金额' => 'require|float|egt:0.01',
    ];

    protected $message = [
    'type.require' => '请选择操作方式',
    'type.in' => '操作方式选择异常，请刷新重试',
    'agent.require' => '代理账户不能为空',
    'money.require' => '金额不能为空',
    'money.float' => '金额只能是数字',
    'money.egt' => '金额必须大于等于0.01',
    ];

    protected $scene = [
        'add'  => ['type','agent', 'money']
    ];
}
