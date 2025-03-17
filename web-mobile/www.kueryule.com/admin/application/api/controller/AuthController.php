<?php


namespace app\api\controller;

use app\common\model\Agent;
use app\common\validate\AgentValidate;
use Exception;
use think\Request;
use think\response\Json;

class AuthController extends Controller
{

    protected $authExcept = [
        'login',
    ];

    /**d
     * 登录并发放token
     * @param Request $request
     * @param Agent $model
     * @param AgentValidate $validate
     * @return Json|void
     */
    public function login(Request $request, Agent $model, AgentValidate $validate)
    {
        $param = $request->param();
        //数据验证
        $validate_result = $validate->scene('api_login')->check($param);
        if (!$validate_result) {
            return error($validate->getError());
        }

        //登录逻辑
        try {
            $user  = $model::login($param);
            $token = $this->getToken($user->id);
        } catch (Exception $e) {
            return error($e->getMessage());
        }

        //返回数据
        return success(['token' => $token], '登录成功');
    }

}