var Util = require("Util");
var HexagonType = require("HexagonType");
var HexagonNode = require("HexagonNode");
var BaseCom = require("BaseCom");
var ObjectType = require("ObjectType");

//普通方块生成器
cc.Class({
    extends: BaseCom,

    properties: {
    },

    //方块的宽度
    hexagonNodeWidth: null,

    //方块的高度
    hexagonNodeHeight: null,

    //是否正在执行动作
    bIsAction: null,       

    onLoad(){
        this.hexagonNodeWidth = 90;
        this.hexagonNodeHeight = 101;

        this.bIsAction = false;

        Util.ScreenAdaptation(this.node);

        this.registerEvent(Game.MessageType.DragCom_Clicked_Event, this.rotationHexagonNode.bind(this));
    },

    onDestroy(){
        this._super();
    },

    resetRotation(){
        this.node.rotation = 0;
    },

    rotationHexagonNode(type){
        if(this.bIsAction){
            return;
        }

        if(type != ObjectType.OT_Common){
            return;
        }

        if(!Game.GameLogic){
            return;
        }

        var notPlaceNodeMgr = Game.GameLogic.GetNotPlaceNodeMgr();
        if(!notPlaceNodeMgr){
            return;
        }

        var commonHexagon = notPlaceNodeMgr.getCommonHexagon();
        if(!commonHexagon){
            return;
        }

        //一个不转
        if(commonHexagon.length <= 1){
            return;
        }

        if(Game.GlobalVar.IsGuide && Game.GlobalVar.canClick == false){
            return;
        }


        //播放音效
        Game.AudioManager.PlaySoundEffect(Game.SoundType.ST_RotateHexagon);

        //公转
        var revolutionAction = new cc.rotateBy(GameConfig.HexagonNodeRotateDuration, 180);
        
        this.node.runAction(revolutionAction);

        for(var i = 0; i < commonHexagon.length; i ++){
            //自转
            var rotationAction = new cc.rotateBy(GameConfig.HexagonNodeRotateDuration, 180);
            var node = commonHexagon[i];
            if(node && rotationAction){
                node.runAction(rotationAction);
            }
        }

        this.scheduleOnce(this.actionFinish.bind(this), GameConfig.HexagonNodeRotateDuration);

        this.bIsAction = true;


        if(Game.GlobalVar.canClick){
            //引导时只能点击一次旋转
            Game.GlobalVar.canClick = false;
            Game.EventCenter.DispatchEvent(Game.MessageType.Start_Guide);
        }
    },

    //旋转动作执行完毕
    actionFinish(){
        this.bIsAction = false;
    },

    //重新生成随机方块
    reproduce(){
        //销毁当前的普通方块
        this.destroyCurNode();

        //随机生成方块
        this.produce();

        this.resetRotation();
    },

    //生成指定的方块
    produceSpecified(specifiedID, posType){
        if(!specifiedID || specifiedID.length < 0){
            return;
        }

        if(!Game.GameLogic){
            return;
        }

        var notPlaceNodeMgr = Game.GameLogic.GetNotPlaceNodeMgr();
        if(!notPlaceNodeMgr){
            return;
        }
        
        if(notPlaceNodeMgr.isHaveCommonHexagon()){
            return;
        }

        //记录当前位置类型
        Game.GameData.SetCurPosType(posType);

        var gridNum = specifiedID.length;
        
        var posArr = null;

        if(gridNum == 2){
            posArr = this.getProducePos(posType);
        }

        for(var i = 0; i < gridNum;i ++){
            var type = specifiedID[i];
            var hexagonNode = Game.HexagonPool.GetHexagonObj(type);

            this.node.addChild(hexagonNode);

            notPlaceNodeMgr.addHexagonNode(hexagonNode);

            if(gridNum == 1){
                continue;
            }

            hexagonNode.setPosition(posArr[i]);
        }

        this.setSynthesiNode();

        Game.EventCenter.DispatchEvent(Game.MessageType.Random_Hexagon_Event);
    },

    //随机生成方块
    produce(){
        // this.produceGrid_Test();
        // return;
        var notPlaceNodeMgr = Game.GameLogic.GetNotPlaceNodeMgr();
        if(!notPlaceNodeMgr){
            return;
        }

        if(notPlaceNodeMgr.isHaveCommonHexagon()){
            return;
        }

        var gridNum = Util.RandomNum(1, 5) >= 3 ? 2 : 1;

        //只能放一个了
        if(Game.GameData.GetMaxHexagonCount() <= 1){
            gridNum = 1;
        }

        var posArr = null;

        //生成的是两块
        if(gridNum == 2){
            var allPosType = Game.GameData.GetHexagonPosType();
            if(allPosType && allPosType.length > 0){

                var posType = Util.RandomElement(allPosType);
                posArr = this.getProducePos(posType);//  1,2,3
    
                if(!posType || posType.length <= 0){
                    return;
                }

                //记录当前位置类型
                Game.GameData.SetCurPosType(posType);
            }
        }

        var maxType = Game.GameData.GetMaxType();
        var minType = HexagonType.HT_2;
        if(maxType > HexagonType.HT_128){
            minType = maxType - 6;
        }

        for(var i = 0; i < gridNum;i ++){
            cc.log("minType：", minType, "maxType:",maxType);
            var type = Util.RandomNum(minType, maxType);

            var hexagonNode = Game.HexagonPool.GetHexagonObj(type);

            this.node.addChild(hexagonNode);

            notPlaceNodeMgr.addHexagonNode(hexagonNode);

            if(gridNum == 1){
                continue;
            }

            hexagonNode.setPosition(posArr[i]);
        }

        this.setSynthesiNode();

        Game.EventCenter.DispatchEvent(Game.MessageType.Random_Hexagon_Event);
    },

    //生成方块测试用
    produceGrid_Test(){
        var notPlaceNodeMgr = Game.GameLogic.GetNotPlaceNodeMgr();

        if(!notPlaceNodeMgr){
            return;
        }

        if(notPlaceNodeMgr.isHaveCommonHexagon()){
            return;
        }

        var gridNum = 1;

        if(this.testIndex && this.testIndex == 5){
            gridNum = 2;
        }

        var posArr = null;

        if(gridNum == 2){
            var posType = Util.RandomNum(1, 1);
            posArr = this.getProducePos(posType);
        }

        if(!this.testProduce){
            this.testProduce = [];
            this.testProduce.push(HexagonType.HT_1024);
            this.testProduce.push(HexagonType.HT_1024);
            this.testProduce.push(HexagonType.HT_512);
            this.testProduce.push(HexagonType.HT_512);
            this.testProduce.push(HexagonType.HT_512);

            this.testIndex = 0;
        }

        for(var i = 0; i < gridNum;i ++){
            var type = this.testProduce[this.testIndex ++];
            var hexagonNode = new HexagonNode(type);
            this.node.addChild(hexagonNode);

            notPlaceNodeMgr.addHexagonNode(hexagonNode);

            if(!this.hexagonNodeWidth || !this.hexagonNodeHeight){
                this.hexagonNodeWidth = hexagonNode.width;
                this.hexagonNodeHeight = hexagonNode.height;
            }

            if(gridNum == 1){
                continue;
            }

            hexagonNode.setPosition(posArr[i]);
        }

        this.setSynthesiNode();
    },

    //根据类型获得合成时的位置 1:横向 2:右上方 3:左上方
    getProducePos(type){
        var posArr = [];
        switch(type){
            case 1:
            {
                posArr[0] = cc.v2(0 - this.hexagonNodeWidth * 0.5, 0);
                posArr[1] = cc.v2(0 + this.hexagonNodeWidth * 0.5, 0);
                break;
            }
            case 2:
            {
                posArr[0] = cc.v2(0 + this.hexagonNodeWidth * 0.25, 0 + this.hexagonNodeHeight * 0.4);
                posArr[1] = cc.v2(0 - this.hexagonNodeWidth * 0.25, 0 - this.hexagonNodeHeight * 0.4);
                break;
            }
            case 3:
            {
                posArr[0] = cc.v2(0 - this.hexagonNodeWidth * 0.25, 0 + this.hexagonNodeHeight * 0.4);
                posArr[1] = cc.v2(0 + this.hexagonNodeWidth * 0.25, 0 - this.hexagonNodeHeight * 0.4);
                break;
            }
        }
        return posArr;
    },

    //设置合成的节点
    setSynthesiNode(){
        var notPlaceNodeMgr = Game.GameLogic.GetNotPlaceNodeMgr();
        if(!notPlaceNodeMgr){
            return;
        }

        if(notPlaceNodeMgr.isHaveCommonHexagon() == false){
            return;
        }

        var commonHexagon = notPlaceNodeMgr.getCommonHexagon();

        commonHexagon[0].setIsSynthesiNode(true);

        if(commonHexagon.length > 1){
            if(commonHexagon[0].getType() != commonHexagon[1].getType()){
                commonHexagon[1].setIsSynthesiNode(true);
            }else{
                //提示合成位置的方块
                commonHexagon[0].setSynthesiPosHint(true);
            }
        }
    },

    //销毁当前生成的普通方块
    destroyCurNode(){
        var notPlaceNodeMgr = Game.GameLogic.GetNotPlaceNodeMgr();
        if(!notPlaceNodeMgr){
            return;
        }

        if(notPlaceNodeMgr.isHaveCommonHexagon() == false){
            return;
        }

        var commonNode = notPlaceNodeMgr.getCommonHexagon();
        if(!commonNode){
            return;
        }
        for(var i = 0;i < commonNode.length;i ++){
            var node = commonNode[i];
            if(node){
                Game.HexagonPool.PutHexagonObj(node);
            }
        }

        //从管理器里移除
        notPlaceNodeMgr.removeCommonHexagon();
    },

    getSelfWorldPos(){
        var pos = this.node.parent.convertToWorldSpaceAR(cc.v2(0, 0));
        return pos;
    }
    // update (dt) {},
});
