<?php
/**
 * 用户控制器
 */

namespace app\admin\controller;

use app\common\model\Attachment;
use app\common\model\Model;
use app\common\model\Setting;
use think\Request;
use app\common\model\Agent;
use app\common\model\AgentType;

use app\common\validate\AgentValidate;

class AgentController extends Controller
{

    //列表
    public function index(Request $request, Agent $model, AgentType $agent_type)
    {
        $param = $request->param();
        $kind_agent = $this->getAgentAndKind('id');
        if ($kind_agent == $this->user['id']) {
            $kind_agent = null;
        }
        if ($this->user['role'][0] == 3) {
            $model = $model->with([
                'AgentType' => function ($query) {
                    $query->field(['id', 'name']);
                },
                'parentAgent' => function ($query) {
                    $query->field(['id', 'username']);
                }])
                ->field('password', true);
        } elseif ($this->user['role'][0] == 2) {
            $model = $model->with([
                'AgentType' => function ($query) {
                    $query->field(['id', 'name']);
                },
                'parentAgent' => function ($query) {
                    $query->field(['id', 'username']);
                }])
                ->field('password', true)->KindAgent('id', $kind_agent)->scope(['role', 'where'], $param);
        } else {
            $model = $model->with([
                'AgentType' => function ($query) {
                    $query->field(['id', 'name']);
                },
                'parentAgent' => function ($query) {
                    $query->field(['id', 'username']);
                }])
                ->field('password', true)->scope(['role', 'where'], $param);
        }

        if (isset($param['export_data']) && $param['export_data'] == 1) {
            $header = ['ID', '账号', '昵称', '邀请码', '代理类型', '上级代理', '提成比例（%）', '总提成', '未结算提成', '结算方式', '结算账户', '手机号', '微信号', 'qq', '是否启用', '创建时间',];
            $body = [];
            $data = $model->where(['role' => 2])->field(['password'], true)->select();
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
            return $this->exportData($header, $body, '代理列表-' . date('Y-m-d-H-i-s'));
        }

        $data = $model->paginate($this->admin['per_page'], false, ['query' => $request->get()]);
        $money_data = [
            'money' => array_column($data->toArray()['data'], 'money'),
            'no_money' => array_column($data->toArray()['data'], 'no_money')
        ];
        $money_data = [
            'money' => sprintf("%.2f", array_sum($money_data['money'])),
            'no_money' => sprintf("%.2f", array_sum($money_data['no_money'])),
        ];
        $agent_type = $agent_type->field(['id', 'name'])->select();
        //关键词，排序等赋值
        $this->assign($request->get());
        $this->assign([
            'data' => $data,
            'money_data' => $money_data,
            'page' => $data->render(),
            'total' => $data->total(),
            'agent_type_list' => $agent_type,
            'user' => $this->user,
        ]);
        return $this->fetch();
    }


    //添加
    public function add(Request $request, Agent $model, AgentValidate $validate)
    {
        if ($request->isPost()) {
            $param = $request->param();
            $validate_result = $validate->scene('add')->check($param);
            //halt($validate_result);
            if (!$validate_result) {
                return error($validate->getError());
            }
            //处理头像上传
            $attachment_avatar = new Attachment;
            if (!empty($_FILES['avatar']['name'])) {
                $file_avatar = $attachment_avatar->upload('avatar');
                if ($file_avatar) {
                    $param['avatar'] = $file_avatar->url;
                } else {
                    return error($attachment_avatar->getError());
                }
            } else {
                $param['avatar'] = '/uploads/attachment/20190822/02fce9aecd6cadf6e019e988ad8703ce.png';
            }
            $p_id = $this->agency($model, $param);
            $param['p_id'] = $p_id ? $p_id : 0;
            $param['role'] = 2;
            $res = $model::create($param);
            if (!$res) {
                return error('系统异常，请重试');
            }
            $model = $model::get($res['id']);
            $invitecode = $this->setinvitecode();
            $result = $model->save(['invitecode' => $invitecode]);
            $url = URL_BACK;
            if (isset($param['_create']) && $param['_create'] == 1) {
                $url = URL_RELOAD;
            }
            curl_get('127.0.0.1:8561/update_agent');
            return $result ? success('添加成功', $url) : error();
        }
        $parent_agent = $model->with(['AgentType' => function ($query) {
            $query->field(['id,name']);
        }])->scope('role')->field(['id', 'username', 'agent_type_id'])->select();
        switch ($this->user['agent_type_id']) {
            case 1 :
                $agent_type_list = AgentType::where('id', '>', 1)->field(['id', 'name'])->select();
                break;
            case 2 :
                $agent_type_list = AgentType::where('id', '>', 2)->field(['id', 'name'])->select();
                break;
        }
        if ($this->user['role'][0] != 2) {
            $agent_type_list = AgentType::field(['id', 'name'])->select();
        }
        $this->assign([
            'parent_agent' => $parent_agent,
            'agent_type_list' => $agent_type_list,
            'user' => $this->user,

        ]);

        return $this->fetch();
    }


    public function setinvitecode()
    {
        $setting = new Setting();
        $setting = $setting->where(['code' => 'game'])->field('content')->find();
        $invite_length = $setting->content[2]['field'] == 'invite_length' ? $setting->content[2]['content'] : 5;
        $model = new Agent();
        do {
            $invitecode = get_rand_str($invite_length, 6);
            $query = $model->where(['invitecode' => $invitecode])->value('invitecode');
        } while ($query != null);
        return $invitecode;

    }

    /**
     * 处理代理关系
     */
    public function agency($model, $param)
    {
        if (!empty($param['p_id'])) {
            $parent_agent = $model->where('username', $param['p_id'])->field(['id', 'username', 'agent_type_id,push_scale'])->find();
            if ($parent_agent['agent_type_id'] == 3) {
                return error('上级代理不能是三级代理');
            }
            if ($parent_agent['agent_type_id'] >= $param['agent_type_id']) {
                return error('代理等级必须低于上级代理等级');
            }
            if ($parent_agent['push_scale'] <= $param['push_scale']) {
                error("提成比例必须低于上级代理,上级代理比例为 <small class='label label-danger'>{$parent_agent['push_scale']}%</small>");
            }
            if (!$parent_agent) {
                return error('上级代理不存在');
            }
            return $parent_agent['id'];
        }
    }

    //修改
    public function edit($id, Request $request, Agent $model, AgentValidate $validate)
    {

        $data = $model::get($id);
        if ($request->isPost()) {
            $param = $request->param();
            $validate_result = $validate->scene('edit')->check($param);
            if (!$validate_result) {
                return error($validate->getError());
            }
            //处理头像上传
            if (!empty($_FILES['avatar']['name'])) {
                $attachment_avatar = new Attachment;
                $file_avatar = $attachment_avatar->upload('avatar');
                if ($file_avatar) {
                    $param['avatar'] = $file_avatar->url;
                }
            }
            $p_id = $this->agency($model, $param);

            if (!empty($data['p_id'])) {
                $param['p_id'] = $p_id ? $p_id : 0;
            }

            $result = $data->save($param);
            return $result ? success() : error();
        }

        $parent_agent = $model->with([
            'AgentType' => function ($query) {
                $query->field(['id', 'name']);
            },
            'parentAgent' => function ($query) {
                $query->field(['id', 'username']);
            }])->scope('role')->field(['id', 'username', 'agent_type_id'])->select();

        $this->assign([
            'data' => $data,
            'agent_type_list' => AgentType::field(['id,name'])->all(),
            'parent_agent' => $parent_agent,
            'user' => $this->user,

        ]);
        return $this->fetch('add');

    }

    public function royalty(Request $request, Agent $model)
    {
        $kind_agent = $this->getAgentAndKind('username', false);
        $param = $request->param();
        if (count($param) < 1) {
            if ($this->user['role'][0] == 3) {
                
            }
            elseif ($this->user['role'][0] == 2 || $this->user['role'][0] == 3) {
                switch ($this->user['agent_type_id']) {
                    case 1 : $param['agent_type_id'] = 2; break;
                    case 2 : $param['agent_type_id'] = 3; break;
                }
            } else {
                $param['agent_type_id'] = 1;
            }
        }

        $param['special_create_time'] = !empty($param['special_create_time']) ? urldecode(trim($param['special_create_time'])) : null;
        if (!empty($param['create_time']) && !empty($param['special_create_time'])) {
            $this->error('时间条件只能选择一种');
        }
        if ($this->user['role'][0] == 3) {
            $data = $model->scope('CountWhere', $param)
                ->withSum(['count' => function ($query) use ($param) {
                    $query->scope('CountWhere', $param);
                }], 'proceeds')
                ->paginate($this->admin['per_page'], false, ['query'=>$request->get()]);
                
        } elseif ($this->user['role'][0] == 2) {
            $data = $model->withSearch(['username'], ['username' => $kind_agent])
                ->scope('CountWhere', $param)
                ->withSum(['count' => function ($query) use ($param) {
                    $query->scope('CountWhere', $param);
                }], 'proceeds')
                ->paginate($this->admin['per_page'], false, ['query'=>$request->get()]);

        } else {
            $data = $model->scope('CountWhere', $param)
                ->withSum(['count' => function ($query) use ($param) {
                    $query->scope('CountWhere', $param);
                }], 'proceeds')
                ->paginate($this->admin['per_page'], false, ['query'=>$request->get()]);
        }
        
        //print_r($model->getLastSQL());
        
        $this->assign($request->get());
        $this->assign([
            'data'  => $data,
            'page'  => $data->render(),
            'total' => $data->total(),

        ]);
        return $this->fetch();

    }

    //删除
    public function del($id, Agent $model)
    {
        $child = $model->whereIn('p_id', $id)->find();
        if (!empty($child)) error('ID:' . implode(',', $id) . '的代理存在下级代理，不可删除');
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
        curl_get('127.0.0.1:8561/update_agent');
        return $result ? success('操作成功', URL_RELOAD) : error();
    }

    //启用
    public function enable($id, Agent $model)
    {
        $result = $model->whereIn('id', $id)->update(['status' => 1]);
        return $result ? success('操作成功', URL_RELOAD) : error();
    }


    //禁用
    public function disable($id, Agent $model)
    {
        $result = $model->whereIn('id', $id)->update(['status' => 0]);
        return $result ? success('操作成功', URL_RELOAD) : error();
    }

    // 福利启用
    public function welfareEnable($id, Agent $model)
    {
        $result = $model->whereIn('id', $id)->update(['is_welfare' => 0]);
        return $result ? success('操作成功', URL_RELOAD) : error();
    }


    // 福利禁用
    public function welfareDisable($id, Agent $model)
    {
        $result = $model->whereIn('id', $id)->update(['is_welfare' => 1]);
        return $result ? success('操作成功', URL_RELOAD) : error();
    }


    public function test()
    {
        $j = 0.01;
        for ($i = 1; $i < 32; $i++) {
            if ($i != 1) {
                $j = +$j * 2;
            }
            $r = $j;
            echo "8月{$i}日 = {$r}元<br />";
            $r += $r;
        }
        echo "以上合计 = {$r}元";
    }
}
