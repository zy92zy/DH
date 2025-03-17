<?php
// +----------------------------------------------------------------------
// | 作者：修缘    联系QQ：278896498   QQ群：1054861244
// | 声明：未经作者许可，禁止倒卖等商业运营，违者必究
// +----------------------------------------------------------------------
// | 创建时间:2020/2/22 21:47
// +----------------------------------------------------------------------

namespace app\admin\controller;


use app\common\model\Agent;
use app\common\model\AgentMoney;
use app\common\model\GameGm;
use app\common\validate\GameGmValidate;
use Exception;
use Error;
use think\Request;
use think\db;

class GameGmController extends Controller
{
    public function index(Request $request, GameGmValidate $validate, GameGm $model)
    {
        $title_list = config('title.list');
        if ($request->isPost()) {
            $data = $request->post();
            $param['username'] = $this->user['username'];
            $param['role'] = $this->user['role'][0];
            switch ($data['type']) {
                // 仙玉
                case 'recharge_gold' :
                    $validate_res = $validate->scene('recharge_gold')->check($data);
                    if (!$validate_res) error($validate->getError());
                    $param['type'] = 'add_jade';
                    $param['role_id'] = $data['role_id'];
                    $param['jade'] = $data['gold_num'];
                    
                    $this->insert_log('仙玉', $param);
                    
                    break;
                // 经验
                case 'recharge_exp' :
                    $validate_res = $validate->scene('recharge_exp')->check($data);
                    if (!$validate_res) error($validate->getError());
                    $param['type'] = 'add_exp';
                    $param['role_id'] = $data['role_id'];
                    $param['exp'] = $data['gold_num'];
                    
                    
                    $this->insert_log('经验', $param);
                    break;
                // 物品
                case 'mail_item' :
                    $validate_res = $validate->scene('mail_item')->check($data);
                    if (!$validate_res) error($validate->getError());
                    $param['type'] = 'mail_item';
                    $param['role_id'] = $data['role_id'];
                    $param['item'] = $data['item_id'];
                    $param['item_num'] = $data['gold_num'];
                    
                    $this->insert_log('物品', $param);
                    break;
                // 设置公告
                case 'notice' :
                    $validate_res = $validate->scene('notice')->check($data);
                    if (!$validate_res) error($validate->getError());
                    $param['type'] = 'notice';
                    $param['text'] = html_entity_decode($data['notice_content']);
                    $this->insert_log('设置公告', $param);
                    break;
                // 禁言
                case 'not_speek' :
                    $validate_res = $validate->scene('is_speek')->check($data);
                    if (!$validate_res) error($validate->getError());
                    $param['type'] = 'not_speek';
                    $param['role_id'] = $data['role_id'];
                    $param['server_id'] = $data['server_id'];
                    
                    
                    $this->insert_log('禁言', $param);
                    break;
                // 解除禁言
                case 'can_speek' :
                    $validate_res = $validate->scene('is_speek')->check($data);
                    if (!$validate_res) error($validate->getError());
                    $param['type'] = 'can_speek';
                    $param['role_id'] = $data['role_id'];
                    $param['server_id'] = $data['server_id'];
                    
                    
                    $this->insert_log('解除禁言', $param);
                    break;
                // 系统通知
                case 'inform' :
                    $validate_res = $validate->scene('inform')->check($data);
                    if (!$validate_res) error($validate->getError());
                    $param['type'] = 'inform';
                    $param['inform_type'] = $data['inform_type'];
                    $param['text'] = urlencode($data['inform_content']);
                    $param['server_id'] = $data['server_id'];
                    $param['times'] = $data['times'];
                    $param['interval'] = $data['interval'];
                    
                    
                    $this->insert_log('系统通知', $param);
                    break;
                // 添加称号
                case 'add_title' :
                    $validate_res = $validate->scene('add_title')->check($data);
                    if (!$validate_res) error($validate->getError());
                    $param['type'] = 'add_title';
                    $param['role_id'] = $data['role_id'];
                    $param['title_id'] = $data['title_id'];
                    foreach ($title_list as $item => $key) {
                        if ($key['id'] == $data['title_id']) {
                            $param['title_type'] = $key['type'];
                            $param['title_name'] = $key['name'];
                        }
                    }
                    
                    $this->insert_log('添加称号', $param);
                    break;
                // 封禁mac
                case 'frozen_account' :
                    $validate_res = $validate->scene('frozen_account')->check($data);
                    if (!$validate_res) error($validate->getError());
                    $param['type'] = 'frozen_account';
                    $param['account_id'] = $data['account_id'];
                    
                    $this->insert_log('封禁mac', $param);
                    break;
                case 'frozen_ip' :
                    $validate_res = $validate->scene('frozen_ip')->check($data);
                    if (!$validate_res) error($validate->getError());
                    $param['type'] = 'frozen_ip';
                    $param['ip_address'] = $data['ip_address'];
                    
                    $this->insert_log('封禁ip', $param);
                    break;
                case 'setgm' :
                    $validate_res = $validate->scene('setgm')->check($data);
                    if (!$validate_res) error($validate->getError());
                    $param['type'] = 'setgm';
                    $param['role_id'] = $data['role_id'];
                    $param['gmlevel'] = $data['gmlevel'];
                    
                    $this->insert_log('设置GM号', $param);
                    break;
                case 'fresh_shop' :
                    $param['type'] = 'fresh_shop';
                    $this->insert_log('刷新商城', $param);
                    break;
            }
            if ($data['password'] != config('game.game.gm_password')) 
                return error('GM密码错误');
            $result = $model::setGmPerform($param, config('game.game.gm_url'));
            if (!$result['gm']) {
                error('GM接口异常');
            }
            $result['gm'] = json_decode($result['gm'], true);
            
            if ($result['gm']['code'] == 0) {
                $model->save(['status' => 0], ['id' => $result['id']]);
                success('成功');
            } else {
                error($result['gm']['code']);
            }
        }
        
        $this->assign([
            'item_list' => $model::getItemList(),
            'title_list' => $title_list,
            'serv_list' => $model::getServList(),
        ]);

        return $this->fetch();
    }
    
    
    public function insert_log($name, $param){
        

        $data = [
            'admin_user_id' => $this->user->id,
            'name' => $name,
            'param' => json_encode($param),
            'create_time' => time(),
        ];
        Db::table('agent_gm_log')->insert($data);
    }
    

    public function gmList(Request $request, GameGm $model)
    {
        $param = $request->param();
        $data = $model->scope('where', $param)->field('role_id', true)->paginate($this->admin['per_page'], false, ['query' => $request->get()]);
        $this->assign($request->get());
        $this->assign([
            'data' => $data,
            'page' => $data->render(),
            'total' => $data->total(),
        ]);
        return $this->fetch();
    }

    public function strToUtf8($str){
        $encode = mb_detect_encoding($str, array("ASCII",'UTF-8',"GB2312","GBK",'BIG5'));
        if($encode == 'UTF-8'){
            return $str;
        }else{
            return mb_convert_encoding($str, 'UTF-8', $encode);
        }
    }

    public function recharge($id, Request $request, GameGm $model, GameGmValidate $validate, AgentMoney $agentMoney, Agent $agent)
    {
        $recharge_list = config('recharge.list');
        if ($request->isPost()) {
            $gm_url = config('game.game.gm_url');
            $charget_id = $request->param('charget_id');
            $count = $request->param('count');
            $param = [
                'role_id' => $id,
                'charge_id' => $charget_id,
                'username' => $this->user['username'],
                'type' => 'charge',
                'jade' => $recharge_list[$charget_id]['jade'],
                'ex_jade' => $recharge_list[$charget_id]['ex_jade'],
                'money' => $recharge_list[$charget_id]['money'],
                'count' => $count,
            ];
            $validate_res = $validate->scene('recharge')->check($param);
            if (!$validate_res) error($validate->getError());
            if ($this->user['role'][0] == 2) {
                $agent_balance = $agent->where(['username'=>$this->user['username']])->value('real_money');
                if ($agent_balance < $param['money']) error("账户余额不足,需要<small class='label label-danger'>{$param['money']}元</small>，当前剩余 <small class='label label-danger'>{$agent_balance} 元</small>");
                // 更新代理余额
                $agent::setAgentMoney('dec', $this->user['username'], $param['money']);
                // 增加余额更新记录
                $up_param['money'] = sprintf("%.2f", $param['money']);
                $up_param['username'] = $this->user['username'];
                $up_param['type'] = 1;
                $up_param['content'] = '角色id:' . $param['role_id'] . ';充值仙玉';
                $up_param['agent'] = $param['username'];
                $agentMoney::create($up_param);
                $result = $model::setGmPerform($param, $gm_url);
            } elseif($this->user['role'][0] == 3)
            {
                // 更新代理余额
                $agent::setAgentMoney('dec', $this->user['username'], $param['money']);
                // 增加余额更新记录
                $up_param['money'] = sprintf("%.2f", $param['money']);
                $up_param['username'] = $this->user['username'];
                $up_param['type'] = 1;
                $up_param['content'] = '角色id:' . $param['role_id'] . ';充值仙玉';
                $up_param['agent'] = $param['username'];
                $agentMoney::create($up_param);
                $result = $model::setGmPerform($param, $gm_url);
                
                
            }
            
            $result['gm'] = json_decode($result['gm'], true);//echo '<pre>';print_r($result);exit;
            // if ($result['gm']->code == 0) {
            if($result['gm'] == ''){
                $update_status = $model->save(['status' => 0], ['id' => $result['id']]);
                $update_status ? success($result['gm']['msg']) : error('失败');
            } else {
                isset($result['gm']['code'])&&$result['gm']['code'] ? success($result['gm']['msg']) : error($result['gm']['msg']);
            }
        }

        $this->assign([
            'recharge_list' => config('recharge.list'),
            'role_id' => $id
        ]);
        return $this->fetch();
    }
}