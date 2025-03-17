<?php
/**
 * 后台首页控制器
 * @author yupoxiong<i@yufuping.com>
 */

namespace app\admin\controller;

use app\admin\model\AdminUser;
use app\common\model\Account;
use app\common\model\Agent;
use app\common\model\AgentCount;
use app\common\model\ChargeRecord;
use app\common\model\Model;
use app\common\model\Role;
use tools\SystemInfo;
use think\Request;

class IndexController extends Controller
{
    public function index(Request $request)
    {
        $index_config = config('admin.index');
        //默认密码修改检测
        $password_danger = 0;
        if (1 === ((int)$this->user->id) && $index_config['password_warning'] && password_verify('super-admin', base64_decode($this->user->password))) {
            $password_danger = 1;
        }


        //是否首页显示提示信息
        $show_notice = $index_config['show_notice'];
        //提示内容
        $notice_content = $index_config['notice_content'];
        $admin_qq = $index_config['admin_qq'];
        $month = [
            'last_month' => $this->countMonth('last_month'),
            'month' => $this->countMonth('month')
        ];

        if ($this->user['role'][0] != 2) {
            $count_data = [
                'count_revenues' => [
                    'last_month_recharge' => $this->countRevenues('recharge', 'last_month'),
                    'last_month_agent' => $this->countRevenues('agent', 'last_month'),
                    'month_recharge' => $this->countRevenues('recharge', 'month'),
                    'month_agent' => $this->countRevenues('agent', 'month'),
                    'month_account' => $this->countRevenues('account', 'month'),
                    'month_role' => $this->countRevenues('role', 'month'),
                    'last_month_account' => $this->countRevenues('account', 'last_month'),
                    'last_month_role' => $this->countRevenues('role', 'last_month'),
                ],
                'base_count' => [
                    'admin_user_count' => AdminUser::scope('Role')->count(),
                    'forfeit_agent_money' => sprintf("%.2f", Agent::sum('money') - Agent::sum('no_money')),
                    'no_agent_money' => sprintf("%.2f", Agent::sum('no_money')),
                ],
                'recharge' => [
                    'today' => sprintf("%.2f", ChargeRecord::scope('Status')->whereTime('finish_time', 'today')->sum('money')),
                    'yesterday' => sprintf("%.2f", ChargeRecord::scope('Status')->whereTime('finish_time', 'yesterday')->sum('money')),

                    'month' => sprintf("%.2f", ChargeRecord::scope('Status')->whereTime('finish_time', 'month')->sum('money')),
                    'last_month' => sprintf("%.2f", ChargeRecord::scope('Status')->whereTime('finish_time', 'last month')->sum('money')),
                    'year' => sprintf("%.2f", ChargeRecord::scope('Status')->whereTime('finish_time', 'year')->sum('money')),
                    'total' => sprintf("%.2f", ChargeRecord::scope('Status')->sum('money')),
                ],
                'agent_proceeds' => [
                    'today' => sprintf("%.2f", AgentCount::whereTime('create_time', 'today')->sum('proceeds')),
                    'yesterday' => sprintf("%.2f", AgentCount::whereTime('create_time', 'yesterday')->sum('proceeds')),
                    'month' => sprintf("%.2f", AgentCount::whereTime('create_time', 'month')->sum('proceeds')),
                    'last_month' => sprintf("%.2f", AgentCount::whereTime('create_time', 'last month')->sum('proceeds')),
                    'year' => sprintf("%.2f", AgentCount::whereTime('create_time', 'year')->sum('proceeds')),
                    'total' => sprintf("%.2f", AgentCount::sum('proceeds')),
                ],
                'account' => [
                    'today' => Account::whereTime('register_time', 'today')->count(),
                    'yesterday' => Account::whereTime('register_time', 'yesterday')->count(),
                    'month' => Account::whereTime('register_time', 'month')->count(),
                    'last_month' => Account::whereTime('register_time', 'last month')->count(),
                    'year' => Account::whereTime('register_time', 'year')->count(),
                    'total' => Account::count(),
                ],
                'role' => [
                    'today' => Role::whereTime('create_time', 'today')->count(),
                    'yesterday' => Role::whereTime('create_time', 'yesterday')->count(),
                    'month' => Role::whereTime('create_time', 'month')->count(),
                    'last_month' => Role::whereTime('create_time', 'last month')->count(),
                    'year' => Role::whereTime('create_time', 'year')->count(),
                    'total' => Role::count(),
                ]
            ];
            $this->assign('count_data', $count_data);

        } else {
            $param_recharge_today = ['status' => 1, 'special_create_time' => 'today'];
            $param_recharge_yesterday = ['status' => 1, 'special_create_time' => 'yesterday'];
            $param_recharge_month = ['status' => 1, 'special_create_time' => 'month'];
            $param_recharge_last_month = ['status' => 1, 'special_create_time' => 'last month'];
            $param_recharge_year = ['status' => 1, 'special_create_time' => 'year'];
            $param_recharge_total = ['status' => 1];
            $kind_agent = $this->getAgentAndKind('username');
            $kind_agent_own = $this->getAgentAndKind('username', true);

            $count_data = [
                'count_revenues' => [
                    'last_month_recharge' => $this->countRevenues('recharge', 'last_month'),
                    'last_month_agent' => $this->countRevenues('agent', 'last_month'),
                    'month_recharge' => $this->countRevenues('recharge', 'month'),
                    'month_agent' => $this->countRevenues('agent', 'month'),
                    'month_account' => $this->countRevenues('account', 'month'),
                    'month_role' => $this->countRevenues('role', 'month'),
                    'last_month_account' => $this->countRevenues('account', 'last_month'),
                    'last_month_role' => $this->countRevenues('role', 'last_month'),
                ],
                'recharge' => [
                    
                    'today' => sprintf("%.2f", array_sum(array_column(ChargeRecord::getDataList($param_recharge_today, $this->admin, $request, $kind_agent_own, true), 'money'))),
                    'yesterday' => sprintf("%.2f", array_sum(array_column(ChargeRecord::getDataList($param_recharge_yesterday, $this->admin, $request, $kind_agent_own, true), 'money'))),
                    'month' => sprintf("%.2f", array_sum(array_column(ChargeRecord::getDataList($param_recharge_month, $this->admin, $request, $kind_agent_own, true), 'money'))),
                    'last_month' => sprintf("%.2f", array_sum(array_column(ChargeRecord::getDataList($param_recharge_last_month, $this->admin, $request, $kind_agent_own, true), 'money'))),
                    'year' => sprintf("%.2f", array_sum(array_column(ChargeRecord::getDataList($param_recharge_year, $this->admin, $request, $kind_agent_own, true), 'money'))),
                    'total' => sprintf("%.2f", array_sum(array_column(ChargeRecord::getDataList($param_recharge_total, $this->admin, $request, $kind_agent_own, true), 'money'))),
                    
                ],
                'agent_proceeds' => [
                    'today' => sprintf("%.2f", AgentCount::whereIn('agent', $kind_agent_own)->whereTime('create_time', 'today')->sum('proceeds')),
                    'yesterday' => sprintf("%.2f", AgentCount::whereIn('agent', $kind_agent_own)->whereTime('create_time', 'yesterday')->sum('proceeds')),
                    'month' => sprintf("%.2f", AgentCount::whereIn('agent', $kind_agent_own)->whereTime('create_time', 'month')->sum('proceeds')),
                    'last_month' => sprintf("%.2f", AgentCount::whereIn('agent', $kind_agent_own)->whereTime('create_time', 'last month')->sum('proceeds')),
                    'year' => sprintf("%.2f", AgentCount::whereIn('agent', $kind_agent_own)->whereTime('create_time', 'year')->sum('proceeds')),
                    'total' => sprintf("%.2f", AgentCount::whereIn('agent', $kind_agent_own)->sum('proceeds')),
                ],
                'account' => [
                    'today' => Account::withJoin(['agent' => function ($query) use ($kind_agent_own) {
                        $query->whereIn('username', $kind_agent_own);
                    }])->whereTime('register_time', 'today')->count(),
                    'yesterday' => Account::withJoin(['agent' => function ($query) use ($kind_agent_own) {
                        $query->whereIn('username', $kind_agent_own);
                    }])->whereTime('register_time', 'yesterday')->count(),
                    'month' => Account::withJoin(['agent' => function ($query) use ($kind_agent_own) {
                        $query->whereIn('username', $kind_agent_own);
                    }])->whereTime('register_time', 'month')->count(),
                    'last_month' => Account::withJoin(['agent' => function ($query) use ($kind_agent_own) {
                        $query->whereIn('username', $kind_agent_own);
                    }])->whereTime('register_time', 'last month')->count(),
                    'year' => Account::withJoin(['agent' => function ($query) use ($kind_agent_own) {
                        $query->whereIn('username', $kind_agent_own);
                    }])->whereTime('register_time', 'year')->count(),
                    'total' => Account::withJoin(['agent' => function ($query) use ($kind_agent_own) {
                        $query->whereIn('username', $kind_agent_own);
                    }])->count(),
                ],
                'role' => [
                    'today' => count(Role::getDataList($param_recharge_today, $this->admin, $request, $kind_agent)->toArray()['data']),
                    'yesterday' => count(Role::getDataList($param_recharge_yesterday, $this->admin, $request, $kind_agent)->toArray()['data']),
                    'month' => count(Role::getDataList($param_recharge_month, $this->admin, $request, $kind_agent)->toArray()['data']),
                    'last_month' => count(Role::getDataList($param_recharge_last_month, $this->admin, $request, $kind_agent)->toArray()['data']),
                    'year' => count(Role::getDataList($param_recharge_year, $this->admin, $request, $kind_agent)->toArray()['data']),
                    'total' => count(Role::getDataList($param_recharge_total, $this->admin, $request, $kind_agent)->toArray()['data']),
                ],
                'no_clearing' => Agent::whereIn('id', $this->user['id'])->value('no_money'),
                'parent_qq' => Agent::where(['id'=>$this->user['p_id']])->value('qq'),
            ];
            if ($kind_agent == $this->user['username']) {
                $sub_offer_up_money = 0;
                $sub_agent_count = 0;
            } else {
                $sub_offer_up_money = sprintf("%.2f",AgentCount::whereIn('agent', $kind_agent)->sum('proceeds'));
                $sub_agent_count = substr_count($kind_agent, ',') + 1;
            }
            $this->assign([
                'sub_offer_up_money' => $sub_offer_up_money,
                'sub_agent_count' => $sub_agent_count
            ]);
        }




        $this->assign([
            //系统信息
            'system_info' => SystemInfo::getSystemInfo(),
            //访问信息
            'visitor_info' => $request,
            //默认密码警告
            'password_danger' => $password_danger,
            //当前用户
            'user' => $this->user,
            //是否显示提示信息
            'show_notice' => $show_notice,
            //提示内容
            'notice_content' => $notice_content,
            'admin_qq' => $admin_qq,
            'month' => $month,
            'count_data' => $count_data,


        ]);
        return $this->fetch();
    }

    public function countMonth($param)
    {
        switch ($param) {
            case 'month' :
                // x 轴数据，作为 x 轴标注
                $j = date("t"); //获取当前月份天数
                $start_time = strtotime(date('Y-m-01'));  //获取本月第一天时间戳
                $result = array();
                for ($i = 0; $i < $j; $i++) {
                    $result[] = date('Y-m-d', $start_time + $i * 86400); //每隔一天赋值给数组
                }
                break;
            case 'last_month' :
                $last_month = strtotime("-1 month");
                $j = date("t", $last_month); // 获取上个月天数
                $start_time = strtotime(date("Y-m-01", $last_month)); // 上个月第一天
                $result = array();
                for ($i = 0; $i < $j; $i++) {
                    $result[] = date('Y-m-d', $start_time + $i * 86400); //每隔一天赋值给数组
                }
                break;
        }
        return $result;
    }

    public function countRevenues($param, $month = 'month')
    {
        switch ($month) {
            // 本月
            case 'month' :
                $countMonth = $this->countMonth($month);
                switch ($param) {
                    case 'agent' :
                        foreach ($countMonth as $key => $item) {
                            $result[] = AgentCount::whereBetweenTime('create_time', date('Y-m-d', strtotime($item)))->sum('proceeds');
                        }
                        break;
                    case 'recharge' :
                        foreach ($countMonth as $key => $item) {
                            $result[] = ChargeRecord::scope('Status')->whereBetweenTime('finish_time', date('Y-m-d', strtotime($item)))->sum('money');
                        }
                        break;
                    case 'account' :
                        foreach ($countMonth as $key => $item) {
                            $result[] = Account::whereBetweenTime('register_time', date('Y-m-d', strtotime($item)))->count();
                        }
                        break;
                    case 'role' :
                        foreach ($countMonth as $key => $item) {
                            $result[] = Role::whereBetweenTime('create_time', date('Y-m-d', strtotime($item)))->count();
                        }
                        break;
                }
                break;
            // 上月
            case 'last_month' :
                $countMonth = $this->countMonth($month);
                switch ($param) {
                    case 'agent' :
                        foreach ($countMonth as $key => $item) {
                            $result[] = AgentCount::whereBetweenTime('create_time', date('Y-m-d', strtotime($item)))->sum('proceeds');
                        }
                        break;
                    case 'recharge' :
                        foreach ($countMonth as $key => $item) {
                            $result[] = ChargeRecord::scope('Status')->whereBetweenTime('finish_time', date('Y-m-d', strtotime($item)))->sum('money');
                        }
                        break;
                    case 'account' :
                        foreach ($countMonth as $key => $item) {
                            $result[] = Account::whereBetweenTime('register_time', date('Y-m-d', strtotime($item)))->count();
                        }
                        break;
                    case 'role' :
                        foreach ($countMonth as $key => $item) {
                            $result[] = Role::whereBetweenTime('create_time', date('Y-m-d', strtotime($item)))->count();
                        }
                        break;
                }
                break;
        }
        return $result;
    }
}
