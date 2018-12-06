window.Game = window.Game || {};

Game.GameLocalData = {

    //读取user id
    ReadUserID: function(){
        var userid = cc.sys.localStorage.getItem('userid');
        if(userid == null || userid == ""){
            return null;
        }
        return userid;
    },

    //清除user id
    ClearUserID: function(){
        cc.sys.localStorage.removeItem('userid')
    },

    //保存user id
    SaveUserID: function(userid){
        cc.sys.localStorage.setItem('userid', userid);
    },

    ReadClearDataFlag: function(){
        var flag = cc.sys.localStorage.getItem(GameConfig.ClearDataFlag);
        if(flag == null || flag == ""){
            return true;
        }
        return false;
    },

    //读取历史最高分
    ReadHighestScore: function(){
        var highestScore = cc.sys.localStorage.getItem('highest_score');
        if(highestScore == null || highestScore == ""){
            return 0;
        }

        return highestScore;
    },

    SetClearDataFlag: function(){
        cc.sys.localStorage.setItem(GameConfig.ClearDataFlag, 1);
    },

    //保存历史最高分
    SaveHighestScore: function(highestScore){
        cc.sys.localStorage.setItem('highest_score', highestScore);
    },

    //读取视频剩余观察次数
    ReadVideoCount: function(){
        return cc.sys.localStorage.getItem('video_count');
    },

    //保存视频剩余观察次数
    SaveVideoCount: function(videoCount){
        cc.sys.localStorage.setItem('video_count', JSON.stringify(videoCount));
    },

    //移除存档
    RemoveGameArchive: function(){
        cc.sys.localStorage.removeItem('archive')
    },

    //读档
    ReadGameArchive: function(){
        var archiveData = cc.sys.localStorage.getItem('archive');
        if(archiveData){
            return archiveData;
        }
        return null;
    },

    //存档
    SaveGameArchive: function(strArchiveData){
        if(strArchiveData){
            cc.sys.localStorage.setItem('archive', strArchiveData);
        }
    }
};