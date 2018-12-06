var Util = require("Util");
var HexagonType = require("HexagonType");

cc.Class({
    extends: cc.Component,

    allHexagonNode: null,

    onLoad(){
        this.allHexagonNode = [];
    },

    onDestroy(){
        if(this.allHexagonNode){
            for(var i = 0;i < this.allHexagonNode.length;i ++){
                if(this.allHexagonNode[i]){
                    this.allHexagonNode[i].destroy();
                // Game.HexagonPool.PutHexagonObj(this.allHexagonNode[i]);
                }
            }
            this.allHexagonNode.length = 0;
        }
    },

    //添加一个方块
    addHexagonNode(hexagonNode){
        if(!this.allHexagonNode){
            return;
        }

        this.allHexagonNode.push(hexagonNode);

        Game.EventCenter.DispatchEvent(Game.MessageType.Add_Hexagon_Event);
    },

    //根据id获得方块
    getHexagonNodeByID(id){
        if(!this.allHexagonNode){
            return;
        }

        for(var i = 0;i < this.allHexagonNode.length;i ++){
            var hexagonNode = this.allHexagonNode[i];
            if(hexagonNode && hexagonNode.getID() == id){
                return hexagonNode;
            } 
        }
        return null;
    },

    //是否包含某个方块
    isContainHexagon(id){
        if(!this.allHexagonNode){
            return false;
        }

        for(var i = 0;i < this.allHexagonNode.length;i ++){
            var hexagonNode = this.allHexagonNode[i];
            if(hexagonNode && hexagonNode.getID() == id){
                return true;
            } 
        }
        return false;
    },

    //根据id移除方块
    removeHexagonNodeByID(id){
        if(!this.allHexagonNode){
            return;
        }

        for(var i = 0;i < this.allHexagonNode.length;i ++){
            var hexagonNode = this.allHexagonNode[i];
            if(hexagonNode && hexagonNode.getID() == id){
                Game.HexagonPool.PutHexagonObj(hexagonNode);
                this.allHexagonNode.splice(i, 1);
            } 
        }

        Game.EventCenter.DispatchEvent(Game.MessageType.Remove_Hexagon_Event);
    },


    //移除所有方块(逻辑和界面的双重意义上)
    removeAllHexagonNode(){
        if(!this.allHexagonNode){
            return;
        }

        for(var i = 0;i < this.allHexagonNode.length;i ++){
            var hexagonNode = this.allHexagonNode[i];
            if(hexagonNode){
                Game.HexagonPool.PutHexagonObj(hexagonNode);
            } 
        }

        this.allHexagonNode.length = 0;

        Game.EventCenter.DispatchEvent(Game.MessageType.Remove_Hexagon_Event);
    },

    //判断是否包含id相同的方块
    isHaveHexagonNode(id){
        if(!this.allHexagonNode){
            return false;
        }

        for(var i = 0;i < this.allHexagonNode.length;i ++){
            var hexagonNode = this.allHexagonNode[i];
            if(hexagonNode && hexagonNode.getID() == id){
                return true;
            } 
        }
        return false;
    },

    //获得添加过标记的方块数量
    getCheckTagNum(type){
        var count = 0;

        if(!this.allHexagonNode){
            return count;
        }

        for(var i = 0;i < this.allHexagonNode.length;i ++){
            var hexagonNode = this.allHexagonNode[i];
            if(hexagonNode){
                var hexagonCom = Util.GetComponent(hexagonNode, "HexagonCom");
                if(hexagonCom && hexagonCom.getCheckTag() && hexagonCom.getType() == type){
                    count ++;
                }
            } 
        }
        return count;
    },

    //获得添加过标记的方块
    getCheckTagNode(type){
        var nodes = [];

        if(!this.allHexagonNode){
            return nodes;
        }

        for(var i = 0;i < this.allHexagonNode.length;i ++){
            var hexagonNode = this.allHexagonNode[i];
            if(hexagonNode){
                if(hexagonNode.getCheckTag() && hexagonNode.getType() == type){
                        nodes.push(hexagonNode);
                }
            } 
        }
        return nodes;
    },

    //获得添加过标记的方块ID
    getCheckTagNodeID(){
        var ids = [];

        if(!this.allHexagonNode){
            return ids;
        }

        for(var i = 0;i < this.allHexagonNode.length;i ++){
            var hexagonNode = this.allHexagonNode[i];
            if(hexagonNode){
                if(hexagonNode.getCheckTag()){
                    ids.push(hexagonNode.getID());
                }
            } 
        }
        return ids;
    },

    //合成方块
    synthesiHexagon(id, type){
        if(!this.allHexagonNode){
            return null;
        }

        for(var i = this.allHexagonNode.length - 1; i >= 0; i --){
            var hexagonNode = this.allHexagonNode[i];
            if(hexagonNode && hexagonNode.getCheckTag() && hexagonNode.getType() == type){
                if(hexagonNode.getID() == id){
                    hexagonNode.doSynthesi();
                }else{
                    Game.HexagonPool.PutHexagonObj(hexagonNode);
                    this.allHexagonNode.splice(i, 1);
                }
            } 
        }

        Game.EventCenter.DispatchEvent(Game.MessageType.Remove_Hexagon_Event);
    },

    //重置可合成标记
    resetCheckTagNode(){
        if(!this.allHexagonNode){
            return null;
        }

        for(var i = this.allHexagonNode.length - 1; i >= 0; i --){
            var hexagonNode = this.allHexagonNode[i];
            if(hexagonNode){
                var hexagonCom = Util.GetComponent(hexagonNode, "HexagonCom");
                if(hexagonCom && hexagonCom.getCheckTag()){
                    hexagonCom.setCheckTag(false);
                }
            } 
        }
    },

    //重置优先检测的标记
    resetPriortyState(){
        if(!this.allHexagonNode){
            return null;
        }

        for(var i = this.allHexagonNode.length - 1; i >= 0; i --){
            var hexagonNode = this.allHexagonNode[i];
            if(hexagonNode && hexagonNode.getIsPriorityCheck()){
                hexagonNode.setIsPriorityCheck(false);
            } 
        }
    },

    //获得标记合成点的方块(检测合成用, 已排序)
    getSynthesiNode(){
        var nodes = [];

        if(!this.allHexagonNode){
            return nodes;
        }

        for(var i = this.allHexagonNode.length - 1; i >= 0; i --){
            var hexagonNode = this.allHexagonNode[i];
            if(hexagonNode && hexagonNode.getIsSynthesiNode()){
                nodes.push(hexagonNode);
            } 
        }

        function Sort(arr){
            var compare = function (node_a, node_b) {
                if (node_a.getIsPriorityCheck() < node_b.getIsPriorityCheck()) {
                    return 1;
                }

                if (node_a.getType() < node_b.getType()) {
                    return -1;
                } else if (node_a.getType() > node_b.getType()) {
                    return 1;
                } else{
                    return 0;
                }
            };
        
            arr.sort(compare);
        }

        Sort(nodes);

        return nodes;
    },

    //获得炸弹方块的id
    getBombNodeID(){
        if(!this.allHexagonNode){
            return;
        }

        for(var i = 0;i < this.allHexagonNode.length;i ++){
            var hexagonNode = this.allHexagonNode[i];
            if(hexagonNode && hexagonNode.getType() == HexagonType.HT_Bomb){
                return hexagonNode.getID();
            } 
        }

        return 0;
    },

    //获得2048方块
    getAll2048Node(){
        if(!this.allHexagonNode){
            return;
        }

        var node2048arr = [];

        for(var i = 0;i < this.allHexagonNode.length;i ++){
            var hexagonNode = this.allHexagonNode[i];
            if(hexagonNode && hexagonNode.getType() == HexagonType.HT_2048){
                node2048arr.push(hexagonNode);
            } 
        }

        return node2048arr;
    },

    //获得炸弹方块
    getBombNode(){
        if(!this.allHexagonNode){
            return;
        }

        for(var i = 0;i < this.allHexagonNode.length;i ++){
            var hexagonNode = this.allHexagonNode[i];
            if(hexagonNode && hexagonNode.getType() == HexagonType.HT_Bomb){
                return hexagonNode;
            } 
        }

        return null;
    },


    getAllHexagonNode(){
        return this.allHexagonNode;
    },

    // update (dt) {},
});
