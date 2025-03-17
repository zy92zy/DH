<?php
/**
 * 后台基础控制器
 * @author yupoxiong<i@yufuping.com>
 */

namespace app\admin\controller;

use app\admin\model\AdminMenu;
use app\admin\model\AdminUser;
use app\admin\traits\{AdminAuth, AdminTree, PhpOffice};
use app\common\model\Agent;
use app\common\model\ChargeRecord;
use app\common\model\Model;

class Controller extends \think\Controller
{
    use AdminAuth, AdminTree, PhpOffice;


    /**
     * 当前url
     * @var string
     */
    protected $url;

    /**
     * 当前用户ID
     * @var int
     */
    protected $uid = 0;

    /**
     * 当前用户
     * @var AdminUser
     */
    protected $user;


    /**
     * 后台变量
     * @var array
     */
    protected $admin;

    /**
     * 无需验证权限的url
     * @var array
     */
    protected $authExcept = [];

    //初始化基础控制器
    protected function initialize(): void
    {
        $request = $this->request;
        //获取当前访问url
        $this->url = parse_name($request->module()) . '/' .
            parse_name($request->controller()) . '/' .
            parse_name($request->action());

        //验证权限
        if (!in_array($this->url, $this->authExcept, true)) {
            if (!$this->isLogin()) {
                error('未登录', 'auth/login');
            } else if ($this->user->id !== 1 && !$this->authCheck($this->user)) {
                error('无权限', $this->request->isGet() ? null : URL_CURRENT);
            }
        }
        
        $this->admin['role'] = $this->user['role'];

        if ((int)$request->param('check_auth') === 1) {
            success();
        }

        //记录日志
        $menu = AdminMenu::get(['url' => $this->url]);
        if ($menu) {
            $this->admin['title'] = $menu->name;
            if ($menu->log_method === $request->method()) {
                $this->createAdminLog($this->user, $menu);
            }
        }
        $copying_config = [
            'author' => base64_decode(unicode_decode(config('copying.author'))),
            'author_qq' => base64_decode(unicode_decode(config('copying.author_qq'))),
            'url' => base64_decode(unicode_decode(config('copying.url'))),
            'author_info' => base64_decode(unicode_decode(config('copying.author_info'))),
            'content' => base64_decode(unicode_decode(config('copying.content'))),
            'qq_url' => base64_decode(unicode_decode(config('copying.qq_url'))),
        ];
        ChargeRecord::countAgentMoney();
        $this->admin['per_page'] = cookie('admin_per_page') ?? 10;
        $this->admin['per_page'] = $this->admin['per_page'] < 100 ? $this->admin['per_page'] : 100;
        $this->admin['copying'] = $copying_config;

    }


    //重写fetch
    protected function fetch($template = '', $vars = [], $config = [])
    {
        $this->admin['pjax'] = $this->request->isPjax();
        $this->admin['user'] = $this->user;
        $this->setAdminInfo();
        if ('admin/auth/login' !== $this->url && !$this->admin['pjax']) {
            $this->admin['menu'] = $this->getLeftMenu($this->user);
        }

        $this->assign([
            'debug' => config('app.app_debug') ? 'true' : 'false',
            'cookie_prefix' => config('cookie.prefix') ?? '',
            'admin' => $this->admin,
            'user' => $this->user

        ]);

        return parent::fetch($template, $vars, $config);
    }

    //空方法
    public function _empty()
    {
        $this->admin['title'] = '404';
        return $this->fetch('template/404');
    }


    //设置前台显示的后台信息
    protected function setAdminInfo(): void
    {
        $admin_config = config('admin.base');

        $this->admin['name'] = $admin_config['name'] ?? '';
        $this->admin['author'] = $admin_config['author'] ?? '';
        $this->admin['version'] = $admin_config['version'] ?? '';
        $this->admin['short_name'] = $admin_config['short_name'] ?? '';
    }


    public function getAgentAndKind($agent_info, $is_push = false)
    {
        $agent_list = Agent::field('id,p_id,username,invitecode')->select();
        $agent_list = $agent_list->toArray();
        if ($this->user['role'][0] == 2) {
            $kind = Model::getChildren($agent_list, $this->user['id']);
            if (!empty($kind)) {
                foreach ($kind as $item) {
                    $kind_data[] = $item[$agent_info];
                }
                if ($is_push) {
                    array_push($kind_data,$this->user[$agent_info]);
                }
                $result = implode(',', $kind_data);    // 转换为字符串
            } else {
                $result = $this->user[$agent_info];
            }

        } else {
            foreach ($agent_list as $item) {
                $result[] = $item[$agent_info];
            }
            $result = implode(',', $result);    // 转换为字符串
        }
        return $result;
    }
}
