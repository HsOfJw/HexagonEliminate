var Util = require("Util");

cc.Class({
    extends: cc.Component,

    clickEventList: null,

    // dynamicComList: null,

    onDestroy(){
        this.doExit();
    },

    doCtor(){

    },

    doEnter(){
        this.clickEventList = [];
    },

    doExit(){

        if(this.clickEventList){
            for(var i = 0;i < this.clickEventList.length; i ++){
                Util.CancelClickEvent(this.clickEventList[i]);
            }
            this.clickEventList.length = 0;
            this.clickEventList = null;
        }

        Game.EventCenter.RemoveEvent(this.uuid);
    },

    addDynamicComponent(node, component){
    },

    registerEvent(key, callback){
        Game.EventCenter.RegisterEvent(this.uuid, key, callback);
    },

    dispatchEvent(key, value){
        Game.EventCenter.DispatchEvent(key, value);
    },

    dispatchEventSync(key, value){
        Game.EventCenter.DispatchEventSync(key, value);
    },

    registerClickEvent(target, callback){
        if(target){
            Util.RegBtnClickEvent(target, callback);
            this.clickEventList.push(target);
        }
    },

    removeClickEvent(node){
        for(var i = 0;i < this.clickEventList.length; i ++){
            if(this.clickEventList[i] == node){
                this.clickEventList.splice(i, 0);
                Util.CancelClickEvent(node);
            }
        }

    },

    frameOnMove(dt){
    },

    // update (dt) {},
});
