var Util = require("Util");
var WXHelper = require("WXHelper");
var ShareSceneType = require("ShareSceneType");
var AdvertiseMgr = require("AdvertiseMgr");
var AdvertiseConfig = require("AdvertiseConfig");

cc.Class({
    extends: cc.Component,

    properties: {
        //召唤按钮
        summonBtn: cc.Node,

        //关闭按钮
        closeBtn: cc.Node,

        //背景层
        bgLayer: cc.Node,

        //分数
        scoreNode: cc.Node,

        //提示
        hintSprite: cc.Node,

        cblPrefab: cc.Prefab,

        moreGameLayout: cc.Node,
    },

    onLoad () {
        if(cc.director.getWinSize().height / cc.director.getWinSize().width - 16 / 9 > 0.1){
            this.hintSprite.getComponent(cc.Widget).top = 150;
        }

        var reliveVideoCount = Game.GameData.GetReliveVideoCount();
        if(reliveVideoCount < 5){
            Util.SetNodeTexture(this.summonBtn, "resources/gamescene/watchRelive.png");
        }

        Util.RegBtnClickEvent(this.summonBtn, this.summonClicked.bind(this));
        Util.RegBtnClickEvent(this.closeBtn, this.closeBtnClicked.bind(this));
    },

    start () {
        this.refreshScore();

        this.showLayer();

        this.initMoreGameUI();
    },
    
    initMoreGameUI(){
        var self = this;

        Game.SendMessage.SendGetGameListMessage(GameConfig.GameListID, function(data){
            if(data){
                let gameList = data.redirect;
                for (let i = 0; i < gameList.length, i < 4; i++) {
                    let item = cc.instantiate(self.cblPrefab);
                    let script = item.getComponent("PanelItem");
                    item.setPosition(0, 0);
                    if (script) {
                        let directInfo = {
                            img_url: gameList[i].img_url,
                            game_id: gameList[i].game_id,
                            name: gameList[i].name,
                            app_id: data.hz_app_id,
                            path: data.hz_path
                        };
                        script.setItemData(directInfo);
                    }
                    self.moreGameLayout.addChild(item);
                }
            }
        });
    },


    //点击关闭按钮
    closeBtnClicked(){
        Game.AudioManager.PlayBtnSound();

        this.removeLayer(true);

        Game.EventCenter.DispatchEvent(Game.MessageType.Restart_Game);
    },

    //点击召唤按钮
    summonClicked(){
        var self = this;

        Game.AudioManager.PlayBtnSound();

        var reliveVideoCount = Game.GameData.GetReliveVideoCount();
        if(reliveVideoCount >= 5){
            //超过5次分享领取
            if(WXHelper.IsWXContext() && Game.ConfigData.ad_relive){
                //分享
                WXHelper.CommonShare(ShareSceneType.Summon2048, function(res, isgroup){
                    if(isgroup){
                        self.removeLayer(true);
                        Game.EventCenter.DispatchEvent(Game.MessageType.Resurrection_Event);
                    }
                });
            }else{
                self.removeLayer(true);
                Game.EventCenter.DispatchEvent(Game.MessageType.Resurrection_Event);
            }
        }else{
            if(WXHelper.IsWXContext() && Game.ConfigData.ad_relive){
                //创建视频广告
                AdvertiseMgr.CreateVideoAd(AdvertiseConfig.ADConfig_Relive_Video, function(isFinish){
                    if(isFinish){
                        self.removeLayer(true);
                        Game.EventCenter.DispatchEvent(Game.MessageType.Resurrection_Event);
                        Game.GameData.SetReliveVideoCount(reliveVideoCount + 1);
                    }
                });
            }else{
                self.removeLayer(true);
                Game.EventCenter.DispatchEvent(Game.MessageType.Resurrection_Event);
            }
        }
    },

    //显示
    showLayer(){
        if(Game.GameData.GetIsResurrection()){
            this.summonBtn.getComponent(cc.Button).interactable = false;
            Util.CancelClickEvent(this.summonBtn);   
        }

        this.node.active = true;
        this.node.scaleX = 1;
        this.node.scaleY = 1;

        // Game.PopUpMgr.Show_ScaleEffect(this.node, GameConfig.PopUp_Duration);
    },

    //隐藏
    removeLayer(isEffect){
        if(isEffect){
            Game.PopUpMgr.Remove_ScaleEffect(this.node, this.node, GameConfig.PopUp_Duration);
        }else{
            this.node.destroy();
        }
    },

    //刷新分数
    refreshScore(){
        if(this.scoreNode){
            Util.SetNodeText(this.scoreNode, Game.GameData.GetCurScore());
        }
    }

    // update (dt) {},
});
