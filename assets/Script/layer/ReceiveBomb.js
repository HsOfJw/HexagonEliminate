var Util = require("Util");
var WXHelper = require("WXHelper");
var ShareSceneType = require("ShareSceneType");
var AdvertiseMgr = require("AdvertiseMgr");
var AdvertiseConfig = require("AdvertiseConfig");

cc.Class({
    extends: cc.Component,

    properties: {
        //领取按钮
        receiveBtn: cc.Node,

        //关闭按钮
        closeBtn: cc.Node,

        //遮罩层
        maskLayer: cc.Node,

        //领取弹窗
        receivePopUp: cc.Node,

    },

    callback: null,

    onLoad () {
        var bombVideoCount = Game.GameData.GetBombVideoCount();
        if(bombVideoCount < 5){
            Util.SetNodeTexture(this.receiveBtn, "resources/gamescene/watchReceive.png");
        }

        Util.RegBtnClickEvent(this.receiveBtn, this.receiveClicked.bind(this));
        Util.RegBtnClickEvent(this.closeBtn, this.closeBtnClicked.bind(this));
    },

    start () {
        this.showLayer();
    },

    setCallback(callback){
        this.callback = callback;
    },

    //点击关闭按钮
    closeBtnClicked(){
        Game.AudioManager.PlayBtnSound();

        this.removeLayer(true);
    },

    //点击领取按钮
    receiveClicked(event){
        var self = this;

        Game.AudioManager.PlayBtnSound();

        this.callback();

        this.removeLayer(true);
    },

    //显示领取层
    showLayer(){
        if(!this.receivePopUp){
            return;
        }

        Game.PopUpMgr.Show_ScaleEffect(this.receivePopUp, GameConfig.PopUp_Duration);
    },

    //隐藏领取层
    removeLayer(isEffect){
        if(!this.maskLayer){
            return;
        }

        if(!this.receivePopUp){
            return;
        }

        this.maskLayer.active = false;

        if(isEffect){
            Game.PopUpMgr.Remove_ScaleEffect(this.node, this.receivePopUp, GameConfig.PopUp_Duration);
        }else{
            this.node.destroy();
        }
    },

    // update (dt) {},
});
