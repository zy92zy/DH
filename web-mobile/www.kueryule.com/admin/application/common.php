<?php
// +----------------------------------------------------------------------
// | ThinkPHP [ WE CAN DO IT JUST THINK ]
// +----------------------------------------------------------------------
// | Copyright (c) 2006-2016 http://thinkphp.cn All rights reserved.
// +----------------------------------------------------------------------
// | Licensed ( http://www.apache.org/licenses/LICENSE-2.0 )
// +----------------------------------------------------------------------
// | Author: 流年 <liu21st@gmail.com>
// +----------------------------------------------------------------------

// 应用公共文件


use think\facade\Config;

if (!function_exists('get_middle_str')) {
    /**
     * 获取两个字符串中间的字符
     * @param $str
     * @param $leftStr
     * @param $rightStr
     * @return bool|string
     */
    function get_middle_str($str, $leftStr, $rightStr)
    {
        $left  = strpos($str, $leftStr);
        $right = strpos($str, $rightStr, $left);
        if ($right < $left || $left < 0) {
            return '';
        }
        return substr($str, $left + strlen($leftStr), $right - $left - strlen($leftStr));
    }
}


if (!function_exists('format_size')) {
    /**
     * 格式化文件大小单位
     * @param $size
     * @param string $delimiter
     * @return string
     */
    function format_size($size, $delimiter = '')
    {
        $units = array('B', 'KB', 'MB', 'GB', 'TB', 'PB');
        for ($i = 0; $size >= 1024 && $i < 5; $i++) {
            $size /= 1024;
        }
        return round($size, 2) . $delimiter . $units[$i];
    }
}


if (!function_exists('setting')) {
    /**
     * 设置相关助手函数
     * @param string $name
     * @param null $value
     * @return array|bool|mixed|null
     */
    function setting($name = '', $value = null)
    {
        if ($value === null && is_string($name)) {
            //获取一级配置
            if ('.' === substr($name, -1)) {
                $result = Config::pull(substr($name, 0, -1));
                if (count($result) == 0) {
                    //如果文件不存在，查找数据库
                    $result = get_database_setting(substr($name, 0, -1));
                }

                return $result;
            }
            //判断配置是否存在或读取配置
            if (0 === strpos($name, '?')) {
                $result = Config::has(substr($name, 1));
                if (!$result) {
                    //如果配置不存在，查找数据库
                    if ($name && false === strpos($name, '.')) {
                        return [];
                    }

                    if ('.' === substr($name, -1)) {

                        return get_database_setting(substr($name, 0, -1));
                    }

                    $name    = explode('.', $name);
                    $name[0] = strtolower($name[0]);

                    $result = get_database_setting($name[0]);
                    if ($result) {
                        $config = $result;
                        // 按.拆分成多维数组进行判断
                        foreach ($name as $val) {
                            if (isset($config[$val])) {
                                $config = $config[$val];
                            } else {
                                return null;
                            }
                        }

                        return $config;

                    }
                    return $result;
                }

                return $result;
            }

            $result = Config::get($name);
            if (!$result) {
                $result = get_database_setting($name);
            }
            return $result;
        }
        return Config::set($name, $value);
    }

}

if (!function_exists('get_database_setting')) {
    function get_database_setting($name)
    {
        $result = [];
        $group  = \app\common\model\SettingGroup::where('code', $name)->find();
        if ($group) {
            $result = [];
            foreach ($group->setting as $key => $setting) {
                $key_setting = [];
                foreach ($setting->content as $content) {
                    $key_setting[$content['field']] = $content['content'];
                }
                $result[$setting->code] = $key_setting;
            }
        }

        return $result;
    }
}


/**
 * http请求
 * @param  string  $url    请求地址
 * @param  boolean|string|array $params 请求数据
 * @param  integer $ispost 0/1，是否post
 * @param  array  $header
 * @param  $verify 是否验证ssl
 * return string|boolean          出错时返回false
 */

if (!function_exists('requestHttp')){
    function requestHttp(string $url, $params = false, int $ispost = 0, $header = [], $verify = false) {
        $httpInfo = array();
        $ch = curl_init();
        if(!empty($header)){
            curl_setopt($ch, CURLOPT_HTTPHEADER, $header);
        }
        curl_setopt($ch, CURLOPT_HTTP_VERSION, CURL_HTTP_VERSION_1_1);
        curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 10);
        curl_setopt($ch, CURLOPT_TIMEOUT, 10);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
        //忽略ssl证书
        if($verify === true){
            curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, true);
            curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 2);
        } else {
            curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
            curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);
        }
        if ($ispost) {
            curl_setopt($ch, CURLOPT_POST, true);
            curl_setopt($ch, CURLOPT_POSTFIELDS, $params);
            curl_setopt($ch, CURLOPT_URL, $url);
        } else {
            if (is_array($params)) {
                $params = http_build_query($params);
            }
            if ($params) {
                curl_setopt($ch, CURLOPT_URL, $url . '?' . $params);
            } else {
                curl_setopt($ch, CURLOPT_URL, $url);
            }
        }
        $response = curl_exec($ch);
        if ($response === FALSE) {
            trace("cURL Error: " . curl_errno($ch) . ',' . curl_error($ch), 'error');
            $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
            $httpInfo = array_merge($httpInfo, curl_getinfo($ch));
            trace($httpInfo, 'error');
            return false;
        }
        curl_close($ch);
        return $response;
    }
}

if (!function_exists('curl_get')) {
    /**
     * curl模拟get进行 http 或 https url请求(可选附带cookie)
     * @param	bool $type	请求类型：true为https请求,false为http请求
     * @param	string $url	请求地址
     * @param	string	$cookie cookie字符串
     * @return	string	返回字符串
     */
    function curl_get($url, $type=false, $cookie='') {
        if (empty($url)) {
            return false;
        }
        $ch = curl_init();//初始化curl
        curl_setopt($ch, CURLOPT_URL,$url);//抓取指定网页
        curl_setopt($ch, CURLOPT_HEADER, 0);//设置header
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);//要求结果为字符串且输出到屏幕上
        if($type){  //判断请求协议http或https
            curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false); // 跳过证书检查
            curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 2);  // 从证书中检查SSL加密算法是否存在
        }
        curl_setopt($ch, CURLOPT_USERAGENT, $_SERVER['HTTP_USER_AGENT']); // 模拟用户使用的浏览器
        if(!empty($cookie))curl_setopt($ch,CURLOPT_COOKIE,$cookie);  //设置cookie
        $data = curl_exec($ch);//运行curl
        curl_close($ch);
        return $data;
    }
}

