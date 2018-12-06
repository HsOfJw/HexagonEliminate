window.Game = window.Game || {};

var WXHelper = require("WXHelper");

Game.GameData = {
    //历史最高分
    HighestScore: null,

    //当前分数
    curScore: null,

    //万能方块的数量
    universalNum: null,

    //更换ui的数量
    replaceNum: null,

    //炸弹数量
    bombNum: null,

    //当前生成方块的位置类型
    posType: null,

    //生成方块时的位置类型--随机库
    randomPosType: null,

    //生成方块的最大个数
    maxHexagonCount: null,// 1 和2

    //随机库里的最大数字类型
    maxType: null,

    //网格上的方块
    hexagonVec: null,

    //当前生成的方块
    randomHexagonVec: null,

    //是否复活过
    isResurrection: null,

    //当前局唯一标识
    curRoundGUID: null,

    //领取过的道具
    receivedProps: null,

    receivedBombNum: null,

    //已领取的替换ui的数量
    receivedReplaceNum: null,

    //已领取的万能方块的数量
    receivedUniversalNum: null,

    //上分界面使用过的玩家uid
    usedPlayerUID: null,

    //是否有存档数据
    isHaveGameArchive: null,

    //宝箱视频剩余观看次数
    chestVideoCount: null,

    //复活视频剩余观看次数
    reliveVideoCount: null,

    //炸弹视频剩余观看次数
    bombVideoCount: null,

    InitData: function(){
        this.HighestScore = 0;
        this.curScore = 0;
        this.universalNum = 0;
        this.replaceNum = 0;
        this.bombNum = 0;
        this.posType = 0;
        this.maxType = 0;
        this.receivedReplaceNum = 0;
        this.receivedUniversalNum = 0;
        this.receivedBombNum = 0;
        this.maxHexagonCount = 0;
        this.hexagonVec = {};
        this.randomHexagonVec = [];  
        this.randomPosType = [];
        this.isHaveGameArchive = false;
        this.isResurrection = false;
        this.curRoundGUID = "";
        this.receivedProps = [];
        this.usedPlayerUID = [];

        this.ReadHighestScore();
    },

    //读取视频观看次数
    ReadVideoCount: function(){
        this.curDate = new Date();

        var key = this.curDate.toLocaleDateString();

        var dataObj = null;
        var dataStr = Game.GameLocalData.ReadVideoCount();
        if(dataStr){
            dataObj = JSON.parse(dataStr);
        }

        if(!dataObj || dataObj[key] == undefined){
            this.chestVideoCount = 0;
            this.reliveVideoCount = 0;
            this.bombVideoCount = 0;
        }else{
            this.chestVideoCount = dataObj[key].chest_video_count;
            this.reliveVideoCount = dataObj[key].relive_video_count;
            this.bombVideoCount = dataObj[key].bomb_video_count;
        }
    },

    //保存视频观看次数
    SaveVideoCount: function(){
        if(this.curDate){
            var key = this.curDate.toLocaleDateString();

            var dataObj = {
            };

            dataObj[key] = {
                chest_video_count: this.chestVideoCount,
                relive_video_count: this.reliveVideoCount,
                bomb_video_count: this.bombVideoCount,
            };

            Game.GameLocalData.SaveVideoCount(dataObj);
        }
    },

    GetChestVideoCount: function(){
        return this.chestVideoCount;
    },

    GetReliveVideoCount: function(){
        return this.reliveVideoCount;
    },

    GetBombVideoCount: function(){
        return this.bombVideoCount;
    },

    SetChestVideoCount: function(count){
        this.chestVideoCount = count;
    },

    SetReliveVideoCount: function(count){
        this.reliveVideoCount = count;;
    },

    SetBombVideoCount: function(count){
        this.bombVideoCount = count;;
    },

    SetHeighestScore: function(score){
        this.HighestScore = score;

        // this.SaveHighestScore();

        // //上传分数到服务器
        // Game.SendMessage.SendScoreMessage(score);

        // var KVDataList = this.GenerateCloudData();
        // WXHelper.UploadUserCloudStorage(KVDataList);
    },

    SetReceivedProps: function(userid1, userid2){
        this.receivedProps.push({
            uid1: userid1,
            uid2: userid2,
        });

        // this.SaveGameArchive();

    },

    SetUsedPlayerUID: function(playerUID){
        this.usedPlayerUID.push(playerUID);

        // this.SaveGameArchive();

    },

    SetReceivedBombNum: function(num){
        this.receivedBombNum = num;
    },

    SetReceivedReplaceNum: function(num){
        this.receivedReplaceNum = num;
    },

    SetReceivedUniversalNum: function(num){
        this.receivedUniversalNum = num;
    },

    //设置当前局的唯一标识
    SetCurRoundGUID: function(guid){
        this.curRoundGUID = guid;

        // this.SaveGameArchive();

    },

    SetIsResurrection(value){
        this.isResurrection = value;

        // this.SaveGameArchive();

    },

    //设置当前分数
    SetCurScore: function(curScore){
        this.curScore = curScore;

        // this.SaveGameArchive();
        
        Game.EventCenter.DispatchEvent(Game.MessageType.CurScore_Update);
    },

    //添加分数
    AddCurScore: function(score){
        this.curScore += score;

        // this.SaveGameArchive();

        Game.EventCenter.DispatchEvent(Game.MessageType.CurScore_Update);
    },

    //设置万能块的数量
    SetUniversalNum: function(num){
        this.universalNum = num;

        // this.SaveGameArchive();
    },

    //设置更换ui的数量
    SetReplaceNum: function(num){
        this.replaceNum = num;

        // this.SaveGameArchive();
    },

    SetBombNum: function(num){
        this.bombNum = num;

        // this.SaveGameArchive();
    },

    //重置上分界面使用过的玩家uid
    ResetUsedPlayerUID: function(){
        this.usedPlayerUID.length = 0;

        // this.SaveGameArchive();
    },

    //重置网格上的方块数据
    ResetHexagonData: function(){
        this.hexagonVec = null;

        this.hexagonVec = {};

        // this.SaveGameArchive();
    },


    //重置当前随机生成的方块数据
    ResetRandomHexagonData: function(){
        this.randomHexagonVec.length = 0;

        // this.SaveGameArchive();
    },

    //设置网格上的方块
    AddHexagon: function(type, id){
        if(this.hexagonVec){
            this.hexagonVec[id] = type;
        }

        // this.SaveGameArchive();
    },

    //设置当前随机生成的方块
    AddRandomHexagon: function(type){
        if(this.randomHexagonVec){
            this.randomHexagonVec.push(type);
        }

        // this.SaveGameArchive();
    },

    //设置当前随机生成的方块的位置类型
    SetCurPosType: function(type){
        this.posType = type;

        // this.SaveGameArchive();
    },

    //设置随机库最大生成类型
    SetMaxType: function(type){
        if(type <= this.maxType || type > GameConfig.MaxNumType){
            return;
        }
        
        this.maxType = type;

        // this.SaveGameArchive();
    },

    //设置生成方块时的最多个数
    SetMaxHexagonCount: function(count){
        this.maxHexagonCount = count;

        // this.SaveGameArchive();
    },

    //设置方块的位置类型
    SetHexagonPosType: function(posType){
        if(this.randomPosType){
            this.randomPosType.length = 0;

            this.randomPosType = posType;
        }

        // this.SaveGameArchive();
    },  

    GetReceivedBombNum: function(){
        return this.receivedBombNum;
    },

    GetReceivedReplaceNum: function(){
        return this.receivedReplaceNum;
    },

    GetReceivedUniversalNum: function(){
        return this.receivedUniversalNum;
    },

    GetReceivedProps: function(){
        return this.receivedProps;
    },

    GetUsedPlayerUID: function(){
        return this.usedPlayerUID;
    },

    //获取当前局的唯一标识
    GetCurRoundGUID: function(){
        return this.curRoundGUID;
    },

    GetIsResurrection(){
        return this.isResurrection;
    },

    //获得生成方块的最多个数
    GetMaxHexagonCount: function(){
        return this.maxHexagonCount;
    },

    //获取方块的位置类型
    GetHexagonPosType: function(){
        return this.randomPosType;
    },

    //获取当前分数
    GetCurScore: function(){
        return this.curScore;
    },

    //设置当前随机生成的方块的位置类型
    GetCurPosType: function(){
        return this.posType;
    },

    //设置随机库最大生成类型
    GetMaxType: function(){
        return this.maxType;
    },

    //获取放置到网格上的方块
    GetHexagonData: function(){
        return this.hexagonVec;
    },

    //获取随机生成的方块数据
    GetRandomHexagon: function(){
        return this.randomHexagonVec;
    },  

    //设置万能块的数量
    GetUniversalNum: function(num){
        return this.universalNum;
    },

    //设置更换ui的数量
    GetReplaceNum: function(num){
        return this.replaceNum;
    },

    //获得炸弹数量
    GetBombNum: function(num){
        return this.bombNum;
    },

    //获取最高分
    GetHeighestScore: function(){
        return this.HighestScore;
    },

    //
    GetHexagonData: function(){
        return this.hexagonVec;
    },

    GetRandomHexagon: function(){
        return this.randomHexagonVec;
    },

    //是否有存档
    IsHasGameArchive: function(){
        return this.isHaveGameArchive;
    },

    //读取最高分
    ReadHighestScore: function(){
        this.HighestScore = Game.GameLocalData.ReadHighestScore();
        return this.HighestScore;
    },

    //重置存档数据
    ResetGameArchive: function(){
        this.InitData();
        Game.GameArchive.ResetGameArchive();
    },

    //读取游戏存档
    ReadGameArchive: function(){
        var archiveData = Game.GameArchive.ReadGameArchive();
        if(archiveData){
            this.curScore = archiveData.cur_score;
            this.posType = archiveData.pos_type;
            this.maxType = archiveData.max_type;
            this.maxHexagonCount = archiveData.max_hexagon_count;
            this.universalNum = archiveData.universal_num;
            this.replaceNum = archiveData.replace_num;
            this.bombNum = archiveData.bomb_num;
            this.hexagonVec = archiveData.hexagon_data;
            this.randomHexagonVec = archiveData.random_hexagon_data;
            this.randomPosType = archiveData.random_pos_lib;
            this.isResurrection = archiveData.is_resurrection;
            this.curRoundGUID = archiveData.cur_round_guid;
            this.receivedProps = archiveData.received_props;
            this.usedPlayerUID = archiveData.used_player_uid;
            this.receivedReplaceNum = archiveData.received_replace_num;
            this.receivedUniversalNum = archiveData.received_universal_num;
            
            if(archiveData.received_bomb_num == undefined){
                archiveData.received_bomb_num = 0;
            }

            this.receivedBombNum = archiveData.received_bomb_num;
        }else{
            this.InitData();
        }
        this.isHaveGameArchive = (archiveData != null);

        //读取最高分
        this.ReadHighestScore();
    },

    //保存最高分
    SaveHighestScore: function(){
        Game.GameLocalData.SaveHighestScore(this.HighestScore)
    },

    //保存存档数据
    SaveGameArchive(){
        var archiveData = this.GenerateGameArchive();
        Game.GameArchive.SaveGameArchive(archiveData);
    },

    Save(){
        //保存到本地
        this.SaveHighestScore();
        this.SaveGameArchive();

        //保存视频剩余观看次数
        this.SaveVideoCount();

        //上传用户托管数据
        var KVDataList = this.GenerateCloudData();
        WXHelper.UploadUserCloudStorage(KVDataList);

        //上传最高分到服务器
        Game.SendMessage.SendScoreMessage(this.HighestScore);
    },

    //生成用户托管数据
    GenerateCloudData(){
        var cloudData = {
            key: "highest_score",
            value: this.HighestScore.toString(),
        }

        var keyDataList = [];

        keyDataList.push(cloudData);

        return keyDataList;
    },

    //生成用户存档数据
    GenerateGameArchive(){

        var archiveData = {
            cur_score: this.curScore,

            universal_num: this.universalNum,

            replace_num: this.replaceNum,

            bomb_num: this.bombNum,

            hexagon_data: this.hexagonVec,

            random_hexagon_data: this.randomHexagonVec,

            pos_type: this.posType,

            max_type: this.maxType,

            max_hexagon_count: this.maxHexagonCount,

            random_pos_lib: this.randomPosType,

            is_resurrection:this.isResurrection,

            cur_round_guid: this.curRoundGUID,

            received_props: this.receivedProps,

            used_player_uid: this.usedPlayerUID,

            received_replace_num: this.receivedReplaceNum,

            received_universal_num: this.receivedUniversalNum,

            received_bomb_num: this.receivedBombNum,
        };

        return archiveData;
    },
};

//游戏存档功能
Game.GameArchive = {
    //存档
    SaveGameArchive(data){
        var strData = JSON.stringify(data);

        Game.GameLocalData.SaveGameArchive(strData);
    },

    //读取游戏存档
    ReadGameArchive: function(){
        var strData = Game.GameLocalData.ReadGameArchive();
        if(strData){
            return JSON.parse(strData);
        }
        return null;
    },

    //重置存档数据
    ResetGameArchive: function(){
        Game.GameLocalData.RemoveGameArchive();
    },
};
