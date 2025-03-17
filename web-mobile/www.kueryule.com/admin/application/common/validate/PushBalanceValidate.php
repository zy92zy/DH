<?php
// +----------------------------------------------------------------------
// | 作者：修缘    联系QQ：278896498   QQ群：1054861244
// | 声明：未经作者许可，禁止倒卖等商业运营，违者必究
// +----------------------------------------------------------------------
// | 创建时间:2020/2/22 21:47
// +----------------------------------------------------------------------

namespace app\common\validate;


class PushBalanceValidate extends Validate
{
    protected $rule = [
        'username|代理账号' => 'require|alphaNum|length:5,15',
        'balance_type|结算方式' => 'require|number|in:1,2,3,4,5',
        'money|结算金额' => 'require|number|length:1,8',
    ];

    protected $message = [
        'username.require' => '代理账号不能为空',
        'username.alphaNum' => '代理账号只能是字母和数字',
        'username.length' => '代理账号只能是5-15位',

        'balance_type.require' => '请选择结算方式',
        'balance_type.number' => '结算方式数据异常',
        'balance_type.in' => '结算方式数据异常',

        'money.require' => '结算金额不能为空',
        'money.number' => '结算金额只能是整数',
        'money.length' => '结算金额只能是1-8位数',
    ];

    protected $scene = [
        'add' => ['username', 'balance_type', 'money']
    ];

}