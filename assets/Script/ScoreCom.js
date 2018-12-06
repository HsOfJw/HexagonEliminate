var Util = require("Util");

cc.Class({
    extends: cc.Component,

    properties: {
    },

    onLoad () {
        // this.node.active = false;
    },  

    start () {

    },

    init(){
        this.node.x = 0;
        this.node.y = 0;

        //默认先缩放至最小(为了做放大的动画)
        this.node.active = true;
        this.node.opacity = 255;
        this.node.setScale(0.1);
    },

    showScore(pos, score, callback){
        var self = this;

        pos.y += 40;

        this.node.setPosition(pos);
        Util.SetNodeText(this.node, score);

        //先放大到正常大小
        var scaleAction = new cc.scaleTo(GameConfig.Score_Effect_Scale_Duration, 0.5, 0.5);
        //然后延时
        var delayAction = new cc.delayTime(GameConfig.Score_Effect_Delay_Time);
        //最后上移和渐隐
        var moveAction = new cc.moveBy(GameConfig.Score_Effect_Move_Duration, 0, GameConfig.Score_Effect_Move_Height);
        var fadeOutAction = new cc.fadeOut(GameConfig.Score_Effect_Move_Duration);
        var spawn = new cc.spawn(moveAction, fadeOutAction);
        //回调函数
        var func = new cc.callFunc(function(){
            //回收
            Game.ScoreObjPool.PutScoreObj(self.node);

            if(callback){
                callback();
            }
        });

        var sequence = new cc.sequence(scaleAction, delayAction, spawn, func);

        this.node.runAction(sequence);
    }

    // update (dt) {},
});
