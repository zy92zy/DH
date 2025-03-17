<?php
/**
 * 余额变更记录控制器
 */

namespace app\admin\controller;

use app\common\model\Agent;
use think\Request;
use app\common\model\AgentMoney;
use app\common\validate\AgentMoneyValidate;
use Exception;
use Error;
use think\Db;


class AgentMoneyController extends Controller
{

    //列表
    public function index(Request $request, AgentMoney $model)
    {
        $param = $request->param();
        $kind_agent = $this->getAgentAndKind('username',true);
        $model = $model->KindAgent('agent',$kind_agent)->scope('where', $param);

        $data = $model->paginate($this->admin['per_page'], false, ['query' => $request->get()]);
        
        $agent_money = Db::name('agent_money');
        
        $data = $agent_money->select();
        foreach($data as $k=>$d){
            if($d['type']==0){
                $data[$k]['type_text'] = '增加'; 
            }else{
                $data[$k]['type_text'] = '减少'; 
            }
            if($d['status']==0){
                $data[$k]['status_text'] = '成功'; 
            }else{
                $data[$k]['status_text'] = '失败'; 
            }
            $data[$k]['create_time'] = date('Y-m-d H:i:s',$d['create_time']); 
            $data[$k]['update_time'] = date('Y-m-d H:i:s',$d['update_time']); 
        }
        //var_dump($data);die;
        
        //关键词，排序等赋值
        $this->assign($request->get());

        $this->assign([
            'data' => $data,
            'page' => $agent_money->count(),
            'total' => $agent_money->count(),

        ]);
        return $this->fetch();
    }

    //添加
    public function add(Request $request, AgentMoney $model, AgentMoneyValidate $validate)
    {
        $agent = $request->param('agent');
        if ($request->isPost()) {
            $param = $request->param();
            $param['money'] = sprintf("%.2f", $param['money']);
            $param['username'] = $this->user['username'];
            $validate_result = $validate->scene('add')->check($param);
            if (!$validate_result) {
                return error($validate->getError());
            }
            if ($this->user['role'][0] != 2) {
                $param['content'] = '管理员手动修改';
                switch ($param['type']) {
                    case 0 :
                        $updata = Agent::setAgentMoney('inc', $param['agent'], $param['money']);
                        break;
                    case 1 :
                        $agent_money = Agent::where(['username' => $param['agent']])->value('real_money');
                        if ($agent_money < $param['money']) {
                            error("该代理没有那么多钱啦,当前剩余 <small class='label label-danger'>{$agent_money} 元</small>");
                        }
                        $updata = Agent::setAgentMoney('dec', $param['agent'], $param['money']);
                        break;
                }
            } else {
                $param['content'] = '上级代理手动修改';
                switch ($param['type']) {
                    case 0 :
                        try {
                            $my_money = Agent::where('username', $this->user['username'])->value('real_money');
                            if ($my_money < $param['money']) error("你的账户余额不足,当前剩余 <small class='label label-danger'>{$my_money} 元</small>");
                            $up_parent_data = Agent::setAgentMoney('dec', $this->user['username'], $param['money']);
                            $up_parent_data ?? error('失败，请重试');
                            $updata_agent = Agent::setAgentMoney('inc',$param['agent'], $param['money']);
                            !$updata_agent ?? error('失败，请重试');
                            $updata = $model::create([
                                'username' => $this->user['username'],
                                'agent' => $this->user['username'],
                                'type' => 1,
                                'money' => $param['money'],
                                'content' => '修改下级代理余额减少',
                            ]);
                        } catch (Exception $exception) {
                            error($exception->getMessage());
                        } catch (Error $error) {
                            error($error->getMessage());
                        }
                        break;
                    case 1 :
                        try {
                            $agent_money = Agent::where(['username' => $param['agent']])->value('real_money');
                            if ($agent_money < $param['money']) error("该代理没有那么多钱啦,当前剩余 <small class='label label-danger'>{$agent_money} 元</small>");
                            $up_parent_data = Agent::setAgentMoney('inc', $this->user['username'],$param['money']);
                            $up_parent_data ?? error('失败，请重试');
                            $updata_agent = Agent::setAgentMoney('dec',$param['agent'],$param['money']);
                            !$updata_agent ?? error('失败，请重试');
                            $updata = $model::create([
                                'username' => $this->user['username'],
                                'agent' => $this->user['username'],
                                'type' => 0,
                                'money' => $param['money'],
                                'content' => '修改下级代理余额退回',
                            ]);
                        } catch (Exception $exception) {
                            error($exception->getMessage());
                        } catch (Error $error) {
                            error($error->getMessage());
                        }
                        break;
                }
            }
            !$updata ?? error();
            $result = $model::create($param);
            return $result ? success('修改成功') : error();

        }

        $this->assign([
            'agent' => $agent
        ]);

        return $this->fetch();
    }
}
