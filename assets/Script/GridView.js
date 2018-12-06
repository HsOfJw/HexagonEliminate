var Util = require("Util");
var SceneCom = require("SceneCom");

/**
 *  思想就是一个Mgr去管理  管理所有的逻辑
 *
 */


cc.Class({
    extends: cc.Component,

    gridSpriteFrame: null,

    allGridSprite: null,

    curHighlightedID: null, //当前高亮的网格id

    onLoad(){
        this.allGridSprite = [];
        this.gridSpriteFrame = new cc.SpriteFrame(cc.loader.getRes("gamescene/gridSprite"));

        Util.ScreenAdaptation(this.node);//适配当前节点
    },

    onDestroy(){
        this.node.removeAllChildren(true);

        this.gridSpriteFrame = null;

        this.allGridSprite.length = 0;

        this.curHighlightedID = 0;
    },
    //根据坐标位置生成
    generateGridView(gridData){
        if(!gridData){
            return;
        }

        if(!this.gridSpriteFrame){
            return;
        }

        var top = 240;   //距离屏幕上方的尺寸
        var offectX = 6;
        var offectY = -15;
        var maxLineNumIndex = parseInt(gridData.length / 2);//3
        var maxLineNum = gridData[maxLineNumIndex].length;//7
        var gridwidth = this.gridSpriteFrame.getRect().width;//获取 SpriteFrame 的纹理矩形区域100
        var gridheight = this.gridSpriteFrame.getRect().height;//90

        var id = 1;

        for(var i = 0;i < gridData.length;i ++){
            var line = gridData[i];
            var offect = (maxLineNum - line.length) * gridwidth * 0.5;
            for(var j = 0; j < line.length; j ++){
                var gridSprite = Util.CreateSpriteWithFrame("GridSprite", this.gridSpriteFrame);
                gridSprite.x = offect + gridwidth * j + offectX * j + gridwidth * 0.5;
                gridSprite.y = i * gridheight + i * offectY + gridheight * 0.5;
                gridSprite.myid = id;
                gridSprite.opacity = 20;
                gridSprite.color = new cc.color(0, 0, 0, 255);
                this.node.addChild(gridSprite);

                this.allGridSprite.push(gridSprite);

                id++;
            }
        }

        this.node.setAnchorPoint(cc.p(0, 0));
        this.node.width = maxLineNum * gridwidth + (maxLineNum - 1) * offectX;
        this.node.height = maxLineNum * gridheight + (maxLineNum - 1) * offectY;
        this.node.x = 0 - this.node.width * this.node.scaleX * 0.5;
        this.node.y = cc.winSize.height * 0.5 - this.node.height * this.node.scaleY - top;
    },

    getGridNodeByID(id){
        for(var i = 0;i < this.allGridSprite.length;i ++){
            var gridNode = this.allGridSprite[i];
            if(gridNode && gridNode.myid == id){
                return gridNode;
            }
        }
    },

    getGridIDByWorldPos(worldPos){
        var pos = this.node.convertToNodeSpaceAR(worldPos);

        for(var i = 0;i < this.allGridSprite.length; i++){
            var gridSprite = this.allGridSprite[i];
            if(gridSprite && Util.GetDistance(gridSprite.getPosition(), pos) <= GameConfig.MinDistance){
                return gridSprite.myid;
            }
        }

        return -1;
    },

    //重置网格显示
    resetGridNode(){
        for(var i = 0;i < this.allGridSprite.length;i ++){
            var gridNode = this.allGridSprite[i];
            if(gridNode){
                // gridNode.color = new cc.Color(0, 0 ,0, 255);
                gridNode.opacity = 20;
            }
        }
    },

    //可以放置的提示,使其变灰暗
    showDim(id){
        var gridNode = this.getGridNodeByID(id);
        if(gridNode){
            // gridNode.color = new cc.Color(50, 50 ,50, 255);
            gridNode.opacity = 100;
        }
    },

    //新手引导的高光提示
    showHighlighted(id){
        if(!this.curHighlightedID){
            this.curHighlightedID = [];
        }

        var gridNode = this.getGridNodeByID(id);
        if(gridNode){
            this.curHighlightedID.push(id);

            //代码去创建预制体  无需创建节点池
            var posHint = Util.CreateSprite("Highlighted", cc.url.raw("resources/newbieGuide/posFlag.png"));
            posHint.setPosition(gridNode.getPosition());
            posHint.setTag(id);
            this.node.addChild(posHint);
        }
    },

    //隐藏新手引导的高光提示 销毁高光节点
    hideHighlighted(){
        if(!this.curHighlightedID){
            return;
        }

        for(var i = 0;i < this.curHighlightedID.length;i ++){
            var highlightedSp = this.node.getChildByTag(this.curHighlightedID[i]);
            if(highlightedSp){
                highlightedSp.destroy();
            }
        }

        this.curHighlightedID.length = 0;
    },

    //判断是否是高光
    isHighlightedID(id){
        if(!this.curHighlightedID){
            return;
        }

        for(var i = 0; i < this.curHighlightedID.length; i ++){
            if(this.curHighlightedID[i] == id){
                return true;
            }
        }

        return false;
    },

    //得到世界坐标
    getWorldPosByID(id){
        var gridNode = this.getGridNodeByID(id);

        if(gridNode){
            var pos = gridNode.convertToWorldSpaceAR(cc.v2(0, 0));
            return pos;
        }
        return null;
    },
    // update (dt) {},
});
