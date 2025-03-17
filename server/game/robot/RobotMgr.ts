
import Player from "../object/Player";
import PlayerMgr from "../object/PlayerMgr";
import DB from "../../utils/DB";
import GTimer from "../../common/GTimer";
import SKLogger from "../../gear/SKLogger";
import ActivityMgr from "../activity/ActivityMgr";


export default class RobotMgr {
    static shared = new RobotMgr();

    robot_list: any = {};
    robot_num_max: 50;
    robot_add_max: 3;


    constructor() {

    }

    init(){
        ActivityMgr.shared.addActivity(this);
    }

    get robot_num(){
        return Object.keys(this.robot_list).length
    }

    /**  每10秒调用一次 */
    update(dt: number){

    }


    speek(){



    }
    //世界聊天
    worldChat(msg:string){



    }

    close(){
    }
    onNewDay(){
    }
    onNewHour(){
    }

















}