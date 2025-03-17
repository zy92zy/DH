<?php
/**
 * 公共基础模型
 * @author yupoxiong<i@yufuping.com>
 */

namespace app\common\model;

use think\db\Query;


class Model extends \think\Model
{
    //是否字段，使用场景：用户的是否冻结，文章是否为热门等等。
    public const BOOLEAN_TEXT = [0 => '禁用', 1 => '正常'];
    public const RECHARGE_STATUS_TEXT = [0 => '完成', 1 => '未完成'];
    public const SERVERID_TEXT = [
        1000 => '天涯',
    ];

    /**
     * 结算方式获取器
     */
    public const BALANCE_TYPE_TEXT = [
        0 => '无',
        1 => '微信',
        2 => '支付宝',
        3 => '银行卡',
        4 => '现金',
        5 => '其他',
    ];

    //是否为软删除
    public $softDelete = true;

    //软删除字段默认值
    protected $defaultSoftDelete = 0;

    //可搜索字段
    protected $searchField = [];

    //可作为条件的字段
    protected $whereField = [];

    //可做为时间范围查询的字段
    protected $timeField = [];

    protected $specialTimeFiled;

    //禁止删除的数据id
    public $noDeletionId = [];

    /**
     * 查询处理
     * @var Query $query
     * @var array $param
     */
    public function scopeWhere($query, $param, $id = false): void
    {
        //关键词like搜索
        $keywords = $param['_keywords'] ?? '';
        if ('' !== $keywords && count($this->searchField) > 0) {

            $this->searchField = implode('|', $this->searchField);
            $query->where($this->searchField, 'like', '%' . $keywords . '%');
        }

        //字段条件查询
        if (count($this->whereField) > 0 && count($param) > 0) {
            foreach ($param as $key => $value) {
                if ($value !== '' && in_array((string)$key, $this->whereField, true)) {
                    $query->where($key, $value);
                }
            }
        }


        //时间范围查询
        if (count($this->timeField) > 0 && count($param) && is_array($this->timeField)) {
            foreach ($param as $key => $value) {
                if ($value !== '' && in_array((string)$key, $this->timeField, true)) {
                    $field_type = $this->getFieldsType($this->table, $key);
                    $time_range = explode(' - ', $value);
                    [$start_time, $end_time] = $time_range;
                    //如果是int，进行转换
                    if (false !== strpos($field_type, 'int')) {
                        $start_time = strtotime($start_time);
                        if (strlen($end_time) === 10) {
                            $end_time .= '23:59:59';
                        }
                        $end_time = strtotime($end_time);
                    }
                    $query->where($key, 'between', [$start_time, $end_time]);
                }
            }
        }

        if (!empty($this->specialTimeFiled) && !empty($param['special_create_time'])) {
            $query->whereTime($this->specialTimeFiled, urldecode($param['special_create_time']));
        }


        //排序
        $order = $param['_order'] ?? '';
        $by = $param['_by'] ?? 'desc';
        switch ($id) {
            case 'accountid' :
                $query->order($order ?: 'accountid', $by ?: 'desc');
                break;
            case 'roleid' :
                $query->order($order ?: 'roleid', $by ?: 'desc');
                break;
            case 'orderid' :
                $query->order($order ?: 'orderid', $by ?: 'desc');
                break;
            default :
                $query->order($order ?: 'id', $by ?: 'desc');
        }
    }


    /**
     * @param array $list 数据列表
     * @param string $id id字段
     * @param string $pid 上级id字段
     * @return array
     */
    public static function getChildren(array $list, $id='id', $pid = 'p_id')
    {
        $data = array();
        foreach ($list as $v) {
            if ($v[$pid] == $id) {
                $data[] = $v;
                $data = array_merge($data, self::getChildren($list, $v['id']));
            }
        }
        return $data;
    }

    //状态获取器
    public function getStatusTextAttr($value, $data)
    {
        return self::BOOLEAN_TEXT[$data['status']];
    }

    //结算方式获取器
    public function getBalanceTypeAttr($value, $data)
    {
        return self::BALANCE_TYPE_TEXT[$data['balance_type']];
    }


}