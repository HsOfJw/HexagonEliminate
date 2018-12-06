var Util = require("Util");
var BaseCom = require("BaseCom");
var ObjectType = require("ObjectType");
var WXHelper = require("WXHelper");
var ShareSceneType = require("ShareSceneType");
var AdvertiseMgr = require("AdvertiseMgr");
var AdvertiseConfig = require("AdvertiseConfig");

cc.Class({
    extends: BaseCom,

    properties: {
        //当前分数
        curScoreNode: cc.Node,

        //重新生成方块按钮
        reproduceBtn: cc.Node,
        //暂停按钮
        pauseBtn: cc.Node,
        //求助好友按钮
        forHelpBtn: cc.Node,

        forHelpImg: cc.Node,


        //重新生成方块ui数量
        reproduceNum: cc.Node,
        //万能方块的数量
        universalNum: cc.Node,
        //炸弹ui的数量
        bombNum: cc.Node,

        //炸弹节点
        bombNode: cc.Node,
        //万能块节点
        universalNode: cc.Node,

        //替换ui领取
        replaceReceivedUI: cc.Node,

        //万能方块领取
        universalReceivedUI: cc.Node,

        //侧边栏按钮
        cblBtn: cc.Node,

        //侧边栏预制体
        cblPrefab: cc.Prefab,

        jjcyNode: cc.Node,
    },

    //宝箱
    chestNode: null,

    onLoad() {
        this.screenAdaptation(this.node);

        Util.RegBtnClickEvent(this.reproduceBtn, this.reproduceClicked.bind(this));
        Util.RegBtnClickEvent(this.pauseBtn, this.pauseBtnClicked.bind(this));
        Util.RegBtnClickEvent(this.forHelpBtn, this.forHelpBtnClicked.bind(this));
        Util.RegBtnClickEvent(this.cblBtn, this.cblBtnClicked.bind(this));

        this.registerEvent(Game.MessageType.DragCom_Clicked_Event, this.propClicked.bind(this));

        if(cc.director.getWinSize().height / cc.director.getWinSize().width - 16 / 9 > 0.1)
        {
            this._UiUp();
        }
    },

    //新需求 将banner广告上移20个像素点  同时将ui图标上移
    _UiUp() {
        this.node.getChildByName("BombNode").getComponent(cc.Widget).bottom = 381;
        this.node.getChildByName("RefreshNode").getComponent(cc.Widget).bottom = 381;
        this.node.getChildByName("UniversalNode").getComponent(cc.Widget).bottom = 381;
    },
    start() {
    },

    initUI() {
        var curScore = Game.GameData.GetCurScore();
        var universalNum = Game.GameData.GetUniversalNum();
        var replaceNum = Game.GameData.GetReplaceNum();
        var bombNum = Game.GameData.GetBombNum();

        this.setUniversalNum(universalNum);
        this.setReproducelNum(replaceNum);
        this.setBombNum(bombNum);
        //刷新当前分数
        this.refreshScore(curScore);
    },

    startGuide() {
        Util.SetButtonInteractable(this.reproduceBtn, false);
        Util.SetButtonInteractable(this.pauseBtn, false);
        Util.SetButtonInteractable(this.forHelpBtn, false);
    },

    overGuide() {
        Util.SetButtonInteractable(this.reproduceBtn, true);
        Util.SetButtonInteractable(this.pauseBtn, true);
        Util.SetButtonInteractable(this.forHelpBtn, true);
    },

    cblBtnClicked() {
        if (this.cblPrefab) {
            var cblNode = cc.instantiate(this.cblPrefab);
            this.node.addChild(cblNode, 1000);
        }
    },

    //万能块ui点击
    propClicked(type) {
        if (type === ObjectType.OT_Universal && Game.GameData.GetUniversalNum() <= 0) {
            //点击万能ui
            cc.log("Universal");
            Game.AudioManager.PlayBtnSound();

            if (Game.GameData.GetReceivedUniversalNum() < GameConfig.ReceivePropNum) {
                if (WXHelper.IsWXContext()) {
                    WXHelper.CommonShare(ShareSceneType.ReceiveUnivalsal, function (res, isgroup) {
                        if (isgroup) {
                            Game.EventCenter.DispatchEvent(Game.MessageType.ReceiveUniversal_Event);
                        } else {
                            WXHelper.ShowToast(GameConfig.Share_Text1);
                        }
                    });
                } else {
                    Game.EventCenter.DispatchEvent(Game.MessageType.ReceiveUniversal_Event);
                }
            }
        }
    },

    //设置万能方块的数量
    setUniversalNum(num) {
        Util.SetNodeText(this.universalNum, num);

        if (this.universalNode) {
            var dragCom = Util.GetComponent(this.universalNode, "DragCom");
            if (dragCom) {
                dragCom.setIsCanDrag(num > 0);
            }

            if (Game.GameData.GetReceivedUniversalNum() < GameConfig.ReceivePropNum) {
                if (this.universalReceivedUI) {
                    this.universalReceivedUI.active = (num <= 0);
                }
            } else {
                this.universalReceivedUI.active = false;
            }
        }
    },

    //设置更换ui的数量
    setReproducelNum(num) {
        Util.SetNodeText(this.reproduceNum, num);

        if (Game.GameData.GetReceivedReplaceNum() < GameConfig.ReceivePropNum) {
            if (this.replaceReceivedUI) {
                this.replaceReceivedUI.active = (num <= 0);
            }
        } else {
            this.replaceReceivedUI.active = false;
        }
    },

    //设置炸弹ui的数量
    setBombNum(num) {
        Util.SetNodeText(this.bombNum, num);

        if (this.bombNode) {
            var dragCom = Util.GetComponent(this.bombNode, "DragCom");
            if (dragCom) {
                dragCom.setIsCanDrag(num > 0);
            }
        }

        if (Game.GlobalVar.showForHelp && num <= 0) {
            this.forHelpAction();
        }

        cc.log("Game.GameData.GetReceivedBombNum()", Game.GameData.GetReceivedBombNum());
        cc.log("GameConfig.ReceiveBombNum", GameConfig.ReceiveBombNum);

        this.forHelpBtn.active = (Game.GameData.GetReceivedBombNum() < GameConfig.ReceiveBombNum);
    },

    //求助提示动画
    forHelpAction() {
        if (this.forHelpImg) {
            var self = this;

            Game.GlobalVar.showForHelp = false;

            this.forHelpImg.active = true;

            var resetFunc = new cc.callFunc(function () {
                self.forHelpImg.scale = 1;
                self.forHelpImg.opacity = 255;
            });
            var delayTime = new cc.delayTime(0.5);

            var scaleAction = new cc.scaleTo(0.5, 2);
            var fadeoutAction = new cc.fadeOut(0.5);

            var spawn = new cc.spawn(scaleAction, fadeoutAction);

            this.forHelpImg.runAction(new cc.repeatForever(new cc.sequence(resetFunc, spawn, delayTime)));
        }
    },

    stopForHelpAction() {
        if (this.forHelpImg) {
            this.forHelpImg.stopAllActions();
            this.forHelpImg.destroy();

            this.forHelpImg = null;
        }
    },

    //创建一个宝箱
    createBox() {
        var prefab = Util.GetPrefab("prefab/TrasureChestBtn");
        if (!prefab) return;

        var boxNode = cc.instantiate(prefab);
        if (boxNode) {
            this.node.addChild(boxNode);
            var boxCom = Util.GetComponent(boxNode, "TrasureChest");
            if (boxCom) {
                boxCom.startMove();
            }
            this.chestNode = boxNode;
            Util.RegBtnClickEvent(boxNode, this.boxBtnClicked.bind(this));
        }
    },

    //移除宝箱
    removeBox() {
        if (this.chestNode) {
            this.chestNode.destroy();
            this.chestNode = null;
        }
    },

    isHaveBox() {
        return this.chestNode != null;
    },

    //求助好友按钮
    forHelpBtnClicked(event) {
        if (Game.GlobalVar.IsGuide) {
            return;
        }

        Game.AudioManager.PlayBtnSound();

        var self = this;

        var func = function () {
            self.stopForHelpAction();
            Game.GameData.SetBombNum(Game.GameData.GetBombNum() + 1);
            Game.GameData.SetReceivedBombNum(Game.GameData.GetReceivedBombNum() + 1);
            self.initUI();
        };

        var prefab = Util.GetPrefab("prefab/ReceiveBomb");
        if (!prefab) return;

        var receivedBomb = cc.instantiate(prefab);
        if (receivedBomb) {
            this.node.addChild(receivedBomb);
            receivedBomb.getComponent("ReceiveBomb").setCallback(function () {
                var bombVideoCount = Game.GameData.GetBombVideoCount();
                if (bombVideoCount >= 5) {
                    //超过5次分享领取
                    if (WXHelper.IsWXContext()) {
                        //分享
                        WXHelper.CommonShare(ShareSceneType.ForHelpFriend, function (res, isgroup) {
                            if (isgroup) {
                                func();
                            }
                        });
                    } else {
                        func();
                    }
                } else {
                    if (WXHelper.IsWXContext()) {
                        //创建视频广告
                        AdvertiseMgr.CreateVideoAd(AdvertiseConfig.ADConfig_Bomb_Video, function (isFinish) {
                            if (isFinish) {
                                func();
                                Game.GameData.SetBombVideoCount(bombVideoCount + 1);
                            }
                        });
                    } else {
                        func();
                    }
                }
            });
            this.screenAdaptation(receivedBomb);
        }

        cc.log("GetBombNum", Game.GameData.GetBombNum());
        cc.log("GetReceivedBombNum", Game.GameData.GetReceivedBombNum());
    },

    //点击宝箱按钮
    boxBtnClicked() {
        Game.AudioManager.PlayBtnSound();

        this.showChestsLayer();
    },

    //点击重新生产方块按钮
    reproduceClicked() {
        if (Game.GlobalVar.IsGuide) {
            return;
        }


        if (Game.GameData.GetReplaceNum() <= 0) {
            if (Game.GameData.GetReceivedReplaceNum() < GameConfig.ReceivePropNum) {
                Game.AudioManager.PlayBtnSound();
                cc.log("Replace");
                if (WXHelper.IsWXContext()) {
                    WXHelper.CommonShare(ShareSceneType.ReceiveReplace, function (res, isgroup) {
                        if (isgroup) {
                            Game.EventCenter.DispatchEvent(Game.MessageType.ReceiveReplace_Event);
                        } else {
                            WXHelper.ShowToast(GameConfig.Share_Text1);
                        }
                    });
                } else {
                    Game.EventCenter.DispatchEvent(Game.MessageType.ReceiveReplace_Event);
                }
            }
            return;
        }

        Game.AudioManager.PlayBtnSound();

        Game.EventCenter.DispatchEvent(Game.MessageType.Reproduce_Hexagon);

        var replaceNum = Game.GameData.GetReplaceNum();
        Game.GameData.SetReplaceNum(replaceNum - 1);

        //刷新ui
        this.setReproducelNum(Game.GameData.GetReplaceNum());
    },

    //点击暂停按钮
    pauseBtnClicked() {
        if (Game.GlobalVar.IsGuide) {
            return;
        }

        Game.AudioManager.PlayBtnSound();

        var prefab = Util.GetPrefab("prefab/PauseLayer");
        if (!prefab) return;

        var pauseLayerNode = cc.instantiate(prefab);
        if (pauseLayerNode) {
            this.node.addChild(pauseLayerNode);
            this.screenAdaptation(pauseLayerNode);
        }
    },

    //打开结束界面
    openOverLayer() {
        var prefab = Util.GetPrefab("prefab/GameOverLayer");
        if (!prefab) return;

        var overLayerNode = cc.instantiate(prefab);
        if (overLayerNode) {
            this.node.addChild(overLayerNode);
            this.screenAdaptation(overLayerNode);
        }
    },

    //显示道具层
    showPropsLayer() {
        // var prefab = Util.GetPrefab("prefab/PropsLayer");
        // if(!prefab)return;

        // var propsLayerNode = cc.instantiate(prefab);
        // if(propsLayerNode){
        //     this.node.addChild(propsLayerNode);
        //     Util.SetWidgetTarget(propsLayerNode, this.node.parent);
        // }
    },

    //显示宝箱层
    showChestsLayer() {
        var prefab = Util.GetPrefab("prefab/TrasureChestLayer");
        if (!prefab) return;

        var chestsLayerNode = cc.instantiate(prefab);
        if (chestsLayerNode) {
            this.node.addChild(chestsLayerNode);
            Util.SetWidgetTarget(chestsLayerNode, this.node.parent);
        }
    },

    //显示即将超越
    showJJCYSprite() {
        // var prefab = Util.GetPrefab("prefab/JJCYSprite");
        // if(!prefab)return;

        // this.jjcyNode = cc.instantiate(prefab);
        // if(this.jjcyNode){
        //     this.node.addChild(this.jjcyNode);
        //     Util.SetWidgetTarget(this.jjcyNode, this.node.parent);
        // }
    },

    //显示perfect的特效
    showPerfectEffect() {
        var prefab = Util.GetPrefab("prefab/PerfectNode");
        if (!prefab) return;

        var perfectNode = cc.instantiate(prefab);
        if (perfectNode) {

            perfectNode.scale = 0.1;

            var scaleAction1 = new cc.scaleTo(0.3, 1.2);
            var scaleAction2 = new cc.scaleTo(0.1, 1);
            var delayTime = new cc.delayTime(0.7);
            var fadeOutAction = new cc.fadeOut(0.3);
            var removeSelf = new cc.removeSelf();
            var sequenceAction = new cc.sequence(scaleAction1, scaleAction2, delayTime, fadeOutAction, removeSelf);

            this.node.addChild(perfectNode);

            perfectNode.runAction(sequenceAction);
        }
    },

    //显示分数特效
    showScore(pos, score, callback) {

        if (Util.IsArray(pos) == false) {
            pos = [pos];
        }

        if (Util.IsArray(score) == false) {
            score = [score];
        }

        for (var i = 0; i < pos.length; i++) {
            var posItem = pos[i];
            var scoreItem = score[i];
            var myposItem = this.node.convertToNodeSpaceAR(posItem);
            var scoreNode = Game.ScoreObjPool.GetScoreObj();
            if (scoreNode) {
                var scoreCom = Util.GetComponent(scoreNode, "ScoreCom");
                if (scoreCom) {
                    if (i == (pos.length - 1)) {
                        scoreCom.showScore(myposItem, scoreItem, callback);
                    } else {
                        scoreCom.showScore(myposItem, scoreItem, null);
                    }
                }
                this.node.addChild(scoreNode);
            }
        }
    },

    screenAdaptation(node) {
        var children = node.children;
        for (var i = 0; i < children.length; i++) {
            var child = children[i];
            Util.SetWidgetTarget(child, this.node.parent);
        }
    },

    //刷新当前分数
    refreshScore() {
        var curScore = Game.GameData.GetCurScore();

        Util.SetNodeText(this.curScoreNode, curScore);
    },

    // update (dt) {},
});
