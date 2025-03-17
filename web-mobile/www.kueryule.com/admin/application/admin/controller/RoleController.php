<?php
/**
 * 角色列表控制器
 */

namespace app\admin\controller;

use app\common\model\Account;
use app\common\model\GameGm;
use think\Db;
use think\Request;
use app\common\model\Role;

use app\common\validate\QyRoleValidate;

class RoleController extends Controller
{

    //列表
    public function index(Request $request, Role $model)
    {
        $welfare_config = config('game.welfare');
        $param = $request->param();
        if ($this->user['role'][0] != 2) {
            $data = $model->getDataList($param,$this->admin, $request);
        } else {
            $kind_agent = $this->getAgentAndKind('username', true);
            $data = $model->getDataList($param,$this->admin, $request, $kind_agent);
        }
        $is_welfare = 0;
        if ($welfare_config['is_welfare'] == 1 && $this->user['is_welfare'] == 1){
            $is_welfare = 1;
        }
        
        //关键词，排序等赋值
        $this->assign($request->get());
        $this->assign([
            'data' => $data,
            'page' => $data->render(),
            'total' => $data->total(),
            'user_role' => $this->user['role'][0],
            'is_welfare' => $is_welfare,
            'welfare_config' => $welfare_config,
            'serv_list' => \app\common\model\GameGm::getServList(),
        ]);
        return $this->fetch();
    }


    public function agentWelfare($id, GameGm $model)
    {
        $welfare_config = config('game.welfare');
        $url = config('game.game.gm_url');
        $kind_agent = $this->getAgentAndKind('username', true);
        $result = $model->where(['status'=>0,'type'=>3])
            ->whereIn('role_id',$id)
            ->whereTime('update_time',"-{$welfare_config['interval']} hours")
            ->field('update_time')
            ->find();

        if (!empty($result)) {
            $start_time = date_create(date("Y-m-d H:i:s", time()));
            $end_time = strtotime("+{$welfare_config['interval']} hour", strtotime($result['update_time']));
            $end_time = date("Y-m-d H:i:s",$end_time);
            $end_time = date_create($end_time);
            $time = date_diff($start_time, $end_time);
            error("发送失败，<h4 class='label label-danger'>{$time->d}天{$time->h}时{$time->i}分{$time->s}秒</h4> 后再试");
        }
        if (empty($welfare_config['item_id']) || empty($welfare_config['item_num'])) error('福利配置异常，请联系管理员');
        $param = [
            'username' => $this->user['username'],
            'type' => 'mail_item',
            'role_id' => $id,
            'item' => $welfare_config['item_id'],
            'item_num' => $welfare_config['item_num']
        ];
        $result = $model::setGmPerform($param,$url);
        if (!$result['gm']) {
            error('GM接口异常');
        }
        $result['gm'] = json_decode($result['gm']);
        
        // if ($result['gm']->code == 0) {
        //     $model->save(['status' => 0],['id' =>$result['id']]);
        //     success('福利发送成功');
        if ($result['gm'] != '') {
            $model->save(['status' => 0],['id' =>$result['id']]);
            success('福利发送成功');
        } else {
            error('福利发送失败');
        }
    }
}
