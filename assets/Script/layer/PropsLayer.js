var Util = require("Util");
var WXHelper = require("WXHelper");
var ShareSceneType = require("ShareSceneType");
var PropView = require("PropView"); 

cc.Class({
    extends: cc.Component,

    properties: {
        //遮罩层
        maskLayer: cc.Node,
        
        //弹窗层
        frameLayer: cc.Node,

        //关闭按钮
        closeBtn: cc.Node,

        propsView: [PropView],
    },

    onLoad () {
        this.node.active = true;

        this.maskLayer.active = false;
        this.frameLayer.active = false;

        Util.RegBtnClickEvent(this.closeBtn, this.closeBtnClicked.bind(this));
    },

    start () {
        var self = this;

        Game.SendMessage.SendGetUserShareInfo(Game.GameData.GetCurRoundGUID(), function(data){
            if(data && Util.IsArray(data)){

                if(data && data.length > 0){
                    Game.SharePlayerMgr.clear();
                    Game.SharePlayerMgr.init(data);
    
                    self.initUIState(data);
                }
            }
            self.showLayer();
        });

        // this.showLayer();
    },

    //点击关闭按钮
    closeBtnClicked(){
        Game.AudioManager.PlayBtnSound();

        this.removeLayer(true);
    },

    initUIState(players){
        var receivedUID = Game.GameData.GetReceivedProps();
        var receivedNum = 0;
        if(receivedUID && receivedUID.length){
            receivedNum = receivedUID.length;
        }

        this.removeDuplicatePlayer(players, receivedUID);

        for(var i = 1; i <= 4; i++){
            var propsView = this.propsView[i - 1];
            if(propsView){
                if(i <= receivedNum){
                    var receivedData = receivedUID[i - 1];
                    propsView.initView(3, receivedData.uid1, receivedData.uid2);
                }else if(players.length >= 2){
                    var player1 = players.splice(0, 1);
                    var player2 = players.splice(0, 1);
                    propsView.initView(2, player1[0].user_id, player2[0].user_id);
                }else if(players.length == 1){
                    var player1 = players.splice(0, 1);
                    propsView.initView(1, player1[0].user_id);
                }else{
                    propsView.initView(1);
                }
            }   
        }
    },

    //显示
    showLayer(){
        if(!this.maskLayer){
            return;
        }

        if(!this.frameLayer){
            return;
        }

        this.maskLayer.active = true;
        Game.PopUpMgr.Show_ScaleEffect(this.frameLayer, GameConfig.PopUp_Duration);
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

        if(isEffect){
            Game.PopUpMgr.Remove_ScaleEffect(this.node, this.frameLayer, GameConfig.PopUp_Duration);
        }else{
            this.node.destroy();
        }
    },

    //去掉使用过的玩家
    removeDuplicatePlayer(data, used){
        if(!data){
            return;
        }
        if(!used){
            return;
        }

        for(var i = data.length - 1; i >= 0; i --){
            var player = data[i];
            for(var j = 0; j < used.length; j ++){
                for(var key in used[j]){
                    if(player && player.user_id == used[j][key]){
                        data.splice(i, 1);
                    }
                }
            }
        }
    },

    //对象转数组
    convertArray(obj){
        if(obj){
            if(Util.IsObject(obj)){
                var arr = [];
                for(var key in obj){
                    arr.push(obj[key]);
                }
                return arr;
            }else if(Util.IsArray(obj)){
                return obj
            }
        }
        return null;
    },

    // update (dt) {},
});
