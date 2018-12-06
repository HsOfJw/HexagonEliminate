window.Game = window.Game || {};

cc.Class({

    extends: cc.Component,

    properties: {
        logoScene: cc.Node,     //logo场景
        startScene: cc.Node,     //首页场景
        gameScene: cc.Node,     //游戏场景
        loadingScene: cc.Node,     //加载资源场景
    },

    startSceneCom: null,
    gameSceneCom: null,
    loadingSceneCom: null,
    logoSceneCom: null,

    curScene: null,

    curSceneType: null,

    onLoad() {
        Game.SceneMgr = this;

        this.startSceneCom = this.startScene.getComponent("StartScene");
        this.gameSceneCom = this.gameScene.getComponent("GameScene");
        this.loadingSceneCom = this.loadingScene.getComponent("LoadingScene");
        this.logoSceneCom = this.logoScene.getComponent("LogoScene");

        var width = this.node.width;
        var height = this.node.height;

        this.startScene.width = width;
        this.gameScene.width = width;
        this.loadingScene.width = width;
        this.logoScene.width = width;

        this.startScene.height = height;
        this.gameScene.height = height;
        this.loadingScene.height = height;
        this.logoScene.height = height;

        this.curSceneType = 0;
    },

    start() {
        this.startScene.active = false;
        this.gameScene.active = false;
        this.loadingScene.active = false;
        this.logoScene.active = false;

        this.showScene(Game.SceneType.LogoScene);

    },

    //直接显示某个场景(没有切换效果)
    showScene(sceneType) {
        var nextScene = this.getSceneByType(sceneType);

        if (this.curScene == nextScene) {
            return;
        }

        if (this.curScene) {
            this.curScene.doExit();
        }
        if (nextScene) {
            this.curScene = nextScene;
            this.curScene.doEnter();
        }

        this.curSceneType = sceneType;
    },

    switchScene(sceneType, switchType) {
        var nextScene = this.getSceneByType(sceneType);

        this.curSceneType = sceneType;

        if (!switchType) {
            this.showScene(sceneType);
        }

        switch (switchType) {
            case Game.SceneSwitchType.RightToLeft:
                this.transitionRightToLeft(GameConfig.TransitionSceneDuration, nextScene);
                return;
                break;
            case Game.SceneSwitchType.LeftToRight:
                this.transitionLeftToRight(GameConfig.TransitionSceneDuration, nextScene);
                return;
                break;
            case Game.SceneSwitchType.UpToDown:
                this.transitionUpToDown(GameConfig.TransitionSceneDuration, nextScene);
                return;
                break;
            case Game.SceneSwitchType.DownToUp:
                this.transitionDownToUp(GameConfig.TransitionSceneDuration, nextScene);
                return;
                break;
        }
    },

    //隐藏所有场景
    hideAllScene() {

    },

    getCurScene() {
        return this.curScene;
    },

    getCurSceneType() {
        return this.curSceneType;
    },

    getSceneByType(sceneType) {
        var scene = null;

        switch (sceneType) {
            case Game.SceneType.StartScene: {
                scene = this.startSceneCom;
                break;
            }
            case Game.SceneType.GameScene: {
                scene = this.gameSceneCom;
                break;
            }

            case Game.SceneType.LoadingScene: {
                scene = this.loadingSceneCom;
                break;
            }

            case Game.SceneType.LogoScene: {
                scene = this.logoSceneCom;
                break;
            }
        }
        return scene;
    },

    update(dt) {
        if (this.startSceneCom && this.startScene && this.startScene.active) {
            this.startSceneCom.frameOnMove(dt);
        }

        if (this.selectSceneCom && this.selectScene && this.selectScene.active) {
            this.selectSceneCom.frameOnMove(dt);
        }

        if (this.ranklistSceneCom && this.ranklistScene && this.ranklistScene.active) {
            this.ranklistSceneCom.frameOnMove(dt);
        }

        if (this.gameSceneCom && this.gameScene && this.gameScene.active) {
            this.gameSceneCom.frameOnMove(dt);
        }
        if (this.loadingSceneCom && this.loadingScene && this.loadingScene.active) {
            this.loadingSceneCom.frameOnMove(dt);
        }
    },


//场景切换效果
    //从右到左移动
    transitionRightToLeft(duration, scene) {
        var self = this;

        scene.doEnter();

        scene.node.position = cc.p(cc.winSize.width, 0);

        var move = new cc.moveTo(duration, cc.p(0, 0));
        scene.node.runAction(new cc.sequence(move, cc.callFunc(function () {
            self.curScene.doExit();
            self.curScene = scene;
            if (self.curScene.doUpdatePos) {
                self.curScene.doUpdatePos();
            }
        })));

        self.curScene.node.runAction(new cc.moveBy(duration, cc.p(-cc.winSize.width, 0)));
    },

    //从左到右移动
    transitionLeftToRight(duration, scene) {
        var self = this;

        scene.doEnter();

        scene.node.position = cc.p(-cc.winSize.width, 0);

        var move = new cc.moveTo(duration, cc.p(0, 0));
        scene.node.runAction(new cc.sequence(move, cc.callFunc(function () {
            self.curScene.doExit();
            self.curScene = scene;
            if (self.curScene.doUpdatePos) {
                self.curScene.doUpdatePos();
            }
        })));

        self.curScene.node.runAction(new cc.moveBy(duration, cc.p(cc.winSize.width, 0)));
    },

    //从上至下移动
    transitionUpToDown(duration, scene) {
        var self = this;

        scene.doEnter();

        scene.node.position = cc.p(0, cc.winSize.height);

        var move = new cc.moveTo(duration, cc.p(0, 0));
        scene.node.runAction(new cc.sequence(move, cc.callFunc(function () {
            self.curScene.doExit();
            self.curScene = scene;
        })));

        self.curScene.node.runAction(new cc.moveBy(duration, cc.p(0, -cc.winSize.height)));
    },

    //从下至上移动
    transitionDownToUp(duration, scene) {
        var self = this;

        scene.doEnter();

        scene.node.position = cc.p(0, -cc.winSize.height);

        var move = new cc.moveTo(duration, cc.p(0, 0));
        scene.node.runAction(new cc.sequence(move, cc.callFunc(function () {
            self.curScene.doExit();
            self.curScene = scene;
            if (self.curScene.doUpdatePos) {
                self.curScene.doUpdatePos();
            }
        })));

        self.curScene.node.runAction(new cc.moveBy(duration, cc.p(0, cc.winSize.height)));
    },
});

Game.SceneSwitchType = {
    RightToLeft: 1,
    LeftToRight: 2,
    UpToDown: 3,
    DownToUp: 4,
};

Game.SceneType = {
    StartScene: 1,
    LoadingScene: 2,
    GameScene: 3,
    LogoScene: 4,
};