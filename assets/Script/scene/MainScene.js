var WXHelper = require("WXHelper");

cc.Class({
    extends: cc.Component,

    properties: {
        
    },

    onLoad () {

    },

    start () {
        this.initEvent();

        this.node.once('LoginScene', this.loginSuccess.bind(this));

        this.groupRankList();

        if(Game.GameLocalData.ReadUserID()){
            this.loginSuccess();
        }
    },

    //注册生命周期函数
    initEvent(){
        if(WXHelper.IsWXContext()){
            WXHelper.OnShow(this.onShow.bind(this));
            WXHelper.OnHide(this.onHide.bind(this));
            WXHelper.ExitMiniProgram(this.exitMiniProgram.bind(this));

            //用户点击右上角菜单的转发触发的事件
            WXHelper.ShowShareButton();

            WXHelper.PassiveShare();
        }else{
            var self = this;
            var hiddenProperty = 'hidden' in document ? 'hidden' : 'webkitHidden' in document ? 'webkitHidden' : 'mozHidden' in document ? 'mozHidden' : null;
            var visibilityChangeEvent = hiddenProperty.replace(/hidden/i, 'visibilitychange');
            var onVisibilityChange = function(){
                if (document[hiddenProperty]) {    
                    self.onShow();
                }else{
                    self.onHide();
                }
            }
            document.addEventListener(visibilityChangeEvent, onVisibilityChange);
            window.onbeforeunload =this.exitMiniProgram.bind(this);
        }
    },

    //群排行
    groupRankList(){
        var res = WXHelper.GetLaunchOptionsSync();

        if(res && res.query.enterStyle == "ranklist"){
            //如果是从查看群排行的链接点击进来的，则显示排行榜

            Game.GlobalVar.shareTicket = res.shareTicket;

            Game.SceneMgr.showScene(Game.SceneType.StartScene);

            var startScene = Game.SceneMgr.getCurScene();
            if(startScene){
                startScene.showGroupRankList();
            }
        }
    },

    //进入游戏事件
    onShow(res){
        console.log("onShow:", res);

        if(res){
            if(res.query.enterStyle == "forhelp"){
                //分享者的uid
                var shareUID = res.query.uid;
                //进入的游戏局数标识
                var roundID = res.query.roundID;

                Game.SendMessage.SendUserShare(shareUID, roundID);
            }else if(res.query.enterStyle == "ranklist"){
                //如果是从查看群排行的链接点击进来的，则显示排行榜
    
                Game.GlobalVar.shareTicket = res.shareTicket;
    
                Game.SceneMgr.showScene(Game.SceneType.StartScene);
    
                var startScene = Game.SceneMgr.getCurScene();
                if(startScene){
                    startScene.showGroupRankList();
                }
            }
        }
    },

    //游戏进入后台事件
    onHide(){
        console.log("onHide:");

        if(Game.SceneMgr.getCurSceneType() == Game.SceneType.GameScene){
            Game.GameData.Save();
        }
    },

    //退出游戏事件
    exitMiniProgram(){
        console.log("exitMiniProgram");

        if(Game.SceneMgr.getCurSceneType() == Game.SceneType.GameScene){
            Game.GameData.Save();
        }
    },

    //登陆成功
    loginSuccess(){
        if(WXHelper.IsWXContext()){
            //返回小游戏启动参数
            var res = WXHelper.GetLaunchOptionsSync();
            if(res.query.enterStyle == "forhelp"){
                this.onShow(res);
            }
        }
    },
    // update (dt) {},
});
