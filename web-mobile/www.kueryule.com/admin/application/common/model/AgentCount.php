<?php
// +----------------------------------------------------------------------
// | 作者：修缘    联系QQ：278896498   QQ群：1054861244
// | 声明：未经作者许可，禁止倒卖等商业运营，违者必究
// +----------------------------------------------------------------------
// | 创建时间:2020/29/22 18:51
// +----------------------------------------------------------------------


namespace app\common\model;

class AgentCount extends Model
{
    protected $name = 'agent_count';
    protected $autoWriteTimestamp = true;

    //可搜索字段
    protected $searchField = [
        'role_id',
        'account',
        'agent',
        'orderid'
    ];

    //可作为条件的字段
    protected $whereField = [
        'serverid'
    ];

    protected $specialTimeFiled = 'create_time';
    //可做为时间
    protected $timeField = [
        'create_time'
    ];

    public function scopeKindAgent($query, $field , $param)
    {
        $query->whereIn($field, $param);
    }




    public function getServeridTextAttr($value, $data) {
        
        
        return isset(self::SERVERID_TEXT[$data['serverid']]) ? self::SERVERID_TEXT[$data['serverid']] : $data['serverid'];
    }

}
