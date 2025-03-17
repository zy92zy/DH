<?php
// +----------------------------------------------------------------------
// | 作者：修缘    联系QQ：278896498   QQ群：1054861244
// | 声明：未经作者许可，禁止倒卖等商业运营，违者必究
// +----------------------------------------------------------------------
// | 创建时间:2020/5/28 21:03
// +----------------------------------------------------------------------

namespace app\common\model;


class PushBalance extends Model
{
    protected $name = 'push_balance';
    protected $autoWriteTimestamp = true; // 自动写入时间戳
    //可搜索字段
    protected $searchField = [
        'username',
    ];

    protected $whereField = [
        'balance_type',
        'status',
    ];

    protected $timeField = [
        'create_time',
    ];


    public function scopeKindAgent($query, $field , $param)
    {
        $query->whereIn($field, $param);
    }
}