window.Game = window.Game || {};

window.Game.SendMessage = {
    
    //登陆
    SendLogin: function(code, iv, encryptedData, successCb){
        var request = {
            code: code,
            game_id: GameConfig.GameID.toString(),
            iv: iv,
            encryptedData: encryptedData,
        };

        console.log("发送登陆的消息: ",request);
        
        var onMessage = function(data){
            successCb(data);
        }

        Game.NetManager.sendMsg("GET", GameConfig.LoginAddr, request, onMessage);
    },

    //发送获取配置的消息
    SendGetConfigMessage(){
        var request = {
            game_id: GameConfig.GameID.toString()
        };

        console.log("发送获取配置的消息:", request);

        var onMessage = function(res){
            if(res.errno == 0){
                Game.ConfigData = res.data;
            }
        }

        Game.NetManager.sendMsg("GET", GameConfig.GetConfigAddr, request, onMessage);
    },

    //发送获取游戏列表的消息
    SendGetGameListMessage(locationID, callback){
        var request = {
            game_id: GameConfig.GameID,
            location: locationID,
        };

        console.log("发送获取游戏列表的消息:", request);

        var onMessage = function(res){
            if(res.errno == 0){
                callback(res.data);
            }
        }

        Game.NetManager.sendMsg("GET", GameConfig.GetGameList, request, onMessage);
    },

    //发送分数的消息
    SendScoreMessage(score){
        var request = {
            user_id: Game.GlobalVar.userID.toString(),
            game_id: GameConfig.GameID.toString(),
            type: "1",
            value: score.toString()
        };

        console.log("发送分数的消息:", request);

        var onMessage = function(res){
            if(res.errno == 0){
            }
        }

        Game.NetManager.sendMsg("POST", GameConfig.UploadScoreAddr, request, onMessage);
    },

    //发送获取排行榜的消息
    SendGetRankListMessage(callback){

        var request = {
            game_id: GameConfig.GameID.toString(),
            user_id: Game.GlobalVar.userID,
            type: "1",
        };

        console.log("发送获取排行榜的消息:", request);

        var onMessage = function(res){
            if(res.errno == 0){
                callback(res.data);
            }
        }

        Game.NetManager.sendMsg("GET", GameConfig.GetRankListAddr, request, onMessage);
    },
    
    //发送获取游戏广告的的消息
    SendGetGameAdMessage(gid, callback){
        cc.log("SendGetGameAdMessage:");

        var request = {
            gid: gid,
        };

        var onMessage = function(res){
            cc.log("SendGetConfigMessage == onMessage", res);
            if(res.errno == 0){
                callback(res.data);
            }
        }

        Game.NetManager.sendMsg("Get", GameConfig.GetGameADAddr, request, onMessage);
    },

    //被分享者进入游戏通知服务器
    SendUserShare(shareUID, roundID){
        var request = {
            user_id: shareUID,
            touser_id: Game.GlobalVar.userID,
            round_id: roundID,
        };

        console.log("被分享者进入游戏通知服务器:", request);

        var onMessage = function(res){
            if(res.errno == 0){
                cc.log("被分享者进入游戏通知服务器成功", res);
            }
        }

        Game.NetManager.sendMsg("GET", GameConfig.UserShareAddr, request, onMessage);
    },

    //发送获取用户分享列表的消息
    SendGetUserShareInfo(roundID, callback){
        var request = {
            round_id: roundID,
            user_id: Game.GlobalVar.userID,
        };

        console.log("发送获取用户分享列表的消息:", request);

        var onMessage = function(res){
            if(res.errno == 0){
                if(callback){
                    callback(res.data);
                }
            }
        }

        Game.NetManager.sendMsg("GET", GameConfig.GetShareUserInfo, request, onMessage);
    },
};