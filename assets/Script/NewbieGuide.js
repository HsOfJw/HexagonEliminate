var Util = require("Util");
var BaseCom = require("BaseCom");

cc.Class({
    extends: BaseCom,

    properties: {

    },

    fingerNode: null,       //手指

    aperture: null, //光圈

    curStep : null,         //当前步数

    totalStep: null,        //总步数

    onLoad () {
        this.curStep = 1;
        this.totalStep = 4;
    },

    start () {

    },

    doEnter(){
        this._super();

        this.curStep = 1;
    },

    isGuide(){
        return this.curStep <= this.totalStep;
    },
    //开始新手引导部分
    startGuide(){
        if(!Game.GameLogic){
            return false;
        }

        if(this.curStep > this.totalStep){
            return false;
        }

        //方块生成器
        var hexagonGenerator = Game.GameLogic.GetHexagonGenerator();
        if(!hexagonGenerator){
            return false;
        }

        //网格管理器
        var gridViewMgr = Game.GameLogic.GetGridViewMgr();
        if(!gridViewMgr){
            return false;
        }

        var startPos = hexagonGenerator.getSelfWorldPos();

        //分步执行
        switch(this.curStep){
            case 1:
            {
                //生成两个2，并放置到指定位置
                Game.GameLogic.GenerateSpecifiedHexagon([1, 1], 2);
                Game.GameLogic.PlaceNodeByID([18, 25]);
                //再生成一个2
                Game.GameLogic.GenerateSpecifiedHexagon([1]);
                //使目标网格高亮显示
                gridViewMgr.showHighlighted(19);
                //手指进行引导滑动
                var endPos = gridViewMgr.getWorldPosByID(19);
                this.fingerAction(startPos, endPos);

                this.curStep ++;
                break;
            }
            case 2:
            {
                //生成两个2
                Game.GameLogic.GenerateSpecifiedHexagon([1, 1], 2);
                //使目标网格高亮显示
                gridViewMgr.showHighlighted(18);
                gridViewMgr.showHighlighted(25);
                //手指进行引导滑动
                var endPos = gridViewMgr.getWorldPosByID(18);
                this.fingerAction(startPos, endPos);

                this.curStep ++;
                break;
            }
            case 3:
            {
                Game.GlobalVar.canClick = true;

                //再生成一个2和一个4
                Game.GameLogic.GenerateSpecifiedHexagon([2,1], 1);
                this.initAperture(startPos);
                //手指进行引导滑动
                this.fingerClickAction(startPos);

                this.curStep ++;
                break;
            }
            case 4:
            {
                this.removeAperture();
                //使目标网格高亮显示
                gridViewMgr.showHighlighted(12);
                gridViewMgr.showHighlighted(13);
                //手指进行引导滑动
                var endPos = gridViewMgr.getWorldPosByID(12);
                this.fingerAction(startPos, endPos);
                this.curStep ++;
                break;
            }
        }

        return true;
    },

    //手指点击效果
    fingerClickAction(startPos){
        if(!startPos){
            return;
        }

        if(!this.fingerNode){
            this.initFinger();
        }

        this.fingerNode.stopAllActions();

        startPos.x += 8;

        var newstartPos = this.node.convertToNodeSpaceAR(startPos);
        var newendPos = cc.v2(newstartPos.x, newstartPos.y + 20);

        this.fingerNode.opacity = 255;
        this.fingerNode.setPosition(newstartPos);

        var moveAction = new cc.moveTo(0.3, newendPos);
        var moveAction2 = new cc.moveTo(0.3, newstartPos);

        var sequence = new cc.sequence(moveAction, moveAction2);

        this.fingerNode.runAction(new cc.repeatForever(sequence));
    },

    //手指滑动
    fingerAction(startPos, endPos){
        if(!startPos || !endPos){
            return;
        }

        if(!this.fingerNode){
            this.initFinger();
        }

        this.fingerNode.stopAllActions();

        var self = this;

        var newstartPos = this.node.convertToNodeSpaceAR(startPos);
        var newendPos = this.node.convertToNodeSpaceAR(endPos);

        var resetFunc = new cc.callFunc(function(){
            self.fingerNode.setPosition(newstartPos);
            self.fingerNode.opacity = 255;
        });
        var moveAction = new cc.moveTo(GameConfig.NewbieGuideMoveDuration, newendPos);
        var fadeOutAction = new cc.fadeOut(0.3);

        var sequence = new cc.sequence(resetFunc, moveAction, fadeOutAction);

        this.fingerNode.runAction(new cc.repeatForever(sequence));
    },

    initFinger(){
        this.fingerNode = Util.CreateSprite("FingerNode", cc.url.raw("resources/newbieGuide/finger.png"));
        this.fingerNode.setAnchorPoint(cc.v2(0.5, 1));

        this.node.addChild(this.fingerNode, 2);
    },

    initAperture(startPos){
        var self = this;

        self.aperture = Util.CreateSprite("FingerNode", cc.url.raw("resources/newbieGuide/guangquan.png"));
        self.node.addChild(self.aperture, 1);
        var pos = self.node.convertToNodeSpaceAR(startPos);
        self.aperture.position = pos;

        var resetAction = new cc.callFunc(function(){
            self.aperture.scale = 1;
            self.aperture.opacity = 255;
        });
        var scaleAction = new cc.scaleTo(0.4, 1.5);
        var fadeOutAction = new cc.fadeOut(0.4);

        var spawn = new cc.spawn(scaleAction, fadeOutAction);

        self.aperture.runAction(new cc.repeatForever(new cc.sequence(resetAction, spawn)));
    },

    removeAperture(){
        this.aperture.destroy();
    },

    stopFingerAction(){
        this.fingerNode.opacity = 0;
        this.fingerNode.stopAllActions();
    }
    // update (dt) {},
});
