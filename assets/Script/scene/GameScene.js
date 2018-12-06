var Util = require("Util");
var SceneCom = require("SceneCom");
var DirectionType = require("DirectionType");
var HexagonType = require("HexagonType");
var ObjectType = require("ObjectType");
var WXHelper = require("WXHelper");
var GameRes = require("GameRes");
var AdvertiseMgr = require("AdvertiseMgr");
var AdvertiseConfig = require("AdvertiseConfig");

cc.Class({
    extends: SceneCom,

    properties: {},

    newbieGuide: null, //新手引导
    uiLayerMgr: null, //UI层
    synthesiEffectMgr: null, //合成特效
    bombEffectMgr: null, //爆炸特效管理

    onLoad() {
        console.log("进入到GameScene OnLoad 中");
    },

    start() {
    },

    init() {
        Game.GlobalVar.IsGuide = false;

        //初始化方块对象池
        Game.HexagonPool.InitPool();
        //初始化合成特效对象池
        Game.SynthesiEffectPool.InitPool();
        //初始化分数对象池
        Game.ScoreObjPool.InitPool();

        //初始化事件监听
        this.initEventListener();

        //生成底层的网格
        Game.GameLogic.GenerateGridView();

        //生成特殊的方块
        Game.GameLogic.GenerateSpecialHexagon();

        //即将超越
        this.uiLayerMgr.showJJCYSprite();

        //读取游戏存档
        Game.GameData.ReadGameArchive();

        if (Game.GameData.IsHasGameArchive()) {
            //有存档读档
            this.readGameArchive();
        } else {
            Game.GameLogic.InitGameData();

            if (GameConfig.openNewbieGuide) {
                //走新手引导
                Game.GlobalVar.IsGuide = true;
                GameConfig.openNewbieGuide = false;
                this.startGuide();
                this.uiLayerMgr.startGuide();
            } else {
                //随机生成普通的方块
                Game.GameLogic.GenerateRandomHexagon();
            }
        }

        if(cc.director.getWinSize().height / cc.director.getWinSize().width - 16 / 9 > 0.1)
        {
            this.node.getChildByName("ProduceHexagon").getComponent(cc.Widget).bottom = 323;
        }
    },

    doEnter() {
        this._super();

        //读取观看视频的次数
        Game.GameData.ReadVideoCount();

        //ui层(首先初始化，GameLogic要用)
        this.showUILayer();

        this.addGameComponent();

        this.init();

        this.refreshUI();

        //创建广告
        AdvertiseMgr.CreateBannerAd(AdvertiseConfig.ADConfig_Game_Banner);
    },

    doExit() {
        this._super();

        this.uiLayerMgr.node.destroy();

        this.node.removeComponent("GameLogic");
        this.node.removeComponent("NewbieGuide");
        this.node.removeComponent("SynthesiEffectMgr");
        this.node.removeComponent("BombEffectMgr");

        //销毁方块对象池
        Game.HexagonPool.DestroyPool();
        //销毁合成特效对象池
        Game.SynthesiEffectPool.DestroyPool();
        //销毁分数对象池
        Game.ScoreObjPool.DestroyPool();

        this.synthesiEffectMgr = null;
        this.bombEffectMgr = null;
        this.newbieGuide = null;

        // this.releaseGameRes();

        Game.GameData.Save();
    },

    //释放资源
    releaseGameRes() {
        var commonResArr = GameRes.CommonRes;

        //过滤掉公共资源
        var filterCommonRes = function (deps) {
            if (deps) {
                for (var ii = 0; ii < commonResArr.length; ii++) {
                    var commonRes = commonResArr[ii];
                    var index = deps.indexOf(commonRes);
                    if (index !== -1)
                        deps.splice(index, 1);
                }

            }
        };

        for (var i = 0; i < GameRes.GameSceneRes.length; i++) {
            var res = GameRes.GameSceneRes[i];
            var deps = cc.loader.getDependsRecursively(res);
            filterCommonRes(deps);
            cc.loader.release(deps);
        }
    },

    //读档
    readGameArchive() {
        //有存档就读档
        Game.GameLogic.ReadGameArchive();

        Game.GameLogic.CalcCurPosType();
    },

    //初始化事件监听
    initEventListener() {
        var self = this;

        //释放拖动中方块图形
        this.registerEvent(Game.MessageType.DragCom_Touch_End, function (type) {
            self.doPlaceOp(type);
        });

        //重新生成方块
        this.registerEvent(Game.MessageType.Reproduce_Hexagon, function () {
            //重新生成随机方块
            Game.GameLogic.RegenerateRandomHexagon();
        });

        //重新开始游戏
        this.registerEvent(Game.MessageType.Restart_Game, function () {
            self.restartGame();
        });

        //返回首页
        this.registerEvent(Game.MessageType.Return_Home_Page, function () {
            Game.SceneMgr.switchScene(Game.SceneType.StartScene, Game.SceneSwitchType.LeftToRight);
        });

        //领取宝箱
        this.registerEvent(Game.MessageType.ReceiveChest_Event, function () {
            Game.GameLogic.ReceiveChest();
        });

        //领取道具
        this.registerEvent(Game.MessageType.ReceiveProp_Event, function (data) {
            Game.GameLogic.ReceiveProp(data);
        });

        //领取替换UI
        this.registerEvent(Game.MessageType.ReceiveReplace_Event, function (data) {
            Game.GameLogic.ReceiveReplace(data);
        });

        //领取万能方块
        this.registerEvent(Game.MessageType.ReceiveUniversal_Event, function (data) {
            Game.GameLogic.ReceiveUniversal(data);
        });

        //领取宝箱成功
        this.registerEvent(Game.MessageType.ReceiveChest_Success, function () {
            self.uiLayerMgr.removeBox();
            self.refreshUI();
        });

        //执行新手引导
        this.registerEvent(Game.MessageType.Start_Guide, function () {
            self.startGuide();
        });

        //合成普通方块
        this.registerEvent(Game.MessageType.Synthesi_Hexagon_Event, function (id) {
            self.synthesiHexagon(id);
        });

        //合成2048
        this.registerEvent(Game.MessageType.Synthesi_2048_Event, function () {
            self.synthesi2048();
        });

        //刷新ui
        this.registerEvent(Game.MessageType.Refresh_UI, function () {
            self.refreshUI();
        });

        //当前分数更新
        this.registerEvent(Game.MessageType.CurScore_Update, function () {
            self.refreshCurScore();
            WXHelper.RefreshJJCYPlayer();
        });

        //添加方块到网格上
        this.registerEvent(Game.MessageType.Add_Hexagon_Event, function () {
            Game.GameLogic.SaveHexagonData();
        });

        //从网格上移除方块
        this.registerEvent(Game.MessageType.Remove_Hexagon_Event, function () {
            Game.GameLogic.SaveHexagonData();
        });

        //随机方块添加或移除事件
        this.registerEvent(Game.MessageType.Random_Hexagon_Event, function () {
            Game.GameLogic.SaveRandomHexagon();
        });

        //游戏结束
        this.registerEvent(Game.MessageType.Game_Over, function () {
            self.gameOver();
        });

        //复活
        this.registerEvent(Game.MessageType.Resurrection_Event, function () {
            self.resurrection();
        });
    },

    //添加脚本
    addGameComponent() {
        this.node.addComponent("GameLogic");
        this.synthesiEffectMgr = this.node.addComponent("SynthesiEffectMgr");
        this.bombEffectMgr = this.node.addComponent("BombEffectMgr");
    },

    //显示UI层
    showUILayer() {
        var prefab = Util.GetPrefab("prefab/UILayer");
        if (!prefab) return;

        var uiLayer = cc.instantiate(prefab);
        if (uiLayer) {
            this.node.addChild(uiLayer);
            this.uiLayerMgr = uiLayer.getComponent("UILayer");
        }
    },

    //打开结束界面
    openOverLayer() {
        this.uiLayerMgr.openOverLayer();
    },

    //执行新手引导
    startGuide() {
        if (!this.newbieGuide) {
            this.newbieGuide = this.node.addComponent("NewbieGuide");
        }

        this.newbieGuide.startGuide();
    },

    //重新开始游戏
    restartGame() {
        Game.GlobalVar.gameOver = false;
        //重置存档数据
        Game.GameLogic.ResetGameArchive();

        //移除所有放置到网格上的方块
        Game.GameLogic.RemoveAllHexagon();
        //重置随机库的最大数字类型
        Game.GameLogic.ResetMaxRandomNum();
        //重新生成随机方块
        Game.GameLogic.RegenerateRandomHexagon();

        Game.GameLogic.InitGameData();

        this.uiLayerMgr.initUI();
    },

    //游戏结束
    gameOver() {
        this.openOverLayer();

        //保存数据
        Game.GameData.Save();
    },

    //复活
    resurrection() {
        Game.GameLogic.ResurrectionLogic();

        this.synthesi2048();

        Game.GameLogic.GenerateRandomHexagon();
    },

    //刷新当前分数
    refreshCurScore() {
        //当前分数
        this.uiLayerMgr.refreshScore();
    },

    //刷新ui
    refreshUI() {
        this.uiLayerMgr.initUI();
    },

    //玩家执行放置的操作
    doPlaceOp(type) {
        var self = this;

        Game.GameLogic.SetSythesiNum(3);

        //操作普通方块
        if (type == ObjectType.OT_Common) {
            Game.GameLogic.CheckPlace();
            var success = Game.GameLogic.PlaceCommonNode();
            if (success) {
                //放置方块成功
                self.placeSucccess();
            } else {
                self.palceFail();
            }
            //操作万能方块
        } else if (type == ObjectType.OT_Universal) {
            Game.GameLogic.CheckPlace();
            var success = Game.GameLogic.PlaceUniversalNode();

            if (success) {
                //放置万能方块成功
                self.placeUniversalSuccess();
            } else {
                self.palceFail();
            }
            //操作炸弹方块
        } else if (type == ObjectType.OT_Bomb) {
            Game.GameLogic.CheckPlace();
            var success = Game.GameLogic.PlaceBombNode();

            if (success) {
                //放置炸弹成功
                self.placeBombSuccess();
            } else {
                self.palceFail();
            }
        }

        //重置网格可放置的提示
        Game.GameLogic.ResetGridViewHint();
    },

    //合成方块
    synthesiHexagon(id) {
        var hexagonMgr = Game.GameLogic.GetHexagonMgr();
        if (hexagonMgr) {
            var type = Game.GameLogic.GetCurSynthesiType();
            var checkTagNode = hexagonMgr.getCheckTagNode(type);
            this.playSynthesiEffect(id, checkTagNode);
        }
    },

    //合成2048
    synthesi2048() {
        var self = this;

        Game.AudioManager.PlaySoundEffect(Game.SoundType.ST_BombSound);

        var hexagonMgr = Game.GameLogic.GetHexagonMgr();
        if (!hexagonMgr) {
            return;
        }

        var allNode_2048 = hexagonMgr.getAll2048Node();
        if (!allNode_2048 || allNode_2048.length <= 0) {
            return;
        }

        for (var i = 0; i < allNode_2048.length; i++) {
            var node_2048 = allNode_2048[i];
            if (node_2048) {
                var fadeOut = new cc.fadeOut(0.3);
                var delayTime = new cc.delayTime(0.3);

                (function (node) {
                    var callback = new cc.callFunc(function () {
                        hexagonMgr.removeHexagonNodeByID(node.getID());
                    });
                    node.runAction(new cc.sequence(fadeOut, delayTime, callback));

                    //延迟周围方块的爆炸
                    self.scheduleOnce(function () {
                        //使2048方块的作用范围内的方块产生爆炸效果
                        self.hexagonBombByID(node.getID(), GameConfig.Hexagon_2048_Circle_Num);

                        Game.GameLogic.CalcCurPosType();
                    }, 0.31);

                    //播放特效
                    Util.AddAutoRemoveEffect(node, "prefab/2048Anim", "2048Anim");

                    //延迟显示分数
                    self.scheduleOnce(function () {
                        if (allNode_2048.length >= 3) {
                            self.showBaseScore(node);
                        } else {
                            self.showScore(node);
                        }
                    }, 0.3);
                }(node_2048));
            }
        }
    },

    //播放合成特效
    playSynthesiEffect(id, checkTagNode) {
        if (!this.synthesiEffectMgr) {
            return;
        }

        this.synthesiEffectMgr.playEffect(id, checkTagNode);

        //添加特效完成的定时器
        this.scheduleOnce(this.effectPlayFinish.bind(this), GameConfig.SynthesiEffectDuration);
    },


    //合成特效播放完成
    effectPlayFinish() {
        //播放音效
        var synthesiCount = Game.GameLogic.GetCurSynthesiCount();
        Game.AudioManager.PlaySynthesiSound(synthesiCount);

        //移除旧方块，合成新方块，设置最大合成类型
        Game.GameLogic.DoSynthesiAfter();

        //计算可放置的位置类型
        Game.GameLogic.CalcCurPosType();

        //是否合成了2048
        if (Game.GameLogic.IsSynthesi2048()) {
            this.synthesi2048();
            Game.GameLogic.GenerateRandomHexagon();
            return;
        }

        //显示分数
        this.showScore();

        //是否有可合成的新方块
        if (Game.GameLogic.IsSynthesi()) {
            //如果可以合成的话，先不管 等分数特效播放完毕后，再进行合成
        } else {
            if (Game.GlobalVar.IsGuide) {
                this.newbieGuide.startGuide();
            } else {
                //合成次数大于等于3的时候，显示perfect特效
                if (Game.GameLogic.GetCurSynthesiCount() >= 3) {
                    this.showPerfectEffect();
                }
                //生成方块
                Game.GameLogic.GenerateRandomHexagon();
                Game.GameLogic.GenerateSpecialHexagon();
            }
        }
    },

    //显示基础分
    showBaseScore(synthesiNode) {
        if (!synthesiNode) {
            synthesiNode = Game.GameLogic.GetCurSynthesiHexagon();
        }

        var type = synthesiNode.getType();

        var baseScore = Game.ScoreTable.BasisScore[type];

        var worldPos = synthesiNode.convertToWorldSpaceAR(cc.v2(0, 0));

        //记录一下
        Game.GameData.AddCurScore(baseScore);

        //显示方块的分数
        this.uiLayerMgr.showScore(worldPos, baseScore, this.scoreEffectPlayFinish.bind(this));

        Game.GameLogic.UpdateHighestScore();
    },

    //显示合成时的分数
    showScore(synthesiNode) {

        if (!synthesiNode) {
            synthesiNode = Game.GameLogic.GetCurSynthesiHexagon();
        }

        var synthesiNum = Game.GameLogic.GetCurSynthesiNum();


        if (!this.uiLayerMgr) {
            return;
        }

        var curSynthesiType = Game.GameLogic.GetCurSynthesiType();

        if (synthesiNode) {
            curSynthesiType = synthesiNode.getType();
        }

        var worldPos = synthesiNode.convertToWorldSpaceAR(cc.v2(0, 0));

        var synthesiCount = Game.GameLogic.GetCurSynthesiCount();
        //基础分
        var baseScore = Game.ScoreTable.BasisScore[curSynthesiType];
        //合成数量倍率
        var synthesiNumRatio = Game.ScoreTable.SnythesiNumRotio[synthesiNum];
        //合成次数倍率
        var synthesiCountRatio = Game.ScoreTable.SnythesiCountRotio[synthesiCount];
        //最终得分
        var finalScore = baseScore * synthesiNumRatio * synthesiCountRatio;

        //记录一下
        Game.GameData.AddCurScore(finalScore);

        //显示方块的分数
        this.uiLayerMgr.showScore(worldPos, finalScore, this.scoreEffectPlayFinish.bind(this));

        Game.GameLogic.UpdateHighestScore();
    },

    //分数特效播放完成
    scoreEffectPlayFinish() {
        //继续合成(如果有的话)
        Game.GameLogic.StartSynthesi();

        //检测是否生成宝箱
        if (Game.GameLogic.IsGenerateTrasureChest()) {
            if (this.uiLayerMgr.isHaveBox() == false) {
                this.uiLayerMgr.createBox();
            }
        }
    },

    //显示方块爆炸时的分数
    showBombScore(idArr) {
        if (!idArr || idArr.length <= 0 || Game.GameLogic.GetHexagonMgr() == null) {
            this.bombScoreFinished();
            return;
        }

        var hexagonNodeMgr = Game.GameLogic.GetHexagonMgr();

        var posArr = [];
        var scoreArr = [];

        var recordScore = 0;

        for (var i = 0; i < idArr.length; i++) {
            var id = idArr[i];
            var hexagon = hexagonNodeMgr.getHexagonNodeByID(id);
            if (hexagon) {
                var type = hexagon.getType();
                //分数
                var baseScore = Game.ScoreTable.BasisScore[type];
                scoreArr.push(baseScore);
                //位置
                var worldPos = hexagon.convertToWorldSpaceAR(cc.v2(0, 0));
                posArr.push(worldPos);

                recordScore += baseScore;
            }
        }

        //记录一下
        Game.GameData.AddCurScore(recordScore);

        this.uiLayerMgr.showScore(posArr, scoreArr, this.bombScoreFinished.bind(this));

        Game.GameLogic.UpdateHighestScore();
    },

    //炸弹分数播放完成
    bombScoreFinished() {

        Game.GameLogic.CalcCurPosType();
    },

    //显示perfect特效
    showPerfectEffect() {
        Game.AudioManager.PlaySoundEffect(Game.SoundType.ST_Perfact);

        this.uiLayerMgr.showPerfectEffect();
    },

    //指定一个id,使其周围指定圈数的方块爆炸
    hexagonBombByID(id, circle) {
        //为指定id的作用范围内的所有方块添加标记
        Game.GameLogic.GetAroundNodeIDByID(id, circle);

        //获得标记过的方块id
        var checkTagNodeID = Game.GameLogic.GetCheckTagNodeID();

        //移除自身的id
        Util.RemoveItem(checkTagNodeID, id);

        //移除2048类型的节点id(如果出现多个2048的时候会多算分数)
        this.remove2048Node(checkTagNodeID);

        //重置标记
        Game.GameLogic.ResetCheckTagNode();

        //显示方块的分数
        this.showBombScore(checkTagNodeID);

        //播放方块的爆炸特效
        this.bombEffectMgr.playBombEffect(checkTagNodeID);

        Game.GameLogic.GenerateSpecialHexagon();
    },

    //放置方块成功
    placeSucccess() {
        Game.AudioManager.PlaySoundEffect(Game.SoundType.ST_PlaceSuccess);

        if (Game.GlobalVar.IsGuide) {
            //如果是新手引导，停止手指的滑动动画
            this.newbieGuide.stopFingerAction();
            Game.GlobalVar.IsGuide = this.newbieGuide.isGuide();
            if (Game.GlobalVar.IsGuide == false) {
                this.uiLayerMgr.overGuide();
            }

            var gridView = Game.GameLogic.GetGridViewMgr()
            if (gridView) {
                gridView.hideHighlighted();
            }
        }

        if (Game.GameLogic.IsSynthesi()) {
            Game.GameLogic.StartSynthesi();
        } else {
            if (Game.GlobalVar.IsGuide) {
                this.startGuide();
            } else {
                Game.GameLogic.CalcCurPosType();
                //如果不可以合成并且不是新手引导马上重新生成方块
                Game.GameLogic.GenerateRandomHexagon();
            }
        }
    },

    //放置万能块成功
    placeUniversalSuccess() {
        Game.AudioManager.PlaySoundEffect(Game.SoundType.ST_PlaceSuccess);

        Game.GameLogic.PlaceUniversalSuccess();

        if (Game.GameLogic.IsSynthesi()) {
            Game.GameLogic.StartSynthesi();
        } else {
            Game.GameLogic.CalcCurPosType();
            //如果不可以合成则重新生成特殊方块
            Game.GameLogic.GenerateSpecialHexagon();
        }
    },

    //放置炸弹成功
    placeBombSuccess() {
        Game.AudioManager.PlaySoundEffect(Game.SoundType.ST_BombSound);

        //播放特效
        var hexagonMgr = Game.GameLogic.GetHexagonMgr();
        if (hexagonMgr) {
            //播放方块爆炸特效
            var bombID = hexagonMgr.getBombNodeID();
            this.hexagonBombByID(bombID, GameConfig.Bomb_Circle_Num);

            var bombNode = hexagonMgr.getBombNode();
            if (bombNode) {
                //播放炸弹的特效
                Util.AddAutoRemoveEffect(bombNode, "prefab/BombAnim", "bombAnim");
            }

            Game.GameLogic.PaceBombSuccess();

            Game.GameLogic.CalcCurPosType();
        }
    },

    //放置失败
    palceFail() {
        Game.AudioManager.PlaySoundEffect(Game.SoundType.ST_PlaceFail);
    },

    remove2048Node(idArr) {
        if (!idArr || idArr.length <= 0) {
            return;
        }

        var hexagonNodeMgr = Game.GameLogic.GetHexagonMgr();
        if (!hexagonNodeMgr) {
            return;
        }

        for (var i = idArr.length - 1; i >= 0; i--) {
            var id = idArr[i];
            var hexagon = hexagonNodeMgr.getHexagonNodeByID(id);
            if (hexagon && hexagon.getType() == HexagonType.HT_2048) {
                idArr.splice(i, 1);
            }
        }
    },

    frameOnMove(dt) {
        Game.GameLogic.FrameOnMove(dt);
    },
});
