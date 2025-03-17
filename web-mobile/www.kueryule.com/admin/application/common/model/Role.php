<?php
/**
 * 角色列表模型
 */

namespace app\common\model;

use think\Db;

class Role extends Model
{

    public $softDelete = false;
    protected $pk = 'roleid';
    protected $name = 'role';
    protected $autoWriteTimestamp = false;

    // 定义时间戳字段名
    protected $createTime = 'create_time';

    // 设置当前模型的数据库连接
    protected $connection = [
        // 数据库表前缀
        'prefix' => 'qy_',
        'pk' => 'roleid'
    ];


    //可搜索字段
    protected $searchField = [
        'roleid',
        'name'
    ];


    //可作为条件的字段
    protected $whereField = [
        'serverid'
    ];

    //可做为时间
    protected $timeField = [
        'create_time',
        'lastonline'
    ];
    protected $specialTimeFiled = 'create_time';

    public function scopeRole($query)
    {
        $query->where(['roleid' => '157786'])->select();
    }

    public function account()
    {
        return $this->belongsTo('Account', 'accountid', 'accountid');
    }


    public static function getDataList($param, $admin, $request, $kind_agent=false)
    {
        $result = Db::view(['qy_role' => 'role'], ['roleid', 'accountid', 'serverid', 'name', 'sex', 'race', 'level', 'relive', 'money', 'jade', 'xiulevel', 'create_time', 'lastonline', 'exp', 'state'])
            ->view(['qy_account' => 'account'], ['accountid', 'account', 'invite'], 'account.accountid=role.accountid')
            ->view(['agent_admin_user' => 'agent'], 'id,username,invitecode,is_welfare', 'agent.invitecode=account.invite')
            ->where(function ($query) use ($kind_agent){
                if ($kind_agent != false) {
                    $query->whereIn('username', $kind_agent);
                }
            })
            ->where(function ($query) use ($param){
                $keywords = $param['_keywords'] ?? '';
                $searchField = ['role.roleid', 'role.name', 'account.account', 'agent.username'];
                $whereField = ['role.serverid', 'role.state'];
                $timeField = ['role.create_time', 'role.lastonline'];
                $specialTimeFiled = 'role.lastonline';
                if ('' !== $keywords && count($searchField) > 0) {
                    $searchField = implode('|', $searchField);
                    $query->where($searchField, 'like', '%' . $keywords . '%');
                }
                if (count($whereField) > 0 && count($param) > 0) {
                    foreach ($param as $key => $value) {
                        if ($value !== '' && in_array((string)'role.' . $key, $whereField, true)) {
                            $query->where('role.' . $key, $value);
                        }
                    }
                }
                if (count($timeField) > 0 && count($param) && is_array($timeField)) {

                    foreach ($param as $key => $value) {
                        if ($value !== '' && in_array((string)'role.' . $key, $timeField, true)) {
                            $time_range = explode(' - ', $value);
                            [$start_time, $end_time] = $time_range;
                            $query->where('role.' . $key, 'between', [$start_time, $end_time]);
                        }
                    }
                }
                if (!empty($specialTimeFiled) && !empty($param['special_create_time'])) {
                    $query->whereTime($specialTimeFiled, urldecode($param['special_create_time']));
                }
            })
            ->paginate($admin['per_page'], false, ['query' => $request->get()]);
            
            
            //print_r( Db::getLastSQL() ); 
            
        return $result;
    }


    public function getRoleInfo($request, $admin, $user, $kind_agent, $where, $param, $whereTime)
    {
        if (!empty($whereTime)) {
            $time_range = explode(' - ', $whereTime);
            [$start_time, $end_time] = $time_range;
        } else {
            $start_time = date('Y-m-d H:i:s',1577808000);
            $end_time = date('Y-m-d H:i:s',time());
        }
        if ($user['role'][0] == 2) {
            $result = Db::view(['qy_role' => 'role'], ['roleid', 'accountid', 'serverid', 'name', 'sex', 'race', 'level', 'relive', 'money', 'xiulevel', 'create_time', 'lastonline', 'exp', 'state'])
                ->view(['qy_account' => 'account'], ['accountid', 'account', 'invite'], 'account.accountid=role.accountid')
                ->view(['agent_admin_user' => 'agent'], 'id,username,invitecode', 'agent.invitecode=account.invite')
                ->whereIn('agent.username', $kind_agent)
                ->where('role.create_time', 'between', [$start_time, $end_time])
                ->whereTime('role.create_time', $param['special_create_time'])
                ->where($where)
                ->paginate($admin['per_page'], false, ['query' => $request->get()]);
        } else {
            $result = Db::view(['qy_role' => 'role'], ['roleid', 'accountid', 'serverid', 'name', 'sex', 'race', 'level', 'relive', 'money', 'xiulevel', 'create_time', 'lastonline', 'exp', 'state'])
                ->view(['qy_account' => 'account'], ['accountid', 'account', 'invite'], 'account.accountid=role.accountid')
                ->view(['agent_admin_user' => 'agent'], 'id,username,invitecode', 'agent.invitecode=account.invite')
                ->where('role.create_time', 'between', [$start_time, $end_time])
                ->whereTime('role.create_time', $param['special_create_time'])
                ->where($where)
                ->paginate($admin['per_page'], false, ['query' => $request->get()]);
        }
        return $result;
    }


}
