<?php
/**
 * 充值记录控制器
 */

namespace app\admin\controller;

use think\Request;
use app\common\model\ChargeRecord;

use app\common\validate\ChargeRecordValidate;

class ChargeRecordController extends Controller
{

    //列表
    public function index(Request $request, ChargeRecord $model)
    {
        $param = $request->param();
        if ($this->user['role'][0] != 2) {
            $data = $model->getDataList($param,$this->admin, $request);
        } else {
            $kind_agent = $this->getAgentAndKind('username', true);
            $data = $model->getDataList($param,$this->admin, $request, $kind_agent);

        }
        if (!empty($param['create_time']) && !empty($param['special_create_time'])) {
            $this->error('时间条件只能选择一种');
        }

        $money_data = array_column($data->toArray()['data'],'money');
        $money_data = sprintf("%.2f", array_sum($money_data));
        //关键词，排序等赋值
        $this->assign($request->get());
        $this->assign([
            'data' => $data,
            'page' => $data->render(),
            'total' => $data->total(),
            'money_data' => $money_data,
            'serv_list' => \app\common\model\GameGm::getServList(),
        ]);
        return $this->fetch();
    }
}
