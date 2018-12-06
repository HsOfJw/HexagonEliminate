window.Game = window.Game || {};

//所有自定义事件派发中心
window.Game.EventCenter = {

    eventTargetList: null,

    dispatchList: null,

    //注册事件
    RegisterEvent: function(uuid, key, callback){
        if(!uuid){
            return;
        }
        if(!key){
            return;
        }
        if(!callback){
            return;
        }
        //初始化
        if(!this.eventTargetList){
            this.eventTargetList = {};
        }
        if(!this.eventTargetList[uuid]){
            this.eventTargetList[uuid] = {};
        }
        if(!this.eventTargetList[uuid][key]){
            this.eventTargetList[uuid][key] = [];
        }

        this.eventTargetList[uuid][key].push(callback);
    },

    DispatchEvent: function(key, data){
        if(!key){
            return;
        }
        if(this.eventTargetList){

            for(var target in this.eventTargetList){
                if(this.eventTargetList[target]){
                    var eventList = this.eventTargetList[target]
                    if(eventList[key]){
                        var callbackArr = eventList[key];
                        if(callbackArr){
                            for(var i = 0;i < callbackArr.length;i ++){
                                callbackArr[i](data);   
                            }
                        }
                    }
                }
            }
        }
    },

    DispatchEventSync: function(key){
        if(!this.dispatchList){
            this.dispatchList = [];
        }

        if(!key){
            return;
        }

        this.dispatchList.push(key);
    },

    FrameOnMove :function(dt){
        if(this.dispatchList && this.dispatchList.length > 0){
            var len = this.dispatchList.length;
            for(var i = 0;i < len;i ++){
                var key = this.dispatchList[i];
                this.DispatchEvent(key);
            }
            this.dispatchList.length = 0;
        }
    },

    RemoveEvent(uuid){
        if(!uuid){
            return;
        }
        if(this.eventTargetList && this.eventTargetList[uuid]){
            delete this.eventTargetList[uuid];
        }
    },

    ClearAll:function(){
        if(this.eventTargetList){
            this.eventTargetList = null;
        }
        if(this.dispatchList){
            this.dispatchList.length = 0;
            this.dispatchList = null;
        }
    }
}

Game.MessageType = {
    DragCom_Touch_End       : "DragCom_Touch_End",
    DragCom_Clicked_Event   : "DragCom_Clicked_Event",
    Reproduce_Hexagon       : "Reproduce_Hexagon",
    Restart_Game            : "Restart_Game",
    Return_Home_Page        : "Return_Home_Page",
    Start_Guide             : "Start_Guide",
    Synthesi_Hexagon_Event  : "Hexagon_Synthesi_Event",
    Synthesi_2048_Event     : "Synthesi_2048_Event",
    Refresh_UI              : "Refresh_UI",
    Add_Hexagon_Event       : "Add_Hexagon_Event",
    Remove_Hexagon_Event    : "Remove_Hexagon_Event",
    Game_Over               : "Game_Over",
    Random_Hexagon_Event    : "Random_Hexagon_Event",
    Resurrection_Event      : "Resurrection_Event",
    CurScore_Update         : "CurScore_Update",
    ReceiveChest_Event      : "ReceiveChest_Event",
    ReceiveChest_Success    : "ReceiveChest_Success",
    ReceiveProp_Event       : "ReceiveProp_Event",
    ReceiveReplace_Event    : "ReceiveReplace_Event",
    ReceiveUniversal_Event  : "ReceiveUniversal_Event",

    //网络消息
    Game_MIN_TIME_REP: "Game_MIN_TIME_REP", //获取当前关卡内的最小过关时间成功
    Game_MIN_TIME_REP_NO_DATA: "Game_MIN_TIME_REP_NO_DATA", //获取当前关卡内的最小过关时间失败 没有数据
};
