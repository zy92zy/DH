<?php
/**
 * 提成统计控制器
 */

namespace app\admin\controller;

use think\Request;
use app\common\model\AgentCount;

use app\common\validate\AgentCountValidate;

class AgentCountController extends Controller
{

    //列表
    public function index(Request $request, AgentCount $model)
    {
        $param = $request->param();

        $kind_agent = $this->getAgentAndKind('username',true);
        $param['special_create_time'] = !empty($param['special_create_time']) ? urldecode(trim($param['special_create_time'])) : null;
        if (!empty($param['create_time']) && !empty($param['special_create_time'])) {
            $this->error('时间条件只能选择一种');
        }
        
        if($this->user['role'][0] != 3){
            
            $data = $model->KindAgent('agent',$kind_agent)->scope('where', $param)->paginate($this->admin['per_page'], false, ['query'=>$request->get()]);
        }else{
            $data = $model->scope('where', $param)->paginate($this->admin['per_page'], false, ['query'=>$request->get()]);
        }
        
        $money_data = [
            'money' => array_column($data->toArray()['data'], 'money'),
            'proceeds' => array_column($data->toArray()['data'], 'proceeds')
        ];
        $money_data = [
            'money' => sprintf("%.2f", array_sum($money_data['money'])),
            'proceeds' => sprintf("%.2f", array_sum($money_data['proceeds'])),
        ];
        //关键词，排序等赋值
        $this->assign($request->get());
        $this->assign([
            'data'  => $data,
            'money_data' => $money_data,
            'page'  => $data->render(),
            'total' => $data->total(),
            'serv_list' => \app\common\model\GameGm::getServList(),
        ]);
        return $this->fetch();
    }


    //删除
    public function del($id, AgentCount $model)
    {
        if (count($model->noDeletionId) > 0) {
            if (is_array($id)) {
                if (array_intersect($model->noDeletionId, $id)) {
                    return error('ID为' . implode(',', $model->noDeletionId) . '的数据无法删除');
                }
            } else if (in_array($id, $model->noDeletionId)) {
                return error('ID为' . $id . '的数据无法删除');
            }
        }

        if ($model->softDelete) {
            $result = $model->whereIn('id', $id)->useSoftDelete('delete_time', time())->delete();
        } else {
            $result = $model->whereIn('id', $id)->delete();
        }

        return $result ? success('操作成功', URL_RELOAD) : error();
    }


}
