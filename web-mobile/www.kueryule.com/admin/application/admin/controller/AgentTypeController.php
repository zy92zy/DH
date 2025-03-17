<?php
/**
 * 用户等级控制器
 */

namespace app\admin\controller;

use app\common\model\Attachment;
use think\Request;
use app\common\model\AgentType;

use app\common\validate\UserLevelValidate;

class AgentTypeController extends Controller
{

    //列表
    public function index(AgentType $model)
    {
        $data = $model->field(['id,name,img,status'])->select();
        $this->assign([
            'data'  => $data,
        ]);
        return $this->fetch();
    }

    //添加
    public function add(Request $request, AgentType $model, UserLevelValidate $validate)
    {
        if ($request->isPost()) {
            $param           = $request->param();
            $validate_result = $validate->scene('add')->check($param);
            if (!$validate_result) {
                return error($validate->getError());
            }
            //处理图片上传
            $attachment_img = new Attachment;
            $file_img       = $attachment_img->upload('img');
            if ($file_img) {
                $param['img'] = $file_img->url;
            } else {
                return error($attachment_img->getError());
            }


            $result = $model::create($param);

            $url = URL_BACK;
            if (isset($param['_create']) && $param['_create'] == 1) {
                $url = URL_RELOAD;
            }

            return $result ? success('添加成功', $url) : error();
        }


        return $this->fetch();
    }

    //修改
    public function edit($id, Request $request, AgentType $model, UserLevelValidate $validate)
    {

        $data = $model::get($id);
        if ($request->isPost()) {
            $param           = $request->param();
            $validate_result = $validate->scene('edit')->check($param);
            if (!$validate_result) {
                return error($validate->getError());
            }
            //处理图片上传
            if (!empty($_FILES['img']['name'])) {
                $attachment_img = new Attachment;
                $file_img       = $attachment_img->upload('img');
                if ($file_img) {
                    $param['img'] = $file_img->url;
                }
            }


            $result = $data->save($param);
            return $result ? success() : error();
        }

        $this->assign([
            'data' => $data,

        ]);
        return $this->fetch('add');

    }

    //删除
    public function del($id, AgentType $model)
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

    //启用
    public function enable($id, AgentType $model)
    {
        $result = $model->whereIn('id', $id)->update(['status' => 1]);
        return $result ? success('操作成功', URL_RELOAD) : error();
    }


//禁用
    public function disable($id, AgentType $model)
    {
        $result = $model->whereIn('id', $id)->update(['status' => 0]);
        return $result ? success('操作成功', URL_RELOAD) : error();
    }
}
