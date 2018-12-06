var GameRes = require("GameRes");
var SceneCom = require("SceneCom");

cc.Class({
    extends: SceneCom,

    properties: {
       loadingBar: cc.Node,
    },

    //加载资源
    loadIndex: null,
    isLoading: null,
    isLoadFinish: null,

    progress: null,

    comingLoadingRes: null,

    onLoad () {
    },

    doEnter(){
        this._super();

        this.comingLoadingRes = [];
        this.comingLoadingRes = GameRes.GameSceneRes;

        this.loadIndex = 0;
        this.isLoading = false;
        this.isLoadFinish = false;

        this.progress = 0;

        this.loadRes();
    },

    doExit(){
        this._super();

        this.comingLoadingRes = null;
    },

    loadRes(){
        if(this.loadIndex >= this.comingLoadingRes.length)
        {
            this.isLoadFinish = true;

            Game.SceneMgr.switchScene(Game.SceneType.GameScene, Game.SceneSwitchType.UpToDown);
            return;
        }

        var temp = 100 / this.comingLoadingRes.length;
        
        var self = this;
        var res = this.comingLoadingRes[this.loadIndex];
        self.isLoading = true;
        // 加载 Texture，不需要后缀名
        cc.loader.loadRes(res, function (err, texture) {
            if(err){
                cc.log(err);
            }else{
                self.progress += temp;
                self.isLoading = false;
            }
        });
        this.loadIndex ++;
    },

    frameOnMove(dt){

        //加载资源
        if(!this.isLoadFinish){
            if(!this.isLoading){
                this.loadRes();
            }

            if(this.loadingBar){
                this.loadingBar.getComponent(cc.ProgressBar).progress = this.progress / 100;
            }
        }
    }

});
