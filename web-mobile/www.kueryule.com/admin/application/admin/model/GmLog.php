<?php
/**
 * 后台操作日志模型
 * @author yupoxiong<i@yufuping.com>
 */

namespace app\admin\model;

use think\model\relation\BelongsTo;
use think\model\relation\HasOne;

class GmLog extends Model
{
    protected $name = 'gm_log';

    public $softDelete = false;

    public $methodText = [
        1 => 'GET',
        2 => 'POST',
        3 => 'PUT',
        4 => 'DELETE',
    ];

    protected $autoWriteTimestamp = true;
    protected $updateTime = false;

    protected $searchField = [
        'name',
    ];

    protected $whereField = [
        'admin_user_id'
    ];

    protected $timeField = [
        'create_time'
    ];

    //关联用户
    public function adminUser(): BelongsTo
    {
        return $this->belongsTo(AdminUser::class);
        
    }

    //关联详情
    public function adminLogData(): HasOne
    {
        return $this->hasOne(AdminLogData::class);
    }

}
