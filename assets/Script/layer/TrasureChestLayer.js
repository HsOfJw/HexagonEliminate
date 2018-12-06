var Util = require("Util");
var WXHelper = require("WXHelper");
var ShareSceneType = require("ShareSceneType");
var AdvertiseMgr = require("AdvertiseMgr");
var AdvertiseConfig = require("AdvertiseConfig");

cc.Class({
    extends: cc.Component,

    properties: {
        //宝箱领取按钮
        receiveBtn: cc.Node,

        //关闭宝箱层按钮
        closeBtn: cc.Node,

        //遮罩层
        maskLayer: cc.Node,

        //领取宝箱弹窗
        receivePopUp: cc.Node,
    },

    onLoad () {
        var chestVideoCount = Game.GameData.GetChestVideoCount();
        if(chestVideoCount < 5){
            Util.SetNodeTexture(this.receiveBtn, "resources/gamescene/watchReceive.png");
        }

        Util.RegBtnClickEvent(this.receiveBtn, this.receiveClicked.bind(this));
        Util.RegBtnClickEvent(this.closeBtn, this.closeBtnClicked.bind(this));
    },

    start () {
        this.showLayer();
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

        self.removeLayer(true);

        var chestVideoCount = Game.GameData.GetChestVideoCount();
        if(chestVideoCount >= 5){
            //超过5次分享领取
            if(WXHelper.IsWXContext()){
                //分享
                WXHelper.CommonShare(ShareSceneType.ReceiveChest, function(res, isgroup){
                    if(isgroup){
                        Game.EventCenter.DispatchEvent(Game.MessageType.ReceiveChest_Event);
                    }
                });
            }else{
                Game.EventCenter.DispatchEvent(Game.MessageType.ReceiveChest_Event);
            }
        }else{

            if(WXHelper.IsWXContext()){
                //创建视频广告
                AdvertiseMgr.CreateVideoAd(AdvertiseConfig.ADConfig_Chest_Video, function(isFinish){
                    if(isFinish){
                        Game.EventCenter.DispatchEvent(Game.MessageType.ReceiveChest_Event);
                        Game.GameData.SetChestVideoCount(chestVideoCount + 1);
                    }
                });
            }else{
                Game.EventCenter.DispatchEvent(Game.MessageType.ReceiveChest_Event);
            }
        }
    },

    //显示宝箱领取层
    showLayer(){
        if(!this.receivePopUp){
            return;
        }

        Game.PopUpMgr.Show_ScaleEffect(this.receivePopUp, GameConfig.PopUp_Duration);
    },

    //隐藏宝箱领取层
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
