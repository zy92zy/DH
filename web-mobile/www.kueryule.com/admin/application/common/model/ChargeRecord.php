<?php
/**
 * 充值记录模型
 */

namespace app\common\model;


use think\Db;

class ChargeRecord extends Model
{
    protected $name = 'charge_record';
    protected $autoWriteTimestamp = false;

    protected $connection = [
        'prefix' => '',
    ];

    //可搜索字段
    protected $searchField = [
        'recharge.orderid',
        'recharge.roleid',
    ];

    //可作为条件的字段
    protected $whereField = [
        'serverid',
        'status'
    ];

    //可做为时间
    protected $timeField = [
        'create_time'
    ];

    protected $specialTimeFiled = 'create_time';

    public function scopeKindAgent($query, $field, $param)
    {
        $query->whereIn($field, $param);
    }

    //状态获取器
    public function getStatusTextAttr($value, $data)
    {
        return self::RECHARGE_STATUS_TEXT[$data['status']];
    }

    public function getServeridTextAttr($value, $data)
    {
        return self::SERVERID_TEXT[$data['serverid']];
    }

    public static function getDataList($param, $admin, $request, $kind_agent = false, $all = false)
    {
        
        $modem = Db::view(['charge_record' => 'recharge'], 'orderid,roleid,money,create_time,finish_time,serverid,status,sdpayno')
            ->view(['qy_role' => 'role'], 'roleid,accountid', 'role.roleid=recharge.roleid')
            ->view(['qy_account' => 'account'], 'accountid,account', 'account.accountid=role.accountid')
            ->view(['agent_admin_user' => 'agent'], 'id,username', 'agent.invitecode=recharge.invite')
            ->whereNotNull('recharge.sdpayno')
            ->where(function ($query) use ($kind_agent) {
                if ($kind_agent != false) {
                    $query->whereIn('username', $kind_agent);
                }
            })
            ->where(function ($query) use ($param) {
                $keywords = $param['_keywords'] ?? '';
                $searchField = ['recharge.orderid', 'recharge.roleid', 'account.account', 'agent.username'];
                $whereField = ['recharge.serverid', 'recharge.status'];
                $timeField = ['recharge.create_time'];
                $specialTimeFiled = 'recharge.create_time';
                if ('' !== $keywords && count($searchField) > 0) {
                    $searchField = implode('|', $searchField);
                    $query->where($searchField, 'like', '%' . $keywords . '%');
                }
                if (count($whereField) > 0 && count($param) > 0) {
                    foreach ($param as $key => $value) {
                        if ($value !== '' && in_array((string)'recharge.' . $key, $whereField, true)) {
                            $query->where('recharge.' . $key, $value);
                        }
                    }
                }
                if (count($timeField) > 0 && count($param) && is_array($timeField)) {

                    foreach ($param as $key => $value) {
                        if ($value !== '' && in_array((string)'recharge.' . $key, $timeField, true)) {
                            $time_range = explode(' - ', $value);
                            [$start_time, $end_time] = $time_range;
                            $query->where('recharge.' . $key, 'between', [$start_time, $end_time]);
                        }
                    }
                }
                if (!empty($specialTimeFiled) && !empty($param['special_create_time'])) {
                    $query->whereTime($specialTimeFiled, urldecode($param['special_create_time']));
                }
            });
            
            if($all){
                $result = $modem->select();
            }else{
                $result = $modem->paginate($admin['per_page'], false, ['query' => $request->get()]);
            }
            //print_r( Db::getLastSQL() ); 
            
        return $result;
    }


    public function role()
    {
        return $this->hasOne('Role', 'roleid', 'roleid')->bind('account');
    }

    public function scopeStatus($query)
    {
        $query->where('status', 1);
    }


    public static function countAgentMoney()
    {

        $data = Db::view(['charge_record' => 'recharge'], 'orderid,roleid,money,finish_time,status,serverid,balance_status')
            ->view(['qy_role' => 'role'], 'roleid,accountid', 'recharge.roleid=role.roleid')
            ->view(['qy_account' => 'account'], 'accountid,account,invite', 'role.accountid=account.accountid')
            ->view(['agent_admin_user' => 'agent'], 'username as agent,p_id,push_scale,agent_type_id', 'account.invite=agent.invitecode')
            ->whereNotNull('recharge.sdpayno')
            ->where(['recharge.status' => 1, 'recharge.balance_status' => 1])
            ->where(['agent.role' => 2])
            ->select();

        foreach ($data as $key => $item) {
            if (isset($item['agent']) && !empty($item['agent'])) {
                $agent_data = Db::table('agent_admin_user')
                    ->where(['username' => $item['agent'], 'role' => 2])
                    ->field('id,username,agent_type_id,p_id,push_scale')
                    ->find();
                switch ($agent_data['agent_type_id']) {
                    // 一级代理
                    case 1 :
                        $proceeds = ($agent_data['push_scale'] / 100) * $item['money'];
                        $sql[] = Db::table('agent_agent_count')->data([
                            'agent' => $item['agent'],
                            'serverid' => $item['serverid'],
                            'role_id' => $item['roleid'],
                            'account' => $item['account'],
                            'money' => $item['money'],
                            'proceeds' => $proceeds,
                            'create_time' => strtotime($item['finish_time']),
                            'orderid' => $item['orderid'],
                        ])->fetchSql()->insert();
                        $sql[] = Db::table('agent_admin_user')->where(['id' => $agent_data['id']])->fetchSql()
                            ->setInc('money', $proceeds);
                        $sql[] = Db::table('agent_admin_user')->where(['id' => $agent_data['id']])->fetchSql()
                            ->setInc('no_money', $proceeds);
                        $sql[] = Db::table('charge_record')
                            ->where(['orderid' => $item['orderid']])
                            ->fetchSql()
                            ->update(['balance_status' => 0]);
                        break;
                    // 二级代理
                    case 2 :
                        if (!empty($agent_data['p_id'])) {
                            $parent_agent_data = Db::table('agent_admin_user')
                                ->where(['id' => $agent_data['p_id']])
                                ->field('id,username,agent_type_id,p_id,push_scale')
                                ->find();
                            $parent_proceeds = (($parent_agent_data['push_scale'] - $agent_data['push_scale']) / 100) * $item['money'];
                            $sql[] = Db::table('agent_agent_count')->data([
                                'agent' => $parent_agent_data['username'],
                                'serverid' => $item['serverid'],
                                'role_id' => $item['roleid'],
                                'account' => $item['account'],
                                'money' => $item['money'],
                                'proceeds' => $parent_proceeds,
                                'create_time' => strtotime($item['finish_time']),
                                'orderid' => $item['orderid'],
                            ])->fetchSql()->insert();
                        }
                        $proceeds = ($agent_data['push_scale'] / 100) * $item['money'];
                        $sql[] = Db::table('agent_agent_count')->data([
                            'agent' => $item['agent'],
                            'serverid' => $item['serverid'],
                            'role_id' => $item['roleid'],
                            'account' => $item['account'],
                            'money' => $item['money'],
                            'proceeds' => $proceeds,
                            'create_time' => strtotime($item['finish_time']),
                            'orderid' => $item['orderid'],
                        ])->fetchSql()->insert();
                        $sql[] = Db::table('agent_admin_user')->where(['id' => $agent_data['id']])->fetchSql()
                            ->setInc('money', $proceeds);
                        $sql[] = Db::table('agent_admin_user')->where(['id' => $agent_data['id']])->fetchSql()
                            ->setInc('no_money', $proceeds);
                        $sql[] = Db::table('charge_record')
                            ->where(['orderid' => $item['orderid']])
                            ->fetchSql()
                            ->update(['balance_status' => 0]);
                        break;
                        //三级代理
                    case 3 :
                        if (!empty($agent_data['p_id'])) {
                            $parent_agent_data = Db::table('agent_admin_user')
                                ->where(['id' => $agent_data['p_id']])
                                ->field('id,username,agent_type_id,p_id,push_scale')
                                ->find();
                            $parent_proceeds = (($parent_agent_data['push_scale'] - $agent_data['push_scale']) / 100) * $item['money'];
                            $sql[] = Db::table('agent_agent_count')->data([
                                'agent' => $parent_agent_data['username'],
                                'serverid' => $item['serverid'],
                                'role_id' => $item['roleid'],
                                'account' => $item['account'],
                                'money' => $item['money'],
                                'proceeds' => $parent_proceeds,
                                'create_time' => strtotime($item['finish_time']),
                                'orderid' => $item['orderid'],
                            ])->fetchSql()->insert();
                            $sql[] = Db::table('agent_admin_user')
                                ->where(['id' => $parent_agent_data['id']])
                                ->fetchSql()
                                ->setInc('money', $parent_proceeds);
                            $sql[] = Db::table('agent_admin_user')
                                ->where(['id' => $parent_agent_data['id']])
                                ->fetchSql()
                                ->setInc('no_money', $parent_proceeds);
                            if (!empty($parent_agent_data['p_id'])) {
                                $top_agent_data = Db::table('agent_admin_user')
                                    ->where(['id' => $parent_agent_data['p_id']])
                                    ->field('id,username,agent_type_id,p_id,push_scale')
                                    ->find();
                                $top_proceeds = (($top_agent_data['push_scale'] - $parent_agent_data['push_scale']) / 100) * $item['money'];
                                $sql[] = Db::table('agent_agent_count')->data([
                                    'agent' => $top_agent_data['username'],
                                    'role_id' => $item['roleid'],
                                    'serverid' => $item['serverid'],
                                    'account' => $item['account'],
                                    'money' => $item['money'],
                                    'proceeds' => $top_proceeds,
                                    'create_time' => strtotime($item['finish_time']),
                                    'orderid' => $item['orderid']
                                ])->fetchSql()->insert();
                                $sql[] = Db::table('agent_admin_user')
                                    ->where(['id' => $top_agent_data['id']])
                                    ->fetchSql()
                                    ->setInc('money', $top_proceeds);
                                $sql[] = Db::table('agent_admin_user')
                                    ->where(['id' => $top_agent_data['id']])
                                    ->fetchSql()
                                    ->setInc('no_money', $top_proceeds);
                            }
                        }
                        $proceeds = $item['money'] / 100 * $agent_data['push_scale'];
                        $sql[] = Db::table('agent_agent_count')->data([
                            'agent' => $item['agent'],
                            'serverid' => $item['serverid'],
                            'role_id' => $item['roleid'],
                            'account' => $item['account'],
                            'money' => $item['money'],
                            'proceeds' => $proceeds,
                            'create_time' => strtotime($item['finish_time']),
                            'orderid' => $item['orderid']
                        ])->fetchSql()->insert();
                        $sql[] = Db::table('agent_admin_user')
                            ->where(['id' => $agent_data['id']])
                            ->fetchSql()
                            ->setInc('money', $proceeds);
                        $sql[] = Db::table('agent_admin_user')
                            ->where(['id' => $agent_data['id']])
                            ->fetchSql()
                            ->setInc('no_money', $proceeds);
                        $sql[] = Db::table('charge_record')
                            ->where(['orderid' => $item['orderid']])
                            ->fetchSql()
                            ->update(['balance_status' => 0]);
                        break;
                }
            }
        }
        Db::startTrans();
        try {
            foreach ($sql as $key => $value) {
                Db::execute($value);
            }
            Db::commit();
            return true;
        } catch (\Exception $exception) {
            Db::rollback();
            return false;
        }

    }

}
