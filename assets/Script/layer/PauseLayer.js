var Util = require("Util");
var ShareSceneType = require("ShareSceneType");
var WXHelper = require("WXHelper");
var AdvertiseMgr = require("AdvertiseMgr");

cc.Class({
    extends: cc.Component,

    properties: {
        //历史最高分
        scoreNode: cc.Node,
        //继续游戏
        continueBtn: cc.Node, 
        //重新开始
        restartBtn: cc.Node,
        //返回首页
        returnBtn: cc.Node,
        //声音按钮
        soundBtn: cc.Node, 
        //分享按钮
        shareBtn: cc.Node,

        //重新开始询问层
        restartAskLayer: cc.Node,
        //确认重新开始按钮
        confirmBtn: cc.Node,
        //取消重新开始按钮
        cancelBtn: cc.Node,
    },

    musicBtnState: null,

    onLoad(){
        this.musicBtnState = 0;

        this.hideRestartAskLayer(false);

        Util.SetNodeText(this.scoreNode, Game.GameData.GetHeighestScore());

        Util.RegBtnClickEvent(this.restartBtn, this.restartBtnClicked.bind(this));
        Util.RegBtnClickEvent(this.continueBtn, this.continueBtnClicked.bind(this));
        Util.RegBtnClickEvent(this.returnBtn, this.returnBtnClicked.bind(this));
        Util.RegBtnClickEvent(this.soundBtn, this.soundBtnClicked.bind(this));
        Util.RegBtnClickEvent(this.shareBtn, this.shareBtnClicked.bind(this));
        Util.RegBtnClickEvent(this.confirmBtn, this.confirmBtnClicked.bind(this));
        Util.RegBtnClickEvent(this.cancelBtn, this.cancelBtnClicked.bind(this));
    },

    start(){
        this.showLayer();
    },

    showLayer(){
        this.node.active = true;
        this.node.scaleX = 1;
        this.node.scaleY = 1;
        // Game.PopUpMgr.Show_ScaleEffect(this.node, GameConfig.PopUp_Duration);
    },

    removeLayer(isEffect){
        if(isEffect){
            Game.PopUpMgr.Remove_ScaleEffect(this.node, this.node, GameConfig.PopUp_Duration);
        }else{
            this.node.destroy();
        }
    },

    //打开重新开始询问层
    showRestartAskLayer(){
        Game.PopUpMgr.Show_ScaleEffect(this.restartAskLayer, GameConfig.PopUp_Duration);
    },

    //关闭重新开始询问层
    hideRestartAskLayer(isEffect){
        if(isEffect){
            Game.PopUpMgr.Hide_ScaleEffect(this.restartAskLayer, GameConfig.PopUp_Duration);
        }else{
            this.restartAskLayer.active = false;
        }
    },

    //点击确认重新开始的按钮
    confirmBtnClicked(){
        Game.AudioManager.PlayBtnSound();

        this.removeLayer(false);
        this.hideRestartAskLayer(false);

        Game.EventCenter.DispatchEvent(Game.MessageType.Restart_Game);
    },

    //点击取消重新开始的按钮
    cancelBtnClicked(){
        Game.AudioManager.PlayBtnSound();

        this.hideRestartAskLayer(true);
    },

    //点击继续游戏按钮
    continueBtnClicked(){
        cc.log("continueBtnClicked");

        Game.AudioManager.PlayBtnSound();
        this.removeLayer(true);
    },

    //点击重新开始游戏按钮
    restartBtnClicked(){
        Game.AudioManager.PlayBtnSound();

        this.showRestartAskLayer();
    },

    //点击返回首页按钮
    returnBtnClicked(){
        Game.AudioManager.PlayBtnSound();

        this.removeLayer(false);

        //销毁广告
        AdvertiseMgr.DestroyBannerAd();

        Game.EventCenter.DispatchEvent(Game.MessageType.Return_Home_Page);
    },

    //点击声音按钮
    soundBtnClicked(){
        Game.AudioManager.PlayBtnSound();

        if(this.musicBtnState == 0){
            this.musicBtnState = 1;
        }else{
            this.musicBtnState = 0;
        }

        this.refreshMusicBtnState();
    },

    //点击分享按钮
    shareBtnClicked(){
        Game.AudioManager.PlayBtnSound();

        WXHelper.CommonShare(ShareSceneType.PauseLayer);
    },

    refreshMusicBtnState(){
        var musicSprite = this.soundBtn.getComponent(cc.Sprite);

        if(musicSprite){
            if(this.musicBtnState == 0){
                Game.AudioManager.CloseSound();
                musicSprite.spriteFrame.setTexture(cc.url.raw('resources/startscene/close_music.png'));
            }else{
                Game.AudioManager.OpenSound();
                musicSprite.spriteFrame.setTexture(cc.url.raw('resources/startscene/open_music.png'));
            }
        }
    },

    // update (dt) {},
});
