<?php

use app\admin\controller\SettingController;
use app\admin\model\AdminMenu;
use app\common\model\SettingGroup;
use think\exception\HttpResponseException;
use think\Response;
use think\response\Redirect;

/** 不做任何操作 */
const URL_CURRENT = 'url://current';
/** 刷新页面 */
const URL_RELOAD = 'url://reload';
/** 返回上一个页面 */
const URL_BACK = 'url://back';
/** 关闭当前layer弹窗 */
const URL_CLOSE_LAYER = 'url://close-layer';
/** 关闭当前弹窗并刷新父级 */
const URL_CLOSE_REFRESH = 'url://close-refresh';

if (!function_exists('success')) {

    function success($msg = '操作成功', $url = URL_BACK, $data = '', $wait = 0, array $header = [])
    {
        result(1, $msg, $data, $url, $wait, $header);
    }
}


if (!function_exists('get_agent_username')) {
    function get_agent_username(string $invite)
    {
        $result = \think\Db::name('admin_user')->where(['invitecode' => $invite])->field(['username'])->find();
        return $result['username'];
    }
}


if (!function_exists('error')) {
    function error($msg = '操作失败', $url = URL_CURRENT, $data = '', $wait = 0, array $header = [])
    {
        result(0, $msg, $data, $url, $wait, $header);
    }
}

if (!function_exists('result')) {
    function result($code = 0, $msg = 'unknown', $data = '', $url = null, $wait = 3, array $header = [])
    {
        if (request()->isPost()) {
            $url = (strpos($url, '://') || 0 === strpos($url, '/')) ? $url : url($url);
            $result = [
                'code' => $code,
                'msg' => $msg,
                'data' => $data,
                'url' => $url,
                'wait' => $wait,
            ];
            $response = Response::create($result, 'json')->header($header);
            throw new HttpResponseException($response);
        }


        if ($url === null) {
            $url = request()->server('HTTP_REFERER') ?? 'admin/index/index';
        }

        $response = new Redirect($url);

        $response->code(302)->params($data)->with([$code ? 'success_message' : 'error_message' => $msg, 'url' => $url]);

        throw new HttpResponseException($response);
    }
}


if (!function_exists('create_setting_file')) {
    /**
     * 生成配置文件
     * @param $data SettingGroup
     * @return bool
     */
    function create_setting_file($data)
    {
        $result = true;
        if ($data->auto_create_file == 1) {
            $file = $data->code . '.php';
            if ($data->module !== 'app') {
                $file = $data->module . '/' . $data->code . '.php';
            }

            $setting = $data->setting;
            $path = app()->getConfigPath() . $file;
            $file_code = "<?php\r\n\r\n/**\r\n* " .
                "\r\n* 作者：猴子" .
                "\r\n* 声明：" .
                $data->name . ':' . $data->description .
                "\r\n* 此配置文件为自动生成，生成时间" . date('Y-m-d H:i:s') .
                "\r\n*/\r\n\r\nreturn [";
            foreach ($setting as $key => $value) {
                $file_code .= "\r\n    //" . $value['name'] . ':' . $value['description'] . "\r\n    '" . $value['code'] . "'=>[";
                foreach ($value->content as $content) {
                    $file_code .= "\r\n    //" . $content['name'] . "\r\n    '" .
                        $content['field'] . "'=>'" . $content['content'] . "',";
                }
                $file_code .= "\r\n],";
            }
            $file_code .= "\r\n];";
            $result = file_put_contents($path, $file_code);
        }
        return $result ? true : false;
    }
}


if (!function_exists('unicode_decode')) {
    function unicode_decode($name)
    {
        $name = str_replace("\\\\u", "\u", $name);
        $json = '{"str":"' . $name . '"}';
        $arr = json_decode($json, true);
        if (empty($arr)) return '';
        return $arr['str'];
        // 转换编码，将Unicode编码转换成可以浏览的utf-8编码
        $pattern = '/([\w]+)|(\\\u([\w]{4}))/i';
        preg_match_all($pattern, $name, $matches);
        if (!empty($matches)) {
            $name = '';
            for ($j = 0; $j < count($matches[0]); $j++) {
                $str = $matches[0][$j];
                if (strpos($str, '\\u') === 0) {
                    $code = base_convert(substr($str, 2, 2), 16, 10);
                    $code2 = base_convert(substr($str, 4), 16, 10);
                    $c = chr($code) . chr($code2);
                    $c = iconv('UCS-2', 'UTF-8', $c);
                    $name .= $c;
                } else {

                    $name .= $str;
                }
            }
        }
        return $name;
    }
}

if (!function_exists('get_rand_str')) {
    /**
     * 生产随机数
     *
     * @param integer $length 随机数长度
     * @param integer $style 产生随机数方法默认4
     * @return integer                返回根据规则产生的指定随机数
     */
    function get_rand_str($length, $style = 4)
    {
        switch ($style) {
            case 1:
                $arr = range(0, 9);
                break;
            case 2:
                $arr = array_merge(range('a', 'z'), range('A', 'Z'));
                break;
            case 3:
                $arr = array_merge(range('a', 'z'), range(0, 9));
                break;
            case 4:
                $arr = array_merge(range('A', 'Z'), range(0, 9));
                break;
            case 5:
                $arr = array_merge(range('a', 'z'), range('A', 'Z'), range(0, 9), ['!', '@', '#', '$', '%', '^', '&', '*']);
                break;
            case 6:
                $arr = array_merge(range('A', 'Z'));
                break;
            default:
                $arr = array_merge(range('a', 'z'), range('A', 'Z'), range(0, 9), ['!', '@', '#', '$', '%', '^', '&', '*']);
        }
        shuffle($arr);
        $sub_arr = array_slice($arr, 0, $length);
        return implode($sub_arr);
    }
}


if (!function_exists('create_setting_menu')) {
    /**
     * 生成配置文件
     * @param $data SettingGroup
     * @return bool
     */
    function create_setting_menu($data)
    {

        $function = <<<EOF
    public function [GROUP_COED]()
    {
        return \$this->show([GROUP_ID]);
    }\n
}//append_menu
EOF;

        $result = true;
        if ($data->auto_create_menu == 1) {
            $url = 'admin/setting/' . $data->code;
            $menu = AdminMenu::get(function ($query) use ($url) {
                $query->where('url', $url);
            });
            if (!$menu) {
                $result = AdminMenu::create([
                    'parent_id' => 43,
                    'name' => $data->name,
                    'icon' => $data->icon,
                    'is_show' => 1,
                    'url' => $url
                ]);
            } else {
                $menu->name = $data->name;
                $menu->icon = $data->icon;
                $menu->url = $url;
                $result = $menu->save();
            }

            $setting = new SettingController();
            if (!method_exists($setting, $data->code)) {

                $function = str_replace(array('[GROUP_COED]', '[GROUP_ID]'), array($data->code, $data->id), $function);

                $file_path = app()->getAppPath() . 'admin/controller/SettingController.php';
                $file = file_get_contents($file_path);
                $file = str_replace('}//append_menu', $function, $file);
                file_put_contents($file_path, $file);
            }
        }

        return $result ? true : false;
    }
}