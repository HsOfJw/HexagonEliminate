var ShareSceneType = require("ShareSceneType");
var UserInfoBtnConfig = require("UserInfoBtnConfig");
var SubdomainMsg = require("SubdomainMsg");

var WXHelper = {

    SceneID: {
        GroupShare: 1044,   //带shareTicket的小程序消息卡片
    },

    userInfoBtn: [],

    clubBtn: null,

    IsWXContext: function(){
        if (window.wx != undefined) {
            return true;
        }
        return false;
    },

    //返回小程序的启动参数
    GetLaunchOptionsSync(){
        if(this.IsWXContext()){
            return wx.getLaunchOptionsSync();
        }
        return null;
    },

    //监听小游戏返回到前台的事件
    OnShow(callback){
        if(this.IsWXContext()){
            wx.onShow(callback);
        }
    },

    //监听小游戏进入后台的事件
    OnHide(callback){
        if(this.IsWXContext()){
            wx.onHide(callback);
        }
    },

    //监听小游戏退出的事件
    ExitMiniProgram(callback){
        if(this.IsWXContext()){
            // wx.exitMiniProgram({
            //     success: function(){
            //         cc.log("ExitMiniProgram:success");
            //         // callback();
            //     },
            //     fail: function(){
            //         cc.log("ExitMiniProgram:fail");
            //     },
            //     complete: function(){
            //         cc.log("ExitMiniProgram:complete");
            //     },

            // });
        }
    },

    Login: function(callback){
        var self = this;

        var userid = Game.GameLocalData.ReadUserID();
        if(userid){
            //本地有userid不用登陆直接返回
            callback(1);
        }else{
            if (window.wx != undefined) {
                var success = function(res){
                    cc.log("login success:resCode = " + res.code);
                    callback(2, res.code);
                };
                var fail = function(){
                    cc.log("login fail");
                    callback(3);
                };
                wx.login({
                    success: success,
                    fail: fail
                });
            }else{
                callback(19);
            }
        }
    },

    //查看群排行的分享
    GroupRankListShare: function(callback){
        cc.log("GroupRankListShare");

        if(WXHelper.IsWXContext() == false){
            return;
        }

        if(!Game.ConfigData){
            return;
        }

        var shareConfig = Game.ConfigData.share[ShareSceneType.GroupRankList];

        if(!shareConfig){
            return;
        }


        window.wx.shareAppMessage({
            title: shareConfig.info.share_title,
            imageUrl: shareConfig.info.share_img,
            query: "enterStyle=ranklist&uid=" + Game.GlobalVar.userID,
            success: function(res){
                console.log("分享成功");
                callback(res);
            },
            fail: function(res){
                console.log("分享失败",res);
                WXHelper.ShowToast(GameConfig.Share_Text2);
            }
        });
    },

    //求助好友的分享
    ForHelpFriendShare: function(callback){
        console.log("ForHelpFriendShare");

        if(WXHelper.IsWXContext() == false){
            return;
        }
        if(!Game.ConfigData){
            return;
        }

        var shareConfig = Game.ConfigData.share[ShareSceneType.ForHelpFriend];

        if(!shareConfig){
            return;
        }

        window.wx.shareAppMessage({
            title: shareConfig.info.share_title,
            imageUrl: shareConfig.info.share_img,
            query: "enterStyle=forhelp&uid=" + Game.GlobalVar.userID + "&roundID=" + Game.GameData.GetCurRoundGUID(),
            success: function(res){
                console.log("分享成功");
                if(callback){
                    callback(res);
                }
            },
            fail: function(res){
                console.log("分享失败",res);
                WXHelper.ShowToast(GameConfig.Share_Text2);
            }
        });
    },
    
    //显示转发按钮
    ShowShareButton: function(){
        if(this.IsWXContext()){
            //设置分享按钮，方便获取群id展示群排行榜
            window.wx.showShareMenu({withShareTicket: true});
        }
    },

    //被动分享
    PassiveShare(){
        cc.log("PassiveShare");

        if(WXHelper.IsWXContext() == false){
            return;
        }

        if(!Game.ConfigData){
            return;
        }

        var shareConfig = Game.ConfigData.share[ShareSceneType.PassiveShare];

        if(!shareConfig){
            return;
        }

        window.wx.onShareAppMessage(function(){
            return {
                title: shareConfig.info.share_title,
                imageUrl: shareConfig.info.share_img,
            };
        });
    },

    //普通分享
    CommonShare: function(sceneType, callback){
        cc.log("CommonShare");

        if(WXHelper.IsWXContext() == false){
            return;
        }

        if(!Game.ConfigData){
            return;
        }

        var shareConfig = Game.ConfigData.share[sceneType];

        if(!shareConfig){
            return;
        }

        window.wx.shareAppMessage({
            title: shareConfig.info.share_title,
            imageUrl: shareConfig.info.share_img,
            success: function(res){
                console.log("分享成功");

                var isgroup = false;
                if(res.shareTickets == null || res.shareTickets == undefined || res.shareTickets == ""){ 
                    console.log("分享给个人");
                    
                }else{
                    console.log("分享到群");
                    isgroup = true;
                }

                if(callback){
                    callback(res, isgroup);
                }
            },
            fail: function(res){
                console.log("分享失败",res);
                WXHelper.ShowToast(GameConfig.Share_Text2);
            }
        });
    },

    //截屏分享
    ScreenShotsShare: function(callback){
        cc.log("Share");

        if(WXHelper.IsWXContext() == false){
            return;
        }

        var canvas = cc.game.canvas;
        var width  = cc.winSize.width;
        var height  = cc.winSize.height;
        canvas.toTempFilePath({
            x: 0,
            y: 0,
            width: width,
            height: height,
            destWidth: 500,
            destHeight: 400,
            success (res) {
                if (window.wx != undefined) {
                    window.wx.shareAppMessage({
                        title: GameConfig.ShareText,
                        imageUrl: res.tempFilePath,
                        success: function(res){
                            console.log("分享成功");
                            callback(res);
                        },
                        fail: function(res){
                            console.log("分享失败",res);
                            WXHelper.ShowToast(GameConfig.Share_Text2);
                        }
                    });
                }
            }
        })
    },

    GetUseInfo: function(){
        if(WXHelper.IsWXContext() == false){
            return;
        }

        wx.getUserInfo({
            withCredentials: false,
            lang: "zh_CN",
            success: function(res){
                Game.UserInfo = res.userInfo;
                cc.log("GetUserInfo:success:", res);
            },
            fail: function(res){
                cc.log("GetUserInfo:fail:", res);
            }
        });
    },

    UploadUserCloudStorage: function(data){
        cc.log("UploadUserCloudStorage" + data);
        
        if (window.wx != undefined) {
            wx.setUserCloudStorage({  
                KVDataList: data,
                success: function (res) {  
                    console.log('setUserCloudStorage','success',res)  
                },  
                fail: function (res) {  
                    console.log('setUserCloudStorage','fail')  
                },  
                complete: function (res) {  
                    console.log('setUserCloudStorage','ok')  
                }  
            });
        }
    },

    //展示好友排行榜
    FetchFriendRankList: function(){
        if (window.wx != undefined) {
            WXHelper.InitSharedCanvas();

            window.wx.postMessage({
                messageType: SubdomainMsg.MT_FriendRankList
            });

            cc.log("发送消息到子域!--->>>展示好友排行榜");

            return new cc.Texture2D();
        }
    },

    //展示游戏结束界面排行榜
    GameOverRankList: function(){
        if(window.wx != undefined){
            WXHelper.InitSharedCanvas();

            window.wx.postMessage({
                messageType: SubdomainMsg.MT_OverRankList,
                curLevel: Game.GlobalVar.curLevel,
            });
            cc.log("发送消息到子域!--->>>展示游戏结束界面排行榜");

            return new cc.Texture2D();
        }
    },

    //展示即将超越的玩家
    JJCYPlayer: function(){
        if(window.wx != undefined){
            WXHelper.InitSharedCanvas();

            window.wx.postMessage({
                messageType: SubdomainMsg.MT_JJCYPlayer,
                curScore: Game.GameData.GetCurScore(),
            });

            return new cc.Texture2D();
        }
    },

    //刷新即将超越的玩家
    RefreshJJCYPlayer: function(curScore){
        if(window.wx != undefined){
            window.wx.postMessage({
                messageType: SubdomainMsg.MT_UpdateJJCYPlayer,
                curScore: Game.GameData.GetCurScore(),
            });
        }
    },

    //展示群排行榜
    GroupRankList: function(){
        if (window.wx != undefined) {
            WXHelper.InitSharedCanvas();

            window.wx.postMessage({
                messageType: SubdomainMsg.MT_GroupRankList,
                groupShareTicket: Game.GlobalVar.shareTicket
            });

            cc.log("发送消息到子域!--->>>展示群排行榜");

            return new cc.Texture2D();
        }
    },

    InitSharedCanvas: function(){
        if (window.wx != undefined) {
            var openDataContext = wx.getOpenDataContext();
            var sharedCanvas = openDataContext.canvas;
            if (sharedCanvas) {
                sharedCanvas.width = cc.game.canvas.width * 2;
                sharedCanvas.height = cc.game.canvas.height * 2;
            }
        }
    },

    ClearSharedCanvas: function(){
        if (window.wx != undefined) {
            // var openDataContext = wx.getOpenDataContext();
            // var sharedCanvas = openDataContext.canvas;
            // if (sharedCanvas) {
            //     sharedCanvas.width = 0;
            //     sharedCanvas.height = 0;
            // }

            window.wx.postMessage({
                messageType: SubdomainMsg.MT_Clear
            });

            cc.log("发送消息到子域!--->>>清理子域");
        }
    },

    CreateUserInfoButton: function(callback){
        var self = this;

        if(UserInfoBtnConfig.length <= 0){
            return;
        }

        if(WXHelper.IsWXContext() == false){
            return;
        }

        if(Game.SystemInfo){

            for(var i = 0;i < UserInfoBtnConfig.length;i ++){
                var item = UserInfoBtnConfig[i];

                let modelWidth = Game.SystemInfo.windowWidth;
                let modelHeight = Game.SystemInfo.windowHeight;
                let buttonWidth = item.width * (modelWidth / (cc.winSize.width));
                let buttonHeight = item.height * (modelHeight / (cc.winSize.height));
                let buttonLeft = modelWidth * item.left - buttonWidth * 0.5;
                let buttonTop = (cc.winSize.height - item.top) / (cc.winSize.height / modelHeight);

                if(item.type == 3){
                    buttonTop = ((cc.winSize.height * 0.5) + 190) / (cc.winSize.height / modelHeight);
                }
                
                let button = wx.createUserInfoButton({
                    type: 'image ',
                    image: item.imgSrc,
                    style: {
                        left: buttonLeft,
                        top: buttonTop,
                        width: buttonWidth,
                        height: buttonHeight,
                    }
                });

                button.mType = item.type;

                (function(type){
                    button.onTap((res) => {
                        callback(res, type);
                    });
                }(item.type));

                self.userInfoBtn.push(button);
            }
        }
    },

    //创建游戏圈按钮
    CreateClubButton: function(callback){
        var self = this;

        cc.log("CreateClubButton");

        if(WXHelper.IsWXContext() == false){
            return;
        }

        if(Game.SystemInfo){
            let modelWidth = Game.SystemInfo.windowWidth;
            let modelHeight = Game.SystemInfo.windowHeight;
            let buttonWidth = 95 * (modelWidth / (cc.winSize.width));
            let buttonHeight = 111 * (modelHeight / (cc.winSize.height));
            let buttonLeft = modelWidth * 0.19 - buttonWidth * 0.5;
            let buttonTop = (cc.winSize.height - 454) / (cc.winSize.height / modelHeight);
    
            let button = wx.createGameClubButton({
                type: 'image',
                image: "http://gather.51weiwan.com//uploads//file//20180822//79a4d5d821868f7e2fcec8c32739008f.png",
                style: {
                    left: buttonLeft,
                    top: buttonTop,
                    width: buttonWidth,
                    height: buttonHeight,
                }
            });
    
            // button.onTap((res) => {
            //     callback(res);
            // });
    
            button.hide();
    
            self.clubBtn = button;
        }
    },

    HideClubBtn: function(){
        if(this.clubBtn){
            this.clubBtn.hide();
        }
    },
    
    ShowClubBtn: function(){
        if(this.clubBtn){
            this.clubBtn.show();
        }
    },

    DestroyUserInfoBtn: function(){
        if(this.userInfoBtn){
            for(var i = 0;i < this.userInfoBtn.length;i ++){
                this.userInfoBtn[i].destroy();
            }
            this.userInfoBtn.length = 0;
        }
    },

    //隐藏用户信息按钮
    HideUserInfoBtn: function(type){
        if(!type){
            if(this.userInfoBtn){
                for(var i = 0;i < this.userInfoBtn.length;i ++){
                    this.userInfoBtn[i].hide();
                }
            }
        }else{
            if(this.userInfoBtn){
                for(var i = 0;i < this.userInfoBtn.length;i ++){
                    if(this.userInfoBtn[i].mType == type){
                        this.userInfoBtn[i].hide();
                    }
                }
            }
        }
    },

    //显示用户信息按钮
    ShowUserInfoBtn: function(type){
        if(!type){
            if(this.userInfoBtn){
                for(var i = 0;i < this.userInfoBtn.length;i ++){
                    this.userInfoBtn[i].show();
                }
            }
        }else{
            if(this.userInfoBtn){
                for(var i = 0;i < this.userInfoBtn.length;i ++){
                    if(this.userInfoBtn[i].mType == type){
                        this.userInfoBtn[i].show();
                    }
                }
            }
        }
    },
    
    GetSystemInfo: function(callback){
        //调用微信接口 获取设备信息
        if(Game.SystemInfo){
            return;
        }
        if (window.wx != undefined) {
            Game.SystemInfo = wx.getSystemInfoSync();
        }
    },

    //更多游戏
    MoreGame: function(){
        if (window.wx != undefined) {
            if(Game.ConfigData){
                wx.navigateToMiniProgram({
                    appId: Game.ConfigData.app_id,
                    path: '',
                    envVersion: 'release',
                    success: function () {
                        console.log("跳转到更多游戏成功");
                    },
                    fail: function (res) {
                        console.log("跳转到更多游戏失败", res);
                    },
                });
            }
        }

    },

    ShowToast(title){
        if(this.IsWXContext()){
            wx.showToast({
                title: title,
            });
        }
    }
};

module.exports = WXHelper;