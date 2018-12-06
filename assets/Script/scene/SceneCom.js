var BaseCom = require("BaseCom");

cc.Class({
    extends: BaseCom,

    doCtor(){
        cc.log(this.name, "------------->>>doCtor");
    },

    doEnter(){
        cc.log(this.name, "------------->>>doEnter");
        
        this._super();

        this.node.active = true;
    },

    doExit(){
        cc.log(this.name, "------------->>>doExit");

        this._super();

        this.node.x = 0;
        this.node.y = 0;

        this.node.active = false;

        this.node.stopAllActions();
    },

    frameOnMove(dt){
    },
});
