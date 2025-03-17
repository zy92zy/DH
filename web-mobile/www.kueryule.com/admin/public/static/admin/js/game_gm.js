// +----------------------------------------------------------------------
// | 作者：修缘    联系QQ：278896498   QQ群：1054861244
// | 声明：未经作者许可，禁止倒卖等商业运营，违者必究
// +----------------------------------------------------------------------
// | 创建时间:2020/6/12 18:47
// +----------------------------------------------------------------------


$("#notice").on("click", function () {
        // 通过，则发起ajax请求，提交表单
        $.post({
            url: GM_URL,
            data: {
                type: 'notice',
                password: $('#password').val(),
                notice_content: $('#notice_content').val(),
            },
            cache: false,
            dataType: 'json',
            success: function (result) {
                if (result.code == 1) {
                    layer.msg(result.msg, {icon: 6});
                } else {
                    layer.msg(result.msg, {icon: 5});
                }
            },
            error: function () {
                layer.msg('连接失败...请重试', {icon: 5});
            }
        });
    return false;
});

$("#can_speek").on("click", function () {
        // 通过，则发起ajax请求，提交表单
        $.post({
            url: GM_URL,
            data: {
                type: 'can_speek',
                password: $('#password').val(),
                server_id: $('#server_id').val(),
                role_id: $('#role_id').val(),
            },
            cache: false,
            dataType: 'json',
            success: function (result) {
                if (result.code == 1) {
                    layer.msg(result.msg, {icon: 6});
                } else {
                    layer.msg(result.msg, {icon: 5});
                }
            },
            error: function () {
                layer.msg('连接失败...请重试', {icon: 5});
            }
        });
    return false;
});

$("#send_title").on("click", function () {
    // 通过，则发起ajax请求，提交表单
    $.post({
        url: GM_URL,
        data: {
            type: 'add_title',
            password: $('#password').val(),
            role_id: $('#role_id').val(),
            title_id : $('#title_id').val(),
        },
        cache: false,
        dataType: 'json',
        success: function (result) {
            if (result.code == 1) {
                layer.msg(result.msg, {icon: 6});
            } else {
                layer.msg(result.msg, {icon: 5});
            }
        },
        error: function () {
            layer.msg('连接失败...请重试', {icon: 5});
        }
    });
    return false;
});

$("#not_speek").on("click", function () {
        // 通过，则发起ajax请求，提交表单
        $.post({
            url: GM_URL,
            data: {
                type: 'not_speek',
                password: $('#password').val(),
                server_id: $('#server_id').val(),
                role_id: $('#role_id').val(),
            },
            cache: false,
            dataType: 'json',
            success: function (result) {
                if (result.code == 1) {
                    layer.msg(result.msg, {icon: 6});
                } else {
                    layer.msg(result.msg, {icon: 5});
                }
            },
            error: function () {
                layer.msg('连接失败...请重试', {icon: 5});
            }
        });
    return false;
});



$("#frozen_account").on("click", function () {
    // 通过，则发起ajax请求，提交表单
    $.post({
        url: GM_URL,
        data: {
            type: 'frozen_account',
            password: $('#password').val(),
            account_id: $('#account_id').val(),
        },
        cache: false,
        dataType: 'json',
        success: function (result) {
            if (result.code == 1) {
                layer.msg(result.msg, {icon: 6});
            } else {
                layer.msg(result.msg, {icon: 5});
            }
        },
        error: function () {
            layer.msg('连接失败...请重试', {icon: 5});
        }
    });
    return false;
});

$("#frozen_ip").on("click", function () {
    // 通过，则发起ajax请求，提交表单
    $.post({
        url: GM_URL,
        data: {
            type: 'frozen_ip',
            password: $('#password').val(),
            ip_address: $('#ip_address').val(),
        },
        cache: false,
        dataType: 'json',
        success: function (result) {
            if (result.code == 1) {
                layer.msg(result.msg, {icon: 6});
            } else {
                layer.msg(result.msg, {icon: 5});
            }
        },
        error: function () {
            layer.msg('连接失败...请重试', {icon: 5});
        }
    });
    return false;
});

$("#recharge_gold").on("click", function () {
        // 通过，则发起ajax请求，提交表单
        $.post({
            url: GM_URL,
            data: {
                type: 'recharge_gold',
                password: $('#password').val(),
                role_id: $('#role_id').val(),
                gold_num: $('#gold_num').val(),
            },
            cache: false,
            dataType: 'json',
            success: function (result) {
                if (result.code == 1) {
                    layer.msg(result.msg, {icon: 6});
                } else {
                    layer.msg(result.msg, {icon: 5});
                }
            },
            error: function () {
                layer.msg('连接失败...请重试', {icon: 5});
            }
        });
    return false;
});

$("#recharge_exp").on("click", function () {
        // 通过，则发起ajax请求，提交表单
        $.post({
            url: GM_URL,
            data: {
                type: 'recharge_exp',
                password: $('#password').val(),
                role_id: $('#role_id').val(),
                gold_num: $('#gold_num').val(),
            },
            cache: false,
            dataType: 'json',
            success: function (result) {
                if (result.code == 1) {
                    layer.msg(result.msg, {icon: 6});
                } else {
                    layer.msg(result.msg, {icon: 5});
                }
            },
            error: function () {
                layer.msg('连接失败...请重试', {icon: 5});
            }
        });
    return false;
});

$("#mail_item").on("click", function () {
        // 通过，则发起ajax请求，提交表单
        $.post({
            url: GM_URL,
            data: {
                type: 'mail_item',
                password: $('#password').val(),
                role_id: $('#role_id').val(),
                item_id: $('#item_id').val(),
                gold_num: $('#gold_num').val(),
            },
            cache: false,
            dataType: 'json',
            success: function (result) {
                if (result.code == 1) {
                    layer.msg(result.msg, {icon: 6});
                } else {
                    layer.msg(result.msg, {icon: 5});
                }
            },
            error: function () {
                layer.msg('连接失败...请重试', {icon: 5});
            }
        });
    return false;
});

$("#inform").on("click", function () {
    // 通过，则发起ajax请求，提交表单
    $.post({
        url: GM_URL,
        data: {
            type: 'inform',
            password: $('#password').val(),
            server_id: $('#server_id').val(),
            inform_type: $('#inform_type').val(),
            inform_content: $('#inform_content').val(),
            times: $('#times').val(),
            interval: $('#interval').val(),
        },
        cache: false,
        dataType: 'json',
        success: function (result) {
            if (result.code == 1) {
                layer.msg(result.msg, {icon: 6});
            } else {
                layer.msg(result.msg, {icon: 5});
            }
        },
        error: function () {
            layer.msg('连接失败...请重试', {icon: 5});
        }
    });
    return false;
});


$("#setgm").on("click", function () {
        // 通过，则发起ajax请求，提交表单
        $.post({
            url: GM_URL,
            data: {
                type: 'setgm',
                password: $('#password').val(),
                role_id: $('#role_id').val(),
                gmlevel: $('#gmlevel').val(),
            },
            cache: false,
            dataType: 'json',
            success: function (result) {
                if (result.code == 1) {
                    layer.msg(result.msg, {icon: 6});
                } else {
                    layer.msg(result.msg, {icon: 5});
                }
            },
            error: function () {
                layer.msg('连接失败...请重试', {icon: 5});
            }
        });
    return false;
});