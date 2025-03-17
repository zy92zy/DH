<?php
/**
 * 角色列表模型
 */

namespace app\common\model;

use think\Db;

class Equip extends Model
{

    public $softDelete = false;
    protected $pk = 'EquipID';
    protected $name = 'jianghu.qy_equip';
    protected $autoWriteTimestamp = false;

    // 定义时间戳字段名
    protected $createTime = 'create_time';

    // 设置当前模型的数据库连接
    protected $connection = [
        // 数据库表前缀
        'prefix' => '',
        'pk' => 'EquipID'
    ];


    //可搜索字段
    protected $searchField = [
    ];

    //可作为条件的字段
    protected $whereField = [
    ];

    //可做为时间
    protected $timeField = [
    ];
    protected $specialTimeFiled = 'create_time';


}
