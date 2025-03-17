-- phpMyAdmin SQL Dump
-- version 4.9.5
-- https://www.phpmyadmin.net/
--
-- 主机： localhost
-- 生成日期： 2021-09-17 21:47:30
-- 服务器版本： 5.7.34-log
-- PHP 版本： 7.2.33

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- 数据库： `jianghu1`
--

-- --------------------------------------------------------

--
-- 表的结构 `agent_admin_log`
--

CREATE TABLE `agent_admin_log` (
  `id` int(11) NOT NULL,
  `admin_user_id` int(10) NOT NULL COMMENT '用户',
  `name` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '操作',
  `url` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT 'URL',
  `log_method` varchar(8) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '不记录' COMMENT '记录日志方法',
  `log_ip` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '操作IP',
  `create_time` int(10) NOT NULL COMMENT '操作时间'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='后台操作日志' ROW_FORMAT=COMPACT;

-- --------------------------------------------------------

--
-- 表的结构 `agent_admin_log_data`
--

CREATE TABLE `agent_admin_log_data` (
  `id` int(11) NOT NULL,
  `admin_log_id` int(11) NOT NULL COMMENT '日志ID',
  `data` text COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '日志内容'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='后台操作日志数据' ROW_FORMAT=COMPACT;

-- --------------------------------------------------------

--
-- 表的结构 `agent_admin_menu`
--

CREATE TABLE `agent_admin_menu` (
  `id` int(11) NOT NULL,
  `parent_id` int(11) NOT NULL DEFAULT '0' COMMENT '父级菜单',
  `name` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '名称',
  `url` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT 'url',
  `icon` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'fa-list' COMMENT '图标',
  `is_show` tinyint(1) NOT NULL DEFAULT '1' COMMENT '等级',
  `sort_id` int(10) NOT NULL DEFAULT '1000' COMMENT '排序',
  `log_method` varchar(8) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '不记录' COMMENT '记录日志方法'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='后台菜单' ROW_FORMAT=COMPACT;

--
-- 转存表中的数据 `agent_admin_menu`
--

INSERT INTO `agent_admin_menu` (`id`, `parent_id`, `name`, `url`, `icon`, `is_show`, `sort_id`, `log_method`) VALUES
(1, 0, '后台首页', 'admin/index/index', 'fa-home', 1, 99, '不记录'),
(2, 0, '系统管理', 'admin/sys', 'fa-desktop', 1, 1099, '不记录'),
(3, 2, '用户管理', 'admin/admin_user/index', 'fa-user', 1, 1000, '不记录'),
(4, 3, '添加用户', 'admin/admin_user/add', 'fa-plus', 0, 1000, 'POST'),
(5, 3, '修改用户', 'admin/admin_user/edit', 'fa-edit', 0, 1000, 'POST'),
(6, 3, '删除用户', 'admin/admin_user/del', 'fa-close', 0, 1000, 'POST'),
(7, 2, '角色管理', 'admin/admin_role/index', 'fa-group', 1, 1000, '不记录'),
(8, 7, '添加角色', 'admin/admin_role/add', 'fa-plus', 0, 1000, 'POST'),
(9, 7, '修改角色', 'admin/admin_role/edit', 'fa-edit', 0, 1000, 'POST'),
(10, 7, '删除角色', 'admin/admin_role/del', 'fa-close', 0, 1000, 'POST'),
(11, 7, '角色授权', 'admin/admin_role/access', 'fa-key', 0, 1000, 'POST'),
(12, 2, '菜单管理', 'admin/admin_menu/index', 'fa-align-justify', 1, 1000, '不记录'),
(13, 12, '添加菜单', 'admin/admin_menu/add', 'fa-plus', 0, 1000, 'POST'),
(14, 12, '修改菜单', 'admin/admin_menu/edit', 'fa-edit', 0, 1000, 'POST'),
(15, 12, '删除菜单', 'admin/admin_menu/del', 'fa-close', 0, 1000, 'POST'),
(16, 2, '操作日志', 'admin/admin_log/index', 'fa-keyboard-o', 1, 1000, '不记录'),
(17, 16, '查看操作日志详情', 'admin/admin_log/view', 'fa-search-plus', 0, 1000, '不记录'),
(18, 2, '个人资料', 'admin/admin_user/profile', 'fa-smile-o', 1, 1000, 'POST'),
(19, 0, '代理管理', 'admin/user/mange', 'fa-users', 1, 1000, '不记录'),
(20, 19, '代理列表', 'admin/agent/index', 'fa-user', 1, 1000, '不记录'),
(21, 20, '添加代理', 'admin/agent/add', 'fa-plus', 0, 1000, 'POST'),
(22, 20, '修改代理', 'admin/agent/edit', 'fa-pencil', 0, 1000, 'POST'),
(23, 20, '删除代理', 'admin/agent/del', 'fa-trash', 0, 1000, 'POST'),
(24, 20, '启用代理', 'admin/agent/enable', 'fa-circle', 0, 1000, 'POST'),
(25, 20, '禁用代理', 'admin/agent/disable', 'fa-circle', 0, 1000, 'POST'),
(32, 2, '系统维护', 'admin/develop/manager', 'fa-code', 0, 1005, '不记录'),
(33, 32, '代码生成', 'admin/generate/index', 'fa-file-code-o', 1, 1000, '不记录'),
(34, 32, '设置配置', 'admin/develop/setting', 'fa-cogs', 0, 995, '不记录'),
(35, 34, '设置管理', 'admin/setting/index', 'fa-cog', 0, 1000, '不记录'),
(36, 35, '添加设置', 'admin/setting/add', 'fa-plus', 0, 1000, 'POST'),
(37, 35, '修改设置', 'admin/setting/edit', 'fa-pencil', 0, 1000, 'POST'),
(38, 35, '删除设置', 'admin/setting/del', 'fa-trash', 0, 1000, 'POST'),
(39, 34, '设置分组管理', 'admin/setting_group/index', 'fa-list', 0, 1000, '不记录'),
(40, 39, '添加设置分组', 'admin/setting_group/add', 'fa-plus', 0, 1000, 'POST'),
(41, 39, '修改设置分组', 'admin/setting_group/edit', 'fa-pencil', 0, 1000, 'POST'),
(42, 39, '删除设置分组', 'admin/setting_group/del', 'fa-trash', 0, 1000, 'POST'),
(43, 0, '设置中心', 'admin/setting/center', 'fa-cogs', 1, 1000, '不记录'),
(44, 43, '所有配置', 'admin/setting/all', 'fa-list', 0, 1000, '不记录'),
(47, 43, '后台设置', 'admin/setting/admin', 'fa-adjust', 1, 1000, '不记录'),
(48, 43, '更新设置', 'admin/setting/update', 'fa-pencil', 0, 1000, 'POST'),
(49, 32, '数据维护', 'admin/database/table', 'fa-database', 1, 1000, '不记录'),
(50, 49, '查看表详情', 'admin/database/view', 'fa-eye', 0, 1000, '不记录'),
(51, 49, '优化表', 'admin/database/optimize', 'fa-refresh', 0, 1000, 'POST'),
(52, 49, '修复表', 'admin/database/repair', 'fa-circle-o-notch', 0, 1000, 'POST'),
(53, 19, '结算记录', 'admin/push_balance/index', 'fa-circle-o', 1, 1000, '不记录'),
(54, 0, '玩家管理', 'Account', 'fa-address-book', 1, 1000, '不记录'),
(55, 54, '账号列表', 'admin/account/index', 'fa-circle-o', 1, 1000, '不记录'),
(56, 54, '角色列表', 'admin/role/index', 'fa-circle-o', 1, 1000, '不记录'),
(57, 56, '启用角色', 'admin/qy_role/enable', 'fa-circle', 0, 1000, 'POST'),
(58, 56, '禁用角色', 'admin/qy_role/disable', 'fa-circle', 0, 1000, 'POST'),
(60, 43, '游戏设置', 'admin/setting/game', 'fa-gamepad', 1, 1000, '不记录'),
(62, 0, '数据统计', 'Recharge', 'fa-area-chart', 1, 1000, '不记录'),
(69, 0, '游戏管理', '/', 'fa-gamepad', 1, 1000, '不记录'),
(70, 69, 'GM工具', 'admin/game_gm/index', 'fa-circle-o', 1, 1000, '不记录'),
(71, 62, '玩家充值', 'admin/charge_record/index', 'fa-list', 1, 1000, '不记录'),
(72, 71, '添加充值记录', 'admin/charge_record/add', 'fa-plus', 0, 1000, 'POST'),
(73, 71, '修改充值记录', 'admin/charge_record/edit', 'fa-pencil', 0, 1000, 'POST'),
(74, 71, '删除充值记录', 'admin/charge_record/del', 'fa-trash', 0, 1000, 'POST'),
(79, 62, '提成详情', 'admin/agent_count/index', 'fa-circle-o', 1, 1000, '不记录'),
(80, 53, '添加结算', 'admin/push_balance/add', 'fa-circle-o', 0, 1000, 'POST'),
(82, 53, '状态操作', 'admin/push_balance/enable', 'fa-circle-o', 0, 1000, 'POST'),
(83, 56, '发送福利', 'admin/role/agentwelfare', 'fa-list', 0, 1000, 'POST'),
(84, 69, 'GM记录', 'admin/game_gm/gmlist', 'fa-circle-o', 1, 1000, '不记录'),
(85, 19, '余额记录', 'admin/agent_money/index', 'fa-circle-o', 1, 1000, '不记录'),
(86, 85, '新增记录', 'admin/agent_money/add', 'fa-list', 0, 1000, '不记录'),
(87, 56, '代充值', 'admin/game_gm/recharge', 'fa-list', 0, 1000, 'POST'),
(88, 55, '添加账号', 'admin/account/add', 'fa-list', 0, 1000, 'POST'),
(89, 55, '修改账号', 'admin/account/edit', 'fa-list', 0, 1000, 'POST'),
(90, 55, '删除账号', 'admin/account/del', 'fa-list', 0, 1000, 'POST'),
(91, 62, '提成总计', 'admin/agent/royalty', 'fa-circle-o', 1, 1000, '不记录'),
(92, 69, 'GM记录2', '/admin/gm_log/index', 'fa-list', 1, 1000, '不记录'),
(93, 69, '游戏日志', 'admin/game_log/index', 'fa-list', 1, 1000, '不记录'),
(94, 69, '装备管理', 'admin/equip/index', 'fa-list', 1, 1000, '不记录');

-- --------------------------------------------------------

--
-- 表的结构 `agent_admin_role`
--

CREATE TABLE `agent_admin_role` (
  `id` int(11) NOT NULL,
  `name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '名称',
  `description` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '简介',
  `url` varchar(1000) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '权限',
  `status` tinyint(1) NOT NULL DEFAULT '1' COMMENT '是否启用'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='后台角色' ROW_FORMAT=COMPACT;

--
-- 转存表中的数据 `agent_admin_role`
--

INSERT INTO `agent_admin_role` (`id`, `name`, `description`, `url`, `status`) VALUES
(1, '管理员', '后台管理员角色', '1,19,20,21,22,24,25,54,55,56,57,58,62,69,70,71,72,73,79,83,84,87,88,89,91', 1),
(2, '代理', '代理用户', '1,2,18,19,20,21,22,23,24,25,53,54,55,56,62,71,79,80,82,83,85,86,87,91', 1),
(3, '超级管理', '1', '1,2,18', 1);

-- --------------------------------------------------------

--
-- 表的结构 `agent_admin_user`
--

CREATE TABLE `agent_admin_user` (
  `id` int(10) NOT NULL,
  `p_id` int(10) NOT NULL DEFAULT '0' COMMENT '上级代理id',
  `avatar` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '/static/index/images/avatar.png' COMMENT '头像',
  `username` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '用户名',
  `nickname` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '昵称',
  `agent_type_id` tinyint(1) NOT NULL DEFAULT '1' COMMENT '代理等级',
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'JDJ5JDEwJGl1c0hkd2Y2OGM1S0VFVHVEY2Z4R3U1eVJSUEYzQVNEb1BNVm52c2x4QlA4OWFCSXkxazd5' COMMENT '密码',
  `invitecode` char(6) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '邀请码',
  `push_scale` tinyint(2) NOT NULL DEFAULT '0' COMMENT '提成比例',
  `money` float(9,2) NOT NULL DEFAULT '0.00' COMMENT '余额',
  `no_money` float(9,2) NOT NULL DEFAULT '0.00' COMMENT '提成',
  `mobile` varchar(11) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '手机号',
  `balance_type` tinyint(1) DEFAULT '0' COMMENT '结算方式 1微信 2支付宝 3银行卡 4现金 5其他',
  `balance_account` varchar(30) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '结算账户',
  `wechat` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '微信号',
  `qq` varchar(26) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'QQ',
  `status` tinyint(1) NOT NULL DEFAULT '1' COMMENT '是否启用',
  `create_time` int(10) NOT NULL DEFAULT '0' COMMENT '创建时间',
  `update_time` int(10) NOT NULL DEFAULT '0' COMMENT '更新时间',
  `delete_time` int(10) NOT NULL DEFAULT '0' COMMENT '删除时间',
  `role` tinyint(1) NOT NULL COMMENT '角色',
  `is_welfare` tinyint(1) NOT NULL DEFAULT '0' COMMENT '是否允许发福利 0关闭 1开启',
  `real_money` float(10,2) NOT NULL DEFAULT '0.00' COMMENT '充值余额',
  `todaymoney` float(10,2) NOT NULL DEFAULT '0.00' COMMENT '今日充值',
  `allmoney` float(10,2) NOT NULL DEFAULT '0.00' COMMENT '总充值',
  `token` varchar(32) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `token_expire` int(11) DEFAULT NULL,
  `paycode` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '收款码'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户' ROW_FORMAT=COMPACT;

--
-- 转存表中的数据 `agent_admin_user`
--

INSERT INTO `agent_admin_user` (`id`, `p_id`, `avatar`, `username`, `nickname`, `agent_type_id`, `password`, `invitecode`, `push_scale`, `money`, `no_money`, `mobile`, `balance_type`, `balance_account`, `wechat`, `qq`, `status`, `create_time`, `update_time`, `delete_time`, `role`, `is_welfare`, `real_money`, `todaymoney`, `allmoney`, `token`, `token_expire`, `paycode`) VALUES
(1, 0, '/uploads/attachment/20200813/1d9a45507937234a92c7cdb413529339.png', 'admin', '123456', 0, 'JDJ5JDEwJDFPd3h6ODBORlNSdkd1NVdQR0V5dS5BNGFNYzB2aGtYb0VnZUZKWGdlb1pPWDhtcVpKWkNP', 'ABCDE', 100, 0.00, 0.00, '', 2, '123', NULL, '1234', 1, 1596531237, 1596531237, 0, 3, 1, -107552.00, 1256.00, 1256.00, '4d3cd0e5093162454511f837a3f30575', 1624623662, '1_1623038956.png');

-- --------------------------------------------------------

--
-- 表的结构 `agent_agent_count`
--

CREATE TABLE `agent_agent_count` (
  `id` int(10) NOT NULL,
  `role_id` int(6) NOT NULL COMMENT '角色id',
  `account` varchar(20) NOT NULL DEFAULT '' COMMENT '玩家账号',
  `money` float(8,2) NOT NULL DEFAULT '0.00' COMMENT '交易金额',
  `proceeds` float(8,2) NOT NULL DEFAULT '0.00' COMMENT '代理收入',
  `agent` varchar(20) NOT NULL DEFAULT '' COMMENT '代理',
  `create_time` int(10) NOT NULL COMMENT '订单时间',
  `orderid` varchar(20) NOT NULL DEFAULT '' COMMENT '订单号',
  `serverid` int(4) NOT NULL COMMENT '服务器id'
) ENGINE=MyISAM DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- 表的结构 `agent_agent_money`
--

CREATE TABLE `agent_agent_money` (
  `id` int(10) NOT NULL,
  `username` varchar(20) NOT NULL DEFAULT '' COMMENT '操作用户',
  `agent` varchar(20) NOT NULL DEFAULT '' COMMENT '代理账户',
  `type` tinyint(1) NOT NULL DEFAULT '0' COMMENT '操作方式 0增加 1减少',
  `money` float(10,2) NOT NULL DEFAULT '0.00' COMMENT '金额',
  `content` varchar(255) NOT NULL DEFAULT '' COMMENT '操作内容',
  `create_time` int(10) NOT NULL,
  `update_time` int(10) NOT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '0' COMMENT '状态 0成功 1失败'
) ENGINE=MyISAM DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- 表的结构 `agent_agent_type`
--

CREATE TABLE `agent_agent_type` (
  `id` int(11) NOT NULL,
  `name` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '名称',
  `description` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '简介',
  `img` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '/static/index/images/user_level_default.png' COMMENT '图片',
  `status` tinyint(1) NOT NULL DEFAULT '1' COMMENT '是否启用',
  `create_time` int(10) NOT NULL DEFAULT '0' COMMENT '创建时间',
  `update_time` int(10) NOT NULL DEFAULT '0' COMMENT '更新时间',
  `delete_time` int(10) NOT NULL DEFAULT '0' COMMENT '删除时间'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户等级' ROW_FORMAT=COMPACT;

--
-- 转存表中的数据 `agent_agent_type`
--

INSERT INTO `agent_agent_type` (`id`, `name`, `description`, `img`, `status`, `create_time`, `update_time`, `delete_time`) VALUES
(1, '一级代理', '一级代理', '/uploads/attachment/20190822/6dcc15ea1701c449e63e6856f0931e2a.png', 1, 1590438513, 1590443125, 0),
(2, '二级代理', '二级代理', '/uploads/attachment/20190822/72031bafedeba534d1e862b8d717f8db.png', 1, 1590438513, 1590443134, 0),
(3, '三级代理', '三级代理', '/uploads/attachment/20190822/d0b153352b15ea7097403c563e9c3be4.png', 1, 1590438513, 1590443146, 0);

-- --------------------------------------------------------

--
-- 表的结构 `agent_attachment`
--

CREATE TABLE `agent_attachment` (
  `id` int(11) NOT NULL,
  `admin_user_id` int(11) NOT NULL COMMENT '后台用户ID',
  `user_id` int(11) NOT NULL COMMENT '前台用户ID',
  `original_name` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '原文件名',
  `save_name` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '保存文件名',
  `save_path` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '系统完整路径',
  `url` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '系统完整路径',
  `extension` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '后缀',
  `mime` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '类型',
  `size` bigint(20) NOT NULL DEFAULT '0' COMMENT '大小',
  `md5` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT 'MD5',
  `sha1` varchar(40) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT 'SHA1',
  `create_time` int(10) NOT NULL DEFAULT '0' COMMENT '创建时间',
  `update_time` int(10) NOT NULL DEFAULT '0' COMMENT '更新时间',
  `delete_time` int(10) NOT NULL DEFAULT '0' COMMENT '删除时间'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='附件表' ROW_FORMAT=COMPACT;

-- --------------------------------------------------------

--
-- 表的结构 `agent_game_gm`
--

CREATE TABLE `agent_game_gm` (
  `id` int(10) UNSIGNED NOT NULL,
  `username` varchar(20) NOT NULL DEFAULT '' COMMENT '操作用户',
  `type` tinyint(1) NOT NULL DEFAULT '0' COMMENT '操作类型',
  `role_id` int(10) NOT NULL DEFAULT '0',
  `content` varchar(200) NOT NULL DEFAULT '' COMMENT '操作内容',
  `status` tinyint(1) NOT NULL DEFAULT '1' COMMENT '状态 1失败 0成功',
  `create_time` int(10) NOT NULL DEFAULT '0' COMMENT '操作时间',
  `update_time` int(10) NOT NULL DEFAULT '0' COMMENT '完成时间'
) ENGINE=MyISAM DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- 表的结构 `agent_gm_log`
--

CREATE TABLE `agent_gm_log` (
  `id` int(10) NOT NULL,
  `admin_user_id` int(10) NOT NULL,
  `name` varchar(32) DEFAULT NULL,
  `create_time` int(11) DEFAULT NULL,
  `param` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- 表的结构 `agent_migrations`
--

CREATE TABLE `agent_migrations` (
  `version` bigint(20) NOT NULL,
  `migration_name` varchar(100) DEFAULT NULL,
  `start_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `end_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `breakpoint` tinyint(1) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ROW_FORMAT=COMPACT;

-- --------------------------------------------------------

--
-- 表的结构 `agent_push_balance`
--

CREATE TABLE `agent_push_balance` (
  `id` int(10) UNSIGNED NOT NULL,
  `username` varchar(15) NOT NULL COMMENT '账户',
  `balance_type` tinyint(1) NOT NULL DEFAULT '0' COMMENT '结算方式',
  `money` float(10,2) NOT NULL DEFAULT '0.00' COMMENT '结算金额',
  `create_time` int(10) NOT NULL DEFAULT '0' COMMENT '创建时间',
  `update_time` int(10) NOT NULL DEFAULT '0' COMMENT '更新时间',
  `delete_time` int(10) NOT NULL DEFAULT '0' COMMENT '删除时间',
  `status` enum('1','0') NOT NULL DEFAULT '0' COMMENT '结算状态 0未结算 1已结算',
  `balance_account` varchar(20) NOT NULL DEFAULT '' COMMENT '结算账户'
) ENGINE=MyISAM DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- 表的结构 `agent_setting`
--

CREATE TABLE `agent_setting` (
  `id` int(11) NOT NULL,
  `setting_group_id` int(10) NOT NULL DEFAULT '0' COMMENT '所属分组',
  `name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '名称',
  `description` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '描述',
  `code` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '代码',
  `content` text COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '设置配置及内容',
  `sort_number` int(10) NOT NULL DEFAULT '1000' COMMENT '排序',
  `create_time` int(10) NOT NULL DEFAULT '0' COMMENT '创建时间',
  `update_time` int(10) NOT NULL DEFAULT '0' COMMENT '更新时间',
  `delete_time` int(10) NOT NULL DEFAULT '0' COMMENT '删除时间'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='设置' ROW_FORMAT=COMPACT;

--
-- 转存表中的数据 `agent_setting`
--

INSERT INTO `agent_setting` (`id`, `setting_group_id`, `name`, `description`, `code`, `content`, `sort_number`, `create_time`, `update_time`, `delete_time`) VALUES
(1, 1, '基本设置', '后台的基本信息设置', 'base', '[{\"name\":\"\\u540e\\u53f0\\u540d\\u79f0\",\"field\":\"name\",\"type\":\"text\",\"content\":\"\\u7fa4\\u96c4\\u9010\\u9e7f\",\"option\":\"\"},{\"name\":\"\\u540e\\u53f0\\u7b80\\u79f0\",\"field\":\"short_name\",\"type\":\"text\",\"content\":\"\\u4ee3\\u7406\\u7cfb\\u7edf\",\"option\":\"\"},{\"name\":\"\\u540e\\u53f0\\u4f5c\\u8005\",\"field\":\"author\",\"type\":\"text\",\"content\":\"1\",\"option\":\"\"},{\"name\":\"\\u540e\\u53f0\\u7248\\u672c\",\"field\":\"version\",\"type\":\"text\",\"content\":\"1.2\",\"option\":\"\"}]', 1000, 1590438513, 1626511171, 0),
(2, 1, '登录设置', '后台登录相关设置', 'login', '[{\"name\":\"\\u767b\\u5f55token\\u9a8c\\u8bc1\",\"field\":\"token\",\"type\":\"switch\",\"content\":\"0\",\"option\":\"\"},{\"name\":\"\\u9a8c\\u8bc1\\u7801\",\"field\":\"captcha\",\"type\":\"select\",\"content\":\"0\",\"option\":\"0||\\u5173\\u95ed\\r\\n1||\\u5f00\\u542f\"},{\"name\":\"\\u767b\\u5f55\\u80cc\\u666f\",\"field\":\"background\",\"type\":\"image\",\"content\":\"\\/uploads\\/attachment\\/20210717\\/2ada3cdc8e96345cec86b1de0d59f5e1.png\",\"option\":\"\"}]', 1000, 1590438513, 1626511212, 0),
(3, 1, '首页设置', '后台首页参数设置', 'index', '[{\"name\":\"\\u9ed8\\u8ba4\\u5bc6\\u7801\\u8b66\\u544a\",\"field\":\"password_warning\",\"type\":\"switch\",\"content\":\"1\",\"option\":\"\"},{\"name\":\"\\u662f\\u5426\\u663e\\u793a\\u63d0\\u793a\\u4fe1\\u606f\",\"field\":\"show_notice\",\"type\":\"switch\",\"content\":\"1\",\"option\":\"\"},{\"name\":\"\\u63d0\\u793a\\u4fe1\\u606f\\u5185\\u5bb9\",\"field\":\"notice_content\",\"type\":\"text\",\"content\":\"\\u6b22\\u8fce\\u6765\\u5230\\u4f7f\\u7528\\u672c\\u7cfb\\u7edf\\uff0c\\u5de6\\u4fa7\\u4e3a\\u83dc\\u5355\\u533a\\u57df\\uff0c\\u53f3\\u4fa7\\u4e3a\\u529f\\u80fd\\u533a\\u3002\",\"option\":\"\"},{\"name\":\"\\u7ba1\\u7406\\u5458QQ\",\"field\":\"admin_qq\",\"type\":\"number\",\"content\":\"\",\"option\":\"\"},{\"name\":\"\\u4ee3\\u7406\\u516c\\u544a\\u63d0\\u793a\\u4fe1\\u606f\",\"field\":\"agent_notice\",\"type\":\"text\",\"content\":\"\\u7cfb\\u7edf\\u63d0\\u73b0\\u5468\\u671fT+1,\\u6709\\u4efb\\u4f55\\u95ee\\u9898\\u6b22\\u8fce\\u8054\\u7cfb\\u7ba1\\u7406\\u5458QQ\\uff1a\",\"option\":\"\"}]', 1000, 1590438513, 1596822056, 0),
(4, 2, '游戏配置', '游戏相关配置', 'game', '[{\"name\":\"GM\\u63a5\\u53e3\",\"field\":\"gm_url\",\"type\":\"url\",\"content\":\"http:\\/\\/127.0.0.1:9561\\/admin\",\"option\":\"\"},{\"name\":\"\\u9080\\u8bf7\\u7801\\u957f\\u5ea6\",\"field\":\"invite_length\",\"type\":\"number\",\"content\":\"5\",\"option\":\"\"},{\"name\":\"GM\\u5bc6\\u7801\",\"field\":\"gm_password\",\"type\":\"password\",\"content\":\"123456\",\"option\":\"\"}]', 1000, 1591101334, 1627653068, 0),
(6, 2, '代理福利', '代理福利相关配置', 'welfare', '[{\"name\":\"\\u5f00\\u542f\\u4ee3\\u7406\\u798f\\u5229\",\"field\":\"is_welfare\",\"type\":\"switch\",\"content\":\"1\",\"option\":\"\"},{\"name\":\"\\u7269\\u54c1ID\",\"field\":\"item_id\",\"type\":\"number\",\"content\":\"90004\",\"option\":\"\"},{\"name\":\"\\u7269\\u54c1\\u6570\\u91cf\",\"field\":\"item_num\",\"type\":\"number\",\"content\":\"5000\",\"option\":\"\"},{\"name\":\"\\u95f4\\u9694\\u65f6\\u957f\",\"field\":\"interval\",\"type\":\"number\",\"content\":\"24\",\"option\":\"\"}]', 1000, 1593677658, 1605288037, 0);

-- --------------------------------------------------------

--
-- 表的结构 `agent_setting_group`
--

CREATE TABLE `agent_setting_group` (
  `id` int(11) NOT NULL,
  `module` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '作用模块',
  `name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '名称',
  `description` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '描述',
  `code` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '代码',
  `sort_number` int(10) NOT NULL DEFAULT '1000' COMMENT '排序',
  `auto_create_menu` tinyint(1) NOT NULL DEFAULT '0' COMMENT '自动生成菜单',
  `auto_create_file` tinyint(1) NOT NULL DEFAULT '0' COMMENT '自动生成配置文件',
  `icon` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'fa-list' COMMENT '图标',
  `create_time` int(10) NOT NULL DEFAULT '0' COMMENT '创建时间',
  `update_time` int(10) NOT NULL DEFAULT '0' COMMENT '更新时间',
  `delete_time` int(10) NOT NULL DEFAULT '0' COMMENT '删除时间'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='设置分组' ROW_FORMAT=COMPACT;

--
-- 转存表中的数据 `agent_setting_group`
--

INSERT INTO `agent_setting_group` (`id`, `module`, `name`, `description`, `code`, `sort_number`, `auto_create_menu`, `auto_create_file`, `icon`, `create_time`, `update_time`, `delete_time`) VALUES
(1, 'admin', '后台设置', '后台管理方面的设置', 'admin', 1000, 1, 1, 'fa-adjust', 1590438513, 1590438513, 0),
(2, 'admin', '游戏设置', '游戏相关设置', 'game', 1000, 1, 1, 'fa-gamepad', 1591099778, 1591101197, 0);

-- --------------------------------------------------------

--
-- 表的结构 `charge_record`
--

CREATE TABLE `charge_record` (
  `orderid` varchar(20) DEFAULT NULL COMMENT '订单id',
  `roleid` int(10) NOT NULL DEFAULT '0' COMMENT '角色id',
  `money` int(11) DEFAULT '0' COMMENT '充值金额',
  `realmoney` int(11) DEFAULT '0' COMMENT '真实充值金额',
  `jade` int(11) DEFAULT '0' COMMENT '仙玉',
  `goodscount` int(11) DEFAULT '0' COMMENT '数量',
  `goodsid` int(11) DEFAULT '0' COMMENT '物品id',
  `create_time` datetime DEFAULT NULL COMMENT '创建时间',
  `finish_time` datetime DEFAULT NULL COMMENT '完成时间',
  `serverid` int(10) NOT NULL DEFAULT '0',
  `status` int(11) DEFAULT '0' COMMENT '状态',
  `balance_status` tinyint(1) NOT NULL DEFAULT '1' COMMENT '结算状态',
  `sdpayno` varchar(32) DEFAULT NULL COMMENT '支付订单',
  `invite` varchar(32) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ROW_FORMAT=COMPACT;

-- --------------------------------------------------------

--
-- 表的结构 `dhxy_comment`
--

CREATE TABLE `dhxy_comment` (
  `serverId` int(10) NOT NULL DEFAULT '0',
  `text` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- 表的结构 `dhxy_horse`
--

CREATE TABLE `dhxy_horse` (
  `role_id` int(10) NOT NULL COMMENT '角色索引',
  `position` int(10) NOT NULL COMMENT '坐骑位置1,2,3,4',
  `name` varchar(255) DEFAULT '' COMMENT '坐骑名称',
  `level` int(10) DEFAULT '1' COMMENT '坐骑等级',
  `exp` int(10) DEFAULT '0' COMMENT '坐骑经验'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- 表的结构 `dhxy_horse_skill`
--

CREATE TABLE `dhxy_horse_skill` (
  `role_id` int(10) NOT NULL COMMENT '角色索引',
  `position` int(10) NOT NULL COMMENT '位置索引',
  `skill_id` int(10) DEFAULT NULL COMMENT '技能索引',
  `exp` int(10) DEFAULT '0' COMMENT '技能经验'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- 表的结构 `ip_frozen`
--

CREATE TABLE `ip_frozen` (
  `frozen_id` int(10) NOT NULL,
  `account_id` int(10) NOT NULL,
  `frozen_ip` varchar(20) NOT NULL DEFAULT '' COMMENT 'ip地址',
  `frozen_time` datetime NOT NULL COMMENT '创建时间',
  `gm_role_id` int(10) DEFAULT NULL COMMENT 'GM帐号'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- 表的结构 `mac_frozen`
--

CREATE TABLE `mac_frozen` (
  `frozenid` int(10) NOT NULL COMMENT '封禁索引',
  `account_id` int(10) NOT NULL COMMENT '帐号索引',
  `mac` varchar(64) NOT NULL DEFAULT '' COMMENT 'MAC地址',
  `gm_role_id` int(10) NOT NULL COMMENT 'GM帐号索引',
  `date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- 表的结构 `qy_account`
--

CREATE TABLE `qy_account` (
  `accountid` int(10) NOT NULL,
  `account` varchar(255) NOT NULL,
  `password` varchar(255) DEFAULT '',
  `invite` varchar(255) NOT NULL DEFAULT '' COMMENT '邀请码',
  `phone` varchar(255) DEFAULT '0',
  `location` varchar(255) DEFAULT '0',
  `last_login_time` datetime DEFAULT NULL,
  `login_ip` varchar(255) DEFAULT '',
  `register_time` datetime DEFAULT NULL,
  `state` int(10) DEFAULT '0',
  `safecode` varchar(255) DEFAULT NULL COMMENT '安全码',
  `mac` varchar(255) DEFAULT '' COMMENT '计算地址',
  `update_msg` int(10) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- 表的结构 `qy_agent`
--

CREATE TABLE `qy_agent` (
  `id` int(10) NOT NULL COMMENT '递增id',
  `account` varchar(255) DEFAULT NULL COMMENT '代理帐号',
  `password` varchar(255) DEFAULT NULL COMMENT '代理密码',
  `name` varchar(255) DEFAULT NULL COMMENT '代理名字',
  `addtime` int(11) DEFAULT '0' COMMENT '添加时间戳',
  `invitecode` varchar(255) DEFAULT NULL COMMENT '邀请码',
  `state` int(1) DEFAULT '0' COMMENT '状态 0正常 1关闭',
  `is_auth` tinyint(1) DEFAULT '0' COMMENT '是否授权',
  `p_id` int(11) DEFAULT '0' COMMENT '父级ID',
  `create_time` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ROW_FORMAT=COMPACT;

-- --------------------------------------------------------

--
-- 表的结构 `qy_bang`
--

CREATE TABLE `qy_bang` (
  `bangid` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL COMMENT '帮派名字',
  `aim` varchar(255) DEFAULT NULL COMMENT '帮派宗旨',
  `rolenum` int(10) DEFAULT '0' COMMENT '人数',
  `masterid` int(11) DEFAULT NULL COMMENT '帮主id',
  `mastername` varchar(255) DEFAULT NULL COMMENT '帮主名字',
  `createtime` datetime DEFAULT NULL COMMENT '创建时间',
  `state` int(10) DEFAULT '1' COMMENT '1正常帮派，0解散帮派',
  `serverid` int(10) DEFAULT '0' COMMENT '服务器id',
  `bidding` int(10) DEFAULT '0' COMMENT '帮派权重值',
  `fight_win` int(10) DEFAULT '0' COMMENT '帮战胜利',
  `fight_fail` int(10) DEFAULT '0' COMMENT '帮战失败',
  `level` int(10) DEFAULT '1' COMMENT '帮派等级'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- 表的结构 `qy_bang2`
--

CREATE TABLE `qy_bang2` (
  `bangid` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL COMMENT '帮派名字',
  `aim` varchar(255) DEFAULT NULL COMMENT '帮派宗旨',
  `rolenum` int(10) DEFAULT '0' COMMENT '人数',
  `masterid` int(11) DEFAULT NULL COMMENT '帮主id',
  `mastername` varchar(255) DEFAULT NULL COMMENT '帮主名字',
  `createtime` datetime DEFAULT NULL COMMENT '创建时间',
  `state` int(10) DEFAULT '1' COMMENT '1正常帮派，0解散帮派',
  `serverid` int(10) DEFAULT '0' COMMENT '服务器id',
  `bidding` int(10) DEFAULT '0' COMMENT '帮派权重值'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- 表的结构 `qy_bangzhan`
--

CREATE TABLE `qy_bangzhan` (
  `day` date NOT NULL,
  `bangid` int(10) NOT NULL,
  `fightid` int(10) DEFAULT NULL,
  `pdie` int(10) DEFAULT '0' COMMENT '本帮玩家死亡数',
  `pkill` int(10) DEFAULT '0' COMMENT '本帮玩家击杀数',
  `door_hp` int(10) DEFAULT '0' COMMENT '本帮城门剩余血量',
  `iswin` tinyint(1) DEFAULT '0' COMMENT '是否胜利',
  `record` text,
  `fire_num` int(10) DEFAULT '0' COMMENT '龙头炮开炮次数'
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- 表的结构 `qy_child`
--

CREATE TABLE `qy_child` (
  `id` int(10) NOT NULL,
  `marryid` int(10) DEFAULT NULL,
  `roleid1` int(10) DEFAULT NULL,
  `roleid2` int(10) DEFAULT NULL,
  `name` varchar(16) DEFAULT NULL,
  `level` int(10) DEFAULT '0',
  `exp` int(10) DEFAULT '0',
  `createtime` datetime DEFAULT NULL,
  `sex` tinyint(1) DEFAULT NULL,
  `resid` int(10) DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- 表的结构 `qy_data`
--

CREATE TABLE `qy_data` (
  `id` int(10) NOT NULL,
  `notice` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- 表的结构 `qy_equip`
--

CREATE TABLE `qy_equip` (
  `EquipID` int(10) NOT NULL COMMENT '装备ID',
  `EquipType` int(10) DEFAULT '0' COMMENT '装备类型，0:新手装备，1:高级装备，2:神兵，3:仙器',
  `RoleID` int(10) NOT NULL DEFAULT '0' COMMENT '装备拥有者id',
  `BaseAttr` varchar(1024) DEFAULT NULL COMMENT '基础属性',
  `Grade` int(10) DEFAULT '0' COMMENT '装备等级',
  `EIndex` int(10) DEFAULT '0' COMMENT '装备位置',
  `Shuxingxuqiu` varchar(1024) DEFAULT NULL COMMENT '属性需求',
  `Type` int(10) DEFAULT '0' COMMENT '装备编号',
  `GemCnt` int(10) DEFAULT '0' COMMENT '宝石镶嵌数量',
  `LianhuaAttr` varchar(1024) DEFAULT NULL COMMENT '炼化属性',
  `refine` varchar(1024) DEFAULT NULL COMMENT '装备洗炼',
  `recast` varchar(1024) DEFAULT NULL COMMENT '装备重铸',
  `create_time` datetime DEFAULT NULL COMMENT '创建时间',
  `delete_time` datetime DEFAULT NULL COMMENT '删除时间',
  `state` int(10) DEFAULT '1' COMMENT '状态0删除',
  `name` varchar(255) DEFAULT NULL COMMENT '装备名字',
  `pos` int(255) DEFAULT NULL COMMENT '装备存放位置'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- 表的结构 `qy_equip_back`
--

CREATE TABLE `qy_equip_back` (
  `EquipID` int(10) NOT NULL,
  `EquipType` int(10) DEFAULT '0' COMMENT '装备类型，0:新手装备，1:高级装备，2:神兵，3:仙器',
  `RoleID` int(10) NOT NULL DEFAULT '0' COMMENT '装备拥有者id',
  `BaseAttr` varchar(1024) DEFAULT NULL COMMENT '基础属性',
  `Grade` int(10) DEFAULT '0' COMMENT '装备等级',
  `EIndex` int(10) DEFAULT '0' COMMENT '装备位置',
  `Shuxingxuqiu` varchar(1024) DEFAULT NULL COMMENT '属性需求',
  `Type` int(10) DEFAULT '0' COMMENT '装备编号',
  `GemCnt` int(10) DEFAULT '0' COMMENT '宝石镶嵌数量',
  `LianhuaAttr` varchar(1024) DEFAULT NULL COMMENT '炼化属性',
  `refine` varchar(1024) DEFAULT NULL COMMENT '装备洗炼',
  `recast` varchar(1024) DEFAULT NULL COMMENT '装备重铸',
  `create_time` datetime DEFAULT NULL COMMENT '创建时间',
  `delete_time` datetime DEFAULT NULL COMMENT '删除时间',
  `state` int(10) DEFAULT '1' COMMENT '状态0删除',
  `name` varchar(255) DEFAULT NULL COMMENT '装备名字',
  `pos` int(255) DEFAULT NULL COMMENT '装备存放位置'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- 表的结构 `qy_exchange`
--

CREATE TABLE `qy_exchange` (
  `roleid` int(10) NOT NULL COMMENT '角色索引',
  `code` varchar(255) NOT NULL COMMENT '兑换码',
  `date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '兑换时间'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- 表的结构 `qy_friends`
--

CREATE TABLE `qy_friends` (
  `id` int(10) NOT NULL,
  `roleidA` int(10) NOT NULL,
  `nameA` varchar(255) NOT NULL,
  `residA` int(10) NOT NULL DEFAULT '0',
  `reliveA` int(10) NOT NULL DEFAULT '0',
  `levelA` int(10) NOT NULL DEFAULT '0',
  `raceA` int(10) NOT NULL,
  `sexA` int(10) NOT NULL,
  `accountidA` int(10) NOT NULL,
  `roleidB` int(10) NOT NULL,
  `nameB` varchar(255) NOT NULL,
  `residB` int(10) NOT NULL DEFAULT '0',
  `reliveB` int(10) NOT NULL DEFAULT '0',
  `levelB` int(10) NOT NULL DEFAULT '0',
  `raceB` int(10) NOT NULL,
  `sexB` int(10) NOT NULL,
  `accountidB` int(10) NOT NULL,
  `state` int(10) NOT NULL DEFAULT '0',
  `time` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- 表的结构 `qy_info`
--

CREATE TABLE `qy_info` (
  `id` int(11) NOT NULL,
  `comment` varchar(2048) CHARACTER SET utf8mb4 DEFAULT '' COMMENT '公告内容',
  `guideid` int(10) DEFAULT '0' COMMENT '向导服',
  `shuilusid` int(11) NOT NULL DEFAULT '1' COMMENT '水路大会赛季',
  `shuilulid` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- 表的结构 `qy_marry`
--

CREATE TABLE `qy_marry` (
  `id` int(10) NOT NULL,
  `roleid1` int(11) NOT NULL COMMENT '新郎ID',
  `roleid2` int(11) NOT NULL COMMENT '新娘ID',
  `level` int(10) DEFAULT '1' COMMENT '结婚等级',
  `marry_lv` int(10) DEFAULT '1' COMMENT '结婚戒指等级 ',
  `exp` int(10) DEFAULT '0',
  `name1` varchar(32) DEFAULT NULL,
  `name2` varchar(32) DEFAULT NULL,
  `status` tinyint(1) DEFAULT '1' COMMENT '1结婚 0离婚',
  `time` datetime DEFAULT NULL,
  `divorce_time` datetime DEFAULT NULL,
  `resid1` int(10) DEFAULT NULL,
  `resid2` int(10) DEFAULT NULL,
  `point` varchar(128) DEFAULT NULL,
  `child_name` varchar(16) DEFAULT NULL,
  `child_exp` int(10) DEFAULT '0',
  `child_lv` int(10) DEFAULT '0',
  `child_point` varchar(128) DEFAULT NULL,
  `child_sex` tinyint(1) DEFAULT NULL,
  `child_resid` int(10) DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- 表的结构 `qy_notice`
--

CREATE TABLE `qy_notice` (
  `text` varchar(255) DEFAULT '' COMMENT '广播信息',
  `type` int(10) DEFAULT '0' COMMENT '1走马灯 2聊天框 3走马灯+聊天框',
  `serverid` int(10) DEFAULT '0' COMMENT '服务器id',
  `time` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- 表的结构 `qy_pet`
--

CREATE TABLE `qy_pet` (
  `petid` int(11) NOT NULL COMMENT '召唤兽索引',
  `roleid` int(10) NOT NULL DEFAULT '0' COMMENT '角色索引',
  `name` varchar(255) DEFAULT '' COMMENT '召唤兽名称',
  `dataid` int(11) DEFAULT '0' COMMENT '配置索引',
  `relive` int(10) DEFAULT '0' COMMENT '转生',
  `level` int(10) DEFAULT '0' COMMENT '等级',
  `resid` int(10) NOT NULL DEFAULT '0' COMMENT '资源id',
  `color` int(10) DEFAULT '0' COMMENT '变色',
  `grade` int(10) DEFAULT '0' COMMENT '召唤兽品级',
  `fly` int(10) DEFAULT '0' COMMENT '飞升等级',
  `qinmi` int(10) DEFAULT '0' COMMENT '亲密',
  `locks` int(11) DEFAULT '0' COMMENT '技能格子解锁',
  `shenskill` int(10) DEFAULT '0' COMMENT '神兽技能',
  `skill` varchar(4096) DEFAULT NULL,
  `ppoint` varchar(255) DEFAULT NULL,
  `dpoint` varchar(255) DEFAULT NULL,
  `rate` int(10) DEFAULT '0' COMMENT '成长率',
  `hp` int(10) DEFAULT '0' COMMENT '气血',
  `mp` int(10) DEFAULT '0' COMMENT '法力',
  `atk` int(10) DEFAULT '0' COMMENT '攻击力',
  `spd` int(10) DEFAULT '0' COMMENT '速度',
  `wuxing` varchar(255) DEFAULT NULL COMMENT '五行',
  `exp` bigint(20) DEFAULT '0' COMMENT '经验',
  `xexp` int(10) DEFAULT '0' COMMENT '修炼经验',
  `xlevel` int(10) DEFAULT '0' COMMENT '修炼等级',
  `longgu` int(10) DEFAULT '0',
  `control` int(10) DEFAULT '0' COMMENT '管制位',
  `create_time` datetime DEFAULT NULL COMMENT '创建时间',
  `delete_time` datetime DEFAULT NULL COMMENT '删除时间',
  `state` int(10) DEFAULT '1' COMMENT '状态1正常，0删除'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- 表的结构 `qy_pet_back`
--

CREATE TABLE `qy_pet_back` (
  `petid` int(11) NOT NULL COMMENT '召唤兽索引',
  `roleid` int(10) NOT NULL DEFAULT '0' COMMENT '角色索引',
  `name` varchar(255) DEFAULT '' COMMENT '召唤兽名称',
  `dataid` int(11) DEFAULT '0' COMMENT '配置索引',
  `relive` int(10) DEFAULT '0' COMMENT '转生',
  `level` int(10) DEFAULT '0' COMMENT '等级',
  `resid` int(10) NOT NULL DEFAULT '0' COMMENT '资源id',
  `color` int(10) DEFAULT '0' COMMENT '变色',
  `grade` int(10) DEFAULT '0' COMMENT '召唤兽品级',
  `fly` int(10) DEFAULT '0' COMMENT '飞升等级',
  `qinmi` int(10) DEFAULT '0' COMMENT '亲密',
  `shenskill` int(10) DEFAULT '0' COMMENT '神兽技能',
  `locks` int(11) DEFAULT '0',
  `skill` varchar(4096) DEFAULT NULL,
  `ppoint` varchar(255) DEFAULT NULL,
  `dpoint` varchar(255) DEFAULT NULL,
  `rate` int(10) DEFAULT '0' COMMENT '成长率',
  `hp` int(10) DEFAULT '0' COMMENT '气血',
  `mp` int(10) DEFAULT '0' COMMENT '法力',
  `atk` int(10) DEFAULT '0' COMMENT '攻击力',
  `spd` int(10) DEFAULT '0' COMMENT '速度',
  `wuxing` varchar(255) DEFAULT NULL COMMENT '五行',
  `exp` bigint(20) DEFAULT '0' COMMENT '经验',
  `xexp` int(10) DEFAULT '0' COMMENT '修炼经验',
  `xlevel` int(10) DEFAULT '0' COMMENT '修炼等级',
  `longgu` int(10) DEFAULT '0',
  `control` int(10) DEFAULT '0' COMMENT '管制位',
  `create_time` datetime DEFAULT NULL COMMENT '创建时间',
  `delete_time` datetime DEFAULT NULL COMMENT '删除时间',
  `state` int(10) DEFAULT '1' COMMENT '状态1正常，0删除'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- 表的结构 `qy_question`
--

CREATE TABLE `qy_question` (
  `id` int(10) NOT NULL,
  `wait_time` int(10) DEFAULT '10' COMMENT '等待时间(秒)',
  `question` varchar(64) DEFAULT NULL COMMENT '问题',
  `msg` varchar(64) DEFAULT NULL COMMENT '提示',
  `answer` varchar(64) DEFAULT NULL COMMENT '答案',
  `item` varchar(128) DEFAULT NULL,
  `type` tinyint(1) DEFAULT '0' COMMENT '0任意玩家, 1仅限一人, 2随机抽取1人',
  `item_notice` tinyint(1) DEFAULT '1'
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COMMENT='题库';

-- --------------------------------------------------------

--
-- 表的结构 `qy_relation`
--

CREATE TABLE `qy_relation` (
  `relationId` int(11) NOT NULL COMMENT '关系id',
  `members` json DEFAULT NULL COMMENT '成员列表',
  `relationType` int(10) DEFAULT NULL COMMENT '关系类型',
  `relationName` varchar(255) DEFAULT NULL COMMENT '关系名字',
  `createTime` datetime DEFAULT NULL COMMENT '创建时间',
  `status` int(10) DEFAULT NULL COMMENT '状态'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- 表的结构 `qy_relation_back`
--

CREATE TABLE `qy_relation_back` (
  `relationId` int(11) NOT NULL COMMENT '关系id',
  `members` json DEFAULT NULL COMMENT '成员列表',
  `relationType` int(10) DEFAULT NULL COMMENT '关系类型',
  `relationName` varchar(255) DEFAULT NULL COMMENT '关系名字',
  `createTime` datetime DEFAULT NULL COMMENT '创建时间',
  `status` int(10) DEFAULT NULL COMMENT '状态'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- 表的结构 `qy_role`
--

CREATE TABLE `qy_role` (
  `roleid` int(11) NOT NULL COMMENT '唯一id',
  `accountid` int(10) NOT NULL DEFAULT '0' COMMENT '账户id',
  `serverid` int(10) DEFAULT '0' COMMENT '所在服务器id',
  `name` varchar(255) CHARACTER SET utf8mb4 DEFAULT '',
  `resid` int(10) DEFAULT '0' COMMENT '角色的资源id',
  `race` int(10) DEFAULT '0' COMMENT '种族',
  `sex` int(10) DEFAULT '1' COMMENT '性别 1 男 2 女',
  `relive` int(10) DEFAULT '0' COMMENT '转生',
  `relivelist` varchar(255) DEFAULT '[[0,0],[0,0],[0,0]]' COMMENT '转生记录',
  `level` int(10) DEFAULT '1' COMMENT '等级',
  `level_reward` longtext COMMENT '等级奖励',
  `exp` bigint(20) DEFAULT '0' COMMENT '经验',
  `day_count` longtext NOT NULL COMMENT '每日限购',
  `money` bigint(20) DEFAULT '200000',
  `jade` bigint(20) DEFAULT '0',
  `mapid` int(10) DEFAULT '0',
  `x` int(10) DEFAULT '0',
  `y` int(10) DEFAULT '0',
  `bangid` int(10) DEFAULT '0' COMMENT '帮派id',
  `color` varchar(255) DEFAULT '' COMMENT '染色信息',
  `star` int(10) DEFAULT '0' COMMENT '地煞星级',
  `shane` int(10) DEFAULT '0' COMMENT '善恶',
  `addpoint` longtext,
  `xiupoint` longtext COMMENT '修炼加点',
  `xiulevel` int(10) DEFAULT '0' COMMENT '修炼等级',
  `title` varchar(4096) DEFAULT '' COMMENT '称号',
  `skill` varchar(2000) DEFAULT '',
  `bagitem` varchar(2000) DEFAULT NULL COMMENT '背包物品',
  `lockeritem` varchar(2000) DEFAULT NULL COMMENT '储物柜物品',
  `partner` varchar(255) DEFAULT NULL,
  `pet` int(10) DEFAULT '0',
  `getpet` int(10) DEFAULT '0',
  `equiplist` varchar(2000) DEFAULT NULL COMMENT '装备列表，所有装备',
  `taskstate` varchar(4000) DEFAULT NULL,
  `partnerlist` varchar(2000) DEFAULT NULL,
  `chargesum` int(10) DEFAULT '0',
  `rewardrecord` varchar(32) DEFAULT '0',
  `getgift` varchar(64) DEFAULT '' COMMENT '是否领取礼包',
  `shuilu` varchar(1000) DEFAULT NULL COMMENT '水路大会信息',
  `active_scheme_name` varchar(255) DEFAULT NULL COMMENT '套装名称',
  `friendlist` json DEFAULT NULL COMMENT '好友列表',
  `create_time` datetime DEFAULT NULL COMMENT '创建时间',
  `lastonline` datetime DEFAULT NULL COMMENT '最后在线时间',
  `gmlevel` int(10) DEFAULT '0',
  `state` int(10) DEFAULT '0',
  `mountid` int(10) DEFAULT '0',
  `horse_index` int(10) DEFAULT '0' COMMENT '坐骑位索引',
  `yuanshenlevel` int(10) DEFAULT '0',
  `skins` varchar(512) DEFAULT '' COMMENT '装扮',
  `marryid` int(10) DEFAULT '0',
  `auto` varchar(32) DEFAULT NULL,
  `bagua` text COMMENT '八卦',
  `tiance` varchar(512) DEFAULT NULL COMMENT '八卦',
  `bianshen` text COMMENT '变身卡'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- 表的结构 `qy_scheme`
--

CREATE TABLE `qy_scheme` (
  `schemeId` int(10) NOT NULL,
  `schemeName` varchar(255) DEFAULT NULL COMMENT '套装名',
  `content` longtext COMMENT '套装配置',
  `roleId` int(10) NOT NULL COMMENT '角色ID',
  `status` int(10) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- 表的结构 `qy_scheme_back`
--

CREATE TABLE `qy_scheme_back` (
  `schemeId` int(10) NOT NULL,
  `schemeName` varchar(255) DEFAULT NULL,
  `content` varchar(2048) DEFAULT NULL,
  `roleId` int(10) NOT NULL,
  `status` int(10) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- 表的结构 `qy_tiance`
--

CREATE TABLE `qy_tiance` (
  `id` int(10) NOT NULL,
  `roleid` int(10) DEFAULT NULL,
  `typeid` int(10) DEFAULT NULL,
  `attr_level` int(10) DEFAULT NULL,
  `state` tinyint(1) DEFAULT '1'
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- 表的结构 `qy_update`
--

CREATE TABLE `qy_update` (
  `id` int(10) NOT NULL,
  `msg` varchar(255) NOT NULL DEFAULT ''
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- 表的结构 `shop_goods`
--

CREATE TABLE `shop_goods` (
  `nID` int(11) NOT NULL,
  `nConfigID` int(11) DEFAULT NULL,
  `nKind` int(11) DEFAULT NULL,
  `nSubKind` int(11) DEFAULT NULL,
  `strJson` varchar(255) DEFAULT NULL,
  `nSeller` int(11) DEFAULT NULL,
  `nAddTime` int(11) DEFAULT NULL,
  `nPrice` int(11) DEFAULT NULL,
  `nCnt` int(11) DEFAULT NULL,
  `nSellCnt` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- 转储表的索引
--

--
-- 表的索引 `agent_admin_log`
--
ALTER TABLE `agent_admin_log`
  ADD PRIMARY KEY (`id`) USING BTREE;

--
-- 表的索引 `agent_admin_log_data`
--
ALTER TABLE `agent_admin_log_data`
  ADD PRIMARY KEY (`id`) USING BTREE;

--
-- 表的索引 `agent_admin_menu`
--
ALTER TABLE `agent_admin_menu`
  ADD PRIMARY KEY (`id`) USING BTREE,
  ADD KEY `index_url` (`url`) USING BTREE;

--
-- 表的索引 `agent_admin_role`
--
ALTER TABLE `agent_admin_role`
  ADD PRIMARY KEY (`id`) USING BTREE;

--
-- 表的索引 `agent_admin_user`
--
ALTER TABLE `agent_admin_user`
  ADD PRIMARY KEY (`id`) USING BTREE,
  ADD UNIQUE KEY `username` (`username`) USING BTREE,
  ADD UNIQUE KEY `invitation` (`invitecode`) USING BTREE;

--
-- 表的索引 `agent_agent_count`
--
ALTER TABLE `agent_agent_count`
  ADD PRIMARY KEY (`id`) USING BTREE;

--
-- 表的索引 `agent_agent_money`
--
ALTER TABLE `agent_agent_money`
  ADD PRIMARY KEY (`id`) USING BTREE;

--
-- 表的索引 `agent_agent_type`
--
ALTER TABLE `agent_agent_type`
  ADD PRIMARY KEY (`id`) USING BTREE;

--
-- 表的索引 `agent_attachment`
--
ALTER TABLE `agent_attachment`
  ADD PRIMARY KEY (`id`) USING BTREE;

--
-- 表的索引 `agent_game_gm`
--
ALTER TABLE `agent_game_gm`
  ADD PRIMARY KEY (`id`) USING BTREE;

--
-- 表的索引 `agent_gm_log`
--
ALTER TABLE `agent_gm_log`
  ADD PRIMARY KEY (`id`);

--
-- 表的索引 `agent_migrations`
--
ALTER TABLE `agent_migrations`
  ADD PRIMARY KEY (`version`) USING BTREE;

--
-- 表的索引 `agent_push_balance`
--
ALTER TABLE `agent_push_balance`
  ADD PRIMARY KEY (`id`) USING BTREE;

--
-- 表的索引 `agent_setting`
--
ALTER TABLE `agent_setting`
  ADD PRIMARY KEY (`id`) USING BTREE;

--
-- 表的索引 `agent_setting_group`
--
ALTER TABLE `agent_setting_group`
  ADD PRIMARY KEY (`id`) USING BTREE;

--
-- 表的索引 `charge_record`
--
ALTER TABLE `charge_record`
  ADD UNIQUE KEY `orderid` (`orderid`) USING BTREE;

--
-- 表的索引 `dhxy_comment`
--
ALTER TABLE `dhxy_comment`
  ADD PRIMARY KEY (`serverId`);

--
-- 表的索引 `dhxy_horse`
--
ALTER TABLE `dhxy_horse`
  ADD PRIMARY KEY (`role_id`,`position`);

--
-- 表的索引 `dhxy_horse_skill`
--
ALTER TABLE `dhxy_horse_skill`
  ADD PRIMARY KEY (`role_id`,`position`);

--
-- 表的索引 `ip_frozen`
--
ALTER TABLE `ip_frozen`
  ADD PRIMARY KEY (`frozen_id`,`frozen_ip`);

--
-- 表的索引 `mac_frozen`
--
ALTER TABLE `mac_frozen`
  ADD PRIMARY KEY (`frozenid`);

--
-- 表的索引 `qy_account`
--
ALTER TABLE `qy_account`
  ADD PRIMARY KEY (`accountid`,`account`);

--
-- 表的索引 `qy_agent`
--
ALTER TABLE `qy_agent`
  ADD PRIMARY KEY (`id`) USING BTREE,
  ADD KEY `is_auth` (`is_auth`,`p_id`) USING BTREE;

--
-- 表的索引 `qy_bang`
--
ALTER TABLE `qy_bang`
  ADD PRIMARY KEY (`bangid`);

--
-- 表的索引 `qy_bang2`
--
ALTER TABLE `qy_bang2`
  ADD PRIMARY KEY (`bangid`);

--
-- 表的索引 `qy_bangzhan`
--
ALTER TABLE `qy_bangzhan`
  ADD PRIMARY KEY (`day`,`bangid`);

--
-- 表的索引 `qy_child`
--
ALTER TABLE `qy_child`
  ADD PRIMARY KEY (`id`);

--
-- 表的索引 `qy_data`
--
ALTER TABLE `qy_data`
  ADD PRIMARY KEY (`id`);

--
-- 表的索引 `qy_equip`
--
ALTER TABLE `qy_equip`
  ADD PRIMARY KEY (`EquipID`,`RoleID`);

--
-- 表的索引 `qy_equip_back`
--
ALTER TABLE `qy_equip_back`
  ADD PRIMARY KEY (`EquipID`);

--
-- 表的索引 `qy_friends`
--
ALTER TABLE `qy_friends`
  ADD PRIMARY KEY (`id`);

--
-- 表的索引 `qy_info`
--
ALTER TABLE `qy_info`
  ADD PRIMARY KEY (`id`);

--
-- 表的索引 `qy_marry`
--
ALTER TABLE `qy_marry`
  ADD PRIMARY KEY (`id`),
  ADD KEY `roleid1` (`roleid1`,`roleid2`,`status`) USING BTREE;

--
-- 表的索引 `qy_pet`
--
ALTER TABLE `qy_pet`
  ADD PRIMARY KEY (`petid`);

--
-- 表的索引 `qy_question`
--
ALTER TABLE `qy_question`
  ADD PRIMARY KEY (`id`);

--
-- 表的索引 `qy_relation`
--
ALTER TABLE `qy_relation`
  ADD PRIMARY KEY (`relationId`);

--
-- 表的索引 `qy_relation_back`
--
ALTER TABLE `qy_relation_back`
  ADD PRIMARY KEY (`relationId`);

--
-- 表的索引 `qy_role`
--
ALTER TABLE `qy_role`
  ADD PRIMARY KEY (`roleid`,`accountid`);

--
-- 表的索引 `qy_scheme`
--
ALTER TABLE `qy_scheme`
  ADD PRIMARY KEY (`schemeId`);

--
-- 表的索引 `qy_scheme_back`
--
ALTER TABLE `qy_scheme_back`
  ADD PRIMARY KEY (`schemeId`,`roleId`);

--
-- 表的索引 `qy_tiance`
--
ALTER TABLE `qy_tiance`
  ADD PRIMARY KEY (`id`),
  ADD KEY `roleid` (`roleid`,`state`);

--
-- 表的索引 `qy_update`
--
ALTER TABLE `qy_update`
  ADD PRIMARY KEY (`id`);

--
-- 表的索引 `shop_goods`
--
ALTER TABLE `shop_goods`
  ADD PRIMARY KEY (`nID`);

--
-- 在导出的表使用AUTO_INCREMENT
--

--
-- 使用表AUTO_INCREMENT `agent_admin_log`
--
ALTER TABLE `agent_admin_log`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=30899;

--
-- 使用表AUTO_INCREMENT `agent_admin_log_data`
--
ALTER TABLE `agent_admin_log_data`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=30899;

--
-- 使用表AUTO_INCREMENT `agent_admin_menu`
--
ALTER TABLE `agent_admin_menu`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=95;

--
-- 使用表AUTO_INCREMENT `agent_admin_role`
--
ALTER TABLE `agent_admin_role`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- 使用表AUTO_INCREMENT `agent_admin_user`
--
ALTER TABLE `agent_admin_user`
  MODIFY `id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=646;

--
-- 使用表AUTO_INCREMENT `agent_agent_count`
--
ALTER TABLE `agent_agent_count`
  MODIFY `id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28931;

--
-- 使用表AUTO_INCREMENT `agent_agent_money`
--
ALTER TABLE `agent_agent_money`
  MODIFY `id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2940;

--
-- 使用表AUTO_INCREMENT `agent_agent_type`
--
ALTER TABLE `agent_agent_type`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- 使用表AUTO_INCREMENT `agent_attachment`
--
ALTER TABLE `agent_attachment`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- 使用表AUTO_INCREMENT `agent_game_gm`
--
ALTER TABLE `agent_game_gm`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1492;

--
-- 使用表AUTO_INCREMENT `agent_gm_log`
--
ALTER TABLE `agent_gm_log`
  MODIFY `id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=887;

--
-- 使用表AUTO_INCREMENT `agent_push_balance`
--
ALTER TABLE `agent_push_balance`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=70;

--
-- 使用表AUTO_INCREMENT `agent_setting`
--
ALTER TABLE `agent_setting`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- 使用表AUTO_INCREMENT `agent_setting_group`
--
ALTER TABLE `agent_setting_group`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- 使用表AUTO_INCREMENT `ip_frozen`
--
ALTER TABLE `ip_frozen`
  MODIFY `frozen_id` int(10) NOT NULL AUTO_INCREMENT;

--
-- 使用表AUTO_INCREMENT `mac_frozen`
--
ALTER TABLE `mac_frozen`
  MODIFY `frozenid` int(10) NOT NULL AUTO_INCREMENT COMMENT '封禁索引';

--
-- 使用表AUTO_INCREMENT `qy_account`
--
ALTER TABLE `qy_account`
  MODIFY `accountid` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=46221;

--
-- 使用表AUTO_INCREMENT `qy_agent`
--
ALTER TABLE `qy_agent`
  MODIFY `id` int(10) NOT NULL AUTO_INCREMENT COMMENT '递增id';

--
-- 使用表AUTO_INCREMENT `qy_bang`
--
ALTER TABLE `qy_bang`
  MODIFY `bangid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=729;

--
-- 使用表AUTO_INCREMENT `qy_bang2`
--
ALTER TABLE `qy_bang2`
  MODIFY `bangid` int(11) NOT NULL AUTO_INCREMENT;

--
-- 使用表AUTO_INCREMENT `qy_child`
--
ALTER TABLE `qy_child`
  MODIFY `id` int(10) NOT NULL AUTO_INCREMENT;

--
-- 使用表AUTO_INCREMENT `qy_data`
--
ALTER TABLE `qy_data`
  MODIFY `id` int(10) NOT NULL AUTO_INCREMENT;

--
-- 使用表AUTO_INCREMENT `qy_equip`
--
ALTER TABLE `qy_equip`
  MODIFY `EquipID` int(10) NOT NULL AUTO_INCREMENT COMMENT '装备ID', AUTO_INCREMENT=17688336;

--
-- 使用表AUTO_INCREMENT `qy_equip_back`
--
ALTER TABLE `qy_equip_back`
  MODIFY `EquipID` int(10) NOT NULL AUTO_INCREMENT;

--
-- 使用表AUTO_INCREMENT `qy_friends`
--
ALTER TABLE `qy_friends`
  MODIFY `id` int(10) NOT NULL AUTO_INCREMENT;

--
-- 使用表AUTO_INCREMENT `qy_marry`
--
ALTER TABLE `qy_marry`
  MODIFY `id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1922;

--
-- 使用表AUTO_INCREMENT `qy_pet`
--
ALTER TABLE `qy_pet`
  MODIFY `petid` int(11) NOT NULL AUTO_INCREMENT COMMENT '召唤兽索引', AUTO_INCREMENT=112282;

--
-- 使用表AUTO_INCREMENT `qy_question`
--
ALTER TABLE `qy_question`
  MODIFY `id` int(10) NOT NULL AUTO_INCREMENT;

--
-- 使用表AUTO_INCREMENT `qy_relation`
--
ALTER TABLE `qy_relation`
  MODIFY `relationId` int(11) NOT NULL AUTO_INCREMENT COMMENT '关系id', AUTO_INCREMENT=12;

--
-- 使用表AUTO_INCREMENT `qy_role`
--
ALTER TABLE `qy_role`
  MODIFY `roleid` int(11) NOT NULL AUTO_INCREMENT COMMENT '唯一id', AUTO_INCREMENT=48330;

--
-- 使用表AUTO_INCREMENT `qy_scheme`
--
ALTER TABLE `qy_scheme`
  MODIFY `schemeId` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=71773;

--
-- 使用表AUTO_INCREMENT `qy_tiance`
--
ALTER TABLE `qy_tiance`
  MODIFY `id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=61532;

--
-- 使用表AUTO_INCREMENT `qy_update`
--
ALTER TABLE `qy_update`
  MODIFY `id` int(10) NOT NULL AUTO_INCREMENT;

--
-- 使用表AUTO_INCREMENT `shop_goods`
--
ALTER TABLE `shop_goods`
  MODIFY `nID` int(11) NOT NULL AUTO_INCREMENT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
