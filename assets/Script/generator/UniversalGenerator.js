var Util = require("Util");
var HexagonType = require("HexagonType");
var HexagonNode = require("HexagonNode");
var BaseCom = require("BaseCom");

//万能方块生成器
cc.Class({
    extends: cc.Component,

    properties: {
    },

    onLoad(){
    },

    //生成万能方块
    produce(){
        if(!Game.GameLogic){
            return;
        }

        var notPlaceNodeMgr = Game.GameLogic.GetNotPlaceNodeMgr();
        if(!notPlaceNodeMgr){
            return;
        }

        if(notPlaceNodeMgr.isHaveUniversalNode()){
            return;
        }

        var hexagonNode = Game.HexagonPool.GetHexagonObj(HexagonType.HT_Universal);

        hexagonNode.setIsSynthesiNode(true);
        this.node.addChild(hexagonNode);
        notPlaceNodeMgr.addHexagonNode(hexagonNode);
    },

    // update (dt) {},
});
