window.Game = window.Game || {};

var HexagonNode = require("HexagonNode");

Game.HexagonPool = {

    hexagonPool: null,

    initCount: null,

    InitPool(){
        this.hexagonPool = new cc.NodePool();

        this.initCount = 40;

        for (let i = 0; i < this.initCount; ++i) {
            var hexagonNode = new HexagonNode();
            this.hexagonPool.put(hexagonNode); // 通过 putInPool 接口放入对象池
        }
    },

    GetHexagonObj(type){
        let hexagonObj = null;

        if(this.hexagonPool){
            // 通过 size 接口判断对象池中是否有空闲的对象
            if (this.hexagonPool.size() > 0) { 
                hexagonObj = this.hexagonPool.get();
            } else { 
                // 如果没有空闲对象，也就是对象池中备用对象不够时，我们就用 cc.instantiate 重新创建
                hexagonObj = new HexagonNode();
            }


            if(hexagonObj){
                hexagonObj.init();

                if(type){
                    hexagonObj.setType(type);
                    hexagonObj.updateTexture();
                }
            }
        }

        return hexagonObj;
    },

    PutHexagonObj(hexagonObj){
        if(this.hexagonPool){
            hexagonObj.stopAllActions();
            this.hexagonPool.put(hexagonObj); 
        }
    },

    DestroyPool(){
        if(this.hexagonPool){
            this.hexagonPool.clear();
        }
        this.hexagonPool = null;
    }
};
