var Util = require("Util");
cc.Class({
    extends: cc.Component,

    properties: {

    },

    onLoad () {
        Util.RegBtnTouchBeginEvent(this.node, this.maskLayerClicked.bind(this));
    },

    start () {

    },

    maskLayerClicked(){
        return false;
    },

    // update (dt) {},
});
