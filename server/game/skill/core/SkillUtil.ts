import SKLogger from "../../../gear/SKLogger";
import SKDataUtil from "../../../gear/SKDataUtil";
import BaiRiMian from "../low/BaiRiMian";
import BeiDaoJianXing from "../low/BeiDaoJianXing";
import BingLinChengXia from "../low/BingLinChengXia";
import ChaoMingDianChe from "../low/ChaoMingDianChe";
import ChuiJinZhuanYu from "../low/ChuiJinZhuanYu";
import DianShanLeiMing from "../low/DianShanLeiMing";
import FeiLongZaiTian from "../low/FeiLongZaiTian";
import FeiLongZaiTian_Feng from "../low/FeiLongZaiTian_Feng";
import FeiLongZaiTian_Huo from "../low/FeiLongZaiTian_Huo";
import FeiLongZaiTian_Lei from "../low/FeiLongZaiTian_Lei";
import FeiLongZaiTian_Shui from "../low/FeiLongZaiTian_Shui";
import FengHuoLiaoYuan from "../low/FengHuoLiaoYuan";
import FengLeiYongDong from "../low/FengLeiYongDong";
import FenGuangHuaYing from "../low/FenGuangHuaYing";
import FengYin from "../low/FengYin";
import FenHuaFuLiu from "../low/FenHuaFuLiu";
import FenLieGongJi from "../low/FenLieGongJi";
import GeShanDaNiu from "../low/GeShanDaNiu";
import GongXingTianFa from "../low/GongXingTianFa";
import HanQingMoMo from "../low/HanQingMoMo";
import HeDingHongFen from "../low/HeDingHongFen";
import HighBeiDaoJianXing from "../high/HighBeiDaoJianXing";
import HighFenGuangHuaYing from "../high/HighFenGuangHuaYing";
import HighFenLieGongJi from "../high/HighFenLieGongJi";
import HighGeShanDaNiu from "../high/HighGeShanDaNiu";
import HighPanShan from "../high/HighPanShan";
import HighQingMianLiaoYa from "../high/HighQingMianLiaoYa";
import HighShanXian from "../high/HighShanXian";
import HighShenGongGuiLi from "../high/HighShenGongGuiLi";
import HighTianMoJieTi from "../high/HighTianMoJieTi";
import HighXiaoLouYeKu from "../high/HighXiaoLouYeKu";
import HighYuanQuanWanHu from "../high/HighYuanQuanWanHu";
import HighZhangYinDongDu from "../high/HighZhangYinDongDu";
import HuaWu from "../low/HuaWu";
import HunLuan from "../low/HunLuan";
import JiaoLongChuHai from "../low/JiaoLongChuHai";
import JieDaoShaRen from "../low/JieDaoShaRen";
import JiQiBuYi from "../low/JiQiBuYi";
import JiuLongBingFeng from "../low/JiuLongBingFeng";
import JiuYinChunHuo from "../low/JiuYinChunHuo";
import JueJingFengSheng from "../low/JueJingFengSheng";
import KuMuFengChun from "../low/KuMuFengChun";
import LieHuoJiaoYang from "../low/LieHuoJiaoYang";
import LuoRiRongJin from "../low/LuoRiRongJin";
import MengPoTang from "../low/MengPoTang";
import MiaoShouHuiChun from "../low/MiaoShouHuiChun";
import MiHunZui from "../low/MiHunZui";
import MoShenFuShen from "../low/MoShenFuShen";
import MoShenHuTi from "../low/MoShenHuTi";
import NiePan from "../low/NiePan";
import HuanYingRuFeng from "../low/HuanYingRuFeng";
import NormalAttack from "../low/NormalAttack";
import NormalDefend from "../low/NormalDefend";
import PanShan from "../low/PanShan";
import QiangHuaXuanRen from "../low/QiangHuaXuanRen";
import QiangHuaYiHuan from "../low/QiangHuaYiHuan";
import QianKunJieSu from "../low/QianKunJieSu";
import QianNvYouHun from "../low/QianNvYouHun";
import QingMianLiaoYa from "../low/QingMianLiaoYa";
import QinSiBingWu from "../low/QinSiBingWu";
import RuHuTianYi from "../low/RuHuTianYi";
import RuRenYinShui from "../low/RuRenYinShui";
import ShanXian from "../low/ShanXian";
import ShenGongGuiLi from "../low/ShenGongGuiLi";
import ShiXinFeng from "../low/ShiXinFeng";
import ShiXinKuangLuan from "../low/ShiXinKuangLuan";
import ShouWangShenLi from "../low/ShouWangShenLi";
import SiMianChuGe from "../low/SiMianChuGe";
import StealMoney from "../low/StealMoney";
import TianGangZhanQi from "../low/TianGangZhanQi";
import TianMoJieTi from "../low/TianMoJieTi";
import TianWaiFeiMo from "../low/TianWaiFeiMo";
import TianZhuDiMie from "../low/TianZhuDiMie";
import WanDuGongXin from "../low/WanDuGongXin";
import XiaoHunShiGu from "../low/XiaoHunShiGu";
import XiaoLouYeKu from "../low/XiaoLouYeKu";
import XiTianJingTu from "../low/XiTianJingTu";
import XiuLiQianKun from "../low/XiuLiQianKun";
import XiXingDaFa from "../low/XiXingDaFa";
import XuanRen from "../low/XuanRen";
import XueHaiShenChou from "../low/XueHaiShenChou";
import XueShaZhiGu from "../low/XueShaZhiGu";
import YanLuoZhuiMing from "../low/YanLuoZhuiMing";
import YiHuan from "../low/YiHuan";
import YinShen from "../low/YinShen";
import YouFengLaiYi from "../high/YouFengLaiYi";
import YouFengLaiYi_Huo from "../high/YouFengLaiYi_Huo";
import YouFengLaiYi_Jin from "../high/YouFengLaiYi_Jin";
import YouFengLaiYi_Mu from "../high/YouFengLaiYi_Mu";
import YouFengLaiYi_Shui from "../high/YouFengLaiYi_Shui";
import YouFengLaiYi_Tu from "../high/YouFengLaiYi_Tu";
import YuanQuanWanHu from "../low/YuanQuanWanHu";
import ZhangYinDongDu from "../low/ZhangYinDongDu";
import ZiXuWuYou from "../high/ZiXuWuYou";
import ZuoBiShangGuan from "../high/ZuoBiShangGuan";
import SkillBase from "./SkillBase";
import HighAoXueLingShuang from "../horse/high/HighAoXueLingShuang";
import HighBaiBuChuanYang from "../horse/high/HighBaiBuChuanYang";
import HighBaiLuHengJiang from "../horse/high/HighBaiLuHengJiang";
import HighBingHuQiuYue from "../horse/high/HighBingHuQiuYue";
import HighChiXueQingFeng from "../horse/high/HighChiXueQingFeng";
import HighChongYunPoWu from "../horse/high/HighChongYunPoWu";
import HighDouZhuanXingYi from "../horse/high/HighDouZhuanXingYi";
import HighFengJuanCanYun from "../horse/high/HighFengJuanCanYun";
import HighHouFaZhiRen from "../horse/high/HighHouFaZhiRen";
import HighHuaChenYueXi from "../horse/high/HighHuaChenYueXi";
import HighJianBiQingYe from "../horse/high/HighJianBiQingYe";
import HighJiFengZhouYu from "../horse/high/HighJiFengZhouYu";
import HighJinGeTieJia from "../horse/high/HighJinGeTieJia";
import HighJingTaoHaiLang from "../horse/high/HighJingTaoHaiLang";
import HighJinShenBuHuai from "../horse/high/HighJinShenBuHuai";
import HighKuMuPanGen from "../horse/high/HighKuMuPanGen";
import HighLanZhiHuiXin from "../horse/high/HighLanZhiHuiXin";
import HighLiLanYuanZhi from "../horse/high/HighLiLanYuanZhi";
import HighLingBoWeiBu from "../horse/high/HighLingBoWeiBu";
import HighMuAiChenChen from "../horse/high/HighMuAiChenChen";
import HighNieYingZhuiFeng from "../horse/high/HighNieYingZhuiFeng";
import HighNuJianKuangHua from "../horse/high/HighNuJianKuangHua";
import HighPiaoRanChuChen from "../horse/high/HighPiaoRanChuChen";
import HighPoFuChenZhou from "../horse/high/HighPoFuChenZhou";
import HighQiuShuiLiuXian from "../horse/high/HighQiuShuiLiuXian";
import HighQiXueZhenGe from "../horse/high/HighQiXueZhenGe";
import HighSheChongYuHui from "../horse/high/HighSheChongYuHui";
import HighShenRuTieShi from "../horse/high/HighShenRuTieShi";
import HighShenShuGuiCang from "../horse/high/HighShenShuGuiCang";
import HighShenSiPuTi from "../horse/high/HighShenSiPuTi";
import HighSiHaiNingJing from "../horse/high/HighSiHaiNingJing";
import HighTianLeiNuHuo from "../horse/high/HighTianLeiNuHuo";
import HighTianNuJingLei from "../horse/high/HighTianNuJingLei";
import HighTianShenHuTi from "../horse/high/HighTianShenHuTi";
import HighWanJieBuFu from "../horse/high/HighWanJieBuFu";
import HighXingFengZuoLang from "../horse/high/HighXingFengZuoLang";
import HighXingHuoLiaoYuan from "../horse/high/HighXingHuoLiaoYuan";
import HighXinRuZhiShui from "../horse/high/HighXinRuZhiShui";
import HighYanJiangDieZhang from "../horse/high/HighYanJiangDieZhang";
import HighZhanXinQingMing from "../horse/high/HighZhanXinQingMing";
import HighZhuiHunDuoMing from "../horse/high/HighZhuiHunDuoMing";
import AoXueLingShuang from "../horse/low/AoXueLingShuang";
import BaiBuChuanYang from "../horse/low/BaiBuChuanYang";
import BaiLuHengJiang from "../horse/low/BaiLuHengJiang";
import BingHuQiuYue from "../horse/low/BingHuQiuYue";
import ChiXueQingFeng from "../horse/low/ChiXueQingFeng";
import ChongYunPoWu from "../horse/low/ChongYunPoWu";
import DouZhuanXingYi from "../horse/low/DouZhuanXingYi";
import FengJuanCanYun from "../horse/low/FengJuanCanYun";
import HouFaZhiRen from "../horse/low/HouFaZhiRen";
import HuaChenYueXi from "../horse/low/HuaChenYueXi";
import JianBiQingYe from "../horse/low/JianBiQingYe";
import JiFengZhouYu from "../horse/low/JiFengZhouYu";
import JinGeTieJia from "../horse/low/JinGeTieJia";
import JingTaoHaiLang from "../horse/low/JingTaoHaiLang";
import JinShenBuHuai from "../horse/low/JinShenBuHuai";
import KuMuPanGen from "../horse/low/KuMuPanGen";
import LanZhiHuiXin from "../horse/low/LanZhiHuiXin";
import LiLanYuanZhi from "../horse/low/LiLanYuanZhi";
import LingBoWeiBu from "../horse/low/LingBoWeiBu";
import MuAiChenChen from "../horse/low/MuAiChenChen";
import NieYingZhuiFeng from "../horse/low/NieYingZhuiFeng";
import NuJianKuangHua from "../horse/low/NuJianKuangHua";
import PiaoRanChuChen from "../horse/low/PiaoRanChuChen";
import PoFuChenZhou from "../horse/low/PoFuChenZhou";
import QiuShuiLiuXian from "../horse/low/QiuShuiLiuXian";
import QiXueZhenGe from "../horse/low/QiXueZhenGe";
import SheChongYuHui from "../horse/low/SheChongYuHui";
import ShenRuTieShi from "../horse/low/ShenRuTieShi";
import ShenShuGuiCang from "../horse/low/ShenShuGuiCang";
import ShenSiPuTi from "../horse/low/ShenSiPuTi";
import SiHaiNingJing from "../horse/low/SiHaiNingJing";
import TianLeiNuHuo from "../horse/low/TianLeiNuHuo";
import TianNuJingLei from "../horse/low/TianNuJingLei";
import TianShenHuTi from "../horse/low/TianShenHuTi";
import WanJieBuFu from "../horse/low/WanJieBuFu";
import XingFengZuoLang from "../horse/low/XingFengZuoLang";
import XingHuoLiaoYuan from "../horse/low/XingHuoLiaoYuan";
import XinRuZhiShui from "../horse/low/XinRuZhiShui";
import YanJiangDieZhang from "../horse/low/YanJiangDieZhang";
import YunHeWuJi from "../horse/low/YunHeWuJi";
import ZhanXinQingMing from "../horse/low/ZhanXinQingMing";
import ZhuiHunDuoMing from "../horse/low/ZhuiHunDuoMing";
import HighYunHeWuJi from "../horse/high/HighYunHeWuJi";
import TouTianHuanRi1 from "../baldric/TouTianHuanRi1";
import TouTianHuanRi2 from "../baldric/TouTianHuanRi2";
import TouTianHuanRi3 from "../baldric/TouTianHuanRi3";
import PiaoMiaoRuYun1 from "../baldric/PiaoMiaoRuYun1";
import PiaoMiaoRuYun2 from "../baldric/PiaoMiaoRuYun2";
import PiaoMiaoRuYun3 from "../baldric/PiaoMiaoRuYun3";
import DangTouBangHe from "../high/DangTouBangHe";
import HuanYingRuFeng1 from "../baldric/HuanYingRuFeng1";
import HuanYingRuFeng2 from "../baldric/HuanYingRuFeng2";
import HuanYingRuFeng3 from "../baldric/HuanYingRuFeng3";
import ZhanCaoChuGen1 from "../baldric/ZhanCaoChuGen1";
import ZhanCaoChuGen2 from "../baldric/ZhanCaoChuGen2";
import ZhanCaoChuGen3 from "../baldric/ZhanCaoChuGen3";
import WuDuJuQuan1 from "../baldric/WuDuJuQuan1";
import WuDuJuQuan2 from "../baldric/WuDuJuQuan2";
import WuDuJuQuan3 from "../baldric/WuDuJuQuan3";
import WeiXinYiZhi1 from "../baldric/WeiXinYiZhi1";
import QiShiHuiSheng1 from "../baldric/QiShiHuiSheng1";
import QiShiHuiSheng2 from "../baldric/QiShiHuiSheng2";
import QiShiHuiSheng3 from "../baldric/QiShiHuiSheng3";
import WeiXinYiZhi2 from "../baldric/WeiXinYiZhi2";
import WeiXinYiZhi3 from "../baldric/WeiXinYiZhi3";
import WanGuTongBei1 from "../baldric/WanGuTongBei1";
import WanGuTongBei2 from "../baldric/WanGuTongBei2";
import WanGuTongBei3 from "../baldric/WanGuTongBei3";
import { EActionOn, EActionType, EMagicType, ESkillType } from "../../role/EEnum";
import LiSheDaChuan from "../low/LiSheDaChuan";
import AnXingJiDou from "../low/AnXingJiDou";
import AnYingLiHun from "../low/AnYingLiHun";
import AnZhiJiangLin from "../low/AnZhiJiangLin";
import FeiZhuJianYu from "../low/FeiZhuJianYu";
import HenYuFeiFei from "../low/HenYuFeiFei";
import LiuShiChiLie from "../low/LiuShiChiLie";
import LuoZhiYunYan from "../low/LuoZhiYunYan";
import MuRuQingFeng from "../low/MuRuQingFeng";


//龙族
import LingXuYuFeng from "../low/LingXuYuFeng";
import FeiJuJiuTian from "../high/FeiJuJiuTian";
import FengLeiWanYun from "../low/FengLeiWanYun";
import ZhenTianDongDi from "../high/ZhenTianDongDi";
import FeiRanMoYu from "../low/FeiRanMoYu";
import ZeBeiWanWu from "../high/ZeBeiWanWu";
import BaiLangTaoTian from "../low/BaiLangTaoTian";
import CangHaiHengLiu from "../high/CangHaiHengLiu";
import NiLin from "../low/NiLin";
import AnShiRuChang1 from "../baldric/AnShiRuChang1";
import AnShiRuChang2 from "../baldric/AnShiRuChang2";
import AnShiRuChang3 from "../baldric/AnShiRuChang3";
import JingPiLiJie1 from "../baldric/JingPiLiJie1";
import JingPiLiJie2 from "../baldric/JingPiLiJie2";
import JingPiLiJie3 from "../baldric/JingPiLiJie3";
import ZhenJiEff from "../baldric/ZhenJiEff";
import GongWuBuKe1 from "../baldric/GongWuBuKe1";
import GongWuBuKe2 from "../baldric/GongWuBuKe2";
import GongWuBuKe3 from "../baldric/GongWuBuKe3";
import WanGuChangCun1 from "../baldric/WanGuChangCun1";
import WanGuChangCun2 from "../baldric/WanGuChangCun2";
import WanGuChangCun3 from "../baldric/WanGuChangCun3";
import BattleRole from "@/game/battle/BattleRole";
import YouYing1 from "../baldric/YouYing1";
import YouYing2 from "../baldric/YouYing2";
import YouYing3 from "../baldric/YouYing3";


export default class SkillUtil {

    // BUFF名称
    static magicName: any;
    // 技能列表
    static skillList: any;
    // 坐骑技能技能
    static horseSkillMap: any;
    // 坐骑技能组
    static horseSkillGroup: any = [
        // 1 冲云破雾,泣血枕戈,怒剑狂花,破釜沉舟,金戈铁甲,坚壁清野
        [
            ESkillType.HighChongYunPoWu, ESkillType.HighQiXueZhenGe, ESkillType.HighNuJianKuangHua,
            ESkillType.HighPoFuChenZhou, ESkillType.HighJinGeTieJia, ESkillType.HighJianBiQingYe,
            ESkillType.ChongYunPoWu, ESkillType.QiXueZhenGe, ESkillType.NuJianKuangHua,
            ESkillType.PoFuChenZhou, ESkillType.JinGeTieJia, ESkillType.JianBiQingYe
        ],
        // 2 赤血青锋,疾风骤雨,怒剑狂花,破釜沉舟,后发制人,百步穿杨,神枢鬼藏,坚壁清野
        [
            ESkillType.HighChiXueQingFeng, ESkillType.HighJiFengZhouYu, ESkillType.HighNuJianKuangHua,
            ESkillType.HighPoFuChenZhou, ESkillType.HighHouFaZhiRen, ESkillType.HighBaiBuChuanYang,
            ESkillType.HighShenShuGuiCang, ESkillType.HighJianBiQingYe,
            ESkillType.ChiXueQingFeng, ESkillType.JiFengZhouYu, ESkillType.NuJianKuangHua,
            ESkillType.PoFuChenZhou, ESkillType.HouFaZhiRen, ESkillType.BaiBuChuanYang,
            ESkillType.ShenShuGuiCang, ESkillType.JianBiQingYe
        ],
        // 3 赤血青锋,怒剑狂花,秋水流弦,破釜沉舟,追魂夺命,神枢鬼藏,金戈铁甲,坚壁清野,战心清明,折冲御晦
        [
            ESkillType.HighChiXueQingFeng, ESkillType.HighNuJianKuangHua, ESkillType.HighQiuShuiLiuXian,
            ESkillType.HighPoFuChenZhou, ESkillType.HighZhuiHunDuoMing, ESkillType.HighShenShuGuiCang,
            ESkillType.HighJinGeTieJia, ESkillType.HighJianBiQingYe, ESkillType.HighZhanXinQingMing,
            ESkillType.HighSheChongYuHui,
            ESkillType.ChiXueQingFeng, ESkillType.NuJianKuangHua, ESkillType.QiuShuiLiuXian,
            ESkillType.PoFuChenZhou, ESkillType.ZhuiHunDuoMing, ESkillType.ShenShuGuiCang,
            ESkillType.JinGeTieJia, ESkillType.JianBiQingYe, ESkillType.ZhanXinQingMing,
            ESkillType.SheChongYuHui
        ],
        // 4 天雷怒火,兴风作浪,万劫不复,四海宁靖,暮霭沉沉,白露横江
        [
            ESkillType.HighTianLeiNuHuo, ESkillType.HighXingFengZuoLang, ESkillType.HighWanJieBuFu,
            ESkillType.HighSiHaiNingJing, ESkillType.HighMuAiChenChen, ESkillType.HighBaiLuHengJiang,
            ESkillType.TianLeiNuHuo, ESkillType.XingFengZuoLang, ESkillType.WanJieBuFu,
            ESkillType.SiHaiNingJing, ESkillType.MuAiChenChen, ESkillType.BaiLuHengJiang
        ],
        // 5 天雷怒火,兴风作浪,万劫不复,白露横江,风卷残云,天怒惊雷,惊涛骇浪,星火燎原,澧兰沅芷,花晨月夕
        [
            ESkillType.HighTianLeiNuHuo, ESkillType.HighXingFengZuoLang, ESkillType.HighWanJieBuFu,
            ESkillType.HighTianNuJingLei, ESkillType.HighJingTaoHaiLang, ESkillType.HighXingHuoLiaoYuan,
            ESkillType.HighLiLanYuanZhi, ESkillType.HighHuaChenYueXi,
            ESkillType.TianLeiNuHuo, ESkillType.XingFengZuoLang, ESkillType.WanJieBuFu,
            ESkillType.TianNuJingLei, ESkillType.JingTaoHaiLang, ESkillType.XingHuoLiaoYuan,
            ESkillType.LiLanYuanZhi, ESkillType.HuaChenYueXi
        ],
        // 6 兰质蕙心,白露横江,风卷残云,天怒惊雷,惊涛骇浪,星火燎原,蹑影追风,花晨月夕
        [
            ESkillType.HighLanZhiHuiXin, ESkillType.HighBaiLuHengJiang, ESkillType.HighFengJuanCanYun,
            ESkillType.HighTianNuJingLei, ESkillType.HighJingTaoHaiLang, ESkillType.HighXingHuoLiaoYuan,
            ESkillType.HighNieYingZhuiFeng, ESkillType.HighHuaChenYueXi,
            ESkillType.LanZhiHuiXin, ESkillType.BaiLuHengJiang, ESkillType.FengJuanCanYun,
            ESkillType.TianNuJingLei, ESkillType.JingTaoHaiLang, ESkillType.XingHuoLiaoYuan,
            ESkillType.NieYingZhuiFeng, ESkillType.HuaChenYueXi
        ],
        // 7 身如铁石,金身不坏,天神护体,斗转星移,凌波微步
        [
            ESkillType.HighShenRuTieShi, ESkillType.HighJinShenBuHuai, ESkillType.HighTianShenHuTi,
            ESkillType.HighDouZhuanXingYi, ESkillType.HighLingBoWeiBu,
            ESkillType.ShenRuTieShi, ESkillType.JinShenBuHuai, ESkillType.TianShenHuTi,
            ESkillType.DouZhuanXingYi, ESkillType.LingBoWeiBu
        ],
        // 8 烟江叠嶂,身如铁石,天神护体,斗转星移,枯木盘根,心如止水,身似菩提,凌波微步
        [
            ESkillType.HighYanJiangDieZhang, ESkillType.HighLingBoWeiBu, ESkillType.HighTianShenHuTi,
            ESkillType.HighDouZhuanXingYi, ESkillType.HighKuMuPanGen, ESkillType.HighXinRuZhiShui,
            ESkillType.HighShenSiPuTi, ESkillType.HighLingBoWeiBu,
            ESkillType.YanJiangDieZhang, ESkillType.LingBoWeiBu, ESkillType.TianShenHuTi,
            ESkillType.DouZhuanXingYi, ESkillType.KuMuPanGen, ESkillType.XinRuZhiShui,
            ESkillType.ShenSiPuTi, ESkillType.LingBoWeiBu
        ],
        // 9 烟江叠嶂,身如铁石,斗转星移,傲雪凌霜,冰壶秋月,云合雾集,飘然出尘,凌波微步
        [
            ESkillType.HighYanJiangDieZhang, ESkillType.HighShenRuTieShi, ESkillType.HighDouZhuanXingYi,
            ESkillType.HighAoXueLingShuang, ESkillType.HighBingHuQiuYue, ESkillType.HighYunHeWuJi,
            ESkillType.HighPiaoRanChuChen, ESkillType.HighLingBoWeiBu,
            ESkillType.YanJiangDieZhang, ESkillType.ShenRuTieShi, ESkillType.DouZhuanXingYi,
            ESkillType.AoXueLingShuang, ESkillType.BingHuQiuYue, ESkillType.YunHeWuJi,
            ESkillType.PiaoRanChuChen, ESkillType.LingBoWeiBu
        ],
        // 10 秋水流弦,金戈铁甲,白露横江,烟江叠嶂,金身不坏,凌波微步
        [
            ESkillType.HighQiuShuiLiuXian, ESkillType.HighJinGeTieJia, ESkillType.HighBaiLuHengJiang,
            ESkillType.HighYanJiangDieZhang, ESkillType.HighJinShenBuHuai, ESkillType.HighLingBoWeiBu,
            ESkillType.QiuShuiLiuXian, ESkillType.JinGeTieJia, ESkillType.BaiLuHengJiang,
            ESkillType.YanJiangDieZhang, ESkillType.JinShenBuHuai, ESkillType.LingBoWeiBu
        ],
        // 11 赤血青锋,疾风骤雨,怒剑狂花,万劫不复,花晨月夕,身如铁石,心如止水,凌波微步
        [
            ESkillType.HighChiXueQingFeng, ESkillType.HighJiFengZhouYu, ESkillType.HighNuJianKuangHua,
            ESkillType.HighWanJieBuFu, ESkillType.HighHuaChenYueXi, ESkillType.HighShenRuTieShi,
            ESkillType.HighXinRuZhiShui, ESkillType.HighLingBoWeiBu,
            ESkillType.ChiXueQingFeng, ESkillType.JiFengZhouYu, ESkillType.NuJianKuangHua,
            ESkillType.WanJieBuFu, ESkillType.HuaChenYueXi, ESkillType.ShenRuTieShi,
            ESkillType.XinRuZhiShui, ESkillType.LingBoWeiBu
        ],
        // 12 坚壁清野,战心清明,兰质蕙心,天神护体,斗转星移,云合雾集,凌波微步
        [
            ESkillType.HighJianBiQingYe, ESkillType.HighZhanXinQingMing, ESkillType.HighLanZhiHuiXin,
            ESkillType.HighTianShenHuTi, ESkillType.HighDouZhuanXingYi, ESkillType.HighYunHeWuJi,
            ESkillType.HighLingBoWeiBu,ESkillType.HighPiaoRanChuChen,ESkillType.PiaoRanChuChen,
            ESkillType.JianBiQingYe, ESkillType.ZhanXinQingMing, ESkillType.LanZhiHuiXin,
            ESkillType.TianShenHuTi, ESkillType.DouZhuanXingYi, ESkillType.YunHeWuJi,
            ESkillType.LingBoWeiBu
        ],
    ];
    // 攻击BUFF列表
    static atkList: EMagicType[] = [
        EMagicType.PHYSICS, //物理
        EMagicType.Chaos, //混乱
        EMagicType.Toxin, //毒
        EMagicType.Sleep, //昏睡
        EMagicType.Seal, //封印
        EMagicType.Wind, //风法
        EMagicType.Fire, //火法
        EMagicType.Thunder, //雷法
        EMagicType.Water, //水法
        EMagicType.Frighten, //震慑
        EMagicType.ThreeCorpse, //三尸
        EMagicType.Charm, //魅惑
        EMagicType.GhostFire, //鬼火
        EMagicType.Forget, //遗忘
        EMagicType.SubDefense, // 减防
    ];

    static debuffList: EMagicType[] = [
        EMagicType.Chaos, //混乱
        EMagicType.Toxin, //毒
        EMagicType.Sleep, //昏睡
        EMagicType.Seal, //封印
        EMagicType.Charm, //魅惑
        EMagicType.Forget, //遗忘
        EMagicType.SubDefense, // 减防
    ];
    // 控制技能
    static controlList = [
        ESkillType.JieDaoShaRen,
        ESkillType.MiHunZui,
        ESkillType.ZuoBiShangGuan,
        ESkillType.ShiXinKuangLuan,
        ESkillType.BaiRiMian,
        ESkillType.SiMianChuGe,
        ESkillType.MengPoTang,
        ESkillType.ShiXinFeng,
    ];
    // 强制耗蓝技能
    static forceMpSkill = [
        ESkillType.BingLinChengXia,
        ESkillType.TianMoJieTi,
        ESkillType.FenGuangHuaYing,
        ESkillType.QingMianLiaoYa,
        ESkillType.XiaoLouYeKu,
        ESkillType.HighTianMoJieTi,
        ESkillType.HighFenGuangHuaYing,
        ESkillType.HighQingMianLiaoYa,
        ESkillType.HighXiaoLouYeKu
    ];
    // 启动时初始化技能列表
    static launch() {
        if (this.skillList == null) {
            this.skillList = {};
            this.addSkill(new NormalAttack());
            this.addSkill(new NormalDefend());
            this.addSkill(new HeDingHongFen());
            this.addSkill(new WanDuGongXin());
            this.addSkill(new JieDaoShaRen());
            this.addSkill(new ShiXinKuangLuan());
            this.addSkill(new MiHunZui());
            this.addSkill(new BaiRiMian());
            this.addSkill(new ZuoBiShangGuan());
            this.addSkill(new SiMianChuGe());
            this.addSkill(new LieHuoJiaoYang());
            this.addSkill(new JiuYinChunHuo());
            this.addSkill(new FengLeiYongDong());
            this.addSkill(new XiuLiQianKun());
            this.addSkill(new DianShanLeiMing());
            this.addSkill(new TianZhuDiMie());
            this.addSkill(new JiaoLongChuHai());
            this.addSkill(new JiuLongBingFeng());
            this.addSkill(new MoShenHuTi());
            this.addSkill(new HanQingMoMo());
            this.addSkill(new TianWaiFeiMo());
            this.addSkill(new QianKunJieSu());
            this.addSkill(new ShouWangShenLi());
            this.addSkill(new MoShenFuShen());
            this.addSkill(new XiaoHunShiGu());
            this.addSkill(new YanLuoZhuiMing());

            this.addSkill(new QinSiBingWu());
            this.addSkill(new QianNvYouHun());
            this.addSkill(new XueShaZhiGu());
            this.addSkill(new XiXingDaFa());
            this.addSkill(new LuoRiRongJin());
            this.addSkill(new XueHaiShenChou());
            this.addSkill(new ShiXinFeng());
            this.addSkill(new MengPoTang());

            this.addSkill(new ZhangYinDongDu());
            this.addSkill(new YuanQuanWanHu());
            this.addSkill(new ShenGongGuiLi());
            this.addSkill(new BeiDaoJianXing());
            this.addSkill(new PanShan());
            this.addSkill(new HighZhangYinDongDu());
            this.addSkill(new HighYuanQuanWanHu());
            this.addSkill(new HighShenGongGuiLi());
            this.addSkill(new HighBeiDaoJianXing());
            this.addSkill(new HighPanShan());

            this.addSkill(new ChuiJinZhuanYu());
            this.addSkill(new KuMuFengChun());
            this.addSkill(new XiTianJingTu());
            this.addSkill(new RuRenYinShui());
            this.addSkill(new FengHuoLiaoYuan());

            this.addSkill(new GongXingTianFa());
            this.addSkill(new TianGangZhanQi());


            //龙族
            this.addSkill(new LingXuYuFeng());
            this.addSkill(new FeiJuJiuTian());
            this.addSkill(new FengLeiWanYun());
            this.addSkill(new ZhenTianDongDi());
            this.addSkill(new FeiRanMoYu());
            this.addSkill(new ZeBeiWanWu());
            this.addSkill(new BaiLangTaoTian());
            this.addSkill(new CangHaiHengLiu());
            this.addSkill(new NiLin());



            // 神兽技能
            this.addSkill(new BingLinChengXia());
            this.addSkill(new NiePan());
            this.addSkill(new QiangHuaXuanRen());
            this.addSkill(new QiangHuaYiHuan());
            this.addSkill(new ChaoMingDianChe());
            this.addSkill(new RuHuTianYi());

            this.addSkill(new XuanRen());
            this.addSkill(new YiHuan());
            this.addSkill(new DangTouBangHe());            

            this.addSkill(new ShanXian());
            this.addSkill(new HighShanXian());
            this.addSkill(new YinShen());
            this.addSkill(new MiaoShouHuiChun());

            this.addSkill(new StealMoney());
            this.addSkill(new ZiXuWuYou());
            this.addSkill(new HuaWu());
            this.addSkill(new JueJingFengSheng());
            this.addSkill(new FeiLongZaiTian());
            this.addSkill(new FeiLongZaiTian_Feng());
            this.addSkill(new FeiLongZaiTian_Huo());
            this.addSkill(new FeiLongZaiTian_Shui());
            this.addSkill(new FeiLongZaiTian_Lei());

            this.addSkill(new LiSheDaChuan());
            this.addSkill(new AnXingJiDou());
            this.addSkill(new FeiZhuJianYu());
            this.addSkill(new LiuShiChiLie());
            this.addSkill(new MuRuQingFeng());
            this.addSkill(new LuoZhiYunYan());
            this.addSkill(new HenYuFeiFei());
            this.addSkill(new AnYingLiHun());
            this.addSkill(new AnZhiJiangLin());

            this.addSkill(new YouFengLaiYi());
            this.addSkill(new YouFengLaiYi_Jin());
            this.addSkill(new YouFengLaiYi_Mu());
            this.addSkill(new YouFengLaiYi_Shui());
            this.addSkill(new YouFengLaiYi_Huo());
            this.addSkill(new YouFengLaiYi_Tu());

            this.addSkill(new FenHuaFuLiu());
            this.addSkill(new FenLieGongJi());
            this.addSkill(new HighFenLieGongJi());
            this.addSkill(new GeShanDaNiu());
            this.addSkill(new HighGeShanDaNiu());

            this.addSkill(new TianMoJieTi());
            this.addSkill(new FenGuangHuaYing());
            this.addSkill(new QingMianLiaoYa());
            this.addSkill(new XiaoLouYeKu());
            this.addSkill(new HighTianMoJieTi());
            this.addSkill(new HighFenGuangHuaYing());
            this.addSkill(new HighQingMianLiaoYa());
            this.addSkill(new HighXiaoLouYeKu());
            this.addSkill(new JiQiBuYi());
            this.addSkill(new HunLuan());
            this.addSkill(new FengYin());
            this.addSkill(new HuanYingRuFeng());
        }
        if (this.horseSkillMap == null) {
            this.horseSkillMap = {};
            this.addHorseSkill(new HighChongYunPoWu());
            this.addHorseSkill(new HighQiXueZhenGe());
            this.addHorseSkill(new HighNuJianKuangHua());
            this.addHorseSkill(new HighPoFuChenZhou());
            this.addHorseSkill(new HighJinGeTieJia());
            this.addHorseSkill(new HighJianBiQingYe());

            this.addHorseSkill(new ChongYunPoWu());
            this.addHorseSkill(new QiXueZhenGe());
            this.addHorseSkill(new NuJianKuangHua());
            this.addHorseSkill(new PoFuChenZhou());
            this.addHorseSkill(new JinGeTieJia());
            this.addHorseSkill(new JianBiQingYe());
            // 2组
            this.addHorseSkill(new HighChiXueQingFeng());
            this.addHorseSkill(new HighJiFengZhouYu());
            this.addHorseSkill(new HighHouFaZhiRen());
            this.addHorseSkill(new HighBaiBuChuanYang());
            this.addHorseSkill(new HighShenShuGuiCang());

            this.addHorseSkill(new ChiXueQingFeng());
            this.addHorseSkill(new JiFengZhouYu());
            this.addHorseSkill(new HouFaZhiRen());
            this.addHorseSkill(new BaiBuChuanYang());
            this.addHorseSkill(new ShenShuGuiCang());
            // 3组
            this.addHorseSkill(new HighQiuShuiLiuXian());
            this.addHorseSkill(new HighZhuiHunDuoMing());
            this.addHorseSkill(new HighZhanXinQingMing());
            this.addHorseSkill(new HighSheChongYuHui());

            this.addHorseSkill(new QiuShuiLiuXian());
            this.addHorseSkill(new ZhuiHunDuoMing());
            this.addHorseSkill(new ZhanXinQingMing());
            this.addHorseSkill(new SheChongYuHui());
            // 4组
            this.addHorseSkill(new HighTianLeiNuHuo());
            this.addHorseSkill(new HighXingFengZuoLang());
            this.addHorseSkill(new HighSiHaiNingJing());
            this.addHorseSkill(new HighMuAiChenChen());
            this.addHorseSkill(new HighBaiLuHengJiang());

            this.addHorseSkill(new TianLeiNuHuo());
            this.addHorseSkill(new XingFengZuoLang());
            this.addHorseSkill(new SiHaiNingJing());
            this.addHorseSkill(new MuAiChenChen());
            this.addHorseSkill(new BaiLuHengJiang());
            // 5组
            this.addHorseSkill(new HighWanJieBuFu());
            this.addHorseSkill(new HighFengJuanCanYun());
            this.addHorseSkill(new HighTianNuJingLei());
            this.addHorseSkill(new HighJingTaoHaiLang());
            this.addHorseSkill(new HighXingHuoLiaoYuan());
            this.addHorseSkill(new HighLiLanYuanZhi());
            this.addHorseSkill(new HighHuaChenYueXi());

            this.addHorseSkill(new WanJieBuFu());
            this.addHorseSkill(new FengJuanCanYun());
            this.addHorseSkill(new TianNuJingLei());
            this.addHorseSkill(new JingTaoHaiLang());
            this.addHorseSkill(new XingHuoLiaoYuan());
            this.addHorseSkill(new LiLanYuanZhi());
            this.addHorseSkill(new HuaChenYueXi());
            // 6组
            this.addHorseSkill(new HighLanZhiHuiXin());
            this.addHorseSkill(new HighNieYingZhuiFeng());

            this.addHorseSkill(new LanZhiHuiXin());
            this.addHorseSkill(new NieYingZhuiFeng());
            // 7组
            this.addHorseSkill(new HighShenRuTieShi());
            this.addHorseSkill(new HighJinShenBuHuai());
            this.addHorseSkill(new HighTianShenHuTi());
            this.addHorseSkill(new HighDouZhuanXingYi());
            this.addHorseSkill(new HighLingBoWeiBu());

            this.addHorseSkill(new ShenRuTieShi());
            this.addHorseSkill(new JinShenBuHuai());
            this.addHorseSkill(new TianShenHuTi());
            this.addHorseSkill(new DouZhuanXingYi());
            this.addHorseSkill(new LingBoWeiBu());
            // 8组
            this.addHorseSkill(new HighYanJiangDieZhang());
            this.addHorseSkill(new HighKuMuPanGen());
            this.addHorseSkill(new HighXinRuZhiShui());
            this.addHorseSkill(new HighShenSiPuTi());

            this.addHorseSkill(new YanJiangDieZhang());
            this.addHorseSkill(new KuMuPanGen());
            this.addHorseSkill(new XinRuZhiShui());
            this.addHorseSkill(new ShenSiPuTi());
            // 9组
            this.addHorseSkill(new HighAoXueLingShuang());
            this.addHorseSkill(new HighBingHuQiuYue());
            this.addHorseSkill(new HighYunHeWuJi());
            this.addHorseSkill(new HighPiaoRanChuChen())

            this.addHorseSkill(new AoXueLingShuang());
            this.addHorseSkill(new BingHuQiuYue());
            this.addHorseSkill(new YunHeWuJi());
            this.addHorseSkill(new PiaoRanChuChen())
        }
        // 佩饰技能
        this.addSkill(new TouTianHuanRi1());
        this.addSkill(new TouTianHuanRi2());
        this.addSkill(new TouTianHuanRi3());
        this.addSkill(new HuanYingRuFeng1());
        this.addSkill(new HuanYingRuFeng2());
        this.addSkill(new HuanYingRuFeng3());
        this.addSkill(new ZhanCaoChuGen1());
        this.addSkill(new ZhanCaoChuGen2());
        this.addSkill(new ZhanCaoChuGen3());
        this.addSkill(new WuDuJuQuan1());
        this.addSkill(new WuDuJuQuan2());
        this.addSkill(new WuDuJuQuan3());
        this.addSkill(new WeiXinYiZhi1());
        this.addSkill(new WeiXinYiZhi2());
        this.addSkill(new WeiXinYiZhi3());
        this.addSkill(new WanGuTongBei1());
        this.addSkill(new WanGuTongBei2());
        this.addSkill(new WanGuTongBei3());
        this.addSkill(new QiShiHuiSheng1());
        this.addSkill(new QiShiHuiSheng2());
        this.addSkill(new QiShiHuiSheng3());
        this.addSkill(new YouYing1());
        this.addSkill(new YouYing2());
        this.addSkill(new YouYing3());

        this.addSkill(new AnShiRuChang1());
        this.addSkill(new AnShiRuChang2());
        this.addSkill(new AnShiRuChang3());
        this.addSkill(new JingPiLiJie1());
        this.addSkill(new JingPiLiJie2());
        this.addSkill(new JingPiLiJie3());
        this.addSkill(new ZhenJiEff());
        this.addSkill(new GongWuBuKe1());
        this.addSkill(new GongWuBuKe2());
        this.addSkill(new GongWuBuKe3());
        this.addSkill(new WanGuChangCun1());
        this.addSkill(new WanGuChangCun2());
        this.addSkill(new WanGuChangCun3());
        
    }
    // 加入技能
    private static addSkill(skill: SkillBase) {
        this.skillList[skill.skill_id] = skill;
    }
    // 加入坐骑技能
    private static addHorseSkill(skill: SkillBase) {
        this.horseSkillMap[skill.skill_id] = skill;
    }
    // 获得技能
    static getSkill(skillId: any): SkillBase {
        skillId = SKDataUtil.toNumber(skillId);
        if (isNaN(skillId)) {
            console.warn(`无效的技能索引[${skillId}]`);
            return null;
        }
        let skill: SkillBase = SKDataUtil.valueForKey(this.skillList, skillId);
        if (!skill) {
            SKLogger.warn(`找不到技能定义[${skillId}]`);
            return null;
        }
        return skill;
    }
    // 获得坐骑技能
    static getHorseSkill(skillId: any): SkillBase {
        skillId = SKDataUtil.toNumber(skillId);
        if (isNaN(skillId)) {
            console.warn(`无效的坐骑技能索引[${skillId}]`);
            return null;
        }
        let skill: SkillBase = SKDataUtil.valueForKey(this.horseSkillMap, skillId);
        if (skill == null) {
            console.warn(`找不到坐骑技能定义[${skillId}]`);
            return null;
        }
        let result = SKDataUtil.cloneClass(skill);
        return result;
    }
    // 获得BUFF名称
    static getBuffName(type: EMagicType): string {
        if (SkillUtil.magicName == null) {
            SkillUtil.magicName = {};
            SkillUtil.magicName[EMagicType.PHYSICS] = "物理";
            SkillUtil.magicName[EMagicType.Chaos] = "混乱";
            SkillUtil.magicName[EMagicType.Toxin] = "毒";
            SkillUtil.magicName[EMagicType.Sleep] = "昏睡";
            SkillUtil.magicName[EMagicType.Seal] = "封印";
            SkillUtil.magicName[EMagicType.Wind] = "风法";
            SkillUtil.magicName[EMagicType.Fire] = "火法";
            SkillUtil.magicName[EMagicType.Thunder] = "雷法";
            SkillUtil.magicName[EMagicType.Water] = "水法";
            SkillUtil.magicName[EMagicType.SPEED] = "加速";
            SkillUtil.magicName[EMagicType.Defense] = "加防";
            SkillUtil.magicName[EMagicType.Attack] = "加攻";
            SkillUtil.magicName[EMagicType.Frighten] = "震慑";
            SkillUtil.magicName[EMagicType.ThreeCorpse] = "三尸";
            SkillUtil.magicName[EMagicType.Charm] = "魅惑";
            SkillUtil.magicName[EMagicType.GhostFire] = "鬼火";
            SkillUtil.magicName[EMagicType.Forget] = "遗忘";
            SkillUtil.magicName[EMagicType.SubDefense] = "减防";
            SkillUtil.magicName[EMagicType.YinShen] = "隐身";
            SkillUtil.magicName[EMagicType.Rrsume] = "回血";
            SkillUtil.magicName[EMagicType.StealMoney] = "飞龙探云手";
            SkillUtil.magicName[EMagicType.BianShen] = "变身";
            SkillUtil.magicName[EMagicType.HengSao] = "横扫";
            SkillUtil.magicName[EMagicType.ZhenJi] = "震击";
            SkillUtil.magicName[EMagicType.ZhenJiEff] = "精疲力竭";
            SkillUtil.magicName[EMagicType.FenShen] = "分身";
            SkillUtil.magicName[EMagicType.PoJia] = "破甲";
        }
        if (type == -1) {
            return "";
        }
        let result = SKDataUtil.valueForKey(SkillUtil.magicName, type);
        if (!result) {
            SKLogger.warn(`BUFF[${type}]找不到名称定义!`);
            return "";
        }
        return result;
    }

    // 获得技能名称
    static getSkillName(skillId: number): string {
        let skill: SkillBase = SKDataUtil.valueForKey(this.skillList, skillId);
        if (!skill) {
            SKLogger.warn(`找不到技能定义${skillId}`);
            return "";
        }
        return skill.skill_name;
    }
    // 是否为攻击技能
    static isAtkSkill(skillId: number) {
        let skill = this.getSkill(skillId);
        if (skill) {
            // 被动技能不是攻击技能
            if(skillId == ESkillType.AnYingLiHun || skillId == ESkillType.AnZhiJiangLin){
                return true;
            }else if (skill.action_type == EActionType.PASSIVE) {
                return false;
            }
            return this.atkList.indexOf(skill.skill_type) != -1;
        }
        return false;
    }
    // 是否为控制技能
    static isControlSkill(skillId: number): boolean {
        let find = (this.controlList.indexOf(skillId) != -1);
        return find;
    }
    // 是否为连击技能 普攻 兵临城下 幻影如风
    static hasComboSkill(skillId: number, battleRole: BattleRole): boolean {
        if (skillId == ESkillType.NormalAtkSkill) {
            return true;
        }
        if (skillId == ESkillType.BingLinChengXia) {
            return true;
        }
        if (skillId == ESkillType.HuanYingRuFeng) {
            return true;
        }
        if (skillId == ESkillType.AnYingLiHun) {
            return true;
        }
        if (skillId == ESkillType.AnZhiJiangLin) {
            return true;
        }
        return false;
    }
    // 是否为闪避技能
    static isCanShanbiSkill(skillId: number): boolean {
        if (skillId == ESkillType.NormalAtkSkill) {
            return true;
        }
        return false;
    }
    // 是否敌方BUFF技能
    static isEnemyBuffSkill(skillId: number): boolean {
        let skill = this.getSkill(skillId);
        if (skill) {
            if (skill.action_type == EActionType.PASSIVE) {
                return false;
            }
            return this.debuffList.indexOf(skill.skill_type) != -1;
        }
        return false;
    }
    // 是否为已方BUFF技能
    static isSelfBuffSkill(skillid: any): boolean {
        let skill = this.getSkill(skillid);
        if (skill) {
            // 被动技能不是作用在已方的
            if (skill.action_type == EActionType.PASSIVE) {
                return false;
            }
            return skill.act_on == EActionOn.SELF;
        }
        return false;
    }
    // 获得随机技能
    static getRandomHorseSkill(index: number): SkillBase {
        let list = SKDataUtil.getItemBy(this.horseSkillGroup, index);
        if (list) {
            let skillId = SKDataUtil.randomList(list);
            let skill = SkillUtil.getHorseSkill(skillId);
            return skill;
        } else {
            return null;
        }
    }
}