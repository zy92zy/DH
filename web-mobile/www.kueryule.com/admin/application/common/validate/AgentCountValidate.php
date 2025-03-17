<?php
/**
 * 提成统计验证器
 */

namespace app\common\validate;

class AgentCountValidate extends Validate
{
    protected $rule = [
            'role_id|角色id' => 'require',
    'account|玩家账号' => 'require',
    'mouney|交易金额' => 'require',
    'proceeds|代理收入' => 'require',
    'agent|代理' => 'require',
    'order|订单号' => 'require',

    ];

    protected $message = [
            'role_id.require' => '角色id不能为空',
    'account.require' => '玩家账号不能为空',
    'mouney.require' => '交易金额不能为空',
    'proceeds.require' => '代理收入不能为空',
    'agent.require' => '代理不能为空',
    'order.require' => '订单号不能为空',

    ];

    protected $scene = [
        'add'  => ['role_id','account','mouney','proceeds','agent','order',],
'edit' => ['role_id','account','mouney','proceeds','agent','order',],

    ];

    

}
