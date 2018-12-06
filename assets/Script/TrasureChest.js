var Util = require("Util");

cc.Class({
    extends: cc.Component,

    properties: {
       
    },

    onLoad () {
        var self = this;

        this.count = GameConfig.TrasureChestAnimCount;
        this.isStartPlay = false;
        this.recordTime = 0;

        var anim = Util.GetComponent(this.node, cc.Animation);
        if(anim){
            anim.on("finished", function(){
                self.playFinish();
            });
            var animState = anim.getAnimationState('shakingAnim');
            if(animState){
                animState.repeatCount = GameConfig.TrasureChestAnimCount;
            }
        }
    },

    start () {

    },

    startMove(){
        var self = this;

        this.node.opacity = 30;

        var moveaction = new cc.moveBy(1.5, cc.v2(0, -505));
        var newmoveaction = moveaction.easing(cc.easeSineOut(2));
        var fadeIn = new cc.fadeIn(0.7);
        var spawn = new cc.spawn(newmoveaction, fadeIn);

        var callback = new cc.callFunc(function(){
            self.playFinish();
        });

        this.node.runAction(new cc.sequence(spawn, callback));
    },

    playEffect(){
     
        var anim = Util.GetComponent(this.node, cc.Animation);
        if(anim){
            anim.play("shakingAnim");
        }
    },

    playFinish(){
        this.scheduleOnce(this.playEffect.bind(this), GameConfig.TrasureChestAnimInterval);
    },
    
    stopEffect(){
        var anim = Util.GetComponent(this.node, cc.Animation);
        if(anim){
            anim.stop("shakingAnim");
        }
    },

    update (dt) {
    },
});
