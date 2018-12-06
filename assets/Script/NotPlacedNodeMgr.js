var HexagonType = require("HexagonType");
var SceneCom = require("SceneCom");

cc.Class({
    extends: cc.Component,

    properties: {

    },

    allHexagonNode: null,

    onLoad () {
        this.allHexagonNode = [];
    },

    onDestroy(){
        for(var i = 0;i < this.allHexagonNode.length;i ++){
            if(this.allHexagonNode[i] && this.allHexagonNode[i].isValid){
                // Game.HexagonPool.PutHexagonObj(this.allHexagonNode[i]);
                this.allHexagonNode[i].destroy();
            }
        }

        this.allHexagonNode.length = 0;
    },

    //添加一个方块
    addHexagonNode(node){
        if(!node){
            return;
        }

        if(!this.allHexagonNode){
            return;
        }

        this.allHexagonNode.push(node);
    },

    //获得所有方块
    getAllHexagon(){
        return this.allHexagonNode;
    },

    //获得所有方块的个数(无视类型)
    getHexagonCount(){
        return this.allHexagonNode.length;
    },

    //根据索引获得方块(无视类型)
    getHexagonByIndex(index){
        if(!this.allHexagonNode){
            return null;
        }

        if(index < 0 || index >= this.allHexagonNode.length){
            return null;
        }

        return this.allHexagonNode[index];
    },

    //获得普通方块
    getCommonHexagon(){
        if(!this.allHexagonNode){
            return null;
        }

        var commonHexagon = [];

        for(var i = 0;i < this.allHexagonNode.length;i ++){
            var hexagon = this.allHexagonNode[i];
            if(hexagon && this.isCommonType(hexagon.getType())){
                commonHexagon.push(hexagon);
            }   
        }

        return commonHexagon;
    },

    //获得万能方块
    getUniversalHexagon(){
        if(!this.allHexagonNode){
            return null;
        }

        var universalHexagon = null;

        for(var i = 0;i < this.allHexagonNode.length;i ++){
            var hexagon = this.allHexagonNode[i];
            if(hexagon && hexagon.getType() == HexagonType.HT_Universal){
                universalHexagon = hexagon;
            }   
        }

        return universalHexagon;
    },

    //获得炸弹方块
    getBombHexagon(){
        if(!this.allHexagonNode){
            return null;
        }

        var bombHexagon = null;

        for(var i = 0;i < this.allHexagonNode.length;i ++){
            var hexagon = this.allHexagonNode[i];
            if(hexagon && hexagon.getType() == HexagonType.HT_Bomb){
                bombHexagon = hexagon;
            }   
        }

        return bombHexagon;
    },


    //获得特殊方块
    getSpecialHexagon(){
        if(!this.allHexagonNode){
            return null;
        }

        var specialHexagon = [];

        for(var i = 0;i < this.allHexagonNode.length;i ++){
            var hexagon = this.allHexagonNode[i];
            if(hexagon && this.isSpecialType(hexagon.getType())){
                specialHexagon.push(hexagon);
            }   
        }

        return specialHexagon;
    },

    //是否有普通方块
    isHaveCommonHexagon(){
        if(!this.allHexagonNode){
            return null;
        }

        for(var i = 0;i < this.allHexagonNode.length;i ++){
            var hexagon = this.allHexagonNode[i];
            if(hexagon && this.isCommonType(hexagon.getType())){
                return true;
            }   
        }

        return false;
    },

    //是否有万能方块
    isHaveUniversalNode(){
        if(!this.allHexagonNode){
            return null;
        }

        for(var i = 0;i < this.allHexagonNode.length;i ++){
            var hexagon = this.allHexagonNode[i];
            if(hexagon && hexagon.getType() == HexagonType.HT_Universal){
                return true;
            }   
        }

        return false;
    },

    //是否有炸弹方块
    isHaveBombNode(){
        if(!this.allHexagonNode){
            return null;
        }

        for(var i = 0;i < this.allHexagonNode.length;i ++){
            var hexagon = this.allHexagonNode[i];
            if(hexagon && hexagon.getType() == HexagonType.HT_Bomb){
                return true;
            }   
        }

        return false;
    },

    //移除普通方块
    removeCommonHexagon(){
        if(!this.allHexagonNode){
            return null;
        }

        for(var i = this.allHexagonNode.length - 1;i >= 0;i --){
            var hexagon = this.allHexagonNode[i];
            if(hexagon && this.isCommonType(hexagon.getType())){
                this.allHexagonNode.splice(i, 1);
            }   
        }

        // Game.EventCenter.DispatchEvent(Game.MessageType.Random_Hexagon_Event);
    },

    //移除万能方块
    removeUniversalHexagon(){
        if(!this.allHexagonNode){
            return null;
        }

        for(var i = this.allHexagonNode.length - 1;i >= 0;i --){
            var hexagon = this.allHexagonNode[i];
            if(hexagon && hexagon.getType()  == HexagonType.HT_Universal){
                this.allHexagonNode.splice(i, 1);
            }   
        }
    },

    //移除炸弹方块
    removeBombHexagon(){
        if(!this.allHexagonNode){
            return null;
        }

        for(var i = this.allHexagonNode.length - 1;i >= 0;i --){
            var hexagon = this.allHexagonNode[i];
            if(hexagon && hexagon.getType()  == HexagonType.HT_Bomb){
                this.allHexagonNode.splice(i, 1);
            }   
        }
    },

    //是否为普通方块类型
    isCommonType(type){
        if(type > HexagonType.HT_Min && type <= HexagonType.HT_2048){
            return true;
        }  
        return false;
    },

    //是否为特殊方块类型
    isSpecialType(type){
        if(type > HexagonType.HT_2048 && type < HexagonType.HT_Max){
            return true;
        }  
        return false;
    },
    // update (dt) {},
});
