<?php
/**
 * 用户验证器
 */

namespace app\common\validate;

class AgentValidate extends Validate
{
    /**
     * 验证规则
     */
    protected $rule = [
        'agent_type_id|代理类型' => 'require',
        'username|账号' => 'require|unique:admin_user|length:5,15|alphaNum',
        'password|密码' => 'require|length:6,20|alphaNum',
        'push_scale|提成比例' => 'require|integer|between:1,100',
        'p_id|上级代理账号' => 'alpha|length:5,15',
        'balance_account|结算账户' => 'length:3-25|alphaNum',
        'mobile|手机号' => 'mobile',
        'wechat|微信号' => 'alphaNum|length:3,20',
        'qq|QQ号' => 'number|length:5,15',
        'nickname|昵称' => 'require',
        'status|是否启用' => 'require',

    ];

    /**
     * 错误提示
     */
    protected $message = [
        'agent_type_id.require' => '请选择代理类型',

        'username.require' => '账号不能为空',
        'username.unique' => '账号已存在，请勿重复添加',
        'username.length' => '账号只能5-15位',
        'username.alphaNum' => '账号只能是字母和数字',

        'password.require' => '密码不能为空',
        'password.length' => '密码只能6-20位',
        'password.alphaNum' => '密码只能是字母或数字',

        'push_scale.require' => '提成比例不能为空',
        'push_scale.integer' => '提成比例只能是整数',
        'push_scale.between' => '提成比例只能是1-100之间',

        'p_id.alpha' => '上级代理账号只能是字母',
        'p_id.length' => '上级代理账号只能5-15位',

        'balance_account.length' => '结算账户只能3-25位',
        'balance_account.alphaNum' => '结算账户只能是字母或数字',

        'mobile.mobile' => '请输入正确的手机号',

        'wechat.alphaNum' => '微信号只能是字母和数字',
        'wechat.length' => '微信号只能3-20位',

        'qq.number' => 'QQ号只能是数字',
        'qq.length' => 'QQ号只能5-15位',

        'nickname.require' => '昵称不能为空',
        'status.require' => '请选择是否启用',
    ];

    protected $scene = [
        'add'       => ['agent_type_id', 'username', 'nickname', 'password', 'status'],
        'edit'      => ['agent_type_id', 'username',  'nickname', 'status'],

    ];


}
