var hexagonType = require("HexagonType");

cc.Class({
    extends: cc.Component,

    properties: {

    },

    type: null,

    id: null,

    checkTag: null,

    isSynthesiNode: null,

    isPriorityCheck: null,

    isCanPlace: null,  //是否可以放置

    canPlaceGridID: null,

    ctor () {
        this.init();
    },

    init(){
        this.type = 0;
        this.id = 0;
        this.canPlaceGridID = 0;
        this.checkTag = false;
        this.isSynthesiNode = false;
        this.isPriorityCheck = false;
        this.isCanPlace = false;
    },

    start () {
    },

    setIsCanPlace(value){
        this.isCanPlace = value;
    },

    setCanPlaceGridID(value){
        this.canPlaceGridID = value;
    },

    setType(type){
        this.type = type;
    },

    setID(id){
        this.id = id;
    },

    setCheckTag(tag){
        this.checkTag = tag;
    },

    setIsSynthesiNode(value){
        this.isSynthesiNode = value;
    },

    setIsPriorityCheck(value){
        this.isPriorityCheck = value;
    },

    getCanPlaceGridID(){
        return this.canPlaceGridID;
    },

    getIsCanPlace(){
        return this.isCanPlace;
    },

    getIsPriorityCheck(value){
        return this.isPriorityCheck;
    },

    getCheckTag(){
        return this.checkTag;
    },

    getIsSynthesiNode(){
        return this.isSynthesiNode;
    },

    getType(){
        return this.type;
    },

    getID(){
        return this.id;
    }
    // update (dt) {},
});
