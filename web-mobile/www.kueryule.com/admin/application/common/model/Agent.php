<?php
/**
 * 用户模型
 */

namespace app\common\model;


class Agent extends Model
{
    public $softDelete = false;
    protected $name = 'admin_user';
    protected $autoWriteTimestamp = true;

    //可搜索字段
    protected $searchField = [
        'username',
        'balance_account',
        'mobile',
        'nickname',
        'invitecode',
        'wechat',
        'qq',
    ];

    protected $whereField = [
        'status',
        'agent_type_id'
    ];

    protected $timeField = [
        'create_time'
    ];

    public function scopeRole($query)
    {
        $query->where(['role' => 2])->select();
    }

    // 是否启用获取器
    public function getStatusTextAttr($value, $data)
    {
        return self::BOOLEAN_TEXT[$data['status']];
    }

    // 结算方式获取器
    public function getBalanceTypeAttr($value, $data)
    {
        return self::BALANCE_TYPE_TEXT[$data['balance_type']];
    }

    // 更新代理余额
    public static function setAgentMoney(string $type, string $username, int $money)
    {
        switch ($type) {
            case 'inc' :
                $result = self::where(['username' => $username])->setInc('real_money', $money);
                break;
            case 'dec' :
                $result = self::where(['username' => $username])->setDec('real_money', $money);
                break;
            default : error('type error!');
        }
        return $result;
    }

    public static function init()
    {
        //添加自动加密密码
        self::event('before_insert', static function ($data) {
            $data->password = base64_encode(password_hash($data->password, 1));
        });

        //修改密码自动加密
        self::event('before_update', function ($data) {
            $old = (new static())::get($data->id);
            if ($data->password !== $old->password) {
                $data->password = base64_encode(password_hash($data->password, 1));
            }
        });
    }


    public function scopeKindAgent($query, $field , $param)
    {
        $query->whereIn($field, $param);
    }

//    public function getAgentTypeIdAttr($value)
//    {
//        $type = [1=> '一级代理', 2=>'二级代理',3=>'三级代理'];
//        return $type[$value];
//    }
    public function getAgentTypeIdTextAttr($value, $data)
    {
        $type = [0=> '总推', 1=> '一级代理', 2=>'二级代理',3=>'三级代理'];
        return $type[$data['agent_type_id']];
    }


    public function searchUsernameAttr($query, $value, $data)
    {
        $query->whereIn('username', $value)->field('username,agent_type_id');
    }

    //关联代理类型
    public function agentType(): \think\model\relation\BelongsTo
    {
        return $this->belongsTo(AgentType::class);
    }

    // 关联玩家
    public function account()
    {
        return $this->hasMany(Agent::class,'invite', 'invitecode');
    }

    // 关联上级代理
    public function parentAgent()
    {
        return $this->hasOne(Agent::class,'id', 'p_id');
    }

    public function count(): \think\model\relation\BelongsTo
    {
        return $this->belongsTo(AgentCount::class, 'username', 'agent')->field('proceeds,create_time');
    }


    protected $searchCountField = ['username'];
    protected $whereCountField = ['agent_type_id'];
    protected $timeCountField = ['create_time'];
    protected $specialCountTimeFiled = 'create_time';

    public function scopeCountWhere($query, $param, $id = false): void
    {
        //关键词like搜索
        $keywords = $param['_keywords'] ?? '';
        if ('' !== $keywords && count($this->searchField) > 0) {

            $this->searchCountField = implode('|', $this->searchCountField);
            $query->where($this->searchCountField, 'like', '%' . $keywords . '%');
        }

        //字段条件查询
        if (count($this->whereCountField) > 0 && count($param) > 0) {
            foreach ($param as $key => $value) {
                if ($value !== '' && in_array((string)$key, $this->whereCountField, true)) {
                    $query->where($key, $value);
                }
            }
        }


        //时间范围查询
        if (count($this->timeCountField) > 0 && count($param) && is_array($this->timeCountField)) {
            foreach ($param as $key => $value) {
                if ($value !== '' && in_array((string)$key, $this->timeCountField, true)) {
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

        if (!empty($this->specialCountTimeFiled) && !empty($param['special_create_time'])) {
            $query->whereTime($this->specialCountTimeFiled, urldecode($param['special_create_time']));
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
}
