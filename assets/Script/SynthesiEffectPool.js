window.Game = window.Game || {};

var SynthesiEffect = require("SynthesiEffect");

Game.SynthesiEffectPool = {

    effectPool: null,

    initCount: null,

    InitPool(){
        this.effectPool = new cc.NodePool();

        this.initCount = 10;

        for (let i = 0; i < this.initCount; ++i) {
            var effectNode = new SynthesiEffect();
            this.effectPool.put(effectNode);
        }
    },

    GetEffectObj(){
        let effectNode = null;

        if (this.effectPool.size() > 0) { 
            effectNode = this.effectPool.get();
        } else { 
            effectNode = new SynthesiEffect();
        }
        if(effectNode){
            effectNode.init();
        }

        return effectNode;
    },

    PutEffectObj(effectNode){
        if(this.effectPool){
            this.effectPool.put(effectNode); 
        }
    },

    DestroyPool(){
        if(this.effectPool){
            this.effectPool.clear();
        }
        this.effectPool = null;
    }
};
