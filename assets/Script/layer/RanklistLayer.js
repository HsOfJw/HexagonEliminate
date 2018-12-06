var BaseCom = require("BaseCom");
var WXHelper = require("WXHelper");
var ShareSceneType = require("ShareSceneType");
var Util = require("Util");

var RankList = cc.Enum({
    WorldRankList: 1,
    GroupRankList: 2,
    FriendRankList: 3,
});

cc.Class({
    extends: cc.Component,

    properties: {
        //遮罩层
        maskLayer: cc.Node,
        
        //弹窗层
        frameLayer: cc.Node,

        //关闭按钮
        closeBtn: cc.Node,

        //排行榜条目预制体
        rankItemPrefab: cc.Prefab,

        //排行榜条目父节点
        scrollViewContent: cc.Node,

        //按钮
        btnNode: cc.Node,

        //标题
        titleNode: cc.Node,

        //切换世界排行
        worldImg: cc.Node,

        //切换好友排行
        friendImg: cc.Node,

        worldText: cc.Node,

        friendText: cc.Node,
        
        //显示群排行
        rankingScrollView: cc.Sprite,
    },

    //世界排行榜数据
    worldRankListData: null,

    //自己的数据
    selfData: null,

    type: null, //排行榜类型 1：世界 2：群
    
    onLoad () {
        this.node.active = true;
        this.maskLayer.active = false;
        this.frameLayer.active = false;

        Util.RegBtnClickEvent(this.closeBtn, this.closeBtnClicked.bind(this));
        Util.RegBtnClickEvent(this.btnNode, this.btnclicked.bind(this));
        Util.RegTouchEndEvent(this.worldImg, this.switchWorldRanklist.bind(this));
        Util.RegTouchEndEvent(this.friendImg, this.switchFriendRanklist.bind(this));
    },

    start () {
        this.showLayer();
    },

    setType(type){
        this.type = type;
    },

    //点击关闭按钮
    closeBtnClicked(){
        Game.AudioManager.PlayBtnSound();

        this.removeLayer(true);
    },

    btnclicked(){
        Game.AudioManager.PlayBtnSound();

        if(this.type == RankList.WorldRankList || this.type == RankList.FriendRankList){
            //炫耀一下
            WXHelper.CommonShare(ShareSceneType.WorldRankList);

        }else if(this.type == RankList.GroupRankList){
            //发起挑战
            this.removeLayer(true);

            var startScene = Game.SceneMgr.getSceneByType(Game.SceneType.StartScene);
            if(startScene){
                startScene.startGame();
            }

        }
    },

    //切换世界排行
    switchWorldRanklist(){
        Util.SetNodeTexture(this.worldImg, "resources/startscene/white.png");
        Util.SetNodeTexture(this.worldText, "resources/startscene/worldImg1.png");
        Util.SetNodeTexture(this.friendImg, "resources/startscene/yellow.png");
        Util.SetNodeTexture(this.friendText, "resources/startscene/friendImg2.png");
        Util.SetNodeTexture(this.titleNode, "resources/startscene/worldTitle.png");

        this.setType(RankList.WorldRankList);

        this.showWorldRankList();
    },

    //切换好友排行
    switchFriendRanklist(){
        Util.SetNodeTexture(this.worldImg, "resources/startscene/yellow.png");
        Util.SetNodeTexture(this.worldText, "resources/startscene/worldImg2.png");
        Util.SetNodeTexture(this.friendImg, "resources/startscene/white.png");
        Util.SetNodeTexture(this.friendText, "resources/startscene/friendImg.png");
        Util.SetNodeTexture(this.titleNode, "resources/startscene/friendTitle.png");

        this.setType(RankList.FriendRankList);

        this.showFriendRankList();
    },

    //显示 type:1 世界排行 type:2群排行 type: 3 好友排行
    showLayer(){
        if(!this.maskLayer){
            return;
        }

        if(!this.frameLayer){
            return;
        }

        this.maskLayer.active = true;
        Game.PopUpMgr.Show_ScaleEffect(this.frameLayer, GameConfig.PopUp_Duration);

        //显示排行榜
        if(this.type == RankList.WorldRankList){
            this.showWorldRankList();
        }else if(this.type == RankList.GroupRankList){
            this.showGroupRankList();
        }else if(this.type == RankList.FriendRankList){
            this.showFriendRankList();
        }
    },

    //隐藏
    removeLayer(isEffect){
        if(!this.maskLayer){
            return;
        }

        if(!this.frameLayer){
            return;
        }

        this.maskLayer.active = false;

        WXHelper.ClearSharedCanvas();

        if(isEffect){
            Game.PopUpMgr.Remove_ScaleEffect(this.node, this.frameLayer, GameConfig.PopUp_Duration);
        }else{
            this.node.destroy();
        }

        var startScene = Game.SceneMgr.getCurScene();
        if(startScene){
            startScene.hideGameClubBtn();
            startScene.hideCocosBtn();

            WXHelper.HideUserInfoBtn(3);
        }

        this.worldRankListData = null;
        this.selfData = null;
        this.tex = null;
    },
    
    //展示好友排行榜
    showFriendRankList(){
        this.clearRankList();

        if(this.rankingScrollView){
            this.rankingScrollView.node.active = true;
        }

        if(!this.tex){
            this.tex = WXHelper.FetchFriendRankList();
        }
    },

    //展示群排行榜
    showGroupRankList(){
        if(this.rankingScrollView){
            this.rankingScrollView.node.active = true;
        }
        this.worldImg.active = false;
        this.worldText.active = false;
        this.friendImg.active = false;
        this.friendText.active = false;

        Util.SetNodeTexture(this.btnNode, "resources/startscene/faqitz.png");
        Util.SetNodeTexture(this.titleNode, "resources/startscene/title.png");

        if(Game.GameLocalData.ReadUserID() == null){
            this.btnNode.active = false;
        }

        this.tex = WXHelper.GroupRankList();
    },

    //展示世界排行榜
    showWorldRankList(){
        var self = this;

        this.clearRankList();

        self.scrollViewContent.active = true;

        Util.SetNodeTexture(this.btnNode, "resources/startscene/xuanyao.png");
        Util.SetNodeTexture(this.titleNode, "resources/startscene/worldTitle.png");

        var refreshRankList = function(){
            if(self.worldRankListData){
                for(var i = 0;i < self.worldRankListData.length;i ++){
                    var playerInfo = self.worldRankListData[i];
                    var item = cc.instantiate(self.rankItemPrefab);
                    var rankItem = item.getComponent('RankItem');
                    if(rankItem){
                        rankItem.initView(i + 1, playerInfo);
                        self.scrollViewContent.addChild(item);
                        item.y = -(i * 100);
                    }
                }
            }


            //自己的排名
            if(self.selfData){
                let userItem = cc.instantiate(self.rankItemPrefab);
                userItem.getComponent('RankItem').initView(self.selfData.rank, self.selfData, true);
                userItem.y = -190;
                userItem.tag = 1000;
                self.frameLayer.addChild(userItem);
            }
        };

        if(self.worldRankListData && self.selfData){
            refreshRankList();
        }else{
            //获取排行榜数据
            Game.SendMessage.SendGetRankListMessage(function(data){
                self.worldRankListData = data.data;
                self.selfData = data.user_info;
                
                refreshRankList();
            });
        }
    },

    clearRankList(){
        if(this.frameLayer.getChildByTag(1000)){
            this.frameLayer.getChildByTag(1000).destroy();
        }

        if(this.scrollViewContent){
            this.scrollViewContent.removeAllChildren();

            this.scrollViewContent.active = false;
        }

        if(this.rankingScrollView){
            this.rankingScrollView.node.active = false;
        }
    },

    // 刷新子域的纹理
    _updateSubDomainCanvas() {
        if (window.sharedCanvas != undefined && this.tex && this.rankingScrollView) {
            this.tex.initWithElement(window.sharedCanvas);
            this.tex.handleLoadedTexture();
            this.rankingScrollView.spriteFrame = new cc.SpriteFrame(this.tex);
        }
    },

    update(dt){
        this._updateSubDomainCanvas();
    },

    onDestroy(){
        cc.log("onDestroy--->>>RankListLayer");
    },
});
