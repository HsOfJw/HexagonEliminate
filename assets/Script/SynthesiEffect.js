cc.Class({
    extends: cc.Node,

    properties: {
       
    },

    targetPos: null,

    ctor(){
        this.setName("SynthesiEffect");

        var sprite = this.addComponent(cc.Sprite);
        sprite.spriteFrame = new cc.SpriteFrame(cc.url.raw("resources/gamescene/effect.png"));
        this.scale = 0.8;

        if(arguments.length > 0){
            this.setPosition(arguments[0]);
        }
    },

    init(){

    },

    setStartPos(startPos){
        this.setPosition(startPos);
    },

    setTargetPos(targetPos){
        this.targetPos = targetPos;
    },

    startPlay(){
        if(!this.targetPos){
            return;
        }

        var self = this;

        var newVec = this.targetPos.sub(this.getPosition()); 
        var normalizeVec = newVec.normalize();

        newVec = newVec.sub(cc.v2(normalizeVec.x * this.height * 0.3, normalizeVec.y * this.height * 0.3));

        var moveAction = new cc.moveBy(GameConfig.SynthesiEffectDuration, newVec);
        var deleteSelf = new cc.callFunc(function(){
            Game.SynthesiEffectPool.PutEffectObj(self);
        });

        this.runAction(new cc.sequence(moveAction, deleteSelf));
    },

    // onLoad () {},

    start () {

    },

    // update (dt) {},
});
