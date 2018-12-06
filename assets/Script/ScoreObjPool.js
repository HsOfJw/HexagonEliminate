window.Game = window.Game || {};

var Util = require("Util");

Game.ScoreObjPool = {

    scoreObjPool: null,

    initCount: null,

    InitPool(){
        this.scoreObjPool = new cc.NodePool();

        this.initCount = 10;

        var prefab = Util.GetPrefab("prefab/ScoreNode");

        for (let i = 0; i < this.initCount; ++i) {
            var scoreNode = cc.instantiate(prefab);
            this.scoreObjPool.put(scoreNode); // 通过 putInPool 接口放入对象池
        }
    },

    GetScoreObj(){
        let scoreObj = null;

        if(this.scoreObjPool){
            // 通过 size 接口判断对象池中是否有空闲的对象
            if (this.scoreObjPool.size() > 0) { 
                scoreObj = this.scoreObjPool.get();
            } else { 
                // 如果没有空闲对象，也就是对象池中备用对象不够时，我们就用 cc.instantiate 重新创建
                var prefab = Util.GetPrefab("prefab/ScoreNode");
                scoreObj = cc.instantiate(prefab);
            }

            var scoreCom = Util.GetComponent(scoreObj, "ScoreCom");
            if(scoreCom){
                scoreCom.init();
            }
        }

        return scoreObj;
    },

    PutScoreObj(scoreObj){
        if(this.scoreObjPool){
            this.scoreObjPool.put(scoreObj); 
        }
    },

    DestroyPool(){
        if(this.scoreObjPool){
            this.scoreObjPool.clear();
        }
        this.scoreObjPool = null;
    }
};
