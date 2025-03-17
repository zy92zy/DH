import MapModel from "./MapModel";
import NpcMgr from "./NpcMgr";
import BattleObj from "../object/BattleObj";
import SKDataUtil from "../../gear/SKDataUtil";
import SKLogger from "../../gear/SKLogger";
import BangZhan from "../bang/BangZhan";
import BangZhanInfo from "../bang/BangZhanInfo";

export default class MapMgr {

	static shared = new MapMgr();

	map_list: any;
	bang_map_list: any;
	bangzhan_map_list: any;
	home_map_list: any;

	constructor() {
		this.map_list = [];
		this.bang_map_list = {};
		this.home_map_list = {};
		this.bangzhan_map_list = {};
	}

	addMap(map: MapModel) {
		this.map_list[map.map_id] = map;
	}

	getBangzhanMap(bangid: any): MapModel {
		let info: BangZhanInfo = BangZhan.shared.getInfo(bangid);
		if (this.bangzhan_map_list[info.map]) {
			return this.bangzhan_map_list[info.map];
		}
		else {
			let propMap = require('../../conf/prop_data/map_json/3001');
			if (propMap) {
				let pMap = new MapModel();
				pMap.map_id = info.map;
				pMap.map_name = '帮战';
				// 这里扩展map信息
				pMap.setMapData(propMap);
				this.bangzhan_map_list[info.map] = pMap;
				NpcMgr.shared.InitNpcByMapId(3001, info.map);
				return pMap;
			}
		}
		return null;
	}
	getBangzhanMap2(nFuBenID: any): MapModel {
		if (this.bangzhan_map_list[nFuBenID]) {
			return this.bangzhan_map_list[nFuBenID];
		}
		else {
			let propMap = require('../../conf/prop_data/map_json/3001');
			if (propMap) {
				let pMap = new MapModel();
				pMap.map_id = 3001;
				pMap.map_name = '帮战';
				// 这里扩展map信息
				pMap.setMapData(propMap);
				this.bangzhan_map_list[nFuBenID] = pMap;
				NpcMgr.shared.InitNpcByMapId(3001, nFuBenID);
				return pMap;
			}
		}
		return null;
	}

	clearBangzhanMap(){
		this.bangzhan_map_list = {};

	}

	getBangMap(bangid: any): MapModel {
		if (this.bang_map_list[bangid]) {
			return this.bang_map_list[bangid];
		}
		else {
			let propMap = require('../../conf/prop_data/map_json/3002');
			if (propMap) {
				let pMap = new MapModel();
				pMap.map_id = bangid;
				pMap.map_name = '帮派';
				// 这里扩展map信息
				pMap.setMapData(propMap);
				this.bang_map_list[bangid] = pMap;
				NpcMgr.shared.InitNpcByMapId(3002, bangid);
				return pMap;
			}
		}
		return null;
	}

	getHomeMap(onlyid: any): any {
		if (this.home_map_list[onlyid]) {
			return this.home_map_list[onlyid];
		}
		else {
			let propMap = require('../../conf/prop_data/map_json/4001');
			if (propMap) {
				let pMap = new MapModel();
				pMap.map_id = onlyid;
				pMap.map_name = '家';
				// 这里扩展map信息
				pMap.setMapData(propMap);
				this.home_map_list[onlyid] = pMap;
				return pMap;
			}
		}
		return null;
	}

	getMap(obj: BattleObj): MapModel {

		if (obj.mapid == 3001) {
			if (obj.isNpc()) {
				return this.getBangzhanMap2(obj.nFuBenID);
			} else {
				return this.getBangzhanMap(obj.bangid);
			}
		}if (obj.mapid == 3002) {
			if (obj.isNpc()) {
				return this.getBangMap(obj.nFuBenID);
			} else {
				return this.getBangMap(obj.bangid);
			}
		} else if (obj.mapid == 4001) {
			if (!obj.isNpc()) {
				return this.getHomeMap(obj.onlyid);
			} else {
				return null;
			}
		} else {
			let result = this.map_list[obj.mapid];
			if (result == null) {
				SKLogger.warn(`未配置的地图[${obj.mapid}:${obj.name}]`);
			}
			return result;
		}
	}

	getMapById(mapId: any): MapModel {
		return this.map_list[mapId];
	}

	init() {
		let maplist = require("../../conf/prop_data/prop_map");
		for (let mapid in maplist) {
			if (maplist.hasOwnProperty(mapid)) {
				let mapinfo = maplist[mapid];
				let propMap = require('../../conf/prop_data/map_json/' + mapinfo.mapid);
				if (propMap) {
					let pMap = new MapModel();
					pMap.map_id = mapid;
					pMap.map_name = mapinfo.map_name;
					// 这里扩展map信息
					propMap.anlei = SKDataUtil.jsonBy(mapinfo.anlei);
					pMap.setMapData(propMap);
					this.addMap(pMap);
				}
			}
		}
	}
}