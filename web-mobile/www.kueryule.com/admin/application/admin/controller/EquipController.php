<?php
/**
 * 后台角色控制器
 * @author yupoxiong<i@yufuping.com>
 */

namespace app\admin\controller;

use think\Request;
use app\common\model\Equip;

class EquipController extends Controller
{

    public function index(Request $request, Equip $model)
    {
        if($this->user['role'][0] != 3) return;

        $param = $request->param();

        $where = [];

        if(isset($param['state']) && is_numeric($param['state']))
            $where[] = "state='{$param['state']}'";
        if(isset($param['EquipType']) && is_numeric($param['EquipType']))
            $where[] = "EquipType='{$param['EquipType']}'";
        if(!empty($param['create_time'])){
            $where[] = "create_time between '{$param['create_time']} 00:00:00' and '{$param['create_time']} 23:59:59'";
        }
        if(!empty($param['delete_time'])){
            $where[] = "delete_time between '{$param['delete_time']} 00:00:00' and '{$param['delete_time']} 23:59:59'";
        }
        if(!empty($param['RoleID'])){
            $where[] = "RoleID='{$param['RoleID']}'";
        }
        if(!empty($param['name'])){
            $where[] = "(Type='{$param['name']}' OR name LIKE '%{$param['name']}%')";
        }

        $data  = $model->where(implode(' AND ',$where))->paginate($this->admin['per_page'], false, ['query'=>$request->get()]);
        print_r($model->getLastSQL());

        //关键词，排序等赋值
        $this->assign($request->get());
        $this->assign([
            'data'  => $data,
            'page'  => $data->render(),
            'total' => $data->total(),
            'serv_list' => \app\common\model\GameGm::getServList(),
        ]);
        

        return $this->fetch();
    }


    //修改
    public function edit($id, Request $request, Equip $model){
        if($this->user['role'][0] != 3) return;

        $data = $model::get($id);
        $param = $request->param();

        if($param['state'] == '1'){
            $array = [
                'delete_time' => null,
                'state' => 1,
            ];
        }else{
            $array = [
                'delete_time' => date('Y-m-d H:i:s'),
                'state' => 0,
            ];
        }
        $this->update_rides($id, $param['state'], $data);
        $result = $data->save($array);
        return $result ? success() : error();
    }


    public function update_rides($id, $state, $data){
        $redis = new \Redis();
        $redis->pconnect('127.0.0.1' , 6379);
        $redis->auth('111111');
        $redis->select(0);
        if($redis->hExists('equip', $id)){
            $data = $redis->hGet('equip', $id);
            $data = json_decode($data, true);
            if($state==1){
                unset($data['delete_time']);
                $data['state'] = 1;
            }else{
                $data['delete_time'] = date('Y-m-d H:i:s');
                $data['state'] = 0;
            }
        }
        $data = json_encode($data, JSON_UNESCAPED_UNICODE);
        $redis->hSet('equip', $id, $data);
        $redis = null;
    }


}
