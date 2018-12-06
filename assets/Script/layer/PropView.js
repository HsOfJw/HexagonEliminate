var Util = require("Util");
var WXHelper = require("WXHelper");
var ShareSceneType = require("ShareSceneType");

var PropView = cc.Class({
    extends: cc.Component,

    properties: {
        headNode: [cc.Node],
        btn: cc.Node,
    },

    statics: {
        State: {
            InvateState         : 1,    //邀请状态
            WaitReceiveState    : 2,    //待领取状态
            ReceivedState       : 3,    //已领取状态
        },
    },

    curState: null,

    uid1: null,

    uid2: null,

    ctor(){
        this.curState = PropView.State.InvateState;
    },

    onLoad () {
        Util.RegBtnClickEvent(this.btn, this.btnClicked.bind(this));
    },

    start () {
        
    },

    //点击按钮
    btnClicked(){
        Game.AudioManager.PlayBtnSound();

       if(this.curState == PropView.State.InvateState){
            WXHelper.ForHelpFriendShare();
       }else if(this.curState == PropView.State.WaitReceiveState){
            this.receiveProp();
       }else if(this.curState == PropView.State.ReceivedState){

       }
    },

    initView(curState, uid1, uid2){
        this.curState = curState;

        if(this.curState == PropView.State.InvateState){
            if(arguments.length == 2){
                var headUrl = Game.SharePlayerMgr.getHeadURL(uid1);
                Util.LoadHeadImg(this.headNode[0], headUrl);
            }
        }else if(this.curState == PropView.State.WaitReceiveState || this.curState == PropView.State.ReceivedState){
            if(arguments.length == 3){
                var headUrl1 = Game.SharePlayerMgr.getHeadURL(uid1);
                var headUrl2 = Game.SharePlayerMgr.getHeadURL(uid2);
                Util.LoadHeadImg(this.headNode[0], headUrl1);
                Util.LoadHeadImg(this.headNode[1], headUrl2);

                this.uid1 = uid1;
                this.uid2 = uid2;
            }
        }

       this.updateView();
    },

    updateView(){
        if(this.curState == PropView.State.InvateState){
            Util.SetNodeTexture(this.btn, "resources/gamescene/invite.png")
        }else if(this.curState == PropView.State.ReceivedState){
            Util.SetNodeTexture(this.btn, "resources/gamescene/yiling.png")
        }else if(this.curState == PropView.State.WaitReceiveState){
            Util.SetNodeTexture(this.btn, "resources/gamescene/receive.png")
        }
    },

    //领取
    receiveProp(){
        this.curState = PropView.State.ReceivedState;

        this.updateView();

        Game.EventCenter.DispatchEvent(Game.MessageType.ReceiveProp_Event, {
            uid1: this.uid1,
            uid2: this.uid2,
        });
    }
    // update (dt) {},
});
