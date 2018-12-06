var DirectionType = require("DirectionType");

cc.Class({
    extends: cc.Component,

    properties: {
    },

    middleY: null,//3
    gridVec: null,//二维数组
    gridNum: null,//格子总数

    allID: null,

    // use this for initialization
    onLoad: function () {
        this.allID = [];
        this.generateTwoDimension()
    },

    onDestroy(){
        this.allID.length = 0;
        this.gridVec.length = 0;
    },

    //生成一个六角网格的二维数组    
    generateTwoDimension(){
        var grid = [];
        
        var config = [4,5,6,7,6,5,4];

        var count = 0;
        for(var j = 0; j < config.length; j ++){
            var line = [];
            for(var i = 0; i < config[j]; i ++){
                line.push(i);
                count ++;
                this.allID.push(count);
            }
            grid.push(line);
        }

        this.gridNum = count;

        this.middleY = parseInt(grid.length / 2);

        this.gridVec = grid;
    },

   //传进一个id 返回位置    将id和位置对应起来  id--> setTag
    convertIDToTID(id){
        var tempID = 1;

        if(this.isValidID(id)){
            for(var i = 0;i < this.gridVec.length;i ++){
                for(var j = 0; j < this.gridVec[i].length; j++){
                    if(tempID == id){
                        return cc.v2(j, i);// I:行数--y  J:列数--x
                    }
                    tempID ++;
                }
            }
        }
        return null;
    },
    //传进一个位置 返回id
    convertTIDToID(vec){
        var tempID = 1;

        if(vec.x < 0 || vec.y < 0){
            return 0;
        }

        if(this.gridVec.length <= vec.y || this.gridVec[vec.y].length <= vec.x){
            return 0;
        }

        for(var i = 0;i < this.gridVec.length;i ++){
            for(var j = 0; j < this.gridVec[i].length; j++){
                if(vec.x == j && vec.y == i){
                    return tempID;
                }
                tempID ++;
            }
        }


        return 0;
    },

    //根据一个点的id找到六个方向上的id
    getLeftID(id){
        var tid = this.convertIDToTID(id);

        tid.x --;

        return this.convertTIDToID(tid);
    },


    getRightID(id){
        var tid = this.convertIDToTID(id);

        tid.x ++;

        return this.convertTIDToID(tid);
    },

    getLeftUpID(id){
        var tid = this.convertIDToTID(id);

        if(tid.y < this.middleY){
            tid.y ++;
        }else{
            tid.x --;
            tid.y ++;
        }

        return this.convertTIDToID(tid);
    },

    getLeftDownID(id){
        var tid = this.convertIDToTID(id);

        if(tid.y > this.middleY){
            tid.y --;
        }else{
            tid.x --;
            tid.y --;
        }

        return this.convertTIDToID(tid);
    },

    getRightDownID(id){
        var tid = this.convertIDToTID(id);

        if(tid.y <= this.middleY){
            tid.y --;
        }else{
            tid.x ++;
            tid.y --;
        }

        return this.convertTIDToID(tid);
    },

    getRightUpID(id){
        var tid = this.convertIDToTID(id);

        if(tid.y >= this.middleY){
            tid.y ++;
        }else{
            tid.x ++;
            tid.y ++;
        }

        return this.convertTIDToID(tid);
    },

    getIDByDirection(direction, id){
        var newid = 0;

        switch(direction){
            case DirectionType.DT_Left:
                newid = this.getLeftID(id);
            break;
            case DirectionType.DT_Right:
                newid = this.getRightID(id);
            break;
            case DirectionType.DT_LeftUp:
                newid = this.getLeftUpID(id);
            break;
            case DirectionType.DT_LeftDown:
                newid = this.getLeftDownID(id);
            break;
            case DirectionType.DT_RightUp:
                newid = this.getRightUpID(id);
            break;
            case DirectionType.DT_RightDown:
                newid = this.getRightDownID(id);
            break;
        }
        return newid;
    },
    
    getGridData(){
        return this.gridVec;
    },

    getAllGridID(){
        return this.allID;
    },

    // 判断id是否有效
    isValidID(id){
        if(id >= 1 && id <= this.gridNum){
            return true;
        }
        return false;
    },

    // called every frame
    update: function (dt) {
    },
});
