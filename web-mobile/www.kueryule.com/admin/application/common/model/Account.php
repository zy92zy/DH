<?php
// +----------------------------------------------------------------------
// | 作者：修缘    联系QQ：278896498   QQ群：1054861244
// | 声明：未经作者许可，禁止倒卖等商业运营，违者必究
// +----------------------------------------------------------------------
// | 创建时间:2020/29/22 18:51
// +----------------------------------------------------------------------

namespace app\common\model;


class Account extends Model
{

    public $softDelete = false;
    protected $pk = 'accountid';
    protected $name = 'account';

    // 设置当前模型的数据库连接
    protected $connection = [
        // 数据库表前缀
        'prefix'      => 'qy_',
        'pk' => 'accountid'
    ];


    protected $autoWriteTimestamp = false;
    // 定义时间戳字段名
    protected $createTime = 'register_time';

    // 可搜索字段
    protected $searchField = [
        'accountid',
        'account',
        'invite',
    ];

    // 条件字段
    protected $whereField = [
        'state'
    ];
    protected $specialTimeFiled = 'register_time';

    // 时间搜索字段
    protected $timeField = [
        'register_time',
        'last_login_time'
    ];


    public function agent()
    {
        return $this->belongsTo('Agent','invite','invitecode')->setEagerlyType(0);
    }






}