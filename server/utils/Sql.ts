import SKDBUtil from "../gear/SKDBUtil";
import SKDataUtil from "../gear/SKDataUtil";
import GameUtil from "../game/core/GameUtil";
import SKLogger from "../gear/SKLogger";


export default class Sql {
    /**
     * 角色表字段
     */
    static role: any = {
        safecode: ``,
        roleid: 0,
        accountid: 0,
        serverid: 1000,
        name: "",
        resid: 0,
        race: 0,
        sex: 0,
        relive: 0,
        relivelist: `{}`,
        level: 1,
        level_reward: "",
        exp: 0,
        day_count: `{}`,
        chargesum: 0,
        money: 0,
        jade: 0,
        mapid: 1010,
        x: -1,
        y: -1,
        bangid: 0,
        color: `{}`,
        star: 0,
        shane: 0,
        addpoint: '{}',
        xiupoint: '{}',
        xiulevel: 0,
        title: `[]`,
        skill: `{}`,
        bagitem: `{}`,
        lockeritem: `{}`,
        partner: `{}`,
        pet: 0,
        getpet: 0,
        equiplist: `{}`,
        taskstate: '[]',
        partnerlist: `{}`,
        rewardrecord: 0,
        getgift: '{"day":1,"time":0}',
        shuilu: `{}`,
        active_scheme_name: "套装方案",
        friendlist: `{}`,
        create_time: ``,
        lastonline: ``,
        gmlevel: 0,
        state: 0,
        mountid: 0,
        horse_index: 0,
        marryid: 0,
        skins: '{"use":[0,0,0,0,0,0], "has":[] }',
    };

    /**
     * 序列化一个role对象
     */
    static getrole(data: any,source?: any){
        let role = source || SKDataUtil.clone(Sql.role);
        if(data == null){
            return role;
        }
        for(let k in data){
            if(data[k])
                role[k] = data[k];
        }
        if(role.create_time == ``){
            role.create_time = SKDBUtil.toString(new Date(GameUtil.gameTime));
        }
        return role;
    }
    /**
     * 装备字段
     */
    static equip: any = {
        EquipID: 0,
        EquipType: 0,
        RoleID: 0,
        BaseAttr: `{}`,
        Grade: 0,
        EIndex: 0,
        Shuxingxuqiu: `{}`,
        Type: 0,
        GemCnt: 0,
        LianhuaAttr: `{}`,
        refine: `{}`,
        recast: `{}`,
        create_time: ``,
        delete_time: ``,
        state: 1,
        name: ``,
        pos: 0,
    }

    /**
     * 序列化一个装备对象
     */
    static getequip(data: any,source?: any){
        let equip = source || SKDataUtil.clone(Sql.equip);
        if(data == null){
            return equip;
        }
        for(let k in data){
            equip[k] = data[k];
        }
        if(equip.create_time == ``){
            equip.create_time = SKDBUtil.toString(new Date(GameUtil.gameTime));
        }
        return equip; 
    }

    /**
     * 坐骑字段
     */
    static horse: any = {
        role_id: 0,
        position: 0,
        name: ``,
        level: 0,
        exp: 0,
    }

    /**
     * 序列化一个坐骑对象
     */
     static gethorse(data: any){
        let horse = SKDataUtil.clone(Sql.horse);
        if(data == null){
            return horse;
        }
        for(let k in data){
            if(horse[k] == undefined){
                continue;
            }
            horse[k] = data[k];
        }
        return horse; 
    }

    /**
     * 坐骑技能字段
     */
    static horseSkill: any = {
        role_id: 0,
        position: 0,
        skill_id:0,
        exp: 0,
    }

    /**
     * 序列化一个坐骑技能对象
     */
     static gethorseSkill(data: any){
        let horseSkill = SKDataUtil.clone(Sql.horseSkill);
        if(data == null){
            return horseSkill;
        }
        for(let k in data){
            if(horseSkill[k] == undefined){
                continue;
            }
            horseSkill[k] = data[k];
        }
        return horseSkill; 
    }

    /**
     * 宠物字段
     */
    static pet: any = {
        petid: 0,
        roleid: 0,
        name: ``,
        dataid: 0,
        relive: 0,
        level: 0,
        resid: 0,
        color: 0,
        grade: 0,
        fly: 0,
        qinmi: 0,
        locks: 0,
        shenskill: 0,
        skill: `{}`,
        ppoint: `{}`,
        dpoint: `{}`,
        rate: 0,
        hp: 0,
        mp: 0,
        atk: 0,
        spd: 0,
        wuxing: `{}`,
        exp: 0,
        xexp: 0,
        xlevel: 0,
        longgu: 0,
        control: 0,
        create_time: ``,
        delete_time: ``,
        state: 1,
    }

    /**
     * 序列化一个宠物对象
     */
    static getpet(data: any,source?: any){
            let pet = source || SKDataUtil.clone(Sql.pet);
            if(data == null){
                return pet;
            }
            for(let k in data){
                pet[k] = data[k];
            }
            if(pet.create_time == ``){
                pet.create_time = SKDBUtil.toString(new Date(GameUtil.gameTime));
            }
            return pet; 
    }

    /**
     * 好友关系字段
     */
    static friend: any = {
        id: 0,
        roleidA: 0,
        nameA: ``,
        residA: 0,
        reliveA: 0,
        levelA: 0,
        raceA: 0,
        sexA: 0,
        accountidA: 0,
        roleidB: 0,
        nameB: ``,
        residB: 0,
        reliveB: 0,
        levelB: 0,
        raceB: 0,
        sexB: 0,
        accountidB: 0,
        state: 1,
        time: `${SKDBUtil.toString(new Date(GameUtil.gameTime))}`,
    }

    /**
     * 序列化一个好友关系对象
     */
    static getfriend(id: any,roleA: any, roleB: any,data?: any){
        let friend = SKDataUtil.clone(Sql.friend);
        friend.id = id;
        if(roleA){
            friend.roleidA = roleA.roleid || 0;
            friend.nameA = roleA.name || ``;
            friend.residA = roleA.resid || 0;
            friend.reliveA = roleA.relive || 0;
            friend.levelA = roleA.level || 0;
            friend.raceA = roleA.race || 0;
            friend.sexA = roleA.sex || 0;
            friend.accountidA = roleA.accountid || 0;
        }
        if(roleB){
            friend.roleidB = roleB.roleid || 0;
            friend.nameB = roleB.name || ``;
            friend.residB = roleB.resid || 0;
            friend.reliveB = roleB.relive || 0;
            friend.levelB = roleB.level || 0;
            friend.raceB = roleB.race || 0;
            friend.sexB = roleB.sex || 0;
            friend.accountidB = roleB.accountid || 0;
        }
        if(data){
            for(let k in data){
                if(friend[k] == undefined){
                    continue;
                }
                friend[k] = data[k];
            }
        }

        return friend;
    }

    /**
     * 帮派字段
     */
    static bang: any = {
        bangid: 0,
        name: ``,
        aim: ``,
        rolenum: 0,
        masterid: 0,
        mastername: ``,
        createtime: ``,
        state: 1,
        serverid: 0,
        bidding: 0,
    }

    /**
     * 序列化一个帮派对象
     */
    static getbang(data: any){
        let bang = SKDataUtil.clone(Sql.bang);
        if(data == null){
            return bang;
        }
        for(let k in data){
            if(bang[k] == undefined){
                continue;
            }
            bang[k] = data[k];
        }
        if(bang.createTime == ``){
            bang.createTime = SKDBUtil.toString(new Date(GameUtil.gameTime));
        }
        return bang; 
    }

    /**
     * 结拜 夫妻等关系
     */
    static relation: any = {
        relationId: 0,
        members: ``,
        relationType: 0,
        relationName: ``,
        createTime: ``,
        status: 1,
    }

    /**
     * 序列化 结拜 夫妻等关系对象
     */
    static getrelation(data: any){
        let relation = SKDataUtil.clone(Sql.relation);
        if(data == null){
            return relation;
        }
        for(let k in data){
            if(relation[k] == undefined){
                continue;
            }
            relation[k] = data[k];
        }
        if(relation.createTime == ``){
            relation.createTime = SKDBUtil.toString(new Date(GameUtil.gameTime));
        }
        return relation; 
    }

    /**
     * 套装方案字段
     */
    static scheme: any = {
        schemeId: 0,
        schemeName: `套装方案`,
        content: `[]`,
        roleId: 0,
        status: 0,
    }

    /**
     * 序列化套装方案对象
     */
    static getscheme(data: any,source?: any){
        let scheme = source || SKDataUtil.clone(Sql.scheme);
        for(let k in data){
            if(scheme[k] != undefined)
                scheme[k] = data[k];
        }
        return scheme;
    }
}