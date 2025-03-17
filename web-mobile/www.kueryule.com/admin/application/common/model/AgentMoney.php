<?php
/**
 * 余额变更记录模型
*/

namespace app\common\model;


class AgentMoney extends Model
{

    public $softDelete = false;
    protected $name = 'agent_money';
    protected $autoWriteTimestamp = true;

    //可搜索字段
    protected $searchField = ['agent', 'username', 'content'];

    //可作为条件的字段
    protected $whereField = ['type'];

    //可做为时间
    protected $timeField = ['create_time'];

    //状态 0成功 1失败获取器
    public function getStatusTextAttr($value, $data)
    {
        $status = [0=>'成功', 1=>'失败'];
        return $status[$data['status']];
    }

    public function getTypeTextAttr($value, $data)
    {
        $type = [0=>'增加',1=>'减少'];
        return $type[$data['type']];
    }

    public function scopeKindAgent($query, $field , $param)
    {
        $query->whereIn($field, $param);
    }
}
