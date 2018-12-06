var Util = require("Util");
var HexagonType = require("HexagonType");
var HexagonNode = require("HexagonNode");
var BaseCom = require("BaseCom");

//炸弹方块生成器
cc.Class({
    extends: cc.Component,

    properties: {
    },

    onLoad(){

    },

    //生成炸弹方块
    produce(){
        if(!Game.GameLogic){
            return;
        }

        var notPlaceNodeMgr = Game.GameLogic.GetNotPlaceNodeMgr();
        if(!notPlaceNodeMgr){
            return;
        }

        if(notPlaceNodeMgr.isHaveBombNode()){
            return;
        }

        var hexagonNode = Game.HexagonPool.GetHexagonObj(HexagonType.HT_Bomb);

        hexagonNode.setIsSynthesiNode(true);
        this.node.addChild(hexagonNode);
        notPlaceNodeMgr.addHexagonNode(hexagonNode);
    },
});
