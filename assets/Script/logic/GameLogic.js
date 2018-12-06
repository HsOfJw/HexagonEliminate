var DirectionType = require("DirectionType");
var Util = require("Util");
var HexagonType = require("HexagonType");
var HexagonNode = require("HexagonNode");
var PosType = require("GameDefine").PosType;
var ObjectType = require("ObjectType");

cc.Class({
    extends: cc.Component,

    properties: {},

    gridMgr: null, //网格数据
    gridView: null, //网格视图生成
    hexagonNodeMgr: null, //管理放置到网格上的方块
    notPlaceNodeMgr: null, //管理未放置到网格上的方块

    commonGenerator: null, //普通方块生成器
    universalGenerator: null, //万能方块生成器
    bombGenerator: null, //炸弹方块生成器


    curSynthesiType: null, //当前正在合成的方块类型
    curSynthesiID: null, //当前正在合成的方块id
    curSynthesiNum: null, //当前可以合成的方块数量
    synthesiNum: null, //可以合成的最少方块数量(首次为3,接下来为2)
    synthesiCount: null, //连续消除的计数器

    curCanSynthesi: null, //当前是否有可合成的方块

    onLoad() {
        Game.GameLogic = this;

        this.init();

        this.hexagonNodeMgr = Util.AddComponent(this.node, "HexagonNodeMgr");
        this.notPlaceNodeMgr = Util.AddComponent(this.node, "NotPlacedNodeMgr");
        this.gridMgr = Util.AddComponent(this.node, "GridMgr");
        this.gridView = Util.AddComponent(this.node.getChildByName("GridView"), "GridView");
        this.commonGenerator = Util.AddComponent(cc.find("Canvas/GameScene/ProduceHexagon/GridParent"), "HexagonGenerator");

        this.universalGenerator = Util.GetComponent(cc.find("Canvas/GameScene/UILayer/UniversalNode/UniversalBtn"), "UniversalGenerator");
        this.bombGenerator = Util.GetComponent(cc.find("Canvas/GameScene/UILayer/BombNode/BombBtn"), "BombGenerator");
    },

    start() {

    },

    onDestroy() {
        Util.RemoveComponent(this.node, "HexagonNodeMgr");
        Util.RemoveComponent(this.node, "NotPlacedNodeMgr");
        Util.RemoveComponent(this.node, "GridMgr");
        Util.RemoveComponent(this.node.getChildByName("GridView"), "GridView");
        Util.RemoveComponent(cc.find("Canvas/GameScene/ProduceHexagon/GridParent"), "HexagonGenerator")

        this.hexagonNodeMgr = null;
        this.notPlaceNodeMgr = null;
        this.gridMgr = null;
        this.gridView = null;
        this.commonGenerator = null;
        this.universalGenerator = null;
        this.bombGenerator = null;
    },

    init() {
        this.curCanSynthesi = false;
        this.curSynthesiType = 0;
        this.synthesiCount = 0;
        this.curSynthesiID = 0;
        this.curSynthesiNum = 0;
        this.synthesiNum = 3;
    },

    InitGameData() {
        Game.GlobalVar.gameOver = false;

        Game.GameData.SetCurRoundGUID(Util.GUID());
        Game.GameData.SetMaxHexagonCount(2);
        Game.GameData.SetMaxType(GameConfig.InitMaxNumType);
        Game.GameData.SetUniversalNum(GameConfig.UniversalNum);
        Game.GameData.SetReplaceNum(GameConfig.ReplaceUINum);
        Game.GameData.SetBombNum(GameConfig.BombNum);
        Game.GameData.SetHexagonPosType([PosType.PT_Horizontal, PosType.PT_LeftDonw, PosType.PT_RightDonw]);
    },

    //生成底层的网格
    GenerateGridView() {
        if (!this.gridView) {
            return;
        }

        var gridData = this.gridMgr.getGridData();
        this.gridView.generateGridView(gridData);
    },

    //移除所有放置到网格上的方块
    RemoveAllHexagon() {
        if (!this.hexagonNodeMgr) {
            return;
        }

        this.hexagonNodeMgr.removeAllHexagonNode();
    },

    //重置底层网格的提示
    ResetGridViewHint() {
        if (!this.gridView) {
            return;
        }

        this.gridView.resetGridNode();
    },

    //重置方块生成器中随机库的最大生成数字
    ResetMaxRandomNum() {
        if (!this.commonGenerator) {
            return;
        }

        Game.GameData.SetMaxType(HexagonType.HT_2);
    },

    //设置方块生成器中随机库的最大生成数字类型
    SetMaxRandomNum(type) {
        if (!this.commonGenerator) {
            return;
        }

        Game.GameData.SetMaxType(type);
    },

    //重新生成随机方块
    RegenerateRandomHexagon() {
        if (Game.GlobalVar.gameOver) {
            return;
        }
        if (!this.commonGenerator) {
            return;
        }

        //首先销毁当前的
        this.commonGenerator.destroyCurNode();

        //重置角度
        this.commonGenerator.resetRotation();

        //然后再生成
        this.GenerateRandomHexagon();
    },

    //随机生成方块
    GenerateRandomHexagon() {
        if (Game.GlobalVar.gameOver) {
            return;
        }

        if (!this.commonGenerator) {
            return;
        }

        this.RestPriortyState();

        this.commonGenerator.produce();
    },

    //生成指定的方块
    GenerateSpecifiedHexagon(specifiedID, posType) {
        if (Game.GlobalVar.gameOver) {
            return;
        }
        if (!this.commonGenerator) {
            return;
        }

        this.commonGenerator.produceSpecified(specifiedID, posType);
    },

    //生成特殊的方块
    GenerateSpecialHexagon() {
        if (Game.GlobalVar.gameOver) {
            return;
        }
        if (!this.universalGenerator) {
            return;
        }
        if (!this.bombGenerator) {
            return;
        }

        //生成万能的方块
        this.universalGenerator.produce();
        //生成炸弹方块
        this.bombGenerator.produce();
    },

    //领取宝箱
    ReceiveChest() {
        Game.GameData.SetUniversalNum(Game.GameData.GetUniversalNum() + 1);
        Game.GameData.SetReplaceNum(Game.GameData.GetReplaceNum() + 1);

        Game.EventCenter.DispatchEvent(Game.MessageType.ReceiveChest_Success);
    },

    //领取替换UI
    ReceiveReplace() {
        Game.GameData.SetReplaceNum(Game.GameData.GetReplaceNum() + 1);
        Game.GameData.SetReceivedReplaceNum(Game.GameData.GetReceivedReplaceNum() + 1);

        Game.EventCenter.DispatchEvent(Game.MessageType.Refresh_UI);
    },

    //领取万能方块
    ReceiveUniversal() {
        Game.GameData.SetUniversalNum(Game.GameData.GetUniversalNum() + 1);
        Game.GameData.SetReceivedUniversalNum(Game.GameData.GetReceivedUniversalNum() + 1);

        Game.EventCenter.DispatchEvent(Game.MessageType.Refresh_UI);
    },

    //领取道具
    ReceiveProp(data) {
        Game.GameData.SetBombNum(Game.GameData.GetBombNum() + 1);
        Game.GameData.SetReceivedProps(data.uid1, data.uid2);

        Game.EventCenter.DispatchEvent(Game.MessageType.Refresh_UI);
    },

    //复活
    ResurrectionLogic() {
        if (Game.GameData.GetIsResurrection()) {
            return;
        }

        this.synthesiCount = 0;

        var allGridID = Util.CopyArray(this.gridMgr.getAllGridID());

        var idArr = [];

        //生成指定的2048
        for (var i = 0; i < GameConfig.Resurrection2048Num; i++) {
            var id = Util.RandomElement(allGridID);
            idArr.push(id);
            Util.RemoveItem(allGridID, id);
        }

        if (idArr.length > 0) {
            for (var i = 0; i < idArr.length; i++) {
                var id = idArr[i];

                if (this.gridMgr.isValidID(id)) {
                    var hexagon = this.hexagonNodeMgr.getHexagonNodeByID(id);
                    if (hexagon) {
                        hexagon.setType(HexagonType.HT_2048);
                        hexagon.updateTexture();
                    }
                }
            }
        }

        Game.GlobalVar.gameOver = false;

        Game.GameData.SetIsResurrection(true);
    },

    //重置优先检测的状态
    RestPriortyState() {
        if (!this.hexagonNodeMgr) {
            return;
        }

        this.hexagonNodeMgr.resetPriortyState();
    },

    //重置方块检测标记
    ResetCheckTagNode() {
        if (!this.hexagonNodeMgr) {
            return;
        }

        this.hexagonNodeMgr.resetCheckTagNode();
    },

    //是否生成宝箱
    IsGenerateTrasureChest() {
        if (this.synthesiCount >= GameConfig.TrasureChestCreateConditions) {
            var isGenerate = Util.RandomPercentage(GameConfig.TrasureChestProbability);
            return isGenerate;
        }
    },

    //检查是否可以合成
    IsSynthesi() {
        if (Game.GlobalVar.gameOver) {
            return;
        }
        if (!this.hexagonNodeMgr) {
            return;
        }

        var allHexagonNode = this.hexagonNodeMgr.getSynthesiNode();

        for (var i = 0; i < allHexagonNode.length; i++) {
            var hexagonNode = allHexagonNode[i];
            if (hexagonNode) {
                var id = hexagonNode.getID();
                var type = hexagonNode.getType();
                hexagonNode.setCheckTag(true);

                this.AddHexagonTagByType(id, type);

                var count = this.hexagonNodeMgr.getCheckTagNum(type);
                if (count >= this.synthesiNum) {
                    //记录合成数量
                    this.curSynthesiNum = count;
                    //记录当前合成的方块类型和id
                    this.curSynthesiType = type;
                    this.curSynthesiID = id;
                    //下一次优先检测
                    hexagonNode.setIsPriorityCheck(true);
                    //标记为当前可合成
                    this.curCanSynthesi = true;
                    return true;
                } else {
                    this.curCanSynthesi = false;
                    hexagonNode.setIsSynthesiNode(false);
                    this.hexagonNodeMgr.resetCheckTagNode();
                }
            }
        }
        return false;
    },

    //开始合成
    StartSynthesi() {
        if (!this.curCanSynthesi) {
            //当前没有可以合成的方块
            return;
        }

        if (this.gridMgr.isValidID(this.curSynthesiID) == false) {
            return;
        }

        this.curCanSynthesi = false;

        //合成次数增加
        this.synthesiCount += 1;

        //已经合成一次,这时最小可合成的数量为2
        this.synthesiNum = 2;

        //播放合成特效
        Game.EventCenter.DispatchEvent(Game.MessageType.Synthesi_Hexagon_Event, this.curSynthesiID);
    },

    //执行合成后的操作 移除旧方块 合成新方块 设置最大生成类型
    DoSynthesiAfter() {
        if (Game.GlobalVar.gameOver) {
            return;
        }
        if (!this.hexagonNodeMgr) {
            return;
        }

        if (!this.commonGenerator) {
            return;
        }

        //合成的类型
        var synthesiType = this.curSynthesiType + 1;
        //合成方块
        this.hexagonNodeMgr.synthesiHexagon(this.curSynthesiID, this.curSynthesiType);

        Game.GameData.SetMaxType(synthesiType);
    },

    //如果生成了2048就爆炸
    IsSynthesi2048() {
        var self = this;

        //合成的类型
        var synthesiType = this.curSynthesiType + 1;
        if (synthesiType == HexagonType.HT_2048) {
            // Game.EventCenter.DispatchEvent(Game.MessageType.Synthesi_2048_Event);
            return true;
        }
        return false;
    },

    //检查是否可以放置方块(如果可以添加标记,记录id)
    CheckPlace() {
        var nCount = this.notPlaceNodeMgr.getHexagonCount();
        for (var i = 0; i < nCount; i++) {
            var node = this.notPlaceNodeMgr.getHexagonByIndex(i);
            if (node && node.myChangedDirtyFlag) {
                var worldPos = node.convertToWorldSpaceAR(cc.v2(0, 0));
                var gridID = this.gridView.getGridIDByWorldPos(worldPos);

                if (gridID > 0 && this.hexagonNodeMgr.isHaveHexagonNode(gridID) == false) {
                    if (Game.GlobalVar.IsGuide) {
                        //如果是新手引导，则判断是否放到了指定的网格上
                        if (this.gridView.isHighlightedID(gridID) == false) {
                            break;
                        }
                    }
                    node.setIsCanPlace(true);
                    node.setCanPlaceGridID(gridID);
                } else {
                    node.setIsCanPlace(false);
                    node.setCanPlaceGridID(0);
                    continue;
                }
            }
        }
    },

    //放置指定方块到指定位置
    //arrType 方块类型数组
    //arrID 方块id数组
    PlaceSpecifiedNodeByID(arrType, arrID) {
        if (!arrID || arrID.length <= 0) {
            return false;
        }

        if (!arrType || arrType.length <= 0) {
            return false;
        }

        if (arrType.length != arrID.length) {
            return;
        }

        for (var i = 0; i < arrType.length; i++) {
            var type = arrType[i];
            var id = arrID[i];

            var node = Game.HexagonPool.GetHexagonObj(type);

            if (node) {
                node.setID(id);

                node.doPlace(this.gridView.getGridNodeByID(id));


                this.hexagonNodeMgr.addHexagonNode(node);
            }
        }

        return true;
    },

    //计算当前可生成的方块位置类型
    CalcCurPosType() {

        //首先找到所有的空格的id
        var allNullGridID = this.FindAllNullGrid()

        var posType = [];

        var luFlag = false;
        var ruFlag = false;
        var hFlag = false;

        for (var i = 0; i < allNullGridID.length; i++) {
            var id = allNullGridID[i];

            //获取左上方的方块
            var LUID = this.gridMgr.getLeftUpID(id);
            //获取右上方的方块
            var RUID = this.gridMgr.getRightUpID(id);
            //获取右边的方块
            var RID = this.gridMgr.getRightID(id);

            if (!luFlag && this.gridMgr.isValidID(LUID) && this.hexagonNodeMgr.isContainHexagon(LUID) == false) {
                luFlag = true;
                posType.push(PosType.PT_RightDonw);
            }
            if (!ruFlag && this.gridMgr.isValidID(RUID) && this.hexagonNodeMgr.isContainHexagon(RUID) == false) {
                ruFlag = true;
                posType.push(PosType.PT_LeftDonw);
            }
            if (!hFlag && this.gridMgr.isValidID(RID) && this.hexagonNodeMgr.isContainHexagon(RID) == false) {
                hFlag = true;
                posType.push(PosType.PT_Horizontal);
            }

            if (luFlag && ruFlag && hFlag) {
                break;
            }
        }

        if (posType.length <= 0) {
            if (allNullGridID.length > 0) {
                Game.GameData.SetMaxHexagonCount(1);
            } else {
                //游戏结束
                cc.log("游戏结束");
                Game.GlobalVar.gameOver = true;
                Game.EventCenter.DispatchEvent(Game.MessageType.Game_Over);
            }
        } else {
            Game.GameData.SetMaxHexagonCount(2);
        }

        cc.log("posType:", posType);

        cc.log("MaxHexagonCount:", Game.GameData.GetMaxHexagonCount());

        Game.GameData.SetHexagonPosType(posType);
    },

    //找到所有的空格
    FindAllNullGrid() {
        var nullGridID = [];

        if (this.gridMgr && this.hexagonNodeMgr) {
            var allGridID = this.gridMgr.getAllGridID();
            for (var i = 0; i < allGridID.length; i++) {
                var id = allGridID[i];

                if (this.hexagonNodeMgr.isContainHexagon(id)) {
                    continue;
                }

                nullGridID.push(id);
            }
        }
        return nullGridID;
    },

    //放置方块到指定位置
    PlaceNodeByID(arrID) {
        if (!this.notPlaceNodeMgr) {
            return false;
        }

        if (!arrID || arrID.length <= 0) {
            return false;
        }

        var commonHexagon = this.notPlaceNodeMgr.getCommonHexagon();
        if (!commonHexagon) {
            return false;
        }

        for (var i = 0; i < commonHexagon.length; i++) {
            var node = commonHexagon[i];
            var id = arrID[i];
            if (node) {
                node.setID(id);

                node.doPlace(this.gridView.getGridNodeByID(id));

                this.hexagonNodeMgr.addHexagonNode(node);
            }
        }

        this.notPlaceNodeMgr.removeCommonHexagon();

        return true;
    },

    //放置普通方块
    PlaceCommonNode() {
        if (!this.notPlaceNodeMgr) {
            return false;
        }

        var commonHexagon = this.notPlaceNodeMgr.getCommonHexagon();
        if (!commonHexagon) {
            return false;
        }

        var isCanPalce = true;
        var isSuccess = false;

        for (var i = 0; i < commonHexagon.length; i++) {
            var node = commonHexagon[i];
            if (node == null || node.getIsCanPlace() == false) {
                isCanPalce = false;
            }
        }

        if (isCanPalce) {
            for (var i = 0; i < commonHexagon.length; i++) {
                var node = commonHexagon[i];
                if (node) {
                    var id = node.getCanPlaceGridID();

                    node.setID(id);

                    node.doPlace(this.gridView.getGridNodeByID(id));

                    this.hexagonNodeMgr.addHexagonNode(node);

                    isSuccess = true;
                }
            }
        }

        if (isSuccess) {
            this.synthesiCount = 0;

            this.commonGenerator.resetRotation();
            this.notPlaceNodeMgr.removeCommonHexagon();
        }

        return isSuccess;
    },

    //放置万能方块
    PlaceUniversalNode() {
        if (!this.notPlaceNodeMgr) {
            return false;
        }

        var universalHexagon = this.notPlaceNodeMgr.getUniversalHexagon();
        if (!universalHexagon) {
            return false;
        }

        var isSuccess = false;

        if (universalHexagon.getIsCanPlace()) {
            isSuccess = true;
            var id = universalHexagon.getCanPlaceGridID();

            var type = this.ChangedType(id, this.synthesiNum - 1);

            this.notPlaceNodeMgr.removeUniversalHexagon();

            universalHexagon.setID(id);
            universalHexagon.setIsCanPlace(false);
            universalHexagon.setType(type);
            universalHexagon.updateTexture();
            universalHexagon.doPlace(this.gridView.getGridNodeByID(id));
            this.hexagonNodeMgr.addHexagonNode(universalHexagon);
        }
        return isSuccess;
    },

    //放置炸弹
    PlaceBombNode() {
        if (!this.notPlaceNodeMgr) {
            return false;
        }

        var bombHexagon = this.notPlaceNodeMgr.getBombHexagon();
        if (!bombHexagon) {
            return false;
        }

        var isSuccess = false;

        if (bombHexagon.getIsCanPlace()) {
            isSuccess = true;
            var id = bombHexagon.getCanPlaceGridID();

            bombHexagon.setID(id);
            bombHexagon.setIsCanPlace(false);
            bombHexagon.doPlace(this.gridView.getGridNodeByID(id));
            this.hexagonNodeMgr.addHexagonNode(bombHexagon);

            this.notPlaceNodeMgr.removeBombHexagon();
        }

        return isSuccess;
    },

    //放置万能块成功
    PlaceUniversalSuccess() {
        this.synthesiCount = 0;

        //刷新数据
        var universalNum = Game.GameData.GetUniversalNum();
        Game.GameData.SetUniversalNum(universalNum - 1);

        Game.EventCenter.DispatchEvent(Game.MessageType.Refresh_UI);

        //检查是否可以合成
        this.synthesiNum = 3;
    },

    //放置炸弹成功
    PaceBombSuccess() {
        if (!this.hexagonNodeMgr) {
            return;
        }

        //刷新数据
        var bombNum = Game.GameData.GetBombNum();
        Game.GameData.SetBombNum(bombNum - 1);

        //刷新ui
        Game.EventCenter.DispatchEvent(Game.MessageType.Refresh_UI);

        //移除炸弹方块
        var bombID = this.hexagonNodeMgr.getBombNodeID();
        this.hexagonNodeMgr.removeHexagonNodeByID(bombID);
    },

    //根据万能方块的规则变换类型
    ChangedType(id, num) {
        var type = null;
        for (var i = HexagonType.HT_Min + 1; i < HexagonType.HT_Max - 1; i++) {
            this.AddHexagonTagByType(id, i);
            var count = this.hexagonNodeMgr.getCheckTagNum(i);
            this.hexagonNodeMgr.resetCheckTagNode();

            if (count >= num) {
                type = i;
                break;
            }
        }
        if (type != null) {
            return type;
        } else {
            return this.ChangedType(id, num - 1);
        }
    },

    //设置可放置的网格暗淡显示
    ShowGridDim() {
        if (!this.notPlaceNodeMgr) {
            return;
        }

        //添加标记
        this.CheckPlace();

        //普通方块检测
        var commonHexagon = this.notPlaceNodeMgr.getCommonHexagon();
        if (commonHexagon && commonHexagon.length > 0) {
            var isCanPlace = true;
            for (var i = 0; i < commonHexagon.length; i++) {
                var node = commonHexagon[i];
                if (node == null || node.getIsCanPlace() == false) {
                    isCanPlace = false;
                }
            }
            if (isCanPlace) {
                this.ResetGridViewHint();
                for (var i = 0; i < commonHexagon.length; i++) {
                    var node = commonHexagon[i];
                    this.gridView.showDim(node.getCanPlaceGridID());
                }
            }
        }

        //特殊方块检测
        var specialHexagon = this.notPlaceNodeMgr.getSpecialHexagon();
        if (specialHexagon && specialHexagon.length > 0) {
            for (var i = 0; i < specialHexagon.length; i++) {
                var node = specialHexagon[i];
                if (node && node.getIsCanPlace()) {
                    this.ResetGridViewHint();
                    this.gridView.showDim(node.getCanPlaceGridID());
                }
            }
        }
    },

    //设置可以合成的最小数量
    SetSythesiNum(num) {
        this.synthesiNum = num;
    },

    //获得标记过的方块ID
    GetCheckTagNodeID() {
        if (!this.hexagonNodeMgr) {
            return;
        }

        return this.hexagonNodeMgr.getCheckTagNodeID();
    },

    //获得某个id周围指定圈数的所有方块id
    GetAroundNodeIDByID(id, circleNum) {
        var hexagonArr = [];

        if (circleNum > 1) {
            var oneCircle = this.GetAroundNodeIDByID(id, circleNum - 1);

            for (var i = 0; i < oneCircle.length; i++) {
                var id = oneCircle[i];
                var newCircle = this.GetOneAroundNodeIDByID(id);
                hexagonArr = hexagonArr.concat(newCircle);
            }
            //去重
            hexagonArr = Util.RemoveDuplicate(hexagonArr);
            return hexagonArr;
        } else {
            return this.GetOneAroundNodeIDByID(id);
        }
    },

    //获得某个id周围一圈的所有网格id并标记有方块的网格
    GetOneAroundNodeIDByID(id) {
        var hexagonArr = [];

        for (var i = DirectionType.DT_Min + 1; i < DirectionType.DT_Max; i++) {
            var newID = this.gridMgr.getIDByDirection(i, id);
            if (this.gridMgr.isValidID(newID)) {
                var hexagonNode = this.hexagonNodeMgr.getHexagonNodeByID(newID);
                if (hexagonNode && hexagonNode.getCheckTag() == false && hexagonNode.getID() != id) {
                    hexagonNode.setCheckTag(true);
                }
                hexagonArr.push(newID);
            }
        }

        return hexagonArr;
    },

    //根据合成规则标记某个id周围所有类型相同并且可以连在一起的方块
    AddHexagonTagByType(id, type) {

        for (var i = DirectionType.DT_Min + 1; i < DirectionType.DT_Max; i++) {
            var newID = this.gridMgr.getIDByDirection(i, id);
            if (this.gridMgr.isValidID(newID)) {
                var hexagonNode = this.hexagonNodeMgr.getHexagonNodeByID(newID);
                if (hexagonNode && hexagonNode.getType() == type && hexagonNode.getCheckTag() == false) {
                    //找到后标记一下
                    hexagonNode.setCheckTag(true);
                    this.AddHexagonTagByType(newID, type);
                }
            }
        }
    },

    //获得当前合成的方块数量
    GetCurSynthesiNum() {
        return this.curSynthesiNum;
    },

    //获得当前合成的方块类型
    GetCurSynthesiType() {
        return this.curSynthesiType;
    },

    //获得连续合成的次数
    GetCurSynthesiCount() {
        return this.synthesiCount;
    },

    //获得当前正在合成的方块
    GetCurSynthesiHexagon() {
        if (!this.hexagonNodeMgr) {
            return;
        }

        var hexagonNode = this.hexagonNodeMgr.getHexagonNodeByID(this.curSynthesiID);

        return hexagonNode;
    },

    //获得普通方块生成器
    GetHexagonGenerator() {
        return this.commonGenerator;
    },

    //获得方块的管理器
    GetHexagonMgr() {
        return this.hexagonNodeMgr;
    },

    //获得未放置到网格上的方块管理器
    GetNotPlaceNodeMgr() {
        return this.notPlaceNodeMgr;
    },

    //获得底层的网格管理器
    GetGridViewMgr() {
        return this.gridView;
    },

    FrameOnMove() {
        this.ShowGridDim();
    },

    //更新历史最高分
    UpdateHighestScore() {
        var curHighestScore = Game.GameData.GetHeighestScore();
        var curScore = Game.GameData.GetCurScore();
        if (curScore > curHighestScore) {
            Game.GameData.SetHeighestScore(curScore);
        }
    },

    //读档
    ReadGameArchive() {
        //放置到网格上的方块
        var hexagonData = Game.GameData.GetHexagonData();
        if (hexagonData) {

            var idArr = [];
            var typeArr = [];

            for (var key in hexagonData) {
                var id = key;
                var type = hexagonData[key];

                idArr.push(id);
                typeArr.push(type);
            }

            this.PlaceSpecifiedNodeByID(typeArr, idArr);
        }

        //随机生成的方块
        var randomHexagonData = Game.GameData.GetRandomHexagon();
        if (randomHexagonData) {
            var posType = Game.GameData.GetCurPosType();
            var maxType = Game.GameData.GetMaxType();
            if (randomHexagonData.length > 0) {
                this.GenerateSpecifiedHexagon(randomHexagonData, posType);
            }
            if (maxType > 0) {
                this.SetMaxRandomNum(maxType);
            }
        }
    },

    //保存网格上的方块数据
    SaveHexagonData() {
        if (!this.hexagonNodeMgr) {
            return;
        }

        //重置
        Game.GameData.ResetHexagonData();

        //保存放置到网格上的方块
        var allHexagon = this.hexagonNodeMgr.getAllHexagonNode();
        if (allHexagon) {
            for (var i = 0; i < allHexagon.length; i++) {
                var hexagon = allHexagon[i];
                if (hexagon) {
                    var id = hexagon.getID();
                    var type = hexagon.getType();
                    //保存方块id和类型
                    Game.GameData.AddHexagon(type, id);
                }
            }
        }
    },

    //保存随机生成的方块
    SaveRandomHexagon() {
        if (!this.notPlaceNodeMgr) {
            return;
        }

        Game.GameData.ResetRandomHexagonData();

        var commonHexagon = this.notPlaceNodeMgr.getCommonHexagon();
        if (commonHexagon && commonHexagon.length > 0) {
            for (var i = 0; i < commonHexagon.length; i++) {
                var hexagon = commonHexagon[i];
                if (hexagon) {
                    var type = hexagon.getType();
                    //保存方块id和类型
                    Game.GameData.AddRandomHexagon(type);
                }
            }
        }
    },

    //保存分数
    SaveScoreData(score) {
        Game.GameData.SetCurScore(score);
    },

    //重置存档数据
    ResetGameArchive() {
        Game.GameData.ResetGameArchive();
    },

    // update (dt) {},
});
