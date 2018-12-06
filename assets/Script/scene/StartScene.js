
var WXHelper = require("WXHelper");
var GameRes = require("GameRes");
var SceneCom = require("SceneCom");
var Util = require("Util");
var AdvertiseMgr = require("AdvertiseMgr");
var AdvertiseConfig = require("AdvertiseConfig");

cc.Class({
    extends: SceneCom,

    properties: {
        //开始游戏按钮
        startBtn:{
            default: null,
            type: cc.Node
        },
        
        //查看群排名按钮
        groupRankBtn:{
            default: null,
            type: cc.Node
        },
        
        //游戏圈按钮
        gameLoopBtn: {
            default: null,
            type: cc.Node
        },

        //排行榜按钮        
        ranklistBtn:{
            default: null,
            type: cc.Node
        },

        //声音按钮
        musicBtn: {
            default: null,
            type: cc.Node
        },

        //更多游戏按钮
        moreGameBtn:{
            default: null,
            type: cc.Node
        },

        //历史最高分
        scoreNode: {
            default: null,
            type: cc.Node
        },

        //侧边栏按钮
        cblBtn: {
            default: null,
            type: cc.Node,
        },

        //侧边栏预制体
        cblPrefab: cc.Prefab,

        //排行榜预制体
        rankListPerfab: cc.Prefab,
    },

    musicBtnState: null,

    userInfoBtnActive: null,

    onLoad () {
        var self = this;

        this.musicBtnState = 1;
        this.userInfoBtnActive = false;

        WXHelper.GetSystemInfo();

        //读取最高分
        Game.GameData.ReadHighestScore();

        //读取游戏配置
        Game.SendMessage.SendGetConfigMessage();

        //创建游戏圈按钮
        WXHelper.CreateClubButton();

        // //测试登陆
        // Game.GameLocalData.ClearUserID();
    },
    
    doEnter(){
        this._super();

        var self = this;

        this.hideGameClubBtn();

        this.initBtnEventListener();

        this.refreshScore();

        var userid = Game.GameLocalData.ReadUserID();

        //创建广告
        AdvertiseMgr.CreateBannerAd(AdvertiseConfig.ADConfig_HomePage_Banner);

        if(WXHelper.IsWXContext() && userid == null){

            this.userInfoBtnActive = true;

            GameConfig.openNewbieGuide = true;
            Game.GlobalVar.showForHelp = true;

            WXHelper.CreateUserInfoButton(function(res, type){
                Game.AudioManager.PlayBtnSound();
    
                self.login(function(state, resCode){
                    if(state == 1){
                        var userid = Game.GameLocalData.ReadUserID();
                        self.loginComplete(userid, type);
                    }else if(state == 2){
                        Game.SendMessage.SendLogin(resCode, res.iv, res.encryptedData, function(resData){
                            self.loginComplete(resData.data.uid, type);
                        });
                    }else if(state == 3){
                        //失败
                        self.loginComplete(-1, type);
                    }
                });
            });

            this.hideCocosBtn();
            WXHelper.HideUserInfoBtn(3);
        }else{
            Game.GlobalVar.userID = userid;

            this.userInfoBtnActive = false;

            this.startBtn.active = true;
            this.ranklistBtn.active = true;
        }
    },

    doExit(){
        this._super();

        //隐藏游戏圈按钮
        WXHelper.HideClubBtn();
    },

    showCocosBtn(){
        if(this.userInfoBtnActive == false){
            return;
        }

        if(this.startBtn){
            this.startBtn.active = true;
        }
        if(this.ranklistBtn){
            this.ranklistBtn.active = true;
        }
        WXHelper.HideUserInfoBtn();
    },

    hideCocosBtn(){
        if(this.userInfoBtnActive == false){
            return;
        }

        if(this.startBtn){
            this.startBtn.active = false;
        }
        if(this.ranklistBtn){
            this.ranklistBtn.active = false;
        }
        WXHelper.ShowUserInfoBtn();
    },

    showGameClubBtn(){
        if(this.gameLoopBtn){
            this.gameLoopBtn.active = true;
        }

        //隐藏游戏圈按钮
        WXHelper.HideClubBtn();
    },

    cblBtnClick(){
        if(this.cblPrefab){
            var cblNode = cc.instantiate(this.cblPrefab);
            this.node.addChild(cblNode, 1000);
        }
    },
    
    hideGameClubBtn(){
        if(this.gameLoopBtn){
            this.gameLoopBtn.active = false;
        }

        WXHelper.ShowClubBtn();
    },

    initBtnEventListener(){
        //开始游戏按钮
        this.registerClickEvent(this.startBtn, this.startBtnClicked.bind(this));
        //查看群排名按钮
        this.registerClickEvent(this.groupRankBtn, this.groupRankClicked.bind(this));
        //游戏圈按钮
        this.registerClickEvent(this.gameLoopBtn, this.gameLoopBtnClicked.bind(this));
        //排行榜按钮
        this.registerClickEvent(this.ranklistBtn, this.ranklistBtnClicked.bind(this));
        //声音开关按钮
        this.registerClickEvent(this.musicBtn, this.musicBtnClicket.bind(this));
        //更多游戏按钮
        this.registerClickEvent(this.moreGameBtn, this.moreGameBtnClick.bind(this));
        //侧边栏按钮点击
        this.registerClickEvent(this.cblBtn, this.cblBtnClick.bind(this));
    },

    startGame(){
        var userid = Game.GameLocalData.ReadUserID();

        if(WXHelper.IsWXContext()){
            this.loginComplete(userid, 1);
        }else{
            this.loginComplete(19951214, 1);
        }
    },

    refreshScore(){
        var score = Game.GameData.GetHeighestScore();
        Util.SetNodeText(this.scoreNode, score);
    },

    //显示排行榜
    showRankList(type){
        var rankListNode = cc.instantiate(this.rankListPerfab);
        if(rankListNode){
            var rankListCom = Util.GetComponent(rankListNode, "RanklistLayer");
            if(rankListCom){
                rankListCom.setType(type);
                this.node.addChild(rankListNode);
            }
        }

        this.showGameClubBtn();
        this.showCocosBtn();
    },

    //显示群排行
    showGroupRankList(){
        this.showRankList(2);

        WXHelper.ShowUserInfoBtn(3);
    },

    //开始游戏按钮点击
    startBtnClicked(){
        Game.AudioManager.PlayBtnSound();
        this.startGame();
    },

    //查看群排名按钮点击
    groupRankClicked(){
        var self = this;

        Game.AudioManager.PlayBtnSound();

        //分享
        WXHelper.GroupRankListShare(function(res){
            console.log("转发成功：", res);

            if(res.shareTickets == null || res.shareTickets == undefined || res.shareTickets == ""){ 
                //没有群信息，说明分享的是个人
                console.log("排行榜res.shareTickets is null");
            }else{ 
                //有群信息
                console.log("排行榜res.shareTickets is not null");

                if(res.shareTickets.length > 0){
                    console.log("res.shareTickets:" + res.shareTickets);
                }
            }
        });
    },
    
    //游戏圈按钮点击
    gameLoopBtnClicked(){
        Game.AudioManager.PlayBtnSound();
    },

    //排行榜按钮点击
    ranklistBtnClicked(){
        Game.AudioManager.PlayBtnSound();

        this.showRankList(1);
    },


    //声音开关按钮点击
    musicBtnClicket(){
        Game.AudioManager.PlayBtnSound();

        if(this.musicBtnState == 0){
            this.musicBtnState = 1;
        }else{
            this.musicBtnState = 0;
        }

        this.refreshMusicBtnState();
    },

    //更多游戏按钮点击
    moreGameBtnClick(){
        Game.AudioManager.PlayBtnSound();

        WXHelper.MoreGame();
    },

    refreshMusicBtnState(){
        var musicSprite = this.musicBtn.getComponent(cc.Sprite);

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

    login(callback){
        var self = this;

        WXHelper.Login(callback);
    },

    loginComplete(userid, type){
        cc.log("loginComplete:userid = ", userid, "type = ", type);

        if(userid && userid >= 0){
            Game.GlobalVar.userID = userid;
            Game.GameLocalData.SaveUserID(userid);

            //获取用户信息成功，销毁微信的按钮
            WXHelper.DestroyUserInfoBtn();

            this.userInfoBtnActive = false;

            //显示自己的用户信息按钮
            this.startBtn.active = true;
            this.ranklistBtn.active = true;

            if(type == 1 || type == 3){
                //销毁广告
                AdvertiseMgr.DestroyBannerAd();
                Game.SceneMgr.switchScene(Game.SceneType.LoadingScene, Game.SceneSwitchType.RightToLeft);
            }else if(type == 2){
                this.showRankList(1);
            }

            this.node.dispatchEvent(new cc.Event.EventCustom('LoginScene', true));
        }
    },

    frameOnMove(dt){
    },

    onDestroy(){
    }
});
