<?php



namespace app\api\controller;

class IndexController extends Controller
{

    protected $authExcept = [
        'index'
    ];
    
    public function  __construct(){
        include_once "./wxpay.php";
        include_once "./alipay.php";
        include_once './config.php';
        
        
    }

    public function index()
    {
        
        
        
        
        
        
        return success('index');
    }

}
