<?php
// +----------------------------------------------------------------------
// | 作者：修缘    联系QQ：278896498   QQ群：1054861244
// | 声明：未经作者许可，禁止倒卖等商业运营，违者必究
// +----------------------------------------------------------------------
// | 创建时间:2020/2/22 21:47
// +----------------------------------------------------------------------

namespace app\common\validate;


class AccountValidate extends Validate
{
    protected $rule = [
        'account' => 'require|unique:account|length:6,15|alphaNum',
        'password' => 'require|length:6,20|alphaNum',
    ];

    protected $message = [
        'account.require' => '账号不能为空',
        'account.unique' => '该账号已存在，请勿重复添加',
        'account.length' => '账号只能6-15位',
        'account.alphNum' => '账号只能是字母或数字',

        'password.require' => '密码不能为空',
        'password.length' => '密码只能6-15位',
        'password.alphNum' => '密码只能是字母或数字',
    ];

    protected $scene = [
        'add' => ['account','password'],
    ];
}