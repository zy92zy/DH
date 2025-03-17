<?php
// +----------------------------------------------------------------------
// | 作者：修缘    联系QQ：278896498   QQ群：1054861244
// | 声明：未经作者许可，禁止倒卖等商业运营，违者必究
// +----------------------------------------------------------------------
// | 创建时间:2020/5/29 18:47
// +----------------------------------------------------------------------

namespace app\admin\controller;

use app\common\model\Agent;
use app\common\validate\AccountValidate;
use think\Request;
use app\common\model\Account;

/**
 * 玩家账号
 */
class AccountController extends Controller
{
    /**
     * 列表
     */
    public function index(Request $request, Account $model)
    {
        $param = $request->param();
        
        if($this->user['role'][0] == 3){
            $model = $model->scope('where', $param, 'accountid');
            
        }elseif ($this->user['role'][0] == 2) {
            $model = $model->withJoin(['agent' => function ($query) {
                $kind_agent = $this->getAgentAndKind('username', true);
                $query->withField('username,invitecode,role')->whereIn('username', $kind_agent);
            }])->scope('where', $param, 'accountid');
        } else {
            $model = $model->with(['agent' => function ($query) {
                $query->withField('username,invitecode,role');
            }])->scope('where', $param, 'accountid');
        }
        $data = $model
            ->field('accountid,account,invite,state,register_time,last_login_time,login_ip')
            ->paginate($this->admin['per_page'], false, ['query' => $request->get()]);
        $this->assign($request->get());
        $this->assign([
            'data' => $data,
            'page' => $data->render(),
            'total' => $data->total(),
        ]);
        // printf($model->getLastSQL());
        
        return $this->fetch();
    }

    /**
     * 添加
     */
    public function add(Request $request, Account $model, AccountValidate $validate)
    {
        if ($request->isPost()) {
            $param = $request->post();
            $validate_result = $validate->scene('add')->check($param);
            if (!$validate_result) {
                return error($validate->getError());
            }
            $result = $model::create($param);
            return $result ? success('提交成功') : error();
        }
        return $this->fetch();
    }

    /**
     * 修改
     */
    public function edit($accountid, Request $request, Account $model, AccountValidate $validate)
    {
        $data = $model::get($accountid);
        if ($request->isPost()) {
            $param = $request->param();
            $validate_result = $validate->scene('edit')->check($param);
            if (!$validate_result) {
                return error($validate->getError());
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
    public function del($id, Account $model)
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
            $result = $model->whereIn('accountid', $id)->useSoftDelete('delete_time', time())->delete();
        } else {
            $result = $model->whereIn('accountid', $id)->delete();

        }

        return $result ? success('操作成功', URL_RELOAD) : error();
    }


}