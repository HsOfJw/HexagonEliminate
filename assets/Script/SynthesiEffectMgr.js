var Util = require("Util");

cc.Class({
    extends: cc.Component,

    properties: {
      
    },

    playEffect(id, hexagonNodeVec){
        if(!hexagonNodeVec){
            return;
        }

        var targetPos = null;

        for(var i = 0;i < hexagonNodeVec.length; i++){
            var hexagonNode = hexagonNodeVec[i];
            if(hexagonNode && hexagonNode.getID() == id){
                targetPos = hexagonNode.getPosition();
                break;
            }
        }

        for(var i = 0;i < hexagonNodeVec.length; i++){
            var hexagonNode = hexagonNodeVec[i];
            if(hexagonNode && hexagonNode.getID() != id){
                var startPos = hexagonNode.getPosition();
                var synthesiEffect = Game.SynthesiEffectPool.GetEffectObj();
                synthesiEffect.setStartPos(startPos);
                var rotate = cc.radiansToDegrees(cc.pAngleSigned(cc.pSub(targetPos, startPos), cc.p(0,1)));
                rotate -= 45;
                synthesiEffect.zIndex = 10;
                synthesiEffect.rotation = rotate;
                synthesiEffect.setTargetPos(targetPos);
                synthesiEffect.parent = hexagonNode.parent;
                var sprite = Util.GetComponent(hexagonNode, cc.Sprite);
                // Util.SetNodeSprteFrame(synthesiEffect, sprite.spriteFrame);
                // synthesiEffect.scale = 0.5;
                synthesiEffect.startPlay();
            }
        }

    },

    // onLoad () {},

    start () {

    },

    // update (dt) {},
});
