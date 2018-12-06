
cc.Class({
    extends: cc.Node,

    myChangedDirtyFlag : null,
    myDeleteDirtyFlag : null,

    ctor(){
        this.setName("BaseNode");

        this.myChangedDirtyFlag = false;
        this.myDeleteDirtyFlag = false;
    },

    setMyChangedDirtyFlag(dirtyFlag){
        this.myChangedDirtyFlag = dirtyFlag;
    },

    setMyDeleteDirtyFlag(dirtyFlag){
        this.myDeleteDirtyFlag = dirtyFlag;
    },

    doEnter(){

    },

    doExit(){

    },
});
