<?php
/**
 * 代理等级模型
 */

namespace app\common\model;

use think\model\concern\SoftDelete;

class AgentType extends Model
{
    use SoftDelete;
    public $softDelete = true;
    protected $name = 'agent_type';
    protected $autoWriteTimestamp = true;

    //可搜索字段
    protected $searchField = ['name', 'description',];

    //是否启用获取器
    public function getStatusTextAttr($value, $data)
    {
        return self::BOOLEAN_TEXT[$data['status']];
    }

    //关联用户
    public function agent()
    {
        return $this->hasMany(Agent::class);
    }


}
