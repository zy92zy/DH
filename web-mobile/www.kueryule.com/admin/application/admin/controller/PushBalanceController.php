<?php
// +----------------------------------------------------------------------
// | 作者：修缘    联系QQ：278896498   QQ群：1054861244
// | 声明：未经作者许可，禁止倒卖等商业运营，违者必究
// +----------------------------------------------------------------------
// | 创建时间:2020/5/28 20:54
// +----------------------------------------------------------------------

namespace app\admin\controller;


use app\common\model\Agent;
use app\common\validate\PushBalanceValidate;
use think\Request;
use app\common\model\PushBalance;

use think\Db;

/**
 * 提成结算
 */
class PushBalanceController extends Controller
{
    /**
     * 列表
     */
    public function index(Request $request, PushBalance $model)
    {
        $param = $request->param();
        $kind_agent = $this->getAgentAndKind('username',true);
        $model = $model->withField('balance_account')->KindAgent('username', $kind_agent)->scope(['where','role'],$param);
        
        if (isset($param['export_data']) && $param['export_data'] == 1) {
            $header = ['ID', '账号', '昵称', '邀请码', '代理类型', '上级代理', '提成比例（%）', '总提成', '未结算提成', '结算方式', '结算账户', '手机号', '微信号', 'qq', '是否启用', '创建时间',];
            $body = [];
            // $data = $model->select();
            $data = $model->where(['username' => 'yang520'])->select();
            
            foreach ($data as $item) {
                $record = [];
                $record['id'] = $item->id;
                $record['username'] = $item->username;
                $record['nickname'] = $item->nickname;
                $record['invitecode'] = $item->invitecode;
                $record['agent_type'] = $item->agent_type->name ?? '';
                $record['p_id'] = $item->p_id ? get_parent_username($item->p_id) : '无';
                $record['push_scale'] = $item->push_scale;
                $record['money'] = $item->money;
                $record['no_money'] = $item->no_money;
                $record['balance_type'] = $item->balance_type;
                $record['balance_account'] = $item->balance_account;
                $record['mobile'] = $item->mobile;
                $record['wechat'] = $item->wechat;
                $record['qq'] = $item->qq;
                $record['status'] = $item->status_text;
                $record['create_time'] = $item->create_time;
                $body[] = $record;
            }
            return $this->exportData($header, $body, '结算记录-' . date('Y-m-d-H-i-s'));
        }
        // $data = $model->paginate($this->admin['per_page'], false, ['query' => $request->get()]);
        // $data = $model->paginate($this->admin['per_page'], false, ['query' => ['username' => 'yang520']]);
        // $data = $model->scope('where', $param)->paginate($this->admin['per_page'], false, ['query'=>$request->get()]);
        
        // $data = Db::table('agent_push_balance')
        //     ->where('username','in','yang520')
        //     ->where('status',1)
        //     ->get(['id','username', 'balance_type', 'money', 'create_time', 'update_time', 'delete_time', 'status', 'balance_account']);
        // $data = $model->paginate($this->admin['per_page'], false, ['query' => ['username' => 'yang520']]);
        
        
        $data  = $model->scope('where', $param)
            ->paginate($this->admin['per_page'], false, ['query'=>$request->get()]);
            
        $push_balance = Db::name('push_balance');
        
        $data = $push_balance->select();
        
        foreach($data as $k=>$d){
            switch($d['balance_type']){
                case 1:
                    $data[$k]['balance_type'] = '微信';
                break;
                case 2:
                    $data[$k]['balance_type'] = '支付宝';
                break;
                case 3:
                    $data[$k]['balance_type'] = '银行卡';
                break;
                case 4:
                    $data[$k]['balance_type'] = '现金';
                break;
                case 5:
                    $data[$k]['balance_type'] = '其他';
                break;
            }
            $data[$k]['create_time'] = date('Y-m-d H:i:s',$d['create_time']); 
            $data[$k]['update_time'] = date('Y-m-d H:i:s',$d['update_time']); 
        }
        
        $money_data = [
            'total' =>  sprintf('%.2f', $push_balance->sum('money')),
            'no_money'  =>  sprintf('%.2f', $push_balance->where('status', 0)->sum('money')),
            'yes_money' =>  sprintf('%.2f', $push_balance->where('status', 1)->sum('money')),
        ];
        
        $this->assign($request->get());
        $this->assign([
            'data' => $data,
            'money_data' => $money_data,
            'page' => $push_balance->count(),
            'total' => $push_balance->count(),
            'user' => $this->user,

        ]);
        return $this->fetch();
    }


    /**
     * 添加
     */
    public function add(Request $request, PushBalance $model, PushBalanceValidate $validate, Agent $agent_model)
    {
        $username = $request->param('username');

        if ($request->isPost()){
            $param = $request->post();
            $validate_result = $validate->scene('add')->check($param);
            if (!$validate_result){
                return error($validate->getError());
            }
            $agent_info = $agent_model->where(['username' => $param['username']])->field('no_money,balance_account,balance_type')->find();
            if ($param['money'] > $agent_info['no_money']){
                return error("金额超出，当前未结算余额 <small class='label label-danger'>{$agent_info['no_money']}</small> 元");
            }
            if (empty($agent_info['balance_account'])) {
                return error("请先完善代理结算账户");
            }
            $param['balance_account'] = $agent_info['balance_account'];
            $result = $model::create($param);
            if ($result) {
                $up_agent = $agent_model->where(['username' => $username])->setDec('no_money', $param['money']);
                if ($up_agent) {
                    return $result ? success('提交成功') : error();
                }
            }
        }

        $this->assign([
            'username' => $username,
        ]);
        return $this->fetch();
    }

    /**
     * 确认结算
     */
    public function enable($id, PushBalance $model)
    {
        $result = $model->whereIn('id', $id)->update(['status' => 1]);
        return $result ? success('操作成功', URL_RELOAD) : error();
    }

}