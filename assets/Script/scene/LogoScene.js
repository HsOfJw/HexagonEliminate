
var WXHelper = require("WXHelper");
var GameRes = require("GameRes");
var SceneCom = require("SceneCom");
var Util = require("Util");

cc.Class({
    extends: SceneCom,

    properties: {
        //巨网logo
        jwLogo: {
            default: null,
            type: cc.Node,
        },
        
        gameAdBg: {
            default: null,
            type: cc.Node,
        }
    },

    onLoad () {
        this.loadRes();

        WXHelper.GetSystemInfo();

        this.getLaunchOptionsSync();
    },
    
    doEnter(){
        this._super();
    },

    doExit(){
        this._super();
    },

    loadRes(){
        for(var i = 0;i < GameRes.StartSceneRes.length;i ++){
            var res = GameRes.StartSceneRes[i];
            cc.loader.loadRes(res, function (err, texture) {
                if(err){
                    cc.log(err);
                }else{
                }
            });
        }
    },

    //获取启动参数
    getLaunchOptionsSync() {
        var self = this;

        if (window.wx != undefined) {
            
            wx.onShow(res => {//监听小游戏回到前台的事件
                    console.log('onshow', res.query);
                    if (res.query.game_id == GameConfig.GameID) {
                        //跳到自己的游戏
                        console.log("[loading] 游戏返回到前台的参数中  跳转到自己的游戏中");
                        self.showJWLogo();
                    }
                }
            );

            let wx_onLaunch = wx.getLaunchOptionsSync();

            console.log(wx_onLaunch);

            let gid = wx_onLaunch.query.gid;
            if (gid) {
                console.log("开始走非正常流程");
                Game.GlobalVar.GameAdGID = gid;
                this.jwLogo.active = false;
                this.getGameAd(gid);
                return;
            }
        }
        //显示巨网logo
        this.showJWLogo();
    },

    //获取游戏广告
    getGameAd(gid) {
        let self = this;
        if (window.wx != undefined) {
            Game.SendMessage.SendGetGameAdMessage(gid, function(data){
                Game.GlobalVar.GameAdInfo = data;
                let bgUrl = data.img;
                Util.loadRemoteImg(self.gameAdBg, bgUrl);
                self.gameAdBg.active = true;
                self.gameAdBg.on(cc.Node.EventType.TOUCH_END,self.logoClicked.bind(self));
            });
        }
    },

    //落地页点击
    logoClicked(){
        if (!Game.GlobalVar.GameAdInfo) {
            return
        }

        let self = this;

        let status = Game.GlobalVar.GameAdInfo.state;

        let ToMiniProgram = {
            envVersion: 'release',
            success: function () {
                console.log("跳转成功", Game.GlobalVar.GameAdGID);
                self.showJWLogo();
            },
            fail: function (res) {
                console.log("跳转失败", res);
                self.showJWLogo();
            },
        };

        if (status == 1) {//审核中  跳到游戏
            if(Game.GlobalVar.GameAdInfo.appp_id == GameConfig.AppID){
                self.showJWLogo();
                return;
            }
            ToMiniProgram.appId = Game.GlobalVar.GameAdInfo.app_id;
            ToMiniProgram.extraData = Game.GlobalVar.GameAdInfo.param;
            ToMiniProgram.path = Game.GlobalVar.GameAdInfo.path;
            console.log("跳转到游戏中");
        } else if (status == 2) {//通过审核 跳盒子
            console.log("跳转到盒子中");
            ToMiniProgram.appId = Game.GlobalVar.GameAdInfo.hz_app_id;
            ToMiniProgram.path = Game.GlobalVar.GameAdInfo.hz_path;
            ToMiniProgram.extraData = {gid: Game.GlobalVar.GameAdGID};
        }
        if (window.wx != undefined) {
            wx.navigateToMiniProgram(ToMiniProgram);
        }
    },

    showJWLogo(){
        if(this.jwLogo){
            this.jwLogo.active = true;
            this.scheduleOnce(this.juLogoFinish.bind(this), GameConfig.JWLogoDuration);
        }
        if(this.gameAdBg){
            this.gameAdBg.active = false;
        }
    },

    juLogoFinish(){
        Util.AddComponent(cc.find("Canvas"), "MainScene");
        Game.SceneMgr.showScene(Game.SceneType.StartScene);
    },

    frameOnMove(dt){
    },

    onDestroy(){
    }
});
